# API

## verify

_(async)_ doip.verify(uri, [fingerprint], [opts])

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
boolean named `isVerified` and a [serviceproviderData](serviceproviderdataobject.md#service-provider-data-object)
object.

```json
{
  "isVerified": true,
  "serviceproviderData": { ... }
}
```

If `opts.returnMatchesOnly` is `true`, this function instead returns a list of
service providers matched to the provided `uri`.
