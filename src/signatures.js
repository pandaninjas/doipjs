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
const openpgp = require('openpgp')
const mergeOptions = require('merge-options')
const claims = require('./claims')
const keys = require('./keys')

const verify = (signature, opts) => {
  return new Promise(async (resolve, reject) => {
    let errors = [], sigData
    try {
      sigData = await openpgp.cleartext.readArmored(signature)
    } catch (error) {
      errors.push('invalid_signature')
      reject({ errors: errors })
    }

    const text = sigData.getText()
    let sigKeys = []
    let sigClaims = []
    text.split('\n').forEach((line, i) => {
      const match = line.match(/^(.*)\=(.*)$/i)
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

    if (sigKeys.length === 0) {
      errors.push('no_linked_keys')
      reject({ errors: errors })
    }
    
    const keyData = await keys.fetch.uri(sigKeys[0])
    const fingerprint = keyData.keyPacket.getFingerprint()
    
    try {
      const sigVerification = await sigData.verify([keyData])
      await sigVerification[0].verified
    } catch (e) {
      errors.push('invalid_signature_verification')
      reject({ errors: errors })
    }

    const claimVerifications = await claims.verify(sigClaims, fingerprint, opts)

    resolve({
      errors: errors,
      publicKey: keyData,
      fingerprint: fingerprint,
      claims: claimVerifications
    })
  })
}

exports.verify = verify