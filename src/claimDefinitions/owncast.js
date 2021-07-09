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

const reURI = /^https:\/\/(.*)/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'owncast'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: `${uri}/api/config`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `${uri}/api/config`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.CONTAINS,
      path: ['socialHandles', 'url']
    }
  }
}

const tests = [
  {
    uri: 'https://live.domain.org',
    shouldMatch: true
  },
  {
    uri: 'https://live.domain.org/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live/',
    shouldMatch: true
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
