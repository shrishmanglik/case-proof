import { createHash } from "node:crypto";
import { issueCodes, labels, syntheticFixtures } from "./fixtures";
import { requirementIds, type ControlReceipt, type DetectorDecision, type DetectorId, type ProofSuiteReceipt, type SyntheticFixture } from "./types";

type Detector = (input: Record<string, unknown>) => boolean;

const list = (value: unknown) => Array.isArray(value) && value.length > 0;
const text = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const truthy = (value: unknown) => value === true;

const detectors: Record<DetectorId, Detector> = {
  "DET-CP-R1": (i) => text(i.outcome) && list(i.owners) && text(i.boundary) && list(i.exclusions) && text(i.stopAuthority),
  "DET-CP-R2": (i) => text(i.goalVersion) && text(i.storyVersion) && text(i.rationale) && text(i.scopeDigest),
  "DET-CP-R3": (i) => text(i.userIncrement) && text(i.learningObjective) && list(i.dependencies) && list(i.exclusions),
  "DET-CP-R4": (i) => text(i.userOutcome) && list(i.preconditions) && list(i.acceptanceCriteria) && list(i.edgeCases) && text(i.failureBehavior) && text(i.telemetry) && Array.isArray(i.reviewers) && i.reviewers.length >= 2,
  "DET-CP-R5": (i) => text(i.owner) && text(i.requiredBy) && ["BLOCKED", "AT_RISK", "RESOLVED"].includes(String(i.state)) && text(i.evidence) && text(i.escalation) && text(i.forecastEffect),
  "DET-CP-R6": (i) => truthy(i.synthetic) && truthy(i.purposeBound) && i.aiAllowed === false && truthy(i.approved) && i.dataClass === "synthetic-notification-metadata",
  "DET-CP-R7": (i) => truthy(i.sourceLinked) && truthy(i.uncertaintyLabelled) && truthy(i.humanAccepted) && i.executable === false,
  "DET-CP-R8": (i) => truthy(i.badFixtureRejected) && truthy(i.cleanFixturePassed) && truthy(i.detectorHealthy) && truthy(i.userVisibleVerified) && truthy(i.repeatedDigestMatch),
  "DET-CP-R9": (i) => text(i.artifactDigest) && list(i.acceptanceReceipts) && text(i.cohort) && text(i.observability) && text(i.rollbackPlan) && text(i.rollbackAuthority) && text(i.reconciliationProof),
  "DET-CP-R10": (i) => truthy(i.approvedNotes) && truthy(i.trainingComplete) && truthy(i.entitlementVerified) && truthy(i.supportReady) && list(i.limitations) && truthy(i.rollbackReady),
  "DET-CP-R11": (i) => Number(i.expectedCount) > 0 && Number(i.expectedCount) === Number(i.observedCount) && truthy(i.collectorHealthy) && Number(i.missing) === 0 && Number(i.duplicates) === 0 && Number(i.delayed) === 0 && truthy(i.userVisibleVerified),
  "DET-CP-R12": (i) => Number(i.collectedRevenue) > 0 && Number(i.observedCost) >= 0 && text(i.acceptedValueEvidence) && truthy(i.nonBuilderOperated) && truthy(i.recoveryProven) && ["REPEAT", "EXPAND", "PARK", "KILL"].includes(String(i.authorizedDecision)),
};

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stableValue(item)]));
  }
  return value;
}

export function stableDigest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function evaluate(fixture: SyntheticFixture, disabled: Set<DetectorId>): DetectorDecision {
  const trace = [`fixture:${fixture.id}`, `rule:${fixture.detectorId}@1.0.0`, "source:synthetic-fixture.v1"];
  if (disabled.has(fixture.detectorId)) {
    const payload = { detectorId: fixture.detectorId, decision: "BLOCKED", issueCode: "DETECTOR_UNAVAILABLE", trace };
    return { ...payload, detectorVersion: "1.0.0", decision: "BLOCKED", unresolvedUnknowns: ["Detector execution health is unavailable."], evidenceDigest: stableDigest(payload) };
  }

  const passed = detectors[fixture.detectorId](fixture.input);
  const decision = passed ? "PASS" : "REJECT";
  const issueCode = passed ? undefined : issueCodes[fixture.requirementId];
  const payload = { detectorId: fixture.detectorId, decision, issueCode, trace, inputDigest: stableDigest(fixture.input) };
  return { detectorId: fixture.detectorId, detectorVersion: "1.0.0", decision, issueCode, trace, unresolvedUnknowns: [], evidenceDigest: stableDigest(payload) };
}

export function runProofSuite(options: { disabledDetectors?: DetectorId[] } = {}): ProofSuiteReceipt {
  const disabled = new Set(options.disabledDetectors ?? []);
  const controls = requirementIds.map((requirementId) => {
    const bad = syntheticFixtures.find((fixture) => fixture.requirementId === requirementId && fixture.kind === "KNOWN_BAD");
    const clean = syntheticFixtures.find((fixture) => fixture.requirementId === requirementId && fixture.kind === "CLEAN");
    if (!bad || !clean) throw new Error(`Fixture pair missing for ${requirementId}`);

    const firstBad = evaluate(bad, disabled);
    const firstClean = evaluate(clean, disabled);
    const secondBad = evaluate(bad, disabled);
    const secondClean = evaluate(clean, disabled);
    const firstRunDigest = stableDigest({ firstBad, firstClean });
    const secondRunDigest = stableDigest({ firstBad: secondBad, firstClean: secondClean });
    const status: ControlReceipt["status"] = firstBad.decision === bad.expectedDecision && firstBad.issueCode === bad.expectedIssueCode && firstClean.decision === clean.expectedDecision && firstRunDigest === secondRunDigest ? "HEALTHY" : "UNHEALTHY";
    return { requirementId, detectorId: `DET-${requirementId}` as DetectorId, label: labels[requirementId], status, badDecision: firstBad, cleanDecision: firstClean, firstRunDigest, secondRunDigest, repeatable: firstRunDigest === secondRunDigest };
  });
  const healthyCount = controls.filter((control) => control.status === "HEALTHY").length;
  const receiptBase = { receiptVersion: "caseproof.proof-suite.v1" as const, fixtureClassification: "SYNTHETIC_ONLY" as const, status: healthyCount === controls.length ? "HEALTHY" as const : "UNHEALTHY" as const, controls, healthyCount, totalCount: controls.length, disabledDetectors: [...disabled].sort(), authorityBoundary: "Deterministic controls advise; named humans own safety, readiness, release, rollback, and commercial decisions." };
  return { ...receiptBase, suiteDigest: stableDigest(receiptBase) };
}

export function criticalMutationReceipt() {
  const mutated = runProofSuite({ disabledDetectors: ["DET-CP-R4"] });
  const restored = runProofSuite();
  return {
    detectorId: "DET-CP-R4" as const,
    mutationCaught: mutated.status === "UNHEALTHY" && mutated.controls.find((control) => control.requirementId === "CP-R4")?.status === "UNHEALTHY",
    restoredHealthy: restored.status === "HEALTHY",
    mutatedDigest: mutated.suiteDigest,
    restoredDigest: restored.suiteDigest,
  };
}
