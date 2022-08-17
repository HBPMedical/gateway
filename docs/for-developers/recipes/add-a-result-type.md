---
description: This page describe the process to add a type of result
---

# Add a result type

Result's types are defined in the gateway, in order to add a new type of result for the Frontend we need to create a new kind of result inside the gateway.&#x20;

All results are stored inside the `engine` module, specifically inside the `src/engine/models/result` folder.&#x20;

Let's create a model for the demonstration

{% code title="my-custom.model.ts" lineNumbers="true" %}
```typescript
@ObjectType()
export class MyCustomResult extends Result {
    @Field()
    name: string;
    
    @Field()
    customProperty: string;
}
```
{% endcode %}

Annotations are related to GraphQL, see more about GraphQL's annotation [here](https://docs.nestjs.com/graphql/resolvers#object-types).

Once our model is created we need to declare it as a part of the possible result types, for this open  the file `src/engine/models/result/common/result-union.model.ts` and add the type to the list

{% code title="result-union.model.ts" lineNumbers="true" %}
```typescript
export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [
    ...
    MyCustomResult,
  ],
  resolveType(value) {
    ...

    if (value.customProperty) return MyCustomResult 

    return RawResult;
  },
});

```
{% endcode %}

{% hint style="info" %}
The `resolveType` function help GraphQL determines the result's type when the object receive is a literal JavaScript object (not a class).
{% endhint %}

#### Integration in the Frontend

First of all, as describe in [this issue](https://github.com/apollographql/apollo-client/issues/7050), we need tell Apollo which types we should expect from this `union field`. Open the file `src/components/API/GraphQL/cache.tsx` and in the cache configuration, we need to add a mention to our new type

{% code title="cache.tsx" lineNumbers="true" %}
```typescript
export const cacheConfig = {
  possibleTypes: {
    // https://github.com/apollographql/apollo-client/issues/7050
    ResultUnion: [
      ...
      'MyCustomResult' // <- Our new result type
    ],
    ...
  },
  ...
}
```
{% endcode %}

Once the possible types is defined, we need to tell Apollo what we want to extract from the the specific result.&#x20;

open the file `src/components/API/GraphQL/fragments.ts` and add the details of our new result.&#x20;

{% code title="fragments.ts" lineNumbers="true" %}
```typescript
export const coreInfoResult = gql`
  fragment coreInfoResult on ResultUnion {
    ... on RawResult {
      rawdata
    }
    ... on MyCustomResult {
      name
      customProperty
    }
    (...)
  }
`;
```
{% endcode %}

After that we are all setup to receive a `MyCustomResult` from any Experiment.

