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
const proofAccess =  {
  GENERIC: 0,
  NOCORS: 1,
  GRANTED: 2,
  SERVER: 3
}
Object.freeze(proofAccess)

const proofFormat =  {
  JSON: 0,
  TEXT: 1,
}
Object.freeze(proofFormat)

const claimFormat =  {
  URI: 0,
  FINGERPRINT: 1,
  MESSAGE: 2,
}
Object.freeze(claimFormat)

const claimRelation =  {
  CONTAINS: 0,
  EQUALS: 1,
  ONEOF: 2,
}
Object.freeze(claimRelation)

exports.proofAccess = proofAccess
exports.proofFormat = proofFormat
exports.claimFormat = claimFormat
exports.claimRelation = claimRelation