FROM node:16.14-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --development

COPY . .

RUN npm run build

RUN npm run test

FROM node:16.14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production --ignore-scripts

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/assets ./assets

ARG JWT_SECRET
ENV AUTH_JWT_SECRET=${JWT_SECRET:-DefaultSecretNotToBeUse}

CMD ["node", "dist/main"]
