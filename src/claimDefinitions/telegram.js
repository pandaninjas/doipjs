/*
Copyright 2022 Maximilian Siling

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

const reURI = /https:\/\/t.me\/([A-Za-z0-9_]{5,32})\?proof=([A-Za-z0-9_]{5,32})/

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
      qr: `https://t.me/${match[1]}`
    },
    proof: {
      uri: `https://t.me/${match[2]}`,
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
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.EQUALS,
      path: ['text']
    }
  }
}

const tests = [
  {
    uri: 'https://t.me/alice?proof=foobar',
    shouldMatch: true
  },
  {
    uri: 'https://t.me/complex_user_1234?proof=complex_chat_1234',
    shouldMatch: true
  },
  {
    uri: 'https://t.me/foobar',
    shouldMatch: false
  },
  {
    uri: 'https://t.me/foobar?proof=',
    shouldMatch: false
  },
  {
    uri: 'https://t.me/?proof=foobar',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
