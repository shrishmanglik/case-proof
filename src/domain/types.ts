export const requirementIds = [
  "CP-R1",
  "CP-R2",
  "CP-R3",
  "CP-R4",
  "CP-R5",
  "CP-R6",
  "CP-R7",
  "CP-R8",
  "CP-R9",
  "CP-R10",
  "CP-R11",
  "CP-R12",
] as const;

export type RequirementId = (typeof requirementIds)[number];
export type DetectorId = `DET-${RequirementId}`;
export type ControlDecision = "PASS" | "REJECT" | "BLOCKED";

export interface SyntheticFixture {
  id: `${RequirementId}-${"BAD" | "GOOD"}`;
  requirementId: RequirementId;
  detectorId: DetectorId;
  kind: "KNOWN_BAD" | "CLEAN";
  label: string;
  input: Record<string, unknown>;
  expectedDecision: Exclude<ControlDecision, "BLOCKED">;
  expectedIssueCode?: string;
}

export interface DetectorDecision {
  detectorId: DetectorId;
  detectorVersion: "1.1.0";
  decision: ControlDecision;
  issueCode?: string;
  trace: string[];
  unresolvedUnknowns: string[];
  evidenceDigest: string;
}

export interface ControlReceipt {
  requirementId: RequirementId;
  detectorId: DetectorId;
  label: string;
  status: "HEALTHY" | "UNHEALTHY";
  badDecision: DetectorDecision;
  cleanDecision: DetectorDecision;
  firstRunDigest: string;
  secondRunDigest: string;
  repeatable: boolean;
}

export interface ProofSuiteReceipt {
  receiptVersion: "caseproof.proof-suite.v1";
  fixtureClassification: "SYNTHETIC_ONLY";
  status: "HEALTHY" | "UNHEALTHY";
  controls: ControlReceipt[];
  healthyCount: number;
  totalCount: number;
  suiteDigest: string;
  disabledDetectors: DetectorId[];
  authorityBoundary: string;
}

export interface ProductInitiative {
  initiativeId: string;
  directionVersion: string;
  targetUser: string;
  intendedOutcome: string;
  initiativeBoundary: string;
  exclusions: string[];
  productManagerId: string;
  productOwnerId: string;
  engineeringLeadId: string;
  safetyAuthorityId: string;
  stopAuthorityId: string;
  riskClass: "LOW" | "MODERATE" | "HIGH";
  status: "DRAFT" | "BLOCKED" | "ADMITTED";
}
