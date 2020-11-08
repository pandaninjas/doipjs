/*
Copyright 2020 Yarmo Mackenbach

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

doipjs.serviceproviders.list.forEach((sp, i) => {
  describe(`serviceproviders.${sp}`, () => {
    it('should be an object', () => {
      expect(doipjs.serviceproviders.data[sp]).to.be.a('object')
    })
    it('should have a RegExp instance named "reURI"', () => {
      expect(doipjs.serviceproviders.data[sp].reURI).to.be.instanceof(RegExp)
    })
    it('should have a function named "processURI" (2 arguments)', () => {
      expect(doipjs.serviceproviders.data[sp].processURI).to.be.a('function')
      expect(doipjs.serviceproviders.data[sp].processURI).to.have.length(2)
    })
    it('should have an array named "tests"', () => {
      expect(doipjs.serviceproviders.data[sp].tests).to.be.instanceof(Array)
    })

    doipjs.serviceproviders.data[sp].tests.forEach((test, j) => {
      if (test.shouldMatch) {
        it(`should match "${test.uri}"`, () => {
          expect(doipjs.serviceproviders.data[sp].reURI.test(test.uri)).to.be
            .true
        })
      } else {
        it(`should not match "${test.uri}"`, () => {
          expect(doipjs.serviceproviders.data[sp].reURI.test(test.uri)).to.be
            .false
        })
      }
    })
  })
})
