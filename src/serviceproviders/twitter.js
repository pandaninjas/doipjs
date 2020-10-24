/*
Copyright 2020 Yarmo Mackenbach

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
const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter'
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://mobile.twitter.com/${match[1]}/status/${match[2]}`,
      useProxy: false,
      format: 'text'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: null,
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789',
    shouldMatch: true
  },
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/status/1234567890123456789',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
