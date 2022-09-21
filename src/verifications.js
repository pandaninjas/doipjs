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
const utils = require('./utils')
const E = require('./enums')
const { bcryptVerify, argon2Verify } = require('hash-wasm')

/**
 * @module verifications
 * @ignore
 */

const containsProof = async (data, fingerprint, claimFormat) => {
  const fingerprintFormatted = utils.generateClaim(fingerprint, claimFormat)
  const fingerprintURI = utils.generateClaim(fingerprint, E.ClaimFormat.URI)
  let result = false

  // Check for plaintext proof
  result = data.replace(/\r?\n|\r/g, '')
    .toLowerCase()
    .indexOf(fingerprintFormatted.toLowerCase()) !== -1

  // Check for hashed proof
  if (!result) {
    const hashRe = /\$(argon2(?:id|d|i)|2a|2b|2y)(?:\$[a-zA-Z0-9=+\-,./]+)+/g
    let match

    while (!result && (match = hashRe.exec(data)) != null) {
      let timeoutHandle
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(
          () => {
            resolve(false)
          }, 1000
        )
      })

      switch (match[1]) {
        case '2a':
        case '2b':
        case '2y':
          try {
            // Patch until promise.race properly works on WASM
            if (parseInt(match[0].split('$')[2]) > 12) continue

            const hashPromise = bcryptVerify({
              password: fingerprintURI,
              hash: match[0]
            })
              .then(result => result)
              .catch(_ => false)

            result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
              clearTimeout(timeoutHandle)
              return result
            })
          } catch (err) {
            result = false
          }
          break

        case 'argon2':
        case 'argon2i':
        case 'argon2d':
        case 'argon2id':
          try {
            const hashPromise = argon2Verify({
              password: fingerprintURI,
              hash: match[0]
            })
              .then(result => result)
              .catch(_ => false)

            result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
              clearTimeout(timeoutHandle)
              return result
            })
          } catch (err) {
            result = false
          }
          break

        default:
          continue
      }
    }
  }

  // Check for HTTP proof
  if (!result) {
    const uris = utils.getUriFromString(data)

    for (let index = 0; index < uris.length; index++) {
      if (result) continue

      const candidate = uris[index]
      let candidateURL

      try {
        candidateURL = new URL(candidate)
      } catch (_) {
        continue
      }

      if (candidateURL.protocol !== 'https:') {
        continue
      }

      // Using fetch -> axios doesn't find the ariadne-identity-proof header
      const response = await fetch(candidate, { // eslint-disable-line
        method: 'HEAD'
      })
        .catch(e => {
          return false
        })

      if (!response) continue
      if (response.status !== 200) continue
      if (!response.headers.get('ariadne-identity-proof')) continue

      result = response.headers.get('ariadne-identity-proof')
        .toLowerCase()
        .indexOf(fingerprintURI.toLowerCase()) !== -1
    }
  }

  return result
}

const runJSON = async (proofData, checkPath, checkClaim, checkClaimFormat, checkRelation) => {
  if (!proofData) {
    return false
  }

  if (Array.isArray(proofData)) {
    let result = false

    for (let index = 0; index < proofData.length; index++) {
      const item = proofData[index]

      if (result) {
        continue
      }

      result = await runJSON(item, checkPath, checkClaim, checkClaimFormat, checkRelation)
    }

    return result
  }

  if (checkPath.length === 0) {
    switch (checkRelation) {
      case E.ClaimRelation.ONEOF:
        return await containsProof(proofData.join('|'), checkClaim, checkClaimFormat)

      case E.ClaimRelation.CONTAINS:
      case E.ClaimRelation.EQUALS:
      default:
        return await containsProof(proofData, checkClaim, checkClaimFormat)
    }
  }

  if (!(checkPath[0] in proofData)) {
    throw new Error('err_json_structure_incorrect')
  }

  return await runJSON(
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkClaimFormat,
    checkRelation
  )
}

/**
 * Run the verification by finding the formatted fingerprint in the proof
 * @async
 * @param {object} proofData    - The proof data
 * @param {object} claimData    - The claim data
 * @param {string} fingerprint  - The fingerprint
 * @returns {object}
 */
const run = async (proofData, claimData, fingerprint) => {
  const res = {
    result: false,
    completed: false,
    errors: []
  }

  switch (claimData.proof.request.format) {
    case E.ProofFormat.JSON:
      try {
        res.result = await runJSON(
          proofData,
          claimData.claim.path,
          fingerprint,
          claimData.claim.format,
          claimData.claim.relation
        )
        res.completed = true
      } catch (error) {
        res.errors.push(error.message ? error.message : error)
      }
      break
    case E.ProofFormat.TEXT:
      try {
        res.result = await containsProof(proofData,
          fingerprint,
          claimData.claim.format)
        res.completed = true
      } catch (error) {
        res.errors.push('err_unknown_text_verification')
      }
      break
  }

  return res
}

exports.run = run
