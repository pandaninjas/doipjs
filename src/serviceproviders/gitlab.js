/*
Copyright 2020 Yarmo Mackenbach

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

const reURI = /^https:\/\/(.*)\/(.*)\/gitlab_proof\/?/

const customRequestHandler = async (spData, opts) => {
  const match = spData.proof.uri.match(reURI)

  const urlUser = `https://${match[1]}/api/v4/users?username=${match[2]}`
  const resUser = await req(urlUser, 'json', { Accept: 'application/json' })
  const jsonUser = await resUser.json()

  const user = jsonUser.find(user => user.username === match[2])
  if (!user) {
    throw new Error(`No user with username ${match[2]}`);
  }

  const urlProject = `https://${match[1]}/api/v4/users/${user.id}/projects`
  const resProject = await req(urlProject, {}, { Accept: 'application/json' })
  const jsonProject = await resProject.json()

  const project = jsonProject.find(proj => proj.path === 'gitlab_proof')
  if (!project) {
    throw new Error(`No project at ${spData.proof.uri}`);
  }

  return project
}

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitlab'
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null
    },
    proof: {
      uri: uri,
      fetch: null,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['description'],
      relation: 'equals'
    },
    customRequestHandler: customRequestHandler
  }
}

const tests = [
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof',
    shouldMatch: true
  },
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/other_proof',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests
