# Deployment

## Source of truth
- CI workflow: `.github/workflows/publish-and-deploy.yml`
- Container build: `Dockerfile`
- Runtime orchestration: `docker-compose.yml`

## Current deploy pipeline
Trigger:
- Push to `master` branch.

Steps:
1. Validation jobs run before publish:
   - `yarn install --frozen-lockfile`
   - `yarn check`
   - `yarn build`
   - `yarn test:unit`
   - `yarn test:e2e` (with Docker test DB setup/teardown)
2. GitHub Actions builds Docker image from `Dockerfile`.
3. Image is pushed to Docker Hub as `noahsalvi/helvetikon`.
4. A second job SSHes to the server and runs:
   - `cd helvetikon`
   - `git pull --ff-only`
   - `docker compose pull`
   - `docker compose down`
   - `docker volume rm helvetikon_app`
   - `docker compose up -d --remove-orphans`
   - `docker image prune -f`

## Runtime topology (docker-compose)
Services:
- `app`: Node/SvelteKit container, exposed on `3000:3000`
- `db`: Postgres 15 with persistent `db` volume
- `prisma-studio`: optional Prisma Studio on `5555:5555`

Volumes:
- `app`: mounted at `/app` in `app` and `prisma-studio`
- `db`: Postgres data persistence

## App container behavior
- `CMD ["yarn", "start:migrate:prod"]`
- `start:migrate:prod` runs `prisma migrate deploy`, then starts server (`yarn start:prod`).
- Migration flow is explicit and tied to app startup; deploys do not rely on ad-hoc manual migrate commands.

## Required secrets/config
From `.env` and workflow secrets:
- App/db env vars in `.env` (including `DATABASE_URL`, secrets)
- GitHub Actions secrets:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  - `DEPLOY_HOST`
  - `DEPLOY_USER`
  - `DEPLOY_PASSWORD`

## Notes and risks
- The deploy script deletes Docker volume `helvetikon_app` each deploy; verify this is intentional.
- Audio sample serving in production references `https://static.helvetikon.org/audio-samples/` in frontend code.
- README mentions VPS + OpenLiteSpeed reverse proxy; proxy configuration is not stored in this repository.
