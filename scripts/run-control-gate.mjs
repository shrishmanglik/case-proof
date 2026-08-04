import { spawnSync } from "node:child_process";

const index = process.argv.indexOf("--disable");
const disabled = index >= 0 ? process.argv[index + 1] : undefined;
const command = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env };
if (disabled) env.CASEPROOF_DISABLE_DETECTOR = disabled;
else delete env.CASEPROOF_DISABLE_DETECTOR;

const result = spawnSync(command, ["exec", "--", "vitest", "run", "src/domain/control-gate.test.ts"], {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
