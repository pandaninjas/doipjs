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
const validator = require('validator')
const validUrl = require('valid-url')
const mergeOptions = require('merge-options')
const keys = require('./keys')
const proofs = require('./proofs')
const verifications = require('./verifications')
const claimDefinitions = require('./claimDefinitions')
const defaults = require('./defaults')
const E = require('./enums')

/**
 * OpenPGP-based identity claim
 * @class
 */
class Claim {
  #uri
  #fingerprint
  #state
  #dataMatches
  #verification

  /**
   * Initialize a Claim object
   * @constructor
   * @param {string} [uri] - The URI of the identity claim
   * @param {string} [fingerprint] - The fingerprint of the OpenPGP key
   */
  constructor(uri, fingerprint) {
    // Verify validity of URI
    if (uri && !validUrl.isUri(uri)) {
      throw new Error('Invalid URI')
    }
    // Verify validity of fingerprint
    if (fingerprint) {
      try {
        validator.isAlphanumeric(fingerprint)
      } catch (err) {
        throw new Error(`Invalid fingerprint`)
      }
    }

    this.#uri = uri ? uri : null
    this.#fingerprint = fingerprint ? fingerprint : null
    this.#state = Claim.State.INIT
    this.#dataMatches = null
    this.#verification = null
  }

  /**
   * Enum for the current verification state of the claim
   * @readonly
   * @enum {string}
   */
  static State = {
    INIT: 'init',
    MATCHED: 'matched',
    VERIFIED: 'verified',
  }

  /**
   * Generate an array of claim objects from an OpenPGP key's notations 
   * @static
   * @async
   * @function
   * @param {Key} key - Public key
   * @returns {Claim}
   */
  static async fromKey(key) {
    if (!(key instanceof openpgp.key.Key)) {
      throw new Error('Input is not an OpenPGP key')
    }
    const fingerprintFromKey = await keys.getFingerprint(key)
    const userData = await keys.getUserData(key)

    let claims = []
    userData.forEach((user, i) => {
      let userClaims = []
      user.notations.forEach((notation, j) => {
        userClaims.push(new Claim(notation, fingerprintFromKey))
      })
      claims.push(userClaims)
    })
    return claims
  }

  /**
   * Generate a claim object from a JSON object
   * @static
   * @function
   * @param {object} data - JSON data
   * @returns {Claim}
   */
  static fromJSON(data) {
    switch (data.claimVersion) {
      case 1:
        const claim = new Claim()
        claim.#uri = data.uri
        claim.#fingerprint = data.fingerprint
        claim.#state = data.state
        claim.#dataMatches = data.dataMatches
        claim.#verification = data.verification
        return claim
        break
    
      default:
        throw new Error('Invalid claim version')
        break
    }
  }

  /**
   * Get the default options used for verification
   * @static
   * @function
   * @returns {object}
   */
  static get defaultOpts() {
    return defaults.opts
  }

  /**
   * Get the claim's URI
   * @function
   * @returns {string}
   */
  get uri() {
    return this.#uri
  }

  /**
   * Get the fingerprint the claim is supposed to acknowledge
   * @function
   * @returns {string}
   */
  get fingerprint() {
    return this.#fingerprint
  }

  /**
   * Get the current state of the claim's verification process
   * @function
   * @returns {string}
   */
  get state() {
    return this.#state
  }

