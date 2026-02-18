# AGENTS.md

This file is the fast-start guide for AI agents working in this repository.

## 1. Goal and stack
- Project: Helvetikon (crowdsourced swiss german dictionary)
- Stack: SvelteKit + TypeScript + Prisma + PostgreSQL
- Deployment: Dockerized, CI/CD on pushes to `master`

Read first:
- `docs/architecture.md`
- `docs/user-journeys.md`
- `docs/runbook.md`
- `docs/deployment.md`

## 2. Where to change what
- UI pages: `src/routes/**.svelte`
- API handlers: `src/routes/api/**/*.ts`
- Shared logic/components: `src/lib/**`
- Auth/session plumbing: `src/hooks/**`
- DB schema/migrations: `prisma/**`
- Infra/deploy: `Dockerfile`, `docker-compose.yml`, `.github/workflows/**`

## 3. Local workflow
```bash
yarn install
yarn dev
yarn check
```
If auth/data flows are touched, also verify relevant API routes manually in browser.

## 4. Auth and permissions model
- Session user comes from JWT cookie `access-token` in `src/hooks/handle.ts`.
- Route/API auth checks use `locals.user` and `authorize(...)` middleware.
- Protected pages redirect unauthenticated users (e.g., add-word/profile flows).

## 5. API conventions
- Endpoints return `{ status?, body?, headers? }` objects.
- `src/lib/api.ts` throws on non-2xx responses; frontend callers must handle `.catch(reason)`.
- Keep response shapes backward compatible when possible.

## 6. Quality bar for changes
For each feature/bugfix, include:
- What changed
- Which route/API paths are affected
- Manual verification steps
- Any schema/env/deploy impact

## 7. Important constraints
- Do not silently change auth behavior or cookie semantics.
- Do not modify Prisma schema without migration implications documented.
- Audio upload path depends on FFMPEG and file storage conventions; validate end-to-end if touched.
- Deployment assumptions must match `docs/deployment.md` and workflow files.

## 8. Playwright usage
Playwright is useful here for UI walkthroughs and regression checks of flows.
- Use it to inspect real page states and capture screenshots.
- You do not need a dedicated test suite to use Playwright for visual/product understanding.
- Add scripted Playwright tests only when explicitly requested.

## 9. Commit convention
- Use Conventional Commits for all commit messages.
- Format: `<type>(optional-scope): <summary>`.
- Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
