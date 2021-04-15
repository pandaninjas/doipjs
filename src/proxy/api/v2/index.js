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
const { body, validationResult } = require('express-validator')
const fetcher = require('../../../fetcher')
const E = require('../../../enums')
require('dotenv').config()

const opts = {
  claims: {
    xmpp: {
      service: process.env.XMPP_SERVICE || null,
      username: process.env.XMPP_USERNAME || null,
      password: process.env.XMPP_PASSWORD || null,
    },
    twitter: {
      bearerToken: process.env.TWITTER_BEARER_TOKEN || null,
    },
    matrix: {
      instance: process.env.MATRIX_INSTANCE || null,
      accessToken: process.env.MATRIX_ACCESS_TOKEN || null,
    },
    irc: {
      nick: process.env.IRC_NICK || null,
    },
  },
}

// Root route
router.get('/', async (req, res) => {
  return res.status(400).json({ error: 'Invalid endpoint' })
})

// HTTP route
router.get('/get/http', (req, res) => {
  if (!req.query.url) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }
  if (!validUrl.isUri(req.query.url)) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  fetcher.http(req.query, opts)
  .then(result => {
    switch (req.query.format) {
      case E.ProofFormat.JSON:
        return res.status(200).json(result)
        break;

      case E.ProofFormat.TEXT:
        return res.status(200).send(result)
        break;
    
      default:
        throw new Error('Invalid proof format')
        break;
    }
  })
  .catch(err => {
    return res.status(400).json({ error: err.message ? err.message : err })
  })
})

// DNS route
router.get('/get/dns', (req, res) => {
  if (!req.query.domain) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }

  fetcher
    .dns(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

// XMPP route
router.get('/get/xmpp', async (req, res) => {
  if (!opts.claims.xmpp.service || !opts.claims.xmpp.username || !opts.claims.xmpp.password) {
    return res.status(501).json({ error: 'XMPP not enabled on server' })
  }

  if (!req.query.id || !req.query.field) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(req.query.id))) {
    return res.status(400).json({ error: 'Invalid XMPP ID' })
  }

  const allowedField = [
    'FN',
    'NUMBER',
    'USERID',
    'URL',
    'BDAY',
    'NICKNAME',
    'NOTE',
    'DESC',
  ]
  if (!allowedField.includes(req.query.field)) {
    return res.status(400).json({ error: 'Invalid XMPP vCard field' })
  }

  fetcher
    .xmpp(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

// Twitter route
router.get('/get/twitter', async (req, res) => {
  if (!opts.claims.twitter.bearerToken) {
    return res.status(501).json({ error: 'Twitter not enabled on server' })
  }

  if (!req.query.tweetId) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }

  fetcher
    .twitter(req.query, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

// Matrix route
router.get('/get/matrix/:matrixroomid/:matrixeventid', async (req, res) => {
  if (!opts.claims.matrix.instance || !opts.claims.matrix.accessToken) {
    return res.status(501).json({ error: 'Matrix not enabled on server' })
  }

  if (!req.query.id || !req.query.field) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }

  fetcher
    .matrix(req.params, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

// IRC route
router.get('/get/irc/:ircserver/:ircnick', async (req, res) => {
  if (!opts.claims.irc.nick) {
    return res.status(501).json({ error: 'IRC not enabled on server' })
  }

  if (!req.query.nick) {
    return res.status(400).json({ error: 'Missing parameter(s)' })
  }

  fetcher
    .irc(req.params, opts)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

module.exports = router
