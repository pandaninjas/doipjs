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

const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`,
      qr: null
    },
    markers: [],
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          // Returns an oembed json object with the tweet content in html form
          url: `https://publish.twitter.com/oembed?${new URLSearchParams({ url: match[0], omit_script: 1 })}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: ['html']
    }]
  }
}

const tests = [
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789',
    shouldMatch: true
  },
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/status/1234567890123456789',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
