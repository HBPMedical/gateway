# 👥 Users

This page describe how users are managed in the gateway. There is mainly two functions in the users module&#x20;

* `GetUser` which retrieve the current user logged in (active user)
* `UpdateUser` which allow the active user to modify is own profile (mainly for `agreeNDA`)

The gateway is not meant to manage users directly. This is the engine's role to provide the user and a way to modify them. Thus the gateway provide support for some specific user's attribute that are closely related to the MIP usage. For now the Gateway can only manage the `agreeNDA` property for each user but this can be easily extended.

### How it works ?

Let's say we want to retrieve the current user, the gateway will ask through the connector for the user's data in the same time the gateway will look in his own database if it has some data for this user. Then both data are merged to fit the User model. Data from the engine have precedence over the gateway data in case of conflict.

{% code title="user.model.ts" %}
```typescript
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

After merging data from both source and make some integrity check the gateway will be able to present a full user object in a flexible way.

#### Update user profile

So now we know that the data can be retrieve through two different sources, how will we handle updating our user profile ? The system is simple, the gateway will ask the connector if he can handle the user's update by looking if the function `updateUser` is defined in the connector. If it's defined it means that the engine can handle at least some part of the update, so we delay the work to the engine. Now if the engine cannot handle all the update data, the connector can decide to return some attributes back to the gateway.&#x20;

{% code title="example return update data" %}
```typescript
  async updateUser(
     request: Request,
     userId: string, 
     data: UpdateUserInput
   ): Promise<UpdateUserInput | undefined> {
    const path = this.options.baseurl + 'user';
    const response = await firstValueFrom(
      this.post<string>(request, path, {
        prop1: data.attrib1,
        prop2: data.attrib2
      }),
    );

    const { attrib1, attrib2, ...subset } = UpdateUserInput // Subset of updateData
    return subset;
  }
```
{% endcode %}

The returned attributes will be provided back to the gateway and will be handle internally as far as it can do it.
