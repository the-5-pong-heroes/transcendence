# aborts everything on errors
set -e

echo "💡 Initializing Prisma..."
yarn prisma generate --schema=./src/prisma/schema.prisma

echo "📖 Syncing the migration history..."
yarn prisma db push --accept-data-loss

echo "✅ Migration files successfully run"

echo "🚀 Launching NestJS..."
yarn run start:prod
