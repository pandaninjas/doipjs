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
const validUrl = require('valid-url')
const bent = require('bent')
const req = bent('GET')
const { serviceprovidersList, serviceproviders } = require('./serviceproviders')

const matchServiceproviders = (uri) => {
  let matches = [], sp

  serviceprovidersList.forEach((spName, i) => {
    sp = serviceproviders[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri))
    }
  })

  return matches
}

const verify = async (uri, fingerprint, opts) => {
  if (!opts) { opts = {} }

  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = matchServiceproviders(uri)

  if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
    return spMatches
  }

  let claimHasBeenVerified = false, sp, iSp = 0, res, proofData
  while (!claimHasBeenVerified && iSp < spMatches.length) {
    sp = spMatches[iSp]

    res = null

    if (!sp.proof.useProxy || 'forceDirectRequest' in opts && opts.forceDirectRequest) {
      res = await req(sp.proof.fetch ? sp.proof.fetch : sp.proof.uri)

      switch (sp.proof.format) {
        case 'json':
          proofData = await res.json()
          break
        case 'text':
          proofData = await res.text()
          break
        default:
          throw new Error('No specified proof data format')
          break
      }
    }

    iSp++
  }
}

exports.verify = verify
exports.serviceproviders = serviceproviders
exports.serviceprovidersList = serviceprovidersList
