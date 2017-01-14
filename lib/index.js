import assertErr from 'assert-err';
import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';
import isUrl from 'is-url-superb';

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
