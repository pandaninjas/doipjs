/*
Copyright 2021 Yarmo Mackenbach

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
const openpgp = require('openpgp')
const mergeOptions = require('merge-options')
const claims = require('./claims')
const keys = require('./keys')

const verify = (signature, opts) => {
  return new Promise(async (resolve, reject) => {
    let errors = [],
      sigData

    try {
      sigData = await openpgp.cleartext.readArmored(signature)
    } catch (error) {
      errors.push('invalid_signature')
      reject({ errors: errors })
      return
    }

    const issuerKeyId = sigData.signature.packets[0].issuerKeyId.toHex()
    const signersUserId = sigData.signature.packets[0].signersUserId
    const preferredKeyServer =
      sigData.signature.packets[0].preferredKeyServer ||
      'https://keys.openpgp.org/'
    const text = sigData.getText()
    let sigKeys = []
    let sigClaims = []

    text.split('\n').forEach((line, i) => {
      const match = line.match(/^([a-zA-Z0-9]*)\=(.*)$/i)
      if (!match) {
        return
      }
      switch (match[1].toLowerCase()) {
        case 'key':
          sigKeys.push(match[2])
          break

        case 'proof':
          sigClaims.push(match[2])
          break

        default:
          break
      }
    })

    let keyData, keyUri

    // Try overruling key
    if (sigKeys.length > 0) {
      try {
        keyUri = sigKeys[0]
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {}
    }
    // Try WKD
    if (!keyData && signersUserId) {
      try {
        keyUri = `wkd:${signersUserId}`
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {}
    }
    // Try HKP
    if (!keyData) {
      try {
        const match = preferredKeyServer.match(/^(.*\:\/\/)?([^/]*)(?:\/)?$/i)
        keyUri = `hkp:${match[2]}:${issuerKeyId ? issuerKeyId : signersUserId}`
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {
        errors.push('key_not_found')
        reject({ errors: errors })
        return
      }
    }

    const fingerprint = keyData.keyPacket.getFingerprint()

    try {
      const sigVerification = await sigData.verify([keyData])
      await sigVerification[0].verified
    } catch (e) {
      errors.push('invalid_signature_verification')
      reject({ errors: errors })
      return
    }

    const claimVerifications = await claims.verify(sigClaims, fingerprint, opts)

    resolve({
      errors: errors,
      signature: {
        data: sigData.signature,
        issuerKeyId: issuerKeyId,
        signersUserId: signersUserId,
        preferredKeyServer: preferredKeyServer,
      },
      publicKey: {
        data: keyData,
        uri: keyUri,
        fingerprint: fingerprint,
      },
      text: text,
      claims: claimVerifications,
    })
  })
}

exports.verify = verify
