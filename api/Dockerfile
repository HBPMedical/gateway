FROM node:12.13-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --development

COPY . .

RUN npm run build

RUN npm run test

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add bash
RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
