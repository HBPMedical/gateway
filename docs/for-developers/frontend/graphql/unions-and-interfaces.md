---
description: Abstract schema types
---

# Unions and interfaces

**Unions** and **interfaces** are abstract GraphQL types that enable a schema field to return one of multiple object types.

Read more about [unions and interface](https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/).

In order to be correctly interpreted in the Frontend, especially when dealing [with fragments](https://github.com/apollographql/apollo-client/issues/7050), we have to provide to the cache the possible types for a fragment.&#x20;

{% hint style="warning" %}
In the file `cache.tsx`, within the parameter `possiblesTypes` you should provide a list of types that you expect to see in the GraphQL responses, if a type is missing this will result in a empty response for the specific type missing.&#x20;
{% endhint %}

