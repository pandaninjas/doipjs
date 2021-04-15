/*
Copyright 2021 Yarmo Mackenbach

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const E = require('../enums')
const queryString = require('query-string')

const reURI = /^matrix\:u\/(?:\@)?([^@:]*\:[^?]*)(\?.*)?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  if (!match[2]) {
    return null
  }

  const params = queryString.parse(match[2])

  if (!('org.keyoxide.e' in params && 'org.keyoxide.r' in params)) {
    return null
  }

  const profileUrl = `https://matrix.to/#/@${match[1]}`
  const eventUrl = `https://matrix.to/#/${params['org.keyoxide.r']}/${params['org.keyoxide.e']}`

  return {
    serviceprovider: {
      type: 'communication',
      name: 'matrix',
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false,
    },
    profile: {
      display: `@${match[1]}`,
      uri: profileUrl,
      qr: null,
    },
    proof: {
      uri: eventUrl,
      request: {
        fetcher: E.Fetcher.MATRIX,
        access: E.ProofAccess.GRANTED,
        format: E.ProofFormat.JSON,
        data: {
          eventId: params['org.keyoxide.e'],
          roomId: params['org.keyoxide.r'],
        }
      }
    },
    claim: {
      format: E.ClaimFormat.MESSAGE,
      relation: E.ClaimRelation.CONTAINS,
      path: ['content', 'body'],
    },
  }
}

const tests = [
  {
    uri:
      'matrix:u/alice:matrix.domain.org?org.keyoxide.r=!123:domain.org&org.keyoxide.e=$123',
    shouldMatch: true,
  },
  {
    uri: 'matrix:u/alice:matrix.domain.org',
    shouldMatch: true,
  },
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: false,
  },
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
