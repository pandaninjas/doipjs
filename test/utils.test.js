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
const chai = require('chai')
const expect = chai.expect

const doipjs = require('../src')

describe('utils.generateClaim', () => {
  it('should be a function (2 arguments)', () => {
    expect(doipjs.utils.generateClaim).to.be.a('function')
    expect(doipjs.utils.generateClaim).to.have.length(2)
  })
  it('should generate a correct "uri" claim', () => {
    expect(doipjs.utils.generateClaim('123456789', 'uri')).to.equal(
      'openpgp4fpr:123456789'
    )
  })
  it('should generate a correct "message" claim', () => {
    expect(doipjs.utils.generateClaim('123456789', 'message')).to.equal(
      '[Verifying my OpenPGP key: openpgp4fpr:123456789]'
    )
  })
  it('should generate a correct "fingerprint" claim', () => {
    expect(doipjs.utils.generateClaim('123456789', 'fingerprint')).to.equal(
      '123456789'
    )
  })
})
