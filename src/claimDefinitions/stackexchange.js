/*
Copyright 2022 Yarmo Mackenbach

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

export const reURI = /^https:\/\/(.*(?:askubuntu|mathoverflow|serverfault|stackapps|stackoverflow|superuser)|.+\.stackexchange)\.com\/users\/(\d+)/
const reStackExchange = /\.stackexchange$/

/**
 * @function
 * @param {string} uri
 */
export function processURI (uri) {
  const [, domain, id] = uri.match(reURI)
  const site = domain.replace(reStackExchange, '')

  return {
    serviceprovider: {
      type: 'web',
      name: 'stackexchange'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `${id}@${site}`,
      uri,
      qr: null
    },
    proof: {
      uri: `https://${domain}.com/users/${id}?tab=profile`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://api.stackexchange.com/2.3/users/${id}?site=${site}&filter=!AH)b5JqVyImf`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: [{
      format: E.ClaimFormat.URI,
      encoding: E.EntityEncodingFormat.PLAIN,
      relation: E.ClaimRelation.CONTAINS,
      path: ['items', 'about_me']
    }]
  }
}

export const tests = [
  {
    uri: 'https://stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234/alice',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234?tab=topactivity',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234/alice?tab=profile',
    shouldMatch: true
  },
  {
    uri: 'https://meta.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://pt.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://pt.meta.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://serverfault.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://meta.stackexchange.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://gaming.meta.stackexchange.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://stackexchange.com/users/1234',
    shouldMatch: false
  },
  {
    uri: 'https://domain.com/users/1234',
    shouldMatch: false
  },
  {
    uri: 'https://meta.domain.com/users/1234',
    shouldMatch: false
  }

]
