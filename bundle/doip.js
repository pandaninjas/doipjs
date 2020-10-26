(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.doip = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'
/* global fetch, btoa, Headers */
const core = require('./core')

class StatusError extends Error {
  constructor (res, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError)
    }

    this.name = 'StatusError'
    this.message = res.statusMessage
    this.statusCode = res.status
    this.res = res
    this.json = res.json.bind(res)
    this.text = res.text.bind(res)
    this.arrayBuffer = res.arrayBuffer.bind(res)
    let buffer
    const get = () => {
      if (!buffer) buffer = this.arrayBuffer()
      return buffer
    }
    Object.defineProperty(this, 'responseBody', { get })
    // match Node.js headers object
    this.headers = {}
    for (const [key, value] of res.headers.entries()) {
      this.headers[key.toLowerCase()] = value
    }
  }
}

const mkrequest = (statusCodes, method, encoding, headers, baseurl) => async (_url, body, _headers = {}) => {
  _url = baseurl + (_url || '')
  let parsed = new URL(_url)

  if (!headers) headers = {}
  if (parsed.username) {
    headers.Authorization = 'Basic ' + btoa(parsed.username + ':' + parsed.password)
    parsed = new URL(parsed.protocol + '//' + parsed.host + parsed.pathname + parsed.search)
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Unknown protocol, ${parsed.protocol}`)
  }

  if (body) {
    if (body instanceof ArrayBuffer ||
      ArrayBuffer.isView(body) ||
      typeof body === 'string'
    ) {
      // noop
    } else if (typeof body === 'object') {
      body = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
    } else {
      throw new Error('Unknown body type.')
    }
  }

  _headers = new Headers({ ...(headers || {}), ..._headers })

  const resp = await fetch(parsed, { method, headers: _headers, body })
  resp.statusCode = resp.status

  if (!statusCodes.has(resp.status)) {
    throw new StatusError(resp)
  }

  if (encoding === 'json') return resp.json()
  else if (encoding === 'buffer') return resp.arrayBuffer()
  else if (encoding === 'string') return resp.text()
  else return resp
}

module.exports = core(mkrequest)

},{"./core":2}],2:[function(require,module,exports){
'use strict'
const encodings = new Set(['json', 'buffer', 'string'])

module.exports = mkrequest => (...args) => {
  const statusCodes = new Set()
  let method
  let encoding
  let headers
  let baseurl = ''

  args.forEach(arg => {
    if (typeof arg === 'string') {
      if (arg.toUpperCase() === arg) {
        if (method) {
          const msg = `Can't set method to ${arg}, already set to ${method}.`
          throw new Error(msg)
        } else {
          method = arg
        }
      } else if (arg.startsWith('http:') || arg.startsWith('https:')) {
        baseurl = arg
      } else {
        if (encodings.has(arg)) {
          encoding = arg
        } else {
          throw new Error(`Unknown encoding, ${arg}`)
        }
      }
    } else if (typeof arg === 'number') {
      statusCodes.add(arg)
    } else if (typeof arg === 'object') {
      if (Array.isArray(arg) || arg instanceof Set) {
        arg.forEach(code => statusCodes.add(code))
      } else {
        if (headers) {
          throw new Error('Cannot set headers twice.')
        }
        headers = arg
      }
    } else {
      throw new Error(`Unknown type: ${typeof arg}`)
    }
  })

  if (!method) method = 'GET'
  if (statusCodes.size === 0) {
    statusCodes.add(200)
  }

  return mkrequest(statusCodes, method, encoding, headers, baseurl)
}

},{}],3:[function(require,module,exports){
(function(module) {
    'use strict';

    module.exports.is_uri = is_iri;
    module.exports.is_http_uri = is_http_iri;
    module.exports.is_https_uri = is_https_iri;
    module.exports.is_web_uri = is_web_iri;
    // Create aliases
    module.exports.isUri = is_iri;
    module.exports.isHttpUri = is_http_iri;
    module.exports.isHttpsUri = is_https_iri;
    module.exports.isWebUri = is_web_iri;


    // private function
    // internal URI spitter method - direct from RFC 3986
    var splitUri = function(uri) {
        var splitted = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
        return splitted;
    };

    function is_iri(value) {
        if (!value) {
            return;
        }

        // check for illegal characters
        if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return;

        // check for hex escapes that aren't complete
        if (/%[^0-9a-f]/i.test(value)) return;
        if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;

        var splitted = [];
        var scheme = '';
        var authority = '';
        var path = '';
        var query = '';
        var fragment = '';
        var out = '';

        // from RFC 3986
        splitted = splitUri(value);
        scheme = splitted[1]; 
        authority = splitted[2];
        path = splitted[3];
        query = splitted[4];
        fragment = splitted[5];

        // scheme and path are required, though the path can be empty
        if (!(scheme && scheme.length && path.length >= 0)) return;

        // if authority is present, the path must be empty or begin with a /
        if (authority && authority.length) {
            if (!(path.length === 0 || /^\//.test(path))) return;
        } else {
            // if authority is not present, the path must not start with //
            if (/^\/\//.test(path)) return;
        }

        // scheme must begin with a letter, then consist of letters, digits, +, ., or -
        if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase()))  return;

        // re-assemble the URL per section 5.3 in RFC 3986
        out += scheme + ':';
        if (authority && authority.length) {
            out += '//' + authority;
        }

        out += path;

        if (query && query.length) {
            out += '?' + query;
        }

        if (fragment && fragment.length) {
            out += '#' + fragment;
        }

        return out;
    }

    function is_http_iri(value, allowHttps) {
        if (!is_iri(value)) {
            return;
        }

        var splitted = [];
        var scheme = '';
        var authority = '';
        var path = '';
        var port = '';
        var query = '';
        var fragment = '';
        var out = '';

        // from RFC 3986
        splitted = splitUri(value);
        scheme = splitted[1]; 
        authority = splitted[2];
        path = splitted[3];
        query = splitted[4];
        fragment = splitted[5];

        if (!scheme)  return;

        if(allowHttps) {
            if (scheme.toLowerCase() != 'https') return;
        } else {
            if (scheme.toLowerCase() != 'http') return;
        }

        // fully-qualified URIs must have an authority section that is
        // a valid host
        if (!authority) {
            return;
        }

        // enable port component
        if (/:(\d+)$/.test(authority)) {
            port = authority.match(/:(\d+)$/)[0];
            authority = authority.replace(/:\d+$/, '');
        }

        out += scheme + ':';
        out += '//' + authority;
        
        if (port) {
            out += port;
        }
        
        out += path;
        
        if(query && query.length){
            out += '?' + query;
        }

        if(fragment && fragment.length){
            out += '#' + fragment;
        }
        
        return out;
    }

    function is_https_iri(value) {
        return is_http_iri(value, true);
    }

    function is_web_iri(value) {
        return (is_http_iri(value) || is_https_iri(value));
    }

})(module);

},{}],4:[function(require,module,exports){
const utils = require('./utils')

const runOnJson = (proofData, checkPath, checkClaim, checkRelation) => {
  let isVerified = false, re

  if (!proofData) {
    return isVerified
  }

  if (checkPath.length == 0) {
    switch (checkRelation) {
      default:
      case 'contains':
        re = new RegExp(checkClaim, "gi")
        return re.test(proofData.replace(/\r?\n|\r/, ''))
        break
      case 'equals':
        return proofData.replace(/\r?\n|\r/, '').toLowerCase() == checkClaim.toLowerCase()
        break
      case 'oneOf':
        re = new RegExp(checkClaim, "gi")
        return re.test(proofData.join("|"))
        break
    }
  }

  if (Array.isArray(proofData)) {
    proofData.forEach((item, i) => {
      isVerified = isVerified || runOnJson(item, checkPath, checkClaim, checkRelation)
    });
  } else if (Array.isArray(proofData[checkPath[0]])) {
    proofData[checkPath[0]].forEach((item, i) => {
      isVerified = isVerified || runOnJson(item, checkPath.slice(1), checkClaim, checkRelation)
    })
  } else {
    isVerified = isVerified || runOnJson(proofData[checkPath[0]], checkPath.slice(1), checkClaim, checkRelation)
  }

  return isVerified;
}

const run = (proofData, spData) => {
  switch (spData.proof.format) {
    case 'json':
      return runOnJson(proofData, spData.claim.path, utils.generateClaim(spData.claim.fingerprint, spData.claim.format), spData.claim.relation)
      break
    case 'text':
      re = new RegExp(utils.generateClaim(spData.claim.fingerprint, spData.claim.format), "gi")
      return re.test(proofData.replace(/\r?\n|\r/, ''))
      break
  }
}

exports.run = run

},{"./utils":16}],5:[function(require,module,exports){
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
const validUrl = require('valid-url')
const bent = require('bent')
const req = bent('GET')
const serviceproviders = require('./serviceproviders')
const claimVerification = require('./claimVerification')
const utils = require('./utils')

const verify = async (uri, fingerprint, opts) => {
  if (!fingerprint) { fingerprint = null }
  if (!opts) { opts = {} }

  if (!validUrl.isUri(uri)) {
    throw new Error('Not a valid URI')
  }

  const spMatches = serviceproviders.match(uri, opts)

  if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
    return spMatches
  }

  let claimHasBeenVerified = false, sp, iSp = 0, res, proofData, spData = null
  while (!claimHasBeenVerified && iSp < spMatches.length) {
    spData = spMatches[iSp]
    spData.claim.fingerprint = fingerprint

    res = null

    if (!spData.proof.useProxy || 'useProxyWhenNeeded' in opts && !opts.useProxyWhenNeeded) {
      res = await req(spData.proof.fetch ? spData.proof.fetch : spData.proof.uri)

      switch (spData.proof.format) {
        case 'json':
          proofData = await res.json()
          break
        case 'text':
          proofData = await res.text()
          break
        default:
          throw new Error('No specified proof data format')
          break
      }
    }

    claimHasBeenVerified = claimVerification.run(proofData, spData)

    iSp++
  }

  return {
    isVerified: claimHasBeenVerified,
    matchedServiceprovider: spData ? spData.serviceprovider.name : null,
    verificationData: spData
  }
}

exports.verify = verify
exports.serviceproviders = serviceproviders
exports.claimVerification = claimVerification
exports.utils = utils

},{"./claimVerification":4,"./serviceproviders":6,"./utils":16,"bent":1,"valid-url":3}],6:[function(require,module,exports){
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
const list = [
  'dns',
  'xmpp',
  'twitter',
  'reddit',
  'hackernews',
  'lobsters',
  'devto',
  'gitea',
  'github',
]

const data = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp'),
  twitter: require('./serviceproviders/twitter'),
  reddit: require('./serviceproviders/reddit'),
  hackernews: require('./serviceproviders/hackernews'),
  lobsters: require('./serviceproviders/lobsters'),
  devto: require('./serviceproviders/devto'),
  gitea: require('./serviceproviders/gitea'),
  github: require('./serviceproviders/github'),
}

const match = (uri, opts) => {
  let matches = [], sp

  list.forEach((spName, i) => {
    sp = data[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri, opts))
    }
  })

  return matches
}

