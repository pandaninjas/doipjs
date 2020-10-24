const reURI = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  const match = uri.match(reURI)

  return {
    type: "domain",
    profile: {
      display: match[1],
      uri: `https://${match[1]}`
    },
    proof: {
      uri: `https://dns.shivering-isles.com/dns-query?name=${match[1]}&type=TXT`,
      fetch: null
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'dns:domain.org',
    shouldMatch: true
  },
  {
    uri: 'dns:domain.org?type=TXT',
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
