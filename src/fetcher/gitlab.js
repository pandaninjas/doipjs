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
const axios = require('axios')

/**
 * @module fetcher/gitlab
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data           - Data used in the request
 * @param {string} data.username  - The username of the targeted account
 * @param {string} data.domain    - The domain on which the targeted account is registered
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
    const urlUser = `https://${data.domain}/api/v4/users?username=${data.username}`
    // const resUser = await req(urlUser, null, { Accept: 'application/json' })
    const res = axios.get(urlUser,
      {
        headers: { Accept: 'application/json' }
      })
      .then(resUser => {
        return resUser.data
      })
      .then(jsonUser => {
        return jsonUser.find((user) => user.username === data.username)
      })
      .then(user => {
        if (!user) {
          throw new Error(`No user with username ${data.username}`)
        }
        return user
      })
      .then(user => {
        const urlProject = `https://${data.domain}/api/v4/users/${user.id}/projects`
        return axios.get(urlProject,
          {
            headers: { Accept: 'application/json' }
          })
      })
      .then(resProject => {
        return resProject.data
      })
      .then(jsonProject => {
        return jsonProject.find((proj) => proj.path === 'gitlab_proof')
      })
      .then(project => {
        if (!project) {
          throw new Error('No project found')
        }
        return project
      })
      .catch(error => {
        reject(error)
      })

    resolve(res)
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
