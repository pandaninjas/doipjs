# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.12.8] - 2021-06-03
### Fixed
-  Expose key revocation status

## [0.12.7] - 2021-06-03
### Fixed
- IRC nickname regex

## [0.12.6] - 2021-05-23
### Fixed
- DNS fetcher not running

## [0.12.5] - 2021-05-21
### Fixed
- Keybase key fetching
- Fix IRC NickServ command syntax

## [0.12.4] - 2021-04-30
### Fixed
- Headings in CHANGELOG.md
- References to wrong variable

## [0.12.3] - 2021-04-30
### Fixed
- Ensure an output for the Claim's verification process
- Adaptive proxy policy now uses the fallback fetcher for generic access proofs 
- Refactor bad property names

## [0.12.2] - 2021-04-30
### Fixed
- Fix Claim constructor handling of object data
- Refactor bad property names

## [0.12.1] - 2021-04-26
### Fixed
- Bad interpretation of proxy policy
- Proxy URL protocol

## [0.12.0] - 2021-04-22
### Added
- Proxy server functionality
- JSDoc-based documentation
- Claim class
### Changed
- Improved data fetching logic
### Fixed
- Bug causing false positive verification

## [0.11.2] - 2021-03-06
### Fixed
- Matrix.to URLs

## [0.11.1] - 2021-03-06
### Fixed
- Proxy URL encoding

## [0.11.0] - 2021-03-05
### Added
- IRC service provider
- Matrix service provider
### Fixed
- Handling of requests without URI

## [0.10.5] - 2021-03-02
### Fixed
- Logic error

## [0.10.4] - 2021-03-02
### Changed
- Add Twitter proxy verification

## [0.10.3] - 2021-03-02
### Changed
- Remove twitter dependency

## [0.10.2] - 2021-03-01
### Changed
- Make Twitter verification configurable

## [0.10.1] - 2021-01-26
### Fixed
- Polyfill for promise.allSettled

## [0.10.0] - 2021-01-13
### Added
- Owncast service provider

## [0.9.4] - 2021-01-10
### Fixed
- Fix typo in keyserver url

## [0.9.3] - 2021-01-10
### Fixed
- Fix regex skipping some claims

## [0.9.2] - 2021-01-09
### Fixed
- Network errors blocking code execution

## [0.9.1] - 2021-01-09
### Changed
- Use signature data to find key location

## [0.9.0] - 2021-01-07
### Added
- Signature claims verification

## [0.8.5] - 2021-01-03
### Fixed
- Remove trailing slash from HKP server URL

## [0.8.4] - 2021-01-02
### Fixed
- Fetch Twitter proofs from Nitter

## [0.8.3] - 2020-12-26
### Fixed
- Handling of users without userId

## [0.8.2] - 2020-12-26
### Fixed
- Handling of users without selfCertifications

## [0.8.1] - 2020-12-20
### Fixed
- Timeout for claim verification promises

## [0.8.0] - 2020-12-11
### Added
- Add fallback proxy policy

### Fixed
- Handling of failed network requests
- Handling of rejected promises
- DNS proxy URL generation
- Twitter & Dev.to service provider

## [0.7.5] - 2020-12-08
### Fixed
- Browser bundling

## [0.7.4] - 2020-12-08
### Fixed
- Handling HKP URI

## [0.7.3] - 2020-12-08
### Fixed
- Bundled library for release

## [0.7.2] - 2020-12-08
### Fixed
- Support for specifying keyservers

## [0.7.1] - 2020-12-08
### Changed
- Update openpgpjs dependency

## [0.7.0] - 2020-12-05
### Changed
- Properly reject promises

## [0.6.0] - 2020-11-20
### Changed
- Handle multiple users in key

## [0.5.2] - 2020-11-20
### Fixed
- Claim verification regex

## [0.5.1] - 2020-11-20
### Fixed
- Link to bundled openpgp

## [0.5.0] - 2020-11-18
### Added
- Keys fetching using openpgp.js
- Claims extraction from keys using openpgp.js

### Changed
- Support xmpp via doip-proxy
- Module structure
- Docs

### Fixed
- Bad verification value return for text proofs
- Missing User-Agent request header

## [0.4.2] - 2020-11-06
### Changed
- URLs in package.json

## [0.4.1] - 2020-11-06
### Changed
- Update README
- Add image to coverpage

## [0.4.0] - 2020-11-06
### Added
- Custom request handler for DNS service provider
- Docs

### Changed
- Service provider data structure
- More consistent handling of options

### Removed
- dotenv dependency

### Fixed
- Crash for unexpected JSON data structure
- Body in http requests

## [0.3.0] - 2020-11-04
### Added
- Liberapay service provider
- Proxy request handler

### Changed
- Improve handling of arrays in JSON
- Customizable proxy hostname

### Fixed
- Dots in URL regex

## [0.2.0] - 2020-11-03
Initial release
