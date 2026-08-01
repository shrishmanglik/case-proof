import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(resolve(process.cwd(), "supabase/migrations/0001_caseproof_core.sql"), "utf8");
const tables = [...sql.matchAll(/create table public\.(cp_[a-z_]+)/gi)].map((match) => match[1]);
const tenantQualifiedRelationships = [
  "constraint cp_initiatives_stop_authority_membership_fk foreign key (tenant_id, stop_authority_id) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_initiatives_creator_membership_fk foreign key (tenant_id, created_by) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_stories_initiative_tenant_fk foreign key (tenant_id, initiative_id) references public.cp_initiatives(tenant_id, id)",
  "constraint cp_stories_creator_membership_fk foreign key (tenant_id, created_by) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_dependencies_initiative_tenant_fk foreign key (tenant_id, initiative_id) references public.cp_initiatives(tenant_id, id)",
  "constraint cp_dependencies_owner_membership_fk foreign key (tenant_id, owner_id) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_proof_runs_initiative_tenant_fk foreign key (tenant_id, initiative_id) references public.cp_initiatives(tenant_id, id)",
  "constraint cp_proof_runs_executor_membership_fk foreign key (tenant_id, executed_by) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_evidence_initiative_tenant_fk foreign key (tenant_id, initiative_id) references public.cp_initiatives(tenant_id, id)",
  "constraint cp_evidence_proof_tenant_fk foreign key (tenant_id, initiative_id, proof_run_id) references public.cp_proof_runs(tenant_id, initiative_id, id)",
  "constraint cp_evidence_creator_membership_fk foreign key (tenant_id, created_by) references public.cp_memberships(tenant_id, user_id)",
  "constraint cp_audit_actor_membership_fk foreign key (tenant_id, actor_id) references public.cp_memberships(tenant_id, user_id)",
];

function hasTenantQualifiedRelationships(source: string) {
  const normalized = source.toLowerCase();
  return tenantQualifiedRelationships.every((relationship) => normalized.includes(relationship));
}

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

  it("binds every relational join to the tenant that owns both records", () => {
    expect(hasTenantQualifiedRelationships(sql)).toBe(true);
    expect(sql.toLowerCase()).toContain("unique (tenant_id, id)");
    expect(sql.toLowerCase()).toContain("unique (tenant_id, initiative_id, id)");
  });

  it.each(tenantQualifiedRelationships)("fails the schema contract when tenant scope is removed from %s", (relationship) => {
    const crossTenantMutation = sql.toLowerCase().replace(relationship, relationship.replace("foreign key (tenant_id, ", "foreign key ("));
    expect(hasTenantQualifiedRelationships(crossTenantMutation)).toBe(false);
  });
});
