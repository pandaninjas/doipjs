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

const sigProfile = `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

A demo signature profile for testing.

proof=dns:doip.rocks
-----BEGIN PGP SIGNATURE-----

iQHEBAEBCgAuFiEENjcgJSPnwTCat56Z7y3FgntEX0sFAmI+LCEQHHRlc3RAZG9p
cC5yb2NrcwAKCRDvLcWCe0RfS2KIC/9wGOnntH4jBBO3unLWb0dQLUguo9XilHGp
Uh4Huue5/nlbmkCNMJFKkRiohYGaySIN4xBU8R4gWwzA8hbqTj9XII5en5VzHqkt
ZONRabicA6rdr4DNzV/UzB0Hz2vdxCLZAICLik6NyScjNE+EybITg/gHjrDrzyEe
hmNCSuUo/PA0oGY1ckduhy9hwFULdEWcyDvM4wIaAh5A53UJ+ndZVxlguCixqnQH
JBXuDQdDOFJRrT7Objdgd/8CI+NEm0iwIlcsaITwG6Twx0ki5NTWftmIg3DoiTEz
svBu6SMrlwbZ7nkRdSZhHp0zrEBOafT1AcFGquF63AlfPuC46rNWTAYvtyU6Cn3P
MeErGzZgOkW9vLbFS+GHaX0ODr01xMMCdvdjPc/o+3sBqkw3d2DctSTLKOx7strh
YCKJPotiqe50nBijHHbuABtBianiMZOm2BbaPnsmdHIX5ynWhOI8LHR1CVmTI/0o
/ilSykmWgvLSdPk5K+i3deQ1wESZeGU=
=2vuM
-----END PGP SIGNATURE-----`

describe('signatures.process', () => {
  it('should be a function (2 arguments)', () => {
    expect(doipjs.signatures.process).to.be.a('function')
    expect(doipjs.signatures.process).to.have.length(1)
  })
  it('should verify the demonstration signature', async () => {
    const verification = await doipjs.signatures.process(sigProfile)
    expect(verification.fingerprint).to.be.equal(
      '3637202523e7c1309ab79e99ef2dc5827b445f4b'
    )
    expect(verification.users[0].claims).to.be.length(1)
  })
})
