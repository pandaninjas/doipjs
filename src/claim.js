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
const validator = require('validator')
const validUrl = require('valid-url')
const mergeOptions = require('merge-options')
const proofs = require('./proofs')
const verifications = require('./verifications')
const claimDefinitions = require('./claimDefinitions')
const defaults = require('./defaults')
const E = require('./enums')

/**
 * @class
 * @classdesc OpenPGP-based identity claim
 * @property {string} uri             - The claim's URI
 * @property {string} fingerprint     - The fingerprint to verify the claim against
 * @property {string} status          - The current status of the claim
 * @property {Array<object>} matches  - The claim definitions matched against the URI
 * @property {object} result          - The result of the verification process
 */
class Claim {
  /**
   * Initialize a Claim object
   * @constructor
   * @param {string} [uri]          - The URI of the identity claim
   * @param {string} [fingerprint]  - The fingerprint of the OpenPGP key
   * @example
   * const claim = doip.Claim();
   * const claim = doip.Claim('dns:domain.tld?type=TXT');
   * const claim = doip.Claim('dns:domain.tld?type=TXT', '123abc123abc');
   */
  constructor(uri, fingerprint) {
    // Import JSON
    if (typeof uri === 'object' && 'claimVersion' in uri) {
      switch (data.claimVersion) {
        case 1:
          this._uri = data.uri
          this._fingerprint = data.fingerprint
          this._status = data.status
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
    this._status = E.ClaimStatus.INIT
    this._dataMatches = null
    this._verification = null
  }

  get uri() {
    return this._uri
  }

  get fingerprint() {
    return this._fingerprint
  }

  get status() {
    return this._status
  }

  get matches() {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    return this._dataMatches
  }

  get result() {
    if (this._status !== E.ClaimStatus.VERIFIED) {
      throw new Error('This claim has not yet been verified')
    }
    return this._verification
  }

  set uri(uri) {
    if (this._status !== E.ClaimStatus.INIT) {
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

  set fingerprint(fingerprint) {
    if (this._status === E.ClaimStatus.VERIFIED) {
      throw new Error(
        'Cannot change the fingerprint, this claim has already been verified'
      )
    }
    this._fingerprint = fingerprint
  }

  set status(anything) {
    throw new Error("Cannot change a claim's status")
  }

  set dataMatches(anything) {
    throw new Error("Cannot change a claim's dataMatches")
  }

  set verification(anything) {
    throw new Error("Cannot change a claim's verification data")
  }

  /**
   * Match the claim's URI to candidate definitions
   * @function
   */
  match() {
    if (this._status !== E.ClaimStatus.INIT) {
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

    this._status = E.ClaimStatus.MATCHED
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
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    if (this._status === E.ClaimStatus.VERIFIED) {
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

    this._status = E.ClaimStatus.VERIFIED
  }

  /**
   * Determine the ambiguity of the claim. A claim is only unambiguous if any
   * of the candidates is unambiguous. An ambiguous claim should never be
   * displayed in an user interface when its result is negative.
   * @function
   * @returns {boolean}
   */
  isAmbiguous() {
    if (this._status === E.ClaimStatus.INIT) {
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
      status: this._status,
      dataMatches: this._dataMatches,
      verification: this._verification,
    }
  }
}

module.exports = Claim
