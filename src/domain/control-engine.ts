import { createHash } from "node:crypto";
import { issueCodes, labels, syntheticFixtures } from "./fixtures";
import { requirementIds, type ControlReceipt, type DetectorDecision, type DetectorId, type ProofSuiteReceipt, type SyntheticFixture } from "./types";

type Detector = (input: Record<string, unknown>) => boolean;

const text = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const textList = (value: unknown) => Array.isArray(value) && value.length > 0 && value.every(text);
const distinctTextList = (value: unknown, minimum: number) => {
  if (!Array.isArray(value) || value.length < minimum || !value.every(text)) return false;
  return new Set(value.map((item) => (item as string).trim().toLocaleLowerCase("en-US"))).size >= minimum;
};
const truthy = (value: unknown) => value === true;
const nonNegativeInteger = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const positiveInteger = (value: unknown) => nonNegativeInteger(value) && value > 0;
const nonNegativeNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const positiveNumber = (value: unknown) => nonNegativeNumber(value) && value > 0;
const detectorVersion = "1.1.0" as const;

const detectors: Record<DetectorId, Detector> = {
  "DET-CP-R1": (i) => text(i.outcome) && textList(i.owners) && text(i.boundary) && textList(i.exclusions) && text(i.stopAuthority),
  "DET-CP-R2": (i) => text(i.goalVersion) && text(i.storyVersion) && text(i.rationale) && text(i.scopeDigest),
  "DET-CP-R3": (i) => text(i.userIncrement) && text(i.learningObjective) && textList(i.dependencies) && textList(i.exclusions),
  "DET-CP-R4": (i) => text(i.userOutcome) && textList(i.preconditions) && textList(i.acceptanceCriteria) && textList(i.edgeCases) && text(i.failureBehavior) && text(i.telemetry) && distinctTextList(i.reviewers, 2),
  "DET-CP-R5": (i) => text(i.owner) && text(i.requiredBy) && ["BLOCKED", "AT_RISK", "RESOLVED"].includes(String(i.state)) && text(i.evidence) && text(i.escalation) && text(i.forecastEffect),
  "DET-CP-R6": (i) => truthy(i.synthetic) && truthy(i.purposeBound) && i.aiAllowed === false && truthy(i.approved) && i.dataClass === "synthetic-notification-metadata",
  "DET-CP-R7": (i) => text(i.proposal) && truthy(i.sourceLinked) && truthy(i.uncertaintyLabelled) && truthy(i.humanAccepted) && i.executable === false,
  "DET-CP-R8": (i) => truthy(i.badFixtureRejected) && truthy(i.cleanFixturePassed) && truthy(i.detectorHealthy) && truthy(i.userVisibleVerified) && truthy(i.repeatedDigestMatch),
  "DET-CP-R9": (i) => text(i.artifactDigest) && textList(i.acceptanceReceipts) && text(i.cohort) && text(i.observability) && text(i.rollbackPlan) && text(i.rollbackAuthority) && text(i.reconciliationProof),
  "DET-CP-R10": (i) => truthy(i.approvedNotes) && truthy(i.trainingComplete) && truthy(i.entitlementVerified) && truthy(i.supportReady) && textList(i.limitations) && truthy(i.rollbackReady),
  "DET-CP-R11": (i) => positiveInteger(i.expectedCount) && nonNegativeInteger(i.observedCount) && i.expectedCount === i.observedCount && truthy(i.collectorHealthy) && i.missing === 0 && i.duplicates === 0 && i.delayed === 0 && truthy(i.userVisibleVerified),
  "DET-CP-R12": (i) => positiveNumber(i.collectedRevenue) && nonNegativeNumber(i.observedCost) && text(i.acceptedValueEvidence) && truthy(i.nonBuilderOperated) && truthy(i.recoveryProven) && ["REPEAT", "EXPAND", "PARK", "KILL"].includes(String(i.authorizedDecision)),
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
  const trace = [`fixture:${fixture.id}`, `rule:${fixture.detectorId}@${detectorVersion}`, "source:synthetic-fixture.v1"];
  if (disabled.has(fixture.detectorId)) {
    const payload = { detectorId: fixture.detectorId, decision: "BLOCKED", issueCode: "DETECTOR_UNAVAILABLE", trace };
    return { ...payload, detectorVersion, decision: "BLOCKED", unresolvedUnknowns: ["Detector execution health is unavailable."], evidenceDigest: stableDigest(payload) };
  }

  const passed = detectors[fixture.detectorId](fixture.input);
  const decision = passed ? "PASS" : "REJECT";
  const issueCode = passed ? undefined : issueCodes[fixture.requirementId];
  const payload = { detectorId: fixture.detectorId, decision, issueCode, trace, inputDigest: stableDigest(fixture.input) };
  return { detectorId: fixture.detectorId, detectorVersion, decision, issueCode, trace, unresolvedUnknowns: [], evidenceDigest: stableDigest(payload) };
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
