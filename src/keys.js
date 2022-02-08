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
const axios = require('axios')
const validUrl = require('valid-url')
const openpgp = require('openpgp')
const Claim = require('./claim')

/**
 * Functions related to the fetching and handling of keys
 * @module keys
 */

/**
 * Fetch a public key using keyservers
 * @function
 * @param {string} identifier                         - Fingerprint or email address
 * @param {string} [keyserverDomain=keys.openpgp.org] - Domain of the keyserver
 * @returns {openpgp.key.Key}
 * @example
 * const key1 = doip.keys.fetchHKP('alice@domain.tld');
 * const key2 = doip.keys.fetchHKP('123abc123abc');
 */
exports.fetchHKP = async (identifier, keyserverDomain) => {
  const keyserverBaseUrl = keyserverDomain
    ? `https://${keyserverDomain}`
    : 'https://keys.openpgp.org'

  const hkp = new openpgp.HKP(keyserverBaseUrl)
  const lookupOpts = {
    query: identifier
  }

  const publicKey = await hkp.lookup(lookupOpts).catch((error) => {
    throw new Error(`Key does not exist or could not be fetched (${error})`)
  })

  if (!publicKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return await openpgp.key
    .readArmored(publicKey)
    .then((result) => {
      return result.keys[0]
    })
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })
}

/**
 * Fetch a public key using Web Key Directory
 * @function
 * @param {string} identifier - Identifier of format 'username@domain.tld`
 * @returns {openpgp.key.Key}
 * @example
 * const key = doip.keys.fetchWKD('alice@domain.tld');
 */
exports.fetchWKD = async (identifier) => {
  const wkd = new openpgp.WKD()
  const lookupOpts = {
    email: identifier
  }

  return await wkd
    .lookup(lookupOpts)
    .then((result) => {
      return result.keys[0]
    })
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })
}

/**
 * Fetch a public key from Keybase
 * @function
 * @param {string} username     - Keybase username
 * @param {string} fingerprint  - Fingerprint of key
 * @returns {openpgp.key.Key}
 * @example
 * const key = doip.keys.fetchKeybase('alice', '123abc123abc');
 */
exports.fetchKeybase = async (username, fingerprint) => {
  const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`
  let rawKeyContent
  try {
    rawKeyContent = await axios.get(
      keyLink,
      {
        responseType: 'text'
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response
        }
      })
      .then((response) => response.data)
  } catch (e) {
    throw new Error(`Error fetching Keybase key: ${e.message}`)
  }

  return await openpgp.key
    .readArmored(rawKeyContent)
    .then((result) => {
      return result.keys[0]
    })
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })
}

/**
 * Get a public key from plaintext data
 * @function
 * @param {string} rawKeyContent - Plaintext ASCII-formatted public key data
 * @returns {openpgp.key.Key}
 * @example
 * const plainkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
 *
 * mQINBF0mIsIBEADacleiyiV+z6FIunvLWrO6ZETxGNVpqM+WbBQKdW1BVrJBBolg
 * [...]
 * =6lib
 * -----END PGP PUBLIC KEY BLOCK-----`
 * const key = doip.keys.fetchPlaintext(plainkey);
 */
exports.fetchPlaintext = async (rawKeyContent) => {
  const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]
  return publicKey
}

/**
 * Fetch a public key using an URI
 * @function
 * @param {string} uri - URI that defines the location of the key
 * @returns {openpgp.key.Key}
 * @example
 * const key1 = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const key2 = doip.keys.fetchURI('hkp:123abc123abc');
 * const key3 = doip.keys.fetchURI('wkd:alice@domain.tld');
 */
exports.fetchURI = async (uri) => {
  if (!validUrl.isUri(uri)) {
    throw new Error('Invalid URI')
  }

  const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/
  const match = uri.match(re)

  if (!match[1]) {
    throw new Error('Invalid URI')
  }

  switch (match[1]) {
    case 'hkp':
      return exports.fetchHKP(
        match[3] ? match[3] : match[2],
        match[3] ? match[2] : null
      )

    case 'wkd':
      return exports.fetchWKD(match[2])

    case 'kb':
      return exports.fetchKeybase(match[2], match.length >= 4 ? match[3] : null)

    default:
      throw new Error('Invalid URI protocol')
  }
}

/**
 * Process a public key to get user data and claims
 * @function
 * @param {openpgp.key.Key} publicKey - The public key to process
 * @returns {object}
 * @example
 * const key = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const data = doip.keys.process(key);
 * data.users[0].claims.forEach(claim => {
 *   console.log(claim.uri);
 * });
 */
exports.process = async (publicKey) => {
  if (!publicKey || !(publicKey instanceof openpgp.key.Key)) {
    throw new Error('Invalid public key')
  }

  const fingerprint = await publicKey.primaryKey.getFingerprint()
  const primaryUser = await publicKey.getPrimaryUser()
  const users = publicKey.users
  const usersOutput = []

  users.forEach((user, i) => {
    usersOutput[i] = {
      userData: {
        id: user.userId ? user.userId.userid : null,
        name: user.userId ? user.userId.name : null,
        email: user.userId ? user.userId.email : null,
        comment: user.userId ? user.userId.comment : null,
        isPrimary: primaryUser.index === i,
        isRevoked: false
      },
      claims: []
    }

    if ('selfCertifications' in user && user.selfCertifications.length > 0) {
      const selfCertification = user.selfCertifications[0]

      const notations = selfCertification.rawNotations
      usersOutput[i].claims = notations
        .filter(
          ({ name, humanReadable }) =>
            humanReadable && (name === 'proof@ariadne.id' || name === 'proof@metacode.biz')
        )
        .map(
          ({ value }) =>
            new Claim(openpgp.util.decode_utf8(value), fingerprint)
        )

      usersOutput[i].userData.isRevoked = selfCertification.revoked
    }
  })

  return {
    fingerprint: fingerprint,
    users: usersOutput,
    primaryUserIndex: primaryUser.index,
    key: {
      data: publicKey,
      fetchMethod: null,
      uri: null
    }
  }
}
