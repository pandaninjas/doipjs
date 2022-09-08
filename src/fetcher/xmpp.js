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
const jsEnv = require('browser-or-node')

/**
 * @module fetcher/xmpp
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

if (jsEnv.isNode) {
  const jsdom = require('jsdom')
  const { client, xml } = require('@xmpp/client')
  const debug = require('@xmpp/debug')
  const validator = require('validator')

  let xmpp = null
  let iqCaller = null

  const xmppStart = async (service, username, password) => {
    return new Promise((resolve, reject) => {
      const xmpp = client({
        service: service,
        username: username,
        password: password
      })
      if (process.env.NODE_ENV !== 'production') {
        debug(xmpp, true)
      }
      const { iqCaller } = xmpp
      xmpp.start()
      xmpp.on('online', (address) => {
        resolve({ xmpp: xmpp, iqCaller: iqCaller })
      })
      xmpp.on('error', (error) => {
        reject(error)
      })
    })
  }

  /**
   * Execute a fetch request
   * @function
   * @async
   * @param {object} data                       - Data used in the request
   * @param {string} data.id                    - The identifier of the targeted account
   * @param {string} data.field                 - The vCard field to return (should be "note")
   * @param {object} opts                       - Options used to enable the request
   * @param {string} opts.claims.xmpp.service   - The server hostname on which the library can log in
   * @param {string} opts.claims.xmpp.username  - The username used to log in
   * @param {string} opts.claims.xmpp.password  - The password used to log in
   * @returns {object}
   */
  module.exports.fn = async (data, opts) => {
    try {
      validator.isFQDN(opts.claims.xmpp.service)
      validator.isAscii(opts.claims.xmpp.username)
      validator.isAscii(opts.claims.xmpp.password)
    } catch (err) {
      throw new Error(`XMPP fetcher was not set up properly (${err.message})`)
    }

    if (!xmpp || xmpp.status !== 'online') {
      const xmppStartRes = await xmppStart(
        opts.claims.xmpp.service,
        opts.claims.xmpp.username,
        opts.claims.xmpp.password
      )
      xmpp = xmppStartRes.xmpp
      iqCaller = xmppStartRes.iqCaller
    }

    const response = await iqCaller.request(
      xml('iq', { type: 'get', to: data.id }, xml('vCard', 'vcard-temp')),
      30 * 1000
    )

    const vcardRow = response.getChild('vCard', 'vcard-temp').toString()
    const dom = new jsdom.JSDOM(vcardRow)

    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      try {
        let vcard

        switch (data.field.toLowerCase()) {
          case 'desc':
          case 'note':
            vcard = dom.window.document.querySelector('note text')
            if (!vcard) {
              vcard = dom.window.document.querySelector('note')
            }
            if (!vcard) {
              vcard = dom.window.document.querySelector('DESC')
            }
            if (vcard) {
              vcard = vcard.textContent
            } else {
              throw new Error('No DESC or NOTE field found in vCard')
            }
            break

          default:
            vcard = dom.window.document.querySelector(data).textContent
            break
        }
        xmpp.stop()
        resolve(vcard)
      } catch (error) {
        reject(error)
      }
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}
