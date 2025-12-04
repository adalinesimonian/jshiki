jshiki provides a safe and easy way to evaluate expressions. jshiki only has one lightweight dependency, [acorn], which it uses parse expressions.

Getting started with jshiki is easy. First, install jshiki using your package manager of choice:

=== "Yarn"
    ```sh
    yarn add jshiki
    ```

=== "npm"
    ```sh
    npm install jshiki
    ```

=== "pnpm"
    ```sh
    pnpm add jshiki
    ```

Then, get going! jshiki's API is simple:

- The **`:::js parse()`** function takes an expression and returns a function that evaluates that expression.

    ```js
    import * as jshiki from 'jshiki'

    const expression = jshiki.parse('(5 + 7) / 3')
    const result = expression()
    // result => 4
    ```

- The **`:::js evaluate()`** function takes an expression and returns the result of evaluating that expression.

    ```js
    import * as jshiki from 'jshiki'

    const result = jshiki.evaluate('(5 + 7) / 3')
    // result => 4
    ```

You can use asynchronous expressions, too!

- The **`:::js parseAsync()`** function creates an asynchronous expression.

    ```js
    import * as jshiki from 'jshiki'

    const expression = jshiki.parseAsync('(await b() + 7) / 3')
    const result = await expression({ b: async () => 5 })
    // result => 4
    ```

- The **`:::js evaluateAsync()`** function evaluates an asynchronous expression.

    ```js
    import * as jshiki from 'jshiki'

    const result = await jshiki.evaluateAsync('(await b() + 7) / 3', {
      scope: { b: async () => 5 }
    })
    // result => 4
    ```

> Take a look at the [type definitions] to see the function signatures.

You can use all of the below in expressions:

- Booleans
- `undefined`, `null`
- Numeric literals (including BigInts, `NaN`, and `Infinity`)
- String literals (including template strings)
- Regex literals (`:::js /foo/g`)
- Array literals (including sparse arrays)
- Object literals (`:::js { prop: 'value' }`)
- Function calls (`:::js func()`)
- Member access (`:::js obj.prop`)
- Optional chaining (`:::js obj?.prop?.()`)
- Nullish coalescing (`:::js obj ?? 'default'`)

---

Next, we'll look at how to let expressions access data not contained in the expression itself.

[acorn]: https://github.com/acornjs/acorn
[type definitions]: ../api/#evaluate
