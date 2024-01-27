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
import { Claim } from './claim.js'

/**
 * A persona with identity claims
 * @class
 * @constructor
 * @public
 * @example
 * const claim = Claim('https://alice.tld', '123');
 * const pers = Persona('Alice', 'About Alice', [claim]);
 */
export class Persona {
  /**
   * @param {string} name
   * @param {Claim[]} claims
   */
  constructor (name, claims) {
    /**
     * Identifier of the persona
     * @type {string | null}
     * @public
     */
    this.identifier = null
    /**
     * Name to be displayed on the profile page
     * @type {string}
     * @public
     */
    this.name = name
    /**
     * Email address of the persona
     * @type {string | null}
     * @public
     */
    this.email = null
    /**
     * Description to be displayed on the profile page
     * @type {string | null}
     * @public
     */
    this.description = null
    /**
     * URL to an avatar image
     * @type {string | null}
     * @public
     */
    this.avatarUrl = null
    /**
     * Theme color
     * @type {string | null}
     * @public
     */
    this.themeColor = null
    /**
     * List of identity claims
     * @type {Claim[]}
     * @public
     */
    this.claims = claims
    /**
     * Has the persona been revoked
     * @type {boolean}
     * @public
     */
    this.isRevoked = false
  }

  /**
   * @function
   * @param {object} personaObject
   * @param {number} profileVersion
   * @returns {Persona | Error}
   * @example
   * doip.Persona.fromJSON(JSON.stringify(persona), 2);
   */
  static fromJSON (personaObject, profileVersion) {
    /** @type {Persona} */
    let persona
    let result

    if (typeof personaObject === 'object' && profileVersion) {
      switch (profileVersion) {
        case 2:
          result = importJsonPersonaVersion2(personaObject)
          if (result instanceof Error) {
            throw result
          }
          persona = result
          break

        default:
          throw new Error('Invalid persona version')
      }
    }

    return persona
  }

  /**
   * @function
   * @param {string} identifier
   */
  setIdentifier (identifier) {
    this.identifier = identifier
  }

  /**
   * @function
   * @param {string} description
   */
  setDescription (description) {
    this.description = description
  }

  /**
   * @function
   * @param {string} email
   */
  setEmailAddress (email) {
    this.email = email
  }

  /**
   * @function
   * @param {string} avatarUrl
   */
  setAvatarUrl (avatarUrl) {
    this.avatarUrl = avatarUrl
  }

  /**
   * @function
   * @param {Claim} claim
   */
  addClaim (claim) {
    this.claims.push(claim)
  }

  /**
   * @function
   */
  revoke () {
    this.isRevoked = true
  }

  /**
   * Get a JSON representation of the Profile object
   * @function
   * @returns {object}
   */
  toJSON () {
    return {
      identifier: this.identifier,
      name: this.name,
      email: this.email,
      description: this.description,
      avatarUrl: this.avatarUrl,
      themeColor: this.themeColor,
      isRevoked: this.isRevoked,
      claims: this.claims.map(x => x.toJSON())
    }
  }
}

/**
 * @param {object} personaObject
 * @returns {Persona | Error}
 */
function importJsonPersonaVersion2 (personaObject) {
  const claims = personaObject.claims.map(x => Claim.fromJSON(x))

  const persona = new Persona(personaObject.name, claims)

  persona.identifier = personaObject.identifier
  persona.email = personaObject.email
  persona.description = personaObject.description
  persona.avatarUrl = personaObject.avatarUrl
  persona.themeColor = personaObject.avatarUrl
  persona.isRevoked = personaObject.isRevoked

  return persona
}
