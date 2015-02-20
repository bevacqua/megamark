'use strict';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');
var md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  langPrefix: 'md-lang-alias-',
  highlight: highlight
});
var ralias = / class="md-lang-alias-([^"]+)"/;
var aliases = {
  js: 'javascript',
  md: 'markdown',
  html: 'xml', // next best thing
  jade: 'css' // next best thing
};
var baseblock = md.renderer.rules.code_block;
var baseinline = md.renderer.rules.code_inline;
var basefence = md.renderer.rules.fence;
var basetext = md.renderer.rules.text;
var textcached = text([]);
var languages = [];

md.renderer.rules.code_block = block;
md.renderer.rules.code_inline = inline;
md.renderer.rules.fence = fence;
md.renderer.rules.text = text;

hljs.configure({ tabReplace: 2, classPrefix: 'md-code-' });

function highlight (code, lang) {
  var lower = String(lang).toLowerCase();
  try {
    return hljs.highlight(aliases[lower] || lower, code).value;
  } catch (e) {
    return '';
  }
}

function block () {
  var base = baseblock.apply(this, arguments).substr(11); // starts with '<pre><code>'
  var classed = '<pre class="md-code-block"><code class="md-code">' + base;
  return classed;
}

function inline () {
  var base = baseinline.apply(this, arguments).substr(6); // starts with '<code>'
  var classed = '<code class="md-code md-code-inline">' + base;
  return classed;
}

function fence () {
  var base = basefence.apply(this, arguments).substr(5); // starts with '<pre>'
  var lang = base.substr(0, 6) !== '<code>'; // when the fence has a language class
  var rest = lang ? base : '<code class="md-code">' + base.substr(6);
  var classed = '<pre class="md-code-block">' + rest;
  var aliased = classed.replace(ralias, aliasing);
  return aliased;
}

function aliasing (all, language) {
  var name = aliases[language] || language || 'unknown';
  var lang = 'md-lang-' + name;
  if (languages.indexOf(lang) === -1) {
    languages.push(lang);
  }
  return ' class="md-code ' + lang + '"';
}

function text (tokenizers) {
  return function text () {
    var base = basetext.apply(this, arguments);
    var fancy = fanciful(base);
    var tokenized = tokenize(fancy, tokenizers);
    return tokenized;
  };
}

function fanciful (text) {
  return text
    .replace(/--/g, '\u2014')                            // em-dashes
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')      // opening singles
    .replace(/'/g, '\u2019')                             // closing singles & apostrophes
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c') // opening doubles
    .replace(/"/g, '\u201d')                             // closing doubles
    .replace(/\.{3}/g, '\u2026');                        // ellipses
}

function tokenize (text, tokenizers) {
  var result = text;
  tokenizers.forEach(use);
  return result;
  function use (tok) {
    var match = result.match(tok.token);
    while (match !== null) {
      result = tok.transform.apply(null, match);
      match = result.match(tok.token);
    }
  }
}

function markdown (input, options) {
  var tok = options && options.tokenizers || [];
  var valid = input === null || input === void 0 ? '' : String(input);
  md.renderer.rules.text = tok.length ? text(tok) : textcached;
  var html = md.render(valid);
  return html;
}

markdown.parser = md;
markdown.languages = languages;
module.exports = markdown;
