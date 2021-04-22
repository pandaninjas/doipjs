# doip.js

![](/static/doip.png)
![](/doip.png)

doip.js allows websites and Node.js projects to verify decentralized online
identities based on OpenPGP.

Documentation available at [js.doip.rocks](https://js.doip.rocks).

## Features

- Verify online identities using decentralized technology
- Based on [OpenPGP](https://www.openpgp.org), a widely-used cryptographic standard
- Regex-based service provider detection
- [Mocha](https://mochajs.org) tests

## Installation (node)

Install using **yarn** or **npm**:

```bash
yarn add doipjs
# or
npm install --save doipjs
```

Import the `doip` module in your code:

```javascript
const doip = require('./doipjs')
```

## Installation (browser)

Include the following HTML snippet (requires [openpgp.js](https://openpgpjs.org/)):

```html
<script src="/static/openpgp.min.js"></script>
<script src="/static/doip.min.js"></script>
```

## Quickstart

Run the following javascript:

```javascript
const verifyIdentity = async (url, fp) => {
  const claim = new doip.Claim(url, fp)
  claim.match()
  await claim.verify()
  console.log(claim.result)
}
verifyIdentity('dns:doip.rocks', '9f0048ac0b23301e1f77e994909f6bd6f80f485d')
```

This snippet works en will verify the [doip.rocks](https://doip.rocks) domain as
bidirectionally linked to Yarmo's cryptographic key.

## About Keyoxide

[Keyoxide](https://keyoxide.org/), made by Yarmo Mackenbach, is a modern, secure
and privacy-friendly platform to establish decentralized online identities using
a novel concept know as [DOIP](doip.md). In an effort to make this technology
accessible for other projects and stimulate the emergence of both complementary
and competing projects, this project-agnostic library is
[published on codeberg.org](https://codeberg.org/keyoxide/doipjs) and open
sourced under the
[Apache-2.0](https://codeberg.org/keyoxide/doipjs/src/branch/main/LICENSE)
license.

## Community

There's a [Keyoxide Matrix room](https://matrix.to/#/#keyoxide:matrix.org) where
we discuss everything DOIP and Keyoxide.

## Donate

Please consider [donating](https://liberapay.com/Keyoxide/) if you think this
project is a step in the right direction for the internet.

## Funding

This library was realized with funding from
[NLnet](https://nlnet.nl/project/Keyoxide/).
