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
const dns = require('dns')
const bent = require('bent')
const req = bent('GET')
const utils = require('../utils')
const reURI = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const customRequestHandler = async (spData, opts) => {
  if (('resolveTxt' in dns)) {
    const prom = async () => {
      return new Promise((resolve, reject) => {
        dns.resolveTxt(spData.profile.display, (err, records) => {
          if (err) reject(err)
          resolve(records)
        })
      })
    }
    return {
      hostname: spData.profile.display,
      records: {
        txt: await prom()
      }
    }
  } else {
    const res = await req(spData.proof.uri, null, { Accept: 'application/json' })
    const json = await res.json()
    return json
  }
}

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'dns'
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`,
      qr: null
    },
    proof: {
      uri: utils.generateProxyURL('dns', match[1]),
      fetch: null,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['records', 'txt'],
      relation: 'contains'
    },
    customRequestHandler: customRequestHandler
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
