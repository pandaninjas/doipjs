/*
Copyright 2023 Tim Haase

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

export const reURI = /^https:\/\/orcid\.org\/(.*)\/?/

/**
 * @function
 * @param {string} uri
 */
export function processURI (uri) {
  const match = uri.match(reURI)

  return new ServiceProvider({
    about: {
      id: 'orcid',
      name: 'ORCiD',
      homepage: 'https://orcid.org/'
    },
    profile: {
      display: match[1],
      uri,
      qr: null
    },
    claim: {
      uriRegularExpression: reURI.toString(),
      uriIsAmbiguous: false
    },
    proof: {
      request: {
        uri,
        fetcher: E.Fetcher.HTTP,
        accessRestriction: E.ProofAccessRestriction.NONE,
        data: {
          url: uri,
          format: E.ProofFormat.JSON
        }
      },
      response: {
        format: E.ProofFormat.JSON
      },
      target: [{
        format: E.ClaimFormat.URI,
        encoding: E.EntityEncodingFormat.PLAIN,
        relation: E.ClaimRelation.EQUALS,
        path: ['person', 'researcher-urls', 'researcher-url', 'url', 'value']
      }, {
        format: E.ClaimFormat.URI,
        encoding: E.EntityEncodingFormat.PLAIN,
        relation: E.ClaimRelation.EQUALS,
        path: ['person', 'keywords', 'keyword', 'content']
      }]
    }
  })
}

export const tests = [
  {
    uri: 'https://orcid.org/0000-0000-0000-0000',
    shouldMatch: true
  },
  {
    uri: 'https://orcid.org/0000-0000-0000-0000/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/0000-0000-0000-0000',
    shouldMatch: false
  }
]
