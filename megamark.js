'use strict';

var marked = require('marked');
var insane = require('insane');
var high = require('highlight.js');
var hightokens = require('highlight.js-tokens').map(prefixed);
var assign = require('./assign');
var markdown = require('./markdown');
var aliases = {
  js: 'javascript',
  md: 'markdown',
  html: 'xml', // next best thing
  jade: 'css' // next best thing
};
var languages = [];

high.configure({ tabReplace: 2, classPrefix: 'md-code-' });

function prefixed (token) {
  return 'md-code-' + token;
}

function highlights (base) {
  if (base.__sharpie) {
    return base;
  }
  var sharpie = new marked.Renderer();
  sharpie.code = code;
  sharpie.codespan = codespan;
  sharpie.__sharpie = true;
  Object.keys(base).forEach(move);
  return sharpie;

  function move (key) {
    sharpie[key] = base[key];
  }
  function code () {
    var result = base.code.apply(sharpie, arguments);
    var classed = result.replace(/^<pre><code>/i, '<pre class="md-container"><code class="md-code">');
    return classed;
  }
  function codespan () {
    var result = base.codespan.apply(sharpie, arguments);
    var classed = result.replace(/^<code>/i, '<code class="md-code md-code-inline">');
    return classed;
  }
}

function highlight (code, lang) {
  var lower = String(lang).toLowerCase();
  try {
    return high.highlight(aliases[lower] || lower, code).value;
  } catch (ex) {
    // marked will know what to do.
  }
}

function htmlize (md, options) {
  var html = markdown(md, options);
  html = html.replace(/"megamark-language-([\w-]+)"/ig, replacePlaceholder);
  html = html.replace(/<pre><code([\s>])/ig, replacePre);
  return html;
}

function replacePre (match, next) {
  return '<pre class="md-container"><code' + next;
}

function replacePlaceholder (match, lang) {
  var lower = lang.toLowerCase();
  var specific = aliases[lower] || lower || 'unknown';
  var prefixed = 'md-lang-' + specific;
  if (languages.indexOf(prefixed) === -1) {
    languages.push(prefixed);
  }
  return '"md-code ' + prefixed + '"';
}

function sanitize (html, options) {
  return insane(html, assign({}, options, {
    allowedClasses: {
      pre: ['md-container'],
      code: ['md-code', 'md-code-inline'].concat(languages),
      span: hightokens
    }
  }));
}

function megamark (md, options) {
  var user = options || {};
  var overrides = {
    smartLists: true,
    smartypants: true,
    langPrefix: 'megamark-language-', // placeholder
    highlight: highlight,
    tokenizers: user.tokenizers || []
  };
  var configuration = assign({}, marked.defaults, overrides);
  configuration.renderer = highlights(configuration.renderer);
  return sanitize(htmlize(md, configuration), user.sanitizer);
}

module.exports = megamark;
