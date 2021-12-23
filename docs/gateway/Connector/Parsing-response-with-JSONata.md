# Parsing response with JSONdata

This page is dedicated to talk about the transformation of JSON data to fit the Gateway needs.

Most of the work done by the gateway is about transformation. The data receive by the engine is transformed in a way that could be consume by the front-end. There is a lot of work when adapting an old engine, most of the work can be achieve in JS/TS but it can be really time consuming and most of the time the code for data transformation is not really readable.

For this purpose we suggest to use a library to transform the data (JSON in that case) to fit the Gateway's models.

## JSONata

In order to simplify the transformation of JSON data, we choose the library [JSONata](https://jsonata.org) to do this work. JSONata is :

* Lightweight query and transformation language for JSON data
* Inspired by the location path semantics of XPath 3.1
* Sophisticated query expressions with minimal syntax
* Built in operators and functions for manipulating and combining data
* Create user-defined functions
* Format query results into any JSON output structure

It makes the transformation really easy to do, more readable and thus maintainable.

### Example

File _transformation.ts_

```ts
import * as jsonata from 'jsonata';

export const expression = jsonata(`
  $sum(Account.Order.Product.(Price * Quantity))
`);
```

File _converter.ts_

```ts
import { expression } from './transformations';

const data = `
{
  "Account": {
    "Account Name": "Firefly",
    "Order": [
      {
        "OrderID": "order103",
        "Product": [
          {
            "Product Name": "Bowler Hat",
            "ProductID": 858383,
            "SKU": "0406654608",
            "Description": {
              "Colour": "Purple",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.75
            },
            "Price": 34.45,
            "Quantity": 2
          },
          {
            "Product Name": "Trilby hat",
            "ProductID": 858236,
            "SKU": "0406634348",
            "Description": {
              "Colour": "Orange",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.6
            },
            "Price": 21.67,
            "Quantity": 1
          }
        ]
      }
    ]
  }
}
`;

const value: SOME_TYPE = expression.evaluate(data);

console.log(value);
```

### Conception / Debugging

You can try transformations and debug jsonata directly with the online tool : [https://try.jsonata.org](https://try.jsonata.org).
