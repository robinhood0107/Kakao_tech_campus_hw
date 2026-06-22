import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..", "..");
const backendDir = path.join(rootDir, "backend");
const backendPort = process.env.BACKEND_PORT ?? "9010";

function pickPython() {
  if (process.platform === "win32") {
    const windowsVenv = path.join(backendDir, ".venv-win", "Scripts", "python.exe");

    if (existsSync(windowsVenv)) {
      return { command: windowsVenv, args: [] };
    }

    return { command: "py", args: ["-3"] };
  }

  const unixVenv = path.join(backendDir, ".venv", "bin", "python");

  if (existsSync(unixVenv)) {
    return { command: unixVenv, args: [] };
  }

  return { command: "python3", args: [] };
}

const python = pickPython();
const child = spawn(
  python.command,
  [
    ...python.args,
    "-m",
    "uvicorn",
    "main:app",
    "--host",
    "127.0.0.1",
    "--port",
    backendPort,
  ],
  {
    cwd: backendDir,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "sqlite:///./test-e2e.db",
    },
    stdio: "inherit",
  },
);

function stopBackend(signal) {
  if (!child.killed) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => stopBackend("SIGINT"));
process.on("SIGTERM", () => stopBackend("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
