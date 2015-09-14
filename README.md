## jshiki

[![Build Status](https://travis-ci.org/vsimonian/jshiki.svg?branch=master)](
https://travis-ci.org/vsimonian/jshiki)

Lightweight expression parsing and execution library for Node.js

## Basic Usage

```bash
$ npm install --save jshiki
```

```javascript
var jshiki = require('jshiki')

var expression = jshiki.parse('5 + (12 / 3)')
var result = expression.eval() // 9

expression = jshiki.parse('" Hello! ".trim() + " My name\'s " + name', {
  scope: {
    name: 'Azumi'
  }
})
result = expression.eval() // "Hello! My name's Azumi"
```

## Why

[Polymer Expressions][polymer-expressions] are great, but there were times when
I needed similar functionality but in the backend instead of in the browser.

jshiki provides similar expression handling, but made for use in Node.

## Details

jshiki supports:

- Numeric literals
- String literals
- Array literals
- Object literals
- Function calls
- Member access

jshiki lets you pass in a predefined scope object, because expressions do not
have access to globals. For example:

```javascript
expression = jshiki.parse('func(1234)', {
  scope: {
    func: function (num) {
      var comparison = num > 1000 ?
      'greater than' :
      (num === 1000 ?
        'equal to' :
        'smaller than'
      )
      return num + ' is ' + comparison + ' 1000'
    }
  }
})
result = expression.eval() // "1234 is greater than 1000"
```

jshiki does not interpret assignment, which keeps expressions from overwriting
outside data. For example:

```javascript
expression = jshiki.parse('property.key = "Haha, I overwrote your stuff!"', {
  scope: {
    property: {
      key: "value"
    }
  }
})
result = expression.eval() // throws Error: Unexpected token =
```

## License

MIT.

Portions of the code were adapted from the [Polymer Expressions]
[polymer-expressions] and [esprima][esprima] libraries, which both have their
own 3-clause BSD licenses. Copies are provided in the `lib` directory.

[polymer-expressions]: https://github.com/Polymer/polymer-expressions
[esprima]: https://github.com/jquery/esprima
