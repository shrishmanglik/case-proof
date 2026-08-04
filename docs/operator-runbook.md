# Operator runbook

## Boot

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd test
npm.cmd run dev
```

Open `http://localhost:3000/workspace`.

## Primary journey

1. Confirm the synthetic-data banner and `Release held` state.
2. Submit the readiness review. Empty or shortened evidence must show field-level errors.
3. Run `Disable CP-R4`. Expected: `UNHEALTHY`, 11/12 controls healthy, no external effect.
4. Run `Run restored suite`. Expected: `HEALTHY`, 12/12 controls healthy.
5. Open `/proof`. Confirm `DET-CP-R4 disabled` is `Gate failed` and `Detector restored` is `Gate healthy`.
6. Open `/records` and `/boundaries`. Confirm synthetic provenance and UNKNOWN states remain visible.

## Command-line proof

```powershell
npm.cmd run control:mutation
```

Expected: non-zero exit because disabling the critical detector makes the ordinary release control gate fail.

```powershell
npm.cmd run control:gate
```

Expected: zero exit with the restored detector.

## Retry policy

Local deterministic controls do not retry. Correct malformed input or restore detector health, then start a new run. A future transient provider adapter may retry only when no durable receipt exists, with bounded exponential jitter and mandatory reconciliation before manual retry.

## Stop conditions

Stop and retain evidence if a known-bad fixture passes, a clean fixture fails, two digests differ, mutation is not caught, provider credentials become necessary, or any non-synthetic data appears.
