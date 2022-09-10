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
const axios = require('axios')
const { URL } = require('url')
const utils = require('./utils')
const E = require('./enums')

/**
 * @module verifications
 * @ignore
 */

const containsProof = async (data, target) => {
  let result = false

  // Check for plaintext proof
  result = data.replace(/\r?\n|\r/g, '')
    .toLowerCase()
    .indexOf(target.toLowerCase()) !== -1

  // Check for HTTP proof if plaintext not found
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

      const response = await axios.head(candidate, {
        maxRedirects: 1
      })

      if (response.status !== 200) continue
      if (!response.headers['ariadne-identity-proof']) continue

      result = response.headers['ariadne-identity-proof']
        .toLowerCase()
        .indexOf(target.toLowerCase()) !== -1
    }
  }

  return result
}

const runJSON = async (proofData, checkPath, checkClaim, checkRelation) => {
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

      result = await runJSON(item, checkPath, checkClaim, checkRelation)
    }

    return result
  }

  if (checkPath.length === 0) {
    switch (checkRelation) {
      case E.ClaimRelation.ONEOF:
        return await containsProof(proofData.join('|'), checkClaim)

      case E.ClaimRelation.CONTAINS:
      case E.ClaimRelation.EQUALS:
      default:
        return await containsProof(proofData, checkClaim)
    }
  }

  if (!(checkPath[0] in proofData)) {
    throw new Error('err_json_structure_incorrect')
  }

  return await runJSON(
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
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
          utils.generateClaim(fingerprint, claimData.claim.format),
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
          utils.generateClaim(fingerprint, claimData.claim.format))
        res.completed = true
      } catch (error) {
        res.errors.push('err_unknown_text_verification')
      }
      break
  }

  return res
}

exports.run = run
