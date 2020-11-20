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
const openpgp = require(path.join(require.resolve('openpgp'), '..', 'openpgp.min.js'))
const mergeOptions = require('merge-options')

const fetchHKP = async (identifier, keyserverBaseUrl) => {
  try {
    keyserverBaseUrl = keyserverBaseUrl
      ? keyserverBaseUrl
      : 'https://keys.openpgp.org/'

    const hkp = new openpgp.HKP(keyserverBaseUrl)
    const lookupOpts = {
      query: identifier,
    }
    let publicKey = await hkp.lookup(lookupOpts)
    publicKey = (await openpgp.key.readArmored(publicKey)).keys[0]

    return publicKey
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const fetchWKD = async (identifier) => {
  try {
    const wkd = new openpgp.WKD()
    const lookupOpts = {
      email: identifier,
    }
    const publicKey = (await wkd.lookup(lookupOpts)).keys[0]

    return publicKey
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const fetchKeybase = async (username, fingerprint) => {
  try {
    const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`
    try {
      const rawKeyContent = await req(opts.keyLink)
        .then(function (response) {
          if (response.status === 200) {
            return response
          }
        })
        .then((response) => response.text())
    } catch (e) {
      return undefined
    }
    const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]

    return publicKey
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const fetchPlaintext = async (rawKeyContent) => {
  try {
    const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]

    return publicKey
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const fetchSignature = async (rawSignatureContent, keyserverBaseUrl) => {
  try {
    let sig = await openpgp.signature.readArmored(rawSignatureContent)
    if ('compressed' in sig.packets[0]) {
      sig = sig.packets[0]
      let sigContent = await openpgp.stream.readToEnd(
        await sig.packets[1].getText()
      )
    }
    const sigUserId = sig.packets[0].signersUserId
    const sigKeyId = await sig.packets[0].issuerKeyId.toHex()

    return fetchHKP(sigUserId ? sigUserId : sigKeyId, keyserverBaseUrl)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const fetchURI = async (uri) => {
  try {
    if (!validUrl.isUri(uri)) {
      throw new Error('Invalid URI')
    }

    const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+\-]*)(\:[a-zA-Z0-9@._=+\-]*)?/
    const match = uri.match(re)

    if (!match[1]) {
      throw new Error('Invalid URI')
    }

    switch (match[1]) {
      case 'hkp':
        return fetchHKP(match[2], match.length >= 4 ? match[3] : null)
        break
      case 'wkd':
        return fetchWKD(match[2])
        break
      case 'kb':
        return fetchKeybase(match[2], match.length >= 4 ? match[3] : null)
        break
      default:
        throw new Error('Invalid URI protocol')
        break
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const process = async (publicKey) => {
  try {
    const fingerprint = await publicKey.primaryKey.getFingerprint()
    const primaryUser = await publicKey.getPrimaryUser()
    const users = publicKey.users
    let primaryUserIndex, usersOutput = []

    users.forEach((user, i) => {
      usersOutput[i] = {
        userData: {
          id: user.userId.userid,
          name: user.userId.name,
          email: user.userId.email,
          comment: user.userId.comment,
          isPrimary: primaryUser.index === i
        }
      }

      const notations = user.selfCertifications[0].rawNotations
      usersOutput[i].notations = notations.map(({ name, value, humanReadable }) => {
        if (humanReadable && name === 'proof@metacode.biz') {
          return openpgp.util.decode_utf8(value)
        }
      })
    })

    return {
      fingerprint: fingerprint,
      users: usersOutput,
      primaryUserIndex: primaryUser.index,
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const getUserData = async (publicKey) => {
  try {
    const keyData = await process(publicKey)

    return keyData.users
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const getFingerprint = async (publicKey) => {
  try {
    const keyData = await process(publicKey)

    return keyData.fingerprint
  } catch (e) {
    console.error(e)
    return undefined
  }
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
