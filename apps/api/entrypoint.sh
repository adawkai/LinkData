#!/bin/sh
set -e

pnpm --filter @social/api exec prisma generate
pnpm --filter @social/api prisma migrate deploy

exec pnpm --filter @social/api start:dev