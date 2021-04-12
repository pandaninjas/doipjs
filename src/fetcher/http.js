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

module.exports = async (url, format) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      5000
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    if (!url) {
      reject('No valid URI provided')
      return
    }

    switch (format) {
      case 'json':
        req(url, null, {
          Accept: 'application/json',
          'User-Agent': `doipjs/${require('../package.json').version}`,
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
      case 'text':
        req(url)
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
