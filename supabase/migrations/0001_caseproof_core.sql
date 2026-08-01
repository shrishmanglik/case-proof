-- CaseProof core evidence store.
-- STATUS: proposed and locally inspected; NOT applied to any Supabase project.
-- All application tables enable RLS. No service-role bypass is used by product code.

create extension if not exists pgcrypto;

create table public.cp_tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  created_at timestamptz not null default now()
);

create table public.cp_memberships (
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('product_owner', 'engineering_lead', 'safety_authority', 'release_authority', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.cp_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  direction_version text not null,
  target_user text not null,
  intended_outcome text not null,
  boundary text not null,
  exclusions jsonb not null default '[]'::jsonb check (jsonb_typeof(exclusions) = 'array'),
  risk_class text not null check (risk_class in ('LOW', 'MODERATE', 'HIGH')),
  stop_authority_id uuid not null references auth.users(id),
  status text not null default 'DRAFT' check (status in ('DRAFT', 'BLOCKED', 'ADMITTED', 'IN_DELIVERY', 'RELEASED', 'ROLLED_BACK', 'CLOSED', 'SUPERSEDED')),
  entity_version integer not null default 1 check (entity_version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cp_stories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  initiative_id uuid not null references public.cp_initiatives(id) on delete cascade,
  story_version text not null,
  user_outcome text not null,
  acceptance_criteria jsonb not null check (jsonb_typeof(acceptance_criteria) = 'array'),
  edge_cases jsonb not null check (jsonb_typeof(edge_cases) = 'array'),
  failure_behavior text not null,
  telemetry_contract text not null,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'HELD', 'READY', 'REJECTED', 'SUPERSEDED')),
  entity_version integer not null default 1 check (entity_version > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cp_dependencies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  initiative_id uuid not null references public.cp_initiatives(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  required_by date not null,
  state text not null check (state in ('IDENTIFIED', 'BLOCKED', 'AT_RISK', 'RESOLVED', 'UNKNOWN', 'SUPERSEDED')),
  evidence_digest text not null,
  escalation_path text not null,
  forecast_effect text not null,
  entity_version integer not null default 1 check (entity_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cp_proof_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  initiative_id uuid not null references public.cp_initiatives(id) on delete cascade,
  suite_version text not null,
  fixture_set_digest text not null,
  suite_digest text not null,
  status text not null check (status in ('HEALTHY', 'UNHEALTHY', 'HELD')),
  disabled_detectors jsonb not null default '[]'::jsonb check (jsonb_typeof(disabled_detectors) = 'array'),
  executed_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.cp_evidence_receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  initiative_id uuid not null references public.cp_initiatives(id) on delete cascade,
  proof_run_id uuid references public.cp_proof_runs(id) on delete restrict,
  record_type text not null,
  record_version text not null,
  provenance text not null check (provenance in ('IMPORTED', 'CALCULATED', 'MODEL_PROPOSED', 'HUMAN_CONFIRMED', 'APPROVED', 'REJECTED', 'SUPERSEDED')),
  evidence_digest text not null,
  payload jsonb not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.cp_audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.cp_tenants(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before_digest text,
  after_digest text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.cp_tenants enable row level security;
alter table public.cp_memberships enable row level security;
alter table public.cp_initiatives enable row level security;
alter table public.cp_stories enable row level security;
alter table public.cp_dependencies enable row level security;
alter table public.cp_proof_runs enable row level security;
alter table public.cp_evidence_receipts enable row level security;
alter table public.cp_audit_events enable row level security;

create policy "members read own membership" on public.cp_memberships for select using (user_id = auth.uid());
create policy "members read tenant" on public.cp_tenants for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = id and m.user_id = auth.uid()));

create policy "members read initiatives" on public.cp_initiatives for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_initiatives.tenant_id and m.user_id = auth.uid()));
create policy "product roles create initiatives" on public.cp_initiatives for insert with check (created_by = auth.uid() and exists (select 1 from public.cp_memberships m where m.tenant_id = cp_initiatives.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead')));
create policy "product roles update initiatives" on public.cp_initiatives for update using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_initiatives.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead', 'release_authority'))) with check (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_initiatives.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead', 'release_authority')));

create policy "members read stories" on public.cp_stories for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_stories.tenant_id and m.user_id = auth.uid()));
create policy "product roles create stories" on public.cp_stories for insert with check (created_by = auth.uid() and exists (select 1 from public.cp_memberships m where m.tenant_id = cp_stories.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead')));
create policy "product roles update stories" on public.cp_stories for update using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_stories.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead'))) with check (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_stories.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead')));

create policy "members read dependencies" on public.cp_dependencies for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_dependencies.tenant_id and m.user_id = auth.uid()));
create policy "delivery roles create dependencies" on public.cp_dependencies for insert with check (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_dependencies.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead')));
create policy "delivery roles update dependencies" on public.cp_dependencies for update using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_dependencies.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead'))) with check (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_dependencies.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead')));

create policy "members read proof runs" on public.cp_proof_runs for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_proof_runs.tenant_id and m.user_id = auth.uid()));
create policy "authorized roles append proof runs" on public.cp_proof_runs for insert with check (executed_by = auth.uid() and exists (select 1 from public.cp_memberships m where m.tenant_id = cp_proof_runs.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead', 'safety_authority', 'release_authority')));

create policy "members read evidence" on public.cp_evidence_receipts for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_evidence_receipts.tenant_id and m.user_id = auth.uid()));
create policy "authorized roles append evidence" on public.cp_evidence_receipts for insert with check (created_by = auth.uid() and exists (select 1 from public.cp_memberships m where m.tenant_id = cp_evidence_receipts.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead', 'safety_authority', 'release_authority')));

create policy "members read audit events" on public.cp_audit_events for select using (exists (select 1 from public.cp_memberships m where m.tenant_id = cp_audit_events.tenant_id and m.user_id = auth.uid()));
create policy "authorized roles append audit events" on public.cp_audit_events for insert with check (actor_id = auth.uid() and exists (select 1 from public.cp_memberships m where m.tenant_id = cp_audit_events.tenant_id and m.user_id = auth.uid() and m.role in ('product_owner', 'engineering_lead', 'safety_authority', 'release_authority')));

revoke update, delete on public.cp_proof_runs, public.cp_evidence_receipts, public.cp_audit_events from authenticated, anon;

comment on schema public is 'CaseProof migration is source-only until separately authorized provider application.';
