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
    expect(
      doipjs.utils.generateClaim('123456789', doipjs.enums.ClaimFormat.URI)
    ).to.equal('openpgp4fpr:123456789')
  })
  it('should generate a correct "fingerprint" claim', () => {
    expect(
      doipjs.utils.generateClaim(
        '123456789',
        doipjs.enums.ClaimFormat.FINGERPRINT
      )
    ).to.equal('123456789')
  })
})

describe('utils.generateProxyURL', () => {
  it('should be a function (3 arguments)', () => {
    expect(doipjs.utils.generateProxyURL).to.be.a('function')
    expect(doipjs.utils.generateProxyURL).to.have.length(3)
  })
  it('should generate correct proxy URLs', () => {
    const opts = {
      proxy: {
        hostname: 'localhost',
      },
    }
    expect(
      doipjs.utils.generateProxyURL('http', { domain: 'domain.org' }, opts)
    ).to.equal('https://localhost/api/2/get/http?domain=domain.org')
    expect(
      doipjs.utils.generateProxyURL('dns', { domain: 'domain.org' }, opts)
    ).to.equal('https://localhost/api/2/get/dns?domain=domain.org')
  })
})
