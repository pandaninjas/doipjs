# Changelog

## [0.8.4]

[2021-01-02](https://codeberg.org/keyoxide/doipjs/releases/tag/0.8.4)

### Fixed
- Fetch Twitter proofs from Nitter

## [0.8.3]

[2020-12-26](https://codeberg.org/keyoxide/doipjs/releases/tag/0.8.3)

### Fixed
- Handling of users without userId

## [0.8.2]

[2020-12-26](https://codeberg.org/keyoxide/doipjs/releases/tag/0.8.2)

### Fixed
- Handling of users without selfCertifications

## [0.8.1]

[2020-12-20](https://codeberg.org/keyoxide/doipjs/releases/tag/0.8.1)

### Fixed
- Timeout for claim verification promises

## [0.8.0]

[2020-12-11](https://codeberg.org/keyoxide/doipjs/releases/tag/0.8.0)

### Added
- Add fallback proxy policy

### Fixed
- Handling of failed network requests
- Handling of rejected promises
- DNS proxy URL generation
- Twitter & Dev.to service provider

## [0.7.5]

[2020-12-10](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.5)

### Fixed
- Browser bundling

## [0.7.4]

[2020-12-08](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.4)

### Fixed
- Handling HKP URI

## [0.7.3]

[2020-12-08](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.3)

### Fixed
- Bundled library for release

## [0.7.2]

[2020-12-08](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.2)

### Fixed
- Support for specifying keyservers

## [0.7.1]

[2020-12-08](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.1)

### Changed
- Update openpgpjs dependency

## [0.7.0]

[2020-12-05](https://codeberg.org/keyoxide/doipjs/releases/tag/0.7.0)

### Changed
- Properly reject promises

## [0.6.0]

[2020-11-20](https://codeberg.org/keyoxide/doipjs/releases/tag/0.6.0)

### Changed
- Handle multiple users in key

## 0.5.2

[2020-11-20](https://codeberg.org/keyoxide/doipjs/releases/tag/0.5.2)

### Fixed

- Claim verification regex

## 0.5.1

[2020-11-20](https://codeberg.org/keyoxide/doipjs/releases/tag/0.5.1)

### Fixed
- Link to bundled openpgp

## 0.5.0

[2020-11-18](https://codeberg.org/keyoxide/doipjs/releases/tag/0.5.0)

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

## 0.4.2

[2020-11-06](https://codeberg.org/keyoxide/doipjs/releases/tag/0.4.2)

### Changed

- URLs in package.json

## 0.4.1

[2020-11-06](https://codeberg.org/keyoxide/doipjs/releases/tag/0.4.1)

### Changed

- Update README
- Add image to coverpage

## 0.4.0

[2020-11-06](https://codeberg.org/keyoxide/doipjs/releases/tag/0.4.0)

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

## 0.3.0

[2020-11-04](https://codeberg.org/keyoxide/doipjs/releases/tag/0.3.0)

### Added

- Liberapay service provider
- Proxy request handler

### Changed

- Improve handling of arrays in JSON
- Customizable proxy hostname

### Fixed

- Dots in URL regex

## 0.2.0

[2020-11-03](https://codeberg.org/keyoxide/doipjs/releases/tag/0.2.0)

Initial release
