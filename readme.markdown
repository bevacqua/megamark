# megamark

> [marked][1] with easy tokenization, a fast highlighter, and a lean HTML sanitizer

Megamark is [marked][1] plus a few reasonable factory defaults.

- Markdown parsing via [marked][1]
- HTML is sanitized via [insane][2], and _that's configurable_
- Code is highlighted with [highlight.js][3] _(on a [diet in the client-side][4]!)_
- Tokenization made easy: **turn those `@` mentions into links in no-time!**
- Still manages to produce a small footprint

# Install

```shell
npm install megamark --save
```

# `megamark(markdown, options?)`

The `markdown` input will be parsed via `marked`. Megamark configures `marked` for syntax highlighting, prefixing classes with `md-`. Output is sanitized via [insane][2], and you can configure the whitelisting process too.

### `options.tokenizers`

Tokenizers can help you transform bits of text like `@bevacqua` into links. This is often a very useful feature for your users, but hardly ever implemented by developers because how convoluted it is. With `megamark`, it becomes a pretty easy thing to do.

```js
megamark('Who is this @bevacqua person?', {
  tokenizers: [{
    token: /(?:^|\s)@([A-z]+)\b/,
    transform: function (all, username) {
      return '<a href="/' + username + '">' + all + '</a>';
    }
  }]
});
// <- '<p>Who is this <a href='/bevacqua'>@bevacqua</a> person?</p>\n'
```

The `transform` method will get all of the arguments of `text.match(token)`, so the first argument will be `text`, followed by any captured groups. In our case, the `/(?:^|\s)@([A-z]+)\b/` can be decomposed as follows.

- First off we have `(?:^|\s)`
  - The parenthesis delimit a group
  - The `?:` syntax means this is a non-capturing group, and it won't be passed to `transform`
  - `^|\s` means that we are looking to match either the start of input or a space character
  - We can't use `\b` instead of this expression because `@` is not a word character
- Then there's the `@` literal
- Another group, `([A-z]+)`
  - This time it's a capturing group, meaning it'll be passed to transform as the second argument
  - Matches one or more alphabet characters
- Finally, `\b` means that we want to match everything up to a word boundary

You can use any regular expression you want, but avoid the `g` modifier. You can opt to encode the output of `transform` by setting `encode: true` on the tokenizer, like below.

```js
{
  tokenizers: [{
    token: /a/,
    encode: true,
    transform: function (all) {
      return '>>b<<';
    }
  }]
}
```

### `options.sanitizer`

These configuration options will be passed to [insane][2]. The defaults from [insane][2] are used by default.

# License

MIT

[1]: https://github.com/chjj/marked
[2]: https://github.com/bevacqua/insane
[3]: https://github.com/isagalaev/highlight.js
[4]: https://github.com/bevacqua/highlight-redux
