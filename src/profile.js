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
import { Persona } from './persona.js'

/**
 * A profile of personas with identity claims
 * @function
 * @param {Array<Persona>} personas
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
     * @param {Array<Persona>} personas
     * @public
     */
  constructor (personas) {
    /**
         * List of personas
         * @type {Array<Persona>}
         * @public
         */
    this.personas = personas || []
    /**
         * Index of primary persona (to be displayed first or prominently)
         * @type {Number}
         * @public
         */
    this.primaryPersona = -1
  }
}
