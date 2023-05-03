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
const validator = require('validator').default
const E = require('./enums')

/**
 * @module utils
 */

/**
 * Generate an URL to request data from a proxy server
 * @param {string} type                 - The name of the fetcher the proxy must use
 * @param {object} data                 - The data the proxy must provide to the fetcher
 * @param {object} opts                 - Options to enable the request
 * @param {object} opts.proxy.hostname  - The hostname of the proxy server
 * @returns {string}
 */
const generateProxyURL = (type, data, opts) => {
  try {
    validator.isFQDN(opts.proxy.hostname)
  } catch (err) {
    throw new Error('Invalid proxy hostname')
  }

  const queryStrings = []

  Object.keys(data).forEach((key) => {
    queryStrings.push(`${key}=${encodeURIComponent(data[key])}`)
  })

  return `https://${opts.proxy.hostname}/api/2/get/${type}?${queryStrings.join(
    '&'
  )}`
}

/**
 * Generate the string that must be found in the proof to verify a claim
 * @param {string} fingerprint  - The fingerprint of the claim
 * @param {number} format       - The claim's format (see {@link module:enums~ClaimFormat|enums.ClaimFormat})
 * @returns {string}
 */
const generateClaim = (fingerprint, format) => {
  switch (format) {
    case E.ClaimFormat.URI:
      return `openpgp4fpr:${fingerprint}`
    case E.ClaimFormat.FINGERPRINT:
      return fingerprint
    default:
      throw new Error('No valid claim format')
  }
}

/**
 * Get the URIs from a string and return them as an array
 * @param {string} text         - The text that may contain URIs
 * @returns {Array.string}
 */
const getUriFromString = (text) => {
  const re = /((([A-Za-z0-9]+:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/gi
  const res = text.match(re)

  const urls = []

  if (!res) {
    return []
  }

  res.forEach(url => {
    // Remove bad trailing characters
    let hasBadTrailingChars = true

    while (hasBadTrailingChars) {
      const lastChar = url.charAt(url.length - 1)
      if ('?!.'.indexOf(lastChar) === -1) {
        hasBadTrailingChars = false
        continue
      }
      url = url.substring(0, url.length - 1)
    }

    urls.push(url)
  })

  return urls
}

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim
exports.getUriFromString = getUriFromString
