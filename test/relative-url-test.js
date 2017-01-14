import test from 'tapava'; // eslint-disable-line
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

import { GraphQLRelativeUrl } from '../lib';

test('GraphQLRelativeUrl as field', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        foo: {
          type: GraphQLString,
          resolve(_, { arg }) {
            t.is(arg, '/bar', 'correct arg');
            return 'does-not-matter';
          },
          args: {
            arg: {
              type: GraphQLRelativeUrl
            }
          }
        }
      }
    })
  });

  const query1 = `{
    foo(arg: "/bar")
  }`;

  const query2 = `{
    foo(arg: 12345)
  }`;
  const query3 = `{
    foo(arg: "not valid url")
  }`;

  const expectedData = {
    foo: 'does-not-matter'
  };

  return Promise.all([
    graphql(schema, query1).then(({ data, errors }) => {
      t.deepEqual(data, expectedData, 'data is correct');
      t.is(errors, undefined, 'no error');
    }),
    graphql(schema, query2).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    }),
    graphql(schema, query3).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    })
  ]);
});

test('GraphQLRelativeUrl as resolved value', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        valid: {
          type: GraphQLRelativeUrl,
          resolve() {
            return '/bar';
          }
        },
        badType: {
          type: GraphQLRelativeUrl,
          resolve() {
            return 123;
          }
        },
        invalidUrl: {
          type: GraphQLRelativeUrl,
          resolve() {
            return 'not valid url';
          }
        }
      }
    })
  });

  const query1 = `{
    valid
  }`;

  const query2 = `{
    badType
  }`;
  const query3 = `{
    invalidUrl
  }`;

  const expectedData = {
    valid: '/bar'
  };

  return Promise.all([
    graphql(schema, query1).then(({ data, errors }) => {
      t.deepEqual(data, expectedData, 'data is correct');
      t.is(errors, undefined, 'no error');
    }),
    graphql(schema, query2).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    }),
    graphql(schema, query3).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    })
  ]);
});

test('GraphQLRelativeUrl as variables', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        foo: {
          type: GraphQLString,
          resolve(_, { arg }) {
            t.is(arg, '/bar', 'correct arg');
            return 'does-not-matter';
          },
          args: {
            arg: {
              type: GraphQLRelativeUrl
            }
          }
        }
      }
    })
  });

  const query = `query Foo($arg: RelativeUrl!) {
    foo(arg: $arg)
  }`;

  const expectedData = {
    foo: 'does-not-matter'
  };

  return Promise.all([
    graphql(schema, query, null, null, { arg: '/bar' }).then(({ data, errors }) => {
      t.deepEqual(data, expectedData, 'data is correct');
      t.is(errors, undefined, 'no error');
    }),
    graphql(schema, query, null, null, { arg: 123 }).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    }),
    graphql(schema, query, null, null, { arg: 'not valid url' }).then(({ errors }) => {
      t.is(errors && errors.length, 1, '1 error');
    })
  ]);
});

