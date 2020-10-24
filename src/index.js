const validUrl = require('valid-url')
const { serviceprovidersList, serviceproviders } = require('./serviceproviders')

const matchSp = (uri) => {
  let matches = [], sp

  serviceprovidersList.forEach((spName, i) => {
    sp = serviceproviders[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri))
    }
  })

  return matches
}

const verify = (uri, fingerprint, opts) => {
  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = matchSp(uri)

  if (opts.returnMatchesOnly) {
    return spMatches
  }

  // let claimHasBeenVerified = false
  // let iSp = 0, sp
  // while (!claimHasBeenVerified) {
  //
  //   if (!sp.reURI.test(uri)) {
  //     continue;
  //   }
  //
  //   iSP++
  // }
}

exports.verify = verify
exports.serviceproviders = serviceproviders
exports.serviceprovidersList = serviceprovidersList
