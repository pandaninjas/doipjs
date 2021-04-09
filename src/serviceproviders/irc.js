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
const utils = require('../utils')
const reURI = /^irc\:\/\/(.*)\/([a-zA-Z0-9]*)/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'irc',
    },
    profile: {
      display: `irc://${match[1]}/${match[2]}`,
      uri: uri,
      qr: null,
    },
    proof: {
      uri: utils.generateProxyURL('irc', [match[1], match[2]], opts),
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: [],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'irc://chat.ircserver.org/Alice1',
    shouldMatch: true,
  },
  {
    uri: 'irc://chat.ircserver.org/alice?param=123',
    shouldMatch: true,
  },
  {
    uri: 'https://chat.ircserver.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
