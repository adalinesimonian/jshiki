![j式 — jshiki](assets/logo/jshiki-readme-banner.svg)

<h2 align="center">Safe and Easy Expression Evaluation for Node.js</h2>

<p align="center">
  <a href="https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml"><img alt="Build Status" src="https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml/badge.svg?branch=main" /></a>
  <a href="https://app.codecov.io/gh/adalinesimonian/jshiki"><img alt="Codecov Coverage Status" src="https://codecov.io/gh/adalinesimonian/jshiki/branch/main/graph/badge.svg?token=SrIwZvl2YA" /></a>
  <a href="https://www.npmjs.com/package/jshiki"><img alt="npm Version" src="https://img.shields.io/npm/v/jshiki.svg" /></a>
</p>

<p align="center">
  <strong><a href="https://jshiki.io/latest/user-guide/">Documentation</a></strong> |
  <strong><a href="https://github.com/adalinesimonian/jshiki/blob/main/CHANGELOG.md">Change Log</a></strong>
</p>

---

jshiki provides a safe and easy way to evaluate expressions without worrying about external data being overwritten or accessed in unexpected ways. jshiki only has one lightweight dependency, [acorn], which it uses to parse expressions.

> **IMPORTANT!** jshiki is not a true sandbox. If you need to be able to evaluate arbitrary code of unknown origin, you may want to consider using [vm2] or a similar library.

### Basic Usage

```js
const jshiki = require('jshiki')

let result = jshiki.evaluate('(5 + 7) / 3') // result => 4
// or
let expression = jshiki.parse('(5 + 7) / 3')
result = expression() // result => 4
```

### Accessing data

```js
const code = "`Hello! My name's ${name.trim()}`"

expression = jshiki.parse(code)
result = expression({ name: ' Azumi ' })
// result => "Hello! My name's Azumi"

// or
result = jshiki.evaluate(code, {
  scope: { name: ' Azumi ' },
})
// result => "Hello! My name's Azumi"
```

### Asynchronous evaluation

```js
const asyncCode = "`I'm ${await status()}...`"

expression = jshiki.parseAsync(asyncCode)
result = await expression({
  status: async () => 'waiting',
})
// result => "I'm waiting..."

// or
result = await jshiki.evaluateAsync(asyncCode, {
  scope: { status: async () => 'waiting' },
})
// result => "I'm waiting..."
```

For more examples, features, and information on how to use jshiki, see the [documentation].

## Discussion

Discuss jshiki on [GitHub discussions]. Make sure to follow the [code of conduct].

## Contributing

If you're looking for a way to contribute to jshiki, see the [contribution guide].

## Licence

[MIT](LICENCE)

[acorn]: https://github.com/acornjs/acorn
[vm2]: https://github.com/patriksimek/vm2
[documentation]: https://jshiki.io/latest/user-guide/
[github discussions]: https://github.com/adalinesimonian/jshiki/discussions
[code of conduct]: CODE_OF_CONDUCT.md
[contribution guide]: CONTRIBUTING.md
