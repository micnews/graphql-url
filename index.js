const assertErr = require('assert-err');
const { GraphQLScalarType } = require('graphql');
const { GraphQLError } = require('graphql/error');
const { Kind } = require('graphql/language');
const isUrl = require('is-url-superb');

const validateUrl = (url) => {
  assertErr(isUrl(url), Error, `${url} is not a valid url`);
  return url;
};

module.exports = new GraphQLScalarType({
  name: 'Url',
  serialize: validateUrl,
  parseValue: validateUrl,
  parseLiteral(ast) {
    assertErr(ast.kind === Kind.STRING,
      GraphQLError, `Query error: Can only parse strings to urls but got a: ${ast.kind}`, [ast]);

    assertErr(isUrl(ast.value), GraphQLError, 'Query error: Invalid url', [ast]);

    return ast.value;
  }
});
