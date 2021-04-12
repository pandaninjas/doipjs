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
const list = [
  'dns',
  'irc',
  'xmpp',
  'matrix',
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
  'owncast',
]

const data = {
  dns: require('./serviceproviders/dns'),
  irc: require('./serviceproviders/irc'),
  xmpp: require('./serviceproviders/xmpp'),
  matrix: require('./serviceproviders/matrix'),
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
  owncast: require('./serviceproviders/owncast'),
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

exports.list = list
exports.data = data
exports.match = match