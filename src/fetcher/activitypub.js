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
const axios = require('axios')
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
 * @param {string} data.username                  - The username of the account to verify
 * @param {string} data.domain                    - The domain of the ActivityPub instance
 * @param {object} opts                           - Options used to enable the request
 * @param {string} opts.claims.activitypub.acct   - The identifier of the verifier account
 * @param {string} opts.claims.activitypub.privateKey   - The private key to sign the request
 * @returns {object}
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
      if (!opts.claims.activitypub.acct.match(/acct:(.*)@(.*)/)) {
        reject(new Error('ActivityPub fetcher was not set up properly'))
      }

      const urlWebfinger = `https://${data.domain}/.well-known/webfinger?resource=acct:${data.username}@${data.domain}`
      const webfinger = await axios.get(urlWebfinger,
        {
          headers: { Accept: 'application/json' }
        })
        .then(res => {
          return res.data
        })
        .catch(error => {
          reject(error)
        })

      let urlActivitypub = null
      webfinger.links.forEach(element => {
        if (element.type === 'application/activity+json') {
          urlActivitypub = element.href
        }
      })

      // Prepare the signature
      const matchAcct = opts.claims.activitypub.acct.match(/acct:(.*)@(.*)/)
      const now = new Date()
      const { host, pathname, search } = new URL(urlActivitypub)
      const signedString = `(request-target): get ${pathname}${search}\nhost: ${host}\ndate: ${now.toUTCString()}`

      const headers = {
        host,
        date: now.toUTCString(),
        accept: 'application/activity+json'
      }

      if (jsEnv.isNode) {
        // Generate the signature
        const sign = crypto.createSign('SHA256')
        sign.write(signedString)
        sign.end()
        const signatureSig = sign.sign(opts.claims.activitypub.privateKey, 'base64')
        headers.signature = `keyId="https://${matchAcct[2]}/${matchAcct[1]}#main-key",headers="(request-target) host date",signature="${signatureSig}",algorithm="rsa-sha256"`
      }

      axios.get(urlActivitypub,
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