  /**
   * Get the candidate claim definitions the URI matched against 
   * @function
   * @returns {object}
   */
  get matches() {
    if (this.#state === Claim.State.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    return this.#dataMatches
  }

  /**
   * Get the result of the verification process
   * @function
   * @returns {object}
   */
  get result() {
    if (this.#state !== Claim.State.VERIFIED) {
      throw new Error('This claim has not yet been verified')
    }
    return this.#verification
  }

  /**
   * Set the claim's URI
   * @function
   * @param {string} uri - The new claim URI
   */
  set uri(uri) {
    if (this.#state !== Claim.State.INIT) {
      throw new Error('Cannot change the URI, this claim has already been matched')
    }
    // Verify validity of URI
    if (uri && !validUrl.isUri(uri)) {
      throw new Error('The URI was invalid')
    }
    // Remove leading and trailing spaces
    uri = uri.replace(/^\s+|\s+$/g, '')

    this.#uri = uri
  }

  /**
   * Set the claim's fingerprint to verify against
   * @function
   * @param {string} fingerprint - The new fingerprin
   */
  set fingerprint(fingerprint) {
    if (this.#state === Claim.State.VERIFIED) {
      throw new Error('Cannot change the fingerprint, this claim has already been verified')
    }
    this.#fingerprint = fingerprint
  }

  /**
   * Match the claim's URI to candidate definitions
   * @function
   */
  match() {
    if (this.#state !== Claim.State.INIT) {
      throw new Error('This claim was already matched')
    }
    if (this.#uri === null) {
      throw new Error('This claim has no URI')
    }

    this.#dataMatches = []

    claimDefinitions.list.every((name, i) => {
      const def = claimDefinitions.data[name]

      // If the candidate is invalid, continue matching
      if (!def.reURI.test(this.#uri)) {
        return true
      }

      const candidate = def.processURI(this.#uri)
      if (candidate.match.isAmbiguous) {
        // Add to the possible candidates
        this.#dataMatches.push(candidate)
      } else {
        // Set a single candidate and stop
        this.#dataMatches = [
          candidate
        ]
        return false
      }

      // Continue matching
      return true
    })

    this.#state = Claim.State.MATCHED
  }

  /**
   * Verify the claim. The proof for each candidate is sequentially fetched and
   * checked for the fingerprint. The verification stops when either a positive
   * result was obtained, or an unambiguous claim definition was processed
   * regardless of the result.
   * @async
   * @function
   * @param {object} [opts] - Options for proxy, fetchers
   */
  async verify(opts) {
    if (this.#state === Claim.State.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    if (this.#state === Claim.State.VERIFIED) {
      throw new Error('This claim has already been verified')
    }
    if (this.#fingerprint === null) {
      throw new Error('This claim has no fingerprint')
    }

    // Handle options
    opts = mergeOptions(defaults.opts, opts ? opts : {})

    // For each match
    for (let index = 0; index < this.#dataMatches.length; index++) {
      const claimData = this.#dataMatches[index]
      
      let verificationResult,
        proofData = null,
        proofFetchError

      try {
        proofData = await proofs.fetch(claimData, opts)
      } catch (err) {
        proofFetchError = err
      }

      if (proofData) {
        // Run the verification process
        verificationResult = verifications.run(proofData.result, claimData, this.#fingerprint)
        verificationResult.proof = {
          fetcher: proofData.fetcher,
          viaProxy: proofData.viaProxy,
        }
      } else {
        if (this.isAmbiguous()) {
          // Assume a wrong match and continue
          continue
        }

        // Consider the proof completed but with a negative result
        verificationResult = {
          result: false,
          completed: true,
          proof: {},
          errors: [proofFetchError],
        }
      }

      if (verificationResult.completed) {
        // Store the result, keep a single match and stop verifying
        this.#verification = verificationResult
        this.#dataMatches = [
          claimData
        ]
        index = this.#dataMatches.length
      }
    }

    this.#state = Claim.State.VERIFIED
  }

  /**
   * Get the ambiguity of the claim. A claim is only unambiguous if any
   * of the candidates is unambiguous. An ambiguous claim should never be
   * displayed in an user interface when its result is negative.
   * @function
   * @returns {boolean}
   */
  isAmbiguous() {
    if (this.#state === Claim.State.INIT) {
      throw new Error('The claim has not been matched yet')
    }
    if (this.#dataMatches.length === 0) {
      throw new Error('The claim has no matches')
    } 
    return this.#dataMatches.length > 1 || this.#dataMatches[0].match.isAmbiguous
  }

  /**
   * Get a JSON representation of the Claim object. Useful when transferring 
   * data between instances/machines.
   * @function
   * @returns {object}
   */
  toJSON() {
    return {
      claimVersion: 1,
      uri: this.#uri,
      fingerprint: this.#fingerprint,
      state: this.#state,
      dataMatches: this.#dataMatches,
      verification: this.#verification,
    }
  }
}

module.exports = Claim 