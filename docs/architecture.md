# Helvetikon Architecture

## Tech stack
- SvelteKit (file-based routing, server endpoints in `src/routes/api`)
- Svelte 5 + TypeScript
- Prisma ORM with PostgreSQL
- WindiCSS via Vite plugin
- Node adapter (`@sveltejs/adapter-node`)
- Docker + Docker Compose for production runtime

## Top-level structure
- `src/routes`: app pages and API endpoints
- `src/lib`: shared domain logic, API helper, auth helpers, components
- `src/hooks.server.ts`: request auth/session handling
- `prisma`: schema and SQL migrations
- `.github/workflows`: CI/CD workflow
- `Dockerfile`, `docker-compose.yml`: deploy/runtime definition

## Auth/session model
- Access token is stored in cookie `access-token`.
- Request auth is resolved in `src/hooks.server.ts`.
- `handle` verifies JWT and populates `event.locals.user`.
- On expired JWT, it attempts token rotation through `AccessToken.update(...)`.
- Root server layout load (`src/routes/+layout.server.ts`) exposes `locals.user` to frontend via `data.user`.

## Form handling
- Form state/validation uses `svelte-use-form@3.0.0-beta.0` (Svelte 5 compatible).
- Auth and add-word flows rely on `useForm`, field validators, and hint rendering from that package.

## Data model (Prisma)
Core entities in `prisma/schema.prisma`:
- `User`: account, preferred dialect, verification state
- `Session`: token records tied to user
- `Word`: swiss german word, dialect, spellings, optional german translation
- `Interpretation`: user-submitted meanings for a word
- `Meaning`: explanation + examples under an interpretation
- `AudioSample`: uploaded pronunciation for a word
- `Dialect` enum: supported regional variants

## Route map (UI)
Public routes:
- `/`: landing/search/recent/popular
- `/worte`: all words
- `/faq`
- `/auth/*`: login/register/password reset/email verify info
- `/:dialect/:word`: word detail page
- `/verifizieren?token=...`: verification callback route (SSR disabled, redirects)

Authenticated routes:
- `/profil`
- `/wort-hinzufügen`
- `/:dialect/:word/hörbeispiel-hinzufügen`
- `/:dialect/:word/interpretation-hinzufügen`
- `/:dialect/:word/interpretationen/:interpretationId/bearbeiten`

## Route map (API)
Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/verify?token=...`
- `POST /api/auth/forgot`
- `POST /api/auth/reset?token=...`

Words:
- `GET /api/words`
- `POST /api/words` (auth required)
- `GET /api/words/recent`
- `GET /api/words/popular`
- `GET /api/words/search/:searchQuery`
- `GET /api/words/available/:dialect/:word`
- `GET /api/words/:dialect/:word`
- `POST /api/words/:wordId/interpretations` (auth required)
- `POST /api/words/:wordId/audio-samples` (auth required)

Interpretations:
- `GET /api/interpretations/:interpretationId` (auth required)
- `PUT /api/interpretations/:interpretationId` (auth required + ownership check)
- `PUT /api/interpretations/:interpretationId/vote` (auth required)

## Cross-cutting behavior
- Input validation helper: `src/lib/api/middlewares/validate.ts`
- Auth guard helper: `src/lib/api/middlewares/authorize.ts`
- Cached API responses:
  - `/api/words/recent` (3 min in-memory cache)
  - `/api/words/popular` (30 min in-memory cache)
- Email transport switches by `NODE_ENV`:
  - production SMTP
  - dev/test transport with preview URL
