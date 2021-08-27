> **NOTE:** Many factors can affect the security of your application. Though jshiki prevents most avenues through which expressions can gain unwanted access to or modify data, using jshiki alone does not guarantee that every expression you evaluate will be safe.
>
> This section is not an exhaustive list of all security concerns but rather a high-level overview of some of the most common problems to consider when using jshiki. The [OWASP NodeJS security cheat sheet] is a good place to start for a more in-depth look at security in Javascript applications.

jshiki is designed to be a safe and secure environment for evaluating expressions. It achieves this through methods we've discussed elsewhere in this guide, such as preventing access to any data that isn't explicitly exposed and limiting the operations that expressions can perform. However, this is not enough to contain all possible attacks.

When you pass a [scope object] to an expression, you effectively open up the sandbox in which jshiki evaluates it since the scope object is outside of the expression's context. Through this opening, it may, in theory, be possible for the expression to gain access to data that is not explicitly exposed, for several reasons, including, but not limited to:

- An oversight or a change in a third-party library, dependency, or data layer results in additional data being added to an object exposed to the expression without the consuming program's developer's knowledge.

    > Example: A change elsewhere in an application adds a new property to a set of data fetched from an API, which is then directly exposed to expressions. The developer of the consuming program does not know that someone else added the new property.
    >
    > If an expression attempts to access that data, it may gain access to the new property.

- A function or property getter/setter on an object exposed to the expression unexpectedly mutates data.

    > Example: A getter method on an object changes some internal value which determines if a block of code gets executed. The code that calls jshiki provides the expression with the object with the getter method.
    >
    > An attacker could use this behaviour to write expressions that would result in the execution of code that is not intended to be executed.

- A vulnerability in the Javascript engine allows arbitrary code execution and can be exploited with methods or properties of a particular type of object, such as an array.

    > Example: A new, undisclosed vulnerability in the V8 Javascript engine that allows arbitrary code execution can be exploited by providing specific parameters to the `:::js Array.prototype.splice` method.
    >
    > Now, suppose an array is now made available to an expression. In that case, an attacker could write an expression that would execute arbitrary code, and jshiki would evaluate it unless a rule blocked the `splice` method.

## Staying Safe

So, how do we use jshiki while avoiding common pitfalls? We can take a few steps to keep expression execution safe:

- **Limit the data you pass to expressions** to the minimal set of data required to perform the desired operation.

    Instead of passing an entire object full of data to an expression, provide only the necessary portion of the data as a separate object.

    > For example, if you want an expression to access a user's `name` and `age` properties, you can pass those properties to the expression alone instead of passing the entire object.

- **Sanitize the data you pass to expressions.**

    Even when selecting a subset of data to pass to an expression, it is possible for the values or types of the fields themselves to change to something unexpected. Make sure that the data you provide to an expression is what you expect it to be.

    > For example, if you pass a user's `created` field to an expression, but the field's value is later changed from a string to an object, it may expose different data to the expression than it did before.

- **Restrict creating expressions to only those that need to be able to do so.**

    If there is no need for a certain users to write expressions, there is no reason why they should have access to create them. The fewer people have access to creating expressions, the less likely you are to encounter an attack.

    > If, for example, you have a site that uses expressions for business rules, and you want to allow users to create expressions, you should assign the ability to edit expressions only to those users who need to edit business rules.

Even with these precautions in place, never assume that your code is safe. Any code that you run that you do not write or have direct control over carries with it the risk of an attack — even with an expression evaluator like jshiki.

[OWASP NodeJS security cheat sheet]: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
[scope object]: accessing-data.md
