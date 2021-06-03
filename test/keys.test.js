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
chai.use(require('chai-as-promised'))

const path = require('path')
const openpgp = require('openpgp')
const doipjs = require('../src')

const pubKeyFingerprint = `3637202523e7c1309ab79e99ef2dc5827b445f4b`
const pubKeyEmail = `test@doip.rocks`

const pubKeyPlaintext = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQGNBF+036UBDACoxWRdp7rBAFB2l/+dxX0XA50NJC92EEacB5L0TnC0lP/MsNHv
fAv/A9vgTwrPudvcHdE/urAjQswfIU3LpFxbBOWNYWOv6ssrzBH4vVGMyxfu2GGu
b2mxjWj0eWXnWXnzkO5fscX2y0HqNjBZjDSkYohHZJTbz91NnxK3a8+Erpk+sgEH
hQH1h75SfaW6GZucuhenxgjwEiGz84UEVS0AEWD9yNgfWCsK/6HuIRnv5Jv5V9z9
bx9Ik7QNGBks3tpNmdbeaaadkHYZpF3Fm8mCoIt2+Xx9OvyuLssZnVkuQdj8C2/z
E45If4+pHRnRcCWXpDrHUWoJaeyGuTq5triePI6h/4lgr/m/du0O/lhOrr6MUhAe
7xc0B+X+bTF/balZmmlbk5bnDoZMzdH8caui5XrkuRif/I0nYPRnc9zrqWJDDO/p
nltpMPrUMTjoiXZ8DbJ4WMK7QPdsbG8Tz/Vl3wigEmwPLfEGifLpec5RXrti5Zd9
FiSOIOetP8p8MSMAEQEAAbRBWWFybW8gTWFja2VuYmFjaCAobWF0ZXJpYWwgZm9y
IHRlc3QgZnJhbWV3b3JrcykgPHRlc3RAZG9pcC5yb2Nrcz6JAfgEEwEKAGICGwMF
CwkIBwIGFQoJCAsCBBYCAwECHgECF4AWIQQ2NyAlI+fBMJq3npnvLcWCe0RfSwUC
X7TgDSkUgAAAAAASAA5wcm9vZkBtZXRhY29kZS5iaXpkbnM6ZG9pcC5yb2NrcwAK
CRDvLcWCe0RfS8XBC/9DtRvmNXI2fjXrhM3+d+bwmg9itY+p0gt+gG13s1aB/jTc
LlI9mGt/ZgzdgAxG9vtRqAPTSkTK4TaIsB+p02f3JntpaItTIXHPb8dRizpbkPCn
iZnVSHM4G4qtr4lQawR1xikSBx9SRyd3KUKfIgpCEonXPZ4Z1Rw558/fwcqNH4LW
Wa18MtVt5Yfc2D7JgBR8nK/YBgZkqdW3u0izn/dbUYtQm8aRIhcB0jbiYVaUFpKq
dgPFM7Gp8zjKYcEg/vlylny8lKCfQ5xMCIUSCxToHckBfo+9QqcWy0LHFaiq/7+N
Fsikjo87GjESOd+QTuKdtQBzegLotgeNtCOFBKOoY2g+24FsbSbIm5H27vw/odgV
cqvy+yineO/jWCWp6pHbALSg1INuVnluwyAqXoM4Gx7rUboISN2nIzYpdjXAUgnX
XxFjll8b3+FRQAH80qkvtuDDZ/z2CQQ/mdJgNJdMwqvwBQZnCMts0PyqTlzw1mcy
x77L7mBkREbuZpFoD/c=
=w7qB
-----END PGP PUBLIC KEY BLOCK-----`

const pubKeyWithOtherNotations = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEX9Mt6xYJKwYBBAHaRw8BAQdAch8jfp+8KHH5cy/t45GjPvl6dkEv2soIy9fo
Oe9DbP20EVlhcm1vJ3MgRXZpbCBUd2luiNsEExYIAIMCGwMFCwkIBwIGFQoJCAsC
BBYCAwECHgECF4AWIQTeePcduHH8EU2iM3aw5zJVrULhnwUCX9MuHBkUgAAAAAAN
AANldmlsQHlhcm1vLmV1eWVzMBSAAAAAABIAFXByb29mQG1ldGFjb2RlLmJpemRu
czp5YXJtby5ldT90eXBlPVRYVAAKCRCw5zJVrULhn4DtAQCVkyI8UxUbkxspXkWB
qUL+3uqCl9gTbNImhv/OxxJdEAEAqf8SJ9FSeAwgWhPHOidR1m+J6/qVdAJdp0HJ
Yn6RMQ8=
=Oo3X
-----END PGP PUBLIC KEY BLOCK-----`


