var doipFetchers = (function (exports) {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var axios$3 = {exports: {}};

	var bind$2 = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	var bind$1 = bind$2;

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
	function merge$1(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (isPlainObject(result[key]) && isPlainObject(val)) {
	      result[key] = merge$1(result[key], val);
	    } else if (isPlainObject(val)) {
	      result[key] = merge$1({}, val);
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
	      a[key] = bind$1(val, thisArg);
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

	var utils$8 = {
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
	  merge: merge$1,
	  extend: extend,
	  trim: trim,
	  stripBOM: stripBOM
	};

	var utils$7 = utils$8;

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
	var buildURL$1 = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils$7.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils$7.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils$7.isArray(val)) {
	        key = key + '[]';
	      } else {
	        val = [val];
	      }

	      utils$7.forEach(val, function parseValue(v) {
	        if (utils$7.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils$7.isObject(v)) {
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

	var utils$6 = utils$8;

	function InterceptorManager$1() {
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
	InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
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
	InterceptorManager$1.prototype.eject = function eject(id) {
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
	InterceptorManager$1.prototype.forEach = function forEach(fn) {
	  utils$6.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	var InterceptorManager_1 = InterceptorManager$1;

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

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
	function nextTick(fun) {
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
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version$1 = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version$1,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var utils$5 = utils$8;

	var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
	  utils$5.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};

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
	var enhanceError = function enhanceError(error, config, code, request, response) {
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

	var createError;
	var hasRequiredCreateError;

	function requireCreateError () {
		if (hasRequiredCreateError) return createError;
		hasRequiredCreateError = 1;

		var enhanceError$1 = enhanceError;

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
		createError = function createError(message, config, code, request, response) {
		  var error = new Error(message);
		  return enhanceError$1(error, config, code, request, response);
		};
		return createError;
	}

	var settle;
	var hasRequiredSettle;

	function requireSettle () {
		if (hasRequiredSettle) return settle;
		hasRequiredSettle = 1;

		var createError = requireCreateError();

		/**
		 * Resolve or reject a Promise based on response status.
		 *
		 * @param {Function} resolve A function that resolves the promise.
		 * @param {Function} reject A function that rejects the promise.
		 * @param {object} response The response.
		 */
		settle = function settle(resolve, reject, response) {
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
		return settle;
	}

	var cookies;
	var hasRequiredCookies;

	function requireCookies () {
		if (hasRequiredCookies) return cookies;
		hasRequiredCookies = 1;

		var utils = utils$8;

		cookies = (
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
		return cookies;
	}

	var isAbsoluteURL;
	var hasRequiredIsAbsoluteURL;

	function requireIsAbsoluteURL () {
		if (hasRequiredIsAbsoluteURL) return isAbsoluteURL;
		hasRequiredIsAbsoluteURL = 1;

		/**
		 * Determines whether the specified URL is absolute
		 *
		 * @param {string} url The URL to test
		 * @returns {boolean} True if the specified URL is absolute, otherwise false
		 */
		isAbsoluteURL = function isAbsoluteURL(url) {
		  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
		  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
		  // by any combination of letters, digits, plus, period, or hyphen.
		  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
		};
		return isAbsoluteURL;
	}

	var combineURLs;
	var hasRequiredCombineURLs;

	function requireCombineURLs () {
		if (hasRequiredCombineURLs) return combineURLs;
		hasRequiredCombineURLs = 1;

		/**
		 * Creates a new URL by combining the specified URLs
		 *
		 * @param {string} baseURL The base URL
		 * @param {string} relativeURL The relative URL
		 * @returns {string} The combined URL
		 */
		combineURLs = function combineURLs(baseURL, relativeURL) {
		  return relativeURL
		    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
		    : baseURL;
		};
		return combineURLs;
	}

	var buildFullPath;
	var hasRequiredBuildFullPath;

	function requireBuildFullPath () {
		if (hasRequiredBuildFullPath) return buildFullPath;
		hasRequiredBuildFullPath = 1;

		var isAbsoluteURL = requireIsAbsoluteURL();
		var combineURLs = requireCombineURLs();

		/**
		 * Creates a new URL by combining the baseURL with the requestedURL,
		 * only when the requestedURL is not already an absolute URL.
		 * If the requestURL is absolute, this function returns the requestedURL untouched.
		 *
		 * @param {string} baseURL The base URL
		 * @param {string} requestedURL Absolute or relative URL to combine
		 * @returns {string} The combined full path
		 */
		buildFullPath = function buildFullPath(baseURL, requestedURL) {
		  if (baseURL && !isAbsoluteURL(requestedURL)) {
		    return combineURLs(baseURL, requestedURL);
		  }
		  return requestedURL;
		};
		return buildFullPath;
	}

	var parseHeaders;
	var hasRequiredParseHeaders;

	function requireParseHeaders () {
		if (hasRequiredParseHeaders) return parseHeaders;
		hasRequiredParseHeaders = 1;

		var utils = utils$8;

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
		parseHeaders = function parseHeaders(headers) {
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
		return parseHeaders;
	}

	var isURLSameOrigin;
	var hasRequiredIsURLSameOrigin;

	function requireIsURLSameOrigin () {
		if (hasRequiredIsURLSameOrigin) return isURLSameOrigin;
		hasRequiredIsURLSameOrigin = 1;

		var utils = utils$8;

		isURLSameOrigin = (
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
		return isURLSameOrigin;
	}

	var Cancel_1;
	var hasRequiredCancel;

	function requireCancel () {
		if (hasRequiredCancel) return Cancel_1;
		hasRequiredCancel = 1;

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

		Cancel_1 = Cancel;
		return Cancel_1;
	}

	var xhr;
	var hasRequiredXhr;

	function requireXhr () {
		if (hasRequiredXhr) return xhr;
		hasRequiredXhr = 1;

		var utils = utils$8;
		var settle = requireSettle();
		var cookies = requireCookies();
		var buildURL = buildURL$1;
		var buildFullPath = requireBuildFullPath();
		var parseHeaders = requireParseHeaders();
		var isURLSameOrigin = requireIsURLSameOrigin();
		var createError = requireCreateError();
		var defaults = requireDefaults();
		var Cancel = requireCancel();

		xhr = function xhrAdapter(config) {
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
		return xhr;
	}

	var defaults_1;
	var hasRequiredDefaults;

	function requireDefaults () {
		if (hasRequiredDefaults) return defaults_1;
		hasRequiredDefaults = 1;

		var utils = utils$8;
		var normalizeHeaderName$1 = normalizeHeaderName;
		var enhanceError$1 = enhanceError;

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
		    adapter = requireXhr();
		  } else if (typeof browser$1 !== 'undefined' && Object.prototype.toString.call(browser$1) === '[object process]') {
		    // For node use HTTP adapter
		    adapter = requireXhr();
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
		    normalizeHeaderName$1(headers, 'Accept');
		    normalizeHeaderName$1(headers, 'Content-Type');

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
		            throw enhanceError$1(e, this, 'E_JSON_PARSE');
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

		defaults_1 = defaults;
		return defaults_1;
	}

	var utils$4 = utils$8;
	var defaults$2 = requireDefaults();

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	var transformData$1 = function transformData(data, headers, fns) {
	  var context = this || defaults$2;
	  /*eslint no-param-reassign:0*/
	  utils$4.forEach(fns, function transform(fn) {
	    data = fn.call(context, data, headers);
	  });

	  return data;
	};

	var isCancel$1;
	var hasRequiredIsCancel;

	function requireIsCancel () {
		if (hasRequiredIsCancel) return isCancel$1;
		hasRequiredIsCancel = 1;

		isCancel$1 = function isCancel(value) {
		  return !!(value && value.__CANCEL__);
		};
		return isCancel$1;
	}

	var utils$3 = utils$8;
	var transformData = transformData$1;
	var isCancel = requireIsCancel();
	var defaults$1 = requireDefaults();
	var Cancel = requireCancel();

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
	var dispatchRequest$1 = function dispatchRequest(config) {
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
	  config.headers = utils$3.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers
	  );

	  utils$3.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults$1.adapter;

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

	var utils$2 = utils$8;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	var mergeConfig$2 = function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  var config = {};

	  function getMergedValue(target, source) {
	    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
	      return utils$2.merge(target, source);
	    } else if (utils$2.isPlainObject(source)) {
	      return utils$2.merge({}, source);
	    } else if (utils$2.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(config1[prop], config2[prop]);
	    } else if (!utils$2.isUndefined(config1[prop])) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(prop) {
	    if (!utils$2.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    } else if (!utils$2.isUndefined(config1[prop])) {
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

	  utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
	    var merge = mergeMap[prop] || mergeDeepProperties;
	    var configValue = merge(prop);
	    (utils$2.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	};

	var data;
	var hasRequiredData;

	function requireData () {
		if (hasRequiredData) return data;
		hasRequiredData = 1;
		data = {
		  "version": "0.25.0"
		};
		return data;
	}

	var VERSION = requireData().version;

	var validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
	  validators$1[type] = function validator(thing) {
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
	validators$1.transitional = function transitional(validator, version, message) {
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

	var validator$1 = {
	  assertOptions: assertOptions,
	  validators: validators$1
	};

	var utils$1 = utils$8;
	var buildURL = buildURL$1;
	var InterceptorManager = InterceptorManager_1;
	var dispatchRequest = dispatchRequest$1;
	var mergeConfig$1 = mergeConfig$2;
	var validator = validator$1;

	var validators = validator.validators;
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios$1(instanceConfig) {
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
	Axios$1.prototype.request = function request(configOrUrl, config) {
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

	  config = mergeConfig$1(this.defaults, config);

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

	Axios$1.prototype.getUri = function getUri(config) {
	  if (!config.url) {
	    throw new Error('Provided config url is not valid');
	  }
	  config = mergeConfig$1(this.defaults, config);
	  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
	};

	// Provide aliases for supported request methods
	utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios$1.prototype[method] = function(url, config) {
	    return this.request(mergeConfig$1(config || {}, {
	      method: method,
	      url: url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios$1.prototype[method] = function(url, data, config) {
	    return this.request(mergeConfig$1(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	var Axios_1 = Axios$1;

	var CancelToken_1;
	var hasRequiredCancelToken;

	function requireCancelToken () {
		if (hasRequiredCancelToken) return CancelToken_1;
		hasRequiredCancelToken = 1;

		var Cancel = requireCancel();

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

		CancelToken_1 = CancelToken;
		return CancelToken_1;
	}

	var spread;
	var hasRequiredSpread;

	function requireSpread () {
		if (hasRequiredSpread) return spread;
		hasRequiredSpread = 1;

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
		spread = function spread(callback) {
		  return function wrap(arr) {
		    return callback.apply(null, arr);
		  };
		};
		return spread;
	}

	var isAxiosError;
	var hasRequiredIsAxiosError;

	function requireIsAxiosError () {
		if (hasRequiredIsAxiosError) return isAxiosError;
		hasRequiredIsAxiosError = 1;

		var utils = utils$8;

		/**
		 * Determines whether the payload is an error thrown by Axios
		 *
		 * @param {*} payload The value to test
		 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
		 */
		isAxiosError = function isAxiosError(payload) {
		  return utils.isObject(payload) && (payload.isAxiosError === true);
		};
		return isAxiosError;
	}

	var utils = utils$8;
	var bind = bind$2;
	var Axios = Axios_1;
	var mergeConfig = mergeConfig$2;
	var defaults = requireDefaults();

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
	var axios$2 = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios$2.Axios = Axios;

	// Expose Cancel & CancelToken
	axios$2.Cancel = requireCancel();
	axios$2.CancelToken = requireCancelToken();
	axios$2.isCancel = requireIsCancel();
	axios$2.VERSION = requireData().version;

	// Expose all/spread
	axios$2.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios$2.spread = requireSpread();

	// Expose isAxiosError
	axios$2.isAxiosError = requireIsAxiosError();

	axios$3.exports = axios$2;

	// Allow use of default import syntax in TypeScript
	axios$3.exports.default = axios$2;

	var axiosExports = axios$3.exports;

	var axios = axiosExports;

	var axios$1 = /*@__PURE__*/getDefaultExportFromCjs(axios);

	var isURL$1 = {exports: {}};

	var assertString = {exports: {}};

	(function (module, exports) {

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
	} (assertString, assertString.exports));

	var assertStringExports = assertString.exports;

	var isFQDN$1 = {exports: {}};

	var merge = {exports: {}};

	(function (module, exports) {

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
	} (merge, merge.exports));

	var mergeExports = merge.exports;

	(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = isFQDN;

		var _assertString = _interopRequireDefault(assertStringExports);

		var _merge = _interopRequireDefault(mergeExports);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		var default_fqdn_options = {
		  require_tld: true,
		  allow_underscores: false,
		  allow_trailing_dot: false,
		  allow_numeric_tld: false,
		  allow_wildcard: false,
		  ignore_max_length: false
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

		    if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
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
		    if (part.length > 63 && !options.ignore_max_length) {
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
	} (isFQDN$1, isFQDN$1.exports));

	var isFQDNExports = isFQDN$1.exports;
	var isFQDN = /*@__PURE__*/getDefaultExportFromCjs(isFQDNExports);

	var isIP = {exports: {}};

	(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = isIP;

		var _assertString = _interopRequireDefault(assertStringExports);

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
		    return IPv4AddressRegExp.test(str);
		  }

		  if (version === '6') {
		    return IPv6AddressRegExp.test(str);
		  }

		  return false;
		}

		module.exports = exports.default;
		module.exports.default = exports.default; 
	} (isIP, isIP.exports));

	var isIPExports = isIP.exports;

	(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = isURL;

		var _assertString = _interopRequireDefault(assertStringExports);

		var _isFQDN = _interopRequireDefault(isFQDNExports);

		var _isIP = _interopRequireDefault(isIPExports);

		var _merge = _interopRequireDefault(mergeExports);

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
		  } else if (url.slice(0, 2) === '//') {
		    if (!options.allow_protocol_relative_urls) {
		      return false;
		    }

		    split[0] = url.slice(2);
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

		  if (host === '' && !options.require_host) {
		    return true;
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
	} (isURL$1, isURL$1.exports));

	var isURLExports = isURL$1.exports;
	var isURL = /*@__PURE__*/getDefaultExportFromCjs(isURLExports);

	var lib = {};

	Object.defineProperty(lib, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/* global window self */

	var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

	/* eslint-disable no-restricted-globals */
	var isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
	/* eslint-enable no-restricted-globals */

	var isNode = typeof browser$1 !== 'undefined' && browser$1.versions != null && browser$1.versions.node != null;

	/**
	 * @see https://github.com/jsdom/jsdom/releases/tag/12.0.0
	 * @see https://github.com/jsdom/jsdom/issues/1537
	 */
	/* eslint-disable no-undef */
	var isJsDom = function isJsDom() {
	  return typeof window !== 'undefined' && window.name === 'nodejs' || navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
	};

	lib.isBrowser = isBrowser;
	lib.isWebWorker = isWebWorker;
	var isNode_1 = lib.isNode = isNode;
	lib.isJsDom = isJsDom;

	var crypto = {};

	/*
	Copyright 2023 Yarmo Mackenbach

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
	 * Contains constant values
	 * @module constants
	 */

	/**
	 * doip.js library version
	 * @constant {string}
	 */
	const version = '1.2.4';

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

	const timeout$4 = 5000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data                           - Data used in the request
	 * @param {string} data.url                       - The URL of the account to verify
	 * @param {number} [data.fetcherTimeout]          - Optional timeout for the fetcher
	 * @param {object} opts                           - Options used to enable the request
	 * @param {object} opts.claims
	 * @param {object} opts.claims.activitypub
	 * @param {string} opts.claims.activitypub.url    - The URL of the verifier account
	 * @param {string} opts.claims.activitypub.privateKey   - The private key to sign the request
	 * @returns {Promise<object>}
	 */
	async function fn$4 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$4
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    (async () => {
	      let isConfigured = false;
	      try {
	        isURL(opts.claims.activitypub.url);
	        isConfigured = true;
	      } catch (_) {}

	      const now = new Date();
	      const { host, pathname, search } = new URL(data.url);

	      const headers = {
	        host,
	        date: now.toUTCString(),
	        accept: 'application/activity+json',
	        // @ts-ignore
	        'User-Agent': `doipjs/${version}`
	      };

	      if (isConfigured && isNode_1) {
	        // Generate the signature
	        const signedString = `(request-target): get ${pathname}${search}\nhost: ${host}\ndate: ${now.toUTCString()}`;
	        const sign = crypto.createSign('SHA256');
	        sign.write(signedString);
	        sign.end();
	        const signatureSig = sign.sign(opts.claims.activitypub.privateKey.replace(/\\n/g, '\n'), 'base64');
	        headers.signature = `keyId="${opts.claims.activitypub.url}#main-key",headers="(request-target) host date",signature="${signatureSig}",algorithm="rsa-sha256"`;
	      }

	      axios$1.get(data.url,
	        {
	          headers
	        })
	        .then(res => {
	          return res.data
	        })
	        .then(res => {
	          resolve(res);
	        })
	        .catch(error => {
	          reject(error);
	        });
	    })();
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var activitypub = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$4,
		timeout: timeout$4
	});

	/*
	Copyright 2023 Yarmo Mackenbach

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

	const timeout$3 = 5000;

	/**
	 * Execute a GraphQL query via HTTP request
	 * @function
	 * @async
	 * @param {object} data         - Data used in the request
	 * @param {string} data.url     - The URL pointing at the GraphQL HTTP endpoint
	 * @param {string} data.query   - The GraphQL query to fetch the data containing the proof
	 * @param {number} [data.fetcherTimeout]  - Optional timeout for the fetcher
	 * @returns {Promise<object|string>}
	 */
	async function fn$3 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$3
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    if (!data.url) {
	      reject(new Error('No valid URI provided'));
	      return
	    }

	    let jsonData;
	    try {
	      jsonData = JSON.parse(data.query);
	    } catch (error) {
	      reject(new Error('Invalid GraphQL query object'));
	    }

	    axios$1.post(data.url, jsonData, {
	      headers: {
	        'Content-Type': 'application/json',
	        // @ts-ignore
	        'User-Agent': `doipjs/${version}`
	      },
	      validateStatus: function (status) {
	        return status >= 200 && status < 400
	      }
	    })
	      .then(res => {
	        resolve(res.data);
	      })
	      .catch(e => {
	        reject(e);
	      });
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var graphql = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$3,
		timeout: timeout$3
	});

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
	 * Format of proof
	 * @readonly
	 * @enum {string}
	 */
	const ProofFormat = {
	  /** JSON format */
	  JSON: 'json',
	  /** Plaintext format */
	  TEXT: 'text'
	};

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

	const timeout$2 = 5000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data         - Data used in the request
	 * @param {string} data.url     - The URL pointing at targeted content
	 * @param {string} data.format  - The format of the targeted content
	 * @param {number} [data.fetcherTimeout]  - Optional timeout for the fetcher
	 * @returns {Promise<object|string>}
	 */
	async function fn$2 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$2
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    if (!data.url) {
	      reject(new Error('No valid URI provided'));
	      return
	    }

	    switch (data.format) {
	      case ProofFormat.JSON:
	        axios$1.get(data.url, {
	          headers: {
	            Accept: 'application/json',
	            // @ts-ignore
	            'User-Agent': `doipjs/${version}`
	          },
	          validateStatus: function (status) {
	            return status >= 200 && status < 400
	          }
	        })
	          .then(res => {
	            resolve(res.data);
	          })
	          .catch(e => {
	            reject(e);
	          });
	        break
	      case ProofFormat.TEXT:
	        axios$1.get(data.url, {
	          validateStatus: function (status) {
	            return status >= 200 && status < 400
	          },
	          responseType: 'text'
	        })
	          .then(res => {
	            resolve(res.data);
	          })
	          .catch(e => {
	            reject(e);
	          });
	        break
	      default:
	        reject(new Error('No specified data format'));
	        break
	    }
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var http = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$2,
		timeout: timeout$2
	});

	var isAscii$1 = {exports: {}};

	(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = isAscii;

		var _assertString = _interopRequireDefault(assertStringExports);

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
	} (isAscii$1, isAscii$1.exports));

	var isAsciiExports = isAscii$1.exports;
	var isAscii = /*@__PURE__*/getDefaultExportFromCjs(isAsciiExports);

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

	const timeout$1 = 5000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data                           - Data used in the request
	 * @param {string} data.eventId                   - The identifier of the targeted post
	 * @param {string} data.roomId                    - The identifier of the room containing the targeted post
	 * @param {number} [data.fetcherTimeout]          - Optional timeout for the fetcher
	 * @param {object} opts                           - Options used to enable the request
	 * @param {object} opts.claims
	 * @param {object} opts.claims.matrix
	 * @param {string} opts.claims.matrix.instance    - The server hostname on which the library can log in
	 * @param {string} opts.claims.matrix.accessToken - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
	 * @returns {Promise<object>}
	 */
	async function fn$1 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$1
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    try {
	      isFQDN(opts.claims.matrix.instance);
	      isAscii(opts.claims.matrix.accessToken);
	    } catch (err) {
	      throw new Error(`Matrix fetcher was not set up properly (${err.message})`)
	    }

	    const url = `https://${opts.claims.matrix.instance}/_matrix/client/r0/rooms/${data.roomId}/event/${data.eventId}?access_token=${opts.claims.matrix.accessToken}`;
	    axios$1.get(url,
	      {
	        headers: {
	          Accept: 'application/json',
	          // @ts-ignore
	          'User-Agent': `doipjs/${version}`
	        }
	      })
	      .then(res => {
	        return res.data
	      })
	      .then((res) => {
	        resolve(res);
	      })
	      .catch((error) => {
	        reject(error);
	      });
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var matrix = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$1,
		timeout: timeout$1
	});

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

	const timeout = 5000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data                          - Data used in the request
	 * @param {string} data.chat                     - Telegram public chat username
	 * @param {string} data.user                     - Telegram user username
	 * @param {number} [data.fetcherTimeout]         - Optional timeout for the fetcher
	 * @param {object} opts                          - Options used to enable the request
	 * @param {object} opts.claims
	 * @param {object} opts.claims.telegram
	 * @param {string} opts.claims.telegram.token    - The Telegram Bot API token
	 * @returns {Promise<object|string>}
	 */
	async function fn (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout
	    );
	  });

	  const apiPromise = (/** @type {string} */ method) => new Promise((resolve, reject) => {
	    try {
	      isAscii(opts.claims.telegram.token);
	    } catch (err) {
	      throw new Error(`Telegram fetcher was not set up properly (${err.message})`)
	    }

	    if (!(data.chat && data.user)) {
	      reject(new Error('Both chat name and user name must be provided'));
	      return
	    }

	    const url = `https://api.telegram.org/bot${opts.claims.telegram.token}/${method}?chat_id=@${data.chat}`;
	    axios$1.get(url, {
	      headers: {
	        Accept: 'application/json',
	        // @ts-ignore
	        'User-Agent': `doipjs/${version}`
	      },
	      validateStatus: (status) => status === 200
	    })
	      .then(res => resolve(res.data))
	      .catch(e => reject(e));
	  });

	  const fetchPromise = apiPromise('getChatAdministrators').then(admins => {
	    if (!admins.ok) {
	      throw new Error('Request to get chat administrators failed')
	    }

	    return apiPromise('getChat').then(chat => {
	      if (!chat.ok) {
	        throw new Error('Request to get chat info failed')
	      }

	      let creator;
	      for (const admin of admins.result) {
	        if (admin.status === 'creator') {
	          creator = admin.user.username;
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
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var telegram = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn,
		timeout: timeout
	});

	exports.activitypub = activitypub;
	exports.graphql = graphql;
	exports.http = http;
	exports.matrix = matrix;
	exports.telegram = telegram;

	return exports;

})({});
