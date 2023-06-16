FROM node:18.16.0

RUN mkdir /app && chown -R node:node ./app/

USER node

WORKDIR /app

COPY --chown=node:node ./shared ./shared

COPY --chown=node:node ./frontend/package*.json ./frontend/yarn.lock ./frontend/

WORKDIR /app/shared

RUN yarn install --frozen-lockfile --production --non-interactive

WORKDIR /app/frontend

RUN yarn install --frozen-lockfile --production --non-interactive

COPY --chown=node:node ./frontend ./

RUN yarn && yarn run build

EXPOSE ${VITE_PORT}

CMD [ "yarn", "vite" ]
