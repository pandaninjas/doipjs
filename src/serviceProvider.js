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
import * as Types from './types.js'

/**
 * A service provider matched to an identity claim
 * @class
 * @public
 */
export class ServiceProvider {
  /**
   * @param {Types.ServiceProviderObject} serviceProviderObject - JSON representation of a {@link ServiceProvider}
   */
  constructor (serviceProviderObject) {
    /**
     * Details about the service provider
     * @type {Types.ServiceProviderAbout}
     */
    this.about = serviceProviderObject.about
    /**
     * What the profile would look like if a claim matches this service provider
     * @type {Types.ServiceProviderProfile}
     */
    this.profile = serviceProviderObject.profile
    /**
     * Information about the claim matching process
     * @type {Types.ServiceProviderClaim}
     */
    this.claim = serviceProviderObject.claim
    /**
     * Information for the proof verification process
     * @type {Types.ServiceProviderProof}
     */
    this.proof = serviceProviderObject.proof
  }

  /**
   * Get a JSON representation of the {@link ServiceProvider}
   * @function
   * @returns {Types.ServiceProviderObject} JSON representation of a {@link ServiceProvider}
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
