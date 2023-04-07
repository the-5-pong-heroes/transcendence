FROM node:latest

RUN mkdir /app && chown -R node:node ./app/

USER node

WORKDIR /app

COPY --chown=node:node package*.json yarn.lock ./

COPY --chown=node:node ./src/prisma ./prisma

# we could add --prod to avoid installing packages listed in devDependencies
RUN yarn install --frozen-lockfile --non-interactive

COPY --chown=node:node . .

RUN chown node:node ./entrypoint.sh

RUN yarn && yarn run build

EXPOSE ${NESTJS_PORT}

RUN chown node:node ./dist /app/dist

ENTRYPOINT ["bash", "./entrypoint.sh"]
