/*
Copyright (C) 2020 Yarmo Mackenbach

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

If your software can interact with users remotely through a computer network,
you should also make sure that it provides a way for users to get its source.
For example, if your program is a web application, its interface could display
a "Source" link that leads users to an archive of the code. There are many
ways you could offer source, and different solutions will be better for different
programs; see section 13 for the specific requirements.

You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary. For
more information on this, and how to apply and follow the GNU AGPL, see <https://www.gnu.org/licenses/>.
*/
const expect = require('chai').expect
const assert = require('chai').assert
const request = require('supertest')
const doipjs = require('../src')

for (let sp in doipjs.serviceproviders) {
  describe(`serviceproviders.${sp}`, () => {
    it('should be an object', () => {
      expect(doipjs.serviceproviders[sp]).to.be.a('object')
    })
    it('should have a RegExp instance named "reURL"', () => {
      expect(doipjs.serviceproviders[sp].reURL).to.be.instanceof(RegExp)
    })
    it('should have a function named "processURL" (2 arguments)', () => {
      expect(doipjs.serviceproviders[sp].processURL).to.be.a('function')
      expect(doipjs.serviceproviders[sp].processURL).to.have.length(2)
    })
    it('should have an array named "tests"', () => {
      expect(doipjs.serviceproviders[sp].tests).to.be.instanceof(Array)
    })

    doipjs.serviceproviders[sp].tests.forEach((test, i) => {
      if (test.shouldMatch) {
        it(`should match "${test.url}"`, () => {
          expect(doipjs.serviceproviders[sp].reURL.test(test.url)).to.be.true
        })
      } else {
        it(`should not match "${test.url}"`, () => {
          expect(doipjs.serviceproviders[sp].reURL.test(test.url)).to.be.false
        })
      }
    });

  })
}
