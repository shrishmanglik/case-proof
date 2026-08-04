import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/v1/proof-runs", () => {
  it("returns a healthy receipt for the restored suite", async () => {
    const response = await POST(new Request("http://caseproof.local/api/v1/proof-runs", { method: "POST", body: JSON.stringify({ mode: "RESTORED" }) }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toMatchObject({ status: "HEALTHY", healthyCount: 12, totalCount: 12 });
    expect(body.boundary.externalEffects).toBe("NONE");
  });

  it("exposes an unhealthy detector receipt when the critical detector is disabled", async () => {
    const response = await POST(new Request("http://caseproof.local/api/v1/proof-runs", { method: "POST", body: JSON.stringify({ mode: "DISABLED", detectorId: "DET-CP-R4" }) }));
    const body = await response.json();
    expect(body.data).toMatchObject({ status: "UNHEALTHY", healthyCount: 11 });
  });

  it("rejects malformed requests without starting a run", async () => {
    const response = await POST(new Request("http://caseproof.local/api/v1/proof-runs", { method: "POST", body: "{}" }));
    expect(response.status).toBe(200);
    const malformed = await POST(new Request("http://caseproof.local/api/v1/proof-runs", { method: "POST", body: JSON.stringify({ mode: "DISABLED" }) }));
    expect(malformed.status).toBe(400);
  });
});
