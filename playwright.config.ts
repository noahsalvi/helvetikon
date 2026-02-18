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
      "sh -lc '. ./.env 2>/dev/null || true; DATABASE_URL=\"${DATABASE_TEST_URL:-postgresql://${POSTGRES_TEST_USER:-test_user}:${POSTGRES_TEST_PASSWORD:-test_password}@localhost:5433/${POSTGRES_TEST_DB:-helvetikon_test}?schema=public}\" AUDIO_SAMPLES_FS_ROOT=\"${AUDIO_SAMPLES_FS_ROOT:-./static/audio-samples-test}\" VITE_AUDIO_SAMPLES_PUBLIC_ROOT=\"${VITE_AUDIO_SAMPLES_PUBLIC_ROOT:-/audio-samples-test/}\" NODE_ENV=test npx -y node@18 ./node_modules/.bin/svelte-kit dev --host --port 4173'",
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
