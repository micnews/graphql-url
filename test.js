const test = require('tapava'); // eslint-disable-line
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const GraphqlUrl = require('./');

test('GraphqlUrl as field', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        foo: {
          type: GraphQLString,
          resolve(_, { arg }) {
            t.is(arg, 'https://foo.com/bar', 'correct arg');
            return 'does-not-matter';
          },
          args: {
            arg: {
              type: GraphqlUrl
            }
          }
        }
      }
    })
  });

  const query1 = `{
    foo(arg: "https://foo.com/bar")
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

test('GraphqlUrl as resolved value', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        valid: {
          type: GraphqlUrl,
          resolve() {
            return 'https://foo.com/bar';
          }
        },
        badType: {
          type: GraphqlUrl,
          resolve() {
            return 123;
          }
        },
        invalidUrl: {
          type: GraphqlUrl,
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
    valid: 'https://foo.com/bar'
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

test('GraphqlUrl as variables', (t) => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        foo: {
          type: GraphQLString,
          resolve(_, { arg }) {
            t.is(arg, 'https://foo.com/bar', 'correct arg');
            return 'does-not-matter';
          },
          args: {
            arg: {
              type: GraphqlUrl
            }
          }
        }
      }
    })
  });

  const query = `query Foo($arg: Url!) {
    foo(arg: $arg)
  }`;

  const expectedData = {
    foo: 'does-not-matter'
  };

  return Promise.all([
    graphql(schema, query, null, null, { arg: 'https://foo.com/bar' }).then(({ data, errors }) => {
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

