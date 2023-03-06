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
 * @property {object} verification    - The result of the verification process
 */
class Claim {
  /**
   * Initialize a Claim object
   * @constructor
   * @param {string|object} [uri]   - The URI of the identity claim or a JSONified Claim instance
   * @param {string} [fingerprint]  - The fingerprint of the OpenPGP key
   * @example
   * const claim = doip.Claim();
   * const claim = doip.Claim('dns:domain.tld?type=TXT');
   * const claim = doip.Claim('dns:domain.tld?type=TXT', '123abc123abc');
   * const claimAlt = doip.Claim(JSON.stringify(claim));
   */
  constructor (uri, fingerprint) {
    // Import JSON
    if (typeof uri === 'object' && 'claimVersion' in uri) {
      const data = uri
      switch (data.claimVersion) {
        case 1:
          this._uri = data.uri
          this._fingerprint = data.fingerprint
          this._status = data.status
          this._matches = data.matches
          this._verification = data.verification
          break

        default:
          throw new Error('Invalid claim version')
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
        throw new Error('Invalid fingerprint')
      }
    }

    this._uri = uri || ''
    this._fingerprint = fingerprint || ''
    this._status = E.ClaimStatus.INIT
    this._matches = []
    this._verification = {}
  }

  get uri () {
    return this._uri
  }

  get fingerprint () {
    return this._fingerprint
  }

  get status () {
    return this._status
  }

  get matches () {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    return this._matches
  }

  get verification () {
    if (this._status !== E.ClaimStatus.VERIFIED) {
      throw new Error('This claim has not yet been verified')
    }
    return this._verification
  }

  set uri (uri) {
    if (this._status !== E.ClaimStatus.INIT) {
      throw new Error(
        'Cannot change the URI, this claim has already been matched'
      )
    }
    // Verify validity of URI
    if (uri.length > 0 && !validUrl.isUri(uri)) {
      throw new Error('The URI was invalid')
    }
    // Remove leading and trailing spaces
    uri = uri.replace(/^\s+|\s+$/g, '')

    this._uri = uri
  }

  set fingerprint (fingerprint) {
    if (this._status === E.ClaimStatus.VERIFIED) {
      throw new Error(
        'Cannot change the fingerprint, this claim has already been verified'
      )
    }
    this._fingerprint = fingerprint
  }

  set status (anything) {
    throw new Error("Cannot change a claim's status")
  }

  set matches (anything) {
    throw new Error("Cannot change a claim's matches")
  }

  set verification (anything) {
    throw new Error("Cannot change a claim's verification result")
  }

  /**
   * Match the claim's URI to candidate definitions
   * @function
   */
  match () {
    if (this._status !== E.ClaimStatus.INIT) {
      throw new Error('This claim was already matched')
    }
    if (this._uri.length === 0 || !validUrl.isUri(this._uri)) {
      throw new Error('This claim has no URI')
    }

    this._matches = []

    claimDefinitions.list.every((name, i) => {
      const def = claimDefinitions.data[name]

      // If the candidate is invalid, continue matching
      if (!def.reURI.test(this._uri)) {
        return true
      }

      const candidate = def.processURI(this._uri)
      // If the candidate could not be processed, continue matching
      if (!candidate) {
        return true
      }

      if (candidate.match.isAmbiguous) {
        // Add to the possible candidates
        this._matches.push(candidate)
      } else {
        // Set a single candidate and stop
        this._matches = [candidate]
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
  async verify (opts) {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    if (this._status === E.ClaimStatus.VERIFIED) {
      throw new Error('This claim has already been verified')
    }
    if (this._fingerprint.length === 0) {
      throw new Error('This claim has no fingerprint')
    }

    // Handle options
    opts = mergeOptions(defaults.opts, opts || {})

    // If there are no matches
    if (this._matches.length === 0) {
      this._verification = {
        result: false,
        completed: true,
        proof: {},
        errors: ['No matches for claim']
      }
    }

    // For each match
    for (let index = 0; index < this._matches.length; index++) {
      let claimData = this._matches[index]

      let verificationResult = null
      let proofData = null
      let proofFetchError

      try {
        proofData = await proofs.fetch(claimData, opts)
      } catch (err) {
        proofFetchError = err
      }

      if (proofData) {
        // Run the verification process
        verificationResult = await verifications.run(
          proofData.result,
          claimData,
          this._fingerprint
        )
        verificationResult.proof = {
          fetcher: proofData.fetcher,
          viaProxy: proofData.viaProxy
        }

        // Post process the data
        const def = claimDefinitions.data[claimData.serviceprovider.name]
        if (def.functions?.postprocess) {
          try {
            ({ claimData, proofData } = def.functions.postprocess(claimData, proofData))
          } catch (_) {}
        }
      } else {
        // Consider the proof completed but with a negative result
        verificationResult = verificationResult || {
          result: false,
          completed: true,
          proof: {},
          errors: [proofFetchError]
        }
      }

      if (this.isAmbiguous() && !verificationResult.result) {
        // Assume a wrong match and continue
        continue
      }

      if (verificationResult.completed) {
        // Store the result, keep a single match and stop verifying
        this._verification = verificationResult
        this._matches = [claimData]
        index = this._matches.length
      }
    }

    // Fail safe verification result
    this._verification = this._verification
      ? this._verification
      : {
          result: false,
          completed: true,
          proof: {},
          errors: []
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
  isAmbiguous () {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('The claim has not been matched yet')
    }
    if (this._matches.length === 0) {
      throw new Error('The claim has no matches')
    }
    return this._matches.length > 1 || this._matches[0].match.isAmbiguous
  }

  /**
   * Get a JSON representation of the Claim object. Useful when transferring
   * data between instances/machines.
   * @function
   * @returns {object}
   */
  toJSON () {
    return {
      claimVersion: 1,
      uri: this._uri,
      fingerprint: this._fingerprint,
      status: this._status,
      matches: this._matches,
      verification: this._verification
    }
  }
}

module.exports = Claim
