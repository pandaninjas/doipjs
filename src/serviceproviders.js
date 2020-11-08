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

const directRequestHandler = async (spData, opts) => {
  const res = await req(
    spData.proof.fetch ? spData.proof.fetch : spData.proof.uri,
    null,
    { Accept: 'application/json' }
  )

  switch (spData.proof.format) {
    case 'json':
      return await res.json()
      break
    case 'text':
      return await res.text()
      break
    default:
      throw new Error('No specified proof data format')
      break
  }
}

const proxyRequestHandler = async (spData, opts) => {
  const url = spData.proof.fetch ? spData.proof.fetch : spData.proof.uri
  const res = await req(
    utils.generateProxyURL(spData.proof.format, url, opts),
    null,
    { Accept: 'application/json' }
  )
  const json = await res.json()
  return json.content
}

exports.list = list
exports.data = data
exports.match = match
exports.directRequestHandler = directRequestHandler
exports.proxyRequestHandler = proxyRequestHandler
