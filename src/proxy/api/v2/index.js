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
const router = require('express').Router()
const { query, validationResult } = require('express-validator')
const fetcher = require('../../../fetcher')
const E = require('../../../enums')
require('dotenv').config()

const opts = {
  claims: {
    irc: {
      nick: process.env.IRC_NICK || null
    },
    matrix: {
      instance: process.env.MATRIX_INSTANCE || null,
      accessToken: process.env.MATRIX_ACCESS_TOKEN || null
    },
    telegram: {
      token: process.env.TELEGRAM_TOKEN || null
    },
    xmpp: {
      service: process.env.XMPP_SERVICE || null,
      username: process.env.XMPP_USERNAME || null,
      password: process.env.XMPP_PASSWORD || null
    },
    twitter: {
      bearerToken: process.env.TWITTER_BEARER_TOKEN || null
    }
  }
}

// Root route
router.get('/', async (req, res) => {
  return res.status(400).json({ errors: 'Invalid endpoint' })
})

// HTTP route
router.get(
  '/get/http',
  query('url').isURL(),
  query('format').isIn([E.ProofFormat.JSON, E.ProofFormat.TEXT]),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    fetcher.http
      .fn(req.query, opts)
      .then((result) => {
        switch (req.query.format) {
          case E.ProofFormat.JSON:
            return res.status(200).json(result)

          case E.ProofFormat.TEXT:
            return res.status(200).send(result)
        }
      })
      .catch((err) => {
        return res.status(400).json({ errors: err.message ? err.message : err })
      })
  }
)

// DNS route
router.get('/get/dns', query('domain').isFQDN(), (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  fetcher.dns
    .fn(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ errors: err.message ? err.message : err })
    })
})

// XMPP route
router.get(
  '/get/xmpp',
  query('id').isEmail(),
  query('field').isIn([
    'fn',
    'number',
    'userid',
    'url',
    'bday',
    'nickname',
    'note',
    'desc'
  ]),
  async (req, res) => {
    if (
      !opts.claims.xmpp.service ||
      !opts.claims.xmpp.username ||
      !opts.claims.xmpp.password
    ) {
      return res.status(501).json({ errors: 'XMPP not enabled on server' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    fetcher.xmpp
      .fn(req.query, opts)
      .then((data) => {
        return res.status(200).send(data)
      })
      .catch((err) => {
        return res.status(400).json({ errors: err.message ? err.message : err })
      })
  }
)

// Twitter route
router.get('/get/twitter', query('tweetId').isInt(), async (req, res) => {
  if (!opts.claims.twitter.bearerToken) {
    return res.status(501).json({ errors: 'Twitter not enabled on server' })
  }
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  fetcher.twitter
    .fn(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ errors: err.message ? err.message : err })
    })
})

// Matrix route
router.get(
  '/get/matrix',
  query('roomId').isString(),
  query('eventId').isString(),
  async (req, res) => {
    if (!opts.claims.matrix.instance || !opts.claims.matrix.accessToken) {
      return res.status(501).json({ errors: 'Matrix not enabled on server' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    fetcher.matrix
      .fn(req.query, opts)
      .then((data) => {
        return res.status(200).send(data)
      })
      .catch((err) => {
        return res.status(400).json({ errors: err.message ? err.message : err })
      })
  }
)

// Telegram route
router.get(
  '/get/telegram',
  query('user').isString(),
  query('chat').isString(),
  async (req, res) => {
    if (!opts.claims.telegram.token) {
      return res.status(501).json({ errors: 'Telegram not enabled on server' })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    fetcher.telegram
      .fn(req.query, opts)
      .then((data) => {
        return res.status(200).send(data)
      })
      .catch((err) => {
        return res.status(400).json({ errors: err.message ? err.message : err })
      })
  }
)

// IRC route
router.get('/get/irc', query('nick').isString(), async (req, res) => {
  if (!opts.claims.irc.nick) {
    return res.status(501).json({ errors: 'IRC not enabled on server' })
  }
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  fetcher.irc
    .fn(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ errors: err.message ? err.message : err })
    })
})

// Gitlab route
router.get(
  '/get/gitlab',
  query('domain').isFQDN(),
  query('username').isString(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    fetcher.http
      .fn({
        url: `https://${req.query.domain}/api/v4/projects/${req.query.username}%2Fgitlab_proof`,
        format: 'json'
      }, opts)
      .then((data) => {
        return res.status(200).send(data)
      })
      .catch((err) => {
        return res.status(400).json({ errors: err.message ? err.message : err })
      })
  }
)

module.exports = router
