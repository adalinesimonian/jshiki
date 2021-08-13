# j 式 | jshiki

[![Build Status](https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml/badge.svg?branch=main)](https://github.com/adalinesimonian/jshiki/actions/workflows/main-test.yml)

Lightweight expression parsing and execution library for Node.js

## Installation

```
$ yarn add jshiki
```

or

```
$ npm install jshiki
```

## Basic Usage

```js
const jshiki = require('jshiki')

let result = jshiki.evaluate('5 + (12 / 3)') // result => 9
// or
let expression = jshiki.parse('5 + (12 / 3)')
result = expression() // result => 9

const expressionText = '" Hello! ".trim() + " My name\'s " + name'
const scope = {
  name: 'Azumi',
}
result = jshiki.evaluate(expressionText, { scope })
// result => "Hello! My name's Azumi"
```

## Details

jshiki provides a safe and simple way to evaluate expressions, without worrying about external data being overwritten or accessed in unexpected ways. Additionally, jshiki does not have any dependencies, and only includes a highly stripped-down version of [esprima][esprima] that only supports a subset of JS.

jshiki supports:

- Numeric literals
- String literals
- Array literals
- Object literals
- Function calls
- Member access

jshiki lets you pass in a predefined scope object, because expressions do not have access to globals. For example:

```js
result = jshiki.evaluate('func(1234)', {
  scope: {
    func(num) {
      let comparison
      if (num > 1000) {
        comparison = 'greater than'
      } else if (num === 1000) {
        comparison = 'equal to'
      } else {
        comparison = 'less than'
      }
      return `num is ${comparison} 1000`
    },
  },
}) // result => "1234 is greater than 1000"
```

jshiki does not interpret assignment, which keeps expressions from overwriting external data. For example:

```js
result = jshiki.evaluate('property.key = "Haha, I overwrote your stuff!"', {
  scope: {
    property: {
      key: 'value',
    },
  },
}) // throws Error: Unexpected token =
```

### Caveats

While expressions can't mutate data directly by assignment, they can call functions that mutate data. For example:

```js
const arr = [1, 2, 3, 4, 5]
result = jshiki.evaluate('arr.splice(0, 1)', {
  scope: { arr },
}) // result => [1]
// arr => [2, 3, 4, 5]
```

For this reason, if you do not want data to be mutated, don't expose any functions in the scope that can mutate data. If you must, then make sure that whatever objects you expose in the scope are immutable or copies.

## Licence

MIT.

Portions of the code were adapted from the [Polymer Expressions][polymer-expressions] and [esprima][esprima] libraries, which both have their own 3-clause BSD licenses. Copies are provided in the `src/lib` directory.

[polymer-expressions]: https://github.com/Polymer/polymer-expressions
[esprima]: https://github.com/jquery/esprima
