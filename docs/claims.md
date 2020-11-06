# Claims

## Definition

A **claim** is one of the two pieces of data needed to verify an online
identity, the other being a [proof](proofs.md).

A claim is always a phrase, string or URI that is expected to be found inside
the proof. **The presence of a claim inside a proof verifies that claim.**

## Claims in OpenPGP keys

DOIP assumes claims are stored in OpenPGP keys as so-called notations. The
format for all claims is the same:

```
proof@metacode.biz=...
```

## Relation with proof

The relation between proof and claim is defined by three variables: `format`,
`path` and `relation`.

In the following examples, we'll assume we are dealing with a key that has the
fingerprint `13ec664f5e0c3e4ebad8b7441adbf09217175f75`.

### format

This variable describes how the proof is integrated in the data returned by the
service provider.

If `format` is set to `uri`, the claim expects the proof to be or contain:

```
openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75
```

If `format` is set to `message`, the claim expects the proof to be or contain:

```
[Verifying my OpenPGP key: openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75]
```

If `format` is set to `fingerprint`, the claim expects the proof to be or
contain:

```
13ec664f5e0c3e4ebad8b7441adbf09217175f75
```

### path

This variables describes how to get to the important proof-containing field
inside the JSON data. It is an array of strings, each string equal to the next
field inside the JSON data.

If the proof data is text, the `path` value is ignored.

Assuming the following JSON data:

```json
"firstField": {
  "secondField": {
    "finalField": "openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75",
    "yetAnotherField": "yetAnotherValue"
  },
  "otherField": "someValue"
}
```

To verify any claim, the `path` should be set to:

```javascript
['firstField', 'secondField', 'finalField']
```

**JSON data containing arrays**

In cases there are arrays in the JSON data, these should **not** be entered in
`path`. They will always be iterated over.

Assuming the following JSON data:

```json
"firstField": {
  "fieldContainingArray": [
    {
      "finalField": "https://domain.org",
      "yetAnotherField": "yetAnotherValue1"
    },
    {
      "finalField": "openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75",
      "yetAnotherField": "yetAnotherValue2"
    }
  ],
  "otherField": "someValue"
}
```

To verify any claim, the `path` should be set to:

```javascript
['firstField', 'fieldContainingArray', 'finalField']
```

Every `finalField` field for every item in the `fieldContainingArray` array will
be tested for the claim.

### relation

This variable simply states whether after following the `path` inside the JSON
data, the obtained value `contains` the claim, `equals` the claim or if the
obtained value is an array, the claim is `oneOf` the values of the array.

The `relation` should be `contains` for the following proof data:

```json
"firstField": {
  "secondField": {
    "finalField": "Long text. openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75. Perhaps more text."
  }
}
```

The `relation` should be `equals` for the following proof data:

```json
"firstField": {
  "secondField": {
    "finalField": "openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75"
  }
}
```

The `relation` should be `oneOf` for the following proof data:

```json
"firstField": {
  "secondField": {
    "finalField": [
      "cats",
      "openpgp4fpr:13ec664f5e0c3e4ebad8b7441adbf09217175f75"
    ]
  }
}
```
