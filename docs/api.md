# API

## claims.verify(uri, [fingerprint], [opts])

_(async)_ doip.claims.verify(uri, [fingerprint], [opts])

Verifies the identity behind the provided **uri** using the **fingerprint**.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| uri         | string | true      | the URI to an identity to verify |
| fingerprint | string | false     | the fingerprint of the claim     |
| opts        | object | false     | options (see below)              |

**Options**

| Name              | Type    | Default value        | Description                                                         |
| ----------------- | ------- | -------------------- | ------------------------------------------------------------------- |
| returnMatchesOnly | boolean | false                | only return matching service providers, do not attempt verification |
| proxyPolicy       | string  | 'adaptive'           | when to use a proxy ['adaptive', 'always', 'never']                 |
| doipProxyHostname | string  | 'proxy.keyoxide.org' | the hostname of the proxy server                                    |

When the `proxyPolicy` option is to `adaptive`, the chosen strategy is
the one suggested by the service provider.

**Returns**

An object with the results of the identity claim verification containing a
boolean named `isVerified` and a
[serviceproviderData](serviceproviderdataobject.md#service-provider-data-object)
object.

```json
{
  "isVerified": true,
  "serviceproviderData": { ... }
}
```

If `opts.returnMatchesOnly` is `true`, this function instead returns a list of
service providers matched to the provided `uri`.

## claims.verify(uriArray, [fingerprint], [opts])

_(async)_ doip.claims.verify(array, [fingerprint], [opts])

Verifies the identity behind the provided **array of uris** using the **fingerprint**.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| uriArray    | array  | true      | array of uris                    |
| fingerprint | string | false     | the fingerprint of the claim     |
| opts        | object | false     | options (see below)              |

**Options**

See [claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts).

**Returns**

An array of objects with claim verification results (see
[claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts)).

## claims.verify(key, [fingerprint], [opts])

_(async)_ doip.claims.verify(key, [fingerprint], [opts])

Verifies the identity behind the claims contained within the provided
**key** using the **fingerprint**. This key is outputted by the
[keys.fetch.*()](#keysfetchuriuri) commands.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| key         | object | true      | a public key                     |
| fingerprint | string | false     | the fingerprint of the claim     |
| opts        | object | false     | options (see below)              |

**Options**

See [claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts).

**Returns**

An array of objects with claim verification results (see
[claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts)).

## keys.fetch.uri(uri)

_(async)_ keys.fetch.uri(uri)

Fetches a key based on the provided `uri`. This simply serves as a shortcut to
other `keys.fetch.*` commands.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| uri         | string | true      | public key identifier            |

Possible formats for `uri`:

`hkp:FINGERPRINT` &rArr; `keys.fetch.hkp(FINGERPRINT)`  
`hkp:FINGERPRINT:KEYSERVER` &rArr; `keys.fetch.hkp(FINGERPRINT, KEYSERVER)`  
`hkp:EMAIL` &rArr; `keys.fetch.hkp(EMAIL)`  
`hkp:EMAIL:KEYSERVER` &rArr; `keys.fetch.hkp(EMAIL, KEYSERVER)`  
`wkd:EMAIL` &rArr; `keys.fetch.wkd(EMAIL)`  
`kb:USERNAME:FINGERPRINT` &rArr; `keys.fetch.keybase(USERNAME, FINGERPRINT)`  

**Returns**

A public key object.

## keys.fetch.hkp(fingerprint, [keyserverBaseUrl])

_(async)_ keys.fetch.hkp(fingerprint, [keyserverBaseUrl])

Fetches a key using HKP-compatible key servers.

**Parameters**

| Name             | Type   | Mandatory | Description                      |
| ---------------- | ------ | --------- | -------------------------------- |
| fingerprint      | string | true      | public key identifier            |
| keyserverBaseUrl | string | false     | base URL of keyserver            |

`keyserverBaseUrl` defaults to `https://keys.openpgp.org/`.

**Returns**

A public key object.

## keys.fetch.hkp(email, [keyserverBaseUrl])

_(async)_ keys.fetch.hkp(email, [keyserverBaseUrl])

Fetches a key using HKP-compatible key servers.

**Parameters**

| Name             | Type   | Mandatory | Description                      |
| ---------------- | ------ | --------- | -------------------------------- |
| email            | string | true      | public key identifier            |
| keyserverBaseUrl | string | false     | base URL of keyserver            |

`keyserverBaseUrl` defaults to `https://keys.openpgp.org/`.

**Returns**

A public key object.

## keys.fetch.wkd(wkdId)

_(async)_ keys.fetch.wkd(wkdId)

Fetches a key using the WKD protocol.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| wkdId       | string | true      | WKD identifier                   |

`wkdId` looks like an email address and is formatted as `username@domain.org`.

**Returns**

A public key object.

## keys.fetch.plaintext(keyPlaintext)

_(async)_ keys.fetch.plaintext(keyPlaintext)

Parses the `keyPlaintext`.

**Parameters**

| Name         | Type   | Mandatory | Description                      |
| ------------ | ------ | --------- | -------------------------------- |
| keyPlaintext | string | true      | ASCII key content                |

**Returns**

A public key object.
