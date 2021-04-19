# Quick start (browser)

Basic example:

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
linked to Yarmo's cryptographic key using the [dns](serviceproviders/dns.md)
service provider.

Please note you need to include the
[openpgpjs](https://github.com/openpgpjs/openpgpjs) library:

```html
<script src="https://cdn.jsdelivr.net/npm/openpgp/dist/openpgp.min.js"></script>
```

## Twitter account verification

By default, Twitter accounts verification has to be enabled by either having a
Twitter developer account or providing a Nitter instance domain.

Please refer to the
[API documentation](/#/api?id=claimsverifyuri-fingerprint-opts).
