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
const reURI = /^https:\/\/gist\.github\.com\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'github'
    },
    profile: {
      display: match[1],
      uri: `https://github.com/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://api.github.com/gists/${match[2]}`,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['files', 'openpgp.md', 'content'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://gist.github.com/Alice/123456789',
    shouldMatch: true
  },
  {
    uri: 'https://gist.github.com/Alice/123456789/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/Alice/123456789',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
