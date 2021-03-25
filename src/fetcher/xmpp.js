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
const jsdom = require('jsdom')
const { client, xml } = require('@xmpp/client')
const debug = require('@xmpp/debug')

let xmpp = null,
  iqCaller = null

const xmppStart = async (service, username, password) => {
  return new Promise((resolve, reject) => {
    const xmpp = client({
      service: service,
      username: username,
      password: password,
    })
    if (process.env.NODE_ENV !== 'production') {
      debug(xmpp, true)
    }
    const { iqCaller } = xmpp
    xmpp.start()
    xmpp.on('online', (address) => {
      console.log('online', address.toString())
      resolve({ xmpp: xmpp, iqCaller: iqCaller })
    })
    xmpp.on('error', (error) => {
      reject(error)
    })
  })
}

module.exports = async (id, data, opts) => {
  return new Promise(async (resolve, reject) => {
    if (!xmpp) {
      const xmppStartRes = await xmppStart(
        opts.service,
        opts.username,
        opts.password
      )
      xmpp = xmppStartRes.xmpp
      iqCaller = xmppStartRes.iqCaller
    }

    const response = await iqCaller.request(
      xml(
        'iq',
        { type: 'get', to: id },
        xml('vCard', 'vcard-temp')
      ),
      30 * 1000
    )
    
    const vcardRow = response.getChild('vCard', 'vcard-temp').toString()
    const dom = new jsdom.JSDOM(vcardRow)
  
    try {
      let vcard
  
      switch (data.toLowerCase()) {
        case 'desc':
        case 'note':
          vcard = dom.window.document.querySelector('note text')
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
          vcard = dom.window.document.querySelector(data)
            .textContent
          break
      }
      xmpp.stop()
      resolve(vcard)
    } catch (error) {
      reject(error)
    }
  })
}