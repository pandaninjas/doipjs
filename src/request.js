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
 * @module request
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
const fetchProof = (data, opts) => {
  switch (data.proof.request.fetcher) {
    case E.Fetcher.HTTP:
      data.proof.request.data.format = data.proof.request.format
      break

    default:
      break
  }

  if (jsEnv.isNode) {
    return handleNodeRequests(data.proof, opts, false)
  }

  return handleBrowserRequests(data.proof, opts, false)
}

/**
 * Delegate the marker requests to the correct fetcher.
 * This method uses the current environment (browser/node), certain values from
 * the `data` parameter and the proxy policy set in the `opts` parameter to
 * choose the right approach to fetch the proof. An error will be thrown if no
 * approach is possible.
 * @async
 * @param {object} data - Data from a claim definition
 * @param {object} opts - Options to enable the request
 * @returns {Promise<Array<object>>}
 */
const fetchMarkers = async (data, opts) => {
  const promises = []

  if (!(data.markers && data.markers.length > 0)) throw new Error('No markers found')

  data.markers.forEach(marker => {
    if (jsEnv.isNode) {
      promises.push(handleNodeRequests(marker, opts, true))
    } else {
      promises.push(handleBrowserRequests(marker, opts, true))
    }
  })

  return Promise.allSettled(promises)
}

const handleBrowserRequests = (data, opts, alwaysResolve) => {
  switch (opts.proxy.policy) {
    case E.ProxyPolicy.ALWAYS:
      return createProxyRequestPromise(data, opts, alwaysResolve)

    case E.ProxyPolicy.NEVER:
      switch (data.request.access) {
        case E.ProofAccess.GENERIC:
        case E.ProofAccess.GRANTED:
          return createDefaultRequestPromise(data, opts, alwaysResolve)
        case E.ProofAccess.NOCORS:
        case E.ProofAccess.SERVER:
          throw new Error(
            'Impossible to fetch proof (bad combination of service access and proxy policy)'
          )
        default:
          throw new Error('Invalid proof access value')
      }

    case E.ProxyPolicy.ADAPTIVE:
      switch (data.request.access) {
        case E.ProofAccess.GENERIC:
        case E.ProofAccess.GRANTED:
          return createFallbackRequestPromise(data, opts, alwaysResolve)
        case E.ProofAccess.NOCORS:
        case E.ProofAccess.SERVER:
          return createProxyRequestPromise(data, opts, alwaysResolve)
        default:
          throw new Error('Invalid proof access value')
      }

    default:
      throw new Error('Invalid proxy policy')
  }
}

const handleNodeRequests = (data, opts, alwaysResolve) => {
  switch (opts.proxy.policy) {
    case E.ProxyPolicy.ALWAYS:
      return createProxyRequestPromise(data, opts, alwaysResolve)

    case E.ProxyPolicy.NEVER:
      return createDefaultRequestPromise(data, opts, alwaysResolve)

    case E.ProxyPolicy.ADAPTIVE:
      return createFallbackRequestPromise(data, opts, alwaysResolve)

    default:
      throw new Error('Invalid proxy policy')
  }
}

const createDefaultRequestPromise = (data, opts, alwaysResolve) => {
  return new Promise((resolve, reject) => {
    fetcher[data.request.fetcher]
      .fn(data.request.data, opts)
      .then((res) => {
        return resolve({
          fetcher: data.request.fetcher,
          data: data,
          viaProxy: false,
          result: res
        })
      })
      .catch((err) => {
        if (alwaysResolve) {
          return resolve({
            fetcher: 'http',
            data: data,
            viaProxy: true,
            error: err
          })
        } else {
          return reject(err)
        }
      })
  })
}

const createProxyRequestPromise = (data, opts, alwaysResolve) => {
  return new Promise((resolve, reject) => {
    let proxyUrl
    try {
      proxyUrl = utils.generateProxyURL(
        data.request.fetcher,
        data.request.data,
        opts
      )
    } catch (err) {
      reject(err)
    }

    const requestData = {
      url: proxyUrl,
      format: data.request.format,
      fetcherTimeout: fetcher[data.request.fetcher].timeout
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
        if (alwaysResolve) {
          return resolve({
            fetcher: 'http',
            data: data,
            viaProxy: true,
            error: err
          })
        } else {
          return reject(err)
        }
      })
  })
}

const createFallbackRequestPromise = (data, opts, alwaysResolve) => {
  return new Promise((resolve, reject) => {
    createDefaultRequestPromise(data, opts, alwaysResolve)
      .then((res) => {
        return resolve(res)
      })
      .catch((err1) => {
        createProxyRequestPromise(data, opts, alwaysResolve)
          .then((res) => {
            return resolve(res)
          })
          .catch((err2) => {
            return reject(err2)
          })
      })
  })
}

exports.fetchProof = fetchProof
exports.fetchMarkers = fetchMarkers
