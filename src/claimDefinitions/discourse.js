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
import * as E from '../enums.js'

export const reURI = /^https:\/\/(.*)\/u\/(.*)\/?/

/**
 * @function
 * @param {string} uri
 */
export function processURI (uri) {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'discourse'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri,
      qr: null
    },
    proof: {
      uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://${match[1]}/u/${match[2]}.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: ['user', 'bio_raw']
    }]
  }
}

export const tests = [
  {
    uri: 'https://domain.org/u/alice',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/u/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false
  }
]
