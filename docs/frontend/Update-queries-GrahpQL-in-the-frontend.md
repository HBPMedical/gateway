# Update GraphQL Queries

This guide is made to generate types and hooks (query/mutate) for the frontend based on the GraphQL API. This tool is used to avoid to do it manually.

#### Declare GrahpQL queries

To generate new types and hooks, you need to update the file `queries.ts`. In this file you should describe the query you want to make, the types needed will be automatically deducted from your description.

#### Update queries and types

To update or create new types and operations, you can run the following command :

```bash
yarn codegen
```

This command will generate all the operations and types for you. Remeber you should place the graphql's operations in the file `queries.ts` under the folder `src/components/API/GraphQL`. Types will be all generated in one file under the name `types.generated.ts`, operations will be in `queries.generated.tsx` file finally all fragments under the file `fragments.generated.tsx`.

### Links

* [GraphQL code generator](https://www.graphql-code-generator.com)
  * [GitHub](https://github.com/dotansimha/graphql-code-generator)
* [Issue: unable to find typescript-operations](https://github.com/dotansimha/graphql-code-generator/issues/2043)