exports.list = list
exports.data = data
exports.match = match

},{"./serviceproviders/devto":7,"./serviceproviders/dns":8,"./serviceproviders/gitea":9,"./serviceproviders/github":10,"./serviceproviders/hackernews":11,"./serviceproviders/lobsters":12,"./serviceproviders/reddit":13,"./serviceproviders/twitter":14,"./serviceproviders/xmpp":15}],7:[function(require,module,exports){
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
const reURI = /^https:\/\/dev\.to\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'devto'
    },
    profile: {
      display: match[1],
      uri: `https://dev.to/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://dev.to/api/articles/${match[1]}/${match[2]}`,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['body_markdown'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://dev.to/alice/post',
    shouldMatch: true
  },
  {
    uri: 'https://dev.to/alice/post/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/post',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],8:[function(require,module,exports){
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
const reURI = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'dns'
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`
    },
    proof: {
      uri: `https://dns.shivering-isles.com/dns-query?name=${match[1]}&type=TXT`,
      fetch: null,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['Answer', 'data'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'dns:domain.org',
    shouldMatch: true
  },
  {
    uri: 'dns:domain.org?type=TXT',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],9:[function(require,module,exports){
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
const reURI = /^https:\/\/(.*)\/(.*)\/gitea_proof\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitea'
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`
    },
    proof: {
      uri: uri,
      fetch: `https://${match[1]}/api/v1/repos/${match[2]}/gitea_proof`,
      useProxy: true,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['description'],
      relation: 'equals'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://domain.org/alice/gitea_proof',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/gitea_proof/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/other_proof',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],10:[function(require,module,exports){
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
const reURI = /^https:\/\/gist.github.com\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'github'
    },
    profile: {
      display: match[1],
      uri: `https://github.com/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://api.github.com/gists/${match[2]}`,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['files', 'openpgp.md', 'content'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://gist.github.com/Alice/123456789',
    shouldMatch: true
  },
  {
    uri: 'https://gist.github.com/Alice/123456789/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/Alice/123456789',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],11:[function(require,module,exports){
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
const reURI = /^https:\/\/news.ycombinator.com\/user\?id=(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'hackernews'
    },
    profile: {
      display: match[1],
      uri: uri
    },
    proof: {
      uri: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
      fetch: null,
      useProxy: true,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['about'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://news.ycombinator.com/user?id=Alice',
    shouldMatch: true
  },
  {
    uri: 'https://news.ycombinator.com/user?id=Alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/user?id=Alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],12:[function(require,module,exports){
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
const reURI = /^https:\/\/lobste.rs\/u\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'lobsters'
    },
    profile: {
      display: match[1],
      uri: uri
    },
    proof: {
      uri: `https://lobste.rs/u/${match[1]}.json`,
      fetch: null,
      useProxy: true,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['about'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://lobste.rs/u/Alice',
    shouldMatch: true
  },
  {
    uri: 'https://lobste.rs/u/Alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/u/Alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],13:[function(require,module,exports){
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
const reURI = /^https:\/\/(?:www\.)?reddit\.com\/user\/(.*)\/comments\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'reddit'
    },
    profile: {
      display: match[1],
      uri: `https://www.reddit.com/user/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://www.reddit.com/user/${match[1]}/comments/${match[2]}.json`,
      useProxy: true,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['data', 'children', 'data', 'selftext'],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true
  },
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/user/Alice/comments/123456/post',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],14:[function(require,module,exports){
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
const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter'
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`
    },
    proof: {
      uri: uri,
      fetch: `https://mobile.twitter.com/${match[1]}/status/${match[2]}`,
      useProxy: false,
      format: 'text'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: [],
      relation: 'contains'
    },
    qr: null
  }
}

const tests = [
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789',
    shouldMatch: true
  },
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice/status/1234567890123456789',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],15:[function(require,module,exports){
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
const reURI = /^xmpp:([a-zA-Z0-9\.\-\_]*)@([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  if (!opts) { opts = {} }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'xmpp'
    },
    profile: {
      display: `${match[1]}@${match[2]}`,
      uri: uri
    },
    proof: {
      uri: 'xmppVcardServerDomain' in opts
           ? `https://${opts.xmppVcardServerDomain}/api/vcard/${match[1]}@${match[2]}/DESC`
           : null,
      fetch: null,
      useProxy: false,
      format: 'json'
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: [],
      relation: 'contains'
    },
    qr: uri
  }
}

const tests = [
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: true
  },
  {
    uri: 'xmpp:alice@domain.org?omemo-sid-123456789=A1B2C3D4E5F6G7H8I9',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],16:[function(require,module,exports){
const generateClaim = (fingerprint, format) => {
  switch (format) {
    case 'uri':
      return `openpgp4fpr:${fingerprint}`
      break;
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${fingerprint}]`
      break;
    case 'fingerprint':
      return fingerprint
      break;
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateClaim = generateClaim

},{}]},{},[5])(5)
});
