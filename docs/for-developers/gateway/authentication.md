# 🔑 Authentication

The authentication implementation is based on [passport.js](https://www.passportjs.org) it allows a flexible way to implement different strategies inside the gateway.&#x20;

For now the authentication system is quite simple and only use JWT. The real implementation of  authorization and authentication is left to the connector/engine.&#x20;

#### How it works ?

The communication between the frontend and the gateway is handled by JWT token who contains user information such as his username.

![](<../../.gitbook/assets/image (2).png>)

The gateway will handle the authentication process with the frontend in a unique fashion always using a JWT token. This token can contains information specific to some connector. For that purpose the user model contains a field `extraFields` which basically a dictionary.&#x20;

{% code title="user.model.ts" %}
```typescript
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  fullname?: string;

  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true, default: false })
  @Field({ nullable: true })
  agreeNDA?: boolean;

  extraFields?: Record<string, any>;
}
```
{% endcode %}

This field can be used by the connector to store information related to the user as other token for engine API endpoints.

#### Login&#x20;

The real login system is delegated to the connector by using the `login` method in the interface.

{% code title="connector.interface.ts" %}
```typescript
export interface Connector {
  // ...
  
  /**
   * Method that login a user with username and password
   * @param username
   * @param password
   * @returns User object or empty if user not found
   */
  login?(
    username: string,
    password: string,
  ): Promise<User | undefined>;

  // ...
}
```
{% endcode %}

This method can be optional as the authentication can be made by a 3rd party system under the same domain as this is the case for `exareme`.

When the login is performed, this function should return a `User` object and can feed the `extraFields` attribute with data needed to perform future request to the engine.

#### Logout

The same mechanism is applied to the logout system using the method logout from the engine.

{% code title="connector.interface.ts" %}
```typescript
export interface Connector {
  // ...
  
  logout?(req: Request
  ): Promise<void>;

  // ...
}
```
{% endcode %}

#### Session validation

Whenever a Frontend required a refreshToken, the gateway should tell if the user is still connected to the engine. For this, your connector should implements the function **isSessionValid**.&#x20;

{% code title="connector.interface.ts" %}
```typescript
export interface Connector {
  // ...
  
  isSessionValid?(user: User): Promise<boolean>;

  // ...
}
```
{% endcode %}

This function should ensure that the user can still access the engine with the current token.

#### How to get the user&#x20;

Whether you use the local login or a 3rd party system, there is a unique way to access the user inside the Gateway. This method through the request :&#x20;

```typescript
request.user
```

This request's attribute is feed by strategy policies defined in the Gateway. Currently the following strategies are applied&#x20;

1. JWT cookies
2. JWT bearer
3. Engine (use the connector to retrieve the user)

Even if the `AUTH_SKIP` is defined you should be able to retrieve the user through the request.

