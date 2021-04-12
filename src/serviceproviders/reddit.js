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

const reURI = /^https:\/\/(?:www\.)?reddit\.com\/user\/(.*)\/comments\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'reddit',
    },
    profile: {
      display: match[1],
      uri: `https://www.reddit.com/user/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://www.reddit.com/user/${match[1]}/comments/${match[2]}.json`,
      access: proofAccess.NOCORS,
      format: proofFormat.JSON,
    },
    claim: {
      fingerprint: null,
      format: claimFormat.MESSAGE,
      relation: claimRelation.CONTAINS,
      path: ['data', 'children', 'data', 'selftext'],
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true,
  },
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true,
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true,
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/user/Alice/comments/123456/post',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
