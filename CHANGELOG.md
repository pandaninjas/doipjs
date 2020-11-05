# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Custom request handler for DNS service provider

### Changed
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
