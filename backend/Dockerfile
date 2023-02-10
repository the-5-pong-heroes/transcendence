# Utilise une image Node.js en tant que base pour l'image
FROM node:latest

# Définis un répertoire de travail
WORKDIR /app

# Copie les fichiers de l'application dans le répertoire de travail
COPY --chown=node:node package*.json yarn.lock ./

# Installe les dépendances de l'application
RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node . .

USER node

RUN yarn run build

EXPOSE 3333

# https://notiz.dev/blog/prisma-migrate-deploy-with-docker
CMD [  "npm", "run", "start:migrate:prod" ]
