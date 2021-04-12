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
const { proofAccess, proofFormat, claimFormat, claimRelation } = require('../enums')

const reURI = /^https:\/\/(.*)\/(.*)\/gitea_proof\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitea',
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://${match[1]}/api/v1/repos/${match[2]}/gitea_proof`,
      access: proofAccess.NOCORS,
      format: proofFormat.JSON,
    },
    claim: {
      fingerprint: null,
      format: claimFormat.MESSAGE,
      relation: claimRelation.EQUALS,
      path: ['description'],
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/alice/gitea_proof',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/gitea_proof/',
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
