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

module.exports = async (roomId, eventId, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      5000
    )
  })

  const url = `https://${opts.instance}/_matrix/client/r0/rooms/${roomId}/event/${eventId}?access_token=${opts.accessToken}`

  const fetchPromise = bentReq(url, null, {
    Accept: 'application/json',
  })
    .then(async (data) => {
      return await data.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
