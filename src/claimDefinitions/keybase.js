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

const reURI = /^https:\/\/keybase.io\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'keybase'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri,
      qr: null
    },
    proof: {
      uri: `https://keybase.io/_/api/1.0/user/lookup.json?username=${match[1]}`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://keybase.io/_/api/1.0/user/lookup.json?username=${match[1]}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.FINGERPRINT,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: ['them', 'public_keys', 'primary', 'key_fingerprint']
    }]
  }
}

const tests = [
  {
    uri: 'https://keybase.io/Alice',
    shouldMatch: true
  },
  {
    uri: 'https://keybase.io/Alice/',
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
