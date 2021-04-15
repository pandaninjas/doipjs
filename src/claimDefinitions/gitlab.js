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

const reURI = /^https:\/\/(.*)\/(.*)\/gitlab_proof\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitlab',
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true,
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.GITLAB,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          domain: match[1],
          username: match[2],
        }
      }
    },
    claim: {
      format: E.ClaimFormat.MESSAGE,
      relation: E.ClaimRelation.EQUALS,
      path: ['description'],
    },
  }
}

const tests = [
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof',
    shouldMatch: true,
  },
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/other_proof',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
