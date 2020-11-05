# Service provider data object

The object returned by any service provider has the following layout:

```
serviceprovider
  type                string: the service provider's type [web, communication]
  name                string: the service provider's name
profile
  display             string: the profile's identifier for display
  uri                 string: the profile's URI
proof
  uri                 string: the URI containing the proof to be by humans and machines
  fetch               string: an alternative URI that should be used by machines
  useProxy            boolean: should the request be sent using a proxy
  format              string: [json, text]
claim
  fingerprint         string: the fingerprint that verifies the claim if found in the proof
  format              string: how is the fingerprint formatted [uri, message, fingerprint]
  path                array: the path to the claim inside the proof JSON
  relation            string: how the claim format relates to the proof format [contains, equals, oneOf]
qr                    string: a URI to be displayed as QR code if the claim is verified
customRequestHandler  function: handles the request if the default request handler does not suffice; optional
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

The account's name to display

## proof.fetch

Sometimes, the URI used by humans to verify a claim is inadequate for use by machines. This is needed when the JSON is served by a different endpoint. In this case, machines will use a different URI than the one shown to humans.

## claim.format

There are three claim formats:
- uri: the claim is formulated as `openpgp4fpr:FINGEPRPRINT`
- message: the claim is formulated as `[Verifying my OpenPGP key: openpgp4fpr:FINGEPRPRINT]`
- fingerprint: the claim is formulated as `FINGEPRPRINT`
