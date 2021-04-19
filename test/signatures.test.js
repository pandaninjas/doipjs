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

Hey there! Here's a signature profile with doip-related proofs.

openpgp4fpr:3637202523e7c1309ab79e99ef2dc5827b445f4b
key=hkp:test@doip.rocks
proof=dns:doip.rocks
-----BEGIN PGP SIGNATURE-----

iQHEBAEBCgAuFiEENjcgJSPnwTCat56Z7y3FgntEX0sFAl/3JBMQHHRlc3RAZG9p
cC5yb2NrcwAKCRDvLcWCe0RfS7XvC/wN9F/0ef/w1yXJqApgSNfc8WJxKS232g7L
prb3EMhNI9JV13yfZObb664WahkrMOiiIeN2vyofpU1h80cucQwmTcsBav/TX7HI
aBtXYtC6XvAhNUsctfA7C/uTSL3+St8G6ahbP7RLmal0r8vfIRgLMco1LtNpQM1v
gjkjNpceKkl10cJgx7UiT1RWIIvisnEGNgK31XaN8oRwAMSySjl2n4fRjDRlJPVd
cK+WvS4GJS24jRqGqZASTusPVRAOxtY+uEwX0HepUicgaHdFSFZ4iHByyrKEMi9L
sS5Z7/ZvHXgmS1BUV9++vtChi6zaFwMJZnkMci3C0xwoQ3MECNN2OrPExFFcqk/z
CgC81QrXNjGMZrBmSzPDgsibGe5G1VlQ73h1VhMjdcBZ1EjN0trEm3Ka8TDhJysS
cXbjvHSGniZ7M3S9S8knAfIquPvTp7+L7wWgSSB5VObPp1r+96n87hyFZUp7PCvl
3XkJV2l34fePSR73Ka7jmX86ARn4+HM=
=ADl+
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
