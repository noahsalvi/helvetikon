# Testing Plan and Matrix

## Goals
- Protect critical user journeys while upgrading SvelteKit, Prisma, and related dependencies.
- Add fast negative-path API tests so regressions are caught before manual QA.
- Keep test data isolated from development data.

## Environment and Data Strategy
- Use a dedicated test database via `DATABASE_TEST_URL`.
- Keep `DATABASE_URL` for normal development only.
- Reset only the test database before test runs (`migrate reset` + deterministic seed).
- Do not run automated tests against the developer database.
- Docker-first onboarding: `db-test` service on port `5433`.

## Test Layers
- End-to-end (Playwright): critical workflows and redirects.
- API integration/route tests (Vitest): auth, validation, permissions, and conflict paths.
- Unit tests (Vitest): middleware and helper behavior.

## Priority Matrix

### P0 (must pass before stack migration PR merge)
| ID | Type | Path(s) | Scenario | Expected Result |
|---|---|---|---|---|
| E2E-01 | E2E | `/`, `GET /api/words/search/:query`, `/:dialect/:word` | Search and open a word | Result list appears and navigation opens detail page |
| E2E-02 | E2E | `/auth/registrieren`, `/verifizieren`, `/auth/anmelden` | Register, verify, login | User can authenticate and reach authenticated state |
| E2E-03 | E2E | `/wort-hinzufügen`, `/auth/anmelden` | Unauthenticated user opens protected page | Redirect to login |
| E2E-04 | E2E | `/wort-hinzufügen`, `POST /api/words` | Add a new word | Word is created and user lands on word page |
| E2E-05 | E2E | `/:dialect/:word/interpretation-hinzufügen`, `POST /api/words/:wordId/interpretations` | Add interpretation | Interpretation is persisted and visible on detail page |
| E2E-06 | E2E | `PUT /api/interpretations/:id` | Non-owner edit attempt | Edit is blocked with forbidden behavior |
| API-01 | API | `POST /api/auth/login` | Wrong password | `401 Authentication failed` |
| API-02 | API | `POST /api/auth/login` | Unverified account login | `401` with `reason=verified` header |
| API-03 | API | `POST /api/words` | Unauthenticated create word | `401 Authorization failed` |
| API-04 | API | `PUT /api/interpretations/:id` | Non-owner edit attempt | `403` forbidden response |
| API-05 | API | `PUT /api/interpretations/:id/vote` | Invalid vote payload (`upvote && downvote`) | `409` conflict |

### P1 (next wave)
| ID | Type | Path(s) | Scenario | Expected Result |
|---|---|---|---|---|
| E2E-07 | E2E | `/api/auth/logout`, protected route | Logout | Session cookie removed and protected page redirects |
| E2E-08 | E2E | Search component | No search result path | Empty-state message shown |
| API-06 | API | `POST /api/auth/register` | Invalid payload (bad email/short password) | `400` malformed request |
| API-07 | API | `POST /api/auth/register` | Duplicate username/email | `409` conflict |
| API-08 | API | `GET /api/words/available/:dialect/:word` | Existing word check | `409` existing word response |
| API-09 | API | `POST /api/words/:wordId/interpretations` | Unauthenticated create interpretation | `401` authorization failed |
| API-10 | API | `GET /api/words/:dialect/:word` | Non-existing word | Not-found behavior remains stable |

### P2 (later hardening)
| ID | Type | Path(s) | Scenario | Expected Result |
|---|---|---|---|---|
| UNIT-01 | Unit | `authorize` middleware | Missing `locals.user` | Throws `401` auth failure |
| UNIT-02 | Unit | `validate` middleware | Invalid validator set | Returns `400` malformed request |
| UNIT-03 | Unit | cookie/token helpers | Cookie serialization/deletion | Correct cookie semantics |
| E2E-09 | E2E | `/:dialect/:word/hörbeispiel-hinzufügen` | Audio upload | Upload + conversion path succeeds |

## Implementation Plan

### Phase 1: Foundation (this branch)
- Add testing matrix document.
- Add Playwright + Vitest tooling and scripts.
- Add baseline P0/P1 tests that are low-friction and high-signal.

### Phase 2: Expand critical E2E coverage
- Add full authenticated UI flows with deterministic seeded data.
- Stabilize selectors and test data setup/teardown.

### Phase 3: Upgrade with safety gates
- Upgrade dependencies in small batches.
- Require P0 suite green on each upgrade PR.
- Run P1/P2 nightly or pre-release.

## CI Recommendation
- Fast lane on each PR: `yarn check` + Vitest unit/API tests.
- E2E lane on each PR to `master` (or at minimum required before merge).
- Block deployment on red tests.

## Manual Verification for this Plan
- Confirm tests never use `DATABASE_URL` intended for development.
- Confirm tests can run repeatedly without polluting local dev data.
- Confirm P0 failures are actionable and point to route-level regressions.

## Implemented in This Branch
- Test tooling: `Vitest` and `Playwright`.
- Unit tests:
  - `tests/unit/authorize.test.ts`
  - `tests/unit/validate.test.ts`
- API-focused negative tests:
  - `tests/api/auth-login.test.ts`
  - `tests/api/interpretations.test.ts`
  - `tests/api/words.test.ts`
- E2E smoke tests:
  - `tests/e2e/auth-redirect.spec.ts`
  - `tests/e2e/search-empty-state.spec.ts` (API-level unauthenticated create-word check)
  - `tests/e2e/seeded-word.spec.ts` (seeded word detail + availability conflict)

## Run Commands
- `yarn test:unit`
- `yarn test:e2e`
- `yarn test`
- `yarn test:db:setup` (start/wait/reset/seed test DB)
- `yarn test:db:down` (stop test DB)

## Dedicated Test DB Commands
- Set `DATABASE_TEST_URL` in `.env`.
- Start Docker test DB: `yarn test:db:up`
- Wait for readiness: `yarn test:db:wait`
- Reset only test DB: `yarn test:db:reset`
- Seed test DB fixtures: `yarn test:db:seed`
- Full start + wait + reset + seed: `yarn test:db:setup`
- Playwright E2E now runs `test-db setup` automatically via `tests/e2e/global-setup.ts`.

## Seed Fixtures
- Verified user: `owner.test@helvetikon.local` (password: `TestPass123!`)
- Unverified user: `unverified.test@helvetikon.local` (password: `TestPass123!`)
- Seed word: `Gruezi` in `BERN` dialect with one interpretation
- Additional seed word: `Schoggi` in `ZUERICH` dialect
- Seeded audio sample file path: `static/audio-samples-test/BERN/Gruezi/owner_test/seed-gruezi.mp3`
- Seed audio fixture is generated as a real MP3 with `ffmpeg` during `test:db:seed`.
