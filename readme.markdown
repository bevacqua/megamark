# megamark

> [markdown-it][1] with easy tokenization, a fast highlighter, and a lean HTML sanitizer

Megamark is [markdown-it][1] plus a few reasonable factory defaults.

- Markdown parsing via [markdown-it][1]
- HTML is sanitized via [insane][2], and _that's configurable_
- Code is highlighted with [highlight.js][3] _(on a [diet in the client-side][4]!)_
- Tokenization made easy: **turn those `@` mentions into links in no-time!**
- Still manages to produce a small footprint

# Install

```shell
npm install megamark --save
```

# `megamark(markdown, options?)`

The `markdown` input will be parsed via `markdown-it`. Megamark configures `markdown-it` for syntax highlighting, prefixing classes with `md-`. Output is sanitized via [insane][2], and you can configure the whitelisting process too.

### `options.tokenizers`

Tokenizers can help you transform bits of text like `@bevacqua` into links. This is often a very useful feature for your users, but hardly ever implemented by developers because how convoluted it is. With `megamark`, it becomes a pretty easy thing to do.

```js
megamark('Who is this @bevacqua person?', {
  tokenizers: [{
    token: /(^|\s)@([A-z]+)\b/g,
    transform: function (all, separator, username) {
      return separator + '<a href="/' + username + '">' + all + '</a>';
    }
  }]
});
// <- '<p>Who is this <a href='/bevacqua'>@bevacqua</a> person?</p>\n'
```

The `transform` method will get all of the arguments of `text.match(token)`, so the first argument will be `text`, followed by any capturing groups. In our case, the `/(^|\s)@([A-z]+)\b/` can be decomposed as follows.

- First off we have `(?:^|\s)`
  - The parenthesis delimit a capturing group
  - It'll be passed to transform as the second argument
  - `^|\s` means that we are looking to match either the start of input or a space character
  - We can't use `\b` instead of this expression because `@` is not a word character
- Then there's the `@` literal
- Another capturing group, `([A-z]+)`
  - It'll be passed to transform as the third argument
  - Matches one or more alphabet characters
- Finally, `\b` means that we want to match everything up to a word boundary

You can use any regular expression you want, but make sure to use the `g` modifier if you want to match multiples of any given token.

### `options.linkifiers`

Linkifiers are a simpler kind of tokenizer, but they're also more limited. Instead of asking you for a token expression, linkifiers will run on every single user-provided link _(that's in plain text, such as `ponyfoo.com`, note that actual links such as `[ponyfoo](http://ponyfoo.com)` won't be affected by this)_. If an HTML string is returned from your linkifier, then that'll be used. If none of your linkifiers return an HTML string, then the original functionality of converting the link text into an HTML link will be used.

Linkifiers are run one by one. The first linkifier to return a string will stop the rest of the linkifiers from ever running. Each linkifier receives an `href` argument and a `text` argument, containing the actual link and the text that should go in the link. These are just hints, you can return arbitrary HTML from your linkifier method, even something other than anchor links.

###### Example

Return `''` when you want to completely ignore a link. Maybe use a condition where you whitelist links from origins you're happy with.

```js
megamark('ponyfoo.com', {
  linkifiers: [function (href, text) {
    return '';
  }]
});
// <- '<p></p>\n'
```

###### Example

A real use case for this type of tokenizer is prettifying the text on the link. This is particularly useful for links on your own domain. The example below converts links that would be turned into `<a href='http://localhost:9000/bevacqua/stompflow/issues/28'>http://localhost:9000/bevacqua/stompflow/issues/28</a>` into `<a href='http://localhost:9000/bevacqua/stompflow/issues/28' class='issue-id'>#28</a>` instead.

```js
megamark('http://localhost:9000/bevacqua/stompflow/issues/28', {
  linkifiers: [function (href, text) {
    return "<a href='" + href + "' class='issue-id'>#" + href.split('/').pop() + "</a>";
  }]
});
// <- '<p>@ponyfoo</p>\n'
```

### `options.sanitizer`

These configuration options will be passed to [insane][2]. The defaults from [insane][2] are used by default.

# License

MIT

[1]: https://github.com/markdown-it/markdown-it
[2]: https://github.com/bevacqua/insane
[3]: https://github.com/isagalaev/highlight.js
[4]: https://github.com/bevacqua/highlight-redux
