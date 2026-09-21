import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- --port 3100",
    env: { BETTER_AUTH_URL: "http://localhost:3100", OTP_DELIVERY: "file" },
    url: "http://localhost:3100/login",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
