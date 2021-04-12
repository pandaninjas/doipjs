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
const dns = require('dns')
const bent = require('bent')
const bentReq = bent('GET')
const validUrl = require('valid-url')
const jsdom = require('jsdom')
const { client, xml } = require('@xmpp/client')
const debug = require('@xmpp/debug')
const irc = require("irc-upd")
require('dotenv').config()

const xmpp_service = process.env.XMPP_SERVICE || null
const xmpp_username = process.env.XMPP_USERNAME || null
const xmpp_password = process.env.XMPP_PASSWORD || null
const twitter_bearer_token = process.env.TWITTER_BEARER_TOKEN || null
const matrix_instance = process.env.MATRIX_INSTANCE || null
const matrix_access_token = process.env.MATRIX_ACCESS_TOKEN || null
const irc_nick = process.env.IRC_NICK || null

let xmpp = null,
  iqCaller = null,
  xmpp_enabled = true,
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

const xmppStart = async (xmpp_service, xmpp_username, xmpp_password) => {
  return new Promise((resolve, reject) => {
    const xmpp = client({
      service: xmpp_service,
      username: xmpp_username,
      password: xmpp_password,
    })
    if (process.env.NODE_ENV !== 'production') {
      debug(xmpp, true)
    }
    const { iqCaller } = xmpp
    xmpp.start()
    xmpp.on('online', (address) => {
      console.log('online', address.toString())
      resolve({ xmpp: xmpp, iqCaller: iqCaller })
    })
    xmpp.on('error', (error) => {
      reject(error)
    })
  })
}

router.get('/', async (req, res) => {
  res.status(200).json({
    message:
      'Available endpoints: /json/:url, /text/:url, /dns/:hostname, /xmpp/:xmppid, /twitter/:tweetid, /matrix/:roomid/:eventid, /irc/:ircserver/:ircnick',
  })
})

router.param('url', async (req, res, next, url) => {
  req.params.url = decodeURI(url)

  if (!validUrl.isUri(req.params.url)) {
    return res.status(400).send({ message: 'URL provided was not valid' })
  }

  next()
})

router.param('xmppid', async (req, res, next, xmppid) => {
  req.params.xmppid = xmppid

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(req.params.xmppid)) {
    next()
  } else {
    return res.status(400).json({ message: 'XMPP_ID was not valid' })
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
    return res.status(400).json({
      message:
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
  .then(async (result) => {
    return res.status(200).json({ url: req.params.url, content: result })
  })
  .catch((e) => {
    return res.status(400).send({ error: e })
  })
})

router.get('/get/text/:url', (req, res) => {
  bentReq(req.params.url)
  .then(async (result) => {
    return await result.text()
  })
  .then(async (result) => {
    return res.status(200).json({ url: req.params.url, content: result })
  })
  .catch((e) => {
    return res.status(400).send({ error: e })
  })
})

router.get('/get/dns/:hostname', async (req, res) => {
  dns.resolveTxt(req.params.hostname, (err, records) => {
    const out = {
      hostname: req.params.hostname,
      records: {
        txt: records,
      },
    }
    return res.status(200).json(out)
  })
})

router.get('/get/xmpp/:xmppid', async (req, res) => {
  return res
    .status(400)
    .json(
      'Data request parameter missing (FN, NUMBER, USERID, URL, BDAY, NICKNAME, NOTE, DESC)'
    )
})

router.get('/get/xmpp/:xmppid/:xmppdata', async (req, res) => {
  if (!xmpp_enabled) {
    return res.status(500).json('XMPP not enabled on server')
  }
  if (!xmpp) {
    const xmppStartRes = await xmppStart(
      xmpp_service,
      xmpp_username,
      xmpp_password
    )
    xmpp = xmppStartRes.xmpp
    iqCaller = xmppStartRes.iqCaller
  }

  const response = await iqCaller.request(
    xml(
      'iq',
      { type: 'get', to: req.params.xmppid },
      xml('vCard', 'vcard-temp')
    ),
    30 * 1000
  )

  const vcardRow = response.getChild('vCard', 'vcard-temp').toString()

  const dom = new jsdom.JSDOM(vcardRow)

  try {
    let vcard

    switch (req.params.xmppdata.toLowerCase()) {
      case 'desc':
      case 'note':
        vcard = dom.window.document.querySelector('note text')
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
        vcard = dom.window.document.querySelector(req.params.xmppdata).textContent
        break
    }
    return res.status(200).json(vcard)
  } catch (error) {
    return res.status(400).json({ message: 'Request could not be fulfilled', error: error })
  }
})

router.get('/get/twitter/:tweetid', async (req, res) => {
  if (!twitter_enabled) {
    return res.status(500).json('Twitter not enabled on server')
  }

  bentReq(`https://api.twitter.com/1.1/statuses/show.json?id=${req.params.tweetid}`, null, {
    Accept: 'application/json',
    Authorization: `Bearer ${twitter_bearer_token}`
  })
  .then(async (data) => {
    return await data.json()
  })
  .then((data) => {
    return res.status(200).json({ data: data, message: 'Success', error: {} })
  })
  .catch((error) => {
    return res.status(error.statusCode || 400).json({ data: [], message: 'Request could not be fulfilled', error: error })
  })
})

router.get('/get/matrix/:matrixroomid/:matrixeventid', async (req, res) => {
  if (!matrix_enabled) {
    return res.status(500).json('Matrix not enabled on server')
  }

  const url = `https://${matrix_instance}/_matrix/client/r0/rooms/${req.params.matrixroomid}/event/${req.params.matrixeventid}?access_token=${matrix_access_token}`

  bentReq(url, null, {
    Accept: 'application/json'
  })
  .then(async (data) => {
    return await data.json()
  })
  .then((data) => {
    return res.status(200).json({ data: data, message: 'Success', error: {} })
  })
  .catch((error) => {
    return res.status(error.statusCode || 400).json({ data: [], message: 'Request could not be fulfilled', error: error })
  })
})

router.get('/get/irc/:ircserver/:ircnick', async (req, res) => {
  if (!irc_enabled) {
    return res.status(500).json('IRC not enabled on server')
  }
  
  try {
    const client = new irc.Client(req.params.ircserver, irc_nick, {
      port: 6697,
      secure: true,
      channels: [],
    })
    const reKey = /[a-zA-Z0-9\-\_]+\s+:\s(openpgp4fpr\:.*)/
    const reEnd = /End\sof\s.*\staxonomy./
    let keys = []

    client.addListener('registered', (message) => {
      client.send(`PRIVMSG NickServ :TAXONOMY ${req.params.ircnick}`)
    })
    client.addListener('notice', (nick, to, text, message) => {
      if (reKey.test(text)) {
        const match = text.match(reKey)
        keys.push(match[1]);
      }
      if (reEnd.test(text)) {
        client.disconnect()
        return res.status(200).json({ data: keys, message: 'Success', error: {} })
      }
    })
  } catch (error) {
    return res.status(400).json({ data: [], message: 'Request could not be fulfilled', error: error })
  }
})

module.exports = router
