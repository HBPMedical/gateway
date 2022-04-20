# Authentication

The authentication implementation is based on [passport.js](https://www.passportjs.org) it allows a flexible way to implement different strategies inside the gateway.&#x20;

For now the authentication system is quite simple and only use JWT. The real implementation of  authorization and authentication is left to the connector.&#x20;

#### How it works ?

The communication between the frontend and the gateway is handled by JWT token who contains user information such as his username.

![](<../.gitbook/assets/image (2).png>)

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

{% code title="engine.interface.ts" %}
```typescript
export interface IEngineService {
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

{% code title="engine.interface.ts" %}
```typescript
export interface IEngineService {
  // ...
  
  logout?(req: Request
  ): Promise<void>;

  // ...
}
```
{% endcode %}

