#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Missing .env. Copy .env.example to .env first." >&2
  exit 1
fi

# shellcheck disable=SC1091
source .env

POSTGRES_USER="${POSTGRES_USER:-user}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-password}"
POSTGRES_TEST_DB="${POSTGRES_TEST_DB:-helvetikon_test}"
DATABASE_TEST_URL="${DATABASE_TEST_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_TEST_DB}?schema=public}"

command="${1:-up}"

case "$command" in
  up)
    docker compose up -d db-test
    ;;
  wait)
    echo "Waiting for db-test to accept connections..."
    until docker compose exec -T db-test pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_TEST_DB" >/dev/null 2>&1; do
      sleep 1
    done
    echo "db-test is ready"
    ;;
  down)
    docker compose stop db-test
    ;;
  reset)
    DATABASE_URL="$DATABASE_TEST_URL" npx prisma migrate reset --force --skip-generate
    ;;
  seed)
    DATABASE_URL="$DATABASE_TEST_URL" node prisma/seed-test.js
    ;;
  setup)
    "$0" up
    "$0" wait
    "$0" reset
    "$0" seed
    ;;
  *)
    echo "Unknown command: $command" >&2
    echo "Usage: scripts/test-db.sh [up|wait|down|reset|seed|setup]" >&2
    exit 1
    ;;
esac
