# Quick start (browser)

Basic example:

```javascript
const verifyIdentity = async (url, fp) => {
  console.log(await doip.verify(url, fp))
}
verifyIdentity('dns:doip.rocks', '9f0048ac0b23301e1f77e994909f6bd6f80f485d')
```

This snippet works en will verify the [doip.rocks](https://doip.rocks) domain as
linked to Yarmo's cryptographic key using the [dns](serviceproviders/dns.md)
service provider.
