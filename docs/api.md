# API

## verify

*(async)* doip.verify(uri, [fingerprint], [opts])

Verifies the identity behind the provided **uri** using the **fingerprint**.

**Parameters**

| Name        | Mandatory | Type   | Description                      |
|-------------|-----------|--------|----------------------------------|
| uri         | true      | string | the URI to an identity to verify |
| fingerprint | false     | string | the fingerprint of the claim     |
| opts        | false     | object | options (see below)              |

**Options**

| Name        | Default   | Type   | Description                      |
|-------------|-----------|--------|----------------------------------|
| uri         | true      | string | the URI to an identity to verify |
| fingerprint | false     | string | the fingerprint of the claim     |
| opts        | false     | object | options                          |

**Returns**
