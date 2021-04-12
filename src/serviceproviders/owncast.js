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

const reURI = /^https:\/\/(.*)/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'owncast',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: `${uri}/api/config`,
      fetch: null,
      access: proofAccess.GENERIC,
      format: proofFormat.JSON,
    },
    claim: {
      fingerprint: null,
      format: claimFormat.FINGERPRINT,
      relation: claimRelation.CONTAINS,
      path: ['socialHandles', 'url'],
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://live.domain.org',
    shouldMatch: true,
  },
  {
    uri: 'https://live.domain.org/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/live',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/live/',
    shouldMatch: true,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
