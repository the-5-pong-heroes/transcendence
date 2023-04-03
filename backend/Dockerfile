FROM node:19

RUN mkdir /app && chown -R node:node ./app/

USER node

WORKDIR /app

COPY --chown=node:node package*.json yarn.lock ./

COPY --chown=node:node ./src/prisma ./prisma

RUN yarn install --frozen-lockfile --non-interactive

COPY --chown=node:node . .

RUN chown node:node ./entrypoint.sh

RUN yarn && yarn run build

EXPOSE ${NESTJS_PORT}

RUN chown node:node ./dist /app/dist


ENTRYPOINT ["bash", "./entrypoint.sh"]
