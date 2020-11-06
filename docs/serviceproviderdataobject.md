# Service provider data object

## Overview

The object returned by any service provider has the following layout:

```json
{
  "serviceprovider" : {
    "type": "web",
    "name": "awesome-service"
  },
  "profile": {
    "display": "Alice",
    "uri": "https://domain.org/users/Alice",
    "qr": null
  },
  "proof": {
    "uri": "https://domain.org/users/Alice.json",
    "fetch": null,
    "useProxy": false,
    "format": "json"
  },
  "claim": {
    "fingerprint": "13ec664f5e0c3e4ebad8b7441adbf09217175f75",
    "format": "uri",
    "path": ["user", "cryptographicKeys"],
    "relation": "oneOf"
  },
  "customRequestHandler": null
}
```

## serviceprovider.type

```
Type: string
Values: web, communication
Mandatory: true
```

Currently, only two types of service providers are supported:
- `web`: traditional website platforms
- `communication`: platforms for interpersonal communication

## serviceprovider.name

```
Type: string
Values: *
Mandatory: true
```

The name of the service provider (or protocol): `dns`, `xmpp`, `gitea`, `fediverse`, etc.

## profile.display

```
Type: string
Values: *
Mandatory: true
```

The account's name to display.

## profile.uri

```
Type: string
Values: *
Mandatory: true
```

The URI/URL to the profile page of the account.

## profile.qr

```
Type: string | null
Values: *
Mandatory: true
```

A QR link related to the profile to be displayed **if and only if** the identity proof is verified.

## proof.uri

```
Type: string
Values: *
Mandatory: true
```

The URI to the JSON/text data that holds the proof verifying the claim.

## proof.fetch

```
Type: string | null
Values: *
Mandatory: true
```

If not `null`, the URI to the JSON/text data that holds the proof verifying the claim to be fetched solely by a machine.

In some cases, we need to consider two separate URIs for proof verification. It could be that an identity proof is stored in a post. In such a case, `proof.uri` should be the URL to that post that can be verified by a human and `proof.fetch` should be the URL to the JSON data associated to that post.

## claim.fingerprint

```
Type: string | null
Values: *
Mandatory: true
```

The fingerprint of the claim to verify against the proof. If `null`, the verification itself is skipped.

## claim.format

```
Type: string
Values: uri, message, fingerprint
Mandatory: true
```

The format in which the claim's fingerprint is expected to be found in the proof. There are three supported claim formats:
- `uri`: the claim is formulated as `openpgp4fpr:FINGERPRINT`
- `message`: the claim is formulated as `[Verifying my OpenPGP key: openpgp4fpr:FINGERPRINT]`
- `fingerprint`: the claim is formulated as `FINGERPRINT`

## claim.path

```
Type: array | null
Values: *
Mandatory: true
```

The path inside the JSON proof data that leads to the field where the claim's fingerprint is expected to be found. Each field is inputted as a string appended to the array. When a certain field in the JSON data contains an array, this level will not get an input in `claim.path`: arrays are to be automatically iterated over.

If the proof data is text based, this field is ignored and its value should be set to `null`.

See [Claims](claims.md) for examples on how this works.

## claim.relation

```
Type: string
Values: contains, equals, oneOf
Mandatory: true
```

How the claim relates to the proof. There are three supported claim relations:
- `contains`: the proof is a long text containing the claim
- `equals`: the proof is equal to the claim
- `oneOf`: the proof is an array of string, one of which is the claim

## customRequestHandler

```
Type: function | null
Values: *
Mandatory: false
```

A function that will be called to handle the actual request to obtain the proof data. Most service providers will not need this and will use the default internal request handler to fetch the JSON/text data containing the proof. Service providers that need more than a single simple HTTP GET request must provide their own `customRequestHandler`.
