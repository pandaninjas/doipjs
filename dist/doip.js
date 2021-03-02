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

},{}],4:[function(require,module,exports){
'use strict';

module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};

},{}],5:[function(require,module,exports){
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

},{"is-plain-obj":4}],6:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

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

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
module.exports={
  "name": "doipjs",
  "version": "0.10.5",
  "description": "Decentralized OpenPGP Identity Proofs library in Node.js",
  "main": "src/index.js",
  "dependencies": {
    "bent": "^7.3.12",
    "browserify": "^17.0.0",
    "merge-options": "^3.0.3",
    "openpgp": "^4.10.9",
    "prettier": "^2.1.2",
    "valid-url": "^1.0.9"
  },
  "devDependencies": {
    "browserify-shim": "^3.8.14",
    "chai": "^4.2.0",
    "chai-as-promised": "^7.1.1",
    "chai-match-pattern": "^1.2.0",
    "license-check-and-add": "^3.0.4",
    "minify": "^6.0.1",
    "mocha": "^8.2.0"
  },
  "scripts": {
    "release:bundle": "./node_modules/browserify/bin/cmd.js ./src/index.js --standalone doip -x openpgp -o ./dist/doip.js",
    "release:minify": "./node_modules/minify/bin/minify.js ./dist/doip.js > ./dist/doip.min.js",
    "prettier:check": "./node_modules/prettier/bin-prettier.js --check .",
    "prettier:write": "./node_modules/prettier/bin-prettier.js --write .",
    "license:check": "./node_modules/license-check-and-add/dist/src/cli.js check",
    "license:add": "./node_modules/license-check-and-add/dist/src/cli.js add",
    "license:remove": "./node_modules/license-check-and-add/dist/src/cli.js remove",
    "docs": "docsify serve ./docs",
    "test": "./node_modules/mocha/bin/mocha"
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

},{}],10:[function(require,module,exports){
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
const path = require('path')
const mergeOptions = require('merge-options')
const validUrl = require('valid-url')
const openpgp = (typeof window !== "undefined" ? window['openpgp'] : typeof global !== "undefined" ? global['openpgp'] : null)
const serviceproviders = require('./serviceproviders')
const keys = require('./keys')
const utils = require('./utils')

// Promise.allSettled polyfill
Promise.allSettled =
  Promise.allSettled ||
  ((promises) =>
    Promise.all(
      promises.map((p) =>
        p
          .then((v) => ({
            status: 'fulfilled',
            value: v,
          }))
          .catch((e) => ({
            status: 'rejected',
            reason: e,
          }))
      )
    ))

const runVerificationJson = (
  res,
  proofData,
  checkPath,
  checkClaim,
  checkRelation
) => {
  let re

  if (res.isVerified || !proofData) {
    return res
  }

  if (Array.isArray(proofData)) {
    proofData.forEach((item, i) => {
      res = runVerificationJson(res, item, checkPath, checkClaim, checkRelation)
    })
    return res
  }

  if (checkPath.length == 0) {
    switch (checkRelation) {
      default:
      case 'contains':
        re = new RegExp(checkClaim, 'gi')
        res.isVerified = re.test(proofData.replace(/\r?\n|\r|\\/g, ''))
        break
      case 'equals':
        res.isVerified =
          proofData.replace(/\r?\n|\r|\\/g, '').toLowerCase() ==
          checkClaim.toLowerCase()
        break
      case 'oneOf':
        re = new RegExp(checkClaim, 'gi')
        res.isVerified = re.test(proofData.join('|'))
        break
    }
    return res
  }

  try {
    checkPath[0] in proofData
  } catch (e) {
    res.errors.push('err_data_structure_incorrect')
    return res
  }

  res = runVerificationJson(
    res,
    proofData[checkPath[0]],
    checkPath.slice(1),
    checkClaim,
    checkRelation
  )
  return res
}

const runVerification = (proofData, spData) => {
  let res = {
    isVerified: false,
    errors: [],
  }

  switch (spData.proof.format) {
    case 'json':
      res = runVerificationJson(
        res,
        proofData,
        spData.claim.path,
        utils.generateClaim(spData.claim.fingerprint, spData.claim.format),
        spData.claim.relation
      )
      break
    case 'text':
      re = new RegExp(
        utils.generateClaim(spData.claim.fingerprint, spData.claim.format),
        'gi'
      )
      res.isVerified = re.test(proofData.replace(/\r?\n|\r/, ''))
      break
  }

  return res
}

const verify = async (input, fingerprint, opts) => {
  if (input instanceof openpgp.key.Key) {
    const fingerprintFromKey = await keys.getFingerprint(input)
    const userData = await keys.getUserData(input)

    const promises = userData.map(async (user, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await verify(user.notations, fingerprintFromKey, opts)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })

    return Promise.allSettled(promises).then((values) => {
      return values.map((obj, i) => {
        if (obj.status == 'fulfilled') {
          return obj.value
        } else {
          return obj.reason
        }
      })
    })
  }
  if (input instanceof Array) {
    const promises = input.map(async (uri, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await verify(uri, fingerprint, opts)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })

    return Promise.allSettled(promises).then((values) => {
      return values.map((obj, i) => {
        if (obj.status == 'fulfilled') {
          return obj.value
        } else {
          return obj.reason
        }
      })
    })
  }

  const promiseClaim = new Promise(async (resolve, reject) => {
    let objResult = {
      isVerified: false,
      errors: [],
      serviceproviderData: undefined,
    }

    const uri = input.replace(/^\s+|\s+$/g, '')

    if (!fingerprint) {
      fingerprint = null
    }

    const defaultOpts = {
      returnMatchesOnly: false,
      proxyPolicy: 'adaptive',
      doipProxyHostname: 'proxy.keyoxide.org',
      twitterBearerToken: null,
      nitterInstance: null,
    }
    opts = mergeOptions(defaultOpts, opts ? opts : {})

    if (!validUrl.isUri(uri)) {
      objResult.errors.push('invalid_uri')
      reject(objResult)
      return
    }

    const spMatches = serviceproviders.match(uri, opts)

    if ('returnMatchesOnly' in opts && opts.returnMatchesOnly) {
      resolve(spMatches)
      return
    }

    let claimVerificationDone = false,
      claimVerificationResult,
      sp,
      iSp = 0,
      res,
      proofData,
      spData

    while (!claimVerificationDone && iSp < spMatches.length) {
      spData = spMatches[iSp]
      spData.claim.fingerprint = fingerprint

      res = null

      if (spData.customRequestHandler instanceof Function) {
        try {
          proofData = await spData.customRequestHandler(spData, opts)
        } catch (e) {
          objResult.errors.push('custom_request_handler_failed')
        }
      } else {
        switch (opts.proxyPolicy) {
          case 'adaptive':
            if (spData.proof.useProxy) {
              try {
                proofData = await serviceproviders.proxyRequestHandler(
                  spData,
                  opts
                )
              } catch (er) {}
            } else {
              try {
                proofData = await serviceproviders.directRequestHandler(
                  spData,
                  opts
                )
              } catch (er) {}
              if (!proofData) {
                try {
                  proofData = await serviceproviders.proxyRequestHandler(
                    spData,
                    opts
                  )
                } catch (er) {}
              }
            }
            break
          case 'fallback':
            try {
              proofData = await serviceproviders.directRequestHandler(
                spData,
                opts
              )
            } catch (er) {}
            if (!proofData) {
              try {
                proofData = await serviceproviders.proxyRequestHandler(
                  spData,
                  opts
                )
              } catch (er) {}
            }
            break
          case 'always':
            try {
              proofData = await serviceproviders.proxyRequestHandler(
                spData,
                opts
              )
            } catch (er) {}
            break
          case 'never':
            try {
              proofData = await serviceproviders.directRequestHandler(
                spData,
                opts
              )
            } catch (er) {}
            break
          default:
            objResult.errors.push('invalid_proxy_policy')
        }
      }

      if (proofData) {
        claimVerificationResult = runVerification(proofData, spData)

        if (claimVerificationResult.errors.length == 0) {
          claimVerificationDone = true
        }
      } else {
        objResult.errors.push('unsuccessful_claim_verification')
      }

      iSp++
    }

    if (!claimVerificationResult) {
      claimVerificationResult = {
        isVerified: false,
      }
    }

    objResult.isVerified = claimVerificationResult.isVerified
    objResult.serviceproviderData = spData
    resolve(objResult)
    return
  })

  const promiseTimeout = new Promise((resolve) => {
    const objResult = {
      isVerified: false,
      errors: ['verification_timed_out'],
      serviceproviderData: undefined,
    }
    setTimeout(() => {
      resolve(objResult)
      return
    }, 3000)
  })

  return await Promise.race([promiseClaim, promiseTimeout])
}

exports.verify = verify

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":12,"./serviceproviders":13,"./utils":30,"merge-options":5,"path":6,"valid-url":8}],11:[function(require,module,exports){
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
const claims = require('./claims')
const keys = require('./keys')
const signatures = require('./signatures')
const serviceproviders = require('./serviceproviders')
const utils = require('./utils')

exports.claims = claims
exports.keys = keys
exports.signatures = signatures
exports.serviceproviders = serviceproviders
exports.utils = utils

},{"./claims":10,"./keys":12,"./serviceproviders":13,"./signatures":29,"./utils":30}],12:[function(require,module,exports){
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
const path = require('path')
const bent = require('bent')
const req = bent('GET')
const validUrl = require('valid-url')
const openpgp = (typeof window !== "undefined" ? window['openpgp'] : typeof global !== "undefined" ? global['openpgp'] : null)
const mergeOptions = require('merge-options')

const fetchHKP = (identifier, keyserverBaseUrl) => {
  return new Promise(async (resolve, reject) => {
    keyserverBaseUrl = keyserverBaseUrl
      ? `https://${keyserverBaseUrl}`
      : 'https://keys.openpgp.org'

    const hkp = new openpgp.HKP(keyserverBaseUrl)
    const lookupOpts = {
      query: identifier,
    }

    let publicKey = await hkp.lookup(lookupOpts).catch((error) => {
      reject('Key does not exist or could not be fetched')
    })

    publicKey = await openpgp.key
      .readArmored(publicKey)
      .then((result) => {
        return result.keys[0]
      })
      .catch((error) => {
        return null
      })

    if (publicKey) {
      resolve(publicKey)
    } else {
      reject('Key does not exist or could not be fetched')
    }
  })
}

const fetchWKD = (identifier) => {
  return new Promise(async (resolve, reject) => {
    const wkd = new openpgp.WKD()
    const lookupOpts = {
      email: identifier,
    }

    const publicKey = await wkd
      .lookup(lookupOpts)
      .then((result) => {
        return result.keys[0]
      })
      .catch((error) => {
        return null
      })

    if (publicKey) {
      resolve(publicKey)
    } else {
      reject('Key does not exist or could not be fetched')
    }
  })
}

const fetchKeybase = (username, fingerprint) => {
  return new Promise(async (resolve, reject) => {
    const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`
    try {
      const rawKeyContent = await req(opts.keyLink)
        .then((response) => {
          if (response.status === 200) {
            return response
          }
        })
        .then((response) => response.text())
    } catch (e) {
      reject(`Error fetching Keybase key: ${e.message}`)
    }

    const publicKey = await openpgp.key
      .readArmored(rawKeyContent)
      .then((result) => {
        return result.keys[0]
      })
      .catch((error) => {
        return null
      })

    if (publicKey) {
      resolve(publicKey)
    } else {
      reject('Key does not exist or could not be fetched')
    }
  })
}

const fetchPlaintext = (rawKeyContent) => {
  return new Promise(async (resolve, reject) => {
    const publicKey = (await openpgp.key.readArmored(rawKeyContent)).keys[0]

    resolve(publicKey)
  })
}

const fetchSignature = (rawSignatureContent, keyserverBaseUrl) => {
  return new Promise(async (resolve, reject) => {
    let sig = await openpgp.signature.readArmored(rawSignatureContent)
    if ('compressed' in sig.packets[0]) {
      sig = sig.packets[0]
      let sigContent = await openpgp.stream.readToEnd(
        await sig.packets[1].getText()
      )
    }
    const sigUserId = sig.packets[0].signersUserId
    const sigKeyId = await sig.packets[0].issuerKeyId.toHex()

    resolve(fetchHKP(sigUserId ? sigUserId : sigKeyId, keyserverBaseUrl))
  })
}

const fetchURI = (uri) => {
  return new Promise(async (resolve, reject) => {
    if (!validUrl.isUri(uri)) {
      reject('Invalid URI')
    }

    const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+\-]*)(?:\:([a-zA-Z0-9@._=+\-]*))?/
    const match = uri.match(re)

    if (!match[1]) {
      reject('Invalid URI')
    }

    switch (match[1]) {
      case 'hkp':
        resolve(
          fetchHKP(match[3] ? match[3] : match[2], match[3] ? match[2] : null)
        )
        break
      case 'wkd':
        resolve(fetchWKD(match[2]))
        break
      case 'kb':
        resolve(fetchKeybase(match[2], match.length >= 4 ? match[3] : null))
        break
      default:
        reject('Invalid URI protocol')
        break
    }
  })
}

const process = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    if (!publicKey) {
      reject('Invalid public key')
    }
    const fingerprint = await publicKey.primaryKey.getFingerprint()
    const primaryUser = await publicKey.getPrimaryUser()
    const users = publicKey.users
    let primaryUserIndex,
      usersOutput = []

    users.forEach((user, i) => {
      usersOutput[i] = {
        userData: {
          id: user.userId ? user.userId.userid : null,
          name: user.userId ? user.userId.name : null,
          email: user.userId ? user.userId.email : null,
          comment: user.userId ? user.userId.comment : null,
          isPrimary: primaryUser.index === i,
        },
      }

      if ('selfCertifications' in user && user.selfCertifications.length > 0) {
        const notations = user.selfCertifications[0].rawNotations
        usersOutput[i].notations = notations.map(
          ({ name, value, humanReadable }) => {
            if (humanReadable && name === 'proof@metacode.biz') {
              return openpgp.util.decode_utf8(value)
            }
          }
        )
      } else {
        usersOutput[i].notations = []
      }
    })

    resolve({
      fingerprint: fingerprint,
      users: usersOutput,
      primaryUserIndex: primaryUser.index,
    })
  })
}

const getUserData = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    const keyData = await process(publicKey)

    resolve(keyData.users)
  })
}

const getFingerprint = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    const keyData = await process(publicKey)

    resolve(keyData.fingerprint)
  })
}

exports.fetch = {
  uri: fetchURI,
  hkp: fetchHKP,
  wkd: fetchWKD,
  keybase: fetchKeybase,
  plaintext: fetchPlaintext,
  signature: fetchSignature,
}
exports.process = process
exports.getUserData = getUserData
exports.getFingerprint = getFingerprint

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"bent":1,"merge-options":5,"path":6,"valid-url":8}],13:[function(require,module,exports){
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
const bent = require('bent')
const req = bent('GET')
const utils = require('./utils')

const list = [
  'dns',
  'xmpp',
  'twitter',
  'reddit',
  'liberapay',
  'hackernews',
  'lobsters',
  'devto',
  'gitea',
  'gitlab',
  'github',
  'mastodon',
  'fediverse',
  'discourse',
  'owncast',
]

const data = {
  dns: require('./serviceproviders/dns'),
  xmpp: require('./serviceproviders/xmpp'),
  twitter: require('./serviceproviders/twitter'),
  reddit: require('./serviceproviders/reddit'),
  liberapay: require('./serviceproviders/liberapay'),
  hackernews: require('./serviceproviders/hackernews'),
  lobsters: require('./serviceproviders/lobsters'),
  devto: require('./serviceproviders/devto'),
  gitea: require('./serviceproviders/gitea'),
  gitlab: require('./serviceproviders/gitlab'),
  github: require('./serviceproviders/github'),
  mastodon: require('./serviceproviders/mastodon'),
  fediverse: require('./serviceproviders/fediverse'),
  discourse: require('./serviceproviders/discourse'),
  owncast: require('./serviceproviders/owncast'),
}

const match = (uri, opts) => {
  let matches = [],
    sp

  list.forEach((spName, i) => {
    sp = data[spName]
    if (sp.reURI.test(uri)) {
      matches.push(sp.processURI(uri, opts))
    }
  })

  return matches
}

const directRequestHandler = (spData, opts) => {
  return new Promise(async (resolve, reject) => {
    const url = spData.proof.fetch ? spData.proof.fetch : spData.proof.uri
    let res

    switch (spData.proof.format) {
      case 'json':
        req(url, null, {
          Accept: 'application/json',
          'User-Agent': `doipjs/${require('../package.json').version}`,
        })
          .then(async (res) => {
            return await res.json()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
        break
      case 'text':
        req(url)
          .then(async (res) => {
            return await res.text()
          })
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
        break
      default:
        reject('No specified proof data format')
        break
    }
  })
}

const proxyRequestHandler = (spData, opts) => {
  return new Promise(async (resolve, reject) => {
    const url = spData.proof.fetch ? spData.proof.fetch : spData.proof.uri
    req(utils.generateProxyURL(spData.proof.format, url, opts), null, {
      Accept: 'application/json',
    })
      .then(async (res) => {
        return await res.json()
      })
      .then((res) => {
        resolve(res.content)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

exports.list = list
exports.data = data
exports.match = match
exports.directRequestHandler = directRequestHandler
exports.proxyRequestHandler = proxyRequestHandler

},{"../package.json":9,"./serviceproviders/devto":14,"./serviceproviders/discourse":15,"./serviceproviders/dns":16,"./serviceproviders/fediverse":17,"./serviceproviders/gitea":18,"./serviceproviders/github":19,"./serviceproviders/gitlab":20,"./serviceproviders/hackernews":21,"./serviceproviders/liberapay":22,"./serviceproviders/lobsters":23,"./serviceproviders/mastodon":24,"./serviceproviders/owncast":25,"./serviceproviders/reddit":26,"./serviceproviders/twitter":27,"./serviceproviders/xmpp":28,"./utils":30,"bent":1}],14:[function(require,module,exports){
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
const reURI = /^https:\/\/dev\.to\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'devto',
    },
    profile: {
      display: match[1],
      uri: `https://dev.to/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://dev.to/api/articles/${match[1]}/${match[2]}`,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['body_markdown'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://dev.to/alice/post',
    shouldMatch: true,
  },
  {
    uri: 'https://dev.to/alice/post/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/post',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],15:[function(require,module,exports){
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
const reURI = /^https:\/\/(.*)\/u\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'discourse',
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: uri,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://${match[1]}/u/${match[2]}.json`,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['user', 'bio_raw'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/u/alice',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/u/alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],16:[function(require,module,exports){
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
const dns = require('dns')
const bent = require('bent')
const req = bent('GET')
const utils = require('../utils')
const reURI = /^dns:([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const customRequestHandler = async (spData, opts) => {
  if ('resolveTxt' in dns) {
    const prom = async () => {
      return new Promise((resolve, reject) => {
        dns.resolveTxt(spData.profile.display, (err, records) => {
          if (err) reject(err)
          resolve(records)
        })
      })
    }
    return {
      hostname: spData.profile.display,
      records: {
        txt: await prom(),
      },
    }
  } else {
    const res = await req(spData.proof.uri, null, {
      Accept: 'application/json',
    })
    const json = await res.json()
    return json
  }
}

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'dns',
    },
    profile: {
      display: match[1],
      uri: `https://${match[1]}`,
      qr: null,
    },
    proof: {
      uri: utils.generateProxyURL('dns', match[1], opts),
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['records', 'txt'],
      relation: 'contains',
    },
    customRequestHandler: customRequestHandler,
  }
}

const tests = [
  {
    uri: 'dns:domain.org',
    shouldMatch: true,
  },
  {
    uri: 'dns:domain.org?type=TXT',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../utils":30,"bent":1,"dns":3}],17:[function(require,module,exports){
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
const reURI = /^https:\/\/(.*)\/users\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'fediverse',
    },
    profile: {
      display: `@${match[2]}@${match[1]}`,
      uri: uri,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'fingerprint',
      path: ['summary'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/users/alice',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/users/alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],18:[function(require,module,exports){
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
const reURI = /^https:\/\/(.*)\/(.*)\/gitea_proof\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitea',
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://${match[1]}/api/v1/repos/${match[2]}/gitea_proof`,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['description'],
      relation: 'equals',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/alice/gitea_proof',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/gitea_proof/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/other_proof',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],19:[function(require,module,exports){
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
const reURI = /^https:\/\/gist\.github\.com\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'github',
    },
    profile: {
      display: match[1],
      uri: `https://github.com/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://api.github.com/gists/${match[2]}`,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['files', 'openpgp.md', 'content'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://gist.github.com/Alice/123456789',
    shouldMatch: true,
  },
  {
    uri: 'https://gist.github.com/Alice/123456789/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/Alice/123456789',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],20:[function(require,module,exports){
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
const bent = require('bent')
const req = bent('GET')

const reURI = /^https:\/\/(.*)\/(.*)\/gitlab_proof\/?/

const customRequestHandler = async (spData, opts) => {
  const match = spData.proof.uri.match(reURI)

  const urlUser = `https://${match[1]}/api/v4/users?username=${match[2]}`
  let resUser
  try {
    resUser = await req(urlUser, null, { Accept: 'application/json' })
  } catch (e) {
    resUser = await req(utils.generateProxyURL('web', urlUser, opts), null, {
      Accept: 'application/json',
    })
  }
  const jsonUser = await resUser.json()

  const user = jsonUser.find((user) => user.username === match[2])
  if (!user) {
    throw new Error(`No user with username ${match[2]}`)
  }

  const urlProject = `https://${match[1]}/api/v4/users/${user.id}/projects`
  let resProject
  try {
    resProject = await req(urlProject, null, { Accept: 'application/json' })
  } catch (e) {
    resProject = await req(
      utils.generateProxyURL('web', urlProject, opts),
      null,
      { Accept: 'application/json' }
    )
  }
  const jsonProject = await resProject.json()

  const project = jsonProject.find((proj) => proj.path === 'gitlab_proof')
  if (!project) {
    throw new Error(`No project at ${spData.proof.uri}`)
  }

  return project
}

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'gitlab',
    },
    profile: {
      display: `${match[2]}@${match[1]}`,
      uri: `https://${match[1]}/${match[2]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['description'],
      relation: 'equals',
    },
    customRequestHandler: customRequestHandler,
  }
}

const tests = [
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof',
    shouldMatch: true,
  },
  {
    uri: 'https://gitlab.domain.org/alice/gitlab_proof/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/other_proof',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"bent":1}],21:[function(require,module,exports){
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
const reURI = /^https:\/\/news\.ycombinator\.com\/user\?id=(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'hackernews',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
      fetch: null,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'uri',
      path: ['about'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://news.ycombinator.com/user?id=Alice',
    shouldMatch: true,
  },
  {
    uri: 'https://news.ycombinator.com/user?id=Alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/user?id=Alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],22:[function(require,module,exports){
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
const reURI = /^https:\/\/liberapay\.com\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'liberapay',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://liberapay.com/${match[1]}/public.json`,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['statements', 'content'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://liberapay.com/alice',
    shouldMatch: true,
  },
  {
    uri: 'https://liberapay.com/alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],23:[function(require,module,exports){
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
const reURI = /^https:\/\/lobste\.rs\/u\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'lobsters',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: `https://lobste.rs/u/${match[1]}.json`,
      fetch: null,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['about'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://lobste.rs/u/Alice',
    shouldMatch: true,
  },
  {
    uri: 'https://lobste.rs/u/Alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/u/Alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],24:[function(require,module,exports){
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
const reURI = /^https:\/\/(.*)\/@(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'mastodon',
    },
    profile: {
      display: `@${match[2]}@${match[1]}`,
      uri: uri,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'fingerprint',
      path: ['attachment', 'value'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://domain.org/@alice',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/@alice/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],25:[function(require,module,exports){
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
const bent = require('bent')
const req = bent('GET')

const reURI = /^https:\/\/(.*)/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'owncast',
    },
    profile: {
      display: match[1],
      uri: uri,
      qr: null,
    },
    proof: {
      uri: `${uri}/api/config`,
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'fingerprint',
      path: ['socialHandles', 'url'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://live.domain.org',
    shouldMatch: true,
  },
  {
    uri: 'https://live.domain.org/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/live',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/live/',
    shouldMatch: true,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"bent":1}],26:[function(require,module,exports){
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
const reURI = /^https:\/\/(?:www\.)?reddit\.com\/user\/(.*)\/comments\/(.*)\/(.*)\/?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'reddit',
    },
    profile: {
      display: match[1],
      uri: `https://www.reddit.com/user/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: `https://www.reddit.com/user/${match[1]}/comments/${match[2]}.json`,
      useProxy: true,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: ['data', 'children', 'data', 'selftext'],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true,
  },
  {
    uri: 'https://www.reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true,
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post',
    shouldMatch: true,
  },
  {
    uri: 'https://reddit.com/user/Alice/comments/123456/post/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/user/Alice/comments/123456/post',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{}],27:[function(require,module,exports){
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
const bent = require('bent')
const req = bent('GET')
const serviceproviders = require('../serviceproviders')
const utils = require('../utils')
const reURI = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/

const customRequestHandler = async (spData, opts) => {
  const match = spData.proof.uri.match(reURI)

  // Attempt direct verification if policy allows it
  if (opts.proxyPolicy !== 'always') {
    if ('twitterBearerToken' in opts && opts.twitterBearerToken) {
      const res = await req(`https://api.twitter.com/1.1/statuses/show.json?id=${match[2]}`, null, {
        Accept: 'application/json',
        Authorization: `Bearer ${opts.twitterBearerToken}`
      })
      const json = await res.json()
      return json.text
    } else if ('nitterInstance' in opts && opts.nitterInstance) {
      spData.proof.fetch = `https://${opts.nitterInstance}/${match[1]}/status/${match[2]}`
      const res = await serviceproviders.proxyRequestHandler(spData, opts)
      return res
    }
  }

  // Attempt proxy verification if policy allows it
  if (opts.proxyPolicy !== 'never' && spData.proof.fetch) {
    return req(utils.generateProxyURL('twitter', match[2], opts), null, {
      Accept: 'application/json',
    })
    .then(async (res) => {
      return await res.json()
    })
    .then((res) => {
      return res.data.text
    })
    .catch((e) => {
      reject(e)
    })
  }

  // No verification
  return null
}

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'web',
      name: 'twitter',
    },
    profile: {
      display: `@${match[1]}`,
      uri: `https://twitter.com/${match[1]}`,
      qr: null,
    },
    proof: {
      uri: uri,
      fetch: utils.generateProxyURL('twitter', match[2], opts),
      useProxy: false,
      format: 'text',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: [],
      relation: 'contains',
    },
    customRequestHandler: customRequestHandler,
  }
}

const tests = [
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789',
    shouldMatch: true,
  },
  {
    uri: 'https://twitter.com/alice/status/1234567890123456789/',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org/alice/status/1234567890123456789',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../serviceproviders":13,"../utils":30,"bent":1}],28:[function(require,module,exports){
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
const utils = require('../utils')
const reURI = /^xmpp:([a-zA-Z0-9\.\-\_]*)@([a-zA-Z0-9\.\-\_]*)(?:\?(.*))?/

const processURI = (uri, opts) => {
  if (!opts) {
    opts = {}
  }
  const match = uri.match(reURI)

  return {
    serviceprovider: {
      type: 'communication',
      name: 'xmpp',
    },
    profile: {
      display: `${match[1]}@${match[2]}`,
      uri: uri,
      qr: uri,
    },
    proof: {
      uri: utils.generateProxyURL('xmpp', `${match[1]}@${match[2]}`, opts),
      fetch: null,
      useProxy: false,
      format: 'json',
    },
    claim: {
      fingerprint: null,
      format: 'message',
      path: [],
      relation: 'contains',
    },
    customRequestHandler: null,
  }
}

const tests = [
  {
    uri: 'xmpp:alice@domain.org',
    shouldMatch: true,
  },
  {
    uri: 'xmpp:alice@domain.org?omemo-sid-123456789=A1B2C3D4E5F6G7H8I9',
    shouldMatch: true,
  },
  {
    uri: 'https://domain.org',
    shouldMatch: false,
  },
]

exports.reURI = reURI
exports.processURI = processURI
exports.tests = tests

},{"../utils":30}],29:[function(require,module,exports){
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
const mergeOptions = require('merge-options')
const claims = require('./claims')
const keys = require('./keys')

const verify = (signature, opts) => {
  return new Promise(async (resolve, reject) => {
    let errors = [],
      sigData

    try {
      sigData = await openpgp.cleartext.readArmored(signature)
    } catch (error) {
      errors.push('invalid_signature')
      reject({ errors: errors })
      return
    }

    const issuerKeyId = sigData.signature.packets[0].issuerKeyId.toHex()
    const signersUserId = sigData.signature.packets[0].signersUserId
    const preferredKeyServer =
      sigData.signature.packets[0].preferredKeyServer ||
      'https://keys.openpgp.org/'
    const text = sigData.getText()
    let sigKeys = []
    let sigClaims = []

    text.split('\n').forEach((line, i) => {
      const match = line.match(/^([a-zA-Z0-9]*)\=(.*)$/i)
      if (!match) {
        return
      }
      switch (match[1].toLowerCase()) {
        case 'key':
          sigKeys.push(match[2])
          break

        case 'proof':
          sigClaims.push(match[2])
          break

        default:
          break
      }
    })

    let keyData, keyUri

    // Try overruling key
    if (sigKeys.length > 0) {
      try {
        keyUri = sigKeys[0]
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {}
    }
    // Try WKD
    if (!keyData && signersUserId) {
      try {
        keyUri = `wkd:${signersUserId}`
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {}
    }
    // Try HKP
    if (!keyData) {
      try {
        const match = preferredKeyServer.match(/^(.*\:\/\/)?([^/]*)(?:\/)?$/i)
        keyUri = `hkp:${match[2]}:${issuerKeyId ? issuerKeyId : signersUserId}`
        keyData = await keys.fetch.uri(keyUri)
      } catch (e) {
        errors.push('key_not_found')
        reject({ errors: errors })
        return
      }
    }

    const fingerprint = keyData.keyPacket.getFingerprint()

    try {
      const sigVerification = await sigData.verify([keyData])
      await sigVerification[0].verified
    } catch (e) {
      errors.push('invalid_signature_verification')
      reject({ errors: errors })
      return
    }

    const claimVerifications = await claims.verify(sigClaims, fingerprint, opts)

    resolve({
      errors: errors,
      signature: {
        data: sigData.signature,
        issuerKeyId: issuerKeyId,
        signersUserId: signersUserId,
        preferredKeyServer: preferredKeyServer,
      },
      publicKey: {
        data: keyData,
        uri: keyUri,
        fingerprint: fingerprint,
      },
      text: text,
      claims: claimVerifications,
    })
  })
}

exports.verify = verify

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./claims":10,"./keys":12,"merge-options":5}],30:[function(require,module,exports){
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
const generateProxyURL = (type, url, opts) => {
  if (!opts || !opts.doipProxyHostname) {
    return null
  }
  let addParam = ''
  if (type == 'xmpp') {
    addParam += '/DESC'
  }
  return `https://${
    opts.doipProxyHostname
  }/api/1/get/${type}/${encodeURIComponent(url)}${addParam}`
}

const generateClaim = (fingerprint, format) => {
  switch (format) {
    case 'uri':
      return `openpgp4fpr:${fingerprint}`
      break
    case 'message':
      return `[Verifying my OpenPGP key: openpgp4fpr:${fingerprint}]`
      break
    case 'fingerprint':
      return fingerprint
      break
    default:
      throw new Error('No valid claim format')
  }
}

exports.generateProxyURL = generateProxyURL
exports.generateClaim = generateClaim

},{}]},{},[11])(11)
});
