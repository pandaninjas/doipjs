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
const bent = require('bent')
const req = bent('GET')
const serviceproviders = require('../serviceproviders')
const utils = require('../utils')

const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const customRequestHandler = async (spData, opts) => {
  const match = spData.proof.uri.match(reURI)

  // Attempt direct verification if policy allows it
  if (opts.proxyPolicy !== 'always') {
    if ('twitterBearerToken' in opts && opts.twitterBearerToken) {
      const res = await req(
        `https://api.twitter.com/1.1/statuses/show.json?id=${match[2]}`,
        null,
        {
          Accept: 'application/json',
          Authorization: `Bearer ${opts.twitterBearerToken}`,
        }
      )
      const json = await res.json()
      return json.text
    } else if ('nitterInstance' in opts && opts.nitterInstance) {
      spData.proof.fetch = `https://${opts.nitterInstance}/${match[1]}/status/${match[2]}`
      const res = await serviceproviders.proxyRequestHandler(spData, opts)
      return res
    }
  }

  // Attempt proxy verification if policy allows it
  if (opts.proxyPolicy !== 'never' && spData.proof.fetch) {
    return req(utils.generateProxyURL('twitter', match[2], opts), null, {
      Accept: 'application/json',
    })
      .then(async (res) => {
        return await res.json()
      })
      .then((res) => {
        return res.data.text
      })
      .catch((e) => {
        reject(e)
      })
  }

  // No verification
  return null
}

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter',
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: utils.generateProxyURL('twitter', match[2], opts),
      access: proofAccess.GRANTED,
      format: proofFormat.TEXT,
    },
    claim: {
      fingerprint: null,
      format: claimFormat.MESSAGE,
      relation: claimRelation.CONTAINS,
      path: [],
    },
    customRequestHandler: customRequestHandler,
  }
}

const tests = [
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789',
    shouldMatch: true,
  },
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/status/1234567890123456789',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
