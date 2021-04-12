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

module.exports = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      5000
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    bentReq(
      `https://api.twitter.com/1.1/statuses/show.json?id=${data.tweetId}&tweet_mode=extended`,
      null,
      {
        Accept: 'application/json',
        Authorization: `Bearer ${opts.bearerToken}`,
      }
    )
      .then(async (data) => {
        return await data.json()
      })
      .then((data) => {
        resolve(data.full_text)
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
