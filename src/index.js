exports.verify = (url, fingerprint, opts) => {

}
exports.serviceproviders = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp')
}
