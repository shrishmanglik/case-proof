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
