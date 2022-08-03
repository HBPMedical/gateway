---
description: This page describe how to create a connector
---

# Create a connector

All connectors have a folder under `src/engine/connectors/`. If you want to create a new connector, the first thing to do is to create a folder with the name of your connector. Take care that the connector name should be unique.&#x20;

Inside your folder `src/engine/connectors/example/` you need a file name after your connector for e.g. `src/engine/connectors/example/example.connector.ts`. The connector should have the same name as your folder.

The connector instantiation is managed by the `engine.service.ts`.

Here is a minimal implementation of a connector

{% code title="example.connector.ts" %}
```typescript
import { NotImplementedException } from '@nestjs/common';
import { ExperimentResult } from 'src/common/interfaces/utilities.interface';
import Connector from 'src/engine/interfaces/connector.interface';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { User } from 'src/users/models/user.model';

export default class LocalConnector implements Connector {
  async login(): Promise<User> {
    throw new NotImplementedException();
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    throw new NotImplementedException();
  }

  async runExperiment(): Promise<ExperimentResult[]> {
    throw new NotImplementedException();
  }

  async getDomains(): Promise<Domain[]> {
    throw new NotImplementedException();
  }

  async getActiveUser(): Promise<User> {
    throw new NotImplementedException();
  }
}
```
{% endcode %}

### Constructor

The engine service will inject some properties into the connector through the constructor that the connector is free to use or not.

```typescript
  constructor(
    private readonly options: EngineOptions,
    private readonly httpService: HttpService,
    private readonly engineService: EngineService,
  ) {}
```

The first parameter, `options`, is a key-value store that contains the `ENGINE_TYPE` and the `ENGINE_BASE_URL`.

The second parameter, `httpService`, is an `Axios` instance shared between all request.

The third parameter, `engineService`, is the engine service which inject itself into the connector. This can be useful because engine service provide utility functions and use the cache system. So you should always call engine service when you want to access to `algorithms` and `domains` to avoid to access external resources.

### Experiments

The Gateway offers two possibilities to manage experiment&#x20;

1. Experiments are managed (save, edit, delete, etc...) directly internally
2. Experiments are managed by the external engine.

#### Case 1

In case 1, we assume that the external engine will only offers the possibility to run experiment (not save them). In this case the connector should only implements `runExperiment`. The gateway will recognize that `runExperiment` is implemented and that it needs to manage the experiments internally.

This is done by using a `PostgreSQL` database.

#### Case 2

In case 2, we let the external engine manage experiments by itself. This required that the connector implements `createExperiment` and not `runExperiment`.

This also implies that the connector need to implements these functions

* `getExperiment`
* `listExperiments`
* `removeExperiment`
* `editExperiment`

This will delegate all the CRUD work to the external engine.&#x20;

### Authentication & users

There are two possibilities of authentication both relay on a external resource. The only difference will be about how the user token is managed.

1. Inside the Gateway
2. Outside the Gateway

#### Case 1

In case 1, the identification is managed inside the gateway and the connector is responsible for making the authentication through the function `login`.&#x20;

The Gateway will then manage the token between the Frontend and the Gateway with a Json Web Token.

The logout is managed by the method `logout`. After calling `logout` from the connector, the gateway will remove the token from the user's headers.

#### Case 2

In case 2, identification and authentication will both be managed externally through a resource that  is located under the URL `/services/sso` for example a [KeyCloak](https://www.keycloak.org/) (exareme is using this strategy). This implies that the `editActiveUser` is implemented and allows updating the user (needed if ToS is enabled).

In both cases, the `getActiveUser` will retrieve the current user logged.&#x20;

### Configuration

The connector has it's own part of configuration, it's mainly parameters that are closely related to the connector and not really with the overall configuration.

| name        | default | description                                                                                             |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------- |
| hasGrouping | false   | Define if the connector is able to make query grouping by nominal variable (mainly used for histograms) |
| hasGalaxy   | false   | `Deprecated`. Only used by Exareme engine                                                               |

These elements can be configured by the function `getConfiguration`.

#### Filter

Filter configuration describe the types of variables that can be considered as number. These types are closely related to the connector as types is depending on the engine used.&#x20;

The types that should be considered as numbers can be configured by defining the function `getFilterConfiguration`.&#x20;

`['real', 'integer']` are the default types.

#### Formula

Formula configuration give a list of available variable operations. Each element contains two properties, the variable type and an operation's list.

```json
[
    {
        variableType: 'real',
        operationTypes: ['log', 'center', ...]
    },
    ...
]
```

To define operations, the connector should implements `getFormulaConfiguration`.



&#x20;

&#x20;

