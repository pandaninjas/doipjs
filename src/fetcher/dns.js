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
const jsEnv = require("browser-or-node")

/**
 * @module fetcher/dns
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

if (!jsEnv.isNode) {
  const dns = require('dns')

  /**
   * Execute a fetch request
   * @function
   * @async
   * @param {object} data         - Data used in the request
   * @param {string} data.domain  - The targeted domain
   * @returns {object}
   */
  module.exports.fn = async (data, opts) => {
    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      dns.resolveTxt(data.domain, (err, records) => {
        if (err) {
          reject(err)
          return
        }

        resolve({
          domain: data.domain,
          records: {
            txt: records,
          },
        })
      })
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}