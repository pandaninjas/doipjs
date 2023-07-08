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
import { readCleartextMessage, verify } from 'openpgp'
import { Claim } from './claim.js'
import { fetchURI } from './keys.js'

/**
 * @module signatures
 */

/**
 * Extract data from a signature and fetch the associated key
 * @async
 * @param {string} signature - The plaintext signature to process
 * @returns {Promise<object>}
 */
export async function process (signature) {
  /** @type {import('openpgp').CleartextMessage} */
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

  // Read the signature
  try {
    sigData = await readCleartextMessage({
      cleartextMessage: signature
    })
  } catch (e) {
    throw new Error(`Signature could not be read (${e.message})`)
  }

  // @ts-ignore
  const issuerKeyID = sigData.signature.packets[0].issuerKeyID.toHex()
  // @ts-ignore
  const signersUserID = sigData.signature.packets[0].signersUserID
  const preferredKeyServer =
  // @ts-ignore
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
      result.key.data = await fetchURI(result.key.uri)
      result.key.fetchMethod = result.key.uri.split(':')[0]
    } catch (e) {}
  }
  // Try WKD
  if (!result.key.data && signersUserID) {
    try {
      result.key.uri = `wkd:${signersUserID}`
      result.key.data = await fetchURI(result.key.uri)
      result.key.fetchMethod = 'wkd'
    } catch (e) {}
  }
  // Try HKP
  if (!result.key.data) {
    try {
      const match = preferredKeyServer.match(/^(.*:\/\/)?([^/]*)(?:\/)?$/i)
      result.key.uri = `hkp:${match[2]}:${issuerKeyID || signersUserID}`
      result.key.data = await fetchURI(result.key.uri)
      result.key.fetchMethod = 'hkp'
    } catch (e) {
      throw new Error('Public key not found')
    }
  }

  // Verify the signature
  const verificationResult = await verify({
    // @ts-ignore
    message: sigData,
    verificationKeys: result.key.data
  })
  const { verified } = verificationResult.signatures[0]
  try {
    await verified
  } catch (e) {
    throw new Error(`Signature could not be verified (${e.message})`)
  }

  result.fingerprint = result.key.data.keyPacket.getFingerprint()

  result.users[0].claims.forEach((claim) => {
    claim.fingerprint = result.fingerprint
  })

  const primaryUserData = await result.key.data.getPrimaryUser()
  let userData

  if (signersUserID) {
    result.key.data.users.forEach((/** @type {{ userID: { email: string; }; }} */ user) => {
      if (user.userID.email === signersUserID) {
        userData = user
      }
    })
  }
  if (!userData) {
    userData = primaryUserData.user
  }

  result.users[0].userData = {
    id: userData.userID ? userData.userID.userID : null,
    name: userData.userID ? userData.userID.name : null,
    email: userData.userID ? userData.userID.email : null,
    comment: userData.userID ? userData.userID.comment : null,
    isPrimary: primaryUserData.user.userID.userID === userData.userID.userID
  }

  result.primaryUserIndex = result.users[0].userData.isPrimary ? 0 : null

  return result
}
