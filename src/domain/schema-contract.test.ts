import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(resolve(process.cwd(), "supabase/migrations/0001_caseproof_core.sql"), "utf8");
const tables = [...sql.matchAll(/create table public\.(cp_[a-z_]+)/gi)].map((match) => match[1]);

describe("Supabase source schema", () => {
  it("enables RLS on every application table", () => {
    expect(tables).toHaveLength(8);
    for (const table of tables) expect(sql.toLowerCase()).toContain(`alter table public.${table} enable row level security`);
  });

  it("provides at least one tenant-scoped policy per table", () => {
    for (const table of tables) expect(sql.toLowerCase()).toMatch(new RegExp(`create policy [\\s\\S]+ on public\\.${table}`));
  });

  it("keeps evidence, proof, and audit records append-only for browser roles", () => {
    expect(sql.toLowerCase()).toContain("revoke update, delete on public.cp_proof_runs, public.cp_evidence_receipts, public.cp_audit_events from authenticated, anon");
  });
});
