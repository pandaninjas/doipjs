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
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

const doipjs = require('../src')

const fingerprint = '3637202523e7c1309ab79e99ef2dc5827b445f4b'
const plaintextCorrectProofData = [
  'openpgp4fpr:3637202523e7c1309ab79e99ef2dc5827b445f4b'
]
const plaintextIncorrectProofData = [
  'openpgp4pr:b4f544b7285cd2fe99e97ba9031c7e3252027363'
]
const argon2CorrectProofData = [
  '$argon2id$v=19$m=16,t=2,p=1$UElOT0ZIU09mSHlReE1lcg$2nJmgFL0s3DHPksuSE2enw'
]
const argon2IncorrectProofData = [
  '$argon2id$v=19$m=16,t=2,p=1$UElOT0ZIU09mSHlReE1lcg$QH+tj5w78d2MZ8PrmOjXqQ'
]
const bcryptCorrectProofData = [
  '$2a$10$zNJGxR.xyKZ7djXpwWshpuhULOhRxerqRVZ.14fJAnkSPVxKSqGBC'
]
const bcryptIncorrectProofData = [
  '$2y$10$iHUhy320iUqJRVh7a/WlneAuJA/xRI/YEv7qxW8jfCDVmC7bmezX2'
]
const bcryptCostlyProofData = [
  '$2y$16$4Knuu11ZyPXa1qxEbEsKQemKY6ZHM8Bk7WElYfL8q5kmzNjY1Ty8W'
]
const claimData = doipjs.claimDefinitions.data.irc.processURI('irc://domain.tld/test')

describe('verifications.run', () => {
  it('should verify a plaintext proof', async () => {
    const result = await doipjs.verifications.run(plaintextCorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.true
  })
  it('should reject a wrong plaintext proof', async () => {
    const result = await doipjs.verifications.run(plaintextIncorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.false
  })
  it('should verify a argon2-hashed proof', async () => {
    const result = await doipjs.verifications.run(argon2CorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.true
  })
  it('should reject a wrong argon2-hashed proof', async () => {
    const result = await doipjs.verifications.run(argon2IncorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.false
  })
  it('should verify a bcrypt-hashed proof', async () => {
    const result = await doipjs.verifications.run(bcryptCorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.true
  })
  it('should reject a wrong bcrypt-hashed proof', async () => {
    const result = await doipjs.verifications.run(bcryptIncorrectProofData, claimData, fingerprint)
    expect(result.result).to.be.false
  })
  it('should reject a too costly hashed proof', async () => {
    const result = await doipjs.verifications.run(bcryptCostlyProofData, claimData, fingerprint)
    expect(result.result).to.be.false
  })
})
