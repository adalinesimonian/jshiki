# Change Log

## [v3.2.0](https://github.com/adalinesimonian/jshiki/tree/v3.2.0) (2021-08-29)

### Additions

- Specific operators can now be blocked or allow-listed:
  ```js
  // throws Error: Binary operator / is not allowed.
  jshiki.parse('a / b', {
    operators: {
      binary: { allow: ['+', '-'] },
    },
  })
  ```
- Specific syntax can now be blocked:
  ```js
  // throws Error: Function calls are not allowed.
  jshiki.parse('a()', {
    syntax: {
      calls: false,
    },
  })
  ```

### Documentation

- Fixed edit links by pointing them to the correct branch.
- Fixed codecov link in the readme.

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v3.1.0...v3.2.0)

## [v3.1.0](https://github.com/adalinesimonian/jshiki/tree/v3.1.0) (2021-08-27)

### Additions

- The following types are now exported in the package entry point:
  - `JshikiParseOptions`
  - `JshikiEvaluateOptions`
  - `JshikiExpression`
  - `AccessPath`
  - `AccessRule`
  - `AllowAccessRule`
  - `BlockAccessRule`

### Development Changes

- [Documentation] site added using [mkdocs] and [mkdocs-material].

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v3.0.0...v3.1.0)

## [v3.0.0](https://github.com/adalinesimonian/jshiki/tree/v3.0.0) (2021-08-20)

### BREAKING CHANGES

- `parse()` now returns an expression that expects the scope to be passed as an argument. This allows reusing the same expression in different contexts without having to parse the expression or rules again. For example:
  ```js
  const expression = jshiki.parse('`Hello ${name}!`')
  const result = expression({ name: 'Azumi' })
  // result => 'Hello Azumi!'
  ```
- ES2020 syntax is now supported, and support for Node 12.x has been dropped.
- `NaN` and `Infinity` identifiers are now supported.
- Unicode escape sequences `\x` and `\u` are now supported.
- The bundled, custom version of [esprima][esprima] has been entirely removed and replaced with an external dependency on [acorn][acorn], a fast, lightweight Javascript parser. The corresponding licences for [Polymer Expressions][polymer-expressions] and [esprima][esprima] have been removed from the project as the code to which they pertain is no longer part of the project.

### Fixes

- Fixed a bug where holes in sparse arrays were being evaluated as `null`.
- Fixed a bug where `undefined` could evaluate to a value other than `undefined` if a property named `undefined` was defined on the scope object.
- Fixed a bug where calling a function returned by a function would not evaluate and instead return the function.
- Fixed a bug where computed property accessors were not being evaluated (`obj[prop]` was being evaluated as `obj['prop']` instead of `obj[prop]`).
- Fixed a bug where a function member of a scope object that returned `this` would result in a `TypeError` being thrown.
- Fixed a bug where a function member of a scope object could not access properties on `this`.
- Fixed a bug where logical operators (`&&`, `||`) would evaluate both operands before evaluating the result.

### Development changes

- Test coverage is now 100%.
- Node 12.x has been dropped from the test matrix.

[Full Changelog](https://github.com/adalinesimonian/jshiki/compare/v2.1.0...v3.0.0)

## [v2.1.0](https://github.com/adalinesimonian/jshiki/tree/v2.1.0) (2021-08-17)

### Additions

- New options `rules` and `explicitAllow`, which facilitate rules-based access control for scope members. Documentation available [in the README](README.md#rules).
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
[acorn]: https://github.com/acornjs/acorn
[polymer-expressions]: https://github.com/googlearchive/polymer-expressions
[esprima]: https://github.com/jquery/esprima
[mkdocs]: https://www.mkdocs.org/
[mkdocs-material]: https://squidfunk.github.io/mkdocs-material/
[documentation]: https://jshiki.io/
