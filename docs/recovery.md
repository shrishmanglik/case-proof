# Recovery model

## Current local vertical

The application has no durable or external state. Refreshing the page clears the session-local human review and proof result. A failed proof run cannot advance release state.

| Failure | Behaviour | Recovery |
|---|---|---|
| Detector disabled | Suite becomes `UNHEALTHY` | Restore detector, run the exact suite again |
| Bad fixture accepted | Test and gate fail | Correct the detector, keep release held |
| Digest drift | Repeatability fails | Normalize the non-deterministic field; rerun twice |
| API malformed | `400 MALFORMED_REQUEST` | Correct typed input; no automatic retry |
| UI render error | Error boundary; no state advancement | Retry render, then inspect logs/tests |
| Provider unavailable | Not applicable in local mode | Provider truth remains `UNKNOWN` |

## Future provider-backed recovery contract

Before external writes are allowed, implement an original ChangeSet and a distinct compensating ChangeSet, exact-version dry runs, independent approvals, idempotency keys, target-read receipts, complete-set reconciliation, and restored-state proof. A deployment status must never substitute for target-state verification.
