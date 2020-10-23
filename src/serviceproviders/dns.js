const reURL = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURL = (url, opts) => {
  const match = url.match(reURL)

  return {
    type: "domain",
    profile: {
      display: match[1],
      url: `https://${match[1]}`
    },
    proof: {
      url: `https://dns.shivering-isles.com/dns-query?name=${match[1]}&type=TXT`,
      fetch: null
    },
    qr: null
  }
}

const tests = [
  {
    url: 'dns:domain.org',
    shouldMatch: true
  },
  {
    url: 'dns:domain.org?type=TXT',
    shouldMatch: true
  },
  {
    url: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURL = reURL
exports.processURL = processURL
exports.tests = tests
