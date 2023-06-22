# aborts everything on errors
set -e

# evaluates the env variable expected by Prisma
# export POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

echo "💡 Initializing Prisma..."
yarn prisma generate --schema=./src/prisma/schema.prisma

echo "📖 Syncing the migration history..."
yarn prisma db push --accept-data-loss

echo "✅ Migration files successfully run"

echo "🚀 Launching NestJS..."
yarn run start:prod
