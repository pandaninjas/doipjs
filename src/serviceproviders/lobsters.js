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

const reURI = /^https:\/\/lobste\.rs\/u\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'lobsters',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: `https://lobste.rs/u/${match[1]}.json`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://lobste.rs/u/${match[1]}.json`,
        }
      }
    },
    claim: {
      fingerprint: null,
      format: E.ClaimFormat.MESSAGE,
      relation: E.ClaimRelation.CONTAINS,
      path: ['about'],
    },
  }
}

const tests = [
  {
    uri: 'https://lobste.rs/u/Alice',
    shouldMatch: true,
  },
  {
    uri: 'https://lobste.rs/u/Alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/u/Alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
