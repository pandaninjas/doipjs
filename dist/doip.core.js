var doip = (function (exports, openpgp$1, fetcher) {
  'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var fetcher__namespace = /*#__PURE__*/_interopNamespaceDefault(fetcher);

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
  };

  /**
   * Methods for fetching proofs
   * @readonly
   * @enum {string}
   */
  const Fetcher = {
    /** HTTP requests to ActivityPub */
    ACTIVITYPUB: 'activitypub',
    /** DNS module from Node.js */
    DNS: 'dns',
    /** GraphQL over HTTP requests */
    GRAPHQL: 'graphql',
    /** Basic HTTP requests */
    HTTP: 'http',
    /** IRC module from Node.js */
    IRC: 'irc',
    /** HTTP request to Matrix API */
    MATRIX: 'matrix',
    /** HTTP request to Telegram API */
    TELEGRAM: 'telegram',
    /** XMPP module from Node.js */
    XMPP: 'xmpp'
  };

  /**
   * Entity encoding format
   * @readonly
   * @enum {string}
   */
  const EntityEncodingFormat = {
    /** No special formatting */
    PLAIN: 'plain',
    /** HTML encoded entities */
    HTML: 'html',
    /** XML encoded entities */
    XML: 'xml'
  };

  /**
   * Levels of access restriction for proof fetching
   * @readonly
   * @enum {string}
   */
  const ProofAccessRestriction = {
    /** Any HTTP request will work */
    NONE: 'none',
    /** CORS requests are denied */
    NOCORS: 'nocors',
    /** HTTP requests must contain API or access tokens */
    GRANTED: 'granted',
    /** Not accessible by HTTP request, needs server software */
    SERVER: 'server'
  };

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

  /**
   * Format of claim
   * @readonly
   * @enum {string}
   */
  const ClaimFormat = {
    /** `openpgp4fpr:123123123` */
    URI: 'uri',
    /** `123123123` */
    FINGERPRINT: 'fingerprint'
  };

  /**
   * How to find the claim inside the proof's JSON data
   * @readonly
   * @enum {string}
   */
  const ClaimRelation = {
    /** Claim is somewhere in the JSON field's textual content */
    CONTAINS: 'contains',
    /** Claim is equal to the JSON field's textual content */
    EQUALS: 'equals',
    /** Claim is equal to an element of the JSON field's array of strings */
    ONEOF: 'oneof'
  };

  /**
   * Status of the Claim instance
   * @readonly
   * @enum {number}
   */
  const ClaimStatus = {
    /** Claim has been initialized */
    INIT: 100,
    /** Claim has matched its URI to candidate claim definitions */
    MATCHED: 101,
    /** Claim was successfully verified */
    VERIFIED: 200,
    /** Claim was successfully verified using proxied data */
    VERIFIED_VIA_PROXY: 201,
    /** Unknown matching error */
    MATCHING_ERROR: 300,
    /** No matched service providers */
    NO_MATCHES: 301,
    /** Unknown matching error */
    VERIFICATION_ERROR: 400,
    /** No proof found in data returned by service providers */
    NO_PROOF_FOUND: 401
  };

  /**
   * Profile type
   * @readonly
   * @enum {string}
   */
  const ProfileType = {
    /** ASP profile */
    ASP: 'asp',
    /** OpenPGP profile */
    OPENPGP: 'openpgp'
  };

  /**
   * Public key type
   * @readonly
   * @enum {string}
   */
  const PublicKeyType = {
    EDDSA: 'eddsa',
    ES256: 'es256',
    OPENPGP: 'openpgp',
    UNKNOWN: 'unknown',
    NONE: 'none'
  };

  /**
   * Public key format
   * @readonly
   * @enum {string}
   */
  const PublicKeyEncoding = {
    PEM: 'pem',
    JWK: 'jwk',
    ARMORED_PGP: 'armored_pgp',
    NONE: 'none'
  };

  /**
   * Method to fetch the public key
   * @readonly
   * @enum {string}
   */
  const PublicKeyFetchMethod = {
    ASPE: 'aspe',
    HKP: 'hkp',
    WKD: 'wkd',
    HTTP: 'http',
    NONE: 'none'
  };

  var enums = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ClaimFormat: ClaimFormat,
    ClaimRelation: ClaimRelation,
    ClaimStatus: ClaimStatus,
    EntityEncodingFormat: EntityEncodingFormat,
    Fetcher: Fetcher,
    ProfileType: ProfileType,
    ProofAccessRestriction: ProofAccessRestriction,
    ProofFormat: ProofFormat,
    ProxyPolicy: ProxyPolicy,
    PublicKeyEncoding: PublicKeyEncoding,
    PublicKeyFetchMethod: PublicKeyFetchMethod,
    PublicKeyType: PublicKeyType
  });

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

  var isAlphanumeric$1 = {};

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

  var alpha$2 = {};

  Object.defineProperty(alpha$2, "__esModule", {
    value: true
  });
  alpha$2.commaDecimal = alpha$2.dotDecimal = alpha$2.bengaliLocales = alpha$2.farsiLocales = alpha$2.arabicLocales = alpha$2.englishLocales = alpha$2.decimal = alpha$2.alphanumeric = alpha$2.alpha = void 0;
  var alpha$1 = {
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
    'ja-JP': /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
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
    'ko-KR': /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
    'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
    he: /^[א-ת]+$/,
    fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
    bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
    'hi-IN': /^[\u0900-\u0961]+[\u0972-\u097F]*$/i,
    'si-LK': /^[\u0D80-\u0DFF]+$/
  };
  alpha$2.alpha = alpha$1;
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
    'ja-JP': /^[0-9０-９ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
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
    'ko-KR': /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
    'ku-IQ': /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
    'vi-VN': /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
    he: /^[0-9א-ת]+$/,
    fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
    bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ০১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
    'hi-IN': /^[\u0900-\u0963]+[\u0966-\u097F]*$/i,
    'si-LK': /^[0-9\u0D80-\u0DFF]+$/
  };
  alpha$2.alphanumeric = alphanumeric;
  var decimal = {
    'en-US': '.',
    ar: '٫'
  };
  alpha$2.decimal = decimal;
  var englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];
  alpha$2.englishLocales = englishLocales;

  for (var locale, i = 0; i < englishLocales.length; i++) {
    locale = "en-".concat(englishLocales[i]);
    alpha$1[locale] = alpha$1['en-US'];
    alphanumeric[locale] = alphanumeric['en-US'];
    decimal[locale] = decimal['en-US'];
  } // Source: http://www.localeplanet.com/java/


  var arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];
  alpha$2.arabicLocales = arabicLocales;

  for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
    _locale = "ar-".concat(arabicLocales[_i]);
    alpha$1[_locale] = alpha$1.ar;
    alphanumeric[_locale] = alphanumeric.ar;
    decimal[_locale] = decimal.ar;
  }

  var farsiLocales = ['IR', 'AF'];
  alpha$2.farsiLocales = farsiLocales;

  for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
    _locale2 = "fa-".concat(farsiLocales[_i2]);
    alphanumeric[_locale2] = alphanumeric.fa;
    decimal[_locale2] = decimal.ar;
  }

  var bengaliLocales = ['BD', 'IN'];
  alpha$2.bengaliLocales = bengaliLocales;

  for (var _locale3, _i3 = 0; _i3 < bengaliLocales.length; _i3++) {
    _locale3 = "bn-".concat(bengaliLocales[_i3]);
    alpha$1[_locale3] = alpha$1.bn;
    alphanumeric[_locale3] = alphanumeric.bn;
    decimal[_locale3] = decimal['en-US'];
  } // Source: https://en.wikipedia.org/wiki/Decimal_mark


  var dotDecimal = ['ar-EG', 'ar-LB', 'ar-LY'];
  alpha$2.dotDecimal = dotDecimal;
  var commaDecimal = ['bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-ZM', 'es-ES', 'fr-CA', 'fr-FR', 'id-ID', 'it-IT', 'ku-IQ', 'hi-IN', 'hu-HU', 'nb-NO', 'nn-NO', 'nl-NL', 'pl-PL', 'pt-PT', 'ru-RU', 'si-LK', 'sl-SI', 'sr-RS@latin', 'sr-RS', 'sv-SE', 'tr-TR', 'uk-UA', 'vi-VN'];
  alpha$2.commaDecimal = commaDecimal;

  for (var _i4 = 0; _i4 < dotDecimal.length; _i4++) {
    decimal[dotDecimal[_i4]] = decimal['en-US'];
  }

  for (var _i5 = 0; _i5 < commaDecimal.length; _i5++) {
    decimal[commaDecimal[_i5]] = ',';
  }

  alpha$1['fr-CA'] = alpha$1['fr-FR'];
  alphanumeric['fr-CA'] = alphanumeric['fr-FR'];
  alpha$1['pt-BR'] = alpha$1['pt-PT'];
  alphanumeric['pt-BR'] = alphanumeric['pt-PT'];
  decimal['pt-BR'] = decimal['pt-PT']; // see #862

  alpha$1['pl-Pl'] = alpha$1['pl-PL'];
  alphanumeric['pl-Pl'] = alphanumeric['pl-PL'];
  decimal['pl-Pl'] = decimal['pl-PL']; // see #1455

  alpha$1['fa-AF'] = alpha$1.fa;

  Object.defineProperty(isAlphanumeric$1, "__esModule", {
    value: true
  });
  var _default = isAlphanumeric$1.default = isAlphanumeric;
  isAlphanumeric$1.locales = void 0;

  var _assertString = _interopRequireDefault(assertStringExports);

  var _alpha = alpha$2;

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
  isAlphanumeric$1.locales = locales;

  var validUrl = {exports: {}};

  (function (module) {
  	(function(module) {

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
  } (validUrl));

  var validUrlExports = validUrl.exports;

  var isPlainObj = value => {
  	if (Object.prototype.toString.call(value) !== '[object Object]') {
  		return false;
  	}

  	const prototype = Object.getPrototypeOf(value);
  	return prototype === null || prototype === Object.prototype;
  };

  const isOptionObject = isPlainObj;

  const {hasOwnProperty} = Object.prototype;
  const {propertyIsEnumerable} = Object;
  const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
  	value,
  	writable: true,
  	enumerable: true,
  	configurable: true
  });

  const globalThis$1 = commonjsGlobal;
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
  			defineProperty(merged, key, merge$2(merged[key], source[key], config));
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
  function merge$2(merged, source, config) {
  	if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
  		return concatArrays(merged, source, config);
  	}

  	if (!isOptionObject(source) || !isOptionObject(merged)) {
  		return clone(source);
  	}

  	return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
  }

  var mergeOptions = function (...options) {
  	const config = merge$2(clone(defaultMergeOptions), (this !== globalThis$1 && this) || {}, defaultMergeOptions);
  	let merged = {_: {}};

  	for (const option of options) {
  		if (option === undefined) {
  			continue;
  		}

  		if (!isOptionObject(option)) {
  			throw new TypeError('`' + option + '` is not an Option Object');
  		}

  		merged = merge$2(merged, {_: option}, config);
  	}

  	return merged._;
  };

  var mergeOptions$1 = /*@__PURE__*/getDefaultExportFromCjs(mergeOptions);

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
  var version = ''; // empty string to avoid regexp issues
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
    version: version,
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

  var lib$1 = {};

  Object.defineProperty(lib$1, "__esModule", {
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

  lib$1.isBrowser = isBrowser;
  lib$1.isWebWorker = isWebWorker;
  var isNode_1 = lib$1.isNode = isNode;
  lib$1.isJsDom = isJsDom;

  var isFQDN$1 = {exports: {}};

  var merge$1 = {exports: {}};

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
  } (merge$1, merge$1.exports));

  var mergeExports = merge$1.exports;

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
   * @module utils
   */

  /**
   * Generate an URL to request data from a proxy server
   * @param {string} type                 - The name of the fetcher the proxy must use
   * @param {object} data                 - The data the proxy must provide to the fetcher
   * @param {object} opts                 - Options to enable the request
   * @param {object} opts.proxy           - Proxy related options
   * @param {object} opts.proxy.scheme    - The scheme used by the proxy server
   * @param {object} opts.proxy.hostname  - The hostname of the proxy server
   * @returns {string}
   */
  function generateProxyURL (type, data, opts) {
    try {
      isFQDN(opts.proxy.hostname);
    } catch (err) {
      throw new Error('Invalid proxy hostname')
    }

    const queryStrings = [];

    Object.keys(data).forEach((key) => {
      queryStrings.push(`${key}=${encodeURIComponent(data[key])}`);
    });

    const scheme = opts.proxy.scheme ? opts.proxy.scheme : 'https';

    return `${scheme}://${opts.proxy.hostname}/api/3/get/${type}?${queryStrings.join(
    '&'
  )}`
  }

  /**
   * Generate the string that must be found in the proof to verify a claim
   * @param {string} fingerprint  - The fingerprint of the claim
   * @param {string} format       - The claim's format (see {@link module:enums~ClaimFormat|enums.ClaimFormat})
   * @returns {string}
   */
  function generateClaim (fingerprint, format) {
    switch (format) {
      case ClaimFormat.URI:
        if (fingerprint.match(/^(openpgp4fpr|aspe):/)) {
          return fingerprint
        }
        return `openpgp4fpr:${fingerprint}`
      case ClaimFormat.FINGERPRINT:
        return fingerprint
      default:
        throw new Error('No valid claim format')
    }
  }

  /**
   * Get the URIs from a string and return them as an array
   * @param {string} text         - The text that may contain URIs
   * @returns {Array<string>}
   */
  function getUriFromString (text) {
    const re = /((([A-Za-z0-9]+:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/gi;
    const res = text.match(re);

    const urls = [];

    if (!res) {
      return []
    }

    res.forEach(url => {
      // Remove bad trailing characters
      let hasBadTrailingChars = true;

      while (hasBadTrailingChars) {
        const lastChar = url.charAt(url.length - 1);
        if ('?!.'.indexOf(lastChar) === -1) {
          hasBadTrailingChars = false;
          continue
        }
        url = url.substring(0, url.length - 1);
      }

      urls.push(url);
    });

    return urls
  }

  var utils$9 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    generateClaim: generateClaim,
    generateProxyURL: generateProxyURL,
    getUriFromString: getUriFromString
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
   * @module proofs
   */

  /**
   * Delegate the proof request to the correct fetcher.
   * This method uses the current environment (browser/node), certain values from
   * the `data` parameter and the proxy policy set in the `opts` parameter to
   * choose the right approach to fetch the proof. An error will be thrown if no
   * approach is possible.
   * @async
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
  async function fetch$2 (data, opts) {
    if (isNode_1) {
      return handleNodeRequests(data, opts)
    }

    return handleBrowserRequests(data, opts)
  }

  /**
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
  const handleBrowserRequests = (data, opts) => {
    switch (opts.proxy.policy) {
      case ProxyPolicy.ALWAYS:
        return createProxyRequestPromise(data, opts)

      case ProxyPolicy.NEVER:
        switch (data.proof.request.accessRestriction) {
          case ProofAccessRestriction.NONE:
          case ProofAccessRestriction.GRANTED:
            return createDefaultRequestPromise(data, opts)
          case ProofAccessRestriction.NOCORS:
          case ProofAccessRestriction.SERVER:
            throw new Error(
              'Impossible to fetch proof (bad combination of service access and proxy policy)'
            )
          default:
            throw new Error('Invalid proof access value')
        }

      case ProxyPolicy.ADAPTIVE:
        switch (data.proof.request.accessRestriction) {
          case ProofAccessRestriction.NONE:
            return createFallbackRequestPromise(data, opts)
          case ProofAccessRestriction.NOCORS:
            return createProxyRequestPromise(data, opts)
          case ProofAccessRestriction.GRANTED:
            return createFallbackRequestPromise(data, opts)
          case ProofAccessRestriction.SERVER:
            return createProxyRequestPromise(data, opts)
          default:
            throw new Error('Invalid proof access value')
        }

      default:
        throw new Error('Invalid proxy policy')
    }
  };

  /**
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
  const handleNodeRequests = (data, opts) => {
    switch (opts.proxy.policy) {
      case ProxyPolicy.ALWAYS:
        return createProxyRequestPromise(data, opts)

      case ProxyPolicy.NEVER:
        return createDefaultRequestPromise(data, opts)

      case ProxyPolicy.ADAPTIVE:
        return createFallbackRequestPromise(data, opts)

      default:
        throw new Error('Invalid proxy policy')
    }
  };

  /**
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
  const createDefaultRequestPromise = (data, opts) => {
    return new Promise((resolve, reject) => {
      if (!(data.proof.request.fetcher in fetcher__namespace)) {
        reject(new Error(`fetcher for ${data.proof.request.fetcher} not found`));
      }
      fetcher__namespace[data.proof.request.fetcher]
        .fn(data.proof.request.data, opts)
        .then((res) => {
          return resolve({
            fetcher: data.proof.request.fetcher,
            data,
            viaProxy: false,
            result: res
          })
        })
        .catch((err) => {
          return reject(err)
        });
    })
  };

  /**
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
  const createProxyRequestPromise = (data, opts) => {
    return new Promise((resolve, reject) => {
      let proxyUrl;
      try {
        proxyUrl = generateProxyURL(
          data.proof.request.fetcher,
          data.proof.request.data,
          opts
        );
      } catch (err) {
        reject(err);
      }

      const requestData = {
        url: proxyUrl,
        format: data.proof.response.format,
        fetcherTimeout: data.proof.request.fetcher in fetcher__namespace ? fetcher__namespace[data.proof.request.fetcher].timeout : 30000
      };
      fetcher__namespace.http
        .fn(requestData, opts)
        .then((res) => {
          return resolve({
            fetcher: 'http',
            data,
            viaProxy: true,
            result: res
          })
        })
        .catch((err) => {
          return reject(err)
        });
    })
  };

  /**
   * @param {import('./serviceProvider.js').ServiceProvider} data - Data from a claim definition
   * @param {object} opts - Options to enable the request
   * @returns {Promise<object|string>}
   */
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
            });
        });
    })
  };

  var proofs = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fetch: fetch$2
  });

  /*!
   * hash-wasm (https://www.npmjs.com/package/hash-wasm)
   * (c) Dani Biro
   * @license MIT
   */

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
  var _a$1;
  function getGlobal() {
      if (typeof globalThis !== 'undefined')
          return globalThis;
      // eslint-disable-next-line no-restricted-globals
      if (typeof self !== 'undefined')
          return self;
      if (typeof window !== 'undefined')
          return window;
      return global$1;
  }
  const globalObject = getGlobal();
  const nodeBuffer = (_a$1 = globalObject.Buffer) !== null && _a$1 !== void 0 ? _a$1 : null;
  const textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
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
  function encodeBase64$1(data, pad = true) {
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
  function decodeBase64$1(data) {
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
                  const asm = decodeBase64$1(binary.data);
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

  new Mutex();

  var name$j = "blake2b";
  var data$j = "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";
  var hash$j = "68afc9cf";
  var wasmJson$j = {
  	name: name$j,
  	data: data$j,
  	hash: hash$j
  };

  new Mutex();
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
      return `$argon2${options.hashType}$v=19$${parameters}$${encodeBase64$1(salt, false)}$${encodeBase64$1(res, false)}`;
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
      return Object.assign(Object.assign({}, parsedParameters), { password, hashType: hashType, salt: decodeBase64$1(salt), hashLength: getDecodeBase64Length(hash), outputType: 'encoded' });
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

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  new Mutex();

  var name$2 = "bcrypt";
  var data$2 = "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";
  var hash$2 = "9f4c7b9e";
  var wasmJson$2 = {
  	name: name$2,
  	data: data$2,
  	hash: hash$2
  };
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

  new Mutex();

  new Mutex();

  // Generated using scripts/write-decode-map.ts
  var htmlDecodeTree = new Uint16Array(
  // prettier-ignore
  "\u1d41<\xd5\u0131\u028a\u049d\u057b\u05d0\u0675\u06de\u07a2\u07d6\u080f\u0a4a\u0a91\u0da1\u0e6d\u0f09\u0f26\u10ca\u1228\u12e1\u1415\u149d\u14c3\u14df\u1525\0\0\0\0\0\0\u156b\u16cd\u198d\u1c12\u1ddd\u1f7e\u2060\u21b0\u228d\u23c0\u23fb\u2442\u2824\u2912\u2d08\u2e48\u2fce\u3016\u32ba\u3639\u37ac\u38fe\u3a28\u3a71\u3ae0\u3b2e\u0800EMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig\u803b\xc6\u40c6P\u803b&\u4026cute\u803b\xc1\u40c1reve;\u4102\u0100iyx}rc\u803b\xc2\u40c2;\u4410r;\uc000\ud835\udd04rave\u803b\xc0\u40c0pha;\u4391acr;\u4100d;\u6a53\u0100gp\x9d\xa1on;\u4104f;\uc000\ud835\udd38plyFunction;\u6061ing\u803b\xc5\u40c5\u0100cs\xbe\xc3r;\uc000\ud835\udc9cign;\u6254ilde\u803b\xc3\u40c3ml\u803b\xc4\u40c4\u0400aceforsu\xe5\xfb\xfe\u0117\u011c\u0122\u0127\u012a\u0100cr\xea\xf2kslash;\u6216\u0176\xf6\xf8;\u6ae7ed;\u6306y;\u4411\u0180crt\u0105\u010b\u0114ause;\u6235noullis;\u612ca;\u4392r;\uc000\ud835\udd05pf;\uc000\ud835\udd39eve;\u42d8c\xf2\u0113mpeq;\u624e\u0700HOacdefhilorsu\u014d\u0151\u0156\u0180\u019e\u01a2\u01b5\u01b7\u01ba\u01dc\u0215\u0273\u0278\u027ecy;\u4427PY\u803b\xa9\u40a9\u0180cpy\u015d\u0162\u017aute;\u4106\u0100;i\u0167\u0168\u62d2talDifferentialD;\u6145leys;\u612d\u0200aeio\u0189\u018e\u0194\u0198ron;\u410cdil\u803b\xc7\u40c7rc;\u4108nint;\u6230ot;\u410a\u0100dn\u01a7\u01adilla;\u40b8terDot;\u40b7\xf2\u017fi;\u43a7rcle\u0200DMPT\u01c7\u01cb\u01d1\u01d6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01e2\u01f8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020foubleQuote;\u601duote;\u6019\u0200lnpu\u021e\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6a74\u0180git\u022f\u0236\u023aruent;\u6261nt;\u622fourIntegral;\u622e\u0100fr\u024c\u024e;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6a2fcr;\uc000\ud835\udc9ep\u0100;C\u0284\u0285\u62d3ap;\u624d\u0580DJSZacefios\u02a0\u02ac\u02b0\u02b4\u02b8\u02cb\u02d7\u02e1\u02e6\u0333\u048d\u0100;o\u0179\u02a5trahd;\u6911cy;\u4402cy;\u4405cy;\u440f\u0180grs\u02bf\u02c4\u02c7ger;\u6021r;\u61a1hv;\u6ae4\u0100ay\u02d0\u02d5ron;\u410e;\u4414l\u0100;t\u02dd\u02de\u6207a;\u4394r;\uc000\ud835\udd07\u0100af\u02eb\u0327\u0100cm\u02f0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031ccute;\u40b4o\u0174\u030b\u030d;\u42d9bleAcute;\u42ddrave;\u4060ilde;\u42dcond;\u62c4ferentialD;\u6146\u0470\u033d\0\0\0\u0342\u0354\0\u0405f;\uc000\ud835\udd3b\u0180;DE\u0348\u0349\u034d\u40a8ot;\u60dcqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03cf\u03e2\u03f8ontourIntegra\xec\u0239o\u0274\u0379\0\0\u037b\xbb\u0349nArrow;\u61d3\u0100eo\u0387\u03a4ft\u0180ART\u0390\u0396\u03a1rrow;\u61d0ightArrow;\u61d4e\xe5\u02cang\u0100LR\u03ab\u03c4eft\u0100AR\u03b3\u03b9rrow;\u67f8ightArrow;\u67faightArrow;\u67f9ight\u0100AT\u03d8\u03derrow;\u61d2ee;\u62a8p\u0241\u03e9\0\0\u03efrrow;\u61d1ownArrow;\u61d5erticalBar;\u6225n\u0300ABLRTa\u0412\u042a\u0430\u045e\u047f\u037crrow\u0180;BU\u041d\u041e\u0422\u6193ar;\u6913pArrow;\u61f5reve;\u4311eft\u02d2\u043a\0\u0446\0\u0450ightVector;\u6950eeVector;\u695eector\u0100;B\u0459\u045a\u61bdar;\u6956ight\u01d4\u0467\0\u0471eeVector;\u695fector\u0100;B\u047a\u047b\u61c1ar;\u6957ee\u0100;A\u0486\u0487\u62a4rrow;\u61a7\u0100ct\u0492\u0497r;\uc000\ud835\udc9frok;\u4110\u0800NTacdfglmopqstux\u04bd\u04c0\u04c4\u04cb\u04de\u04e2\u04e7\u04ee\u04f5\u0521\u052f\u0536\u0552\u055d\u0560\u0565G;\u414aH\u803b\xd0\u40d0cute\u803b\xc9\u40c9\u0180aiy\u04d2\u04d7\u04dcron;\u411arc\u803b\xca\u40ca;\u442dot;\u4116r;\uc000\ud835\udd08rave\u803b\xc8\u40c8ement;\u6208\u0100ap\u04fa\u04fecr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65fberySmallSquare;\u65ab\u0100gp\u0526\u052aon;\u4118f;\uc000\ud835\udd3csilon;\u4395u\u0100ai\u053c\u0549l\u0100;T\u0542\u0543\u6a75ilde;\u6242librium;\u61cc\u0100ci\u0557\u055ar;\u6130m;\u6a73a;\u4397ml\u803b\xcb\u40cb\u0100ip\u056a\u056fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058d\u05b2\u05ccy;\u4424r;\uc000\ud835\udd09lled\u0253\u0597\0\0\u05a3mallSquare;\u65fcerySmallSquare;\u65aa\u0370\u05ba\0\u05bf\0\0\u05c4f;\uc000\ud835\udd3dAll;\u6200riertrf;\u6131c\xf2\u05cb\u0600JTabcdfgorst\u05e8\u05ec\u05ef\u05fa\u0600\u0612\u0616\u061b\u061d\u0623\u066c\u0672cy;\u4403\u803b>\u403emma\u0100;d\u05f7\u05f8\u4393;\u43dcreve;\u411e\u0180eiy\u0607\u060c\u0610dil;\u4122rc;\u411c;\u4413ot;\u4120r;\uc000\ud835\udd0a;\u62d9pf;\uc000\ud835\udd3eeater\u0300EFGLST\u0635\u0644\u064e\u0656\u065b\u0666qual\u0100;L\u063e\u063f\u6265ess;\u62dbullEqual;\u6267reater;\u6aa2ess;\u6277lantEqual;\u6a7eilde;\u6273cr;\uc000\ud835\udca2;\u626b\u0400Aacfiosu\u0685\u068b\u0696\u069b\u069e\u06aa\u06be\u06caRDcy;\u442a\u0100ct\u0690\u0694ek;\u42c7;\u405eirc;\u4124r;\u610clbertSpace;\u610b\u01f0\u06af\0\u06b2f;\u610dizontalLine;\u6500\u0100ct\u06c3\u06c5\xf2\u06a9rok;\u4126mp\u0144\u06d0\u06d8ownHum\xf0\u012fqual;\u624f\u0700EJOacdfgmnostu\u06fa\u06fe\u0703\u0707\u070e\u071a\u071e\u0721\u0728\u0744\u0778\u078b\u078f\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803b\xcd\u40cd\u0100iy\u0713\u0718rc\u803b\xce\u40ce;\u4418ot;\u4130r;\u6111rave\u803b\xcc\u40cc\u0180;ap\u0720\u072f\u073f\u0100cg\u0734\u0737r;\u412ainaryI;\u6148lie\xf3\u03dd\u01f4\u0749\0\u0762\u0100;e\u074d\u074e\u622c\u0100gr\u0753\u0758ral;\u622bsection;\u62c2isible\u0100CT\u076c\u0772omma;\u6063imes;\u6062\u0180gpt\u077f\u0783\u0788on;\u412ef;\uc000\ud835\udd40a;\u4399cr;\u6110ilde;\u4128\u01eb\u079a\0\u079ecy;\u4406l\u803b\xcf\u40cf\u0280cfosu\u07ac\u07b7\u07bc\u07c2\u07d0\u0100iy\u07b1\u07b5rc;\u4134;\u4419r;\uc000\ud835\udd0dpf;\uc000\ud835\udd41\u01e3\u07c7\0\u07ccr;\uc000\ud835\udca5rcy;\u4408kcy;\u4404\u0380HJacfos\u07e4\u07e8\u07ec\u07f1\u07fd\u0802\u0808cy;\u4425cy;\u440cppa;\u439a\u0100ey\u07f6\u07fbdil;\u4136;\u441ar;\uc000\ud835\udd0epf;\uc000\ud835\udd42cr;\uc000\ud835\udca6\u0580JTaceflmost\u0825\u0829\u082c\u0850\u0863\u09b3\u09b8\u09c7\u09cd\u0a37\u0a47cy;\u4409\u803b<\u403c\u0280cmnpr\u0837\u083c\u0841\u0844\u084dute;\u4139bda;\u439bg;\u67ealacetrf;\u6112r;\u619e\u0180aey\u0857\u085c\u0861ron;\u413ddil;\u413b;\u441b\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087e\u08a9\u08b1\u08e0\u08e6\u08fc\u092f\u095b\u0390\u096a\u0100nr\u0883\u088fgleBracket;\u67e8row\u0180;BR\u0899\u089a\u089e\u6190ar;\u61e4ightArrow;\u61c6eiling;\u6308o\u01f5\u08b7\0\u08c3bleBracket;\u67e6n\u01d4\u08c8\0\u08d2eeVector;\u6961ector\u0100;B\u08db\u08dc\u61c3ar;\u6959loor;\u630aight\u0100AV\u08ef\u08f5rrow;\u6194ector;\u694e\u0100er\u0901\u0917e\u0180;AV\u0909\u090a\u0910\u62a3rrow;\u61a4ector;\u695aiangle\u0180;BE\u0924\u0925\u0929\u62b2ar;\u69cfqual;\u62b4p\u0180DTV\u0937\u0942\u094cownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61bfar;\u6958ector\u0100;B\u0965\u0966\u61bcar;\u6952ight\xe1\u039cs\u0300EFGLST\u097e\u098b\u0995\u099d\u09a2\u09adqualGreater;\u62daullEqual;\u6266reater;\u6276ess;\u6aa1lantEqual;\u6a7dilde;\u6272r;\uc000\ud835\udd0f\u0100;e\u09bd\u09be\u62d8ftarrow;\u61daidot;\u413f\u0180npw\u09d4\u0a16\u0a1bg\u0200LRlr\u09de\u09f7\u0a02\u0a10eft\u0100AR\u09e6\u09ecrrow;\u67f5ightArrow;\u67f7ightArrow;\u67f6eft\u0100ar\u03b3\u0a0aight\xe1\u03bfight\xe1\u03caf;\uc000\ud835\udd43er\u0100LR\u0a22\u0a2ceftArrow;\u6199ightArrow;\u6198\u0180cht\u0a3e\u0a40\u0a42\xf2\u084c;\u61b0rok;\u4141;\u626a\u0400acefiosu\u0a5a\u0a5d\u0a60\u0a77\u0a7c\u0a85\u0a8b\u0a8ep;\u6905y;\u441c\u0100dl\u0a65\u0a6fiumSpace;\u605flintrf;\u6133r;\uc000\ud835\udd10nusPlus;\u6213pf;\uc000\ud835\udd44c\xf2\u0a76;\u439c\u0480Jacefostu\u0aa3\u0aa7\u0aad\u0ac0\u0b14\u0b19\u0d91\u0d97\u0d9ecy;\u440acute;\u4143\u0180aey\u0ab4\u0ab9\u0aberon;\u4147dil;\u4145;\u441d\u0180gsw\u0ac7\u0af0\u0b0eative\u0180MTV\u0ad3\u0adf\u0ae8ediumSpace;\u600bhi\u0100cn\u0ae6\u0ad8\xeb\u0ad9eryThi\xee\u0ad9ted\u0100GL\u0af8\u0b06reaterGreate\xf2\u0673essLes\xf3\u0a48Line;\u400ar;\uc000\ud835\udd11\u0200Bnpt\u0b22\u0b28\u0b37\u0b3areak;\u6060BreakingSpace;\u40a0f;\u6115\u0680;CDEGHLNPRSTV\u0b55\u0b56\u0b6a\u0b7c\u0ba1\u0beb\u0c04\u0c5e\u0c84\u0ca6\u0cd8\u0d61\u0d85\u6aec\u0100ou\u0b5b\u0b64ngruent;\u6262pCap;\u626doubleVerticalBar;\u6226\u0180lqx\u0b83\u0b8a\u0b9bement;\u6209ual\u0100;T\u0b92\u0b93\u6260ilde;\uc000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0bb6\u0bb7\u0bbd\u0bc9\u0bd3\u0bd8\u0be5\u626fqual;\u6271ullEqual;\uc000\u2267\u0338reater;\uc000\u226b\u0338ess;\u6279lantEqual;\uc000\u2a7e\u0338ilde;\u6275ump\u0144\u0bf2\u0bfdownHump;\uc000\u224e\u0338qual;\uc000\u224f\u0338e\u0100fs\u0c0a\u0c27tTriangle\u0180;BE\u0c1a\u0c1b\u0c21\u62eaar;\uc000\u29cf\u0338qual;\u62ecs\u0300;EGLST\u0c35\u0c36\u0c3c\u0c44\u0c4b\u0c58\u626equal;\u6270reater;\u6278ess;\uc000\u226a\u0338lantEqual;\uc000\u2a7d\u0338ilde;\u6274ested\u0100GL\u0c68\u0c79reaterGreater;\uc000\u2aa2\u0338essLess;\uc000\u2aa1\u0338recedes\u0180;ES\u0c92\u0c93\u0c9b\u6280qual;\uc000\u2aaf\u0338lantEqual;\u62e0\u0100ei\u0cab\u0cb9verseElement;\u620cghtTriangle\u0180;BE\u0ccb\u0ccc\u0cd2\u62ebar;\uc000\u29d0\u0338qual;\u62ed\u0100qu\u0cdd\u0d0cuareSu\u0100bp\u0ce8\u0cf9set\u0100;E\u0cf0\u0cf3\uc000\u228f\u0338qual;\u62e2erset\u0100;E\u0d03\u0d06\uc000\u2290\u0338qual;\u62e3\u0180bcp\u0d13\u0d24\u0d4eset\u0100;E\u0d1b\u0d1e\uc000\u2282\u20d2qual;\u6288ceeds\u0200;EST\u0d32\u0d33\u0d3b\u0d46\u6281qual;\uc000\u2ab0\u0338lantEqual;\u62e1ilde;\uc000\u227f\u0338erset\u0100;E\u0d58\u0d5b\uc000\u2283\u20d2qual;\u6289ilde\u0200;EFT\u0d6e\u0d6f\u0d75\u0d7f\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uc000\ud835\udca9ilde\u803b\xd1\u40d1;\u439d\u0700Eacdfgmoprstuv\u0dbd\u0dc2\u0dc9\u0dd5\u0ddb\u0de0\u0de7\u0dfc\u0e02\u0e20\u0e22\u0e32\u0e3f\u0e44lig;\u4152cute\u803b\xd3\u40d3\u0100iy\u0dce\u0dd3rc\u803b\xd4\u40d4;\u441eblac;\u4150r;\uc000\ud835\udd12rave\u803b\xd2\u40d2\u0180aei\u0dee\u0df2\u0df6cr;\u414cga;\u43a9cron;\u439fpf;\uc000\ud835\udd46enCurly\u0100DQ\u0e0e\u0e1aoubleQuote;\u601cuote;\u6018;\u6a54\u0100cl\u0e27\u0e2cr;\uc000\ud835\udcaaash\u803b\xd8\u40d8i\u016c\u0e37\u0e3cde\u803b\xd5\u40d5es;\u6a37ml\u803b\xd6\u40d6er\u0100BP\u0e4b\u0e60\u0100ar\u0e50\u0e53r;\u603eac\u0100ek\u0e5a\u0e5c;\u63deet;\u63b4arenthesis;\u63dc\u0480acfhilors\u0e7f\u0e87\u0e8a\u0e8f\u0e92\u0e94\u0e9d\u0eb0\u0efcrtialD;\u6202y;\u441fr;\uc000\ud835\udd13i;\u43a6;\u43a0usMinus;\u40b1\u0100ip\u0ea2\u0eadncareplan\xe5\u069df;\u6119\u0200;eio\u0eb9\u0eba\u0ee0\u0ee4\u6abbcedes\u0200;EST\u0ec8\u0ec9\u0ecf\u0eda\u627aqual;\u6aaflantEqual;\u627cilde;\u627eme;\u6033\u0100dp\u0ee9\u0eeeuct;\u620fortion\u0100;a\u0225\u0ef9l;\u621d\u0100ci\u0f01\u0f06r;\uc000\ud835\udcab;\u43a8\u0200Ufos\u0f11\u0f16\u0f1b\u0f1fOT\u803b\"\u4022r;\uc000\ud835\udd14pf;\u611acr;\uc000\ud835\udcac\u0600BEacefhiorsu\u0f3e\u0f43\u0f47\u0f60\u0f73\u0fa7\u0faa\u0fad\u1096\u10a9\u10b4\u10bearr;\u6910G\u803b\xae\u40ae\u0180cnr\u0f4e\u0f53\u0f56ute;\u4154g;\u67ebr\u0100;t\u0f5c\u0f5d\u61a0l;\u6916\u0180aey\u0f67\u0f6c\u0f71ron;\u4158dil;\u4156;\u4420\u0100;v\u0f78\u0f79\u611cerse\u0100EU\u0f82\u0f99\u0100lq\u0f87\u0f8eement;\u620builibrium;\u61cbpEquilibrium;\u696fr\xbb\u0f79o;\u43a1ght\u0400ACDFTUVa\u0fc1\u0feb\u0ff3\u1022\u1028\u105b\u1087\u03d8\u0100nr\u0fc6\u0fd2gleBracket;\u67e9row\u0180;BL\u0fdc\u0fdd\u0fe1\u6192ar;\u61e5eftArrow;\u61c4eiling;\u6309o\u01f5\u0ff9\0\u1005bleBracket;\u67e7n\u01d4\u100a\0\u1014eeVector;\u695dector\u0100;B\u101d\u101e\u61c2ar;\u6955loor;\u630b\u0100er\u102d\u1043e\u0180;AV\u1035\u1036\u103c\u62a2rrow;\u61a6ector;\u695biangle\u0180;BE\u1050\u1051\u1055\u62b3ar;\u69d0qual;\u62b5p\u0180DTV\u1063\u106e\u1078ownVector;\u694feeVector;\u695cector\u0100;B\u1082\u1083\u61bear;\u6954ector\u0100;B\u1091\u1092\u61c0ar;\u6953\u0100pu\u109b\u109ef;\u611dndImplies;\u6970ightarrow;\u61db\u0100ch\u10b9\u10bcr;\u611b;\u61b1leDelayed;\u69f4\u0680HOacfhimoqstu\u10e4\u10f1\u10f7\u10fd\u1119\u111e\u1151\u1156\u1161\u1167\u11b5\u11bb\u11bf\u0100Cc\u10e9\u10eeHcy;\u4429y;\u4428FTcy;\u442ccute;\u415a\u0280;aeiy\u1108\u1109\u110e\u1113\u1117\u6abcron;\u4160dil;\u415erc;\u415c;\u4421r;\uc000\ud835\udd16ort\u0200DLRU\u112a\u1134\u113e\u1149ownArrow\xbb\u041eeftArrow\xbb\u089aightArrow\xbb\u0fddpArrow;\u6191gma;\u43a3allCircle;\u6218pf;\uc000\ud835\udd4a\u0272\u116d\0\0\u1170t;\u621aare\u0200;ISU\u117b\u117c\u1189\u11af\u65a1ntersection;\u6293u\u0100bp\u118f\u119eset\u0100;E\u1197\u1198\u628fqual;\u6291erset\u0100;E\u11a8\u11a9\u6290qual;\u6292nion;\u6294cr;\uc000\ud835\udcaear;\u62c6\u0200bcmp\u11c8\u11db\u1209\u120b\u0100;s\u11cd\u11ce\u62d0et\u0100;E\u11cd\u11d5qual;\u6286\u0100ch\u11e0\u1205eeds\u0200;EST\u11ed\u11ee\u11f4\u11ff\u627bqual;\u6ab0lantEqual;\u627dilde;\u627fTh\xe1\u0f8c;\u6211\u0180;es\u1212\u1213\u1223\u62d1rset\u0100;E\u121c\u121d\u6283qual;\u6287et\xbb\u1213\u0580HRSacfhiors\u123e\u1244\u1249\u1255\u125e\u1271\u1276\u129f\u12c2\u12c8\u12d1ORN\u803b\xde\u40deADE;\u6122\u0100Hc\u124e\u1252cy;\u440by;\u4426\u0100bu\u125a\u125c;\u4009;\u43a4\u0180aey\u1265\u126a\u126fron;\u4164dil;\u4162;\u4422r;\uc000\ud835\udd17\u0100ei\u127b\u1289\u01f2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128e\u1298kSpace;\uc000\u205f\u200aSpace;\u6009lde\u0200;EFT\u12ab\u12ac\u12b2\u12bc\u623cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uc000\ud835\udd4bipleDot;\u60db\u0100ct\u12d6\u12dbr;\uc000\ud835\udcafrok;\u4166\u0ae1\u12f7\u130e\u131a\u1326\0\u132c\u1331\0\0\0\0\0\u1338\u133d\u1377\u1385\0\u13ff\u1404\u140a\u1410\u0100cr\u12fb\u1301ute\u803b\xda\u40dar\u0100;o\u1307\u1308\u619fcir;\u6949r\u01e3\u1313\0\u1316y;\u440eve;\u416c\u0100iy\u131e\u1323rc\u803b\xdb\u40db;\u4423blac;\u4170r;\uc000\ud835\udd18rave\u803b\xd9\u40d9acr;\u416a\u0100di\u1341\u1369er\u0100BP\u1348\u135d\u0100ar\u134d\u1350r;\u405fac\u0100ek\u1357\u1359;\u63dfet;\u63b5arenthesis;\u63ddon\u0100;P\u1370\u1371\u62c3lus;\u628e\u0100gp\u137b\u137fon;\u4172f;\uc000\ud835\udd4c\u0400ADETadps\u1395\u13ae\u13b8\u13c4\u03e8\u13d2\u13d7\u13f3rrow\u0180;BD\u1150\u13a0\u13a4ar;\u6912ownArrow;\u61c5ownArrow;\u6195quilibrium;\u696eee\u0100;A\u13cb\u13cc\u62a5rrow;\u61a5own\xe1\u03f3er\u0100LR\u13de\u13e8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13f9\u13fa\u43d2on;\u43a5ing;\u416ecr;\uc000\ud835\udcb0ilde;\u4168ml\u803b\xdc\u40dc\u0480Dbcdefosv\u1427\u142c\u1430\u1433\u143e\u1485\u148a\u1490\u1496ash;\u62abar;\u6aeby;\u4412ash\u0100;l\u143b\u143c\u62a9;\u6ae6\u0100er\u1443\u1445;\u62c1\u0180bty\u144c\u1450\u147aar;\u6016\u0100;i\u144f\u1455cal\u0200BLST\u1461\u1465\u146a\u1474ar;\u6223ine;\u407ceparator;\u6758ilde;\u6240ThinSpace;\u600ar;\uc000\ud835\udd19pf;\uc000\ud835\udd4dcr;\uc000\ud835\udcb1dash;\u62aa\u0280cefos\u14a7\u14ac\u14b1\u14b6\u14bcirc;\u4174dge;\u62c0r;\uc000\ud835\udd1apf;\uc000\ud835\udd4ecr;\uc000\ud835\udcb2\u0200fios\u14cb\u14d0\u14d2\u14d8r;\uc000\ud835\udd1b;\u439epf;\uc000\ud835\udd4fcr;\uc000\ud835\udcb3\u0480AIUacfosu\u14f1\u14f5\u14f9\u14fd\u1504\u150f\u1514\u151a\u1520cy;\u442fcy;\u4407cy;\u442ecute\u803b\xdd\u40dd\u0100iy\u1509\u150drc;\u4176;\u442br;\uc000\ud835\udd1cpf;\uc000\ud835\udd50cr;\uc000\ud835\udcb4ml;\u4178\u0400Hacdefos\u1535\u1539\u153f\u154b\u154f\u155d\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417d;\u4417ot;\u417b\u01f2\u1554\0\u155boWidt\xe8\u0ad9a;\u4396r;\u6128pf;\u6124cr;\uc000\ud835\udcb5\u0be1\u1583\u158a\u1590\0\u15b0\u15b6\u15bf\0\0\0\0\u15c6\u15db\u15eb\u165f\u166d\0\u1695\u169b\u16b2\u16b9\0\u16becute\u803b\xe1\u40e1reve;\u4103\u0300;Ediuy\u159c\u159d\u15a1\u15a3\u15a8\u15ad\u623e;\uc000\u223e\u0333;\u623frc\u803b\xe2\u40e2te\u80bb\xb4\u0306;\u4430lig\u803b\xe6\u40e6\u0100;r\xb2\u15ba;\uc000\ud835\udd1erave\u803b\xe0\u40e0\u0100ep\u15ca\u15d6\u0100fp\u15cf\u15d4sym;\u6135\xe8\u15d3ha;\u43b1\u0100ap\u15dfc\u0100cl\u15e4\u15e7r;\u4101g;\u6a3f\u0264\u15f0\0\0\u160a\u0280;adsv\u15fa\u15fb\u15ff\u1601\u1607\u6227nd;\u6a55;\u6a5clope;\u6a58;\u6a5a\u0380;elmrsz\u1618\u1619\u161b\u161e\u163f\u164f\u1659\u6220;\u69a4e\xbb\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163a\u163c\u163e;\u69a8;\u69a9;\u69aa;\u69ab;\u69ac;\u69ad;\u69ae;\u69aft\u0100;v\u1645\u1646\u621fb\u0100;d\u164c\u164d\u62be;\u699d\u0100pt\u1654\u1657h;\u6222\xbb\xb9arr;\u637c\u0100gp\u1663\u1667on;\u4105f;\uc000\ud835\udd52\u0380;Eaeiop\u12c1\u167b\u167d\u1682\u1684\u1687\u168a;\u6a70cir;\u6a6f;\u624ad;\u624bs;\u4027rox\u0100;e\u12c1\u1692\xf1\u1683ing\u803b\xe5\u40e5\u0180cty\u16a1\u16a6\u16a8r;\uc000\ud835\udcb6;\u402amp\u0100;e\u12c1\u16af\xf1\u0288ilde\u803b\xe3\u40e3ml\u803b\xe4\u40e4\u0100ci\u16c2\u16c8onin\xf4\u0272nt;\u6a11\u0800Nabcdefiklnoprsu\u16ed\u16f1\u1730\u173c\u1743\u1748\u1778\u177d\u17e0\u17e6\u1839\u1850\u170d\u193d\u1948\u1970ot;\u6aed\u0100cr\u16f6\u171ek\u0200ceps\u1700\u1705\u170d\u1713ong;\u624cpsilon;\u43f6rime;\u6035im\u0100;e\u171a\u171b\u623dq;\u62cd\u0176\u1722\u1726ee;\u62bded\u0100;g\u172c\u172d\u6305e\xbb\u172drk\u0100;t\u135c\u1737brk;\u63b6\u0100oy\u1701\u1741;\u4431quo;\u601e\u0280cmprt\u1753\u175b\u1761\u1764\u1768aus\u0100;e\u010a\u0109ptyv;\u69b0s\xe9\u170cno\xf5\u0113\u0180ahw\u176f\u1771\u1773;\u43b2;\u6136een;\u626cr;\uc000\ud835\udd1fg\u0380costuvw\u178d\u179d\u17b3\u17c1\u17d5\u17db\u17de\u0180aiu\u1794\u1796\u179a\xf0\u0760rc;\u65efp\xbb\u1371\u0180dpt\u17a4\u17a8\u17adot;\u6a00lus;\u6a01imes;\u6a02\u0271\u17b9\0\0\u17becup;\u6a06ar;\u6605riangle\u0100du\u17cd\u17d2own;\u65bdp;\u65b3plus;\u6a04e\xe5\u1444\xe5\u14adarow;\u690d\u0180ako\u17ed\u1826\u1835\u0100cn\u17f2\u1823k\u0180lst\u17fa\u05ab\u1802ozenge;\u69ebriangle\u0200;dlr\u1812\u1813\u1818\u181d\u65b4own;\u65beeft;\u65c2ight;\u65b8k;\u6423\u01b1\u182b\0\u1833\u01b2\u182f\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183e\u184d\u0100;q\u1843\u1846\uc000=\u20e5uiv;\uc000\u2261\u20e5t;\u6310\u0200ptwx\u1859\u185e\u1867\u186cf;\uc000\ud835\udd53\u0100;t\u13cb\u1863om\xbb\u13cctie;\u62c8\u0600DHUVbdhmptuv\u1885\u1896\u18aa\u18bb\u18d7\u18db\u18ec\u18ff\u1905\u190a\u1910\u1921\u0200LRlr\u188e\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18a1\u18a2\u18a4\u18a6\u18a8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18b3\u18b5\u18b7\u18b9;\u655d;\u655a;\u655c;\u6559\u0380;HLRhlr\u18ca\u18cb\u18cd\u18cf\u18d1\u18d3\u18d5\u6551;\u656c;\u6563;\u6560;\u656b;\u6562;\u655fox;\u69c9\u0200LRlr\u18e4\u18e6\u18e8\u18ea;\u6555;\u6552;\u6510;\u650c\u0280;DUdu\u06bd\u18f7\u18f9\u18fb\u18fd;\u6565;\u6568;\u652c;\u6534inus;\u629flus;\u629eimes;\u62a0\u0200LRlr\u1919\u191b\u191d\u191f;\u655b;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193b\u6502;\u656a;\u6561;\u655e;\u653c;\u6524;\u651c\u0100ev\u0123\u1942bar\u803b\xa6\u40a6\u0200ceio\u1951\u1956\u195a\u1960r;\uc000\ud835\udcb7mi;\u604fm\u0100;e\u171a\u171cl\u0180;bh\u1968\u1969\u196b\u405c;\u69c5sub;\u67c8\u016c\u1974\u197el\u0100;e\u1979\u197a\u6022t\xbb\u197ap\u0180;Ee\u012f\u1985\u1987;\u6aae\u0100;q\u06dc\u06db\u0ce1\u19a7\0\u19e8\u1a11\u1a15\u1a32\0\u1a37\u1a50\0\0\u1ab4\0\0\u1ac1\0\0\u1b21\u1b2e\u1b4d\u1b52\0\u1bfd\0\u1c0c\u0180cpr\u19ad\u19b2\u19ddute;\u4107\u0300;abcds\u19bf\u19c0\u19c4\u19ca\u19d5\u19d9\u6229nd;\u6a44rcup;\u6a49\u0100au\u19cf\u19d2p;\u6a4bp;\u6a47ot;\u6a40;\uc000\u2229\ufe00\u0100eo\u19e2\u19e5t;\u6041\xee\u0693\u0200aeiu\u19f0\u19fb\u1a01\u1a05\u01f0\u19f5\0\u19f8s;\u6a4don;\u410ddil\u803b\xe7\u40e7rc;\u4109ps\u0100;s\u1a0c\u1a0d\u6a4cm;\u6a50ot;\u410b\u0180dmn\u1a1b\u1a20\u1a26il\u80bb\xb8\u01adptyv;\u69b2t\u8100\xa2;e\u1a2d\u1a2e\u40a2r\xe4\u01b2r;\uc000\ud835\udd20\u0180cei\u1a3d\u1a40\u1a4dy;\u4447ck\u0100;m\u1a47\u1a48\u6713ark\xbb\u1a48;\u43c7r\u0380;Ecefms\u1a5f\u1a60\u1a62\u1a6b\u1aa4\u1aaa\u1aae\u65cb;\u69c3\u0180;el\u1a69\u1a6a\u1a6d\u42c6q;\u6257e\u0261\u1a74\0\0\u1a88rrow\u0100lr\u1a7c\u1a81eft;\u61baight;\u61bb\u0280RSacd\u1a92\u1a94\u1a96\u1a9a\u1a9f\xbb\u0f47;\u64c8st;\u629birc;\u629aash;\u629dnint;\u6a10id;\u6aefcir;\u69c2ubs\u0100;u\u1abb\u1abc\u6663it\xbb\u1abc\u02ec\u1ac7\u1ad4\u1afa\0\u1b0aon\u0100;e\u1acd\u1ace\u403a\u0100;q\xc7\xc6\u026d\u1ad9\0\0\u1ae2a\u0100;t\u1ade\u1adf\u402c;\u4040\u0180;fl\u1ae8\u1ae9\u1aeb\u6201\xee\u1160e\u0100mx\u1af1\u1af6ent\xbb\u1ae9e\xf3\u024d\u01e7\u1afe\0\u1b07\u0100;d\u12bb\u1b02ot;\u6a6dn\xf4\u0246\u0180fry\u1b10\u1b14\u1b17;\uc000\ud835\udd54o\xe4\u0254\u8100\xa9;s\u0155\u1b1dr;\u6117\u0100ao\u1b25\u1b29rr;\u61b5ss;\u6717\u0100cu\u1b32\u1b37r;\uc000\ud835\udcb8\u0100bp\u1b3c\u1b44\u0100;e\u1b41\u1b42\u6acf;\u6ad1\u0100;e\u1b49\u1b4a\u6ad0;\u6ad2dot;\u62ef\u0380delprvw\u1b60\u1b6c\u1b77\u1b82\u1bac\u1bd4\u1bf9arr\u0100lr\u1b68\u1b6a;\u6938;\u6935\u0270\u1b72\0\0\u1b75r;\u62dec;\u62dfarr\u0100;p\u1b7f\u1b80\u61b6;\u693d\u0300;bcdos\u1b8f\u1b90\u1b96\u1ba1\u1ba5\u1ba8\u622arcap;\u6a48\u0100au\u1b9b\u1b9ep;\u6a46p;\u6a4aot;\u628dr;\u6a45;\uc000\u222a\ufe00\u0200alrv\u1bb5\u1bbf\u1bde\u1be3rr\u0100;m\u1bbc\u1bbd\u61b7;\u693cy\u0180evw\u1bc7\u1bd4\u1bd8q\u0270\u1bce\0\0\u1bd2re\xe3\u1b73u\xe3\u1b75ee;\u62ceedge;\u62cfen\u803b\xa4\u40a4earrow\u0100lr\u1bee\u1bf3eft\xbb\u1b80ight\xbb\u1bbde\xe4\u1bdd\u0100ci\u1c01\u1c07onin\xf4\u01f7nt;\u6231lcty;\u632d\u0980AHabcdefhijlorstuwz\u1c38\u1c3b\u1c3f\u1c5d\u1c69\u1c75\u1c8a\u1c9e\u1cac\u1cb7\u1cfb\u1cff\u1d0d\u1d7b\u1d91\u1dab\u1dbb\u1dc6\u1dcdr\xf2\u0381ar;\u6965\u0200glrs\u1c48\u1c4d\u1c52\u1c54ger;\u6020eth;\u6138\xf2\u1133h\u0100;v\u1c5a\u1c5b\u6010\xbb\u090a\u016b\u1c61\u1c67arow;\u690fa\xe3\u0315\u0100ay\u1c6e\u1c73ron;\u410f;\u4434\u0180;ao\u0332\u1c7c\u1c84\u0100gr\u02bf\u1c81r;\u61catseq;\u6a77\u0180glm\u1c91\u1c94\u1c98\u803b\xb0\u40b0ta;\u43b4ptyv;\u69b1\u0100ir\u1ca3\u1ca8sht;\u697f;\uc000\ud835\udd21ar\u0100lr\u1cb3\u1cb5\xbb\u08dc\xbb\u101e\u0280aegsv\u1cc2\u0378\u1cd6\u1cdc\u1ce0m\u0180;os\u0326\u1cca\u1cd4nd\u0100;s\u0326\u1cd1uit;\u6666amma;\u43ddin;\u62f2\u0180;io\u1ce7\u1ce8\u1cf8\u40f7de\u8100\xf7;o\u1ce7\u1cf0ntimes;\u62c7n\xf8\u1cf7cy;\u4452c\u026f\u1d06\0\0\u1d0arn;\u631eop;\u630d\u0280lptuw\u1d18\u1d1d\u1d22\u1d49\u1d55lar;\u4024f;\uc000\ud835\udd55\u0280;emps\u030b\u1d2d\u1d37\u1d3d\u1d42q\u0100;d\u0352\u1d33ot;\u6251inus;\u6238lus;\u6214quare;\u62a1blebarwedg\xe5\xfan\u0180adh\u112e\u1d5d\u1d67ownarrow\xf3\u1c83arpoon\u0100lr\u1d72\u1d76ef\xf4\u1cb4igh\xf4\u1cb6\u0162\u1d7f\u1d85karo\xf7\u0f42\u026f\u1d8a\0\0\u1d8ern;\u631fop;\u630c\u0180cot\u1d98\u1da3\u1da6\u0100ry\u1d9d\u1da1;\uc000\ud835\udcb9;\u4455l;\u69f6rok;\u4111\u0100dr\u1db0\u1db4ot;\u62f1i\u0100;f\u1dba\u1816\u65bf\u0100ah\u1dc0\u1dc3r\xf2\u0429a\xf2\u0fa6angle;\u69a6\u0100ci\u1dd2\u1dd5y;\u445fgrarr;\u67ff\u0900Dacdefglmnopqrstux\u1e01\u1e09\u1e19\u1e38\u0578\u1e3c\u1e49\u1e61\u1e7e\u1ea5\u1eaf\u1ebd\u1ee1\u1f2a\u1f37\u1f44\u1f4e\u1f5a\u0100Do\u1e06\u1d34o\xf4\u1c89\u0100cs\u1e0e\u1e14ute\u803b\xe9\u40e9ter;\u6a6e\u0200aioy\u1e22\u1e27\u1e31\u1e36ron;\u411br\u0100;c\u1e2d\u1e2e\u6256\u803b\xea\u40ealon;\u6255;\u444dot;\u4117\u0100Dr\u1e41\u1e45ot;\u6252;\uc000\ud835\udd22\u0180;rs\u1e50\u1e51\u1e57\u6a9aave\u803b\xe8\u40e8\u0100;d\u1e5c\u1e5d\u6a96ot;\u6a98\u0200;ils\u1e6a\u1e6b\u1e72\u1e74\u6a99nters;\u63e7;\u6113\u0100;d\u1e79\u1e7a\u6a95ot;\u6a97\u0180aps\u1e85\u1e89\u1e97cr;\u4113ty\u0180;sv\u1e92\u1e93\u1e95\u6205et\xbb\u1e93p\u01001;\u1e9d\u1ea4\u0133\u1ea1\u1ea3;\u6004;\u6005\u6003\u0100gs\u1eaa\u1eac;\u414bp;\u6002\u0100gp\u1eb4\u1eb8on;\u4119f;\uc000\ud835\udd56\u0180als\u1ec4\u1ece\u1ed2r\u0100;s\u1eca\u1ecb\u62d5l;\u69e3us;\u6a71i\u0180;lv\u1eda\u1edb\u1edf\u43b5on\xbb\u1edb;\u43f5\u0200csuv\u1eea\u1ef3\u1f0b\u1f23\u0100io\u1eef\u1e31rc\xbb\u1e2e\u0269\u1ef9\0\0\u1efb\xed\u0548ant\u0100gl\u1f02\u1f06tr\xbb\u1e5dess\xbb\u1e7a\u0180aei\u1f12\u1f16\u1f1als;\u403dst;\u625fv\u0100;D\u0235\u1f20D;\u6a78parsl;\u69e5\u0100Da\u1f2f\u1f33ot;\u6253rr;\u6971\u0180cdi\u1f3e\u1f41\u1ef8r;\u612fo\xf4\u0352\u0100ah\u1f49\u1f4b;\u43b7\u803b\xf0\u40f0\u0100mr\u1f53\u1f57l\u803b\xeb\u40ebo;\u60ac\u0180cip\u1f61\u1f64\u1f67l;\u4021s\xf4\u056e\u0100eo\u1f6c\u1f74ctatio\xee\u0559nential\xe5\u0579\u09e1\u1f92\0\u1f9e\0\u1fa1\u1fa7\0\0\u1fc6\u1fcc\0\u1fd3\0\u1fe6\u1fea\u2000\0\u2008\u205allingdotse\xf1\u1e44y;\u4444male;\u6640\u0180ilr\u1fad\u1fb3\u1fc1lig;\u8000\ufb03\u0269\u1fb9\0\0\u1fbdg;\u8000\ufb00ig;\u8000\ufb04;\uc000\ud835\udd23lig;\u8000\ufb01lig;\uc000fj\u0180alt\u1fd9\u1fdc\u1fe1t;\u666dig;\u8000\ufb02ns;\u65b1of;\u4192\u01f0\u1fee\0\u1ff3f;\uc000\ud835\udd57\u0100ak\u05bf\u1ff7\u0100;v\u1ffc\u1ffd\u62d4;\u6ad9artint;\u6a0d\u0100ao\u200c\u2055\u0100cs\u2011\u2052\u03b1\u201a\u2030\u2038\u2045\u2048\0\u2050\u03b2\u2022\u2025\u2027\u202a\u202c\0\u202e\u803b\xbd\u40bd;\u6153\u803b\xbc\u40bc;\u6155;\u6159;\u615b\u01b3\u2034\0\u2036;\u6154;\u6156\u02b4\u203e\u2041\0\0\u2043\u803b\xbe\u40be;\u6157;\u615c5;\u6158\u01b6\u204c\0\u204e;\u615a;\u615d8;\u615el;\u6044wn;\u6322cr;\uc000\ud835\udcbb\u0880Eabcdefgijlnorstv\u2082\u2089\u209f\u20a5\u20b0\u20b4\u20f0\u20f5\u20fa\u20ff\u2103\u2112\u2138\u0317\u213e\u2152\u219e\u0100;l\u064d\u2087;\u6a8c\u0180cmp\u2090\u2095\u209dute;\u41f5ma\u0100;d\u209c\u1cda\u43b3;\u6a86reve;\u411f\u0100iy\u20aa\u20aerc;\u411d;\u4433ot;\u4121\u0200;lqs\u063e\u0642\u20bd\u20c9\u0180;qs\u063e\u064c\u20c4lan\xf4\u0665\u0200;cdl\u0665\u20d2\u20d5\u20e5c;\u6aa9ot\u0100;o\u20dc\u20dd\u6a80\u0100;l\u20e2\u20e3\u6a82;\u6a84\u0100;e\u20ea\u20ed\uc000\u22db\ufe00s;\u6a94r;\uc000\ud835\udd24\u0100;g\u0673\u061bmel;\u6137cy;\u4453\u0200;Eaj\u065a\u210c\u210e\u2110;\u6a92;\u6aa5;\u6aa4\u0200Eaes\u211b\u211d\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6a8arox\xbb\u2124\u0100;q\u212e\u212f\u6a88\u0100;q\u212e\u211bim;\u62e7pf;\uc000\ud835\udd58\u0100ci\u2143\u2146r;\u610am\u0180;el\u066b\u214e\u2150;\u6a8e;\u6a90\u8300>;cdlqr\u05ee\u2160\u216a\u216e\u2173\u2179\u0100ci\u2165\u2167;\u6aa7r;\u6a7aot;\u62d7Par;\u6995uest;\u6a7c\u0280adels\u2184\u216a\u2190\u0656\u219b\u01f0\u2189\0\u218epro\xf8\u209er;\u6978q\u0100lq\u063f\u2196les\xf3\u2088i\xed\u066b\u0100en\u21a3\u21adrtneqq;\uc000\u2269\ufe00\xc5\u21aa\u0500Aabcefkosy\u21c4\u21c7\u21f1\u21f5\u21fa\u2218\u221d\u222f\u2268\u227dr\xf2\u03a0\u0200ilmr\u21d0\u21d4\u21d7\u21dbrs\xf0\u1484f\xbb\u2024il\xf4\u06a9\u0100dr\u21e0\u21e4cy;\u444a\u0180;cw\u08f4\u21eb\u21efir;\u6948;\u61adar;\u610firc;\u4125\u0180alr\u2201\u220e\u2213rts\u0100;u\u2209\u220a\u6665it\xbb\u220alip;\u6026con;\u62b9r;\uc000\ud835\udd25s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223a\u223e\u2243\u225e\u2263rr;\u61fftht;\u623bk\u0100lr\u2249\u2253eftarrow;\u61a9ightarrow;\u61aaf;\uc000\ud835\udd59bar;\u6015\u0180clt\u226f\u2274\u2278r;\uc000\ud835\udcbdas\xe8\u21f4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xbb\u1c5b\u0ae1\u22a3\0\u22aa\0\u22b8\u22c5\u22ce\0\u22d5\u22f3\0\0\u22f8\u2322\u2367\u2362\u237f\0\u2386\u23aa\u23b4cute\u803b\xed\u40ed\u0180;iy\u0771\u22b0\u22b5rc\u803b\xee\u40ee;\u4438\u0100cx\u22bc\u22bfy;\u4435cl\u803b\xa1\u40a1\u0100fr\u039f\u22c9;\uc000\ud835\udd26rave\u803b\xec\u40ec\u0200;ino\u073e\u22dd\u22e9\u22ee\u0100in\u22e2\u22e6nt;\u6a0ct;\u622dfin;\u69dcta;\u6129lig;\u4133\u0180aop\u22fe\u231a\u231d\u0180cgt\u2305\u2308\u2317r;\u412b\u0180elp\u071f\u230f\u2313in\xe5\u078ear\xf4\u0720h;\u4131f;\u62b7ed;\u41b5\u0280;cfot\u04f4\u232c\u2331\u233d\u2341are;\u6105in\u0100;t\u2338\u2339\u621eie;\u69dddo\xf4\u2319\u0280;celp\u0757\u234c\u2350\u235b\u2361al;\u62ba\u0100gr\u2355\u2359er\xf3\u1563\xe3\u234darhk;\u6a17rod;\u6a3c\u0200cgpt\u236f\u2372\u2376\u237by;\u4451on;\u412ff;\uc000\ud835\udd5aa;\u43b9uest\u803b\xbf\u40bf\u0100ci\u238a\u238fr;\uc000\ud835\udcben\u0280;Edsv\u04f4\u239b\u239d\u23a1\u04f3;\u62f9ot;\u62f5\u0100;v\u23a6\u23a7\u62f4;\u62f3\u0100;i\u0777\u23aelde;\u4129\u01eb\u23b8\0\u23bccy;\u4456l\u803b\xef\u40ef\u0300cfmosu\u23cc\u23d7\u23dc\u23e1\u23e7\u23f5\u0100iy\u23d1\u23d5rc;\u4135;\u4439r;\uc000\ud835\udd27ath;\u4237pf;\uc000\ud835\udd5b\u01e3\u23ec\0\u23f1r;\uc000\ud835\udcbfrcy;\u4458kcy;\u4454\u0400acfghjos\u240b\u2416\u2422\u2427\u242d\u2431\u2435\u243bppa\u0100;v\u2413\u2414\u43ba;\u43f0\u0100ey\u241b\u2420dil;\u4137;\u443ar;\uc000\ud835\udd28reen;\u4138cy;\u4445cy;\u445cpf;\uc000\ud835\udd5ccr;\uc000\ud835\udcc0\u0b80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248d\u2491\u250e\u253d\u255a\u2580\u264e\u265e\u2665\u2679\u267d\u269a\u26b2\u26d8\u275d\u2768\u278b\u27c0\u2801\u2812\u0180art\u2477\u247a\u247cr\xf2\u09c6\xf2\u0395ail;\u691barr;\u690e\u0100;g\u0994\u248b;\u6a8bar;\u6962\u0963\u24a5\0\u24aa\0\u24b1\0\0\0\0\0\u24b5\u24ba\0\u24c6\u24c8\u24cd\0\u24f9ute;\u413amptyv;\u69b4ra\xee\u084cbda;\u43bbg\u0180;dl\u088e\u24c1\u24c3;\u6991\xe5\u088e;\u6a85uo\u803b\xab\u40abr\u0400;bfhlpst\u0899\u24de\u24e6\u24e9\u24eb\u24ee\u24f1\u24f5\u0100;f\u089d\u24e3s;\u691fs;\u691d\xeb\u2252p;\u61abl;\u6939im;\u6973l;\u61a2\u0180;ae\u24ff\u2500\u2504\u6aabil;\u6919\u0100;s\u2509\u250a\u6aad;\uc000\u2aad\ufe00\u0180abr\u2515\u2519\u251drr;\u690crk;\u6772\u0100ak\u2522\u252cc\u0100ek\u2528\u252a;\u407b;\u405b\u0100es\u2531\u2533;\u698bl\u0100du\u2539\u253b;\u698f;\u698d\u0200aeuy\u2546\u254b\u2556\u2558ron;\u413e\u0100di\u2550\u2554il;\u413c\xec\u08b0\xe2\u2529;\u443b\u0200cqrs\u2563\u2566\u256d\u257da;\u6936uo\u0100;r\u0e19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694bh;\u61b2\u0280;fgqs\u258b\u258c\u0989\u25f3\u25ff\u6264t\u0280ahlrt\u2598\u25a4\u25b7\u25c2\u25e8rrow\u0100;t\u0899\u25a1a\xe9\u24f6arpoon\u0100du\u25af\u25b4own\xbb\u045ap\xbb\u0966eftarrows;\u61c7ight\u0180ahs\u25cd\u25d6\u25derrow\u0100;s\u08f4\u08a7arpoon\xf3\u0f98quigarro\xf7\u21f0hreetimes;\u62cb\u0180;qs\u258b\u0993\u25falan\xf4\u09ac\u0280;cdgs\u09ac\u260a\u260d\u261d\u2628c;\u6aa8ot\u0100;o\u2614\u2615\u6a7f\u0100;r\u261a\u261b\u6a81;\u6a83\u0100;e\u2622\u2625\uc000\u22da\ufe00s;\u6a93\u0280adegs\u2633\u2639\u263d\u2649\u264bppro\xf8\u24c6ot;\u62d6q\u0100gq\u2643\u2645\xf4\u0989gt\xf2\u248c\xf4\u099bi\xed\u09b2\u0180ilr\u2655\u08e1\u265asht;\u697c;\uc000\ud835\udd29\u0100;E\u099c\u2663;\u6a91\u0161\u2669\u2676r\u0100du\u25b2\u266e\u0100;l\u0965\u2673;\u696alk;\u6584cy;\u4459\u0280;acht\u0a48\u2688\u268b\u2691\u2696r\xf2\u25c1orne\xf2\u1d08ard;\u696bri;\u65fa\u0100io\u269f\u26a4dot;\u4140ust\u0100;a\u26ac\u26ad\u63b0che\xbb\u26ad\u0200Eaes\u26bb\u26bd\u26c9\u26d4;\u6268p\u0100;p\u26c3\u26c4\u6a89rox\xbb\u26c4\u0100;q\u26ce\u26cf\u6a87\u0100;q\u26ce\u26bbim;\u62e6\u0400abnoptwz\u26e9\u26f4\u26f7\u271a\u272f\u2741\u2747\u2750\u0100nr\u26ee\u26f1g;\u67ecr;\u61fdr\xeb\u08c1g\u0180lmr\u26ff\u270d\u2714eft\u0100ar\u09e6\u2707ight\xe1\u09f2apsto;\u67fcight\xe1\u09fdparrow\u0100lr\u2725\u2729ef\xf4\u24edight;\u61ac\u0180afl\u2736\u2739\u273dr;\u6985;\uc000\ud835\udd5dus;\u6a2dimes;\u6a34\u0161\u274b\u274fst;\u6217\xe1\u134e\u0180;ef\u2757\u2758\u1800\u65cange\xbb\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277c\u2785\u2787r\xf2\u08a8orne\xf2\u1d8car\u0100;d\u0f98\u2783;\u696d;\u600eri;\u62bf\u0300achiqt\u2798\u279d\u0a40\u27a2\u27ae\u27bbquo;\u6039r;\uc000\ud835\udcc1m\u0180;eg\u09b2\u27aa\u27ac;\u6a8d;\u6a8f\u0100bu\u252a\u27b3o\u0100;r\u0e1f\u27b9;\u601arok;\u4142\u8400<;cdhilqr\u082b\u27d2\u2639\u27dc\u27e0\u27e5\u27ea\u27f0\u0100ci\u27d7\u27d9;\u6aa6r;\u6a79re\xe5\u25f2mes;\u62c9arr;\u6976uest;\u6a7b\u0100Pi\u27f5\u27f9ar;\u6996\u0180;ef\u2800\u092d\u181b\u65c3r\u0100du\u2807\u280dshar;\u694ahar;\u6966\u0100en\u2817\u2821rtneqq;\uc000\u2268\ufe00\xc5\u281e\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288e\u2893\u28a0\u28a5\u28a8\u28da\u28e2\u28e4\u0a83\u28f3\u2902Dot;\u623a\u0200clpr\u284e\u2852\u2863\u287dr\u803b\xaf\u40af\u0100et\u2857\u2859;\u6642\u0100;e\u285e\u285f\u6720se\xbb\u285f\u0100;s\u103b\u2868to\u0200;dlu\u103b\u2873\u2877\u287bow\xee\u048cef\xf4\u090f\xf0\u13d1ker;\u65ae\u0100oy\u2887\u288cmma;\u6a29;\u443cash;\u6014asuredangle\xbb\u1626r;\uc000\ud835\udd2ao;\u6127\u0180cdn\u28af\u28b4\u28c9ro\u803b\xb5\u40b5\u0200;acd\u1464\u28bd\u28c0\u28c4s\xf4\u16a7ir;\u6af0ot\u80bb\xb7\u01b5us\u0180;bd\u28d2\u1903\u28d3\u6212\u0100;u\u1d3c\u28d8;\u6a2a\u0163\u28de\u28e1p;\u6adb\xf2\u2212\xf0\u0a81\u0100dp\u28e9\u28eeels;\u62a7f;\uc000\ud835\udd5e\u0100ct\u28f8\u28fdr;\uc000\ud835\udcc2pos\xbb\u159d\u0180;lm\u2909\u290a\u290d\u43bctimap;\u62b8\u0c00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297e\u2989\u2998\u29da\u29e9\u2a15\u2a1a\u2a58\u2a5d\u2a83\u2a95\u2aa4\u2aa8\u2b04\u2b07\u2b44\u2b7f\u2bae\u2c34\u2c67\u2c7c\u2ce9\u0100gt\u2947\u294b;\uc000\u22d9\u0338\u0100;v\u2950\u0bcf\uc000\u226b\u20d2\u0180elt\u295a\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61cdightarrow;\u61ce;\uc000\u22d8\u0338\u0100;v\u297b\u0c47\uc000\u226a\u20d2ightarrow;\u61cf\u0100Dd\u298e\u2993ash;\u62afash;\u62ae\u0280bcnpt\u29a3\u29a7\u29ac\u29b1\u29ccla\xbb\u02deute;\u4144g;\uc000\u2220\u20d2\u0280;Eiop\u0d84\u29bc\u29c0\u29c5\u29c8;\uc000\u2a70\u0338d;\uc000\u224b\u0338s;\u4149ro\xf8\u0d84ur\u0100;a\u29d3\u29d4\u666el\u0100;s\u29d3\u0b38\u01f3\u29df\0\u29e3p\u80bb\xa0\u0b37mp\u0100;e\u0bf9\u0c00\u0280aeouy\u29f4\u29fe\u2a03\u2a10\u2a13\u01f0\u29f9\0\u29fb;\u6a43on;\u4148dil;\u4146ng\u0100;d\u0d7e\u2a0aot;\uc000\u2a6d\u0338p;\u6a42;\u443dash;\u6013\u0380;Aadqsx\u0b92\u2a29\u2a2d\u2a3b\u2a41\u2a45\u2a50rr;\u61d7r\u0100hr\u2a33\u2a36k;\u6924\u0100;o\u13f2\u13f0ot;\uc000\u2250\u0338ui\xf6\u0b63\u0100ei\u2a4a\u2a4ear;\u6928\xed\u0b98ist\u0100;s\u0ba0\u0b9fr;\uc000\ud835\udd2b\u0200Eest\u0bc5\u2a66\u2a79\u2a7c\u0180;qs\u0bbc\u2a6d\u0be1\u0180;qs\u0bbc\u0bc5\u2a74lan\xf4\u0be2i\xed\u0bea\u0100;r\u0bb6\u2a81\xbb\u0bb7\u0180Aap\u2a8a\u2a8d\u2a91r\xf2\u2971rr;\u61aear;\u6af2\u0180;sv\u0f8d\u2a9c\u0f8c\u0100;d\u2aa1\u2aa2\u62fc;\u62facy;\u445a\u0380AEadest\u2ab7\u2aba\u2abe\u2ac2\u2ac5\u2af6\u2af9r\xf2\u2966;\uc000\u2266\u0338rr;\u619ar;\u6025\u0200;fqs\u0c3b\u2ace\u2ae3\u2aeft\u0100ar\u2ad4\u2ad9rro\xf7\u2ac1ightarro\xf7\u2a90\u0180;qs\u0c3b\u2aba\u2aealan\xf4\u0c55\u0100;s\u0c55\u2af4\xbb\u0c36i\xed\u0c5d\u0100;r\u0c35\u2afei\u0100;e\u0c1a\u0c25i\xe4\u0d90\u0100pt\u2b0c\u2b11f;\uc000\ud835\udd5f\u8180\xac;in\u2b19\u2b1a\u2b36\u40acn\u0200;Edv\u0b89\u2b24\u2b28\u2b2e;\uc000\u22f9\u0338ot;\uc000\u22f5\u0338\u01e1\u0b89\u2b33\u2b35;\u62f7;\u62f6i\u0100;v\u0cb8\u2b3c\u01e1\u0cb8\u2b41\u2b43;\u62fe;\u62fd\u0180aor\u2b4b\u2b63\u2b69r\u0200;ast\u0b7b\u2b55\u2b5a\u2b5flle\xec\u0b7bl;\uc000\u2afd\u20e5;\uc000\u2202\u0338lint;\u6a14\u0180;ce\u0c92\u2b70\u2b73u\xe5\u0ca5\u0100;c\u0c98\u2b78\u0100;e\u0c92\u2b7d\xf1\u0c98\u0200Aait\u2b88\u2b8b\u2b9d\u2ba7r\xf2\u2988rr\u0180;cw\u2b94\u2b95\u2b99\u619b;\uc000\u2933\u0338;\uc000\u219d\u0338ghtarrow\xbb\u2b95ri\u0100;e\u0ccb\u0cd6\u0380chimpqu\u2bbd\u2bcd\u2bd9\u2b04\u0b78\u2be4\u2bef\u0200;cer\u0d32\u2bc6\u0d37\u2bc9u\xe5\u0d45;\uc000\ud835\udcc3ort\u026d\u2b05\0\0\u2bd6ar\xe1\u2b56m\u0100;e\u0d6e\u2bdf\u0100;q\u0d74\u0d73su\u0100bp\u2beb\u2bed\xe5\u0cf8\xe5\u0d0b\u0180bcp\u2bf6\u2c11\u2c19\u0200;Ees\u2bff\u2c00\u0d22\u2c04\u6284;\uc000\u2ac5\u0338et\u0100;e\u0d1b\u2c0bq\u0100;q\u0d23\u2c00c\u0100;e\u0d32\u2c17\xf1\u0d38\u0200;Ees\u2c22\u2c23\u0d5f\u2c27\u6285;\uc000\u2ac6\u0338et\u0100;e\u0d58\u2c2eq\u0100;q\u0d60\u2c23\u0200gilr\u2c3d\u2c3f\u2c45\u2c47\xec\u0bd7lde\u803b\xf1\u40f1\xe7\u0c43iangle\u0100lr\u2c52\u2c5ceft\u0100;e\u0c1a\u2c5a\xf1\u0c26ight\u0100;e\u0ccb\u2c65\xf1\u0cd7\u0100;m\u2c6c\u2c6d\u43bd\u0180;es\u2c74\u2c75\u2c79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2c8f\u2c94\u2c99\u2c9e\u2ca3\u2cb0\u2cb6\u2cd3\u2ce3ash;\u62adarr;\u6904p;\uc000\u224d\u20d2ash;\u62ac\u0100et\u2ca8\u2cac;\uc000\u2265\u20d2;\uc000>\u20d2nfin;\u69de\u0180Aet\u2cbd\u2cc1\u2cc5rr;\u6902;\uc000\u2264\u20d2\u0100;r\u2cca\u2ccd\uc000<\u20d2ie;\uc000\u22b4\u20d2\u0100At\u2cd8\u2cdcrr;\u6903rie;\uc000\u22b5\u20d2im;\uc000\u223c\u20d2\u0180Aan\u2cf0\u2cf4\u2d02rr;\u61d6r\u0100hr\u2cfa\u2cfdk;\u6923\u0100;o\u13e7\u13e5ear;\u6927\u1253\u1a95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2d2d\0\u2d38\u2d48\u2d60\u2d65\u2d72\u2d84\u1b07\0\0\u2d8d\u2dab\0\u2dc8\u2dce\0\u2ddc\u2e19\u2e2b\u2e3e\u2e43\u0100cs\u2d31\u1a97ute\u803b\xf3\u40f3\u0100iy\u2d3c\u2d45r\u0100;c\u1a9e\u2d42\u803b\xf4\u40f4;\u443e\u0280abios\u1aa0\u2d52\u2d57\u01c8\u2d5alac;\u4151v;\u6a38old;\u69bclig;\u4153\u0100cr\u2d69\u2d6dir;\u69bf;\uc000\ud835\udd2c\u036f\u2d79\0\0\u2d7c\0\u2d82n;\u42dbave\u803b\xf2\u40f2;\u69c1\u0100bm\u2d88\u0df4ar;\u69b5\u0200acit\u2d95\u2d98\u2da5\u2da8r\xf2\u1a80\u0100ir\u2d9d\u2da0r;\u69beoss;\u69bbn\xe5\u0e52;\u69c0\u0180aei\u2db1\u2db5\u2db9cr;\u414dga;\u43c9\u0180cdn\u2dc0\u2dc5\u01cdron;\u43bf;\u69b6pf;\uc000\ud835\udd60\u0180ael\u2dd4\u2dd7\u01d2r;\u69b7rp;\u69b9\u0380;adiosv\u2dea\u2deb\u2dee\u2e08\u2e0d\u2e10\u2e16\u6228r\xf2\u1a86\u0200;efm\u2df7\u2df8\u2e02\u2e05\u6a5dr\u0100;o\u2dfe\u2dff\u6134f\xbb\u2dff\u803b\xaa\u40aa\u803b\xba\u40bagof;\u62b6r;\u6a56lope;\u6a57;\u6a5b\u0180clo\u2e1f\u2e21\u2e27\xf2\u2e01ash\u803b\xf8\u40f8l;\u6298i\u016c\u2e2f\u2e34de\u803b\xf5\u40f5es\u0100;a\u01db\u2e3as;\u6a36ml\u803b\xf6\u40f6bar;\u633d\u0ae1\u2e5e\0\u2e7d\0\u2e80\u2e9d\0\u2ea2\u2eb9\0\0\u2ecb\u0e9c\0\u2f13\0\0\u2f2b\u2fbc\0\u2fc8r\u0200;ast\u0403\u2e67\u2e72\u0e85\u8100\xb6;l\u2e6d\u2e6e\u40b6le\xec\u0403\u0269\u2e78\0\0\u2e7bm;\u6af3;\u6afdy;\u443fr\u0280cimpt\u2e8b\u2e8f\u2e93\u1865\u2e97nt;\u4025od;\u402eil;\u6030enk;\u6031r;\uc000\ud835\udd2d\u0180imo\u2ea8\u2eb0\u2eb4\u0100;v\u2ead\u2eae\u43c6;\u43d5ma\xf4\u0a76ne;\u660e\u0180;tv\u2ebf\u2ec0\u2ec8\u43c0chfork\xbb\u1ffd;\u43d6\u0100au\u2ecf\u2edfn\u0100ck\u2ed5\u2eddk\u0100;h\u21f4\u2edb;\u610e\xf6\u21f4s\u0480;abcdemst\u2ef3\u2ef4\u1908\u2ef9\u2efd\u2f04\u2f06\u2f0a\u2f0e\u402bcir;\u6a23ir;\u6a22\u0100ou\u1d40\u2f02;\u6a25;\u6a72n\u80bb\xb1\u0e9dim;\u6a26wo;\u6a27\u0180ipu\u2f19\u2f20\u2f25ntint;\u6a15f;\uc000\ud835\udd61nd\u803b\xa3\u40a3\u0500;Eaceinosu\u0ec8\u2f3f\u2f41\u2f44\u2f47\u2f81\u2f89\u2f92\u2f7e\u2fb6;\u6ab3p;\u6ab7u\xe5\u0ed9\u0100;c\u0ece\u2f4c\u0300;acens\u0ec8\u2f59\u2f5f\u2f66\u2f68\u2f7eppro\xf8\u2f43urlye\xf1\u0ed9\xf1\u0ece\u0180aes\u2f6f\u2f76\u2f7approx;\u6ab9qq;\u6ab5im;\u62e8i\xed\u0edfme\u0100;s\u2f88\u0eae\u6032\u0180Eas\u2f78\u2f90\u2f7a\xf0\u2f75\u0180dfp\u0eec\u2f99\u2faf\u0180als\u2fa0\u2fa5\u2faalar;\u632eine;\u6312urf;\u6313\u0100;t\u0efb\u2fb4\xef\u0efbrel;\u62b0\u0100ci\u2fc0\u2fc5r;\uc000\ud835\udcc5;\u43c8ncsp;\u6008\u0300fiopsu\u2fda\u22e2\u2fdf\u2fe5\u2feb\u2ff1r;\uc000\ud835\udd2epf;\uc000\ud835\udd62rime;\u6057cr;\uc000\ud835\udcc6\u0180aeo\u2ff8\u3009\u3013t\u0100ei\u2ffe\u3005rnion\xf3\u06b0nt;\u6a16st\u0100;e\u3010\u3011\u403f\xf1\u1f19\xf4\u0f14\u0a80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30e0\u310e\u312b\u3147\u3162\u3172\u318e\u3206\u3215\u3224\u3229\u3258\u326e\u3272\u3290\u32b0\u32b7\u0180art\u3047\u304a\u304cr\xf2\u10b3\xf2\u03ddail;\u691car\xf2\u1c65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307f\u308f\u3094\u30cc\u0100eu\u306d\u3071;\uc000\u223d\u0331te;\u4155i\xe3\u116emptyv;\u69b3g\u0200;del\u0fd1\u3089\u308b\u308d;\u6992;\u69a5\xe5\u0fd1uo\u803b\xbb\u40bbr\u0580;abcfhlpstw\u0fdc\u30ac\u30af\u30b7\u30b9\u30bc\u30be\u30c0\u30c3\u30c7\u30cap;\u6975\u0100;f\u0fe0\u30b4s;\u6920;\u6933s;\u691e\xeb\u225d\xf0\u272el;\u6945im;\u6974l;\u61a3;\u619d\u0100ai\u30d1\u30d5il;\u691ao\u0100;n\u30db\u30dc\u6236al\xf3\u0f1e\u0180abr\u30e7\u30ea\u30eer\xf2\u17e5rk;\u6773\u0100ak\u30f3\u30fdc\u0100ek\u30f9\u30fb;\u407d;\u405d\u0100es\u3102\u3104;\u698cl\u0100du\u310a\u310c;\u698e;\u6990\u0200aeuy\u3117\u311c\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xec\u0ff2\xe2\u30fa;\u4440\u0200clqs\u3134\u3137\u313d\u3144a;\u6937dhar;\u6969uo\u0100;r\u020e\u020dh;\u61b3\u0180acg\u314e\u315f\u0f44l\u0200;ips\u0f78\u3158\u315b\u109cn\xe5\u10bbar\xf4\u0fa9t;\u65ad\u0180ilr\u3169\u1023\u316esht;\u697d;\uc000\ud835\udd2f\u0100ao\u3177\u3186r\u0100du\u317d\u317f\xbb\u047b\u0100;l\u1091\u3184;\u696c\u0100;v\u318b\u318c\u43c1;\u43f1\u0180gns\u3195\u31f9\u31fcht\u0300ahlrst\u31a4\u31b0\u31c2\u31d8\u31e4\u31eerrow\u0100;t\u0fdc\u31ada\xe9\u30c8arpoon\u0100du\u31bb\u31bfow\xee\u317ep\xbb\u1092eft\u0100ah\u31ca\u31d0rrow\xf3\u0feaarpoon\xf3\u0551ightarrows;\u61c9quigarro\xf7\u30cbhreetimes;\u62ccg;\u42daingdotse\xf1\u1f32\u0180ahm\u320d\u3210\u3213r\xf2\u0feaa\xf2\u0551;\u600foust\u0100;a\u321e\u321f\u63b1che\xbb\u321fmid;\u6aee\u0200abpt\u3232\u323d\u3240\u3252\u0100nr\u3237\u323ag;\u67edr;\u61fer\xeb\u1003\u0180afl\u3247\u324a\u324er;\u6986;\uc000\ud835\udd63us;\u6a2eimes;\u6a35\u0100ap\u325d\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6a12ar\xf2\u31e3\u0200achq\u327b\u3280\u10bc\u3285quo;\u603ar;\uc000\ud835\udcc7\u0100bu\u30fb\u328ao\u0100;r\u0214\u0213\u0180hir\u3297\u329b\u32a0re\xe5\u31f8mes;\u62cai\u0200;efl\u32aa\u1059\u1821\u32ab\u65b9tri;\u69celuhar;\u6968;\u611e\u0d61\u32d5\u32db\u32df\u332c\u3338\u3371\0\u337a\u33a4\0\0\u33ec\u33f0\0\u3428\u3448\u345a\u34ad\u34b1\u34ca\u34f1\0\u3616\0\0\u3633cute;\u415bqu\xef\u27ba\u0500;Eaceinpsy\u11ed\u32f3\u32f5\u32ff\u3302\u330b\u330f\u331f\u3326\u3329;\u6ab4\u01f0\u32fa\0\u32fc;\u6ab8on;\u4161u\xe5\u11fe\u0100;d\u11f3\u3307il;\u415frc;\u415d\u0180Eas\u3316\u3318\u331b;\u6ab6p;\u6abaim;\u62e9olint;\u6a13i\xed\u1204;\u4441ot\u0180;be\u3334\u1d47\u3335\u62c5;\u6a66\u0380Aacmstx\u3346\u334a\u3357\u335b\u335e\u3363\u336drr;\u61d8r\u0100hr\u3350\u3352\xeb\u2228\u0100;o\u0a36\u0a34t\u803b\xa7\u40a7i;\u403bwar;\u6929m\u0100in\u3369\xf0nu\xf3\xf1t;\u6736r\u0100;o\u3376\u2055\uc000\ud835\udd30\u0200acoy\u3382\u3386\u3391\u33a0rp;\u666f\u0100hy\u338b\u338fcy;\u4449;\u4448rt\u026d\u3399\0\0\u339ci\xe4\u1464ara\xec\u2e6f\u803b\xad\u40ad\u0100gm\u33a8\u33b4ma\u0180;fv\u33b1\u33b2\u33b2\u43c3;\u43c2\u0400;deglnpr\u12ab\u33c5\u33c9\u33ce\u33d6\u33de\u33e1\u33e6ot;\u6a6a\u0100;q\u12b1\u12b0\u0100;E\u33d3\u33d4\u6a9e;\u6aa0\u0100;E\u33db\u33dc\u6a9d;\u6a9fe;\u6246lus;\u6a24arr;\u6972ar\xf2\u113d\u0200aeit\u33f8\u3408\u340f\u3417\u0100ls\u33fd\u3404lsetm\xe9\u336ahp;\u6a33parsl;\u69e4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341c\u341d\u6aaa\u0100;s\u3422\u3423\u6aac;\uc000\u2aac\ufe00\u0180flp\u342e\u3433\u3442tcy;\u444c\u0100;b\u3438\u3439\u402f\u0100;a\u343e\u343f\u69c4r;\u633ff;\uc000\ud835\udd64a\u0100dr\u344d\u0402es\u0100;u\u3454\u3455\u6660it\xbb\u3455\u0180csu\u3460\u3479\u349f\u0100au\u3465\u346fp\u0100;s\u1188\u346b;\uc000\u2293\ufe00p\u0100;s\u11b4\u3475;\uc000\u2294\ufe00u\u0100bp\u347f\u348f\u0180;es\u1197\u119c\u3486et\u0100;e\u1197\u348d\xf1\u119d\u0180;es\u11a8\u11ad\u3496et\u0100;e\u11a8\u349d\xf1\u11ae\u0180;af\u117b\u34a6\u05b0r\u0165\u34ab\u05b1\xbb\u117car\xf2\u1148\u0200cemt\u34b9\u34be\u34c2\u34c5r;\uc000\ud835\udcc8tm\xee\xf1i\xec\u3415ar\xe6\u11be\u0100ar\u34ce\u34d5r\u0100;f\u34d4\u17bf\u6606\u0100an\u34da\u34edight\u0100ep\u34e3\u34eapsilo\xee\u1ee0h\xe9\u2eafs\xbb\u2852\u0280bcmnp\u34fb\u355e\u1209\u358b\u358e\u0480;Edemnprs\u350e\u350f\u3511\u3515\u351e\u3523\u352c\u3531\u3536\u6282;\u6ac5ot;\u6abd\u0100;d\u11da\u351aot;\u6ac3ult;\u6ac1\u0100Ee\u3528\u352a;\u6acb;\u628alus;\u6abfarr;\u6979\u0180eiu\u353d\u3552\u3555t\u0180;en\u350e\u3545\u354bq\u0100;q\u11da\u350feq\u0100;q\u352b\u3528m;\u6ac7\u0100bp\u355a\u355c;\u6ad5;\u6ad3c\u0300;acens\u11ed\u356c\u3572\u3579\u357b\u3326ppro\xf8\u32faurlye\xf1\u11fe\xf1\u11f3\u0180aes\u3582\u3588\u331bppro\xf8\u331aq\xf1\u3317g;\u666a\u0680123;Edehlmnps\u35a9\u35ac\u35af\u121c\u35b2\u35b4\u35c0\u35c9\u35d5\u35da\u35df\u35e8\u35ed\u803b\xb9\u40b9\u803b\xb2\u40b2\u803b\xb3\u40b3;\u6ac6\u0100os\u35b9\u35bct;\u6abeub;\u6ad8\u0100;d\u1222\u35c5ot;\u6ac4s\u0100ou\u35cf\u35d2l;\u67c9b;\u6ad7arr;\u697bult;\u6ac2\u0100Ee\u35e4\u35e6;\u6acc;\u628blus;\u6ac0\u0180eiu\u35f4\u3609\u360ct\u0180;en\u121c\u35fc\u3602q\u0100;q\u1222\u35b2eq\u0100;q\u35e7\u35e4m;\u6ac8\u0100bp\u3611\u3613;\u6ad4;\u6ad6\u0180Aan\u361c\u3620\u362drr;\u61d9r\u0100hr\u3626\u3628\xeb\u222e\u0100;o\u0a2b\u0a29war;\u692alig\u803b\xdf\u40df\u0be1\u3651\u365d\u3660\u12ce\u3673\u3679\0\u367e\u36c2\0\0\0\0\0\u36db\u3703\0\u3709\u376c\0\0\0\u3787\u0272\u3656\0\0\u365bget;\u6316;\u43c4r\xeb\u0e5f\u0180aey\u3666\u366b\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uc000\ud835\udd31\u0200eiko\u3686\u369d\u36b5\u36bc\u01f2\u368b\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369b\u43b8ym;\u43d1\u0100cn\u36a2\u36b2k\u0100as\u36a8\u36aeppro\xf8\u12c1im\xbb\u12acs\xf0\u129e\u0100as\u36ba\u36ae\xf0\u12c1rn\u803b\xfe\u40fe\u01ec\u031f\u36c6\u22e7es\u8180\xd7;bd\u36cf\u36d0\u36d8\u40d7\u0100;a\u190f\u36d5r;\u6a31;\u6a30\u0180eps\u36e1\u36e3\u3700\xe1\u2a4d\u0200;bcf\u0486\u36ec\u36f0\u36f4ot;\u6336ir;\u6af1\u0100;o\u36f9\u36fc\uc000\ud835\udd65rk;\u6ada\xe1\u3362rime;\u6034\u0180aip\u370f\u3712\u3764d\xe5\u1248\u0380adempst\u3721\u374d\u3740\u3751\u3757\u375c\u375fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65b5own\xbb\u1dbbeft\u0100;e\u2800\u373e\xf1\u092e;\u625cight\u0100;e\u32aa\u374b\xf1\u105aot;\u65ecinus;\u6a3alus;\u6a39b;\u69cdime;\u6a3bezium;\u63e2\u0180cht\u3772\u377d\u3781\u0100ry\u3777\u377b;\uc000\ud835\udcc9;\u4446cy;\u445brok;\u4167\u0100io\u378b\u378ex\xf4\u1777head\u0100lr\u3797\u37a0eftarro\xf7\u084fightarrow\xbb\u0f5d\u0900AHabcdfghlmoprstuw\u37d0\u37d3\u37d7\u37e4\u37f0\u37fc\u380e\u381c\u3823\u3834\u3851\u385d\u386b\u38a9\u38cc\u38d2\u38ea\u38f6r\xf2\u03edar;\u6963\u0100cr\u37dc\u37e2ute\u803b\xfa\u40fa\xf2\u1150r\u01e3\u37ea\0\u37edy;\u445eve;\u416d\u0100iy\u37f5\u37farc\u803b\xfb\u40fb;\u4443\u0180abh\u3803\u3806\u380br\xf2\u13adlac;\u4171a\xf2\u13c3\u0100ir\u3813\u3818sht;\u697e;\uc000\ud835\udd32rave\u803b\xf9\u40f9\u0161\u3827\u3831r\u0100lr\u382c\u382e\xbb\u0957\xbb\u1083lk;\u6580\u0100ct\u3839\u384d\u026f\u383f\0\0\u384arn\u0100;e\u3845\u3846\u631cr\xbb\u3846op;\u630fri;\u65f8\u0100al\u3856\u385acr;\u416b\u80bb\xa8\u0349\u0100gp\u3862\u3866on;\u4173f;\uc000\ud835\udd66\u0300adhlsu\u114b\u3878\u387d\u1372\u3891\u38a0own\xe1\u13b3arpoon\u0100lr\u3888\u388cef\xf4\u382digh\xf4\u382fi\u0180;hl\u3899\u389a\u389c\u43c5\xbb\u13faon\xbb\u389aparrows;\u61c8\u0180cit\u38b0\u38c4\u38c8\u026f\u38b6\0\0\u38c1rn\u0100;e\u38bc\u38bd\u631dr\xbb\u38bdop;\u630eng;\u416fri;\u65f9cr;\uc000\ud835\udcca\u0180dir\u38d9\u38dd\u38e2ot;\u62f0lde;\u4169i\u0100;f\u3730\u38e8\xbb\u1813\u0100am\u38ef\u38f2r\xf2\u38a8l\u803b\xfc\u40fcangle;\u69a7\u0780ABDacdeflnoprsz\u391c\u391f\u3929\u392d\u39b5\u39b8\u39bd\u39df\u39e4\u39e8\u39f3\u39f9\u39fd\u3a01\u3a20r\xf2\u03f7ar\u0100;v\u3926\u3927\u6ae8;\u6ae9as\xe8\u03e1\u0100nr\u3932\u3937grt;\u699c\u0380eknprst\u34e3\u3946\u394b\u3952\u395d\u3964\u3996app\xe1\u2415othin\xe7\u1e96\u0180hir\u34eb\u2ec8\u3959op\xf4\u2fb5\u0100;h\u13b7\u3962\xef\u318d\u0100iu\u3969\u396dgm\xe1\u33b3\u0100bp\u3972\u3984setneq\u0100;q\u397d\u3980\uc000\u228a\ufe00;\uc000\u2acb\ufe00setneq\u0100;q\u398f\u3992\uc000\u228b\ufe00;\uc000\u2acc\ufe00\u0100hr\u399b\u399fet\xe1\u369ciangle\u0100lr\u39aa\u39afeft\xbb\u0925ight\xbb\u1051y;\u4432ash\xbb\u1036\u0180elr\u39c4\u39d2\u39d7\u0180;be\u2dea\u39cb\u39cfar;\u62bbq;\u625alip;\u62ee\u0100bt\u39dc\u1468a\xf2\u1469r;\uc000\ud835\udd33tr\xe9\u39aesu\u0100bp\u39ef\u39f1\xbb\u0d1c\xbb\u0d59pf;\uc000\ud835\udd67ro\xf0\u0efbtr\xe9\u39b4\u0100cu\u3a06\u3a0br;\uc000\ud835\udccb\u0100bp\u3a10\u3a18n\u0100Ee\u3980\u3a16\xbb\u397en\u0100Ee\u3992\u3a1e\xbb\u3990igzag;\u699a\u0380cefoprs\u3a36\u3a3b\u3a56\u3a5b\u3a54\u3a61\u3a6airc;\u4175\u0100di\u3a40\u3a51\u0100bg\u3a45\u3a49ar;\u6a5fe\u0100;q\u15fa\u3a4f;\u6259erp;\u6118r;\uc000\ud835\udd34pf;\uc000\ud835\udd68\u0100;e\u1479\u3a66at\xe8\u1479cr;\uc000\ud835\udccc\u0ae3\u178e\u3a87\0\u3a8b\0\u3a90\u3a9b\0\0\u3a9d\u3aa8\u3aab\u3aaf\0\0\u3ac3\u3ace\0\u3ad8\u17dc\u17dftr\xe9\u17d1r;\uc000\ud835\udd35\u0100Aa\u3a94\u3a97r\xf2\u03c3r\xf2\u09f6;\u43be\u0100Aa\u3aa1\u3aa4r\xf2\u03b8r\xf2\u09eba\xf0\u2713is;\u62fb\u0180dpt\u17a4\u3ab5\u3abe\u0100fl\u3aba\u17a9;\uc000\ud835\udd69im\xe5\u17b2\u0100Aa\u3ac7\u3acar\xf2\u03cer\xf2\u0a01\u0100cq\u3ad2\u17b8r;\uc000\ud835\udccd\u0100pt\u17d6\u3adcr\xe9\u17d4\u0400acefiosu\u3af0\u3afd\u3b08\u3b0c\u3b11\u3b15\u3b1b\u3b21c\u0100uy\u3af6\u3afbte\u803b\xfd\u40fd;\u444f\u0100iy\u3b02\u3b06rc;\u4177;\u444bn\u803b\xa5\u40a5r;\uc000\ud835\udd36cy;\u4457pf;\uc000\ud835\udd6acr;\uc000\ud835\udcce\u0100cm\u3b26\u3b29y;\u444el\u803b\xff\u40ff\u0500acdefhiosw\u3b42\u3b48\u3b54\u3b58\u3b64\u3b69\u3b6d\u3b74\u3b7a\u3b80cute;\u417a\u0100ay\u3b4d\u3b52ron;\u417e;\u4437ot;\u417c\u0100et\u3b5d\u3b61tr\xe6\u155fa;\u43b6r;\uc000\ud835\udd37cy;\u4436grarr;\u61ddpf;\uc000\ud835\udd6bcr;\uc000\ud835\udccf\u0100jn\u3b85\u3b87;\u600dj;\u600c"
      .split("")
      .map((c) => c.charCodeAt(0)));

  // Generated using scripts/write-decode-map.ts
  var xmlDecodeTree = new Uint16Array(
  // prettier-ignore
  "\u0200aglq\t\x15\x18\x1b\u026d\x0f\0\0\x12p;\u4026os;\u4027t;\u403et;\u403cuot;\u4022"
      .split("")
      .map((c) => c.charCodeAt(0)));

  // Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
  var _a;
  const decodeMap = new Map([
      [0, 65533],
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376],
  ]);
  const fromCodePoint = 
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function (codePoint) {
      let output = "";
      if (codePoint > 0xffff) {
          codePoint -= 0x10000;
          output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
          codePoint = 0xdc00 | (codePoint & 0x3ff);
      }
      output += String.fromCharCode(codePoint);
      return output;
  };
  function replaceCodePoint(codePoint) {
      var _a;
      if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
          return 0xfffd;
      }
      return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
  }
  function decodeCodePoint(codePoint) {
      return fromCodePoint(replaceCodePoint(codePoint));
  }

  var CharCodes;
  (function (CharCodes) {
      CharCodes[CharCodes["NUM"] = 35] = "NUM";
      CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
      CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
      CharCodes[CharCodes["NINE"] = 57] = "NINE";
      CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
      CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
      CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
      /** Bit that needs to be set to convert an upper case ASCII character to lower case */
      CharCodes[CharCodes["To_LOWER_BIT"] = 32] = "To_LOWER_BIT";
  })(CharCodes || (CharCodes = {}));
  var BinTrieFlags;
  (function (BinTrieFlags) {
      BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
      BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
      BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
  })(BinTrieFlags || (BinTrieFlags = {}));
  function getDecoder(decodeTree) {
      return function decodeHTMLBinary(str, strict) {
          let ret = "";
          let lastIdx = 0;
          let strIdx = 0;
          while ((strIdx = str.indexOf("&", strIdx)) >= 0) {
              ret += str.slice(lastIdx, strIdx);
              lastIdx = strIdx;
              // Skip the "&"
              strIdx += 1;
              // If we have a numeric entity, handle this separately.
              if (str.charCodeAt(strIdx) === CharCodes.NUM) {
                  // Skip the leading "&#". For hex entities, also skip the leading "x".
                  let start = strIdx + 1;
                  let base = 10;
                  let cp = str.charCodeAt(start);
                  if ((cp | CharCodes.To_LOWER_BIT) === CharCodes.LOWER_X) {
                      base = 16;
                      strIdx += 1;
                      start += 1;
                  }
                  do
                      cp = str.charCodeAt(++strIdx);
                  while ((cp >= CharCodes.ZERO && cp <= CharCodes.NINE) ||
                      (base === 16 &&
                          (cp | CharCodes.To_LOWER_BIT) >= CharCodes.LOWER_A &&
                          (cp | CharCodes.To_LOWER_BIT) <= CharCodes.LOWER_F));
                  if (start !== strIdx) {
                      const entity = str.substring(start, strIdx);
                      const parsed = parseInt(entity, base);
                      if (str.charCodeAt(strIdx) === CharCodes.SEMI) {
                          strIdx += 1;
                      }
                      else if (strict) {
                          continue;
                      }
                      ret += decodeCodePoint(parsed);
                      lastIdx = strIdx;
                  }
                  continue;
              }
              let resultIdx = 0;
              let excess = 1;
              let treeIdx = 0;
              let current = decodeTree[treeIdx];
              for (; strIdx < str.length; strIdx++, excess++) {
                  treeIdx = determineBranch(decodeTree, current, treeIdx + 1, str.charCodeAt(strIdx));
                  if (treeIdx < 0)
                      break;
                  current = decodeTree[treeIdx];
                  const masked = current & BinTrieFlags.VALUE_LENGTH;
                  // If the branch is a value, store it and continue
                  if (masked) {
                      // If we have a legacy entity while parsing strictly, just skip the number of bytes
                      if (!strict || str.charCodeAt(strIdx) === CharCodes.SEMI) {
                          resultIdx = treeIdx;
                          excess = 0;
                      }
                      // The mask is the number of bytes of the value, including the current byte.
                      const valueLength = (masked >> 14) - 1;
                      if (valueLength === 0)
                          break;
                      treeIdx += valueLength;
                  }
              }
              if (resultIdx !== 0) {
                  const valueLength = (decodeTree[resultIdx] & BinTrieFlags.VALUE_LENGTH) >> 14;
                  ret +=
                      valueLength === 1
                          ? String.fromCharCode(decodeTree[resultIdx] & ~BinTrieFlags.VALUE_LENGTH)
                          : valueLength === 2
                              ? String.fromCharCode(decodeTree[resultIdx + 1])
                              : String.fromCharCode(decodeTree[resultIdx + 1], decodeTree[resultIdx + 2]);
                  lastIdx = strIdx - excess + 1;
              }
          }
          return ret + str.slice(lastIdx);
      };
  }
  function determineBranch(decodeTree, current, nodeIdx, char) {
      const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
      const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
      // Case 1: Single branch encoded in jump offset
      if (branchCount === 0) {
          return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
      }
      // Case 2: Multiple branches encoded in jump table
      if (jumpOffset) {
          const value = char - jumpOffset;
          return value < 0 || value >= branchCount
              ? -1
              : decodeTree[nodeIdx + value] - 1;
      }
      // Case 3: Multiple branches encoded in dictionary
      // Binary search for the character.
      let lo = nodeIdx;
      let hi = lo + branchCount - 1;
      while (lo <= hi) {
          const mid = (lo + hi) >>> 1;
          const midVal = decodeTree[mid];
          if (midVal < char) {
              lo = mid + 1;
          }
          else if (midVal > char) {
              hi = mid - 1;
          }
          else {
              return decodeTree[mid + branchCount];
          }
      }
      return -1;
  }
  const htmlDecoder = getDecoder(htmlDecodeTree);
  const xmlDecoder = getDecoder(xmlDecodeTree);
  /**
   * Decodes an HTML string, allowing for entities not terminated by a semi-colon.
   *
   * @param str The string to decode.
   * @returns The decoded string.
   */
  function decodeHTML(str) {
      return htmlDecoder(str, false);
  }
  /**
   * Decodes an XML string, requiring all entities to be terminated by a semi-colon.
   *
   * @param str The string to decode.
   * @returns The decoded string.
   */
  function decodeXML(str) {
      return xmlDecoder(str, true);
  }

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
   * @module verifications
   * @ignore
   */

  /**
   * @function
   * @param {string} data
   * @param {object} params
   * @param {string} params.target
   * @param {string} params.claimFormat
   * @param {string} params.proofEncodingFormat
   * @param {string} [params.claimRelation]
   * @returns {Promise<boolean>}
   */
  const containsProof = async (data, params) => {
    const fingerprintFormatted = generateClaim(params.target, params.claimFormat);
    const fingerprintURI = generateClaim(params.target, ClaimFormat.URI);
    let result = false;

    // Decode eventual special entities
    switch (params.proofEncodingFormat) {
      case EntityEncodingFormat.HTML:
        data = decodeHTML(data);
        break

      case EntityEncodingFormat.XML:
        data = decodeXML(data);
        break

      case EntityEncodingFormat.PLAIN:
    }
    data = decodeHTML(data);

    // Check for plaintext proof
    result = data
      // remove newlines and carriage returns
      .replace(/\r?\n|\r/g, '')
      // remove spaces
      .replace(/\s/g, '')
      // normalize
      .toLowerCase()
      // search for fingerprint
      .indexOf(fingerprintFormatted.toLowerCase()) !== -1;

    // Check for hashed proof
    if (!result) {
      const hashRe = /\$(argon2(?:id|d|i)|2a|2b|2y)(?:\$[a-zA-Z0-9=+\-,./]+)+/g;
      let match;

      while (!result && (match = hashRe.exec(data)) != null) {
        let timeoutHandle;
        const timeoutPromise = new Promise((resolve, reject) => {
          timeoutHandle = setTimeout(
            () => {
              resolve(false);
            }, 1000
          );
        });

        switch (match[1]) {
          case '2a':
          case '2b':
          case '2y':
            try {
              // Patch until promise.race properly works on WASM
              if (parseInt(match[0].split('$')[2]) > 12) continue

              const hashPromise = bcryptVerify({
                password: fingerprintURI.toLowerCase(),
                hash: match[0]
              })
                .then(result => result)
                .catch(_ => false);

              result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
                clearTimeout(timeoutHandle);
                return result
              });
            } catch (err) {
              result = false;
            }

            // Accept mixed-case fingerprints until deadline
            if (!result) {
              try {
                // Patch until promise.race properly works on WASM
                if (parseInt(match[0].split('$')[2]) > 12) continue

                const hashPromise = bcryptVerify({
                  password: fingerprintURI,
                  hash: match[0]
                })
                  .then(result => result)
                  .catch(_ => false);

                result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
                  clearTimeout(timeoutHandle);
                  return result
                });
              } catch (err) {
                result = false;
              }
            }
            break

          case 'argon2':
          case 'argon2i':
          case 'argon2d':
          case 'argon2id':
            try {
              const hashPromise = argon2Verify({
                password: fingerprintURI.toLowerCase(),
                hash: match[0]
              })
                .then(result => result)
                .catch(_ => false);

              result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
                clearTimeout(timeoutHandle);
                return result
              });
            } catch (err) {
              result = false;
            }

            // Accept mixed-case fingerprints until deadline
            if (!result) {
              try {
                const hashPromise = argon2Verify({
                  password: fingerprintURI,
                  hash: match[0]
                })
                  .then(result => result)
                  .catch(_ => false);

                result = await Promise.race([hashPromise, timeoutPromise]).then((result) => {
                  clearTimeout(timeoutHandle);
                  return result
                });
              } catch (err) {
                result = false;
              }
            }
            break
        }
      }
    }

    // Check for HTTP proof
    if (!result) {
      const uris = getUriFromString(data);

      for (let index = 0; index < uris.length; index++) {
        if (result) continue

        const candidate = uris[index];
        /** @type {URL} */
        let candidateURL;

        try {
          candidateURL = new URL(candidate);
        } catch (_) {
          continue
        }

        if (candidateURL.protocol !== 'https:') {
          continue
        }

        // Using fetch -> axios doesn't find the ariadne-identity-proof header
        /** @type {Response} */
        const response = await fetch(candidate, {
          method: 'HEAD'
        })
          .catch(e => {
            return undefined
          });

        if (!response) continue
        if (response.status !== 200) continue
        if (!response.headers.get('ariadne-identity-proof')) continue

        result = response.headers.get('ariadne-identity-proof')
          .toLowerCase()
          .indexOf(fingerprintURI.toLowerCase()) !== -1;
      }
    }

    return result
  };

  /**
   * @function
   * @param {any} proofData
   * @param {string[]} checkPath
   * @param {object} params
   * @param {string} params.target
   * @param {string} params.claimFormat
   * @param {string} params.proofEncodingFormat
   * @param {string} [params.claimRelation]
   * @returns {Promise<boolean>}
   */
  const runJSON = async (proofData, checkPath, params) => {
    if (!proofData) {
      return false
    }

    if (Array.isArray(proofData)) {
      let result = false;

      for (let index = 0; index < proofData.length; index++) {
        const item = proofData[index];

        if (result) {
          continue
        }

        result = await runJSON(item, checkPath, params);
      }

      return result
    }

    if (checkPath.length === 0) {
      switch (params.claimRelation) {
        case ClaimRelation.ONEOF:
          return await containsProof(proofData.join('|'), params)

        case ClaimRelation.CONTAINS:
        case ClaimRelation.EQUALS:
        default:
          return await containsProof(proofData, params)
      }
    }

    if (typeof proofData === 'object' && !(checkPath[0] in proofData)) {
      throw new Error('err_json_structure_incorrect')
    }

    return await runJSON(
      proofData[checkPath[0]],
      checkPath.slice(1),
      params
    )
  };

  /**
   * Run the verification by finding the formatted fingerprint in the proof
   * @async
   * @param {object} proofData                                                - The proof data
   * @param {import('./serviceProvider.js').ServiceProvider} claimData   - The claim data
   * @param {string} fingerprint                                              - The fingerprint
   * @returns {Promise<object>}
   */
  async function run (proofData, claimData, fingerprint) {
    const res = {
      result: false,
      completed: false,
      errors: []
    };

    switch (claimData.proof.response.format) {
      case ProofFormat.JSON:
        for (let index = 0; index < claimData.proof.target.length; index++) {
          const claimMethod = claimData.proof.target[index];
          try {
            res.result = res.result || await runJSON(
              proofData,
              claimMethod.path,
              {
                target: fingerprint,
                claimFormat: claimMethod.format,
                proofEncodingFormat: claimMethod.encoding,
                claimRelation: claimMethod.relation
              }
            );
          } catch (error) {
            res.errors.push(error.message ? error.message : error);
          }
        }
        res.completed = true;
        break
      case ProofFormat.TEXT:
        for (let index = 0; index < claimData.proof.target.length; index++) {
          const claimMethod = claimData.proof.target[index];
          try {
            res.result = res.result || await containsProof(
              proofData,
              {
                target: fingerprint,
                claimFormat: claimMethod.format,
                proofEncodingFormat: claimMethod.encoding,
                claimRelation: claimMethod.relation
              }
            );
          } catch (error) {
            res.errors.push('err_unknown_text_verification');
          }
        }
        res.completed = true;
        break
    }

    // Reset the errors if one of the claim methods was successful
    if (res.result) {
      res.errors = [];
    }

    return res
  }

  var verifications = /*#__PURE__*/Object.freeze({
    __proto__: null,
    run: run
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
  /**
   * A service provider matched to an identity claim
   * @class
   * @constructor
   * @public
   */
  class ServiceProvider {
    /**
     * @param {object} spObj
     */
    constructor (spObj) {
      /**
       * Details about the service provider
       * @property {object}
       */
      this.about = {
        /**
         * Identifier of the service provider (no whitespace or symbols, lowercase)
         * @type {string}
         */
        id: spObj.about.id,
        /**
         * Full name of the service provider
         * @type {string}
         */
        name: spObj.about.name,
        /**
         * URL to the homepage of the service provider
         * @type {string | null}
         */
        homepage: spObj.about.homepage || null
      };
      /**
       * What the profile would look like if the match is correct
       * @property {object}
       */
      this.profile = {
        /**
         * Profile name to be displayed
         * @type {string}
         */
        display: spObj.profile.display,
        /**
         * URI or URL for public access to the profile
         * @type {string}
         */
        uri: spObj.profile.uri,
        /**
         * URI or URL associated with the profile usually served as a QR code
         * @type {string | null}
         */
        qr: spObj.profile.qr || null
      };
      /**
       * Details from the claim matching process
       * @property {object}
       */
      this.claim = {
        /**
         * Regular expression used to parse the URI
         * @type {string}
         */
        uriRegularExpression: spObj.claim.uriRegularExpression,
        /**
         * Whether this match automatically excludes other matches
         * @type {boolean}
         */
        uriIsAmbiguous: spObj.claim.uriIsAmbiguous
      };
      /**
       * Information for the proof verification process
       * @property {object}
       */
      this.proof = {
        /**
         * Details to request the potential proof
         * @property {object}
         */
        request: {
          /**
           * Location of the proof
           * @type {string | null}
           */
          uri: spObj.proof.request.uri,
          /**
           * Fetcher to be used to request the proof
           * @type {string}
           */
          fetcher: spObj.proof.request.fetcher,
          /**
           * Type of access restriction
           * @type {import('./enums.js').ProofAccessRestriction}
           */
          accessRestriction: spObj.proof.request.accessRestriction,
          /**
           * Data needed by the fetcher or proxy to request the proof
           * @type {object}
           */
          data: spObj.proof.request.data
        },
        /**
         * Details about the expected response
         * @property {object}
         */
        response: {
          /**
           * Expected format of the proof
           * @type {import('./enums.js').ProofFormat}
           */
          format: spObj.proof.response.format
        },
        /**
         * Details about the target located in the response
         * @type {{format: import('./enums.js').ClaimFormat, encoding: import('./enums.js').EntityEncodingFormat, relation: import('./enums.js').ClaimRelation, path: string[]}[]}
         */
        target: spObj.proof.target
      };
    }

    /**
     * Get a JSON representation of the ServiceProvider object
     * @function
     * @returns {object}
     */
    toJSON () {
      return {
        about: this.about,
        profile: this.profile,
        claim: this.claim,
        proof: this.proof
      }
    }
  }

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

  const reURI$l = /^dns:([a-zA-Z0-9.\-_]*)(?:\?(.*))?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$l (uri) {
    const match = uri.match(reURI$l);

    return new ServiceProvider({
      about: {
        id: 'dns',
        name: 'DNS'
      },
      profile: {
        display: match[1],
        uri: `https://${match[1]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$l.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: null,
          fetcher: Fetcher.DNS,
          accessRestriction: ProofAccessRestriction.SERVER,
          data: {
            domain: match[1]
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['records', 'txt']
        }]
      }
    })
  }

  const tests$l = [
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
  ];

  var dns = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$l,
    reURI: reURI$l,
    tests: tests$l
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

  const reURI$k = /^irc:\/\/(.*)\/([a-zA-Z0-9\-[\]\\`_^{|}]*)/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$k (uri) {
    const match = uri.match(reURI$k);

    return new ServiceProvider({
      about: {
        id: 'irc',
        name: 'IRC'
      },
      profile: {
        display: `${match[1]}/${match[2]}`,
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$k.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: null,
          fetcher: Fetcher.IRC,
          accessRestriction: ProofAccessRestriction.SERVER,
          data: {
            domain: match[1],
            nick: match[2]
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: []
        }]
      }
    })
  }

  const tests$k = [
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
  ];

  var irc = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$k,
    reURI: reURI$k,
    tests: tests$k
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

  const reURI$j = /^xmpp:([a-zA-Z0-9.\-_]*)@([a-zA-Z0-9.\-_]*)(?:\?(.*))?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$j (uri) {
    const match = uri.match(reURI$j);

    return new ServiceProvider({
      about: {
        id: 'xmpp',
        name: 'XMPP',
        homepage: 'https://xmpp.org'
      },
      profile: {
        display: `${match[1]}@${match[2]}`,
        uri,
        qr: uri
      },
      claim: {
        uriRegularExpression: reURI$j.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: null,
          fetcher: Fetcher.XMPP,
          accessRestriction: ProofAccessRestriction.SERVER,
          data: {
            id: `${match[1]}@${match[2]}`
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: []
        }]
      }
    })
  }

  const tests$j = [
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
  ];

  var xmpp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$j,
    reURI: reURI$j,
    tests: tests$j
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

  const reURI$i = /^matrix:u\/(?:@)?([^@:]*:[^?]*)(\?.*)?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$i (uri) {
    const match = uri.match(reURI$i);

    if (!match[2]) {
      return null
    }

    const params = new URLSearchParams(match[2]);

    if (!(params.has('org.keyoxide.e') && params.has('org.keyoxide.r'))) {
      return null
    }

    const paramRoomId = `${params.get('org.keyoxide.r')[0] !== '!' ? '!' : ''}${params.get('org.keyoxide.r')}`;
    const paramEventId = `${params.get('org.keyoxide.e')[0] !== '$' ? '$' : ''}${params.get('org.keyoxide.e')}`;

    const profileUrl = `https://matrix.to/#/@${match[1]}`;
    const eventUrl = `https://matrix.to/#/${paramRoomId}/${paramEventId}`;

    return new ServiceProvider({
      about: {
        id: 'matrix',
        name: 'Matrix',
        homepage: 'https://matrix.org'
      },
      profile: {
        display: `@${match[1]}`,
        uri: profileUrl,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$i.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: eventUrl,
          fetcher: Fetcher.MATRIX,
          accessRestriction: ProofAccessRestriction.GRANTED,
          data: {
            eventId: paramEventId,
            roomId: paramRoomId
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['content', 'body']
        }]
      }
    })
  }

  const tests$i = [
    {
      uri:
        'matrix:u/alice:matrix.domain.org?org.keyoxide.r=123:domain.org&org.keyoxide.e=123',
      shouldMatch: true
    },
    {
      uri: 'matrix:u/alice:matrix.domain.org',
      shouldMatch: true
    },
    {
      uri:
        'matrix:u/@alice:matrix.domain.org?org.keyoxide.r=!123:domain.org&org.keyoxide.e=$123',
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
  ];

  var matrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$i,
    reURI: reURI$i,
    tests: tests$i
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

  const reURI$h = /https:\/\/t.me\/([A-Za-z0-9_]{5,32})\?proof=([A-Za-z0-9_]{5,32})/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$h (uri) {
    const match = uri.match(reURI$h);

    return new ServiceProvider({
      about: {
        id: 'telegram',
        name: 'Telegram',
        homepage: 'https://telegram.org'
      },
      profile: {
        display: `@${match[1]}`,
        uri: `https://t.me/${match[1]}`,
        qr: `https://t.me/${match[1]}`
      },
      claim: {
        uriRegularExpression: reURI$h.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://t.me/${match[2]}`,
          fetcher: Fetcher.TELEGRAM,
          accessRestriction: ProofAccessRestriction.GRANTED,
          data: {
            user: match[1],
            chat: match[2]
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.EQUALS,
          path: ['text']
        }]
      }
    })
  }

  const tests$h = [
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
  ];

  var telegram = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$h,
    reURI: reURI$h,
    tests: tests$h
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

  const reURI$g = /^https:\/\/twitter\.com\/(.*)\/status\/([0-9]*)(?:\?.*)?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$g (uri) {
    const match = uri.match(reURI$g);

    const urlsp = new URLSearchParams();
    urlsp.set('url', match[0]);
    urlsp.set('omit_script', '1');

    return new ServiceProvider({
      about: {
        id: 'twitter',
        name: 'Twitter',
        homepage: 'https://twitter.com'
      },
      profile: {
        display: `@${match[1]}`,
        uri: `https://twitter.com/${match[1]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$g.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            // Returns an oembed json object with the tweet content in html form
            url: `https://publish.twitter.com/oembed?${urlsp}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['html']
        }]
      }
    })
  }

  const tests$g = [
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
  ];

  var twitter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$g,
    reURI: reURI$g,
    tests: tests$g
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

  const reURI$f = /^https:\/\/(?:www\.)?reddit\.com\/user\/(.*)\/comments\/(.*)\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$f (uri) {
    const match = uri.match(reURI$f);

    return new ServiceProvider({
      about: {
        id: 'reddit',
        name: 'Reddit',
        homepage: 'https://reddit.com'
      },
      profile: {
        display: match[1],
        uri: `https://www.reddit.com/user/${match[1]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$f.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://www.reddit.com/user/${match[1]}/comments/${match[2]}.json`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['data', 'children', 'data', 'selftext']
        }]
      }
    })
  }

  const tests$f = [
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
  ];

  var reddit = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$f,
    reURI: reURI$f,
    tests: tests$f
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

  const reURI$e = /^https:\/\/liberapay\.com\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$e (uri) {
    const match = uri.match(reURI$e);

    return new ServiceProvider({
      about: {
        id: 'liberapay',
        name: 'Liberapay',
        homepage: 'https://liberapay.com'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$e.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `https://liberapay.com/${match[1]}/public.json`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['statements', 'content']
        }]
      }
    })
  }

  const tests$e = [
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
  ];

  var liberapay = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$e,
    reURI: reURI$e,
    tests: tests$e
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

  const reURI$d = /^https:\/\/lichess\.org\/@\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$d (uri) {
    const match = uri.match(reURI$d);

    return new ServiceProvider({
      about: {
        id: 'lichess',
        name: 'Lichess',
        homepage: 'https://lichess.org'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$d.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://lichess.org/api/user/${match[1]}`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `https://lichess.org/api/user/${match[1]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.FINGERPRINT,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['profile', 'links']
        }]
      }
    })
  }

  const tests$d = [
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
  ];

  var lichess = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$d,
    reURI: reURI$d,
    tests: tests$d
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

  const reURI$c = /^https:\/\/news\.ycombinator\.com\/user\?id=(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$c (uri) {
    const match = uri.match(reURI$c);

    return new ServiceProvider({
      about: {
        id: 'hackernews',
        name: 'Hacker News',
        homepage: 'https://news.ycombinator.com'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$c.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://hacker-news.firebaseio.com/v0/user/${match[1]}.json`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.HTML,
          relation: ClaimRelation.CONTAINS,
          path: ['about']
        }]
      }
    })
  }

  const tests$c = [
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
  ];

  var hackernews = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$c,
    reURI: reURI$c,
    tests: tests$c
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

  const reURI$b = /^https:\/\/lobste\.rs\/(:?~|u\/)(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$b (uri) {
    const match = uri.match(reURI$b);

    return new ServiceProvider({
      about: {
        id: 'lobsters',
        name: 'Lobsters',
        homepage: 'https://lobste.rs'
      },
      profile: {
        display: match[1],
        uri: `https://lobste.rs/~${match[1]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$b.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://lobste.rs/~${match[1]}.json`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://lobste.rs/~${match[1]}.json`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['about']
        }]
      }
    })
  }

  const tests$b = [
    {
      uri: 'https://lobste.rs/~Alice',
      shouldMatch: true
    },
    {
      uri: 'https://lobste.rs/u/Alice',
      shouldMatch: true
    },
    {
      uri: 'https://lobste.rs/u/Alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/~Alice',
      shouldMatch: false
    },
    {
      uri: 'https://domain.org/u/Alice',
      shouldMatch: false
    }
  ];

  var lobsters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$b,
    reURI: reURI$b,
    tests: tests$b
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

  const reURI$a = /^https:\/\/(.*)\/(.*)\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$a (uri) {
    const match = uri.match(reURI$a);

    return new ServiceProvider({
      about: {
        id: 'forem',
        name: 'Forem',
        homepage: 'https://www.forem.com'
      },
      profile: {
        display: `${match[2]}@${match[1]}`,
        uri: `https://${match[1]}/${match[2]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$a.toString().toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://${match[1]}/api/articles/${match[2]}/${match[3]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['body_markdown']
        }]
      }
    })
  }

  const tests$a = [
    {
      uri: 'https://domain.org/alice/post',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice/post/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice',
      shouldMatch: false
    }
  ];

  var forem = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$a,
    reURI: reURI$a,
    tests: tests$a
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

  const reURI$9 = /^https:\/\/(.*)\/(.*)\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$9 (uri) {
    const match = uri.match(reURI$9);

    return new ServiceProvider({
      about: {
        id: 'forgejo',
        name: 'Forgejo',
        homepage: 'https://forgejo.org'
      },
      profile: {
        display: `${match[2]}@${match[1]}`,
        uri: `https://${match[1]}/${match[2]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$9.toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://${match[1]}/api/v1/repos/${match[2]}/${match[3]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.EQUALS,
          path: ['description']
        }]
      }
    })
  }

  const functions$1 = {
    validate: async (/** @type {ServiceProvider} */ claimData, proofData, opts) => {
      const url = `https://${new URL(claimData.proof.request.uri).hostname}/api/forgejo/v1/version`;
      const forgejoData = await fetcher__namespace.http.fn({ url, format: ProofFormat.JSON }, opts);
      return forgejoData && 'version' in forgejoData
    }
  };

  const tests$9 = [
    {
      uri: 'https://domain.org/alice/forgejo_proof',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice/forgejo_proof/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice/other_proof',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice',
      shouldMatch: false
    }
  ];

  var forgejo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    functions: functions$1,
    processURI: processURI$9,
    reURI: reURI$9,
    tests: tests$9
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

  const reURI$8 = /^https:\/\/(.*)\/(.*)\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$8 (uri) {
    const match = uri.match(reURI$8);

    return new ServiceProvider({
      about: {
        id: 'gitea',
        name: 'Gitea',
        homepage: 'https://about.gitea.com'
      },
      profile: {
        display: `${match[2]}@${match[1]}`,
        uri: `https://${match[1]}/${match[2]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$8.toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://${match[1]}/api/v1/repos/${match[2]}/${match[3]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.EQUALS,
          path: ['description']
        }]
      }
    })
  }

  const tests$8 = [
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
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/alice',
      shouldMatch: false
    }
  ];

  var gitea = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$8,
    reURI: reURI$8,
    tests: tests$8
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

  const reURI$7 = /^https:\/\/(.*)\/(.*)\/gitlab_proof\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$7 (uri) {
    const match = uri.match(reURI$7);

    return new ServiceProvider({
      about: {
        id: 'gitlab',
        name: 'GitLab',
        homepage: 'https://about.gitlab.com'
      },
      profile: {
        display: `${match[2]}@${match[1]}`,
        uri: `https://${match[1]}/${match[2]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$7.toString(),
        uriIsAmbiguous: true
      },
      proof: {
        uri,
        request: {
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `https://${match[1]}/api/v4/projects/${match[2]}%2Fgitlab_proof`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.EQUALS,
          path: ['description']
        }]
      }
    })
  }

  const tests$7 = [
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
  ];

  var gitlab = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$7,
    reURI: reURI$7,
    tests: tests$7
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

  const reURI$6 = /^https:\/\/gist\.github\.com\/(.*)\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$6 (uri) {
    const match = uri.match(reURI$6);

    return new ServiceProvider({
      about: {
        id: 'github',
        name: 'GitHub',
        homepage: 'https://github.com'
      },
      profile: {
        display: match[1],
        uri: `https://github.com/${match[1]}`,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$6.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `https://api.github.com/gists/${match[2]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [
          {
            format: ClaimFormat.URI,
            encoding: EntityEncodingFormat.PLAIN,
            relation: ClaimRelation.CONTAINS,
            path: ['files', 'proof.md', 'content']
          },
          {
            format: ClaimFormat.URI,
            encoding: EntityEncodingFormat.PLAIN,
            relation: ClaimRelation.CONTAINS,
            path: ['files', 'openpgp.md', 'content']
          }
        ]
      }
    })
  }

  const tests$6 = [
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
  ];

  var github = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$6,
    reURI: reURI$6,
    tests: tests$6
  });

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

  const reURI$5 = /^https:\/\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   * @returns {ServiceProvider}
   */
  function processURI$5 (uri) {
    return new ServiceProvider({
      about: {
        id: 'activitypub',
        name: 'ActivityPub',
        homepage: 'https://activitypub.rocks'
      },
      profile: {
        display: uri,
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$5.toString().toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.ACTIVITYPUB,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: uri
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [
          {
            format: ClaimFormat.URI,
            encoding: EntityEncodingFormat.PLAIN,
            relation: ClaimRelation.CONTAINS,
            path: ['summary']
          },
          {
            format: ClaimFormat.URI,
            encoding: EntityEncodingFormat.PLAIN,
            relation: ClaimRelation.CONTAINS,
            path: ['attachment', 'value']
          },
          {
            format: ClaimFormat.URI,
            encoding: EntityEncodingFormat.PLAIN,
            relation: ClaimRelation.CONTAINS,
            path: ['content']
          }
        ]
      }
    })
  }

  const functions = {
    postprocess: async (/** @type {ServiceProvider} */ claimData, proofData, opts) => {
      switch (proofData.result.type) {
        case 'Note': {
          claimData.profile.uri = proofData.result.attributedTo;
          claimData.profile.display = proofData.result.attributedTo;
          const personData = await fetcher__namespace.activitypub.fn({ url: proofData.result.attributedTo }, opts)
            .catch(_ => null);
          if (personData) {
            claimData.profile.display = `@${personData.preferredUsername}@${new URL(claimData.proof.request.uri).hostname}`;
          }
          break
        }

        case 'Person':
          claimData.profile.display = `@${proofData.result.preferredUsername}@${new URL(claimData.proof.request.uri).hostname}`;
          break
      }

      // Attempt to fetch and process the instance's NodeInfo data
      const nodeinfo = await _processNodeinfo(new URL(claimData.proof.request.uri).hostname);
      if (nodeinfo) {
        claimData.about.name = nodeinfo.software.name;
        claimData.about.id = nodeinfo.software.name;
        claimData.about.homepage = nodeinfo.software.homepage;
      }

      return { claimData, proofData }
    }
  };

  const _processNodeinfo = async (/** @type {string} */ domain) => {
    const nodeinfoRef = await fetch(`https://${domain}/.well-known/nodeinfo`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('HTTP Status was not 200')
        }
        return res.json()
      })
      .catch(_ => {
        return null
      });

    if (!nodeinfoRef) return null

    // NodeInfo version 2.1
    {
      const nodeinfo = nodeinfoRef.links.find(x => { return x.rel === 'http://nodeinfo.diaspora.software/ns/schema/2.1' });
      if (nodeinfo) {
        return await fetch(nodeinfo.href)
          .then(res => {
            if (res.status !== 200) {
              throw new Error('HTTP Status was not 200')
            }
            return res.json()
          })
          .then(res => {
            return {
              software: {
                name: res.software.name,
                version: res.software.version,
                homepage: res.software.homepage || 'https://activitypub.rocks'
              }
            }
          })
          .catch(_ => {
            return null
          })
      }
    }
    // NodeInfo version 2.0
    {
      const nodeinfo = nodeinfoRef.links.find(x => { return x.rel === 'http://nodeinfo.diaspora.software/ns/schema/2.0' });
      if (nodeinfo) {
        return await fetch(nodeinfo.href)
          .then(res => {
            if (res.status !== 200) {
              throw new Error('HTTP Status was not 200')
            }
            return res.json()
          })
          .then(res => {
            return {
              software: {
                name: res.software.name,
                version: res.software.version,
                homepage: 'https://activitypub.rocks'
              }
            }
          })
          .catch(_ => {
            return null
          })
      }
    }
    // NodeInfo version 1.1
    {
      const nodeinfo = nodeinfoRef.links.find(x => { return x.rel === 'http://nodeinfo.diaspora.software/ns/schema/1.1' });
      if (nodeinfo) {
        return await fetch(nodeinfo.href)
          .then(res => {
            if (res.status !== 200) {
              throw new Error('HTTP Status was not 200')
            }
            return res.json()
          })
          .then(res => {
            return {
              software: {
                name: res.software.name,
                version: res.software.version,
                homepage: 'https://activitypub.rocks'
              }
            }
          })
          .catch(_ => {
            return null
          })
      }
    }
    // NodeInfo version 1.0
    {
      const nodeinfo = nodeinfoRef.links.find(x => { return x.rel === 'http://nodeinfo.diaspora.software/ns/schema/1.0' });
      if (nodeinfo) {
        return await fetch(nodeinfo.href)
          .then(res => {
            if (res.status !== 200) {
              throw new Error('HTTP Status was not 200')
            }
            return res.json()
          })
          .then(res => {
            return {
              software: {
                name: res.software.name,
                version: res.software.version,
                homepage: 'https://activitypub.rocks'
              }
            }
          })
          .catch(_ => {
            return null
          })
      }
    }
  };

  const tests$5 = [
    {
      uri: 'https://domain.org',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/@/alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/@alice',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/@alice/123456',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/u/alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/users/alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/users/alice/123456',
      shouldMatch: true
    },
    {
      uri: 'http://domain.org/alice',
      shouldMatch: false
    }
  ];

  var activitypub = /*#__PURE__*/Object.freeze({
    __proto__: null,
    functions: functions,
    processURI: processURI$5,
    reURI: reURI$5,
    tests: tests$5
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

  const reURI$4 = /^https:\/\/(.*)\/u\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   * @returns {ServiceProvider}
   */
  function processURI$4 (uri) {
    const match = uri.match(reURI$4);

    return new ServiceProvider({
      about: {
        id: 'discourse',
        name: 'Discourse',
        homepage: 'https://www.discourse.org'
      },
      profile: {
        display: `${match[2]}@${match[1]}`,
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$4.toString().toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://${match[1]}/u/${match[2]}.json`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['user', 'bio_raw']
        }]
      }
    })
  }

  const tests$4 = [
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
  ];

  var discourse = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$4,
    reURI: reURI$4,
    tests: tests$4
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

  const reURI$3 = /^https:\/\/(.*)/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$3 (uri) {
    const match = uri.match(reURI$3);

    return new ServiceProvider({
      about: {
        id: 'owncast',
        name: 'Owncast',
        homepage: 'https://owncast.online'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$3.toString(),
        uriIsAmbiguous: true
      },
      proof: {
        request: {
          uri: `${uri}/api/config`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `${uri}/api/config`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.FINGERPRINT,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['socialHandles', 'url']
        }]
      }
    })
  }

  const tests$3 = [
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
  ];

  var owncast = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$3,
    reURI: reURI$3,
    tests: tests$3
  });

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

  const reURI$2 = /^https:\/\/(.*(?:askubuntu|mathoverflow|serverfault|stackapps|stackoverflow|superuser)|.+\.stackexchange)\.com\/users\/(\d+)/;
  const reStackExchange = /\.stackexchange$/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$2 (uri) {
    const [, domain, id] = uri.match(reURI$2);
    const site = domain.replace(reStackExchange, '');

    return new ServiceProvider({
      about: {
        id: 'stackexchange',
        name: 'Stack Exchange',
        homepage: 'https://stackexchange.com'
      },
      profile: {
        display: `${id}@${site}`,
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$2.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://${domain}.com/users/${id}?tab=profile`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NONE,
          data: {
            url: `https://api.stackexchange.com/2.3/users/${id}?site=${site}&filter=!AH)b5JqVyImf`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['items', 'about_me']
        }]
      }
    })
  }

  const tests$2 = [
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

  ];

  var stackexchange = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$2,
    reURI: reURI$2,
    tests: tests$2
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

  const reURI$1 = /^https:\/\/keybase.io\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI$1 (uri) {
    const match = uri.match(reURI$1);

    return new ServiceProvider({
      about: {
        id: 'keybase',
        name: 'keybase',
        homepage: 'https://keybase.io'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI$1.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri: `https://keybase.io/_/api/1.0/user/lookup.json?username=${match[1]}`,
          fetcher: Fetcher.HTTP,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: `https://keybase.io/_/api/1.0/user/lookup.json?username=${match[1]}`,
            format: ProofFormat.JSON
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.FINGERPRINT,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['them', 'public_keys', 'primary', 'key_fingerprint']
        }]
      }
    })
  }

  const tests$1 = [
    {
      uri: 'https://keybase.io/Alice',
      shouldMatch: true
    },
    {
      uri: 'https://keybase.io/Alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/Alice',
      shouldMatch: false
    }
  ];

  var keybase = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI$1,
    reURI: reURI$1,
    tests: tests$1
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

  const reURI = /^https:\/\/opencollective\.com\/(.*)\/?/;

  /**
   * @function
   * @param {string} uri
   */
  function processURI (uri) {
    const match = uri.match(reURI);

    return new ServiceProvider({
      about: {
        id: 'opencollective',
        name: 'Open Collective',
        homepage: 'https://opencollective.com'
      },
      profile: {
        display: match[1],
        uri,
        qr: null
      },
      claim: {
        uriRegularExpression: reURI.toString(),
        uriIsAmbiguous: false
      },
      proof: {
        request: {
          uri,
          fetcher: Fetcher.GRAPHQL,
          accessRestriction: ProofAccessRestriction.NOCORS,
          data: {
            url: 'https://api.opencollective.com/graphql/v2',
            query: `{ "query": "query { account(slug: \\"${match[1]}\\") { longDescription } }" }`
          }
        },
        response: {
          format: ProofFormat.JSON
        },
        target: [{
          format: ClaimFormat.URI,
          encoding: EntityEncodingFormat.PLAIN,
          relation: ClaimRelation.CONTAINS,
          path: ['data', 'account', 'longDescription']
        }]
      }
    })
  }

  const tests = [
    {
      uri: 'https://opencollective.com/Alice',
      shouldMatch: true
    },
    {
      uri: 'https://opencollective.com/Alice/',
      shouldMatch: true
    },
    {
      uri: 'https://domain.org/Alice',
      shouldMatch: false
    }
  ];

  var opencollective = /*#__PURE__*/Object.freeze({
    __proto__: null,
    processURI: processURI,
    reURI: reURI,
    tests: tests
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

  const _data = {
    dns,
    irc,
    xmpp,
    matrix,
    telegram,
    twitter,
    reddit,
    liberapay,
    lichess,
    hackernews,
    lobsters,
    forem,
    forgejo,
    gitea,
    gitlab,
    github,
    activitypub,
    discourse,
    owncast,
    stackexchange,
    keybase,
    opencollective
  };

  const list = Object.keys(_data);

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    data: _data,
    list: list
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
   * @property {object} claims.activitypub              - Options related to the verification of activitypub claims
   * @property {string|null} claims.activitypub.url     - The URL of the verifier account
   * @property {string|null} claims.activitypub.privateKey - The private key to sign the request
   * @property {object} claims.irc                      - Options related to the verification of IRC claims
   * @property {string|null} claims.irc.nick            - The nick that the library uses to connect to the IRC server
   * @property {object} claims.matrix                   - Options related to the verification of Matrix claims
   * @property {string|null} claims.matrix.instance     - The server hostname on which the library can log in
   * @property {string|null} claims.matrix.accessToken  - The access token required to identify the library ({@link https://www.matrix.org/docs/guides/client-server-api|Matrix docs})
   * @property {object} claims.telegram                 - Options related to the verification of Telegram claims
   * @property {string|null} claims.telegram.token      - The Telegram API's token ({@link https://core.telegram.org/bots/api#authorizing-your-bot|Telegram docs})
   * @property {object} claims.xmpp                     - Options related to the verification of XMPP claims
   * @property {string|null} claims.xmpp.service        - The server hostname on which the library can log in
   * @property {string|null} claims.xmpp.username       - The username used to log in
   * @property {string|null} claims.xmpp.password       - The password used to log in
   */
  const opts = {
    proxy: {
      hostname: null,
      policy: ProxyPolicy.NEVER
    },
    claims: {
      activitypub: {
        url: null,
        privateKey: null
      },
      irc: {
        nick: null
      },
      matrix: {
        instance: null,
        accessToken: null
      },
      telegram: {
        token: null
      },
      xmpp: {
        service: null,
        username: null,
        password: null
      }
    }
  };

  var defaults$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    opts: opts
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
   * @class
   * @classdesc Identity claim
   * @property {string} uri             - The claim's URI
   * @property {string} fingerprint     - The fingerprint to verify the claim against
   * @property {number} status          - The current status code of the claim
   * @property {Array<object>} matches  - The claim definitions matched against the URI
   */
  class Claim {
    /**
     * Initialize a Claim object
     * @constructor
     * @param {string} [uri]          - The URI of the identity claim
     * @param {string} [fingerprint]  - The fingerprint of the OpenPGP key
     * @example
     * const claim = doip.Claim();
     * const claim = doip.Claim('dns:domain.tld?type=TXT');
     * const claim = doip.Claim('dns:domain.tld?type=TXT', '123abc123abc');
     */
    constructor (uri, fingerprint) {
      // Verify validity of URI
      if (uri && !validUrlExports.isUri(uri)) {
        throw new Error('Invalid URI')
      }

      // Verify validity of fingerprint
      if (fingerprint) {
        try {
          // @ts-ignore
          _default.default(fingerprint);
        } catch (err) {
          throw new Error('Invalid fingerprint')
        }
      }

      /**
       * @type {string}
       */
      this._uri = uri || '';
      /**
       * @type {string}
       */
      this._fingerprint = fingerprint || '';
      /**
       * @type {number}
       */
      this._status = ClaimStatus.INIT;
      /**
       * @type {import('./serviceProvider.js').ServiceProvider[]}
       */
      this._matches = [];
    }

    /**
     * @function
     * @param {object} claimObject
     * @returns {Claim | Error}
     * @example
     * doip.Claim.fromJSON(JSON.stringify(claim));
     */
    static fromJSON (claimObject) {
      /** @type {Claim} */
      let claim;
      let result;

      if (typeof claimObject === 'object' && 'claimVersion' in claimObject) {
        switch (claimObject.claimVersion) {
          case 1:
            result = importJsonClaimVersion1(claimObject);
            if (result instanceof Error) {
              throw result
            }
            claim = result;
            break

          case 2:
            result = importJsonClaimVersion2(claimObject);
            if (result instanceof Error) {
              throw result
            }
            claim = result;
            break

          default:
            throw new Error('Invalid claim version')
        }
      }

      return claim
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
      if (this._status === ClaimStatus.INIT) {
        throw new Error('This claim has not yet been matched')
      }
      return this._matches
    }

    set uri (uri) {
      if (this._status !== ClaimStatus.INIT) {
        throw new Error(
          'Cannot change the URI, this claim has already been matched'
        )
      }
      // Verify validity of URI
      if (uri.length > 0 && !validUrlExports.isUri(uri)) {
        throw new Error('The URI was invalid')
      }
      // Remove leading and trailing spaces
      uri = uri.replace(/^\s+|\s+$/g, '');

      this._uri = uri;
    }

    set fingerprint (fingerprint) {
      if (this._status === ClaimStatus.VERIFIED) {
        throw new Error(
          'Cannot change the fingerprint, this claim has already been verified'
        )
      }
      this._fingerprint = fingerprint;
    }

    set status (anything) {
      throw new Error("Cannot change a claim's status")
    }

    set matches (anything) {
      throw new Error("Cannot change a claim's matches")
    }

    /**
     * Match the claim's URI to candidate definitions
     * @function
     */
    match () {
      if (this._status !== ClaimStatus.INIT) {
        throw new Error('This claim was already matched')
      }
      if (this._uri.length === 0 || !validUrlExports.isUri(this._uri)) {
        throw new Error('This claim has no URI')
      }

      this._matches = [];

      list.every((name, i) => {
        const def = _data[name];

        // If the candidate is invalid, continue matching
        if (!def.reURI.test(this._uri)) {
          return true
        }

        const candidate = def.processURI(this._uri);
        // If the candidate could not be processed, continue matching
        if (!candidate) {
          return true
        }

        if (candidate.claim.uriIsAmbiguous) {
          // Add to the possible candidates
          this._matches.push(candidate);
        } else {
          // Set a single candidate and stop
          this._matches = [candidate];
          return false
        }

        // Continue matching
        return true
      });

      this._status = this._matches.length === 0 ? ClaimStatus.NO_MATCHES : ClaimStatus.MATCHED;
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
    async verify (opts$1) {
      if (this._status === ClaimStatus.INIT) {
        throw new Error('This claim has not yet been matched')
      }
      if (this._status >= 200) {
        throw new Error('This claim has already been verified')
      }
      if (this._fingerprint.length === 0) {
        throw new Error('This claim has no fingerprint')
      }

      // Handle options
      opts$1 = mergeOptions$1(opts, opts$1 || {});

      // If there are no matches
      if (this._matches.length === 0) {
        this.status = ClaimStatus.NO_MATCHES;
      }

      // For each match
      for (let index = 0; index < this._matches.length; index++) {
        // Continue if a result was already obtained
        if (this._status >= 200) { continue }

        let claimData = this._matches[index];

        let verificationResult = null;
        let proofData = null;
        let proofFetchError;

        try {
          proofData = await fetch$2(claimData, opts$1);
        } catch (err) {
          proofFetchError = err;
        }

        if (proofData) {
          // Run the verification process
          verificationResult = await run(
            proofData.result,
            claimData,
            this._fingerprint
          );
          verificationResult.proof = {
            fetcher: proofData.fetcher,
            viaProxy: proofData.viaProxy
          };

          // Validate the result
          const def = _data[claimData.about.id];
          if (def.functions?.validate && verificationResult.completed && verificationResult.result) {
            try {
              (verificationResult.result = await def.functions.validate(claimData, proofData, verificationResult, opts$1));
            } catch (_) {}
          }

          // Post process the data
          if (def.functions?.postprocess) {
            try {
              ({ claimData, proofData } = await def.functions.postprocess(claimData, proofData, opts$1));
            } catch (_) {}
          }
        } else {
          // Consider the proof completed but with a negative result
          verificationResult = verificationResult || {
            result: false,
            completed: true,
            proof: {},
            errors: [proofFetchError]
          };
        }

        if (this.isAmbiguous() && !verificationResult.result) {
          // Assume a wrong match and continue
          continue
        }

        if (verificationResult.result) {
          this._status = verificationResult.proof.viaProxy ? ClaimStatus.VERIFIED_VIA_PROXY : ClaimStatus.VERIFIED;
          this._matches = [claimData];
        }
      }

      this._status = this._status >= 200 ? this._status : ClaimStatus.NO_PROOF_FOUND;
    }

    /**
     * Determine the ambiguity of the claim. A claim is only unambiguous if any
     * of the candidates is unambiguous. An ambiguous claim should never be
     * displayed in an user interface when its result is negative.
     * @function
     * @returns {boolean}
     */
    isAmbiguous () {
      if (this._status < ClaimStatus.MATCHED) {
        throw new Error('The claim has not been matched yet')
      }
      if (this._matches.length === 0) {
        throw new Error('The claim has no matches')
      }
      if (this._status >= 200 && this._status < 300) return false
      return this._matches.length > 1 || this._matches[0].claim.uriIsAmbiguous
    }

    /**
     * Get a JSON representation of the Claim object. Useful when transferring
     * data between instances/machines.
     * @function
     * @returns {object}
     */
    toJSON () {
      let displayProfileName = this._uri;
      let displayProfileUrl = null;
      let displayProofUrl = null;
      let displayServiceProviderName = null;
      let displayServiceProviderId = null;

      if (this._status >= ClaimStatus.MATCHED && this._matches.length > 0 && !this.isAmbiguous()) {
        displayProfileName = this._matches[0].profile.display;
        displayProfileUrl = this._matches[0].profile.uri;
        displayProofUrl = this._matches[0].proof.request.uri;
        displayServiceProviderName = this._matches[0].about.name;
        displayServiceProviderId = this._matches[0].about.id;
      }

      return {
        claimVersion: 2,
        uri: this._uri,
        proofs: [this._fingerprint],
        matches: this._matches.map(x => x.toJSON()),
        status: this._status,
        display: {
          profileName: displayProfileName,
          profileUrl: displayProfileUrl,
          proofUrl: displayProofUrl,
          serviceProviderName: displayServiceProviderName,
          serviceProviderId: displayServiceProviderId
        }
      }
    }
  }

  /**
   * @param {object} claimObject
   * @returns {Claim | Error}
   */
  function importJsonClaimVersion1 (claimObject) {
    if (!('claimVersion' in claimObject && claimObject.claimVersion === 1)) {
      return new Error('Invalid claim')
    }

    const claim = new Claim();

    claim._uri = claimObject.uri;
    claim._fingerprint = claimObject.fingerprint;
    claim._matches = claimObject.matches.map(x => new ServiceProvider(x));

    if (claimObject.status === 'init') {
      claim._status = 100;
    }
    if (claimObject.status === 'matched') {
      if (claimObject.matches.length === 0) {
        claim._status = 301;
      }
      claim._status = 101;
    }

    if (!('result' in claimObject.verification && 'errors' in claimObject.verification)) {
      claim._status = 400;
    }
    if (claimObject.verification.errors.length > 0) {
      claim._status = 400;
    }
    if (claimObject.verification.result && claimObject.verification.proof.viaProxy) {
      claim._status = 201;
    }
    if (claimObject.verification.result && !claimObject.verification.proof.viaProxy) {
      claim._status = 200;
    }

    return claim
  }

  /**
   * @param {object} claimObject
   * @returns {Claim | Error}
   */
  function importJsonClaimVersion2 (claimObject) {
    if (!('claimVersion' in claimObject && claimObject.claimVersion === 2)) {
      return new Error('Invalid claim')
    }

    const claim = new Claim();

    claim._uri = claimObject.uri;
    claim._fingerprint = claimObject.proofs[0];
    claim._matches = claimObject.matches.map(x => new ServiceProvider(x));
    claim._status = claimObject.status;

    return claim
  }

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
   * A persona with identity claims
   * @class
   * @constructor
   * @public
   * @example
   * const claim = Claim('https://alice.tld', '123');
   * const pers = Persona('Alice', 'About Alice', [claim]);
   */
  class Persona {
    /**
     * @param {string} name
     * @param {import('./claim.js').Claim[]} claims
     */
    constructor (name, claims) {
      /**
       * Identifier of the persona
       * @type {string | null}
       * @public
       */
      this.identifier = null;
      /**
       * Name to be displayed on the profile page
       * @type {string}
       * @public
       */
      this.name = name;
      /**
       * Email address of the persona
       * @type {string | null}
       * @public
       */
      this.email = null;
      /**
       * Description to be displayed on the profile page
       * @type {string | null}
       * @public
       */
      this.description = null;
      /**
       * URL to an avatar image
       * @type {string | null}
       * @public
       */
      this.avatarUrl = null;
      /**
       * Theme color
       * @type {string | null}
       * @public
       */
      this.themeColor = null;
      /**
       * List of identity claims
       * @type {import('./claim.js').Claim[]}
       * @public
       */
      this.claims = claims;
      /**
       * Has the persona been revoked
       * @type {boolean}
       * @public
       */
      this.isRevoked = false;
    }

    /**
     * @function
     * @param {object} personaObject
     * @param {number} profileVersion
     * @returns {Persona | Error}
     * @example
     * doip.Persona.fromJSON(JSON.stringify(persona), 2);
     */
    static fromJSON (personaObject, profileVersion) {
      /** @type {Persona} */
      let persona;
      let result;

      if (typeof personaObject === 'object' && profileVersion) {
        switch (profileVersion) {
          case 2:
            result = importJsonPersonaVersion2(personaObject);
            if (result instanceof Error) {
              throw result
            }
            persona = result;
            break

          default:
            throw new Error('Invalid persona version')
        }
      }

      return persona
    }

    /**
     * @function
     * @param {string} identifier
     */
    setIdentifier (identifier) {
      this.identifier = identifier;
    }

    /**
     * @function
     * @param {string} description
     */
    setDescription (description) {
      this.description = description;
    }

    /**
     * @function
     * @param {string} email
     */
    setEmailAddress (email) {
      this.email = email;
    }

    /**
     * @function
     * @param {string} avatarUrl
     */
    setAvatarUrl (avatarUrl) {
      this.avatarUrl = avatarUrl;
    }

    /**
     * @function
     * @param {import('./claim.js').Claim} claim
     */
    addClaim (claim) {
      this.claims.push(claim);
    }

    /**
     * @function
     */
    revoke () {
      this.isRevoked = true;
    }

    /**
     * Get a JSON representation of the Profile object
     * @function
     * @returns {object}
     */
    toJSON () {
      return {
        identifier: this.identifier,
        name: this.name,
        email: this.email,
        description: this.description,
        avatarUrl: this.avatarUrl,
        themeColor: this.themeColor,
        isRevoked: this.isRevoked,
        claims: this.claims.map(x => x.toJSON())
      }
    }
  }

  /**
   * @param {object} personaObject
   * @returns {Persona | Error}
   */
  function importJsonPersonaVersion2 (personaObject) {
    const claims = personaObject.claims.map(x => Claim.fromJSON(x));

    const persona = new Persona(personaObject.name, claims);

    persona.identifier = personaObject.identifier;
    persona.email = personaObject.email;
    persona.description = personaObject.description;
    persona.avatarUrl = personaObject.avatarUrl;
    persona.themeColor = personaObject.avatarUrl;
    persona.isRevoked = personaObject.isRevoked;

    return persona
  }

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
   * A profile of personas with identity claims
   * @function
   * @param {Array<import('./persona.js').Persona>} personas
   * @public
   * @example
   * const claim = Claim('https://alice.tld', '123');
   * const pers = Persona('Alice', 'About Alice', [claim]);
   * const profile = Profile([pers]);
   */
  class Profile {
    /**
     * Create a new profile
     * @function
     * @param {import('./enums.js').ProfileType} profileType
     * @param {string} identifier
     * @param {Array<import('./persona.js').Persona>} personas
     * @public
     */
    constructor (profileType, identifier, personas) {
      /**
       * Profile version
       * @type {number}
       * @public
       */
      this.profileVersion = 2;
      /**
       * Profile version
       * @type {import('./enums.js').ProfileType}
       * @public
       */
      this.profileType = profileType;
      /**
       * Identifier of the profile (fingerprint, email address, uri...)
       * @type {string}
       * @public
       */
      this.identifier = identifier;
      /**
       * List of personas
       * @type {Array<import('./persona.js').Persona>}
       * @public
       */
      this.personas = personas || [];
      /**
       * Index of primary persona (to be displayed first or prominently)
       * @type {number}
       * @public
       */
      this.primaryPersonaIndex = personas.length > 0 ? 0 : -1;
      /**
       * The cryptographic key associated with the profile
       * @property {object}
       * @public
       */
      this.publicKey = {
        /**
         * The type of cryptographic key
         * @type {PublicKeyType}
         * @public
         */
        keyType: PublicKeyType.NONE,
        /**
         * The fingerprint of the cryptographic key
         * @type {string | null}
         * @public
         */
        fingerprint: null,
        /**
         * The encoding of the cryptographic key
         * @type {PublicKeyEncoding}
         * @public
         */
        encoding: PublicKeyEncoding.NONE,
        /**
         * The encoded cryptographic key
         * @type {string | null}
         * @public
         */
        encodedKey: null,
        /**
         * The raw cryptographic key as object (to be removed during toJSON())
         * @type {import('openpgp').PublicKey | import('jose').JWK | null}
         * @public
         */
        key: null,
        /**
         * Details on how to fetch the public key
         * @property {object}
         * @public
         */
        fetch: {
          /**
           * The method to fetch the key
           * @type {PublicKeyFetchMethod}
           * @public
           */
          method: PublicKeyFetchMethod.NONE,
          /**
           * The query to fetch the key
           * @type {string | null}
           * @public
           */
          query: null,
          /**
           * The URL the method eventually resolved to
           * @type {string | null}
           * @public
           */
          resolvedUrl: null
        }
      };
      /**
       * List of verifier URLs
       * @type {{name: string, url: string}[]}
       * @public
       */
      this.verifiers = [];
    }

    /**
     * @function
     * @param {object} profileObject
     * @returns {Profile | Error}
     * @example
     * doip.Profile.fromJSON(JSON.stringify(profile));
     */
    static fromJSON (profileObject) {
      /** @type {Profile} */
      let profile;
      let result;

      if (typeof profileObject === 'object' && 'profileVersion' in profileObject) {
        switch (profileObject.profileVersion) {
          case 2:
            result = importJsonProfileVersion2(profileObject);
            if (result instanceof Error) {
              throw result
            }
            profile = result;
            break

          default:
            throw new Error('Invalid profile version')
        }
      }

      return profile
    }

    /**
     * @function
     * @param {string} name
     * @param {string} url
     */
    addVerifier (name, url) {
      this.verifiers.push({ name, url });
    }

    /**
     * Get a JSON representation of the Profile object
     * @function
     * @returns {object}
     */
    toJSON () {
      return {
        profileVersion: this.profileVersion,
        profileType: this.profileType,
        identifier: this.identifier,
        personas: this.personas.map(x => x.toJSON()),
        primaryPersonaIndex: this.primaryPersonaIndex,
        publicKey: {
          keyType: this.publicKey.keyType,
          fingerprint: this.publicKey.fingerprint,
          encoding: this.publicKey.encoding,
          encodedKey: this.publicKey.encodedKey,
          fetch: {
            method: this.publicKey.fetch.method,
            query: this.publicKey.fetch.query,
            resolvedUrl: this.publicKey.fetch.resolvedUrl
          }
        },
        verifiers: this.verifiers
      }
    }
  }

  /**
   * @param {object} profileObject
   * @returns {Profile | Error}
   */
  function importJsonProfileVersion2 (profileObject) {
    if (!('profileVersion' in profileObject && profileObject.profileVersion === 2)) {
      return new Error('Invalid profile')
    }

    const personas = profileObject.personas.map(x => Persona.fromJSON(x, 2));

    const profile = new Profile(profileObject.profileType, profileObject.identifier, personas);

    profile.primaryPersonaIndex = profileObject.primaryPersonaIndex;
    profile.publicKey = profileObject.publicKey;
    profile.verifiers = profileObject.verifiers;

    return profile
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
    return isObject$1(val) && isFunction(val.pipe);
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
    isObject: isObject$1,
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

  var _nodeResolve_empty = {};

  var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: _nodeResolve_empty
  });

  var require$$2 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

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
      this._fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require$$2;
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

  var hkp = HKP;

  var HKP$1 = /*@__PURE__*/getDefaultExportFromCjs(hkp);

  var _polyfillNode_crypto = {};

  var _polyfillNode_crypto$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: _polyfillNode_crypto
  });

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_crypto$1);

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
      this._fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require$$2;
      const { subtle } = globalThis.crypto || require$$1.webcrypto || new (require$$2.Crypto)();
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

  var wkd = WKD;

  var WKD$1 = /*@__PURE__*/getDefaultExportFromCjs(wkd);

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
   * Functions related to OpenPGP Profiles
   * @module openpgp
   */

  /**
   * Fetch a public key using keyservers
   * @function
   * @param {string} identifier                         - Fingerprint or email address
   * @param {string} [keyserverDomain=keys.openpgp.org] - Domain of the keyserver
   * @returns {Promise<Profile>}
   * @example
   * const key1 = doip.keys.fetchHKP('alice@domain.tld');
   * const key2 = doip.keys.fetchHKP('123abc123abc');
   */
  async function fetchHKP (identifier, keyserverDomain) {
    const keyserverBaseUrl = keyserverDomain
      ? `https://${keyserverDomain}`
      : 'https://keys.openpgp.org';

    const hkp = new HKP$1(keyserverBaseUrl);
    const lookupOpts = {
      query: identifier
    };

    const publicKeyArmored = await hkp
      .lookup(lookupOpts)
      .catch((error) => {
        throw new Error(`Key does not exist or could not be fetched (${error})`)
      });

    if (!publicKeyArmored) {
      throw new Error('Key does not exist or could not be fetched')
    }

    const publicKey = await openpgp$1.readKey({
      armoredKey: publicKeyArmored
    })
      .catch((error) => {
        throw new Error(`Key could not be read (${error})`)
      });

    const profile = await parsePublicKey(publicKey);
    profile.publicKey.fetch.method = PublicKeyFetchMethod.HKP;
    profile.publicKey.fetch.query = identifier;

    return profile
  }

  /**
   * Fetch a public key using Web Key Directory
   * @function
   * @param {string} identifier - Identifier of format 'username@domain.tld`
   * @returns {Promise<Profile>}
   * @example
   * const key = doip.keys.fetchWKD('alice@domain.tld');
   */
  async function fetchWKD (identifier) {
    const wkd = new WKD$1();
    const lookupOpts = {
      email: identifier
    };

    const publicKeyBinary = await wkd
      .lookup(lookupOpts)
      .catch((/** @type {Error} */ error) => {
        throw new Error(`Key does not exist or could not be fetched (${error})`)
      });

    if (!publicKeyBinary) {
      throw new Error('Key does not exist or could not be fetched')
    }

    const publicKey = await openpgp$1.readKey({
      binaryKey: publicKeyBinary
    })
      .catch((error) => {
        throw new Error(`Key could not be read (${error})`)
      });

    const profile = await parsePublicKey(publicKey);
    profile.publicKey.fetch.method = PublicKeyFetchMethod.WKD;
    profile.publicKey.fetch.query = identifier;

    return profile
  }

  /**
   * Fetch a public key from Keybase
   * @function
   * @param {string} username     - Keybase username
   * @param {string} fingerprint  - Fingerprint of key
   * @returns {Promise<Profile>}
   * @example
   * const key = doip.keys.fetchKeybase('alice', '123abc123abc');
   */
  async function fetchKeybase (username, fingerprint) {
    const keyLink = `https://keybase.io/${username}/pgp_keys.asc?fingerprint=${fingerprint}`;
    let rawKeyContent;
    try {
      rawKeyContent = await axios$1.get(
        keyLink,
        {
          responseType: 'text'
        }
      )
        .then((/** @type {import('axios').AxiosResponse} */ response) => {
          if (response.status === 200) {
            return response
          }
        })
        .then((/** @type {import('axios').AxiosResponse} */ response) => response.data);
    } catch (e) {
      throw new Error(`Error fetching Keybase key: ${e.message}`)
    }

    const publicKey = await openpgp$1.readKey({
      armoredKey: rawKeyContent
    })
      .catch((error) => {
        throw new Error(`Key does not exist or could not be fetched (${error})`)
      });

    const profile = await parsePublicKey(publicKey);
    profile.publicKey.fetch.method = PublicKeyFetchMethod.HTTP;
    profile.publicKey.fetch.query = null;
    profile.publicKey.fetch.resolvedUrl = keyLink;

    return profile
  }

  /**
   * Get a public key from plaintext data
   * @function
   * @param {string} rawKeyContent - Plaintext ASCII-formatted public key data
   * @returns {Promise<Profile>}
   * @example
   * const plainkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
   *
   * mQINBF0mIsIBEADacleiyiV+z6FIunvLWrO6ZETxGNVpqM+WbBQKdW1BVrJBBolg
   * [...]
   * =6lib
   * -----END PGP PUBLIC KEY BLOCK-----`
   * const key = doip.keys.fetchPlaintext(plainkey);
   */
  async function fetchPlaintext (rawKeyContent) {
    const publicKey = await openpgp$1.readKey({
      armoredKey: rawKeyContent
    })
      .catch((error) => {
        throw new Error(`Key could not be read (${error})`)
      });

    const profile = await parsePublicKey(publicKey);

    return profile
  }

  /**
   * Fetch a public key using an URI
   * @function
   * @param {string} uri - URI that defines the location of the key
   * @returns {Promise<Profile>}
   * @example
   * const key1 = doip.keys.fetchURI('hkp:alice@domain.tld');
   * const key2 = doip.keys.fetchURI('hkp:123abc123abc');
   * const key3 = doip.keys.fetchURI('wkd:alice@domain.tld');
   */
  async function fetchURI (uri) {
    if (!validUrlExports.isUri(uri)) {
      throw new Error('Invalid URI')
    }

    const re = /([a-zA-Z0-9]*):([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/;
    const match = uri.match(re);

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
   * @returns {Promise<Profile>}
   * @example
   * const key1 = doip.keys.fetch('alice@domain.tld');
   * const key2 = doip.keys.fetch('123abc123abc');
   */
  async function fetch$1 (identifier) {
    const re = /([a-zA-Z0-9@._=+-]*)(?::([a-zA-Z0-9@._=+-]*))?/;
    const match = identifier.match(re);

    let profile = null;

    // Attempt plaintext
    try {
      profile = await fetchPlaintext(identifier);
    } catch (e) {}

    // Attempt WKD
    if (!profile && identifier.includes('@')) {
      try {
        profile = await fetchWKD(match[1]);
      } catch (e) {}
    }

    // Attempt HKP
    if (!profile) {
      profile = await fetchHKP(
        match[2] ? match[2] : match[1],
        match[2] ? match[1] : null
      );
    }

    if (!profile) {
      throw new Error('Key does not exist or could not be fetched')
    }

    return profile
  }

  /**
   * Process a public key to get a profile
   * @function
   * @param {PublicKey} publicKey - The public key to parse
   * @returns {Promise<Profile>}
   * @example
   * const key = doip.keys.fetchURI('hkp:alice@domain.tld');
   * const profile = doip.keys.parsePublicKey(key);
   * profile.personas[0].claims.forEach(claim => {
   *   console.log(claim.uri);
   * });
   */
  async function parsePublicKey (publicKey) {
    if (!(publicKey && (publicKey instanceof openpgp$1.PublicKey))) {
      throw new Error('Invalid public key')
    }

    const fingerprint = publicKey.getFingerprint();
    const primaryUser = await publicKey.getPrimaryUser();
    const users = publicKey.users;
    const personas = [];

    users.forEach((user, i) => {
      if (!user.userID) return

      const pe = new Persona(user.userID.name, []);
      pe.setIdentifier(user.userID.userID);
      pe.setDescription(user.userID.comment);
      pe.setEmailAddress(user.userID.email);

      if ('selfCertifications' in user && user.selfCertifications.length > 0) {
        const selfCertification = user.selfCertifications.sort((e1, e2) => e2.created.getTime() - e1.created.getTime())[0];

        if (selfCertification.revoked) {
          pe.revoke();
        }
        const notations = selfCertification.rawNotations;
        pe.claims = notations
          .filter(
            ({ name, humanReadable }) =>
              humanReadable && (name === 'proof@ariadne.id' || name === 'proof@metacode.biz')
          )
          .map(
            ({ value }) =>
              new Claim(new TextDecoder().decode(value), `openpgp4fpr:${fingerprint}`)
          );
      }

      personas.push(pe);
    });

    const profile = new Profile(ProfileType.OPENPGP, `openpgp4fpr:${fingerprint}`, personas);
    profile.primaryPersonaIndex = primaryUser.index;

    profile.publicKey.keyType = PublicKeyType.OPENPGP;
    profile.publicKey.fingerprint = fingerprint;
    profile.publicKey.encoding = PublicKeyEncoding.ARMORED_PGP;
    profile.publicKey.encodedKey = publicKey.armor();
    profile.publicKey.key = publicKey;

    return profile
  }

  var openpgp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fetch: fetch$1,
    fetchHKP: fetchHKP,
    fetchKeybase: fetchKeybase,
    fetchPlaintext: fetchPlaintext,
    fetchURI: fetchURI,
    fetchWKD: fetchWKD,
    parsePublicKey: parsePublicKey
  });

  var crypto$1 = crypto;
  const isCryptoKey = (key) => key instanceof CryptoKey;

  const digest = async (algorithm, data) => {
      const subtleDigest = `SHA-${algorithm.slice(-3)}`;
      return new Uint8Array(await crypto$1.subtle.digest(subtleDigest, data));
  };

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  function concat(...buffers) {
      const size = buffers.reduce((acc, { length }) => acc + length, 0);
      const buf = new Uint8Array(size);
      let i = 0;
      buffers.forEach((buffer) => {
          buf.set(buffer, i);
          i += buffer.length;
      });
      return buf;
  }

  const encodeBase64 = (input) => {
      let unencoded = input;
      if (typeof unencoded === 'string') {
          unencoded = encoder.encode(unencoded);
      }
      const CHUNK_SIZE = 0x8000;
      const arr = [];
      for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
          arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
      }
      return btoa(arr.join(''));
  };
  const encode = (input) => {
      return encodeBase64(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };
  const decodeBase64 = (encoded) => {
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
  };
  const decode$1 = (input) => {
      let encoded = input;
      if (encoded instanceof Uint8Array) {
          encoded = decoder.decode(encoded);
      }
      encoded = encoded.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
      try {
          return decodeBase64(encoded);
      }
      catch (_a) {
          throw new TypeError('The input to be decoded is not correctly encoded.');
      }
  };

  class JOSEError extends Error {
      static get code() {
          return 'ERR_JOSE_GENERIC';
      }
      constructor(message) {
          var _a;
          super(message);
          this.code = 'ERR_JOSE_GENERIC';
          this.name = this.constructor.name;
          (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
      }
  }
  class JOSEAlgNotAllowed extends JOSEError {
      constructor() {
          super(...arguments);
          this.code = 'ERR_JOSE_ALG_NOT_ALLOWED';
      }
      static get code() {
          return 'ERR_JOSE_ALG_NOT_ALLOWED';
      }
  }
  class JOSENotSupported extends JOSEError {
      constructor() {
          super(...arguments);
          this.code = 'ERR_JOSE_NOT_SUPPORTED';
      }
      static get code() {
          return 'ERR_JOSE_NOT_SUPPORTED';
      }
  }
  class JWSInvalid extends JOSEError {
      constructor() {
          super(...arguments);
          this.code = 'ERR_JWS_INVALID';
      }
      static get code() {
          return 'ERR_JWS_INVALID';
      }
  }
  class JWKInvalid extends JOSEError {
      constructor() {
          super(...arguments);
          this.code = 'ERR_JWK_INVALID';
      }
      static get code() {
          return 'ERR_JWK_INVALID';
      }
  }
  class JWSSignatureVerificationFailed extends JOSEError {
      constructor() {
          super(...arguments);
          this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
          this.message = 'signature verification failed';
      }
      static get code() {
          return 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
      }
  }

  function unusable(name, prop = 'algorithm.name') {
      return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
  }
  function isAlgorithm(algorithm, name) {
      return algorithm.name === name;
  }
  function getHashLength(hash) {
      return parseInt(hash.name.slice(4), 10);
  }
  function getNamedCurve(alg) {
      switch (alg) {
          case 'ES256':
              return 'P-256';
          case 'ES384':
              return 'P-384';
          case 'ES512':
              return 'P-521';
          default:
              throw new Error('unreachable');
      }
  }
  function checkUsage(key, usages) {
      if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
          let msg = 'CryptoKey does not support this operation, its usages must include ';
          if (usages.length > 2) {
              const last = usages.pop();
              msg += `one of ${usages.join(', ')}, or ${last}.`;
          }
          else if (usages.length === 2) {
              msg += `one of ${usages[0]} or ${usages[1]}.`;
          }
          else {
              msg += `${usages[0]}.`;
          }
          throw new TypeError(msg);
      }
  }
  function checkSigCryptoKey(key, alg, ...usages) {
      switch (alg) {
          case 'HS256':
          case 'HS384':
          case 'HS512': {
              if (!isAlgorithm(key.algorithm, 'HMAC'))
                  throw unusable('HMAC');
              const expected = parseInt(alg.slice(2), 10);
              const actual = getHashLength(key.algorithm.hash);
              if (actual !== expected)
                  throw unusable(`SHA-${expected}`, 'algorithm.hash');
              break;
          }
          case 'RS256':
          case 'RS384':
          case 'RS512': {
              if (!isAlgorithm(key.algorithm, 'RSASSA-PKCS1-v1_5'))
                  throw unusable('RSASSA-PKCS1-v1_5');
              const expected = parseInt(alg.slice(2), 10);
              const actual = getHashLength(key.algorithm.hash);
              if (actual !== expected)
                  throw unusable(`SHA-${expected}`, 'algorithm.hash');
              break;
          }
          case 'PS256':
          case 'PS384':
          case 'PS512': {
              if (!isAlgorithm(key.algorithm, 'RSA-PSS'))
                  throw unusable('RSA-PSS');
              const expected = parseInt(alg.slice(2), 10);
              const actual = getHashLength(key.algorithm.hash);
              if (actual !== expected)
                  throw unusable(`SHA-${expected}`, 'algorithm.hash');
              break;
          }
          case 'EdDSA': {
              if (key.algorithm.name !== 'Ed25519' && key.algorithm.name !== 'Ed448') {
                  throw unusable('Ed25519 or Ed448');
              }
              break;
          }
          case 'ES256':
          case 'ES384':
          case 'ES512': {
              if (!isAlgorithm(key.algorithm, 'ECDSA'))
                  throw unusable('ECDSA');
              const expected = getNamedCurve(alg);
              const actual = key.algorithm.namedCurve;
              if (actual !== expected)
                  throw unusable(expected, 'algorithm.namedCurve');
              break;
          }
          default:
              throw new TypeError('CryptoKey does not support this operation');
      }
      checkUsage(key, usages);
  }

  function message(msg, actual, ...types) {
      if (types.length > 2) {
          const last = types.pop();
          msg += `one of type ${types.join(', ')}, or ${last}.`;
      }
      else if (types.length === 2) {
          msg += `one of type ${types[0]} or ${types[1]}.`;
      }
      else {
          msg += `of type ${types[0]}.`;
      }
      if (actual == null) {
          msg += ` Received ${actual}`;
      }
      else if (typeof actual === 'function' && actual.name) {
          msg += ` Received function ${actual.name}`;
      }
      else if (typeof actual === 'object' && actual != null) {
          if (actual.constructor && actual.constructor.name) {
              msg += ` Received an instance of ${actual.constructor.name}`;
          }
      }
      return msg;
  }
  var invalidKeyInput = (actual, ...types) => {
      return message('Key must be ', actual, ...types);
  };
  function withAlg(alg, actual, ...types) {
      return message(`Key for the ${alg} algorithm must be `, actual, ...types);
  }

  var isKeyLike = (key) => {
      return isCryptoKey(key);
  };
  const types = ['CryptoKey'];

  const isDisjoint = (...headers) => {
      const sources = headers.filter(Boolean);
      if (sources.length === 0 || sources.length === 1) {
          return true;
      }
      let acc;
      for (const header of sources) {
          const parameters = Object.keys(header);
          if (!acc || acc.size === 0) {
              acc = new Set(parameters);
              continue;
          }
          for (const parameter of parameters) {
              if (acc.has(parameter)) {
                  return false;
              }
              acc.add(parameter);
          }
      }
      return true;
  };

  function isObjectLike(value) {
      return typeof value === 'object' && value !== null;
  }
  function isObject(input) {
      if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
          return false;
      }
      if (Object.getPrototypeOf(input) === null) {
          return true;
      }
      let proto = input;
      while (Object.getPrototypeOf(proto) !== null) {
          proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(input) === proto;
  }

  var checkKeyLength = (alg, key) => {
      if (alg.startsWith('RS') || alg.startsWith('PS')) {
          const { modulusLength } = key.algorithm;
          if (typeof modulusLength !== 'number' || modulusLength < 2048) {
              throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
          }
      }
  };

  function subtleMapping(jwk) {
      let algorithm;
      let keyUsages;
      switch (jwk.kty) {
          case 'oct': {
              switch (jwk.alg) {
                  case 'HS256':
                  case 'HS384':
                  case 'HS512':
                      algorithm = { name: 'HMAC', hash: `SHA-${jwk.alg.slice(-3)}` };
                      keyUsages = ['sign', 'verify'];
                      break;
                  case 'A128CBC-HS256':
                  case 'A192CBC-HS384':
                  case 'A256CBC-HS512':
                      throw new JOSENotSupported(`${jwk.alg} keys cannot be imported as CryptoKey instances`);
                  case 'A128GCM':
                  case 'A192GCM':
                  case 'A256GCM':
                  case 'A128GCMKW':
                  case 'A192GCMKW':
                  case 'A256GCMKW':
                      algorithm = { name: 'AES-GCM' };
                      keyUsages = ['encrypt', 'decrypt'];
                      break;
                  case 'A128KW':
                  case 'A192KW':
                  case 'A256KW':
                      algorithm = { name: 'AES-KW' };
                      keyUsages = ['wrapKey', 'unwrapKey'];
                      break;
                  case 'PBES2-HS256+A128KW':
                  case 'PBES2-HS384+A192KW':
                  case 'PBES2-HS512+A256KW':
                      algorithm = { name: 'PBKDF2' };
                      keyUsages = ['deriveBits'];
                      break;
                  default:
                      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
          }
          case 'RSA': {
              switch (jwk.alg) {
                  case 'PS256':
                  case 'PS384':
                  case 'PS512':
                      algorithm = { name: 'RSA-PSS', hash: `SHA-${jwk.alg.slice(-3)}` };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'RS256':
                  case 'RS384':
                  case 'RS512':
                      algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: `SHA-${jwk.alg.slice(-3)}` };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'RSA-OAEP':
                  case 'RSA-OAEP-256':
                  case 'RSA-OAEP-384':
                  case 'RSA-OAEP-512':
                      algorithm = {
                          name: 'RSA-OAEP',
                          hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`,
                      };
                      keyUsages = jwk.d ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey'];
                      break;
                  default:
                      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
          }
          case 'EC': {
              switch (jwk.alg) {
                  case 'ES256':
                      algorithm = { name: 'ECDSA', namedCurve: 'P-256' };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'ES384':
                      algorithm = { name: 'ECDSA', namedCurve: 'P-384' };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'ES512':
                      algorithm = { name: 'ECDSA', namedCurve: 'P-521' };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'ECDH-ES':
                  case 'ECDH-ES+A128KW':
                  case 'ECDH-ES+A192KW':
                  case 'ECDH-ES+A256KW':
                      algorithm = { name: 'ECDH', namedCurve: jwk.crv };
                      keyUsages = jwk.d ? ['deriveBits'] : [];
                      break;
                  default:
                      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
          }
          case 'OKP': {
              switch (jwk.alg) {
                  case 'EdDSA':
                      algorithm = { name: jwk.crv };
                      keyUsages = jwk.d ? ['sign'] : ['verify'];
                      break;
                  case 'ECDH-ES':
                  case 'ECDH-ES+A128KW':
                  case 'ECDH-ES+A192KW':
                  case 'ECDH-ES+A256KW':
                      algorithm = { name: jwk.crv };
                      keyUsages = jwk.d ? ['deriveBits'] : [];
                      break;
                  default:
                      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
          }
          default:
              throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
      }
      return { algorithm, keyUsages };
  }
  const parse$2 = async (jwk) => {
      var _a, _b;
      if (!jwk.alg) {
          throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
      }
      const { algorithm, keyUsages } = subtleMapping(jwk);
      const rest = [
          algorithm,
          (_a = jwk.ext) !== null && _a !== void 0 ? _a : false,
          (_b = jwk.key_ops) !== null && _b !== void 0 ? _b : keyUsages,
      ];
      if (algorithm.name === 'PBKDF2') {
          return crypto$1.subtle.importKey('raw', decode$1(jwk.k), ...rest);
      }
      const keyData = { ...jwk };
      delete keyData.alg;
      delete keyData.use;
      return crypto$1.subtle.importKey('jwk', keyData, ...rest);
  };
  var asKeyObject = parse$2;

  async function importJWK(jwk, alg, octAsKeyObject) {
      var _a;
      if (!isObject(jwk)) {
          throw new TypeError('JWK must be an object');
      }
      alg || (alg = jwk.alg);
      switch (jwk.kty) {
          case 'oct':
              if (typeof jwk.k !== 'string' || !jwk.k) {
                  throw new TypeError('missing "k" (Key Value) Parameter value');
              }
              octAsKeyObject !== null && octAsKeyObject !== void 0 ? octAsKeyObject : (octAsKeyObject = jwk.ext !== true);
              if (octAsKeyObject) {
                  return asKeyObject({ ...jwk, alg, ext: (_a = jwk.ext) !== null && _a !== void 0 ? _a : false });
              }
              return decode$1(jwk.k);
          case 'RSA':
              if (jwk.oth !== undefined) {
                  throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
              }
          case 'EC':
          case 'OKP':
              return asKeyObject({ ...jwk, alg });
          default:
              throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
      }
  }

  const symmetricTypeCheck = (alg, key) => {
      if (key instanceof Uint8Array)
          return;
      if (!isKeyLike(key)) {
          throw new TypeError(withAlg(alg, key, ...types, 'Uint8Array'));
      }
      if (key.type !== 'secret') {
          throw new TypeError(`${types.join(' or ')} instances for symmetric algorithms must be of type "secret"`);
      }
  };
  const asymmetricTypeCheck = (alg, key, usage) => {
      if (!isKeyLike(key)) {
          throw new TypeError(withAlg(alg, key, ...types));
      }
      if (key.type === 'secret') {
          throw new TypeError(`${types.join(' or ')} instances for asymmetric algorithms must not be of type "secret"`);
      }
      if (usage === 'sign' && key.type === 'public') {
          throw new TypeError(`${types.join(' or ')} instances for asymmetric algorithm signing must be of type "private"`);
      }
      if (usage === 'decrypt' && key.type === 'public') {
          throw new TypeError(`${types.join(' or ')} instances for asymmetric algorithm decryption must be of type "private"`);
      }
      if (key.algorithm && usage === 'verify' && key.type === 'private') {
          throw new TypeError(`${types.join(' or ')} instances for asymmetric algorithm verifying must be of type "public"`);
      }
      if (key.algorithm && usage === 'encrypt' && key.type === 'private') {
          throw new TypeError(`${types.join(' or ')} instances for asymmetric algorithm encryption must be of type "public"`);
      }
  };
  const checkKeyType = (alg, key, usage) => {
      const symmetric = alg.startsWith('HS') ||
          alg === 'dir' ||
          alg.startsWith('PBES2') ||
          /^A\d{3}(?:GCM)?KW$/.test(alg);
      if (symmetric) {
          symmetricTypeCheck(alg, key);
      }
      else {
          asymmetricTypeCheck(alg, key, usage);
      }
  };

  function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
      if (joseHeader.crit !== undefined && protectedHeader.crit === undefined) {
          throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
      }
      if (!protectedHeader || protectedHeader.crit === undefined) {
          return new Set();
      }
      if (!Array.isArray(protectedHeader.crit) ||
          protectedHeader.crit.length === 0 ||
          protectedHeader.crit.some((input) => typeof input !== 'string' || input.length === 0)) {
          throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
      }
      let recognized;
      if (recognizedOption !== undefined) {
          recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
      }
      else {
          recognized = recognizedDefault;
      }
      for (const parameter of protectedHeader.crit) {
          if (!recognized.has(parameter)) {
              throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
          }
          if (joseHeader[parameter] === undefined) {
              throw new Err(`Extension Header Parameter "${parameter}" is missing`);
          }
          else if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
              throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
          }
      }
      return new Set(protectedHeader.crit);
  }

  const validateAlgorithms = (option, algorithms) => {
      if (algorithms !== undefined &&
          (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== 'string'))) {
          throw new TypeError(`"${option}" option must be an array of strings`);
      }
      if (!algorithms) {
          return undefined;
      }
      return new Set(algorithms);
  };

  function subtleDsa(alg, algorithm) {
      const hash = `SHA-${alg.slice(-3)}`;
      switch (alg) {
          case 'HS256':
          case 'HS384':
          case 'HS512':
              return { hash, name: 'HMAC' };
          case 'PS256':
          case 'PS384':
          case 'PS512':
              return { hash, name: 'RSA-PSS', saltLength: alg.slice(-3) >> 3 };
          case 'RS256':
          case 'RS384':
          case 'RS512':
              return { hash, name: 'RSASSA-PKCS1-v1_5' };
          case 'ES256':
          case 'ES384':
          case 'ES512':
              return { hash, name: 'ECDSA', namedCurve: algorithm.namedCurve };
          case 'EdDSA':
              return { name: algorithm.name };
          default:
              throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
      }
  }

  function getCryptoKey(alg, key, usage) {
      if (isCryptoKey(key)) {
          checkSigCryptoKey(key, alg, usage);
          return key;
      }
      if (key instanceof Uint8Array) {
          if (!alg.startsWith('HS')) {
              throw new TypeError(invalidKeyInput(key, ...types));
          }
          return crypto$1.subtle.importKey('raw', key, { hash: `SHA-${alg.slice(-3)}`, name: 'HMAC' }, false, [usage]);
      }
      throw new TypeError(invalidKeyInput(key, ...types, 'Uint8Array'));
  }

  const verify = async (alg, key, signature, data) => {
      const cryptoKey = await getCryptoKey(alg, key, 'verify');
      checkKeyLength(alg, cryptoKey);
      const algorithm = subtleDsa(alg, cryptoKey.algorithm);
      try {
          return await crypto$1.subtle.verify(algorithm, cryptoKey, signature, data);
      }
      catch (_a) {
          return false;
      }
  };

  async function flattenedVerify(jws, key, options) {
      var _a;
      if (!isObject(jws)) {
          throw new JWSInvalid('Flattened JWS must be an object');
      }
      if (jws.protected === undefined && jws.header === undefined) {
          throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
      }
      if (jws.protected !== undefined && typeof jws.protected !== 'string') {
          throw new JWSInvalid('JWS Protected Header incorrect type');
      }
      if (jws.payload === undefined) {
          throw new JWSInvalid('JWS Payload missing');
      }
      if (typeof jws.signature !== 'string') {
          throw new JWSInvalid('JWS Signature missing or incorrect type');
      }
      if (jws.header !== undefined && !isObject(jws.header)) {
          throw new JWSInvalid('JWS Unprotected Header incorrect type');
      }
      let parsedProt = {};
      if (jws.protected) {
          try {
              const protectedHeader = decode$1(jws.protected);
              parsedProt = JSON.parse(decoder.decode(protectedHeader));
          }
          catch (_b) {
              throw new JWSInvalid('JWS Protected Header is invalid');
          }
      }
      if (!isDisjoint(parsedProt, jws.header)) {
          throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
      }
      const joseHeader = {
          ...parsedProt,
          ...jws.header,
      };
      const extensions = validateCrit(JWSInvalid, new Map([['b64', true]]), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
      let b64 = true;
      if (extensions.has('b64')) {
          b64 = parsedProt.b64;
          if (typeof b64 !== 'boolean') {
              throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
          }
      }
      const { alg } = joseHeader;
      if (typeof alg !== 'string' || !alg) {
          throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
      }
      const algorithms = options && validateAlgorithms('algorithms', options.algorithms);
      if (algorithms && !algorithms.has(alg)) {
          throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
      }
      if (b64) {
          if (typeof jws.payload !== 'string') {
              throw new JWSInvalid('JWS Payload must be a string');
          }
      }
      else if (typeof jws.payload !== 'string' && !(jws.payload instanceof Uint8Array)) {
          throw new JWSInvalid('JWS Payload must be a string or an Uint8Array instance');
      }
      let resolvedKey = false;
      if (typeof key === 'function') {
          key = await key(parsedProt, jws);
          resolvedKey = true;
      }
      checkKeyType(alg, key, 'verify');
      const data = concat(encoder.encode((_a = jws.protected) !== null && _a !== void 0 ? _a : ''), encoder.encode('.'), typeof jws.payload === 'string' ? encoder.encode(jws.payload) : jws.payload);
      const signature = decode$1(jws.signature);
      const verified = await verify(alg, key, signature, data);
      if (!verified) {
          throw new JWSSignatureVerificationFailed();
      }
      let payload;
      if (b64) {
          payload = decode$1(jws.payload);
      }
      else if (typeof jws.payload === 'string') {
          payload = encoder.encode(jws.payload);
      }
      else {
          payload = jws.payload;
      }
      const result = { payload };
      if (jws.protected !== undefined) {
          result.protectedHeader = parsedProt;
      }
      if (jws.header !== undefined) {
          result.unprotectedHeader = jws.header;
      }
      if (resolvedKey) {
          return { ...result, key };
      }
      return result;
  }

  async function compactVerify(jws, key, options) {
      if (jws instanceof Uint8Array) {
          jws = decoder.decode(jws);
      }
      if (typeof jws !== 'string') {
          throw new JWSInvalid('Compact JWS must be a string or Uint8Array');
      }
      const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
      if (length !== 3) {
          throw new JWSInvalid('Invalid Compact JWS');
      }
      const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
      const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
      if (typeof key === 'function') {
          return { ...result, key: verified.key };
      }
      return result;
  }

  const check = (value, description) => {
      if (typeof value !== 'string' || !value) {
          throw new JWKInvalid(`${description} missing or invalid`);
      }
  };
  async function calculateJwkThumbprint(jwk, digestAlgorithm) {
      if (!isObject(jwk)) {
          throw new TypeError('JWK must be an object');
      }
      digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : (digestAlgorithm = 'sha256');
      if (digestAlgorithm !== 'sha256' &&
          digestAlgorithm !== 'sha384' &&
          digestAlgorithm !== 'sha512') {
          throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
      }
      let components;
      switch (jwk.kty) {
          case 'EC':
              check(jwk.crv, '"crv" (Curve) Parameter');
              check(jwk.x, '"x" (X Coordinate) Parameter');
              check(jwk.y, '"y" (Y Coordinate) Parameter');
              components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
              break;
          case 'OKP':
              check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
              check(jwk.x, '"x" (Public Key) Parameter');
              components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
              break;
          case 'RSA':
              check(jwk.e, '"e" (Exponent) Parameter');
              check(jwk.n, '"n" (Modulus) Parameter');
              components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
              break;
          case 'oct':
              check(jwk.k, '"k" (Key Value) Parameter');
              components = { k: jwk.k, kty: jwk.kty };
              break;
          default:
              throw new JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
      }
      const data = encoder.encode(JSON.stringify(components));
      return encode(await digest(digestAlgorithm, data));
  }

  const decode = decode$1;

  function decodeProtectedHeader(token) {
      let protectedB64u;
      if (typeof token === 'string') {
          const parts = token.split('.');
          if (parts.length === 3 || parts.length === 5) {
              [protectedB64u] = parts;
          }
      }
      else if (typeof token === 'object' && token) {
          if ('protected' in token) {
              protectedB64u = token.protected;
          }
          else {
              throw new TypeError('Token does not contain a Protected Header');
          }
      }
      try {
          if (typeof protectedB64u !== 'string' || !protectedB64u) {
              throw new Error();
          }
          const result = JSON.parse(decoder.decode(decode(protectedB64u)));
          if (!isObject(result)) {
              throw new Error();
          }
          return result;
      }
      catch (_a) {
          throw new TypeError('Invalid Token or Protected Header formatting');
      }
  }

  var lib = {};

  Object.defineProperty(lib, '__esModule', { value: true });

  /* eslint-disable @typescript-eslint/strict-boolean-expressions */
  function parse$1(string, encoding, opts) {
    var _opts$out;

    if (opts === void 0) {
      opts = {};
    }

    // Build the character lookup table:
    if (!encoding.codes) {
      encoding.codes = {};

      for (var i = 0; i < encoding.chars.length; ++i) {
        encoding.codes[encoding.chars[i]] = i;
      }
    } // The string must have a whole number of bytes:


    if (!opts.loose && string.length * encoding.bits & 7) {
      throw new SyntaxError('Invalid padding');
    } // Count the padding bytes:


    var end = string.length;

    while (string[end - 1] === '=') {
      --end; // If we get a whole number of bytes, there is too much padding:

      if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
        throw new SyntaxError('Invalid padding');
      }
    } // Allocate the output:


    var out = new ((_opts$out = opts.out) != null ? _opts$out : Uint8Array)(end * encoding.bits / 8 | 0); // Parse the data:

    var bits = 0; // Number of bits currently in the buffer

    var buffer = 0; // Bits waiting to be written out, MSB first

    var written = 0; // Next byte to write

    for (var _i = 0; _i < end; ++_i) {
      // Read one character from the string:
      var value = encoding.codes[string[_i]];

      if (value === undefined) {
        throw new SyntaxError('Invalid character ' + string[_i]);
      } // Append the bits to the buffer:


      buffer = buffer << encoding.bits | value;
      bits += encoding.bits; // Write out some bits if the buffer has a byte's worth:

      if (bits >= 8) {
        bits -= 8;
        out[written++] = 0xff & buffer >> bits;
      }
    } // Verify that we have received just enough bits:


    if (bits >= encoding.bits || 0xff & buffer << 8 - bits) {
      throw new SyntaxError('Unexpected end of data');
    }

    return out;
  }
  function stringify(data, encoding, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var _opts = opts,
        _opts$pad = _opts.pad,
        pad = _opts$pad === void 0 ? true : _opts$pad;
    var mask = (1 << encoding.bits) - 1;
    var out = '';
    var bits = 0; // Number of bits currently in the buffer

    var buffer = 0; // Bits waiting to be written out, MSB first

    for (var i = 0; i < data.length; ++i) {
      // Slurp data into the buffer:
      buffer = buffer << 8 | 0xff & data[i];
      bits += 8; // Write out as much as we can:

      while (bits > encoding.bits) {
        bits -= encoding.bits;
        out += encoding.chars[mask & buffer >> bits];
      }
    } // Partial character:


    if (bits) {
      out += encoding.chars[mask & buffer << encoding.bits - bits];
    } // Add padding characters until we hit a byte boundary:


    if (pad) {
      while (out.length * encoding.bits & 7) {
        out += '=';
      }
    }

    return out;
  }

  /* eslint-disable @typescript-eslint/strict-boolean-expressions */
  var base16Encoding = {
    chars: '0123456789ABCDEF',
    bits: 4
  };
  var base32Encoding = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bits: 5
  };
  var base32HexEncoding = {
    chars: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    bits: 5
  };
  var base64Encoding = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bits: 6
  };
  var base64UrlEncoding = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    bits: 6
  };
  var base16 = {
    parse: function parse$1$1(string, opts) {
      return parse$1(string.toUpperCase(), base16Encoding, opts);
    },
    stringify: function stringify$1(data, opts) {
      return stringify(data, base16Encoding, opts);
    }
  };
  var base32$1 = {
    parse: function parse$1$1(string, opts) {
      if (opts === void 0) {
        opts = {};
      }

      return parse$1(opts.loose ? string.toUpperCase().replace(/0/g, 'O').replace(/1/g, 'L').replace(/8/g, 'B') : string, base32Encoding, opts);
    },
    stringify: function stringify$1(data, opts) {
      return stringify(data, base32Encoding, opts);
    }
  };
  var base32hex = {
    parse: function parse$1$1(string, opts) {
      return parse$1(string, base32HexEncoding, opts);
    },
    stringify: function stringify$1(data, opts) {
      return stringify(data, base32HexEncoding, opts);
    }
  };
  var base64 = {
    parse: function parse$1$1(string, opts) {
      return parse$1(string, base64Encoding, opts);
    },
    stringify: function stringify$1(data, opts) {
      return stringify(data, base64Encoding, opts);
    }
  };
  var base64url$1 = {
    parse: function parse$1$1(string, opts) {
      return parse$1(string, base64UrlEncoding, opts);
    },
    stringify: function stringify$1(data, opts) {
      return stringify(data, base64UrlEncoding, opts);
    }
  };
  var codec = {
    parse: parse$1,
    stringify: stringify
  };

  lib.base16 = base16;
  lib.base32 = base32$1;
  lib.base32hex = base32hex;
  lib.base64 = base64;
  lib.base64url = base64url$1;
  lib.codec = codec;

  // Generated by rollup-plugin-mjs-entry


  lib.base16;
  const base32 = lib.base32;
  lib.base32hex;
  lib.base64;
  const base64url = lib.base64url;
  lib.codec;

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

  const SupportedCryptoAlg = ['EdDSA', 'ES256', 'ES256K', 'ES384', 'ES512'];

  /**
   * Functions related to Ariadne Signature Profiles
   * @module asp
   */

  /**
   * Fetch a public key using Web Key Directory
   * @function
   * @param {string} uri - ASPE URI
   * @returns {Promise<Profile>}
   * @example
   * const key = doip.aspe.fetchASPE('aspe:domain.tld:1234567890');
   */
  async function fetchASPE (uri) {
    const re = /aspe:(.*):(.*)/;

    if (!re.test(uri)) {
      throw new Error('Invalid ASPE URI')
    }

    const matches = uri.match(re);
    const domainPart = matches[1];
    const localPart = matches[2].toUpperCase();

    const profileUrl = `https://${domainPart}/.well-known/aspe/id/${localPart}`;
    let profileJws;

    try {
      profileJws = await axios$1.get(
        profileUrl,
        {
          responseType: 'text'
        }
      )
        .then((/** @type {import('axios').AxiosResponse} */ response) => {
          if (response.status === 200) {
            return response
          }
        })
        .then((/** @type {import('axios').AxiosResponse} */ response) => response.data);
    } catch (e) {
      throw new Error(`Error fetching Keybase key: ${e.message}`)
    }

    const profile = await parseProfileJws(profileJws, uri);
    profile.publicKey.fetch.method = PublicKeyFetchMethod.ASPE;
    profile.publicKey.fetch.query = uri;
    profile.publicKey.fetch.resolvedUrl = profileUrl;

    return profile
  }

  /**
   * Fetch a public key using Web Key Directory
   * @function
   * @param {string} profileJws - Compact-Serialized profile JWS
   * @param {string} uri    - The ASPE URI associated with the profile
   * @returns {Promise<Profile>}
   * @example
   * const key = doip.aspe.parseProfileJws('...');
   */
  async function parseProfileJws (profileJws, uri) {
    const matches = uri.match(/aspe:(.*):(.*)/);
    const localPart = matches[2].toUpperCase();

    // Decode the headers
    const protectedHeader = decodeProtectedHeader(profileJws);

    // Extract the JWK
    if (!SupportedCryptoAlg.includes(protectedHeader.alg)) {
      throw new Error('Invalid profile JWS: wrong key algorithm')
    }
    if (!protectedHeader.kid) {
      throw new Error('Invalid profile JWS: missing key identifier')
    }
    if (!protectedHeader.jwk) {
      throw new Error('Invalid profile JWS: missing key')
    }
    const publicKey = await importJWK(protectedHeader.jwk, protectedHeader.alg);

    // Compute and verify the fingerprint
    const fp = await computeJwkFingerprint(protectedHeader.jwk);

    if (fp !== protectedHeader.kid) {
      throw new Error('Invalid profile JWS: wrong key')
    }
    if (localPart && fp !== localPart) {
      throw new Error('Invalid profile JWS: wrong key')
    }

    // Decode the payload
    const { payload } = await compactVerify(profileJws, publicKey);
    const payloadJson = JSON.parse(new TextDecoder().decode(payload));

    // Verify the payload
    if (!(Object.prototype.hasOwnProperty.call(payloadJson, 'http://ariadne.id/type') && payloadJson['http://ariadne.id/type'] === 'profile')) {
      throw new Error('Invalid profile JWS: JWS is not a profile')
    }
    if (!(Object.prototype.hasOwnProperty.call(payloadJson, 'http://ariadne.id/version') && payloadJson['http://ariadne.id/version'] === 0)) {
      throw new Error('Invalid profile JWS: profile version not supported')
    }

    // Extract data from the payload
    /** @type {string} */
    const profileName = payloadJson['http://ariadne.id/name'];
    /** @type {string} */
    const profileDescription = payloadJson['http://ariadne.id/description'];
    /** @type {string} */
    const profileThemeColor = payloadJson['http://ariadne.id/color'];
    /** @type {string[]} */
    const profileClaims = payloadJson['http://ariadne.id/claims'];

    const profileClaimsParsed = profileClaims.map(x => new Claim(x, uri));

    const pe = new Persona(profileName, profileClaimsParsed);
    if (profileDescription) {
      pe.setDescription(profileDescription);
    }
    if (profileThemeColor && /^#([0-9A-F]{3}){1,2}$/i.test(profileThemeColor)) {
      pe.themeColor = profileThemeColor;
    }

    const profile = new Profile(ProfileType.ASP, uri, [pe]);
    profile.publicKey.fingerprint = fp;
    profile.publicKey.encoding = PublicKeyEncoding.JWK;
    profile.publicKey.encodedKey = JSON.stringify(protectedHeader.jwk);
    profile.publicKey.key = protectedHeader.jwk;

    switch (protectedHeader.alg) {
      case 'ES256':
        profile.publicKey.keyType = PublicKeyType.ES256;
        break

      case 'EdDSA':
        profile.publicKey.keyType = PublicKeyType.EDDSA;
        break

      default:
        profile.publicKey.keyType = PublicKeyType.UNKNOWN;
        break
    }

    return profile
  }

  /**
   * Compute the fingerprint for JWK keys
   * @function
   * @param {import('jose').JWK} key
   * @returns {Promise<string>}
   */
  async function computeJwkFingerprint (key) {
    const thumbprint = await calculateJwkThumbprint(key, 'sha512');
    const fingerprintBytes = base64url.parse(thumbprint, { loose: true }).slice(0, 16);
    const fingerprint = base32.stringify(fingerprintBytes, { pad: false });

    return fingerprint
  }

  var asp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    computeJwkFingerprint: computeJwkFingerprint,
    fetchASPE: fetchASPE,
    parseProfileJws: parseProfileJws
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
   * @module signatures
   */

  /**
   * Extract the profile from a signature and fetch the associated key
   * @async
   * @param {string} signature - The plaintext signature to parse
   * @returns {Promise<import('./profile.js').Profile>}
   */
  async function parse (signature) {
    /** @type {import('openpgp').CleartextMessage} */
    let sigData;

    // Read the signature
    try {
      sigData = await openpgp$1.readCleartextMessage({
        cleartextMessage: signature
      });
    } catch (e) {
      throw new Error(`Signature could not be read (${e.message})`)
    }

    // @ts-ignore
    const issuerKeyID = sigData.signature.packets[0].issuerKeyID.toHex();
    // @ts-ignore
    const signersUserID = sigData.signature.packets[0].signersUserID;
    const preferredKeyServer =
    // @ts-ignore
      sigData.signature.packets[0].preferredKeyServer ||
      'https://keys.openpgp.org/';
    const text = sigData.getText();
    const sigKeys = [];
    const claims = [];

    text.split('\n').forEach((line, i) => {
      const match = line.match(/^([a-zA-Z0-9]*)=(.*)$/i);
      if (!match) {
        return
      }
      switch (match[1].toLowerCase()) {
        case 'key':
          sigKeys.push(match[2]);
          break

        case 'proof':
          claims.push(new Claim(match[2]));
          break
      }
    });

    const obtainedKey = {
      query: null,
      data: null,
      method: null
    };

    // Try key identifier found in the signature
    if (sigKeys.length > 0) {
      try {
        obtainedKey.query = sigKeys[0];
        /** @type {import('openpgp').PublicKey} */
        obtainedKey.data = (await fetchURI(obtainedKey.query)).publicKey.key;
        obtainedKey.method = obtainedKey.query.split(':')[0];
      } catch (e) {}
    }
    // Try WKD
    if (!obtainedKey.data && signersUserID) {
      try {
        obtainedKey.query = signersUserID;
        obtainedKey.data = (await fetchURI(`wkd:${signersUserID}`)).publicKey.key;
        obtainedKey.method = 'wkd';
      } catch (e) {}
    }
    // Try HKP
    if (!obtainedKey.data) {
      try {
        const match = preferredKeyServer.match(/^(.*:\/\/)?([^/]*)(?:\/)?$/i);
        obtainedKey.query = issuerKeyID || signersUserID;
        obtainedKey.data = (await fetchURI(`hkp:${match[2]}:${obtainedKey.query}`)).publicKey.key;
        obtainedKey.method = 'hkp';
      } catch (e) {
        throw new Error('Public key not found')
      }
    }

    const primaryUserData = await obtainedKey.data.getPrimaryUser();
    const fingerprint = obtainedKey.data.getFingerprint();

    // Verify the signature
    const verificationResult = await openpgp$1.verify({
      // @ts-ignore
      message: sigData,
      verificationKeys: obtainedKey.data
    });
    const { verified } = verificationResult.signatures[0];
    try {
      await verified;
    } catch (e) {
      throw new Error(`Signature could not be verified (${e.message})`)
    }

    // Build the persona
    const persona = new Persona(primaryUserData.user.userID.name, []);
    persona.setIdentifier(primaryUserData.user.userID.userID);
    persona.setDescription(primaryUserData.user.userID.comment || null);
    persona.setEmailAddress(primaryUserData.user.userID.email || null);
    persona.claims = claims
      .map(
        ({ value }) =>
          new Claim(new TextDecoder().decode(value), `openpgp4fpr:${fingerprint}`)
      );

    const profile = new Profile(ProfileType.OPENPGP, `openpgp4fpr:${fingerprint}`, [persona]);

    profile.publicKey.keyType = PublicKeyType.OPENPGP;
    profile.publicKey.encoding = PublicKeyEncoding.ARMORED_PGP;
    profile.publicKey.encodedKey = obtainedKey.data.armor();
    profile.publicKey.key = obtainedKey.data;
    profile.publicKey.fetch.method = obtainedKey.method;
    profile.publicKey.fetch.query = obtainedKey.query;

    return profile
  }

  var signatures = /*#__PURE__*/Object.freeze({
    __proto__: null,
    parse: parse
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
  const profile = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://spec.keyoxide.org/2/profile.schema.json',
    title: 'Profile',
    description: 'Keyoxide profile with personas',
    type: 'object',
    properties: {
      profileVersion: {
        description: 'The version of the profile',
        type: 'integer'
      },
      profileType: {
        description: 'The type of the profile [openpgp, asp]',
        type: 'string'
      },
      identifier: {
        description: 'Identifier of the profile (email, fingerprint, URI)',
        type: 'string'
      },
      personas: {
        description: 'The personas inside the profile',
        type: 'array',
        items: {
          $ref: 'https://spec.keyoxide.org/2/persona.schema.json'
        },
        minItems: 1,
        uniqueItems: true
      },
      primaryPersonaIndex: {
        description: 'The index of the primary persona',
        type: 'integer'
      },
      publicKey: {
        description: 'The cryptographic key associated with the profile',
        type: 'object',
        properties: {
          keyType: {
            description: 'The type of cryptographic key [eddsa, es256, openpgp, none]',
            type: 'string'
          },
          encoding: {
            description: 'The encoding of the cryptographic key [pem, jwk, armored_pgp, none]',
            type: 'string'
          },
          encodedKey: {
            description: 'The encoded cryptographic key (PEM, stringified JWK, ...)',
            type: ['string', 'null']
          },
          fetch: {
            description: 'Details on how to fetch the public key',
            type: 'object',
            properties: {
              method: {
                description: 'The method to fetch the key [aspe, hkp, wkd, http, none]',
                type: 'string'
              },
              query: {
                description: 'The query to fetch the key',
                type: ['string', 'null']
              },
              resolvedUrl: {
                description: 'The URL the method eventually resolved to',
                type: ['string', 'null']
              }
            }
          }
        },
        required: [
          'keyType',
          'fetch'
        ]
      },
      verifiers: {
        description: 'A list of links to verifiers',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              description: 'Name of the verifier site',
              type: 'string'
            },
            url: {
              description: 'URL to the profile page on the verifier site',
              type: 'string'
            }
          }
        },
        uniqueItems: true
      }
    },
    required: [
      'profileVersion',
      'profileType',
      'identifier',
      'personas',
      'primaryPersonaIndex',
      'publicKey',
      'verifiers'
    ],
    additionalProperties: false
  };

  const persona = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://spec.keyoxide.org/2/persona.schema.json',
    title: 'Profile',
    description: 'Keyoxide persona with identity claims',
    type: 'object',
    properties: {
      identifier: {
        description: 'Identifier of the persona',
        type: ['string', 'null']
      },
      name: {
        description: 'Name of the persona',
        type: 'string'
      },
      email: {
        description: 'Email address of the persona',
        type: ['string', 'null']
      },
      description: {
        description: 'Description of the persona',
        type: ['string', 'null']
      },
      avatarUrl: {
        description: 'URL to an avatar image',
        type: ['string', 'null']
      },
      themeColor: {
        description: 'Profile page theme color',
        type: ['string', 'null']
      },
      isRevoked: {
        type: 'boolean'
      },
      claims: {
        description: 'A list of identity claims',
        type: 'array',
        items: {
          $ref: 'https://spec.keyoxide.org/2/claim.schema.json'
        },
        uniqueItems: true
      }
    },
    required: [
      'name',
      'claims'
    ],
    additionalProperties: false
  };

  const claim = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://spec.keyoxide.org/2/claim.schema.json',
    title: 'Identity claim',
    description: 'Verifiable online identity claim',
    type: 'object',
    properties: {
      claimVersion: {
        description: 'The version of the claim',
        type: 'integer'
      },
      uri: {
        description: 'The claim URI',
        type: 'string'
      },
      proofs: {
        description: 'The proofs that would verify the claim',
        type: 'array',
        items: {
          type: 'string'
        },
        minItems: 1,
        uniqueItems: true
      },
      matches: {
        description: 'Service providers matched to the claim',
        type: 'array',
        items: {
          $ref: 'https://spec.keyoxide.org/2/serviceprovider.schema.json'
        },
        uniqueItems: true
      },
      status: {
        type: 'integer',
        description: 'Claim status code'
      },
      display: {
        type: 'object',
        properties: {
          profileName: {
            type: 'string',
            description: 'Account name to display in the user interface'
          },
          profileUrl: {
            type: ['string', 'null'],
            description: 'Profile URL to link to in the user interface'
          },
          proofUrl: {
            type: ['string', 'null'],
            description: 'Proof URL to link to in the user interface'
          },
          serviceProviderName: {
            type: ['string', 'null'],
            description: 'Name of the service provider to display in the user interface'
          },
          serviceProviderId: {
            type: ['string', 'null'],
            description: 'Id of the service provider'
          }
        }
      }
    },
    required: [
      'claimVersion',
      'uri',
      'proofs',
      'status',
      'display'
    ],
    additionalProperties: false
  };

  const serviceprovider = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://spec.keyoxide.org/2/serviceprovider.schema.json',
    title: 'Service provider',
    description: 'A service provider that can be matched to identity claims',
    type: 'object',
    properties: {
      about: {
        description: 'Details about the service provider',
        type: 'object',
        properties: {
          name: {
            description: 'Full name of the service provider',
            type: 'string'
          },
          id: {
            description: 'Identifier of the service provider (no whitespace or symbols, lowercase)',
            type: 'string'
          },
          homepage: {
            description: 'URL to the homepage of the service provider',
            type: ['string', 'null']
          }
        }
      },
      profile: {
        description: 'What the profile would look like if the match is correct',
        type: 'object',
        properties: {
          display: {
            description: 'Profile name to be displayed',
            type: 'string'
          },
          uri: {
            description: 'URI or URL for public access to the profile',
            type: 'string'
          },
          qr: {
            description: 'URI or URL associated with the profile usually served as a QR code',
            type: ['string', 'null']
          }
        }
      },
      claim: {
        description: 'Details from the claim matching process',
        type: 'object',
        properties: {
          uriRegularExpression: {
            description: 'Regular expression used to parse the URI',
            type: 'string'
          },
          uriIsAmbiguous: {
            description: 'Whether this match automatically excludes other matches',
            type: 'boolean'
          }
        }
      },
      proof: {
        description: 'Information for the proof verification process',
        type: 'object',
        properties: {
          request: {
            description: 'Details to request the potential proof',
            type: 'object',
            properties: {
              uri: {
                description: 'Location of the proof',
                type: ['string', 'null']
              },
              accessRestriction: {
                description: 'Type of access restriction [none, nocors, granted, server]',
                type: 'string'
              },
              fetcher: {
                description: 'Name of the fetcher to use',
                type: 'string'
              },
              data: {
                description: 'Data needed by the fetcher or proxy to request the proof',
                type: 'object',
                additionalProperties: true
              }
            }
          },
          response: {
            description: 'Details about the expected response',
            type: 'object',
            properties: {
              format: {
                description: 'Expected format of the proof [text, json]',
                type: 'string'
              }
            }
          },
          target: {
            description: 'Details about the target located in the response',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                format: {
                  description: 'How is the proof formatted [uri, fingerprint]',
                  type: 'string'
                },
                encoding: {
                  description: 'How is the proof encoded [plain, html, xml]',
                  type: 'string'
                },
                relation: {
                  description: 'How are the response and the target related [contains, equals]',
                  type: 'string'
                },
                path: {
                  description: 'Path to the target location if the response is JSON',
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    required: [
      'about',
      'profile',
      'claim',
      'proof'
    ],
    additionalProperties: false
  };

  var schemas = /*#__PURE__*/Object.freeze({
    __proto__: null,
    claim: claim,
    persona: persona,
    profile: profile,
    serviceprovider: serviceprovider
  });

  exports.fetcher = fetcher__namespace;
  exports.Claim = Claim;
  exports.Persona = Persona;
  exports.Profile = Profile;
  exports.ServiceProvider = ServiceProvider;
  exports.ServiceProviderDefinitions = index;
  exports.asp = asp;
  exports.defaults = defaults$3;
  exports.enums = enums;
  exports.openpgp = openpgp;
  exports.proofs = proofs;
  exports.schemas = schemas;
  exports.signatures = signatures;
  exports.utils = utils$9;
  exports.verifications = verifications;

  return exports;

})({}, openpgp, doipFetchers);
