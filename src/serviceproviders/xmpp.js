const reURL = /^xmpp:([a-zA-Z0-9\.\-\_]*)@([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURL = (url, opts) => {
  const match = url.match(reURL)

  return {
    type: "xmpp",
    profile: {
      display: `${match[1]}@${match[2]}`,
      url: url
    },
    proof: {
      url: `https://${opts.XMPP_VCARD_SERVER_DOMAIN}/api/vcard/${output.display}/DESC`,
      fetch: null
    },
    qr: null
  }
}

const tests = []

exports.reURL = reURL
exports.processURL = processURL
exports.tests = tests
