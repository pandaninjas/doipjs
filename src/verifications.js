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

/**
 * @module verifications
 * @ignore
 */

const runJSON = (proofData, checkPath, checkClaim, checkRelation) => {
  let re

  if (!proofData) {
    return false
  }

  if (Array.isArray(proofData)) {
    let result = false
    proofData.forEach((item, i) => {
      if (result) {
        return
      }
      result = runJSON(item, checkPath, checkClaim, checkRelation)
    })
    return result
  }

  if (checkPath.length === 0) {
    switch (checkRelation) {
      case E.ClaimRelation.EQUALS:
        return (
          proofData.replace(/\r?\n|\r|\\/g, '').toLowerCase() ===
          checkClaim.toLowerCase()
        )

      case E.ClaimRelation.ONEOF:
        re = new RegExp(checkClaim, 'gi')
        return re.test(proofData.join('|'))

      case E.ClaimRelation.CONTAINS:
      default:
        re = new RegExp(checkClaim, 'gi')
        return re.test(proofData.replace(/\r?\n|\r|\\/g, ''))
    }
  }

  if (!(checkPath[0] in proofData)) {
    throw new Error('err_json_structure_incorrect')
  }

  return runJSON(
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkRelation
  )
}

/**
 * Run the verification by finding the formatted fingerprint in the proof
 * @param {object} proofData    - The proof data
 * @param {object} claimData    - The claim data
 * @param {string} fingerprint  - The fingerprint
 * @returns {object}
 */
const run = (proofData, claimData, fingerprint) => {
  const res = {
    result: false,
    completed: false,
    errors: []
  }

  switch (claimData.proof.request.format) {
    case E.ProofFormat.JSON:
      try {
        res.result = runJSON(
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
        const re = new RegExp(
          utils
            .generateClaim(fingerprint, claimData.claim.format)
            .replace('[', '\\[')
            .replace(']', '\\]'),
          'gi'
        )
        res.result = re.test(proofData.replace(/\r?\n|\r/, ''))
        res.completed = true
      } catch (error) {
        res.errors.push('err_unknown_text_verification')
      }
      break
  }

  return res
}

exports.run = run
