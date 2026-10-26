import { defineConfig, devices } from "@playwright/test";

// The API runs on an in-memory MongoDB so tests never touch real data.
const apiPort = 8100;
const apiKey = "e2e-key";
// Override to test a production build while `next dev` holds port 3000.
const appPort = Number(process.env.E2E_APP_PORT ?? 3000);
const appUrl = `http://localhost:${appPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: appUrl,
  },
  webServer: [
    {
      command: `.venv/bin/python -m tests.serve_in_memory --port ${apiPort}`,
      cwd: "backend",
      url: `http://127.0.0.1:${apiPort}/health`,
      env: { API_KEY: apiKey },
      reuseExistingServer: true,
    },
    {
      command: `npm run start -- --port ${appPort}`,
      url: appUrl,
      env: { API_URL: `http://127.0.0.1:${apiPort}`, API_KEY: apiKey },
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
