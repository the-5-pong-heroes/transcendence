FROM node:latest

WORKDIR /app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node . .

RUN chmod a+x ./entrypoint.sh

RUN yarn && yarn run build

USER node 

EXPOSE ${NESTJS_PORT}

ENTRYPOINT ["bash", "./entrypoint.sh"]
