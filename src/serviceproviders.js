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
const list = [
  'dns',
  'xmpp',
  'twitter',
  'hackernews',
]

const data = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp'),
  twitter: require('./serviceproviders/twitter'),
  hackernews: require('./serviceproviders/hackernews'),
}

const match = (uri) => {
  let matches = [], sp

  list.forEach((spName, i) => {
    sp = data[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri))
    }
  })

  return matches
}

exports.list = list
exports.data = data
exports.match = match
