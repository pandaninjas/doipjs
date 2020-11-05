# Quick start

## Installation

Install using **Yarn**:

```bash
yarn add doipjs
```

Install using **NPM**:

```bash
npm install --save doipjs
```

## Usage (Node.js)

Basic example:

```javascript
const doip = require('doip')

const verifyIdentity = async (url, fp) => {
  console.log(await doip.verify(url, fp))
}
verifyIdentity('dns:doip.rocks', '9f0048ac0b23301e1f77e994909f6bd6f80f485d')
```

This snippet works en will verify the [doip.rocks](https://doip.rocks) as
linked to Yarmo's cryptographic key using the [dns](serviceproviders/dns.md)
service provider.

## Usage (browser)

Basic example:

```html
<script src="https://cdn.jsdelivr.net/npm/keyoxide@0.3.0/dist/doip.min.js"></script>
```

```javascript
const verifyIdentity = async (url, fp) => {
  console.log(await doip.verify(url, fp))
}
verifyIdentity('dns:doip.rocks', '9f0048ac0b23301e1f77e994909f6bd6f80f485d')
```
