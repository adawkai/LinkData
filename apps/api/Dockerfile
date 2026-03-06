FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for dependency installation
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and config files
COPY packages/shared packages/shared
COPY apps/api apps/api

# Build shared package first, then api
RUN pnpm --filter @social/shared build && pnpm --filter @social/api build

# Copy and permission the entrypoint script
COPY apps/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]