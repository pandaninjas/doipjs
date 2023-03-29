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

const data = {
  dns: require('./dns'),
  irc: require('./irc'),
  xmpp: require('./xmpp'),
  matrix: require('./matrix'),
  telegram: require('./telegram'),
  twitter: require('./twitter'),
  reddit: require('./reddit'),
  liberapay: require('./liberapay'),
  lichess: require('./lichess'),
  hackernews: require('./hackernews'),
  lobsters: require('./lobsters'),
  forem: require('./forem'),
  forgejo: require('./forgejo'),
  gitea: require('./gitea'),
  gitlab: require('./gitlab'),
  github: require('./github'),
  activitypub: require('./activitypub'),
  discourse: require('./discourse'),
  owncast: require('./owncast'),
  stackexchange: require('./stackexchange'),
  keybase: require('./keybase'),
  opencollective: require('./opencollective')
}

exports.list = Object.keys(data)
exports.data = data
