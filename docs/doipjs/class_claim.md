# Claim (class)

## Constructor

new Claim([uri], [fingerprint])

**Parameters**

| Name        | Type   | Mandatory | Description                       |
| ----------- | ------ | --------- | --------------------------------- |
| uri         | string | false     | The URI to an identity to verify  |
| fingerprint | string | false     | The fingerprint to verify against |

## Properties

### uri

The `uri` to an identity to verify. It can be modified until the claim is in a
`matched` state.

**Returns** `{String|null}`

### fingerprint

The `fingerprint` to verify against. It can be modified until the claim is in a 
`verified` state.

**Returns** `{String|null}`

### state

The current `state` of the Claim object. It can not be set.

**Values**

| Value    | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| init     | The claim has just been initialized                               |
| matched  | The claim has been matched to candidate claim definitions         |
| verified | The claim has attempted to verify all candidate claim definitions |

**Returns** `{String}` The current state

### matches

The `matches` (or "candidate claim definitions") that have been matched against
the `uri`.

Will throw an error if the claim has not yet run `match()`.

**Returns** `{Array<Object>}`

## Methods

### match()

claimInstance.match()

Verifies the identity behind the provided **uri** using the **fingerprint**.

**Parameters**

| Name        | Type   | Mandatory | Description                      |
| ----------- | ------ | --------- | -------------------------------- |
| uri         | string | true      | the URI to an identity to verify |
| fingerprint | string | false     | the fingerprint of the claim     |
| opts        | object | false     | options (see below)              |

**Options**

| Name               | Type    | Default value        | Description                                                            |
| ------------------ | ------- | -------------------- | ---------------------------------------------------------------------- |
| returnMatchesOnly  | boolean | false                | only return matching service providers, do not attempt verification    |
| proxyPolicy        | string  | 'adaptive'           | when to use a proxy ['adaptive', 'fallback', 'always', 'never']        |
| doipProxyHostname  | string  | 'proxy.keyoxide.org' | the hostname of the proxy server                                       |
| twitterBearerToken | string  | ''                   | the Twitter API bearer token used for Twitter verification             |
| nitterInstance     | string  | ''                   | the domain name of the nitter instance to use for Twitter verification |

When the `proxyPolicy` option is to `adaptive`, the chosen strategy is
the one suggested by the service provider.

By default, Twitter accounts are not verified. Either provide a
[Twitter bearer token](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens)
(as `twitterBearerToken`) or the domain name of a Nitter instance (as
`nitterInstance`) to enable Twitter account verification. If both values are
provided, only the Twitter bearer token is used.

Note that Nitter instances are subject to rate limiting which would instantly
break Twitter account verification.

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

### verify([opts])

_(async)_ `claimInstance.verify([opts])`

Verifies the identity behind the provided **array of uris** using the **fingerprint**.

**Parameters**

| Name        | Type   | Mandatory | Description                  |
| ----------- | ------ | --------- | ---------------------------- |
| uriArray    | array  | true      | array of uris                |
| fingerprint | string | false     | the fingerprint of the claim |
| opts        | object | false     | options (see below)          |

**Options**

See [claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts).

**Returns**

An array of objects with claim verification results (see
[claims.verify(uri, ...)](#claimsverifyuri-fingerprint-opts)).