describe('keys.fetchURI', () => {
  it('should be a function (1 argument)', () => {
    expect(doipjs.keys.fetchURI).to.be.a('function')
    expect(doipjs.keys.fetchURI).to.have.length(1)
  })
  it('should return a Key object when provided a hkp: uri', async () => {
    expect(
      await doipjs.keys.fetchURI(`hkp:${pubKeyFingerprint}`)
    ).to.be.instanceOf(openpgp.key.Key)
  }).timeout('12s')
  it('should reject when provided an invalid uri', () => {
    return expect(
      doipjs.keys.fetchURI(`inv:${pubKeyFingerprint}`)
    ).to.eventually.be.rejectedWith('Invalid URI protocol')
  }).timeout('12s')
})

describe('keys.fetchHKP', () => {
  it('should be a function (2 arguments)', () => {
    expect(doipjs.keys.fetchHKP).to.be.a('function')
    expect(doipjs.keys.fetchHKP).to.have.length(2)
  })
  it('should return a Key object when provided a valid fingerprint', async () => {
    expect(await doipjs.keys.fetchHKP(pubKeyFingerprint)).to.be.instanceOf(
      openpgp.key.Key
    )
  })
  it('should return a Key object when provided a valid email address', async () => {
    expect(await doipjs.keys.fetchHKP(pubKeyEmail)).to.be.instanceOf(
      openpgp.key.Key
    )
  })
  it('should reject when provided an invalid fingerprint', async () => {
    return expect(
      doipjs.keys.fetchHKP('4637202523e7c1309ab79e99ef2dc5827b445f4b')
    ).to.eventually.be.rejectedWith(
      'Key does not exist or could not be fetched'
    )
  })
  it('should reject when provided an invalid email address', async () => {
    return expect(
      doipjs.keys.fetchHKP('invalid@doip.rocks')
    ).to.eventually.be.rejectedWith(
      'Key does not exist or could not be fetched'
    )
  })
})

describe('keys.fetchPlaintext', () => {
  it('should be a function (1 argument)', () => {
    expect(doipjs.keys.fetchPlaintext).to.be.a('function')
    expect(doipjs.keys.fetchPlaintext).to.have.length(1)
  })
  it('should return a Key object', async () => {
    expect(await doipjs.keys.fetchPlaintext(pubKeyPlaintext)).to.be.instanceOf(
      openpgp.key.Key
    )
  })
})

describe('keys.process', () => {
  it('should be a function (1 argument)', () => {
    expect(doipjs.keys.process).to.be.a('function')
    expect(doipjs.keys.process).to.have.length(1)
  })
  it('should return an object with specific keys', async () => {
    const pubKey = await doipjs.keys.fetchPlaintext(pubKeyPlaintext)
    const obj = await doipjs.keys.process(pubKey)
    expect(obj).to.have.keys([
      'users',
      'fingerprint',
      'primaryUserIndex',
      'key',
    ])
  })
  it('should ignore non-proof notations', async () => {
    const pubKey = await doipjs.keys.fetchPlaintext(pubKeyWithOtherNotations)
    const obj = await doipjs.keys.process(pubKey)
    console.log(obj.users[0]);
    expect(obj.users).to.be.lengthOf(1)
    expect(obj.users[0].notations).to.be.lengthOf(1)
    expect(obj.users[0].notations[0]).to.be.equal('dns:yarmo.eu?type=TXT')
  })
})
