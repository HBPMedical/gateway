---
description: Developer guide to setup a development environment
---

# Setup development environment

This guide is used to setup a full development environment for the MIP Front dev.

## Introduction

As we have seen in the previous chapter we need three component in order to setup the MIP:

* Engine
* Frontend
* Gateway
  * DB (postgres)

In this guide we will see how to setup the last two elements.

### Prerequisites

Make sure to have

* [Node.js](https://nodejs.org) (16.x)
* [NPM](https://npmjs.com) (8.x)
* [Yarn](https://yarnpkg.com) (1.22.x)
* [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

installed in your computer.

## Setup Gateway

First of all you should clone the repository either from the [Gitlab](https://gitlab.com/sibmip/gateway) or from the [GitHub](https://github.com/HBPMedical/gateway).

Once the pull is completed, you can make the following commands

```bash
cd gateway/api

git checkout develop

npm install
```

#### Run the DB

The gateway need a DB in order to work. [TypeORM](https://typeorm.io/) is used to make the DB calls agnostic from the real implementation.&#x20;

We provide a docker-compose to run a `postgres` DB, you can use it by running the following command

```bash
docker-compose up -d 
```

For debugging purpose, you can omit the -d (detached) parameter.

#### Run the Gateway

After the other steps have been completed, you should be able to start the gateway in dev mode with the following command

```bash
npm run start:dev
```

### GraphQL Playground

Once you have started the Gateway, you can play with the GraphQL playground that is automatically integrated within the gateway, follow this link : [http://127.0.0.1:8081/graphql](http://127.0.0.1:8081/graphql). You should be able to see something like this :

![GraphQL Playground](<../../.gitbook/assets/image (1).png>)

This environment is a tool provided by GraphQL to play with queries, mutations, etc...

It allows you to see schema defined in the backend and endpoints that you can calls.

## Setup Frontend

First of all you should clone the repository 'portal-frontend' either from the [Gitlab](https://gitlab.com/sibmip/portal-frontend) or the [GitHub](https://github.com/HBPMedical/portal-frontend).

Once the pull is completed, you can make the following commands

```bash
cd portal-frontend

git checkout dev

yarn install
```

### Environment file

Make sure that the .env or .env.development contains the following information

```yaml
REACT_APP_BACKEND_URL=http://127.0.0.1:8081
REACT_APP_GATEWAY_URL=$REACT_APP_BACKEND_URL/graphql
```

* REACT\_APP\_BACKEND\_URL
  * Is used to consume REST API call (migration to GraphQL is in progress)
* REACT\_APP\_GATEWAY\_URL
  * Is used to connect with GraphQL Gateway

### Start frontend

Depending the branch you are working on, you can start the Frontend with

```bash
yarn start
```

or

```bash
yarn watch
```

## Launch order

Each service could be launch at any time without respecting any specific order, however as the Frontend (react app) open automatically a browser tab for the local development, it is recommended to follow this launch order

`Engine -> Gateway -> Frontend`

If you are using `local` type in the Gateway you don't need to start the engine.
