/*
Copyright 2023 Yarmo Mackenbach

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
import isFQDN from 'validator/lib/isFQDN.js'
import { parse } from 'node-html-parser'
import { PublicKeyFetchMethod, PublicKeyEncoding, PublicKeyType } from './enums.js'
import { Persona } from './persona.js'
import { fetchASPE } from './asp.js'

/**
 * A profile of personas with identity claims
 * @function
 * @param {Array<import('./persona.js').Persona>} personas
 * @public
 * @example
 * const claim = Claim('https://alice.tld', '123');
 * const pers = Persona('Alice', 'About Alice', [claim]);
 * const profile = Profile([pers]);
 */
export class Profile {
  /**
   * Create a new profile
   * @function
   * @param {import('./enums.js').ProfileType} profileType
   * @param {string} identifier
   * @param {Array<import('./persona.js').Persona>} personas
   * @public
   */
  constructor (profileType, identifier, personas) {
    /**
     * Profile version
     * @type {number}
     * @public
     */
    this.profileVersion = 2
    /**
     * Profile version
     * @type {import('./enums.js').ProfileType}
     * @public
     */
    this.profileType = profileType
    /**
     * Identifier of the profile (fingerprint, email address, uri...)
     * @type {string}
     * @public
     */
    this.identifier = identifier
    /**
     * List of personas
     * @type {Array<import('./persona.js').Persona>}
     * @public
     */
    this.personas = personas || []
    /**
     * Index of primary persona (to be displayed first or prominently)
     * @type {number}
     * @public
     */
    this.primaryPersonaIndex = personas.length > 0 ? 0 : -1
    /**
     * The cryptographic key associated with the profile
     * @property {object}
     * @public
     */
    this.publicKey = {
      /**
       * The type of cryptographic key
       * @type {PublicKeyType}
       * @public
       */
      keyType: PublicKeyType.NONE,
      /**
       * The fingerprint of the cryptographic key
       * @type {string | null}
       * @public
       */
      fingerprint: null,
      /**
       * The encoding of the cryptographic key
       * @type {PublicKeyEncoding}
       * @public
       */
      encoding: PublicKeyEncoding.NONE,
      /**
       * The encoded cryptographic key
       * @type {string | null}
       * @public
       */
      encodedKey: null,
      /**
       * The raw cryptographic key as object (to be removed during toJSON())
       * @type {import('openpgp').PublicKey | import('jose').JWK | null}
       * @public
       */
      key: null,
      /**
       * Details on how to fetch the public key
       * @property {object}
       * @public
       */
      fetch: {
        /**
         * The method to fetch the key
         * @type {PublicKeyFetchMethod}
         * @public
         */
        method: PublicKeyFetchMethod.NONE,
        /**
         * The query to fetch the key
         * @type {string | null}
         * @public
         */
        query: null,
        /**
         * The URL the method eventually resolved to
         * @type {string | null}
         * @public
         */
        resolvedUrl: null
      }
    }
    /**
     * List of verifier URLs
     * @type {{name: string, url: string}[]}
     * @public
     */
    this.verifiers = []
  }

  /**
   * @function
   * @param {object} profileObject
   * @returns {Profile | Error}
   * @example
   * doip.Profile.fromJSON(JSON.stringify(profile));
   */
  static fromJSON (profileObject) {
    /** @type {Profile} */
    let profile
    let result

    if (typeof profileObject === 'object' && 'profileVersion' in profileObject) {
      switch (profileObject.profileVersion) {
        case 2:
          result = importJsonProfileVersion2(profileObject)
          if (result instanceof Error) {
            throw result
          }
          profile = result
          break

        default:
          throw new Error('Invalid profile version')
      }
    }

    return profile
  }

  /**
   * @function
   * @param {string} name
   * @param {string} url
   */
  addVerifier (name, url) {
    this.verifiers.push({ name, url })
  }

  /**
   * Get a JSON representation of the Profile object
   * @function
   * @returns {object}
   */
  toJSON () {
    return {
      profileVersion: this.profileVersion,
      profileType: this.profileType,
      identifier: this.identifier,
      personas: this.personas.map(x => x.toJSON()),
      primaryPersonaIndex: this.primaryPersonaIndex,
      publicKey: {
        keyType: this.publicKey.keyType,
        fingerprint: this.publicKey.fingerprint,
        encoding: this.publicKey.encoding,
        encodedKey: this.publicKey.encodedKey,
        fetch: {
          method: this.publicKey.fetch.method,
          query: this.publicKey.fetch.query,
          resolvedUrl: this.publicKey.fetch.resolvedUrl
        }
      },
      verifiers: this.verifiers
    }
  }
}

/**
 * @param {object} profileObject
 * @returns {Profile | Error}
 */
function importJsonProfileVersion2 (profileObject) {
  if (!('profileVersion' in profileObject && profileObject.profileVersion === 2)) {
    return new Error('Invalid profile')
  }

  const personas = profileObject.personas.map(x => Persona.fromJSON(x, 2))

  const profile = new Profile(profileObject.profileType, profileObject.identifier, personas)

  profile.primaryPersonaIndex = profileObject.primaryPersonaIndex
  profile.publicKey = profileObject.publicKey
  profile.verifiers = profileObject.verifiers

  return profile
}

/**
 * Resolve a profile identifier and return a [Profile]
 * @param {string} id
 * @returns {Promise<Profile | null>}
 */
export async function resolve (id) {
  /** @type {string | null} */
  let aliasedId = null

  // Attempt resolving as alias
  if (isFQDN(id)) {
    aliasedId = await resolveToAlias(id)
  }

  const finalId = aliasedId ?? id

  // Attempting resolving as ASPE
  if (/^aspe:(:?.*)/.test(finalId)) {
    return await fetchASPE(finalId)
  }

  return null
}

/**
 * @param {string} id
 * @returns {Promise<string | null>}
 */
async function resolveToAlias (id) {
  const url = new URL(`https://${id}`)
  const res = await fetch(url)
    .then(async res => {
      if (res.status >= 400) return null
      return await res.text()
    })
    .catch(_ => null)

  if (!res) return null

  const dom = parse(res)
  const meta = dom.querySelector('meta[name="ariadne-profile-id"]')

  if (!meta) return null

  return meta.attributes.content
}
