### Bien comprendre comment fonctionne Prisma

💡 Lire toute la documentation de Prisma même si un peu longue :
<https://www.prisma.io/docs/concepts/overview/what-is-prisma/data-modeling>

`npx prisma generate`

Updates your Prisma Client API.

`npx prisma db push --force-reset`

To quickly prototype and iterate on schema design locally, without the need to deploy these changes. To be used when you're prioritizing reaching a desired end-state and not the steps executed to reach that state ([doc](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)).

`npx prisma migrate dev --name init`

Creates and applies a migration by tracking the changes you make to the database and by generating plain SQL migration files ([doc](https://www.prisma.io/docs/concepts/components/prisma-migrate)).

`npx prisma migrate deploy`

Syncs your migration history from your development environment with your database by only running migration files (without using the Prisma schema file) ([doc](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model#prisma-migrate-in-a-staging-and-production-environment)).
