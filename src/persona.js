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
// eslint-disable-next-line
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
     * @param {string} [description]
     * @param {Claim[]} [claims]
     */
  constructor (name, description, claims) {
    /**
         * Name to be displayed on the profile page
         * @type {string}
         * @public
         */
    this.name = name
    /**
         * Description to be displayed on the profile page
         * @type {string}
         * @public
         */
    this.description = description
    /**
         * List of identity claims
         * @type {Array<Claim>}
         * @public
         */
    this.claims = claims
  }
}
