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
import { ServiceProvider } from '../serviceProvider.js'

export const reURI = /^https:\/\/(.*)/

/**
 * @function
 * @param {string} uri
 */
export function processURI (uri) {
  const match = uri.match(reURI)

  return new ServiceProvider({
    about: {
      id: 'owncast',
      name: 'Owncast',
      homepage: 'https://owncast.online'
    },
    profile: {
      display: match[1],
      uri,
      qr: null
    },
    claim: {
      uriRegularExpression: reURI.toString(),
      uriIsAmbiguous: true
    },
    proof: {
      request: {
        uri: `${uri}/api/config`,
        fetcher: E.Fetcher.HTTP,
        accessRestriction: E.ProofAccessRestriction.NONE,
        data: {
          url: `${uri}/api/config`,
          format: E.ProofFormat.JSON
        }
      },
      response: {
        format: E.ProofFormat.JSON
      },
      target: [{
        format: E.ClaimFormat.FINGERPRINT,
        encoding: E.EntityEncodingFormat.PLAIN,
        relation: E.ClaimRelation.CONTAINS,
        path: ['socialHandles', 'url']
      }]
    }
  })
}

export const tests = [
  {
    uri: 'https://live.domain.org',
    shouldMatch: true
  },
  {
    uri: 'https://live.domain.org/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live/',
    shouldMatch: true
  }
]
