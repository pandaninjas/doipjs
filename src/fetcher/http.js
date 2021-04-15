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
const bent = require('bent')
const req = bent('GET')
const E = require('../enums')

module.exports.timeout = 5000

module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    if (!data.url) {
      reject('No valid URI provided')
      return
    }

    switch (data.format) {
      case E.ProofFormat.JSON:
        req(data.url, null, {
          Accept: 'application/json',
          'User-Agent': `doipjs/${require('../../package.json').version}`,
        })
          .then(async (res) => {
            return await res.json()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
        break
      case E.ProofFormat.TEXT:
        req(data.url)
          .then(async (res) => {
            return await res.text()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
        break
      default:
        reject('No specified data format')
        break
    }
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
