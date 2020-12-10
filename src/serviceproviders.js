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
const utils = require('./utils')

const list = [
  'dns',
  'xmpp',
  'twitter',
  'reddit',
  'liberapay',
  'hackernews',
  'lobsters',
  'devto',
  'gitea',
  'gitlab',
  'github',
  'mastodon',
  'fediverse',
  'discourse',
]

const data = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp'),
  twitter: require('./serviceproviders/twitter'),
  reddit: require('./serviceproviders/reddit'),
  liberapay: require('./serviceproviders/liberapay'),
  hackernews: require('./serviceproviders/hackernews'),
  lobsters: require('./serviceproviders/lobsters'),
  devto: require('./serviceproviders/devto'),
  gitea: require('./serviceproviders/gitea'),
  gitlab: require('./serviceproviders/gitlab'),
  github: require('./serviceproviders/github'),
  mastodon: require('./serviceproviders/mastodon'),
  fediverse: require('./serviceproviders/fediverse'),
  discourse: require('./serviceproviders/discourse'),
}

const match = (uri, opts) => {
  let matches = [],
    sp

  list.forEach((spName, i) => {
    sp = data[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri, opts))
    }
  })

  return matches
}

const directRequestHandler = (spData, opts) => {
  return new Promise(async (resolve, reject) => {
    const url = spData.proof.fetch ? spData.proof.fetch : spData.proof.uri
    let res

    switch (spData.proof.format) {
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
        reject('No specified proof data format')
        break
    }
  })
}

const proxyRequestHandler = (spData, opts) => {
  return new Promise(async (resolve, reject) => {
    const url = spData.proof.fetch ? spData.proof.fetch : spData.proof.uri
    req(
      utils.generateProxyURL(spData.proof.format, url, opts),
      null,
      { Accept: 'application/json' }
    )
    .then(async (res) => {
      return await res.json()
    })
    .then((res) => {
      resolve(res.content)
    })
    .catch((e) => {
      reject(e)
    })
  })
}

exports.list = list
exports.data = data
exports.match = match
exports.directRequestHandler = directRequestHandler
exports.proxyRequestHandler = proxyRequestHandler
