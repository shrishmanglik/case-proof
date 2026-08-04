# Failing-before evidence

Command: `npm.cmd run test:controls`

Pre-implementation result: exit code `1`.

The first committed test required 12 controls. The stub engine returned an empty control list, so Vitest failed with:

```text
AssertionError: expected [] to have a length of 12 but got +0
Test Files  1 failed (1)
Tests       1 failed (1)
```

This is the pre-fix source control. Passing-after, mutation, repeatability, build, E2E, and fresh-clone evidence are recorded separately in `manifest.md`.

## Independent-review failing control

The first distinct REVIEWER session found that the critical story-readiness detector checked only reviewer-array length. Adjacent single-field probes also found that an empty AI proposal and `observedCost: null` passed. Permanent tests were added before the detector fix.

Command: `npm.cmd run test:controls`

Pre-correction result: exit code `1`.

```text
Test Files  1 failed (1)
Tests       3 failed | 15 passed (18)
CP-R4: expected REJECT, received PASS for reviewers=[null,null]
CP-R7: expected REJECT, received PASS for proposal=""
CP-R12: expected REJECT, received PASS for observedCost=null
```

After correction, the permanent adjacency matrix also covers invalid list elements, duplicate reviewer identities, numeric strings, and null count fields. The complete local suite passes 46/46 tests.
