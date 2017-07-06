# graphql-url

> graphql scalar validating that it's a correct url

## Installation

```shell
yarn install graphql-url [--dev]
```

## Usage

This module exports 3 different scalars - one for absolute urls (`GraphQLAbsoluteUrl`), one for relative urls (`GraphQLRelativeUrl`) and one for either relative or absolute urls (`GraphQLUrl`);

```js
import { GraphQLUrl } from 'graphql-url';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      foo: {
        type: GraphQLUrl,
        resolve() {
          return 'https://foo.com/bar';
        }
      }
    }
  })
});
```
