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
const bent = require('bent')
const req = bent('GET')
const queryString = require('query-string')
const utils = require('../utils')
const reURI = /^matrix\:u\/(\@[^:]*\:[^?]*)(\?.*)?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)
  let proofUrl = null
  if (match[2]) {
    const params = queryString.parse(match[2])
    if ('org.keyoxide.e' in params && 'org.keyoxide.r' in params) {
      proofUrl = utils.generateProxyURL('matrix', [params['org.keyoxide.r'], params['org.keyoxide.e']], opts)
    }
  }

  return {
    serviceprovider: {
      type: 'communication',
      name: 'matrix',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: proofUrl,
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['data', 'content', 'body'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'matrix:u/@alice:matrix.domain.org',
    shouldMatch: true,
  },
  {
    uri: 'matrix:u/@alice:matrix.domain.org?org.keyoxide.r=!123:domain.org&org.keyoxide.e=$123',
    shouldMatch: true,
  },
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: false,
  },
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
