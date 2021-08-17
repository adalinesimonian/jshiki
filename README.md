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

## Overview

jshiki provides a safe and simple way to evaluate expressions, without worrying about external data being overwritten or accessed in unexpected ways. Additionally, jshiki does not have any dependencies, and only includes a highly stripped-down version of [esprima][esprima] that only supports a subset of JS.

jshiki supports:

- Numeric literals
- String literals
- Array literals
- Object literals
- Function calls
- Member access

## Limited access to external data

jshiki allows providing expressions access to variables by providing a `scope` object, where each property acts as a global variable available to the expression For example:

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

jshiki also lets you define rules which determine whether or not a particular variable is accessible to an expression. You can configure jshiki to require an explicit `allow` rule to exist before allowing access, or you can opt to allow access to all variables unless a `block` rule applies, the latter being the default.

> _(See the [rules section](#rules) for more information)_

For example:

```js
const user = {
  name: 'Azumi',
  postalCode: 'A1A1A1',
  passwordHash: '$2a$10$/x.x.x.x.x.x.x.x.x.x.x.x.x.x.x',
}

let options = {
  scope: { user },
  explicitAllow: true,
  rules: [{ allow: 'user.name' }, { allow: ['user', 'postalCode'] }],
}

result = jshiki.evaluate('user.name', options)
// result => 'Azumi'
result = jshiki.evaluate('user.passwordHash', options)
// result => undefined

options = {
  scope: { user },
  rules: [{ block: 'user.passwordHash' }],
}

result = jshiki.evaluate('user.name', options)
// result => 'Azumi'
result = jshiki.evaluate('user.passwordHash', options)
// result => undefined
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

For this reason, if you do not want data to be mutated, don't expose any functions in the scope that can mutate data or use [rules](#rules) to block access to those functions. If you must, then make sure that whatever objects you expose in the scope are immutable or copies.

## Rules

jshiki supports defining rules that determine whether or not a variable is accessible to an expression. Rules are defined as an array of objects, where each object has a `allow` or `block` property that represents a path to a variable. Any property to which access is blocked will return `undefined` when evaluated.

For example, the following rules will allow access to `user.name` and `user.postalCode`, but will block access to `user.passwordHash`:

```js
const rules = [
  { allow: 'user.name' },
  { allow: ['user', 'postalCode'] },
  { block: 'user.passwordHash' },
]
```

### Explicit allow

By default, jshiki will allow access to all variables unless a `block` rule applies. However, you can opt into requiring the explicit allowing of access to variables by setting the `explicitAllow` option to `true`.

```js
const options = {
  scope: { user },
  explicitAllow: true,
  rules: [{ allow: 'user.name' }],
}
// allows access to user and user.name
// does not allow access to user.passwordHash or any other property
```

### Wildcards

Wildcards can be used to match any part of a path. For example, the following rule will allow access to any property `length` on any member of `user`. Implicitly, the rule will also allow access to any member of `user` since that access would be required to access the `length` property.

```js
const rules = [{ allow: 'user.*.length' }]
// allows user.name.length, user.groups.length, etc.
// also allows user.name, user.createdAt, etc.
```

You can also use `**` to match any part of a path to any depth. For example, the following rule will block access to any member named `splice`, regardless of what object or property it is on:

```js
const rules = [{ block: '**.splice' }]
// blocks user.groups.splice, searchResults.splice, etc.
```

If you need to refer to a property named `*` or `**`, you can use `\\*` or `\\**`.

```js
const rules = [{ block: 'user.\\*' }]
// blocks user['*']
```

### Precedence

Rules are evaluated in the order they are defined, so the following rules will allow access to any property of `user` except `passwordHash`:

```js
const rules = [{ allow: 'user.*' }, { block: 'user.passwordHash' }]
```

## Licence

MIT.

Portions of the code were adapted from the [Polymer Expressions][polymer-expressions] and [esprima][esprima] libraries, which both have their own 3-clause BSD licenses. Copies are provided in the `src/lib` directory.

[polymer-expressions]: https://github.com/Polymer/polymer-expressions
[esprima]: https://github.com/jquery/esprima
