# Builder Stage
FROM node:18 AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY prisma prisma

# Install dependencies and generate prisma artifacts
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Removing the dev dependencies
RUN yarn install --prod --ignore-scripts --frozen-lockfile 

# Runner Stage
# TODO Replace with slim build after updating prisma to ^4.10.0
FROM node:18 AS runner

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/build build

EXPOSE 3000

# Run DB migrations and start server
CMD ["yarn", "start:migrate:prod"]
