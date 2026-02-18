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

if [[ -n "${DATABASE_TEST_URL:-}" ]]; then
  parsed_test_url="$(
    node -e 'const u = new URL(process.env.DATABASE_TEST_URL); const db = u.pathname.replace(/^\//, ""); const port = u.port || "5433"; console.log([u.username, u.password, u.hostname, port, db].join("\n"));' 2>/dev/null || true
  )"
  if [[ -n "$parsed_test_url" ]]; then
    readarray -t parsed_parts <<<"$parsed_test_url"
    POSTGRES_TEST_USER="${parsed_parts[0]:-}"
    POSTGRES_TEST_PASSWORD="${parsed_parts[1]:-}"
    POSTGRES_TEST_HOST="${parsed_parts[2]:-}"
    POSTGRES_TEST_PORT="${parsed_parts[3]:-}"
    POSTGRES_TEST_DB="${parsed_parts[4]:-}"
  fi
fi

POSTGRES_TEST_USER="${POSTGRES_TEST_USER:-${POSTGRES_USER}}"
POSTGRES_TEST_PASSWORD="${POSTGRES_TEST_PASSWORD:-${POSTGRES_PASSWORD}}"
POSTGRES_TEST_DB="${POSTGRES_TEST_DB:-helvetikon_test}"
POSTGRES_TEST_HOST="${POSTGRES_TEST_HOST:-localhost}"
POSTGRES_TEST_PORT="${POSTGRES_TEST_PORT:-5433}"
DATABASE_TEST_URL="postgresql://${POSTGRES_TEST_USER}:${POSTGRES_TEST_PASSWORD}@${POSTGRES_TEST_HOST}:${POSTGRES_TEST_PORT}/${POSTGRES_TEST_DB}?schema=public"
AUDIO_SAMPLES_FS_ROOT="${AUDIO_SAMPLES_FS_ROOT:-./static/audio-samples-test}"
VITE_AUDIO_SAMPLES_PUBLIC_ROOT="${VITE_AUDIO_SAMPLES_PUBLIC_ROOT:-/audio-samples-test/}"

export POSTGRES_TEST_USER
export POSTGRES_TEST_PASSWORD
export POSTGRES_TEST_DB
export POSTGRES_TEST_HOST
export POSTGRES_TEST_PORT
export DATABASE_TEST_URL

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
    DATABASE_URL="$DATABASE_TEST_URL" npx prisma migrate reset --force
    ;;
  seed)
    DATABASE_URL="$DATABASE_TEST_URL" AUDIO_SAMPLES_FS_ROOT="$AUDIO_SAMPLES_FS_ROOT" npx tsx prisma/seed-test.ts
    ;;
  setup)
    volume_name="$(
      docker inspect -f '{{ range .Mounts }}{{ if eq .Destination "/var/lib/postgresql/data" }}{{ .Name }}{{ end }}{{ end }}' helvetikon-db-test 2>/dev/null || true
    )"
    docker compose rm -sf db-test >/dev/null 2>&1 || true
    if [[ -n "$volume_name" ]]; then
      docker volume rm "$volume_name" >/dev/null 2>&1 || true
    fi
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
