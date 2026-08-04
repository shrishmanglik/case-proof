import { expect, test } from "vitest";
import { runProofSuite } from "./control-engine";
import type { DetectorId } from "./types";

test("release control gate is healthy", () => {
  const disabled = process.env.CASEPROOF_DISABLE_DETECTOR as DetectorId | undefined;
  const result = runProofSuite({ disabledDetectors: disabled ? [disabled] : [] });
  expect(result.status, `proof gate unhealthy; disabled=${disabled ?? "none"}; digest=${result.suiteDigest}`).toBe("HEALTHY");
});
