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

const reURI = /^https:\/\/(.*)\/?/

const processURI = (uri) => {
  return {
    serviceprovider: {
      type: 'web',
      name: 'activitypub'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: uri,
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.ACTIVITYPUB,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: uri
        }
      }
    },
    claim: [
      {
        format: E.ClaimFormat.FINGERPRINT,
        relation: E.ClaimRelation.CONTAINS,
        path: ['summary']
      },
      {
        format: E.ClaimFormat.FINGERPRINT,
        relation: E.ClaimRelation.CONTAINS,
        path: ['attachment', 'value']
      }
    ],
    functions: {
      postprocess: (claimData, proofData) => {
        claimData.profile.display = `${proofData.result.preferredUsername}@${new URL(proofData.result.url).hostname}`
        return { claimData, proofData }
      }
    }
  }
}

const tests = [
  {
    uri: 'https://domain.org',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/@/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/u/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/users/alice/',
    shouldMatch: true
  },
  {
    uri: 'http://domain.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
