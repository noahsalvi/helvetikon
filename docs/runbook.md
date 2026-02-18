# Runbook

## Prerequisites
- Node.js 18+
- Yarn classic (`yarn`)
- PostgreSQL 15
- FFMPEG (required for audio upload/conversion paths)

## Environment setup
1. Copy `.env.example` to `.env`.
2. Fill required secrets:
- `DATABASE_URL`
- `PASSWORD_SECRET`
- `PASSWORD_RESET_SECRET`
- `EMAIL_VERIFICATION_SECRET`
- `EMAIL_NOREPLY_PASSWORD`
3. Ensure PostgreSQL DB exists and is reachable by `DATABASE_URL`.

## Install and start
```bash
yarn install
yarn dev
```
App default: `http://localhost:3000`

## Build and preview
```bash
yarn build
yarn preview
```

## Useful commands
- Type checks: `yarn check`
- Prisma client generation: `yarn generate`
- Production start locally (after build): `yarn start:prod`
- Test DB (Docker): `yarn test:db:setup`
- Test suites: `yarn test` / `yarn test:unit` / `yarn test:e2e`

## Test database (recommended with Docker)
1. Keep your normal development DB in `DATABASE_URL`.
2. Use a separate test DB in `DATABASE_TEST_URL` (defaults to port `5433`).
3. Use dedicated test DB credentials:
- `POSTGRES_TEST_USER`
- `POSTGRES_TEST_PASSWORD`
4. Keep test audio isolated with:
- `AUDIO_SAMPLES_FS_ROOT=./static/audio-samples-test`
- `VITE_AUDIO_SAMPLES_PUBLIC_ROOT=/audio-samples-test/`
5. Start and seed test DB:
```bash
yarn test:db:setup
```
6. Run tests:
```bash
yarn test
```

## Quick health checks
- Home page loads and shows search
- `GET /api/words` returns JSON
- Register/login flow sets cookies
- Add word flow works when authenticated

## Common pitfalls
- Port 3000 occupied: run `yarn dev --port <free-port>`.
- Missing/invalid secrets: auth and mail routes fail.
- No FFMPEG: audio sample upload path fails.
- DB collation: README recommends `de_CH`/`de-CH-x-icu` for swiss german sorting behavior.
