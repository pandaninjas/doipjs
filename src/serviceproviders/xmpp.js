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
const utils = require('../utils')

const reURI = /^xmpp:([a-zA-Z0-9\.\-\_]*)@([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'xmpp',
    },
    profile: {
      display: `${match[1]}@${match[2]}`,
      uri: uri,
      qr: uri,
    },
    proof: {
      uri: utils.generateProxyURL('xmpp', `${match[1]}@${match[2]}`, opts),
      fetch: null,
      access: proofAccess.SERVER,
      format: proofFormat.JSON,
    },
    claim: {
      fingerprint: null,
      format: claimFormat.MESSAGE,
      relation: claimRelation.CONTAINS,
      path: [],
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: true,
  },
  {
    uri: 'xmpp:alice@domain.org?omemo-sid-123456789=A1B2C3D4E5F6G7H8I9',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
