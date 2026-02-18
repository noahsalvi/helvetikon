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
POSTGRES_TEST_USER="${POSTGRES_TEST_USER:-${POSTGRES_USER}}"
POSTGRES_TEST_PASSWORD="${POSTGRES_TEST_PASSWORD:-${POSTGRES_PASSWORD}}"
POSTGRES_TEST_DB="${POSTGRES_TEST_DB:-helvetikon_test}"
DATABASE_TEST_URL="${DATABASE_TEST_URL:-postgresql://${POSTGRES_TEST_USER}:${POSTGRES_TEST_PASSWORD}@localhost:5433/${POSTGRES_TEST_DB}?schema=public}"
AUDIO_SAMPLES_FS_ROOT="${AUDIO_SAMPLES_FS_ROOT:-./static/audio-samples-test}"
VITE_AUDIO_SAMPLES_PUBLIC_ROOT="${VITE_AUDIO_SAMPLES_PUBLIC_ROOT:-/audio-samples-test/}"

command="${1:-up}"

case "$command" in
  up)
    docker compose up -d db-test
    ;;
  wait)
    echo "Waiting for db-test to accept connections..."
    until docker compose exec -T db-test pg_isready -U "$POSTGRES_TEST_USER" -d "$POSTGRES_TEST_DB" >/dev/null 2>&1; do
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
    DATABASE_URL="$DATABASE_TEST_URL" AUDIO_SAMPLES_FS_ROOT="$AUDIO_SAMPLES_FS_ROOT" node prisma/seed-test.js
    ;;
  setup)
    "$0" up
    "$0" wait
    if [[ -z "$AUDIO_SAMPLES_FS_ROOT" || "$AUDIO_SAMPLES_FS_ROOT" == "/" ]]; then
      echo "Invalid AUDIO_SAMPLES_FS_ROOT: $AUDIO_SAMPLES_FS_ROOT" >&2
      exit 1
    fi
    rm -rf "$AUDIO_SAMPLES_FS_ROOT"
    mkdir -p "$AUDIO_SAMPLES_FS_ROOT"
    "$0" reset
    "$0" seed
    ;;
  *)
    echo "Unknown command: $command" >&2
    echo "Usage: scripts/test-db.sh [up|wait|down|reset|seed|setup]" >&2
    exit 1
    ;;
esac
