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

const reURI = /^irc:\/\/(.*)\/([a-zA-Z0-9\-[\]\\`_^{|}]*)/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'irc'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `irc://${match[1]}/${match[2]}`,
      uri: uri,
      qr: null
    },
    markers: [],
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.IRC,
        access: E.ProofAccess.SERVER,
        format: E.ProofFormat.JSON,
        data: {
          domain: match[1],
          nick: match[2]
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: []
    }]
  }
}

const tests = [
  {
    uri: 'irc://chat.ircserver.org/Alice1',
    shouldMatch: true
  },
  {
    uri: 'irc://chat.ircserver.org/alice?param=123',
    shouldMatch: true
  },
  {
    uri: 'irc://chat.ircserver.org/alice_bob',
    shouldMatch: true
  },
  {
    uri: 'https://chat.ircserver.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
