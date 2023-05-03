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
const axios = require('axios').default
const validUrl = require('valid-url')
const openpgp = require('openpgp')
const HKP = require('@openpgp/hkp-client')
const WKD = require('@openpgp/wkd-client')
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
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetchHKP('alice@domain.tld');
 * const key2 = doip.keys.fetchHKP('123abc123abc');
 */
const fetchHKP = async (identifier, keyserverDomain) => {
  const keyserverBaseUrl = keyserverDomain
    ? `https://${keyserverDomain}`
    : 'https://keys.openpgp.org'

  const hkp = new HKP(keyserverBaseUrl)
  const lookupOpts = {
    query: identifier
  }

  const publicKey = await hkp
    .lookup(lookupOpts)
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })

  if (!publicKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return await openpgp.readKey({
    armoredKey: publicKey
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })
}

/**
 * Fetch a public key using Web Key Directory
 * @function
 * @param {string} identifier - Identifier of format 'username@domain.tld`
 * @returns {openpgp.PublicKey}
 * @example
 * const key = doip.keys.fetchWKD('alice@domain.tld');
 */
const fetchWKD = async (identifier) => {
  const wkd = new WKD()
  const lookupOpts = {
    email: identifier
  }

  const publicKey = await wkd
    .lookup(lookupOpts)
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })

  if (!publicKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return await openpgp.readKey({
    binaryKey: publicKey
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })
}

/**
 * Fetch a public key from Keybase
 * @function
 * @param {string} username     - Keybase username
 * @param {string} fingerprint  - Fingerprint of key
 * @returns {openpgp.PublicKey}
 * @example
 * const key = doip.keys.fetchKeybase('alice', '123abc123abc');
 */
const fetchKeybase = async (username, fingerprint) => {
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

  return await openpgp.readKey({
    armoredKey: rawKeyContent
  })
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })
}

/**
 * Get a public key from plaintext data
 * @function
 * @param {string} rawKeyContent - Plaintext ASCII-formatted public key data
 * @returns {openpgp.PublicKey}
 * @example
 * const plainkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
 *
 * mQINBF0mIsIBEADacleiyiV+z6FIunvLWrO6ZETxGNVpqM+WbBQKdW1BVrJBBolg
 * [...]
 * =6lib
 * -----END PGP PUBLIC KEY BLOCK-----`
 * const key = doip.keys.fetchPlaintext(plainkey);
 */
const fetchPlaintext = async (rawKeyContent) => {
  const publicKey = await openpgp.readKey({
    armoredKey: rawKeyContent
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })

  return publicKey
}

/**
 * Fetch a public key using an URI
 * @function
 * @param {string} uri - URI that defines the location of the key
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const key2 = doip.keys.fetchURI('hkp:123abc123abc');
 * const key3 = doip.keys.fetchURI('wkd:alice@domain.tld');
 */
const fetchURI = async (uri) => {
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
      return await fetchHKP(
        match[3] ? match[3] : match[2],
        match[3] ? match[2] : null
      )

    case 'wkd':
      return await fetchWKD(match[2])

    case 'kb':
      return await fetchKeybase(match[2], match.length >= 4 ? match[3] : null)

    default:
      throw new Error('Invalid URI protocol')
  }
}

/**
 * Fetch a public key
 *
 * This function will attempt to detect the identifier and fetch the key
 * accordingly. If the identifier is an email address, it will first try and
 * fetch the key using WKD and then HKP. Otherwise, it will try HKP only.
 *
 * This function will also try and parse the input as a plaintext key
 * @function
 * @param {string} identifier - URI that defines the location of the key
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetch('alice@domain.tld');
 * const key2 = doip.keys.fetch('123abc123abc');
 */
const fetch = async (identifier) => {
  const re = /([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/
  const match = identifier.match(re)

  let pubKey = null

  // Attempt plaintext
  if (!pubKey) {
    try {
      pubKey = await fetchPlaintext(identifier)
    } catch (e) {}
  }

  // Attempt WKD
  if (!pubKey && identifier.includes('@')) {
    try {
      pubKey = await fetchWKD(match[1])
    } catch (e) {}
  }

  // Attempt HKP
  if (!pubKey) {
    pubKey = await fetchHKP(
      match[2] ? match[2] : match[1],
      match[2] ? match[1] : null
    )
  }

  if (!pubKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return pubKey
}

/**
 * Process a public key to get user data and claims
 * @function
 * @param {openpgp.PublicKey} publicKey - The public key to process
 * @returns {object}
 * @example
 * const key = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const data = doip.keys.process(key);
 * data.users[0].claims.forEach(claim => {
 *   console.log(claim.uri);
 * });
 */
const process = async (publicKey) => {
  if (!(publicKey && (publicKey instanceof openpgp.PublicKey))) {
    throw new Error('Invalid public key')
  }

  const fingerprint = publicKey.getFingerprint()
  const primaryUser = await publicKey.getPrimaryUser()
  const users = publicKey.users
  const usersOutput = []

  users.forEach((user, i) => {
    usersOutput[i] = {
      userData: {
        id: user.userID ? user.userID.userID : null,
        name: user.userID ? user.userID.name : null,
        email: user.userID ? user.userID.email : null,
        comment: user.userID ? user.userID.comment : null,
        isPrimary: primaryUser.index === i,
        isRevoked: false
      },
      claims: []
    }

    if ('selfCertifications' in user && user.selfCertifications.length > 0) {
      const selfCertification = user.selfCertifications.sort((e1, e2) => e2.created - e1.created)[0]

      const notations = selfCertification.rawNotations
      usersOutput[i].claims = notations
        .filter(
          ({ name, humanReadable }) =>
            humanReadable && (name === 'proof@ariadne.id' || name === 'proof@metacode.biz')
        )
        .map(
          ({ value }) =>
            new Claim(new TextDecoder().decode(value), fingerprint)
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

exports.fetchHKP = fetchHKP
exports.fetchWKD = fetchWKD
exports.fetchKeybase = fetchKeybase
exports.fetchPlaintext = fetchPlaintext
exports.fetchURI = fetchURI
exports.fetch = fetch
exports.process = process
