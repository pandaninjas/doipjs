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

const reURI = /^tg:user=([a-zA-Z0-9_]{5,32})&chat=([a-zA-Z0-9_]{5,32})/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'telegram'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://t.me/${match[1]}`,
      qr: null
    },
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.TELEGRAM,
        access: E.ProofAccess.GRANTED,
        format: E.ProofFormat.JSON,
        data: {
          user: match[1],
          chat: match[2]
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.EQUALS,
      path: ['text']
    }
  }
}

const tests = [
  {
    uri: 'tg:user=alice&chat=foobar',
    shouldMatch: true
  },
  {
    uri: 'tg:user=complex_user_1234&chat=complex_chat_1234',
    shouldMatch: true
  },
  {
    uri: 'tg:user=&chat=foobar',
    shouldMatch: false
  },
  {
    uri: 'tg:user=foobar&chat=',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
