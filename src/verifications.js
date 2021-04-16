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

const runJSON = (
  proofData,
  checkPath,
  checkClaim,
  checkRelation
) => {
  let re

  if (!proofData) {
    return false
  }

  if (Array.isArray(proofData)) {
    let result = false
    proofData.forEach((item, i) => {
      if (result) { return }
      result = runJSON(item, checkPath, checkClaim, checkRelation)
    })
    return result
  }

  if (checkPath.length == 0) {
    switch (checkRelation) {
      default:
      case E.ClaimRelation.CONTAINS:
        re = new RegExp(checkClaim, 'gi')
        return re.test(proofData.replace(/\r?\n|\r|\\/g, ''))
        break

      case E.ClaimRelation.EQUALS:
        return proofData.replace(/\r?\n|\r|\\/g, '').toLowerCase() ==
          checkClaim.toLowerCase()
        break

      case E.ClaimRelation.ONEOF:
        re = new RegExp(checkClaim, 'gi')
        return re.test(proofData.join('|'))
        break
    }
  }

  try {
    checkPath[0] in proofData
  } catch (e) {
    throw new Error('err_json_structure_incorrect')
  }

  return runJSON(
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkRelation
  )
}

const run = (proofData, claimData, fingerprint) => {
  let res = {
    result: false,
    completed: false,
    errors: [],
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