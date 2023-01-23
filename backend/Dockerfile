# Utilise une image Node.js en tant que base pour l'image
FROM node:14

# Définis un répertoire de travail
WORKDIR /app

# Copie les fichiers de l'application dans le répertoire de travail
#COPY ...

# Installe les dépendances de l'application
RUN npm install

# Installe Prisma CLI
RUN npm install -g prisma

# Expose le port utilisé
EXPOSE 4000

# Définis l'environnement
#ENV DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database_name>

CMD ["npm", "start"]
