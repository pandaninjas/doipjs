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
const mergeOptions = require('merge-options')
const validUrl = require('valid-url')
const openpgp = require('openpgp')
const serviceproviders = require('./serviceproviders')
const keys = require('./keys')
const utils = require('./utils')

const runVerificationJson = (
  res,
  proofData,
  checkPath,
  checkClaim,
  checkRelation
) => {
  let re

  if (res.isVerified || !proofData) {
    return res
  }

  if (Array.isArray(proofData)) {
    proofData.forEach((item, i) => {
      res = runVerificationJson(res, item, checkPath, checkClaim, checkRelation)
    })
    return res
  }

  if (checkPath.length == 0) {
    switch (checkRelation) {
      default:
      case 'contains':
        re = new RegExp(
          checkClaim.replace('[', '\\[').replace(']', '\\]'),
          'gi'
        )
        res.isVerified = re.test(proofData.replace(/\r?\n|\r/, ''))
        break
      case 'equals':
        res.isVerified =
          proofData.replace(/\r?\n|\r/, '').toLowerCase() ==
          checkClaim.toLowerCase()
        break
      case 'oneOf':
        re = new RegExp(checkClaim, 'gi')
        res.isVerified = re.test(proofData.join('|'))
        break
    }
    return res
  }

  try {
    checkPath[0] in proofData
  } catch (e) {
    res.errors.push('err_data_structure_incorrect')
    return res
  }

  res = runVerificationJson(
    res,
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkRelation
  )
  return res
}

const runVerification = (proofData, spData) => {
  let res = {
    isVerified: false,
    errors: [],
  }

  switch (spData.proof.format) {
    case 'json':
      res = runVerificationJson(
        res,
        proofData,
        spData.claim.path,
        utils.generateClaim(spData.claim.fingerprint, spData.claim.format),
        spData.claim.relation
      )
      break
    case 'text':
      re = new RegExp(
        utils.generateClaim(spData.claim.fingerprint, spData.claim.format),
        'gi'
      )
      res.isVerified = re.test(proofData.replace(/\r?\n|\r/, ''))
      break
  }

  return res
}

const verify = async (input, fingerprint, opts) => {
  if (input instanceof openpgp.key.Key) {
    const fingerprintLocal = await keys.getFingerprint(input)
    const claims = await keys.getClaims(input)
    return await verify(claims, fingerprintLocal, opts)
  }
  if (input instanceof Array) {
    const promises = input.map(async (uri, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await verify(uri, fingerprint, opts)
          resolve(res)
        } catch (e) {
          console.error(`Claim verification failed: ${uri}`, e)
          reject(e)
        }
      })
    })

    return Promise.all(promises).then((values) => {
      return values
    })
  }

  const uri = input

  if (!fingerprint) {
    fingerprint = null
  }

  const defaultOpts = {
    returnMatchesOnly: false,
    proxyPolicy: 'adaptive',
    doipProxyHostname: 'proxy.keyoxide.org',
  }
  opts = mergeOptions(defaultOpts, opts ? opts : {})

  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = serviceproviders.match(uri, opts)

  if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
    return spMatches
  }
  let claimVerificationDone = false,
    claimVerificationResult,
    sp,
    iSp = 0,
    res,
    proofData,
    spData
  while (!claimVerificationDone && iSp < spMatches.length) {
    spData = spMatches[iSp]
    spData.claim.fingerprint = fingerprint

    res = null

    if (spData.customRequestHandler instanceof Function) {
      proofData = await spData.customRequestHandler(spData, opts)
    } else if (
      !spData.proof.useProxy ||
      ('proxyPolicy' in opts && !opts.useProxyWhenNeeded)
    ) {
      proofData = await serviceproviders.directRequestHandler(spData, opts)
    } else {
      proofData = await serviceproviders.proxyRequestHandler(spData, opts)
    }

    if (proofData) {
      claimVerificationResult = runVerification(proofData, spData)

      if (claimVerificationResult.errors.length == 0) {
        claimVerificationDone = true
      }
    }

    iSp++
  }

  if (!claimVerificationResult) {
    claimVerificationResult = {
      isVerified: false,
    }
  }

  return {
    isVerified: claimVerificationResult.isVerified,
    serviceproviderData: spData,
  }
}

exports.verify = verify
