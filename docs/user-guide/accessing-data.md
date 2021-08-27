You can pass expressions an object, the properties of which jshiki will treat as globals in the expression's context. In jshiki, this object is referred to as the **scope**.

```js
const expression = jshiki.parse("`Hello! My name's ${name.trim()}`")
const result = expression({ name: ' Azumi ' })
// result => "Hello! My name's Azumi"
```

If using `:::js evaluate()`, you can pass the scope object as the value of the `scope` property on the options object:

```js
const result = jshiki.evaluate("`Hello! My name's ${name.trim()}`", {
  scope: { name: ' Azumi ' },
})
// result => "Hello! My name's Azumi"
```

Expressions cannot access any variables other than those in the scope object. They also cannot use assignment statements.

```js
global.baz = 'qux'
let foo = 'bar'

jshiki.evaluate('foo')
// returns undefined

jshiki.parse('baz = "quux"')
// throws Error: Unsupported node type: AssignmentExpression
```

## Preventing Data Manipulation

While jshiki prevents expressions from using assignment statements, it does not prevent them from changing data using functions. For example, arrays have a `:::js splice()` method that removes an element from the array. An expression could call this method and mutate the array:

```js
const array = [1, 2, 3]

jshiki.evaluate('array.splice(1, 1)', { scope: { array } })
// returns [2]
// array => [1, 3]
```

There are several good practices to safeguard your data from manipulation by expressions:

-   Only pass objects to jshiki that don't have methods that can change data.
-   If you are passing an object that contains such a method:

    -   Make a copy of the object so that the original is unchanged if the expression calls the method in question.

        ```js
        const array = [1, 2, 3]

        jshiki.evaluate('array.splice(1, 1)', {
          scope: { array: array.slice() },
        })
        // returns [2]
        // array => [1, 2, 3]
        ```

    -   Use [rules] to prevent expressions from accessing methods you don't want them to access.

        ```js
        const array = [1, 2, 3]

        jshiki.evaluate('array.splice(1, 1)', {
          scope: { array },
          // requires a matching allow rule before allowing access
          explicitAllow: true,
          // allows access to `array`, but not to any properties of `array`
          rules: [{ allow: 'array' }],
        })
        // throws TypeError: evaluatedObject[property(...)] is not a function

        // or

        jshiki.evaluate('array.splice(1, 1)', {
          scope: { array },
          // blocks access to any property named `splice` on any object
          rules: [{ block: '**.splice' }],
        })
        // throws TypeError: evaluatedObject[property(...)] is not a function
        ```

We'll cover rules in more detail in the following section.

[rules]: rules.md
