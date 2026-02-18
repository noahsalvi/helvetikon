import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "sh -lc 'set -a; . ./.env 2>/dev/null || true; set +a; DATABASE_URL=\"postgresql://${POSTGRES_TEST_USER:-${POSTGRES_USER:-user}}:${POSTGRES_TEST_PASSWORD:-${POSTGRES_PASSWORD:-password}}@${POSTGRES_TEST_HOST:-localhost}:${POSTGRES_TEST_PORT:-5433}/${POSTGRES_TEST_DB:-helvetikon_test}?schema=public\" AUDIO_SAMPLES_FS_ROOT=\"${AUDIO_SAMPLES_FS_ROOT:-./static/audio-samples-test}\" VITE_AUDIO_SAMPLES_PUBLIC_ROOT=\"${VITE_AUDIO_SAMPLES_PUBLIC_ROOT:-/audio-samples-test/}\" NODE_ENV=test node ./node_modules/vite/bin/vite.js dev --host --port 4173'",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
