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
const bentReq = bent('GET')
const validator = require('validator')

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
    try {
      validator.isFQDN(opts.claims.matrix.instance)
      validator.isAscii(opts.claims.matrix.accessToken)
    } catch (err) {
      throw new Error(`Matrix fetcher was not set up properly (${err.message})`)
    }

    const url = `https://${opts.claims.matrix.instance}/_matrix/client/r0/rooms/${data.roomId}/event/${data.eventId}?access_token=${opts.claims.matrix.accessToken}`
    bentReq(url, null, {
      Accept: 'application/json',
    })
      .then(async (res) => {
        return await res.json()
      })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
