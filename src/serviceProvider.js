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
import { ClaimFormat, ClaimRelation, EntityEncodingFormat, ProofAccessRestriction, ProofFormat } from "./enums"

/**
 * The method to find the proof inside the response data
 * @typedef {Object} ProofTarget
 * @property {ClaimFormat} format - How the response data is formatted
 * @property {EntityEncodingFormat} encoding - How the response data is encoded
 * @property {ClaimRelation} relation - How the proof is related to the response data
 * @property {string[]} path - Path to the proof inside the response data object
 */

/**
 * A service provider matched to an identity claim
 * @class
 * @constructor
 * @public
 */
export class ServiceProvider {
  /**
   * @param {object} spObj
   */
  constructor (spObj) {
    /**
     * Details about the service provider
     * @property {object}
     */
    this.about = {
      /**
       * Identifier of the service provider (no whitespace or symbols, lowercase)
       * @type {string}
       */
      id: spObj.about.id,
      /**
       * Full name of the service provider
       * @type {string}
       */
      name: spObj.about.name,
      /**
       * URL to the homepage of the service provider
       * @type {string | null}
       */
      homepage: spObj.about.homepage || null
    }
    /**
     * What the profile would look like if the match is correct
     * @property {object}
     */
    this.profile = {
      /**
       * Profile name to be displayed
       * @type {string}
       */
      display: spObj.profile.display,
      /**
       * URI or URL for public access to the profile
       * @type {string}
       */
      uri: spObj.profile.uri,
      /**
       * URI or URL associated with the profile usually served as a QR code
       * @type {string | null}
       */
      qr: spObj.profile.qr || null
    }
    /**
     * Details from the claim matching process
     * @property {object}
     */
    this.claim = {
      /**
       * Regular expression used to parse the URI
       * @type {string}
       */
      uriRegularExpression: spObj.claim.uriRegularExpression,
      /**
       * Whether this match automatically excludes other matches
       * @type {boolean}
       */
      uriIsAmbiguous: spObj.claim.uriIsAmbiguous
    }
    /**
     * Information for the proof verification process
     * @property {object}
     */
    this.proof = {
      /**
       * Details to request the potential proof
       * @property {object}
       */
      request: {
        /**
         * Location of the proof
         * @type {string | null}
         */
        uri: spObj.proof.request.uri,
        /**
         * Fetcher to be used to request the proof
         * @type {string}
         */
        fetcher: spObj.proof.request.fetcher,
        /**
         * Type of access restriction
         * @type {ProofAccessRestriction}
         */
        accessRestriction: spObj.proof.request.accessRestriction,
        /**
         * Data needed by the fetcher or proxy to request the proof
         * @type {object}
         */
        data: spObj.proof.request.data
      },
      /**
       * Details about the expected response
       * @property {object}
       */
      response: {
        /**
         * Expected format of the proof
         * @type {ProofFormat}
         */
        format: spObj.proof.response.format
      },
      /**
       * Details about the target located in the response
       * @type {ProofTarget[]}
       */
      target: spObj.proof.target
    }
  }

  /**
   * Get a JSON representation of the ServiceProvider object
   * @function
   * @returns {object}
   */
  toJSON () {
    return {
      about: this.about,
      profile: this.profile,
      claim: this.claim,
      proof: this.proof
    }
  }
}
