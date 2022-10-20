# Decorators

The request and response made by `GraphQL` are a bit different then what you should expect from a normal REST API. For this purpose and as this is something that is often used, two decorators have been implemented to inject the request. The request can be injected with the decorator `@GQLRequest` and the response with `@GQLResponse` and finally the user can also be injected by using the `@CurrentUser`.&#x20;

These 3 decorators can only be use in a GraphQL context, it will fail if it's a standard API REST request.

