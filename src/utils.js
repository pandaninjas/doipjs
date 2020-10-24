const generateClaim = (fingerprint, format) => {
  switch (format) {
    case 'uri':
      return `openpgp4fpr:${fingerprint}`
      break;
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${fingerprint}]`
      break;
    case 'fingerprint':
      return fingerprint
      break;
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateClaim = generateClaim
