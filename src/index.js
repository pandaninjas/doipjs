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
const serviceproviders = require('./serviceproviders')
const claimVerification = require('./claimVerification')
const utils = require('./utils')

const verify = async (uri, fingerprint, opts) => {
  if (!fingerprint) { fingerprint = null }
  if (!opts) { opts = {} }

  if (!('doipProxyHostname' in opts) || !opts.doipProxyHostname) {
    opts.doipProxyHostname = 'proxy.keyoxide.org'
  }

  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = serviceproviders.match(uri, opts)

  if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
    return spMatches
  }
  let claimVerificationDone = false, claimVerificationResult, sp, iSp = 0, res, proofData, spData
  while (!claimVerificationDone && iSp < spMatches.length) {
    spData = spMatches[iSp]
    spData.claim.fingerprint = fingerprint

    res = null

    if (spData.customRequestHandler instanceof Function) {
      proofData = await spData.customRequestHandler(spData, opts)
    } else if (!spData.proof.useProxy || 'proxyPolicy' in opts && !opts.useProxyWhenNeeded) {
      proofData = await serviceproviders.directRequestHandler(spData, opts)
    } else {
      proofData = await serviceproviders.proxyRequestHandler(spData, opts)
    }

    if (proofData) {
      claimVerificationResult = claimVerification.run(proofData, spData)

      if (claimVerificationResult.errors.length == 0) {
        claimVerificationDone = true
      }
    }

    iSp++
  }

  if (!claimVerificationResult) {
    claimVerificationResult = {
      isVerified: false
    }
  }

  return {
    isVerified: claimVerificationResult.isVerified,
    matchedServiceprovider: spData ? spData.serviceprovider.name : null,
    serviceproviderData: spData
  }
}

exports.verify = verify
exports.serviceproviders = serviceproviders
exports.claimVerification = claimVerification
exports.utils = utils
