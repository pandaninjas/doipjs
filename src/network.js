/*
Copyright 2022 Yarmo Mackenbach

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
const axios = require('axios')

/**
 * Network related functions
 * @module keys
 */

/**
 * Make a GET HTTP request
 * @function
 * @param {string} url            - URL for the Axios request
 * @param {object} requestConfig  - Config for Axios request
 * @param {object} opts           - doip options
 * @returns {object}
 */
const get = (url, requestConfig, opts) => {
  return new Promise((resolve, reject) => {
    switch (opts.flaresolverr.url === '') {
      case false:
        axios.get(url, requestConfig)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break

      case true:
      default:
        axios.get(url, requestConfig)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
    }
  })
}

exports.get = get
