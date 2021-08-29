jshiki lets you limit what syntax is allowed in expressions by letting you:

- Disallow certain operators
- Disallow certain literals and expressions

## Disallowing operators

jshiki lets you block specific unary operators, binary operators, logical operators, and the ternary/conditional operator.

For each type of operator aside from the ternay operator, you can either use an allow list, which will only allow the operators you specify, or a block list, which will block all operators you specify.

Here's an example in which we block the use of the binary `+` operator (not to be confused with the unary `+` operator, e.g. `:::js +1`):

```js
// throws Error: Binary operator + is not allowed
jshiki.parse('1 + 2', {
  operators: {
    // blocks the binary + operator
    binary: { block: ['+'] },
  }
})
```

If instead we were to opt for an allow list, we could specify only the operators we want to allow. Here's an example in which we allow only the logical operators `&&` and `||`:

```js
const options = {
  operators: {
    // allows only the logical operators && and ||
    logical: { allow: ['&&', '||'] },
  }
}

jshiki.evaluate('1 && 2 || 3', options) // returns 2

// throws Error: Logical operator ?? is not allowed
jshiki.evaluate('null ?? 1', options)
```

The conditional operator takes a boolean instead since it is the only ternary operator in Javascript — `true` allows it, `false` blocks it.

```js
// throws Error: Conditional/ternary operator is not allowed
jshiki.parse('1 ? 2 : 3', {
  operators: {
    // blocks the ternary/conditional operator
    ternary: false,
  }
})
```

In full, the operators options object is as follows:

- `:::js operators.unary` — Unary operators (e.g. `:::js !true`, `:::js -1`)
- `:::js operators.binary` — Binary operators (e.g. `:::js 1 + 2`, `:::js 1 !== 2`)
- `:::js operators.logical` — Logical operators (e.g. `:::js true && false`, `:::js null ?? 1`)
- `:::js operators.ternary` — Ternary/conditional operator (e.g. `:::js a === b ? 2 : 3`)

All supported operators are allowed by default. For an exhaustive list, see the [API docs].

## Disallowing syntax

You can also block specific syntax by setting the corresponding `syntax` option to `false`. For example, you might want to disallow the use of function calls:

```js
// throws Error: Function calls are not allowed
jshiki.parse('foo()', {
  syntax: {
    // blocks the use of function calls
    calls: false,
  }
})
```

In full, the syntax options object is as follows:

- `:::js syntax.memberAccess` — Member access (e.g. `:::js foo.bar`, `:::js foo['bar']`)
- `:::js syntax.calls` — Function calls (e.g. `:::js foo()`)
- `:::js syntax.taggedTemplates` — Tagged template literals (e.g. ``:::js tag`foo ${bar}` ``)
- `:::js syntax.templates` — Template literals (e.g. ``:::js `foo ${bar}` ``)
- `:::js syntax.objects` — Object literals (e.g. `:::js { foo: 1 }`)
- `:::js syntax.arrays` — Array literals (e.g. `:::js [1, 2, 3]`)
- `:::js syntax.regexes` — Regular expressions (e.g. `:::js /foo/g`)

---

Next, we'll examine another way jshiki lets you limit what expressions can do — rules.

[API docs]: ../api/interfaces/OperatorOptions.html
