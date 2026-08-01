# Security policy

## Scope

The initial CaseProof vertical runs entirely with committed synthetic fixtures. Do not submit resident, patient, health, video, audio, credential, employer-confidential, customer, or production data.

## Reporting

Open a private security advisory in the GitHub repository rather than a public issue when disclosure could expose a vulnerability or sensitive detail. Do not include live secrets, access tokens, or personal data in the report.

## Current security boundary

- No provider credentials are required.
- No runtime AI or external write exists.
- The Supabase migration is source-only and has not been applied.
- RLS is enabled in source on every application table; live behaviour is UNKNOWN.
- Public deployment and production operation are not part of the initial authorization.
