import type { RequirementId, SyntheticFixture } from "./types";

const issueCodes: Record<RequirementId, string> = {
  "CP-R1": "INITIATIVE_AUTHORITY_OR_SCOPE_MISSING",
  "CP-R2": "GOAL_TO_STORY_TRACEABILITY_MISSING",
  "CP-R3": "VERTICAL_SLICE_CONTRACT_INVALID",
  "CP-R4": "STORY_READINESS_INCOMPLETE",
  "CP-R5": "DEPENDENCY_CONTROL_INCOMPLETE",
  "CP-R6": "RESTRICTED_DATA_OR_AUTHORITY_VIOLATION",
  "CP-R7": "AI_AUTHORITY_BOUNDARY_VIOLATION",
  "CP-R8": "ACCEPTANCE_OR_DETECTOR_HEALTH_INVALID",
  "CP-R9": "RELEASE_OR_ROLLBACK_CONTRACT_INVALID",
  "CP-R10": "ROLLOUT_OR_ENABLEMENT_NOT_READY",
  "CP-R11": "POST_RELEASE_RECONCILIATION_INVALID",
  "CP-R12": "COMMERCIAL_OR_HANDOFF_EVIDENCE_MISSING",
};

const labels: Record<RequirementId, string> = {
  "CP-R1": "Initiative authority and scope",
  "CP-R2": "Goal-to-story traceability",
  "CP-R3": "Vertical-slice decomposition",
  "CP-R4": "Story readiness",
  "CP-R5": "Dependency and blocker control",
  "CP-R6": "Safety and privacy boundary",
  "CP-R7": "Bounded AI proposal",
  "CP-R8": "Acceptance and detector health",
  "CP-R9": "Release and rollback",
  "CP-R10": "Rollout and enablement",
  "CP-R11": "Post-release reconciliation",
  "CP-R12": "Commercial and handoff gate",
};

const fixtureInputs: Record<RequirementId, { bad: Record<string, unknown>; good: Record<string, unknown> }> = {
  "CP-R1": {
    bad: { outcome: "", owners: [], boundary: "", exclusions: [], stopAuthority: "" },
    good: { outcome: "Notification recipients can see a retry-safe status", owners: ["product", "engineering", "safety"], boundary: "Synthetic notification-status slice", exclusions: ["production writes", "clinical decisions"], stopAuthority: "release-owner" },
  },
  "CP-R2": {
    bad: { goalVersion: "", storyVersion: "story-v1", rationale: "", scopeDigest: "" },
    good: { goalVersion: "goal-v3", storyVersion: "story-v1", rationale: "Expose delivery state without inferring receipt", scopeDigest: "sha256:synthetic-scope-v3" },
  },
  "CP-R3": {
    bad: { userIncrement: "", learningObjective: "", dependencies: "unknown", exclusions: [] },
    good: { userIncrement: "Show a synthetic delivery status and recovery action", learningObjective: "Can the operator distinguish delayed from missing?", dependencies: ["event-manifest-v1"], exclusions: ["provider delivery", "production telemetry"] },
  },
  "CP-R4": {
    bad: { userOutcome: "Delivery status", preconditions: [], acceptanceCriteria: ["page loads"], edgeCases: [], failureBehavior: "", telemetry: "", reviewers: [] },
    good: { userOutcome: "Operator distinguishes delivered, delayed, and missing events", preconditions: ["accepted initiative", "synthetic manifest"], acceptanceCriteria: ["known-bad rejected", "clean fixture accepted"], edgeCases: ["zero events", "duplicate event", "collector unavailable"], failureBehavior: "Hold release and preserve last accepted state", telemetry: "Expected and observed counts with collector health", reviewers: ["product-owner", "engineering-reviewer"] },
  },
  "CP-R5": {
    bad: { owner: "", requiredBy: "", state: "UNKNOWN", evidence: "", escalation: "", forecastEffect: "" },
    good: { owner: "integration-owner", requiredBy: "2026-08-08", state: "BLOCKED", evidence: "synthetic-adapter-receipt", escalation: "release-owner", forecastEffect: "Story held from commitment" },
  },
  "CP-R6": {
    bad: { dataClass: "resident-health-video", synthetic: false, purposeBound: false, aiAllowed: true, approved: false },
    good: { dataClass: "synthetic-notification-metadata", synthetic: true, purposeBound: true, aiAllowed: false, approved: true },
  },
  "CP-R7": {
    bad: { proposal: "Release this clinical interpretation", sourceLinked: false, uncertaintyLabelled: false, humanAccepted: false, executable: true },
    good: { proposal: "Consider adding a delayed-event edge case", sourceLinked: true, uncertaintyLabelled: true, humanAccepted: true, executable: false },
  },
  "CP-R8": {
    bad: { badFixtureRejected: false, cleanFixturePassed: true, detectorHealthy: false, userVisibleVerified: false, repeatedDigestMatch: false },
    good: { badFixtureRejected: true, cleanFixturePassed: true, detectorHealthy: true, userVisibleVerified: true, repeatedDigestMatch: true },
  },
  "CP-R9": {
    bad: { artifactDigest: "", acceptanceReceipts: [], cohort: "", observability: "", rollbackPlan: "", rollbackAuthority: "", reconciliationProof: "" },
    good: { artifactDigest: "sha256:synthetic-release", acceptanceReceipts: ["proof-suite-v1"], cohort: "synthetic-cohort-a", observability: "manifest-v1", rollbackPlan: "rollback-v1", rollbackAuthority: "release-owner", reconciliationProof: "dry-run-restored" },
  },
  "CP-R10": {
    bad: { approvedNotes: false, trainingComplete: false, entitlementVerified: false, supportReady: false, limitations: [], rollbackReady: false },
    good: { approvedNotes: true, trainingComplete: true, entitlementVerified: true, supportReady: true, limitations: ["synthetic mode only"], rollbackReady: true },
  },
  "CP-R11": {
    bad: { expectedCount: 12, observedCount: 0, collectorHealthy: false, missing: 0, duplicates: 0, delayed: 0, userVisibleVerified: false },
    good: { expectedCount: 12, observedCount: 12, collectorHealthy: true, missing: 0, duplicates: 0, delayed: 0, userVisibleVerified: true },
  },
  "CP-R12": {
    bad: { collectedRevenue: 0, observedCost: null, acceptedValueEvidence: "", nonBuilderOperated: false, recoveryProven: false, authorizedDecision: "" },
    good: { collectedRevenue: 30000, observedCost: 12875, acceptedValueEvidence: "signed-synthetic-contract-fixture", nonBuilderOperated: true, recoveryProven: true, authorizedDecision: "REPEAT" },
  },
};

export const syntheticFixtures: SyntheticFixture[] = Object.entries(fixtureInputs).flatMap(([id, values]) => {
  const requirementId = id as RequirementId;
  return [
    {
      id: `${requirementId}-BAD`,
      requirementId,
      detectorId: `DET-${requirementId}`,
      kind: "KNOWN_BAD",
      label: labels[requirementId],
      input: values.bad,
      expectedDecision: "REJECT",
      expectedIssueCode: issueCodes[requirementId],
    },
    {
      id: `${requirementId}-GOOD`,
      requirementId,
      detectorId: `DET-${requirementId}`,
      kind: "CLEAN",
      label: labels[requirementId],
      input: values.good,
      expectedDecision: "PASS",
    },
  ];
});

export { issueCodes, labels };
