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
      access: _.isInteger,
      format: _.isInteger,
      data: _.isObject,
    },
  },
  claim: {
    fingerprint: (x) => {
      return _.isString(x) || _.isNull(x)
    },
    format: _.isInteger,
    relation: _.isInteger,
    path: _.isArray,
  },
}

describe('claims.verify', () => {
  it('should be a function (3 arguments)', () => {
    expect(doipjs.claims.verify).to.be.a('function')
    expect(doipjs.claims.verify).to.have.length(3)
  })
  it('should return undefined for non-valid URIs', () => {
    return expect(doipjs.claims.verify('noURI')).to.eventually.be.rejectedWith(
      undefined
    )
  })

  doipjs.serviceproviders.list.forEach((spName, i) => {
    const sp = doipjs.serviceproviders.data[spName]

    if (sp.tests.length == 0) {
      return
    }

    it(`should return a valid object for the "${spName}" service provider`, async () => {
      const matches = await doipjs.claims.verify(sp.tests[0].uri, null, {
        returnMatchesOnly: true,
      })
      expect(matches).to.be.a('array')
      expect(matches).to.be.length.above(0)
      expect(matches[0].serviceprovider.name).to.be.equal(spName)
      expect(matches[0]).to.matchPattern(pattern)
    })
  })
})
