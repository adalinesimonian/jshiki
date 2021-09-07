# Rules

> **IMPORTANT!** Do not rely on rules for data security! You should never expose sensitive data to expressions that you do not have complete control over. See the [security] section of the user guide for good habits to follow to keep your data safe.

jshiki supports defining rules that determine whether or not a property on the [scope object] is accessible to an expression. Rules are defined as an array of objects, where each object has a `allow` or `block` property that represents a path to a property. Any property to which access is blocked will return `undefined` when evaluated.

> Take a look at the [type definitions] for a more technical explanation.

For example, the following rules will allow access to `:::js user.name` and `:::js user.postalCode`, but will block access to `:::js user.groups`:

```js
const options = {
  rules: [
    { allow: 'user.name' },
    { allow: ['user', 'postalCode'] },
    { block: 'user.groups' },
  ],
}
```

> **IMPORTANT!** Rules will not apply to any properties of values that aren't objects or functions. This behaviour is a result of jshiki's rules implementation using [proxies] under the hood — proxies can only be created for objects or functions.
>
> ```js
> const options = {
>   rules: [{ block: 'length' }],
>   scope: 'str',
> }
> const result = jshiki.evaluate('length', options)
> // result => 3
> ```

## Requiring Explicit Allowing of Access

By default, jshiki will allow access to all properties of the scope object unless a block rule applies. However, you can instead require that an allow rule matches the property before allowing the expression to access it by setting the `explicitAllow` option to `true`.

```js
const options = {
  explicitAllow: true,
  rules: [{ allow: 'user.name' }],
}
// allows access to user and user.name
// does not allow access to user.groups or any other property
```

Requiring allow rules is safer since it prevents access to any property you may not have accounted for, such as in the case that:

- You're unaware of all the properties on an object
- A new property is added to the object after you've written your code
- The properties on the object vary at runtime

However, in certain circumstances, this approach may be more restrictive than necessary. Use your best judgment and think about the tradeoffs. Some things to consider:

- Are you using a library that exposes properties on an object that you don't know about?
- Are any of the entities in the scope mutable?
- Do any of the objects in the scope have properties that vary at runtime?

## Wildcards

The `*` wildcard matches any property. For example, the following rule allows access to any property `length` on any member of `user`. Implicitly, the rule also allows access to any member of `user` since you must be able to access `user` to access its `length` property.

```js
const rules = [{ allow: 'user.*.length' }]
// allows user.name.length, user.groups.length, etc.
// also allows user.name, user.createdAt, etc.
```

You can also use `**` to match any property at any depth. For example, the following rule will block access to any member named `splice` regardless of what object or property it is on:

```js
const rules = [{ block: '**.splice' }]
// blocks user.groups.splice, searchResults.splice, etc.
```

If you need to refer to a property named `*` or `**`, you can use `:::js '\\*'` or `:::js '\\**'`.

```js
const rules = [{ block: 'user.\\*' }]
// blocks user['*']
const rules = [{ block: ['user', '\\**'] }]
// blocks user['**']
```

## Precedence

jshiki evaluates rules in the order in which they are defined — each rule overrides any previously defined rules.

In the following example, the rule blocking access to `:::js user.groups` will override the rule allowing access to any property of `user`. The result is that all properties of `user` will be allowed access, except for `user.groups`.

```js
const rules = [{ allow: 'user.*' }, { block: 'user.groups' }]
// allows access to user.name, user.createdAt, etc., but not user.groups
```

If we were to define the rules in the opposite order, the `:::js user.*` rule would override the `:::js user.groups` rule. This would result in the expression being allowed access to all properties of `user`, including `user.groups`.

```js
const rules = [{ block: 'user.groups' }, { allow: 'user.*' }]
// allows access to user.name, user.createdAt, etc., including user.groups
```

---

In the following section, we'll discuss how to practice good data security when using jshiki.

[security]: security.md
[scope object]: accessing-data.md
[type definitions]: ../../api/#AccessPath
[proxies]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
