# Change Log

## [v2.1.0](https://github.com/adalinesimonian/jshiki/tree/v2.1.0) (2021-08-17)

### Additions

- New options `rules` and `explicitAllow`, which facilitate rules-based access control for scope members. Documentation available [in the README](#README.md#rules).
- Documentation added to API.

### Development changes

- More robust, less hacky evaluation of expressions internally.
- AST information retained on expressions.

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v2.0.0...v2.1.0)

## [v2.0.0](https://github.com/adalinesimonian/jshiki/tree/v2.0.0) (2021-08-12)

### BREAKING CHANGES

- `parse()` now returns the expression function instead of an object
- Polymer Expressions holdovers (filters, as/in expressions) removed
- Errors thrown when parsing invalid expressions are now thrown when parsing instead of during evaluation

### Additions

- `evaluate()`, which executes an expression immediately, added to API

### Fixes

- Tests for the `<<` bitwise left shift and `>>` bitwise right shift operators fixed; prior, the tests mistakenly used `<` and `>` instead of `<<` and `>>`

### Development changes

- Rewritten in [TypeScript][typescript]
- Switched to [jest][jest] for testing
- Switched CI to [Github Actions][github-actions]

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v1.1.1...v2.0.0)

## [v1.1.1](https://github.com/adalinesimonian/jshiki/tree/v1.1.1) (2021-05-19)

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v1.1.0...v1.1.1)

## [v1.1.0](https://github.com/adalinesimonian/jshiki/tree/v1.1.0) (2017-07-03)

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v1.0.0...v1.1.0)

**Implemented enhancements:**

- Added exponential and bitwise operators. [\#1](https://github.com/adalinesimonian/jshiki/pull/1) ([emorris00](https://github.com/emorris00))

## [v1.0.0](https://github.com/adalinesimonian/jshiki/tree/v1.0.0) (2017-06-29)

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v0.0.3...v1.0.0)

## [v0.0.3](https://github.com/adalinesimonian/jshiki/tree/v0.0.3) (2015-09-14)

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v0.0.2...v0.0.3)

## [v0.0.2](https://github.com/adalinesimonian/jshiki/tree/v0.0.2) (2015-09-07)

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v0.0.1...v0.0.2)

## [v0.0.1](https://github.com/adalinesimonian/jshiki/tree/v0.0.1) (2015-09-07)

[jest]: https://jestjs.io
[typescript]: https://www.typescriptlang.org
[github-actions]: https://github.com/features/actions
