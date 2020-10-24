const utils = require('./utils')

const runOnJson = (proofData, checkPath, checkClaim, checkRelation) => {
  let isVerified = false, re

  if (!proofData) {
    return isVerified
  }

  if (checkPath.length == 0) {
    switch (checkRelation) {
      default:
      case 'contains':
        re = new RegExp(checkClaim, "gi")
        return re.test(proofData.replace(/\r?\n|\r/, ''))
        break
      case 'equals':
        return proofData.replace(/\r?\n|\r/, '').toLowerCase() == checkClaim.toLowerCase()
        break
      case 'oneOf':
        re = new RegExp(checkClaim, "gi")
        return re.test(proofData.join("|"))
        break
    }
  }

  if (Array.isArray(proofData)) {
    proofData.forEach((item, i) => {
      isVerified = isVerified || runOnJson(item, checkPath, checkClaim, checkRelation)
    });
  } else if (Array.isArray(proofData[checkPath[0]])) {
    proofData[checkPath[0]].forEach((item, i) => {
      isVerified = isVerified || runOnJson(item, checkPath.slice(1), checkClaim, checkRelation)
    })
  } else {
    isVerified = isVerified || runOnJson(proofData[checkPath[0]], checkPath.slice(1), checkClaim, checkRelation)
  }

  return isVerified;
}

const run = (proofData, spData) => {
  switch (spData.proof.format) {
    case 'json':
      return runOnJson(proofData, spData.claim.path, utils.generateClaim(spData.claim.fingerprint, spData.claim.format), spData.claim.relation)
      break
    case 'text':
      re = new RegExp(utils.generateClaim(spData.claim.fingerprint, spData.claim.format), "gi")
      return re.test(proofData.replace(/\r?\n|\r/, ''))
      break
  }
}

exports.run = run
