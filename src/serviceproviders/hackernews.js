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
const reURI = /^https:\/\/news\.ycombinator\.com\/user\?id=(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'hackernews'
    },
    profile: {
      display: match[1],
      uri: uri
    },
    proof: {
      uri: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
      fetch: null,
      useProxy: true,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['about'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://news.ycombinator.com/user?id=Alice',
    shouldMatch: true
  },
  {
    uri: 'https://news.ycombinator.com/user?id=Alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/user?id=Alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
