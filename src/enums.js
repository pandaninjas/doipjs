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
const ProxyPolicy = {
  ADAPTIVE: 'adaptive',
  ALWAYS: 'always',
  NEVER: 'never',
}
Object.freeze(ProxyPolicy)

const Fetcher = {
  HTTP: 'http',
  DNS: 'dns',
  IRC: 'irc',
  XMPP: 'xmpp',
  MATRIX: 'matrix',
  GITLAB: 'gitlab',
  TWITTER: 'twitter',
}
Object.freeze(Fetcher)

const ProofAccess = {
  GENERIC: 0,
  NOCORS: 1,
  GRANTED: 2,
  SERVER: 3,
}
Object.freeze(ProofAccess)

const ProofFormat = {
  JSON: 'json',
  TEXT: 'text',
}
Object.freeze(ProofFormat)

const ClaimFormat = {
  URI: 0,
  FINGERPRINT: 1,
  MESSAGE: 2,
}
Object.freeze(ClaimFormat)

const ClaimRelation = {
  CONTAINS: 0,
  EQUALS: 1,
  ONEOF: 2,
}
Object.freeze(ClaimRelation)

const VerificationStatus = {
  INIT: 0,
  INPROGRESS: 1,
  FAILED: 2,
  COMPLETED: 3,
}
Object.freeze(VerificationStatus)

exports.ProxyPolicy = ProxyPolicy
exports.Fetcher = Fetcher
exports.ProofAccess = ProofAccess
exports.ProofFormat = ProofFormat
exports.ClaimFormat = ClaimFormat
exports.ClaimRelation = ClaimRelation
exports.VerificationStatus = ClaimRelation
