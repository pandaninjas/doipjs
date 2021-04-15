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

module.exports.timeout = 5000

module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise(async (resolve, reject) => {
    const urlUser = `https://${data.domain}/api/v4/users?username=${data.username}`
    const resUser = await req(urlUser, null, { Accept: 'application/json' })
    const jsonUser = await resUser.json()

    const user = jsonUser.find((user) => user.username === data.username)
    if (!user) {
      reject(`No user with username ${data.username}`)
    }

    const urlProject = `https://${data.domain}/api/v4/users/${user.id}/projects`
    const resProject = await req(urlProject, null, { Accept: 'application/json' })
    const jsonProject = await resProject.json()

    const project = jsonProject.find((proj) => proj.path === 'gitlab_proof')
    if (!project) {
      reject(`No project at ${spData.proof.uri}`)
    }

    resolve(project)
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}
