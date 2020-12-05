/*
Copyright 2020 Yarmo Mackenbach

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const path = require('path')
const bent = require('bent')
const req = bent('GET')
const validUrl = require('valid-url')
const openpgp = require(path.join(
  require.resolve('openpgp'),
  '..',
  'openpgp.min.js'
))
const mergeOptions = require('merge-options')

const fetchHKP = (identifier, keyserverBaseUrl) => {
  return new Promise(async (resolve, reject) => {
    keyserverBaseUrl = keyserverBaseUrl
      ? keyserverBaseUrl
      : 'https://keys.openpgp.org/'

    const hkp = new openpgp.HKP(keyserverBaseUrl)
    const lookupOpts = {
      query: identifier,
    }
    let publicKey = await hkp.lookup(lookupOpts)
    publicKey = (await openpgp.key.readArmored(publicKey)).keys[0]

    if (publicKey == undefined) {
      reject('Key does not exist or could not be fetched')
    }

    resolve(publicKey)
  })
}

const fetchWKD = (identifier) => {
  return new Promise(async (resolve, reject) => {
    const wkd = new openpgp.WKD()
    const lookupOpts = {
      email: identifier,
    }
    const publicKey = (await wkd.lookup(lookupOpts)).keys[0]

    if (publicKey == undefined) {
      reject('Key does not exist or could not be fetched')
    }

    resolve(publicKey)
  })
}

const fetchKeybase = (username, fingerprint) => {
  return new Promise(async (resolve, reject) => {
    const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`
    try {
      const rawKeyContent = await req(opts.keyLink)
        .then((response) => {
          if (response.status === 200) {
            return response
          }
        })
        .then((response) => response.text())
    } catch (e) {
      reject(`Error fetching Keybase key: ${e.message}`)
    }
    const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]

    if (publicKey == undefined) {
      reject('Key does not exist or could not be fetched')
    }

    resolve(publicKey)
  })
}

const fetchPlaintext = (rawKeyContent) => {
  return new Promise(async (resolve, reject) => {
    const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]

    resolve(publicKey)
  })
}

const fetchSignature = (rawSignatureContent, keyserverBaseUrl) => {
  return new Promise(async (resolve, reject) => {
    let sig = await openpgp.signature.readArmored(rawSignatureContent)
    if ('compressed' in sig.packets[0]) {
      sig = sig.packets[0]
      let sigContent = await openpgp.stream.readToEnd(
        await sig.packets[1].getText()
      )
    }
    const sigUserId = sig.packets[0].signersUserId
    const sigKeyId = await sig.packets[0].issuerKeyId.toHex()

    resolve(fetchHKP(sigUserId ? sigUserId : sigKeyId, keyserverBaseUrl))
  })
}

const fetchURI = (uri) => {
  return new Promise(async (resolve, reject) => {
    if (!validUrl.isUri(uri)) {
      reject('Invalid URI')
    }

    const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+\-]*)(\:[a-zA-Z0-9@._=+\-]*)?/
    const match = uri.match(re)

    if (!match[1]) {
      reject('Invalid URI')
    }

    switch (match[1]) {
      case 'hkp':
        resolve(fetchHKP(match[2], match.length >= 4 ? match[3] : null))
        break
      case 'wkd':
        resolve(fetchWKD(match[2]))
        break
      case 'kb':
        resolve(fetchKeybase(match[2], match.length >= 4 ? match[3] : null))
        break
      default:
        reject('Invalid URI protocol')
        break
    }
  })
}

const process = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    if (!publicKey) {
      reject('Invalid public key')
    }
    const fingerprint = await publicKey.primaryKey.getFingerprint()
    const primaryUser = await publicKey.getPrimaryUser()
    const users = publicKey.users
    let primaryUserIndex,
      usersOutput = []

    users.forEach((user, i) => {
      usersOutput[i] = {
        userData: {
          id: user.userId.userid,
          name: user.userId.name,
          email: user.userId.email,
          comment: user.userId.comment,
          isPrimary: primaryUser.index === i,
        },
      }

      const notations = user.selfCertifications[0].rawNotations
      usersOutput[i].notations = notations.map(
        ({ name, value, humanReadable }) => {
          if (humanReadable && name === 'proof@metacode.biz') {
            return openpgp.util.decode_utf8(value)
          }
        }
      )
    })

    resolve({
      fingerprint: fingerprint,
      users: usersOutput,
      primaryUserIndex: primaryUser.index,
    })
  })
}

const getUserData = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    const keyData = await process(publicKey)

    resolve(keyData.users)
  })
}

const getFingerprint = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    const keyData = await process(publicKey)

    resolve(keyData.fingerprint)
  })
}

exports.fetch = {
  uri: fetchURI,
  hkp: fetchHKP,
  wkd: fetchWKD,
  keybase: fetchKeybase,
  plaintext: fetchPlaintext,
  signature: fetchSignature,
}
exports.process = process
exports.getUserData = getUserData
exports.getFingerprint = getFingerprint
