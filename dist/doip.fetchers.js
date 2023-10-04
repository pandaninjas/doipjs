var doipFetchers = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var axios$3 = {exports: {}};

	var bind$3 = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	var bind$2 = bind$3;

	// utils is a library of generic helper functions non-specific to axios

	var toString$1 = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray$2(val) {
	  return Array.isArray(val);
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined$1(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer$2(val) {
	  return val !== null && !isUndefined$1(val) && val.constructor !== null && !isUndefined$1(val.constructor)
	    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString$1.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return toString$1.call(val) === '[object FormData]';
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
	function isString$1(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber$1(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject$1(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {Object} val The value to test
	 * @return {boolean} True if value is a plain Object, otherwise false
	 */
	function isPlainObject(val) {
	  if (toString$1.call(val) !== '[object Object]') {
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
	function isDate$1(val) {
	  return toString$1.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString$1.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString$1.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction$1(val) {
	  return toString$1.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject$1(val) && isFunction$1(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return toString$1.call(val) === '[object URLSearchParams]';
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
	function forEach$1(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray$2(obj)) {
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
	    } else if (isArray$2(val)) {
	      result[key] = val.slice();
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach$1(arguments[i], assignValue);
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
	  forEach$1(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind$2(val, thisArg);
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
	  isArray: isArray$2,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer$2,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString$1,
	  isNumber: isNumber$1,
	  isObject: isObject$1,
	  isPlainObject: isPlainObject,
	  isUndefined: isUndefined$1,
	  isDate: isDate$1,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction$1,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach$1,
	  merge: merge$1,
	  extend: extend,
	  trim: trim,
	  stripBOM: stripBOM
	};

	var utils$7 = utils$8;

	function encode$1(val) {
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
	        parts.push(encode$1(key) + '=' + encode$1(v));
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
	var browser$2 = true;
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

	var browser$1$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser$2,
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
		  } else if (typeof browser$1$1 !== 'undefined' && Object.prototype.toString.call(browser$1$1) === '[object process]') {
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
	var bind$1 = bind$3;
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
	  var instance = bind$1(Axios.prototype.request, context);

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

	var lib$2 = {};

	Object.defineProperty(lib$2, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/* global window self */

	var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

	/* eslint-disable no-restricted-globals */
	var isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
	/* eslint-enable no-restricted-globals */

	var isNode = typeof browser$1$1 !== 'undefined' && browser$1$1.versions != null && browser$1$1.versions.node != null;

	/**
	 * @see https://github.com/jsdom/jsdom/releases/tag/12.0.0
	 * @see https://github.com/jsdom/jsdom/issues/1537
	 */
	/* eslint-disable no-undef */
	var isJsDom = function isJsDom() {
	  return typeof window !== 'undefined' && window.name === 'nodejs' || navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
	};

	var isBrowser_1 = lib$2.isBrowser = isBrowser;
	lib$2.isWebWorker = isWebWorker;
	var isNode_1 = lib$2.isNode = isNode;
	lib$2.isJsDom = isJsDom;

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

	const timeout$9 = 5000;

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
	async function fn$7 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$9
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
		fn: fn$7,
		timeout: timeout$9
	});

	var dns$2 = {};

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

	const timeout$8 = 5000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data         - Data used in the request
	 * @param {string} data.domain  - The targeted domain
	 * @param {number} [data.fetcherTimeout]  - Optional timeout for the fetcher
	 * @returns {Promise<object>}
	 */
	async function fn$6 (data, opts) {
	  if (isBrowser_1) {
	    return null
	  }

	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$8
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    dns$2.resolveTxt(data.domain, (err, records) => {
	      if (err) {
	        reject(err);
	        return
	      }

	      resolve({
	        domain: data.domain,
	        records: {
	          txt: records
	        }
	      });
	    });
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var dns$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$6,
		timeout: timeout$8
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

	const timeout$7 = 5000;

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
	async function fn$5 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$7
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
		fn: fn$5,
		timeout: timeout$7
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

	const timeout$6 = 5000;

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
	async function fn$4 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$6
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

	var http$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$4,
		timeout: timeout$6
	});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray$1 = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	var _kMaxLength = kMaxLength();

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) ;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}
	Buffer.isBuffer = isBuffer$1;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray$1(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer$1(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	var _polyfillNode_buffer = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Buffer: Buffer,
		INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
		SlowBuffer: SlowBuffer,
		isBuffer: isBuffer$1,
		kMaxLength: _kMaxLength
	});

	var irc$1 = {};

	var _polyfillNode_net = {};

	var _polyfillNode_net$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: _polyfillNode_net
	});

	var require$$0$3 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_net$1);

	var _polyfillNode_tls = {};

	var _polyfillNode_tls$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: _polyfillNode_tls
	});

	var require$$1$3 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_tls$1);

	var inherits;
	if (typeof Object.create === 'function'){
	  inherits = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	var inherits$1 = inherits;

	var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
	  function getOwnPropertyDescriptors(obj) {
	    var keys = Object.keys(obj);
	    var descriptors = {};
	    for (var i = 0; i < keys.length; i++) {
	      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
	    }
	    return descriptors;
	  };

	var formatRegExp = /%[sdj%]/g;
	function format$1(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	}

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global$1.process)) {
	    return function() {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (browser$1$1.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (browser$1$1.throwDeprecation) {
	        throw new Error(msg);
	      } else if (browser$1$1.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = browser$1$1.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;
	      debugs[set] = function() {
	        var msg = format$1.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	}

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function(prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull(arg) {
	  return arg === null;
	}

	function isNullOrUndefined(arg) {
	  return arg == null;
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isString(arg) {
	  return typeof arg === 'string';
	}

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}

	function isBuffer(maybeBuf) {
	  return Buffer.isBuffer(maybeBuf);
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	function log() {
	  console.log('%s - %s', timestamp(), format$1.apply(null, arguments));
	}

	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

	function promisify(original) {
	  if (typeof original !== 'function')
	    throw new TypeError('The "original" argument must be of type Function');

	  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
	    var fn = original[kCustomPromisifiedSymbol];
	    if (typeof fn !== 'function') {
	      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
	    }
	    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
	      value: fn, enumerable: false, writable: false, configurable: true
	    });
	    return fn;
	  }

	  function fn() {
	    var promiseResolve, promiseReject;
	    var promise = new Promise(function (resolve, reject) {
	      promiseResolve = resolve;
	      promiseReject = reject;
	    });

	    var args = [];
	    for (var i = 0; i < arguments.length; i++) {
	      args.push(arguments[i]);
	    }
	    args.push(function (err, value) {
	      if (err) {
	        promiseReject(err);
	      } else {
	        promiseResolve(value);
	      }
	    });

	    try {
	      original.apply(this, args);
	    } catch (err) {
	      promiseReject(err);
	    }

	    return promise;
	  }

	  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

	  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
	    value: fn, enumerable: false, writable: false, configurable: true
	  });
	  return Object.defineProperties(
	    fn,
	    getOwnPropertyDescriptors(original)
	  );
	}

	promisify.custom = kCustomPromisifiedSymbol;

	function callbackifyOnRejected(reason, cb) {
	  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
	  // Because `null` is a special error value in callbacks which means "no error
	  // occurred", we error-wrap so the callback consumer can distinguish between
	  // "the promise rejected with null" or "the promise fulfilled with undefined".
	  if (!reason) {
	    var newReason = new Error('Promise was rejected with a falsy value');
	    newReason.reason = reason;
	    reason = newReason;
	  }
	  return cb(reason);
	}

	function callbackify(original) {
	  if (typeof original !== 'function') {
	    throw new TypeError('The "original" argument must be of type Function');
	  }

	  // We DO NOT return the promise as it gives the user a false sense that
	  // the promise is actually somehow related to the callback's execution
	  // and that the callback throwing will reject the promise.
	  function callbackified() {
	    var args = [];
	    for (var i = 0; i < arguments.length; i++) {
	      args.push(arguments[i]);
	    }

	    var maybeCb = args.pop();
	    if (typeof maybeCb !== 'function') {
	      throw new TypeError('The last argument must be of type Function');
	    }
	    var self = this;
	    var cb = function() {
	      return maybeCb.apply(self, arguments);
	    };
	    // In true node style we process the callback on `nextTick` with all the
	    // implications (stack, `uncaughtException`, `async_hooks`)
	    original.apply(this, args)
	      .then(function(ret) { browser$1$1.nextTick(cb.bind(null, null, ret)); },
	        function(rej) { browser$1$1.nextTick(callbackifyOnRejected.bind(null, rej, cb)); });
	  }

	  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
	  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
	  return callbackified;
	}

	var _polyfillNode_util = {
	  inherits: inherits$1,
	  _extend: _extend,
	  log: log,
	  isBuffer: isBuffer,
	  isPrimitive: isPrimitive,
	  isFunction: isFunction,
	  isError: isError,
	  isDate: isDate,
	  isObject: isObject,
	  isRegExp: isRegExp,
	  isUndefined: isUndefined,
	  isSymbol: isSymbol,
	  isString: isString,
	  isNumber: isNumber,
	  isNullOrUndefined: isNullOrUndefined,
	  isNull: isNull,
	  isBoolean: isBoolean,
	  isArray: isArray,
	  inspect: inspect,
	  deprecate: deprecate,
	  format: format$1,
	  debuglog: debuglog,
	  promisify: promisify,
	  callbackify: callbackify,
	};

	var _polyfillNode_util$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		_extend: _extend,
		callbackify: callbackify,
		debuglog: debuglog,
		default: _polyfillNode_util,
		deprecate: deprecate,
		format: format$1,
		inherits: inherits$1,
		inspect: inspect,
		isArray: isArray,
		isBoolean: isBoolean,
		isBuffer: isBuffer,
		isDate: isDate,
		isError: isError,
		isFunction: isFunction,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber,
		isObject: isObject,
		isPrimitive: isPrimitive,
		isRegExp: isRegExp,
		isString: isString,
		isSymbol: isSymbol,
		isUndefined: isUndefined,
		log: log,
		promisify: promisify
	});

	var require$$2$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_util$1);

	var domain;

	// This constructor is used to store event handlers. Instantiating this is
	// faster than explicitly calling `Object.create(null)` to get a "clean" empty
	// object (tested with v8 v4.9).
	function EventHandlers() {}
	EventHandlers.prototype = Object.create(null);

	function EventEmitter$7() {
	  EventEmitter$7.init.call(this);
	}

	// nodejs oddity
	// require('events') === require('events').EventEmitter
	EventEmitter$7.EventEmitter = EventEmitter$7;

	EventEmitter$7.usingDomains = false;

	EventEmitter$7.prototype.domain = undefined;
	EventEmitter$7.prototype._events = undefined;
	EventEmitter$7.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter$7.defaultMaxListeners = 10;

	EventEmitter$7.init = function() {
	  this.domain = null;
	  if (EventEmitter$7.usingDomains) {
	    // if there is an active domain, then attach to it.
	    if (domain.active ) ;
	  }

	  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
	    this._events = new EventHandlers();
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter$7.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || isNaN(n))
	    throw new TypeError('"n" argument must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	function $getMaxListeners(that) {
	  if (that._maxListeners === undefined)
	    return EventEmitter$7.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter$7.prototype.getMaxListeners = function getMaxListeners() {
	  return $getMaxListeners(this);
	};

	// These standalone emit* functions are used to optimize calling of event
	// handlers for fast cases because emit() itself often has a variable number of
	// arguments and can be deoptimized because of that. These functions always have
	// the same number of arguments and thus do not get deoptimized, so the code
	// inside them can execute faster.
	function emitNone(handler, isFn, self) {
	  if (isFn)
	    handler.call(self);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self);
	  }
	}
	function emitOne(handler, isFn, self, arg1) {
	  if (isFn)
	    handler.call(self, arg1);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1);
	  }
	}
	function emitTwo(handler, isFn, self, arg1, arg2) {
	  if (isFn)
	    handler.call(self, arg1, arg2);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1, arg2);
	  }
	}
	function emitThree(handler, isFn, self, arg1, arg2, arg3) {
	  if (isFn)
	    handler.call(self, arg1, arg2, arg3);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1, arg2, arg3);
	  }
	}

	function emitMany(handler, isFn, self, args) {
	  if (isFn)
	    handler.apply(self, args);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].apply(self, args);
	  }
	}

	EventEmitter$7.prototype.emit = function emit(type) {
	  var er, handler, len, args, i, events, domain;
	  var doError = (type === 'error');

	  events = this._events;
	  if (events)
	    doError = (doError && events.error == null);
	  else if (!doError)
	    return false;

	  domain = this.domain;

	  // If there is no 'error' event listener then throw.
	  if (doError) {
	    er = arguments[1];
	    if (domain) {
	      if (!er)
	        er = new Error('Uncaught, unspecified "error" event');
	      er.domainEmitter = this;
	      er.domain = domain;
	      er.domainThrown = false;
	      domain.emit('error', er);
	    } else if (er instanceof Error) {
	      throw er; // Unhandled 'error' event
	    } else {
	      // At least give some kind of context to the user
	      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	      err.context = er;
	      throw err;
	    }
	    return false;
	  }

	  handler = events[type];

	  if (!handler)
	    return false;

	  var isFn = typeof handler === 'function';
	  len = arguments.length;
	  switch (len) {
	    // fast cases
	    case 1:
	      emitNone(handler, isFn, this);
	      break;
	    case 2:
	      emitOne(handler, isFn, this, arguments[1]);
	      break;
	    case 3:
	      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
	      break;
	    case 4:
	      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
	      break;
	    // slower
	    default:
	      args = new Array(len - 1);
	      for (i = 1; i < len; i++)
	        args[i - 1] = arguments[i];
	      emitMany(handler, isFn, this, args);
	  }

	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;

	  if (typeof listener !== 'function')
	    throw new TypeError('"listener" argument must be a function');

	  events = target._events;
	  if (!events) {
	    events = target._events = new EventHandlers();
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener) {
	      target.emit('newListener', type,
	                  listener.listener ? listener.listener : listener);

	      // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object
	      events = target._events;
	    }
	    existing = events[type];
	  }

	  if (!existing) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] = prepend ? [listener, existing] :
	                                          [existing, listener];
	    } else {
	      // If we've already got an array, just append.
	      if (prepend) {
	        existing.unshift(listener);
	      } else {
	        existing.push(listener);
	      }
	    }

	    // Check for listener leak
	    if (!existing.warned) {
	      m = $getMaxListeners(target);
	      if (m && m > 0 && existing.length > m) {
	        existing.warned = true;
	        var w = new Error('Possible EventEmitter memory leak detected. ' +
	                            existing.length + ' ' + type + ' listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit');
	        w.name = 'MaxListenersExceededWarning';
	        w.emitter = target;
	        w.type = type;
	        w.count = existing.length;
	        emitWarning(w);
	      }
	    }
	  }

	  return target;
	}
	function emitWarning(e) {
	  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
	}
	EventEmitter$7.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter$7.prototype.on = EventEmitter$7.prototype.addListener;

	EventEmitter$7.prototype.prependListener =
	    function prependListener(type, listener) {
	      return _addListener(this, type, listener, true);
	    };

	function _onceWrap(target, type, listener) {
	  var fired = false;
	  function g() {
	    target.removeListener(type, g);
	    if (!fired) {
	      fired = true;
	      listener.apply(target, arguments);
	    }
	  }
	  g.listener = listener;
	  return g;
	}

	EventEmitter$7.prototype.once = function once(type, listener) {
	  if (typeof listener !== 'function')
	    throw new TypeError('"listener" argument must be a function');
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter$7.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	      if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');
	      this.prependListener(type, _onceWrap(this, type, listener));
	      return this;
	    };

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter$7.prototype.removeListener =
	    function removeListener(type, listener) {
	      var list, events, position, i, originalListener;

	      if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');

	      events = this._events;
	      if (!events)
	        return this;

	      list = events[type];
	      if (!list)
	        return this;

	      if (list === listener || (list.listener && list.listener === listener)) {
	        if (--this._eventsCount === 0)
	          this._events = new EventHandlers();
	        else {
	          delete events[type];
	          if (events.removeListener)
	            this.emit('removeListener', type, list.listener || listener);
	        }
	      } else if (typeof list !== 'function') {
	        position = -1;

	        for (i = list.length; i-- > 0;) {
	          if (list[i] === listener ||
	              (list[i].listener && list[i].listener === listener)) {
	            originalListener = list[i].listener;
	            position = i;
	            break;
	          }
	        }

	        if (position < 0)
	          return this;

	        if (list.length === 1) {
	          list[0] = undefined;
	          if (--this._eventsCount === 0) {
	            this._events = new EventHandlers();
	            return this;
	          } else {
	            delete events[type];
	          }
	        } else {
	          spliceOne(list, position);
	        }

	        if (events.removeListener)
	          this.emit('removeListener', type, originalListener || listener);
	      }

	      return this;
	    };
	    
	// Alias for removeListener added in NodeJS 10.0
	// https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
	EventEmitter$7.prototype.off = function(type, listener){
	    return this.removeListener(type, listener);
	};

	EventEmitter$7.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	      var listeners, events;

	      events = this._events;
	      if (!events)
	        return this;

	      // not listening for removeListener, no need to emit
	      if (!events.removeListener) {
	        if (arguments.length === 0) {
	          this._events = new EventHandlers();
	          this._eventsCount = 0;
	        } else if (events[type]) {
	          if (--this._eventsCount === 0)
	            this._events = new EventHandlers();
	          else
	            delete events[type];
	        }
	        return this;
	      }

	      // emit removeListener for all listeners on all events
	      if (arguments.length === 0) {
	        var keys = Object.keys(events);
	        for (var i = 0, key; i < keys.length; ++i) {
	          key = keys[i];
	          if (key === 'removeListener') continue;
	          this.removeAllListeners(key);
	        }
	        this.removeAllListeners('removeListener');
	        this._events = new EventHandlers();
	        this._eventsCount = 0;
	        return this;
	      }

	      listeners = events[type];

	      if (typeof listeners === 'function') {
	        this.removeListener(type, listeners);
	      } else if (listeners) {
	        // LIFO order
	        do {
	          this.removeListener(type, listeners[listeners.length - 1]);
	        } while (listeners[0]);
	      }

	      return this;
	    };

	EventEmitter$7.prototype.listeners = function listeners(type) {
	  var evlistener;
	  var ret;
	  var events = this._events;

	  if (!events)
	    ret = [];
	  else {
	    evlistener = events[type];
	    if (!evlistener)
	      ret = [];
	    else if (typeof evlistener === 'function')
	      ret = [evlistener.listener || evlistener];
	    else
	      ret = unwrapListeners(evlistener);
	  }

	  return ret;
	};

	EventEmitter$7.listenerCount = function(emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount$1.call(emitter, type);
	  }
	};

	EventEmitter$7.prototype.listenerCount = listenerCount$1;
	function listenerCount$1(type) {
	  var events = this._events;

	  if (events) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter$7.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
	};

	// About 1.5x faster than the two-arg version of Array#splice().
	function spliceOne(list, index) {
	  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
	    list[i] = list[k];
	  list.pop();
	}

	function arrayClone(arr, i) {
	  var copy = new Array(i);
	  while (i--)
	    copy[i] = arr[i];
	  return copy;
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);
	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }
	  return ret;
	}

	var _polyfillNode_events = /*#__PURE__*/Object.freeze({
		__proto__: null,
		EventEmitter: EventEmitter$7,
		default: EventEmitter$7
	});

	var require$$1$2 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_events);

	var colors$1 = {};

	var codes$1 = {
	    white: '\u000300',
	    black: '\u000301',
	    dark_blue: '\u000302',
	    dark_green: '\u000303',
	    light_red: '\u000304',
	    dark_red: '\u000305',
	    magenta: '\u000306',
	    orange: '\u000307',
	    yellow: '\u000308',
	    light_green: '\u000309',
	    cyan: '\u000310',
	    light_cyan: '\u000311',
	    light_blue: '\u000312',
	    light_magenta: '\u000313',
	    gray: '\u000314',
	    light_gray: '\u000315',

	    bold: '\u0002',
	    underline: '\u001f',

	    reset: '\u000f'
	};
	colors$1.codes = codes$1;

	function wrap(color, text, resetColor) {
	    if (codes$1[color]) {
	        text = codes$1[color] + text;
	        text += (codes$1[resetColor]) ? codes$1[resetColor] : codes$1.reset;
	    }
	    return text;
	}
	colors$1.wrap = wrap;

	var ircColors$1 = {};

	(function (exports) {
		const colors = {
		  '00': ['white'],
		  '01': ['black'],
		  '02': ['navy'],
		  '03': ['green'],
		  '04': ['red'],
		  '05': ['brown', 'maroon'],
		  '06': ['purple', 'violet'],
		  '07': ['olive'],
		  '08': ['yellow'],
		  '09': ['lightgreen', 'lime'],
		  '10': ['teal', 'bluecyan'],
		  '11': ['cyan', 'aqua'],
		  '12': ['blue', 'royal'],
		  '13': ['pink', 'lightpurple', 'fuchsia'],
		  '14': ['gray', 'grey'],
		  '15': ['lightgray', 'lightgrey', 'silver']
		};

		const styles = {
		  normal        : '\x0F',
		  underline     : '\x1F',
		  bold          : '\x02',
		  italic        : '\x1D',
		  inverse       : '\x16',
		  strikethrough : '\x1E',
		  monospace     : '\x11',
		};

		const styleChars = {};
		Object.keys(styles).forEach((key) => {
		  styleChars[styles[key]] = true;
		});


		// Coloring character.
		const c = '\x03';
		const zero = styles.bold + styles.bold;
		const badStr = /^,\d/;
		const colorCodeStr = new RegExp(`^${c}\\d\\d`);

		const allColors = {
		  fg: [], bg: [], styles: Object.keys(styles), custom: [], extras: [],
		};

		// Make color functions for both foreground and background.
		Object.keys(colors).forEach((code) => {
		  // Foreground.
		  // If the string begins with /,\d/,
		  // it can undersirably apply a background color.
		  let fg = str => c + code + (badStr.test(str) ? zero : '') + str + c;

		  // Background.
		  let bg = (str) => {
		    // If the string begins with a foreground color already applied,
		    // use it to save string space.
		    if (colorCodeStr.test(str)) {
		      let str2 = str.substr(3);
		      return str.substr(0, 3) + ',' + code +
		        (str2.indexOf(zero) === 0 ? str2.substr(zero.length) : str2);
		    } else {
		      return c + '01,' + code + str + c;
		    }
		  };

		  colors[code].forEach((color) => {
		    allColors.fg.push(color);
		    allColors.bg.push('bg' + color);
		    exports[color] = fg;
		    exports['bg' + color] = bg;
		  });
		});

		// Style functions.
		Object.keys(styles).forEach((style) => {
		  let code = styles[style];
		  exports[style] = str => code + str + code;
		});

		// Some custom helpers.
		const custom = {
		  rainbow: (str, colorArr) => {
		    let rainbow = [
		      'red', 'olive', 'yellow', 'green', 'blue', 'navy', 'violet'
		    ];
		    colorArr = colorArr || rainbow;
		    let l = colorArr.length;
		    let i = 0;

		    return str
		      .split('')
		      .map(c => c !== ' ' ? exports[colorArr[i++ % l]](c) : c)
		      .join('');
		  },
		};

		Object.keys(custom).forEach((extra) => {
		  allColors.custom.push(extra);
		  exports[extra] = custom[extra];
		});

		// Extras.
		const extras = {
		  stripColors: str => str.replace(/\x03\d{0,2}(,\d{0,2}|\x02\x02)?/g, ''),

		  stripStyle: (str) => {
		    let path = [];
		    for (let i = 0, len = str.length; i < len; i++) {
		      let char = str[i];
		      if (styleChars[char] || char === c) {
		        let lastChar = path[path.length - 1];
		        if (lastChar && lastChar[0] === char) {
		          let p0 = lastChar[1];
		          // Don't strip out styles with no characters inbetween.
		          // And don't strip out color codes.
		          if (i - p0 > 1 && char !== c) {
		            str = str.slice(0, p0) + str.slice(p0 + 1, i) + str.slice(i + 1);
		            i -= 2;
		          }
		          path.pop();
		        } else {
		          path.push([str[i], i]);
		        }
		      }

		    }

		    // Remove any unmatching style characterss.
		    // Traverse list backwards to make removing less complicated.
		    for (let char of path.reverse()) {
		      if (char[0] !== c) {
		        let pos = char[1];
		        str = str.slice(0, pos) + str.slice(pos + 1);
		      }
		    }
		    return str;
		  },

		  stripColorsAndStyle: str => exports.stripColors(exports.stripStyle(str)),
		};

		Object.keys(extras).forEach((extra) => {
		  allColors.extras.push(extra);
		  exports[extra] = extras[extra];
		});

		// Adds all functions to each other so they can be chained.
		const addGetters = (fn, types) => {
		  Object.keys(allColors).forEach((type) => {
		    if (types.indexOf(type) > -1) { return; }
		    allColors[type].forEach((color) => {
		      if (fn[color] != null) { return; }
		      Object.defineProperty(fn, color, {
		        get: () => {
		          let f = str => exports[color](fn(str));
		          addGetters(f, [].concat(types, type));
		          return f;
		        },
		      });
		    });
		  });
		};

		Object.keys(allColors).forEach((type) => {
		  allColors[type].forEach((color) => {
		    addGetters(exports[color], [type]);
		  });
		});


		// Adds functions to global String object.
		exports.global = () => {
		  let str, irc = {};

		  String.prototype.__defineGetter__('irc', function() {
		    str = this;
		    return irc;
		  });

		  for (let type in allColors) {
		    allColors[type].forEach((color) => {
		      let fn = () => exports[color](str);
		      addGetters(fn, [type]);
		      irc[color] = fn;
		    });
		  }
		}; 
	} (ircColors$1));

	var codes = {
	    '001': {
	        name: 'rpl_welcome',
	        type: 'reply'
	    },
	    '002': {
	        name: 'rpl_yourhost',
	        type: 'reply'
	    },
	    '003': {
	        name: 'rpl_created',
	        type: 'reply'
	    },
	    '004': {
	        name: 'rpl_myinfo',
	        type: 'reply'
	    },
	    '005': {
	        name: 'rpl_isupport',
	        type: 'reply'
	    },
	    200: {
	        name: 'rpl_tracelink',
	        type: 'reply'
	    },
	    201: {
	        name: 'rpl_traceconnecting',
	        type: 'reply'
	    },
	    202: {
	        name: 'rpl_tracehandshake',
	        type: 'reply'
	    },
	    203: {
	        name: 'rpl_traceunknown',
	        type: 'reply'
	    },
	    204: {
	        name: 'rpl_traceoperator',
	        type: 'reply'
	    },
	    205: {
	        name: 'rpl_traceuser',
	        type: 'reply'
	    },
	    206: {
	        name: 'rpl_traceserver',
	        type: 'reply'
	    },
	    208: {
	        name: 'rpl_tracenewtype',
	        type: 'reply'
	    },
	    211: {
	        name: 'rpl_statslinkinfo',
	        type: 'reply'
	    },
	    212: {
	        name: 'rpl_statscommands',
	        type: 'reply'
	    },
	    213: {
	        name: 'rpl_statscline',
	        type: 'reply'
	    },
	    214: {
	        name: 'rpl_statsnline',
	        type: 'reply'
	    },
	    215: {
	        name: 'rpl_statsiline',
	        type: 'reply'
	    },
	    216: {
	        name: 'rpl_statskline',
	        type: 'reply'
	    },
	    218: {
	        name: 'rpl_statsyline',
	        type: 'reply'
	    },
	    219: {
	        name: 'rpl_endofstats',
	        type: 'reply'
	    },
	    221: {
	        name: 'rpl_umodeis',
	        type: 'reply'
	    },
	    241: {
	        name: 'rpl_statslline',
	        type: 'reply'
	    },
	    242: {
	        name: 'rpl_statsuptime',
	        type: 'reply'
	    },
	    243: {
	        name: 'rpl_statsoline',
	        type: 'reply'
	    },
	    244: {
	        name: 'rpl_statshline',
	        type: 'reply'
	    },
	    250: {
	        name: 'rpl_statsconn',
	        type: 'reply'
	    },
	    251: {
	        name: 'rpl_luserclient',
	        type: 'reply'
	    },
	    252: {
	        name: 'rpl_luserop',
	        type: 'reply'
	    },
	    253: {
	        name: 'rpl_luserunknown',
	        type: 'reply'
	    },
	    254: {
	        name: 'rpl_luserchannels',
	        type: 'reply'
	    },
	    255: {
	        name: 'rpl_luserme',
	        type: 'reply'
	    },
	    256: {
	        name: 'rpl_adminme',
	        type: 'reply'
	    },
	    257: {
	        name: 'rpl_adminloc1',
	        type: 'reply'
	    },
	    258: {
	        name: 'rpl_adminloc2',
	        type: 'reply'
	    },
	    259: {
	        name: 'rpl_adminemail',
	        type: 'reply'
	    },
	    261: {
	        name: 'rpl_tracelog',
	        type: 'reply'
	    },
	    265: {
	        name: 'rpl_localusers',
	        type: 'reply'
	    },
	    266: {
	        name: 'rpl_globalusers',
	        type: 'reply'
	    },
	    300: {
	        name: 'rpl_none',
	        type: 'reply'
	    },
	    301: {
	        name: 'rpl_away',
	        type: 'reply'
	    },
	    302: {
	        name: 'rpl_userhost',
	        type: 'reply'
	    },
	    303: {
	        name: 'rpl_ison',
	        type: 'reply'
	    },
	    305: {
	        name: 'rpl_unaway',
	        type: 'reply'
	    },
	    306: {
	        name: 'rpl_nowaway',
	        type: 'reply'
	    },
	    307: {
	        type: 'reply'
	    },
	    311: {
	        name: 'rpl_whoisuser',
	        type: 'reply'
	    },
	    312: {
	        name: 'rpl_whoisserver',
	        type: 'reply'
	    },
	    313: {
	        name: 'rpl_whoisoperator',
	        type: 'reply'
	    },
	    314: {
	        name: 'rpl_whowasuser',
	        type: 'reply'
	    },
	    315: {
	        name: 'rpl_endofwho',
	        type: 'reply'
	    },
	    317: {
	        name: 'rpl_whoisidle',
	        type: 'reply'
	    },
	    318: {
	        name: 'rpl_endofwhois',
	        type: 'reply'
	    },
	    319: {
	        name: 'rpl_whoischannels',
	        type: 'reply'
	    },
	    321: {
	        name: 'rpl_liststart',
	        type: 'reply'
	    },
	    322: {
	        name: 'rpl_list',
	        type: 'reply'
	    },
	    323: {
	        name: 'rpl_listend',
	        type: 'reply'
	    },
	    324: {
	        name: 'rpl_channelmodeis',
	        type: 'reply'
	    },
	    329: {
	        name: 'rpl_creationtime',
	        type: 'reply'
	    },
	    331: {
	        name: 'rpl_notopic',
	        type: 'reply'
	    },
	    332: {
	        name: 'rpl_topic',
	        type: 'reply'
	    },
	    333: {
	        name: 'rpl_topicwhotime',
	        type: 'reply'
	    },
	    335: {
	        name: 'rpl_whoisbot',
	        type: 'reply'
	    },
	    341: {
	        name: 'rpl_inviting',
	        type: 'reply'
	    },
	    342: {
	        name: 'rpl_summoning',
	        type: 'reply'
	    },
	    351: {
	        name: 'rpl_version',
	        type: 'reply'
	    },
	    352: {
	        name: 'rpl_whoreply',
	        type: 'reply'
	    },
	    353: {
	        name: 'rpl_namreply',
	        type: 'reply'
	    },
	    364: {
	        name: 'rpl_links',
	        type: 'reply'
	    },
	    365: {
	        name: 'rpl_endoflinks',
	        type: 'reply'
	    },
	    366: {
	        name: 'rpl_endofnames',
	        type: 'reply'
	    },
	    367: {
	        name: 'rpl_banlist',
	        type: 'reply'
	    },
	    368: {
	        name: 'rpl_endofbanlist',
	        type: 'reply'
	    },
	    369: {
	        name: 'rpl_endofwhowas',
	        type: 'reply'
	    },
	    371: {
	        name: 'rpl_info',
	        type: 'reply'
	    },
	    372: {
	        name: 'rpl_motd',
	        type: 'reply'
	    },
	    374: {
	        name: 'rpl_endofinfo',
	        type: 'reply'
	    },
	    375: {
	        name: 'rpl_motdstart',
	        type: 'reply'
	    },
	    376: {
	        name: 'rpl_endofmotd',
	        type: 'reply'
	    },
	    378: {
	        name: 'rpl_whoishost',
	        type: 'reply'
	    },
	    379: {
	        name: 'rpl_whoismodes',
	        type: 'reply'
	    },
	    381: {
	        name: 'rpl_youreoper',
	        type: 'reply'
	    },
	    382: {
	        name: 'rpl_rehashing',
	        type: 'reply'
	    },
	    391: {
	        name: 'rpl_time',
	        type: 'reply'
	    },
	    392: {
	        name: 'rpl_usersstart',
	        type: 'reply'
	    },
	    393: {
	        name: 'rpl_users',
	        type: 'reply'
	    },
	    394: {
	        name: 'rpl_endofusers',
	        type: 'reply'
	    },
	    395: {
	        name: 'rpl_nousers',
	        type: 'reply'
	    },
	    401: {
	        name: 'err_nosuchnick',
	        type: 'error'
	    },
	    402: {
	        name: 'err_nosuchserver',
	        type: 'error'
	    },
	    403: {
	        name: 'err_nosuchchannel',
	        type: 'error'
	    },
	    404: {
	        name: 'err_cannotsendtochan',
	        type: 'error'
	    },
	    405: {
	        name: 'err_toomanychannels',
	        type: 'error'
	    },
	    406: {
	        name: 'err_wasnosuchnick',
	        type: 'error'
	    },
	    407: {
	        name: 'err_toomanytargets',
	        type: 'error'
	    },
	    409: {
	        name: 'err_noorigin',
	        type: 'error'
	    },
	    411: {
	        name: 'err_norecipient',
	        type: 'error'
	    },
	    412: {
	        name: 'err_notexttosend',
	        type: 'error'
	    },
	    413: {
	        name: 'err_notoplevel',
	        type: 'error'
	    },
	    414: {
	        name: 'err_wildtoplevel',
	        type: 'error'
	    },
	    421: {
	        name: 'err_unknowncommand',
	        type: 'error'
	    },
	    422: {
	        name: 'err_nomotd',
	        type: 'error'
	    },
	    423: {
	        name: 'err_noadmininfo',
	        type: 'error'
	    },
	    424: {
	        name: 'err_fileerror',
	        type: 'error'
	    },
	    431: {
	        name: 'err_nonicknamegiven',
	        type: 'error'
	    },
	    432: {
	        name: 'err_erroneusnickname',
	        type: 'error'
	    },
	    433: {
	        name: 'err_nicknameinuse',
	        type: 'error'
	    },
	    436: {
	        name: 'err_nickcollision',
	        type: 'error'
	    },
	    441: {
	        name: 'err_usernotinchannel',
	        type: 'error'
	    },
	    442: {
	        name: 'err_notonchannel',
	        type: 'error'
	    },
	    443: {
	        name: 'err_useronchannel',
	        type: 'error'
	    },
	    444: {
	        name: 'err_nologin',
	        type: 'error'
	    },
	    445: {
	        name: 'err_summondisabled',
	        type: 'error'
	    },
	    446: {
	        name: 'err_usersdisabled',
	        type: 'error'
	    },
	    451: {
	        name: 'err_notregistered',
	        type: 'error'
	    },
	    461: {
	        name: 'err_needmoreparams',
	        type: 'error'
	    },
	    462: {
	        name: 'err_alreadyregistred',
	        type: 'error'
	    },
	    463: {
	        name: 'err_nopermforhost',
	        type: 'error'
	    },
	    464: {
	        name: 'err_passwdmismatch',
	        type: 'error'
	    },
	    465: {
	        name: 'err_yourebannedcreep',
	        type: 'error'
	    },
	    467: {
	        name: 'err_keyset',
	        type: 'error'
	    },
	    471: {
	        name: 'err_channelisfull',
	        type: 'error'
	    },
	    472: {
	        name: 'err_unknownmode',
	        type: 'error'
	    },
	    473: {
	        name: 'err_inviteonlychan',
	        type: 'error'
	    },
	    474: {
	        name: 'err_bannedfromchan',
	        type: 'error'
	    },
	    475: {
	        name: 'err_badchannelkey',
	        type: 'error'
	    },
	    477: {
	        type: 'error'
	    },
	    481: {
	        name: 'err_noprivileges',
	        type: 'error'
	    },
	    482: {
	        name: 'err_chanoprivsneeded',
	        type: 'error'
	    },
	    483: {
	        name: 'err_cantkillserver',
	        type: 'error'
	    },
	    491: {
	        name: 'err_nooperhost',
	        type: 'error'
	    },
	    501: {
	        name: 'err_umodeunknownflag',
	        type: 'error'
	    },
	    502: {
	        name: 'err_usersdontmatch',
	        type: 'error'
	    },
	    671: {
	        name: 'rpl_whoissecure',
	        type: 'reply'
	    },
	    900: {
	        name: 'rpl_loggedin',
	        type: 'reply'
	    },
	    901: {
	        name: 'rpl_loggedout',
	        type: 'reply'
	    },
	    902: {
	        name: 'err_nicklocked',
	        type: 'error'
	    },
	    903: {
	        name: 'rpl_saslsuccess',
	        type: 'reply'
	    },
	    904: {
	        name: 'err_saslfail',
	        type: 'error'
	    },
	    905: {
	        name: 'err_sasltoolong',
	        type: 'error'
	    },
	    906: {
	        name: 'err_saslaborted',
	        type: 'error'
	    },
	    907: {
	        name: 'err_saslalready',
	        type: 'error'
	    },
	    908: {
	        name: 'rpl_saslmechs',
	        type: 'reply'
	    }
	};

	var ircColors = ircColors$1;
	var replyFor = codes;

	/**
	 * parseMessage(line, stripColors)
	 *
	 * takes a raw "line" from the IRC server and turns it into an object with
	 * useful keys
	 * @param {String} line Raw message from IRC server.
	 * @param {Boolean} stripColors If true, strip IRC colors.
	 * @param {Boolean} enableStrictParse If true, will try to conform to RFC2812 strictly for parsing usernames (and disallow eg CJK characters).
	 * @return {Object} A parsed message object.
	 */
	var parse_message = function parseMessage(line, stripColors, enableStrictParse) {
	    var message = {};
	    var match;

	    if (stripColors) {
	        line = ircColors.stripColorsAndStyle(line);
	    }

	    // Parse prefix
	    match = line.match(/^:([^ ]+) +/);
	    if (match) {
	        message.prefix = match[1];
	        line = line.replace(/^:[^ ]+ +/, '');
	        if (enableStrictParse) {
	            match = message.prefix.match(/^([_a-zA-Z0-9~[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/);
	        } else {
	            match = message.prefix.match(/^([\u1100-\u11FF\u3040-\u309fF\u30A0-\u30FF\u3130-\u318F\u31F0-\u31FF\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF_a-zA-Z0-9~[\]\\/?`^{}|-]*)(!([^@]+)@(.*))?$/);
	        }
	        if (match) {
	            message.nick = match[1];
	            message.user = match[3];
	            message.host = match[4];
	        }
	        else {
	            message.server = message.prefix;
	        }
	    }

	    // Parse command
	    match = line.match(/^([^ ]+) */);
	    message.command = match[1];
	    message.rawCommand = match[1];
	    message.commandType = 'normal';
	    line = line.replace(/^[^ ]+ +/, '');

	    var codeData = replyFor[message.rawCommand];
	    if (codeData) {
	        if ('name' in codeData) message.command = codeData.name;
	        message.commandType = codeData.type;
	    }

	    message.args = [];
	    var middle, trailing;

	    // Parse parameters
	    if (line.search(/^:|\s+:/) !== -1) {
	        match = line.match(/(.*?)(?:^:|\s+:)(.*)/);
	        middle = match[1].trimRight();
	        trailing = match[2];
	    }
	    else {
	        middle = line;
	    }

	    if (middle.length)
	        message.args = middle.split(/ +/);

	    if (typeof trailing !== 'undefined' && trailing.length)
	        message.args.push(trailing);

	    return message;
	};

	var util$2 = require$$2$1;
	var EventEmitter$6 = require$$1$2;

	/**
	 * This class encapsulates the ping timeout functionality.
	 * When enough silence (lack of server-sent activity) passes, an object of this type will emit a 'wantPing' event, indicating you should send a PING message to the server in order to get some signs of life from it.
	 * If enough time passes after that (i.e. server does not respond to PING), then an object of this type will emit a 'pingTimeout' event.
	 *
	 * To start the gears turning, call start() on an instance of this class to put it in the 'started' state.
	 *
	 * When server-side activity occurs, call notifyOfActivity() on the object.
	 *
	 * When a pingTimeout occurs, the object will go into the 'stopped' state.
	 */
	var ctr = 0;

	function CyclingPingTimer$1(client) {
	    var self = this;
	    self.timerNumber = ctr++;
	    self.started = false;

	    // Only one of these two should be non-null at any given time.
	    self.loopingTimeout = null;
	    self.pingWaitTimeout = null;

	    // conditionally log debug messages
	    function debug(msg) {
	        client.out.debug('CyclingPingTimer ' + self.timerNumber + ':', msg);
	    }

	    // set up EventEmitter functionality
	    EventEmitter$6.call(self);

	    self.on('wantPing', function() {
	        debug('server silent for too long, let\'s send a PING');
	        self.pingWaitTimeout = setTimeout(function() {
	            self.stop();
	            debug('ping timeout!');
	            self.emit('pingTimeout');
	        }, client.opt.millisecondsBeforePingTimeout);
	    });

	    self.notifyOfActivity = function() {
	        if (self.started) {
	            _stop();
	            _start();
	        }
	    };

	    self.stop = function() {
	        if (!self.started) {
	            return;
	        }
	        debug('ping timer stopped');
	        _stop();
	    };
	    function _stop() {
	        self.started = false;

	        clearTimeout(self.loopingTimeout);
	        clearTimeout(self.pingWaitTimeout);

	        self.loopingTimeout = null;
	        self.pingWaitTimeout = null;
	    }

	    self.start = function() {
	        if (self.started) {
	            debug('can\'t start, not stopped!');
	            return;
	        }
	        debug('ping timer started');
	        _start();
	    };
	    function _start() {
	        self.started = true;

	        self.loopingTimeout = setTimeout(function() {
	            self.loopingTimeout = null;
	            self.emit('wantPing');
	        }, client.opt.millisecondsOfSilenceBeforePingSent);
	    }
	}

	util$2.inherits(CyclingPingTimer$1, EventEmitter$6);

	var cycling_ping_timer = CyclingPingTimer$1;

	var lib$1 = {exports: {}};

	var require$$0$2 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_buffer);

	var safer_1;
	var hasRequiredSafer;

	function requireSafer () {
		if (hasRequiredSafer) return safer_1;
		hasRequiredSafer = 1;

		var buffer = require$$0$2;
		var Buffer = buffer.Buffer;

		var safer = {};

		var key;

		for (key in buffer) {
		  if (!buffer.hasOwnProperty(key)) continue
		  if (key === 'SlowBuffer' || key === 'Buffer') continue
		  safer[key] = buffer[key];
		}

		var Safer = safer.Buffer = {};
		for (key in Buffer) {
		  if (!Buffer.hasOwnProperty(key)) continue
		  if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue
		  Safer[key] = Buffer[key];
		}

		safer.Buffer.prototype = Buffer.prototype;

		if (!Safer.from || Safer.from === Uint8Array.from) {
		  Safer.from = function (value, encodingOrOffset, length) {
		    if (typeof value === 'number') {
		      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value)
		    }
		    if (value && typeof value.length === 'undefined') {
		      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value)
		    }
		    return Buffer(value, encodingOrOffset, length)
		  };
		}

		if (!Safer.alloc) {
		  Safer.alloc = function (size, fill, encoding) {
		    if (typeof size !== 'number') {
		      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
		    }
		    if (size < 0 || size >= 2 * (1 << 30)) {
		      throw new RangeError('The value "' + size + '" is invalid for option "size"')
		    }
		    var buf = Buffer(size);
		    if (!fill || fill.length === 0) {
		      buf.fill(0);
		    } else if (typeof encoding === 'string') {
		      buf.fill(fill, encoding);
		    } else {
		      buf.fill(fill);
		    }
		    return buf
		  };
		}

		if (!safer.kStringMaxLength) {
		  try {
		    safer.kStringMaxLength = browser$1$1.binding('buffer').kStringMaxLength;
		  } catch (e) {
		    // we can't determine kStringMaxLength in environments where process.binding
		    // is unsupported, so let's not set it
		  }
		}

		if (!safer.constants) {
		  safer.constants = {
		    MAX_LENGTH: safer.kMaxLength
		  };
		  if (safer.kStringMaxLength) {
		    safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
		  }
		}

		safer_1 = safer;
		return safer_1;
	}

	var bomHandling = {};

	var hasRequiredBomHandling;

	function requireBomHandling () {
		if (hasRequiredBomHandling) return bomHandling;
		hasRequiredBomHandling = 1;

		var BOMChar = '\uFEFF';

		bomHandling.PrependBOM = PrependBOMWrapper;
		function PrependBOMWrapper(encoder, options) {
		    this.encoder = encoder;
		    this.addBOM = true;
		}

		PrependBOMWrapper.prototype.write = function(str) {
		    if (this.addBOM) {
		        str = BOMChar + str;
		        this.addBOM = false;
		    }

		    return this.encoder.write(str);
		};

		PrependBOMWrapper.prototype.end = function() {
		    return this.encoder.end();
		};


		//------------------------------------------------------------------------------

		bomHandling.StripBOM = StripBOMWrapper;
		function StripBOMWrapper(decoder, options) {
		    this.decoder = decoder;
		    this.pass = false;
		    this.options = options || {};
		}

		StripBOMWrapper.prototype.write = function(buf) {
		    var res = this.decoder.write(buf);
		    if (this.pass || !res)
		        return res;

		    if (res[0] === BOMChar) {
		        res = res.slice(1);
		        if (typeof this.options.stripBOM === 'function')
		            this.options.stripBOM();
		    }

		    this.pass = true;
		    return res;
		};

		StripBOMWrapper.prototype.end = function() {
		    return this.decoder.end();
		};
		return bomHandling;
	}

	var encodings = {};

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     };


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	function StringDecoder(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	}

	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}

	var _polyfillNode_string_decoder = /*#__PURE__*/Object.freeze({
		__proto__: null,
		StringDecoder: StringDecoder
	});

	var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_string_decoder);

	var internal;
	var hasRequiredInternal;

	function requireInternal () {
		if (hasRequiredInternal) return internal;
		hasRequiredInternal = 1;
		var Buffer = requireSafer().Buffer;

		// Export Node.js internal encodings.

		internal = {
		    // Encodings
		    utf8:   { type: "_internal", bomAware: true},
		    cesu8:  { type: "_internal", bomAware: true},
		    unicode11utf8: "utf8",

		    ucs2:   { type: "_internal", bomAware: true},
		    utf16le: "ucs2",

		    binary: { type: "_internal" },
		    base64: { type: "_internal" },
		    hex:    { type: "_internal" },

		    // Codec.
		    _internal: InternalCodec,
		};

		//------------------------------------------------------------------------------

		function InternalCodec(codecOptions, iconv) {
		    this.enc = codecOptions.encodingName;
		    this.bomAware = codecOptions.bomAware;

		    if (this.enc === "base64")
		        this.encoder = InternalEncoderBase64;
		    else if (this.enc === "cesu8") {
		        this.enc = "utf8"; // Use utf8 for decoding.
		        this.encoder = InternalEncoderCesu8;

		        // Add decoder for versions of Node not supporting CESU-8
		        if (Buffer.from('eda0bdedb2a9', 'hex').toString() !== '💩') {
		            this.decoder = InternalDecoderCesu8;
		            this.defaultCharUnicode = iconv.defaultCharUnicode;
		        }
		    }
		}

		InternalCodec.prototype.encoder = InternalEncoder;
		InternalCodec.prototype.decoder = InternalDecoder;

		//------------------------------------------------------------------------------

		// We use node.js internal decoder. Its signature is the same as ours.
		var StringDecoder = require$$1$1.StringDecoder;

		if (!StringDecoder.prototype.end) // Node v0.8 doesn't have this method.
		    StringDecoder.prototype.end = function() {};


		function InternalDecoder(options, codec) {
		    this.decoder = new StringDecoder(codec.enc);
		}

		InternalDecoder.prototype.write = function(buf) {
		    if (!Buffer.isBuffer(buf)) {
		        buf = Buffer.from(buf);
		    }

		    return this.decoder.write(buf);
		};

		InternalDecoder.prototype.end = function() {
		    return this.decoder.end();
		};


		//------------------------------------------------------------------------------
		// Encoder is mostly trivial

		function InternalEncoder(options, codec) {
		    this.enc = codec.enc;
		}

		InternalEncoder.prototype.write = function(str) {
		    return Buffer.from(str, this.enc);
		};

		InternalEncoder.prototype.end = function() {
		};


		//------------------------------------------------------------------------------
		// Except base64 encoder, which must keep its state.

		function InternalEncoderBase64(options, codec) {
		    this.prevStr = '';
		}

		InternalEncoderBase64.prototype.write = function(str) {
		    str = this.prevStr + str;
		    var completeQuads = str.length - (str.length % 4);
		    this.prevStr = str.slice(completeQuads);
		    str = str.slice(0, completeQuads);

		    return Buffer.from(str, "base64");
		};

		InternalEncoderBase64.prototype.end = function() {
		    return Buffer.from(this.prevStr, "base64");
		};


		//------------------------------------------------------------------------------
		// CESU-8 encoder is also special.

		function InternalEncoderCesu8(options, codec) {
		}

		InternalEncoderCesu8.prototype.write = function(str) {
		    var buf = Buffer.alloc(str.length * 3), bufIdx = 0;
		    for (var i = 0; i < str.length; i++) {
		        var charCode = str.charCodeAt(i);
		        // Naive implementation, but it works because CESU-8 is especially easy
		        // to convert from UTF-16 (which all JS strings are encoded in).
		        if (charCode < 0x80)
		            buf[bufIdx++] = charCode;
		        else if (charCode < 0x800) {
		            buf[bufIdx++] = 0xC0 + (charCode >>> 6);
		            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
		        }
		        else { // charCode will always be < 0x10000 in javascript.
		            buf[bufIdx++] = 0xE0 + (charCode >>> 12);
		            buf[bufIdx++] = 0x80 + ((charCode >>> 6) & 0x3f);
		            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
		        }
		    }
		    return buf.slice(0, bufIdx);
		};

		InternalEncoderCesu8.prototype.end = function() {
		};

		//------------------------------------------------------------------------------
		// CESU-8 decoder is not implemented in Node v4.0+

		function InternalDecoderCesu8(options, codec) {
		    this.acc = 0;
		    this.contBytes = 0;
		    this.accBytes = 0;
		    this.defaultCharUnicode = codec.defaultCharUnicode;
		}

		InternalDecoderCesu8.prototype.write = function(buf) {
		    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, 
		        res = '';
		    for (var i = 0; i < buf.length; i++) {
		        var curByte = buf[i];
		        if ((curByte & 0xC0) !== 0x80) { // Leading byte
		            if (contBytes > 0) { // Previous code is invalid
		                res += this.defaultCharUnicode;
		                contBytes = 0;
		            }

		            if (curByte < 0x80) { // Single-byte code
		                res += String.fromCharCode(curByte);
		            } else if (curByte < 0xE0) { // Two-byte code
		                acc = curByte & 0x1F;
		                contBytes = 1; accBytes = 1;
		            } else if (curByte < 0xF0) { // Three-byte code
		                acc = curByte & 0x0F;
		                contBytes = 2; accBytes = 1;
		            } else { // Four or more are not supported for CESU-8.
		                res += this.defaultCharUnicode;
		            }
		        } else { // Continuation byte
		            if (contBytes > 0) { // We're waiting for it.
		                acc = (acc << 6) | (curByte & 0x3f);
		                contBytes--; accBytes++;
		                if (contBytes === 0) {
		                    // Check for overlong encoding, but support Modified UTF-8 (encoding NULL as C0 80)
		                    if (accBytes === 2 && acc < 0x80 && acc > 0)
		                        res += this.defaultCharUnicode;
		                    else if (accBytes === 3 && acc < 0x800)
		                        res += this.defaultCharUnicode;
		                    else
		                        // Actually add character.
		                        res += String.fromCharCode(acc);
		                }
		            } else { // Unexpected continuation byte
		                res += this.defaultCharUnicode;
		            }
		        }
		    }
		    this.acc = acc; this.contBytes = contBytes; this.accBytes = accBytes;
		    return res;
		};

		InternalDecoderCesu8.prototype.end = function() {
		    var res = 0;
		    if (this.contBytes > 0)
		        res += this.defaultCharUnicode;
		    return res;
		};
		return internal;
	}

	var utf32 = {};

	var hasRequiredUtf32;

	function requireUtf32 () {
		if (hasRequiredUtf32) return utf32;
		hasRequiredUtf32 = 1;

		var Buffer = requireSafer().Buffer;

		// == UTF32-LE/BE codec. ==========================================================

		utf32._utf32 = Utf32Codec;

		function Utf32Codec(codecOptions, iconv) {
		    this.iconv = iconv;
		    this.bomAware = true;
		    this.isLE = codecOptions.isLE;
		}

		utf32.utf32le = { type: '_utf32', isLE: true };
		utf32.utf32be = { type: '_utf32', isLE: false };

		// Aliases
		utf32.ucs4le = 'utf32le';
		utf32.ucs4be = 'utf32be';

		Utf32Codec.prototype.encoder = Utf32Encoder;
		Utf32Codec.prototype.decoder = Utf32Decoder;

		// -- Encoding

		function Utf32Encoder(options, codec) {
		    this.isLE = codec.isLE;
		    this.highSurrogate = 0;
		}

		Utf32Encoder.prototype.write = function(str) {
		    var src = Buffer.from(str, 'ucs2');
		    var dst = Buffer.alloc(src.length * 2);
		    var write32 = this.isLE ? dst.writeUInt32LE : dst.writeUInt32BE;
		    var offset = 0;

		    for (var i = 0; i < src.length; i += 2) {
		        var code = src.readUInt16LE(i);
		        var isHighSurrogate = (0xD800 <= code && code < 0xDC00);
		        var isLowSurrogate = (0xDC00 <= code && code < 0xE000);

		        if (this.highSurrogate) {
		            if (isHighSurrogate || !isLowSurrogate) {
		                // There shouldn't be two high surrogates in a row, nor a high surrogate which isn't followed by a low
		                // surrogate. If this happens, keep the pending high surrogate as a stand-alone semi-invalid character
		                // (technically wrong, but expected by some applications, like Windows file names).
		                write32.call(dst, this.highSurrogate, offset);
		                offset += 4;
		            }
		            else {
		                // Create 32-bit value from high and low surrogates;
		                var codepoint = (((this.highSurrogate - 0xD800) << 10) | (code - 0xDC00)) + 0x10000;

		                write32.call(dst, codepoint, offset);
		                offset += 4;
		                this.highSurrogate = 0;

		                continue;
		            }
		        }

		        if (isHighSurrogate)
		            this.highSurrogate = code;
		        else {
		            // Even if the current character is a low surrogate, with no previous high surrogate, we'll
		            // encode it as a semi-invalid stand-alone character for the same reasons expressed above for
		            // unpaired high surrogates.
		            write32.call(dst, code, offset);
		            offset += 4;
		            this.highSurrogate = 0;
		        }
		    }

		    if (offset < dst.length)
		        dst = dst.slice(0, offset);

		    return dst;
		};

		Utf32Encoder.prototype.end = function() {
		    // Treat any leftover high surrogate as a semi-valid independent character.
		    if (!this.highSurrogate)
		        return;

		    var buf = Buffer.alloc(4);

		    if (this.isLE)
		        buf.writeUInt32LE(this.highSurrogate, 0);
		    else
		        buf.writeUInt32BE(this.highSurrogate, 0);

		    this.highSurrogate = 0;

		    return buf;
		};

		// -- Decoding

		function Utf32Decoder(options, codec) {
		    this.isLE = codec.isLE;
		    this.badChar = codec.iconv.defaultCharUnicode.charCodeAt(0);
		    this.overflow = [];
		}

		Utf32Decoder.prototype.write = function(src) {
		    if (src.length === 0)
		        return '';

		    var i = 0;
		    var codepoint = 0;
		    var dst = Buffer.alloc(src.length + 4);
		    var offset = 0;
		    var isLE = this.isLE;
		    var overflow = this.overflow;
		    var badChar = this.badChar;

		    if (overflow.length > 0) {
		        for (; i < src.length && overflow.length < 4; i++)
		            overflow.push(src[i]);
		        
		        if (overflow.length === 4) {
		            // NOTE: codepoint is a signed int32 and can be negative.
		            // NOTE: We copied this block from below to help V8 optimize it (it works with array, not buffer).
		            if (isLE) {
		                codepoint = overflow[i] | (overflow[i+1] << 8) | (overflow[i+2] << 16) | (overflow[i+3] << 24);
		            } else {
		                codepoint = overflow[i+3] | (overflow[i+2] << 8) | (overflow[i+1] << 16) | (overflow[i] << 24);
		            }
		            overflow.length = 0;

		            offset = _writeCodepoint(dst, offset, codepoint, badChar);
		        }
		    }

		    // Main loop. Should be as optimized as possible.
		    for (; i < src.length - 3; i += 4) {
		        // NOTE: codepoint is a signed int32 and can be negative.
		        if (isLE) {
		            codepoint = src[i] | (src[i+1] << 8) | (src[i+2] << 16) | (src[i+3] << 24);
		        } else {
		            codepoint = src[i+3] | (src[i+2] << 8) | (src[i+1] << 16) | (src[i] << 24);
		        }
		        offset = _writeCodepoint(dst, offset, codepoint, badChar);
		    }

		    // Keep overflowing bytes.
		    for (; i < src.length; i++) {
		        overflow.push(src[i]);
		    }

		    return dst.slice(0, offset).toString('ucs2');
		};

		function _writeCodepoint(dst, offset, codepoint, badChar) {
		    // NOTE: codepoint is signed int32 and can be negative. We keep it that way to help V8 with optimizations.
		    if (codepoint < 0 || codepoint > 0x10FFFF) {
		        // Not a valid Unicode codepoint
		        codepoint = badChar;
		    } 

		    // Ephemeral Planes: Write high surrogate.
		    if (codepoint >= 0x10000) {
		        codepoint -= 0x10000;

		        var high = 0xD800 | (codepoint >> 10);
		        dst[offset++] = high & 0xff;
		        dst[offset++] = high >> 8;

		        // Low surrogate is written below.
		        var codepoint = 0xDC00 | (codepoint & 0x3FF);
		    }

		    // Write BMP char or low surrogate.
		    dst[offset++] = codepoint & 0xff;
		    dst[offset++] = codepoint >> 8;

		    return offset;
		}
		Utf32Decoder.prototype.end = function() {
		    this.overflow.length = 0;
		};

		// == UTF-32 Auto codec =============================================================
		// Decoder chooses automatically from UTF-32LE and UTF-32BE using BOM and space-based heuristic.
		// Defaults to UTF-32LE. http://en.wikipedia.org/wiki/UTF-32
		// Encoder/decoder default can be changed: iconv.decode(buf, 'utf32', {defaultEncoding: 'utf-32be'});

		// Encoder prepends BOM (which can be overridden with (addBOM: false}).

		utf32.utf32 = Utf32AutoCodec;
		utf32.ucs4 = 'utf32';

		function Utf32AutoCodec(options, iconv) {
		    this.iconv = iconv;
		}

		Utf32AutoCodec.prototype.encoder = Utf32AutoEncoder;
		Utf32AutoCodec.prototype.decoder = Utf32AutoDecoder;

		// -- Encoding

		function Utf32AutoEncoder(options, codec) {
		    options = options || {};

		    if (options.addBOM === undefined)
		        options.addBOM = true;

		    this.encoder = codec.iconv.getEncoder(options.defaultEncoding || 'utf-32le', options);
		}

		Utf32AutoEncoder.prototype.write = function(str) {
		    return this.encoder.write(str);
		};

		Utf32AutoEncoder.prototype.end = function() {
		    return this.encoder.end();
		};

		// -- Decoding

		function Utf32AutoDecoder(options, codec) {
		    this.decoder = null;
		    this.initialBufs = [];
		    this.initialBufsLen = 0;
		    this.options = options || {};
		    this.iconv = codec.iconv;
		}

		Utf32AutoDecoder.prototype.write = function(buf) {
		    if (!this.decoder) { 
		        // Codec is not chosen yet. Accumulate initial bytes.
		        this.initialBufs.push(buf);
		        this.initialBufsLen += buf.length;

		        if (this.initialBufsLen < 32) // We need more bytes to use space heuristic (see below)
		            return '';

		        // We have enough bytes -> detect endianness.
		        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
		        this.decoder = this.iconv.getDecoder(encoding, this.options);

		        var resStr = '';
		        for (var i = 0; i < this.initialBufs.length; i++)
		            resStr += this.decoder.write(this.initialBufs[i]);

		        this.initialBufs.length = this.initialBufsLen = 0;
		        return resStr;
		    }

		    return this.decoder.write(buf);
		};

		Utf32AutoDecoder.prototype.end = function() {
		    if (!this.decoder) {
		        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
		        this.decoder = this.iconv.getDecoder(encoding, this.options);

		        var resStr = '';
		        for (var i = 0; i < this.initialBufs.length; i++)
		            resStr += this.decoder.write(this.initialBufs[i]);

		        var trail = this.decoder.end();
		        if (trail)
		            resStr += trail;

		        this.initialBufs.length = this.initialBufsLen = 0;
		        return resStr;
		    }

		    return this.decoder.end();
		};

		function detectEncoding(bufs, defaultEncoding) {
		    var b = [];
		    var charsProcessed = 0;
		    var invalidLE = 0, invalidBE = 0;   // Number of invalid chars when decoded as LE or BE.
		    var bmpCharsLE = 0, bmpCharsBE = 0; // Number of BMP chars when decoded as LE or BE.

		    outer_loop:
		    for (var i = 0; i < bufs.length; i++) {
		        var buf = bufs[i];
		        for (var j = 0; j < buf.length; j++) {
		            b.push(buf[j]);
		            if (b.length === 4) {
		                if (charsProcessed === 0) {
		                    // Check BOM first.
		                    if (b[0] === 0xFF && b[1] === 0xFE && b[2] === 0 && b[3] === 0) {
		                        return 'utf-32le';
		                    }
		                    if (b[0] === 0 && b[1] === 0 && b[2] === 0xFE && b[3] === 0xFF) {
		                        return 'utf-32be';
		                    }
		                }

		                if (b[0] !== 0 || b[1] > 0x10) invalidBE++;
		                if (b[3] !== 0 || b[2] > 0x10) invalidLE++;

		                if (b[0] === 0 && b[1] === 0 && (b[2] !== 0 || b[3] !== 0)) bmpCharsBE++;
		                if ((b[0] !== 0 || b[1] !== 0) && b[2] === 0 && b[3] === 0) bmpCharsLE++;

		                b.length = 0;
		                charsProcessed++;

		                if (charsProcessed >= 100) {
		                    break outer_loop;
		                }
		            }
		        }
		    }

		    // Make decisions.
		    if (bmpCharsBE - invalidBE > bmpCharsLE - invalidLE)  return 'utf-32be';
		    if (bmpCharsBE - invalidBE < bmpCharsLE - invalidLE)  return 'utf-32le';

		    // Couldn't decide (likely all zeros or not enough data).
		    return defaultEncoding || 'utf-32le';
		}
		return utf32;
	}

	var utf16 = {};

	var hasRequiredUtf16;

	function requireUtf16 () {
		if (hasRequiredUtf16) return utf16;
		hasRequiredUtf16 = 1;
		var Buffer = requireSafer().Buffer;

		// Note: UTF16-LE (or UCS2) codec is Node.js native. See encodings/internal.js

		// == UTF16-BE codec. ==========================================================

		utf16.utf16be = Utf16BECodec;
		function Utf16BECodec() {
		}

		Utf16BECodec.prototype.encoder = Utf16BEEncoder;
		Utf16BECodec.prototype.decoder = Utf16BEDecoder;
		Utf16BECodec.prototype.bomAware = true;


		// -- Encoding

		function Utf16BEEncoder() {
		}

		Utf16BEEncoder.prototype.write = function(str) {
		    var buf = Buffer.from(str, 'ucs2');
		    for (var i = 0; i < buf.length; i += 2) {
		        var tmp = buf[i]; buf[i] = buf[i+1]; buf[i+1] = tmp;
		    }
		    return buf;
		};

		Utf16BEEncoder.prototype.end = function() {
		};


		// -- Decoding

		function Utf16BEDecoder() {
		    this.overflowByte = -1;
		}

		Utf16BEDecoder.prototype.write = function(buf) {
		    if (buf.length == 0)
		        return '';

		    var buf2 = Buffer.alloc(buf.length + 1),
		        i = 0, j = 0;

		    if (this.overflowByte !== -1) {
		        buf2[0] = buf[0];
		        buf2[1] = this.overflowByte;
		        i = 1; j = 2;
		    }

		    for (; i < buf.length-1; i += 2, j+= 2) {
		        buf2[j] = buf[i+1];
		        buf2[j+1] = buf[i];
		    }

		    this.overflowByte = (i == buf.length-1) ? buf[buf.length-1] : -1;

		    return buf2.slice(0, j).toString('ucs2');
		};

		Utf16BEDecoder.prototype.end = function() {
		    this.overflowByte = -1;
		};


		// == UTF-16 codec =============================================================
		// Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
		// Defaults to UTF-16LE, as it's prevalent and default in Node.
		// http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
		// Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});

		// Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).

		utf16.utf16 = Utf16Codec;
		function Utf16Codec(codecOptions, iconv) {
		    this.iconv = iconv;
		}

		Utf16Codec.prototype.encoder = Utf16Encoder;
		Utf16Codec.prototype.decoder = Utf16Decoder;


		// -- Encoding (pass-through)

		function Utf16Encoder(options, codec) {
		    options = options || {};
		    if (options.addBOM === undefined)
		        options.addBOM = true;
		    this.encoder = codec.iconv.getEncoder('utf-16le', options);
		}

		Utf16Encoder.prototype.write = function(str) {
		    return this.encoder.write(str);
		};

		Utf16Encoder.prototype.end = function() {
		    return this.encoder.end();
		};


		// -- Decoding

		function Utf16Decoder(options, codec) {
		    this.decoder = null;
		    this.initialBufs = [];
		    this.initialBufsLen = 0;

		    this.options = options || {};
		    this.iconv = codec.iconv;
		}

		Utf16Decoder.prototype.write = function(buf) {
		    if (!this.decoder) {
		        // Codec is not chosen yet. Accumulate initial bytes.
		        this.initialBufs.push(buf);
		        this.initialBufsLen += buf.length;
		        
		        if (this.initialBufsLen < 16) // We need more bytes to use space heuristic (see below)
		            return '';

		        // We have enough bytes -> detect endianness.
		        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
		        this.decoder = this.iconv.getDecoder(encoding, this.options);

		        var resStr = '';
		        for (var i = 0; i < this.initialBufs.length; i++)
		            resStr += this.decoder.write(this.initialBufs[i]);

		        this.initialBufs.length = this.initialBufsLen = 0;
		        return resStr;
		    }

		    return this.decoder.write(buf);
		};

		Utf16Decoder.prototype.end = function() {
		    if (!this.decoder) {
		        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
		        this.decoder = this.iconv.getDecoder(encoding, this.options);

		        var resStr = '';
		        for (var i = 0; i < this.initialBufs.length; i++)
		            resStr += this.decoder.write(this.initialBufs[i]);

		        var trail = this.decoder.end();
		        if (trail)
		            resStr += trail;

		        this.initialBufs.length = this.initialBufsLen = 0;
		        return resStr;
		    }
		    return this.decoder.end();
		};

		function detectEncoding(bufs, defaultEncoding) {
		    var b = [];
		    var charsProcessed = 0;
		    var asciiCharsLE = 0, asciiCharsBE = 0; // Number of ASCII chars when decoded as LE or BE.

		    outer_loop:
		    for (var i = 0; i < bufs.length; i++) {
		        var buf = bufs[i];
		        for (var j = 0; j < buf.length; j++) {
		            b.push(buf[j]);
		            if (b.length === 2) {
		                if (charsProcessed === 0) {
		                    // Check BOM first.
		                    if (b[0] === 0xFF && b[1] === 0xFE) return 'utf-16le';
		                    if (b[0] === 0xFE && b[1] === 0xFF) return 'utf-16be';
		                }

		                if (b[0] === 0 && b[1] !== 0) asciiCharsBE++;
		                if (b[0] !== 0 && b[1] === 0) asciiCharsLE++;

		                b.length = 0;
		                charsProcessed++;

		                if (charsProcessed >= 100) {
		                    break outer_loop;
		                }
		            }
		        }
		    }

		    // Make decisions.
		    // Most of the time, the content has ASCII chars (U+00**), but the opposite (U+**00) is uncommon.
		    // So, we count ASCII as if it was LE or BE, and decide from that.
		    if (asciiCharsBE > asciiCharsLE) return 'utf-16be';
		    if (asciiCharsBE < asciiCharsLE) return 'utf-16le';

		    // Couldn't decide (likely all zeros or not enough data).
		    return defaultEncoding || 'utf-16le';
		}
		return utf16;
	}

	var utf7 = {};

	var hasRequiredUtf7;

	function requireUtf7 () {
		if (hasRequiredUtf7) return utf7;
		hasRequiredUtf7 = 1;
		var Buffer = requireSafer().Buffer;

		// UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
		// See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3

		utf7.utf7 = Utf7Codec;
		utf7.unicode11utf7 = 'utf7'; // Alias UNICODE-1-1-UTF-7
		function Utf7Codec(codecOptions, iconv) {
		    this.iconv = iconv;
		}
		Utf7Codec.prototype.encoder = Utf7Encoder;
		Utf7Codec.prototype.decoder = Utf7Decoder;
		Utf7Codec.prototype.bomAware = true;


		// -- Encoding

		var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;

		function Utf7Encoder(options, codec) {
		    this.iconv = codec.iconv;
		}

		Utf7Encoder.prototype.write = function(str) {
		    // Naive implementation.
		    // Non-direct chars are encoded as "+<base64>-"; single "+" char is encoded as "+-".
		    return Buffer.from(str.replace(nonDirectChars, function(chunk) {
		        return "+" + (chunk === '+' ? '' : 
		            this.iconv.encode(chunk, 'utf16-be').toString('base64').replace(/=+$/, '')) 
		            + "-";
		    }.bind(this)));
		};

		Utf7Encoder.prototype.end = function() {
		};


		// -- Decoding

		function Utf7Decoder(options, codec) {
		    this.iconv = codec.iconv;
		    this.inBase64 = false;
		    this.base64Accum = '';
		}

		var base64Regex = /[A-Za-z0-9\/+]/;
		var base64Chars = [];
		for (var i = 0; i < 256; i++)
		    base64Chars[i] = base64Regex.test(String.fromCharCode(i));

		var plusChar = '+'.charCodeAt(0), 
		    minusChar = '-'.charCodeAt(0),
		    andChar = '&'.charCodeAt(0);

		Utf7Decoder.prototype.write = function(buf) {
		    var res = "", lastI = 0,
		        inBase64 = this.inBase64,
		        base64Accum = this.base64Accum;

		    // The decoder is more involved as we must handle chunks in stream.

		    for (var i = 0; i < buf.length; i++) {
		        if (!inBase64) { // We're in direct mode.
		            // Write direct chars until '+'
		            if (buf[i] == plusChar) {
		                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
		                lastI = i+1;
		                inBase64 = true;
		            }
		        } else { // We decode base64.
		            if (!base64Chars[buf[i]]) { // Base64 ended.
		                if (i == lastI && buf[i] == minusChar) {// "+-" -> "+"
		                    res += "+";
		                } else {
		                    var b64str = base64Accum + this.iconv.decode(buf.slice(lastI, i), "ascii");
		                    res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
		                }

		                if (buf[i] != minusChar) // Minus is absorbed after base64.
		                    i--;

		                lastI = i+1;
		                inBase64 = false;
		                base64Accum = '';
		            }
		        }
		    }

		    if (!inBase64) {
		        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
		    } else {
		        var b64str = base64Accum + this.iconv.decode(buf.slice(lastI), "ascii");

		        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
		        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
		        b64str = b64str.slice(0, canBeDecoded);

		        res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
		    }

		    this.inBase64 = inBase64;
		    this.base64Accum = base64Accum;

		    return res;
		};

		Utf7Decoder.prototype.end = function() {
		    var res = "";
		    if (this.inBase64 && this.base64Accum.length > 0)
		        res = this.iconv.decode(Buffer.from(this.base64Accum, 'base64'), "utf16-be");

		    this.inBase64 = false;
		    this.base64Accum = '';
		    return res;
		};


		// UTF-7-IMAP codec.
		// RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
		// Differences:
		//  * Base64 part is started by "&" instead of "+"
		//  * Direct characters are 0x20-0x7E, except "&" (0x26)
		//  * In Base64, "," is used instead of "/"
		//  * Base64 must not be used to represent direct characters.
		//  * No implicit shift back from Base64 (should always end with '-')
		//  * String must end in non-shifted position.
		//  * "-&" while in base64 is not allowed.


		utf7.utf7imap = Utf7IMAPCodec;
		function Utf7IMAPCodec(codecOptions, iconv) {
		    this.iconv = iconv;
		}
		Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
		Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
		Utf7IMAPCodec.prototype.bomAware = true;


		// -- Encoding

		function Utf7IMAPEncoder(options, codec) {
		    this.iconv = codec.iconv;
		    this.inBase64 = false;
		    this.base64Accum = Buffer.alloc(6);
		    this.base64AccumIdx = 0;
		}

		Utf7IMAPEncoder.prototype.write = function(str) {
		    var inBase64 = this.inBase64,
		        base64Accum = this.base64Accum,
		        base64AccumIdx = this.base64AccumIdx,
		        buf = Buffer.alloc(str.length*5 + 10), bufIdx = 0;

		    for (var i = 0; i < str.length; i++) {
		        var uChar = str.charCodeAt(i);
		        if (0x20 <= uChar && uChar <= 0x7E) { // Direct character or '&'.
		            if (inBase64) {
		                if (base64AccumIdx > 0) {
		                    bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
		                    base64AccumIdx = 0;
		                }

		                buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
		                inBase64 = false;
		            }

		            if (!inBase64) {
		                buf[bufIdx++] = uChar; // Write direct character

		                if (uChar === andChar)  // Ampersand -> '&-'
		                    buf[bufIdx++] = minusChar;
		            }

		        } else { // Non-direct character
		            if (!inBase64) {
		                buf[bufIdx++] = andChar; // Write '&', then go to base64 mode.
		                inBase64 = true;
		            }
		            if (inBase64) {
		                base64Accum[base64AccumIdx++] = uChar >> 8;
		                base64Accum[base64AccumIdx++] = uChar & 0xFF;

		                if (base64AccumIdx == base64Accum.length) {
		                    bufIdx += buf.write(base64Accum.toString('base64').replace(/\//g, ','), bufIdx);
		                    base64AccumIdx = 0;
		                }
		            }
		        }
		    }

		    this.inBase64 = inBase64;
		    this.base64AccumIdx = base64AccumIdx;

		    return buf.slice(0, bufIdx);
		};

		Utf7IMAPEncoder.prototype.end = function() {
		    var buf = Buffer.alloc(10), bufIdx = 0;
		    if (this.inBase64) {
		        if (this.base64AccumIdx > 0) {
		            bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
		            this.base64AccumIdx = 0;
		        }

		        buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
		        this.inBase64 = false;
		    }

		    return buf.slice(0, bufIdx);
		};


		// -- Decoding

		function Utf7IMAPDecoder(options, codec) {
		    this.iconv = codec.iconv;
		    this.inBase64 = false;
		    this.base64Accum = '';
		}

		var base64IMAPChars = base64Chars.slice();
		base64IMAPChars[','.charCodeAt(0)] = true;

		Utf7IMAPDecoder.prototype.write = function(buf) {
		    var res = "", lastI = 0,
		        inBase64 = this.inBase64,
		        base64Accum = this.base64Accum;

		    // The decoder is more involved as we must handle chunks in stream.
		    // It is forgiving, closer to standard UTF-7 (for example, '-' is optional at the end).

		    for (var i = 0; i < buf.length; i++) {
		        if (!inBase64) { // We're in direct mode.
		            // Write direct chars until '&'
		            if (buf[i] == andChar) {
		                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
		                lastI = i+1;
		                inBase64 = true;
		            }
		        } else { // We decode base64.
		            if (!base64IMAPChars[buf[i]]) { // Base64 ended.
		                if (i == lastI && buf[i] == minusChar) { // "&-" -> "&"
		                    res += "&";
		                } else {
		                    var b64str = base64Accum + this.iconv.decode(buf.slice(lastI, i), "ascii").replace(/,/g, '/');
		                    res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
		                }

		                if (buf[i] != minusChar) // Minus may be absorbed after base64.
		                    i--;

		                lastI = i+1;
		                inBase64 = false;
		                base64Accum = '';
		            }
		        }
		    }

		    if (!inBase64) {
		        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
		    } else {
		        var b64str = base64Accum + this.iconv.decode(buf.slice(lastI), "ascii").replace(/,/g, '/');

		        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
		        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
		        b64str = b64str.slice(0, canBeDecoded);

		        res += this.iconv.decode(Buffer.from(b64str, 'base64'), "utf16-be");
		    }

		    this.inBase64 = inBase64;
		    this.base64Accum = base64Accum;

		    return res;
		};

		Utf7IMAPDecoder.prototype.end = function() {
		    var res = "";
		    if (this.inBase64 && this.base64Accum.length > 0)
		        res = this.iconv.decode(Buffer.from(this.base64Accum, 'base64'), "utf16-be");

		    this.inBase64 = false;
		    this.base64Accum = '';
		    return res;
		};
		return utf7;
	}

	var sbcsCodec = {};

	var hasRequiredSbcsCodec;

	function requireSbcsCodec () {
		if (hasRequiredSbcsCodec) return sbcsCodec;
		hasRequiredSbcsCodec = 1;
		var Buffer = requireSafer().Buffer;

		// Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
		// correspond to encoded bytes (if 128 - then lower half is ASCII). 

		sbcsCodec._sbcs = SBCSCodec;
		function SBCSCodec(codecOptions, iconv) {
		    if (!codecOptions)
		        throw new Error("SBCS codec is called without the data.")
		    
		    // Prepare char buffer for decoding.
		    if (!codecOptions.chars || (codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256))
		        throw new Error("Encoding '"+codecOptions.type+"' has incorrect 'chars' (must be of len 128 or 256)");
		    
		    if (codecOptions.chars.length === 128) {
		        var asciiString = "";
		        for (var i = 0; i < 128; i++)
		            asciiString += String.fromCharCode(i);
		        codecOptions.chars = asciiString + codecOptions.chars;
		    }

		    this.decodeBuf = Buffer.from(codecOptions.chars, 'ucs2');
		    
		    // Encoding buffer.
		    var encodeBuf = Buffer.alloc(65536, iconv.defaultCharSingleByte.charCodeAt(0));

		    for (var i = 0; i < codecOptions.chars.length; i++)
		        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;

		    this.encodeBuf = encodeBuf;
		}

		SBCSCodec.prototype.encoder = SBCSEncoder;
		SBCSCodec.prototype.decoder = SBCSDecoder;


		function SBCSEncoder(options, codec) {
		    this.encodeBuf = codec.encodeBuf;
		}

		SBCSEncoder.prototype.write = function(str) {
		    var buf = Buffer.alloc(str.length);
		    for (var i = 0; i < str.length; i++)
		        buf[i] = this.encodeBuf[str.charCodeAt(i)];
		    
		    return buf;
		};

		SBCSEncoder.prototype.end = function() {
		};


		function SBCSDecoder(options, codec) {
		    this.decodeBuf = codec.decodeBuf;
		}

		SBCSDecoder.prototype.write = function(buf) {
		    // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
		    var decodeBuf = this.decodeBuf;
		    var newBuf = Buffer.alloc(buf.length*2);
		    var idx1 = 0, idx2 = 0;
		    for (var i = 0; i < buf.length; i++) {
		        idx1 = buf[i]*2; idx2 = i*2;
		        newBuf[idx2] = decodeBuf[idx1];
		        newBuf[idx2+1] = decodeBuf[idx1+1];
		    }
		    return newBuf.toString('ucs2');
		};

		SBCSDecoder.prototype.end = function() {
		};
		return sbcsCodec;
	}

	var sbcsData;
	var hasRequiredSbcsData;

	function requireSbcsData () {
		if (hasRequiredSbcsData) return sbcsData;
		hasRequiredSbcsData = 1;

		// Manually added data to be used by sbcs codec in addition to generated one.

		sbcsData = {
		    // Not supported by iconv, not sure why.
		    "10029": "maccenteuro",
		    "maccenteuro": {
		        "type": "_sbcs",
		        "chars": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
		    },

		    "808": "cp808",
		    "ibm808": "cp808",
		    "cp808": {
		        "type": "_sbcs",
		        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
		    },

		    "mik": {
		        "type": "_sbcs",
		        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		    },

		    "cp720": {
		        "type": "_sbcs",
		        "chars": "\x80\x81éâ\x84à\x86çêëèïî\x8d\x8e\x8f\x90\u0651\u0652ô¤ـûùءآأؤ£إئابةتثجحخدذرزسشص«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ضطظعغفµقكلمنهوىي≡\u064b\u064c\u064d\u064e\u064f\u0650≈°∙·√ⁿ²■\u00a0"
		    },

		    // Aliases of generated encodings.
		    "ascii8bit": "ascii",
		    "usascii": "ascii",
		    "ansix34": "ascii",
		    "ansix341968": "ascii",
		    "ansix341986": "ascii",
		    "csascii": "ascii",
		    "cp367": "ascii",
		    "ibm367": "ascii",
		    "isoir6": "ascii",
		    "iso646us": "ascii",
		    "iso646irv": "ascii",
		    "us": "ascii",

		    "latin1": "iso88591",
		    "latin2": "iso88592",
		    "latin3": "iso88593",
		    "latin4": "iso88594",
		    "latin5": "iso88599",
		    "latin6": "iso885910",
		    "latin7": "iso885913",
		    "latin8": "iso885914",
		    "latin9": "iso885915",
		    "latin10": "iso885916",

		    "csisolatin1": "iso88591",
		    "csisolatin2": "iso88592",
		    "csisolatin3": "iso88593",
		    "csisolatin4": "iso88594",
		    "csisolatincyrillic": "iso88595",
		    "csisolatinarabic": "iso88596",
		    "csisolatingreek" : "iso88597",
		    "csisolatinhebrew": "iso88598",
		    "csisolatin5": "iso88599",
		    "csisolatin6": "iso885910",

		    "l1": "iso88591",
		    "l2": "iso88592",
		    "l3": "iso88593",
		    "l4": "iso88594",
		    "l5": "iso88599",
		    "l6": "iso885910",
		    "l7": "iso885913",
		    "l8": "iso885914",
		    "l9": "iso885915",
		    "l10": "iso885916",

		    "isoir14": "iso646jp",
		    "isoir57": "iso646cn",
		    "isoir100": "iso88591",
		    "isoir101": "iso88592",
		    "isoir109": "iso88593",
		    "isoir110": "iso88594",
		    "isoir144": "iso88595",
		    "isoir127": "iso88596",
		    "isoir126": "iso88597",
		    "isoir138": "iso88598",
		    "isoir148": "iso88599",
		    "isoir157": "iso885910",
		    "isoir166": "tis620",
		    "isoir179": "iso885913",
		    "isoir199": "iso885914",
		    "isoir203": "iso885915",
		    "isoir226": "iso885916",

		    "cp819": "iso88591",
		    "ibm819": "iso88591",

		    "cyrillic": "iso88595",

		    "arabic": "iso88596",
		    "arabic8": "iso88596",
		    "ecma114": "iso88596",
		    "asmo708": "iso88596",

		    "greek" : "iso88597",
		    "greek8" : "iso88597",
		    "ecma118" : "iso88597",
		    "elot928" : "iso88597",

		    "hebrew": "iso88598",
		    "hebrew8": "iso88598",

		    "turkish": "iso88599",
		    "turkish8": "iso88599",

		    "thai": "iso885911",
		    "thai8": "iso885911",

		    "celtic": "iso885914",
		    "celtic8": "iso885914",
		    "isoceltic": "iso885914",

		    "tis6200": "tis620",
		    "tis62025291": "tis620",
		    "tis62025330": "tis620",

		    "10000": "macroman",
		    "10006": "macgreek",
		    "10007": "maccyrillic",
		    "10079": "maciceland",
		    "10081": "macturkish",

		    "cspc8codepage437": "cp437",
		    "cspc775baltic": "cp775",
		    "cspc850multilingual": "cp850",
		    "cspcp852": "cp852",
		    "cspc862latinhebrew": "cp862",
		    "cpgr": "cp869",

		    "msee": "cp1250",
		    "mscyrl": "cp1251",
		    "msansi": "cp1252",
		    "msgreek": "cp1253",
		    "msturk": "cp1254",
		    "mshebr": "cp1255",
		    "msarab": "cp1256",
		    "winbaltrim": "cp1257",

		    "cp20866": "koi8r",
		    "20866": "koi8r",
		    "ibm878": "koi8r",
		    "cskoi8r": "koi8r",

		    "cp21866": "koi8u",
		    "21866": "koi8u",
		    "ibm1168": "koi8u",

		    "strk10482002": "rk1048",

		    "tcvn5712": "tcvn",
		    "tcvn57121": "tcvn",

		    "gb198880": "iso646cn",
		    "cn": "iso646cn",

		    "csiso14jisc6220ro": "iso646jp",
		    "jisc62201969ro": "iso646jp",
		    "jp": "iso646jp",

		    "cshproman8": "hproman8",
		    "r8": "hproman8",
		    "roman8": "hproman8",
		    "xroman8": "hproman8",
		    "ibm1051": "hproman8",

		    "mac": "macintosh",
		    "csmacintosh": "macintosh",
		};
		return sbcsData;
	}

	var sbcsDataGenerated;
	var hasRequiredSbcsDataGenerated;

	function requireSbcsDataGenerated () {
		if (hasRequiredSbcsDataGenerated) return sbcsDataGenerated;
		hasRequiredSbcsDataGenerated = 1;

		// Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
		sbcsDataGenerated = {
		  "437": "cp437",
		  "737": "cp737",
		  "775": "cp775",
		  "850": "cp850",
		  "852": "cp852",
		  "855": "cp855",
		  "856": "cp856",
		  "857": "cp857",
		  "858": "cp858",
		  "860": "cp860",
		  "861": "cp861",
		  "862": "cp862",
		  "863": "cp863",
		  "864": "cp864",
		  "865": "cp865",
		  "866": "cp866",
		  "869": "cp869",
		  "874": "windows874",
		  "922": "cp922",
		  "1046": "cp1046",
		  "1124": "cp1124",
		  "1125": "cp1125",
		  "1129": "cp1129",
		  "1133": "cp1133",
		  "1161": "cp1161",
		  "1162": "cp1162",
		  "1163": "cp1163",
		  "1250": "windows1250",
		  "1251": "windows1251",
		  "1252": "windows1252",
		  "1253": "windows1253",
		  "1254": "windows1254",
		  "1255": "windows1255",
		  "1256": "windows1256",
		  "1257": "windows1257",
		  "1258": "windows1258",
		  "28591": "iso88591",
		  "28592": "iso88592",
		  "28593": "iso88593",
		  "28594": "iso88594",
		  "28595": "iso88595",
		  "28596": "iso88596",
		  "28597": "iso88597",
		  "28598": "iso88598",
		  "28599": "iso88599",
		  "28600": "iso885910",
		  "28601": "iso885911",
		  "28603": "iso885913",
		  "28604": "iso885914",
		  "28605": "iso885915",
		  "28606": "iso885916",
		  "windows874": {
		    "type": "_sbcs",
		    "chars": "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
		  },
		  "win874": "windows874",
		  "cp874": "windows874",
		  "windows1250": {
		    "type": "_sbcs",
		    "chars": "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
		  },
		  "win1250": "windows1250",
		  "cp1250": "windows1250",
		  "windows1251": {
		    "type": "_sbcs",
		    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
		  },
		  "win1251": "windows1251",
		  "cp1251": "windows1251",
		  "windows1252": {
		    "type": "_sbcs",
		    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
		  },
		  "win1252": "windows1252",
		  "cp1252": "windows1252",
		  "windows1253": {
		    "type": "_sbcs",
		    "chars": "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
		  },
		  "win1253": "windows1253",
		  "cp1253": "windows1253",
		  "windows1254": {
		    "type": "_sbcs",
		    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
		  },
		  "win1254": "windows1254",
		  "cp1254": "windows1254",
		  "windows1255": {
		    "type": "_sbcs",
		    "chars": "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
		  },
		  "win1255": "windows1255",
		  "cp1255": "windows1255",
		  "windows1256": {
		    "type": "_sbcs",
		    "chars": "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
		  },
		  "win1256": "windows1256",
		  "cp1256": "windows1256",
		  "windows1257": {
		    "type": "_sbcs",
		    "chars": "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
		  },
		  "win1257": "windows1257",
		  "cp1257": "windows1257",
		  "windows1258": {
		    "type": "_sbcs",
		    "chars": "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
		  },
		  "win1258": "windows1258",
		  "cp1258": "windows1258",
		  "iso88591": {
		    "type": "_sbcs",
		    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
		  },
		  "cp28591": "iso88591",
		  "iso88592": {
		    "type": "_sbcs",
		    "chars": " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
		  },
		  "cp28592": "iso88592",
		  "iso88593": {
		    "type": "_sbcs",
		    "chars": " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
		  },
		  "cp28593": "iso88593",
		  "iso88594": {
		    "type": "_sbcs",
		    "chars": " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
		  },
		  "cp28594": "iso88594",
		  "iso88595": {
		    "type": "_sbcs",
		    "chars": " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
		  },
		  "cp28595": "iso88595",
		  "iso88596": {
		    "type": "_sbcs",
		    "chars": " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
		  },
		  "cp28596": "iso88596",
		  "iso88597": {
		    "type": "_sbcs",
		    "chars": " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
		  },
		  "cp28597": "iso88597",
		  "iso88598": {
		    "type": "_sbcs",
		    "chars": " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
		  },
		  "cp28598": "iso88598",
		  "iso88599": {
		    "type": "_sbcs",
		    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
		  },
		  "cp28599": "iso88599",
		  "iso885910": {
		    "type": "_sbcs",
		    "chars": " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
		  },
		  "cp28600": "iso885910",
		  "iso885911": {
		    "type": "_sbcs",
		    "chars": " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
		  },
		  "cp28601": "iso885911",
		  "iso885913": {
		    "type": "_sbcs",
		    "chars": " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
		  },
		  "cp28603": "iso885913",
		  "iso885914": {
		    "type": "_sbcs",
		    "chars": " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
		  },
		  "cp28604": "iso885914",
		  "iso885915": {
		    "type": "_sbcs",
		    "chars": " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
		  },
		  "cp28605": "iso885915",
		  "iso885916": {
		    "type": "_sbcs",
		    "chars": " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
		  },
		  "cp28606": "iso885916",
		  "cp437": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm437": "cp437",
		  "csibm437": "cp437",
		  "cp737": {
		    "type": "_sbcs",
		    "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
		  },
		  "ibm737": "cp737",
		  "csibm737": "cp737",
		  "cp775": {
		    "type": "_sbcs",
		    "chars": "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
		  },
		  "ibm775": "cp775",
		  "csibm775": "cp775",
		  "cp850": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
		  },
		  "ibm850": "cp850",
		  "csibm850": "cp850",
		  "cp852": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
		  },
		  "ibm852": "cp852",
		  "csibm852": "cp852",
		  "cp855": {
		    "type": "_sbcs",
		    "chars": "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
		  },
		  "ibm855": "cp855",
		  "csibm855": "cp855",
		  "cp856": {
		    "type": "_sbcs",
		    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
		  },
		  "ibm856": "cp856",
		  "csibm856": "cp856",
		  "cp857": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
		  },
		  "ibm857": "cp857",
		  "csibm857": "cp857",
		  "cp858": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
		  },
		  "ibm858": "cp858",
		  "csibm858": "cp858",
		  "cp860": {
		    "type": "_sbcs",
		    "chars": "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm860": "cp860",
		  "csibm860": "cp860",
		  "cp861": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm861": "cp861",
		  "csibm861": "cp861",
		  "cp862": {
		    "type": "_sbcs",
		    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm862": "cp862",
		  "csibm862": "cp862",
		  "cp863": {
		    "type": "_sbcs",
		    "chars": "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm863": "cp863",
		  "csibm863": "cp863",
		  "cp864": {
		    "type": "_sbcs",
		    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"
		  },
		  "ibm864": "cp864",
		  "csibm864": "cp864",
		  "cp865": {
		    "type": "_sbcs",
		    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
		  },
		  "ibm865": "cp865",
		  "csibm865": "cp865",
		  "cp866": {
		    "type": "_sbcs",
		    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
		  },
		  "ibm866": "cp866",
		  "csibm866": "cp866",
		  "cp869": {
		    "type": "_sbcs",
		    "chars": "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
		  },
		  "ibm869": "cp869",
		  "csibm869": "cp869",
		  "cp922": {
		    "type": "_sbcs",
		    "chars": " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
		  },
		  "ibm922": "cp922",
		  "csibm922": "cp922",
		  "cp1046": {
		    "type": "_sbcs",
		    "chars": "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
		  },
		  "ibm1046": "cp1046",
		  "csibm1046": "cp1046",
		  "cp1124": {
		    "type": "_sbcs",
		    "chars": " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
		  },
		  "ibm1124": "cp1124",
		  "csibm1124": "cp1124",
		  "cp1125": {
		    "type": "_sbcs",
		    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
		  },
		  "ibm1125": "cp1125",
		  "csibm1125": "cp1125",
		  "cp1129": {
		    "type": "_sbcs",
		    "chars": " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
		  },
		  "ibm1129": "cp1129",
		  "csibm1129": "cp1129",
		  "cp1133": {
		    "type": "_sbcs",
		    "chars": " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
		  },
		  "ibm1133": "cp1133",
		  "csibm1133": "cp1133",
		  "cp1161": {
		    "type": "_sbcs",
		    "chars": "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
		  },
		  "ibm1161": "cp1161",
		  "csibm1161": "cp1161",
		  "cp1162": {
		    "type": "_sbcs",
		    "chars": "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
		  },
		  "ibm1162": "cp1162",
		  "csibm1162": "cp1162",
		  "cp1163": {
		    "type": "_sbcs",
		    "chars": " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
		  },
		  "ibm1163": "cp1163",
		  "csibm1163": "cp1163",
		  "maccroatian": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
		  },
		  "maccyrillic": {
		    "type": "_sbcs",
		    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
		  },
		  "macgreek": {
		    "type": "_sbcs",
		    "chars": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
		  },
		  "maciceland": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
		  },
		  "macroman": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
		  },
		  "macromania": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
		  },
		  "macthai": {
		    "type": "_sbcs",
		    "chars": "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู﻿​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
		  },
		  "macturkish": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
		  },
		  "macukraine": {
		    "type": "_sbcs",
		    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
		  },
		  "koi8r": {
		    "type": "_sbcs",
		    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
		  },
		  "koi8u": {
		    "type": "_sbcs",
		    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
		  },
		  "koi8ru": {
		    "type": "_sbcs",
		    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
		  },
		  "koi8t": {
		    "type": "_sbcs",
		    "chars": "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
		  },
		  "armscii8": {
		    "type": "_sbcs",
		    "chars": " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
		  },
		  "rk1048": {
		    "type": "_sbcs",
		    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
		  },
		  "tcvn": {
		    "type": "_sbcs",
		    "chars": "\u0000ÚỤ\u0003ỪỬỮ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010ỨỰỲỶỸÝỴ\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"
		  },
		  "georgianacademy": {
		    "type": "_sbcs",
		    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
		  },
		  "georgianps": {
		    "type": "_sbcs",
		    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
		  },
		  "pt154": {
		    "type": "_sbcs",
		    "chars": "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
		  },
		  "viscii": {
		    "type": "_sbcs",
		    "chars": "\u0000\u0001Ẳ\u0003\u0004ẴẪ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013Ỷ\u0015\u0016\u0017\u0018Ỹ\u001a\u001b\u001c\u001dỴ\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"
		  },
		  "iso646cn": {
		    "type": "_sbcs",
		    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
		  },
		  "iso646jp": {
		    "type": "_sbcs",
		    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
		  },
		  "hproman8": {
		    "type": "_sbcs",
		    "chars": " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
		  },
		  "macintosh": {
		    "type": "_sbcs",
		    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
		  },
		  "ascii": {
		    "type": "_sbcs",
		    "chars": "��������������������������������������������������������������������������������������������������������������������������������"
		  },
		  "tis620": {
		    "type": "_sbcs",
		    "chars": "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
		  }
		};
		return sbcsDataGenerated;
	}

	var dbcsCodec = {};

	var hasRequiredDbcsCodec;

	function requireDbcsCodec () {
		if (hasRequiredDbcsCodec) return dbcsCodec;
		hasRequiredDbcsCodec = 1;
		var Buffer = requireSafer().Buffer;

		// Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
		// Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
		// To save memory and loading time, we read table files only when requested.

		dbcsCodec._dbcs = DBCSCodec;

		var UNASSIGNED = -1,
		    GB18030_CODE = -2,
		    SEQ_START  = -10,
		    NODE_START = -1000,
		    UNASSIGNED_NODE = new Array(0x100),
		    DEF_CHAR = -1;

		for (var i = 0; i < 0x100; i++)
		    UNASSIGNED_NODE[i] = UNASSIGNED;


		// Class DBCSCodec reads and initializes mapping tables.
		function DBCSCodec(codecOptions, iconv) {
		    this.encodingName = codecOptions.encodingName;
		    if (!codecOptions)
		        throw new Error("DBCS codec is called without the data.")
		    if (!codecOptions.table)
		        throw new Error("Encoding '" + this.encodingName + "' has no data.");

		    // Load tables.
		    var mappingTable = codecOptions.table();


		    // Decode tables: MBCS -> Unicode.

		    // decodeTables is a trie, encoded as an array of arrays of integers. Internal arrays are trie nodes and all have len = 256.
		    // Trie root is decodeTables[0].
		    // Values: >=  0 -> unicode character code. can be > 0xFFFF
		    //         == UNASSIGNED -> unknown/unassigned sequence.
		    //         == GB18030_CODE -> this is the end of a GB18030 4-byte sequence.
		    //         <= NODE_START -> index of the next node in our trie to process next byte.
		    //         <= SEQ_START  -> index of the start of a character code sequence, in decodeTableSeq.
		    this.decodeTables = [];
		    this.decodeTables[0] = UNASSIGNED_NODE.slice(0); // Create root node.

		    // Sometimes a MBCS char corresponds to a sequence of unicode chars. We store them as arrays of integers here. 
		    this.decodeTableSeq = [];

		    // Actual mapping tables consist of chunks. Use them to fill up decode tables.
		    for (var i = 0; i < mappingTable.length; i++)
		        this._addDecodeChunk(mappingTable[i]);

		    // Load & create GB18030 tables when needed.
		    if (typeof codecOptions.gb18030 === 'function') {
		        this.gb18030 = codecOptions.gb18030(); // Load GB18030 ranges.

		        // Add GB18030 common decode nodes.
		        var commonThirdByteNodeIdx = this.decodeTables.length;
		        this.decodeTables.push(UNASSIGNED_NODE.slice(0));

		        var commonFourthByteNodeIdx = this.decodeTables.length;
		        this.decodeTables.push(UNASSIGNED_NODE.slice(0));

		        // Fill out the tree
		        var firstByteNode = this.decodeTables[0];
		        for (var i = 0x81; i <= 0xFE; i++) {
		            var secondByteNode = this.decodeTables[NODE_START - firstByteNode[i]];
		            for (var j = 0x30; j <= 0x39; j++) {
		                if (secondByteNode[j] === UNASSIGNED) {
		                    secondByteNode[j] = NODE_START - commonThirdByteNodeIdx;
		                } else if (secondByteNode[j] > NODE_START) {
		                    throw new Error("gb18030 decode tables conflict at byte 2");
		                }

		                var thirdByteNode = this.decodeTables[NODE_START - secondByteNode[j]];
		                for (var k = 0x81; k <= 0xFE; k++) {
		                    if (thirdByteNode[k] === UNASSIGNED) {
		                        thirdByteNode[k] = NODE_START - commonFourthByteNodeIdx;
		                    } else if (thirdByteNode[k] === NODE_START - commonFourthByteNodeIdx) {
		                        continue;
		                    } else if (thirdByteNode[k] > NODE_START) {
		                        throw new Error("gb18030 decode tables conflict at byte 3");
		                    }

		                    var fourthByteNode = this.decodeTables[NODE_START - thirdByteNode[k]];
		                    for (var l = 0x30; l <= 0x39; l++) {
		                        if (fourthByteNode[l] === UNASSIGNED)
		                            fourthByteNode[l] = GB18030_CODE;
		                    }
		                }
		            }
		        }
		    }

		    this.defaultCharUnicode = iconv.defaultCharUnicode;

		    
		    // Encode tables: Unicode -> DBCS.

		    // `encodeTable` is array mapping from unicode char to encoded char. All its values are integers for performance.
		    // Because it can be sparse, it is represented as array of buckets by 256 chars each. Bucket can be null.
		    // Values: >=  0 -> it is a normal char. Write the value (if <=256 then 1 byte, if <=65536 then 2 bytes, etc.).
		    //         == UNASSIGNED -> no conversion found. Output a default char.
		    //         <= SEQ_START  -> it's an index in encodeTableSeq, see below. The character starts a sequence.
		    this.encodeTable = [];
		    
		    // `encodeTableSeq` is used when a sequence of unicode characters is encoded as a single code. We use a tree of
		    // objects where keys correspond to characters in sequence and leafs are the encoded dbcs values. A special DEF_CHAR key
		    // means end of sequence (needed when one sequence is a strict subsequence of another).
		    // Objects are kept separately from encodeTable to increase performance.
		    this.encodeTableSeq = [];

		    // Some chars can be decoded, but need not be encoded.
		    var skipEncodeChars = {};
		    if (codecOptions.encodeSkipVals)
		        for (var i = 0; i < codecOptions.encodeSkipVals.length; i++) {
		            var val = codecOptions.encodeSkipVals[i];
		            if (typeof val === 'number')
		                skipEncodeChars[val] = true;
		            else
		                for (var j = val.from; j <= val.to; j++)
		                    skipEncodeChars[j] = true;
		        }
		        
		    // Use decode trie to recursively fill out encode tables.
		    this._fillEncodeTable(0, 0, skipEncodeChars);

		    // Add more encoding pairs when needed.
		    if (codecOptions.encodeAdd) {
		        for (var uChar in codecOptions.encodeAdd)
		            if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
		                this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
		    }

		    this.defCharSB  = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
		    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]['?'];
		    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);
		}

		DBCSCodec.prototype.encoder = DBCSEncoder;
		DBCSCodec.prototype.decoder = DBCSDecoder;

		// Decoder helpers
		DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
		    var bytes = [];
		    for (; addr > 0; addr >>>= 8)
		        bytes.push(addr & 0xFF);
		    if (bytes.length == 0)
		        bytes.push(0);

		    var node = this.decodeTables[0];
		    for (var i = bytes.length-1; i > 0; i--) { // Traverse nodes deeper into the trie.
		        var val = node[bytes[i]];

		        if (val == UNASSIGNED) { // Create new node.
		            node[bytes[i]] = NODE_START - this.decodeTables.length;
		            this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
		        }
		        else if (val <= NODE_START) { // Existing node.
		            node = this.decodeTables[NODE_START - val];
		        }
		        else
		            throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
		    }
		    return node;
		};


		DBCSCodec.prototype._addDecodeChunk = function(chunk) {
		    // First element of chunk is the hex mbcs code where we start.
		    var curAddr = parseInt(chunk[0], 16);

		    // Choose the decoding node where we'll write our chars.
		    var writeTable = this._getDecodeTrieNode(curAddr);
		    curAddr = curAddr & 0xFF;

		    // Write all other elements of the chunk to the table.
		    for (var k = 1; k < chunk.length; k++) {
		        var part = chunk[k];
		        if (typeof part === "string") { // String, write as-is.
		            for (var l = 0; l < part.length;) {
		                var code = part.charCodeAt(l++);
		                if (0xD800 <= code && code < 0xDC00) { // Decode surrogate
		                    var codeTrail = part.charCodeAt(l++);
		                    if (0xDC00 <= codeTrail && codeTrail < 0xE000)
		                        writeTable[curAddr++] = 0x10000 + (code - 0xD800) * 0x400 + (codeTrail - 0xDC00);
		                    else
		                        throw new Error("Incorrect surrogate pair in "  + this.encodingName + " at chunk " + chunk[0]);
		                }
		                else if (0x0FF0 < code && code <= 0x0FFF) { // Character sequence (our own encoding used)
		                    var len = 0xFFF - code + 2;
		                    var seq = [];
		                    for (var m = 0; m < len; m++)
		                        seq.push(part.charCodeAt(l++)); // Simple variation: don't support surrogates or subsequences in seq.

		                    writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
		                    this.decodeTableSeq.push(seq);
		                }
		                else
		                    writeTable[curAddr++] = code; // Basic char
		            }
		        } 
		        else if (typeof part === "number") { // Integer, meaning increasing sequence starting with prev character.
		            var charCode = writeTable[curAddr - 1] + 1;
		            for (var l = 0; l < part; l++)
		                writeTable[curAddr++] = charCode++;
		        }
		        else
		            throw new Error("Incorrect type '" + typeof part + "' given in "  + this.encodingName + " at chunk " + chunk[0]);
		    }
		    if (curAddr > 0xFF)
		        throw new Error("Incorrect chunk in "  + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
		};

		// Encoder helpers
		DBCSCodec.prototype._getEncodeBucket = function(uCode) {
		    var high = uCode >> 8; // This could be > 0xFF because of astral characters.
		    if (this.encodeTable[high] === undefined)
		        this.encodeTable[high] = UNASSIGNED_NODE.slice(0); // Create bucket on demand.
		    return this.encodeTable[high];
		};

		DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
		    var bucket = this._getEncodeBucket(uCode);
		    var low = uCode & 0xFF;
		    if (bucket[low] <= SEQ_START)
		        this.encodeTableSeq[SEQ_START-bucket[low]][DEF_CHAR] = dbcsCode; // There's already a sequence, set a single-char subsequence of it.
		    else if (bucket[low] == UNASSIGNED)
		        bucket[low] = dbcsCode;
		};

		DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
		    
		    // Get the root of character tree according to first character of the sequence.
		    var uCode = seq[0];
		    var bucket = this._getEncodeBucket(uCode);
		    var low = uCode & 0xFF;

		    var node;
		    if (bucket[low] <= SEQ_START) {
		        // There's already a sequence with  - use it.
		        node = this.encodeTableSeq[SEQ_START-bucket[low]];
		    }
		    else {
		        // There was no sequence object - allocate a new one.
		        node = {};
		        if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low]; // If a char was set before - make it a single-char subsequence.
		        bucket[low] = SEQ_START - this.encodeTableSeq.length;
		        this.encodeTableSeq.push(node);
		    }

		    // Traverse the character tree, allocating new nodes as needed.
		    for (var j = 1; j < seq.length-1; j++) {
		        var oldVal = node[uCode];
		        if (typeof oldVal === 'object')
		            node = oldVal;
		        else {
		            node = node[uCode] = {};
		            if (oldVal !== undefined)
		                node[DEF_CHAR] = oldVal;
		        }
		    }

		    // Set the leaf to given dbcsCode.
		    uCode = seq[seq.length-1];
		    node[uCode] = dbcsCode;
		};

		DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
		    var node = this.decodeTables[nodeIdx];
		    var hasValues = false;
		    var subNodeEmpty = {};
		    for (var i = 0; i < 0x100; i++) {
		        var uCode = node[i];
		        var mbCode = prefix + i;
		        if (skipEncodeChars[mbCode])
		            continue;

		        if (uCode >= 0) {
		            this._setEncodeChar(uCode, mbCode);
		            hasValues = true;
		        } else if (uCode <= NODE_START) {
		            var subNodeIdx = NODE_START - uCode;
		            if (!subNodeEmpty[subNodeIdx]) {  // Skip empty subtrees (they are too large in gb18030).
		                var newPrefix = (mbCode << 8) >>> 0;  // NOTE: '>>> 0' keeps 32-bit num positive.
		                if (this._fillEncodeTable(subNodeIdx, newPrefix, skipEncodeChars))
		                    hasValues = true;
		                else
		                    subNodeEmpty[subNodeIdx] = true;
		            }
		        } else if (uCode <= SEQ_START) {
		            this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
		            hasValues = true;
		        }
		    }
		    return hasValues;
		};



		// == Encoder ==================================================================

		function DBCSEncoder(options, codec) {
		    // Encoder state
		    this.leadSurrogate = -1;
		    this.seqObj = undefined;
		    
		    // Static data
		    this.encodeTable = codec.encodeTable;
		    this.encodeTableSeq = codec.encodeTableSeq;
		    this.defaultCharSingleByte = codec.defCharSB;
		    this.gb18030 = codec.gb18030;
		}

		DBCSEncoder.prototype.write = function(str) {
		    var newBuf = Buffer.alloc(str.length * (this.gb18030 ? 4 : 3)),
		        leadSurrogate = this.leadSurrogate,
		        seqObj = this.seqObj, nextChar = -1,
		        i = 0, j = 0;

		    while (true) {
		        // 0. Get next character.
		        if (nextChar === -1) {
		            if (i == str.length) break;
		            var uCode = str.charCodeAt(i++);
		        }
		        else {
		            var uCode = nextChar;
		            nextChar = -1;    
		        }

		        // 1. Handle surrogates.
		        if (0xD800 <= uCode && uCode < 0xE000) { // Char is one of surrogates.
		            if (uCode < 0xDC00) { // We've got lead surrogate.
		                if (leadSurrogate === -1) {
		                    leadSurrogate = uCode;
		                    continue;
		                } else {
		                    leadSurrogate = uCode;
		                    // Double lead surrogate found.
		                    uCode = UNASSIGNED;
		                }
		            } else { // We've got trail surrogate.
		                if (leadSurrogate !== -1) {
		                    uCode = 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (uCode - 0xDC00);
		                    leadSurrogate = -1;
		                } else {
		                    // Incomplete surrogate pair - only trail surrogate found.
		                    uCode = UNASSIGNED;
		                }
		                
		            }
		        }
		        else if (leadSurrogate !== -1) {
		            // Incomplete surrogate pair - only lead surrogate found.
		            nextChar = uCode; uCode = UNASSIGNED; // Write an error, then current char.
		            leadSurrogate = -1;
		        }

		        // 2. Convert uCode character.
		        var dbcsCode = UNASSIGNED;
		        if (seqObj !== undefined && uCode != UNASSIGNED) { // We are in the middle of the sequence
		            var resCode = seqObj[uCode];
		            if (typeof resCode === 'object') { // Sequence continues.
		                seqObj = resCode;
		                continue;

		            } else if (typeof resCode == 'number') { // Sequence finished. Write it.
		                dbcsCode = resCode;

		            } else if (resCode == undefined) { // Current character is not part of the sequence.

		                // Try default character for this sequence
		                resCode = seqObj[DEF_CHAR];
		                if (resCode !== undefined) {
		                    dbcsCode = resCode; // Found. Write it.
		                    nextChar = uCode; // Current character will be written too in the next iteration.

		                }
		            }
		            seqObj = undefined;
		        }
		        else if (uCode >= 0) {  // Regular character
		            var subtable = this.encodeTable[uCode >> 8];
		            if (subtable !== undefined)
		                dbcsCode = subtable[uCode & 0xFF];
		            
		            if (dbcsCode <= SEQ_START) { // Sequence start
		                seqObj = this.encodeTableSeq[SEQ_START-dbcsCode];
		                continue;
		            }

		            if (dbcsCode == UNASSIGNED && this.gb18030) {
		                // Use GB18030 algorithm to find character(s) to write.
		                var idx = findIdx(this.gb18030.uChars, uCode);
		                if (idx != -1) {
		                    var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
		                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 12600); dbcsCode = dbcsCode % 12600;
		                    newBuf[j++] = 0x30 + Math.floor(dbcsCode / 1260); dbcsCode = dbcsCode % 1260;
		                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 10); dbcsCode = dbcsCode % 10;
		                    newBuf[j++] = 0x30 + dbcsCode;
		                    continue;
		                }
		            }
		        }

		        // 3. Write dbcsCode character.
		        if (dbcsCode === UNASSIGNED)
		            dbcsCode = this.defaultCharSingleByte;
		        
		        if (dbcsCode < 0x100) {
		            newBuf[j++] = dbcsCode;
		        }
		        else if (dbcsCode < 0x10000) {
		            newBuf[j++] = dbcsCode >> 8;   // high byte
		            newBuf[j++] = dbcsCode & 0xFF; // low byte
		        }
		        else if (dbcsCode < 0x1000000) {
		            newBuf[j++] = dbcsCode >> 16;
		            newBuf[j++] = (dbcsCode >> 8) & 0xFF;
		            newBuf[j++] = dbcsCode & 0xFF;
		        } else {
		            newBuf[j++] = dbcsCode >>> 24;
		            newBuf[j++] = (dbcsCode >>> 16) & 0xFF;
		            newBuf[j++] = (dbcsCode >>> 8) & 0xFF;
		            newBuf[j++] = dbcsCode & 0xFF;
		        }
		    }

		    this.seqObj = seqObj;
		    this.leadSurrogate = leadSurrogate;
		    return newBuf.slice(0, j);
		};

		DBCSEncoder.prototype.end = function() {
		    if (this.leadSurrogate === -1 && this.seqObj === undefined)
		        return; // All clean. Most often case.

		    var newBuf = Buffer.alloc(10), j = 0;

		    if (this.seqObj) { // We're in the sequence.
		        var dbcsCode = this.seqObj[DEF_CHAR];
		        if (dbcsCode !== undefined) { // Write beginning of the sequence.
		            if (dbcsCode < 0x100) {
		                newBuf[j++] = dbcsCode;
		            }
		            else {
		                newBuf[j++] = dbcsCode >> 8;   // high byte
		                newBuf[j++] = dbcsCode & 0xFF; // low byte
		            }
		        }
		        this.seqObj = undefined;
		    }

		    if (this.leadSurrogate !== -1) {
		        // Incomplete surrogate pair - only lead surrogate found.
		        newBuf[j++] = this.defaultCharSingleByte;
		        this.leadSurrogate = -1;
		    }
		    
		    return newBuf.slice(0, j);
		};

		// Export for testing
		DBCSEncoder.prototype.findIdx = findIdx;


		// == Decoder ==================================================================

		function DBCSDecoder(options, codec) {
		    // Decoder state
		    this.nodeIdx = 0;
		    this.prevBytes = [];

		    // Static data
		    this.decodeTables = codec.decodeTables;
		    this.decodeTableSeq = codec.decodeTableSeq;
		    this.defaultCharUnicode = codec.defaultCharUnicode;
		    this.gb18030 = codec.gb18030;
		}

		DBCSDecoder.prototype.write = function(buf) {
		    var newBuf = Buffer.alloc(buf.length*2),
		        nodeIdx = this.nodeIdx, 
		        prevBytes = this.prevBytes, prevOffset = this.prevBytes.length,
		        seqStart = -this.prevBytes.length, // idx of the start of current parsed sequence.
		        uCode;

		    for (var i = 0, j = 0; i < buf.length; i++) {
		        var curByte = (i >= 0) ? buf[i] : prevBytes[i + prevOffset];

		        // Lookup in current trie node.
		        var uCode = this.decodeTables[nodeIdx][curByte];

		        if (uCode >= 0) ;
		        else if (uCode === UNASSIGNED) { // Unknown char.
		            // TODO: Callback with seq.
		            uCode = this.defaultCharUnicode.charCodeAt(0);
		            i = seqStart; // Skip one byte ('i' will be incremented by the for loop) and try to parse again.
		        }
		        else if (uCode === GB18030_CODE) {
		            if (i >= 3) {
		                var ptr = (buf[i-3]-0x81)*12600 + (buf[i-2]-0x30)*1260 + (buf[i-1]-0x81)*10 + (curByte-0x30);
		            } else {
		                var ptr = (prevBytes[i-3+prevOffset]-0x81)*12600 + 
		                          (((i-2 >= 0) ? buf[i-2] : prevBytes[i-2+prevOffset])-0x30)*1260 + 
		                          (((i-1 >= 0) ? buf[i-1] : prevBytes[i-1+prevOffset])-0x81)*10 + 
		                          (curByte-0x30);
		            }
		            var idx = findIdx(this.gb18030.gbChars, ptr);
		            uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
		        }
		        else if (uCode <= NODE_START) { // Go to next trie node.
		            nodeIdx = NODE_START - uCode;
		            continue;
		        }
		        else if (uCode <= SEQ_START) { // Output a sequence of chars.
		            var seq = this.decodeTableSeq[SEQ_START - uCode];
		            for (var k = 0; k < seq.length - 1; k++) {
		                uCode = seq[k];
		                newBuf[j++] = uCode & 0xFF;
		                newBuf[j++] = uCode >> 8;
		            }
		            uCode = seq[seq.length-1];
		        }
		        else
		            throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);

		        // Write the character to buffer, handling higher planes using surrogate pair.
		        if (uCode >= 0x10000) { 
		            uCode -= 0x10000;
		            var uCodeLead = 0xD800 | (uCode >> 10);
		            newBuf[j++] = uCodeLead & 0xFF;
		            newBuf[j++] = uCodeLead >> 8;

		            uCode = 0xDC00 | (uCode & 0x3FF);
		        }
		        newBuf[j++] = uCode & 0xFF;
		        newBuf[j++] = uCode >> 8;

		        // Reset trie node.
		        nodeIdx = 0; seqStart = i+1;
		    }

		    this.nodeIdx = nodeIdx;
		    this.prevBytes = (seqStart >= 0)
		        ? Array.prototype.slice.call(buf, seqStart)
		        : prevBytes.slice(seqStart + prevOffset).concat(Array.prototype.slice.call(buf));

		    return newBuf.slice(0, j).toString('ucs2');
		};

		DBCSDecoder.prototype.end = function() {
		    var ret = '';

		    // Try to parse all remaining chars.
		    while (this.prevBytes.length > 0) {
		        // Skip 1 character in the buffer.
		        ret += this.defaultCharUnicode;
		        var bytesArr = this.prevBytes.slice(1);

		        // Parse remaining as usual.
		        this.prevBytes = [];
		        this.nodeIdx = 0;
		        if (bytesArr.length > 0)
		            ret += this.write(bytesArr);
		    }

		    this.prevBytes = [];
		    this.nodeIdx = 0;
		    return ret;
		};

		// Binary search for GB18030. Returns largest i such that table[i] <= val.
		function findIdx(table, val) {
		    if (table[0] > val)
		        return -1;

		    var l = 0, r = table.length;
		    while (l < r-1) { // always table[l] <= val < table[r]
		        var mid = l + ((r-l+1) >> 1);
		        if (table[mid] <= val)
		            l = mid;
		        else
		            r = mid;
		    }
		    return l;
		}
		return dbcsCodec;
	}

	var require$$0$1 = [
		[
			"0",
			"\u0000",
			128
		],
		[
			"a1",
			"｡",
			62
		],
		[
			"8140",
			"　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",
			9,
			"＋－±×"
		],
		[
			"8180",
			"÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"
		],
		[
			"81b8",
			"∈∋⊆⊇⊂⊃∪∩"
		],
		[
			"81c8",
			"∧∨￢⇒⇔∀∃"
		],
		[
			"81da",
			"∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"
		],
		[
			"81f0",
			"Å‰♯♭♪†‡¶"
		],
		[
			"81fc",
			"◯"
		],
		[
			"824f",
			"０",
			9
		],
		[
			"8260",
			"Ａ",
			25
		],
		[
			"8281",
			"ａ",
			25
		],
		[
			"829f",
			"ぁ",
			82
		],
		[
			"8340",
			"ァ",
			62
		],
		[
			"8380",
			"ム",
			22
		],
		[
			"839f",
			"Α",
			16,
			"Σ",
			6
		],
		[
			"83bf",
			"α",
			16,
			"σ",
			6
		],
		[
			"8440",
			"А",
			5,
			"ЁЖ",
			25
		],
		[
			"8470",
			"а",
			5,
			"ёж",
			7
		],
		[
			"8480",
			"о",
			17
		],
		[
			"849f",
			"─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"
		],
		[
			"8740",
			"①",
			19,
			"Ⅰ",
			9
		],
		[
			"875f",
			"㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"
		],
		[
			"877e",
			"㍻"
		],
		[
			"8780",
			"〝〟№㏍℡㊤",
			4,
			"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"
		],
		[
			"889f",
			"亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"
		],
		[
			"8940",
			"院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"
		],
		[
			"8980",
			"園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"
		],
		[
			"8a40",
			"魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"
		],
		[
			"8a80",
			"橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"
		],
		[
			"8b40",
			"機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"
		],
		[
			"8b80",
			"朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"
		],
		[
			"8c40",
			"掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"
		],
		[
			"8c80",
			"劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"
		],
		[
			"8d40",
			"后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"
		],
		[
			"8d80",
			"項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"
		],
		[
			"8e40",
			"察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"
		],
		[
			"8e80",
			"死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"
		],
		[
			"8f40",
			"宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"
		],
		[
			"8f80",
			"準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"
		],
		[
			"9040",
			"拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"
		],
		[
			"9080",
			"逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"
		],
		[
			"9140",
			"繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"
		],
		[
			"9180",
			"操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"
		],
		[
			"9240",
			"叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"
		],
		[
			"9280",
			"逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"
		],
		[
			"9340",
			"邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"
		],
		[
			"9380",
			"凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"
		],
		[
			"9440",
			"如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"
		],
		[
			"9480",
			"楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"
		],
		[
			"9540",
			"鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"
		],
		[
			"9580",
			"斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"
		],
		[
			"9640",
			"法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"
		],
		[
			"9680",
			"摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"
		],
		[
			"9740",
			"諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"
		],
		[
			"9780",
			"沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"
		],
		[
			"9840",
			"蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"
		],
		[
			"989f",
			"弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"
		],
		[
			"9940",
			"僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"
		],
		[
			"9980",
			"凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"
		],
		[
			"9a40",
			"咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"
		],
		[
			"9a80",
			"噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"
		],
		[
			"9b40",
			"奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"
		],
		[
			"9b80",
			"它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"
		],
		[
			"9c40",
			"廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"
		],
		[
			"9c80",
			"怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"
		],
		[
			"9d40",
			"戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"
		],
		[
			"9d80",
			"捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"
		],
		[
			"9e40",
			"曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"
		],
		[
			"9e80",
			"梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"
		],
		[
			"9f40",
			"檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"
		],
		[
			"9f80",
			"麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"
		],
		[
			"e040",
			"漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"
		],
		[
			"e080",
			"烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"
		],
		[
			"e140",
			"瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"
		],
		[
			"e180",
			"痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"
		],
		[
			"e240",
			"磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"
		],
		[
			"e280",
			"窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"
		],
		[
			"e340",
			"紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"
		],
		[
			"e380",
			"縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"
		],
		[
			"e440",
			"隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"
		],
		[
			"e480",
			"艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"
		],
		[
			"e540",
			"蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"
		],
		[
			"e580",
			"蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"
		],
		[
			"e640",
			"襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"
		],
		[
			"e680",
			"諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"
		],
		[
			"e740",
			"蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"
		],
		[
			"e780",
			"轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"
		],
		[
			"e840",
			"錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"
		],
		[
			"e880",
			"閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"
		],
		[
			"e940",
			"顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"
		],
		[
			"e980",
			"騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"
		],
		[
			"ea40",
			"鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"
		],
		[
			"ea80",
			"黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"
		],
		[
			"ed40",
			"纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"
		],
		[
			"ed80",
			"塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"
		],
		[
			"ee40",
			"犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"
		],
		[
			"ee80",
			"蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
		],
		[
			"eeef",
			"ⅰ",
			9,
			"￢￤＇＂"
		],
		[
			"f040",
			"",
			62
		],
		[
			"f080",
			"",
			124
		],
		[
			"f140",
			"",
			62
		],
		[
			"f180",
			"",
			124
		],
		[
			"f240",
			"",
			62
		],
		[
			"f280",
			"",
			124
		],
		[
			"f340",
			"",
			62
		],
		[
			"f380",
			"",
			124
		],
		[
			"f440",
			"",
			62
		],
		[
			"f480",
			"",
			124
		],
		[
			"f540",
			"",
			62
		],
		[
			"f580",
			"",
			124
		],
		[
			"f640",
			"",
			62
		],
		[
			"f680",
			"",
			124
		],
		[
			"f740",
			"",
			62
		],
		[
			"f780",
			"",
			124
		],
		[
			"f840",
			"",
			62
		],
		[
			"f880",
			"",
			124
		],
		[
			"f940",
			""
		],
		[
			"fa40",
			"ⅰ",
			9,
			"Ⅰ",
			9,
			"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"
		],
		[
			"fa80",
			"兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"
		],
		[
			"fb40",
			"涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"
		],
		[
			"fb80",
			"祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"
		],
		[
			"fc40",
			"髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
		]
	];

	var require$$1 = [
		[
			"0",
			"\u0000",
			127
		],
		[
			"8ea1",
			"｡",
			62
		],
		[
			"a1a1",
			"　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",
			9,
			"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"
		],
		[
			"a2a1",
			"◆□■△▲▽▼※〒→←↑↓〓"
		],
		[
			"a2ba",
			"∈∋⊆⊇⊂⊃∪∩"
		],
		[
			"a2ca",
			"∧∨￢⇒⇔∀∃"
		],
		[
			"a2dc",
			"∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"
		],
		[
			"a2f2",
			"Å‰♯♭♪†‡¶"
		],
		[
			"a2fe",
			"◯"
		],
		[
			"a3b0",
			"０",
			9
		],
		[
			"a3c1",
			"Ａ",
			25
		],
		[
			"a3e1",
			"ａ",
			25
		],
		[
			"a4a1",
			"ぁ",
			82
		],
		[
			"a5a1",
			"ァ",
			85
		],
		[
			"a6a1",
			"Α",
			16,
			"Σ",
			6
		],
		[
			"a6c1",
			"α",
			16,
			"σ",
			6
		],
		[
			"a7a1",
			"А",
			5,
			"ЁЖ",
			25
		],
		[
			"a7d1",
			"а",
			5,
			"ёж",
			25
		],
		[
			"a8a1",
			"─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"
		],
		[
			"ada1",
			"①",
			19,
			"Ⅰ",
			9
		],
		[
			"adc0",
			"㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"
		],
		[
			"addf",
			"㍻〝〟№㏍℡㊤",
			4,
			"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"
		],
		[
			"b0a1",
			"亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"
		],
		[
			"b1a1",
			"院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"
		],
		[
			"b2a1",
			"押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"
		],
		[
			"b3a1",
			"魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"
		],
		[
			"b4a1",
			"粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"
		],
		[
			"b5a1",
			"機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"
		],
		[
			"b6a1",
			"供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"
		],
		[
			"b7a1",
			"掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"
		],
		[
			"b8a1",
			"検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"
		],
		[
			"b9a1",
			"后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"
		],
		[
			"baa1",
			"此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"
		],
		[
			"bba1",
			"察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"
		],
		[
			"bca1",
			"次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"
		],
		[
			"bda1",
			"宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"
		],
		[
			"bea1",
			"勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"
		],
		[
			"bfa1",
			"拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"
		],
		[
			"c0a1",
			"澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"
		],
		[
			"c1a1",
			"繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"
		],
		[
			"c2a1",
			"臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"
		],
		[
			"c3a1",
			"叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"
		],
		[
			"c4a1",
			"帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"
		],
		[
			"c5a1",
			"邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"
		],
		[
			"c6a1",
			"董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"
		],
		[
			"c7a1",
			"如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"
		],
		[
			"c8a1",
			"函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"
		],
		[
			"c9a1",
			"鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"
		],
		[
			"caa1",
			"福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"
		],
		[
			"cba1",
			"法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"
		],
		[
			"cca1",
			"漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"
		],
		[
			"cda1",
			"諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"
		],
		[
			"cea1",
			"痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"
		],
		[
			"cfa1",
			"蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"
		],
		[
			"d0a1",
			"弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"
		],
		[
			"d1a1",
			"僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"
		],
		[
			"d2a1",
			"辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"
		],
		[
			"d3a1",
			"咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"
		],
		[
			"d4a1",
			"圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"
		],
		[
			"d5a1",
			"奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"
		],
		[
			"d6a1",
			"屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"
		],
		[
			"d7a1",
			"廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"
		],
		[
			"d8a1",
			"悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"
		],
		[
			"d9a1",
			"戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"
		],
		[
			"daa1",
			"據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"
		],
		[
			"dba1",
			"曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"
		],
		[
			"dca1",
			"棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"
		],
		[
			"dda1",
			"檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"
		],
		[
			"dea1",
			"沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"
		],
		[
			"dfa1",
			"漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"
		],
		[
			"e0a1",
			"燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"
		],
		[
			"e1a1",
			"瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"
		],
		[
			"e2a1",
			"癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"
		],
		[
			"e3a1",
			"磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"
		],
		[
			"e4a1",
			"筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"
		],
		[
			"e5a1",
			"紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"
		],
		[
			"e6a1",
			"罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"
		],
		[
			"e7a1",
			"隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"
		],
		[
			"e8a1",
			"茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"
		],
		[
			"e9a1",
			"蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"
		],
		[
			"eaa1",
			"蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"
		],
		[
			"eba1",
			"襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"
		],
		[
			"eca1",
			"譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"
		],
		[
			"eda1",
			"蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"
		],
		[
			"eea1",
			"遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"
		],
		[
			"efa1",
			"錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"
		],
		[
			"f0a1",
			"陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"
		],
		[
			"f1a1",
			"顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"
		],
		[
			"f2a1",
			"髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"
		],
		[
			"f3a1",
			"鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"
		],
		[
			"f4a1",
			"堯槇遙瑤凜熙"
		],
		[
			"f9a1",
			"纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"
		],
		[
			"faa1",
			"忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"
		],
		[
			"fba1",
			"犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"
		],
		[
			"fca1",
			"釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
		],
		[
			"fcf1",
			"ⅰ",
			9,
			"￢￤＇＂"
		],
		[
			"8fa2af",
			"˘ˇ¸˙˝¯˛˚～΄΅"
		],
		[
			"8fa2c2",
			"¡¦¿"
		],
		[
			"8fa2eb",
			"ºª©®™¤№"
		],
		[
			"8fa6e1",
			"ΆΈΉΊΪ"
		],
		[
			"8fa6e7",
			"Ό"
		],
		[
			"8fa6e9",
			"ΎΫ"
		],
		[
			"8fa6ec",
			"Ώ"
		],
		[
			"8fa6f1",
			"άέήίϊΐόςύϋΰώ"
		],
		[
			"8fa7c2",
			"Ђ",
			10,
			"ЎЏ"
		],
		[
			"8fa7f2",
			"ђ",
			10,
			"ўџ"
		],
		[
			"8fa9a1",
			"ÆĐ"
		],
		[
			"8fa9a4",
			"Ħ"
		],
		[
			"8fa9a6",
			"Ĳ"
		],
		[
			"8fa9a8",
			"ŁĿ"
		],
		[
			"8fa9ab",
			"ŊØŒ"
		],
		[
			"8fa9af",
			"ŦÞ"
		],
		[
			"8fa9c1",
			"æđðħıĳĸłŀŉŋøœßŧþ"
		],
		[
			"8faaa1",
			"ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"
		],
		[
			"8faaba",
			"ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"
		],
		[
			"8faba1",
			"áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"
		],
		[
			"8fabbd",
			"ġĥíìïîǐ"
		],
		[
			"8fabc5",
			"īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"
		],
		[
			"8fb0a1",
			"丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"
		],
		[
			"8fb1a1",
			"侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"
		],
		[
			"8fb2a1",
			"傒傓傔傖傛傜傞",
			4,
			"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"
		],
		[
			"8fb3a1",
			"凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"
		],
		[
			"8fb4a1",
			"匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"
		],
		[
			"8fb5a1",
			"咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"
		],
		[
			"8fb6a1",
			"嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",
			5,
			"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",
			4,
			"囱囫园"
		],
		[
			"8fb7a1",
			"囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",
			4,
			"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"
		],
		[
			"8fb8a1",
			"堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"
		],
		[
			"8fb9a1",
			"奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"
		],
		[
			"8fbaa1",
			"嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",
			4,
			"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"
		],
		[
			"8fbba1",
			"屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"
		],
		[
			"8fbca1",
			"巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",
			4,
			"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"
		],
		[
			"8fbda1",
			"彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",
			4,
			"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"
		],
		[
			"8fbea1",
			"悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",
			4,
			"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"
		],
		[
			"8fbfa1",
			"懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"
		],
		[
			"8fc0a1",
			"捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"
		],
		[
			"8fc1a1",
			"擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"
		],
		[
			"8fc2a1",
			"昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"
		],
		[
			"8fc3a1",
			"杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",
			4,
			"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"
		],
		[
			"8fc4a1",
			"棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"
		],
		[
			"8fc5a1",
			"樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"
		],
		[
			"8fc6a1",
			"歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"
		],
		[
			"8fc7a1",
			"泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"
		],
		[
			"8fc8a1",
			"湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"
		],
		[
			"8fc9a1",
			"濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",
			4,
			"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",
			4,
			"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"
		],
		[
			"8fcaa1",
			"煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"
		],
		[
			"8fcba1",
			"狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"
		],
		[
			"8fcca1",
			"珿琀琁琄琇琊琑琚琛琤琦琨",
			9,
			"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"
		],
		[
			"8fcda1",
			"甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",
			5,
			"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"
		],
		[
			"8fcea1",
			"瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",
			6,
			"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"
		],
		[
			"8fcfa1",
			"睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"
		],
		[
			"8fd0a1",
			"碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"
		],
		[
			"8fd1a1",
			"秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"
		],
		[
			"8fd2a1",
			"笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",
			5
		],
		[
			"8fd3a1",
			"籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"
		],
		[
			"8fd4a1",
			"綞綦綧綪綳綶綷綹緂",
			4,
			"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"
		],
		[
			"8fd5a1",
			"罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"
		],
		[
			"8fd6a1",
			"胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"
		],
		[
			"8fd7a1",
			"艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"
		],
		[
			"8fd8a1",
			"荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"
		],
		[
			"8fd9a1",
			"蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",
			4,
			"蕖蕙蕜",
			6,
			"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"
		],
		[
			"8fdaa1",
			"藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",
			4,
			"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"
		],
		[
			"8fdba1",
			"蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",
			6,
			"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"
		],
		[
			"8fdca1",
			"蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",
			4,
			"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"
		],
		[
			"8fdda1",
			"襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",
			4,
			"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"
		],
		[
			"8fdea1",
			"誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",
			4,
			"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"
		],
		[
			"8fdfa1",
			"貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"
		],
		[
			"8fe0a1",
			"踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"
		],
		[
			"8fe1a1",
			"轃轇轏轑",
			4,
			"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"
		],
		[
			"8fe2a1",
			"郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"
		],
		[
			"8fe3a1",
			"釂釃釅釓釔釗釙釚釞釤釥釩釪釬",
			5,
			"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",
			4,
			"鉻鉼鉽鉿銈銉銊銍銎銒銗"
		],
		[
			"8fe4a1",
			"銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",
			4,
			"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"
		],
		[
			"8fe5a1",
			"鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",
			4,
			"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"
		],
		[
			"8fe6a1",
			"镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"
		],
		[
			"8fe7a1",
			"霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"
		],
		[
			"8fe8a1",
			"頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",
			4,
			"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"
		],
		[
			"8fe9a1",
			"馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",
			4
		],
		[
			"8feaa1",
			"鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",
			4,
			"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"
		],
		[
			"8feba1",
			"鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",
			4,
			"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"
		],
		[
			"8feca1",
			"鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"
		],
		[
			"8feda1",
			"黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",
			4,
			"齓齕齖齗齘齚齝齞齨齩齭",
			4,
			"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"
		]
	];

	var require$$2 = [
		[
			"0",
			"\u0000",
			127,
			"€"
		],
		[
			"8140",
			"丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",
			5,
			"乲乴",
			9,
			"乿",
			6,
			"亇亊"
		],
		[
			"8180",
			"亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",
			6,
			"伋伌伒",
			4,
			"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",
			4,
			"佄佅佇",
			5,
			"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"
		],
		[
			"8240",
			"侤侫侭侰",
			4,
			"侶",
			8,
			"俀俁係俆俇俈俉俋俌俍俒",
			4,
			"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",
			11
		],
		[
			"8280",
			"個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",
			10,
			"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",
			4,
			"偖偗偘偙偛偝",
			7,
			"偦",
			5,
			"偭",
			8,
			"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",
			20,
			"傤傦傪傫傭",
			4,
			"傳",
			6,
			"傼"
		],
		[
			"8340",
			"傽",
			17,
			"僐",
			5,
			"僗僘僙僛",
			10,
			"僨僩僪僫僯僰僱僲僴僶",
			4,
			"僼",
			9,
			"儈"
		],
		[
			"8380",
			"儉儊儌",
			5,
			"儓",
			13,
			"儢",
			28,
			"兂兇兊兌兎兏児兒兓兗兘兙兛兝",
			4,
			"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",
			4,
			"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",
			5
		],
		[
			"8440",
			"凘凙凚凜凞凟凢凣凥",
			5,
			"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",
			5,
			"剋剎剏剒剓剕剗剘"
		],
		[
			"8480",
			"剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",
			9,
			"剾劀劃",
			4,
			"劉",
			6,
			"劑劒劔",
			6,
			"劜劤劥劦劧劮劯劰労",
			9,
			"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",
			5,
			"勠勡勢勣勥",
			10,
			"勱",
			7,
			"勻勼勽匁匂匃匄匇匉匊匋匌匎"
		],
		[
			"8540",
			"匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",
			9,
			"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"
		],
		[
			"8580",
			"厐",
			4,
			"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",
			6,
			"厷厸厹厺厼厽厾叀參",
			4,
			"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",
			4,
			"呣呥呧呩",
			7,
			"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"
		],
		[
			"8640",
			"咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",
			4,
			"哫哬哯哰哱哴",
			5,
			"哻哾唀唂唃唄唅唈唊",
			4,
			"唒唓唕",
			5,
			"唜唝唞唟唡唥唦"
		],
		[
			"8680",
			"唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",
			4,
			"啑啒啓啔啗",
			4,
			"啝啞啟啠啢啣啨啩啫啯",
			5,
			"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",
			6,
			"喨",
			8,
			"喲喴営喸喺喼喿",
			4,
			"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",
			4,
			"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",
			4,
			"嗿嘂嘃嘄嘅"
		],
		[
			"8740",
			"嘆嘇嘊嘋嘍嘐",
			7,
			"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",
			11,
			"噏",
			4,
			"噕噖噚噛噝",
			4
		],
		[
			"8780",
			"噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",
			7,
			"嚇",
			6,
			"嚐嚑嚒嚔",
			14,
			"嚤",
			10,
			"嚰",
			6,
			"嚸嚹嚺嚻嚽",
			12,
			"囋",
			8,
			"囕囖囘囙囜団囥",
			5,
			"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",
			6
		],
		[
			"8840",
			"園",
			9,
			"圝圞圠圡圢圤圥圦圧圫圱圲圴",
			4,
			"圼圽圿坁坃坄坅坆坈坉坋坒",
			4,
			"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"
		],
		[
			"8880",
			"垁垇垈垉垊垍",
			4,
			"垔",
			6,
			"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",
			8,
			"埄",
			6,
			"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",
			7,
			"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",
			4,
			"堫",
			4,
			"報堲堳場堶",
			7
		],
		[
			"8940",
			"堾",
			5,
			"塅",
			6,
			"塎塏塐塒塓塕塖塗塙",
			4,
			"塟",
			5,
			"塦",
			4,
			"塭",
			16,
			"塿墂墄墆墇墈墊墋墌"
		],
		[
			"8980",
			"墍",
			4,
			"墔",
			4,
			"墛墜墝墠",
			7,
			"墪",
			17,
			"墽墾墿壀壂壃壄壆",
			10,
			"壒壓壔壖",
			13,
			"壥",
			5,
			"壭壯壱売壴壵壷壸壺",
			7,
			"夃夅夆夈",
			4,
			"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"
		],
		[
			"8a40",
			"夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",
			4,
			"奡奣奤奦",
			12,
			"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"
		],
		[
			"8a80",
			"妧妬妭妰妱妳",
			5,
			"妺妼妽妿",
			6,
			"姇姈姉姌姍姎姏姕姖姙姛姞",
			4,
			"姤姦姧姩姪姫姭",
			11,
			"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",
			6,
			"娳娵娷",
			4,
			"娽娾娿婁",
			4,
			"婇婈婋",
			9,
			"婖婗婘婙婛",
			5
		],
		[
			"8b40",
			"婡婣婤婥婦婨婩婫",
			8,
			"婸婹婻婼婽婾媀",
			17,
			"媓",
			6,
			"媜",
			13,
			"媫媬"
		],
		[
			"8b80",
			"媭",
			4,
			"媴媶媷媹",
			4,
			"媿嫀嫃",
			5,
			"嫊嫋嫍",
			4,
			"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",
			4,
			"嫲",
			22,
			"嬊",
			11,
			"嬘",
			25,
			"嬳嬵嬶嬸",
			7,
			"孁",
			6
		],
		[
			"8c40",
			"孈",
			7,
			"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"
		],
		[
			"8c80",
			"寑寔",
			8,
			"寠寢寣實寧審",
			4,
			"寯寱",
			6,
			"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",
			6,
			"屰屲",
			6,
			"屻屼屽屾岀岃",
			4,
			"岉岊岋岎岏岒岓岕岝",
			4,
			"岤",
			4
		],
		[
			"8d40",
			"岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",
			5,
			"峌",
			5,
			"峓",
			5,
			"峚",
			6,
			"峢峣峧峩峫峬峮峯峱",
			9,
			"峼",
			4
		],
		[
			"8d80",
			"崁崄崅崈",
			5,
			"崏",
			4,
			"崕崗崘崙崚崜崝崟",
			4,
			"崥崨崪崫崬崯",
			4,
			"崵",
			7,
			"崿",
			7,
			"嵈嵉嵍",
			10,
			"嵙嵚嵜嵞",
			10,
			"嵪嵭嵮嵰嵱嵲嵳嵵",
			12,
			"嶃",
			21,
			"嶚嶛嶜嶞嶟嶠"
		],
		[
			"8e40",
			"嶡",
			21,
			"嶸",
			12,
			"巆",
			6,
			"巎",
			12,
			"巜巟巠巣巤巪巬巭"
		],
		[
			"8e80",
			"巰巵巶巸",
			4,
			"巿帀帄帇帉帊帋帍帎帒帓帗帞",
			7,
			"帨",
			4,
			"帯帰帲",
			4,
			"帹帺帾帿幀幁幃幆",
			5,
			"幍",
			6,
			"幖",
			4,
			"幜幝幟幠幣",
			14,
			"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",
			4,
			"庮",
			4,
			"庴庺庻庼庽庿",
			6
		],
		[
			"8f40",
			"廆廇廈廋",
			5,
			"廔廕廗廘廙廚廜",
			11,
			"廩廫",
			8,
			"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"
		],
		[
			"8f80",
			"弨弫弬弮弰弲",
			6,
			"弻弽弾弿彁",
			14,
			"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",
			5,
			"復徫徬徯",
			5,
			"徶徸徹徺徻徾",
			4,
			"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"
		],
		[
			"9040",
			"怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",
			4,
			"怶",
			4,
			"怽怾恀恄",
			6,
			"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"
		],
		[
			"9080",
			"悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",
			7,
			"惇惈惉惌",
			4,
			"惒惓惔惖惗惙惛惞惡",
			4,
			"惪惱惲惵惷惸惻",
			4,
			"愂愃愄愅愇愊愋愌愐",
			4,
			"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",
			18,
			"慀",
			6
		],
		[
			"9140",
			"慇慉態慍慏慐慒慓慔慖",
			6,
			"慞慟慠慡慣慤慥慦慩",
			6,
			"慱慲慳慴慶慸",
			18,
			"憌憍憏",
			4,
			"憕"
		],
		[
			"9180",
			"憖",
			6,
			"憞",
			8,
			"憪憫憭",
			9,
			"憸",
			5,
			"憿懀懁懃",
			4,
			"應懌",
			4,
			"懓懕",
			16,
			"懧",
			13,
			"懶",
			8,
			"戀",
			5,
			"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",
			4,
			"扂扄扅扆扊"
		],
		[
			"9240",
			"扏扐払扖扗扙扚扜",
			6,
			"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",
			5,
			"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"
		],
		[
			"9280",
			"拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",
			5,
			"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",
			7,
			"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",
			6,
			"採掤掦掫掯掱掲掵掶掹掻掽掿揀"
		],
		[
			"9340",
			"揁揂揃揅揇揈揊揋揌揑揓揔揕揗",
			6,
			"揟揢揤",
			4,
			"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",
			4,
			"損搎搑搒搕",
			5,
			"搝搟搢搣搤"
		],
		[
			"9380",
			"搥搧搨搩搫搮",
			5,
			"搵",
			4,
			"搻搼搾摀摂摃摉摋",
			6,
			"摓摕摖摗摙",
			4,
			"摟",
			7,
			"摨摪摫摬摮",
			9,
			"摻",
			6,
			"撃撆撈",
			8,
			"撓撔撗撘撚撛撜撝撟",
			4,
			"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",
			6,
			"擏擑擓擔擕擖擙據"
		],
		[
			"9440",
			"擛擜擝擟擠擡擣擥擧",
			24,
			"攁",
			7,
			"攊",
			7,
			"攓",
			4,
			"攙",
			8
		],
		[
			"9480",
			"攢攣攤攦",
			4,
			"攬攭攰攱攲攳攷攺攼攽敀",
			4,
			"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",
			14,
			"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",
			7,
			"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",
			7,
			"旡旣旤旪旫"
		],
		[
			"9540",
			"旲旳旴旵旸旹旻",
			4,
			"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",
			4,
			"昽昿晀時晄",
			6,
			"晍晎晐晑晘"
		],
		[
			"9580",
			"晙晛晜晝晞晠晢晣晥晧晩",
			4,
			"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",
			4,
			"暞",
			8,
			"暩",
			4,
			"暯",
			4,
			"暵暶暷暸暺暻暼暽暿",
			25,
			"曚曞",
			7,
			"曧曨曪",
			5,
			"曱曵曶書曺曻曽朁朂會"
		],
		[
			"9640",
			"朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",
			5,
			"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",
			4,
			"杝杢杣杤杦杧杫杬杮東杴杶"
		],
		[
			"9680",
			"杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",
			7,
			"柂柅",
			9,
			"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",
			7,
			"柾栁栂栃栄栆栍栐栒栔栕栘",
			4,
			"栞栟栠栢",
			6,
			"栫",
			6,
			"栴栵栶栺栻栿桇桋桍桏桒桖",
			5
		],
		[
			"9740",
			"桜桝桞桟桪桬",
			7,
			"桵桸",
			8,
			"梂梄梇",
			7,
			"梐梑梒梔梕梖梘",
			9,
			"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"
		],
		[
			"9780",
			"梹",
			6,
			"棁棃",
			5,
			"棊棌棎棏棐棑棓棔棖棗棙棛",
			4,
			"棡棢棤",
			9,
			"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",
			4,
			"椌椏椑椓",
			11,
			"椡椢椣椥",
			7,
			"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",
			16,
			"楕楖楘楙楛楜楟"
		],
		[
			"9840",
			"楡楢楤楥楧楨楩楪楬業楯楰楲",
			4,
			"楺楻楽楾楿榁榃榅榊榋榌榎",
			5,
			"榖榗榙榚榝",
			9,
			"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"
		],
		[
			"9880",
			"榾榿槀槂",
			7,
			"構槍槏槑槒槓槕",
			5,
			"槜槝槞槡",
			11,
			"槮槯槰槱槳",
			9,
			"槾樀",
			9,
			"樋",
			11,
			"標",
			5,
			"樠樢",
			5,
			"権樫樬樭樮樰樲樳樴樶",
			6,
			"樿",
			4,
			"橅橆橈",
			7,
			"橑",
			6,
			"橚"
		],
		[
			"9940",
			"橜",
			4,
			"橢橣橤橦",
			10,
			"橲",
			6,
			"橺橻橽橾橿檁檂檃檅",
			8,
			"檏檒",
			4,
			"檘",
			7,
			"檡",
			5
		],
		[
			"9980",
			"檧檨檪檭",
			114,
			"欥欦欨",
			6
		],
		[
			"9a40",
			"欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",
			11,
			"歚",
			7,
			"歨歩歫",
			13,
			"歺歽歾歿殀殅殈"
		],
		[
			"9a80",
			"殌殎殏殐殑殔殕殗殘殙殜",
			4,
			"殢",
			7,
			"殫",
			7,
			"殶殸",
			6,
			"毀毃毄毆",
			4,
			"毌毎毐毑毘毚毜",
			4,
			"毢",
			7,
			"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",
			6,
			"氈",
			4,
			"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",
			4,
			"汑汒汓汖汘"
		],
		[
			"9b40",
			"汙汚汢汣汥汦汧汫",
			4,
			"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"
		],
		[
			"9b80",
			"泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",
			5,
			"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",
			4,
			"涃涄涆涇涊涋涍涏涐涒涖",
			4,
			"涜涢涥涬涭涰涱涳涴涶涷涹",
			5,
			"淁淂淃淈淉淊"
		],
		[
			"9c40",
			"淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",
			7,
			"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"
		],
		[
			"9c80",
			"渶渷渹渻",
			7,
			"湅",
			7,
			"湏湐湑湒湕湗湙湚湜湝湞湠",
			10,
			"湬湭湯",
			14,
			"満溁溂溄溇溈溊",
			4,
			"溑",
			6,
			"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",
			5
		],
		[
			"9d40",
			"滰滱滲滳滵滶滷滸滺",
			7,
			"漃漄漅漇漈漊",
			4,
			"漐漑漒漖",
			9,
			"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",
			6,
			"漿潀潁潂"
		],
		[
			"9d80",
			"潃潄潅潈潉潊潌潎",
			9,
			"潙潚潛潝潟潠潡潣潤潥潧",
			5,
			"潯潰潱潳潵潶潷潹潻潽",
			6,
			"澅澆澇澊澋澏",
			12,
			"澝澞澟澠澢",
			4,
			"澨",
			10,
			"澴澵澷澸澺",
			5,
			"濁濃",
			5,
			"濊",
			6,
			"濓",
			10,
			"濟濢濣濤濥"
		],
		[
			"9e40",
			"濦",
			7,
			"濰",
			32,
			"瀒",
			7,
			"瀜",
			6,
			"瀤",
			6
		],
		[
			"9e80",
			"瀫",
			9,
			"瀶瀷瀸瀺",
			17,
			"灍灎灐",
			13,
			"灟",
			11,
			"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",
			12,
			"炰炲炴炵炶為炾炿烄烅烆烇烉烋",
			12,
			"烚"
		],
		[
			"9f40",
			"烜烝烞烠烡烢烣烥烪烮烰",
			6,
			"烸烺烻烼烾",
			10,
			"焋",
			4,
			"焑焒焔焗焛",
			10,
			"焧",
			7,
			"焲焳焴"
		],
		[
			"9f80",
			"焵焷",
			13,
			"煆煇煈煉煋煍煏",
			12,
			"煝煟",
			4,
			"煥煩",
			4,
			"煯煰煱煴煵煶煷煹煻煼煾",
			5,
			"熅",
			4,
			"熋熌熍熎熐熑熒熓熕熖熗熚",
			4,
			"熡",
			6,
			"熩熪熫熭",
			5,
			"熴熶熷熸熺",
			8,
			"燄",
			9,
			"燏",
			4
		],
		[
			"a040",
			"燖",
			9,
			"燡燢燣燤燦燨",
			5,
			"燯",
			9,
			"燺",
			11,
			"爇",
			19
		],
		[
			"a080",
			"爛爜爞",
			9,
			"爩爫爭爮爯爲爳爴爺爼爾牀",
			6,
			"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",
			4,
			"犌犎犐犑犓",
			11,
			"犠",
			11,
			"犮犱犲犳犵犺",
			6,
			"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"
		],
		[
			"a1a1",
			"　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",
			7,
			"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"
		],
		[
			"a2a1",
			"ⅰ",
			9
		],
		[
			"a2b1",
			"⒈",
			19,
			"⑴",
			19,
			"①",
			9
		],
		[
			"a2e5",
			"㈠",
			9
		],
		[
			"a2f1",
			"Ⅰ",
			11
		],
		[
			"a3a1",
			"！＂＃￥％",
			88,
			"￣"
		],
		[
			"a4a1",
			"ぁ",
			82
		],
		[
			"a5a1",
			"ァ",
			85
		],
		[
			"a6a1",
			"Α",
			16,
			"Σ",
			6
		],
		[
			"a6c1",
			"α",
			16,
			"σ",
			6
		],
		[
			"a6e0",
			"︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"
		],
		[
			"a6ee",
			"︻︼︷︸︱"
		],
		[
			"a6f4",
			"︳︴"
		],
		[
			"a7a1",
			"А",
			5,
			"ЁЖ",
			25
		],
		[
			"a7d1",
			"а",
			5,
			"ёж",
			25
		],
		[
			"a840",
			"ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",
			35,
			"▁",
			6
		],
		[
			"a880",
			"█",
			7,
			"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"
		],
		[
			"a8a1",
			"āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"
		],
		[
			"a8bd",
			"ńň"
		],
		[
			"a8c0",
			"ɡ"
		],
		[
			"a8c5",
			"ㄅ",
			36
		],
		[
			"a940",
			"〡",
			8,
			"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"
		],
		[
			"a959",
			"℡㈱"
		],
		[
			"a95c",
			"‐"
		],
		[
			"a960",
			"ー゛゜ヽヾ〆ゝゞ﹉",
			9,
			"﹔﹕﹖﹗﹙",
			8
		],
		[
			"a980",
			"﹢",
			4,
			"﹨﹩﹪﹫"
		],
		[
			"a996",
			"〇"
		],
		[
			"a9a4",
			"─",
			75
		],
		[
			"aa40",
			"狜狝狟狢",
			5,
			"狪狫狵狶狹狽狾狿猀猂猄",
			5,
			"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",
			8
		],
		[
			"aa80",
			"獉獊獋獌獎獏獑獓獔獕獖獘",
			7,
			"獡",
			10,
			"獮獰獱"
		],
		[
			"ab40",
			"獲",
			11,
			"獿",
			4,
			"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",
			5,
			"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",
			4
		],
		[
			"ab80",
			"珋珌珎珒",
			6,
			"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",
			4
		],
		[
			"ac40",
			"珸",
			10,
			"琄琇琈琋琌琍琎琑",
			8,
			"琜",
			5,
			"琣琤琧琩琫琭琯琱琲琷",
			4,
			"琽琾琿瑀瑂",
			11
		],
		[
			"ac80",
			"瑎",
			6,
			"瑖瑘瑝瑠",
			12,
			"瑮瑯瑱",
			4,
			"瑸瑹瑺"
		],
		[
			"ad40",
			"瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",
			10,
			"璝璟",
			7,
			"璪",
			15,
			"璻",
			12
		],
		[
			"ad80",
			"瓈",
			9,
			"瓓",
			8,
			"瓝瓟瓡瓥瓧",
			6,
			"瓰瓱瓲"
		],
		[
			"ae40",
			"瓳瓵瓸",
			6,
			"甀甁甂甃甅",
			7,
			"甎甐甒甔甕甖甗甛甝甞甠",
			4,
			"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"
		],
		[
			"ae80",
			"畝",
			7,
			"畧畨畩畫",
			6,
			"畳畵當畷畺",
			4,
			"疀疁疂疄疅疇"
		],
		[
			"af40",
			"疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",
			4,
			"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"
		],
		[
			"af80",
			"瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"
		],
		[
			"b040",
			"癅",
			6,
			"癎",
			5,
			"癕癗",
			4,
			"癝癟癠癡癢癤",
			6,
			"癬癭癮癰",
			7,
			"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"
		],
		[
			"b080",
			"皜",
			7,
			"皥",
			8,
			"皯皰皳皵",
			9,
			"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"
		],
		[
			"b140",
			"盄盇盉盋盌盓盕盙盚盜盝盞盠",
			4,
			"盦",
			7,
			"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",
			10,
			"眛眜眝眞眡眣眤眥眧眪眫"
		],
		[
			"b180",
			"眬眮眰",
			4,
			"眹眻眽眾眿睂睄睅睆睈",
			7,
			"睒",
			7,
			"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"
		],
		[
			"b240",
			"睝睞睟睠睤睧睩睪睭",
			11,
			"睺睻睼瞁瞂瞃瞆",
			5,
			"瞏瞐瞓",
			11,
			"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",
			4
		],
		[
			"b280",
			"瞼瞾矀",
			12,
			"矎",
			8,
			"矘矙矚矝",
			4,
			"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"
		],
		[
			"b340",
			"矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",
			5,
			"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"
		],
		[
			"b380",
			"硛硜硞",
			11,
			"硯",
			7,
			"硸硹硺硻硽",
			6,
			"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"
		],
		[
			"b440",
			"碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",
			7,
			"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",
			9
		],
		[
			"b480",
			"磤磥磦磧磩磪磫磭",
			4,
			"磳磵磶磸磹磻",
			5,
			"礂礃礄礆",
			6,
			"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"
		],
		[
			"b540",
			"礍",
			5,
			"礔",
			9,
			"礟",
			4,
			"礥",
			14,
			"礵",
			4,
			"礽礿祂祃祄祅祇祊",
			8,
			"祔祕祘祙祡祣"
		],
		[
			"b580",
			"祤祦祩祪祫祬祮祰",
			6,
			"祹祻",
			4,
			"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"
		],
		[
			"b640",
			"禓",
			6,
			"禛",
			11,
			"禨",
			10,
			"禴",
			4,
			"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",
			5,
			"秠秡秢秥秨秪"
		],
		[
			"b680",
			"秬秮秱",
			6,
			"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",
			4,
			"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"
		],
		[
			"b740",
			"稝稟稡稢稤",
			14,
			"稴稵稶稸稺稾穀",
			5,
			"穇",
			9,
			"穒",
			4,
			"穘",
			16
		],
		[
			"b780",
			"穩",
			6,
			"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"
		],
		[
			"b840",
			"窣窤窧窩窪窫窮",
			4,
			"窴",
			10,
			"竀",
			10,
			"竌",
			9,
			"竗竘竚竛竜竝竡竢竤竧",
			5,
			"竮竰竱竲竳"
		],
		[
			"b880",
			"竴",
			4,
			"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"
		],
		[
			"b940",
			"笯笰笲笴笵笶笷笹笻笽笿",
			5,
			"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",
			10,
			"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",
			6,
			"箎箏"
		],
		[
			"b980",
			"箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",
			7,
			"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"
		],
		[
			"ba40",
			"篅篈築篊篋篍篎篏篐篒篔",
			4,
			"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",
			4,
			"篸篹篺篻篽篿",
			7,
			"簈簉簊簍簎簐",
			5,
			"簗簘簙"
		],
		[
			"ba80",
			"簚",
			4,
			"簠",
			5,
			"簨簩簫",
			12,
			"簹",
			5,
			"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"
		],
		[
			"bb40",
			"籃",
			9,
			"籎",
			36,
			"籵",
			5,
			"籾",
			9
		],
		[
			"bb80",
			"粈粊",
			6,
			"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",
			4,
			"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"
		],
		[
			"bc40",
			"粿糀糂糃糄糆糉糋糎",
			6,
			"糘糚糛糝糞糡",
			6,
			"糩",
			5,
			"糰",
			7,
			"糹糺糼",
			13,
			"紋",
			5
		],
		[
			"bc80",
			"紑",
			14,
			"紡紣紤紥紦紨紩紪紬紭紮細",
			6,
			"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"
		],
		[
			"bd40",
			"紷",
			54,
			"絯",
			7
		],
		[
			"bd80",
			"絸",
			32,
			"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"
		],
		[
			"be40",
			"継",
			12,
			"綧",
			6,
			"綯",
			42
		],
		[
			"be80",
			"線",
			32,
			"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"
		],
		[
			"bf40",
			"緻",
			62
		],
		[
			"bf80",
			"縺縼",
			4,
			"繂",
			4,
			"繈",
			21,
			"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"
		],
		[
			"c040",
			"繞",
			35,
			"纃",
			23,
			"纜纝纞"
		],
		[
			"c080",
			"纮纴纻纼绖绤绬绹缊缐缞缷缹缻",
			6,
			"罃罆",
			9,
			"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"
		],
		[
			"c140",
			"罖罙罛罜罝罞罠罣",
			4,
			"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",
			7,
			"羋羍羏",
			4,
			"羕",
			4,
			"羛羜羠羢羣羥羦羨",
			6,
			"羱"
		],
		[
			"c180",
			"羳",
			4,
			"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",
			4,
			"翖翗翙",
			5,
			"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"
		],
		[
			"c240",
			"翤翧翨翪翫翬翭翯翲翴",
			6,
			"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",
			5,
			"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"
		],
		[
			"c280",
			"聙聛",
			13,
			"聫",
			5,
			"聲",
			11,
			"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"
		],
		[
			"c340",
			"聾肁肂肅肈肊肍",
			5,
			"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",
			4,
			"胏",
			6,
			"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"
		],
		[
			"c380",
			"脌脕脗脙脛脜脝脟",
			12,
			"脭脮脰脳脴脵脷脹",
			4,
			"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"
		],
		[
			"c440",
			"腀",
			5,
			"腇腉腍腎腏腒腖腗腘腛",
			4,
			"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",
			4,
			"膉膋膌膍膎膐膒",
			5,
			"膙膚膞",
			4,
			"膤膥"
		],
		[
			"c480",
			"膧膩膫",
			7,
			"膴",
			5,
			"膼膽膾膿臄臅臇臈臉臋臍",
			6,
			"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"
		],
		[
			"c540",
			"臔",
			14,
			"臤臥臦臨臩臫臮",
			4,
			"臵",
			5,
			"臽臿舃與",
			4,
			"舎舏舑舓舕",
			5,
			"舝舠舤舥舦舧舩舮舲舺舼舽舿"
		],
		[
			"c580",
			"艀艁艂艃艅艆艈艊艌艍艎艐",
			7,
			"艙艛艜艝艞艠",
			7,
			"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"
		],
		[
			"c640",
			"艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"
		],
		[
			"c680",
			"苺苼",
			4,
			"茊茋茍茐茒茓茖茘茙茝",
			9,
			"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"
		],
		[
			"c740",
			"茾茿荁荂荄荅荈荊",
			4,
			"荓荕",
			4,
			"荝荢荰",
			6,
			"荹荺荾",
			6,
			"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",
			6,
			"莬莭莮"
		],
		[
			"c780",
			"莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"
		],
		[
			"c840",
			"菮華菳",
			4,
			"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",
			5,
			"萙萚萛萞",
			5,
			"萩",
			7,
			"萲",
			5,
			"萹萺萻萾",
			7,
			"葇葈葉"
		],
		[
			"c880",
			"葊",
			6,
			"葒",
			4,
			"葘葝葞葟葠葢葤",
			4,
			"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"
		],
		[
			"c940",
			"葽",
			4,
			"蒃蒄蒅蒆蒊蒍蒏",
			7,
			"蒘蒚蒛蒝蒞蒟蒠蒢",
			12,
			"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"
		],
		[
			"c980",
			"蓘",
			4,
			"蓞蓡蓢蓤蓧",
			4,
			"蓭蓮蓯蓱",
			10,
			"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"
		],
		[
			"ca40",
			"蔃",
			8,
			"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",
			8,
			"蔭",
			9,
			"蔾",
			4,
			"蕄蕅蕆蕇蕋",
			10
		],
		[
			"ca80",
			"蕗蕘蕚蕛蕜蕝蕟",
			4,
			"蕥蕦蕧蕩",
			8,
			"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"
		],
		[
			"cb40",
			"薂薃薆薈",
			6,
			"薐",
			10,
			"薝",
			6,
			"薥薦薧薩薫薬薭薱",
			5,
			"薸薺",
			6,
			"藂",
			6,
			"藊",
			4,
			"藑藒"
		],
		[
			"cb80",
			"藔藖",
			5,
			"藝",
			6,
			"藥藦藧藨藪",
			14,
			"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"
		],
		[
			"cc40",
			"藹藺藼藽藾蘀",
			4,
			"蘆",
			10,
			"蘒蘓蘔蘕蘗",
			15,
			"蘨蘪",
			13,
			"蘹蘺蘻蘽蘾蘿虀"
		],
		[
			"cc80",
			"虁",
			11,
			"虒虓處",
			4,
			"虛虜虝號虠虡虣",
			7,
			"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"
		],
		[
			"cd40",
			"虭虯虰虲",
			6,
			"蚃",
			6,
			"蚎",
			4,
			"蚔蚖",
			5,
			"蚞",
			4,
			"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",
			4,
			"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"
		],
		[
			"cd80",
			"蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"
		],
		[
			"ce40",
			"蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",
			6,
			"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",
			5,
			"蝡蝢蝦",
			7,
			"蝯蝱蝲蝳蝵"
		],
		[
			"ce80",
			"蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",
			4,
			"螔螕螖螘",
			6,
			"螠",
			4,
			"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"
		],
		[
			"cf40",
			"螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",
			4,
			"蟇蟈蟉蟌",
			4,
			"蟔",
			6,
			"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",
			9
		],
		[
			"cf80",
			"蟺蟻蟼蟽蟿蠀蠁蠂蠄",
			5,
			"蠋",
			7,
			"蠔蠗蠘蠙蠚蠜",
			4,
			"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"
		],
		[
			"d040",
			"蠤",
			13,
			"蠳",
			5,
			"蠺蠻蠽蠾蠿衁衂衃衆",
			5,
			"衎",
			5,
			"衕衖衘衚",
			6,
			"衦衧衪衭衯衱衳衴衵衶衸衹衺"
		],
		[
			"d080",
			"衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",
			4,
			"袝",
			4,
			"袣袥",
			5,
			"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"
		],
		[
			"d140",
			"袬袮袯袰袲",
			4,
			"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",
			4,
			"裠裡裦裧裩",
			6,
			"裲裵裶裷裺裻製裿褀褁褃",
			5
		],
		[
			"d180",
			"褉褋",
			4,
			"褑褔",
			4,
			"褜",
			4,
			"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"
		],
		[
			"d240",
			"褸",
			8,
			"襂襃襅",
			24,
			"襠",
			5,
			"襧",
			19,
			"襼"
		],
		[
			"d280",
			"襽襾覀覂覄覅覇",
			26,
			"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"
		],
		[
			"d340",
			"覢",
			30,
			"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",
			6
		],
		[
			"d380",
			"觻",
			4,
			"訁",
			5,
			"計",
			21,
			"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"
		],
		[
			"d440",
			"訞",
			31,
			"訿",
			8,
			"詉",
			21
		],
		[
			"d480",
			"詟",
			25,
			"詺",
			6,
			"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"
		],
		[
			"d540",
			"誁",
			7,
			"誋",
			7,
			"誔",
			46
		],
		[
			"d580",
			"諃",
			32,
			"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"
		],
		[
			"d640",
			"諤",
			34,
			"謈",
			27
		],
		[
			"d680",
			"謤謥謧",
			30,
			"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"
		],
		[
			"d740",
			"譆",
			31,
			"譧",
			4,
			"譭",
			25
		],
		[
			"d780",
			"讇",
			24,
			"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"
		],
		[
			"d840",
			"谸",
			8,
			"豂豃豄豅豈豊豋豍",
			7,
			"豖豗豘豙豛",
			5,
			"豣",
			6,
			"豬",
			6,
			"豴豵豶豷豻",
			6,
			"貃貄貆貇"
		],
		[
			"d880",
			"貈貋貍",
			6,
			"貕貖貗貙",
			20,
			"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"
		],
		[
			"d940",
			"貮",
			62
		],
		[
			"d980",
			"賭",
			32,
			"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"
		],
		[
			"da40",
			"贎",
			14,
			"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",
			8,
			"趂趃趆趇趈趉趌",
			4,
			"趒趓趕",
			9,
			"趠趡"
		],
		[
			"da80",
			"趢趤",
			12,
			"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"
		],
		[
			"db40",
			"跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",
			6,
			"踆踇踈踋踍踎踐踑踒踓踕",
			7,
			"踠踡踤",
			4,
			"踫踭踰踲踳踴踶踷踸踻踼踾"
		],
		[
			"db80",
			"踿蹃蹅蹆蹌",
			4,
			"蹓",
			5,
			"蹚",
			11,
			"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"
		],
		[
			"dc40",
			"蹳蹵蹷",
			4,
			"蹽蹾躀躂躃躄躆躈",
			6,
			"躑躒躓躕",
			6,
			"躝躟",
			11,
			"躭躮躰躱躳",
			6,
			"躻",
			7
		],
		[
			"dc80",
			"軃",
			10,
			"軏",
			21,
			"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"
		],
		[
			"dd40",
			"軥",
			62
		],
		[
			"dd80",
			"輤",
			32,
			"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"
		],
		[
			"de40",
			"轅",
			32,
			"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"
		],
		[
			"de80",
			"迉",
			4,
			"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"
		],
		[
			"df40",
			"這逜連逤逥逧",
			5,
			"逰",
			4,
			"逷逹逺逽逿遀遃遅遆遈",
			4,
			"過達違遖遙遚遜",
			5,
			"遤遦遧適遪遫遬遯",
			4,
			"遶",
			6,
			"遾邁"
		],
		[
			"df80",
			"還邅邆邇邉邊邌",
			4,
			"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"
		],
		[
			"e040",
			"郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",
			19,
			"鄚鄛鄜"
		],
		[
			"e080",
			"鄝鄟鄠鄡鄤",
			10,
			"鄰鄲",
			6,
			"鄺",
			8,
			"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"
		],
		[
			"e140",
			"酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",
			4,
			"醆醈醊醎醏醓",
			6,
			"醜",
			5,
			"醤",
			5,
			"醫醬醰醱醲醳醶醷醸醹醻"
		],
		[
			"e180",
			"醼",
			10,
			"釈釋釐釒",
			9,
			"針",
			8,
			"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"
		],
		[
			"e240",
			"釦",
			62
		],
		[
			"e280",
			"鈥",
			32,
			"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",
			5,
			"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"
		],
		[
			"e340",
			"鉆",
			45,
			"鉵",
			16
		],
		[
			"e380",
			"銆",
			7,
			"銏",
			24,
			"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"
		],
		[
			"e440",
			"銨",
			5,
			"銯",
			24,
			"鋉",
			31
		],
		[
			"e480",
			"鋩",
			32,
			"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"
		],
		[
			"e540",
			"錊",
			51,
			"錿",
			10
		],
		[
			"e580",
			"鍊",
			31,
			"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"
		],
		[
			"e640",
			"鍬",
			34,
			"鎐",
			27
		],
		[
			"e680",
			"鎬",
			29,
			"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"
		],
		[
			"e740",
			"鏎",
			7,
			"鏗",
			54
		],
		[
			"e780",
			"鐎",
			32,
			"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",
			6,
			"缪缫缬缭缯",
			4,
			"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"
		],
		[
			"e840",
			"鐯",
			14,
			"鐿",
			43,
			"鑬鑭鑮鑯"
		],
		[
			"e880",
			"鑰",
			20,
			"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"
		],
		[
			"e940",
			"锧锳锽镃镈镋镕镚镠镮镴镵長",
			7,
			"門",
			42
		],
		[
			"e980",
			"閫",
			32,
			"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"
		],
		[
			"ea40",
			"闌",
			27,
			"闬闿阇阓阘阛阞阠阣",
			6,
			"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"
		],
		[
			"ea80",
			"陘陙陚陜陝陞陠陣陥陦陫陭",
			4,
			"陳陸",
			12,
			"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"
		],
		[
			"eb40",
			"隌階隑隒隓隕隖隚際隝",
			9,
			"隨",
			7,
			"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",
			9,
			"雡",
			6,
			"雫"
		],
		[
			"eb80",
			"雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",
			4,
			"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"
		],
		[
			"ec40",
			"霡",
			8,
			"霫霬霮霯霱霳",
			4,
			"霺霻霼霽霿",
			18,
			"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",
			7
		],
		[
			"ec80",
			"靲靵靷",
			4,
			"靽",
			7,
			"鞆",
			4,
			"鞌鞎鞏鞐鞓鞕鞖鞗鞙",
			4,
			"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"
		],
		[
			"ed40",
			"鞞鞟鞡鞢鞤",
			6,
			"鞬鞮鞰鞱鞳鞵",
			46
		],
		[
			"ed80",
			"韤韥韨韮",
			4,
			"韴韷",
			23,
			"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"
		],
		[
			"ee40",
			"頏",
			62
		],
		[
			"ee80",
			"顎",
			32,
			"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",
			4,
			"钼钽钿铄铈",
			6,
			"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"
		],
		[
			"ef40",
			"顯",
			5,
			"颋颎颒颕颙颣風",
			37,
			"飏飐飔飖飗飛飜飝飠",
			4
		],
		[
			"ef80",
			"飥飦飩",
			30,
			"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",
			4,
			"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",
			8,
			"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"
		],
		[
			"f040",
			"餈",
			4,
			"餎餏餑",
			28,
			"餯",
			26
		],
		[
			"f080",
			"饊",
			9,
			"饖",
			12,
			"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",
			4,
			"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",
			6,
			"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"
		],
		[
			"f140",
			"馌馎馚",
			10,
			"馦馧馩",
			47
		],
		[
			"f180",
			"駙",
			32,
			"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"
		],
		[
			"f240",
			"駺",
			62
		],
		[
			"f280",
			"騹",
			32,
			"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"
		],
		[
			"f340",
			"驚",
			17,
			"驲骃骉骍骎骔骕骙骦骩",
			6,
			"骲骳骴骵骹骻骽骾骿髃髄髆",
			4,
			"髍髎髏髐髒體髕髖髗髙髚髛髜"
		],
		[
			"f380",
			"髝髞髠髢髣髤髥髧髨髩髪髬髮髰",
			8,
			"髺髼",
			6,
			"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"
		],
		[
			"f440",
			"鬇鬉",
			5,
			"鬐鬑鬒鬔",
			10,
			"鬠鬡鬢鬤",
			10,
			"鬰鬱鬳",
			7,
			"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",
			5
		],
		[
			"f480",
			"魛",
			32,
			"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"
		],
		[
			"f540",
			"魼",
			62
		],
		[
			"f580",
			"鮻",
			32,
			"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"
		],
		[
			"f640",
			"鯜",
			62
		],
		[
			"f680",
			"鰛",
			32,
			"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",
			5,
			"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",
			5,
			"鲥",
			4,
			"鲫鲭鲮鲰",
			7,
			"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"
		],
		[
			"f740",
			"鰼",
			62
		],
		[
			"f780",
			"鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",
			4,
			"鳈鳉鳑鳒鳚鳛鳠鳡鳌",
			4,
			"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"
		],
		[
			"f840",
			"鳣",
			62
		],
		[
			"f880",
			"鴢",
			32
		],
		[
			"f940",
			"鵃",
			62
		],
		[
			"f980",
			"鶂",
			32
		],
		[
			"fa40",
			"鶣",
			62
		],
		[
			"fa80",
			"鷢",
			32
		],
		[
			"fb40",
			"鸃",
			27,
			"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",
			9,
			"麀"
		],
		[
			"fb80",
			"麁麃麄麅麆麉麊麌",
			5,
			"麔",
			8,
			"麞麠",
			5,
			"麧麨麩麪"
		],
		[
			"fc40",
			"麫",
			8,
			"麵麶麷麹麺麼麿",
			4,
			"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",
			8,
			"黺黽黿",
			6
		],
		[
			"fc80",
			"鼆",
			4,
			"鼌鼏鼑鼒鼔鼕鼖鼘鼚",
			5,
			"鼡鼣",
			8,
			"鼭鼮鼰鼱"
		],
		[
			"fd40",
			"鼲",
			4,
			"鼸鼺鼼鼿",
			4,
			"齅",
			10,
			"齒",
			38
		],
		[
			"fd80",
			"齹",
			5,
			"龁龂龍",
			11,
			"龜龝龞龡",
			4,
			"郎凉秊裏隣"
		],
		[
			"fe40",
			"兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"
		]
	];

	var require$$3 = [
		[
			"a140",
			"",
			62
		],
		[
			"a180",
			"",
			32
		],
		[
			"a240",
			"",
			62
		],
		[
			"a280",
			"",
			32
		],
		[
			"a2ab",
			"",
			5
		],
		[
			"a2e3",
			"€"
		],
		[
			"a2ef",
			""
		],
		[
			"a2fd",
			""
		],
		[
			"a340",
			"",
			62
		],
		[
			"a380",
			"",
			31,
			"　"
		],
		[
			"a440",
			"",
			62
		],
		[
			"a480",
			"",
			32
		],
		[
			"a4f4",
			"",
			10
		],
		[
			"a540",
			"",
			62
		],
		[
			"a580",
			"",
			32
		],
		[
			"a5f7",
			"",
			7
		],
		[
			"a640",
			"",
			62
		],
		[
			"a680",
			"",
			32
		],
		[
			"a6b9",
			"",
			7
		],
		[
			"a6d9",
			"",
			6
		],
		[
			"a6ec",
			""
		],
		[
			"a6f3",
			""
		],
		[
			"a6f6",
			"",
			8
		],
		[
			"a740",
			"",
			62
		],
		[
			"a780",
			"",
			32
		],
		[
			"a7c2",
			"",
			14
		],
		[
			"a7f2",
			"",
			12
		],
		[
			"a896",
			"",
			10
		],
		[
			"a8bc",
			"ḿ"
		],
		[
			"a8bf",
			"ǹ"
		],
		[
			"a8c1",
			""
		],
		[
			"a8ea",
			"",
			20
		],
		[
			"a958",
			""
		],
		[
			"a95b",
			""
		],
		[
			"a95d",
			""
		],
		[
			"a989",
			"〾⿰",
			11
		],
		[
			"a997",
			"",
			12
		],
		[
			"a9f0",
			"",
			14
		],
		[
			"aaa1",
			"",
			93
		],
		[
			"aba1",
			"",
			93
		],
		[
			"aca1",
			"",
			93
		],
		[
			"ada1",
			"",
			93
		],
		[
			"aea1",
			"",
			93
		],
		[
			"afa1",
			"",
			93
		],
		[
			"d7fa",
			"",
			4
		],
		[
			"f8a1",
			"",
			93
		],
		[
			"f9a1",
			"",
			93
		],
		[
			"faa1",
			"",
			93
		],
		[
			"fba1",
			"",
			93
		],
		[
			"fca1",
			"",
			93
		],
		[
			"fda1",
			"",
			93
		],
		[
			"fe50",
			"⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"
		],
		[
			"fe80",
			"䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",
			6,
			"䶮",
			93
		],
		[
			"8135f437",
			""
		]
	];

	var uChars = [
		128,
		165,
		169,
		178,
		184,
		216,
		226,
		235,
		238,
		244,
		248,
		251,
		253,
		258,
		276,
		284,
		300,
		325,
		329,
		334,
		364,
		463,
		465,
		467,
		469,
		471,
		473,
		475,
		477,
		506,
		594,
		610,
		712,
		716,
		730,
		930,
		938,
		962,
		970,
		1026,
		1104,
		1106,
		8209,
		8215,
		8218,
		8222,
		8231,
		8241,
		8244,
		8246,
		8252,
		8365,
		8452,
		8454,
		8458,
		8471,
		8482,
		8556,
		8570,
		8596,
		8602,
		8713,
		8720,
		8722,
		8726,
		8731,
		8737,
		8740,
		8742,
		8748,
		8751,
		8760,
		8766,
		8777,
		8781,
		8787,
		8802,
		8808,
		8816,
		8854,
		8858,
		8870,
		8896,
		8979,
		9322,
		9372,
		9548,
		9588,
		9616,
		9622,
		9634,
		9652,
		9662,
		9672,
		9676,
		9680,
		9702,
		9735,
		9738,
		9793,
		9795,
		11906,
		11909,
		11913,
		11917,
		11928,
		11944,
		11947,
		11951,
		11956,
		11960,
		11964,
		11979,
		12284,
		12292,
		12312,
		12319,
		12330,
		12351,
		12436,
		12447,
		12535,
		12543,
		12586,
		12842,
		12850,
		12964,
		13200,
		13215,
		13218,
		13253,
		13263,
		13267,
		13270,
		13384,
		13428,
		13727,
		13839,
		13851,
		14617,
		14703,
		14801,
		14816,
		14964,
		15183,
		15471,
		15585,
		16471,
		16736,
		17208,
		17325,
		17330,
		17374,
		17623,
		17997,
		18018,
		18212,
		18218,
		18301,
		18318,
		18760,
		18811,
		18814,
		18820,
		18823,
		18844,
		18848,
		18872,
		19576,
		19620,
		19738,
		19887,
		40870,
		59244,
		59336,
		59367,
		59413,
		59417,
		59423,
		59431,
		59437,
		59443,
		59452,
		59460,
		59478,
		59493,
		63789,
		63866,
		63894,
		63976,
		63986,
		64016,
		64018,
		64021,
		64025,
		64034,
		64037,
		64042,
		65074,
		65093,
		65107,
		65112,
		65127,
		65132,
		65375,
		65510,
		65536
	];
	var gbChars = [
		0,
		36,
		38,
		45,
		50,
		81,
		89,
		95,
		96,
		100,
		103,
		104,
		105,
		109,
		126,
		133,
		148,
		172,
		175,
		179,
		208,
		306,
		307,
		308,
		309,
		310,
		311,
		312,
		313,
		341,
		428,
		443,
		544,
		545,
		558,
		741,
		742,
		749,
		750,
		805,
		819,
		820,
		7922,
		7924,
		7925,
		7927,
		7934,
		7943,
		7944,
		7945,
		7950,
		8062,
		8148,
		8149,
		8152,
		8164,
		8174,
		8236,
		8240,
		8262,
		8264,
		8374,
		8380,
		8381,
		8384,
		8388,
		8390,
		8392,
		8393,
		8394,
		8396,
		8401,
		8406,
		8416,
		8419,
		8424,
		8437,
		8439,
		8445,
		8482,
		8485,
		8496,
		8521,
		8603,
		8936,
		8946,
		9046,
		9050,
		9063,
		9066,
		9076,
		9092,
		9100,
		9108,
		9111,
		9113,
		9131,
		9162,
		9164,
		9218,
		9219,
		11329,
		11331,
		11334,
		11336,
		11346,
		11361,
		11363,
		11366,
		11370,
		11372,
		11375,
		11389,
		11682,
		11686,
		11687,
		11692,
		11694,
		11714,
		11716,
		11723,
		11725,
		11730,
		11736,
		11982,
		11989,
		12102,
		12336,
		12348,
		12350,
		12384,
		12393,
		12395,
		12397,
		12510,
		12553,
		12851,
		12962,
		12973,
		13738,
		13823,
		13919,
		13933,
		14080,
		14298,
		14585,
		14698,
		15583,
		15847,
		16318,
		16434,
		16438,
		16481,
		16729,
		17102,
		17122,
		17315,
		17320,
		17402,
		17418,
		17859,
		17909,
		17911,
		17915,
		17916,
		17936,
		17939,
		17961,
		18664,
		18703,
		18814,
		18962,
		19043,
		33469,
		33470,
		33471,
		33484,
		33485,
		33490,
		33497,
		33501,
		33505,
		33513,
		33520,
		33536,
		33550,
		37845,
		37921,
		37948,
		38029,
		38038,
		38064,
		38065,
		38066,
		38069,
		38075,
		38076,
		38078,
		39108,
		39109,
		39113,
		39114,
		39115,
		39116,
		39265,
		39394,
		189000
	];
	var require$$4$1 = {
		uChars: uChars,
		gbChars: gbChars
	};

	var require$$5 = [
		[
			"0",
			"\u0000",
			127
		],
		[
			"8141",
			"갂갃갅갆갋",
			4,
			"갘갞갟갡갢갣갥",
			6,
			"갮갲갳갴"
		],
		[
			"8161",
			"갵갶갷갺갻갽갾갿걁",
			9,
			"걌걎",
			5,
			"걕"
		],
		[
			"8181",
			"걖걗걙걚걛걝",
			18,
			"걲걳걵걶걹걻",
			4,
			"겂겇겈겍겎겏겑겒겓겕",
			6,
			"겞겢",
			5,
			"겫겭겮겱",
			6,
			"겺겾겿곀곂곃곅곆곇곉곊곋곍",
			7,
			"곖곘",
			7,
			"곢곣곥곦곩곫곭곮곲곴곷",
			4,
			"곾곿괁괂괃괅괇",
			4,
			"괎괐괒괓"
		],
		[
			"8241",
			"괔괕괖괗괙괚괛괝괞괟괡",
			7,
			"괪괫괮",
			5
		],
		[
			"8261",
			"괶괷괹괺괻괽",
			6,
			"굆굈굊",
			5,
			"굑굒굓굕굖굗"
		],
		[
			"8281",
			"굙",
			7,
			"굢굤",
			7,
			"굮굯굱굲굷굸굹굺굾궀궃",
			4,
			"궊궋궍궎궏궑",
			10,
			"궞",
			5,
			"궥",
			17,
			"궸",
			7,
			"귂귃귅귆귇귉",
			6,
			"귒귔",
			7,
			"귝귞귟귡귢귣귥",
			18
		],
		[
			"8341",
			"귺귻귽귾긂",
			5,
			"긊긌긎",
			5,
			"긕",
			7
		],
		[
			"8361",
			"긝",
			18,
			"긲긳긵긶긹긻긼"
		],
		[
			"8381",
			"긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",
			4,
			"깞깢깣깤깦깧깪깫깭깮깯깱",
			6,
			"깺깾",
			5,
			"꺆",
			5,
			"꺍",
			46,
			"꺿껁껂껃껅",
			6,
			"껎껒",
			5,
			"껚껛껝",
			8
		],
		[
			"8441",
			"껦껧껩껪껬껮",
			5,
			"껵껶껷껹껺껻껽",
			8
		],
		[
			"8461",
			"꼆꼉꼊꼋꼌꼎꼏꼑",
			18
		],
		[
			"8481",
			"꼤",
			7,
			"꼮꼯꼱꼳꼵",
			6,
			"꼾꽀꽄꽅꽆꽇꽊",
			5,
			"꽑",
			10,
			"꽞",
			5,
			"꽦",
			18,
			"꽺",
			5,
			"꾁꾂꾃꾅꾆꾇꾉",
			6,
			"꾒꾓꾔꾖",
			5,
			"꾝",
			26,
			"꾺꾻꾽꾾"
		],
		[
			"8541",
			"꾿꿁",
			5,
			"꿊꿌꿏",
			4,
			"꿕",
			6,
			"꿝",
			4
		],
		[
			"8561",
			"꿢",
			5,
			"꿪",
			5,
			"꿲꿳꿵꿶꿷꿹",
			6,
			"뀂뀃"
		],
		[
			"8581",
			"뀅",
			6,
			"뀍뀎뀏뀑뀒뀓뀕",
			6,
			"뀞",
			9,
			"뀩",
			26,
			"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",
			29,
			"끾끿낁낂낃낅",
			6,
			"낎낐낒",
			5,
			"낛낝낞낣낤"
		],
		[
			"8641",
			"낥낦낧낪낰낲낶낷낹낺낻낽",
			6,
			"냆냊",
			5,
			"냒"
		],
		[
			"8661",
			"냓냕냖냗냙",
			6,
			"냡냢냣냤냦",
			10
		],
		[
			"8681",
			"냱",
			22,
			"넊넍넎넏넑넔넕넖넗넚넞",
			4,
			"넦넧넩넪넫넭",
			6,
			"넶넺",
			5,
			"녂녃녅녆녇녉",
			6,
			"녒녓녖녗녙녚녛녝녞녟녡",
			22,
			"녺녻녽녾녿놁놃",
			4,
			"놊놌놎놏놐놑놕놖놗놙놚놛놝"
		],
		[
			"8741",
			"놞",
			9,
			"놩",
			15
		],
		[
			"8761",
			"놹",
			18,
			"뇍뇎뇏뇑뇒뇓뇕"
		],
		[
			"8781",
			"뇖",
			5,
			"뇞뇠",
			7,
			"뇪뇫뇭뇮뇯뇱",
			7,
			"뇺뇼뇾",
			5,
			"눆눇눉눊눍",
			6,
			"눖눘눚",
			5,
			"눡",
			18,
			"눵",
			6,
			"눽",
			26,
			"뉙뉚뉛뉝뉞뉟뉡",
			6,
			"뉪",
			4
		],
		[
			"8841",
			"뉯",
			4,
			"뉶",
			5,
			"뉽",
			6,
			"늆늇늈늊",
			4
		],
		[
			"8861",
			"늏늒늓늕늖늗늛",
			4,
			"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"
		],
		[
			"8881",
			"늸",
			15,
			"닊닋닍닎닏닑닓",
			4,
			"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",
			6,
			"댒댖",
			5,
			"댝",
			54,
			"덗덙덚덝덠덡덢덣"
		],
		[
			"8941",
			"덦덨덪덬덭덯덲덳덵덶덷덹",
			6,
			"뎂뎆",
			5,
			"뎍"
		],
		[
			"8961",
			"뎎뎏뎑뎒뎓뎕",
			10,
			"뎢",
			5,
			"뎩뎪뎫뎭"
		],
		[
			"8981",
			"뎮",
			21,
			"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",
			18,
			"돽",
			18,
			"됑",
			6,
			"됙됚됛됝됞됟됡",
			6,
			"됪됬",
			7,
			"됵",
			15
		],
		[
			"8a41",
			"둅",
			10,
			"둒둓둕둖둗둙",
			6,
			"둢둤둦"
		],
		[
			"8a61",
			"둧",
			4,
			"둭",
			18,
			"뒁뒂"
		],
		[
			"8a81",
			"뒃",
			4,
			"뒉",
			19,
			"뒞",
			5,
			"뒥뒦뒧뒩뒪뒫뒭",
			7,
			"뒶뒸뒺",
			5,
			"듁듂듃듅듆듇듉",
			6,
			"듑듒듓듔듖",
			5,
			"듞듟듡듢듥듧",
			4,
			"듮듰듲",
			5,
			"듹",
			26,
			"딖딗딙딚딝"
		],
		[
			"8b41",
			"딞",
			5,
			"딦딫",
			4,
			"딲딳딵딶딷딹",
			6,
			"땂땆"
		],
		[
			"8b61",
			"땇땈땉땊땎땏땑땒땓땕",
			6,
			"땞땢",
			8
		],
		[
			"8b81",
			"땫",
			52,
			"떢떣떥떦떧떩떬떭떮떯떲떶",
			4,
			"떾떿뗁뗂뗃뗅",
			6,
			"뗎뗒",
			5,
			"뗙",
			18,
			"뗭",
			18
		],
		[
			"8c41",
			"똀",
			15,
			"똒똓똕똖똗똙",
			4
		],
		[
			"8c61",
			"똞",
			6,
			"똦",
			5,
			"똭",
			6,
			"똵",
			5
		],
		[
			"8c81",
			"똻",
			12,
			"뙉",
			26,
			"뙥뙦뙧뙩",
			50,
			"뚞뚟뚡뚢뚣뚥",
			5,
			"뚭뚮뚯뚰뚲",
			16
		],
		[
			"8d41",
			"뛃",
			16,
			"뛕",
			8
		],
		[
			"8d61",
			"뛞",
			17,
			"뛱뛲뛳뛵뛶뛷뛹뛺"
		],
		[
			"8d81",
			"뛻",
			4,
			"뜂뜃뜄뜆",
			33,
			"뜪뜫뜭뜮뜱",
			6,
			"뜺뜼",
			7,
			"띅띆띇띉띊띋띍",
			6,
			"띖",
			9,
			"띡띢띣띥띦띧띩",
			6,
			"띲띴띶",
			5,
			"띾띿랁랂랃랅",
			6,
			"랎랓랔랕랚랛랝랞"
		],
		[
			"8e41",
			"랟랡",
			6,
			"랪랮",
			5,
			"랶랷랹",
			8
		],
		[
			"8e61",
			"럂",
			4,
			"럈럊",
			19
		],
		[
			"8e81",
			"럞",
			13,
			"럮럯럱럲럳럵",
			6,
			"럾렂",
			4,
			"렊렋렍렎렏렑",
			6,
			"렚렜렞",
			5,
			"렦렧렩렪렫렭",
			6,
			"렶렺",
			5,
			"롁롂롃롅",
			11,
			"롒롔",
			7,
			"롞롟롡롢롣롥",
			6,
			"롮롰롲",
			5,
			"롹롺롻롽",
			7
		],
		[
			"8f41",
			"뢅",
			7,
			"뢎",
			17
		],
		[
			"8f61",
			"뢠",
			7,
			"뢩",
			6,
			"뢱뢲뢳뢵뢶뢷뢹",
			4
		],
		[
			"8f81",
			"뢾뢿룂룄룆",
			5,
			"룍룎룏룑룒룓룕",
			7,
			"룞룠룢",
			5,
			"룪룫룭룮룯룱",
			6,
			"룺룼룾",
			5,
			"뤅",
			18,
			"뤙",
			6,
			"뤡",
			26,
			"뤾뤿륁륂륃륅",
			6,
			"륍륎륐륒",
			5
		],
		[
			"9041",
			"륚륛륝륞륟륡",
			6,
			"륪륬륮",
			5,
			"륶륷륹륺륻륽"
		],
		[
			"9061",
			"륾",
			5,
			"릆릈릋릌릏",
			15
		],
		[
			"9081",
			"릟",
			12,
			"릮릯릱릲릳릵",
			6,
			"릾맀맂",
			5,
			"맊맋맍맓",
			4,
			"맚맜맟맠맢맦맧맩맪맫맭",
			6,
			"맶맻",
			4,
			"먂",
			5,
			"먉",
			11,
			"먖",
			33,
			"먺먻먽먾먿멁멃멄멅멆"
		],
		[
			"9141",
			"멇멊멌멏멐멑멒멖멗멙멚멛멝",
			6,
			"멦멪",
			5
		],
		[
			"9161",
			"멲멳멵멶멷멹",
			9,
			"몆몈몉몊몋몍",
			5
		],
		[
			"9181",
			"몓",
			20,
			"몪몭몮몯몱몳",
			4,
			"몺몼몾",
			5,
			"뫅뫆뫇뫉",
			14,
			"뫚",
			33,
			"뫽뫾뫿묁묂묃묅",
			7,
			"묎묐묒",
			5,
			"묙묚묛묝묞묟묡",
			6
		],
		[
			"9241",
			"묨묪묬",
			7,
			"묷묹묺묿",
			4,
			"뭆뭈뭊뭋뭌뭎뭑뭒"
		],
		[
			"9261",
			"뭓뭕뭖뭗뭙",
			7,
			"뭢뭤",
			7,
			"뭭",
			4
		],
		[
			"9281",
			"뭲",
			21,
			"뮉뮊뮋뮍뮎뮏뮑",
			18,
			"뮥뮦뮧뮩뮪뮫뮭",
			6,
			"뮵뮶뮸",
			7,
			"믁믂믃믅믆믇믉",
			6,
			"믑믒믔",
			35,
			"믺믻믽믾밁"
		],
		[
			"9341",
			"밃",
			4,
			"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"
		],
		[
			"9361",
			"밶밷밹",
			6,
			"뱂뱆뱇뱈뱊뱋뱎뱏뱑",
			8
		],
		[
			"9381",
			"뱚뱛뱜뱞",
			37,
			"벆벇벉벊벍벏",
			4,
			"벖벘벛",
			4,
			"벢벣벥벦벩",
			6,
			"벲벶",
			5,
			"벾벿볁볂볃볅",
			7,
			"볎볒볓볔볖볗볙볚볛볝",
			22,
			"볷볹볺볻볽"
		],
		[
			"9441",
			"볾",
			5,
			"봆봈봊",
			5,
			"봑봒봓봕",
			8
		],
		[
			"9461",
			"봞",
			5,
			"봥",
			6,
			"봭",
			12
		],
		[
			"9481",
			"봺",
			5,
			"뵁",
			6,
			"뵊뵋뵍뵎뵏뵑",
			6,
			"뵚",
			9,
			"뵥뵦뵧뵩",
			22,
			"붂붃붅붆붋",
			4,
			"붒붔붖붗붘붛붝",
			6,
			"붥",
			10,
			"붱",
			6,
			"붹",
			24
		],
		[
			"9541",
			"뷒뷓뷖뷗뷙뷚뷛뷝",
			11,
			"뷪",
			5,
			"뷱"
		],
		[
			"9561",
			"뷲뷳뷵뷶뷷뷹",
			6,
			"븁븂븄븆",
			5,
			"븎븏븑븒븓"
		],
		[
			"9581",
			"븕",
			6,
			"븞븠",
			35,
			"빆빇빉빊빋빍빏",
			4,
			"빖빘빜빝빞빟빢빣빥빦빧빩빫",
			4,
			"빲빶",
			4,
			"빾빿뺁뺂뺃뺅",
			6,
			"뺎뺒",
			5,
			"뺚",
			13,
			"뺩",
			14
		],
		[
			"9641",
			"뺸",
			23,
			"뻒뻓"
		],
		[
			"9661",
			"뻕뻖뻙",
			6,
			"뻡뻢뻦",
			5,
			"뻭",
			8
		],
		[
			"9681",
			"뻶",
			10,
			"뼂",
			5,
			"뼊",
			13,
			"뼚뼞",
			33,
			"뽂뽃뽅뽆뽇뽉",
			6,
			"뽒뽓뽔뽖",
			44
		],
		[
			"9741",
			"뾃",
			16,
			"뾕",
			8
		],
		[
			"9761",
			"뾞",
			17,
			"뾱",
			7
		],
		[
			"9781",
			"뾹",
			11,
			"뿆",
			5,
			"뿎뿏뿑뿒뿓뿕",
			6,
			"뿝뿞뿠뿢",
			89,
			"쀽쀾쀿"
		],
		[
			"9841",
			"쁀",
			16,
			"쁒",
			5,
			"쁙쁚쁛"
		],
		[
			"9861",
			"쁝쁞쁟쁡",
			6,
			"쁪",
			15
		],
		[
			"9881",
			"쁺",
			21,
			"삒삓삕삖삗삙",
			6,
			"삢삤삦",
			5,
			"삮삱삲삷",
			4,
			"삾샂샃샄샆샇샊샋샍샎샏샑",
			6,
			"샚샞",
			5,
			"샦샧샩샪샫샭",
			6,
			"샶샸샺",
			5,
			"섁섂섃섅섆섇섉",
			6,
			"섑섒섓섔섖",
			5,
			"섡섢섥섨섩섪섫섮"
		],
		[
			"9941",
			"섲섳섴섵섷섺섻섽섾섿셁",
			6,
			"셊셎",
			5,
			"셖셗"
		],
		[
			"9961",
			"셙셚셛셝",
			6,
			"셦셪",
			5,
			"셱셲셳셵셶셷셹셺셻"
		],
		[
			"9981",
			"셼",
			8,
			"솆",
			5,
			"솏솑솒솓솕솗",
			4,
			"솞솠솢솣솤솦솧솪솫솭솮솯솱",
			11,
			"솾",
			5,
			"쇅쇆쇇쇉쇊쇋쇍",
			6,
			"쇕쇖쇙",
			6,
			"쇡쇢쇣쇥쇦쇧쇩",
			6,
			"쇲쇴",
			7,
			"쇾쇿숁숂숃숅",
			6,
			"숎숐숒",
			5,
			"숚숛숝숞숡숢숣"
		],
		[
			"9a41",
			"숤숥숦숧숪숬숮숰숳숵",
			16
		],
		[
			"9a61",
			"쉆쉇쉉",
			6,
			"쉒쉓쉕쉖쉗쉙",
			6,
			"쉡쉢쉣쉤쉦"
		],
		[
			"9a81",
			"쉧",
			4,
			"쉮쉯쉱쉲쉳쉵",
			6,
			"쉾슀슂",
			5,
			"슊",
			5,
			"슑",
			6,
			"슙슚슜슞",
			5,
			"슦슧슩슪슫슮",
			5,
			"슶슸슺",
			33,
			"싞싟싡싢싥",
			5,
			"싮싰싲싳싴싵싷싺싽싾싿쌁",
			6,
			"쌊쌋쌎쌏"
		],
		[
			"9b41",
			"쌐쌑쌒쌖쌗쌙쌚쌛쌝",
			6,
			"쌦쌧쌪",
			8
		],
		[
			"9b61",
			"쌳",
			17,
			"썆",
			7
		],
		[
			"9b81",
			"썎",
			25,
			"썪썫썭썮썯썱썳",
			4,
			"썺썻썾",
			5,
			"쎅쎆쎇쎉쎊쎋쎍",
			50,
			"쏁",
			22,
			"쏚"
		],
		[
			"9c41",
			"쏛쏝쏞쏡쏣",
			4,
			"쏪쏫쏬쏮",
			5,
			"쏶쏷쏹",
			5
		],
		[
			"9c61",
			"쏿",
			8,
			"쐉",
			6,
			"쐑",
			9
		],
		[
			"9c81",
			"쐛",
			8,
			"쐥",
			6,
			"쐭쐮쐯쐱쐲쐳쐵",
			6,
			"쐾",
			9,
			"쑉",
			26,
			"쑦쑧쑩쑪쑫쑭",
			6,
			"쑶쑷쑸쑺",
			5,
			"쒁",
			18,
			"쒕",
			6,
			"쒝",
			12
		],
		[
			"9d41",
			"쒪",
			13,
			"쒹쒺쒻쒽",
			8
		],
		[
			"9d61",
			"쓆",
			25
		],
		[
			"9d81",
			"쓠",
			8,
			"쓪",
			5,
			"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",
			9,
			"씍씎씏씑씒씓씕",
			6,
			"씝",
			10,
			"씪씫씭씮씯씱",
			6,
			"씺씼씾",
			5,
			"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",
			6,
			"앲앶",
			5,
			"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"
		],
		[
			"9e41",
			"얖얙얚얛얝얞얟얡",
			7,
			"얪",
			9,
			"얶"
		],
		[
			"9e61",
			"얷얺얿",
			4,
			"엋엍엏엒엓엕엖엗엙",
			6,
			"엢엤엦엧"
		],
		[
			"9e81",
			"엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",
			6,
			"옚옝",
			6,
			"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",
			6,
			"왒왖",
			5,
			"왞왟왡",
			10,
			"왭왮왰왲",
			5,
			"왺왻왽왾왿욁",
			6,
			"욊욌욎",
			5,
			"욖욗욙욚욛욝",
			6,
			"욦"
		],
		[
			"9f41",
			"욨욪",
			5,
			"욲욳욵욶욷욻",
			4,
			"웂웄웆",
			5,
			"웎"
		],
		[
			"9f61",
			"웏웑웒웓웕",
			6,
			"웞웟웢",
			5,
			"웪웫웭웮웯웱웲"
		],
		[
			"9f81",
			"웳",
			4,
			"웺웻웼웾",
			5,
			"윆윇윉윊윋윍",
			6,
			"윖윘윚",
			5,
			"윢윣윥윦윧윩",
			6,
			"윲윴윶윸윹윺윻윾윿읁읂읃읅",
			4,
			"읋읎읐읙읚읛읝읞읟읡",
			6,
			"읩읪읬",
			7,
			"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",
			4,
			"잢잧",
			4,
			"잮잯잱잲잳잵잶잷"
		],
		[
			"a041",
			"잸잹잺잻잾쟂",
			5,
			"쟊쟋쟍쟏쟑",
			6,
			"쟙쟚쟛쟜"
		],
		[
			"a061",
			"쟞",
			5,
			"쟥쟦쟧쟩쟪쟫쟭",
			13
		],
		[
			"a081",
			"쟻",
			4,
			"젂젃젅젆젇젉젋",
			4,
			"젒젔젗",
			4,
			"젞젟젡젢젣젥",
			6,
			"젮젰젲",
			5,
			"젹젺젻젽젾젿졁",
			6,
			"졊졋졎",
			5,
			"졕",
			26,
			"졲졳졵졶졷졹졻",
			4,
			"좂좄좈좉좊좎",
			5,
			"좕",
			7,
			"좞좠좢좣좤"
		],
		[
			"a141",
			"좥좦좧좩",
			18,
			"좾좿죀죁"
		],
		[
			"a161",
			"죂죃죅죆죇죉죊죋죍",
			6,
			"죖죘죚",
			5,
			"죢죣죥"
		],
		[
			"a181",
			"죦",
			14,
			"죶",
			5,
			"죾죿줁줂줃줇",
			4,
			"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",
			9,
			"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"
		],
		[
			"a241",
			"줐줒",
			5,
			"줙",
			18
		],
		[
			"a261",
			"줭",
			6,
			"줵",
			18
		],
		[
			"a281",
			"쥈",
			7,
			"쥒쥓쥕쥖쥗쥙",
			6,
			"쥢쥤",
			7,
			"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"
		],
		[
			"a341",
			"쥱쥲쥳쥵",
			6,
			"쥽",
			10,
			"즊즋즍즎즏"
		],
		[
			"a361",
			"즑",
			6,
			"즚즜즞",
			16
		],
		[
			"a381",
			"즯",
			16,
			"짂짃짅짆짉짋",
			4,
			"짒짔짗짘짛！",
			58,
			"￦］",
			32,
			"￣"
		],
		[
			"a441",
			"짞짟짡짣짥짦짨짩짪짫짮짲",
			5,
			"짺짻짽짾짿쨁쨂쨃쨄"
		],
		[
			"a461",
			"쨅쨆쨇쨊쨎",
			5,
			"쨕쨖쨗쨙",
			12
		],
		[
			"a481",
			"쨦쨧쨨쨪",
			28,
			"ㄱ",
			93
		],
		[
			"a541",
			"쩇",
			4,
			"쩎쩏쩑쩒쩓쩕",
			6,
			"쩞쩢",
			5,
			"쩩쩪"
		],
		[
			"a561",
			"쩫",
			17,
			"쩾",
			5,
			"쪅쪆"
		],
		[
			"a581",
			"쪇",
			16,
			"쪙",
			14,
			"ⅰ",
			9
		],
		[
			"a5b0",
			"Ⅰ",
			9
		],
		[
			"a5c1",
			"Α",
			16,
			"Σ",
			6
		],
		[
			"a5e1",
			"α",
			16,
			"σ",
			6
		],
		[
			"a641",
			"쪨",
			19,
			"쪾쪿쫁쫂쫃쫅"
		],
		[
			"a661",
			"쫆",
			5,
			"쫎쫐쫒쫔쫕쫖쫗쫚",
			5,
			"쫡",
			6
		],
		[
			"a681",
			"쫨쫩쫪쫫쫭",
			6,
			"쫵",
			18,
			"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",
			7
		],
		[
			"a741",
			"쬋",
			4,
			"쬑쬒쬓쬕쬖쬗쬙",
			6,
			"쬢",
			7
		],
		[
			"a761",
			"쬪",
			22,
			"쭂쭃쭄"
		],
		[
			"a781",
			"쭅쭆쭇쭊쭋쭍쭎쭏쭑",
			6,
			"쭚쭛쭜쭞",
			5,
			"쭥",
			7,
			"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",
			9,
			"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",
			9,
			"㎀",
			4,
			"㎺",
			5,
			"㎐",
			4,
			"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"
		],
		[
			"a841",
			"쭭",
			10,
			"쭺",
			14
		],
		[
			"a861",
			"쮉",
			18,
			"쮝",
			6
		],
		[
			"a881",
			"쮤",
			19,
			"쮹",
			11,
			"ÆÐªĦ"
		],
		[
			"a8a6",
			"Ĳ"
		],
		[
			"a8a8",
			"ĿŁØŒºÞŦŊ"
		],
		[
			"a8b1",
			"㉠",
			27,
			"ⓐ",
			25,
			"①",
			14,
			"½⅓⅔¼¾⅛⅜⅝⅞"
		],
		[
			"a941",
			"쯅",
			14,
			"쯕",
			10
		],
		[
			"a961",
			"쯠쯡쯢쯣쯥쯦쯨쯪",
			18
		],
		[
			"a981",
			"쯽",
			14,
			"찎찏찑찒찓찕",
			6,
			"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",
			27,
			"⒜",
			25,
			"⑴",
			14,
			"¹²³⁴ⁿ₁₂₃₄"
		],
		[
			"aa41",
			"찥찦찪찫찭찯찱",
			6,
			"찺찿",
			4,
			"챆챇챉챊챋챍챎"
		],
		[
			"aa61",
			"챏",
			4,
			"챖챚",
			5,
			"챡챢챣챥챧챩",
			6,
			"챱챲"
		],
		[
			"aa81",
			"챳챴챶",
			29,
			"ぁ",
			82
		],
		[
			"ab41",
			"첔첕첖첗첚첛첝첞첟첡",
			6,
			"첪첮",
			5,
			"첶첷첹"
		],
		[
			"ab61",
			"첺첻첽",
			6,
			"쳆쳈쳊",
			5,
			"쳑쳒쳓쳕",
			5
		],
		[
			"ab81",
			"쳛",
			8,
			"쳥",
			6,
			"쳭쳮쳯쳱",
			12,
			"ァ",
			85
		],
		[
			"ac41",
			"쳾쳿촀촂",
			5,
			"촊촋촍촎촏촑",
			6,
			"촚촜촞촟촠"
		],
		[
			"ac61",
			"촡촢촣촥촦촧촩촪촫촭",
			11,
			"촺",
			4
		],
		[
			"ac81",
			"촿",
			28,
			"쵝쵞쵟А",
			5,
			"ЁЖ",
			25
		],
		[
			"acd1",
			"а",
			5,
			"ёж",
			25
		],
		[
			"ad41",
			"쵡쵢쵣쵥",
			6,
			"쵮쵰쵲",
			5,
			"쵹",
			7
		],
		[
			"ad61",
			"춁",
			6,
			"춉",
			10,
			"춖춗춙춚춛춝춞춟"
		],
		[
			"ad81",
			"춠춡춢춣춦춨춪",
			5,
			"춱",
			18,
			"췅"
		],
		[
			"ae41",
			"췆",
			5,
			"췍췎췏췑",
			16
		],
		[
			"ae61",
			"췢",
			5,
			"췩췪췫췭췮췯췱",
			6,
			"췺췼췾",
			4
		],
		[
			"ae81",
			"츃츅츆츇츉츊츋츍",
			6,
			"츕츖츗츘츚",
			5,
			"츢츣츥츦츧츩츪츫"
		],
		[
			"af41",
			"츬츭츮츯츲츴츶",
			19
		],
		[
			"af61",
			"칊",
			13,
			"칚칛칝칞칢",
			5,
			"칪칬"
		],
		[
			"af81",
			"칮",
			5,
			"칶칷칹칺칻칽",
			6,
			"캆캈캊",
			5,
			"캒캓캕캖캗캙"
		],
		[
			"b041",
			"캚",
			5,
			"캢캦",
			5,
			"캮",
			12
		],
		[
			"b061",
			"캻",
			5,
			"컂",
			19
		],
		[
			"b081",
			"컖",
			13,
			"컦컧컩컪컭",
			6,
			"컶컺",
			5,
			"가각간갇갈갉갊감",
			7,
			"같",
			4,
			"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"
		],
		[
			"b141",
			"켂켃켅켆켇켉",
			6,
			"켒켔켖",
			5,
			"켝켞켟켡켢켣"
		],
		[
			"b161",
			"켥",
			6,
			"켮켲",
			5,
			"켹",
			11
		],
		[
			"b181",
			"콅",
			14,
			"콖콗콙콚콛콝",
			6,
			"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"
		],
		[
			"b241",
			"콭콮콯콲콳콵콶콷콹",
			6,
			"쾁쾂쾃쾄쾆",
			5,
			"쾍"
		],
		[
			"b261",
			"쾎",
			18,
			"쾢",
			5,
			"쾩"
		],
		[
			"b281",
			"쾪",
			5,
			"쾱",
			18,
			"쿅",
			6,
			"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"
		],
		[
			"b341",
			"쿌",
			19,
			"쿢쿣쿥쿦쿧쿩"
		],
		[
			"b361",
			"쿪",
			5,
			"쿲쿴쿶",
			5,
			"쿽쿾쿿퀁퀂퀃퀅",
			5
		],
		[
			"b381",
			"퀋",
			5,
			"퀒",
			5,
			"퀙",
			19,
			"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",
			4,
			"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"
		],
		[
			"b441",
			"퀮",
			5,
			"퀶퀷퀹퀺퀻퀽",
			6,
			"큆큈큊",
			5
		],
		[
			"b461",
			"큑큒큓큕큖큗큙",
			6,
			"큡",
			10,
			"큮큯"
		],
		[
			"b481",
			"큱큲큳큵",
			6,
			"큾큿킀킂",
			18,
			"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",
			4,
			"닳담답닷",
			4,
			"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"
		],
		[
			"b541",
			"킕",
			14,
			"킦킧킩킪킫킭",
			5
		],
		[
			"b561",
			"킳킶킸킺",
			5,
			"탂탃탅탆탇탊",
			5,
			"탒탖",
			4
		],
		[
			"b581",
			"탛탞탟탡탢탣탥",
			6,
			"탮탲",
			5,
			"탹",
			11,
			"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"
		],
		[
			"b641",
			"턅",
			7,
			"턎",
			17
		],
		[
			"b661",
			"턠",
			15,
			"턲턳턵턶턷턹턻턼턽턾"
		],
		[
			"b681",
			"턿텂텆",
			5,
			"텎텏텑텒텓텕",
			6,
			"텞텠텢",
			5,
			"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"
		],
		[
			"b741",
			"텮",
			13,
			"텽",
			6,
			"톅톆톇톉톊"
		],
		[
			"b761",
			"톋",
			20,
			"톢톣톥톦톧"
		],
		[
			"b781",
			"톩",
			6,
			"톲톴톶톷톸톹톻톽톾톿퇁",
			14,
			"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"
		],
		[
			"b841",
			"퇐",
			7,
			"퇙",
			17
		],
		[
			"b861",
			"퇫",
			8,
			"퇵퇶퇷퇹",
			13
		],
		[
			"b881",
			"툈툊",
			5,
			"툑",
			24,
			"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",
			4,
			"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"
		],
		[
			"b941",
			"툪툫툮툯툱툲툳툵",
			6,
			"툾퉀퉂",
			5,
			"퉉퉊퉋퉌"
		],
		[
			"b961",
			"퉍",
			14,
			"퉝",
			6,
			"퉥퉦퉧퉨"
		],
		[
			"b981",
			"퉩",
			22,
			"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",
			4,
			"받",
			4,
			"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"
		],
		[
			"ba41",
			"튍튎튏튒튓튔튖",
			5,
			"튝튞튟튡튢튣튥",
			6,
			"튭"
		],
		[
			"ba61",
			"튮튯튰튲",
			5,
			"튺튻튽튾틁틃",
			4,
			"틊틌",
			5
		],
		[
			"ba81",
			"틒틓틕틖틗틙틚틛틝",
			6,
			"틦",
			9,
			"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"
		],
		[
			"bb41",
			"틻",
			4,
			"팂팄팆",
			5,
			"팏팑팒팓팕팗",
			4,
			"팞팢팣"
		],
		[
			"bb61",
			"팤팦팧팪팫팭팮팯팱",
			6,
			"팺팾",
			5,
			"퍆퍇퍈퍉"
		],
		[
			"bb81",
			"퍊",
			31,
			"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"
		],
		[
			"bc41",
			"퍪",
			17,
			"퍾퍿펁펂펃펅펆펇"
		],
		[
			"bc61",
			"펈펉펊펋펎펒",
			5,
			"펚펛펝펞펟펡",
			6,
			"펪펬펮"
		],
		[
			"bc81",
			"펯",
			4,
			"펵펶펷펹펺펻펽",
			6,
			"폆폇폊",
			5,
			"폑",
			5,
			"샥샨샬샴샵샷샹섀섄섈섐섕서",
			4,
			"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"
		],
		[
			"bd41",
			"폗폙",
			7,
			"폢폤",
			7,
			"폮폯폱폲폳폵폶폷"
		],
		[
			"bd61",
			"폸폹폺폻폾퐀퐂",
			5,
			"퐉",
			13
		],
		[
			"bd81",
			"퐗",
			5,
			"퐞",
			25,
			"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"
		],
		[
			"be41",
			"퐸",
			7,
			"푁푂푃푅",
			14
		],
		[
			"be61",
			"푔",
			7,
			"푝푞푟푡푢푣푥",
			7,
			"푮푰푱푲"
		],
		[
			"be81",
			"푳",
			4,
			"푺푻푽푾풁풃",
			4,
			"풊풌풎",
			5,
			"풕",
			8,
			"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",
			6,
			"엌엎"
		],
		[
			"bf41",
			"풞",
			10,
			"풪",
			14
		],
		[
			"bf61",
			"풹",
			18,
			"퓍퓎퓏퓑퓒퓓퓕"
		],
		[
			"bf81",
			"퓖",
			5,
			"퓝퓞퓠",
			7,
			"퓩퓪퓫퓭퓮퓯퓱",
			6,
			"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",
			5,
			"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"
		],
		[
			"c041",
			"퓾",
			5,
			"픅픆픇픉픊픋픍",
			6,
			"픖픘",
			5
		],
		[
			"c061",
			"픞",
			25
		],
		[
			"c081",
			"픸픹픺픻픾픿핁핂핃핅",
			6,
			"핎핐핒",
			5,
			"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",
			7,
			"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"
		],
		[
			"c141",
			"핤핦핧핪핬핮",
			5,
			"핶핷핹핺핻핽",
			6,
			"햆햊햋"
		],
		[
			"c161",
			"햌햍햎햏햑",
			19,
			"햦햧"
		],
		[
			"c181",
			"햨",
			31,
			"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"
		],
		[
			"c241",
			"헊헋헍헎헏헑헓",
			4,
			"헚헜헞",
			5,
			"헦헧헩헪헫헭헮"
		],
		[
			"c261",
			"헯",
			4,
			"헶헸헺",
			5,
			"혂혃혅혆혇혉",
			6,
			"혒"
		],
		[
			"c281",
			"혖",
			5,
			"혝혞혟혡혢혣혥",
			7,
			"혮",
			9,
			"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"
		],
		[
			"c341",
			"혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",
			4
		],
		[
			"c361",
			"홢",
			4,
			"홨홪",
			5,
			"홲홳홵",
			11
		],
		[
			"c381",
			"횁횂횄횆",
			5,
			"횎횏횑횒횓횕",
			7,
			"횞횠횢",
			5,
			"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"
		],
		[
			"c441",
			"횫횭횮횯횱",
			7,
			"횺횼",
			7,
			"훆훇훉훊훋"
		],
		[
			"c461",
			"훍훎훏훐훒훓훕훖훘훚",
			5,
			"훡훢훣훥훦훧훩",
			4
		],
		[
			"c481",
			"훮훯훱훲훳훴훶",
			5,
			"훾훿휁휂휃휅",
			11,
			"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"
		],
		[
			"c541",
			"휕휖휗휚휛휝휞휟휡",
			6,
			"휪휬휮",
			5,
			"휶휷휹"
		],
		[
			"c561",
			"휺휻휽",
			6,
			"흅흆흈흊",
			5,
			"흒흓흕흚",
			4
		],
		[
			"c581",
			"흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",
			6,
			"흾흿힀힂",
			5,
			"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"
		],
		[
			"c641",
			"힍힎힏힑",
			6,
			"힚힜힞",
			5
		],
		[
			"c6a1",
			"퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"
		],
		[
			"c7a1",
			"퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"
		],
		[
			"c8a1",
			"혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"
		],
		[
			"caa1",
			"伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"
		],
		[
			"cba1",
			"匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"
		],
		[
			"cca1",
			"瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"
		],
		[
			"cda1",
			"棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"
		],
		[
			"cea1",
			"科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"
		],
		[
			"cfa1",
			"區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"
		],
		[
			"d0a1",
			"鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"
		],
		[
			"d1a1",
			"朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",
			5,
			"那樂",
			4,
			"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"
		],
		[
			"d2a1",
			"納臘蠟衲囊娘廊",
			4,
			"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",
			5,
			"駑魯",
			10,
			"濃籠聾膿農惱牢磊腦賂雷尿壘",
			7,
			"嫩訥杻紐勒",
			5,
			"能菱陵尼泥匿溺多茶"
		],
		[
			"d3a1",
			"丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"
		],
		[
			"d4a1",
			"棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"
		],
		[
			"d5a1",
			"蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"
		],
		[
			"d6a1",
			"煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"
		],
		[
			"d7a1",
			"遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"
		],
		[
			"d8a1",
			"立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"
		],
		[
			"d9a1",
			"蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"
		],
		[
			"daa1",
			"汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"
		],
		[
			"dba1",
			"發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"
		],
		[
			"dca1",
			"碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"
		],
		[
			"dda1",
			"孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"
		],
		[
			"dea1",
			"脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"
		],
		[
			"dfa1",
			"傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"
		],
		[
			"e0a1",
			"胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"
		],
		[
			"e1a1",
			"聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"
		],
		[
			"e2a1",
			"戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"
		],
		[
			"e3a1",
			"嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"
		],
		[
			"e4a1",
			"沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"
		],
		[
			"e5a1",
			"櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"
		],
		[
			"e6a1",
			"旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"
		],
		[
			"e7a1",
			"簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"
		],
		[
			"e8a1",
			"烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"
		],
		[
			"e9a1",
			"窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"
		],
		[
			"eaa1",
			"運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"
		],
		[
			"eba1",
			"濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"
		],
		[
			"eca1",
			"議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"
		],
		[
			"eda1",
			"立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"
		],
		[
			"eea1",
			"障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"
		],
		[
			"efa1",
			"煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"
		],
		[
			"f0a1",
			"靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"
		],
		[
			"f1a1",
			"踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"
		],
		[
			"f2a1",
			"咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"
		],
		[
			"f3a1",
			"鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"
		],
		[
			"f4a1",
			"責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"
		],
		[
			"f5a1",
			"椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"
		],
		[
			"f6a1",
			"贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"
		],
		[
			"f7a1",
			"鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"
		],
		[
			"f8a1",
			"阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"
		],
		[
			"f9a1",
			"品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"
		],
		[
			"faa1",
			"行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"
		],
		[
			"fba1",
			"形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"
		],
		[
			"fca1",
			"禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"
		],
		[
			"fda1",
			"爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"
		]
	];

	var require$$6 = [
		[
			"0",
			"\u0000",
			127
		],
		[
			"a140",
			"　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"
		],
		[
			"a1a1",
			"﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",
			4,
			"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"
		],
		[
			"a240",
			"＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",
			7,
			"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"
		],
		[
			"a2a1",
			"╮╰╯═╞╪╡◢◣◥◤╱╲╳０",
			9,
			"Ⅰ",
			9,
			"〡",
			8,
			"十卄卅Ａ",
			25,
			"ａ",
			21
		],
		[
			"a340",
			"ｗｘｙｚΑ",
			16,
			"Σ",
			6,
			"α",
			16,
			"σ",
			6,
			"ㄅ",
			10
		],
		[
			"a3a1",
			"ㄐ",
			25,
			"˙ˉˊˇˋ"
		],
		[
			"a3e1",
			"€"
		],
		[
			"a440",
			"一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"
		],
		[
			"a4a1",
			"丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"
		],
		[
			"a540",
			"世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"
		],
		[
			"a5a1",
			"央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"
		],
		[
			"a640",
			"共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"
		],
		[
			"a6a1",
			"式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"
		],
		[
			"a740",
			"作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"
		],
		[
			"a7a1",
			"均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"
		],
		[
			"a840",
			"杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"
		],
		[
			"a8a1",
			"芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"
		],
		[
			"a940",
			"咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"
		],
		[
			"a9a1",
			"屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"
		],
		[
			"aa40",
			"昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"
		],
		[
			"aaa1",
			"炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"
		],
		[
			"ab40",
			"陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"
		],
		[
			"aba1",
			"哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"
		],
		[
			"ac40",
			"拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"
		],
		[
			"aca1",
			"活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"
		],
		[
			"ad40",
			"耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"
		],
		[
			"ada1",
			"迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"
		],
		[
			"ae40",
			"哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"
		],
		[
			"aea1",
			"恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"
		],
		[
			"af40",
			"浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"
		],
		[
			"afa1",
			"砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"
		],
		[
			"b040",
			"虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"
		],
		[
			"b0a1",
			"陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"
		],
		[
			"b140",
			"娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"
		],
		[
			"b1a1",
			"情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"
		],
		[
			"b240",
			"毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"
		],
		[
			"b2a1",
			"瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"
		],
		[
			"b340",
			"莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"
		],
		[
			"b3a1",
			"部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"
		],
		[
			"b440",
			"婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"
		],
		[
			"b4a1",
			"插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"
		],
		[
			"b540",
			"溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"
		],
		[
			"b5a1",
			"窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"
		],
		[
			"b640",
			"詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"
		],
		[
			"b6a1",
			"間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"
		],
		[
			"b740",
			"媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"
		],
		[
			"b7a1",
			"楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"
		],
		[
			"b840",
			"睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"
		],
		[
			"b8a1",
			"腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"
		],
		[
			"b940",
			"辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"
		],
		[
			"b9a1",
			"飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"
		],
		[
			"ba40",
			"愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"
		],
		[
			"baa1",
			"滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"
		],
		[
			"bb40",
			"罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"
		],
		[
			"bba1",
			"說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"
		],
		[
			"bc40",
			"劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"
		],
		[
			"bca1",
			"慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"
		],
		[
			"bd40",
			"瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"
		],
		[
			"bda1",
			"翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"
		],
		[
			"be40",
			"輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"
		],
		[
			"bea1",
			"鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"
		],
		[
			"bf40",
			"濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"
		],
		[
			"bfa1",
			"縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"
		],
		[
			"c040",
			"錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"
		],
		[
			"c0a1",
			"嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"
		],
		[
			"c140",
			"瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"
		],
		[
			"c1a1",
			"薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"
		],
		[
			"c240",
			"駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"
		],
		[
			"c2a1",
			"癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"
		],
		[
			"c340",
			"鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"
		],
		[
			"c3a1",
			"獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"
		],
		[
			"c440",
			"願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"
		],
		[
			"c4a1",
			"纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"
		],
		[
			"c540",
			"護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"
		],
		[
			"c5a1",
			"禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"
		],
		[
			"c640",
			"讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"
		],
		[
			"c940",
			"乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"
		],
		[
			"c9a1",
			"氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"
		],
		[
			"ca40",
			"汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"
		],
		[
			"caa1",
			"吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"
		],
		[
			"cb40",
			"杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"
		],
		[
			"cba1",
			"芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"
		],
		[
			"cc40",
			"坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"
		],
		[
			"cca1",
			"怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"
		],
		[
			"cd40",
			"泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"
		],
		[
			"cda1",
			"矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"
		],
		[
			"ce40",
			"哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"
		],
		[
			"cea1",
			"峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"
		],
		[
			"cf40",
			"柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"
		],
		[
			"cfa1",
			"洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"
		],
		[
			"d040",
			"穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"
		],
		[
			"d0a1",
			"苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"
		],
		[
			"d140",
			"唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"
		],
		[
			"d1a1",
			"恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"
		],
		[
			"d240",
			"毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"
		],
		[
			"d2a1",
			"牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"
		],
		[
			"d340",
			"笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"
		],
		[
			"d3a1",
			"荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"
		],
		[
			"d440",
			"酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"
		],
		[
			"d4a1",
			"唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"
		],
		[
			"d540",
			"崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"
		],
		[
			"d5a1",
			"捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"
		],
		[
			"d640",
			"淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"
		],
		[
			"d6a1",
			"痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"
		],
		[
			"d740",
			"耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"
		],
		[
			"d7a1",
			"蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"
		],
		[
			"d840",
			"釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"
		],
		[
			"d8a1",
			"堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"
		],
		[
			"d940",
			"惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"
		],
		[
			"d9a1",
			"晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"
		],
		[
			"da40",
			"湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"
		],
		[
			"daa1",
			"琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"
		],
		[
			"db40",
			"罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"
		],
		[
			"dba1",
			"菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"
		],
		[
			"dc40",
			"軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"
		],
		[
			"dca1",
			"隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"
		],
		[
			"dd40",
			"媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"
		],
		[
			"dda1",
			"搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"
		],
		[
			"de40",
			"毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"
		],
		[
			"dea1",
			"煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"
		],
		[
			"df40",
			"稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"
		],
		[
			"dfa1",
			"腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"
		],
		[
			"e040",
			"觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"
		],
		[
			"e0a1",
			"遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"
		],
		[
			"e140",
			"凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"
		],
		[
			"e1a1",
			"寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"
		],
		[
			"e240",
			"榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"
		],
		[
			"e2a1",
			"漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"
		],
		[
			"e340",
			"禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"
		],
		[
			"e3a1",
			"耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"
		],
		[
			"e440",
			"裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"
		],
		[
			"e4a1",
			"銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"
		],
		[
			"e540",
			"噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"
		],
		[
			"e5a1",
			"憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"
		],
		[
			"e640",
			"澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"
		],
		[
			"e6a1",
			"獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"
		],
		[
			"e740",
			"膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"
		],
		[
			"e7a1",
			"蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"
		],
		[
			"e840",
			"踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"
		],
		[
			"e8a1",
			"銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"
		],
		[
			"e940",
			"噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"
		],
		[
			"e9a1",
			"憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"
		],
		[
			"ea40",
			"澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"
		],
		[
			"eaa1",
			"瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"
		],
		[
			"eb40",
			"蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"
		],
		[
			"eba1",
			"諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"
		],
		[
			"ec40",
			"錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"
		],
		[
			"eca1",
			"魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"
		],
		[
			"ed40",
			"檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"
		],
		[
			"eda1",
			"瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"
		],
		[
			"ee40",
			"蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"
		],
		[
			"eea1",
			"謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"
		],
		[
			"ef40",
			"鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"
		],
		[
			"efa1",
			"鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"
		],
		[
			"f040",
			"璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"
		],
		[
			"f0a1",
			"臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"
		],
		[
			"f140",
			"蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"
		],
		[
			"f1a1",
			"鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"
		],
		[
			"f240",
			"徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"
		],
		[
			"f2a1",
			"礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"
		],
		[
			"f340",
			"譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"
		],
		[
			"f3a1",
			"鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"
		],
		[
			"f440",
			"嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"
		],
		[
			"f4a1",
			"禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"
		],
		[
			"f540",
			"鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"
		],
		[
			"f5a1",
			"鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"
		],
		[
			"f640",
			"蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"
		],
		[
			"f6a1",
			"騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"
		],
		[
			"f740",
			"糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"
		],
		[
			"f7a1",
			"驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"
		],
		[
			"f840",
			"讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"
		],
		[
			"f8a1",
			"齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"
		],
		[
			"f940",
			"纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"
		],
		[
			"f9a1",
			"龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"
		]
	];

	var require$$7 = [
		[
			"8740",
			"䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"
		],
		[
			"8767",
			"綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"
		],
		[
			"87a1",
			"𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"
		],
		[
			"8840",
			"㇀",
			4,
			"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"
		],
		[
			"88a1",
			"ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"
		],
		[
			"8940",
			"𪎩𡅅"
		],
		[
			"8943",
			"攊"
		],
		[
			"8946",
			"丽滝鵎釟"
		],
		[
			"894c",
			"𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"
		],
		[
			"89a1",
			"琑糼緍楆竉刧"
		],
		[
			"89ab",
			"醌碸酞肼"
		],
		[
			"89b0",
			"贋胶𠧧"
		],
		[
			"89b5",
			"肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"
		],
		[
			"89c1",
			"溚舾甙"
		],
		[
			"89c5",
			"䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"
		],
		[
			"8a40",
			"𧶄唥"
		],
		[
			"8a43",
			"𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"
		],
		[
			"8a64",
			"𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"
		],
		[
			"8a76",
			"䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"
		],
		[
			"8aa1",
			"𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"
		],
		[
			"8aac",
			"䠋𠆩㿺塳𢶍"
		],
		[
			"8ab2",
			"𤗈𠓼𦂗𠽌𠶖啹䂻䎺"
		],
		[
			"8abb",
			"䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"
		],
		[
			"8ac9",
			"𪘁𠸉𢫏𢳉"
		],
		[
			"8ace",
			"𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"
		],
		[
			"8adf",
			"𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"
		],
		[
			"8af6",
			"𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"
		],
		[
			"8b40",
			"𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"
		],
		[
			"8b55",
			"𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"
		],
		[
			"8ba1",
			"𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"
		],
		[
			"8bde",
			"𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"
		],
		[
			"8c40",
			"倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"
		],
		[
			"8ca1",
			"𣏹椙橃𣱣泿"
		],
		[
			"8ca7",
			"爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"
		],
		[
			"8cc9",
			"顨杫䉶圽"
		],
		[
			"8cce",
			"藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"
		],
		[
			"8ce6",
			"峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"
		],
		[
			"8d40",
			"𠮟"
		],
		[
			"8d42",
			"𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"
		],
		[
			"8da1",
			"㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"
		],
		[
			"8e40",
			"𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"
		],
		[
			"8ea1",
			"繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"
		],
		[
			"8f40",
			"蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"
		],
		[
			"8fa1",
			"𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"
		],
		[
			"9040",
			"趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"
		],
		[
			"90a1",
			"𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"
		],
		[
			"9140",
			"𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"
		],
		[
			"91a1",
			"鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"
		],
		[
			"9240",
			"𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"
		],
		[
			"92a1",
			"働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"
		],
		[
			"9340",
			"媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"
		],
		[
			"93a1",
			"摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"
		],
		[
			"9440",
			"銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"
		],
		[
			"94a1",
			"㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"
		],
		[
			"9540",
			"𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"
		],
		[
			"95a1",
			"衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"
		],
		[
			"9640",
			"桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"
		],
		[
			"96a1",
			"𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"
		],
		[
			"9740",
			"愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"
		],
		[
			"97a1",
			"𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"
		],
		[
			"9840",
			"𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"
		],
		[
			"98a1",
			"咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"
		],
		[
			"9940",
			"䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"
		],
		[
			"99a1",
			"䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"
		],
		[
			"9a40",
			"鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"
		],
		[
			"9aa1",
			"黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"
		],
		[
			"9b40",
			"𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"
		],
		[
			"9b62",
			"𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"
		],
		[
			"9ba1",
			"椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"
		],
		[
			"9c40",
			"嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"
		],
		[
			"9ca1",
			"㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"
		],
		[
			"9d40",
			"𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"
		],
		[
			"9da1",
			"辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"
		],
		[
			"9e40",
			"𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"
		],
		[
			"9ea1",
			"鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"
		],
		[
			"9ead",
			"𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"
		],
		[
			"9ec5",
			"㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"
		],
		[
			"9ef5",
			"噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"
		],
		[
			"9f40",
			"籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"
		],
		[
			"9f4f",
			"凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"
		],
		[
			"9fa1",
			"椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"
		],
		[
			"9fae",
			"酙隁酜"
		],
		[
			"9fb2",
			"酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"
		],
		[
			"9fc1",
			"𤤙盖鮝个𠳔莾衂"
		],
		[
			"9fc9",
			"届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"
		],
		[
			"9fdb",
			"歒酼龥鮗頮颴骺麨麄煺笔"
		],
		[
			"9fe7",
			"毺蠘罸"
		],
		[
			"9feb",
			"嘠𪙊蹷齓"
		],
		[
			"9ff0",
			"跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"
		],
		[
			"a040",
			"𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"
		],
		[
			"a055",
			"𡠻𦸅"
		],
		[
			"a058",
			"詾𢔛"
		],
		[
			"a05b",
			"惽癧髗鵄鍮鮏蟵"
		],
		[
			"a063",
			"蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"
		],
		[
			"a073",
			"坟慯抦戹拎㩜懢厪𣏵捤栂㗒"
		],
		[
			"a0a1",
			"嵗𨯂迚𨸹"
		],
		[
			"a0a6",
			"僙𡵆礆匲阸𠼻䁥"
		],
		[
			"a0ae",
			"矾"
		],
		[
			"a0b0",
			"糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"
		],
		[
			"a0d4",
			"覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"
		],
		[
			"a0e2",
			"罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"
		],
		[
			"a3c0",
			"␀",
			31,
			"␡"
		],
		[
			"c6a1",
			"①",
			9,
			"⑴",
			9,
			"ⅰ",
			9,
			"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",
			23
		],
		[
			"c740",
			"す",
			58,
			"ァアィイ"
		],
		[
			"c7a1",
			"ゥ",
			81,
			"А",
			5,
			"ЁЖ",
			4
		],
		[
			"c840",
			"Л",
			26,
			"ёж",
			25,
			"⇧↸↹㇏𠃌乚𠂊刂䒑"
		],
		[
			"c8a1",
			"龰冈龱𧘇"
		],
		[
			"c8cd",
			"￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"
		],
		[
			"c8f5",
			"ʃɐɛɔɵœøŋʊɪ"
		],
		[
			"f9fe",
			"￭"
		],
		[
			"fa40",
			"𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"
		],
		[
			"faa1",
			"鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"
		],
		[
			"fb40",
			"𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"
		],
		[
			"fba1",
			"𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"
		],
		[
			"fc40",
			"廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"
		],
		[
			"fca1",
			"𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"
		],
		[
			"fd40",
			"𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"
		],
		[
			"fda1",
			"𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"
		],
		[
			"fe40",
			"鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"
		],
		[
			"fea1",
			"𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"
		]
	];

	var dbcsData;
	var hasRequiredDbcsData;

	function requireDbcsData () {
		if (hasRequiredDbcsData) return dbcsData;
		hasRequiredDbcsData = 1;

		// Description of supported double byte encodings and aliases.
		// Tables are not require()-d until they are needed to speed up library load.
		// require()-s are direct to support Browserify.

		dbcsData = {
		    
		    // == Japanese/ShiftJIS ====================================================
		    // All japanese encodings are based on JIS X set of standards:
		    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
		    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
		    //              Has several variations in 1978, 1983, 1990 and 1997.
		    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
		    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
		    //              2 planes, first is superset of 0208, second - revised 0212.
		    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)

		    // Byte encodings are:
		    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
		    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
		    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
		    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
		    //               0x00-0x7F       - lower part of 0201
		    //               0x8E, 0xA1-0xDF - upper part of 0201
		    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
		    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
		    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
		    //               Used as-is in ISO2022 family.
		    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
		    //                0201-1976 Roman, 0208-1978, 0208-1983.
		    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
		    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
		    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
		    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
		    //
		    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
		    //
		    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html

		    'shiftjis': {
		        type: '_dbcs',
		        table: function() { return require$$0$1 },
		        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
		        encodeSkipVals: [{from: 0xED40, to: 0xF940}],
		    },
		    'csshiftjis': 'shiftjis',
		    'mskanji': 'shiftjis',
		    'sjis': 'shiftjis',
		    'windows31j': 'shiftjis',
		    'ms31j': 'shiftjis',
		    'xsjis': 'shiftjis',
		    'windows932': 'shiftjis',
		    'ms932': 'shiftjis',
		    '932': 'shiftjis',
		    'cp932': 'shiftjis',

		    'eucjp': {
		        type: '_dbcs',
		        table: function() { return require$$1 },
		        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
		    },

		    // TODO: KDDI extension to Shift_JIS
		    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
		    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.


		    // == Chinese/GBK ==========================================================
		    // http://en.wikipedia.org/wiki/GBK
		    // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder

		    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
		    'gb2312': 'cp936',
		    'gb231280': 'cp936',
		    'gb23121980': 'cp936',
		    'csgb2312': 'cp936',
		    'csiso58gb231280': 'cp936',
		    'euccn': 'cp936',

		    // Microsoft's CP936 is a subset and approximation of GBK.
		    'windows936': 'cp936',
		    'ms936': 'cp936',
		    '936': 'cp936',
		    'cp936': {
		        type: '_dbcs',
		        table: function() { return require$$2 },
		    },

		    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
		    'gbk': {
		        type: '_dbcs',
		        table: function() { return require$$2.concat(require$$3) },
		    },
		    'xgbk': 'gbk',
		    'isoir58': 'gbk',

		    // GB18030 is an algorithmic extension of GBK.
		    // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
		    // http://icu-project.org/docs/papers/gb18030.html
		    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
		    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
		    'gb18030': {
		        type: '_dbcs',
		        table: function() { return require$$2.concat(require$$3) },
		        gb18030: function() { return require$$4$1 },
		        encodeSkipVals: [0x80],
		        encodeAdd: {'€': 0xA2E3},
		    },

		    'chinese': 'gb18030',


		    // == Korean ===============================================================
		    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
		    'windows949': 'cp949',
		    'ms949': 'cp949',
		    '949': 'cp949',
		    'cp949': {
		        type: '_dbcs',
		        table: function() { return require$$5 },
		    },

		    'cseuckr': 'cp949',
		    'csksc56011987': 'cp949',
		    'euckr': 'cp949',
		    'isoir149': 'cp949',
		    'korean': 'cp949',
		    'ksc56011987': 'cp949',
		    'ksc56011989': 'cp949',
		    'ksc5601': 'cp949',


		    // == Big5/Taiwan/Hong Kong ================================================
		    // There are lots of tables for Big5 and cp950. Please see the following links for history:
		    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
		    // Variations, in roughly number of defined chars:
		    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
		    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
		    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
		    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
		    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
		    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
		    //    Plus, it has 4 combining sequences.
		    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
		    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
		    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
		    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
		    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
		    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
		    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
		    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
		    // 
		    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
		    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.

		    'windows950': 'cp950',
		    'ms950': 'cp950',
		    '950': 'cp950',
		    'cp950': {
		        type: '_dbcs',
		        table: function() { return require$$6 },
		    },

		    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
		    'big5': 'big5hkscs',
		    'big5hkscs': {
		        type: '_dbcs',
		        table: function() { return require$$6.concat(require$$7) },
		        encodeSkipVals: [
		            // Although Encoding Standard says we should avoid encoding to HKSCS area (See Step 1 of
		            // https://encoding.spec.whatwg.org/#index-big5-pointer), we still do it to increase compatibility with ICU.
		            // But if a single unicode point can be encoded both as HKSCS and regular Big5, we prefer the latter.
		            0x8e69, 0x8e6f, 0x8e7e, 0x8eab, 0x8eb4, 0x8ecd, 0x8ed0, 0x8f57, 0x8f69, 0x8f6e, 0x8fcb, 0x8ffe,
		            0x906d, 0x907a, 0x90c4, 0x90dc, 0x90f1, 0x91bf, 0x92af, 0x92b0, 0x92b1, 0x92b2, 0x92d1, 0x9447, 0x94ca,
		            0x95d9, 0x96fc, 0x9975, 0x9b76, 0x9b78, 0x9b7b, 0x9bc6, 0x9bde, 0x9bec, 0x9bf6, 0x9c42, 0x9c53, 0x9c62,
		            0x9c68, 0x9c6b, 0x9c77, 0x9cbc, 0x9cbd, 0x9cd0, 0x9d57, 0x9d5a, 0x9dc4, 0x9def, 0x9dfb, 0x9ea9, 0x9eef,
		            0x9efd, 0x9f60, 0x9fcb, 0xa077, 0xa0dc, 0xa0df, 0x8fcc, 0x92c8, 0x9644, 0x96ed,

		            // Step 2 of https://encoding.spec.whatwg.org/#index-big5-pointer: Use last pointer for U+2550, U+255E, U+2561, U+256A, U+5341, or U+5345
		            0xa2a4, 0xa2a5, 0xa2a7, 0xa2a6, 0xa2cc, 0xa2ce,
		        ],
		    },

		    'cnbig5': 'big5hkscs',
		    'csbig5': 'big5hkscs',
		    'xxbig5': 'big5hkscs',
		};
		return dbcsData;
	}

	var hasRequiredEncodings;

	function requireEncodings () {
		if (hasRequiredEncodings) return encodings;
		hasRequiredEncodings = 1;
		(function (exports) {

			// Update this array if you add/rename/remove files in this directory.
			// We support Browserify by skipping automatic module discovery and requiring modules directly.
			var modules = [
			    requireInternal(),
			    requireUtf32(),
			    requireUtf16(),
			    requireUtf7(),
			    requireSbcsCodec(),
			    requireSbcsData(),
			    requireSbcsDataGenerated(),
			    requireDbcsCodec(),
			    requireDbcsData(),
			];

			// Put all encoding/alias/codec definitions to single object and export it.
			for (var i = 0; i < modules.length; i++) {
			    var module = modules[i];
			    for (var enc in module)
			        if (Object.prototype.hasOwnProperty.call(module, enc))
			            exports[enc] = module[enc];
			} 
		} (encodings));
		return encodings;
	}

	var streams;
	var hasRequiredStreams;

	function requireStreams () {
		if (hasRequiredStreams) return streams;
		hasRequiredStreams = 1;

		var Buffer = requireSafer().Buffer;

		// NOTE: Due to 'stream' module being pretty large (~100Kb, significant in browser environments), 
		// we opt to dependency-inject it instead of creating a hard dependency.
		streams = function(stream_module) {
		    var Transform = stream_module.Transform;

		    // == Encoder stream =======================================================

		    function IconvLiteEncoderStream(conv, options) {
		        this.conv = conv;
		        options = options || {};
		        options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
		        Transform.call(this, options);
		    }

		    IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
		        constructor: { value: IconvLiteEncoderStream }
		    });

		    IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
		        if (typeof chunk != 'string')
		            return done(new Error("Iconv encoding stream needs strings as its input."));
		        try {
		            var res = this.conv.write(chunk);
		            if (res && res.length) this.push(res);
		            done();
		        }
		        catch (e) {
		            done(e);
		        }
		    };

		    IconvLiteEncoderStream.prototype._flush = function(done) {
		        try {
		            var res = this.conv.end();
		            if (res && res.length) this.push(res);
		            done();
		        }
		        catch (e) {
		            done(e);
		        }
		    };

		    IconvLiteEncoderStream.prototype.collect = function(cb) {
		        var chunks = [];
		        this.on('error', cb);
		        this.on('data', function(chunk) { chunks.push(chunk); });
		        this.on('end', function() {
		            cb(null, Buffer.concat(chunks));
		        });
		        return this;
		    };


		    // == Decoder stream =======================================================

		    function IconvLiteDecoderStream(conv, options) {
		        this.conv = conv;
		        options = options || {};
		        options.encoding = this.encoding = 'utf8'; // We output strings.
		        Transform.call(this, options);
		    }

		    IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
		        constructor: { value: IconvLiteDecoderStream }
		    });

		    IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
		        if (!Buffer.isBuffer(chunk) && !(chunk instanceof Uint8Array))
		            return done(new Error("Iconv decoding stream needs buffers as its input."));
		        try {
		            var res = this.conv.write(chunk);
		            if (res && res.length) this.push(res, this.encoding);
		            done();
		        }
		        catch (e) {
		            done(e);
		        }
		    };

		    IconvLiteDecoderStream.prototype._flush = function(done) {
		        try {
		            var res = this.conv.end();
		            if (res && res.length) this.push(res, this.encoding);                
		            done();
		        }
		        catch (e) {
		            done(e);
		        }
		    };

		    IconvLiteDecoderStream.prototype.collect = function(cb) {
		        var res = '';
		        this.on('error', cb);
		        this.on('data', function(chunk) { res += chunk; });
		        this.on('end', function() {
		            cb(null, res);
		        });
		        return this;
		    };

		    return {
		        IconvLiteEncoderStream: IconvLiteEncoderStream,
		        IconvLiteDecoderStream: IconvLiteDecoderStream,
		    };
		};
		return streams;
	}

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return Buffer.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = Buffer.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

	Readable.ReadableState = ReadableState;

	var debug$2 = debuglog('stream');
	inherits$1(Readable, EventEmitter$7);

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event])
	      emitter.on(event, fn);
	    else if (Array.isArray(emitter._events[event]))
	      emitter._events[event].unshift(fn);
	    else
	      emitter._events[event] = [fn, emitter._events[event]];
	  }
	}
	function listenerCount (emitter, type) {
	  return emitter.listeners(type).length;
	}
	function ReadableState(options, stream) {

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	function Readable(options) {

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  EventEmitter$7.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = Buffer.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable(stream);
	        }
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug$2('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug$2('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug$2('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug$2('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug$2('reading or ended', doRead);
	  } else if (doRead) {
	    debug$2('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug$2('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) nextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug$2('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    nextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug$2('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug$2('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false);

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug$2('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug$2('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug$2('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug$2('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug$2('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug$2('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (listenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug$2('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug$2('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug$2('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug$2('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && src.listeners('data').length) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var _i = 0; _i < len; _i++) {
	      dests[_i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1) return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = EventEmitter$7.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        nextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug$2('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug$2('resume');
	    state.flowing = true;
	    resume$1(this, state);
	  }
	  return this;
	};

	function resume$1(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    nextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug$2('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug$2('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug$2('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug$2('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug$2('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug$2('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug$2('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = Buffer.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    nextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	Writable.WritableState = WritableState;
	inherits$1(Writable, EventEmitter$7);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	function WritableState(options, stream) {
	  Object.defineProperty(this, 'buffer', {
	    get: deprecate(function () {
	      return this.getBuffer();
	    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	  });
	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function writableStateGetBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};
	function Writable(options) {

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  EventEmitter$7.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  nextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    nextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = Buffer.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) nextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	        nextTick(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite(stream, state, finished, cb);
	      }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) nextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}

	inherits$1(Duplex, Readable);

	var keys = Object.keys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}
	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  nextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	inherits$1(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er) {
	      done(stream, er);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('Not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done(stream, er) {
	  if (er) return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

	inherits$1(PassThrough, Transform);
	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

	inherits$1(Stream, EventEmitter$7);
	Stream.Readable = Readable;
	Stream.Writable = Writable;
	Stream.Duplex = Duplex;
	Stream.Transform = Transform;
	Stream.PassThrough = PassThrough;

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;

	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EventEmitter$7.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EventEmitter$7.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};

	var _polyfillNode_stream = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Duplex: Duplex,
		PassThrough: PassThrough,
		Readable: Readable,
		Stream: Stream,
		Transform: Transform,
		Writable: Writable,
		default: Stream
	});

	var require$$4 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_stream);

	var hasRequiredLib$1;

	function requireLib$1 () {
		if (hasRequiredLib$1) return lib$1.exports;
		hasRequiredLib$1 = 1;
		(function (module) {

			var Buffer = requireSafer().Buffer;

			var bomHandling = requireBomHandling(),
			    iconv = module.exports;

			// All codecs and aliases are kept here, keyed by encoding name/alias.
			// They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
			iconv.encodings = null;

			// Characters emitted in case of error.
			iconv.defaultCharUnicode = '�';
			iconv.defaultCharSingleByte = '?';

			// Public API.
			iconv.encode = function encode(str, encoding, options) {
			    str = "" + (str || ""); // Ensure string.

			    var encoder = iconv.getEncoder(encoding, options);

			    var res = encoder.write(str);
			    var trail = encoder.end();
			    
			    return (trail && trail.length > 0) ? Buffer.concat([res, trail]) : res;
			};

			iconv.decode = function decode(buf, encoding, options) {
			    if (typeof buf === 'string') {
			        if (!iconv.skipDecodeWarning) {
			            console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
			            iconv.skipDecodeWarning = true;
			        }

			        buf = Buffer.from("" + (buf || ""), "binary"); // Ensure buffer.
			    }

			    var decoder = iconv.getDecoder(encoding, options);

			    var res = decoder.write(buf);
			    var trail = decoder.end();

			    return trail ? (res + trail) : res;
			};

			iconv.encodingExists = function encodingExists(enc) {
			    try {
			        iconv.getCodec(enc);
			        return true;
			    } catch (e) {
			        return false;
			    }
			};

			// Legacy aliases to convert functions
			iconv.toEncoding = iconv.encode;
			iconv.fromEncoding = iconv.decode;

			// Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
			iconv._codecDataCache = {};
			iconv.getCodec = function getCodec(encoding) {
			    if (!iconv.encodings)
			        iconv.encodings = requireEncodings(); // Lazy load all encoding definitions.
			    
			    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
			    var enc = iconv._canonicalizeEncoding(encoding);

			    // Traverse iconv.encodings to find actual codec.
			    var codecOptions = {};
			    while (true) {
			        var codec = iconv._codecDataCache[enc];
			        if (codec)
			            return codec;

			        var codecDef = iconv.encodings[enc];

			        switch (typeof codecDef) {
			            case "string": // Direct alias to other encoding.
			                enc = codecDef;
			                break;

			            case "object": // Alias with options. Can be layered.
			                for (var key in codecDef)
			                    codecOptions[key] = codecDef[key];

			                if (!codecOptions.encodingName)
			                    codecOptions.encodingName = enc;
			                
			                enc = codecDef.type;
			                break;

			            case "function": // Codec itself.
			                if (!codecOptions.encodingName)
			                    codecOptions.encodingName = enc;

			                // The codec function must load all tables and return object with .encoder and .decoder methods.
			                // It'll be called only once (for each different options object).
			                codec = new codecDef(codecOptions, iconv);

			                iconv._codecDataCache[codecOptions.encodingName] = codec; // Save it to be reused later.
			                return codec;

			            default:
			                throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
			        }
			    }
			};

			iconv._canonicalizeEncoding = function(encoding) {
			    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
			    return (''+encoding).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
			};

			iconv.getEncoder = function getEncoder(encoding, options) {
			    var codec = iconv.getCodec(encoding),
			        encoder = new codec.encoder(options, codec);

			    if (codec.bomAware && options && options.addBOM)
			        encoder = new bomHandling.PrependBOM(encoder, options);

			    return encoder;
			};

			iconv.getDecoder = function getDecoder(encoding, options) {
			    var codec = iconv.getCodec(encoding),
			        decoder = new codec.decoder(options, codec);

			    if (codec.bomAware && !(options && options.stripBOM === false))
			        decoder = new bomHandling.StripBOM(decoder, options);

			    return decoder;
			};

			// Streaming API
			// NOTE: Streaming API naturally depends on 'stream' module from Node.js. Unfortunately in browser environments this module can add
			// up to 100Kb to the output bundle. To avoid unnecessary code bloat, we don't enable Streaming API in browser by default.
			// If you would like to enable it explicitly, please add the following code to your app:
			// > iconv.enableStreamingAPI(require('stream'));
			iconv.enableStreamingAPI = function enableStreamingAPI(stream_module) {
			    if (iconv.supportsStreams)
			        return;

			    // Dependency-inject stream module to create IconvLite stream classes.
			    var streams = requireStreams()(stream_module);

			    // Not public API yet, but expose the stream classes.
			    iconv.IconvLiteEncoderStream = streams.IconvLiteEncoderStream;
			    iconv.IconvLiteDecoderStream = streams.IconvLiteDecoderStream;

			    // Streaming API.
			    iconv.encodeStream = function encodeStream(encoding, options) {
			        return new iconv.IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
			    };

			    iconv.decodeStream = function decodeStream(encoding, options) {
			        return new iconv.IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
			    };

			    iconv.supportsStreams = true;
			};

			// Enable Streaming API automatically if 'stream' module is available and non-empty (the majority of environments).
			var stream_module;
			try {
			    stream_module = require$$4;
			} catch (e) {}

			if (stream_module && stream_module.Transform) {
			    iconv.enableStreamingAPI(stream_module);

			} else {
			    // In rare cases where 'stream' module is not available by default, throw a helpful exception.
			    iconv.encodeStream = iconv.decodeStream = function() {
			        throw new Error("iconv-lite Streaming API is not enabled. Use iconv.enableStreamingAPI(require('stream')); to enable it.");
			    };
			}
		} (lib$1));
		return lib$1.exports;
	}

	var lib = {};

	var browser$1 = {};

	var hasRequiredBrowser;

	function requireBrowser () {
		if (hasRequiredBrowser) return browser$1;
		hasRequiredBrowser = 1;
		Object.defineProperty(browser$1, "__esModule", { value: true });
		browser$1.default = () => {
		    throw new Error('File system is not available');
		};
		
		return browser$1;
	}

	var utf8 = {};

	var match = {};

	var hasRequiredMatch;

	function requireMatch () {
		if (hasRequiredMatch) return match;
		hasRequiredMatch = 1;
		Object.defineProperty(match, "__esModule", { value: true });
		match.default = (ctx, rec, confidence) => ({
		    confidence,
		    name: rec.name(ctx),
		    lang: rec.language ? rec.language() : undefined,
		});
		
		return match;
	}

	var hasRequiredUtf8;

	function requireUtf8 () {
		if (hasRequiredUtf8) return utf8;
		hasRequiredUtf8 = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(utf8, "__esModule", { value: true });
		const match_1 = __importDefault(requireMatch());
		class Utf8 {
		    name() {
		        return 'UTF-8';
		    }
		    match(det) {
		        let hasBOM = false, numValid = 0, numInvalid = 0, trailBytes = 0, confidence;
		        const input = det.rawInput;
		        if (det.rawLen >= 3 &&
		            (input[0] & 0xff) == 0xef &&
		            (input[1] & 0xff) == 0xbb &&
		            (input[2] & 0xff) == 0xbf) {
		            hasBOM = true;
		        }
		        for (let i = 0; i < det.rawLen; i++) {
		            const b = input[i];
		            if ((b & 0x80) == 0)
		                continue;
		            if ((b & 0x0e0) == 0x0c0) {
		                trailBytes = 1;
		            }
		            else if ((b & 0x0f0) == 0x0e0) {
		                trailBytes = 2;
		            }
		            else if ((b & 0x0f8) == 0xf0) {
		                trailBytes = 3;
		            }
		            else {
		                numInvalid++;
		                if (numInvalid > 5)
		                    break;
		                trailBytes = 0;
		            }
		            for (;;) {
		                i++;
		                if (i >= det.rawLen)
		                    break;
		                if ((input[i] & 0xc0) != 0x080) {
		                    numInvalid++;
		                    break;
		                }
		                if (--trailBytes == 0) {
		                    numValid++;
		                    break;
		                }
		            }
		        }
		        confidence = 0;
		        if (hasBOM && numInvalid == 0)
		            confidence = 100;
		        else if (hasBOM && numValid > numInvalid * 10)
		            confidence = 80;
		        else if (numValid > 3 && numInvalid == 0)
		            confidence = 100;
		        else if (numValid > 0 && numInvalid == 0)
		            confidence = 80;
		        else if (numValid == 0 && numInvalid == 0)
		            confidence = 10;
		        else if (numValid > numInvalid * 10)
		            confidence = 25;
		        else
		            return null;
		        return (0, match_1.default)(det, this, confidence);
		    }
		}
		utf8.default = Utf8;
		
		return utf8;
	}

	var unicode = {};

	var hasRequiredUnicode;

	function requireUnicode () {
		if (hasRequiredUnicode) return unicode;
		hasRequiredUnicode = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(unicode, "__esModule", { value: true });
		unicode.UTF_32LE = unicode.UTF_32BE = unicode.UTF_16LE = unicode.UTF_16BE = void 0;
		const match_1 = __importDefault(requireMatch());
		class UTF_16BE {
		    name() {
		        return 'UTF-16BE';
		    }
		    match(det) {
		        const input = det.rawInput;
		        if (input.length >= 2 &&
		            (input[0] & 0xff) == 0xfe &&
		            (input[1] & 0xff) == 0xff) {
		            return (0, match_1.default)(det, this, 100);
		        }
		        return null;
		    }
		}
		unicode.UTF_16BE = UTF_16BE;
		class UTF_16LE {
		    name() {
		        return 'UTF-16LE';
		    }
		    match(det) {
		        const input = det.rawInput;
		        if (input.length >= 2 &&
		            (input[0] & 0xff) == 0xff &&
		            (input[1] & 0xff) == 0xfe) {
		            if (input.length >= 4 && input[2] == 0x00 && input[3] == 0x00) {
		                return null;
		            }
		            return (0, match_1.default)(det, this, 100);
		        }
		        return null;
		    }
		}
		unicode.UTF_16LE = UTF_16LE;
		class UTF_32 {
		    name() {
		        return 'UTF-32';
		    }
		    getChar(_input, _index) {
		        return -1;
		    }
		    match(det) {
		        let numValid = 0, numInvalid = 0, hasBOM = false, confidence = 0;
		        const limit = (det.rawLen / 4) * 4;
		        const input = det.rawInput;
		        if (limit == 0) {
		            return null;
		        }
		        if (this.getChar(input, 0) == 0x0000feff) {
		            hasBOM = true;
		        }
		        for (let i = 0; i < limit; i += 4) {
		            const ch = this.getChar(input, i);
		            if (ch < 0 || ch >= 0x10ffff || (ch >= 0xd800 && ch <= 0xdfff)) {
		                numInvalid += 1;
		            }
		            else {
		                numValid += 1;
		            }
		        }
		        if (hasBOM && numInvalid == 0) {
		            confidence = 100;
		        }
		        else if (hasBOM && numValid > numInvalid * 10) {
		            confidence = 80;
		        }
		        else if (numValid > 3 && numInvalid == 0) {
		            confidence = 100;
		        }
		        else if (numValid > 0 && numInvalid == 0) {
		            confidence = 80;
		        }
		        else if (numValid > numInvalid * 10) {
		            confidence = 25;
		        }
		        return confidence == 0 ? null : (0, match_1.default)(det, this, confidence);
		    }
		}
		class UTF_32BE extends UTF_32 {
		    name() {
		        return 'UTF-32BE';
		    }
		    getChar(input, index) {
		        return (((input[index + 0] & 0xff) << 24) |
		            ((input[index + 1] & 0xff) << 16) |
		            ((input[index + 2] & 0xff) << 8) |
		            (input[index + 3] & 0xff));
		    }
		}
		unicode.UTF_32BE = UTF_32BE;
		class UTF_32LE extends UTF_32 {
		    name() {
		        return 'UTF-32LE';
		    }
		    getChar(input, index) {
		        return (((input[index + 3] & 0xff) << 24) |
		            ((input[index + 2] & 0xff) << 16) |
		            ((input[index + 1] & 0xff) << 8) |
		            (input[index + 0] & 0xff));
		    }
		}
		unicode.UTF_32LE = UTF_32LE;
		
		return unicode;
	}

	var mbcs = {};

	var hasRequiredMbcs;

	function requireMbcs () {
		if (hasRequiredMbcs) return mbcs;
		hasRequiredMbcs = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(mbcs, "__esModule", { value: true });
		mbcs.gb_18030 = mbcs.euc_kr = mbcs.euc_jp = mbcs.big5 = mbcs.sjis = void 0;
		const match_1 = __importDefault(requireMatch());
		function binarySearch(arr, searchValue) {
		    const find = (arr, searchValue, left, right) => {
		        if (right < left)
		            return -1;
		        const mid = Math.floor((left + right) >>> 1);
		        if (searchValue > arr[mid])
		            return find(arr, searchValue, mid + 1, right);
		        if (searchValue < arr[mid])
		            return find(arr, searchValue, left, mid - 1);
		        return mid;
		    };
		    return find(arr, searchValue, 0, arr.length - 1);
		}
		class IteratedChar {
		    constructor() {
		        this.charValue = 0;
		        this.index = 0;
		        this.nextIndex = 0;
		        this.error = false;
		        this.done = false;
		    }
		    reset() {
		        this.charValue = 0;
		        this.index = -1;
		        this.nextIndex = 0;
		        this.error = false;
		        this.done = false;
		    }
		    nextByte(det) {
		        if (this.nextIndex >= det.rawLen) {
		            this.done = true;
		            return -1;
		        }
		        const byteValue = det.rawInput[this.nextIndex++] & 0x00ff;
		        return byteValue;
		    }
		}
		let mbcs$1 = class mbcs {
		    constructor() {
		        this.commonChars = [];
		    }
		    name() {
		        return 'mbcs';
		    }
		    match(det) {
		        let doubleByteCharCount = 0, commonCharCount = 0, badCharCount = 0, totalCharCount = 0, confidence = 0;
		        const iter = new IteratedChar();
		        detectBlock: {
		            for (iter.reset(); this.nextChar(iter, det);) {
		                totalCharCount++;
		                if (iter.error) {
		                    badCharCount++;
		                }
		                else {
		                    const cv = iter.charValue & 0xffffffff;
		                    if (cv > 0xff) {
		                        doubleByteCharCount++;
		                        if (this.commonChars != null) {
		                            if (binarySearch(this.commonChars, cv) >= 0) {
		                                commonCharCount++;
		                            }
		                        }
		                    }
		                }
		                if (badCharCount >= 2 && badCharCount * 5 >= doubleByteCharCount) {
		                    break detectBlock;
		                }
		            }
		            if (doubleByteCharCount <= 10 && badCharCount == 0) {
		                if (doubleByteCharCount == 0 && totalCharCount < 10) {
		                    confidence = 0;
		                }
		                else {
		                    confidence = 10;
		                }
		                break detectBlock;
		            }
		            if (doubleByteCharCount < 20 * badCharCount) {
		                confidence = 0;
		                break detectBlock;
		            }
		            if (this.commonChars == null) {
		                confidence = 30 + doubleByteCharCount - 20 * badCharCount;
		                if (confidence > 100) {
		                    confidence = 100;
		                }
		            }
		            else {
		                const maxVal = Math.log(doubleByteCharCount / 4);
		                const scaleFactor = 90.0 / maxVal;
		                confidence = Math.floor(Math.log(commonCharCount + 1) * scaleFactor + 10);
		                confidence = Math.min(confidence, 100);
		            }
		        }
		        return confidence == 0 ? null : (0, match_1.default)(det, this, confidence);
		    }
		    nextChar(_iter, _det) {
		        return true;
		    }
		};
		class sjis extends mbcs$1 {
		    constructor() {
		        super(...arguments);
		        this.commonChars = [
		            0x8140, 0x8141, 0x8142, 0x8145, 0x815b, 0x8169, 0x816a, 0x8175, 0x8176,
		            0x82a0, 0x82a2, 0x82a4, 0x82a9, 0x82aa, 0x82ab, 0x82ad, 0x82af, 0x82b1,
		            0x82b3, 0x82b5, 0x82b7, 0x82bd, 0x82be, 0x82c1, 0x82c4, 0x82c5, 0x82c6,
		            0x82c8, 0x82c9, 0x82cc, 0x82cd, 0x82dc, 0x82e0, 0x82e7, 0x82e8, 0x82e9,
		            0x82ea, 0x82f0, 0x82f1, 0x8341, 0x8343, 0x834e, 0x834f, 0x8358, 0x835e,
		            0x8362, 0x8367, 0x8375, 0x8376, 0x8389, 0x838a, 0x838b, 0x838d, 0x8393,
		            0x8e96, 0x93fa, 0x95aa,
		        ];
		    }
		    name() {
		        return 'Shift_JIS';
		    }
		    language() {
		        return 'ja';
		    }
		    nextChar(iter, det) {
		        iter.index = iter.nextIndex;
		        iter.error = false;
		        const firstByte = (iter.charValue = iter.nextByte(det));
		        if (firstByte < 0)
		            return false;
		        if (firstByte <= 0x7f || (firstByte > 0xa0 && firstByte <= 0xdf))
		            return true;
		        const secondByte = iter.nextByte(det);
		        if (secondByte < 0)
		            return false;
		        iter.charValue = (firstByte << 8) | secondByte;
		        if (!((secondByte >= 0x40 && secondByte <= 0x7f) ||
		            (secondByte >= 0x80 && secondByte <= 0xff))) {
		            iter.error = true;
		        }
		        return true;
		    }
		}
		mbcs.sjis = sjis;
		class big5 extends mbcs$1 {
		    constructor() {
		        super(...arguments);
		        this.commonChars = [
		            0xa140, 0xa141, 0xa142, 0xa143, 0xa147, 0xa149, 0xa175, 0xa176, 0xa440,
		            0xa446, 0xa447, 0xa448, 0xa451, 0xa454, 0xa457, 0xa464, 0xa46a, 0xa46c,
		            0xa477, 0xa4a3, 0xa4a4, 0xa4a7, 0xa4c1, 0xa4ce, 0xa4d1, 0xa4df, 0xa4e8,
		            0xa4fd, 0xa540, 0xa548, 0xa558, 0xa569, 0xa5cd, 0xa5e7, 0xa657, 0xa661,
		            0xa662, 0xa668, 0xa670, 0xa6a8, 0xa6b3, 0xa6b9, 0xa6d3, 0xa6db, 0xa6e6,
		            0xa6f2, 0xa740, 0xa751, 0xa759, 0xa7da, 0xa8a3, 0xa8a5, 0xa8ad, 0xa8d1,
		            0xa8d3, 0xa8e4, 0xa8fc, 0xa9c0, 0xa9d2, 0xa9f3, 0xaa6b, 0xaaba, 0xaabe,
		            0xaacc, 0xaafc, 0xac47, 0xac4f, 0xacb0, 0xacd2, 0xad59, 0xaec9, 0xafe0,
		            0xb0ea, 0xb16f, 0xb2b3, 0xb2c4, 0xb36f, 0xb44c, 0xb44e, 0xb54c, 0xb5a5,
		            0xb5bd, 0xb5d0, 0xb5d8, 0xb671, 0xb7ed, 0xb867, 0xb944, 0xbad8, 0xbb44,
		            0xbba1, 0xbdd1, 0xc2c4, 0xc3b9, 0xc440, 0xc45f,
		        ];
		    }
		    name() {
		        return 'Big5';
		    }
		    language() {
		        return 'zh';
		    }
		    nextChar(iter, det) {
		        iter.index = iter.nextIndex;
		        iter.error = false;
		        const firstByte = (iter.charValue = iter.nextByte(det));
		        if (firstByte < 0)
		            return false;
		        if (firstByte <= 0x7f || firstByte == 0xff)
		            return true;
		        const secondByte = iter.nextByte(det);
		        if (secondByte < 0)
		            return false;
		        iter.charValue = (iter.charValue << 8) | secondByte;
		        if (secondByte < 0x40 || secondByte == 0x7f || secondByte == 0xff)
		            iter.error = true;
		        return true;
		    }
		}
		mbcs.big5 = big5;
		function eucNextChar(iter, det) {
		    iter.index = iter.nextIndex;
		    iter.error = false;
		    let firstByte = 0;
		    let secondByte = 0;
		    let thirdByte = 0;
		    buildChar: {
		        firstByte = iter.charValue = iter.nextByte(det);
		        if (firstByte < 0) {
		            iter.done = true;
		            break buildChar;
		        }
		        if (firstByte <= 0x8d) {
		            break buildChar;
		        }
		        secondByte = iter.nextByte(det);
		        iter.charValue = (iter.charValue << 8) | secondByte;
		        if (firstByte >= 0xa1 && firstByte <= 0xfe) {
		            if (secondByte < 0xa1) {
		                iter.error = true;
		            }
		            break buildChar;
		        }
		        if (firstByte == 0x8e) {
		            if (secondByte < 0xa1) {
		                iter.error = true;
		            }
		            break buildChar;
		        }
		        if (firstByte == 0x8f) {
		            thirdByte = iter.nextByte(det);
		            iter.charValue = (iter.charValue << 8) | thirdByte;
		            if (thirdByte < 0xa1) {
		                iter.error = true;
		            }
		        }
		    }
		    return iter.done == false;
		}
		class euc_jp extends mbcs$1 {
		    constructor() {
		        super(...arguments);
		        this.commonChars = [
		            0xa1a1, 0xa1a2, 0xa1a3, 0xa1a6, 0xa1bc, 0xa1ca, 0xa1cb, 0xa1d6, 0xa1d7,
		            0xa4a2, 0xa4a4, 0xa4a6, 0xa4a8, 0xa4aa, 0xa4ab, 0xa4ac, 0xa4ad, 0xa4af,
		            0xa4b1, 0xa4b3, 0xa4b5, 0xa4b7, 0xa4b9, 0xa4bb, 0xa4bd, 0xa4bf, 0xa4c0,
		            0xa4c1, 0xa4c3, 0xa4c4, 0xa4c6, 0xa4c7, 0xa4c8, 0xa4c9, 0xa4ca, 0xa4cb,
		            0xa4ce, 0xa4cf, 0xa4d0, 0xa4de, 0xa4df, 0xa4e1, 0xa4e2, 0xa4e4, 0xa4e8,
		            0xa4e9, 0xa4ea, 0xa4eb, 0xa4ec, 0xa4ef, 0xa4f2, 0xa4f3, 0xa5a2, 0xa5a3,
		            0xa5a4, 0xa5a6, 0xa5a7, 0xa5aa, 0xa5ad, 0xa5af, 0xa5b0, 0xa5b3, 0xa5b5,
		            0xa5b7, 0xa5b8, 0xa5b9, 0xa5bf, 0xa5c3, 0xa5c6, 0xa5c7, 0xa5c8, 0xa5c9,
		            0xa5cb, 0xa5d0, 0xa5d5, 0xa5d6, 0xa5d7, 0xa5de, 0xa5e0, 0xa5e1, 0xa5e5,
		            0xa5e9, 0xa5ea, 0xa5eb, 0xa5ec, 0xa5ed, 0xa5f3, 0xb8a9, 0xb9d4, 0xbaee,
		            0xbbc8, 0xbef0, 0xbfb7, 0xc4ea, 0xc6fc, 0xc7bd, 0xcab8, 0xcaf3, 0xcbdc,
		            0xcdd1,
		        ];
		        this.nextChar = eucNextChar;
		    }
		    name() {
		        return 'EUC-JP';
		    }
		    language() {
		        return 'ja';
		    }
		}
		mbcs.euc_jp = euc_jp;
		class euc_kr extends mbcs$1 {
		    constructor() {
		        super(...arguments);
		        this.commonChars = [
		            0xb0a1, 0xb0b3, 0xb0c5, 0xb0cd, 0xb0d4, 0xb0e6, 0xb0ed, 0xb0f8, 0xb0fa,
		            0xb0fc, 0xb1b8, 0xb1b9, 0xb1c7, 0xb1d7, 0xb1e2, 0xb3aa, 0xb3bb, 0xb4c2,
		            0xb4cf, 0xb4d9, 0xb4eb, 0xb5a5, 0xb5b5, 0xb5bf, 0xb5c7, 0xb5e9, 0xb6f3,
		            0xb7af, 0xb7c2, 0xb7ce, 0xb8a6, 0xb8ae, 0xb8b6, 0xb8b8, 0xb8bb, 0xb8e9,
		            0xb9ab, 0xb9ae, 0xb9cc, 0xb9ce, 0xb9fd, 0xbab8, 0xbace, 0xbad0, 0xbaf1,
		            0xbbe7, 0xbbf3, 0xbbfd, 0xbcad, 0xbcba, 0xbcd2, 0xbcf6, 0xbdba, 0xbdc0,
		            0xbdc3, 0xbdc5, 0xbec6, 0xbec8, 0xbedf, 0xbeee, 0xbef8, 0xbefa, 0xbfa1,
		            0xbfa9, 0xbfc0, 0xbfe4, 0xbfeb, 0xbfec, 0xbff8, 0xc0a7, 0xc0af, 0xc0b8,
		            0xc0ba, 0xc0bb, 0xc0bd, 0xc0c7, 0xc0cc, 0xc0ce, 0xc0cf, 0xc0d6, 0xc0da,
		            0xc0e5, 0xc0fb, 0xc0fc, 0xc1a4, 0xc1a6, 0xc1b6, 0xc1d6, 0xc1df, 0xc1f6,
		            0xc1f8, 0xc4a1, 0xc5cd, 0xc6ae, 0xc7cf, 0xc7d1, 0xc7d2, 0xc7d8, 0xc7e5,
		            0xc8ad,
		        ];
		        this.nextChar = eucNextChar;
		    }
		    name() {
		        return 'EUC-KR';
		    }
		    language() {
		        return 'ko';
		    }
		}
		mbcs.euc_kr = euc_kr;
		class gb_18030 extends mbcs$1 {
		    constructor() {
		        super(...arguments);
		        this.commonChars = [
		            0xa1a1, 0xa1a2, 0xa1a3, 0xa1a4, 0xa1b0, 0xa1b1, 0xa1f1, 0xa1f3, 0xa3a1,
		            0xa3ac, 0xa3ba, 0xb1a8, 0xb1b8, 0xb1be, 0xb2bb, 0xb3c9, 0xb3f6, 0xb4f3,
		            0xb5bd, 0xb5c4, 0xb5e3, 0xb6af, 0xb6d4, 0xb6e0, 0xb7a2, 0xb7a8, 0xb7bd,
		            0xb7d6, 0xb7dd, 0xb8b4, 0xb8df, 0xb8f6, 0xb9ab, 0xb9c9, 0xb9d8, 0xb9fa,
		            0xb9fd, 0xbacd, 0xbba7, 0xbbd6, 0xbbe1, 0xbbfa, 0xbcbc, 0xbcdb, 0xbcfe,
		            0xbdcc, 0xbecd, 0xbedd, 0xbfb4, 0xbfc6, 0xbfc9, 0xc0b4, 0xc0ed, 0xc1cb,
		            0xc2db, 0xc3c7, 0xc4dc, 0xc4ea, 0xc5cc, 0xc6f7, 0xc7f8, 0xc8ab, 0xc8cb,
		            0xc8d5, 0xc8e7, 0xc9cf, 0xc9fa, 0xcab1, 0xcab5, 0xcac7, 0xcad0, 0xcad6,
		            0xcaf5, 0xcafd, 0xccec, 0xcdf8, 0xceaa, 0xcec4, 0xced2, 0xcee5, 0xcfb5,
		            0xcfc2, 0xcfd6, 0xd0c2, 0xd0c5, 0xd0d0, 0xd0d4, 0xd1a7, 0xd2aa, 0xd2b2,
		            0xd2b5, 0xd2bb, 0xd2d4, 0xd3c3, 0xd3d0, 0xd3fd, 0xd4c2, 0xd4da, 0xd5e2,
		            0xd6d0,
		        ];
		    }
		    name() {
		        return 'GB18030';
		    }
		    language() {
		        return 'zh';
		    }
		    nextChar(iter, det) {
		        iter.index = iter.nextIndex;
		        iter.error = false;
		        let firstByte = 0;
		        let secondByte = 0;
		        let thirdByte = 0;
		        let fourthByte = 0;
		        buildChar: {
		            firstByte = iter.charValue = iter.nextByte(det);
		            if (firstByte < 0) {
		                iter.done = true;
		                break buildChar;
		            }
		            if (firstByte <= 0x80) {
		                break buildChar;
		            }
		            secondByte = iter.nextByte(det);
		            iter.charValue = (iter.charValue << 8) | secondByte;
		            if (firstByte >= 0x81 && firstByte <= 0xfe) {
		                if ((secondByte >= 0x40 && secondByte <= 0x7e) ||
		                    (secondByte >= 80 && secondByte <= 0xfe)) {
		                    break buildChar;
		                }
		                if (secondByte >= 0x30 && secondByte <= 0x39) {
		                    thirdByte = iter.nextByte(det);
		                    if (thirdByte >= 0x81 && thirdByte <= 0xfe) {
		                        fourthByte = iter.nextByte(det);
		                        if (fourthByte >= 0x30 && fourthByte <= 0x39) {
		                            iter.charValue =
		                                (iter.charValue << 16) | (thirdByte << 8) | fourthByte;
		                            break buildChar;
		                        }
		                    }
		                }
		                iter.error = true;
		                break buildChar;
		            }
		        }
		        return iter.done == false;
		    }
		}
		mbcs.gb_18030 = gb_18030;
		
		return mbcs;
	}

	var sbcs = {};

	var hasRequiredSbcs;

	function requireSbcs () {
		if (hasRequiredSbcs) return sbcs;
		hasRequiredSbcs = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(sbcs, "__esModule", { value: true });
		sbcs.KOI8_R = sbcs.windows_1256 = sbcs.windows_1251 = sbcs.ISO_8859_9 = sbcs.ISO_8859_8 = sbcs.ISO_8859_7 = sbcs.ISO_8859_6 = sbcs.ISO_8859_5 = sbcs.ISO_8859_2 = sbcs.ISO_8859_1 = void 0;
		const match_1 = __importDefault(requireMatch());
		const N_GRAM_MASK = 0xffffff;
		class NGramParser {
		    constructor(theNgramList, theByteMap) {
		        this.byteIndex = 0;
		        this.ngram = 0;
		        this.ngramCount = 0;
		        this.hitCount = 0;
		        this.spaceChar = 0x20;
		        this.ngramList = theNgramList;
		        this.byteMap = theByteMap;
		    }
		    search(table, value) {
		        let index = 0;
		        if (table[index + 32] <= value)
		            index += 32;
		        if (table[index + 16] <= value)
		            index += 16;
		        if (table[index + 8] <= value)
		            index += 8;
		        if (table[index + 4] <= value)
		            index += 4;
		        if (table[index + 2] <= value)
		            index += 2;
		        if (table[index + 1] <= value)
		            index += 1;
		        if (table[index] > value)
		            index -= 1;
		        if (index < 0 || table[index] != value)
		            return -1;
		        return index;
		    }
		    lookup(thisNgram) {
		        this.ngramCount += 1;
		        if (this.search(this.ngramList, thisNgram) >= 0) {
		            this.hitCount += 1;
		        }
		    }
		    addByte(b) {
		        this.ngram = ((this.ngram << 8) + (b & 0xff)) & N_GRAM_MASK;
		        this.lookup(this.ngram);
		    }
		    nextByte(det) {
		        if (this.byteIndex >= det.inputLen)
		            return -1;
		        return det.inputBytes[this.byteIndex++] & 0xff;
		    }
		    parse(det, spaceCh) {
		        let b, ignoreSpace = false;
		        this.spaceChar = spaceCh;
		        while ((b = this.nextByte(det)) >= 0) {
		            const mb = this.byteMap[b];
		            if (mb != 0) {
		                if (!(mb == this.spaceChar && ignoreSpace)) {
		                    this.addByte(mb);
		                }
		                ignoreSpace = mb == this.spaceChar;
		            }
		        }
		        this.addByte(this.spaceChar);
		        const rawPercent = this.hitCount / this.ngramCount;
		        if (rawPercent > 0.33)
		            return 98;
		        return Math.floor(rawPercent * 300.0);
		    }
		}
		class NGramsPlusLang {
		    constructor(la, ng) {
		        this.fLang = la;
		        this.fNGrams = ng;
		    }
		}
		const isFlatNgrams = (val) => Array.isArray(val) && isFinite(val[0]);
		let sbcs$1 = class sbcs {
		    constructor() {
		        this.spaceChar = 0x20;
		        this.nGramLang = undefined;
		    }
		    ngrams() {
		        return [];
		    }
		    byteMap() {
		        return [];
		    }
		    name(_input) {
		        return 'sbcs';
		    }
		    language() {
		        return this.nGramLang;
		    }
		    match(det) {
		        this.nGramLang = undefined;
		        const ngrams = this.ngrams();
		        if (isFlatNgrams(ngrams)) {
		            const parser = new NGramParser(ngrams, this.byteMap());
		            const confidence = parser.parse(det, this.spaceChar);
		            return confidence <= 0 ? null : (0, match_1.default)(det, this, confidence);
		        }
		        let bestConfidence = -1;
		        for (let i = ngrams.length - 1; i >= 0; i--) {
		            const ngl = ngrams[i];
		            const parser = new NGramParser(ngl.fNGrams, this.byteMap());
		            const confidence = parser.parse(det, this.spaceChar);
		            if (confidence > bestConfidence) {
		                bestConfidence = confidence;
		                this.nGramLang = ngl.fLang;
		            }
		        }
		        return bestConfidence <= 0 ? null : (0, match_1.default)(det, this, bestConfidence);
		    }
		};
		class ISO_8859_1 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0xaa, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0xb5, 0x20, 0x20, 0x20, 0x20, 0xba, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0xfd, 0xfe, 0xff,
		        ];
		    }
		    ngrams() {
		        return [
		            new NGramsPlusLang('da', [
		                0x206166, 0x206174, 0x206465, 0x20656e, 0x206572, 0x20666f, 0x206861,
		                0x206920, 0x206d65, 0x206f67, 0x2070e5, 0x207369, 0x207374, 0x207469,
		                0x207669, 0x616620, 0x616e20, 0x616e64, 0x617220, 0x617420, 0x646520,
		                0x64656e, 0x646572, 0x646574, 0x652073, 0x656420, 0x656465, 0x656e20,
		                0x656e64, 0x657220, 0x657265, 0x657320, 0x657420, 0x666f72, 0x676520,
		                0x67656e, 0x676572, 0x696765, 0x696c20, 0x696e67, 0x6b6520, 0x6b6b65,
		                0x6c6572, 0x6c6967, 0x6c6c65, 0x6d6564, 0x6e6465, 0x6e6520, 0x6e6720,
		                0x6e6765, 0x6f6720, 0x6f6d20, 0x6f7220, 0x70e520, 0x722064, 0x722065,
		                0x722073, 0x726520, 0x737465, 0x742073, 0x746520, 0x746572, 0x74696c,
		                0x766572,
		            ]),
		            new NGramsPlusLang('de', [
		                0x20616e, 0x206175, 0x206265, 0x206461, 0x206465, 0x206469, 0x206569,
		                0x206765, 0x206861, 0x20696e, 0x206d69, 0x207363, 0x207365, 0x20756e,
		                0x207665, 0x20766f, 0x207765, 0x207a75, 0x626572, 0x636820, 0x636865,
		                0x636874, 0x646173, 0x64656e, 0x646572, 0x646965, 0x652064, 0x652073,
		                0x65696e, 0x656974, 0x656e20, 0x657220, 0x657320, 0x67656e, 0x68656e,
		                0x687420, 0x696368, 0x696520, 0x696e20, 0x696e65, 0x697420, 0x6c6963,
		                0x6c6c65, 0x6e2061, 0x6e2064, 0x6e2073, 0x6e6420, 0x6e6465, 0x6e6520,
		                0x6e6720, 0x6e6765, 0x6e7465, 0x722064, 0x726465, 0x726569, 0x736368,
		                0x737465, 0x742064, 0x746520, 0x74656e, 0x746572, 0x756e64, 0x756e67,
		                0x766572,
		            ]),
		            new NGramsPlusLang('en', [
		                0x206120, 0x20616e, 0x206265, 0x20636f, 0x20666f, 0x206861, 0x206865,
		                0x20696e, 0x206d61, 0x206f66, 0x207072, 0x207265, 0x207361, 0x207374,
		                0x207468, 0x20746f, 0x207768, 0x616964, 0x616c20, 0x616e20, 0x616e64,
		                0x617320, 0x617420, 0x617465, 0x617469, 0x642061, 0x642074, 0x652061,
		                0x652073, 0x652074, 0x656420, 0x656e74, 0x657220, 0x657320, 0x666f72,
		                0x686174, 0x686520, 0x686572, 0x696420, 0x696e20, 0x696e67, 0x696f6e,
		                0x697320, 0x6e2061, 0x6e2074, 0x6e6420, 0x6e6720, 0x6e7420, 0x6f6620,
		                0x6f6e20, 0x6f7220, 0x726520, 0x727320, 0x732061, 0x732074, 0x736169,
		                0x737420, 0x742074, 0x746572, 0x746861, 0x746865, 0x74696f, 0x746f20,
		                0x747320,
		            ]),
		            new NGramsPlusLang('es', [
		                0x206120, 0x206361, 0x20636f, 0x206465, 0x20656c, 0x20656e, 0x206573,
		                0x20696e, 0x206c61, 0x206c6f, 0x207061, 0x20706f, 0x207072, 0x207175,
		                0x207265, 0x207365, 0x20756e, 0x207920, 0x612063, 0x612064, 0x612065,
		                0x61206c, 0x612070, 0x616369, 0x61646f, 0x616c20, 0x617220, 0x617320,
		                0x6369f3, 0x636f6e, 0x646520, 0x64656c, 0x646f20, 0x652064, 0x652065,
		                0x65206c, 0x656c20, 0x656e20, 0x656e74, 0x657320, 0x657374, 0x69656e,
		                0x69f36e, 0x6c6120, 0x6c6f73, 0x6e2065, 0x6e7465, 0x6f2064, 0x6f2065,
		                0x6f6e20, 0x6f7220, 0x6f7320, 0x706172, 0x717565, 0x726120, 0x726573,
		                0x732064, 0x732065, 0x732070, 0x736520, 0x746520, 0x746f20, 0x756520,
		                0xf36e20,
		            ]),
		            new NGramsPlusLang('fr', [
		                0x206175, 0x20636f, 0x206461, 0x206465, 0x206475, 0x20656e, 0x206574,
		                0x206c61, 0x206c65, 0x207061, 0x20706f, 0x207072, 0x207175, 0x207365,
		                0x20736f, 0x20756e, 0x20e020, 0x616e74, 0x617469, 0x636520, 0x636f6e,
		                0x646520, 0x646573, 0x647520, 0x652061, 0x652063, 0x652064, 0x652065,
		                0x65206c, 0x652070, 0x652073, 0x656e20, 0x656e74, 0x657220, 0x657320,
		                0x657420, 0x657572, 0x696f6e, 0x697320, 0x697420, 0x6c6120, 0x6c6520,
		                0x6c6573, 0x6d656e, 0x6e2064, 0x6e6520, 0x6e7320, 0x6e7420, 0x6f6e20,
		                0x6f6e74, 0x6f7572, 0x717565, 0x72206c, 0x726520, 0x732061, 0x732064,
		                0x732065, 0x73206c, 0x732070, 0x742064, 0x746520, 0x74696f, 0x756520,
		                0x757220,
		            ]),
		            new NGramsPlusLang('it', [
		                0x20616c, 0x206368, 0x20636f, 0x206465, 0x206469, 0x206520, 0x20696c,
		                0x20696e, 0x206c61, 0x207065, 0x207072, 0x20756e, 0x612063, 0x612064,
		                0x612070, 0x612073, 0x61746f, 0x636865, 0x636f6e, 0x64656c, 0x646920,
		                0x652061, 0x652063, 0x652064, 0x652069, 0x65206c, 0x652070, 0x652073,
		                0x656c20, 0x656c6c, 0x656e74, 0x657220, 0x686520, 0x692061, 0x692063,
		                0x692064, 0x692073, 0x696120, 0x696c20, 0x696e20, 0x696f6e, 0x6c6120,
		                0x6c6520, 0x6c6920, 0x6c6c61, 0x6e6520, 0x6e6920, 0x6e6f20, 0x6e7465,
		                0x6f2061, 0x6f2064, 0x6f2069, 0x6f2073, 0x6f6e20, 0x6f6e65, 0x706572,
		                0x726120, 0x726520, 0x736920, 0x746120, 0x746520, 0x746920, 0x746f20,
		                0x7a696f,
		            ]),
		            new NGramsPlusLang('nl', [
		                0x20616c, 0x206265, 0x206461, 0x206465, 0x206469, 0x206565, 0x20656e,
		                0x206765, 0x206865, 0x20696e, 0x206d61, 0x206d65, 0x206f70, 0x207465,
		                0x207661, 0x207665, 0x20766f, 0x207765, 0x207a69, 0x61616e, 0x616172,
		                0x616e20, 0x616e64, 0x617220, 0x617420, 0x636874, 0x646520, 0x64656e,
		                0x646572, 0x652062, 0x652076, 0x65656e, 0x656572, 0x656e20, 0x657220,
		                0x657273, 0x657420, 0x67656e, 0x686574, 0x696520, 0x696e20, 0x696e67,
		                0x697320, 0x6e2062, 0x6e2064, 0x6e2065, 0x6e2068, 0x6e206f, 0x6e2076,
		                0x6e6465, 0x6e6720, 0x6f6e64, 0x6f6f72, 0x6f7020, 0x6f7220, 0x736368,
		                0x737465, 0x742064, 0x746520, 0x74656e, 0x746572, 0x76616e, 0x766572,
		                0x766f6f,
		            ]),
		            new NGramsPlusLang('no', [
		                0x206174, 0x206176, 0x206465, 0x20656e, 0x206572, 0x20666f, 0x206861,
		                0x206920, 0x206d65, 0x206f67, 0x2070e5, 0x207365, 0x20736b, 0x20736f,
		                0x207374, 0x207469, 0x207669, 0x20e520, 0x616e64, 0x617220, 0x617420,
		                0x646520, 0x64656e, 0x646574, 0x652073, 0x656420, 0x656e20, 0x656e65,
		                0x657220, 0x657265, 0x657420, 0x657474, 0x666f72, 0x67656e, 0x696b6b,
		                0x696c20, 0x696e67, 0x6b6520, 0x6b6b65, 0x6c6520, 0x6c6c65, 0x6d6564,
		                0x6d656e, 0x6e2073, 0x6e6520, 0x6e6720, 0x6e6765, 0x6e6e65, 0x6f6720,
		                0x6f6d20, 0x6f7220, 0x70e520, 0x722073, 0x726520, 0x736f6d, 0x737465,
		                0x742073, 0x746520, 0x74656e, 0x746572, 0x74696c, 0x747420, 0x747465,
		                0x766572,
		            ]),
		            new NGramsPlusLang('pt', [
		                0x206120, 0x20636f, 0x206461, 0x206465, 0x20646f, 0x206520, 0x206573,
		                0x206d61, 0x206e6f, 0x206f20, 0x207061, 0x20706f, 0x207072, 0x207175,
		                0x207265, 0x207365, 0x20756d, 0x612061, 0x612063, 0x612064, 0x612070,
		                0x616465, 0x61646f, 0x616c20, 0x617220, 0x617261, 0x617320, 0x636f6d,
		                0x636f6e, 0x646120, 0x646520, 0x646f20, 0x646f73, 0x652061, 0x652064,
		                0x656d20, 0x656e74, 0x657320, 0x657374, 0x696120, 0x696361, 0x6d656e,
		                0x6e7465, 0x6e746f, 0x6f2061, 0x6f2063, 0x6f2064, 0x6f2065, 0x6f2070,
		                0x6f7320, 0x706172, 0x717565, 0x726120, 0x726573, 0x732061, 0x732064,
		                0x732065, 0x732070, 0x737461, 0x746520, 0x746f20, 0x756520, 0xe36f20,
		                0xe7e36f,
		            ]),
		            new NGramsPlusLang('sv', [
		                0x206174, 0x206176, 0x206465, 0x20656e, 0x2066f6, 0x206861, 0x206920,
		                0x20696e, 0x206b6f, 0x206d65, 0x206f63, 0x2070e5, 0x20736b, 0x20736f,
		                0x207374, 0x207469, 0x207661, 0x207669, 0x20e472, 0x616465, 0x616e20,
		                0x616e64, 0x617220, 0x617474, 0x636820, 0x646520, 0x64656e, 0x646572,
		                0x646574, 0x656420, 0x656e20, 0x657220, 0x657420, 0x66f672, 0x67656e,
		                0x696c6c, 0x696e67, 0x6b6120, 0x6c6c20, 0x6d6564, 0x6e2073, 0x6e6120,
		                0x6e6465, 0x6e6720, 0x6e6765, 0x6e696e, 0x6f6368, 0x6f6d20, 0x6f6e20,
		                0x70e520, 0x722061, 0x722073, 0x726120, 0x736b61, 0x736f6d, 0x742073,
		                0x746120, 0x746520, 0x746572, 0x74696c, 0x747420, 0x766172, 0xe47220,
		                0xf67220,
		            ]),
		        ];
		    }
		    name(input) {
		        return input && input.c1Bytes ? 'windows-1252' : 'ISO-8859-1';
		    }
		}
		sbcs.ISO_8859_1 = ISO_8859_1;
		class ISO_8859_2 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0xb1, 0x20, 0xb3, 0x20, 0xb5, 0xb6, 0x20,
		            0x20, 0xb9, 0xba, 0xbb, 0xbc, 0x20, 0xbe, 0xbf, 0x20, 0xb1, 0x20, 0xb3,
		            0x20, 0xb5, 0xb6, 0xb7, 0x20, 0xb9, 0xba, 0xbb, 0xbc, 0x20, 0xbe, 0xbf,
		            0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0xfd, 0xfe, 0x20,
		        ];
		    }
		    ngrams() {
		        return [
		            new NGramsPlusLang('cs', [
		                0x206120, 0x206279, 0x20646f, 0x206a65, 0x206e61, 0x206e65, 0x206f20,
		                0x206f64, 0x20706f, 0x207072, 0x2070f8, 0x20726f, 0x207365, 0x20736f,
		                0x207374, 0x20746f, 0x207620, 0x207679, 0x207a61, 0x612070, 0x636520,
		                0x636820, 0x652070, 0x652073, 0x652076, 0x656d20, 0x656eed, 0x686f20,
		                0x686f64, 0x697374, 0x6a6520, 0x6b7465, 0x6c6520, 0x6c6920, 0x6e6120,
		                0x6ee920, 0x6eec20, 0x6eed20, 0x6f2070, 0x6f646e, 0x6f6a69, 0x6f7374,
		                0x6f7520, 0x6f7661, 0x706f64, 0x706f6a, 0x70726f, 0x70f865, 0x736520,
		                0x736f75, 0x737461, 0x737469, 0x73746e, 0x746572, 0x746eed, 0x746f20,
		                0x752070, 0xbe6520, 0xe16eed, 0xe9686f, 0xed2070, 0xed2073, 0xed6d20,
		                0xf86564,
		            ]),
		            new NGramsPlusLang('hu', [
		                0x206120, 0x20617a, 0x206265, 0x206567, 0x20656c, 0x206665, 0x206861,
		                0x20686f, 0x206973, 0x206b65, 0x206b69, 0x206bf6, 0x206c65, 0x206d61,
		                0x206d65, 0x206d69, 0x206e65, 0x20737a, 0x207465, 0x20e973, 0x612061,
		                0x61206b, 0x61206d, 0x612073, 0x616b20, 0x616e20, 0x617a20, 0x62616e,
		                0x62656e, 0x656779, 0x656b20, 0x656c20, 0x656c65, 0x656d20, 0x656e20,
		                0x657265, 0x657420, 0x657465, 0x657474, 0x677920, 0x686f67, 0x696e74,
		                0x697320, 0x6b2061, 0x6bf67a, 0x6d6567, 0x6d696e, 0x6e2061, 0x6e616b,
		                0x6e656b, 0x6e656d, 0x6e7420, 0x6f6779, 0x732061, 0x737a65, 0x737a74,
		                0x737ae1, 0x73e967, 0x742061, 0x747420, 0x74e173, 0x7a6572, 0xe16e20,
		                0xe97320,
		            ]),
		            new NGramsPlusLang('pl', [
		                0x20637a, 0x20646f, 0x206920, 0x206a65, 0x206b6f, 0x206d61, 0x206d69,
		                0x206e61, 0x206e69, 0x206f64, 0x20706f, 0x207072, 0x207369, 0x207720,
		                0x207769, 0x207779, 0x207a20, 0x207a61, 0x612070, 0x612077, 0x616e69,
		                0x636820, 0x637a65, 0x637a79, 0x646f20, 0x647a69, 0x652070, 0x652073,
		                0x652077, 0x65207a, 0x65676f, 0x656a20, 0x656d20, 0x656e69, 0x676f20,
		                0x696120, 0x696520, 0x69656a, 0x6b6120, 0x6b6920, 0x6b6965, 0x6d6965,
		                0x6e6120, 0x6e6961, 0x6e6965, 0x6f2070, 0x6f7761, 0x6f7769, 0x706f6c,
		                0x707261, 0x70726f, 0x70727a, 0x727a65, 0x727a79, 0x7369ea, 0x736b69,
		                0x737461, 0x776965, 0x796368, 0x796d20, 0x7a6520, 0x7a6965, 0x7a7920,
		                0xf37720,
		            ]),
		            new NGramsPlusLang('ro', [
		                0x206120, 0x206163, 0x206361, 0x206365, 0x20636f, 0x206375, 0x206465,
		                0x206469, 0x206c61, 0x206d61, 0x207065, 0x207072, 0x207365, 0x2073e3,
		                0x20756e, 0x20ba69, 0x20ee6e, 0x612063, 0x612064, 0x617265, 0x617420,
		                0x617465, 0x617520, 0x636172, 0x636f6e, 0x637520, 0x63e320, 0x646520,
		                0x652061, 0x652063, 0x652064, 0x652070, 0x652073, 0x656120, 0x656920,
		                0x656c65, 0x656e74, 0x657374, 0x692061, 0x692063, 0x692064, 0x692070,
		                0x696520, 0x696920, 0x696e20, 0x6c6120, 0x6c6520, 0x6c6f72, 0x6c7569,
		                0x6e6520, 0x6e7472, 0x6f7220, 0x70656e, 0x726520, 0x726561, 0x727520,
		                0x73e320, 0x746520, 0x747275, 0x74e320, 0x756920, 0x756c20, 0xba6920,
		                0xee6e20,
		            ]),
		        ];
		    }
		    name(det) {
		        return det && det.c1Bytes ? 'windows-1250' : 'ISO-8859-2';
		    }
		}
		sbcs.ISO_8859_2 = ISO_8859_2;
		class ISO_8859_5 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0x20, 0xfe, 0xff, 0xd0, 0xd1, 0xd2, 0xd3,
		            0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf,
		            0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7,
		            0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0x20, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0x20, 0xfe, 0xff,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20d220, 0x20d2de, 0x20d4de, 0x20d7d0, 0x20d820, 0x20dad0, 0x20dade,
		            0x20ddd0, 0x20ddd5, 0x20ded1, 0x20dfde, 0x20dfe0, 0x20e0d0, 0x20e1de,
		            0x20e1e2, 0x20e2de, 0x20e7e2, 0x20ede2, 0xd0ddd8, 0xd0e2ec, 0xd3de20,
		            0xd5dbec, 0xd5ddd8, 0xd5e1e2, 0xd5e220, 0xd820df, 0xd8d520, 0xd8d820,
		            0xd8ef20, 0xdbd5dd, 0xdbd820, 0xdbecdd, 0xddd020, 0xddd520, 0xddd8d5,
		            0xddd8ef, 0xddde20, 0xddded2, 0xde20d2, 0xde20df, 0xde20e1, 0xded220,
		            0xded2d0, 0xded3de, 0xded920, 0xdedbec, 0xdedc20, 0xdee1e2, 0xdfdedb,
		            0xdfe0d5, 0xdfe0d8, 0xdfe0de, 0xe0d0d2, 0xe0d5d4, 0xe1e2d0, 0xe1e2d2,
		            0xe1e2d8, 0xe1ef20, 0xe2d5db, 0xe2de20, 0xe2dee0, 0xe2ec20, 0xe7e2de,
		            0xebe520,
		        ];
		    }
		    name() {
		        return 'ISO-8859-5';
		    }
		    language() {
		        return 'ru';
		    }
		}
		sbcs.ISO_8859_5 = ISO_8859_5;
		class ISO_8859_6 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb,
		            0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7,
		            0xd8, 0xd9, 0xda, 0x20, 0x20, 0x20, 0x20, 0x20, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20c7e4, 0x20c7e6, 0x20c8c7, 0x20d9e4, 0x20e1ea, 0x20e4e4, 0x20e5e6,
		            0x20e8c7, 0xc720c7, 0xc7c120, 0xc7ca20, 0xc7d120, 0xc7e420, 0xc7e4c3,
		            0xc7e4c7, 0xc7e4c8, 0xc7e4ca, 0xc7e4cc, 0xc7e4cd, 0xc7e4cf, 0xc7e4d3,
		            0xc7e4d9, 0xc7e4e2, 0xc7e4e5, 0xc7e4e8, 0xc7e4ea, 0xc7e520, 0xc7e620,
		            0xc7e6ca, 0xc820c7, 0xc920c7, 0xc920e1, 0xc920e4, 0xc920e5, 0xc920e8,
		            0xca20c7, 0xcf20c7, 0xcfc920, 0xd120c7, 0xd1c920, 0xd320c7, 0xd920c7,
		            0xd9e4e9, 0xe1ea20, 0xe420c7, 0xe4c920, 0xe4e920, 0xe4ea20, 0xe520c7,
		            0xe5c720, 0xe5c920, 0xe5e620, 0xe620c7, 0xe720c7, 0xe7c720, 0xe8c7e4,
		            0xe8e620, 0xe920c7, 0xea20c7, 0xea20e5, 0xea20e8, 0xeac920, 0xead120,
		            0xeae620,
		        ];
		    }
		    name() {
		        return 'ISO-8859-6';
		    }
		    language() {
		        return 'ar';
		    }
		}
		sbcs.ISO_8859_6 = ISO_8859_6;
		class ISO_8859_7 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0xa1, 0xa2, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0xdc, 0x20, 0xdd, 0xde, 0xdf, 0x20, 0xfc, 0x20, 0xfd, 0xfe,
		            0xc0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0x20, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xdc, 0xdd, 0xde, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0xfd, 0xfe, 0x20,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20e1ed, 0x20e1f0, 0x20e3e9, 0x20e4e9, 0x20e5f0, 0x20e720, 0x20eae1,
		            0x20ece5, 0x20ede1, 0x20ef20, 0x20f0e1, 0x20f0ef, 0x20f0f1, 0x20f3f4,
		            0x20f3f5, 0x20f4e7, 0x20f4ef, 0xdfe120, 0xe120e1, 0xe120f4, 0xe1e920,
		            0xe1ed20, 0xe1f0fc, 0xe1f220, 0xe3e9e1, 0xe5e920, 0xe5f220, 0xe720f4,
		            0xe7ed20, 0xe7f220, 0xe920f4, 0xe9e120, 0xe9eade, 0xe9f220, 0xeae1e9,
		            0xeae1f4, 0xece520, 0xed20e1, 0xed20e5, 0xed20f0, 0xede120, 0xeff220,
		            0xeff520, 0xf0eff5, 0xf0f1ef, 0xf0fc20, 0xf220e1, 0xf220e5, 0xf220ea,
		            0xf220f0, 0xf220f4, 0xf3e520, 0xf3e720, 0xf3f4ef, 0xf4e120, 0xf4e1e9,
		            0xf4e7ed, 0xf4e7f2, 0xf4e9ea, 0xf4ef20, 0xf4eff5, 0xf4f9ed, 0xf9ed20,
		            0xfeed20,
		        ];
		    }
		    name(det) {
		        return det && det.c1Bytes ? 'windows-1253' : 'ISO-8859-7';
		    }
		    language() {
		        return 'el';
		    }
		}
		sbcs.ISO_8859_7 = ISO_8859_7;
		class ISO_8859_8 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0xb5, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0x20,
		            0x20, 0x20, 0x20, 0x20,
		        ];
		    }
		    ngrams() {
		        return [
		            new NGramsPlusLang('he', [
		                0x20e0e5, 0x20e0e7, 0x20e0e9, 0x20e0fa, 0x20e1e9, 0x20e1ee, 0x20e4e0,
		                0x20e4e5, 0x20e4e9, 0x20e4ee, 0x20e4f2, 0x20e4f9, 0x20e4fa, 0x20ece0,
		                0x20ece4, 0x20eee0, 0x20f2ec, 0x20f9ec, 0xe0fa20, 0xe420e0, 0xe420e1,
		                0xe420e4, 0xe420ec, 0xe420ee, 0xe420f9, 0xe4e5e0, 0xe5e020, 0xe5ed20,
		                0xe5ef20, 0xe5f820, 0xe5fa20, 0xe920e4, 0xe9e420, 0xe9e5fa, 0xe9e9ed,
		                0xe9ed20, 0xe9ef20, 0xe9f820, 0xe9fa20, 0xec20e0, 0xec20e4, 0xece020,
		                0xece420, 0xed20e0, 0xed20e1, 0xed20e4, 0xed20ec, 0xed20ee, 0xed20f9,
		                0xeee420, 0xef20e4, 0xf0e420, 0xf0e920, 0xf0e9ed, 0xf2ec20, 0xf820e4,
		                0xf8e9ed, 0xf9ec20, 0xfa20e0, 0xfa20e1, 0xfa20e4, 0xfa20ec, 0xfa20ee,
		                0xfa20f9,
		            ]),
		            new NGramsPlusLang('he', [
		                0x20e0e5, 0x20e0ec, 0x20e4e9, 0x20e4ec, 0x20e4ee, 0x20e4f0, 0x20e9f0,
		                0x20ecf2, 0x20ecf9, 0x20ede5, 0x20ede9, 0x20efe5, 0x20efe9, 0x20f8e5,
		                0x20f8e9, 0x20fae0, 0x20fae5, 0x20fae9, 0xe020e4, 0xe020ec, 0xe020ed,
		                0xe020fa, 0xe0e420, 0xe0e5e4, 0xe0ec20, 0xe0ee20, 0xe120e4, 0xe120ed,
		                0xe120fa, 0xe420e4, 0xe420e9, 0xe420ec, 0xe420ed, 0xe420ef, 0xe420f8,
		                0xe420fa, 0xe4ec20, 0xe5e020, 0xe5e420, 0xe7e020, 0xe9e020, 0xe9e120,
		                0xe9e420, 0xec20e4, 0xec20ed, 0xec20fa, 0xecf220, 0xecf920, 0xede9e9,
		                0xede9f0, 0xede9f8, 0xee20e4, 0xee20ed, 0xee20fa, 0xeee120, 0xeee420,
		                0xf2e420, 0xf920e4, 0xf920ed, 0xf920fa, 0xf9e420, 0xfae020, 0xfae420,
		                0xfae5e9,
		            ]),
		        ];
		    }
		    name(det) {
		        return det && det.c1Bytes ? 'windows-1255' : 'ISO-8859-8';
		    }
		    language() {
		        return 'he';
		    }
		}
		sbcs.ISO_8859_8 = ISO_8859_8;
		class ISO_8859_9 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0xaa, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0xb5, 0x20, 0x20, 0x20, 0x20, 0xba, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0x69, 0xfe, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0x20, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0xfd, 0xfe, 0xff,
		        ];
		    }
		    ngrams() {
		        return [
		            0x206261, 0x206269, 0x206275, 0x206461, 0x206465, 0x206765, 0x206861,
		            0x20696c, 0x206b61, 0x206b6f, 0x206d61, 0x206f6c, 0x207361, 0x207461,
		            0x207665, 0x207961, 0x612062, 0x616b20, 0x616c61, 0x616d61, 0x616e20,
		            0x616efd, 0x617220, 0x617261, 0x6172fd, 0x6173fd, 0x617961, 0x626972,
		            0x646120, 0x646520, 0x646920, 0x652062, 0x65206b, 0x656469, 0x656e20,
		            0x657220, 0x657269, 0x657369, 0x696c65, 0x696e20, 0x696e69, 0x697220,
		            0x6c616e, 0x6c6172, 0x6c6520, 0x6c6572, 0x6e2061, 0x6e2062, 0x6e206b,
		            0x6e6461, 0x6e6465, 0x6e6520, 0x6e6920, 0x6e696e, 0x6efd20, 0x72696e,
		            0x72fd6e, 0x766520, 0x796120, 0x796f72, 0xfd6e20, 0xfd6e64, 0xfd6efd,
		            0xfdf0fd,
		        ];
		    }
		    name(det) {
		        return det && det.c1Bytes ? 'windows-1254' : 'ISO-8859-9';
		    }
		    language() {
		        return 'tr';
		    }
		}
		sbcs.ISO_8859_9 = ISO_8859_9;
		class windows_1251 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x90, 0x83, 0x20, 0x83,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x9a, 0x20, 0x9c, 0x9d, 0x9e, 0x9f,
		            0x90, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x9a, 0x20,
		            0x9c, 0x9d, 0x9e, 0x9f, 0x20, 0xa2, 0xa2, 0xbc, 0x20, 0xb4, 0x20, 0x20,
		            0xb8, 0x20, 0xba, 0x20, 0x20, 0x20, 0x20, 0xbf, 0x20, 0x20, 0xb3, 0xb3,
		            0xb4, 0xb5, 0x20, 0x20, 0xb8, 0x20, 0xba, 0x20, 0xbc, 0xbe, 0xbe, 0xbf,
		            0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb,
		            0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7,
		            0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb,
		            0xfc, 0xfd, 0xfe, 0xff,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20e220, 0x20e2ee, 0x20e4ee, 0x20e7e0, 0x20e820, 0x20eae0, 0x20eaee,
		            0x20ede0, 0x20ede5, 0x20eee1, 0x20efee, 0x20eff0, 0x20f0e0, 0x20f1ee,
		            0x20f1f2, 0x20f2ee, 0x20f7f2, 0x20fdf2, 0xe0ede8, 0xe0f2fc, 0xe3ee20,
		            0xe5ebfc, 0xe5ede8, 0xe5f1f2, 0xe5f220, 0xe820ef, 0xe8e520, 0xe8e820,
		            0xe8ff20, 0xebe5ed, 0xebe820, 0xebfced, 0xede020, 0xede520, 0xede8e5,
		            0xede8ff, 0xedee20, 0xedeee2, 0xee20e2, 0xee20ef, 0xee20f1, 0xeee220,
		            0xeee2e0, 0xeee3ee, 0xeee920, 0xeeebfc, 0xeeec20, 0xeef1f2, 0xefeeeb,
		            0xeff0e5, 0xeff0e8, 0xeff0ee, 0xf0e0e2, 0xf0e5e4, 0xf1f2e0, 0xf1f2e2,
		            0xf1f2e8, 0xf1ff20, 0xf2e5eb, 0xf2ee20, 0xf2eef0, 0xf2fc20, 0xf7f2ee,
		            0xfbf520,
		        ];
		    }
		    name() {
		        return 'windows-1251';
		    }
		    language() {
		        return 'ru';
		    }
		}
		sbcs.windows_1251 = windows_1251;
		class windows_1256 extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x81, 0x20, 0x83,
		            0x20, 0x20, 0x20, 0x20, 0x88, 0x20, 0x8a, 0x20, 0x9c, 0x8d, 0x8e, 0x8f,
		            0x90, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x98, 0x20, 0x9a, 0x20,
		            0x9c, 0x20, 0x20, 0x9f, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0xaa, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0xb5, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb,
		            0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0x20,
		            0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3,
		            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
		            0x20, 0x20, 0x20, 0x20, 0xf4, 0x20, 0x20, 0x20, 0x20, 0xf9, 0x20, 0xfb,
		            0xfc, 0x20, 0x20, 0xff,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20c7e1, 0x20c7e4, 0x20c8c7, 0x20dae1, 0x20dded, 0x20e1e1, 0x20e3e4,
		            0x20e6c7, 0xc720c7, 0xc7c120, 0xc7ca20, 0xc7d120, 0xc7e120, 0xc7e1c3,
		            0xc7e1c7, 0xc7e1c8, 0xc7e1ca, 0xc7e1cc, 0xc7e1cd, 0xc7e1cf, 0xc7e1d3,
		            0xc7e1da, 0xc7e1de, 0xc7e1e3, 0xc7e1e6, 0xc7e1ed, 0xc7e320, 0xc7e420,
		            0xc7e4ca, 0xc820c7, 0xc920c7, 0xc920dd, 0xc920e1, 0xc920e3, 0xc920e6,
		            0xca20c7, 0xcf20c7, 0xcfc920, 0xd120c7, 0xd1c920, 0xd320c7, 0xda20c7,
		            0xdae1ec, 0xdded20, 0xe120c7, 0xe1c920, 0xe1ec20, 0xe1ed20, 0xe320c7,
		            0xe3c720, 0xe3c920, 0xe3e420, 0xe420c7, 0xe520c7, 0xe5c720, 0xe6c7e1,
		            0xe6e420, 0xec20c7, 0xed20c7, 0xed20e3, 0xed20e6, 0xedc920, 0xedd120,
		            0xede420,
		        ];
		    }
		    name() {
		        return 'windows-1256';
		    }
		    language() {
		        return 'ar';
		    }
		}
		sbcs.windows_1256 = windows_1256;
		class KOI8_R extends sbcs$1 {
		    byteMap() {
		        return [
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
		            0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73,
		            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b,
		            0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
		            0x78, 0x79, 0x7a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa3, 0x20, 0x20, 0x20, 0x20,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0xa3,
		            0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
		            0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb,
		            0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7,
		            0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf, 0xc0, 0xc1, 0xc2, 0xc3,
		            0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf,
		            0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xdb,
		            0xdc, 0xdd, 0xde, 0xdf,
		        ];
		    }
		    ngrams() {
		        return [
		            0x20c4cf, 0x20c920, 0x20cbc1, 0x20cbcf, 0x20cec1, 0x20cec5, 0x20cfc2,
		            0x20d0cf, 0x20d0d2, 0x20d2c1, 0x20d3cf, 0x20d3d4, 0x20d4cf, 0x20d720,
		            0x20d7cf, 0x20dac1, 0x20dcd4, 0x20ded4, 0xc1cec9, 0xc1d4d8, 0xc5ccd8,
		            0xc5cec9, 0xc5d3d4, 0xc5d420, 0xc7cf20, 0xc920d0, 0xc9c520, 0xc9c920,
		            0xc9d120, 0xccc5ce, 0xccc920, 0xccd8ce, 0xcec120, 0xcec520, 0xcec9c5,
		            0xcec9d1, 0xcecf20, 0xcecfd7, 0xcf20d0, 0xcf20d3, 0xcf20d7, 0xcfc7cf,
		            0xcfca20, 0xcfccd8, 0xcfcd20, 0xcfd3d4, 0xcfd720, 0xcfd7c1, 0xd0cfcc,
		            0xd0d2c5, 0xd0d2c9, 0xd0d2cf, 0xd2c1d7, 0xd2c5c4, 0xd3d120, 0xd3d4c1,
		            0xd3d4c9, 0xd3d4d7, 0xd4c5cc, 0xd4cf20, 0xd4cfd2, 0xd4d820, 0xd9c820,
		            0xded4cf,
		        ];
		    }
		    name() {
		        return 'KOI8-R';
		    }
		    language() {
		        return 'ru';
		    }
		}
		sbcs.KOI8_R = KOI8_R;
		
		return sbcs;
	}

	var iso2022 = {};

	var hasRequiredIso2022;

	function requireIso2022 () {
		if (hasRequiredIso2022) return iso2022;
		hasRequiredIso2022 = 1;
		var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(iso2022, "__esModule", { value: true });
		iso2022.ISO_2022_CN = iso2022.ISO_2022_KR = iso2022.ISO_2022_JP = void 0;
		const match_1 = __importDefault(requireMatch());
		class ISO_2022 {
		    constructor() {
		        this.escapeSequences = [];
		    }
		    name() {
		        return 'ISO_2022';
		    }
		    match(det) {
		        let i, j;
		        let escN;
		        let hits = 0;
		        let misses = 0;
		        let shifts = 0;
		        let confidence;
		        const text = det.inputBytes;
		        const textLen = det.inputLen;
		        scanInput: for (i = 0; i < textLen; i++) {
		            if (text[i] == 0x1b) {
		                checkEscapes: for (escN = 0; escN < this.escapeSequences.length; escN++) {
		                    const seq = this.escapeSequences[escN];
		                    if (textLen - i < seq.length)
		                        continue checkEscapes;
		                    for (j = 1; j < seq.length; j++)
		                        if (seq[j] != text[i + j])
		                            continue checkEscapes;
		                    hits++;
		                    i += seq.length - 1;
		                    continue scanInput;
		                }
		                misses++;
		            }
		            if (text[i] == 0x0e || text[i] == 0x0f)
		                shifts++;
		        }
		        if (hits == 0)
		            return null;
		        confidence = (100 * hits - 100 * misses) / (hits + misses);
		        if (hits + shifts < 5)
		            confidence -= (5 - (hits + shifts)) * 10;
		        return confidence <= 0 ? null : (0, match_1.default)(det, this, confidence);
		    }
		}
		class ISO_2022_JP extends ISO_2022 {
		    constructor() {
		        super(...arguments);
		        this.escapeSequences = [
		            [0x1b, 0x24, 0x28, 0x43],
		            [0x1b, 0x24, 0x28, 0x44],
		            [0x1b, 0x24, 0x40],
		            [0x1b, 0x24, 0x41],
		            [0x1b, 0x24, 0x42],
		            [0x1b, 0x26, 0x40],
		            [0x1b, 0x28, 0x42],
		            [0x1b, 0x28, 0x48],
		            [0x1b, 0x28, 0x49],
		            [0x1b, 0x28, 0x4a],
		            [0x1b, 0x2e, 0x41],
		            [0x1b, 0x2e, 0x46],
		        ];
		    }
		    name() {
		        return 'ISO-2022-JP';
		    }
		    language() {
		        return 'ja';
		    }
		}
		iso2022.ISO_2022_JP = ISO_2022_JP;
		class ISO_2022_KR extends ISO_2022 {
		    constructor() {
		        super(...arguments);
		        this.escapeSequences = [[0x1b, 0x24, 0x29, 0x43]];
		    }
		    name() {
		        return 'ISO-2022-KR';
		    }
		    language() {
		        return 'kr';
		    }
		}
		iso2022.ISO_2022_KR = ISO_2022_KR;
		class ISO_2022_CN extends ISO_2022 {
		    constructor() {
		        super(...arguments);
		        this.escapeSequences = [
		            [0x1b, 0x24, 0x29, 0x41],
		            [0x1b, 0x24, 0x29, 0x47],
		            [0x1b, 0x24, 0x2a, 0x48],
		            [0x1b, 0x24, 0x29, 0x45],
		            [0x1b, 0x24, 0x2b, 0x49],
		            [0x1b, 0x24, 0x2b, 0x4a],
		            [0x1b, 0x24, 0x2b, 0x4b],
		            [0x1b, 0x24, 0x2b, 0x4c],
		            [0x1b, 0x24, 0x2b, 0x4d],
		            [0x1b, 0x4e],
		            [0x1b, 0x4f],
		        ];
		    }
		    name() {
		        return 'ISO-2022-CN';
		    }
		    language() {
		        return 'zh';
		    }
		}
		iso2022.ISO_2022_CN = ISO_2022_CN;
		
		return iso2022;
	}

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib;
		hasRequiredLib = 1;
		(function (exports) {
			var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
			    Object.defineProperty(o, "default", { enumerable: true, value: v });
			}) : function(o, v) {
			    o["default"] = v;
			});
			var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
			    if (mod && mod.__esModule) return mod;
			    var result = {};
			    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
			    __setModuleDefault(result, mod);
			    return result;
			};
			var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
			    return (mod && mod.__esModule) ? mod : { "default": mod };
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.detectFileSync = exports.detectFile = exports.analyse = exports.detect = void 0;
			const node_1 = __importDefault(requireBrowser());
			const utf8_1 = __importDefault(requireUtf8());
			const unicode = __importStar(requireUnicode());
			const mbcs = __importStar(requireMbcs());
			const sbcs = __importStar(requireSbcs());
			const iso2022 = __importStar(requireIso2022());
			const recognisers = [
			    new utf8_1.default(),
			    new unicode.UTF_16BE(),
			    new unicode.UTF_16LE(),
			    new unicode.UTF_32BE(),
			    new unicode.UTF_32LE(),
			    new mbcs.sjis(),
			    new mbcs.big5(),
			    new mbcs.euc_jp(),
			    new mbcs.euc_kr(),
			    new mbcs.gb_18030(),
			    new iso2022.ISO_2022_JP(),
			    new iso2022.ISO_2022_KR(),
			    new iso2022.ISO_2022_CN(),
			    new sbcs.ISO_8859_1(),
			    new sbcs.ISO_8859_2(),
			    new sbcs.ISO_8859_5(),
			    new sbcs.ISO_8859_6(),
			    new sbcs.ISO_8859_7(),
			    new sbcs.ISO_8859_8(),
			    new sbcs.ISO_8859_9(),
			    new sbcs.windows_1251(),
			    new sbcs.windows_1256(),
			    new sbcs.KOI8_R(),
			];
			const detect = (buffer) => {
			    const matches = (0, exports.analyse)(buffer);
			    return matches.length > 0 ? matches[0].name : null;
			};
			exports.detect = detect;
			const analyse = (buffer) => {
			    const byteStats = [];
			    for (let i = 0; i < 256; i++)
			        byteStats[i] = 0;
			    for (let i = buffer.length - 1; i >= 0; i--)
			        byteStats[buffer[i] & 0x00ff]++;
			    let c1Bytes = false;
			    for (let i = 0x80; i <= 0x9f; i += 1) {
			        if (byteStats[i] !== 0) {
			            c1Bytes = true;
			            break;
			        }
			    }
			    const context = {
			        byteStats,
			        c1Bytes,
			        rawInput: buffer,
			        rawLen: buffer.length,
			        inputBytes: buffer,
			        inputLen: buffer.length,
			    };
			    const matches = recognisers
			        .map((rec) => {
			        return rec.match(context);
			    })
			        .filter((match) => {
			        return !!match;
			    })
			        .sort((a, b) => {
			        return b.confidence - a.confidence;
			    });
			    return matches;
			};
			exports.analyse = analyse;
			const detectFile = (filepath, opts = {}) => new Promise((resolve, reject) => {
			    let fd;
			    const fs = (0, node_1.default)();
			    const handler = (err, buffer) => {
			        if (fd) {
			            fs.closeSync(fd);
			        }
			        if (err) {
			            reject(err);
			        }
			        else {
			            resolve((0, exports.detect)(buffer));
			        }
			    };
			    if (opts && opts.sampleSize) {
			        fd = fs.openSync(filepath, 'r');
			        const sample = Buffer.allocUnsafe(opts.sampleSize);
			        fs.read(fd, sample, 0, opts.sampleSize, opts.offset, (err) => {
			            handler(err, sample);
			        });
			        return;
			    }
			    fs.readFile(filepath, handler);
			});
			exports.detectFile = detectFile;
			const detectFileSync = (filepath, opts = {}) => {
			    const fs = (0, node_1.default)();
			    if (opts && opts.sampleSize) {
			        const fd = fs.openSync(filepath, 'r');
			        const sample = Buffer.allocUnsafe(opts.sampleSize);
			        fs.readSync(fd, sample, 0, opts.sampleSize, opts.offset);
			        fs.closeSync(fd);
			        return (0, exports.detect)(sample);
			    }
			    return (0, exports.detect)(fs.readFileSync(filepath));
			};
			exports.detectFileSync = detectFileSync;
			exports.default = {
			    analyse: exports.analyse,
			    detect: exports.detect,
			    detectFileSync: exports.detectFileSync,
			    detectFile: exports.detectFile,
			};
			
		} (lib));
		return lib;
	}

	irc$1.Client = Client$3;
	var net  = require$$0$3;
	var tls  = require$$1$3;
	var util$1 = require$$2$1;
	var EventEmitter$5 = require$$1$2;

	var colors = colors$1;
	var parseMessage = parse_message;
	irc$1.colors = colors;
	var CyclingPingTimer = cycling_ping_timer;

	var lineDelimiter = new RegExp(/\r\n|\r|\n/);

	function Client$3(server, clientNick, opt) {
	    var self = this;
	    self.opt = {
	        server: server,
	        nick: clientNick,
	        userName: 'nodebot',
	        realName: 'nodeJS IRC client',
	        password: null,
	        port: 6667,
	        localAddress: null,
	        debug: false,
	        showErrors: false,
	        channels: [],
	        autoRejoin: false,
	        autoRenick: false,
	        autoConnect: true,
	        retryCount: null,
	        retryDelay: 2000,
	        renickCount: null,
	        renickDelay: 60000,
	        secure: false,
	        selfSigned: false,
	        certExpired: false,
	        floodProtection: false,
	        floodProtectionDelay: 1000,
	        sasl: false,
	        webirc: {
	            pass: '',
	            ip: '',
	            host: ''
	        },
	        stripColors: false,
	        channelPrefixes: '&#',
	        messageSplit: 512,
	        encoding: null,
	        millisecondsOfSilenceBeforePingSent: 15 * 1000,
	        millisecondsBeforePingTimeout: 8 * 1000,
	        enableStrictParse: false
	    };

	    // Features supported by the server
	    // (Initial values are RFC 1459 defaults. Zeros signify no default or unlimited value.)
	    self.supported = {
	        channel: {
	            idlength: {},
	            length: 200,
	            limit: [],
	            modes: { a: '', b: '', c: '', d: ''},
	            types: self.opt.channelPrefixes
	        },
	        kicklength: 0,
	        maxlist: [],
	        maxtargets: {},
	        modes: 3,
	        nicklength: 9,
	        topiclength: 0,
	        usermodes: ''
	    };

	    if (typeof opt === 'object') {
	        var keys = Object.keys(self.opt);
	        keys.forEach(function(k) {
	            if (typeof opt[k] !== 'undefined') {
	                self.opt[k] = opt[k];
	            }
	        });
	    }

	    // Instead of wrapping every debug call in a guard, provide debug and error methods for the client.
	    self.out = {
	        showErrors: self.opt.showErrors,
	        showDebug: self.opt.debug
	    };
	    self.out.error = function() {
	        if (!this.showDebug && !this.showErrors) return;
	        // '\u001b[01;31mERROR: ' + errorObjs + '\u001b[0m'
	        var args = Array.prototype.slice.call(arguments);
	        args.unshift('\u001b[01;31mERROR:'); args.push('\u001b[0m');
	        util$1.log.apply(util$1, args);
	    };
	    self.out.debug = function() {
	        if (!this.showDebug) return;
	        util$1.log.apply(util$1, arguments);
	    };


	    if (self.opt.floodProtection) {
	        self.activateFloodProtection();
	    }

	    self.hostMask = '';

	    // TODO - fail if nick or server missing
	    // TODO - fail if username has a space in it
	    if (self.opt.autoConnect === true) {
	        self.connect();
	    }

	    self.addListener('raw', function(message) {
	        var channels = [],
	            channel,
	            nick,
	            from,
	            text,
	            to;

	        switch (message.command) {
	            case 'rpl_welcome':
	                // Set nick to whatever the server decided it really is
	                // (normally this is because you chose something too long and the server has shortened it)
	                self.nick = message.args[0];
	                // Note our hostmask to use it in splitting long messages
	                // We don't send our hostmask when issuing PRIVMSGs or NOTICEs, but servers on the other side will include it in messages and will truncate what we send accordingly
	                var welcomeStringWords = message.args[1].split(/\s+/);
	                self.hostMask = welcomeStringWords[welcomeStringWords.length - 1];
	                self._updateMaxLineLength();
	                self.emit('registered', message);
	                self.whois(self.nick, function(args) {
	                    self.nick = args.nick;
	                    self.hostMask = args.user + '@' + args.host;
	                    self._updateMaxLineLength();
	                });
	                break;
	            case 'rpl_myinfo':
	                self.supported.usermodes = message.args[3];
	                break;
	            case 'rpl_isupport':
	                message.args.forEach(function(arg) {
	                    var match;
	                    match = arg.match(/([A-Z]+)=(.*)/);
	                    if (match) {
	                        var param = match[1];
	                        var value = match[2];
	                        switch (param) {
	                            case 'CHANLIMIT':
	                                value.split(',').forEach(function(val) {
	                                    val = val.split(':');
	                                    self.supported.channel.limit[val[0]] = parseInt(val[1]);
	                                });
	                                break;
	                            case 'CHANMODES':
	                                value = value.split(',');
	                                var type = ['a', 'b', 'c', 'd'];
	                                for (var i = 0; i < type.length; i++) {
	                                    self.supported.channel.modes[type[i]] += value[i];
	                                }
	                                break;
	                            case 'CHANTYPES':
	                                self.supported.channel.types = value;
	                                break;
	                            case 'CHANNELLEN':
	                                self.supported.channel.length = parseInt(value);
	                                break;
	                            case 'IDCHAN':
	                                value.split(',').forEach(function(val) {
	                                    val = val.split(':');
	                                    self.supported.channel.idlength[val[0]] = parseInt(val[1]);
	                                });
	                                break;
	                            case 'KICKLEN':
	                                self.supported.kicklength = parseInt(value);
	                                break;
	                            case 'MAXLIST':
	                                value.split(',').forEach(function(val) {
	                                    val = val.split(':');
	                                    self.supported.maxlist[val[0]] = parseInt(val[1]);
	                                });
	                                break;
	                            case 'NICKLEN':
	                                self.supported.nicklength = parseInt(value);
	                                break;
	                            case 'PREFIX':
	                                match = value.match(/\((.*?)\)(.*)/);
	                                if (match) {
	                                    match[1] = match[1].split('');
	                                    match[2] = match[2].split('');
	                                    while (match[1].length) {
	                                        self.modeForPrefix[match[2][0]] = match[1][0];
	                                        self.supported.channel.modes.b += match[1][0];
	                                        self.prefixForMode[match[1].shift()] = match[2].shift();
	                                    }
	                                }
	                                break;
	                            case 'TARGMAX':
	                                value.split(',').forEach(function(val) {
	                                    val = val.split(':');
	                                    val[1] = (!val[1]) ? 0 : parseInt(val[1]);
	                                    self.supported.maxtargets[val[0]] = val[1];
	                                });
	                                break;
	                            case 'TOPICLEN':
	                                self.supported.topiclength = parseInt(value);
	                                break;
	                        }
	                    }
	                });
	                break;
	            case 'rpl_yourhost':
	            case 'rpl_created':
	            case 'rpl_luserclient':
	            case 'rpl_luserop':
	            case 'rpl_luserchannels':
	            case 'rpl_luserme':
	            case 'rpl_localusers':
	            case 'rpl_globalusers':
	            case 'rpl_statsconn':
	            case 'rpl_luserunknown':
	            case 'rpl_whoishost':
	            case '396':
	            case '042':
	                // Random welcome stuff, ignoring
	                break;
	            case 'err_nicknameinuse':
	                if (typeof self.opt.nickMod === 'undefined')
	                    self.opt.nickMod = 0;
	                if (message.args[1] === self.opt.nick && (self.conn.renickInterval || self.conn.attemptedLastRenick)) {
	                    self.out.debug('Attempted to automatically renick to', message.args[1], 'and found it taken');
	                    break;
	                }
	                self.opt.nickMod++;
	                self.send('NICK', self.opt.nick + self.opt.nickMod);
	                self.nick = self.opt.nick + self.opt.nickMod;
	                self._updateMaxLineLength();
	                if (self.opt.autoRenick) {
	                    var renickTimes = 0;
	                    self.cancelAutoRenick();
	                    self.conn.renickInterval = setInterval(function() {
	                        if (self.nick === self.opt.nick) {
	                            self.out.debug('Attempted to automatically renick to', self.nick, 'and found that was the current nick');
	                            self.cancelAutoRenick();
	                            return;
	                        }
	                        self.send('NICK', self.opt.nick);
	                        renickTimes++;
	                        if (self.opt.renickCount !== null && renickTimes >= self.opt.renickCount) {
	                            self.out.debug('Maximum autorenick retry count (' + self.opt.renickCount + ') reached');
	                            self.cancelAutoRenick();
	                            self.conn.attemptedLastRenick = true;
	                        }
	                    }, self.opt.renickDelay);
	                }
	                break;
	            case 'PING':
	                self.send('PONG', message.args[0]);
	                self.emit('ping', message.args[0]);
	                break;
	            case 'PONG':
	                self.emit('pong', message.args[0]);
	                break;
	            case 'NOTICE':
	                from = message.nick;
	                to = message.args[0];
	                if (!to) {
	                    to = null;
	                }
	                text = message.args[1] || '';
	                if (text[0] === '\u0001' && text.lastIndexOf('\u0001') > 0) {
	                    self._handleCTCP(from, to, text, 'notice', message);
	                    break;
	                }
	                self.emit('notice', from, to, text, message);

	                if (to === self.nick)
	                    self.out.debug('GOT NOTICE from ' + (from ? '"' + from + '"' : 'the server') + ': "' + text + '"');
	                break;
	            case 'MODE':
	                self.out.debug('MODE: ' + message.args[0] + ' sets mode: ' + message.args[1]);

	                channel = self.chanData(message.args[0]);
	                if (!channel) break;
	                var modeList = message.args[1].split('');
	                var adding = true;
	                var modeArgs = message.args.slice(2);
	                var chanModes = function(mode, param) {
	                    var arr = param && Array.isArray(param);
	                    if (adding) {
	                        if (channel.mode.indexOf(mode) === -1) {
	                            channel.mode += mode;
	                        }
	                        if (typeof param === 'undefined') {
	                            channel.modeParams[mode] = [];
	                        } else if (arr) {
	                            channel.modeParams[mode] = channel.modeParams[mode] ?
	                                channel.modeParams[mode].concat(param) : param;
	                        } else {
	                            channel.modeParams[mode] = [param];
	                        }
	                    } else if (mode in channel.modeParams) {
	                        if (arr) {
	                            channel.modeParams[mode] = channel.modeParams[mode]
	                                .filter(function(v) { return v !== param[0]; });
	                        }
	                        if (!arr || channel.modeParams[mode].length === 0) {
	                            channel.mode = channel.mode.replace(mode, '');
	                            delete channel.modeParams[mode];
	                        }
	                    }
	                };
	                modeList.forEach(function(mode) {
	                    if (mode === '+') {
	                        adding = true;
	                        return;
	                    }
	                    if (mode === '-') {
	                        adding = false;
	                        return;
	                    }

	                    var eventName = (adding ? '+' : '-') + 'mode';
	                    var supported = self.supported.channel.modes;
	                    var modeArg;
	                    if (mode in self.prefixForMode) {
	                        modeArg = modeArgs.shift();
	                        if (Object.prototype.hasOwnProperty.call(channel.users, modeArg)) {
	                            if (adding) {
	                                if (channel.users[modeArg].indexOf(self.prefixForMode[mode]) === -1)
	                                    channel.users[modeArg] += self.prefixForMode[mode];
	                            } else channel.users[modeArg] = channel.users[modeArg].replace(self.prefixForMode[mode], '');
	                        }
	                        self.emit(eventName, message.args[0], message.nick, mode, modeArg, message);
	                    } else if (supported.a.indexOf(mode) !== -1) {
	                        modeArg = modeArgs.shift();
	                        chanModes(mode, [modeArg]);
	                        self.emit(eventName, message.args[0], message.nick, mode, modeArg, message);
	                    } else if (supported.b.indexOf(mode) !== -1) {
	                        modeArg = modeArgs.shift();
	                        chanModes(mode, modeArg);
	                        self.emit(eventName, message.args[0], message.nick, mode, modeArg, message);
	                    } else if (supported.c.indexOf(mode) !== -1) {
	                        if (adding) modeArg = modeArgs.shift();
	                        else modeArg = undefined;
	                        chanModes(mode, modeArg);
	                        self.emit(eventName, message.args[0], message.nick, mode, modeArg, message);
	                    } else if (supported.d.indexOf(mode) !== -1) {
	                        chanModes(mode);
	                        self.emit(eventName, message.args[0], message.nick, mode, undefined, message);
	                    }
	                });
	                break;
	            case 'NICK':
	                if (message.nick === self.nick) {
	                    // client just changed own nick
	                    self.nick = message.args[0];
	                    self.cancelAutoRenick();
	                    self._updateMaxLineLength();
	                }

	                self.out.debug('NICK: ' + message.nick + ' changes nick to ' + message.args[0]);

	                channels = [];

	                // Figure out what channels the user is in, update relevant nicks
	                Object.keys(self.chans).forEach(function(channame) {
	                    var chan = self.chans[channame];
	                    if (message.nick in chan.users) {
	                        chan.users[message.args[0]] = chan.users[message.nick];
	                        delete chan.users[message.nick];
	                        channels.push(channame);
	                    }
	                });

	                // old nick, new nick, channels
	                self.emit('nick', message.nick, message.args[0], channels, message);
	                break;
	            case 'rpl_motdstart':
	                self.motd = message.args[1] + '\n';
	                break;
	            case 'rpl_motd':
	                self.motd += message.args[1] + '\n';
	                break;
	            case 'rpl_endofmotd':
	            case 'err_nomotd':
	                self.motd += message.args[1] + '\n';
	                self.emit('motd', self.motd);
	                break;
	            case 'rpl_namreply':
	                channel = self.chanData(message.args[2]);
	                var users = message.args[3].trim().split(/ +/);
	                if (channel) {
	                    users.forEach(function(user) {
	                        var match = user.match(/^(.)(.*)$/);
	                        if (match) {
	                            if (match[1] in self.modeForPrefix) {
	                                channel.users[match[2]] = match[1];
	                            }
	                            else {
	                                channel.users[match[1] + match[2]] = '';
	                            }
	                        }
	                    });
	                }
	                break;
	            case 'rpl_endofnames':
	                channel = self.chanData(message.args[1]);
	                if (channel) {
	                    self.emitChannelEvent('names', message.args[1], channel.users);
	                    self.send('MODE', message.args[1]);
	                }
	                break;
	            case 'rpl_topic':
	                channel = self.chanData(message.args[1]);
	                if (channel) {
	                    channel.topic = message.args[2];
	                }
	                break;
	            case 'rpl_away':
	                self._addWhoisData(message.args[1], 'away', message.args[2], true);
	                break;
	            case 'rpl_whoisuser':
	                self._addWhoisData(message.args[1], 'user', message.args[2]);
	                self._addWhoisData(message.args[1], 'host', message.args[3]);
	                self._addWhoisData(message.args[1], 'realname', message.args[5]);
	                break;
	            case 'rpl_whoisidle':
	                self._addWhoisData(message.args[1], 'idle', message.args[2]);
	                break;
	            case 'rpl_whoischannels':
	                // TODO - clean this up?
	                self._addWhoisData(message.args[1], 'channels', message.args[2].trim().split(/\s+/));
	                break;
	            case 'rpl_whoisserver':
	                self._addWhoisData(message.args[1], 'server', message.args[2]);
	                self._addWhoisData(message.args[1], 'serverinfo', message.args[3]);
	                break;
	            case 'rpl_whoisoperator':
	                self._addWhoisData(message.args[1], 'operator', message.args[2]);
	                break;
	            case '330': // rpl_whoisaccount?
	                self._addWhoisData(message.args[1], 'account', message.args[2]);
	                self._addWhoisData(message.args[1], 'accountinfo', message.args[3]);
	                break;
	            case 'rpl_endofwhois':
	                self.emit('whois', self._clearWhoisData(message.args[1]));
	                break;
	            case 'rpl_whoreply':
	                self._addWhoisData(message.args[5], 'user', message.args[2]);
	                self._addWhoisData(message.args[5], 'host', message.args[3]);
	                self._addWhoisData(message.args[5], 'server', message.args[4]);
	                self._addWhoisData(message.args[5], 'realname', /[0-9]+\s*(.+)/g.exec(message.args[7])[1]);
	                // emit right away because rpl_endofwho doesn't contain nick
	                self.emit('whois', self._clearWhoisData(message.args[5]));
	                break;
	            case 'rpl_liststart':
	                self.channellist = [];
	                self.emit('channellist_start');
	                break;
	            case 'rpl_list':
	                channel = {
	                    name: message.args[1],
	                    users: message.args[2],
	                    topic: message.args[3]
	                };
	                self.emit('channellist_item', channel);
	                self.channellist.push(channel);
	                break;
	            case 'rpl_listend':
	                self.emit('channellist', self.channellist);
	                break;
	            case 'rpl_topicwhotime':
	                channel = self.chanData(message.args[1]);
	                if (channel) {
	                    channel.topicBy = message.args[2];
	                    // channel, topic, nick
	                    self.emit('topic', message.args[1], channel.topic, channel.topicBy, message);
	                }
	                break;
	            case 'TOPIC':
	                // channel, topic, nick
	                self.emit('topic', message.args[0], message.args[1], message.nick, message);

	                channel = self.chanData(message.args[0]);
	                if (channel) {
	                    channel.topic = message.args[1];
	                    channel.topicBy = message.nick;
	                }
	                break;
	            case 'rpl_channelmodeis':
	                channel = self.chanData(message.args[1]);
	                if (channel) {
	                    channel.mode = message.args[2];
	                }
	                break;
	            case 'rpl_creationtime':
	                channel = self.chanData(message.args[1]);
	                if (channel) {
	                    channel.created = message.args[2];
	                }
	                break;
	            case 'JOIN':
	                // channel, who
	                if (self.nick === message.nick) {
	                    self.chanData(message.args[0], true);
	                } else {
	                    channel = self.chanData(message.args[0]);
	                    if (channel && channel.users) {
	                        channel.users[message.nick] = '';
	                    }
	                }
	                self.emitChannelEvent('join', message.args[0], message.nick, message);
	                break;
	            case 'PART':
	                // channel, who, reason
	                self.emitChannelEvent('part', message.args[0], message.nick, message.args[1], message);
	                if (self.nick === message.nick) {
	                    channel = self.chanData(message.args[0]);
	                    delete self.chans[channel.key];
	                } else {
	                    channel = self.chanData(message.args[0]);
	                    if (channel && channel.users) {
	                        delete channel.users[message.nick];
	                    }
	                }
	                break;
	            case 'KICK':
	                // channel, who, by, reason
	                self.emitChannelEvent('kick', message.args[0], message.args[1], message.nick, message.args[2], message);

	                if (self.nick === message.args[1]) {
	                    channel = self.chanData(message.args[0]);
	                    delete self.chans[channel.key];
	                } else {
	                    channel = self.chanData(message.args[0]);
	                    if (channel && channel.users) {
	                        delete channel.users[message.args[1]];
	                    }
	                }
	                break;
	            case 'KILL':
	                nick = message.args[0];
	                channels = [];
	                Object.keys(self.chans).forEach(function(channame) {
	                    var chan = self.chans[channame];
	                    if (nick in chan.users) {
	                        channels.push(channame);
	                        delete chan.users[nick];
	                    }
	                });
	                self.emit('kill', nick, message.args[1], channels, message);
	                break;
	            case 'PRIVMSG':
	                from = message.nick;
	                to = message.args[0];
	                text = message.args[1] || '';
	                if (text[0] === '\u0001' && text.lastIndexOf('\u0001') > 0) {
	                    self._handleCTCP(from, to, text, 'privmsg', message);
	                    break;
	                }
	                self.emit('message', from, to, text, message);
	                if (self.supported.channel.types.indexOf(to.charAt(0)) !== -1) {
	                    self.emit('message#', from, to, text, message);
	                    self.emit('message' + to, from, text, message);
	                    if (to !== to.toLowerCase()) {
	                        self.emit('message' + to.toLowerCase(), from, text, message);
	                    }
	                }
	                if (to.toUpperCase() === self.nick.toUpperCase()) {
	                    self.emit('pm', from, text, message);
	                    self.out.debug('GOT MESSAGE from "' + from + '": "' + text + '"');
	                }
	                break;
	            case 'INVITE':
	                from = message.nick;
	                to = message.args[0];
	                channel = message.args[1];
	                self.emit('invite', channel, from, message);
	                break;
	            case 'QUIT':
	                self.out.debug('QUIT: ' + message.prefix + ' ' + message.args.join(' '));
	                if (self.nick === message.nick) {
	                    // TODO handle?
	                    break;
	                }

	                // handle other people quitting
	                channels = [];

	                // Figure out what channels the user was in
	                Object.keys(self.chans).forEach(function(channame) {
	                    var chan = self.chans[channame];
	                    if (message.nick in chan.users) {
	                        delete chan.users[message.nick];
	                        channels.push(channame);
	                    }
	                });

	                // who, reason, channels
	                self.emit('quit', message.nick, message.args[0], channels, message);
	                break;

	            // for sasl
	            case 'CAP':
	                // client identifier name, cap subcommand, params
	                if (message.args[1] === 'NAK') {
	                    // capabilities not handled, error
	                    self.out.error(message);
	                    self.emit('error', message);
	                    break;
	                }

	                // currently only handle ACK sasl responses
	                if (message.args[1] !== 'ACK') break;
	                var caps = message.args[2].split(/\s+/);
	                if (caps.indexOf('sasl') < 0) break;

	                self.send('AUTHENTICATE', 'PLAIN');
	                break;
	            case 'AUTHENTICATE':
	                if (message.args[0] !== '+') break;
	                // AUTHENTICATE response (params) must be split into 400-byte chunks
	                var authMessage = Buffer.from(
	                    self.opt.nick + '\0' +
	                    self.opt.userName + '\0' +
	                    self.opt.password
	                ).toString('base64');
	                // must output a "+" after a 400-byte string to make clear it's finished
	                for (var i=0; i < (authMessage.length+1) / 400; i++) {
	                  var chunk = authMessage.slice(i * 400, (i+1) * 400);
	                  if (chunk === '') chunk = '+';
	                  self.send('AUTHENTICATE', chunk);
	                }
	                break;
	            case 'rpl_loggedin':
	                break;
	            case 'rpl_saslsuccess':
	                self.send('CAP', 'END');
	                break;

	            case 'err_umodeunknownflag':
	                self.out.error(message);
	                self.emit('error', message);
	                break;

	            case 'err_erroneusnickname':
	                self.out.error(message);
	                self.emit('error', message);
	                break;

	            // Commands relating to OPER
	            case 'err_nooperhost':
	                self.out.error(message);
	                self.emit('error', message);
	                break;
	            case 'rpl_youreoper':
	                self.emit('opered');
	                break;

	            default:
	                if (message.commandType === 'error') {
	                    self.out.error(message);
	                    self.emit('error', message);
	                } else {
	                    self.out.error('Unhandled message:', message);
	                    self.emit('unhandled', message);
	                    break;
	                }
	        }
	    });

	    self.addListener('kick', function(channel, nick) {
	        if (self.opt.autoRejoin && nick.toLowerCase() === self.nick.toLowerCase())
	            self.join(channel);
	    });
	    self.addListener('motd', function() {
	        self.opt.channels.forEach(function(channel) {
	            self.join(channel);
	        });
	    });

	    EventEmitter$5.call(this);
	}
	util$1.inherits(Client$3, EventEmitter$5);

	Client$3.prototype.conn = null;
	Client$3.prototype.prefixForMode = {};
	Client$3.prototype.modeForPrefix = {};
	Client$3.prototype.chans = {};
	Client$3.prototype._whoisData = {};

	Client$3.prototype.connectionTimedOut = function(conn) {
	    var self = this;
	    if (conn !== self.conn) {
	        // Only care about a timeout event if it came from the current connection
	        return;
	    }
	    self.end();
	};

	(function() {
	    var pingCounter = 1;
	    Client$3.prototype.connectionWantsPing = function(conn) {
	        var self = this;
	        if (conn !== self.conn) {
	            // Only care about a wantPing event if it came from the current connection
	            return;
	        }
	        self.send('PING', (pingCounter++).toString());
	    };
	}());

	Client$3.prototype.chanData = function(name, create) {
	    var key = name.toLowerCase();
	    if (create) {
	        this.chans[key] = this.chans[key] || {
	            key: key,
	            serverName: name,
	            users: {},
	            modeParams: {},
	            mode: ''
	        };
	    }

	    return this.chans[key];
	};

	Client$3.prototype._connectionHandler = function() {
	    this.out.debug('Socket connection successful');

	    // WEBIRC
	    if (this.opt.webirc.ip && this.opt.webirc.pass && this.opt.webirc.host) {
	        this.send('WEBIRC', this.opt.webirc.pass, this.opt.userName, this.opt.webirc.host, this.opt.webirc.ip);
	    }

	    // SASL, server password
	    if (this.opt.sasl) {
	        // see http://ircv3.net/specs/extensions/sasl-3.1.html
	        this.send('CAP', 'REQ', 'sasl');
	    } else if (this.opt.password) {
	        this.send('PASS', this.opt.password);
	    }

	    // handshake details
	    this.out.debug('Sending irc NICK/USER');
	    this.send('NICK', this.opt.nick);
	    this.nick = this.opt.nick;
	    this._updateMaxLineLength();
	    this.send('USER', this.opt.userName, 8, '*', this.opt.realName);

	    // watch for ping timeout
	    this.conn.cyclingPingTimer.start();

	    this.emit('connect');
	};

	Client$3.prototype.connect = function(retryCount, callback) {
	    if (typeof (retryCount) === 'function') {
	        callback = retryCount;
	        retryCount = undefined;
	    }
	    retryCount = retryCount || 0;

	    if (typeof (callback) === 'function') {
	        this.once('registered', callback);
	    }

	    // skip connect if already connected
	    if (this.conn && !this.conn.requestedDisconnect) {
	        this.out.error('Connection already active, not reconnecting – please disconnect first');
	        return;
	    }

	    var self = this;
	    self.chans = {};

	    // socket opts
	    var connectionOpts = {
	        host: self.opt.server,
	        port: self.opt.port
	    };

	    // local address to bind to
	    if (self.opt.localAddress)
	        connectionOpts.localAddress = self.opt.localAddress;

	    self.out.debug('Attempting socket connection to IRC server');
	    // try to connect to the server
	    if (self.opt.secure) {
	        connectionOpts.rejectUnauthorized = !self.opt.selfSigned;

	        if (typeof self.opt.secure === 'object') {
	            // copy "secure" opts to options passed to connect()
	            for (var f in self.opt.secure) {
	                connectionOpts[f] = self.opt.secure[f];
	            }
	        }

	        self.conn = tls.connect(connectionOpts, function() {
	            // callback called only after successful socket connection
	            self.conn.connected = true;
	            if (self.conn.authorized ||
	                (self.opt.selfSigned &&
	                    (self.conn.authorizationError   === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
	                     self.conn.authorizationError === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
	                     self.conn.authorizationError === 'SELF_SIGNED_CERT_IN_CHAIN')) ||
	                (self.opt.certExpired &&
	                 self.conn.authorizationError === 'CERT_HAS_EXPIRED')) {
	                // authorization successful

	                if (!self.opt.encoding) {
	                    self.conn.setEncoding('utf-8');
	                }

	                if (self.opt.certExpired &&
	                    self.conn.authorizationError === 'CERT_HAS_EXPIRED') {
	                    util$1.log('Connecting to server with expired certificate');
	                }

	                self._connectionHandler();
	            } else {
	                // authorization failed
	                util$1.log(self.conn.authorizationError);
	            }
	        });
	    } else {
	        self.conn = net.createConnection(connectionOpts, self._connectionHandler.bind(self));
	    }
	    self.conn.requestedDisconnect = false;
	    self.conn.setTimeout(0);

	    // Each connection gets its own CyclingPingTimer.
	    // The connection forwards the timer's 'timeout' and 'wantPing' events to the client object via calling the connectionTimedOut() and connectionWantsPing() functions.
	    // Since the client's "current connection" value changes over time because of retry functionality,
	    // the client should ignore timeout/wantPing events that come from old connections.
	    self.conn.cyclingPingTimer = new CyclingPingTimer(self);
	    (function(conn) {
	        conn.cyclingPingTimer.on('pingTimeout', function() {
	            self.connectionTimedOut(conn);
	        });
	        conn.cyclingPingTimer.on('wantPing', function() {
	            self.connectionWantsPing(conn);
	        });
	    }(self.conn));

	    if (!self.opt.encoding) {
	        self.conn.setEncoding('utf8');
	    }

	    var buffer = Buffer.from('');

	    function handleData(chunk) {
	        self.conn.cyclingPingTimer.notifyOfActivity();

	        if (typeof (chunk) === 'string') {
	            buffer += chunk;
	        } else {
	            buffer = Buffer.concat([buffer, chunk]);
	        }

	        var lines = self.convertEncoding(buffer).toString().split(lineDelimiter);

	        if (lines.pop()) {
	            // if buffer doesn't end \r\n, there are more chunks.
	            return;
	        }
	        // else, re-initialize the buffer.
	        buffer = Buffer.from('');

	        lines.forEach(function(line) {
	            if (line.length) {
	                self.out.debug('Received:', line);
	                var message = parseMessage(line, self.opt.stripColors);

	                try {
	                    self.emit('raw', message);
	                } catch (err) {
	                    if (!self.conn.requestedDisconnect) {
	                        self.emit('error', err);
	                    }
	                }
	            }
	        });
	    }

	    self.conn.addListener('data', handleData);
	    self.conn.addListener('end', function() {
	        self.out.debug('Connection got "end" event');
	    });
	    self.conn.addListener('close', function() {
	        self.out.debug('Connection got "close" event');

	        // don't reconnect if this is an old connection closing
	        if (self.conn !== this) {
	            self.out.debug('Non-latest connection is being discarded');
	            return;
	        }

	        // skip if this connection is supposed to close
	        if (self.conn && self.conn.requestedDisconnect)
	            return;

	        self.out.debug('Disconnected: reconnecting');
	        self.conn.cyclingPingTimer.stop();
	        self.cancelAutoRenick();
	        self.conn = null;

	        // limit to retryCount reconnections
	        if (self.opt.retryCount !== null && retryCount >= self.opt.retryCount) {
	            self.out.debug('Maximum retry count (' + self.opt.retryCount + ') reached. Aborting');
	            self.emit('abort', self.opt.retryCount);
	            return;
	        }

	        // actually reconnect
	        self.out.debug('Waiting ' + self.opt.retryDelay + 'ms before retrying');
	        self.retryTimeout = setTimeout(function() {
	            self.connect(retryCount + 1);
	        }, self.opt.retryDelay);
	    });

	    self.conn.addListener('error', function(exception) {
	        self.emit('netError', exception);
	        self.out.debug('Network error: ' + exception);
	    });
	};

	Client$3.prototype.end = function() {
	    if (this.conn) {
	        this.conn.cyclingPingTimer.stop();
	        this.cancelAutoRenick();
	        this.conn.destroy();
	    }
	};

	Client$3.prototype.disconnect = function(message, callback) {
	    if (typeof (message) === 'function') {
	        callback = message;
	        message = undefined;
	    }
	    message = message || 'node-irc says goodbye';
	    var self = this;

	    self.out.debug('Disconnecting from IRC server');

	    // Skip if already disconnected
	    if (!self.conn || self.conn.destroyed) {
	        if (self.retryTimeout) {
	            clearTimeout(self.retryTimeout);
	            self.retryTimeout = null;
	            self.out.error('Connection already broken, skipping disconnect (and clearing up automatic retry)');
	        } else {
	            self.out.error('Connection already broken, skipping disconnect');
	        }
	        return;
	    }

	    if (self.conn.requestedDisconnect) {
	        self.out.error('Connection already disconnecting, skipping disconnect');
	        return;
	    }

	    // send quit message
	    if (self.conn.readyState === 'open') {
	        var sendFunction;
	        if (self.floodProtectionEnabled) {
	            sendFunction = self._sendImmediate;
	            self._clearCmdQueue();
	        } else {
	            sendFunction = self.send;
	        }
	        sendFunction.call(self, 'QUIT', message);
	    }

	    // flag connection as disconnecting
	    self.conn.requestedDisconnect = true;

	    // disconnect
	    if (typeof (callback) === 'function') {
	        self.conn.once('end', callback);
	    }
	    self.conn.end();
	    self.conn.cyclingPingTimer.stop();
	    self.cancelAutoRenick();
	};

	Client$3.prototype.send = function() {
	    var args = Array.prototype.slice.call(arguments);
	    // e.g. NICK, nickname

	    // if the last arg contains a space, starts with a colon, or is empty, prepend a colon
	    if (args[args.length - 1].match(/\s/) || args[args.length - 1].match(/^:/) || args[args.length - 1] === '') {
	        args[args.length - 1] = ':' + args[args.length - 1];
	    }

	    if (this.conn && !this.conn.requestedDisconnect) {
	        this.out.debug('SEND:', args.join(' '));
	        this.conn.write(args.join(' ') + '\r\n');
	    } else {
	        this.out.debug('(Disconnected) SEND:', args.join(' '));
	    }
	};

	Client$3.prototype.activateFloodProtection = function(interval) {
	    var safeInterval = interval || this.opt.floodProtectionDelay,
	        self = this;

	    self.floodProtectionEnabled = true;
	    self.cmdQueue = [];
	    self._origSend = self.send;

	    // Wrapper for the original send function. Queue the messages.
	    self.send = function() {
	        self.cmdQueue.push(arguments);
	    };

	    self._sendImmediate = function() {
	        self._origSend.apply(self, arguments);
	    };

	    self._clearCmdQueue = function() {
	        self.cmdQueue = [];
	    };

	    self.dequeue = function() {
	        var args = self.cmdQueue.shift();
	        if (args) {
	            self._origSend.apply(self, args);
	        }
	    };

	    // Slowly unpack the queue without flooding.
	    self.floodProtectionInterval = setInterval(self.dequeue, safeInterval);
	    self.dequeue();
	};

	Client$3.prototype.deactivateFloodProtection = function() {
	    if (!this.floodProtectionEnabled) return;

	    clearInterval(this.floodProtectionInterval);
	    this.floodProtectionInterval = null;

	    var count = this.cmdQueue.length;
	    for (var i=0; i < count; i++) {
	      this.dequeue();
	    }

	    this.send = this._origSend;
	    this._origSend = null;
	    this._sendImmediate = null;
	    this._clearCmdQueue = null;
	    this.dequeue = null;

	    this.floodProtectionEnabled = false;
	};

	Client$3.prototype.cancelAutoRenick = function() {
	    if (!this.conn) return;
	    var oldInterval = this.conn.renickInterval;
	    clearInterval(this.conn.renickInterval);
	    this.conn.renickInterval = null;
	    return oldInterval;
	};

	Client$3.prototype.join = function(channelList, callback) {
	    var self = this;
	    var parts = channelList.split(' ');
	    var channels = parts[0];
	    var keys;
	    if (parts[1]) keys = parts[1].split(',');
	    channels = channels.split(',');
	    channels.forEach(function(channelName, index) {
	        self.once('join' + channelName.toLowerCase(), function() {
	            // Append to opts.channel on successful join, so it rejoins on reconnect.
	            var chanString = channelName;
	            if (keys && keys[index]) chanString += ' ' + keys[index];
	            var channelIndex = self._findChannelFromStrings(channelName);
	            if (channelIndex === -1) {
	                self.opt.channels.push(chanString);
	            }

	            if (typeof callback === 'function') {
	                return callback.apply(this, arguments);
	            }
	        });
	    });
	    self.send.apply(this, ['JOIN'].concat(channelList.split(' ')));
	};

	Client$3.prototype.part = function(channelList, message, callback) {
	    if (typeof (message) === 'function') {
	        callback = message;
	        message = undefined;
	    }
	    var self = this;
	    var channels = channelList.split(',');
	    channels.forEach(function(channelName) {
	      if (typeof callback === 'function') {
	          self.once('part' + channelName.toLowerCase(), callback);
	      }

	      // remove this channel from this.opt.channels so we won't rejoin upon reconnect
	      var channelIndex = self._findChannelFromStrings(channelName);
	      if (channelIndex !== -1) {
	          self.opt.channels.splice(channelIndex, 1);
	      }
	    });

	    if (message) {
	        this.send('PART', channelList, message);
	    } else {
	        this.send('PART', channelList);
	    }
	};

	Client$3.prototype.action = function(target, text) {
	    var self = this;
	    var maxLength = Math.min(this.maxLineLength - target.length, this.opt.messageSplit) - '\u0001ACTION \u0001'.length;
	    if (typeof text !== 'undefined') {
	        text.toString().split(/\r?\n/).filter(function(line) {
	            return line.length > 0;
	        }).forEach(function(line) {
	            var linesToSend = self._splitLongLines(line, maxLength, []);
	            linesToSend.forEach(function(split) {
	                var toSend = '\u0001ACTION ' + split + '\u0001';
	                self.send('PRIVMSG', target, toSend);
	                self.emit('selfMessage', target, toSend);
	            });
	        });
	    }
	};

	// finds the string in opt.channels representing channelName (if present)
	Client$3.prototype._findChannelFromStrings = function(channelName) {
	    channelName = channelName.toLowerCase();
	    var index = this.opt.channels.findIndex(function(listString) {
	      var name = listString.split(' ')[0]; // ignore the key in the string
	      name = name.toLowerCase(); // check case-insensitively
	      return channelName === name;
	    });
	    return index;
	};

	Client$3.prototype._splitLongLines = function(words, maxLength, destination) {
	    maxLength = maxLength || 450; // If maxLength hasn't been initialized yet, prefer an arbitrarily low line length over crashing.
	    // If no words left, return the accumulated array of splits
	    if (words.length === 0) {
	        return destination;
	    }
	    // If the remaining words fit under the byte limit (by utf-8, for Unicode support), push to the accumulator and return
	    if (Buffer.byteLength(words, 'utf8') <= maxLength) {
	        destination.push(words);
	        return destination;
	    }

	    // else, attempt to write maxLength bytes of message, truncate accordingly
	    var truncatingBuffer = Buffer.alloc(maxLength + 1);
	    var writtenLength = truncatingBuffer.write(words, 'utf8');
	    var truncatedStr = truncatingBuffer.toString('utf8', 0, writtenLength);
	    // and then check for a word boundary to try to keep words together
	    var len = truncatedStr.length - 1;
	    var c = truncatedStr[len];
	    var cutPos;
	    var wsLength = 1;
	    if (c.match(/\s/)) {
	        cutPos = len;
	    } else {
	        var offset = 1;
	        while ((len - offset) > 0) {
	            c = truncatedStr[len - offset];
	            if (c.match(/\s/)) {
	                cutPos = len - offset;
	                break;
	            }
	            offset++;
	        }
	        if (len - offset <= 0) {
	            cutPos = len;
	            wsLength = 0;
	        }
	    }
	    // and push the found region to the accumulator, remove from words, split rest of message
	    var part = truncatedStr.substring(0, cutPos);
	    destination.push(part);
	    return this._splitLongLines(words.substring(cutPos + wsLength, words.length), maxLength, destination);
	};

	Client$3.prototype.say = function(target, text) {
	    this._speak('PRIVMSG', target, text);
	};

	Client$3.prototype.notice = function(target, text) {
	    this._speak('NOTICE', target, text);
	};

	Client$3.prototype.emitChannelEvent = function(eventName, channel) {
	    var args = Array.prototype.slice.call(arguments, 2);
	    this.emit.apply(this, [eventName, channel].concat(args));
	    this.emit.apply(this, [eventName + channel].concat(args));
	    if (channel !== channel.toLowerCase()) {
	      this.emit.apply(this, [eventName + channel.toLowerCase()].concat(args));
	    }
	};

	Client$3.prototype._speak = function(kind, target, text) {
	    var self = this;
	    var maxLength = Math.min(this.maxLineLength - target.length, this.opt.messageSplit);
	    if (typeof text !== 'undefined') {
	        text.toString().split(/\r?\n/).filter(function(line) {
	            return line.length > 0;
	        }).forEach(function(line) {
	            var linesToSend = self._splitLongLines(line, maxLength, []);
	            linesToSend.forEach(function(toSend) {
	                self.send(kind, target, toSend);
	                if (kind === 'PRIVMSG') {
	                    self.emit('selfMessage', target, toSend);
	                }
	            });
	        });
	    }
	};

	Client$3.prototype.whois = function(nick, callback) {
	    if (typeof callback === 'function') {
	        var callbackWrapper = function(info) {
	            if (info.nick.toLowerCase() === nick.toLowerCase()) {
	                this.removeListener('whois', callbackWrapper);
	                return callback.apply(this, arguments);
	            }
	        };
	        this.addListener('whois', callbackWrapper);
	    }
	    this.send('WHOIS', nick);
	};

	Client$3.prototype.list = function() {
	    var args = Array.prototype.slice.call(arguments, 0);
	    args.unshift('LIST');
	    this.send.apply(this, args);
	};

	Client$3.prototype._addWhoisData = function(nick, key, value, onlyIfExists) {
	    if (onlyIfExists && !this._whoisData[nick]) return;
	    this._whoisData[nick] = this._whoisData[nick] || {nick: nick};
	    this._whoisData[nick][key] = value;
	};

	Client$3.prototype._clearWhoisData = function(nick) {
	    // Ensure that at least the nick exists before trying to return
	    this._addWhoisData(nick, 'nick', nick);
	    var data = this._whoisData[nick];
	    delete this._whoisData[nick];
	    return data;
	};

	Client$3.prototype._handleCTCP = function(from, to, text, type, message) {
	    text = text.slice(1);
	    text = text.slice(0, text.indexOf('\u0001'));
	    var parts = text.split(' ');
	    this.emit('ctcp', from, to, text, type, message);
	    this.emit('ctcp-' + type, from, to, text, message);
	    if (type === 'privmsg' && text === 'VERSION')
	        this.emit('ctcp-version', from, to, message);
	    if (parts[0] === 'ACTION' && parts.length > 1)
	        this.emit('action', from, to, parts.slice(1).join(' '), message);
	    if (parts[0] === 'PING' && type === 'privmsg' && parts.length > 1)
	        this.ctcp(from, 'notice', text);
	};

	Client$3.prototype.ctcp = function(to, type, text) {
	    return this[type === 'privmsg' ? 'say' : 'notice'](to, '\u0001' + text + '\u0001');
	};

	function convertEncodingHelper(str, encoding, errorHandler) {
	    var out = str;
	    var charset;
	    try {
	        var iconv = requireLib$1();
	        var charsetDetector = requireLib();

	        charset = charsetDetector.detect(str);
	        var decoded = iconv.decode(str, charset);
	        out = Buffer.from(iconv.encode(decoded, encoding));
	    } catch (err) {
	        if (!errorHandler) throw err;
	        errorHandler(err, charset);
	    }
	    return out;
	}

	Client$3.prototype.convertEncoding = function(str) {
	    var self = this, out = str;

	    if (self.opt.encoding) {
	        out = convertEncodingHelper(str, self.opt.encoding, function(err, charset) {
	            if (self.out) self.out.error(err, { str: str, charset: charset });
	        });
	    }

	    return out;
	};

	function canConvertEncoding() {
	    // hardcoded "schön" in ISO-8859-1 and UTF-8
	    var sampleText = Buffer.from([0x73, 0x63, 0x68, 0xf6, 0x6e]);
	    var expectedText = Buffer.from([0x73, 0x63, 0x68, 0xc3, 0xb6, 0x6e]);
	    var error;
	    var text = convertEncodingHelper(sampleText, 'utf-8', function(e) { error = e; });
	    if (error || text.toString() !== expectedText.toString()) {
	        return false;
	    }
	    return true;
	}
	irc$1.canConvertEncoding = canConvertEncoding;
	Client$3.prototype.canConvertEncoding = canConvertEncoding;

	// blatantly stolen from irssi's splitlong.pl. Thanks, Bjoern Krombholz!
	Client$3.prototype._updateMaxLineLength = function() {
	    // 497 = 510 - (":" + "!" + " PRIVMSG " + " :").length;
	    // target is determined in _speak() and subtracted there
	    this.maxLineLength = 497 - this.nick.length - this.hostMask.length;
	};

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

	const timeout$5 = 20000;

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data                 - Data used in the request
	 * @param {string} data.nick            - The nick of the targeted account
	 * @param {string} data.domain          - The domain on which the targeted account is registered
	 * @param {number} [data.fetcherTimeout] - Optional timeout for the fetcher
	 * @param {object} opts                 - Options used to enable the request
	 * @param {object} opts.claims
	 * @param {object} opts.claims.irc
	 * @param {string} opts.claims.irc.nick - The nick to be used by the library to log in
	 * @returns {Promise<object>}
	 */
	async function fn$3 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$5
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    try {
	      isAscii(opts.claims.irc.nick);
	    } catch (err) {
	      throw new Error(`IRC fetcher was not set up properly (${err.message})`)
	    }

	    try {
	      const client = new irc$1.Client(data.domain, opts.claims.irc.nick, {
	        port: 6697,
	        secure: true,
	        channels: [],
	        showErrors: false,
	        debug: false
	      });
	      const reKey = /[a-zA-Z0-9\-_]+\s+:\s(openpgp4fpr:.*)/;
	      const reEnd = /End\sof\s.*\staxonomy./;
	      const keys = [];

	      // @ts-ignore
	      client.addListener('registered', (message) => {
	        client.send(`PRIVMSG NickServ TAXONOMY ${data.nick}`);
	      });
	      // @ts-ignore
	      client.addListener('notice', (nick, to, text, message) => {
	        if (reKey.test(text)) {
	          const match = text.match(reKey);
	          keys.push(match[1]);
	        }
	        if (reEnd.test(text)) {
	          client.disconnect();
	          resolve(keys);
	        }
	      });
	    } catch (error) {
	      reject(error);
	    }
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var irc = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn$3,
		timeout: timeout$5
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

	const timeout$4 = 5000;

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
	async function fn$2 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$4
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
		fn: fn$2,
		timeout: timeout$4
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

	const timeout$3 = 5000;

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
	async function fn$1 (data, opts) {
	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout$3
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
		fn: fn$1,
		timeout: timeout$3
	});

	var clientCore = {};

	var events$1 = {};

	var TimeoutError_1 = class TimeoutError extends Error {
	  constructor(message) {
	    super(message);
	    this.name = "TimeoutError";
	  }
	};

	var delay$2 = function delay(ms) {
	  let timeout;
	  const promise = new Promise((resolve) => {
	    timeout = setTimeout(resolve, ms);
	  });
	  promise.timeout = timeout;
	  return promise;
	};

	const TimeoutError$2 = TimeoutError_1;
	const delay$1 = delay$2;

	var timeout$2 = function timeout(promise, ms) {
	  const promiseDelay = delay$1(ms);

	  function cancelDelay() {
	    clearTimeout(promiseDelay.timeout);
	  }

	  return Promise.race([
	    promise.finally(cancelDelay),
	    promiseDelay.then(() => {
	      throw new TimeoutError$2();
	    }),
	  ]);
	};

	const TimeoutError$1 = TimeoutError_1;

	var promise$3 = function promise(EE, event, rejectEvent = "error", timeout) {
	  return new Promise((resolve, reject) => {
	    let timeoutId;

	    const cleanup = () => {
	      clearTimeout(timeoutId);
	      EE.removeListener(event, onEvent);
	      EE.removeListener(rejectEvent, onError);
	    };

	    function onError(reason) {
	      reject(reason);
	      cleanup();
	    }

	    function onEvent(value) {
	      resolve(value);
	      cleanup();
	    }

	    EE.once(event, onEvent);
	    if (rejectEvent) {
	      EE.once(rejectEvent, onError);
	    }

	    if (timeout) {
	      timeoutId = setTimeout(() => {
	        cleanup();
	        reject(new TimeoutError$1());
	      }, timeout);
	    }
	  });
	};

	var Deferred$2 = function Deferred() {
	  this.promise = new Promise((resolve, reject) => {
	    this.resolve = resolve;
	    this.reject = reject;
	  });
	};

	const timeout$1 = timeout$2;
	const delay = delay$2;
	const TimeoutError = TimeoutError_1;
	const promise$2 = promise$3;
	const EventEmitter$4 = require$$1$2;
	const Deferred$1 = Deferred$2;

	events$1.EventEmitter = EventEmitter$4;
	events$1.timeout = timeout$1;
	events$1.delay = delay;
	events$1.TimeoutError = TimeoutError;
	events$1.promise = promise$2;
	events$1.Deferred = Deferred$1;

	var jid$4 = {exports: {}};

	var escaping$2 = {};

	escaping$2.detect = function detect(local) {
	  if (!local) {
	    return false;
	  }

	  // Remove all escaped sequences
	  const tmp = local
	    .replace(/\\20/g, "")
	    .replace(/\\22/g, "")
	    .replace(/\\26/g, "")
	    .replace(/\\27/g, "")
	    .replace(/\\2f/g, "")
	    .replace(/\\3a/g, "")
	    .replace(/\\3c/g, "")
	    .replace(/\\3e/g, "")
	    .replace(/\\40/g, "")
	    .replace(/\\5c/g, "");

	  // Detect if we have unescaped sequences
	  const search = tmp.search(/[ "&'/:<>@\\]/g);
	  if (search === -1) {
	    return false;
	  }

	  return true;
	};

	/**
	 * Escape the local part of a JID.
	 *
	 * @see http://xmpp.org/extensions/xep-0106.html
	 * @param String local local part of a jid
	 * @return An escaped local part
	 */
	escaping$2.escape = function escape(local) {
	  if (local === null) {
	    return null;
	  }

	  return local
	    .replace(/^\s+|\s+$/g, "")
	    .replace(/\\/g, "\\5c")
	    .replace(/ /g, "\\20")
	    .replace(/"/g, "\\22")
	    .replace(/&/g, "\\26")
	    .replace(/'/g, "\\27")
	    .replace(/\//g, "\\2f")
	    .replace(/:/g, "\\3a")
	    .replace(/</g, "\\3c")
	    .replace(/>/g, "\\3e")
	    .replace(/@/g, "\\40");
	};

	/**
	 * Unescape a local part of a JID.
	 *
	 * @see http://xmpp.org/extensions/xep-0106.html
	 * @param String local local part of a jid
	 * @return unescaped local part
	 */
	escaping$2.unescape = function unescape(local) {
	  if (local === null) {
	    return null;
	  }

	  return local
	    .replace(/\\20/g, " ")
	    .replace(/\\22/g, '"')
	    .replace(/\\26/g, "&")
	    .replace(/\\27/g, "'")
	    .replace(/\\2f/g, "/")
	    .replace(/\\3a/g, ":")
	    .replace(/\\3c/g, "<")
	    .replace(/\\3e/g, ">")
	    .replace(/\\40/g, "@")
	    .replace(/\\5c/g, "\\");
	};

	const escaping$1 = escaping$2;

	/**
	 * JID implements
	 * - XMPP addresses according to RFC6122
	 * - XEP-0106: JID Escaping
	 *
	 * @see http://tools.ietf.org/html/rfc6122#section-2
	 * @see http://xmpp.org/extensions/xep-0106.html
	 */
	let JID$4 = class JID {
	  constructor(local, domain, resource) {
	    if (typeof domain !== "string" || !domain) {
	      throw new TypeError(`Invalid domain.`);
	    }

	    this.setDomain(domain);
	    this.setLocal(typeof local === "string" ? local : "");
	    this.setResource(typeof resource === "string" ? resource : "");
	  }

	  [Symbol.toPrimitive](hint) {
	    if (hint === "number") {
	      return NaN;
	    }

	    return this.toString();
	  }

	  toString(unescape) {
	    let s = this._domain;
	    if (this._local) {
	      s = this.getLocal(unescape) + "@" + s;
	    }

	    if (this._resource) {
	      s = s + "/" + this._resource;
	    }

	    return s;
	  }

	  /**
	   * Convenience method to distinguish users
	   * */
	  bare() {
	    if (this._resource) {
	      return new JID(this._local, this._domain, null);
	    }

	    return this;
	  }

	  /**
	   * Comparison function
	   * */
	  equals(other) {
	    return (
	      this._local === other._local &&
	      this._domain === other._domain &&
	      this._resource === other._resource
	    );
	  }

	  /**
	   * http://xmpp.org/rfcs/rfc6122.html#addressing-localpart
	   * */
	  setLocal(local, escape) {
	    escape = escape || escaping$1.detect(local);

	    if (escape) {
	      local = escaping$1.escape(local);
	    }

	    this._local = local && local.toLowerCase();
	    return this;
	  }

	  getLocal(unescape = false) {
	    let local = null;

	    local = unescape ? escaping$1.unescape(this._local) : this._local;

	    return local;
	  }

	  /**
	   * http://xmpp.org/rfcs/rfc6122.html#addressing-domain
	   */
	  setDomain(domain) {
	    this._domain = domain.toLowerCase();
	    return this;
	  }

	  getDomain() {
	    return this._domain;
	  }

	  /**
	   * http://xmpp.org/rfcs/rfc6122.html#addressing-resourcepart
	   */
	  setResource(resource) {
	    this._resource = resource;
	    return this;
	  }

	  getResource() {
	    return this._resource;
	  }
	};

	Object.defineProperty(JID$4.prototype, "local", {
	  get: JID$4.prototype.getLocal,
	  set: JID$4.prototype.setLocal,
	});

	Object.defineProperty(JID$4.prototype, "domain", {
	  get: JID$4.prototype.getDomain,
	  set: JID$4.prototype.setDomain,
	});

	Object.defineProperty(JID$4.prototype, "resource", {
	  get: JID$4.prototype.getResource,
	  set: JID$4.prototype.setResource,
	});

	var JID_1 = JID$4;

	const JID$3 = JID_1;

	var parse$3 = function parse(s) {
	  let local;
	  let resource;

	  const resourceStart = s.indexOf("/");
	  if (resourceStart !== -1) {
	    resource = s.slice(resourceStart + 1);
	    s = s.slice(0, resourceStart);
	  }

	  const atStart = s.indexOf("@");
	  if (atStart !== -1) {
	    local = s.slice(0, atStart);
	    s = s.slice(atStart + 1);
	  }

	  return new JID$3(local, s, resource);
	};

	const JID$2 = JID_1;
	const escaping = escaping$2;
	const parse$2 = parse$3;

	function jid$3(...args) {
	  if (!args[1] && !args[2]) {
	    return parse$2(...args);
	  }

	  return new JID$2(...args);
	}

	jid$4.exports = jid$3.bind();
	jid$4.exports.jid = jid$3;
	jid$4.exports.JID = JID$2;
	jid$4.exports.equal = function equal(a, b) {
	  return a.equals(b);
	};

	jid$4.exports.detectEscape = escaping.detect;
	jid$4.exports.escapeLocal = escaping.escape;
	jid$4.exports.unescapeLocal = escaping.unescape;
	jid$4.exports.parse = parse$2;

	var jidExports = jid$4.exports;

	var xml$b = {exports: {}};

	var _escape$3 = {};

	Object.defineProperty(_escape$3, '__esModule', { value: true });

	const escapeXMLTable = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  '"': "&quot;",
	  "'": "&apos;",
	};

	function escapeXMLReplace(match) {
	  return escapeXMLTable[match];
	}

	const unescapeXMLTable = {
	  "&amp;": "&",
	  "&lt;": "<",
	  "&gt;": ">",
	  "&quot;": '"',
	  "&apos;": "'",
	};

	function unescapeXMLReplace(match) {
	  if (match[1] === "#") {
	    const num =
	      match[2] === "x"
	        ? parseInt(match.slice(3), 16)
	        : parseInt(match.slice(2), 10);
	    // https://www.w3.org/TR/xml/#NT-Char defines legal XML characters:
	    // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
	    if (
	      num === 0x9 ||
	      num === 0xa ||
	      num === 0xd ||
	      (num >= 0x20 && num <= 0xd7ff) ||
	      (num >= 0xe000 && num <= 0xfffd) ||
	      (num >= 0x10000 && num <= 0x10ffff)
	    ) {
	      return String.fromCodePoint(num);
	    }
	    throw new Error("Illegal XML character 0x" + num.toString(16));
	  }
	  if (unescapeXMLTable[match]) {
	    return unescapeXMLTable[match] || match;
	  }
	  throw new Error("Illegal XML entity " + match);
	}

	function escapeXML(s) {
	  return s.replace(/["&'<>]/g, escapeXMLReplace);
	}

	function unescapeXML(s) {
	  let result = "";
	  let start = -1;
	  let end = -1;
	  let previous = 0;
	  while (
	    (start = s.indexOf("&", previous)) !== -1 &&
	    (end = s.indexOf(";", start + 1)) !== -1
	  ) {
	    result =
	      result +
	      s.slice(previous, start) +
	      unescapeXMLReplace(s.slice(start, end + 1));
	    previous = end + 1;
	  }

	  // shortcut if loop never entered:
	  // return the original string without creating new objects
	  if (previous === 0) return s;

	  // push the remaining characters
	  result = result + s.substring(previous);

	  return result;
	}

	function escapeXMLText(s) {
	  return s.replace(/[&<>]/g, escapeXMLReplace);
	}

	function unescapeXMLText(s) {
	  return s.replace(/&(amp|#38|lt|#60|gt|#62);/g, unescapeXMLReplace);
	}

	_escape$3.escapeXML = escapeXML;
	_escape$3.escapeXMLText = escapeXMLText;
	_escape$3.unescapeXML = unescapeXML;
	_escape$3.unescapeXMLText = unescapeXMLText;

	var _escape$2 = _escape$3;

	/**
	 * Element
	 *
	 * Attributes are in the element.attrs object. Children is a list of
	 * either other Elements or Strings for text content.
	 **/
	let Element$3 = class Element {
	  constructor(name, attrs) {
	    this.name = name;
	    this.parent = null;
	    this.children = [];
	    this.attrs = {};
	    this.setAttrs(attrs);
	  }

	  /* Accessors */

	  /**
	   * if (element.is('message', 'jabber:client')) ...
	   **/
	  is(name, xmlns) {
	    return this.getName() === name && (!xmlns || this.getNS() === xmlns);
	  }

	  /* without prefix */
	  getName() {
	    const idx = this.name.indexOf(":");
	    return idx >= 0 ? this.name.slice(idx + 1) : this.name;
	  }

	  /**
	   * retrieves the namespace of the current element, upwards recursively
	   **/
	  getNS() {
	    const idx = this.name.indexOf(":");
	    if (idx >= 0) {
	      const prefix = this.name.slice(0, idx);
	      return this.findNS(prefix);
	    }
	    return this.findNS();
	  }

	  /**
	   * find the namespace to the given prefix, upwards recursively
	   **/
	  findNS(prefix) {
	    if (!prefix) {
	      /* default namespace */
	      if (this.attrs.xmlns) {
	        return this.attrs.xmlns;
	      } else if (this.parent) {
	        return this.parent.findNS();
	      }
	    } else {
	      /* prefixed namespace */
	      const attr = "xmlns:" + prefix;
	      if (this.attrs[attr]) {
	        return this.attrs[attr];
	      } else if (this.parent) {
	        return this.parent.findNS(prefix);
	      }
	    }
	  }

	  /**
	   * Recursiverly gets all xmlns defined, in the form of {url:prefix}
	   **/
	  getXmlns() {
	    let namespaces = {};

	    if (this.parent) {
	      namespaces = this.parent.getXmlns();
	    }

	    for (const attr in this.attrs) {
	      const m = attr.match("xmlns:?(.*)");
	      // eslint-disable-next-line  no-prototype-builtins
	      if (this.attrs.hasOwnProperty(attr) && m) {
	        namespaces[this.attrs[attr]] = m[1];
	      }
	    }
	    return namespaces;
	  }

	  setAttrs(attrs) {
	    if (typeof attrs === "string") {
	      this.attrs.xmlns = attrs;
	    } else if (attrs) {
	      Object.assign(this.attrs, attrs);
	    }
	  }

	  /**
	   * xmlns can be null, returns the matching attribute.
	   **/
	  getAttr(name, xmlns) {
	    if (!xmlns) {
	      return this.attrs[name];
	    }

	    const namespaces = this.getXmlns();

	    if (!namespaces[xmlns]) {
	      return null;
	    }

	    return this.attrs[[namespaces[xmlns], name].join(":")];
	  }

	  /**
	   * xmlns can be null
	   **/
	  getChild(name, xmlns) {
	    return this.getChildren(name, xmlns)[0];
	  }

	  /**
	   * xmlns can be null
	   **/
	  getChildren(name, xmlns) {
	    const result = [];
	    for (const child of this.children) {
	      if (
	        child.getName &&
	        child.getName() === name &&
	        (!xmlns || child.getNS() === xmlns)
	      ) {
	        result.push(child);
	      }
	    }
	    return result;
	  }

	  /**
	   * xmlns and recursive can be null
	   **/
	  getChildByAttr(attr, val, xmlns, recursive) {
	    return this.getChildrenByAttr(attr, val, xmlns, recursive)[0];
	  }

	  /**
	   * xmlns and recursive can be null
	   **/
	  getChildrenByAttr(attr, val, xmlns, recursive) {
	    let result = [];
	    for (const child of this.children) {
	      if (
	        child.attrs &&
	        child.attrs[attr] === val &&
	        (!xmlns || child.getNS() === xmlns)
	      ) {
	        result.push(child);
	      }
	      if (recursive && child.getChildrenByAttr) {
	        result.push(child.getChildrenByAttr(attr, val, xmlns, true));
	      }
	    }
	    if (recursive) {
	      result = result.flat();
	    }
	    return result;
	  }

	  getChildrenByFilter(filter, recursive) {
	    let result = [];
	    for (const child of this.children) {
	      if (filter(child)) {
	        result.push(child);
	      }
	      if (recursive && child.getChildrenByFilter) {
	        result.push(child.getChildrenByFilter(filter, true));
	      }
	    }
	    if (recursive) {
	      result = result.flat();
	    }
	    return result;
	  }

	  getText() {
	    let text = "";
	    for (const child of this.children) {
	      if (typeof child === "string" || typeof child === "number") {
	        text += child;
	      }
	    }
	    return text;
	  }

	  getChildText(name, xmlns) {
	    const child = this.getChild(name, xmlns);
	    return child ? child.getText() : null;
	  }

	  /**
	   * Return all direct descendents that are Elements.
	   * This differs from `getChildren` in that it will exclude text nodes,
	   * processing instructions, etc.
	   */
	  getChildElements() {
	    return this.getChildrenByFilter((child) => {
	      return child instanceof Element;
	    });
	  }

	  /* Builder */

	  /** returns uppermost parent */
	  root() {
	    if (this.parent) {
	      return this.parent.root();
	    }
	    return this;
	  }

	  /** just parent or itself */
	  up() {
	    if (this.parent) {
	      return this.parent;
	    }
	    return this;
	  }

	  /** create child node and return it */
	  c(name, attrs) {
	    return this.cnode(new Element(name, attrs));
	  }

	  cnode(child) {
	    this.children.push(child);
	    if (typeof child === "object") {
	      child.parent = this;
	    }
	    return child;
	  }

	  append(...nodes) {
	    for (const node of nodes) {
	      this.children.push(node);
	      if (typeof node === "object") {
	        node.parent = this;
	      }
	    }
	  }

	  prepend(...nodes) {
	    for (const node of nodes) {
	      this.children.unshift(node);
	      if (typeof node === "object") {
	        node.parent = this;
	      }
	    }
	  }

	  /** add text node and return element */
	  t(text) {
	    this.children.push(text);
	    return this;
	  }

	  /* Manipulation */

	  /**
	   * Either:
	   *   el.remove(childEl)
	   *   el.remove('author', 'urn:...')
	   */
	  remove(el, xmlns) {
	    const filter =
	      typeof el === "string"
	        ? (child) => {
	            /* 1st parameter is tag name */
	            return !(child.is && child.is(el, xmlns));
	          }
	        : (child) => {
	            /* 1st parameter is element */
	            return child !== el;
	          };

	    this.children = this.children.filter(filter);

	    return this;
	  }

	  text(val) {
	    if (val && this.children.length === 1) {
	      this.children[0] = val;
	      return this;
	    }
	    return this.getText();
	  }

	  attr(attr, val) {
	    if (typeof val !== "undefined" || val === null) {
	      if (!this.attrs) {
	        this.attrs = {};
	      }
	      this.attrs[attr] = val;
	      return this;
	    }
	    return this.attrs[attr];
	  }

	  /* Serialization */

	  toString() {
	    let s = "";
	    this.write((c) => {
	      s += c;
	    });
	    return s;
	  }

	  _addChildren(writer) {
	    writer(">");
	    for (const child of this.children) {
	      /* Skip null/undefined */
	      if (child != null) {
	        if (child.write) {
	          child.write(writer);
	        } else if (typeof child === "string") {
	          writer(_escape$2.escapeXMLText(child));
	        } else if (child.toString) {
	          writer(_escape$2.escapeXMLText(child.toString(10)));
	        }
	      }
	    }
	    writer("</");
	    writer(this.name);
	    writer(">");
	  }

	  write(writer) {
	    writer("<");
	    writer(this.name);
	    for (const k in this.attrs) {
	      const v = this.attrs[k];
	      // === null || undefined
	      if (v != null) {
	        writer(" ");
	        writer(k);
	        writer('="');
	        writer(_escape$2.escapeXML(typeof v === "string" ? v : v.toString(10)));
	        writer('"');
	      }
	    }
	    if (this.children.length === 0) {
	      writer("/>");
	    } else {
	      this._addChildren(writer);
	    }
	  }
	};

	Element$3.prototype.tree = Element$3.prototype.root;

	var Element_1 = Element$3;

	var Element$2 = Element_1;

	function append(el, child) {
	  if (Array.isArray(child)) {
	    for (const c of child) append(el, c);
	    return;
	  }

	  if (child === "" || child == null || child === true || child === false) {
	    return;
	  }

	  el.cnode(child);
	}

	/**
	 * JSX compatible API, use this function as pragma
	 * https://facebook.github.io/jsx/
	 *
	 * @param  {string} name  name of the element
	 * @param  {object} attrs object of attribute key/value pairs
	 * @return {Element}      Element
	 */
	function createElement(name, attrs, ...children) {
	  if (typeof attrs === "object" && attrs !== null) {
	    // __self and __source are added by babel in development
	    // https://github.com/facebook/react/pull/4596
	    // https://babeljs.io/docs/en/babel-preset-react#development
	    // https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-source
	    delete attrs.__source;
	    delete attrs.__self;

	    for (const [key, value] of Object.entries(attrs)) {
	      if (value == null) delete attrs[key];
	      else attrs[key] = value.toString(10);
	    }
	  }

	  const el = new Element$2(name, attrs);

	  for (const child of children) {
	    append(el, child);
	  }

	  return el;
	}

	var createElement_1 = createElement;

	var events = require$$1$2;
	var _escape$1 = _escape$3;

	const STATE_TEXT = 0;
	const STATE_IGNORE_COMMENT = 1;
	const STATE_IGNORE_INSTRUCTION = 2;
	const STATE_TAG_NAME = 3;
	const STATE_TAG = 4;
	const STATE_ATTR_NAME = 5;
	const STATE_ATTR_EQ = 6;
	const STATE_ATTR_QUOT = 7;
	const STATE_ATTR_VALUE = 8;
	const STATE_CDATA = 9;
	const STATE_IGNORE_CDATA = 10;

	class SaxLtx extends events.EventEmitter {
	  constructor() {
	    super();
	    let state = STATE_TEXT;
	    let remainder;
	    let parseRemainder;
	    let tagName;
	    let attrs;
	    let endTag;
	    let selfClosing;
	    let attrQuote;
	    let attrQuoteChar;
	    let recordStart = 0;
	    let attrName;

	    this._handleTagOpening = function _handleTagOpening(
	      endTag,
	      tagName,
	      attrs
	    ) {
	      if (!endTag) {
	        this.emit("startElement", tagName, attrs);
	        if (selfClosing) {
	          this.emit("endElement", tagName);
	        }
	      } else {
	        this.emit("endElement", tagName);
	      }
	    };

	    this.write = function write(data) {
	      if (typeof data !== "string") {
	        data = data.toString();
	      }
	      let pos = 0;

	      /* Anything from previous write()? */
	      if (remainder) {
	        data = remainder + data;
	        pos += !parseRemainder ? remainder.length : 0;
	        parseRemainder = false;
	        remainder = null;
	      }

	      function endRecording() {
	        if (typeof recordStart === "number") {
	          const recorded = data.slice(recordStart, pos);
	          recordStart = undefined;
	          return recorded;
	        }
	      }

	      for (; pos < data.length; pos++) {
	        switch (state) {
	          case STATE_TEXT: {
	            // if we're looping through text, fast-forward using indexOf to
	            // the next '<' character
	            const lt = data.indexOf("<", pos);
	            if (lt !== -1 && pos !== lt) {
	              pos = lt;
	            }

	            break;
	          }
	          case STATE_ATTR_VALUE: {
	            // if we're looping through an attribute, fast-forward using
	            // indexOf to the next end quote character
	            const quot = data.indexOf(attrQuoteChar, pos);
	            if (quot !== -1) {
	              pos = quot;
	            }

	            break;
	          }
	          case STATE_IGNORE_COMMENT: {
	            // if we're looping through a comment, fast-forward using
	            // indexOf to the first end-comment character
	            const endcomment = data.indexOf("-->", pos);
	            if (endcomment !== -1) {
	              pos = endcomment + 2; // target the '>' character
	            }

	            break;
	          }
	          case STATE_IGNORE_CDATA: {
	            // if we're looping through a CDATA, fast-forward using
	            // indexOf to the first end-CDATA character ]]>
	            const endCDATA = data.indexOf("]]>", pos);
	            if (endCDATA !== -1) {
	              pos = endCDATA + 2; // target the '>' character
	            }

	            break;
	          }
	          // No default
	        }

	        const c = data.charCodeAt(pos);
	        switch (state) {
	          case STATE_TEXT:
	            if (c === 60 /* < */) {
	              const text = endRecording();
	              if (text) {
	                this.emit("text", _escape$1.unescapeXML(text));
	              }
	              state = STATE_TAG_NAME;
	              recordStart = pos + 1;
	              attrs = {};
	            }
	            break;
	          case STATE_CDATA:
	            if (c === 93 /* ] */) {
	              if (data.substr(pos + 1, 2) === "]>") {
	                const cData = endRecording();
	                if (cData) {
	                  this.emit("text", cData);
	                }
	                state = STATE_TEXT;
	              } else if (data.length < pos + 2) {
	                parseRemainder = true;
	                pos = data.length;
	              }
	            }
	            break;
	          case STATE_TAG_NAME:
	            if (c === 47 /* / */ && recordStart === pos) {
	              recordStart = pos + 1;
	              endTag = true;
	            } else if (c === 33 /* ! */) {
	              if (data.substr(pos + 1, 7) === "[CDATA[") {
	                recordStart = pos + 8;
	                state = STATE_CDATA;
	              } else if (
	                data.length < pos + 8 &&
	                "[CDATA[".startsWith(data.slice(pos + 1))
	              ) {
	                // We potentially have CDATA, but the chunk is ending; stop here and let the next write() decide
	                parseRemainder = true;
	                pos = data.length;
	              } else {
	                recordStart = undefined;
	                state = STATE_IGNORE_COMMENT;
	              }
	            } else if (c === 63 /* ? */) {
	              recordStart = undefined;
	              state = STATE_IGNORE_INSTRUCTION;
	            } else if (c <= 32 || c === 47 /* / */ || c === 62 /* > */) {
	              tagName = endRecording();
	              pos--;
	              state = STATE_TAG;
	            }
	            break;
	          case STATE_IGNORE_COMMENT:
	            if (c === 62 /* > */) {
	              const prevFirst = data.charCodeAt(pos - 1);
	              const prevSecond = data.charCodeAt(pos - 2);
	              if (
	                (prevFirst === 45 /* - */ && prevSecond === 45) /* - */ ||
	                (prevFirst === 93 /* ] */ && prevSecond === 93) /* ] */
	              ) {
	                state = STATE_TEXT;
	              }
	            }
	            break;
	          case STATE_IGNORE_INSTRUCTION:
	            if (c === 62 /* > */) {
	              const prev = data.charCodeAt(pos - 1);
	              if (prev === 63 /* ? */) {
	                state = STATE_TEXT;
	              }
	            }
	            break;
	          case STATE_TAG:
	            if (c === 62 /* > */) {
	              this._handleTagOpening(endTag, tagName, attrs);
	              tagName = undefined;
	              attrs = undefined;
	              endTag = undefined;
	              selfClosing = undefined;
	              state = STATE_TEXT;
	              recordStart = pos + 1;
	            } else if (c === 47 /* / */) {
	              selfClosing = true;
	            } else if (c > 32) {
	              recordStart = pos;
	              state = STATE_ATTR_NAME;
	            }
	            break;
	          case STATE_ATTR_NAME:
	            if (c <= 32 || c === 61 /* = */) {
	              attrName = endRecording();
	              pos--;
	              state = STATE_ATTR_EQ;
	            }
	            break;
	          case STATE_ATTR_EQ:
	            if (c === 61 /* = */) {
	              state = STATE_ATTR_QUOT;
	            }
	            break;
	          case STATE_ATTR_QUOT:
	            if (c === 34 /* " */ || c === 39 /* ' */) {
	              attrQuote = c;
	              attrQuoteChar = c === 34 ? '"' : "'";
	              state = STATE_ATTR_VALUE;
	              recordStart = pos + 1;
	            }
	            break;
	          case STATE_ATTR_VALUE:
	            if (c === attrQuote) {
	              const value = _escape$1.unescapeXML(endRecording());
	              attrs[attrName] = value;
	              attrName = undefined;
	              state = STATE_TAG;
	            }
	            break;
	        }
	      }

	      if (typeof recordStart === "number" && recordStart <= data.length) {
	        remainder = data.slice(recordStart);
	        recordStart = 0;
	      }
	    };
	  }

	  end(data) {
	    if (data) {
	      this.write(data);
	    }

	    /* Uh, yeah */
	    this.write = function write() {};
	  }
	}

	var ltx = SaxLtx;

	var XMLError_1 = class XMLError extends Error {
	  constructor(...args) {
	    super(...args);
	    this.name = "XMLError";
	  }
	};

	const LtxParser = ltx;
	const Element$1 = Element_1;
	const EventEmitter$3 = require$$1$2;
	const XMLError$1 = XMLError_1;

	let Parser$2 = class Parser extends EventEmitter$3 {
	  constructor() {
	    super();
	    const parser = new LtxParser();
	    this.root = null;
	    this.cursor = null;

	    parser.on("startElement", this.onStartElement.bind(this));
	    parser.on("endElement", this.onEndElement.bind(this));
	    parser.on("text", this.onText.bind(this));

	    this.parser = parser;
	  }

	  onStartElement(name, attrs) {
	    const element = new Element$1(name, attrs);

	    const { root, cursor } = this;

	    if (!root) {
	      this.root = element;
	      this.emit("start", element);
	    } else if (cursor !== root) {
	      cursor.append(element);
	    }

	    this.cursor = element;
	  }

	  onEndElement(name) {
	    const { root, cursor } = this;
	    if (name !== cursor.name) {
	      // <foo></bar>
	      this.emit("error", new XMLError$1(`${cursor.name} must be closed.`));
	      return;
	    }

	    if (cursor === root) {
	      this.emit("end", root);
	      return;
	    }

	    if (!cursor.parent) {
	      cursor.parent = root;
	      this.emit("element", cursor);
	      this.cursor = root;
	      return;
	    }

	    this.cursor = cursor.parent;
	  }

	  onText(str) {
	    const { cursor } = this;
	    if (!cursor) {
	      this.emit("error", new XMLError$1(`${str} must be a child.`));
	      return;
	    }

	    cursor.t(str);
	  }

	  write(data) {
	    this.parser.write(data);
	  }

	  end(data) {
	    if (data) {
	      this.parser.write(data);
	    }
	  }
	};

	Parser$2.XMLError = XMLError$1;

	var Parser_1 = Parser$2;

	(function (module) {

		const Element = Element_1;
		const createElement = createElement_1;
		const Parser = Parser_1;
		const {
		  escapeXML,
		  unescapeXML,
		  escapeXMLText,
		  unescapeXMLText,
		} = _escape$3;
		const XMLError = XMLError_1;

		function xml(...args) {
		  return createElement(...args);
		}

		module.exports = xml;

		Object.assign(module.exports, {
		  Element,
		  createElement,
		  Parser,
		  escapeXML,
		  unescapeXML,
		  escapeXMLText,
		  unescapeXMLText,
		  XMLError,
		}); 
	} (xml$b));

	var xmlExports = xml$b.exports;

	// https://xmpp.org/rfcs/rfc6120.html#rfc.section.4.9.2

	let XMPPError$3 = class XMPPError extends Error {
	  constructor(condition, text, application) {
	    super(condition + (text ? ` - ${text}` : ""));
	    this.name = "XMPPError";
	    this.condition = condition;
	    this.text = text;
	    this.application = application;
	  }

	  static fromElement(element) {
	    const [condition, second, third] = element.children;
	    let text;
	    let application;

	    if (second) {
	      if (second.is("text")) {
	        text = second;
	      } else if (second) {
	        application = second;
	      }

	      if (third) application = third;
	    }

	    const error = new this(
	      condition.name,
	      text ? text.text() : "",
	      application,
	    );
	    error.element = element;
	    return error;
	  }
	};

	var error = XMPPError$3;

	const XMPPError$2 = error;

	// https://xmpp.org/rfcs/rfc6120.html#streams-error

	let StreamError$1 = class StreamError extends XMPPError$2 {
	  constructor(...args) {
	    super(...args);
	    this.name = "StreamError";
	  }
	};

	var StreamError_1 = StreamError$1;

	var util = {exports: {}};

	(function (module) {

		function parseURI(URI) {
		  let { port, hostname, protocol } = new URL(URI);
		  // https://github.com/nodejs/node/issues/12410#issuecomment-294138912
		  if (hostname === "[::1]") {
		    hostname = "::1";
		  }

		  return { port, hostname, protocol };
		}

		function parseHost(host) {
		  const { port, hostname } = parseURI(`http://${host}`);
		  return { port, hostname };
		}

		function parseService(service) {
		  return service.includes("://") ? parseURI(service) : parseHost(service);
		}

		Object.assign(module.exports, { parseURI, parseHost, parseService }); 
	} (util));

	var utilExports = util.exports;

	const { EventEmitter: EventEmitter$2, promise: promise$1 } = events$1;
	const jid$2 = jidExports;
	const xml$a = xmlExports;
	const StreamError = StreamError_1;
	const { parseHost, parseService } = utilExports;

	const NS_STREAM = "urn:ietf:params:xml:ns:xmpp-streams";
	const NS_JABBER_STREAM = "http://etherx.jabber.org/streams";

	let Connection$2 = class Connection extends EventEmitter$2 {
	  constructor(options = {}) {
	    super();
	    this.jid = null;
	    this.timeout = 2000;
	    this.options = options;
	    this.socketListeners = Object.create(null);
	    this.parserListeners = Object.create(null);
	    this.status = "offline";
	    this.socket = null;
	    this.parser = null;
	    this.root = null;
	  }

	  _reset() {
	    this.jid = null;
	    this.status = "offline";
	    this._detachSocket();
	    this._detachParser();
	  }

	  async _streamError(condition, children) {
	    try {
	      await this.send(
	        // prettier-ignore
	        xml$a('stream:error', {}, [
	          xml$a(condition, {xmlns: NS_STREAM}, children),
	        ]),
	      );
	    } catch {}

	    return this._end();
	  }

	  _onData(data) {
	    const str = data.toString("utf8");
	    this.emit("input", str);
	    this.parser.write(str);
	  }

	  _onParserError(error) {
	    // https://xmpp.org/rfcs/rfc6120.html#streams-error-conditions-bad-format
	    // "This error can be used instead of the more specific XML-related errors,
	    // such as <bad-namespace-prefix/>, <invalid-xml/>, <not-well-formed/>, <restricted-xml/>,
	    // and <unsupported-encoding/>. However, the more specific errors are RECOMMENDED."
	    this._streamError("bad-format");
	    this._detachParser();
	    this.emit("error", error);
	  }

	  _attachSocket(socket) {
	    this.socket = socket;
	    const listeners = this.socketListeners;

	    listeners.data = this._onData.bind(this);

	    listeners.close = (dirty, event) => {
	      this._reset();
	      this._status("disconnect", { clean: !dirty, event });
	    };

	    listeners.connect = () => {
	      this._status("connect");
	    };

	    listeners.error = (error) => {
	      this.emit("error", error);
	    };

	    this.socket.on("close", listeners.close);
	    this.socket.on("data", listeners.data);
	    this.socket.on("error", listeners.error);
	    this.socket.on("connect", listeners.connect);
	  }

	  _detachSocket() {
	    const { socketListeners, socket } = this;
	    for (const k of Object.getOwnPropertyNames(socketListeners)) {
	      socket.removeListener(k, socketListeners[k]);
	      delete socketListeners[k];
	    }
	    this.socket = null;
	    return socket;
	  }

	  _onElement(element) {
	    const isStreamError = element.is("error", NS_JABBER_STREAM);

	    if (isStreamError) {
	      this._onStreamError(element);
	    }

	    this.emit("element", element);
	    this.emit(this.isStanza(element) ? "stanza" : "nonza", element);

	    if (isStreamError) {
	      // "Stream Errors Are Unrecoverable"
	      // "The entity that receives the stream error then SHALL close the stream"
	      this._end();
	    }
	  }

	  // https://xmpp.org/rfcs/rfc6120.html#streams-error
	  _onStreamError(element) {
	    const error = StreamError.fromElement(element);

	    if (error.condition === "see-other-host") {
	      return this._onSeeOtherHost(error);
	    }

	    this.emit("error", error);
	  }

	  // https://xmpp.org/rfcs/rfc6120.html#streams-error-conditions-see-other-host
	  async _onSeeOtherHost(error) {
	    const { protocol } = parseService(this.options.service);

	    const host = error.element.getChildText("see-other-host");
	    const { port } = parseHost(host);

	    let service;
	    service = port
	      ? `${protocol || "xmpp:"}//${host}`
	      : (protocol ? `${protocol}//` : "") + host;

	    try {
	      await promise$1(this, "disconnect");
	      const { domain, lang } = this.options;
	      await this.connect(service);
	      await this.open({ domain, lang });
	    } catch (err) {
	      this.emit("error", err);
	    }
	  }

	  _attachParser(parser) {
	    this.parser = parser;
	    const listeners = this.parserListeners;

	    listeners.element = this._onElement.bind(this);
	    listeners.error = this._onParserError.bind(this);

	    listeners.end = (element) => {
	      this._detachParser();
	      this._status("close", element);
	    };

	    listeners.start = (element) => {
	      this._status("open", element);
	    };

	    this.parser.on("error", listeners.error);
	    this.parser.on("element", listeners.element);
	    this.parser.on("end", listeners.end);
	    this.parser.on("start", listeners.start);
	  }

	  _detachParser() {
	    const listeners = this.parserListeners;
	    for (const k of Object.getOwnPropertyNames(listeners)) {
	      this.parser.removeListener(k, listeners[k]);
	      delete listeners[k];
	    }
	    this.parser = null;
	  }

	  _jid(id) {
	    this.jid = jid$2(id);
	    return this.jid;
	  }

	  _status(status, ...args) {
	    this.status = status;
	    this.emit("status", status, ...args);
	    this.emit(status, ...args);
	  }

	  async _end() {
	    let el;
	    try {
	      el = await this.close();
	    } catch {}

	    try {
	      await this.disconnect();
	    } catch {}

	    return el;
	  }

	  /**
	   * Opens the socket then opens the stream
	   */
	  async start() {
	    if (this.status !== "offline") {
	      throw new Error("Connection is not offline");
	    }

	    const { service, domain, lang } = this.options;

	    await this.connect(service);

	    const promiseOnline = promise$1(this, "online");

	    await this.open({ domain, lang });

	    return promiseOnline;
	  }

	  /**
	   * Connects the socket
	   */
	  async connect(service) {
	    this._status("connecting", service);
	    const socket = new this.Socket();
	    this._attachSocket(socket);
	    // The 'connect' status is set by the socket 'connect' listener
	    socket.connect(this.socketParameters(service));
	    return promise$1(socket, "connect");
	  }

	  /**
	   * Disconnects the socket
	   * https://xmpp.org/rfcs/rfc6120.html#streams-close
	   * https://tools.ietf.org/html/rfc7395#section-3.6
	   */
	  async disconnect(timeout = this.timeout) {
	    if (this.socket) this._status("disconnecting");

	    this.socket.end();

	    // The 'disconnect' status is set by the socket 'close' listener
	    await promise$1(this.socket, "close", "error", timeout);
	  }

	  /**
	   * Opens the stream
	   */
	  async open(options) {
	    this._status("opening");

	    if (typeof options === "string") {
	      options = { domain: options };
	    }

	    const { domain, lang, timeout = this.timeout } = options;

	    const headerElement = this.headerElement();
	    headerElement.attrs.to = domain;
	    headerElement.attrs["xml:lang"] = lang;
	    this.root = headerElement;

	    this._attachParser(new this.Parser());

	    await this.write(this.header(headerElement));
	    return promise$1(this, "open", "error", timeout);
	  }

	  /**
	   * Closes the stream then closes the socket
	   * https://xmpp.org/rfcs/rfc6120.html#streams-close
	   * https://tools.ietf.org/html/rfc7395#section-3.6
	   */
	  async stop() {
	    const el = await this._end();
	    if (this.status !== "offline") this._status("offline", el);
	    return el;
	  }

	  /**
	   * Closes the stream and wait for the server to close it
	   * https://xmpp.org/rfcs/rfc6120.html#streams-close
	   * https://tools.ietf.org/html/rfc7395#section-3.6
	   */
	  async close(timeout = this.timeout) {
	    const fragment = this.footer(this.footerElement());

	    const p = Promise.all([
	      promise$1(this.parser, "end", "error", timeout),
	      this.write(fragment),
	    ]);

	    if (this.parser && this.socket) this._status("closing");
	    const [el] = await p;
	    this.root = null;
	    return el;
	    // The 'close' status is set by the parser 'end' listener
	  }

	  /**
	   * Restart the stream
	   * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation-restart
	   */
	  async restart() {
	    this._detachParser();
	    const { domain, lang } = this.options;
	    return this.open({ domain, lang });
	  }

	  async send(element) {
	    element.parent = this.root;
	    await this.write(element.toString());
	    this.emit("send", element);
	  }

	  sendReceive(element, timeout = this.timeout) {
	    return Promise.all([
	      this.send(element),
	      promise$1(this, "element", "error", timeout),
	    ]).then(([, el]) => el);
	  }

	  write(string) {
	    return new Promise((resolve, reject) => {
	      // https://xmpp.org/rfcs/rfc6120.html#streams-close
	      // "Refrain from sending any further data over its outbound stream to the other entity"
	      if (this.status === "closing") {
	        reject(new Error("Connection is closing"));
	        return;
	      }

	      this.socket.write(string, (err) => {
	        if (err) {
	          return reject(err);
	        }

	        this.emit("output", string);
	        resolve();
	      });
	    });
	  }

	  isStanza(element) {
	    const { name } = element;
	    return name === "iq" || name === "message" || name === "presence";
	  }

	  isNonza(element) {
	    return !this.isStanza(element);
	  }

	  // Override
	  header(el) {
	    return el.toString();
	  }

	  // Override
	  headerElement() {
	    return new xml$a.Element("", {
	      version: "1.0",
	      xmlns: this.NS,
	    });
	  }

	  // Override
	  footer(el) {
	    return el.toString();
	  }

	  // Override
	  footerElement() {}

	  // Override
	  socketParameters() {}
	};

	// Overrirde
	Connection$2.prototype.NS = "";
	Connection$2.prototype.Socket = null;
	Connection$2.prototype.Parser = null;

	var connection = Connection$2;

	const Connection$1 = connection;

	let Client$2 = class Client extends Connection$1 {
	  constructor(options) {
	    super(options);
	    this.transports = [];
	  }

	  send(element, ...args) {
	    return this.Transport.prototype.send.call(this, element, ...args);
	  }

	  sendMany(...args) {
	    return this.Transport.prototype.sendMany.call(this, ...args);
	  }

	  _findTransport(service) {
	    return this.transports.find((Transport) => {
	      try {
	        return Transport.prototype.socketParameters(service) !== undefined;
	      } catch {
	        return false;
	      }
	    });
	  }

	  connect(service) {
	    const Transport = this._findTransport(service);

	    if (!Transport) {
	      throw new Error("No compatible connection method found.");
	    }

	    this.Transport = Transport;
	    this.Socket = Transport.prototype.Socket;
	    this.Parser = Transport.prototype.Parser;

	    return super.connect(service);
	  }

	  socketParameters(...args) {
	    return this.Transport.prototype.socketParameters(...args);
	  }

	  header(...args) {
	    return this.Transport.prototype.header(...args);
	  }

	  headerElement(...args) {
	    return this.Transport.prototype.headerElement(...args);
	  }

	  footer(...args) {
	    return this.Transport.prototype.footer(...args);
	  }

	  footerElement(...args) {
	    return this.Transport.prototype.footerElement(...args);
	  }
	};

	Client$2.prototype.NS = "jabber:client";

	var Client_1 = Client$2;

	const Client$1 = Client_1;
	const xml$9 = xmlExports;
	const jid$1 = jidExports;

	clientCore.Client = Client$1;
	clientCore.xml = xml$9;
	clientCore.jid = jid$1;

	var getDomain$1 = function getDomain(service) {
	  const domain = service.split("://")[1] || service;
	  return domain.split(":")[0].split("/")[0];
	};

	const { EventEmitter: EventEmitter$1 } = events$1;

	class Reconnect extends EventEmitter$1 {
	  constructor(entity) {
	    super();

	    this.delay = 1000;
	    this.entity = entity;
	    this._timeout = null;
	  }

	  scheduleReconnect() {
	    const { entity, delay, _timeout } = this;
	    clearTimeout(_timeout);
	    this._timeout = setTimeout(async () => {
	      if (entity.status !== "disconnect") {
	        return;
	      }

	      try {
	        await this.reconnect();
	      } catch {
	        // Ignoring the rejection is safe because the error is emitted on entity by #start
	      }
	    }, delay);
	  }

	  async reconnect() {
	    const { entity } = this;
	    this.emit("reconnecting");

	    const { service, domain, lang } = entity.options;
	    await entity.connect(service);
	    await entity.open({ domain, lang });

	    this.emit("reconnected");
	  }

	  start() {
	    const { entity } = this;
	    const listeners = {};
	    listeners.disconnect = () => {
	      this.scheduleReconnect();
	    };

	    this.listeners = listeners;
	    entity.on("disconnect", listeners.disconnect);
	  }

	  stop() {
	    const { entity, listeners, _timeout } = this;
	    entity.removeListener("disconnect", listeners.disconnect);
	    clearTimeout(_timeout);
	  }
	}

	var reconnect = function reconnect({ entity }) {
	  const r = new Reconnect(entity);
	  r.start();
	  return r;
	};

	var _nodeResolve_empty = {};

	var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: _nodeResolve_empty
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

	const WS = require$$0;
	const WebSocket = commonjsGlobal.WebSocket || WS;
	const EventEmitter = require$$1$2;

	const CODE = "ECONNERROR";

	let Socket$1 = class Socket extends EventEmitter {
	  constructor() {
	    super();
	    this.listeners = Object.create(null);
	  }

	  connect(url) {
	    this.url = url;
	    this._attachSocket(new WebSocket(url, ["xmpp"]));
	  }

	  _attachSocket(socket) {
	    this.socket = socket;
	    const { listeners } = this;
	    listeners.open = () => {
	      this.emit("connect");
	    };

	    listeners.message = ({ data }) => this.emit("data", data);
	    listeners.error = (event) => {
	      const { url } = this;
	      // WS
	      let { error } = event;
	      // DOM
	      if (!error) {
	        error = new Error(`WebSocket ${CODE} ${url}`);
	        error.errno = CODE;
	        error.code = CODE;
	      }

	      error.event = event;
	      error.url = url;
	      this.emit("error", error);
	    };

	    listeners.close = (event) => {
	      this._detachSocket();
	      this.emit("close", !event.wasClean, event);
	    };

	    this.socket.addEventListener("open", listeners.open);
	    this.socket.addEventListener("message", listeners.message);
	    this.socket.addEventListener("error", listeners.error);
	    this.socket.addEventListener("close", listeners.close);
	  }

	  _detachSocket() {
	    delete this.url;
	    const { socket, listeners } = this;
	    for (const k of Object.getOwnPropertyNames(listeners)) {
	      socket.removeEventListener(k, listeners[k]);
	      delete listeners[k];
	    }
	    delete this.socket;
	  }

	  end() {
	    this.socket.close();
	  }

	  write(data, fn) {
	    if (WebSocket === WS) {
	      this.socket.send(data, fn);
	    } else {
	      this.socket.send(data);
	      fn();
	    }
	  }
	};

	var Socket_1 = Socket$1;

	const { Parser: Parser$1, Element, XMLError } = xmlExports;

	var FramedParser_1 = class FramedParser extends Parser$1 {
	  onStartElement(name, attrs) {
	    const element = new Element(name, attrs);

	    const { cursor } = this;

	    if (cursor) {
	      cursor.append(element);
	    }

	    this.cursor = element;
	  }

	  onEndElement(name) {
	    const { cursor } = this;
	    if (name !== cursor.name) {
	      // <foo></bar>
	      this.emit("error", new XMLError(`${cursor.name} must be closed.`));
	      return;
	    }

	    if (cursor.parent) {
	      this.cursor = cursor.parent;
	      return;
	    }

	    if (cursor.is("open", "urn:ietf:params:xml:ns:xmpp-framing")) {
	      this.emit("start", cursor);
	    } else if (cursor.is("close", "urn:ietf:params:xml:ns:xmpp-framing")) {
	      this.emit("end", cursor);
	    } else {
	      this.emit("element", cursor);
	    }

	    this.cursor = null;
	  }
	};

	const Socket = Socket_1;
	const Connection = connection;
	const xml$8 = xmlExports;
	const FramedParser = FramedParser_1;

	const NS_FRAMING = "urn:ietf:params:xml:ns:xmpp-framing";

	/* References
	 * WebSocket protocol https://tools.ietf.org/html/rfc6455
	 * WebSocket Web API https://html.spec.whatwg.org/multipage/comms.html#network
	 * XMPP over WebSocket https://tools.ietf.org/html/rfc7395
	 */

	let ConnectionWebSocket$1 = class ConnectionWebSocket extends Connection {
	  send(element, ...args) {
	    if (!element.attrs.xmlns && super.isStanza(element)) {
	      element.attrs.xmlns = "jabber:client";
	    }

	    return super.send(element, ...args);
	  }

	  async sendMany(elements) {
	    for (const element of elements) {
	      await this.send(element);
	    }
	  }

	  // https://tools.ietf.org/html/rfc7395#section-3.6
	  footerElement() {
	    return new xml$8.Element("close", {
	      xmlns: NS_FRAMING,
	    });
	  }

	  // https://tools.ietf.org/html/rfc7395#section-3.4
	  headerElement() {
	    const el = super.headerElement();
	    el.name = "open";
	    el.attrs.xmlns = NS_FRAMING;
	    return el;
	  }

	  socketParameters(service) {
	    return /^wss?:\/\//.test(service) ? service : undefined;
	  }
	};

	ConnectionWebSocket$1.prototype.Socket = Socket;
	ConnectionWebSocket$1.prototype.NS = "jabber:client";
	ConnectionWebSocket$1.prototype.Parser = FramedParser;

	var Connection_1 = ConnectionWebSocket$1;

	const ConnectionWebSocket = Connection_1;

	var websocket = function websocket({ entity }) {
	  entity.transports.push(ConnectionWebSocket);
	};

	/**
	 * Expose compositor.
	 */

	var koaCompose = compose$1;

	/**
	 * Compose `middleware` returning
	 * a fully valid middleware comprised
	 * of all those which are passed.
	 *
	 * @param {Array} middleware
	 * @return {Function}
	 * @api public
	 */

	function compose$1 (middleware) {
	  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
	  for (const fn of middleware) {
	    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
	  }

	  /**
	   * @param {Object} context
	   * @return {Promise}
	   * @api public
	   */

	  return function (context, next) {
	    // last called middleware #
	    let index = -1;
	    return dispatch(0)
	    function dispatch (i) {
	      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
	      index = i;
	      let fn = middleware[i];
	      if (i === middleware.length) fn = next;
	      if (!fn) return Promise.resolve()
	      try {
	        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
	      } catch (err) {
	        return Promise.reject(err)
	      }
	    }
	  }
	}

	var Context_1 = class Context {
	  constructor(entity, stanza) {
	    this.stanza = stanza;
	    this.entity = entity;

	    const { name, attrs } = stanza;
	    const { type, id } = attrs;

	    this.name = name;
	    this.id = id || "";

	    if (name === "message") {
	      this.type = type || "normal";
	    } else if (name === "presence") {
	      this.type = type || "available";
	    } else {
	      this.type = type || "";
	    }

	    this.from = null;
	    this.to = null;
	    this.local = "";
	    this.domain = "";
	    this.resource = "";
	  }
	};

	const Context$1 = Context_1;
	const JID$1 = jidExports;

	var IncomingContext_1 = class IncomingContext extends Context$1 {
	  constructor(entity, stanza) {
	    super(entity, stanza);

	    const { jid, domain } = entity;

	    const to = stanza.attrs.to || (jid && jid.toString());
	    const from = stanza.attrs.from || domain;

	    if (to) this.to = new JID$1(to);

	    if (from) {
	      this.from = new JID$1(from);
	      this.local = this.from.local;
	      this.domain = this.from.domain;
	      this.resource = this.from.resource;
	    }
	  }
	};

	const Context = Context_1;
	const JID = jidExports;

	var OutgoingContext_1 = class OutgoingContext extends Context {
	  constructor(entity, stanza) {
	    super(entity, stanza);

	    const { jid, domain } = entity;

	    const from = stanza.attrs.from || (jid && jid.toString());
	    const to = stanza.attrs.to || domain;

	    if (from) this.from = new JID(from);

	    if (to) {
	      this.to = new JID(to);
	      this.local = this.to.local;
	      this.domain = this.to.domain;
	      this.resource = this.to.resource;
	    }
	  }
	};

	const compose = koaCompose;

	const IncomingContext = IncomingContext_1;
	const OutgoingContext = OutgoingContext_1;

	function listener(entity, middleware, Context) {
	  return (stanza) => {
	    const ctx = new Context(entity, stanza);
	    return compose(middleware)(ctx);
	  };
	}

	function errorHandler(entity) {
	  return (ctx, next) => {
	    next()
	      .then((reply) => reply && entity.send(reply))
	      .catch((err) => entity.emit("error", err));
	  };
	}

	var middleware = function middleware({ entity }) {
	  const incoming = [errorHandler(entity)];
	  const outgoing = [];

	  const incomingListener = listener(entity, incoming, IncomingContext);
	  const outgoingListener = listener(entity, outgoing, OutgoingContext);

	  entity.on("element", incomingListener);
	  entity.hookOutgoing = outgoingListener;

	  return {
	    use(fn) {
	      incoming.push(fn);
	      return fn;
	    },
	    filter(fn) {
	      outgoing.push(fn);
	      return fn;
	    },
	  };
	};

	var route$3 = function route() {
	  return async ({ stanza, entity }, next) => {
	    if (!stanza.is("features", "http://etherx.jabber.org/streams"))
	      return next();

	    const prevent = await next();
	    if (!prevent && entity.jid) entity._status("online", entity.jid);
	  };
	};

	/**
	 * References
	 * https://xmpp.org/rfcs/rfc6120.html#streams-negotiation Stream Negotiation
	 * https://xmpp.org/extensions/xep-0170.html XEP-0170: Recommended Order of Stream Feature Negotiation
	 * https://xmpp.org/registrar/stream-features.html XML Stream Features
	 */

	const route$2 = route$3;

	var streamFeatures = function streamFeatures({ middleware }) {
	  middleware.use(route$2());

	  function use(name, xmlns, handler) {
	    return middleware.use((ctx, next) => {
	      const { stanza } = ctx;
	      if (!stanza.is("features", "http://etherx.jabber.org/streams"))
	        return next();
	      const feature = stanza.getChild(name, xmlns);
	      if (!feature) return next();
	      return handler(ctx, next, feature);
	    });
	  }

	  return {
	    use,
	  };
	};

	var id = function id() {
	  let i;
	  while (!i) {
	    i = Math.random().toString(36).slice(2, 12);
	  }

	  return i;
	};

	/* https://xmpp.org/rfcs/rfc6120.html#stanzas-error */

	const XMPPError$1 = error;

	let StanzaError$1 = class StanzaError extends XMPPError$1 {
	  constructor(condition, text, application, type) {
	    super(condition, text, application);
	    this.type = type;
	    this.name = "StanzaError";
	  }

	  static fromElement(element) {
	    const error = super.fromElement(element);
	    error.type = element.attrs.type;
	    return error;
	  }
	};

	var StanzaError_1 = StanzaError$1;

	const xid = id;
	const StanzaError = StanzaError_1;
	const { Deferred } = events$1;
	const timeoutPromise = events$1.timeout;
	const xml$7 = xmlExports;

	function isReply({ name, type }) {
	  if (name !== "iq") return false;
	  if (type !== "error" && type !== "result") return false;
	  return true;
	}

	class IQCaller {
	  constructor({ entity, middleware }) {
	    this.handlers = new Map();
	    this.entity = entity;
	    this.middleware = middleware;
	  }

	  start() {
	    this.middleware.use(this._route.bind(this));
	  }

	  _route({ type, name, id, stanza }, next) {
	    if (!isReply({ name, type })) return next();

	    const deferred = this.handlers.get(id);

	    if (!deferred) {
	      return next();
	    }

	    if (type === "error") {
	      deferred.reject(StanzaError.fromElement(stanza.getChild("error")));
	    } else {
	      deferred.resolve(stanza);
	    }

	    this.handlers.delete(id);
	  }

	  async request(stanza, timeout = 30 * 1000) {
	    if (!stanza.attrs.id) {
	      stanza.attrs.id = xid();
	    }

	    const deferred = new Deferred();
	    this.handlers.set(stanza.attrs.id, deferred);

	    try {
	      await this.entity.send(stanza);
	      await timeoutPromise(deferred.promise, timeout);
	    } catch (err) {
	      this.handlers.delete(stanza.attrs.id);
	      throw err;
	    }

	    return deferred.promise;
	  }

	  _childRequest(type, element, to, ...args) {
	    const {
	      name,
	      attrs: { xmlns },
	    } = element;
	    return this.request(xml$7("iq", { type, to }, element), ...args).then(
	      (stanza) => stanza.getChild(name, xmlns),
	    );
	  }

	  async get(...args) {
	    return this._childRequest("get", ...args);
	  }

	  async set(...args) {
	    return this._childRequest("set", ...args);
	  }
	}

	var caller = function iqCaller(...args) {
	  const iqCaller = new IQCaller(...args);
	  iqCaller.start();
	  return iqCaller;
	};

	/**
	 * References
	 * https://xmpp.org/rfcs/rfc6120.html#stanzas-semantics-iq
	 * https://xmpp.org/rfcs/rfc6120.html#stanzas-error
	 */

	const xml$6 = xmlExports;

	const NS_STANZA = "urn:ietf:params:xml:ns:xmpp-stanzas";

	function isQuery({ name, type }) {
	  if (name !== "iq") return false;
	  if (type === "error" || type === "result") return false;
	  return true;
	}

	function isValidQuery({ type }, children, child) {
	  if (type !== "get" && type !== "set") return false;
	  if (children.length !== 1) return false;
	  if (!child) return false;
	  return true;
	}

	function buildReply({ stanza }) {
	  return xml$6("iq", {
	    to: stanza.attrs.from,
	    from: stanza.attrs.to,
	    id: stanza.attrs.id,
	  });
	}

	function buildReplyResult(ctx, child) {
	  const reply = buildReply(ctx);
	  reply.attrs.type = "result";
	  if (child) {
	    reply.append(child);
	  }

	  return reply;
	}

	function buildReplyError(ctx, error, child) {
	  const reply = buildReply(ctx);
	  reply.attrs.type = "error";
	  if (child) {
	    reply.append(child);
	  }

	  reply.append(error);
	  return reply;
	}

	function buildError(type, condition) {
	  return xml$6("error", { type }, xml$6(condition, NS_STANZA));
	}

	function iqHandler(entity) {
	  return async function iqHandler(ctx, next) {
	    if (!isQuery(ctx)) return next();

	    const { stanza } = ctx;
	    const children = stanza.getChildElements();
	    const [child] = children;

	    if (!isValidQuery(ctx, children, child)) {
	      return buildReplyError(ctx, buildError("modify", "bad-request"), child);
	    }

	    ctx.element = child;

	    let reply;
	    try {
	      reply = await next();
	    } catch (err) {
	      entity.emit("error", err);
	      reply = buildError("cancel", "internal-server-error");
	    }

	    if (!reply) {
	      reply = buildError("cancel", "service-unavailable");
	    }

	    if (reply instanceof xml$6.Element && reply.is("error")) {
	      return buildReplyError(ctx, reply, child);
	    }

	    return buildReplyResult(
	      ctx,
	      reply instanceof xml$6.Element ? reply : undefined,
	    );
	  };
	}

	function route$1(type, ns, name, handler) {
	  return (ctx, next) => {
	    if ((ctx.type !== type) | !ctx.element || !ctx.element.is(name, ns))
	      return next();
	    return handler(ctx, next);
	  };
	}

	var callee = function iqCallee({ middleware, entity }) {
	  middleware.use(iqHandler(entity));

	  return {
	    get(ns, name, handler) {
	      middleware.use(route$1("get", ns, name, handler));
	    },
	    set(ns, name, handler) {
	      middleware.use(route$1("set", ns, name, handler));
	    },
	  };
	};

	var resolve$2 = {exports: {}};

	var http$1 = {};

	const Parser = Parser_1;

	var parse$1 = function parse(data) {
	  const p = new Parser();

	  let result = null;
	  let error = null;

	  p.on("start", (el) => {
	    result = el;
	  });
	  p.on("element", (el) => {
	    result.append(el);
	  });
	  p.on("error", (err) => {
	    error = err;
	  });

	  p.write(data);
	  p.end();

	  if (error) {
	    throw error;
	  } else {
	    return result;
	  }
	};

	var altConnections = {};

	function isSecure(uri) {
	  return uri.startsWith("https") || uri.startsWith("wss");
	}

	altConnections.compare = function compare(a, b) {
	  let secure;
	  if (isSecure(a.uri) && !isSecure(b.uri)) {
	    secure = -1;
	  } else if (!isSecure(a.uri) && isSecure(b.uri)) {
	    secure = 1;
	  } else {
	    secure = 0;
	  }

	  if (secure !== 0) {
	    return secure;
	  }

	  let method;
	  if (a.method === b.method) {
	    method = 0;
	  } else if (a.method === "websocket") {
	    method = -1;
	  } else if (b.method === "websocket") {
	    method = 1;
	  } else if (a.method === "xbosh") {
	    method = -1;
	  } else if (b.method === "xbosh") {
	    method = 1;
	  } else if (a.method === "httppoll") {
	    method = -1;
	  } else if (b.method === "httppoll") {
	    method = 1;
	  } else {
	    method = 0;
	  }

	  if (method !== 0) {
	    return method;
	  }

	  return 0;
	};

	const fetch = commonjsGlobal.fetch || require$$0;
	const parse = parse$1;
	const compareAltConnections = altConnections.compare;

	function resolve$1(domain) {
	  return fetch(`https://${domain}/.well-known/host-meta`)
	    .then((res) => res.text())
	    .then((res) => {
	      return parse(res)
	        .getChildren("Link")
	        .filter((link) =>
	          [
	            "urn:xmpp:alt-connections:websocket",
	            "urn:xmpp:alt-connections:httppoll",
	            "urn:xmpp:alt-connections:xbosh",
	          ].includes(link.attrs.rel),
	        )
	        .map(({ attrs }) => ({
	          rel: attrs.rel,
	          href: attrs.href,
	          method: attrs.rel.split(":").pop(),
	          uri: attrs.href,
	        }))
	        .sort(compareAltConnections);
	    })
	    .catch(() => {
	      return [];
	    });
	}

	http$1.resolve = resolve$1;

	const dns = require$$0;
	const http = http$1;

	resolve$2.exports = function resolve(...args) {
	  return Promise.all([
	    dns.resolve ? dns.resolve(...args) : Promise.resolve([]),
	    http.resolve(...args),
	  ]).then(([records, endpoints]) => [...records, ...endpoints]);
	};

	if (dns.resolve) {
	  resolve$2.exports.dns = dns;
	}

	resolve$2.exports.http = http;

	var resolveExports = resolve$2.exports;

	const resolve = resolveExports;
	const { promise } = events$1;

	async function fetchURIs(domain) {
	  const result = await resolve(domain, {
	    srv: [
	      {
	        service: "xmpps-client",
	        protocol: "tcp",
	      },
	      {
	        service: "xmpp-client",
	        protocol: "tcp",
	      },
	    ],
	  });

	  return [
	    // Remove duplicates
	    ...new Set(result.map((record) => record.uri)),
	  ];
	}

	function filterSupportedURIs(entity, uris) {
	  return uris.filter((uri) => entity._findTransport(uri));
	}

	async function fallbackConnect(entity, uris) {
	  if (uris.length === 0) {
	    throw new Error("Couldn't connect");
	  }

	  const uri = uris.shift();
	  const Transport = entity._findTransport(uri);

	  if (!Transport) {
	    return fallbackConnect(entity, uris);
	  }

	  entity._status("connecting", uri);
	  const params = Transport.prototype.socketParameters(uri);
	  const socket = new Transport.prototype.Socket();

	  try {
	    socket.connect(params);
	    await promise(socket, "connect");
	  } catch {
	    return fallbackConnect(entity, uris);
	  }

	  entity._attachSocket(socket);
	  socket.emit("connect");
	  entity.Transport = Transport;
	  entity.Socket = Transport.prototype.Socket;
	  entity.Parser = Transport.prototype.Parser;
	}

	var resolve_1 = function resolve({ entity }) {
	  const _connect = entity.connect;
	  entity.connect = async function connect(service) {
	    if (!service || /:\/\//.test(service)) {
	      return _connect.call(this, service);
	    }

	    const uris = filterSupportedURIs(entity, await fetchURIs(service));

	    if (uris.length === 0) {
	      throw new Error("No compatible transport found.");
	    }

	    try {
	      await fallbackConnect(entity, uris);
	    } catch (err) {
	      entity._reset();
	      entity._status("disconnect");
	      throw err;
	    }
	  };
	};

	var browser = {};

	browser.encode = function encode(string) {
	  return commonjsGlobal.btoa(string);
	};

	browser.decode = function decode(string) {
	  return commonjsGlobal.atob(string);
	};

	const XMPPError = error;

	// https://xmpp.org/rfcs/rfc6120.html#sasl-errors

	let SASLError$1 = class SASLError extends XMPPError {
	  constructor(...args) {
	    super(...args);
	    this.name = "SASLError";
	  }
	};

	var SASLError_1 = SASLError$1;

	var main$2 = {exports: {}};

	var factory = {exports: {}};

	var hasRequiredFactory;

	function requireFactory () {
		if (hasRequiredFactory) return factory.exports;
		hasRequiredFactory = 1;
		(function (module, exports) {
			(function(root, factory) {
			  {
			    // CommonJS
			    factory(exports, module);
			  }
			}(commonjsGlobal, function(exports, module) {
			  
			  /**
			   * `Factory` constructor.
			   *
			   * @api public
			   */
			  function Factory() {
			    this._mechs = [];
			  }
			  
			  /**
			   * Utilize the given `mech` with optional `name`, overridding the mechanism's
			   * default name.
			   *
			   * Examples:
			   *
			   *     factory.use(FooMechanism);
			   *
			   *     factory.use('XFOO', FooMechanism);
			   *
			   * @param {String|Mechanism} name
			   * @param {Mechanism} mech
			   * @return {Factory} for chaining
			   * @api public
			   */
			  Factory.prototype.use = function(name, mech) {
			    if (!mech) {
			      mech = name;
			      name = mech.prototype.name;
			    }
			    this._mechs.push({ name: name, mech: mech });
			    return this;
			  };
			  
			  /**
			   * Create a new mechanism from supported list of `mechs`.
			   *
			   * If no mechanisms are supported, returns `null`.
			   *
			   * Examples:
			   *
			   *     var mech = factory.create(['FOO', 'BAR']);
			   *
			   * @param {Array} mechs
			   * @return {Mechanism}
			   * @api public
			   */
			  Factory.prototype.create = function(mechs) {
			    for (var i = 0, len = this._mechs.length; i < len; i++) {
			      for (var j = 0, jlen = mechs.length; j < jlen; j++) {
			        var entry = this._mechs[i];
			        if (entry.name == mechs[j]) {
			          return new entry.mech();
			        }
			      }
			    }
			    return null;
			  };

			  module.exports = Factory;
			  
			})); 
		} (factory, factory.exports));
		return factory.exports;
	}

	(function (module, exports) {
		(function(root, factory) {
		  {
		    // CommonJS
		    factory(exports,
		            module,
		            requireFactory());
		  }
		}(commonjsGlobal, function(exports, module, Factory) {
		  
		  exports = module.exports = Factory;
		  exports.Factory = Factory;
		  
		})); 
	} (main$2, main$2.exports));

	var mainExports$2 = main$2.exports;

	const { encode, decode } = browser;
	const SASLError = SASLError_1;
	const xml$5 = xmlExports;
	const SASLFactory = mainExports$2;

	// https://xmpp.org/rfcs/rfc6120.html#sasl

	const NS$3 = "urn:ietf:params:xml:ns:xmpp-sasl";

	function getMechanismNames(features) {
	  return features.getChild("mechanisms", NS$3).children.map((el) => el.text());
	}

	async function authenticate(SASL, entity, mechname, credentials) {
	  const mech = SASL.create([mechname]);
	  if (!mech) {
	    throw new Error("No compatible mechanism");
	  }

	  const { domain } = entity.options;
	  const creds = {
	    username: null,
	    password: null,
	    server: domain,
	    host: domain,
	    realm: domain,
	    serviceType: "xmpp",
	    serviceName: domain,
	    ...credentials,
	  };

	  return new Promise((resolve, reject) => {
	    const handler = (element) => {
	      if (element.attrs.xmlns !== NS$3) {
	        return;
	      }

	      if (element.name === "challenge") {
	        mech.challenge(decode(element.text()));
	        const resp = mech.response(creds);
	        entity.send(
	          xml$5(
	            "response",
	            { xmlns: NS$3, mechanism: mech.name },
	            typeof resp === "string" ? encode(resp) : "",
	          ),
	        );
	        return;
	      }

	      if (element.name === "failure") {
	        reject(SASLError.fromElement(element));
	      } else if (element.name === "success") {
	        resolve();
	      }

	      entity.removeListener("nonza", handler);
	    };

	    entity.on("nonza", handler);

	    if (mech.clientFirst) {
	      entity.send(
	        xml$5(
	          "auth",
	          { xmlns: NS$3, mechanism: mech.name },
	          encode(mech.response(creds)),
	        ),
	      );
	    }
	  });
	}

	var sasl = function sasl({ streamFeatures }, credentials) {
	  const SASL = new SASLFactory();

	  streamFeatures.use("mechanisms", NS$3, async ({ stanza, entity }) => {
	    const offered = getMechanismNames(stanza);
	    const supported = SASL._mechs.map(({ name }) => name);
	    // eslint-disable-next-line unicorn/prefer-array-find
	    const intersection = supported.filter((mech) => {
	      return offered.includes(mech);
	    });
	    // eslint-disable-next-line prefer-destructuring
	    let mech = intersection[0];

	    if (typeof credentials === "function") {
	      await credentials(
	        (creds) => authenticate(SASL, entity, mech, creds),
	        mech,
	      );
	    } else {
	      if (!credentials.username && !credentials.password) {
	        mech = "ANONYMOUS";
	      }

	      await authenticate(SASL, entity, mech, credentials);
	    }

	    await entity.restart();
	  });

	  return {
	    use(...args) {
	      return SASL.use(...args);
	    },
	  };
	};

	const xml$4 = xmlExports;

	/*
	 * References
	 * https://xmpp.org/rfcs/rfc6120.html#bind
	 */

	const NS$2 = "urn:ietf:params:xml:ns:xmpp-bind";

	function makeBindElement(resource) {
	  return xml$4("bind", { xmlns: NS$2 }, resource && xml$4("resource", {}, resource));
	}

	async function bind(entity, iqCaller, resource) {
	  const result = await iqCaller.set(makeBindElement(resource));
	  const jid = result.getChildText("jid");
	  entity._jid(jid);
	  return jid;
	}

	function route({ iqCaller }, resource) {
	  return async ({ entity }, next) => {
	    await (typeof resource === "function"
	      ? resource((resource) => bind(entity, iqCaller, resource))
	      : bind(entity, iqCaller, resource));

	    next();
	  };
	}

	var resourceBinding = function resourceBinding(
	  { streamFeatures, iqCaller },
	  resource,
	) {
	  streamFeatures.use("bind", NS$2, route({ iqCaller }, resource));
	};

	const xml$3 = xmlExports;

	// https://tools.ietf.org/html/draft-cridland-xmpp-session-01

	const NS$1 = "urn:ietf:params:xml:ns:xmpp-session";

	var sessionEstablishment = function sessionEstablishment({ iqCaller, streamFeatures }) {
	  streamFeatures.use("session", NS$1, async (context, next, feature) => {
	    if (feature.getChild("optional")) return next();
	    await iqCaller.set(xml$3("session", NS$1));
	    return next();
	  });
	};

	const xml$2 = xmlExports;

	// https://xmpp.org/extensions/xep-0198.html

	const NS = "urn:xmpp:sm:3";

	async function enable(entity, resume, max) {
	  entity.send(
	    xml$2("enable", { xmlns: NS, max, resume: resume ? "true" : undefined }),
	  );

	  return new Promise((resolve, reject) => {
	    function listener(nonza) {
	      if (nonza.is("enabled", NS)) {
	        resolve(nonza);
	      } else if (nonza.is("failed", NS)) {
	        reject(nonza);
	      } else {
	        return;
	      }

	      entity.removeListener("nonza", listener);
	    }

	    entity.on("nonza", listener);
	  });
	}

	async function resume(entity, h, previd) {
	  const response = await entity.sendReceive(
	    xml$2("resume", { xmlns: NS, h, previd }),
	  );

	  if (!response.is("resumed", NS)) {
	    throw response;
	  }

	  return response;
	}

	var streamManagement = function streamManagement({
	  streamFeatures,
	  entity,
	  middleware,
	}) {
	  let address = null;

	  const sm = {
	    allowResume: true,
	    preferredMaximum: null,
	    enabled: false,
	    id: "",
	    outbound: 0,
	    inbound: 0,
	    max: null,
	  };

	  entity.on("online", (jid) => {
	    address = jid;
	    sm.outbound = 0;
	    sm.inbound = 0;
	  });

	  entity.on("offline", () => {
	    sm.outbound = 0;
	    sm.inbound = 0;
	    sm.enabled = false;
	    sm.id = "";
	  });

	  middleware.use((context, next) => {
	    const { stanza } = context;
	    if (["presence", "message", "iq"].includes(stanza.name)) {
	      sm.inbound += 1;
	    } else if (stanza.is("r", NS)) {
	      // > When an <r/> element ("request") is received, the recipient MUST acknowledge it by sending an <a/> element to the sender containing a value of 'h' that is equal to the number of stanzas handled by the recipient of the <r/> element.
	      entity.send(xml$2("a", { xmlns: NS, h: sm.inbound })).catch(() => {});
	    } else if (stanza.is("a", NS)) {
	      // > When a party receives an <a/> element, it SHOULD keep a record of the 'h' value returned as the sequence number of the last handled outbound stanza for the current stream (and discard the previous value).
	      sm.outbound = stanza.attrs.h;
	    }

	    return next();
	  });

	  // https://xmpp.org/extensions/xep-0198.html#enable
	  // For client-to-server connections, the client MUST NOT attempt to enable stream management until after it has completed Resource Binding unless it is resuming a previous session

	  streamFeatures.use("sm", NS, async (context, next) => {
	    // Resuming
	    if (sm.id) {
	      try {
	        await resume(entity, sm.inbound, sm.id);
	        sm.enabled = true;
	        entity.jid = address;
	        entity.status = "online";
	        return true;
	        // If resumption fails, continue with session establishment
	        // eslint-disable-next-line no-unused-vars
	      } catch {
	        sm.id = "";
	        sm.enabled = false;
	        sm.outbound = 0;
	      }
	    }

	    // Enabling

	    // Resource binding first
	    await next();

	    const promiseEnable = enable(entity, sm.allowResume, sm.preferredMaximum);

	    // > The counter for an entity's own sent stanzas is set to zero and started after sending either <enable/> or <enabled/>.
	    sm.outbound = 0;

	    try {
	      const response = await promiseEnable;
	      sm.enabled = true;
	      sm.id = response.attrs.id;
	      sm.max = response.attrs.max;
	      // eslint-disable-next-line no-unused-vars
	    } catch {
	      sm.enabled = false;
	    }

	    sm.inbound = 0;
	  });

	  return sm;
	};

	var main$1 = {exports: {}};

	var mechanism$1 = {exports: {}};

	var hasRequiredMechanism$1;

	function requireMechanism$1 () {
		if (hasRequiredMechanism$1) return mechanism$1.exports;
		hasRequiredMechanism$1 = 1;
		(function (module, exports) {
			(function(root, factory) {
			  {
			    // CommonJS
			    factory(exports, module);
			  }
			}(commonjsGlobal, function(exports, module) {

			  /**
			   * ANONYMOUS `Mechanism` constructor.
			   *
			   * This class implements the ANONYMOUS SASL mechanism.
			   *
			   * The ANONYMOUS SASL mechanism provides support for permitting anonymous
			   * access to various services
			   *
			   * References:
			   *  - [RFC 4505](http://tools.ietf.org/html/rfc4505)
			   *
			   * @api public
			   */
			  function Mechanism() {
			  }
			  
			  Mechanism.prototype.name = 'ANONYMOUS';
			  Mechanism.prototype.clientFirst = true;
			  
			  /**
			   * Encode a response using optional trace information.
			   *
			   * Options:
			   *  - `trace`  trace information (optional)
			   *
			   * @param {Object} cred
			   * @api public
			   */
			  Mechanism.prototype.response = function(cred) {
			    return cred.trace || '';
			  };
			  
			  /**
			   * Decode a challenge issued by the server.
			   *
			   * @param {String} chal
			   * @api public
			   */
			  Mechanism.prototype.challenge = function(chal) {
			  };

			  module.exports = Mechanism;
			  
			})); 
		} (mechanism$1, mechanism$1.exports));
		return mechanism$1.exports;
	}

	(function (module, exports) {
		(function(root, factory) {
		  {
		    // CommonJS
		    factory(exports,
		            module,
		            requireMechanism$1());
		  }
		}(commonjsGlobal, function(exports, module, Mechanism) {

		  exports = module.exports = Mechanism;
		  exports.Mechanism = Mechanism;
		  
		})); 
	} (main$1, main$1.exports));

	var mainExports$1 = main$1.exports;

	/**
	 * [XEP-0175: Best Practices for Use of SASL ANONYMOUS](https://xmpp.org/extensions/xep-0175.html)
	 * [RFC-4504: Anonymous Simple Authentication and Security Layer (SASL) Mechanism](https://tools.ietf.org/html/rfc4505)
	 */

	const mech$1 = mainExports$1;

	var saslAnonymous = function saslAnonymous(sasl) {
	  sasl.use(mech$1);
	};

	var main = {exports: {}};

	var mechanism = {exports: {}};

	var hasRequiredMechanism;

	function requireMechanism () {
		if (hasRequiredMechanism) return mechanism.exports;
		hasRequiredMechanism = 1;
		(function (module, exports) {
			(function(root, factory) {
			  {
			    // CommonJS
			    factory(exports, module);
			  }
			}(commonjsGlobal, function(exports, module) {

			  /**
			   * PLAIN `Mechanism` constructor.
			   *
			   * This class implements the PLAIN SASL mechanism.
			   *
			   * The PLAIN SASL mechanism provides support for exchanging a clear-text
			   * username and password.  This mechanism should not be used without adequate
			   * security provided by an underlying transport layer. 
			   *
			   * References:
			   *  - [RFC 4616](http://tools.ietf.org/html/rfc4616)
			   *
			   * @api public
			   */
			  function Mechanism() {
			  }
			  
			  Mechanism.prototype.name = 'PLAIN';
			  Mechanism.prototype.clientFirst = true;
			  
			  /**
			   * Encode a response using given credential.
			   *
			   * Options:
			   *  - `username`
			   *  - `password`
			   *  - `authzid`   authorization identity (optional)
			   *
			   * @param {Object} cred
			   * @api public
			   */
			  Mechanism.prototype.response = function(cred) {
			    var str = '';
			    str += cred.authzid || '';
			    str += '\0';
			    str += cred.username;
			    str += '\0';
			    str += cred.password;
			    return str;
			  };
			  
			  /**
			   * Decode a challenge issued by the server.
			   *
			   * @param {String} chal
			   * @return {Mechanism} for chaining
			   * @api public
			   */
			  Mechanism.prototype.challenge = function(chal) {
			    return this;
			  };

			  module.exports = Mechanism;
			  
			})); 
		} (mechanism, mechanism.exports));
		return mechanism.exports;
	}

	(function (module, exports) {
		(function(root, factory) {
		  {
		    // CommonJS
		    factory(exports,
		            module,
		            requireMechanism());
		  }
		}(commonjsGlobal, function(exports, module, Mechanism) {

		  exports = module.exports = Mechanism;
		  exports.Mechanism = Mechanism;
		  
		})); 
	} (main, main.exports));

	var mainExports = main.exports;

	const mech = mainExports;

	var saslPlain = function saslPlain(sasl) {
	  sasl.use(mech);
	};

	const { xml: xml$1, jid, Client } = clientCore;
	const getDomain = getDomain$1;

	const _reconnect = reconnect;
	const _websocket = websocket;
	const _middleware = middleware;
	const _streamFeatures = streamFeatures;
	const _iqCaller = caller;
	const _iqCallee = callee;
	const _resolve = resolve_1;

	// Stream features - order matters and define priority
	const _sasl = sasl;
	const _resourceBinding = resourceBinding;
	const _sessionEstablishment = sessionEstablishment;
	const _streamManagement = streamManagement;

	// SASL mechanisms - order matters and define priority
	const anonymous = saslAnonymous;
	const plain = saslPlain;

	function client(options = {}) {
	  const { resource, credentials, username, password, ...params } = options;

	  const { domain, service } = params;
	  if (!domain && service) {
	    params.domain = getDomain(service);
	  }

	  const entity = new Client(params);

	  const reconnect = _reconnect({ entity });
	  const websocket = _websocket({ entity });

	  const middleware = _middleware({ entity });
	  const streamFeatures = _streamFeatures({ middleware });
	  const iqCaller = _iqCaller({ middleware, entity });
	  const iqCallee = _iqCallee({ middleware, entity });
	  const resolve = _resolve({ entity });
	  // Stream features - order matters and define priority
	  const sasl = _sasl({ streamFeatures }, credentials || { username, password });
	  const streamManagement = _streamManagement({
	    streamFeatures,
	    entity,
	    middleware,
	  });
	  const resourceBinding = _resourceBinding(
	    { iqCaller, streamFeatures },
	    resource,
	  );
	  const sessionEstablishment = _sessionEstablishment({
	    iqCaller,
	    streamFeatures,
	  });
	  // SASL mechanisms - order matters and define priority
	  const mechanisms = Object.entries({ plain, anonymous }).map(([k, v]) => ({
	    [k]: v(sasl),
	  }));

	  return Object.assign(entity, {
	    entity,
	    reconnect,
	    websocket,
	    middleware,
	    streamFeatures,
	    iqCaller,
	    iqCallee,
	    resolve,
	    sasl,
	    resourceBinding,
	    sessionEstablishment,
	    streamManagement,
	    mechanisms,
	  });
	}

	var xml_1 = xml$1;
	var client_1 = client;

	var debug$1 = {exports: {}};

	var _escape = _escape$3;

	function stringify$1(el, indent, level) {
	  if (typeof indent === "number") indent = " ".repeat(indent);
	  if (!level) level = 1;
	  let s = `<${el.name}`;

	  for (const k in el.attrs) {
	    const v = el.attrs[k];
	    // === null || undefined
	    if (v != null) {
	      s += ` ${k}="${_escape.escapeXML(typeof v === "string" ? v : v.toString(10))}"`;
	    }
	  }

	  if (el.children.length > 0) {
	    s += ">";
	    for (const child of el.children) {
	      if (child == null) continue;
	      if (indent) s += "\n" + indent.repeat(level);
	      s +=
	        typeof child === "string"
	          ? _escape.escapeXMLText(child)
	          : stringify$1(child, indent, level + 1);
	    }
	    if (indent) s += "\n" + indent.repeat(level - 1);
	    s += `</${el.name}>`;
	  } else {
	    s += "/>";
	  }

	  return s;
	}

	var stringify_1 = stringify$1;

	function clone$1(el) {
	  if (typeof el !== "object") return el;
	  const copy = new el.constructor(el.name, el.attrs);
	  for (let i = 0; i < el.children.length; i++) {
	    const child = el.children[i];
	    copy.cnode(clone$1(child));
	  }
	  return copy;
	}

	var clone_1 = clone$1;

	/* eslint no-console: 0 */

	const stringify = stringify_1;
	const xml = xmlExports;
	const clone = clone_1;

	const NS_SASL = "urn:ietf:params:xml:ns:xmpp-sasl";
	const NS_COMPONENT = "jabber:component:accept";

	const SENSITIVES = [
	  ["handshake", NS_COMPONENT],
	  ["auth", NS_SASL],
	  ["challenge", NS_SASL],
	  ["response", NS_SASL],
	  ["success", NS_SASL],
	];

	function isSensitive(element) {
	  if (element.children.length === 0) return false;
	  return SENSITIVES.some((sensitive) => {
	    return element.is(...sensitive);
	  });
	}

	function hideSensitive(element) {
	  if (isSensitive(element)) {
	    element.children = [];
	    element.append(xml("hidden", { xmlns: "xmpp.js" }));
	  }

	  return element;
	}

	function format(element) {
	  return stringify(hideSensitive(clone(element)));
	}

	debug$1.exports = function debug(entity, force) {
	  if (browser$1$1.env.XMPP_DEBUG || force === true) {
	    entity.on("element", (data) => {
	      console.debug(`IN\n${format(data)}`);
	    });

	    entity.on("send", (data) => {
	      console.debug(`OUT\n${format(data)}`);
	    });

	    entity.on("error", console.error);

	    entity.on("status", (status, value) => {
	      console.debug("status", status, value ? value.toString() : "");
	    });
	  }
	};

	debug$1.exports.hideSensitive = hideSensitive;

	var debugExports = debug$1.exports;
	var debug = /*@__PURE__*/getDefaultExportFromCjs(debugExports);

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

	const timeout = 5000;

	let xmpp = null;
	let iqCaller = null;

	const xmppStart = async (service, username, password) => {
	  return new Promise((resolve, reject) => {
	    const xmpp = client_1({
	      service,
	      username,
	      password
	    });
	    if (process.env.NODE_ENV !== 'production') {
	      debug(xmpp, true);
	    }
	    const { iqCaller } = xmpp;
	    xmpp.start();
	    xmpp.on('online', _ => {
	      resolve({ xmpp, iqCaller });
	    });
	    xmpp.on('error', error => {
	      reject(error);
	    });
	  })
	};

	/**
	 * Execute a fetch request
	 * @function
	 * @async
	 * @param {object} data                       - Data used in the request
	 * @param {string} data.id                    - The identifier of the targeted account
	 * @param {number} [data.fetcherTimeout]      - Optional timeout for the fetcher
	 * @param {object} opts                       - Options used to enable the request
	 * @param {object} opts.claims
	 * @param {object} opts.claims.xmpp
	 * @param {string} opts.claims.xmpp.service   - The server hostname on which the library can log in
	 * @param {string} opts.claims.xmpp.username  - The username used to log in
	 * @param {string} opts.claims.xmpp.password  - The password used to log in
	 * @returns {Promise<object>}
	 */
	async function fn (data, opts) {
	  try {
	    isFQDN(opts.claims.xmpp.service);
	    isAscii(opts.claims.xmpp.username);
	    isAscii(opts.claims.xmpp.password);
	  } catch (err) {
	    throw new Error(`XMPP fetcher was not set up properly (${err.message})`)
	  }

	  if (!xmpp || xmpp.status !== 'online') {
	    const xmppStartRes = await xmppStart(
	      opts.claims.xmpp.service,
	      opts.claims.xmpp.username,
	      opts.claims.xmpp.password
	    );
	    xmpp = xmppStartRes.xmpp;
	    iqCaller = xmppStartRes.iqCaller;
	  }

	  let timeoutHandle;
	  const timeoutPromise = new Promise((resolve, reject) => {
	    timeoutHandle = setTimeout(
	      () => reject(new Error('Request was timed out')),
	      data.fetcherTimeout ? data.fetcherTimeout : timeout
	    );
	  });

	  const fetchPromise = new Promise((resolve, reject) => {
	    (async () => {
	      let completed = false;
	      const proofs = [];

	      // Try the ariadne-id pubsub request
	      if (!completed) {
	        try {
	          const response = await iqCaller.request(
	            xml_1('iq', { type: 'get', to: data.id }, xml_1('pubsub', 'http://jabber.org/protocol/pubsub', xml_1('items', { node: 'http://ariadne.id/protocol/proof' }))),
	            30 * 1000
	          );

	          // Traverse the XML response
	          response.getChild('pubsub').getChildren('items').forEach(items => {
	            if (items.attrs.node === 'http://ariadne.id/protocol/proof') {
	              items.getChildren('item').forEach(item => {
	                proofs.push(item.getChildText('value'));
	              });
	            }
	          });

	          resolve(proofs);
	          completed = true;
	        } catch (_) {}
	      }

	      // Try the vcard4 pubsub request [backward compatibility]
	      if (!completed) {
	        try {
	          const response = await iqCaller.request(
	            xml_1('iq', { type: 'get', to: data.id }, xml_1('pubsub', 'http://jabber.org/protocol/pubsub', xml_1('items', { node: 'urn:xmpp:vcard4', max_items: '1' }))),
	            30 * 1000
	          );

	          // Traverse the XML response
	          response.getChild('pubsub').getChildren('items').forEach(items => {
	            if (items.attrs.node === 'urn:xmpp:vcard4') {
	              items.getChildren('item').forEach(item => {
	                if (item.attrs.id === 'current') {
	                  const itemVcard = item.getChild('vcard', 'urn:ietf:params:xml:ns:vcard-4.0');
	                  // Find the vCard URLs
	                  itemVcard.getChildren('url').forEach(url => {
	                    proofs.push(url.getChildText('uri'));
	                  });
	                  // Find the vCard notes
	                  itemVcard.getChildren('note').forEach(note => {
	                    proofs.push(note.getChildText('text'));
	                  });
	                }
	              });
	            }
	          });

	          resolve(proofs);
	          completed = true;
	        } catch (_) {}
	      }

	      // Try the vcard-temp IQ request [backward compatibility]
	      if (!completed) {
	        try {
	          const response = await iqCaller.request(
	            xml_1('iq', { type: 'get', to: data.id }, xml_1('vCard', 'vcard-temp')),
	            30 * 1000
	          );

	          // Find the vCard URLs
	          response.getChild('vCard', 'vcard-temp').getChildren('URL').forEach(url => {
	            proofs.push(url.children[0]);
	          });
	          // Find the vCard notes
	          response.getChild('vCard', 'vcard-temp').getChildren('NOTE').forEach(note => {
	            proofs.push(note.children[0]);
	          });
	          response.getChild('vCard', 'vcard-temp').getChildren('DESC').forEach(note => {
	            proofs.push(note.children[0]);
	          });

	          resolve(proofs);
	          completed = true;
	        } catch (error) {
	          reject(error);
	        }
	      }

	      xmpp.stop();
	    })();
	  });

	  return Promise.race([fetchPromise, timeoutPromise]).then((result) => {
	    clearTimeout(timeoutHandle);
	    return result
	  })
	}

	var xmpp$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fn: fn,
		timeout: timeout
	});

	exports.activitypub = activitypub;
	exports.dns = dns$1;
	exports.graphql = graphql;
	exports.http = http$2;
	exports.irc = irc;
	exports.matrix = matrix;
	exports.telegram = telegram;
	exports.xmpp = xmpp$1;

	return exports;

})({});
