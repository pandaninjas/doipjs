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
const axios = require('axios').default
const validator = require('validator').default

/**
 * @module fetcher/matrix
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                           - Data used in the request
 * @param {string} data.eventId                   - The identifier of the targeted post
 * @param {string} data.roomId                    - The identifier of the room containing the targeted post
 * @param {object} opts                           - Options used to enable the request
 * @param {string} opts.claims.matrix.instance    - The server hostname on which the library can log in
 * @param {string} opts.claims.matrix.accessToken - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
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
    try {
      validator.isFQDN(opts.claims.matrix.instance)
      validator.isAscii(opts.claims.matrix.accessToken)
    } catch (err) {
      throw new Error(`Matrix fetcher was not set up properly (${err.message})`)
    }

    const url = `https://${opts.claims.matrix.instance}/_matrix/client/r0/rooms/${data.roomId}/event/${data.eventId}?access_token=${opts.claims.matrix.accessToken}`
    axios.get(url,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': `doipjs/${require('../../package.json').version}`
        }
      })
      .then(res => {
        return res.data
      })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
