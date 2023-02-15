# aborts everything on errors
set -e

# evaluates the env variable expected by Prisma
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"

echo "💭 Syncing the migration history..."
npx prisma migrate deploy
echo "✅ Migration files successfully run"

echo "🚀 Launching NestJS..."
npm run start:prod
