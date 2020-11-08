const generateProxyURL = (type, url, opts) => {
  if (!opts || !opts.doipProxyHostname) {
    return null
  }
  let addParam = ''
  if (type == 'xmpp') {
    addParam += '/DESC'
  }
  return `https://${
    opts.doipProxyHostname
  }/api/1/get/${type}/${encodeURIComponent(url)}${addParam}`
}

const generateClaim = (fingerprint, format) => {
  switch (format) {
    case 'uri':
      return `openpgp4fpr:${fingerprint}`
      break
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${fingerprint}]`
      break
    case 'fingerprint':
      return fingerprint
      break
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim
