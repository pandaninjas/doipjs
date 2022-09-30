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
/**
 * Contains enums
 * @module enums
 */

/**
 * The proxy policy that decides how to fetch a proof
 * @readonly
 * @enum {string}
 */
const ProxyPolicy = {
  /** Proxy usage decision depends on environment and service provider */
  ADAPTIVE: 'adaptive',
  /** Always use a proxy */
  ALWAYS: 'always',
  /** Never use a proxy, skip a verification if a proxy is inevitable */
  NEVER: 'never'
}
Object.freeze(ProxyPolicy)

/**
 * Methods for fetching proofs
 * @readonly
 * @enum {string}
 */
const Fetcher = {
  /** HTTP requests to ActivityPub */
  ACTIVITYPUB: 'activitypub',
  /** DNS module from Node.js */
  DNS: 'dns',
  /** Basic HTTP requests */
  HTTP: 'http',
  /** IRC module from Node.js */
  IRC: 'irc',
  /** HTTP request to Matrix API */
  MATRIX: 'matrix',
  /** HTTP request to Telegram API */
  TELEGRAM: 'telegram',
  /** HTTP request to Twitter API */
  TWITTER: 'twitter',
  /** XMPP module from Node.js */
  XMPP: 'xmpp'
}
Object.freeze(Fetcher)

/**
 * Levels of access restriction for proof fetching
 * @readonly
 * @enum {number}
 */
const ProofAccess = {
  /** Any HTTP request will work */
  GENERIC: 0,
  /** CORS requests are denied */
  NOCORS: 1,
  /** HTTP requests must contain API or access tokens */
  GRANTED: 2,
  /** Not accessible by HTTP request, needs server software */
  SERVER: 3
}
Object.freeze(ProofAccess)

/**
 * Format of proof
 * @readonly
 * @enum {string}
 */
const ProofFormat = {
  /** JSON format */
  JSON: 'json',
  /** Plaintext format */
  TEXT: 'text'
}
Object.freeze(ProofFormat)

/**
 * Format of claim
 * @readonly
 * @enum {number}
 */
const ClaimFormat = {
  /** `openpgp4fpr:123123123` */
  URI: 0,
  /** `123123123` */
  FINGERPRINT: 1
}
Object.freeze(ClaimFormat)

/**
 * How to find the claim inside the proof's JSON data
 * @readonly
 * @enum {number}
 */
const ClaimRelation = {
  /** Claim is somewhere in the JSON field's textual content */
  CONTAINS: 0,
  /** Claim is equal to the JSON field's textual content */
  EQUALS: 1,
  /** Claim is equal to an element of the JSON field's array of strings */
  ONEOF: 2
}
Object.freeze(ClaimRelation)

/**
 * Status of the Claim instance
 * @readonly
 * @enum {string}
 */
const ClaimStatus = {
  /** Claim has been initialized */
  INIT: 'init',
  /** Claim has matched its URI to candidate claim definitions */
  MATCHED: 'matched',
  /** Claim has verified one or multiple candidate claim definitions */
  VERIFIED: 'verified'
}
Object.freeze(ClaimStatus)

exports.ProxyPolicy = ProxyPolicy
exports.Fetcher = Fetcher
exports.ProofAccess = ProofAccess
exports.ProofFormat = ProofFormat
exports.ClaimFormat = ClaimFormat
exports.ClaimRelation = ClaimRelation
exports.ClaimStatus = ClaimStatus
