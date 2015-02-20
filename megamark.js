'use strict';

var marked = require('marked');
var insane = require('insane');
var assign = require('./assign');
var markdown = require('./markdown');
var hightokens = require('highlight.js-tokens').map(codeclass);

function codeclass (token) {
  return 'md-code-' + token;
}

function sanitize (html, options) {
  var configuration = assign({}, options, {
    allowedClasses: {
      pre: ['md-code-block'],
      code: markdown.languages,
      span: hightokens
    }
  });
  return insane(html, configuration);
}

function megamark (md, options) {
  var user = options || {};
  var html = markdown(md, { tokenizers: user.tokenizers });
  var sane = sanitize(html, user.sanitizer);
  return sane;
}

markdown.languages.push('md-code', 'md-code-inline'); // only sanitizing purposes
module.exports = megamark;
