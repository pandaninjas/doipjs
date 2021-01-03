const openpgp = require('./node_modules/openpgp/dist/openpgp.min.js')
const doip = require('./')

const t = async () => {
  const opts = {
    proxyPolicy: 'never'
  }
  // console.log(await doip.claims.verify('dns:yarmo.eu', '9f0048ac0b23301e1f77e994909f6bd6f80f485d'))
  // console.log(await doip.claims.verify('dns:yarmo.eu', '9f0048ac0b23301e1f77e994909f6bd6f80f485d', {returnMatchesOnly: false, doipProxyHostname: 'proxy.keyoxide.org'}));

  // console.log(await doip.claims.verify('https://stream.yarmo.eu', '9f0048ac0b23301e1f77e994909f6bd6f80f485d'))
  console.log(await doip.claims.verify('https://twitter.com/YarmoM/status/1277886959143157760', '9f0048ac0b23301e1f77e994909f6bd6f80f485d', opts))
  // console.log(await doip.claims.verify('https://www.reddit.com/user/YarmoM/comments/hhd318/openpgp_proof/', '9f0048ac0b23301e1f77e994909f6bd6f80f485d'))

  // const publicKey = await doip.keys.fetch.uri(
  //   'hkp:9f0048ac0b23301e1f77e994909f6bd6f80f485d'
  // )
  // const publicKey = await doip.keys.fetch.uri(
  //   'hkp:e8923e0f9c7c84a663a37f850be1a9ae16f417a2'
  // )
  return

  try {
    // const publicKey = await doip.keys.fetch.uri('hkp:yarmo@yarmo.eu')
    // const publicKey = await doip.keys.fetch.uri('hkp:test@doip.rocks')
    // const publicKey = await doip.keys.fetch.uri('hkp:keyserver.ubuntu.com:test@doip.rocks')
    // const publicKey = await doip.keys.fetch.uri('hkp:keyserver.ubuntu.com:3637202523e7c1309ab79e99ef2dc5827b445f4b')
    // const publicKey = await doip.keys.fetch.uri('wkd:yarmo@yarmo.eu')

    // console.log(publicKey)
    // console.log(publicKey instanceof openpgp.key.Key)

    const data = await doip.keys.process(publicKey)

    const claims = await doip.claims.verify(publicKey)
    console.log(claims)
  } catch (e) {
    console.error(e)
  } finally {
  }

  // const fingerprint = await doip.keys.getFingerprint(publicKey)
  // const claims = await doip.keys.getClaims(publicKey)
  // await doip.claims.verify([claims[0], claims[1]], fingerprint)
  // console.log(publicKey)
  // console.log(claims)
  // console.log(await doip.claims.verify(claims[0], fingerprint))
  // console.log(await doip.claims.verify([claims[0], claims[1]], fingerprint))
}

t()
