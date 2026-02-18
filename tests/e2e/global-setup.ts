import { execSync } from "node:child_process";

function run(command: string) {
  execSync(command, {
    stdio: "inherit",
    shell: "/bin/zsh",
    env: process.env,
  });
}

export default async function globalSetup() {
  if (!process.env.DATABASE_TEST_URL) {
    throw new Error(
      "DATABASE_TEST_URL is required for Playwright. Configure a dedicated test database URL in .env."
    );
  }

  run('DATABASE_URL="$DATABASE_TEST_URL" npx prisma migrate reset --force --skip-generate');
  run('DATABASE_URL="$DATABASE_TEST_URL" node prisma/seed-test.js');
}
