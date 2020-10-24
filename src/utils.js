const generateClaim = (spData) => {
  switch (spData.claim.format) {
    case 'uri':
      return `openpgp4fpr:${spData.claim.fingerprint}`
      break;
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${spData.claim.fingerprint}]`
      break;
    case 'fingerprint':
      return pData.claim.fingerprint
      break;
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateClaim = generateClaim
