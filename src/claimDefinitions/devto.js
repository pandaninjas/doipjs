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

const reURI = /^https:\/\/dev\.to\/(.*)\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'devto'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://dev.to/${match[1]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://dev.to/api/articles/${match[1]}/${match[2]}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['body_markdown']
    }
  }
}

const tests = [
  {
    uri: 'https://dev.to/alice/post',
    shouldMatch: true
  },
  {
    uri: 'https://dev.to/alice/post/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/post',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
