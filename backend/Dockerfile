# Utilise une image Node.js en tant que base pour l'image
FROM node:latest

USER node

# Définis un répertoire de travail
WORKDIR /app

# Copie les fichiers de l'application dans le répertoire de travail
COPY --chown=node:node package*.json yarn.lock ./

# Installe les dépendances de l'application
RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node . .

# update permissions
RUN chmod a+x ./entrypoint.sh

RUN yarn && yarn run build

EXPOSE ${NESTJS_PORT}

ENTRYPOINT ["bash", "./entrypoint.sh"]
