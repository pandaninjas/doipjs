const reURI = /^xmpp:([a-zA-Z0-9\.\-\_]*)@([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  const match = uri.match(reURI)

  return {
    type: "xmpp",
    profile: {
      display: `${match[1]}@${match[2]}`,
      uri: uri
    },
    proof: {
      uri: `https://${opts.XMPP_VCARD_SERVER_DOMAIN}/api/vcard/${output.display}/DESC`,
      fetch: null
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: true
  },
  {
    uri: 'xmpp:alice@domain.org?omemo-sid-123456789=A1B2C3D4E5F6G7H8I9',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
