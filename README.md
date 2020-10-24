# doip.js

Decentralized OpenPGP Identity Proofs library in node

## Technical specifications

### Service provider data structure

The object returned by a service provider consists of:

```
- serviceprovider (object)
  - type          (string: the service provider's type [web, communication])
  - name          (string: the service provider's name)
- profile         (object)
  - display       (string: the profile's identifier for display)
  - uri           (string: the profile's URI)
- proof           (object)
  - uri           (string: the URI containing the proof to be by humans and machines)
  - fetch         (string: see below)
  - useProxy      (boolean: should the request be sent using a proxy)
  - format        (string: [json, text])
- claim           (object)
  - fingerprint   (string: the fingerprint that verifies the claim if found in the proof)
  - format        (string: see below [uri, message, fingerprint])
  - path          (string: the path to the claim inside the proof JSON (comma-separated))
  - relation      (string: how the claim format relates to the proof format [contains, equals, oneOf])
- qr              (string: a URI to be displayed as QR code if the claim is verified)
```

### proof.fetch

Sometimes, the URI used by humans to verify a claim is inadequate for use by machines. This is needed when the JSON is served by a different endpoint. In this case, machines will use a different URI than the one shown to humans.

### claim.format

There are three claim formats:
- uri: the claim is formulated as `openpgp4fpr:FINGEPRPRINT`
- message: the claim is formulated as `[Verifying my OpenPGP key: openpgp4fpr:FINGEPRPRINT]`
- fingerprint: the claim is formulated as `FINGEPRPRINT`
