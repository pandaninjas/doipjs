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
const fetcher = require('../../../fetcher')
require('dotenv').config()

const xmpp_service = process.env.XMPP_SERVICE || null
const xmpp_username = process.env.XMPP_USERNAME || null
const xmpp_password = process.env.XMPP_PASSWORD || null
const twitter_bearer_token = process.env.TWITTER_BEARER_TOKEN || null
const matrix_instance = process.env.MATRIX_INSTANCE || null
const matrix_access_token = process.env.MATRIX_ACCESS_TOKEN || null
const irc_nick = process.env.IRC_NICK || null

let xmpp_enabled = true,
  twitter_enabled = false,
  matrix_enabled = false,
  irc_enabled = false

if (!xmpp_service || !xmpp_username || !xmpp_password) {
  xmpp_enabled = false
}
if (twitter_bearer_token) {
  twitter_enabled = true
}
if (matrix_instance && matrix_access_token) {
  matrix_enabled = true
}
if (irc_nick) {
  irc_enabled = true
}

router.get('/', async (req, res) => {
  return res.status(400).json({
    data: [],
    error:
      'Available endpoints: /json/:url, /text/:url, /dns/:hostname, /xmpp/:xmppid, /twitter/:tweetid, /matrix/:roomid/:eventid, /irc/:ircserver/:ircnick',
  })
})

router.param('url', async (req, res, next, url) => {
  req.params.url = decodeURI(url)

  if (!validUrl.isUri(req.params.url)) {
    return res.status(400).json({ error: 'URL provided was not valid' })
  }

  next()
})

router.param('xmppid', async (req, res, next, xmppid) => {
  req.params.xmppid = xmppid

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(req.params.xmppid)) {
    next()
  } else {
    return res.status(400).json({ error: 'XMPP_ID was not valid' })
  }
})

router.param('xmppdata', async (req, res, next, xmppdata) => {
  req.params.xmppdata = xmppdata.toUpperCase()

  const allowedData = [
    'FN',
    'NUMBER',
    'USERID',
    'URL',
    'BDAY',
    'NICKNAME',
    'NOTE',
    'DESC',
  ]

  if (!allowedData.includes(req.params.xmppdata)) {
    return res.status(400).send({
      data: [],
      error:
        'Allowed data are: FN, NUMBER, USERID, URL, BDAY, NICKNAME, NOTE, DESC',
    })
  }

  next()
})

router.get('/get/json/:url', (req, res) => {
  bentReq(req.params.url, 'json', {
    Accept: 'application/json',
  })
    .then(async (result) => {
      return await result.json()
    })
    .then(async (data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

router.get('/get/text/:url', (req, res) => {
  bentReq(req.params.url)
    .then(async (result) => {
      return await result.text()
    })
    .then(async (result) => {
      return res.status(200).send(result)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

router.get('/get/dns/:hostname', (req, res) => {
  fetcher
    .dns(req.params.hostname)
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

router.get('/get/xmpp/:xmppid', async (req, res) => {
  return res.status(400).send({
    data: [],
    error:
      'Data request parameter missing (FN, NUMBER, USERID, URL, BDAY, NICKNAME, NOTE, DESC)',
  })
})

router.get('/get/xmpp/:xmppid/:xmppdata', async (req, res) => {
  if (!xmpp_enabled) {
    return res.status(501).json({ error: 'XMPP not enabled on server' })
  }

  fetcher
    .xmpp(req.params.xmppid, req.params.xmppdata, {
      service: xmpp_service,
      username: xmpp_username,
      password: xmpp_password,
    })
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err.message ? err.message : err })
    })
})

router.get('/get/twitter/:tweetid', async (req, res) => {
  if (!twitter_enabled) {
    return res.status(501).json({ error: 'Twitter not enabled on server' })
  }

  fetcher
    .twitter(req.params.tweetid, {
      bearerToken: twitter_bearer_token,
    })
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

router.get('/get/matrix/:matrixroomid/:matrixeventid', async (req, res) => {
  if (!matrix_enabled) {
    return res.status(501).json({ error: 'Matrix not enabled on server' })
  }

  fetcher
    .matrix(req.params.matrixroomid, req.params.matrixeventid, {
      instance: process.env.MATRIX_INSTANCE,
      accessToken: process.env.MATRIX_ACCESS_TOKEN,
    })
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

router.get('/get/irc/:ircserver/:ircnick', async (req, res) => {
  if (!irc_enabled) {
    return res.status(501).json({ error: 'IRC not enabled on server' })
  }

  fetcher
    .irc(req.params.ircserver, req.params.ircnick, {
      nick: 'doipver148927',
    })
    .then((data) => {
      return res.status(200).send(data)
    })
    .catch((err) => {
      return res.status(400).json({ error: err })
    })
})

module.exports = router
