import { NextResponse } from "next/server";
import { z } from "zod";
import { runProofSuite } from "@/domain/control-engine";
import { requirementIds, type DetectorId } from "@/domain/types";

export const runtime = "nodejs";

const detectorIds = requirementIds.map((id) => `DET-${id}`) as [DetectorId, ...DetectorId[]];
const requestSchema = z.object({
  mode: z.enum(["RESTORED", "DISABLED"]).default("RESTORED"),
  detectorId: z.enum(detectorIds).optional(),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "MALFORMED_REQUEST", message: "A typed proof-run request is required.", details: parsed.error.flatten() } }, { status: 400 });
  }
  if (parsed.data.mode === "DISABLED" && !parsed.data.detectorId) {
    return NextResponse.json({ error: { code: "MALFORMED_REQUEST", message: "detectorId is required for a disabled-detector run." } }, { status: 400 });
  }
  const disabled = parsed.data.mode === "DISABLED" ? [parsed.data.detectorId as DetectorId] : [];
  return NextResponse.json({ data: runProofSuite({ disabledDetectors: disabled }), boundary: { persistence: "SYNTHETIC_IN_MEMORY", providerTruth: "UNKNOWN", externalEffects: "NONE" } });
}
