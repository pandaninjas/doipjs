(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.doip = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// hkp-client - A HKP client implementation in javascript
// Copyright (C) 2015 Tankred Hase
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 3.0 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

/**
 * This class implements a client for the OpenPGP HTTP Keyserver Protocol (HKP)
 * in order to lookup and upload keys on standard public key servers.
 */
class HKP {
  /**
   * Initialize the HKP client and configure it with the key server url and fetch function.
   * @param {String} [keyServerBaseUrl] - The HKP key server base url including
   *   the protocol to use, e.g. 'https://pgp.mit.edu'; defaults to
   *   openpgp.config.keyserver (https://keyserver.ubuntu.com)
   * @param {Object} [config] - Full configuration, defaults to openpgp.config
   */
  constructor(keyServerBaseUrl = 'https://keyserver.ubuntu.com') {
    this._baseUrl = keyServerBaseUrl;
    this._fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require('node-fetch');
  }

  /**
   * Search for a public key on the key server either by key ID or part of the user ID.
   * @param  {String}   options.keyId   The long public key ID.
   * @param  {String}   options.query   This can be any part of the key user ID such as name
   *   or email address.
   * @returns {String} The ascii armored public key.
   * @async
   */
  lookup(options) {
    let uri = this._baseUrl + '/pks/lookup?op=get&options=mr&search=';
    const fetch = this._fetch;

    if (options.keyId) {
      uri += '0x' + encodeURIComponent(options.keyId);
    } else if (options.query) {
      uri += encodeURIComponent(options.query);
    } else {
      throw new Error('You must provide a query parameter!');
    }

    return fetch(uri).then(function(response) {
      if (response.status === 200) {
        return response.text();
      }
    }).then(function(publicKeyArmored) {
      if (!publicKeyArmored || publicKeyArmored.indexOf('-----END PGP PUBLIC KEY BLOCK-----') < 0) {
        return;
      }
      return publicKeyArmored.trim();
    });
  }

  /**
   * Upload a public key to the server.
   * @param {String} publicKeyArmored - An ascii armored public key to be uploaded.
   * @returns {Promise}
   * @async
   */
  upload(publicKeyArmored) {
    const uri = this._baseUrl + '/pks/add';
    const fetch = this._fetch;

    return fetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'keytext=' + encodeURIComponent(publicKeyArmored)
    });
  }
}

module.exports = HKP;

},{"node-fetch":33}],2:[function(require,module,exports){
// wkd-client - A WKD client implementation in javascript
// Copyright (C) 2018 Wiktor Kwapisiewicz
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 3.0 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

/**
 * This class implements a client for the Web Key Directory (WKD) protocol
 * in order to lookup keys on designated servers.
 * @see https://datatracker.ietf.org/doc/draft-koch-openpgp-webkey-service/
 */
class WKD {
  /**
   * Initialize the WKD client
   */
  constructor() {
    this._fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require('node-fetch');
    const { subtle } = globalThis.crypto || require('crypto').webcrypto || new (require('@peculiar/webcrypto').Crypto)();
    this._subtle = subtle;
  }

  /**
   * Search for a public key using Web Key Directory protocol.
   * @param   {String}   options.email         User's email.
   * @returns {Uint8Array} The public key.
   * @async
   */
  async lookup(options) {
    const fetch = this._fetch;

    if (!options.email) {
      throw new Error('You must provide an email parameter!');
    }

    if (typeof options.email !== 'string' || !options.email.includes('@')) {
      throw new Error('Invalid e-mail address.');
    }

    const [localPart, domain] = options.email.split('@');
    const localPartEncoded = new TextEncoder().encode(localPart.toLowerCase());
    const localPartHashed = new Uint8Array(await this._subtle.digest('SHA-1', localPartEncoded));
    const localPartBase32 = encodeZBase32(localPartHashed);
    const localPartEscaped = encodeURIComponent(localPart);

    const urlAdvanced = `https://openpgpkey.${domain}/.well-known/openpgpkey/${domain}/hu/${localPartBase32}?l=${localPartEscaped}`;
    const urlDirect = `https://${domain}/.well-known/openpgpkey/hu/${localPartBase32}?l=${localPartEscaped}`;

    let response;
    try {
      response = await fetch(urlAdvanced);
      if (response.status !== 200) {
        throw new Error('Advanced WKD lookup failed: ' + response.statusText);
      }
    } catch (err) {
      response = await fetch(urlDirect);
      if (response.status !== 200) {
        throw new Error('Direct WKD lookup failed: ' + response.statusText);
      }
    }

    return new Uint8Array(await response.arrayBuffer());
  }
}

/**
 * Encode input buffer using Z-Base32 encoding.
 * See: https://tools.ietf.org/html/rfc6189#section-5.1.6
 *
 * @param {Uint8Array} data - The binary data to encode
 * @returns {String} Binary data encoded using Z-Base32.
 */
function encodeZBase32(data) {
  if (data.length === 0) {
    return "";
  }
  const ALPHABET = "ybndrfg8ejkmcpqxot1uwisza345h769";
  const SHIFT = 5;
  const MASK = 31;
  let buffer = data[0];
  let index = 1;
  let bitsLeft = 8;
  let result = '';
  while (bitsLeft > 0 || index < data.length) {
    if (bitsLeft < SHIFT) {
      if (index < data.length) {
        buffer <<= 8;
        buffer |= data[index++] & 0xff;
        bitsLeft += 8;
      } else {
        const pad = SHIFT - bitsLeft;
        buffer <<= pad;
        bitsLeft += pad;
      }
    }
    bitsLeft -= SHIFT;
    result += ALPHABET[MASK & (buffer >> bitsLeft)];
  }
  return result;
}

module.exports = WKD;

},{"@peculiar/webcrypto":33,"crypto":33,"node-fetch":33}],3:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":5}],4:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var defaults = require('../defaults');
var Cancel = require('../cancel/Cancel');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../cancel/Cancel":6,"../core/buildFullPath":11,"../core/createError":12,"../defaults":18,"./../core/settle":16,"./../helpers/buildURL":21,"./../helpers/cookies":23,"./../helpers/isURLSameOrigin":26,"./../helpers/parseHeaders":28,"./../utils":31}],5:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.VERSION = require('./env/data').version;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":6,"./cancel/CancelToken":7,"./cancel/isCancel":8,"./core/Axios":9,"./core/mergeConfig":15,"./defaults":18,"./env/data":19,"./helpers/bind":20,"./helpers/isAxiosError":25,"./helpers/spread":29,"./utils":31}],6:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],7:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":6}],8:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":21,"../helpers/validator":30,"./../utils":31,"./InterceptorManager":10,"./dispatchRequest":13,"./mergeConfig":15}],10:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":31}],11:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":22,"../helpers/isAbsoluteURL":24}],12:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":14}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var Cancel = require('../cancel/Cancel');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/Cancel":6,"../cancel/isCancel":8,"../defaults":18,"./../utils":31,"./transformData":17}],14:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};

},{}],15:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

},{"../utils":31}],16:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":12}],17:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":18,"./../utils":31}],18:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":4,"./adapters/xhr":4,"./core/enhanceError":14,"./helpers/normalizeHeaderName":27,"./utils":31,"_process":40}],19:[function(require,module,exports){
module.exports = {
  "version": "0.25.0"
};
},{}],20:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],21:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":31}],22:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":31}],24:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

},{}],25:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};

},{"./../utils":31}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":31}],27:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":31}],28:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":31}],29:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],30:[function(require,module,exports){
'use strict';

var VERSION = require('../env/data').version;

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

},{"../env/data":19}],31:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":20}],32:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global window self */

var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/* eslint-disable no-restricted-globals */
var isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * @see https://github.com/jsdom/jsdom/releases/tag/12.0.0
 * @see https://github.com/jsdom/jsdom/issues/1537
 */
/* eslint-disable no-undef */
var isJsDom = function isJsDom() {
  return typeof window !== 'undefined' && window.name === 'nodejs' || navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
};

exports.isBrowser = isBrowser;
exports.isWebWorker = isWebWorker;
exports.isNode = isNode;
exports.isJsDom = isJsDom;
}).call(this)}).call(this,require('_process'))
},{"_process":40}],33:[function(require,module,exports){

},{}],34:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],35:[function(require,module,exports){
'use strict';
var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

},{}],36:[function(require,module,exports){
'use strict';
module.exports = function (obj, predicate) {
	var ret = {};
	var keys = Object.keys(obj);
	var isArr = Array.isArray(predicate);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = obj[key];

		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}

	return ret;
};

},{}],37:[function(require,module,exports){
(function (global){(function (){
/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hashwasm = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Mutex {
        constructor() {
            this.mutex = Promise.resolve();
        }
        lock() {
            let begin = () => { };
            this.mutex = this.mutex.then(() => new Promise(begin));
            return new Promise((res) => {
                begin = res;
            });
        }
        dispatch(fn) {
            return __awaiter(this, void 0, void 0, function* () {
                const unlock = yield this.lock();
                try {
                    return yield Promise.resolve(fn());
                }
                finally {
                    unlock();
                }
            });
        }
    }

    /* eslint-disable import/prefer-default-export */
    /* eslint-disable no-bitwise */
    var _a;
    function getGlobal() {
        if (typeof globalThis !== 'undefined')
            return globalThis;
        // eslint-disable-next-line no-restricted-globals
        if (typeof self !== 'undefined')
            return self;
        if (typeof window !== 'undefined')
            return window;
        return global;
    }
    const globalObject = getGlobal();
    const nodeBuffer = (_a = globalObject.Buffer) !== null && _a !== void 0 ? _a : null;
    const textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
    function intArrayToString(arr, len) {
        return String.fromCharCode(...arr.subarray(0, len));
    }
    function hexCharCodesToInt(a, b) {
        return (((a & 0xF) + ((a >> 6) | ((a >> 3) & 0x8))) << 4) | ((b & 0xF) + ((b >> 6) | ((b >> 3) & 0x8)));
    }
    function writeHexToUInt8(buf, str) {
        const size = str.length >> 1;
        for (let i = 0; i < size; i++) {
            const index = i << 1;
            buf[i] = hexCharCodesToInt(str.charCodeAt(index), str.charCodeAt(index + 1));
        }
    }
    function hexStringEqualsUInt8(str, buf) {
        if (str.length !== buf.length * 2) {
            return false;
        }
        for (let i = 0; i < buf.length; i++) {
            const strIndex = i << 1;
            if (buf[i] !== hexCharCodesToInt(str.charCodeAt(strIndex), str.charCodeAt(strIndex + 1))) {
                return false;
            }
        }
        return true;
    }
    const alpha = 'a'.charCodeAt(0) - 10;
    const digit = '0'.charCodeAt(0);
    function getDigestHex(tmpBuffer, input, hashLength) {
        let p = 0;
        /* eslint-disable no-plusplus */
        for (let i = 0; i < hashLength; i++) {
            let nibble = input[i] >>> 4;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
            nibble = input[i] & 0xF;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
        }
        /* eslint-enable no-plusplus */
        return String.fromCharCode.apply(null, tmpBuffer);
    }
    const getUInt8Buffer = nodeBuffer !== null
        ? (data) => {
            if (typeof data === 'string') {
                const buf = nodeBuffer.from(data, 'utf8');
                return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
            }
            if (nodeBuffer.isBuffer(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.length);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        }
        : (data) => {
            if (typeof data === 'string') {
                return textEncoder.encode(data);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        };
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64Lookup = new Uint8Array(256);
    for (let i = 0; i < base64Chars.length; i++) {
        base64Lookup[base64Chars.charCodeAt(i)] = i;
    }
    function encodeBase64(data, pad = true) {
        const len = data.length;
        const extraBytes = len % 3;
        const parts = [];
        const len2 = len - extraBytes;
        for (let i = 0; i < len2; i += 3) {
            const tmp = ((data[i] << 16) & 0xFF0000)
                + ((data[i + 1] << 8) & 0xFF00)
                + (data[i + 2] & 0xFF);
            const triplet = base64Chars.charAt((tmp >> 18) & 0x3F)
                + base64Chars.charAt((tmp >> 12) & 0x3F)
                + base64Chars.charAt((tmp >> 6) & 0x3F)
                + base64Chars.charAt(tmp & 0x3F);
            parts.push(triplet);
        }
        if (extraBytes === 1) {
            const tmp = data[len - 1];
            const a = base64Chars.charAt(tmp >> 2);
            const b = base64Chars.charAt((tmp << 4) & 0x3F);
            parts.push(`${a}${b}`);
            if (pad) {
                parts.push('==');
            }
        }
        else if (extraBytes === 2) {
            const tmp = (data[len - 2] << 8) + data[len - 1];
            const a = base64Chars.charAt(tmp >> 10);
            const b = base64Chars.charAt((tmp >> 4) & 0x3F);
            const c = base64Chars.charAt((tmp << 2) & 0x3F);
            parts.push(`${a}${b}${c}`);
            if (pad) {
                parts.push('=');
            }
        }
        return parts.join('');
    }
    function getDecodeBase64Length(data) {
        let bufferLength = Math.floor(data.length * 0.75);
        const len = data.length;
        if (data[len - 1] === '=') {
            bufferLength -= 1;
            if (data[len - 2] === '=') {
                bufferLength -= 1;
            }
        }
        return bufferLength;
    }
    function decodeBase64(data) {
        const bufferLength = getDecodeBase64Length(data);
        const len = data.length;
        const bytes = new Uint8Array(bufferLength);
        let p = 0;
        for (let i = 0; i < len; i += 4) {
            const encoded1 = base64Lookup[data.charCodeAt(i)];
            const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
            const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
            const encoded4 = base64Lookup[data.charCodeAt(i + 3)];
            bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
            p += 1;
            bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            p += 1;
            bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            p += 1;
        }
        return bytes;
    }

    const MAX_HEAP = 16 * 1024;
    const WASM_FUNC_HASH_LENGTH = 4;
    const wasmMutex = new Mutex();
    const wasmModuleCache = new Map();
    function WASMInterface(binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            let wasmInstance = null;
            let memoryView = null;
            let initialized = false;
            if (typeof WebAssembly === 'undefined') {
                throw new Error('WebAssembly is not supported in this environment!');
            }
            const writeMemory = (data, offset = 0) => {
                memoryView.set(data, offset);
            };
            const getMemory = () => memoryView;
            const getExports = () => wasmInstance.exports;
            const setMemorySize = (totalSize) => {
                wasmInstance.exports.Hash_SetMemorySize(totalSize);
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, totalSize);
            };
            const getStateSize = () => {
                const view = new DataView(wasmInstance.exports.memory.buffer);
                const stateSize = view.getUint32(wasmInstance.exports.STATE_SIZE, true);
                return stateSize;
            };
            const loadWASMPromise = wasmMutex.dispatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!wasmModuleCache.has(binary.name)) {
                    const asm = decodeBase64(binary.data);
                    const promise = WebAssembly.compile(asm);
                    wasmModuleCache.set(binary.name, promise);
                }
                const module = yield wasmModuleCache.get(binary.name);
                wasmInstance = yield WebAssembly.instantiate(module, {
                // env: {
                //   emscripten_memcpy_big: (dest, src, num) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     memView.set(memView.subarray(src, src + num), dest);
                //   },
                //   print_memory: (offset, len) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     console.log('print_int32', memView.subarray(offset, offset + len));
                //   },
                // },
                });
                // wasmInstance.exports._start();
            }));
            const setupInterface = () => __awaiter(this, void 0, void 0, function* () {
                if (!wasmInstance) {
                    yield loadWASMPromise;
                }
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
            });
            const init = (bits = null) => {
                initialized = true;
                wasmInstance.exports.Hash_Init(bits);
            };
            const updateUInt8Array = (data) => {
                let read = 0;
                while (read < data.length) {
                    const chunk = data.subarray(read, read + MAX_HEAP);
                    read += chunk.length;
                    memoryView.set(chunk);
                    wasmInstance.exports.Hash_Update(chunk.length);
                }
            };
            const update = (data) => {
                if (!initialized) {
                    throw new Error('update() called before init()');
                }
                const Uint8Buffer = getUInt8Buffer(data);
                updateUInt8Array(Uint8Buffer);
            };
            const digestChars = new Uint8Array(hashLength * 2);
            const digest = (outputType, padding = null) => {
                if (!initialized) {
                    throw new Error('digest() called before init()');
                }
                initialized = false;
                wasmInstance.exports.Hash_Final(padding);
                if (outputType === 'binary') {
                    // the data is copied to allow GC of the original memory object
                    return memoryView.slice(0, hashLength);
                }
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            const save = () => {
                if (!initialized) {
                    throw new Error('save() can only be called after init() and before digest()');
                }
                const stateOffset = wasmInstance.exports.Hash_GetState();
                const stateLength = getStateSize();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                const internalState = new Uint8Array(memoryBuffer, stateOffset, stateLength);
                // prefix is 4 bytes from SHA1 hash of the WASM binary
                // it is used to detect incompatible internal states between different versions of hash-wasm
                const prefixedState = new Uint8Array(WASM_FUNC_HASH_LENGTH + stateLength);
                writeHexToUInt8(prefixedState, binary.hash);
                prefixedState.set(internalState, WASM_FUNC_HASH_LENGTH);
                return prefixedState;
            };
            const load = (state) => {
                if (!(state instanceof Uint8Array)) {
                    throw new Error('load() expects an Uint8Array generated by save()');
                }
                const stateOffset = wasmInstance.exports.Hash_GetState();
                const stateLength = getStateSize();
                const overallLength = WASM_FUNC_HASH_LENGTH + stateLength;
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                if (state.length !== overallLength) {
                    throw new Error(`Bad state length (expected ${overallLength} bytes, got ${state.length})`);
                }
                if (!hexStringEqualsUInt8(binary.hash, state.subarray(0, WASM_FUNC_HASH_LENGTH))) {
                    throw new Error('This state was written by an incompatible hash implementation');
                }
                const internalState = state.subarray(WASM_FUNC_HASH_LENGTH);
                new Uint8Array(memoryBuffer, stateOffset, stateLength).set(internalState);
                initialized = true;
            };
            const isDataShort = (data) => {
                if (typeof data === 'string') {
                    // worst case is 4 bytes / char
                    return data.length < MAX_HEAP / 4;
                }
                return data.byteLength < MAX_HEAP;
            };
            let canSimplify = isDataShort;
            switch (binary.name) {
                case 'argon2':
                case 'scrypt':
                    canSimplify = () => true;
                    break;
                case 'blake2b':
                case 'blake2s':
                    // if there is a key at blake2 then cannot simplify
                    canSimplify = (data, initParam) => initParam <= 512 && isDataShort(data);
                    break;
                case 'blake3':
                    // if there is a key at blake3 then cannot simplify
                    canSimplify = (data, initParam) => initParam === 0 && isDataShort(data);
                    break;
                case 'xxhash64': // cannot simplify
                case 'xxhash3':
                case 'xxhash128':
                    canSimplify = () => false;
                    break;
            }
            // shorthand for (init + update + digest) for better performance
            const calculate = (data, initParam = null, digestParam = null) => {
                if (!canSimplify(data, initParam)) {
                    init(initParam);
                    update(data);
                    return digest('hex', digestParam);
                }
                const buffer = getUInt8Buffer(data);
                memoryView.set(buffer);
                wasmInstance.exports.Hash_Calculate(buffer.length, initParam, digestParam);
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            yield setupInterface();
            return {
                getMemory,
                writeMemory,
                getExports,
                setMemorySize,
                init,
                update,
                digest,
                save,
                load,
                calculate,
                hashLength,
            };
        });
    }

    var name$k = "adler32";
    var data$k = "AGFzbQEAAAABDANgAAF/YAAAYAF/AAMHBgABAgEAAgQFAXABAQEFBAEBAgIGDgJ/AUGAiQULfwBBgAgLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAELSGFzaF9VcGRhdGUAAgpIYXNoX0ZpbmFsAAMNSGFzaF9HZXRTdGF0ZQAEDkhhc2hfQ2FsY3VsYXRlAAUKU1RBVEVfU0laRQMBCoAIBgUAQYAJCwoAQQBBATYChAgL9gYBBn9BACgChAgiAUH//wNxIQIgAUEQdiEDAkACQCAAQQFHDQAgAkEALQCACWoiAUGPgHxqIAEgAUHw/wNLGyIBIANqIgRBEHQiBUGAgDxqIAUgBEHw/wNLGyABciEBDAELAkACQAJAAkACQCAAQRBJDQBBgAkhBiAAQbArSQ0BQYAJIQYDQEEAIQUDQCAGIAVqIgEoAgAiBEH/AXEgAmoiAiADaiACIARBCHZB/wFxaiICaiACIARBEHZB/wFxaiICaiACIARBGHZqIgJqIAIgAUEEaigCACIEQf8BcWoiAmogAiAEQQh2Qf8BcWoiAmogAiAEQRB2Qf8BcWoiAmogAiAEQRh2aiICaiACIAFBCGooAgAiBEH/AXFqIgJqIAIgBEEIdkH/AXFqIgJqIAIgBEEQdkH/AXFqIgJqIAIgBEEYdmoiBGogBCABQQxqKAIAIgFB/wFxaiIEaiAEIAFBCHZB/wFxaiIEaiAEIAFBEHZB/wFxaiIEaiAEIAFBGHZqIgJqIQMgBUEQaiIFQbArRw0ACyADQfH/A3AhAyACQfH/A3AhAiAGQbAraiEGIABB0FRqIgBBrytLDQALIABFDQQgAEEPSw0BDAILAkAgAEUNAEEAIQEDQCACIAFBgAlqLQAAaiICIANqIQMgACABQQFqIgFHDQALCyACQY+AfGogAiACQfD/A0sbIANB8f8DcEEQdHIhAQwECwNAIAYoAgAiAUH/AXEgAmoiBCADaiAEIAFBCHZB/wFxaiIEaiAEIAFBEHZB/wFxaiIEaiAEIAFBGHZqIgRqIAQgBkEEaigCACIBQf8BcWoiBGogBCABQQh2Qf8BcWoiBGogBCABQRB2Qf8BcWoiBGogBCABQRh2aiIEaiAEIAZBCGooAgAiAUH/AXFqIgRqIAQgAUEIdkH/AXFqIgRqIAQgAUEQdkH/AXFqIgRqIAQgAUEYdmoiBGogBCAGQQxqKAIAIgFB/wFxaiIEaiAEIAFBCHZB/wFxaiIEaiAEIAFBEHZB/wFxaiIEaiAEIAFBGHZqIgJqIQMgBkEQaiEGIABBcGoiAEEPSw0ACyAARQ0BCwNAIAIgBi0AAGoiAiADaiEDIAZBAWohBiAAQX9qIgANAAsLIANB8f8DcCEDIAJB8f8DcCECCyACIANBEHRyIQELQQAgATYChAgLMgEBf0EAQQAoAoQIIgBBGHQgAEEIdEGAgPwHcXIgAEEIdkGA/gNxIABBGHZycjYCgAkLBQBBhAgLPABBAEEBNgKECCAAEAJBAEEAKAKECCIAQRh0IABBCHRBgID8B3FyIABBCHZBgP4DcSAAQRh2cnI2AoAJCwsVAgBBgAgLBAQAAAAAQYQICwQBAAAA";
    var hash$k = "321174b4";
    var wasmJson$k = {
    	name: name$k,
    	data: data$k,
    	hash: hash$k
    };

    function lockedCreate(mutex, binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const unlock = yield mutex.lock();
            const wasm = yield WASMInterface(binary, hashLength);
            unlock();
            return wasm;
        });
    }

    const mutex$l = new Mutex();
    let wasmCache$l = null;
    /**
     * Calculates Adler-32 hash. The resulting 32-bit hash is stored in
     * network byte order (big-endian).
     *
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function adler32(data) {
        if (wasmCache$l === null) {
            return lockedCreate(mutex$l, wasmJson$k, 4)
                .then((wasm) => {
                wasmCache$l = wasm;
                return wasmCache$l.calculate(data);
            });
        }
        try {
            const hash = wasmCache$l.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Adler-32 hash instance
     */
    function createAdler32() {
        return WASMInterface(wasmJson$k, 4).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 4,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$j = "blake2b";
    var data$j = "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";
    var hash$j = "68afc9cf";
    var wasmJson$j = {
    	name: name$j,
    	data: data$j,
    	hash: hash$j
    };

    const mutex$k = new Mutex();
    let wasmCache$k = null;
    function validateBits$4(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 512 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 512');
        }
        return null;
    }
    function getInitParam$1(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2b hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2b(data, bits = 512, key = null) {
        if (validateBits$4(bits)) {
            return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$k === null || wasmCache$k.hashLength !== hashLength) {
            return lockedCreate(mutex$k, wasmJson$j, hashLength)
                .then((wasm) => {
                wasmCache$k = wasm;
                if (initParam > 512) {
                    wasmCache$k.writeMemory(keyBuffer);
                }
                return wasmCache$k.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache$k.writeMemory(keyBuffer);
            }
            const hash = wasmCache$k.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2b hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     */
    function createBLAKE2b(bits = 512, key = null) {
        if (validateBits$4(bits)) {
            return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$j, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 128,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$i = "argon2";
    var data$i = "AGFzbQEAAAABKQVgAX8Bf2AAAX9gEH9/f39/f39/f39/f39/f38AYAR/f39/AGACf38AAwYFAAECAwQEBQFwAQEBBQYBAQKAgAIGCAF/AUGQqAQLB0EEBm1lbW9yeQIAEkhhc2hfU2V0TWVtb3J5U2l6ZQAADkhhc2hfR2V0QnVmZmVyAAEOSGFzaF9DYWxjdWxhdGUABArXMwVbAQF/QQAhAQJAIABBACgCgAhrIgBFDQACQCAAQRB2IABBgIB8cSAASWoiAEAAQX9HDQBB/wEhAQwBC0EAIQFBAEEAKQOACCAAQRB0rXw3A4AICyABQRh0QRh1C2oBAn8CQEEAKAKICCIADQBBAD8AQRB0IgA2AogIQYCAIEEAKAKACGsiAUUNAAJAIAFBEHYgAUGAgHxxIAFJaiIAQABBf0cNAEEADwtBAEEAKQOACCAAQRB0rXw3A4AIQQAoAogIIQALIAALnA8BA34gACAEKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwAgASAFKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgAiAGKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAyAHKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgACAFKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgASAGKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAiAHKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgAyAEKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwALhxoBAX9BACEEQQAgAikDACABKQMAhTcDkAhBACACKQMIIAEpAwiFNwOYCEEAIAIpAxAgASkDEIU3A6AIQQAgAikDGCABKQMYhTcDqAhBACACKQMgIAEpAyCFNwOwCEEAIAIpAyggASkDKIU3A7gIQQAgAikDMCABKQMwhTcDwAhBACACKQM4IAEpAziFNwPICEEAIAIpA0AgASkDQIU3A9AIQQAgAikDSCABKQNIhTcD2AhBACACKQNQIAEpA1CFNwPgCEEAIAIpA1ggASkDWIU3A+gIQQAgAikDYCABKQNghTcD8AhBACACKQNoIAEpA2iFNwP4CEEAIAIpA3AgASkDcIU3A4AJQQAgAikDeCABKQN4hTcDiAlBACACKQOAASABKQOAAYU3A5AJQQAgAikDiAEgASkDiAGFNwOYCUEAIAIpA5ABIAEpA5ABhTcDoAlBACACKQOYASABKQOYAYU3A6gJQQAgAikDoAEgASkDoAGFNwOwCUEAIAIpA6gBIAEpA6gBhTcDuAlB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";
    var hash$i = "59aa4fb4";
    var wasmJson$i = {
    	name: name$i,
    	data: data$i,
    	hash: hash$i
    };

    function encodeResult(salt, options, res) {
        const parameters = [
            `m=${options.memorySize}`,
            `t=${options.iterations}`,
            `p=${options.parallelism}`,
        ].join(',');
        return `$argon2${options.hashType}$v=19$${parameters}$${encodeBase64(salt, false)}$${encodeBase64(res, false)}`;
    }
    const uint32View = new DataView(new ArrayBuffer(4));
    function int32LE(x) {
        uint32View.setInt32(0, x, true);
        return new Uint8Array(uint32View.buffer);
    }
    function hashFunc(blake512, buf, len) {
        return __awaiter(this, void 0, void 0, function* () {
            if (len <= 64) {
                const blake = yield createBLAKE2b(len * 8);
                blake.update(int32LE(len));
                blake.update(buf);
                return blake.digest('binary');
            }
            const r = Math.ceil(len / 32) - 2;
            const ret = new Uint8Array(len);
            blake512.init();
            blake512.update(int32LE(len));
            blake512.update(buf);
            let vp = blake512.digest('binary');
            ret.set(vp.subarray(0, 32), 0);
            for (let i = 1; i < r; i++) {
                blake512.init();
                blake512.update(vp);
                vp = blake512.digest('binary');
                ret.set(vp.subarray(0, 32), i * 32);
            }
            const partialBytesNeeded = len - 32 * r;
            let blakeSmall;
            if (partialBytesNeeded === 64) {
                blakeSmall = blake512;
                blakeSmall.init();
            }
            else {
                blakeSmall = yield createBLAKE2b(partialBytesNeeded * 8);
            }
            blakeSmall.update(vp);
            vp = blakeSmall.digest('binary');
            ret.set(vp.subarray(0, partialBytesNeeded), r * 32);
            return ret;
        });
    }
    function getHashType(type) {
        switch (type) {
            case 'd':
                return 0;
            case 'i':
                return 1;
            default:
                return 2;
        }
    }
    function argon2Internal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parallelism, iterations, hashLength } = options;
            const password = getUInt8Buffer(options.password);
            const salt = getUInt8Buffer(options.salt);
            const version = 0x13;
            const hashType = getHashType(options.hashType);
            const { memorySize } = options; // in KB
            const [argon2Interface, blake512] = yield Promise.all([
                WASMInterface(wasmJson$i, 1024),
                createBLAKE2b(512),
            ]);
            // last block is for storing the init vector
            argon2Interface.setMemorySize(memorySize * 1024 + 1024);
            const initVector = new Uint8Array(24);
            const initVectorView = new DataView(initVector.buffer);
            initVectorView.setInt32(0, parallelism, true);
            initVectorView.setInt32(4, hashLength, true);
            initVectorView.setInt32(8, memorySize, true);
            initVectorView.setInt32(12, iterations, true);
            initVectorView.setInt32(16, version, true);
            initVectorView.setInt32(20, hashType, true);
            argon2Interface.writeMemory(initVector, memorySize * 1024);
            blake512.init();
            blake512.update(initVector);
            blake512.update(int32LE(password.length));
            blake512.update(password);
            blake512.update(int32LE(salt.length));
            blake512.update(salt);
            blake512.update(int32LE(0)); // key length + key
            blake512.update(int32LE(0)); // associatedData length + associatedData
            const segments = Math.floor(memorySize / (parallelism * 4)); // length of each lane
            const lanes = segments * 4;
            const param = new Uint8Array(72);
            const H0 = blake512.digest('binary');
            param.set(H0);
            for (let lane = 0; lane < parallelism; lane++) {
                param.set(int32LE(0), 64);
                param.set(int32LE(lane), 68);
                let position = lane * lanes;
                let chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
                position += 1;
                param.set(int32LE(1), 64);
                chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
            }
            const C = new Uint8Array(1024);
            writeHexToUInt8(C, argon2Interface.calculate(new Uint8Array([]), memorySize));
            const res = yield hashFunc(blake512, C, hashLength);
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, res, hashLength);
            }
            if (options.outputType === 'encoded') {
                return encodeResult(salt, options, res);
            }
            // return binary format
            return res;
        });
    }
    const validateOptions$3 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.password) {
            throw new Error('Password must be specified');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password must be specified');
        }
        if (!options.salt) {
            throw new Error('Salt must be specified');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length < 8) {
            throw new Error('Salt should be at least 8 bytes long');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 4) {
            throw new Error('Hash length should be at least 4 bytes.');
        }
        if (!Number.isInteger(options.memorySize)) {
            throw new Error('Memory size should be specified.');
        }
        if (options.memorySize < 8 * options.parallelism) {
            throw new Error('Memory size should be at least 8 * parallelism.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the argon2i password-hashing function
     * @returns Computed hash
     */
    function argon2i(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'i' }));
        });
    }
    /**
     * Calculates hash using the argon2id password-hashing function
     * @returns Computed hash
     */
    function argon2id(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'id' }));
        });
    }
    /**
     * Calculates hash using the argon2d password-hashing function
     * @returns Computed hash
     */
    function argon2d(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'd' }));
        });
    }
    const getHashParameters = (password, encoded) => {
        const regex = /^\$argon2(id|i|d)\$v=([0-9]+)\$((?:[mtp]=[0-9]+,){2}[mtp]=[0-9]+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;
        const match = encoded.match(regex);
        if (!match) {
            throw new Error('Invalid hash');
        }
        const [, hashType, version, parameters, salt, hash] = match;
        if (version !== '19') {
            throw new Error(`Unsupported version: ${version}`);
        }
        const parsedParameters = {};
        const paramMap = { m: 'memorySize', p: 'parallelism', t: 'iterations' };
        parameters.split(',').forEach((x) => {
            const [n, v] = x.split('=');
            parsedParameters[paramMap[n]] = parseInt(v, 10);
        });
        return Object.assign(Object.assign({}, parsedParameters), { password, hashType: hashType, salt: decodeBase64(salt), hashLength: getDecodeBase64Length(hash), outputType: 'encoded' });
    };
    const validateVerifyOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
    };
    /**
     * Verifies password using the argon2 password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function argon2Verify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions$1(options);
            const params = getHashParameters(options.password, options.hash);
            validateOptions$3(params);
            const hashStart = options.hash.lastIndexOf('$') + 1;
            const result = yield argon2Internal(params);
            return result.substring(hashStart) === options.hash.substring(hashStart);
        });
    }

    var name$h = "blake2s";
    var data$h = "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";
    var hash$h = "0f570f49";
    var wasmJson$h = {
    	name: name$h,
    	data: data$h,
    	hash: hash$h
    };

    const mutex$j = new Mutex();
    let wasmCache$j = null;
    function validateBits$3(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 256 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 256');
        }
        return null;
    }
    function getInitParam(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2s hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2s(data, bits = 256, key = null) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$j === null || wasmCache$j.hashLength !== hashLength) {
            return lockedCreate(mutex$j, wasmJson$h, hashLength)
                .then((wasm) => {
                wasmCache$j = wasm;
                if (initParam > 512) {
                    wasmCache$j.writeMemory(keyBuffer);
                }
                return wasmCache$j.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache$j.writeMemory(keyBuffer);
            }
            const hash = wasmCache$j.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2s hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     */
    function createBLAKE2s(bits = 256, key = null) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$h, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$g = "blake3";
    var data$g = "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FWogFCAfc0EZdyIVaiIUIBhqIB0gFHNBEHciFCAlaiIYIBVzQRR3IhVqIhkgFHNBGHciFCAYaiIYaiIdICBzQRR3Ih9qIiA2AgAgACAXICQgHHNBGHciHCAeaiIeIBtzQRl3IhtqIAFqIgEgFmogASAUc0EQdyIBICtqIhQgG3NBFHciFmoiFyABc0EYdyIBNgI4IAAgGCAVc0EZdyIVIC5qIANqIgMgE2ogAyAcc0EQdyIDIAIgImoiAmoiIiAVc0EUdyIVaiITNgIEIAAgASAUaiIBNgIkIAAgAiAFc0EZdyICIBlqICFqIgUgGmogBSAnc0EQdyIFIB5qIhQgAnNBFHciAmoiGjYCCCAAICAgEnNBGHciEiAdaiIhNgIoIAAgEyADc0EYdyIDNgIwIAAgASAWc0EZdzYCECAAIBogBXNBGHciATYCNCAAICEgH3NBGXc2AhQgACABIBRqIgE2AiAgACADICJqIgUgFXNBGXc2AhggACASNgI8IAAgASACc0EZdzYCHCAAIBc2AgwgACAFNgIsC7cDAwR/A34FfyMAQdABayIBJAACQCAAe6ciAkEALQCQigEiA08NACABQShqIQQDQCABQQApA4CJASIANwMAIAFBACkDiIkBIgU3AwggAUEAKQOQiQEiBjcDECABQQApA5iJASIHNwMYIAEgA0EFdCIDQdGJAWoiCCkDADcDKCABIANB2YkBaiIJKQMANwMwIAEgA0HhiQFqIgopAwA3AzggASADQemJAWoiCykDADcDQEEALQCKigEhDCABQcAAOgBoIAEgDEEEciIMOgBpIAFCADcDICABIANB8YkBaikDADcDSCABIANB+YkBaikDADcDUCABIANBgYoBaikDADcDWCABIANBiYoBaikDADcDYCABIAc3A4gBIAEgBjcDgAEgASAFNwN4IAEgADcDcCABQZABaiABQfAAaiAEQcAAQgAgDBADIAsgASkDyAEgASkDqAGFNwMAIAogASkDwAEgASkDoAGFNwMAIAkgASkDuAEgASkDmAGFNwMAIAggASkDsAEgASkDkAGFNwMAQQBBAC0AkIoBQX9qIgM6AJCKASACIANB/wFxIgNJDQALCyABQdABaiQAC/oLBAR/BH4GfwF+IwBB0AJrIgUkAAJAAkAgAUGACEsNAEEAIQYgASEHQQAhCAJAIAFB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IQwDQCABQbABaiABIAsgCUH/AXEgCCACQQhyQf8BcRADIAEgASkD2AEiDSABKQO4AYU3A3ggASABKQPgASIOIAEpA8ABhTcDgAEgASAGIAEpA+gBIg+FNwOoASABIAUgDoU3A6ABIAEgBCANhTcDmAEgASADIAEpA9ABIg2FNwOQASABIA8gASkDyAGFNwOIASAAQcAAIABBwABJGyIQQX9qIQkgASANIAEpA7ABhSINNwNwIA2nIREgCiEHIAwhAgJAA0AgAiAROgAAIAlFDQEgCUF/aiEJIAJBAWohAiAHLQAAIREgB0EBaiEHDAALCyAAIBBrIgBFDQIgDCAQaiEMIAhCAXwhCCABKQMIIQQgASkDACEDIAEpAxghBiABKQMQIQUgAS0AaSECIAEtAGghCQwACwsCQAJAAkBBAC0AiYoBIglBBnRBAEEALQCIigEiDGtGDQAgAUHgAGpBACkDgIoBNwMAIAFB2ABqQQApA/iJATcDACABQdAAakEAKQPwiQE3AwAgAUHIAGpBACkD6IkBNwMAIAFBwABqQQApA+CJATcDACABQThqQQApA9iJATcDACABQTBqQQApA9CJATcDACABQQApA8iJATcDKCABQQApA8CJASIINwMgIAFBACkDuIkBIg03AxggAUEAKQOwiQEiDjcDECABQQApA6iJASIPNwMIIAFBACkDoIkBIgM3AwBBAC0AiooBIQcgAUHuAGogAUG0AWovAQA7AQAgASABKAGwATYBaiABIAw6AGggASAHIAlFckECciIJOgBpDAELIAFB4ABqIAJBfmoiAkEFdCIJQcmKAWopAwA3AwAgAUHYAGogCUHBigFqKQMANwMAIAFB0ABqIAlBuYoBaikDADcDACABQcgAaiAJQbGKAWopAwA3AwBBwAAhDCABQcAAaiAJQamKAWopAwA3AwAgAUE4aiAJQaGKAWopAwA3AwAgAUEwaiAJQZmKAWopAwA3AwBCACEIIAFCADcDICABQQApA5iJASINNwMYIAFBACkDkIkBIg43AxAgAUEAKQOIiQEiDzcDCCABQQApA4CJASIDNwMAIAEgCUGRigFqKQMANwMoQQAtAIqKASEJIAFB7gBqIAFBsAFqQQRqLwEAOwEAIAEgASgBsAE2AWogASAJQQRyIgk6AGkgAUHAADoAaCACRQ0BCyACQX9qIgdBBXQiEUGRigFqKQMAIQQgEUGZigFqKQMAIQUgEUGhigFqKQMAIQYgEUGpigFqKQMAIRIgASANNwOIASABIA43A4ABIAEgDzcDeCABIAM3A3AgAUGwAWogAUHwAGogAUEoaiIQIAwgCCAJQf8BcRADIAFBwAA6AGggASASNwNAIAEgBjcDOCABIAU3AzAgASAENwMoIAFCADcDICABQQApA5iJASIINwMYIAFBACkDkIkBIg03AxAgAUEAKQOIiQEiDjcDCCABQQApA4CJASIPNwMAIAFBAC0AiooBQQRyIgk6AGkgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggAUHuAGogAUGwAWpBBGoiDC8BADsBACABIAEoAbABNgFqIAdFDQAgAUHqAGohESACQQV0QemJAWohAgNAIAJBaGopAwAhAyACQXBqKQMAIQQgAkF4aikDACEFIAIpAwAhBiABIAg3A4gBIAEgDTcDgAEgASAONwN4IAEgDzcDcCABQbABaiABQfAAaiAQQcAAQgAgCUH/AXEQAyABQcAAOgBoIAEgBjcDQCABIAU3AzggASAENwMwIAEgAzcDKCABQgA3AyAgAUEAKQOYiQEiCDcDGCABQQApA5CJASINNwMQIAFBACkDiIkBIg43AwggAUEAKQOAiQEiDzcDACABQQAtAIqKAUEEciIJOgBpIAEgASkD6AEgASkDyAGFNwNgIAEgASkD4AEgASkDwAGFNwNYIAEgASkD2AEgASkDuAGFNwNQIAEgASkD0AEgASkDsAGFNwNIIBFBBGogDC8BADsBACARIAEoAbABNgEAIAJBYGohAiAHQX9qIgcNAAsLIAFB8ABqQQFyIQogAUEoaiELQgAhCEGACSEMQcAAIQIDQCABQbABaiABIAsgAkH/AXEgCCAJQQhyQf8BcRADIAEgASkD2AEiDSABKQO4AYU3A3ggASABKQPgASIOIAEpA8ABhTcDgAEgASABKQPoASIPIAEpA8gBhTcDiAEgASABKQMAIAEpA9ABIgOFNwOQASABIA0gASkDCIU3A5gBIAEgDiABKQMQhTcDoAEgASADIAEpA7ABhSINNwNwIAEgDyABKQMYhTcDqAEgAEHAACAAQcAASRsiEEF/aiECIA2nIREgCiEHIAwhCQJAA0AgCSAROgAAIAJFDQEgAkF/aiECIAlBAWohCSAHLQAAIREgB0EBaiEHDAALCyAAIBBrIgBFDQEgDCAQaiEMIAhCAXwhCCABLQBpIQkgAS0AaCECDAALCyABQfABaiQAC6MCAQR+AkACQCAAQSBGDQBCq7OP/JGjs/DbACEBQv+kuYjFkdqCm38hAkLy5rvjo6f9p6V/IQNC58yn0NbQ67O7fyEEQQAhAAwBC0EAKQOYCSEBQQApA5AJIQJBACkDiAkhA0EAKQOACSEEQRAhAAtBACAAOgCKigFBAEIANwOAigFBAEIANwP4iQFBAEIANwPwiQFBAEIANwPoiQFBAEIANwPgiQFBAEIANwPYiQFBAEIANwPQiQFBAEIANwPIiQFBAEIANwPAiQFBACABNwO4iQFBACACNwOwiQFBACADNwOoiQFBACAENwOgiQFBACABNwOYiQFBACACNwOQiQFBACADNwOIiQFBACAENwOAiQFBAEEAOgCQigFBAEEAOwGIigELBgAgABABCwYAIAAQBgsGAEGAiQELqwIBBH4CQAJAIAFBIEYNAEKrs4/8kaOz8NsAIQNC/6S5iMWR2oKbfyEEQvLmu+Ojp/2npX8hBULnzKfQ1tDrs7t/IQZBACEBDAELQQApA5gJIQNBACkDkAkhBEEAKQOICSEFQQApA4AJIQZBECEBC0EAIAE6AIqKAUEAQgA3A4CKAUEAQgA3A/iJAUEAQgA3A/CJAUEAQgA3A+iJAUEAQgA3A+CJAUEAQgA3A9iJAUEAQgA3A9CJAUEAQgA3A8iJAUEAQgA3A8CJAUEAIAM3A7iJAUEAIAQ3A7CJAUEAIAU3A6iJAUEAIAY3A6CJAUEAIAM3A5iJAUEAIAQ3A5CJAUEAIAU3A4iJAUEAIAY3A4CJAUEAQQA6AJCKAUEAQQA7AYiKASAAEAEgAhAGCwsLAQBBgAgLBHgHAAA=";
    var hash$g = "e8655383";
    var wasmJson$g = {
    	name: name$g,
    	data: data$g,
    	hash: hash$g
    };

    const mutex$i = new Mutex();
    let wasmCache$i = null;
    function validateBits$2(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ...');
        }
        return null;
    }
    /**
     * Calculates BLAKE3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Length should be 32 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake3(data, bits = 256, key = null) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0; // key is empty by default
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length !== 32) {
                return Promise.reject(new Error('Key length must be exactly 32 bytes'));
            }
            initParam = 32;
        }
        const hashLength = bits / 8;
        const digestParam = hashLength;
        if (wasmCache$i === null || wasmCache$i.hashLength !== hashLength) {
            return lockedCreate(mutex$i, wasmJson$g, hashLength)
                .then((wasm) => {
                wasmCache$i = wasm;
                if (initParam === 32) {
                    wasmCache$i.writeMemory(keyBuffer);
                }
                return wasmCache$i.calculate(data, initParam, digestParam);
            });
        }
        try {
            if (initParam === 32) {
                wasmCache$i.writeMemory(keyBuffer);
            }
            const hash = wasmCache$i.calculate(data, initParam, digestParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE3 hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Length should be 32 bytes.
     */
    function createBLAKE3(bits = 256, key = null) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0; // key is empty by default
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length !== 32) {
                return Promise.reject(new Error('Key length must be exactly 32 bytes'));
            }
            initParam = 32;
        }
        const outputSize = bits / 8;
        const digestParam = outputSize;
        return WASMInterface(wasmJson$g, outputSize).then((wasm) => {
            if (initParam === 32) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam === 32
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, digestParam),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$f = "crc32";
    var data$f = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwQFAXABAQEFBAEBAgIGDgJ/AUGQyQULfwBBgAgLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAILSGFzaF9VcGRhdGUAAwpIYXNoX0ZpbmFsAAQNSGFzaF9HZXRTdGF0ZQAFDkhhc2hfQ2FsY3VsYXRlAAYKU1RBVEVfU0laRQMBCq0HBwUAQYAJC8MDAQN/QYCJASEBQQAhAgNAIAFBAEEAQQBBAEEAQQBBAEEAIAJBAXFrIABxIAJBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzIgNBAXFrIABxIANBAXZzNgIAIAFBBGohASACQQFqIgJBgAJHDQALQQAhAANAIABBhJEBaiAAQYSJAWooAgAiAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhJkBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEoQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYSpAWogAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhLEBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEuQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYTBAWogAkH/AXFBAnRBgIkBaigCACACQQh2czYCACAAQQRqIgBB/AdHDQALCycAAkBBACgCgMkBIABGDQAgABABQQAgADYCgMkBC0EAQQA2AoTJAQuhAgEDf0EAKAKEyQFBf3MhAUGACSECAkAgAEEISQ0AQYAJIQIDQCACQQRqKAIAIgNBDnZB/AdxQYCRAWooAgAgA0EWdkH8B3FBgIkBaigCAHMgA0EGdkH8B3FBgJkBaigCAHMgA0H/AXFBAnRBgKEBaigCAHMgAigCACABcyIBQRZ2QfwHcUGAqQFqKAIAcyABQQ52QfwHcUGAsQFqKAIAcyABQQZ2QfwHcUGAuQFqKAIAcyABQf8BcUECdEGAwQFqKAIAcyEBIAJBCGohAiAAQXhqIgBBB0sNAAsLAkAgAEUNAANAIAFB/wFxIAItAABzQQJ0QYCJAWooAgAgAUEIdnMhASACQQFqIQIgAEF/aiIADQALC0EAIAFBf3M2AoTJAQszAQF/QQBBACgChMkBIgBBGHQgAEEIdEGAgPwHcXIgAEEIdkGA/gNxIABBGHZycjYCgAkLBgBBhMkBC1oAAkBBACgCgMkBIAFGDQAgARABQQAgATYCgMkBC0EAQQA2AoTJASAAEANBAEEAKAKEyQEiAUEYdCABQQh0QYCA/AdxciABQQh2QYD+A3EgAUEYdnJyNgKACQsLCwEAQYAICwQEAAAA";
    var hash$f = "749723dc";
    var wasmJson$f = {
    	name: name$f,
    	data: data$f,
    	hash: hash$f
    };

    const mutex$h = new Mutex();
    let wasmCache$h = null;
    /**
     * Calculates CRC-32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function crc32(data) {
        if (wasmCache$h === null) {
            return lockedCreate(mutex$h, wasmJson$f, 4)
                .then((wasm) => {
                wasmCache$h = wasm;
                return wasmCache$h.calculate(data, 0xEDB88320);
            });
        }
        try {
            const hash = wasmCache$h.calculate(data, 0xEDB88320);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new CRC-32 hash instance
     */
    function createCRC32() {
        return WASMInterface(wasmJson$f, 4).then((wasm) => {
            wasm.init(0xEDB88320);
            const obj = {
                init: () => { wasm.init(0xEDB88320); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 4,
                digestSize: 4,
            };
            return obj;
        });
    }

    const mutex$g = new Mutex();
    let wasmCache$g = null;
    /**
     * Calculates CRC-32C hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function crc32c(data) {
        if (wasmCache$g === null) {
            return lockedCreate(mutex$g, wasmJson$f, 4)
                .then((wasm) => {
                wasmCache$g = wasm;
                return wasmCache$g.calculate(data, 0x82F63B78);
            });
        }
        try {
            const hash = wasmCache$g.calculate(data, 0x82F63B78);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new CRC-32C hash instance
     */
    function createCRC32C() {
        return WASMInterface(wasmJson$f, 4).then((wasm) => {
            wasm.init(0x82F63B78);
            const obj = {
                init: () => { wasm.init(0x82F63B78); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 4,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$e = "md4";
    var data$e = "AGFzbQEAAAABEgRgAAF/YAAAYAF/AGACf38BfwMIBwABAgMBAAIEBQFwAQEBBQQBAQICBg4CfwFBoIoFC38AQYAICwdwCAZtZW1vcnkCAA5IYXNoX0dldEJ1ZmZlcgAACUhhc2hfSW5pdAABC0hhc2hfVXBkYXRlAAIKSGFzaF9GaW5hbAAEDUhhc2hfR2V0U3RhdGUABQ5IYXNoX0NhbGN1bGF0ZQAGClNUQVRFX1NJWkUDAQqXEQcFAEGACQstAEEAQv6568XpjpWZEDcCkIkBQQBCgcaUupbx6uZvNwKIiQFBAEIANwKAiQEL6AIBA39BAEEAKAKAiQEiASAAakH/////AXEiAjYCgIkBQQAoAoSJASEDAkAgAiABTw0AQQAgA0EBaiIDNgKEiQELQQAgAyAAQR12ajYChIkBAkACQAJAAkACQAJAIAFBP3EiAw0AQYAJIQIMAQtBwAAgA2siAiAASw0BIANBGGohA0EAIQEDQCADIAFqQYCJAWogAUGACWotAAA6AAAgAyABQQFqIgFqQdgARw0AC0GYiQFBwAAQAxogACACayEAIAJBgAlqIQILIABBwABPDQEgACEDDAILIABFDQJBACEBIANBmIkBakEALQCACToAACAAQQFGDQIgA0GZiQFqIQMgAEF/aiECA0AgAyABaiABQYEJai0AADoAACACIAFBAWoiAUcNAAwDCwsgAEE/cSEDIAIgAEFAcRADIQILIANFDQBBACEBA0AgAUGYiQFqIAIgAWotAAA6AAAgAyABQQFqIgFHDQALCwuYCwEXf0EAKAKUiQEhAkEAKAKQiQEhA0EAKAKMiQEhBEEAKAKIiQEhBQNAIABBHGooAgAiBiAAQRRqKAIAIgcgAEEYaigCACIIIABBEGooAgAiCSAAQSxqKAIAIgogAEEoaigCACILIABBJGooAgAiDCAAQSBqKAIAIg0gCyAIIABBCGooAgAiDiADaiAAQQRqKAIAIg8gAmogBCADIAJzcSACcyAFaiAAKAIAIhBqQQN3IhEgBCADc3EgA3NqQQd3IhIgESAEc3EgBHNqQQt3IhNqIBIgB2ogESAJaiAAQQxqKAIAIhQgBGogEyASIBFzcSARc2pBE3ciESATIBJzcSASc2pBA3ciEiARIBNzcSATc2pBB3ciEyASIBFzcSARc2pBC3ciFWogEyAMaiASIA1qIBEgBmogFSATIBJzcSASc2pBE3ciESAVIBNzcSATc2pBA3ciEiARIBVzcSAVc2pBB3ciEyASIBFzcSARc2pBC3ciFSAAQThqKAIAIhZqIBMgAEE0aigCACIXaiASIABBMGooAgAiGGogESAKaiAVIBMgEnNxIBJzakETdyISIBUgE3NxIBNzakEDdyITIBIgFXNxIBVzakEHdyIVIBMgEnNxIBJzakELdyIRaiAJIBVqIBAgE2ogEiAAQTxqKAIAIglqIBEgFSATc3EgE3NqQRN3IhIgESAVcnEgESAVcXJqQZnzidQFakEDdyITIBIgEXJxIBIgEXFyakGZ84nUBWpBBXciESATIBJycSATIBJxcmpBmfOJ1AVqQQl3IhVqIAcgEWogDyATaiAYIBJqIBUgESATcnEgESATcXJqQZnzidQFakENdyISIBUgEXJxIBUgEXFyakGZ84nUBWpBA3ciESASIBVycSASIBVxcmpBmfOJ1AVqQQV3IhMgESAScnEgESAScXJqQZnzidQFakEJdyIVaiAIIBNqIA4gEWogFyASaiAVIBMgEXJxIBMgEXFyakGZ84nUBWpBDXciESAVIBNycSAVIBNxcmpBmfOJ1AVqQQN3IhIgESAVcnEgESAVcXJqQZnzidQFakEFdyITIBIgEXJxIBIgEXFyakGZ84nUBWpBCXciFWogBiATaiAUIBJqIBYgEWogFSATIBJycSATIBJxcmpBmfOJ1AVqQQ13IhEgFSATcnEgFSATcXJqQZnzidQFakEDdyISIBEgFXJxIBEgFXFyakGZ84nUBWpBBXciEyASIBFycSASIBFxcmpBmfOJ1AVqQQl3IhVqIBAgEmogCSARaiAVIBMgEnJxIBMgEnFyakGZ84nUBWpBDXciBiAVcyISIBNzakGh1+f2BmpBA3ciESAGcyANIBNqIBIgEXNqQaHX5/YGakEJdyISc2pBodfn9gZqQQt3IhNqIA4gEWogEyAScyAYIAZqIBIgEXMgE3NqQaHX5/YGakEPdyIRc2pBodfn9gZqQQN3IhUgEXMgCyASaiARIBNzIBVzakGh1+f2BmpBCXciEnNqQaHX5/YGakELdyITaiAPIBVqIBMgEnMgFiARaiASIBVzIBNzakGh1+f2BmpBD3ciEXNqQaHX5/YGakEDdyIVIBFzIAwgEmogESATcyAVc2pBodfn9gZqQQl3IhJzakGh1+f2BmpBC3ciE2ogFCAVaiATIBJzIBcgEWogEiAVcyATc2pBodfn9gZqQQ93IhFzakGh1+f2BmpBA3ciFSARcyAKIBJqIBEgE3MgFXNqQaHX5/YGakEJdyISc2pBodfn9gZqQQt3IhMgA2ohAyAJIBFqIBIgFXMgE3NqQaHX5/YGakEPdyAEaiEEIBIgAmohAiAVIAVqIQUgAEHAAGohACABQUBqIgENAAtBACACNgKUiQFBACADNgKQiQFBACAENgKMiQFBACAFNgKIiQEgAAuhAgEDf0EAKAKAiQEiAEE/cSIBQZiJAWpBgAE6AAACQAJAAkAgAUE/cyICQQdLDQACQCACRQ0AIAFBmYkBaiEAA0AgAEEAOgAAIABBAWohACACQX9qIgINAAsLQcAAIQJBmIkBQcAAEAMaQQAhAAwBCyACQQhGDQEgAUEBaiEACyAAQY+JAWohAQNAIAEgAmpBADoAACACQXdqIQAgAkF/aiECIABBAEoNAAtBACgCgIkBIQALQQAgAEEVdjoA04kBQQAgAEENdjoA0okBQQAgAEEFdjoA0YkBQQAgAEEDdCICOgDQiQFBACACNgKAiQFBAEEAKAKEiQE2AtSJAUGYiQFBwAAQAxpBAEEAKQKIiQE3A4AJQQBBACkCkIkBNwOICQsGAEGAiQELMwBBAEL+uevF6Y6VmRA3ApCJAUEAQoHGlLqW8ermbzcCiIkBQQBCADcCgIkBIAAQAhAECwsLAQBBgAgLBJgAAAA=";
    var hash$e = "1bf01052";
    var wasmJson$e = {
    	name: name$e,
    	data: data$e,
    	hash: hash$e
    };

    const mutex$f = new Mutex();
    let wasmCache$f = null;
    /**
     * Calculates MD4 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md4(data) {
        if (wasmCache$f === null) {
            return lockedCreate(mutex$f, wasmJson$e, 16)
                .then((wasm) => {
                wasmCache$f = wasm;
                return wasmCache$f.calculate(data);
            });
        }
        try {
            const hash = wasmCache$f.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD4 hash instance
     */
    function createMD4() {
        return WASMInterface(wasmJson$e, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$d = "md5";
    var data$d = "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";
    var hash$d = "9b0fac7d";
    var wasmJson$d = {
    	name: name$d,
    	data: data$d,
    	hash: hash$d
    };

    const mutex$e = new Mutex();
    let wasmCache$e = null;
    /**
     * Calculates MD5 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md5(data) {
        if (wasmCache$e === null) {
            return lockedCreate(mutex$e, wasmJson$d, 16)
                .then((wasm) => {
                wasmCache$e = wasm;
                return wasmCache$e.calculate(data);
            });
        }
        try {
            const hash = wasmCache$e.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD5 hash instance
     */
    function createMD5() {
        return WASMInterface(wasmJson$d, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$c = "sha1";
    var data$c = "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";
    var hash$c = "40d92e5d";
    var wasmJson$c = {
    	name: name$c,
    	data: data$c,
    	hash: hash$c
    };

    const mutex$d = new Mutex();
    let wasmCache$d = null;
    /**
     * Calculates SHA-1 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha1(data) {
        if (wasmCache$d === null) {
            return lockedCreate(mutex$d, wasmJson$c, 20)
                .then((wasm) => {
                wasmCache$d = wasm;
                return wasmCache$d.calculate(data);
            });
        }
        try {
            const hash = wasmCache$d.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-1 hash instance
     */
    function createSHA1() {
        return WASMInterface(wasmJson$c, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    var name$b = "sha3";
    var data$b = "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";
    var hash$b = "ec266d91";
    var wasmJson$b = {
    	name: name$b,
    	data: data$b,
    	hash: hash$b
    };

    const mutex$c = new Mutex();
    let wasmCache$c = null;
    function validateBits$1(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates SHA-3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function sha3(data, bits = 512) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$c === null || wasmCache$c.hashLength !== hashLength) {
            return lockedCreate(mutex$c, wasmJson$b, hashLength)
                .then((wasm) => {
                wasmCache$c = wasm;
                return wasmCache$c.calculate(data, bits, 0x06);
            });
        }
        try {
            const hash = wasmCache$c.calculate(data, bits, 0x06);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-3 hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createSHA3(bits = 512) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$b, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x06),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    const mutex$b = new Mutex();
    let wasmCache$b = null;
    function validateBits(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates Keccak hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function keccak(data, bits = 512) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$b === null || wasmCache$b.hashLength !== hashLength) {
            return lockedCreate(mutex$b, wasmJson$b, hashLength)
                .then((wasm) => {
                wasmCache$b = wasm;
                return wasmCache$b.calculate(data, bits, 0x01);
            });
        }
        try {
            const hash = wasmCache$b.calculate(data, bits, 0x01);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Keccak hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createKeccak(bits = 512) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$b, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x01),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$a = "sha256";
    var data$a = "AGFzbQEAAAABEQRgAAF/YAF/AGACf38AYAAAAwgHAAEBAgMAAgQFAXABAQEFBAEBAgIGDgJ/AUHwiQULfwBBgAgLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAELSGFzaF9VcGRhdGUAAgpIYXNoX0ZpbmFsAAQNSGFzaF9HZXRTdGF0ZQAFDkhhc2hfQ2FsY3VsYXRlAAYKU1RBVEVfU0laRQMBCuJIBwUAQYAJC50BAEEAQgA3A8CJAUEAQRxBICAAQeABRiIAGzYC6IkBQQBCp5/mp8b0k/2+f0Krs4/8kaOz8NsAIAAbNwPgiQFBAEKxloD+n6KFrOgAQv+kuYjFkdqCm38gABs3A9iJAUEAQpe6w4OTp5aHd0Ly5rvjo6f9p6V/IAAbNwPQiQFBAELYvZaI/KC1vjZC58yn0NbQ67O7fyAAGzcDyIkBC4ACAgF+Bn9BAEEAKQPAiQEiASAArXw3A8CJAQJAAkACQCABp0E/cSICDQBBgAkhAgwBCwJAIABBwAAgAmsiAyADIABLIgQbIgVFDQAgAkGAiQFqIQZBACECQQAhBwNAIAYgAmogAkGACWotAAA6AAAgBSAHQQFqIgdB/wFxIgJLDQALCyAEDQFByIkBQYCJARADIAAgA2shACADQYAJaiECCwJAIABBwABJDQADQEHIiQEgAhADIAJBwABqIQIgAEFAaiIAQT9LDQALCyAARQ0AQQAhB0EAIQUDQCAHQYCJAWogAiAHai0AADoAACAAIAVBAWoiBUH/AXEiB0sNAAsLC5M+AUV/IAAgASgCPCICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnIiAkEOdyACQQN2cyACQRl3cyABKAI4IgNBGHQgA0EIdEGAgPwHcXIgA0EIdkGA/gNxIANBGHZyciIDaiABKAIgIgRBGHQgBEEIdEGAgPwHcXIgBEEIdkGA/gNxIARBGHZyciIFQQ53IAVBA3ZzIAVBGXdzIAEoAhwiBEEYdCAEQQh0QYCA/AdxciAEQQh2QYD+A3EgBEEYdnJyIgZqIAEoAgQiBEEYdCAEQQh0QYCA/AdxciAEQQh2QYD+A3EgBEEYdnJyIgdBDncgB0EDdnMgB0EZd3MgASgCACIEQRh0IARBCHRBgID8B3FyIARBCHZBgP4DcSAEQRh2cnIiCGogASgCJCIEQRh0IARBCHRBgID8B3FyIARBCHZBgP4DcSAEQRh2cnIiCWogA0ENdyADQQp2cyADQQ93c2oiBGogASgCGCIKQRh0IApBCHRBgID8B3FyIApBCHZBgP4DcSAKQRh2cnIiC0EOdyALQQN2cyALQRl3cyABKAIUIgpBGHQgCkEIdEGAgPwHcXIgCkEIdkGA/gNxIApBGHZyciIMaiADaiABKAIQIgpBGHQgCkEIdEGAgPwHcXIgCkEIdkGA/gNxIApBGHZyciINQQ53IA1BA3ZzIA1BGXdzIAEoAgwiCkEYdCAKQQh0QYCA/AdxciAKQQh2QYD+A3EgCkEYdnJyIg5qIAEoAjAiCkEYdCAKQQh0QYCA/AdxciAKQQh2QYD+A3EgCkEYdnJyIg9qIAEoAggiCkEYdCAKQQh0QYCA/AdxciAKQQh2QYD+A3EgCkEYdnJyIhBBDncgEEEDdnMgEEEZd3MgB2ogASgCKCIKQRh0IApBCHRBgID8B3FyIApBCHZBgP4DcSAKQRh2cnIiEWogAkENdyACQQp2cyACQQ93c2oiCkENdyAKQQp2cyAKQQ93c2oiEkENdyASQQp2cyASQQ93c2oiE0ENdyATQQp2cyATQQ93c2oiFGogASgCNCIVQRh0IBVBCHRBgID8B3FyIBVBCHZBgP4DcSAVQRh2cnIiFkEOdyAWQQN2cyAWQRl3cyAPaiATaiABKAIsIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZyciIXQQ53IBdBA3ZzIBdBGXdzIBFqIBJqIAlBDncgCUEDdnMgCUEZd3MgBWogCmogBkEOdyAGQQN2cyAGQRl3cyALaiACaiAMQQ53IAxBA3ZzIAxBGXdzIA1qIBZqIA5BDncgDkEDdnMgDkEZd3MgEGogF2ogBEENdyAEQQp2cyAEQQ93c2oiFUENdyAVQQp2cyAVQQ93c2oiGEENdyAYQQp2cyAYQQ93c2oiGUENdyAZQQp2cyAZQQ93c2oiGkENdyAaQQp2cyAaQQ93c2oiG0ENdyAbQQp2cyAbQQ93c2oiHEENdyAcQQp2cyAcQQ93c2oiHUEOdyAdQQN2cyAdQRl3cyADQQ53IANBA3ZzIANBGXdzIBZqIBlqIA9BDncgD0EDdnMgD0EZd3MgF2ogGGogEUEOdyARQQN2cyARQRl3cyAJaiAVaiAUQQ13IBRBCnZzIBRBD3dzaiIeQQ13IB5BCnZzIB5BD3dzaiIfQQ13IB9BCnZzIB9BD3dzaiIgaiAUQQ53IBRBA3ZzIBRBGXdzIBlqIARBDncgBEEDdnMgBEEZd3MgAmogGmogIEENdyAgQQp2cyAgQQ93c2oiIWogE0EOdyATQQN2cyATQRl3cyAYaiAgaiASQQ53IBJBA3ZzIBJBGXdzIBVqIB9qIApBDncgCkEDdnMgCkEZd3MgBGogHmogHUENdyAdQQp2cyAdQQ93c2oiIkENdyAiQQp2cyAiQQ93c2oiI0ENdyAjQQp2cyAjQQ93c2oiJEENdyAkQQp2cyAkQQ93c2oiJWogHEEOdyAcQQN2cyAcQRl3cyAfaiAkaiAbQQ53IBtBA3ZzIBtBGXdzIB5qICNqIBpBDncgGkEDdnMgGkEZd3MgFGogImogGUEOdyAZQQN2cyAZQRl3cyATaiAdaiAYQQ53IBhBA3ZzIBhBGXdzIBJqIBxqIBVBDncgFUEDdnMgFUEZd3MgCmogG2ogIUENdyAhQQp2cyAhQQ93c2oiJkENdyAmQQp2cyAmQQ93c2oiJ0ENdyAnQQp2cyAnQQ93c2oiKEENdyAoQQp2cyAoQQ93c2oiKUENdyApQQp2cyApQQ93c2oiKkENdyAqQQp2cyAqQQ93c2oiK0ENdyArQQp2cyArQQ93c2oiLEEOdyAsQQN2cyAsQRl3cyAgQQ53ICBBA3ZzICBBGXdzIBxqIChqIB9BDncgH0EDdnMgH0EZd3MgG2ogJ2ogHkEOdyAeQQN2cyAeQRl3cyAaaiAmaiAlQQ13ICVBCnZzICVBD3dzaiItQQ13IC1BCnZzIC1BD3dzaiIuQQ13IC5BCnZzIC5BD3dzaiIvaiAlQQ53ICVBA3ZzICVBGXdzIChqICFBDncgIUEDdnMgIUEZd3MgHWogKWogL0ENdyAvQQp2cyAvQQ93c2oiMGogJEEOdyAkQQN2cyAkQRl3cyAnaiAvaiAjQQ53ICNBA3ZzICNBGXdzICZqIC5qICJBDncgIkEDdnMgIkEZd3MgIWogLWogLEENdyAsQQp2cyAsQQ93c2oiMUENdyAxQQp2cyAxQQ93c2oiMkENdyAyQQp2cyAyQQ93c2oiM0ENdyAzQQp2cyAzQQ93c2oiNGogK0EOdyArQQN2cyArQRl3cyAuaiAzaiAqQQ53ICpBA3ZzICpBGXdzIC1qIDJqIClBDncgKUEDdnMgKUEZd3MgJWogMWogKEEOdyAoQQN2cyAoQRl3cyAkaiAsaiAnQQ53ICdBA3ZzICdBGXdzICNqICtqICZBDncgJkEDdnMgJkEZd3MgImogKmogMEENdyAwQQp2cyAwQQ93c2oiNUENdyA1QQp2cyA1QQ93c2oiNkENdyA2QQp2cyA2QQ93c2oiN0ENdyA3QQp2cyA3QQ93c2oiOEENdyA4QQp2cyA4QQ93c2oiOUENdyA5QQp2cyA5QQ93c2oiOkENdyA6QQp2cyA6QQ93c2oiOyA5IDEgKyApICcgISAfIBQgEiACIBcgBiAAKAIQIjwgDmogACgCFCI9IBBqIAAoAhgiPiAHaiAAKAIcIj8gPEEadyA8QRV3cyA8QQd3c2ogPiA9cyA8cSA+c2ogCGpBmN+olARqIkAgACgCDCJBaiIHID0gPHNxID1zaiAHQRp3IAdBFXdzIAdBB3dzakGRid2JB2oiQiAAKAIIIkNqIg4gByA8c3EgPHNqIA5BGncgDkEVd3MgDkEHd3NqQc/3g657aiJEIAAoAgQiRWoiECAOIAdzcSAHc2ogEEEadyAQQRV3cyAQQQd3c2pBpbfXzX5qIkYgACgCACIBaiIIaiALIBBqIAwgDmogByANaiAIIBAgDnNxIA5zaiAIQRp3IAhBFXdzIAhBB3dzakHbhNvKA2oiDSBDIEUgAXNxIEUgAXFzIAFBHncgAUETd3MgAUEKd3NqIEBqIgdqIgYgCCAQc3EgEHNqIAZBGncgBkEVd3MgBkEHd3NqQfGjxM8FaiJAIAdBHncgB0ETd3MgB0EKd3MgByABcyBFcSAHIAFxc2ogQmoiDmoiCyAGIAhzcSAIc2ogC0EadyALQRV3cyALQQd3c2pBpIX+kXlqIkIgDkEedyAOQRN3cyAOQQp3cyAOIAdzIAFxIA4gB3FzaiBEaiIQaiIIIAsgBnNxIAZzaiAIQRp3IAhBFXdzIAhBB3dzakHVvfHYemoiRCAQQR53IBBBE3dzIBBBCndzIBAgDnMgB3EgECAOcXNqIEZqIgdqIgxqIBEgCGogCSALaiAFIAZqIAwgCCALc3EgC3NqIAxBGncgDEEVd3MgDEEHd3NqQZjVnsB9aiIJIAdBHncgB0ETd3MgB0EKd3MgByAQcyAOcSAHIBBxc2ogDWoiDmoiBiAMIAhzcSAIc2ogBkEadyAGQRV3cyAGQQd3c2pBgbaNlAFqIhEgDkEedyAOQRN3cyAOQQp3cyAOIAdzIBBxIA4gB3FzaiBAaiIQaiIIIAYgDHNxIAxzaiAIQRp3IAhBFXdzIAhBB3dzakG+i8ahAmoiFyAQQR53IBBBE3dzIBBBCndzIBAgDnMgB3EgECAOcXNqIEJqIgdqIgsgCCAGc3EgBnNqIAtBGncgC0EVd3MgC0EHd3NqQcP7sagFaiIFIAdBHncgB0ETd3MgB0EKd3MgByAQcyAOcSAHIBBxc2ogRGoiDmoiDGogAyALaiAWIAhqIA8gBmogDCALIAhzcSAIc2ogDEEadyAMQRV3cyAMQQd3c2pB9Lr5lQdqIg8gDkEedyAOQRN3cyAOQQp3cyAOIAdzIBBxIA4gB3FzaiAJaiICaiIQIAwgC3NxIAtzaiAQQRp3IBBBFXdzIBBBB3dzakH+4/qGeGoiCyACQR53IAJBE3dzIAJBCndzIAIgDnMgB3EgAiAOcXNqIBFqIgNqIgggECAMc3EgDHNqIAhBGncgCEEVd3MgCEEHd3NqQaeN8N55aiIMIANBHncgA0ETd3MgA0EKd3MgAyACcyAOcSADIAJxc2ogF2oiB2oiDiAIIBBzcSAQc2ogDkEadyAOQRV3cyAOQQd3c2pB9OLvjHxqIgkgB0EedyAHQRN3cyAHQQp3cyAHIANzIAJxIAcgA3FzaiAFaiICaiIGaiAVIA5qIAogCGogBiAOIAhzcSAIcyAQaiAEaiAGQRp3IAZBFXdzIAZBB3dzakHB0+2kfmoiECACQR53IAJBE3dzIAJBCndzIAIgB3MgA3EgAiAHcXNqIA9qIgNqIgogBiAOc3EgDnNqIApBGncgCkEVd3MgCkEHd3NqQYaP+f1+aiIOIANBHncgA0ETd3MgA0EKd3MgAyACcyAHcSADIAJxc2ogC2oiBGoiEiAKIAZzcSAGc2ogEkEadyASQRV3cyASQQd3c2pBxruG/gBqIgggBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAMaiICaiIVIBIgCnNxIApzaiAVQRp3IBVBFXdzIBVBB3dzakHMw7KgAmoiBiACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIAlqIgNqIgdqIBkgFWogEyASaiAKIBhqIAcgFSASc3EgEnNqIAdBGncgB0EVd3MgB0EHd3NqQe/YpO8CaiIYIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogEGoiBGoiCiAHIBVzcSAVc2ogCkEadyAKQRV3cyAKQQd3c2pBqonS0wRqIhUgBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAOaiICaiISIAogB3NxIAdzaiASQRp3IBJBFXdzIBJBB3dzakHc08LlBWoiGSACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIAhqIgNqIhMgEiAKc3EgCnNqIBNBGncgE0EVd3MgE0EHd3NqQdqR5rcHaiIHIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogBmoiBGoiFGogGyATaiAeIBJqIBogCmogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pB0qL5wXlqIhogBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAYaiICaiIKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakHtjMfBemoiGCACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBVqIgNqIhIgCiAUc3EgFHNqIBJBGncgEkEVd3MgEkEHd3NqQcjPjIB7aiIVIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogGWoiBGoiEyASIApzcSAKc2ogE0EadyATQRV3cyATQQd3c2pBx//l+ntqIhkgBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAHaiICaiIUaiAdIBNqICAgEmogHCAKaiAUIBMgEnNxIBJzaiAUQRp3IBRBFXdzIBRBB3dzakHzl4C3fGoiGyACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBpqIgNqIgogFCATc3EgE3NqIApBGncgCkEVd3MgCkEHd3NqQceinq19aiIaIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogGGoiBGoiEiAKIBRzcSAUc2ogEkEadyASQRV3cyASQQd3c2pB0capNmoiGCAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBVqIgJqIhMgEiAKc3EgCnNqIBNBGncgE0EVd3MgE0EHd3NqQefSpKEBaiIVIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogGWoiA2oiFGogIyATaiAmIBJqIBQgEyASc3EgEnMgCmogImogFEEadyAUQRV3cyAUQQd3c2pBhZXcvQJqIhkgA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAbaiIEaiIKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakG4wuzwAmoiGyAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBpqIgJqIhIgCiAUc3EgFHNqIBJBGncgEkEVd3MgEkEHd3NqQfzbsekEaiIaIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogGGoiA2oiEyASIApzcSAKc2ogE0EadyATQRV3cyATQQd3c2pBk5rgmQVqIhggA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAVaiIEaiIUaiAlIBNqICggEmogCiAkaiAUIBMgEnNxIBJzaiAUQRp3IBRBFXdzIBRBB3dzakHU5qmoBmoiFSAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBlqIgJqIgogFCATc3EgE3NqIApBGncgCkEVd3MgCkEHd3NqQbuVqLMHaiIZIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogG2oiA2oiEiAKIBRzcSAUc2ogEkEadyASQRV3cyASQQd3c2pBrpKLjnhqIhsgA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAaaiIEaiITIBIgCnNxIApzaiATQRp3IBNBFXdzIBNBB3dzakGF2ciTeWoiGiAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBhqIgJqIhRqIC4gE2ogKiASaiAtIApqIBQgEyASc3EgEnNqIBRBGncgFEEVd3MgFEEHd3NqQaHR/5V6aiIYIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogFWoiA2oiCiAUIBNzcSATc2ogCkEadyAKQRV3cyAKQQd3c2pBy8zpwHpqIhUgA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAZaiIEaiISIAogFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakHwlq6SfGoiGSAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBtqIgJqIhMgEiAKc3EgCnNqIBNBGncgE0EVd3MgE0EHd3NqQaOjsbt8aiIbIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogGmoiA2oiFGogMCATaiAsIBJqIC8gCmogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pBmdDLjH1qIhogA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAYaiIEaiIKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakGkjOS0fWoiGCAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBVqIgJqIhIgCiAUc3EgFHNqIBJBGncgEkEVd3MgEkEHd3NqQYXruKB/aiIVIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogGWoiA2oiEyASIApzcSAKc2ogE0EadyATQRV3cyATQQd3c2pB8MCqgwFqIhkgA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAbaiIEaiIUIBMgEnNxIBJzIApqIDVqIBRBGncgFEEVd3MgFEEHd3NqQZaCk80BaiIbIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGmoiAmoiCiA3aiAzIBRqIDYgE2ogMiASaiAKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakGI2N3xAWoiGiACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBhqIgNqIhIgCiAUc3EgFHNqIBJBGncgEkEVd3MgEkEHd3NqQczuoboCaiIcIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogFWoiBGoiEyASIApzcSAKc2ogE0EadyATQRV3cyATQQd3c2pBtfnCpQNqIhUgBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAZaiICaiIKIBMgEnNxIBJzaiAKQRp3IApBFXdzIApBB3dzakGzmfDIA2oiGSACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBtqIgNqIhRqIC1BDncgLUEDdnMgLUEZd3MgKWogNWogNEENdyA0QQp2cyA0QQ93c2oiGCAKaiA4IBNqIDQgEmogFCAKIBNzcSATc2ogFEEadyAUQRV3cyAUQQd3c2pBytTi9gRqIhsgA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAaaiIEaiISIBQgCnNxIApzaiASQRp3IBJBFXdzIBJBB3dzakHPlPPcBWoiGiAEQR53IARBE3dzIARBCndzIAQgA3MgAnEgBCADcXNqIBxqIgJqIgogEiAUc3EgFHNqIApBGncgCkEVd3MgCkEHd3NqQfPfucEGaiIcIAJBHncgAkETd3MgAkEKd3MgAiAEcyADcSACIARxc2ogFWoiA2oiEyAKIBJzcSASc2ogE0EadyATQRV3cyATQQd3c2pB7oW+pAdqIh0gA0EedyADQRN3cyADQQp3cyADIAJzIARxIAMgAnFzaiAZaiIEaiIUaiAvQQ53IC9BA3ZzIC9BGXdzICtqIDdqIC5BDncgLkEDdnMgLkEZd3MgKmogNmogGEENdyAYQQp2cyAYQQ93c2oiFUENdyAVQQp2cyAVQQ93c2oiGSATaiA6IApqIBUgEmogFCATIApzcSAKc2ogFEEadyAUQRV3cyAUQQd3c2pB78aVxQdqIgogBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAbaiICaiISIBQgE3NxIBNzaiASQRp3IBJBFXdzIBJBB3dzakGU8KGmeGoiGyACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBpqIgNqIhMgEiAUc3EgFHNqIBNBGncgE0EVd3MgE0EHd3NqQYiEnOZ4aiIaIANBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogHGoiBGoiFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pB+v/7hXlqIhwgBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAdaiICaiIVID9qNgIcIAAgQSACQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIApqIgNBHncgA0ETd3MgA0EKd3MgAyACcyAEcSADIAJxc2ogG2oiBEEedyAEQRN3cyAEQQp3cyAEIANzIAJxIAQgA3FzaiAaaiICQR53IAJBE3dzIAJBCndzIAIgBHMgA3EgAiAEcXNqIBxqIgpqNgIMIAAgPiAwQQ53IDBBA3ZzIDBBGXdzICxqIDhqIBlBDXcgGUEKdnMgGUEPd3NqIhkgEmogFSAUIBNzcSATc2ogFUEadyAVQRV3cyAVQQd3c2pB69nBonpqIhogA2oiEmo2AhggACBDIApBHncgCkETd3MgCkEKd3MgCiACcyAEcSAKIAJxc2ogGmoiA2o2AgggACA9IDFBDncgMUEDdnMgMUEZd3MgMGogGGogO0ENdyA7QQp2cyA7QQ93c2ogE2ogEiAVIBRzcSAUc2ogEkEadyASQRV3cyASQQd3c2pB98fm93tqIhggBGoiE2o2AhQgACBFIANBHncgA0ETd3MgA0EKd3MgAyAKcyACcSADIApxc2ogGGoiBGo2AgQgACA8IDVBDncgNUEDdnMgNUEZd3MgMWogOWogGUENdyAZQQp2cyAZQQ93c2ogFGogEyASIBVzcSAVc2ogE0EadyATQRV3cyATQQd3c2pB8vHFs3xqIhIgAmpqNgIQIAAgASAEQR53IARBE3dzIARBCndzIAQgA3MgCnEgBCADcXNqIBJqajYCAAv3BQIBfgR/QQApA8CJASIApyIBQQJ2QQ9xIgJBAnRBgIkBaiIDIAMoAgBBfyABQQN0IgFBGHEiA3RBf3NxQYABIAN0czYCAAJAAkACQCACQQ5JDQACQCACQQ5HDQBBAEEANgK8iQELQciJAUGAiQEQA0EAIQEMAQsgAkENRg0BIAJBAWohAQsgAUECdCEBA0AgAUGAiQFqQQA2AgAgAUEEaiIBQThHDQALQQApA8CJASIAp0EDdCEBC0EAIAFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYCvIkBQQAgAEIdiKciAUEYdCABQQh0QYCA/AdxciABQQh2QYD+A3EgAUEYdnJyNgK4iQFByIkBQYCJARADQQBBACgC5IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC5IkBQQBBACgC4IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC4IkBQQBBACgC3IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC3IkBQQBBACgC2IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC2IkBQQBBACgC1IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC1IkBQQBBACgC0IkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYC0IkBQQBBACgCzIkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYCzIkBQQBBACgCyIkBIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZyciIBNgLIiQECQEEAKALoiQEiBEUNAEEAIAE6AIAJIARBAUYNACABQQh2IQNBASEBQQEhAgNAIAFBgAlqIAM6AAAgBCACQQFqIgJB/wFxIgFNDQEgAUHIiQFqLQAAIQMMAAsLCwYAQYCJAQujAQBBAEIANwPAiQFBAEEcQSAgAUHgAUYiARs2AuiJAUEAQqef5qfG9JP9vn9Cq7OP/JGjs/DbACABGzcD4IkBQQBCsZaA/p+ihazoAEL/pLmIxZHagpt/IAEbNwPYiQFBAEKXusODk6eWh3dC8ua746On/aelfyABGzcD0IkBQQBC2L2WiPygtb42QufMp9DW0Ouzu38gARs3A8iJASAAEAIQBAsLCwEAQYAICwRwAAAA";
    var hash$a = "817d957e";
    var wasmJson$a = {
    	name: name$a,
    	data: data$a,
    	hash: hash$a
    };

    const mutex$a = new Mutex();
    let wasmCache$a = null;
    /**
     * Calculates SHA-2 (SHA-224) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha224(data) {
        if (wasmCache$a === null) {
            return lockedCreate(mutex$a, wasmJson$a, 28)
                .then((wasm) => {
                wasmCache$a = wasm;
                return wasmCache$a.calculate(data, 224);
            });
        }
        try {
            const hash = wasmCache$a.calculate(data, 224);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-224) hash instance
     */
    function createSHA224() {
        return WASMInterface(wasmJson$a, 28).then((wasm) => {
            wasm.init(224);
            const obj = {
                init: () => { wasm.init(224); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 28,
            };
            return obj;
        });
    }

    const mutex$9 = new Mutex();
    let wasmCache$9 = null;
    /**
     * Calculates SHA-2 (SHA-256) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha256(data) {
        if (wasmCache$9 === null) {
            return lockedCreate(mutex$9, wasmJson$a, 32)
                .then((wasm) => {
                wasmCache$9 = wasm;
                return wasmCache$9.calculate(data, 256);
            });
        }
        try {
            const hash = wasmCache$9.calculate(data, 256);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-256) hash instance
     */
    function createSHA256() {
        return WASMInterface(wasmJson$a, 32).then((wasm) => {
            wasm.init(256);
            const obj = {
                init: () => { wasm.init(256); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    var name$9 = "sha512";
    var data$9 = "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";
    var hash$9 = "a5d1ca7c";
    var wasmJson$9 = {
    	name: name$9,
    	data: data$9,
    	hash: hash$9
    };

    const mutex$8 = new Mutex();
    let wasmCache$8 = null;
    /**
     * Calculates SHA-2 (SHA-384) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha384(data) {
        if (wasmCache$8 === null) {
            return lockedCreate(mutex$8, wasmJson$9, 48)
                .then((wasm) => {
                wasmCache$8 = wasm;
                return wasmCache$8.calculate(data, 384);
            });
        }
        try {
            const hash = wasmCache$8.calculate(data, 384);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-384) hash instance
     */
    function createSHA384() {
        return WASMInterface(wasmJson$9, 48).then((wasm) => {
            wasm.init(384);
            const obj = {
                init: () => { wasm.init(384); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 128,
                digestSize: 48,
            };
            return obj;
        });
    }

    const mutex$7 = new Mutex();
    let wasmCache$7 = null;
    /**
     * Calculates SHA-2 (SHA-512) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha512(data) {
        if (wasmCache$7 === null) {
            return lockedCreate(mutex$7, wasmJson$9, 64)
                .then((wasm) => {
                wasmCache$7 = wasm;
                return wasmCache$7.calculate(data, 512);
            });
        }
        try {
            const hash = wasmCache$7.calculate(data, 512);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-512) hash instance
     */
    function createSHA512() {
        return WASMInterface(wasmJson$9, 64).then((wasm) => {
            wasm.init(512);
            const obj = {
                init: () => { wasm.init(512); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 128,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name$8 = "xxhash32";
    var data$8 = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwcGAAEBAgADBAUBcAEBAQUEAQECAgYOAn8BQbCJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwAAw1IYXNoX0dldFN0YXRlAAQOSGFzaF9DYWxjdWxhdGUABQpTVEFURV9TSVpFAwEKswkGBQBBgAkLTQBBAEIANwOoiQFBACAANgKIiQFBACAAQc+Moo4GajYCjIkBQQAgAEH3lK+veGo2AoSJAUEAIABBqIiNoQJqNgKAiQFBAEEANgKgiQELswUBBn8CQCAARQ0AQQBBACkDqIkBIACtfDcDqIkBAkBBACgCoIkBIgEgAGpBD0sNAEEAIAFBAWo2AqCJASABQZCJAWpBAC0AgAk6AAAgAEEBRg0BQQEhAgNAQQBBACgCoIkBIgFBAWo2AqCJASABQZCJAWogAkGACWotAAA6AAAgACACQQFqIgJHDQAMAgsLIABB8AhqIQMCQAJAIAENAEEAKAKMiQEhAUEAKAKIiQEhBEEAKAKEiQEhBUEAKAKAiQEhBkGACSECDAELQYAJIQICQCABQQ9LDQBBgAkhAgNAIAItAAAhBEEAIAFBAWo2AqCJASABQZCJAWogBDoAACACQQFqIQJBACgCoIkBIgFBEEkNAAsLQQBBACgCkIkBQfeUr694bEEAKAKAiQFqQQ13QbHz3fF5bCIGNgKAiQFBAEEAKAKUiQFB95Svr3hsQQAoAoSJAWpBDXdBsfPd8XlsIgU2AoSJAUEAQQAoApiJAUH3lK+veGxBACgCiIkBakENd0Gx893xeWwiBDYCiIkBQQBBACgCnIkBQfeUr694bEEAKAKMiQFqQQ13QbHz3fF5bCIBNgKMiQELIABBgAlqIQACQCACIANLDQADQCACKAIAQfeUr694bCAGakENd0Gx893xeWwhBiACQQxqKAIAQfeUr694bCABakENd0Gx893xeWwhASACQQhqKAIAQfeUr694bCAEakENd0Gx893xeWwhBCACQQRqKAIAQfeUr694bCAFakENd0Gx893xeWwhBSACQRBqIgIgA00NAAsLQQAgATYCjIkBQQAgBDYCiIkBQQAgBTYChIkBQQAgBjYCgIkBQQAgACACayIBNgKgiQEgAUUNAEEAIQEDQCABQZCJAWogAiABai0AADoAACABQQFqIgFBACgCoIkBSQ0ACwsLzAICAX4Gf0EAKQOoiQEiAKchAQJAAkAgAEIQVA0AQQAoAoSJAUEHd0EAKAKAiQFBAXdqQQAoAoiJAUEMd2pBACgCjIkBQRJ3aiECDAELQQAoAoiJAUGxz9myAWohAgsgAiABaiECQZCJASEBQQAoAqCJASIDQZCJAWohBAJAIANBBEgNAEGQiQEhBQNAIAUoAgBBvdzKlXxsIAJqQRF3Qa/W074CbCECIAVBCGohBiAFQQRqIgEhBSAGIARNDQALCwJAIAEgBEYNACADQZCJAWohBQNAIAEtAABBsc/ZsgFsIAJqQQt3QbHz3fF5bCECIAUgAUEBaiIBRw0ACwtBACACQQ92IAJzQfeUr694bCIBQQ12IAFzQb3cypV8bCIBQRB2IAFzIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycq03A4AJCwYAQYCJAQtTAEEAQgA3A6iJAUEAIAE2AoiJAUEAIAFBz4yijgZqNgKMiQFBACABQfeUr694ajYChIkBQQAgAUGoiI2hAmo2AoCJAUEAQQA2AqCJASAAEAIQAwsLCwEAQYAICwQwAAAA";
    var hash$8 = "5b6a5062";
    var wasmJson$8 = {
    	name: name$8,
    	data: data$8,
    	hash: hash$8
    };

    const mutex$6 = new Mutex();
    let wasmCache$6 = null;
    function validateSeed$3(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be a valid 32-bit long unsigned integer.');
        }
        return null;
    }
    /**
     * Calculates xxHash32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash32(data, seed = 0) {
        if (validateSeed$3(seed)) {
            return Promise.reject(validateSeed$3(seed));
        }
        if (wasmCache$6 === null) {
            return lockedCreate(mutex$6, wasmJson$8, 4)
                .then((wasm) => {
                wasmCache$6 = wasm;
                return wasmCache$6.calculate(data, seed);
            });
        }
        try {
            const hash = wasmCache$6.calculate(data, seed);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash32 hash instance
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash32(seed = 0) {
        if (validateSeed$3(seed)) {
            return Promise.reject(validateSeed$3(seed));
        }
        return WASMInterface(wasmJson$8, 4).then((wasm) => {
            wasm.init(seed);
            const obj = {
                init: () => { wasm.init(seed); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 16,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$7 = "xxhash64";
    var data$7 = "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";
    var hash$7 = "bc315b2a";
    var wasmJson$7 = {
    	name: name$7,
    	data: data$7,
    	hash: hash$7
    };

    const mutex$5 = new Mutex();
    let wasmCache$5 = null;
    const seedBuffer$2 = new ArrayBuffer(8);
    function validateSeed$2(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be given as two valid 32-bit long unsigned integers (lo + high).');
        }
        return null;
    }
    function writeSeed$2(arr, low, high) {
        // write in little-endian format
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
    }
    /**
     * Calculates xxHash64 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash64(data, seedLow = 0, seedHigh = 0) {
        if (validateSeed$2(seedLow)) {
            return Promise.reject(validateSeed$2(seedLow));
        }
        if (validateSeed$2(seedHigh)) {
            return Promise.reject(validateSeed$2(seedHigh));
        }
        if (wasmCache$5 === null) {
            return lockedCreate(mutex$5, wasmJson$7, 8)
                .then((wasm) => {
                wasmCache$5 = wasm;
                writeSeed$2(seedBuffer$2, seedLow, seedHigh);
                wasmCache$5.writeMemory(new Uint8Array(seedBuffer$2));
                return wasmCache$5.calculate(data);
            });
        }
        try {
            writeSeed$2(seedBuffer$2, seedLow, seedHigh);
            wasmCache$5.writeMemory(new Uint8Array(seedBuffer$2));
            const hash = wasmCache$5.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash64 hash instance
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash64(seedLow = 0, seedHigh = 0) {
        if (validateSeed$2(seedLow)) {
            return Promise.reject(validateSeed$2(seedLow));
        }
        if (validateSeed$2(seedHigh)) {
            return Promise.reject(validateSeed$2(seedHigh));
        }
        return WASMInterface(wasmJson$7, 8).then((wasm) => {
            const instanceBuffer = new ArrayBuffer(8);
            writeSeed$2(instanceBuffer, seedLow, seedHigh);
            wasm.writeMemory(new Uint8Array(instanceBuffer));
            wasm.init();
            const obj = {
                init: () => {
                    wasm.writeMemory(new Uint8Array(instanceBuffer));
                    wasm.init();
                    return obj;
                },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 32,
                digestSize: 8,
            };
            return obj;
        });
    }

    var name$6 = "xxhash3";
    var data$6 = "AGFzbQEAAAABJAZgAAF/YAR/f39/AGAHf39/f39/fwBgA39/fgF+YAAAYAF/AAMMCwABAgMDAwQFBAAEBAUBcAEBAQUEAQECAgYOAn8BQcCOBQt/AEHACQsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQABgtIYXNoX1VwZGF0ZQAHCkhhc2hfRmluYWwACA1IYXNoX0dldFN0YXRlAAkOSGFzaF9DYWxjdWxhdGUACgpTVEFURV9TSVpFAwEK+joLBQBBgAoL7wMBEH4CQCADRQ0AIAFBOGohASACQThqIQIgACkDMCEEIAApAzghBSAAKQMgIQYgACkDKCEHIAApAxAhCCAAKQMYIQkgACkDACEKIAApAwghCwNAIAcgAUFoaikDACIMfCACQXBqKQMAIAFBcGopAwAiDYUiB0IgiCAHQv////8Pg358IQcgCSABQVhqKQMAIg58IAJBYGopAwAgAUFgaikDACIPhSIJQiCIIAlC/////w+DfnwhCSALIAFBSGopAwAiEHwgAkFQaikDACABQVBqKQMAIhGFIgtCIIggC0L/////D4N+fCELIAJBeGopAwAgAUF4aikDACIShSITQiCIIBNC/////w+DfiAEfCABKQMAIhN8IQQgAkFoaikDACAMhSIMQiCIIAxC/////w+DfiAGfCANfCEGIAJBWGopAwAgDoUiDEIgiCAMQv////8Pg34gCHwgD3whCCACQUhqKQMAIBCFIgxCIIggDEL/////D4N+IAp8IBF8IQogBSASfCACKQMAIBOFIgVCIIggBUL/////D4N+fCEFIAFBwABqIQEgAkEIaiECIANBf2oiAw0ACyAAIAk3AxggACAKNwMAIAAgCzcDCCAAIAc3AyggACAINwMQIAAgBTcDOCAAIAY3AyAgACAENwMwCwveAgIBfwF+AkAgAiABKAIAIgdrIgIgBEsNACAAIAMgBSAHQQN0aiACEAEgACAAKQMAIgggBSAGaiIHKQMAhSAIQi+IhUKx893xCX43AwAgACAAKQMIIgggBykDCIUgCEIviIVCsfPd8Ql+NwMIIAAgACkDECIIIAcpAxCFIAhCL4iFQrHz3fEJfjcDECAAIAApAxgiCCAHKQMYhSAIQi+IhUKx893xCX43AxggACAAKQMgIgggBykDIIUgCEIviIVCsfPd8Ql+NwMgIAAgACkDKCIIIAcpAyiFIAhCL4iFQrHz3fEJfjcDKCAAIAApAzAiCCAHKQMwhSAIQi+IhUKx893xCX43AzAgACAAKQM4IgggBykDOIUgCEIviIVCsfPd8Ql+NwM4IAAgAyACQQZ0aiAFIAQgAmsiBxABIAEgBzYCAA8LIAAgAyAFIAdBA3RqIAQQASABIAcgBGo2AgAL3QQBBH4CQCAAQQlJDQBBACkDgIwBIAEpAyAgASkDGIUgAnyFIgNCOIYgA0IohkKAgICAgIDA/wCDhCADQhiGQoCAgICA4D+DIANCCIZCgICAgPAfg4SEIANCCIhCgICA+A+DIANCGIhCgID8B4OEIANCKIhCgP4DgyADQjiIhISEIACtfCAAQfiLAWopAwAgASkDMCABKQMohSACfYUiAnwgAkL/////D4MiBCADQiCIIgV+IgZC/////w+DIAJCIIgiAiADQv////8PgyIDfnwgBCADfiIDQiCIfCIEQiCGIANC/////w+DhCAGQiCIIAIgBX58IARCIIh8hXwiA0IliCADhUL5893xmfKZqxZ+IgNCIIggA4UPCwJAIABBBEkNACABKQMQIAEpAwiFIAKnIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycq1CIIYgAoV9QQA1AoCMAUIghiAAQfyLAWo1AgCEhSIDQhiJIAOFIANCMYmFQqW+4/TRjIfZn39+IgNCI4ggAK18IAOFQqW+4/TRjIfZn39+IgNCHIggA4UPCwJAIABFDQAgASgCBCABKAIAc60gAnwiA0EALQCAjAFBEHQgAEEIdHIgAEEBdkGAjAFqLQAAQRh0ciAAQf+LAWotAAByrYUgA0IhiIVCz9bTvtLHq9lCfiIDQh2IIAOFQvnz3fGZ9pmrFn4iA0IgiCADhQ8LIAEpAzggAoUgASkDQIUiA0IhiCADhULP1tO+0ser2UJ+IgNCHYggA4VC+fPd8Zn2masWfiIDQiCIIAOFC94IAQZ+IACtQoeVr6+Ytt6bnn9+IQMCQCAAQSFJDQACQCAAQcEASQ0AAkAgAEHhAEkNACABKQNoIAJ9QQApA7iMAYUiBEL/////D4MiBSABKQNgIAJ8QQApA7CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDeCACfSAAQciLAWopAwCFIgNC/////w+DIgQgASkDcCACfCAAQcCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQNIIAJ9QQApA6iMAYUiBEL/////D4MiBSABKQNAIAJ8QQApA6CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDWCACfSAAQdiLAWopAwCFIgNC/////w+DIgQgASkDUCACfCAAQdCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQMoIAJ9QQApA5iMAYUiBEL/////D4MiBSABKQMgIAJ8QQApA5CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDOCACfSAAQeiLAWopAwCFIgNC/////w+DIgQgASkDMCACfCAAQeCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQMIIAJ9QQApA4iMAYUiBEL/////D4MiBSABKQMAIAJ8QQApA4CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDGCACfSAAQfiLAWopAwCFIgNC/////w+DIgQgASkDECACfCAAQfCLAWopAwCFIgJCIIgiBX4iBkL/////D4MgA0IgiCIDIAJC/////w+DIgJ+fCAEIAJ+IgJCIIh8IgRCIIYgAkL/////D4OEIAZCIIggAyAFfnwgBEIgiHyFfCICQiWIIAKFQvnz3fGZ8pmrFn4iAkIgiCAChQuICwQBfwV+An8BfkEAIQMgASkDeCACfUEAKQP4jAGFIgRC/////w+DIgUgASkDcCACfEEAKQPwjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpA2ggAn1BACkD6IwBhSIEQv////8PgyIFIAEpA2AgAnxBACkD4IwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSABKQNYIAJ9QQApA9iMAYUiBEL/////D4MiBSABKQNQIAJ8QQApA9CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgASkDSCACfUEAKQPIjAGFIgRC/////w+DIgUgASkDQCACfEEAKQPAjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpAzggAn1BACkDuIwBhSIEQv////8PgyIFIAEpAzAgAnxBACkDsIwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSABKQMoIAJ9QQApA6iMAYUiBEL/////D4MiBSABKQMgIAJ8QQApA6CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgASkDGCACfUEAKQOYjAGFIgRC/////w+DIgUgASkDECACfEEAKQOQjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpAwggAn1BACkDiIwBhSIEQv////8PgyIFIAEpAwAgAnxBACkDgIwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSAArUKHla+vmLbem55/fnx8fHx8fHx8IgRCJYggBIVC+fPd8ZnymasWfiIEQiCIIASFIQQgAEEQbSEJAkAgAEGQAUgNACAJQQkgCUEJShtBeGohCQNAIAEgA2oiCkELaikDACACfSADQYiNAWopAwCFIgVC/////w+DIgYgCkEDaikDACACfCADQYCNAWopAwCFIgdCIIgiCH4iC0L/////D4MgBUIgiCIFIAdC/////w+DIgd+fCAGIAd+IgZCIIh8IgdCIIYgBkL/////D4OEIAtCIIggBSAIfnwgB0IgiHyFIAR8IQQgA0EQaiEDIAlBf2oiCQ0ACwsgASkDfyACfSAAQfiLAWopAwCFIgVC/////w+DIgYgASkDdyACfCAAQfCLAWopAwCFIgJCIIgiB34iCEL/////D4MgBUIgiCIFIAJC/////w+DIgJ+fCAGIAJ+IgJCIIh8IgZCIIYgAkL/////D4OEIAhCIIggBSAHfnwgBkIgiHyFIAR8IgJCJYggAoVC+fPd8ZnymasWfiICQiCIIAKFC98FAgF+AX8CQAJAQQApA4AKIgBQRQ0AQYAIIQFCACEADAELAkBBACkDoI4BIABSDQBBACEBDAELQQAhAUEAQq+v79e895Kg/gAgAH03A/iLAUEAIABCxZbr+djShYIofDcD8IsBQQBCj/Hjja2P9JhOIAB9NwPoiwFBACAAQqus+MXV79HQfHw3A+CLAUEAQtOt1LKShbW0nn8gAH03A9iLAUEAIABCl5r0jvWWvO3JAHw3A9CLAUEAQsWDgv2v/8SxayAAfTcDyIsBQQAgAELqi7OdyOb09UN8NwPAiwFBAELIv/rLnJveueQAIAB9NwO4iwFBACAAQoqjgd/Ume2sMXw3A7CLAUEAQvm57738+MKnHSAAfTcDqIsBQQAgAEKo9dv7s5ynmj98NwOgiwFBAEK4sry3lNW31lggAH03A5iLAUEAIABC8cihuqm0w/zOAHw3A5CLAUEAQoihl9u445SXo38gAH03A4iLAUEAIABCvNDI2pvysIBLfDcDgIsBQQBC4OvAtJ7QjpPMACAAfTcD+IoBQQAgAEK4kZii9/6Qko5/fDcD8IoBQQBCgrXB7sf5v7khIAB9NwPoigFBACAAQsvzmffEmfDy+AB8NwPgigFBAELygJGl+vbssx8gAH03A9iKAUEAIABC3qm3y76Q5MtbfDcD0IoBQQBC/IKE5PK+yNYcIAB9NwPIigFBACAAQrj9s8uzhOmlvn98NwPAigELQQBCADcDkI4BQQBCADcDiI4BQQBCADcDgI4BQQAgATYCsI4BQQAgADcDoI4BQQBCsfPd8Qk3A7iKAUEAQsXP2bLx5brqJzcDsIoBQQBC95Svrwg3A6iKAUEAQuPcypX8zvL1hX83A6CKAUEAQvnz3fGZ9pmrFjcDmIoBQQBCz9bTvtLHq9lCNwOQigFBAEKHla+vmLbem55/NwOIigFBAEK93MqVDDcDgIoBQQBCkICAgIAQNwOYjgELwAUBBX9BAEEAKQOQjgEgAK18NwOQjgECQAJAQQAoAoCOASIBIABqIgJBgAJLDQAgAUGAjAFqIQNBgAohBAJAAkAgAEEITw0AIAAhAQwBCyAAIQEDQCADIAQpAwA3AwAgA0EIaiEDIARBCGohBCABQXhqIgFBB0sNAAsLIAFFDQEDQCADIAQtAAA6AAAgA0EBaiEDIARBAWohBCABQX9qIgENAAtBACgCgI4BIABqIQIMAQtBgAohAyAAQYAKaiECQQAoArCOASIEQcCKASAEGyEAAkAgAUUNACABQYCMAWohA0GACiEEAkACQEGAAiABayIFQQhPDQAgBSEBDAELIAUhAQNAIAMgBCkDADcDACADQQhqIQMgBEEIaiEEIAFBeGoiAUEHSw0ACwsCQCABRQ0AA0AgAyAELQAAOgAAIANBAWohAyAEQQFqIQQgAUF/aiIBDQALC0GAigFBiI4BQQAoApiOAUGAjAFBBCAAQQAoApyOARACQQBBADYCgI4BIAVBgApqIQMLAkAgA0GAAmogAk8NACACQYB+aiEEA0BBgIoBQYiOAUEAKAKYjgEgA0EEIABBACgCnI4BEAIgA0GAAmoiAyAESQ0AC0EAIANBQGopAwA3A8CNAUEAIANBSGopAwA3A8iNAUEAIANBUGopAwA3A9CNAUEAIANBWGopAwA3A9iNAUEAIANBYGopAwA3A+CNAUEAIANBaGopAwA3A+iNAUEAIANBcGopAwA3A/CNAUEAIANBeGopAwA3A/iNAQtBgIwBIQQCQAJAIAIgA2siAkEITw0AIAIhAQwBCyACIQEDQCAEIAMpAwA3AwAgBEEIaiEEIANBCGohAyABQXhqIgFBB0sNAAsLIAFFDQADQCAEIAMtAAA6AAAgBEEBaiEEIANBAWohAyABQX9qIgENAAsLQQAgAjYCgI4BC6oQBQR/AX4Cfwp+An8jACIAIQEgAEGAAWtBQHEiAiQAQQAoArCOASIAQcCKASAAGyEDAkACQEEAKQOQjgEiBELxAVQNACACQQApA4CKATcDACACQQApA4iKATcDCCACQQApA5CKATcDECACQQApA5iKATcDGCACQQApA6CKATcDICACQQApA6iKATcDKCACQQApA7CKATcDMCACQQApA7iKATcDOAJAAkBBACgCgI4BIgVBwABJDQAgAkEAKAKIjgE2AkAgAiACQcAAakEAKAKYjgFBgIwBIAVBf2pBBnYgA0EAKAKcjgEQAiACIAIpAwhBACgCgI4BIgBBwIsBaikDACIEfCADQQAoApyOAWoiBkEBaikDACAAQciLAWopAwAiB4UiCEIgiCAIQv////8Pg358Igk3AwggAiACKQMYIABB0IsBaikDACIIfCAGQRFqKQMAIABB2IsBaikDACIKhSILQiCIIAtC/////w+DfnwiDDcDGCACIAcgBCAGQXlqKQMAhSIEQiCIIARC/////w+DfiACKQMAfHwiDTcDACACIAogCCAGQQlqKQMAhSIEQiCIIARC/////w+DfiACKQMQfHwiDjcDECAGQRlqKQMAIQQgAikDICEHIAIgAikDKCAAQeCLAWopAwAiCHwgBkEhaikDACAAQeiLAWopAwAiCoUiC0IgiCALQv////8Pg358Ig83AyggAiAKIAcgBCAIhSIEQiCIIARC/////w+Dfnx8IhA3AyAgAiACKQM4IABB8IsBaikDACIEfCAGQTFqKQMAIABB+IsBaikDACIHhSIIQiCIIAhC/////w+Dfnw3AzggByAEIAZBKWopAwCFIgRCIIggBEL/////D4N+IAIpAzB8fCEEDAELQcAAIAVrIRECQAJAAkAgBUE4TQ0AQYCOASARayEGIAJBwABqIQUgESEADAELQQAhEiARIQADQCACQcAAaiASaiAFIBJqQcCNAWopAwA3AwAgEkEIaiESIABBeGoiAEEHSw0ACyAFIBJqIgZBwABGDQEgBkHAjQFqIQYgAkHAAGogEmohBQsDQCAFIAYtAAA6AAAgBUEBaiEFIAZBAWohBiAAQX9qIgANAAtBACgCgI4BIQULIAJBwABqIBFqIQZBgIwBIQACQCAFQQhJDQBBgIwBIQADQCAGIAApAwA3AwAgBkEIaiEGIABBCGohACAFQXhqIgVBB0sNAAsLAkAgBUUNAANAIAYgAC0AADoAACAGQQFqIQYgAEEBaiEAIAVBf2oiBQ0ACwsgAiACKQMIIAIpA0AiBHwgA0EAKAKcjgFqIgBBAWopAwAgAikDSCIHhSIIQiCIIAhC/////w+DfnwiCTcDCCACIAIpAxggAikDUCIIfCAAQRFqKQMAIAIpA1giCoUiC0IgiCALQv////8Pg358Igw3AxggAiAHIAQgAEF5aikDAIUiBEIgiCAEQv////8Pg34gAikDAHx8Ig03AwAgAiAKIAggAEEJaikDAIUiBEIgiCAEQv////8Pg34gAikDEHx8Ig43AxAgAEEZaikDACEEIAIpAyAhByACIAIpAyggAikDYCIIfCAAQSFqKQMAIAIpA2giCoUiC0IgiCALQv////8Pg358Ig83AyggAiAKIAcgBCAIhSIEQiCIIARC/////w+Dfnx8IhA3AyAgAiACKQM4IAIpA3AiBHwgAEExaikDACACKQN4IgeFIghCIIggCEL/////D4N+fDcDOCAHIAQgAEEpaikDAIUiBEIgiCAEQv////8Pg34gAikDMHx8IQQLIAIgBDcDMCADKQNDIAIpAziFIgdC/////w+DIgggAykDOyAEhSIEQiCIIgp+IgtC/////w+DIAdCIIgiByAEQv////8PgyIEfnwgCCAEfiIEQiCIfCIIQiCGIARC/////w+DhCALQiCIIAcgCn58IAhCIIh8hSADKQMzIA+FIgRC/////w+DIgcgAykDKyAQhSIIQiCIIgp+IgtC/////w+DIARCIIgiBCAIQv////8PgyIIfnwgByAIfiIHQiCIfCIIQiCGIAdC/////w+DhCALQiCIIAQgCn58IAhCIIh8hSADKQMjIAyFIgRC/////w+DIgcgAykDGyAOhSIIQiCIIgp+IgtC/////w+DIARCIIgiBCAIQv////8PgyIIfnwgByAIfiIHQiCIfCIIQiCGIAdC/////w+DhCALQiCIIAQgCn58IAhCIIh8hSADKQMTIAmFIgRC/////w+DIgcgAykDCyANhSIIQiCIIgp+IgtC/////w+DIARCIIgiBCAIQv////8PgyIIfnwgByAIfiIHQiCIfCIIQiCGIAdC/////w+DhCALQiCIIAQgCn58IAhCIIh8hUEAKQOQjgFCh5Wvr5i23puef358fHx8IgRCJYggBIVC+fPd8ZnymasWfiIEQiCIIASFIQQMAQsgBKchAAJAQQApA6COASIEUA0AAkAgAEEQSw0AIABBgAggBBADIQQMAgsCQCAAQYABSw0AIABBgAggBBAEIQQMAgsgAEGACCAEEAUhBAwBCwJAIABBEEsNACAAIANCABADIQQMAQsCQCAAQYABSw0AIAAgA0IAEAQhBAwBCyAAIANCABAFIQQLQQAgBEI4hiAEQiiGQoCAgICAgMD/AIOEIARCGIZCgICAgIDgP4MgBEIIhkKAgICA8B+DhIQgBEIIiEKAgID4D4MgBEIYiEKAgPwHg4QgBEIoiEKA/gODIARCOIiEhIQ3A4AKIAEkAAsGAEGAigELAgALC8wBAQBBgAgLxAG4/mw5I6RLvnwBgSz3Ia0c3tRt6YOQl9tyQKSkt7NnH8t55k7MwOV4glrQfcz/ciG4CEZ090MkjuA1kOaBOiZMPChSu5HDAMuI0GWLG1Muo3FkSJeiDflOOBnvRqnerNio+nY/45w0P/ncu8fHC08dilHgS820WTHIn37J2XhzZOrFrIM00+vDxYGg//oTY+sXDd1Rt/DaSdMWVSYp1GieKxa+WH1HofyP+LjRetAxzkXLOo+VFgQor9f7yrtLQH5AAgAA";
    var hash$6 = "187bc2c6";
    var wasmJson$6 = {
    	name: name$6,
    	data: data$6,
    	hash: hash$6
    };

    const mutex$4 = new Mutex();
    let wasmCache$4 = null;
    const seedBuffer$1 = new ArrayBuffer(8);
    function validateSeed$1(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be given as two valid 32-bit long unsigned integers (lo + high).');
        }
        return null;
    }
    function writeSeed$1(arr, low, high) {
        // write in little-endian format
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
    }
    /**
     * Calculates xxHash3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash3(data, seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
            return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
            return Promise.reject(validateSeed$1(seedHigh));
        }
        if (wasmCache$4 === null) {
            return lockedCreate(mutex$4, wasmJson$6, 8)
                .then((wasm) => {
                wasmCache$4 = wasm;
                writeSeed$1(seedBuffer$1, seedLow, seedHigh);
                wasmCache$4.writeMemory(new Uint8Array(seedBuffer$1));
                return wasmCache$4.calculate(data);
            });
        }
        try {
            writeSeed$1(seedBuffer$1, seedLow, seedHigh);
            wasmCache$4.writeMemory(new Uint8Array(seedBuffer$1));
            const hash = wasmCache$4.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash3 hash instance
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash3(seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
            return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
            return Promise.reject(validateSeed$1(seedHigh));
        }
        return WASMInterface(wasmJson$6, 8).then((wasm) => {
            const instanceBuffer = new ArrayBuffer(8);
            writeSeed$1(instanceBuffer, seedLow, seedHigh);
            wasm.writeMemory(new Uint8Array(instanceBuffer));
            wasm.init();
            const obj = {
                init: () => {
                    wasm.writeMemory(new Uint8Array(instanceBuffer));
                    wasm.init();
                    return obj;
                },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 512,
                digestSize: 8,
            };
            return obj;
        });
    }

    var name$5 = "xxhash128";
    var data$5 = "AGFzbQEAAAABKwdgAAF/YAR/f39/AGAHf39/f39/fwBgA39/fgF+YAR/f39+AGAAAGABfwADDQwAAQIDBAQEBQYFAAUEBQFwAQEBBQQBAQICBg4CfwFBwI4FC38AQcAJCwdwCAZtZW1vcnkCAA5IYXNoX0dldEJ1ZmZlcgAACUhhc2hfSW5pdAAHC0hhc2hfVXBkYXRlAAgKSGFzaF9GaW5hbAAJDUhhc2hfR2V0U3RhdGUACg5IYXNoX0NhbGN1bGF0ZQALClNUQVRFX1NJWkUDAQrKRgwFAEGACgvvAwEQfgJAIANFDQAgAUE4aiEBIAJBOGohAiAAKQMwIQQgACkDOCEFIAApAyAhBiAAKQMoIQcgACkDECEIIAApAxghCSAAKQMAIQogACkDCCELA0AgByABQWhqKQMAIgx8IAJBcGopAwAgAUFwaikDACINhSIHQiCIIAdC/////w+DfnwhByAJIAFBWGopAwAiDnwgAkFgaikDACABQWBqKQMAIg+FIglCIIggCUL/////D4N+fCEJIAsgAUFIaikDACIQfCACQVBqKQMAIAFBUGopAwAiEYUiC0IgiCALQv////8Pg358IQsgAkF4aikDACABQXhqKQMAIhKFIhNCIIggE0L/////D4N+IAR8IAEpAwAiE3whBCACQWhqKQMAIAyFIgxCIIggDEL/////D4N+IAZ8IA18IQYgAkFYaikDACAOhSIMQiCIIAxC/////w+DfiAIfCAPfCEIIAJBSGopAwAgEIUiDEIgiCAMQv////8Pg34gCnwgEXwhCiAFIBJ8IAIpAwAgE4UiBUIgiCAFQv////8Pg358IQUgAUHAAGohASACQQhqIQIgA0F/aiIDDQALIAAgCTcDGCAAIAo3AwAgACALNwMIIAAgBzcDKCAAIAg3AxAgACAFNwM4IAAgBjcDICAAIAQ3AzALC94CAgF/AX4CQCACIAEoAgAiB2siAiAESw0AIAAgAyAFIAdBA3RqIAIQASAAIAApAwAiCCAFIAZqIgcpAwCFIAhCL4iFQrHz3fEJfjcDACAAIAApAwgiCCAHKQMIhSAIQi+IhUKx893xCX43AwggACAAKQMQIgggBykDEIUgCEIviIVCsfPd8Ql+NwMQIAAgACkDGCIIIAcpAxiFIAhCL4iFQrHz3fEJfjcDGCAAIAApAyAiCCAHKQMghSAIQi+IhUKx893xCX43AyAgACAAKQMoIgggBykDKIUgCEIviIVCsfPd8Ql+NwMoIAAgACkDMCIIIAcpAzCFIAhCL4iFQrHz3fEJfjcDMCAAIAApAzgiCCAHKQM4hSAIQi+IhUKx893xCX43AzggACADIAJBBnRqIAUgBCACayIHEAEgASAHNgIADwsgACADIAUgB0EDdGogBBABIAEgByAEajYCAAvtAwEFfiABKQM4IAApAziFIgNC/////w+DIgQgASkDMCAAKQMwhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMoIAApAyiFIgNC/////w+DIgQgASkDICAAKQMghSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMYIAApAxiFIgNC/////w+DIgQgASkDECAAKQMQhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMIIAApAwiFIgNC/////w+DIgQgASkDACAAKQMAhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSACfHx8fCICQiWIIAKFQvnz3fGZ8pmrFn4iAkIgiCAChQvCCAEFfgJAIAFBCUkNACAAQQApA4CMASACKQMoIAIpAyCFIAN9hSABQfiLAWopAwAiBIUiBUIgiCIGQoeVr68IfiIHQv////8PgyAFQv////8PgyIFQrHz3fEJfnwgBUKHla+vCH4iBUIgiHwiCEIghiAFQv////8Pg4QgAUF/aq1CNoZ8IAQgAikDOCACKQMwhSADfIUiA0L/////D4NC95Svrwh+IANCgICAgHCDfCAGQrHz3fEJfnwgB0IgiHwgCEIgiHwiA0I4hiADQiiGQoCAgICAgMD/AIOEIANCGIZCgICAgIDgP4MgA0IIhkKAgICA8B+DhIQgA0IIiEKAgID4D4MgA0IYiEKAgPwHg4QgA0IoiEKA/gODIANCOIiEhISFIgRCIIgiBULP1tO+An4iBkL/////D4MgBEL/////D4MiBEK93MqVDH58IARCz9bTvgJ+IgdCIIh8IgRCBYhC////P4MgBEIghiAHQv////8Pg4SFQvnz3fGZ8pmrFn4iB0IgiCAHhTcDACAAIAVCvdzKlQx+IANCz9bTvtLHq9lCfnwgBkIgiHwgBEIgiHwiA0IliCADhUL5893xmfKZqxZ+IgNCIIggA4U3AwgPCwJAIAFBBEkNACAAIAIpAxggAikDEIUgA6ciAkEYdCACQQh0QYCA/AdxciACQQh2QYD+A3EgAkEYdnJyrUIghiADhXwgAUH8iwFqNQIAQiCGQQA1AoCMAYSFIgNCIIgiBCABQQJ0QYeVr694aq0iBX4iBkIgiCAEQrHz3fEJfnwgBkL/////D4MgA0L/////D4MiA0Kx893xCX58IAMgBX4iA0IgiHwiBEIgiHwgBEIghiADQv////8Pg4QiBEIBhnwiA0IliCADhUL5893xmfKZqxZ+IgVCIIggBYU3AwggACADQgOIIASFIgNCI4ggA4VCpb7j9NGMh9mff34iA0IciCADhTcDAA8LAkAgAUUNACAAIAIoAgQgAigCAHOtIAN8IgRBAC0AgIwBQRB0IAFBCHRyIAFBAXZBgIwBai0AAEEYdHIgAUH/iwFqLQAAciIBrYUgBEIhiIVCz9bTvtLHq9lCfiIEQh2IIASFQvnz3fGZ9pmrFn4iBEIgiCAEhTcDACAAIAIoAgwgAigCCHOtIAN9IgMgAUEYdCABQQh0QYCA/AdxciABQQh2QYD+A3EgAUEYdnJyQQ13rYUgA0IhiIVCz9bTvtLHq9lCfiIDQh2IIAOFQvnz3fGZ9pmrFn4iA0IgiCADhTcDCA8LIAAgAikDUCADhSACKQNYhSIEQiGIIASFQs/W077Sx6vZQn4iBEIdiCAEhUL5893xmfaZqxZ+IgRCIIggBIU3AwggACACKQNAIAOFIAIpA0iFIgNCIYggA4VCz9bTvtLHq9lCfiIDQh2IIAOFQvnz3fGZ9pmrFn4iA0IgiCADhTcDAAunCgEKfiABrSIEQoeVr6+Ytt6bnn9+IQUCQAJAIAFBIU8NAEIAIQYMAQtCACEHAkAgAUHBAEkNAEIAIQcCQCABQeEASQ0AIAIpA3ggA30gAUHIiwFqKQMAIgiFIgdC/////w+DIgkgAikDcCADfCABQcCLAWopAwAiCoUiC0IgiCIMfiINQiCIIAdCIIgiByAMfnwgDUL/////D4MgByALQv////8PgyILfnwgCSALfiIHQiCIfCIJQiCIfEEAKQO4jAEiC0EAKQOwjAEiDHyFIAlCIIYgB0L/////D4OEhSEHIAIpA2ggA30gC4UiCUL/////D4MiCyACKQNgIAN8IAyFIgxCIIgiDX4iBkL/////D4MgCUIgiCIJIAxC/////w+DIgx+fCALIAx+IgtCIIh8IgxCIIYgC0L/////D4OEIAZCIIggCSANfnwgDEIgiHyFIAV8IAggCnyFIQULIAIpA1ggA30gAUHYiwFqKQMAIgiFIglC/////w+DIgogAikDUCADfCABQdCLAWopAwAiC4UiDEIgiCINfiIGQv////8PgyAJQiCIIgkgDEL/////D4MiDH58IAogDH4iCkIgiHwiDEIghiAKQv////8Pg4QgBkIgiCAJIA1+fCAMQiCIfIUgB3xBACkDqIwBIglBACkDoIwBIgp8hSEHIAIpA0ggA30gCYUiCUL/////D4MiDCACKQNAIAN8IAqFIgpCIIgiDX4iBkL/////D4MgCUIgiCIJIApC/////w+DIgp+fCAMIAp+IgpCIIh8IgxCIIYgCkL/////D4OEIAZCIIggCSANfnwgDEIgiHyFIAV8IAggC3yFIQULIAIpAzggA30gAUHoiwFqKQMAIgiFIglC/////w+DIgogAikDMCADfCABQeCLAWopAwAiC4UiDEIgiCINfiIGQv////8PgyAJQiCIIgkgDEL/////D4MiDH58IAogDH4iCkIgiHwiDEIghiAKQv////8Pg4QgBkIgiCAJIA1+fCAMQiCIfIUgB3xBACkDmIwBIgdBACkDkIwBIgl8hSEGIAIpAyggA30gB4UiB0L/////D4MiCiACKQMgIAN8IAmFIglCIIgiDH4iDUL/////D4MgB0IgiCIHIAlC/////w+DIgl+fCAKIAl+IglCIIh8IgpCIIYgCUL/////D4OEIA1CIIggByAMfnwgCkIgiHyFIAV8IAggC3yFIQULIAAgAikDGCADfSABQfiLAWopAwAiB4UiCEL/////D4MiCSACKQMQIAN8IAFB8IsBaikDACIKhSILQiCIIgx+Ig1C/////w+DIAhCIIgiCCALQv////8PgyILfnwgCSALfiIJQiCIfCILQiCGIAlC/////w+DhCANQiCIIAggDH58IAtCIIh8hSAGfEEAKQOIjAEiCEEAKQOAjAEiCXyFIgsgAikDCCADfSAIhSIIQv////8PgyIMIAIpAwAgA3wgCYUiCUIgiCINfiIGQv////8PgyAIQiCIIgggCUL/////D4MiCX58IAwgCX4iCUIgiHwiDEIghiAJQv////8Pg4QgBkIgiCAIIA1+fCAMQiCIfIUgBXwgByAKfIUiBXwiB0IliCAHhUL5893xmfKZqxZ+IgdCIIggB4U3AwAgAEIAIAVCh5Wvr5i23puef34gBCADfULP1tO+0ser2UJ+fCALQuPcypX8zvL1hX9+fCIDQiWIIAOFQvnz3fGZ8pmrFn4iA0IgiCADhX03AwgLiQ8DAX8UfgJ/QQAhBCACKQN4IAN9QQApA/iMASIFhSIGQv////8PgyIHIAIpA3AgA3xBACkD8IwBIgiFIglCIIgiCn4iC0L/////D4MgBkIgiCIGIAlC/////w+DIgl+fCAHIAl+IgdCIIh8IglCIIYgB0L/////D4OEIAtCIIggBiAKfnwgCUIgiHyFIAIpA1ggA31BACkD2IwBIgeFIgZC/////w+DIgkgAikDUCADfEEAKQPQjAEiCoUiC0IgiCIMfiINQv////8PgyAGQiCIIgYgC0L/////D4MiC358IAkgC34iCUIgiHwiC0IghiAJQv////8Pg4QgDUIgiCAGIAx+fCALQiCIfIUgAikDOCADfUEAKQO4jAEiCYUiBkL/////D4MiCyACKQMwIAN8QQApA7CMASIMhSINQiCIIg5+Ig9C/////w+DIAZCIIgiBiANQv////8PgyINfnwgCyANfiILQiCIfCINQiCGIAtC/////w+DhCAPQiCIIAYgDn58IA1CIIh8hSACKQMYIAN9QQApA5iMASILhSIGQv////8PgyINIAIpAxAgA3xBACkDkIwBIg6FIg9CIIgiEH4iEUL/////D4MgBkIgiCIGIA9C/////w+DIg9+fCANIA9+Ig1CIIh8Ig9CIIYgDUL/////D4OEIBFCIIggBiAQfnwgD0IgiHyFQQApA4iMASINQQApA4CMASIPfIV8QQApA6iMASIQQQApA6CMASIRfIV8QQApA8iMASISQQApA8CMASITfIV8QQApA+iMASIUQQApA+CMASIVfIUiBkIliCAGhUL5893xmfKZqxZ+IgZCIIggBoUhBiACKQNoIAN9IBSFIhRC/////w+DIhYgAikDYCADfCAVhSIVQiCIIhd+IhhC/////w+DIBRCIIgiFCAVQv////8PgyIVfnwgFiAVfiIVQiCIfCIWQiCGIBVC/////w+DhCAYQiCIIBQgF358IBZCIIh8hSACKQNIIAN9IBKFIhJC/////w+DIhQgAikDQCADfCAThSITQiCIIhV+IhZC/////w+DIBJCIIgiEiATQv////8PgyITfnwgFCATfiITQiCIfCIUQiCGIBNC/////w+DhCAWQiCIIBIgFX58IBRCIIh8hSACKQMoIAN9IBCFIhBC/////w+DIhIgAikDICADfCARhSIRQiCIIhN+IhRC/////w+DIBBCIIgiECARQv////8PgyIRfnwgEiARfiIRQiCIfCISQiCGIBFC/////w+DhCAUQiCIIBAgE358IBJCIIh8hSACKQMIIAN9IA2FIg1C/////w+DIhAgAikDACADfCAPhSIPQiCIIhF+IhJC/////w+DIA1CIIgiDSAPQv////8PgyIPfnwgECAPfiIPQiCIfCIQQiCGIA9C/////w+DhCASQiCIIA0gEX58IBBCIIh8hSABrSIPQoeVr6+Ytt6bnn9+fCALIA58hXwgCSAMfIV8IAcgCnyFfCAFIAh8hSIFQiWIIAWFQvnz3fGZ8pmrFn4iBUIgiCAFhSEFIAFBIG0hGQJAIAFBoAFIDQAgGUEFIBlBBUobQXxqIRoDQCACIARqIhlBG2opAwAgA30gBEGYjQFqKQMAIgeFIghC/////w+DIgkgGUETaikDACADfCAEQZCNAWopAwAiCoUiC0IgiCIMfiINQv////8PgyAIQiCIIgggC0L/////D4MiC358IAkgC34iCUIgiHwiC0IghiAJQv////8Pg4QgDUIgiCAIIAx+fCALQiCIfIUgBnwgBEGIjQFqKQMAIgggBEGAjQFqKQMAIgl8hSEGIBlBC2opAwAgA30gCIUiCEL/////D4MiCyAZQQNqKQMAIAN8IAmFIglCIIgi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QXBqKQMANwPwjQFBACADQXhqKQMANwP4jQELQYCMASEEAkACQCACIANrIgJBCE8NACACIQEMAQsgAiEBA0AgBCADKQMANwMAIARBCGohBCADQQhqIQMgAUF4aiIBQQdLDQALCyABRQ0AA0AgBCADLQAAOgAAIARBAWohBCADQQFqIQMgAUF/aiIBDQALC0EAIAI2AoCOAQvcDgUEfwF+An8EfgJ/IwAiACEBIABBgAFrQUBxIgAkAEEAKAKwjgEiAkHAigEgAhshAwJAAkBBACkDkI4BIgRC8QFUDQAgAEEAKQOAigE3AwAgAEEAKQOIigE3AwggAEEAKQOQigE3AxAgAEEAKQOYigE3AxggAEEAKQOgigE3AyAgAEEAKQOoigE3AyggAEEAKQOwigE3AzAgAEEAKQO4igE3AzgCQAJAQQAoAoCOASIFQcAASQ0AIABBACgCiI4BNgJAIAAgAEHAAGpBACgCmI4BQYCMASAFQX9qQQZ2IANBACgCnI4BEAIgACAAKQMIQQAoAoCOASICQcCLAWopAwAiBHwgA0EAKAKcjgFqIgZBAWopAwAgAkHIiwFqKQMAIgeFIghCIIggCEL/////D4N+fDcDCCAAIAApAxggAkHQiwFqKQMAIgh8IAZBEWopAwAgAkHYiwFqKQMAIgmFIgpCIIggCkL/////D4N+fDcDGCAAIAcgBCAGQXlqKQMAhSIEQiCIIARC/////w+DfiAAKQMAfHw3AwAgACAJIAggBkEJaikDAIUiBEIgiCAEQv////8Pg34gACkDEHx8NwMQIAZBGWopAwAhBCAAKQMgIQcgACAAKQMoIAJB4IsBaikDACIIfCAGQSFqKQMAIAJB6IsBaikDACIJhSIKQiCIIApC/////w+Dfnw3AyggACAJIAcgBCAIhSIEQiCIIARC/////w+Dfnx8NwMgIAAgACkDOCACQfCLAWopAwAiBHwgBkExaikDACACQfiLAWopAwAiB4UiCEIgiCAIQv////8Pg358NwM4IAAgByAEIAZBKWopAwCFIgRCIIggBEL/////D4N+IAApAzB8fDcDMAwBC0HAACAFayELAkACQAJAIAVBOE0NAEGAjgEgC2shBiAAQcAAaiEFIAshAgwBC0EAIQwgCyECA0AgAEHAAGogDGogBSAMakHAjQFqKQMANwMAIAxBCGohDCACQXhqIgJBB0sNAAsgBSAMaiIGQcAARg0BIAZBwI0BaiEGIABBwABqIAxqIQULA0AgBSAGLQAAOgAAIAVBAWohBSAGQQFqIQYgAkF/aiICDQALQQAoAoCOASEFCyAAQcAAaiALaiEGQYCMASECAkAgBUEISQ0AQYCMASECA0AgBiACKQMANwMAIAZBCGohBiACQQhqIQIgBUF4aiIFQQdLDQALCwJAIAVFDQADQCAGIAItAAA6AAAgBkEBaiEGIAJBAWohAiAFQX9qIgUNAAsLIAAgACkDCCAAKQNAIgR8IANBACgCnI4BaiICQQFqKQMAIAApA0giB4UiCEIgiCAIQv////8Pg358NwMIIAAgACkDGCAAKQNQIgh8IAJBEWopAwAgACkDWCIJhSIKQiCIIApC/////w+Dfnw3AxggACAHIAQgAkF5aikDAIUiBEIgiCAEQv////8Pg34gACkDAHx8NwMAIAAgCSAIIAJBCWopAwCFIgRCIIggBEL/////D4N+IAApAxB8fDcDECACQRlqKQMAIQQgACkDICEHIAAgACkDKCAAKQNgIgh8IAJBIWopAwAgACkDaCIJhSIKQiCIIApC/////w+Dfnw3AyggACAJIAcgBCAIhSIEQiCIIARC/////w+Dfnx8NwMgIAAgACkDOCAAKQNwIgR8IAJBMWopAwAgACkDeCIHhSIIQiCIIAhC/////w+Dfnw3AzggACAHIAQgAkEpaikDAIUiBEIgiCAEQv////8Pg34gACkDMHx8NwMwCyAAIAAgA0ELakEAKQOQjgEiBEKHla+vmLbem55/fhADNwNAIAAgACADQQAoApyOAWpBdWogBELP1tO+0ser2UJ+Qn+FEAM3A0gMAQsgBKchAgJAQQApA6COASIEUA0AAkAgAkEQSw0AIABBwABqIAJBgAggBBAEDAILAkAgAkGAAUsNACAAQcAAaiACQYAIIAQQBQwCCyAAQcAAaiACQYAIIAQQBgwBCwJAIAJBEEsNACAAQcAAaiACIANCABAEDAELAkAgAkGAAUsNACAAQcAAaiACIANCABAFDAELIABBwABqIAIgA0IAEAYLQQAgAEH4AGopAwA3A8AKQQAgAEHwAGopAwA3A7gKQQAgAEHoAGopAwA3A7AKQQAgAEHgAGopAwA3A6gKQQAgAEHYAGopAwA3A6AKQQAgAEHQAGopAwA3A5gKQQAgACkDSCIEQjiGIARCKIZCgICAgICAwP8Ag4QgBEIYhkKAgICAgOA/gyAEQgiGQoCAgIDwH4OEhCAEQgiIQoCAgPgPgyAEQhiIQoCA/AeDhCAEQiiIQoD+A4MgBEI4iISEhCIENwOACkEAIAQ3A5AKQQAgACkDQCIEQjiGIARCKIZCgICAgICAwP8Ag4QgBEIYhkKAgICAgOA/gyAEQgiGQoCAgIDwH4OEhCAEQgiIQoCAgPgPgyAEQhiIQoCA/AeDhCAEQiiIQoD+A4MgBEI4iISEhDcDiAogASQACwYAQYCKAQsCAAsLzAEBAEGACAvEAbj+bDkjpEu+fAGBLPchrRze1G3pg5CX23JApKS3s2cfy3nmTszA5XiCWtB9zP9yIbgIRnT3QySO4DWQ5oE6Jkw8KFK7kcMAy4jQZYsbUy6jcWRIl6IN+U44Ge9Gqd6s2Kj6dj/jnDQ/+dy7x8cLTx2KUeBLzbRZMciffsnZeHNk6sWsgzTT68PFgaD/+hNj6xcN3VG38NpJ0xZVJinUaJ4rFr5YfUeh/I/4uNF60DHORcs6j5UWBCiv1/vKu0tAfkACAAA=";
    var hash$5 = "e8e3fcf8";
    var wasmJson$5 = {
    	name: name$5,
    	data: data$5,
    	hash: hash$5
    };

    const mutex$3 = new Mutex();
    let wasmCache$3 = null;
    const seedBuffer = new ArrayBuffer(8);
    function validateSeed(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be given as two valid 32-bit long unsigned integers (lo + high).');
        }
        return null;
    }
    function writeSeed(arr, low, high) {
        // write in little-endian format
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
    }
    /**
     * Calculates xxHash128 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash128(data, seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
            return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
            return Promise.reject(validateSeed(seedHigh));
        }
        if (wasmCache$3 === null) {
            return lockedCreate(mutex$3, wasmJson$5, 16)
                .then((wasm) => {
                wasmCache$3 = wasm;
                writeSeed(seedBuffer, seedLow, seedHigh);
                wasmCache$3.writeMemory(new Uint8Array(seedBuffer));
                return wasmCache$3.calculate(data);
            });
        }
        try {
            writeSeed(seedBuffer, seedLow, seedHigh);
            wasmCache$3.writeMemory(new Uint8Array(seedBuffer));
            const hash = wasmCache$3.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash128 hash instance
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash128(seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
            return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
            return Promise.reject(validateSeed(seedHigh));
        }
        return WASMInterface(wasmJson$5, 16).then((wasm) => {
            const instanceBuffer = new ArrayBuffer(8);
            writeSeed(instanceBuffer, seedLow, seedHigh);
            wasm.writeMemory(new Uint8Array(instanceBuffer));
            wasm.init();
            const obj = {
                init: () => {
                    wasm.writeMemory(new Uint8Array(instanceBuffer));
                    wasm.init();
                    return obj;
                },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 512,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$4 = "ripemd160";
    var data$4 = "AGFzbQEAAAABEQRgAAF/YAAAYAF/AGACf38AAwkIAAECAwIBAAIEBQFwAQEBBQQBAQICBg4CfwFB4IkFC38AQcAICweDAQkGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAARByaXBlbWQxNjBfdXBkYXRlAAMLSGFzaF9VcGRhdGUABApIYXNoX0ZpbmFsAAUNSGFzaF9HZXRTdGF0ZQAGDkhhc2hfQ2FsY3VsYXRlAAcKU1RBVEVfU0laRQMBCtAxCAUAQYAJCzoAQQBB8MPLnnw2ApiJAUEAQv6568XpjpWZEDcCkIkBQQBCgcaUupbx6uZvNwKIiQFBAEIANwKAiQELpiwBHn9BACAAKAIkIgEgACgCACICIAAoAhAiAyACIAAoAiwiBCAAKAIMIgUgACgCBCIGIAAoAjwiByACIAAoAjAiCCAHIAAoAggiCUEAKAKIiQEiCkEAKAKQiQEiC0EAKAKUiQEiDEF/c3JBACgCjIkBIg1zaiAAKAIUIg5qQeaXioUFakEId0EAKAKYiQEiD2oiEEEKdyIRaiABIA1BCnciEmogAiALQQp3IhNqIAwgACgCHCIUaiAPIAAoAjgiFWogECANIBNBf3Nyc2pB5peKhQVqQQl3IAxqIhYgECASQX9zcnNqQeaXioUFakEJdyATaiIQIBYgEUF/c3JzakHml4qFBWpBC3cgEmoiFyAQIBZBCnciFkF/c3JzakHml4qFBWpBDXcgEWoiGCAXIBBBCnciGUF/c3JzakHml4qFBWpBD3cgFmoiGkEKdyIbaiAAKAIYIhAgGEEKdyIcaiAAKAI0IhEgF0EKdyIXaiADIBlqIAQgFmogGiAYIBdBf3Nyc2pB5peKhQVqQQ93IBlqIhYgGiAcQX9zcnNqQeaXioUFakEFdyAXaiIXIBYgG0F/c3JzakHml4qFBWpBB3cgHGoiGCAXIBZBCnciGUF/c3JzakHml4qFBWpBB3cgG2oiGiAYIBdBCnciF0F/c3JzakHml4qFBWpBCHcgGWoiG0EKdyIcaiAFIBpBCnciHWogACgCKCIWIBhBCnciGGogBiAXaiAAKAIgIgAgGWogGyAaIBhBf3Nyc2pB5peKhQVqQQt3IBdqIhcgGyAdQX9zcnNqQeaXioUFakEOdyAYaiIYIBcgHEF/c3JzakHml4qFBWpBDncgHWoiGSAYIBdBCnciGkF/c3JzakHml4qFBWpBDHcgHGoiGyAZIBhBCnciHEF/c3JzakHml4qFBWpBBncgGmoiHUEKdyIXaiAUIBtBCnciGGogBSAZQQp3IhlqIAQgHGogECAaaiAdIBlxIBsgGUF/c3FyakGkorfiBWpBCXcgHGoiGiAYcSAdIBhBf3NxcmpBpKK34gVqQQ13IBlqIhkgF3EgGiAXQX9zcXJqQaSit+IFakEPdyAYaiIbIBpBCnciGHEgGSAYQX9zcXJqQaSit+IFakEHdyAXaiIcIBlBCnciF3EgGyAXQX9zcXJqQaSit+IFakEMdyAYaiIdQQp3IhlqIBUgHEEKdyIaaiAWIBtBCnciG2ogDiAXaiARIBhqIB0gG3EgHCAbQX9zcXJqQaSit+IFakEIdyAXaiIXIBpxIB0gGkF/c3FyakGkorfiBWpBCXcgG2oiGCAZcSAXIBlBf3NxcmpBpKK34gVqQQt3IBpqIhsgF0EKdyIXcSAYIBdBf3NxcmpBpKK34gVqQQd3IBlqIhwgGEEKdyIYcSAbIBhBf3NxcmpBpKK34gVqQQd3IBdqIh1BCnciGWogASAcQQp3IhpqIAMgG0EKdyIbaiAIIBhqIAAgF2ogHSAbcSAcIBtBf3NxcmpBpKK34gVqQQx3IBhqIhcgGnEgHSAaQX9zcXJqQaSit+IFakEHdyAbaiIYIBlxIBcgGUF/c3FyakGkorfiBWpBBncgGmoiGiAXQQp3IhdxIBggF0F/c3FyakGkorfiBWpBD3cgGWoiGyAYQQp3IhhxIBogGEF/c3FyakGkorfiBWpBDXcgF2oiHEEKdyIdaiAGIBtBCnciHmogDiAaQQp3IhlqIAcgGGogCSAXaiAcIBlxIBsgGUF/c3FyakGkorfiBWpBC3cgGGoiFyAcQX9zciAec2pB8/3A6wZqQQl3IBlqIhggF0F/c3IgHXNqQfP9wOsGakEHdyAeaiIZIBhBf3NyIBdBCnciF3NqQfP9wOsGakEPdyAdaiIaIBlBf3NyIBhBCnciGHNqQfP9wOsGakELdyAXaiIbQQp3IhxqIAEgGkEKdyIdaiAQIBlBCnciGWogFSAYaiAUIBdqIBsgGkF/c3IgGXNqQfP9wOsGakEIdyAYaiIXIBtBf3NyIB1zakHz/cDrBmpBBncgGWoiGCAXQX9zciAcc2pB8/3A6wZqQQZ3IB1qIhkgGEF/c3IgF0EKdyIXc2pB8/3A6wZqQQ53IBxqIhogGUF/c3IgGEEKdyIYc2pB8/3A6wZqQQx3IBdqIhtBCnciHGogFiAaQQp3Ih1qIAkgGUEKdyIZaiAIIBhqIAAgF2ogGyAaQX9zciAZc2pB8/3A6wZqQQ13IBhqIhcgG0F/c3IgHXNqQfP9wOsGakEFdyAZaiIYIBdBf3NyIBxzakHz/cDrBmpBDncgHWoiGSAYQX9zciAXQQp3IhdzakHz/cDrBmpBDXcgHGoiGiAZQX9zciAYQQp3IhhzakHz/cDrBmpBDXcgF2oiG0EKdyIcaiAQIBpBCnciHWogACAZQQp3IhlqIBEgGGogAyAXaiAbIBpBf3NyIBlzakHz/cDrBmpBB3cgGGoiGiAbQX9zciAdc2pB8/3A6wZqQQV3IBlqIhcgGnEgHCAXQX9zcXJqQenttdMHakEPdyAdaiIYIBdxIBpBCnciGiAYQX9zcXJqQenttdMHakEFdyAcaiIZIBhxIBdBCnciGyAZQX9zcXJqQenttdMHakEIdyAaaiIXQQp3IhxqIAcgGUEKdyIdaiAEIBhBCnciHmogBSAbaiAGIBpqIBcgGXEgHiAXQX9zcXJqQenttdMHakELdyAbaiIYIBdxIB0gGEF/c3FyakHp7bXTB2pBDncgHmoiFyAYcSAcIBdBf3NxcmpB6e210wdqQQ53IB1qIhkgF3EgGEEKdyIaIBlBf3NxcmpB6e210wdqQQZ3IBxqIhggGXEgF0EKdyIbIBhBf3NxcmpB6e210wdqQQ53IBpqIhdBCnciHGogESAYQQp3Ih1qIAkgGUEKdyIZaiAIIBtqIA4gGmogFyAYcSAZIBdBf3NxcmpB6e210wdqQQZ3IBtqIhggF3EgHSAYQX9zcXJqQenttdMHakEJdyAZaiIXIBhxIBwgF0F/c3FyakHp7bXTB2pBDHcgHWoiGSAXcSAYQQp3IhogGUF/c3FyakHp7bXTB2pBCXcgHGoiGCAZcSAXQQp3IhsgGEF/c3FyakHp7bXTB2pBDHcgGmoiF0EKdyIcIAdqIBUgGUEKdyIdaiAWIBtqIBQgGmogFyAYcSAdIBdBf3NxcmpB6e210wdqQQV3IBtqIhkgF3EgGEEKdyIYIBlBf3NxcmpB6e210wdqQQ93IB1qIhcgGXEgHCAXQX9zcXJqQenttdMHakEIdyAYaiIaIBdBCnciG3MgGCAIaiAXIBlBCnciGHMgGnNqQQh3IBxqIhdzakEFdyAYaiIZQQp3IhwgAGogGkEKdyIaIAZqIBggFmogFyAacyAZc2pBDHcgG2oiGCAccyAbIANqIBkgF0EKdyIXcyAYc2pBCXcgGmoiGXNqQQx3IBdqIhogGUEKdyIbcyAXIA5qIBkgGEEKdyIXcyAac2pBBXcgHGoiGHNqQQ53IBdqIhlBCnciHCAVaiAaQQp3IhogCWogFyAUaiAYIBpzIBlzakEGdyAbaiIXIBxzIBsgEGogGSAYQQp3IhhzIBdzakEIdyAaaiIZc2pBDXcgGGoiGiAZQQp3IhtzIBggEWogGSAXQQp3IhhzIBpzakEGdyAcaiIZc2pBBXcgGGoiHEEKdyIdQQAoApSJAWogBCAWIA4gDiARIBYgDiAUIAEgACABIBAgFCAEIBAgBiAPaiATIA1zIAsgDXMgDHMgCmogAmpBC3cgD2oiD3NqQQ53IAxqIhdBCnciHmogAyASaiAJIAxqIA8gEnMgF3NqQQ93IBNqIgwgHnMgBSATaiAXIA9BCnciE3MgDHNqQQx3IBJqIhJzakEFdyATaiIPIBJBCnciF3MgEyAOaiASIAxBCnciDHMgD3NqQQh3IB5qIhJzakEHdyAMaiITQQp3Ih5qIAEgD0EKdyIPaiAMIBRqIBIgD3MgE3NqQQl3IBdqIgwgHnMgFyAAaiATIBJBCnciEnMgDHNqQQt3IA9qIhNzakENdyASaiIPIBNBCnciF3MgEiAWaiATIAxBCnciDHMgD3NqQQ53IB5qIhJzakEPdyAMaiITQQp3Ih5qIBJBCnciCiAHaiAXIBFqIBMgCnMgDCAIaiASIA9BCnciDHMgE3NqQQZ3IBdqIhJzakEHdyAMaiITIBJBCnciD3MgDCAVaiASIB5zIBNzakEJdyAKaiIXc2pBCHcgHmoiDCAXcSATQQp3IhMgDEF/c3FyakGZ84nUBWpBB3cgD2oiEkEKdyIeaiAWIAxBCnciCmogBiAXQQp3IhdqIBEgE2ogAyAPaiASIAxxIBcgEkF/c3FyakGZ84nUBWpBBncgE2oiDCAScSAKIAxBf3NxcmpBmfOJ1AVqQQh3IBdqIhIgDHEgHiASQX9zcXJqQZnzidQFakENdyAKaiITIBJxIAxBCnciDyATQX9zcXJqQZnzidQFakELdyAeaiIMIBNxIBJBCnciFyAMQX9zcXJqQZnzidQFakEJdyAPaiISQQp3Ih5qIAIgDEEKdyIKaiAIIBNBCnciE2ogBSAXaiAHIA9qIBIgDHEgEyASQX9zcXJqQZnzidQFakEHdyAXaiIMIBJxIAogDEF/c3FyakGZ84nUBWpBD3cgE2oiEiAMcSAeIBJBf3NxcmpBmfOJ1AVqQQd3IApqIhMgEnEgDEEKdyIPIBNBf3NxcmpBmfOJ1AVqQQx3IB5qIgwgE3EgEkEKdyIXIAxBf3NxcmpBmfOJ1AVqQQ93IA9qIhJBCnciHmogBCAMQQp3IgpqIBUgE0EKdyITaiAJIBdqIA4gD2ogEiAMcSATIBJBf3NxcmpBmfOJ1AVqQQl3IBdqIgwgEnEgCiAMQX9zcXJqQZnzidQFakELdyATaiISIAxxIB4gEkF/c3FyakGZ84nUBWpBB3cgCmoiEyAScSAMQQp3IgwgE0F/c3FyakGZ84nUBWpBDXcgHmoiDyATcSASQQp3IhIgD0F/cyIKcXJqQZnzidQFakEMdyAMaiIXQQp3Ih5qIAMgD0EKdyIPaiAVIBNBCnciE2ogFiASaiAFIAxqIBcgCnIgE3NqQaHX5/YGakELdyASaiIMIBdBf3NyIA9zakGh1+f2BmpBDXcgE2oiEiAMQX9zciAec2pBodfn9gZqQQZ3IA9qIhMgEkF/c3IgDEEKdyIMc2pBodfn9gZqQQd3IB5qIg8gE0F/c3IgEkEKdyISc2pBodfn9gZqQQ53IAxqIhdBCnciHmogCSAPQQp3IgpqIAYgE0EKdyITaiAAIBJqIAcgDGogFyAPQX9zciATc2pBodfn9gZqQQl3IBJqIgwgF0F/c3IgCnNqQaHX5/YGakENdyATaiISIAxBf3NyIB5zakGh1+f2BmpBD3cgCmoiEyASQX9zciAMQQp3IgxzakGh1+f2BmpBDncgHmoiDyATQX9zciASQQp3IhJzakGh1+f2BmpBCHcgDGoiF0EKdyIeaiAEIA9BCnciCmogESATQQp3IhNqIBAgEmogAiAMaiAXIA9Bf3NyIBNzakGh1+f2BmpBDXcgEmoiDCAXQX9zciAKc2pBodfn9gZqQQZ3IBNqIhIgDEF/c3IgHnNqQaHX5/YGakEFdyAKaiITIBJBf3NyIAxBCnciD3NqQaHX5/YGakEMdyAeaiIXIBNBf3NyIBJBCnciHnNqQaHX5/YGakEHdyAPaiIKQQp3IgxqIAQgF0EKdyISaiABIBNBCnciE2ogBiAeaiAIIA9qIAogF0F/c3IgE3NqQaHX5/YGakEFdyAeaiIPIBJxIAogEkF/c3FyakHc+e74eGpBC3cgE2oiEyAMcSAPIAxBf3NxcmpB3Pnu+HhqQQx3IBJqIhcgD0EKdyIScSATIBJBf3NxcmpB3Pnu+HhqQQ53IAxqIh4gE0EKdyIMcSAXIAxBf3NxcmpB3Pnu+HhqQQ93IBJqIgpBCnciE2ogAyAeQQp3Ig9qIAggF0EKdyIXaiAAIAxqIAIgEmogCiAXcSAeIBdBf3NxcmpB3Pnu+HhqQQ53IAxqIgwgD3EgCiAPQX9zcXJqQdz57vh4akEPdyAXaiISIBNxIAwgE0F/c3FyakHc+e74eGpBCXcgD2oiFyAMQQp3IgxxIBIgDEF/c3FyakHc+e74eGpBCHcgE2oiHiASQQp3IhJxIBcgEkF/c3FyakHc+e74eGpBCXcgDGoiCkEKdyITaiAVIB5BCnciD2ogByAXQQp3IhdqIBQgEmogBSAMaiAKIBdxIB4gF0F/c3FyakHc+e74eGpBDncgEmoiDCAPcSAKIA9Bf3NxcmpB3Pnu+HhqQQV3IBdqIhIgE3EgDCATQX9zcXJqQdz57vh4akEGdyAPaiIPIAxBCnciDHEgEiAMQX9zcXJqQdz57vh4akEIdyATaiIXIBJBCnciEnEgDyASQX9zcXJqQdz57vh4akEGdyAMaiIeQQp3IgpqIAIgF0EKdyIOaiADIA9BCnciE2ogCSASaiAQIAxqIB4gE3EgFyATQX9zcXJqQdz57vh4akEFdyASaiIDIA5xIB4gDkF/c3FyakHc+e74eGpBDHcgE2oiDCADIApBf3Nyc2pBzvrPynpqQQl3IA5qIg4gDCADQQp3IgNBf3Nyc2pBzvrPynpqQQ93IApqIhIgDiAMQQp3IgxBf3Nyc2pBzvrPynpqQQV3IANqIhNBCnciD2ogCSASQQp3IhZqIAggDkEKdyIJaiAUIAxqIAEgA2ogEyASIAlBf3Nyc2pBzvrPynpqQQt3IAxqIgMgEyAWQX9zcnNqQc76z8p6akEGdyAJaiIIIAMgD0F/c3JzakHO+s/KempBCHcgFmoiCSAIIANBCnciA0F/c3JzakHO+s/KempBDXcgD2oiDiAJIAhBCnciCEF/c3JzakHO+s/KempBDHcgA2oiFEEKdyIWaiAAIA5BCnciDGogBSAJQQp3IgBqIAYgCGogFSADaiAUIA4gAEF/c3JzakHO+s/KempBBXcgCGoiAyAUIAxBf3Nyc2pBzvrPynpqQQx3IABqIgAgAyAWQX9zcnNqQc76z8p6akENdyAMaiIGIAAgA0EKdyIDQX9zcnNqQc76z8p6akEOdyAWaiIIIAYgAEEKdyIAQX9zcnNqQc76z8p6akELdyADaiIJQQp3IhVqNgKQiQFBACALIBggAmogGSAaQQp3IgJzIBxzakEPdyAbaiIOQQp3IhZqIBAgA2ogCSAIIAZBCnciA0F/c3JzakHO+s/KempBCHcgAGoiBkEKd2o2AoyJAUEAKAKIiQEhEEEAIA0gGyAFaiAcIBlBCnciBXMgDnNqQQ13IAJqIhRBCndqIAcgAGogBiAJIAhBCnciAEF/c3JzakHO+s/KempBBXcgA2oiB2o2AoiJAUEAKAKYiQEhCEEAIAAgEGogAiABaiAOIB1zIBRzakELdyAFaiIBaiARIANqIAcgBiAVQX9zcnNqQc76z8p6akEGd2o2ApiJAUEAIAAgCGogHWogBSAEaiAUIBZzIAFzakELd2o2ApSJAQuMAgEEfwJAIAFFDQBBACECQQBBACgCgIkBIgMgAWoiBDYCgIkBIANBP3EhBQJAIAQgA08NAEEAQQAoAoSJAUEBajYChIkBCwJAIAVFDQACQEHAACAFayICIAFNDQAgBSECDAELQQAhA0EAIQQDQCADIAVqQZyJAWogACADai0AADoAACACIARBAWoiBEH/AXEiA0sNAAtBnIkBEAIgASACayEBIAAgAmohAEEAIQILAkAgAUHAAEkNAANAIAAQAiAAQcAAaiEAIAFBQGoiAUE/Sw0ACwsgAUUNAEEAIQNBACEEA0AgAyACakGciQFqIAAgA2otAAA6AAAgASAEQQFqIgRB/wFxIgNLDQALCwsJAEGACSAAEAMLggEBAn8jAEEQayIAJAAgAEEAKAKAiQEiAUEDdDYCCCAAQQAoAoSJAUEDdCABQR12cjYCDEGACEE4QfgAIAFBP3EiAUE4SRsgAWsQAyAAQQhqQQgQA0EAQQAoAoiJATYCgAlBAEEAKQKMiQE3AoQJQQBBACkClIkBNwKMCSAAQRBqJAALBgBBgIkBC8EBAQF/IwBBEGsiASQAQQBB8MPLnnw2ApiJAUEAQv6568XpjpWZEDcCkIkBQQBCgcaUupbx6uZvNwKIiQFBAEIANwKAiQFBgAkgABADIAFBACgCgIkBIgBBA3Q2AgggAUEAKAKEiQFBA3QgAEEddnI2AgxBgAhBOEH4ACAAQT9xIgBBOEkbIABrEAMgAUEIakEIEANBAEEAKAKIiQE2AoAJQQBBACkCjIkBNwKECUEAQQApApSJATcCjAkgAUEQaiQACwtLAQBBgAgLRIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcAAAA";
    var hash$4 = "42f1de39";
    var wasmJson$4 = {
    	name: name$4,
    	data: data$4,
    	hash: hash$4
    };

    const mutex$2 = new Mutex();
    let wasmCache$2 = null;
    /**
     * Calculates RIPEMD-160 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function ripemd160(data) {
        if (wasmCache$2 === null) {
            return lockedCreate(mutex$2, wasmJson$4, 20)
                .then((wasm) => {
                wasmCache$2 = wasm;
                return wasmCache$2.calculate(data);
            });
        }
        try {
            const hash = wasmCache$2.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new RIPEMD-160 hash instance
     */
    function createRIPEMD160() {
        return WASMInterface(wasmJson$4, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    function calculateKeyBuffer(hasher, key) {
        const { blockSize } = hasher;
        const buf = getUInt8Buffer(key);
        if (buf.length > blockSize) {
            hasher.update(buf);
            const uintArr = hasher.digest('binary');
            hasher.init();
            return uintArr;
        }
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    }
    function calculateHmac(hasher, key) {
        hasher.init();
        const { blockSize } = hasher;
        const keyBuf = calculateKeyBuffer(hasher, key);
        const keyBuffer = new Uint8Array(blockSize);
        keyBuffer.set(keyBuf);
        const opad = new Uint8Array(blockSize);
        for (let i = 0; i < blockSize; i++) {
            const v = keyBuffer[i];
            opad[i] = v ^ 0x5C;
            keyBuffer[i] = v ^ 0x36;
        }
        hasher.update(keyBuffer);
        const obj = {
            init: () => {
                hasher.init();
                hasher.update(keyBuffer);
                return obj;
            },
            update: (data) => {
                hasher.update(data);
                return obj;
            },
            digest: ((outputType) => {
                const uintArr = hasher.digest('binary');
                hasher.init();
                hasher.update(opad);
                hasher.update(uintArr);
                return hasher.digest(outputType);
            }),
            save: () => {
                throw new Error('save() not supported');
            },
            load: () => {
                throw new Error('load() not supported');
            },
            blockSize: hasher.blockSize,
            digestSize: hasher.digestSize,
        };
        return obj;
    }
    /**
     * Calculates HMAC hash
     * @param hash Hash algorithm to use. It has to be the return value of a function like createSHA1()
     * @param key Key (string, Buffer or TypedArray)
     */
    function createHMAC(hash, key) {
        if (!hash || !hash.then) {
            throw new Error('Invalid hash function is provided! Usage: createHMAC(createMD5(), "key").');
        }
        return hash.then((hasher) => calculateHmac(hasher, key));
    }

    function calculatePBKDF2(digest, salt, iterations, hashLength, outputType) {
        return __awaiter(this, void 0, void 0, function* () {
            const DK = new Uint8Array(hashLength);
            const block1 = new Uint8Array(salt.length + 4);
            const block1View = new DataView(block1.buffer);
            const saltBuffer = getUInt8Buffer(salt);
            const saltUIntBuffer = new Uint8Array(saltBuffer.buffer, saltBuffer.byteOffset, saltBuffer.length);
            block1.set(saltUIntBuffer);
            let destPos = 0;
            const hLen = digest.digestSize;
            const l = Math.ceil(hashLength / hLen);
            let T = null;
            let U = null;
            for (let i = 1; i <= l; i++) {
                block1View.setUint32(salt.length, i);
                digest.init();
                digest.update(block1);
                T = digest.digest('binary');
                U = T.slice();
                for (let j = 1; j < iterations; j++) {
                    digest.init();
                    digest.update(U);
                    U = digest.digest('binary');
                    for (let k = 0; k < hLen; k++) {
                        T[k] ^= U[k];
                    }
                }
                DK.set(T.subarray(0, hashLength - destPos), destPos);
                destPos += hLen;
            }
            if (outputType === 'binary') {
                return DK;
            }
            const digestChars = new Uint8Array(hashLength * 2);
            return getDigestHex(digestChars, DK, hashLength);
        });
    }
    const validateOptions$2 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.hashFunction || !options.hashFunction.then) {
            throw new Error('Invalid hash function is provided! Usage: pbkdf2("password", "salt", 1000, 32, createSHA1()).');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Generates a new PBKDF2 hash for the supplied password
     */
    function pbkdf2(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$2(options);
            const hmac = yield createHMAC(options.hashFunction, options.password);
            return calculatePBKDF2(hmac, options.salt, options.iterations, options.hashLength, options.outputType);
        });
    }

    var name$3 = "scrypt";
    var data$3 = "AGFzbQEAAAABIwZgAX8Bf2AAAX9gBX9/fn9/AGAEf39/fwBgAX8AYAN/f38AAwcGAAECAwQFBAUBcAEBAQUGAQECgIACBggBfwFBkIgECwc5BAZtZW1vcnkCABJIYXNoX1NldE1lbW9yeVNpemUAAA5IYXNoX0dldEJ1ZmZlcgABBnNjcnlwdAAFCpcmBlsBAX9BACEBAkAgAEEAKAKACGsiAEUNAAJAIABBEHYgAEGAgHxxIABJaiIAQABBf0cNAEH/ASEBDAELQQAhAUEAQQApA4AIIABBEHStfDcDgAgLIAFBGHRBGHULagECfwJAQQAoAogIIgANAEEAPwBBEHQiADYCiAhBgIAgQQAoAoAIayIBRQ0AAkAgAUEQdiABQYCAfHEgAUlqIgBAAEF/Rw0AQQAPC0EAQQApA4AIIABBEHStfDcDgAhBACgCiAghAAsgAAu5EAMMfwl+An8gAUEFdCEFIAQgAUEIdGohBiAEIAFBB3QiB2ohCAJAAkACQAJAIAFFDQBBACEJIAAhCiAEIQsDQCALIAooAgA2AgAgCkEEaiEKIAtBBGohCyAJQQFqIgkgBUkNAAsgAlANAiABQQh0IQxBACENIAMhDgNAQQAhCSABIQ8DQCAOIAlqIgogBCAJaiILKQMANwMAIApBCGogC0EIaikDADcDACAKQRBqIAtBEGopAwA3AwAgCkEYaiALQRhqKQMANwMAIApBIGogC0EgaikDADcDACAKQShqIAtBKGopAwA3AwAgCkEwaiALQTBqKQMANwMAIApBOGogC0E4aikDADcDACAKQcAAaiALQcAAaikDADcDACAKQcgAaiALQcgAaikDADcDACAKQdAAaiALQdAAaikDADcDACAKQdgAaiALQdgAaikDADcDACAKQeAAaiALQeAAaikDADcDACAKQegAaiALQegAaikDADcDACAKQfAAaiALQfAAaikDADcDACAKQfgAaiALQfgAaikDADcDACAJQYABaiEJIA9Bf2oiDw0ACyAEIAggBiABEAMgDiEJIAQhDyABIRADQCAJIAdqIgogDyAHaiILKQMANwMAIApBCGogC0EIaikDADcDACAKQRBqIAtBEGopAwA3AwAgCkEYaiALQRhqKQMANwMAIApBIGogC0EgaikDADcDACAKQShqIAtBKGopAwA3AwAgCkEwaiALQTBqKQMANwMAIApBOGogC0E4aikDADcDACAKQcAAaiALQcAAaikDADcDACAKQcgAaiALQcgAaikDADcDACAKQdAAaiALQdAAaikDADcDACAKQdgAaiALQdgAaikDADcDACAKQeAAaiALQeAAaikDADcDACAKQegAaiALQegAaikDADcDACAKQfAAaiALQfAAaikDADcDACAKQfgAaiALQfgAaikDADcDACAJQYABaiEJIA9BgAFqIQ8gEEF/aiIQDQALIAggBCAGIAEQAyAOIAxqIQ4gDUECaiINrSACVA0ADAILCyACUA0CIAhBQGoiCikDOCERIAopAzAhEiAKKQMoIRMgCikDICEUIAopAxghFSAKKQMQIRYgCikDCCEXIAopAwAhGEECIQoDQCAKrSEZIApBAmohCiAZIAJUDQALIAYgETcDOCAGIBI3AzAgBiATNwMoIAYgFDcDICAGIBU3AxggBiAWNwMQIAYgFzcDCCAGIBg3AwALAkAgAUUNACAHQUBqIgogCGohGiACp0F/aiEOIAogBGohGyABQQd0IQ1BACEMA0AgAyANIBsoAgAgDnFsaiEHQQAhCSABIQ8DQCAEIAlqIgogCikDACAHIAlqIgspAwCFNwMAIApBCGoiECAQKQMAIAtBCGopAwCFNwMAIApBEGoiECAQKQMAIAtBEGopAwCFNwMAIApBGGoiECAQKQMAIAtBGGopAwCFNwMAIApBIGoiECAQKQMAIAtBIGopAwCFNwMAIApBKGoiECAQKQMAIAtBKGopAwCFNwMAIApBMGoiECAQKQMAIAtBMGopAwCFNwMAIApBOGoiECAQKQMAIAtBOGopAwCFNwMAIApBwABqIhAgECkDACALQcAAaikDAIU3AwAgCkHIAGoiECAQKQMAIAtByABqKQMAhTcDACAKQdAAaiIQIBApAwAgC0HQAGopAwCFNwMAIApB2ABqIhAgECkDACALQdgAaikDAIU3AwAgCkHgAGoiECAQKQMAIAtB4ABqKQMAhTcDACAKQegAaiIQIBApAwAgC0HoAGopAwCFNwMAIApB8ABqIhAgECkDACALQfAAaikDAIU3AwAgCkH4AGoiCiAKKQMAIAtB+ABqKQMAhTcDACAJQYABaiEJIA9Bf2oiDw0ACyAEIAggBiABEAMgAyANIBooAgAgDnFsaiEHQQAhCSABIQ8DQCAIIAlqIgogCikDACAHIAlqIgspAwCFNwMAIApBCGoiECAQKQMAIAtBCGopAwCFNwMAIApBEGoiECAQKQMAIAtBEGopAwCFNwMAIApBGGoiECAQKQMAIAtBGGopAwCFNwMAIApBIGoiECAQKQMAIAtBIGopAwCFNwMAIApBKGoiECAQKQMAIAtBKGopAwCFNwMAIApBMGoiECAQKQMAIAtBMGopAwCFNwMAIApBOGoiECAQKQMAIAtBOGopAwCFNwMAIApBwABqIhAgECkDACALQcAAaikDAIU3AwAgCkHIAGoiECAQKQMAIAtByABqKQMAhTcDACAKQdAAaiIQIBApAwAgC0HQAGopAwCFNwMAIApB2ABqIhAgECkDACALQdgAaikDAIU3AwAgCkHgAGoiECAQKQMAIAtB4ABqKQMAhTcDACAKQegAaiIQIBApAwAgC0HoAGopAwCFNwMAIApB8ABqIhAgECkDACALQfAAaikDAIU3AwAgCkH4AGoiCiAKKQMAIAtB+ABqKQMAhTcDACAJQYABaiEJIA9Bf2oiDw0ACyAIIAQgBiABEAMgDEECaiIMrSACVA0ADAILCyAIQUBqIgopAzghESAKKQMwIRIgCikDKCETIAopAyAhFCAKKQMYIRUgCikDECEWIAopAwghFyAKKQMAIRhBAiEKA0AgCq0hGSAKQQJqIQogGSACVA0ACyAGIBE3AzggBiASNwMwIAYgEzcDKCAGIBQ3AyAgBiAVNwMYIAYgFjcDECAGIBc3AwggBiAYNwMACyABRQ0AQQAhCgNAIAAgBCgCADYCACAAQQRqIQAgBEEEaiEEIApBAWoiCiAFSQ0ACwsL4wUDAX8IfgJ/IAIgA0EHdCAAakFAaiIEKQMAIgU3AwAgAiAEKQMIIgY3AwggAiAEKQMQIgc3AxAgAiAEKQMYIgg3AxggAiAEKQMgIgk3AyAgAiAEKQMoIgo3AyggAiAEKQMwIgs3AzAgAiAEKQM4Igw3AzgCQCADRQ0AIANBAXQhDSAAQfgAaiEEIANBBnQhDkECIQADQCACIAUgBEGIf2opAwCFNwMAIAIgBiAEQZB/aikDAIU3AwggAiAHIARBmH9qKQMAhTcDECACIAggBEGgf2opAwCFNwMYIAIgCSAEQah/aikDAIU3AyAgAiAKIARBsH9qKQMAhTcDKCACIAsgBEG4f2opAwCFNwMwIAIgDCAEQUBqKQMAhTcDOCACEAQgASACKQMANwMAIAFBCGogAikDCDcDACABQRBqIAIpAxA3AwAgAUEYaiACKQMYNwMAIAFBIGogAikDIDcDACABQShqIAIpAyg3AwAgAUEwaiACKQMwNwMAIAFBOGogAikDODcDACACIAIpAwAgBEFIaikDAIU3AwAgAiACKQMIIARBUGopAwCFNwMIIAIgAikDECAEQVhqKQMAhTcDECACIAIpAxggBEFgaikDAIU3AxggAiACKQMgIARBaGopAwCFNwMgIAIgAikDKCAEQXBqKQMAhTcDKCACIAIpAzAgBEF4aikDAIU3AzAgAiACKQM4IAQpAwCFNwM4IAIQBCABIA5qIgMgAikDADcDACADQQhqIAIpAwg3AwAgA0EQaiACKQMQNwMAIANBGGogAikDGDcDACADQSBqIAIpAyA3AwAgA0EoaiACKQMoNwMAIANBMGogAikDMDcDACADQThqIAIpAzg3AwAgACANTw0BIARBgAFqIQQgAUHAAGohASAAQQJqIQAgAikDOCEMIAIpAzAhCyACKQMoIQogAikDICEJIAIpAxghCCACKQMQIQcgAikDCCEGIAIpAwAhBQwACwsLug0IAX4BfwF+AX8BfgF/AX4SfyAAIAAoAgQgACkDKCIBQiCIpyICIAApAzgiA0IgiKciBGpBB3cgACkDCCIFQiCIp3MiBiAEakEJdyAAKQMYIgdCIIincyIIIAZqQQ13IAJzIgkgB6ciCiABpyILakEHdyADp3MiAiALakEJdyAFp3MiDCACakENdyAKcyINIAxqQRJ3IAtzIg4gACkDACIBQiCIpyIPIAApAxAiA0IgiKciEGpBB3cgACkDICIFQiCIp3MiC2pBB3dzIgogCSAIakESdyAEcyIRIAJqQQd3IAApAzAiB6ciCSABpyISakEHdyADp3MiBCASakEJdyAFp3MiEyAEakENdyAJcyIUcyIJIBFqQQl3IAsgEGpBCXcgB0IgiKdzIhVzIhYgCWpBDXcgAnMiFyAWakESdyARcyIRakEHdyAGIBQgE2pBEncgEnMiEmpBB3cgFSALakENdyAPcyIUcyICIBJqQQl3IAxzIg8gAmpBDXcgBnMiGHMiBiARakEJdyAIIA0gFCAVakESdyAQcyIQIARqQQd3cyIMIBBqQQl3cyIIcyIVIAZqQQ13IApzIhQgDCAKIA5qQQl3IBNzIhMgCmpBDXcgC3MiGSATakESdyAOcyIKakEHdyAXcyILIApqQQl3IA9zIg4gC2pBDXcgDHMiFyAOakESdyAKcyINIAIgCCAMakENdyAEcyIMIAhqQRJ3IBBzIghqQQd3IBlzIgpqQQd3cyIEIBQgFWpBEncgEXMiECALakEHdyAJIBggD2pBEncgEnMiEWpBB3cgDHMiDCARakEJdyATcyISIAxqQQ13IAlzIg9zIgkgEGpBCXcgCiAIakEJdyAWcyITcyIWIAlqQQ13IAtzIhQgFmpBEncgEHMiEGpBB3cgBiAPIBJqQRJ3IBFzIhFqQQd3IBMgCmpBDXcgAnMiC3MiAiARakEJdyAOcyIOIAJqQQ13IAZzIhhzIgYgEGpBCXcgFSAXIAsgE2pBEncgCHMiCCAMakEHd3MiCyAIakEJd3MiE3MiFSAGakENdyAEcyIXIAsgBCANakEJdyAScyISIARqQQ13IApzIhkgEmpBEncgDXMiBGpBB3cgFHMiCiAEakEJdyAOcyIPIApqQQ13IAtzIhQgD2pBEncgBHMiDSACIBMgC2pBDXcgDHMiDCATakESdyAIcyIIakEHdyAZcyILakEHd3MiBCAXIBVqQRJ3IBBzIhAgCmpBB3cgCSAYIA5qQRJ3IBFzIg5qQQd3IAxzIgwgDmpBCXcgEnMiESAMakENdyAJcyIXcyIJIBBqQQl3IAsgCGpBCXcgFnMiEnMiEyAJakENdyAKcyIYIBNqQRJ3IBBzIhBqQQd3IAYgFyARakESdyAOcyIKakEHdyASIAtqQQ13IAJzIhdzIgIgCmpBCXcgD3MiDiACakENdyAGcyIWcyIGIAkgFiAOakESdyAKcyIWakEHdyAVIBQgFyASakESdyAIcyIIIAxqQQd3cyIKIAhqQQl3cyISIApqQQ13IAxzIg9zIgwgFmpBCXcgBCANakEJdyARcyIRcyIVIAxqQQ13IAlzIhQgFWpBEncgFnMiCWpBB3cgAiAPIBJqQRJ3IAhzIghqQQd3IBEgBGpBDXcgC3MiD3MiCyAIakEJdyATcyITIAtqQQ13IAJzIhdzIhZqNgIEIAAgACgCCCAWIAlqQQl3IAogDyARakESdyANcyIRakEHdyAYcyICIBFqQQl3IA5zIg5zIg9qNgIIIAAgACgCDCAPIBZqQQ13IAZzIg1qNgIMIAAgACgCECAGIBBqQQl3IBJzIhIgDiACakENdyAKcyIYIBcgE2pBEncgCHMiCiAMakEHd3MiCCAKakEJd3MiFiAIakENdyAMcyIMajYCECAAIAAoAgAgDSAPakESdyAJc2o2AgAgACAAKAIUIAwgFmpBEncgCnNqNgIUIAAgACgCGCAIajYCGCAAIAAoAhwgFmo2AhwgACAAKAIgIBIgBmpBDXcgBHMiCSAYIA5qQRJ3IBFzIgYgC2pBB3dzIgogBmpBCXcgFXMiBGo2AiAgACAAKAIkIAQgCmpBDXcgC3MiC2o2AiQgACAAKAIoIAsgBGpBEncgBnNqNgIoIAAgACgCLCAKajYCLCAAIAAoAjAgCSASakESdyAQcyIGIAJqQQd3IBRzIgtqNgIwIAAgACgCNCALIAZqQQl3IBNzIgpqNgI0IAAgACgCOCAKIAtqQQ13IAJzIgJqNgI4IAAgACgCPCACIApqQRJ3IAZzajYCPAtyAwF/AX4CfwJAIAJFDQBBACgCiAgiAyAAIAGtIgQgAyAAQQd0IgUgAmxqIgMgAyAFIAFsaiIGEAIgAkEBRg0AIAJBf2ohASAFIQIDQEEAKAKICCACaiAAIAQgAyAGEAIgAiAFaiECIAFBf2oiAQ0ACwsL";
    var hash$3 = "d96fb75f";
    var wasmJson$3 = {
    	name: name$3,
    	data: data$3,
    	hash: hash$3
    };

    function scryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, blockSize, parallelism, hashLength, } = options;
            const SHA256Hasher = createSHA256();
            const blockData = yield pbkdf2({
                password: options.password,
                salt: options.salt,
                iterations: 1,
                hashLength: 128 * blockSize * parallelism,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            const scryptInterface = yield WASMInterface(wasmJson$3, 0);
            // last block is for storing the temporary vectors
            const VSize = 128 * blockSize * costFactor;
            const XYSize = 256 * blockSize;
            scryptInterface.setMemorySize(blockData.length + VSize + XYSize);
            scryptInterface.writeMemory(blockData, 0);
            // mix blocks
            scryptInterface.getExports().scrypt(blockSize, costFactor, parallelism);
            const expensiveSalt = scryptInterface
                .getMemory()
                .subarray(0, 128 * blockSize * parallelism);
            const outputData = yield pbkdf2({
                password: options.password,
                salt: expensiveSalt,
                iterations: 1,
                hashLength,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, outputData, hashLength);
            }
            // return binary format
            return outputData;
        });
    }
    // eslint-disable-next-line no-bitwise
    const isPowerOfTwo = (v) => v && !(v & (v - 1));
    const validateOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.blockSize) || options.blockSize < 1) {
            throw new Error('Block size should be a positive number');
        }
        if (!Number.isInteger(options.costFactor)
            || options.costFactor < 2
            || !isPowerOfTwo(options.costFactor)) {
            throw new Error('Cost factor should be a power of 2, greater than 1');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Calculates hash using the scrypt password-based key derivation function
     * @returns Computed hash as a hexadecimal string or as
     *          Uint8Array depending on the outputType option
     */
    function scrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$1(options);
            return scryptInternal(options);
        });
    }

    var name$2 = "bcrypt";
    var data$2 = "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";
    var hash$2 = "9f4c7b9e";
    var wasmJson$2 = {
    	name: name$2,
    	data: data$2,
    	hash: hash$2
    };

    function bcryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, password, salt } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(salt), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 16);
            const shouldEncode = options.outputType === 'encoded' ? 1 : 0;
            bcryptInterface.getExports().bcrypt(passwordBuffer.length, costFactor, shouldEncode);
            const memory = bcryptInterface.getMemory();
            if (options.outputType === 'encoded') {
                return intArrayToString(memory, 60);
            }
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(24 * 2);
                return getDigestHex(digestChars, memory, 24);
            }
            // return binary format
            // the data is copied to allow GC of the original memory buffer
            return memory.slice(0, 24);
        });
    }
    const validateOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.costFactor) || options.costFactor < 4 || options.costFactor > 31) {
            throw new Error('Cost factor should be a number between 4 and 31');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length !== 16) {
            throw new Error('Salt should be 16 bytes long');
        }
        if (options.outputType === undefined) {
            options.outputType = 'encoded';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the bcrypt password-hashing function
     * @returns Computed hash
     */
    function bcrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions(options);
            return bcryptInternal(options);
        });
    }
    const validateHashCharacters = (hash) => {
        if (!/^\$2[axyb]\$[0-3][0-9]\$[./A-Za-z0-9]{53}$/.test(hash)) {
            return false;
        }
        if (hash[4] === '0' && parseInt(hash[5], 10) < 4) {
            return false;
        }
        if (hash[4] === '3' && parseInt(hash[5], 10) > 1) {
            return false;
        }
        return true;
    };
    const validateVerifyOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
        if (options.hash.length !== 60) {
            throw new Error('Hash should be 60 bytes long');
        }
        if (!validateHashCharacters(options.hash)) {
            throw new Error('Invalid hash');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
    };
    /**
     * Verifies password using bcrypt password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function bcryptVerify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions(options);
            const { hash, password } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(hash), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 60);
            return !!bcryptInterface.getExports().bcrypt_verify(passwordBuffer.length);
        });
    }

    var name$1 = "whirlpool";
    var data$1 = "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";
    var hash$1 = "358808f8";
    var wasmJson$1 = {
    	name: name$1,
    	data: data$1,
    	hash: hash$1
    };

    const mutex$1 = new Mutex();
    let wasmCache$1 = null;
    /**
     * Calculates Whirlpool hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function whirlpool(data) {
        if (wasmCache$1 === null) {
            return lockedCreate(mutex$1, wasmJson$1, 64)
                .then((wasm) => {
                wasmCache$1 = wasm;
                return wasmCache$1.calculate(data);
            });
        }
        try {
            const hash = wasmCache$1.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Whirlpool hash instance
     */
    function createWhirlpool() {
        return WASMInterface(wasmJson$1, 64).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name = "sm3";
    var data = "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";
    var hash = "6e6f46ad";
    var wasmJson = {
    	name: name,
    	data: data,
    	hash: hash
    };

    const mutex = new Mutex();
    let wasmCache = null;
    /**
     * Calculates SM3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sm3(data) {
        if (wasmCache === null) {
            return lockedCreate(mutex, wasmJson, 32)
                .then((wasm) => {
                wasmCache = wasm;
                return wasmCache.calculate(data);
            });
        }
        try {
            const hash = wasmCache.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SM3 hash instance
     */
    function createSM3() {
        return WASMInterface(wasmJson, 32).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                save: () => wasm.save(),
                load: (data) => { wasm.load(data); return obj; },
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    exports.adler32 = adler32;
    exports.argon2Verify = argon2Verify;
    exports.argon2d = argon2d;
    exports.argon2i = argon2i;
    exports.argon2id = argon2id;
    exports.bcrypt = bcrypt;
    exports.bcryptVerify = bcryptVerify;
    exports.blake2b = blake2b;
    exports.blake2s = blake2s;
    exports.blake3 = blake3;
    exports.crc32 = crc32;
    exports.crc32c = crc32c;
    exports.createAdler32 = createAdler32;
    exports.createBLAKE2b = createBLAKE2b;
    exports.createBLAKE2s = createBLAKE2s;
    exports.createBLAKE3 = createBLAKE3;
    exports.createCRC32 = createCRC32;
    exports.createCRC32C = createCRC32C;
    exports.createHMAC = createHMAC;
    exports.createKeccak = createKeccak;
    exports.createMD4 = createMD4;
    exports.createMD5 = createMD5;
    exports.createRIPEMD160 = createRIPEMD160;
    exports.createSHA1 = createSHA1;
    exports.createSHA224 = createSHA224;
    exports.createSHA256 = createSHA256;
    exports.createSHA3 = createSHA3;
    exports.createSHA384 = createSHA384;
    exports.createSHA512 = createSHA512;
    exports.createSM3 = createSM3;
    exports.createWhirlpool = createWhirlpool;
    exports.createXXHash128 = createXXHash128;
    exports.createXXHash3 = createXXHash3;
    exports.createXXHash32 = createXXHash32;
    exports.createXXHash64 = createXXHash64;
    exports.keccak = keccak;
    exports.md4 = md4;
    exports.md5 = md5;
    exports.pbkdf2 = pbkdf2;
    exports.ripemd160 = ripemd160;
    exports.scrypt = scrypt;
    exports.sha1 = sha1;
    exports.sha224 = sha224;
    exports.sha256 = sha256;
    exports.sha3 = sha3;
    exports.sha384 = sha384;
    exports.sha512 = sha512;
    exports.sm3 = sm3;
    exports.whirlpool = whirlpool;
    exports.xxhash128 = xxhash128;
    exports.xxhash3 = xxhash3;
    exports.xxhash32 = xxhash32;
    exports.xxhash64 = xxhash64;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],38:[function(require,module,exports){
'use strict';

module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

},{}],39:[function(require,module,exports){
'use strict';
const isOptionObject = require('is-plain-obj');

const {hasOwnProperty} = Object.prototype;
const {propertyIsEnumerable} = Object;
const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
	value,
	writable: true,
	enumerable: true,
	configurable: true
});

const globalThis = this;
const defaultMergeOptions = {
	concatArrays: false,
	ignoreUndefined: false
};

const getEnumerableOwnPropertyKeys = value => {
	const keys = [];

	for (const key in value) {
		if (hasOwnProperty.call(value, key)) {
			keys.push(key);
		}
	}

	/* istanbul ignore else  */
	if (Object.getOwnPropertySymbols) {
		const symbols = Object.getOwnPropertySymbols(value);

		for (const symbol of symbols) {
			if (propertyIsEnumerable.call(value, symbol)) {
				keys.push(symbol);
			}
		}
	}

	return keys;
};

function clone(value) {
	if (Array.isArray(value)) {
		return cloneArray(value);
	}

	if (isOptionObject(value)) {
		return cloneOptionObject(value);
	}

	return value;
}

function cloneArray(array) {
	const result = array.slice(0, 0);

	getEnumerableOwnPropertyKeys(array).forEach(key => {
		defineProperty(result, key, clone(array[key]));
	});

	return result;
}

function cloneOptionObject(object) {
	const result = Object.getPrototypeOf(object) === null ? Object.create(null) : {};

	getEnumerableOwnPropertyKeys(object).forEach(key => {
		defineProperty(result, key, clone(object[key]));
	});

	return result;
}

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {string[]} keys keys to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
const mergeKeys = (merged, source, keys, config) => {
	keys.forEach(key => {
		if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
			return;
		}

		// Do not recurse into prototype chain of merged
		if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
			defineProperty(merged, key, merge(merged[key], source[key], config));
		} else {
			defineProperty(merged, key, clone(source[key]));
		}
	});

	return merged;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 *
 * see [Array.prototype.concat ( ...arguments )](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat)
 */
const concatArrays = (merged, source, config) => {
	let result = merged.slice(0, 0);
	let resultIndex = 0;

	[merged, source].forEach(array => {
		const indices = [];

		// `result.concat(array)` with cloning
		for (let k = 0; k < array.length; k++) {
			if (!hasOwnProperty.call(array, k)) {
				continue;
			}

			indices.push(String(k));

			if (array === merged) {
				// Already cloned
				defineProperty(result, resultIndex++, array[k]);
			} else {
				defineProperty(result, resultIndex++, clone(array[k]));
			}
		}

		// Merge non-index keys
		result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter(key => !indices.includes(key)), config);
	});

	return result;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
function merge(merged, source, config) {
	if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
		return concatArrays(merged, source, config);
	}

	if (!isOptionObject(source) || !isOptionObject(merged)) {
		return clone(source);
	}

	return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
}

module.exports = function (...options) {
	const config = merge(clone(defaultMergeOptions), (this !== globalThis && this) || {}, defaultMergeOptions);
	let merged = {_: {}};

	for (const option of options) {
		if (option === undefined) {
			continue;
		}

		if (!isOptionObject(option)) {
			throw new TypeError('`' + option + '` is not an Option Object');
		}

		merged = merge(merged, {_: option}, config);
	}

	return merged._;
};

},{"is-plain-obj":38}],40:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],41:[function(require,module,exports){
'use strict';
const strictUriEncode = require('strict-uri-encode');
const decodeComponent = require('decode-uri-component');
const splitOnFirst = require('split-on-first');
const filterObject = require('filter-obj');

const isNullOrUndefined = value => value === null || value === undefined;

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		if (param === '') {
			continue;
		}

		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${encode(object.fragmentIdentifier, options)}`;
	}

	return `${url}${queryString}${hash}`;
};

exports.pick = (input, filter, options) => {
	options = Object.assign({
		parseFragmentIdentifier: true
	}, options);

	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
	return exports.stringifyUrl({
		url,
		query: filterObject(query, filter),
		fragmentIdentifier
	}, options);
};

exports.exclude = (input, filter, options) => {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return exports.pick(input, exclusionFilter, options);
};

},{"decode-uri-component":35,"filter-obj":36,"split-on-first":42,"strict-uri-encode":43}],42:[function(require,module,exports){
'use strict';

module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

},{}],43:[function(require,module,exports){
'use strict';
module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toDate = _interopRequireDefault(require("./lib/toDate"));

var _toFloat = _interopRequireDefault(require("./lib/toFloat"));

var _toInt = _interopRequireDefault(require("./lib/toInt"));

var _toBoolean = _interopRequireDefault(require("./lib/toBoolean"));

var _equals = _interopRequireDefault(require("./lib/equals"));

var _contains = _interopRequireDefault(require("./lib/contains"));

var _matches = _interopRequireDefault(require("./lib/matches"));

var _isEmail = _interopRequireDefault(require("./lib/isEmail"));

var _isURL = _interopRequireDefault(require("./lib/isURL"));

var _isMACAddress = _interopRequireDefault(require("./lib/isMACAddress"));

var _isIP = _interopRequireDefault(require("./lib/isIP"));

var _isIPRange = _interopRequireDefault(require("./lib/isIPRange"));

var _isFQDN = _interopRequireDefault(require("./lib/isFQDN"));

var _isDate = _interopRequireDefault(require("./lib/isDate"));

var _isBoolean = _interopRequireDefault(require("./lib/isBoolean"));

var _isLocale = _interopRequireDefault(require("./lib/isLocale"));

var _isAlpha = _interopRequireWildcard(require("./lib/isAlpha"));

var _isAlphanumeric = _interopRequireWildcard(require("./lib/isAlphanumeric"));

var _isNumeric = _interopRequireDefault(require("./lib/isNumeric"));

var _isPassportNumber = _interopRequireDefault(require("./lib/isPassportNumber"));

var _isPort = _interopRequireDefault(require("./lib/isPort"));

var _isLowercase = _interopRequireDefault(require("./lib/isLowercase"));

var _isUppercase = _interopRequireDefault(require("./lib/isUppercase"));

var _isIMEI = _interopRequireDefault(require("./lib/isIMEI"));

var _isAscii = _interopRequireDefault(require("./lib/isAscii"));

var _isFullWidth = _interopRequireDefault(require("./lib/isFullWidth"));

var _isHalfWidth = _interopRequireDefault(require("./lib/isHalfWidth"));

var _isVariableWidth = _interopRequireDefault(require("./lib/isVariableWidth"));

var _isMultibyte = _interopRequireDefault(require("./lib/isMultibyte"));

var _isSemVer = _interopRequireDefault(require("./lib/isSemVer"));

var _isSurrogatePair = _interopRequireDefault(require("./lib/isSurrogatePair"));

var _isInt = _interopRequireDefault(require("./lib/isInt"));

var _isFloat = _interopRequireWildcard(require("./lib/isFloat"));

var _isDecimal = _interopRequireDefault(require("./lib/isDecimal"));

var _isHexadecimal = _interopRequireDefault(require("./lib/isHexadecimal"));

var _isOctal = _interopRequireDefault(require("./lib/isOctal"));

var _isDivisibleBy = _interopRequireDefault(require("./lib/isDivisibleBy"));

var _isHexColor = _interopRequireDefault(require("./lib/isHexColor"));

var _isRgbColor = _interopRequireDefault(require("./lib/isRgbColor"));

var _isHSL = _interopRequireDefault(require("./lib/isHSL"));

var _isISRC = _interopRequireDefault(require("./lib/isISRC"));

var _isIBAN = _interopRequireWildcard(require("./lib/isIBAN"));

var _isBIC = _interopRequireDefault(require("./lib/isBIC"));

var _isMD = _interopRequireDefault(require("./lib/isMD5"));

var _isHash = _interopRequireDefault(require("./lib/isHash"));

var _isJWT = _interopRequireDefault(require("./lib/isJWT"));

var _isJSON = _interopRequireDefault(require("./lib/isJSON"));

var _isEmpty = _interopRequireDefault(require("./lib/isEmpty"));

var _isLength = _interopRequireDefault(require("./lib/isLength"));

var _isByteLength = _interopRequireDefault(require("./lib/isByteLength"));

var _isUUID = _interopRequireDefault(require("./lib/isUUID"));

var _isMongoId = _interopRequireDefault(require("./lib/isMongoId"));

var _isAfter = _interopRequireDefault(require("./lib/isAfter"));

var _isBefore = _interopRequireDefault(require("./lib/isBefore"));

var _isIn = _interopRequireDefault(require("./lib/isIn"));

var _isCreditCard = _interopRequireDefault(require("./lib/isCreditCard"));

var _isIdentityCard = _interopRequireDefault(require("./lib/isIdentityCard"));

var _isEAN = _interopRequireDefault(require("./lib/isEAN"));

var _isISIN = _interopRequireDefault(require("./lib/isISIN"));

var _isISBN = _interopRequireDefault(require("./lib/isISBN"));

var _isISSN = _interopRequireDefault(require("./lib/isISSN"));

var _isTaxID = _interopRequireDefault(require("./lib/isTaxID"));

var _isMobilePhone = _interopRequireWildcard(require("./lib/isMobilePhone"));

var _isEthereumAddress = _interopRequireDefault(require("./lib/isEthereumAddress"));

var _isCurrency = _interopRequireDefault(require("./lib/isCurrency"));

var _isBtcAddress = _interopRequireDefault(require("./lib/isBtcAddress"));

var _isISO = _interopRequireDefault(require("./lib/isISO8601"));

var _isRFC = _interopRequireDefault(require("./lib/isRFC3339"));

var _isISO31661Alpha = _interopRequireDefault(require("./lib/isISO31661Alpha2"));

var _isISO31661Alpha2 = _interopRequireDefault(require("./lib/isISO31661Alpha3"));

var _isISO2 = _interopRequireDefault(require("./lib/isISO4217"));

var _isBase = _interopRequireDefault(require("./lib/isBase32"));

var _isBase2 = _interopRequireDefault(require("./lib/isBase58"));

var _isBase3 = _interopRequireDefault(require("./lib/isBase64"));

var _isDataURI = _interopRequireDefault(require("./lib/isDataURI"));

var _isMagnetURI = _interopRequireDefault(require("./lib/isMagnetURI"));

var _isMimeType = _interopRequireDefault(require("./lib/isMimeType"));

var _isLatLong = _interopRequireDefault(require("./lib/isLatLong"));

var _isPostalCode = _interopRequireWildcard(require("./lib/isPostalCode"));

var _ltrim = _interopRequireDefault(require("./lib/ltrim"));

var _rtrim = _interopRequireDefault(require("./lib/rtrim"));

var _trim = _interopRequireDefault(require("./lib/trim"));

var _escape = _interopRequireDefault(require("./lib/escape"));

var _unescape = _interopRequireDefault(require("./lib/unescape"));

var _stripLow = _interopRequireDefault(require("./lib/stripLow"));

var _whitelist = _interopRequireDefault(require("./lib/whitelist"));

var _blacklist = _interopRequireDefault(require("./lib/blacklist"));

var _isWhitelisted = _interopRequireDefault(require("./lib/isWhitelisted"));

var _normalizeEmail = _interopRequireDefault(require("./lib/normalizeEmail"));

var _isSlug = _interopRequireDefault(require("./lib/isSlug"));

var _isLicensePlate = _interopRequireDefault(require("./lib/isLicensePlate"));

var _isStrongPassword = _interopRequireDefault(require("./lib/isStrongPassword"));

var _isVAT = _interopRequireDefault(require("./lib/isVAT"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '13.7.0';
var validator = {
  version: version,
  toDate: _toDate.default,
  toFloat: _toFloat.default,
  toInt: _toInt.default,
  toBoolean: _toBoolean.default,
  equals: _equals.default,
  contains: _contains.default,
  matches: _matches.default,
  isEmail: _isEmail.default,
  isURL: _isURL.default,
  isMACAddress: _isMACAddress.default,
  isIP: _isIP.default,
  isIPRange: _isIPRange.default,
  isFQDN: _isFQDN.default,
  isBoolean: _isBoolean.default,
  isIBAN: _isIBAN.default,
  isBIC: _isBIC.default,
  isAlpha: _isAlpha.default,
  isAlphaLocales: _isAlpha.locales,
  isAlphanumeric: _isAlphanumeric.default,
  isAlphanumericLocales: _isAlphanumeric.locales,
  isNumeric: _isNumeric.default,
  isPassportNumber: _isPassportNumber.default,
  isPort: _isPort.default,
  isLowercase: _isLowercase.default,
  isUppercase: _isUppercase.default,
  isAscii: _isAscii.default,
  isFullWidth: _isFullWidth.default,
  isHalfWidth: _isHalfWidth.default,
  isVariableWidth: _isVariableWidth.default,
  isMultibyte: _isMultibyte.default,
  isSemVer: _isSemVer.default,
  isSurrogatePair: _isSurrogatePair.default,
  isInt: _isInt.default,
  isIMEI: _isIMEI.default,
  isFloat: _isFloat.default,
  isFloatLocales: _isFloat.locales,
  isDecimal: _isDecimal.default,
  isHexadecimal: _isHexadecimal.default,
  isOctal: _isOctal.default,
  isDivisibleBy: _isDivisibleBy.default,
  isHexColor: _isHexColor.default,
  isRgbColor: _isRgbColor.default,
  isHSL: _isHSL.default,
  isISRC: _isISRC.default,
  isMD5: _isMD.default,
  isHash: _isHash.default,
  isJWT: _isJWT.default,
  isJSON: _isJSON.default,
  isEmpty: _isEmpty.default,
  isLength: _isLength.default,
  isLocale: _isLocale.default,
  isByteLength: _isByteLength.default,
  isUUID: _isUUID.default,
  isMongoId: _isMongoId.default,
  isAfter: _isAfter.default,
  isBefore: _isBefore.default,
  isIn: _isIn.default,
  isCreditCard: _isCreditCard.default,
  isIdentityCard: _isIdentityCard.default,
  isEAN: _isEAN.default,
  isISIN: _isISIN.default,
  isISBN: _isISBN.default,
  isISSN: _isISSN.default,
  isMobilePhone: _isMobilePhone.default,
  isMobilePhoneLocales: _isMobilePhone.locales,
  isPostalCode: _isPostalCode.default,
  isPostalCodeLocales: _isPostalCode.locales,
  isEthereumAddress: _isEthereumAddress.default,
  isCurrency: _isCurrency.default,
  isBtcAddress: _isBtcAddress.default,
  isISO8601: _isISO.default,
  isRFC3339: _isRFC.default,
  isISO31661Alpha2: _isISO31661Alpha.default,
  isISO31661Alpha3: _isISO31661Alpha2.default,
  isISO4217: _isISO2.default,
  isBase32: _isBase.default,
  isBase58: _isBase2.default,
  isBase64: _isBase3.default,
  isDataURI: _isDataURI.default,
  isMagnetURI: _isMagnetURI.default,
  isMimeType: _isMimeType.default,
  isLatLong: _isLatLong.default,
  ltrim: _ltrim.default,
  rtrim: _rtrim.default,
  trim: _trim.default,
  escape: _escape.default,
  unescape: _unescape.default,
  stripLow: _stripLow.default,
  whitelist: _whitelist.default,
  blacklist: _blacklist.default,
  isWhitelisted: _isWhitelisted.default,
  normalizeEmail: _normalizeEmail.default,
  toString: toString,
  isSlug: _isSlug.default,
  isStrongPassword: _isStrongPassword.default,
  isTaxID: _isTaxID.default,
  isDate: _isDate.default,
  isLicensePlate: _isLicensePlate.default,
  isVAT: _isVAT.default,
  ibanLocales: _isIBAN.locales
};
var _default = validator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
},{"./lib/blacklist":47,"./lib/contains":48,"./lib/equals":49,"./lib/escape":50,"./lib/isAfter":51,"./lib/isAlpha":52,"./lib/isAlphanumeric":53,"./lib/isAscii":54,"./lib/isBIC":55,"./lib/isBase32":56,"./lib/isBase58":57,"./lib/isBase64":58,"./lib/isBefore":59,"./lib/isBoolean":60,"./lib/isBtcAddress":61,"./lib/isByteLength":62,"./lib/isCreditCard":63,"./lib/isCurrency":64,"./lib/isDataURI":65,"./lib/isDate":66,"./lib/isDecimal":67,"./lib/isDivisibleBy":68,"./lib/isEAN":69,"./lib/isEmail":70,"./lib/isEmpty":71,"./lib/isEthereumAddress":72,"./lib/isFQDN":73,"./lib/isFloat":74,"./lib/isFullWidth":75,"./lib/isHSL":76,"./lib/isHalfWidth":77,"./lib/isHash":78,"./lib/isHexColor":79,"./lib/isHexadecimal":80,"./lib/isIBAN":81,"./lib/isIMEI":82,"./lib/isIP":83,"./lib/isIPRange":84,"./lib/isISBN":85,"./lib/isISIN":86,"./lib/isISO31661Alpha2":87,"./lib/isISO31661Alpha3":88,"./lib/isISO4217":89,"./lib/isISO8601":90,"./lib/isISRC":91,"./lib/isISSN":92,"./lib/isIdentityCard":93,"./lib/isIn":94,"./lib/isInt":95,"./lib/isJSON":96,"./lib/isJWT":97,"./lib/isLatLong":98,"./lib/isLength":99,"./lib/isLicensePlate":100,"./lib/isLocale":101,"./lib/isLowercase":102,"./lib/isMACAddress":103,"./lib/isMD5":104,"./lib/isMagnetURI":105,"./lib/isMimeType":106,"./lib/isMobilePhone":107,"./lib/isMongoId":108,"./lib/isMultibyte":109,"./lib/isNumeric":110,"./lib/isOctal":111,"./lib/isPassportNumber":112,"./lib/isPort":113,"./lib/isPostalCode":114,"./lib/isRFC3339":115,"./lib/isRgbColor":116,"./lib/isSemVer":117,"./lib/isSlug":118,"./lib/isStrongPassword":119,"./lib/isSurrogatePair":120,"./lib/isTaxID":121,"./lib/isURL":122,"./lib/isUUID":123,"./lib/isUppercase":124,"./lib/isVAT":125,"./lib/isVariableWidth":126,"./lib/isWhitelisted":127,"./lib/ltrim":128,"./lib/matches":129,"./lib/normalizeEmail":130,"./lib/rtrim":131,"./lib/stripLow":132,"./lib/toBoolean":133,"./lib/toDate":134,"./lib/toFloat":135,"./lib/toInt":136,"./lib/trim":137,"./lib/unescape":138,"./lib/whitelist":145}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commaDecimal = exports.dotDecimal = exports.farsiLocales = exports.arabicLocales = exports.englishLocales = exports.decimal = exports.alphanumeric = exports.alpha = void 0;
var alpha = {
  'en-US': /^[A-Z]+$/i,
  'az-AZ': /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[А-Я]+$/i,
  'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[A-ZÆØÅ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'el-GR': /^[Α-ώ]+$/i,
  'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  'fa-IR': /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
  'fi-FI': /^[A-ZÅÄÖ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'nb-NO': /^[A-ZÆØÅ]+$/i,
  'nl-NL': /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[A-ZÆØÅ]+$/i,
  'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁ]+$/i,
  'sl-SI': /^[A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๐\s]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  'vi-VN': /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[א-ת]+$/,
  fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
  'hi-IN': /^[\u0900-\u0961]+[\u0972-\u097F]*$/i
};
exports.alpha = alpha;
var alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'az-AZ': /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[0-9А-Я]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[0-9A-ZÆØÅ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'el-GR': /^[0-9Α-ω]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fi-FI': /^[0-9A-ZÅÄÖ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'nb-NO': /^[0-9A-ZÆØÅ]+$/i,
  'nl-NL': /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[0-9A-ZÆØÅ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁ]+$/i,
  'sl-SI': /^[0-9A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[0-9A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๙\s]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  'ku-IQ': /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  'vi-VN': /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[0-9א-ת]+$/,
  fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
  'hi-IN': /^[\u0900-\u0963]+[\u0966-\u097F]*$/i
};
exports.alphanumeric = alphanumeric;
var decimal = {
  'en-US': '.',
  ar: '٫'
};
exports.decimal = decimal;
var englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];
exports.englishLocales = englishLocales;

for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = "en-".concat(englishLocales[i]);
  alpha[locale] = alpha['en-US'];
  alphanumeric[locale] = alphanumeric['en-US'];
  decimal[locale] = decimal['en-US'];
} // Source: http://www.localeplanet.com/java/


var arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];
exports.arabicLocales = arabicLocales;

for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
  _locale = "ar-".concat(arabicLocales[_i]);
  alpha[_locale] = alpha.ar;
  alphanumeric[_locale] = alphanumeric.ar;
  decimal[_locale] = decimal.ar;
}

var farsiLocales = ['IR', 'AF'];
exports.farsiLocales = farsiLocales;

for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
  _locale2 = "fa-".concat(farsiLocales[_i2]);
  alphanumeric[_locale2] = alphanumeric.fa;
  decimal[_locale2] = decimal.ar;
} // Source: https://en.wikipedia.org/wiki/Decimal_mark


var dotDecimal = ['ar-EG', 'ar-LB', 'ar-LY'];
exports.dotDecimal = dotDecimal;
var commaDecimal = ['bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-ZM', 'es-ES', 'fr-CA', 'fr-FR', 'id-ID', 'it-IT', 'ku-IQ', 'hi-IN', 'hu-HU', 'nb-NO', 'nn-NO', 'nl-NL', 'pl-PL', 'pt-PT', 'ru-RU', 'sl-SI', 'sr-RS@latin', 'sr-RS', 'sv-SE', 'tr-TR', 'uk-UA', 'vi-VN'];
exports.commaDecimal = commaDecimal;

for (var _i3 = 0; _i3 < dotDecimal.length; _i3++) {
  decimal[dotDecimal[_i3]] = decimal['en-US'];
}

for (var _i4 = 0; _i4 < commaDecimal.length; _i4++) {
  decimal[commaDecimal[_i4]] = ',';
}

alpha['fr-CA'] = alpha['fr-FR'];
alphanumeric['fr-CA'] = alphanumeric['fr-FR'];
alpha['pt-BR'] = alpha['pt-PT'];
alphanumeric['pt-BR'] = alphanumeric['pt-PT'];
decimal['pt-BR'] = decimal['pt-PT']; // see #862

alpha['pl-Pl'] = alpha['pl-PL'];
alphanumeric['pl-Pl'] = alphanumeric['pl-PL'];
decimal['pl-Pl'] = decimal['pl-PL']; // see #1455

alpha['fa-AF'] = alpha.fa;
},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = blacklist;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function blacklist(str, chars) {
  (0, _assertString.default)(str);
  return str.replace(new RegExp("[".concat(chars, "]+"), 'g'), '');
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _toString = _interopRequireDefault(require("./util/toString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaulContainsOptions = {
  ignoreCase: false,
  minOccurrences: 1
};

function contains(str, elem, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaulContainsOptions);

  if (options.ignoreCase) {
    return str.toLowerCase().split((0, _toString.default)(elem).toLowerCase()).length > options.minOccurrences;
  }

  return str.split((0, _toString.default)(elem)).length > options.minOccurrences;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142,"./util/toString":144}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = equals;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function equals(str, comparison) {
  (0, _assertString.default)(str);
  return str === comparison;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escape(str) {
  (0, _assertString.default)(str);
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;');
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAfter;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _toDate = _interopRequireDefault(require("./toDate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAfter(str) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());
  (0, _assertString.default)(str);
  var comparison = (0, _toDate.default)(date);
  var original = (0, _toDate.default)(str);
  return !!(original && comparison && original > comparison);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./toDate":134,"./util/assertString":140}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAlpha;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _alpha = require("./alpha");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAlpha(_str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _assertString.default)(_str);
  var str = _str;
  var ignore = options.ignore;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&'), "]"), 'g'), ''); // escape regex for ignore
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }

  if (locale in _alpha.alpha) {
    return _alpha.alpha[locale].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

var locales = Object.keys(_alpha.alpha);
exports.locales = locales;
},{"./alpha":46,"./util/assertString":140}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAlphanumeric;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _alpha = require("./alpha");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAlphanumeric(_str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _assertString.default)(_str);
  var str = _str;
  var ignore = options.ignore;

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&'), "]"), 'g'), ''); // escape regex for ignore
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }

  if (locale in _alpha.alphanumeric) {
    return _alpha.alphanumeric[locale].test(str);
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

var locales = Object.keys(_alpha.alphanumeric);
exports.locales = locales;
},{"./alpha":46,"./util/assertString":140}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAscii;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-control-regex */
var ascii = /^[\x00-\x7F]+$/;
/* eslint-enable no-control-regex */

function isAscii(str) {
  (0, _assertString.default)(str);
  return ascii.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBIC;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isISO31661Alpha = require("./isISO31661Alpha2");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://en.wikipedia.org/wiki/ISO_9362
var isBICReg = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;

function isBIC(str) {
  (0, _assertString.default)(str); // toUpperCase() should be removed when a new major version goes out that changes
  // the regex to [A-Z] (per the spec).

  if (!_isISO31661Alpha.CountryCodes.has(str.slice(4, 6).toUpperCase())) {
    return false;
  }

  return isBICReg.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isISO31661Alpha2":87,"./util/assertString":140}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase32;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var base32 = /^[A-Z2-7]+=*$/;

function isBase32(str) {
  (0, _assertString.default)(str);
  var len = str.length;

  if (len % 8 === 0 && base32.test(str)) {
    return true;
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase58;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Accepted chars - 123456789ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz
var base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/;

function isBase58(str) {
  (0, _assertString.default)(str);

  if (base58Reg.test(str)) {
    return true;
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBase64;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notBase64 = /[^A-Z0-9+\/=]/i;
var urlSafeBase64 = /^[A-Z0-9_\-]*$/i;
var defaultBase64Options = {
  urlSafe: false
};

function isBase64(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultBase64Options);
  var len = str.length;

  if (options.urlSafe) {
    return urlSafeBase64.test(str);
  }

  if (len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }

  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBefore;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _toDate = _interopRequireDefault(require("./toDate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBefore(str) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());
  (0, _assertString.default)(str);
  var comparison = (0, _toDate.default)(date);
  var original = (0, _toDate.default)(str);
  return !!(original && comparison && original < comparison);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./toDate":134,"./util/assertString":140}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBoolean;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  loose: false
};
var strictBooleans = ['true', 'false', '1', '0'];
var looseBooleans = [].concat(strictBooleans, ['yes', 'no']);

function isBoolean(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;
  (0, _assertString.default)(str);

  if (options.loose) {
    return looseBooleans.includes(str.toLowerCase());
  }

  return strictBooleans.includes(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBtcAddress;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// supports Bech32 addresses
var bech32 = /^(bc1)[a-z0-9]{25,39}$/;
var base58 = /^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/;

function isBtcAddress(str) {
  (0, _assertString.default)(str); // check for bech32

  if (str.startsWith('bc1')) {
    return bech32.test(str);
  }

  return base58.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isByteLength;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;

  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }

  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');

  if (!creditCard.test(sanitized)) {
    return false;
  }

  var sum = 0;
  var digit;
  var tmpNum;
  var shouldDouble;

  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);

    if (shouldDouble) {
      tmpNum *= 2;

      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }

    shouldDouble = !shouldDouble;
  }

  return !!(sum % 10 === 0 ? sanitized : false);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCurrency;

var _merge = _interopRequireDefault(require("./util/merge"));

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function currencyRegex(options) {
  var decimal_digits = "\\d{".concat(options.digits_after_decimal[0], "}");
  options.digits_after_decimal.forEach(function (digit, index) {
    if (index !== 0) decimal_digits = "".concat(decimal_digits, "|\\d{").concat(digit, "}");
  });
  var symbol = "(".concat(options.symbol.replace(/\W/, function (m) {
    return "\\".concat(m);
  }), ")").concat(options.require_symbol ? '' : '?'),
      negative = '-?',
      whole_dollar_amount_without_sep = '[1-9]\\d*',
      whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\".concat(options.thousands_separator, "\\d{3})*"),
      valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
      whole_dollar_amount = "(".concat(valid_whole_dollar_amounts.join('|'), ")?"),
      decimal_amount = "(\\".concat(options.decimal_separator, "(").concat(decimal_digits, "))").concat(options.require_decimal ? '' : '?');
  var pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : ''); // default is negative sign before symbol, but there are two other options (besides parens)

  if (options.allow_negatives && !options.parens_for_negatives) {
    if (options.negative_sign_after_digits) {
      pattern += negative;
    } else if (options.negative_sign_before_digits) {
      pattern = negative + pattern;
    }
  } // South African Rand, for example, uses R 123 (space) and R-123 (no space)


  if (options.allow_negative_sign_placeholder) {
    pattern = "( (?!\\-))?".concat(pattern);
  } else if (options.allow_space_after_symbol) {
    pattern = " ?".concat(pattern);
  } else if (options.allow_space_after_digits) {
    pattern += '( (?!$))?';
  }

  if (options.symbol_after_digits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }

  if (options.allow_negatives) {
    if (options.parens_for_negatives) {
      pattern = "(\\(".concat(pattern, "\\)|").concat(pattern, ")");
    } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
      pattern = negative + pattern;
    }
  } // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space


  return new RegExp("^(?!-? )(?=.*\\d)".concat(pattern, "$"));
}

var default_currency_options = {
  symbol: '$',
  require_symbol: false,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false
};

function isCurrency(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_currency_options);
  return currencyRegex(options).test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDataURI;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validMediaType = /^[a-z]+\/[a-z0-9\-\+]+$/i;
var validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i;
var validData = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;

function isDataURI(str) {
  (0, _assertString.default)(str);
  var data = str.split(',');

  if (data.length < 2) {
    return false;
  }

  var attributes = data.shift().trim().split(';');
  var schemeAndMediaType = attributes.shift();

  if (schemeAndMediaType.substr(0, 5) !== 'data:') {
    return false;
  }

  var mediaType = schemeAndMediaType.substr(5);

  if (mediaType !== '' && !validMediaType.test(mediaType)) {
    return false;
  }

  for (var i = 0; i < attributes.length; i++) {
    if (!(i === attributes.length - 1 && attributes[i].toLowerCase() === 'base64') && !validAttribute.test(attributes[i])) {
      return false;
    }
  }

  for (var _i = 0; _i < data.length; _i++) {
    if (!validData.test(data[_i])) {
      return false;
    }
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDate;

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false
};

function isValidFormat(format) {
  return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(format);
}

function zip(date, format) {
  var zippedArr = [],
      len = Math.min(date.length, format.length);

  for (var i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
}

function isDate(input, options) {
  if (typeof options === 'string') {
    // Allow backward compatbility for old format isDate(input [, format])
    options = (0, _merge.default)({
      format: options
    }, default_date_options);
  } else {
    options = (0, _merge.default)(options, default_date_options);
  }

  if (typeof input === 'string' && isValidFormat(options.format)) {
    var formatDelimiter = options.delimiters.find(function (delimiter) {
      return options.format.indexOf(delimiter) !== -1;
    });
    var dateDelimiter = options.strictMode ? formatDelimiter : options.delimiters.find(function (delimiter) {
      return input.indexOf(delimiter) !== -1;
    });
    var dateAndFormat = zip(input.split(dateDelimiter), options.format.toLowerCase().split(formatDelimiter));
    var dateObj = {};

    var _iterator = _createForOfIteratorHelper(dateAndFormat),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            dateWord = _step$value[0],
            formatWord = _step$value[1];

        if (dateWord.length !== formatWord.length) {
          return false;
        }

        dateObj[formatWord.charAt(0)] = dateWord;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return new Date("".concat(dateObj.m, "/").concat(dateObj.d, "/").concat(dateObj.y)).getDate() === +dateObj.d;
  }

  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/merge":142}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDecimal;

var _merge = _interopRequireDefault(require("./util/merge"));

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _includes = _interopRequireDefault(require("./util/includes"));

var _alpha = require("./alpha");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function decimalRegExp(options) {
  var regExp = new RegExp("^[-+]?([0-9]+)?(\\".concat(_alpha.decimal[options.locale], "[0-9]{").concat(options.decimal_digits, "})").concat(options.force_decimal ? '' : '?', "$"));
  return regExp;
}

var default_decimal_options = {
  force_decimal: false,
  decimal_digits: '1,',
  locale: 'en-US'
};
var blacklist = ['', '-', '+'];

function isDecimal(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_decimal_options);

  if (options.locale in _alpha.decimal) {
    return !(0, _includes.default)(blacklist, str.replace(/ /g, '')) && decimalRegExp(options).test(str);
  }

  throw new Error("Invalid locale '".concat(options.locale, "'"));
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./alpha":46,"./util/assertString":140,"./util/includes":141,"./util/merge":142}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDivisibleBy;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _toFloat = _interopRequireDefault(require("./toFloat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDivisibleBy(str, num) {
  (0, _assertString.default)(str);
  return (0, _toFloat.default)(str) % parseInt(num, 10) === 0;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./toFloat":135,"./util/assertString":140}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEAN;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The most commonly used EAN standard is
 * the thirteen-digit EAN-13, while the
 * less commonly used 8-digit EAN-8 barcode was
 * introduced for use on small packages.
 * Also EAN/UCC-14 is used for Grouping of individual
 * trade items above unit level(Intermediate, Carton or Pallet).
 * For more info about EAN-14 checkout: https://www.gtin.info/itf-14-barcodes/
 * EAN consists of:
 * GS1 prefix, manufacturer code, product code and check digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number
 * Reference: https://www.gtin.info/
 */

/**
 * Define EAN Lenghts; 8 for EAN-8; 13 for EAN-13; 14 for EAN-14
 * and Regular Expression for valid EANs (EAN-8, EAN-13, EAN-14),
 * with exact numberic matching of 8 or 13 or 14 digits [0-9]
 */
var LENGTH_EAN_8 = 8;
var LENGTH_EAN_14 = 14;
var validEanRegex = /^(\d{8}|\d{13}|\d{14})$/;
/**
 * Get position weight given:
 * EAN length and digit index/position
 *
 * @param {number} length
 * @param {number} index
 * @return {number}
 */

function getPositionWeightThroughLengthAndIndex(length, index) {
  if (length === LENGTH_EAN_8 || length === LENGTH_EAN_14) {
    return index % 2 === 0 ? 3 : 1;
  }

  return index % 2 === 0 ? 1 : 3;
}
/**
 * Calculate EAN Check Digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number#Calculation_of_checksum_digit
 *
 * @param {string} ean
 * @return {number}
 */


function calculateCheckDigit(ean) {
  var checksum = ean.slice(0, -1).split('').map(function (char, index) {
    return Number(char) * getPositionWeightThroughLengthAndIndex(ean.length, index);
  }).reduce(function (acc, partialSum) {
    return acc + partialSum;
  }, 0);
  var remainder = 10 - checksum % 10;
  return remainder < 10 ? remainder : 0;
}
/**
 * Check if string is valid EAN:
 * Matches EAN-8/EAN-13/EAN-14 regex
 * Has valid check digit.
 *
 * @param {string} str
 * @return {boolean}
 */


function isEAN(str) {
  (0, _assertString.default)(str);
  var actualCheckDigit = Number(str.slice(-1));
  return validEanRegex.test(str) && actualCheckDigit === calculateCheckDigit(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

var _isByteLength = _interopRequireDefault(require("./isByteLength"));

var _isFQDN = _interopRequireDefault(require("./isFQDN"));

var _isIP = _interopRequireDefault(require("./isIP"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: []
};
/* eslint-disable max-len */

/* eslint-disable no-control-regex */

var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var gmailUserPart = /^[a-z\d]+$/;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
var defaultMaxEmailLength = 254;
/* eslint-enable max-len */

/* eslint-enable no-control-regex */

/**
 * Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
 * @param {String} display_name
 */

function validateDisplayName(display_name) {
  var display_name_without_quotes = display_name.replace(/^"(.+)"$/, '$1'); // display name with only spaces is not valid

  if (!display_name_without_quotes.trim()) {
    return false;
  } // check whether display name contains illegal character


  var contains_illegal = /[\.";<>]/.test(display_name_without_quotes);

  if (contains_illegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (display_name_without_quotes === display_name) {
      return false;
    } // the quotes in display name must start with character symbol \


    var all_start_with_back_slash = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length;

    if (!all_start_with_back_slash) {
      return false;
    }
  }

  return true;
}

function isEmail(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(splitNameAddress);

    if (display_email) {
      var display_name = display_email[1]; // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)

      str = str.replace(display_name, '').replace(/(^<|>$)/g, ''); // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space

      if (display_name.endsWith(' ')) {
        display_name = display_name.substr(0, display_name.length - 1);
      }

      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var lower_domain = domain.toLowerCase();

  if (options.host_blacklist.includes(lower_domain)) {
    return false;
  }

  var user = parts.join('@');

  if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
    /*
      Previously we removed dots for gmail addresses before validating.
      This was removed because it allows `multiple..dots@gmail.com`
      to be reported as valid, but it is not.
      Gmail only normalizes single dots, removing them from here is pointless,
      should be done in normalizeEmail
    */
    user = user.toLowerCase(); // Removing sub-address from username before gmail validation

    var username = user.split('+')[0]; // Dots are not included in gmail length restriction

    if (!(0, _isByteLength.default)(username.replace(/\./g, ''), {
      min: 6,
      max: 30
    })) {
      return false;
    }

    var _user_parts = username.split('.');

    for (var i = 0; i < _user_parts.length; i++) {
      if (!gmailUserPart.test(_user_parts[i])) {
        return false;
      }
    }
  }

  if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, {
    max: 64
  }) || !(0, _isByteLength.default)(domain, {
    max: 254
  }))) {
    return false;
  }

  if (!(0, _isFQDN.default)(domain, {
    require_tld: options.require_tld
  })) {
    if (!options.allow_ip_domain) {
      return false;
    }

    if (!(0, _isIP.default)(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }

      var noBracketdomain = domain.substr(1, domain.length - 2);

      if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
        return false;
      }
    }
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  var user_parts = user.split('.');

  for (var _i = 0; _i < user_parts.length; _i++) {
    if (!pattern.test(user_parts[_i])) {
      return false;
    }
  }

  if (options.blacklisted_chars) {
    if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), 'g')) !== -1) return false;
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isByteLength":62,"./isFQDN":73,"./isIP":83,"./util/assertString":140,"./util/merge":142}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmpty;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_is_empty_options = {
  ignore_whitespace: false
};

function isEmpty(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_is_empty_options);
  return (options.ignore_whitespace ? str.trim().length : str.length) === 0;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEthereumAddress;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eth = /^(0x)[0-9a-f]{40}$/i;

function isEthereumAddress(str) {
  (0, _assertString.default)(str);
  return eth.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFQDN;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_numeric_tld: false,
  allow_wildcard: false
};

function isFQDN(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_fqdn_options);
  /* Remove the optional trailing dot before checking validity */

  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  /* Remove the optional wildcard before checking validity */


  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2);
  }

  var parts = str.split('.');
  var tld = parts[parts.length - 1];

  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false;
    }

    if (!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    } // disallow spaces


    if (/\s/.test(tld)) {
      return false;
    }
  } // reject numeric TLDs


  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false;
  }

  return parts.every(function (part) {
    if (part.length > 63) {
      return false;
    }

    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    } // disallow full-width chars


    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    } // disallow parts starting or ending with hyphen


    if (/^-|-$/.test(part)) {
      return false;
    }

    if (!options.allow_underscores && /_/.test(part)) {
      return false;
    }

    return true;
  });
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFloat;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _alpha = require("./alpha");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFloat(str, options) {
  (0, _assertString.default)(str);
  options = options || {};
  var float = new RegExp("^(?:[-+])?(?:[0-9]+)?(?:\\".concat(options.locale ? _alpha.decimal[options.locale] : '.', "[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$"));

  if (str === '' || str === '.' || str === '-' || str === '+') {
    return false;
  }

  var value = parseFloat(str.replace(',', '.'));
  return float.test(str) && (!options.hasOwnProperty('min') || value >= options.min) && (!options.hasOwnProperty('max') || value <= options.max) && (!options.hasOwnProperty('lt') || value < options.lt) && (!options.hasOwnProperty('gt') || value > options.gt);
}

var locales = Object.keys(_alpha.decimal);
exports.locales = locales;
},{"./alpha":46,"./util/assertString":140}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFullWidth;
exports.fullWidth = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
exports.fullWidth = fullWidth;

function isFullWidth(str) {
  (0, _assertString.default)(str);
  return fullWidth.test(str);
}
},{"./util/assertString":140}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHSL;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hslComma = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(,(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}(,((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?))?\)$/i;
var hslSpace = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(\s(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s?(\/\s((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s?)?\)$/i;

function isHSL(str) {
  (0, _assertString.default)(str); // Strip duplicate spaces before calling the validation regex (See  #1598 for more info)

  var strippedStr = str.replace(/\s+/g, ' ').replace(/\s?(hsla?\(|\)|,)\s?/ig, '$1');

  if (strippedStr.indexOf(',') !== -1) {
    return hslComma.test(strippedStr);
  }

  return hslSpace.test(strippedStr);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHalfWidth;
exports.halfWidth = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
exports.halfWidth = halfWidth;

function isHalfWidth(str) {
  (0, _assertString.default)(str);
  return halfWidth.test(str);
}
},{"./util/assertString":140}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHash;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8
};

function isHash(str, algorithm) {
  (0, _assertString.default)(str);
  var hash = new RegExp("^[a-fA-F0-9]{".concat(lengths[algorithm], "}$"));
  return hash.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexColor;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

function isHexColor(str) {
  (0, _assertString.default)(str);
  return hexcolor.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isHexadecimal;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hexadecimal = /^(0x|0h)?[0-9A-F]+$/i;

function isHexadecimal(str) {
  (0, _assertString.default)(str);
  return hexadecimal.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIBAN;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * List of country codes with
 * corresponding IBAN regular expression
 * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
 */
var ibanRegexThroughCountryCode = {
  AD: /^(AD[0-9]{2})\d{8}[A-Z0-9]{12}$/,
  AE: /^(AE[0-9]{2})\d{3}\d{16}$/,
  AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  AT: /^(AT[0-9]{2})\d{16}$/,
  AZ: /^(AZ[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  BA: /^(BA[0-9]{2})\d{16}$/,
  BE: /^(BE[0-9]{2})\d{12}$/,
  BG: /^(BG[0-9]{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
  BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
  BR: /^(BR[0-9]{2})\d{23}[A-Z]{1}[A-Z0-9]{1}$/,
  BY: /^(BY[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  CH: /^(CH[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  CR: /^(CR[0-9]{2})\d{18}$/,
  CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  CZ: /^(CZ[0-9]{2})\d{20}$/,
  DE: /^(DE[0-9]{2})\d{18}$/,
  DK: /^(DK[0-9]{2})\d{14}$/,
  DO: /^(DO[0-9]{2})[A-Z]{4}\d{20}$/,
  EE: /^(EE[0-9]{2})\d{16}$/,
  EG: /^(EG[0-9]{2})\d{25}$/,
  ES: /^(ES[0-9]{2})\d{20}$/,
  FI: /^(FI[0-9]{2})\d{14}$/,
  FO: /^(FO[0-9]{2})\d{14}$/,
  FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
  GE: /^(GE[0-9]{2})[A-Z0-9]{2}\d{16}$/,
  GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
  GL: /^(GL[0-9]{2})\d{14}$/,
  GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
  GT: /^(GT[0-9]{2})[A-Z0-9]{4}[A-Z0-9]{20}$/,
  HR: /^(HR[0-9]{2})\d{17}$/,
  HU: /^(HU[0-9]{2})\d{24}$/,
  IE: /^(IE[0-9]{2})[A-Z0-9]{4}\d{14}$/,
  IL: /^(IL[0-9]{2})\d{19}$/,
  IQ: /^(IQ[0-9]{2})[A-Z]{4}\d{15}$/,
  IR: /^(IR[0-9]{2})0\d{2}0\d{18}$/,
  IS: /^(IS[0-9]{2})\d{22}$/,
  IT: /^(IT[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  JO: /^(JO[0-9]{2})[A-Z]{4}\d{22}$/,
  KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
  KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
  LC: /^(LC[0-9]{2})[A-Z]{4}[A-Z0-9]{24}$/,
  LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  LT: /^(LT[0-9]{2})\d{16}$/,
  LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
  MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  MD: /^(MD[0-9]{2})[A-Z0-9]{20}$/,
  ME: /^(ME[0-9]{2})\d{18}$/,
  MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{10}\d{2}$/,
  MR: /^(MR[0-9]{2})\d{23}$/,
  MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
  MU: /^(MU[0-9]{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
  MZ: /^(MZ[0-9]{2})\d{21}$/,
  NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
  NO: /^(NO[0-9]{2})\d{11}$/,
  PK: /^(PK[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  PL: /^(PL[0-9]{2})\d{24}$/,
  PS: /^(PS[0-9]{2})[A-Z0-9]{4}\d{21}$/,
  PT: /^(PT[0-9]{2})\d{21}$/,
  QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
  RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
  RS: /^(RS[0-9]{2})\d{18}$/,
  SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
  SC: /^(SC[0-9]{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
  SE: /^(SE[0-9]{2})\d{20}$/,
  SI: /^(SI[0-9]{2})\d{15}$/,
  SK: /^(SK[0-9]{2})\d{20}$/,
  SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  SV: /^(SV[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  TL: /^(TL[0-9]{2})\d{19}$/,
  TN: /^(TN[0-9]{2})\d{20}$/,
  TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
  UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
  VA: /^(VA[0-9]{2})\d{18}$/,
  VG: /^(VG[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  XK: /^(XK[0-9]{2})\d{16}$/
};
/**
 * Check whether string has correct universal IBAN format
 * The IBAN consists of up to 34 alphanumeric characters, as follows:
 * Country Code using ISO 3166-1 alpha-2, two letters
 * check digits, two digits and
 * Basic Bank Account Number (BBAN), up to 30 alphanumeric characters.
 * NOTE: Permitted IBAN characters are: digits [0-9] and the 26 latin alphabetic [A-Z]
 *
 * @param {string} str - string under validation
 * @return {boolean}
 */

function hasValidIbanFormat(str) {
  // Strip white spaces and hyphens
  var strippedStr = str.replace(/[\s\-]+/gi, '').toUpperCase();
  var isoCountryCode = strippedStr.slice(0, 2).toUpperCase();
  return isoCountryCode in ibanRegexThroughCountryCode && ibanRegexThroughCountryCode[isoCountryCode].test(strippedStr);
}
/**
   * Check whether string has valid IBAN Checksum
   * by performing basic mod-97 operation and
   * the remainder should equal 1
   * -- Start by rearranging the IBAN by moving the four initial characters to the end of the string
   * -- Replace each letter in the string with two digits, A -> 10, B = 11, Z = 35
   * -- Interpret the string as a decimal integer and
   * -- compute the remainder on division by 97 (mod 97)
   * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
   *
   * @param {string} str
   * @return {boolean}
   */


function hasValidIbanChecksum(str) {
  var strippedStr = str.replace(/[^A-Z0-9]+/gi, '').toUpperCase(); // Keep only digits and A-Z latin alphabetic

  var rearranged = strippedStr.slice(4) + strippedStr.slice(0, 4);
  var alphaCapsReplacedWithDigits = rearranged.replace(/[A-Z]/g, function (char) {
    return char.charCodeAt(0) - 55;
  });
  var remainder = alphaCapsReplacedWithDigits.match(/\d{1,7}/g).reduce(function (acc, value) {
    return Number(acc + value) % 97;
  }, '');
  return remainder === 1;
}

function isIBAN(str) {
  (0, _assertString.default)(str);
  return hasValidIbanFormat(str) && hasValidIbanChecksum(str);
}

var locales = Object.keys(ibanRegexThroughCountryCode);
exports.locales = locales;
},{"./util/assertString":140}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIMEI;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imeiRegexWithoutHypens = /^[0-9]{15}$/;
var imeiRegexWithHypens = /^\d{2}-\d{6}-\d{6}-\d{1}$/;

function isIMEI(str, options) {
  (0, _assertString.default)(str);
  options = options || {}; // default regex for checking imei is the one without hyphens

  var imeiRegex = imeiRegexWithoutHypens;

  if (options.allow_hyphens) {
    imeiRegex = imeiRegexWithHypens;
  }

  if (!imeiRegex.test(str)) {
    return false;
  }

  str = str.replace(/-/g, '');
  var sum = 0,
      mul = 2,
      l = 14;

  for (var i = 0; i < l; i++) {
    var digit = str.substring(l - i - 1, l - i);
    var tp = parseInt(digit, 10) * mul;

    if (tp >= 10) {
      sum += tp % 10 + 1;
    } else {
      sum += tp;
    }

    if (mul === 1) {
      mul += 1;
    } else {
      mul -= 1;
    }
  }

  var chk = (10 - sum % 10) % 10;

  if (chk !== parseInt(str.substring(14, 15), 10)) {
    return false;
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
11.3.  Examples

   The following addresses

             fe80::1234 (on the 1st link of the node)
             ff02::5678 (on the 5th link of the node)
             ff08::9abc (on the 10th organization of the node)

   would be represented as follows:

             fe80::1234%1
             ff02::5678%5
             ff08::9abc%10

   (Here we assume a natural translation from a zone index to the
   <zone_id> part, where the Nth zone of any scope is translated into
   "N".)

   If we use interface names as <zone_id>, those addresses could also be
   represented as follows:

            fe80::1234%ne0
            ff02::5678%pvc1.3
            ff08::9abc%interface10

   where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
   to the 5th link, and "interface10" belongs to the 10th organization.
 * * */
var IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
var IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
var IPv6AddressRegExp = new RegExp('^(' + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ')(%[0-9a-zA-Z-.:]{1,})?$');

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  version = String(version);

  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  }

  if (version === '4') {
    if (!IPv4AddressRegExp.test(str)) {
      return false;
    }

    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  }

  if (version === '6') {
    return !!IPv6AddressRegExp.test(str);
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIPRange;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isIP = _interopRequireDefault(require("./isIP"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subnetMaybe = /^\d{1,3}$/;
var v4Subnet = 32;
var v6Subnet = 128;

function isIPRange(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  var parts = str.split('/'); // parts[0] -> ip, parts[1] -> subnet

  if (parts.length !== 2) {
    return false;
  }

  if (!subnetMaybe.test(parts[1])) {
    return false;
  } // Disallow preceding 0 i.e. 01, 02, ...


  if (parts[1].length > 1 && parts[1].startsWith('0')) {
    return false;
  }

  var isValidIP = (0, _isIP.default)(parts[0], version);

  if (!isValidIP) {
    return false;
  } // Define valid subnet according to IP's version


  var expectedSubnet = null;

  switch (String(version)) {
    case '4':
      expectedSubnet = v4Subnet;
      break;

    case '6':
      expectedSubnet = v6Subnet;
      break;

    default:
      expectedSubnet = (0, _isIP.default)(parts[0], '6') ? v6Subnet : v4Subnet;
  }

  return parts[1] <= expectedSubnet && parts[1] >= 0;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isIP":83,"./util/assertString":140}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISBN;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
var isbn13Maybe = /^(?:[0-9]{13})$/;
var factor = [1, 3];

function isISBN(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  version = String(version);

  if (!version) {
    return isISBN(str, 10) || isISBN(str, 13);
  }

  var sanitized = str.replace(/[\s-]+/g, '');
  var checksum = 0;
  var i;

  if (version === '10') {
    if (!isbn10Maybe.test(sanitized)) {
      return false;
    }

    for (i = 0; i < 9; i++) {
      checksum += (i + 1) * sanitized.charAt(i);
    }

    if (sanitized.charAt(9) === 'X') {
      checksum += 10 * 10;
    } else {
      checksum += 10 * sanitized.charAt(9);
    }

    if (checksum % 11 === 0) {
      return !!sanitized;
    }
  } else if (version === '13') {
    if (!isbn13Maybe.test(sanitized)) {
      return false;
    }

    for (i = 0; i < 12; i++) {
      checksum += factor[i % 2] * sanitized.charAt(i);
    }

    if (sanitized.charAt(12) - (10 - checksum % 10) % 10 === 0) {
      return !!sanitized;
    }
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISIN;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/; // this link details how the check digit is calculated:
// https://www.isin.org/isin-format/. it is a little bit
// odd in that it works with digits, not numbers. in order
// to make only one pass through the ISIN characters, the
// each alpha character is handled as 2 characters within
// the loop.

function isISIN(str) {
  (0, _assertString.default)(str);

  if (!isin.test(str)) {
    return false;
  }

  var double = true;
  var sum = 0; // convert values

  for (var i = str.length - 2; i >= 0; i--) {
    if (str[i] >= 'A' && str[i] <= 'Z') {
      var value = str[i].charCodeAt(0) - 55;
      var lo = value % 10;
      var hi = Math.trunc(value / 10); // letters have two digits, so handle the low order
      // and high order digits separately.

      for (var _i = 0, _arr = [lo, hi]; _i < _arr.length; _i++) {
        var digit = _arr[_i];

        if (double) {
          if (digit >= 5) {
            sum += 1 + (digit - 5) * 2;
          } else {
            sum += digit * 2;
          }
        } else {
          sum += digit;
        }

        double = !double;
      }
    } else {
      var _digit = str[i].charCodeAt(0) - '0'.charCodeAt(0);

      if (double) {
        if (_digit >= 5) {
          sum += 1 + (_digit - 5) * 2;
        } else {
          sum += _digit * 2;
        }
      } else {
        sum += _digit;
      }

      double = !double;
    }
  }

  var check = Math.trunc((sum + 9) / 10) * 10 - sum;
  return +str[str.length - 1] === check;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO31661Alpha2;
exports.CountryCodes = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
var validISO31661Alpha2CountriesCodes = new Set(['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW']);

function isISO31661Alpha2(str) {
  (0, _assertString.default)(str);
  return validISO31661Alpha2CountriesCodes.has(str.toUpperCase());
}

var CountryCodes = validISO31661Alpha2CountriesCodes;
exports.CountryCodes = CountryCodes;
},{"./util/assertString":140}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO31661Alpha3;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
var validISO31661Alpha3CountriesCodes = new Set(['AFG', 'ALA', 'ALB', 'DZA', 'ASM', 'AND', 'AGO', 'AIA', 'ATA', 'ATG', 'ARG', 'ARM', 'ABW', 'AUS', 'AUT', 'AZE', 'BHS', 'BHR', 'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'BEN', 'BMU', 'BTN', 'BOL', 'BES', 'BIH', 'BWA', 'BVT', 'BRA', 'IOT', 'BRN', 'BGR', 'BFA', 'BDI', 'KHM', 'CMR', 'CAN', 'CPV', 'CYM', 'CAF', 'TCD', 'CHL', 'CHN', 'CXR', 'CCK', 'COL', 'COM', 'COG', 'COD', 'COK', 'CRI', 'CIV', 'HRV', 'CUB', 'CUW', 'CYP', 'CZE', 'DNK', 'DJI', 'DMA', 'DOM', 'ECU', 'EGY', 'SLV', 'GNQ', 'ERI', 'EST', 'ETH', 'FLK', 'FRO', 'FJI', 'FIN', 'FRA', 'GUF', 'PYF', 'ATF', 'GAB', 'GMB', 'GEO', 'DEU', 'GHA', 'GIB', 'GRC', 'GRL', 'GRD', 'GLP', 'GUM', 'GTM', 'GGY', 'GIN', 'GNB', 'GUY', 'HTI', 'HMD', 'VAT', 'HND', 'HKG', 'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'IRL', 'IMN', 'ISR', 'ITA', 'JAM', 'JPN', 'JEY', 'JOR', 'KAZ', 'KEN', 'KIR', 'PRK', 'KOR', 'KWT', 'KGZ', 'LAO', 'LVA', 'LBN', 'LSO', 'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MAC', 'MKD', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'MLT', 'MHL', 'MTQ', 'MRT', 'MUS', 'MYT', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MSR', 'MAR', 'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'NLD', 'NCL', 'NZL', 'NIC', 'NER', 'NGA', 'NIU', 'NFK', 'MNP', 'NOR', 'OMN', 'PAK', 'PLW', 'PSE', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'PCN', 'POL', 'PRT', 'PRI', 'QAT', 'REU', 'ROU', 'RUS', 'RWA', 'BLM', 'SHN', 'KNA', 'LCA', 'MAF', 'SPM', 'VCT', 'WSM', 'SMR', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SXM', 'SVK', 'SVN', 'SLB', 'SOM', 'ZAF', 'SGS', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SJM', 'SWZ', 'SWE', 'CHE', 'SYR', 'TWN', 'TJK', 'TZA', 'THA', 'TLS', 'TGO', 'TKL', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TCA', 'TUV', 'UGA', 'UKR', 'ARE', 'GBR', 'USA', 'UMI', 'URY', 'UZB', 'VUT', 'VEN', 'VNM', 'VGB', 'VIR', 'WLF', 'ESH', 'YEM', 'ZMB', 'ZWE']);

function isISO31661Alpha3(str) {
  (0, _assertString.default)(str);
  return validISO31661Alpha3CountriesCodes.has(str.toUpperCase());
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO4217;
exports.CurrencyCodes = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// from https://en.wikipedia.org/wiki/ISO_4217
var validISO4217CurrencyCodes = new Set(['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWL']);

function isISO4217(str) {
  (0, _assertString.default)(str);
  return validISO4217CurrencyCodes.has(str.toUpperCase());
}

var CurrencyCodes = validISO4217CurrencyCodes;
exports.CurrencyCodes = CurrencyCodes;
},{"./util/assertString":140}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISO8601;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/; // same as above, except with a strict 'T' separator between date and time

var iso8601StrictSeparator = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
/* eslint-enable max-len */

var isValidDate = function isValidDate(str) {
  // str must have passed the ISO8601 check
  // this check is meant to catch invalid dates
  // like 2009-02-31
  // first check for ordinal dates
  var ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);

  if (ordinalMatch) {
    var oYear = Number(ordinalMatch[1]);
    var oDay = Number(ordinalMatch[2]); // if is leap year

    if (oYear % 4 === 0 && oYear % 100 !== 0 || oYear % 400 === 0) return oDay <= 366;
    return oDay <= 365;
  }

  var match = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
  var year = match[1];
  var month = match[2];
  var day = match[3];
  var monthString = month ? "0".concat(month).slice(-2) : month;
  var dayString = day ? "0".concat(day).slice(-2) : day; // create a date object and compare

  var d = new Date("".concat(year, "-").concat(monthString || '01', "-").concat(dayString || '01'));

  if (month && day) {
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
  }

  return true;
};

function isISO8601(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  var check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str);
  if (check && options.strict) return isValidDate(str);
  return check;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISRC;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// see http://isrc.ifpi.org/en/isrc-standard/code-syntax
var isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;

function isISRC(str) {
  (0, _assertString.default)(str);
  return isrc.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isISSN;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var issn = '^\\d{4}-?\\d{3}[\\dX]$';

function isISSN(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  var testIssn = issn;
  testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn;
  testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i');

  if (!testIssn.test(str)) {
    return false;
  }

  var digits = str.replace('-', '').toUpperCase();
  var checksum = 0;

  for (var i = 0; i < digits.length; i++) {
    var digit = digits[i];
    checksum += (digit === 'X' ? 10 : +digit) * (8 - i);
  }

  return checksum % 11 === 0;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIdentityCard;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isInt = _interopRequireDefault(require("./isInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validators = {
  PL: function PL(str) {
    (0, _assertString.default)(str);
    var weightOfDigits = {
      1: 1,
      2: 3,
      3: 7,
      4: 9,
      5: 1,
      6: 3,
      7: 7,
      8: 9,
      9: 1,
      10: 3,
      11: 0
    };

    if (str != null && str.length === 11 && (0, _isInt.default)(str, {
      allow_leading_zeroes: true
    })) {
      var digits = str.split('').slice(0, -1);
      var sum = digits.reduce(function (acc, digit, index) {
        return acc + Number(digit) * weightOfDigits[index + 1];
      }, 0);
      var modulo = sum % 10;
      var lastDigit = Number(str.charAt(str.length - 1));

      if (modulo === 0 && lastDigit === 0 || lastDigit === 10 - modulo) {
        return true;
      }
    }

    return false;
  },
  ES: function ES(str) {
    (0, _assertString.default)(str);
    var DNI = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    var charsValue = {
      X: 0,
      Y: 1,
      Z: 2
    };
    var controlDigits = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E']; // sanitize user input

    var sanitized = str.trim().toUpperCase(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    } // validate the control digit


    var number = sanitized.slice(0, -1).replace(/[X,Y,Z]/g, function (char) {
      return charsValue[char];
    });
    return sanitized.endsWith(controlDigits[number % 23]);
  },
  FI: function FI(str) {
    // https://dvv.fi/en/personal-identity-code#:~:text=control%20character%20for%20a-,personal,-identity%20code%20calculated
    (0, _assertString.default)(str);

    if (str.length !== 11) {
      return false;
    }

    if (!str.match(/^\d{6}[\-A\+]\d{3}[0-9ABCDEFHJKLMNPRSTUVWXY]{1}$/)) {
      return false;
    }

    var checkDigits = '0123456789ABCDEFHJKLMNPRSTUVWXY';
    var idAsNumber = parseInt(str.slice(0, 6), 10) * 1000 + parseInt(str.slice(7, 10), 10);
    var remainder = idAsNumber % 31;
    var checkDigit = checkDigits[remainder];
    return checkDigit === str.slice(10, 11);
  },
  IN: function IN(str) {
    var DNI = /^[1-9]\d{3}\s?\d{4}\s?\d{4}$/; // multiplication table

    var d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]]; // permutation table

    var p = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]]; // sanitize user input

    var sanitized = str.trim(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    }

    var c = 0;
    var invertedArray = sanitized.replace(/\s/g, '').split('').map(Number).reverse();
    invertedArray.forEach(function (val, i) {
      c = d[c][p[i % 8][val]];
    });
    return c === 0;
  },
  IR: function IR(str) {
    if (!str.match(/^\d{10}$/)) return false;
    str = "0000".concat(str).substr(str.length - 6);
    if (parseInt(str.substr(3, 6), 10) === 0) return false;
    var lastNumber = parseInt(str.substr(9, 1), 10);
    var sum = 0;

    for (var i = 0; i < 9; i++) {
      sum += parseInt(str.substr(i, 1), 10) * (10 - i);
    }

    sum %= 11;
    return sum < 2 && lastNumber === sum || sum >= 2 && lastNumber === 11 - sum;
  },
  IT: function IT(str) {
    if (str.length !== 9) return false;
    if (str === 'CA00000AA') return false; // https://it.wikipedia.org/wiki/Carta_d%27identit%C3%A0_elettronica_italiana

    return str.search(/C[A-Z][0-9]{5}[A-Z]{2}/i) > -1;
  },
  NO: function NO(str) {
    var sanitized = str.trim();
    if (isNaN(Number(sanitized))) return false;
    if (sanitized.length !== 11) return false;
    if (sanitized === '00000000000') return false; // https://no.wikipedia.org/wiki/F%C3%B8dselsnummer

    var f = sanitized.split('').map(Number);
    var k1 = (11 - (3 * f[0] + 7 * f[1] + 6 * f[2] + 1 * f[3] + 8 * f[4] + 9 * f[5] + 4 * f[6] + 5 * f[7] + 2 * f[8]) % 11) % 11;
    var k2 = (11 - (5 * f[0] + 4 * f[1] + 3 * f[2] + 2 * f[3] + 7 * f[4] + 6 * f[5] + 5 * f[6] + 4 * f[7] + 3 * f[8] + 2 * k1) % 11) % 11;
    if (k1 !== f[9] || k2 !== f[10]) return false;
    return true;
  },
  TH: function TH(str) {
    if (!str.match(/^[1-8]\d{12}$/)) return false; // validate check digit

    var sum = 0;

    for (var i = 0; i < 12; i++) {
      sum += parseInt(str[i], 10) * (13 - i);
    }

    return str[12] === ((11 - sum % 11) % 10).toString();
  },
  LK: function LK(str) {
    var old_nic = /^[1-9]\d{8}[vx]$/i;
    var new_nic = /^[1-9]\d{11}$/i;
    if (str.length === 10 && old_nic.test(str)) return true;else if (str.length === 12 && new_nic.test(str)) return true;
    return false;
  },
  'he-IL': function heIL(str) {
    var DNI = /^\d{9}$/; // sanitize user input

    var sanitized = str.trim(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    }

    var id = sanitized;
    var sum = 0,
        incNum;

    for (var i = 0; i < id.length; i++) {
      incNum = Number(id[i]) * (i % 2 + 1); // Multiply number by 1 or 2

      sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
    }

    return sum % 10 === 0;
  },
  'ar-LY': function arLY(str) {
    // Libya National Identity Number NIN is 12 digits, the first digit is either 1 or 2
    var NIN = /^(1|2)\d{11}$/; // sanitize user input

    var sanitized = str.trim(); // validate the data structure

    if (!NIN.test(sanitized)) {
      return false;
    }

    return true;
  },
  'ar-TN': function arTN(str) {
    var DNI = /^\d{8}$/; // sanitize user input

    var sanitized = str.trim(); // validate the data structure

    if (!DNI.test(sanitized)) {
      return false;
    }

    return true;
  },
  'zh-CN': function zhCN(str) {
    var provincesAndCities = ['11', // 北京
    '12', // 天津
    '13', // 河北
    '14', // 山西
    '15', // 内蒙古
    '21', // 辽宁
    '22', // 吉林
    '23', // 黑龙江
    '31', // 上海
    '32', // 江苏
    '33', // 浙江
    '34', // 安徽
    '35', // 福建
    '36', // 江西
    '37', // 山东
    '41', // 河南
    '42', // 湖北
    '43', // 湖南
    '44', // 广东
    '45', // 广西
    '46', // 海南
    '50', // 重庆
    '51', // 四川
    '52', // 贵州
    '53', // 云南
    '54', // 西藏
    '61', // 陕西
    '62', // 甘肃
    '63', // 青海
    '64', // 宁夏
    '65', // 新疆
    '71', // 台湾
    '81', // 香港
    '82', // 澳门
    '91' // 国外
    ];
    var powers = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'];
    var parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    var checkAddressCode = function checkAddressCode(addressCode) {
      return provincesAndCities.includes(addressCode);
    };

    var checkBirthDayCode = function checkBirthDayCode(birDayCode) {
      var yyyy = parseInt(birDayCode.substring(0, 4), 10);
      var mm = parseInt(birDayCode.substring(4, 6), 10);
      var dd = parseInt(birDayCode.substring(6), 10);
      var xdata = new Date(yyyy, mm - 1, dd);

      if (xdata > new Date()) {
        return false; // eslint-disable-next-line max-len
      } else if (xdata.getFullYear() === yyyy && xdata.getMonth() === mm - 1 && xdata.getDate() === dd) {
        return true;
      }

      return false;
    };

    var getParityBit = function getParityBit(idCardNo) {
      var id17 = idCardNo.substring(0, 17);
      var power = 0;

      for (var i = 0; i < 17; i++) {
        power += parseInt(id17.charAt(i), 10) * parseInt(powers[i], 10);
      }

      var mod = power % 11;
      return parityBit[mod];
    };

    var checkParityBit = function checkParityBit(idCardNo) {
      return getParityBit(idCardNo) === idCardNo.charAt(17).toUpperCase();
    };

    var check15IdCardNo = function check15IdCardNo(idCardNo) {
      var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
      if (!check) return false;
      var addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      var birDayCode = "19".concat(idCardNo.substring(6, 12));
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return true;
    };

    var check18IdCardNo = function check18IdCardNo(idCardNo) {
      var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
      if (!check) return false;
      var addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      var birDayCode = idCardNo.substring(6, 14);
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return checkParityBit(idCardNo);
    };

    var checkIdCardNo = function checkIdCardNo(idCardNo) {
      var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
      if (!check) return false;

      if (idCardNo.length === 15) {
        return check15IdCardNo(idCardNo);
      }

      return check18IdCardNo(idCardNo);
    };

    return checkIdCardNo(str);
  },
  'zh-TW': function zhTW(str) {
    var ALPHABET_CODES = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      I: 34,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      O: 35,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      W: 32,
      X: 30,
      Y: 31,
      Z: 33
    };
    var sanitized = str.trim().toUpperCase();
    if (!/^[A-Z][0-9]{9}$/.test(sanitized)) return false;
    return Array.from(sanitized).reduce(function (sum, number, index) {
      if (index === 0) {
        var code = ALPHABET_CODES[number];
        return code % 10 * 9 + Math.floor(code / 10);
      }

      if (index === 9) {
        return (10 - sum % 10 - Number(number)) % 10 === 0;
      }

      return sum + Number(number) * (9 - index);
    }, 0);
  }
};

function isIdentityCard(str, locale) {
  (0, _assertString.default)(str);

  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (var key in validators) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (validators.hasOwnProperty(key)) {
        var validator = validators[key];

        if (validator(str)) {
          return true;
        }
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isInt":95,"./util/assertString":140}],94:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIn;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _toString = _interopRequireDefault(require("./util/toString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isIn(str, options) {
  (0, _assertString.default)(str);
  var i;

  if (Object.prototype.toString.call(options) === '[object Array]') {
    var array = [];

    for (i in options) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if ({}.hasOwnProperty.call(options, i)) {
        array[i] = (0, _toString.default)(options[i]);
      }
    }

    return array.indexOf(str) >= 0;
  } else if (_typeof(options) === 'object') {
    return options.hasOwnProperty(str);
  } else if (options && typeof options.indexOf === 'function') {
    return options.indexOf(str) >= 0;
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/toString":144}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInt;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
var intLeadingZeroes = /^[-+]?[0-9]+$/;

function isInt(str, options) {
  (0, _assertString.default)(str);
  options = options || {}; // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.

  var regex = options.hasOwnProperty('allow_leading_zeroes') && !options.allow_leading_zeroes ? int : intLeadingZeroes; // Check min/max/lt/gt

  var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
  var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;
  var ltCheckPassed = !options.hasOwnProperty('lt') || str < options.lt;
  var gtCheckPassed = !options.hasOwnProperty('gt') || str > options.gt;
  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isJSON;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var default_json_options = {
  allow_primitives: false
};

function isJSON(str, options) {
  (0, _assertString.default)(str);

  try {
    options = (0, _merge.default)(options, default_json_options);
    var primitives = [];

    if (options.allow_primitives) {
      primitives = [null, false, true];
    }

    var obj = JSON.parse(str);
    return primitives.includes(obj) || !!obj && _typeof(obj) === 'object';
  } catch (e) {
    /* ignore */
  }

  return false;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],97:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isJWT;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isBase = _interopRequireDefault(require("./isBase64"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isJWT(str) {
  (0, _assertString.default)(str);
  var dotSplit = str.split('.');
  var len = dotSplit.length;

  if (len > 3 || len < 2) {
    return false;
  }

  return dotSplit.reduce(function (acc, currElem) {
    return acc && (0, _isBase.default)(currElem, {
      urlSafe: true
    });
  }, true);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isBase64":58,"./util/assertString":140}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLatLong;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
var latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;
var longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;
var defaultLatLongOptions = {
  checkDMS: false
};

function isLatLong(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultLatLongOptions);
  if (!str.includes(',')) return false;
  var pair = str.split(',');
  if (pair[0].startsWith('(') && !pair[1].endsWith(')') || pair[1].endsWith(')') && !pair[0].startsWith('(')) return false;

  if (options.checkDMS) {
    return latDMS.test(pair[0]) && longDMS.test(pair[1]);
  }

  return lat.test(pair[0]) && long.test(pair[1]);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLength;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable prefer-rest-params */
function isLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;

  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
  }

  var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  var len = str.length - surrogatePairs.length;
  return len >= min && (typeof max === 'undefined' || len <= max);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLicensePlate;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validators = {
  'cs-CZ': function csCZ(str) {
    return /^(([ABCDEFHKIJKLMNPRSTUVXYZ]|[0-9])-?){5,8}$/.test(str);
  },
  'de-DE': function deDE(str) {
    return /^((AW|UL|AK|GA|AÖ|LF|AZ|AM|AS|ZE|AN|AB|A|KG|KH|BA|EW|BZ|HY|KM|BT|HP|B|BC|BI|BO|FN|TT|ÜB|BN|AH|BS|FR|HB|ZZ|BB|BK|BÖ|OC|OK|CW|CE|C|CO|LH|CB|KW|LC|LN|DA|DI|DE|DH|SY|NÖ|DO|DD|DU|DN|D|EI|EA|EE|FI|EM|EL|EN|PF|ED|EF|ER|AU|ZP|E|ES|NT|EU|FL|FO|FT|FF|F|FS|FD|FÜ|GE|G|GI|GF|GS|ZR|GG|GP|GR|NY|ZI|GÖ|GZ|GT|HA|HH|HM|HU|WL|HZ|WR|RN|HK|HD|HN|HS|GK|HE|HF|RZ|HI|HG|HO|HX|IK|IL|IN|J|JL|KL|KA|KS|KF|KE|KI|KT|KO|KN|KR|KC|KU|K|LD|LL|LA|L|OP|LM|LI|LB|LU|LÖ|HL|LG|MD|GN|MZ|MA|ML|MR|MY|AT|DM|MC|NZ|RM|RG|MM|ME|MB|MI|FG|DL|HC|MW|RL|MK|MG|MÜ|WS|MH|M|MS|NU|NB|ND|NM|NK|NW|NR|NI|NF|DZ|EB|OZ|TG|TO|N|OA|GM|OB|CA|EH|FW|OF|OL|OE|OG|BH|LR|OS|AA|GD|OH|KY|NP|WK|PB|PA|PE|PI|PS|P|PM|PR|RA|RV|RE|R|H|SB|WN|RS|RD|RT|BM|NE|GV|RP|SU|GL|RO|GÜ|RH|EG|RW|PN|SK|MQ|RU|SZ|RI|SL|SM|SC|HR|FZ|VS|SW|SN|CR|SE|SI|SO|LP|SG|NH|SP|IZ|ST|BF|TE|HV|OD|SR|S|AC|DW|ZW|TF|TS|TR|TÜ|UM|PZ|TP|UE|UN|UH|MN|KK|VB|V|AE|PL|RC|VG|GW|PW|VR|VK|KB|WA|WT|BE|WM|WE|AP|MO|WW|FB|WZ|WI|WB|JE|WF|WO|W|WÜ|BL|Z|GC)[- ]?[A-Z]{1,2}[- ]?\d{1,4}|(AIC|FDB|ABG|SLN|SAW|KLZ|BUL|ESB|NAB|SUL|WST|ABI|AZE|BTF|KÖT|DKB|FEU|ROT|ALZ|SMÜ|WER|AUR|NOR|DÜW|BRK|HAB|TÖL|WOR|BAD|BAR|BER|BIW|EBS|KEM|MÜB|PEG|BGL|BGD|REI|WIL|BKS|BIR|WAT|BOR|BOH|BOT|BRB|BLK|HHM|NEB|NMB|WSF|LEO|HDL|WMS|WZL|BÜS|CHA|KÖZ|ROD|WÜM|CLP|NEC|COC|ZEL|COE|CUX|DAH|LDS|DEG|DEL|RSL|DLG|DGF|LAN|HEI|MED|DON|KIB|ROK|JÜL|MON|SLE|EBE|EIC|HIG|WBS|BIT|PRÜ|LIB|EMD|WIT|ERH|HÖS|ERZ|ANA|ASZ|MAB|MEK|STL|SZB|FDS|HCH|HOR|WOL|FRG|GRA|WOS|FRI|FFB|GAP|GER|BRL|CLZ|GTH|NOH|HGW|GRZ|LÖB|NOL|WSW|DUD|HMÜ|OHA|KRU|HAL|HAM|HBS|QLB|HVL|NAU|HAS|EBN|GEO|HOH|HDH|ERK|HER|WAN|HEF|ROF|HBN|ALF|HSK|USI|NAI|REH|SAN|KÜN|ÖHR|HOL|WAR|ARN|BRG|GNT|HOG|WOH|KEH|MAI|PAR|RID|ROL|KLE|GEL|KUS|KYF|ART|SDH|LDK|DIL|MAL|VIB|LER|BNA|GHA|GRM|MTL|WUR|LEV|LIF|STE|WEL|LIP|VAI|LUP|HGN|LBZ|LWL|PCH|STB|DAN|MKK|SLÜ|MSP|TBB|MGH|MTK|BIN|MSH|EIL|HET|SGH|BID|MYK|MSE|MST|MÜR|WRN|MEI|GRH|RIE|MZG|MIL|OBB|BED|FLÖ|MOL|FRW|SEE|SRB|AIB|MOS|BCH|ILL|SOB|NMS|NEA|SEF|UFF|NEW|VOH|NDH|TDO|NWM|GDB|GVM|WIS|NOM|EIN|GAN|LAU|HEB|OHV|OSL|SFB|ERB|LOS|BSK|KEL|BSB|MEL|WTL|OAL|FÜS|MOD|OHZ|OPR|BÜR|PAF|PLÖ|CAS|GLA|REG|VIT|ECK|SIM|GOA|EMS|DIZ|GOH|RÜD|SWA|NES|KÖN|MET|LRO|BÜZ|DBR|ROS|TET|HRO|ROW|BRV|HIP|PAN|GRI|SHK|EIS|SRO|SOK|LBS|SCZ|MER|QFT|SLF|SLS|HOM|SLK|ASL|BBG|SBK|SFT|SHG|MGN|MEG|ZIG|SAD|NEN|OVI|SHA|BLB|SIG|SON|SPN|FOR|GUB|SPB|IGB|WND|STD|STA|SDL|OBG|HST|BOG|SHL|PIR|FTL|SEB|SÖM|SÜW|TIR|SAB|TUT|ANG|SDT|LÜN|LSZ|MHL|VEC|VER|VIE|OVL|ANK|OVP|SBG|UEM|UER|WLG|GMN|NVP|RDG|RÜG|DAU|FKB|WAF|WAK|SLZ|WEN|SOG|APD|WUG|GUN|ESW|WIZ|WES|DIN|BRA|BÜD|WHV|HWI|GHC|WTM|WOB|WUN|MAK|SEL|OCH|HOT|WDA)[- ]?(([A-Z][- ]?\d{1,4})|([A-Z]{2}[- ]?\d{1,3})))[- ]?(E|H)?$/.test(str);
  },
  'de-LI': function deLI(str) {
    return /^FL[- ]?\d{1,5}[UZ]?$/.test(str);
  },
  'fi-FI': function fiFI(str) {
    return /^(?=.{4,7})(([A-Z]{1,3}|[0-9]{1,3})[\s-]?([A-Z]{1,3}|[0-9]{1,5}))$/.test(str);
  },
  'pt-PT': function ptPT(str) {
    return /^([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})$/.test(str);
  },
  'sq-AL': function sqAL(str) {
    return /^[A-Z]{2}[- ]?((\d{3}[- ]?(([A-Z]{2})|T))|(R[- ]?\d{3}))$/.test(str);
  },
  'pt-BR': function ptBR(str) {
    return /^[A-Z]{3}[ -]?[0-9][A-Z][0-9]{2}|[A-Z]{3}[ -]?[0-9]{4}$/.test(str);
  }
};

function isLicensePlate(str, locale) {
  (0, _assertString.default)(str);

  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (var key in validators) {
      /* eslint guard-for-in: 0 */
      var validator = validators[key];

      if (validator(str)) {
        return true;
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLocale;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localeReg = /^[A-Za-z]{2,4}([_-]([A-Za-z]{4}|[\d]{3}))?([_-]([A-Za-z]{2}|[\d]{3}))?$/;

function isLocale(str) {
  (0, _assertString.default)(str);

  if (str === 'en_US_POSIX' || str === 'ca_ES_VALENCIA') {
    return true;
  }

  return localeReg.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLowercase;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isLowercase(str) {
  (0, _assertString.default)(str);
  return str === str.toLowerCase();
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMACAddress;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var macAddress = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){4}([0-9a-fA-F]{2})$/;
var macAddressNoSeparators = /^([0-9a-fA-F]){12}$/;
var macAddressWithDots = /^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/;

function isMACAddress(str, options) {
  (0, _assertString.default)(str);
  /**
   * @deprecated `no_colons` TODO: remove it in the next major
  */

  if (options && (options.no_colons || options.no_separators)) {
    return macAddressNoSeparators.test(str);
  }

  return macAddress.test(str) || macAddressWithDots.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMD5;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md5 = /^[a-f0-9]{32}$/;

function isMD5(str) {
  (0, _assertString.default)(str);
  return md5.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMagnetURI;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var magnetURI = /^magnet:\?xt(?:\.1)?=urn:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?($|&)/i;

function isMagnetURI(url) {
  (0, _assertString.default)(url);
  return magnetURI.test(url.trim());
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],106:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMimeType;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Checks if the provided string matches to a correct Media type format (MIME type)

  This function only checks is the string format follows the
  etablished rules by the according RFC specifications.
  This function supports 'charset' in textual media types
  (https://tools.ietf.org/html/rfc6657).

  This function does not check against all the media types listed
  by the IANA (https://www.iana.org/assignments/media-types/media-types.xhtml)
  because of lightness purposes : it would require to include
  all these MIME types in this librairy, which would weigh it
  significantly. This kind of effort maybe is not worth for the use that
  this function has in this entire librairy.

  More informations in the RFC specifications :
  - https://tools.ietf.org/html/rfc2045
  - https://tools.ietf.org/html/rfc2046
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.1
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.5
*/
// Match simple MIME types
// NB :
//   Subtype length must not exceed 100 characters.
//   This rule does not comply to the RFC specs (what is the max length ?).
var mimeTypeSimple = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+]{1,100}$/i; // eslint-disable-line max-len
// Handle "charset" in "text/*"

var mimeTypeText = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i; // eslint-disable-line max-len
// Handle "boundary" in "multipart/*"

var mimeTypeMultipart = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i; // eslint-disable-line max-len

function isMimeType(str) {
  (0, _assertString.default)(str);
  return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMobilePhone;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var phones = {
  'am-AM': /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  'ar-AE': /^((\+?971)|0)?5[024568]\d{7}$/,
  'ar-BH': /^(\+?973)?(3|6)\d{7}$/,
  'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
  'ar-LB': /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
  'ar-EG': /^((\+?20)|0)?1[0125]\d{8}$/,
  'ar-IQ': /^(\+?964|0)?7[0-9]\d{8}$/,
  'ar-JO': /^(\+?962|0)?7[789]\d{7}$/,
  'ar-KW': /^(\+?965)[569]\d{7}$/,
  'ar-LY': /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
  'ar-MA': /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
  'ar-OM': /^((\+|00)968)?(9[1-9])\d{6}$/,
  'ar-PS': /^(\+?970|0)5[6|9](\d{7})$/,
  'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'ar-TN': /^(\+?216)?[2459]\d{7}$/,
  'az-AZ': /^(\+994|0)(5[015]|7[07]|99)\d{7}$/,
  'bs-BA': /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
  'be-BY': /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  'bg-BG': /^(\+?359|0)?8[789]\d{7}$/,
  'bn-BD': /^(\+?880|0)1[13456789][0-9]{8}$/,
  'ca-AD': /^(\+376)?[346]\d{5}$/,
  'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'da-DK': /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'de-DE': /^((\+49|0)[1|3])([0|5][0-45-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
  'de-AT': /^(\+43|0)\d{1,4}\d{3,12}$/,
  'de-CH': /^(\+41|0)([1-9])\d{1,9}$/,
  'de-LU': /^(\+352)?((6\d1)\d{6})$/,
  'dv-MV': /^(\+?960)?(7[2-9]|91|9[3-9])\d{7}$/,
  'el-GR': /^(\+?30|0)?(69\d{8})$/,
  'en-AU': /^(\+?61|0)4\d{8}$/,
  'en-BM': /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}))/,
  'en-GB': /^(\+?44|0)7\d{9}$/,
  'en-GG': /^(\+?44|0)1481\d{6}$/,
  'en-GH': /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/,
  'en-GY': /^(\+592|0)6\d{6}$/,
  'en-HK': /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  'en-MO': /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  'en-IE': /^(\+?353|0)8[356789]\d{7}$/,
  'en-IN': /^(\+?91|0)?[6789]\d{9}$/,
  'en-KE': /^(\+?254|0)(7|1)\d{8}$/,
  'en-KI': /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
  'en-MT': /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  'en-MU': /^(\+?230|0)?\d{8}$/,
  'en-NA': /^(\+?264|0)(6|8)\d{7}$/,
  'en-NG': /^(\+?234|0)?[789]\d{9}$/,
  'en-NZ': /^(\+?64|0)[28]\d{7,9}$/,
  'en-PK': /^((00|\+)?92|0)3[0-6]\d{8}$/,
  'en-PH': /^(09|\+639)\d{9}$/,
  'en-RW': /^(\+?250|0)?[7]\d{8}$/,
  'en-SG': /^(\+65)?[3689]\d{7}$/,
  'en-SL': /^(\+?232|0)\d{8}$/,
  'en-TZ': /^(\+?255|0)?[67]\d{8}$/,
  'en-UG': /^(\+?256|0)?[7]\d{8}$/,
  'en-US': /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  'en-ZA': /^(\+?27|0)\d{9}$/,
  'en-ZM': /^(\+?26)?09[567]\d{7}$/,
  'en-ZW': /^(\+263)[0-9]{9}$/,
  'en-BW': /^(\+?267)?(7[1-8]{1})\d{6}$/,
  'es-AR': /^\+?549(11|[2368]\d)\d{8}$/,
  'es-BO': /^(\+?591)?(6|7)\d{7}$/,
  'es-CO': /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
  'es-CL': /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  'es-CR': /^(\+506)?[2-8]\d{7}$/,
  'es-CU': /^(\+53|0053)?5\d{7}/,
  'es-DO': /^(\+?1)?8[024]9\d{7}$/,
  'es-HN': /^(\+?504)?[9|8]\d{7}$/,
  'es-EC': /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  'es-ES': /^(\+?34)?[6|7]\d{8}$/,
  'es-PE': /^(\+?51)?9\d{8}$/,
  'es-MX': /^(\+?52)?(1|01)?\d{10,11}$/,
  'es-PA': /^(\+?507)\d{7,8}$/,
  'es-PY': /^(\+?595|0)9[9876]\d{7}$/,
  'es-SV': /^(\+?503)?[67]\d{7}$/,
  'es-UY': /^(\+598|0)9[1-9][\d]{6}$/,
  'es-VE': /^(\+?58)?(2|4)\d{9}$/,
  'et-EE': /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  'fa-IR': /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
  'fj-FJ': /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  'fo-FO': /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'fr-BF': /^(\+226|0)[67]\d{7}$/,
  'fr-CM': /^(\+?237)6[0-9]{8}$/,
  'fr-FR': /^(\+?33|0)[67]\d{8}$/,
  'fr-GF': /^(\+?594|0|00594)[67]\d{8}$/,
  'fr-GP': /^(\+?590|0|00590)[67]\d{8}$/,
  'fr-MQ': /^(\+?596|0|00596)[67]\d{8}$/,
  'fr-PF': /^(\+?689)?8[789]\d{6}$/,
  'fr-RE': /^(\+?262|0|00262)[67]\d{8}$/,
  'he-IL': /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  'hu-HU': /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
  'id-ID': /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  'it-SM': /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
  'ja-JP': /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  'ka-GE': /^(\+?995)?(5|79)\d{7}$/,
  'kk-KZ': /^(\+?7|8)?7\d{9}$/,
  'kl-GL': /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'ko-KR': /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  'lt-LT': /^(\+370|8)\d{8}$/,
  'lv-LV': /^(\+?371)2\d{7}$/,
  'ms-MY': /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  'mz-MZ': /^(\+?258)?8[234567]\d{7}$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'ne-NP': /^(\+?977)?9[78]\d{8}$/,
  'nl-BE': /^(\+?32|0)4\d{8}$/,
  'nl-NL': /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  'pt-BR': /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[2-9]{1}\d{3}\-?\d{4}))$/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'pt-AO': /^(\+244)\d{9}$/,
  'ro-RO': /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'si-LK': /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
  'sl-SI': /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  'sk-SK': /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'sq-AL': /^(\+355|0)6[789]\d{6}$/,
  'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
  'sv-SE': /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  'tg-TJ': /^(\+?992)?[5][5]\d{7}$/,
  'th-TH': /^(\+66|66|0)\d{9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'tk-TM': /^(\+993|993|8)\d{8}$/,
  'uk-UA': /^(\+?38|8)?0\d{9}$/,
  'uz-UZ': /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
  'vi-VN': /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
  'zh-CN': /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
  'dz-BT': /^(\+?975|0)?(17|16|77|02)\d{6}$/
};
/* eslint-enable max-len */
// aliases

phones['en-CA'] = phones['en-US'];
phones['fr-CA'] = phones['en-CA'];
phones['fr-BE'] = phones['nl-BE'];
phones['zh-HK'] = phones['en-HK'];
phones['zh-MO'] = phones['en-MO'];
phones['ga-IE'] = phones['en-IE'];
phones['fr-CH'] = phones['de-CH'];
phones['it-CH'] = phones['fr-CH'];

function isMobilePhone(str, locale, options) {
  (0, _assertString.default)(str);

  if (options && options.strictMode && !str.startsWith('+')) {
    return false;
  }

  if (Array.isArray(locale)) {
    return locale.some(function (key) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];

        if (phone.test(str)) {
          return true;
        }
      }

      return false;
    });
  } else if (locale in phones) {
    return phones[locale].test(str); // alias falsey locale as 'any'
  } else if (!locale || locale === 'any') {
    for (var key in phones) {
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];

        if (phone.test(str)) {
          return true;
        }
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

var locales = Object.keys(phones);
exports.locales = locales;
},{"./util/assertString":140}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMongoId;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isHexadecimal = _interopRequireDefault(require("./isHexadecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMongoId(str) {
  (0, _assertString.default)(str);
  return (0, _isHexadecimal.default)(str) && str.length === 24;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isHexadecimal":80,"./util/assertString":140}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isMultibyte;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-control-regex */
var multibyte = /[^\x00-\x7F]/;
/* eslint-enable no-control-regex */

function isMultibyte(str) {
  (0, _assertString.default)(str);
  return multibyte.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],110:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumeric;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _alpha = require("./alpha");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numericNoSymbols = /^[0-9]+$/;

function isNumeric(str, options) {
  (0, _assertString.default)(str);

  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }

  return new RegExp("^[+-]?([0-9]*[".concat((options || {}).locale ? _alpha.decimal[options.locale] : '.', "])?[0-9]+$")).test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./alpha":46,"./util/assertString":140}],111:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isOctal;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var octal = /^(0o)?[0-7]+$/i;

function isOctal(str) {
  (0, _assertString.default)(str);
  return octal.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],112:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPassportNumber;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */
var passportRegexByCountryCode = {
  AM: /^[A-Z]{2}\d{7}$/,
  // ARMENIA
  AR: /^[A-Z]{3}\d{6}$/,
  // ARGENTINA
  AT: /^[A-Z]\d{7}$/,
  // AUSTRIA
  AU: /^[A-Z]\d{7}$/,
  // AUSTRALIA
  BE: /^[A-Z]{2}\d{6}$/,
  // BELGIUM
  BG: /^\d{9}$/,
  // BULGARIA
  BR: /^[A-Z]{2}\d{6}$/,
  // BRAZIL
  BY: /^[A-Z]{2}\d{7}$/,
  // BELARUS
  CA: /^[A-Z]{2}\d{6}$/,
  // CANADA
  CH: /^[A-Z]\d{7}$/,
  // SWITZERLAND
  CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/,
  // CHINA [G=Ordinary, E=Electronic] followed by 8-digits, or E followed by any UPPERCASE letter (except I and O) followed by 7 digits
  CY: /^[A-Z](\d{6}|\d{8})$/,
  // CYPRUS
  CZ: /^\d{8}$/,
  // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/,
  // GERMANY
  DK: /^\d{9}$/,
  // DENMARK
  DZ: /^\d{9}$/,
  // ALGERIA
  EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/,
  // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/,
  // SPAIN
  FI: /^[A-Z]{2}\d{7}$/,
  // FINLAND
  FR: /^\d{2}[A-Z]{2}\d{5}$/,
  // FRANCE
  GB: /^\d{9}$/,
  // UNITED KINGDOM
  GR: /^[A-Z]{2}\d{7}$/,
  // GREECE
  HR: /^\d{9}$/,
  // CROATIA
  HU: /^[A-Z]{2}(\d{6}|\d{7})$/,
  // HUNGARY
  IE: /^[A-Z0-9]{2}\d{7}$/,
  // IRELAND
  IN: /^[A-Z]{1}-?\d{7}$/,
  // INDIA
  ID: /^[A-C]\d{7}$/,
  // INDONESIA
  IR: /^[A-Z]\d{8}$/,
  // IRAN
  IS: /^(A)\d{7}$/,
  // ICELAND
  IT: /^[A-Z0-9]{2}\d{7}$/,
  // ITALY
  JP: /^[A-Z]{2}\d{7}$/,
  // JAPAN
  KR: /^[MS]\d{8}$/,
  // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  LT: /^[A-Z0-9]{8}$/,
  // LITHUANIA
  LU: /^[A-Z0-9]{8}$/,
  // LUXEMBURG
  LV: /^[A-Z0-9]{2}\d{7}$/,
  // LATVIA
  LY: /^[A-Z0-9]{8}$/,
  // LIBYA
  MT: /^\d{7}$/,
  // MALTA
  MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/,
  // MOZAMBIQUE
  MY: /^[AHK]\d{8}$/,
  // MALAYSIA
  NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/,
  // NETHERLANDS
  PL: /^[A-Z]{2}\d{7}$/,
  // POLAND
  PT: /^[A-Z]\d{6}$/,
  // PORTUGAL
  RO: /^\d{8,9}$/,
  // ROMANIA
  RU: /^\d{9}$/,
  // RUSSIAN FEDERATION
  SE: /^\d{8}$/,
  // SWEDEN
  SL: /^(P)[A-Z]\d{7}$/,
  // SLOVANIA
  SK: /^[0-9A-Z]\d{7}$/,
  // SLOVAKIA
  TR: /^[A-Z]\d{8}$/,
  // TURKEY
  UA: /^[A-Z]{2}\d{6}$/,
  // UKRAINE
  US: /^\d{9}$/ // UNITED STATES

};
/**
 * Check if str is a valid passport number
 * relative to provided ISO Country Code.
 *
 * @param {string} str
 * @param {string} countryCode
 * @return {boolean}
 */

function isPassportNumber(str, countryCode) {
  (0, _assertString.default)(str);
  /** Remove All Whitespaces, Convert to UPPERCASE */

  var normalizedStr = str.replace(/\s/g, '').toUpperCase();
  return countryCode.toUpperCase() in passportRegexByCountryCode && passportRegexByCountryCode[countryCode].test(normalizedStr);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],113:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPort;

var _isInt = _interopRequireDefault(require("./isInt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPort(str) {
  return (0, _isInt.default)(str, {
    min: 0,
    max: 65535
  });
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isInt":95}],114:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPostalCode;
exports.locales = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// common patterns
var threeDigit = /^\d{3}$/;
var fourDigit = /^\d{4}$/;
var fiveDigit = /^\d{5}$/;
var sixDigit = /^\d{6}$/;
var patterns = {
  AD: /^AD\d{3}$/,
  AT: fourDigit,
  AU: fourDigit,
  AZ: /^AZ\d{4}$/,
  BE: fourDigit,
  BG: fourDigit,
  BR: /^\d{5}-\d{3}$/,
  BY: /2[1-4]{1}\d{4}$/,
  CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  CH: fourDigit,
  CN: /^(0[1-7]|1[012356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[1-5]|8[1345]|9[09])\d{4}$/,
  CZ: /^\d{3}\s?\d{2}$/,
  DE: fiveDigit,
  DK: fourDigit,
  DO: fiveDigit,
  DZ: fiveDigit,
  EE: fiveDigit,
  ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
  FI: fiveDigit,
  FR: /^\d{2}\s?\d{3}$/,
  GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
  GR: /^\d{3}\s?\d{2}$/,
  HR: /^([1-5]\d{4}$)/,
  HT: /^HT\d{4}$/,
  HU: fourDigit,
  ID: fiveDigit,
  IE: /^(?!.*(?:o))[A-Za-z]\d[\dw]\s\w{4}$/i,
  IL: /^(\d{5}|\d{7})$/,
  IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
  IR: /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/,
  IS: threeDigit,
  IT: fiveDigit,
  JP: /^\d{3}\-\d{4}$/,
  KE: fiveDigit,
  KR: /^(\d{5}|\d{6})$/,
  LI: /^(948[5-9]|949[0-7])$/,
  LT: /^LT\-\d{5}$/,
  LU: fourDigit,
  LV: /^LV\-\d{4}$/,
  LK: fiveDigit,
  MX: fiveDigit,
  MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
  MY: fiveDigit,
  NL: /^\d{4}\s?[a-z]{2}$/i,
  NO: fourDigit,
  NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
  NZ: fourDigit,
  PL: /^\d{2}\-\d{3}$/,
  PR: /^00[679]\d{2}([ -]\d{4})?$/,
  PT: /^\d{4}\-\d{3}?$/,
  RO: sixDigit,
  RU: sixDigit,
  SA: fiveDigit,
  SE: /^[1-9]\d{2}\s?\d{2}$/,
  SG: sixDigit,
  SI: fourDigit,
  SK: /^\d{3}\s?\d{2}$/,
  TH: fiveDigit,
  TN: fourDigit,
  TW: /^\d{3}(\d{2})?$/,
  UA: fiveDigit,
  US: /^\d{5}(-\d{4})?$/,
  ZA: fourDigit,
  ZM: fiveDigit
};
var locales = Object.keys(patterns);
exports.locales = locales;

function isPostalCode(str, locale) {
  (0, _assertString.default)(str);

  if (locale in patterns) {
    return patterns[locale].test(str);
  } else if (locale === 'any') {
    for (var key in patterns) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (patterns.hasOwnProperty(key)) {
        var pattern = patterns[key];

        if (pattern.test(str)) {
          return true;
        }
      }
    }

    return false;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}
},{"./util/assertString":140}],115:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRFC3339;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
var dateFullYear = /[0-9]{4}/;
var dateMonth = /(0[1-9]|1[0-2])/;
var dateMDay = /([12]\d|0[1-9]|3[01])/;
var timeHour = /([01][0-9]|2[0-3])/;
var timeMinute = /[0-5][0-9]/;
var timeSecond = /([0-5][0-9]|60)/;
var timeSecFrac = /(\.[0-9]+)?/;
var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
var partialTime = new RegExp("".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source));
var fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
var rfc3339 = new RegExp("^".concat(fullDate.source, "[ tT]").concat(fullTime.source, "$"));

function isRFC3339(str) {
  (0, _assertString.default)(str);
  return rfc3339.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRgbColor;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
var rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
var rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)/;
var rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)/;

function isRgbColor(str) {
  var includePercentValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  (0, _assertString.default)(str);

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }

  return rgbColor.test(str) || rgbaColor.test(str) || rgbColorPercent.test(str) || rgbaColorPercent.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],117:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSemVer;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _multilineRegex = _interopRequireDefault(require("./util/multilineRegex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Regular Expression to match
 * semantic versioning (SemVer)
 * built from multi-line, multi-parts regexp
 * Reference: https://semver.org/
 */
var semanticVersioningRegex = (0, _multilineRegex.default)(['^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)', '(?:-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*))', '?(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$'], 'i');

function isSemVer(str) {
  (0, _assertString.default)(str);
  return semanticVersioningRegex.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/multilineRegex":143}],118:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSlug;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var charsetRegex = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;

function isSlug(str) {
  (0, _assertString.default)(str);
  return charsetRegex.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],119:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isStrongPassword;

var _merge = _interopRequireDefault(require("./util/merge"));

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upperCaseRegex = /^[A-Z]$/;
var lowerCaseRegex = /^[a-z]$/;
var numberRegex = /^[0-9]$/;
var symbolRegex = /^[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/;
var defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
};
/* Counts number of occurrences of each char in a string
 * could be moved to util/ ?
*/

function countChars(str) {
  var result = {};
  Array.from(str).forEach(function (char) {
    var curVal = result[char];

    if (curVal) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  });
  return result;
}
/* Return information about a password */


function analyzePassword(password) {
  var charMap = countChars(password);
  var analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0
  };
  Object.keys(charMap).forEach(function (char) {
    /* istanbul ignore else */
    if (upperCaseRegex.test(char)) {
      analysis.uppercaseCount += charMap[char];
    } else if (lowerCaseRegex.test(char)) {
      analysis.lowercaseCount += charMap[char];
    } else if (numberRegex.test(char)) {
      analysis.numberCount += charMap[char];
    } else if (symbolRegex.test(char)) {
      analysis.symbolCount += charMap[char];
    }
  });
  return analysis;
}

function scorePassword(analysis, scoringOptions) {
  var points = 0;
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique;
  points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat;

  if (analysis.lowercaseCount > 0) {
    points += scoringOptions.pointsForContainingLower;
  }

  if (analysis.uppercaseCount > 0) {
    points += scoringOptions.pointsForContainingUpper;
  }

  if (analysis.numberCount > 0) {
    points += scoringOptions.pointsForContainingNumber;
  }

  if (analysis.symbolCount > 0) {
    points += scoringOptions.pointsForContainingSymbol;
  }

  return points;
}

function isStrongPassword(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  (0, _assertString.default)(str);
  var analysis = analyzePassword(str);
  options = (0, _merge.default)(options || {}, defaultOptions);

  if (options.returnScore) {
    return scorePassword(analysis, options);
  }

  return analysis.length >= options.minLength && analysis.lowercaseCount >= options.minLowercase && analysis.uppercaseCount >= options.minUppercase && analysis.numberCount >= options.minNumbers && analysis.symbolCount >= options.minSymbols;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140,"./util/merge":142}],120:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSurrogatePair;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

function isSurrogatePair(str) {
  (0, _assertString.default)(str);
  return surrogatePair.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],121:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTaxID;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var algorithms = _interopRequireWildcard(require("./util/algorithms"));

var _isDate = _interopRequireDefault(require("./isDate"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * TIN Validation
 * Validates Tax Identification Numbers (TINs) from the US, EU member states and the United Kingdom.
 *
 * EU-UK:
 * National TIN validity is calculated using public algorithms as made available by DG TAXUD.
 *
 * See `https://ec.europa.eu/taxation_customs/tin/specs/FS-TIN%20Algorithms-Public.docx` for more information.
 *
 * US:
 * An Employer Identification Number (EIN), also known as a Federal Tax Identification Number,
 *  is used to identify a business entity.
 *
 * NOTES:
 *  - Prefix 47 is being reserved for future use
 *  - Prefixes 26, 27, 45, 46 and 47 were previously assigned by the Philadelphia campus.
 *
 * See `http://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/How-EINs-are-Assigned-and-Valid-EIN-Prefixes`
 * for more information.
 */
// Locale functions

/*
 * bg-BG validation function
 * (Edinen graždanski nomer (EGN/ЕГН), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last) digit
 */
function bgBgCheck(tin) {
  // Extract full year, normalize month and check birth date validity
  var century_year = tin.slice(0, 2);
  var month = parseInt(tin.slice(2, 4), 10);

  if (month > 40) {
    month -= 40;
    century_year = "20".concat(century_year);
  } else if (month > 20) {
    month -= 20;
    century_year = "18".concat(century_year);
  } else {
    century_year = "19".concat(century_year);
  }

  if (month < 10) {
    month = "0".concat(month);
  }

  var date = "".concat(century_year, "/").concat(month, "/").concat(tin.slice(4, 6));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // split digits into an array for further processing


  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  }); // Calculate checksum by multiplying digits with fixed values

  var multip_lookup = [2, 4, 8, 5, 10, 9, 7, 3, 6];
  var checksum = 0;

  for (var i = 0; i < multip_lookup.length; i++) {
    checksum += digits[i] * multip_lookup[i];
  }

  checksum = checksum % 11 === 10 ? 0 : checksum % 11;
  return checksum === digits[9];
}
/*
 * cs-CZ validation function
 * (Rodné číslo (RČ), persons only)
 * Checks if birth date (first six digits) is valid and divisibility by 11
 * Material not in DG TAXUD document sourced from:
 * -`https://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm`
 * -`https://www.mvcr.cz/clanek/rady-a-sluzby-dokumenty-rodne-cislo.aspx`
 */


function csCzCheck(tin) {
  tin = tin.replace(/\W/, ''); // Extract full year from TIN length

  var full_year = parseInt(tin.slice(0, 2), 10);

  if (tin.length === 10) {
    if (full_year < 54) {
      full_year = "20".concat(full_year);
    } else {
      full_year = "19".concat(full_year);
    }
  } else {
    if (tin.slice(6) === '000') {
      return false;
    } // Three-zero serial not assigned before 1954


    if (full_year < 54) {
      full_year = "19".concat(full_year);
    } else {
      return false; // No 18XX years seen in any of the resources
    }
  } // Add missing zero if needed


  if (full_year.length === 3) {
    full_year = [full_year.slice(0, 2), '0', full_year.slice(2)].join('');
  } // Extract month from TIN and normalize


  var month = parseInt(tin.slice(2, 4), 10);

  if (month > 50) {
    month -= 50;
  }

  if (month > 20) {
    // Month-plus-twenty was only introduced in 2004
    if (parseInt(full_year, 10) < 2004) {
      return false;
    }

    month -= 20;
  }

  if (month < 10) {
    month = "0".concat(month);
  } // Check date validity


  var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Verify divisibility by 11


  if (tin.length === 10) {
    if (parseInt(tin, 10) % 11 !== 0) {
      // Some numbers up to and including 1985 are still valid if
      // check (last) digit equals 0 and modulo of first 9 digits equals 10
      var checkdigit = parseInt(tin.slice(0, 9), 10) % 11;

      if (parseInt(full_year, 10) < 1986 && checkdigit === 10) {
        if (parseInt(tin.slice(9), 10) !== 0) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return true;
}
/*
 * de-AT validation function
 * (Abgabenkontonummer, persons/entities)
 * Verify TIN validity by calling luhnCheck()
 */


function deAtCheck(tin) {
  return algorithms.luhnCheck(tin);
}
/*
 * de-DE validation function
 * (Steueridentifikationsnummer (Steuer-IdNr.), persons only)
 * Tests for single duplicate/triplicate value, then calculates ISO 7064 check (last) digit
 * Partial implementation of spec (same result with both algorithms always)
 */


function deDeCheck(tin) {
  // Split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  }); // Fill array with strings of number positions

  var occurences = [];

  for (var i = 0; i < digits.length - 1; i++) {
    occurences.push('');

    for (var j = 0; j < digits.length - 1; j++) {
      if (digits[i] === digits[j]) {
        occurences[i] += j;
      }
    }
  } // Remove digits with one occurence and test for only one duplicate/triplicate


  occurences = occurences.filter(function (a) {
    return a.length > 1;
  });

  if (occurences.length !== 2 && occurences.length !== 3) {
    return false;
  } // In case of triplicate value only two digits are allowed next to each other


  if (occurences[0].length === 3) {
    var trip_locations = occurences[0].split('').map(function (a) {
      return parseInt(a, 10);
    });
    var recurrent = 0; // Amount of neighbour occurences

    for (var _i = 0; _i < trip_locations.length - 1; _i++) {
      if (trip_locations[_i] + 1 === trip_locations[_i + 1]) {
        recurrent += 1;
      }
    }

    if (recurrent === 2) {
      return false;
    }
  }

  return algorithms.iso7064Check(tin);
}
/*
 * dk-DK validation function
 * (CPR-nummer (personnummer), persons only)
 * Checks if birth date (first six digits) is valid and assigned to century (seventh) digit,
 * and calculates check (last) digit
 */


function dkDkCheck(tin) {
  tin = tin.replace(/\W/, ''); // Extract year, check if valid for given century digit and add century

  var year = parseInt(tin.slice(4, 6), 10);
  var century_digit = tin.slice(6, 7);

  switch (century_digit) {
    case '0':
    case '1':
    case '2':
    case '3':
      year = "19".concat(year);
      break;

    case '4':
    case '9':
      if (year < 37) {
        year = "20".concat(year);
      } else {
        year = "19".concat(year);
      }

      break;

    default:
      if (year < 37) {
        year = "20".concat(year);
      } else if (year > 58) {
        year = "18".concat(year);
      } else {
        return false;
      }

      break;
  } // Add missing zero if needed


  if (year.length === 3) {
    year = [year.slice(0, 2), '0', year.slice(2)].join('');
  } // Check date validity


  var date = "".concat(year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Split digits into an array for further processing


  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  var weight = 4; // Multiply by weight and add to checksum

  for (var i = 0; i < 9; i++) {
    checksum += digits[i] * weight;
    weight -= 1;

    if (weight === 1) {
      weight = 7;
    }
  }

  checksum %= 11;

  if (checksum === 1) {
    return false;
  }

  return checksum === 0 ? digits[9] === 0 : digits[9] === 11 - checksum;
}
/*
 * el-CY validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons only)
 * Verify TIN validity by calculating ASCII value of check (last) character
 */


function elCyCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.slice(0, 8).split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0; // add digits in even places

  for (var i = 1; i < digits.length; i += 2) {
    checksum += digits[i];
  } // add digits in odd places


  for (var _i2 = 0; _i2 < digits.length; _i2 += 2) {
    if (digits[_i2] < 2) {
      checksum += 1 - digits[_i2];
    } else {
      checksum += 2 * (digits[_i2] - 2) + 5;

      if (digits[_i2] > 4) {
        checksum += 2;
      }
    }
  }

  return String.fromCharCode(checksum % 26 + 65) === tin.charAt(8);
}
/*
 * el-GR validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons/entities)
 * Verify TIN validity by calculating check (last) digit
 * Algorithm not in DG TAXUD document- sourced from:
 * - `http://epixeirisi.gr/%CE%9A%CE%A1%CE%99%CE%A3%CE%99%CE%9C%CE%91-%CE%98%CE%95%CE%9C%CE%91%CE%A4%CE%91-%CE%A6%CE%9F%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3-%CE%9A%CE%91%CE%99-%CE%9B%CE%9F%CE%93%CE%99%CE%A3%CE%A4%CE%99%CE%9A%CE%97%CE%A3/23791/%CE%91%CF%81%CE%B9%CE%B8%CE%BC%CF%8C%CF%82-%CE%A6%CE%BF%CF%81%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CE%BA%CE%BF%CF%8D-%CE%9C%CE%B7%CF%84%CF%81%CF%8E%CE%BF%CF%85`
 */


function elGrCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;

  for (var i = 0; i < 8; i++) {
    checksum += digits[i] * Math.pow(2, 8 - i);
  }

  return checksum % 11 % 10 === digits[8];
}
/*
 * en-GB validation function (should go here if needed)
 * (National Insurance Number (NINO) or Unique Taxpayer Reference (UTR),
 * persons/entities respectively)
 */

/*
 * en-IE validation function
 * (Personal Public Service Number (PPS No), persons only)
 * Verify TIN validity by calculating check (second to last) character
 */


function enIeCheck(tin) {
  var checksum = algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(function (a) {
    return parseInt(a, 10);
  }), 8);

  if (tin.length === 9 && tin[8] !== 'W') {
    checksum += (tin[8].charCodeAt(0) - 64) * 9;
  }

  checksum %= 23;

  if (checksum === 0) {
    return tin[7].toUpperCase() === 'W';
  }

  return tin[7].toUpperCase() === String.fromCharCode(64 + checksum);
} // Valid US IRS campus prefixes


var enUsCampusPrefix = {
  andover: ['10', '12'],
  atlanta: ['60', '67'],
  austin: ['50', '53'],
  brookhaven: ['01', '02', '03', '04', '05', '06', '11', '13', '14', '16', '21', '22', '23', '25', '34', '51', '52', '54', '55', '56', '57', '58', '59', '65'],
  cincinnati: ['30', '32', '35', '36', '37', '38', '61'],
  fresno: ['15', '24'],
  internet: ['20', '26', '27', '45', '46', '47'],
  kansas: ['40', '44'],
  memphis: ['94', '95'],
  ogden: ['80', '90'],
  philadelphia: ['33', '39', '41', '42', '43', '46', '48', '62', '63', '64', '66', '68', '71', '72', '73', '74', '75', '76', '77', '81', '82', '83', '84', '85', '86', '87', '88', '91', '92', '93', '98', '99'],
  sba: ['31']
}; // Return an array of all US IRS campus prefixes

function enUsGetPrefixes() {
  var prefixes = [];

  for (var location in enUsCampusPrefix) {
    // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
    // istanbul ignore else
    if (enUsCampusPrefix.hasOwnProperty(location)) {
      prefixes.push.apply(prefixes, _toConsumableArray(enUsCampusPrefix[location]));
    }
  }

  return prefixes;
}
/*
 * en-US validation function
 * Verify that the TIN starts with a valid IRS campus prefix
 */


function enUsCheck(tin) {
  return enUsGetPrefixes().indexOf(tin.substr(0, 2)) !== -1;
}
/*
 * es-ES validation function
 * (Documento Nacional de Identidad (DNI)
 * or Número de Identificación de Extranjero (NIE), persons only)
 * Verify TIN validity by calculating check (last) character
 */


function esEsCheck(tin) {
  // Split characters into an array for further processing
  var chars = tin.toUpperCase().split(''); // Replace initial letter if needed

  if (isNaN(parseInt(chars[0], 10)) && chars.length > 1) {
    var lead_replace = 0;

    switch (chars[0]) {
      case 'Y':
        lead_replace = 1;
        break;

      case 'Z':
        lead_replace = 2;
        break;

      default:
    }

    chars.splice(0, 1, lead_replace); // Fill with zeros if smaller than proper
  } else {
    while (chars.length < 9) {
      chars.unshift(0);
    }
  } // Calculate checksum and check according to lookup


  var lookup = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
  chars = chars.join('');
  var checksum = parseInt(chars.slice(0, 8), 10) % 23;
  return chars[8] === lookup[checksum];
}
/*
 * et-EE validation function
 * (Isikukood (IK), persons only)
 * Checks if birth date (century digit and six following) is valid and calculates check (last) digit
 * Material not in DG TAXUD document sourced from:
 * - `https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Estonia-TIN.pdf`
 */


function etEeCheck(tin) {
  // Extract year and add century
  var full_year = tin.slice(1, 3);
  var century_digit = tin.slice(0, 1);

  switch (century_digit) {
    case '1':
    case '2':
      full_year = "18".concat(full_year);
      break;

    case '3':
    case '4':
      full_year = "19".concat(full_year);
      break;

    default:
      full_year = "20".concat(full_year);
      break;
  } // Check date validity


  var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Split digits into an array for further processing


  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  var weight = 1; // Multiply by weight and add to checksum

  for (var i = 0; i < 10; i++) {
    checksum += digits[i] * weight;
    weight += 1;

    if (weight === 10) {
      weight = 1;
    }
  } // Do again if modulo 11 of checksum is 10


  if (checksum % 11 === 10) {
    checksum = 0;
    weight = 3;

    for (var _i3 = 0; _i3 < 10; _i3++) {
      checksum += digits[_i3] * weight;
      weight += 1;

      if (weight === 10) {
        weight = 1;
      }
    }

    if (checksum % 11 === 10) {
      return digits[10] === 0;
    }
  }

  return checksum % 11 === digits[10];
}
/*
 * fi-FI validation function
 * (Henkilötunnus (HETU), persons only)
 * Checks if birth date (first six digits plus century symbol) is valid
 * and calculates check (last) digit
 */


function fiFiCheck(tin) {
  // Extract year and add century
  var full_year = tin.slice(4, 6);
  var century_symbol = tin.slice(6, 7);

  switch (century_symbol) {
    case '+':
      full_year = "18".concat(full_year);
      break;

    case '-':
      full_year = "19".concat(full_year);
      break;

    default:
      full_year = "20".concat(full_year);
      break;
  } // Check date validity


  var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Calculate check character


  var checksum = parseInt(tin.slice(0, 6) + tin.slice(7, 10), 10) % 31;

  if (checksum < 10) {
    return checksum === parseInt(tin.slice(10), 10);
  }

  checksum -= 10;
  var letters_lookup = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
  return letters_lookup[checksum] === tin.slice(10);
}
/*
 * fr/nl-BE validation function
 * (Numéro national (N.N.), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last two) digits
 */


function frBeCheck(tin) {
  // Zero month/day value is acceptable
  if (tin.slice(2, 4) !== '00' || tin.slice(4, 6) !== '00') {
    // Extract date from first six digits of TIN
    var date = "".concat(tin.slice(0, 2), "/").concat(tin.slice(2, 4), "/").concat(tin.slice(4, 6));

    if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
      return false;
    }
  }

  var checksum = 97 - parseInt(tin.slice(0, 9), 10) % 97;
  var checkdigits = parseInt(tin.slice(9, 11), 10);

  if (checksum !== checkdigits) {
    checksum = 97 - parseInt("2".concat(tin.slice(0, 9)), 10) % 97;

    if (checksum !== checkdigits) {
      return false;
    }
  }

  return true;
}
/*
 * fr-FR validation function
 * (Numéro fiscal de référence (numéro SPI), persons only)
 * Verify TIN validity by calculating check (last three) digits
 */


function frFrCheck(tin) {
  tin = tin.replace(/\s/g, '');
  var checksum = parseInt(tin.slice(0, 10), 10) % 511;
  var checkdigits = parseInt(tin.slice(10, 13), 10);
  return checksum === checkdigits;
}
/*
 * fr/lb-LU validation function
 * (numéro d’identification personnelle, persons only)
 * Verify birth date validity and run Luhn and Verhoeff checks
 */


function frLuCheck(tin) {
  // Extract date and check validity
  var date = "".concat(tin.slice(0, 4), "/").concat(tin.slice(4, 6), "/").concat(tin.slice(6, 8));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Run Luhn check


  if (!algorithms.luhnCheck(tin.slice(0, 12))) {
    return false;
  } // Remove Luhn check digit and run Verhoeff check


  return algorithms.verhoeffCheck("".concat(tin.slice(0, 11)).concat(tin[12]));
}
/*
 * hr-HR validation function
 * (Osobni identifikacijski broj (OIB), persons/entities)
 * Verify TIN validity by calling iso7064Check(digits)
 */


function hrHrCheck(tin) {
  return algorithms.iso7064Check(tin);
}
/*
 * hu-HU validation function
 * (Adóazonosító jel, persons only)
 * Verify TIN validity by calculating check (last) digit
 */


function huHuCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 8;

  for (var i = 1; i < 9; i++) {
    checksum += digits[i] * (i + 1);
  }

  return checksum % 11 === digits[9];
}
/*
 * lt-LT validation function (should go here if needed)
 * (Asmens kodas, persons/entities respectively)
 * Current validation check is alias of etEeCheck- same format applies
 */

/*
 * it-IT first/last name validity check
 * Accepts it-IT TIN-encoded names as a three-element character array and checks their validity
 * Due to lack of clarity between resources ("Are only Italian consonants used?
 * What happens if a person has X in their name?" etc.) only two test conditions
 * have been implemented:
 * Vowels may only be followed by other vowels or an X character
 * and X characters after vowels may only be followed by other X characters.
 */


function itItNameCheck(name) {
  // true at the first occurence of a vowel
  var vowelflag = false; // true at the first occurence of an X AFTER vowel
  // (to properly handle last names with X as consonant)

  var xflag = false;

  for (var i = 0; i < 3; i++) {
    if (!vowelflag && /[AEIOU]/.test(name[i])) {
      vowelflag = true;
    } else if (!xflag && vowelflag && name[i] === 'X') {
      xflag = true;
    } else if (i > 0) {
      if (vowelflag && !xflag) {
        if (!/[AEIOU]/.test(name[i])) {
          return false;
        }
      }

      if (xflag) {
        if (!/X/.test(name[i])) {
          return false;
        }
      }
    }
  }

  return true;
}
/*
 * it-IT validation function
 * (Codice fiscale (TIN-IT), persons only)
 * Verify name, birth date and codice catastale validity
 * and calculate check character.
 * Material not in DG-TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/Italian_fiscal_code`
 */


function itItCheck(tin) {
  // Capitalize and split characters into an array for further processing
  var chars = tin.toUpperCase().split(''); // Check first and last name validity calling itItNameCheck()

  if (!itItNameCheck(chars.slice(0, 3))) {
    return false;
  }

  if (!itItNameCheck(chars.slice(3, 6))) {
    return false;
  } // Convert letters in number spaces back to numbers if any


  var number_locations = [6, 7, 9, 10, 12, 13, 14];
  var number_replace = {
    L: '0',
    M: '1',
    N: '2',
    P: '3',
    Q: '4',
    R: '5',
    S: '6',
    T: '7',
    U: '8',
    V: '9'
  };

  for (var _i4 = 0, _number_locations = number_locations; _i4 < _number_locations.length; _i4++) {
    var i = _number_locations[_i4];

    if (chars[i] in number_replace) {
      chars.splice(i, 1, number_replace[chars[i]]);
    }
  } // Extract month and day, and check date validity


  var month_replace = {
    A: '01',
    B: '02',
    C: '03',
    D: '04',
    E: '05',
    H: '06',
    L: '07',
    M: '08',
    P: '09',
    R: '10',
    S: '11',
    T: '12'
  };
  var month = month_replace[chars[8]];
  var day = parseInt(chars[9] + chars[10], 10);

  if (day > 40) {
    day -= 40;
  }

  if (day < 10) {
    day = "0".concat(day);
  }

  var date = "".concat(chars[6]).concat(chars[7], "/").concat(month, "/").concat(day);

  if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
    return false;
  } // Calculate check character by adding up even and odd characters as numbers


  var checksum = 0;

  for (var _i5 = 1; _i5 < chars.length - 1; _i5 += 2) {
    var char_to_int = parseInt(chars[_i5], 10);

    if (isNaN(char_to_int)) {
      char_to_int = chars[_i5].charCodeAt(0) - 65;
    }

    checksum += char_to_int;
  }

  var odd_convert = {
    // Maps of characters at odd places
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
    0: 1,
    1: 0
  };

  for (var _i6 = 0; _i6 < chars.length - 1; _i6 += 2) {
    var _char_to_int = 0;

    if (chars[_i6] in odd_convert) {
      _char_to_int = odd_convert[chars[_i6]];
    } else {
      var multiplier = parseInt(chars[_i6], 10);
      _char_to_int = 2 * multiplier + 1;

      if (multiplier > 4) {
        _char_to_int += 2;
      }
    }

    checksum += _char_to_int;
  }

  if (String.fromCharCode(65 + checksum % 26) !== chars[15]) {
    return false;
  }

  return true;
}
/*
 * lv-LV validation function
 * (Personas kods (PK), persons only)
 * Check validity of birth date and calculate check (last) digit
 * Support only for old format numbers (not starting with '32', issued before 2017/07/01)
 * Material not in DG TAXUD document sourced from:
 * `https://boot.ritakafija.lv/forums/index.php?/topic/88314-personas-koda-algoritms-%C4%8Deksumma/`
 */


function lvLvCheck(tin) {
  tin = tin.replace(/\W/, ''); // Extract date from TIN

  var day = tin.slice(0, 2);

  if (day !== '32') {
    // No date/checksum check if new format
    var month = tin.slice(2, 4);

    if (month !== '00') {
      // No date check if unknown month
      var full_year = tin.slice(4, 6);

      switch (tin[6]) {
        case '0':
          full_year = "18".concat(full_year);
          break;

        case '1':
          full_year = "19".concat(full_year);
          break;

        default:
          full_year = "20".concat(full_year);
          break;
      } // Check date validity


      var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(day);

      if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
        return false;
      }
    } // Calculate check digit


    var checksum = 1101;
    var multip_lookup = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

    for (var i = 0; i < tin.length - 1; i++) {
      checksum -= parseInt(tin[i], 10) * multip_lookup[i];
    }

    return parseInt(tin[10], 10) === checksum % 11;
  }

  return true;
}
/*
 * mt-MT validation function
 * (Identity Card Number or Unique Taxpayer Reference, persons/entities)
 * Verify Identity Card Number structure (no other tests found)
 */


function mtMtCheck(tin) {
  if (tin.length !== 9) {
    // No tests for UTR
    var chars = tin.toUpperCase().split(''); // Fill with zeros if smaller than proper

    while (chars.length < 8) {
      chars.unshift(0);
    } // Validate format according to last character


    switch (tin[7]) {
      case 'A':
      case 'P':
        if (parseInt(chars[6], 10) === 0) {
          return false;
        }

        break;

      default:
        {
          var first_part = parseInt(chars.join('').slice(0, 5), 10);

          if (first_part > 32000) {
            return false;
          }

          var second_part = parseInt(chars.join('').slice(5, 7), 10);

          if (first_part === second_part) {
            return false;
          }
        }
    }
  }

  return true;
}
/*
 * nl-NL validation function
 * (Burgerservicenummer (BSN) or Rechtspersonen Samenwerkingsverbanden Informatie Nummer (RSIN),
 * persons/entities respectively)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */


function nlNlCheck(tin) {
  return algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(function (a) {
    return parseInt(a, 10);
  }), 9) % 11 === parseInt(tin[8], 10);
}
/*
 * pl-PL validation function
 * (Powszechny Elektroniczny System Ewidencji Ludności (PESEL)
 * or Numer identyfikacji podatkowej (NIP), persons/entities)
 * Verify TIN validity by validating birth date (PESEL) and calculating check (last) digit
 */


function plPlCheck(tin) {
  // NIP
  if (tin.length === 10) {
    // Calculate last digit by multiplying with lookup
    var lookup = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    var _checksum = 0;

    for (var i = 0; i < lookup.length; i++) {
      _checksum += parseInt(tin[i], 10) * lookup[i];
    }

    _checksum %= 11;

    if (_checksum === 10) {
      return false;
    }

    return _checksum === parseInt(tin[9], 10);
  } // PESEL
  // Extract full year using month


  var full_year = tin.slice(0, 2);
  var month = parseInt(tin.slice(2, 4), 10);

  if (month > 80) {
    full_year = "18".concat(full_year);
    month -= 80;
  } else if (month > 60) {
    full_year = "22".concat(full_year);
    month -= 60;
  } else if (month > 40) {
    full_year = "21".concat(full_year);
    month -= 40;
  } else if (month > 20) {
    full_year = "20".concat(full_year);
    month -= 20;
  } else {
    full_year = "19".concat(full_year);
  } // Add leading zero to month if needed


  if (month < 10) {
    month = "0".concat(month);
  } // Check date validity


  var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));

  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  } // Calculate last digit by mulitplying with odd one-digit numbers except 5


  var checksum = 0;
  var multiplier = 1;

  for (var _i7 = 0; _i7 < tin.length - 1; _i7++) {
    checksum += parseInt(tin[_i7], 10) * multiplier % 10;
    multiplier += 2;

    if (multiplier > 10) {
      multiplier = 1;
    } else if (multiplier === 5) {
      multiplier += 2;
    }
  }

  checksum = 10 - checksum % 10;
  return checksum === parseInt(tin[10], 10);
}
/*
* pt-BR validation function
* (Cadastro de Pessoas Físicas (CPF, persons)
* Cadastro Nacional de Pessoas Jurídicas (CNPJ, entities)
* Both inputs will be validated
*/


function ptBrCheck(tin) {
  if (tin.length === 11) {
    var _sum;

    var remainder;
    _sum = 0;
    if ( // Reject known invalid CPFs
    tin === '11111111111' || tin === '22222222222' || tin === '33333333333' || tin === '44444444444' || tin === '55555555555' || tin === '66666666666' || tin === '77777777777' || tin === '88888888888' || tin === '99999999999' || tin === '00000000000') return false;

    for (var i = 1; i <= 9; i++) {
      _sum += parseInt(tin.substring(i - 1, i), 10) * (11 - i);
    }

    remainder = _sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(9, 10), 10)) return false;
    _sum = 0;

    for (var _i8 = 1; _i8 <= 10; _i8++) {
      _sum += parseInt(tin.substring(_i8 - 1, _i8), 10) * (12 - _i8);
    }

    remainder = _sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(10, 11), 10)) return false;
    return true;
  }

  if ( // Reject know invalid CNPJs
  tin === '00000000000000' || tin === '11111111111111' || tin === '22222222222222' || tin === '33333333333333' || tin === '44444444444444' || tin === '55555555555555' || tin === '66666666666666' || tin === '77777777777777' || tin === '88888888888888' || tin === '99999999999999') {
    return false;
  }

  var length = tin.length - 2;
  var identifiers = tin.substring(0, length);
  var verificators = tin.substring(length);
  var sum = 0;
  var pos = length - 7;

  for (var _i9 = length; _i9 >= 1; _i9--) {
    sum += identifiers.charAt(length - _i9) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  var result = sum % 11 < 2 ? 0 : 11 - sum % 11;

  if (result !== parseInt(verificators.charAt(0), 10)) {
    return false;
  }

  length += 1;
  identifiers = tin.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (var _i10 = length; _i10 >= 1; _i10--) {
    sum += identifiers.charAt(length - _i10) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - sum % 11;

  if (result !== parseInt(verificators.charAt(1), 10)) {
    return false;
  }

  return true;
}
/*
 * pt-PT validation function
 * (Número de identificação fiscal (NIF), persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */


function ptPtCheck(tin) {
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(function (a) {
    return parseInt(a, 10);
  }), 9) % 11;

  if (checksum > 9) {
    return parseInt(tin[8], 10) === 0;
  }

  return checksum === parseInt(tin[8], 10);
}
/*
 * ro-RO validation function
 * (Cod Numeric Personal (CNP) or Cod de înregistrare fiscală (CIF),
 * persons only)
 * Verify CNP validity by calculating check (last) digit (test not found for CIF)
 * Material not in DG TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/National_identification_number#Romania`
 */


function roRoCheck(tin) {
  if (tin.slice(0, 4) !== '9000') {
    // No test found for this format
    // Extract full year using century digit if possible
    var full_year = tin.slice(1, 3);

    switch (tin[0]) {
      case '1':
      case '2':
        full_year = "19".concat(full_year);
        break;

      case '3':
      case '4':
        full_year = "18".concat(full_year);
        break;

      case '5':
      case '6':
        full_year = "20".concat(full_year);
        break;

      default:
    } // Check date validity


    var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));

    if (date.length === 8) {
      if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
        return false;
      }
    } else if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
      return false;
    } // Calculate check digit


    var digits = tin.split('').map(function (a) {
      return parseInt(a, 10);
    });
    var multipliers = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    var checksum = 0;

    for (var i = 0; i < multipliers.length; i++) {
      checksum += digits[i] * multipliers[i];
    }

    if (checksum % 11 === 10) {
      return digits[12] === 1;
    }

    return digits[12] === checksum % 11;
  }

  return true;
}
/*
 * sk-SK validation function
 * (Rodné číslo (RČ) or bezvýznamové identifikačné číslo (BIČ), persons only)
 * Checks validity of pre-1954 birth numbers (rodné číslo) only
 * Due to the introduction of the pseudo-random BIČ it is not possible to test
 * post-1954 birth numbers without knowing whether they are BIČ or RČ beforehand
 */


function skSkCheck(tin) {
  if (tin.length === 9) {
    tin = tin.replace(/\W/, '');

    if (tin.slice(6) === '000') {
      return false;
    } // Three-zero serial not assigned before 1954
    // Extract full year from TIN length


    var full_year = parseInt(tin.slice(0, 2), 10);

    if (full_year > 53) {
      return false;
    }

    if (full_year < 10) {
      full_year = "190".concat(full_year);
    } else {
      full_year = "19".concat(full_year);
    } // Extract month from TIN and normalize


    var month = parseInt(tin.slice(2, 4), 10);

    if (month > 50) {
      month -= 50;
    }

    if (month < 10) {
      month = "0".concat(month);
    } // Check date validity


    var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));

    if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
      return false;
    }
  }

  return true;
}
/*
 * sl-SI validation function
 * (Davčna številka, persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */


function slSiCheck(tin) {
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(function (a) {
    return parseInt(a, 10);
  }), 8) % 11;

  if (checksum === 10) {
    return parseInt(tin[7], 10) === 0;
  }

  return checksum === parseInt(tin[7], 10);
}
/*
 * sv-SE validation function
 * (Personnummer or samordningsnummer, persons only)
 * Checks validity of birth date and calls luhnCheck() to validate check (last) digit
 */


function svSeCheck(tin) {
  // Make copy of TIN and normalize to two-digit year form
  var tin_copy = tin.slice(0);

  if (tin.length > 11) {
    tin_copy = tin_copy.slice(2);
  } // Extract date of birth


  var full_year = '';
  var month = tin_copy.slice(2, 4);
  var day = parseInt(tin_copy.slice(4, 6), 10);

  if (tin.length > 11) {
    full_year = tin.slice(0, 4);
  } else {
    full_year = tin.slice(0, 2);

    if (tin.length === 11 && day < 60) {
      // Extract full year from centenarian symbol
      // Should work just fine until year 10000 or so
      var current_year = new Date().getFullYear().toString();
      var current_century = parseInt(current_year.slice(0, 2), 10);
      current_year = parseInt(current_year, 10);

      if (tin[6] === '-') {
        if (parseInt("".concat(current_century).concat(full_year), 10) > current_year) {
          full_year = "".concat(current_century - 1).concat(full_year);
        } else {
          full_year = "".concat(current_century).concat(full_year);
        }
      } else {
        full_year = "".concat(current_century - 1).concat(full_year);

        if (current_year - parseInt(full_year, 10) < 100) {
          return false;
        }
      }
    }
  } // Normalize day and check date validity


  if (day > 60) {
    day -= 60;
  }

  if (day < 10) {
    day = "0".concat(day);
  }

  var date = "".concat(full_year, "/").concat(month, "/").concat(day);

  if (date.length === 8) {
    if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
      return false;
    }
  } else if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  return algorithms.luhnCheck(tin.replace(/\W/, ''));
} // Locale lookup objects

/*
 * Tax id regex formats for various locales
 *
 * Where not explicitly specified in DG-TAXUD document both
 * uppercase and lowercase letters are acceptable.
 */


var taxIdFormat = {
  'bg-BG': /^\d{10}$/,
  'cs-CZ': /^\d{6}\/{0,1}\d{3,4}$/,
  'de-AT': /^\d{9}$/,
  'de-DE': /^[1-9]\d{10}$/,
  'dk-DK': /^\d{6}-{0,1}\d{4}$/,
  'el-CY': /^[09]\d{7}[A-Z]$/,
  'el-GR': /^([0-4]|[7-9])\d{8}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-IE': /^\d{7}[A-W][A-IW]{0,1}$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'es-ES': /^(\d{0,8}|[XYZKLM]\d{7})[A-HJ-NP-TV-Z]$/i,
  'et-EE': /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
  'fi-FI': /^\d{6}[-+A]\d{3}[0-9A-FHJ-NPR-Y]$/i,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/,
  // Conforms both to official spec and provided example
  'fr-LU': /^\d{13}$/,
  'hr-HR': /^\d{11}$/,
  'hu-HU': /^8\d{9}$/,
  'it-IT': /^[A-Z]{6}[L-NP-V0-9]{2}[A-EHLMPRST][L-NP-V0-9]{2}[A-ILMZ][L-NP-V0-9]{3}[A-Z]$/i,
  'lv-LV': /^\d{6}-{0,1}\d{5}$/,
  // Conforms both to DG TAXUD spec and original research
  'mt-MT': /^\d{3,7}[APMGLHBZ]$|^([1-8])\1\d{7}$/i,
  'nl-NL': /^\d{9}$/,
  'pl-PL': /^\d{10,11}$/,
  'pt-BR': /(?:^\d{11}$)|(?:^\d{14}$)/,
  'pt-PT': /^\d{9}$/,
  'ro-RO': /^\d{13}$/,
  'sk-SK': /^\d{6}\/{0,1}\d{3,4}$/,
  'sl-SI': /^[1-9]\d{7}$/,
  'sv-SE': /^(\d{6}[-+]{0,1}\d{4}|(18|19|20)\d{6}[-+]{0,1}\d{4})$/
}; // taxIdFormat locale aliases

taxIdFormat['lb-LU'] = taxIdFormat['fr-LU'];
taxIdFormat['lt-LT'] = taxIdFormat['et-EE'];
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE']; // Algorithmic tax id check functions for various locales

var taxIdCheck = {
  'bg-BG': bgBgCheck,
  'cs-CZ': csCzCheck,
  'de-AT': deAtCheck,
  'de-DE': deDeCheck,
  'dk-DK': dkDkCheck,
  'el-CY': elCyCheck,
  'el-GR': elGrCheck,
  'en-IE': enIeCheck,
  'en-US': enUsCheck,
  'es-ES': esEsCheck,
  'et-EE': etEeCheck,
  'fi-FI': fiFiCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,
  'fr-LU': frLuCheck,
  'hr-HR': hrHrCheck,
  'hu-HU': huHuCheck,
  'it-IT': itItCheck,
  'lv-LV': lvLvCheck,
  'mt-MT': mtMtCheck,
  'nl-NL': nlNlCheck,
  'pl-PL': plPlCheck,
  'pt-BR': ptBrCheck,
  'pt-PT': ptPtCheck,
  'ro-RO': roRoCheck,
  'sk-SK': skSkCheck,
  'sl-SI': slSiCheck,
  'sv-SE': svSeCheck
}; // taxIdCheck locale aliases

taxIdCheck['lb-LU'] = taxIdCheck['fr-LU'];
taxIdCheck['lt-LT'] = taxIdCheck['et-EE'];
taxIdCheck['nl-BE'] = taxIdCheck['fr-BE']; // Regexes for locales where characters should be omitted before checking format

var allsymbols = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g;
var sanitizeRegexes = {
  'de-AT': allsymbols,
  'de-DE': /[\/\\]/g,
  'fr-BE': allsymbols
}; // sanitizeRegexes locale aliases

sanitizeRegexes['nl-BE'] = sanitizeRegexes['fr-BE'];
/*
 * Validator function
 * Return true if the passed string is a valid tax identification number
 * for the specified locale.
 * Throw an error exception if the locale is not supported.
 */

function isTaxID(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  (0, _assertString.default)(str); // Copy TIN to avoid replacement if sanitized

  var strcopy = str.slice(0);

  if (locale in taxIdFormat) {
    if (locale in sanitizeRegexes) {
      strcopy = strcopy.replace(sanitizeRegexes[locale], '');
    }

    if (!taxIdFormat[locale].test(strcopy)) {
      return false;
    }

    if (locale in taxIdCheck) {
      return taxIdCheck[locale](strcopy);
    } // Fallthrough; not all locales have algorithmic checks


    return true;
  }

  throw new Error("Invalid locale '".concat(locale, "'"));
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isDate":66,"./util/algorithms":139,"./util/assertString":140}],122:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isFQDN = _interopRequireDefault(require("./isFQDN"));

var _isIP = _interopRequireDefault(require("./isIP"));

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
options for isURL method

require_protocol - if set as true isURL will return false if protocol is not present in the URL
require_valid_protocol - isURL will check if the URL's protocol is present in the protocols option
protocols - valid protocols can be modified with this option
require_host - if set as false isURL will not check if host is present in the URL
require_port - if set as true isURL will check if port is present in the URL
allow_protocol_relative_urls - if set as true protocol relative URLs will be allowed
validate_length - if set as false isURL will skip string length validation (IE maximum is 2083)

*/
var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_port: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true
};
var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];

    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }

  return false;
}

function isURL(url, options) {
  (0, _assertString.default)(url);

  if (!url || /[\s<>]/.test(url)) {
    return false;
  }

  if (url.indexOf('mailto:') === 0) {
    return false;
  }

  options = (0, _merge.default)(options, default_url_options);

  if (options.validate_length && url.length >= 2083) {
    return false;
  }

  if (!options.allow_fragments && url.includes('#')) {
    return false;
  }

  if (!options.allow_query_components && (url.includes('?') || url.includes('&'))) {
    return false;
  }

  var protocol, auth, host, hostname, port, port_str, split, ipv6;
  split = url.split('#');
  url = split.shift();
  split = url.split('?');
  url = split.shift();
  split = url.split('://');

  if (split.length > 1) {
    protocol = split.shift().toLowerCase();

    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (url.substr(0, 2) === '//') {
    if (!options.allow_protocol_relative_urls) {
      return false;
    }

    split[0] = url.substr(2);
  }

  url = split.join('://');

  if (url === '') {
    return false;
  }

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');

  if (split.length > 1) {
    if (options.disallow_auth) {
      return false;
    }

    if (split[0] === '') {
      return false;
    }

    auth = split.shift();

    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }

    var _auth$split = auth.split(':'),
        _auth$split2 = _slicedToArray(_auth$split, 2),
        user = _auth$split2[0],
        password = _auth$split2[1];

    if (user === '' && password === '') {
      return false;
    }
  }

  hostname = split.join('@');
  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);

  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();

    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null && port_str.length > 0) {
    port = parseInt(port_str, 10);

    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  } else if (options.require_port) {
    return false;
  }

  if (options.host_whitelist) {
    return checkHost(host, options.host_whitelist);
  }

  if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
    return false;
  }

  host = host || ipv6;

  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isFQDN":73,"./isIP":83,"./util/assertString":140,"./util/merge":142}],123:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUUID;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuid = {
  1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

function isUUID(str, version) {
  (0, _assertString.default)(str);
  var pattern = uuid[![undefined, null].includes(version) ? version : 'all'];
  return !!pattern && pattern.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],124:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUppercase;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isUppercase(str) {
  (0, _assertString.default)(str);
  return str === str.toUpperCase();
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],125:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isVAT;
exports.vatMatchers = void 0;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vatMatchers = {
  GB: /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/,
  IT: /^(IT)?[0-9]{11}$/,
  NL: /^(NL)?[0-9]{9}B[0-9]{2}$/
};
exports.vatMatchers = vatMatchers;

function isVAT(str, countryCode) {
  (0, _assertString.default)(str);
  (0, _assertString.default)(countryCode);

  if (countryCode in vatMatchers) {
    return vatMatchers[countryCode].test(str);
  }

  throw new Error("Invalid country code: '".concat(countryCode, "'"));
}
},{"./util/assertString":140}],126:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isVariableWidth;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _isFullWidth = require("./isFullWidth");

var _isHalfWidth = require("./isHalfWidth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isVariableWidth(str) {
  (0, _assertString.default)(str);
  return _isFullWidth.fullWidth.test(str) && _isHalfWidth.halfWidth.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isFullWidth":75,"./isHalfWidth":77,"./util/assertString":140}],127:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isWhitelisted;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isWhitelisted(str, chars) {
  (0, _assertString.default)(str);

  for (var i = str.length - 1; i >= 0; i--) {
    if (chars.indexOf(str[i]) === -1) {
      return false;
    }
  }

  return true;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],128:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ltrim;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ltrim(str, chars) {
  (0, _assertString.default)(str); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping

  var pattern = chars ? new RegExp("^[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "]+"), 'g') : /^\s+/g;
  return str.replace(pattern, '');
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],129:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matches;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matches(str, pattern, modifiers) {
  (0, _assertString.default)(str);

  if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
    pattern = new RegExp(pattern, modifiers);
  }

  return pattern.test(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],130:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeEmail;

var _merge = _interopRequireDefault(require("./util/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_normalize_email_options = {
  // The following options apply to all email addresses
  // Lowercases the local part of the email address.
  // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
  // The domain is always lowercased, as per RFC 1035
  all_lowercase: true,
  // The following conversions are specific to GMail
  // Lowercases the local part of the GMail address (known to be case-insensitive)
  gmail_lowercase: true,
  // Removes dots from the local part of the email address, as that's ignored by GMail
  gmail_remove_dots: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  gmail_remove_subaddress: true,
  // Conversts the googlemail.com domain to gmail.com
  gmail_convert_googlemaildotcom: true,
  // The following conversions are specific to Outlook.com / Windows Live / Hotmail
  // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
  outlookdotcom_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  outlookdotcom_remove_subaddress: true,
  // The following conversions are specific to Yahoo
  // Lowercases the local part of the Yahoo address (known to be case-insensitive)
  yahoo_lowercase: true,
  // Removes the subaddress (e.g. "-foo") from the email address
  yahoo_remove_subaddress: true,
  // The following conversions are specific to Yandex
  // Lowercases the local part of the Yandex address (known to be case-insensitive)
  yandex_lowercase: true,
  // The following conversions are specific to iCloud
  // Lowercases the local part of the iCloud address (known to be case-insensitive)
  icloud_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  icloud_remove_subaddress: true
}; // List of domains used by iCloud

var icloud_domains = ['icloud.com', 'me.com']; // List of domains used by Outlook.com and its predecessors
// This list is likely incomplete.
// Partial reference:
// https://blogs.office.com/2013/04/17/outlook-com-gets-two-step-verification-sign-in-by-alias-and-new-international-domains/

var outlookdotcom_domains = ['hotmail.at', 'hotmail.be', 'hotmail.ca', 'hotmail.cl', 'hotmail.co.il', 'hotmail.co.nz', 'hotmail.co.th', 'hotmail.co.uk', 'hotmail.com', 'hotmail.com.ar', 'hotmail.com.au', 'hotmail.com.br', 'hotmail.com.gr', 'hotmail.com.mx', 'hotmail.com.pe', 'hotmail.com.tr', 'hotmail.com.vn', 'hotmail.cz', 'hotmail.de', 'hotmail.dk', 'hotmail.es', 'hotmail.fr', 'hotmail.hu', 'hotmail.id', 'hotmail.ie', 'hotmail.in', 'hotmail.it', 'hotmail.jp', 'hotmail.kr', 'hotmail.lv', 'hotmail.my', 'hotmail.ph', 'hotmail.pt', 'hotmail.sa', 'hotmail.sg', 'hotmail.sk', 'live.be', 'live.co.uk', 'live.com', 'live.com.ar', 'live.com.mx', 'live.de', 'live.es', 'live.eu', 'live.fr', 'live.it', 'live.nl', 'msn.com', 'outlook.at', 'outlook.be', 'outlook.cl', 'outlook.co.il', 'outlook.co.nz', 'outlook.co.th', 'outlook.com', 'outlook.com.ar', 'outlook.com.au', 'outlook.com.br', 'outlook.com.gr', 'outlook.com.pe', 'outlook.com.tr', 'outlook.com.vn', 'outlook.cz', 'outlook.de', 'outlook.dk', 'outlook.es', 'outlook.fr', 'outlook.hu', 'outlook.id', 'outlook.ie', 'outlook.in', 'outlook.it', 'outlook.jp', 'outlook.kr', 'outlook.lv', 'outlook.my', 'outlook.ph', 'outlook.pt', 'outlook.sa', 'outlook.sg', 'outlook.sk', 'passport.com']; // List of domains used by Yahoo Mail
// This list is likely incomplete

var yahoo_domains = ['rocketmail.com', 'yahoo.ca', 'yahoo.co.uk', 'yahoo.com', 'yahoo.de', 'yahoo.fr', 'yahoo.in', 'yahoo.it', 'ymail.com']; // List of domains used by yandex.ru

var yandex_domains = ['yandex.ru', 'yandex.ua', 'yandex.kz', 'yandex.com', 'yandex.by', 'ya.ru']; // replace single dots, but not multiple consecutive dots

function dotsReplacer(match) {
  if (match.length > 1) {
    return match;
  }

  return '';
}

function normalizeEmail(email, options) {
  options = (0, _merge.default)(options, default_normalize_email_options);
  var raw_parts = email.split('@');
  var domain = raw_parts.pop();
  var user = raw_parts.join('@');
  var parts = [user, domain]; // The domain is always lowercased, as it's case-insensitive per RFC 1035

  parts[1] = parts[1].toLowerCase();

  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    // Address is GMail
    if (options.gmail_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }

    if (options.gmail_remove_dots) {
      // this does not replace consecutive dots like example..email@gmail.com
      parts[0] = parts[0].replace(/\.+/g, dotsReplacer);
    }

    if (!parts[0].length) {
      return false;
    }

    if (options.all_lowercase || options.gmail_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }

    parts[1] = options.gmail_convert_googlemaildotcom ? 'gmail.com' : parts[1];
  } else if (icloud_domains.indexOf(parts[1]) >= 0) {
    // Address is iCloud
    if (options.icloud_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }

    if (!parts[0].length) {
      return false;
    }

    if (options.all_lowercase || options.icloud_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (outlookdotcom_domains.indexOf(parts[1]) >= 0) {
    // Address is Outlook.com
    if (options.outlookdotcom_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }

    if (!parts[0].length) {
      return false;
    }

    if (options.all_lowercase || options.outlookdotcom_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (yahoo_domains.indexOf(parts[1]) >= 0) {
    // Address is Yahoo
    if (options.yahoo_remove_subaddress) {
      var components = parts[0].split('-');
      parts[0] = components.length > 1 ? components.slice(0, -1).join('-') : components[0];
    }

    if (!parts[0].length) {
      return false;
    }

    if (options.all_lowercase || options.yahoo_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (yandex_domains.indexOf(parts[1]) >= 0) {
    if (options.all_lowercase || options.yandex_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }

    parts[1] = 'yandex.ru'; // all yandex domains are equal, 1st preferred
  } else if (options.all_lowercase) {
    // Any other address
    parts[0] = parts[0].toLowerCase();
  }

  return parts.join('@');
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/merge":142}],131:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rtrim;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rtrim(str, chars) {
  (0, _assertString.default)(str);

  if (chars) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    var pattern = new RegExp("[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "]+$"), 'g');
    return str.replace(pattern, '');
  } // Use a faster and more safe than regex trim method https://blog.stevenlevithan.com/archives/faster-trim-javascript


  var strIndex = str.length - 1;

  while (/\s/.test(str.charAt(strIndex))) {
    strIndex -= 1;
  }

  return str.slice(0, strIndex + 1);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],132:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stripLow;

var _assertString = _interopRequireDefault(require("./util/assertString"));

var _blacklist = _interopRequireDefault(require("./blacklist"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stripLow(str, keep_new_lines) {
  (0, _assertString.default)(str);
  var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
  return (0, _blacklist.default)(str, chars);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./blacklist":47,"./util/assertString":140}],133:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toBoolean;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toBoolean(str, strict) {
  (0, _assertString.default)(str);

  if (strict) {
    return str === '1' || /^true$/i.test(str);
  }

  return str !== '0' && !/^false$/i.test(str) && str !== '';
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],134:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toDate;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toDate(date) {
  (0, _assertString.default)(date);
  date = Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toFloat;

var _isFloat = _interopRequireDefault(require("./isFloat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toFloat(str) {
  if (!(0, _isFloat.default)(str)) return NaN;
  return parseFloat(str);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./isFloat":74}],136:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toInt;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toInt(str, radix) {
  (0, _assertString.default)(str);
  return parseInt(str, radix || 10);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],137:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = trim;

var _rtrim = _interopRequireDefault(require("./rtrim"));

var _ltrim = _interopRequireDefault(require("./ltrim"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function trim(str, chars) {
  return (0, _rtrim.default)((0, _ltrim.default)(str, chars), chars);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./ltrim":128,"./rtrim":131}],138:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unescape;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unescape(str) {
  (0, _assertString.default)(str);
  return str.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#x5C;/g, '\\').replace(/&#96;/g, '`').replace(/&amp;/g, '&'); // &amp; replacement has to be the last one to prevent
  // bugs with intermediate strings containing escape sequences
  // See: https://github.com/validatorjs/validator.js/issues/1827
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],139:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iso7064Check = iso7064Check;
exports.luhnCheck = luhnCheck;
exports.reverseMultiplyAndSum = reverseMultiplyAndSum;
exports.verhoeffCheck = verhoeffCheck;

/**
 * Algorithmic validation functions
 * May be used as is or implemented in the workflow of other validators.
 */

/*
 * ISO 7064 validation function
 * Called with a string of numbers (incl. check digit)
 * to validate according to ISO 7064 (MOD 11, 10).
 */
function iso7064Check(str) {
  var checkvalue = 10;

  for (var i = 0; i < str.length - 1; i++) {
    checkvalue = (parseInt(str[i], 10) + checkvalue) % 10 === 0 ? 10 * 2 % 11 : (parseInt(str[i], 10) + checkvalue) % 10 * 2 % 11;
  }

  checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;
  return checkvalue === parseInt(str[10], 10);
}
/*
 * Luhn (mod 10) validation function
 * Called with a string of numbers (incl. check digit)
 * to validate according to the Luhn algorithm.
 */


function luhnCheck(str) {
  var checksum = 0;
  var second = false;

  for (var i = str.length - 1; i >= 0; i--) {
    if (second) {
      var product = parseInt(str[i], 10) * 2;

      if (product > 9) {
        // sum digits of product and add to checksum
        checksum += product.toString().split('').map(function (a) {
          return parseInt(a, 10);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      } else {
        checksum += product;
      }
    } else {
      checksum += parseInt(str[i], 10);
    }

    second = !second;
  }

  return checksum % 10 === 0;
}
/*
 * Reverse TIN multiplication and summation helper function
 * Called with an array of single-digit integers and a base multiplier
 * to calculate the sum of the digits multiplied in reverse.
 * Normally used in variations of MOD 11 algorithmic checks.
 */


function reverseMultiplyAndSum(digits, base) {
  var total = 0;

  for (var i = 0; i < digits.length; i++) {
    total += digits[i] * (base - i);
  }

  return total;
}
/*
 * Verhoeff validation helper function
 * Called with a string of numbers
 * to validate according to the Verhoeff algorithm.
 */


function verhoeffCheck(str) {
  var d_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
  var p_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]]; // Copy (to prevent replacement) and reverse

  var str_copy = str.split('').reverse().join('');
  var checksum = 0;

  for (var i = 0; i < str_copy.length; i++) {
    checksum = d_table[checksum][p_table[i % 8][parseInt(str_copy[i], 10)]];
  }

  return checksum === 0;
}
},{}],140:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    var invalidType = _typeof(input);

    if (input === null) invalidType = 'null';else if (invalidType === 'object') invalidType = input.constructor.name;
    throw new TypeError("Expected a string but received a ".concat(invalidType));
  }
}

module.exports = exports.default;
module.exports.default = exports.default;
},{}],141:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var includes = function includes(arr, val) {
  return arr.some(function (arrVal) {
    return val === arrVal;
  });
};

var _default = includes;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
},{}],142:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;

function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments.length > 1 ? arguments[1] : undefined;

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }

  return obj;
}

module.exports = exports.default;
module.exports.default = exports.default;
},{}],143:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multilineRegexp;

/**
 * Build RegExp object from an array
 * of multiple/multi-line regexp parts
 *
 * @param {string[]} parts
 * @param {string} flags
 * @return {object} - RegExp object
 */
function multilineRegexp(parts, flags) {
  var regexpAsStringLiteral = parts.join('');
  return new RegExp(regexpAsStringLiteral, flags);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{}],144:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toString;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function toString(input) {
  if (_typeof(input) === 'object' && input !== null) {
    if (typeof input.toString === 'function') {
      input = input.toString();
    } else {
      input = '[object Object]';
    }
  } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
    input = '';
  }

  return String(input);
}

module.exports = exports.default;
module.exports.default = exports.default;
},{}],145:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = whitelist;

var _assertString = _interopRequireDefault(require("./util/assertString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function whitelist(str, chars) {
  (0, _assertString.default)(str);
  return str.replace(new RegExp("[^".concat(chars, "]+"), 'g'), '');
}

module.exports = exports.default;
module.exports.default = exports.default;
},{"./util/assertString":140}],146:[function(require,module,exports){
module.exports={
  "name": "doipjs",
  "version": "0.16.2",
  "description": "Decentralized OpenPGP Identity Proofs library in Node.js",
  "main": "./src/index.js",
  "dependencies": {
    "@openpgp/hkp-client": "^0.0.2",
    "@openpgp/wkd-client": "^0.0.3",
    "@xmpp/client": "^0.13.1",
    "@xmpp/debug": "^0.13.0",
    "axios": "^0.25.0",
    "browser-or-node": "^1.3.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-validator": "^6.10.0",
    "hash-wasm": "^4.9.0",
    "irc-upd": "^0.11.0",
    "jsdom": "^20.0.0",
    "merge-options": "^3.0.3",
    "openpgp": "^5.0",
    "query-string": "^6.14.1",
    "valid-url": "^1.0.9",
    "validator": "^13.5.2"
  },
  "devDependencies": {
    "browserify": "^17.0.0",
    "browserify-shim": "^3.8.14",
    "chai": "^4.2.0",
    "chai-as-promised": "^7.1.1",
    "chai-match-pattern": "^1.2.0",
    "clean-jsdoc-theme": "^3.2.4",
    "husky": "^7.0.0",
    "jsdoc": "^3.6.6",
    "license-check-and-add": "^4.0.3",
    "lint-staged": "^11.0.0",
    "minify": "^9.1",
    "mocha": "^9.2.0",
    "nodemon": "^2.0.19",
    "standard": "^16.0.3"
  },
  "scripts": {
    "release": "yarn run test && yarn run release:bundle && yarn run release:minify",
    "release:bundle": "./node_modules/.bin/browserify ./src/index.js --standalone doip -x openpgp -x jsdom -x @xmpp/client -x @xmpp/debug -x irc-upd -o ./dist/doip.js",
    "release:minify": "./node_modules/.bin/minify ./dist/doip.js > ./dist/doip.min.js",
    "license:check": "./node_modules/.bin/license-check-and-add check",
    "license:add": "./node_modules/.bin/license-check-and-add add",
    "license:remove": "./node_modules/.bin/license-check-and-add remove",
    "docs:lib": "./node_modules/.bin/jsdoc -c jsdoc-lib.json -r -d ./docs -P package.json",
    "standard:check": "./node_modules/.bin/standard ./src",
    "standard:fix": "./node_modules/.bin/standard --fix ./src",
    "mocha": "./node_modules/.bin/mocha",
    "test": "yarn run standard:check && yarn run license:check && yarn run mocha",
    "proxy": "NODE_ENV=production node ./src/proxy/",
    "proxy:dev": "NODE_ENV=development ./node_modules/.bin/nodemon ./src/proxy/",
    "prepare": "husky install"
  },
  "repository": {
    "type": "git",
    "url": "https://codeberg.org/keyoxide/doipjs"
  },
  "homepage": "https://js.doip.rocks",
  "keywords": [
    "pgp",
    "gpg",
    "openpgp",
    "encryption",
    "decentralized",
    "identity"
  ],
  "author": "Yarmo Mackenbach <yarmo@yarmo.eu> (https://yarmo.eu)",
  "license": "Apache-2.0",
  "browserify": {
    "transform": [
      "browserify-shim"
    ]
  },
  "browserify-shim": {
    "openpgp": "global:openpgp"
  }
}

},{}],147:[function(require,module,exports){
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
const validator = require('validator')
const validUrl = require('valid-url')
const mergeOptions = require('merge-options')
const proofs = require('./proofs')
const verifications = require('./verifications')
const claimDefinitions = require('./claimDefinitions')
const defaults = require('./defaults')
const E = require('./enums')

/**
 * @class
 * @classdesc OpenPGP-based identity claim
 * @property {string} uri             - The claim's URI
 * @property {string} fingerprint     - The fingerprint to verify the claim against
 * @property {string} status          - The current status of the claim
 * @property {Array<object>} matches  - The claim definitions matched against the URI
 * @property {object} verification    - The result of the verification process
 */
class Claim {
  /**
   * Initialize a Claim object
   * @constructor
   * @param {string|object} [uri]   - The URI of the identity claim or a JSONified Claim instance
   * @param {string} [fingerprint]  - The fingerprint of the OpenPGP key
   * @example
   * const claim = doip.Claim();
   * const claim = doip.Claim('dns:domain.tld?type=TXT');
   * const claim = doip.Claim('dns:domain.tld?type=TXT', '123abc123abc');
   * const claimAlt = doip.Claim(JSON.stringify(claim));
   */
  constructor (uri, fingerprint) {
    // Import JSON
    if (typeof uri === 'object' && 'claimVersion' in uri) {
      const data = uri
      switch (data.claimVersion) {
        case 1:
          this._uri = data.uri
          this._fingerprint = data.fingerprint
          this._status = data.status
          this._matches = data.matches
          this._verification = data.verification
          break

        default:
          throw new Error('Invalid claim version')
      }
      return
    }

    // Verify validity of URI
    if (uri && !validUrl.isUri(uri)) {
      throw new Error('Invalid URI')
    }

    // Verify validity of fingerprint
    if (fingerprint) {
      try {
        validator.isAlphanumeric(fingerprint)
      } catch (err) {
        throw new Error('Invalid fingerprint')
      }
    }

    this._uri = uri || null
    this._fingerprint = fingerprint || null
    this._status = E.ClaimStatus.INIT
    this._matches = null
    this._verification = null
  }

  get uri () {
    return this._uri
  }

  get fingerprint () {
    return this._fingerprint
  }

  get status () {
    return this._status
  }

  get matches () {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    return this._matches
  }

  get verification () {
    if (this._status !== E.ClaimStatus.VERIFIED) {
      throw new Error('This claim has not yet been verified')
    }
    return this._verification
  }

  set uri (uri) {
    if (this._status !== E.ClaimStatus.INIT) {
      throw new Error(
        'Cannot change the URI, this claim has already been matched'
      )
    }
    // Verify validity of URI
    if (uri && !validUrl.isUri(uri)) {
      throw new Error('The URI was invalid')
    }
    // Remove leading and trailing spaces
    uri = uri.replace(/^\s+|\s+$/g, '')

    this._uri = uri
  }

  set fingerprint (fingerprint) {
    if (this._status === E.ClaimStatus.VERIFIED) {
      throw new Error(
        'Cannot change the fingerprint, this claim has already been verified'
      )
    }
    this._fingerprint = fingerprint
  }

  set status (anything) {
    throw new Error("Cannot change a claim's status")
  }

  set matches (anything) {
    throw new Error("Cannot change a claim's matches")
  }

  set verification (anything) {
    throw new Error("Cannot change a claim's verification result")
  }

  /**
   * Match the claim's URI to candidate definitions
   * @function
   */
  match () {
    if (this._status !== E.ClaimStatus.INIT) {
      throw new Error('This claim was already matched')
    }
    if (this._uri === null) {
      throw new Error('This claim has no URI')
    }

    this._matches = []

    claimDefinitions.list.every((name, i) => {
      const def = claimDefinitions.data[name]

      // If the candidate is invalid, continue matching
      if (!def.reURI.test(this._uri)) {
        return true
      }

      const candidate = def.processURI(this._uri)
      if (candidate.match.isAmbiguous) {
        // Add to the possible candidates
        this._matches.push(candidate)
      } else {
        // Set a single candidate and stop
        this._matches = [candidate]
        return false
      }

      // Continue matching
      return true
    })

    this._status = E.ClaimStatus.MATCHED
  }

  /**
   * Verify the claim. The proof for each candidate is sequentially fetched and
   * checked for the fingerprint. The verification stops when either a positive
   * result was obtained, or an unambiguous claim definition was processed
   * regardless of the result.
   * @async
   * @function
   * @param {object} [opts] - Options for proxy, fetchers
   */
  async verify (opts) {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('This claim has not yet been matched')
    }
    if (this._status === E.ClaimStatus.VERIFIED) {
      throw new Error('This claim has already been verified')
    }
    if (this._fingerprint === null) {
      throw new Error('This claim has no fingerprint')
    }

    // Handle options
    opts = mergeOptions(defaults.opts, opts || {})

    // If there are no matches
    if (this._matches.length === 0) {
      this._verification = {
        result: false,
        completed: true,
        proof: {},
        errors: ['No matches for claim']
      }
    }

    // For each match
    for (let index = 0; index < this._matches.length; index++) {
      const claimData = this._matches[index]

      let verificationResult = null
      let proofData = null
      let proofFetchError

      try {
        proofData = await proofs.fetch(claimData, opts)
      } catch (err) {
        proofFetchError = err
      }

      if (proofData) {
        // Run the verification process
        verificationResult = await verifications.run(
          proofData.result,
          claimData,
          this._fingerprint
        )
        verificationResult.proof = {
          fetcher: proofData.fetcher,
          viaProxy: proofData.viaProxy
        }
      } else {
        // Consider the proof completed but with a negative result
        verificationResult = verificationResult || {
          result: false,
          completed: true,
          proof: {},
          errors: [proofFetchError]
        }

        if (this.isAmbiguous()) {
          // Assume a wrong match and continue
          continue
        }
      }

      if (verificationResult.completed) {
        // Store the result, keep a single match and stop verifying
        this._verification = verificationResult
        this._matches = [claimData]
        index = this._matches.length
      }
    }

    // Fail safe verification result
    this._verification = this._verification
      ? this._verification
      : {
          result: false,
          completed: true,
          proof: {},
          errors: ['Unknown error']
        }

    this._status = E.ClaimStatus.VERIFIED
  }

  /**
   * Determine the ambiguity of the claim. A claim is only unambiguous if any
   * of the candidates is unambiguous. An ambiguous claim should never be
   * displayed in an user interface when its result is negative.
   * @function
   * @returns {boolean}
   */
  isAmbiguous () {
    if (this._status === E.ClaimStatus.INIT) {
      throw new Error('The claim has not been matched yet')
    }
    if (this._matches.length === 0) {
      throw new Error('The claim has no matches')
    }
    return this._matches.length > 1 || this._matches[0].match.isAmbiguous
  }

  /**
   * Get a JSON representation of the Claim object. Useful when transferring
   * data between instances/machines.
   * @function
   * @returns {object}
   */
  toJSON () {
    return {
      claimVersion: 1,
      uri: this._uri,
      fingerprint: this._fingerprint,
      status: this._status,
      matches: this._matches,
      verification: this._verification
    }
  }
}

module.exports = Claim

},{"./claimDefinitions":155,"./defaults":169,"./enums":170,"./proofs":181,"./verifications":184,"merge-options":39,"valid-url":44,"validator":45}],148:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/dev\.to\/(.*)\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'devto'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://dev.to/${match[1]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://dev.to/api/articles/${match[1]}/${match[2]}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['body_markdown']
    }
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

},{"../enums":170}],149:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)\/u\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'discourse'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://${match[1]}/u/${match[2]}.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['user', 'bio_raw']
    }
  }
}

const tests = [
  {
    uri: 'https://domain.org/u/alice',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/u/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],150:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^dns:([a-zA-Z0-9.\-_]*)(?:\?(.*))?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'dns'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`,
      qr: null
    },
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.DNS,
        access: E.ProofAccess.SERVER,
        format: E.ProofFormat.JSON,
        data: {
          domain: match[1]
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['records', 'txt']
    }
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

},{"../enums":170}],151:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)\/(.*)\/gitea_proof\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitea'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://${match[1]}/api/v1/repos/${match[2]}/gitea_proof`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.EQUALS,
      path: ['description']
    }
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

},{"../enums":170}],152:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/gist\.github\.com\/(.*)\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'github'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://github.com/${match[1]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://api.github.com/gists/${match[2]}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['files', 'openpgp.md', 'content']
    }
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

},{"../enums":170}],153:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)\/(.*)\/gitlab_proof\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitlab'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://${match[1]}/api/v4/projects/${match[2]}%2Fgitlab_proof`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.EQUALS,
      path: ['description']
    }
  }
}

const tests = [
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof',
    shouldMatch: true
  },
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof/',
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

},{"../enums":170}],154:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/news\.ycombinator\.com\/user\?id=(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'hackernews'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['about']
    }
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

},{"../enums":170}],155:[function(require,module,exports){
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
const list = [
  'dns',
  'irc',
  'xmpp',
  'matrix',
  'telegram',
  'twitter',
  'reddit',
  'liberapay',
  'lichess',
  'hackernews',
  'lobsters',
  'devto',
  'gitea',
  'gitlab',
  'github',
  'mastodon',
  'pleroma',
  'discourse',
  'owncast',
  'stackexchange'
]

const data = {
  dns: require('./dns'),
  irc: require('./irc'),
  xmpp: require('./xmpp'),
  matrix: require('./matrix'),
  telegram: require('./telegram'),
  twitter: require('./twitter'),
  reddit: require('./reddit'),
  liberapay: require('./liberapay'),
  lichess: require('./lichess'),
  hackernews: require('./hackernews'),
  lobsters: require('./lobsters'),
  devto: require('./devto'),
  gitea: require('./gitea'),
  gitlab: require('./gitlab'),
  github: require('./github'),
  mastodon: require('./mastodon'),
  pleroma: require('./pleroma'),
  discourse: require('./discourse'),
  owncast: require('./owncast'),
  stackexchange: require('./stackexchange')
}

exports.list = list
exports.data = data

},{"./devto":148,"./discourse":149,"./dns":150,"./gitea":151,"./github":152,"./gitlab":153,"./hackernews":154,"./irc":156,"./liberapay":157,"./lichess":158,"./lobsters":159,"./mastodon":160,"./matrix":161,"./owncast":162,"./pleroma":163,"./reddit":164,"./stackexchange":165,"./telegram":166,"./twitter":167,"./xmpp":168}],156:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^irc:\/\/(.*)\/([a-zA-Z0-9\-[\]\\`_^{|}]*)/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'irc'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `irc://${match[1]}/${match[2]}`,
      uri: uri,
      qr: null
    },
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.IRC,
        access: E.ProofAccess.SERVER,
        format: E.ProofFormat.JSON,
        data: {
          domain: match[1],
          nick: match[2]
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: []
    }
  }
}

const tests = [
  {
    uri: 'irc://chat.ircserver.org/Alice1',
    shouldMatch: true
  },
  {
    uri: 'irc://chat.ircserver.org/alice?param=123',
    shouldMatch: true
  },
  {
    uri: 'irc://chat.ircserver.org/alice_bob',
    shouldMatch: true
  },
  {
    uri: 'https://chat.ircserver.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],157:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/liberapay\.com\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'liberapay'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://liberapay.com/${match[1]}/public.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['statements', 'content']
    }
  }
}

const tests = [
  {
    uri: 'https://liberapay.com/alice',
    shouldMatch: true
  },
  {
    uri: 'https://liberapay.com/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],158:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/lichess\.org\/@\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'lichess'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: `https://lichess.org/api/user/${match[1]}`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://lichess.org/api/user/${match[1]}`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.CONTAINS,
      path: ['profile', 'links']
    }
  }
}

const tests = [
  {
    uri: 'https://lichess.org/@/Alice',
    shouldMatch: true
  },
  {
    uri: 'https://lichess.org/@/Alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/@/Alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],159:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/lobste\.rs\/u\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'lobsters'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: `https://lobste.rs/u/${match[1]}.json`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://lobste.rs/u/${match[1]}.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['about']
    }
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

},{"../enums":170}],160:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)\/@(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'mastodon'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `@${match[2]}@${match[1]}`,
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: uri,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.CONTAINS,
      path: ['attachment', 'value']
    }
  }
}

const tests = [
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/@alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],161:[function(require,module,exports){
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
const E = require('../enums')
const queryString = require('query-string')

const reURI = /^matrix:u\/(?:@)?([^@:]*:[^?]*)(\?.*)?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  if (!match[2]) {
    return null
  }

  const params = queryString.parse(match[2])

  if (!('org.keyoxide.e' in params && 'org.keyoxide.r' in params)) {
    return null
  }

  const profileUrl = `https://matrix.to/#/@${match[1]}`
  const eventUrl = `https://matrix.to/#/${params['org.keyoxide.r']}/${params['org.keyoxide.e']}`

  return {
    serviceprovider: {
      type: 'communication',
      name: 'matrix'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `@${match[1]}`,
      uri: profileUrl,
      qr: null
    },
    proof: {
      uri: eventUrl,
      request: {
        fetcher: E.Fetcher.MATRIX,
        access: E.ProofAccess.GRANTED,
        format: E.ProofFormat.JSON,
        data: {
          eventId: params['org.keyoxide.e'],
          roomId: params['org.keyoxide.r']
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['content', 'body']
    }
  }
}

const tests = [
  {
    uri:
      'matrix:u/alice:matrix.domain.org?org.keyoxide.r=!123:domain.org&org.keyoxide.e=$123',
    shouldMatch: true
  },
  {
    uri: 'matrix:u/alice:matrix.domain.org',
    shouldMatch: true
  },
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: false
  },
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170,"query-string":41}],162:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'owncast'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null
    },
    proof: {
      uri: `${uri}/api/config`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `${uri}/api/config`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.CONTAINS,
      path: ['socialHandles', 'url']
    }
  }
}

const tests = [
  {
    uri: 'https://live.domain.org',
    shouldMatch: true
  },
  {
    uri: 'https://live.domain.org/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/live/',
    shouldMatch: true
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],163:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(.*)\/users\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'pleroma'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: true
    },
    profile: {
      display: `@${match[2]}@${match[1]}`,
      uri: uri,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: uri,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.FINGERPRINT,
      relation: E.ClaimRelation.CONTAINS,
      path: ['summary']
    }
  }
}

const tests = [
  {
    uri: 'https://domain.org/users/alice',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/users/alice/',
    shouldMatch: true
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],164:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/(?:www\.)?reddit\.com\/user\/(.*)\/comments\/(.*)\/(.*)\/?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'reddit'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: match[1],
      uri: `https://www.reddit.com/user/${match[1]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.NOCORS,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://www.reddit.com/user/${match[1]}/comments/${match[2]}.json`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['data', 'children', 'data', 'selftext']
    }
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

},{"../enums":170}],165:[function(require,module,exports){
/*
Copyright 2022 Yarmo Mackenbach

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
const E = require('../enums')

const reURI = /^https:\/\/(.*(?:askubuntu|mathoverflow|serverfault|stackapps|stackoverflow)|.+\.stackexchange)\.com\/users\/(\d+)/
const reStackExchange = /\.stackexchange$/

const processURI = (uri) => {
  const [, domain, id] = uri.match(reURI)
  const site = domain.replace(reStackExchange, '')

  return {
    serviceprovider: {
      type: 'web',
      name: 'stackexchange'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `${id}@${site}`,
      uri: uri,
      qr: null
    },
    proof: {
      uri: `https://${domain}.com/users/${id}?tab=profile`,
      request: {
        fetcher: E.Fetcher.HTTP,
        access: E.ProofAccess.GENERIC,
        format: E.ProofFormat.JSON,
        data: {
          url: `https://api.stackexchange.com/2.3/users/${id}?site=${site}&filter=!AH)b5JqVyImf`,
          format: E.ProofFormat.JSON
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: ['items', 'about_me']
    }
  }
}

const tests = [
  {
    uri: 'https://stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234/alice',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234?tab=topactivity',
    shouldMatch: true
  },
  {
    uri: 'https://stackoverflow.com/users/1234/alice?tab=profile',
    shouldMatch: true
  },
  {
    uri: 'https://meta.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://pt.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://pt.meta.stackoverflow.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://serverfault.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://meta.stackexchange.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://gaming.meta.stackexchange.com/users/1234',
    shouldMatch: true
  },
  {
    uri: 'https://stackexchange.com/users/1234',
    shouldMatch: false
  },
  {
    uri: 'https://domain.com/users/1234',
    shouldMatch: false
  },
  {
    uri: 'https://meta.domain.com/users/1234',
    shouldMatch: false
  }

]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],166:[function(require,module,exports){
/*
Copyright 2022 Maximilian Siling

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
const E = require('../enums')

const reURI = /https:\/\/t.me\/([A-Za-z0-9_]{5,32})\?proof=([A-Za-z0-9_]{5,32})/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'telegram'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://t.me/${match[1]}`,
      qr: `https://t.me/${match[1]}`
    },
    proof: {
      uri: `https://t.me/${match[2]}`,
      request: {
        fetcher: E.Fetcher.TELEGRAM,
        access: E.ProofAccess.GRANTED,
        format: E.ProofFormat.JSON,
        data: {
          user: match[1],
          chat: match[2]
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.EQUALS,
      path: ['text']
    }
  }
}

const tests = [
  {
    uri: 'https://t.me/alice?proof=foobar',
    shouldMatch: true
  },
  {
    uri: 'https://t.me/complex_user_1234?proof=complex_chat_1234',
    shouldMatch: true
  },
  {
    uri: 'https://t.me/foobar',
    shouldMatch: false
  },
  {
    uri: 'https://t.me/foobar?proof=',
    shouldMatch: false
  },
  {
    uri: 'https://t.me/?proof=foobar',
    shouldMatch: false
  }
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../enums":170}],167:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`,
      qr: null
    },
    proof: {
      uri: uri,
      request: {
        fetcher: E.Fetcher.TWITTER,
        access: E.ProofAccess.GRANTED,
        format: E.ProofFormat.TEXT,
        data: {
          tweetId: match[2]
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: []
    }
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

},{"../enums":170}],168:[function(require,module,exports){
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
const E = require('../enums')

const reURI = /^xmpp:([a-zA-Z0-9.\-_]*)@([a-zA-Z0-9.\-_]*)(?:\?(.*))?/

const processURI = (uri) => {
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'xmpp'
    },
    match: {
      regularExpression: reURI,
      isAmbiguous: false
    },
    profile: {
      display: `${match[1]}@${match[2]}`,
      uri: uri,
      qr: uri
    },
    proof: {
      uri: null,
      request: {
        fetcher: E.Fetcher.XMPP,
        access: E.ProofAccess.SERVER,
        format: E.ProofFormat.TEXT,
        data: {
          id: `${match[1]}@${match[2]}`,
          field: 'note'
        }
      }
    },
    claim: {
      format: E.ClaimFormat.URI,
      relation: E.ClaimRelation.CONTAINS,
      path: []
    }
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

},{"../enums":170}],169:[function(require,module,exports){
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
const E = require('./enums')

/**
 * Contains default values
 * @module defaults
 */

/**
 * The default options used throughout the library
 * @constant {object}
 * @property {object} proxy                           - Options related to the proxy
 * @property {string|null} proxy.hostname             - The hostname of the proxy
 * @property {string} proxy.policy                    - The policy that defines when to use a proxy ({@link module:enums~ProxyPolicy|here})
 * @property {object} claims                          - Options related to claim verification
 * @property {object} claims.irc                      - Options related to the verification of IRC claims
 * @property {string|null} claims.irc.nick            - The nick that the library uses to connect to the IRC server
 * @property {object} claims.matrix                   - Options related to the verification of Matrix claims
 * @property {string|null} claims.matrix.instance     - The server hostname on which the library can log in
 * @property {string|null} claims.matrix.accessToken  - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
 * @property {object} claims.xmpp                     - Options related to the verification of XMPP claims
 * @property {string|null} claims.xmpp.service        - The server hostname on which the library can log in
 * @property {string|null} claims.xmpp.username       - The username used to log in
 * @property {string|null} claims.xmpp.password       - The password used to log in
 * @property {object} claims.twitter                  - Options related to the verification of Twitter claims
 * @property {string|null} claims.twitter.bearerToken - The Twitter API's bearer token ({@link https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens|Twitter docs})
 */
const opts = {
  proxy: {
    hostname: null,
    policy: E.ProxyPolicy.NEVER
  },
  claims: {
    irc: {
      nick: null
    },
    matrix: {
      instance: null,
      accessToken: null
    },
    xmpp: {
      service: null,
      username: null,
      password: null
    },
    twitter: {
      bearerToken: null
    }
  }
}

exports.opts = opts

},{"./enums":170}],170:[function(require,module,exports){
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
/**
 * Contains enums
 * @module enums
 */

/**
 * The proxy policy that decides how to fetch a proof
 * @readonly
 * @enum {string}
 */
const ProxyPolicy = {
  /** Proxy usage decision depends on environment and service provider */
  ADAPTIVE: 'adaptive',
  /** Always use a proxy */
  ALWAYS: 'always',
  /** Never use a proxy, skip a verification if a proxy is inevitable */
  NEVER: 'never'
}
Object.freeze(ProxyPolicy)

/**
 * Methods for fetching proofs
 * @readonly
 * @enum {string}
 */
const Fetcher = {
  /** Basic HTTP requests */
  HTTP: 'http',
  /** DNS module from Node.js */
  DNS: 'dns',
  /** IRC module from Node.js */
  IRC: 'irc',
  /** XMPP module from Node.js */
  XMPP: 'xmpp',
  /** HTTP request to Matrix API */
  MATRIX: 'matrix',
  /** HTTP request to Telegram API */
  TELEGRAM: 'telegram',
  /** HTTP request to Twitter API */
  TWITTER: 'twitter'
}
Object.freeze(Fetcher)

/**
 * Levels of access restriction for proof fetching
 * @readonly
 * @enum {number}
 */
const ProofAccess = {
  /** Any HTTP request will work */
  GENERIC: 0,
  /** CORS requests are denied */
  NOCORS: 1,
  /** HTTP requests must contain API or access tokens */
  GRANTED: 2,
  /** Not accessible by HTTP request, needs server software */
  SERVER: 3
}
Object.freeze(ProofAccess)

/**
 * Format of proof
 * @readonly
 * @enum {string}
 */
const ProofFormat = {
  /** JSON format */
  JSON: 'json',
  /** Plaintext format */
  TEXT: 'text'
}
Object.freeze(ProofFormat)

/**
 * Format of claim
 * @readonly
 * @enum {number}
 */
const ClaimFormat = {
  /** `openpgp4fpr:123123123` */
  URI: 0,
  /** `123123123` */
  FINGERPRINT: 1
}
Object.freeze(ClaimFormat)

/**
 * How to find the claim inside the proof's JSON data
 * @readonly
 * @enum {number}
 */
const ClaimRelation = {
  /** Claim is somewhere in the JSON field's textual content */
  CONTAINS: 0,
  /** Claim is equal to the JSON field's textual content */
  EQUALS: 1,
  /** Claim is equal to an element of the JSON field's array of strings */
  ONEOF: 2
}
Object.freeze(ClaimRelation)

/**
 * Status of the Claim instance
 * @readonly
 * @enum {string}
 */
const ClaimStatus = {
  /** Claim has been initialized */
  INIT: 'init',
  /** Claim has matched its URI to candidate claim definitions */
  MATCHED: 'matched',
  /** Claim has verified one or multiple candidate claim definitions */
  VERIFIED: 'verified'
}
Object.freeze(ClaimStatus)

exports.ProxyPolicy = ProxyPolicy
exports.Fetcher = Fetcher
exports.ProofAccess = ProofAccess
exports.ProofFormat = ProofFormat
exports.ClaimFormat = ClaimFormat
exports.ClaimRelation = ClaimRelation
exports.ClaimStatus = ClaimStatus

},{}],171:[function(require,module,exports){
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
const jsEnv = require('browser-or-node')

/**
 * @module fetcher/dns
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

if (jsEnv.isNode) {
  const dns = require('dns')

  /**
   * Execute a fetch request
   * @function
   * @async
   * @param {object} data         - Data used in the request
   * @param {string} data.domain  - The targeted domain
   * @returns {object}
   */
  module.exports.fn = async (data, opts) => {
    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      dns.resolveTxt(data.domain, (err, records) => {
        if (err) {
          reject(err)
          return
        }

        resolve({
          domain: data.domain,
          records: {
            txt: records
          }
        })
      })
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}

},{"browser-or-node":32,"dns":34}],172:[function(require,module,exports){
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
const axios = require('axios')
const E = require('../enums')

/**
 * @module fetcher/http
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data         - Data used in the request
 * @param {string} data.url     - The URL pointing at targeted content
 * @param {string} data.format  - The format of the targeted content
 * @returns {object|string}
 */
module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    if (!data.url) {
      reject(new Error('No valid URI provided'))
      return
    }

    switch (data.format) {
      case E.ProofFormat.JSON:
        axios.get(data.url, {
          headers: {
            Accept: 'application/json',
            'User-Agent': `doipjs/${require('../../package.json').version}`
          },
          validateStatus: function (status) {
            return status >= 200 && status < 400
          }
        })
          .then(res => {
            resolve(res.data)
          })
          .catch(e => {
            reject(e)
          })
        break
      case E.ProofFormat.TEXT:
        axios.get(data.url, {
          validateStatus: function (status) {
            return status >= 200 && status < 400
          },
          responseType: 'text'
        })
          .then(res => {
            resolve(res.data)
          })
          .catch(e => {
            reject(e)
          })
        break
      default:
        reject(new Error('No specified data format'))
        break
    }
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}

},{"../../package.json":146,"../enums":170,"axios":3}],173:[function(require,module,exports){
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

exports.dns = require('./dns')
exports.http = require('./http')
exports.irc = require('./irc')
exports.matrix = require('./matrix')
exports.telegram = require('./telegram')
exports.twitter = require('./twitter')
exports.xmpp = require('./xmpp')

},{"./dns":171,"./http":172,"./irc":174,"./matrix":175,"./telegram":176,"./twitter":177,"./xmpp":178}],174:[function(require,module,exports){
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
const jsEnv = require('browser-or-node')

/**
 * @module fetcher/irc
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 20000

if (jsEnv.isNode) {
  const irc = require('irc-upd')
  const validator = require('validator')

  /**
   * Execute a fetch request
   * @function
   * @async
   * @param {object} data                 - Data used in the request
   * @param {string} data.nick            - The nick of the targeted account
   * @param {string} data.domain          - The domain on which the targeted account is registered
   * @param {object} opts                 - Options used to enable the request
   * @param {string} opts.claims.irc.nick - The nick to be used by the library to log in
   * @returns {object}
   */
  module.exports.fn = async (data, opts) => {
    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      try {
        validator.isAscii(opts.claims.irc.nick)
      } catch (err) {
        throw new Error(`IRC fetcher was not set up properly (${err.message})`)
      }

      try {
        const client = new irc.Client(data.domain, opts.claims.irc.nick, {
          port: 6697,
          secure: true,
          channels: [],
          showErrors: false,
          debug: false
        })
        const reKey = /[a-zA-Z0-9\-_]+\s+:\s(openpgp4fpr:.*)/
        const reEnd = /End\sof\s.*\staxonomy./
        const keys = []

        client.addListener('registered', (message) => {
          client.send(`PRIVMSG NickServ TAXONOMY ${data.nick}`)
        })
        client.addListener('notice', (nick, to, text, message) => {
          if (reKey.test(text)) {
            const match = text.match(reKey)
            keys.push(match[1])
          }
          if (reEnd.test(text)) {
            client.disconnect()
            resolve(keys)
          }
        })
      } catch (error) {
        reject(error)
      }
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}

},{"browser-or-node":32,"irc-upd":"irc-upd","validator":45}],175:[function(require,module,exports){
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
const axios = require('axios')
const validator = require('validator')

/**
 * @module fetcher/matrix
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                           - Data used in the request
 * @param {string} data.eventId                   - The identifier of the targeted post
 * @param {string} data.roomId                    - The identifier of the room containing the targeted post
 * @param {object} opts                           - Options used to enable the request
 * @param {string} opts.claims.matrix.instance    - The server hostname on which the library can log in
 * @param {string} opts.claims.matrix.accessToken - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
 * @returns {object}
 */
module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    try {
      validator.isFQDN(opts.claims.matrix.instance)
      validator.isAscii(opts.claims.matrix.accessToken)
    } catch (err) {
      throw new Error(`Matrix fetcher was not set up properly (${err.message})`)
    }

    const url = `https://${opts.claims.matrix.instance}/_matrix/client/r0/rooms/${data.roomId}/event/${data.eventId}?access_token=${opts.claims.matrix.accessToken}`
    axios.get(url,
      {
        headers: { Accept: 'application/json' }
      })
      .then(res => {
        return res.data
      })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}

},{"axios":3,"validator":45}],176:[function(require,module,exports){
/*
Copyright 2022 Maximilian Siling

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
const axios = require('axios')
const validator = require('validator')

/**
 * @module fetcher/telegram
 */

/**
 * The single request's timeout value in milliseconds
 * This fetcher makes two requests in total
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                          - Data used in the request
 * @param {string} data.chat                     - Telegram public chat username
 * @param {string} data.user                     - Telegram user username
 * @param {object} opts                          - Options used to enable the request
 * @param {string} opts.claims.telegram.token    - The Telegram Bot API token
 * @returns {object|string}
 */
module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const apiPromise = (method) => new Promise((resolve, reject) => {
    try {
      validator.isAscii(opts.claims.telegram.token)
    } catch (err) {
      throw new Error(`Telegram fetcher was not set up properly (${err.message})`)
    }

    if (!data.chat || !data.user) {
      reject(new Error('Both chat name and user name must be provided'))
      return
    }

    const url = `https://api.telegram.org/bot${opts.claims.telegram.token}/${method}?chat_id=@${data.chat}`
    axios.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': `doipjs/${require('../../package.json').version}`
      },
      validateStatus: (status) => status === 200
    })
      .then(res => resolve(res.data))
      .catch(e => reject(e))
  })

  const fetchPromise = apiPromise('getChatAdministrators').then(admins => {
    if (!admins.ok) {
      throw new Error('Request to get chat administrators failed')
    }

    return apiPromise('getChat').then(chat => {
      if (!chat.ok) {
        throw new Error('Request to get chat info failed')
      }

      let creator
      for (const admin of admins.result) {
        if (admin.status === 'creator') {
          creator = admin.user.username
        }
      }

      if (!chat.result.description) {
        throw new Error('There is no chat description')
      }

      if (creator !== data.user) {
        throw new Error('User doesn\'t match')
      }

      return {
        user: creator,
        text: chat.result.description
      }
    })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}

},{"../../package.json":146,"axios":3,"validator":45}],177:[function(require,module,exports){
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
const axios = require('axios')
const validator = require('validator')

/**
 * @module fetcher/twitter
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

/**
 * Execute a fetch request
 * @function
 * @async
 * @param {object} data                             - Data used in the request
 * @param {number|string} data.tweetId              - Identifier of the tweet
 * @param {object} opts                             - Options used to enable the request
 * @param {string} opts.claims.twitter.bearerToken  - The Twitter API's bearer token
 * @returns {object}
 */
module.exports.fn = async (data, opts) => {
  let timeoutHandle
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Request was timed out')),
      data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
    )
  })

  const fetchPromise = new Promise((resolve, reject) => {
    try {
      validator.isAscii(opts.claims.twitter.bearerToken)
    } catch (err) {
      throw new Error(
        `Twitter fetcher was not set up properly (${err.message})`
      )
    }

    axios.get(
      `https://api.twitter.com/1.1/statuses/show.json?id=${data.tweetId}&tweet_mode=extended`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${opts.claims.twitter.bearerToken}`
        }
      }
    )
      .then(data => {
        return data.data
      })
      .then((data) => {
        resolve(data.full_text)
      })
      .catch((error) => {
        reject(error)
      })
  })

  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle)
    return result
  })
}

},{"axios":3,"validator":45}],178:[function(require,module,exports){
(function (process){(function (){
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
const jsEnv = require('browser-or-node')

/**
 * @module fetcher/xmpp
 */

/**
 * The request's timeout value in milliseconds
 * @constant {number} timeout
 */
module.exports.timeout = 5000

if (jsEnv.isNode) {
  const jsdom = require('jsdom')
  const { client, xml } = require('@xmpp/client')
  const debug = require('@xmpp/debug')
  const validator = require('validator')

  let xmpp = null
  let iqCaller = null

  const xmppStart = async (service, username, password) => {
    return new Promise((resolve, reject) => {
      const xmpp = client({
        service: service,
        username: username,
        password: password
      })
      if (process.env.NODE_ENV !== 'production') {
        debug(xmpp, true)
      }
      const { iqCaller } = xmpp
      xmpp.start()
      xmpp.on('online', (address) => {
        resolve({ xmpp: xmpp, iqCaller: iqCaller })
      })
      xmpp.on('error', (error) => {
        reject(error)
      })
    })
  }

  /**
   * Execute a fetch request
   * @function
   * @async
   * @param {object} data                       - Data used in the request
   * @param {string} data.id                    - The identifier of the targeted account
   * @param {string} data.field                 - The vCard field to return (should be "note")
   * @param {object} opts                       - Options used to enable the request
   * @param {string} opts.claims.xmpp.service   - The server hostname on which the library can log in
   * @param {string} opts.claims.xmpp.username  - The username used to log in
   * @param {string} opts.claims.xmpp.password  - The password used to log in
   * @returns {object}
   */
  module.exports.fn = async (data, opts) => {
    try {
      validator.isFQDN(opts.claims.xmpp.service)
      validator.isAscii(opts.claims.xmpp.username)
      validator.isAscii(opts.claims.xmpp.password)
    } catch (err) {
      throw new Error(`XMPP fetcher was not set up properly (${err.message})`)
    }

    if (!xmpp || xmpp.status !== 'online') {
      const xmppStartRes = await xmppStart(
        opts.claims.xmpp.service,
        opts.claims.xmpp.username,
        opts.claims.xmpp.password
      )
      xmpp = xmppStartRes.xmpp
      iqCaller = xmppStartRes.iqCaller
    }

    const response = await iqCaller.request(
      xml('iq', { type: 'get', to: data.id }, xml('vCard', 'vcard-temp')),
      30 * 1000
    )

    const vcardRow = response.getChild('vCard', 'vcard-temp').toString()
    const dom = new jsdom.JSDOM(vcardRow)

    let timeoutHandle
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Request was timed out')),
        data.fetcherTimeout ? data.fetcherTimeout : module.exports.timeout
      )
    })

    const fetchPromise = new Promise((resolve, reject) => {
      try {
        let vcard

        switch (data.field.toLowerCase()) {
          case 'desc':
          case 'note':
            vcard = dom.window.document.querySelector('note text')
            if (!vcard) {
              vcard = dom.window.document.querySelector('note')
            }
            if (!vcard) {
              vcard = dom.window.document.querySelector('DESC')
            }
            if (vcard) {
              vcard = vcard.textContent
            } else {
              throw new Error('No DESC or NOTE field found in vCard')
            }
            break

          default:
            vcard = dom.window.document.querySelector(data).textContent
            break
        }
        xmpp.stop()
        resolve(vcard)
      } catch (error) {
        reject(error)
      }
    })

    return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle)
      return result
    })
  }
} else {
  module.exports.fn = null
}

}).call(this)}).call(this,require('_process'))
},{"@xmpp/client":"@xmpp/client","@xmpp/debug":"@xmpp/debug","_process":40,"browser-or-node":32,"jsdom":"jsdom","validator":45}],179:[function(require,module,exports){
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
const Claim = require('./claim')
const claimDefinitions = require('./claimDefinitions')
const proofs = require('./proofs')
const keys = require('./keys')
const signatures = require('./signatures')
const enums = require('./enums')
const defaults = require('./defaults')
const utils = require('./utils')
const verifications = require('./verifications')

exports.Claim = Claim
exports.claimDefinitions = claimDefinitions
exports.proofs = proofs
exports.keys = keys
exports.signatures = signatures
exports.enums = enums
exports.defaults = defaults
exports.utils = utils
exports.verifications = verifications

},{"./claim":147,"./claimDefinitions":155,"./defaults":169,"./enums":170,"./keys":180,"./proofs":181,"./signatures":182,"./utils":183,"./verifications":184}],180:[function(require,module,exports){
(function (global){(function (){
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
const axios = require('axios')
const validUrl = require('valid-url')
const openpgp = (typeof window !== "undefined" ? window['openpgp'] : typeof global !== "undefined" ? global['openpgp'] : null)
const HKP = require('@openpgp/hkp-client')
const WKD = require('@openpgp/wkd-client')
const Claim = require('./claim')

/**
 * Functions related to the fetching and handling of keys
 * @module keys
 */

/**
 * Fetch a public key using keyservers
 * @function
 * @param {string} identifier                         - Fingerprint or email address
 * @param {string} [keyserverDomain=keys.openpgp.org] - Domain of the keyserver
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetchHKP('alice@domain.tld');
 * const key2 = doip.keys.fetchHKP('123abc123abc');
 */
const fetchHKP = async (identifier, keyserverDomain) => {
  const keyserverBaseUrl = keyserverDomain
    ? `https://${keyserverDomain}`
    : 'https://keys.openpgp.org'

  const hkp = new HKP(keyserverBaseUrl)
  const lookupOpts = {
    query: identifier
  }

  const publicKey = await hkp
    .lookup(lookupOpts)
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })

  if (!publicKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return await openpgp.readKey({
    armoredKey: publicKey
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })
}

/**
 * Fetch a public key using Web Key Directory
 * @function
 * @param {string} identifier - Identifier of format 'username@domain.tld`
 * @returns {openpgp.PublicKey}
 * @example
 * const key = doip.keys.fetchWKD('alice@domain.tld');
 */
const fetchWKD = async (identifier) => {
  const wkd = new WKD()
  const lookupOpts = {
    email: identifier
  }

  const publicKey = await wkd
    .lookup(lookupOpts)
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })

  if (!publicKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return await openpgp.readKey({
    binaryKey: publicKey
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })
}

/**
 * Fetch a public key from Keybase
 * @function
 * @param {string} username     - Keybase username
 * @param {string} fingerprint  - Fingerprint of key
 * @returns {openpgp.PublicKey}
 * @example
 * const key = doip.keys.fetchKeybase('alice', '123abc123abc');
 */
const fetchKeybase = async (username, fingerprint) => {
  const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`
  let rawKeyContent
  try {
    rawKeyContent = await axios.get(
      keyLink,
      {
        responseType: 'text'
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response
        }
      })
      .then((response) => response.data)
  } catch (e) {
    throw new Error(`Error fetching Keybase key: ${e.message}`)
  }

  return await openpgp.readKey({
    armoredKey: rawKeyContent
  })
    .catch((error) => {
      throw new Error(`Key does not exist or could not be fetched (${error})`)
    })
}

/**
 * Get a public key from plaintext data
 * @function
 * @param {string} rawKeyContent - Plaintext ASCII-formatted public key data
 * @returns {openpgp.PublicKey}
 * @example
 * const plainkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
 *
 * mQINBF0mIsIBEADacleiyiV+z6FIunvLWrO6ZETxGNVpqM+WbBQKdW1BVrJBBolg
 * [...]
 * =6lib
 * -----END PGP PUBLIC KEY BLOCK-----`
 * const key = doip.keys.fetchPlaintext(plainkey);
 */
const fetchPlaintext = async (rawKeyContent) => {
  const publicKey = await openpgp.readKey({
    armoredKey: rawKeyContent
  })
    .catch((error) => {
      throw new Error(`Key could not be read (${error})`)
    })

  return publicKey
}

/**
 * Fetch a public key using an URI
 * @function
 * @param {string} uri - URI that defines the location of the key
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const key2 = doip.keys.fetchURI('hkp:123abc123abc');
 * const key3 = doip.keys.fetchURI('wkd:alice@domain.tld');
 */
const fetchURI = async (uri) => {
  if (!validUrl.isUri(uri)) {
    throw new Error('Invalid URI')
  }

  const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/
  const match = uri.match(re)

  if (!match[1]) {
    throw new Error('Invalid URI')
  }

  switch (match[1]) {
    case 'hkp':
      return await fetchHKP(
        match[3] ? match[3] : match[2],
        match[3] ? match[2] : null
      )

    case 'wkd':
      return await fetchWKD(match[2])

    case 'kb':
      return await fetchKeybase(match[2], match.length >= 4 ? match[3] : null)

    default:
      throw new Error('Invalid URI protocol')
  }
}

/**
 * Fetch a public key
 *
 * This function will attempt to detect the identifier and fetch the key
 * accordingly. If the identifier is an email address, it will first try and
 * fetch the key using WKD and then HKP. Otherwise, it will try HKP only.
 *
 * This function will also try and parse the input as a plaintext key
 * @function
 * @param {string} identifier - URI that defines the location of the key
 * @returns {openpgp.PublicKey}
 * @example
 * const key1 = doip.keys.fetch('alice@domain.tld');
 * const key2 = doip.keys.fetch('123abc123abc');
 */
const fetch = async (identifier) => {
  const re = /([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/
  const match = identifier.match(re)

  let pubKey = null

  // Attempt plaintext
  if (!pubKey) {
    try {
      pubKey = await fetchPlaintext(identifier)
    } catch (e) {}
  }

  // Attempt WKD
  if (!pubKey && identifier.includes('@')) {
    try {
      pubKey = await fetchWKD(match[1])
    } catch (e) {}
  }

  // Attempt HKP
  if (!pubKey) {
    pubKey = await fetchHKP(
      match[2] ? match[2] : match[1],
      match[2] ? match[1] : null
    )
  }

  if (!pubKey) {
    throw new Error('Key does not exist or could not be fetched')
  }

  return pubKey
}

/**
 * Process a public key to get user data and claims
 * @function
 * @param {openpgp.PublicKey} publicKey - The public key to process
 * @returns {object}
 * @example
 * const key = doip.keys.fetchURI('hkp:alice@domain.tld');
 * const data = doip.keys.process(key);
 * data.users[0].claims.forEach(claim => {
 *   console.log(claim.uri);
 * });
 */
const process = async (publicKey) => {
  if (!publicKey || !(publicKey instanceof openpgp.PublicKey)) {
    throw new Error('Invalid public key')
  }

  const fingerprint = publicKey.getFingerprint()
  const primaryUser = await publicKey.getPrimaryUser()
  const users = publicKey.users
  const usersOutput = []

  users.forEach((user, i) => {
    usersOutput[i] = {
      userData: {
        id: user.userID ? user.userID.userID : null,
        name: user.userID ? user.userID.name : null,
        email: user.userID ? user.userID.email : null,
        comment: user.userID ? user.userID.comment : null,
        isPrimary: primaryUser.index === i,
        isRevoked: false
      },
      claims: []
    }

    if ('selfCertifications' in user && user.selfCertifications.length > 0) {
      const selfCertification = user.selfCertifications[0]

      const notations = selfCertification.rawNotations
      usersOutput[i].claims = notations
        .filter(
          ({ name, humanReadable }) =>
            humanReadable && (name === 'proof@ariadne.id' || name === 'proof@metacode.biz')
        )
        .map(
          ({ value }) =>
            new Claim(new TextDecoder().decode(value), fingerprint)
        )

      usersOutput[i].userData.isRevoked = selfCertification.revoked
    }
  })

  return {
    fingerprint: fingerprint,
    users: usersOutput,
    primaryUserIndex: primaryUser.index,
    key: {
      data: publicKey,
      fetchMethod: null,
      uri: null
    }
  }
}

exports.fetchHKP = fetchHKP
exports.fetchWKD = fetchWKD
exports.fetchKeybase = fetchKeybase
exports.fetchPlaintext = fetchPlaintext
exports.fetchURI = fetchURI
exports.fetch = fetch
exports.process = process

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./claim":147,"@openpgp/hkp-client":1,"@openpgp/wkd-client":2,"axios":3,"valid-url":44}],181:[function(require,module,exports){
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
const jsEnv = require('browser-or-node')
const fetcher = require('./fetcher')
const utils = require('./utils')
const E = require('./enums')

/**
 * @module proofs
 */

/**
 * Delegate the proof request to the correct fetcher.
 * This method uses the current environment (browser/node), certain values from
 * the `data` parameter and the proxy policy set in the `opts` parameter to
 * choose the right approach to fetch the proof. An error will be thrown if no
 * approach is possible.
 * @async
 * @param {object} data - Data from a claim definition
 * @param {object} opts - Options to enable the request
 * @returns {Promise<object|string>}
 */
const fetch = (data, opts) => {
  switch (data.proof.request.fetcher) {
    case E.Fetcher.HTTP:
      data.proof.request.data.format = data.proof.request.format
      break

    default:
      break
  }

  if (jsEnv.isNode) {
    return handleNodeRequests(data, opts)
  }

  return handleBrowserRequests(data, opts)
}

const handleBrowserRequests = (data, opts) => {
  switch (opts.proxy.policy) {
    case E.ProxyPolicy.ALWAYS:
      return createProxyRequestPromise(data, opts)

    case E.ProxyPolicy.NEVER:
      switch (data.proof.request.access) {
        case E.ProofAccess.GENERIC:
        case E.ProofAccess.GRANTED:
          return createDefaultRequestPromise(data, opts)
        case E.ProofAccess.NOCORS:
        case E.ProofAccess.SERVER:
          throw new Error(
            'Impossible to fetch proof (bad combination of service access and proxy policy)'
          )
        default:
          throw new Error('Invalid proof access value')
      }

    case E.ProxyPolicy.ADAPTIVE:
      switch (data.proof.request.access) {
        case E.ProofAccess.GENERIC:
          return createFallbackRequestPromise(data, opts)
        case E.ProofAccess.NOCORS:
          return createProxyRequestPromise(data, opts)
        case E.ProofAccess.GRANTED:
          return createFallbackRequestPromise(data, opts)
        case E.ProofAccess.SERVER:
          return createProxyRequestPromise(data, opts)
        default:
          throw new Error('Invalid proof access value')
      }

    default:
      throw new Error('Invalid proxy policy')
  }
}

const handleNodeRequests = (data, opts) => {
  switch (opts.proxy.policy) {
    case E.ProxyPolicy.ALWAYS:
      return createProxyRequestPromise(data, opts)

    case E.ProxyPolicy.NEVER:
      return createDefaultRequestPromise(data, opts)

    case E.ProxyPolicy.ADAPTIVE:
      return createFallbackRequestPromise(data, opts)

    default:
      throw new Error('Invalid proxy policy')
  }
}

const createDefaultRequestPromise = (data, opts) => {
  return new Promise((resolve, reject) => {
    fetcher[data.proof.request.fetcher]
      .fn(data.proof.request.data, opts)
      .then((res) => {
        return resolve({
          fetcher: data.proof.request.fetcher,
          data: data,
          viaProxy: false,
          result: res
        })
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

const createProxyRequestPromise = (data, opts) => {
  return new Promise((resolve, reject) => {
    let proxyUrl
    try {
      proxyUrl = utils.generateProxyURL(
        data.proof.request.fetcher,
        data.proof.request.data,
        opts
      )
    } catch (err) {
      reject(err)
    }

    const requestData = {
      url: proxyUrl,
      format: data.proof.request.format,
      fetcherTimeout: fetcher[data.proof.request.fetcher].timeout
    }
    fetcher.http
      .fn(requestData, opts)
      .then((res) => {
        return resolve({
          fetcher: 'http',
          data: data,
          viaProxy: true,
          result: res
        })
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

const createFallbackRequestPromise = (data, opts) => {
  return new Promise((resolve, reject) => {
    createDefaultRequestPromise(data, opts)
      .then((res) => {
        return resolve(res)
      })
      .catch((err1) => {
        createProxyRequestPromise(data, opts)
          .then((res) => {
            return resolve(res)
          })
          .catch((err2) => {
            return reject(err2)
          })
      })
  })
}

exports.fetch = fetch

},{"./enums":170,"./fetcher":173,"./utils":183,"browser-or-node":32}],182:[function(require,module,exports){
(function (global){(function (){
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
const openpgp = (typeof window !== "undefined" ? window['openpgp'] : typeof global !== "undefined" ? global['openpgp'] : null)
const Claim = require('./claim')
const keys = require('./keys')

/**
 * @module signatures
 */

/**
 * Extract data from a signature and fetch the associated key
 * @async
 * @param {string} signature - The plaintext signature to process
 * @returns {Promise<object>}
 */
const process = async (signature) => {
  let sigData
  const result = {
    fingerprint: null,
    users: [
      {
        userData: {},
        claims: []
      }
    ],
    primaryUserIndex: null,
    key: {
      data: null,
      fetchMethod: null,
      uri: null
    }
  }

  // Read the signature
  try {
    sigData = await openpgp.readCleartextMessage({
      cleartextMessage: signature
    })
  } catch (e) {
    throw new Error(`Signature could not be read (${e.message})`)
  }

  const issuerKeyID = sigData.signature.packets[0].issuerKeyID.toHex()
  const signersUserID = sigData.signature.packets[0].signersUserID
  const preferredKeyServer =
    sigData.signature.packets[0].preferredKeyServer ||
    'https://keys.openpgp.org/'
  const text = sigData.getText()
  const sigKeys = []

  text.split('\n').forEach((line, i) => {
    const match = line.match(/^([a-zA-Z0-9]*)=(.*)$/i)
    if (!match) {
      return
    }
    switch (match[1].toLowerCase()) {
      case 'key':
        sigKeys.push(match[2])
        break

      case 'proof':
        result.users[0].claims.push(new Claim(match[2]))
        break

      default:
        break
    }
  })

  // Try overruling key
  if (sigKeys.length > 0) {
    try {
      result.key.uri = sigKeys[0]
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = result.key.uri.split(':')[0]
    } catch (e) {}
  }
  // Try WKD
  if (!result.key.data && signersUserID) {
    try {
      result.key.uri = `wkd:${signersUserID}`
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = 'wkd'
    } catch (e) {}
  }
  // Try HKP
  if (!result.key.data) {
    try {
      const match = preferredKeyServer.match(/^(.*:\/\/)?([^/]*)(?:\/)?$/i)
      result.key.uri = `hkp:${match[2]}:${issuerKeyID || signersUserID}`
      result.key.data = await keys.fetchURI(result.key.uri)
      result.key.fetchMethod = 'hkp'
    } catch (e) {
      throw new Error('Public key not found')
    }
  }

  // Verify the signature
  const verificationResult = await openpgp.verify({
    message: sigData,
    verificationKeys: result.key.data
  })
  const { verified } = verificationResult.signatures[0]
  try {
    await verified
  } catch (e) {
    throw new Error(`Signature could not be verified (${e.message})`)
  }

  result.fingerprint = result.key.data.keyPacket.getFingerprint()

  result.users[0].claims.forEach((claim) => {
    claim.fingerprint = result.fingerprint
  })

  const primaryUserData = await result.key.data.getPrimaryUser()
  let userData

  if (signersUserID) {
    result.key.data.users.forEach((user) => {
      if (user.userID.email === signersUserID) {
        userData = user
      }
    })
  }
  if (!userData) {
    userData = primaryUserData.user
  }

  result.users[0].userData = {
    id: userData.userID ? userData.userID.userID : null,
    name: userData.userID ? userData.userID.name : null,
    email: userData.userID ? userData.userID.email : null,
    comment: userData.userID ? userData.userID.comment : null,
    isPrimary: primaryUserData.user.userID.userID === userData.userID.userID
  }

  result.primaryUserIndex = result.users[0].userData.isPrimary ? 0 : null

  return result
}

exports.process = process

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./claim":147,"./keys":180}],183:[function(require,module,exports){
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
const validator = require('validator')
const E = require('./enums')

/**
 * @module utils
 */

/**
 * Generate an URL to request data from a proxy server
 * @param {string} type                 - The name of the fetcher the proxy must use
 * @param {object} data                 - The data the proxy must provide to the fetcher
 * @param {object} opts                 - Options to enable the request
 * @param {object} opts.proxy.hostname  - The hostname of the proxy server
 * @returns {string}
 */
const generateProxyURL = (type, data, opts) => {
  try {
    validator.isFQDN(opts.proxy.hostname)
  } catch (err) {
    throw new Error('Invalid proxy hostname')
  }

  const queryStrings = []

  Object.keys(data).forEach((key) => {
    queryStrings.push(`${key}=${encodeURIComponent(data[key])}`)
  })

  return `https://${opts.proxy.hostname}/api/2/get/${type}?${queryStrings.join(
    '&'
  )}`
}

/**
 * Generate the string that must be found in the proof to verify a claim
 * @param {string} fingerprint  - The fingerprint of the claim
 * @param {number} format       - The claim's format (see {@link module:enums~ClaimFormat|enums.ClaimFormat})
 * @returns {string}
 */
const generateClaim = (fingerprint, format) => {
  switch (format) {
    case E.ClaimFormat.URI:
      return `openpgp4fpr:${fingerprint}`
    case E.ClaimFormat.FINGERPRINT:
      return fingerprint
    default:
      throw new Error('No valid claim format')
  }
}

/**
 * Get the URIs from a string and return them as an array
 * @param {string} text         - The text that may contain URIs
 * @returns {Array.string}
 */
const getUriFromString = (text) => {
  const re = /((([A-Za-z0-9]+:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/gi
  const res = text.match(re)

  const urls = []

  if (!res) {
    return []
  }

  res.forEach(url => {
    // Remove bad trailing characters
    let hasBadTrailingChars = true

    while (hasBadTrailingChars) {
      const lastChar = url.charAt(url.length - 1)
      if ('?!.'.indexOf(lastChar) === -1) {
        hasBadTrailingChars = false
        continue
      }
      url = url.substring(0, url.length - 1)
    }

    urls.push(url)
  })

  return urls
}

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim
exports.getUriFromString = getUriFromString

},{"./enums":170,"validator":45}],184:[function(require,module,exports){
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
const utils = require('./utils')
const E = require('./enums')
const { bcryptVerify, argon2Verify } = require('hash-wasm')

/**
 * @module verifications
 * @ignore
 */

const containsProof = async (data, fingerprint, claimFormat) => {
  const fingerprintFormatted = utils.generateClaim(fingerprint, claimFormat)
  const fingerprintURI = utils.generateClaim(fingerprint, E.ClaimFormat.URI)
  let result = false

  // Check for plaintext proof
  result = data.replace(/\r?\n|\r/g, '')
    .toLowerCase()
    .indexOf(fingerprintFormatted.toLowerCase()) !== -1

  // Check for hashed proof
  if (!result) {
    const hashRe = /\$(argon2(?:id|d|i)|2a|2b|2y)(?:\$[a-zA-Z0-9=+\-,./]+)+/g
    let match

    while (!result && (match = hashRe.exec(data)) != null) {
      let timeoutHandle
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(
          () => {
            resolve(false)
          }, 1000
        )
      })

      switch (match[1]) {
        case '2a':
        case '2b':
        case '2y':
          try {
            // Patch until promise.race properly works on WASM
            if (parseInt(match[0].split('$')[2]) > 12) continue

            const hashPromise = bcryptVerify({
              password: fingerprintURI,
              hash: match[0]
            })
              .then(result => result)
              .catch(_ => false)

            result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
              clearTimeout(timeoutHandle)
              return result
            })
          } catch (err) {
            result = false
          }
          break

        case 'argon2':
        case 'argon2i':
        case 'argon2d':
        case 'argon2id':
          try {
            const hashPromise = argon2Verify({
              password: fingerprintURI,
              hash: match[0]
            })
              .then(result => result)
              .catch(_ => false)

            result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
              clearTimeout(timeoutHandle)
              return result
            })
          } catch (err) {
            result = false
          }
          break

        default:
          continue
      }
    }
  }

  // Check for HTTP proof
  if (!result) {
    const uris = utils.getUriFromString(data)

    for (let index = 0; index < uris.length; index++) {
      if (result) continue

      const candidate = uris[index]
      let candidateURL

      try {
        candidateURL = new URL(candidate)
      } catch (_) {
        continue
      }

      if (candidateURL.protocol !== 'https:') {
        continue
      }

      // Using fetch -> axios doesn't find the ariadne-identity-proof header
      const response = await fetch(candidate, { // eslint-disable-line
        method: 'HEAD'
      })
        .catch(e => {
          return false
        })

      if (!response) continue
      if (response.status !== 200) continue
      if (!response.headers.get('ariadne-identity-proof')) continue

      result = response.headers.get('ariadne-identity-proof')
        .toLowerCase()
        .indexOf(fingerprintURI.toLowerCase()) !== -1
    }
  }

  return result
}

const runJSON = async (proofData, checkPath, checkClaim, checkClaimFormat, checkRelation) => {
  if (!proofData) {
    return false
  }

  if (Array.isArray(proofData)) {
    let result = false

    for (let index = 0; index < proofData.length; index++) {
      const item = proofData[index]

      if (result) {
        continue
      }

      result = await runJSON(item, checkPath, checkClaim, checkClaimFormat, checkRelation)
    }

    return result
  }

  if (checkPath.length === 0) {
    switch (checkRelation) {
      case E.ClaimRelation.ONEOF:
        return await containsProof(proofData.join('|'), checkClaim, checkClaimFormat)

      case E.ClaimRelation.CONTAINS:
      case E.ClaimRelation.EQUALS:
      default:
        return await containsProof(proofData, checkClaim, checkClaimFormat)
    }
  }

  if (!(checkPath[0] in proofData)) {
    throw new Error('err_json_structure_incorrect')
  }

  return await runJSON(
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkClaimFormat,
    checkRelation
  )
}

/**
 * Run the verification by finding the formatted fingerprint in the proof
 * @async
 * @param {object} proofData    - The proof data
 * @param {object} claimData    - The claim data
 * @param {string} fingerprint  - The fingerprint
 * @returns {object}
 */
const run = async (proofData, claimData, fingerprint) => {
  const res = {
    result: false,
    completed: false,
    errors: []
  }

  switch (claimData.proof.request.format) {
    case E.ProofFormat.JSON:
      try {
        res.result = await runJSON(
          proofData,
          claimData.claim.path,
          fingerprint,
          claimData.claim.format,
          claimData.claim.relation
        )
        res.completed = true
      } catch (error) {
        res.errors.push(error.message ? error.message : error)
      }
      break
    case E.ProofFormat.TEXT:
      try {
        res.result = await containsProof(proofData,
          fingerprint,
          claimData.claim.format)
        res.completed = true
      } catch (error) {
        res.errors.push('err_unknown_text_verification')
      }
      break
  }

  return res
}

exports.run = run

},{"./enums":170,"./utils":183,"hash-wasm":37}]},{},[179])(179)
});
