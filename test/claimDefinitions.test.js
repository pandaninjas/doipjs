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
const chaiMatchPattern = require('chai-match-pattern')
chai.use(chaiMatchPattern)
chai.use(require('chai-as-promised'))

const _ = chaiMatchPattern.getLodashModule()
const doipjs = require('../src')

const pattern = {
  serviceprovider: {
    type: _.isString,
    name: _.isString,
  },
  match: {
    regularExpression: _.isRegExp,
    isAmbiguous: _.isBoolean,
  },
  profile: {
    display: _.isString,
    uri: _.isString,
    qr: (x) => {
      return _.isString(x) || _.isNull(x)
    },
  },
  proof: {
    uri: (x) => {
      return _.isString(x) || _.isNull(x)
    },
    request: {
      fetcher: _.isString,
      access: _.isString,
      format: _.isString,
      data: _.isObject,
    },
  },
  claim: (x) => {
    return _.isObject(x) || _.isArray(x)
  },
}

doipjs.claimDefinitions.list.forEach((claimDefName, i) => {
  const claimDef = doipjs.claimDefinitions.data[claimDefName]

  describe(`claimDefinitions.${claimDefName}`, () => {
    it('should be an object', () => {
      expect(claimDef).to.be.a('object')
    })
    it('should have a RegExp instance named "reURI"', () => {
      expect(claimDef.reURI).to.be.instanceof(RegExp)
    })
    it('should have a function named "processURI" (1 argument)', () => {
      expect(claimDef.processURI).to.be.a('function')
      expect(claimDef.processURI).to.have.length(1)
    })
    it('should have an array named "tests"', () => {
      expect(claimDef.tests).to.be.instanceof(Array)
    })

    claimDef.tests.forEach((test, j) => {
      if (test.shouldMatch) {
        it(`should match "${test.uri}"`, () => {
          expect(claimDef.reURI.test(test.uri)).to.be.true
        })
        it(`should return a valid object for "${test.uri}"`, async () => {
          const obj = claimDef.processURI(claimDef.tests[0].uri)
          expect(obj).to.be.a('object')
          expect(obj).to.matchPattern(pattern)
        })
      } else {
        it(`should not match "${test.uri}"`, () => {
          expect(claimDef.reURI.test(test.uri)).to.be.false
        })
      }
    })
  })
})
