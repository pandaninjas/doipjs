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
const axios = require('axios').default
const validator = require('validator').default
const jsEnv = require('browser-or-node')

/**
 * @module fetcher/activitypub
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
 * @param {string} data.url                       - The URL of the account to verify
 * @param {number} [data.fetcherTimeout]          - Optional timeout for the fetcher
 * @param {object} opts                           - Options used to enable the request
 * @param {object} opts.claims
 * @param {object} opts.claims.activitypub
 * @param {string} opts.claims.activitypub.url    - The URL of the verifier account
 * @param {string} opts.claims.activitypub.privateKey   - The private key to sign the request
 * @returns {Promise<object>}
 */
module.exports.fn = async (data, opts) => {
  let crypto
  if (jsEnv.isNode) {
    crypto = require('crypto')
  }

  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    (async () => {
      let isConfigured = false
      try {
        validator.isURL(opts.claims.activitypub.url)
        isConfigured = true
      } catch (_) {}

      const now = new Date()
      const { host, pathname, search } = new URL(data.url)

      const headers = {
        host,
        date: now.toUTCString(),
        accept: 'application/activity+json',
        'User-Agent': `doipjs/${require('../../package.json').version}`
      }

      if (isConfigured && jsEnv.isNode) {
        // Generate the signature
        const signedString = `(request-target): get ${pathname}${search}\nhost: ${host}\ndate: ${now.toUTCString()}`
        const sign = crypto.createSign('SHA256')
        sign.write(signedString)
        sign.end()
        const signatureSig = sign.sign(opts.claims.activitypub.privateKey.replace(/\\n/g, '\n'), 'base64')
        headers.signature = `keyId="${opts.claims.activitypub.url}#main-key",headers="(request-target) host date",signature="${signatureSig}",algorithm="rsa-sha256"`
      }

      axios.get(data.url,
        {
          headers
        })
        .then(res => {
          return res.data
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })()
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
