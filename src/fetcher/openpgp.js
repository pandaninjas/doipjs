/*
Copyright 2024 Yarmo Mackenbach

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
import axios from 'axios'
import { readKey } from 'openpgp'
import { OpenPgpQueryProtocol } from '../enums.js'
import { version } from '../constants.js'
import { parsePublicKey } from '../openpgp.js'
import * as Types from '../types.js'

/**
 * Timeout after which the fetch is aborted
 * @constant
 * @type {number}
 */
export const timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data - Data used in the request
 * @param {string} data.url - The URL pointing at targeted content
 * @param {OpenPgpQueryProtocol} data.protocol - The protocol used to access the targeted content
 * @param {number} [data.fetcherTimeout] - Optional timeout for the fetcher
 * @param {Types.VerificationConfig} [opts] - Options used to enable the request
 * @returns {Promise<object>} The fetched notations from an OpenPGP key
 */
export async function fn (data, opts) {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    if (!data.url) {
      reject(new Error('No valid URI provided'))
      return
    }

    switch (data.protocol) {
      case OpenPgpQueryProtocol.HKP:
        axios.get(data.url, {
          headers: {
            Accept: 'application/pgp-keys',
            'User-Agent': `doipjs/${version}`
          },
          validateStatus: (status) => status >= 200 && status < 400
        })
          .then(res => res.data)
          .then(async data => await readKey({ armoredKey: data }))
          .then(async publicKey => await parsePublicKey(publicKey))
          .then(profile =>
            profile.personas.flatMap(p => { return p.claims.map(c => c._uri) })
          )
          .then(res => {
            resolve({
              notations: {
                'proof@ariadne.id': res
              }
            })
          })
          .catch(e => {
            reject(e)
          })
        break
      case OpenPgpQueryProtocol.WKD:
        axios.get(data.url, {
          headers: {
            Accept: 'application/octet-stream',
            'User-Agent': `doipjs/${version}`
          },
          responseType: 'arraybuffer',
          validateStatus: (status) => status >= 200 && status < 400
        })
          .then(res => res.data)
          .then(async data => await readKey({ binaryKey: data }))
          .then(async publicKey => await parsePublicKey(publicKey))
          .then(profile =>
            profile.personas.flatMap(p => { return p.claims.map(c => c._uri) })
          )
          .then(res => {
            resolve({
              notations: {
                'proof@ariadne.id': res
              }
            })
          })
          .catch(e => {
            reject(e)
          })
        break
      default:
        reject(new Error('Unsupported OpenPGP query protocol'))
        break
    }
  })

  return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutHandle)
  })
}
