const validUrl = require('valid-url')
const serviceprovidersList = require('./serviceproviders').serviceprovidersList

const verify = (uri, fingerprint, opts) => {
  if !(validUrl.isUri(uri)) {
    throw new Error('The provided URI was not valid')
  }
}

exports.verify = verify
exports.serviceproviders = require('./serviceproviders').serviceproviders
exports.serviceprovidersList = serviceprovidersList
