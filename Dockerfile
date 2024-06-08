FROM node:20-bullseye-slim AS base

# ---

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --no-frozen-lockfile

# ---

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN corepack enable && pnpm build

# ---

FROM node:20-bullseye-slim as runner

RUN apt-get update && apt-get install -y dnsutils && apt-get clean

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/typeorm ./typeorm
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
