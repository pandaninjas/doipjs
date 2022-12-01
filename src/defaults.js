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
const E = require('./enums')

/**
 * Contains default values
 * @module defaults
 */

/**
 * The default options used throughout the library
 * @constant {object}
 * @property {object} proxy                           - Options related to the proxy
 * @property {string|null} proxy.hostname             - The hostname of the proxy
 * @property {string} proxy.policy                    - The policy that defines when to use a proxy ({@link module:enums~ProxyPolicy|here})
 * @property {object} claims                          - Options related to claim verification
 * @property {object} claims.activitypub              - Options related to the verification of activitypub claims
 * @property {string|null} claims.activitypub.url     - The URL of the verifier account
 * @property {string|null} claims.activitypub.privateKey - The private key to sign the request
 * @property {object} claims.irc                      - Options related to the verification of IRC claims
 * @property {string|null} claims.irc.nick            - The nick that the library uses to connect to the IRC server
 * @property {object} claims.matrix                   - Options related to the verification of Matrix claims
 * @property {string|null} claims.matrix.instance     - The server hostname on which the library can log in
 * @property {string|null} claims.matrix.accessToken  - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
 * @property {object} claims.telegram                 - Options related to the verification of Telegram claims
 * @property {string|null} claims.telegram.token      - The Telegram API's token ({@link https://core.telegram.org/bots/api#authorizing-your-bot|Telegram docs})
 * @property {object} claims.twitter                  - Options related to the verification of Twitter claims
 * @property {string|null} claims.twitter.bearerToken - The Twitter API's bearer token ({@link https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens|Twitter docs})
 * @property {object} claims.xmpp                     - Options related to the verification of XMPP claims
 * @property {string|null} claims.xmpp.service        - The server hostname on which the library can log in
 * @property {string|null} claims.xmpp.username       - The username used to log in
 * @property {string|null} claims.xmpp.password       - The password used to log in
 */
const opts = {
  proxy: {
    hostname: null,
    policy: E.ProxyPolicy.NEVER
  },
  flaresolverr: {
    url: '',
    maxTimeout: 60000
  },
  claims: {
    activitypub: {
      url: null,
      privateKey: null
    },
    irc: {
      nick: null
    },
    matrix: {
      instance: null,
      accessToken: null
    },
    telegram: {
      token: null
    },
    twitter: {
      bearerToken: null
    },
    xmpp: {
      service: null,
      username: null,
      password: null
    }
  }
}

exports.opts = opts
