# Evidence boundaries

## Verified by this repository

- Source implements a Next.js 16 application, typed API, deterministic control engine, 24 synthetic fixtures, and a source-only Supabase schema.
- Local commands can test, typecheck, lint, build, and run the synthetic workflow.
- The critical disabled-detector mutation makes the ordinary release control gate fail.

## Not verified by this repository

- Customer or employer demand
- SafelyYou internal process, systems, data, endorsement, or outcomes
- Production deployment, provider state, auth, applied schema, or live RLS behaviour
- Clinical or safety effectiveness
- Buyer willingness to pay, observed delivery cost, margin, adoption, retention, or repeat use
- Reliability, capacity, availability, RPO/RTO, or cost targets under production load

## Public-language rule

Use `implemented locally`, `source-only`, `synthetic`, `proposed`, and `UNKNOWN` exactly where applicable. Do not convert blueprint hypotheses into product, employer, customer, or commercial facts.
