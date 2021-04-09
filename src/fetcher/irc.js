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

module.exports = async (hostname, nickQuery, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      20000
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    try {
      const client = new irc.Client(hostname, opts.nick, {
        port: 6697,
        secure: true,
        channels: [],
      })
      const reKey = /[a-zA-Z0-9\-\_]+\s+:\s(openpgp4fpr\:.*)/
      const reEnd = /End\sof\s.*\staxonomy./
      let keys = []

      client.addListener('registered', (message) => {
        client.send(`PRIVMSG NickServ :TAXONOMY ${nickQuery}`)
      })
      client.addListener('notice', (nick, to, text, message) => {
        console.log(text);
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
