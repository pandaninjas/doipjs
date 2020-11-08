const utils = require('./utils')

const runOnJson = (res, proofData, checkPath, checkClaim, checkRelation) => {
  let re

  if (res.isVerified || !proofData) {
    return res
  }

  if (Array.isArray(proofData)) {
    proofData.forEach((item, i) => {
      res = runOnJson(res, item, checkPath, checkClaim, checkRelation)
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

  res = runOnJson(
    res,
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkRelation
  )
  return res
}

const run = (proofData, spData) => {
  let res = {
    isVerified: false,
    errors: [],
  }

  switch (spData.proof.format) {
    case 'json':
      res = runOnJson(
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
      res = re.test(proofData.replace(/\r?\n|\r/, ''))
      break
  }

  return res
}

exports.run = run
