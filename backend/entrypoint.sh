# aborts everything on errors
set -e

# evaluates the env variable expected by Prisma
export POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"

npx prisma generate --schema=./src/prisma/schema.prisma

echo "💭 Syncing the migration history..."
npx prisma migrate dev

echo "✅ Migration files successfully run"

echo "🚀 Launching NestJS..."
yarn run start:dev