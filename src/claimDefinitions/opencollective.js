/*
Copyright 2023 Yarmo Mackenbach

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

const reURI = /^https:\/\/opencollective\.com\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'opencollective'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.GRAPHQL,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: 'https://api.opencollective.com/graphql/v2',
          query: `{ "query": "query { collective(slug: \\"${match[1]}\\") { longDescription } }" }`
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: ['data', 'collective', 'longDescription']
    }]
  }
}

const tests = [
  {
    uri: 'https://opencollective.com/Alice',
    shouldMatch: true
  },
  {
    uri: 'https://opencollective.com/Alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/Alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
