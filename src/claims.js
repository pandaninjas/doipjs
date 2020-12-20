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
const path = require('path')
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
        re = new RegExp(checkClaim, 'gi')
        res.isVerified = re.test(proofData.replace(/\r?\n|\r|\\/g, ''))
        break
      case 'equals':
        res.isVerified =
          proofData.replace(/\r?\n|\r|\\/g, '').toLowerCase() ==
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
    const fingerprintFromKey = await keys.getFingerprint(input)
    const userData = await keys.getUserData(input)

    const promises = userData.map(async (user, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await verify(user.notations, fingerprintFromKey, opts)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })

    return Promise.allSettled(promises).then((values) => {
      return values.map((obj, i) => {
        return obj.value
      })
    })
  }
  if (input instanceof Array) {
    const promises = input.map(async (uri, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await verify(uri, fingerprint, opts)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })

    return Promise.allSettled(promises).then((values) => {
      return values.map((obj, i) => {
        return obj.value
      })
    })
  }

  const promiseClaim = new Promise(async (resolve, reject) => {
    let objResult = {
      isVerified: null,
      errors: [],
      serviceproviderData: null,
    }
    const uri = input.replace(/^\s+|\s+$/g, '')

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
      objResult.errors.push('invalid_uri')
      reject(objResult)
    }

    const spMatches = serviceproviders.match(uri, opts)

    if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
      resolve(spMatches)
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
        try {
          proofData = await spData.customRequestHandler(spData, opts)
        } catch (e) {
          objResult.errors.push('custom_request_handler_failed')
        }
      } else {
        switch (opts.proxyPolicy) {
          case 'adaptive':
            if (spData.proof.useProxy) {
              try {
                proofData = await serviceproviders.proxyRequestHandler(spData, opts)
              } catch(er) {}
            } else {
              try {
                proofData = await serviceproviders.directRequestHandler(spData, opts)
              } catch(er) {}
              if (!proofData) {
                try {
                  proofData = await serviceproviders.proxyRequestHandler(spData, opts)
                } catch(er) {}
              }
            }
            break;
          case 'fallback':
            try {
              proofData = await serviceproviders.directRequestHandler(spData, opts)
            } catch(er) {}
            if (!proofData) {
              try {
                proofData = await serviceproviders.proxyRequestHandler(spData, opts)
              } catch(er) {}
            }
            break;
          case 'always':
            try {
              proofData = await serviceproviders.proxyRequestHandler(spData, opts)
            } catch(er) {}
            break;
          case 'never':
            try {
              proofData = await serviceproviders.directRequestHandler(spData, opts)
            } catch(er) {}
            break;
          default:
            objResult.errors.push('invalid_proxy_policy')
        }
      }

      if (proofData) {
        claimVerificationResult = runVerification(proofData, spData)

        if (claimVerificationResult.errors.length == 0) {
          claimVerificationDone = true
        }
      } else {
        objResult.errors.push('unsuccessful_claim_verification')
      }

      iSp++
    }

    if (!claimVerificationResult) {
      claimVerificationResult = {
        isVerified: false,
      }
    }

    objResult.isVerified = claimVerificationResult.isVerified
    objResult.serviceproviderData = spData
    resolve(objResult)
  })

  const promiseTimeout = new Promise((res) => {
    const objResult = {
      isVerified: null,
      errors: 'verification_timed_out',
      serviceproviderData: null,
    }
    setTimeout(() => res(objResult), 5000)
  })

  return await Promise.race([promiseClaim, promiseTimeout])
}

exports.verify = verify
