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
const reURI = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'domain'
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`
    },
    proof: {
      uri: `https://dns.shivering-isles.com/dns-query?name=${match[1]}&type=TXT`,
      fetch: null,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: 'Answer',
      relation: 'equals'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'dns:domain.org',
    shouldMatch: true
  },
  {
    uri: 'dns:domain.org?type=TXT',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
