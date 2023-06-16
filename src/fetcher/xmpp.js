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
  const { client, xml } = require('@xmpp/client')
  const debug = require('@xmpp/debug')
  const validator = require('validator').default

  let xmpp = null
  let iqCaller = null

  const xmppStart = async (service, username, password) => {
    return new Promise((resolve, reject) => {
      const xmpp = client({
        service,
        username,
        password
      })
      if (process.env.NODE_ENV !== 'production') {
        debug(xmpp, true)
      }
      const { iqCaller } = xmpp
      xmpp.start()
      xmpp.on('online', _ => {
        resolve({ xmpp, iqCaller })
      })
      xmpp.on('error', error => {
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
   * @param {number} [data.fetcherTimeout]      - Optional timeout for the fetcher
   * @param {object} opts                       - Options used to enable the request
   * @param {object} opts.claims
   * @param {object} opts.claims.xmpp
   * @param {string} opts.claims.xmpp.service   - The server hostname on which the library can log in
   * @param {string} opts.claims.xmpp.username  - The username used to log in
   * @param {string} opts.claims.xmpp.password  - The password used to log in
   * @returns {Promise<object>}
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

    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      (async () => {
        let completed = false
        const proofs = []

        // Try the ariadne-id pubsub request
        if (!completed) {
          try {
            const response = await iqCaller.request(
              xml('iq', { type: 'get', to: data.id }, xml('pubsub', 'http://jabber.org/protocol/pubsub', xml('items', { node: 'http://ariadne.id/protocol/proof' }))),
              30 * 1000
            )

            // Traverse the XML response
            response.getChild('pubsub').getChildren('items').forEach(items => {
              if (items.attrs.node === 'http://ariadne.id/protocol/proof') {
                items.getChildren('item').forEach(item => {
                  proofs.push(item.getChildText('value'))
                })
              }
            })

            resolve(proofs)
            completed = true
          } catch (_) {}
        }

        // Try the vcard4 pubsub request [backward compatibility]
        if (!completed) {
          try {
            const response = await iqCaller.request(
              xml('iq', { type: 'get', to: data.id }, xml('pubsub', 'http://jabber.org/protocol/pubsub', xml('items', { node: 'urn:xmpp:vcard4', max_items: '1' }))),
              30 * 1000
            )

            // Traverse the XML response
            response.getChild('pubsub').getChildren('items').forEach(items => {
              if (items.attrs.node === 'urn:xmpp:vcard4') {
                items.getChildren('item').forEach(item => {
                  if (item.attrs.id === 'current') {
                    const itemVcard = item.getChild('vcard', 'urn:ietf:params:xml:ns:vcard-4.0')
                    // Find the vCard URLs
                    itemVcard.getChildren('url').forEach(url => {
                      proofs.push(url.getChildText('uri'))
                    })
                    // Find the vCard notes
                    itemVcard.getChildren('note').forEach(note => {
                      proofs.push(note.getChildText('text'))
                    })
                  }
                })
              }
            })

            resolve(proofs)
            completed = true
          } catch (_) {}
        }

        // Try the vcard-temp IQ request [backward compatibility]
        if (!completed) {
          try {
            const response = await iqCaller.request(
              xml('iq', { type: 'get', to: data.id }, xml('vCard', 'vcard-temp')),
              30 * 1000
            )

            // Find the vCard URLs
            response.getChild('vCard', 'vcard-temp').getChildren('URL').forEach(url => {
              proofs.push(url.children[0])
            })
            // Find the vCard notes
            response.getChild('vCard', 'vcard-temp').getChildren('NOTE').forEach(note => {
              proofs.push(note.children[0])
            })
            response.getChild('vCard', 'vcard-temp').getChildren('DESC').forEach(note => {
              proofs.push(note.children[0])
            })

            resolve(proofs)
            completed = true
          } catch (error) {
            reject(error)
          }
        }

        xmpp.stop()
      })()
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}
