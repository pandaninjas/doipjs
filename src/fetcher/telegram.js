/*
Copyright 2022 Maximilian Siling

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
 * @module fetcher/telegram
 */

/**
 * The single request's timeout value in milliseconds
 * This fetcher makes two requests in total
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                          - Data used in the request
 * @param {string} data.chat                     - Telegram public chat username
 * @param {string} data.user                     - Telegram user username
 * @param {number} [data.fetcherTimeout]         - Optional timeout for the fetcher
 * @param {object} opts                          - Options used to enable the request
 * @param {object} opts.claims
 * @param {object} opts.claims.telegram
 * @param {string} opts.claims.telegram.token    - The Telegram Bot API token
 * @returns {Promise<object|string>}
 */
module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const apiPromise = (/** @type {string} */ method) => new Promise((resolve, reject) => {
    try {
      validator.isAscii(opts.claims.telegram.token)
    } catch (err) {
      throw new Error(`Telegram fetcher was not set up properly (${err.message})`)
    }

    if (!(data.chat && data.user)) {
      reject(new Error('Both chat name and user name must be provided'))
      return
    }

    const url = `https://api.telegram.org/bot${opts.claims.telegram.token}/${method}?chat_id=@${data.chat}`
    axios.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': `doipjs/${require('../../package.json').version}`
      },
      validateStatus: (status) => status === 200
    })
      .then(res => resolve(res.data))
      .catch(e => reject(e))
  })

  const fetchPromise = apiPromise('getChatAdministrators').then(admins => {
    if (!admins.ok) {
      throw new Error('Request to get chat administrators failed')
    }

    return apiPromise('getChat').then(chat => {
      if (!chat.ok) {
        throw new Error('Request to get chat info failed')
      }

      let creator
      for (const admin of admins.result) {
        if (admin.status === 'creator') {
          creator = admin.user.username
        }
      }

      if (!chat.result.description) {
        throw new Error('There is no chat description')
      }

      if (creator !== data.user) {
        throw new Error('User doesn\'t match')
      }

      return {
        user: creator,
        text: chat.result.description
      }
    })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
