const { spawn } = require("child_process");

const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const pages = [
  "/resume",
  "/projects",
  "/projects/ffki-alpha",
  "/projects/board-game-intelligence-api",
  "/projects/unrealdice",
  "/projects/speed-dungeon",
  "/about",
  "/filament",
  "/filament/add",
  "/hangman",
  "/impressum",
  "/health",
];

const server = spawn(process.execPath, ["server.js"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: "test",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 5000;

    async function check() {
      try {
        const res = await fetch(`${BASE_URL}/health`);
        if (res.ok) {
          resolve();
          return;
        }
      } catch (error) {
        // Server is still starting.
      }

      if (Date.now() > deadline) {
        reject(new Error(`Server did not start in time.\n${output}`));
        return;
      }

      setTimeout(check, 150);
    }

    check();
  });
}

async function run() {
  try {
    await waitForServer();

    for (const page of pages) {
      const res = await fetch(`${BASE_URL}${page}`);
      if (!res.ok) {
        throw new Error(`${page} returned ${res.status}`);
      }
    }

    const missing = await fetch(`${BASE_URL}/this-page-does-not-exist`);
    if (missing.status !== 404) {
      throw new Error(`404 check returned ${missing.status}`);
    }

    console.log(`Smoke test passed for ${pages.length} pages plus 404.`);
  } finally {
    server.kill("SIGTERM");
  }
}

server.on("exit", (code, signal) => {
  if (code !== null && code !== 0) {
    process.exitCode = code;
  }
});

run().catch((error) => {
  console.error(error.message);
  server.kill("SIGTERM");
  process.exit(1);
});
