![j式 — jshiki](assets/logo/jshiki-readme-banner.svg)

<h2 align="center">Safe and Easy Expression Evaluation for Node.js</h2>

<p align="center">
  <a href="https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml"><img alt="Build Status" src="https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml/badge.svg?branch=main" /></a>
  <a href="https://app.codecov.io/gh/adalinesimonian/jshiki"><img alt="Codecov Coverage Status" src="https://codecov.io/gh/adalinesimonian/jshiki/branch/main/graph/badge.svg?token=SrIwZvl2YA" /></a>
  <a href="https://www.npmjs.com/package/jshiki"><img alt="npm Version" src="https://img.shields.io/npm/v/jshiki.svg" /></a>
</p>

<p align="center">
  <strong><a href="https://adalinesimonian.github.io/jshiki/latest/user-guide/">Documentation</a></strong>
</p>

---

jshiki provides a safe and simple way to evaluate expressions without worrying about external data being overwritten or accessed in unexpected ways. jshiki only has one lightweight dependency, [acorn], which it uses parse expressions.

```js
const jshiki = require('jshiki')

// Basic usage

let result = jshiki.evaluate('(5 + 7) / 3') // result => 4
// or
let expression = jshiki.parse('(5 + 7) / 3')
result = expression() // result => 4

// Accessing data

const expressionSource = "`Hello! My name's ${name.trim()}`"

expression = jshiki.parse(expressionSource)
result = expression({ name: ' Azumi ' })
// result => "Hello! My name's Azumi"

// or
result = jshiki.evaluate(expressionSource, {
  scope: { name: ' Azumi ' },
})
// result => "Hello! My name's Azumi"
```

For more examples, features, and information on how to use jshiki, see the [documentation].

## Licence

[MIT](LICENCE)

[acorn]: https://github.com/acornjs/acorn
[documentation]: https://adalinesimonian.github.io/jshiki/latest/user-guide/
