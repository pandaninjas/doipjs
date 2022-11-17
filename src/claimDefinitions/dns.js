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

const reURI = /^dns:([a-zA-Z0-9.\-_]*)(?:\?(.*))?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'dns'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`,
      qr: null
    },
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.DNS,
        access: E.ProofAccess.SERVER,
        format: E.ProofFormat.JSON,
        data: {
          domain: match[1]
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['records', 'txt']
    }]
  }
}

const tests = [
  {
    uri: 'dns:domain.org',
    shouldMatch: true
  },
  {
    uri: 'dns:domain.org?type=TXT',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
