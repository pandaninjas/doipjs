exports.serviceprovidersList = [
  'dns',
  'xmpp',
]

exports.serviceproviders = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp')
}
