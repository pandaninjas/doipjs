# Terminology

## Claim

A piece of data that is expected to be contained with the [proof](#proof). When
found, the claim&mdash;and the identity associated with the claim&mdash;is
verified. Within the context of this project, a claim is always the fingerprint
of an [OpenPGP](#openpgp) [cryptographic key](#cryptographic-key), but formatted
in different ways depending on the [service provider](#service-provider).

For more detailed information, please refer to [Claims](claims.md).

## Cryptographic key


According to [Wikipedia](https://en.wikipedia.org/wiki/Key_(cryptography)):

> [...] a piece of information (a parameter) that determines the functional
output of a cryptographic algorithm.

Cryptographic keys can be used to encrypt/decrypt data and verify digital
signatures.

Within the context of this project, we can view cryptographic keys as documents
that everyone can read but only one person can edit. This makes it the perfect
candidate to serve as vessel for [decentralized](#decentralized)
[identity](#identity) [claims](#claim).

## Decentralized

A model for interaction between computers or nodes in a network. Its
distinguishing feature is that this model does not rely on a central authority,
unlike traditional centralized models that are used by Facebook, Google and all
other privacy-invading corporations.

A core outcome of choosing a decentralized model is that it gives the user
**sovereignty** over their data, instead of giving all the power to the central
node. This means that [service providers](#service-provider) are **allowed** to
access a user's data, courtesy of that user. It also implies that that user can
choose to block access of any [service provider](#service-provider) at any
point in time and move to a different [service provider](#service-provider). In
this new model, [service providers](#service-provider) need to fight for access
to that user data and any user-compromising service can simply be left behind.

Within the context of this project, you store your identity claims inside a
[cryptographic key](#cryptographic-key). You can then use any compatible client
software or website to verify these claims. And if you don't like that
particular client software or website, you just choose to use a different one.

## DOIP

A protocol that describes how interactions between
[cryptographic keys](#cryptographic-key) and
[service providers](#service-provider) can be used to the advantage of the
people on the internet and allow them to publicly verify their online
[identity](#identity) in a secure manner that is resistant to impersonation.

Currently, this documentation is the most elaborate description of the inner
workings of the DOIP protocol. Drafting a standard is planned.

## Fingerprint

A string of hexadecimal characters that uniquely identifies a
[cryptographic key](#cryptographic-key).

Within the context of this project, they are used to link a [profile](#profile)
page back to a single [cryptographic key](#cryptographic-key) by mentioning this
fingerprint anywhere on the [profile](#profile) page, like inside a biography.

## Identity

Within the context of this project, identity refers to a person's
**digital online identity**, the collection of [profiles](#profile) that a
person holds and that partially accounts for a person's online activity. A
physical person can have multiple online identities, for example a private
identity and a work-related identity.

That collection of [profiles](#profile) can be stored inside
[cryptographic key](#cryptographic-key).

## OpenPGP

A standard for [cryptographic keys](#cryptographic-key) defined by
[RFC 4880](https://tools.ietf.org/html/rfc4880).

## Profile

A piece of data that is created by a physical person but stored and managed on
the servers of a [service provider](#service-provider). While a person does not
own that data, it does define them as part of their online
[identity](#identity).

Usually, a [service provider](#service-provider) generates a profile page based
on that user data that displays basic information like a username, an avatar and
a biography.

## Proof

A piece of data provided a [service provider](#service-provider) that contains
at least some of the data that it stores on a specific user. That piece of data
also is publicly available to all, usually as a JSON document.

A [claim](#claim) expects the proof to contain a certain statement. For
[DOIP](#doip), this statement is a [fingerprint](#fingerprint).

For more detailed information, please refer to [Proofs](proofs.md).

## Proxy

A piece of software that handles the request for proof instead of the original
piece of software that called the proxy. This is useful when doip.js is used in
browsers. Some [service providers](#service-provider) do not allow their public
data to be accessed by other websites (so called CORS restrictions,
[Wikipedia](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)) but
requests from non-browser origin are accepted and fulfilled. Doip.js when used
in a browser will let proxy servers handle their requests for them to eliminate
this friction.

Doip.js requires a proxy server to run the open source
[doip-proxy software](https://codeberg.org/keyoxide/doip-proxy).

## Service provider

A company, organization or protocol that stores [profiles](#profile) submitted
by their users. The data associated to those [profiles](#profile) should at
least be partially made publicly available to allow identity verification using
[DOIP](#doip).

For more information, please refer to [Service providers](serviceproviders.md).
