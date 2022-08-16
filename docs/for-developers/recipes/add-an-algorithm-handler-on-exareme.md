---
description: >-
  This page describe how algorithm's outputs are processed with Exareme (I & II)
  connector
---

# Add an algorithm handler on Exareme

Exareme algorithms' ouputs are processed based on the design pattern [chain of responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility). Basically every algorithm has an handler that can decide to process the output. Each handler has the responsibility to know if it can handle the current output or not.&#x20;

### Add a new handler&#x20;

Each handler should implements the `ResultHandler` interface. The handler can also directly extends the class `BaseHandler` which provides default implementation of the previous interface.

For this demonstration we will create a new Handler called `MyAlgorithm`. First we will create a new file inside the `src/engine/connectors/exareme/handlers/algorithms` folder.

{% code title="my-algorithm.handler.ts" lineNumbers="true" %}
```typescript
export default class MyAlgorithmHandler extends BaseHandler {

 handle(experiment: Experiment, data: any, domain?: Domain): void {
  ...
 }
 
}
```
{% endcode %}

The handler can either process the request or pass it to the next handler along the chain. For this concern we will define a new method in our algorithm to define the ability or not to handle the request.

{% code lineNumbers="true" %}
```typescript
export default class MyAlgorithmHandler extends BaseHandler {
    public static readonly ALGO_NAME = 'myAlgorithmName';
    
    private canHandle(data: any) {
      return (
              data &&
              data.mySuperProperty &&
              data.algorithmName = MyAlgorithmHandler.ALGO_NAME
          );
    }
    
    handle(experiment: Experiment, data: any, domain? Domain) {
      if (!this.canHandle(data: any)) return super.handle(experiment, data, domain);
      
      //Process the data
    }
}
```
{% endcode %}

{% hint style="warning" %}
Make sure to call the next handler either by calling directly `this.next(...)` or `super.handler(...)` otherwise it will end the chaining system
{% endhint %}

The idea of the chaining system is to improve the `Experiment` object that is passed along the chain. This object is acting like a Request object, it's mutable, then you can modify it to fit the need of your handler.

Here we will add a result inside our experiment for the purpose of the demonstration.&#x20;

{% code lineNumbers="true" %}
```typescript
export default class MyAlgorithmHandler extends BaseHandler {
    public static readonly ALGO_NAME = 'myAlgorithmName';
    
    private canHandle(data: any) {
      return (
              data &&
              data.mySuperProperty &&
              data.algorithmName = MyAlgorithmHandler.ALGO_NAME
          );
    }
    
    private getTableResult(data: any): TableResult {
      const tableResult: TableResult = {
        name: 'Results',
        tableStyle: TableStyle.NORMAL,
        headers: ['name', 'value'].map((name) => ({ name, type: 'string' })),
        data: [
          'n_obs',
          't_value',
          'ci_upper',
          'cohens_d',
        ].map((name) => [
          name,
          data[name],
        ]),
      };
  
      return tableResult;
  }
    
    handle(experiment: Experiment, data: any, domain? Domain) {
      if (!this.canHandle(data: any)) return super.handle(experiment, data, domain);
      
      const tableResult = this.getTableResult(data);
      if (tableResult) exp.results.push(tableResult);
    }
}
```
{% endcode %}

In lines 34 and 35 we know that our handler is up to deal with the request, so our handle can produce the result wanted and add it the experiment.&#x20;

Now we can decide to either end the request here or pass it the next handler. As we know that only one algorithm should process the output we can end the request here by not calling the next handle.

#### Add it to the chaining system

Now that we have created our algorithm we should add it to the chaining system, open the file `src/engine/connectors/exareme/handlers/index.ts` and simply add our new class to the list

{% code title="index.ts" lineNumbers="true" %}
```typescript
const start = new PearsonHandler();

start
  .setNext(new DescriptiveHandler())
  .setNext(new AnovaOneWayHandler())
  .setNext(new PCAHandler())
  .setNext(new LinearRegressionHandler())
  .setNext(new MyAlgorithmHandler())
  .setNext(new RawHandler()); // should be last handler as it works as a fallback (if other handlers could not process the results)

export default (exp: Experiment, data: unknown, domain: Domain): Experiment => {
  start.handle(exp, data, domain);
  return exp;
};

```
{% endcode %}

The handlers' order is important, if you want to check something in priority, just put it in the top of the list.&#x20;

{% hint style="info" %}
This  order  can be useful if you want to process error at first. You can easily create a connector that could handle global error before passing along the chain system
{% endhint %}

{% hint style="warning" %}
Don't forget to write a unit test along of your handler, conventionally called `my-algorithm.handler.spec.ts`.
{% endhint %}



