# Update GraphQL Queries

## New method

The context of the this page is related to the portal-frontend not the gateway directly.

In order to update or create new types and operations, you can proceed with the following command :

```bash
yarn codegen
```

This command will generate all the operations and types for you. You should place the graphql's operations in the file queries.ts under the folder `src/components/API/GraphQL`. Types will be all generated in one file under the name `types.generated.ts`, operations will be in `queries.generated.tsx` file and all fragments under the file `fragments.generated.tsx`.

***

## Previous method

This method is no more needed as the front-portal has been updated and all the commands can be made on the front directly.

### Context

_(This guide mainly follow the procedure describe here : https://blog.logrocket.com/build-graphql-react-app-typescript/)_

This guide is made to generate types and hooks to query/mutate for the frontend based on the GraphQL API. This tool is used to avoid to do it manually.

The generation could be made directly from the frontend project but due to the old dependencies in the current frontend project it does not work.

The guide, that will be describe here, is a workaround to generate the types/hooks outside of the front project.

### Procedure

First of all make sur that you have npm and yarn installed on your system.

The first to do is to create a new react typescript project

#### Setup dependencies

Create an empty folder and run after these commands from the newly created folder :

`yarn add @apollo/client graphql`

`yarn add -D @graphql-codegen/cli`

It will setup all the dependencies needed to generated the types and hooks.

#### Declare GrahpQL queries

To generate the types and hooks, you need to provide the queries that you'll be using, so you need to put a file named `queries.ts`, an example is provided :

```ts
import { gql } from '@apollo/client';

export const QUERY_DOMAINS = gql`
  query listDomains {
    domains {
      id
    }
  }
`;

export const QUERY2 = gql`
  query listVariables {
    domains {
      variables {
        id
      }
    }
  }
`;

...
```

#### Init codegen configuration

To init codegen configuration, you can enter the following command

`npx graphql-codegen init`

After that you will need to provide some information :

* What type of application are you building ?
  * Choose `Application built with React`
* Where is your schema ?
  * Give the url of your graphql's endpoint (default : http://127.0.0.1:8081/graphql)
* Where are your operations and fragments ?
  * `./queries.ts`
* Pick plugins
  * Let the default 3 plugins : TS, TS Operations, TS React Apollo
* Where to write the output
  * `src/generated/graphql.tsx` (default)
* Do you want to generated an introspection file ?
  * no
* How to name the config file ?
  * `codegen.yml`
* What script in package.json should run the codegen
  * `codegen`

After this process you will need to run `yarn install` in order to install the new dependencies that have been added to the package.json.

#### Generate and integrate

Everything is now configured, you just need to run `yarn codegen` it will generated all you need in ./src/generated/graphql.tsx. You can copy the content of the generated replace the previous one if there is one or just create a new file under /src/generated/graphql.tsx

If an error occurs telling you `Unable to find template plugin matching typescript-operations` you should try to run this command `npm i -D @graphql-codegen/typescript change-case` (see issue in the link section) and retry the previous command.

**Update queries.ts**

If you needed to regenerate the GrahpQL types and hooks you can keep your folder that is already setup and just change the content of the queries.ts, re-run `yarn codegen` and that's it.

### Links

* [GraphQL code generator](https://www.graphql-code-generator.com)
  * [GitHub](https://github.com/dotansimha/graphql-code-generator)
* [Issue: unable to find typescript-operations](https://github.com/dotansimha/graphql-code-generator/issues/2043)
