# Decentralized OpenPGP Identity Proofs

Decentralized OpenPGP Identity Proofs, or DOIPs, are a way of identifying
and linking profiles and accounts on the internet. Take ten different websites
and make an account on each of them. How could outsiders tell they were created
by the same person? They can't directly. You could be **Alice** on website A but
**Alice123** on website B.

What if a bad actor creates an account **Alice** on a brand new website and
starts contacting people you know from website A? How could they verify this new
accounts is in fact you?

With the digital realm becoming more and more a second home in our lives, we
need tools to identify ourselves and stay safe.

## Why decentralized?

Say you have a Facebook or Google account. You can use that to create accounts
on different websites. Problem solved! That is, until the day you get an email
that your account was flagged by AI, you just lost access to all those websites
and there's no way to contact them to restore it.

This [happens way too often](https://www.businessinsider.com/google-users-locked-out-after-years-2020-10?international=true&r=US&IR=T).

Why does it happen? You are a number to them. Losing you as a user doesn't cost
them anything.

Therefore, it is imperative that new solutions give the people **sovereignty**
over their identity. How do we do this? By making new solutions
**decentralized**.

**Decentralized** simply means that there is no central authority. In the
classic model, you give your data to Facebook or Google and the truth is what
they say it is: if they say you no longer exist, then, well, you no longer
exist. In the **decentralized** model, you hold your own data and no one can
take that away from you. This also means that service providers should fight for
you to keep you as a user since **you allow them to use your data**. Any misstep
on their behalf and you can take it away.

## Why OpenPGP?

To achieve user sovereignty, DOIP relies on **OpenPGP** cryptographic keys. Read
more about those keys [here](cryptographickeys.md) but in short: they are like
documents that the whole world can read but only you can edit. In that way, you
can publish a list of profiles on websites that you have created but no one can
do that for you in an attempt to impersonate you.

## Bidirectional linking

There's a catch: simply adding a link to a profile inside your OpenPGP document
is not sufficient. If it were, you could claim any profile anywhere simply by
linking to them!

This is why DOIP uses two-way or bidirectional linking. Your key must link to a
profile and your profile must link back to the key. That is the only way to make
sure you hold both the key and the profile.

This also solves the imposter problem. A bad actor could you link to your
profile but since your profile doesn't link back to their key, DOIP will not
verify their claim. Unless they hacked your profile, in which case you have more
urgent problems.

How does a profile link to a cryptographic key? Every key can be uniquely
identified using what we call their **fingerprint**. All a profile page needs to
do is contain that fingerprint somehow. Usually, this can be added as the last
line to a biography.

Note that the service provider itself needs to do a few things to support the
verification of DOIPs. Please refer to the [list of supported service providers](serviceproviders.md)

## Adding more than one proof

The endgame of using DOIP is to add at least two profile. Proving that you own
a single profile&mdash;in a way&mdash;doesn't prove anything. The issue is that
we cannot prove that **you**, the physical being **you**, holds that key. DOIP
can only verify that "*whoever holds that key also holds that profile*".

By adding at least two profiles, you can create meaningful links between those
profiles. If someone knows **you**, the physical being **you**, is **Alice** on
website A, they will also now know that you are **Alice123** on website B,
simply because "*whoever holds that key also holds both of those profiles*".

## Why the snail logo?

> Aren't snails  associated with slowness?

Well, they are also animals that take their homes with them wherever they go. In
a sense, they are a nice metaphor for DOIP. Snails are the ultimate
"decentralized life" species of the animal kingdom. They don't have to rely on
centralized (social) structures, they are self-sufficient by always having their
home and their identity&mdash;and their data!&mdash;with them.

> Yeah, but&hellip; Snails are slow, though!

You know what, let's embrace the Big Slow. DOIP is slow. Not computationally
slow. DOIP is just a slow technology. It doesn't provide a social network, it
doesn't send notifications or reminders, it doesn't want your attention. DOIP is
more set-and-forget. Set your identities and the technology handles the rest. As
long as your public keys are live, they'll just continue to work without your
intervention.

So yes, it's a **Slow Technology**.
