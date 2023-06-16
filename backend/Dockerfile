FROM node:18.16.0

RUN mkdir /app && chown -R node:node ./app/

USER node

WORKDIR /app

COPY --chown=node:node ./shared ./shared

COPY --chown=node:node ./backend/index.html ./backend/index.html

COPY --chown=node:node ./backend/package*.json ./backend/yarn.lock ./backend/

WORKDIR /app/shared

RUN yarn install --frozen-lockfile --production --non-interactive

WORKDIR /app/backend

RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node ./backend ./

RUN yarn prisma generate --schema ./src/prisma/schema.prisma

RUN chown node:node ./entrypoint.sh

RUN yarn && yarn run build

EXPOSE ${NESTJS_PORT}

RUN chown node:node ./dist

ENTRYPOINT ["bash", "./entrypoint.sh"]
