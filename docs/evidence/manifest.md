# Evidence manifest

Prepared: 2026-08-01 (America/Toronto)

## Authority and source

| Claim | State | Evidence |
|---|---|---|
| Authoritative operating root | VERIFIED | Binding role and autoload canon loaded from the parent-task corrected Tier-1 root |
| Original dispatch root | GAP CORRECTED | Parent-task correction applied; the stale root was not mutated |
| Build blueprint read | VERIFIED | 3,565 lines; SHA-256 `8F55D2A78CB415E066C7B11914266B12148F5AD14F1ACC531F2CBEE3FE83065D` |
| Blueprint was safe to implement publicly | VERIFIED WITH BOUNDARY | It omits raw source statements and explicitly forbids employer, customer, demand, or outcome claims; the blueprint itself is not committed |
| Vedic Astro source reference | VERIFIED LOCAL | Current governed source was inspected read-only for architecture, failure semantics, tests, RLS, and evidence ceilings; no domain code or live-status claim was borrowed |
| Shared product registry currentness | GAP | Registry records disagreed with higher-authority current canon; no live product claim was borrowed |

## Repository preflight

| Claim | State | Evidence |
|---|---|---|
| GitHub repository is public | VERIFIED GITHUB | `gh repo view`: `shrishmanglik/case-proof`, `visibility=PUBLIC`, `isPrivate=false` |
| Clean starting state | VERIFIED LOCAL | Isolated clone on `main@60beff7a8fb3b3ee54752ea436698b5195663969`; `git status` clean before branch creation |
| Task workspace | VERIFIED LOCAL | Isolated task clone on branch `dev/case-proof-initial-build` |
| Collision boundary | VERIFIED LOCAL | Only the CaseProof clone was mutated; source blueprint and governed operating root were read-only |

## Implementation

| Capability | State | Evidence |
|---|---|---|
| Next.js 16 App Router / TypeScript / Tailwind v4 / shadcn-style source components | DONE LOCAL | Production build route inventory includes overview, workspace, proof, records, boundaries, icon, and typed API |
| Typed domain and API boundary | DONE LOCAL | `src/domain/*`; `POST /api/v1/proof-runs` with Zod validation |
| Deterministic control spine | DONE LOCAL | 12 detectors, 12 known-bad fixtures, 12 clean fixtures, stable SHA-256 receipts |
| Human authority | DONE LOCAL | Session-local readiness form; invalid edits revoke prior review state; consequence authority is never automated |
| Supabase design | DONE SOURCE-ONLY | 8 application tables; RLS enabled on every table; tenant/role policies; append-only proof/evidence/audit records |
| Provider schema/auth state | UNKNOWN | Migration not applied; no provider action authorized |
| Runtime AI | NOT IMPLEMENTED | No model dependency or network call; proposal role documented only |

## Deterministic proof

| Command/control | Expected | Observed | State |
|---|---|---|---|
| Pre-fix `npm.cmd run test:controls` | Failing-before | Exit 1; expected 12 controls, received 0 | VERIFIED |
| `npm.cmd test` | Full local suite green | 4 files, 22 tests passed | VERIFIED |
| `npm.cmd run control:mutation` | Disabled critical detector must fail gate | Exit 1; `DET-CP-R4`; suite `UNHEALTHY`; digest `e4dcfe2403777b89b75a8340afc119918f4d21fd5c942cb219b38e05518aa12c` | VERIFIED |
| `npm.cmd run control:gate` run 1 | Restored gate green | 1/1 passed; exit 0 | VERIFIED |
| `npm.cmd run control:gate` run 2 | Identical restored gate green | 1/1 passed; exit 0 | VERIFIED |
| Restored suite digest | Stable across complete runs | `cfc27e6e79a4561b2939a12ae56611db185560f983a46946e792ef9655bca9bf` | VERIFIED |

## Static, build, and security proof

| Command | Observed | State |
|---|---|---|
| `npm.cmd run typecheck` | Exit 0 | VERIFIED |
| `npm.cmd run lint` | Exit 0; no warnings | VERIFIED |
| `npm.cmd run build` | Exit 0; Next.js 16.2.12 production build; 7 static surfaces plus one dynamic API | VERIFIED |
| `npm.cmd audit --omit=dev --audit-level=high` initial | 3 high advisories through bundled PostCSS/Sharp | VERIFIED FAILING CONTROL |
| Dependency override + repeat audit | PostCSS 8.5.25, Sharp 0.35.3; `found 0 vulnerabilities` | VERIFIED |
| Secret-pattern scan | Known-positive instrument matched `.env.example`; no live key/private-key/service-role assignment pattern matched scoped source | VERIFIED |
| Private-path/employer-receipt scan | No local job-package path or governed employer receipt identifier in the public candidate | VERIFIED |
| Tailwind prefix scan | No hand-written `-webkit-` source prefix | VERIFIED |

## Real-browser journey

Tool: Playwright CLI with local Chrome against the production build at `127.0.0.1:3210`.

1. Overview loaded with correct title, landmarks, claim boundaries, synthetic release hold, and no console errors.
2. Navigated through the primary CTA to `/workspace`.
3. Submitted the pre-filled human readiness review; state became `Human review recorded`.
4. Edited the accepted review to invalid input; state immediately reverted to `Human action required` and the field exposed an accessible alert.
5. Disabled `DET-CP-R4`; UI showed `UNHEALTHY`, 11/12 healthy, and CP-R4 unhealthy.
6. Restored the detector; UI showed `HEALTHY`, 12/12 healthy, with the stable restored digest.
7. Resized to 390 x 844; measured `documentWidth=390`, `viewport=390`, `overflow=false`.
8. Mobile and desktop sessions reported zero console errors and zero warnings.

Artifacts:

- `docs/screenshots/home-desktop.png` (317,141 bytes)
- `docs/screenshots/workspace-mutation.png` (308,755 bytes)
- `docs/screenshots/workspace-mobile.png` (221,043 bytes)
- `docs/evidence/20260801-0909-caseproof-build-report.html` (self-contained claim-state report)
- `docs/evidence/latest.html` (stable pointer to the same report)

## Truth-layer separation

| Layer | State |
|---|---|
| Local source/test/build/browser | VERIFIED as listed above |
| GitHub public visibility | VERIFIED |
| Task branch/commit/PR | PENDING at this manifest revision |
| Hosted CI execution | UNKNOWN until the PR workflow runs real steps |
| Deployment/provider/auth/database/payment | NOT AUTHORIZED / UNKNOWN |
| Customer, employer, demand, adoption, revenue, savings, outcomes | UNKNOWN; no claim made |

## Remaining gates

- Commit explicit repository paths, push the authorized branch, and open the PR.
- Prove a fresh clone of the pushed branch can install, test, build, and run the primary workflow.
- Obtain a verdict from a distinct REVIEWER session. Do not merge or deploy.
