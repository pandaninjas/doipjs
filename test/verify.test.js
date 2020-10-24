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
const expect = require('chai').expect
const assert = require('chai').assert
const request = require('supertest')
const doipjs = require('../src')

describe('verify', () => {
  it('should be a function (3 arguments)', () => {
    expect(doipjs.verify).to.be.a('function')
    expect(doipjs.verify).to.have.length(3)
  })
  it('should throw an error for non-valid URIs', () => {
    expect(() => { doipjs.verify('noURI') }).to.throw('Not a valid URI')
    expect(() => { doipjs.verify('domain.org') }).to.throw('Not a valid URI')
  })
  it('should match "dns:domain.org" to the DNS service provider', () => {
    const matches = doipjs.verify('dns:domain.org', null, {returnMatchesOnly: true})
    expect(matches).to.be.a('array')
    expect(matches).to.be.length(1)
    expect(matches[0].type).to.be.equal('domain')
  })
  it('should match "xmpp:alice@domain.org" to the XMPP service provider', () => {
    const matches = doipjs.verify('xmpp:alice@domain.org', null, {returnMatchesOnly: true})
    expect(matches).to.be.a('array')
    expect(matches).to.be.length(1)
    expect(matches[0].type).to.be.equal('xmpp')
  })
  it('should match "https://twitter.com/alice/status/1234567890123456789" to the Twitter service provider', () => {
    const matches = doipjs.verify('https://twitter.com/alice/status/1234567890123456789', null, {returnMatchesOnly: true})
    expect(matches).to.be.a('array')
    expect(matches).to.be.length(1)
    expect(matches[0].type).to.be.equal('twitter')
  })
  it('should match "https://news.ycombinator.com/user?id=Alice" to the Hackernews service provider', () => {
    const matches = doipjs.verify('https://news.ycombinator.com/user?id=Alice', null, {returnMatchesOnly: true})
    expect(matches).to.be.a('array')
    expect(matches).to.be.length(1)
    expect(matches[0].type).to.be.equal('hackernews')
  })
})
