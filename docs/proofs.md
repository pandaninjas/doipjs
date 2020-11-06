# Proofs

## Definition

A **proof** is one of the two pieces of data needed to verify an online
identity, the other being a [claim](claims.md).

Usually, the proof is a JSON document provided by the service provider
containing publicly-available data of the user. This data may contain the
username and a biography. Currently, a lot of service providers are supported
because of the ability to write a proof statement inside a biography or
something similar. Other service providers are supported by entering the proof
statement in a post, in which case said service provider must provide JSON data
for each post.

With regards to identity verification, **the presence of a claim inside a proof
verifies that claim.**

See [claims](claims.md) for details on how proofs and claims are
(programmatically) related to each other.

A proof can also be a text of any length. This changes nothing about the
definition above. It only means the search for the claim is simpler: no
traversing a JSON document, just find the claim inside the text and the claim is
verified.
