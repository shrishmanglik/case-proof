# ADR-0001: Deterministic evidence spine

- Status: accepted for the initial local vertical
- Scope: `dev/case-proof-initial-build`
- Authority: delegated Development Studio build order

## Context

The product must demonstrate a complete, inspectable workflow without using employer data, fabricated outcomes, provider credentials, or runtime AI authority. It must prove negative controls, repeatability, mutation health, and recovery locally.

## Options

1. Build a presentation-only dashboard. Rejected: it cannot prove domain behaviour and would be prototype theatre.
2. Require live Supabase and third-party integrations. Rejected for the initial vertical: provider mutation and credentials are outside authority and would prevent fresh-clone proof.
3. Run a provider-independent deterministic spine with a source-only RLS schema. Selected: it delivers a real workflow and API while keeping provider truth explicit.

## Decision

Use typed synthetic fixtures and pure deterministic detectors behind a Next.js route. Emit canonical SHA-256 receipts. Keep the human decision separate from detector output. Include a proposed Supabase migration with RLS for every table, but do not apply it.

## Consequences

- Fresh clones run without secrets.
- The product demonstrates controls, not production durability.
- Auth, live persistence, adapters, availability, and commercial operation remain proposed or UNKNOWN.
- The next provider-backed slice requires separate authority and independent security review.

## Rollback

Revert this ADR and initial build commit. No provider or customer state exists to reconcile.
