require('dotenv').config()

const DOIP_PROXY_HOSTNAME = process.env.DOIP_PROXY_HOSTNAME || 'proxy.keyoxide.org'

const generateProxyURL = (type, url) => {
  return `https://${DOIP_PROXY_HOSTNAME}/api/1/get/${type}/${encodeURIComponent(url)}`
}

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

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim
