import assertErr from 'assert-err';
import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';
import isAbsoluteUrl from 'is-url-superb';
import __isRelativeUrl from 'is-relative-url';

const _isRelativeUrl = url => url[0] === '/' && __isRelativeUrl(url);

const isRelativeUrl = url => _isRelativeUrl(url) && isAbsoluteUrl(`https://foo.com${url}`);
const isUrl = url => (_isRelativeUrl(url) ?
  isAbsoluteUrl(`https://foo.com${url}`) : isAbsoluteUrl(url));

const validateUrl = (url) => {
  assertErr(isUrl(url), Error, `${url} is not a valid url`);
  return url;
};

const validateRelativeUrl = (url) => {
  assertErr(isRelativeUrl(url), Error, `${url} is not a valid url`);
  return url;
};

const validateAbsoluteUrl = (url) => {
  assertErr(isAbsoluteUrl(url), Error, `${url} is not a valid url`);
  return url;
};

export const GraphQLUrl = new GraphQLScalarType({
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

export const GraphQLRelativeUrl = new GraphQLScalarType({
  name: 'RelativeUrl',
  serialize: validateRelativeUrl,
  parseValue: validateRelativeUrl,
  parseLiteral(ast) {
    assertErr(ast.kind === Kind.STRING,
      GraphQLError, `Query error: Can only parse strings to urls but got a: ${ast.kind}`, [ast]);

    assertErr(isRelativeUrl(ast.value), GraphQLError, 'Query error: Invalid url', [ast]);

    return ast.value;
  }
});

export const GraphQLAbsoluteUrl = new GraphQLScalarType({
  name: 'AbsoluteUrl',
  serialize: validateAbsoluteUrl,
  parseValue: validateAbsoluteUrl,
  parseLiteral(ast) {
    assertErr(ast.kind === Kind.STRING,
      GraphQLError, `Query error: Can only parse strings to AbsvalidateAbsoluteUrls but got a: ${ast.kind}`, [ast]);

    assertErr(isAbsoluteUrl(ast.value), GraphQLError, 'Query error: Invalid url', [ast]);

    return ast.value;
  }
});
