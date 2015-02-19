'use strict';

var marked = require('marked');

function persianparser (options, renderer) {
  var parser = new marked.Parser(options, renderer);
  parser.parse = parsel;
  return parser;

  function parsel (tokens) {
    var out = '';

    this.inline = flexlex(tokens.links, options, renderer);
    this.tokens = tokens.reverse();

    while (this.next()) {
      out += this.tok();
    }
    return out;
  }
}

function flexlex (links, options, renderer) {
  var inline = new marked.InlineLexer(links, options, renderer);
  var basepants = inline.smartypants;
  var baseout = inline.output;
  inline.smartypants = captainhook;
  inline.output = unmark;

  function captainhook () {
    var partial = basepants.apply(this, arguments);
    var tokenized = tokenize(partial, options.tokenizers);
    return tokenized;
  }
  function unmark () {
    var partial = baseout.apply(this, arguments);
    var detokenized = detokenize(partial);
    return detokenized;
  }
  return inline;
}

function tokenize (text, tokenizers) {
  var i = 0;
  var match;
  var tok;
  var out;
  for (i = 0; i < tokenizers.length; i++) {
    tok = tokenizers[i];
    next();
    while (match !== null) {
      out = tok.transform.apply(null, match);
      if (tok.encode !== true) {
        text = '::::TOKEN::::' + out + ';;;;TOKEN;;;;';
      } else {
        text = out;
      }
      next();
    }
  }
  return text;

  function next () {
    match = text.match(tok.token);
  }
}

function detokenize (text) {
  var token = /::::TOKEN::::(.*);;;;TOKEN;;;;/g;
  return text.replace(token, unescaped);
  function unescaped (all, unmarked) {
    return unescape(unmarked);
  }
}

function unescape (html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');
}

function markdown (md, options) {
  var valid = md === null || md === void 0 ? '' : String(md);
  var tokens = marked.lexer(valid, options);
  var parser = persianparser(options);
  var html = parser.parse(tokens);
  return html;
}

module.exports = markdown;
