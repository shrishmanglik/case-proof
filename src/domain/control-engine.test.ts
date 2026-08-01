import { describe, expect, it } from "vitest";
import { criticalMutationReceipt, runProofSuite, stableDigest } from "./control-engine";
import { syntheticFixtures } from "./fixtures";
import { requirementIds, type RequirementId } from "./types";

function withMutatedCleanFixture(requirementId: RequirementId, input: Record<string, unknown>, assertion: () => void) {
  const fixture = syntheticFixtures.find((candidate) => candidate.requirementId === requirementId && candidate.kind === "CLEAN");
  if (!fixture) throw new Error(`Clean fixture missing for ${requirementId}`);
  const original = fixture.input;
  fixture.input = input;
  try {
    assertion();
  } finally {
    fixture.input = original;
  }
}

describe("CaseProof deterministic controls", () => {
  it("rejects all 12 known-bad fixtures and accepts all 12 clean fixtures", () => {
    const result = runProofSuite();
    expect(result.status).toBe("HEALTHY");
    expect(result.controls).toHaveLength(12);
    expect(result.healthyCount).toBe(12);
    for (const control of result.controls) {
      expect(control.badDecision.decision).toBe("REJECT");
      expect(control.cleanDecision.decision).toBe("PASS");
    }
  });

  it("produces byte-stable normalized receipts across two complete runs", () => {
    const first = runProofSuite();
    const second = runProofSuite();
    expect(first.suiteDigest).toBe(second.suiteDigest);
    expect(stableDigest(first)).toBe(stableDigest(second));
    expect(first.controls.every((control) => control.repeatable)).toBe(true);
  });

  it.each(requirementIds)("catches a disabled %s detector", (requirementId) => {
    const result = runProofSuite({ disabledDetectors: [`DET-${requirementId}`] });
    expect(result.status).toBe("UNHEALTHY");
    expect(result.healthyCount).toBe(11);
  });

  it("fails closed on the critical story-readiness mutation and recovers when restored", () => {
    expect(criticalMutationReceipt()).toMatchObject({ mutationCaught: true, restoredHealthy: true });
  });

  it.each([
    ["CP-R1", { owners: ["product", null] }],
    ["CP-R3", { dependencies: [""] }],
    ["CP-R4", { reviewers: [null, null] }],
    ["CP-R4", { reviewers: ["product-owner", " PRODUCT-OWNER "] }],
    ["CP-R7", { proposal: "" }],
    ["CP-R9", { acceptanceReceipts: [null] }],
    ["CP-R10", { limitations: [""] }],
    ["CP-R11", { observedCount: "12" }],
    ["CP-R11", { missing: null }],
    ["CP-R12", { observedCost: null }],
    ["CP-R12", { collectedRevenue: "30000" }],
  ] as const)("rejects an adjacent-check mutation for %s", (requirementId, mutation) => {
    const fixture = syntheticFixtures.find((candidate) => candidate.requirementId === requirementId && candidate.kind === "CLEAN");
    if (!fixture) throw new Error(`Clean fixture missing for ${requirementId}`);
    withMutatedCleanFixture(requirementId, { ...fixture.input, ...mutation }, () => {
      const result = runProofSuite();
      const control = result.controls.find((candidate) => candidate.requirementId === requirementId);
      expect(control?.cleanDecision.decision).toBe("REJECT");
      expect(control?.status).toBe("UNHEALTHY");
      expect(result.status).toBe("UNHEALTHY");
    });
  });
});
