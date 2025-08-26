# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [4.1.0](https://github.com/uttori/uttori-search-provider-lunr/compare/v4.0.0...v4.1.0) - 2025-08-25

- 🎁 Update dependencies
- 🎁 Update dev dependencies
- 🛠 Update ESLint configuration
- 🛠 Update Node to v24
- 🛠 Update hooks to pass in context

## [4.0.0](https://github.com/uttori/uttori-search-provider-lunr/compare/v3.3.5...v4.0.0) - 2023-12-26

- 💥 BREAKING CHANGES!
- 💥 Rename config key: `ignore_slugs` to `ignoreSlugs`
- 💥 Add required config for `lunr_locales` of `lunrLocaleFunctions` to be an array of lunr locale functions rather than strings
- 🎁 Convert to be a module, and require Node v20
- 🎁 Update dependencies
- 🎁 Update dev dependencies
- 🛠 Update ESLint configuration
- 🛠 Update Node to v20.10.0
- 🛠 Update old tooling configuration files
- 🛠 Remove CJS support, restructure to export ESM only

## [3.3.5](https://github.com/uttori/uttori-search-provider-lunr/compare/v3.3.4...v3.3.5) - 2021-02-28

- 🎁 Update dependencies
- 🛠 Fixed JSDoc types on some unused parameters

## [3.3.4](https://github.com/uttori/uttori-search-provider-lunr/compare/v3.3.3...v3.3.4) - 2020-11-15

- 🧰 Make `debug` an optional dependency
- 🧰 Remove `ramda` as a dependency

## [3.3.3](https://github.com/uttori/uttori-search-provider-lunr/compare/v3.3.2...v3.3.3) - 2020-11-15

- 🎁 Update dev dependencies
- 🎁 Update README badge URLs
- 🧰 Change how types are made and rebuild types
- 🧰 Created this file
- 🛠 Fixed JSDoc types on some unused parameters
