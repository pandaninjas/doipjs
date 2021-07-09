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
const Claim = require('./claim')
const keys = require('./keys')

/**
 * @module signatures
 */

/**
 * Extract data from a signature and fetch the associated key
 * @async
 * @param {string} signature - The plaintext signature to process
 * @returns {Promise<object>}
 */
const process = async (signature) => {
  let sigData
  const result = {
    fingerprint: null,
    users: [
      {
        userData: {},
        claims: []
      }
    ],
    primaryUserIndex: null,
    key: {
      data: null,
      fetchMethod: null,
      uri: null
    }
  }

  try {
    sigData = await openpgp.cleartext.readArmored(signature)
  } catch (error) {
    throw new Error('invalid_signature')
  }

  const issuerKeyId = sigData.signature.packets[0].issuerKeyId.toHex()
  const signersUserId = sigData.signature.packets[0].signersUserId
  const preferredKeyServer =
    sigData.signature.packets[0].preferredKeyServer ||
    'https://keys.openpgp.org/'
  const text = sigData.getText()
  const sigKeys = []

  text.split('\n').forEach((line, i) => {
    const match = line.match(/^([a-zA-Z0-9]*)=(.*)$/i)
    if (!match) {
      return
    }
    switch (match[1].toLowerCase()) {
      case 'key':
        sigKeys.push(match[2])
        break

      case 'proof':
        result.users[0].claims.push(new Claim(match[2]))
        break

      default:
        break
    }
  })

  // Try overruling key
  if (sigKeys.length > 0) {
    try {
      result.key.uri = sigKeys[0]
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = result.key.uri.split(':')[0]
    } catch (e) {}
  }
  // Try WKD
  if (!result.key.data && signersUserId) {
    try {
      result.key.uri = `wkd:${signersUserId}`
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = 'wkd'
    } catch (e) {}
  }
  // Try HKP
  if (!result.key.data) {
    try {
      const match = preferredKeyServer.match(/^(.*:\/\/)?([^/]*)(?:\/)?$/i)
      result.key.uri = `hkp:${match[2]}:${issuerKeyId || signersUserId}`
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = 'hkp'
    } catch (e) {
      throw new Error('key_not_found')
    }
  }

  result.fingerprint = result.key.data.keyPacket.getFingerprint()

  result.users[0].claims.forEach((claim) => {
    claim.fingerprint = result.fingerprint
  })

  const primaryUserData = await result.key.data.getPrimaryUser()
  let userData

  if (signersUserId) {
    result.key.data.users.forEach((user) => {
      if (user.userId.email === signersUserId) {
        userData = user
      }
    })
  }
  if (!userData) {
    userData = primaryUserData.user
  }

  result.users[0].userData = {
    id: userData.userId ? userData.userId.userid : null,
    name: userData.userId ? userData.userId.name : null,
    email: userData.userId ? userData.userId.email : null,
    comment: userData.userId ? userData.userId.comment : null,
    isPrimary: primaryUserData.user.userId.userid === userData.userId.userid
  }

  result.primaryUserIndex = result.users[0].userData.isPrimary ? 0 : null

  return result
}

exports.process = process
