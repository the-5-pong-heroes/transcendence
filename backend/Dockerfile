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

# same thing as [node dist/main.js]
CMD [ "npm", "run", "start:prod" ]



# #COPY --chown=node:node prisma ./prisma
# #COPY --chown=node:node ././.env ./.env

# #TODO pas sure de cette la
# RUN yarn global add @nestjs/cli

# # Installe Prisma CLI
# RUN yarn add prisma --dev
# RUN yarn prisma
# RUN yarn prisma generate // TODO mettre à jour le chemin

# # Définis l'environnement
# #ENV DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database_name>
# ENV NODE_ENV production

# CMD ["start": "node dist/main.js"]
