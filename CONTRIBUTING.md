# Contributing

CaseProof is currently an independently reviewed work sample. Before proposing a change:

1. Keep all fixtures synthetic.
2. Preserve deterministic-first and human-authority boundaries.
3. Add a known-bad control that fails before the fix and a clean control that passes after it.
4. Run the control twice and mutation-test the affected detector.
5. Run tests, typecheck, lint, and build locally.
6. Do not add provider credentials, production writes, runtime AI authority, fabricated claims, or customer/employer data.

Changes require a branch and independent review. Do not push directly to the default branch.
