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
const generateProxyURL = (type, urlElements, opts) => {
  if (!opts || !opts.doipProxyHostname) {
    return null
  }
  let addParam = ''
  if (type == 'xmpp') {
    addParam += '/DESC'
  }

  if (!Array.isArray(urlElements)) {
    urlElements = [urlElements]
  }

  urlElements.map((x) => { encodeURIComponent(x) })

  return `https://${
    opts.doipProxyHostname
  }/api/1/get/${type}/${urlElements.join('/')}${addParam}`
}

const generateClaim = (fingerprint, format) => {
  switch (format) {
    case 'uri':
      return `openpgp4fpr:${fingerprint}`
      break
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${fingerprint}]`
      break
    case 'fingerprint':
      return fingerprint
      break
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim
