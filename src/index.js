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
const validUrl = require('valid-url')
const bent = require('bent')
const req = bent('GET')
const serviceproviders = require('./serviceproviders')
const claimVerification = require('./claimVerification')
const utils = require('./utils')

const verify = async (uri, fingerprint, opts) => {
  if (!fingerprint) { fingerprint = null }
  if (!opts) { opts = {} }

  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = serviceproviders.match(uri, opts)

  if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
    return spMatches
  }

  let claimHasBeenVerified = false, sp, iSp = 0, res, proofData
  while (!claimHasBeenVerified && iSp < spMatches.length) {
    spData = spMatches[iSp]
    spData.claim.fingerprint = fingerprint

    res = null

    if (!spData.proof.useProxy || 'forceDirectRequest' in opts && opts.forceDirectRequest) {
      res = await req(spData.proof.fetch ? spData.proof.fetch : spData.proof.uri)

      switch (spData.proof.format) {
        case 'json':
          proofData = await res.json()
          break
        case 'text':
          proofData = await res.text()
          break
        default:
          throw new Error('No specified proof data format')
          break
      }
    }

    claimHasBeenVerified = claimVerification.run(proofData, spData)

    iSp++
  }

  return {
    isVerified: claimHasBeenVerified,
    verificationData: spData
  }
}

exports.verify = verify
exports.serviceproviders = serviceproviders
exports.claimVerification = claimVerification
exports.utils = utils
