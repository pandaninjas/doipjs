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
const reURI = /^https:\/\/(.*)\/u\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'discourse',
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: uri,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://${match[1]}/u/${match[2]}.json`,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['user', 'bio_raw'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/u/alice',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/u/alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
