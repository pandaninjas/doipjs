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
const irc = require('irc-upd')
const validator = require('validator')

/**
 * @module fetcher/irc
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 20000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                 - Data used in the request
 * @param {string} data.nick            - The nick of the targeted account
 * @param {string} data.domain          - The domain on which the targeted account is registered
 * @param {object} opts                 - Options used to enable the request
 * @param {string} opts.claims.irc.nick - The nick to be used by the library to log in
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
      validator.isAscii(opts.claims.irc.nick)
    } catch (err) {
      throw new Error(`IRC fetcher was not set up properly (${err.message})`)
    }

    try {
      const client = new irc.Client(data.domain, opts.claims.irc.nick, {
        port: 6697,
        secure: true,
        channels: [],
      })
      const reKey = /[a-zA-Z0-9\-\_]+\s+:\s(openpgp4fpr\:.*)/
      const reEnd = /End\sof\s.*\staxonomy./
      let keys = []

      client.addListener('registered', (message) => {
        client.send(`PRIVMSG NickServ :TAXONOMY ${data.nick}`)
      })
      client.addListener('notice', (nick, to, text, message) => {
        if (reKey.test(text)) {
          const match = text.match(reKey)
          keys.push(match[1])
        }
        if (reEnd.test(text)) {
          client.disconnect()
          resolve(keys)
        }
      })
    } catch (error) {
      reject(error)
    }
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
