# xmpp

## Proof

Proofs are defined by adding the following information to the **About** section
of the profile's vCard information using a client that support editing that
information:

```
This is an OpenPGP proof that connects my OpenPGP key to this XMPP account. For details check out https://keyoxide.org/guides/openpgp-proofs

[Verifying my OpenPGP key: openpgp4fpr:FINGERPRINT]
```

Make sure to replace `FINGERPRINT`.

## Claim

```
xmpp:XMPP_ID
```

or with OMEMO:

```
xmpp:XMPP_ID?omemo-sid-OMEMO_DEVICE_ID=OMEMO_FINGERPRINT&...
```

Make sure to replace `XMPP_ID`, `OMEMO_DEVICE_ID` and `OMEMO_FINGERPRINT`.
