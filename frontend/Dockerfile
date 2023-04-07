FROM node:latest

WORKDIR /app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node . .

RUN yarn && yarn run build

USER node

EXPOSE ${VITE_PORT}

CMD [ "yarn", "run", "preview" ]
