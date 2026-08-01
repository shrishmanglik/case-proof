import { describe, expect, it } from "vitest";
import { criticalMutationReceipt, runProofSuite, stableDigest } from "./control-engine";
import { requirementIds } from "./types";

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
});
