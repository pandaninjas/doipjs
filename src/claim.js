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
  /**
   * Initialize a Claim object
   * @constructor
   * @param {string} [uri] - The URI of the identity claim
   * @param {string} [fingerprint] - The fingerprint of the OpenPGP key
   */
  constructor(uri, fingerprint) {
    // Import JSON
    if (typeof uri === 'object' && 'claimVersion' in uri) {
      switch (data.claimVersion) {
        case 1:
          this._uri = data.uri
          this._fingerprint = data.fingerprint
          this._state = data.state
          this._dataMatches = data.dataMatches
          this._verification = data.verification
          break

        default:
          throw new Error('Invalid claim version')
          break
      }
      return
    }

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

    this._uri = uri ? uri : null
    this._fingerprint = fingerprint ? fingerprint : null
    this._state = E.ClaimState.INIT
    this._dataMatches = null
    this._verification = null
  }

  /**
   * Get the claim's URI
   * @function
   * @returns {string}
   */
  get uri() {
    return this._uri
  }

  /**
   * Get the fingerprint the claim is supposed to acknowledge
   * @function
   * @returns {string}
   */
  get fingerprint() {
    return this._fingerprint
  }

  /**
   * Get the current state of the claim's verification process
   * @function
   * @returns {string}
   */
  get state() {
    return this._state
  }

  /**
   * Get the candidate claim definitions the URI matched against
   * @function
   * @returns {object}
   */
  get matches() {
    if (this._state === E.ClaimState.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    return this._dataMatches
  }

  /**
   * Get the result of the verification process
   * @function
   * @returns {object}
   */
  get result() {
    if (this._state !== E.ClaimState.VERIFIED) {
      throw new Error('This claim has not yet been verified')
    }
    return this.verification
    _
  }

  /**
   * Set the claim's URI
   * @function
   * @param {string} uri - The new claim URI
   */
  set uri(uri) {
    if (this._state !== E.ClaimState.INIT) {
      throw new Error(
        'Cannot change the URI, this claim has already been matched'
      )
    }
    // Verify validity of URI
    if (uri && !validUrl.isUri(uri)) {
      throw new Error('The URI was invalid')
    }
    // Remove leading and trailing spaces
    uri = uri.replace(/^\s+|\s+$/g, '')

    this._uri = uri
  }

  /**
   * Set the claim's fingerprint to verify against
   * @function
   * @param {string} fingerprint - The new fingerprint
   */
  set fingerprint(fingerprint) {
    if (this._state === E.ClaimState.VERIFIED) {
      throw new Error(
        'Cannot change the fingerprint, this claim has already been verified'
      )
    }
    this._fingerprint = fingerprint
  }

  /**
   * Throw error when attempting to alter the state
   * @function
   * @param anything - Anything will throw an error
   */
  set state(anything) {
    throw new Error("Cannot change a claim's state")
  }

  /**
   * Throw error when attempting to alter the dataMatches
   * @function
   * @param anything - Anything will throw an error
   */
  set dataMatches(anything) {
    throw new Error("Cannot change a claim's dataMatches")
  }

  /**
   * Throw error when attempting to alter the verification data
   * @function
   * @param anything - Anything will throw an error
   */
  set verification(anything) {
    throw new Error("Cannot change a claim's verification data")
  }

  /**
   * Match the claim's URI to candidate definitions
   * @function
   */
  match() {
    if (this._state !== E.ClaimState.INIT) {
      throw new Error('This claim was already matched')
    }
    if (this._uri === null) {
      throw new Error('This claim has no URI')
    }

    this._dataMatches = []

    claimDefinitions.list.every((name, i) => {
      const def = claimDefinitions.data[name]

      // If the candidate is invalid, continue matching
      if (!def.reURI.test(this._uri)) {
        return true
      }

      const candidate = def.processURI(this._uri)
      if (candidate.match.isAmbiguous) {
        // Add to the possible candidates
        this._dataMatches.push(candidate)
      } else {
        // Set a single candidate and stop
        this._dataMatches = [candidate]
        return false
      }

      // Continue matching
      return true
    })

    this._state = E.ClaimState.MATCHED
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
    if (this._state === E.ClaimState.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    if (this._state === E.ClaimState.VERIFIED) {
      throw new Error('This claim has already been verified')
    }
    if (this._fingerprint === null) {
      throw new Error('This claim has no fingerprint')
    }

    // Handle options
    opts = mergeOptions(defaults.opts, opts ? opts : {})

    // For each match
    for (let index = 0; index < this._dataMatches.length; index++) {
      const claimData = this._dataMatches[index]

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
        verificationResult = verifications.run(
          proofData.result,
          claimData,
          this._fingerprint
        )
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
        this._verification = verificationResult
        this._dataMatches = [claimData]
        index = this._dataMatches.length
      }
    }

    this._state = E.ClaimState.VERIFIED
  }

  /**
   * Get the ambiguity of the claim. A claim is only unambiguous if any
   * of the candidates is unambiguous. An ambiguous claim should never be
   * displayed in an user interface when its result is negative.
   * @function
   * @returns {boolean}
   */
  isAmbiguous() {
    if (this._state === E.ClaimState.INIT) {
      throw new Error('The claim has not been matched yet')
    }
    if (this._dataMatches.length === 0) {
      throw new Error('The claim has no matches')
    }
    return (
      this._dataMatches.length > 1 || this._dataMatches[0].match.isAmbiguous
    )
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
      uri: this._uri,
      fingerprint: this._fingerprint,
      state: this._state,
      dataMatches: this._dataMatches,
      verification: _this.verification,
    }
  }
}

module.exports = Claim
