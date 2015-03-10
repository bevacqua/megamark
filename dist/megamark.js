!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.megamark=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');
var tokenizeLinks = require('./tokenizeLinks');
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
var textcached = textparser([]);
var languages = [];
var context = {};

md.core.ruler.before('linkify', 'linkify-tokenizer', linkifyTokenizer, {});
md.renderer.rules.code_block = block;
md.renderer.rules.code_inline = inline;
md.renderer.rules.fence = fence;

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

function textparser (tokenizers) {
  return function parseText () {
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

function linkifyTokenizer (state) {
  tokenizeLinks(state, context);
}

function tokenize (text, tokenizers) {
  return tokenizers.reduce(use, text);
  function use (result, tok) {
    return result.replace(tok.token, tok.transform);
  }
}

function markdown (input, options) {
  var tok = options.tokenizers || [];
  var lin = options.linkifiers || [];
  var valid = input === null || input === void 0 ? '' : String(input);
  context.tokenizers = tok;
  context.linkifiers = lin;
  md.renderer.rules.text = tok.length ? textparser(tok) : textcached;
  var html = md.render(valid);
  return html;
}

markdown.parser = md;
markdown.languages = languages;
module.exports = markdown;

},{"./tokenizeLinks":83,"highlight.js":5,"markdown-it":31}],2:[function(require,module,exports){
'use strict';

var insane = require('insane');
var assign = require('assignment');
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
  var o = options || {};
  var html = markdown(md, o);
  var sane = sanitize(html, o.sanitizer);
  return sane;
}

markdown.languages.push('md-code', 'md-code-inline'); // only sanitizing purposes
megamark.parser = markdown.parser;
module.exports = megamark;

},{"./markdown":1,"assignment":3,"highlight.js-tokens":14,"insane":18}],3:[function(require,module,exports){
'use strict';

function assignment (result) {
  var stack = Array.prototype.slice.call(arguments, 1);
  var item;
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(result[key]) === '[object Object]') {
          result[key] = assignment(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    }
  }
  return result;
}

module.exports = assignment;

},{}],4:[function(require,module,exports){
var Highlight = function() {

  /* Utility functions */

  function escape(value) {
    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index == 0;
  }

  function blockText(block) {
    return Array.prototype.map.call(block.childNodes, function(node) {
      if (node.nodeType == 3) {
        return options.useBR ? node.nodeValue.replace(/\n/g, '') : node.nodeValue;
      }
      if (tag(node) == 'br') {
        return '\n';
      }
      return blockText(node);
    }).join('');
  }

  function blockLanguage(block) {
    var classes = (block.className + ' ' + (block.parentNode ? block.parentNode.className : '')).split(/\s+/);
    classes = classes.map(function(c) {return c.replace(/^language-/, '');});
    return classes.filter(function(c) {return getLanguage(c) || c == 'no-highlight';})[0];
  }

  function inherit(parent, obj) {
    var result = {};
    for (var key in parent)
      result[key] = parent[key];
    if (obj)
      for (var key in obj)
        result[key] = obj[key];
    return result;
  };

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == 3)
          offset += child.nodeValue.length;
        else if (tag(child) == 'br')
          offset += 1;
        else if (child.nodeType == 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          result.push({
            event: 'stop',
            offset: offset,
            node: child
          });
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset != highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event == 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"';}
      result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event == 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substr(processed, stream[0].offset - processed));
      processed = stream[0].offset;
      if (stream == original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream == original && stream.length && stream[0].offset == processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event == 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        function flatten(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        }

        if (typeof mode.keywords == 'string') { // string
          flatten('keyword', mode.keywords);
        } else {
          Object.keys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\b[A-Za-z0-9_]+\b/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = mode.beginKeywords.split(' ').join('|');
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance === undefined)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      var expanded_contains = [];
      mode.contains.forEach(function(c) {
        if (c.variants) {
          c.variants.forEach(function(v) {expanded_contains.push(inherit(c, v));});
        } else {
          expanded_contains.push(c == 'self' ? mode : c);
        }
      });
      mode.contains = expanded_contains;
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators =
        mode.contains.map(function(c) {
          return c.beginKeywords ? '\\.?\\b(' + c.begin + ')\\b\\.?' : c.begin;
        })
        .concat([mode.terminator_end])
        .concat([mode.illegal])
        .map(reStr)
        .filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(s) {return null;}};

      mode.continuation = {};
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {

    function subMode(lexeme, mode) {
      for (var i = 0; i < mode.contains.length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : '</span>';

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var buffer = escape(mode_buffer);
      if (!top.keywords)
        return buffer;
      var result = '';
      var last_index = 0;
      top.lexemesRe.lastIndex = 0;
      var match = top.lexemesRe.exec(buffer);
      while (match) {
        result += buffer.substr(last_index, match.index - last_index);
        var keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], match[0]);
        } else {
          result += match[0];
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(buffer);
      }
      return result + buffer.substr(last_index);
    }

    function processSubLanguage() {
      if (top.subLanguage && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result = top.subLanguage ? highlight(top.subLanguage, mode_buffer, true, top.continuation.top) : highlightAuto(mode_buffer);
      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (top.subLanguageMode == 'continuous') {
        top.continuation.top = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
    }

    function startNewMode(mode, lexeme) {
      var markup = mode.className? buildSpan(mode.className, '', true): '';
      if (mode.returnBegin) {
        result += markup;
        mode_buffer = '';
      } else if (mode.excludeBegin) {
        result += escape(lexeme) + markup;
        mode_buffer = '';
      } else {
        result += markup;
        mode_buffer = lexeme;
      }
      top = Object.create(mode, {parent: {value: top}});
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;
      if (lexeme === undefined) {
        result += processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        result += processBuffer();
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        result += processBuffer();
        do {
          if (top.className) {
            result += '</span>';
          }
          relevance += top.relevance;
          top = top.parent;
        } while (top != end_mode.parent);
        if (origin.excludeEnd) {
          result += escape(lexeme);
        }
        mode_buffer = '';
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top))
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var result = '';
    for(var current = top; current != language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, result, true);
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexeme(value.substr(index, match.index - index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for(var current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += '</span>';
        }
      };
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message.indexOf('Illegal') != -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.forEach(function(name) {
      if (!getLanguage(name)) {
        return;
      }
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    if (options.tabReplace) {
      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1, offset, s) {
        return p1.replace(/\t/g, options.tabReplace);
      });
    }
    if (options.useBR) {
      value = value.replace(/\n/g, '<br>');
    }
    return value;
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var text = blockText(block);
    var language = blockLanguage(block);
    if (language == 'no-highlight')
        return;
    var result = language ? highlight(language, text, true) : highlightAuto(text);
    var original = nodeStream(block);
    if (original.length) {
      var pre = document.createElementNS('http://www.w3.org/1999/xhtml', 'pre');
      pre.innerHTML = result.value;
      result.value = mergeStreams(original, nodeStream(pre), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className += ' hljs ' + (!language && result.language || '');
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  /*
  Updates highlight.js global options with values passed in the form of an object
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  var languages = {};
  var aliases = {};

  function registerLanguage(name, language) {
    var lang = languages[name] = language(this);
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function getLanguage(name) {
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  this.highlight = highlight;
  this.highlightAuto = highlightAuto;
  this.fixMarkup = fixMarkup;
  this.highlightBlock = highlightBlock;
  this.configure = configure;
  this.initHighlighting = initHighlighting;
  this.initHighlightingOnLoad = initHighlightingOnLoad;
  this.registerLanguage = registerLanguage;
  this.getLanguage = getLanguage;
  this.inherit = inherit;

  // Common regexps
  this.IDENT_RE = '[a-zA-Z][a-zA-Z0-9_]*';
  this.UNDERSCORE_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*';
  this.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  this.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  this.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  this.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  this.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  this.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE]
  };
  this.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE]
  };
  this.C_LINE_COMMENT_MODE = {
    className: 'comment',
    begin: '//', end: '$'
  };
  this.C_BLOCK_COMMENT_MODE = {
    className: 'comment',
    begin: '/\\*', end: '\\*/'
  };
  this.HASH_COMMENT_MODE = {
    className: 'comment',
    begin: '#', end: '$'
  };
  this.NUMBER_MODE = {
    className: 'number',
    begin: this.NUMBER_RE,
    relevance: 0
  };
  this.C_NUMBER_MODE = {
    className: 'number',
    begin: this.C_NUMBER_RE,
    relevance: 0
  };
  this.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: this.BINARY_NUMBER_RE,
    relevance: 0
  };
  this.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gim]*/,
    illegal: /\n/,
    contains: [
      this.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [this.BACKSLASH_ESCAPE]
      }
    ]
  };
  this.TITLE_MODE = {
    className: 'title',
    begin: this.IDENT_RE,
    relevance: 0
  };
  this.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: this.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
};
module.exports = Highlight;
},{}],5:[function(require,module,exports){
var Highlight = require('./highlight');
var hljs = new Highlight();
hljs.registerLanguage('bash', require('./languages/bash.js'));
hljs.registerLanguage('javascript', require('./languages/javascript.js'));
hljs.registerLanguage('xml', require('./languages/xml.js'));
hljs.registerLanguage('markdown', require('./languages/markdown.js'));
hljs.registerLanguage('css', require('./languages/css.js'));
hljs.registerLanguage('http', require('./languages/http.js'));
hljs.registerLanguage('ini', require('./languages/ini.js'));
hljs.registerLanguage('json', require('./languages/json.js'));
module.exports = hljs;
},{"./highlight":4,"./languages/bash.js":6,"./languages/css.js":7,"./languages/http.js":8,"./languages/ini.js":9,"./languages/javascript.js":10,"./languages/json.js":11,"./languages/markdown.js":12,"./languages/xml.js":13}],6:[function(require,module,exports){
module.exports = function(hljs) {
  var VAR = {
    className: 'variable',
    variants: [
      {begin: /\$[\w\d#@][\w\d_]*/},
      {begin: /\$\{(.*?)\}/}
    ]
  };
  var QUOTE_STRING = {
    className: 'string',
    begin: /"/, end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  var APOS_STRING = {
    className: 'string',
    begin: /'/, end: /'/
  };

  return {
    lexemes: /-?[a-z\.]+/,
    keywords: {
      keyword:
        'if then else elif fi for break continue while in do done exit return set '+
        'declare case esac export exec',
      literal:
        'true false',
      built_in:
        'printf echo read cd pwd pushd popd dirs let eval unset typeset readonly '+
        'getopts source shopt caller type hash bind help sudo',
      operator:
        '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
    },
    contains: [
      {
        className: 'shebang',
        begin: /^#![^\n]+sh\s*$/,
        relevance: 10
      },
      {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, {begin: /\w[\w\d_]*/})],
        relevance: 0
      },
      hljs.HASH_COMMENT_MODE,
      hljs.NUMBER_MODE,
      QUOTE_STRING,
      APOS_STRING,
      VAR
    ]
  };
};
},{}],7:[function(require,module,exports){
module.exports = function(hljs) {
  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  var FUNCTION = {
    className: 'function',
    begin: IDENT_RE + '\\(', end: '\\)',
    contains: ['self', hljs.NUMBER_MODE, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
  };
  return {
    case_insensitive: true,
    illegal: '[=/|\']',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'id', begin: '\\#[A-Za-z0-9_-]+'
      },
      {
        className: 'class', begin: '\\.[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'attr_selector',
        begin: '\\[', end: '\\]',
        illegal: '$'
      },
      {
        className: 'pseudo',
        begin: ':(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\"\\\']+'
      },
      {
        className: 'at_rule',
        begin: '@(font-face|page)',
        lexemes: '[a-z-]+',
        keywords: 'font-face page'
      },
      {
        className: 'at_rule',
        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
                                 // because it doesn’t let it to be parsed as
                                 // a rule set but instead drops parser into
                                 // the default mode which is how it should be.
        contains: [
          {
            className: 'keyword',
            begin: /\S+/
          },
          {
            begin: /\s/, endsWithParent: true, excludeEnd: true,
            relevance: 0,
            contains: [
              FUNCTION,
              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
              hljs.NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: 'tag', begin: IDENT_RE,
        relevance: 0
      },
      {
        className: 'rules',
        begin: '{', end: '}',
        illegal: '[^\\s]',
        relevance: 0,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: 'rule',
            begin: '[^\\s]', returnBegin: true, end: ';', endsWithParent: true,
            contains: [
              {
                className: 'attribute',
                begin: '[A-Z\\_\\.\\-]+', end: ':',
                excludeEnd: true,
                illegal: '[^\\s]',
                starts: {
                  className: 'value',
                  endsWithParent: true, excludeEnd: true,
                  contains: [
                    FUNCTION,
                    hljs.NUMBER_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    {
                      className: 'hexcolor', begin: '#[0-9A-Fa-f]+'
                    },
                    {
                      className: 'important', begin: '!important'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  };
};
},{}],8:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    illegal: '\\S',
    contains: [
      {
        className: 'status',
        begin: '^HTTP/[0-9\\.]+', end: '$',
        contains: [{className: 'number', begin: '\\b\\d{3}\\b'}]
      },
      {
        className: 'request',
        begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$', returnBegin: true, end: '$',
        contains: [
          {
            className: 'string',
            begin: ' ', end: ' ',
            excludeBegin: true, excludeEnd: true
          }
        ]
      },
      {
        className: 'attribute',
        begin: '^\\w', end: ': ', excludeEnd: true,
        illegal: '\\n|\\s|=',
        starts: {className: 'string', end: '$'}
      },
      {
        begin: '\\n\\n',
        starts: {subLanguage: '', endsWithParent: true}
      }
    ]
  };
};
},{}],9:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    illegal: /\S/,
    contains: [
      {
        className: 'comment',
        begin: ';', end: '$'
      },
      {
        className: 'title',
        begin: '^\\[', end: '\\]'
      },
      {
        className: 'setting',
        begin: '^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*', end: '$',
        contains: [
          {
            className: 'value',
            endsWithParent: true,
            keywords: 'on off true false yes no',
            contains: [hljs.QUOTE_STRING_MODE, hljs.NUMBER_MODE],
            relevance: 0
          }
        ]
      }
    ]
  };
};
},{}],10:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    aliases: ['js'],
    keywords: {
      keyword:
        'in if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const class',
      literal:
        'true false null undefined NaN Infinity',
      built_in:
        'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
        'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
        'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
        'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
        'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
        'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require'
    },
    contains: [
      {
        className: 'pi',
        begin: /^\s*('|")use strict('|")/,
        relevance: 10
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          { // E4X
            begin: /</, end: />;/,
            relevance: 0,
            subLanguage: 'xml'
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ],
            illegal: /["'\(]/
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
      }
    ]
  };
};
},{}],11:[function(require,module,exports){
module.exports = function(hljs) {
  var LITERALS = {literal: 'true false null'};
  var TYPES = [
    hljs.QUOTE_STRING_MODE,
    hljs.C_NUMBER_MODE
  ];
  var VALUE_CONTAINER = {
    className: 'value',
    end: ',', endsWithParent: true, excludeEnd: true,
    contains: TYPES,
    keywords: LITERALS
  };
  var OBJECT = {
    begin: '{', end: '}',
    contains: [
      {
        className: 'attribute',
        begin: '\\s*"', end: '"\\s*:\\s*', excludeBegin: true, excludeEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE],
        illegal: '\\n',
        starts: VALUE_CONTAINER
      }
    ],
    illegal: '\\S'
  };
  var ARRAY = {
    begin: '\\[', end: '\\]',
    contains: [hljs.inherit(VALUE_CONTAINER, {className: null})], // inherit is also a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
    illegal: '\\S'
  };
  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
  return {
    contains: TYPES,
    keywords: LITERALS,
    illegal: '\\S'
  };
};
},{}],12:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      // highlight headers
      {
        className: 'header',
        variants: [
          { begin: '^#{1,6}', end: '$' },
          { begin: '^.+?\\n[=-]{2,}$' }
        ]
      },
      // inline html
      {
        begin: '<', end: '>',
        subLanguage: 'xml',
        relevance: 0
      },
      // lists (indicators only)
      {
        className: 'bullet',
        begin: '^([*+-]|(\\d+\\.))\\s+'
      },
      // strong segments
      {
        className: 'strong',
        begin: '[*_]{2}.+?[*_]{2}'
      },
      // emphasis segments
      {
        className: 'emphasis',
        variants: [
          { begin: '\\*.+?\\*' },
          { begin: '_.+?_'
          , relevance: 0
          }
        ]
      },
      // blockquotes
      {
        className: 'blockquote',
        begin: '^>\\s+', end: '$'
      },
      // code snippets
      {
        className: 'code',
        variants: [
          { begin: '`.+?`' },
          { begin: '^( {4}|\t)', end: '$'
          , relevance: 0
          }
        ]
      },
      // horizontal rules
      {
        className: 'horizontal_rule',
        begin: '^[-\\*]{3,}', end: '$'
      },
      // using links - title and link
      {
        begin: '\\[.+?\\][\\(\\[].+?[\\)\\]]',
        returnBegin: true,
        contains: [
          {
            className: 'link_label',
            begin: '\\[', end: '\\]',
            excludeBegin: true,
            returnEnd: true,
            relevance: 0
          },
          {
            className: 'link_url',
            begin: '\\]\\(', end: '\\)',
            excludeBegin: true, excludeEnd: true
          },
          {
            className: 'link_reference',
            begin: '\\]\\[', end: '\\]',
            excludeBegin: true, excludeEnd: true,
          }
        ],
        relevance: 10
      },
      {
        begin: '^\\[\.+\\]:', end: '$',
        returnBegin: true,
        contains: [
          {
            className: 'link_reference',
            begin: '\\[', end: '\\]',
            excludeBegin: true, excludeEnd: true
          },
          {
            className: 'link_url',
            begin: '\\s', end: '$'
          }
        ]
      }
    ]
  };
};
},{}],13:[function(require,module,exports){
module.exports = function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var PHP = {
    begin: /<\?(php)?(?!\w)/, end: /\?>/,
    subLanguage: 'php', subLanguageMode: 'continuous'
  };
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      PHP,
      {
        className: 'attribute',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: '=',
        relevance: 0,
        contains: [
          {
            className: 'value',
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s\/>]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html'],
    case_insensitive: true,
    contains: [
      {
        className: 'doctype',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      {
        className: 'comment',
        begin: '<!--', end: '-->',
        relevance: 10
      },
      {
        className: 'cdata',
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {title: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: 'css'
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {title: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</script>', returnEnd: true,
          subLanguage: 'javascript'
        }
      },
      {
        begin: '<%', end: '%>',
        subLanguage: 'vbscript'
      },
      PHP,
      {
        className: 'pi',
        begin: /<\?\w+/, end: /\?>/,
        relevance: 10
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'title', begin: '[^ /><]+', relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
};
},{}],14:[function(require,module,exports){
// http://highlightjs.readthedocs.org/en/latest/css-classes-reference.html

module.exports = [
  'addition',
  'annotaion',
  'annotation',
  'argument',
  'array',
  'at_rule',
  'attr_selector',
  'attribute',
  'begin-block',
  'blockquote',
  'body',
  'built_in',
  'bullet',
  'cbracket',
  'cdata',
  'cell',
  'change',
  'char',
  'chunk',
  'class',
  'code',
  'collection',
  'command',
  'commands',
  'commen',
  'comment',
  'constant',
  'container',
  'dartdoc',
  'date',
  'decorator',
  'default',
  'deletion',
  'doctype',
  'emphasis',
  'end-block',
  'envvar',
  'expression',
  'filename',
  'filter',
  'flow',
  'foreign',
  'formula',
  'func',
  'function',
  'function_name',
  'generics',
  'header',
  'hexcolor',
  'horizontal_rule',
  'id',
  'import',
  'important',
  'infix',
  'inheritance',
  'input',
  'javadoc',
  'javadoctag',
  'keyword',
  'keywords',
  'label',
  'link_label',
  'link_reference',
  'link_url',
  'list',
  'literal',
  'localvars',
  'long_brackets',
  'matrix',
  'module',
  'number',
  'operator',
  'output',
  'package',
  'param',
  'parameter',
  'params',
  'parent',
  'phpdoc',
  'pi',
  'pod',
  'pp',
  'pragma',
  'preprocessor',
  'prompt',
  'property',
  'pseudo',
  'quoted',
  'record_name',
  'regex',
  'regexp',
  'request',
  'reserved',
  'rest_arg',
  'rules',
  'shader',
  'shading',
  'shebang',
  'special',
  'sqbracket',
  'status',
  'stl_container',
  'stream',
  'string',
  'strong',
  'sub',
  'subst',
  'summary',
  'symbol',
  'tag',
  'template_comment',
  'template_tag',
  'title',
  'type',
  'typedef',
  'typename',
  'value',
  'var_expand',
  'variable',
  'winutils',
  'xmlDocTag',
  'yardoctag'
]

},{}],15:[function(require,module,exports){
'use strict';

var toMap = require('./toMap');
var uris = ['background', 'base', 'cite', 'href', 'longdesc', 'src', 'usemap'];

module.exports = {
  uris: toMap(uris) // attributes that have an href and hence need to be sanitized
};

},{"./toMap":23}],16:[function(require,module,exports){
'use strict';

var defaults = {
  allowedAttributes: {
    a: ['href', 'name', 'target', 'title', 'aria-label'],
    iframe: ['allowfullscreen', 'frameborder', 'src'],
    img: ['src', 'alt', 'title', 'aria-label']
  },
  allowedClasses: {},
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedTags: [
    'a', 'article', 'b', 'blockquote', 'br', 'caption', 'code', 'del', 'details', 'div', 'em',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'main',
    'ol', 'p', 'pre', 'section', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table',
    'tbody', 'td', 'th', 'thead', 'tr', 'ul'
  ],
  filter: null
};

module.exports = defaults;

},{}],17:[function(require,module,exports){
'use strict';

var toMap = require('./toMap');
var voids = ['area', 'br', 'col', 'hr', 'img', 'wbr', 'input', 'base', 'basefont', 'link', 'meta'];

module.exports = {
  voids: toMap(voids)
};

},{"./toMap":23}],18:[function(require,module,exports){
'use strict';

var he = require('he');
var assign = require('assignment');
var parser = require('./parser');
var sanitizer = require('./sanitizer');
var defaults = require('./defaults');

function insane (html, options, strict) {
  var buffer = [];
  var configuration = strict === true ? options : assign({}, defaults, options);
  var handler = sanitizer(buffer, configuration);

  parser(html, handler);

  return buffer.join('');
}

insane.defaults = defaults;
module.exports = insane;

},{"./defaults":16,"./parser":20,"./sanitizer":21,"assignment":3,"he":22}],19:[function(require,module,exports){
'use strict';

module.exports = function lowercase (string) {
  return typeof string === 'string' ? string.toLowerCase() : string;
};

},{}],20:[function(require,module,exports){
'use strict';

var he = require('he');
var lowercase = require('./lowercase');
var attributes = require('./attributes');
var elements = require('./elements');
var rstart = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/;
var rend = /^<\s*\/\s*([\w:-]+)[^>]*>/;
var rattrs = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;
var rtag = /^</;
var rtagend = /^<\s*\//;

function createStack () {
  var stack = [];
  stack.lastItem = function lastItem () {
    return stack[stack.length - 1];
  };
  return stack;
}

function parser (html, handler) {
  var stack = createStack();
  var last = html;
  var chars;

  while (html) {
    parsePart();
  }
  parseEndTag(); // clean up any remaining tags

  function parsePart () {
    chars = true;
    parseTag();
    if (html === last) {
      throw new Error('insane parser error: ' + html);
    }
    last = html;
  }

  function parseTag () {
    if (html.substr(0, 4) === '<!--') { // comments
      parseComment();
    } else if (rtagend.test(html)) {
      parseEdge(rend, parseEndTag);
    } else if (rtag.test(html)) {
      parseEdge(rstart, parseStartTag);
    }
    parseTagDecode();
  }

  function parseEdge (regex, parser) {
    var match = html.match(regex);
    if (match) {
      html = html.substring(match[0].length);
      match[0].replace(regex, parser);
      chars = false;
    }
  }

  function parseComment () {
    var index = html.indexOf('-->');
    if (index >= 0) {
      if (handler.comment) {
        handler.comment(html.substring(4, index));
      }
      html = html.substring(index + 3);
      chars = false;
    }
  }

  function parseTagDecode () {
    if (!chars) {
      return;
    }
    var text;
    var index = html.indexOf('<');
    if (index >= 0) {
      text = html.substring(0, index);
      html = html.substring(index);
    } else {
      text = html;
      html = '';
    }
    if (handler.chars) {
      handler.chars(he.decode(text));
    }
  }

  function parseStartTag (tag, tagName, rest, unary) {
    var attrs = {};
    var low = lowercase(tagName);
    var u = elements.voids[low] || !!unary;

    rest.replace(rattrs, attrReplacer);

    if (!u) {
      stack.push(low);
    }
    if (handler.start) {
      handler.start(low, attrs, u);
    }

    function attrReplacer (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
      attrs[name] = he.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || '');
    }
  }

  function parseEndTag (tag, tagName) {
    var i;
    var pos = 0;
    var low = lowercase(tagName);
    if (low) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === low) {
          break; // find the closest opened tag of the same type
        }
      }
    }
    if (pos >= 0) {
      for (i = stack.length - 1; i >= pos; i--) {
        if (handler.end) { // close all the open elements, up the stack
          handler.end(stack[i]);
        }
      }
      stack.length = pos;
    }
  }
}

module.exports = parser;

},{"./attributes":15,"./elements":17,"./lowercase":19,"he":22}],21:[function(require,module,exports){
'use strict';

var he = require('he');
var lowercase = require('./lowercase');
var attributes = require('./attributes');

function sanitizer (buffer, options) {
  var last;
  var context;
  var o = options || {};

  reset();

  return {
    start: start,
    end: end,
    chars: chars
  };

  function out (value) {
    buffer.push(value);
  }

  function start (tag, attrs, unary) {
    var low = lowercase(tag);

    if (context.ignoring) {
      ignore(low); return;
    }
    if ((o.allowedTags || []).indexOf(low) === -1) {
      ignore(low); return;
    }
    if (o.filter && !o.filter({ tag: low, attrs: attrs })) {
      ignore(low); return;
    }

    out('<');
    out(low);
    Object.keys(attrs).forEach(parse);
    out(unary ? '/>' : '>');

    function parse (key) {
      var value = attrs[key];
      var classesOk = (o.allowedClasses || {})[low] || [];
      var attrsOk = (o.allowedAttributes || {})[low] || [];
      var valid;
      var lkey = lowercase(key);
      if (lkey === 'class' && attrsOk.indexOf(lkey) === -1) {
        value = value.split(' ').filter(isValidClass).join(' ').trim();
        valid = value.length;
      } else {
        valid = attrsOk.indexOf(lkey) !== -1 && (attributes.uris[lkey] !== true || testUrl(value));
      }
      if (valid) {
        out(' ');
        out(key);
        out('="');
        out(he.encode(value));
        out('"');
      }
      function isValidClass (className) {
        return classesOk && classesOk.indexOf(className) !== -1;
      }
    }
  }

  function end (tag) {
    var low = lowercase(tag);
    var allowed = (o.allowedTags || []).indexOf(low) !== -1;
    if (allowed) {
      if (context.ignoring === false) {
        out('</');
        out(low);
        out('>');
      } else {
        unignore(low);
      }
    } else {
      unignore(low);
    }
  }

  function testUrl (text) {
    var start = text[0];
    if (start === '#' || start === '/') {
      return true;
    }
    var colon = text.indexOf(':');
    if (colon === -1) {
      return true;
    }
    var questionmark = text.indexOf('?');
    if (questionmark !== -1 && colon > questionmark) {
      return true;
    }
    var hash = text.indexOf('#');
    if (hash !== -1 && colon > hash) {
      return true;
    }
    return o.allowedSchemes.some(matches);

    function matches (scheme) {
      return text.indexOf(scheme + ':') === 0;
    }
  }

  function chars (text) {
    if (context.ignoring === false) {
      out(he.encode(text));
    }
  }

  function ignore (tag) {
    if (context.ignoring === false) {
      context = { ignoring: tag, depth: 1 };
    } else if (context.ignoring === tag) {
      context.depth++;
    }
  }

  function unignore (tag) {
    if (context.ignoring === tag) {
      if (--context.depth <= 0) {
        reset();
      }
    }
  }

  function reset () {
    context = { ignoring: false, depth: 0 };
  }
}

module.exports = sanitizer;

},{"./attributes":15,"./lowercase":19,"he":22}],22:[function(require,module,exports){
'use strict';

var escapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
var unescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};
var rescaped = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g;
var runescaped = /[&<>"']/g;

function escapeHtmlChar (match) {
  return escapes[match];
}
function unescapeHtmlChar (match) {
  return unescapes[match];
}

function escapeHtml (text) {
  return text == null ? '' : String(text).replace(runescaped, escapeHtmlChar);
}

function unescapeHtml (html) {
  return html == null ? '' : String(html).replace(rescaped, unescapeHtmlChar);
}

escapeHtml.options = unescapeHtml.options = {};

module.exports = {
  encode: escapeHtml,
  escape: escapeHtml,
  decode: unescapeHtml,
  unescape: unescapeHtml,
  version: '1.0.0-browser'
};

},{}],23:[function(require,module,exports){
'use strict';

function toMap (list) {
  return list.reduce(asKey, {});
}

function asKey (accumulator, item) {
  accumulator[item] = true;
  return accumulator;
}

module.exports = toMap;

},{}],24:[function(require,module,exports){
'use strict';


////////////////////////////////////////////////////////////////////////////////
// Helpers

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

function _class(obj) { return Object.prototype.toString.call(obj); }
function isString(obj) { return _class(obj) === '[object String]'; }
function isObject(obj) { return _class(obj) === '[object Object]'; }
function isRegExp(obj) { return _class(obj) === '[object RegExp]'; }
function isFunction(obj) { return _class(obj) === '[object Function]'; }


function escapeRE (str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); }

////////////////////////////////////////////////////////////////////////////////


var defaultSchemas = {
  'http:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.http) {
        // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.http =  new RegExp(
          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
        );
      }
      if (self.re.http.test(tail)) {
        return tail.match(self.re.http)[0].length;
      }
      return 0;
    }
  },
  'https:':  'http:',
  'ftp:':    'http:',
  '//':      {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.no_http) {
      // compile lazily, becayse "host"-containing variables can change on tlds update.
        self.re.no_http =  new RegExp(
          '^' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
        );
      }

      if (self.re.no_http.test(tail)) {
        // should not be `://`, that protects from errors in protocol name
        if (pos >= 3 && text[pos - 3] === ':') { return 0; }
        return tail.match(self.re.no_http)[0].length;
      }
      return 0;
    }
  },
  'mailto:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.mailto) {
        self.re.mailto =  new RegExp(
          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
        );
      }
      if (self.re.mailto.test(tail)) {
        return tail.match(self.re.mailto)[0].length;
      }
      return 0;
    }
  }
};

// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

////////////////////////////////////////////////////////////////////////////////

function resetScanCache(self) {
  self.__index__ = -1;
  self.__text_cache__   = '';
}

function createValidator(re) {
  return function (text, pos) {
    var tail = text.slice(pos);

    if (re.test(tail)) {
      return tail.match(re)[0].length;
    }
    return 0;
  };
}

function createNormalizer() {
  return function (match, self) {
    self.normalize(match);
  };
}

// Schemas compiler. Build regexps.
//
function compile(self) {

  // Load & clone RE patterns.
  var re = self.re = assign({}, require('./lib/re'));

  // Define dynamic patterns
  var tlds = self.__tlds__.slice();

  if (!self.__tlds_replaced__) {
    tlds.push('[a-z]{2}');
  }
  tlds.push(re.src_xn);

  re.src_tlds = tlds.join('|');

  function untpl(tpl) { return tpl.replace('%TLDS%', re.src_tlds); }

  re.email_fuzzy      = RegExp(untpl(re.tpl_email_fuzzy), 'i');
  re.link_fuzzy       = RegExp(untpl(re.tpl_link_fuzzy), 'i');
  re.host_fuzzy_test  = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

  //
  // Compile each schema
  //

  var aliases = [];

  self.__compiled__ = {}; // Reset compiled data

  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }

  Object.keys(self.__schemas__).forEach(function (name) {
    var val = self.__schemas__[name];

    // skip disabled methods
    if (val === null) { return; }

    var compiled = { validate: null, link: null };

    self.__compiled__[name] = compiled;

    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }

      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }

      return;
    }

    if (isString(val)) {
      aliases.push(name);
      return;
    }

    schemaError(name, val);
  });

  //
  // Compile postponed aliases
  //

  aliases.forEach(function (alias) {
    if (!self.__compiled__[self.__schemas__[alias]]) {
      // Silently fail on missed schemas to avoid errons on disable.
      // schemaError(alias, self.__schemas__[alias]);
      return;
    }

    self.__compiled__[alias].validate =
      self.__compiled__[self.__schemas__[alias]].validate;
    self.__compiled__[alias].normalize =
      self.__compiled__[self.__schemas__[alias]].normalize;
  });

  //
  // Fake record for guessed links
  //
  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

  //
  // Build schema condition
  //
  var slist = Object.keys(self.__compiled__)
                      .filter(function(name) {
                        // Filter disabled & fake schemas
                        return name.length > 0 && self.__compiled__[name];
                      })
                      .map(escapeRE)
                      .join('|');
  // (?!_) cause 1.5x slowdown
  self.re.schema_test   = RegExp('(^|(?!_)(?:>|' + re.src_ZPCcCf + '))(' + slist + ')', 'i');
  self.re.schema_search = RegExp('(^|(?!_)(?:>|' + re.src_ZPCcCf + '))(' + slist + ')', 'ig');

  //
  // Cleanup
  //

  resetScanCache(self);
}

/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/
function Match(self, shift) {
  var start = self.__index__,
      end   = self.__last_index__,
      text  = self.__text_cache__.slice(start, end);

  /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/
  this.schema    = self.__schema__.toLowerCase();
  /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/
  this.index     = start + shift;
  /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/
  this.lastIndex = end + shift;
  /**
   * Match#raw -> String
   *
   * Matched string.
   **/
  this.raw       = text;
  /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/
  this.text      = text;
  /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/
  this.url       = text;
}

function createMatch(self, shift) {
  var match = new Match(self, shift);

  self.__compiled__[match.schema].normalize(match, self);

  return match;
}


/**
 * class LinkifyIt
 **/

/**
 * new LinkifyIt(schemas)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 **/
function LinkifyIt(schemas) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas);
  }

  // Cache last tested result. Used to skip repeating steps on next `match` call.
  this.__index__          = -1;
  this.__last_index__     = -1; // Next scan position
  this.__schema__         = '';
  this.__text_cache__     = '';

  this.__schemas__        = assign({}, defaultSchemas, schemas);
  this.__compiled__       = {};

  this.__tlds__           = tlds_default;
  this.__tlds_replaced__  = false;

  this.re = {};

  compile(this);
}


/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/
LinkifyIt.prototype.add = function add(schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this;
};


/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/
LinkifyIt.prototype.test = function test(text) {
  // Reset scan cache
  this.__text_cache__ = text;
  this.__index__      = -1;

  if (!text.length) { return false; }

  var m, ml, me, len, shift, next, re, tld_pos, at_pos;

  // try to scan for link with schema - that's the most simple rule
  if (this.re.schema_test.test(text)) {
    re = this.re.schema_search;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      len = this.testSchemaAt(text, m[2], re.lastIndex);
      if (len) {
        this.__schema__     = m[2];
        this.__index__      = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        break;
      }
    }
  }

  if (this.__compiled__['http:']) {
    // guess schemaless links
    tld_pos = text.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      // if tld is located after found link - no need to check fuzzy pattern
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text.match(this.re.link_fuzzy)) !== null) {

          shift = ml.index + ml[1].length;

          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__     = '';
            this.__index__      = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }

  if (this.__compiled__['mailto:']) {
    // guess schemaless emails
    at_pos = text.indexOf('@');
    if (at_pos >= 0) {
      // We can't skip this check, because this cases are possible:
      // 192.168.1.1@gmail.com, my.in@example.com
      if ((me = text.match(this.re.email_fuzzy)) !== null) {

        shift = me.index + me[1].length;
        next  = me.index + me[0].length;

        if (this.__index__ < 0 || shift < this.__index__ ||
            (shift === this.__index__ && next > this.__last_index__)) {
          this.__schema__     = 'mailto:';
          this.__index__      = shift;
          this.__last_index__ = next;
        }
      }
    }
  }

  return this.__index__ >= 0;
};


/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/
LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
  // If not supported schema check requested - terminate
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0;
  }
  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
};


/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/
LinkifyIt.prototype.match = function match(text) {
  var shift = 0, result = [];

  // Try to take previous element from cache, if .test() called before
  if (this.__index__ >= 0 && this.__text_cache__ === text) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }

  // Cut head if cache was used
  var tail = shift ? text.slice(shift) : text;

  // Scan string until end reached
  while (this.test(tail)) {
    result.push(createMatch(this, shift));

    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }

  if (result.length) {
    return result;
  }

  return null;
};


/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/
LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
  list = Array.isArray(list) ? list : [ list ];

  if (!keepOld) {
    this.__tlds__ = list.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this;
  }

  this.__tlds__ = this.__tlds__.concat(list)
                                  .sort()
                                  .filter(function(el, idx, arr) {
                                    return el !== arr[idx - 1];
                                  })
                                  .reverse();

  compile(this);
  return this;
};

/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/
LinkifyIt.prototype.normalize = function normalize(match) {

  // Do minimal possible changes by default. Need to collect feedback prior
  // to move forward https://github.com/markdown-it/linkify-it/issues/1

  if (!match.schema) { match.url = 'http://' + match.url; }

  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
    match.url = 'mailto:' + match.url;
  }
};


module.exports = LinkifyIt;

},{"./lib/re":25}],25:[function(require,module,exports){
'use strict';

// Use direct extract instead of `regenerate` to reduse browserified size
var src_Any = exports.src_Any = require('uc.micro/properties/Any/regex').source;
var src_Cc  = exports.src_Cc = require('uc.micro/categories/Cc/regex').source;
var src_Cf  = exports.src_Cf = require('uc.micro/categories/Cf/regex').source;
var src_Z   = exports.src_Z  = require('uc.micro/categories/Z/regex').source;
var src_P   = exports.src_P  = require('uc.micro/categories/P/regex').source;

// \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
var src_ZPCcCf = exports.src_ZPCcCf = [ src_Z, src_P, src_Cc, src_Cf ].join('|');

// All possible word characters (everything without punctuation, spaces & controls)
// Defined via punctuation & spaces to save space
// Should be something like \p{\L\N\S\M} (\w but without `_`)
var src_pseudo_letter       = '(?:(?!' + src_ZPCcCf + ')' + src_Any + ')';
// The same as abothe but without [0-9]
var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCcCf + ')' + src_Any + ')';

////////////////////////////////////////////////////////////////////////////////

var src_ip4 = exports.src_ip4 =

  '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

exports.src_auth    = '(?:(?:(?!' + src_Z + ').)+@)?';

var src_port = exports.src_port =

  '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

var src_host_terminator = exports.src_host_terminator =

  '(?=$|' + src_ZPCcCf + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + src_ZPCcCf + '))';

var src_path = exports.src_path =

  '(?:' +
    '[/?#]' +
      '(?:' +
        '(?!' + src_Z + '|[()[\\]{}.,"\'?!\\-]).|' +
        '\\[(?:(?!' + src_Z + '|\\]).)*\\]|' +
        '\\((?:(?!' + src_Z + '|[)]).)*\\)|' +
        '\\{(?:(?!' + src_Z + '|[}]).)*\\}|' +
        '\\"(?:(?!' + src_Z + '|["]).)+\\"|' +
        "\\'(?:(?!" + src_Z + "|[']).)+\\'|" +
        "\\'(?=" + src_pseudo_letter + ').|' +  // allow `I'm_king` if no pair found
        '\\.(?!' + src_Z + '|[.]).|' +
        '\\-(?!' + src_Z + '|--(?:[^-]|$))(?:[-]+|.)|' +  // `---` => long dash, terminate
        '\\,(?!' + src_Z + ').|' +      // allow `,,,` in paths
        '\\!(?!' + src_Z + '|[!]).|' +
        '\\?(?!' + src_Z + '|[?]).' +
      ')+' +
    '|\\/' +
  ')?';

var src_email_name = exports.src_email_name =

  '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

var src_xn = exports.src_xn =

  'xn--[a-z0-9\\-]{1,59}';

// More to read about domain names
// http://serverfault.com/questions/638260/

var src_domain_root = exports.src_domain_root =

  // Can't have digits and dashes
  '(?:' +
    src_xn +
    '|' +
    src_pseudo_letter_non_d + '{1,63}' +
  ')';

var src_domain = exports.src_domain =

  '(?:' +
    src_xn +
    '|' +
    '(?:' + src_pseudo_letter + ')' +
    '|' +
    // don't allow `--` in domain names, because:
    // - that can conflict with markdown &mdash; / &ndash;
    // - nobody use those anyway
    '(?:' + src_pseudo_letter + '(?:-(?!-)|' + src_pseudo_letter + '){0,61}' + src_pseudo_letter + ')' +
  ')';

var src_host = exports.src_host =

  '(?:' +
    src_ip4 +
  '|' +
    '(?:(?:(?:' + src_domain + ')\\.)*' + src_domain_root + ')' +
  ')';

var tpl_host_fuzzy = exports.tpl_host_fuzzy =

  '(?:' +
    src_ip4 +
  '|' +
    '(?:(?:(?:' + src_domain + ')\\.)+(?:%TLDS%))' +
  ')';

exports.src_host_strict =

  src_host + src_host_terminator;

var tpl_host_fuzzy_strict = exports.tpl_host_fuzzy_strict =

  tpl_host_fuzzy + src_host_terminator;

exports.src_host_port_strict =

  src_host + src_port + src_host_terminator;

var tpl_host_port_fuzzy_strict = exports.tpl_host_port_fuzzy_strict =

  tpl_host_fuzzy + src_port + src_host_terminator;

////////////////////////////////////////////////////////////////////////////////
// Main rules

// Rude test fuzzy links by host, for quick deny
exports.tpl_host_fuzzy_test =

  'localhost|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + src_ZPCcCf + '|$))';

exports.tpl_email_fuzzy =

    '(^|>|' + src_Z + ')(' + src_email_name + '@' + tpl_host_fuzzy_strict + ')';

exports.tpl_link_fuzzy =
    // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCcCf + '))' +
    '((?![$+<=>^`|])' + tpl_host_port_fuzzy_strict + src_path + ')';

},{"uc.micro/categories/Cc/regex":26,"uc.micro/categories/Cf/regex":27,"uc.micro/categories/P/regex":28,"uc.micro/categories/Z/regex":29,"uc.micro/properties/Any/regex":30}],26:[function(require,module,exports){
module.exports=/[\0-\x1F\x7F-\x9F]/
},{}],27:[function(require,module,exports){
module.exports=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/
},{}],28:[function(require,module,exports){
module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDE38-\uDE3D]|\uD805[\uDCC6\uDDC1-\uDDC9\uDE41-\uDE43]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F/
},{}],29:[function(require,module,exports){
module.exports=/[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/
},{}],30:[function(require,module,exports){
module.exports=/[\0-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF]/
},{}],31:[function(require,module,exports){
'use strict';


module.exports = require('./lib/');

},{"./lib/":41}],32:[function(require,module,exports){
// List of valid entities
//
// Generate with ./support/entities.js script
//
'use strict';

/*eslint quotes:0*/
module.exports = {
  "Aacute":"\u00C1",
  "aacute":"\u00E1",
  "Abreve":"\u0102",
  "abreve":"\u0103",
  "ac":"\u223E",
  "acd":"\u223F",
  "acE":"\u223E\u0333",
  "Acirc":"\u00C2",
  "acirc":"\u00E2",
  "acute":"\u00B4",
  "Acy":"\u0410",
  "acy":"\u0430",
  "AElig":"\u00C6",
  "aelig":"\u00E6",
  "af":"\u2061",
  "Afr":"\uD835\uDD04",
  "afr":"\uD835\uDD1E",
  "Agrave":"\u00C0",
  "agrave":"\u00E0",
  "alefsym":"\u2135",
  "aleph":"\u2135",
  "Alpha":"\u0391",
  "alpha":"\u03B1",
  "Amacr":"\u0100",
  "amacr":"\u0101",
  "amalg":"\u2A3F",
  "AMP":"\u0026",
  "amp":"\u0026",
  "And":"\u2A53",
  "and":"\u2227",
  "andand":"\u2A55",
  "andd":"\u2A5C",
  "andslope":"\u2A58",
  "andv":"\u2A5A",
  "ang":"\u2220",
  "ange":"\u29A4",
  "angle":"\u2220",
  "angmsd":"\u2221",
  "angmsdaa":"\u29A8",
  "angmsdab":"\u29A9",
  "angmsdac":"\u29AA",
  "angmsdad":"\u29AB",
  "angmsdae":"\u29AC",
  "angmsdaf":"\u29AD",
  "angmsdag":"\u29AE",
  "angmsdah":"\u29AF",
  "angrt":"\u221F",
  "angrtvb":"\u22BE",
  "angrtvbd":"\u299D",
  "angsph":"\u2222",
  "angst":"\u00C5",
  "angzarr":"\u237C",
  "Aogon":"\u0104",
  "aogon":"\u0105",
  "Aopf":"\uD835\uDD38",
  "aopf":"\uD835\uDD52",
  "ap":"\u2248",
  "apacir":"\u2A6F",
  "apE":"\u2A70",
  "ape":"\u224A",
  "apid":"\u224B",
  "apos":"\u0027",
  "ApplyFunction":"\u2061",
  "approx":"\u2248",
  "approxeq":"\u224A",
  "Aring":"\u00C5",
  "aring":"\u00E5",
  "Ascr":"\uD835\uDC9C",
  "ascr":"\uD835\uDCB6",
  "Assign":"\u2254",
  "ast":"\u002A",
  "asymp":"\u2248",
  "asympeq":"\u224D",
  "Atilde":"\u00C3",
  "atilde":"\u00E3",
  "Auml":"\u00C4",
  "auml":"\u00E4",
  "awconint":"\u2233",
  "awint":"\u2A11",
  "backcong":"\u224C",
  "backepsilon":"\u03F6",
  "backprime":"\u2035",
  "backsim":"\u223D",
  "backsimeq":"\u22CD",
  "Backslash":"\u2216",
  "Barv":"\u2AE7",
  "barvee":"\u22BD",
  "Barwed":"\u2306",
  "barwed":"\u2305",
  "barwedge":"\u2305",
  "bbrk":"\u23B5",
  "bbrktbrk":"\u23B6",
  "bcong":"\u224C",
  "Bcy":"\u0411",
  "bcy":"\u0431",
  "bdquo":"\u201E",
  "becaus":"\u2235",
  "Because":"\u2235",
  "because":"\u2235",
  "bemptyv":"\u29B0",
  "bepsi":"\u03F6",
  "bernou":"\u212C",
  "Bernoullis":"\u212C",
  "Beta":"\u0392",
  "beta":"\u03B2",
  "beth":"\u2136",
  "between":"\u226C",
  "Bfr":"\uD835\uDD05",
  "bfr":"\uD835\uDD1F",
  "bigcap":"\u22C2",
  "bigcirc":"\u25EF",
  "bigcup":"\u22C3",
  "bigodot":"\u2A00",
  "bigoplus":"\u2A01",
  "bigotimes":"\u2A02",
  "bigsqcup":"\u2A06",
  "bigstar":"\u2605",
  "bigtriangledown":"\u25BD",
  "bigtriangleup":"\u25B3",
  "biguplus":"\u2A04",
  "bigvee":"\u22C1",
  "bigwedge":"\u22C0",
  "bkarow":"\u290D",
  "blacklozenge":"\u29EB",
  "blacksquare":"\u25AA",
  "blacktriangle":"\u25B4",
  "blacktriangledown":"\u25BE",
  "blacktriangleleft":"\u25C2",
  "blacktriangleright":"\u25B8",
  "blank":"\u2423",
  "blk12":"\u2592",
  "blk14":"\u2591",
  "blk34":"\u2593",
  "block":"\u2588",
  "bne":"\u003D\u20E5",
  "bnequiv":"\u2261\u20E5",
  "bNot":"\u2AED",
  "bnot":"\u2310",
  "Bopf":"\uD835\uDD39",
  "bopf":"\uD835\uDD53",
  "bot":"\u22A5",
  "bottom":"\u22A5",
  "bowtie":"\u22C8",
  "boxbox":"\u29C9",
  "boxDL":"\u2557",
  "boxDl":"\u2556",
  "boxdL":"\u2555",
  "boxdl":"\u2510",
  "boxDR":"\u2554",
  "boxDr":"\u2553",
  "boxdR":"\u2552",
  "boxdr":"\u250C",
  "boxH":"\u2550",
  "boxh":"\u2500",
  "boxHD":"\u2566",
  "boxHd":"\u2564",
  "boxhD":"\u2565",
  "boxhd":"\u252C",
  "boxHU":"\u2569",
  "boxHu":"\u2567",
  "boxhU":"\u2568",
  "boxhu":"\u2534",
  "boxminus":"\u229F",
  "boxplus":"\u229E",
  "boxtimes":"\u22A0",
  "boxUL":"\u255D",
  "boxUl":"\u255C",
  "boxuL":"\u255B",
  "boxul":"\u2518",
  "boxUR":"\u255A",
  "boxUr":"\u2559",
  "boxuR":"\u2558",
  "boxur":"\u2514",
  "boxV":"\u2551",
  "boxv":"\u2502",
  "boxVH":"\u256C",
  "boxVh":"\u256B",
  "boxvH":"\u256A",
  "boxvh":"\u253C",
  "boxVL":"\u2563",
  "boxVl":"\u2562",
  "boxvL":"\u2561",
  "boxvl":"\u2524",
  "boxVR":"\u2560",
  "boxVr":"\u255F",
  "boxvR":"\u255E",
  "boxvr":"\u251C",
  "bprime":"\u2035",
  "Breve":"\u02D8",
  "breve":"\u02D8",
  "brvbar":"\u00A6",
  "Bscr":"\u212C",
  "bscr":"\uD835\uDCB7",
  "bsemi":"\u204F",
  "bsim":"\u223D",
  "bsime":"\u22CD",
  "bsol":"\u005C",
  "bsolb":"\u29C5",
  "bsolhsub":"\u27C8",
  "bull":"\u2022",
  "bullet":"\u2022",
  "bump":"\u224E",
  "bumpE":"\u2AAE",
  "bumpe":"\u224F",
  "Bumpeq":"\u224E",
  "bumpeq":"\u224F",
  "Cacute":"\u0106",
  "cacute":"\u0107",
  "Cap":"\u22D2",
  "cap":"\u2229",
  "capand":"\u2A44",
  "capbrcup":"\u2A49",
  "capcap":"\u2A4B",
  "capcup":"\u2A47",
  "capdot":"\u2A40",
  "CapitalDifferentialD":"\u2145",
  "caps":"\u2229\uFE00",
  "caret":"\u2041",
  "caron":"\u02C7",
  "Cayleys":"\u212D",
  "ccaps":"\u2A4D",
  "Ccaron":"\u010C",
  "ccaron":"\u010D",
  "Ccedil":"\u00C7",
  "ccedil":"\u00E7",
  "Ccirc":"\u0108",
  "ccirc":"\u0109",
  "Cconint":"\u2230",
  "ccups":"\u2A4C",
  "ccupssm":"\u2A50",
  "Cdot":"\u010A",
  "cdot":"\u010B",
  "cedil":"\u00B8",
  "Cedilla":"\u00B8",
  "cemptyv":"\u29B2",
  "cent":"\u00A2",
  "CenterDot":"\u00B7",
  "centerdot":"\u00B7",
  "Cfr":"\u212D",
  "cfr":"\uD835\uDD20",
  "CHcy":"\u0427",
  "chcy":"\u0447",
  "check":"\u2713",
  "checkmark":"\u2713",
  "Chi":"\u03A7",
  "chi":"\u03C7",
  "cir":"\u25CB",
  "circ":"\u02C6",
  "circeq":"\u2257",
  "circlearrowleft":"\u21BA",
  "circlearrowright":"\u21BB",
  "circledast":"\u229B",
  "circledcirc":"\u229A",
  "circleddash":"\u229D",
  "CircleDot":"\u2299",
  "circledR":"\u00AE",
  "circledS":"\u24C8",
  "CircleMinus":"\u2296",
  "CirclePlus":"\u2295",
  "CircleTimes":"\u2297",
  "cirE":"\u29C3",
  "cire":"\u2257",
  "cirfnint":"\u2A10",
  "cirmid":"\u2AEF",
  "cirscir":"\u29C2",
  "ClockwiseContourIntegral":"\u2232",
  "CloseCurlyDoubleQuote":"\u201D",
  "CloseCurlyQuote":"\u2019",
  "clubs":"\u2663",
  "clubsuit":"\u2663",
  "Colon":"\u2237",
  "colon":"\u003A",
  "Colone":"\u2A74",
  "colone":"\u2254",
  "coloneq":"\u2254",
  "comma":"\u002C",
  "commat":"\u0040",
  "comp":"\u2201",
  "compfn":"\u2218",
  "complement":"\u2201",
  "complexes":"\u2102",
  "cong":"\u2245",
  "congdot":"\u2A6D",
  "Congruent":"\u2261",
  "Conint":"\u222F",
  "conint":"\u222E",
  "ContourIntegral":"\u222E",
  "Copf":"\u2102",
  "copf":"\uD835\uDD54",
  "coprod":"\u2210",
  "Coproduct":"\u2210",
  "COPY":"\u00A9",
  "copy":"\u00A9",
  "copysr":"\u2117",
  "CounterClockwiseContourIntegral":"\u2233",
  "crarr":"\u21B5",
  "Cross":"\u2A2F",
  "cross":"\u2717",
  "Cscr":"\uD835\uDC9E",
  "cscr":"\uD835\uDCB8",
  "csub":"\u2ACF",
  "csube":"\u2AD1",
  "csup":"\u2AD0",
  "csupe":"\u2AD2",
  "ctdot":"\u22EF",
  "cudarrl":"\u2938",
  "cudarrr":"\u2935",
  "cuepr":"\u22DE",
  "cuesc":"\u22DF",
  "cularr":"\u21B6",
  "cularrp":"\u293D",
  "Cup":"\u22D3",
  "cup":"\u222A",
  "cupbrcap":"\u2A48",
  "CupCap":"\u224D",
  "cupcap":"\u2A46",
  "cupcup":"\u2A4A",
  "cupdot":"\u228D",
  "cupor":"\u2A45",
  "cups":"\u222A\uFE00",
  "curarr":"\u21B7",
  "curarrm":"\u293C",
  "curlyeqprec":"\u22DE",
  "curlyeqsucc":"\u22DF",
  "curlyvee":"\u22CE",
  "curlywedge":"\u22CF",
  "curren":"\u00A4",
  "curvearrowleft":"\u21B6",
  "curvearrowright":"\u21B7",
  "cuvee":"\u22CE",
  "cuwed":"\u22CF",
  "cwconint":"\u2232",
  "cwint":"\u2231",
  "cylcty":"\u232D",
  "Dagger":"\u2021",
  "dagger":"\u2020",
  "daleth":"\u2138",
  "Darr":"\u21A1",
  "dArr":"\u21D3",
  "darr":"\u2193",
  "dash":"\u2010",
  "Dashv":"\u2AE4",
  "dashv":"\u22A3",
  "dbkarow":"\u290F",
  "dblac":"\u02DD",
  "Dcaron":"\u010E",
  "dcaron":"\u010F",
  "Dcy":"\u0414",
  "dcy":"\u0434",
  "DD":"\u2145",
  "dd":"\u2146",
  "ddagger":"\u2021",
  "ddarr":"\u21CA",
  "DDotrahd":"\u2911",
  "ddotseq":"\u2A77",
  "deg":"\u00B0",
  "Del":"\u2207",
  "Delta":"\u0394",
  "delta":"\u03B4",
  "demptyv":"\u29B1",
  "dfisht":"\u297F",
  "Dfr":"\uD835\uDD07",
  "dfr":"\uD835\uDD21",
  "dHar":"\u2965",
  "dharl":"\u21C3",
  "dharr":"\u21C2",
  "DiacriticalAcute":"\u00B4",
  "DiacriticalDot":"\u02D9",
  "DiacriticalDoubleAcute":"\u02DD",
  "DiacriticalGrave":"\u0060",
  "DiacriticalTilde":"\u02DC",
  "diam":"\u22C4",
  "Diamond":"\u22C4",
  "diamond":"\u22C4",
  "diamondsuit":"\u2666",
  "diams":"\u2666",
  "die":"\u00A8",
  "DifferentialD":"\u2146",
  "digamma":"\u03DD",
  "disin":"\u22F2",
  "div":"\u00F7",
  "divide":"\u00F7",
  "divideontimes":"\u22C7",
  "divonx":"\u22C7",
  "DJcy":"\u0402",
  "djcy":"\u0452",
  "dlcorn":"\u231E",
  "dlcrop":"\u230D",
  "dollar":"\u0024",
  "Dopf":"\uD835\uDD3B",
  "dopf":"\uD835\uDD55",
  "Dot":"\u00A8",
  "dot":"\u02D9",
  "DotDot":"\u20DC",
  "doteq":"\u2250",
  "doteqdot":"\u2251",
  "DotEqual":"\u2250",
  "dotminus":"\u2238",
  "dotplus":"\u2214",
  "dotsquare":"\u22A1",
  "doublebarwedge":"\u2306",
  "DoubleContourIntegral":"\u222F",
  "DoubleDot":"\u00A8",
  "DoubleDownArrow":"\u21D3",
  "DoubleLeftArrow":"\u21D0",
  "DoubleLeftRightArrow":"\u21D4",
  "DoubleLeftTee":"\u2AE4",
  "DoubleLongLeftArrow":"\u27F8",
  "DoubleLongLeftRightArrow":"\u27FA",
  "DoubleLongRightArrow":"\u27F9",
  "DoubleRightArrow":"\u21D2",
  "DoubleRightTee":"\u22A8",
  "DoubleUpArrow":"\u21D1",
  "DoubleUpDownArrow":"\u21D5",
  "DoubleVerticalBar":"\u2225",
  "DownArrow":"\u2193",
  "Downarrow":"\u21D3",
  "downarrow":"\u2193",
  "DownArrowBar":"\u2913",
  "DownArrowUpArrow":"\u21F5",
  "DownBreve":"\u0311",
  "downdownarrows":"\u21CA",
  "downharpoonleft":"\u21C3",
  "downharpoonright":"\u21C2",
  "DownLeftRightVector":"\u2950",
  "DownLeftTeeVector":"\u295E",
  "DownLeftVector":"\u21BD",
  "DownLeftVectorBar":"\u2956",
  "DownRightTeeVector":"\u295F",
  "DownRightVector":"\u21C1",
  "DownRightVectorBar":"\u2957",
  "DownTee":"\u22A4",
  "DownTeeArrow":"\u21A7",
  "drbkarow":"\u2910",
  "drcorn":"\u231F",
  "drcrop":"\u230C",
  "Dscr":"\uD835\uDC9F",
  "dscr":"\uD835\uDCB9",
  "DScy":"\u0405",
  "dscy":"\u0455",
  "dsol":"\u29F6",
  "Dstrok":"\u0110",
  "dstrok":"\u0111",
  "dtdot":"\u22F1",
  "dtri":"\u25BF",
  "dtrif":"\u25BE",
  "duarr":"\u21F5",
  "duhar":"\u296F",
  "dwangle":"\u29A6",
  "DZcy":"\u040F",
  "dzcy":"\u045F",
  "dzigrarr":"\u27FF",
  "Eacute":"\u00C9",
  "eacute":"\u00E9",
  "easter":"\u2A6E",
  "Ecaron":"\u011A",
  "ecaron":"\u011B",
  "ecir":"\u2256",
  "Ecirc":"\u00CA",
  "ecirc":"\u00EA",
  "ecolon":"\u2255",
  "Ecy":"\u042D",
  "ecy":"\u044D",
  "eDDot":"\u2A77",
  "Edot":"\u0116",
  "eDot":"\u2251",
  "edot":"\u0117",
  "ee":"\u2147",
  "efDot":"\u2252",
  "Efr":"\uD835\uDD08",
  "efr":"\uD835\uDD22",
  "eg":"\u2A9A",
  "Egrave":"\u00C8",
  "egrave":"\u00E8",
  "egs":"\u2A96",
  "egsdot":"\u2A98",
  "el":"\u2A99",
  "Element":"\u2208",
  "elinters":"\u23E7",
  "ell":"\u2113",
  "els":"\u2A95",
  "elsdot":"\u2A97",
  "Emacr":"\u0112",
  "emacr":"\u0113",
  "empty":"\u2205",
  "emptyset":"\u2205",
  "EmptySmallSquare":"\u25FB",
  "emptyv":"\u2205",
  "EmptyVerySmallSquare":"\u25AB",
  "emsp":"\u2003",
  "emsp13":"\u2004",
  "emsp14":"\u2005",
  "ENG":"\u014A",
  "eng":"\u014B",
  "ensp":"\u2002",
  "Eogon":"\u0118",
  "eogon":"\u0119",
  "Eopf":"\uD835\uDD3C",
  "eopf":"\uD835\uDD56",
  "epar":"\u22D5",
  "eparsl":"\u29E3",
  "eplus":"\u2A71",
  "epsi":"\u03B5",
  "Epsilon":"\u0395",
  "epsilon":"\u03B5",
  "epsiv":"\u03F5",
  "eqcirc":"\u2256",
  "eqcolon":"\u2255",
  "eqsim":"\u2242",
  "eqslantgtr":"\u2A96",
  "eqslantless":"\u2A95",
  "Equal":"\u2A75",
  "equals":"\u003D",
  "EqualTilde":"\u2242",
  "equest":"\u225F",
  "Equilibrium":"\u21CC",
  "equiv":"\u2261",
  "equivDD":"\u2A78",
  "eqvparsl":"\u29E5",
  "erarr":"\u2971",
  "erDot":"\u2253",
  "Escr":"\u2130",
  "escr":"\u212F",
  "esdot":"\u2250",
  "Esim":"\u2A73",
  "esim":"\u2242",
  "Eta":"\u0397",
  "eta":"\u03B7",
  "ETH":"\u00D0",
  "eth":"\u00F0",
  "Euml":"\u00CB",
  "euml":"\u00EB",
  "euro":"\u20AC",
  "excl":"\u0021",
  "exist":"\u2203",
  "Exists":"\u2203",
  "expectation":"\u2130",
  "ExponentialE":"\u2147",
  "exponentiale":"\u2147",
  "fallingdotseq":"\u2252",
  "Fcy":"\u0424",
  "fcy":"\u0444",
  "female":"\u2640",
  "ffilig":"\uFB03",
  "fflig":"\uFB00",
  "ffllig":"\uFB04",
  "Ffr":"\uD835\uDD09",
  "ffr":"\uD835\uDD23",
  "filig":"\uFB01",
  "FilledSmallSquare":"\u25FC",
  "FilledVerySmallSquare":"\u25AA",
  "fjlig":"\u0066\u006A",
  "flat":"\u266D",
  "fllig":"\uFB02",
  "fltns":"\u25B1",
  "fnof":"\u0192",
  "Fopf":"\uD835\uDD3D",
  "fopf":"\uD835\uDD57",
  "ForAll":"\u2200",
  "forall":"\u2200",
  "fork":"\u22D4",
  "forkv":"\u2AD9",
  "Fouriertrf":"\u2131",
  "fpartint":"\u2A0D",
  "frac12":"\u00BD",
  "frac13":"\u2153",
  "frac14":"\u00BC",
  "frac15":"\u2155",
  "frac16":"\u2159",
  "frac18":"\u215B",
  "frac23":"\u2154",
  "frac25":"\u2156",
  "frac34":"\u00BE",
  "frac35":"\u2157",
  "frac38":"\u215C",
  "frac45":"\u2158",
  "frac56":"\u215A",
  "frac58":"\u215D",
  "frac78":"\u215E",
  "frasl":"\u2044",
  "frown":"\u2322",
  "Fscr":"\u2131",
  "fscr":"\uD835\uDCBB",
  "gacute":"\u01F5",
  "Gamma":"\u0393",
  "gamma":"\u03B3",
  "Gammad":"\u03DC",
  "gammad":"\u03DD",
  "gap":"\u2A86",
  "Gbreve":"\u011E",
  "gbreve":"\u011F",
  "Gcedil":"\u0122",
  "Gcirc":"\u011C",
  "gcirc":"\u011D",
  "Gcy":"\u0413",
  "gcy":"\u0433",
  "Gdot":"\u0120",
  "gdot":"\u0121",
  "gE":"\u2267",
  "ge":"\u2265",
  "gEl":"\u2A8C",
  "gel":"\u22DB",
  "geq":"\u2265",
  "geqq":"\u2267",
  "geqslant":"\u2A7E",
  "ges":"\u2A7E",
  "gescc":"\u2AA9",
  "gesdot":"\u2A80",
  "gesdoto":"\u2A82",
  "gesdotol":"\u2A84",
  "gesl":"\u22DB\uFE00",
  "gesles":"\u2A94",
  "Gfr":"\uD835\uDD0A",
  "gfr":"\uD835\uDD24",
  "Gg":"\u22D9",
  "gg":"\u226B",
  "ggg":"\u22D9",
  "gimel":"\u2137",
  "GJcy":"\u0403",
  "gjcy":"\u0453",
  "gl":"\u2277",
  "gla":"\u2AA5",
  "glE":"\u2A92",
  "glj":"\u2AA4",
  "gnap":"\u2A8A",
  "gnapprox":"\u2A8A",
  "gnE":"\u2269",
  "gne":"\u2A88",
  "gneq":"\u2A88",
  "gneqq":"\u2269",
  "gnsim":"\u22E7",
  "Gopf":"\uD835\uDD3E",
  "gopf":"\uD835\uDD58",
  "grave":"\u0060",
  "GreaterEqual":"\u2265",
  "GreaterEqualLess":"\u22DB",
  "GreaterFullEqual":"\u2267",
  "GreaterGreater":"\u2AA2",
  "GreaterLess":"\u2277",
  "GreaterSlantEqual":"\u2A7E",
  "GreaterTilde":"\u2273",
  "Gscr":"\uD835\uDCA2",
  "gscr":"\u210A",
  "gsim":"\u2273",
  "gsime":"\u2A8E",
  "gsiml":"\u2A90",
  "GT":"\u003E",
  "Gt":"\u226B",
  "gt":"\u003E",
  "gtcc":"\u2AA7",
  "gtcir":"\u2A7A",
  "gtdot":"\u22D7",
  "gtlPar":"\u2995",
  "gtquest":"\u2A7C",
  "gtrapprox":"\u2A86",
  "gtrarr":"\u2978",
  "gtrdot":"\u22D7",
  "gtreqless":"\u22DB",
  "gtreqqless":"\u2A8C",
  "gtrless":"\u2277",
  "gtrsim":"\u2273",
  "gvertneqq":"\u2269\uFE00",
  "gvnE":"\u2269\uFE00",
  "Hacek":"\u02C7",
  "hairsp":"\u200A",
  "half":"\u00BD",
  "hamilt":"\u210B",
  "HARDcy":"\u042A",
  "hardcy":"\u044A",
  "hArr":"\u21D4",
  "harr":"\u2194",
  "harrcir":"\u2948",
  "harrw":"\u21AD",
  "Hat":"\u005E",
  "hbar":"\u210F",
  "Hcirc":"\u0124",
  "hcirc":"\u0125",
  "hearts":"\u2665",
  "heartsuit":"\u2665",
  "hellip":"\u2026",
  "hercon":"\u22B9",
  "Hfr":"\u210C",
  "hfr":"\uD835\uDD25",
  "HilbertSpace":"\u210B",
  "hksearow":"\u2925",
  "hkswarow":"\u2926",
  "hoarr":"\u21FF",
  "homtht":"\u223B",
  "hookleftarrow":"\u21A9",
  "hookrightarrow":"\u21AA",
  "Hopf":"\u210D",
  "hopf":"\uD835\uDD59",
  "horbar":"\u2015",
  "HorizontalLine":"\u2500",
  "Hscr":"\u210B",
  "hscr":"\uD835\uDCBD",
  "hslash":"\u210F",
  "Hstrok":"\u0126",
  "hstrok":"\u0127",
  "HumpDownHump":"\u224E",
  "HumpEqual":"\u224F",
  "hybull":"\u2043",
  "hyphen":"\u2010",
  "Iacute":"\u00CD",
  "iacute":"\u00ED",
  "ic":"\u2063",
  "Icirc":"\u00CE",
  "icirc":"\u00EE",
  "Icy":"\u0418",
  "icy":"\u0438",
  "Idot":"\u0130",
  "IEcy":"\u0415",
  "iecy":"\u0435",
  "iexcl":"\u00A1",
  "iff":"\u21D4",
  "Ifr":"\u2111",
  "ifr":"\uD835\uDD26",
  "Igrave":"\u00CC",
  "igrave":"\u00EC",
  "ii":"\u2148",
  "iiiint":"\u2A0C",
  "iiint":"\u222D",
  "iinfin":"\u29DC",
  "iiota":"\u2129",
  "IJlig":"\u0132",
  "ijlig":"\u0133",
  "Im":"\u2111",
  "Imacr":"\u012A",
  "imacr":"\u012B",
  "image":"\u2111",
  "ImaginaryI":"\u2148",
  "imagline":"\u2110",
  "imagpart":"\u2111",
  "imath":"\u0131",
  "imof":"\u22B7",
  "imped":"\u01B5",
  "Implies":"\u21D2",
  "in":"\u2208",
  "incare":"\u2105",
  "infin":"\u221E",
  "infintie":"\u29DD",
  "inodot":"\u0131",
  "Int":"\u222C",
  "int":"\u222B",
  "intcal":"\u22BA",
  "integers":"\u2124",
  "Integral":"\u222B",
  "intercal":"\u22BA",
  "Intersection":"\u22C2",
  "intlarhk":"\u2A17",
  "intprod":"\u2A3C",
  "InvisibleComma":"\u2063",
  "InvisibleTimes":"\u2062",
  "IOcy":"\u0401",
  "iocy":"\u0451",
  "Iogon":"\u012E",
  "iogon":"\u012F",
  "Iopf":"\uD835\uDD40",
  "iopf":"\uD835\uDD5A",
  "Iota":"\u0399",
  "iota":"\u03B9",
  "iprod":"\u2A3C",
  "iquest":"\u00BF",
  "Iscr":"\u2110",
  "iscr":"\uD835\uDCBE",
  "isin":"\u2208",
  "isindot":"\u22F5",
  "isinE":"\u22F9",
  "isins":"\u22F4",
  "isinsv":"\u22F3",
  "isinv":"\u2208",
  "it":"\u2062",
  "Itilde":"\u0128",
  "itilde":"\u0129",
  "Iukcy":"\u0406",
  "iukcy":"\u0456",
  "Iuml":"\u00CF",
  "iuml":"\u00EF",
  "Jcirc":"\u0134",
  "jcirc":"\u0135",
  "Jcy":"\u0419",
  "jcy":"\u0439",
  "Jfr":"\uD835\uDD0D",
  "jfr":"\uD835\uDD27",
  "jmath":"\u0237",
  "Jopf":"\uD835\uDD41",
  "jopf":"\uD835\uDD5B",
  "Jscr":"\uD835\uDCA5",
  "jscr":"\uD835\uDCBF",
  "Jsercy":"\u0408",
  "jsercy":"\u0458",
  "Jukcy":"\u0404",
  "jukcy":"\u0454",
  "Kappa":"\u039A",
  "kappa":"\u03BA",
  "kappav":"\u03F0",
  "Kcedil":"\u0136",
  "kcedil":"\u0137",
  "Kcy":"\u041A",
  "kcy":"\u043A",
  "Kfr":"\uD835\uDD0E",
  "kfr":"\uD835\uDD28",
  "kgreen":"\u0138",
  "KHcy":"\u0425",
  "khcy":"\u0445",
  "KJcy":"\u040C",
  "kjcy":"\u045C",
  "Kopf":"\uD835\uDD42",
  "kopf":"\uD835\uDD5C",
  "Kscr":"\uD835\uDCA6",
  "kscr":"\uD835\uDCC0",
  "lAarr":"\u21DA",
  "Lacute":"\u0139",
  "lacute":"\u013A",
  "laemptyv":"\u29B4",
  "lagran":"\u2112",
  "Lambda":"\u039B",
  "lambda":"\u03BB",
  "Lang":"\u27EA",
  "lang":"\u27E8",
  "langd":"\u2991",
  "langle":"\u27E8",
  "lap":"\u2A85",
  "Laplacetrf":"\u2112",
  "laquo":"\u00AB",
  "Larr":"\u219E",
  "lArr":"\u21D0",
  "larr":"\u2190",
  "larrb":"\u21E4",
  "larrbfs":"\u291F",
  "larrfs":"\u291D",
  "larrhk":"\u21A9",
  "larrlp":"\u21AB",
  "larrpl":"\u2939",
  "larrsim":"\u2973",
  "larrtl":"\u21A2",
  "lat":"\u2AAB",
  "lAtail":"\u291B",
  "latail":"\u2919",
  "late":"\u2AAD",
  "lates":"\u2AAD\uFE00",
  "lBarr":"\u290E",
  "lbarr":"\u290C",
  "lbbrk":"\u2772",
  "lbrace":"\u007B",
  "lbrack":"\u005B",
  "lbrke":"\u298B",
  "lbrksld":"\u298F",
  "lbrkslu":"\u298D",
  "Lcaron":"\u013D",
  "lcaron":"\u013E",
  "Lcedil":"\u013B",
  "lcedil":"\u013C",
  "lceil":"\u2308",
  "lcub":"\u007B",
  "Lcy":"\u041B",
  "lcy":"\u043B",
  "ldca":"\u2936",
  "ldquo":"\u201C",
  "ldquor":"\u201E",
  "ldrdhar":"\u2967",
  "ldrushar":"\u294B",
  "ldsh":"\u21B2",
  "lE":"\u2266",
  "le":"\u2264",
  "LeftAngleBracket":"\u27E8",
  "LeftArrow":"\u2190",
  "Leftarrow":"\u21D0",
  "leftarrow":"\u2190",
  "LeftArrowBar":"\u21E4",
  "LeftArrowRightArrow":"\u21C6",
  "leftarrowtail":"\u21A2",
  "LeftCeiling":"\u2308",
  "LeftDoubleBracket":"\u27E6",
  "LeftDownTeeVector":"\u2961",
  "LeftDownVector":"\u21C3",
  "LeftDownVectorBar":"\u2959",
  "LeftFloor":"\u230A",
  "leftharpoondown":"\u21BD",
  "leftharpoonup":"\u21BC",
  "leftleftarrows":"\u21C7",
  "LeftRightArrow":"\u2194",
  "Leftrightarrow":"\u21D4",
  "leftrightarrow":"\u2194",
  "leftrightarrows":"\u21C6",
  "leftrightharpoons":"\u21CB",
  "leftrightsquigarrow":"\u21AD",
  "LeftRightVector":"\u294E",
  "LeftTee":"\u22A3",
  "LeftTeeArrow":"\u21A4",
  "LeftTeeVector":"\u295A",
  "leftthreetimes":"\u22CB",
  "LeftTriangle":"\u22B2",
  "LeftTriangleBar":"\u29CF",
  "LeftTriangleEqual":"\u22B4",
  "LeftUpDownVector":"\u2951",
  "LeftUpTeeVector":"\u2960",
  "LeftUpVector":"\u21BF",
  "LeftUpVectorBar":"\u2958",
  "LeftVector":"\u21BC",
  "LeftVectorBar":"\u2952",
  "lEg":"\u2A8B",
  "leg":"\u22DA",
  "leq":"\u2264",
  "leqq":"\u2266",
  "leqslant":"\u2A7D",
  "les":"\u2A7D",
  "lescc":"\u2AA8",
  "lesdot":"\u2A7F",
  "lesdoto":"\u2A81",
  "lesdotor":"\u2A83",
  "lesg":"\u22DA\uFE00",
  "lesges":"\u2A93",
  "lessapprox":"\u2A85",
  "lessdot":"\u22D6",
  "lesseqgtr":"\u22DA",
  "lesseqqgtr":"\u2A8B",
  "LessEqualGreater":"\u22DA",
  "LessFullEqual":"\u2266",
  "LessGreater":"\u2276",
  "lessgtr":"\u2276",
  "LessLess":"\u2AA1",
  "lesssim":"\u2272",
  "LessSlantEqual":"\u2A7D",
  "LessTilde":"\u2272",
  "lfisht":"\u297C",
  "lfloor":"\u230A",
  "Lfr":"\uD835\uDD0F",
  "lfr":"\uD835\uDD29",
  "lg":"\u2276",
  "lgE":"\u2A91",
  "lHar":"\u2962",
  "lhard":"\u21BD",
  "lharu":"\u21BC",
  "lharul":"\u296A",
  "lhblk":"\u2584",
  "LJcy":"\u0409",
  "ljcy":"\u0459",
  "Ll":"\u22D8",
  "ll":"\u226A",
  "llarr":"\u21C7",
  "llcorner":"\u231E",
  "Lleftarrow":"\u21DA",
  "llhard":"\u296B",
  "lltri":"\u25FA",
  "Lmidot":"\u013F",
  "lmidot":"\u0140",
  "lmoust":"\u23B0",
  "lmoustache":"\u23B0",
  "lnap":"\u2A89",
  "lnapprox":"\u2A89",
  "lnE":"\u2268",
  "lne":"\u2A87",
  "lneq":"\u2A87",
  "lneqq":"\u2268",
  "lnsim":"\u22E6",
  "loang":"\u27EC",
  "loarr":"\u21FD",
  "lobrk":"\u27E6",
  "LongLeftArrow":"\u27F5",
  "Longleftarrow":"\u27F8",
  "longleftarrow":"\u27F5",
  "LongLeftRightArrow":"\u27F7",
  "Longleftrightarrow":"\u27FA",
  "longleftrightarrow":"\u27F7",
  "longmapsto":"\u27FC",
  "LongRightArrow":"\u27F6",
  "Longrightarrow":"\u27F9",
  "longrightarrow":"\u27F6",
  "looparrowleft":"\u21AB",
  "looparrowright":"\u21AC",
  "lopar":"\u2985",
  "Lopf":"\uD835\uDD43",
  "lopf":"\uD835\uDD5D",
  "loplus":"\u2A2D",
  "lotimes":"\u2A34",
  "lowast":"\u2217",
  "lowbar":"\u005F",
  "LowerLeftArrow":"\u2199",
  "LowerRightArrow":"\u2198",
  "loz":"\u25CA",
  "lozenge":"\u25CA",
  "lozf":"\u29EB",
  "lpar":"\u0028",
  "lparlt":"\u2993",
  "lrarr":"\u21C6",
  "lrcorner":"\u231F",
  "lrhar":"\u21CB",
  "lrhard":"\u296D",
  "lrm":"\u200E",
  "lrtri":"\u22BF",
  "lsaquo":"\u2039",
  "Lscr":"\u2112",
  "lscr":"\uD835\uDCC1",
  "Lsh":"\u21B0",
  "lsh":"\u21B0",
  "lsim":"\u2272",
  "lsime":"\u2A8D",
  "lsimg":"\u2A8F",
  "lsqb":"\u005B",
  "lsquo":"\u2018",
  "lsquor":"\u201A",
  "Lstrok":"\u0141",
  "lstrok":"\u0142",
  "LT":"\u003C",
  "Lt":"\u226A",
  "lt":"\u003C",
  "ltcc":"\u2AA6",
  "ltcir":"\u2A79",
  "ltdot":"\u22D6",
  "lthree":"\u22CB",
  "ltimes":"\u22C9",
  "ltlarr":"\u2976",
  "ltquest":"\u2A7B",
  "ltri":"\u25C3",
  "ltrie":"\u22B4",
  "ltrif":"\u25C2",
  "ltrPar":"\u2996",
  "lurdshar":"\u294A",
  "luruhar":"\u2966",
  "lvertneqq":"\u2268\uFE00",
  "lvnE":"\u2268\uFE00",
  "macr":"\u00AF",
  "male":"\u2642",
  "malt":"\u2720",
  "maltese":"\u2720",
  "Map":"\u2905",
  "map":"\u21A6",
  "mapsto":"\u21A6",
  "mapstodown":"\u21A7",
  "mapstoleft":"\u21A4",
  "mapstoup":"\u21A5",
  "marker":"\u25AE",
  "mcomma":"\u2A29",
  "Mcy":"\u041C",
  "mcy":"\u043C",
  "mdash":"\u2014",
  "mDDot":"\u223A",
  "measuredangle":"\u2221",
  "MediumSpace":"\u205F",
  "Mellintrf":"\u2133",
  "Mfr":"\uD835\uDD10",
  "mfr":"\uD835\uDD2A",
  "mho":"\u2127",
  "micro":"\u00B5",
  "mid":"\u2223",
  "midast":"\u002A",
  "midcir":"\u2AF0",
  "middot":"\u00B7",
  "minus":"\u2212",
  "minusb":"\u229F",
  "minusd":"\u2238",
  "minusdu":"\u2A2A",
  "MinusPlus":"\u2213",
  "mlcp":"\u2ADB",
  "mldr":"\u2026",
  "mnplus":"\u2213",
  "models":"\u22A7",
  "Mopf":"\uD835\uDD44",
  "mopf":"\uD835\uDD5E",
  "mp":"\u2213",
  "Mscr":"\u2133",
  "mscr":"\uD835\uDCC2",
  "mstpos":"\u223E",
  "Mu":"\u039C",
  "mu":"\u03BC",
  "multimap":"\u22B8",
  "mumap":"\u22B8",
  "nabla":"\u2207",
  "Nacute":"\u0143",
  "nacute":"\u0144",
  "nang":"\u2220\u20D2",
  "nap":"\u2249",
  "napE":"\u2A70\u0338",
  "napid":"\u224B\u0338",
  "napos":"\u0149",
  "napprox":"\u2249",
  "natur":"\u266E",
  "natural":"\u266E",
  "naturals":"\u2115",
  "nbsp":"\u00A0",
  "nbump":"\u224E\u0338",
  "nbumpe":"\u224F\u0338",
  "ncap":"\u2A43",
  "Ncaron":"\u0147",
  "ncaron":"\u0148",
  "Ncedil":"\u0145",
  "ncedil":"\u0146",
  "ncong":"\u2247",
  "ncongdot":"\u2A6D\u0338",
  "ncup":"\u2A42",
  "Ncy":"\u041D",
  "ncy":"\u043D",
  "ndash":"\u2013",
  "ne":"\u2260",
  "nearhk":"\u2924",
  "neArr":"\u21D7",
  "nearr":"\u2197",
  "nearrow":"\u2197",
  "nedot":"\u2250\u0338",
  "NegativeMediumSpace":"\u200B",
  "NegativeThickSpace":"\u200B",
  "NegativeThinSpace":"\u200B",
  "NegativeVeryThinSpace":"\u200B",
  "nequiv":"\u2262",
  "nesear":"\u2928",
  "nesim":"\u2242\u0338",
  "NestedGreaterGreater":"\u226B",
  "NestedLessLess":"\u226A",
  "NewLine":"\u000A",
  "nexist":"\u2204",
  "nexists":"\u2204",
  "Nfr":"\uD835\uDD11",
  "nfr":"\uD835\uDD2B",
  "ngE":"\u2267\u0338",
  "nge":"\u2271",
  "ngeq":"\u2271",
  "ngeqq":"\u2267\u0338",
  "ngeqslant":"\u2A7E\u0338",
  "nges":"\u2A7E\u0338",
  "nGg":"\u22D9\u0338",
  "ngsim":"\u2275",
  "nGt":"\u226B\u20D2",
  "ngt":"\u226F",
  "ngtr":"\u226F",
  "nGtv":"\u226B\u0338",
  "nhArr":"\u21CE",
  "nharr":"\u21AE",
  "nhpar":"\u2AF2",
  "ni":"\u220B",
  "nis":"\u22FC",
  "nisd":"\u22FA",
  "niv":"\u220B",
  "NJcy":"\u040A",
  "njcy":"\u045A",
  "nlArr":"\u21CD",
  "nlarr":"\u219A",
  "nldr":"\u2025",
  "nlE":"\u2266\u0338",
  "nle":"\u2270",
  "nLeftarrow":"\u21CD",
  "nleftarrow":"\u219A",
  "nLeftrightarrow":"\u21CE",
  "nleftrightarrow":"\u21AE",
  "nleq":"\u2270",
  "nleqq":"\u2266\u0338",
  "nleqslant":"\u2A7D\u0338",
  "nles":"\u2A7D\u0338",
  "nless":"\u226E",
  "nLl":"\u22D8\u0338",
  "nlsim":"\u2274",
  "nLt":"\u226A\u20D2",
  "nlt":"\u226E",
  "nltri":"\u22EA",
  "nltrie":"\u22EC",
  "nLtv":"\u226A\u0338",
  "nmid":"\u2224",
  "NoBreak":"\u2060",
  "NonBreakingSpace":"\u00A0",
  "Nopf":"\u2115",
  "nopf":"\uD835\uDD5F",
  "Not":"\u2AEC",
  "not":"\u00AC",
  "NotCongruent":"\u2262",
  "NotCupCap":"\u226D",
  "NotDoubleVerticalBar":"\u2226",
  "NotElement":"\u2209",
  "NotEqual":"\u2260",
  "NotEqualTilde":"\u2242\u0338",
  "NotExists":"\u2204",
  "NotGreater":"\u226F",
  "NotGreaterEqual":"\u2271",
  "NotGreaterFullEqual":"\u2267\u0338",
  "NotGreaterGreater":"\u226B\u0338",
  "NotGreaterLess":"\u2279",
  "NotGreaterSlantEqual":"\u2A7E\u0338",
  "NotGreaterTilde":"\u2275",
  "NotHumpDownHump":"\u224E\u0338",
  "NotHumpEqual":"\u224F\u0338",
  "notin":"\u2209",
  "notindot":"\u22F5\u0338",
  "notinE":"\u22F9\u0338",
  "notinva":"\u2209",
  "notinvb":"\u22F7",
  "notinvc":"\u22F6",
  "NotLeftTriangle":"\u22EA",
  "NotLeftTriangleBar":"\u29CF\u0338",
  "NotLeftTriangleEqual":"\u22EC",
  "NotLess":"\u226E",
  "NotLessEqual":"\u2270",
  "NotLessGreater":"\u2278",
  "NotLessLess":"\u226A\u0338",
  "NotLessSlantEqual":"\u2A7D\u0338",
  "NotLessTilde":"\u2274",
  "NotNestedGreaterGreater":"\u2AA2\u0338",
  "NotNestedLessLess":"\u2AA1\u0338",
  "notni":"\u220C",
  "notniva":"\u220C",
  "notnivb":"\u22FE",
  "notnivc":"\u22FD",
  "NotPrecedes":"\u2280",
  "NotPrecedesEqual":"\u2AAF\u0338",
  "NotPrecedesSlantEqual":"\u22E0",
  "NotReverseElement":"\u220C",
  "NotRightTriangle":"\u22EB",
  "NotRightTriangleBar":"\u29D0\u0338",
  "NotRightTriangleEqual":"\u22ED",
  "NotSquareSubset":"\u228F\u0338",
  "NotSquareSubsetEqual":"\u22E2",
  "NotSquareSuperset":"\u2290\u0338",
  "NotSquareSupersetEqual":"\u22E3",
  "NotSubset":"\u2282\u20D2",
  "NotSubsetEqual":"\u2288",
  "NotSucceeds":"\u2281",
  "NotSucceedsEqual":"\u2AB0\u0338",
  "NotSucceedsSlantEqual":"\u22E1",
  "NotSucceedsTilde":"\u227F\u0338",
  "NotSuperset":"\u2283\u20D2",
  "NotSupersetEqual":"\u2289",
  "NotTilde":"\u2241",
  "NotTildeEqual":"\u2244",
  "NotTildeFullEqual":"\u2247",
  "NotTildeTilde":"\u2249",
  "NotVerticalBar":"\u2224",
  "npar":"\u2226",
  "nparallel":"\u2226",
  "nparsl":"\u2AFD\u20E5",
  "npart":"\u2202\u0338",
  "npolint":"\u2A14",
  "npr":"\u2280",
  "nprcue":"\u22E0",
  "npre":"\u2AAF\u0338",
  "nprec":"\u2280",
  "npreceq":"\u2AAF\u0338",
  "nrArr":"\u21CF",
  "nrarr":"\u219B",
  "nrarrc":"\u2933\u0338",
  "nrarrw":"\u219D\u0338",
  "nRightarrow":"\u21CF",
  "nrightarrow":"\u219B",
  "nrtri":"\u22EB",
  "nrtrie":"\u22ED",
  "nsc":"\u2281",
  "nsccue":"\u22E1",
  "nsce":"\u2AB0\u0338",
  "Nscr":"\uD835\uDCA9",
  "nscr":"\uD835\uDCC3",
  "nshortmid":"\u2224",
  "nshortparallel":"\u2226",
  "nsim":"\u2241",
  "nsime":"\u2244",
  "nsimeq":"\u2244",
  "nsmid":"\u2224",
  "nspar":"\u2226",
  "nsqsube":"\u22E2",
  "nsqsupe":"\u22E3",
  "nsub":"\u2284",
  "nsubE":"\u2AC5\u0338",
  "nsube":"\u2288",
  "nsubset":"\u2282\u20D2",
  "nsubseteq":"\u2288",
  "nsubseteqq":"\u2AC5\u0338",
  "nsucc":"\u2281",
  "nsucceq":"\u2AB0\u0338",
  "nsup":"\u2285",
  "nsupE":"\u2AC6\u0338",
  "nsupe":"\u2289",
  "nsupset":"\u2283\u20D2",
  "nsupseteq":"\u2289",
  "nsupseteqq":"\u2AC6\u0338",
  "ntgl":"\u2279",
  "Ntilde":"\u00D1",
  "ntilde":"\u00F1",
  "ntlg":"\u2278",
  "ntriangleleft":"\u22EA",
  "ntrianglelefteq":"\u22EC",
  "ntriangleright":"\u22EB",
  "ntrianglerighteq":"\u22ED",
  "Nu":"\u039D",
  "nu":"\u03BD",
  "num":"\u0023",
  "numero":"\u2116",
  "numsp":"\u2007",
  "nvap":"\u224D\u20D2",
  "nVDash":"\u22AF",
  "nVdash":"\u22AE",
  "nvDash":"\u22AD",
  "nvdash":"\u22AC",
  "nvge":"\u2265\u20D2",
  "nvgt":"\u003E\u20D2",
  "nvHarr":"\u2904",
  "nvinfin":"\u29DE",
  "nvlArr":"\u2902",
  "nvle":"\u2264\u20D2",
  "nvlt":"\u003C\u20D2",
  "nvltrie":"\u22B4\u20D2",
  "nvrArr":"\u2903",
  "nvrtrie":"\u22B5\u20D2",
  "nvsim":"\u223C\u20D2",
  "nwarhk":"\u2923",
  "nwArr":"\u21D6",
  "nwarr":"\u2196",
  "nwarrow":"\u2196",
  "nwnear":"\u2927",
  "Oacute":"\u00D3",
  "oacute":"\u00F3",
  "oast":"\u229B",
  "ocir":"\u229A",
  "Ocirc":"\u00D4",
  "ocirc":"\u00F4",
  "Ocy":"\u041E",
  "ocy":"\u043E",
  "odash":"\u229D",
  "Odblac":"\u0150",
  "odblac":"\u0151",
  "odiv":"\u2A38",
  "odot":"\u2299",
  "odsold":"\u29BC",
  "OElig":"\u0152",
  "oelig":"\u0153",
  "ofcir":"\u29BF",
  "Ofr":"\uD835\uDD12",
  "ofr":"\uD835\uDD2C",
  "ogon":"\u02DB",
  "Ograve":"\u00D2",
  "ograve":"\u00F2",
  "ogt":"\u29C1",
  "ohbar":"\u29B5",
  "ohm":"\u03A9",
  "oint":"\u222E",
  "olarr":"\u21BA",
  "olcir":"\u29BE",
  "olcross":"\u29BB",
  "oline":"\u203E",
  "olt":"\u29C0",
  "Omacr":"\u014C",
  "omacr":"\u014D",
  "Omega":"\u03A9",
  "omega":"\u03C9",
  "Omicron":"\u039F",
  "omicron":"\u03BF",
  "omid":"\u29B6",
  "ominus":"\u2296",
  "Oopf":"\uD835\uDD46",
  "oopf":"\uD835\uDD60",
  "opar":"\u29B7",
  "OpenCurlyDoubleQuote":"\u201C",
  "OpenCurlyQuote":"\u2018",
  "operp":"\u29B9",
  "oplus":"\u2295",
  "Or":"\u2A54",
  "or":"\u2228",
  "orarr":"\u21BB",
  "ord":"\u2A5D",
  "order":"\u2134",
  "orderof":"\u2134",
  "ordf":"\u00AA",
  "ordm":"\u00BA",
  "origof":"\u22B6",
  "oror":"\u2A56",
  "orslope":"\u2A57",
  "orv":"\u2A5B",
  "oS":"\u24C8",
  "Oscr":"\uD835\uDCAA",
  "oscr":"\u2134",
  "Oslash":"\u00D8",
  "oslash":"\u00F8",
  "osol":"\u2298",
  "Otilde":"\u00D5",
  "otilde":"\u00F5",
  "Otimes":"\u2A37",
  "otimes":"\u2297",
  "otimesas":"\u2A36",
  "Ouml":"\u00D6",
  "ouml":"\u00F6",
  "ovbar":"\u233D",
  "OverBar":"\u203E",
  "OverBrace":"\u23DE",
  "OverBracket":"\u23B4",
  "OverParenthesis":"\u23DC",
  "par":"\u2225",
  "para":"\u00B6",
  "parallel":"\u2225",
  "parsim":"\u2AF3",
  "parsl":"\u2AFD",
  "part":"\u2202",
  "PartialD":"\u2202",
  "Pcy":"\u041F",
  "pcy":"\u043F",
  "percnt":"\u0025",
  "period":"\u002E",
  "permil":"\u2030",
  "perp":"\u22A5",
  "pertenk":"\u2031",
  "Pfr":"\uD835\uDD13",
  "pfr":"\uD835\uDD2D",
  "Phi":"\u03A6",
  "phi":"\u03C6",
  "phiv":"\u03D5",
  "phmmat":"\u2133",
  "phone":"\u260E",
  "Pi":"\u03A0",
  "pi":"\u03C0",
  "pitchfork":"\u22D4",
  "piv":"\u03D6",
  "planck":"\u210F",
  "planckh":"\u210E",
  "plankv":"\u210F",
  "plus":"\u002B",
  "plusacir":"\u2A23",
  "plusb":"\u229E",
  "pluscir":"\u2A22",
  "plusdo":"\u2214",
  "plusdu":"\u2A25",
  "pluse":"\u2A72",
  "PlusMinus":"\u00B1",
  "plusmn":"\u00B1",
  "plussim":"\u2A26",
  "plustwo":"\u2A27",
  "pm":"\u00B1",
  "Poincareplane":"\u210C",
  "pointint":"\u2A15",
  "Popf":"\u2119",
  "popf":"\uD835\uDD61",
  "pound":"\u00A3",
  "Pr":"\u2ABB",
  "pr":"\u227A",
  "prap":"\u2AB7",
  "prcue":"\u227C",
  "prE":"\u2AB3",
  "pre":"\u2AAF",
  "prec":"\u227A",
  "precapprox":"\u2AB7",
  "preccurlyeq":"\u227C",
  "Precedes":"\u227A",
  "PrecedesEqual":"\u2AAF",
  "PrecedesSlantEqual":"\u227C",
  "PrecedesTilde":"\u227E",
  "preceq":"\u2AAF",
  "precnapprox":"\u2AB9",
  "precneqq":"\u2AB5",
  "precnsim":"\u22E8",
  "precsim":"\u227E",
  "Prime":"\u2033",
  "prime":"\u2032",
  "primes":"\u2119",
  "prnap":"\u2AB9",
  "prnE":"\u2AB5",
  "prnsim":"\u22E8",
  "prod":"\u220F",
  "Product":"\u220F",
  "profalar":"\u232E",
  "profline":"\u2312",
  "profsurf":"\u2313",
  "prop":"\u221D",
  "Proportion":"\u2237",
  "Proportional":"\u221D",
  "propto":"\u221D",
  "prsim":"\u227E",
  "prurel":"\u22B0",
  "Pscr":"\uD835\uDCAB",
  "pscr":"\uD835\uDCC5",
  "Psi":"\u03A8",
  "psi":"\u03C8",
  "puncsp":"\u2008",
  "Qfr":"\uD835\uDD14",
  "qfr":"\uD835\uDD2E",
  "qint":"\u2A0C",
  "Qopf":"\u211A",
  "qopf":"\uD835\uDD62",
  "qprime":"\u2057",
  "Qscr":"\uD835\uDCAC",
  "qscr":"\uD835\uDCC6",
  "quaternions":"\u210D",
  "quatint":"\u2A16",
  "quest":"\u003F",
  "questeq":"\u225F",
  "QUOT":"\u0022",
  "quot":"\u0022",
  "rAarr":"\u21DB",
  "race":"\u223D\u0331",
  "Racute":"\u0154",
  "racute":"\u0155",
  "radic":"\u221A",
  "raemptyv":"\u29B3",
  "Rang":"\u27EB",
  "rang":"\u27E9",
  "rangd":"\u2992",
  "range":"\u29A5",
  "rangle":"\u27E9",
  "raquo":"\u00BB",
  "Rarr":"\u21A0",
  "rArr":"\u21D2",
  "rarr":"\u2192",
  "rarrap":"\u2975",
  "rarrb":"\u21E5",
  "rarrbfs":"\u2920",
  "rarrc":"\u2933",
  "rarrfs":"\u291E",
  "rarrhk":"\u21AA",
  "rarrlp":"\u21AC",
  "rarrpl":"\u2945",
  "rarrsim":"\u2974",
  "Rarrtl":"\u2916",
  "rarrtl":"\u21A3",
  "rarrw":"\u219D",
  "rAtail":"\u291C",
  "ratail":"\u291A",
  "ratio":"\u2236",
  "rationals":"\u211A",
  "RBarr":"\u2910",
  "rBarr":"\u290F",
  "rbarr":"\u290D",
  "rbbrk":"\u2773",
  "rbrace":"\u007D",
  "rbrack":"\u005D",
  "rbrke":"\u298C",
  "rbrksld":"\u298E",
  "rbrkslu":"\u2990",
  "Rcaron":"\u0158",
  "rcaron":"\u0159",
  "Rcedil":"\u0156",
  "rcedil":"\u0157",
  "rceil":"\u2309",
  "rcub":"\u007D",
  "Rcy":"\u0420",
  "rcy":"\u0440",
  "rdca":"\u2937",
  "rdldhar":"\u2969",
  "rdquo":"\u201D",
  "rdquor":"\u201D",
  "rdsh":"\u21B3",
  "Re":"\u211C",
  "real":"\u211C",
  "realine":"\u211B",
  "realpart":"\u211C",
  "reals":"\u211D",
  "rect":"\u25AD",
  "REG":"\u00AE",
  "reg":"\u00AE",
  "ReverseElement":"\u220B",
  "ReverseEquilibrium":"\u21CB",
  "ReverseUpEquilibrium":"\u296F",
  "rfisht":"\u297D",
  "rfloor":"\u230B",
  "Rfr":"\u211C",
  "rfr":"\uD835\uDD2F",
  "rHar":"\u2964",
  "rhard":"\u21C1",
  "rharu":"\u21C0",
  "rharul":"\u296C",
  "Rho":"\u03A1",
  "rho":"\u03C1",
  "rhov":"\u03F1",
  "RightAngleBracket":"\u27E9",
  "RightArrow":"\u2192",
  "Rightarrow":"\u21D2",
  "rightarrow":"\u2192",
  "RightArrowBar":"\u21E5",
  "RightArrowLeftArrow":"\u21C4",
  "rightarrowtail":"\u21A3",
  "RightCeiling":"\u2309",
  "RightDoubleBracket":"\u27E7",
  "RightDownTeeVector":"\u295D",
  "RightDownVector":"\u21C2",
  "RightDownVectorBar":"\u2955",
  "RightFloor":"\u230B",
  "rightharpoondown":"\u21C1",
  "rightharpoonup":"\u21C0",
  "rightleftarrows":"\u21C4",
  "rightleftharpoons":"\u21CC",
  "rightrightarrows":"\u21C9",
  "rightsquigarrow":"\u219D",
  "RightTee":"\u22A2",
  "RightTeeArrow":"\u21A6",
  "RightTeeVector":"\u295B",
  "rightthreetimes":"\u22CC",
  "RightTriangle":"\u22B3",
  "RightTriangleBar":"\u29D0",
  "RightTriangleEqual":"\u22B5",
  "RightUpDownVector":"\u294F",
  "RightUpTeeVector":"\u295C",
  "RightUpVector":"\u21BE",
  "RightUpVectorBar":"\u2954",
  "RightVector":"\u21C0",
  "RightVectorBar":"\u2953",
  "ring":"\u02DA",
  "risingdotseq":"\u2253",
  "rlarr":"\u21C4",
  "rlhar":"\u21CC",
  "rlm":"\u200F",
  "rmoust":"\u23B1",
  "rmoustache":"\u23B1",
  "rnmid":"\u2AEE",
  "roang":"\u27ED",
  "roarr":"\u21FE",
  "robrk":"\u27E7",
  "ropar":"\u2986",
  "Ropf":"\u211D",
  "ropf":"\uD835\uDD63",
  "roplus":"\u2A2E",
  "rotimes":"\u2A35",
  "RoundImplies":"\u2970",
  "rpar":"\u0029",
  "rpargt":"\u2994",
  "rppolint":"\u2A12",
  "rrarr":"\u21C9",
  "Rrightarrow":"\u21DB",
  "rsaquo":"\u203A",
  "Rscr":"\u211B",
  "rscr":"\uD835\uDCC7",
  "Rsh":"\u21B1",
  "rsh":"\u21B1",
  "rsqb":"\u005D",
  "rsquo":"\u2019",
  "rsquor":"\u2019",
  "rthree":"\u22CC",
  "rtimes":"\u22CA",
  "rtri":"\u25B9",
  "rtrie":"\u22B5",
  "rtrif":"\u25B8",
  "rtriltri":"\u29CE",
  "RuleDelayed":"\u29F4",
  "ruluhar":"\u2968",
  "rx":"\u211E",
  "Sacute":"\u015A",
  "sacute":"\u015B",
  "sbquo":"\u201A",
  "Sc":"\u2ABC",
  "sc":"\u227B",
  "scap":"\u2AB8",
  "Scaron":"\u0160",
  "scaron":"\u0161",
  "sccue":"\u227D",
  "scE":"\u2AB4",
  "sce":"\u2AB0",
  "Scedil":"\u015E",
  "scedil":"\u015F",
  "Scirc":"\u015C",
  "scirc":"\u015D",
  "scnap":"\u2ABA",
  "scnE":"\u2AB6",
  "scnsim":"\u22E9",
  "scpolint":"\u2A13",
  "scsim":"\u227F",
  "Scy":"\u0421",
  "scy":"\u0441",
  "sdot":"\u22C5",
  "sdotb":"\u22A1",
  "sdote":"\u2A66",
  "searhk":"\u2925",
  "seArr":"\u21D8",
  "searr":"\u2198",
  "searrow":"\u2198",
  "sect":"\u00A7",
  "semi":"\u003B",
  "seswar":"\u2929",
  "setminus":"\u2216",
  "setmn":"\u2216",
  "sext":"\u2736",
  "Sfr":"\uD835\uDD16",
  "sfr":"\uD835\uDD30",
  "sfrown":"\u2322",
  "sharp":"\u266F",
  "SHCHcy":"\u0429",
  "shchcy":"\u0449",
  "SHcy":"\u0428",
  "shcy":"\u0448",
  "ShortDownArrow":"\u2193",
  "ShortLeftArrow":"\u2190",
  "shortmid":"\u2223",
  "shortparallel":"\u2225",
  "ShortRightArrow":"\u2192",
  "ShortUpArrow":"\u2191",
  "shy":"\u00AD",
  "Sigma":"\u03A3",
  "sigma":"\u03C3",
  "sigmaf":"\u03C2",
  "sigmav":"\u03C2",
  "sim":"\u223C",
  "simdot":"\u2A6A",
  "sime":"\u2243",
  "simeq":"\u2243",
  "simg":"\u2A9E",
  "simgE":"\u2AA0",
  "siml":"\u2A9D",
  "simlE":"\u2A9F",
  "simne":"\u2246",
  "simplus":"\u2A24",
  "simrarr":"\u2972",
  "slarr":"\u2190",
  "SmallCircle":"\u2218",
  "smallsetminus":"\u2216",
  "smashp":"\u2A33",
  "smeparsl":"\u29E4",
  "smid":"\u2223",
  "smile":"\u2323",
  "smt":"\u2AAA",
  "smte":"\u2AAC",
  "smtes":"\u2AAC\uFE00",
  "SOFTcy":"\u042C",
  "softcy":"\u044C",
  "sol":"\u002F",
  "solb":"\u29C4",
  "solbar":"\u233F",
  "Sopf":"\uD835\uDD4A",
  "sopf":"\uD835\uDD64",
  "spades":"\u2660",
  "spadesuit":"\u2660",
  "spar":"\u2225",
  "sqcap":"\u2293",
  "sqcaps":"\u2293\uFE00",
  "sqcup":"\u2294",
  "sqcups":"\u2294\uFE00",
  "Sqrt":"\u221A",
  "sqsub":"\u228F",
  "sqsube":"\u2291",
  "sqsubset":"\u228F",
  "sqsubseteq":"\u2291",
  "sqsup":"\u2290",
  "sqsupe":"\u2292",
  "sqsupset":"\u2290",
  "sqsupseteq":"\u2292",
  "squ":"\u25A1",
  "Square":"\u25A1",
  "square":"\u25A1",
  "SquareIntersection":"\u2293",
  "SquareSubset":"\u228F",
  "SquareSubsetEqual":"\u2291",
  "SquareSuperset":"\u2290",
  "SquareSupersetEqual":"\u2292",
  "SquareUnion":"\u2294",
  "squarf":"\u25AA",
  "squf":"\u25AA",
  "srarr":"\u2192",
  "Sscr":"\uD835\uDCAE",
  "sscr":"\uD835\uDCC8",
  "ssetmn":"\u2216",
  "ssmile":"\u2323",
  "sstarf":"\u22C6",
  "Star":"\u22C6",
  "star":"\u2606",
  "starf":"\u2605",
  "straightepsilon":"\u03F5",
  "straightphi":"\u03D5",
  "strns":"\u00AF",
  "Sub":"\u22D0",
  "sub":"\u2282",
  "subdot":"\u2ABD",
  "subE":"\u2AC5",
  "sube":"\u2286",
  "subedot":"\u2AC3",
  "submult":"\u2AC1",
  "subnE":"\u2ACB",
  "subne":"\u228A",
  "subplus":"\u2ABF",
  "subrarr":"\u2979",
  "Subset":"\u22D0",
  "subset":"\u2282",
  "subseteq":"\u2286",
  "subseteqq":"\u2AC5",
  "SubsetEqual":"\u2286",
  "subsetneq":"\u228A",
  "subsetneqq":"\u2ACB",
  "subsim":"\u2AC7",
  "subsub":"\u2AD5",
  "subsup":"\u2AD3",
  "succ":"\u227B",
  "succapprox":"\u2AB8",
  "succcurlyeq":"\u227D",
  "Succeeds":"\u227B",
  "SucceedsEqual":"\u2AB0",
  "SucceedsSlantEqual":"\u227D",
  "SucceedsTilde":"\u227F",
  "succeq":"\u2AB0",
  "succnapprox":"\u2ABA",
  "succneqq":"\u2AB6",
  "succnsim":"\u22E9",
  "succsim":"\u227F",
  "SuchThat":"\u220B",
  "Sum":"\u2211",
  "sum":"\u2211",
  "sung":"\u266A",
  "Sup":"\u22D1",
  "sup":"\u2283",
  "sup1":"\u00B9",
  "sup2":"\u00B2",
  "sup3":"\u00B3",
  "supdot":"\u2ABE",
  "supdsub":"\u2AD8",
  "supE":"\u2AC6",
  "supe":"\u2287",
  "supedot":"\u2AC4",
  "Superset":"\u2283",
  "SupersetEqual":"\u2287",
  "suphsol":"\u27C9",
  "suphsub":"\u2AD7",
  "suplarr":"\u297B",
  "supmult":"\u2AC2",
  "supnE":"\u2ACC",
  "supne":"\u228B",
  "supplus":"\u2AC0",
  "Supset":"\u22D1",
  "supset":"\u2283",
  "supseteq":"\u2287",
  "supseteqq":"\u2AC6",
  "supsetneq":"\u228B",
  "supsetneqq":"\u2ACC",
  "supsim":"\u2AC8",
  "supsub":"\u2AD4",
  "supsup":"\u2AD6",
  "swarhk":"\u2926",
  "swArr":"\u21D9",
  "swarr":"\u2199",
  "swarrow":"\u2199",
  "swnwar":"\u292A",
  "szlig":"\u00DF",
  "Tab":"\u0009",
  "target":"\u2316",
  "Tau":"\u03A4",
  "tau":"\u03C4",
  "tbrk":"\u23B4",
  "Tcaron":"\u0164",
  "tcaron":"\u0165",
  "Tcedil":"\u0162",
  "tcedil":"\u0163",
  "Tcy":"\u0422",
  "tcy":"\u0442",
  "tdot":"\u20DB",
  "telrec":"\u2315",
  "Tfr":"\uD835\uDD17",
  "tfr":"\uD835\uDD31",
  "there4":"\u2234",
  "Therefore":"\u2234",
  "therefore":"\u2234",
  "Theta":"\u0398",
  "theta":"\u03B8",
  "thetasym":"\u03D1",
  "thetav":"\u03D1",
  "thickapprox":"\u2248",
  "thicksim":"\u223C",
  "ThickSpace":"\u205F\u200A",
  "thinsp":"\u2009",
  "ThinSpace":"\u2009",
  "thkap":"\u2248",
  "thksim":"\u223C",
  "THORN":"\u00DE",
  "thorn":"\u00FE",
  "Tilde":"\u223C",
  "tilde":"\u02DC",
  "TildeEqual":"\u2243",
  "TildeFullEqual":"\u2245",
  "TildeTilde":"\u2248",
  "times":"\u00D7",
  "timesb":"\u22A0",
  "timesbar":"\u2A31",
  "timesd":"\u2A30",
  "tint":"\u222D",
  "toea":"\u2928",
  "top":"\u22A4",
  "topbot":"\u2336",
  "topcir":"\u2AF1",
  "Topf":"\uD835\uDD4B",
  "topf":"\uD835\uDD65",
  "topfork":"\u2ADA",
  "tosa":"\u2929",
  "tprime":"\u2034",
  "TRADE":"\u2122",
  "trade":"\u2122",
  "triangle":"\u25B5",
  "triangledown":"\u25BF",
  "triangleleft":"\u25C3",
  "trianglelefteq":"\u22B4",
  "triangleq":"\u225C",
  "triangleright":"\u25B9",
  "trianglerighteq":"\u22B5",
  "tridot":"\u25EC",
  "trie":"\u225C",
  "triminus":"\u2A3A",
  "TripleDot":"\u20DB",
  "triplus":"\u2A39",
  "trisb":"\u29CD",
  "tritime":"\u2A3B",
  "trpezium":"\u23E2",
  "Tscr":"\uD835\uDCAF",
  "tscr":"\uD835\uDCC9",
  "TScy":"\u0426",
  "tscy":"\u0446",
  "TSHcy":"\u040B",
  "tshcy":"\u045B",
  "Tstrok":"\u0166",
  "tstrok":"\u0167",
  "twixt":"\u226C",
  "twoheadleftarrow":"\u219E",
  "twoheadrightarrow":"\u21A0",
  "Uacute":"\u00DA",
  "uacute":"\u00FA",
  "Uarr":"\u219F",
  "uArr":"\u21D1",
  "uarr":"\u2191",
  "Uarrocir":"\u2949",
  "Ubrcy":"\u040E",
  "ubrcy":"\u045E",
  "Ubreve":"\u016C",
  "ubreve":"\u016D",
  "Ucirc":"\u00DB",
  "ucirc":"\u00FB",
  "Ucy":"\u0423",
  "ucy":"\u0443",
  "udarr":"\u21C5",
  "Udblac":"\u0170",
  "udblac":"\u0171",
  "udhar":"\u296E",
  "ufisht":"\u297E",
  "Ufr":"\uD835\uDD18",
  "ufr":"\uD835\uDD32",
  "Ugrave":"\u00D9",
  "ugrave":"\u00F9",
  "uHar":"\u2963",
  "uharl":"\u21BF",
  "uharr":"\u21BE",
  "uhblk":"\u2580",
  "ulcorn":"\u231C",
  "ulcorner":"\u231C",
  "ulcrop":"\u230F",
  "ultri":"\u25F8",
  "Umacr":"\u016A",
  "umacr":"\u016B",
  "uml":"\u00A8",
  "UnderBar":"\u005F",
  "UnderBrace":"\u23DF",
  "UnderBracket":"\u23B5",
  "UnderParenthesis":"\u23DD",
  "Union":"\u22C3",
  "UnionPlus":"\u228E",
  "Uogon":"\u0172",
  "uogon":"\u0173",
  "Uopf":"\uD835\uDD4C",
  "uopf":"\uD835\uDD66",
  "UpArrow":"\u2191",
  "Uparrow":"\u21D1",
  "uparrow":"\u2191",
  "UpArrowBar":"\u2912",
  "UpArrowDownArrow":"\u21C5",
  "UpDownArrow":"\u2195",
  "Updownarrow":"\u21D5",
  "updownarrow":"\u2195",
  "UpEquilibrium":"\u296E",
  "upharpoonleft":"\u21BF",
  "upharpoonright":"\u21BE",
  "uplus":"\u228E",
  "UpperLeftArrow":"\u2196",
  "UpperRightArrow":"\u2197",
  "Upsi":"\u03D2",
  "upsi":"\u03C5",
  "upsih":"\u03D2",
  "Upsilon":"\u03A5",
  "upsilon":"\u03C5",
  "UpTee":"\u22A5",
  "UpTeeArrow":"\u21A5",
  "upuparrows":"\u21C8",
  "urcorn":"\u231D",
  "urcorner":"\u231D",
  "urcrop":"\u230E",
  "Uring":"\u016E",
  "uring":"\u016F",
  "urtri":"\u25F9",
  "Uscr":"\uD835\uDCB0",
  "uscr":"\uD835\uDCCA",
  "utdot":"\u22F0",
  "Utilde":"\u0168",
  "utilde":"\u0169",
  "utri":"\u25B5",
  "utrif":"\u25B4",
  "uuarr":"\u21C8",
  "Uuml":"\u00DC",
  "uuml":"\u00FC",
  "uwangle":"\u29A7",
  "vangrt":"\u299C",
  "varepsilon":"\u03F5",
  "varkappa":"\u03F0",
  "varnothing":"\u2205",
  "varphi":"\u03D5",
  "varpi":"\u03D6",
  "varpropto":"\u221D",
  "vArr":"\u21D5",
  "varr":"\u2195",
  "varrho":"\u03F1",
  "varsigma":"\u03C2",
  "varsubsetneq":"\u228A\uFE00",
  "varsubsetneqq":"\u2ACB\uFE00",
  "varsupsetneq":"\u228B\uFE00",
  "varsupsetneqq":"\u2ACC\uFE00",
  "vartheta":"\u03D1",
  "vartriangleleft":"\u22B2",
  "vartriangleright":"\u22B3",
  "Vbar":"\u2AEB",
  "vBar":"\u2AE8",
  "vBarv":"\u2AE9",
  "Vcy":"\u0412",
  "vcy":"\u0432",
  "VDash":"\u22AB",
  "Vdash":"\u22A9",
  "vDash":"\u22A8",
  "vdash":"\u22A2",
  "Vdashl":"\u2AE6",
  "Vee":"\u22C1",
  "vee":"\u2228",
  "veebar":"\u22BB",
  "veeeq":"\u225A",
  "vellip":"\u22EE",
  "Verbar":"\u2016",
  "verbar":"\u007C",
  "Vert":"\u2016",
  "vert":"\u007C",
  "VerticalBar":"\u2223",
  "VerticalLine":"\u007C",
  "VerticalSeparator":"\u2758",
  "VerticalTilde":"\u2240",
  "VeryThinSpace":"\u200A",
  "Vfr":"\uD835\uDD19",
  "vfr":"\uD835\uDD33",
  "vltri":"\u22B2",
  "vnsub":"\u2282\u20D2",
  "vnsup":"\u2283\u20D2",
  "Vopf":"\uD835\uDD4D",
  "vopf":"\uD835\uDD67",
  "vprop":"\u221D",
  "vrtri":"\u22B3",
  "Vscr":"\uD835\uDCB1",
  "vscr":"\uD835\uDCCB",
  "vsubnE":"\u2ACB\uFE00",
  "vsubne":"\u228A\uFE00",
  "vsupnE":"\u2ACC\uFE00",
  "vsupne":"\u228B\uFE00",
  "Vvdash":"\u22AA",
  "vzigzag":"\u299A",
  "Wcirc":"\u0174",
  "wcirc":"\u0175",
  "wedbar":"\u2A5F",
  "Wedge":"\u22C0",
  "wedge":"\u2227",
  "wedgeq":"\u2259",
  "weierp":"\u2118",
  "Wfr":"\uD835\uDD1A",
  "wfr":"\uD835\uDD34",
  "Wopf":"\uD835\uDD4E",
  "wopf":"\uD835\uDD68",
  "wp":"\u2118",
  "wr":"\u2240",
  "wreath":"\u2240",
  "Wscr":"\uD835\uDCB2",
  "wscr":"\uD835\uDCCC",
  "xcap":"\u22C2",
  "xcirc":"\u25EF",
  "xcup":"\u22C3",
  "xdtri":"\u25BD",
  "Xfr":"\uD835\uDD1B",
  "xfr":"\uD835\uDD35",
  "xhArr":"\u27FA",
  "xharr":"\u27F7",
  "Xi":"\u039E",
  "xi":"\u03BE",
  "xlArr":"\u27F8",
  "xlarr":"\u27F5",
  "xmap":"\u27FC",
  "xnis":"\u22FB",
  "xodot":"\u2A00",
  "Xopf":"\uD835\uDD4F",
  "xopf":"\uD835\uDD69",
  "xoplus":"\u2A01",
  "xotime":"\u2A02",
  "xrArr":"\u27F9",
  "xrarr":"\u27F6",
  "Xscr":"\uD835\uDCB3",
  "xscr":"\uD835\uDCCD",
  "xsqcup":"\u2A06",
  "xuplus":"\u2A04",
  "xutri":"\u25B3",
  "xvee":"\u22C1",
  "xwedge":"\u22C0",
  "Yacute":"\u00DD",
  "yacute":"\u00FD",
  "YAcy":"\u042F",
  "yacy":"\u044F",
  "Ycirc":"\u0176",
  "ycirc":"\u0177",
  "Ycy":"\u042B",
  "ycy":"\u044B",
  "yen":"\u00A5",
  "Yfr":"\uD835\uDD1C",
  "yfr":"\uD835\uDD36",
  "YIcy":"\u0407",
  "yicy":"\u0457",
  "Yopf":"\uD835\uDD50",
  "yopf":"\uD835\uDD6A",
  "Yscr":"\uD835\uDCB4",
  "yscr":"\uD835\uDCCE",
  "YUcy":"\u042E",
  "yucy":"\u044E",
  "Yuml":"\u0178",
  "yuml":"\u00FF",
  "Zacute":"\u0179",
  "zacute":"\u017A",
  "Zcaron":"\u017D",
  "zcaron":"\u017E",
  "Zcy":"\u0417",
  "zcy":"\u0437",
  "Zdot":"\u017B",
  "zdot":"\u017C",
  "zeetrf":"\u2128",
  "ZeroWidthSpace":"\u200B",
  "Zeta":"\u0396",
  "zeta":"\u03B6",
  "Zfr":"\u2128",
  "zfr":"\uD835\uDD37",
  "ZHcy":"\u0416",
  "zhcy":"\u0436",
  "zigrarr":"\u21DD",
  "Zopf":"\u2124",
  "zopf":"\uD835\uDD6B",
  "Zscr":"\uD835\uDCB5",
  "zscr":"\uD835\uDCCF",
  "zwj":"\u200D",
  "zwnj":"\u200C"
};

},{}],33:[function(require,module,exports){
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks

'use strict';

var html_blocks = {};

[
  'article',
  'aside',
  'button',
  'blockquote',
  'body',
  'canvas',
  'caption',
  'col',
  'colgroup',
  'dd',
  'div',
  'dl',
  'dt',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'iframe',
  'li',
  'map',
  'object',
  'ol',
  'output',
  'p',
  'pre',
  'progress',
  'script',
  'section',
  'style',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'tr',
  'thead',
  'ul',
  'video'
].forEach(function (name) { html_blocks[name] = true; });


module.exports = html_blocks;

},{}],34:[function(require,module,exports){
// Regexps to match html elements

'use strict';

var attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

var unquoted      = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';

var attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

var attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

var open_tag    = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

var close_tag   = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
var comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var processing  = '<[?].*?[?]>';
var declaration = '<![A-Z]+\\s+[^>]*>';
var cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
                        '|' + processing + '|' + declaration + '|' + cdata + ')');

module.exports.HTML_TAG_RE = HTML_TAG_RE;

},{}],35:[function(require,module,exports){
// List of valid url schemas, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#autolinks

'use strict';


module.exports = [
  'coap',
  'doi',
  'javascript',
  'aaa',
  'aaas',
  'about',
  'acap',
  'cap',
  'cid',
  'crid',
  'data',
  'dav',
  'dict',
  'dns',
  'file',
  'ftp',
  'geo',
  'go',
  'gopher',
  'h323',
  'http',
  'https',
  'iax',
  'icap',
  'im',
  'imap',
  'info',
  'ipp',
  'iris',
  'iris.beep',
  'iris.xpc',
  'iris.xpcs',
  'iris.lwz',
  'ldap',
  'mailto',
  'mid',
  'msrp',
  'msrps',
  'mtqp',
  'mupdate',
  'news',
  'nfs',
  'ni',
  'nih',
  'nntp',
  'opaquelocktoken',
  'pop',
  'pres',
  'rtsp',
  'service',
  'session',
  'shttp',
  'sieve',
  'sip',
  'sips',
  'sms',
  'snmp',
  'soap.beep',
  'soap.beeps',
  'tag',
  'tel',
  'telnet',
  'tftp',
  'thismessage',
  'tn3270',
  'tip',
  'tv',
  'urn',
  'vemmi',
  'ws',
  'wss',
  'xcon',
  'xcon-userid',
  'xmlrpc.beep',
  'xmlrpc.beeps',
  'xmpp',
  'z39.50r',
  'z39.50s',
  'adiumxtra',
  'afp',
  'afs',
  'aim',
  'apt',
  'attachment',
  'aw',
  'beshare',
  'bitcoin',
  'bolo',
  'callto',
  'chrome',
  'chrome-extension',
  'com-eventbrite-attendee',
  'content',
  'cvs',
  'dlna-playsingle',
  'dlna-playcontainer',
  'dtn',
  'dvb',
  'ed2k',
  'facetime',
  'feed',
  'finger',
  'fish',
  'gg',
  'git',
  'gizmoproject',
  'gtalk',
  'hcp',
  'icon',
  'ipn',
  'irc',
  'irc6',
  'ircs',
  'itms',
  'jar',
  'jms',
  'keyparc',
  'lastfm',
  'ldaps',
  'magnet',
  'maps',
  'market',
  'message',
  'mms',
  'ms-help',
  'msnim',
  'mumble',
  'mvn',
  'notes',
  'oid',
  'palm',
  'paparazzi',
  'platform',
  'proxy',
  'psyc',
  'query',
  'res',
  'resource',
  'rmi',
  'rsync',
  'rtmp',
  'secondlife',
  'sftp',
  'sgn',
  'skype',
  'smb',
  'soldat',
  'spotify',
  'ssh',
  'steam',
  'svn',
  'teamspeak',
  'things',
  'udp',
  'unreal',
  'ut2004',
  'ventrilo',
  'view-source',
  'webcal',
  'wtai',
  'wyciwyg',
  'xfire',
  'xri',
  'ymsgr'
];

},{}],36:[function(require,module,exports){
// Utilities
//
'use strict';


function _class(obj) { return Object.prototype.toString.call(obj); }

function isString(obj) { return _class(obj) === '[object String]'; }

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function has(object, key) {
  return _hasOwnProperty.call(object, key);
}

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be object');
    }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

// Remove element from array and put another array at those position.
// Useful for some operations with tokens
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}

////////////////////////////////////////////////////////////////////////////////

var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}

////////////////////////////////////////////////////////////////////////////////

function isValidEntityCode(c) {
  /*eslint no-bitwise:0*/
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
  // never used
  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
  // control codes
  if (c >= 0x00 && c <= 0x08) { return false; }
  if (c === 0x0B) { return false; }
  if (c >= 0x0E && c <= 0x1F) { return false; }
  if (c >= 0x7F && c <= 0x9F) { return false; }
  // out of range
  if (c > 0x10FFFF) { return false; }
  return true;
}

function fromCodePoint(c) {
  /*eslint no-bitwise:0*/
  if (c > 0xffff) {
    c -= 0x10000;
    var surrogate1 = 0xd800 + (c >> 10),
        surrogate2 = 0xdc00 + (c & 0x3ff);

    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}

var NAMED_ENTITY_RE   = /&([a-z#][a-z0-9]{1,31});/gi;
var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;
var entities = require('./entities');

function replaceEntityPattern(match, name) {
  var code = 0;

  if (has(entities, name)) {
    return entities[name];
  } else if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
    code = name[1].toLowerCase() === 'x' ?
      parseInt(name.slice(2), 16)
    :
      parseInt(name.slice(1), 10);
    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }
  }
  return match;
}

function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(NAMED_ENTITY_RE, replaceEntityPattern);
}

////////////////////////////////////////////////////////////////////////////////

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

////////////////////////////////////////////////////////////////////////////////

var SURRORATE_TEST_RE   = /[\uD800-\uDFFF]/;
var SURRORATE_SEARCH_RE = /[\uD800-\uDFFF]/g;

function replaceBadSurrogate(ch, pos, orig) {
  var code = ch.charCodeAt(0);

  if (code >= 0xD800 && code <= 0xDBFF) {
    // high surrogate
    if (pos >= orig.length - 1) { return '\uFFFD'; }
    code = orig.charCodeAt(pos + 1);
    if (code < 0xDC00 || code > 0xDFFF) { return '\uFFFD'; }

    return ch;
  }

  // low surrogate
  if (pos === 0) { return '\uFFFD'; }
  code = orig.charCodeAt(pos - 1);
  if (code < 0xD800 || code > 0xDBFF) { return '\uFFFD'; }
  return ch;
}

function fixBrokenSurrogates(str) {
  if (!SURRORATE_TEST_RE.test(str)) { return str; }

  return str.replace(SURRORATE_SEARCH_RE, replaceBadSurrogate);
}

////////////////////////////////////////////////////////////////////////////////


// Incoming link can be partially encoded. Convert possible combinations to
// unified form.
//
// TODO: Rewrite it. Should use:
//
// - encodeURIComponent for query
// - encodeURI for path
// - (?) punicode for domain mame (but encodeURI seems to work in real world)
//
function normalizeLink(url) {
  var normalized = replaceEntities(url);

  // We don't care much about result of mailformed URIs,
  // but shoud not throw exception.
  try {
    normalized = decodeURI(normalized);
  } catch (__) {}

  // Encoder throws exception on broken surrogate pairs.
  // Fix those first.

  try {
    return encodeURI(fixBrokenSurrogates(normalized));
  } catch (__) {
    // This should never happen and left for safety only.
    /*istanbul ignore next*/
    return '';
  }
}

////////////////////////////////////////////////////////////////////////////////

var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

function escapeRE (str) {
  return str.replace(REGEXP_ESCAPE_RE, '\\$&');
}

////////////////////////////////////////////////////////////////////////////////

// Zs (unicode class) || [\t\f\v\r\n]
function isWhiteSpace(code) {
  if (code >= 0x2000 && code <= 0x200A) { return true; }
  switch (code) {
    case 0x09: // \t
    case 0x0A: // \n
    case 0x0B: // \v
    case 0x0C: // \f
    case 0x0D: // \r
    case 0x20:
    case 0xA0:
    case 0x1680:
    case 0x202F:
    case 0x205F:
    case 0x3000:
      return true;
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////////

/*eslint-disable max-len*/
var UNICODE_PUNCT_RE = require('uc.micro/categories/P/regex');

// Currently without astral characters support.
function isPunctChar(char) {
  return UNICODE_PUNCT_RE.test(char);
}


// Markdown ASCII punctuation characters.
//
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
//
// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
//
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 0x21/* ! */:
    case 0x22/* " */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x27/* ' */:
    case 0x28/* ( */:
    case 0x29/* ) */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2C/* , */:
    case 0x2D/* - */:
    case 0x2E/* . */:
    case 0x2F/* / */:
    case 0x3A/* : */:
    case 0x3B/* ; */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x3F/* ? */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7C/* | */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

// Hepler to unify [reference labels].
//
function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
}

////////////////////////////////////////////////////////////////////////////////

exports.assign              = assign;
exports.isString            = isString;
exports.has                 = has;
exports.unescapeMd          = unescapeMd;
exports.isValidEntityCode   = isValidEntityCode;
exports.fromCodePoint       = fromCodePoint;
exports.replaceEntities     = replaceEntities;
exports.escapeHtml          = escapeHtml;
exports.arrayReplaceAt      = arrayReplaceAt;
exports.normalizeLink       = normalizeLink;
exports.isWhiteSpace        = isWhiteSpace;
exports.isMdAsciiPunct      = isMdAsciiPunct;
exports.isPunctChar         = isPunctChar;
exports.escapeRE            = escapeRE;
exports.normalizeReference  = normalizeReference;

// for testing only
exports.fixBrokenSurrogates = fixBrokenSurrogates;

},{"./entities":32,"uc.micro/categories/P/regex":82}],37:[function(require,module,exports){
// Just a shortcut for bulk export
'use strict';


exports.parseLinkLabel       = require('./parse_link_label');
exports.parseLinkDestination = require('./parse_link_destination');
exports.parseLinkTitle       = require('./parse_link_title');

},{"./parse_link_destination":38,"./parse_link_label":39,"./parse_link_title":40}],38:[function(require,module,exports){
// Parse link destination
//
'use strict';


var normalizeLink = require('../common/utils').normalizeLink;
var unescapeMd    = require('../common/utils').unescapeMd;


module.exports = function parseLinkDestination(str, pos, max) {
  var code, level,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (str.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = str.charCodeAt(pos);
      if (code === 0x0A /* \n */) { return result; }
      if (code === 0x3E /* > */) {
        result.pos = pos + 1;
        result.str = normalizeLink(unescapeMd(str.slice(start + 1, pos)));
        result.ok = true;
        return result;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos += 2;
        continue;
      }

      pos++;
    }

    // no closing '>'
    return result;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = str.charCodeAt(pos);

    if (code === 0x20) { break; }

    // ascii control characters
    if (code < 0x20 || code === 0x7F) { break; }

    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
      if (level > 1) { break; }
    }

    if (code === 0x29 /* ) */) {
      level--;
      if (level < 0) { break; }
    }

    pos++;
  }

  if (start === pos) { return result; }

  result.str = normalizeLink(unescapeMd(str.slice(start, pos)));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};

},{"../common/utils":36}],39:[function(require,module,exports){
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//
'use strict';

module.exports = function parseLinkLabel(state, start, disableNested) {
  var level, found, marker, prevPos,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos;

  state.pos = start + 1;
  level = 1;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 0x5D /* ] */) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }

    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 0x5B /* [ */) {
      if (prevPos === state.pos - 1) {
        // increase level if we find text `[`, which is not a part of any token
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }

  if (found) {
    labelEnd = state.pos;
  }

  // restore old state
  state.pos = oldPos;

  return labelEnd;
};

},{}],40:[function(require,module,exports){
// Parse link title
//
'use strict';


var unescapeMd = require('../common/utils').unescapeMd;


module.exports = function parseLinkTitle(str, pos, max) {
  var code,
      marker,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (pos >= max) { return result; }

  marker = str.charCodeAt(pos);

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return result; }

  pos++;

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = str.charCodeAt(pos);
    if (code === marker) {
      result.pos = pos + 1;
      result.lines = lines;
      result.str = unescapeMd(str.slice(start + 1, pos));
      result.ok = true;
      return result;
    } else if (code === 0x0A) {
      lines++;
    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      if (str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }

    pos++;
  }

  return result;
};

},{"../common/utils":36}],41:[function(require,module,exports){
// Main perser class

'use strict';


var utils        = require('./common/utils');
var helpers      = require('./helpers');
var Renderer     = require('./renderer');
var ParserCore   = require('./parser_core');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');

var config = {
  'default': require('./presets/default'),
  zero: require('./presets/zero'),
  commonmark: require('./presets/commonmark')
};


/**
 * class MarkdownIt
 *
 * Main parser/renderer class.
 *
 * ##### Usage
 *
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * Single line rendering, without paragraph wrap:
 *
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 **/

/**
 * new MarkdownIt([presetName, options])
 * - presetName (String): optional, `commonmark` / `zero`
 * - options (Object)
 *
 * Creates parser instanse with given config. Can be called without `new`.
 *
 * ##### presetName
 *
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 *
 * ##### options:
 *
 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
 *   That's not safe! You may need external sanitizer to protect output from XSS.
 *   It's better to extend features via plugins, instead of enabling HTML.
 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
 *   world you will need HTML output.
 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
 *   Can be useful for external highlighters.
 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
 *   quotes beautification (smartquotes).
 * - __quotes__ - `“”‘’`, string. Double + single quotes replacement pairs, when
 *   typographer enabled and smartquotes on. Set doubles to '«»' for Russian,
 *   '„“' for German.
 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
 *   return empty string if the source was not changed and should be escaped externaly.
 *
 * ##### Example
 *
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * ##### Syntax highlighting
 *
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(lang, str).value;
 *       } catch (__) {}
 *     }
 *
 *     try {
 *       return hljs.highlightAuto(str).value;
 *     } catch (__) {}
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 **/
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }

  if (!options) {
    if (!utils.isString(presetName)) {
      options = presetName || {};
      presetName = 'default';
    }
  }

  /**
   * MarkdownIt#inline -> ParserInline
   *
   * Instance of [[ParserInline]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.inline = new ParserInline();

  /**
   * MarkdownIt#block -> ParserBlock
   *
   * Instance of [[ParserBlock]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.block = new ParserBlock();

  /**
   * MarkdownIt#core -> Core
   *
   * Instance of [[Core]] chain executor. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.core = new ParserCore();

  /**
   * MarkdownIt#renderer -> Renderer
   *
   * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   *
   * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
   **/
  this.renderer = new Renderer();

  // Expose utils & helpers for easy acces from plugins

  /**
   * MarkdownIt#utils -> utils
   *
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
   **/
  this.utils = utils;

  /**
   * MarkdownIt#helpers -> helpers
   *
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
   **/
  this.helpers = helpers;


  this.options = {};
  this.configure(presetName);

  if (options) { this.set(options); }
}


/** chainable
 * MarkdownIt.set(options)
 *
 * Set parser options (in the same format as in constructor). Probably, you
 * will never need it, but you can change options after constructor call.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .set({ html: true, breaks: true })
 *             .set({ typographer, true });
 * ```
 *
 * __Note:__ To achieve the best possible performance, don't modify a
 * `markdown-it` instance options on the fly. If you need multiple configurations
 * it's best to create multiple instances and initialize each with separate
 * config.
 **/
MarkdownIt.prototype.set = function (options) {
  utils.assign(this.options, options);
  return this;
};


/** chainable, internal
 * MarkdownIt.configure(presets)
 *
 * Batch load of all options and compenent settings. This is internal method,
 * and you probably will not need it. But if you with - see available presets
 * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
 *
 * We strongly recommend to use presets instead of direct config loads. That
 * will give better compatibility with next versions.
 **/
MarkdownIt.prototype.configure = function (presets) {
  var self = this, presetName;

  if (utils.isString(presets)) {
    presetName = presets;
    presets = config[presetName];
    if (!presets) { throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name'); }
  }

  if (!presets) { throw new Error('Wrong `markdown-it` preset, can\'t be empty'); }

  if (presets.options) { self.set(presets.options); }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enableOnly(presets.components[name].rules);
      }
    });
  }
  return this;
};


/** chainable
 * MarkdownIt.enable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to enable
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable list or rules. It will automatically find appropriate components,
 * containing rules with given names. If rule not found, and `ignoreInvalid`
 * not set - throws exception.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .enable(['sub', 'sup'])
 *             .disable('smartquotes');
 * ```
 **/
MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.enable(list, true));
  }, this);

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
  }

  return this;
};


/** chainable
 * MarkdownIt.disable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * The same as [[MarkdownIt.enable]], but turn specified rules off.
 **/
MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.disable(list, true));
  }, this);

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
  }
  return this;
};


/** chainable
 * MarkdownIt.use(plugin, params)
 *
 * Load specified plugin with given params into current parser instance.
 * It's just a sugar to call `plugin(md, params)` with curring.
 *
 * ##### Example
 *
 * ```javascript
 * var iterator = require('markdown-it-for-inline');
 * var md = require('markdown-it')()
 *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
 *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
 *             });
 * ```
 **/
MarkdownIt.prototype.use = function (plugin /*, params, ... */) {
  var args = [ this ].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};


/** internal
 * MarkdownIt.parse(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Parse input string and returns list of block tokens (special token type
 * "inline" will contain list of inline tokens). You should not call this
 * method directly, until you write custom renderer (for example, to produce
 * AST).
 *
 * `env` is used to pass data between "distributed" rules (`{}` by default).
 * For example, references are parsed in different chains, and need sandbox
 * to store intermediate results. Can be used to inject data in specific cases.
 * You will not need it with high probability.
 **/
MarkdownIt.prototype.parse = function (src, env) {
  var state = new this.core.State(src, this, env);

  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.render(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Render markdown string into html. It does all magic for you :).
 *
 * `env` can be used to inject additional metadata (`{}` by default).
 * But you will not need it with high probability. See also comment
 * in [[MarkdownIt.parse]].
 **/
MarkdownIt.prototype.render = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parse(src, env), this.options, env);
};


/** internal
 * MarkdownIt.parseInline(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
 * block tokens list with th single `inline` element, containing parsed inline
 * tokens in `children` property.
 **/
MarkdownIt.prototype.parseInline = function (src, env) {
  var state = new this.core.State(src, this, env);

  state.inlineMode = true;
  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.renderInline(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
 * will NOT be wrapped into `<p>` tags.
 **/
MarkdownIt.prototype.renderInline = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parseInline(src, env), this.options, env);
};


module.exports = MarkdownIt;

},{"./common/utils":36,"./helpers":37,"./parser_block":42,"./parser_core":43,"./parser_inline":44,"./presets/commonmark":45,"./presets/default":46,"./presets/zero":47,"./renderer":48}],42:[function(require,module,exports){
/** internal
 * class ParserBlock
 *
 * Block-level tokenizer.
 **/
'use strict';


var Ruler           = require('./ruler');


var _rules = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  [ 'code',       require('./rules_block/code') ],
  [ 'fence',      require('./rules_block/fence'),      [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'blockquote', require('./rules_block/blockquote'), [ 'paragraph', 'reference', 'list' ] ],
  [ 'hr',         require('./rules_block/hr'),         [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'list',       require('./rules_block/list'),       [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'reference',  require('./rules_block/reference') ],
  [ 'heading',    require('./rules_block/heading'),    [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'lheading',   require('./rules_block/lheading') ],
  [ 'html_block', require('./rules_block/html_block'), [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'table',      require('./rules_block/table'),      [ 'paragraph', 'reference' ] ],
  [ 'paragraph',  require('./rules_block/paragraph') ]
];


/**
 * new ParserBlock()
 **/
function ParserBlock() {
  /**
   * ParserBlock#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of block rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
  }
}


// Generate tokens for input range
//
ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      line = startLine,
      hasEmptyLines = false,
      maxNesting = state.md.options.maxNesting;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) { break; }

    // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists
    if (state.tShift[line] < state.blkIndent) { break; }

    // If nesting level exceeded - skip tail to the end. That's not ordinary
    // situation and we should not care about content.
    if (state.level >= maxNesting) {
      state.line = endLine;
      break;
    }

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;

      // two empty lines should stop the parser in list mode
      if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) { break; }
      state.line = line;
    }
  }
};


/**
 * ParserBlock.parse(str, md, env, outTokens)
 *
 * Process input string and push block tokens into `outTokens`
 **/
ParserBlock.prototype.parse = function (src, md, env, outTokens) {
  var state;

  if (!src) { return []; }

  state = new this.State(src, md, env, outTokens);

  this.tokenize(state, state.line, state.lineMax);
};


ParserBlock.prototype.State = require('./rules_block/state_block');


module.exports = ParserBlock;

},{"./ruler":49,"./rules_block/blockquote":50,"./rules_block/code":51,"./rules_block/fence":52,"./rules_block/heading":53,"./rules_block/hr":54,"./rules_block/html_block":55,"./rules_block/lheading":56,"./rules_block/list":57,"./rules_block/paragraph":58,"./rules_block/reference":59,"./rules_block/state_block":60,"./rules_block/table":61}],43:[function(require,module,exports){
/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/
'use strict';


var Ruler  = require('./ruler');


var _rules = [
  [ 'normalize',      require('./rules_core/normalize')      ],
  [ 'block',          require('./rules_core/block')          ],
  [ 'inline',         require('./rules_core/inline')         ],
  [ 'replacements',   require('./rules_core/replacements')   ],
  [ 'smartquotes',    require('./rules_core/smartquotes')    ],
  [ 'linkify',        require('./rules_core/linkify')        ]
];


/**
 * new Core()
 **/
function Core() {
  /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/
Core.prototype.process = function (state) {
  var i, l, rules;

  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};

Core.prototype.State = require('./rules_core/state_core');


module.exports = Core;

},{"./ruler":49,"./rules_core/block":62,"./rules_core/inline":63,"./rules_core/linkify":64,"./rules_core/normalize":65,"./rules_core/replacements":66,"./rules_core/smartquotes":67,"./rules_core/state_core":68}],44:[function(require,module,exports){
/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/
'use strict';


var Ruler           = require('./ruler');
var replaceEntities = require('./common/utils').replaceEntities;

////////////////////////////////////////////////////////////////////////////////
// Parser rules

var _rules = [
  [ 'text',            require('./rules_inline/text') ],
  [ 'newline',         require('./rules_inline/newline') ],
  [ 'escape',          require('./rules_inline/escape') ],
  [ 'backticks',       require('./rules_inline/backticks') ],
  [ 'strikethrough',   require('./rules_inline/strikethrough') ],
  [ 'emphasis',        require('./rules_inline/emphasis') ],
  [ 'link',            require('./rules_inline/link') ],
  [ 'image',           require('./rules_inline/image') ],
  [ 'autolink',        require('./rules_inline/autolink') ],
  [ 'html_inline',     require('./rules_inline/html_inline') ],
  [ 'entity',          require('./rules_inline/entity') ]
];


var BAD_PROTOCOLS = [ 'vbscript', 'javascript', 'file' ];

function validateLink(url) {
  // Care about digital entities "javascript&#x3A;alert(1)"
  var str = replaceEntities(url);

  str = str.trim().toLowerCase();

  if (str.indexOf(':') >= 0 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) >= 0) {
    return false;
  }
  return true;
}


/**
 * new ParserInline()
 **/
function ParserInline() {
  /**
   * ParserInline#validateLink(url) -> Boolean
   *
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:` and `vbscript:` schemas. You can change this
   * behaviour.
   *
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.inline.validateLink = function () { return true; }
   * ```
   **/
  this.validateLink = validateLink;

  /**
   * ParserInline#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of inline rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
ParserInline.prototype.skipToken = function (state) {
  var i, cached_pos, pos = state.pos,
      rules = this.ruler.getRules(''),
      len = rules.length,
      maxNesting = state.md.options.maxNesting;


  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  /*istanbul ignore else*/
  if (state.level < maxNesting) {
    for (i = 0; i < len; i++) {
      if (rules[i](state, true)) {
        state.cacheSet(pos, state.pos);
        return;
      }
    }
  }

  state.pos++;
  state.cacheSet(pos, state.pos);
};


// Generate tokens for input range
//
ParserInline.prototype.tokenize = function (state) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      end = state.posMax,
      maxNesting = state.md.options.maxNesting;

  while (state.pos < end) {
    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    if (state.level < maxNesting) {
      for (i = 0; i < len; i++) {
        ok = rules[i](state, false);
        if (ok) { break; }
      }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};


/**
 * ParserInline.parse(str, md, env, outTokens)
 *
 * Process input string and push inline tokens into `outTokens`
 **/
ParserInline.prototype.parse = function (str, md, env, outTokens) {
  var state = new this.State(str, md, env, outTokens);

  this.tokenize(state);
};


ParserInline.prototype.State = require('./rules_inline/state_inline');


module.exports = ParserInline;

},{"./common/utils":36,"./ruler":49,"./rules_inline/autolink":69,"./rules_inline/backticks":70,"./rules_inline/emphasis":71,"./rules_inline/entity":72,"./rules_inline/escape":73,"./rules_inline/html_inline":74,"./rules_inline/image":75,"./rules_inline/link":76,"./rules_inline/newline":77,"./rules_inline/state_inline":78,"./rules_inline/strikethrough":79,"./rules_inline/text":80}],45:[function(require,module,exports){
// Commonmark default options

'use strict';


module.exports = {
  options: {
    html:         true,         // Enable HTML tags in source
    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'blockquote',
        'code',
        'fence',
        'heading',
        'hr',
        'html_block',
        'lheading',
        'list',
        'reference',
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'emphasis',
        'entity',
        'escape',
        'html_inline',
        'image',
        'link',
        'newline',
        'text'
      ]
    }
  }
};

},{}],46:[function(require,module,exports){
// markdown-it default options

'use strict';


module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {},
    block: {},
    inline: {}
  }
};

},{}],47:[function(require,module,exports){
// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
// modes. For example, to parse bold/italic only.

'use strict';


module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'text'
      ]
    }
  }
};

},{}],48:[function(require,module,exports){
/**
 * class Renderer
 *
 * Generates HTML from parsed token stream. Each instance has independent
 * copy of rules. Those can be rewritten with ease. Also, you can add new
 * rules if you create plugin and adds new token types.
 **/
'use strict';


var assign          = require('./common/utils').assign;
var unescapeMd      = require('./common/utils').unescapeMd;
var replaceEntities = require('./common/utils').replaceEntities;
var escapeHtml      = require('./common/utils').escapeHtml;


////////////////////////////////////////////////////////////////////////////////

var rules = {};


rules.blockquote_open  = function () { return '<blockquote>\n'; };
rules.blockquote_close = function () { return '</blockquote>\n'; };


rules.code_block = function (tokens, idx /*, options, env */) {
  return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
};
rules.code_inline = function (tokens, idx /*, options, env */) {
  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};


rules.fence = function (tokens, idx, options /*, env, self*/) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix;
  var langName = '';
  var highlighted;

  if (token.params) {
    langName = escapeHtml(replaceEntities(unescapeMd(token.params.split(/\s+/g)[0])));
    langClass = ' class="' + langPrefix + langName + '"';
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }


  return  '<pre><code' + langClass + '>'
        + highlighted
        + '</code></pre>\n';
};


rules.heading_open = function (tokens, idx /*, options, env */) {
  return '<h' + tokens[idx].hLevel + '>';
};
rules.heading_close = function (tokens, idx /*, options, env */) {
  return '</h' + tokens[idx].hLevel + '>\n';
};


rules.hr = function (tokens, idx, options /*, env */) {
  return (options.xhtmlOut ? '<hr />\n' : '<hr>\n');
};


rules.bullet_list_open   = function () { return '<ul>\n'; };
rules.bullet_list_close  = function () { return '</ul>\n'; };
rules.list_item_open     = function (tokens, idx /*, options, env */) {
  var next = tokens[idx + 1];
  if ((next.type === 'list_item_close') ||
      (next.type === 'paragraph_open' && next.tight)) {
    return '<li>';
  }
  return '<li>\n';
};
rules.list_item_close    = function () { return '</li>\n'; };
rules.ordered_list_open  = function (tokens, idx /*, options, env */) {
  if (tokens[idx].order > 1) {
    return '<ol start="' + tokens[idx].order + '">\n';
  }
  return '<ol>\n';
};
rules.ordered_list_close = function () { return '</ol>\n'; };


rules.paragraph_open = function (tokens, idx /*, options, env */) {
  return tokens[idx].tight ? '' : '<p>';
};
rules.paragraph_close = function (tokens, idx /*, options, env */) {
  if (tokens[idx].tight === true) {
    return tokens[idx + 1].type.slice(-5) === 'close' ? '' : '\n';
  }
  return '</p>\n';
};


rules.link_open = function (tokens, idx /*, options, env */) {
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  var target = tokens[idx].target ? (' target="' + escapeHtml(tokens[idx].target) + '"') : '';
  return '<a href="' + escapeHtml(tokens[idx].href) + '"' + title + target + '>';
};
rules.link_close = function (/* tokens, idx, options, env */) {
  return '</a>';
};


rules.image = function (tokens, idx, options, env, self) {
  var src = ' src="' + escapeHtml(tokens[idx].src) + '"';
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  var alt = ' alt="' + self.renderInlineAsText(tokens[idx].tokens, options, env) + '"';
  var suffix = options.xhtmlOut ? ' /' : '';
  return '<img' + src + alt + title + suffix + '>';
};


rules.table_open  = function () { return '<table>\n'; };
rules.table_close = function () { return '</table>\n'; };
rules.thead_open  = function () { return '<thead>\n'; };
rules.thead_close = function () { return '</thead>\n'; };
rules.tbody_open  = function () { return '<tbody>\n'; };
rules.tbody_close = function () { return '</tbody>\n'; };
rules.tr_open     = function () { return '<tr>'; };
rules.tr_close    = function () { return '</tr>\n'; };
rules.th_open     = function (tokens, idx /*, options, env */) {
  if (tokens[idx].align) {
    return '<th style="text-align:' + tokens[idx].align + '">';
  }
  return '<th>';
};
rules.th_close    = function () { return '</th>'; };
rules.td_open     = function (tokens, idx /*, options, env */) {
  if (tokens[idx].align) {
    return '<td style="text-align:' + tokens[idx].align + '">';
  }
  return '<td>';
};
rules.td_close    = function () { return '</td>'; };


rules.strong_open  = function () { return '<strong>'; };
rules.strong_close = function () { return '</strong>'; };


rules.em_open  = function () { return '<em>'; };
rules.em_close = function () { return '</em>'; };


rules.s_open  = function () { return '<s>'; };
rules.s_close = function () { return '</s>'; };


rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};


rules.html_block = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
rules.html_inline = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};


/**
 * new Renderer()
 *
 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
 **/
function Renderer() {

  /**
   * Renderer#rules -> Object
   *
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.renderer.rules.strong_open  = function () { return '<b>'; };
   * md.renderer.rules.strong_close = function () { return '</b>'; };
   *
   * var result = md.renderInline(...);
   * ```
   *
   * Each rule is called as independed static function with fixed signature:
   *
   * ```javascript
   * function my_token_render(tokens, idx, options, env, renderer) {
   *   // ...
   *   return renderedHTML;
   * }
   * ```
   *
   * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
   * for more details and examples.
   **/
  this.rules = assign({}, rules);
}


/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/
Renderer.prototype.renderInline = function (tokens, options, env) {
  var result = '',
      _rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    result += _rules[tokens[i].type](tokens, i, options, env, this);
  }

  return result;
};


/** internal
 * Renderer.renderInlineAsText(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Special kludge for image `alt` attributes to conform CommonMark spec.
 * Don't try to use it! Spec requires to show `alt` content with stripped markup,
 * instead of simple escaping.
 **/
Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
  var result = '',
      _rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'text') {
      result += _rules.text(tokens, i, options, env, this);
    } else if (tokens[i].type === 'image') {
      result += this.renderInlineAsText(tokens[i].tokens, options, env);
    }
  }

  return result;
};


/**
 * Renderer.render(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Takes token stream and generates HTML. Probably, you will never need to call
 * this method directly.
 **/
Renderer.prototype.render = function (tokens, options, env) {
  var i, len,
      result = '',
      _rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else {
      result += _rules[tokens[i].type](tokens, i, options, env, this);
    }
  }

  return result;
};

module.exports = Renderer;

},{"./common/utils":36}],49:[function(require,module,exports){
/**
 * class Ruler
 *
 * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
 * [[MarkdownIt#inline]] to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - cacheing lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
 * [[MarkdownIt.use]].
 **/
'use strict';


/**
 * new Ruler()
 **/
function Ruler() {
  // List of added rules. Each element is:
  //
  // {
  //   name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ]
  // }
  //
  this.__rules__ = [];

  // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - diginal anchor for fast filtering by charcodes.
  //
  this.__cache__ = null;
}

////////////////////////////////////////////////////////////////////////////////
// Helper methods, should not be used directly


// Find rule index by name
//
Ruler.prototype.__find__ = function (name) {
  for (var i = 0; i < this.__rules__.length; i++) {
    if (this.__rules__[i].name === name) {
      return i;
    }
  }
  return -1;
};


// Build rules lookup cache
//
Ruler.prototype.__compile__ = function () {
  var self = this;
  var chains = [ '' ];

  // collect unique names
  self.__rules__.forEach(function (rule) {
    if (!rule.enabled) { return; }

    rule.alt.forEach(function (altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });

  self.__cache__ = {};

  chains.forEach(function (chain) {
    self.__cache__[chain] = [];
    self.__rules__.forEach(function (rule) {
      if (!rule.enabled) { return; }

      if (chain && rule.alt.indexOf(chain) < 0) { return; }

      self.__cache__[chain].push(rule.fn);
    });
  });
};


/**
 * Ruler.at(name, fn [, options])
 * - name (String): rule name to replace.
 * - fn (Function): new rule function.
 * - options (Object): new rule options (not mandatory).
 *
 * Replace rule by name with new function & options. Throws error if name not
 * found.
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * Replace existing typorgapher replacement rule with new one:
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.at('replacements', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.at = function (name, fn, options) {
  var index = this.__find__(name);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + name); }

  this.__rules__[index].fn = fn;
  this.__rules__[index].alt = opt.alt || [];
  this.__cache__ = null;
};


/**
 * Ruler.before(beforeName, ruleName, fn [, options])
 * - beforeName (String): new rule will be added before this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain before one with given name. See also
 * [[Ruler.after]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var index = this.__find__(beforeName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + beforeName); }

  this.__rules__.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.after(afterName, ruleName, fn [, options])
 * - afterName (String): new rule will be added after this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain after one with given name. See also
 * [[Ruler.before]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.inline.ruler.after('text', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var index = this.__find__(afterName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + afterName); }

  this.__rules__.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Ruler.push(ruleName, fn [, options])
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Push new rule to the end of chain. See also
 * [[Ruler.before]], [[Ruler.after]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.push('emphasis', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.enable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to enable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.disable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.enable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and enable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = true;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.enableOnly(list [, ignoreInvalid])
 * - list (String|Array): list of rule names to enable (whitelist).
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names, and disable everything else. If any rule name
 * not found - throw Error. Errors can be disabled by second param.
 *
 * See also [[Ruler.disable]], [[Ruler.enable]].
 **/
Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  this.__rules__.forEach(function (rule) { rule.enabled = false; });

  this.enable(list, ignoreInvalid);
};


/**
 * Ruler.disable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Disable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.enable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.disable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and disable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = false;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.getRules(chainName) -> Array
 *
 * Return array of active functions (rules) for given chain name. It analyzes
 * rules configuration, compiles caches if not exists and returns result.
 *
 * Default chain name is `''` (empty string). It can't be skipped. That's
 * done intentionally, to keep signature monomorphic for high speed.
 **/
Ruler.prototype.getRules = function (chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }

  // Chain can be empty, if rules disabled. But we still have to return Array.
  return this.__cache__[chainName] || [];
};

module.exports = Ruler;

},{}],50:[function(require,module,exports){
// Block quotes

'use strict';


module.exports = function blockquote(state, startLine, endLine, silent) {
  var nextLine, lastLineEmpty, oldTShift, oldBMarks, oldIndent, oldParentType, lines,
      terminatorRules,
      i, l, terminate,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) { return true; }

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20) { pos++; }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  oldBMarks = [ state.bMarks[startLine] ];
  state.bMarks[startLine] = pos;

  // check if we have an empty blockquote
  pos = pos < max ? state.skipSpaces(pos) : pos;
  lastLineEmpty = pos >= max;

  oldTShift = [ state.tShift[startLine] ];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.md.block.ruler.getRules('blockquote');

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E/* > */) {
      // This line is inside the blockquote.

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20) { pos++; }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      pos = pos < max ? state.skipSpaces(pos) : pos;
      lastLineEmpty = pos >= max;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) { break; }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    oldBMarks.push(state.bMarks[nextLine]);
    oldTShift.push(state.tShift[nextLine]);

    // A negative number means that this is a paragraph continuation;
    //
    // Any negative number will do the job here, but it's better for it
    // to be large enough to make any bugs obvious.
    state.tShift[nextLine] = -1337;
  }

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  state.tokens.push({
    type: 'blockquote_open',
    lines: lines = [ startLine, 0 ],
    level: state.level++
  });
  state.md.block.tokenize(state, startLine, nextLine);
  state.tokens.push({
    type: 'blockquote_close',
    level: --state.level
  });
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
  }
  state.blkIndent = oldIndent;

  return true;
};

},{}],51:[function(require,module,exports){
// Code block (4 spaces padded)

'use strict';


module.exports = function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last;

  if (state.tShift[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'code_block',
    content: state.getLines(startLine, last, 4 + state.blkIndent, true),
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],52:[function(require,module,exports){
// fences (``` lang, ~~~ lang)

'use strict';


module.exports = function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  params = state.src.slice(pos, max).trim();

  if (params.indexOf('`') >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.tShift[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);
  state.tokens.push({
    type: 'fence',
    params: params,
    content: state.getLines(startLine + 1, nextLine, len, true),
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],53:[function(require,module,exports){
// heading (#, ##, ...)

'use strict';


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level, tmp,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && ch !== 0x20/* space */)) { return false; }

  if (silent) { return true; }

  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipCharsBack(max, 0x20, pos); // space
  tmp = state.skipCharsBack(max, 0x23, pos); // #
  if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20/* space */) {
    max = tmp;
  }

  state.line = startLine + 1;

  state.tokens.push({ type: 'heading_open',
    hLevel: level,
    lines: [ startLine, state.line ],
    level: state.level
  });

  // only if header is not empty
  if (pos < max) {
    state.tokens.push({
      type: 'inline',
      content: state.src.slice(pos, max).trim(),
      level: state.level + 1,
      lines: [ startLine, state.line ],
      children: []
    });
  }
  state.tokens.push({ type: 'heading_close', hLevel: level, level: state.level });

  return true;
};

},{}],54:[function(require,module,exports){
// Horizontal rule

'use strict';


module.exports = function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  marker = state.src.charCodeAt(pos++);

  // Check hr marker
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x5F/* _ */) {
    return false;
  }

  // markers can be mixed with spaces, but there should be at least 3 one

  cnt = 1;
  while (pos < max) {
    ch = state.src.charCodeAt(pos++);
    if (ch !== marker && ch !== 0x20/* space */) { return false; }
    if (ch === marker) { cnt++; }
  }

  if (cnt < 3) { return false; }

  if (silent) { return true; }

  state.line = startLine + 1;
  state.tokens.push({
    type: 'hr',
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],55:[function(require,module,exports){
// HTML block

'use strict';


var block_names = require('../common/html_blocks');


var HTML_TAG_OPEN_RE = /^<([a-zA-Z]{1,15})[\s\/>]/;
var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z]{1,15})[\s>]/;

function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}

module.exports = function html_block(state, startLine, endLine, silent) {
  var ch, match, nextLine,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      shift = state.tShift[startLine];

  pos += shift;

  if (!state.md.options.html) { return false; }

  if (shift > 3 || pos + 2 >= max) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  ch = state.src.charCodeAt(pos + 1);

  if (ch === 0x21/* ! */ || ch === 0x3F/* ? */) {
    // Directive start / comment start / processing instruction start
    if (silent) { return true; }

  } else if (ch === 0x2F/* / */ || isLetter(ch)) {

    // Probably start or end of tag
    if (ch === 0x2F/* \ */) {
      // closing tag
      match = state.src.slice(pos, max).match(HTML_TAG_CLOSE_RE);
      if (!match) { return false; }
    } else {
      // opening tag
      match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);
      if (!match) { return false; }
    }
    // Make sure tag name is valid
    if (block_names[match[1].toLowerCase()] !== true) { return false; }
    if (silent) { return true; }

  } else {
    return false;
  }

  // If we are here - we detected HTML block.
  // Let's roll down till empty line (block end).
  nextLine = startLine + 1;
  while (nextLine < state.lineMax && !state.isEmpty(nextLine)) {
    nextLine++;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'html_block',
    level: state.level,
    lines: [ startLine, state.line ],
    content: state.getLines(startLine, nextLine, 0, true)
  });

  return true;
};

},{"../common/html_blocks":33}],56:[function(require,module,exports){
// lheading (---, ===)

'use strict';


module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var marker, pos, max,
      next = startLine + 1;

  if (next >= endLine) { return false; }
  if (state.tShift[next] < state.blkIndent) { return false; }

  // Scan next line

  if (state.tShift[next] - state.blkIndent > 3) { return false; }

  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  if (pos >= max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

  pos = state.skipChars(pos, marker);

  pos = state.skipSpaces(pos);

  if (pos < max) { return false; }

  pos = state.bMarks[startLine] + state.tShift[startLine];

  state.line = next + 1;
  state.tokens.push({
    type: 'heading_open',
    hLevel: marker === 0x3D/* = */ ? 1 : 2,
    lines: [ startLine, state.line ],
    level: state.level
  });
  state.tokens.push({
    type: 'inline',
    content: state.src.slice(pos, state.eMarks[startLine]).trim(),
    level: state.level + 1,
    lines: [ startLine, state.line - 1 ],
    children: []
  });
  state.tokens.push({
    type: 'heading_close',
    hLevel: marker === 0x3D/* = */ ? 1 : 2,
    level: state.level
  });

  return true;
};

},{}],57:[function(require,module,exports){
// Lists

'use strict';


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  marker = state.src.charCodeAt(pos++);
  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return -1;
  }

  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
    // " 1.test " - is not a list item
    return -1;
  }

  return pos;
}

// Search `\d+[.)][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // List marker should have at least 2 chars (digit + dot)
  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

  for (;;) {
    // EOL -> fail
    if (pos >= max) { return -1; }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {
      continue;
    }

    // found valid marker
    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
      break;
    }

    return -1;
  }


  if (pos < max && state.src.charCodeAt(pos) !== 0x20/* space */) {
    // " 1.test " - is not a list item
    return -1;
  }
  return pos;
}

function markTightParagraphs(state, idx) {
  var i, l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].tight = true;
      state.tokens[i].tight = true;
      i += 2;
    }
  }
}


module.exports = function list(state, startLine, endLine, silent) {
  var nextLine,
      indent,
      oldTShift,
      oldIndent,
      oldTight,
      oldParentType,
      start,
      posAfterMarker,
      max,
      indentAfterMarker,
      markerValue,
      markerCharCode,
      isOrdered,
      contentStart,
      listTokIdx,
      prevEmptyEnd,
      listLines,
      itemLines,
      tight = true,
      terminatorRules,
      i, l, terminate;

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }

  // We should terminate list on style change. Remember first one to compare.
  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  listTokIdx = state.tokens.length;

  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    state.tokens.push({
      type: 'ordered_list_open',
      order: markerValue,
      lines: listLines = [ startLine, 0 ],
      level: state.level++
    });

  } else {
    state.tokens.push({
      type: 'bullet_list_open',
      lines: listLines = [ startLine, 0 ],
      level: state.level++
    });
  }

  //
  // Iterate list items
  //

  nextLine = startLine;
  prevEmptyEnd = false;
  terminatorRules = state.md.block.ruler.getRules('list');

  while (nextLine < endLine) {
    contentStart = state.skipSpaces(posAfterMarker);
    max = state.eMarks[nextLine];

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = contentStart - posAfterMarker;
    }

    // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)
    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

    // "  -  test"
    //  ^^^^^ - calculating total length of this thing
    indent = (posAfterMarker - state.bMarks[nextLine]) + indentAfterMarker;

    // Run subparser & write tokens
    state.tokens.push({
      type: 'list_item_open',
      lines: itemLines = [ startLine, 0 ],
      level: state.level++
    });

    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldParentType = state.parentType;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.parentType = 'list';

    state.md.block.tokenize(state, startLine, endLine, true);

    // If any of list item is tight, mark list as tight
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish
    prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.tight = oldTight;
    state.parentType = oldParentType;

    state.tokens.push({
      type: 'list_item_close',
      level: --state.level
    });

    nextLine = startLine = state.line;
    itemLines[1] = nextLine;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) { break; }

    if (state.isEmpty(nextLine)) {
      break;
    }

    //
    // Try to check if list is terminated or continued.
    //
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    // fail if terminating block found
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    // fail if list has another type
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
  }

  // Finilize list
  state.tokens.push({
    type: isOrdered ? 'ordered_list_close' : 'bullet_list_close',
    level: --state.level
  });
  listLines[1] = nextLine;

  state.line = nextLine;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};

},{}],58:[function(require,module,exports){
// Paragraph

'use strict';


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine, content, terminate, i, l,
      nextLine = startLine + 1,
      terminatorRules;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  if (nextLine < endLine && !state.isEmpty(nextLine)) {
    terminatorRules = state.md.block.ruler.getRules('paragraph');

    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

      // Some tags can terminate paragraph without empty line.
      terminate = false;
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }
    }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;
  state.tokens.push({
    type: 'paragraph_open',
    tight: false,
    lines: [ startLine, state.line ],
    level: state.level
  });
  state.tokens.push({
    type: 'inline',
    content: content,
    level: state.level + 1,
    lines: [ startLine, state.line ],
    children: []
  });
  state.tokens.push({
    type: 'paragraph_close',
    tight: false,
    level: state.level
  });

  return true;
};

},{}],59:[function(require,module,exports){
'use strict';


var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../common/utils').normalizeReference;


module.exports = function reference(state, startLine, _endLine, silent) {
  var ch,
      destEndPos,
      destEndLineNo,
      endLine,
      href,
      i,
      l,
      label,
      labelEnd,
      res,
      start,
      str,
      terminate,
      terminatorRules,
      title,
      lines = 0,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine],
      nextLine = startLine + 1;

  if (state.src.charCodeAt(pos) !== 0x5B/* [ */) { return false; }

  // Simple check to quickly interrupt scan on [link](url) at the start of line.
  // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
  while (++pos < max) {
    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
        state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
      if (pos + 1 === max) { return false; }
      if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) { return false; }
      break;
    }
  }

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  if (nextLine < endLine && !state.isEmpty(nextLine)) {
    terminatorRules = state.md.block.ruler.getRules('reference');

    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

      // Some tags can terminate paragraph without empty line.
      terminate = false;
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }
    }
  }

  str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  max = str.length;

  for (pos = 1; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x5B /* [ */) {
      return false;
    } else if (ch === 0x5D /* ] */) {
      labelEnd = pos;
      break;
    } else if (ch === 0x0A /* \n */) {
      lines++;
    } else if (ch === 0x5C /* \ */) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }
  }

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false; }

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (ch === 0x20) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  res = parseLinkDestination(str, pos, max);
  if (!res.ok) { return false; }
  if (!state.md.inline.validateLink(res.str)) { return false; }
  href = res.str;
  pos = res.pos;
  lines += res.lines;

  // save cursor state, we could require to rollback later
  destEndPos = pos;
  destEndLineNo = lines;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (ch === 0x20) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  res = parseLinkTitle(str, pos, max);
  if (pos < max && start !== pos && res.ok) {
    title = res.str;
    pos = res.pos;
    lines += res.lines;
  } else {
    title = '';
    pos = destEndPos;
    lines = destEndLineNo;
  }

  // skip trailing spaces until the rest of the line
  while (pos < max && str.charCodeAt(pos) === 0x20/* space */) { pos++; }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    // garbage at the end of the line
    return false;
  }

  if (silent) { return true; }

  label = normalizeReference(str.slice(1, labelEnd));
  if (typeof state.env.references === 'undefined') {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === 'undefined') {
    state.env.references[label] = { title: title, href: href };
  }

  state.line = startLine + lines + 1;
  return true;
};

},{"../common/utils":36,"../helpers/parse_link_destination":38,"../helpers/parse_link_title":40}],60:[function(require,module,exports){
// Parser state class

'use strict';


function StateBlock(src, md, env, tokens) {
  var ch, s, start, pos, len, indent, indent_found;

  this.src = src;

  // link to parser instance
  this.md     = md;

  this.env = env;

  //
  // Internal state vartiables
  //

  this.tokens = tokens;

  this.bMarks = [];  // line begin offsets for fast jumps
  this.eMarks = [];  // line end offsets for fast jumps
  this.tShift = [];  // indent for each line

  // block parser variables
  this.blkIndent  = 0; // required block content indent
                       // (for example, if we are in list)
  this.line       = 0; // line index in src
  this.lineMax    = 0; // lines count
  this.tight      = false;  // loose/tight mode for lists
  this.parentType = 'root'; // if `list`, block parser stops on two newlines
  this.ddIndent   = -1; // indent of the current dd block (-1 if there isn't any)

  this.level = 0;

  // renderer
  this.result = '';

  // Create caches
  // Generate markers.
  s = this.src;
  indent = 0;
  indent_found = false;

  for (start = pos = indent = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (ch === 0x20/* space */) {
        indent++;
        continue;
      } else {
        indent_found = true;
      }
    }

    if (ch === 0x0A || pos === len - 1) {
      if (ch !== 0x0A) { pos++; }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);

      indent_found = false;
      indent = 0;
      start = pos + 1;
    }
  }

  // Push fake entry to simplify cache bounds checks
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);

  this.lineMax = this.bMarks.length - 1; // don't count last fake line
}

StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};

// Skip spaces from given position.
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== 0x20/* space */) { break; }
  }
  return pos;
};

// Skip char codes from given position
StateBlock.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
};

// Skip char codes reverse from given position - 1
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
};

// cut lines range from source.
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i, first, last, queue, shift,
      line = begin;

  if (begin >= end) {
    return '';
  }

  // Opt: don't use push queue for single line;
  if (line + 1 === end) {
    first = this.bMarks[line] + Math.min(this.tShift[line], indent);
    last = keepLastLF ? this.bMarks[end] : this.eMarks[end - 1];
    return this.src.slice(first, last);
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    shift = this.tShift[line];
    if (shift > indent) { shift = indent; }
    if (shift < 0) { shift = 0; }

    first = this.bMarks[line] + shift;

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    queue[i] = this.src.slice(first, last);
  }

  return queue.join('');
};


module.exports = StateBlock;

},{}],61:[function(require,module,exports){
// GFM table, non-standard

'use strict';


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
  var result = [],
      pos = 0,
      max = str.length,
      ch,
      escapes = 0,
      lastPos = 0;

  ch  = str.charCodeAt(pos);

  while (pos < max) {
    if (ch === 0x7c/* | */ && (escapes % 2 === 0)) {
      result.push(str.substring(lastPos, pos));
      lastPos = pos + 1;
    } else if (ch === 0x5c/* \ */) {
      escapes++;
    } else {
      escapes = 0;
    }

    ch  = str.charCodeAt(++pos);
  }

  result.push(str.substring(lastPos));

  return result;
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, rows,
      aligns, t, tableLines, tbodyLines;

  // should have at least three lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.tShift[nextLine] < state.blkIndent) { return false; }

  // first character of the second line should be '|' or '-'

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  lineText = getLine(state, startLine + 1);
  if (!/^[-:| ]+$/.test(lineText)) { return false; }

  rows = lineText.split('|');
  if (rows.length < 2) { return false; }
  aligns = [];
  for (i = 0; i < rows.length; i++) {
    t = rows[i].trim();
    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === rows.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) { return false; }
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) { return false; }
  rows = escapedSplit(lineText.replace(/^\||\|$/g, ''));
  if (aligns.length !== rows.length) { return false; }
  if (silent) { return true; }

  state.tokens.push({
    type: 'table_open',
    lines: tableLines = [ startLine, 0 ],
    level: state.level++
  });
  state.tokens.push({
    type: 'thead_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });

  state.tokens.push({
    type: 'tr_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });
  for (i = 0; i < rows.length; i++) {
    state.tokens.push({
      type: 'th_open',
      align: aligns[i],
      lines: [ startLine, startLine + 1 ],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: rows[i].trim(),
      lines: [ startLine, startLine + 1 ],
      level: state.level,
      children: []
    });
    state.tokens.push({ type: 'th_close', level: --state.level });
  }
  state.tokens.push({ type: 'tr_close', level: --state.level });
  state.tokens.push({ type: 'thead_close', level: --state.level });

  state.tokens.push({
    type: 'tbody_open',
    lines: tbodyLines = [ startLine + 2, 0 ],
    level: state.level++
  });

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    rows = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    // set number of columns to number of columns in header row
    rows.length = aligns.length;

    state.tokens.push({ type: 'tr_open', level: state.level++ });
    for (i = 0; i < rows.length; i++) {
      state.tokens.push({ type: 'td_open', align: aligns[i], level: state.level++ });
      state.tokens.push({
        type: 'inline',
        content: rows[i] ? rows[i].trim() : '',
        level: state.level,
        children: []
      });
      state.tokens.push({ type: 'td_close', level: --state.level });
    }
    state.tokens.push({ type: 'tr_close', level: --state.level });
  }
  state.tokens.push({ type: 'tbody_close', level: --state.level });
  state.tokens.push({ type: 'table_close', level: --state.level });

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};

},{}],62:[function(require,module,exports){
'use strict';

module.exports = function block(state) {

  if (state.inlineMode) {
    state.tokens.push({
      type: 'inline',
      content: state.src,
      level: 0,
      lines: [ 0, 1 ],
      children: []
    });

  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};

},{}],63:[function(require,module,exports){
'use strict';

module.exports = function inline(state) {
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
};

},{}],64:[function(require,module,exports){
// Replace link-like texts with link nodes.
//
// Currently restricted by `inline.validateLink()` to http/https/ftp
//
'use strict';


var Autolinker     = require('autolinker');
var arrayReplaceAt = require('../common/utils').arrayReplaceAt;


var LINK_SCAN_RE = /www|@|\:\/\//;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}

// Stupid fabric to avoid singletons, for thread safety.
// Required for engines like Nashorn.
//
function createLinkifier() {
  var links = [];
  var autolinker = new Autolinker({
    stripPrefix: false,
    url: true,
    email: true,
    twitter: false,
    replaceFn: function (__, match) {
      // Only collect matched strings but don't change anything.
      switch (match.getType()) {
        /*eslint default-case:0*/
        case 'url':
          links.push({
            text: match.matchedText,
            url: match.getUrl()
          });
          break;
        case 'email':
          links.push({
            text: match.matchedText,
            // normalize email protocol
            url: 'mailto:' + match.getEmail().replace(/^mailto:/i, '')
          });
          break;
      }
      return false;
    }
  });

  return {
    links: links,
    autolinker: autolinker
  };
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, text, nodes, ln, pos, level, htmlLinkLevel,
      blockTokens = state.tokens,
      linkifier = null, links, autolinker;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') { continue; }
    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      // Skip content of markdown links
      if (token.type === 'link_close') {
        i--;
        while (tokens[i].level !== token.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (token.type === 'html_inline') {
        if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(token.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (token.type === 'text' && LINK_SCAN_RE.test(token.content)) {

        // Init linkifier in lazy manner, only if required.
        if (!linkifier) {
          linkifier = createLinkifier();
          links = linkifier.links;
          autolinker = linkifier.autolinker;
        }

        text = token.content;
        links.length = 0;
        autolinker.link(text);

        if (!links.length) { continue; }

        // Now split string to nodes
        nodes = [];
        level = token.level;

        for (ln = 0; ln < links.length; ln++) {

          if (!state.md.inline.validateLink(links[ln].url)) { continue; }

          pos = text.indexOf(links[ln].text);

          if (pos) {
            level = level;
            nodes.push({
              type: 'text',
              content: text.slice(0, pos),
              level: level
            });
          }
          nodes.push({
            type: 'link_open',
            href: links[ln].url,
            target: '',
            title: '',
            level: level++
          });
          nodes.push({
            type: 'text',
            content: links[ln].text,
            level: level
          });
          nodes.push({
            type: 'link_close',
            level: --level
          });
          text = text.slice(pos + links[ln].text.length);
        }
        if (text.length) {
          nodes.push({
            type: 'text',
            content: text,
            level: level
          });
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};

},{"../common/utils":36,"autolinker":81}],65:[function(require,module,exports){
// Normalize input string

'use strict';


var TABS_SCAN_RE = /[\n\t]/g;
var NEWLINES_RE  = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
var NULL_RE      = /\u0000/g;


module.exports = function inline(state) {
  var str, lineStart, lastTabPos;

  // Normalize newlines
  str = state.src.replace(NEWLINES_RE, '\n');

  // Replace NULL characters
  str = str.replace(NULL_RE, '\uFFFD');

  // Replace tabs with proper number of spaces (1..4)
  if (str.indexOf('\t') >= 0) {
    lineStart = 0;
    lastTabPos = 0;

    str = str.replace(TABS_SCAN_RE, function (match, offset) {
      var result;
      if (str.charCodeAt(offset) === 0x0A) {
        lineStart = offset + 1;
        lastTabPos = 0;
        return match;
      }
      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
      lastTabPos = offset - lineStart + 1;
      return result;
    });
  }

  state.src = str;
};

},{}],66:[function(require,module,exports){
// Simple typographyc replacements
//
// '' → ‘’
// "" → “”. Set '«»' for Russian, '„“' for German, empty to disable
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  'c': '©',
  'r': '®',
  'p': '§',
  'tm': '™'
};

function replaceScopedAbbr(str) {
  if (str.indexOf('(') < 0) { return str; }

  return str.replace(SCOPED_ABBR_RE, function(match, name) {
    return SCOPED_ABBR[name.toLowerCase()];
  });
}


module.exports = function replace(state) {
  var i, token, text, inlineTokens, blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    inlineTokens = state.tokens[blkIdx].children;

    for (i = inlineTokens.length - 1; i >= 0; i--) {
      token = inlineTokens[i];
      if (token.type === 'text') {
        text = token.content;

        text = replaceScopedAbbr(text);

        if (RARE_RE.test(text)) {
          text = text.replace(/\+-/g, '±')
                      // .., ..., ....... -> …
                      // but ?..... & !..... -> ?.. & !..
                      .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
                      .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                      // em-dash
                      .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
                      // en-dash
                      .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
                      .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
        }

        token.content = text;
      }
    }
  }
};

},{}],67:[function(require,module,exports){
// Convert straight quotation marks to typographic ones
//
'use strict';


var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var PUNCT_RE = /[-\s()\[\]]/;
var APOSTROPHE = '\u2019'; /* ’ */

// This function returns true if the character at `pos`
// could be inside a word.
function isLetter(str, pos) {
  if (pos < 0 || pos >= str.length) { return false; }
  return !PUNCT_RE.test(str[pos]);
}


function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}


module.exports = function smartquotes(state) {
  /*eslint max-depth:0*/
  var i, token, text, t, pos, max, thisLevel, lastSpace, nextSpace, item,
      canOpen, canClose, j, isSingle, blkIdx, tokens,
      stack;

  if (!state.md.options.typographer) { return; }

  stack = [];

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    tokens = state.tokens[blkIdx].children;
    stack.length = 0;

    for (i = 0; i < tokens.length; i++) {
      token = tokens[i];

      if (token.type !== 'text' || QUOTE_TEST_RE.test(token.text)) { continue; }

      thisLevel = tokens[i].level;

      for (j = stack.length - 1; j >= 0; j--) {
        if (stack[j].level <= thisLevel) { break; }
      }
      stack.length = j + 1;

      text = token.content;
      pos = 0;
      max = text.length;

      /*eslint no-labels:0,block-scoped-var:0*/
      OUTER:
      while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        t = QUOTE_RE.exec(text);
        if (!t) { break; }

        lastSpace = !isLetter(text, t.index - 1);
        pos = t.index + 1;
        isSingle = (t[0] === "'");
        nextSpace = !isLetter(text, pos);

        if (!nextSpace && !lastSpace) {
          // middle of word
          if (isSingle) {
            token.content = replaceAt(token.content, t.index, APOSTROPHE);
          }
          continue;
        }

        canOpen = !nextSpace;
        canClose = !lastSpace;

        if (canClose) {
          // this could be a closing quote, rewind the stack to get a match
          for (j = stack.length - 1; j >= 0; j--) {
            item = stack[j];
            if (stack[j].level < thisLevel) { break; }
            if (item.single === isSingle && stack[j].level === thisLevel) {
              item = stack[j];
              if (isSingle) {
                tokens[item.token].content = replaceAt(
                  tokens[item.token].content, item.pos, state.md.options.quotes[2]);
                token.content = replaceAt(
                  token.content, t.index, state.md.options.quotes[3]);
              } else {
                tokens[item.token].content = replaceAt(
                  tokens[item.token].content, item.pos, state.md.options.quotes[0]);
                token.content = replaceAt(token.content, t.index, state.md.options.quotes[1]);
              }
              stack.length = j;
              continue OUTER;
            }
          }
        }

        if (canOpen) {
          stack.push({
            token: i,
            pos: t.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
      }
    }
  }
};

},{}],68:[function(require,module,exports){
// Core state object
//
'use strict';

module.exports = function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md; // link to parser instance
};

},{}],69:[function(require,module,exports){
// Process autolinks '<protocol:...>'

'use strict';

var url_schemas   = require('../common/url_schemas');
var normalizeLink = require('../common/utils').normalizeLink;


/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  linkMatch = tail.match(AUTOLINK_RE);

  if (linkMatch) {
    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) { return false; }

    url = linkMatch[0].slice(1, -1);
    fullUrl = normalizeLink(url);
    if (!state.md.inline.validateLink(url)) { return false; }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        target: '',
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({ type: 'link_close', level: state.level });
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  emailMatch = tail.match(EMAIL_RE);

  if (emailMatch) {

    url = emailMatch[0].slice(1, -1);

    fullUrl = normalizeLink('mailto:' + url);
    if (!state.md.inline.validateLink(fullUrl)) { return false; }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        target: '',
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({ type: 'link_close', level: state.level });
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};

},{"../common/url_schemas":35,"../common/utils":36}],70:[function(require,module,exports){
// Parse backticks

'use strict';

module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        state.push({
          type: 'code_inline',
          content: state.src.slice(pos, matchStart)
                              .replace(/[ \n]+/g, ' ')
                              .trim(),
          level: state.level
        });
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};

},{}],71:[function(require,module,exports){
// Process *this* and _that_
//
'use strict';


var isWhiteSpace   = require('../common/utils').isWhiteSpace;
var isPunctChar    = require('../common/utils').isPunctChar;
var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;


function isAlphaNum(code) {
  return (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) ||
         (code >= 0x41 /* A */ && code <= 0x5A /* Z */) ||
         (code >= 0x61 /* a */ && code <= 0x7A /* z */);
}

// parse sequence of emphasis markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  var pos = start, lastChar, nextChar, count,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { can_open = false; }
  count = pos - start;

  nextChar = pos < max ? state.src.charCodeAt(pos) : -1;

  isLastPunctChar = lastChar >= 0 &&
    (isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar)));
  isNextPunctChar = nextChar >= 0 &&
    (isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar)));
  isLastWhiteSpace = lastChar >= 0 && isWhiteSpace(lastChar);
  isNextWhiteSpace = nextChar >= 0 && isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar || lastChar === -1)) {
      can_open = false;
    }
  }

  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar || nextChar === -1)) {
      can_close = false;
    }
  }

  if (marker === 0x5F /* _ */) {
    // check if we aren't inside the word
    if (isAlphaNum(lastChar)) { can_open = false; }
    if (isAlphaNum(nextChar)) { can_close = false; }
  }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}

module.exports = function emphasis(state, silent) {
  var startCount,
      count,
      found,
      oldCount,
      newCount,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x5F/* _ */ && marker !== 0x2A /* * */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode

  res = scanDelims(state, start);
  startCount = res.delims;
  if (!res.can_open) {
    state.pos += startCount;
    // Earlier we checked !silent, but this implementation does not need it
    state.pending += state.src.slice(start, state.pos);
    return true;
  }

  state.pos = start + startCount;
  stack = [ startCount ];

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;
      if (res.can_close) {
        oldCount = stack.pop();
        newCount = count;

        while (oldCount !== newCount) {
          if (newCount < oldCount) {
            stack.push(oldCount - newCount);
            break;
          }

          // assert(newCount > oldCount)
          newCount -= oldCount;

          if (stack.length === 0) { break; }
          state.pos += oldCount;
          oldCount = stack.pop();
        }

        if (stack.length === 0) {
          startCount = oldCount;
          found = true;
          break;
        }
        state.pos += count;
        continue;
      }

      if (res.can_open) { stack.push(count); }
      state.pos += count;
      continue;
    }

    state.md.inline.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + startCount;

  // Earlier we checked !silent, but this implementation does not need it

  // we have `startCount` starting and ending markers,
  // now trying to serialize them into tokens
  for (count = startCount; count > 1; count -= 2) {
    state.push({ type: 'strong_open', level: state.level++ });
  }
  if (count % 2) { state.push({ type: 'em_open', level: state.level++ }); }

  state.md.inline.tokenize(state);

  if (count % 2) { state.push({ type: 'em_close', level: --state.level }); }
  for (count = startCount; count > 1; count -= 2) {
    state.push({ type: 'strong_close', level: --state.level });
  }

  state.pos = state.posMax + startCount;
  state.posMax = max;
  return true;
};

},{"../common/utils":36}],72:[function(require,module,exports){
// Process html entity - &#123;, &#xAF;, &quot;, ...

'use strict';

var entities          = require('../common/entities');
var has               = require('../common/utils').has;
var isValidEntityCode = require('../common/utils').isValidEntityCode;
var fromCodePoint     = require('../common/utils').fromCodePoint;


var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
var NAMED_RE   = /^&([a-z][a-z0-9]{1,31});/i;


module.exports = function entity(state, silent) {
  var ch, code, match, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

  if (pos + 1 < max) {
    ch = state.src.charCodeAt(pos + 1);

    if (ch === 0x23 /* # */) {
      match = state.src.slice(pos).match(DIGITAL_RE);
      if (match) {
        if (!silent) {
          code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
          state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
        }
        state.pos += match[0].length;
        return true;
      }
    } else {
      match = state.src.slice(pos).match(NAMED_RE);
      if (match) {
        if (has(entities, match[1])) {
          if (!silent) { state.pending += entities[match[1]]; }
          state.pos += match[0].length;
          return true;
        }
      }
    }
  }

  if (!silent) { state.pending += '&'; }
  state.pos++;
  return true;
};

},{"../common/entities":32,"../common/utils":36}],73:[function(require,module,exports){
// Proceess escaped chars and hardbreaks

'use strict';

var ESCAPED = [];

for (var i = 0; i < 256; i++) { ESCAPED.push(0); }

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
  .split('').forEach(function(ch) { ESCAPED[ch.charCodeAt(0)] = 1; });


module.exports = function escape(state, silent) {
  var ch, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ch < 256 && ESCAPED[ch] !== 0) {
      if (!silent) { state.pending += state.src[pos]; }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      }

      pos++;
      // skip leading whitespaces from next line
      while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) { state.pending += '\\'; }
  state.pos++;
  return true;
};

},{}],74:[function(require,module,exports){
// Process html tags

'use strict';


var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function html_inline(state, silent) {
  var ch, match, max, pos = state.pos;

  if (!state.md.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (ch !== 0x21/* ! */ &&
      ch !== 0x3F/* ? */ &&
      ch !== 0x2F/* / */ &&
      !isLetter(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match) { return false; }

  if (!silent) {
    state.push({
      type: 'html_inline',
      content: state.src.slice(pos, pos + match[0].length),
      level: state.level
    });
  }
  state.pos += match[0].length;
  return true;
};

},{"../common/html_re":34}],75:[function(require,module,exports){
// Process ![image](<src> "title")

'use strict';

var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../common/utils').normalizeReference;


module.exports = function image(state, silent) {
  var code,
      href,
      label,
      labelEnd,
      labelStart,
      pos,
      ref,
      res,
      title,
      tokens,
      start,
      oldPos = state.pos,
      max = state.posMax;

  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 2;
  labelEnd = parseLinkLabel(state, state.pos + 1, false);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok && state.md.inline.validateLink(res.str)) {
      href = res.str;
      pos = res.pos;
    } else {
      href = '';
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (code !== 0x20 && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    var newState = new state.md.inline.State(
      state.src.slice(labelStart, labelEnd),
      state.md,
      state.env,
      tokens = []
    );
    newState.md.inline.tokenize(newState);

    state.push({
      type: 'image',
      src: href,
      title: title,
      tokens: tokens,
      level: state.level
    });
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{"../common/utils":36,"../helpers/parse_link_destination":38,"../helpers/parse_link_label":39,"../helpers/parse_link_title":40}],76:[function(require,module,exports){
// Process [link](<to> "stuff")

'use strict';

var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../common/utils').normalizeReference;


module.exports = function link(state, silent) {
  var code,
      href,
      label,
      labelEnd,
      labelStart,
      pos,
      res,
      ref,
      title,
      oldPos = state.pos,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 1;
  labelEnd = parseLinkLabel(state, state.pos, true);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok && state.md.inline.validateLink(res.str)) {
      href = res.str;
      pos = res.pos;
    } else {
      href = '';
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (code !== 0x20 && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    state.push({
      type: 'link_open',
      href: href,
      target: '',
      title: title,
      level: state.level++
    });
    state.md.inline.tokenize(state);
    state.push({ type: 'link_close', level: --state.level });
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{"../common/utils":36,"../helpers/parse_link_destination":38,"../helpers/parse_link_label":39,"../helpers/parse_link_title":40}],77:[function(require,module,exports){
// Proceess '\n'

'use strict';

module.exports = function newline(state, silent) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
        state.pending = state.pending.replace(/ +$/, '');
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push({
          type: 'softbreak',
          level: state.level
        });
      }

    } else {
      state.push({
        type: 'softbreak',
        level: state.level
      });
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

  state.pos = pos;
  return true;
};

},{}],78:[function(require,module,exports){
// Inline parser state

'use strict';


function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;

  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = '';
  this.pendingLevel = 0;

  this.cache = [];        // Stores { start: end } pairs. Useful for backtrack
                          // optimization of pairs parse (emphasis, strikes).
}


// Flush pending text
//
StateInline.prototype.pushPending = function () {
  this.tokens.push({
    type: 'text',
    content: this.pending,
    level: this.pendingLevel
  });
  this.pending = '';
};


// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (token) {
  if (this.pending) {
    this.pushPending();
  }

  this.tokens.push(token);
  this.pendingLevel = this.level;
};


// Store value to cache.
// !!! Implementation has parser-specific optimizations
// !!! keys MUST be integer, >= 0; values MUST be integer, > 0
//
StateInline.prototype.cacheSet = function (key, val) {
  for (var i = this.cache.length; i <= key; i++) {
    this.cache.push(0);
  }

  this.cache[key] = val;
};


// Get cache value
//
StateInline.prototype.cacheGet = function (key) {
  return key < this.cache.length ? this.cache[key] : 0;
};


module.exports = StateInline;

},{}],79:[function(require,module,exports){
// ~~strike through~~
//
'use strict';


var isWhiteSpace   = require('../common/utils').isWhiteSpace;
var isPunctChar    = require('../common/utils').isPunctChar;
var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;


// parse sequence of markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  var pos = start, lastChar, nextChar, count,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { can_open = false; }
  count = pos - start;

  nextChar = pos < max ? state.src.charCodeAt(pos) : -1;

  isLastPunctChar = lastChar >= 0 &&
    (isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar)));
  isNextPunctChar = nextChar >= 0 &&
    (isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar)));
  isLastWhiteSpace = lastChar >= 0 && isWhiteSpace(lastChar);
  isNextWhiteSpace = nextChar >= 0 && isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar || lastChar === -1)) {
      can_open = false;
    }
  }

  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar || nextChar === -1)) {
      can_close = false;
    }
  }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}


module.exports = function strikethrough(state, silent) {
  var startCount,
      count,
      tagCount,
      found,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x7E/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode

  res = scanDelims(state, start);
  startCount = res.delims;
  if (!res.can_open) {
    state.pos += startCount;
    // Earlier we checked !silent, but this implementation does not need it
    state.pending += state.src.slice(start, state.pos);
    return true;
  }

  stack = Math.floor(startCount / 2);
  if (stack <= 0) { return false; }
  state.pos = start + startCount;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;
      tagCount = Math.floor(count / 2);
      if (res.can_close) {
        if (tagCount >= stack) {
          state.pos += count - 2;
          found = true;
          break;
        }
        stack -= tagCount;
        state.pos += count;
        continue;
      }

      if (res.can_open) { stack += tagCount; }
      state.pos += count;
      continue;
    }

    state.md.inline.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  // Earlier we checked !silent, but this implementation does not need it
  state.push({ type: 's_open', level: state.level++ });
  state.md.inline.tokenize(state);
  state.push({ type: 's_close', level: --state.level });

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};

},{"../common/utils":36}],80:[function(require,module,exports){
// Skip text characters for text token, place those to pending buffer
// and increment current pos

'use strict';


// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
function isTerminatorChar(ch) {
  switch (ch) {
    case 0x0A/* \n */:
    case 0x21/* ! */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2D/* - */:
    case 0x3A/* : */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

module.exports = function text(state, silent) {
  var pos = state.pos;

  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }

  if (pos === state.pos) { return false; }

  if (!silent) { state.pending += state.src.slice(state.pos, pos); }

  state.pos = pos;

  return true;
};

},{}],81:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Autolinker'] = factory();
  }
}(this, function () {

	/*!
	 * Autolinker.js
	 * 0.15.2
	 *
	 * Copyright(c) 2015 Gregory Jacobs <greg@greg-jacobs.com>
	 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
	 *
	 * https://github.com/gregjacobs/Autolinker.js
	 */
	/**
	 * @class Autolinker
	 * @extends Object
	 * 
	 * Utility class used to process a given string of text, and wrap the URLs, email addresses, and Twitter handles in 
	 * the appropriate anchor (&lt;a&gt;) tags to turn them into links.
	 * 
	 * Any of the configuration options may be provided in an Object (map) provided to the Autolinker constructor, which
	 * will configure how the {@link #link link()} method will process the links.
	 * 
	 * For example:
	 * 
	 *     var autolinker = new Autolinker( {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *     
	 *     var html = autolinker.link( "Joe went to www.yahoo.com" );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 * 
	 * 
	 * The {@link #static-link static link()} method may also be used to inline options into a single call, which may
	 * be more convenient for one-off uses. For example:
	 * 
	 *     var html = Autolinker.link( "Joe went to www.yahoo.com", {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 * 
	 * 
	 * ## Custom Replacements of Links
	 * 
	 * If the configuration options do not provide enough flexibility, a {@link #replaceFn} may be provided to fully customize
	 * the output of Autolinker. This function is called once for each URL/Email/Twitter handle match that is encountered.
	 * 
	 * For example:
	 * 
	 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
	 *     
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *         
	 *             switch( match.getType() ) {
	 *                 case 'url' : 
	 *                     console.log( "url: ", match.getUrl() );
	 *                     
	 *                     if( match.getUrl().indexOf( 'mysite.com' ) === -1 ) {
	 *                         var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes
	 *                         tag.setAttr( 'rel', 'nofollow' );
	 *                         tag.addClass( 'external-link' );
	 *                         
	 *                         return tag;
	 *                         
	 *                     } else {
	 *                         return true;  // let Autolinker perform its normal anchor tag replacement
	 *                     }
	 *                     
	 *                 case 'email' :
	 *                     var email = match.getEmail();
	 *                     console.log( "email: ", email );
	 *                     
	 *                     if( email === "my@own.address" ) {
	 *                         return false;  // don't auto-link this particular email address; leave as-is
	 *                     } else {
	 *                         return;  // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
	 *                     }
	 *                 
	 *                 case 'twitter' :
	 *                     var twitterHandle = match.getTwitterHandle();
	 *                     console.log( twitterHandle );
	 *                     
	 *                     return '<a href="http://newplace.to.link.twitter.handles.to/">' + twitterHandle + '</a>';
	 *             }
	 *         }
	 *     } );
	 * 
	 * 
	 * The function may return the following values:
	 * 
	 * - `true` (Boolean): Allow Autolinker to replace the match as it normally would.
	 * - `false` (Boolean): Do not replace the current match at all - leave as-is.
	 * - Any String: If a string is returned from the function, the string will be used directly as the replacement HTML for
	 *   the match.
	 * - An {@link Autolinker.HtmlTag} instance, which can be used to build/modify an HTML tag before writing out its HTML text.
	 * 
	 * @constructor
	 * @param {Object} [config] The configuration options for the Autolinker instance, specified in an Object (map).
	 */
	var Autolinker = function( cfg ) {
		Autolinker.Util.assign( this, cfg );  // assign the properties of `cfg` onto the Autolinker instance. Prototype properties will be used for missing configs.

		this.matchValidator = new Autolinker.MatchValidator();
	};


	Autolinker.prototype = {
		constructor : Autolinker,  // fix constructor property

		/**
		 * @cfg {Boolean} urls
		 * 
		 * `true` if miscellaneous URLs should be automatically linked, `false` if they should not be.
		 */
		urls : true,

		/**
		 * @cfg {Boolean} email
		 * 
		 * `true` if email addresses should be automatically linked, `false` if they should not be.
		 */
		email : true,

		/**
		 * @cfg {Boolean} twitter
		 * 
		 * `true` if Twitter handles ("@example") should be automatically linked, `false` if they should not be.
		 */
		twitter : true,

		/**
		 * @cfg {Boolean} newWindow
		 * 
		 * `true` if the links should open in a new window, `false` otherwise.
		 */
		newWindow : true,

		/**
		 * @cfg {Boolean} stripPrefix
		 * 
		 * `true` if 'http://' or 'https://' and/or the 'www.' should be stripped from the beginning of URL links' text, 
		 * `false` otherwise.
		 */
		stripPrefix : true,

		/**
		 * @cfg {Number} truncate
		 * 
		 * A number for how many characters long URLs/emails/twitter handles should be truncated to inside the text of 
		 * a link. If the URL/email/twitter is over this number of characters, it will be truncated to this length by 
		 * adding a two period ellipsis ('..') to the end of the string.
		 * 
		 * For example: A url like 'http://www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look
		 * something like this: 'yahoo.com/some/long/pat..'
		 */

		/**
		 * @cfg {String} className
		 * 
		 * A CSS class name to add to the generated links. This class will be added to all links, as well as this class
		 * plus url/email/twitter suffixes for styling url/email/twitter links differently.
		 * 
		 * For example, if this config is provided as "myLink", then:
		 * 
		 * - URL links will have the CSS classes: "myLink myLink-url"
		 * - Email links will have the CSS classes: "myLink myLink-email", and
		 * - Twitter links will have the CSS classes: "myLink myLink-twitter"
		 */
		className : "",

		/**
		 * @cfg {Function} replaceFn
		 * 
		 * A function to individually process each URL/Email/Twitter match found in the input string.
		 * 
		 * See the class's description for usage.
		 * 
		 * This function is called with the following parameters:
		 * 
		 * @cfg {Autolinker} replaceFn.autolinker The Autolinker instance, which may be used to retrieve child objects from (such
		 *   as the instance's {@link #getTagBuilder tag builder}).
		 * @cfg {Autolinker.match.Match} replaceFn.match The Match instance which can be used to retrieve information about the
		 *   {@link Autolinker.match.Url URL}/{@link Autolinker.match.Email email}/{@link Autolinker.match.Twitter Twitter}
		 *   match that the `replaceFn` is currently processing.
		 */


		/**
		 * @private
		 * @property {RegExp} htmlCharacterEntitiesRegex
		 *
		 * The regular expression that matches common HTML character entities.
		 * 
		 * Ignoring &amp; as it could be part of a query string -- handling it separately.
		 */
		htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,

		/**
		 * @private
		 * @property {RegExp} matcherRegex
		 * 
		 * The regular expression that matches URLs, email addresses, and Twitter handles.
		 * 
		 * This regular expression has the following capturing groups:
		 * 
		 * 1. Group that is used to determine if there is a Twitter handle match (i.e. \@someTwitterUser). Simply check for its 
		 *    existence to determine if there is a Twitter handle match. The next couple of capturing groups give information 
		 *    about the Twitter handle match.
		 * 2. The whitespace character before the \@sign in a Twitter handle. This is needed because there are no lookbehinds in
		 *    JS regular expressions, and can be used to reconstruct the original string in a replace().
		 * 3. The Twitter handle itself in a Twitter match. If the match is '@someTwitterUser', the handle is 'someTwitterUser'.
		 * 4. Group that matches an email address. Used to determine if the match is an email address, as well as holding the full 
		 *    address. Ex: 'me@my.com'
		 * 5. Group that matches a URL in the input text. Ex: 'http://google.com', 'www.google.com', or just 'google.com'.
		 *    This also includes a path, url parameters, or hash anchors. Ex: google.com/path/to/file?q1=1&q2=2#myAnchor
		 * 6. Group that matches a protocol URL (i.e. 'http://google.com'). This is used to match protocol URLs with just a single
		 *    word, like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * 7. A protocol-relative ('//') match for the case of a 'www.' prefixed URL. Will be an empty string if it is not a 
		 *    protocol-relative match. We need to know the character before the '//' in order to determine if it is a valid match
		 *    or the // was in a string we don't want to auto-link.
		 * 8. A protocol-relative ('//') match for the case of a known TLD prefixed URL. Will be an empty string if it is not a 
		 *    protocol-relative match. See #6 for more info. 
		 */
		matcherRegex : (function() {
			var twitterRegex = /(^|[^\w])@(\w{1,15})/,              // For matching a twitter handle. Ex: @gregory_jacobs

			    emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)

			    protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,  // match protocol, allow in format "http://" or "mailto:". However, do not match the first part of something like 'link:http://www.google.com' (i.e. don't match "link:"). Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a protocol here (i.e. ignore a trailing port number in this regex)
			    wwwRegex = /(?:www\.)/,                             // starting with 'www.'
			    domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
			    tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,   // match our known top level domains (TLDs)

			    // Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
			    // http://blog.codinghorror.com/the-problem-with-urls/
			    urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

			return new RegExp( [
				'(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace() 
					// *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and 
					// *** Capturing group $3, which matches the actual twitter handle
					twitterRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $4, which is used to determine an email match
					emailRegex.source,
					domainNameRegex.source,
					tldRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $5, which is used to match a URL
					'(?:', // parens to cover match for protocol (optional), and domain
						'(',  // *** Capturing group $6, for a protocol-prefixed url (ex: http://google.com)
							protocolRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
							'(.?//)?',  // *** Capturing group $7 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							wwwRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for known a TLD url (ex: google.com)
							'(.?//)?',  // *** Capturing group $8 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							domainNameRegex.source,
							tldRegex.source,
						')',
					')',

					'(?:' + urlSuffixRegex.source + ')?',  // match for path, query string, and/or hash anchor - optional
				')'
			].join( "" ), 'gi' );
		} )(),

		/**
		 * @private
		 * @property {RegExp} charBeforeProtocolRelMatchRegex
		 * 
		 * The regular expression used to retrieve the character before a protocol-relative URL match.
		 * 
		 * This is used in conjunction with the {@link #matcherRegex}, which needs to grab the character before a protocol-relative
		 * '//' due to the lack of a negative look-behind in JavaScript regular expressions. The character before the match is stripped
		 * from the URL.
		 */
		charBeforeProtocolRelMatchRegex : /^(.)?\/\//,

		/**
		 * @private
		 * @property {Autolinker.MatchValidator} matchValidator
		 * 
		 * The MatchValidator object, used to filter out any false positives from the {@link #matcherRegex}. See
		 * {@link Autolinker.MatchValidator} for details.
		 */

		/**
		 * @private
		 * @property {Autolinker.HtmlParser} htmlParser
		 * 
		 * The HtmlParser instance used to skip over HTML tags, while finding text nodes to process. This is lazily instantiated
		 * in the {@link #getHtmlParser} method.
		 */

		/**
		 * @private
		 * @property {Autolinker.AnchorTagBuilder} tagBuilder
		 * 
		 * The AnchorTagBuilder instance used to build the URL/email/Twitter replacement anchor tags. This is lazily instantiated
		 * in the {@link #getTagBuilder} method.
		 */


		/**
		 * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
		 * Does not link URLs found within HTML tags.
		 * 
		 * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
		 * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
		 * 
		 * This method finds the text around any HTML elements in the input `textOrHtml`, which will be the text that is processed.
		 * Any original HTML elements will be left as-is, as well as the text that is already wrapped in anchor (&lt;a&gt;) tags.
		 * 
		 * @param {String} textOrHtml The HTML or text to link URLs, email addresses, and Twitter handles within (depending on if
		 *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
		 * @return {String} The HTML, with URLs/emails/Twitter handles automatically linked.
		 */
		link : function( textOrHtml ) {
			var me = this,  // for closure
			    htmlParser = this.getHtmlParser(),
			    htmlCharacterEntitiesRegex = this.htmlCharacterEntitiesRegex,
			    anchorTagStackCount = 0,  // used to only process text around anchor tags, and any inner text/html they may have
			    resultHtml = [];

			htmlParser.parse( textOrHtml, {
				// Process HTML nodes in the input `textOrHtml`
				processHtmlNode : function( tagText, tagName, isClosingTag ) {
					if( tagName === 'a' ) {
						if( !isClosingTag ) {  // it's the start <a> tag
							anchorTagStackCount++;
						} else {   // it's the end </a> tag
							anchorTagStackCount = Math.max( anchorTagStackCount - 1, 0 );  // attempt to handle extraneous </a> tags by making sure the stack count never goes below 0
						}
					}
					resultHtml.push( tagText );  // now add the text of the tag itself verbatim
				},

				// Process text nodes in the input `textOrHtml`
				processTextNode : function( text ) {
					if( anchorTagStackCount === 0 ) {
						// If we're not within an <a> tag, process the text node
						var unescapedText = Autolinker.Util.splitAndCapture( text, htmlCharacterEntitiesRegex );  // split at HTML entities, but include the HTML entities in the results array

						for ( var i = 0, len = unescapedText.length; i < len; i++ ) {
							var textToProcess = unescapedText[ i ],
							    processedTextNode = me.processTextNode( textToProcess );

							resultHtml.push( processedTextNode );
						}

					} else {
						// `text` is within an <a> tag, simply append the text - we do not want to autolink anything 
						// already within an <a>...</a> tag
						resultHtml.push( text );
					}
				}
			} );

			return resultHtml.join( "" );
		},


		/**
		 * Lazily instantiates and returns the {@link #htmlParser} instance for this Autolinker instance.
		 * 
		 * @protected
		 * @return {Autolinker.HtmlParser}
		 */
		getHtmlParser : function() {
			var htmlParser = this.htmlParser;

			if( !htmlParser ) {
				htmlParser = this.htmlParser = new Autolinker.HtmlParser();
			}

			return htmlParser;
		},


		/**
		 * Returns the {@link #tagBuilder} instance for this Autolinker instance, lazily instantiating it
		 * if it does not yet exist.
		 * 
		 * This method may be used in a {@link #replaceFn} to generate the {@link Autolinker.HtmlTag HtmlTag} instance that 
		 * Autolinker would normally generate, and then allow for modifications before returning it. For example:
		 * 
		 *     var html = Autolinker.link( "Test google.com", {
		 *         replaceFn : function( autolinker, match ) {
		 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
		 *             tag.setAttr( 'rel', 'nofollow' );
		 *             
		 *             return tag;
		 *         }
		 *     } );
		 *     
		 *     // generated html:
		 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
		 * 
		 * @return {Autolinker.AnchorTagBuilder}
		 */
		getTagBuilder : function() {
			var tagBuilder = this.tagBuilder;

			if( !tagBuilder ) {
				tagBuilder = this.tagBuilder = new Autolinker.AnchorTagBuilder( {
					newWindow   : this.newWindow,
					truncate    : this.truncate,
					className   : this.className
				} );
			}

			return tagBuilder;
		},


		/**
		 * Process the text that lies inbetween HTML tags. This method does the actual wrapping of URLs with
		 * anchor tags.
		 * 
		 * @private
		 * @param {String} text The text to auto-link.
		 * @return {String} The text with anchor tags auto-filled.
		 */
		processTextNode : function( text ) {
			var me = this;  // for closure

			return text.replace( this.matcherRegex, function( matchStr, $1, $2, $3, $4, $5, $6, $7, $8 ) {
				var matchDescObj = me.processCandidateMatch( matchStr, $1, $2, $3, $4, $5, $6, $7, $8 );  // match description object

				// Return out with no changes for match types that are disabled (url, email, twitter), or for matches that are 
				// invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
				if( !matchDescObj ) {
					return matchStr;

				} else {
					// Generate the replacement text for the match
					var matchReturnVal = me.createMatchReturnVal( matchDescObj.match, matchDescObj.matchStr );
					return matchDescObj.prefixStr + matchReturnVal + matchDescObj.suffixStr;
				}
			} );
		},


		/**
		 * Processes a candidate match from the {@link #matcherRegex}. 
		 * 
		 * Not all matches found by the regex are actual URL/email/Twitter matches, as determined by the {@link #matchValidator}. In
		 * this case, the method returns `null`. Otherwise, a valid Object with `prefixStr`, `match`, and `suffixStr` is returned.
		 * 
		 * @private
		 * @param {String} matchStr The full match that was found by the {@link #matcherRegex}.
		 * @param {String} twitterMatch The matched text of a Twitter handle, if the match is a Twitter match.
		 * @param {String} twitterHandlePrefixWhitespaceChar The whitespace char before the @ sign in a Twitter handle match. This 
		 *   is needed because of no lookbehinds in JS regexes, and is need to re-include the character for the anchor tag replacement.
		 * @param {String} twitterHandle The actual Twitter user (i.e the word after the @ sign in a Twitter match).
		 * @param {String} emailAddressMatch The matched email address for an email address match.
		 * @param {String} urlMatch The matched URL string for a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @param {String} wwwProtocolRelativeMatch The '//' for a protocol-relative match from a 'www' url, with the character that 
		 *   comes before the '//'.
		 * @param {String} tldProtocolRelativeMatch The '//' for a protocol-relative match from a TLD (top level domain) match, with 
		 *   the character that comes before the '//'.
		 *   
		 * @return {Object} A "match description object". This will be `null` if the match was invalid, or if a match type is disabled.
		 *   Otherwise, this will be an Object (map) with the following properties:
		 * @return {String} return.prefixStr The char(s) that should be prepended to the replacement string. These are char(s) that
		 *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
		 *   the replacement stream.
		 * @return {String} return.suffixStr The char(s) that should be appended to the replacement string. These are char(s) that
		 *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
		 *   the replacement stream.
		 * @return {String} return.matchStr The `matchStr`, fixed up to remove characters that are no longer needed (which have been
		 *   added to `prefixStr` and `suffixStr`).
		 * @return {Autolinker.match.Match} return.match The Match object that represents the match that was found.
		 */
		processCandidateMatch : function( 
			matchStr, twitterMatch, twitterHandlePrefixWhitespaceChar, twitterHandle, 
			emailAddressMatch, urlMatch, protocolUrlMatch, wwwProtocolRelativeMatch, tldProtocolRelativeMatch
		) {
			var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch,
			    match,  // Will be an Autolinker.match.Match object

			    prefixStr = "",       // A string to use to prefix the anchor tag that is created. This is needed for the Twitter handle match
			    suffixStr = "";       // A string to suffix the anchor tag that is created. This is used if there is a trailing parenthesis that should not be auto-linked.


			// Return out with `null` for match types that are disabled (url, email, twitter), or for matches that are 
			// invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
			if(
				( twitterMatch && !this.twitter ) || ( emailAddressMatch && !this.email ) || ( urlMatch && !this.urls ) ||
				!this.matchValidator.isValidMatch( urlMatch, protocolUrlMatch, protocolRelativeMatch ) 
			) {
				return null;
			}

			// Handle a closing parenthesis at the end of the match, and exclude it if there is not a matching open parenthesis
			// in the match itself. 
			if( this.matchHasUnbalancedClosingParen( matchStr ) ) {
				matchStr = matchStr.substr( 0, matchStr.length - 1 );  // remove the trailing ")"
				suffixStr = ")";  // this will be added after the generated <a> tag
			}


			if( emailAddressMatch ) {
				match = new Autolinker.match.Email( { matchedText: matchStr, email: emailAddressMatch } );

			} else if( twitterMatch ) {
				// fix up the `matchStr` if there was a preceding whitespace char, which was needed to determine the match 
				// itself (since there are no look-behinds in JS regexes)
				if( twitterHandlePrefixWhitespaceChar ) {
					prefixStr = twitterHandlePrefixWhitespaceChar;
					matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
				}
				match = new Autolinker.match.Twitter( { matchedText: matchStr, twitterHandle: twitterHandle } );

			} else {  // url match
				// If it's a protocol-relative '//' match, remove the character before the '//' (which the matcherRegex needed
				// to match due to the lack of a negative look-behind in JavaScript regular expressions)
				if( protocolRelativeMatch ) {
					var charBeforeMatch = protocolRelativeMatch.match( this.charBeforeProtocolRelMatchRegex )[ 1 ] || "";

					if( charBeforeMatch ) {  // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
						prefixStr = charBeforeMatch;
						matchStr = matchStr.slice( 1 );  // remove the prefixed char from the match
					}
				}

				match = new Autolinker.match.Url( {
					matchedText : matchStr,
					url : matchStr,
					protocolUrlMatch : !!protocolUrlMatch,
					protocolRelativeMatch : !!protocolRelativeMatch,
					stripPrefix : this.stripPrefix
				} );
			}

			return {
				prefixStr : prefixStr,
				suffixStr : suffixStr,
				matchStr  : matchStr,
				match     : match
			};
		},


		/**
		 * Determines if a match found has an unmatched closing parenthesis. If so, this parenthesis will be removed
		 * from the match itself, and appended after the generated anchor tag in {@link #processTextNode}.
		 * 
		 * A match may have an extra closing parenthesis at the end of the match because the regular expression must include parenthesis
		 * for URLs such as "wikipedia.com/something_(disambiguation)", which should be auto-linked. 
		 * 
		 * However, an extra parenthesis *will* be included when the URL itself is wrapped in parenthesis, such as in the case of
		 * "(wikipedia.com/something_(disambiguation))". In this case, the last closing parenthesis should *not* be part of the URL 
		 * itself, and this method will return `true`.
		 * 
		 * @private
		 * @param {String} matchStr The full match string from the {@link #matcherRegex}.
		 * @return {Boolean} `true` if there is an unbalanced closing parenthesis at the end of the `matchStr`, `false` otherwise.
		 */
		matchHasUnbalancedClosingParen : function( matchStr ) {
			var lastChar = matchStr.charAt( matchStr.length - 1 );

			if( lastChar === ')' ) {
				var openParensMatch = matchStr.match( /\(/g ),
				    closeParensMatch = matchStr.match( /\)/g ),
				    numOpenParens = ( openParensMatch && openParensMatch.length ) || 0,
				    numCloseParens = ( closeParensMatch && closeParensMatch.length ) || 0;

				if( numOpenParens < numCloseParens ) {
					return true;
				}
			}

			return false;
		},


		/**
		 * Creates the return string value for a given match in the input string, for the {@link #processTextNode} method.
		 * 
		 * This method handles the {@link #replaceFn}, if one was provided.
		 * 
		 * @private
		 * @param {Autolinker.match.Match} match The Match object that represents the match.
		 * @param {String} matchStr The original match string, after having been preprocessed to fix match edge cases (see
		 *   the `prefixStr` and `suffixStr` vars in {@link #processTextNode}.
		 * @return {String} The string that the `match` should be replaced with. This is usually the anchor tag string, but
		 *   may be the `matchStr` itself if the match is not to be replaced.
		 */
		createMatchReturnVal : function( match, matchStr ) {
			// Handle a custom `replaceFn` being provided
			var replaceFnResult;
			if( this.replaceFn ) {
				replaceFnResult = this.replaceFn.call( this, this, match );  // Autolinker instance is the context, and the first arg
			}

			if( typeof replaceFnResult === 'string' ) {
				return replaceFnResult;  // `replaceFn` returned a string, use that

			} else if( replaceFnResult === false ) {
				return matchStr;  // no replacement for the match

			} else if( replaceFnResult instanceof Autolinker.HtmlTag ) {
				return replaceFnResult.toString();

			} else {  // replaceFnResult === true, or no/unknown return value from function
				// Perform Autolinker's default anchor tag generation
				var tagBuilder = this.getTagBuilder(),
				    anchorTag = tagBuilder.build( match );  // returns an Autolinker.HtmlTag instance

				return anchorTag.toString();
			}
		}

	};


	/**
	 * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
	 * Does not link URLs found within HTML tags.
	 * 
	 * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
	 * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
	 * 
	 * Example:
	 * 
	 *     var linkedText = Autolinker.link( "Go to google.com", { newWindow: false } );
	 *     // Produces: "Go to <a href="http://google.com">google.com</a>"
	 * 
	 * @static
	 * @param {String} textOrHtml The HTML or text to find URLs, email addresses, and Twitter handles within (depending on if
	 *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
	 * @param {Object} [options] Any of the configuration options for the Autolinker class, specified in an Object (map).
	 *   See the class description for an example call.
	 * @return {String} The HTML text, with URLs automatically linked
	 */
	Autolinker.link = function( textOrHtml, options ) {
		var autolinker = new Autolinker( options );
		return autolinker.link( textOrHtml );
	};


	// Namespace for `match` classes
	Autolinker.match = {};
	/*global Autolinker */
	/*jshint eqnull:true, boss:true */
	/**
	 * @class Autolinker.Util
	 * @singleton
	 * 
	 * A few utility methods for Autolinker.
	 */
	Autolinker.Util = {

		/**
		 * @property {Function} abstractMethod
		 * 
		 * A function object which represents an abstract method.
		 */
		abstractMethod : function() { throw "abstract"; },


		/**
		 * Assigns (shallow copies) the properties of `src` onto `dest`.
		 * 
		 * @param {Object} dest The destination object.
		 * @param {Object} src The source object.
		 * @return {Object} The destination object (`dest`)
		 */
		assign : function( dest, src ) {
			for( var prop in src ) {
				if( src.hasOwnProperty( prop ) ) {
					dest[ prop ] = src[ prop ];
				}
			}

			return dest;
		},


		/**
		 * Extends `superclass` to create a new subclass, adding the `protoProps` to the new subclass's prototype.
		 * 
		 * @param {Function} superclass The constructor function for the superclass.
		 * @param {Object} protoProps The methods/properties to add to the subclass's prototype. This may contain the
		 *   special property `constructor`, which will be used as the new subclass's constructor function.
		 * @return {Function} The new subclass function.
		 */
		extend : function( superclass, protoProps ) {
			var superclassProto = superclass.prototype;

			var F = function() {};
			F.prototype = superclassProto;

			var subclass;
			if( protoProps.hasOwnProperty( 'constructor' ) ) {
				subclass = protoProps.constructor;
			} else {
				subclass = function() { superclassProto.constructor.apply( this, arguments ); };
			}

			var subclassProto = subclass.prototype = new F();  // set up prototype chain
			subclassProto.constructor = subclass;  // fix constructor property
			subclassProto.superclass = superclassProto;

			delete protoProps.constructor;  // don't re-assign constructor property to the prototype, since a new function may have been created (`subclass`), which is now already there
			Autolinker.Util.assign( subclassProto, protoProps );

			return subclass;
		},


		/**
		 * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
		 * end of the string (by default, two periods: '..'). If the `str` length does not exceed 
		 * `len`, the string will be returned unchanged.
		 * 
		 * @param {String} str The string to truncate and add an ellipsis to.
		 * @param {Number} truncateLen The length to truncate the string at.
		 * @param {String} [ellipsisChars=..] The ellipsis character(s) to add to the end of `str`
		 *   when truncated. Defaults to '..'
		 */
		ellipsis : function( str, truncateLen, ellipsisChars ) {
			if( str.length > truncateLen ) {
				ellipsisChars = ( ellipsisChars == null ) ? '..' : ellipsisChars;
				str = str.substring( 0, truncateLen - ellipsisChars.length ) + ellipsisChars;
			}
			return str;
		},


		/**
		 * Supports `Array.prototype.indexOf()` functionality for old IE (IE8 and below).
		 * 
		 * @param {Array} arr The array to find an element of.
		 * @param {*} element The element to find in the array, and return the index of.
		 * @return {Number} The index of the `element`, or -1 if it was not found.
		 */
		indexOf : function( arr, element ) {
			if( Array.prototype.indexOf ) {
				return arr.indexOf( element );

			} else {
				for( var i = 0, len = arr.length; i < len; i++ ) {
					if( arr[ i ] === element ) return i;
				}
				return -1;
			}
		},



		/**
		 * Performs the functionality of what modern browsers do when `String.prototype.split()` is called
		 * with a regular expression that contains capturing parenthesis.
		 * 
		 * For example:
		 * 
		 *     // Modern browsers: 
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', ',', 'b', ',', 'c' ]
		 *     
		 *     // Old IE (including IE8):
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', 'b', 'c' ]
		 *     
		 * This method emulates the functionality of modern browsers for the old IE case.
		 * 
		 * @param {String} str The string to split.
		 * @param {RegExp} splitRegex The regular expression to split the input `str` on. The splitting
		 *   character(s) will be spliced into the array, as in the "modern browsers" example in the 
		 *   description of this method. 
		 *   Note #1: the supplied regular expression **must** have the 'g' flag specified.
		 *   Note #2: for simplicity's sake, the regular expression does not need 
		 *   to contain capturing parenthesis - it will be assumed that any match has them.
		 * @return {String[]} The split array of strings, with the splitting character(s) included.
		 */
		splitAndCapture : function( str, splitRegex ) {
			if( !splitRegex.global ) throw new Error( "`splitRegex` must have the 'g' flag set" );

			var result = [],
			    lastIdx = 0,
			    match;

			while( match = splitRegex.exec( str ) ) {
				result.push( str.substring( lastIdx, match.index ) );
				result.push( match[ 0 ] );  // push the splitting char(s)

				lastIdx = match.index + match[ 0 ].length;
			}
			result.push( str.substring( lastIdx ) );

			return result;
		}

	};
	/*global Autolinker */
	/**
	 * @private
	 * @class Autolinker.HtmlParser
	 * @extends Object
	 * 
	 * An HTML parser implementation which simply walks an HTML string and calls the provided visitor functions to process 
	 * HTML and text nodes.
	 * 
	 * Autolinker uses this to only link URLs/emails/Twitter handles within text nodes, basically ignoring HTML tags.
	 */
	Autolinker.HtmlParser = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} htmlRegex
		 * 
		 * The regular expression used to pull out HTML tags from a string. Handles namespaced HTML tags and
		 * attribute names, as specified by http://www.w3.org/TR/html-markup/syntax.html.
		 * 
		 * Capturing groups:
		 * 
		 * 1. The "!DOCTYPE" tag name, if a tag is a &lt;!DOCTYPE&gt; tag.
		 * 2. If it is an end tag, this group will have the '/'.
		 * 3. The tag name for all tags (other than the &lt;!DOCTYPE&gt; tag)
		 */
		htmlRegex : (function() {
			var tagNameRegex = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
			    attrNameRegex = /[^\s\0"'>\/=\x01-\x1F\x7F]+/,   // the unicode range accounts for excluding control chars, and the delete char
			    attrValueRegex = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/, // double quoted, single quoted, or unquoted attribute values
			    nameEqualsValueRegex = attrNameRegex.source + '(?:\\s*=\\s*' + attrValueRegex.source + ')?';  // optional '=[value]'

			return new RegExp( [
				// for <!DOCTYPE> tag. Ex: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">) 
				'(?:',
					'<(!DOCTYPE)',  // *** Capturing Group 1 - If it's a doctype tag

						// Zero or more attributes following the tag name
						'(?:',
							'\\s+',  // one or more whitespace chars before an attribute

							// Either:
							// A. attr="value", or 
							// B. "value" alone (To cover example doctype tag: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">) 
							'(?:', nameEqualsValueRegex, '|', attrValueRegex.source + ')',
						')*',
					'>',
				')',

				'|',

				// All other HTML tags (i.e. tags that are not <!DOCTYPE>)
				'(?:',
					'<(/)?',  // Beginning of a tag. Either '<' for a start tag, or '</' for an end tag. 
					          // *** Capturing Group 2: The slash or an empty string. Slash ('/') for end tag, empty string for start or self-closing tag.

						// *** Capturing Group 3 - The tag name
						'(' + tagNameRegex.source + ')',

						// Zero or more attributes following the tag name
						'(?:',
							'\\s+',                // one or more whitespace chars before an attribute
							nameEqualsValueRegex,  // attr="value" (with optional ="value" part)
						')*',

						'\\s*/?',  // any trailing spaces and optional '/' before the closing '>'
					'>',
				')'
			].join( "" ), 'gi' );
		} )(),


		/**
		 * Walks an HTML string, calling the `options.processHtmlNode` function for each HTML tag that is encountered, and calling
		 * the `options.processTextNode` function when each text around HTML tags is encountered.
		 * 
		 * @param {String} html The HTML to parse.
		 * @param {Object} [options] An Object (map) which may contain the following properties:
		 * 
		 * @param {Function} [options.processHtmlNode] A visitor function which allows processing of an encountered HTML node.
		 *   This function is called with the following arguments:
		 * @param {String} [options.processHtmlNode.tagText] The HTML tag text that was found.
		 * @param {String} [options.processHtmlNode.tagName] The tag name for the HTML tag that was found. Ex: 'a' for an anchor tag.
		 * @param {String} [options.processHtmlNode.isClosingTag] `true` if the tag is a closing tag (ex: &lt;/a&gt;), `false` otherwise.
		 *  
		 * @param {Function} [options.processTextNode] A visitor function which allows processing of an encountered text node.
		 *   This function is called with the following arguments:
		 * @param {String} [options.processTextNode.text] The text node that was matched.
		 */
		parse : function( html, options ) {
			options = options || {};

			var processHtmlNodeVisitor = options.processHtmlNode || function() {},
			    processTextNodeVisitor = options.processTextNode || function() {},
			    htmlRegex = this.htmlRegex,
			    currentResult,
			    lastIndex = 0;

			// Loop over the HTML string, ignoring HTML tags, and processing the text that lies between them,
			// wrapping the URLs in anchor tags
			while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
				var tagText = currentResult[ 0 ],
				    tagName = currentResult[ 1 ] || currentResult[ 3 ],  // The <!DOCTYPE> tag (ex: "!DOCTYPE"), or another tag (ex: "a") 
				    isClosingTag = !!currentResult[ 2 ],
				    inBetweenTagsText = html.substring( lastIndex, currentResult.index );

				if( inBetweenTagsText ) {
					processTextNodeVisitor( inBetweenTagsText );
				}

				processHtmlNodeVisitor( tagText, tagName.toLowerCase(), isClosingTag );

				lastIndex = currentResult.index + tagText.length;
			}

			// Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
			if( lastIndex < html.length ) {
				var text = html.substring( lastIndex );

				if( text ) {
					processTextNodeVisitor( text );
				}
			}
		}

	} );
	/*global Autolinker */
	/*jshint boss:true */
	/**
	 * @class Autolinker.HtmlTag
	 * @extends Object
	 * 
	 * Represents an HTML tag, which can be used to easily build/modify HTML tags programmatically.
	 * 
	 * Autolinker uses this abstraction to create HTML tags, and then write them out as strings. You may also use
	 * this class in your code, especially within a {@link Autolinker#replaceFn replaceFn}.
	 * 
	 * ## Examples
	 * 
	 * Example instantiation:
	 * 
	 *     var tag = new Autolinker.HtmlTag( {
	 *         tagName : 'a',
	 *         attrs   : { 'href': 'http://google.com', 'class': 'external-link' },
	 *         innerHtml : 'Google'
	 *     } );
	 *     
	 *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
	 *     
	 *     // Individual accessor methods
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 * 
	 * 
	 * Using mutator methods (which may be used in combination with instantiation config properties):
	 * 
	 *     var tag = new Autolinker.HtmlTag();
	 *     tag.setTagName( 'a' );
	 *     tag.setAttr( 'href', 'http://google.com' );
	 *     tag.addClass( 'external-link' );
	 *     tag.setInnerHtml( 'Google' );
	 *     
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 *     
	 *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
	 *     
	 * 
	 * ## Example use within a {@link Autolinker#replaceFn replaceFn}
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance, configured with the Match's href and anchor text
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 *     
	 *     
	 * ## Example use with a new tag for the replacement
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = new Autolinker.HtmlTag( {
	 *                 tagName : 'button',
	 *                 attrs   : { 'title': 'Load URL: ' + match.getAnchorHref() },
	 *                 innerHtml : 'Load URL: ' + match.getAnchorText()
	 *             } );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <button title="Load URL: http://google.com">Load URL: google.com</button>
	 */
	Autolinker.HtmlTag = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} tagName
		 * 
		 * The tag name. Ex: 'a', 'button', etc.
		 * 
		 * Not required at instantiation time, but should be set using {@link #setTagName} before {@link #toString}
		 * is executed.
		 */

		/**
		 * @cfg {Object.<String, String>} attrs
		 * 
		 * An key/value Object (map) of attributes to create the tag with. The keys are the attribute names, and the
		 * values are the attribute values.
		 */

		/**
		 * @cfg {String} innerHtml
		 * 
		 * The inner HTML for the tag. 
		 * 
		 * Note the camel case name on `innerHtml`. Acronyms are camelCased in this utility (such as not to run into the acronym 
		 * naming inconsistency that the DOM developers created with `XMLHttpRequest`). You may alternatively use {@link #innerHTML}
		 * if you prefer, but this one is recommended.
		 */

		/**
		 * @cfg {String} innerHTML
		 * 
		 * Alias of {@link #innerHtml}, accepted for consistency with the browser DOM api, but prefer the camelCased version
		 * for acronym names.
		 */


		/**
		 * @protected
		 * @property {RegExp} whitespaceRegex
		 * 
		 * Regular expression used to match whitespace in a string of CSS classes.
		 */
		whitespaceRegex : /\s+/,


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration properties for this class, in an Object (map)
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );

			this.innerHtml = this.innerHtml || this.innerHTML;  // accept either the camelCased form or the fully capitalized acronym
		},


		/**
		 * Sets the tag name that will be used to generate the tag with.
		 * 
		 * @param {String} tagName
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setTagName : function( tagName ) {
			this.tagName = tagName;
			return this;
		},


		/**
		 * Retrieves the tag name.
		 * 
		 * @return {String}
		 */
		getTagName : function() {
			return this.tagName || "";
		},


		/**
		 * Sets an attribute on the HtmlTag.
		 * 
		 * @param {String} attrName The attribute name to set.
		 * @param {String} attrValue The attribute value to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttr : function( attrName, attrValue ) {
			var tagAttrs = this.getAttrs();
			tagAttrs[ attrName ] = attrValue;

			return this;
		},


		/**
		 * Retrieves an attribute from the HtmlTag. If the attribute does not exist, returns `undefined`.
		 * 
		 * @param {String} name The attribute name to retrieve.
		 * @return {String} The attribute's value, or `undefined` if it does not exist on the HtmlTag.
		 */
		getAttr : function( attrName ) {
			return this.getAttrs()[ attrName ];
		},


		/**
		 * Sets one or more attributes on the HtmlTag.
		 * 
		 * @param {Object.<String, String>} attrs A key/value Object (map) of the attributes to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttrs : function( attrs ) {
			var tagAttrs = this.getAttrs();
			Autolinker.Util.assign( tagAttrs, attrs );

			return this;
		},


		/**
		 * Retrieves the attributes Object (map) for the HtmlTag.
		 * 
		 * @return {Object.<String, String>} A key/value object of the attributes for the HtmlTag.
		 */
		getAttrs : function() {
			return this.attrs || ( this.attrs = {} );
		},


		/**
		 * Sets the provided `cssClass`, overwriting any current CSS classes on the HtmlTag.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to set (overwrite).
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setClass : function( cssClass ) {
			return this.setAttr( 'class', cssClass );
		},


		/**
		 * Convenience method to add one or more CSS classes to the HtmlTag. Will not add duplicate CSS classes.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to add.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		addClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    newClasses = cssClass.split( whitespaceRegex ),
			    newClass;

			while( newClass = newClasses.shift() ) {
				if( indexOf( classes, newClass ) === -1 ) {
					classes.push( newClass );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to remove one or more CSS classes from the HtmlTag.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to remove.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		removeClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    removeClasses = cssClass.split( whitespaceRegex ),
			    removeClass;

			while( classes.length && ( removeClass = removeClasses.shift() ) ) {
				var idx = indexOf( classes, removeClass );
				if( idx !== -1 ) {
					classes.splice( idx, 1 );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to retrieve the CSS class(es) for the HtmlTag, which will each be separated by spaces when
		 * there are multiple.
		 * 
		 * @return {String}
		 */
		getClass : function() {
			return this.getAttrs()[ 'class' ] || "";
		},


		/**
		 * Convenience method to check if the tag has a CSS class or not.
		 * 
		 * @param {String} cssClass The CSS class to check for.
		 * @return {Boolean} `true` if the HtmlTag has the CSS class, `false` otherwise.
		 */
		hasClass : function( cssClass ) {
			return ( ' ' + this.getClass() + ' ' ).indexOf( ' ' + cssClass + ' ' ) !== -1;
		},


		/**
		 * Sets the inner HTML for the tag.
		 * 
		 * @param {String} html The inner HTML to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setInnerHtml : function( html ) {
			this.innerHtml = html;

			return this;
		},


		/**
		 * Retrieves the inner HTML for the tag.
		 * 
		 * @return {String}
		 */
		getInnerHtml : function() {
			return this.innerHtml || "";
		},


		/**
		 * Override of superclass method used to generate the HTML string for the tag.
		 * 
		 * @return {String}
		 */
		toString : function() {
			var tagName = this.getTagName(),
			    attrsStr = this.buildAttrsStr();

			attrsStr = ( attrsStr ) ? ' ' + attrsStr : '';  // prepend a space if there are actually attributes

			return [ '<', tagName, attrsStr, '>', this.getInnerHtml(), '</', tagName, '>' ].join( "" );
		},


		/**
		 * Support method for {@link #toString}, returns the string space-separated key="value" pairs, used to populate 
		 * the stringified HtmlTag.
		 * 
		 * @protected
		 * @return {String} Example return: `attr1="value1" attr2="value2"`
		 */
		buildAttrsStr : function() {
			if( !this.attrs ) return "";  // no `attrs` Object (map) has been set, return empty string

			var attrs = this.getAttrs(),
			    attrsArr = [];

			for( var prop in attrs ) {
				if( attrs.hasOwnProperty( prop ) ) {
					attrsArr.push( prop + '="' + attrs[ prop ] + '"' );
				}
			}
			return attrsArr.join( " " );
		}

	} );
	/*global Autolinker */
	/*jshint scripturl:true */
	/**
	 * @private
	 * @class Autolinker.MatchValidator
	 * @extends Object
	 * 
	 * Used by Autolinker to filter out false positives from the {@link Autolinker#matcherRegex}.
	 * 
	 * Due to the limitations of regular expressions (including the missing feature of look-behinds in JS regular expressions),
	 * we cannot always determine the validity of a given match. This class applies a bit of additional logic to filter out any
	 * false positives that have been matched by the {@link Autolinker#matcherRegex}.
	 */
	Autolinker.MatchValidator = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} invalidProtocolRelMatchRegex
		 * 
		 * The regular expression used to check a potential protocol-relative URL match, coming from the 
		 * {@link Autolinker#matcherRegex}. A protocol-relative URL is, for example, "//yahoo.com"
		 * 
		 * This regular expression checks to see if there is a word character before the '//' match in order to determine if 
		 * we should actually autolink a protocol-relative URL. This is needed because there is no negative look-behind in 
		 * JavaScript regular expressions. 
		 * 
		 * For instance, we want to autolink something like "Go to: //google.com", but we don't want to autolink something 
		 * like "abc//google.com"
		 */
		invalidProtocolRelMatchRegex : /^[\w]\/\//,

		/**
		 * Regex to test for a full protocol, with the two trailing slashes. Ex: 'http://'
		 * 
		 * @private
		 * @property {RegExp} hasFullProtocolRegex
		 */
		hasFullProtocolRegex : /^[A-Za-z][-.+A-Za-z0-9]+:\/\//,

		/**
		 * Regex to find the URI scheme, such as 'mailto:'.
		 * 
		 * This is used to filter out 'javascript:' and 'vbscript:' schemes.
		 * 
		 * @private
		 * @property {RegExp} uriSchemeRegex
		 */
		uriSchemeRegex : /^[A-Za-z][-.+A-Za-z0-9]+:/,

		/**
		 * Regex to determine if at least one word char exists after the protocol (i.e. after the ':')
		 * 
		 * @private
		 * @property {RegExp} hasWordCharAfterProtocolRegex
		 */
		hasWordCharAfterProtocolRegex : /:[^\s]*?[A-Za-z]/,


		/**
		 * Determines if a given match found by {@link Autolinker#processTextNode} is valid. Will return `false` for:
		 * 
		 * 1) URL matches which do not have at least have one period ('.') in the domain name (effectively skipping over 
		 *    matches like "abc:def"). However, URL matches with a protocol will be allowed (ex: 'http://localhost')
		 * 2) URL matches which do not have at least one word character in the domain name (effectively skipping over
		 *    matches like "git:1.0").
		 * 3) A protocol-relative url match (a URL beginning with '//') whose previous character is a word character 
		 *    (effectively skipping over strings like "abc//google.com")
		 * 
		 * Otherwise, returns `true`.
		 * 
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
		 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
		 *   preceding the '//'.
		 * @return {Boolean} `true` if the match given is valid and should be processed, or `false` if the match is invalid and/or 
		 *   should just not be processed.
		 */
		isValidMatch : function( urlMatch, protocolUrlMatch, protocolRelativeMatch ) {
			if(
				( protocolUrlMatch && !this.isValidUriScheme( protocolUrlMatch ) ) ||
				this.urlMatchDoesNotHaveProtocolOrDot( urlMatch, protocolUrlMatch ) ||       // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
				this.urlMatchDoesNotHaveAtLeastOneWordChar( urlMatch, protocolUrlMatch ) ||  // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
				this.isInvalidProtocolRelativeMatch( protocolRelativeMatch )                 // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
			) {
				return false;
			}

			return true;
		},


		/**
		 * Determines if the URI scheme is a valid scheme to be autolinked. Returns `false` if the scheme is 
		 * 'javascript:' or 'vbscript:'
		 * 
		 * @private
		 * @param {String} uriSchemeMatch The match URL string for a full URI scheme match. Ex: 'http://yahoo.com' 
		 *   or 'mailto:a@a.com'.
		 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
		 */
		isValidUriScheme : function( uriSchemeMatch ) {
			var uriScheme = uriSchemeMatch.match( this.uriSchemeRegex )[ 0 ];

			return ( uriScheme !== 'javascript:' && uriScheme !== 'vbscript:' );
		},


		/**
		 * Determines if a URL match does not have either:
		 * 
		 * a) a full protocol (i.e. 'http://'), or
		 * b) at least one dot ('.') in the domain name (for a non-full-protocol match).
		 * 
		 * Either situation is considered an invalid URL (ex: 'git:d' does not have either the '://' part, or at least one dot
		 * in the domain name. If the match was 'git:abc.com', we would consider this valid.)
		 * 
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @return {Boolean} `true` if the URL match does not have a full protocol, or at least one dot ('.') in a non-full-protocol
		 *   match.
		 */
		urlMatchDoesNotHaveProtocolOrDot : function( urlMatch, protocolUrlMatch ) {
			return ( !!urlMatch && ( !protocolUrlMatch || !this.hasFullProtocolRegex.test( protocolUrlMatch ) ) && urlMatch.indexOf( '.' ) === -1 );
		},


		/**
		 * Determines if a URL match does not have at least one word character after the protocol (i.e. in the domain name).
		 * 
		 * At least one letter character must exist in the domain name after a protocol match. Ex: skip over something 
		 * like "git:1.0"
		 * 
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to
		 *   know whether or not we have a protocol in the URL string, in order to check for a word character after the protocol
		 *   separator (':').
		 * @return {Boolean} `true` if the URL match does not have at least one word character in it after the protocol, `false`
		 *   otherwise.
		 */
		urlMatchDoesNotHaveAtLeastOneWordChar : function( urlMatch, protocolUrlMatch ) {
			if( urlMatch && protocolUrlMatch ) {
				return !this.hasWordCharAfterProtocolRegex.test( urlMatch );
			} else {
				return false;
			}
		},


		/**
		 * Determines if a protocol-relative match is an invalid one. This method returns `true` if there is a `protocolRelativeMatch`,
		 * and that match contains a word character before the '//' (i.e. it must contain whitespace or nothing before the '//' in
		 * order to be considered valid).
		 * 
		 * @private
		 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
		 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
		 *   preceding the '//'.
		 * @return {Boolean} `true` if it is an invalid protocol-relative match, `false` otherwise.
		 */
		isInvalidProtocolRelativeMatch : function( protocolRelativeMatch ) {
			return ( !!protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) );
		}

	} );
	/*global Autolinker */
	/*jshint sub:true */
	/**
	 * @protected
	 * @class Autolinker.AnchorTagBuilder
	 * @extends Object
	 * 
	 * Builds anchor (&lt;a&gt;) tags for the Autolinker utility when a match is found.
	 * 
	 * Normally this class is instantiated, configured, and used internally by an {@link Autolinker} instance, but may 
	 * actually be retrieved in a {@link Autolinker#replaceFn replaceFn} to create {@link Autolinker.HtmlTag HtmlTag} instances
	 * which may be modified before returning from the {@link Autolinker#replaceFn replaceFn}. For example:
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 */
	Autolinker.AnchorTagBuilder = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {Boolean} newWindow
		 * @inheritdoc Autolinker#newWindow
		 */

		/**
		 * @cfg {Number} truncate
		 * @inheritdoc Autolinker#truncate
		 */

		/**
		 * @cfg {String} className
		 * @inheritdoc Autolinker#className
		 */


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Generates the actual anchor (&lt;a&gt;) tag to use in place of the matched URL/email/Twitter text,
		 * via its `match` object.
		 * 
		 * @param {Autolinker.match.Match} match The Match instance to generate an anchor tag from.
		 * @return {Autolinker.HtmlTag} The HtmlTag instance for the anchor tag.
		 */
		build : function( match ) {
			var tag = new Autolinker.HtmlTag( {
				tagName   : 'a',
				attrs     : this.createAttrs( match.getType(), match.getAnchorHref() ),
				innerHtml : this.processAnchorText( match.getAnchorText() )
			} );

			return tag;
		},


		/**
		 * Creates the Object (map) of the HTML attributes for the anchor (&lt;a&gt;) tag being generated.
		 * 
		 * @protected
		 * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
		 * @param {String} href The href for the anchor tag.
		 * @return {Object} A key/value Object (map) of the anchor tag's attributes. 
		 */
		createAttrs : function( matchType, anchorHref ) {
			var attrs = {
				'href' : anchorHref  // we'll always have the `href` attribute
			};

			var cssClass = this.createCssClass( matchType );
			if( cssClass ) {
				attrs[ 'class' ] = cssClass;
			}
			if( this.newWindow ) {
				attrs[ 'target' ] = "_blank";
			}

			return attrs;
		},


		/**
		 * Creates the CSS class that will be used for a given anchor tag, based on the `matchType` and the {@link #className}
		 * config.
		 * 
		 * @private
		 * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
		 * @return {String} The CSS class string for the link. Example return: "myLink myLink-url". If no {@link #className}
		 *   was configured, returns an empty string.
		 */
		createCssClass : function( matchType ) {
			var className = this.className;

			if( !className ) 
				return "";
			else
				return className + " " + className + "-" + matchType;  // ex: "myLink myLink-url", "myLink myLink-email", or "myLink myLink-twitter"
		},


		/**
		 * Processes the `anchorText` by truncating the text according to the {@link #truncate} config.
		 * 
		 * @private
		 * @param {String} anchorText The anchor tag's text (i.e. what will be displayed).
		 * @return {String} The processed `anchorText`.
		 */
		processAnchorText : function( anchorText ) {
			anchorText = this.doTruncate( anchorText );

			return anchorText;
		},


		/**
		 * Performs the truncation of the `anchorText`, if the `anchorText` is longer than the {@link #truncate} option.
		 * Truncates the text to 2 characters fewer than the {@link #truncate} option, and adds ".." to the end.
		 * 
		 * @private
		 * @param {String} text The anchor tag's text (i.e. what will be displayed).
		 * @return {String} The truncated anchor text.
		 */
		doTruncate : function( anchorText ) {
			return Autolinker.Util.ellipsis( anchorText, this.truncate || Number.POSITIVE_INFINITY );
		}

	} );
	/*global Autolinker */
	/**
	 * @abstract
	 * @class Autolinker.match.Match
	 * 
	 * Represents a match found in an input string which should be Autolinked. A Match object is what is provided in a 
	 * {@link Autolinker#replaceFn replaceFn}, and may be used to query for details about the match.
	 * 
	 * For example:
	 * 
	 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
	 *     
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *         
	 *             switch( match.getType() ) {
	 *                 case 'url' : 
	 *                     console.log( "url: ", match.getUrl() );
	 *                     
	 *                 case 'email' :
	 *                     console.log( "email: ", match.getEmail() );
	 *                     
	 *                 case 'twitter' :
	 *                     console.log( "twitter: ", match.getTwitterHandle() );
	 *             }
	 *         }
	 *     } );
	 *     
	 * See the {@link Autolinker} class for more details on using the {@link Autolinker#replaceFn replaceFn}.
	 */
	Autolinker.match.Match = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} matchedText (required)
		 * 
		 * The original text that was matched.
		 */


		/**
		 * @constructor
		 * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getType : Autolinker.Util.abstractMethod,


		/**
		 * Returns the original text that was matched.
		 * 
		 * @return {String}
		 */
		getMatchedText : function() {
			return this.matchedText;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorHref : Autolinker.Util.abstractMethod,


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorText : Autolinker.Util.abstractMethod

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Email
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Email match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Email = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} email (required)
		 * 
		 * The email address that was matched.
		 */


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'email';
		},


		/**
		 * Returns the email address that was matched.
		 * 
		 * @return {String}
		 */
		getEmail : function() {
			return this.email;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'mailto:' + this.email;
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return this.email;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Twitter
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Twitter match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Twitter = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} twitterHandle (required)
		 * 
		 * The Twitter handle that was matched.
		 */


		/**
		 * Returns the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'twitter';
		},


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getTwitterHandle : function() {
			return this.twitterHandle;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'https://twitter.com/' + this.twitterHandle;
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return '@' + this.twitterHandle;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Url
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Url match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Url = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} url (required)
		 * 
		 * The url that was matched.
		 */

		/**
		 * @cfg {Boolean} protocolUrlMatch (required)
		 * 
		 * `true` if the URL is a match which already has a protocol (i.e. 'http://'), `false` if the match was from a 'www' or
		 * known TLD match.
		 */

		/**
		 * @cfg {Boolean} protocolRelativeMatch (required)
		 * 
		 * `true` if the URL is a protocol-relative match. A protocol-relative match is a URL that starts with '//',
		 * and will be either http:// or https:// based on the protocol that the site is loaded under.
		 */

		/**
		 * @cfg {Boolean} stripPrefix (required)
		 * @inheritdoc Autolinker#stripPrefix
		 */


		/**
		 * @private
		 * @property {RegExp} urlPrefixRegex
		 * 
		 * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
		 */
		urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,

		/**
		 * @private
		 * @property {RegExp} protocolRelativeRegex
		 * 
		 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
		 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
		 */
		protocolRelativeRegex : /^\/\//,

		/**
		 * @private
		 * @property {Boolean} protocolPrepended
		 * 
		 * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
		 * {@link #url} did not have a protocol)
		 */
		protocolPrepended : false,


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'url';
		},


		/**
		 * Returns the url that was matched, assuming the protocol to be 'http://' if the original
		 * match was missing a protocol.
		 * 
		 * @return {String}
		 */
		getUrl : function() {
			var url = this.url;

			// if the url string doesn't begin with a protocol, assume 'http://'
			if( !this.protocolRelativeMatch && !this.protocolUrlMatch && !this.protocolPrepended ) {
				url = this.url = 'http://' + url;

				this.protocolPrepended = true;
			}

			return url;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			var url = this.getUrl();

			return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html 
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			var anchorText = this.getUrl();

			if( this.protocolRelativeMatch ) {
				// Strip off any protocol-relative '//' from the anchor text
				anchorText = this.stripProtocolRelativePrefix( anchorText );
			}
			if( this.stripPrefix ) {
				anchorText = this.stripUrlPrefix( anchorText );
			}
			anchorText = this.removeTrailingSlash( anchorText );  // remove trailing slash, if there is one

			return anchorText;
		},


		// ---------------------------------------

		// Utility Functionality

		/**
		 * Strips the URL prefix (such as "http://" or "https://") from the given text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   url prefix (such as stripping off "http://")
		 * @return {String} The `anchorText`, with the prefix stripped.
		 */
		stripUrlPrefix : function( text ) {
			return text.replace( this.urlPrefixRegex, '' );
		},


		/**
		 * Strips any protocol-relative '//' from the anchor text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   protocol-relative prefix (such as stripping off "//")
		 * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
		 */
		stripProtocolRelativePrefix : function( text ) {
			return text.replace( this.protocolRelativeRegex, '' );
		},


		/**
		 * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
		 * 
		 * @private
		 * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
		 *   slash ('/') that may exist.
		 * @return {String} The `anchorText`, with the trailing slash removed.
		 */
		removeTrailingSlash : function( anchorText ) {
			if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
				anchorText = anchorText.slice( 0, -1 );
			}
			return anchorText;
		}

	} );

	return Autolinker;


}));

},{}],82:[function(require,module,exports){
module.exports=require(28)
},{"/Users/nico/dev/megamark/node_modules/linkify-it/node_modules/uc.micro/categories/P/regex.js":28}],83:[function(require,module,exports){
'use strict';

// the majority of this file was taken from markdown-it's linkify method
// https://github.com/markdown-it/markdown-it/blob/9159018e2a446fc97eb3c6e509a8cdc4cc3c358a/lib/rules_core/linkify.js

var linkify = require('linkify-it')();

function arrayReplaceAt (a, i, middle) {
  var left = a.slice(0, i);
  var right = a.slice(i + 1);
  return left.concat(middle, right);
}

function isLinkOpen (str) {
  return /^<a[>\s]/i.test(str);
}

function isLinkClose (str) {
  return /^<\/a\s*>/i.test(str);
}

function tokenizeLinks (state, context) {
  var i;
  var j;
  var l;
  var tokens;
  var token;
  var nodes;
  var ln;
  var text;
  var pos;
  var lastPos;
  var level;
  var links;
  var htmlLinkLevel;
  var blockTokens = state.tokens;
  var html;

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') {
      continue;
    }

    tokens = blockTokens[j].children;
    htmlLinkLevel = 0;

    // we scan from the end, to keep position when new tags added.
    // use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      // skip content of markdown links
      if (token.type === 'link_close') {
        i--;
        while (tokens[i].level !== token.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      if (token.type === 'html_inline') { // skip content of html tag links
        if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(token.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) {
        continue;
      }
      if (token.type !== 'text' || !linkify.test(token.content)) {
        continue;
      }

      text = token.content;
      links = linkify.match(text);
      nodes = [];
      level = token.level;
      lastPos = 0;

      for (ln = 0; ln < links.length; ln++) { // split string to nodes
        if (!state.md.inline.validateLink(links[ln].url)) {
          continue;
        }

        pos = links[ln].index;

        if (pos > lastPos) {
          level = level;
          nodes.push({
            type: 'text',
            content: text.slice(lastPos, pos),
            level: level
          });
        }

        html = null;

        context.linkifiers.some(runUserLinkifier);

        if (typeof html === 'string') {
          nodes.push({
            type: 'html_block',
            content: html,
            level: level
          });
        } else {
          nodes.push({
            type: 'link_open',
            href: links[ln].url,
            target: '',
            title: '',
            level: level++
          });
          nodes.push({
            type: 'text',
            content: links[ln].text,
            level: level
          });
          nodes.push({
            type: 'link_close',
            level: --level
          });
        }

        lastPos = links[ln].lastIndex;
      }

      if (lastPos < text.length) {
        nodes.push({
          type: 'text',
          content: text.slice(lastPos),
          level: level
        });
      }

      blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
    }
  }

  function runUserLinkifier (linkifier) {
    html = linkifier(links[ln].url, links[ln].text);
    return typeof html === 'string';
  }
}

module.exports = tokenizeLinks;

},{"linkify-it":24}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMjYvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYXJrZG93bi5qcyIsIm1lZ2FtYXJrLmpzIiwibm9kZV9tb2R1bGVzL2Fzc2lnbm1lbnQvYXNzaWdubWVudC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2hpZ2hsaWdodC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvbGFuZ3VhZ2VzL2Jhc2guanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvY3NzLmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvbGFuZ3VhZ2VzL2h0dHAuanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvaW5pLmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHQuanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2xhbmd1YWdlcy9tYXJrZG93bi5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2xhbmd1YWdlcy94bWwuanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzLXRva2Vucy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvYXR0cmlidXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvZGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMvaW5zYW5lL2VsZW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS9pbnNhbmUuanMiLCJub2RlX21vZHVsZXMvaW5zYW5lL2xvd2VyY2FzZS5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvcGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS9zYW5pdGl6ZXIuanMiLCJub2RlX21vZHVsZXMvaW5zYW5lL3NoZS5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvdG9NYXAuanMiLCJub2RlX21vZHVsZXMvbGlua2lmeS1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9saW5raWZ5LWl0L2xpYi9yZS5qcyIsIm5vZGVfbW9kdWxlcy9saW5raWZ5LWl0L25vZGVfbW9kdWxlcy91Yy5taWNyby9jYXRlZ29yaWVzL0NjL3JlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtpZnktaXQvbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2YvcmVnZXguanMiLCJub2RlX21vZHVsZXMvbGlua2lmeS1pdC9ub2RlX21vZHVsZXMvdWMubWljcm8vY2F0ZWdvcmllcy9QL3JlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtpZnktaXQvbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvWi9yZWdleC5qcyIsIm5vZGVfbW9kdWxlcy9saW5raWZ5LWl0L25vZGVfbW9kdWxlcy91Yy5taWNyby9wcm9wZXJ0aWVzL0FueS9yZWdleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvY29tbW9uL2VudGl0aWVzLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9jb21tb24vaHRtbF9ibG9ja3MuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL2NvbW1vbi9odG1sX3JlLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9jb21tb24vdXJsX3NjaGVtYXMuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL2NvbW1vbi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvaGVscGVycy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9oZWxwZXJzL3BhcnNlX2xpbmtfbGFiZWwuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL2hlbHBlcnMvcGFyc2VfbGlua190aXRsZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3BhcnNlcl9ibG9jay5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcGFyc2VyX2NvcmUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3BhcnNlcl9pbmxpbmUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3ByZXNldHMvY29tbW9ubWFyay5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcHJlc2V0cy9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9wcmVzZXRzL3plcm8uanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3JlbmRlcmVyLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlci5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svYmxvY2txdW90ZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svZmVuY2UuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL2hlYWRpbmcuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL2hyLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9odG1sX2Jsb2NrLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9saGVhZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svcGFyYWdyYXBoLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9yZWZlcmVuY2UuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL3N0YXRlX2Jsb2NrLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay90YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfY29yZS9ibG9jay5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfY29yZS9pbmxpbmUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2NvcmUvbGlua2lmeS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfY29yZS9ub3JtYWxpemUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2NvcmUvcmVwbGFjZW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL3NtYXJ0cXVvdGVzLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL3N0YXRlX2NvcmUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2lubGluZS9hdXRvbGluay5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2JhY2t0aWNrcy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2VtcGhhc2lzLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvZW50aXR5LmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvaHRtbF9pbmxpbmUuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2lubGluZS9pbWFnZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2xpbmsuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbGliL3J1bGVzX2lubGluZS9uZXdsaW5lLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvc3RhdGVfaW5saW5lLmpzIiwibm9kZV9tb2R1bGVzL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvc3RyaWtldGhyb3VnaC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL3RleHQuanMiLCJub2RlX21vZHVsZXMvbWFya2Rvd24taXQvbm9kZV9tb2R1bGVzL2F1dG9saW5rZXIvZGlzdC9BdXRvbGlua2VyLmpzIiwidG9rZW5pemVMaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0bEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzM4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBNYXJrZG93bkl0ID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKTtcbnZhciBobGpzID0gcmVxdWlyZSgnaGlnaGxpZ2h0LmpzJyk7XG52YXIgdG9rZW5pemVMaW5rcyA9IHJlcXVpcmUoJy4vdG9rZW5pemVMaW5rcycpO1xudmFyIG1kID0gbmV3IE1hcmtkb3duSXQoe1xuICBodG1sOiB0cnVlLFxuICB4aHRtbE91dDogdHJ1ZSxcbiAgbGlua2lmeTogdHJ1ZSxcbiAgdHlwb2dyYXBoZXI6IHRydWUsXG4gIGxhbmdQcmVmaXg6ICdtZC1sYW5nLWFsaWFzLScsXG4gIGhpZ2hsaWdodDogaGlnaGxpZ2h0XG59KTtcbnZhciByYWxpYXMgPSAvIGNsYXNzPVwibWQtbGFuZy1hbGlhcy0oW15cIl0rKVwiLztcbnZhciBhbGlhc2VzID0ge1xuICBqczogJ2phdmFzY3JpcHQnLFxuICBtZDogJ21hcmtkb3duJyxcbiAgaHRtbDogJ3htbCcsIC8vIG5leHQgYmVzdCB0aGluZ1xuICBqYWRlOiAnY3NzJyAvLyBuZXh0IGJlc3QgdGhpbmdcbn07XG52YXIgYmFzZWJsb2NrID0gbWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jaztcbnZhciBiYXNlaW5saW5lID0gbWQucmVuZGVyZXIucnVsZXMuY29kZV9pbmxpbmU7XG52YXIgYmFzZWZlbmNlID0gbWQucmVuZGVyZXIucnVsZXMuZmVuY2U7XG52YXIgYmFzZXRleHQgPSBtZC5yZW5kZXJlci5ydWxlcy50ZXh0O1xudmFyIHRleHRjYWNoZWQgPSB0ZXh0cGFyc2VyKFtdKTtcbnZhciBsYW5ndWFnZXMgPSBbXTtcbnZhciBjb250ZXh0ID0ge307XG5cbm1kLmNvcmUucnVsZXIuYmVmb3JlKCdsaW5raWZ5JywgJ2xpbmtpZnktdG9rZW5pemVyJywgbGlua2lmeVRva2VuaXplciwge30pO1xubWQucmVuZGVyZXIucnVsZXMuY29kZV9ibG9jayA9IGJsb2NrO1xubWQucmVuZGVyZXIucnVsZXMuY29kZV9pbmxpbmUgPSBpbmxpbmU7XG5tZC5yZW5kZXJlci5ydWxlcy5mZW5jZSA9IGZlbmNlO1xuXG5obGpzLmNvbmZpZ3VyZSh7IHRhYlJlcGxhY2U6IDIsIGNsYXNzUHJlZml4OiAnbWQtY29kZS0nIH0pO1xuXG5mdW5jdGlvbiBoaWdobGlnaHQgKGNvZGUsIGxhbmcpIHtcbiAgdmFyIGxvd2VyID0gU3RyaW5nKGxhbmcpLnRvTG93ZXJDYXNlKCk7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGhsanMuaGlnaGxpZ2h0KGFsaWFzZXNbbG93ZXJdIHx8IGxvd2VyLCBjb2RlKS52YWx1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5mdW5jdGlvbiBibG9jayAoKSB7XG4gIHZhciBiYXNlID0gYmFzZWJsb2NrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykuc3Vic3RyKDExKTsgLy8gc3RhcnRzIHdpdGggJzxwcmU+PGNvZGU+J1xuICB2YXIgY2xhc3NlZCA9ICc8cHJlIGNsYXNzPVwibWQtY29kZS1ibG9ja1wiPjxjb2RlIGNsYXNzPVwibWQtY29kZVwiPicgKyBiYXNlO1xuICByZXR1cm4gY2xhc3NlZDtcbn1cblxuZnVuY3Rpb24gaW5saW5lICgpIHtcbiAgdmFyIGJhc2UgPSBiYXNlaW5saW5lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykuc3Vic3RyKDYpOyAvLyBzdGFydHMgd2l0aCAnPGNvZGU+J1xuICB2YXIgY2xhc3NlZCA9ICc8Y29kZSBjbGFzcz1cIm1kLWNvZGUgbWQtY29kZS1pbmxpbmVcIj4nICsgYmFzZTtcbiAgcmV0dXJuIGNsYXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGZlbmNlICgpIHtcbiAgdmFyIGJhc2UgPSBiYXNlZmVuY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKS5zdWJzdHIoNSk7IC8vIHN0YXJ0cyB3aXRoICc8cHJlPidcbiAgdmFyIGxhbmcgPSBiYXNlLnN1YnN0cigwLCA2KSAhPT0gJzxjb2RlPic7IC8vIHdoZW4gdGhlIGZlbmNlIGhhcyBhIGxhbmd1YWdlIGNsYXNzXG4gIHZhciByZXN0ID0gbGFuZyA/IGJhc2UgOiAnPGNvZGUgY2xhc3M9XCJtZC1jb2RlXCI+JyArIGJhc2Uuc3Vic3RyKDYpO1xuICB2YXIgY2xhc3NlZCA9ICc8cHJlIGNsYXNzPVwibWQtY29kZS1ibG9ja1wiPicgKyByZXN0O1xuICB2YXIgYWxpYXNlZCA9IGNsYXNzZWQucmVwbGFjZShyYWxpYXMsIGFsaWFzaW5nKTtcbiAgcmV0dXJuIGFsaWFzZWQ7XG59XG5cbmZ1bmN0aW9uIGFsaWFzaW5nIChhbGwsIGxhbmd1YWdlKSB7XG4gIHZhciBuYW1lID0gYWxpYXNlc1tsYW5ndWFnZV0gfHwgbGFuZ3VhZ2UgfHwgJ3Vua25vd24nO1xuICB2YXIgbGFuZyA9ICdtZC1sYW5nLScgKyBuYW1lO1xuICBpZiAobGFuZ3VhZ2VzLmluZGV4T2YobGFuZykgPT09IC0xKSB7XG4gICAgbGFuZ3VhZ2VzLnB1c2gobGFuZyk7XG4gIH1cbiAgcmV0dXJuICcgY2xhc3M9XCJtZC1jb2RlICcgKyBsYW5nICsgJ1wiJztcbn1cblxuZnVuY3Rpb24gdGV4dHBhcnNlciAodG9rZW5pemVycykge1xuICByZXR1cm4gZnVuY3Rpb24gcGFyc2VUZXh0ICgpIHtcbiAgICB2YXIgYmFzZSA9IGJhc2V0ZXh0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIGZhbmN5ID0gZmFuY2lmdWwoYmFzZSk7XG4gICAgdmFyIHRva2VuaXplZCA9IHRva2VuaXplKGZhbmN5LCB0b2tlbml6ZXJzKTtcbiAgICByZXR1cm4gdG9rZW5pemVkO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmYW5jaWZ1bCAodGV4dCkge1xuICByZXR1cm4gdGV4dFxuICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxNCcpICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVtLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcIlxcc10pJy9nLCAnJDFcXHUyMDE4JykgICAgICAvLyBvcGVuaW5nIHNpbmdsZXNcbiAgICAucmVwbGFjZSgvJy9nLCAnXFx1MjAxOScpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjbG9zaW5nIHNpbmdsZXMgJiBhcG9zdHJvcGhlc1xuICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCAnJDFcXHUyMDFjJykgLy8gb3BlbmluZyBkb3VibGVzXG4gICAgLnJlcGxhY2UoL1wiL2csICdcXHUyMDFkJykgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsb3NpbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC9cXC57M30vZywgJ1xcdTIwMjYnKTsgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGxpcHNlc1xufVxuXG5mdW5jdGlvbiBsaW5raWZ5VG9rZW5pemVyIChzdGF0ZSkge1xuICB0b2tlbml6ZUxpbmtzKHN0YXRlLCBjb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gdG9rZW5pemUgKHRleHQsIHRva2VuaXplcnMpIHtcbiAgcmV0dXJuIHRva2VuaXplcnMucmVkdWNlKHVzZSwgdGV4dCk7XG4gIGZ1bmN0aW9uIHVzZSAocmVzdWx0LCB0b2spIHtcbiAgICByZXR1cm4gcmVzdWx0LnJlcGxhY2UodG9rLnRva2VuLCB0b2sudHJhbnNmb3JtKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXJrZG93biAoaW5wdXQsIG9wdGlvbnMpIHtcbiAgdmFyIHRvayA9IG9wdGlvbnMudG9rZW5pemVycyB8fCBbXTtcbiAgdmFyIGxpbiA9IG9wdGlvbnMubGlua2lmaWVycyB8fCBbXTtcbiAgdmFyIHZhbGlkID0gaW5wdXQgPT09IG51bGwgfHwgaW5wdXQgPT09IHZvaWQgMCA/ICcnIDogU3RyaW5nKGlucHV0KTtcbiAgY29udGV4dC50b2tlbml6ZXJzID0gdG9rO1xuICBjb250ZXh0LmxpbmtpZmllcnMgPSBsaW47XG4gIG1kLnJlbmRlcmVyLnJ1bGVzLnRleHQgPSB0b2subGVuZ3RoID8gdGV4dHBhcnNlcih0b2spIDogdGV4dGNhY2hlZDtcbiAgdmFyIGh0bWwgPSBtZC5yZW5kZXIodmFsaWQpO1xuICByZXR1cm4gaHRtbDtcbn1cblxubWFya2Rvd24ucGFyc2VyID0gbWQ7XG5tYXJrZG93bi5sYW5ndWFnZXMgPSBsYW5ndWFnZXM7XG5tb2R1bGUuZXhwb3J0cyA9IG1hcmtkb3duO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5zYW5lID0gcmVxdWlyZSgnaW5zYW5lJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnYXNzaWdubWVudCcpO1xudmFyIG1hcmtkb3duID0gcmVxdWlyZSgnLi9tYXJrZG93bicpO1xudmFyIGhpZ2h0b2tlbnMgPSByZXF1aXJlKCdoaWdobGlnaHQuanMtdG9rZW5zJykubWFwKGNvZGVjbGFzcyk7XG5cbmZ1bmN0aW9uIGNvZGVjbGFzcyAodG9rZW4pIHtcbiAgcmV0dXJuICdtZC1jb2RlLScgKyB0b2tlbjtcbn1cblxuZnVuY3Rpb24gc2FuaXRpemUgKGh0bWwsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSBhc3NpZ24oe30sIG9wdGlvbnMsIHtcbiAgICBhbGxvd2VkQ2xhc3Nlczoge1xuICAgICAgcHJlOiBbJ21kLWNvZGUtYmxvY2snXSxcbiAgICAgIGNvZGU6IG1hcmtkb3duLmxhbmd1YWdlcyxcbiAgICAgIHNwYW46IGhpZ2h0b2tlbnNcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gaW5zYW5lKGh0bWwsIGNvbmZpZ3VyYXRpb24pO1xufVxuXG5mdW5jdGlvbiBtZWdhbWFyayAobWQsIG9wdGlvbnMpIHtcbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgaHRtbCA9IG1hcmtkb3duKG1kLCBvKTtcbiAgdmFyIHNhbmUgPSBzYW5pdGl6ZShodG1sLCBvLnNhbml0aXplcik7XG4gIHJldHVybiBzYW5lO1xufVxuXG5tYXJrZG93bi5sYW5ndWFnZXMucHVzaCgnbWQtY29kZScsICdtZC1jb2RlLWlubGluZScpOyAvLyBvbmx5IHNhbml0aXppbmcgcHVycG9zZXNcbm1lZ2FtYXJrLnBhcnNlciA9IG1hcmtkb3duLnBhcnNlcjtcbm1vZHVsZS5leHBvcnRzID0gbWVnYW1hcms7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2lnbm1lbnQgKHJlc3VsdCkge1xuICB2YXIgc3RhY2sgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgaXRlbTtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgIGl0ZW0gPSBzdGFjay5zaGlmdCgpO1xuICAgIGZvciAoa2V5IGluIGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXN1bHRba2V5XSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBhc3NpZ25tZW50KHJlc3VsdFtrZXldLCBpdGVtW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWdubWVudDtcbiIsInZhciBIaWdobGlnaHQgPSBmdW5jdGlvbigpIHtcblxuICAvKiBVdGlsaXR5IGZ1bmN0aW9ucyAqL1xuXG4gIGZ1bmN0aW9uIGVzY2FwZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8mL2dtLCAnJmFtcDsnKS5yZXBsYWNlKC88L2dtLCAnJmx0OycpLnJlcGxhY2UoLz4vZ20sICcmZ3Q7Jyk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWcobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiB0ZXN0UmUocmUsIGxleGVtZSkge1xuICAgIHZhciBtYXRjaCA9IHJlICYmIHJlLmV4ZWMobGV4ZW1lKTtcbiAgICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2guaW5kZXggPT0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJsb2NrVGV4dChibG9jaykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYmxvY2suY2hpbGROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gMykge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy51c2VCUiA/IG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xcbi9nLCAnJykgOiBub2RlLm5vZGVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0YWcobm9kZSkgPT0gJ2JyJykge1xuICAgICAgICByZXR1cm4gJ1xcbic7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmxvY2tUZXh0KG5vZGUpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tMYW5ndWFnZShibG9jaykge1xuICAgIHZhciBjbGFzc2VzID0gKGJsb2NrLmNsYXNzTmFtZSArICcgJyArIChibG9jay5wYXJlbnROb2RlID8gYmxvY2sucGFyZW50Tm9kZS5jbGFzc05hbWUgOiAnJykpLnNwbGl0KC9cXHMrLyk7XG4gICAgY2xhc3NlcyA9IGNsYXNzZXMubWFwKGZ1bmN0aW9uKGMpIHtyZXR1cm4gYy5yZXBsYWNlKC9ebGFuZ3VhZ2UtLywgJycpO30pO1xuICAgIHJldHVybiBjbGFzc2VzLmZpbHRlcihmdW5jdGlvbihjKSB7cmV0dXJuIGdldExhbmd1YWdlKGMpIHx8IGMgPT0gJ25vLWhpZ2hsaWdodCc7fSlbMF07XG4gIH1cblxuICBmdW5jdGlvbiBpbmhlcml0KHBhcmVudCwgb2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnQpXG4gICAgICByZXN1bHRba2V5XSA9IHBhcmVudFtrZXldO1xuICAgIGlmIChvYmopXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLyogU3RyZWFtIG1lcmdpbmcgKi9cblxuICBmdW5jdGlvbiBub2RlU3RyZWFtKG5vZGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgKGZ1bmN0aW9uIF9ub2RlU3RyZWFtKG5vZGUsIG9mZnNldCkge1xuICAgICAgZm9yICh2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7IGNoaWxkOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PSAzKVxuICAgICAgICAgIG9mZnNldCArPSBjaGlsZC5ub2RlVmFsdWUubGVuZ3RoO1xuICAgICAgICBlbHNlIGlmICh0YWcoY2hpbGQpID09ICdicicpXG4gICAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICBldmVudDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgICAgICAgbm9kZTogY2hpbGRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvZmZzZXQgPSBfbm9kZVN0cmVhbShjaGlsZCwgb2Zmc2V0KTtcbiAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICBldmVudDogJ3N0b3AnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH0pKG5vZGUsIDApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZVN0cmVhbXMob3JpZ2luYWwsIGhpZ2hsaWdodGVkLCB2YWx1ZSkge1xuICAgIHZhciBwcm9jZXNzZWQgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgbm9kZVN0YWNrID0gW107XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RTdHJlYW0oKSB7XG4gICAgICBpZiAoIW9yaWdpbmFsLmxlbmd0aCB8fCAhaGlnaGxpZ2h0ZWQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbC5sZW5ndGggPyBvcmlnaW5hbCA6IGhpZ2hsaWdodGVkO1xuICAgICAgfVxuICAgICAgaWYgKG9yaWdpbmFsWzBdLm9mZnNldCAhPSBoaWdobGlnaHRlZFswXS5vZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIChvcmlnaW5hbFswXS5vZmZzZXQgPCBoaWdobGlnaHRlZFswXS5vZmZzZXQpID8gb3JpZ2luYWwgOiBoaWdobGlnaHRlZDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgIFRvIGF2b2lkIHN0YXJ0aW5nIHRoZSBzdHJlYW0ganVzdCBiZWZvcmUgaXQgc2hvdWxkIHN0b3AgdGhlIG9yZGVyIGlzXG4gICAgICBlbnN1cmVkIHRoYXQgb3JpZ2luYWwgYWx3YXlzIHN0YXJ0cyBmaXJzdCBhbmQgY2xvc2VzIGxhc3Q6XG5cbiAgICAgIGlmIChldmVudDEgPT0gJ3N0YXJ0JyAmJiBldmVudDIgPT0gJ3N0YXJ0JylcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xuICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgIHJldHVybiBoaWdobGlnaHRlZDtcbiAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWw7XG4gICAgICBpZiAoZXZlbnQxID09ICdzdG9wJyAmJiBldmVudDIgPT0gJ3N0b3AnKVxuICAgICAgICByZXR1cm4gaGlnaGxpZ2h0ZWQ7XG5cbiAgICAgIC4uLiB3aGljaCBpcyBjb2xsYXBzZWQgdG86XG4gICAgICAqL1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodGVkWzBdLmV2ZW50ID09ICdzdGFydCcgPyBvcmlnaW5hbCA6IGhpZ2hsaWdodGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9wZW4obm9kZSkge1xuICAgICAgZnVuY3Rpb24gYXR0cl9zdHIoYSkge3JldHVybiAnICcgKyBhLm5vZGVOYW1lICsgJz1cIicgKyBlc2NhcGUoYS52YWx1ZSkgKyAnXCInO31cbiAgICAgIHJlc3VsdCArPSAnPCcgKyB0YWcobm9kZSkgKyBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwobm9kZS5hdHRyaWJ1dGVzLCBhdHRyX3N0cikuam9pbignJykgKyAnPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2Uobm9kZSkge1xuICAgICAgcmVzdWx0ICs9ICc8LycgKyB0YWcobm9kZSkgKyAnPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyKGV2ZW50KSB7XG4gICAgICAoZXZlbnQuZXZlbnQgPT0gJ3N0YXJ0JyA/IG9wZW4gOiBjbG9zZSkoZXZlbnQubm9kZSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKG9yaWdpbmFsLmxlbmd0aCB8fCBoaWdobGlnaHRlZC5sZW5ndGgpIHtcbiAgICAgIHZhciBzdHJlYW0gPSBzZWxlY3RTdHJlYW0oKTtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGUodmFsdWUuc3Vic3RyKHByb2Nlc3NlZCwgc3RyZWFtWzBdLm9mZnNldCAtIHByb2Nlc3NlZCkpO1xuICAgICAgcHJvY2Vzc2VkID0gc3RyZWFtWzBdLm9mZnNldDtcbiAgICAgIGlmIChzdHJlYW0gPT0gb3JpZ2luYWwpIHtcbiAgICAgICAgLypcbiAgICAgICAgT24gYW55IG9wZW5pbmcgb3IgY2xvc2luZyB0YWcgb2YgdGhlIG9yaWdpbmFsIG1hcmt1cCB3ZSBmaXJzdCBjbG9zZVxuICAgICAgICB0aGUgZW50aXJlIGhpZ2hsaWdodGVkIG5vZGUgc3RhY2ssIHRoZW4gcmVuZGVyIHRoZSBvcmlnaW5hbCB0YWcgYWxvbmdcbiAgICAgICAgd2l0aCBhbGwgdGhlIGZvbGxvd2luZyBvcmlnaW5hbCB0YWdzIGF0IHRoZSBzYW1lIG9mZnNldCBhbmQgdGhlblxuICAgICAgICByZW9wZW4gYWxsIHRoZSB0YWdzIG9uIHRoZSBoaWdobGlnaHRlZCBzdGFjay5cbiAgICAgICAgKi9cbiAgICAgICAgbm9kZVN0YWNrLnJldmVyc2UoKS5mb3JFYWNoKGNsb3NlKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIHJlbmRlcihzdHJlYW0uc3BsaWNlKDAsIDEpWzBdKTtcbiAgICAgICAgICBzdHJlYW0gPSBzZWxlY3RTdHJlYW0oKTtcbiAgICAgICAgfSB3aGlsZSAoc3RyZWFtID09IG9yaWdpbmFsICYmIHN0cmVhbS5sZW5ndGggJiYgc3RyZWFtWzBdLm9mZnNldCA9PSBwcm9jZXNzZWQpO1xuICAgICAgICBub2RlU3RhY2sucmV2ZXJzZSgpLmZvckVhY2gob3Blbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RyZWFtWzBdLmV2ZW50ID09ICdzdGFydCcpIHtcbiAgICAgICAgICBub2RlU3RhY2sucHVzaChzdHJlYW1bMF0ubm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZVN0YWNrLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlcihzdHJlYW0uc3BsaWNlKDAsIDEpWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCArIGVzY2FwZSh2YWx1ZS5zdWJzdHIocHJvY2Vzc2VkKSk7XG4gIH1cblxuICAvKiBJbml0aWFsaXphdGlvbiAqL1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSkge1xuXG4gICAgZnVuY3Rpb24gcmVTdHIocmUpIHtcbiAgICAgICAgcmV0dXJuIChyZSAmJiByZS5zb3VyY2UpIHx8IHJlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxhbmdSZSh2YWx1ZSwgZ2xvYmFsKSB7XG4gICAgICByZXR1cm4gUmVnRXhwKFxuICAgICAgICByZVN0cih2YWx1ZSksXG4gICAgICAgICdtJyArIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlID8gJ2knIDogJycpICsgKGdsb2JhbCA/ICdnJyA6ICcnKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21waWxlTW9kZShtb2RlLCBwYXJlbnQpIHtcbiAgICAgIGlmIChtb2RlLmNvbXBpbGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtb2RlLmNvbXBpbGVkID0gdHJ1ZTtcblxuICAgICAgbW9kZS5rZXl3b3JkcyA9IG1vZGUua2V5d29yZHMgfHwgbW9kZS5iZWdpbktleXdvcmRzO1xuICAgICAgaWYgKG1vZGUua2V5d29yZHMpIHtcbiAgICAgICAgdmFyIGNvbXBpbGVkX2tleXdvcmRzID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZmxhdHRlbihjbGFzc05hbWUsIHN0cikge1xuICAgICAgICAgIGlmIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RyLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbihrdykge1xuICAgICAgICAgICAgdmFyIHBhaXIgPSBrdy5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29tcGlsZWRfa2V5d29yZHNbcGFpclswXV0gPSBbY2xhc3NOYW1lLCBwYWlyWzFdID8gTnVtYmVyKHBhaXJbMV0pIDogMV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG1vZGUua2V5d29yZHMgPT0gJ3N0cmluZycpIHsgLy8gc3RyaW5nXG4gICAgICAgICAgZmxhdHRlbigna2V5d29yZCcsIG1vZGUua2V5d29yZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5rZXlzKG1vZGUua2V5d29yZHMpLmZvckVhY2goZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgZmxhdHRlbihjbGFzc05hbWUsIG1vZGUua2V5d29yZHNbY2xhc3NOYW1lXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZS5rZXl3b3JkcyA9IGNvbXBpbGVkX2tleXdvcmRzO1xuICAgICAgfVxuICAgICAgbW9kZS5sZXhlbWVzUmUgPSBsYW5nUmUobW9kZS5sZXhlbWVzIHx8IC9cXGJbQS1aYS16MC05X10rXFxiLywgdHJ1ZSk7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKG1vZGUuYmVnaW5LZXl3b3Jkcykge1xuICAgICAgICAgIG1vZGUuYmVnaW4gPSBtb2RlLmJlZ2luS2V5d29yZHMuc3BsaXQoJyAnKS5qb2luKCd8Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb2RlLmJlZ2luKVxuICAgICAgICAgIG1vZGUuYmVnaW4gPSAvXFxCfFxcYi87XG4gICAgICAgIG1vZGUuYmVnaW5SZSA9IGxhbmdSZShtb2RlLmJlZ2luKTtcbiAgICAgICAgaWYgKCFtb2RlLmVuZCAmJiAhbW9kZS5lbmRzV2l0aFBhcmVudClcbiAgICAgICAgICBtb2RlLmVuZCA9IC9cXEJ8XFxiLztcbiAgICAgICAgaWYgKG1vZGUuZW5kKVxuICAgICAgICAgIG1vZGUuZW5kUmUgPSBsYW5nUmUobW9kZS5lbmQpO1xuICAgICAgICBtb2RlLnRlcm1pbmF0b3JfZW5kID0gcmVTdHIobW9kZS5lbmQpIHx8ICcnO1xuICAgICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCAmJiBwYXJlbnQudGVybWluYXRvcl9lbmQpXG4gICAgICAgICAgbW9kZS50ZXJtaW5hdG9yX2VuZCArPSAobW9kZS5lbmQgPyAnfCcgOiAnJykgKyBwYXJlbnQudGVybWluYXRvcl9lbmQ7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5pbGxlZ2FsKVxuICAgICAgICBtb2RlLmlsbGVnYWxSZSA9IGxhbmdSZShtb2RlLmlsbGVnYWwpO1xuICAgICAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgIG1vZGUucmVsZXZhbmNlID0gMTtcbiAgICAgIGlmICghbW9kZS5jb250YWlucykge1xuICAgICAgICBtb2RlLmNvbnRhaW5zID0gW107XG4gICAgICB9XG4gICAgICB2YXIgZXhwYW5kZWRfY29udGFpbnMgPSBbXTtcbiAgICAgIG1vZGUuY29udGFpbnMuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLnZhcmlhbnRzKSB7XG4gICAgICAgICAgYy52YXJpYW50cy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtleHBhbmRlZF9jb250YWlucy5wdXNoKGluaGVyaXQoYywgdikpO30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGFuZGVkX2NvbnRhaW5zLnB1c2goYyA9PSAnc2VsZicgPyBtb2RlIDogYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZS5jb250YWlucyA9IGV4cGFuZGVkX2NvbnRhaW5zO1xuICAgICAgbW9kZS5jb250YWlucy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtjb21waWxlTW9kZShjLCBtb2RlKTt9KTtcblxuICAgICAgaWYgKG1vZGUuc3RhcnRzKSB7XG4gICAgICAgIGNvbXBpbGVNb2RlKG1vZGUuc3RhcnRzLCBwYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGVybWluYXRvcnMgPVxuICAgICAgICBtb2RlLmNvbnRhaW5zLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgcmV0dXJuIGMuYmVnaW5LZXl3b3JkcyA/ICdcXFxcLj9cXFxcYignICsgYy5iZWdpbiArICcpXFxcXGJcXFxcLj8nIDogYy5iZWdpbjtcbiAgICAgICAgfSlcbiAgICAgICAgLmNvbmNhdChbbW9kZS50ZXJtaW5hdG9yX2VuZF0pXG4gICAgICAgIC5jb25jYXQoW21vZGUuaWxsZWdhbF0pXG4gICAgICAgIC5tYXAocmVTdHIpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgICBtb2RlLnRlcm1pbmF0b3JzID0gdGVybWluYXRvcnMubGVuZ3RoID8gbGFuZ1JlKHRlcm1pbmF0b3JzLmpvaW4oJ3wnKSwgdHJ1ZSkgOiB7ZXhlYzogZnVuY3Rpb24ocykge3JldHVybiBudWxsO319O1xuXG4gICAgICBtb2RlLmNvbnRpbnVhdGlvbiA9IHt9O1xuICAgIH1cblxuICAgIGNvbXBpbGVNb2RlKGxhbmd1YWdlKTtcbiAgfVxuXG4gIC8qXG4gIENvcmUgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uLiBBY2NlcHRzIGEgbGFuZ3VhZ2UgbmFtZSwgb3IgYW4gYWxpYXMsIGFuZCBhXG4gIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nXG4gIHByb3BlcnRpZXM6XG5cbiAgLSByZWxldmFuY2UgKGludClcbiAgLSB2YWx1ZSAoYW4gSFRNTCBzdHJpbmcgd2l0aCBoaWdobGlnaHRpbmcgbWFya3VwKVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodChuYW1lLCB2YWx1ZSwgaWdub3JlX2lsbGVnYWxzLCBjb250aW51YXRpb24pIHtcblxuICAgIGZ1bmN0aW9uIHN1Yk1vZGUobGV4ZW1lLCBtb2RlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRlc3RSZShtb2RlLmNvbnRhaW5zW2ldLmJlZ2luUmUsIGxleGVtZSkpIHtcbiAgICAgICAgICByZXR1cm4gbW9kZS5jb250YWluc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mTW9kZShtb2RlLCBsZXhlbWUpIHtcbiAgICAgIGlmICh0ZXN0UmUobW9kZS5lbmRSZSwgbGV4ZW1lKSkge1xuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50KSB7XG4gICAgICAgIHJldHVybiBlbmRPZk1vZGUobW9kZS5wYXJlbnQsIGxleGVtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNJbGxlZ2FsKGxleGVtZSwgbW9kZSkge1xuICAgICAgcmV0dXJuICFpZ25vcmVfaWxsZWdhbHMgJiYgdGVzdFJlKG1vZGUuaWxsZWdhbFJlLCBsZXhlbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleXdvcmRNYXRjaChtb2RlLCBtYXRjaCkge1xuICAgICAgdmFyIG1hdGNoX3N0ciA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICByZXR1cm4gbW9kZS5rZXl3b3Jkcy5oYXNPd25Qcm9wZXJ0eShtYXRjaF9zdHIpICYmIG1vZGUua2V5d29yZHNbbWF0Y2hfc3RyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZFNwYW4oY2xhc3NuYW1lLCBpbnNpZGVTcGFuLCBsZWF2ZU9wZW4sIG5vUHJlZml4KSB7XG4gICAgICB2YXIgY2xhc3NQcmVmaXggPSBub1ByZWZpeCA/ICcnIDogb3B0aW9ucy5jbGFzc1ByZWZpeCxcbiAgICAgICAgICBvcGVuU3BhbiAgICA9ICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc1ByZWZpeCxcbiAgICAgICAgICBjbG9zZVNwYW4gICA9IGxlYXZlT3BlbiA/ICcnIDogJzwvc3Bhbj4nO1xuXG4gICAgICBvcGVuU3BhbiArPSBjbGFzc25hbWUgKyAnXCI+JztcblxuICAgICAgcmV0dXJuIG9wZW5TcGFuICsgaW5zaWRlU3BhbiArIGNsb3NlU3BhbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzS2V5d29yZHMoKSB7XG4gICAgICB2YXIgYnVmZmVyID0gZXNjYXBlKG1vZGVfYnVmZmVyKTtcbiAgICAgIGlmICghdG9wLmtleXdvcmRzKVxuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgdmFyIGxhc3RfaW5kZXggPSAwO1xuICAgICAgdG9wLmxleGVtZXNSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG1hdGNoID0gdG9wLmxleGVtZXNSZS5leGVjKGJ1ZmZlcik7XG4gICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0ICs9IGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCwgbWF0Y2guaW5kZXggLSBsYXN0X2luZGV4KTtcbiAgICAgICAgdmFyIGtleXdvcmRfbWF0Y2ggPSBrZXl3b3JkTWF0Y2godG9wLCBtYXRjaCk7XG4gICAgICAgIGlmIChrZXl3b3JkX21hdGNoKSB7XG4gICAgICAgICAgcmVsZXZhbmNlICs9IGtleXdvcmRfbWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0ICs9IGJ1aWxkU3BhbihrZXl3b3JkX21hdGNoWzBdLCBtYXRjaFswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ICs9IG1hdGNoWzBdO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RfaW5kZXggPSB0b3AubGV4ZW1lc1JlLmxhc3RJbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AubGV4ZW1lc1JlLmV4ZWMoYnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQgKyBidWZmZXIuc3Vic3RyKGxhc3RfaW5kZXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NTdWJMYW5ndWFnZSgpIHtcbiAgICAgIGlmICh0b3Auc3ViTGFuZ3VhZ2UgJiYgIWxhbmd1YWdlc1t0b3Auc3ViTGFuZ3VhZ2VdKSB7XG4gICAgICAgIHJldHVybiBlc2NhcGUobW9kZV9idWZmZXIpO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdCA9IHRvcC5zdWJMYW5ndWFnZSA/IGhpZ2hsaWdodCh0b3Auc3ViTGFuZ3VhZ2UsIG1vZGVfYnVmZmVyLCB0cnVlLCB0b3AuY29udGludWF0aW9uLnRvcCkgOiBoaWdobGlnaHRBdXRvKG1vZGVfYnVmZmVyKTtcbiAgICAgIC8vIENvdW50aW5nIGVtYmVkZGVkIGxhbmd1YWdlIHNjb3JlIHRvd2FyZHMgdGhlIGhvc3QgbGFuZ3VhZ2UgbWF5IGJlIGRpc2FibGVkXG4gICAgICAvLyB3aXRoIHplcm9pbmcgdGhlIGNvbnRhaW5pbmcgbW9kZSByZWxldmFuY2UuIFVzZWNhc2UgaW4gcG9pbnQgaXMgTWFya2Rvd24gdGhhdFxuICAgICAgLy8gYWxsb3dzIFhNTCBldmVyeXdoZXJlIGFuZCBtYWtlcyBldmVyeSBYTUwgc25pcHBldCB0byBoYXZlIGEgbXVjaCBsYXJnZXIgTWFya2Rvd25cbiAgICAgIC8vIHNjb3JlLlxuICAgICAgaWYgKHRvcC5yZWxldmFuY2UgPiAwKSB7XG4gICAgICAgIHJlbGV2YW5jZSArPSByZXN1bHQucmVsZXZhbmNlO1xuICAgICAgfVxuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZU1vZGUgPT0gJ2NvbnRpbnVvdXMnKSB7XG4gICAgICAgIHRvcC5jb250aW51YXRpb24udG9wID0gcmVzdWx0LnRvcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBidWlsZFNwYW4ocmVzdWx0Lmxhbmd1YWdlLCByZXN1bHQudmFsdWUsIGZhbHNlLCB0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQnVmZmVyKCkge1xuICAgICAgcmV0dXJuIHRvcC5zdWJMYW5ndWFnZSAhPT0gdW5kZWZpbmVkID8gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkgOiBwcm9jZXNzS2V5d29yZHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE5ld01vZGUobW9kZSwgbGV4ZW1lKSB7XG4gICAgICB2YXIgbWFya3VwID0gbW9kZS5jbGFzc05hbWU/IGJ1aWxkU3Bhbihtb2RlLmNsYXNzTmFtZSwgJycsIHRydWUpOiAnJztcbiAgICAgIGlmIChtb2RlLnJldHVybkJlZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBlc2NhcGUobGV4ZW1lKSArIG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCArPSBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gbGV4ZW1lO1xuICAgICAgfVxuICAgICAgdG9wID0gT2JqZWN0LmNyZWF0ZShtb2RlLCB7cGFyZW50OiB7dmFsdWU6IHRvcH19KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW1lKGJ1ZmZlciwgbGV4ZW1lKSB7XG5cbiAgICAgIG1vZGVfYnVmZmVyICs9IGJ1ZmZlcjtcbiAgICAgIGlmIChsZXhlbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld19tb2RlID0gc3ViTW9kZShsZXhlbWUsIHRvcCk7XG4gICAgICBpZiAobmV3X21vZGUpIHtcbiAgICAgICAgcmVzdWx0ICs9IHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgc3RhcnROZXdNb2RlKG5ld19tb2RlLCBsZXhlbWUpO1xuICAgICAgICByZXR1cm4gbmV3X21vZGUucmV0dXJuQmVnaW4gPyAwIDogbGV4ZW1lLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZF9tb2RlID0gZW5kT2ZNb2RlKHRvcCwgbGV4ZW1lKTtcbiAgICAgIGlmIChlbmRfbW9kZSkge1xuICAgICAgICB2YXIgb3JpZ2luID0gdG9wO1xuICAgICAgICBpZiAoIShvcmlnaW4ucmV0dXJuRW5kIHx8IG9yaWdpbi5leGNsdWRlRW5kKSkge1xuICAgICAgICAgIG1vZGVfYnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKHRvcC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnPC9zcGFuPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlbGV2YW5jZSArPSB0b3AucmVsZXZhbmNlO1xuICAgICAgICAgIHRvcCA9IHRvcC5wYXJlbnQ7XG4gICAgICAgIH0gd2hpbGUgKHRvcCAhPSBlbmRfbW9kZS5wYXJlbnQpO1xuICAgICAgICBpZiAob3JpZ2luLmV4Y2x1ZGVFbmQpIHtcbiAgICAgICAgICByZXN1bHQgKz0gZXNjYXBlKGxleGVtZSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgICAgaWYgKGVuZF9tb2RlLnN0YXJ0cykge1xuICAgICAgICAgIHN0YXJ0TmV3TW9kZShlbmRfbW9kZS5zdGFydHMsICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luLnJldHVybkVuZCA/IDAgOiBsZXhlbWUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNJbGxlZ2FsKGxleGVtZSwgdG9wKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGxleGVtZSBcIicgKyBsZXhlbWUgKyAnXCIgZm9yIG1vZGUgXCInICsgKHRvcC5jbGFzc05hbWUgfHwgJzx1bm5hbWVkPicpICsgJ1wiJyk7XG5cbiAgICAgIC8qXG4gICAgICBQYXJzZXIgc2hvdWxkIG5vdCByZWFjaCB0aGlzIHBvaW50IGFzIGFsbCB0eXBlcyBvZiBsZXhlbWVzIHNob3VsZCBiZSBjYXVnaHRcbiAgICAgIGVhcmxpZXIsIGJ1dCBpZiBpdCBkb2VzIGR1ZSB0byBzb21lIGJ1ZyBtYWtlIHN1cmUgaXQgYWR2YW5jZXMgYXQgbGVhc3Qgb25lXG4gICAgICBjaGFyYWN0ZXIgZm9yd2FyZCB0byBwcmV2ZW50IGluZmluaXRlIGxvb3BpbmcuXG4gICAgICAqL1xuICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgcmV0dXJuIGxleGVtZS5sZW5ndGggfHwgMTtcbiAgICB9XG5cbiAgICB2YXIgbGFuZ3VhZ2UgPSBnZXRMYW5ndWFnZShuYW1lKTtcbiAgICBpZiAoIWxhbmd1YWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGFuZ3VhZ2U6IFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG5cbiAgICBjb21waWxlTGFuZ3VhZ2UobGFuZ3VhZ2UpO1xuICAgIHZhciB0b3AgPSBjb250aW51YXRpb24gfHwgbGFuZ3VhZ2U7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIGZvcih2YXIgY3VycmVudCA9IHRvcDsgY3VycmVudCAhPSBsYW5ndWFnZTsgY3VycmVudCA9IGN1cnJlbnQucGFyZW50KSB7XG4gICAgICBpZiAoY3VycmVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgcmVzdWx0ID0gYnVpbGRTcGFuKGN1cnJlbnQuY2xhc3NOYW1lLCByZXN1bHQsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbW9kZV9idWZmZXIgPSAnJztcbiAgICB2YXIgcmVsZXZhbmNlID0gMDtcbiAgICB0cnkge1xuICAgICAgdmFyIG1hdGNoLCBjb3VudCwgaW5kZXggPSAwO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdG9wLnRlcm1pbmF0b3JzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICBtYXRjaCA9IHRvcC50ZXJtaW5hdG9ycy5leGVjKHZhbHVlKTtcbiAgICAgICAgaWYgKCFtYXRjaClcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY291bnQgPSBwcm9jZXNzTGV4ZW1lKHZhbHVlLnN1YnN0cihpbmRleCwgbWF0Y2guaW5kZXggLSBpbmRleCksIG1hdGNoWzBdKTtcbiAgICAgICAgaW5kZXggPSBtYXRjaC5pbmRleCArIGNvdW50O1xuICAgICAgfVxuICAgICAgcHJvY2Vzc0xleGVtZSh2YWx1ZS5zdWJzdHIoaW5kZXgpKTtcbiAgICAgIGZvcih2YXIgY3VycmVudCA9IHRvcDsgY3VycmVudC5wYXJlbnQ7IGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudCkgeyAvLyBjbG9zZSBkYW5nbGluZyBtb2Rlc1xuICAgICAgICBpZiAoY3VycmVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICByZXN1bHQgKz0gJzwvc3Bhbj4nO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVsZXZhbmNlOiByZWxldmFuY2UsXG4gICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgIGxhbmd1YWdlOiBuYW1lLFxuICAgICAgICB0b3A6IHRvcFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5tZXNzYWdlLmluZGV4T2YoJ0lsbGVnYWwnKSAhPSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKHZhbHVlKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICBIaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBkZXRlY3Rpb24uIEFjY2VwdHMgYSBzdHJpbmcgd2l0aCB0aGUgY29kZSB0b1xuICBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gbGFuZ3VhZ2UgKGRldGVjdGVkIGxhbmd1YWdlKVxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG4gIC0gc2Vjb25kX2Jlc3QgKG9iamVjdCB3aXRoIHRoZSBzYW1lIHN0cnVjdHVyZSBmb3Igc2Vjb25kLWJlc3QgaGV1cmlzdGljYWxseVxuICAgIGRldGVjdGVkIGxhbmd1YWdlLCBtYXkgYmUgYWJzZW50KVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEF1dG8odGV4dCwgbGFuZ3VhZ2VTdWJzZXQpIHtcbiAgICBsYW5ndWFnZVN1YnNldCA9IGxhbmd1YWdlU3Vic2V0IHx8IG9wdGlvbnMubGFuZ3VhZ2VzIHx8IE9iamVjdC5rZXlzKGxhbmd1YWdlcyk7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIHZhbHVlOiBlc2NhcGUodGV4dClcbiAgICB9O1xuICAgIHZhciBzZWNvbmRfYmVzdCA9IHJlc3VsdDtcbiAgICBsYW5ndWFnZVN1YnNldC5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGlmICghZ2V0TGFuZ3VhZ2UobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGN1cnJlbnQgPSBoaWdobGlnaHQobmFtZSwgdGV4dCwgZmFsc2UpO1xuICAgICAgY3VycmVudC5sYW5ndWFnZSA9IG5hbWU7XG4gICAgICBpZiAoY3VycmVudC5yZWxldmFuY2UgPiBzZWNvbmRfYmVzdC5yZWxldmFuY2UpIHtcbiAgICAgICAgc2Vjb25kX2Jlc3QgPSBjdXJyZW50O1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQucmVsZXZhbmNlID4gcmVzdWx0LnJlbGV2YW5jZSkge1xuICAgICAgICBzZWNvbmRfYmVzdCA9IHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID0gY3VycmVudDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2Vjb25kX2Jlc3QubGFuZ3VhZ2UpIHtcbiAgICAgIHJlc3VsdC5zZWNvbmRfYmVzdCA9IHNlY29uZF9iZXN0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLypcbiAgUG9zdC1wcm9jZXNzaW5nIG9mIHRoZSBoaWdobGlnaHRlZCBtYXJrdXA6XG5cbiAgLSByZXBsYWNlIFRBQnMgd2l0aCBzb21ldGhpbmcgbW9yZSB1c2VmdWxcbiAgLSByZXBsYWNlIHJlYWwgbGluZS1icmVha3Mgd2l0aCAnPGJyPicgZm9yIG5vbi1wcmUgY29udGFpbmVyc1xuXG4gICovXG4gIGZ1bmN0aW9uIGZpeE1hcmt1cCh2YWx1ZSkge1xuICAgIGlmIChvcHRpb25zLnRhYlJlcGxhY2UpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXigoPFtePl0rPnxcXHQpKykvZ20sIGZ1bmN0aW9uKG1hdGNoLCBwMSwgb2Zmc2V0LCBzKSB7XG4gICAgICAgIHJldHVybiBwMS5yZXBsYWNlKC9cXHQvZywgb3B0aW9ucy50YWJSZXBsYWNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy51c2VCUikge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLypcbiAgQXBwbGllcyBoaWdobGlnaHRpbmcgdG8gYSBET00gbm9kZSBjb250YWluaW5nIGNvZGUuIEFjY2VwdHMgYSBET00gbm9kZSBhbmRcbiAgdHdvIG9wdGlvbmFsIHBhcmFtZXRlcnMgZm9yIGZpeE1hcmt1cC5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QmxvY2soYmxvY2spIHtcbiAgICB2YXIgdGV4dCA9IGJsb2NrVGV4dChibG9jayk7XG4gICAgdmFyIGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShibG9jayk7XG4gICAgaWYgKGxhbmd1YWdlID09ICduby1oaWdobGlnaHQnKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KGxhbmd1YWdlLCB0ZXh0LCB0cnVlKSA6IGhpZ2hsaWdodEF1dG8odGV4dCk7XG4gICAgdmFyIG9yaWdpbmFsID0gbm9kZVN0cmVhbShibG9jayk7XG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgdmFyIHByZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcsICdwcmUnKTtcbiAgICAgIHByZS5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgICByZXN1bHQudmFsdWUgPSBtZXJnZVN0cmVhbXMob3JpZ2luYWwsIG5vZGVTdHJlYW0ocHJlKSwgdGV4dCk7XG4gICAgfVxuICAgIHJlc3VsdC52YWx1ZSA9IGZpeE1hcmt1cChyZXN1bHQudmFsdWUpO1xuXG4gICAgYmxvY2suaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIGJsb2NrLmNsYXNzTmFtZSArPSAnIGhsanMgJyArICghbGFuZ3VhZ2UgJiYgcmVzdWx0Lmxhbmd1YWdlIHx8ICcnKTtcbiAgICBibG9jay5yZXN1bHQgPSB7XG4gICAgICBsYW5ndWFnZTogcmVzdWx0Lmxhbmd1YWdlLFxuICAgICAgcmU6IHJlc3VsdC5yZWxldmFuY2VcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuc2Vjb25kX2Jlc3QpIHtcbiAgICAgIGJsb2NrLnNlY29uZF9iZXN0ID0ge1xuICAgICAgICBsYW5ndWFnZTogcmVzdWx0LnNlY29uZF9iZXN0Lmxhbmd1YWdlLFxuICAgICAgICByZTogcmVzdWx0LnNlY29uZF9iZXN0LnJlbGV2YW5jZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBjbGFzc1ByZWZpeDogJ2hsanMtJyxcbiAgICB0YWJSZXBsYWNlOiBudWxsLFxuICAgIHVzZUJSOiBmYWxzZSxcbiAgICBsYW5ndWFnZXM6IHVuZGVmaW5lZFxuICB9O1xuXG4gIC8qXG4gIFVwZGF0ZXMgaGlnaGxpZ2h0LmpzIGdsb2JhbCBvcHRpb25zIHdpdGggdmFsdWVzIHBhc3NlZCBpbiB0aGUgZm9ybSBvZiBhbiBvYmplY3RcbiAgKi9cbiAgZnVuY3Rpb24gY29uZmlndXJlKHVzZXJfb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBpbmhlcml0KG9wdGlvbnMsIHVzZXJfb3B0aW9ucyk7XG4gIH1cblxuICAvKlxuICBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhbGwgPHByZT48Y29kZT4uLjwvY29kZT48L3ByZT4gYmxvY2tzIG9uIGEgcGFnZS5cbiAgKi9cbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZygpIHtcbiAgICBpZiAoaW5pdEhpZ2hsaWdodGluZy5jYWxsZWQpXG4gICAgICByZXR1cm47XG4gICAgaW5pdEhpZ2hsaWdodGluZy5jYWxsZWQgPSB0cnVlO1xuXG4gICAgdmFyIGJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZSBjb2RlJyk7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChibG9ja3MsIGhpZ2hsaWdodEJsb2NrKTtcbiAgfVxuXG4gIC8qXG4gIEF0dGFjaGVzIGhpZ2hsaWdodGluZyB0byB0aGUgcGFnZSBsb2FkIGV2ZW50LlxuICAqL1xuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkKCkge1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0SGlnaGxpZ2h0aW5nLCBmYWxzZSk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgfVxuXG4gIHZhciBsYW5ndWFnZXMgPSB7fTtcbiAgdmFyIGFsaWFzZXMgPSB7fTtcblxuICBmdW5jdGlvbiByZWdpc3Rlckxhbmd1YWdlKG5hbWUsIGxhbmd1YWdlKSB7XG4gICAgdmFyIGxhbmcgPSBsYW5ndWFnZXNbbmFtZV0gPSBsYW5ndWFnZSh0aGlzKTtcbiAgICBpZiAobGFuZy5hbGlhc2VzKSB7XG4gICAgICBsYW5nLmFsaWFzZXMuZm9yRWFjaChmdW5jdGlvbihhbGlhcykge2FsaWFzZXNbYWxpYXNdID0gbmFtZTt9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMYW5ndWFnZShuYW1lKSB7XG4gICAgcmV0dXJuIGxhbmd1YWdlc1tuYW1lXSB8fCBsYW5ndWFnZXNbYWxpYXNlc1tuYW1lXV07XG4gIH1cblxuICAvKiBJbnRlcmZhY2UgZGVmaW5pdGlvbiAqL1xuXG4gIHRoaXMuaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0O1xuICB0aGlzLmhpZ2hsaWdodEF1dG8gPSBoaWdobGlnaHRBdXRvO1xuICB0aGlzLmZpeE1hcmt1cCA9IGZpeE1hcmt1cDtcbiAgdGhpcy5oaWdobGlnaHRCbG9jayA9IGhpZ2hsaWdodEJsb2NrO1xuICB0aGlzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZTtcbiAgdGhpcy5pbml0SGlnaGxpZ2h0aW5nID0gaW5pdEhpZ2hsaWdodGluZztcbiAgdGhpcy5pbml0SGlnaGxpZ2h0aW5nT25Mb2FkID0gaW5pdEhpZ2hsaWdodGluZ09uTG9hZDtcbiAgdGhpcy5yZWdpc3Rlckxhbmd1YWdlID0gcmVnaXN0ZXJMYW5ndWFnZTtcbiAgdGhpcy5nZXRMYW5ndWFnZSA9IGdldExhbmd1YWdlO1xuICB0aGlzLmluaGVyaXQgPSBpbmhlcml0O1xuXG4gIC8vIENvbW1vbiByZWdleHBzXG4gIHRoaXMuSURFTlRfUkUgPSAnW2EtekEtWl1bYS16QS1aMC05X10qJztcbiAgdGhpcy5VTkRFUlNDT1JFX0lERU5UX1JFID0gJ1thLXpBLVpfXVthLXpBLVowLTlfXSonO1xuICB0aGlzLk5VTUJFUl9SRSA9ICdcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKyk/JztcbiAgdGhpcy5DX05VTUJFUl9SRSA9ICcoXFxcXGIwW3hYXVthLWZBLUYwLTldK3woXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKykoW2VFXVstK10/XFxcXGQrKT8pJzsgLy8gMHguLi4sIDAuLi4sIGRlY2ltYWwsIGZsb2F0XG4gIHRoaXMuQklOQVJZX05VTUJFUl9SRSA9ICdcXFxcYigwYlswMV0rKSc7IC8vIDBiLi4uXG4gIHRoaXMuUkVfU1RBUlRFUlNfUkUgPSAnIXwhPXwhPT18JXwlPXwmfCYmfCY9fFxcXFwqfFxcXFwqPXxcXFxcK3xcXFxcKz18LHwtfC09fC89fC98Onw7fDw8fDw8PXw8PXw8fD09PXw9PXw9fD4+Pj18Pj49fD49fD4+Pnw+Pnw+fFxcXFw/fFxcXFxbfFxcXFx7fFxcXFwofFxcXFxefFxcXFxePXxcXFxcfHxcXFxcfD18XFxcXHxcXFxcfHx+JztcblxuICAvLyBDb21tb24gbW9kZXNcbiAgdGhpcy5CQUNLU0xBU0hfRVNDQVBFID0ge1xuICAgIGJlZ2luOiAnXFxcXFxcXFxbXFxcXHNcXFxcU10nLCByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5BUE9TX1NUUklOR19NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFt0aGlzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gIH07XG4gIHRoaXMuUVVPVEVfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFt0aGlzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gIH07XG4gIHRoaXMuQ19MSU5FX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJy8vJywgZW5kOiAnJCdcbiAgfTtcbiAgdGhpcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJy9cXFxcKicsIGVuZDogJ1xcXFwqLydcbiAgfTtcbiAgdGhpcy5IQVNIX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICB9O1xuICB0aGlzLk5VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkNfTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5DX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5CSU5BUllfTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5CSU5BUllfTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLlJFR0VYUF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgYmVnaW46IC9cXC8vLCBlbmQ6IC9cXC9bZ2ltXSovLFxuICAgIGlsbGVnYWw6IC9cXG4vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB0aGlzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxbLywgZW5kOiAvXFxdLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHRoaXMuVElUTEVfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgYmVnaW46IHRoaXMuSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuVU5ERVJTQ09SRV9USVRMRV9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICBiZWdpbjogdGhpcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xufTtcbm1vZHVsZS5leHBvcnRzID0gSGlnaGxpZ2h0OyIsInZhciBIaWdobGlnaHQgPSByZXF1aXJlKCcuL2hpZ2hsaWdodCcpO1xudmFyIGhsanMgPSBuZXcgSGlnaGxpZ2h0KCk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2Jhc2gnLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9iYXNoLmpzJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdqYXZhc2NyaXB0JywgcmVxdWlyZSgnLi9sYW5ndWFnZXMvamF2YXNjcmlwdC5qcycpKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgneG1sJywgcmVxdWlyZSgnLi9sYW5ndWFnZXMveG1sLmpzJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdtYXJrZG93bicsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL21hcmtkb3duLmpzJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdjc3MnLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9jc3MuanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2h0dHAnLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9odHRwLmpzJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCdpbmknLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9pbmkuanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2pzb24nLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9qc29uLmpzJykpO1xubW9kdWxlLmV4cG9ydHMgPSBobGpzOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVkFSID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAge2JlZ2luOiAvXFwkW1xcd1xcZCNAXVtcXHdcXGRfXSovfSxcbiAgICAgIHtiZWdpbjogL1xcJFxceyguKj8pXFx9L31cbiAgICBdXG4gIH07XG4gIHZhciBRVU9URV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogL1wiLywgZW5kOiAvXCIvLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICBWQVIsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46IC9cXCRcXCgvLCBlbmQ6IC9cXCkvLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHZhciBBUE9TX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvJy8sIGVuZDogLycvXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBsZXhlbWVzOiAvLT9bYS16XFwuXSsvLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnaWYgdGhlbiBlbHNlIGVsaWYgZmkgZm9yIGJyZWFrIGNvbnRpbnVlIHdoaWxlIGluIGRvIGRvbmUgZXhpdCByZXR1cm4gc2V0ICcrXG4gICAgICAgICdkZWNsYXJlIGNhc2UgZXNhYyBleHBvcnQgZXhlYycsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ3ByaW50ZiBlY2hvIHJlYWQgY2QgcHdkIHB1c2hkIHBvcGQgZGlycyBsZXQgZXZhbCB1bnNldCB0eXBlc2V0IHJlYWRvbmx5ICcrXG4gICAgICAgICdnZXRvcHRzIHNvdXJjZSBzaG9wdCBjYWxsZXIgdHlwZSBoYXNoIGJpbmQgaGVscCBzdWRvJyxcbiAgICAgIG9wZXJhdG9yOlxuICAgICAgICAnLW5lIC1lcSAtbHQgLWd0IC1mIC1kIC1lIC1zIC1sIC1hJyAvLyByZWxldmFuY2UgYm9vc3RlclxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hlYmFuZycsXG4gICAgICAgIGJlZ2luOiAvXiMhW15cXG5dK3NoXFxzKiQvLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAvXFx3W1xcd1xcZF9dKlxccypcXChcXHMqXFwpXFxzKlxcey8sXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHtiZWdpbjogL1xcd1tcXHdcXGRfXSovfSldLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIFFVT1RFX1NUUklORyxcbiAgICAgIEFQT1NfU1RSSU5HLFxuICAgICAgVkFSXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIElERU5UX1JFID0gJ1thLXpBLVotXVthLXpBLVowLTlfLV0qJztcbiAgdmFyIEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogSURFTlRfUkUgKyAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFsnc2VsZicsIGhsanMuTlVNQkVSX01PREUsIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERV1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGlsbGVnYWw6ICdbPS98XFwnXScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2lkJywgYmVnaW46ICdcXFxcI1tBLVphLXowLTlfLV0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLCBiZWdpbjogJ1xcXFwuW0EtWmEtejAtOV8tXSsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJfc2VsZWN0b3InLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgICBpbGxlZ2FsOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BzZXVkbycsXG4gICAgICAgIGJlZ2luOiAnOig6KT9bYS16QS1aMC05XFxcXF9cXFxcLVxcXFwrXFxcXChcXFxcKVxcXFxcIlxcXFxcXCddKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0X3J1bGUnLFxuICAgICAgICBiZWdpbjogJ0AoZm9udC1mYWNlfHBhZ2UpJyxcbiAgICAgICAgbGV4ZW1lczogJ1thLXotXSsnLFxuICAgICAgICBrZXl3b3JkczogJ2ZvbnQtZmFjZSBwYWdlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXRfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnQCcsIGVuZDogJ1t7O10nLCAvLyBhdF9ydWxlIGVhdGluZyBmaXJzdCBcIntcIiBpcyBhIGdvb2QgdGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgaXQgZG9lc27igJl0IGxldCBpdCB0byBiZSBwYXJzZWQgYXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgcnVsZSBzZXQgYnV0IGluc3RlYWQgZHJvcHMgcGFyc2VyIGludG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBkZWZhdWx0IG1vZGUgd2hpY2ggaXMgaG93IGl0IHNob3VsZCBiZS5cbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFxTKy9cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAvXFxzLywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBGVU5DVElPTixcbiAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICBobGpzLk5VTUJFUl9NT0RFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLCBiZWdpbjogSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncnVsZXMnLFxuICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICAgICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncnVsZScsXG4gICAgICAgICAgICBiZWdpbjogJ1teXFxcXHNdJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJzsnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAnW0EtWlxcXFxfXFxcXC5cXFxcLV0rJywgZW5kOiAnOicsXG4gICAgICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgICAgICAgICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAgICAgICBGVU5DVElPTixcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaGV4Y29sb3InLCBiZWdpbjogJyNbMC05QS1GYS1mXSsnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdpbXBvcnRhbnQnLCBiZWdpbjogJyFpbXBvcnRhbnQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdcXFxcUycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgYmVnaW46ICdeSFRUUC9bMC05XFxcXC5dKycsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW3tjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJ1xcXFxiXFxcXGR7M31cXFxcYid9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVxdWVzdCcsXG4gICAgICAgIGJlZ2luOiAnXltBLVpdKyAoLio/KSBIVFRQL1swLTlcXFxcLl0rJCcsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICcgJywgZW5kOiAnICcsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFx3JywgZW5kOiAnOiAnLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG58XFxcXHN8PScsXG4gICAgICAgIHN0YXJ0czoge2NsYXNzTmFtZTogJ3N0cmluZycsIGVuZDogJyQnfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcblxcXFxuJyxcbiAgICAgICAgc3RhcnRzOiB7c3ViTGFuZ3VhZ2U6ICcnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZX1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgaWxsZWdhbDogL1xcUy8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnOycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxbJywgZW5kOiAnXFxcXF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZXR0aW5nJyxcbiAgICAgICAgYmVnaW46ICdeW2EtejAtOVxcXFxbXFxcXF1fLV0rWyBcXFxcdF0qPVsgXFxcXHRdKicsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdvbiBvZmYgdHJ1ZSBmYWxzZSB5ZXMgbm8nLFxuICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLlFVT1RFX1NUUklOR19NT0RFLCBobGpzLk5VTUJFUl9NT0RFXSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgYWxpYXNlczogWydqcyddLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnaW4gaWYgZm9yIHdoaWxlIGZpbmFsbHkgdmFyIG5ldyBmdW5jdGlvbiBkbyByZXR1cm4gdm9pZCBlbHNlIGJyZWFrIGNhdGNoICcgK1xuICAgICAgICAnaW5zdGFuY2VvZiB3aXRoIHRocm93IGNhc2UgZGVmYXVsdCB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgdHlwZW9mIGRlbGV0ZSAnICtcbiAgICAgICAgJ2xldCB5aWVsZCBjb25zdCBjbGFzcycsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdldmFsIGlzRmluaXRlIGlzTmFOIHBhcnNlRmxvYXQgcGFyc2VJbnQgZGVjb2RlVVJJIGRlY29kZVVSSUNvbXBvbmVudCAnICtcbiAgICAgICAgJ2VuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgZXNjYXBlIHVuZXNjYXBlIE9iamVjdCBGdW5jdGlvbiBCb29sZWFuIEVycm9yICcgK1xuICAgICAgICAnRXZhbEVycm9yIEludGVybmFsRXJyb3IgUmFuZ2VFcnJvciBSZWZlcmVuY2VFcnJvciBTdG9wSXRlcmF0aW9uIFN5bnRheEVycm9yICcgK1xuICAgICAgICAnVHlwZUVycm9yIFVSSUVycm9yIE51bWJlciBNYXRoIERhdGUgU3RyaW5nIFJlZ0V4cCBBcnJheSBGbG9hdDMyQXJyYXkgJyArXG4gICAgICAgICdGbG9hdDY0QXJyYXkgSW50MTZBcnJheSBJbnQzMkFycmF5IEludDhBcnJheSBVaW50MTZBcnJheSBVaW50MzJBcnJheSAnICtcbiAgICAgICAgJ1VpbnQ4QXJyYXkgVWludDhDbGFtcGVkQXJyYXkgQXJyYXlCdWZmZXIgRGF0YVZpZXcgSlNPTiBJbnRsIGFyZ3VtZW50cyByZXF1aXJlJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGknLFxuICAgICAgICBiZWdpbjogL15cXHMqKCd8XCIpdXNlIHN0cmljdCgnfFwiKS8sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHsgLy8gXCJ2YWx1ZVwiIGNvbnRhaW5lclxuICAgICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICd8XFxcXGIoY2FzZXxyZXR1cm58dGhyb3cpXFxcXGIpXFxcXHMqJyxcbiAgICAgICAga2V5d29yZHM6ICdyZXR1cm4gdGhyb3cgY2FzZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5SRUdFWFBfTU9ERSxcbiAgICAgICAgICB7IC8vIEU0WFxuICAgICAgICAgICAgYmVnaW46IC88LywgZW5kOiAvPjsvLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2Z1bmN0aW9uJywgZW5kOiAvXFx7LyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLmluaGVyaXQoaGxqcy5USVRMRV9NT0RFLCB7YmVnaW46IC9bQS1aYS16JF9dWzAtOUEtWmEteiRfXSovfSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFwoLywgZW5kOiAvXFwpLyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlsbGVnYWw6IC9bXCInXFwoXS9cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGlsbGVnYWw6IC9cXFt8JS9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwkWyguXS8gLy8gcmVsZXZhbmNlIGJvb3N0ZXIgZm9yIGEgcGF0dGVybiBjb21tb24gdG8gSlMgbGliczogYCQoc29tZXRoaW5nKWAgYW5kIGAkLnNvbWV0aGluZ2BcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXC4nICsgaGxqcy5JREVOVF9SRSwgcmVsZXZhbmNlOiAwIC8vIGhhY2s6IHByZXZlbnRzIGRldGVjdGlvbiBvZiBrZXl3b3JkcyBhZnRlciBkb3RzXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIExJVEVSQUxTID0ge2xpdGVyYWw6ICd0cnVlIGZhbHNlIG51bGwnfTtcbiAgdmFyIFRZUEVTID0gW1xuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gIF07XG4gIHZhciBWQUxVRV9DT05UQUlORVIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgIGVuZDogJywnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTXG4gIH07XG4gIHZhciBPQkpFQ1QgPSB7XG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdcXFxccypcIicsIGVuZDogJ1wiXFxcXHMqOlxcXFxzKicsIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBzdGFydHM6IFZBTFVFX0NPTlRBSU5FUlxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICB2YXIgQVJSQVkgPSB7XG4gICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICBjb250YWluczogW2hsanMuaW5oZXJpdChWQUxVRV9DT05UQUlORVIsIHtjbGFzc05hbWU6IG51bGx9KV0sIC8vIGluaGVyaXQgaXMgYWxzbyBhIHdvcmthcm91bmQgZm9yIGEgYnVnIHRoYXQgbWFrZXMgc2hhcmVkIG1vZGVzIHdpdGggZW5kc1dpdGhQYXJlbnQgY29tcGlsZSBvbmx5IHRoZSBlbmRpbmcgb2Ygb25lIG9mIHRoZSBwYXJlbnRzXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICBUWVBFUy5zcGxpY2UoVFlQRVMubGVuZ3RoLCAwLCBPQkpFQ1QsIEFSUkFZKTtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTLFxuICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIC8vIGhpZ2hsaWdodCBoZWFkZXJzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ14jezEsNn0nLCBlbmQ6ICckJyB9LFxuICAgICAgICAgIHsgYmVnaW46ICdeLis/XFxcXG5bPS1dezIsfSQnIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIGlubGluZSBodG1sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPCcsIGVuZDogJz4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIGxpc3RzIChpbmRpY2F0b3JzIG9ubHkpXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1bGxldCcsXG4gICAgICAgIGJlZ2luOiAnXihbKistXXwoXFxcXGQrXFxcXC4pKVxcXFxzKydcbiAgICAgIH0sXG4gICAgICAvLyBzdHJvbmcgc2VnbWVudHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3Ryb25nJyxcbiAgICAgICAgYmVnaW46ICdbKl9dezJ9Lis/WypfXXsyfSdcbiAgICAgIH0sXG4gICAgICAvLyBlbXBoYXNpcyBzZWdtZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ1xcXFwqLis/XFxcXConIH0sXG4gICAgICAgICAgeyBiZWdpbjogJ18uKz9fJ1xuICAgICAgICAgICwgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gYmxvY2txdW90ZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYmxvY2txdW90ZScsXG4gICAgICAgIGJlZ2luOiAnXj5cXFxccysnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIC8vIGNvZGUgc25pcHBldHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29kZScsXG4gICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgeyBiZWdpbjogJ2AuKz9gJyB9LFxuICAgICAgICAgIHsgYmVnaW46ICdeKCB7NH18XFx0KScsIGVuZDogJyQnXG4gICAgICAgICAgLCByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBob3Jpem9udGFsIHJ1bGVzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWxfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnXlstXFxcXCpdezMsfScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgLy8gdXNpbmcgbGlua3MgLSB0aXRsZSBhbmQgbGlua1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxbLis/XFxcXF1bXFxcXChcXFxcW10uKz9bXFxcXClcXFxcXV0nLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5rX2xhYmVsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfdXJsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXF1cXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua19yZWZlcmVuY2UnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcXVxcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdeXFxcXFtcXC4rXFxcXF06JywgZW5kOiAnJCcsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfcmVmZXJlbmNlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfdXJsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXHMnLCBlbmQ6ICckJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBYTUxfSURFTlRfUkUgPSAnW0EtWmEtejAtOVxcXFwuXzotXSsnO1xuICB2YXIgUEhQID0ge1xuICAgIGJlZ2luOiAvPFxcPyhwaHApPyg/IVxcdykvLCBlbmQ6IC9cXD8+LyxcbiAgICBzdWJMYW5ndWFnZTogJ3BocCcsIHN1Ykxhbmd1YWdlTW9kZTogJ2NvbnRpbnVvdXMnXG4gIH07XG4gIHZhciBUQUdfSU5URVJOQUxTID0ge1xuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgIGlsbGVnYWw6IC88LyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFBIUCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46IFhNTF9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz0nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAge2JlZ2luOiAvXCIvLCBlbmQ6IC9cIi99LFxuICAgICAgICAgICAgICB7YmVnaW46IC8nLywgZW5kOiAvJy99LFxuICAgICAgICAgICAgICB7YmVnaW46IC9bXlxcc1xcLz5dKy99XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGFsaWFzZXM6IFsnaHRtbCddLFxuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZG9jdHlwZScsXG4gICAgICAgIGJlZ2luOiAnPCFET0NUWVBFJywgZW5kOiAnPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXSd9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnPCEtLScsIGVuZDogJy0tPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NkYXRhJyxcbiAgICAgICAgYmVnaW46ICc8XFxcXCFcXFxcW0NEQVRBXFxcXFsnLCBlbmQ6ICdcXFxcXVxcXFxdPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8qXG4gICAgICAgIFRoZSBsb29rYWhlYWQgcGF0dGVybiAoPz0uLi4pIGVuc3VyZXMgdGhhdCAnYmVnaW4nIG9ubHkgbWF0Y2hlc1xuICAgICAgICAnPHN0eWxlJyBhcyBhIHNpbmdsZSB3b3JkLCBmb2xsb3dlZCBieSBhIHdoaXRlc3BhY2Ugb3IgYW5cbiAgICAgICAgZW5kaW5nIGJyYWtldC4gVGhlICckJyBpcyBuZWVkZWQgZm9yIHRoZSBsZXhlbWUgdG8gYmUgcmVjb2duaXplZFxuICAgICAgICBieSBobGpzLnN1Yk1vZGUoKSB0aGF0IHRlc3RzIGxleGVtZXMgb3V0c2lkZSB0aGUgc3RyZWFtLlxuICAgICAgICAqL1xuICAgICAgICBiZWdpbjogJzxzdHlsZSg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3N0eWxlJ30sXG4gICAgICAgIGNvbnRhaW5zOiBbVEFHX0lOVEVSTkFMU10sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzwvc3R5bGU+JywgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnY3NzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLFxuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIDxzdHlsZSB0YWcgYWJvdXQgdGhlIGxvb2thaGVhZCBwYXR0ZXJuXG4gICAgICAgIGJlZ2luOiAnPHNjcmlwdCg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3NjcmlwdCd9LFxuICAgICAgICBjb250YWluczogW1RBR19JTlRFUk5BTFNdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6ICc8L3NjcmlwdD4nLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdqYXZhc2NyaXB0J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJzwlJywgZW5kOiAnJT4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3Zic2NyaXB0J1xuICAgICAgfSxcbiAgICAgIFBIUCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGknLFxuICAgICAgICBiZWdpbjogLzxcXD9cXHcrLywgZW5kOiAvXFw/Pi8sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIGJlZ2luOiAnPC8/JywgZW5kOiAnLz8+JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW14gLz48XSsnLCByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRBR19JTlRFUk5BTFNcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwiLy8gaHR0cDovL2hpZ2hsaWdodGpzLnJlYWR0aGVkb2NzLm9yZy9lbi9sYXRlc3QvY3NzLWNsYXNzZXMtcmVmZXJlbmNlLmh0bWxcblxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdhZGRpdGlvbicsXG4gICdhbm5vdGFpb24nLFxuICAnYW5ub3RhdGlvbicsXG4gICdhcmd1bWVudCcsXG4gICdhcnJheScsXG4gICdhdF9ydWxlJyxcbiAgJ2F0dHJfc2VsZWN0b3InLFxuICAnYXR0cmlidXRlJyxcbiAgJ2JlZ2luLWJsb2NrJyxcbiAgJ2Jsb2NrcXVvdGUnLFxuICAnYm9keScsXG4gICdidWlsdF9pbicsXG4gICdidWxsZXQnLFxuICAnY2JyYWNrZXQnLFxuICAnY2RhdGEnLFxuICAnY2VsbCcsXG4gICdjaGFuZ2UnLFxuICAnY2hhcicsXG4gICdjaHVuaycsXG4gICdjbGFzcycsXG4gICdjb2RlJyxcbiAgJ2NvbGxlY3Rpb24nLFxuICAnY29tbWFuZCcsXG4gICdjb21tYW5kcycsXG4gICdjb21tZW4nLFxuICAnY29tbWVudCcsXG4gICdjb25zdGFudCcsXG4gICdjb250YWluZXInLFxuICAnZGFydGRvYycsXG4gICdkYXRlJyxcbiAgJ2RlY29yYXRvcicsXG4gICdkZWZhdWx0JyxcbiAgJ2RlbGV0aW9uJyxcbiAgJ2RvY3R5cGUnLFxuICAnZW1waGFzaXMnLFxuICAnZW5kLWJsb2NrJyxcbiAgJ2VudnZhcicsXG4gICdleHByZXNzaW9uJyxcbiAgJ2ZpbGVuYW1lJyxcbiAgJ2ZpbHRlcicsXG4gICdmbG93JyxcbiAgJ2ZvcmVpZ24nLFxuICAnZm9ybXVsYScsXG4gICdmdW5jJyxcbiAgJ2Z1bmN0aW9uJyxcbiAgJ2Z1bmN0aW9uX25hbWUnLFxuICAnZ2VuZXJpY3MnLFxuICAnaGVhZGVyJyxcbiAgJ2hleGNvbG9yJyxcbiAgJ2hvcml6b250YWxfcnVsZScsXG4gICdpZCcsXG4gICdpbXBvcnQnLFxuICAnaW1wb3J0YW50JyxcbiAgJ2luZml4JyxcbiAgJ2luaGVyaXRhbmNlJyxcbiAgJ2lucHV0JyxcbiAgJ2phdmFkb2MnLFxuICAnamF2YWRvY3RhZycsXG4gICdrZXl3b3JkJyxcbiAgJ2tleXdvcmRzJyxcbiAgJ2xhYmVsJyxcbiAgJ2xpbmtfbGFiZWwnLFxuICAnbGlua19yZWZlcmVuY2UnLFxuICAnbGlua191cmwnLFxuICAnbGlzdCcsXG4gICdsaXRlcmFsJyxcbiAgJ2xvY2FsdmFycycsXG4gICdsb25nX2JyYWNrZXRzJyxcbiAgJ21hdHJpeCcsXG4gICdtb2R1bGUnLFxuICAnbnVtYmVyJyxcbiAgJ29wZXJhdG9yJyxcbiAgJ291dHB1dCcsXG4gICdwYWNrYWdlJyxcbiAgJ3BhcmFtJyxcbiAgJ3BhcmFtZXRlcicsXG4gICdwYXJhbXMnLFxuICAncGFyZW50JyxcbiAgJ3BocGRvYycsXG4gICdwaScsXG4gICdwb2QnLFxuICAncHAnLFxuICAncHJhZ21hJyxcbiAgJ3ByZXByb2Nlc3NvcicsXG4gICdwcm9tcHQnLFxuICAncHJvcGVydHknLFxuICAncHNldWRvJyxcbiAgJ3F1b3RlZCcsXG4gICdyZWNvcmRfbmFtZScsXG4gICdyZWdleCcsXG4gICdyZWdleHAnLFxuICAncmVxdWVzdCcsXG4gICdyZXNlcnZlZCcsXG4gICdyZXN0X2FyZycsXG4gICdydWxlcycsXG4gICdzaGFkZXInLFxuICAnc2hhZGluZycsXG4gICdzaGViYW5nJyxcbiAgJ3NwZWNpYWwnLFxuICAnc3FicmFja2V0JyxcbiAgJ3N0YXR1cycsXG4gICdzdGxfY29udGFpbmVyJyxcbiAgJ3N0cmVhbScsXG4gICdzdHJpbmcnLFxuICAnc3Ryb25nJyxcbiAgJ3N1YicsXG4gICdzdWJzdCcsXG4gICdzdW1tYXJ5JyxcbiAgJ3N5bWJvbCcsXG4gICd0YWcnLFxuICAndGVtcGxhdGVfY29tbWVudCcsXG4gICd0ZW1wbGF0ZV90YWcnLFxuICAndGl0bGUnLFxuICAndHlwZScsXG4gICd0eXBlZGVmJyxcbiAgJ3R5cGVuYW1lJyxcbiAgJ3ZhbHVlJyxcbiAgJ3Zhcl9leHBhbmQnLFxuICAndmFyaWFibGUnLFxuICAnd2ludXRpbHMnLFxuICAneG1sRG9jVGFnJyxcbiAgJ3lhcmRvY3RhZydcbl1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvTWFwID0gcmVxdWlyZSgnLi90b01hcCcpO1xudmFyIHVyaXMgPSBbJ2JhY2tncm91bmQnLCAnYmFzZScsICdjaXRlJywgJ2hyZWYnLCAnbG9uZ2Rlc2MnLCAnc3JjJywgJ3VzZW1hcCddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdXJpczogdG9NYXAodXJpcykgLy8gYXR0cmlidXRlcyB0aGF0IGhhdmUgYW4gaHJlZiBhbmQgaGVuY2UgbmVlZCB0byBiZSBzYW5pdGl6ZWRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWxsb3dlZEF0dHJpYnV0ZXM6IHtcbiAgICBhOiBbJ2hyZWYnLCAnbmFtZScsICd0YXJnZXQnLCAndGl0bGUnLCAnYXJpYS1sYWJlbCddLFxuICAgIGlmcmFtZTogWydhbGxvd2Z1bGxzY3JlZW4nLCAnZnJhbWVib3JkZXInLCAnc3JjJ10sXG4gICAgaW1nOiBbJ3NyYycsICdhbHQnLCAndGl0bGUnLCAnYXJpYS1sYWJlbCddXG4gIH0sXG4gIGFsbG93ZWRDbGFzc2VzOiB7fSxcbiAgYWxsb3dlZFNjaGVtZXM6IFsnaHR0cCcsICdodHRwcycsICdtYWlsdG8nXSxcbiAgYWxsb3dlZFRhZ3M6IFtcbiAgICAnYScsICdhcnRpY2xlJywgJ2InLCAnYmxvY2txdW90ZScsICdicicsICdjYXB0aW9uJywgJ2NvZGUnLCAnZGVsJywgJ2RldGFpbHMnLCAnZGl2JywgJ2VtJyxcbiAgICAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaHInLCAnaScsICdpbWcnLCAnaW5zJywgJ2tiZCcsICdsaScsICdtYWluJyxcbiAgICAnb2wnLCAncCcsICdwcmUnLCAnc2VjdGlvbicsICdzcGFuJywgJ3N0cmlrZScsICdzdHJvbmcnLCAnc3ViJywgJ3N1bW1hcnknLCAnc3VwJywgJ3RhYmxlJyxcbiAgICAndGJvZHknLCAndGQnLCAndGgnLCAndGhlYWQnLCAndHInLCAndWwnXG4gIF0sXG4gIGZpbHRlcjogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvTWFwID0gcmVxdWlyZSgnLi90b01hcCcpO1xudmFyIHZvaWRzID0gWydhcmVhJywgJ2JyJywgJ2NvbCcsICdocicsICdpbWcnLCAnd2JyJywgJ2lucHV0JywgJ2Jhc2UnLCAnYmFzZWZvbnQnLCAnbGluaycsICdtZXRhJ107XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB2b2lkczogdG9NYXAodm9pZHMpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGUgPSByZXF1aXJlKCdoZScpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2Fzc2lnbm1lbnQnKTtcbnZhciBwYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcicpO1xudmFyIHNhbml0aXplciA9IHJlcXVpcmUoJy4vc2FuaXRpemVyJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbmZ1bmN0aW9uIGluc2FuZSAoaHRtbCwgb3B0aW9ucywgc3RyaWN0KSB7XG4gIHZhciBidWZmZXIgPSBbXTtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSBzdHJpY3QgPT09IHRydWUgPyBvcHRpb25zIDogYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIHZhciBoYW5kbGVyID0gc2FuaXRpemVyKGJ1ZmZlciwgY29uZmlndXJhdGlvbik7XG5cbiAgcGFyc2VyKGh0bWwsIGhhbmRsZXIpO1xuXG4gIHJldHVybiBidWZmZXIuam9pbignJyk7XG59XG5cbmluc2FuZS5kZWZhdWx0cyA9IGRlZmF1bHRzO1xubW9kdWxlLmV4cG9ydHMgPSBpbnNhbmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG93ZXJjYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnID8gc3RyaW5nLnRvTG93ZXJDYXNlKCkgOiBzdHJpbmc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGUgPSByZXF1aXJlKCdoZScpO1xudmFyIGxvd2VyY2FzZSA9IHJlcXVpcmUoJy4vbG93ZXJjYXNlJyk7XG52YXIgYXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vYXR0cmlidXRlcycpO1xudmFyIGVsZW1lbnRzID0gcmVxdWlyZSgnLi9lbGVtZW50cycpO1xudmFyIHJzdGFydCA9IC9ePFxccyooW1xcdzotXSspKCg/OlxccytbXFx3Oi1dKyg/Olxccyo9XFxzKig/Oig/OlwiW15cIl0qXCIpfCg/OidbXiddKicpfFtePlxcc10rKSk/KSopXFxzKihcXC8/KVxccyo+LztcbnZhciByZW5kID0gL148XFxzKlxcL1xccyooW1xcdzotXSspW14+XSo+LztcbnZhciByYXR0cnMgPSAvKFtcXHc6LV0rKSg/Olxccyo9XFxzKig/Oig/OlwiKCg/OlteXCJdKSopXCIpfCg/OicoKD86W14nXSkqKScpfChbXj5cXHNdKykpKT8vZztcbnZhciBydGFnID0gL148LztcbnZhciBydGFnZW5kID0gL148XFxzKlxcLy87XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0YWNrICgpIHtcbiAgdmFyIHN0YWNrID0gW107XG4gIHN0YWNrLmxhc3RJdGVtID0gZnVuY3Rpb24gbGFzdEl0ZW0gKCkge1xuICAgIHJldHVybiBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgfTtcbiAgcmV0dXJuIHN0YWNrO1xufVxuXG5mdW5jdGlvbiBwYXJzZXIgKGh0bWwsIGhhbmRsZXIpIHtcbiAgdmFyIHN0YWNrID0gY3JlYXRlU3RhY2soKTtcbiAgdmFyIGxhc3QgPSBodG1sO1xuICB2YXIgY2hhcnM7XG5cbiAgd2hpbGUgKGh0bWwpIHtcbiAgICBwYXJzZVBhcnQoKTtcbiAgfVxuICBwYXJzZUVuZFRhZygpOyAvLyBjbGVhbiB1cCBhbnkgcmVtYWluaW5nIHRhZ3NcblxuICBmdW5jdGlvbiBwYXJzZVBhcnQgKCkge1xuICAgIGNoYXJzID0gdHJ1ZTtcbiAgICBwYXJzZVRhZygpO1xuICAgIGlmIChodG1sID09PSBsYXN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luc2FuZSBwYXJzZXIgZXJyb3I6ICcgKyBodG1sKTtcbiAgICB9XG4gICAgbGFzdCA9IGh0bWw7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVRhZyAoKSB7XG4gICAgaWYgKGh0bWwuc3Vic3RyKDAsIDQpID09PSAnPCEtLScpIHsgLy8gY29tbWVudHNcbiAgICAgIHBhcnNlQ29tbWVudCgpO1xuICAgIH0gZWxzZSBpZiAocnRhZ2VuZC50ZXN0KGh0bWwpKSB7XG4gICAgICBwYXJzZUVkZ2UocmVuZCwgcGFyc2VFbmRUYWcpO1xuICAgIH0gZWxzZSBpZiAocnRhZy50ZXN0KGh0bWwpKSB7XG4gICAgICBwYXJzZUVkZ2UocnN0YXJ0LCBwYXJzZVN0YXJ0VGFnKTtcbiAgICB9XG4gICAgcGFyc2VUYWdEZWNvZGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRWRnZSAocmVnZXgsIHBhcnNlcikge1xuICAgIHZhciBtYXRjaCA9IGh0bWwubWF0Y2gocmVnZXgpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICBtYXRjaFswXS5yZXBsYWNlKHJlZ2V4LCBwYXJzZXIpO1xuICAgICAgY2hhcnMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUNvbW1lbnQgKCkge1xuICAgIHZhciBpbmRleCA9IGh0bWwuaW5kZXhPZignLS0+Jyk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGlmIChoYW5kbGVyLmNvbW1lbnQpIHtcbiAgICAgICAgaGFuZGxlci5jb21tZW50KGh0bWwuc3Vic3RyaW5nKDQsIGluZGV4KSk7XG4gICAgICB9XG4gICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcoaW5kZXggKyAzKTtcbiAgICAgIGNoYXJzID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VUYWdEZWNvZGUgKCkge1xuICAgIGlmICghY2hhcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRleHQ7XG4gICAgdmFyIGluZGV4ID0gaHRtbC5pbmRleE9mKCc8Jyk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRleHQgPSBodG1sLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcoaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gaHRtbDtcbiAgICAgIGh0bWwgPSAnJztcbiAgICB9XG4gICAgaWYgKGhhbmRsZXIuY2hhcnMpIHtcbiAgICAgIGhhbmRsZXIuY2hhcnMoaGUuZGVjb2RlKHRleHQpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVN0YXJ0VGFnICh0YWcsIHRhZ05hbWUsIHJlc3QsIHVuYXJ5KSB7XG4gICAgdmFyIGF0dHJzID0ge307XG4gICAgdmFyIGxvdyA9IGxvd2VyY2FzZSh0YWdOYW1lKTtcbiAgICB2YXIgdSA9IGVsZW1lbnRzLnZvaWRzW2xvd10gfHwgISF1bmFyeTtcblxuICAgIHJlc3QucmVwbGFjZShyYXR0cnMsIGF0dHJSZXBsYWNlcik7XG5cbiAgICBpZiAoIXUpIHtcbiAgICAgIHN0YWNrLnB1c2gobG93KTtcbiAgICB9XG4gICAgaWYgKGhhbmRsZXIuc3RhcnQpIHtcbiAgICAgIGhhbmRsZXIuc3RhcnQobG93LCBhdHRycywgdSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0clJlcGxhY2VyIChtYXRjaCwgbmFtZSwgZG91YmxlUXVvdGVkVmFsdWUsIHNpbmdsZVF1b3RlZFZhbHVlLCB1bnF1b3RlZFZhbHVlKSB7XG4gICAgICBhdHRyc1tuYW1lXSA9IGhlLmRlY29kZShkb3VibGVRdW90ZWRWYWx1ZSB8fCBzaW5nbGVRdW90ZWRWYWx1ZSB8fCB1bnF1b3RlZFZhbHVlIHx8ICcnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUVuZFRhZyAodGFnLCB0YWdOYW1lKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIHBvcyA9IDA7XG4gICAgdmFyIGxvdyA9IGxvd2VyY2FzZSh0YWdOYW1lKTtcbiAgICBpZiAobG93KSB7XG4gICAgICBmb3IgKHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xuICAgICAgICBpZiAoc3RhY2tbcG9zXSA9PT0gbG93KSB7XG4gICAgICAgICAgYnJlYWs7IC8vIGZpbmQgdGhlIGNsb3Nlc3Qgb3BlbmVkIHRhZyBvZiB0aGUgc2FtZSB0eXBlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICBmb3IgKGkgPSBzdGFjay5sZW5ndGggLSAxOyBpID49IHBvczsgaS0tKSB7XG4gICAgICAgIGlmIChoYW5kbGVyLmVuZCkgeyAvLyBjbG9zZSBhbGwgdGhlIG9wZW4gZWxlbWVudHMsIHVwIHRoZSBzdGFja1xuICAgICAgICAgIGhhbmRsZXIuZW5kKHN0YWNrW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhY2subGVuZ3RoID0gcG9zO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhlID0gcmVxdWlyZSgnaGUnKTtcbnZhciBsb3dlcmNhc2UgPSByZXF1aXJlKCcuL2xvd2VyY2FzZScpO1xudmFyIGF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2F0dHJpYnV0ZXMnKTtcblxuZnVuY3Rpb24gc2FuaXRpemVyIChidWZmZXIsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3Q7XG4gIHZhciBjb250ZXh0O1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG5cbiAgcmVzZXQoKTtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IGVuZCxcbiAgICBjaGFyczogY2hhcnNcbiAgfTtcblxuICBmdW5jdGlvbiBvdXQgKHZhbHVlKSB7XG4gICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnQgKHRhZywgYXR0cnMsIHVuYXJ5KSB7XG4gICAgdmFyIGxvdyA9IGxvd2VyY2FzZSh0YWcpO1xuXG4gICAgaWYgKGNvbnRleHQuaWdub3JpbmcpIHtcbiAgICAgIGlnbm9yZShsb3cpOyByZXR1cm47XG4gICAgfVxuICAgIGlmICgoby5hbGxvd2VkVGFncyB8fCBbXSkuaW5kZXhPZihsb3cpID09PSAtMSkge1xuICAgICAgaWdub3JlKGxvdyk7IHJldHVybjtcbiAgICB9XG4gICAgaWYgKG8uZmlsdGVyICYmICFvLmZpbHRlcih7IHRhZzogbG93LCBhdHRyczogYXR0cnMgfSkpIHtcbiAgICAgIGlnbm9yZShsb3cpOyByZXR1cm47XG4gICAgfVxuXG4gICAgb3V0KCc8Jyk7XG4gICAgb3V0KGxvdyk7XG4gICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2gocGFyc2UpO1xuICAgIG91dCh1bmFyeSA/ICcvPicgOiAnPicpO1xuXG4gICAgZnVuY3Rpb24gcGFyc2UgKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cnNba2V5XTtcbiAgICAgIHZhciBjbGFzc2VzT2sgPSAoby5hbGxvd2VkQ2xhc3NlcyB8fCB7fSlbbG93XSB8fCBbXTtcbiAgICAgIHZhciBhdHRyc09rID0gKG8uYWxsb3dlZEF0dHJpYnV0ZXMgfHwge30pW2xvd10gfHwgW107XG4gICAgICB2YXIgdmFsaWQ7XG4gICAgICB2YXIgbGtleSA9IGxvd2VyY2FzZShrZXkpO1xuICAgICAgaWYgKGxrZXkgPT09ICdjbGFzcycgJiYgYXR0cnNPay5pbmRleE9mKGxrZXkpID09PSAtMSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KCcgJykuZmlsdGVyKGlzVmFsaWRDbGFzcykuam9pbignICcpLnRyaW0oKTtcbiAgICAgICAgdmFsaWQgPSB2YWx1ZS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZCA9IGF0dHJzT2suaW5kZXhPZihsa2V5KSAhPT0gLTEgJiYgKGF0dHJpYnV0ZXMudXJpc1tsa2V5XSAhPT0gdHJ1ZSB8fCB0ZXN0VXJsKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgb3V0KCcgJyk7XG4gICAgICAgIG91dChrZXkpO1xuICAgICAgICBvdXQoJz1cIicpO1xuICAgICAgICBvdXQoaGUuZW5jb2RlKHZhbHVlKSk7XG4gICAgICAgIG91dCgnXCInKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGlzVmFsaWRDbGFzcyAoY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzT2sgJiYgY2xhc3Nlc09rLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5kICh0YWcpIHtcbiAgICB2YXIgbG93ID0gbG93ZXJjYXNlKHRhZyk7XG4gICAgdmFyIGFsbG93ZWQgPSAoby5hbGxvd2VkVGFncyB8fCBbXSkuaW5kZXhPZihsb3cpICE9PSAtMTtcbiAgICBpZiAoYWxsb3dlZCkge1xuICAgICAgaWYgKGNvbnRleHQuaWdub3JpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgIG91dCgnPC8nKTtcbiAgICAgICAgb3V0KGxvdyk7XG4gICAgICAgIG91dCgnPicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5pZ25vcmUobG93KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdW5pZ25vcmUobG93KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0ZXN0VXJsICh0ZXh0KSB7XG4gICAgdmFyIHN0YXJ0ID0gdGV4dFswXTtcbiAgICBpZiAoc3RhcnQgPT09ICcjJyB8fCBzdGFydCA9PT0gJy8nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGNvbG9uID0gdGV4dC5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKGNvbG9uID09PSAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBxdWVzdGlvbm1hcmsgPSB0ZXh0LmluZGV4T2YoJz8nKTtcbiAgICBpZiAocXVlc3Rpb25tYXJrICE9PSAtMSAmJiBjb2xvbiA+IHF1ZXN0aW9ubWFyaykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBoYXNoID0gdGV4dC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2ggIT09IC0xICYmIGNvbG9uID4gaGFzaCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBvLmFsbG93ZWRTY2hlbWVzLnNvbWUobWF0Y2hlcyk7XG5cbiAgICBmdW5jdGlvbiBtYXRjaGVzIChzY2hlbWUpIHtcbiAgICAgIHJldHVybiB0ZXh0LmluZGV4T2Yoc2NoZW1lICsgJzonKSA9PT0gMDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGFycyAodGV4dCkge1xuICAgIGlmIChjb250ZXh0Lmlnbm9yaW5nID09PSBmYWxzZSkge1xuICAgICAgb3V0KGhlLmVuY29kZSh0ZXh0KSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaWdub3JlICh0YWcpIHtcbiAgICBpZiAoY29udGV4dC5pZ25vcmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnRleHQgPSB7IGlnbm9yaW5nOiB0YWcsIGRlcHRoOiAxIH07XG4gICAgfSBlbHNlIGlmIChjb250ZXh0Lmlnbm9yaW5nID09PSB0YWcpIHtcbiAgICAgIGNvbnRleHQuZGVwdGgrKztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1bmlnbm9yZSAodGFnKSB7XG4gICAgaWYgKGNvbnRleHQuaWdub3JpbmcgPT09IHRhZykge1xuICAgICAgaWYgKC0tY29udGV4dC5kZXB0aCA8PSAwKSB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQgKCkge1xuICAgIGNvbnRleHQgPSB7IGlnbm9yaW5nOiBmYWxzZSwgZGVwdGg6IDAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNhbml0aXplcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVzY2FwZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5Oydcbn07XG52YXIgdW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiXG59O1xudmFyIHJlc2NhcGVkID0gLygmYW1wO3wmbHQ7fCZndDt8JnF1b3Q7fCYjMzk7KS9nO1xudmFyIHJ1bmVzY2FwZWQgPSAvWyY8PlwiJ10vZztcblxuZnVuY3Rpb24gZXNjYXBlSHRtbENoYXIgKG1hdGNoKSB7XG4gIHJldHVybiBlc2NhcGVzW21hdGNoXTtcbn1cbmZ1bmN0aW9uIHVuZXNjYXBlSHRtbENoYXIgKG1hdGNoKSB7XG4gIHJldHVybiB1bmVzY2FwZXNbbWF0Y2hdO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVIdG1sICh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0ID09IG51bGwgPyAnJyA6IFN0cmluZyh0ZXh0KS5yZXBsYWNlKHJ1bmVzY2FwZWQsIGVzY2FwZUh0bWxDaGFyKTtcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGVIdG1sIChodG1sKSB7XG4gIHJldHVybiBodG1sID09IG51bGwgPyAnJyA6IFN0cmluZyhodG1sKS5yZXBsYWNlKHJlc2NhcGVkLCB1bmVzY2FwZUh0bWxDaGFyKTtcbn1cblxuZXNjYXBlSHRtbC5vcHRpb25zID0gdW5lc2NhcGVIdG1sLm9wdGlvbnMgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVuY29kZTogZXNjYXBlSHRtbCxcbiAgZXNjYXBlOiBlc2NhcGVIdG1sLFxuICBkZWNvZGU6IHVuZXNjYXBlSHRtbCxcbiAgdW5lc2NhcGU6IHVuZXNjYXBlSHRtbCxcbiAgdmVyc2lvbjogJzEuMC4wLWJyb3dzZXInXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB0b01hcCAobGlzdCkge1xuICByZXR1cm4gbGlzdC5yZWR1Y2UoYXNLZXksIHt9KTtcbn1cblxuZnVuY3Rpb24gYXNLZXkgKGFjY3VtdWxhdG9yLCBpdGVtKSB7XG4gIGFjY3VtdWxhdG9yW2l0ZW1dID0gdHJ1ZTtcbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTWFwO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBIZWxwZXJzXG5cbi8vIE1lcmdlIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2NsYXNzKG9iaikgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7IH1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikgeyByZXR1cm4gX2NsYXNzKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nOyB9XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBPYmplY3RdJzsgfVxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7IH1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJzsgfVxuXG5cbmZ1bmN0aW9uIGVzY2FwZVJFIChzdHIpIHsgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csICdcXFxcJCYnKTsgfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbnZhciBkZWZhdWx0U2NoZW1hcyA9IHtcbiAgJ2h0dHA6Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLmh0dHApIHtcbiAgICAgICAgLy8gY29tcGlsZSBsYXppbHksIGJlY2F1c2UgXCJob3N0XCItY29udGFpbmluZyB2YXJpYWJsZXMgY2FuIGNoYW5nZSBvbiB0bGRzIHVwZGF0ZS5cbiAgICAgICAgc2VsZi5yZS5odHRwID0gIG5ldyBSZWdFeHAoXG4gICAgICAgICAgJ15cXFxcL1xcXFwvJyArIHNlbGYucmUuc3JjX2F1dGggKyBzZWxmLnJlLnNyY19ob3N0X3BvcnRfc3RyaWN0ICsgc2VsZi5yZS5zcmNfcGF0aCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdodHRwczonOiAgJ2h0dHA6JyxcbiAgJ2Z0cDonOiAgICAnaHR0cDonLFxuICAnLy8nOiAgICAgIHtcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKHRleHQsIHBvcywgc2VsZikge1xuICAgICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICAgIGlmICghc2VsZi5yZS5ub19odHRwKSB7XG4gICAgICAvLyBjb21waWxlIGxhemlseSwgYmVjYXlzZSBcImhvc3RcIi1jb250YWluaW5nIHZhcmlhYmxlcyBjYW4gY2hhbmdlIG9uIHRsZHMgdXBkYXRlLlxuICAgICAgICBzZWxmLnJlLm5vX2h0dHAgPSAgbmV3IFJlZ0V4cChcbiAgICAgICAgICAnXicgKyBzZWxmLnJlLnNyY19hdXRoICsgc2VsZi5yZS5zcmNfaG9zdF9wb3J0X3N0cmljdCArIHNlbGYucmUuc3JjX3BhdGgsICdpJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5yZS5ub19odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSBgOi8vYCwgdGhhdCBwcm90ZWN0cyBmcm9tIGVycm9ycyBpbiBwcm90b2NvbCBuYW1lXG4gICAgICAgIGlmIChwb3MgPj0gMyAmJiB0ZXh0W3BvcyAtIDNdID09PSAnOicpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5ub19odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdtYWlsdG86Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLm1haWx0bykge1xuICAgICAgICBzZWxmLnJlLm1haWx0byA9ICBuZXcgUmVnRXhwKFxuICAgICAgICAgICdeJyArIHNlbGYucmUuc3JjX2VtYWlsX25hbWUgKyAnQCcgKyBzZWxmLnJlLnNyY19ob3N0X3N0cmljdCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5tYWlsdG8udGVzdCh0YWlsKSkge1xuICAgICAgICByZXR1cm4gdGFpbC5tYXRjaChzZWxmLnJlLm1haWx0bylbMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59O1xuXG4vLyBET04nVCB0cnkgdG8gbWFrZSBQUnMgd2l0aCBjaGFuZ2VzLiBFeHRlbmQgVExEcyB3aXRoIExpbmtpZnlJdC50bGRzKCkgaW5zdGVhZFxudmFyIHRsZHNfZGVmYXVsdCA9ICdiaXp8Y29tfGVkdXxnb3Z8bmV0fG9yZ3xwcm98d2VifHh4eHxhZXJvfGFzaWF8Y29vcHxpbmZvfG11c2V1bXxuYW1lfHNob3B80YDRhCcuc3BsaXQoJ3wnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gcmVzZXRTY2FuQ2FjaGUoc2VsZikge1xuICBzZWxmLl9faW5kZXhfXyA9IC0xO1xuICBzZWxmLl9fdGV4dF9jYWNoZV9fICAgPSAnJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFsaWRhdG9yKHJlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGV4dCwgcG9zKSB7XG4gICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICBpZiAocmUudGVzdCh0YWlsKSkge1xuICAgICAgcmV0dXJuIHRhaWwubWF0Y2gocmUpWzBdLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vcm1hbGl6ZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobWF0Y2gsIHNlbGYpIHtcbiAgICBzZWxmLm5vcm1hbGl6ZShtYXRjaCk7XG4gIH07XG59XG5cbi8vIFNjaGVtYXMgY29tcGlsZXIuIEJ1aWxkIHJlZ2V4cHMuXG4vL1xuZnVuY3Rpb24gY29tcGlsZShzZWxmKSB7XG5cbiAgLy8gTG9hZCAmIGNsb25lIFJFIHBhdHRlcm5zLlxuICB2YXIgcmUgPSBzZWxmLnJlID0gYXNzaWduKHt9LCByZXF1aXJlKCcuL2xpYi9yZScpKTtcblxuICAvLyBEZWZpbmUgZHluYW1pYyBwYXR0ZXJuc1xuICB2YXIgdGxkcyA9IHNlbGYuX190bGRzX18uc2xpY2UoKTtcblxuICBpZiAoIXNlbGYuX190bGRzX3JlcGxhY2VkX18pIHtcbiAgICB0bGRzLnB1c2goJ1thLXpdezJ9Jyk7XG4gIH1cbiAgdGxkcy5wdXNoKHJlLnNyY194bik7XG5cbiAgcmUuc3JjX3RsZHMgPSB0bGRzLmpvaW4oJ3wnKTtcblxuICBmdW5jdGlvbiB1bnRwbCh0cGwpIHsgcmV0dXJuIHRwbC5yZXBsYWNlKCclVExEUyUnLCByZS5zcmNfdGxkcyk7IH1cblxuICByZS5lbWFpbF9mdXp6eSAgICAgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9lbWFpbF9mdXp6eSksICdpJyk7XG4gIHJlLmxpbmtfZnV6enkgICAgICAgPSBSZWdFeHAodW50cGwocmUudHBsX2xpbmtfZnV6enkpLCAnaScpO1xuICByZS5ob3N0X2Z1enp5X3Rlc3QgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9ob3N0X2Z1enp5X3Rlc3QpLCAnaScpO1xuXG4gIC8vXG4gIC8vIENvbXBpbGUgZWFjaCBzY2hlbWFcbiAgLy9cblxuICB2YXIgYWxpYXNlcyA9IFtdO1xuXG4gIHNlbGYuX19jb21waWxlZF9fID0ge307IC8vIFJlc2V0IGNvbXBpbGVkIGRhdGFcblxuICBmdW5jdGlvbiBzY2hlbWFFcnJvcihuYW1lLCB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJyhMaW5raWZ5SXQpIEludmFsaWQgc2NoZW1hIFwiJyArIG5hbWUgKyAnXCI6ICcgKyB2YWwpO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoc2VsZi5fX3NjaGVtYXNfXykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB2YWwgPSBzZWxmLl9fc2NoZW1hc19fW25hbWVdO1xuXG4gICAgLy8gc2tpcCBkaXNhYmxlZCBtZXRob2RzXG4gICAgaWYgKHZhbCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjb21waWxlZCA9IHsgdmFsaWRhdGU6IG51bGwsIGxpbms6IG51bGwgfTtcblxuICAgIHNlbGYuX19jb21waWxlZF9fW25hbWVdID0gY29tcGlsZWQ7XG5cbiAgICBpZiAoaXNPYmplY3QodmFsKSkge1xuICAgICAgaWYgKGlzUmVnRXhwKHZhbC52YWxpZGF0ZSkpIHtcbiAgICAgICAgY29tcGlsZWQudmFsaWRhdGUgPSBjcmVhdGVWYWxpZGF0b3IodmFsLnZhbGlkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih2YWwudmFsaWRhdGUpKSB7XG4gICAgICAgIGNvbXBpbGVkLnZhbGlkYXRlID0gdmFsLnZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRnVuY3Rpb24odmFsLm5vcm1hbGl6ZSkpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gdmFsLm5vcm1hbGl6ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXZhbC5ub3JtYWxpemUpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gY3JlYXRlTm9ybWFsaXplcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICBhbGlhc2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgfSk7XG5cbiAgLy9cbiAgLy8gQ29tcGlsZSBwb3N0cG9uZWQgYWxpYXNlc1xuICAvL1xuXG4gIGFsaWFzZXMuZm9yRWFjaChmdW5jdGlvbiAoYWxpYXMpIHtcbiAgICBpZiAoIXNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXSkge1xuICAgICAgLy8gU2lsZW50bHkgZmFpbCBvbiBtaXNzZWQgc2NoZW1hcyB0byBhdm9pZCBlcnJvbnMgb24gZGlzYWJsZS5cbiAgICAgIC8vIHNjaGVtYUVycm9yKGFsaWFzLCBzZWxmLl9fc2NoZW1hc19fW2FsaWFzXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5fX2NvbXBpbGVkX19bYWxpYXNdLnZhbGlkYXRlID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS52YWxpZGF0ZTtcbiAgICBzZWxmLl9fY29tcGlsZWRfX1thbGlhc10ubm9ybWFsaXplID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS5ub3JtYWxpemU7XG4gIH0pO1xuXG4gIC8vXG4gIC8vIEZha2UgcmVjb3JkIGZvciBndWVzc2VkIGxpbmtzXG4gIC8vXG4gIHNlbGYuX19jb21waWxlZF9fWycnXSA9IHsgdmFsaWRhdGU6IG51bGwsIG5vcm1hbGl6ZTogY3JlYXRlTm9ybWFsaXplcigpIH07XG5cbiAgLy9cbiAgLy8gQnVpbGQgc2NoZW1hIGNvbmRpdGlvblxuICAvL1xuICB2YXIgc2xpc3QgPSBPYmplY3Qua2V5cyhzZWxmLl9fY29tcGlsZWRfXylcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBkaXNhYmxlZCAmIGZha2Ugc2NoZW1hc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiBzZWxmLl9fY29tcGlsZWRfX1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZXNjYXBlUkUpXG4gICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJ3wnKTtcbiAgLy8gKD8hXykgY2F1c2UgMS41eCBzbG93ZG93blxuICBzZWxmLnJlLnNjaGVtYV90ZXN0ICAgPSBSZWdFeHAoJyhefCg/IV8pKD86PnwnICsgcmUuc3JjX1pQQ2NDZiArICcpKSgnICsgc2xpc3QgKyAnKScsICdpJyk7XG4gIHNlbGYucmUuc2NoZW1hX3NlYXJjaCA9IFJlZ0V4cCgnKF58KD8hXykoPzo+fCcgKyByZS5zcmNfWlBDY0NmICsgJykpKCcgKyBzbGlzdCArICcpJywgJ2lnJyk7XG5cbiAgLy9cbiAgLy8gQ2xlYW51cFxuICAvL1xuXG4gIHJlc2V0U2NhbkNhY2hlKHNlbGYpO1xufVxuXG4vKipcbiAqIGNsYXNzIE1hdGNoXG4gKlxuICogTWF0Y2ggcmVzdWx0LiBTaW5nbGUgZWxlbWVudCBvZiBhcnJheSwgcmV0dXJuZWQgYnkgW1tMaW5raWZ5SXQjbWF0Y2hdXVxuICoqL1xuZnVuY3Rpb24gTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIHN0YXJ0ID0gc2VsZi5fX2luZGV4X18sXG4gICAgICBlbmQgICA9IHNlbGYuX19sYXN0X2luZGV4X18sXG4gICAgICB0ZXh0ICA9IHNlbGYuX190ZXh0X2NhY2hlX18uc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgLyoqXG4gICAqIE1hdGNoI3NjaGVtYSAtPiBTdHJpbmdcbiAgICpcbiAgICogUHJlZml4IChwcm90b2NvbCkgZm9yIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMuc2NoZW1hICAgID0gc2VsZi5fX3NjaGVtYV9fLnRvTG93ZXJDYXNlKCk7XG4gIC8qKlxuICAgKiBNYXRjaCNpbmRleCAtPiBOdW1iZXJcbiAgICpcbiAgICogRmlyc3QgcG9zaXRpb24gb2YgbWF0Y2hlZCBzdHJpbmcuXG4gICAqKi9cbiAgdGhpcy5pbmRleCAgICAgPSBzdGFydCArIHNoaWZ0O1xuICAvKipcbiAgICogTWF0Y2gjbGFzdEluZGV4IC0+IE51bWJlclxuICAgKlxuICAgKiBOZXh0IHBvc2l0aW9uIGFmdGVyIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMubGFzdEluZGV4ID0gZW5kICsgc2hpZnQ7XG4gIC8qKlxuICAgKiBNYXRjaCNyYXcgLT4gU3RyaW5nXG4gICAqXG4gICAqIE1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMucmF3ICAgICAgID0gdGV4dDtcbiAgLyoqXG4gICAqIE1hdGNoI3RleHQgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vdG1hbGl6ZWQgdGV4dCBvZiBtYXRjaGVkIHN0cmluZy5cbiAgICoqL1xuICB0aGlzLnRleHQgICAgICA9IHRleHQ7XG4gIC8qKlxuICAgKiBNYXRjaCN1cmwgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vcm1hbGl6ZWQgdXJsIG9mIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMudXJsICAgICAgID0gdGV4dDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIG1hdGNoID0gbmV3IE1hdGNoKHNlbGYsIHNoaWZ0KTtcblxuICBzZWxmLl9fY29tcGlsZWRfX1ttYXRjaC5zY2hlbWFdLm5vcm1hbGl6ZShtYXRjaCwgc2VsZik7XG5cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5cbi8qKlxuICogY2xhc3MgTGlua2lmeUl0XG4gKiovXG5cbi8qKlxuICogbmV3IExpbmtpZnlJdChzY2hlbWFzKVxuICogLSBzY2hlbWFzIChPYmplY3QpOiBPcHRpb25hbC4gQWRkaXRpb25hbCBzY2hlbWFzIHRvIHZhbGlkYXRlIChwcmVmaXgvdmFsaWRhdG9yKVxuICpcbiAqIENyZWF0ZXMgbmV3IGxpbmtpZmllciBpbnN0YW5jZSB3aXRoIG9wdGlvbmFsIGFkZGl0aW9uYWwgc2NoZW1hcy5cbiAqIENhbiBiZSBjYWxsZWQgd2l0aG91dCBgbmV3YCBrZXl3b3JkIGZvciBjb252ZW5pZW5jZS5cbiAqXG4gKiBCeSBkZWZhdWx0IHVuZGVyc3RhbmRzOlxuICpcbiAqIC0gYGh0dHAocyk6Ly8uLi5gICwgYGZ0cDovLy4uLmAsIGBtYWlsdG86Li4uYCAmIGAvLy4uLmAgbGlua3NcbiAqIC0gXCJmdXp6eVwiIGxpbmtzIGFuZCBlbWFpbHMgKGV4YW1wbGUuY29tLCBmb29AYmFyLmNvbSkuXG4gKlxuICogYHNjaGVtYXNgIGlzIGFuIG9iamVjdCwgd2hlcmUgZWFjaCBrZXkvdmFsdWUgZGVzY3JpYmVzIHByb3RvY29sL3J1bGU6XG4gKlxuICogLSBfX2tleV9fIC0gbGluayBwcmVmaXggKHVzdWFsbHksIHByb3RvY29sIG5hbWUgd2l0aCBgOmAgYXQgdGhlIGVuZCwgYHNreXBlOmBcbiAqICAgZm9yIGV4YW1wbGUpLiBgbGlua2lmeS1pdGAgbWFrZXMgc2h1cmUgdGhhdCBwcmVmaXggaXMgbm90IHByZWNlZWRlZCB3aXRoXG4gKiAgIGFscGhhbnVtZXJpYyBjaGFyIGFuZCBzeW1ib2xzLiBPbmx5IHdoaXRlc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiBhbGxvd2VkLlxuICogLSBfX3ZhbHVlX18gLSBydWxlIHRvIGNoZWNrIHRhaWwgYWZ0ZXIgbGluayBwcmVmaXhcbiAqICAgLSBfU3RyaW5nXyAtIGp1c3QgYWxpYXMgdG8gZXhpc3RpbmcgcnVsZVxuICogICAtIF9PYmplY3RfXG4gKiAgICAgLSBfdmFsaWRhdGVfIC0gdmFsaWRhdG9yIGZ1bmN0aW9uIChzaG91bGQgcmV0dXJuIG1hdGNoZWQgbGVuZ3RoIG9uIHN1Y2Nlc3MpLFxuICogICAgICAgb3IgYFJlZ0V4cGAuXG4gKiAgICAgLSBfbm9ybWFsaXplXyAtIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0ZXh0ICYgdXJsIG9mIG1hdGNoZWQgcmVzdWx0XG4gKiAgICAgICAoZm9yIGV4YW1wbGUsIGZvciBAdHdpdHRlciBtZW50aW9ucykuXG4gKiovXG5mdW5jdGlvbiBMaW5raWZ5SXQoc2NoZW1hcykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGlua2lmeUl0KSkge1xuICAgIHJldHVybiBuZXcgTGlua2lmeUl0KHNjaGVtYXMpO1xuICB9XG5cbiAgLy8gQ2FjaGUgbGFzdCB0ZXN0ZWQgcmVzdWx0LiBVc2VkIHRvIHNraXAgcmVwZWF0aW5nIHN0ZXBzIG9uIG5leHQgYG1hdGNoYCBjYWxsLlxuICB0aGlzLl9faW5kZXhfXyAgICAgICAgICA9IC0xO1xuICB0aGlzLl9fbGFzdF9pbmRleF9fICAgICA9IC0xOyAvLyBOZXh0IHNjYW4gcG9zaXRpb25cbiAgdGhpcy5fX3NjaGVtYV9fICAgICAgICAgPSAnJztcbiAgdGhpcy5fX3RleHRfY2FjaGVfXyAgICAgPSAnJztcblxuICB0aGlzLl9fc2NoZW1hc19fICAgICAgICA9IGFzc2lnbih7fSwgZGVmYXVsdFNjaGVtYXMsIHNjaGVtYXMpO1xuICB0aGlzLl9fY29tcGlsZWRfXyAgICAgICA9IHt9O1xuXG4gIHRoaXMuX190bGRzX18gICAgICAgICAgID0gdGxkc19kZWZhdWx0O1xuICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fICA9IGZhbHNlO1xuXG4gIHRoaXMucmUgPSB7fTtcblxuICBjb21waWxlKHRoaXMpO1xufVxuXG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCNhZGQoc2NoZW1hLCBkZWZpbml0aW9uKVxuICogLSBzY2hlbWEgKFN0cmluZyk6IHJ1bGUgbmFtZSAoZml4ZWQgcGF0dGVybiBwcmVmaXgpXG4gKiAtIGRlZmluaXRpb24gKFN0cmluZ3xSZWdFeHB8T2JqZWN0KTogc2NoZW1hIGRlZmluaXRpb25cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgZGVmaW5pdGlvbi4gU2VlIGNvbnN0cnVjdG9yIGRlc2NyaXB0aW9uIGZvciBkZXRhaWxzLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoc2NoZW1hLCBkZWZpbml0aW9uKSB7XG4gIHRoaXMuX19zY2hlbWFzX19bc2NoZW1hXSA9IGRlZmluaXRpb247XG4gIGNvbXBpbGUodGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCN0ZXN0KHRleHQpIC0+IEJvb2xlYW5cbiAqXG4gKiBTZWFyY2hlcyBsaW5raWZpYWJsZSBwYXR0ZXJuIGFuZCByZXR1cm5zIGB0cnVlYCBvbiBzdWNjZXNzIG9yIGBmYWxzZWAgb24gZmFpbC5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGVzdCA9IGZ1bmN0aW9uIHRlc3QodGV4dCkge1xuICAvLyBSZXNldCBzY2FuIGNhY2hlXG4gIHRoaXMuX190ZXh0X2NhY2hlX18gPSB0ZXh0O1xuICB0aGlzLl9faW5kZXhfXyAgICAgID0gLTE7XG5cbiAgaWYgKCF0ZXh0Lmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB2YXIgbSwgbWwsIG1lLCBsZW4sIHNoaWZ0LCBuZXh0LCByZSwgdGxkX3BvcywgYXRfcG9zO1xuXG4gIC8vIHRyeSB0byBzY2FuIGZvciBsaW5rIHdpdGggc2NoZW1hIC0gdGhhdCdzIHRoZSBtb3N0IHNpbXBsZSBydWxlXG4gIGlmICh0aGlzLnJlLnNjaGVtYV90ZXN0LnRlc3QodGV4dCkpIHtcbiAgICByZSA9IHRoaXMucmUuc2NoZW1hX3NlYXJjaDtcbiAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IHJlLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBsZW4gPSB0aGlzLnRlc3RTY2hlbWFBdCh0ZXh0LCBtWzJdLCByZS5sYXN0SW5kZXgpO1xuICAgICAgaWYgKGxlbikge1xuICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gbVsyXTtcbiAgICAgICAgdGhpcy5fX2luZGV4X18gICAgICA9IG0uaW5kZXggKyBtWzFdLmxlbmd0aDtcbiAgICAgICAgdGhpcy5fX2xhc3RfaW5kZXhfXyA9IG0uaW5kZXggKyBtWzBdLmxlbmd0aCArIGxlbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX19jb21waWxlZF9fWydodHRwOiddKSB7XG4gICAgLy8gZ3Vlc3Mgc2NoZW1hbGVzcyBsaW5rc1xuICAgIHRsZF9wb3MgPSB0ZXh0LnNlYXJjaCh0aGlzLnJlLmhvc3RfZnV6enlfdGVzdCk7XG4gICAgaWYgKHRsZF9wb3MgPj0gMCkge1xuICAgICAgLy8gaWYgdGxkIGlzIGxvY2F0ZWQgYWZ0ZXIgZm91bmQgbGluayAtIG5vIG5lZWQgdG8gY2hlY2sgZnV6enkgcGF0dGVyblxuICAgICAgaWYgKHRoaXMuX19pbmRleF9fIDwgMCB8fCB0bGRfcG9zIDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgaWYgKChtbCA9IHRleHQubWF0Y2godGhpcy5yZS5saW5rX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIHNoaWZ0ID0gbWwuaW5kZXggKyBtbFsxXS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX2luZGV4X18gPCAwIHx8IHNoaWZ0IDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlbWFfXyAgICAgPSAnJztcbiAgICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICAgIHRoaXMuX19sYXN0X2luZGV4X18gPSBtbC5pbmRleCArIG1sWzBdLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fX2NvbXBpbGVkX19bJ21haWx0bzonXSkge1xuICAgIC8vIGd1ZXNzIHNjaGVtYWxlc3MgZW1haWxzXG4gICAgYXRfcG9zID0gdGV4dC5pbmRleE9mKCdAJyk7XG4gICAgaWYgKGF0X3BvcyA+PSAwKSB7XG4gICAgICAvLyBXZSBjYW4ndCBza2lwIHRoaXMgY2hlY2ssIGJlY2F1c2UgdGhpcyBjYXNlcyBhcmUgcG9zc2libGU6XG4gICAgICAvLyAxOTIuMTY4LjEuMUBnbWFpbC5jb20sIG15LmluQGV4YW1wbGUuY29tXG4gICAgICBpZiAoKG1lID0gdGV4dC5tYXRjaCh0aGlzLnJlLmVtYWlsX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICBzaGlmdCA9IG1lLmluZGV4ICsgbWVbMV0ubGVuZ3RoO1xuICAgICAgICBuZXh0ICA9IG1lLmluZGV4ICsgbWVbMF0ubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0aGlzLl9faW5kZXhfXyA8IDAgfHwgc2hpZnQgPCB0aGlzLl9faW5kZXhfXyB8fFxuICAgICAgICAgICAgKHNoaWZ0ID09PSB0aGlzLl9faW5kZXhfXyAmJiBuZXh0ID4gdGhpcy5fX2xhc3RfaW5kZXhfXykpIHtcbiAgICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gJ21haWx0bzonO1xuICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICB0aGlzLl9fbGFzdF9pbmRleF9fID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLl9faW5kZXhfXyA+PSAwO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCN0ZXN0U2NoZW1hQXQodGV4dCwgbmFtZSwgcG9zaXRpb24pIC0+IE51bWJlclxuICogLSB0ZXh0IChTdHJpbmcpOiB0ZXh0IHRvIHNjYW5cbiAqIC0gbmFtZSAoU3RyaW5nKTogcnVsZSAoc2NoZW1hKSBuYW1lXG4gKiAtIHBvc2l0aW9uIChOdW1iZXIpOiB0ZXh0IG9mZnNldCB0byBjaGVjayBmcm9tXG4gKlxuICogU2ltaWxhciB0byBbW0xpbmtpZnlJdCN0ZXN0XV0gYnV0IGNoZWNrcyBvbmx5IHNwZWNpZmljIHByb3RvY29sIHRhaWwgZXhhY3RseVxuICogYXQgZ2l2ZW4gcG9zaXRpb24uIFJldHVybnMgbGVuZ3RoIG9mIGZvdW5kIHBhdHRlcm4gKDAgb24gZmFpbCkuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRlc3RTY2hlbWFBdCA9IGZ1bmN0aW9uIHRlc3RTY2hlbWFBdCh0ZXh0LCBzY2hlbWEsIHBvcykge1xuICAvLyBJZiBub3Qgc3VwcG9ydGVkIHNjaGVtYSBjaGVjayByZXF1ZXN0ZWQgLSB0ZXJtaW5hdGVcbiAgaWYgKCF0aGlzLl9fY29tcGlsZWRfX1tzY2hlbWEudG9Mb3dlckNhc2UoKV0pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gdGhpcy5fX2NvbXBpbGVkX19bc2NoZW1hLnRvTG93ZXJDYXNlKCldLnZhbGlkYXRlKHRleHQsIHBvcywgdGhpcyk7XG59O1xuXG5cbi8qKlxuICogTGlua2lmeUl0I21hdGNoKHRleHQpIC0+IEFycmF5fG51bGxcbiAqXG4gKiBSZXR1cm5zIGFycmF5IG9mIGZvdW5kIGxpbmsgZGVzY3JpcHRpb25zIG9yIGBudWxsYCBvbiBmYWlsLiBXZSBzdHJvbmdseVxuICogdG8gdXNlIFtbTGlua2lmeUl0I3Rlc3RdXSBmaXJzdCwgZm9yIGJlc3Qgc3BlZWQuXG4gKlxuICogIyMjIyMgUmVzdWx0IG1hdGNoIGRlc2NyaXB0aW9uXG4gKlxuICogLSBfX3NjaGVtYV9fIC0gbGluayBzY2hlbWEsIGNhbiBiZSBlbXB0eSBmb3IgZnV6enkgbGlua3MsIG9yIGAvL2AgZm9yXG4gKiAgIHByb3RvY29sLW5ldXRyYWwgIGxpbmtzLlxuICogLSBfX2luZGV4X18gLSBvZmZzZXQgb2YgbWF0Y2hlZCB0ZXh0XG4gKiAtIF9fbGFzdEluZGV4X18gLSBpbmRleCBvZiBuZXh0IGNoYXIgYWZ0ZXIgbWF0aGNoIGVuZFxuICogLSBfX3Jhd19fIC0gbWF0Y2hlZCB0ZXh0XG4gKiAtIF9fdGV4dF9fIC0gbm9ybWFsaXplZCB0ZXh0XG4gKiAtIF9fdXJsX18gLSBsaW5rLCBnZW5lcmF0ZWQgZnJvbSBtYXRjaGVkIHRleHRcbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiBtYXRjaCh0ZXh0KSB7XG4gIHZhciBzaGlmdCA9IDAsIHJlc3VsdCA9IFtdO1xuXG4gIC8vIFRyeSB0byB0YWtlIHByZXZpb3VzIGVsZW1lbnQgZnJvbSBjYWNoZSwgaWYgLnRlc3QoKSBjYWxsZWQgYmVmb3JlXG4gIGlmICh0aGlzLl9faW5kZXhfXyA+PSAwICYmIHRoaXMuX190ZXh0X2NhY2hlX18gPT09IHRleHQpIHtcbiAgICByZXN1bHQucHVzaChjcmVhdGVNYXRjaCh0aGlzLCBzaGlmdCkpO1xuICAgIHNoaWZ0ID0gdGhpcy5fX2xhc3RfaW5kZXhfXztcbiAgfVxuXG4gIC8vIEN1dCBoZWFkIGlmIGNhY2hlIHdhcyB1c2VkXG4gIHZhciB0YWlsID0gc2hpZnQgPyB0ZXh0LnNsaWNlKHNoaWZ0KSA6IHRleHQ7XG5cbiAgLy8gU2NhbiBzdHJpbmcgdW50aWwgZW5kIHJlYWNoZWRcbiAgd2hpbGUgKHRoaXMudGVzdCh0YWlsKSkge1xuICAgIHJlc3VsdC5wdXNoKGNyZWF0ZU1hdGNoKHRoaXMsIHNoaWZ0KSk7XG5cbiAgICB0YWlsID0gdGFpbC5zbGljZSh0aGlzLl9fbGFzdF9pbmRleF9fKTtcbiAgICBzaGlmdCArPSB0aGlzLl9fbGFzdF9pbmRleF9fO1xuICB9XG5cbiAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCN0bGRzKGxpc3QgWywga2VlcE9sZF0pIC0+IHRoaXNcbiAqIC0gbGlzdCAoQXJyYXkpOiBsaXN0IG9mIHRsZHNcbiAqIC0ga2VlcE9sZCAoQm9vbGVhbik6IG1lcmdlIHdpdGggY3VycmVudCBsaXN0IGlmIGB0cnVlYCAoYGZhbHNlYCBieSBkZWZhdWx0KVxuICpcbiAqIExvYWQgKG9yIG1lcmdlKSBuZXcgdGxkcyBsaXN0LiBUaG9zZSBhcmUgdXNlciBmb3IgZnV6enkgbGlua3MgKHdpdGhvdXQgcHJlZml4KVxuICogdG8gYXZvaWQgZmFsc2UgcG9zaXRpdmVzLiBCeSBkZWZhdWx0IHRoaXMgYWxnb3J5dGhtIHVzZWQ6XG4gKlxuICogLSBob3N0bmFtZSB3aXRoIGFueSAyLWxldHRlciByb290IHpvbmVzIGFyZSBvay5cbiAqIC0gYml6fGNvbXxlZHV8Z292fG5ldHxvcmd8cHJvfHdlYnx4eHh8YWVyb3xhc2lhfGNvb3B8aW5mb3xtdXNldW18bmFtZXxzaG9wfNGA0YRcbiAqICAgYXJlIG9rLlxuICogLSBlbmNvZGVkIChgeG4tLS4uLmApIHJvb3Qgem9uZXMgYXJlIG9rLlxuICpcbiAqIElmIGxpc3QgaXMgcmVwbGFjZWQsIHRoZW4gZXhhY3QgbWF0Y2ggZm9yIDItY2hhcnMgcm9vdCB6b25lcyB3aWxsIGJlIGNoZWNrZWQuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRsZHMgPSBmdW5jdGlvbiB0bGRzKGxpc3QsIGtlZXBPbGQpIHtcbiAgbGlzdCA9IEFycmF5LmlzQXJyYXkobGlzdCkgPyBsaXN0IDogWyBsaXN0IF07XG5cbiAgaWYgKCFrZWVwT2xkKSB7XG4gICAgdGhpcy5fX3RsZHNfXyA9IGxpc3Quc2xpY2UoKTtcbiAgICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fID0gdHJ1ZTtcbiAgICBjb21waWxlKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhpcy5fX3RsZHNfXyA9IHRoaXMuX190bGRzX18uY29uY2F0KGxpc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZWwsIGlkeCwgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwgIT09IGFycltpZHggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XG5cbiAgY29tcGlsZSh0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIExpbmtpZnlJdCNub3JtYWxpemUobWF0Y2gpXG4gKlxuICogRGVmYXVsdCBub3JtYWxpemVyIChpZiBzY2hlbWEgZG9lcyBub3QgZGVmaW5lIGl0J3Mgb3duKS5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKG1hdGNoKSB7XG5cbiAgLy8gRG8gbWluaW1hbCBwb3NzaWJsZSBjaGFuZ2VzIGJ5IGRlZmF1bHQuIE5lZWQgdG8gY29sbGVjdCBmZWVkYmFjayBwcmlvclxuICAvLyB0byBtb3ZlIGZvcndhcmQgaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L2xpbmtpZnktaXQvaXNzdWVzLzFcblxuICBpZiAoIW1hdGNoLnNjaGVtYSkgeyBtYXRjaC51cmwgPSAnaHR0cDovLycgKyBtYXRjaC51cmw7IH1cblxuICBpZiAobWF0Y2guc2NoZW1hID09PSAnbWFpbHRvOicgJiYgIS9ebWFpbHRvOi9pLnRlc3QobWF0Y2gudXJsKSkge1xuICAgIG1hdGNoLnVybCA9ICdtYWlsdG86JyArIG1hdGNoLnVybDtcbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtpZnlJdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gVXNlIGRpcmVjdCBleHRyYWN0IGluc3RlYWQgb2YgYHJlZ2VuZXJhdGVgIHRvIHJlZHVzZSBicm93c2VyaWZpZWQgc2l6ZVxudmFyIHNyY19BbnkgPSBleHBvcnRzLnNyY19BbnkgPSByZXF1aXJlKCd1Yy5taWNyby9wcm9wZXJ0aWVzL0FueS9yZWdleCcpLnNvdXJjZTtcbnZhciBzcmNfQ2MgID0gZXhwb3J0cy5zcmNfQ2MgPSByZXF1aXJlKCd1Yy5taWNyby9jYXRlZ29yaWVzL0NjL3JlZ2V4Jykuc291cmNlO1xudmFyIHNyY19DZiAgPSBleHBvcnRzLnNyY19DZiA9IHJlcXVpcmUoJ3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2YvcmVnZXgnKS5zb3VyY2U7XG52YXIgc3JjX1ogICA9IGV4cG9ydHMuc3JjX1ogID0gcmVxdWlyZSgndWMubWljcm8vY2F0ZWdvcmllcy9aL3JlZ2V4Jykuc291cmNlO1xudmFyIHNyY19QICAgPSBleHBvcnRzLnNyY19QICA9IHJlcXVpcmUoJ3VjLm1pY3JvL2NhdGVnb3JpZXMvUC9yZWdleCcpLnNvdXJjZTtcblxuLy8gXFxwe1xcWlxcUFxcQ2NcXENGfSAod2hpdGUgc3BhY2VzICsgY29udHJvbCArIGZvcm1hdCArIHB1bmN0dWF0aW9uKVxudmFyIHNyY19aUENjQ2YgPSBleHBvcnRzLnNyY19aUENjQ2YgPSBbIHNyY19aLCBzcmNfUCwgc3JjX0NjLCBzcmNfQ2YgXS5qb2luKCd8Jyk7XG5cbi8vIEFsbCBwb3NzaWJsZSB3b3JkIGNoYXJhY3RlcnMgKGV2ZXJ5dGhpbmcgd2l0aG91dCBwdW5jdHVhdGlvbiwgc3BhY2VzICYgY29udHJvbHMpXG4vLyBEZWZpbmVkIHZpYSBwdW5jdHVhdGlvbiAmIHNwYWNlcyB0byBzYXZlIHNwYWNlXG4vLyBTaG91bGQgYmUgc29tZXRoaW5nIGxpa2UgXFxwe1xcTFxcTlxcU1xcTX0gKFxcdyBidXQgd2l0aG91dCBgX2ApXG52YXIgc3JjX3BzZXVkb19sZXR0ZXIgICAgICAgPSAnKD86KD8hJyArIHNyY19aUENjQ2YgKyAnKScgKyBzcmNfQW55ICsgJyknO1xuLy8gVGhlIHNhbWUgYXMgYWJvdGhlIGJ1dCB3aXRob3V0IFswLTldXG52YXIgc3JjX3BzZXVkb19sZXR0ZXJfbm9uX2QgPSAnKD86KD8hWzAtOV18JyArIHNyY19aUENjQ2YgKyAnKScgKyBzcmNfQW55ICsgJyknO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgc3JjX2lwNCA9IGV4cG9ydHMuc3JjX2lwNCA9XG5cbiAgJyg/OigyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFxcXC4pezN9KDI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPyknO1xuXG5leHBvcnRzLnNyY19hdXRoICAgID0gJyg/Oig/Oig/IScgKyBzcmNfWiArICcpLikrQCk/JztcblxudmFyIHNyY19wb3J0ID0gZXhwb3J0cy5zcmNfcG9ydCA9XG5cbiAgJyg/OjooPzo2KD86WzAtNF1cXFxcZHszfXw1KD86WzAtNF1cXFxcZHsyfXw1KD86WzAtMl1cXFxcZHwzWzAtNV0pKSl8WzEtNV0/XFxcXGR7MSw0fSkpPyc7XG5cbnZhciBzcmNfaG9zdF90ZXJtaW5hdG9yID0gZXhwb3J0cy5zcmNfaG9zdF90ZXJtaW5hdG9yID1cblxuICAnKD89JHwnICsgc3JjX1pQQ2NDZiArICcpKD8hLXxffDpcXFxcZHxcXFxcLi18XFxcXC4oPyEkfCcgKyBzcmNfWlBDY0NmICsgJykpJztcblxudmFyIHNyY19wYXRoID0gZXhwb3J0cy5zcmNfcGF0aCA9XG5cbiAgJyg/OicgK1xuICAgICdbLz8jXScgK1xuICAgICAgJyg/OicgK1xuICAgICAgICAnKD8hJyArIHNyY19aICsgJ3xbKClbXFxcXF17fS4sXCJcXCc/IVxcXFwtXSkufCcgK1xuICAgICAgICAnXFxcXFsoPzooPyEnICsgc3JjX1ogKyAnfFxcXFxdKS4pKlxcXFxdfCcgK1xuICAgICAgICAnXFxcXCgoPzooPyEnICsgc3JjX1ogKyAnfFspXSkuKSpcXFxcKXwnICtcbiAgICAgICAgJ1xcXFx7KD86KD8hJyArIHNyY19aICsgJ3xbfV0pLikqXFxcXH18JyArXG4gICAgICAgICdcXFxcXCIoPzooPyEnICsgc3JjX1ogKyAnfFtcIl0pLikrXFxcXFwifCcgK1xuICAgICAgICBcIlxcXFwnKD86KD8hXCIgKyBzcmNfWiArIFwifFsnXSkuKStcXFxcJ3xcIiArXG4gICAgICAgIFwiXFxcXCcoPz1cIiArIHNyY19wc2V1ZG9fbGV0dGVyICsgJykufCcgKyAgLy8gYWxsb3cgYEknbV9raW5nYCBpZiBubyBwYWlyIGZvdW5kXG4gICAgICAgICdcXFxcLig/IScgKyBzcmNfWiArICd8Wy5dKS58JyArXG4gICAgICAgICdcXFxcLSg/IScgKyBzcmNfWiArICd8LS0oPzpbXi1dfCQpKSg/OlstXSt8Lil8JyArICAvLyBgLS0tYCA9PiBsb25nIGRhc2gsIHRlcm1pbmF0ZVxuICAgICAgICAnXFxcXCwoPyEnICsgc3JjX1ogKyAnKS58JyArICAgICAgLy8gYWxsb3cgYCwsLGAgaW4gcGF0aHNcbiAgICAgICAgJ1xcXFwhKD8hJyArIHNyY19aICsgJ3xbIV0pLnwnICtcbiAgICAgICAgJ1xcXFw/KD8hJyArIHNyY19aICsgJ3xbP10pLicgK1xuICAgICAgJykrJyArXG4gICAgJ3xcXFxcLycgK1xuICAnKT8nO1xuXG52YXIgc3JjX2VtYWlsX25hbWUgPSBleHBvcnRzLnNyY19lbWFpbF9uYW1lID1cblxuICAnW1xcXFwtOzomPVxcXFwrXFxcXCQsXFxcXFwiXFxcXC5hLXpBLVowLTlfXSsnO1xuXG52YXIgc3JjX3huID0gZXhwb3J0cy5zcmNfeG4gPVxuXG4gICd4bi0tW2EtejAtOVxcXFwtXXsxLDU5fSc7XG5cbi8vIE1vcmUgdG8gcmVhZCBhYm91dCBkb21haW4gbmFtZXNcbi8vIGh0dHA6Ly9zZXJ2ZXJmYXVsdC5jb20vcXVlc3Rpb25zLzYzODI2MC9cblxudmFyIHNyY19kb21haW5fcm9vdCA9IGV4cG9ydHMuc3JjX2RvbWFpbl9yb290ID1cblxuICAvLyBDYW4ndCBoYXZlIGRpZ2l0cyBhbmQgZGFzaGVzXG4gICcoPzonICtcbiAgICBzcmNfeG4gK1xuICAgICd8JyArXG4gICAgc3JjX3BzZXVkb19sZXR0ZXJfbm9uX2QgKyAnezEsNjN9JyArXG4gICcpJztcblxudmFyIHNyY19kb21haW4gPSBleHBvcnRzLnNyY19kb21haW4gPVxuXG4gICcoPzonICtcbiAgICBzcmNfeG4gK1xuICAgICd8JyArXG4gICAgJyg/OicgKyBzcmNfcHNldWRvX2xldHRlciArICcpJyArXG4gICAgJ3wnICtcbiAgICAvLyBkb24ndCBhbGxvdyBgLS1gIGluIGRvbWFpbiBuYW1lcywgYmVjYXVzZTpcbiAgICAvLyAtIHRoYXQgY2FuIGNvbmZsaWN0IHdpdGggbWFya2Rvd24gJm1kYXNoOyAvICZuZGFzaDtcbiAgICAvLyAtIG5vYm9keSB1c2UgdGhvc2UgYW55d2F5XG4gICAgJyg/OicgKyBzcmNfcHNldWRvX2xldHRlciArICcoPzotKD8hLSl8JyArIHNyY19wc2V1ZG9fbGV0dGVyICsgJyl7MCw2MX0nICsgc3JjX3BzZXVkb19sZXR0ZXIgKyAnKScgK1xuICAnKSc7XG5cbnZhciBzcmNfaG9zdCA9IGV4cG9ydHMuc3JjX2hvc3QgPVxuXG4gICcoPzonICtcbiAgICBzcmNfaXA0ICtcbiAgJ3wnICtcbiAgICAnKD86KD86KD86JyArIHNyY19kb21haW4gKyAnKVxcXFwuKSonICsgc3JjX2RvbWFpbl9yb290ICsgJyknICtcbiAgJyknO1xuXG52YXIgdHBsX2hvc3RfZnV6enkgPSBleHBvcnRzLnRwbF9ob3N0X2Z1enp5ID1cblxuICAnKD86JyArXG4gICAgc3JjX2lwNCArXG4gICd8JyArXG4gICAgJyg/Oig/Oig/OicgKyBzcmNfZG9tYWluICsgJylcXFxcLikrKD86JVRMRFMlKSknICtcbiAgJyknO1xuXG5leHBvcnRzLnNyY19ob3N0X3N0cmljdCA9XG5cbiAgc3JjX2hvc3QgKyBzcmNfaG9zdF90ZXJtaW5hdG9yO1xuXG52YXIgdHBsX2hvc3RfZnV6enlfc3RyaWN0ID0gZXhwb3J0cy50cGxfaG9zdF9mdXp6eV9zdHJpY3QgPVxuXG4gIHRwbF9ob3N0X2Z1enp5ICsgc3JjX2hvc3RfdGVybWluYXRvcjtcblxuZXhwb3J0cy5zcmNfaG9zdF9wb3J0X3N0cmljdCA9XG5cbiAgc3JjX2hvc3QgKyBzcmNfcG9ydCArIHNyY19ob3N0X3Rlcm1pbmF0b3I7XG5cbnZhciB0cGxfaG9zdF9wb3J0X2Z1enp5X3N0cmljdCA9IGV4cG9ydHMudHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgPVxuXG4gIHRwbF9ob3N0X2Z1enp5ICsgc3JjX3BvcnQgKyBzcmNfaG9zdF90ZXJtaW5hdG9yO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTWFpbiBydWxlc1xuXG4vLyBSdWRlIHRlc3QgZnV6enkgbGlua3MgYnkgaG9zdCwgZm9yIHF1aWNrIGRlbnlcbmV4cG9ydHMudHBsX2hvc3RfZnV6enlfdGVzdCA9XG5cbiAgJ2xvY2FsaG9zdHxcXFxcLlxcXFxkezEsM31cXFxcLnwoPzpcXFxcLig/OiVUTERTJSkoPzonICsgc3JjX1pQQ2NDZiArICd8JCkpJztcblxuZXhwb3J0cy50cGxfZW1haWxfZnV6enkgPVxuXG4gICAgJyhefD58JyArIHNyY19aICsgJykoJyArIHNyY19lbWFpbF9uYW1lICsgJ0AnICsgdHBsX2hvc3RfZnV6enlfc3RyaWN0ICsgJyknO1xuXG5leHBvcnRzLnRwbF9saW5rX2Z1enp5ID1cbiAgICAvLyBGdXp6eSBsaW5rIGNhbid0IGJlIHByZXBlbmRlZCB3aXRoIC46L1xcLSBhbmQgbm9uIHB1bmN0dWF0aW9uLlxuICAgIC8vIGJ1dCBjYW4gc3RhcnQgd2l0aCA+IChtYXJrZG93biBibG9ja3F1b3RlKVxuICAgICcoXnwoPyFbLjovXFxcXC1fQF0pKD86WyQrPD0+XmB8XXwnICsgc3JjX1pQQ2NDZiArICcpKScgK1xuICAgICcoKD8hWyQrPD0+XmB8XSknICsgdHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgKyBzcmNfcGF0aCArICcpJztcbiIsIm1vZHVsZS5leHBvcnRzPS9bXFwwLVxceDFGXFx4N0YtXFx4OUZdLyIsIm1vZHVsZS5leHBvcnRzPS9bXFx4QURcXHUwNjAwLVxcdTA2MDVcXHUwNjFDXFx1MDZERFxcdTA3MEZcXHUxODBFXFx1MjAwQi1cXHUyMDBGXFx1MjAyQS1cXHUyMDJFXFx1MjA2MC1cXHUyMDY0XFx1MjA2Ni1cXHUyMDZGXFx1RkVGRlxcdUZGRjktXFx1RkZGQl18XFx1RDgwNFxcdURDQkR8XFx1RDgyRltcXHVEQ0EwLVxcdURDQTNdfFxcdUQ4MzRbXFx1REQ3My1cXHVERDdBXXxcXHVEQjQwW1xcdURDMDFcXHVEQzIwLVxcdURDN0ZdLyIsIm1vZHVsZS5leHBvcnRzPS9bIS0jJS1cXCosLS86O1xcP0BcXFstXFxdX1xce1xcfVxceEExXFx4QTdcXHhBQlxceEI2XFx4QjdcXHhCQlxceEJGXFx1MDM3RVxcdTAzODdcXHUwNTVBLVxcdTA1NUZcXHUwNTg5XFx1MDU4QVxcdTA1QkVcXHUwNUMwXFx1MDVDM1xcdTA1QzZcXHUwNUYzXFx1MDVGNFxcdTA2MDlcXHUwNjBBXFx1MDYwQ1xcdTA2MERcXHUwNjFCXFx1MDYxRVxcdTA2MUZcXHUwNjZBLVxcdTA2NkRcXHUwNkQ0XFx1MDcwMC1cXHUwNzBEXFx1MDdGNy1cXHUwN0Y5XFx1MDgzMC1cXHUwODNFXFx1MDg1RVxcdTA5NjRcXHUwOTY1XFx1MDk3MFxcdTBBRjBcXHUwREY0XFx1MEU0RlxcdTBFNUFcXHUwRTVCXFx1MEYwNC1cXHUwRjEyXFx1MEYxNFxcdTBGM0EtXFx1MEYzRFxcdTBGODVcXHUwRkQwLVxcdTBGRDRcXHUwRkQ5XFx1MEZEQVxcdTEwNEEtXFx1MTA0RlxcdTEwRkJcXHUxMzYwLVxcdTEzNjhcXHUxNDAwXFx1MTY2RFxcdTE2NkVcXHUxNjlCXFx1MTY5Q1xcdTE2RUItXFx1MTZFRFxcdTE3MzVcXHUxNzM2XFx1MTdENC1cXHUxN0Q2XFx1MTdEOC1cXHUxN0RBXFx1MTgwMC1cXHUxODBBXFx1MTk0NFxcdTE5NDVcXHUxQTFFXFx1MUExRlxcdTFBQTAtXFx1MUFBNlxcdTFBQTgtXFx1MUFBRFxcdTFCNUEtXFx1MUI2MFxcdTFCRkMtXFx1MUJGRlxcdTFDM0ItXFx1MUMzRlxcdTFDN0VcXHUxQzdGXFx1MUNDMC1cXHUxQ0M3XFx1MUNEM1xcdTIwMTAtXFx1MjAyN1xcdTIwMzAtXFx1MjA0M1xcdTIwNDUtXFx1MjA1MVxcdTIwNTMtXFx1MjA1RVxcdTIwN0RcXHUyMDdFXFx1MjA4RFxcdTIwOEVcXHUyMzA4LVxcdTIzMEJcXHUyMzI5XFx1MjMyQVxcdTI3NjgtXFx1Mjc3NVxcdTI3QzVcXHUyN0M2XFx1MjdFNi1cXHUyN0VGXFx1Mjk4My1cXHUyOTk4XFx1MjlEOC1cXHUyOURCXFx1MjlGQ1xcdTI5RkRcXHUyQ0Y5LVxcdTJDRkNcXHUyQ0ZFXFx1MkNGRlxcdTJENzBcXHUyRTAwLVxcdTJFMkVcXHUyRTMwLVxcdTJFNDJcXHUzMDAxLVxcdTMwMDNcXHUzMDA4LVxcdTMwMTFcXHUzMDE0LVxcdTMwMUZcXHUzMDMwXFx1MzAzRFxcdTMwQTBcXHUzMEZCXFx1QTRGRVxcdUE0RkZcXHVBNjBELVxcdUE2MEZcXHVBNjczXFx1QTY3RVxcdUE2RjItXFx1QTZGN1xcdUE4NzQtXFx1QTg3N1xcdUE4Q0VcXHVBOENGXFx1QThGOC1cXHVBOEZBXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM4XFx1RERDRFxcdURFMzgtXFx1REUzRF18XFx1RDgwNVtcXHVEQ0M2XFx1RERDMS1cXHVEREM5XFx1REU0MS1cXHVERTQzXXxcXHVEODA5W1xcdURDNzAtXFx1REM3NF18XFx1RDgxQVtcXHVERTZFXFx1REU2RlxcdURFRjVcXHVERjM3LVxcdURGM0JcXHVERjQ0XXxcXHVEODJGXFx1REM5Ri8iLCJtb2R1bGUuZXhwb3J0cz0vWyBcXHhBMFxcdTE2ODBcXHUyMDAwLVxcdTIwMEFcXHUyMDI4XFx1MjAyOVxcdTIwMkZcXHUyMDVGXFx1MzAwMF0vIiwibW9kdWxlLmV4cG9ydHM9L1tcXDAtXFx1RDdGRlxcdURDMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXS8iLCIndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi8nKTtcbiIsIi8vIExpc3Qgb2YgdmFsaWQgZW50aXRpZXNcbi8vXG4vLyBHZW5lcmF0ZSB3aXRoIC4vc3VwcG9ydC9lbnRpdGllcy5qcyBzY3JpcHRcbi8vXG4ndXNlIHN0cmljdCc7XG5cbi8qZXNsaW50IHF1b3RlczowKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBcIkFhY3V0ZVwiOlwiXFx1MDBDMVwiLFxuICBcImFhY3V0ZVwiOlwiXFx1MDBFMVwiLFxuICBcIkFicmV2ZVwiOlwiXFx1MDEwMlwiLFxuICBcImFicmV2ZVwiOlwiXFx1MDEwM1wiLFxuICBcImFjXCI6XCJcXHUyMjNFXCIsXG4gIFwiYWNkXCI6XCJcXHUyMjNGXCIsXG4gIFwiYWNFXCI6XCJcXHUyMjNFXFx1MDMzM1wiLFxuICBcIkFjaXJjXCI6XCJcXHUwMEMyXCIsXG4gIFwiYWNpcmNcIjpcIlxcdTAwRTJcIixcbiAgXCJhY3V0ZVwiOlwiXFx1MDBCNFwiLFxuICBcIkFjeVwiOlwiXFx1MDQxMFwiLFxuICBcImFjeVwiOlwiXFx1MDQzMFwiLFxuICBcIkFFbGlnXCI6XCJcXHUwMEM2XCIsXG4gIFwiYWVsaWdcIjpcIlxcdTAwRTZcIixcbiAgXCJhZlwiOlwiXFx1MjA2MVwiLFxuICBcIkFmclwiOlwiXFx1RDgzNVxcdUREMDRcIixcbiAgXCJhZnJcIjpcIlxcdUQ4MzVcXHVERDFFXCIsXG4gIFwiQWdyYXZlXCI6XCJcXHUwMEMwXCIsXG4gIFwiYWdyYXZlXCI6XCJcXHUwMEUwXCIsXG4gIFwiYWxlZnN5bVwiOlwiXFx1MjEzNVwiLFxuICBcImFsZXBoXCI6XCJcXHUyMTM1XCIsXG4gIFwiQWxwaGFcIjpcIlxcdTAzOTFcIixcbiAgXCJhbHBoYVwiOlwiXFx1MDNCMVwiLFxuICBcIkFtYWNyXCI6XCJcXHUwMTAwXCIsXG4gIFwiYW1hY3JcIjpcIlxcdTAxMDFcIixcbiAgXCJhbWFsZ1wiOlwiXFx1MkEzRlwiLFxuICBcIkFNUFwiOlwiXFx1MDAyNlwiLFxuICBcImFtcFwiOlwiXFx1MDAyNlwiLFxuICBcIkFuZFwiOlwiXFx1MkE1M1wiLFxuICBcImFuZFwiOlwiXFx1MjIyN1wiLFxuICBcImFuZGFuZFwiOlwiXFx1MkE1NVwiLFxuICBcImFuZGRcIjpcIlxcdTJBNUNcIixcbiAgXCJhbmRzbG9wZVwiOlwiXFx1MkE1OFwiLFxuICBcImFuZHZcIjpcIlxcdTJBNUFcIixcbiAgXCJhbmdcIjpcIlxcdTIyMjBcIixcbiAgXCJhbmdlXCI6XCJcXHUyOUE0XCIsXG4gIFwiYW5nbGVcIjpcIlxcdTIyMjBcIixcbiAgXCJhbmdtc2RcIjpcIlxcdTIyMjFcIixcbiAgXCJhbmdtc2RhYVwiOlwiXFx1MjlBOFwiLFxuICBcImFuZ21zZGFiXCI6XCJcXHUyOUE5XCIsXG4gIFwiYW5nbXNkYWNcIjpcIlxcdTI5QUFcIixcbiAgXCJhbmdtc2RhZFwiOlwiXFx1MjlBQlwiLFxuICBcImFuZ21zZGFlXCI6XCJcXHUyOUFDXCIsXG4gIFwiYW5nbXNkYWZcIjpcIlxcdTI5QURcIixcbiAgXCJhbmdtc2RhZ1wiOlwiXFx1MjlBRVwiLFxuICBcImFuZ21zZGFoXCI6XCJcXHUyOUFGXCIsXG4gIFwiYW5ncnRcIjpcIlxcdTIyMUZcIixcbiAgXCJhbmdydHZiXCI6XCJcXHUyMkJFXCIsXG4gIFwiYW5ncnR2YmRcIjpcIlxcdTI5OURcIixcbiAgXCJhbmdzcGhcIjpcIlxcdTIyMjJcIixcbiAgXCJhbmdzdFwiOlwiXFx1MDBDNVwiLFxuICBcImFuZ3phcnJcIjpcIlxcdTIzN0NcIixcbiAgXCJBb2dvblwiOlwiXFx1MDEwNFwiLFxuICBcImFvZ29uXCI6XCJcXHUwMTA1XCIsXG4gIFwiQW9wZlwiOlwiXFx1RDgzNVxcdUREMzhcIixcbiAgXCJhb3BmXCI6XCJcXHVEODM1XFx1REQ1MlwiLFxuICBcImFwXCI6XCJcXHUyMjQ4XCIsXG4gIFwiYXBhY2lyXCI6XCJcXHUyQTZGXCIsXG4gIFwiYXBFXCI6XCJcXHUyQTcwXCIsXG4gIFwiYXBlXCI6XCJcXHUyMjRBXCIsXG4gIFwiYXBpZFwiOlwiXFx1MjI0QlwiLFxuICBcImFwb3NcIjpcIlxcdTAwMjdcIixcbiAgXCJBcHBseUZ1bmN0aW9uXCI6XCJcXHUyMDYxXCIsXG4gIFwiYXBwcm94XCI6XCJcXHUyMjQ4XCIsXG4gIFwiYXBwcm94ZXFcIjpcIlxcdTIyNEFcIixcbiAgXCJBcmluZ1wiOlwiXFx1MDBDNVwiLFxuICBcImFyaW5nXCI6XCJcXHUwMEU1XCIsXG4gIFwiQXNjclwiOlwiXFx1RDgzNVxcdURDOUNcIixcbiAgXCJhc2NyXCI6XCJcXHVEODM1XFx1RENCNlwiLFxuICBcIkFzc2lnblwiOlwiXFx1MjI1NFwiLFxuICBcImFzdFwiOlwiXFx1MDAyQVwiLFxuICBcImFzeW1wXCI6XCJcXHUyMjQ4XCIsXG4gIFwiYXN5bXBlcVwiOlwiXFx1MjI0RFwiLFxuICBcIkF0aWxkZVwiOlwiXFx1MDBDM1wiLFxuICBcImF0aWxkZVwiOlwiXFx1MDBFM1wiLFxuICBcIkF1bWxcIjpcIlxcdTAwQzRcIixcbiAgXCJhdW1sXCI6XCJcXHUwMEU0XCIsXG4gIFwiYXdjb25pbnRcIjpcIlxcdTIyMzNcIixcbiAgXCJhd2ludFwiOlwiXFx1MkExMVwiLFxuICBcImJhY2tjb25nXCI6XCJcXHUyMjRDXCIsXG4gIFwiYmFja2Vwc2lsb25cIjpcIlxcdTAzRjZcIixcbiAgXCJiYWNrcHJpbWVcIjpcIlxcdTIwMzVcIixcbiAgXCJiYWNrc2ltXCI6XCJcXHUyMjNEXCIsXG4gIFwiYmFja3NpbWVxXCI6XCJcXHUyMkNEXCIsXG4gIFwiQmFja3NsYXNoXCI6XCJcXHUyMjE2XCIsXG4gIFwiQmFydlwiOlwiXFx1MkFFN1wiLFxuICBcImJhcnZlZVwiOlwiXFx1MjJCRFwiLFxuICBcIkJhcndlZFwiOlwiXFx1MjMwNlwiLFxuICBcImJhcndlZFwiOlwiXFx1MjMwNVwiLFxuICBcImJhcndlZGdlXCI6XCJcXHUyMzA1XCIsXG4gIFwiYmJya1wiOlwiXFx1MjNCNVwiLFxuICBcImJicmt0YnJrXCI6XCJcXHUyM0I2XCIsXG4gIFwiYmNvbmdcIjpcIlxcdTIyNENcIixcbiAgXCJCY3lcIjpcIlxcdTA0MTFcIixcbiAgXCJiY3lcIjpcIlxcdTA0MzFcIixcbiAgXCJiZHF1b1wiOlwiXFx1MjAxRVwiLFxuICBcImJlY2F1c1wiOlwiXFx1MjIzNVwiLFxuICBcIkJlY2F1c2VcIjpcIlxcdTIyMzVcIixcbiAgXCJiZWNhdXNlXCI6XCJcXHUyMjM1XCIsXG4gIFwiYmVtcHR5dlwiOlwiXFx1MjlCMFwiLFxuICBcImJlcHNpXCI6XCJcXHUwM0Y2XCIsXG4gIFwiYmVybm91XCI6XCJcXHUyMTJDXCIsXG4gIFwiQmVybm91bGxpc1wiOlwiXFx1MjEyQ1wiLFxuICBcIkJldGFcIjpcIlxcdTAzOTJcIixcbiAgXCJiZXRhXCI6XCJcXHUwM0IyXCIsXG4gIFwiYmV0aFwiOlwiXFx1MjEzNlwiLFxuICBcImJldHdlZW5cIjpcIlxcdTIyNkNcIixcbiAgXCJCZnJcIjpcIlxcdUQ4MzVcXHVERDA1XCIsXG4gIFwiYmZyXCI6XCJcXHVEODM1XFx1REQxRlwiLFxuICBcImJpZ2NhcFwiOlwiXFx1MjJDMlwiLFxuICBcImJpZ2NpcmNcIjpcIlxcdTI1RUZcIixcbiAgXCJiaWdjdXBcIjpcIlxcdTIyQzNcIixcbiAgXCJiaWdvZG90XCI6XCJcXHUyQTAwXCIsXG4gIFwiYmlnb3BsdXNcIjpcIlxcdTJBMDFcIixcbiAgXCJiaWdvdGltZXNcIjpcIlxcdTJBMDJcIixcbiAgXCJiaWdzcWN1cFwiOlwiXFx1MkEwNlwiLFxuICBcImJpZ3N0YXJcIjpcIlxcdTI2MDVcIixcbiAgXCJiaWd0cmlhbmdsZWRvd25cIjpcIlxcdTI1QkRcIixcbiAgXCJiaWd0cmlhbmdsZXVwXCI6XCJcXHUyNUIzXCIsXG4gIFwiYmlndXBsdXNcIjpcIlxcdTJBMDRcIixcbiAgXCJiaWd2ZWVcIjpcIlxcdTIyQzFcIixcbiAgXCJiaWd3ZWRnZVwiOlwiXFx1MjJDMFwiLFxuICBcImJrYXJvd1wiOlwiXFx1MjkwRFwiLFxuICBcImJsYWNrbG96ZW5nZVwiOlwiXFx1MjlFQlwiLFxuICBcImJsYWNrc3F1YXJlXCI6XCJcXHUyNUFBXCIsXG4gIFwiYmxhY2t0cmlhbmdsZVwiOlwiXFx1MjVCNFwiLFxuICBcImJsYWNrdHJpYW5nbGVkb3duXCI6XCJcXHUyNUJFXCIsXG4gIFwiYmxhY2t0cmlhbmdsZWxlZnRcIjpcIlxcdTI1QzJcIixcbiAgXCJibGFja3RyaWFuZ2xlcmlnaHRcIjpcIlxcdTI1QjhcIixcbiAgXCJibGFua1wiOlwiXFx1MjQyM1wiLFxuICBcImJsazEyXCI6XCJcXHUyNTkyXCIsXG4gIFwiYmxrMTRcIjpcIlxcdTI1OTFcIixcbiAgXCJibGszNFwiOlwiXFx1MjU5M1wiLFxuICBcImJsb2NrXCI6XCJcXHUyNTg4XCIsXG4gIFwiYm5lXCI6XCJcXHUwMDNEXFx1MjBFNVwiLFxuICBcImJuZXF1aXZcIjpcIlxcdTIyNjFcXHUyMEU1XCIsXG4gIFwiYk5vdFwiOlwiXFx1MkFFRFwiLFxuICBcImJub3RcIjpcIlxcdTIzMTBcIixcbiAgXCJCb3BmXCI6XCJcXHVEODM1XFx1REQzOVwiLFxuICBcImJvcGZcIjpcIlxcdUQ4MzVcXHVERDUzXCIsXG4gIFwiYm90XCI6XCJcXHUyMkE1XCIsXG4gIFwiYm90dG9tXCI6XCJcXHUyMkE1XCIsXG4gIFwiYm93dGllXCI6XCJcXHUyMkM4XCIsXG4gIFwiYm94Ym94XCI6XCJcXHUyOUM5XCIsXG4gIFwiYm94RExcIjpcIlxcdTI1NTdcIixcbiAgXCJib3hEbFwiOlwiXFx1MjU1NlwiLFxuICBcImJveGRMXCI6XCJcXHUyNTU1XCIsXG4gIFwiYm94ZGxcIjpcIlxcdTI1MTBcIixcbiAgXCJib3hEUlwiOlwiXFx1MjU1NFwiLFxuICBcImJveERyXCI6XCJcXHUyNTUzXCIsXG4gIFwiYm94ZFJcIjpcIlxcdTI1NTJcIixcbiAgXCJib3hkclwiOlwiXFx1MjUwQ1wiLFxuICBcImJveEhcIjpcIlxcdTI1NTBcIixcbiAgXCJib3hoXCI6XCJcXHUyNTAwXCIsXG4gIFwiYm94SERcIjpcIlxcdTI1NjZcIixcbiAgXCJib3hIZFwiOlwiXFx1MjU2NFwiLFxuICBcImJveGhEXCI6XCJcXHUyNTY1XCIsXG4gIFwiYm94aGRcIjpcIlxcdTI1MkNcIixcbiAgXCJib3hIVVwiOlwiXFx1MjU2OVwiLFxuICBcImJveEh1XCI6XCJcXHUyNTY3XCIsXG4gIFwiYm94aFVcIjpcIlxcdTI1NjhcIixcbiAgXCJib3hodVwiOlwiXFx1MjUzNFwiLFxuICBcImJveG1pbnVzXCI6XCJcXHUyMjlGXCIsXG4gIFwiYm94cGx1c1wiOlwiXFx1MjI5RVwiLFxuICBcImJveHRpbWVzXCI6XCJcXHUyMkEwXCIsXG4gIFwiYm94VUxcIjpcIlxcdTI1NURcIixcbiAgXCJib3hVbFwiOlwiXFx1MjU1Q1wiLFxuICBcImJveHVMXCI6XCJcXHUyNTVCXCIsXG4gIFwiYm94dWxcIjpcIlxcdTI1MThcIixcbiAgXCJib3hVUlwiOlwiXFx1MjU1QVwiLFxuICBcImJveFVyXCI6XCJcXHUyNTU5XCIsXG4gIFwiYm94dVJcIjpcIlxcdTI1NThcIixcbiAgXCJib3h1clwiOlwiXFx1MjUxNFwiLFxuICBcImJveFZcIjpcIlxcdTI1NTFcIixcbiAgXCJib3h2XCI6XCJcXHUyNTAyXCIsXG4gIFwiYm94VkhcIjpcIlxcdTI1NkNcIixcbiAgXCJib3hWaFwiOlwiXFx1MjU2QlwiLFxuICBcImJveHZIXCI6XCJcXHUyNTZBXCIsXG4gIFwiYm94dmhcIjpcIlxcdTI1M0NcIixcbiAgXCJib3hWTFwiOlwiXFx1MjU2M1wiLFxuICBcImJveFZsXCI6XCJcXHUyNTYyXCIsXG4gIFwiYm94dkxcIjpcIlxcdTI1NjFcIixcbiAgXCJib3h2bFwiOlwiXFx1MjUyNFwiLFxuICBcImJveFZSXCI6XCJcXHUyNTYwXCIsXG4gIFwiYm94VnJcIjpcIlxcdTI1NUZcIixcbiAgXCJib3h2UlwiOlwiXFx1MjU1RVwiLFxuICBcImJveHZyXCI6XCJcXHUyNTFDXCIsXG4gIFwiYnByaW1lXCI6XCJcXHUyMDM1XCIsXG4gIFwiQnJldmVcIjpcIlxcdTAyRDhcIixcbiAgXCJicmV2ZVwiOlwiXFx1MDJEOFwiLFxuICBcImJydmJhclwiOlwiXFx1MDBBNlwiLFxuICBcIkJzY3JcIjpcIlxcdTIxMkNcIixcbiAgXCJic2NyXCI6XCJcXHVEODM1XFx1RENCN1wiLFxuICBcImJzZW1pXCI6XCJcXHUyMDRGXCIsXG4gIFwiYnNpbVwiOlwiXFx1MjIzRFwiLFxuICBcImJzaW1lXCI6XCJcXHUyMkNEXCIsXG4gIFwiYnNvbFwiOlwiXFx1MDA1Q1wiLFxuICBcImJzb2xiXCI6XCJcXHUyOUM1XCIsXG4gIFwiYnNvbGhzdWJcIjpcIlxcdTI3QzhcIixcbiAgXCJidWxsXCI6XCJcXHUyMDIyXCIsXG4gIFwiYnVsbGV0XCI6XCJcXHUyMDIyXCIsXG4gIFwiYnVtcFwiOlwiXFx1MjI0RVwiLFxuICBcImJ1bXBFXCI6XCJcXHUyQUFFXCIsXG4gIFwiYnVtcGVcIjpcIlxcdTIyNEZcIixcbiAgXCJCdW1wZXFcIjpcIlxcdTIyNEVcIixcbiAgXCJidW1wZXFcIjpcIlxcdTIyNEZcIixcbiAgXCJDYWN1dGVcIjpcIlxcdTAxMDZcIixcbiAgXCJjYWN1dGVcIjpcIlxcdTAxMDdcIixcbiAgXCJDYXBcIjpcIlxcdTIyRDJcIixcbiAgXCJjYXBcIjpcIlxcdTIyMjlcIixcbiAgXCJjYXBhbmRcIjpcIlxcdTJBNDRcIixcbiAgXCJjYXBicmN1cFwiOlwiXFx1MkE0OVwiLFxuICBcImNhcGNhcFwiOlwiXFx1MkE0QlwiLFxuICBcImNhcGN1cFwiOlwiXFx1MkE0N1wiLFxuICBcImNhcGRvdFwiOlwiXFx1MkE0MFwiLFxuICBcIkNhcGl0YWxEaWZmZXJlbnRpYWxEXCI6XCJcXHUyMTQ1XCIsXG4gIFwiY2Fwc1wiOlwiXFx1MjIyOVxcdUZFMDBcIixcbiAgXCJjYXJldFwiOlwiXFx1MjA0MVwiLFxuICBcImNhcm9uXCI6XCJcXHUwMkM3XCIsXG4gIFwiQ2F5bGV5c1wiOlwiXFx1MjEyRFwiLFxuICBcImNjYXBzXCI6XCJcXHUyQTREXCIsXG4gIFwiQ2Nhcm9uXCI6XCJcXHUwMTBDXCIsXG4gIFwiY2Nhcm9uXCI6XCJcXHUwMTBEXCIsXG4gIFwiQ2NlZGlsXCI6XCJcXHUwMEM3XCIsXG4gIFwiY2NlZGlsXCI6XCJcXHUwMEU3XCIsXG4gIFwiQ2NpcmNcIjpcIlxcdTAxMDhcIixcbiAgXCJjY2lyY1wiOlwiXFx1MDEwOVwiLFxuICBcIkNjb25pbnRcIjpcIlxcdTIyMzBcIixcbiAgXCJjY3Vwc1wiOlwiXFx1MkE0Q1wiLFxuICBcImNjdXBzc21cIjpcIlxcdTJBNTBcIixcbiAgXCJDZG90XCI6XCJcXHUwMTBBXCIsXG4gIFwiY2RvdFwiOlwiXFx1MDEwQlwiLFxuICBcImNlZGlsXCI6XCJcXHUwMEI4XCIsXG4gIFwiQ2VkaWxsYVwiOlwiXFx1MDBCOFwiLFxuICBcImNlbXB0eXZcIjpcIlxcdTI5QjJcIixcbiAgXCJjZW50XCI6XCJcXHUwMEEyXCIsXG4gIFwiQ2VudGVyRG90XCI6XCJcXHUwMEI3XCIsXG4gIFwiY2VudGVyZG90XCI6XCJcXHUwMEI3XCIsXG4gIFwiQ2ZyXCI6XCJcXHUyMTJEXCIsXG4gIFwiY2ZyXCI6XCJcXHVEODM1XFx1REQyMFwiLFxuICBcIkNIY3lcIjpcIlxcdTA0MjdcIixcbiAgXCJjaGN5XCI6XCJcXHUwNDQ3XCIsXG4gIFwiY2hlY2tcIjpcIlxcdTI3MTNcIixcbiAgXCJjaGVja21hcmtcIjpcIlxcdTI3MTNcIixcbiAgXCJDaGlcIjpcIlxcdTAzQTdcIixcbiAgXCJjaGlcIjpcIlxcdTAzQzdcIixcbiAgXCJjaXJcIjpcIlxcdTI1Q0JcIixcbiAgXCJjaXJjXCI6XCJcXHUwMkM2XCIsXG4gIFwiY2lyY2VxXCI6XCJcXHUyMjU3XCIsXG4gIFwiY2lyY2xlYXJyb3dsZWZ0XCI6XCJcXHUyMUJBXCIsXG4gIFwiY2lyY2xlYXJyb3dyaWdodFwiOlwiXFx1MjFCQlwiLFxuICBcImNpcmNsZWRhc3RcIjpcIlxcdTIyOUJcIixcbiAgXCJjaXJjbGVkY2lyY1wiOlwiXFx1MjI5QVwiLFxuICBcImNpcmNsZWRkYXNoXCI6XCJcXHUyMjlEXCIsXG4gIFwiQ2lyY2xlRG90XCI6XCJcXHUyMjk5XCIsXG4gIFwiY2lyY2xlZFJcIjpcIlxcdTAwQUVcIixcbiAgXCJjaXJjbGVkU1wiOlwiXFx1MjRDOFwiLFxuICBcIkNpcmNsZU1pbnVzXCI6XCJcXHUyMjk2XCIsXG4gIFwiQ2lyY2xlUGx1c1wiOlwiXFx1MjI5NVwiLFxuICBcIkNpcmNsZVRpbWVzXCI6XCJcXHUyMjk3XCIsXG4gIFwiY2lyRVwiOlwiXFx1MjlDM1wiLFxuICBcImNpcmVcIjpcIlxcdTIyNTdcIixcbiAgXCJjaXJmbmludFwiOlwiXFx1MkExMFwiLFxuICBcImNpcm1pZFwiOlwiXFx1MkFFRlwiLFxuICBcImNpcnNjaXJcIjpcIlxcdTI5QzJcIixcbiAgXCJDbG9ja3dpc2VDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMzJcIixcbiAgXCJDbG9zZUN1cmx5RG91YmxlUXVvdGVcIjpcIlxcdTIwMURcIixcbiAgXCJDbG9zZUN1cmx5UXVvdGVcIjpcIlxcdTIwMTlcIixcbiAgXCJjbHVic1wiOlwiXFx1MjY2M1wiLFxuICBcImNsdWJzdWl0XCI6XCJcXHUyNjYzXCIsXG4gIFwiQ29sb25cIjpcIlxcdTIyMzdcIixcbiAgXCJjb2xvblwiOlwiXFx1MDAzQVwiLFxuICBcIkNvbG9uZVwiOlwiXFx1MkE3NFwiLFxuICBcImNvbG9uZVwiOlwiXFx1MjI1NFwiLFxuICBcImNvbG9uZXFcIjpcIlxcdTIyNTRcIixcbiAgXCJjb21tYVwiOlwiXFx1MDAyQ1wiLFxuICBcImNvbW1hdFwiOlwiXFx1MDA0MFwiLFxuICBcImNvbXBcIjpcIlxcdTIyMDFcIixcbiAgXCJjb21wZm5cIjpcIlxcdTIyMThcIixcbiAgXCJjb21wbGVtZW50XCI6XCJcXHUyMjAxXCIsXG4gIFwiY29tcGxleGVzXCI6XCJcXHUyMTAyXCIsXG4gIFwiY29uZ1wiOlwiXFx1MjI0NVwiLFxuICBcImNvbmdkb3RcIjpcIlxcdTJBNkRcIixcbiAgXCJDb25ncnVlbnRcIjpcIlxcdTIyNjFcIixcbiAgXCJDb25pbnRcIjpcIlxcdTIyMkZcIixcbiAgXCJjb25pbnRcIjpcIlxcdTIyMkVcIixcbiAgXCJDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMkVcIixcbiAgXCJDb3BmXCI6XCJcXHUyMTAyXCIsXG4gIFwiY29wZlwiOlwiXFx1RDgzNVxcdURENTRcIixcbiAgXCJjb3Byb2RcIjpcIlxcdTIyMTBcIixcbiAgXCJDb3Byb2R1Y3RcIjpcIlxcdTIyMTBcIixcbiAgXCJDT1BZXCI6XCJcXHUwMEE5XCIsXG4gIFwiY29weVwiOlwiXFx1MDBBOVwiLFxuICBcImNvcHlzclwiOlwiXFx1MjExN1wiLFxuICBcIkNvdW50ZXJDbG9ja3dpc2VDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMzNcIixcbiAgXCJjcmFyclwiOlwiXFx1MjFCNVwiLFxuICBcIkNyb3NzXCI6XCJcXHUyQTJGXCIsXG4gIFwiY3Jvc3NcIjpcIlxcdTI3MTdcIixcbiAgXCJDc2NyXCI6XCJcXHVEODM1XFx1REM5RVwiLFxuICBcImNzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I4XCIsXG4gIFwiY3N1YlwiOlwiXFx1MkFDRlwiLFxuICBcImNzdWJlXCI6XCJcXHUyQUQxXCIsXG4gIFwiY3N1cFwiOlwiXFx1MkFEMFwiLFxuICBcImNzdXBlXCI6XCJcXHUyQUQyXCIsXG4gIFwiY3Rkb3RcIjpcIlxcdTIyRUZcIixcbiAgXCJjdWRhcnJsXCI6XCJcXHUyOTM4XCIsXG4gIFwiY3VkYXJyclwiOlwiXFx1MjkzNVwiLFxuICBcImN1ZXByXCI6XCJcXHUyMkRFXCIsXG4gIFwiY3Vlc2NcIjpcIlxcdTIyREZcIixcbiAgXCJjdWxhcnJcIjpcIlxcdTIxQjZcIixcbiAgXCJjdWxhcnJwXCI6XCJcXHUyOTNEXCIsXG4gIFwiQ3VwXCI6XCJcXHUyMkQzXCIsXG4gIFwiY3VwXCI6XCJcXHUyMjJBXCIsXG4gIFwiY3VwYnJjYXBcIjpcIlxcdTJBNDhcIixcbiAgXCJDdXBDYXBcIjpcIlxcdTIyNERcIixcbiAgXCJjdXBjYXBcIjpcIlxcdTJBNDZcIixcbiAgXCJjdXBjdXBcIjpcIlxcdTJBNEFcIixcbiAgXCJjdXBkb3RcIjpcIlxcdTIyOERcIixcbiAgXCJjdXBvclwiOlwiXFx1MkE0NVwiLFxuICBcImN1cHNcIjpcIlxcdTIyMkFcXHVGRTAwXCIsXG4gIFwiY3VyYXJyXCI6XCJcXHUyMUI3XCIsXG4gIFwiY3VyYXJybVwiOlwiXFx1MjkzQ1wiLFxuICBcImN1cmx5ZXFwcmVjXCI6XCJcXHUyMkRFXCIsXG4gIFwiY3VybHllcXN1Y2NcIjpcIlxcdTIyREZcIixcbiAgXCJjdXJseXZlZVwiOlwiXFx1MjJDRVwiLFxuICBcImN1cmx5d2VkZ2VcIjpcIlxcdTIyQ0ZcIixcbiAgXCJjdXJyZW5cIjpcIlxcdTAwQTRcIixcbiAgXCJjdXJ2ZWFycm93bGVmdFwiOlwiXFx1MjFCNlwiLFxuICBcImN1cnZlYXJyb3dyaWdodFwiOlwiXFx1MjFCN1wiLFxuICBcImN1dmVlXCI6XCJcXHUyMkNFXCIsXG4gIFwiY3V3ZWRcIjpcIlxcdTIyQ0ZcIixcbiAgXCJjd2NvbmludFwiOlwiXFx1MjIzMlwiLFxuICBcImN3aW50XCI6XCJcXHUyMjMxXCIsXG4gIFwiY3lsY3R5XCI6XCJcXHUyMzJEXCIsXG4gIFwiRGFnZ2VyXCI6XCJcXHUyMDIxXCIsXG4gIFwiZGFnZ2VyXCI6XCJcXHUyMDIwXCIsXG4gIFwiZGFsZXRoXCI6XCJcXHUyMTM4XCIsXG4gIFwiRGFyclwiOlwiXFx1MjFBMVwiLFxuICBcImRBcnJcIjpcIlxcdTIxRDNcIixcbiAgXCJkYXJyXCI6XCJcXHUyMTkzXCIsXG4gIFwiZGFzaFwiOlwiXFx1MjAxMFwiLFxuICBcIkRhc2h2XCI6XCJcXHUyQUU0XCIsXG4gIFwiZGFzaHZcIjpcIlxcdTIyQTNcIixcbiAgXCJkYmthcm93XCI6XCJcXHUyOTBGXCIsXG4gIFwiZGJsYWNcIjpcIlxcdTAyRERcIixcbiAgXCJEY2Fyb25cIjpcIlxcdTAxMEVcIixcbiAgXCJkY2Fyb25cIjpcIlxcdTAxMEZcIixcbiAgXCJEY3lcIjpcIlxcdTA0MTRcIixcbiAgXCJkY3lcIjpcIlxcdTA0MzRcIixcbiAgXCJERFwiOlwiXFx1MjE0NVwiLFxuICBcImRkXCI6XCJcXHUyMTQ2XCIsXG4gIFwiZGRhZ2dlclwiOlwiXFx1MjAyMVwiLFxuICBcImRkYXJyXCI6XCJcXHUyMUNBXCIsXG4gIFwiRERvdHJhaGRcIjpcIlxcdTI5MTFcIixcbiAgXCJkZG90c2VxXCI6XCJcXHUyQTc3XCIsXG4gIFwiZGVnXCI6XCJcXHUwMEIwXCIsXG4gIFwiRGVsXCI6XCJcXHUyMjA3XCIsXG4gIFwiRGVsdGFcIjpcIlxcdTAzOTRcIixcbiAgXCJkZWx0YVwiOlwiXFx1MDNCNFwiLFxuICBcImRlbXB0eXZcIjpcIlxcdTI5QjFcIixcbiAgXCJkZmlzaHRcIjpcIlxcdTI5N0ZcIixcbiAgXCJEZnJcIjpcIlxcdUQ4MzVcXHVERDA3XCIsXG4gIFwiZGZyXCI6XCJcXHVEODM1XFx1REQyMVwiLFxuICBcImRIYXJcIjpcIlxcdTI5NjVcIixcbiAgXCJkaGFybFwiOlwiXFx1MjFDM1wiLFxuICBcImRoYXJyXCI6XCJcXHUyMUMyXCIsXG4gIFwiRGlhY3JpdGljYWxBY3V0ZVwiOlwiXFx1MDBCNFwiLFxuICBcIkRpYWNyaXRpY2FsRG90XCI6XCJcXHUwMkQ5XCIsXG4gIFwiRGlhY3JpdGljYWxEb3VibGVBY3V0ZVwiOlwiXFx1MDJERFwiLFxuICBcIkRpYWNyaXRpY2FsR3JhdmVcIjpcIlxcdTAwNjBcIixcbiAgXCJEaWFjcml0aWNhbFRpbGRlXCI6XCJcXHUwMkRDXCIsXG4gIFwiZGlhbVwiOlwiXFx1MjJDNFwiLFxuICBcIkRpYW1vbmRcIjpcIlxcdTIyQzRcIixcbiAgXCJkaWFtb25kXCI6XCJcXHUyMkM0XCIsXG4gIFwiZGlhbW9uZHN1aXRcIjpcIlxcdTI2NjZcIixcbiAgXCJkaWFtc1wiOlwiXFx1MjY2NlwiLFxuICBcImRpZVwiOlwiXFx1MDBBOFwiLFxuICBcIkRpZmZlcmVudGlhbERcIjpcIlxcdTIxNDZcIixcbiAgXCJkaWdhbW1hXCI6XCJcXHUwM0REXCIsXG4gIFwiZGlzaW5cIjpcIlxcdTIyRjJcIixcbiAgXCJkaXZcIjpcIlxcdTAwRjdcIixcbiAgXCJkaXZpZGVcIjpcIlxcdTAwRjdcIixcbiAgXCJkaXZpZGVvbnRpbWVzXCI6XCJcXHUyMkM3XCIsXG4gIFwiZGl2b254XCI6XCJcXHUyMkM3XCIsXG4gIFwiREpjeVwiOlwiXFx1MDQwMlwiLFxuICBcImRqY3lcIjpcIlxcdTA0NTJcIixcbiAgXCJkbGNvcm5cIjpcIlxcdTIzMUVcIixcbiAgXCJkbGNyb3BcIjpcIlxcdTIzMERcIixcbiAgXCJkb2xsYXJcIjpcIlxcdTAwMjRcIixcbiAgXCJEb3BmXCI6XCJcXHVEODM1XFx1REQzQlwiLFxuICBcImRvcGZcIjpcIlxcdUQ4MzVcXHVERDU1XCIsXG4gIFwiRG90XCI6XCJcXHUwMEE4XCIsXG4gIFwiZG90XCI6XCJcXHUwMkQ5XCIsXG4gIFwiRG90RG90XCI6XCJcXHUyMERDXCIsXG4gIFwiZG90ZXFcIjpcIlxcdTIyNTBcIixcbiAgXCJkb3RlcWRvdFwiOlwiXFx1MjI1MVwiLFxuICBcIkRvdEVxdWFsXCI6XCJcXHUyMjUwXCIsXG4gIFwiZG90bWludXNcIjpcIlxcdTIyMzhcIixcbiAgXCJkb3RwbHVzXCI6XCJcXHUyMjE0XCIsXG4gIFwiZG90c3F1YXJlXCI6XCJcXHUyMkExXCIsXG4gIFwiZG91YmxlYmFyd2VkZ2VcIjpcIlxcdTIzMDZcIixcbiAgXCJEb3VibGVDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMkZcIixcbiAgXCJEb3VibGVEb3RcIjpcIlxcdTAwQThcIixcbiAgXCJEb3VibGVEb3duQXJyb3dcIjpcIlxcdTIxRDNcIixcbiAgXCJEb3VibGVMZWZ0QXJyb3dcIjpcIlxcdTIxRDBcIixcbiAgXCJEb3VibGVMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjFENFwiLFxuICBcIkRvdWJsZUxlZnRUZWVcIjpcIlxcdTJBRTRcIixcbiAgXCJEb3VibGVMb25nTGVmdEFycm93XCI6XCJcXHUyN0Y4XCIsXG4gIFwiRG91YmxlTG9uZ0xlZnRSaWdodEFycm93XCI6XCJcXHUyN0ZBXCIsXG4gIFwiRG91YmxlTG9uZ1JpZ2h0QXJyb3dcIjpcIlxcdTI3RjlcIixcbiAgXCJEb3VibGVSaWdodEFycm93XCI6XCJcXHUyMUQyXCIsXG4gIFwiRG91YmxlUmlnaHRUZWVcIjpcIlxcdTIyQThcIixcbiAgXCJEb3VibGVVcEFycm93XCI6XCJcXHUyMUQxXCIsXG4gIFwiRG91YmxlVXBEb3duQXJyb3dcIjpcIlxcdTIxRDVcIixcbiAgXCJEb3VibGVWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNVwiLFxuICBcIkRvd25BcnJvd1wiOlwiXFx1MjE5M1wiLFxuICBcIkRvd25hcnJvd1wiOlwiXFx1MjFEM1wiLFxuICBcImRvd25hcnJvd1wiOlwiXFx1MjE5M1wiLFxuICBcIkRvd25BcnJvd0JhclwiOlwiXFx1MjkxM1wiLFxuICBcIkRvd25BcnJvd1VwQXJyb3dcIjpcIlxcdTIxRjVcIixcbiAgXCJEb3duQnJldmVcIjpcIlxcdTAzMTFcIixcbiAgXCJkb3duZG93bmFycm93c1wiOlwiXFx1MjFDQVwiLFxuICBcImRvd25oYXJwb29ubGVmdFwiOlwiXFx1MjFDM1wiLFxuICBcImRvd25oYXJwb29ucmlnaHRcIjpcIlxcdTIxQzJcIixcbiAgXCJEb3duTGVmdFJpZ2h0VmVjdG9yXCI6XCJcXHUyOTUwXCIsXG4gIFwiRG93bkxlZnRUZWVWZWN0b3JcIjpcIlxcdTI5NUVcIixcbiAgXCJEb3duTGVmdFZlY3RvclwiOlwiXFx1MjFCRFwiLFxuICBcIkRvd25MZWZ0VmVjdG9yQmFyXCI6XCJcXHUyOTU2XCIsXG4gIFwiRG93blJpZ2h0VGVlVmVjdG9yXCI6XCJcXHUyOTVGXCIsXG4gIFwiRG93blJpZ2h0VmVjdG9yXCI6XCJcXHUyMUMxXCIsXG4gIFwiRG93blJpZ2h0VmVjdG9yQmFyXCI6XCJcXHUyOTU3XCIsXG4gIFwiRG93blRlZVwiOlwiXFx1MjJBNFwiLFxuICBcIkRvd25UZWVBcnJvd1wiOlwiXFx1MjFBN1wiLFxuICBcImRyYmthcm93XCI6XCJcXHUyOTEwXCIsXG4gIFwiZHJjb3JuXCI6XCJcXHUyMzFGXCIsXG4gIFwiZHJjcm9wXCI6XCJcXHUyMzBDXCIsXG4gIFwiRHNjclwiOlwiXFx1RDgzNVxcdURDOUZcIixcbiAgXCJkc2NyXCI6XCJcXHVEODM1XFx1RENCOVwiLFxuICBcIkRTY3lcIjpcIlxcdTA0MDVcIixcbiAgXCJkc2N5XCI6XCJcXHUwNDU1XCIsXG4gIFwiZHNvbFwiOlwiXFx1MjlGNlwiLFxuICBcIkRzdHJva1wiOlwiXFx1MDExMFwiLFxuICBcImRzdHJva1wiOlwiXFx1MDExMVwiLFxuICBcImR0ZG90XCI6XCJcXHUyMkYxXCIsXG4gIFwiZHRyaVwiOlwiXFx1MjVCRlwiLFxuICBcImR0cmlmXCI6XCJcXHUyNUJFXCIsXG4gIFwiZHVhcnJcIjpcIlxcdTIxRjVcIixcbiAgXCJkdWhhclwiOlwiXFx1Mjk2RlwiLFxuICBcImR3YW5nbGVcIjpcIlxcdTI5QTZcIixcbiAgXCJEWmN5XCI6XCJcXHUwNDBGXCIsXG4gIFwiZHpjeVwiOlwiXFx1MDQ1RlwiLFxuICBcImR6aWdyYXJyXCI6XCJcXHUyN0ZGXCIsXG4gIFwiRWFjdXRlXCI6XCJcXHUwMEM5XCIsXG4gIFwiZWFjdXRlXCI6XCJcXHUwMEU5XCIsXG4gIFwiZWFzdGVyXCI6XCJcXHUyQTZFXCIsXG4gIFwiRWNhcm9uXCI6XCJcXHUwMTFBXCIsXG4gIFwiZWNhcm9uXCI6XCJcXHUwMTFCXCIsXG4gIFwiZWNpclwiOlwiXFx1MjI1NlwiLFxuICBcIkVjaXJjXCI6XCJcXHUwMENBXCIsXG4gIFwiZWNpcmNcIjpcIlxcdTAwRUFcIixcbiAgXCJlY29sb25cIjpcIlxcdTIyNTVcIixcbiAgXCJFY3lcIjpcIlxcdTA0MkRcIixcbiAgXCJlY3lcIjpcIlxcdTA0NERcIixcbiAgXCJlRERvdFwiOlwiXFx1MkE3N1wiLFxuICBcIkVkb3RcIjpcIlxcdTAxMTZcIixcbiAgXCJlRG90XCI6XCJcXHUyMjUxXCIsXG4gIFwiZWRvdFwiOlwiXFx1MDExN1wiLFxuICBcImVlXCI6XCJcXHUyMTQ3XCIsXG4gIFwiZWZEb3RcIjpcIlxcdTIyNTJcIixcbiAgXCJFZnJcIjpcIlxcdUQ4MzVcXHVERDA4XCIsXG4gIFwiZWZyXCI6XCJcXHVEODM1XFx1REQyMlwiLFxuICBcImVnXCI6XCJcXHUyQTlBXCIsXG4gIFwiRWdyYXZlXCI6XCJcXHUwMEM4XCIsXG4gIFwiZWdyYXZlXCI6XCJcXHUwMEU4XCIsXG4gIFwiZWdzXCI6XCJcXHUyQTk2XCIsXG4gIFwiZWdzZG90XCI6XCJcXHUyQTk4XCIsXG4gIFwiZWxcIjpcIlxcdTJBOTlcIixcbiAgXCJFbGVtZW50XCI6XCJcXHUyMjA4XCIsXG4gIFwiZWxpbnRlcnNcIjpcIlxcdTIzRTdcIixcbiAgXCJlbGxcIjpcIlxcdTIxMTNcIixcbiAgXCJlbHNcIjpcIlxcdTJBOTVcIixcbiAgXCJlbHNkb3RcIjpcIlxcdTJBOTdcIixcbiAgXCJFbWFjclwiOlwiXFx1MDExMlwiLFxuICBcImVtYWNyXCI6XCJcXHUwMTEzXCIsXG4gIFwiZW1wdHlcIjpcIlxcdTIyMDVcIixcbiAgXCJlbXB0eXNldFwiOlwiXFx1MjIwNVwiLFxuICBcIkVtcHR5U21hbGxTcXVhcmVcIjpcIlxcdTI1RkJcIixcbiAgXCJlbXB0eXZcIjpcIlxcdTIyMDVcIixcbiAgXCJFbXB0eVZlcnlTbWFsbFNxdWFyZVwiOlwiXFx1MjVBQlwiLFxuICBcImVtc3BcIjpcIlxcdTIwMDNcIixcbiAgXCJlbXNwMTNcIjpcIlxcdTIwMDRcIixcbiAgXCJlbXNwMTRcIjpcIlxcdTIwMDVcIixcbiAgXCJFTkdcIjpcIlxcdTAxNEFcIixcbiAgXCJlbmdcIjpcIlxcdTAxNEJcIixcbiAgXCJlbnNwXCI6XCJcXHUyMDAyXCIsXG4gIFwiRW9nb25cIjpcIlxcdTAxMThcIixcbiAgXCJlb2dvblwiOlwiXFx1MDExOVwiLFxuICBcIkVvcGZcIjpcIlxcdUQ4MzVcXHVERDNDXCIsXG4gIFwiZW9wZlwiOlwiXFx1RDgzNVxcdURENTZcIixcbiAgXCJlcGFyXCI6XCJcXHUyMkQ1XCIsXG4gIFwiZXBhcnNsXCI6XCJcXHUyOUUzXCIsXG4gIFwiZXBsdXNcIjpcIlxcdTJBNzFcIixcbiAgXCJlcHNpXCI6XCJcXHUwM0I1XCIsXG4gIFwiRXBzaWxvblwiOlwiXFx1MDM5NVwiLFxuICBcImVwc2lsb25cIjpcIlxcdTAzQjVcIixcbiAgXCJlcHNpdlwiOlwiXFx1MDNGNVwiLFxuICBcImVxY2lyY1wiOlwiXFx1MjI1NlwiLFxuICBcImVxY29sb25cIjpcIlxcdTIyNTVcIixcbiAgXCJlcXNpbVwiOlwiXFx1MjI0MlwiLFxuICBcImVxc2xhbnRndHJcIjpcIlxcdTJBOTZcIixcbiAgXCJlcXNsYW50bGVzc1wiOlwiXFx1MkE5NVwiLFxuICBcIkVxdWFsXCI6XCJcXHUyQTc1XCIsXG4gIFwiZXF1YWxzXCI6XCJcXHUwMDNEXCIsXG4gIFwiRXF1YWxUaWxkZVwiOlwiXFx1MjI0MlwiLFxuICBcImVxdWVzdFwiOlwiXFx1MjI1RlwiLFxuICBcIkVxdWlsaWJyaXVtXCI6XCJcXHUyMUNDXCIsXG4gIFwiZXF1aXZcIjpcIlxcdTIyNjFcIixcbiAgXCJlcXVpdkREXCI6XCJcXHUyQTc4XCIsXG4gIFwiZXF2cGFyc2xcIjpcIlxcdTI5RTVcIixcbiAgXCJlcmFyclwiOlwiXFx1Mjk3MVwiLFxuICBcImVyRG90XCI6XCJcXHUyMjUzXCIsXG4gIFwiRXNjclwiOlwiXFx1MjEzMFwiLFxuICBcImVzY3JcIjpcIlxcdTIxMkZcIixcbiAgXCJlc2RvdFwiOlwiXFx1MjI1MFwiLFxuICBcIkVzaW1cIjpcIlxcdTJBNzNcIixcbiAgXCJlc2ltXCI6XCJcXHUyMjQyXCIsXG4gIFwiRXRhXCI6XCJcXHUwMzk3XCIsXG4gIFwiZXRhXCI6XCJcXHUwM0I3XCIsXG4gIFwiRVRIXCI6XCJcXHUwMEQwXCIsXG4gIFwiZXRoXCI6XCJcXHUwMEYwXCIsXG4gIFwiRXVtbFwiOlwiXFx1MDBDQlwiLFxuICBcImV1bWxcIjpcIlxcdTAwRUJcIixcbiAgXCJldXJvXCI6XCJcXHUyMEFDXCIsXG4gIFwiZXhjbFwiOlwiXFx1MDAyMVwiLFxuICBcImV4aXN0XCI6XCJcXHUyMjAzXCIsXG4gIFwiRXhpc3RzXCI6XCJcXHUyMjAzXCIsXG4gIFwiZXhwZWN0YXRpb25cIjpcIlxcdTIxMzBcIixcbiAgXCJFeHBvbmVudGlhbEVcIjpcIlxcdTIxNDdcIixcbiAgXCJleHBvbmVudGlhbGVcIjpcIlxcdTIxNDdcIixcbiAgXCJmYWxsaW5nZG90c2VxXCI6XCJcXHUyMjUyXCIsXG4gIFwiRmN5XCI6XCJcXHUwNDI0XCIsXG4gIFwiZmN5XCI6XCJcXHUwNDQ0XCIsXG4gIFwiZmVtYWxlXCI6XCJcXHUyNjQwXCIsXG4gIFwiZmZpbGlnXCI6XCJcXHVGQjAzXCIsXG4gIFwiZmZsaWdcIjpcIlxcdUZCMDBcIixcbiAgXCJmZmxsaWdcIjpcIlxcdUZCMDRcIixcbiAgXCJGZnJcIjpcIlxcdUQ4MzVcXHVERDA5XCIsXG4gIFwiZmZyXCI6XCJcXHVEODM1XFx1REQyM1wiLFxuICBcImZpbGlnXCI6XCJcXHVGQjAxXCIsXG4gIFwiRmlsbGVkU21hbGxTcXVhcmVcIjpcIlxcdTI1RkNcIixcbiAgXCJGaWxsZWRWZXJ5U21hbGxTcXVhcmVcIjpcIlxcdTI1QUFcIixcbiAgXCJmamxpZ1wiOlwiXFx1MDA2NlxcdTAwNkFcIixcbiAgXCJmbGF0XCI6XCJcXHUyNjZEXCIsXG4gIFwiZmxsaWdcIjpcIlxcdUZCMDJcIixcbiAgXCJmbHRuc1wiOlwiXFx1MjVCMVwiLFxuICBcImZub2ZcIjpcIlxcdTAxOTJcIixcbiAgXCJGb3BmXCI6XCJcXHVEODM1XFx1REQzRFwiLFxuICBcImZvcGZcIjpcIlxcdUQ4MzVcXHVERDU3XCIsXG4gIFwiRm9yQWxsXCI6XCJcXHUyMjAwXCIsXG4gIFwiZm9yYWxsXCI6XCJcXHUyMjAwXCIsXG4gIFwiZm9ya1wiOlwiXFx1MjJENFwiLFxuICBcImZvcmt2XCI6XCJcXHUyQUQ5XCIsXG4gIFwiRm91cmllcnRyZlwiOlwiXFx1MjEzMVwiLFxuICBcImZwYXJ0aW50XCI6XCJcXHUyQTBEXCIsXG4gIFwiZnJhYzEyXCI6XCJcXHUwMEJEXCIsXG4gIFwiZnJhYzEzXCI6XCJcXHUyMTUzXCIsXG4gIFwiZnJhYzE0XCI6XCJcXHUwMEJDXCIsXG4gIFwiZnJhYzE1XCI6XCJcXHUyMTU1XCIsXG4gIFwiZnJhYzE2XCI6XCJcXHUyMTU5XCIsXG4gIFwiZnJhYzE4XCI6XCJcXHUyMTVCXCIsXG4gIFwiZnJhYzIzXCI6XCJcXHUyMTU0XCIsXG4gIFwiZnJhYzI1XCI6XCJcXHUyMTU2XCIsXG4gIFwiZnJhYzM0XCI6XCJcXHUwMEJFXCIsXG4gIFwiZnJhYzM1XCI6XCJcXHUyMTU3XCIsXG4gIFwiZnJhYzM4XCI6XCJcXHUyMTVDXCIsXG4gIFwiZnJhYzQ1XCI6XCJcXHUyMTU4XCIsXG4gIFwiZnJhYzU2XCI6XCJcXHUyMTVBXCIsXG4gIFwiZnJhYzU4XCI6XCJcXHUyMTVEXCIsXG4gIFwiZnJhYzc4XCI6XCJcXHUyMTVFXCIsXG4gIFwiZnJhc2xcIjpcIlxcdTIwNDRcIixcbiAgXCJmcm93blwiOlwiXFx1MjMyMlwiLFxuICBcIkZzY3JcIjpcIlxcdTIxMzFcIixcbiAgXCJmc2NyXCI6XCJcXHVEODM1XFx1RENCQlwiLFxuICBcImdhY3V0ZVwiOlwiXFx1MDFGNVwiLFxuICBcIkdhbW1hXCI6XCJcXHUwMzkzXCIsXG4gIFwiZ2FtbWFcIjpcIlxcdTAzQjNcIixcbiAgXCJHYW1tYWRcIjpcIlxcdTAzRENcIixcbiAgXCJnYW1tYWRcIjpcIlxcdTAzRERcIixcbiAgXCJnYXBcIjpcIlxcdTJBODZcIixcbiAgXCJHYnJldmVcIjpcIlxcdTAxMUVcIixcbiAgXCJnYnJldmVcIjpcIlxcdTAxMUZcIixcbiAgXCJHY2VkaWxcIjpcIlxcdTAxMjJcIixcbiAgXCJHY2lyY1wiOlwiXFx1MDExQ1wiLFxuICBcImdjaXJjXCI6XCJcXHUwMTFEXCIsXG4gIFwiR2N5XCI6XCJcXHUwNDEzXCIsXG4gIFwiZ2N5XCI6XCJcXHUwNDMzXCIsXG4gIFwiR2RvdFwiOlwiXFx1MDEyMFwiLFxuICBcImdkb3RcIjpcIlxcdTAxMjFcIixcbiAgXCJnRVwiOlwiXFx1MjI2N1wiLFxuICBcImdlXCI6XCJcXHUyMjY1XCIsXG4gIFwiZ0VsXCI6XCJcXHUyQThDXCIsXG4gIFwiZ2VsXCI6XCJcXHUyMkRCXCIsXG4gIFwiZ2VxXCI6XCJcXHUyMjY1XCIsXG4gIFwiZ2VxcVwiOlwiXFx1MjI2N1wiLFxuICBcImdlcXNsYW50XCI6XCJcXHUyQTdFXCIsXG4gIFwiZ2VzXCI6XCJcXHUyQTdFXCIsXG4gIFwiZ2VzY2NcIjpcIlxcdTJBQTlcIixcbiAgXCJnZXNkb3RcIjpcIlxcdTJBODBcIixcbiAgXCJnZXNkb3RvXCI6XCJcXHUyQTgyXCIsXG4gIFwiZ2VzZG90b2xcIjpcIlxcdTJBODRcIixcbiAgXCJnZXNsXCI6XCJcXHUyMkRCXFx1RkUwMFwiLFxuICBcImdlc2xlc1wiOlwiXFx1MkE5NFwiLFxuICBcIkdmclwiOlwiXFx1RDgzNVxcdUREMEFcIixcbiAgXCJnZnJcIjpcIlxcdUQ4MzVcXHVERDI0XCIsXG4gIFwiR2dcIjpcIlxcdTIyRDlcIixcbiAgXCJnZ1wiOlwiXFx1MjI2QlwiLFxuICBcImdnZ1wiOlwiXFx1MjJEOVwiLFxuICBcImdpbWVsXCI6XCJcXHUyMTM3XCIsXG4gIFwiR0pjeVwiOlwiXFx1MDQwM1wiLFxuICBcImdqY3lcIjpcIlxcdTA0NTNcIixcbiAgXCJnbFwiOlwiXFx1MjI3N1wiLFxuICBcImdsYVwiOlwiXFx1MkFBNVwiLFxuICBcImdsRVwiOlwiXFx1MkE5MlwiLFxuICBcImdsalwiOlwiXFx1MkFBNFwiLFxuICBcImduYXBcIjpcIlxcdTJBOEFcIixcbiAgXCJnbmFwcHJveFwiOlwiXFx1MkE4QVwiLFxuICBcImduRVwiOlwiXFx1MjI2OVwiLFxuICBcImduZVwiOlwiXFx1MkE4OFwiLFxuICBcImduZXFcIjpcIlxcdTJBODhcIixcbiAgXCJnbmVxcVwiOlwiXFx1MjI2OVwiLFxuICBcImduc2ltXCI6XCJcXHUyMkU3XCIsXG4gIFwiR29wZlwiOlwiXFx1RDgzNVxcdUREM0VcIixcbiAgXCJnb3BmXCI6XCJcXHVEODM1XFx1REQ1OFwiLFxuICBcImdyYXZlXCI6XCJcXHUwMDYwXCIsXG4gIFwiR3JlYXRlckVxdWFsXCI6XCJcXHUyMjY1XCIsXG4gIFwiR3JlYXRlckVxdWFsTGVzc1wiOlwiXFx1MjJEQlwiLFxuICBcIkdyZWF0ZXJGdWxsRXF1YWxcIjpcIlxcdTIyNjdcIixcbiAgXCJHcmVhdGVyR3JlYXRlclwiOlwiXFx1MkFBMlwiLFxuICBcIkdyZWF0ZXJMZXNzXCI6XCJcXHUyMjc3XCIsXG4gIFwiR3JlYXRlclNsYW50RXF1YWxcIjpcIlxcdTJBN0VcIixcbiAgXCJHcmVhdGVyVGlsZGVcIjpcIlxcdTIyNzNcIixcbiAgXCJHc2NyXCI6XCJcXHVEODM1XFx1RENBMlwiLFxuICBcImdzY3JcIjpcIlxcdTIxMEFcIixcbiAgXCJnc2ltXCI6XCJcXHUyMjczXCIsXG4gIFwiZ3NpbWVcIjpcIlxcdTJBOEVcIixcbiAgXCJnc2ltbFwiOlwiXFx1MkE5MFwiLFxuICBcIkdUXCI6XCJcXHUwMDNFXCIsXG4gIFwiR3RcIjpcIlxcdTIyNkJcIixcbiAgXCJndFwiOlwiXFx1MDAzRVwiLFxuICBcImd0Y2NcIjpcIlxcdTJBQTdcIixcbiAgXCJndGNpclwiOlwiXFx1MkE3QVwiLFxuICBcImd0ZG90XCI6XCJcXHUyMkQ3XCIsXG4gIFwiZ3RsUGFyXCI6XCJcXHUyOTk1XCIsXG4gIFwiZ3RxdWVzdFwiOlwiXFx1MkE3Q1wiLFxuICBcImd0cmFwcHJveFwiOlwiXFx1MkE4NlwiLFxuICBcImd0cmFyclwiOlwiXFx1Mjk3OFwiLFxuICBcImd0cmRvdFwiOlwiXFx1MjJEN1wiLFxuICBcImd0cmVxbGVzc1wiOlwiXFx1MjJEQlwiLFxuICBcImd0cmVxcWxlc3NcIjpcIlxcdTJBOENcIixcbiAgXCJndHJsZXNzXCI6XCJcXHUyMjc3XCIsXG4gIFwiZ3Ryc2ltXCI6XCJcXHUyMjczXCIsXG4gIFwiZ3ZlcnRuZXFxXCI6XCJcXHUyMjY5XFx1RkUwMFwiLFxuICBcImd2bkVcIjpcIlxcdTIyNjlcXHVGRTAwXCIsXG4gIFwiSGFjZWtcIjpcIlxcdTAyQzdcIixcbiAgXCJoYWlyc3BcIjpcIlxcdTIwMEFcIixcbiAgXCJoYWxmXCI6XCJcXHUwMEJEXCIsXG4gIFwiaGFtaWx0XCI6XCJcXHUyMTBCXCIsXG4gIFwiSEFSRGN5XCI6XCJcXHUwNDJBXCIsXG4gIFwiaGFyZGN5XCI6XCJcXHUwNDRBXCIsXG4gIFwiaEFyclwiOlwiXFx1MjFENFwiLFxuICBcImhhcnJcIjpcIlxcdTIxOTRcIixcbiAgXCJoYXJyY2lyXCI6XCJcXHUyOTQ4XCIsXG4gIFwiaGFycndcIjpcIlxcdTIxQURcIixcbiAgXCJIYXRcIjpcIlxcdTAwNUVcIixcbiAgXCJoYmFyXCI6XCJcXHUyMTBGXCIsXG4gIFwiSGNpcmNcIjpcIlxcdTAxMjRcIixcbiAgXCJoY2lyY1wiOlwiXFx1MDEyNVwiLFxuICBcImhlYXJ0c1wiOlwiXFx1MjY2NVwiLFxuICBcImhlYXJ0c3VpdFwiOlwiXFx1MjY2NVwiLFxuICBcImhlbGxpcFwiOlwiXFx1MjAyNlwiLFxuICBcImhlcmNvblwiOlwiXFx1MjJCOVwiLFxuICBcIkhmclwiOlwiXFx1MjEwQ1wiLFxuICBcImhmclwiOlwiXFx1RDgzNVxcdUREMjVcIixcbiAgXCJIaWxiZXJ0U3BhY2VcIjpcIlxcdTIxMEJcIixcbiAgXCJoa3NlYXJvd1wiOlwiXFx1MjkyNVwiLFxuICBcImhrc3dhcm93XCI6XCJcXHUyOTI2XCIsXG4gIFwiaG9hcnJcIjpcIlxcdTIxRkZcIixcbiAgXCJob210aHRcIjpcIlxcdTIyM0JcIixcbiAgXCJob29rbGVmdGFycm93XCI6XCJcXHUyMUE5XCIsXG4gIFwiaG9va3JpZ2h0YXJyb3dcIjpcIlxcdTIxQUFcIixcbiAgXCJIb3BmXCI6XCJcXHUyMTBEXCIsXG4gIFwiaG9wZlwiOlwiXFx1RDgzNVxcdURENTlcIixcbiAgXCJob3JiYXJcIjpcIlxcdTIwMTVcIixcbiAgXCJIb3Jpem9udGFsTGluZVwiOlwiXFx1MjUwMFwiLFxuICBcIkhzY3JcIjpcIlxcdTIxMEJcIixcbiAgXCJoc2NyXCI6XCJcXHVEODM1XFx1RENCRFwiLFxuICBcImhzbGFzaFwiOlwiXFx1MjEwRlwiLFxuICBcIkhzdHJva1wiOlwiXFx1MDEyNlwiLFxuICBcImhzdHJva1wiOlwiXFx1MDEyN1wiLFxuICBcIkh1bXBEb3duSHVtcFwiOlwiXFx1MjI0RVwiLFxuICBcIkh1bXBFcXVhbFwiOlwiXFx1MjI0RlwiLFxuICBcImh5YnVsbFwiOlwiXFx1MjA0M1wiLFxuICBcImh5cGhlblwiOlwiXFx1MjAxMFwiLFxuICBcIklhY3V0ZVwiOlwiXFx1MDBDRFwiLFxuICBcImlhY3V0ZVwiOlwiXFx1MDBFRFwiLFxuICBcImljXCI6XCJcXHUyMDYzXCIsXG4gIFwiSWNpcmNcIjpcIlxcdTAwQ0VcIixcbiAgXCJpY2lyY1wiOlwiXFx1MDBFRVwiLFxuICBcIkljeVwiOlwiXFx1MDQxOFwiLFxuICBcImljeVwiOlwiXFx1MDQzOFwiLFxuICBcIklkb3RcIjpcIlxcdTAxMzBcIixcbiAgXCJJRWN5XCI6XCJcXHUwNDE1XCIsXG4gIFwiaWVjeVwiOlwiXFx1MDQzNVwiLFxuICBcImlleGNsXCI6XCJcXHUwMEExXCIsXG4gIFwiaWZmXCI6XCJcXHUyMUQ0XCIsXG4gIFwiSWZyXCI6XCJcXHUyMTExXCIsXG4gIFwiaWZyXCI6XCJcXHVEODM1XFx1REQyNlwiLFxuICBcIklncmF2ZVwiOlwiXFx1MDBDQ1wiLFxuICBcImlncmF2ZVwiOlwiXFx1MDBFQ1wiLFxuICBcImlpXCI6XCJcXHUyMTQ4XCIsXG4gIFwiaWlpaW50XCI6XCJcXHUyQTBDXCIsXG4gIFwiaWlpbnRcIjpcIlxcdTIyMkRcIixcbiAgXCJpaW5maW5cIjpcIlxcdTI5RENcIixcbiAgXCJpaW90YVwiOlwiXFx1MjEyOVwiLFxuICBcIklKbGlnXCI6XCJcXHUwMTMyXCIsXG4gIFwiaWpsaWdcIjpcIlxcdTAxMzNcIixcbiAgXCJJbVwiOlwiXFx1MjExMVwiLFxuICBcIkltYWNyXCI6XCJcXHUwMTJBXCIsXG4gIFwiaW1hY3JcIjpcIlxcdTAxMkJcIixcbiAgXCJpbWFnZVwiOlwiXFx1MjExMVwiLFxuICBcIkltYWdpbmFyeUlcIjpcIlxcdTIxNDhcIixcbiAgXCJpbWFnbGluZVwiOlwiXFx1MjExMFwiLFxuICBcImltYWdwYXJ0XCI6XCJcXHUyMTExXCIsXG4gIFwiaW1hdGhcIjpcIlxcdTAxMzFcIixcbiAgXCJpbW9mXCI6XCJcXHUyMkI3XCIsXG4gIFwiaW1wZWRcIjpcIlxcdTAxQjVcIixcbiAgXCJJbXBsaWVzXCI6XCJcXHUyMUQyXCIsXG4gIFwiaW5cIjpcIlxcdTIyMDhcIixcbiAgXCJpbmNhcmVcIjpcIlxcdTIxMDVcIixcbiAgXCJpbmZpblwiOlwiXFx1MjIxRVwiLFxuICBcImluZmludGllXCI6XCJcXHUyOUREXCIsXG4gIFwiaW5vZG90XCI6XCJcXHUwMTMxXCIsXG4gIFwiSW50XCI6XCJcXHUyMjJDXCIsXG4gIFwiaW50XCI6XCJcXHUyMjJCXCIsXG4gIFwiaW50Y2FsXCI6XCJcXHUyMkJBXCIsXG4gIFwiaW50ZWdlcnNcIjpcIlxcdTIxMjRcIixcbiAgXCJJbnRlZ3JhbFwiOlwiXFx1MjIyQlwiLFxuICBcImludGVyY2FsXCI6XCJcXHUyMkJBXCIsXG4gIFwiSW50ZXJzZWN0aW9uXCI6XCJcXHUyMkMyXCIsXG4gIFwiaW50bGFyaGtcIjpcIlxcdTJBMTdcIixcbiAgXCJpbnRwcm9kXCI6XCJcXHUyQTNDXCIsXG4gIFwiSW52aXNpYmxlQ29tbWFcIjpcIlxcdTIwNjNcIixcbiAgXCJJbnZpc2libGVUaW1lc1wiOlwiXFx1MjA2MlwiLFxuICBcIklPY3lcIjpcIlxcdTA0MDFcIixcbiAgXCJpb2N5XCI6XCJcXHUwNDUxXCIsXG4gIFwiSW9nb25cIjpcIlxcdTAxMkVcIixcbiAgXCJpb2dvblwiOlwiXFx1MDEyRlwiLFxuICBcIklvcGZcIjpcIlxcdUQ4MzVcXHVERDQwXCIsXG4gIFwiaW9wZlwiOlwiXFx1RDgzNVxcdURENUFcIixcbiAgXCJJb3RhXCI6XCJcXHUwMzk5XCIsXG4gIFwiaW90YVwiOlwiXFx1MDNCOVwiLFxuICBcImlwcm9kXCI6XCJcXHUyQTNDXCIsXG4gIFwiaXF1ZXN0XCI6XCJcXHUwMEJGXCIsXG4gIFwiSXNjclwiOlwiXFx1MjExMFwiLFxuICBcImlzY3JcIjpcIlxcdUQ4MzVcXHVEQ0JFXCIsXG4gIFwiaXNpblwiOlwiXFx1MjIwOFwiLFxuICBcImlzaW5kb3RcIjpcIlxcdTIyRjVcIixcbiAgXCJpc2luRVwiOlwiXFx1MjJGOVwiLFxuICBcImlzaW5zXCI6XCJcXHUyMkY0XCIsXG4gIFwiaXNpbnN2XCI6XCJcXHUyMkYzXCIsXG4gIFwiaXNpbnZcIjpcIlxcdTIyMDhcIixcbiAgXCJpdFwiOlwiXFx1MjA2MlwiLFxuICBcIkl0aWxkZVwiOlwiXFx1MDEyOFwiLFxuICBcIml0aWxkZVwiOlwiXFx1MDEyOVwiLFxuICBcIkl1a2N5XCI6XCJcXHUwNDA2XCIsXG4gIFwiaXVrY3lcIjpcIlxcdTA0NTZcIixcbiAgXCJJdW1sXCI6XCJcXHUwMENGXCIsXG4gIFwiaXVtbFwiOlwiXFx1MDBFRlwiLFxuICBcIkpjaXJjXCI6XCJcXHUwMTM0XCIsXG4gIFwiamNpcmNcIjpcIlxcdTAxMzVcIixcbiAgXCJKY3lcIjpcIlxcdTA0MTlcIixcbiAgXCJqY3lcIjpcIlxcdTA0MzlcIixcbiAgXCJKZnJcIjpcIlxcdUQ4MzVcXHVERDBEXCIsXG4gIFwiamZyXCI6XCJcXHVEODM1XFx1REQyN1wiLFxuICBcImptYXRoXCI6XCJcXHUwMjM3XCIsXG4gIFwiSm9wZlwiOlwiXFx1RDgzNVxcdURENDFcIixcbiAgXCJqb3BmXCI6XCJcXHVEODM1XFx1REQ1QlwiLFxuICBcIkpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0E1XCIsXG4gIFwianNjclwiOlwiXFx1RDgzNVxcdURDQkZcIixcbiAgXCJKc2VyY3lcIjpcIlxcdTA0MDhcIixcbiAgXCJqc2VyY3lcIjpcIlxcdTA0NThcIixcbiAgXCJKdWtjeVwiOlwiXFx1MDQwNFwiLFxuICBcImp1a2N5XCI6XCJcXHUwNDU0XCIsXG4gIFwiS2FwcGFcIjpcIlxcdTAzOUFcIixcbiAgXCJrYXBwYVwiOlwiXFx1MDNCQVwiLFxuICBcImthcHBhdlwiOlwiXFx1MDNGMFwiLFxuICBcIktjZWRpbFwiOlwiXFx1MDEzNlwiLFxuICBcImtjZWRpbFwiOlwiXFx1MDEzN1wiLFxuICBcIktjeVwiOlwiXFx1MDQxQVwiLFxuICBcImtjeVwiOlwiXFx1MDQzQVwiLFxuICBcIktmclwiOlwiXFx1RDgzNVxcdUREMEVcIixcbiAgXCJrZnJcIjpcIlxcdUQ4MzVcXHVERDI4XCIsXG4gIFwia2dyZWVuXCI6XCJcXHUwMTM4XCIsXG4gIFwiS0hjeVwiOlwiXFx1MDQyNVwiLFxuICBcImtoY3lcIjpcIlxcdTA0NDVcIixcbiAgXCJLSmN5XCI6XCJcXHUwNDBDXCIsXG4gIFwia2pjeVwiOlwiXFx1MDQ1Q1wiLFxuICBcIktvcGZcIjpcIlxcdUQ4MzVcXHVERDQyXCIsXG4gIFwia29wZlwiOlwiXFx1RDgzNVxcdURENUNcIixcbiAgXCJLc2NyXCI6XCJcXHVEODM1XFx1RENBNlwiLFxuICBcImtzY3JcIjpcIlxcdUQ4MzVcXHVEQ0MwXCIsXG4gIFwibEFhcnJcIjpcIlxcdTIxREFcIixcbiAgXCJMYWN1dGVcIjpcIlxcdTAxMzlcIixcbiAgXCJsYWN1dGVcIjpcIlxcdTAxM0FcIixcbiAgXCJsYWVtcHR5dlwiOlwiXFx1MjlCNFwiLFxuICBcImxhZ3JhblwiOlwiXFx1MjExMlwiLFxuICBcIkxhbWJkYVwiOlwiXFx1MDM5QlwiLFxuICBcImxhbWJkYVwiOlwiXFx1MDNCQlwiLFxuICBcIkxhbmdcIjpcIlxcdTI3RUFcIixcbiAgXCJsYW5nXCI6XCJcXHUyN0U4XCIsXG4gIFwibGFuZ2RcIjpcIlxcdTI5OTFcIixcbiAgXCJsYW5nbGVcIjpcIlxcdTI3RThcIixcbiAgXCJsYXBcIjpcIlxcdTJBODVcIixcbiAgXCJMYXBsYWNldHJmXCI6XCJcXHUyMTEyXCIsXG4gIFwibGFxdW9cIjpcIlxcdTAwQUJcIixcbiAgXCJMYXJyXCI6XCJcXHUyMTlFXCIsXG4gIFwibEFyclwiOlwiXFx1MjFEMFwiLFxuICBcImxhcnJcIjpcIlxcdTIxOTBcIixcbiAgXCJsYXJyYlwiOlwiXFx1MjFFNFwiLFxuICBcImxhcnJiZnNcIjpcIlxcdTI5MUZcIixcbiAgXCJsYXJyZnNcIjpcIlxcdTI5MURcIixcbiAgXCJsYXJyaGtcIjpcIlxcdTIxQTlcIixcbiAgXCJsYXJybHBcIjpcIlxcdTIxQUJcIixcbiAgXCJsYXJycGxcIjpcIlxcdTI5MzlcIixcbiAgXCJsYXJyc2ltXCI6XCJcXHUyOTczXCIsXG4gIFwibGFycnRsXCI6XCJcXHUyMUEyXCIsXG4gIFwibGF0XCI6XCJcXHUyQUFCXCIsXG4gIFwibEF0YWlsXCI6XCJcXHUyOTFCXCIsXG4gIFwibGF0YWlsXCI6XCJcXHUyOTE5XCIsXG4gIFwibGF0ZVwiOlwiXFx1MkFBRFwiLFxuICBcImxhdGVzXCI6XCJcXHUyQUFEXFx1RkUwMFwiLFxuICBcImxCYXJyXCI6XCJcXHUyOTBFXCIsXG4gIFwibGJhcnJcIjpcIlxcdTI5MENcIixcbiAgXCJsYmJya1wiOlwiXFx1Mjc3MlwiLFxuICBcImxicmFjZVwiOlwiXFx1MDA3QlwiLFxuICBcImxicmFja1wiOlwiXFx1MDA1QlwiLFxuICBcImxicmtlXCI6XCJcXHUyOThCXCIsXG4gIFwibGJya3NsZFwiOlwiXFx1Mjk4RlwiLFxuICBcImxicmtzbHVcIjpcIlxcdTI5OERcIixcbiAgXCJMY2Fyb25cIjpcIlxcdTAxM0RcIixcbiAgXCJsY2Fyb25cIjpcIlxcdTAxM0VcIixcbiAgXCJMY2VkaWxcIjpcIlxcdTAxM0JcIixcbiAgXCJsY2VkaWxcIjpcIlxcdTAxM0NcIixcbiAgXCJsY2VpbFwiOlwiXFx1MjMwOFwiLFxuICBcImxjdWJcIjpcIlxcdTAwN0JcIixcbiAgXCJMY3lcIjpcIlxcdTA0MUJcIixcbiAgXCJsY3lcIjpcIlxcdTA0M0JcIixcbiAgXCJsZGNhXCI6XCJcXHUyOTM2XCIsXG4gIFwibGRxdW9cIjpcIlxcdTIwMUNcIixcbiAgXCJsZHF1b3JcIjpcIlxcdTIwMUVcIixcbiAgXCJsZHJkaGFyXCI6XCJcXHUyOTY3XCIsXG4gIFwibGRydXNoYXJcIjpcIlxcdTI5NEJcIixcbiAgXCJsZHNoXCI6XCJcXHUyMUIyXCIsXG4gIFwibEVcIjpcIlxcdTIyNjZcIixcbiAgXCJsZVwiOlwiXFx1MjI2NFwiLFxuICBcIkxlZnRBbmdsZUJyYWNrZXRcIjpcIlxcdTI3RThcIixcbiAgXCJMZWZ0QXJyb3dcIjpcIlxcdTIxOTBcIixcbiAgXCJMZWZ0YXJyb3dcIjpcIlxcdTIxRDBcIixcbiAgXCJsZWZ0YXJyb3dcIjpcIlxcdTIxOTBcIixcbiAgXCJMZWZ0QXJyb3dCYXJcIjpcIlxcdTIxRTRcIixcbiAgXCJMZWZ0QXJyb3dSaWdodEFycm93XCI6XCJcXHUyMUM2XCIsXG4gIFwibGVmdGFycm93dGFpbFwiOlwiXFx1MjFBMlwiLFxuICBcIkxlZnRDZWlsaW5nXCI6XCJcXHUyMzA4XCIsXG4gIFwiTGVmdERvdWJsZUJyYWNrZXRcIjpcIlxcdTI3RTZcIixcbiAgXCJMZWZ0RG93blRlZVZlY3RvclwiOlwiXFx1Mjk2MVwiLFxuICBcIkxlZnREb3duVmVjdG9yXCI6XCJcXHUyMUMzXCIsXG4gIFwiTGVmdERvd25WZWN0b3JCYXJcIjpcIlxcdTI5NTlcIixcbiAgXCJMZWZ0Rmxvb3JcIjpcIlxcdTIzMEFcIixcbiAgXCJsZWZ0aGFycG9vbmRvd25cIjpcIlxcdTIxQkRcIixcbiAgXCJsZWZ0aGFycG9vbnVwXCI6XCJcXHUyMUJDXCIsXG4gIFwibGVmdGxlZnRhcnJvd3NcIjpcIlxcdTIxQzdcIixcbiAgXCJMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjE5NFwiLFxuICBcIkxlZnRyaWdodGFycm93XCI6XCJcXHUyMUQ0XCIsXG4gIFwibGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTIxOTRcIixcbiAgXCJsZWZ0cmlnaHRhcnJvd3NcIjpcIlxcdTIxQzZcIixcbiAgXCJsZWZ0cmlnaHRoYXJwb29uc1wiOlwiXFx1MjFDQlwiLFxuICBcImxlZnRyaWdodHNxdWlnYXJyb3dcIjpcIlxcdTIxQURcIixcbiAgXCJMZWZ0UmlnaHRWZWN0b3JcIjpcIlxcdTI5NEVcIixcbiAgXCJMZWZ0VGVlXCI6XCJcXHUyMkEzXCIsXG4gIFwiTGVmdFRlZUFycm93XCI6XCJcXHUyMUE0XCIsXG4gIFwiTGVmdFRlZVZlY3RvclwiOlwiXFx1Mjk1QVwiLFxuICBcImxlZnR0aHJlZXRpbWVzXCI6XCJcXHUyMkNCXCIsXG4gIFwiTGVmdFRyaWFuZ2xlXCI6XCJcXHUyMkIyXCIsXG4gIFwiTGVmdFRyaWFuZ2xlQmFyXCI6XCJcXHUyOUNGXCIsXG4gIFwiTGVmdFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyQjRcIixcbiAgXCJMZWZ0VXBEb3duVmVjdG9yXCI6XCJcXHUyOTUxXCIsXG4gIFwiTGVmdFVwVGVlVmVjdG9yXCI6XCJcXHUyOTYwXCIsXG4gIFwiTGVmdFVwVmVjdG9yXCI6XCJcXHUyMUJGXCIsXG4gIFwiTGVmdFVwVmVjdG9yQmFyXCI6XCJcXHUyOTU4XCIsXG4gIFwiTGVmdFZlY3RvclwiOlwiXFx1MjFCQ1wiLFxuICBcIkxlZnRWZWN0b3JCYXJcIjpcIlxcdTI5NTJcIixcbiAgXCJsRWdcIjpcIlxcdTJBOEJcIixcbiAgXCJsZWdcIjpcIlxcdTIyREFcIixcbiAgXCJsZXFcIjpcIlxcdTIyNjRcIixcbiAgXCJsZXFxXCI6XCJcXHUyMjY2XCIsXG4gIFwibGVxc2xhbnRcIjpcIlxcdTJBN0RcIixcbiAgXCJsZXNcIjpcIlxcdTJBN0RcIixcbiAgXCJsZXNjY1wiOlwiXFx1MkFBOFwiLFxuICBcImxlc2RvdFwiOlwiXFx1MkE3RlwiLFxuICBcImxlc2RvdG9cIjpcIlxcdTJBODFcIixcbiAgXCJsZXNkb3RvclwiOlwiXFx1MkE4M1wiLFxuICBcImxlc2dcIjpcIlxcdTIyREFcXHVGRTAwXCIsXG4gIFwibGVzZ2VzXCI6XCJcXHUyQTkzXCIsXG4gIFwibGVzc2FwcHJveFwiOlwiXFx1MkE4NVwiLFxuICBcImxlc3Nkb3RcIjpcIlxcdTIyRDZcIixcbiAgXCJsZXNzZXFndHJcIjpcIlxcdTIyREFcIixcbiAgXCJsZXNzZXFxZ3RyXCI6XCJcXHUyQThCXCIsXG4gIFwiTGVzc0VxdWFsR3JlYXRlclwiOlwiXFx1MjJEQVwiLFxuICBcIkxlc3NGdWxsRXF1YWxcIjpcIlxcdTIyNjZcIixcbiAgXCJMZXNzR3JlYXRlclwiOlwiXFx1MjI3NlwiLFxuICBcImxlc3NndHJcIjpcIlxcdTIyNzZcIixcbiAgXCJMZXNzTGVzc1wiOlwiXFx1MkFBMVwiLFxuICBcImxlc3NzaW1cIjpcIlxcdTIyNzJcIixcbiAgXCJMZXNzU2xhbnRFcXVhbFwiOlwiXFx1MkE3RFwiLFxuICBcIkxlc3NUaWxkZVwiOlwiXFx1MjI3MlwiLFxuICBcImxmaXNodFwiOlwiXFx1Mjk3Q1wiLFxuICBcImxmbG9vclwiOlwiXFx1MjMwQVwiLFxuICBcIkxmclwiOlwiXFx1RDgzNVxcdUREMEZcIixcbiAgXCJsZnJcIjpcIlxcdUQ4MzVcXHVERDI5XCIsXG4gIFwibGdcIjpcIlxcdTIyNzZcIixcbiAgXCJsZ0VcIjpcIlxcdTJBOTFcIixcbiAgXCJsSGFyXCI6XCJcXHUyOTYyXCIsXG4gIFwibGhhcmRcIjpcIlxcdTIxQkRcIixcbiAgXCJsaGFydVwiOlwiXFx1MjFCQ1wiLFxuICBcImxoYXJ1bFwiOlwiXFx1Mjk2QVwiLFxuICBcImxoYmxrXCI6XCJcXHUyNTg0XCIsXG4gIFwiTEpjeVwiOlwiXFx1MDQwOVwiLFxuICBcImxqY3lcIjpcIlxcdTA0NTlcIixcbiAgXCJMbFwiOlwiXFx1MjJEOFwiLFxuICBcImxsXCI6XCJcXHUyMjZBXCIsXG4gIFwibGxhcnJcIjpcIlxcdTIxQzdcIixcbiAgXCJsbGNvcm5lclwiOlwiXFx1MjMxRVwiLFxuICBcIkxsZWZ0YXJyb3dcIjpcIlxcdTIxREFcIixcbiAgXCJsbGhhcmRcIjpcIlxcdTI5NkJcIixcbiAgXCJsbHRyaVwiOlwiXFx1MjVGQVwiLFxuICBcIkxtaWRvdFwiOlwiXFx1MDEzRlwiLFxuICBcImxtaWRvdFwiOlwiXFx1MDE0MFwiLFxuICBcImxtb3VzdFwiOlwiXFx1MjNCMFwiLFxuICBcImxtb3VzdGFjaGVcIjpcIlxcdTIzQjBcIixcbiAgXCJsbmFwXCI6XCJcXHUyQTg5XCIsXG4gIFwibG5hcHByb3hcIjpcIlxcdTJBODlcIixcbiAgXCJsbkVcIjpcIlxcdTIyNjhcIixcbiAgXCJsbmVcIjpcIlxcdTJBODdcIixcbiAgXCJsbmVxXCI6XCJcXHUyQTg3XCIsXG4gIFwibG5lcXFcIjpcIlxcdTIyNjhcIixcbiAgXCJsbnNpbVwiOlwiXFx1MjJFNlwiLFxuICBcImxvYW5nXCI6XCJcXHUyN0VDXCIsXG4gIFwibG9hcnJcIjpcIlxcdTIxRkRcIixcbiAgXCJsb2Jya1wiOlwiXFx1MjdFNlwiLFxuICBcIkxvbmdMZWZ0QXJyb3dcIjpcIlxcdTI3RjVcIixcbiAgXCJMb25nbGVmdGFycm93XCI6XCJcXHUyN0Y4XCIsXG4gIFwibG9uZ2xlZnRhcnJvd1wiOlwiXFx1MjdGNVwiLFxuICBcIkxvbmdMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjdGN1wiLFxuICBcIkxvbmdsZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjdGQVwiLFxuICBcImxvbmdsZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjdGN1wiLFxuICBcImxvbmdtYXBzdG9cIjpcIlxcdTI3RkNcIixcbiAgXCJMb25nUmlnaHRBcnJvd1wiOlwiXFx1MjdGNlwiLFxuICBcIkxvbmdyaWdodGFycm93XCI6XCJcXHUyN0Y5XCIsXG4gIFwibG9uZ3JpZ2h0YXJyb3dcIjpcIlxcdTI3RjZcIixcbiAgXCJsb29wYXJyb3dsZWZ0XCI6XCJcXHUyMUFCXCIsXG4gIFwibG9vcGFycm93cmlnaHRcIjpcIlxcdTIxQUNcIixcbiAgXCJsb3BhclwiOlwiXFx1Mjk4NVwiLFxuICBcIkxvcGZcIjpcIlxcdUQ4MzVcXHVERDQzXCIsXG4gIFwibG9wZlwiOlwiXFx1RDgzNVxcdURENURcIixcbiAgXCJsb3BsdXNcIjpcIlxcdTJBMkRcIixcbiAgXCJsb3RpbWVzXCI6XCJcXHUyQTM0XCIsXG4gIFwibG93YXN0XCI6XCJcXHUyMjE3XCIsXG4gIFwibG93YmFyXCI6XCJcXHUwMDVGXCIsXG4gIFwiTG93ZXJMZWZ0QXJyb3dcIjpcIlxcdTIxOTlcIixcbiAgXCJMb3dlclJpZ2h0QXJyb3dcIjpcIlxcdTIxOThcIixcbiAgXCJsb3pcIjpcIlxcdTI1Q0FcIixcbiAgXCJsb3plbmdlXCI6XCJcXHUyNUNBXCIsXG4gIFwibG96ZlwiOlwiXFx1MjlFQlwiLFxuICBcImxwYXJcIjpcIlxcdTAwMjhcIixcbiAgXCJscGFybHRcIjpcIlxcdTI5OTNcIixcbiAgXCJscmFyclwiOlwiXFx1MjFDNlwiLFxuICBcImxyY29ybmVyXCI6XCJcXHUyMzFGXCIsXG4gIFwibHJoYXJcIjpcIlxcdTIxQ0JcIixcbiAgXCJscmhhcmRcIjpcIlxcdTI5NkRcIixcbiAgXCJscm1cIjpcIlxcdTIwMEVcIixcbiAgXCJscnRyaVwiOlwiXFx1MjJCRlwiLFxuICBcImxzYXF1b1wiOlwiXFx1MjAzOVwiLFxuICBcIkxzY3JcIjpcIlxcdTIxMTJcIixcbiAgXCJsc2NyXCI6XCJcXHVEODM1XFx1RENDMVwiLFxuICBcIkxzaFwiOlwiXFx1MjFCMFwiLFxuICBcImxzaFwiOlwiXFx1MjFCMFwiLFxuICBcImxzaW1cIjpcIlxcdTIyNzJcIixcbiAgXCJsc2ltZVwiOlwiXFx1MkE4RFwiLFxuICBcImxzaW1nXCI6XCJcXHUyQThGXCIsXG4gIFwibHNxYlwiOlwiXFx1MDA1QlwiLFxuICBcImxzcXVvXCI6XCJcXHUyMDE4XCIsXG4gIFwibHNxdW9yXCI6XCJcXHUyMDFBXCIsXG4gIFwiTHN0cm9rXCI6XCJcXHUwMTQxXCIsXG4gIFwibHN0cm9rXCI6XCJcXHUwMTQyXCIsXG4gIFwiTFRcIjpcIlxcdTAwM0NcIixcbiAgXCJMdFwiOlwiXFx1MjI2QVwiLFxuICBcImx0XCI6XCJcXHUwMDNDXCIsXG4gIFwibHRjY1wiOlwiXFx1MkFBNlwiLFxuICBcImx0Y2lyXCI6XCJcXHUyQTc5XCIsXG4gIFwibHRkb3RcIjpcIlxcdTIyRDZcIixcbiAgXCJsdGhyZWVcIjpcIlxcdTIyQ0JcIixcbiAgXCJsdGltZXNcIjpcIlxcdTIyQzlcIixcbiAgXCJsdGxhcnJcIjpcIlxcdTI5NzZcIixcbiAgXCJsdHF1ZXN0XCI6XCJcXHUyQTdCXCIsXG4gIFwibHRyaVwiOlwiXFx1MjVDM1wiLFxuICBcImx0cmllXCI6XCJcXHUyMkI0XCIsXG4gIFwibHRyaWZcIjpcIlxcdTI1QzJcIixcbiAgXCJsdHJQYXJcIjpcIlxcdTI5OTZcIixcbiAgXCJsdXJkc2hhclwiOlwiXFx1Mjk0QVwiLFxuICBcImx1cnVoYXJcIjpcIlxcdTI5NjZcIixcbiAgXCJsdmVydG5lcXFcIjpcIlxcdTIyNjhcXHVGRTAwXCIsXG4gIFwibHZuRVwiOlwiXFx1MjI2OFxcdUZFMDBcIixcbiAgXCJtYWNyXCI6XCJcXHUwMEFGXCIsXG4gIFwibWFsZVwiOlwiXFx1MjY0MlwiLFxuICBcIm1hbHRcIjpcIlxcdTI3MjBcIixcbiAgXCJtYWx0ZXNlXCI6XCJcXHUyNzIwXCIsXG4gIFwiTWFwXCI6XCJcXHUyOTA1XCIsXG4gIFwibWFwXCI6XCJcXHUyMUE2XCIsXG4gIFwibWFwc3RvXCI6XCJcXHUyMUE2XCIsXG4gIFwibWFwc3RvZG93blwiOlwiXFx1MjFBN1wiLFxuICBcIm1hcHN0b2xlZnRcIjpcIlxcdTIxQTRcIixcbiAgXCJtYXBzdG91cFwiOlwiXFx1MjFBNVwiLFxuICBcIm1hcmtlclwiOlwiXFx1MjVBRVwiLFxuICBcIm1jb21tYVwiOlwiXFx1MkEyOVwiLFxuICBcIk1jeVwiOlwiXFx1MDQxQ1wiLFxuICBcIm1jeVwiOlwiXFx1MDQzQ1wiLFxuICBcIm1kYXNoXCI6XCJcXHUyMDE0XCIsXG4gIFwibUREb3RcIjpcIlxcdTIyM0FcIixcbiAgXCJtZWFzdXJlZGFuZ2xlXCI6XCJcXHUyMjIxXCIsXG4gIFwiTWVkaXVtU3BhY2VcIjpcIlxcdTIwNUZcIixcbiAgXCJNZWxsaW50cmZcIjpcIlxcdTIxMzNcIixcbiAgXCJNZnJcIjpcIlxcdUQ4MzVcXHVERDEwXCIsXG4gIFwibWZyXCI6XCJcXHVEODM1XFx1REQyQVwiLFxuICBcIm1ob1wiOlwiXFx1MjEyN1wiLFxuICBcIm1pY3JvXCI6XCJcXHUwMEI1XCIsXG4gIFwibWlkXCI6XCJcXHUyMjIzXCIsXG4gIFwibWlkYXN0XCI6XCJcXHUwMDJBXCIsXG4gIFwibWlkY2lyXCI6XCJcXHUyQUYwXCIsXG4gIFwibWlkZG90XCI6XCJcXHUwMEI3XCIsXG4gIFwibWludXNcIjpcIlxcdTIyMTJcIixcbiAgXCJtaW51c2JcIjpcIlxcdTIyOUZcIixcbiAgXCJtaW51c2RcIjpcIlxcdTIyMzhcIixcbiAgXCJtaW51c2R1XCI6XCJcXHUyQTJBXCIsXG4gIFwiTWludXNQbHVzXCI6XCJcXHUyMjEzXCIsXG4gIFwibWxjcFwiOlwiXFx1MkFEQlwiLFxuICBcIm1sZHJcIjpcIlxcdTIwMjZcIixcbiAgXCJtbnBsdXNcIjpcIlxcdTIyMTNcIixcbiAgXCJtb2RlbHNcIjpcIlxcdTIyQTdcIixcbiAgXCJNb3BmXCI6XCJcXHVEODM1XFx1REQ0NFwiLFxuICBcIm1vcGZcIjpcIlxcdUQ4MzVcXHVERDVFXCIsXG4gIFwibXBcIjpcIlxcdTIyMTNcIixcbiAgXCJNc2NyXCI6XCJcXHUyMTMzXCIsXG4gIFwibXNjclwiOlwiXFx1RDgzNVxcdURDQzJcIixcbiAgXCJtc3Rwb3NcIjpcIlxcdTIyM0VcIixcbiAgXCJNdVwiOlwiXFx1MDM5Q1wiLFxuICBcIm11XCI6XCJcXHUwM0JDXCIsXG4gIFwibXVsdGltYXBcIjpcIlxcdTIyQjhcIixcbiAgXCJtdW1hcFwiOlwiXFx1MjJCOFwiLFxuICBcIm5hYmxhXCI6XCJcXHUyMjA3XCIsXG4gIFwiTmFjdXRlXCI6XCJcXHUwMTQzXCIsXG4gIFwibmFjdXRlXCI6XCJcXHUwMTQ0XCIsXG4gIFwibmFuZ1wiOlwiXFx1MjIyMFxcdTIwRDJcIixcbiAgXCJuYXBcIjpcIlxcdTIyNDlcIixcbiAgXCJuYXBFXCI6XCJcXHUyQTcwXFx1MDMzOFwiLFxuICBcIm5hcGlkXCI6XCJcXHUyMjRCXFx1MDMzOFwiLFxuICBcIm5hcG9zXCI6XCJcXHUwMTQ5XCIsXG4gIFwibmFwcHJveFwiOlwiXFx1MjI0OVwiLFxuICBcIm5hdHVyXCI6XCJcXHUyNjZFXCIsXG4gIFwibmF0dXJhbFwiOlwiXFx1MjY2RVwiLFxuICBcIm5hdHVyYWxzXCI6XCJcXHUyMTE1XCIsXG4gIFwibmJzcFwiOlwiXFx1MDBBMFwiLFxuICBcIm5idW1wXCI6XCJcXHUyMjRFXFx1MDMzOFwiLFxuICBcIm5idW1wZVwiOlwiXFx1MjI0RlxcdTAzMzhcIixcbiAgXCJuY2FwXCI6XCJcXHUyQTQzXCIsXG4gIFwiTmNhcm9uXCI6XCJcXHUwMTQ3XCIsXG4gIFwibmNhcm9uXCI6XCJcXHUwMTQ4XCIsXG4gIFwiTmNlZGlsXCI6XCJcXHUwMTQ1XCIsXG4gIFwibmNlZGlsXCI6XCJcXHUwMTQ2XCIsXG4gIFwibmNvbmdcIjpcIlxcdTIyNDdcIixcbiAgXCJuY29uZ2RvdFwiOlwiXFx1MkE2RFxcdTAzMzhcIixcbiAgXCJuY3VwXCI6XCJcXHUyQTQyXCIsXG4gIFwiTmN5XCI6XCJcXHUwNDFEXCIsXG4gIFwibmN5XCI6XCJcXHUwNDNEXCIsXG4gIFwibmRhc2hcIjpcIlxcdTIwMTNcIixcbiAgXCJuZVwiOlwiXFx1MjI2MFwiLFxuICBcIm5lYXJoa1wiOlwiXFx1MjkyNFwiLFxuICBcIm5lQXJyXCI6XCJcXHUyMUQ3XCIsXG4gIFwibmVhcnJcIjpcIlxcdTIxOTdcIixcbiAgXCJuZWFycm93XCI6XCJcXHUyMTk3XCIsXG4gIFwibmVkb3RcIjpcIlxcdTIyNTBcXHUwMzM4XCIsXG4gIFwiTmVnYXRpdmVNZWRpdW1TcGFjZVwiOlwiXFx1MjAwQlwiLFxuICBcIk5lZ2F0aXZlVGhpY2tTcGFjZVwiOlwiXFx1MjAwQlwiLFxuICBcIk5lZ2F0aXZlVGhpblNwYWNlXCI6XCJcXHUyMDBCXCIsXG4gIFwiTmVnYXRpdmVWZXJ5VGhpblNwYWNlXCI6XCJcXHUyMDBCXCIsXG4gIFwibmVxdWl2XCI6XCJcXHUyMjYyXCIsXG4gIFwibmVzZWFyXCI6XCJcXHUyOTI4XCIsXG4gIFwibmVzaW1cIjpcIlxcdTIyNDJcXHUwMzM4XCIsXG4gIFwiTmVzdGVkR3JlYXRlckdyZWF0ZXJcIjpcIlxcdTIyNkJcIixcbiAgXCJOZXN0ZWRMZXNzTGVzc1wiOlwiXFx1MjI2QVwiLFxuICBcIk5ld0xpbmVcIjpcIlxcdTAwMEFcIixcbiAgXCJuZXhpc3RcIjpcIlxcdTIyMDRcIixcbiAgXCJuZXhpc3RzXCI6XCJcXHUyMjA0XCIsXG4gIFwiTmZyXCI6XCJcXHVEODM1XFx1REQxMVwiLFxuICBcIm5mclwiOlwiXFx1RDgzNVxcdUREMkJcIixcbiAgXCJuZ0VcIjpcIlxcdTIyNjdcXHUwMzM4XCIsXG4gIFwibmdlXCI6XCJcXHUyMjcxXCIsXG4gIFwibmdlcVwiOlwiXFx1MjI3MVwiLFxuICBcIm5nZXFxXCI6XCJcXHUyMjY3XFx1MDMzOFwiLFxuICBcIm5nZXFzbGFudFwiOlwiXFx1MkE3RVxcdTAzMzhcIixcbiAgXCJuZ2VzXCI6XCJcXHUyQTdFXFx1MDMzOFwiLFxuICBcIm5HZ1wiOlwiXFx1MjJEOVxcdTAzMzhcIixcbiAgXCJuZ3NpbVwiOlwiXFx1MjI3NVwiLFxuICBcIm5HdFwiOlwiXFx1MjI2QlxcdTIwRDJcIixcbiAgXCJuZ3RcIjpcIlxcdTIyNkZcIixcbiAgXCJuZ3RyXCI6XCJcXHUyMjZGXCIsXG4gIFwibkd0dlwiOlwiXFx1MjI2QlxcdTAzMzhcIixcbiAgXCJuaEFyclwiOlwiXFx1MjFDRVwiLFxuICBcIm5oYXJyXCI6XCJcXHUyMUFFXCIsXG4gIFwibmhwYXJcIjpcIlxcdTJBRjJcIixcbiAgXCJuaVwiOlwiXFx1MjIwQlwiLFxuICBcIm5pc1wiOlwiXFx1MjJGQ1wiLFxuICBcIm5pc2RcIjpcIlxcdTIyRkFcIixcbiAgXCJuaXZcIjpcIlxcdTIyMEJcIixcbiAgXCJOSmN5XCI6XCJcXHUwNDBBXCIsXG4gIFwibmpjeVwiOlwiXFx1MDQ1QVwiLFxuICBcIm5sQXJyXCI6XCJcXHUyMUNEXCIsXG4gIFwibmxhcnJcIjpcIlxcdTIxOUFcIixcbiAgXCJubGRyXCI6XCJcXHUyMDI1XCIsXG4gIFwibmxFXCI6XCJcXHUyMjY2XFx1MDMzOFwiLFxuICBcIm5sZVwiOlwiXFx1MjI3MFwiLFxuICBcIm5MZWZ0YXJyb3dcIjpcIlxcdTIxQ0RcIixcbiAgXCJubGVmdGFycm93XCI6XCJcXHUyMTlBXCIsXG4gIFwibkxlZnRyaWdodGFycm93XCI6XCJcXHUyMUNFXCIsXG4gIFwibmxlZnRyaWdodGFycm93XCI6XCJcXHUyMUFFXCIsXG4gIFwibmxlcVwiOlwiXFx1MjI3MFwiLFxuICBcIm5sZXFxXCI6XCJcXHUyMjY2XFx1MDMzOFwiLFxuICBcIm5sZXFzbGFudFwiOlwiXFx1MkE3RFxcdTAzMzhcIixcbiAgXCJubGVzXCI6XCJcXHUyQTdEXFx1MDMzOFwiLFxuICBcIm5sZXNzXCI6XCJcXHUyMjZFXCIsXG4gIFwibkxsXCI6XCJcXHUyMkQ4XFx1MDMzOFwiLFxuICBcIm5sc2ltXCI6XCJcXHUyMjc0XCIsXG4gIFwibkx0XCI6XCJcXHUyMjZBXFx1MjBEMlwiLFxuICBcIm5sdFwiOlwiXFx1MjI2RVwiLFxuICBcIm5sdHJpXCI6XCJcXHUyMkVBXCIsXG4gIFwibmx0cmllXCI6XCJcXHUyMkVDXCIsXG4gIFwibkx0dlwiOlwiXFx1MjI2QVxcdTAzMzhcIixcbiAgXCJubWlkXCI6XCJcXHUyMjI0XCIsXG4gIFwiTm9CcmVha1wiOlwiXFx1MjA2MFwiLFxuICBcIk5vbkJyZWFraW5nU3BhY2VcIjpcIlxcdTAwQTBcIixcbiAgXCJOb3BmXCI6XCJcXHUyMTE1XCIsXG4gIFwibm9wZlwiOlwiXFx1RDgzNVxcdURENUZcIixcbiAgXCJOb3RcIjpcIlxcdTJBRUNcIixcbiAgXCJub3RcIjpcIlxcdTAwQUNcIixcbiAgXCJOb3RDb25ncnVlbnRcIjpcIlxcdTIyNjJcIixcbiAgXCJOb3RDdXBDYXBcIjpcIlxcdTIyNkRcIixcbiAgXCJOb3REb3VibGVWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNlwiLFxuICBcIk5vdEVsZW1lbnRcIjpcIlxcdTIyMDlcIixcbiAgXCJOb3RFcXVhbFwiOlwiXFx1MjI2MFwiLFxuICBcIk5vdEVxdWFsVGlsZGVcIjpcIlxcdTIyNDJcXHUwMzM4XCIsXG4gIFwiTm90RXhpc3RzXCI6XCJcXHUyMjA0XCIsXG4gIFwiTm90R3JlYXRlclwiOlwiXFx1MjI2RlwiLFxuICBcIk5vdEdyZWF0ZXJFcXVhbFwiOlwiXFx1MjI3MVwiLFxuICBcIk5vdEdyZWF0ZXJGdWxsRXF1YWxcIjpcIlxcdTIyNjdcXHUwMzM4XCIsXG4gIFwiTm90R3JlYXRlckdyZWF0ZXJcIjpcIlxcdTIyNkJcXHUwMzM4XCIsXG4gIFwiTm90R3JlYXRlckxlc3NcIjpcIlxcdTIyNzlcIixcbiAgXCJOb3RHcmVhdGVyU2xhbnRFcXVhbFwiOlwiXFx1MkE3RVxcdTAzMzhcIixcbiAgXCJOb3RHcmVhdGVyVGlsZGVcIjpcIlxcdTIyNzVcIixcbiAgXCJOb3RIdW1wRG93bkh1bXBcIjpcIlxcdTIyNEVcXHUwMzM4XCIsXG4gIFwiTm90SHVtcEVxdWFsXCI6XCJcXHUyMjRGXFx1MDMzOFwiLFxuICBcIm5vdGluXCI6XCJcXHUyMjA5XCIsXG4gIFwibm90aW5kb3RcIjpcIlxcdTIyRjVcXHUwMzM4XCIsXG4gIFwibm90aW5FXCI6XCJcXHUyMkY5XFx1MDMzOFwiLFxuICBcIm5vdGludmFcIjpcIlxcdTIyMDlcIixcbiAgXCJub3RpbnZiXCI6XCJcXHUyMkY3XCIsXG4gIFwibm90aW52Y1wiOlwiXFx1MjJGNlwiLFxuICBcIk5vdExlZnRUcmlhbmdsZVwiOlwiXFx1MjJFQVwiLFxuICBcIk5vdExlZnRUcmlhbmdsZUJhclwiOlwiXFx1MjlDRlxcdTAzMzhcIixcbiAgXCJOb3RMZWZ0VHJpYW5nbGVFcXVhbFwiOlwiXFx1MjJFQ1wiLFxuICBcIk5vdExlc3NcIjpcIlxcdTIyNkVcIixcbiAgXCJOb3RMZXNzRXF1YWxcIjpcIlxcdTIyNzBcIixcbiAgXCJOb3RMZXNzR3JlYXRlclwiOlwiXFx1MjI3OFwiLFxuICBcIk5vdExlc3NMZXNzXCI6XCJcXHUyMjZBXFx1MDMzOFwiLFxuICBcIk5vdExlc3NTbGFudEVxdWFsXCI6XCJcXHUyQTdEXFx1MDMzOFwiLFxuICBcIk5vdExlc3NUaWxkZVwiOlwiXFx1MjI3NFwiLFxuICBcIk5vdE5lc3RlZEdyZWF0ZXJHcmVhdGVyXCI6XCJcXHUyQUEyXFx1MDMzOFwiLFxuICBcIk5vdE5lc3RlZExlc3NMZXNzXCI6XCJcXHUyQUExXFx1MDMzOFwiLFxuICBcIm5vdG5pXCI6XCJcXHUyMjBDXCIsXG4gIFwibm90bml2YVwiOlwiXFx1MjIwQ1wiLFxuICBcIm5vdG5pdmJcIjpcIlxcdTIyRkVcIixcbiAgXCJub3RuaXZjXCI6XCJcXHUyMkZEXCIsXG4gIFwiTm90UHJlY2VkZXNcIjpcIlxcdTIyODBcIixcbiAgXCJOb3RQcmVjZWRlc0VxdWFsXCI6XCJcXHUyQUFGXFx1MDMzOFwiLFxuICBcIk5vdFByZWNlZGVzU2xhbnRFcXVhbFwiOlwiXFx1MjJFMFwiLFxuICBcIk5vdFJldmVyc2VFbGVtZW50XCI6XCJcXHUyMjBDXCIsXG4gIFwiTm90UmlnaHRUcmlhbmdsZVwiOlwiXFx1MjJFQlwiLFxuICBcIk5vdFJpZ2h0VHJpYW5nbGVCYXJcIjpcIlxcdTI5RDBcXHUwMzM4XCIsXG4gIFwiTm90UmlnaHRUcmlhbmdsZUVxdWFsXCI6XCJcXHUyMkVEXCIsXG4gIFwiTm90U3F1YXJlU3Vic2V0XCI6XCJcXHUyMjhGXFx1MDMzOFwiLFxuICBcIk5vdFNxdWFyZVN1YnNldEVxdWFsXCI6XCJcXHUyMkUyXCIsXG4gIFwiTm90U3F1YXJlU3VwZXJzZXRcIjpcIlxcdTIyOTBcXHUwMzM4XCIsXG4gIFwiTm90U3F1YXJlU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjJFM1wiLFxuICBcIk5vdFN1YnNldFwiOlwiXFx1MjI4MlxcdTIwRDJcIixcbiAgXCJOb3RTdWJzZXRFcXVhbFwiOlwiXFx1MjI4OFwiLFxuICBcIk5vdFN1Y2NlZWRzXCI6XCJcXHUyMjgxXCIsXG4gIFwiTm90U3VjY2VlZHNFcXVhbFwiOlwiXFx1MkFCMFxcdTAzMzhcIixcbiAgXCJOb3RTdWNjZWVkc1NsYW50RXF1YWxcIjpcIlxcdTIyRTFcIixcbiAgXCJOb3RTdWNjZWVkc1RpbGRlXCI6XCJcXHUyMjdGXFx1MDMzOFwiLFxuICBcIk5vdFN1cGVyc2V0XCI6XCJcXHUyMjgzXFx1MjBEMlwiLFxuICBcIk5vdFN1cGVyc2V0RXF1YWxcIjpcIlxcdTIyODlcIixcbiAgXCJOb3RUaWxkZVwiOlwiXFx1MjI0MVwiLFxuICBcIk5vdFRpbGRlRXF1YWxcIjpcIlxcdTIyNDRcIixcbiAgXCJOb3RUaWxkZUZ1bGxFcXVhbFwiOlwiXFx1MjI0N1wiLFxuICBcIk5vdFRpbGRlVGlsZGVcIjpcIlxcdTIyNDlcIixcbiAgXCJOb3RWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNFwiLFxuICBcIm5wYXJcIjpcIlxcdTIyMjZcIixcbiAgXCJucGFyYWxsZWxcIjpcIlxcdTIyMjZcIixcbiAgXCJucGFyc2xcIjpcIlxcdTJBRkRcXHUyMEU1XCIsXG4gIFwibnBhcnRcIjpcIlxcdTIyMDJcXHUwMzM4XCIsXG4gIFwibnBvbGludFwiOlwiXFx1MkExNFwiLFxuICBcIm5wclwiOlwiXFx1MjI4MFwiLFxuICBcIm5wcmN1ZVwiOlwiXFx1MjJFMFwiLFxuICBcIm5wcmVcIjpcIlxcdTJBQUZcXHUwMzM4XCIsXG4gIFwibnByZWNcIjpcIlxcdTIyODBcIixcbiAgXCJucHJlY2VxXCI6XCJcXHUyQUFGXFx1MDMzOFwiLFxuICBcIm5yQXJyXCI6XCJcXHUyMUNGXCIsXG4gIFwibnJhcnJcIjpcIlxcdTIxOUJcIixcbiAgXCJucmFycmNcIjpcIlxcdTI5MzNcXHUwMzM4XCIsXG4gIFwibnJhcnJ3XCI6XCJcXHUyMTlEXFx1MDMzOFwiLFxuICBcIm5SaWdodGFycm93XCI6XCJcXHUyMUNGXCIsXG4gIFwibnJpZ2h0YXJyb3dcIjpcIlxcdTIxOUJcIixcbiAgXCJucnRyaVwiOlwiXFx1MjJFQlwiLFxuICBcIm5ydHJpZVwiOlwiXFx1MjJFRFwiLFxuICBcIm5zY1wiOlwiXFx1MjI4MVwiLFxuICBcIm5zY2N1ZVwiOlwiXFx1MjJFMVwiLFxuICBcIm5zY2VcIjpcIlxcdTJBQjBcXHUwMzM4XCIsXG4gIFwiTnNjclwiOlwiXFx1RDgzNVxcdURDQTlcIixcbiAgXCJuc2NyXCI6XCJcXHVEODM1XFx1RENDM1wiLFxuICBcIm5zaG9ydG1pZFwiOlwiXFx1MjIyNFwiLFxuICBcIm5zaG9ydHBhcmFsbGVsXCI6XCJcXHUyMjI2XCIsXG4gIFwibnNpbVwiOlwiXFx1MjI0MVwiLFxuICBcIm5zaW1lXCI6XCJcXHUyMjQ0XCIsXG4gIFwibnNpbWVxXCI6XCJcXHUyMjQ0XCIsXG4gIFwibnNtaWRcIjpcIlxcdTIyMjRcIixcbiAgXCJuc3BhclwiOlwiXFx1MjIyNlwiLFxuICBcIm5zcXN1YmVcIjpcIlxcdTIyRTJcIixcbiAgXCJuc3FzdXBlXCI6XCJcXHUyMkUzXCIsXG4gIFwibnN1YlwiOlwiXFx1MjI4NFwiLFxuICBcIm5zdWJFXCI6XCJcXHUyQUM1XFx1MDMzOFwiLFxuICBcIm5zdWJlXCI6XCJcXHUyMjg4XCIsXG4gIFwibnN1YnNldFwiOlwiXFx1MjI4MlxcdTIwRDJcIixcbiAgXCJuc3Vic2V0ZXFcIjpcIlxcdTIyODhcIixcbiAgXCJuc3Vic2V0ZXFxXCI6XCJcXHUyQUM1XFx1MDMzOFwiLFxuICBcIm5zdWNjXCI6XCJcXHUyMjgxXCIsXG4gIFwibnN1Y2NlcVwiOlwiXFx1MkFCMFxcdTAzMzhcIixcbiAgXCJuc3VwXCI6XCJcXHUyMjg1XCIsXG4gIFwibnN1cEVcIjpcIlxcdTJBQzZcXHUwMzM4XCIsXG4gIFwibnN1cGVcIjpcIlxcdTIyODlcIixcbiAgXCJuc3Vwc2V0XCI6XCJcXHUyMjgzXFx1MjBEMlwiLFxuICBcIm5zdXBzZXRlcVwiOlwiXFx1MjI4OVwiLFxuICBcIm5zdXBzZXRlcXFcIjpcIlxcdTJBQzZcXHUwMzM4XCIsXG4gIFwibnRnbFwiOlwiXFx1MjI3OVwiLFxuICBcIk50aWxkZVwiOlwiXFx1MDBEMVwiLFxuICBcIm50aWxkZVwiOlwiXFx1MDBGMVwiLFxuICBcIm50bGdcIjpcIlxcdTIyNzhcIixcbiAgXCJudHJpYW5nbGVsZWZ0XCI6XCJcXHUyMkVBXCIsXG4gIFwibnRyaWFuZ2xlbGVmdGVxXCI6XCJcXHUyMkVDXCIsXG4gIFwibnRyaWFuZ2xlcmlnaHRcIjpcIlxcdTIyRUJcIixcbiAgXCJudHJpYW5nbGVyaWdodGVxXCI6XCJcXHUyMkVEXCIsXG4gIFwiTnVcIjpcIlxcdTAzOURcIixcbiAgXCJudVwiOlwiXFx1MDNCRFwiLFxuICBcIm51bVwiOlwiXFx1MDAyM1wiLFxuICBcIm51bWVyb1wiOlwiXFx1MjExNlwiLFxuICBcIm51bXNwXCI6XCJcXHUyMDA3XCIsXG4gIFwibnZhcFwiOlwiXFx1MjI0RFxcdTIwRDJcIixcbiAgXCJuVkRhc2hcIjpcIlxcdTIyQUZcIixcbiAgXCJuVmRhc2hcIjpcIlxcdTIyQUVcIixcbiAgXCJudkRhc2hcIjpcIlxcdTIyQURcIixcbiAgXCJudmRhc2hcIjpcIlxcdTIyQUNcIixcbiAgXCJudmdlXCI6XCJcXHUyMjY1XFx1MjBEMlwiLFxuICBcIm52Z3RcIjpcIlxcdTAwM0VcXHUyMEQyXCIsXG4gIFwibnZIYXJyXCI6XCJcXHUyOTA0XCIsXG4gIFwibnZpbmZpblwiOlwiXFx1MjlERVwiLFxuICBcIm52bEFyclwiOlwiXFx1MjkwMlwiLFxuICBcIm52bGVcIjpcIlxcdTIyNjRcXHUyMEQyXCIsXG4gIFwibnZsdFwiOlwiXFx1MDAzQ1xcdTIwRDJcIixcbiAgXCJudmx0cmllXCI6XCJcXHUyMkI0XFx1MjBEMlwiLFxuICBcIm52ckFyclwiOlwiXFx1MjkwM1wiLFxuICBcIm52cnRyaWVcIjpcIlxcdTIyQjVcXHUyMEQyXCIsXG4gIFwibnZzaW1cIjpcIlxcdTIyM0NcXHUyMEQyXCIsXG4gIFwibndhcmhrXCI6XCJcXHUyOTIzXCIsXG4gIFwibndBcnJcIjpcIlxcdTIxRDZcIixcbiAgXCJud2FyclwiOlwiXFx1MjE5NlwiLFxuICBcIm53YXJyb3dcIjpcIlxcdTIxOTZcIixcbiAgXCJud25lYXJcIjpcIlxcdTI5MjdcIixcbiAgXCJPYWN1dGVcIjpcIlxcdTAwRDNcIixcbiAgXCJvYWN1dGVcIjpcIlxcdTAwRjNcIixcbiAgXCJvYXN0XCI6XCJcXHUyMjlCXCIsXG4gIFwib2NpclwiOlwiXFx1MjI5QVwiLFxuICBcIk9jaXJjXCI6XCJcXHUwMEQ0XCIsXG4gIFwib2NpcmNcIjpcIlxcdTAwRjRcIixcbiAgXCJPY3lcIjpcIlxcdTA0MUVcIixcbiAgXCJvY3lcIjpcIlxcdTA0M0VcIixcbiAgXCJvZGFzaFwiOlwiXFx1MjI5RFwiLFxuICBcIk9kYmxhY1wiOlwiXFx1MDE1MFwiLFxuICBcIm9kYmxhY1wiOlwiXFx1MDE1MVwiLFxuICBcIm9kaXZcIjpcIlxcdTJBMzhcIixcbiAgXCJvZG90XCI6XCJcXHUyMjk5XCIsXG4gIFwib2Rzb2xkXCI6XCJcXHUyOUJDXCIsXG4gIFwiT0VsaWdcIjpcIlxcdTAxNTJcIixcbiAgXCJvZWxpZ1wiOlwiXFx1MDE1M1wiLFxuICBcIm9mY2lyXCI6XCJcXHUyOUJGXCIsXG4gIFwiT2ZyXCI6XCJcXHVEODM1XFx1REQxMlwiLFxuICBcIm9mclwiOlwiXFx1RDgzNVxcdUREMkNcIixcbiAgXCJvZ29uXCI6XCJcXHUwMkRCXCIsXG4gIFwiT2dyYXZlXCI6XCJcXHUwMEQyXCIsXG4gIFwib2dyYXZlXCI6XCJcXHUwMEYyXCIsXG4gIFwib2d0XCI6XCJcXHUyOUMxXCIsXG4gIFwib2hiYXJcIjpcIlxcdTI5QjVcIixcbiAgXCJvaG1cIjpcIlxcdTAzQTlcIixcbiAgXCJvaW50XCI6XCJcXHUyMjJFXCIsXG4gIFwib2xhcnJcIjpcIlxcdTIxQkFcIixcbiAgXCJvbGNpclwiOlwiXFx1MjlCRVwiLFxuICBcIm9sY3Jvc3NcIjpcIlxcdTI5QkJcIixcbiAgXCJvbGluZVwiOlwiXFx1MjAzRVwiLFxuICBcIm9sdFwiOlwiXFx1MjlDMFwiLFxuICBcIk9tYWNyXCI6XCJcXHUwMTRDXCIsXG4gIFwib21hY3JcIjpcIlxcdTAxNERcIixcbiAgXCJPbWVnYVwiOlwiXFx1MDNBOVwiLFxuICBcIm9tZWdhXCI6XCJcXHUwM0M5XCIsXG4gIFwiT21pY3JvblwiOlwiXFx1MDM5RlwiLFxuICBcIm9taWNyb25cIjpcIlxcdTAzQkZcIixcbiAgXCJvbWlkXCI6XCJcXHUyOUI2XCIsXG4gIFwib21pbnVzXCI6XCJcXHUyMjk2XCIsXG4gIFwiT29wZlwiOlwiXFx1RDgzNVxcdURENDZcIixcbiAgXCJvb3BmXCI6XCJcXHVEODM1XFx1REQ2MFwiLFxuICBcIm9wYXJcIjpcIlxcdTI5QjdcIixcbiAgXCJPcGVuQ3VybHlEb3VibGVRdW90ZVwiOlwiXFx1MjAxQ1wiLFxuICBcIk9wZW5DdXJseVF1b3RlXCI6XCJcXHUyMDE4XCIsXG4gIFwib3BlcnBcIjpcIlxcdTI5QjlcIixcbiAgXCJvcGx1c1wiOlwiXFx1MjI5NVwiLFxuICBcIk9yXCI6XCJcXHUyQTU0XCIsXG4gIFwib3JcIjpcIlxcdTIyMjhcIixcbiAgXCJvcmFyclwiOlwiXFx1MjFCQlwiLFxuICBcIm9yZFwiOlwiXFx1MkE1RFwiLFxuICBcIm9yZGVyXCI6XCJcXHUyMTM0XCIsXG4gIFwib3JkZXJvZlwiOlwiXFx1MjEzNFwiLFxuICBcIm9yZGZcIjpcIlxcdTAwQUFcIixcbiAgXCJvcmRtXCI6XCJcXHUwMEJBXCIsXG4gIFwib3JpZ29mXCI6XCJcXHUyMkI2XCIsXG4gIFwib3JvclwiOlwiXFx1MkE1NlwiLFxuICBcIm9yc2xvcGVcIjpcIlxcdTJBNTdcIixcbiAgXCJvcnZcIjpcIlxcdTJBNUJcIixcbiAgXCJvU1wiOlwiXFx1MjRDOFwiLFxuICBcIk9zY3JcIjpcIlxcdUQ4MzVcXHVEQ0FBXCIsXG4gIFwib3NjclwiOlwiXFx1MjEzNFwiLFxuICBcIk9zbGFzaFwiOlwiXFx1MDBEOFwiLFxuICBcIm9zbGFzaFwiOlwiXFx1MDBGOFwiLFxuICBcIm9zb2xcIjpcIlxcdTIyOThcIixcbiAgXCJPdGlsZGVcIjpcIlxcdTAwRDVcIixcbiAgXCJvdGlsZGVcIjpcIlxcdTAwRjVcIixcbiAgXCJPdGltZXNcIjpcIlxcdTJBMzdcIixcbiAgXCJvdGltZXNcIjpcIlxcdTIyOTdcIixcbiAgXCJvdGltZXNhc1wiOlwiXFx1MkEzNlwiLFxuICBcIk91bWxcIjpcIlxcdTAwRDZcIixcbiAgXCJvdW1sXCI6XCJcXHUwMEY2XCIsXG4gIFwib3ZiYXJcIjpcIlxcdTIzM0RcIixcbiAgXCJPdmVyQmFyXCI6XCJcXHUyMDNFXCIsXG4gIFwiT3ZlckJyYWNlXCI6XCJcXHUyM0RFXCIsXG4gIFwiT3ZlckJyYWNrZXRcIjpcIlxcdTIzQjRcIixcbiAgXCJPdmVyUGFyZW50aGVzaXNcIjpcIlxcdTIzRENcIixcbiAgXCJwYXJcIjpcIlxcdTIyMjVcIixcbiAgXCJwYXJhXCI6XCJcXHUwMEI2XCIsXG4gIFwicGFyYWxsZWxcIjpcIlxcdTIyMjVcIixcbiAgXCJwYXJzaW1cIjpcIlxcdTJBRjNcIixcbiAgXCJwYXJzbFwiOlwiXFx1MkFGRFwiLFxuICBcInBhcnRcIjpcIlxcdTIyMDJcIixcbiAgXCJQYXJ0aWFsRFwiOlwiXFx1MjIwMlwiLFxuICBcIlBjeVwiOlwiXFx1MDQxRlwiLFxuICBcInBjeVwiOlwiXFx1MDQzRlwiLFxuICBcInBlcmNudFwiOlwiXFx1MDAyNVwiLFxuICBcInBlcmlvZFwiOlwiXFx1MDAyRVwiLFxuICBcInBlcm1pbFwiOlwiXFx1MjAzMFwiLFxuICBcInBlcnBcIjpcIlxcdTIyQTVcIixcbiAgXCJwZXJ0ZW5rXCI6XCJcXHUyMDMxXCIsXG4gIFwiUGZyXCI6XCJcXHVEODM1XFx1REQxM1wiLFxuICBcInBmclwiOlwiXFx1RDgzNVxcdUREMkRcIixcbiAgXCJQaGlcIjpcIlxcdTAzQTZcIixcbiAgXCJwaGlcIjpcIlxcdTAzQzZcIixcbiAgXCJwaGl2XCI6XCJcXHUwM0Q1XCIsXG4gIFwicGhtbWF0XCI6XCJcXHUyMTMzXCIsXG4gIFwicGhvbmVcIjpcIlxcdTI2MEVcIixcbiAgXCJQaVwiOlwiXFx1MDNBMFwiLFxuICBcInBpXCI6XCJcXHUwM0MwXCIsXG4gIFwicGl0Y2hmb3JrXCI6XCJcXHUyMkQ0XCIsXG4gIFwicGl2XCI6XCJcXHUwM0Q2XCIsXG4gIFwicGxhbmNrXCI6XCJcXHUyMTBGXCIsXG4gIFwicGxhbmNraFwiOlwiXFx1MjEwRVwiLFxuICBcInBsYW5rdlwiOlwiXFx1MjEwRlwiLFxuICBcInBsdXNcIjpcIlxcdTAwMkJcIixcbiAgXCJwbHVzYWNpclwiOlwiXFx1MkEyM1wiLFxuICBcInBsdXNiXCI6XCJcXHUyMjlFXCIsXG4gIFwicGx1c2NpclwiOlwiXFx1MkEyMlwiLFxuICBcInBsdXNkb1wiOlwiXFx1MjIxNFwiLFxuICBcInBsdXNkdVwiOlwiXFx1MkEyNVwiLFxuICBcInBsdXNlXCI6XCJcXHUyQTcyXCIsXG4gIFwiUGx1c01pbnVzXCI6XCJcXHUwMEIxXCIsXG4gIFwicGx1c21uXCI6XCJcXHUwMEIxXCIsXG4gIFwicGx1c3NpbVwiOlwiXFx1MkEyNlwiLFxuICBcInBsdXN0d29cIjpcIlxcdTJBMjdcIixcbiAgXCJwbVwiOlwiXFx1MDBCMVwiLFxuICBcIlBvaW5jYXJlcGxhbmVcIjpcIlxcdTIxMENcIixcbiAgXCJwb2ludGludFwiOlwiXFx1MkExNVwiLFxuICBcIlBvcGZcIjpcIlxcdTIxMTlcIixcbiAgXCJwb3BmXCI6XCJcXHVEODM1XFx1REQ2MVwiLFxuICBcInBvdW5kXCI6XCJcXHUwMEEzXCIsXG4gIFwiUHJcIjpcIlxcdTJBQkJcIixcbiAgXCJwclwiOlwiXFx1MjI3QVwiLFxuICBcInByYXBcIjpcIlxcdTJBQjdcIixcbiAgXCJwcmN1ZVwiOlwiXFx1MjI3Q1wiLFxuICBcInByRVwiOlwiXFx1MkFCM1wiLFxuICBcInByZVwiOlwiXFx1MkFBRlwiLFxuICBcInByZWNcIjpcIlxcdTIyN0FcIixcbiAgXCJwcmVjYXBwcm94XCI6XCJcXHUyQUI3XCIsXG4gIFwicHJlY2N1cmx5ZXFcIjpcIlxcdTIyN0NcIixcbiAgXCJQcmVjZWRlc1wiOlwiXFx1MjI3QVwiLFxuICBcIlByZWNlZGVzRXF1YWxcIjpcIlxcdTJBQUZcIixcbiAgXCJQcmVjZWRlc1NsYW50RXF1YWxcIjpcIlxcdTIyN0NcIixcbiAgXCJQcmVjZWRlc1RpbGRlXCI6XCJcXHUyMjdFXCIsXG4gIFwicHJlY2VxXCI6XCJcXHUyQUFGXCIsXG4gIFwicHJlY25hcHByb3hcIjpcIlxcdTJBQjlcIixcbiAgXCJwcmVjbmVxcVwiOlwiXFx1MkFCNVwiLFxuICBcInByZWNuc2ltXCI6XCJcXHUyMkU4XCIsXG4gIFwicHJlY3NpbVwiOlwiXFx1MjI3RVwiLFxuICBcIlByaW1lXCI6XCJcXHUyMDMzXCIsXG4gIFwicHJpbWVcIjpcIlxcdTIwMzJcIixcbiAgXCJwcmltZXNcIjpcIlxcdTIxMTlcIixcbiAgXCJwcm5hcFwiOlwiXFx1MkFCOVwiLFxuICBcInBybkVcIjpcIlxcdTJBQjVcIixcbiAgXCJwcm5zaW1cIjpcIlxcdTIyRThcIixcbiAgXCJwcm9kXCI6XCJcXHUyMjBGXCIsXG4gIFwiUHJvZHVjdFwiOlwiXFx1MjIwRlwiLFxuICBcInByb2ZhbGFyXCI6XCJcXHUyMzJFXCIsXG4gIFwicHJvZmxpbmVcIjpcIlxcdTIzMTJcIixcbiAgXCJwcm9mc3VyZlwiOlwiXFx1MjMxM1wiLFxuICBcInByb3BcIjpcIlxcdTIyMURcIixcbiAgXCJQcm9wb3J0aW9uXCI6XCJcXHUyMjM3XCIsXG4gIFwiUHJvcG9ydGlvbmFsXCI6XCJcXHUyMjFEXCIsXG4gIFwicHJvcHRvXCI6XCJcXHUyMjFEXCIsXG4gIFwicHJzaW1cIjpcIlxcdTIyN0VcIixcbiAgXCJwcnVyZWxcIjpcIlxcdTIyQjBcIixcbiAgXCJQc2NyXCI6XCJcXHVEODM1XFx1RENBQlwiLFxuICBcInBzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M1XCIsXG4gIFwiUHNpXCI6XCJcXHUwM0E4XCIsXG4gIFwicHNpXCI6XCJcXHUwM0M4XCIsXG4gIFwicHVuY3NwXCI6XCJcXHUyMDA4XCIsXG4gIFwiUWZyXCI6XCJcXHVEODM1XFx1REQxNFwiLFxuICBcInFmclwiOlwiXFx1RDgzNVxcdUREMkVcIixcbiAgXCJxaW50XCI6XCJcXHUyQTBDXCIsXG4gIFwiUW9wZlwiOlwiXFx1MjExQVwiLFxuICBcInFvcGZcIjpcIlxcdUQ4MzVcXHVERDYyXCIsXG4gIFwicXByaW1lXCI6XCJcXHUyMDU3XCIsXG4gIFwiUXNjclwiOlwiXFx1RDgzNVxcdURDQUNcIixcbiAgXCJxc2NyXCI6XCJcXHVEODM1XFx1RENDNlwiLFxuICBcInF1YXRlcm5pb25zXCI6XCJcXHUyMTBEXCIsXG4gIFwicXVhdGludFwiOlwiXFx1MkExNlwiLFxuICBcInF1ZXN0XCI6XCJcXHUwMDNGXCIsXG4gIFwicXVlc3RlcVwiOlwiXFx1MjI1RlwiLFxuICBcIlFVT1RcIjpcIlxcdTAwMjJcIixcbiAgXCJxdW90XCI6XCJcXHUwMDIyXCIsXG4gIFwickFhcnJcIjpcIlxcdTIxREJcIixcbiAgXCJyYWNlXCI6XCJcXHUyMjNEXFx1MDMzMVwiLFxuICBcIlJhY3V0ZVwiOlwiXFx1MDE1NFwiLFxuICBcInJhY3V0ZVwiOlwiXFx1MDE1NVwiLFxuICBcInJhZGljXCI6XCJcXHUyMjFBXCIsXG4gIFwicmFlbXB0eXZcIjpcIlxcdTI5QjNcIixcbiAgXCJSYW5nXCI6XCJcXHUyN0VCXCIsXG4gIFwicmFuZ1wiOlwiXFx1MjdFOVwiLFxuICBcInJhbmdkXCI6XCJcXHUyOTkyXCIsXG4gIFwicmFuZ2VcIjpcIlxcdTI5QTVcIixcbiAgXCJyYW5nbGVcIjpcIlxcdTI3RTlcIixcbiAgXCJyYXF1b1wiOlwiXFx1MDBCQlwiLFxuICBcIlJhcnJcIjpcIlxcdTIxQTBcIixcbiAgXCJyQXJyXCI6XCJcXHUyMUQyXCIsXG4gIFwicmFyclwiOlwiXFx1MjE5MlwiLFxuICBcInJhcnJhcFwiOlwiXFx1Mjk3NVwiLFxuICBcInJhcnJiXCI6XCJcXHUyMUU1XCIsXG4gIFwicmFycmJmc1wiOlwiXFx1MjkyMFwiLFxuICBcInJhcnJjXCI6XCJcXHUyOTMzXCIsXG4gIFwicmFycmZzXCI6XCJcXHUyOTFFXCIsXG4gIFwicmFycmhrXCI6XCJcXHUyMUFBXCIsXG4gIFwicmFycmxwXCI6XCJcXHUyMUFDXCIsXG4gIFwicmFycnBsXCI6XCJcXHUyOTQ1XCIsXG4gIFwicmFycnNpbVwiOlwiXFx1Mjk3NFwiLFxuICBcIlJhcnJ0bFwiOlwiXFx1MjkxNlwiLFxuICBcInJhcnJ0bFwiOlwiXFx1MjFBM1wiLFxuICBcInJhcnJ3XCI6XCJcXHUyMTlEXCIsXG4gIFwickF0YWlsXCI6XCJcXHUyOTFDXCIsXG4gIFwicmF0YWlsXCI6XCJcXHUyOTFBXCIsXG4gIFwicmF0aW9cIjpcIlxcdTIyMzZcIixcbiAgXCJyYXRpb25hbHNcIjpcIlxcdTIxMUFcIixcbiAgXCJSQmFyclwiOlwiXFx1MjkxMFwiLFxuICBcInJCYXJyXCI6XCJcXHUyOTBGXCIsXG4gIFwicmJhcnJcIjpcIlxcdTI5MERcIixcbiAgXCJyYmJya1wiOlwiXFx1Mjc3M1wiLFxuICBcInJicmFjZVwiOlwiXFx1MDA3RFwiLFxuICBcInJicmFja1wiOlwiXFx1MDA1RFwiLFxuICBcInJicmtlXCI6XCJcXHUyOThDXCIsXG4gIFwicmJya3NsZFwiOlwiXFx1Mjk4RVwiLFxuICBcInJicmtzbHVcIjpcIlxcdTI5OTBcIixcbiAgXCJSY2Fyb25cIjpcIlxcdTAxNThcIixcbiAgXCJyY2Fyb25cIjpcIlxcdTAxNTlcIixcbiAgXCJSY2VkaWxcIjpcIlxcdTAxNTZcIixcbiAgXCJyY2VkaWxcIjpcIlxcdTAxNTdcIixcbiAgXCJyY2VpbFwiOlwiXFx1MjMwOVwiLFxuICBcInJjdWJcIjpcIlxcdTAwN0RcIixcbiAgXCJSY3lcIjpcIlxcdTA0MjBcIixcbiAgXCJyY3lcIjpcIlxcdTA0NDBcIixcbiAgXCJyZGNhXCI6XCJcXHUyOTM3XCIsXG4gIFwicmRsZGhhclwiOlwiXFx1Mjk2OVwiLFxuICBcInJkcXVvXCI6XCJcXHUyMDFEXCIsXG4gIFwicmRxdW9yXCI6XCJcXHUyMDFEXCIsXG4gIFwicmRzaFwiOlwiXFx1MjFCM1wiLFxuICBcIlJlXCI6XCJcXHUyMTFDXCIsXG4gIFwicmVhbFwiOlwiXFx1MjExQ1wiLFxuICBcInJlYWxpbmVcIjpcIlxcdTIxMUJcIixcbiAgXCJyZWFscGFydFwiOlwiXFx1MjExQ1wiLFxuICBcInJlYWxzXCI6XCJcXHUyMTFEXCIsXG4gIFwicmVjdFwiOlwiXFx1MjVBRFwiLFxuICBcIlJFR1wiOlwiXFx1MDBBRVwiLFxuICBcInJlZ1wiOlwiXFx1MDBBRVwiLFxuICBcIlJldmVyc2VFbGVtZW50XCI6XCJcXHUyMjBCXCIsXG4gIFwiUmV2ZXJzZUVxdWlsaWJyaXVtXCI6XCJcXHUyMUNCXCIsXG4gIFwiUmV2ZXJzZVVwRXF1aWxpYnJpdW1cIjpcIlxcdTI5NkZcIixcbiAgXCJyZmlzaHRcIjpcIlxcdTI5N0RcIixcbiAgXCJyZmxvb3JcIjpcIlxcdTIzMEJcIixcbiAgXCJSZnJcIjpcIlxcdTIxMUNcIixcbiAgXCJyZnJcIjpcIlxcdUQ4MzVcXHVERDJGXCIsXG4gIFwickhhclwiOlwiXFx1Mjk2NFwiLFxuICBcInJoYXJkXCI6XCJcXHUyMUMxXCIsXG4gIFwicmhhcnVcIjpcIlxcdTIxQzBcIixcbiAgXCJyaGFydWxcIjpcIlxcdTI5NkNcIixcbiAgXCJSaG9cIjpcIlxcdTAzQTFcIixcbiAgXCJyaG9cIjpcIlxcdTAzQzFcIixcbiAgXCJyaG92XCI6XCJcXHUwM0YxXCIsXG4gIFwiUmlnaHRBbmdsZUJyYWNrZXRcIjpcIlxcdTI3RTlcIixcbiAgXCJSaWdodEFycm93XCI6XCJcXHUyMTkyXCIsXG4gIFwiUmlnaHRhcnJvd1wiOlwiXFx1MjFEMlwiLFxuICBcInJpZ2h0YXJyb3dcIjpcIlxcdTIxOTJcIixcbiAgXCJSaWdodEFycm93QmFyXCI6XCJcXHUyMUU1XCIsXG4gIFwiUmlnaHRBcnJvd0xlZnRBcnJvd1wiOlwiXFx1MjFDNFwiLFxuICBcInJpZ2h0YXJyb3d0YWlsXCI6XCJcXHUyMUEzXCIsXG4gIFwiUmlnaHRDZWlsaW5nXCI6XCJcXHUyMzA5XCIsXG4gIFwiUmlnaHREb3VibGVCcmFja2V0XCI6XCJcXHUyN0U3XCIsXG4gIFwiUmlnaHREb3duVGVlVmVjdG9yXCI6XCJcXHUyOTVEXCIsXG4gIFwiUmlnaHREb3duVmVjdG9yXCI6XCJcXHUyMUMyXCIsXG4gIFwiUmlnaHREb3duVmVjdG9yQmFyXCI6XCJcXHUyOTU1XCIsXG4gIFwiUmlnaHRGbG9vclwiOlwiXFx1MjMwQlwiLFxuICBcInJpZ2h0aGFycG9vbmRvd25cIjpcIlxcdTIxQzFcIixcbiAgXCJyaWdodGhhcnBvb251cFwiOlwiXFx1MjFDMFwiLFxuICBcInJpZ2h0bGVmdGFycm93c1wiOlwiXFx1MjFDNFwiLFxuICBcInJpZ2h0bGVmdGhhcnBvb25zXCI6XCJcXHUyMUNDXCIsXG4gIFwicmlnaHRyaWdodGFycm93c1wiOlwiXFx1MjFDOVwiLFxuICBcInJpZ2h0c3F1aWdhcnJvd1wiOlwiXFx1MjE5RFwiLFxuICBcIlJpZ2h0VGVlXCI6XCJcXHUyMkEyXCIsXG4gIFwiUmlnaHRUZWVBcnJvd1wiOlwiXFx1MjFBNlwiLFxuICBcIlJpZ2h0VGVlVmVjdG9yXCI6XCJcXHUyOTVCXCIsXG4gIFwicmlnaHR0aHJlZXRpbWVzXCI6XCJcXHUyMkNDXCIsXG4gIFwiUmlnaHRUcmlhbmdsZVwiOlwiXFx1MjJCM1wiLFxuICBcIlJpZ2h0VHJpYW5nbGVCYXJcIjpcIlxcdTI5RDBcIixcbiAgXCJSaWdodFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyQjVcIixcbiAgXCJSaWdodFVwRG93blZlY3RvclwiOlwiXFx1Mjk0RlwiLFxuICBcIlJpZ2h0VXBUZWVWZWN0b3JcIjpcIlxcdTI5NUNcIixcbiAgXCJSaWdodFVwVmVjdG9yXCI6XCJcXHUyMUJFXCIsXG4gIFwiUmlnaHRVcFZlY3RvckJhclwiOlwiXFx1Mjk1NFwiLFxuICBcIlJpZ2h0VmVjdG9yXCI6XCJcXHUyMUMwXCIsXG4gIFwiUmlnaHRWZWN0b3JCYXJcIjpcIlxcdTI5NTNcIixcbiAgXCJyaW5nXCI6XCJcXHUwMkRBXCIsXG4gIFwicmlzaW5nZG90c2VxXCI6XCJcXHUyMjUzXCIsXG4gIFwicmxhcnJcIjpcIlxcdTIxQzRcIixcbiAgXCJybGhhclwiOlwiXFx1MjFDQ1wiLFxuICBcInJsbVwiOlwiXFx1MjAwRlwiLFxuICBcInJtb3VzdFwiOlwiXFx1MjNCMVwiLFxuICBcInJtb3VzdGFjaGVcIjpcIlxcdTIzQjFcIixcbiAgXCJybm1pZFwiOlwiXFx1MkFFRVwiLFxuICBcInJvYW5nXCI6XCJcXHUyN0VEXCIsXG4gIFwicm9hcnJcIjpcIlxcdTIxRkVcIixcbiAgXCJyb2Jya1wiOlwiXFx1MjdFN1wiLFxuICBcInJvcGFyXCI6XCJcXHUyOTg2XCIsXG4gIFwiUm9wZlwiOlwiXFx1MjExRFwiLFxuICBcInJvcGZcIjpcIlxcdUQ4MzVcXHVERDYzXCIsXG4gIFwicm9wbHVzXCI6XCJcXHUyQTJFXCIsXG4gIFwicm90aW1lc1wiOlwiXFx1MkEzNVwiLFxuICBcIlJvdW5kSW1wbGllc1wiOlwiXFx1Mjk3MFwiLFxuICBcInJwYXJcIjpcIlxcdTAwMjlcIixcbiAgXCJycGFyZ3RcIjpcIlxcdTI5OTRcIixcbiAgXCJycHBvbGludFwiOlwiXFx1MkExMlwiLFxuICBcInJyYXJyXCI6XCJcXHUyMUM5XCIsXG4gIFwiUnJpZ2h0YXJyb3dcIjpcIlxcdTIxREJcIixcbiAgXCJyc2FxdW9cIjpcIlxcdTIwM0FcIixcbiAgXCJSc2NyXCI6XCJcXHUyMTFCXCIsXG4gIFwicnNjclwiOlwiXFx1RDgzNVxcdURDQzdcIixcbiAgXCJSc2hcIjpcIlxcdTIxQjFcIixcbiAgXCJyc2hcIjpcIlxcdTIxQjFcIixcbiAgXCJyc3FiXCI6XCJcXHUwMDVEXCIsXG4gIFwicnNxdW9cIjpcIlxcdTIwMTlcIixcbiAgXCJyc3F1b3JcIjpcIlxcdTIwMTlcIixcbiAgXCJydGhyZWVcIjpcIlxcdTIyQ0NcIixcbiAgXCJydGltZXNcIjpcIlxcdTIyQ0FcIixcbiAgXCJydHJpXCI6XCJcXHUyNUI5XCIsXG4gIFwicnRyaWVcIjpcIlxcdTIyQjVcIixcbiAgXCJydHJpZlwiOlwiXFx1MjVCOFwiLFxuICBcInJ0cmlsdHJpXCI6XCJcXHUyOUNFXCIsXG4gIFwiUnVsZURlbGF5ZWRcIjpcIlxcdTI5RjRcIixcbiAgXCJydWx1aGFyXCI6XCJcXHUyOTY4XCIsXG4gIFwicnhcIjpcIlxcdTIxMUVcIixcbiAgXCJTYWN1dGVcIjpcIlxcdTAxNUFcIixcbiAgXCJzYWN1dGVcIjpcIlxcdTAxNUJcIixcbiAgXCJzYnF1b1wiOlwiXFx1MjAxQVwiLFxuICBcIlNjXCI6XCJcXHUyQUJDXCIsXG4gIFwic2NcIjpcIlxcdTIyN0JcIixcbiAgXCJzY2FwXCI6XCJcXHUyQUI4XCIsXG4gIFwiU2Nhcm9uXCI6XCJcXHUwMTYwXCIsXG4gIFwic2Nhcm9uXCI6XCJcXHUwMTYxXCIsXG4gIFwic2NjdWVcIjpcIlxcdTIyN0RcIixcbiAgXCJzY0VcIjpcIlxcdTJBQjRcIixcbiAgXCJzY2VcIjpcIlxcdTJBQjBcIixcbiAgXCJTY2VkaWxcIjpcIlxcdTAxNUVcIixcbiAgXCJzY2VkaWxcIjpcIlxcdTAxNUZcIixcbiAgXCJTY2lyY1wiOlwiXFx1MDE1Q1wiLFxuICBcInNjaXJjXCI6XCJcXHUwMTVEXCIsXG4gIFwic2NuYXBcIjpcIlxcdTJBQkFcIixcbiAgXCJzY25FXCI6XCJcXHUyQUI2XCIsXG4gIFwic2Nuc2ltXCI6XCJcXHUyMkU5XCIsXG4gIFwic2Nwb2xpbnRcIjpcIlxcdTJBMTNcIixcbiAgXCJzY3NpbVwiOlwiXFx1MjI3RlwiLFxuICBcIlNjeVwiOlwiXFx1MDQyMVwiLFxuICBcInNjeVwiOlwiXFx1MDQ0MVwiLFxuICBcInNkb3RcIjpcIlxcdTIyQzVcIixcbiAgXCJzZG90YlwiOlwiXFx1MjJBMVwiLFxuICBcInNkb3RlXCI6XCJcXHUyQTY2XCIsXG4gIFwic2VhcmhrXCI6XCJcXHUyOTI1XCIsXG4gIFwic2VBcnJcIjpcIlxcdTIxRDhcIixcbiAgXCJzZWFyclwiOlwiXFx1MjE5OFwiLFxuICBcInNlYXJyb3dcIjpcIlxcdTIxOThcIixcbiAgXCJzZWN0XCI6XCJcXHUwMEE3XCIsXG4gIFwic2VtaVwiOlwiXFx1MDAzQlwiLFxuICBcInNlc3dhclwiOlwiXFx1MjkyOVwiLFxuICBcInNldG1pbnVzXCI6XCJcXHUyMjE2XCIsXG4gIFwic2V0bW5cIjpcIlxcdTIyMTZcIixcbiAgXCJzZXh0XCI6XCJcXHUyNzM2XCIsXG4gIFwiU2ZyXCI6XCJcXHVEODM1XFx1REQxNlwiLFxuICBcInNmclwiOlwiXFx1RDgzNVxcdUREMzBcIixcbiAgXCJzZnJvd25cIjpcIlxcdTIzMjJcIixcbiAgXCJzaGFycFwiOlwiXFx1MjY2RlwiLFxuICBcIlNIQ0hjeVwiOlwiXFx1MDQyOVwiLFxuICBcInNoY2hjeVwiOlwiXFx1MDQ0OVwiLFxuICBcIlNIY3lcIjpcIlxcdTA0MjhcIixcbiAgXCJzaGN5XCI6XCJcXHUwNDQ4XCIsXG4gIFwiU2hvcnREb3duQXJyb3dcIjpcIlxcdTIxOTNcIixcbiAgXCJTaG9ydExlZnRBcnJvd1wiOlwiXFx1MjE5MFwiLFxuICBcInNob3J0bWlkXCI6XCJcXHUyMjIzXCIsXG4gIFwic2hvcnRwYXJhbGxlbFwiOlwiXFx1MjIyNVwiLFxuICBcIlNob3J0UmlnaHRBcnJvd1wiOlwiXFx1MjE5MlwiLFxuICBcIlNob3J0VXBBcnJvd1wiOlwiXFx1MjE5MVwiLFxuICBcInNoeVwiOlwiXFx1MDBBRFwiLFxuICBcIlNpZ21hXCI6XCJcXHUwM0EzXCIsXG4gIFwic2lnbWFcIjpcIlxcdTAzQzNcIixcbiAgXCJzaWdtYWZcIjpcIlxcdTAzQzJcIixcbiAgXCJzaWdtYXZcIjpcIlxcdTAzQzJcIixcbiAgXCJzaW1cIjpcIlxcdTIyM0NcIixcbiAgXCJzaW1kb3RcIjpcIlxcdTJBNkFcIixcbiAgXCJzaW1lXCI6XCJcXHUyMjQzXCIsXG4gIFwic2ltZXFcIjpcIlxcdTIyNDNcIixcbiAgXCJzaW1nXCI6XCJcXHUyQTlFXCIsXG4gIFwic2ltZ0VcIjpcIlxcdTJBQTBcIixcbiAgXCJzaW1sXCI6XCJcXHUyQTlEXCIsXG4gIFwic2ltbEVcIjpcIlxcdTJBOUZcIixcbiAgXCJzaW1uZVwiOlwiXFx1MjI0NlwiLFxuICBcInNpbXBsdXNcIjpcIlxcdTJBMjRcIixcbiAgXCJzaW1yYXJyXCI6XCJcXHUyOTcyXCIsXG4gIFwic2xhcnJcIjpcIlxcdTIxOTBcIixcbiAgXCJTbWFsbENpcmNsZVwiOlwiXFx1MjIxOFwiLFxuICBcInNtYWxsc2V0bWludXNcIjpcIlxcdTIyMTZcIixcbiAgXCJzbWFzaHBcIjpcIlxcdTJBMzNcIixcbiAgXCJzbWVwYXJzbFwiOlwiXFx1MjlFNFwiLFxuICBcInNtaWRcIjpcIlxcdTIyMjNcIixcbiAgXCJzbWlsZVwiOlwiXFx1MjMyM1wiLFxuICBcInNtdFwiOlwiXFx1MkFBQVwiLFxuICBcInNtdGVcIjpcIlxcdTJBQUNcIixcbiAgXCJzbXRlc1wiOlwiXFx1MkFBQ1xcdUZFMDBcIixcbiAgXCJTT0ZUY3lcIjpcIlxcdTA0MkNcIixcbiAgXCJzb2Z0Y3lcIjpcIlxcdTA0NENcIixcbiAgXCJzb2xcIjpcIlxcdTAwMkZcIixcbiAgXCJzb2xiXCI6XCJcXHUyOUM0XCIsXG4gIFwic29sYmFyXCI6XCJcXHUyMzNGXCIsXG4gIFwiU29wZlwiOlwiXFx1RDgzNVxcdURENEFcIixcbiAgXCJzb3BmXCI6XCJcXHVEODM1XFx1REQ2NFwiLFxuICBcInNwYWRlc1wiOlwiXFx1MjY2MFwiLFxuICBcInNwYWRlc3VpdFwiOlwiXFx1MjY2MFwiLFxuICBcInNwYXJcIjpcIlxcdTIyMjVcIixcbiAgXCJzcWNhcFwiOlwiXFx1MjI5M1wiLFxuICBcInNxY2Fwc1wiOlwiXFx1MjI5M1xcdUZFMDBcIixcbiAgXCJzcWN1cFwiOlwiXFx1MjI5NFwiLFxuICBcInNxY3Vwc1wiOlwiXFx1MjI5NFxcdUZFMDBcIixcbiAgXCJTcXJ0XCI6XCJcXHUyMjFBXCIsXG4gIFwic3FzdWJcIjpcIlxcdTIyOEZcIixcbiAgXCJzcXN1YmVcIjpcIlxcdTIyOTFcIixcbiAgXCJzcXN1YnNldFwiOlwiXFx1MjI4RlwiLFxuICBcInNxc3Vic2V0ZXFcIjpcIlxcdTIyOTFcIixcbiAgXCJzcXN1cFwiOlwiXFx1MjI5MFwiLFxuICBcInNxc3VwZVwiOlwiXFx1MjI5MlwiLFxuICBcInNxc3Vwc2V0XCI6XCJcXHUyMjkwXCIsXG4gIFwic3FzdXBzZXRlcVwiOlwiXFx1MjI5MlwiLFxuICBcInNxdVwiOlwiXFx1MjVBMVwiLFxuICBcIlNxdWFyZVwiOlwiXFx1MjVBMVwiLFxuICBcInNxdWFyZVwiOlwiXFx1MjVBMVwiLFxuICBcIlNxdWFyZUludGVyc2VjdGlvblwiOlwiXFx1MjI5M1wiLFxuICBcIlNxdWFyZVN1YnNldFwiOlwiXFx1MjI4RlwiLFxuICBcIlNxdWFyZVN1YnNldEVxdWFsXCI6XCJcXHUyMjkxXCIsXG4gIFwiU3F1YXJlU3VwZXJzZXRcIjpcIlxcdTIyOTBcIixcbiAgXCJTcXVhcmVTdXBlcnNldEVxdWFsXCI6XCJcXHUyMjkyXCIsXG4gIFwiU3F1YXJlVW5pb25cIjpcIlxcdTIyOTRcIixcbiAgXCJzcXVhcmZcIjpcIlxcdTI1QUFcIixcbiAgXCJzcXVmXCI6XCJcXHUyNUFBXCIsXG4gIFwic3JhcnJcIjpcIlxcdTIxOTJcIixcbiAgXCJTc2NyXCI6XCJcXHVEODM1XFx1RENBRVwiLFxuICBcInNzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M4XCIsXG4gIFwic3NldG1uXCI6XCJcXHUyMjE2XCIsXG4gIFwic3NtaWxlXCI6XCJcXHUyMzIzXCIsXG4gIFwic3N0YXJmXCI6XCJcXHUyMkM2XCIsXG4gIFwiU3RhclwiOlwiXFx1MjJDNlwiLFxuICBcInN0YXJcIjpcIlxcdTI2MDZcIixcbiAgXCJzdGFyZlwiOlwiXFx1MjYwNVwiLFxuICBcInN0cmFpZ2h0ZXBzaWxvblwiOlwiXFx1MDNGNVwiLFxuICBcInN0cmFpZ2h0cGhpXCI6XCJcXHUwM0Q1XCIsXG4gIFwic3RybnNcIjpcIlxcdTAwQUZcIixcbiAgXCJTdWJcIjpcIlxcdTIyRDBcIixcbiAgXCJzdWJcIjpcIlxcdTIyODJcIixcbiAgXCJzdWJkb3RcIjpcIlxcdTJBQkRcIixcbiAgXCJzdWJFXCI6XCJcXHUyQUM1XCIsXG4gIFwic3ViZVwiOlwiXFx1MjI4NlwiLFxuICBcInN1YmVkb3RcIjpcIlxcdTJBQzNcIixcbiAgXCJzdWJtdWx0XCI6XCJcXHUyQUMxXCIsXG4gIFwic3VibkVcIjpcIlxcdTJBQ0JcIixcbiAgXCJzdWJuZVwiOlwiXFx1MjI4QVwiLFxuICBcInN1YnBsdXNcIjpcIlxcdTJBQkZcIixcbiAgXCJzdWJyYXJyXCI6XCJcXHUyOTc5XCIsXG4gIFwiU3Vic2V0XCI6XCJcXHUyMkQwXCIsXG4gIFwic3Vic2V0XCI6XCJcXHUyMjgyXCIsXG4gIFwic3Vic2V0ZXFcIjpcIlxcdTIyODZcIixcbiAgXCJzdWJzZXRlcXFcIjpcIlxcdTJBQzVcIixcbiAgXCJTdWJzZXRFcXVhbFwiOlwiXFx1MjI4NlwiLFxuICBcInN1YnNldG5lcVwiOlwiXFx1MjI4QVwiLFxuICBcInN1YnNldG5lcXFcIjpcIlxcdTJBQ0JcIixcbiAgXCJzdWJzaW1cIjpcIlxcdTJBQzdcIixcbiAgXCJzdWJzdWJcIjpcIlxcdTJBRDVcIixcbiAgXCJzdWJzdXBcIjpcIlxcdTJBRDNcIixcbiAgXCJzdWNjXCI6XCJcXHUyMjdCXCIsXG4gIFwic3VjY2FwcHJveFwiOlwiXFx1MkFCOFwiLFxuICBcInN1Y2NjdXJseWVxXCI6XCJcXHUyMjdEXCIsXG4gIFwiU3VjY2VlZHNcIjpcIlxcdTIyN0JcIixcbiAgXCJTdWNjZWVkc0VxdWFsXCI6XCJcXHUyQUIwXCIsXG4gIFwiU3VjY2VlZHNTbGFudEVxdWFsXCI6XCJcXHUyMjdEXCIsXG4gIFwiU3VjY2VlZHNUaWxkZVwiOlwiXFx1MjI3RlwiLFxuICBcInN1Y2NlcVwiOlwiXFx1MkFCMFwiLFxuICBcInN1Y2NuYXBwcm94XCI6XCJcXHUyQUJBXCIsXG4gIFwic3VjY25lcXFcIjpcIlxcdTJBQjZcIixcbiAgXCJzdWNjbnNpbVwiOlwiXFx1MjJFOVwiLFxuICBcInN1Y2NzaW1cIjpcIlxcdTIyN0ZcIixcbiAgXCJTdWNoVGhhdFwiOlwiXFx1MjIwQlwiLFxuICBcIlN1bVwiOlwiXFx1MjIxMVwiLFxuICBcInN1bVwiOlwiXFx1MjIxMVwiLFxuICBcInN1bmdcIjpcIlxcdTI2NkFcIixcbiAgXCJTdXBcIjpcIlxcdTIyRDFcIixcbiAgXCJzdXBcIjpcIlxcdTIyODNcIixcbiAgXCJzdXAxXCI6XCJcXHUwMEI5XCIsXG4gIFwic3VwMlwiOlwiXFx1MDBCMlwiLFxuICBcInN1cDNcIjpcIlxcdTAwQjNcIixcbiAgXCJzdXBkb3RcIjpcIlxcdTJBQkVcIixcbiAgXCJzdXBkc3ViXCI6XCJcXHUyQUQ4XCIsXG4gIFwic3VwRVwiOlwiXFx1MkFDNlwiLFxuICBcInN1cGVcIjpcIlxcdTIyODdcIixcbiAgXCJzdXBlZG90XCI6XCJcXHUyQUM0XCIsXG4gIFwiU3VwZXJzZXRcIjpcIlxcdTIyODNcIixcbiAgXCJTdXBlcnNldEVxdWFsXCI6XCJcXHUyMjg3XCIsXG4gIFwic3VwaHNvbFwiOlwiXFx1MjdDOVwiLFxuICBcInN1cGhzdWJcIjpcIlxcdTJBRDdcIixcbiAgXCJzdXBsYXJyXCI6XCJcXHUyOTdCXCIsXG4gIFwic3VwbXVsdFwiOlwiXFx1MkFDMlwiLFxuICBcInN1cG5FXCI6XCJcXHUyQUNDXCIsXG4gIFwic3VwbmVcIjpcIlxcdTIyOEJcIixcbiAgXCJzdXBwbHVzXCI6XCJcXHUyQUMwXCIsXG4gIFwiU3Vwc2V0XCI6XCJcXHUyMkQxXCIsXG4gIFwic3Vwc2V0XCI6XCJcXHUyMjgzXCIsXG4gIFwic3Vwc2V0ZXFcIjpcIlxcdTIyODdcIixcbiAgXCJzdXBzZXRlcXFcIjpcIlxcdTJBQzZcIixcbiAgXCJzdXBzZXRuZXFcIjpcIlxcdTIyOEJcIixcbiAgXCJzdXBzZXRuZXFxXCI6XCJcXHUyQUNDXCIsXG4gIFwic3Vwc2ltXCI6XCJcXHUyQUM4XCIsXG4gIFwic3Vwc3ViXCI6XCJcXHUyQUQ0XCIsXG4gIFwic3Vwc3VwXCI6XCJcXHUyQUQ2XCIsXG4gIFwic3dhcmhrXCI6XCJcXHUyOTI2XCIsXG4gIFwic3dBcnJcIjpcIlxcdTIxRDlcIixcbiAgXCJzd2FyclwiOlwiXFx1MjE5OVwiLFxuICBcInN3YXJyb3dcIjpcIlxcdTIxOTlcIixcbiAgXCJzd253YXJcIjpcIlxcdTI5MkFcIixcbiAgXCJzemxpZ1wiOlwiXFx1MDBERlwiLFxuICBcIlRhYlwiOlwiXFx1MDAwOVwiLFxuICBcInRhcmdldFwiOlwiXFx1MjMxNlwiLFxuICBcIlRhdVwiOlwiXFx1MDNBNFwiLFxuICBcInRhdVwiOlwiXFx1MDNDNFwiLFxuICBcInRicmtcIjpcIlxcdTIzQjRcIixcbiAgXCJUY2Fyb25cIjpcIlxcdTAxNjRcIixcbiAgXCJ0Y2Fyb25cIjpcIlxcdTAxNjVcIixcbiAgXCJUY2VkaWxcIjpcIlxcdTAxNjJcIixcbiAgXCJ0Y2VkaWxcIjpcIlxcdTAxNjNcIixcbiAgXCJUY3lcIjpcIlxcdTA0MjJcIixcbiAgXCJ0Y3lcIjpcIlxcdTA0NDJcIixcbiAgXCJ0ZG90XCI6XCJcXHUyMERCXCIsXG4gIFwidGVscmVjXCI6XCJcXHUyMzE1XCIsXG4gIFwiVGZyXCI6XCJcXHVEODM1XFx1REQxN1wiLFxuICBcInRmclwiOlwiXFx1RDgzNVxcdUREMzFcIixcbiAgXCJ0aGVyZTRcIjpcIlxcdTIyMzRcIixcbiAgXCJUaGVyZWZvcmVcIjpcIlxcdTIyMzRcIixcbiAgXCJ0aGVyZWZvcmVcIjpcIlxcdTIyMzRcIixcbiAgXCJUaGV0YVwiOlwiXFx1MDM5OFwiLFxuICBcInRoZXRhXCI6XCJcXHUwM0I4XCIsXG4gIFwidGhldGFzeW1cIjpcIlxcdTAzRDFcIixcbiAgXCJ0aGV0YXZcIjpcIlxcdTAzRDFcIixcbiAgXCJ0aGlja2FwcHJveFwiOlwiXFx1MjI0OFwiLFxuICBcInRoaWNrc2ltXCI6XCJcXHUyMjNDXCIsXG4gIFwiVGhpY2tTcGFjZVwiOlwiXFx1MjA1RlxcdTIwMEFcIixcbiAgXCJ0aGluc3BcIjpcIlxcdTIwMDlcIixcbiAgXCJUaGluU3BhY2VcIjpcIlxcdTIwMDlcIixcbiAgXCJ0aGthcFwiOlwiXFx1MjI0OFwiLFxuICBcInRoa3NpbVwiOlwiXFx1MjIzQ1wiLFxuICBcIlRIT1JOXCI6XCJcXHUwMERFXCIsXG4gIFwidGhvcm5cIjpcIlxcdTAwRkVcIixcbiAgXCJUaWxkZVwiOlwiXFx1MjIzQ1wiLFxuICBcInRpbGRlXCI6XCJcXHUwMkRDXCIsXG4gIFwiVGlsZGVFcXVhbFwiOlwiXFx1MjI0M1wiLFxuICBcIlRpbGRlRnVsbEVxdWFsXCI6XCJcXHUyMjQ1XCIsXG4gIFwiVGlsZGVUaWxkZVwiOlwiXFx1MjI0OFwiLFxuICBcInRpbWVzXCI6XCJcXHUwMEQ3XCIsXG4gIFwidGltZXNiXCI6XCJcXHUyMkEwXCIsXG4gIFwidGltZXNiYXJcIjpcIlxcdTJBMzFcIixcbiAgXCJ0aW1lc2RcIjpcIlxcdTJBMzBcIixcbiAgXCJ0aW50XCI6XCJcXHUyMjJEXCIsXG4gIFwidG9lYVwiOlwiXFx1MjkyOFwiLFxuICBcInRvcFwiOlwiXFx1MjJBNFwiLFxuICBcInRvcGJvdFwiOlwiXFx1MjMzNlwiLFxuICBcInRvcGNpclwiOlwiXFx1MkFGMVwiLFxuICBcIlRvcGZcIjpcIlxcdUQ4MzVcXHVERDRCXCIsXG4gIFwidG9wZlwiOlwiXFx1RDgzNVxcdURENjVcIixcbiAgXCJ0b3Bmb3JrXCI6XCJcXHUyQURBXCIsXG4gIFwidG9zYVwiOlwiXFx1MjkyOVwiLFxuICBcInRwcmltZVwiOlwiXFx1MjAzNFwiLFxuICBcIlRSQURFXCI6XCJcXHUyMTIyXCIsXG4gIFwidHJhZGVcIjpcIlxcdTIxMjJcIixcbiAgXCJ0cmlhbmdsZVwiOlwiXFx1MjVCNVwiLFxuICBcInRyaWFuZ2xlZG93blwiOlwiXFx1MjVCRlwiLFxuICBcInRyaWFuZ2xlbGVmdFwiOlwiXFx1MjVDM1wiLFxuICBcInRyaWFuZ2xlbGVmdGVxXCI6XCJcXHUyMkI0XCIsXG4gIFwidHJpYW5nbGVxXCI6XCJcXHUyMjVDXCIsXG4gIFwidHJpYW5nbGVyaWdodFwiOlwiXFx1MjVCOVwiLFxuICBcInRyaWFuZ2xlcmlnaHRlcVwiOlwiXFx1MjJCNVwiLFxuICBcInRyaWRvdFwiOlwiXFx1MjVFQ1wiLFxuICBcInRyaWVcIjpcIlxcdTIyNUNcIixcbiAgXCJ0cmltaW51c1wiOlwiXFx1MkEzQVwiLFxuICBcIlRyaXBsZURvdFwiOlwiXFx1MjBEQlwiLFxuICBcInRyaXBsdXNcIjpcIlxcdTJBMzlcIixcbiAgXCJ0cmlzYlwiOlwiXFx1MjlDRFwiLFxuICBcInRyaXRpbWVcIjpcIlxcdTJBM0JcIixcbiAgXCJ0cnBleml1bVwiOlwiXFx1MjNFMlwiLFxuICBcIlRzY3JcIjpcIlxcdUQ4MzVcXHVEQ0FGXCIsXG4gIFwidHNjclwiOlwiXFx1RDgzNVxcdURDQzlcIixcbiAgXCJUU2N5XCI6XCJcXHUwNDI2XCIsXG4gIFwidHNjeVwiOlwiXFx1MDQ0NlwiLFxuICBcIlRTSGN5XCI6XCJcXHUwNDBCXCIsXG4gIFwidHNoY3lcIjpcIlxcdTA0NUJcIixcbiAgXCJUc3Ryb2tcIjpcIlxcdTAxNjZcIixcbiAgXCJ0c3Ryb2tcIjpcIlxcdTAxNjdcIixcbiAgXCJ0d2l4dFwiOlwiXFx1MjI2Q1wiLFxuICBcInR3b2hlYWRsZWZ0YXJyb3dcIjpcIlxcdTIxOUVcIixcbiAgXCJ0d29oZWFkcmlnaHRhcnJvd1wiOlwiXFx1MjFBMFwiLFxuICBcIlVhY3V0ZVwiOlwiXFx1MDBEQVwiLFxuICBcInVhY3V0ZVwiOlwiXFx1MDBGQVwiLFxuICBcIlVhcnJcIjpcIlxcdTIxOUZcIixcbiAgXCJ1QXJyXCI6XCJcXHUyMUQxXCIsXG4gIFwidWFyclwiOlwiXFx1MjE5MVwiLFxuICBcIlVhcnJvY2lyXCI6XCJcXHUyOTQ5XCIsXG4gIFwiVWJyY3lcIjpcIlxcdTA0MEVcIixcbiAgXCJ1YnJjeVwiOlwiXFx1MDQ1RVwiLFxuICBcIlVicmV2ZVwiOlwiXFx1MDE2Q1wiLFxuICBcInVicmV2ZVwiOlwiXFx1MDE2RFwiLFxuICBcIlVjaXJjXCI6XCJcXHUwMERCXCIsXG4gIFwidWNpcmNcIjpcIlxcdTAwRkJcIixcbiAgXCJVY3lcIjpcIlxcdTA0MjNcIixcbiAgXCJ1Y3lcIjpcIlxcdTA0NDNcIixcbiAgXCJ1ZGFyclwiOlwiXFx1MjFDNVwiLFxuICBcIlVkYmxhY1wiOlwiXFx1MDE3MFwiLFxuICBcInVkYmxhY1wiOlwiXFx1MDE3MVwiLFxuICBcInVkaGFyXCI6XCJcXHUyOTZFXCIsXG4gIFwidWZpc2h0XCI6XCJcXHUyOTdFXCIsXG4gIFwiVWZyXCI6XCJcXHVEODM1XFx1REQxOFwiLFxuICBcInVmclwiOlwiXFx1RDgzNVxcdUREMzJcIixcbiAgXCJVZ3JhdmVcIjpcIlxcdTAwRDlcIixcbiAgXCJ1Z3JhdmVcIjpcIlxcdTAwRjlcIixcbiAgXCJ1SGFyXCI6XCJcXHUyOTYzXCIsXG4gIFwidWhhcmxcIjpcIlxcdTIxQkZcIixcbiAgXCJ1aGFyclwiOlwiXFx1MjFCRVwiLFxuICBcInVoYmxrXCI6XCJcXHUyNTgwXCIsXG4gIFwidWxjb3JuXCI6XCJcXHUyMzFDXCIsXG4gIFwidWxjb3JuZXJcIjpcIlxcdTIzMUNcIixcbiAgXCJ1bGNyb3BcIjpcIlxcdTIzMEZcIixcbiAgXCJ1bHRyaVwiOlwiXFx1MjVGOFwiLFxuICBcIlVtYWNyXCI6XCJcXHUwMTZBXCIsXG4gIFwidW1hY3JcIjpcIlxcdTAxNkJcIixcbiAgXCJ1bWxcIjpcIlxcdTAwQThcIixcbiAgXCJVbmRlckJhclwiOlwiXFx1MDA1RlwiLFxuICBcIlVuZGVyQnJhY2VcIjpcIlxcdTIzREZcIixcbiAgXCJVbmRlckJyYWNrZXRcIjpcIlxcdTIzQjVcIixcbiAgXCJVbmRlclBhcmVudGhlc2lzXCI6XCJcXHUyM0REXCIsXG4gIFwiVW5pb25cIjpcIlxcdTIyQzNcIixcbiAgXCJVbmlvblBsdXNcIjpcIlxcdTIyOEVcIixcbiAgXCJVb2dvblwiOlwiXFx1MDE3MlwiLFxuICBcInVvZ29uXCI6XCJcXHUwMTczXCIsXG4gIFwiVW9wZlwiOlwiXFx1RDgzNVxcdURENENcIixcbiAgXCJ1b3BmXCI6XCJcXHVEODM1XFx1REQ2NlwiLFxuICBcIlVwQXJyb3dcIjpcIlxcdTIxOTFcIixcbiAgXCJVcGFycm93XCI6XCJcXHUyMUQxXCIsXG4gIFwidXBhcnJvd1wiOlwiXFx1MjE5MVwiLFxuICBcIlVwQXJyb3dCYXJcIjpcIlxcdTI5MTJcIixcbiAgXCJVcEFycm93RG93bkFycm93XCI6XCJcXHUyMUM1XCIsXG4gIFwiVXBEb3duQXJyb3dcIjpcIlxcdTIxOTVcIixcbiAgXCJVcGRvd25hcnJvd1wiOlwiXFx1MjFENVwiLFxuICBcInVwZG93bmFycm93XCI6XCJcXHUyMTk1XCIsXG4gIFwiVXBFcXVpbGlicml1bVwiOlwiXFx1Mjk2RVwiLFxuICBcInVwaGFycG9vbmxlZnRcIjpcIlxcdTIxQkZcIixcbiAgXCJ1cGhhcnBvb25yaWdodFwiOlwiXFx1MjFCRVwiLFxuICBcInVwbHVzXCI6XCJcXHUyMjhFXCIsXG4gIFwiVXBwZXJMZWZ0QXJyb3dcIjpcIlxcdTIxOTZcIixcbiAgXCJVcHBlclJpZ2h0QXJyb3dcIjpcIlxcdTIxOTdcIixcbiAgXCJVcHNpXCI6XCJcXHUwM0QyXCIsXG4gIFwidXBzaVwiOlwiXFx1MDNDNVwiLFxuICBcInVwc2loXCI6XCJcXHUwM0QyXCIsXG4gIFwiVXBzaWxvblwiOlwiXFx1MDNBNVwiLFxuICBcInVwc2lsb25cIjpcIlxcdTAzQzVcIixcbiAgXCJVcFRlZVwiOlwiXFx1MjJBNVwiLFxuICBcIlVwVGVlQXJyb3dcIjpcIlxcdTIxQTVcIixcbiAgXCJ1cHVwYXJyb3dzXCI6XCJcXHUyMUM4XCIsXG4gIFwidXJjb3JuXCI6XCJcXHUyMzFEXCIsXG4gIFwidXJjb3JuZXJcIjpcIlxcdTIzMURcIixcbiAgXCJ1cmNyb3BcIjpcIlxcdTIzMEVcIixcbiAgXCJVcmluZ1wiOlwiXFx1MDE2RVwiLFxuICBcInVyaW5nXCI6XCJcXHUwMTZGXCIsXG4gIFwidXJ0cmlcIjpcIlxcdTI1RjlcIixcbiAgXCJVc2NyXCI6XCJcXHVEODM1XFx1RENCMFwiLFxuICBcInVzY3JcIjpcIlxcdUQ4MzVcXHVEQ0NBXCIsXG4gIFwidXRkb3RcIjpcIlxcdTIyRjBcIixcbiAgXCJVdGlsZGVcIjpcIlxcdTAxNjhcIixcbiAgXCJ1dGlsZGVcIjpcIlxcdTAxNjlcIixcbiAgXCJ1dHJpXCI6XCJcXHUyNUI1XCIsXG4gIFwidXRyaWZcIjpcIlxcdTI1QjRcIixcbiAgXCJ1dWFyclwiOlwiXFx1MjFDOFwiLFxuICBcIlV1bWxcIjpcIlxcdTAwRENcIixcbiAgXCJ1dW1sXCI6XCJcXHUwMEZDXCIsXG4gIFwidXdhbmdsZVwiOlwiXFx1MjlBN1wiLFxuICBcInZhbmdydFwiOlwiXFx1Mjk5Q1wiLFxuICBcInZhcmVwc2lsb25cIjpcIlxcdTAzRjVcIixcbiAgXCJ2YXJrYXBwYVwiOlwiXFx1MDNGMFwiLFxuICBcInZhcm5vdGhpbmdcIjpcIlxcdTIyMDVcIixcbiAgXCJ2YXJwaGlcIjpcIlxcdTAzRDVcIixcbiAgXCJ2YXJwaVwiOlwiXFx1MDNENlwiLFxuICBcInZhcnByb3B0b1wiOlwiXFx1MjIxRFwiLFxuICBcInZBcnJcIjpcIlxcdTIxRDVcIixcbiAgXCJ2YXJyXCI6XCJcXHUyMTk1XCIsXG4gIFwidmFycmhvXCI6XCJcXHUwM0YxXCIsXG4gIFwidmFyc2lnbWFcIjpcIlxcdTAzQzJcIixcbiAgXCJ2YXJzdWJzZXRuZXFcIjpcIlxcdTIyOEFcXHVGRTAwXCIsXG4gIFwidmFyc3Vic2V0bmVxcVwiOlwiXFx1MkFDQlxcdUZFMDBcIixcbiAgXCJ2YXJzdXBzZXRuZXFcIjpcIlxcdTIyOEJcXHVGRTAwXCIsXG4gIFwidmFyc3Vwc2V0bmVxcVwiOlwiXFx1MkFDQ1xcdUZFMDBcIixcbiAgXCJ2YXJ0aGV0YVwiOlwiXFx1MDNEMVwiLFxuICBcInZhcnRyaWFuZ2xlbGVmdFwiOlwiXFx1MjJCMlwiLFxuICBcInZhcnRyaWFuZ2xlcmlnaHRcIjpcIlxcdTIyQjNcIixcbiAgXCJWYmFyXCI6XCJcXHUyQUVCXCIsXG4gIFwidkJhclwiOlwiXFx1MkFFOFwiLFxuICBcInZCYXJ2XCI6XCJcXHUyQUU5XCIsXG4gIFwiVmN5XCI6XCJcXHUwNDEyXCIsXG4gIFwidmN5XCI6XCJcXHUwNDMyXCIsXG4gIFwiVkRhc2hcIjpcIlxcdTIyQUJcIixcbiAgXCJWZGFzaFwiOlwiXFx1MjJBOVwiLFxuICBcInZEYXNoXCI6XCJcXHUyMkE4XCIsXG4gIFwidmRhc2hcIjpcIlxcdTIyQTJcIixcbiAgXCJWZGFzaGxcIjpcIlxcdTJBRTZcIixcbiAgXCJWZWVcIjpcIlxcdTIyQzFcIixcbiAgXCJ2ZWVcIjpcIlxcdTIyMjhcIixcbiAgXCJ2ZWViYXJcIjpcIlxcdTIyQkJcIixcbiAgXCJ2ZWVlcVwiOlwiXFx1MjI1QVwiLFxuICBcInZlbGxpcFwiOlwiXFx1MjJFRVwiLFxuICBcIlZlcmJhclwiOlwiXFx1MjAxNlwiLFxuICBcInZlcmJhclwiOlwiXFx1MDA3Q1wiLFxuICBcIlZlcnRcIjpcIlxcdTIwMTZcIixcbiAgXCJ2ZXJ0XCI6XCJcXHUwMDdDXCIsXG4gIFwiVmVydGljYWxCYXJcIjpcIlxcdTIyMjNcIixcbiAgXCJWZXJ0aWNhbExpbmVcIjpcIlxcdTAwN0NcIixcbiAgXCJWZXJ0aWNhbFNlcGFyYXRvclwiOlwiXFx1Mjc1OFwiLFxuICBcIlZlcnRpY2FsVGlsZGVcIjpcIlxcdTIyNDBcIixcbiAgXCJWZXJ5VGhpblNwYWNlXCI6XCJcXHUyMDBBXCIsXG4gIFwiVmZyXCI6XCJcXHVEODM1XFx1REQxOVwiLFxuICBcInZmclwiOlwiXFx1RDgzNVxcdUREMzNcIixcbiAgXCJ2bHRyaVwiOlwiXFx1MjJCMlwiLFxuICBcInZuc3ViXCI6XCJcXHUyMjgyXFx1MjBEMlwiLFxuICBcInZuc3VwXCI6XCJcXHUyMjgzXFx1MjBEMlwiLFxuICBcIlZvcGZcIjpcIlxcdUQ4MzVcXHVERDREXCIsXG4gIFwidm9wZlwiOlwiXFx1RDgzNVxcdURENjdcIixcbiAgXCJ2cHJvcFwiOlwiXFx1MjIxRFwiLFxuICBcInZydHJpXCI6XCJcXHUyMkIzXCIsXG4gIFwiVnNjclwiOlwiXFx1RDgzNVxcdURDQjFcIixcbiAgXCJ2c2NyXCI6XCJcXHVEODM1XFx1RENDQlwiLFxuICBcInZzdWJuRVwiOlwiXFx1MkFDQlxcdUZFMDBcIixcbiAgXCJ2c3VibmVcIjpcIlxcdTIyOEFcXHVGRTAwXCIsXG4gIFwidnN1cG5FXCI6XCJcXHUyQUNDXFx1RkUwMFwiLFxuICBcInZzdXBuZVwiOlwiXFx1MjI4QlxcdUZFMDBcIixcbiAgXCJWdmRhc2hcIjpcIlxcdTIyQUFcIixcbiAgXCJ2emlnemFnXCI6XCJcXHUyOTlBXCIsXG4gIFwiV2NpcmNcIjpcIlxcdTAxNzRcIixcbiAgXCJ3Y2lyY1wiOlwiXFx1MDE3NVwiLFxuICBcIndlZGJhclwiOlwiXFx1MkE1RlwiLFxuICBcIldlZGdlXCI6XCJcXHUyMkMwXCIsXG4gIFwid2VkZ2VcIjpcIlxcdTIyMjdcIixcbiAgXCJ3ZWRnZXFcIjpcIlxcdTIyNTlcIixcbiAgXCJ3ZWllcnBcIjpcIlxcdTIxMThcIixcbiAgXCJXZnJcIjpcIlxcdUQ4MzVcXHVERDFBXCIsXG4gIFwid2ZyXCI6XCJcXHVEODM1XFx1REQzNFwiLFxuICBcIldvcGZcIjpcIlxcdUQ4MzVcXHVERDRFXCIsXG4gIFwid29wZlwiOlwiXFx1RDgzNVxcdURENjhcIixcbiAgXCJ3cFwiOlwiXFx1MjExOFwiLFxuICBcIndyXCI6XCJcXHUyMjQwXCIsXG4gIFwid3JlYXRoXCI6XCJcXHUyMjQwXCIsXG4gIFwiV3NjclwiOlwiXFx1RDgzNVxcdURDQjJcIixcbiAgXCJ3c2NyXCI6XCJcXHVEODM1XFx1RENDQ1wiLFxuICBcInhjYXBcIjpcIlxcdTIyQzJcIixcbiAgXCJ4Y2lyY1wiOlwiXFx1MjVFRlwiLFxuICBcInhjdXBcIjpcIlxcdTIyQzNcIixcbiAgXCJ4ZHRyaVwiOlwiXFx1MjVCRFwiLFxuICBcIlhmclwiOlwiXFx1RDgzNVxcdUREMUJcIixcbiAgXCJ4ZnJcIjpcIlxcdUQ4MzVcXHVERDM1XCIsXG4gIFwieGhBcnJcIjpcIlxcdTI3RkFcIixcbiAgXCJ4aGFyclwiOlwiXFx1MjdGN1wiLFxuICBcIlhpXCI6XCJcXHUwMzlFXCIsXG4gIFwieGlcIjpcIlxcdTAzQkVcIixcbiAgXCJ4bEFyclwiOlwiXFx1MjdGOFwiLFxuICBcInhsYXJyXCI6XCJcXHUyN0Y1XCIsXG4gIFwieG1hcFwiOlwiXFx1MjdGQ1wiLFxuICBcInhuaXNcIjpcIlxcdTIyRkJcIixcbiAgXCJ4b2RvdFwiOlwiXFx1MkEwMFwiLFxuICBcIlhvcGZcIjpcIlxcdUQ4MzVcXHVERDRGXCIsXG4gIFwieG9wZlwiOlwiXFx1RDgzNVxcdURENjlcIixcbiAgXCJ4b3BsdXNcIjpcIlxcdTJBMDFcIixcbiAgXCJ4b3RpbWVcIjpcIlxcdTJBMDJcIixcbiAgXCJ4ckFyclwiOlwiXFx1MjdGOVwiLFxuICBcInhyYXJyXCI6XCJcXHUyN0Y2XCIsXG4gIFwiWHNjclwiOlwiXFx1RDgzNVxcdURDQjNcIixcbiAgXCJ4c2NyXCI6XCJcXHVEODM1XFx1RENDRFwiLFxuICBcInhzcWN1cFwiOlwiXFx1MkEwNlwiLFxuICBcInh1cGx1c1wiOlwiXFx1MkEwNFwiLFxuICBcInh1dHJpXCI6XCJcXHUyNUIzXCIsXG4gIFwieHZlZVwiOlwiXFx1MjJDMVwiLFxuICBcInh3ZWRnZVwiOlwiXFx1MjJDMFwiLFxuICBcIllhY3V0ZVwiOlwiXFx1MDBERFwiLFxuICBcInlhY3V0ZVwiOlwiXFx1MDBGRFwiLFxuICBcIllBY3lcIjpcIlxcdTA0MkZcIixcbiAgXCJ5YWN5XCI6XCJcXHUwNDRGXCIsXG4gIFwiWWNpcmNcIjpcIlxcdTAxNzZcIixcbiAgXCJ5Y2lyY1wiOlwiXFx1MDE3N1wiLFxuICBcIlljeVwiOlwiXFx1MDQyQlwiLFxuICBcInljeVwiOlwiXFx1MDQ0QlwiLFxuICBcInllblwiOlwiXFx1MDBBNVwiLFxuICBcIllmclwiOlwiXFx1RDgzNVxcdUREMUNcIixcbiAgXCJ5ZnJcIjpcIlxcdUQ4MzVcXHVERDM2XCIsXG4gIFwiWUljeVwiOlwiXFx1MDQwN1wiLFxuICBcInlpY3lcIjpcIlxcdTA0NTdcIixcbiAgXCJZb3BmXCI6XCJcXHVEODM1XFx1REQ1MFwiLFxuICBcInlvcGZcIjpcIlxcdUQ4MzVcXHVERDZBXCIsXG4gIFwiWXNjclwiOlwiXFx1RDgzNVxcdURDQjRcIixcbiAgXCJ5c2NyXCI6XCJcXHVEODM1XFx1RENDRVwiLFxuICBcIllVY3lcIjpcIlxcdTA0MkVcIixcbiAgXCJ5dWN5XCI6XCJcXHUwNDRFXCIsXG4gIFwiWXVtbFwiOlwiXFx1MDE3OFwiLFxuICBcInl1bWxcIjpcIlxcdTAwRkZcIixcbiAgXCJaYWN1dGVcIjpcIlxcdTAxNzlcIixcbiAgXCJ6YWN1dGVcIjpcIlxcdTAxN0FcIixcbiAgXCJaY2Fyb25cIjpcIlxcdTAxN0RcIixcbiAgXCJ6Y2Fyb25cIjpcIlxcdTAxN0VcIixcbiAgXCJaY3lcIjpcIlxcdTA0MTdcIixcbiAgXCJ6Y3lcIjpcIlxcdTA0MzdcIixcbiAgXCJaZG90XCI6XCJcXHUwMTdCXCIsXG4gIFwiemRvdFwiOlwiXFx1MDE3Q1wiLFxuICBcInplZXRyZlwiOlwiXFx1MjEyOFwiLFxuICBcIlplcm9XaWR0aFNwYWNlXCI6XCJcXHUyMDBCXCIsXG4gIFwiWmV0YVwiOlwiXFx1MDM5NlwiLFxuICBcInpldGFcIjpcIlxcdTAzQjZcIixcbiAgXCJaZnJcIjpcIlxcdTIxMjhcIixcbiAgXCJ6ZnJcIjpcIlxcdUQ4MzVcXHVERDM3XCIsXG4gIFwiWkhjeVwiOlwiXFx1MDQxNlwiLFxuICBcInpoY3lcIjpcIlxcdTA0MzZcIixcbiAgXCJ6aWdyYXJyXCI6XCJcXHUyMUREXCIsXG4gIFwiWm9wZlwiOlwiXFx1MjEyNFwiLFxuICBcInpvcGZcIjpcIlxcdUQ4MzVcXHVERDZCXCIsXG4gIFwiWnNjclwiOlwiXFx1RDgzNVxcdURDQjVcIixcbiAgXCJ6c2NyXCI6XCJcXHVEODM1XFx1RENDRlwiLFxuICBcInp3alwiOlwiXFx1MjAwRFwiLFxuICBcInp3bmpcIjpcIlxcdTIwMENcIlxufTtcbiIsIi8vIExpc3Qgb2YgdmFsaWQgaHRtbCBibG9ja3MgbmFtZXMsIGFjY29ydGluZyB0byBjb21tb25tYXJrIHNwZWNcbi8vIGh0dHA6Ly9qZ20uZ2l0aHViLmlvL0NvbW1vbk1hcmsvc3BlYy5odG1sI2h0bWwtYmxvY2tzXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGh0bWxfYmxvY2tzID0ge307XG5cbltcbiAgJ2FydGljbGUnLFxuICAnYXNpZGUnLFxuICAnYnV0dG9uJyxcbiAgJ2Jsb2NrcXVvdGUnLFxuICAnYm9keScsXG4gICdjYW52YXMnLFxuICAnY2FwdGlvbicsXG4gICdjb2wnLFxuICAnY29sZ3JvdXAnLFxuICAnZGQnLFxuICAnZGl2JyxcbiAgJ2RsJyxcbiAgJ2R0JyxcbiAgJ2VtYmVkJyxcbiAgJ2ZpZWxkc2V0JyxcbiAgJ2ZpZ2NhcHRpb24nLFxuICAnZmlndXJlJyxcbiAgJ2Zvb3RlcicsXG4gICdmb3JtJyxcbiAgJ2gxJyxcbiAgJ2gyJyxcbiAgJ2gzJyxcbiAgJ2g0JyxcbiAgJ2g1JyxcbiAgJ2g2JyxcbiAgJ2hlYWRlcicsXG4gICdoZ3JvdXAnLFxuICAnaHInLFxuICAnaWZyYW1lJyxcbiAgJ2xpJyxcbiAgJ21hcCcsXG4gICdvYmplY3QnLFxuICAnb2wnLFxuICAnb3V0cHV0JyxcbiAgJ3AnLFxuICAncHJlJyxcbiAgJ3Byb2dyZXNzJyxcbiAgJ3NjcmlwdCcsXG4gICdzZWN0aW9uJyxcbiAgJ3N0eWxlJyxcbiAgJ3RhYmxlJyxcbiAgJ3Rib2R5JyxcbiAgJ3RkJyxcbiAgJ3RleHRhcmVhJyxcbiAgJ3Rmb290JyxcbiAgJ3RoJyxcbiAgJ3RyJyxcbiAgJ3RoZWFkJyxcbiAgJ3VsJyxcbiAgJ3ZpZGVvJ1xuXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7IGh0bWxfYmxvY2tzW25hbWVdID0gdHJ1ZTsgfSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBodG1sX2Jsb2NrcztcbiIsIi8vIFJlZ2V4cHMgdG8gbWF0Y2ggaHRtbCBlbGVtZW50c1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhdHRyX25hbWUgICAgID0gJ1thLXpBLVpfOl1bYS16QS1aMC05Oi5fLV0qJztcblxudmFyIHVucXVvdGVkICAgICAgPSAnW15cIlxcJz08PmBcXFxceDAwLVxcXFx4MjBdKyc7XG52YXIgc2luZ2xlX3F1b3RlZCA9IFwiJ1teJ10qJ1wiO1xudmFyIGRvdWJsZV9xdW90ZWQgPSAnXCJbXlwiXSpcIic7XG5cbnZhciBhdHRyX3ZhbHVlICA9ICcoPzonICsgdW5xdW90ZWQgKyAnfCcgKyBzaW5nbGVfcXVvdGVkICsgJ3wnICsgZG91YmxlX3F1b3RlZCArICcpJztcblxudmFyIGF0dHJpYnV0ZSAgID0gJyg/OlxcXFxzKycgKyBhdHRyX25hbWUgKyAnKD86XFxcXHMqPVxcXFxzKicgKyBhdHRyX3ZhbHVlICsgJyk/KSc7XG5cbnZhciBvcGVuX3RhZyAgICA9ICc8W0EtWmEtel1bQS1aYS16MC05XFxcXC1dKicgKyBhdHRyaWJ1dGUgKyAnKlxcXFxzKlxcXFwvPz4nO1xuXG52YXIgY2xvc2VfdGFnICAgPSAnPFxcXFwvW0EtWmEtel1bQS1aYS16MC05XFxcXC1dKlxcXFxzKj4nO1xudmFyIGNvbW1lbnQgICAgID0gJzwhLS0tLT58PCEtLSg/Oi0/W14+LV0pKD86LT9bXi1dKSotLT4nO1xudmFyIHByb2Nlc3NpbmcgID0gJzxbP10uKj9bP10+JztcbnZhciBkZWNsYXJhdGlvbiA9ICc8IVtBLVpdK1xcXFxzK1tePl0qPic7XG52YXIgY2RhdGEgICAgICAgPSAnPCFcXFxcW0NEQVRBXFxcXFtbXFxcXHNcXFxcU10qP1xcXFxdXFxcXF0+JztcblxudmFyIEhUTUxfVEFHX1JFID0gbmV3IFJlZ0V4cCgnXig/OicgKyBvcGVuX3RhZyArICd8JyArIGNsb3NlX3RhZyArICd8JyArIGNvbW1lbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3wnICsgcHJvY2Vzc2luZyArICd8JyArIGRlY2xhcmF0aW9uICsgJ3wnICsgY2RhdGEgKyAnKScpO1xuXG5tb2R1bGUuZXhwb3J0cy5IVE1MX1RBR19SRSA9IEhUTUxfVEFHX1JFO1xuIiwiLy8gTGlzdCBvZiB2YWxpZCB1cmwgc2NoZW1hcywgYWNjb3J0aW5nIHRvIGNvbW1vbm1hcmsgc3BlY1xuLy8gaHR0cDovL2pnbS5naXRodWIuaW8vQ29tbW9uTWFyay9zcGVjLmh0bWwjYXV0b2xpbmtzXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvYXAnLFxuICAnZG9pJyxcbiAgJ2phdmFzY3JpcHQnLFxuICAnYWFhJyxcbiAgJ2FhYXMnLFxuICAnYWJvdXQnLFxuICAnYWNhcCcsXG4gICdjYXAnLFxuICAnY2lkJyxcbiAgJ2NyaWQnLFxuICAnZGF0YScsXG4gICdkYXYnLFxuICAnZGljdCcsXG4gICdkbnMnLFxuICAnZmlsZScsXG4gICdmdHAnLFxuICAnZ2VvJyxcbiAgJ2dvJyxcbiAgJ2dvcGhlcicsXG4gICdoMzIzJyxcbiAgJ2h0dHAnLFxuICAnaHR0cHMnLFxuICAnaWF4JyxcbiAgJ2ljYXAnLFxuICAnaW0nLFxuICAnaW1hcCcsXG4gICdpbmZvJyxcbiAgJ2lwcCcsXG4gICdpcmlzJyxcbiAgJ2lyaXMuYmVlcCcsXG4gICdpcmlzLnhwYycsXG4gICdpcmlzLnhwY3MnLFxuICAnaXJpcy5sd3onLFxuICAnbGRhcCcsXG4gICdtYWlsdG8nLFxuICAnbWlkJyxcbiAgJ21zcnAnLFxuICAnbXNycHMnLFxuICAnbXRxcCcsXG4gICdtdXBkYXRlJyxcbiAgJ25ld3MnLFxuICAnbmZzJyxcbiAgJ25pJyxcbiAgJ25paCcsXG4gICdubnRwJyxcbiAgJ29wYXF1ZWxvY2t0b2tlbicsXG4gICdwb3AnLFxuICAncHJlcycsXG4gICdydHNwJyxcbiAgJ3NlcnZpY2UnLFxuICAnc2Vzc2lvbicsXG4gICdzaHR0cCcsXG4gICdzaWV2ZScsXG4gICdzaXAnLFxuICAnc2lwcycsXG4gICdzbXMnLFxuICAnc25tcCcsXG4gICdzb2FwLmJlZXAnLFxuICAnc29hcC5iZWVwcycsXG4gICd0YWcnLFxuICAndGVsJyxcbiAgJ3RlbG5ldCcsXG4gICd0ZnRwJyxcbiAgJ3RoaXNtZXNzYWdlJyxcbiAgJ3RuMzI3MCcsXG4gICd0aXAnLFxuICAndHYnLFxuICAndXJuJyxcbiAgJ3ZlbW1pJyxcbiAgJ3dzJyxcbiAgJ3dzcycsXG4gICd4Y29uJyxcbiAgJ3hjb24tdXNlcmlkJyxcbiAgJ3htbHJwYy5iZWVwJyxcbiAgJ3htbHJwYy5iZWVwcycsXG4gICd4bXBwJyxcbiAgJ3ozOS41MHInLFxuICAnejM5LjUwcycsXG4gICdhZGl1bXh0cmEnLFxuICAnYWZwJyxcbiAgJ2FmcycsXG4gICdhaW0nLFxuICAnYXB0JyxcbiAgJ2F0dGFjaG1lbnQnLFxuICAnYXcnLFxuICAnYmVzaGFyZScsXG4gICdiaXRjb2luJyxcbiAgJ2JvbG8nLFxuICAnY2FsbHRvJyxcbiAgJ2Nocm9tZScsXG4gICdjaHJvbWUtZXh0ZW5zaW9uJyxcbiAgJ2NvbS1ldmVudGJyaXRlLWF0dGVuZGVlJyxcbiAgJ2NvbnRlbnQnLFxuICAnY3ZzJyxcbiAgJ2RsbmEtcGxheXNpbmdsZScsXG4gICdkbG5hLXBsYXljb250YWluZXInLFxuICAnZHRuJyxcbiAgJ2R2YicsXG4gICdlZDJrJyxcbiAgJ2ZhY2V0aW1lJyxcbiAgJ2ZlZWQnLFxuICAnZmluZ2VyJyxcbiAgJ2Zpc2gnLFxuICAnZ2cnLFxuICAnZ2l0JyxcbiAgJ2dpem1vcHJvamVjdCcsXG4gICdndGFsaycsXG4gICdoY3AnLFxuICAnaWNvbicsXG4gICdpcG4nLFxuICAnaXJjJyxcbiAgJ2lyYzYnLFxuICAnaXJjcycsXG4gICdpdG1zJyxcbiAgJ2phcicsXG4gICdqbXMnLFxuICAna2V5cGFyYycsXG4gICdsYXN0Zm0nLFxuICAnbGRhcHMnLFxuICAnbWFnbmV0JyxcbiAgJ21hcHMnLFxuICAnbWFya2V0JyxcbiAgJ21lc3NhZ2UnLFxuICAnbW1zJyxcbiAgJ21zLWhlbHAnLFxuICAnbXNuaW0nLFxuICAnbXVtYmxlJyxcbiAgJ212bicsXG4gICdub3RlcycsXG4gICdvaWQnLFxuICAncGFsbScsXG4gICdwYXBhcmF6emknLFxuICAncGxhdGZvcm0nLFxuICAncHJveHknLFxuICAncHN5YycsXG4gICdxdWVyeScsXG4gICdyZXMnLFxuICAncmVzb3VyY2UnLFxuICAncm1pJyxcbiAgJ3JzeW5jJyxcbiAgJ3J0bXAnLFxuICAnc2Vjb25kbGlmZScsXG4gICdzZnRwJyxcbiAgJ3NnbicsXG4gICdza3lwZScsXG4gICdzbWInLFxuICAnc29sZGF0JyxcbiAgJ3Nwb3RpZnknLFxuICAnc3NoJyxcbiAgJ3N0ZWFtJyxcbiAgJ3N2bicsXG4gICd0ZWFtc3BlYWsnLFxuICAndGhpbmdzJyxcbiAgJ3VkcCcsXG4gICd1bnJlYWwnLFxuICAndXQyMDA0JyxcbiAgJ3ZlbnRyaWxvJyxcbiAgJ3ZpZXctc291cmNlJyxcbiAgJ3dlYmNhbCcsXG4gICd3dGFpJyxcbiAgJ3d5Y2l3eWcnLFxuICAneGZpcmUnLFxuICAneHJpJyxcbiAgJ3ltc2dyJ1xuXTtcbiIsIi8vIFV0aWxpdGllc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG5mdW5jdGlvbiBfY2xhc3Mob2JqKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTsgfVxuXG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBTdHJpbmddJzsgfVxuXG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbi8vIE1lcmdlIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc291cmNlICsgJ211c3QgYmUgb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbi8vIFJlbW92ZSBlbGVtZW50IGZyb20gYXJyYXkgYW5kIHB1dCBhbm90aGVyIGFycmF5IGF0IHRob3NlIHBvc2l0aW9uLlxuLy8gVXNlZnVsIGZvciBzb21lIG9wZXJhdGlvbnMgd2l0aCB0b2tlbnNcbmZ1bmN0aW9uIGFycmF5UmVwbGFjZUF0KHNyYywgcG9zLCBuZXdFbGVtZW50cykge1xuICByZXR1cm4gW10uY29uY2F0KHNyYy5zbGljZSgwLCBwb3MpLCBuZXdFbGVtZW50cywgc3JjLnNsaWNlKHBvcyArIDEpKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIFVORVNDQVBFX01EX1JFID0gL1xcXFwoWyFcIiMkJSYnKCkqKyxcXC0uXFwvOjs8PT4/QFtcXFxcXFxdXl9ge3x9fl0pL2c7XG5cbmZ1bmN0aW9uIHVuZXNjYXBlTWQoc3RyKSB7XG4gIGlmIChzdHIuaW5kZXhPZignXFxcXCcpIDwgMCkgeyByZXR1cm4gc3RyOyB9XG4gIHJldHVybiBzdHIucmVwbGFjZShVTkVTQ0FQRV9NRF9SRSwgJyQxJyk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGlzVmFsaWRFbnRpdHlDb2RlKGMpIHtcbiAgLyplc2xpbnQgbm8tYml0d2lzZTowKi9cbiAgLy8gYnJva2VuIHNlcXVlbmNlXG4gIGlmIChjID49IDB4RDgwMCAmJiBjIDw9IDB4REZGRikgeyByZXR1cm4gZmFsc2U7IH1cbiAgLy8gbmV2ZXIgdXNlZFxuICBpZiAoYyA+PSAweEZERDAgJiYgYyA8PSAweEZERUYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICgoYyAmIDB4RkZGRikgPT09IDB4RkZGRiB8fCAoYyAmIDB4RkZGRikgPT09IDB4RkZGRSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgLy8gY29udHJvbCBjb2Rlc1xuICBpZiAoYyA+PSAweDAwICYmIGMgPD0gMHgwOCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGMgPT09IDB4MEIpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChjID49IDB4MEUgJiYgYyA8PSAweDFGKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoYyA+PSAweDdGICYmIGMgPD0gMHg5RikgeyByZXR1cm4gZmFsc2U7IH1cbiAgLy8gb3V0IG9mIHJhbmdlXG4gIGlmIChjID4gMHgxMEZGRkYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBmcm9tQ29kZVBvaW50KGMpIHtcbiAgLyplc2xpbnQgbm8tYml0d2lzZTowKi9cbiAgaWYgKGMgPiAweGZmZmYpIHtcbiAgICBjIC09IDB4MTAwMDA7XG4gICAgdmFyIHN1cnJvZ2F0ZTEgPSAweGQ4MDAgKyAoYyA+PiAxMCksXG4gICAgICAgIHN1cnJvZ2F0ZTIgPSAweGRjMDAgKyAoYyAmIDB4M2ZmKTtcblxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHN1cnJvZ2F0ZTEsIHN1cnJvZ2F0ZTIpO1xuICB9XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xufVxuXG52YXIgTkFNRURfRU5USVRZX1JFICAgPSAvJihbYS16I11bYS16MC05XXsxLDMxfSk7L2dpO1xudmFyIERJR0lUQUxfRU5USVRZX1RFU1RfUkUgPSAvXiMoKD86eFthLWYwLTldezEsOH18WzAtOV17MSw4fSkpL2k7XG52YXIgZW50aXRpZXMgPSByZXF1aXJlKCcuL2VudGl0aWVzJyk7XG5cbmZ1bmN0aW9uIHJlcGxhY2VFbnRpdHlQYXR0ZXJuKG1hdGNoLCBuYW1lKSB7XG4gIHZhciBjb2RlID0gMDtcblxuICBpZiAoaGFzKGVudGl0aWVzLCBuYW1lKSkge1xuICAgIHJldHVybiBlbnRpdGllc1tuYW1lXTtcbiAgfSBlbHNlIGlmIChuYW1lLmNoYXJDb2RlQXQoMCkgPT09IDB4MjMvKiAjICovICYmIERJR0lUQUxfRU5USVRZX1RFU1RfUkUudGVzdChuYW1lKSkge1xuICAgIGNvZGUgPSBuYW1lWzFdLnRvTG93ZXJDYXNlKCkgPT09ICd4JyA/XG4gICAgICBwYXJzZUludChuYW1lLnNsaWNlKDIpLCAxNilcbiAgICA6XG4gICAgICBwYXJzZUludChuYW1lLnNsaWNlKDEpLCAxMCk7XG4gICAgaWYgKGlzVmFsaWRFbnRpdHlDb2RlKGNvZGUpKSB7XG4gICAgICByZXR1cm4gZnJvbUNvZGVQb2ludChjb2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlRW50aXRpZXMoc3RyKSB7XG4gIGlmIChzdHIuaW5kZXhPZignJicpIDwgMCkgeyByZXR1cm4gc3RyOyB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKE5BTUVEX0VOVElUWV9SRSwgcmVwbGFjZUVudGl0eVBhdHRlcm4pO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgSFRNTF9FU0NBUEVfVEVTVF9SRSA9IC9bJjw+XCJdLztcbnZhciBIVE1MX0VTQ0FQRV9SRVBMQUNFX1JFID0gL1smPD5cIl0vZztcbnZhciBIVE1MX1JFUExBQ0VNRU5UUyA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnXG59O1xuXG5mdW5jdGlvbiByZXBsYWNlVW5zYWZlQ2hhcihjaCkge1xuICByZXR1cm4gSFRNTF9SRVBMQUNFTUVOVFNbY2hdO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICBpZiAoSFRNTF9FU0NBUEVfVEVTVF9SRS50ZXN0KHN0cikpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoSFRNTF9FU0NBUEVfUkVQTEFDRV9SRSwgcmVwbGFjZVVuc2FmZUNoYXIpO1xuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBTVVJST1JBVEVfVEVTVF9SRSAgID0gL1tcXHVEODAwLVxcdURGRkZdLztcbnZhciBTVVJST1JBVEVfU0VBUkNIX1JFID0gL1tcXHVEODAwLVxcdURGRkZdL2c7XG5cbmZ1bmN0aW9uIHJlcGxhY2VCYWRTdXJyb2dhdGUoY2gsIHBvcywgb3JpZykge1xuICB2YXIgY29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XG5cbiAgaWYgKGNvZGUgPj0gMHhEODAwICYmIGNvZGUgPD0gMHhEQkZGKSB7XG4gICAgLy8gaGlnaCBzdXJyb2dhdGVcbiAgICBpZiAocG9zID49IG9yaWcubGVuZ3RoIC0gMSkgeyByZXR1cm4gJ1xcdUZGRkQnOyB9XG4gICAgY29kZSA9IG9yaWcuY2hhckNvZGVBdChwb3MgKyAxKTtcbiAgICBpZiAoY29kZSA8IDB4REMwMCB8fCBjb2RlID4gMHhERkZGKSB7IHJldHVybiAnXFx1RkZGRCc7IH1cblxuICAgIHJldHVybiBjaDtcbiAgfVxuXG4gIC8vIGxvdyBzdXJyb2dhdGVcbiAgaWYgKHBvcyA9PT0gMCkgeyByZXR1cm4gJ1xcdUZGRkQnOyB9XG4gIGNvZGUgPSBvcmlnLmNoYXJDb2RlQXQocG9zIC0gMSk7XG4gIGlmIChjb2RlIDwgMHhEODAwIHx8IGNvZGUgPiAweERCRkYpIHsgcmV0dXJuICdcXHVGRkZEJzsgfVxuICByZXR1cm4gY2g7XG59XG5cbmZ1bmN0aW9uIGZpeEJyb2tlblN1cnJvZ2F0ZXMoc3RyKSB7XG4gIGlmICghU1VSUk9SQVRFX1RFU1RfUkUudGVzdChzdHIpKSB7IHJldHVybiBzdHI7IH1cblxuICByZXR1cm4gc3RyLnJlcGxhY2UoU1VSUk9SQVRFX1NFQVJDSF9SRSwgcmVwbGFjZUJhZFN1cnJvZ2F0ZSk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8gSW5jb21pbmcgbGluayBjYW4gYmUgcGFydGlhbGx5IGVuY29kZWQuIENvbnZlcnQgcG9zc2libGUgY29tYmluYXRpb25zIHRvXG4vLyB1bmlmaWVkIGZvcm0uXG4vL1xuLy8gVE9ETzogUmV3cml0ZSBpdC4gU2hvdWxkIHVzZTpcbi8vXG4vLyAtIGVuY29kZVVSSUNvbXBvbmVudCBmb3IgcXVlcnlcbi8vIC0gZW5jb2RlVVJJIGZvciBwYXRoXG4vLyAtICg/KSBwdW5pY29kZSBmb3IgZG9tYWluIG1hbWUgKGJ1dCBlbmNvZGVVUkkgc2VlbXMgdG8gd29yayBpbiByZWFsIHdvcmxkKVxuLy9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxpbmsodXJsKSB7XG4gIHZhciBub3JtYWxpemVkID0gcmVwbGFjZUVudGl0aWVzKHVybCk7XG5cbiAgLy8gV2UgZG9uJ3QgY2FyZSBtdWNoIGFib3V0IHJlc3VsdCBvZiBtYWlsZm9ybWVkIFVSSXMsXG4gIC8vIGJ1dCBzaG91ZCBub3QgdGhyb3cgZXhjZXB0aW9uLlxuICB0cnkge1xuICAgIG5vcm1hbGl6ZWQgPSBkZWNvZGVVUkkobm9ybWFsaXplZCk7XG4gIH0gY2F0Y2ggKF9fKSB7fVxuXG4gIC8vIEVuY29kZXIgdGhyb3dzIGV4Y2VwdGlvbiBvbiBicm9rZW4gc3Vycm9nYXRlIHBhaXJzLlxuICAvLyBGaXggdGhvc2UgZmlyc3QuXG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZW5jb2RlVVJJKGZpeEJyb2tlblN1cnJvZ2F0ZXMobm9ybWFsaXplZCkpO1xuICB9IGNhdGNoIChfXykge1xuICAgIC8vIFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbiBhbmQgbGVmdCBmb3Igc2FmZXR5IG9ubHkuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dCovXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBSRUdFWFBfRVNDQVBFX1JFID0gL1suPyorXiRbXFxdXFxcXCgpe318LV0vZztcblxuZnVuY3Rpb24gZXNjYXBlUkUgKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHRVhQX0VTQ0FQRV9SRSwgJ1xcXFwkJicpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyBacyAodW5pY29kZSBjbGFzcykgfHwgW1xcdFxcZlxcdlxcclxcbl1cbmZ1bmN0aW9uIGlzV2hpdGVTcGFjZShjb2RlKSB7XG4gIGlmIChjb2RlID49IDB4MjAwMCAmJiBjb2RlIDw9IDB4MjAwQSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBzd2l0Y2ggKGNvZGUpIHtcbiAgICBjYXNlIDB4MDk6IC8vIFxcdFxuICAgIGNhc2UgMHgwQTogLy8gXFxuXG4gICAgY2FzZSAweDBCOiAvLyBcXHZcbiAgICBjYXNlIDB4MEM6IC8vIFxcZlxuICAgIGNhc2UgMHgwRDogLy8gXFxyXG4gICAgY2FzZSAweDIwOlxuICAgIGNhc2UgMHhBMDpcbiAgICBjYXNlIDB4MTY4MDpcbiAgICBjYXNlIDB4MjAyRjpcbiAgICBjYXNlIDB4MjA1RjpcbiAgICBjYXNlIDB4MzAwMDpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyplc2xpbnQtZGlzYWJsZSBtYXgtbGVuKi9cbnZhciBVTklDT0RFX1BVTkNUX1JFID0gcmVxdWlyZSgndWMubWljcm8vY2F0ZWdvcmllcy9QL3JlZ2V4Jyk7XG5cbi8vIEN1cnJlbnRseSB3aXRob3V0IGFzdHJhbCBjaGFyYWN0ZXJzIHN1cHBvcnQuXG5mdW5jdGlvbiBpc1B1bmN0Q2hhcihjaGFyKSB7XG4gIHJldHVybiBVTklDT0RFX1BVTkNUX1JFLnRlc3QoY2hhcik7XG59XG5cblxuLy8gTWFya2Rvd24gQVNDSUkgcHVuY3R1YXRpb24gY2hhcmFjdGVycy5cbi8vXG4vLyAhLCBcIiwgIywgJCwgJSwgJiwgJywgKCwgKSwgKiwgKywgLCwgLSwgLiwgLywgOiwgOywgPCwgPSwgPiwgPywgQCwgWywgXFwsIF0sIF4sIF8sIGAsIHssIHwsIH0sIG9yIH5cbi8vIGh0dHA6Ly9zcGVjLmNvbW1vbm1hcmsub3JnLzAuMTUvI2FzY2lpLXB1bmN0dWF0aW9uLWNoYXJhY3RlclxuLy9cbi8vIERvbid0IGNvbmZ1c2Ugd2l0aCB1bmljb2RlIHB1bmN0dWF0aW9uICEhISBJdCBsYWNrcyBzb21lIGNoYXJzIGluIGFzY2lpIHJhbmdlLlxuLy9cbmZ1bmN0aW9uIGlzTWRBc2NpaVB1bmN0KGNoKSB7XG4gIHN3aXRjaCAoY2gpIHtcbiAgICBjYXNlIDB4MjEvKiAhICovOlxuICAgIGNhc2UgMHgyMi8qIFwiICovOlxuICAgIGNhc2UgMHgyMy8qICMgKi86XG4gICAgY2FzZSAweDI0LyogJCAqLzpcbiAgICBjYXNlIDB4MjUvKiAlICovOlxuICAgIGNhc2UgMHgyNi8qICYgKi86XG4gICAgY2FzZSAweDI3LyogJyAqLzpcbiAgICBjYXNlIDB4MjgvKiAoICovOlxuICAgIGNhc2UgMHgyOS8qICkgKi86XG4gICAgY2FzZSAweDJBLyogKiAqLzpcbiAgICBjYXNlIDB4MkIvKiArICovOlxuICAgIGNhc2UgMHgyQy8qICwgKi86XG4gICAgY2FzZSAweDJELyogLSAqLzpcbiAgICBjYXNlIDB4MkUvKiAuICovOlxuICAgIGNhc2UgMHgyRi8qIC8gKi86XG4gICAgY2FzZSAweDNBLyogOiAqLzpcbiAgICBjYXNlIDB4M0IvKiA7ICovOlxuICAgIGNhc2UgMHgzQy8qIDwgKi86XG4gICAgY2FzZSAweDNELyogPSAqLzpcbiAgICBjYXNlIDB4M0UvKiA+ICovOlxuICAgIGNhc2UgMHgzRi8qID8gKi86XG4gICAgY2FzZSAweDQwLyogQCAqLzpcbiAgICBjYXNlIDB4NUIvKiBbICovOlxuICAgIGNhc2UgMHg1Qy8qIFxcICovOlxuICAgIGNhc2UgMHg1RC8qIF0gKi86XG4gICAgY2FzZSAweDVFLyogXiAqLzpcbiAgICBjYXNlIDB4NUYvKiBfICovOlxuICAgIGNhc2UgMHg2MC8qIGAgKi86XG4gICAgY2FzZSAweDdCLyogeyAqLzpcbiAgICBjYXNlIDB4N0MvKiB8ICovOlxuICAgIGNhc2UgMHg3RC8qIH0gKi86XG4gICAgY2FzZSAweDdFLyogfiAqLzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gSGVwbGVyIHRvIHVuaWZ5IFtyZWZlcmVuY2UgbGFiZWxzXS5cbi8vXG5mdW5jdGlvbiBub3JtYWxpemVSZWZlcmVuY2Uoc3RyKSB7XG4gIC8vIHVzZSAudG9VcHBlckNhc2UoKSBpbnN0ZWFkIG9mIC50b0xvd2VyQ2FzZSgpXG4gIC8vIGhlcmUgdG8gYXZvaWQgYSBjb25mbGljdCB3aXRoIE9iamVjdC5wcm90b3R5cGVcbiAgLy8gbWVtYmVycyAobW9zdCBub3RhYmx5LCBgX19wcm90b19fYClcbiAgcmV0dXJuIHN0ci50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRvVXBwZXJDYXNlKCk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuYXNzaWduICAgICAgICAgICAgICA9IGFzc2lnbjtcbmV4cG9ydHMuaXNTdHJpbmcgICAgICAgICAgICA9IGlzU3RyaW5nO1xuZXhwb3J0cy5oYXMgICAgICAgICAgICAgICAgID0gaGFzO1xuZXhwb3J0cy51bmVzY2FwZU1kICAgICAgICAgID0gdW5lc2NhcGVNZDtcbmV4cG9ydHMuaXNWYWxpZEVudGl0eUNvZGUgICA9IGlzVmFsaWRFbnRpdHlDb2RlO1xuZXhwb3J0cy5mcm9tQ29kZVBvaW50ICAgICAgID0gZnJvbUNvZGVQb2ludDtcbmV4cG9ydHMucmVwbGFjZUVudGl0aWVzICAgICA9IHJlcGxhY2VFbnRpdGllcztcbmV4cG9ydHMuZXNjYXBlSHRtbCAgICAgICAgICA9IGVzY2FwZUh0bWw7XG5leHBvcnRzLmFycmF5UmVwbGFjZUF0ICAgICAgPSBhcnJheVJlcGxhY2VBdDtcbmV4cG9ydHMubm9ybWFsaXplTGluayAgICAgICA9IG5vcm1hbGl6ZUxpbms7XG5leHBvcnRzLmlzV2hpdGVTcGFjZSAgICAgICAgPSBpc1doaXRlU3BhY2U7XG5leHBvcnRzLmlzTWRBc2NpaVB1bmN0ICAgICAgPSBpc01kQXNjaWlQdW5jdDtcbmV4cG9ydHMuaXNQdW5jdENoYXIgICAgICAgICA9IGlzUHVuY3RDaGFyO1xuZXhwb3J0cy5lc2NhcGVSRSAgICAgICAgICAgID0gZXNjYXBlUkU7XG5leHBvcnRzLm5vcm1hbGl6ZVJlZmVyZW5jZSAgPSBub3JtYWxpemVSZWZlcmVuY2U7XG5cbi8vIGZvciB0ZXN0aW5nIG9ubHlcbmV4cG9ydHMuZml4QnJva2VuU3Vycm9nYXRlcyA9IGZpeEJyb2tlblN1cnJvZ2F0ZXM7XG4iLCIvLyBKdXN0IGEgc2hvcnRjdXQgZm9yIGJ1bGsgZXhwb3J0XG4ndXNlIHN0cmljdCc7XG5cblxuZXhwb3J0cy5wYXJzZUxpbmtMYWJlbCAgICAgICA9IHJlcXVpcmUoJy4vcGFyc2VfbGlua19sYWJlbCcpO1xuZXhwb3J0cy5wYXJzZUxpbmtEZXN0aW5hdGlvbiA9IHJlcXVpcmUoJy4vcGFyc2VfbGlua19kZXN0aW5hdGlvbicpO1xuZXhwb3J0cy5wYXJzZUxpbmtUaXRsZSAgICAgICA9IHJlcXVpcmUoJy4vcGFyc2VfbGlua190aXRsZScpO1xuIiwiLy8gUGFyc2UgbGluayBkZXN0aW5hdGlvblxuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgbm9ybWFsaXplTGluayA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLm5vcm1hbGl6ZUxpbms7XG52YXIgdW5lc2NhcGVNZCAgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLnVuZXNjYXBlTWQ7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUxpbmtEZXN0aW5hdGlvbihzdHIsIHBvcywgbWF4KSB7XG4gIHZhciBjb2RlLCBsZXZlbCxcbiAgICAgIGxpbmVzID0gMCxcbiAgICAgIHN0YXJ0ID0gcG9zLFxuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIHBvczogMCxcbiAgICAgICAgbGluZXM6IDAsXG4gICAgICAgIHN0cjogJydcbiAgICAgIH07XG5cbiAgaWYgKHN0ci5jaGFyQ29kZUF0KHBvcykgPT09IDB4M0MgLyogPCAqLykge1xuICAgIHBvcysrO1xuICAgIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICAgIGNvZGUgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgPT09IDB4MEEgLyogXFxuICovKSB7IHJldHVybiByZXN1bHQ7IH1cbiAgICAgIGlmIChjb2RlID09PSAweDNFIC8qID4gKi8pIHtcbiAgICAgICAgcmVzdWx0LnBvcyA9IHBvcyArIDE7XG4gICAgICAgIHJlc3VsdC5zdHIgPSBub3JtYWxpemVMaW5rKHVuZXNjYXBlTWQoc3RyLnNsaWNlKHN0YXJ0ICsgMSwgcG9zKSkpO1xuICAgICAgICByZXN1bHQub2sgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDB4NUMgLyogXFwgKi8gJiYgcG9zICsgMSA8IG1heCkge1xuICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHBvcysrO1xuICAgIH1cblxuICAgIC8vIG5vIGNsb3NpbmcgJz4nXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIHRoaXMgc2hvdWxkIGJlIC4uLiB9IGVsc2UgeyAuLi4gYnJhbmNoXG5cbiAgbGV2ZWwgPSAwO1xuICB3aGlsZSAocG9zIDwgbWF4KSB7XG4gICAgY29kZSA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoY29kZSA9PT0gMHgyMCkgeyBicmVhazsgfVxuXG4gICAgLy8gYXNjaWkgY29udHJvbCBjaGFyYWN0ZXJzXG4gICAgaWYgKGNvZGUgPCAweDIwIHx8IGNvZGUgPT09IDB4N0YpIHsgYnJlYWs7IH1cblxuICAgIGlmIChjb2RlID09PSAweDVDIC8qIFxcICovICYmIHBvcyArIDEgPCBtYXgpIHtcbiAgICAgIHBvcyArPSAyO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IDB4MjggLyogKCAqLykge1xuICAgICAgbGV2ZWwrKztcbiAgICAgIGlmIChsZXZlbCA+IDEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gMHgyOSAvKiApICovKSB7XG4gICAgICBsZXZlbC0tO1xuICAgICAgaWYgKGxldmVsIDwgMCkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIHBvcysrO1xuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSBwb3MpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gIHJlc3VsdC5zdHIgPSBub3JtYWxpemVMaW5rKHVuZXNjYXBlTWQoc3RyLnNsaWNlKHN0YXJ0LCBwb3MpKSk7XG4gIHJlc3VsdC5saW5lcyA9IGxpbmVzO1xuICByZXN1bHQucG9zID0gcG9zO1xuICByZXN1bHQub2sgPSB0cnVlO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIFBhcnNlIGxpbmsgbGFiZWxcbi8vXG4vLyB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBmaXJzdCBjaGFyYWN0ZXIgKFwiW1wiKSBhbHJlYWR5IG1hdGNoZXM7XG4vLyByZXR1cm5zIHRoZSBlbmQgb2YgdGhlIGxhYmVsXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua0xhYmVsKHN0YXRlLCBzdGFydCwgZGlzYWJsZU5lc3RlZCkge1xuICB2YXIgbGV2ZWwsIGZvdW5kLCBtYXJrZXIsIHByZXZQb3MsXG4gICAgICBsYWJlbEVuZCA9IC0xLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgb2xkUG9zID0gc3RhdGUucG9zO1xuXG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgMTtcbiAgbGV2ZWwgPSAxO1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBtYXgpIHtcbiAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpO1xuICAgIGlmIChtYXJrZXIgPT09IDB4NUQgLyogXSAqLykge1xuICAgICAgbGV2ZWwtLTtcbiAgICAgIGlmIChsZXZlbCA9PT0gMCkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByZXZQb3MgPSBzdGF0ZS5wb3M7XG4gICAgc3RhdGUubWQuaW5saW5lLnNraXBUb2tlbihzdGF0ZSk7XG4gICAgaWYgKG1hcmtlciA9PT0gMHg1QiAvKiBbICovKSB7XG4gICAgICBpZiAocHJldlBvcyA9PT0gc3RhdGUucG9zIC0gMSkge1xuICAgICAgICAvLyBpbmNyZWFzZSBsZXZlbCBpZiB3ZSBmaW5kIHRleHQgYFtgLCB3aGljaCBpcyBub3QgYSBwYXJ0IG9mIGFueSB0b2tlblxuICAgICAgICBsZXZlbCsrO1xuICAgICAgfSBlbHNlIGlmIChkaXNhYmxlTmVzdGVkKSB7XG4gICAgICAgIHN0YXRlLnBvcyA9IG9sZFBvcztcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChmb3VuZCkge1xuICAgIGxhYmVsRW5kID0gc3RhdGUucG9zO1xuICB9XG5cbiAgLy8gcmVzdG9yZSBvbGQgc3RhdGVcbiAgc3RhdGUucG9zID0gb2xkUG9zO1xuXG4gIHJldHVybiBsYWJlbEVuZDtcbn07XG4iLCIvLyBQYXJzZSBsaW5rIHRpdGxlXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciB1bmVzY2FwZU1kID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykudW5lc2NhcGVNZDtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua1RpdGxlKHN0ciwgcG9zLCBtYXgpIHtcbiAgdmFyIGNvZGUsXG4gICAgICBtYXJrZXIsXG4gICAgICBsaW5lcyA9IDAsXG4gICAgICBzdGFydCA9IHBvcyxcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBwb3M6IDAsXG4gICAgICAgIGxpbmVzOiAwLFxuICAgICAgICBzdHI6ICcnXG4gICAgICB9O1xuXG4gIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiByZXN1bHQ7IH1cblxuICBtYXJrZXIgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuXG4gIGlmIChtYXJrZXIgIT09IDB4MjIgLyogXCIgKi8gJiYgbWFya2VyICE9PSAweDI3IC8qICcgKi8gJiYgbWFya2VyICE9PSAweDI4IC8qICggKi8pIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gIHBvcysrO1xuXG4gIC8vIGlmIG9wZW5pbmcgbWFya2VyIGlzIFwiKFwiLCBzd2l0Y2ggaXQgdG8gY2xvc2luZyBtYXJrZXIgXCIpXCJcbiAgaWYgKG1hcmtlciA9PT0gMHgyOCkgeyBtYXJrZXIgPSAweDI5OyB9XG5cbiAgd2hpbGUgKHBvcyA8IG1heCkge1xuICAgIGNvZGUgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuICAgIGlmIChjb2RlID09PSBtYXJrZXIpIHtcbiAgICAgIHJlc3VsdC5wb3MgPSBwb3MgKyAxO1xuICAgICAgcmVzdWx0LmxpbmVzID0gbGluZXM7XG4gICAgICByZXN1bHQuc3RyID0gdW5lc2NhcGVNZChzdHIuc2xpY2Uoc3RhcnQgKyAxLCBwb3MpKTtcbiAgICAgIHJlc3VsdC5vayA9IHRydWU7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gMHgwQSkge1xuICAgICAgbGluZXMrKztcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDB4NUMgLyogXFwgKi8gJiYgcG9zICsgMSA8IG1heCkge1xuICAgICAgcG9zKys7XG4gICAgICBpZiAoc3RyLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgwQSkge1xuICAgICAgICBsaW5lcysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBvcysrO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBNYWluIHBlcnNlciBjbGFzc1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIHV0aWxzICAgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJyk7XG52YXIgaGVscGVycyAgICAgID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG52YXIgUmVuZGVyZXIgICAgID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpO1xudmFyIFBhcnNlckNvcmUgICA9IHJlcXVpcmUoJy4vcGFyc2VyX2NvcmUnKTtcbnZhciBQYXJzZXJCbG9jayAgPSByZXF1aXJlKCcuL3BhcnNlcl9ibG9jaycpO1xudmFyIFBhcnNlcklubGluZSA9IHJlcXVpcmUoJy4vcGFyc2VyX2lubGluZScpO1xuXG52YXIgY29uZmlnID0ge1xuICAnZGVmYXVsdCc6IHJlcXVpcmUoJy4vcHJlc2V0cy9kZWZhdWx0JyksXG4gIHplcm86IHJlcXVpcmUoJy4vcHJlc2V0cy96ZXJvJyksXG4gIGNvbW1vbm1hcms6IHJlcXVpcmUoJy4vcHJlc2V0cy9jb21tb25tYXJrJylcbn07XG5cblxuLyoqXG4gKiBjbGFzcyBNYXJrZG93bkl0XG4gKlxuICogTWFpbiBwYXJzZXIvcmVuZGVyZXIgY2xhc3MuXG4gKlxuICogIyMjIyMgVXNhZ2VcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBub2RlLmpzLCBcImNsYXNzaWNcIiB3YXk6XG4gKiB2YXIgTWFya2Rvd25JdCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JyksXG4gKiAgICAgbWQgPSBuZXcgTWFya2Rvd25JdCgpO1xuICogdmFyIHJlc3VsdCA9IG1kLnJlbmRlcignIyBtYXJrZG93bi1pdCBydWxlenohJyk7XG4gKlxuICogLy8gbm9kZS5qcywgdGhlIHNhbWUsIGJ1dCB3aXRoIHN1Z2FyOlxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICogdmFyIHJlc3VsdCA9IG1kLnJlbmRlcignIyBtYXJrZG93bi1pdCBydWxlenohJyk7XG4gKlxuICogLy8gYnJvd3NlciB3aXRob3V0IEFNRCwgYWRkZWQgdG8gXCJ3aW5kb3dcIiBvbiBzY3JpcHQgbG9hZFxuICogLy8gTm90ZSwgdGhlcmUgYXJlIG5vIGRhc2guXG4gKiB2YXIgbWQgPSB3aW5kb3cubWFya2Rvd25pdCgpO1xuICogdmFyIHJlc3VsdCA9IG1kLnJlbmRlcignIyBtYXJrZG93bi1pdCBydWxlenohJyk7XG4gKiBgYGBcbiAqXG4gKiBTaW5nbGUgbGluZSByZW5kZXJpbmcsIHdpdGhvdXQgcGFyYWdyYXBoIHdyYXA6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICogdmFyIHJlc3VsdCA9IG1kLnJlbmRlcklubGluZSgnX19tYXJrZG93bi1pdF9fIHJ1bGV6eiEnKTtcbiAqIGBgYFxuICoqL1xuXG4vKipcbiAqIG5ldyBNYXJrZG93bkl0KFtwcmVzZXROYW1lLCBvcHRpb25zXSlcbiAqIC0gcHJlc2V0TmFtZSAoU3RyaW5nKTogb3B0aW9uYWwsIGBjb21tb25tYXJrYCAvIGB6ZXJvYFxuICogLSBvcHRpb25zIChPYmplY3QpXG4gKlxuICogQ3JlYXRlcyBwYXJzZXIgaW5zdGFuc2Ugd2l0aCBnaXZlbiBjb25maWcuIENhbiBiZSBjYWxsZWQgd2l0aG91dCBgbmV3YC5cbiAqXG4gKiAjIyMjIyBwcmVzZXROYW1lXG4gKlxuICogTWFya2Rvd25JdCBwcm92aWRlcyBuYW1lZCBwcmVzZXRzIGFzIGEgY29udmVuaWVuY2UgdG8gcXVpY2tseVxuICogZW5hYmxlL2Rpc2FibGUgYWN0aXZlIHN5bnRheCBydWxlcyBhbmQgb3B0aW9ucyBmb3IgY29tbW9uIHVzZSBjYXNlcy5cbiAqXG4gKiAtIFtcImNvbW1vbm1hcmtcIl0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2Jsb2IvbWFzdGVyL2xpYi9wcmVzZXRzL2NvbW1vbm1hcmsuanMpIC1cbiAqICAgY29uZmlndXJlcyBwYXJzZXIgdG8gc3RyaWN0IFtDb21tb25NYXJrXShodHRwOi8vY29tbW9ubWFyay5vcmcvKSBtb2RlLlxuICogLSBbZGVmYXVsdF0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2Jsb2IvbWFzdGVyL2xpYi9wcmVzZXRzL2RlZmF1bHQuanMpIC1cbiAqICAgc2ltaWxhciB0byBHRk0sIHVzZWQgd2hlbiBubyBwcmVzZXQgbmFtZSBnaXZlbi4gRW5hYmxlcyBhbGwgYXZhaWxhYmxlIHJ1bGVzLFxuICogICBidXQgc3RpbGwgd2l0aG91dCBodG1sLCB0eXBvZ3JhcGhlciAmIGF1dG9saW5rZXIuXG4gKiAtIFtcInplcm9cIl0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2Jsb2IvbWFzdGVyL2xpYi9wcmVzZXRzL3plcm8uanMpIC1cbiAqICAgYWxsIHJ1bGVzIGRpc2FibGVkLiBVc2VmdWwgdG8gcXVpY2tseSBzZXR1cCB5b3VyIGNvbmZpZyB2aWEgYC5lbmFibGUoKWAuXG4gKiAgIEZvciBleGFtcGxlLCB3aGVuIHlvdSBuZWVkIG9ubHkgYGJvbGRgIGFuZCBgaXRhbGljYCBtYXJrdXAgYW5kIG5vdGhpbmcgZWxzZS5cbiAqXG4gKiAjIyMjIyBvcHRpb25zOlxuICpcbiAqIC0gX19odG1sX18gLSBgZmFsc2VgLiBTZXQgYHRydWVgIHRvIGVuYWJsZSBIVE1MIHRhZ3MgaW4gc291cmNlLiBCZSBjYXJlZnVsIVxuICogICBUaGF0J3Mgbm90IHNhZmUhIFlvdSBtYXkgbmVlZCBleHRlcm5hbCBzYW5pdGl6ZXIgdG8gcHJvdGVjdCBvdXRwdXQgZnJvbSBYU1MuXG4gKiAgIEl0J3MgYmV0dGVyIHRvIGV4dGVuZCBmZWF0dXJlcyB2aWEgcGx1Z2lucywgaW5zdGVhZCBvZiBlbmFibGluZyBIVE1MLlxuICogLSBfX3hodG1sT3V0X18gLSBgZmFsc2VgLiBTZXQgYHRydWVgIHRvIGFkZCAnLycgd2hlbiBjbG9zaW5nIHNpbmdsZSB0YWdzXG4gKiAgIChgPGJyIC8+YCkuIFRoaXMgaXMgbmVlZGVkIG9ubHkgZm9yIGZ1bGwgQ29tbW9uTWFyayBjb21wYXRpYmlsaXR5LiBJbiByZWFsXG4gKiAgIHdvcmxkIHlvdSB3aWxsIG5lZWQgSFRNTCBvdXRwdXQuXG4gKiAtIF9fYnJlYWtzX18gLSBgZmFsc2VgLiBTZXQgYHRydWVgIHRvIGNvbnZlcnQgYFxcbmAgaW4gcGFyYWdyYXBocyBpbnRvIGA8YnI+YC5cbiAqIC0gX19sYW5nUHJlZml4X18gLSBgbGFuZ3VhZ2UtYC4gQ1NTIGxhbmd1YWdlIGNsYXNzIHByZWZpeCBmb3IgZmVuY2VkIGJsb2Nrcy5cbiAqICAgQ2FuIGJlIHVzZWZ1bCBmb3IgZXh0ZXJuYWwgaGlnaGxpZ2h0ZXJzLlxuICogLSBfX2xpbmtpZnlfXyAtIGBmYWxzZWAuIFNldCBgdHJ1ZWAgdG8gYXV0b2NvbnZlcnQgVVJMLWxpa2UgdGV4dCB0byBsaW5rcy5cbiAqIC0gX190eXBvZ3JhcGhlcl9fICAtIGBmYWxzZWAuIFNldCBgdHJ1ZWAgdG8gZW5hYmxlIFtzb21lIGxhbmd1YWdlLW5ldXRyYWxcbiAqICAgcmVwbGFjZW1lbnRdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcnVsZXNfY29yZS9yZXBsYWNlbWVudHMuanMpICtcbiAqICAgcXVvdGVzIGJlYXV0aWZpY2F0aW9uIChzbWFydHF1b3RlcykuXG4gKiAtIF9fcXVvdGVzX18gLSBg4oCc4oCd4oCY4oCZYCwgc3RyaW5nLiBEb3VibGUgKyBzaW5nbGUgcXVvdGVzIHJlcGxhY2VtZW50IHBhaXJzLCB3aGVuXG4gKiAgIHR5cG9ncmFwaGVyIGVuYWJsZWQgYW5kIHNtYXJ0cXVvdGVzIG9uLiBTZXQgZG91YmxlcyB0byAnwqvCuycgZm9yIFJ1c3NpYW4sXG4gKiAgICfigJ7igJwnIGZvciBHZXJtYW4uXG4gKiAtIF9faGlnaGxpZ2h0X18gLSBgbnVsbGAuIEhpZ2hsaWdodGVyIGZ1bmN0aW9uIGZvciBmZW5jZWQgY29kZSBibG9ja3MuXG4gKiAgIEhpZ2hsaWdodGVyIGBmdW5jdGlvbiAoc3RyLCBsYW5nKWAgc2hvdWxkIHJldHVybiBlc2NhcGVkIEhUTUwuIEl0IGNhbiBhbHNvXG4gKiAgIHJldHVybiBlbXB0eSBzdHJpbmcgaWYgdGhlIHNvdXJjZSB3YXMgbm90IGNoYW5nZWQgYW5kIHNob3VsZCBiZSBlc2NhcGVkIGV4dGVybmFseS5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogLy8gY29tbW9ubWFyayBtb2RlXG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCdjb21tb25tYXJrJyk7XG4gKlxuICogLy8gZGVmYXVsdCBtb2RlXG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gKlxuICogLy8gZW5hYmxlIGV2ZXJ5dGhpbmdcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0Jykoe1xuICogICBodG1sOiB0cnVlLFxuICogICBsaW5raWZ5OiB0cnVlLFxuICogICB0eXBvZ3JhcGhlcjogdHJ1ZVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyBTeW50YXggaGlnaGxpZ2h0aW5nXG4gKlxuICogYGBganNcbiAqIHZhciBobGpzID0gcmVxdWlyZSgnaGlnaGxpZ2h0LmpzJykgLy8gaHR0cHM6Ly9oaWdobGlnaHRqcy5vcmcvXG4gKlxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSh7XG4gKiAgIGhpZ2hsaWdodDogZnVuY3Rpb24gKHN0ciwgbGFuZykge1xuICogICAgIGlmIChsYW5nICYmIGhsanMuZ2V0TGFuZ3VhZ2UobGFuZykpIHtcbiAqICAgICAgIHRyeSB7XG4gKiAgICAgICAgIHJldHVybiBobGpzLmhpZ2hsaWdodChsYW5nLCBzdHIpLnZhbHVlO1xuICogICAgICAgfSBjYXRjaCAoX18pIHt9XG4gKiAgICAgfVxuICpcbiAqICAgICB0cnkge1xuICogICAgICAgcmV0dXJuIGhsanMuaGlnaGxpZ2h0QXV0byhzdHIpLnZhbHVlO1xuICogICAgIH0gY2F0Y2ggKF9fKSB7fVxuICpcbiAqICAgICByZXR1cm4gJyc7IC8vIHVzZSBleHRlcm5hbCBkZWZhdWx0IGVzY2FwaW5nXG4gKiAgIH1cbiAqIH0pO1xuICogYGBgXG4gKiovXG5mdW5jdGlvbiBNYXJrZG93bkl0KHByZXNldE5hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hcmtkb3duSXQpKSB7XG4gICAgcmV0dXJuIG5ldyBNYXJrZG93bkl0KHByZXNldE5hbWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgaWYgKCF1dGlscy5pc1N0cmluZyhwcmVzZXROYW1lKSkge1xuICAgICAgb3B0aW9ucyA9IHByZXNldE5hbWUgfHwge307XG4gICAgICBwcmVzZXROYW1lID0gJ2RlZmF1bHQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I2lubGluZSAtPiBQYXJzZXJJbmxpbmVcbiAgICpcbiAgICogSW5zdGFuY2Ugb2YgW1tQYXJzZXJJbmxpbmVdXS4gWW91IG1heSBuZWVkIGl0IHRvIGFkZCBuZXcgcnVsZXMgd2hlblxuICAgKiB3cml0aW5nIHBsdWdpbnMuIEZvciBzaW1wbGUgcnVsZXMgY29udHJvbCB1c2UgW1tNYXJrZG93bkl0LmRpc2FibGVdXSBhbmRcbiAgICogW1tNYXJrZG93bkl0LmVuYWJsZV1dLlxuICAgKiovXG4gIHRoaXMuaW5saW5lID0gbmV3IFBhcnNlcklubGluZSgpO1xuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I2Jsb2NrIC0+IFBhcnNlckJsb2NrXG4gICAqXG4gICAqIEluc3RhbmNlIG9mIFtbUGFyc2VyQmxvY2tdXS4gWW91IG1heSBuZWVkIGl0IHRvIGFkZCBuZXcgcnVsZXMgd2hlblxuICAgKiB3cml0aW5nIHBsdWdpbnMuIEZvciBzaW1wbGUgcnVsZXMgY29udHJvbCB1c2UgW1tNYXJrZG93bkl0LmRpc2FibGVdXSBhbmRcbiAgICogW1tNYXJrZG93bkl0LmVuYWJsZV1dLlxuICAgKiovXG4gIHRoaXMuYmxvY2sgPSBuZXcgUGFyc2VyQmxvY2soKTtcblxuICAvKipcbiAgICogTWFya2Rvd25JdCNjb3JlIC0+IENvcmVcbiAgICpcbiAgICogSW5zdGFuY2Ugb2YgW1tDb3JlXV0gY2hhaW4gZXhlY3V0b3IuIFlvdSBtYXkgbmVlZCBpdCB0byBhZGQgbmV3IHJ1bGVzIHdoZW5cbiAgICogd3JpdGluZyBwbHVnaW5zLiBGb3Igc2ltcGxlIHJ1bGVzIGNvbnRyb2wgdXNlIFtbTWFya2Rvd25JdC5kaXNhYmxlXV0gYW5kXG4gICAqIFtbTWFya2Rvd25JdC5lbmFibGVdXS5cbiAgICoqL1xuICB0aGlzLmNvcmUgPSBuZXcgUGFyc2VyQ29yZSgpO1xuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I3JlbmRlcmVyIC0+IFJlbmRlcmVyXG4gICAqXG4gICAqIEluc3RhbmNlIG9mIFtbUmVuZGVyZXJdXS4gVXNlIGl0IHRvIG1vZGlmeSBvdXRwdXQgbG9vay4gT3IgdG8gYWRkIHJlbmRlcmluZ1xuICAgKiBydWxlcyBmb3IgbmV3IHRva2VuIHR5cGVzLCBnZW5lcmF0ZWQgYnkgcGx1Z2lucy5cbiAgICpcbiAgICogIyMjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAgICpcbiAgICogZnVuY3Rpb24gbXlUb2tlbih0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCBzZWxmKSB7XG4gICAqICAgLy8uLi5cbiAgICogICByZXR1cm4gcmVzdWx0O1xuICAgKiB9O1xuICAgKlxuICAgKiBtZC5yZW5kZXJlci5ydWxlc1snbXlfdG9rZW4nXSA9IG15VG9rZW5cbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSBbW1JlbmRlcmVyXV0gZG9jcyBhbmQgW3NvdXJjZSBjb2RlXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQvYmxvYi9tYXN0ZXIvbGliL3JlbmRlcmVyLmpzKS5cbiAgICoqL1xuICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCk7XG5cbiAgLy8gRXhwb3NlIHV0aWxzICYgaGVscGVycyBmb3IgZWFzeSBhY2NlcyBmcm9tIHBsdWdpbnNcblxuICAvKipcbiAgICogTWFya2Rvd25JdCN1dGlscyAtPiB1dGlsc1xuICAgKlxuICAgKiBBc3NvcnRlZCB1dGlsaXR5IGZ1bmN0aW9ucywgdXNlZnVsIHRvIHdyaXRlIHBsdWdpbnMuIFNlZSBkZXRhaWxzXG4gICAqIFtoZXJlXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQvYmxvYi9tYXN0ZXIvbGliL2NvbW1vbi91dGlscy5qcykuXG4gICAqKi9cbiAgdGhpcy51dGlscyA9IHV0aWxzO1xuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I2hlbHBlcnMgLT4gaGVscGVyc1xuICAgKlxuICAgKiBMaW5rIGNvbXBvbmVudHMgcGFyc2VyIGZ1bmN0aW9ucywgdXNlZnVsIHRvIHdyaXRlIHBsdWdpbnMuIFNlZSBkZXRhaWxzXG4gICAqIFtoZXJlXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQvYmxvYi9tYXN0ZXIvbGliL2hlbHBlcnMpLlxuICAgKiovXG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnM7XG5cblxuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5jb25maWd1cmUocHJlc2V0TmFtZSk7XG5cbiAgaWYgKG9wdGlvbnMpIHsgdGhpcy5zZXQob3B0aW9ucyk7IH1cbn1cblxuXG4vKiogY2hhaW5hYmxlXG4gKiBNYXJrZG93bkl0LnNldChvcHRpb25zKVxuICpcbiAqIFNldCBwYXJzZXIgb3B0aW9ucyAoaW4gdGhlIHNhbWUgZm9ybWF0IGFzIGluIGNvbnN0cnVjdG9yKS4gUHJvYmFibHksIHlvdVxuICogd2lsbCBuZXZlciBuZWVkIGl0LCBidXQgeW91IGNhbiBjaGFuZ2Ugb3B0aW9ucyBhZnRlciBjb25zdHJ1Y3RvciBjYWxsLlxuICpcbiAqICMjIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKClcbiAqICAgICAgICAgICAgIC5zZXQoeyBodG1sOiB0cnVlLCBicmVha3M6IHRydWUgfSlcbiAqICAgICAgICAgICAgIC5zZXQoeyB0eXBvZ3JhcGhlciwgdHJ1ZSB9KTtcbiAqIGBgYFxuICpcbiAqIF9fTm90ZTpfXyBUbyBhY2hpZXZlIHRoZSBiZXN0IHBvc3NpYmxlIHBlcmZvcm1hbmNlLCBkb24ndCBtb2RpZnkgYVxuICogYG1hcmtkb3duLWl0YCBpbnN0YW5jZSBvcHRpb25zIG9uIHRoZSBmbHkuIElmIHlvdSBuZWVkIG11bHRpcGxlIGNvbmZpZ3VyYXRpb25zXG4gKiBpdCdzIGJlc3QgdG8gY3JlYXRlIG11bHRpcGxlIGluc3RhbmNlcyBhbmQgaW5pdGlhbGl6ZSBlYWNoIHdpdGggc2VwYXJhdGVcbiAqIGNvbmZpZy5cbiAqKi9cbk1hcmtkb3duSXQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHV0aWxzLmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqIGNoYWluYWJsZSwgaW50ZXJuYWxcbiAqIE1hcmtkb3duSXQuY29uZmlndXJlKHByZXNldHMpXG4gKlxuICogQmF0Y2ggbG9hZCBvZiBhbGwgb3B0aW9ucyBhbmQgY29tcGVuZW50IHNldHRpbmdzLiBUaGlzIGlzIGludGVybmFsIG1ldGhvZCxcbiAqIGFuZCB5b3UgcHJvYmFibHkgd2lsbCBub3QgbmVlZCBpdC4gQnV0IGlmIHlvdSB3aXRoIC0gc2VlIGF2YWlsYWJsZSBwcmVzZXRzXG4gKiBhbmQgZGF0YSBzdHJ1Y3R1cmUgW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC90cmVlL21hc3Rlci9saWIvcHJlc2V0cylcbiAqXG4gKiBXZSBzdHJvbmdseSByZWNvbW1lbmQgdG8gdXNlIHByZXNldHMgaW5zdGVhZCBvZiBkaXJlY3QgY29uZmlnIGxvYWRzLiBUaGF0XG4gKiB3aWxsIGdpdmUgYmV0dGVyIGNvbXBhdGliaWxpdHkgd2l0aCBuZXh0IHZlcnNpb25zLlxuICoqL1xuTWFya2Rvd25JdC5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKHByZXNldHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLCBwcmVzZXROYW1lO1xuXG4gIGlmICh1dGlscy5pc1N0cmluZyhwcmVzZXRzKSkge1xuICAgIHByZXNldE5hbWUgPSBwcmVzZXRzO1xuICAgIHByZXNldHMgPSBjb25maWdbcHJlc2V0TmFtZV07XG4gICAgaWYgKCFwcmVzZXRzKSB7IHRocm93IG5ldyBFcnJvcignV3JvbmcgYG1hcmtkb3duLWl0YCBwcmVzZXQgXCInICsgcHJlc2V0TmFtZSArICdcIiwgY2hlY2sgbmFtZScpOyB9XG4gIH1cblxuICBpZiAoIXByZXNldHMpIHsgdGhyb3cgbmV3IEVycm9yKCdXcm9uZyBgbWFya2Rvd24taXRgIHByZXNldCwgY2FuXFwndCBiZSBlbXB0eScpOyB9XG5cbiAgaWYgKHByZXNldHMub3B0aW9ucykgeyBzZWxmLnNldChwcmVzZXRzLm9wdGlvbnMpOyB9XG5cbiAgaWYgKHByZXNldHMuY29tcG9uZW50cykge1xuICAgIE9iamVjdC5rZXlzKHByZXNldHMuY29tcG9uZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgaWYgKHByZXNldHMuY29tcG9uZW50c1tuYW1lXS5ydWxlcykge1xuICAgICAgICBzZWxmW25hbWVdLnJ1bGVyLmVuYWJsZU9ubHkocHJlc2V0cy5jb21wb25lbnRzW25hbWVdLnJ1bGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqIGNoYWluYWJsZVxuICogTWFya2Rvd25JdC5lbmFibGUobGlzdCwgaWdub3JlSW52YWxpZClcbiAqIC0gbGlzdCAoU3RyaW5nfEFycmF5KTogcnVsZSBuYW1lIG9yIGxpc3Qgb2YgcnVsZSBuYW1lcyB0byBlbmFibGVcbiAqIC0gaWdub3JlSW52YWxpZCAoQm9vbGVhbik6IHNldCBgdHJ1ZWAgdG8gaWdub3JlIGVycm9ycyB3aGVuIHJ1bGUgbm90IGZvdW5kLlxuICpcbiAqIEVuYWJsZSBsaXN0IG9yIHJ1bGVzLiBJdCB3aWxsIGF1dG9tYXRpY2FsbHkgZmluZCBhcHByb3ByaWF0ZSBjb21wb25lbnRzLFxuICogY29udGFpbmluZyBydWxlcyB3aXRoIGdpdmVuIG5hbWVzLiBJZiBydWxlIG5vdCBmb3VuZCwgYW5kIGBpZ25vcmVJbnZhbGlkYFxuICogbm90IHNldCAtIHRocm93cyBleGNlcHRpb24uXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKVxuICogICAgICAgICAgICAgLmVuYWJsZShbJ3N1YicsICdzdXAnXSlcbiAqICAgICAgICAgICAgIC5kaXNhYmxlKCdzbWFydHF1b3RlcycpO1xuICogYGBgXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAobGlzdCwgaWdub3JlSW52YWxpZCkge1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7IGxpc3QgPSBbIGxpc3QgXTsgfVxuXG4gIFsgJ2NvcmUnLCAnYmxvY2snLCAnaW5saW5lJyBdLmZvckVhY2goZnVuY3Rpb24gKGNoYWluKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCh0aGlzW2NoYWluXS5ydWxlci5lbmFibGUobGlzdCwgdHJ1ZSkpO1xuICB9LCB0aGlzKTtcblxuICB2YXIgbWlzc2VkID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHJlc3VsdC5pbmRleE9mKG5hbWUpIDwgMDsgfSk7XG5cbiAgaWYgKG1pc3NlZC5sZW5ndGggJiYgIWlnbm9yZUludmFsaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01hcmtkb3duSXQuIEZhaWxlZCB0byBlbmFibGUgdW5rbm93biBydWxlKHMpOiAnICsgbWlzc2VkKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKiogY2hhaW5hYmxlXG4gKiBNYXJrZG93bkl0LmRpc2FibGUobGlzdCwgaWdub3JlSW52YWxpZClcbiAqIC0gbGlzdCAoU3RyaW5nfEFycmF5KTogcnVsZSBuYW1lIG9yIGxpc3Qgb2YgcnVsZSBuYW1lcyB0byBkaXNhYmxlLlxuICogLSBpZ25vcmVJbnZhbGlkIChCb29sZWFuKTogc2V0IGB0cnVlYCB0byBpZ25vcmUgZXJyb3JzIHdoZW4gcnVsZSBub3QgZm91bmQuXG4gKlxuICogVGhlIHNhbWUgYXMgW1tNYXJrZG93bkl0LmVuYWJsZV1dLCBidXQgdHVybiBzcGVjaWZpZWQgcnVsZXMgb2ZmLlxuICoqL1xuTWFya2Rvd25JdC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uIChsaXN0LCBpZ25vcmVJbnZhbGlkKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHsgbGlzdCA9IFsgbGlzdCBdOyB9XG5cbiAgWyAnY29yZScsICdibG9jaycsICdpbmxpbmUnIF0uZm9yRWFjaChmdW5jdGlvbiAoY2hhaW4pIHtcbiAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHRoaXNbY2hhaW5dLnJ1bGVyLmRpc2FibGUobGlzdCwgdHJ1ZSkpO1xuICB9LCB0aGlzKTtcblxuICB2YXIgbWlzc2VkID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHJlc3VsdC5pbmRleE9mKG5hbWUpIDwgMDsgfSk7XG5cbiAgaWYgKG1pc3NlZC5sZW5ndGggJiYgIWlnbm9yZUludmFsaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01hcmtkb3duSXQuIEZhaWxlZCB0byBkaXNhYmxlIHVua25vd24gcnVsZShzKTogJyArIG1pc3NlZCk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKiBjaGFpbmFibGVcbiAqIE1hcmtkb3duSXQudXNlKHBsdWdpbiwgcGFyYW1zKVxuICpcbiAqIExvYWQgc3BlY2lmaWVkIHBsdWdpbiB3aXRoIGdpdmVuIHBhcmFtcyBpbnRvIGN1cnJlbnQgcGFyc2VyIGluc3RhbmNlLlxuICogSXQncyBqdXN0IGEgc3VnYXIgdG8gY2FsbCBgcGx1Z2luKG1kLCBwYXJhbXMpYCB3aXRoIGN1cnJpbmcuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBpdGVyYXRvciA9IHJlcXVpcmUoJ21hcmtkb3duLWl0LWZvci1pbmxpbmUnKTtcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKVxuICogICAgICAgICAgICAgLnVzZShpdGVyYXRvciwgJ2Zvb19yZXBsYWNlJywgJ3RleHQnLCBmdW5jdGlvbiAodG9rZW5zLCBpZHgpIHtcbiAqICAgICAgICAgICAgICAgdG9rZW5zW2lkeF0uY29udGVudCA9IHRva2Vuc1tpZHhdLmNvbnRlbnQucmVwbGFjZSgvZm9vL2csICdiYXInKTtcbiAqICAgICAgICAgICAgIH0pO1xuICogYGBgXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAocGx1Z2luIC8qLCBwYXJhbXMsIC4uLiAqLykge1xuICB2YXIgYXJncyA9IFsgdGhpcyBdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgcGx1Z2luLmFwcGx5KHBsdWdpbiwgYXJncyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKiogaW50ZXJuYWxcbiAqIE1hcmtkb3duSXQucGFyc2Uoc3JjLCBlbnYpIC0+IEFycmF5XG4gKiAtIHNyYyAoU3RyaW5nKTogc291cmNlIHN0cmluZ1xuICogLSBlbnYgKE9iamVjdCk6IGVudmlyb25tZW50IHNhbmRib3hcbiAqXG4gKiBQYXJzZSBpbnB1dCBzdHJpbmcgYW5kIHJldHVybnMgbGlzdCBvZiBibG9jayB0b2tlbnMgKHNwZWNpYWwgdG9rZW4gdHlwZVxuICogXCJpbmxpbmVcIiB3aWxsIGNvbnRhaW4gbGlzdCBvZiBpbmxpbmUgdG9rZW5zKS4gWW91IHNob3VsZCBub3QgY2FsbCB0aGlzXG4gKiBtZXRob2QgZGlyZWN0bHksIHVudGlsIHlvdSB3cml0ZSBjdXN0b20gcmVuZGVyZXIgKGZvciBleGFtcGxlLCB0byBwcm9kdWNlXG4gKiBBU1QpLlxuICpcbiAqIGBlbnZgIGlzIHVzZWQgdG8gcGFzcyBkYXRhIGJldHdlZW4gXCJkaXN0cmlidXRlZFwiIHJ1bGVzIChge31gIGJ5IGRlZmF1bHQpLlxuICogRm9yIGV4YW1wbGUsIHJlZmVyZW5jZXMgYXJlIHBhcnNlZCBpbiBkaWZmZXJlbnQgY2hhaW5zLCBhbmQgbmVlZCBzYW5kYm94XG4gKiB0byBzdG9yZSBpbnRlcm1lZGlhdGUgcmVzdWx0cy4gQ2FuIGJlIHVzZWQgdG8gaW5qZWN0IGRhdGEgaW4gc3BlY2lmaWMgY2FzZXMuXG4gKiBZb3Ugd2lsbCBub3QgbmVlZCBpdCB3aXRoIGhpZ2ggcHJvYmFiaWxpdHkuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChzcmMsIGVudikge1xuICB2YXIgc3RhdGUgPSBuZXcgdGhpcy5jb3JlLlN0YXRlKHNyYywgdGhpcywgZW52KTtcblxuICB0aGlzLmNvcmUucHJvY2VzcyhzdGF0ZSk7XG5cbiAgcmV0dXJuIHN0YXRlLnRva2Vucztcbn07XG5cblxuLyoqXG4gKiBNYXJrZG93bkl0LnJlbmRlcihzcmMgWywgZW52XSkgLT4gU3RyaW5nXG4gKiAtIHNyYyAoU3RyaW5nKTogc291cmNlIHN0cmluZ1xuICogLSBlbnYgKE9iamVjdCk6IGVudmlyb25tZW50IHNhbmRib3hcbiAqXG4gKiBSZW5kZXIgbWFya2Rvd24gc3RyaW5nIGludG8gaHRtbC4gSXQgZG9lcyBhbGwgbWFnaWMgZm9yIHlvdSA6KS5cbiAqXG4gKiBgZW52YCBjYW4gYmUgdXNlZCB0byBpbmplY3QgYWRkaXRpb25hbCBtZXRhZGF0YSAoYHt9YCBieSBkZWZhdWx0KS5cbiAqIEJ1dCB5b3Ugd2lsbCBub3QgbmVlZCBpdCB3aXRoIGhpZ2ggcHJvYmFiaWxpdHkuIFNlZSBhbHNvIGNvbW1lbnRcbiAqIGluIFtbTWFya2Rvd25JdC5wYXJzZV1dLlxuICoqL1xuTWFya2Rvd25JdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNyYywgZW52KSB7XG4gIGVudiA9IGVudiB8fCB7fTtcblxuICByZXR1cm4gdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5wYXJzZShzcmMsIGVudiksIHRoaXMub3B0aW9ucywgZW52KTtcbn07XG5cblxuLyoqIGludGVybmFsXG4gKiBNYXJrZG93bkl0LnBhcnNlSW5saW5lKHNyYywgZW52KSAtPiBBcnJheVxuICogLSBzcmMgKFN0cmluZyk6IHNvdXJjZSBzdHJpbmdcbiAqIC0gZW52IChPYmplY3QpOiBlbnZpcm9ubWVudCBzYW5kYm94XG4gKlxuICogVGhlIHNhbWUgYXMgW1tNYXJrZG93bkl0LnBhcnNlXV0gYnV0IHNraXAgYWxsIGJsb2NrIHJ1bGVzLiBJdCByZXR1cm5zIHRoZVxuICogYmxvY2sgdG9rZW5zIGxpc3Qgd2l0aCB0aCBzaW5nbGUgYGlubGluZWAgZWxlbWVudCwgY29udGFpbmluZyBwYXJzZWQgaW5saW5lXG4gKiB0b2tlbnMgaW4gYGNoaWxkcmVuYCBwcm9wZXJ0eS5cbiAqKi9cbk1hcmtkb3duSXQucHJvdG90eXBlLnBhcnNlSW5saW5lID0gZnVuY3Rpb24gKHNyYywgZW52KSB7XG4gIHZhciBzdGF0ZSA9IG5ldyB0aGlzLmNvcmUuU3RhdGUoc3JjLCB0aGlzLCBlbnYpO1xuXG4gIHN0YXRlLmlubGluZU1vZGUgPSB0cnVlO1xuICB0aGlzLmNvcmUucHJvY2VzcyhzdGF0ZSk7XG5cbiAgcmV0dXJuIHN0YXRlLnRva2Vucztcbn07XG5cblxuLyoqXG4gKiBNYXJrZG93bkl0LnJlbmRlcklubGluZShzcmMgWywgZW52XSkgLT4gU3RyaW5nXG4gKiAtIHNyYyAoU3RyaW5nKTogc291cmNlIHN0cmluZ1xuICogLSBlbnYgKE9iamVjdCk6IGVudmlyb25tZW50IHNhbmRib3hcbiAqXG4gKiBTaW1pbGFyIHRvIFtbTWFya2Rvd25JdC5yZW5kZXJdXSBidXQgZm9yIHNpbmdsZSBwYXJhZ3JhcGggY29udGVudC4gUmVzdWx0XG4gKiB3aWxsIE5PVCBiZSB3cmFwcGVkIGludG8gYDxwPmAgdGFncy5cbiAqKi9cbk1hcmtkb3duSXQucHJvdG90eXBlLnJlbmRlcklubGluZSA9IGZ1bmN0aW9uIChzcmMsIGVudikge1xuICBlbnYgPSBlbnYgfHwge307XG5cbiAgcmV0dXJuIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMucGFyc2VJbmxpbmUoc3JjLCBlbnYpLCB0aGlzLm9wdGlvbnMsIGVudik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFya2Rvd25JdDtcbiIsIi8qKiBpbnRlcm5hbFxuICogY2xhc3MgUGFyc2VyQmxvY2tcbiAqXG4gKiBCbG9jay1sZXZlbCB0b2tlbml6ZXIuXG4gKiovXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFJ1bGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vcnVsZXInKTtcblxuXG52YXIgX3J1bGVzID0gW1xuICAvLyBGaXJzdCAyIHBhcmFtcyAtIHJ1bGUgbmFtZSAmIHNvdXJjZS4gU2Vjb25kYXJ5IGFycmF5IC0gbGlzdCBvZiBydWxlcyxcbiAgLy8gd2hpY2ggY2FuIGJlIHRlcm1pbmF0ZWQgYnkgdGhpcyBvbmUuXG4gIFsgJ2NvZGUnLCAgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2NvZGUnKSBdLFxuICBbICdmZW5jZScsICAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9mZW5jZScpLCAgICAgIFsgJ3BhcmFncmFwaCcsICdyZWZlcmVuY2UnLCAnYmxvY2txdW90ZScsICdsaXN0JyBdIF0sXG4gIFsgJ2Jsb2NrcXVvdGUnLCByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2Jsb2NrcXVvdGUnKSwgWyAncGFyYWdyYXBoJywgJ3JlZmVyZW5jZScsICdsaXN0JyBdIF0sXG4gIFsgJ2hyJywgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2hyJyksICAgICAgICAgWyAncGFyYWdyYXBoJywgJ3JlZmVyZW5jZScsICdibG9ja3F1b3RlJywgJ2xpc3QnIF0gXSxcbiAgWyAnbGlzdCcsICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svbGlzdCcpLCAgICAgICBbICdwYXJhZ3JhcGgnLCAncmVmZXJlbmNlJywgJ2Jsb2NrcXVvdGUnIF0gXSxcbiAgWyAncmVmZXJlbmNlJywgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svcmVmZXJlbmNlJykgXSxcbiAgWyAnaGVhZGluZycsICAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svaGVhZGluZycpLCAgICBbICdwYXJhZ3JhcGgnLCAncmVmZXJlbmNlJywgJ2Jsb2NrcXVvdGUnIF0gXSxcbiAgWyAnbGhlYWRpbmcnLCAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svbGhlYWRpbmcnKSBdLFxuICBbICdodG1sX2Jsb2NrJywgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9odG1sX2Jsb2NrJyksIFsgJ3BhcmFncmFwaCcsICdyZWZlcmVuY2UnLCAnYmxvY2txdW90ZScgXSBdLFxuICBbICd0YWJsZScsICAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay90YWJsZScpLCAgICAgIFsgJ3BhcmFncmFwaCcsICdyZWZlcmVuY2UnIF0gXSxcbiAgWyAncGFyYWdyYXBoJywgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svcGFyYWdyYXBoJykgXVxuXTtcblxuXG4vKipcbiAqIG5ldyBQYXJzZXJCbG9jaygpXG4gKiovXG5mdW5jdGlvbiBQYXJzZXJCbG9jaygpIHtcbiAgLyoqXG4gICAqIFBhcnNlckJsb2NrI3J1bGVyIC0+IFJ1bGVyXG4gICAqXG4gICAqIFtbUnVsZXJdXSBpbnN0YW5jZS4gS2VlcCBjb25maWd1cmF0aW9uIG9mIGJsb2NrIHJ1bGVzLlxuICAgKiovXG4gIHRoaXMucnVsZXIgPSBuZXcgUnVsZXIoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IF9ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMucnVsZXIucHVzaChfcnVsZXNbaV1bMF0sIF9ydWxlc1tpXVsxXSwgeyBhbHQ6IChfcnVsZXNbaV1bMl0gfHwgW10pLnNsaWNlKCkgfSk7XG4gIH1cbn1cblxuXG4vLyBHZW5lcmF0ZSB0b2tlbnMgZm9yIGlucHV0IHJhbmdlXG4vL1xuUGFyc2VyQmxvY2sucHJvdG90eXBlLnRva2VuaXplID0gZnVuY3Rpb24gKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUpIHtcbiAgdmFyIG9rLCBpLFxuICAgICAgcnVsZXMgPSB0aGlzLnJ1bGVyLmdldFJ1bGVzKCcnKSxcbiAgICAgIGxlbiA9IHJ1bGVzLmxlbmd0aCxcbiAgICAgIGxpbmUgPSBzdGFydExpbmUsXG4gICAgICBoYXNFbXB0eUxpbmVzID0gZmFsc2UsXG4gICAgICBtYXhOZXN0aW5nID0gc3RhdGUubWQub3B0aW9ucy5tYXhOZXN0aW5nO1xuXG4gIHdoaWxlIChsaW5lIDwgZW5kTGluZSkge1xuICAgIHN0YXRlLmxpbmUgPSBsaW5lID0gc3RhdGUuc2tpcEVtcHR5TGluZXMobGluZSk7XG4gICAgaWYgKGxpbmUgPj0gZW5kTGluZSkgeyBicmVhazsgfVxuXG4gICAgLy8gVGVybWluYXRpb24gY29uZGl0aW9uIGZvciBuZXN0ZWQgY2FsbHMuXG4gICAgLy8gTmVzdGVkIGNhbGxzIGN1cnJlbnRseSB1c2VkIGZvciBibG9ja3F1b3RlcyAmIGxpc3RzXG4gICAgaWYgKHN0YXRlLnRTaGlmdFtsaW5lXSA8IHN0YXRlLmJsa0luZGVudCkgeyBicmVhazsgfVxuXG4gICAgLy8gSWYgbmVzdGluZyBsZXZlbCBleGNlZWRlZCAtIHNraXAgdGFpbCB0byB0aGUgZW5kLiBUaGF0J3Mgbm90IG9yZGluYXJ5XG4gICAgLy8gc2l0dWF0aW9uIGFuZCB3ZSBzaG91bGQgbm90IGNhcmUgYWJvdXQgY29udGVudC5cbiAgICBpZiAoc3RhdGUubGV2ZWwgPj0gbWF4TmVzdGluZykge1xuICAgICAgc3RhdGUubGluZSA9IGVuZExpbmU7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBUcnkgYWxsIHBvc3NpYmxlIHJ1bGVzLlxuICAgIC8vIE9uIHN1Y2Nlc3MsIHJ1bGUgc2hvdWxkOlxuICAgIC8vXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLmxpbmVgXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLnRva2Vuc2BcbiAgICAvLyAtIHJldHVybiB0cnVlXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG9rID0gcnVsZXNbaV0oc3RhdGUsIGxpbmUsIGVuZExpbmUsIGZhbHNlKTtcbiAgICAgIGlmIChvaykgeyBicmVhazsgfVxuICAgIH1cblxuICAgIC8vIHNldCBzdGF0ZS50aWdodCBpZmYgd2UgaGFkIGFuIGVtcHR5IGxpbmUgYmVmb3JlIGN1cnJlbnQgdGFnXG4gICAgLy8gaS5lLiBsYXRlc3QgZW1wdHkgbGluZSBzaG91bGQgbm90IGNvdW50XG4gICAgc3RhdGUudGlnaHQgPSAhaGFzRW1wdHlMaW5lcztcblxuICAgIC8vIHBhcmFncmFwaCBtaWdodCBcImVhdFwiIG9uZSBuZXdsaW5lIGFmdGVyIGl0IGluIG5lc3RlZCBsaXN0c1xuICAgIGlmIChzdGF0ZS5pc0VtcHR5KHN0YXRlLmxpbmUgLSAxKSkge1xuICAgICAgaGFzRW1wdHlMaW5lcyA9IHRydWU7XG4gICAgfVxuXG4gICAgbGluZSA9IHN0YXRlLmxpbmU7XG5cbiAgICBpZiAobGluZSA8IGVuZExpbmUgJiYgc3RhdGUuaXNFbXB0eShsaW5lKSkge1xuICAgICAgaGFzRW1wdHlMaW5lcyA9IHRydWU7XG4gICAgICBsaW5lKys7XG5cbiAgICAgIC8vIHR3byBlbXB0eSBsaW5lcyBzaG91bGQgc3RvcCB0aGUgcGFyc2VyIGluIGxpc3QgbW9kZVxuICAgICAgaWYgKGxpbmUgPCBlbmRMaW5lICYmIHN0YXRlLnBhcmVudFR5cGUgPT09ICdsaXN0JyAmJiBzdGF0ZS5pc0VtcHR5KGxpbmUpKSB7IGJyZWFrOyB9XG4gICAgICBzdGF0ZS5saW5lID0gbGluZTtcbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBQYXJzZXJCbG9jay5wYXJzZShzdHIsIG1kLCBlbnYsIG91dFRva2VucylcbiAqXG4gKiBQcm9jZXNzIGlucHV0IHN0cmluZyBhbmQgcHVzaCBibG9jayB0b2tlbnMgaW50byBgb3V0VG9rZW5zYFxuICoqL1xuUGFyc2VyQmxvY2sucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHNyYywgbWQsIGVudiwgb3V0VG9rZW5zKSB7XG4gIHZhciBzdGF0ZTtcblxuICBpZiAoIXNyYykgeyByZXR1cm4gW107IH1cblxuICBzdGF0ZSA9IG5ldyB0aGlzLlN0YXRlKHNyYywgbWQsIGVudiwgb3V0VG9rZW5zKTtcblxuICB0aGlzLnRva2VuaXplKHN0YXRlLCBzdGF0ZS5saW5lLCBzdGF0ZS5saW5lTWF4KTtcbn07XG5cblxuUGFyc2VyQmxvY2sucHJvdG90eXBlLlN0YXRlID0gcmVxdWlyZSgnLi9ydWxlc19ibG9jay9zdGF0ZV9ibG9jaycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyQmxvY2s7XG4iLCIvKiogaW50ZXJuYWxcbiAqIGNsYXNzIENvcmVcbiAqXG4gKiBUb3AtbGV2ZWwgcnVsZXMgZXhlY3V0b3IuIEdsdWVzIGJsb2NrL2lubGluZSBwYXJzZXJzIGFuZCBkb2VzIGludGVybWVkaWF0ZVxuICogdHJhbnNmb3JtYXRpb25zLlxuICoqL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBSdWxlciAgPSByZXF1aXJlKCcuL3J1bGVyJyk7XG5cblxudmFyIF9ydWxlcyA9IFtcbiAgWyAnbm9ybWFsaXplJywgICAgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvbm9ybWFsaXplJykgICAgICBdLFxuICBbICdibG9jaycsICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9ibG9jaycpICAgICAgICAgIF0sXG4gIFsgJ2lubGluZScsICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL2lubGluZScpICAgICAgICAgXSxcbiAgWyAncmVwbGFjZW1lbnRzJywgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvcmVwbGFjZW1lbnRzJykgICBdLFxuICBbICdzbWFydHF1b3RlcycsICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9zbWFydHF1b3RlcycpICAgIF0sXG4gIFsgJ2xpbmtpZnknLCAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL2xpbmtpZnknKSAgICAgICAgXVxuXTtcblxuXG4vKipcbiAqIG5ldyBDb3JlKClcbiAqKi9cbmZ1bmN0aW9uIENvcmUoKSB7XG4gIC8qKlxuICAgKiBDb3JlI3J1bGVyIC0+IFJ1bGVyXG4gICAqXG4gICAqIFtbUnVsZXJdXSBpbnN0YW5jZS4gS2VlcCBjb25maWd1cmF0aW9uIG9mIGNvcmUgcnVsZXMuXG4gICAqKi9cbiAgdGhpcy5ydWxlciA9IG5ldyBSdWxlcigpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgX3J1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5ydWxlci5wdXNoKF9ydWxlc1tpXVswXSwgX3J1bGVzW2ldWzFdKTtcbiAgfVxufVxuXG5cbi8qKlxuICogQ29yZS5wcm9jZXNzKHN0YXRlKVxuICpcbiAqIEV4ZWN1dGVzIGNvcmUgY2hhaW4gcnVsZXMuXG4gKiovXG5Db3JlLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHZhciBpLCBsLCBydWxlcztcblxuICBydWxlcyA9IHRoaXMucnVsZXIuZ2V0UnVsZXMoJycpO1xuXG4gIGZvciAoaSA9IDAsIGwgPSBydWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBydWxlc1tpXShzdGF0ZSk7XG4gIH1cbn07XG5cbkNvcmUucHJvdG90eXBlLlN0YXRlID0gcmVxdWlyZSgnLi9ydWxlc19jb3JlL3N0YXRlX2NvcmUnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvcmU7XG4iLCIvKiogaW50ZXJuYWxcbiAqIGNsYXNzIFBhcnNlcklubGluZVxuICpcbiAqIFRva2VuaXplcyBwYXJhZ3JhcGggY29udGVudC5cbiAqKi9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgUnVsZXIgICAgICAgICAgID0gcmVxdWlyZSgnLi9ydWxlcicpO1xudmFyIHJlcGxhY2VFbnRpdGllcyA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykucmVwbGFjZUVudGl0aWVzO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUGFyc2VyIHJ1bGVzXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ3RleHQnLCAgICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL3RleHQnKSBdLFxuICBbICduZXdsaW5lJywgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9uZXdsaW5lJykgXSxcbiAgWyAnZXNjYXBlJywgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvZXNjYXBlJykgXSxcbiAgWyAnYmFja3RpY2tzJywgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvYmFja3RpY2tzJykgXSxcbiAgWyAnc3RyaWtldGhyb3VnaCcsICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3RyaWtldGhyb3VnaCcpIF0sXG4gIFsgJ2VtcGhhc2lzJywgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2VtcGhhc2lzJykgXSxcbiAgWyAnbGluaycsICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvbGluaycpIF0sXG4gIFsgJ2ltYWdlJywgICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2ltYWdlJykgXSxcbiAgWyAnYXV0b2xpbmsnLCAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvYXV0b2xpbmsnKSBdLFxuICBbICdodG1sX2lubGluZScsICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9odG1sX2lubGluZScpIF0sXG4gIFsgJ2VudGl0eScsICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2VudGl0eScpIF1cbl07XG5cblxudmFyIEJBRF9QUk9UT0NPTFMgPSBbICd2YnNjcmlwdCcsICdqYXZhc2NyaXB0JywgJ2ZpbGUnIF07XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGluayh1cmwpIHtcbiAgLy8gQ2FyZSBhYm91dCBkaWdpdGFsIGVudGl0aWVzIFwiamF2YXNjcmlwdCYjeDNBO2FsZXJ0KDEpXCJcbiAgdmFyIHN0ciA9IHJlcGxhY2VFbnRpdGllcyh1cmwpO1xuXG4gIHN0ciA9IHN0ci50cmltKCkudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoc3RyLmluZGV4T2YoJzonKSA+PSAwICYmIEJBRF9QUk9UT0NPTFMuaW5kZXhPZihzdHIuc3BsaXQoJzonKVswXSkgPj0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuXG4vKipcbiAqIG5ldyBQYXJzZXJJbmxpbmUoKVxuICoqL1xuZnVuY3Rpb24gUGFyc2VySW5saW5lKCkge1xuICAvKipcbiAgICogUGFyc2VySW5saW5lI3ZhbGlkYXRlTGluayh1cmwpIC0+IEJvb2xlYW5cbiAgICpcbiAgICogTGluayB2YWxpZGF0aW9uIGZ1bmN0aW9uLiBDb21tb25NYXJrIGFsbG93cyB0b28gbXVjaCBpbiBsaW5rcy4gQnkgZGVmYXVsdFxuICAgKiB3ZSBkaXNhYmxlIGBqYXZhc2NyaXB0OmAgYW5kIGB2YnNjcmlwdDpgIHNjaGVtYXMuIFlvdSBjYW4gY2hhbmdlIHRoaXNcbiAgICogYmVoYXZpb3VyLlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAgICogLy8gZW5hYmxlIGV2ZXJ5dGhpbmdcbiAgICogbWQuaW5saW5lLnZhbGlkYXRlTGluayA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH1cbiAgICogYGBgXG4gICAqKi9cbiAgdGhpcy52YWxpZGF0ZUxpbmsgPSB2YWxpZGF0ZUxpbms7XG5cbiAgLyoqXG4gICAqIFBhcnNlcklubGluZSNydWxlciAtPiBSdWxlclxuICAgKlxuICAgKiBbW1J1bGVyXV0gaW5zdGFuY2UuIEtlZXAgY29uZmlndXJhdGlvbiBvZiBpbmxpbmUgcnVsZXMuXG4gICAqKi9cbiAgdGhpcy5ydWxlciA9IG5ldyBSdWxlcigpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgX3J1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5ydWxlci5wdXNoKF9ydWxlc1tpXVswXSwgX3J1bGVzW2ldWzFdKTtcbiAgfVxufVxuXG5cbi8vIFNraXAgc2luZ2xlIHRva2VuIGJ5IHJ1bm5pbmcgYWxsIHJ1bGVzIGluIHZhbGlkYXRpb24gbW9kZTtcbi8vIHJldHVybnMgYHRydWVgIGlmIGFueSBydWxlIHJlcG9ydGVkIHN1Y2Nlc3Ncbi8vXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLnNraXBUb2tlbiA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICB2YXIgaSwgY2FjaGVkX3BvcywgcG9zID0gc3RhdGUucG9zLFxuICAgICAgcnVsZXMgPSB0aGlzLnJ1bGVyLmdldFJ1bGVzKCcnKSxcbiAgICAgIGxlbiA9IHJ1bGVzLmxlbmd0aCxcbiAgICAgIG1heE5lc3RpbmcgPSBzdGF0ZS5tZC5vcHRpb25zLm1heE5lc3Rpbmc7XG5cblxuICBpZiAoKGNhY2hlZF9wb3MgPSBzdGF0ZS5jYWNoZUdldChwb3MpKSA+IDApIHtcbiAgICBzdGF0ZS5wb3MgPSBjYWNoZWRfcG9zO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qaXN0YW5idWwgaWdub3JlIGVsc2UqL1xuICBpZiAoc3RhdGUubGV2ZWwgPCBtYXhOZXN0aW5nKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAocnVsZXNbaV0oc3RhdGUsIHRydWUpKSB7XG4gICAgICAgIHN0YXRlLmNhY2hlU2V0KHBvcywgc3RhdGUucG9zKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnBvcysrO1xuICBzdGF0ZS5jYWNoZVNldChwb3MsIHN0YXRlLnBvcyk7XG59O1xuXG5cbi8vIEdlbmVyYXRlIHRva2VucyBmb3IgaW5wdXQgcmFuZ2Vcbi8vXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLnRva2VuaXplID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHZhciBvaywgaSxcbiAgICAgIHJ1bGVzID0gdGhpcy5ydWxlci5nZXRSdWxlcygnJyksXG4gICAgICBsZW4gPSBydWxlcy5sZW5ndGgsXG4gICAgICBlbmQgPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBtYXhOZXN0aW5nID0gc3RhdGUubWQub3B0aW9ucy5tYXhOZXN0aW5nO1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBlbmQpIHtcbiAgICAvLyBUcnkgYWxsIHBvc3NpYmxlIHJ1bGVzLlxuICAgIC8vIE9uIHN1Y2Nlc3MsIHJ1bGUgc2hvdWxkOlxuICAgIC8vXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLnBvc2BcbiAgICAvLyAtIHVwZGF0ZSBgc3RhdGUudG9rZW5zYFxuICAgIC8vIC0gcmV0dXJuIHRydWVcblxuICAgIGlmIChzdGF0ZS5sZXZlbCA8IG1heE5lc3RpbmcpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBvayA9IHJ1bGVzW2ldKHN0YXRlLCBmYWxzZSk7XG4gICAgICAgIGlmIChvaykgeyBicmVhazsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvaykge1xuICAgICAgaWYgKHN0YXRlLnBvcyA+PSBlbmQpIHsgYnJlYWs7IH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjW3N0YXRlLnBvcysrXTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5wZW5kaW5nKSB7XG4gICAgc3RhdGUucHVzaFBlbmRpbmcoKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFBhcnNlcklubGluZS5wYXJzZShzdHIsIG1kLCBlbnYsIG91dFRva2VucylcbiAqXG4gKiBQcm9jZXNzIGlucHV0IHN0cmluZyBhbmQgcHVzaCBpbmxpbmUgdG9rZW5zIGludG8gYG91dFRva2Vuc2BcbiAqKi9cblBhcnNlcklubGluZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoc3RyLCBtZCwgZW52LCBvdXRUb2tlbnMpIHtcbiAgdmFyIHN0YXRlID0gbmV3IHRoaXMuU3RhdGUoc3RyLCBtZCwgZW52LCBvdXRUb2tlbnMpO1xuXG4gIHRoaXMudG9rZW5pemUoc3RhdGUpO1xufTtcblxuXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLlN0YXRlID0gcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3RhdGVfaW5saW5lJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXJJbmxpbmU7XG4iLCIvLyBDb21tb25tYXJrIGRlZmF1bHQgb3B0aW9uc1xuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG9wdGlvbnM6IHtcbiAgICBodG1sOiAgICAgICAgIHRydWUsICAgICAgICAgLy8gRW5hYmxlIEhUTUwgdGFncyBpbiBzb3VyY2VcbiAgICB4aHRtbE91dDogICAgIHRydWUsICAgICAgICAgLy8gVXNlICcvJyB0byBjbG9zZSBzaW5nbGUgdGFncyAoPGJyIC8+KVxuICAgIGJyZWFrczogICAgICAgZmFsc2UsICAgICAgICAvLyBDb252ZXJ0ICdcXG4nIGluIHBhcmFncmFwaHMgaW50byA8YnI+XG4gICAgbGFuZ1ByZWZpeDogICAnbGFuZ3VhZ2UtJywgIC8vIENTUyBsYW5ndWFnZSBwcmVmaXggZm9yIGZlbmNlZCBibG9ja3NcbiAgICBsaW5raWZ5OiAgICAgIGZhbHNlLCAgICAgICAgLy8gYXV0b2NvbnZlcnQgVVJMLWxpa2UgdGV4dHMgdG8gbGlua3NcblxuICAgIC8vIEVuYWJsZSBzb21lIGxhbmd1YWdlLW5ldXRyYWwgcmVwbGFjZW1lbnRzICsgcXVvdGVzIGJlYXV0aWZpY2F0aW9uXG4gICAgdHlwb2dyYXBoZXI6ICBmYWxzZSxcblxuICAgIC8vIERvdWJsZSArIHNpbmdsZSBxdW90ZXMgcmVwbGFjZW1lbnQgcGFpcnMsIHdoZW4gdHlwb2dyYXBoZXIgZW5hYmxlZCxcbiAgICAvLyBhbmQgc21hcnRxdW90ZXMgb24uIFNldCBkb3VibGVzIHRvICfCq8K7JyBmb3IgUnVzc2lhbiwgJ+KAnuKAnCcgZm9yIEdlcm1hbi5cbiAgICBxdW90ZXM6ICdcXHUyMDFjXFx1MjAxZFxcdTIwMThcXHUyMDE5JyAvKiDigJzigJ3igJjigJkgKi8sXG5cbiAgICAvLyBIaWdobGlnaHRlciBmdW5jdGlvbi4gU2hvdWxkIHJldHVybiBlc2NhcGVkIEhUTUwsXG4gICAgLy8gb3IgJycgaWYgaW5wdXQgbm90IGNoYW5nZWRcbiAgICAvL1xuICAgIC8vIGZ1bmN0aW9uICgvKnN0ciwgbGFuZyovKSB7IHJldHVybiAnJzsgfVxuICAgIC8vXG4gICAgaGlnaGxpZ2h0OiBudWxsLFxuXG4gICAgbWF4TmVzdGluZzogICAyMCAgICAgICAgICAgIC8vIEludGVybmFsIHByb3RlY3Rpb24sIHJlY3Vyc2lvbiBsaW1pdFxuICB9LFxuXG4gIGNvbXBvbmVudHM6IHtcblxuICAgIGNvcmU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdub3JtYWxpemUnLFxuICAgICAgICAnYmxvY2snLFxuICAgICAgICAnaW5saW5lJ1xuICAgICAgXVxuICAgIH0sXG5cbiAgICBibG9jazoge1xuICAgICAgcnVsZXM6IFtcbiAgICAgICAgJ2Jsb2NrcXVvdGUnLFxuICAgICAgICAnY29kZScsXG4gICAgICAgICdmZW5jZScsXG4gICAgICAgICdoZWFkaW5nJyxcbiAgICAgICAgJ2hyJyxcbiAgICAgICAgJ2h0bWxfYmxvY2snLFxuICAgICAgICAnbGhlYWRpbmcnLFxuICAgICAgICAnbGlzdCcsXG4gICAgICAgICdyZWZlcmVuY2UnLFxuICAgICAgICAncGFyYWdyYXBoJ1xuICAgICAgXVxuICAgIH0sXG5cbiAgICBpbmxpbmU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdhdXRvbGluaycsXG4gICAgICAgICdiYWNrdGlja3MnLFxuICAgICAgICAnZW1waGFzaXMnLFxuICAgICAgICAnZW50aXR5JyxcbiAgICAgICAgJ2VzY2FwZScsXG4gICAgICAgICdodG1sX2lubGluZScsXG4gICAgICAgICdpbWFnZScsXG4gICAgICAgICdsaW5rJyxcbiAgICAgICAgJ25ld2xpbmUnLFxuICAgICAgICAndGV4dCdcbiAgICAgIF1cbiAgICB9XG4gIH1cbn07XG4iLCIvLyBtYXJrZG93bi1pdCBkZWZhdWx0IG9wdGlvbnNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvcHRpb25zOiB7XG4gICAgaHRtbDogICAgICAgICBmYWxzZSwgICAgICAgIC8vIEVuYWJsZSBIVE1MIHRhZ3MgaW4gc291cmNlXG4gICAgeGh0bWxPdXQ6ICAgICBmYWxzZSwgICAgICAgIC8vIFVzZSAnLycgdG8gY2xvc2Ugc2luZ2xlIHRhZ3MgKDxiciAvPilcbiAgICBicmVha3M6ICAgICAgIGZhbHNlLCAgICAgICAgLy8gQ29udmVydCAnXFxuJyBpbiBwYXJhZ3JhcGhzIGludG8gPGJyPlxuICAgIGxhbmdQcmVmaXg6ICAgJ2xhbmd1YWdlLScsICAvLyBDU1MgbGFuZ3VhZ2UgcHJlZml4IGZvciBmZW5jZWQgYmxvY2tzXG4gICAgbGlua2lmeTogICAgICBmYWxzZSwgICAgICAgIC8vIGF1dG9jb252ZXJ0IFVSTC1saWtlIHRleHRzIHRvIGxpbmtzXG5cbiAgICAvLyBFbmFibGUgc29tZSBsYW5ndWFnZS1uZXV0cmFsIHJlcGxhY2VtZW50cyArIHF1b3RlcyBiZWF1dGlmaWNhdGlvblxuICAgIHR5cG9ncmFwaGVyOiAgZmFsc2UsXG5cbiAgICAvLyBEb3VibGUgKyBzaW5nbGUgcXVvdGVzIHJlcGxhY2VtZW50IHBhaXJzLCB3aGVuIHR5cG9ncmFwaGVyIGVuYWJsZWQsXG4gICAgLy8gYW5kIHNtYXJ0cXVvdGVzIG9uLiBTZXQgZG91YmxlcyB0byAnwqvCuycgZm9yIFJ1c3NpYW4sICfigJ7igJwnIGZvciBHZXJtYW4uXG4gICAgcXVvdGVzOiAnXFx1MjAxY1xcdTIwMWRcXHUyMDE4XFx1MjAxOScgLyog4oCc4oCd4oCY4oCZICovLFxuXG4gICAgLy8gSGlnaGxpZ2h0ZXIgZnVuY3Rpb24uIFNob3VsZCByZXR1cm4gZXNjYXBlZCBIVE1MLFxuICAgIC8vIG9yICcnIGlmIGlucHV0IG5vdCBjaGFuZ2VkXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiAoLypzdHIsIGxhbmcqLykgeyByZXR1cm4gJyc7IH1cbiAgICAvL1xuICAgIGhpZ2hsaWdodDogbnVsbCxcblxuICAgIG1heE5lc3Rpbmc6ICAgMjAgICAgICAgICAgICAvLyBJbnRlcm5hbCBwcm90ZWN0aW9uLCByZWN1cnNpb24gbGltaXRcbiAgfSxcblxuICBjb21wb25lbnRzOiB7XG5cbiAgICBjb3JlOiB7fSxcbiAgICBibG9jazoge30sXG4gICAgaW5saW5lOiB7fVxuICB9XG59O1xuIiwiLy8gXCJaZXJvXCIgcHJlc2V0LCB3aXRoIG5vdGhpbmcgZW5hYmxlZC4gVXNlZnVsIGZvciBtYW51YWwgY29uZmlndXJpbmcgb2Ygc2ltcGxlXG4vLyBtb2Rlcy4gRm9yIGV4YW1wbGUsIHRvIHBhcnNlIGJvbGQvaXRhbGljIG9ubHkuXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3B0aW9uczoge1xuICAgIGh0bWw6ICAgICAgICAgZmFsc2UsICAgICAgICAvLyBFbmFibGUgSFRNTCB0YWdzIGluIHNvdXJjZVxuICAgIHhodG1sT3V0OiAgICAgZmFsc2UsICAgICAgICAvLyBVc2UgJy8nIHRvIGNsb3NlIHNpbmdsZSB0YWdzICg8YnIgLz4pXG4gICAgYnJlYWtzOiAgICAgICBmYWxzZSwgICAgICAgIC8vIENvbnZlcnQgJ1xcbicgaW4gcGFyYWdyYXBocyBpbnRvIDxicj5cbiAgICBsYW5nUHJlZml4OiAgICdsYW5ndWFnZS0nLCAgLy8gQ1NTIGxhbmd1YWdlIHByZWZpeCBmb3IgZmVuY2VkIGJsb2Nrc1xuICAgIGxpbmtpZnk6ICAgICAgZmFsc2UsICAgICAgICAvLyBhdXRvY29udmVydCBVUkwtbGlrZSB0ZXh0cyB0byBsaW5rc1xuXG4gICAgLy8gRW5hYmxlIHNvbWUgbGFuZ3VhZ2UtbmV1dHJhbCByZXBsYWNlbWVudHMgKyBxdW90ZXMgYmVhdXRpZmljYXRpb25cbiAgICB0eXBvZ3JhcGhlcjogIGZhbHNlLFxuXG4gICAgLy8gRG91YmxlICsgc2luZ2xlIHF1b3RlcyByZXBsYWNlbWVudCBwYWlycywgd2hlbiB0eXBvZ3JhcGhlciBlbmFibGVkLFxuICAgIC8vIGFuZCBzbWFydHF1b3RlcyBvbi4gU2V0IGRvdWJsZXMgdG8gJ8KrwrsnIGZvciBSdXNzaWFuLCAn4oCe4oCcJyBmb3IgR2VybWFuLlxuICAgIHF1b3RlczogJ1xcdTIwMWNcXHUyMDFkXFx1MjAxOFxcdTIwMTknIC8qIOKAnOKAneKAmOKAmSAqLyxcblxuICAgIC8vIEhpZ2hsaWdodGVyIGZ1bmN0aW9uLiBTaG91bGQgcmV0dXJuIGVzY2FwZWQgSFRNTCxcbiAgICAvLyBvciAnJyBpZiBpbnB1dCBub3QgY2hhbmdlZFxuICAgIC8vXG4gICAgLy8gZnVuY3Rpb24gKC8qc3RyLCBsYW5nKi8pIHsgcmV0dXJuICcnOyB9XG4gICAgLy9cbiAgICBoaWdobGlnaHQ6IG51bGwsXG5cbiAgICBtYXhOZXN0aW5nOiAgIDIwICAgICAgICAgICAgLy8gSW50ZXJuYWwgcHJvdGVjdGlvbiwgcmVjdXJzaW9uIGxpbWl0XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuXG4gICAgY29yZToge1xuICAgICAgcnVsZXM6IFtcbiAgICAgICAgJ25vcm1hbGl6ZScsXG4gICAgICAgICdibG9jaycsXG4gICAgICAgICdpbmxpbmUnXG4gICAgICBdXG4gICAgfSxcblxuICAgIGJsb2NrOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAncGFyYWdyYXBoJ1xuICAgICAgXVxuICAgIH0sXG5cbiAgICBpbmxpbmU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICd0ZXh0J1xuICAgICAgXVxuICAgIH1cbiAgfVxufTtcbiIsIi8qKlxuICogY2xhc3MgUmVuZGVyZXJcbiAqXG4gKiBHZW5lcmF0ZXMgSFRNTCBmcm9tIHBhcnNlZCB0b2tlbiBzdHJlYW0uIEVhY2ggaW5zdGFuY2UgaGFzIGluZGVwZW5kZW50XG4gKiBjb3B5IG9mIHJ1bGVzLiBUaG9zZSBjYW4gYmUgcmV3cml0dGVuIHdpdGggZWFzZS4gQWxzbywgeW91IGNhbiBhZGQgbmV3XG4gKiBydWxlcyBpZiB5b3UgY3JlYXRlIHBsdWdpbiBhbmQgYWRkcyBuZXcgdG9rZW4gdHlwZXMuXG4gKiovXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIGFzc2lnbiAgICAgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykuYXNzaWduO1xudmFyIHVuZXNjYXBlTWQgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykudW5lc2NhcGVNZDtcbnZhciByZXBsYWNlRW50aXRpZXMgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLnJlcGxhY2VFbnRpdGllcztcbnZhciBlc2NhcGVIdG1sICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLmVzY2FwZUh0bWw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIHJ1bGVzID0ge307XG5cblxucnVsZXMuYmxvY2txdW90ZV9vcGVuICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8YmxvY2txdW90ZT5cXG4nOyB9O1xucnVsZXMuYmxvY2txdW90ZV9jbG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L2Jsb2NrcXVvdGU+XFxuJzsgfTtcblxuXG5ydWxlcy5jb2RlX2Jsb2NrID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8cHJlPjxjb2RlPicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpICsgJzwvY29kZT48L3ByZT5cXG4nO1xufTtcbnJ1bGVzLmNvZGVfaW5saW5lID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8Y29kZT4nICsgZXNjYXBlSHRtbCh0b2tlbnNbaWR4XS5jb250ZW50KSArICc8L2NvZGU+Jztcbn07XG5cblxucnVsZXMuZmVuY2UgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgsIG9wdGlvbnMgLyosIGVudiwgc2VsZiovKSB7XG4gIHZhciB0b2tlbiA9IHRva2Vuc1tpZHhdO1xuICB2YXIgbGFuZ0NsYXNzID0gJyc7XG4gIHZhciBsYW5nUHJlZml4ID0gb3B0aW9ucy5sYW5nUHJlZml4O1xuICB2YXIgbGFuZ05hbWUgPSAnJztcbiAgdmFyIGhpZ2hsaWdodGVkO1xuXG4gIGlmICh0b2tlbi5wYXJhbXMpIHtcbiAgICBsYW5nTmFtZSA9IGVzY2FwZUh0bWwocmVwbGFjZUVudGl0aWVzKHVuZXNjYXBlTWQodG9rZW4ucGFyYW1zLnNwbGl0KC9cXHMrL2cpWzBdKSkpO1xuICAgIGxhbmdDbGFzcyA9ICcgY2xhc3M9XCInICsgbGFuZ1ByZWZpeCArIGxhbmdOYW1lICsgJ1wiJztcbiAgfVxuXG4gIGlmIChvcHRpb25zLmhpZ2hsaWdodCkge1xuICAgIGhpZ2hsaWdodGVkID0gb3B0aW9ucy5oaWdobGlnaHQodG9rZW4uY29udGVudCwgbGFuZ05hbWUpIHx8IGVzY2FwZUh0bWwodG9rZW4uY29udGVudCk7XG4gIH0gZWxzZSB7XG4gICAgaGlnaGxpZ2h0ZWQgPSBlc2NhcGVIdG1sKHRva2VuLmNvbnRlbnQpO1xuICB9XG5cblxuICByZXR1cm4gICc8cHJlPjxjb2RlJyArIGxhbmdDbGFzcyArICc+J1xuICAgICAgICArIGhpZ2hsaWdodGVkXG4gICAgICAgICsgJzwvY29kZT48L3ByZT5cXG4nO1xufTtcblxuXG5ydWxlcy5oZWFkaW5nX29wZW4gPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxoJyArIHRva2Vuc1tpZHhdLmhMZXZlbCArICc+Jztcbn07XG5ydWxlcy5oZWFkaW5nX2Nsb3NlID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L2gnICsgdG9rZW5zW2lkeF0uaExldmVsICsgJz5cXG4nO1xufTtcblxuXG5ydWxlcy5ociA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucyAvKiwgZW52ICovKSB7XG4gIHJldHVybiAob3B0aW9ucy54aHRtbE91dCA/ICc8aHIgLz5cXG4nIDogJzxocj5cXG4nKTtcbn07XG5cblxucnVsZXMuYnVsbGV0X2xpc3Rfb3BlbiAgID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzx1bD5cXG4nOyB9O1xucnVsZXMuYnVsbGV0X2xpc3RfY2xvc2UgID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzwvdWw+XFxuJzsgfTtcbnJ1bGVzLmxpc3RfaXRlbV9vcGVuICAgICA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHZhciBuZXh0ID0gdG9rZW5zW2lkeCArIDFdO1xuICBpZiAoKG5leHQudHlwZSA9PT0gJ2xpc3RfaXRlbV9jbG9zZScpIHx8XG4gICAgICAobmV4dC50eXBlID09PSAncGFyYWdyYXBoX29wZW4nICYmIG5leHQudGlnaHQpKSB7XG4gICAgcmV0dXJuICc8bGk+JztcbiAgfVxuICByZXR1cm4gJzxsaT5cXG4nO1xufTtcbnJ1bGVzLmxpc3RfaXRlbV9jbG9zZSAgICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L2xpPlxcbic7IH07XG5ydWxlcy5vcmRlcmVkX2xpc3Rfb3BlbiAgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICBpZiAodG9rZW5zW2lkeF0ub3JkZXIgPiAxKSB7XG4gICAgcmV0dXJuICc8b2wgc3RhcnQ9XCInICsgdG9rZW5zW2lkeF0ub3JkZXIgKyAnXCI+XFxuJztcbiAgfVxuICByZXR1cm4gJzxvbD5cXG4nO1xufTtcbnJ1bGVzLm9yZGVyZWRfbGlzdF9jbG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L29sPlxcbic7IH07XG5cblxucnVsZXMucGFyYWdyYXBoX29wZW4gPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gdG9rZW5zW2lkeF0udGlnaHQgPyAnJyA6ICc8cD4nO1xufTtcbnJ1bGVzLnBhcmFncmFwaF9jbG9zZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIGlmICh0b2tlbnNbaWR4XS50aWdodCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB0b2tlbnNbaWR4ICsgMV0udHlwZS5zbGljZSgtNSkgPT09ICdjbG9zZScgPyAnJyA6ICdcXG4nO1xuICB9XG4gIHJldHVybiAnPC9wPlxcbic7XG59O1xuXG5cbnJ1bGVzLmxpbmtfb3BlbiA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHZhciB0aXRsZSA9IHRva2Vuc1tpZHhdLnRpdGxlID8gKCcgdGl0bGU9XCInICsgZXNjYXBlSHRtbChyZXBsYWNlRW50aXRpZXModG9rZW5zW2lkeF0udGl0bGUpKSArICdcIicpIDogJyc7XG4gIHZhciB0YXJnZXQgPSB0b2tlbnNbaWR4XS50YXJnZXQgPyAoJyB0YXJnZXQ9XCInICsgZXNjYXBlSHRtbCh0b2tlbnNbaWR4XS50YXJnZXQpICsgJ1wiJykgOiAnJztcbiAgcmV0dXJuICc8YSBocmVmPVwiJyArIGVzY2FwZUh0bWwodG9rZW5zW2lkeF0uaHJlZikgKyAnXCInICsgdGl0bGUgKyB0YXJnZXQgKyAnPic7XG59O1xucnVsZXMubGlua19jbG9zZSA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPC9hPic7XG59O1xuXG5cbnJ1bGVzLmltYWdlID0gZnVuY3Rpb24gKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNlbGYpIHtcbiAgdmFyIHNyYyA9ICcgc3JjPVwiJyArIGVzY2FwZUh0bWwodG9rZW5zW2lkeF0uc3JjKSArICdcIic7XG4gIHZhciB0aXRsZSA9IHRva2Vuc1tpZHhdLnRpdGxlID8gKCcgdGl0bGU9XCInICsgZXNjYXBlSHRtbChyZXBsYWNlRW50aXRpZXModG9rZW5zW2lkeF0udGl0bGUpKSArICdcIicpIDogJyc7XG4gIHZhciBhbHQgPSAnIGFsdD1cIicgKyBzZWxmLnJlbmRlcklubGluZUFzVGV4dCh0b2tlbnNbaWR4XS50b2tlbnMsIG9wdGlvbnMsIGVudikgKyAnXCInO1xuICB2YXIgc3VmZml4ID0gb3B0aW9ucy54aHRtbE91dCA/ICcgLycgOiAnJztcbiAgcmV0dXJuICc8aW1nJyArIHNyYyArIGFsdCArIHRpdGxlICsgc3VmZml4ICsgJz4nO1xufTtcblxuXG5ydWxlcy50YWJsZV9vcGVuICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8dGFibGU+XFxuJzsgfTtcbnJ1bGVzLnRhYmxlX2Nsb3NlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzwvdGFibGU+XFxuJzsgfTtcbnJ1bGVzLnRoZWFkX29wZW4gID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzx0aGVhZD5cXG4nOyB9O1xucnVsZXMudGhlYWRfY2xvc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPC90aGVhZD5cXG4nOyB9O1xucnVsZXMudGJvZHlfb3BlbiAgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPHRib2R5Plxcbic7IH07XG5ydWxlcy50Ym9keV9jbG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L3Rib2R5Plxcbic7IH07XG5ydWxlcy50cl9vcGVuICAgICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8dHI+JzsgfTtcbnJ1bGVzLnRyX2Nsb3NlICAgID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzwvdHI+XFxuJzsgfTtcbnJ1bGVzLnRoX29wZW4gICAgID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgaWYgKHRva2Vuc1tpZHhdLmFsaWduKSB7XG4gICAgcmV0dXJuICc8dGggc3R5bGU9XCJ0ZXh0LWFsaWduOicgKyB0b2tlbnNbaWR4XS5hbGlnbiArICdcIj4nO1xuICB9XG4gIHJldHVybiAnPHRoPic7XG59O1xucnVsZXMudGhfY2xvc2UgICAgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPC90aD4nOyB9O1xucnVsZXMudGRfb3BlbiAgICAgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICBpZiAodG9rZW5zW2lkeF0uYWxpZ24pIHtcbiAgICByZXR1cm4gJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246JyArIHRva2Vuc1tpZHhdLmFsaWduICsgJ1wiPic7XG4gIH1cbiAgcmV0dXJuICc8dGQ+Jztcbn07XG5ydWxlcy50ZF9jbG9zZSAgICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L3RkPic7IH07XG5cblxucnVsZXMuc3Ryb25nX29wZW4gID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzxzdHJvbmc+JzsgfTtcbnJ1bGVzLnN0cm9uZ19jbG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8L3N0cm9uZz4nOyB9O1xuXG5cbnJ1bGVzLmVtX29wZW4gID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzxlbT4nOyB9O1xucnVsZXMuZW1fY2xvc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPC9lbT4nOyB9O1xuXG5cbnJ1bGVzLnNfb3BlbiAgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPHM+JzsgfTtcbnJ1bGVzLnNfY2xvc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPC9zPic7IH07XG5cblxucnVsZXMuaGFyZGJyZWFrID0gZnVuY3Rpb24gKHRva2VucywgaWR4LCBvcHRpb25zIC8qLCBlbnYgKi8pIHtcbiAgcmV0dXJuIG9wdGlvbnMueGh0bWxPdXQgPyAnPGJyIC8+XFxuJyA6ICc8YnI+XFxuJztcbn07XG5ydWxlcy5zb2Z0YnJlYWsgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgsIG9wdGlvbnMgLyosIGVudiAqLykge1xuICByZXR1cm4gb3B0aW9ucy5icmVha3MgPyAob3B0aW9ucy54aHRtbE91dCA/ICc8YnIgLz5cXG4nIDogJzxicj5cXG4nKSA6ICdcXG4nO1xufTtcblxuXG5ydWxlcy50ZXh0ID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuIGVzY2FwZUh0bWwodG9rZW5zW2lkeF0uY29udGVudCk7XG59O1xuXG5cbnJ1bGVzLmh0bWxfYmxvY2sgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gdG9rZW5zW2lkeF0uY29udGVudDtcbn07XG5ydWxlcy5odG1sX2lubGluZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiB0b2tlbnNbaWR4XS5jb250ZW50O1xufTtcblxuXG4vKipcbiAqIG5ldyBSZW5kZXJlcigpXG4gKlxuICogQ3JlYXRlcyBuZXcgW1tSZW5kZXJlcl1dIGluc3RhbmNlIGFuZCBmaWxsIFtbUmVuZGVyZXIjcnVsZXNdXSB3aXRoIGRlZmF1bHRzLlxuICoqL1xuZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG5cbiAgLyoqXG4gICAqIFJlbmRlcmVyI3J1bGVzIC0+IE9iamVjdFxuICAgKlxuICAgKiBDb250YWlucyByZW5kZXIgcnVsZXMgZm9yIHRva2Vucy4gQ2FuIGJlIHVwZGF0ZWQgYW5kIGV4dGVuZGVkLlxuICAgKlxuICAgKiAjIyMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICAgKlxuICAgKiBtZC5yZW5kZXJlci5ydWxlcy5zdHJvbmdfb3BlbiAgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPGI+JzsgfTtcbiAgICogbWQucmVuZGVyZXIucnVsZXMuc3Ryb25nX2Nsb3NlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJzwvYj4nOyB9O1xuICAgKlxuICAgKiB2YXIgcmVzdWx0ID0gbWQucmVuZGVySW5saW5lKC4uLik7XG4gICAqIGBgYFxuICAgKlxuICAgKiBFYWNoIHJ1bGUgaXMgY2FsbGVkIGFzIGluZGVwZW5kZWQgc3RhdGljIGZ1bmN0aW9uIHdpdGggZml4ZWQgc2lnbmF0dXJlOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGZ1bmN0aW9uIG15X3Rva2VuX3JlbmRlcih0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCByZW5kZXJlcikge1xuICAgKiAgIC8vIC4uLlxuICAgKiAgIHJldHVybiByZW5kZXJlZEhUTUw7XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSBbc291cmNlIGNvZGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcmVuZGVyZXIuanMpXG4gICAqIGZvciBtb3JlIGRldGFpbHMgYW5kIGV4YW1wbGVzLlxuICAgKiovXG4gIHRoaXMucnVsZXMgPSBhc3NpZ24oe30sIHJ1bGVzKTtcbn1cblxuXG4vKipcbiAqIFJlbmRlcmVyLnJlbmRlcklubGluZSh0b2tlbnMsIG9wdGlvbnMsIGVudikgLT4gU3RyaW5nXG4gKiAtIHRva2VucyAoQXJyYXkpOiBsaXN0IG9uIGJsb2NrIHRva2VucyB0byByZW50ZXJcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcGFyYW1zIG9mIHBhcnNlciBpbnN0YW5jZVxuICogLSBlbnYgKE9iamVjdCk6IGFkZGl0aW9uYWwgZGF0YSBmcm9tIHBhcnNlZCBpbnB1dCAocmVmZXJlbmNlcywgZm9yIGV4YW1wbGUpXG4gKlxuICogVGhlIHNhbWUgYXMgW1tSZW5kZXJlci5yZW5kZXJdXSwgYnV0IGZvciBzaW5nbGUgdG9rZW4gb2YgYGlubGluZWAgdHlwZS5cbiAqKi9cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJJbmxpbmUgPSBmdW5jdGlvbiAodG9rZW5zLCBvcHRpb25zLCBlbnYpIHtcbiAgdmFyIHJlc3VsdCA9ICcnLFxuICAgICAgX3J1bGVzID0gdGhpcy5ydWxlcztcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG9rZW5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IF9ydWxlc1t0b2tlbnNbaV0udHlwZV0odG9rZW5zLCBpLCBvcHRpb25zLCBlbnYsIHRoaXMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLyoqIGludGVybmFsXG4gKiBSZW5kZXJlci5yZW5kZXJJbmxpbmVBc1RleHQodG9rZW5zLCBvcHRpb25zLCBlbnYpIC0+IFN0cmluZ1xuICogLSB0b2tlbnMgKEFycmF5KTogbGlzdCBvbiBibG9jayB0b2tlbnMgdG8gcmVudGVyXG4gKiAtIG9wdGlvbnMgKE9iamVjdCk6IHBhcmFtcyBvZiBwYXJzZXIgaW5zdGFuY2VcbiAqIC0gZW52IChPYmplY3QpOiBhZGRpdGlvbmFsIGRhdGEgZnJvbSBwYXJzZWQgaW5wdXQgKHJlZmVyZW5jZXMsIGZvciBleGFtcGxlKVxuICpcbiAqIFNwZWNpYWwga2x1ZGdlIGZvciBpbWFnZSBgYWx0YCBhdHRyaWJ1dGVzIHRvIGNvbmZvcm0gQ29tbW9uTWFyayBzcGVjLlxuICogRG9uJ3QgdHJ5IHRvIHVzZSBpdCEgU3BlYyByZXF1aXJlcyB0byBzaG93IGBhbHRgIGNvbnRlbnQgd2l0aCBzdHJpcHBlZCBtYXJrdXAsXG4gKiBpbnN0ZWFkIG9mIHNpbXBsZSBlc2NhcGluZy5cbiAqKi9cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJJbmxpbmVBc1RleHQgPSBmdW5jdGlvbiAodG9rZW5zLCBvcHRpb25zLCBlbnYpIHtcbiAgdmFyIHJlc3VsdCA9ICcnLFxuICAgICAgX3J1bGVzID0gdGhpcy5ydWxlcztcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG9rZW5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKHRva2Vuc1tpXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHJlc3VsdCArPSBfcnVsZXMudGV4dCh0b2tlbnMsIGksIG9wdGlvbnMsIGVudiwgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVySW5saW5lQXNUZXh0KHRva2Vuc1tpXS50b2tlbnMsIG9wdGlvbnMsIGVudik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLyoqXG4gKiBSZW5kZXJlci5yZW5kZXIodG9rZW5zLCBvcHRpb25zLCBlbnYpIC0+IFN0cmluZ1xuICogLSB0b2tlbnMgKEFycmF5KTogbGlzdCBvbiBibG9jayB0b2tlbnMgdG8gcmVudGVyXG4gKiAtIG9wdGlvbnMgKE9iamVjdCk6IHBhcmFtcyBvZiBwYXJzZXIgaW5zdGFuY2VcbiAqIC0gZW52IChPYmplY3QpOiBhZGRpdGlvbmFsIGRhdGEgZnJvbSBwYXJzZWQgaW5wdXQgKHJlZmVyZW5jZXMsIGZvciBleGFtcGxlKVxuICpcbiAqIFRha2VzIHRva2VuIHN0cmVhbSBhbmQgZ2VuZXJhdGVzIEhUTUwuIFByb2JhYmx5LCB5b3Ugd2lsbCBuZXZlciBuZWVkIHRvIGNhbGxcbiAqIHRoaXMgbWV0aG9kIGRpcmVjdGx5LlxuICoqL1xuUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICh0b2tlbnMsIG9wdGlvbnMsIGVudikge1xuICB2YXIgaSwgbGVuLFxuICAgICAgcmVzdWx0ID0gJycsXG4gICAgICBfcnVsZXMgPSB0aGlzLnJ1bGVzO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHRva2Vucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gJ2lubGluZScpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLnJlbmRlcklubGluZSh0b2tlbnNbaV0uY2hpbGRyZW4sIG9wdGlvbnMsIGVudik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCArPSBfcnVsZXNbdG9rZW5zW2ldLnR5cGVdKHRva2VucywgaSwgb3B0aW9ucywgZW52LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjtcbiIsIi8qKlxuICogY2xhc3MgUnVsZXJcbiAqXG4gKiBIZWxwZXIgY2xhc3MsIHVzZWQgYnkgW1tNYXJrZG93bkl0I2NvcmVdXSwgW1tNYXJrZG93bkl0I2Jsb2NrXV0gYW5kXG4gKiBbW01hcmtkb3duSXQjaW5saW5lXV0gdG8gbWFuYWdlIHNlcXVlbmNlcyBvZiBmdW5jdGlvbnMgKHJ1bGVzKTpcbiAqXG4gKiAtIGtlZXAgcnVsZXMgaW4gZGVmaW5lZCBvcmRlclxuICogLSBhc3NpZ24gdGhlIG5hbWUgdG8gZWFjaCBydWxlXG4gKiAtIGVuYWJsZS9kaXNhYmxlIHJ1bGVzXG4gKiAtIGFkZC9yZXBsYWNlIHJ1bGVzXG4gKiAtIGFsbG93IGFzc2lnbiBydWxlcyB0byBhZGRpdGlvbmFsIG5hbWVkIGNoYWlucyAoaW4gdGhlIHNhbWUpXG4gKiAtIGNhY2hlaW5nIGxpc3RzIG9mIGFjdGl2ZSBydWxlc1xuICpcbiAqIFlvdSB3aWxsIG5vdCBuZWVkIHVzZSB0aGlzIGNsYXNzIGRpcmVjdGx5IHVudGlsIHdyaXRlIHBsdWdpbnMuIEZvciBzaW1wbGVcbiAqIHJ1bGVzIGNvbnRyb2wgdXNlIFtbTWFya2Rvd25JdC5kaXNhYmxlXV0sIFtbTWFya2Rvd25JdC5lbmFibGVdXSBhbmRcbiAqIFtbTWFya2Rvd25JdC51c2VdXS5cbiAqKi9cbid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIG5ldyBSdWxlcigpXG4gKiovXG5mdW5jdGlvbiBSdWxlcigpIHtcbiAgLy8gTGlzdCBvZiBhZGRlZCBydWxlcy4gRWFjaCBlbGVtZW50IGlzOlxuICAvL1xuICAvLyB7XG4gIC8vICAgbmFtZTogWFhYLFxuICAvLyAgIGVuYWJsZWQ6IEJvb2xlYW4sXG4gIC8vICAgZm46IEZ1bmN0aW9uKCksXG4gIC8vICAgYWx0OiBbIG5hbWUyLCBuYW1lMyBdXG4gIC8vIH1cbiAgLy9cbiAgdGhpcy5fX3J1bGVzX18gPSBbXTtcblxuICAvLyBDYWNoZWQgcnVsZSBjaGFpbnMuXG4gIC8vXG4gIC8vIEZpcnN0IGxldmVsIC0gY2hhaW4gbmFtZSwgJycgZm9yIGRlZmF1bHQuXG4gIC8vIFNlY29uZCBsZXZlbCAtIGRpZ2luYWwgYW5jaG9yIGZvciBmYXN0IGZpbHRlcmluZyBieSBjaGFyY29kZXMuXG4gIC8vXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEhlbHBlciBtZXRob2RzLCBzaG91bGQgbm90IGJlIHVzZWQgZGlyZWN0bHlcblxuXG4vLyBGaW5kIHJ1bGUgaW5kZXggYnkgbmFtZVxuLy9cblJ1bGVyLnByb3RvdHlwZS5fX2ZpbmRfXyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fX3J1bGVzX18ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGhpcy5fX3J1bGVzX19baV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn07XG5cblxuLy8gQnVpbGQgcnVsZXMgbG9va3VwIGNhY2hlXG4vL1xuUnVsZXIucHJvdG90eXBlLl9fY29tcGlsZV9fID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjaGFpbnMgPSBbICcnIF07XG5cbiAgLy8gY29sbGVjdCB1bmlxdWUgbmFtZXNcbiAgc2VsZi5fX3J1bGVzX18uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIGlmICghcnVsZS5lbmFibGVkKSB7IHJldHVybjsgfVxuXG4gICAgcnVsZS5hbHQuZm9yRWFjaChmdW5jdGlvbiAoYWx0TmFtZSkge1xuICAgICAgaWYgKGNoYWlucy5pbmRleE9mKGFsdE5hbWUpIDwgMCkge1xuICAgICAgICBjaGFpbnMucHVzaChhbHROYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZi5fX2NhY2hlX18gPSB7fTtcblxuICBjaGFpbnMuZm9yRWFjaChmdW5jdGlvbiAoY2hhaW4pIHtcbiAgICBzZWxmLl9fY2FjaGVfX1tjaGFpbl0gPSBbXTtcbiAgICBzZWxmLl9fcnVsZXNfXy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBpZiAoIXJ1bGUuZW5hYmxlZCkgeyByZXR1cm47IH1cblxuICAgICAgaWYgKGNoYWluICYmIHJ1bGUuYWx0LmluZGV4T2YoY2hhaW4pIDwgMCkgeyByZXR1cm47IH1cblxuICAgICAgc2VsZi5fX2NhY2hlX19bY2hhaW5dLnB1c2gocnVsZS5mbik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuXG4vKipcbiAqIFJ1bGVyLmF0KG5hbWUsIGZuIFssIG9wdGlvbnNdKVxuICogLSBuYW1lIChTdHJpbmcpOiBydWxlIG5hbWUgdG8gcmVwbGFjZS5cbiAqIC0gZm4gKEZ1bmN0aW9uKTogbmV3IHJ1bGUgZnVuY3Rpb24uXG4gKiAtIG9wdGlvbnMgKE9iamVjdCk6IG5ldyBydWxlIG9wdGlvbnMgKG5vdCBtYW5kYXRvcnkpLlxuICpcbiAqIFJlcGxhY2UgcnVsZSBieSBuYW1lIHdpdGggbmV3IGZ1bmN0aW9uICYgb3B0aW9ucy4gVGhyb3dzIGVycm9yIGlmIG5hbWUgbm90XG4gKiBmb3VuZC5cbiAqXG4gKiAjIyMjIyBPcHRpb25zOlxuICpcbiAqIC0gX19hbHRfXyAtIGFycmF5IHdpdGggbmFtZXMgb2YgXCJhbHRlcm5hdGVcIiBjaGFpbnMuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIFJlcGxhY2UgZXhpc3RpbmcgdHlwb3JnYXBoZXIgcmVwbGFjZW1lbnQgcnVsZSB3aXRoIG5ldyBvbmU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICpcbiAqIG1kLmNvcmUucnVsZXIuYXQoJ3JlcGxhY2VtZW50cycsIGZ1bmN0aW9uIHJlcGxhY2Uoc3RhdGUpIHtcbiAqICAgLy8uLi5cbiAqIH0pO1xuICogYGBgXG4gKiovXG5SdWxlci5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiAobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5fX2ZpbmRfXyhuYW1lKTtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKGluZGV4ID09PSAtMSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlciBydWxlIG5vdCBmb3VuZDogJyArIG5hbWUpOyB9XG5cbiAgdGhpcy5fX3J1bGVzX19baW5kZXhdLmZuID0gZm47XG4gIHRoaXMuX19ydWxlc19fW2luZGV4XS5hbHQgPSBvcHQuYWx0IHx8IFtdO1xuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuYmVmb3JlKGJlZm9yZU5hbWUsIHJ1bGVOYW1lLCBmbiBbLCBvcHRpb25zXSlcbiAqIC0gYmVmb3JlTmFtZSAoU3RyaW5nKTogbmV3IHJ1bGUgd2lsbCBiZSBhZGRlZCBiZWZvcmUgdGhpcyBvbmUuXG4gKiAtIHJ1bGVOYW1lIChTdHJpbmcpOiBuYW1lIG9mIGFkZGVkIHJ1bGUuXG4gKiAtIGZuIChGdW5jdGlvbik6IHJ1bGUgZnVuY3Rpb24uXG4gKiAtIG9wdGlvbnMgKE9iamVjdCk6IHJ1bGUgb3B0aW9ucyAobm90IG1hbmRhdG9yeSkuXG4gKlxuICogQWRkIG5ldyBydWxlIHRvIGNoYWluIGJlZm9yZSBvbmUgd2l0aCBnaXZlbiBuYW1lLiBTZWUgYWxzb1xuICogW1tSdWxlci5hZnRlcl1dLCBbW1J1bGVyLnB1c2hdXS5cbiAqXG4gKiAjIyMjIyBPcHRpb25zOlxuICpcbiAqIC0gX19hbHRfXyAtIGFycmF5IHdpdGggbmFtZXMgb2YgXCJhbHRlcm5hdGVcIiBjaGFpbnMuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAqXG4gKiBtZC5ibG9jay5ydWxlci5iZWZvcmUoJ3BhcmFncmFwaCcsICdteV9ydWxlJywgZnVuY3Rpb24gcmVwbGFjZShzdGF0ZSkge1xuICogICAvLy4uLlxuICogfSk7XG4gKiBgYGBcbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5iZWZvcmUgPSBmdW5jdGlvbiAoYmVmb3JlTmFtZSwgcnVsZU5hbWUsIGZuLCBvcHRpb25zKSB7XG4gIHZhciBpbmRleCA9IHRoaXMuX19maW5kX18oYmVmb3JlTmFtZSk7XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChpbmRleCA9PT0gLTEpIHsgdGhyb3cgbmV3IEVycm9yKCdQYXJzZXIgcnVsZSBub3QgZm91bmQ6ICcgKyBiZWZvcmVOYW1lKTsgfVxuXG4gIHRoaXMuX19ydWxlc19fLnNwbGljZShpbmRleCwgMCwge1xuICAgIG5hbWU6IHJ1bGVOYW1lLFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgZm46IGZuLFxuICAgIGFsdDogb3B0LmFsdCB8fCBbXVxuICB9KTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuYWZ0ZXIoYWZ0ZXJOYW1lLCBydWxlTmFtZSwgZm4gWywgb3B0aW9uc10pXG4gKiAtIGFmdGVyTmFtZSAoU3RyaW5nKTogbmV3IHJ1bGUgd2lsbCBiZSBhZGRlZCBhZnRlciB0aGlzIG9uZS5cbiAqIC0gcnVsZU5hbWUgKFN0cmluZyk6IG5hbWUgb2YgYWRkZWQgcnVsZS5cbiAqIC0gZm4gKEZ1bmN0aW9uKTogcnVsZSBmdW5jdGlvbi5cbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcnVsZSBvcHRpb25zIChub3QgbWFuZGF0b3J5KS5cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgdG8gY2hhaW4gYWZ0ZXIgb25lIHdpdGggZ2l2ZW4gbmFtZS4gU2VlIGFsc29cbiAqIFtbUnVsZXIuYmVmb3JlXV0sIFtbUnVsZXIucHVzaF1dLlxuICpcbiAqICMjIyMjIE9wdGlvbnM6XG4gKlxuICogLSBfX2FsdF9fIC0gYXJyYXkgd2l0aCBuYW1lcyBvZiBcImFsdGVybmF0ZVwiIGNoYWlucy5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICpcbiAqIG1kLmlubGluZS5ydWxlci5hZnRlcigndGV4dCcsICdteV9ydWxlJywgZnVuY3Rpb24gcmVwbGFjZShzdGF0ZSkge1xuICogICAvLy4uLlxuICogfSk7XG4gKiBgYGBcbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5hZnRlciA9IGZ1bmN0aW9uIChhZnRlck5hbWUsIHJ1bGVOYW1lLCBmbiwgb3B0aW9ucykge1xuICB2YXIgaW5kZXggPSB0aGlzLl9fZmluZF9fKGFmdGVyTmFtZSk7XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChpbmRleCA9PT0gLTEpIHsgdGhyb3cgbmV3IEVycm9yKCdQYXJzZXIgcnVsZSBub3QgZm91bmQ6ICcgKyBhZnRlck5hbWUpOyB9XG5cbiAgdGhpcy5fX3J1bGVzX18uc3BsaWNlKGluZGV4ICsgMSwgMCwge1xuICAgIG5hbWU6IHJ1bGVOYW1lLFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgZm46IGZuLFxuICAgIGFsdDogb3B0LmFsdCB8fCBbXVxuICB9KTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG4vKipcbiAqIFJ1bGVyLnB1c2gocnVsZU5hbWUsIGZuIFssIG9wdGlvbnNdKVxuICogLSBydWxlTmFtZSAoU3RyaW5nKTogbmFtZSBvZiBhZGRlZCBydWxlLlxuICogLSBmbiAoRnVuY3Rpb24pOiBydWxlIGZ1bmN0aW9uLlxuICogLSBvcHRpb25zIChPYmplY3QpOiBydWxlIG9wdGlvbnMgKG5vdCBtYW5kYXRvcnkpLlxuICpcbiAqIFB1c2ggbmV3IHJ1bGUgdG8gdGhlIGVuZCBvZiBjaGFpbi4gU2VlIGFsc29cbiAqIFtbUnVsZXIuYmVmb3JlXV0sIFtbUnVsZXIuYWZ0ZXJdXS5cbiAqXG4gKiAjIyMjIyBPcHRpb25zOlxuICpcbiAqIC0gX19hbHRfXyAtIGFycmF5IHdpdGggbmFtZXMgb2YgXCJhbHRlcm5hdGVcIiBjaGFpbnMuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAqXG4gKiBtZC5jb3JlLnJ1bGVyLnB1c2goJ2VtcGhhc2lzJywgJ215X3J1bGUnLCBmdW5jdGlvbiByZXBsYWNlKHN0YXRlKSB7XG4gKiAgIC8vLi4uXG4gKiB9KTtcbiAqIGBgYFxuICoqL1xuUnVsZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAocnVsZU5hbWUsIGZuLCBvcHRpb25zKSB7XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuX19ydWxlc19fLnB1c2goe1xuICAgIG5hbWU6IHJ1bGVOYW1lLFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgZm46IGZuLFxuICAgIGFsdDogb3B0LmFsdCB8fCBbXVxuICB9KTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuZW5hYmxlKGxpc3QgWywgaWdub3JlSW52YWxpZF0pIC0+IEFycmF5XG4gKiAtIGxpc3QgKFN0cmluZ3xBcnJheSk6IGxpc3Qgb2YgcnVsZSBuYW1lcyB0byBlbmFibGUuXG4gKiAtIGlnbm9yZUludmFsaWQgKEJvb2xlYW4pOiBzZXQgYHRydWVgIHRvIGlnbm9yZSBlcnJvcnMgd2hlbiBydWxlIG5vdCBmb3VuZC5cbiAqXG4gKiBFbmFibGUgcnVsZXMgd2l0aCBnaXZlbiBuYW1lcy4gSWYgYW55IHJ1bGUgbmFtZSBub3QgZm91bmQgLSB0aHJvdyBFcnJvci5cbiAqIEVycm9ycyBjYW4gYmUgZGlzYWJsZWQgYnkgc2Vjb25kIHBhcmFtLlxuICpcbiAqIFJldHVybnMgbGlzdCBvZiBmb3VuZCBydWxlIG5hbWVzIChpZiBubyBleGNlcHRpb24gaGFwcGVuZWQpLlxuICpcbiAqIFNlZSBhbHNvIFtbUnVsZXIuZGlzYWJsZV1dLCBbW1J1bGVyLmVuYWJsZU9ubHldXS5cbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAobGlzdCwgaWdub3JlSW52YWxpZCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHsgbGlzdCA9IFsgbGlzdCBdOyB9XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIC8vIFNlYXJjaCBieSBuYW1lIGFuZCBlbmFibGVcbiAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGlkeCA9IHRoaXMuX19maW5kX18obmFtZSk7XG5cbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgaWYgKGlnbm9yZUludmFsaWQpIHsgcmV0dXJuOyB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1J1bGVzIG1hbmFnZXI6IGludmFsaWQgcnVsZSBuYW1lICcgKyBuYW1lKTtcbiAgICB9XG4gICAgdGhpcy5fX3J1bGVzX19baWR4XS5lbmFibGVkID0gdHJ1ZTtcbiAgICByZXN1bHQucHVzaChuYW1lKTtcbiAgfSwgdGhpcyk7XG5cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKipcbiAqIFJ1bGVyLmVuYWJsZU9ubHkobGlzdCBbLCBpZ25vcmVJbnZhbGlkXSlcbiAqIC0gbGlzdCAoU3RyaW5nfEFycmF5KTogbGlzdCBvZiBydWxlIG5hbWVzIHRvIGVuYWJsZSAod2hpdGVsaXN0KS5cbiAqIC0gaWdub3JlSW52YWxpZCAoQm9vbGVhbik6IHNldCBgdHJ1ZWAgdG8gaWdub3JlIGVycm9ycyB3aGVuIHJ1bGUgbm90IGZvdW5kLlxuICpcbiAqIEVuYWJsZSBydWxlcyB3aXRoIGdpdmVuIG5hbWVzLCBhbmQgZGlzYWJsZSBldmVyeXRoaW5nIGVsc2UuIElmIGFueSBydWxlIG5hbWVcbiAqIG5vdCBmb3VuZCAtIHRocm93IEVycm9yLiBFcnJvcnMgY2FuIGJlIGRpc2FibGVkIGJ5IHNlY29uZCBwYXJhbS5cbiAqXG4gKiBTZWUgYWxzbyBbW1J1bGVyLmRpc2FibGVdXSwgW1tSdWxlci5lbmFibGVdXS5cbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5lbmFibGVPbmx5ID0gZnVuY3Rpb24gKGxpc3QsIGlnbm9yZUludmFsaWQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7IGxpc3QgPSBbIGxpc3QgXTsgfVxuXG4gIHRoaXMuX19ydWxlc19fLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHsgcnVsZS5lbmFibGVkID0gZmFsc2U7IH0pO1xuXG4gIHRoaXMuZW5hYmxlKGxpc3QsIGlnbm9yZUludmFsaWQpO1xufTtcblxuXG4vKipcbiAqIFJ1bGVyLmRpc2FibGUobGlzdCBbLCBpZ25vcmVJbnZhbGlkXSkgLT4gQXJyYXlcbiAqIC0gbGlzdCAoU3RyaW5nfEFycmF5KTogbGlzdCBvZiBydWxlIG5hbWVzIHRvIGRpc2FibGUuXG4gKiAtIGlnbm9yZUludmFsaWQgKEJvb2xlYW4pOiBzZXQgYHRydWVgIHRvIGlnbm9yZSBlcnJvcnMgd2hlbiBydWxlIG5vdCBmb3VuZC5cbiAqXG4gKiBEaXNhYmxlIHJ1bGVzIHdpdGggZ2l2ZW4gbmFtZXMuIElmIGFueSBydWxlIG5hbWUgbm90IGZvdW5kIC0gdGhyb3cgRXJyb3IuXG4gKiBFcnJvcnMgY2FuIGJlIGRpc2FibGVkIGJ5IHNlY29uZCBwYXJhbS5cbiAqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgZm91bmQgcnVsZSBuYW1lcyAoaWYgbm8gZXhjZXB0aW9uIGhhcHBlbmVkKS5cbiAqXG4gKiBTZWUgYWxzbyBbW1J1bGVyLmVuYWJsZV1dLCBbW1J1bGVyLmVuYWJsZU9ubHldXS5cbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKGxpc3QsIGlnbm9yZUludmFsaWQpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7IGxpc3QgPSBbIGxpc3QgXTsgfVxuXG4gIHZhciByZXN1bHQgPSBbXTtcblxuICAvLyBTZWFyY2ggYnkgbmFtZSBhbmQgZGlzYWJsZVxuICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgaWR4ID0gdGhpcy5fX2ZpbmRfXyhuYW1lKTtcblxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBpZiAoaWdub3JlSW52YWxpZCkgeyByZXR1cm47IH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignUnVsZXMgbWFuYWdlcjogaW52YWxpZCBydWxlIG5hbWUgJyArIG5hbWUpO1xuICAgIH1cbiAgICB0aGlzLl9fcnVsZXNfX1tpZHhdLmVuYWJsZWQgPSBmYWxzZTtcbiAgICByZXN1bHQucHVzaChuYW1lKTtcbiAgfSwgdGhpcyk7XG5cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKipcbiAqIFJ1bGVyLmdldFJ1bGVzKGNoYWluTmFtZSkgLT4gQXJyYXlcbiAqXG4gKiBSZXR1cm4gYXJyYXkgb2YgYWN0aXZlIGZ1bmN0aW9ucyAocnVsZXMpIGZvciBnaXZlbiBjaGFpbiBuYW1lLiBJdCBhbmFseXplc1xuICogcnVsZXMgY29uZmlndXJhdGlvbiwgY29tcGlsZXMgY2FjaGVzIGlmIG5vdCBleGlzdHMgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIERlZmF1bHQgY2hhaW4gbmFtZSBpcyBgJydgIChlbXB0eSBzdHJpbmcpLiBJdCBjYW4ndCBiZSBza2lwcGVkLiBUaGF0J3NcbiAqIGRvbmUgaW50ZW50aW9uYWxseSwgdG8ga2VlcCBzaWduYXR1cmUgbW9ub21vcnBoaWMgZm9yIGhpZ2ggc3BlZWQuXG4gKiovXG5SdWxlci5wcm90b3R5cGUuZ2V0UnVsZXMgPSBmdW5jdGlvbiAoY2hhaW5OYW1lKSB7XG4gIGlmICh0aGlzLl9fY2FjaGVfXyA9PT0gbnVsbCkge1xuICAgIHRoaXMuX19jb21waWxlX18oKTtcbiAgfVxuXG4gIC8vIENoYWluIGNhbiBiZSBlbXB0eSwgaWYgcnVsZXMgZGlzYWJsZWQuIEJ1dCB3ZSBzdGlsbCBoYXZlIHRvIHJldHVybiBBcnJheS5cbiAgcmV0dXJuIHRoaXMuX19jYWNoZV9fW2NoYWluTmFtZV0gfHwgW107XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bGVyO1xuIiwiLy8gQmxvY2sgcXVvdGVzXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJsb2NrcXVvdGUoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBuZXh0TGluZSwgbGFzdExpbmVFbXB0eSwgb2xkVFNoaWZ0LCBvbGRCTWFya3MsIG9sZEluZGVudCwgb2xkUGFyZW50VHlwZSwgbGluZXMsXG4gICAgICB0ZXJtaW5hdG9yUnVsZXMsXG4gICAgICBpLCBsLCB0ZXJtaW5hdGUsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgLy8gY2hlY2sgdGhlIGJsb2NrIHF1b3RlIG1hcmtlclxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKyspICE9PSAweDNFLyogPiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyB3ZSBrbm93IHRoYXQgaXQncyBnb2luZyB0byBiZSBhIHZhbGlkIGJsb2NrcXVvdGUsXG4gIC8vIHNvIG5vIHBvaW50IHRyeWluZyB0byBmaW5kIHRoZSBlbmQgb2YgaXQgaW4gc2lsZW50IG1vZGVcbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIHNraXAgb25lIG9wdGlvbmFsIHNwYWNlIGFmdGVyICc+J1xuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgc3RhdGUuYmxrSW5kZW50ID0gMDtcblxuICBvbGRCTWFya3MgPSBbIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdIF07XG4gIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdID0gcG9zO1xuXG4gIC8vIGNoZWNrIGlmIHdlIGhhdmUgYW4gZW1wdHkgYmxvY2txdW90ZVxuICBwb3MgPSBwb3MgPCBtYXggPyBzdGF0ZS5za2lwU3BhY2VzKHBvcykgOiBwb3M7XG4gIGxhc3RMaW5lRW1wdHkgPSBwb3MgPj0gbWF4O1xuXG4gIG9sZFRTaGlmdCA9IFsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gXTtcbiAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBwb3MgLSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcblxuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5tZC5ibG9jay5ydWxlci5nZXRSdWxlcygnYmxvY2txdW90ZScpO1xuXG4gIC8vIFNlYXJjaCB0aGUgZW5kIG9mIHRoZSBibG9ja1xuICAvL1xuICAvLyBCbG9jayBlbmRzIHdpdGggZWl0aGVyOlxuICAvLyAgMS4gYW4gZW1wdHkgbGluZSBvdXRzaWRlOlxuICAvLyAgICAgYGBgXG4gIC8vICAgICA+IHRlc3RcbiAgLy9cbiAgLy8gICAgIGBgYFxuICAvLyAgMi4gYW4gZW1wdHkgbGluZSBpbnNpZGU6XG4gIC8vICAgICBgYGBcbiAgLy8gICAgID5cbiAgLy8gICAgIHRlc3RcbiAgLy8gICAgIGBgYFxuICAvLyAgMy4gYW5vdGhlciB0YWdcbiAgLy8gICAgIGBgYFxuICAvLyAgICAgPiB0ZXN0XG4gIC8vICAgICAgLSAtIC1cbiAgLy8gICAgIGBgYFxuICBmb3IgKG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTsgbmV4dExpbmUgPCBlbmRMaW5lOyBuZXh0TGluZSsrKSB7XG4gICAgcG9zID0gc3RhdGUuYk1hcmtzW25leHRMaW5lXSArIHN0YXRlLnRTaGlmdFtuZXh0TGluZV07XG4gICAgbWF4ID0gc3RhdGUuZU1hcmtzW25leHRMaW5lXTtcblxuICAgIGlmIChwb3MgPj0gbWF4KSB7XG4gICAgICAvLyBDYXNlIDE6IGxpbmUgaXMgbm90IGluc2lkZSB0aGUgYmxvY2txdW90ZSwgYW5kIHRoaXMgbGluZSBpcyBlbXB0eS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKykgPT09IDB4M0UvKiA+ICovKSB7XG4gICAgICAvLyBUaGlzIGxpbmUgaXMgaW5zaWRlIHRoZSBibG9ja3F1b3RlLlxuXG4gICAgICAvLyBza2lwIG9uZSBvcHRpb25hbCBzcGFjZSBhZnRlciAnPidcbiAgICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDIwKSB7IHBvcysrOyB9XG5cbiAgICAgIG9sZEJNYXJrcy5wdXNoKHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pO1xuICAgICAgc3RhdGUuYk1hcmtzW25leHRMaW5lXSA9IHBvcztcblxuICAgICAgcG9zID0gcG9zIDwgbWF4ID8gc3RhdGUuc2tpcFNwYWNlcyhwb3MpIDogcG9zO1xuICAgICAgbGFzdExpbmVFbXB0eSA9IHBvcyA+PSBtYXg7XG5cbiAgICAgIG9sZFRTaGlmdC5wdXNoKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0pO1xuICAgICAgc3RhdGUudFNoaWZ0W25leHRMaW5lXSA9IHBvcyAtIHN0YXRlLmJNYXJrc1tuZXh0TGluZV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBDYXNlIDI6IGxpbmUgaXMgbm90IGluc2lkZSB0aGUgYmxvY2txdW90ZSwgYW5kIHRoZSBsYXN0IGxpbmUgd2FzIGVtcHR5LlxuICAgIGlmIChsYXN0TGluZUVtcHR5KSB7IGJyZWFrOyB9XG5cbiAgICAvLyBDYXNlIDM6IGFub3RoZXIgdGFnIGZvdW5kLlxuICAgIHRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0ZXJtaW5hdG9yUnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgdGVybWluYXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXJtaW5hdGUpIHsgYnJlYWs7IH1cblxuICAgIG9sZEJNYXJrcy5wdXNoKHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pO1xuICAgIG9sZFRTaGlmdC5wdXNoKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0pO1xuXG4gICAgLy8gQSBuZWdhdGl2ZSBudW1iZXIgbWVhbnMgdGhhdCB0aGlzIGlzIGEgcGFyYWdyYXBoIGNvbnRpbnVhdGlvbjtcbiAgICAvL1xuICAgIC8vIEFueSBuZWdhdGl2ZSBudW1iZXIgd2lsbCBkbyB0aGUgam9iIGhlcmUsIGJ1dCBpdCdzIGJldHRlciBmb3IgaXRcbiAgICAvLyB0byBiZSBsYXJnZSBlbm91Z2ggdG8gbWFrZSBhbnkgYnVncyBvYnZpb3VzLlxuICAgIHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPSAtMTMzNztcbiAgfVxuXG4gIG9sZFBhcmVudFR5cGUgPSBzdGF0ZS5wYXJlbnRUeXBlO1xuICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2Jsb2NrcXVvdGUnO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2Jsb2NrcXVvdGVfb3BlbicsXG4gICAgbGluZXM6IGxpbmVzID0gWyBzdGFydExpbmUsIDAgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcbiAgc3RhdGUubWQuYmxvY2sudG9rZW5pemUoc3RhdGUsIHN0YXJ0TGluZSwgbmV4dExpbmUpO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2Jsb2NrcXVvdGVfY2xvc2UnLFxuICAgIGxldmVsOiAtLXN0YXRlLmxldmVsXG4gIH0pO1xuICBzdGF0ZS5wYXJlbnRUeXBlID0gb2xkUGFyZW50VHlwZTtcbiAgbGluZXNbMV0gPSBzdGF0ZS5saW5lO1xuXG4gIC8vIFJlc3RvcmUgb3JpZ2luYWwgdFNoaWZ0OyB0aGlzIG1pZ2h0IG5vdCBiZSBuZWNlc3Nhcnkgc2luY2UgdGhlIHBhcnNlclxuICAvLyBoYXMgYWxyZWFkeSBiZWVuIGhlcmUsIGJ1dCBqdXN0IHRvIG1ha2Ugc3VyZSB3ZSBjYW4gZG8gdGhhdC5cbiAgZm9yIChpID0gMDsgaSA8IG9sZFRTaGlmdC5sZW5ndGg7IGkrKykge1xuICAgIHN0YXRlLmJNYXJrc1tpICsgc3RhcnRMaW5lXSA9IG9sZEJNYXJrc1tpXTtcbiAgICBzdGF0ZS50U2hpZnRbaSArIHN0YXJ0TGluZV0gPSBvbGRUU2hpZnRbaV07XG4gIH1cbiAgc3RhdGUuYmxrSW5kZW50ID0gb2xkSW5kZW50O1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIENvZGUgYmxvY2sgKDQgc3BhY2VzIHBhZGRlZClcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29kZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLyosIHNpbGVudCovKSB7XG4gIHZhciBuZXh0TGluZSwgbGFzdDtcblxuICBpZiAoc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gLSBzdGF0ZS5ibGtJbmRlbnQgPCA0KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhc3QgPSBuZXh0TGluZSA9IHN0YXJ0TGluZSArIDE7XG5cbiAgd2hpbGUgKG5leHRMaW5lIDwgZW5kTGluZSkge1xuICAgIGlmIChzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgICAgbmV4dExpbmUrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSAtIHN0YXRlLmJsa0luZGVudCA+PSA0KSB7XG4gICAgICBuZXh0TGluZSsrO1xuICAgICAgbGFzdCA9IG5leHRMaW5lO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGJyZWFrO1xuICB9XG5cbiAgc3RhdGUubGluZSA9IG5leHRMaW5lO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2NvZGVfYmxvY2snLFxuICAgIGNvbnRlbnQ6IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbGFzdCwgNCArIHN0YXRlLmJsa0luZGVudCwgdHJ1ZSksXG4gICAgbGluZXM6IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF0sXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gIH0pO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGZlbmNlcyAoYGBgIGxhbmcsIH5+fiBsYW5nKVxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmZW5jZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIG1hcmtlciwgbGVuLCBwYXJhbXMsIG5leHRMaW5lLCBtZW0sXG4gICAgICBoYXZlRW5kTWFya2VyID0gZmFsc2UsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgaWYgKHBvcyArIDMgPiBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICBpZiAobWFya2VyICE9PSAweDdFLyogfiAqLyAmJiBtYXJrZXIgIT09IDB4NjAgLyogYCAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHNjYW4gbWFya2VyIGxlbmd0aFxuICBtZW0gPSBwb3M7XG4gIHBvcyA9IHN0YXRlLnNraXBDaGFycyhwb3MsIG1hcmtlcik7XG5cbiAgbGVuID0gcG9zIC0gbWVtO1xuXG4gIGlmIChsZW4gPCAzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBhcmFtcyA9IHN0YXRlLnNyYy5zbGljZShwb3MsIG1heCkudHJpbSgpO1xuXG4gIGlmIChwYXJhbXMuaW5kZXhPZignYCcpID49IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gU2luY2Ugc3RhcnQgaXMgZm91bmQsIHdlIGNhbiByZXBvcnQgc3VjY2VzcyBoZXJlIGluIHZhbGlkYXRpb24gbW9kZVxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gc2VhcmNoIGVuZCBvZiBibG9ja1xuICBuZXh0TGluZSA9IHN0YXJ0TGluZTtcblxuICBmb3IgKDs7KSB7XG4gICAgbmV4dExpbmUrKztcbiAgICBpZiAobmV4dExpbmUgPj0gZW5kTGluZSkge1xuICAgICAgLy8gdW5jbG9zZWQgYmxvY2sgc2hvdWxkIGJlIGF1dG9jbG9zZWQgYnkgZW5kIG9mIGRvY3VtZW50LlxuICAgICAgLy8gYWxzbyBibG9jayBzZWVtcyB0byBiZSBhdXRvY2xvc2VkIGJ5IGVuZCBvZiBwYXJlbnRcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHBvcyA9IG1lbSA9IHN0YXRlLmJNYXJrc1tuZXh0TGluZV0gKyBzdGF0ZS50U2hpZnRbbmV4dExpbmVdO1xuICAgIG1heCA9IHN0YXRlLmVNYXJrc1tuZXh0TGluZV07XG5cbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHtcbiAgICAgIC8vIG5vbi1lbXB0eSBsaW5lIHdpdGggbmVnYXRpdmUgaW5kZW50IHNob3VsZCBzdG9wIHRoZSBsaXN0OlxuICAgICAgLy8gLSBgYGBcbiAgICAgIC8vICB0ZXN0XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gbWFya2VyKSB7IGNvbnRpbnVlOyB9XG5cbiAgICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSAtIHN0YXRlLmJsa0luZGVudCA+PSA0KSB7XG4gICAgICAvLyBjbG9zaW5nIGZlbmNlIHNob3VsZCBiZSBpbmRlbnRlZCBsZXNzIHRoYW4gNCBzcGFjZXNcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBvcyA9IHN0YXRlLnNraXBDaGFycyhwb3MsIG1hcmtlcik7XG5cbiAgICAvLyBjbG9zaW5nIGNvZGUgZmVuY2UgbXVzdCBiZSBhdCBsZWFzdCBhcyBsb25nIGFzIHRoZSBvcGVuaW5nIG9uZVxuICAgIGlmIChwb3MgLSBtZW0gPCBsZW4pIHsgY29udGludWU7IH1cblxuICAgIC8vIG1ha2Ugc3VyZSB0YWlsIGhhcyBzcGFjZXMgb25seVxuICAgIHBvcyA9IHN0YXRlLnNraXBTcGFjZXMocG9zKTtcblxuICAgIGlmIChwb3MgPCBtYXgpIHsgY29udGludWU7IH1cblxuICAgIGhhdmVFbmRNYXJrZXIgPSB0cnVlO1xuICAgIC8vIGZvdW5kIVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gSWYgYSBmZW5jZSBoYXMgaGVhZGluZyBzcGFjZXMsIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSBpdHMgaW5uZXIgYmxvY2tcbiAgbGVuID0gc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG5cbiAgc3RhdGUubGluZSA9IG5leHRMaW5lICsgKGhhdmVFbmRNYXJrZXIgPyAxIDogMCk7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnZmVuY2UnLFxuICAgIHBhcmFtczogcGFyYW1zLFxuICAgIGNvbnRlbnQ6IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSArIDEsIG5leHRMaW5lLCBsZW4sIHRydWUpLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBoZWFkaW5nICgjLCAjIywgLi4uKVxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoZWFkaW5nKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgY2gsIGxldmVsLCB0bXAsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgY2ggID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICBpZiAoY2ggIT09IDB4MjMvKiAjICovIHx8IHBvcyA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gY291bnQgaGVhZGluZyBsZXZlbFxuICBsZXZlbCA9IDE7XG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoKytwb3MpO1xuICB3aGlsZSAoY2ggPT09IDB4MjMvKiAjICovICYmIHBvcyA8IG1heCAmJiBsZXZlbCA8PSA2KSB7XG4gICAgbGV2ZWwrKztcbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KCsrcG9zKTtcbiAgfVxuXG4gIGlmIChsZXZlbCA+IDYgfHwgKHBvcyA8IG1heCAmJiBjaCAhPT0gMHgyMC8qIHNwYWNlICovKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gTGV0J3MgY3V0IHRhaWxzIGxpa2UgJyAgICAjIyMgICcgZnJvbSB0aGUgZW5kIG9mIHN0cmluZ1xuXG4gIG1heCA9IHN0YXRlLnNraXBDaGFyc0JhY2sobWF4LCAweDIwLCBwb3MpOyAvLyBzcGFjZVxuICB0bXAgPSBzdGF0ZS5za2lwQ2hhcnNCYWNrKG1heCwgMHgyMywgcG9zKTsgLy8gI1xuICBpZiAodG1wID4gcG9zICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHRtcCAtIDEpID09PSAweDIwLyogc3BhY2UgKi8pIHtcbiAgICBtYXggPSB0bXA7XG4gIH1cblxuICBzdGF0ZS5saW5lID0gc3RhcnRMaW5lICsgMTtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICdoZWFkaW5nX29wZW4nLFxuICAgIGhMZXZlbDogbGV2ZWwsXG4gICAgbGluZXM6IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF0sXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gIH0pO1xuXG4gIC8vIG9ubHkgaWYgaGVhZGVyIGlzIG5vdCBlbXB0eVxuICBpZiAocG9zIDwgbWF4KSB7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXgpLnRyaW0oKSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCArIDEsXG4gICAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICAgIGNoaWxkcmVuOiBbXVxuICAgIH0pO1xuICB9XG4gIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ2hlYWRpbmdfY2xvc2UnLCBoTGV2ZWw6IGxldmVsLCBsZXZlbDogc3RhdGUubGV2ZWwgfSk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gSG9yaXpvbnRhbCBydWxlXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhyKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgbWFya2VyLCBjbnQsIGNoLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcblxuICAvLyBDaGVjayBociBtYXJrZXJcbiAgaWYgKG1hcmtlciAhPT0gMHgyQS8qICogKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHgyRC8qIC0gKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHg1Ri8qIF8gKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBtYXJrZXJzIGNhbiBiZSBtaXhlZCB3aXRoIHNwYWNlcywgYnV0IHRoZXJlIHNob3VsZCBiZSBhdCBsZWFzdCAzIG9uZVxuXG4gIGNudCA9IDE7XG4gIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcbiAgICBpZiAoY2ggIT09IG1hcmtlciAmJiBjaCAhPT0gMHgyMC8qIHNwYWNlICovKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmIChjaCA9PT0gbWFya2VyKSB7IGNudCsrOyB9XG4gIH1cblxuICBpZiAoY250IDwgMykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgc3RhdGUubGluZSA9IHN0YXJ0TGluZSArIDE7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaHInLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBIVE1MIGJsb2NrXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgYmxvY2tfbmFtZXMgPSByZXF1aXJlKCcuLi9jb21tb24vaHRtbF9ibG9ja3MnKTtcblxuXG52YXIgSFRNTF9UQUdfT1BFTl9SRSA9IC9ePChbYS16QS1aXXsxLDE1fSlbXFxzXFwvPl0vO1xudmFyIEhUTUxfVEFHX0NMT1NFX1JFID0gL148XFwvKFthLXpBLVpdezEsMTV9KVtcXHM+XS87XG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGNoKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIHZhciBsYyA9IGNoIHwgMHgyMDsgLy8gdG8gbG93ZXIgY2FzZVxuICByZXR1cm4gKGxjID49IDB4NjEvKiBhICovKSAmJiAobGMgPD0gMHg3YS8qIHogKi8pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh0bWxfYmxvY2soc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbWF0Y2gsIG5leHRMaW5lLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXSxcbiAgICAgIHNoaWZ0ID0gc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG5cbiAgcG9zICs9IHNoaWZ0O1xuXG4gIGlmICghc3RhdGUubWQub3B0aW9ucy5odG1sKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmIChzaGlmdCA+IDMgfHwgcG9zICsgMiA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4M0MvKiA8ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSk7XG5cbiAgaWYgKGNoID09PSAweDIxLyogISAqLyB8fCBjaCA9PT0gMHgzRi8qID8gKi8pIHtcbiAgICAvLyBEaXJlY3RpdmUgc3RhcnQgLyBjb21tZW50IHN0YXJ0IC8gcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBzdGFydFxuICAgIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICB9IGVsc2UgaWYgKGNoID09PSAweDJGLyogLyAqLyB8fCBpc0xldHRlcihjaCkpIHtcblxuICAgIC8vIFByb2JhYmx5IHN0YXJ0IG9yIGVuZCBvZiB0YWdcbiAgICBpZiAoY2ggPT09IDB4MkYvKiBcXCAqLykge1xuICAgICAgLy8gY2xvc2luZyB0YWdcbiAgICAgIG1hdGNoID0gc3RhdGUuc3JjLnNsaWNlKHBvcywgbWF4KS5tYXRjaChIVE1MX1RBR19DTE9TRV9SRSk7XG4gICAgICBpZiAoIW1hdGNoKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvcGVuaW5nIHRhZ1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXgpLm1hdGNoKEhUTUxfVEFHX09QRU5fUkUpO1xuICAgICAgaWYgKCFtYXRjaCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRhZyBuYW1lIGlzIHZhbGlkXG4gICAgaWYgKGJsb2NrX25hbWVzW21hdGNoWzFdLnRvTG93ZXJDYXNlKCldICE9PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIElmIHdlIGFyZSBoZXJlIC0gd2UgZGV0ZWN0ZWQgSFRNTCBibG9jay5cbiAgLy8gTGV0J3Mgcm9sbCBkb3duIHRpbGwgZW1wdHkgbGluZSAoYmxvY2sgZW5kKS5cbiAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxO1xuICB3aGlsZSAobmV4dExpbmUgPCBzdGF0ZS5saW5lTWF4ICYmICFzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgIG5leHRMaW5lKys7XG4gIH1cblxuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaHRtbF9ibG9jaycsXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgIGNvbnRlbnQ6IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbmV4dExpbmUsIDAsIHRydWUpXG4gIH0pO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGxoZWFkaW5nICgtLS0sID09PSlcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGhlYWRpbmcoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZS8qLCBzaWxlbnQqLykge1xuICB2YXIgbWFya2VyLCBwb3MsIG1heCxcbiAgICAgIG5leHQgPSBzdGFydExpbmUgKyAxO1xuXG4gIGlmIChuZXh0ID49IGVuZExpbmUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzdGF0ZS50U2hpZnRbbmV4dF0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gU2NhbiBuZXh0IGxpbmVcblxuICBpZiAoc3RhdGUudFNoaWZ0W25leHRdIC0gc3RhdGUuYmxrSW5kZW50ID4gMykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBzdGF0ZS5iTWFya3NbbmV4dF0gKyBzdGF0ZS50U2hpZnRbbmV4dF07XG4gIG1heCA9IHN0YXRlLmVNYXJrc1tuZXh0XTtcblxuICBpZiAocG9zID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuXG4gIGlmIChtYXJrZXIgIT09IDB4MkQvKiAtICovICYmIG1hcmtlciAhPT0gMHgzRC8qID0gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gc3RhdGUuc2tpcENoYXJzKHBvcywgbWFya2VyKTtcblxuICBwb3MgPSBzdGF0ZS5za2lwU3BhY2VzKHBvcyk7XG5cbiAgaWYgKHBvcyA8IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuXG4gIHN0YXRlLmxpbmUgPSBuZXh0ICsgMTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdoZWFkaW5nX29wZW4nLFxuICAgIGhMZXZlbDogbWFya2VyID09PSAweDNELyogPSAqLyA/IDEgOiAyLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdpbmxpbmUnLFxuICAgIGNvbnRlbnQ6IHN0YXRlLnNyYy5zbGljZShwb3MsIHN0YXRlLmVNYXJrc1tzdGFydExpbmVdKS50cmltKCksXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsICsgMSxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgLSAxIF0sXG4gICAgY2hpbGRyZW46IFtdXG4gIH0pO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2hlYWRpbmdfY2xvc2UnLFxuICAgIGhMZXZlbDogbWFya2VyID09PSAweDNELyogPSAqLyA/IDEgOiAyLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBMaXN0c1xuXG4ndXNlIHN0cmljdCc7XG5cblxuLy8gU2VhcmNoIGBbLSsqXVtcXG4gXWAsIHJldHVybnMgbmV4dCBwb3MgYXJ0ZXIgbWFya2VyIG9uIHN1Y2Nlc3Ncbi8vIG9yIC0xIG9uIGZhaWwuXG5mdW5jdGlvbiBza2lwQnVsbGV0TGlzdE1hcmtlcihzdGF0ZSwgc3RhcnRMaW5lKSB7XG4gIHZhciBtYXJrZXIsIHBvcywgbWF4O1xuXG4gIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG4gIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcbiAgLy8gQ2hlY2sgYnVsbGV0XG4gIGlmIChtYXJrZXIgIT09IDB4MkEvKiAqICovICYmXG4gICAgICBtYXJrZXIgIT09IDB4MkQvKiAtICovICYmXG4gICAgICBtYXJrZXIgIT09IDB4MkIvKiArICovKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDIwKSB7XG4gICAgLy8gXCIgMS50ZXN0IFwiIC0gaXMgbm90IGEgbGlzdCBpdGVtXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgcmV0dXJuIHBvcztcbn1cblxuLy8gU2VhcmNoIGBcXGQrWy4pXVtcXG4gXWAsIHJldHVybnMgbmV4dCBwb3MgYXJ0ZXIgbWFya2VyIG9uIHN1Y2Nlc3Ncbi8vIG9yIC0xIG9uIGZhaWwuXG5mdW5jdGlvbiBza2lwT3JkZXJlZExpc3RNYXJrZXIoc3RhdGUsIHN0YXJ0TGluZSkge1xuICB2YXIgY2gsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgLy8gTGlzdCBtYXJrZXIgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMiBjaGFycyAoZGlnaXQgKyBkb3QpXG4gIGlmIChwb3MgKyAxID49IG1heCkgeyByZXR1cm4gLTE7IH1cblxuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcblxuICBpZiAoY2ggPCAweDMwLyogMCAqLyB8fCBjaCA+IDB4MzkvKiA5ICovKSB7IHJldHVybiAtMTsgfVxuXG4gIGZvciAoOzspIHtcbiAgICAvLyBFT0wgLT4gZmFpbFxuICAgIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiAtMTsgfVxuXG4gICAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKyk7XG5cbiAgICBpZiAoY2ggPj0gMHgzMC8qIDAgKi8gJiYgY2ggPD0gMHgzOS8qIDkgKi8pIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZvdW5kIHZhbGlkIG1hcmtlclxuICAgIGlmIChjaCA9PT0gMHgyOS8qICkgKi8gfHwgY2ggPT09IDB4MmUvKiAuICovKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuXG4gIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyMC8qIHNwYWNlICovKSB7XG4gICAgLy8gXCIgMS50ZXN0IFwiIC0gaXMgbm90IGEgbGlzdCBpdGVtXG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiBwb3M7XG59XG5cbmZ1bmN0aW9uIG1hcmtUaWdodFBhcmFncmFwaHMoc3RhdGUsIGlkeCkge1xuICB2YXIgaSwgbCxcbiAgICAgIGxldmVsID0gc3RhdGUubGV2ZWwgKyAyO1xuXG4gIGZvciAoaSA9IGlkeCArIDIsIGwgPSBzdGF0ZS50b2tlbnMubGVuZ3RoIC0gMjsgaSA8IGw7IGkrKykge1xuICAgIGlmIChzdGF0ZS50b2tlbnNbaV0ubGV2ZWwgPT09IGxldmVsICYmIHN0YXRlLnRva2Vuc1tpXS50eXBlID09PSAncGFyYWdyYXBoX29wZW4nKSB7XG4gICAgICBzdGF0ZS50b2tlbnNbaSArIDJdLnRpZ2h0ID0gdHJ1ZTtcbiAgICAgIHN0YXRlLnRva2Vuc1tpXS50aWdodCA9IHRydWU7XG4gICAgICBpICs9IDI7XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsaXN0KHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgbmV4dExpbmUsXG4gICAgICBpbmRlbnQsXG4gICAgICBvbGRUU2hpZnQsXG4gICAgICBvbGRJbmRlbnQsXG4gICAgICBvbGRUaWdodCxcbiAgICAgIG9sZFBhcmVudFR5cGUsXG4gICAgICBzdGFydCxcbiAgICAgIHBvc0FmdGVyTWFya2VyLFxuICAgICAgbWF4LFxuICAgICAgaW5kZW50QWZ0ZXJNYXJrZXIsXG4gICAgICBtYXJrZXJWYWx1ZSxcbiAgICAgIG1hcmtlckNoYXJDb2RlLFxuICAgICAgaXNPcmRlcmVkLFxuICAgICAgY29udGVudFN0YXJ0LFxuICAgICAgbGlzdFRva0lkeCxcbiAgICAgIHByZXZFbXB0eUVuZCxcbiAgICAgIGxpc3RMaW5lcyxcbiAgICAgIGl0ZW1MaW5lcyxcbiAgICAgIHRpZ2h0ID0gdHJ1ZSxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcyxcbiAgICAgIGksIGwsIHRlcm1pbmF0ZTtcblxuICAvLyBEZXRlY3QgbGlzdCB0eXBlIGFuZCBwb3NpdGlvbiBhZnRlciBtYXJrZXJcbiAgaWYgKChwb3NBZnRlck1hcmtlciA9IHNraXBPcmRlcmVkTGlzdE1hcmtlcihzdGF0ZSwgc3RhcnRMaW5lKSkgPj0gMCkge1xuICAgIGlzT3JkZXJlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoKHBvc0FmdGVyTWFya2VyID0gc2tpcEJ1bGxldExpc3RNYXJrZXIoc3RhdGUsIHN0YXJ0TGluZSkpID49IDApIHtcbiAgICBpc09yZGVyZWQgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBXZSBzaG91bGQgdGVybWluYXRlIGxpc3Qgb24gc3R5bGUgY2hhbmdlLiBSZW1lbWJlciBmaXJzdCBvbmUgdG8gY29tcGFyZS5cbiAgbWFya2VyQ2hhckNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3NBZnRlck1hcmtlciAtIDEpO1xuXG4gIC8vIEZvciB2YWxpZGF0aW9uIG1vZGUgd2UgY2FuIHRlcm1pbmF0ZSBpbW1lZGlhdGVseVxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gU3RhcnQgbGlzdFxuICBsaXN0VG9rSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aDtcblxuICBpZiAoaXNPcmRlcmVkKSB7XG4gICAgc3RhcnQgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICAgIG1hcmtlclZhbHVlID0gTnVtYmVyKHN0YXRlLnNyYy5zdWJzdHIoc3RhcnQsIHBvc0FmdGVyTWFya2VyIC0gc3RhcnQgLSAxKSk7XG5cbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICB0eXBlOiAnb3JkZXJlZF9saXN0X29wZW4nLFxuICAgICAgb3JkZXI6IG1hcmtlclZhbHVlLFxuICAgICAgbGluZXM6IGxpc3RMaW5lcyA9IFsgc3RhcnRMaW5lLCAwIF0sXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2J1bGxldF9saXN0X29wZW4nLFxuICAgICAgbGluZXM6IGxpc3RMaW5lcyA9IFsgc3RhcnRMaW5lLCAwIF0sXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICAgIH0pO1xuICB9XG5cbiAgLy9cbiAgLy8gSXRlcmF0ZSBsaXN0IGl0ZW1zXG4gIC8vXG5cbiAgbmV4dExpbmUgPSBzdGFydExpbmU7XG4gIHByZXZFbXB0eUVuZCA9IGZhbHNlO1xuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5tZC5ibG9jay5ydWxlci5nZXRSdWxlcygnbGlzdCcpO1xuXG4gIHdoaWxlIChuZXh0TGluZSA8IGVuZExpbmUpIHtcbiAgICBjb250ZW50U3RhcnQgPSBzdGF0ZS5za2lwU3BhY2VzKHBvc0FmdGVyTWFya2VyKTtcbiAgICBtYXggPSBzdGF0ZS5lTWFya3NbbmV4dExpbmVdO1xuXG4gICAgaWYgKGNvbnRlbnRTdGFydCA+PSBtYXgpIHtcbiAgICAgIC8vIHRyaW1taW5nIHNwYWNlIGluIFwiLSAgICBcXG4gIDNcIiBjYXNlLCBpbmRlbnQgaXMgMSBoZXJlXG4gICAgICBpbmRlbnRBZnRlck1hcmtlciA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGVudEFmdGVyTWFya2VyID0gY29udGVudFN0YXJ0IC0gcG9zQWZ0ZXJNYXJrZXI7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBtb3JlIHRoYW4gNCBzcGFjZXMsIHRoZSBpbmRlbnQgaXMgMVxuICAgIC8vICh0aGUgcmVzdCBpcyBqdXN0IGluZGVudGVkIGNvZGUgYmxvY2spXG4gICAgaWYgKGluZGVudEFmdGVyTWFya2VyID4gNCkgeyBpbmRlbnRBZnRlck1hcmtlciA9IDE7IH1cblxuICAgIC8vIFwiICAtICB0ZXN0XCJcbiAgICAvLyAgXl5eXl4gLSBjYWxjdWxhdGluZyB0b3RhbCBsZW5ndGggb2YgdGhpcyB0aGluZ1xuICAgIGluZGVudCA9IChwb3NBZnRlck1hcmtlciAtIHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pICsgaW5kZW50QWZ0ZXJNYXJrZXI7XG5cbiAgICAvLyBSdW4gc3VicGFyc2VyICYgd3JpdGUgdG9rZW5zXG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2xpc3RfaXRlbV9vcGVuJyxcbiAgICAgIGxpbmVzOiBpdGVtTGluZXMgPSBbIHN0YXJ0TGluZSwgMCBdLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsKytcbiAgICB9KTtcblxuICAgIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgICBvbGRUaWdodCA9IHN0YXRlLnRpZ2h0O1xuICAgIG9sZFRTaGlmdCA9IHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICAgIG9sZFBhcmVudFR5cGUgPSBzdGF0ZS5wYXJlbnRUeXBlO1xuICAgIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdID0gY29udGVudFN0YXJ0IC0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV07XG4gICAgc3RhdGUuYmxrSW5kZW50ID0gaW5kZW50O1xuICAgIHN0YXRlLnRpZ2h0ID0gdHJ1ZTtcbiAgICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2xpc3QnO1xuXG4gICAgc3RhdGUubWQuYmxvY2sudG9rZW5pemUoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgdHJ1ZSk7XG5cbiAgICAvLyBJZiBhbnkgb2YgbGlzdCBpdGVtIGlzIHRpZ2h0LCBtYXJrIGxpc3QgYXMgdGlnaHRcbiAgICBpZiAoIXN0YXRlLnRpZ2h0IHx8IHByZXZFbXB0eUVuZCkge1xuICAgICAgdGlnaHQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gSXRlbSBiZWNvbWUgbG9vc2UgaWYgZmluaXNoIHdpdGggZW1wdHkgbGluZSxcbiAgICAvLyBidXQgd2Ugc2hvdWxkIGZpbHRlciBsYXN0IGVsZW1lbnQsIGJlY2F1c2UgaXQgbWVhbnMgbGlzdCBmaW5pc2hcbiAgICBwcmV2RW1wdHlFbmQgPSAoc3RhdGUubGluZSAtIHN0YXJ0TGluZSkgPiAxICYmIHN0YXRlLmlzRW1wdHkoc3RhdGUubGluZSAtIDEpO1xuXG4gICAgc3RhdGUuYmxrSW5kZW50ID0gb2xkSW5kZW50O1xuICAgIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdID0gb2xkVFNoaWZ0O1xuICAgIHN0YXRlLnRpZ2h0ID0gb2xkVGlnaHQ7XG4gICAgc3RhdGUucGFyZW50VHlwZSA9IG9sZFBhcmVudFR5cGU7XG5cbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICB0eXBlOiAnbGlzdF9pdGVtX2Nsb3NlJyxcbiAgICAgIGxldmVsOiAtLXN0YXRlLmxldmVsXG4gICAgfSk7XG5cbiAgICBuZXh0TGluZSA9IHN0YXJ0TGluZSA9IHN0YXRlLmxpbmU7XG4gICAgaXRlbUxpbmVzWzFdID0gbmV4dExpbmU7XG4gICAgY29udGVudFN0YXJ0ID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV07XG5cbiAgICBpZiAobmV4dExpbmUgPj0gZW5kTGluZSkgeyBicmVhazsgfVxuXG4gICAgaWYgKHN0YXRlLmlzRW1wdHkobmV4dExpbmUpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFRyeSB0byBjaGVjayBpZiBsaXN0IGlzIHRlcm1pbmF0ZWQgb3IgY29udGludWVkLlxuICAgIC8vXG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgYnJlYWs7IH1cblxuICAgIC8vIGZhaWwgaWYgdGVybWluYXRpbmcgYmxvY2sgZm91bmRcbiAgICB0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICBmb3IgKGkgPSAwLCBsID0gdGVybWluYXRvclJ1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRlcm1pbmF0b3JSdWxlc1tpXShzdGF0ZSwgbmV4dExpbmUsIGVuZExpbmUsIHRydWUpKSB7XG4gICAgICAgIHRlcm1pbmF0ZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVybWluYXRlKSB7IGJyZWFrOyB9XG5cbiAgICAvLyBmYWlsIGlmIGxpc3QgaGFzIGFub3RoZXIgdHlwZVxuICAgIGlmIChpc09yZGVyZWQpIHtcbiAgICAgIHBvc0FmdGVyTWFya2VyID0gc2tpcE9yZGVyZWRMaXN0TWFya2VyKHN0YXRlLCBuZXh0TGluZSk7XG4gICAgICBpZiAocG9zQWZ0ZXJNYXJrZXIgPCAwKSB7IGJyZWFrOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc0FmdGVyTWFya2VyID0gc2tpcEJ1bGxldExpc3RNYXJrZXIoc3RhdGUsIG5leHRMaW5lKTtcbiAgICAgIGlmIChwb3NBZnRlck1hcmtlciA8IDApIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAobWFya2VyQ2hhckNvZGUgIT09IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvc0FmdGVyTWFya2VyIC0gMSkpIHsgYnJlYWs7IH1cbiAgfVxuXG4gIC8vIEZpbmlsaXplIGxpc3RcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6IGlzT3JkZXJlZCA/ICdvcmRlcmVkX2xpc3RfY2xvc2UnIDogJ2J1bGxldF9saXN0X2Nsb3NlJyxcbiAgICBsZXZlbDogLS1zdGF0ZS5sZXZlbFxuICB9KTtcbiAgbGlzdExpbmVzWzFdID0gbmV4dExpbmU7XG5cbiAgc3RhdGUubGluZSA9IG5leHRMaW5lO1xuXG4gIC8vIG1hcmsgcGFyYWdyYXBocyB0aWdodCBpZiBuZWVkZWRcbiAgaWYgKHRpZ2h0KSB7XG4gICAgbWFya1RpZ2h0UGFyYWdyYXBocyhzdGF0ZSwgbGlzdFRva0lkeCk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQYXJhZ3JhcGhcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyYWdyYXBoKHN0YXRlLCBzdGFydExpbmUvKiwgZW5kTGluZSovKSB7XG4gIHZhciBlbmRMaW5lLCBjb250ZW50LCB0ZXJtaW5hdGUsIGksIGwsXG4gICAgICBuZXh0TGluZSA9IHN0YXJ0TGluZSArIDEsXG4gICAgICB0ZXJtaW5hdG9yUnVsZXM7XG5cbiAgZW5kTGluZSA9IHN0YXRlLmxpbmVNYXg7XG5cbiAgLy8ganVtcCBsaW5lLWJ5LWxpbmUgdW50aWwgZW1wdHkgb25lIG9yIEVPRlxuICBpZiAobmV4dExpbmUgPCBlbmRMaW5lICYmICFzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgIHRlcm1pbmF0b3JSdWxlcyA9IHN0YXRlLm1kLmJsb2NrLnJ1bGVyLmdldFJ1bGVzKCdwYXJhZ3JhcGgnKTtcblxuICAgIGZvciAoOyBuZXh0TGluZSA8IGVuZExpbmUgJiYgIXN0YXRlLmlzRW1wdHkobmV4dExpbmUpOyBuZXh0TGluZSsrKSB7XG4gICAgICAvLyB0aGlzIHdvdWxkIGJlIGEgY29kZSBibG9jayBub3JtYWxseSwgYnV0IGFmdGVyIHBhcmFncmFwaFxuICAgICAgLy8gaXQncyBjb25zaWRlcmVkIGEgbGF6eSBjb250aW51YXRpb24gcmVnYXJkbGVzcyBvZiB3aGF0J3MgdGhlcmVcbiAgICAgIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIC0gc3RhdGUuYmxrSW5kZW50ID4gMykgeyBjb250aW51ZTsgfVxuXG4gICAgICAvLyBTb21lIHRhZ3MgY2FuIHRlcm1pbmF0ZSBwYXJhZ3JhcGggd2l0aG91dCBlbXB0eSBsaW5lLlxuICAgICAgdGVybWluYXRlID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdGVybWluYXRvclJ1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgICB0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGVybWluYXRlKSB7IGJyZWFrOyB9XG4gICAgfVxuICB9XG5cbiAgY29udGVudCA9IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbmV4dExpbmUsIHN0YXRlLmJsa0luZGVudCwgZmFsc2UpLnRyaW0oKTtcblxuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAncGFyYWdyYXBoX29wZW4nLFxuICAgIHRpZ2h0OiBmYWxzZSxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaW5saW5lJyxcbiAgICBjb250ZW50OiBjb250ZW50LFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCArIDEsXG4gICAgbGluZXM6IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF0sXG4gICAgY2hpbGRyZW46IFtdXG4gIH0pO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3BhcmFncmFwaF9jbG9zZScsXG4gICAgdGlnaHQ6IGZhbHNlLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIHBhcnNlTGlua0Rlc3RpbmF0aW9uID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uJyk7XG52YXIgcGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfdGl0bGUnKTtcbnZhciBub3JtYWxpemVSZWZlcmVuY2UgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLm5vcm1hbGl6ZVJlZmVyZW5jZTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlZmVyZW5jZShzdGF0ZSwgc3RhcnRMaW5lLCBfZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCxcbiAgICAgIGRlc3RFbmRQb3MsXG4gICAgICBkZXN0RW5kTGluZU5vLFxuICAgICAgZW5kTGluZSxcbiAgICAgIGhyZWYsXG4gICAgICBpLFxuICAgICAgbCxcbiAgICAgIGxhYmVsLFxuICAgICAgbGFiZWxFbmQsXG4gICAgICByZXMsXG4gICAgICBzdGFydCxcbiAgICAgIHN0cixcbiAgICAgIHRlcm1pbmF0ZSxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcyxcbiAgICAgIHRpdGxlLFxuICAgICAgbGluZXMgPSAwLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdLFxuICAgICAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDVCLyogWyAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBTaW1wbGUgY2hlY2sgdG8gcXVpY2tseSBpbnRlcnJ1cHQgc2NhbiBvbiBbbGlua10odXJsKSBhdCB0aGUgc3RhcnQgb2YgbGluZS5cbiAgLy8gQ2FuIGJlIHVzZWZ1bCBvbiBwcmFjdGljZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2lzc3Vlcy81NFxuICB3aGlsZSAoKytwb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHg1RCAvKiBdICovICYmXG4gICAgICAgIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyAtIDEpICE9PSAweDVDLyogXFwgKi8pIHtcbiAgICAgIGlmIChwb3MgKyAxID09PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSkgIT09IDB4M0EvKiA6ICovKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZW5kTGluZSA9IHN0YXRlLmxpbmVNYXg7XG5cbiAgLy8ganVtcCBsaW5lLWJ5LWxpbmUgdW50aWwgZW1wdHkgb25lIG9yIEVPRlxuICBpZiAobmV4dExpbmUgPCBlbmRMaW5lICYmICFzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgIHRlcm1pbmF0b3JSdWxlcyA9IHN0YXRlLm1kLmJsb2NrLnJ1bGVyLmdldFJ1bGVzKCdyZWZlcmVuY2UnKTtcblxuICAgIGZvciAoOyBuZXh0TGluZSA8IGVuZExpbmUgJiYgIXN0YXRlLmlzRW1wdHkobmV4dExpbmUpOyBuZXh0TGluZSsrKSB7XG4gICAgICAvLyB0aGlzIHdvdWxkIGJlIGEgY29kZSBibG9jayBub3JtYWxseSwgYnV0IGFmdGVyIHBhcmFncmFwaFxuICAgICAgLy8gaXQncyBjb25zaWRlcmVkIGEgbGF6eSBjb250aW51YXRpb24gcmVnYXJkbGVzcyBvZiB3aGF0J3MgdGhlcmVcbiAgICAgIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIC0gc3RhdGUuYmxrSW5kZW50ID4gMykgeyBjb250aW51ZTsgfVxuXG4gICAgICAvLyBTb21lIHRhZ3MgY2FuIHRlcm1pbmF0ZSBwYXJhZ3JhcGggd2l0aG91dCBlbXB0eSBsaW5lLlxuICAgICAgdGVybWluYXRlID0gZmFsc2U7XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdGVybWluYXRvclJ1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgICB0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGVybWluYXRlKSB7IGJyZWFrOyB9XG4gICAgfVxuICB9XG5cbiAgc3RyID0gc3RhdGUuZ2V0TGluZXMoc3RhcnRMaW5lLCBuZXh0TGluZSwgc3RhdGUuYmxrSW5kZW50LCBmYWxzZSkudHJpbSgpO1xuICBtYXggPSBzdHIubGVuZ3RoO1xuXG4gIGZvciAocG9zID0gMTsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGNoID0gc3RyLmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoY2ggPT09IDB4NUIgLyogWyAqLykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4NUQgLyogXSAqLykge1xuICAgICAgbGFiZWxFbmQgPSBwb3M7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDBBIC8qIFxcbiAqLykge1xuICAgICAgbGluZXMrKztcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDVDIC8qIFxcICovKSB7XG4gICAgICBwb3MrKztcbiAgICAgIGlmIChwb3MgPCBtYXggJiYgc3RyLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgwQSkge1xuICAgICAgICBsaW5lcysrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChsYWJlbEVuZCA8IDAgfHwgc3RyLmNoYXJDb2RlQXQobGFiZWxFbmQgKyAxKSAhPT0gMHgzQS8qIDogKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gW2xhYmVsXTogICBkZXN0aW5hdGlvbiAgICd0aXRsZSdcbiAgLy8gICAgICAgICBeXl4gc2tpcCBvcHRpb25hbCB3aGl0ZXNwYWNlIGhlcmVcbiAgZm9yIChwb3MgPSBsYWJlbEVuZCArIDI7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBjaCA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG4gICAgaWYgKGNoID09PSAweDBBKSB7XG4gICAgICBsaW5lcysrO1xuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4MjApIHtcbiAgICAgIC8qZXNsaW50IG5vLWVtcHR5OjAqL1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBbbGFiZWxdOiAgIGRlc3RpbmF0aW9uICAgJ3RpdGxlJ1xuICAvLyAgICAgICAgICAgIF5eXl5eXl5eXl5eIHBhcnNlIHRoaXNcbiAgcmVzID0gcGFyc2VMaW5rRGVzdGluYXRpb24oc3RyLCBwb3MsIG1heCk7XG4gIGlmICghcmVzLm9rKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoIXN0YXRlLm1kLmlubGluZS52YWxpZGF0ZUxpbmsocmVzLnN0cikpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGhyZWYgPSByZXMuc3RyO1xuICBwb3MgPSByZXMucG9zO1xuICBsaW5lcyArPSByZXMubGluZXM7XG5cbiAgLy8gc2F2ZSBjdXJzb3Igc3RhdGUsIHdlIGNvdWxkIHJlcXVpcmUgdG8gcm9sbGJhY2sgbGF0ZXJcbiAgZGVzdEVuZFBvcyA9IHBvcztcbiAgZGVzdEVuZExpbmVObyA9IGxpbmVzO1xuXG4gIC8vIFtsYWJlbF06ICAgZGVzdGluYXRpb24gICAndGl0bGUnXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICBeXl4gc2tpcHBpbmcgdGhvc2Ugc3BhY2VzXG4gIHN0YXJ0ID0gcG9zO1xuICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGNoID0gc3RyLmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoY2ggPT09IDB4MEEpIHtcbiAgICAgIGxpbmVzKys7XG4gICAgfSBlbHNlIGlmIChjaCA9PT0gMHgyMCkge1xuICAgICAgLyplc2xpbnQgbm8tZW1wdHk6MCovXG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIFtsYWJlbF06ICAgZGVzdGluYXRpb24gICAndGl0bGUnXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICBeXl5eXl5eIHBhcnNlIHRoaXNcbiAgcmVzID0gcGFyc2VMaW5rVGl0bGUoc3RyLCBwb3MsIG1heCk7XG4gIGlmIChwb3MgPCBtYXggJiYgc3RhcnQgIT09IHBvcyAmJiByZXMub2spIHtcbiAgICB0aXRsZSA9IHJlcy5zdHI7XG4gICAgcG9zID0gcmVzLnBvcztcbiAgICBsaW5lcyArPSByZXMubGluZXM7XG4gIH0gZWxzZSB7XG4gICAgdGl0bGUgPSAnJztcbiAgICBwb3MgPSBkZXN0RW5kUG9zO1xuICAgIGxpbmVzID0gZGVzdEVuZExpbmVObztcbiAgfVxuXG4gIC8vIHNraXAgdHJhaWxpbmcgc3BhY2VzIHVudGlsIHRoZSByZXN0IG9mIHRoZSBsaW5lXG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RyLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMC8qIHNwYWNlICovKSB7IHBvcysrOyB9XG5cbiAgaWYgKHBvcyA8IG1heCAmJiBzdHIuY2hhckNvZGVBdChwb3MpICE9PSAweDBBKSB7XG4gICAgLy8gZ2FyYmFnZSBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIGxhYmVsID0gbm9ybWFsaXplUmVmZXJlbmNlKHN0ci5zbGljZSgxLCBsYWJlbEVuZCkpO1xuICBpZiAodHlwZW9mIHN0YXRlLmVudi5yZWZlcmVuY2VzID09PSAndW5kZWZpbmVkJykge1xuICAgIHN0YXRlLmVudi5yZWZlcmVuY2VzID0ge307XG4gIH1cbiAgaWYgKHR5cGVvZiBzdGF0ZS5lbnYucmVmZXJlbmNlc1tsYWJlbF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3RhdGUuZW52LnJlZmVyZW5jZXNbbGFiZWxdID0geyB0aXRsZTogdGl0bGUsIGhyZWY6IGhyZWYgfTtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgPSBzdGFydExpbmUgKyBsaW5lcyArIDE7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFBhcnNlciBzdGF0ZSBjbGFzc1xuXG4ndXNlIHN0cmljdCc7XG5cblxuZnVuY3Rpb24gU3RhdGVCbG9jayhzcmMsIG1kLCBlbnYsIHRva2Vucykge1xuICB2YXIgY2gsIHMsIHN0YXJ0LCBwb3MsIGxlbiwgaW5kZW50LCBpbmRlbnRfZm91bmQ7XG5cbiAgdGhpcy5zcmMgPSBzcmM7XG5cbiAgLy8gbGluayB0byBwYXJzZXIgaW5zdGFuY2VcbiAgdGhpcy5tZCAgICAgPSBtZDtcblxuICB0aGlzLmVudiA9IGVudjtcblxuICAvL1xuICAvLyBJbnRlcm5hbCBzdGF0ZSB2YXJ0aWFibGVzXG4gIC8vXG5cbiAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgdGhpcy5iTWFya3MgPSBbXTsgIC8vIGxpbmUgYmVnaW4gb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLmVNYXJrcyA9IFtdOyAgLy8gbGluZSBlbmQgb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLnRTaGlmdCA9IFtdOyAgLy8gaW5kZW50IGZvciBlYWNoIGxpbmVcblxuICAvLyBibG9jayBwYXJzZXIgdmFyaWFibGVzXG4gIHRoaXMuYmxrSW5kZW50ICA9IDA7IC8vIHJlcXVpcmVkIGJsb2NrIGNvbnRlbnQgaW5kZW50XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIChmb3IgZXhhbXBsZSwgaWYgd2UgYXJlIGluIGxpc3QpXG4gIHRoaXMubGluZSAgICAgICA9IDA7IC8vIGxpbmUgaW5kZXggaW4gc3JjXG4gIHRoaXMubGluZU1heCAgICA9IDA7IC8vIGxpbmVzIGNvdW50XG4gIHRoaXMudGlnaHQgICAgICA9IGZhbHNlOyAgLy8gbG9vc2UvdGlnaHQgbW9kZSBmb3IgbGlzdHNcbiAgdGhpcy5wYXJlbnRUeXBlID0gJ3Jvb3QnOyAvLyBpZiBgbGlzdGAsIGJsb2NrIHBhcnNlciBzdG9wcyBvbiB0d28gbmV3bGluZXNcbiAgdGhpcy5kZEluZGVudCAgID0gLTE7IC8vIGluZGVudCBvZiB0aGUgY3VycmVudCBkZCBibG9jayAoLTEgaWYgdGhlcmUgaXNuJ3QgYW55KVxuXG4gIHRoaXMubGV2ZWwgPSAwO1xuXG4gIC8vIHJlbmRlcmVyXG4gIHRoaXMucmVzdWx0ID0gJyc7XG5cbiAgLy8gQ3JlYXRlIGNhY2hlc1xuICAvLyBHZW5lcmF0ZSBtYXJrZXJzLlxuICBzID0gdGhpcy5zcmM7XG4gIGluZGVudCA9IDA7XG4gIGluZGVudF9mb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoc3RhcnQgPSBwb3MgPSBpbmRlbnQgPSAwLCBsZW4gPSBzLmxlbmd0aDsgcG9zIDwgbGVuOyBwb3MrKykge1xuICAgIGNoID0gcy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoIWluZGVudF9mb3VuZCkge1xuICAgICAgaWYgKGNoID09PSAweDIwLyogc3BhY2UgKi8pIHtcbiAgICAgICAgaW5kZW50Kys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZW50X2ZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2ggPT09IDB4MEEgfHwgcG9zID09PSBsZW4gLSAxKSB7XG4gICAgICBpZiAoY2ggIT09IDB4MEEpIHsgcG9zKys7IH1cbiAgICAgIHRoaXMuYk1hcmtzLnB1c2goc3RhcnQpO1xuICAgICAgdGhpcy5lTWFya3MucHVzaChwb3MpO1xuICAgICAgdGhpcy50U2hpZnQucHVzaChpbmRlbnQpO1xuXG4gICAgICBpbmRlbnRfZm91bmQgPSBmYWxzZTtcbiAgICAgIGluZGVudCA9IDA7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgLy8gUHVzaCBmYWtlIGVudHJ5IHRvIHNpbXBsaWZ5IGNhY2hlIGJvdW5kcyBjaGVja3NcbiAgdGhpcy5iTWFya3MucHVzaChzLmxlbmd0aCk7XG4gIHRoaXMuZU1hcmtzLnB1c2gocy5sZW5ndGgpO1xuICB0aGlzLnRTaGlmdC5wdXNoKDApO1xuXG4gIHRoaXMubGluZU1heCA9IHRoaXMuYk1hcmtzLmxlbmd0aCAtIDE7IC8vIGRvbid0IGNvdW50IGxhc3QgZmFrZSBsaW5lXG59XG5cblN0YXRlQmxvY2sucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5KGxpbmUpIHtcbiAgcmV0dXJuIHRoaXMuYk1hcmtzW2xpbmVdICsgdGhpcy50U2hpZnRbbGluZV0gPj0gdGhpcy5lTWFya3NbbGluZV07XG59O1xuXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5za2lwRW1wdHlMaW5lcyA9IGZ1bmN0aW9uIHNraXBFbXB0eUxpbmVzKGZyb20pIHtcbiAgZm9yICh2YXIgbWF4ID0gdGhpcy5saW5lTWF4OyBmcm9tIDwgbWF4OyBmcm9tKyspIHtcbiAgICBpZiAodGhpcy5iTWFya3NbZnJvbV0gKyB0aGlzLnRTaGlmdFtmcm9tXSA8IHRoaXMuZU1hcmtzW2Zyb21dKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZyb207XG59O1xuXG4vLyBTa2lwIHNwYWNlcyBmcm9tIGdpdmVuIHBvc2l0aW9uLlxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcFNwYWNlcyA9IGZ1bmN0aW9uIHNraXBTcGFjZXMocG9zKSB7XG4gIGZvciAodmFyIG1heCA9IHRoaXMuc3JjLmxlbmd0aDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGlmICh0aGlzLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MjAvKiBzcGFjZSAqLykgeyBicmVhazsgfVxuICB9XG4gIHJldHVybiBwb3M7XG59O1xuXG4vLyBTa2lwIGNoYXIgY29kZXMgZnJvbSBnaXZlbiBwb3NpdGlvblxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcENoYXJzID0gZnVuY3Rpb24gc2tpcENoYXJzKHBvcywgY29kZSkge1xuICBmb3IgKHZhciBtYXggPSB0aGlzLnNyYy5sZW5ndGg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBpZiAodGhpcy5zcmMuY2hhckNvZGVBdChwb3MpICE9PSBjb2RlKSB7IGJyZWFrOyB9XG4gIH1cbiAgcmV0dXJuIHBvcztcbn07XG5cbi8vIFNraXAgY2hhciBjb2RlcyByZXZlcnNlIGZyb20gZ2l2ZW4gcG9zaXRpb24gLSAxXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5za2lwQ2hhcnNCYWNrID0gZnVuY3Rpb24gc2tpcENoYXJzQmFjayhwb3MsIGNvZGUsIG1pbikge1xuICBpZiAocG9zIDw9IG1pbikgeyByZXR1cm4gcG9zOyB9XG5cbiAgd2hpbGUgKHBvcyA+IG1pbikge1xuICAgIGlmIChjb2RlICE9PSB0aGlzLnNyYy5jaGFyQ29kZUF0KC0tcG9zKSkgeyByZXR1cm4gcG9zICsgMTsgfVxuICB9XG4gIHJldHVybiBwb3M7XG59O1xuXG4vLyBjdXQgbGluZXMgcmFuZ2UgZnJvbSBzb3VyY2UuXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5nZXRMaW5lcyA9IGZ1bmN0aW9uIGdldExpbmVzKGJlZ2luLCBlbmQsIGluZGVudCwga2VlcExhc3RMRikge1xuICB2YXIgaSwgZmlyc3QsIGxhc3QsIHF1ZXVlLCBzaGlmdCxcbiAgICAgIGxpbmUgPSBiZWdpbjtcblxuICBpZiAoYmVnaW4gPj0gZW5kKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLy8gT3B0OiBkb24ndCB1c2UgcHVzaCBxdWV1ZSBmb3Igc2luZ2xlIGxpbmU7XG4gIGlmIChsaW5lICsgMSA9PT0gZW5kKSB7XG4gICAgZmlyc3QgPSB0aGlzLmJNYXJrc1tsaW5lXSArIE1hdGgubWluKHRoaXMudFNoaWZ0W2xpbmVdLCBpbmRlbnQpO1xuICAgIGxhc3QgPSBrZWVwTGFzdExGID8gdGhpcy5iTWFya3NbZW5kXSA6IHRoaXMuZU1hcmtzW2VuZCAtIDFdO1xuICAgIHJldHVybiB0aGlzLnNyYy5zbGljZShmaXJzdCwgbGFzdCk7XG4gIH1cblxuICBxdWV1ZSA9IG5ldyBBcnJheShlbmQgLSBiZWdpbik7XG5cbiAgZm9yIChpID0gMDsgbGluZSA8IGVuZDsgbGluZSsrLCBpKyspIHtcbiAgICBzaGlmdCA9IHRoaXMudFNoaWZ0W2xpbmVdO1xuICAgIGlmIChzaGlmdCA+IGluZGVudCkgeyBzaGlmdCA9IGluZGVudDsgfVxuICAgIGlmIChzaGlmdCA8IDApIHsgc2hpZnQgPSAwOyB9XG5cbiAgICBmaXJzdCA9IHRoaXMuYk1hcmtzW2xpbmVdICsgc2hpZnQ7XG5cbiAgICBpZiAobGluZSArIDEgPCBlbmQgfHwga2VlcExhc3RMRikge1xuICAgICAgLy8gTm8gbmVlZCBmb3IgYm91bmRzIGNoZWNrIGJlY2F1c2Ugd2UgaGF2ZSBmYWtlIGVudHJ5IG9uIHRhaWwuXG4gICAgICBsYXN0ID0gdGhpcy5lTWFya3NbbGluZV0gKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0ID0gdGhpcy5lTWFya3NbbGluZV07XG4gICAgfVxuXG4gICAgcXVldWVbaV0gPSB0aGlzLnNyYy5zbGljZShmaXJzdCwgbGFzdCk7XG4gIH1cblxuICByZXR1cm4gcXVldWUuam9pbignJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVCbG9jaztcbiIsIi8vIEdGTSB0YWJsZSwgbm9uLXN0YW5kYXJkXG5cbid1c2Ugc3RyaWN0JztcblxuXG5mdW5jdGlvbiBnZXRMaW5lKHN0YXRlLCBsaW5lKSB7XG4gIHZhciBwb3MgPSBzdGF0ZS5iTWFya3NbbGluZV0gKyBzdGF0ZS5ibGtJbmRlbnQsXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3NbbGluZV07XG5cbiAgcmV0dXJuIHN0YXRlLnNyYy5zdWJzdHIocG9zLCBtYXggLSBwb3MpO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVkU3BsaXQoc3RyKSB7XG4gIHZhciByZXN1bHQgPSBbXSxcbiAgICAgIHBvcyA9IDAsXG4gICAgICBtYXggPSBzdHIubGVuZ3RoLFxuICAgICAgY2gsXG4gICAgICBlc2NhcGVzID0gMCxcbiAgICAgIGxhc3RQb3MgPSAwO1xuXG4gIGNoICA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgd2hpbGUgKHBvcyA8IG1heCkge1xuICAgIGlmIChjaCA9PT0gMHg3Yy8qIHwgKi8gJiYgKGVzY2FwZXMgJSAyID09PSAwKSkge1xuICAgICAgcmVzdWx0LnB1c2goc3RyLnN1YnN0cmluZyhsYXN0UG9zLCBwb3MpKTtcbiAgICAgIGxhc3RQb3MgPSBwb3MgKyAxO1xuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4NWMvKiBcXCAqLykge1xuICAgICAgZXNjYXBlcysrO1xuICAgIH0gZWxzZSB7XG4gICAgICBlc2NhcGVzID0gMDtcbiAgICB9XG5cbiAgICBjaCAgPSBzdHIuY2hhckNvZGVBdCgrK3Bvcyk7XG4gIH1cblxuICByZXN1bHQucHVzaChzdHIuc3Vic3RyaW5nKGxhc3RQb3MpKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGFibGUoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbGluZVRleHQsIHBvcywgaSwgbmV4dExpbmUsIHJvd3MsXG4gICAgICBhbGlnbnMsIHQsIHRhYmxlTGluZXMsIHRib2R5TGluZXM7XG5cbiAgLy8gc2hvdWxkIGhhdmUgYXQgbGVhc3QgdGhyZWUgbGluZXNcbiAgaWYgKHN0YXJ0TGluZSArIDIgPiBlbmRMaW5lKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTtcblxuICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSA8IHN0YXRlLmJsa0luZGVudCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHNlY29uZCBsaW5lIHNob3VsZCBiZSAnfCcgb3IgJy0nXG5cbiAgcG9zID0gc3RhdGUuYk1hcmtzW25leHRMaW5lXSArIHN0YXRlLnRTaGlmdFtuZXh0TGluZV07XG4gIGlmIChwb3MgPj0gc3RhdGUuZU1hcmtzW25leHRMaW5lXSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gIGlmIChjaCAhPT0gMHg3Qy8qIHwgKi8gJiYgY2ggIT09IDB4MkQvKiAtICovICYmIGNoICE9PSAweDNBLyogOiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsaW5lVGV4dCA9IGdldExpbmUoc3RhdGUsIHN0YXJ0TGluZSArIDEpO1xuICBpZiAoIS9eWy06fCBdKyQvLnRlc3QobGluZVRleHQpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJvd3MgPSBsaW5lVGV4dC5zcGxpdCgnfCcpO1xuICBpZiAocm93cy5sZW5ndGggPCAyKSB7IHJldHVybiBmYWxzZTsgfVxuICBhbGlnbnMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICB0ID0gcm93c1tpXS50cmltKCk7XG4gICAgaWYgKCF0KSB7XG4gICAgICAvLyBhbGxvdyBlbXB0eSBjb2x1bW5zIGJlZm9yZSBhbmQgYWZ0ZXIgdGFibGUsIGJ1dCBub3QgaW4gYmV0d2VlbiBjb2x1bW5zO1xuICAgICAgLy8gZS5nLiBhbGxvdyBgIHwtLS18IGAsIGRpc2FsbG93IGAgLS0tfHwtLS0gYFxuICAgICAgaWYgKGkgPT09IDAgfHwgaSA9PT0gcm93cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghL146Py0rOj8kLy50ZXN0KHQpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICh0LmNoYXJDb2RlQXQodC5sZW5ndGggLSAxKSA9PT0gMHgzQS8qIDogKi8pIHtcbiAgICAgIGFsaWducy5wdXNoKHQuY2hhckNvZGVBdCgwKSA9PT0gMHgzQS8qIDogKi8gPyAnY2VudGVyJyA6ICdyaWdodCcpO1xuICAgIH0gZWxzZSBpZiAodC5jaGFyQ29kZUF0KDApID09PSAweDNBLyogOiAqLykge1xuICAgICAgYWxpZ25zLnB1c2goJ2xlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxpZ25zLnB1c2goJycpO1xuICAgIH1cbiAgfVxuXG4gIGxpbmVUZXh0ID0gZ2V0TGluZShzdGF0ZSwgc3RhcnRMaW5lKS50cmltKCk7XG4gIGlmIChsaW5lVGV4dC5pbmRleE9mKCd8JykgPT09IC0xKSB7IHJldHVybiBmYWxzZTsgfVxuICByb3dzID0gZXNjYXBlZFNwbGl0KGxpbmVUZXh0LnJlcGxhY2UoL15cXHx8XFx8JC9nLCAnJykpO1xuICBpZiAoYWxpZ25zLmxlbmd0aCAhPT0gcm93cy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3RhYmxlX29wZW4nLFxuICAgIGxpbmVzOiB0YWJsZUxpbmVzID0gWyBzdGFydExpbmUsIDAgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICd0aGVhZF9vcGVuJyxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3RyX29wZW4nLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhcnRMaW5lICsgMSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gIH0pO1xuICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICAgIHR5cGU6ICd0aF9vcGVuJyxcbiAgICAgIGFsaWduOiBhbGlnbnNbaV0sXG4gICAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiByb3dzW2ldLnRyaW0oKSxcbiAgICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhcnRMaW5lICsgMSBdLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGhfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgfVxuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0cl9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0aGVhZF9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuXG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAndGJvZHlfb3BlbicsXG4gICAgbGluZXM6IHRib2R5TGluZXMgPSBbIHN0YXJ0TGluZSArIDIsIDAgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcblxuICBmb3IgKG5leHRMaW5lID0gc3RhcnRMaW5lICsgMjsgbmV4dExpbmUgPCBlbmRMaW5lOyBuZXh0TGluZSsrKSB7XG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgYnJlYWs7IH1cblxuICAgIGxpbmVUZXh0ID0gZ2V0TGluZShzdGF0ZSwgbmV4dExpbmUpLnRyaW0oKTtcbiAgICBpZiAobGluZVRleHQuaW5kZXhPZignfCcpID09PSAtMSkgeyBicmVhazsgfVxuICAgIHJvd3MgPSBlc2NhcGVkU3BsaXQobGluZVRleHQucmVwbGFjZSgvXlxcfHxcXHwkL2csICcnKSk7XG5cbiAgICAvLyBzZXQgbnVtYmVyIG9mIGNvbHVtbnMgdG8gbnVtYmVyIG9mIGNvbHVtbnMgaW4gaGVhZGVyIHJvd1xuICAgIHJvd3MubGVuZ3RoID0gYWxpZ25zLmxlbmd0aDtcblxuICAgIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ3RyX29wZW4nLCBsZXZlbDogc3RhdGUubGV2ZWwrKyB9KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGRfb3BlbicsIGFsaWduOiBhbGlnbnNbaV0sIGxldmVsOiBzdGF0ZS5sZXZlbCsrIH0pO1xuICAgICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW5saW5lJyxcbiAgICAgICAgY29udGVudDogcm93c1tpXSA/IHJvd3NbaV0udHJpbSgpIDogJycsXG4gICAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCxcbiAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ3RkX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7XG4gICAgfVxuICAgIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ3RyX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7XG4gIH1cbiAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGJvZHlfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGFibGVfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcblxuICB0YWJsZUxpbmVzWzFdID0gdGJvZHlMaW5lc1sxXSA9IG5leHRMaW5lO1xuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBibG9jayhzdGF0ZSkge1xuXG4gIGlmIChzdGF0ZS5pbmxpbmVNb2RlKSB7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiBzdGF0ZS5zcmMsXG4gICAgICBsZXZlbDogMCxcbiAgICAgIGxpbmVzOiBbIDAsIDEgXSxcbiAgICAgIGNoaWxkcmVuOiBbXVxuICAgIH0pO1xuXG4gIH0gZWxzZSB7XG4gICAgc3RhdGUubWQuYmxvY2sucGFyc2Uoc3RhdGUuc3JjLCBzdGF0ZS5tZCwgc3RhdGUuZW52LCBzdGF0ZS50b2tlbnMpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlubGluZShzdGF0ZSkge1xuICB2YXIgdG9rZW5zID0gc3RhdGUudG9rZW5zLCB0b2ssIGksIGw7XG5cbiAgLy8gUGFyc2UgaW5saW5lc1xuICBmb3IgKGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHRvayA9IHRva2Vuc1tpXTtcbiAgICBpZiAodG9rLnR5cGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICBzdGF0ZS5tZC5pbmxpbmUucGFyc2UodG9rLmNvbnRlbnQsIHN0YXRlLm1kLCBzdGF0ZS5lbnYsIHRvay5jaGlsZHJlbik7XG4gICAgfVxuICB9XG59O1xuIiwiLy8gUmVwbGFjZSBsaW5rLWxpa2UgdGV4dHMgd2l0aCBsaW5rIG5vZGVzLlxuLy9cbi8vIEN1cnJlbnRseSByZXN0cmljdGVkIGJ5IGBpbmxpbmUudmFsaWRhdGVMaW5rKClgIHRvIGh0dHAvaHR0cHMvZnRwXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBBdXRvbGlua2VyICAgICA9IHJlcXVpcmUoJ2F1dG9saW5rZXInKTtcbnZhciBhcnJheVJlcGxhY2VBdCA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmFycmF5UmVwbGFjZUF0O1xuXG5cbnZhciBMSU5LX1NDQU5fUkUgPSAvd3d3fEB8XFw6XFwvXFwvLztcblxuXG5mdW5jdGlvbiBpc0xpbmtPcGVuKHN0cikge1xuICByZXR1cm4gL148YVs+XFxzXS9pLnRlc3Qoc3RyKTtcbn1cbmZ1bmN0aW9uIGlzTGlua0Nsb3NlKHN0cikge1xuICByZXR1cm4gL148XFwvYVxccyo+L2kudGVzdChzdHIpO1xufVxuXG4vLyBTdHVwaWQgZmFicmljIHRvIGF2b2lkIHNpbmdsZXRvbnMsIGZvciB0aHJlYWQgc2FmZXR5LlxuLy8gUmVxdWlyZWQgZm9yIGVuZ2luZXMgbGlrZSBOYXNob3JuLlxuLy9cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtpZmllcigpIHtcbiAgdmFyIGxpbmtzID0gW107XG4gIHZhciBhdXRvbGlua2VyID0gbmV3IEF1dG9saW5rZXIoe1xuICAgIHN0cmlwUHJlZml4OiBmYWxzZSxcbiAgICB1cmw6IHRydWUsXG4gICAgZW1haWw6IHRydWUsXG4gICAgdHdpdHRlcjogZmFsc2UsXG4gICAgcmVwbGFjZUZuOiBmdW5jdGlvbiAoX18sIG1hdGNoKSB7XG4gICAgICAvLyBPbmx5IGNvbGxlY3QgbWF0Y2hlZCBzdHJpbmdzIGJ1dCBkb24ndCBjaGFuZ2UgYW55dGhpbmcuXG4gICAgICBzd2l0Y2ggKG1hdGNoLmdldFR5cGUoKSkge1xuICAgICAgICAvKmVzbGludCBkZWZhdWx0LWNhc2U6MCovXG4gICAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgICAgbGlua3MucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBtYXRjaC5tYXRjaGVkVGV4dCxcbiAgICAgICAgICAgIHVybDogbWF0Y2guZ2V0VXJsKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgIGxpbmtzLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hlZFRleHQsXG4gICAgICAgICAgICAvLyBub3JtYWxpemUgZW1haWwgcHJvdG9jb2xcbiAgICAgICAgICAgIHVybDogJ21haWx0bzonICsgbWF0Y2guZ2V0RW1haWwoKS5yZXBsYWNlKC9ebWFpbHRvOi9pLCAnJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGlua3M6IGxpbmtzLFxuICAgIGF1dG9saW5rZXI6IGF1dG9saW5rZXJcbiAgfTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxpbmtpZnkoc3RhdGUpIHtcbiAgdmFyIGksIGosIGwsIHRva2VucywgdG9rZW4sIHRleHQsIG5vZGVzLCBsbiwgcG9zLCBsZXZlbCwgaHRtbExpbmtMZXZlbCxcbiAgICAgIGJsb2NrVG9rZW5zID0gc3RhdGUudG9rZW5zLFxuICAgICAgbGlua2lmaWVyID0gbnVsbCwgbGlua3MsIGF1dG9saW5rZXI7XG5cbiAgaWYgKCFzdGF0ZS5tZC5vcHRpb25zLmxpbmtpZnkpIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChqID0gMCwgbCA9IGJsb2NrVG9rZW5zLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgIGlmIChibG9ja1Rva2Vuc1tqXS50eXBlICE9PSAnaW5saW5lJykgeyBjb250aW51ZTsgfVxuICAgIHRva2VucyA9IGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuO1xuXG4gICAgaHRtbExpbmtMZXZlbCA9IDA7XG5cbiAgICAvLyBXZSBzY2FuIGZyb20gdGhlIGVuZCwgdG8ga2VlcCBwb3NpdGlvbiB3aGVuIG5ldyB0YWdzIGFkZGVkLlxuICAgIC8vIFVzZSByZXZlcnNlZCBsb2dpYyBpbiBsaW5rcyBzdGFydC9lbmQgbWF0Y2hcbiAgICBmb3IgKGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICAvLyBTa2lwIGNvbnRlbnQgb2YgbWFya2Rvd24gbGlua3NcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSAnbGlua19jbG9zZScpIHtcbiAgICAgICAgaS0tO1xuICAgICAgICB3aGlsZSAodG9rZW5zW2ldLmxldmVsICE9PSB0b2tlbi5sZXZlbCAmJiB0b2tlbnNbaV0udHlwZSAhPT0gJ2xpbmtfb3BlbicpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFNraXAgY29udGVudCBvZiBodG1sIHRhZyBsaW5rc1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdodG1sX2lubGluZScpIHtcbiAgICAgICAgaWYgKGlzTGlua09wZW4odG9rZW4uY29udGVudCkgJiYgaHRtbExpbmtMZXZlbCA+IDApIHtcbiAgICAgICAgICBodG1sTGlua0xldmVsLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGlua0Nsb3NlKHRva2VuLmNvbnRlbnQpKSB7XG4gICAgICAgICAgaHRtbExpbmtMZXZlbCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaHRtbExpbmtMZXZlbCA+IDApIHsgY29udGludWU7IH1cblxuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0JyAmJiBMSU5LX1NDQU5fUkUudGVzdCh0b2tlbi5jb250ZW50KSkge1xuXG4gICAgICAgIC8vIEluaXQgbGlua2lmaWVyIGluIGxhenkgbWFubmVyLCBvbmx5IGlmIHJlcXVpcmVkLlxuICAgICAgICBpZiAoIWxpbmtpZmllcikge1xuICAgICAgICAgIGxpbmtpZmllciA9IGNyZWF0ZUxpbmtpZmllcigpO1xuICAgICAgICAgIGxpbmtzID0gbGlua2lmaWVyLmxpbmtzO1xuICAgICAgICAgIGF1dG9saW5rZXIgPSBsaW5raWZpZXIuYXV0b2xpbmtlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSB0b2tlbi5jb250ZW50O1xuICAgICAgICBsaW5rcy5sZW5ndGggPSAwO1xuICAgICAgICBhdXRvbGlua2VyLmxpbmsodGV4dCk7XG5cbiAgICAgICAgaWYgKCFsaW5rcy5sZW5ndGgpIHsgY29udGludWU7IH1cblxuICAgICAgICAvLyBOb3cgc3BsaXQgc3RyaW5nIHRvIG5vZGVzXG4gICAgICAgIG5vZGVzID0gW107XG4gICAgICAgIGxldmVsID0gdG9rZW4ubGV2ZWw7XG5cbiAgICAgICAgZm9yIChsbiA9IDA7IGxuIDwgbGlua3MubGVuZ3RoOyBsbisrKSB7XG5cbiAgICAgICAgICBpZiAoIXN0YXRlLm1kLmlubGluZS52YWxpZGF0ZUxpbmsobGlua3NbbG5dLnVybCkpIHsgY29udGludWU7IH1cblxuICAgICAgICAgIHBvcyA9IHRleHQuaW5kZXhPZihsaW5rc1tsbl0udGV4dCk7XG5cbiAgICAgICAgICBpZiAocG9zKSB7XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgY29udGVudDogdGV4dC5zbGljZSgwLCBwb3MpLFxuICAgICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgICAgICAgaHJlZjogbGlua3NbbG5dLnVybCxcbiAgICAgICAgICAgIHRhcmdldDogJycsXG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWwrK1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgY29udGVudDogbGlua3NbbG5dLnRleHQsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rX2Nsb3NlJyxcbiAgICAgICAgICAgIGxldmVsOiAtLWxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGV4dCA9IHRleHQuc2xpY2UocG9zICsgbGlua3NbbG5dLnRleHQubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRleHQsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlcGxhY2UgY3VycmVudCBub2RlXG4gICAgICAgIGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuID0gdG9rZW5zID0gYXJyYXlSZXBsYWNlQXQodG9rZW5zLCBpLCBub2Rlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLy8gTm9ybWFsaXplIGlucHV0IHN0cmluZ1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFRBQlNfU0NBTl9SRSA9IC9bXFxuXFx0XS9nO1xudmFyIE5FV0xJTkVTX1JFICA9IC9cXHJbXFxuXFx1MDA4NV18W1xcdTI0MjRcXHUyMDI4XFx1MDA4NV0vZztcbnZhciBOVUxMX1JFICAgICAgPSAvXFx1MDAwMC9nO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5saW5lKHN0YXRlKSB7XG4gIHZhciBzdHIsIGxpbmVTdGFydCwgbGFzdFRhYlBvcztcblxuICAvLyBOb3JtYWxpemUgbmV3bGluZXNcbiAgc3RyID0gc3RhdGUuc3JjLnJlcGxhY2UoTkVXTElORVNfUkUsICdcXG4nKTtcblxuICAvLyBSZXBsYWNlIE5VTEwgY2hhcmFjdGVyc1xuICBzdHIgPSBzdHIucmVwbGFjZShOVUxMX1JFLCAnXFx1RkZGRCcpO1xuXG4gIC8vIFJlcGxhY2UgdGFicyB3aXRoIHByb3BlciBudW1iZXIgb2Ygc3BhY2VzICgxLi40KVxuICBpZiAoc3RyLmluZGV4T2YoJ1xcdCcpID49IDApIHtcbiAgICBsaW5lU3RhcnQgPSAwO1xuICAgIGxhc3RUYWJQb3MgPSAwO1xuXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoVEFCU19TQ0FOX1JFLCBmdW5jdGlvbiAobWF0Y2gsIG9mZnNldCkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChzdHIuY2hhckNvZGVBdChvZmZzZXQpID09PSAweDBBKSB7XG4gICAgICAgIGxpbmVTdGFydCA9IG9mZnNldCArIDE7XG4gICAgICAgIGxhc3RUYWJQb3MgPSAwO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSAnICAgICcuc2xpY2UoKG9mZnNldCAtIGxpbmVTdGFydCAtIGxhc3RUYWJQb3MpICUgNCk7XG4gICAgICBsYXN0VGFiUG9zID0gb2Zmc2V0IC0gbGluZVN0YXJ0ICsgMTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0ZS5zcmMgPSBzdHI7XG59O1xuIiwiLy8gU2ltcGxlIHR5cG9ncmFwaHljIHJlcGxhY2VtZW50c1xuLy9cbi8vICcnIOKGkiDigJjigJlcbi8vIFwiXCIg4oaSIOKAnOKAnS4gU2V0ICfCq8K7JyBmb3IgUnVzc2lhbiwgJ+KAnuKAnCcgZm9yIEdlcm1hbiwgZW1wdHkgdG8gZGlzYWJsZVxuLy8gKGMpIChDKSDihpIgwqlcbi8vICh0bSkgKFRNKSDihpIg4oSiXG4vLyAocikgKFIpIOKGkiDCrlxuLy8gKy0g4oaSIMKxXG4vLyAocCkgKFApIC0+IMKnXG4vLyAuLi4g4oaSIOKApiAoYWxzbyA/Li4uLiDihpIgPy4uLCAhLi4uLiDihpIgIS4uKVxuLy8gPz8/Pz8/Pz8g4oaSID8/PywgISEhISEg4oaSICEhISwgYCwsYCDihpIgYCxgXG4vLyAtLSDihpIgJm5kYXNoOywgLS0tIOKGkiAmbWRhc2g7XG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBUT0RPOlxuLy8gLSBmcmFjdGlvbmFscyAxLzIsIDEvNCwgMy80IC0+IMK9LCDCvCwgwr5cbi8vIC0gbWlsdGlwbGljYXRpb24gMiB4IDQgLT4gMiDDlyA0XG5cbnZhciBSQVJFX1JFID0gL1xcKy18XFwuXFwufFxcP1xcP1xcP1xcP3whISEhfCwsfC0tLztcblxudmFyIFNDT1BFRF9BQkJSX1JFID0gL1xcKChjfHRtfHJ8cClcXCkvaWc7XG52YXIgU0NPUEVEX0FCQlIgPSB7XG4gICdjJzogJ8KpJyxcbiAgJ3InOiAnwq4nLFxuICAncCc6ICfCpycsXG4gICd0bSc6ICfihKInXG59O1xuXG5mdW5jdGlvbiByZXBsYWNlU2NvcGVkQWJicihzdHIpIHtcbiAgaWYgKHN0ci5pbmRleE9mKCcoJykgPCAwKSB7IHJldHVybiBzdHI7IH1cblxuICByZXR1cm4gc3RyLnJlcGxhY2UoU0NPUEVEX0FCQlJfUkUsIGZ1bmN0aW9uKG1hdGNoLCBuYW1lKSB7XG4gICAgcmV0dXJuIFNDT1BFRF9BQkJSW25hbWUudG9Mb3dlckNhc2UoKV07XG4gIH0pO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwbGFjZShzdGF0ZSkge1xuICB2YXIgaSwgdG9rZW4sIHRleHQsIGlubGluZVRva2VucywgYmxrSWR4O1xuXG4gIGlmICghc3RhdGUubWQub3B0aW9ucy50eXBvZ3JhcGhlcikgeyByZXR1cm47IH1cblxuICBmb3IgKGJsa0lkeCA9IHN0YXRlLnRva2Vucy5sZW5ndGggLSAxOyBibGtJZHggPj0gMDsgYmxrSWR4LS0pIHtcblxuICAgIGlmIChzdGF0ZS50b2tlbnNbYmxrSWR4XS50eXBlICE9PSAnaW5saW5lJykgeyBjb250aW51ZTsgfVxuXG4gICAgaW5saW5lVG9rZW5zID0gc3RhdGUudG9rZW5zW2Jsa0lkeF0uY2hpbGRyZW47XG5cbiAgICBmb3IgKGkgPSBpbmxpbmVUb2tlbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRva2VuID0gaW5saW5lVG9rZW5zW2ldO1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICB0ZXh0ID0gdG9rZW4uY29udGVudDtcblxuICAgICAgICB0ZXh0ID0gcmVwbGFjZVNjb3BlZEFiYnIodGV4dCk7XG5cbiAgICAgICAgaWYgKFJBUkVfUkUudGVzdCh0ZXh0KSkge1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcKy0vZywgJ8KxJylcbiAgICAgICAgICAgICAgICAgICAgICAvLyAuLiwgLi4uLCAuLi4uLi4uIC0+IOKAplxuICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCA/Li4uLi4gJiAhLi4uLi4gLT4gPy4uICYgIS4uXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLnsyLH0vZywgJ+KApicpLnJlcGxhY2UoLyhbPyFdKeKApi9nLCAnJDEuLicpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhbPyFdKXs0LH0vZywgJyQxJDEkMScpLnJlcGxhY2UoLyx7Mix9L2csICcsJylcbiAgICAgICAgICAgICAgICAgICAgICAvLyBlbS1kYXNoXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhefFteLV0pLS0tKFteLV18JCkvbWcsICckMVxcdTIwMTQkMicpXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZW4tZGFzaFxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXnxcXHMpLS0oXFxzfCQpL21nLCAnJDFcXHUyMDEzJDInKVxuICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXnxbXi1cXHNdKS0tKFteLVxcc118JCkvbWcsICckMVxcdTIwMTMkMicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9rZW4uY29udGVudCA9IHRleHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLy8gQ29udmVydCBzdHJhaWdodCBxdW90YXRpb24gbWFya3MgdG8gdHlwb2dyYXBoaWMgb25lc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgUVVPVEVfVEVTVF9SRSA9IC9bJ1wiXS87XG52YXIgUVVPVEVfUkUgPSAvWydcIl0vZztcbnZhciBQVU5DVF9SRSA9IC9bLVxccygpXFxbXFxdXS87XG52YXIgQVBPU1RST1BIRSA9ICdcXHUyMDE5JzsgLyog4oCZICovXG5cbi8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0cnVlIGlmIHRoZSBjaGFyYWN0ZXIgYXQgYHBvc2Bcbi8vIGNvdWxkIGJlIGluc2lkZSBhIHdvcmQuXG5mdW5jdGlvbiBpc0xldHRlcihzdHIsIHBvcykge1xuICBpZiAocG9zIDwgMCB8fCBwb3MgPj0gc3RyLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgcmV0dXJuICFQVU5DVF9SRS50ZXN0KHN0cltwb3NdKTtcbn1cblxuXG5mdW5jdGlvbiByZXBsYWNlQXQoc3RyLCBpbmRleCwgY2gpIHtcbiAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgaW5kZXgpICsgY2ggKyBzdHIuc3Vic3RyKGluZGV4ICsgMSk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzbWFydHF1b3RlcyhzdGF0ZSkge1xuICAvKmVzbGludCBtYXgtZGVwdGg6MCovXG4gIHZhciBpLCB0b2tlbiwgdGV4dCwgdCwgcG9zLCBtYXgsIHRoaXNMZXZlbCwgbGFzdFNwYWNlLCBuZXh0U3BhY2UsIGl0ZW0sXG4gICAgICBjYW5PcGVuLCBjYW5DbG9zZSwgaiwgaXNTaW5nbGUsIGJsa0lkeCwgdG9rZW5zLFxuICAgICAgc3RhY2s7XG5cbiAgaWYgKCFzdGF0ZS5tZC5vcHRpb25zLnR5cG9ncmFwaGVyKSB7IHJldHVybjsgfVxuXG4gIHN0YWNrID0gW107XG5cbiAgZm9yIChibGtJZHggPSBzdGF0ZS50b2tlbnMubGVuZ3RoIC0gMTsgYmxrSWR4ID49IDA7IGJsa0lkeC0tKSB7XG5cbiAgICBpZiAoc3RhdGUudG9rZW5zW2Jsa0lkeF0udHlwZSAhPT0gJ2lubGluZScpIHsgY29udGludWU7IH1cblxuICAgIHRva2VucyA9IHN0YXRlLnRva2Vuc1tibGtJZHhdLmNoaWxkcmVuO1xuICAgIHN0YWNrLmxlbmd0aCA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICd0ZXh0JyB8fCBRVU9URV9URVNUX1JFLnRlc3QodG9rZW4udGV4dCkpIHsgY29udGludWU7IH1cblxuICAgICAgdGhpc0xldmVsID0gdG9rZW5zW2ldLmxldmVsO1xuXG4gICAgICBmb3IgKGogPSBzdGFjay5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICBpZiAoc3RhY2tbal0ubGV2ZWwgPD0gdGhpc0xldmVsKSB7IGJyZWFrOyB9XG4gICAgICB9XG4gICAgICBzdGFjay5sZW5ndGggPSBqICsgMTtcblxuICAgICAgdGV4dCA9IHRva2VuLmNvbnRlbnQ7XG4gICAgICBwb3MgPSAwO1xuICAgICAgbWF4ID0gdGV4dC5sZW5ndGg7XG5cbiAgICAgIC8qZXNsaW50IG5vLWxhYmVsczowLGJsb2NrLXNjb3BlZC12YXI6MCovXG4gICAgICBPVVRFUjpcbiAgICAgIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICAgICAgUVVPVEVfUkUubGFzdEluZGV4ID0gcG9zO1xuICAgICAgICB0ID0gUVVPVEVfUkUuZXhlYyh0ZXh0KTtcbiAgICAgICAgaWYgKCF0KSB7IGJyZWFrOyB9XG5cbiAgICAgICAgbGFzdFNwYWNlID0gIWlzTGV0dGVyKHRleHQsIHQuaW5kZXggLSAxKTtcbiAgICAgICAgcG9zID0gdC5pbmRleCArIDE7XG4gICAgICAgIGlzU2luZ2xlID0gKHRbMF0gPT09IFwiJ1wiKTtcbiAgICAgICAgbmV4dFNwYWNlID0gIWlzTGV0dGVyKHRleHQsIHBvcyk7XG5cbiAgICAgICAgaWYgKCFuZXh0U3BhY2UgJiYgIWxhc3RTcGFjZSkge1xuICAgICAgICAgIC8vIG1pZGRsZSBvZiB3b3JkXG4gICAgICAgICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICAgICAgICB0b2tlbi5jb250ZW50ID0gcmVwbGFjZUF0KHRva2VuLmNvbnRlbnQsIHQuaW5kZXgsIEFQT1NUUk9QSEUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbk9wZW4gPSAhbmV4dFNwYWNlO1xuICAgICAgICBjYW5DbG9zZSA9ICFsYXN0U3BhY2U7XG5cbiAgICAgICAgaWYgKGNhbkNsb3NlKSB7XG4gICAgICAgICAgLy8gdGhpcyBjb3VsZCBiZSBhIGNsb3NpbmcgcXVvdGUsIHJld2luZCB0aGUgc3RhY2sgdG8gZ2V0IGEgbWF0Y2hcbiAgICAgICAgICBmb3IgKGogPSBzdGFjay5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgaXRlbSA9IHN0YWNrW2pdO1xuICAgICAgICAgICAgaWYgKHN0YWNrW2pdLmxldmVsIDwgdGhpc0xldmVsKSB7IGJyZWFrOyB9XG4gICAgICAgICAgICBpZiAoaXRlbS5zaW5nbGUgPT09IGlzU2luZ2xlICYmIHN0YWNrW2pdLmxldmVsID09PSB0aGlzTGV2ZWwpIHtcbiAgICAgICAgICAgICAgaXRlbSA9IHN0YWNrW2pdO1xuICAgICAgICAgICAgICBpZiAoaXNTaW5nbGUpIHtcbiAgICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCA9IHJlcGxhY2VBdChcbiAgICAgICAgICAgICAgICAgIHRva2Vuc1tpdGVtLnRva2VuXS5jb250ZW50LCBpdGVtLnBvcywgc3RhdGUubWQub3B0aW9ucy5xdW90ZXNbMl0pO1xuICAgICAgICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSByZXBsYWNlQXQoXG4gICAgICAgICAgICAgICAgICB0b2tlbi5jb250ZW50LCB0LmluZGV4LCBzdGF0ZS5tZC5vcHRpb25zLnF1b3Rlc1szXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zW2l0ZW0udG9rZW5dLmNvbnRlbnQgPSByZXBsYWNlQXQoXG4gICAgICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCwgaXRlbS5wb3MsIHN0YXRlLm1kLm9wdGlvbnMucXVvdGVzWzBdKTtcbiAgICAgICAgICAgICAgICB0b2tlbi5jb250ZW50ID0gcmVwbGFjZUF0KHRva2VuLmNvbnRlbnQsIHQuaW5kZXgsIHN0YXRlLm1kLm9wdGlvbnMucXVvdGVzWzFdKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdGFjay5sZW5ndGggPSBqO1xuICAgICAgICAgICAgICBjb250aW51ZSBPVVRFUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FuT3Blbikge1xuICAgICAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICAgICAgdG9rZW46IGksXG4gICAgICAgICAgICBwb3M6IHQuaW5kZXgsXG4gICAgICAgICAgICBzaW5nbGU6IGlzU2luZ2xlLFxuICAgICAgICAgICAgbGV2ZWw6IHRoaXNMZXZlbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNhbkNsb3NlICYmIGlzU2luZ2xlKSB7XG4gICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdCh0b2tlbi5jb250ZW50LCB0LmluZGV4LCBBUE9TVFJPUEhFKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIi8vIENvcmUgc3RhdGUgb2JqZWN0XG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN0YXRlQ29yZShzcmMsIG1kLCBlbnYpIHtcbiAgdGhpcy5zcmMgPSBzcmM7XG4gIHRoaXMuZW52ID0gZW52O1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLmlubGluZU1vZGUgPSBmYWxzZTtcbiAgdGhpcy5tZCA9IG1kOyAvLyBsaW5rIHRvIHBhcnNlciBpbnN0YW5jZVxufTtcbiIsIi8vIFByb2Nlc3MgYXV0b2xpbmtzICc8cHJvdG9jb2w6Li4uPidcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXJsX3NjaGVtYXMgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91cmxfc2NoZW1hcycpO1xudmFyIG5vcm1hbGl6ZUxpbmsgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5ub3JtYWxpemVMaW5rO1xuXG5cbi8qZXNsaW50IG1heC1sZW46MCovXG52YXIgRU1BSUxfUkUgICAgPSAvXjwoW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKik+LztcbnZhciBBVVRPTElOS19SRSA9IC9ePChbYS16QS1aLlxcLV17MSwyNX0pOihbXjw+XFx4MDAtXFx4MjBdKik+LztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF1dG9saW5rKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIHRhaWwsIGxpbmtNYXRjaCwgZW1haWxNYXRjaCwgdXJsLCBmdWxsVXJsLCBwb3MgPSBzdGF0ZS5wb3M7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4M0MvKiA8ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHRhaWwgPSBzdGF0ZS5zcmMuc2xpY2UocG9zKTtcblxuICBpZiAodGFpbC5pbmRleE9mKCc+JykgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxpbmtNYXRjaCA9IHRhaWwubWF0Y2goQVVUT0xJTktfUkUpO1xuXG4gIGlmIChsaW5rTWF0Y2gpIHtcbiAgICBpZiAodXJsX3NjaGVtYXMuaW5kZXhPZihsaW5rTWF0Y2hbMV0udG9Mb3dlckNhc2UoKSkgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdXJsID0gbGlua01hdGNoWzBdLnNsaWNlKDEsIC0xKTtcbiAgICBmdWxsVXJsID0gbm9ybWFsaXplTGluayh1cmwpO1xuICAgIGlmICghc3RhdGUubWQuaW5saW5lLnZhbGlkYXRlTGluayh1cmwpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlua19vcGVuJyxcbiAgICAgICAgaHJlZjogZnVsbFVybCxcbiAgICAgICAgdGFyZ2V0OiAnJyxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGNvbnRlbnQ6IHVybCxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsICsgMVxuICAgICAgfSk7XG4gICAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ2xpbmtfY2xvc2UnLCBsZXZlbDogc3RhdGUubGV2ZWwgfSk7XG4gICAgfVxuXG4gICAgc3RhdGUucG9zICs9IGxpbmtNYXRjaFswXS5sZW5ndGg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBlbWFpbE1hdGNoID0gdGFpbC5tYXRjaChFTUFJTF9SRSk7XG5cbiAgaWYgKGVtYWlsTWF0Y2gpIHtcblxuICAgIHVybCA9IGVtYWlsTWF0Y2hbMF0uc2xpY2UoMSwgLTEpO1xuXG4gICAgZnVsbFVybCA9IG5vcm1hbGl6ZUxpbmsoJ21haWx0bzonICsgdXJsKTtcbiAgICBpZiAoIXN0YXRlLm1kLmlubGluZS52YWxpZGF0ZUxpbmsoZnVsbFVybCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgICBocmVmOiBmdWxsVXJsLFxuICAgICAgICB0YXJnZXQ6ICcnLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgIH0pO1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgY29udGVudDogdXJsLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWwgKyAxXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnbGlua19jbG9zZScsIGxldmVsOiBzdGF0ZS5sZXZlbCB9KTtcbiAgICB9XG5cbiAgICBzdGF0ZS5wb3MgKz0gZW1haWxNYXRjaFswXS5sZW5ndGg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLy8gUGFyc2UgYmFja3RpY2tzXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYWNrdGljayhzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBzdGFydCwgbWF4LCBtYXJrZXIsIG1hdGNoU3RhcnQsIG1hdGNoRW5kLFxuICAgICAgcG9zID0gc3RhdGUucG9zLFxuICAgICAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuXG4gIGlmIChjaCAhPT0gMHg2MC8qIGAgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3RhcnQgPSBwb3M7XG4gIHBvcysrO1xuICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDYwLyogYCAqLykgeyBwb3MrKzsgfVxuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5zbGljZShzdGFydCwgcG9zKTtcblxuICBtYXRjaFN0YXJ0ID0gbWF0Y2hFbmQgPSBwb3M7XG5cbiAgd2hpbGUgKChtYXRjaFN0YXJ0ID0gc3RhdGUuc3JjLmluZGV4T2YoJ2AnLCBtYXRjaEVuZCkpICE9PSAtMSkge1xuICAgIG1hdGNoRW5kID0gbWF0Y2hTdGFydCArIDE7XG5cbiAgICB3aGlsZSAobWF0Y2hFbmQgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQobWF0Y2hFbmQpID09PSAweDYwLyogYCAqLykgeyBtYXRjaEVuZCsrOyB9XG5cbiAgICBpZiAobWF0Y2hFbmQgLSBtYXRjaFN0YXJ0ID09PSBtYXJrZXIubGVuZ3RoKSB7XG4gICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICBzdGF0ZS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnY29kZV9pbmxpbmUnLFxuICAgICAgICAgIGNvbnRlbnQ6IHN0YXRlLnNyYy5zbGljZShwb3MsIG1hdGNoU3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWyBcXG5dKy9nLCAnICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpLFxuICAgICAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHN0YXRlLnBvcyA9IG1hdGNoRW5kO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBtYXJrZXI7IH1cbiAgc3RhdGUucG9zICs9IG1hcmtlci5sZW5ndGg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgKnRoaXMqIGFuZCBfdGhhdF9cbi8vXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIGlzV2hpdGVTcGFjZSAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNXaGl0ZVNwYWNlO1xudmFyIGlzUHVuY3RDaGFyICAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNQdW5jdENoYXI7XG52YXIgaXNNZEFzY2lpUHVuY3QgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc01kQXNjaWlQdW5jdDtcblxuXG5mdW5jdGlvbiBpc0FscGhhTnVtKGNvZGUpIHtcbiAgcmV0dXJuIChjb2RlID49IDB4MzAgLyogMCAqLyAmJiBjb2RlIDw9IDB4MzkgLyogOSAqLykgfHxcbiAgICAgICAgIChjb2RlID49IDB4NDEgLyogQSAqLyAmJiBjb2RlIDw9IDB4NUEgLyogWiAqLykgfHxcbiAgICAgICAgIChjb2RlID49IDB4NjEgLyogYSAqLyAmJiBjb2RlIDw9IDB4N0EgLyogeiAqLyk7XG59XG5cbi8vIHBhcnNlIHNlcXVlbmNlIG9mIGVtcGhhc2lzIG1hcmtlcnMsXG4vLyBcInN0YXJ0XCIgc2hvdWxkIHBvaW50IGF0IGEgdmFsaWQgbWFya2VyXG5mdW5jdGlvbiBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCkge1xuICB2YXIgcG9zID0gc3RhcnQsIGxhc3RDaGFyLCBuZXh0Q2hhciwgY291bnQsXG4gICAgICBpc0xhc3RXaGl0ZVNwYWNlLCBpc0xhc3RQdW5jdENoYXIsXG4gICAgICBpc05leHRXaGl0ZVNwYWNlLCBpc05leHRQdW5jdENoYXIsXG4gICAgICBjYW5fb3BlbiA9IHRydWUsXG4gICAgICBjYW5fY2xvc2UgPSB0cnVlLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpO1xuXG4gIGxhc3RDaGFyID0gc3RhcnQgPiAwID8gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQgLSAxKSA6IC0xO1xuXG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gbWFya2VyKSB7IHBvcysrOyB9XG4gIGlmIChwb3MgPj0gbWF4KSB7IGNhbl9vcGVuID0gZmFsc2U7IH1cbiAgY291bnQgPSBwb3MgLSBzdGFydDtcblxuICBuZXh0Q2hhciA9IHBvcyA8IG1heCA/IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgOiAtMTtcblxuICBpc0xhc3RQdW5jdENoYXIgPSBsYXN0Q2hhciA+PSAwICYmXG4gICAgKGlzTWRBc2NpaVB1bmN0KGxhc3RDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGxhc3RDaGFyKSkpO1xuICBpc05leHRQdW5jdENoYXIgPSBuZXh0Q2hhciA+PSAwICYmXG4gICAgKGlzTWRBc2NpaVB1bmN0KG5leHRDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKG5leHRDaGFyKSkpO1xuICBpc0xhc3RXaGl0ZVNwYWNlID0gbGFzdENoYXIgPj0gMCAmJiBpc1doaXRlU3BhY2UobGFzdENoYXIpO1xuICBpc05leHRXaGl0ZVNwYWNlID0gbmV4dENoYXIgPj0gMCAmJiBpc1doaXRlU3BhY2UobmV4dENoYXIpO1xuXG4gIGlmIChpc05leHRXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX29wZW4gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc05leHRQdW5jdENoYXIpIHtcbiAgICBpZiAoIShpc0xhc3RXaGl0ZVNwYWNlIHx8IGlzTGFzdFB1bmN0Q2hhciB8fCBsYXN0Q2hhciA9PT0gLTEpKSB7XG4gICAgICBjYW5fb3BlbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0xhc3RXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX2Nsb3NlID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNMYXN0UHVuY3RDaGFyKSB7XG4gICAgaWYgKCEoaXNOZXh0V2hpdGVTcGFjZSB8fCBpc05leHRQdW5jdENoYXIgfHwgbmV4dENoYXIgPT09IC0xKSkge1xuICAgICAgY2FuX2Nsb3NlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1hcmtlciA9PT0gMHg1RiAvKiBfICovKSB7XG4gICAgLy8gY2hlY2sgaWYgd2UgYXJlbid0IGluc2lkZSB0aGUgd29yZFxuICAgIGlmIChpc0FscGhhTnVtKGxhc3RDaGFyKSkgeyBjYW5fb3BlbiA9IGZhbHNlOyB9XG4gICAgaWYgKGlzQWxwaGFOdW0obmV4dENoYXIpKSB7IGNhbl9jbG9zZSA9IGZhbHNlOyB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNhbl9vcGVuOiBjYW5fb3BlbixcbiAgICBjYW5fY2xvc2U6IGNhbl9jbG9zZSxcbiAgICBkZWxpbXM6IGNvdW50XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW1waGFzaXMoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgc3RhcnRDb3VudCxcbiAgICAgIGNvdW50LFxuICAgICAgZm91bmQsXG4gICAgICBvbGRDb3VudCxcbiAgICAgIG5ld0NvdW50LFxuICAgICAgc3RhY2ssXG4gICAgICByZXMsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBzdGFydCA9IHN0YXRlLnBvcyxcbiAgICAgIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0KTtcblxuICBpZiAobWFya2VyICE9PSAweDVGLyogXyAqLyAmJiBtYXJrZXIgIT09IDB4MkEgLyogKiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gZG9uJ3QgcnVuIGFueSBwYWlycyBpbiB2YWxpZGF0aW9uIG1vZGVcblxuICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCk7XG4gIHN0YXJ0Q291bnQgPSByZXMuZGVsaW1zO1xuICBpZiAoIXJlcy5jYW5fb3Blbikge1xuICAgIHN0YXRlLnBvcyArPSBzdGFydENvdW50O1xuICAgIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG4gICAgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHN0YXRlLnBvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIHN0YXJ0Q291bnQ7XG4gIHN0YWNrID0gWyBzdGFydENvdW50IF07XG5cbiAgd2hpbGUgKHN0YXRlLnBvcyA8IG1heCkge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpID09PSBtYXJrZXIpIHtcbiAgICAgIHJlcyA9IHNjYW5EZWxpbXMoc3RhdGUsIHN0YXRlLnBvcyk7XG4gICAgICBjb3VudCA9IHJlcy5kZWxpbXM7XG4gICAgICBpZiAocmVzLmNhbl9jbG9zZSkge1xuICAgICAgICBvbGRDb3VudCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBuZXdDb3VudCA9IGNvdW50O1xuXG4gICAgICAgIHdoaWxlIChvbGRDb3VudCAhPT0gbmV3Q291bnQpIHtcbiAgICAgICAgICBpZiAobmV3Q291bnQgPCBvbGRDb3VudCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChvbGRDb3VudCAtIG5ld0NvdW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGFzc2VydChuZXdDb3VudCA+IG9sZENvdW50KVxuICAgICAgICAgIG5ld0NvdW50IC09IG9sZENvdW50O1xuXG4gICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkgeyBicmVhazsgfVxuICAgICAgICAgIHN0YXRlLnBvcyArPSBvbGRDb3VudDtcbiAgICAgICAgICBvbGRDb3VudCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHN0YXJ0Q291bnQgPSBvbGRDb3VudDtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcy5jYW5fb3BlbikgeyBzdGFjay5wdXNoKGNvdW50KTsgfVxuICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc3RhdGUubWQuaW5saW5lLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kKSB7XG4gICAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kIGVuZGluZyB0YWcsIHNvIGl0J3Mgbm90IHZhbGlkIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZm91bmQhXG4gIHN0YXRlLnBvc01heCA9IHN0YXRlLnBvcztcbiAgc3RhdGUucG9zID0gc3RhcnQgKyBzdGFydENvdW50O1xuXG4gIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG5cbiAgLy8gd2UgaGF2ZSBgc3RhcnRDb3VudGAgc3RhcnRpbmcgYW5kIGVuZGluZyBtYXJrZXJzLFxuICAvLyBub3cgdHJ5aW5nIHRvIHNlcmlhbGl6ZSB0aGVtIGludG8gdG9rZW5zXG4gIGZvciAoY291bnQgPSBzdGFydENvdW50OyBjb3VudCA+IDE7IGNvdW50IC09IDIpIHtcbiAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ3N0cm9uZ19vcGVuJywgbGV2ZWw6IHN0YXRlLmxldmVsKysgfSk7XG4gIH1cbiAgaWYgKGNvdW50ICUgMikgeyBzdGF0ZS5wdXNoKHsgdHlwZTogJ2VtX29wZW4nLCBsZXZlbDogc3RhdGUubGV2ZWwrKyB9KTsgfVxuXG4gIHN0YXRlLm1kLmlubGluZS50b2tlbml6ZShzdGF0ZSk7XG5cbiAgaWYgKGNvdW50ICUgMikgeyBzdGF0ZS5wdXNoKHsgdHlwZTogJ2VtX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7IH1cbiAgZm9yIChjb3VudCA9IHN0YXJ0Q291bnQ7IGNvdW50ID4gMTsgY291bnQgLT0gMikge1xuICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnc3Ryb25nX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGF0ZS5wb3NNYXggKyBzdGFydENvdW50O1xuICBzdGF0ZS5wb3NNYXggPSBtYXg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgaHRtbCBlbnRpdHkgLSAmIzEyMzssICYjeEFGOywgJnF1b3Q7LCAuLi5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW50aXRpZXMgICAgICAgICAgPSByZXF1aXJlKCcuLi9jb21tb24vZW50aXRpZXMnKTtcbnZhciBoYXMgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmhhcztcbnZhciBpc1ZhbGlkRW50aXR5Q29kZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmlzVmFsaWRFbnRpdHlDb2RlO1xudmFyIGZyb21Db2RlUG9pbnQgICAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuZnJvbUNvZGVQb2ludDtcblxuXG52YXIgRElHSVRBTF9SRSA9IC9eJiMoKD86eFthLWYwLTldezEsOH18WzAtOV17MSw4fSkpOy9pO1xudmFyIE5BTUVEX1JFICAgPSAvXiYoW2Etel1bYS16MC05XXsxLDMxfSk7L2k7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbnRpdHkoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgY2gsIGNvZGUsIG1hdGNoLCBwb3MgPSBzdGF0ZS5wb3MsIG1heCA9IHN0YXRlLnBvc01heDtcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyNi8qICYgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHBvcyArIDEgPCBtYXgpIHtcbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyArIDEpO1xuXG4gICAgaWYgKGNoID09PSAweDIzIC8qICMgKi8pIHtcbiAgICAgIG1hdGNoID0gc3RhdGUuc3JjLnNsaWNlKHBvcykubWF0Y2goRElHSVRBTF9SRSk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgICBjb2RlID0gbWF0Y2hbMV1bMF0udG9Mb3dlckNhc2UoKSA9PT0gJ3gnID8gcGFyc2VJbnQobWF0Y2hbMV0uc2xpY2UoMSksIDE2KSA6IHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG4gICAgICAgICAgc3RhdGUucGVuZGluZyArPSBpc1ZhbGlkRW50aXR5Q29kZShjb2RlKSA/IGZyb21Db2RlUG9pbnQoY29kZSkgOiBmcm9tQ29kZVBvaW50KDB4RkZGRCk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUucG9zICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoID0gc3RhdGUuc3JjLnNsaWNlKHBvcykubWF0Y2goTkFNRURfUkUpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGlmIChoYXMoZW50aXRpZXMsIG1hdGNoWzFdKSkge1xuICAgICAgICAgIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gZW50aXRpZXNbbWF0Y2hbMV1dOyB9XG4gICAgICAgICAgc3RhdGUucG9zICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gJyYnOyB9XG4gIHN0YXRlLnBvcysrO1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZWVzcyBlc2NhcGVkIGNoYXJzIGFuZCBoYXJkYnJlYWtzXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEVTQ0FQRUQgPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykgeyBFU0NBUEVELnB1c2goMCk7IH1cblxuJ1xcXFwhXCIjJCUmXFwnKCkqKywuLzo7PD0+P0BbXV5fYHt8fX4tJ1xuICAuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oY2gpIHsgRVNDQVBFRFtjaC5jaGFyQ29kZUF0KDApXSA9IDE7IH0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXNjYXBlKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIGNoLCBwb3MgPSBzdGF0ZS5wb3MsIG1heCA9IHN0YXRlLnBvc01heDtcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHg1Qy8qIFxcICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcysrO1xuXG4gIGlmIChwb3MgPCBtYXgpIHtcbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoY2ggPCAyNTYgJiYgRVNDQVBFRFtjaF0gIT09IDApIHtcbiAgICAgIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjW3Bvc107IH1cbiAgICAgIHN0YXRlLnBvcyArPSAyO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNoID09PSAweDBBKSB7XG4gICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICBzdGF0ZS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnaGFyZGJyZWFrJyxcbiAgICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHBvcysrO1xuICAgICAgLy8gc2tpcCBsZWFkaW5nIHdoaXRlc3BhY2VzIGZyb20gbmV4dCBsaW5lXG4gICAgICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjApIHsgcG9zKys7IH1cblxuICAgICAgc3RhdGUucG9zID0gcG9zO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSAnXFxcXCc7IH1cbiAgc3RhdGUucG9zKys7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgaHRtbCB0YWdzXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgSFRNTF9UQUdfUkUgPSByZXF1aXJlKCcuLi9jb21tb24vaHRtbF9yZScpLkhUTUxfVEFHX1JFO1xuXG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGNoKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIHZhciBsYyA9IGNoIHwgMHgyMDsgLy8gdG8gbG93ZXIgY2FzZVxuICByZXR1cm4gKGxjID49IDB4NjEvKiBhICovKSAmJiAobGMgPD0gMHg3YS8qIHogKi8pO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHRtbF9pbmxpbmUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgY2gsIG1hdGNoLCBtYXgsIHBvcyA9IHN0YXRlLnBvcztcblxuICBpZiAoIXN0YXRlLm1kLm9wdGlvbnMuaHRtbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBDaGVjayBzdGFydFxuICBtYXggPSBzdGF0ZS5wb3NNYXg7XG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDNDLyogPCAqLyB8fFxuICAgICAgcG9zICsgMiA+PSBtYXgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBRdWljayBmYWlsIG9uIHNlY29uZCBjaGFyXG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSk7XG4gIGlmIChjaCAhPT0gMHgyMS8qICEgKi8gJiZcbiAgICAgIGNoICE9PSAweDNGLyogPyAqLyAmJlxuICAgICAgY2ggIT09IDB4MkYvKiAvICovICYmXG4gICAgICAhaXNMZXR0ZXIoY2gpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChIVE1MX1RBR19SRSk7XG4gIGlmICghbWF0Y2gpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBzdGF0ZS5wdXNoKHtcbiAgICAgIHR5cGU6ICdodG1sX2lubGluZScsXG4gICAgICBjb250ZW50OiBzdGF0ZS5zcmMuc2xpY2UocG9zLCBwb3MgKyBtYXRjaFswXS5sZW5ndGgpLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgfSk7XG4gIH1cbiAgc3RhdGUucG9zICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyAhW2ltYWdlXSg8c3JjPiBcInRpdGxlXCIpXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlTGlua0xhYmVsICAgICAgID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2xhYmVsJyk7XG52YXIgcGFyc2VMaW5rRGVzdGluYXRpb24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfZGVzdGluYXRpb24nKTtcbnZhciBwYXJzZUxpbmtUaXRsZSAgICAgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua190aXRsZScpO1xudmFyIG5vcm1hbGl6ZVJlZmVyZW5jZSAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykubm9ybWFsaXplUmVmZXJlbmNlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW1hZ2Uoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgY29kZSxcbiAgICAgIGhyZWYsXG4gICAgICBsYWJlbCxcbiAgICAgIGxhYmVsRW5kLFxuICAgICAgbGFiZWxTdGFydCxcbiAgICAgIHBvcyxcbiAgICAgIHJlZixcbiAgICAgIHJlcyxcbiAgICAgIHRpdGxlLFxuICAgICAgdG9rZW5zLFxuICAgICAgc3RhcnQsXG4gICAgICBvbGRQb3MgPSBzdGF0ZS5wb3MsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcykgIT09IDB4MjEvKiAhICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zICsgMSkgIT09IDB4NUIvKiBbICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhYmVsU3RhcnQgPSBzdGF0ZS5wb3MgKyAyO1xuICBsYWJlbEVuZCA9IHBhcnNlTGlua0xhYmVsKHN0YXRlLCBzdGF0ZS5wb3MgKyAxLCBmYWxzZSk7XG5cbiAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kICddJywgc28gaXQncyBub3QgYSB2YWxpZCBsaW5rXG4gIGlmIChsYWJlbEVuZCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gbGFiZWxFbmQgKyAxO1xuICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjgvKiAoICovKSB7XG4gICAgLy9cbiAgICAvLyBJbmxpbmUgbGlua1xuICAgIC8vXG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICBeXiBza2lwcGluZyB0aGVzZSBzcGFjZXNcbiAgICBwb3MrKztcbiAgICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgfVxuICAgIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAvLyAgICAgICAgICBeXl5eXl4gcGFyc2luZyBsaW5rIGRlc3RpbmF0aW9uXG4gICAgc3RhcnQgPSBwb3M7XG4gICAgcmVzID0gcGFyc2VMaW5rRGVzdGluYXRpb24oc3RhdGUuc3JjLCBwb3MsIHN0YXRlLnBvc01heCk7XG4gICAgaWYgKHJlcy5vayAmJiBzdGF0ZS5tZC5pbmxpbmUudmFsaWRhdGVMaW5rKHJlcy5zdHIpKSB7XG4gICAgICBocmVmID0gcmVzLnN0cjtcbiAgICAgIHBvcyA9IHJlcy5wb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhyZWYgPSAnJztcbiAgICB9XG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICAgICAgICAgIF5eIHNraXBwaW5nIHRoZXNlIHNwYWNlc1xuICAgIHN0YXJ0ID0gcG9zO1xuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICAgICAgICAgICAgXl5eXl5eXiBwYXJzaW5nIGxpbmsgdGl0bGVcbiAgICByZXMgPSBwYXJzZUxpbmtUaXRsZShzdGF0ZS5zcmMsIHBvcywgc3RhdGUucG9zTWF4KTtcbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXJ0ICE9PSBwb3MgJiYgcmVzLm9rKSB7XG4gICAgICB0aXRsZSA9IHJlcy5zdHI7XG4gICAgICBwb3MgPSByZXMucG9zO1xuXG4gICAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgXl4gc2tpcHBpbmcgdGhlc2Ugc3BhY2VzXG4gICAgICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aXRsZSA9ICcnO1xuICAgIH1cblxuICAgIGlmIChwb3MgPj0gbWF4IHx8IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MjkvKiApICovKSB7XG4gICAgICBzdGF0ZS5wb3MgPSBvbGRQb3M7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHBvcysrO1xuICB9IGVsc2Uge1xuICAgIC8vXG4gICAgLy8gTGluayByZWZlcmVuY2VcbiAgICAvL1xuICAgIGlmICh0eXBlb2Ygc3RhdGUuZW52LnJlZmVyZW5jZXMgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gW2Zvb10gIFtiYXJdXG4gICAgLy8gICAgICBeXiBvcHRpb25hbCB3aGl0ZXNwYWNlIChjYW4gaW5jbHVkZSBuZXdsaW5lcylcbiAgICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgfVxuXG4gICAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDVCLyogWyAqLykge1xuICAgICAgc3RhcnQgPSBwb3MgKyAxO1xuICAgICAgcG9zID0gcGFyc2VMaW5rTGFiZWwoc3RhdGUsIHBvcyk7XG4gICAgICBpZiAocG9zID49IDApIHtcbiAgICAgICAgbGFiZWwgPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHBvcysrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvcyA9IGxhYmVsRW5kICsgMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcG9zID0gbGFiZWxFbmQgKyAxO1xuICAgIH1cblxuICAgIC8vIGNvdmVycyBsYWJlbCA9PT0gJycgYW5kIGxhYmVsID09PSB1bmRlZmluZWRcbiAgICAvLyAoY29sbGFwc2VkIHJlZmVyZW5jZSBsaW5rIGFuZCBzaG9ydGN1dCByZWZlcmVuY2UgbGluayByZXNwZWN0aXZlbHkpXG4gICAgaWYgKCFsYWJlbCkgeyBsYWJlbCA9IHN0YXRlLnNyYy5zbGljZShsYWJlbFN0YXJ0LCBsYWJlbEVuZCk7IH1cblxuICAgIHJlZiA9IHN0YXRlLmVudi5yZWZlcmVuY2VzW25vcm1hbGl6ZVJlZmVyZW5jZShsYWJlbCldO1xuICAgIGlmICghcmVmKSB7XG4gICAgICBzdGF0ZS5wb3MgPSBvbGRQb3M7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhyZWYgPSByZWYuaHJlZjtcbiAgICB0aXRsZSA9IHJlZi50aXRsZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIGZvdW5kIHRoZSBlbmQgb2YgdGhlIGxpbmssIGFuZCBrbm93IGZvciBhIGZhY3QgaXQncyBhIHZhbGlkIGxpbms7XG4gIC8vIHNvIGFsbCB0aGF0J3MgbGVmdCB0byBkbyBpcyB0byBjYWxsIHRva2VuaXplci5cbiAgLy9cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBzdGF0ZS5wb3MgPSBsYWJlbFN0YXJ0O1xuICAgIHN0YXRlLnBvc01heCA9IGxhYmVsRW5kO1xuXG4gICAgdmFyIG5ld1N0YXRlID0gbmV3IHN0YXRlLm1kLmlubGluZS5TdGF0ZShcbiAgICAgIHN0YXRlLnNyYy5zbGljZShsYWJlbFN0YXJ0LCBsYWJlbEVuZCksXG4gICAgICBzdGF0ZS5tZCxcbiAgICAgIHN0YXRlLmVudixcbiAgICAgIHRva2VucyA9IFtdXG4gICAgKTtcbiAgICBuZXdTdGF0ZS5tZC5pbmxpbmUudG9rZW5pemUobmV3U3RhdGUpO1xuXG4gICAgc3RhdGUucHVzaCh7XG4gICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgc3JjOiBocmVmLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgdG9rZW5zOiB0b2tlbnMsXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHBvcztcbiAgc3RhdGUucG9zTWF4ID0gbWF4O1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZXNzIFtsaW5rXSg8dG8+IFwic3R1ZmZcIilcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGFyc2VMaW5rTGFiZWwgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfbGFiZWwnKTtcbnZhciBwYXJzZUxpbmtEZXN0aW5hdGlvbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua19kZXN0aW5hdGlvbicpO1xudmFyIHBhcnNlTGlua1RpdGxlICAgICAgID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX3RpdGxlJyk7XG52YXIgbm9ybWFsaXplUmVmZXJlbmNlICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5ub3JtYWxpemVSZWZlcmVuY2U7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsaW5rKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIGNvZGUsXG4gICAgICBocmVmLFxuICAgICAgbGFiZWwsXG4gICAgICBsYWJlbEVuZCxcbiAgICAgIGxhYmVsU3RhcnQsXG4gICAgICBwb3MsXG4gICAgICByZXMsXG4gICAgICByZWYsXG4gICAgICB0aXRsZSxcbiAgICAgIG9sZFBvcyA9IHN0YXRlLnBvcyxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIHN0YXJ0ID0gc3RhdGUucG9zO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpICE9PSAweDVCLyogWyAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsYWJlbFN0YXJ0ID0gc3RhdGUucG9zICsgMTtcbiAgbGFiZWxFbmQgPSBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgc3RhdGUucG9zLCB0cnVlKTtcblxuICAvLyBwYXJzZXIgZmFpbGVkIHRvIGZpbmQgJ10nLCBzbyBpdCdzIG5vdCBhIHZhbGlkIGxpbmtcbiAgaWYgKGxhYmVsRW5kIDwgMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBsYWJlbEVuZCArIDE7XG4gIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyOC8qICggKi8pIHtcbiAgICAvL1xuICAgIC8vIElubGluZSBsaW5rXG4gICAgLy9cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgIF5eIHNraXBwaW5nIHRoZXNlIHNwYWNlc1xuICAgIHBvcysrO1xuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG4gICAgaWYgKHBvcyA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICAgIF5eXl5eXiBwYXJzaW5nIGxpbmsgZGVzdGluYXRpb25cbiAgICBzdGFydCA9IHBvcztcbiAgICByZXMgPSBwYXJzZUxpbmtEZXN0aW5hdGlvbihzdGF0ZS5zcmMsIHBvcywgc3RhdGUucG9zTWF4KTtcbiAgICBpZiAocmVzLm9rICYmIHN0YXRlLm1kLmlubGluZS52YWxpZGF0ZUxpbmsocmVzLnN0cikpIHtcbiAgICAgIGhyZWYgPSByZXMuc3RyO1xuICAgICAgcG9zID0gcmVzLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgaHJlZiA9ICcnO1xuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgXl4gc2tpcHBpbmcgdGhlc2Ugc3BhY2VzXG4gICAgc3RhcnQgPSBwb3M7XG4gICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgICBeXl5eXl5eIHBhcnNpbmcgbGluayB0aXRsZVxuICAgIHJlcyA9IHBhcnNlTGlua1RpdGxlKHN0YXRlLnNyYywgcG9zLCBzdGF0ZS5wb3NNYXgpO1xuICAgIGlmIChwb3MgPCBtYXggJiYgc3RhcnQgIT09IHBvcyAmJiByZXMub2spIHtcbiAgICAgIHRpdGxlID0gcmVzLnN0cjtcbiAgICAgIHBvcyA9IHJlcy5wb3M7XG5cbiAgICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBeXiBza2lwcGluZyB0aGVzZSBzcGFjZXNcbiAgICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpdGxlID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHBvcyA+PSBtYXggfHwgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyOS8qICkgKi8pIHtcbiAgICAgIHN0YXRlLnBvcyA9IG9sZFBvcztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcG9zKys7XG4gIH0gZWxzZSB7XG4gICAgLy9cbiAgICAvLyBMaW5rIHJlZmVyZW5jZVxuICAgIC8vXG4gICAgaWYgKHR5cGVvZiBzdGF0ZS5lbnYucmVmZXJlbmNlcyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBbZm9vXSAgW2Jhcl1cbiAgICAvLyAgICAgIF5eIG9wdGlvbmFsIHdoaXRlc3BhY2UgKGNhbiBpbmNsdWRlIG5ld2xpbmVzKVxuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4NUIvKiBbICovKSB7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgICBwb3MgPSBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgcG9zKTtcbiAgICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgICBsYWJlbCA9IHN0YXRlLnNyYy5zbGljZShzdGFydCwgcG9zKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zID0gbGFiZWxFbmQgKyAxO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3MgPSBsYWJlbEVuZCArIDE7XG4gICAgfVxuXG4gICAgLy8gY292ZXJzIGxhYmVsID09PSAnJyBhbmQgbGFiZWwgPT09IHVuZGVmaW5lZFxuICAgIC8vIChjb2xsYXBzZWQgcmVmZXJlbmNlIGxpbmsgYW5kIHNob3J0Y3V0IHJlZmVyZW5jZSBsaW5rIHJlc3BlY3RpdmVseSlcbiAgICBpZiAoIWxhYmVsKSB7IGxhYmVsID0gc3RhdGUuc3JjLnNsaWNlKGxhYmVsU3RhcnQsIGxhYmVsRW5kKTsgfVxuXG4gICAgcmVmID0gc3RhdGUuZW52LnJlZmVyZW5jZXNbbm9ybWFsaXplUmVmZXJlbmNlKGxhYmVsKV07XG4gICAgaWYgKCFyZWYpIHtcbiAgICAgIHN0YXRlLnBvcyA9IG9sZFBvcztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaHJlZiA9IHJlZi5ocmVmO1xuICAgIHRpdGxlID0gcmVmLnRpdGxlO1xuICB9XG5cbiAgLy9cbiAgLy8gV2UgZm91bmQgdGhlIGVuZCBvZiB0aGUgbGluaywgYW5kIGtub3cgZm9yIGEgZmFjdCBpdCdzIGEgdmFsaWQgbGluaztcbiAgLy8gc28gYWxsIHRoYXQncyBsZWZ0IHRvIGRvIGlzIHRvIGNhbGwgdG9rZW5pemVyLlxuICAvL1xuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnBvcyA9IGxhYmVsU3RhcnQ7XG4gICAgc3RhdGUucG9zTWF4ID0gbGFiZWxFbmQ7XG5cbiAgICBzdGF0ZS5wdXNoKHtcbiAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgaHJlZjogaHJlZixcbiAgICAgIHRhcmdldDogJycsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICAgIH0pO1xuICAgIHN0YXRlLm1kLmlubGluZS50b2tlbml6ZShzdGF0ZSk7XG4gICAgc3RhdGUucHVzaCh7IHR5cGU6ICdsaW5rX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBwb3M7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2Vlc3MgJ1xcbidcblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5ld2xpbmUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgcG1heCwgbWF4LCBwb3MgPSBzdGF0ZS5wb3M7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MEEvKiBcXG4gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG1heCA9IHN0YXRlLnBlbmRpbmcubGVuZ3RoIC0gMTtcbiAgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIC8vICcgIFxcbicgLT4gaGFyZGJyZWFrXG4gIC8vIExvb2t1cCBpbiBwZW5kaW5nIGNoYXJzIGlzIGJhZCBwcmFjdGljZSEgRG9uJ3QgY29weSB0byBvdGhlciBydWxlcyFcbiAgLy8gUGVuZGluZyBzdHJpbmcgaXMgc3RvcmVkIGluIGNvbmNhdCBtb2RlLCBpbmRleGVkIGxvb2t1cHMgd2lsbCBjYXVzZVxuICAvLyBjb252ZXJ0aW9uIHRvIGZsYXQgbW9kZS5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBpZiAocG1heCA+PSAwICYmIHN0YXRlLnBlbmRpbmcuY2hhckNvZGVBdChwbWF4KSA9PT0gMHgyMCkge1xuICAgICAgaWYgKHBtYXggPj0gMSAmJiBzdGF0ZS5wZW5kaW5nLmNoYXJDb2RlQXQocG1heCAtIDEpID09PSAweDIwKSB7XG4gICAgICAgIHN0YXRlLnBlbmRpbmcgPSBzdGF0ZS5wZW5kaW5nLnJlcGxhY2UoLyArJC8sICcnKTtcbiAgICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2hhcmRicmVhaycsXG4gICAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucGVuZGluZyA9IHN0YXRlLnBlbmRpbmcuc2xpY2UoMCwgLTEpO1xuICAgICAgICBzdGF0ZS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnc29mdGJyZWFrJyxcbiAgICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICdzb2Z0YnJlYWsnLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHBvcysrO1xuXG4gIC8vIHNraXAgaGVhZGluZyBzcGFjZXMgZm9yIG5leHQgbGluZVxuICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjApIHsgcG9zKys7IH1cblxuICBzdGF0ZS5wb3MgPSBwb3M7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIElubGluZSBwYXJzZXIgc3RhdGVcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmZ1bmN0aW9uIFN0YXRlSW5saW5lKHNyYywgbWQsIGVudiwgb3V0VG9rZW5zKSB7XG4gIHRoaXMuc3JjID0gc3JjO1xuICB0aGlzLmVudiA9IGVudjtcbiAgdGhpcy5tZCA9IG1kO1xuICB0aGlzLnRva2VucyA9IG91dFRva2VucztcblxuICB0aGlzLnBvcyA9IDA7XG4gIHRoaXMucG9zTWF4ID0gdGhpcy5zcmMubGVuZ3RoO1xuICB0aGlzLmxldmVsID0gMDtcbiAgdGhpcy5wZW5kaW5nID0gJyc7XG4gIHRoaXMucGVuZGluZ0xldmVsID0gMDtcblxuICB0aGlzLmNhY2hlID0gW107ICAgICAgICAvLyBTdG9yZXMgeyBzdGFydDogZW5kIH0gcGFpcnMuIFVzZWZ1bCBmb3IgYmFja3RyYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGltaXphdGlvbiBvZiBwYWlycyBwYXJzZSAoZW1waGFzaXMsIHN0cmlrZXMpLlxufVxuXG5cbi8vIEZsdXNoIHBlbmRpbmcgdGV4dFxuLy9cblN0YXRlSW5saW5lLnByb3RvdHlwZS5wdXNoUGVuZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3RleHQnLFxuICAgIGNvbnRlbnQ6IHRoaXMucGVuZGluZyxcbiAgICBsZXZlbDogdGhpcy5wZW5kaW5nTGV2ZWxcbiAgfSk7XG4gIHRoaXMucGVuZGluZyA9ICcnO1xufTtcblxuXG4vLyBQdXNoIG5ldyB0b2tlbiB0byBcInN0cmVhbVwiLlxuLy8gSWYgcGVuZGluZyB0ZXh0IGV4aXN0cyAtIGZsdXNoIGl0IGFzIHRleHQgdG9rZW5cbi8vXG5TdGF0ZUlubGluZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICBpZiAodGhpcy5wZW5kaW5nKSB7XG4gICAgdGhpcy5wdXNoUGVuZGluZygpO1xuICB9XG5cbiAgdGhpcy50b2tlbnMucHVzaCh0b2tlbik7XG4gIHRoaXMucGVuZGluZ0xldmVsID0gdGhpcy5sZXZlbDtcbn07XG5cblxuLy8gU3RvcmUgdmFsdWUgdG8gY2FjaGUuXG4vLyAhISEgSW1wbGVtZW50YXRpb24gaGFzIHBhcnNlci1zcGVjaWZpYyBvcHRpbWl6YXRpb25zXG4vLyAhISEga2V5cyBNVVNUIGJlIGludGVnZXIsID49IDA7IHZhbHVlcyBNVVNUIGJlIGludGVnZXIsID4gMFxuLy9cblN0YXRlSW5saW5lLnByb3RvdHlwZS5jYWNoZVNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICBmb3IgKHZhciBpID0gdGhpcy5jYWNoZS5sZW5ndGg7IGkgPD0ga2V5OyBpKyspIHtcbiAgICB0aGlzLmNhY2hlLnB1c2goMCk7XG4gIH1cblxuICB0aGlzLmNhY2hlW2tleV0gPSB2YWw7XG59O1xuXG5cbi8vIEdldCBjYWNoZSB2YWx1ZVxuLy9cblN0YXRlSW5saW5lLnByb3RvdHlwZS5jYWNoZUdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIGtleSA8IHRoaXMuY2FjaGUubGVuZ3RoID8gdGhpcy5jYWNoZVtrZXldIDogMDtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZUlubGluZTtcbiIsIi8vIH5+c3RyaWtlIHRocm91Z2h+flxuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgaXNXaGl0ZVNwYWNlICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc1doaXRlU3BhY2U7XG52YXIgaXNQdW5jdENoYXIgICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc1B1bmN0Q2hhcjtcbnZhciBpc01kQXNjaWlQdW5jdCA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmlzTWRBc2NpaVB1bmN0O1xuXG5cbi8vIHBhcnNlIHNlcXVlbmNlIG9mIG1hcmtlcnMsXG4vLyBcInN0YXJ0XCIgc2hvdWxkIHBvaW50IGF0IGEgdmFsaWQgbWFya2VyXG5mdW5jdGlvbiBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCkge1xuICB2YXIgcG9zID0gc3RhcnQsIGxhc3RDaGFyLCBuZXh0Q2hhciwgY291bnQsXG4gICAgICBpc0xhc3RXaGl0ZVNwYWNlLCBpc0xhc3RQdW5jdENoYXIsXG4gICAgICBpc05leHRXaGl0ZVNwYWNlLCBpc05leHRQdW5jdENoYXIsXG4gICAgICBjYW5fb3BlbiA9IHRydWUsXG4gICAgICBjYW5fY2xvc2UgPSB0cnVlLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpO1xuXG4gIGxhc3RDaGFyID0gc3RhcnQgPiAwID8gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQgLSAxKSA6IC0xO1xuXG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gbWFya2VyKSB7IHBvcysrOyB9XG4gIGlmIChwb3MgPj0gbWF4KSB7IGNhbl9vcGVuID0gZmFsc2U7IH1cbiAgY291bnQgPSBwb3MgLSBzdGFydDtcblxuICBuZXh0Q2hhciA9IHBvcyA8IG1heCA/IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgOiAtMTtcblxuICBpc0xhc3RQdW5jdENoYXIgPSBsYXN0Q2hhciA+PSAwICYmXG4gICAgKGlzTWRBc2NpaVB1bmN0KGxhc3RDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGxhc3RDaGFyKSkpO1xuICBpc05leHRQdW5jdENoYXIgPSBuZXh0Q2hhciA+PSAwICYmXG4gICAgKGlzTWRBc2NpaVB1bmN0KG5leHRDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKG5leHRDaGFyKSkpO1xuICBpc0xhc3RXaGl0ZVNwYWNlID0gbGFzdENoYXIgPj0gMCAmJiBpc1doaXRlU3BhY2UobGFzdENoYXIpO1xuICBpc05leHRXaGl0ZVNwYWNlID0gbmV4dENoYXIgPj0gMCAmJiBpc1doaXRlU3BhY2UobmV4dENoYXIpO1xuXG4gIGlmIChpc05leHRXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX29wZW4gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc05leHRQdW5jdENoYXIpIHtcbiAgICBpZiAoIShpc0xhc3RXaGl0ZVNwYWNlIHx8IGlzTGFzdFB1bmN0Q2hhciB8fCBsYXN0Q2hhciA9PT0gLTEpKSB7XG4gICAgICBjYW5fb3BlbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0xhc3RXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX2Nsb3NlID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNMYXN0UHVuY3RDaGFyKSB7XG4gICAgaWYgKCEoaXNOZXh0V2hpdGVTcGFjZSB8fCBpc05leHRQdW5jdENoYXIgfHwgbmV4dENoYXIgPT09IC0xKSkge1xuICAgICAgY2FuX2Nsb3NlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjYW5fb3BlbjogY2FuX29wZW4sXG4gICAgY2FuX2Nsb3NlOiBjYW5fY2xvc2UsXG4gICAgZGVsaW1zOiBjb3VudFxuICB9O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyaWtldGhyb3VnaChzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBzdGFydENvdW50LFxuICAgICAgY291bnQsXG4gICAgICB0YWdDb3VudCxcbiAgICAgIGZvdW5kLFxuICAgICAgc3RhY2ssXG4gICAgICByZXMsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBzdGFydCA9IHN0YXRlLnBvcyxcbiAgICAgIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0KTtcblxuICBpZiAobWFya2VyICE9PSAweDdFLyogfiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gZG9uJ3QgcnVuIGFueSBwYWlycyBpbiB2YWxpZGF0aW9uIG1vZGVcblxuICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCk7XG4gIHN0YXJ0Q291bnQgPSByZXMuZGVsaW1zO1xuICBpZiAoIXJlcy5jYW5fb3Blbikge1xuICAgIHN0YXRlLnBvcyArPSBzdGFydENvdW50O1xuICAgIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG4gICAgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHN0YXRlLnBvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGFjayA9IE1hdGguZmxvb3Ioc3RhcnRDb3VudCAvIDIpO1xuICBpZiAoc3RhY2sgPD0gMCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgc3RhdGUucG9zID0gc3RhcnQgKyBzdGFydENvdW50O1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKSA9PT0gbWFya2VyKSB7XG4gICAgICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGF0ZS5wb3MpO1xuICAgICAgY291bnQgPSByZXMuZGVsaW1zO1xuICAgICAgdGFnQ291bnQgPSBNYXRoLmZsb29yKGNvdW50IC8gMik7XG4gICAgICBpZiAocmVzLmNhbl9jbG9zZSkge1xuICAgICAgICBpZiAodGFnQ291bnQgPj0gc3RhY2spIHtcbiAgICAgICAgICBzdGF0ZS5wb3MgKz0gY291bnQgLSAyO1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdGFjayAtPSB0YWdDb3VudDtcbiAgICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcy5jYW5fb3BlbikgeyBzdGFjayArPSB0YWdDb3VudDsgfVxuICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc3RhdGUubWQuaW5saW5lLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kKSB7XG4gICAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kIGVuZGluZyB0YWcsIHNvIGl0J3Mgbm90IHZhbGlkIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZm91bmQhXG4gIHN0YXRlLnBvc01heCA9IHN0YXRlLnBvcztcbiAgc3RhdGUucG9zID0gc3RhcnQgKyAyO1xuXG4gIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG4gIHN0YXRlLnB1c2goeyB0eXBlOiAnc19vcGVuJywgbGV2ZWw6IHN0YXRlLmxldmVsKysgfSk7XG4gIHN0YXRlLm1kLmlubGluZS50b2tlbml6ZShzdGF0ZSk7XG4gIHN0YXRlLnB1c2goeyB0eXBlOiAnc19jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuXG4gIHN0YXRlLnBvcyA9IHN0YXRlLnBvc01heCArIDI7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gU2tpcCB0ZXh0IGNoYXJhY3RlcnMgZm9yIHRleHQgdG9rZW4sIHBsYWNlIHRob3NlIHRvIHBlbmRpbmcgYnVmZmVyXG4vLyBhbmQgaW5jcmVtZW50IGN1cnJlbnQgcG9zXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vLyBSdWxlIHRvIHNraXAgcHVyZSB0ZXh0XG4vLyAne30kJUB+Kz06JyByZXNlcnZlZCBmb3IgZXh0ZW50aW9uc1xuXG4vLyAhLCBcIiwgIywgJCwgJSwgJiwgJywgKCwgKSwgKiwgKywgLCwgLSwgLiwgLywgOiwgOywgPCwgPSwgPiwgPywgQCwgWywgXFwsIF0sIF4sIF8sIGAsIHssIHwsIH0sIG9yIH5cblxuLy8gISEhISBEb24ndCBjb25mdXNlIHdpdGggXCJNYXJrZG93biBBU0NJSSBQdW5jdHVhdGlvblwiIGNoYXJzXG4vLyBodHRwOi8vc3BlYy5jb21tb25tYXJrLm9yZy8wLjE1LyNhc2NpaS1wdW5jdHVhdGlvbi1jaGFyYWN0ZXJcbmZ1bmN0aW9uIGlzVGVybWluYXRvckNoYXIoY2gpIHtcbiAgc3dpdGNoIChjaCkge1xuICAgIGNhc2UgMHgwQS8qIFxcbiAqLzpcbiAgICBjYXNlIDB4MjEvKiAhICovOlxuICAgIGNhc2UgMHgyMy8qICMgKi86XG4gICAgY2FzZSAweDI0LyogJCAqLzpcbiAgICBjYXNlIDB4MjUvKiAlICovOlxuICAgIGNhc2UgMHgyNi8qICYgKi86XG4gICAgY2FzZSAweDJBLyogKiAqLzpcbiAgICBjYXNlIDB4MkIvKiArICovOlxuICAgIGNhc2UgMHgyRC8qIC0gKi86XG4gICAgY2FzZSAweDNBLyogOiAqLzpcbiAgICBjYXNlIDB4M0MvKiA8ICovOlxuICAgIGNhc2UgMHgzRC8qID0gKi86XG4gICAgY2FzZSAweDNFLyogPiAqLzpcbiAgICBjYXNlIDB4NDAvKiBAICovOlxuICAgIGNhc2UgMHg1Qi8qIFsgKi86XG4gICAgY2FzZSAweDVDLyogXFwgKi86XG4gICAgY2FzZSAweDVELyogXSAqLzpcbiAgICBjYXNlIDB4NUUvKiBeICovOlxuICAgIGNhc2UgMHg1Ri8qIF8gKi86XG4gICAgY2FzZSAweDYwLyogYCAqLzpcbiAgICBjYXNlIDB4N0IvKiB7ICovOlxuICAgIGNhc2UgMHg3RC8qIH0gKi86XG4gICAgY2FzZSAweDdFLyogfiAqLzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZXh0KHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIHBvcyA9IHN0YXRlLnBvcztcblxuICB3aGlsZSAocG9zIDwgc3RhdGUucG9zTWF4ICYmICFpc1Rlcm1pbmF0b3JDaGFyKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykpKSB7XG4gICAgcG9zKys7XG4gIH1cblxuICBpZiAocG9zID09PSBzdGF0ZS5wb3MpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhdGUucG9zLCBwb3MpOyB9XG5cbiAgc3RhdGUucG9zID0gcG9zO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gKHJvb3QucmV0dXJuRXhwb3J0c0dsb2JhbCA9IGZhY3RvcnkoKSk7XHJcbiAgICB9KTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XHJcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxyXG4gICAgLy8gbGlrZSBOb2RlLlxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJvb3RbJ0F1dG9saW5rZXInXSA9IGZhY3RvcnkoKTtcclxuICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKiFcclxuXHQgKiBBdXRvbGlua2VyLmpzXHJcblx0ICogMC4xNS4yXHJcblx0ICpcclxuXHQgKiBDb3B5cmlnaHQoYykgMjAxNSBHcmVnb3J5IEphY29icyA8Z3JlZ0BncmVnLWphY29icy5jb20+XHJcblx0ICogTUlUIExpY2Vuc2VkLiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdCAqXHJcblx0ICogaHR0cHM6Ly9naXRodWIuY29tL2dyZWdqYWNvYnMvQXV0b2xpbmtlci5qc1xyXG5cdCAqL1xyXG5cdC8qKlxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyXHJcblx0ICogQGV4dGVuZHMgT2JqZWN0XHJcblx0ICogXHJcblx0ICogVXRpbGl0eSBjbGFzcyB1c2VkIHRvIHByb2Nlc3MgYSBnaXZlbiBzdHJpbmcgb2YgdGV4dCwgYW5kIHdyYXAgdGhlIFVSTHMsIGVtYWlsIGFkZHJlc3NlcywgYW5kIFR3aXR0ZXIgaGFuZGxlcyBpbiBcclxuXHQgKiB0aGUgYXBwcm9wcmlhdGUgYW5jaG9yICgmbHQ7YSZndDspIHRhZ3MgdG8gdHVybiB0aGVtIGludG8gbGlua3MuXHJcblx0ICogXHJcblx0ICogQW55IG9mIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgbWF5IGJlIHByb3ZpZGVkIGluIGFuIE9iamVjdCAobWFwKSBwcm92aWRlZCB0byB0aGUgQXV0b2xpbmtlciBjb25zdHJ1Y3Rvciwgd2hpY2hcclxuXHQgKiB3aWxsIGNvbmZpZ3VyZSBob3cgdGhlIHtAbGluayAjbGluayBsaW5rKCl9IG1ldGhvZCB3aWxsIHByb2Nlc3MgdGhlIGxpbmtzLlxyXG5cdCAqIFxyXG5cdCAqIEZvciBleGFtcGxlOlxyXG5cdCAqIFxyXG5cdCAqICAgICB2YXIgYXV0b2xpbmtlciA9IG5ldyBBdXRvbGlua2VyKCB7XHJcblx0ICogICAgICAgICBuZXdXaW5kb3cgOiBmYWxzZSxcclxuXHQgKiAgICAgICAgIHRydW5jYXRlICA6IDMwXHJcblx0ICogICAgIH0gKTtcclxuXHQgKiAgICAgXHJcblx0ICogICAgIHZhciBodG1sID0gYXV0b2xpbmtlci5saW5rKCBcIkpvZSB3ZW50IHRvIHd3dy55YWhvby5jb21cIiApO1xyXG5cdCAqICAgICAvLyBwcm9kdWNlczogJ0pvZSB3ZW50IHRvIDxhIGhyZWY9XCJodHRwOi8vd3d3LnlhaG9vLmNvbVwiPnlhaG9vLmNvbTwvYT4nXHJcblx0ICogXHJcblx0ICogXHJcblx0ICogVGhlIHtAbGluayAjc3RhdGljLWxpbmsgc3RhdGljIGxpbmsoKX0gbWV0aG9kIG1heSBhbHNvIGJlIHVzZWQgdG8gaW5saW5lIG9wdGlvbnMgaW50byBhIHNpbmdsZSBjYWxsLCB3aGljaCBtYXlcclxuXHQgKiBiZSBtb3JlIGNvbnZlbmllbnQgZm9yIG9uZS1vZmYgdXNlcy4gRm9yIGV4YW1wbGU6XHJcblx0ICogXHJcblx0ICogICAgIHZhciBodG1sID0gQXV0b2xpbmtlci5saW5rKCBcIkpvZSB3ZW50IHRvIHd3dy55YWhvby5jb21cIiwge1xyXG5cdCAqICAgICAgICAgbmV3V2luZG93IDogZmFsc2UsXHJcblx0ICogICAgICAgICB0cnVuY2F0ZSAgOiAzMFxyXG5cdCAqICAgICB9ICk7XHJcblx0ICogICAgIC8vIHByb2R1Y2VzOiAnSm9lIHdlbnQgdG8gPGEgaHJlZj1cImh0dHA6Ly93d3cueWFob28uY29tXCI+eWFob28uY29tPC9hPidcclxuXHQgKiBcclxuXHQgKiBcclxuXHQgKiAjIyBDdXN0b20gUmVwbGFjZW1lbnRzIG9mIExpbmtzXHJcblx0ICogXHJcblx0ICogSWYgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBkbyBub3QgcHJvdmlkZSBlbm91Z2ggZmxleGliaWxpdHksIGEge0BsaW5rICNyZXBsYWNlRm59IG1heSBiZSBwcm92aWRlZCB0byBmdWxseSBjdXN0b21pemVcclxuXHQgKiB0aGUgb3V0cHV0IG9mIEF1dG9saW5rZXIuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uY2UgZm9yIGVhY2ggVVJML0VtYWlsL1R3aXR0ZXIgaGFuZGxlIG1hdGNoIHRoYXQgaXMgZW5jb3VudGVyZWQuXHJcblx0ICogXHJcblx0ICogRm9yIGV4YW1wbGU6XHJcblx0ICogXHJcblx0ICogICAgIHZhciBpbnB1dCA9IFwiLi4uXCI7ICAvLyBzdHJpbmcgd2l0aCBVUkxzLCBFbWFpbCBBZGRyZXNzZXMsIGFuZCBUd2l0dGVyIEhhbmRsZXNcclxuXHQgKiAgICAgXHJcblx0ICogICAgIHZhciBsaW5rZWRUZXh0ID0gQXV0b2xpbmtlci5saW5rKCBpbnB1dCwge1xyXG5cdCAqICAgICAgICAgcmVwbGFjZUZuIDogZnVuY3Rpb24oIGF1dG9saW5rZXIsIG1hdGNoICkge1xyXG5cdCAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImhyZWYgPSBcIiwgbWF0Y2guZ2V0QW5jaG9ySHJlZigpICk7XHJcblx0ICogICAgICAgICAgICAgY29uc29sZS5sb2coIFwidGV4dCA9IFwiLCBtYXRjaC5nZXRBbmNob3JUZXh0KCkgKTtcclxuXHQgKiAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgIHN3aXRjaCggbWF0Y2guZ2V0VHlwZSgpICkge1xyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICd1cmwnIDogXHJcblx0ICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ1cmw6IFwiLCBtYXRjaC5nZXRVcmwoKSApO1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgICAgICAgICBpZiggbWF0Y2guZ2V0VXJsKCkuaW5kZXhPZiggJ215c2l0ZS5jb20nICkgPT09IC0xICkge1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YWcgPSBhdXRvbGlua2VyLmdldFRhZ0J1aWxkZXIoKS5idWlsZCggbWF0Y2ggKTsgIC8vIHJldHVybnMgYW4gYEF1dG9saW5rZXIuSHRtbFRhZ2AgaW5zdGFuY2UsIHdoaWNoIHByb3ZpZGVzIG11dGF0b3IgbWV0aG9kcyBmb3IgZWFzeSBjaGFuZ2VzXHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgdGFnLnNldEF0dHIoICdyZWwnLCAnbm9mb2xsb3cnICk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgdGFnLmFkZENsYXNzKCAnZXh0ZXJuYWwtbGluaycgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnO1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgIC8vIGxldCBBdXRvbGlua2VyIHBlcmZvcm0gaXRzIG5vcm1hbCBhbmNob3IgdGFnIHJlcGxhY2VtZW50XHJcblx0ICogICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgY2FzZSAnZW1haWwnIDpcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIHZhciBlbWFpbCA9IG1hdGNoLmdldEVtYWlsKCk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJlbWFpbDogXCIsIGVtYWlsICk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIGlmKCBlbWFpbCA9PT0gXCJteUBvd24uYWRkcmVzc1wiICkge1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgIC8vIGRvbid0IGF1dG8tbGluayB0aGlzIHBhcnRpY3VsYXIgZW1haWwgYWRkcmVzczsgbGVhdmUgYXMtaXNcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgLy8gbm8gcmV0dXJuIHZhbHVlIHdpbGwgaGF2ZSBBdXRvbGlua2VyIHBlcmZvcm0gaXRzIG5vcm1hbCBhbmNob3IgdGFnIHJlcGxhY2VtZW50IChzYW1lIGFzIHJldHVybmluZyBgdHJ1ZWApXHJcblx0ICogICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICogICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICd0d2l0dGVyJyA6XHJcblx0ICogICAgICAgICAgICAgICAgICAgICB2YXIgdHdpdHRlckhhbmRsZSA9IG1hdGNoLmdldFR3aXR0ZXJIYW5kbGUoKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB0d2l0dGVySGFuZGxlICk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cImh0dHA6Ly9uZXdwbGFjZS50by5saW5rLnR3aXR0ZXIuaGFuZGxlcy50by9cIj4nICsgdHdpdHRlckhhbmRsZSArICc8L2E+JztcclxuXHQgKiAgICAgICAgICAgICB9XHJcblx0ICogICAgICAgICB9XHJcblx0ICogICAgIH0gKTtcclxuXHQgKiBcclxuXHQgKiBcclxuXHQgKiBUaGUgZnVuY3Rpb24gbWF5IHJldHVybiB0aGUgZm9sbG93aW5nIHZhbHVlczpcclxuXHQgKiBcclxuXHQgKiAtIGB0cnVlYCAoQm9vbGVhbik6IEFsbG93IEF1dG9saW5rZXIgdG8gcmVwbGFjZSB0aGUgbWF0Y2ggYXMgaXQgbm9ybWFsbHkgd291bGQuXHJcblx0ICogLSBgZmFsc2VgIChCb29sZWFuKTogRG8gbm90IHJlcGxhY2UgdGhlIGN1cnJlbnQgbWF0Y2ggYXQgYWxsIC0gbGVhdmUgYXMtaXMuXHJcblx0ICogLSBBbnkgU3RyaW5nOiBJZiBhIHN0cmluZyBpcyByZXR1cm5lZCBmcm9tIHRoZSBmdW5jdGlvbiwgdGhlIHN0cmluZyB3aWxsIGJlIHVzZWQgZGlyZWN0bHkgYXMgdGhlIHJlcGxhY2VtZW50IEhUTUwgZm9yXHJcblx0ICogICB0aGUgbWF0Y2guXHJcblx0ICogLSBBbiB7QGxpbmsgQXV0b2xpbmtlci5IdG1sVGFnfSBpbnN0YW5jZSwgd2hpY2ggY2FuIGJlIHVzZWQgdG8gYnVpbGQvbW9kaWZ5IGFuIEhUTUwgdGFnIGJlZm9yZSB3cml0aW5nIG91dCBpdHMgSFRNTCB0ZXh0LlxyXG5cdCAqIFxyXG5cdCAqIEBjb25zdHJ1Y3RvclxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgQXV0b2xpbmtlciBpbnN0YW5jZSwgc3BlY2lmaWVkIGluIGFuIE9iamVjdCAobWFwKS5cclxuXHQgKi9cclxuXHR2YXIgQXV0b2xpbmtlciA9IGZ1bmN0aW9uKCBjZmcgKSB7XHJcblx0XHRBdXRvbGlua2VyLlV0aWwuYXNzaWduKCB0aGlzLCBjZmcgKTsgIC8vIGFzc2lnbiB0aGUgcHJvcGVydGllcyBvZiBgY2ZnYCBvbnRvIHRoZSBBdXRvbGlua2VyIGluc3RhbmNlLiBQcm90b3R5cGUgcHJvcGVydGllcyB3aWxsIGJlIHVzZWQgZm9yIG1pc3NpbmcgY29uZmlncy5cclxuXHJcblx0XHR0aGlzLm1hdGNoVmFsaWRhdG9yID0gbmV3IEF1dG9saW5rZXIuTWF0Y2hWYWxpZGF0b3IoKTtcclxuXHR9O1xyXG5cclxuXHJcblx0QXV0b2xpbmtlci5wcm90b3R5cGUgPSB7XHJcblx0XHRjb25zdHJ1Y3RvciA6IEF1dG9saW5rZXIsICAvLyBmaXggY29uc3RydWN0b3IgcHJvcGVydHlcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IHVybHNcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmIG1pc2NlbGxhbmVvdXMgVVJMcyBzaG91bGQgYmUgYXV0b21hdGljYWxseSBsaW5rZWQsIGBmYWxzZWAgaWYgdGhleSBzaG91bGQgbm90IGJlLlxyXG5cdFx0ICovXHJcblx0XHR1cmxzIDogdHJ1ZSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IGVtYWlsXHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiBlbWFpbCBhZGRyZXNzZXMgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgbGlua2VkLCBgZmFsc2VgIGlmIHRoZXkgc2hvdWxkIG5vdCBiZS5cclxuXHRcdCAqL1xyXG5cdFx0ZW1haWwgOiB0cnVlLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gdHdpdHRlclxyXG5cdFx0ICogXHJcblx0XHQgKiBgdHJ1ZWAgaWYgVHdpdHRlciBoYW5kbGVzIChcIkBleGFtcGxlXCIpIHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IGxpbmtlZCwgYGZhbHNlYCBpZiB0aGV5IHNob3VsZCBub3QgYmUuXHJcblx0XHQgKi9cclxuXHRcdHR3aXR0ZXIgOiB0cnVlLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gbmV3V2luZG93XHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiB0aGUgbGlua3Mgc2hvdWxkIG9wZW4gaW4gYSBuZXcgd2luZG93LCBgZmFsc2VgIG90aGVyd2lzZS5cclxuXHRcdCAqL1xyXG5cdFx0bmV3V2luZG93IDogdHJ1ZSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IHN0cmlwUHJlZml4XHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiAnaHR0cDovLycgb3IgJ2h0dHBzOi8vJyBhbmQvb3IgdGhlICd3d3cuJyBzaG91bGQgYmUgc3RyaXBwZWQgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIFVSTCBsaW5rcycgdGV4dCwgXHJcblx0XHQgKiBgZmFsc2VgIG90aGVyd2lzZS5cclxuXHRcdCAqL1xyXG5cdFx0c3RyaXBQcmVmaXggOiB0cnVlLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7TnVtYmVyfSB0cnVuY2F0ZVxyXG5cdFx0ICogXHJcblx0XHQgKiBBIG51bWJlciBmb3IgaG93IG1hbnkgY2hhcmFjdGVycyBsb25nIFVSTHMvZW1haWxzL3R3aXR0ZXIgaGFuZGxlcyBzaG91bGQgYmUgdHJ1bmNhdGVkIHRvIGluc2lkZSB0aGUgdGV4dCBvZiBcclxuXHRcdCAqIGEgbGluay4gSWYgdGhlIFVSTC9lbWFpbC90d2l0dGVyIGlzIG92ZXIgdGhpcyBudW1iZXIgb2YgY2hhcmFjdGVycywgaXQgd2lsbCBiZSB0cnVuY2F0ZWQgdG8gdGhpcyBsZW5ndGggYnkgXHJcblx0XHQgKiBhZGRpbmcgYSB0d28gcGVyaW9kIGVsbGlwc2lzICgnLi4nKSB0byB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEZvciBleGFtcGxlOiBBIHVybCBsaWtlICdodHRwOi8vd3d3LnlhaG9vLmNvbS9zb21lL2xvbmcvcGF0aC90by9hL2ZpbGUnIHRydW5jYXRlZCB0byAyNSBjaGFyYWN0ZXJzIG1pZ2h0IGxvb2tcclxuXHRcdCAqIHNvbWV0aGluZyBsaWtlIHRoaXM6ICd5YWhvby5jb20vc29tZS9sb25nL3BhdC4uJ1xyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IGNsYXNzTmFtZVxyXG5cdFx0ICogXHJcblx0XHQgKiBBIENTUyBjbGFzcyBuYW1lIHRvIGFkZCB0byB0aGUgZ2VuZXJhdGVkIGxpbmtzLiBUaGlzIGNsYXNzIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGxpbmtzLCBhcyB3ZWxsIGFzIHRoaXMgY2xhc3NcclxuXHRcdCAqIHBsdXMgdXJsL2VtYWlsL3R3aXR0ZXIgc3VmZml4ZXMgZm9yIHN0eWxpbmcgdXJsL2VtYWlsL3R3aXR0ZXIgbGlua3MgZGlmZmVyZW50bHkuXHJcblx0XHQgKiBcclxuXHRcdCAqIEZvciBleGFtcGxlLCBpZiB0aGlzIGNvbmZpZyBpcyBwcm92aWRlZCBhcyBcIm15TGlua1wiLCB0aGVuOlxyXG5cdFx0ICogXHJcblx0XHQgKiAtIFVSTCBsaW5rcyB3aWxsIGhhdmUgdGhlIENTUyBjbGFzc2VzOiBcIm15TGluayBteUxpbmstdXJsXCJcclxuXHRcdCAqIC0gRW1haWwgbGlua3Mgd2lsbCBoYXZlIHRoZSBDU1MgY2xhc3NlczogXCJteUxpbmsgbXlMaW5rLWVtYWlsXCIsIGFuZFxyXG5cdFx0ICogLSBUd2l0dGVyIGxpbmtzIHdpbGwgaGF2ZSB0aGUgQ1NTIGNsYXNzZXM6IFwibXlMaW5rIG15TGluay10d2l0dGVyXCJcclxuXHRcdCAqL1xyXG5cdFx0Y2xhc3NOYW1lIDogXCJcIixcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Z1bmN0aW9ufSByZXBsYWNlRm5cclxuXHRcdCAqIFxyXG5cdFx0ICogQSBmdW5jdGlvbiB0byBpbmRpdmlkdWFsbHkgcHJvY2VzcyBlYWNoIFVSTC9FbWFpbC9Ud2l0dGVyIG1hdGNoIGZvdW5kIGluIHRoZSBpbnB1dCBzdHJpbmcuXHJcblx0XHQgKiBcclxuXHRcdCAqIFNlZSB0aGUgY2xhc3MncyBkZXNjcmlwdGlvbiBmb3IgdXNhZ2UuXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxyXG5cdFx0ICogXHJcblx0XHQgKiBAY2ZnIHtBdXRvbGlua2VyfSByZXBsYWNlRm4uYXV0b2xpbmtlciBUaGUgQXV0b2xpbmtlciBpbnN0YW5jZSwgd2hpY2ggbWF5IGJlIHVzZWQgdG8gcmV0cmlldmUgY2hpbGQgb2JqZWN0cyBmcm9tIChzdWNoXHJcblx0XHQgKiAgIGFzIHRoZSBpbnN0YW5jZSdzIHtAbGluayAjZ2V0VGFnQnVpbGRlciB0YWcgYnVpbGRlcn0pLlxyXG5cdFx0ICogQGNmZyB7QXV0b2xpbmtlci5tYXRjaC5NYXRjaH0gcmVwbGFjZUZuLm1hdGNoIFRoZSBNYXRjaCBpbnN0YW5jZSB3aGljaCBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSBpbmZvcm1hdGlvbiBhYm91dCB0aGVcclxuXHRcdCAqICAge0BsaW5rIEF1dG9saW5rZXIubWF0Y2guVXJsIFVSTH0ve0BsaW5rIEF1dG9saW5rZXIubWF0Y2guRW1haWwgZW1haWx9L3tAbGluayBBdXRvbGlua2VyLm1hdGNoLlR3aXR0ZXIgVHdpdHRlcn1cclxuXHRcdCAqICAgbWF0Y2ggdGhhdCB0aGUgYHJlcGxhY2VGbmAgaXMgY3VycmVudGx5IHByb2Nlc3NpbmcuXHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGh0bWxDaGFyYWN0ZXJFbnRpdGllc1JlZ2V4XHJcblx0XHQgKlxyXG5cdFx0ICogVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgY29tbW9uIEhUTUwgY2hhcmFjdGVyIGVudGl0aWVzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBJZ25vcmluZyAmYW1wOyBhcyBpdCBjb3VsZCBiZSBwYXJ0IG9mIGEgcXVlcnkgc3RyaW5nIC0tIGhhbmRsaW5nIGl0IHNlcGFyYXRlbHkuXHJcblx0XHQgKi9cclxuXHRcdGh0bWxDaGFyYWN0ZXJFbnRpdGllc1JlZ2V4OiAvKCZuYnNwO3wmIzE2MDt8Jmx0O3wmIzYwO3wmZ3Q7fCYjNjI7fCZxdW90O3wmIzM0O3wmIzM5OykvZ2ksXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtSZWdFeHB9IG1hdGNoZXJSZWdleFxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBVUkxzLCBlbWFpbCBhZGRyZXNzZXMsIGFuZCBUd2l0dGVyIGhhbmRsZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgcmVndWxhciBleHByZXNzaW9uIGhhcyB0aGUgZm9sbG93aW5nIGNhcHR1cmluZyBncm91cHM6XHJcblx0XHQgKiBcclxuXHRcdCAqIDEuIEdyb3VwIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlcmUgaXMgYSBUd2l0dGVyIGhhbmRsZSBtYXRjaCAoaS5lLiBcXEBzb21lVHdpdHRlclVzZXIpLiBTaW1wbHkgY2hlY2sgZm9yIGl0cyBcclxuXHRcdCAqICAgIGV4aXN0ZW5jZSB0byBkZXRlcm1pbmUgaWYgdGhlcmUgaXMgYSBUd2l0dGVyIGhhbmRsZSBtYXRjaC4gVGhlIG5leHQgY291cGxlIG9mIGNhcHR1cmluZyBncm91cHMgZ2l2ZSBpbmZvcm1hdGlvbiBcclxuXHRcdCAqICAgIGFib3V0IHRoZSBUd2l0dGVyIGhhbmRsZSBtYXRjaC5cclxuXHRcdCAqIDIuIFRoZSB3aGl0ZXNwYWNlIGNoYXJhY3RlciBiZWZvcmUgdGhlIFxcQHNpZ24gaW4gYSBUd2l0dGVyIGhhbmRsZS4gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSB0aGVyZSBhcmUgbm8gbG9va2JlaGluZHMgaW5cclxuXHRcdCAqICAgIEpTIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGFuZCBjYW4gYmUgdXNlZCB0byByZWNvbnN0cnVjdCB0aGUgb3JpZ2luYWwgc3RyaW5nIGluIGEgcmVwbGFjZSgpLlxyXG5cdFx0ICogMy4gVGhlIFR3aXR0ZXIgaGFuZGxlIGl0c2VsZiBpbiBhIFR3aXR0ZXIgbWF0Y2guIElmIHRoZSBtYXRjaCBpcyAnQHNvbWVUd2l0dGVyVXNlcicsIHRoZSBoYW5kbGUgaXMgJ3NvbWVUd2l0dGVyVXNlcicuXHJcblx0XHQgKiA0LiBHcm91cCB0aGF0IG1hdGNoZXMgYW4gZW1haWwgYWRkcmVzcy4gVXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlIG1hdGNoIGlzIGFuIGVtYWlsIGFkZHJlc3MsIGFzIHdlbGwgYXMgaG9sZGluZyB0aGUgZnVsbCBcclxuXHRcdCAqICAgIGFkZHJlc3MuIEV4OiAnbWVAbXkuY29tJ1xyXG5cdFx0ICogNS4gR3JvdXAgdGhhdCBtYXRjaGVzIGEgVVJMIGluIHRoZSBpbnB1dCB0ZXh0LiBFeDogJ2h0dHA6Ly9nb29nbGUuY29tJywgJ3d3dy5nb29nbGUuY29tJywgb3IganVzdCAnZ29vZ2xlLmNvbScuXHJcblx0XHQgKiAgICBUaGlzIGFsc28gaW5jbHVkZXMgYSBwYXRoLCB1cmwgcGFyYW1ldGVycywgb3IgaGFzaCBhbmNob3JzLiBFeDogZ29vZ2xlLmNvbS9wYXRoL3RvL2ZpbGU/cTE9MSZxMj0yI215QW5jaG9yXHJcblx0XHQgKiA2LiBHcm91cCB0aGF0IG1hdGNoZXMgYSBwcm90b2NvbCBVUkwgKGkuZS4gJ2h0dHA6Ly9nb29nbGUuY29tJykuIFRoaXMgaXMgdXNlZCB0byBtYXRjaCBwcm90b2NvbCBVUkxzIHdpdGgganVzdCBhIHNpbmdsZVxyXG5cdFx0ICogICAgd29yZCwgbGlrZSAnaHR0cDovL2xvY2FsaG9zdCcsIHdoZXJlIHdlIHdvbid0IGRvdWJsZSBjaGVjayB0aGF0IHRoZSBkb21haW4gbmFtZSBoYXMgYXQgbGVhc3Qgb25lICcuJyBpbiBpdC5cclxuXHRcdCAqIDcuIEEgcHJvdG9jb2wtcmVsYXRpdmUgKCcvLycpIG1hdGNoIGZvciB0aGUgY2FzZSBvZiBhICd3d3cuJyBwcmVmaXhlZCBVUkwuIFdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGlmIGl0IGlzIG5vdCBhIFxyXG5cdFx0ICogICAgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2guIFdlIG5lZWQgdG8ga25vdyB0aGUgY2hhcmFjdGVyIGJlZm9yZSB0aGUgJy8vJyBpbiBvcmRlciB0byBkZXRlcm1pbmUgaWYgaXQgaXMgYSB2YWxpZCBtYXRjaFxyXG5cdFx0ICogICAgb3IgdGhlIC8vIHdhcyBpbiBhIHN0cmluZyB3ZSBkb24ndCB3YW50IHRvIGF1dG8tbGluay5cclxuXHRcdCAqIDguIEEgcHJvdG9jb2wtcmVsYXRpdmUgKCcvLycpIG1hdGNoIGZvciB0aGUgY2FzZSBvZiBhIGtub3duIFRMRCBwcmVmaXhlZCBVUkwuIFdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGlmIGl0IGlzIG5vdCBhIFxyXG5cdFx0ICogICAgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2guIFNlZSAjNiBmb3IgbW9yZSBpbmZvLiBcclxuXHRcdCAqL1xyXG5cdFx0bWF0Y2hlclJlZ2V4IDogKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdHdpdHRlclJlZ2V4ID0gLyhefFteXFx3XSlAKFxcd3sxLDE1fSkvLCAgICAgICAgICAgICAgLy8gRm9yIG1hdGNoaW5nIGEgdHdpdHRlciBoYW5kbGUuIEV4OiBAZ3JlZ29yeV9qYWNvYnNcclxuXHJcblx0XHRcdCAgICBlbWFpbFJlZ2V4ID0gLyg/OltcXC07OiY9XFwrXFwkLFxcd1xcLl0rQCkvLCAgICAgICAgICAgICAvLyBzb21ldGhpbmdAIGZvciBlbWFpbCBhZGRyZXNzZXMgKGEuay5hLiBsb2NhbC1wYXJ0KVxyXG5cclxuXHRcdFx0ICAgIHByb3RvY29sUmVnZXggPSAvKD86W0EtWmEtel1bLS4rQS1aYS16MC05XSs6KD8hW0EtWmEtel1bLS4rQS1aYS16MC05XSs6XFwvXFwvKSg/IVxcZCtcXC8/KSg/OlxcL1xcLyk/KS8sICAvLyBtYXRjaCBwcm90b2NvbCwgYWxsb3cgaW4gZm9ybWF0IFwiaHR0cDovL1wiIG9yIFwibWFpbHRvOlwiLiBIb3dldmVyLCBkbyBub3QgbWF0Y2ggdGhlIGZpcnN0IHBhcnQgb2Ygc29tZXRoaW5nIGxpa2UgJ2xpbms6aHR0cDovL3d3dy5nb29nbGUuY29tJyAoaS5lLiBkb24ndCBtYXRjaCBcImxpbms6XCIpLiBBbHNvLCBtYWtlIHN1cmUgd2UgZG9uJ3QgaW50ZXJwcmV0ICdnb29nbGUuY29tOjgwMDAnIGFzIGlmICdnb29nbGUuY29tJyB3YXMgYSBwcm90b2NvbCBoZXJlIChpLmUuIGlnbm9yZSBhIHRyYWlsaW5nIHBvcnQgbnVtYmVyIGluIHRoaXMgcmVnZXgpXHJcblx0XHRcdCAgICB3d3dSZWdleCA9IC8oPzp3d3dcXC4pLywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0YXJ0aW5nIHdpdGggJ3d3dy4nXHJcblx0XHRcdCAgICBkb21haW5OYW1lUmVnZXggPSAvW0EtWmEtejAtOVxcLlxcLV0qW0EtWmEtejAtOVxcLV0vLCAgLy8gYW55dGhpbmcgbG9va2luZyBhdCBhbGwgbGlrZSBhIGRvbWFpbiwgbm9uLXVuaWNvZGUgZG9tYWlucywgbm90IGVuZGluZyBpbiBhIHBlcmlvZFxyXG5cdFx0XHQgICAgdGxkUmVnZXggPSAvXFwuKD86aW50ZXJuYXRpb25hbHxjb25zdHJ1Y3Rpb258Y29udHJhY3RvcnN8ZW50ZXJwcmlzZXN8cGhvdG9ncmFwaHl8cHJvZHVjdGlvbnN8Zm91bmRhdGlvbnxpbW1vYmlsaWVufGluZHVzdHJpZXN8bWFuYWdlbWVudHxwcm9wZXJ0aWVzfHRlY2hub2xvZ3l8Y2hyaXN0bWFzfGNvbW11bml0eXxkaXJlY3Rvcnl8ZWR1Y2F0aW9ufGVxdWlwbWVudHxpbnN0aXR1dGV8bWFya2V0aW5nfHNvbHV0aW9uc3x2YWNhdGlvbnN8YmFyZ2FpbnN8Ym91dGlxdWV8YnVpbGRlcnN8Y2F0ZXJpbmd8Y2xlYW5pbmd8Y2xvdGhpbmd8Y29tcHV0ZXJ8ZGVtb2NyYXR8ZGlhbW9uZHN8Z3JhcGhpY3N8aG9sZGluZ3N8bGlnaHRpbmd8cGFydG5lcnN8cGx1bWJpbmd8c3VwcGxpZXN8dHJhaW5pbmd8dmVudHVyZXN8YWNhZGVteXxjYXJlZXJzfGNvbXBhbnl8Y3J1aXNlc3xkb21haW5zfGV4cG9zZWR8ZmxpZ2h0c3xmbG9yaXN0fGdhbGxlcnl8Z3VpdGFyc3xob2xpZGF5fGtpdGNoZW58bmV1c3Rhcnxva2luYXdhfHJlY2lwZXN8cmVudGFsc3xyZXZpZXdzfHNoaWtzaGF8c2luZ2xlc3xzdXBwb3J0fHN5c3RlbXN8YWdlbmN5fGJlcmxpbnxjYW1lcmF8Y2VudGVyfGNvZmZlZXxjb25kb3N8ZGF0aW5nfGVzdGF0ZXxldmVudHN8ZXhwZXJ0fGZ1dGJvbHxrYXVmZW58bHV4dXJ5fG1haXNvbnxtb25hc2h8bXVzZXVtfG5hZ295YXxwaG90b3N8cmVwYWlyfHJlcG9ydHxzb2NpYWx8c3VwcGx5fHRhdHRvb3x0aWVuZGF8dHJhdmVsfHZpYWplc3x2aWxsYXN8dmlzaW9ufHZvdGluZ3x2b3lhZ2V8YWN0b3J8YnVpbGR8Y2FyZHN8Y2hlYXB8Y29kZXN8ZGFuY2V8ZW1haWx8Z2xhc3N8aG91c2V8bWFuZ298bmluamF8cGFydHN8cGhvdG98c2hvZXN8c29sYXJ8dG9kYXl8dG9reW98dG9vbHN8d2F0Y2h8d29ya3N8YWVyb3xhcnBhfGFzaWF8YmVzdHxiaWtlfGJsdWV8YnV6enxjYW1wfGNsdWJ8Y29vbHxjb29wfGZhcm18ZmlzaHxnaWZ0fGd1cnV8aW5mb3xqb2JzfGtpd2l8a3JlZHxsYW5kfGxpbW98bGlua3xtZW51fG1vYml8bW9kYXxuYW1lfHBpY3N8cGlua3xwb3N0fHFwb258cmljaHxydWhyfHNleHl8dGlwc3x2b3RlfHZvdG98d2FuZ3x3aWVufHdpa2l8em9uZXxiYXJ8YmlkfGJpenxjYWJ8Y2F0fGNlb3xjb218ZWR1fGdvdnxpbnR8a2ltfG1pbHxuZXR8b25sfG9yZ3xwcm98cHVifHJlZHx0ZWx8dW5vfHdlZHx4eHh8eHl6fGFjfGFkfGFlfGFmfGFnfGFpfGFsfGFtfGFufGFvfGFxfGFyfGFzfGF0fGF1fGF3fGF4fGF6fGJhfGJifGJkfGJlfGJmfGJnfGJofGJpfGJqfGJtfGJufGJvfGJyfGJzfGJ0fGJ2fGJ3fGJ5fGJ6fGNhfGNjfGNkfGNmfGNnfGNofGNpfGNrfGNsfGNtfGNufGNvfGNyfGN1fGN2fGN3fGN4fGN5fGN6fGRlfGRqfGRrfGRtfGRvfGR6fGVjfGVlfGVnfGVyfGVzfGV0fGV1fGZpfGZqfGZrfGZtfGZvfGZyfGdhfGdifGdkfGdlfGdmfGdnfGdofGdpfGdsfGdtfGdufGdwfGdxfGdyfGdzfGd0fGd1fGd3fGd5fGhrfGhtfGhufGhyfGh0fGh1fGlkfGllfGlsfGltfGlufGlvfGlxfGlyfGlzfGl0fGplfGptfGpvfGpwfGtlfGtnfGtofGtpfGttfGtufGtwfGtyfGt3fGt5fGt6fGxhfGxifGxjfGxpfGxrfGxyfGxzfGx0fGx1fGx2fGx5fG1hfG1jfG1kfG1lfG1nfG1ofG1rfG1sfG1tfG1ufG1vfG1wfG1xfG1yfG1zfG10fG11fG12fG13fG14fG15fG16fG5hfG5jfG5lfG5mfG5nfG5pfG5sfG5vfG5wfG5yfG51fG56fG9tfHBhfHBlfHBmfHBnfHBofHBrfHBsfHBtfHBufHByfHBzfHB0fHB3fHB5fHFhfHJlfHJvfHJzfHJ1fHJ3fHNhfHNifHNjfHNkfHNlfHNnfHNofHNpfHNqfHNrfHNsfHNtfHNufHNvfHNyfHN0fHN1fHN2fHN4fHN5fHN6fHRjfHRkfHRmfHRnfHRofHRqfHRrfHRsfHRtfHRufHRvfHRwfHRyfHR0fHR2fHR3fHR6fHVhfHVnfHVrfHVzfHV5fHV6fHZhfHZjfHZlfHZnfHZpfHZufHZ1fHdmfHdzfHllfHl0fHphfHptfHp3KVxcYi8sICAgLy8gbWF0Y2ggb3VyIGtub3duIHRvcCBsZXZlbCBkb21haW5zIChUTERzKVxyXG5cclxuXHRcdFx0ICAgIC8vIEFsbG93IG9wdGlvbmFsIHBhdGgsIHF1ZXJ5IHN0cmluZywgYW5kIGhhc2ggYW5jaG9yLCBub3QgZW5kaW5nIGluIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyczogXCI/ITosLjtcIlxyXG5cdFx0XHQgICAgLy8gaHR0cDovL2Jsb2cuY29kaW5naG9ycm9yLmNvbS90aGUtcHJvYmxlbS13aXRoLXVybHMvXHJcblx0XHRcdCAgICB1cmxTdWZmaXhSZWdleCA9IC9bXFwtQS1aYS16MC05KyZAI1xcLyU9fl8oKXwnJCpcXFtcXF0/ITosLjtdKltcXC1BLVphLXowLTkrJkAjXFwvJT1+XygpfCckKlxcW1xcXV0vO1xyXG5cclxuXHRcdFx0cmV0dXJuIG5ldyBSZWdFeHAoIFtcclxuXHRcdFx0XHQnKCcsICAvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQxLCB3aGljaCBjYW4gYmUgdXNlZCB0byBjaGVjayBmb3IgYSB0d2l0dGVyIGhhbmRsZSBtYXRjaC4gVXNlIGdyb3VwICQzIGZvciB0aGUgYWN0dWFsIHR3aXR0ZXIgaGFuZGxlIHRob3VnaC4gJDIgbWF5IGJlIHVzZWQgdG8gcmVjb25zdHJ1Y3QgdGhlIG9yaWdpbmFsIHN0cmluZyBpbiBhIHJlcGxhY2UoKSBcclxuXHRcdFx0XHRcdC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDIsIHdoaWNoIG1hdGNoZXMgdGhlIHdoaXRlc3BhY2UgY2hhcmFjdGVyIGJlZm9yZSB0aGUgJ0AnIHNpZ24gKG5lZWRlZCBiZWNhdXNlIG9mIG5vIGxvb2tiZWhpbmRzKSwgYW5kIFxyXG5cdFx0XHRcdFx0Ly8gKioqIENhcHR1cmluZyBncm91cCAkMywgd2hpY2ggbWF0Y2hlcyB0aGUgYWN0dWFsIHR3aXR0ZXIgaGFuZGxlXHJcblx0XHRcdFx0XHR0d2l0dGVyUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdCcpJyxcclxuXHJcblx0XHRcdFx0J3wnLFxyXG5cclxuXHRcdFx0XHQnKCcsICAvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQ0LCB3aGljaCBpcyB1c2VkIHRvIGRldGVybWluZSBhbiBlbWFpbCBtYXRjaFxyXG5cdFx0XHRcdFx0ZW1haWxSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRkb21haW5OYW1lUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdFx0dGxkUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdCcpJyxcclxuXHJcblx0XHRcdFx0J3wnLFxyXG5cclxuXHRcdFx0XHQnKCcsICAvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQ1LCB3aGljaCBpcyB1c2VkIHRvIG1hdGNoIGEgVVJMXHJcblx0XHRcdFx0XHQnKD86JywgLy8gcGFyZW5zIHRvIGNvdmVyIG1hdGNoIGZvciBwcm90b2NvbCAob3B0aW9uYWwpLCBhbmQgZG9tYWluXHJcblx0XHRcdFx0XHRcdCcoJywgIC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDYsIGZvciBhIHByb3RvY29sLXByZWZpeGVkIHVybCAoZXg6IGh0dHA6Ly9nb29nbGUuY29tKVxyXG5cdFx0XHRcdFx0XHRcdHByb3RvY29sUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdFx0XHRcdGRvbWFpbk5hbWVSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRcdCcpJyxcclxuXHJcblx0XHRcdFx0XHRcdCd8JyxcclxuXHJcblx0XHRcdFx0XHRcdCcoPzonLCAgLy8gbm9uLWNhcHR1cmluZyBwYXJlbiBmb3IgYSAnd3d3LicgcHJlZml4ZWQgdXJsIChleDogd3d3Lmdvb2dsZS5jb20pXHJcblx0XHRcdFx0XHRcdFx0JyguPy8vKT8nLCAgLy8gKioqIENhcHR1cmluZyBncm91cCAkNyBmb3IgYW4gb3B0aW9uYWwgcHJvdG9jb2wtcmVsYXRpdmUgVVJMLiBNdXN0IGJlIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZyBvciBzdGFydCB3aXRoIGEgbm9uLXdvcmQgY2hhcmFjdGVyXHJcblx0XHRcdFx0XHRcdFx0d3d3UmVnZXguc291cmNlLFxyXG5cdFx0XHRcdFx0XHRcdGRvbWFpbk5hbWVSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRcdCcpJyxcclxuXHJcblx0XHRcdFx0XHRcdCd8JyxcclxuXHJcblx0XHRcdFx0XHRcdCcoPzonLCAgLy8gbm9uLWNhcHR1cmluZyBwYXJlbiBmb3Iga25vd24gYSBUTEQgdXJsIChleDogZ29vZ2xlLmNvbSlcclxuXHRcdFx0XHRcdFx0XHQnKC4/Ly8pPycsICAvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQ4IGZvciBhbiBvcHRpb25hbCBwcm90b2NvbC1yZWxhdGl2ZSBVUkwuIE11c3QgYmUgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nIG9yIHN0YXJ0IHdpdGggYSBub24td29yZCBjaGFyYWN0ZXJcclxuXHRcdFx0XHRcdFx0XHRkb21haW5OYW1lUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdFx0XHRcdHRsZFJlZ2V4LnNvdXJjZSxcclxuXHRcdFx0XHRcdFx0JyknLFxyXG5cdFx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHRcdCcoPzonICsgdXJsU3VmZml4UmVnZXguc291cmNlICsgJyk/JywgIC8vIG1hdGNoIGZvciBwYXRoLCBxdWVyeSBzdHJpbmcsIGFuZC9vciBoYXNoIGFuY2hvciAtIG9wdGlvbmFsXHJcblx0XHRcdFx0JyknXHJcblx0XHRcdF0uam9pbiggXCJcIiApLCAnZ2knICk7XHJcblx0XHR9ICkoKSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gY2hhckJlZm9yZVByb3RvY29sUmVsTWF0Y2hSZWdleFxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgcmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gcmV0cmlldmUgdGhlIGNoYXJhY3RlciBiZWZvcmUgYSBwcm90b2NvbC1yZWxhdGl2ZSBVUkwgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgaXMgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSB7QGxpbmsgI21hdGNoZXJSZWdleH0sIHdoaWNoIG5lZWRzIHRvIGdyYWIgdGhlIGNoYXJhY3RlciBiZWZvcmUgYSBwcm90b2NvbC1yZWxhdGl2ZVxyXG5cdFx0ICogJy8vJyBkdWUgdG8gdGhlIGxhY2sgb2YgYSBuZWdhdGl2ZSBsb29rLWJlaGluZCBpbiBKYXZhU2NyaXB0IHJlZ3VsYXIgZXhwcmVzc2lvbnMuIFRoZSBjaGFyYWN0ZXIgYmVmb3JlIHRoZSBtYXRjaCBpcyBzdHJpcHBlZFxyXG5cdFx0ICogZnJvbSB0aGUgVVJMLlxyXG5cdFx0ICovXHJcblx0XHRjaGFyQmVmb3JlUHJvdG9jb2xSZWxNYXRjaFJlZ2V4IDogL14oLik/XFwvXFwvLyxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge0F1dG9saW5rZXIuTWF0Y2hWYWxpZGF0b3J9IG1hdGNoVmFsaWRhdG9yXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSBNYXRjaFZhbGlkYXRvciBvYmplY3QsIHVzZWQgdG8gZmlsdGVyIG91dCBhbnkgZmFsc2UgcG9zaXRpdmVzIGZyb20gdGhlIHtAbGluayAjbWF0Y2hlclJlZ2V4fS4gU2VlXHJcblx0XHQgKiB7QGxpbmsgQXV0b2xpbmtlci5NYXRjaFZhbGlkYXRvcn0gZm9yIGRldGFpbHMuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge0F1dG9saW5rZXIuSHRtbFBhcnNlcn0gaHRtbFBhcnNlclxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgSHRtbFBhcnNlciBpbnN0YW5jZSB1c2VkIHRvIHNraXAgb3ZlciBIVE1MIHRhZ3MsIHdoaWxlIGZpbmRpbmcgdGV4dCBub2RlcyB0byBwcm9jZXNzLiBUaGlzIGlzIGxhemlseSBpbnN0YW50aWF0ZWRcclxuXHRcdCAqIGluIHRoZSB7QGxpbmsgI2dldEh0bWxQYXJzZXJ9IG1ldGhvZC5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7QXV0b2xpbmtlci5BbmNob3JUYWdCdWlsZGVyfSB0YWdCdWlsZGVyXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSBBbmNob3JUYWdCdWlsZGVyIGluc3RhbmNlIHVzZWQgdG8gYnVpbGQgdGhlIFVSTC9lbWFpbC9Ud2l0dGVyIHJlcGxhY2VtZW50IGFuY2hvciB0YWdzLiBUaGlzIGlzIGxhemlseSBpbnN0YW50aWF0ZWRcclxuXHRcdCAqIGluIHRoZSB7QGxpbmsgI2dldFRhZ0J1aWxkZXJ9IG1ldGhvZC5cclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEF1dG9tYXRpY2FsbHkgbGlua3MgVVJMcywgZW1haWwgYWRkcmVzc2VzLCBhbmQgVHdpdHRlciBoYW5kbGVzIGZvdW5kIGluIHRoZSBnaXZlbiBjaHVuayBvZiBIVE1MLiBcclxuXHRcdCAqIERvZXMgbm90IGxpbmsgVVJMcyBmb3VuZCB3aXRoaW4gSFRNTCB0YWdzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBGb3IgaW5zdGFuY2UsIGlmIGdpdmVuIHRoZSB0ZXh0OiBgWW91IHNob3VsZCBnbyB0byBodHRwOi8vd3d3LnlhaG9vLmNvbWAsIHRoZW4gdGhlIHJlc3VsdFxyXG5cdFx0ICogd2lsbCBiZSBgWW91IHNob3VsZCBnbyB0byAmbHQ7YSBocmVmPVwiaHR0cDovL3d3dy55YWhvby5jb21cIiZndDtodHRwOi8vd3d3LnlhaG9vLmNvbSZsdDsvYSZndDtgXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgbWV0aG9kIGZpbmRzIHRoZSB0ZXh0IGFyb3VuZCBhbnkgSFRNTCBlbGVtZW50cyBpbiB0aGUgaW5wdXQgYHRleHRPckh0bWxgLCB3aGljaCB3aWxsIGJlIHRoZSB0ZXh0IHRoYXQgaXMgcHJvY2Vzc2VkLlxyXG5cdFx0ICogQW55IG9yaWdpbmFsIEhUTUwgZWxlbWVudHMgd2lsbCBiZSBsZWZ0IGFzLWlzLCBhcyB3ZWxsIGFzIHRoZSB0ZXh0IHRoYXQgaXMgYWxyZWFkeSB3cmFwcGVkIGluIGFuY2hvciAoJmx0O2EmZ3Q7KSB0YWdzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dE9ySHRtbCBUaGUgSFRNTCBvciB0ZXh0IHRvIGxpbmsgVVJMcywgZW1haWwgYWRkcmVzc2VzLCBhbmQgVHdpdHRlciBoYW5kbGVzIHdpdGhpbiAoZGVwZW5kaW5nIG9uIGlmXHJcblx0XHQgKiAgIHRoZSB7QGxpbmsgI3VybHN9LCB7QGxpbmsgI2VtYWlsfSwgYW5kIHtAbGluayAjdHdpdHRlcn0gb3B0aW9ucyBhcmUgZW5hYmxlZCkuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBIVE1MLCB3aXRoIFVSTHMvZW1haWxzL1R3aXR0ZXIgaGFuZGxlcyBhdXRvbWF0aWNhbGx5IGxpbmtlZC5cclxuXHRcdCAqL1xyXG5cdFx0bGluayA6IGZ1bmN0aW9uKCB0ZXh0T3JIdG1sICkge1xyXG5cdFx0XHR2YXIgbWUgPSB0aGlzLCAgLy8gZm9yIGNsb3N1cmVcclxuXHRcdFx0ICAgIGh0bWxQYXJzZXIgPSB0aGlzLmdldEh0bWxQYXJzZXIoKSxcclxuXHRcdFx0ICAgIGh0bWxDaGFyYWN0ZXJFbnRpdGllc1JlZ2V4ID0gdGhpcy5odG1sQ2hhcmFjdGVyRW50aXRpZXNSZWdleCxcclxuXHRcdFx0ICAgIGFuY2hvclRhZ1N0YWNrQ291bnQgPSAwLCAgLy8gdXNlZCB0byBvbmx5IHByb2Nlc3MgdGV4dCBhcm91bmQgYW5jaG9yIHRhZ3MsIGFuZCBhbnkgaW5uZXIgdGV4dC9odG1sIHRoZXkgbWF5IGhhdmVcclxuXHRcdFx0ICAgIHJlc3VsdEh0bWwgPSBbXTtcclxuXHJcblx0XHRcdGh0bWxQYXJzZXIucGFyc2UoIHRleHRPckh0bWwsIHtcclxuXHRcdFx0XHQvLyBQcm9jZXNzIEhUTUwgbm9kZXMgaW4gdGhlIGlucHV0IGB0ZXh0T3JIdG1sYFxyXG5cdFx0XHRcdHByb2Nlc3NIdG1sTm9kZSA6IGZ1bmN0aW9uKCB0YWdUZXh0LCB0YWdOYW1lLCBpc0Nsb3NpbmdUYWcgKSB7XHJcblx0XHRcdFx0XHRpZiggdGFnTmFtZSA9PT0gJ2EnICkge1xyXG5cdFx0XHRcdFx0XHRpZiggIWlzQ2xvc2luZ1RhZyApIHsgIC8vIGl0J3MgdGhlIHN0YXJ0IDxhPiB0YWdcclxuXHRcdFx0XHRcdFx0XHRhbmNob3JUYWdTdGFja0NvdW50Kys7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7ICAgLy8gaXQncyB0aGUgZW5kIDwvYT4gdGFnXHJcblx0XHRcdFx0XHRcdFx0YW5jaG9yVGFnU3RhY2tDb3VudCA9IE1hdGgubWF4KCBhbmNob3JUYWdTdGFja0NvdW50IC0gMSwgMCApOyAgLy8gYXR0ZW1wdCB0byBoYW5kbGUgZXh0cmFuZW91cyA8L2E+IHRhZ3MgYnkgbWFraW5nIHN1cmUgdGhlIHN0YWNrIGNvdW50IG5ldmVyIGdvZXMgYmVsb3cgMFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXN1bHRIdG1sLnB1c2goIHRhZ1RleHQgKTsgIC8vIG5vdyBhZGQgdGhlIHRleHQgb2YgdGhlIHRhZyBpdHNlbGYgdmVyYmF0aW1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHQvLyBQcm9jZXNzIHRleHQgbm9kZXMgaW4gdGhlIGlucHV0IGB0ZXh0T3JIdG1sYFxyXG5cdFx0XHRcdHByb2Nlc3NUZXh0Tm9kZSA6IGZ1bmN0aW9uKCB0ZXh0ICkge1xyXG5cdFx0XHRcdFx0aWYoIGFuY2hvclRhZ1N0YWNrQ291bnQgPT09IDAgKSB7XHJcblx0XHRcdFx0XHRcdC8vIElmIHdlJ3JlIG5vdCB3aXRoaW4gYW4gPGE+IHRhZywgcHJvY2VzcyB0aGUgdGV4dCBub2RlXHJcblx0XHRcdFx0XHRcdHZhciB1bmVzY2FwZWRUZXh0ID0gQXV0b2xpbmtlci5VdGlsLnNwbGl0QW5kQ2FwdHVyZSggdGV4dCwgaHRtbENoYXJhY3RlckVudGl0aWVzUmVnZXggKTsgIC8vIHNwbGl0IGF0IEhUTUwgZW50aXRpZXMsIGJ1dCBpbmNsdWRlIHRoZSBIVE1MIGVudGl0aWVzIGluIHRoZSByZXN1bHRzIGFycmF5XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGxlbiA9IHVuZXNjYXBlZFRleHQubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRleHRUb1Byb2Nlc3MgPSB1bmVzY2FwZWRUZXh0WyBpIF0sXHJcblx0XHRcdFx0XHRcdFx0ICAgIHByb2Nlc3NlZFRleHROb2RlID0gbWUucHJvY2Vzc1RleHROb2RlKCB0ZXh0VG9Qcm9jZXNzICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdEh0bWwucHVzaCggcHJvY2Vzc2VkVGV4dE5vZGUgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGB0ZXh0YCBpcyB3aXRoaW4gYW4gPGE+IHRhZywgc2ltcGx5IGFwcGVuZCB0aGUgdGV4dCAtIHdlIGRvIG5vdCB3YW50IHRvIGF1dG9saW5rIGFueXRoaW5nIFxyXG5cdFx0XHRcdFx0XHQvLyBhbHJlYWR5IHdpdGhpbiBhbiA8YT4uLi48L2E+IHRhZ1xyXG5cdFx0XHRcdFx0XHRyZXN1bHRIdG1sLnB1c2goIHRleHQgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdHJldHVybiByZXN1bHRIdG1sLmpvaW4oIFwiXCIgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogTGF6aWx5IGluc3RhbnRpYXRlcyBhbmQgcmV0dXJucyB0aGUge0BsaW5rICNodG1sUGFyc2VyfSBpbnN0YW5jZSBmb3IgdGhpcyBBdXRvbGlua2VyIGluc3RhbmNlLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLkh0bWxQYXJzZXJ9XHJcblx0XHQgKi9cclxuXHRcdGdldEh0bWxQYXJzZXIgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGh0bWxQYXJzZXIgPSB0aGlzLmh0bWxQYXJzZXI7XHJcblxyXG5cdFx0XHRpZiggIWh0bWxQYXJzZXIgKSB7XHJcblx0XHRcdFx0aHRtbFBhcnNlciA9IHRoaXMuaHRtbFBhcnNlciA9IG5ldyBBdXRvbGlua2VyLkh0bWxQYXJzZXIoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGh0bWxQYXJzZXI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIHtAbGluayAjdGFnQnVpbGRlcn0gaW5zdGFuY2UgZm9yIHRoaXMgQXV0b2xpbmtlciBpbnN0YW5jZSwgbGF6aWx5IGluc3RhbnRpYXRpbmcgaXRcclxuXHRcdCAqIGlmIGl0IGRvZXMgbm90IHlldCBleGlzdC5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBtZXRob2QgbWF5IGJlIHVzZWQgaW4gYSB7QGxpbmsgI3JlcGxhY2VGbn0gdG8gZ2VuZXJhdGUgdGhlIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWcgSHRtbFRhZ30gaW5zdGFuY2UgdGhhdCBcclxuXHRcdCAqIEF1dG9saW5rZXIgd291bGQgbm9ybWFsbHkgZ2VuZXJhdGUsIGFuZCB0aGVuIGFsbG93IGZvciBtb2RpZmljYXRpb25zIGJlZm9yZSByZXR1cm5pbmcgaXQuIEZvciBleGFtcGxlOlxyXG5cdFx0ICogXHJcblx0XHQgKiAgICAgdmFyIGh0bWwgPSBBdXRvbGlua2VyLmxpbmsoIFwiVGVzdCBnb29nbGUuY29tXCIsIHtcclxuXHRcdCAqICAgICAgICAgcmVwbGFjZUZuIDogZnVuY3Rpb24oIGF1dG9saW5rZXIsIG1hdGNoICkge1xyXG5cdFx0ICogICAgICAgICAgICAgdmFyIHRhZyA9IGF1dG9saW5rZXIuZ2V0VGFnQnVpbGRlcigpLmJ1aWxkKCBtYXRjaCApOyAgLy8gcmV0dXJucyBhbiB7QGxpbmsgQXV0b2xpbmtlci5IdG1sVGFnfSBpbnN0YW5jZVxyXG5cdFx0ICogICAgICAgICAgICAgdGFnLnNldEF0dHIoICdyZWwnLCAnbm9mb2xsb3cnICk7XHJcblx0XHQgKiAgICAgICAgICAgICBcclxuXHRcdCAqICAgICAgICAgICAgIHJldHVybiB0YWc7XHJcblx0XHQgKiAgICAgICAgIH1cclxuXHRcdCAqICAgICB9ICk7XHJcblx0XHQgKiAgICAgXHJcblx0XHQgKiAgICAgLy8gZ2VuZXJhdGVkIGh0bWw6XHJcblx0XHQgKiAgICAgLy8gICBUZXN0IDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vZm9sbG93XCI+Z29vZ2xlLmNvbTwvYT5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5BbmNob3JUYWdCdWlsZGVyfVxyXG5cdFx0ICovXHJcblx0XHRnZXRUYWdCdWlsZGVyIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0YWdCdWlsZGVyID0gdGhpcy50YWdCdWlsZGVyO1xyXG5cclxuXHRcdFx0aWYoICF0YWdCdWlsZGVyICkge1xyXG5cdFx0XHRcdHRhZ0J1aWxkZXIgPSB0aGlzLnRhZ0J1aWxkZXIgPSBuZXcgQXV0b2xpbmtlci5BbmNob3JUYWdCdWlsZGVyKCB7XHJcblx0XHRcdFx0XHRuZXdXaW5kb3cgICA6IHRoaXMubmV3V2luZG93LFxyXG5cdFx0XHRcdFx0dHJ1bmNhdGUgICAgOiB0aGlzLnRydW5jYXRlLFxyXG5cdFx0XHRcdFx0Y2xhc3NOYW1lICAgOiB0aGlzLmNsYXNzTmFtZVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRhZ0J1aWxkZXI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFByb2Nlc3MgdGhlIHRleHQgdGhhdCBsaWVzIGluYmV0d2VlbiBIVE1MIHRhZ3MuIFRoaXMgbWV0aG9kIGRvZXMgdGhlIGFjdHVhbCB3cmFwcGluZyBvZiBVUkxzIHdpdGhcclxuXHRcdCAqIGFuY2hvciB0YWdzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gYXV0by1saW5rLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBUaGUgdGV4dCB3aXRoIGFuY2hvciB0YWdzIGF1dG8tZmlsbGVkLlxyXG5cdFx0ICovXHJcblx0XHRwcm9jZXNzVGV4dE5vZGUgOiBmdW5jdGlvbiggdGV4dCApIHtcclxuXHRcdFx0dmFyIG1lID0gdGhpczsgIC8vIGZvciBjbG9zdXJlXHJcblxyXG5cdFx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKCB0aGlzLm1hdGNoZXJSZWdleCwgZnVuY3Rpb24oIG1hdGNoU3RyLCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNywgJDggKSB7XHJcblx0XHRcdFx0dmFyIG1hdGNoRGVzY09iaiA9IG1lLnByb2Nlc3NDYW5kaWRhdGVNYXRjaCggbWF0Y2hTdHIsICQxLCAkMiwgJDMsICQ0LCAkNSwgJDYsICQ3LCAkOCApOyAgLy8gbWF0Y2ggZGVzY3JpcHRpb24gb2JqZWN0XHJcblxyXG5cdFx0XHRcdC8vIFJldHVybiBvdXQgd2l0aCBubyBjaGFuZ2VzIGZvciBtYXRjaCB0eXBlcyB0aGF0IGFyZSBkaXNhYmxlZCAodXJsLCBlbWFpbCwgdHdpdHRlciksIG9yIGZvciBtYXRjaGVzIHRoYXQgYXJlIFxyXG5cdFx0XHRcdC8vIGludmFsaWQgKGZhbHNlIHBvc2l0aXZlcyBmcm9tIHRoZSBtYXRjaGVyUmVnZXgsIHdoaWNoIGNhbid0IHVzZSBsb29rLWJlaGluZHMgc2luY2UgdGhleSBhcmUgdW5hdmFpbGFibGUgaW4gSlMpLlxyXG5cdFx0XHRcdGlmKCAhbWF0Y2hEZXNjT2JqICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoU3RyO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gR2VuZXJhdGUgdGhlIHJlcGxhY2VtZW50IHRleHQgZm9yIHRoZSBtYXRjaFxyXG5cdFx0XHRcdFx0dmFyIG1hdGNoUmV0dXJuVmFsID0gbWUuY3JlYXRlTWF0Y2hSZXR1cm5WYWwoIG1hdGNoRGVzY09iai5tYXRjaCwgbWF0Y2hEZXNjT2JqLm1hdGNoU3RyICk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hEZXNjT2JqLnByZWZpeFN0ciArIG1hdGNoUmV0dXJuVmFsICsgbWF0Y2hEZXNjT2JqLnN1ZmZpeFN0cjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUHJvY2Vzc2VzIGEgY2FuZGlkYXRlIG1hdGNoIGZyb20gdGhlIHtAbGluayAjbWF0Y2hlclJlZ2V4fS4gXHJcblx0XHQgKiBcclxuXHRcdCAqIE5vdCBhbGwgbWF0Y2hlcyBmb3VuZCBieSB0aGUgcmVnZXggYXJlIGFjdHVhbCBVUkwvZW1haWwvVHdpdHRlciBtYXRjaGVzLCBhcyBkZXRlcm1pbmVkIGJ5IHRoZSB7QGxpbmsgI21hdGNoVmFsaWRhdG9yfS4gSW5cclxuXHRcdCAqIHRoaXMgY2FzZSwgdGhlIG1ldGhvZCByZXR1cm5zIGBudWxsYC4gT3RoZXJ3aXNlLCBhIHZhbGlkIE9iamVjdCB3aXRoIGBwcmVmaXhTdHJgLCBgbWF0Y2hgLCBhbmQgYHN1ZmZpeFN0cmAgaXMgcmV0dXJuZWQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbWF0Y2hTdHIgVGhlIGZ1bGwgbWF0Y2ggdGhhdCB3YXMgZm91bmQgYnkgdGhlIHtAbGluayAjbWF0Y2hlclJlZ2V4fS5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0d2l0dGVyTWF0Y2ggVGhlIG1hdGNoZWQgdGV4dCBvZiBhIFR3aXR0ZXIgaGFuZGxlLCBpZiB0aGUgbWF0Y2ggaXMgYSBUd2l0dGVyIG1hdGNoLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR3aXR0ZXJIYW5kbGVQcmVmaXhXaGl0ZXNwYWNlQ2hhciBUaGUgd2hpdGVzcGFjZSBjaGFyIGJlZm9yZSB0aGUgQCBzaWduIGluIGEgVHdpdHRlciBoYW5kbGUgbWF0Y2guIFRoaXMgXHJcblx0XHQgKiAgIGlzIG5lZWRlZCBiZWNhdXNlIG9mIG5vIGxvb2tiZWhpbmRzIGluIEpTIHJlZ2V4ZXMsIGFuZCBpcyBuZWVkIHRvIHJlLWluY2x1ZGUgdGhlIGNoYXJhY3RlciBmb3IgdGhlIGFuY2hvciB0YWcgcmVwbGFjZW1lbnQuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHdpdHRlckhhbmRsZSBUaGUgYWN0dWFsIFR3aXR0ZXIgdXNlciAoaS5lIHRoZSB3b3JkIGFmdGVyIHRoZSBAIHNpZ24gaW4gYSBUd2l0dGVyIG1hdGNoKS5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBlbWFpbEFkZHJlc3NNYXRjaCBUaGUgbWF0Y2hlZCBlbWFpbCBhZGRyZXNzIGZvciBhbiBlbWFpbCBhZGRyZXNzIG1hdGNoLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHVybE1hdGNoIFRoZSBtYXRjaGVkIFVSTCBzdHJpbmcgZm9yIGEgVVJMIG1hdGNoLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sVXJsTWF0Y2ggVGhlIG1hdGNoIFVSTCBzdHJpbmcgZm9yIGEgcHJvdG9jb2wgbWF0Y2guIEV4OiAnaHR0cDovL3lhaG9vLmNvbScuIFRoaXMgaXMgdXNlZCB0byBtYXRjaFxyXG5cdFx0ICogICBzb21ldGhpbmcgbGlrZSAnaHR0cDovL2xvY2FsaG9zdCcsIHdoZXJlIHdlIHdvbid0IGRvdWJsZSBjaGVjayB0aGF0IHRoZSBkb21haW4gbmFtZSBoYXMgYXQgbGVhc3Qgb25lICcuJyBpbiBpdC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB3d3dQcm90b2NvbFJlbGF0aXZlTWF0Y2ggVGhlICcvLycgZm9yIGEgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2ggZnJvbSBhICd3d3cnIHVybCwgd2l0aCB0aGUgY2hhcmFjdGVyIHRoYXQgXHJcblx0XHQgKiAgIGNvbWVzIGJlZm9yZSB0aGUgJy8vJy5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0bGRQcm90b2NvbFJlbGF0aXZlTWF0Y2ggVGhlICcvLycgZm9yIGEgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2ggZnJvbSBhIFRMRCAodG9wIGxldmVsIGRvbWFpbikgbWF0Y2gsIHdpdGggXHJcblx0XHQgKiAgIHRoZSBjaGFyYWN0ZXIgdGhhdCBjb21lcyBiZWZvcmUgdGhlICcvLycuXHJcblx0XHQgKiAgIFxyXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBBIFwibWF0Y2ggZGVzY3JpcHRpb24gb2JqZWN0XCIuIFRoaXMgd2lsbCBiZSBgbnVsbGAgaWYgdGhlIG1hdGNoIHdhcyBpbnZhbGlkLCBvciBpZiBhIG1hdGNoIHR5cGUgaXMgZGlzYWJsZWQuXHJcblx0XHQgKiAgIE90aGVyd2lzZSwgdGhpcyB3aWxsIGJlIGFuIE9iamVjdCAobWFwKSB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJuLnByZWZpeFN0ciBUaGUgY2hhcihzKSB0aGF0IHNob3VsZCBiZSBwcmVwZW5kZWQgdG8gdGhlIHJlcGxhY2VtZW50IHN0cmluZy4gVGhlc2UgYXJlIGNoYXIocykgdGhhdFxyXG5cdFx0ICogICB3ZXJlIG5lZWRlZCB0byBiZSBpbmNsdWRlZCBmcm9tIHRoZSByZWdleCBtYXRjaCB0aGF0IHdlcmUgaWdub3JlZCBieSBwcm9jZXNzaW5nIGNvZGUsIGFuZCBzaG91bGQgYmUgcmUtaW5zZXJ0ZWQgaW50byBcclxuXHRcdCAqICAgdGhlIHJlcGxhY2VtZW50IHN0cmVhbS5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJuLnN1ZmZpeFN0ciBUaGUgY2hhcihzKSB0aGF0IHNob3VsZCBiZSBhcHBlbmRlZCB0byB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLiBUaGVzZSBhcmUgY2hhcihzKSB0aGF0XHJcblx0XHQgKiAgIHdlcmUgbmVlZGVkIHRvIGJlIGluY2x1ZGVkIGZyb20gdGhlIHJlZ2V4IG1hdGNoIHRoYXQgd2VyZSBpZ25vcmVkIGJ5IHByb2Nlc3NpbmcgY29kZSwgYW5kIHNob3VsZCBiZSByZS1pbnNlcnRlZCBpbnRvIFxyXG5cdFx0ICogICB0aGUgcmVwbGFjZW1lbnQgc3RyZWFtLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSByZXR1cm4ubWF0Y2hTdHIgVGhlIGBtYXRjaFN0cmAsIGZpeGVkIHVwIHRvIHJlbW92ZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vIGxvbmdlciBuZWVkZWQgKHdoaWNoIGhhdmUgYmVlblxyXG5cdFx0ICogICBhZGRlZCB0byBgcHJlZml4U3RyYCBhbmQgYHN1ZmZpeFN0cmApLlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5tYXRjaC5NYXRjaH0gcmV0dXJuLm1hdGNoIFRoZSBNYXRjaCBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBtYXRjaCB0aGF0IHdhcyBmb3VuZC5cclxuXHRcdCAqL1xyXG5cdFx0cHJvY2Vzc0NhbmRpZGF0ZU1hdGNoIDogZnVuY3Rpb24oIFxyXG5cdFx0XHRtYXRjaFN0ciwgdHdpdHRlck1hdGNoLCB0d2l0dGVySGFuZGxlUHJlZml4V2hpdGVzcGFjZUNoYXIsIHR3aXR0ZXJIYW5kbGUsIFxyXG5cdFx0XHRlbWFpbEFkZHJlc3NNYXRjaCwgdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2gsIHd3d1Byb3RvY29sUmVsYXRpdmVNYXRjaCwgdGxkUHJvdG9jb2xSZWxhdGl2ZU1hdGNoXHJcblx0XHQpIHtcclxuXHRcdFx0dmFyIHByb3RvY29sUmVsYXRpdmVNYXRjaCA9IHd3d1Byb3RvY29sUmVsYXRpdmVNYXRjaCB8fCB0bGRQcm90b2NvbFJlbGF0aXZlTWF0Y2gsXHJcblx0XHRcdCAgICBtYXRjaCwgIC8vIFdpbGwgYmUgYW4gQXV0b2xpbmtlci5tYXRjaC5NYXRjaCBvYmplY3RcclxuXHJcblx0XHRcdCAgICBwcmVmaXhTdHIgPSBcIlwiLCAgICAgICAvLyBBIHN0cmluZyB0byB1c2UgdG8gcHJlZml4IHRoZSBhbmNob3IgdGFnIHRoYXQgaXMgY3JlYXRlZC4gVGhpcyBpcyBuZWVkZWQgZm9yIHRoZSBUd2l0dGVyIGhhbmRsZSBtYXRjaFxyXG5cdFx0XHQgICAgc3VmZml4U3RyID0gXCJcIjsgICAgICAgLy8gQSBzdHJpbmcgdG8gc3VmZml4IHRoZSBhbmNob3IgdGFnIHRoYXQgaXMgY3JlYXRlZC4gVGhpcyBpcyB1c2VkIGlmIHRoZXJlIGlzIGEgdHJhaWxpbmcgcGFyZW50aGVzaXMgdGhhdCBzaG91bGQgbm90IGJlIGF1dG8tbGlua2VkLlxyXG5cclxuXHJcblx0XHRcdC8vIFJldHVybiBvdXQgd2l0aCBgbnVsbGAgZm9yIG1hdGNoIHR5cGVzIHRoYXQgYXJlIGRpc2FibGVkICh1cmwsIGVtYWlsLCB0d2l0dGVyKSwgb3IgZm9yIG1hdGNoZXMgdGhhdCBhcmUgXHJcblx0XHRcdC8vIGludmFsaWQgKGZhbHNlIHBvc2l0aXZlcyBmcm9tIHRoZSBtYXRjaGVyUmVnZXgsIHdoaWNoIGNhbid0IHVzZSBsb29rLWJlaGluZHMgc2luY2UgdGhleSBhcmUgdW5hdmFpbGFibGUgaW4gSlMpLlxyXG5cdFx0XHRpZihcclxuXHRcdFx0XHQoIHR3aXR0ZXJNYXRjaCAmJiAhdGhpcy50d2l0dGVyICkgfHwgKCBlbWFpbEFkZHJlc3NNYXRjaCAmJiAhdGhpcy5lbWFpbCApIHx8ICggdXJsTWF0Y2ggJiYgIXRoaXMudXJscyApIHx8XHJcblx0XHRcdFx0IXRoaXMubWF0Y2hWYWxpZGF0b3IuaXNWYWxpZE1hdGNoKCB1cmxNYXRjaCwgcHJvdG9jb2xVcmxNYXRjaCwgcHJvdG9jb2xSZWxhdGl2ZU1hdGNoICkgXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBIYW5kbGUgYSBjbG9zaW5nIHBhcmVudGhlc2lzIGF0IHRoZSBlbmQgb2YgdGhlIG1hdGNoLCBhbmQgZXhjbHVkZSBpdCBpZiB0aGVyZSBpcyBub3QgYSBtYXRjaGluZyBvcGVuIHBhcmVudGhlc2lzXHJcblx0XHRcdC8vIGluIHRoZSBtYXRjaCBpdHNlbGYuIFxyXG5cdFx0XHRpZiggdGhpcy5tYXRjaEhhc1VuYmFsYW5jZWRDbG9zaW5nUGFyZW4oIG1hdGNoU3RyICkgKSB7XHJcblx0XHRcdFx0bWF0Y2hTdHIgPSBtYXRjaFN0ci5zdWJzdHIoIDAsIG1hdGNoU3RyLmxlbmd0aCAtIDEgKTsgIC8vIHJlbW92ZSB0aGUgdHJhaWxpbmcgXCIpXCJcclxuXHRcdFx0XHRzdWZmaXhTdHIgPSBcIilcIjsgIC8vIHRoaXMgd2lsbCBiZSBhZGRlZCBhZnRlciB0aGUgZ2VuZXJhdGVkIDxhPiB0YWdcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdGlmKCBlbWFpbEFkZHJlc3NNYXRjaCApIHtcclxuXHRcdFx0XHRtYXRjaCA9IG5ldyBBdXRvbGlua2VyLm1hdGNoLkVtYWlsKCB7IG1hdGNoZWRUZXh0OiBtYXRjaFN0ciwgZW1haWw6IGVtYWlsQWRkcmVzc01hdGNoIH0gKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiggdHdpdHRlck1hdGNoICkge1xyXG5cdFx0XHRcdC8vIGZpeCB1cCB0aGUgYG1hdGNoU3RyYCBpZiB0aGVyZSB3YXMgYSBwcmVjZWRpbmcgd2hpdGVzcGFjZSBjaGFyLCB3aGljaCB3YXMgbmVlZGVkIHRvIGRldGVybWluZSB0aGUgbWF0Y2ggXHJcblx0XHRcdFx0Ly8gaXRzZWxmIChzaW5jZSB0aGVyZSBhcmUgbm8gbG9vay1iZWhpbmRzIGluIEpTIHJlZ2V4ZXMpXHJcblx0XHRcdFx0aWYoIHR3aXR0ZXJIYW5kbGVQcmVmaXhXaGl0ZXNwYWNlQ2hhciApIHtcclxuXHRcdFx0XHRcdHByZWZpeFN0ciA9IHR3aXR0ZXJIYW5kbGVQcmVmaXhXaGl0ZXNwYWNlQ2hhcjtcclxuXHRcdFx0XHRcdG1hdGNoU3RyID0gbWF0Y2hTdHIuc2xpY2UoIDEgKTsgIC8vIHJlbW92ZSB0aGUgcHJlZml4ZWQgd2hpdGVzcGFjZSBjaGFyIGZyb20gdGhlIG1hdGNoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG1hdGNoID0gbmV3IEF1dG9saW5rZXIubWF0Y2guVHdpdHRlciggeyBtYXRjaGVkVGV4dDogbWF0Y2hTdHIsIHR3aXR0ZXJIYW5kbGU6IHR3aXR0ZXJIYW5kbGUgfSApO1xyXG5cclxuXHRcdFx0fSBlbHNlIHsgIC8vIHVybCBtYXRjaFxyXG5cdFx0XHRcdC8vIElmIGl0J3MgYSBwcm90b2NvbC1yZWxhdGl2ZSAnLy8nIG1hdGNoLCByZW1vdmUgdGhlIGNoYXJhY3RlciBiZWZvcmUgdGhlICcvLycgKHdoaWNoIHRoZSBtYXRjaGVyUmVnZXggbmVlZGVkXHJcblx0XHRcdFx0Ly8gdG8gbWF0Y2ggZHVlIHRvIHRoZSBsYWNrIG9mIGEgbmVnYXRpdmUgbG9vay1iZWhpbmQgaW4gSmF2YVNjcmlwdCByZWd1bGFyIGV4cHJlc3Npb25zKVxyXG5cdFx0XHRcdGlmKCBwcm90b2NvbFJlbGF0aXZlTWF0Y2ggKSB7XHJcblx0XHRcdFx0XHR2YXIgY2hhckJlZm9yZU1hdGNoID0gcHJvdG9jb2xSZWxhdGl2ZU1hdGNoLm1hdGNoKCB0aGlzLmNoYXJCZWZvcmVQcm90b2NvbFJlbE1hdGNoUmVnZXggKVsgMSBdIHx8IFwiXCI7XHJcblxyXG5cdFx0XHRcdFx0aWYoIGNoYXJCZWZvcmVNYXRjaCApIHsgIC8vIGZpeCB1cCB0aGUgYG1hdGNoU3RyYCBpZiB0aGVyZSB3YXMgYSBwcmVjZWRpbmcgY2hhciBiZWZvcmUgYSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCwgd2hpY2ggd2FzIG5lZWRlZCB0byBkZXRlcm1pbmUgdGhlIG1hdGNoIGl0c2VsZiAoc2luY2UgdGhlcmUgYXJlIG5vIGxvb2stYmVoaW5kcyBpbiBKUyByZWdleGVzKVxyXG5cdFx0XHRcdFx0XHRwcmVmaXhTdHIgPSBjaGFyQmVmb3JlTWF0Y2g7XHJcblx0XHRcdFx0XHRcdG1hdGNoU3RyID0gbWF0Y2hTdHIuc2xpY2UoIDEgKTsgIC8vIHJlbW92ZSB0aGUgcHJlZml4ZWQgY2hhciBmcm9tIHRoZSBtYXRjaFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bWF0Y2ggPSBuZXcgQXV0b2xpbmtlci5tYXRjaC5VcmwoIHtcclxuXHRcdFx0XHRcdG1hdGNoZWRUZXh0IDogbWF0Y2hTdHIsXHJcblx0XHRcdFx0XHR1cmwgOiBtYXRjaFN0cixcclxuXHRcdFx0XHRcdHByb3RvY29sVXJsTWF0Y2ggOiAhIXByb3RvY29sVXJsTWF0Y2gsXHJcblx0XHRcdFx0XHRwcm90b2NvbFJlbGF0aXZlTWF0Y2ggOiAhIXByb3RvY29sUmVsYXRpdmVNYXRjaCxcclxuXHRcdFx0XHRcdHN0cmlwUHJlZml4IDogdGhpcy5zdHJpcFByZWZpeFxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRwcmVmaXhTdHIgOiBwcmVmaXhTdHIsXHJcblx0XHRcdFx0c3VmZml4U3RyIDogc3VmZml4U3RyLFxyXG5cdFx0XHRcdG1hdGNoU3RyICA6IG1hdGNoU3RyLFxyXG5cdFx0XHRcdG1hdGNoICAgICA6IG1hdGNoXHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERldGVybWluZXMgaWYgYSBtYXRjaCBmb3VuZCBoYXMgYW4gdW5tYXRjaGVkIGNsb3NpbmcgcGFyZW50aGVzaXMuIElmIHNvLCB0aGlzIHBhcmVudGhlc2lzIHdpbGwgYmUgcmVtb3ZlZFxyXG5cdFx0ICogZnJvbSB0aGUgbWF0Y2ggaXRzZWxmLCBhbmQgYXBwZW5kZWQgYWZ0ZXIgdGhlIGdlbmVyYXRlZCBhbmNob3IgdGFnIGluIHtAbGluayAjcHJvY2Vzc1RleHROb2RlfS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQSBtYXRjaCBtYXkgaGF2ZSBhbiBleHRyYSBjbG9zaW5nIHBhcmVudGhlc2lzIGF0IHRoZSBlbmQgb2YgdGhlIG1hdGNoIGJlY2F1c2UgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBtdXN0IGluY2x1ZGUgcGFyZW50aGVzaXNcclxuXHRcdCAqIGZvciBVUkxzIHN1Y2ggYXMgXCJ3aWtpcGVkaWEuY29tL3NvbWV0aGluZ18oZGlzYW1iaWd1YXRpb24pXCIsIHdoaWNoIHNob3VsZCBiZSBhdXRvLWxpbmtlZC4gXHJcblx0XHQgKiBcclxuXHRcdCAqIEhvd2V2ZXIsIGFuIGV4dHJhIHBhcmVudGhlc2lzICp3aWxsKiBiZSBpbmNsdWRlZCB3aGVuIHRoZSBVUkwgaXRzZWxmIGlzIHdyYXBwZWQgaW4gcGFyZW50aGVzaXMsIHN1Y2ggYXMgaW4gdGhlIGNhc2Ugb2ZcclxuXHRcdCAqIFwiKHdpa2lwZWRpYS5jb20vc29tZXRoaW5nXyhkaXNhbWJpZ3VhdGlvbikpXCIuIEluIHRoaXMgY2FzZSwgdGhlIGxhc3QgY2xvc2luZyBwYXJlbnRoZXNpcyBzaG91bGQgKm5vdCogYmUgcGFydCBvZiB0aGUgVVJMIFxyXG5cdFx0ICogaXRzZWxmLCBhbmQgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gYHRydWVgLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IG1hdGNoU3RyIFRoZSBmdWxsIG1hdGNoIHN0cmluZyBmcm9tIHRoZSB7QGxpbmsgI21hdGNoZXJSZWdleH0uXHJcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlcmUgaXMgYW4gdW5iYWxhbmNlZCBjbG9zaW5nIHBhcmVudGhlc2lzIGF0IHRoZSBlbmQgb2YgdGhlIGBtYXRjaFN0cmAsIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdFx0ICovXHJcblx0XHRtYXRjaEhhc1VuYmFsYW5jZWRDbG9zaW5nUGFyZW4gOiBmdW5jdGlvbiggbWF0Y2hTdHIgKSB7XHJcblx0XHRcdHZhciBsYXN0Q2hhciA9IG1hdGNoU3RyLmNoYXJBdCggbWF0Y2hTdHIubGVuZ3RoIC0gMSApO1xyXG5cclxuXHRcdFx0aWYoIGxhc3RDaGFyID09PSAnKScgKSB7XHJcblx0XHRcdFx0dmFyIG9wZW5QYXJlbnNNYXRjaCA9IG1hdGNoU3RyLm1hdGNoKCAvXFwoL2cgKSxcclxuXHRcdFx0XHQgICAgY2xvc2VQYXJlbnNNYXRjaCA9IG1hdGNoU3RyLm1hdGNoKCAvXFwpL2cgKSxcclxuXHRcdFx0XHQgICAgbnVtT3BlblBhcmVucyA9ICggb3BlblBhcmVuc01hdGNoICYmIG9wZW5QYXJlbnNNYXRjaC5sZW5ndGggKSB8fCAwLFxyXG5cdFx0XHRcdCAgICBudW1DbG9zZVBhcmVucyA9ICggY2xvc2VQYXJlbnNNYXRjaCAmJiBjbG9zZVBhcmVuc01hdGNoLmxlbmd0aCApIHx8IDA7XHJcblxyXG5cdFx0XHRcdGlmKCBudW1PcGVuUGFyZW5zIDwgbnVtQ2xvc2VQYXJlbnMgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRlcyB0aGUgcmV0dXJuIHN0cmluZyB2YWx1ZSBmb3IgYSBnaXZlbiBtYXRjaCBpbiB0aGUgaW5wdXQgc3RyaW5nLCBmb3IgdGhlIHtAbGluayAjcHJvY2Vzc1RleHROb2RlfSBtZXRob2QuXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgbWV0aG9kIGhhbmRsZXMgdGhlIHtAbGluayAjcmVwbGFjZUZufSwgaWYgb25lIHdhcyBwcm92aWRlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7QXV0b2xpbmtlci5tYXRjaC5NYXRjaH0gbWF0Y2ggVGhlIE1hdGNoIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIG1hdGNoLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IG1hdGNoU3RyIFRoZSBvcmlnaW5hbCBtYXRjaCBzdHJpbmcsIGFmdGVyIGhhdmluZyBiZWVuIHByZXByb2Nlc3NlZCB0byBmaXggbWF0Y2ggZWRnZSBjYXNlcyAoc2VlXHJcblx0XHQgKiAgIHRoZSBgcHJlZml4U3RyYCBhbmQgYHN1ZmZpeFN0cmAgdmFycyBpbiB7QGxpbmsgI3Byb2Nlc3NUZXh0Tm9kZX0uXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBzdHJpbmcgdGhhdCB0aGUgYG1hdGNoYCBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aC4gVGhpcyBpcyB1c3VhbGx5IHRoZSBhbmNob3IgdGFnIHN0cmluZywgYnV0XHJcblx0XHQgKiAgIG1heSBiZSB0aGUgYG1hdGNoU3RyYCBpdHNlbGYgaWYgdGhlIG1hdGNoIGlzIG5vdCB0byBiZSByZXBsYWNlZC5cclxuXHRcdCAqL1xyXG5cdFx0Y3JlYXRlTWF0Y2hSZXR1cm5WYWwgOiBmdW5jdGlvbiggbWF0Y2gsIG1hdGNoU3RyICkge1xyXG5cdFx0XHQvLyBIYW5kbGUgYSBjdXN0b20gYHJlcGxhY2VGbmAgYmVpbmcgcHJvdmlkZWRcclxuXHRcdFx0dmFyIHJlcGxhY2VGblJlc3VsdDtcclxuXHRcdFx0aWYoIHRoaXMucmVwbGFjZUZuICkge1xyXG5cdFx0XHRcdHJlcGxhY2VGblJlc3VsdCA9IHRoaXMucmVwbGFjZUZuLmNhbGwoIHRoaXMsIHRoaXMsIG1hdGNoICk7ICAvLyBBdXRvbGlua2VyIGluc3RhbmNlIGlzIHRoZSBjb250ZXh0LCBhbmQgdGhlIGZpcnN0IGFyZ1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiggdHlwZW9mIHJlcGxhY2VGblJlc3VsdCA9PT0gJ3N0cmluZycgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcGxhY2VGblJlc3VsdDsgIC8vIGByZXBsYWNlRm5gIHJldHVybmVkIGEgc3RyaW5nLCB1c2UgdGhhdFxyXG5cclxuXHRcdFx0fSBlbHNlIGlmKCByZXBsYWNlRm5SZXN1bHQgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdHJldHVybiBtYXRjaFN0cjsgIC8vIG5vIHJlcGxhY2VtZW50IGZvciB0aGUgbWF0Y2hcclxuXHJcblx0XHRcdH0gZWxzZSBpZiggcmVwbGFjZUZuUmVzdWx0IGluc3RhbmNlb2YgQXV0b2xpbmtlci5IdG1sVGFnICkge1xyXG5cdFx0XHRcdHJldHVybiByZXBsYWNlRm5SZXN1bHQudG9TdHJpbmcoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7ICAvLyByZXBsYWNlRm5SZXN1bHQgPT09IHRydWUsIG9yIG5vL3Vua25vd24gcmV0dXJuIHZhbHVlIGZyb20gZnVuY3Rpb25cclxuXHRcdFx0XHQvLyBQZXJmb3JtIEF1dG9saW5rZXIncyBkZWZhdWx0IGFuY2hvciB0YWcgZ2VuZXJhdGlvblxyXG5cdFx0XHRcdHZhciB0YWdCdWlsZGVyID0gdGhpcy5nZXRUYWdCdWlsZGVyKCksXHJcblx0XHRcdFx0ICAgIGFuY2hvclRhZyA9IHRhZ0J1aWxkZXIuYnVpbGQoIG1hdGNoICk7ICAvLyByZXR1cm5zIGFuIEF1dG9saW5rZXIuSHRtbFRhZyBpbnN0YW5jZVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gYW5jaG9yVGFnLnRvU3RyaW5nKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEF1dG9tYXRpY2FsbHkgbGlua3MgVVJMcywgZW1haWwgYWRkcmVzc2VzLCBhbmQgVHdpdHRlciBoYW5kbGVzIGZvdW5kIGluIHRoZSBnaXZlbiBjaHVuayBvZiBIVE1MLiBcclxuXHQgKiBEb2VzIG5vdCBsaW5rIFVSTHMgZm91bmQgd2l0aGluIEhUTUwgdGFncy5cclxuXHQgKiBcclxuXHQgKiBGb3IgaW5zdGFuY2UsIGlmIGdpdmVuIHRoZSB0ZXh0OiBgWW91IHNob3VsZCBnbyB0byBodHRwOi8vd3d3LnlhaG9vLmNvbWAsIHRoZW4gdGhlIHJlc3VsdFxyXG5cdCAqIHdpbGwgYmUgYFlvdSBzaG91bGQgZ28gdG8gJmx0O2EgaHJlZj1cImh0dHA6Ly93d3cueWFob28uY29tXCImZ3Q7aHR0cDovL3d3dy55YWhvby5jb20mbHQ7L2EmZ3Q7YFxyXG5cdCAqIFxyXG5cdCAqIEV4YW1wbGU6XHJcblx0ICogXHJcblx0ICogICAgIHZhciBsaW5rZWRUZXh0ID0gQXV0b2xpbmtlci5saW5rKCBcIkdvIHRvIGdvb2dsZS5jb21cIiwgeyBuZXdXaW5kb3c6IGZhbHNlIH0gKTtcclxuXHQgKiAgICAgLy8gUHJvZHVjZXM6IFwiR28gdG8gPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCI+Z29vZ2xlLmNvbTwvYT5cIlxyXG5cdCAqIFxyXG5cdCAqIEBzdGF0aWNcclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dE9ySHRtbCBUaGUgSFRNTCBvciB0ZXh0IHRvIGZpbmQgVVJMcywgZW1haWwgYWRkcmVzc2VzLCBhbmQgVHdpdHRlciBoYW5kbGVzIHdpdGhpbiAoZGVwZW5kaW5nIG9uIGlmXHJcblx0ICogICB0aGUge0BsaW5rICN1cmxzfSwge0BsaW5rICNlbWFpbH0sIGFuZCB7QGxpbmsgI3R3aXR0ZXJ9IG9wdGlvbnMgYXJlIGVuYWJsZWQpLlxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQW55IG9mIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBBdXRvbGlua2VyIGNsYXNzLCBzcGVjaWZpZWQgaW4gYW4gT2JqZWN0IChtYXApLlxyXG5cdCAqICAgU2VlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmb3IgYW4gZXhhbXBsZSBjYWxsLlxyXG5cdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIEhUTUwgdGV4dCwgd2l0aCBVUkxzIGF1dG9tYXRpY2FsbHkgbGlua2VkXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5saW5rID0gZnVuY3Rpb24oIHRleHRPckh0bWwsIG9wdGlvbnMgKSB7XHJcblx0XHR2YXIgYXV0b2xpbmtlciA9IG5ldyBBdXRvbGlua2VyKCBvcHRpb25zICk7XHJcblx0XHRyZXR1cm4gYXV0b2xpbmtlci5saW5rKCB0ZXh0T3JIdG1sICk7XHJcblx0fTtcclxuXHJcblxyXG5cdC8vIE5hbWVzcGFjZSBmb3IgYG1hdGNoYCBjbGFzc2VzXHJcblx0QXV0b2xpbmtlci5tYXRjaCA9IHt9O1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKmpzaGludCBlcW51bGw6dHJ1ZSwgYm9zczp0cnVlICovXHJcblx0LyoqXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIuVXRpbFxyXG5cdCAqIEBzaW5nbGV0b25cclxuXHQgKiBcclxuXHQgKiBBIGZldyB1dGlsaXR5IG1ldGhvZHMgZm9yIEF1dG9saW5rZXIuXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5VdGlsID0ge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByb3BlcnR5IHtGdW5jdGlvbn0gYWJzdHJhY3RNZXRob2RcclxuXHRcdCAqIFxyXG5cdFx0ICogQSBmdW5jdGlvbiBvYmplY3Qgd2hpY2ggcmVwcmVzZW50cyBhbiBhYnN0cmFjdCBtZXRob2QuXHJcblx0XHQgKi9cclxuXHRcdGFic3RyYWN0TWV0aG9kIDogZnVuY3Rpb24oKSB7IHRocm93IFwiYWJzdHJhY3RcIjsgfSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBc3NpZ25zIChzaGFsbG93IGNvcGllcykgdGhlIHByb3BlcnRpZXMgb2YgYHNyY2Agb250byBgZGVzdGAuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gc3JjIFRoZSBzb3VyY2Ugb2JqZWN0LlxyXG5cdFx0ICogQHJldHVybiB7T2JqZWN0fSBUaGUgZGVzdGluYXRpb24gb2JqZWN0IChgZGVzdGApXHJcblx0XHQgKi9cclxuXHRcdGFzc2lnbiA6IGZ1bmN0aW9uKCBkZXN0LCBzcmMgKSB7XHJcblx0XHRcdGZvciggdmFyIHByb3AgaW4gc3JjICkge1xyXG5cdFx0XHRcdGlmKCBzcmMuaGFzT3duUHJvcGVydHkoIHByb3AgKSApIHtcclxuXHRcdFx0XHRcdGRlc3RbIHByb3AgXSA9IHNyY1sgcHJvcCBdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRlc3Q7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEV4dGVuZHMgYHN1cGVyY2xhc3NgIHRvIGNyZWF0ZSBhIG5ldyBzdWJjbGFzcywgYWRkaW5nIHRoZSBgcHJvdG9Qcm9wc2AgdG8gdGhlIG5ldyBzdWJjbGFzcydzIHByb3RvdHlwZS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gc3VwZXJjbGFzcyBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBzdXBlcmNsYXNzLlxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHByb3RvUHJvcHMgVGhlIG1ldGhvZHMvcHJvcGVydGllcyB0byBhZGQgdG8gdGhlIHN1YmNsYXNzJ3MgcHJvdG90eXBlLiBUaGlzIG1heSBjb250YWluIHRoZVxyXG5cdFx0ICogICBzcGVjaWFsIHByb3BlcnR5IGBjb25zdHJ1Y3RvcmAsIHdoaWNoIHdpbGwgYmUgdXNlZCBhcyB0aGUgbmV3IHN1YmNsYXNzJ3MgY29uc3RydWN0b3IgZnVuY3Rpb24uXHJcblx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIG5ldyBzdWJjbGFzcyBmdW5jdGlvbi5cclxuXHRcdCAqL1xyXG5cdFx0ZXh0ZW5kIDogZnVuY3Rpb24oIHN1cGVyY2xhc3MsIHByb3RvUHJvcHMgKSB7XHJcblx0XHRcdHZhciBzdXBlcmNsYXNzUHJvdG8gPSBzdXBlcmNsYXNzLnByb3RvdHlwZTtcclxuXHJcblx0XHRcdHZhciBGID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdFx0Ri5wcm90b3R5cGUgPSBzdXBlcmNsYXNzUHJvdG87XHJcblxyXG5cdFx0XHR2YXIgc3ViY2xhc3M7XHJcblx0XHRcdGlmKCBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KCAnY29uc3RydWN0b3InICkgKSB7XHJcblx0XHRcdFx0c3ViY2xhc3MgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHN1YmNsYXNzID0gZnVuY3Rpb24oKSB7IHN1cGVyY2xhc3NQcm90by5jb25zdHJ1Y3Rvci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7IH07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzdWJjbGFzc1Byb3RvID0gc3ViY2xhc3MucHJvdG90eXBlID0gbmV3IEYoKTsgIC8vIHNldCB1cCBwcm90b3R5cGUgY2hhaW5cclxuXHRcdFx0c3ViY2xhc3NQcm90by5jb25zdHJ1Y3RvciA9IHN1YmNsYXNzOyAgLy8gZml4IGNvbnN0cnVjdG9yIHByb3BlcnR5XHJcblx0XHRcdHN1YmNsYXNzUHJvdG8uc3VwZXJjbGFzcyA9IHN1cGVyY2xhc3NQcm90bztcclxuXHJcblx0XHRcdGRlbGV0ZSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yOyAgLy8gZG9uJ3QgcmUtYXNzaWduIGNvbnN0cnVjdG9yIHByb3BlcnR5IHRvIHRoZSBwcm90b3R5cGUsIHNpbmNlIGEgbmV3IGZ1bmN0aW9uIG1heSBoYXZlIGJlZW4gY3JlYXRlZCAoYHN1YmNsYXNzYCksIHdoaWNoIGlzIG5vdyBhbHJlYWR5IHRoZXJlXHJcblx0XHRcdEF1dG9saW5rZXIuVXRpbC5hc3NpZ24oIHN1YmNsYXNzUHJvdG8sIHByb3RvUHJvcHMgKTtcclxuXHJcblx0XHRcdHJldHVybiBzdWJjbGFzcztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogVHJ1bmNhdGVzIHRoZSBgc3RyYCBhdCBgbGVuIC0gZWxsaXBzaXNDaGFycy5sZW5ndGhgLCBhbmQgYWRkcyB0aGUgYGVsbGlwc2lzQ2hhcnNgIHRvIHRoZVxyXG5cdFx0ICogZW5kIG9mIHRoZSBzdHJpbmcgKGJ5IGRlZmF1bHQsIHR3byBwZXJpb2RzOiAnLi4nKS4gSWYgdGhlIGBzdHJgIGxlbmd0aCBkb2VzIG5vdCBleGNlZWQgXHJcblx0XHQgKiBgbGVuYCwgdGhlIHN0cmluZyB3aWxsIGJlIHJldHVybmVkIHVuY2hhbmdlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHRydW5jYXRlIGFuZCBhZGQgYW4gZWxsaXBzaXMgdG8uXHJcblx0XHQgKiBAcGFyYW0ge051bWJlcn0gdHJ1bmNhdGVMZW4gVGhlIGxlbmd0aCB0byB0cnVuY2F0ZSB0aGUgc3RyaW5nIGF0LlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IFtlbGxpcHNpc0NoYXJzPS4uXSBUaGUgZWxsaXBzaXMgY2hhcmFjdGVyKHMpIHRvIGFkZCB0byB0aGUgZW5kIG9mIGBzdHJgXHJcblx0XHQgKiAgIHdoZW4gdHJ1bmNhdGVkLiBEZWZhdWx0cyB0byAnLi4nXHJcblx0XHQgKi9cclxuXHRcdGVsbGlwc2lzIDogZnVuY3Rpb24oIHN0ciwgdHJ1bmNhdGVMZW4sIGVsbGlwc2lzQ2hhcnMgKSB7XHJcblx0XHRcdGlmKCBzdHIubGVuZ3RoID4gdHJ1bmNhdGVMZW4gKSB7XHJcblx0XHRcdFx0ZWxsaXBzaXNDaGFycyA9ICggZWxsaXBzaXNDaGFycyA9PSBudWxsICkgPyAnLi4nIDogZWxsaXBzaXNDaGFycztcclxuXHRcdFx0XHRzdHIgPSBzdHIuc3Vic3RyaW5nKCAwLCB0cnVuY2F0ZUxlbiAtIGVsbGlwc2lzQ2hhcnMubGVuZ3RoICkgKyBlbGxpcHNpc0NoYXJzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzdHI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN1cHBvcnRzIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZigpYCBmdW5jdGlvbmFsaXR5IGZvciBvbGQgSUUgKElFOCBhbmQgYmVsb3cpLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBhcnIgVGhlIGFycmF5IHRvIGZpbmQgYW4gZWxlbWVudCBvZi5cclxuXHRcdCAqIEBwYXJhbSB7Kn0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBmaW5kIGluIHRoZSBhcnJheSwgYW5kIHJldHVybiB0aGUgaW5kZXggb2YuXHJcblx0XHQgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgYGVsZW1lbnRgLCBvciAtMSBpZiBpdCB3YXMgbm90IGZvdW5kLlxyXG5cdFx0ICovXHJcblx0XHRpbmRleE9mIDogZnVuY3Rpb24oIGFyciwgZWxlbWVudCApIHtcclxuXHRcdFx0aWYoIEFycmF5LnByb3RvdHlwZS5pbmRleE9mICkge1xyXG5cdFx0XHRcdHJldHVybiBhcnIuaW5kZXhPZiggZWxlbWVudCApO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xyXG5cdFx0XHRcdFx0aWYoIGFyclsgaSBdID09PSBlbGVtZW50ICkgcmV0dXJuIGk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUGVyZm9ybXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2Ygd2hhdCBtb2Rlcm4gYnJvd3NlcnMgZG8gd2hlbiBgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCgpYCBpcyBjYWxsZWRcclxuXHRcdCAqIHdpdGggYSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBjb250YWlucyBjYXB0dXJpbmcgcGFyZW50aGVzaXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEZvciBleGFtcGxlOlxyXG5cdFx0ICogXHJcblx0XHQgKiAgICAgLy8gTW9kZXJuIGJyb3dzZXJzOiBcclxuXHRcdCAqICAgICBcImEsYixjXCIuc3BsaXQoIC8oLCkvICk7ICAvLyAtLT4gWyAnYScsICcsJywgJ2InLCAnLCcsICdjJyBdXHJcblx0XHQgKiAgICAgXHJcblx0XHQgKiAgICAgLy8gT2xkIElFIChpbmNsdWRpbmcgSUU4KTpcclxuXHRcdCAqICAgICBcImEsYixjXCIuc3BsaXQoIC8oLCkvICk7ICAvLyAtLT4gWyAnYScsICdiJywgJ2MnIF1cclxuXHRcdCAqICAgICBcclxuXHRcdCAqIFRoaXMgbWV0aG9kIGVtdWxhdGVzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIG1vZGVybiBicm93c2VycyBmb3IgdGhlIG9sZCBJRSBjYXNlLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gc3BsaXQuXHJcblx0XHQgKiBAcGFyYW0ge1JlZ0V4cH0gc3BsaXRSZWdleCBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIHNwbGl0IHRoZSBpbnB1dCBgc3RyYCBvbi4gVGhlIHNwbGl0dGluZ1xyXG5cdFx0ICogICBjaGFyYWN0ZXIocykgd2lsbCBiZSBzcGxpY2VkIGludG8gdGhlIGFycmF5LCBhcyBpbiB0aGUgXCJtb2Rlcm4gYnJvd3NlcnNcIiBleGFtcGxlIGluIHRoZSBcclxuXHRcdCAqICAgZGVzY3JpcHRpb24gb2YgdGhpcyBtZXRob2QuIFxyXG5cdFx0ICogICBOb3RlICMxOiB0aGUgc3VwcGxpZWQgcmVndWxhciBleHByZXNzaW9uICoqbXVzdCoqIGhhdmUgdGhlICdnJyBmbGFnIHNwZWNpZmllZC5cclxuXHRcdCAqICAgTm90ZSAjMjogZm9yIHNpbXBsaWNpdHkncyBzYWtlLCB0aGUgcmVndWxhciBleHByZXNzaW9uIGRvZXMgbm90IG5lZWQgXHJcblx0XHQgKiAgIHRvIGNvbnRhaW4gY2FwdHVyaW5nIHBhcmVudGhlc2lzIC0gaXQgd2lsbCBiZSBhc3N1bWVkIHRoYXQgYW55IG1hdGNoIGhhcyB0aGVtLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nW119IFRoZSBzcGxpdCBhcnJheSBvZiBzdHJpbmdzLCB3aXRoIHRoZSBzcGxpdHRpbmcgY2hhcmFjdGVyKHMpIGluY2x1ZGVkLlxyXG5cdFx0ICovXHJcblx0XHRzcGxpdEFuZENhcHR1cmUgOiBmdW5jdGlvbiggc3RyLCBzcGxpdFJlZ2V4ICkge1xyXG5cdFx0XHRpZiggIXNwbGl0UmVnZXguZ2xvYmFsICkgdGhyb3cgbmV3IEVycm9yKCBcImBzcGxpdFJlZ2V4YCBtdXN0IGhhdmUgdGhlICdnJyBmbGFnIHNldFwiICk7XHJcblxyXG5cdFx0XHR2YXIgcmVzdWx0ID0gW10sXHJcblx0XHRcdCAgICBsYXN0SWR4ID0gMCxcclxuXHRcdFx0ICAgIG1hdGNoO1xyXG5cclxuXHRcdFx0d2hpbGUoIG1hdGNoID0gc3BsaXRSZWdleC5leGVjKCBzdHIgKSApIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggc3RyLnN1YnN0cmluZyggbGFzdElkeCwgbWF0Y2guaW5kZXggKSApO1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKCBtYXRjaFsgMCBdICk7ICAvLyBwdXNoIHRoZSBzcGxpdHRpbmcgY2hhcihzKVxyXG5cclxuXHRcdFx0XHRsYXN0SWR4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFsgMCBdLmxlbmd0aDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXN1bHQucHVzaCggc3RyLnN1YnN0cmluZyggbGFzdElkeCApICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKipcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLkh0bWxQYXJzZXJcclxuXHQgKiBAZXh0ZW5kcyBPYmplY3RcclxuXHQgKiBcclxuXHQgKiBBbiBIVE1MIHBhcnNlciBpbXBsZW1lbnRhdGlvbiB3aGljaCBzaW1wbHkgd2Fsa3MgYW4gSFRNTCBzdHJpbmcgYW5kIGNhbGxzIHRoZSBwcm92aWRlZCB2aXNpdG9yIGZ1bmN0aW9ucyB0byBwcm9jZXNzIFxyXG5cdCAqIEhUTUwgYW5kIHRleHQgbm9kZXMuXHJcblx0ICogXHJcblx0ICogQXV0b2xpbmtlciB1c2VzIHRoaXMgdG8gb25seSBsaW5rIFVSTHMvZW1haWxzL1R3aXR0ZXIgaGFuZGxlcyB3aXRoaW4gdGV4dCBub2RlcywgYmFzaWNhbGx5IGlnbm9yaW5nIEhUTUwgdGFncy5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLkh0bWxQYXJzZXIgPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBPYmplY3QsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gaHRtbFJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBwdWxsIG91dCBIVE1MIHRhZ3MgZnJvbSBhIHN0cmluZy4gSGFuZGxlcyBuYW1lc3BhY2VkIEhUTUwgdGFncyBhbmRcclxuXHRcdCAqIGF0dHJpYnV0ZSBuYW1lcywgYXMgc3BlY2lmaWVkIGJ5IGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWwtbWFya3VwL3N5bnRheC5odG1sLlxyXG5cdFx0ICogXHJcblx0XHQgKiBDYXB0dXJpbmcgZ3JvdXBzOlxyXG5cdFx0ICogXHJcblx0XHQgKiAxLiBUaGUgXCIhRE9DVFlQRVwiIHRhZyBuYW1lLCBpZiBhIHRhZyBpcyBhICZsdDshRE9DVFlQRSZndDsgdGFnLlxyXG5cdFx0ICogMi4gSWYgaXQgaXMgYW4gZW5kIHRhZywgdGhpcyBncm91cCB3aWxsIGhhdmUgdGhlICcvJy5cclxuXHRcdCAqIDMuIFRoZSB0YWcgbmFtZSBmb3IgYWxsIHRhZ3MgKG90aGVyIHRoYW4gdGhlICZsdDshRE9DVFlQRSZndDsgdGFnKVxyXG5cdFx0ICovXHJcblx0XHRodG1sUmVnZXggOiAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0YWdOYW1lUmVnZXggPSAvWzAtOWEtekEtWl1bMC05YS16QS1aOl0qLyxcclxuXHRcdFx0ICAgIGF0dHJOYW1lUmVnZXggPSAvW15cXHNcXDBcIic+XFwvPVxceDAxLVxceDFGXFx4N0ZdKy8sICAgLy8gdGhlIHVuaWNvZGUgcmFuZ2UgYWNjb3VudHMgZm9yIGV4Y2x1ZGluZyBjb250cm9sIGNoYXJzLCBhbmQgdGhlIGRlbGV0ZSBjaGFyXHJcblx0XHRcdCAgICBhdHRyVmFsdWVSZWdleCA9IC8oPzpcIlteXCJdKj9cInwnW14nXSo/J3xbXidcIj08PmBcXHNdKykvLCAvLyBkb3VibGUgcXVvdGVkLCBzaW5nbGUgcXVvdGVkLCBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWVzXHJcblx0XHRcdCAgICBuYW1lRXF1YWxzVmFsdWVSZWdleCA9IGF0dHJOYW1lUmVnZXguc291cmNlICsgJyg/OlxcXFxzKj1cXFxccyonICsgYXR0clZhbHVlUmVnZXguc291cmNlICsgJyk/JzsgIC8vIG9wdGlvbmFsICc9W3ZhbHVlXSdcclxuXHJcblx0XHRcdHJldHVybiBuZXcgUmVnRXhwKCBbXHJcblx0XHRcdFx0Ly8gZm9yIDwhRE9DVFlQRT4gdGFnLiBFeDogPCFET0NUWVBFIGh0bWwgUFVCTElDIFwiLS8vVzNDLy9EVEQgWEhUTUwgMS4wIFN0cmljdC8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMS9EVEQveGh0bWwxLXN0cmljdC5kdGRcIj4pIFxyXG5cdFx0XHRcdCcoPzonLFxyXG5cdFx0XHRcdFx0JzwoIURPQ1RZUEUpJywgIC8vICoqKiBDYXB0dXJpbmcgR3JvdXAgMSAtIElmIGl0J3MgYSBkb2N0eXBlIHRhZ1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gWmVybyBvciBtb3JlIGF0dHJpYnV0ZXMgZm9sbG93aW5nIHRoZSB0YWcgbmFtZVxyXG5cdFx0XHRcdFx0XHQnKD86JyxcclxuXHRcdFx0XHRcdFx0XHQnXFxcXHMrJywgIC8vIG9uZSBvciBtb3JlIHdoaXRlc3BhY2UgY2hhcnMgYmVmb3JlIGFuIGF0dHJpYnV0ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBFaXRoZXI6XHJcblx0XHRcdFx0XHRcdFx0Ly8gQS4gYXR0cj1cInZhbHVlXCIsIG9yIFxyXG5cdFx0XHRcdFx0XHRcdC8vIEIuIFwidmFsdWVcIiBhbG9uZSAoVG8gY292ZXIgZXhhbXBsZSBkb2N0eXBlIHRhZzogPCFET0NUWVBFIGh0bWwgUFVCTElDIFwiLS8vVzNDLy9EVEQgWEhUTUwgMS4wIFN0cmljdC8vRU5cIiBcImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMS9EVEQveGh0bWwxLXN0cmljdC5kdGRcIj4pIFxyXG5cdFx0XHRcdFx0XHRcdCcoPzonLCBuYW1lRXF1YWxzVmFsdWVSZWdleCwgJ3wnLCBhdHRyVmFsdWVSZWdleC5zb3VyY2UgKyAnKScsXHJcblx0XHRcdFx0XHRcdCcpKicsXHJcblx0XHRcdFx0XHQnPicsXHJcblx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHQnfCcsXHJcblxyXG5cdFx0XHRcdC8vIEFsbCBvdGhlciBIVE1MIHRhZ3MgKGkuZS4gdGFncyB0aGF0IGFyZSBub3QgPCFET0NUWVBFPilcclxuXHRcdFx0XHQnKD86JyxcclxuXHRcdFx0XHRcdCc8KC8pPycsICAvLyBCZWdpbm5pbmcgb2YgYSB0YWcuIEVpdGhlciAnPCcgZm9yIGEgc3RhcnQgdGFnLCBvciAnPC8nIGZvciBhbiBlbmQgdGFnLiBcclxuXHRcdFx0XHRcdCAgICAgICAgICAvLyAqKiogQ2FwdHVyaW5nIEdyb3VwIDI6IFRoZSBzbGFzaCBvciBhbiBlbXB0eSBzdHJpbmcuIFNsYXNoICgnLycpIGZvciBlbmQgdGFnLCBlbXB0eSBzdHJpbmcgZm9yIHN0YXJ0IG9yIHNlbGYtY2xvc2luZyB0YWcuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAqKiogQ2FwdHVyaW5nIEdyb3VwIDMgLSBUaGUgdGFnIG5hbWVcclxuXHRcdFx0XHRcdFx0JygnICsgdGFnTmFtZVJlZ2V4LnNvdXJjZSArICcpJyxcclxuXHJcblx0XHRcdFx0XHRcdC8vIFplcm8gb3IgbW9yZSBhdHRyaWJ1dGVzIGZvbGxvd2luZyB0aGUgdGFnIG5hbWVcclxuXHRcdFx0XHRcdFx0Jyg/OicsXHJcblx0XHRcdFx0XHRcdFx0J1xcXFxzKycsICAgICAgICAgICAgICAgIC8vIG9uZSBvciBtb3JlIHdoaXRlc3BhY2UgY2hhcnMgYmVmb3JlIGFuIGF0dHJpYnV0ZVxyXG5cdFx0XHRcdFx0XHRcdG5hbWVFcXVhbHNWYWx1ZVJlZ2V4LCAgLy8gYXR0cj1cInZhbHVlXCIgKHdpdGggb3B0aW9uYWwgPVwidmFsdWVcIiBwYXJ0KVxyXG5cdFx0XHRcdFx0XHQnKSonLFxyXG5cclxuXHRcdFx0XHRcdFx0J1xcXFxzKi8/JywgIC8vIGFueSB0cmFpbGluZyBzcGFjZXMgYW5kIG9wdGlvbmFsICcvJyBiZWZvcmUgdGhlIGNsb3NpbmcgJz4nXHJcblx0XHRcdFx0XHQnPicsXHJcblx0XHRcdFx0JyknXHJcblx0XHRcdF0uam9pbiggXCJcIiApLCAnZ2knICk7XHJcblx0XHR9ICkoKSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBXYWxrcyBhbiBIVE1MIHN0cmluZywgY2FsbGluZyB0aGUgYG9wdGlvbnMucHJvY2Vzc0h0bWxOb2RlYCBmdW5jdGlvbiBmb3IgZWFjaCBIVE1MIHRhZyB0aGF0IGlzIGVuY291bnRlcmVkLCBhbmQgY2FsbGluZ1xyXG5cdFx0ICogdGhlIGBvcHRpb25zLnByb2Nlc3NUZXh0Tm9kZWAgZnVuY3Rpb24gd2hlbiBlYWNoIHRleHQgYXJvdW5kIEhUTUwgdGFncyBpcyBlbmNvdW50ZXJlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGh0bWwgVGhlIEhUTUwgdG8gcGFyc2UuXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEFuIE9iamVjdCAobWFwKSB3aGljaCBtYXkgY29udGFpbiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnByb2Nlc3NIdG1sTm9kZV0gQSB2aXNpdG9yIGZ1bmN0aW9uIHdoaWNoIGFsbG93cyBwcm9jZXNzaW5nIG9mIGFuIGVuY291bnRlcmVkIEhUTUwgbm9kZS5cclxuXHRcdCAqICAgVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czpcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcm9jZXNzSHRtbE5vZGUudGFnVGV4dF0gVGhlIEhUTUwgdGFnIHRleHQgdGhhdCB3YXMgZm91bmQuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJvY2Vzc0h0bWxOb2RlLnRhZ05hbWVdIFRoZSB0YWcgbmFtZSBmb3IgdGhlIEhUTUwgdGFnIHRoYXQgd2FzIGZvdW5kLiBFeDogJ2EnIGZvciBhbiBhbmNob3IgdGFnLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnByb2Nlc3NIdG1sTm9kZS5pc0Nsb3NpbmdUYWddIGB0cnVlYCBpZiB0aGUgdGFnIGlzIGEgY2xvc2luZyB0YWcgKGV4OiAmbHQ7L2EmZ3Q7KSwgYGZhbHNlYCBvdGhlcndpc2UuXHJcblx0XHQgKiAgXHJcblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5wcm9jZXNzVGV4dE5vZGVdIEEgdmlzaXRvciBmdW5jdGlvbiB3aGljaCBhbGxvd3MgcHJvY2Vzc2luZyBvZiBhbiBlbmNvdW50ZXJlZCB0ZXh0IG5vZGUuXHJcblx0XHQgKiAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBhcmd1bWVudHM6XHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJvY2Vzc1RleHROb2RlLnRleHRdIFRoZSB0ZXh0IG5vZGUgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqL1xyXG5cdFx0cGFyc2UgOiBmdW5jdGlvbiggaHRtbCwgb3B0aW9ucyApIHtcclxuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG5cdFx0XHR2YXIgcHJvY2Vzc0h0bWxOb2RlVmlzaXRvciA9IG9wdGlvbnMucHJvY2Vzc0h0bWxOb2RlIHx8IGZ1bmN0aW9uKCkge30sXHJcblx0XHRcdCAgICBwcm9jZXNzVGV4dE5vZGVWaXNpdG9yID0gb3B0aW9ucy5wcm9jZXNzVGV4dE5vZGUgfHwgZnVuY3Rpb24oKSB7fSxcclxuXHRcdFx0ICAgIGh0bWxSZWdleCA9IHRoaXMuaHRtbFJlZ2V4LFxyXG5cdFx0XHQgICAgY3VycmVudFJlc3VsdCxcclxuXHRcdFx0ICAgIGxhc3RJbmRleCA9IDA7XHJcblxyXG5cdFx0XHQvLyBMb29wIG92ZXIgdGhlIEhUTUwgc3RyaW5nLCBpZ25vcmluZyBIVE1MIHRhZ3MsIGFuZCBwcm9jZXNzaW5nIHRoZSB0ZXh0IHRoYXQgbGllcyBiZXR3ZWVuIHRoZW0sXHJcblx0XHRcdC8vIHdyYXBwaW5nIHRoZSBVUkxzIGluIGFuY2hvciB0YWdzXHJcblx0XHRcdHdoaWxlKCAoIGN1cnJlbnRSZXN1bHQgPSBodG1sUmVnZXguZXhlYyggaHRtbCApICkgIT09IG51bGwgKSB7XHJcblx0XHRcdFx0dmFyIHRhZ1RleHQgPSBjdXJyZW50UmVzdWx0WyAwIF0sXHJcblx0XHRcdFx0ICAgIHRhZ05hbWUgPSBjdXJyZW50UmVzdWx0WyAxIF0gfHwgY3VycmVudFJlc3VsdFsgMyBdLCAgLy8gVGhlIDwhRE9DVFlQRT4gdGFnIChleDogXCIhRE9DVFlQRVwiKSwgb3IgYW5vdGhlciB0YWcgKGV4OiBcImFcIikgXHJcblx0XHRcdFx0ICAgIGlzQ2xvc2luZ1RhZyA9ICEhY3VycmVudFJlc3VsdFsgMiBdLFxyXG5cdFx0XHRcdCAgICBpbkJldHdlZW5UYWdzVGV4dCA9IGh0bWwuc3Vic3RyaW5nKCBsYXN0SW5kZXgsIGN1cnJlbnRSZXN1bHQuaW5kZXggKTtcclxuXHJcblx0XHRcdFx0aWYoIGluQmV0d2VlblRhZ3NUZXh0ICkge1xyXG5cdFx0XHRcdFx0cHJvY2Vzc1RleHROb2RlVmlzaXRvciggaW5CZXR3ZWVuVGFnc1RleHQgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHByb2Nlc3NIdG1sTm9kZVZpc2l0b3IoIHRhZ1RleHQsIHRhZ05hbWUudG9Mb3dlckNhc2UoKSwgaXNDbG9zaW5nVGFnICk7XHJcblxyXG5cdFx0XHRcdGxhc3RJbmRleCA9IGN1cnJlbnRSZXN1bHQuaW5kZXggKyB0YWdUZXh0Lmxlbmd0aDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gUHJvY2VzcyBhbnkgcmVtYWluaW5nIHRleHQgYWZ0ZXIgdGhlIGxhc3QgSFRNTCBlbGVtZW50LiBXaWxsIHByb2Nlc3MgYWxsIG9mIHRoZSB0ZXh0IGlmIHRoZXJlIHdlcmUgbm8gSFRNTCBlbGVtZW50cy5cclxuXHRcdFx0aWYoIGxhc3RJbmRleCA8IGh0bWwubGVuZ3RoICkge1xyXG5cdFx0XHRcdHZhciB0ZXh0ID0gaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCApO1xyXG5cclxuXHRcdFx0XHRpZiggdGV4dCApIHtcclxuXHRcdFx0XHRcdHByb2Nlc3NUZXh0Tm9kZVZpc2l0b3IoIHRleHQgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKmpzaGludCBib3NzOnRydWUgKi9cclxuXHQvKipcclxuXHQgKiBAY2xhc3MgQXV0b2xpbmtlci5IdG1sVGFnXHJcblx0ICogQGV4dGVuZHMgT2JqZWN0XHJcblx0ICogXHJcblx0ICogUmVwcmVzZW50cyBhbiBIVE1MIHRhZywgd2hpY2ggY2FuIGJlIHVzZWQgdG8gZWFzaWx5IGJ1aWxkL21vZGlmeSBIVE1MIHRhZ3MgcHJvZ3JhbW1hdGljYWxseS5cclxuXHQgKiBcclxuXHQgKiBBdXRvbGlua2VyIHVzZXMgdGhpcyBhYnN0cmFjdGlvbiB0byBjcmVhdGUgSFRNTCB0YWdzLCBhbmQgdGhlbiB3cml0ZSB0aGVtIG91dCBhcyBzdHJpbmdzLiBZb3UgbWF5IGFsc28gdXNlXHJcblx0ICogdGhpcyBjbGFzcyBpbiB5b3VyIGNvZGUsIGVzcGVjaWFsbHkgd2l0aGluIGEge0BsaW5rIEF1dG9saW5rZXIjcmVwbGFjZUZuIHJlcGxhY2VGbn0uXHJcblx0ICogXHJcblx0ICogIyMgRXhhbXBsZXNcclxuXHQgKiBcclxuXHQgKiBFeGFtcGxlIGluc3RhbnRpYXRpb246XHJcblx0ICogXHJcblx0ICogICAgIHZhciB0YWcgPSBuZXcgQXV0b2xpbmtlci5IdG1sVGFnKCB7XHJcblx0ICogICAgICAgICB0YWdOYW1lIDogJ2EnLFxyXG5cdCAqICAgICAgICAgYXR0cnMgICA6IHsgJ2hyZWYnOiAnaHR0cDovL2dvb2dsZS5jb20nLCAnY2xhc3MnOiAnZXh0ZXJuYWwtbGluaycgfSxcclxuXHQgKiAgICAgICAgIGlubmVySHRtbCA6ICdHb29nbGUnXHJcblx0ICogICAgIH0gKTtcclxuXHQgKiAgICAgXHJcblx0ICogICAgIHRhZy50b1N0cmluZygpOyAgLy8gPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCIgY2xhc3M9XCJleHRlcm5hbC1saW5rXCI+R29vZ2xlPC9hPlxyXG5cdCAqICAgICBcclxuXHQgKiAgICAgLy8gSW5kaXZpZHVhbCBhY2Nlc3NvciBtZXRob2RzXHJcblx0ICogICAgIHRhZy5nZXRUYWdOYW1lKCk7ICAgICAgICAgICAgICAgICAvLyAnYSdcclxuXHQgKiAgICAgdGFnLmdldEF0dHIoICdocmVmJyApOyAgICAgICAgICAgIC8vICdodHRwOi8vZ29vZ2xlLmNvbSdcclxuXHQgKiAgICAgdGFnLmhhc0NsYXNzKCAnZXh0ZXJuYWwtbGluaycgKTsgIC8vIHRydWVcclxuXHQgKiBcclxuXHQgKiBcclxuXHQgKiBVc2luZyBtdXRhdG9yIG1ldGhvZHMgKHdoaWNoIG1heSBiZSB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggaW5zdGFudGlhdGlvbiBjb25maWcgcHJvcGVydGllcyk6XHJcblx0ICogXHJcblx0ICogICAgIHZhciB0YWcgPSBuZXcgQXV0b2xpbmtlci5IdG1sVGFnKCk7XHJcblx0ICogICAgIHRhZy5zZXRUYWdOYW1lKCAnYScgKTtcclxuXHQgKiAgICAgdGFnLnNldEF0dHIoICdocmVmJywgJ2h0dHA6Ly9nb29nbGUuY29tJyApO1xyXG5cdCAqICAgICB0YWcuYWRkQ2xhc3MoICdleHRlcm5hbC1saW5rJyApO1xyXG5cdCAqICAgICB0YWcuc2V0SW5uZXJIdG1sKCAnR29vZ2xlJyApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgdGFnLmdldFRhZ05hbWUoKTsgICAgICAgICAgICAgICAgIC8vICdhJ1xyXG5cdCAqICAgICB0YWcuZ2V0QXR0ciggJ2hyZWYnICk7ICAgICAgICAgICAgLy8gJ2h0dHA6Ly9nb29nbGUuY29tJ1xyXG5cdCAqICAgICB0YWcuaGFzQ2xhc3MoICdleHRlcm5hbC1saW5rJyApOyAgLy8gdHJ1ZVxyXG5cdCAqICAgICBcclxuXHQgKiAgICAgdGFnLnRvU3RyaW5nKCk7ICAvLyA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiBjbGFzcz1cImV4dGVybmFsLWxpbmtcIj5Hb29nbGU8L2E+XHJcblx0ICogICAgIFxyXG5cdCAqIFxyXG5cdCAqICMjIEV4YW1wbGUgdXNlIHdpdGhpbiBhIHtAbGluayBBdXRvbGlua2VyI3JlcGxhY2VGbiByZXBsYWNlRm59XHJcblx0ICogXHJcblx0ICogICAgIHZhciBodG1sID0gQXV0b2xpbmtlci5saW5rKCBcIlRlc3QgZ29vZ2xlLmNvbVwiLCB7XHJcblx0ICogICAgICAgICByZXBsYWNlRm4gOiBmdW5jdGlvbiggYXV0b2xpbmtlciwgbWF0Y2ggKSB7XHJcblx0ICogICAgICAgICAgICAgdmFyIHRhZyA9IGF1dG9saW5rZXIuZ2V0VGFnQnVpbGRlcigpLmJ1aWxkKCBtYXRjaCApOyAgLy8gcmV0dXJucyBhbiB7QGxpbmsgQXV0b2xpbmtlci5IdG1sVGFnfSBpbnN0YW5jZSwgY29uZmlndXJlZCB3aXRoIHRoZSBNYXRjaCdzIGhyZWYgYW5kIGFuY2hvciB0ZXh0XHJcblx0ICogICAgICAgICAgICAgdGFnLnNldEF0dHIoICdyZWwnLCAnbm9mb2xsb3cnICk7XHJcblx0ICogICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuXHQgKiAgICAgICAgIH1cclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgLy8gZ2VuZXJhdGVkIGh0bWw6XHJcblx0ICogICAgIC8vICAgVGVzdCA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub2ZvbGxvd1wiPmdvb2dsZS5jb208L2E+XHJcblx0ICogICAgIFxyXG5cdCAqICAgICBcclxuXHQgKiAjIyBFeGFtcGxlIHVzZSB3aXRoIGEgbmV3IHRhZyBmb3IgdGhlIHJlcGxhY2VtZW50XHJcblx0ICogXHJcblx0ICogICAgIHZhciBodG1sID0gQXV0b2xpbmtlci5saW5rKCBcIlRlc3QgZ29vZ2xlLmNvbVwiLCB7XHJcblx0ICogICAgICAgICByZXBsYWNlRm4gOiBmdW5jdGlvbiggYXV0b2xpbmtlciwgbWF0Y2ggKSB7XHJcblx0ICogICAgICAgICAgICAgdmFyIHRhZyA9IG5ldyBBdXRvbGlua2VyLkh0bWxUYWcoIHtcclxuXHQgKiAgICAgICAgICAgICAgICAgdGFnTmFtZSA6ICdidXR0b24nLFxyXG5cdCAqICAgICAgICAgICAgICAgICBhdHRycyAgIDogeyAndGl0bGUnOiAnTG9hZCBVUkw6ICcgKyBtYXRjaC5nZXRBbmNob3JIcmVmKCkgfSxcclxuXHQgKiAgICAgICAgICAgICAgICAgaW5uZXJIdG1sIDogJ0xvYWQgVVJMOiAnICsgbWF0Y2guZ2V0QW5jaG9yVGV4dCgpXHJcblx0ICogICAgICAgICAgICAgfSApO1xyXG5cdCAqICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgIHJldHVybiB0YWc7XHJcblx0ICogICAgICAgICB9XHJcblx0ICogICAgIH0gKTtcclxuXHQgKiAgICAgXHJcblx0ICogICAgIC8vIGdlbmVyYXRlZCBodG1sOlxyXG5cdCAqICAgICAvLyAgIFRlc3QgPGJ1dHRvbiB0aXRsZT1cIkxvYWQgVVJMOiBodHRwOi8vZ29vZ2xlLmNvbVwiPkxvYWQgVVJMOiBnb29nbGUuY29tPC9idXR0b24+XHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5IdG1sVGFnID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggT2JqZWN0LCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IHRhZ05hbWVcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIHRhZyBuYW1lLiBFeDogJ2EnLCAnYnV0dG9uJywgZXRjLlxyXG5cdFx0ICogXHJcblx0XHQgKiBOb3QgcmVxdWlyZWQgYXQgaW5zdGFudGlhdGlvbiB0aW1lLCBidXQgc2hvdWxkIGJlIHNldCB1c2luZyB7QGxpbmsgI3NldFRhZ05hbWV9IGJlZm9yZSB7QGxpbmsgI3RvU3RyaW5nfVxyXG5cdFx0ICogaXMgZXhlY3V0ZWQuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge09iamVjdC48U3RyaW5nLCBTdHJpbmc+fSBhdHRyc1xyXG5cdFx0ICogXHJcblx0XHQgKiBBbiBrZXkvdmFsdWUgT2JqZWN0IChtYXApIG9mIGF0dHJpYnV0ZXMgdG8gY3JlYXRlIHRoZSB0YWcgd2l0aC4gVGhlIGtleXMgYXJlIHRoZSBhdHRyaWJ1dGUgbmFtZXMsIGFuZCB0aGVcclxuXHRcdCAqIHZhbHVlcyBhcmUgdGhlIGF0dHJpYnV0ZSB2YWx1ZXMuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gaW5uZXJIdG1sXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSBpbm5lciBIVE1MIGZvciB0aGUgdGFnLiBcclxuXHRcdCAqIFxyXG5cdFx0ICogTm90ZSB0aGUgY2FtZWwgY2FzZSBuYW1lIG9uIGBpbm5lckh0bWxgLiBBY3JvbnltcyBhcmUgY2FtZWxDYXNlZCBpbiB0aGlzIHV0aWxpdHkgKHN1Y2ggYXMgbm90IHRvIHJ1biBpbnRvIHRoZSBhY3JvbnltIFxyXG5cdFx0ICogbmFtaW5nIGluY29uc2lzdGVuY3kgdGhhdCB0aGUgRE9NIGRldmVsb3BlcnMgY3JlYXRlZCB3aXRoIGBYTUxIdHRwUmVxdWVzdGApLiBZb3UgbWF5IGFsdGVybmF0aXZlbHkgdXNlIHtAbGluayAjaW5uZXJIVE1MfVxyXG5cdFx0ICogaWYgeW91IHByZWZlciwgYnV0IHRoaXMgb25lIGlzIHJlY29tbWVuZGVkLlxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IGlubmVySFRNTFxyXG5cdFx0ICogXHJcblx0XHQgKiBBbGlhcyBvZiB7QGxpbmsgI2lubmVySHRtbH0sIGFjY2VwdGVkIGZvciBjb25zaXN0ZW5jeSB3aXRoIHRoZSBicm93c2VyIERPTSBhcGksIGJ1dCBwcmVmZXIgdGhlIGNhbWVsQ2FzZWQgdmVyc2lvblxyXG5cdFx0ICogZm9yIGFjcm9ueW0gbmFtZXMuXHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gd2hpdGVzcGFjZVJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIG1hdGNoIHdoaXRlc3BhY2UgaW4gYSBzdHJpbmcgb2YgQ1NTIGNsYXNzZXMuXHJcblx0XHQgKi9cclxuXHRcdHdoaXRlc3BhY2VSZWdleCA6IC9cXHMrLyxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY29uc3RydWN0b3JcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbY2ZnXSBUaGUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGZvciB0aGlzIGNsYXNzLCBpbiBhbiBPYmplY3QgKG1hcClcclxuXHRcdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IgOiBmdW5jdGlvbiggY2ZnICkge1xyXG5cdFx0XHRBdXRvbGlua2VyLlV0aWwuYXNzaWduKCB0aGlzLCBjZmcgKTtcclxuXHJcblx0XHRcdHRoaXMuaW5uZXJIdG1sID0gdGhpcy5pbm5lckh0bWwgfHwgdGhpcy5pbm5lckhUTUw7ICAvLyBhY2NlcHQgZWl0aGVyIHRoZSBjYW1lbENhc2VkIGZvcm0gb3IgdGhlIGZ1bGx5IGNhcGl0YWxpemVkIGFjcm9ueW1cclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2V0cyB0aGUgdGFnIG5hbWUgdGhhdCB3aWxsIGJlIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIHRhZyB3aXRoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGFnTmFtZVxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRzZXRUYWdOYW1lIDogZnVuY3Rpb24oIHRhZ05hbWUgKSB7XHJcblx0XHRcdHRoaXMudGFnTmFtZSA9IHRhZ05hbWU7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXRyaWV2ZXMgdGhlIHRhZyBuYW1lLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFRhZ05hbWUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMudGFnTmFtZSB8fCBcIlwiO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZXRzIGFuIGF0dHJpYnV0ZSBvbiB0aGUgSHRtbFRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGF0dHJOYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzZXQuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gYXR0clZhbHVlIFRoZSBhdHRyaWJ1dGUgdmFsdWUgdG8gc2V0LlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRzZXRBdHRyIDogZnVuY3Rpb24oIGF0dHJOYW1lLCBhdHRyVmFsdWUgKSB7XHJcblx0XHRcdHZhciB0YWdBdHRycyA9IHRoaXMuZ2V0QXR0cnMoKTtcclxuXHRcdFx0dGFnQXR0cnNbIGF0dHJOYW1lIF0gPSBhdHRyVmFsdWU7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0cmlldmVzIGFuIGF0dHJpYnV0ZSBmcm9tIHRoZSBIdG1sVGFnLiBJZiB0aGUgYXR0cmlidXRlIGRvZXMgbm90IGV4aXN0LCByZXR1cm5zIGB1bmRlZmluZWRgLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgYXR0cmlidXRlIG5hbWUgdG8gcmV0cmlldmUuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBhdHRyaWJ1dGUncyB2YWx1ZSwgb3IgYHVuZGVmaW5lZGAgaWYgaXQgZG9lcyBub3QgZXhpc3Qgb24gdGhlIEh0bWxUYWcuXHJcblx0XHQgKi9cclxuXHRcdGdldEF0dHIgOiBmdW5jdGlvbiggYXR0ck5hbWUgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJzKClbIGF0dHJOYW1lIF07XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldHMgb25lIG9yIG1vcmUgYXR0cmlidXRlcyBvbiB0aGUgSHRtbFRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3QuPFN0cmluZywgU3RyaW5nPn0gYXR0cnMgQSBrZXkvdmFsdWUgT2JqZWN0IChtYXApIG9mIHRoZSBhdHRyaWJ1dGVzIHRvIHNldC5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhpcyBIdG1sVGFnIGluc3RhbmNlLCBzbyB0aGF0IG1ldGhvZCBjYWxscyBtYXkgYmUgY2hhaW5lZC5cclxuXHRcdCAqL1xyXG5cdFx0c2V0QXR0cnMgOiBmdW5jdGlvbiggYXR0cnMgKSB7XHJcblx0XHRcdHZhciB0YWdBdHRycyA9IHRoaXMuZ2V0QXR0cnMoKTtcclxuXHRcdFx0QXV0b2xpbmtlci5VdGlsLmFzc2lnbiggdGFnQXR0cnMsIGF0dHJzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0cmlldmVzIHRoZSBhdHRyaWJ1dGVzIE9iamVjdCAobWFwKSBmb3IgdGhlIEh0bWxUYWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge09iamVjdC48U3RyaW5nLCBTdHJpbmc+fSBBIGtleS92YWx1ZSBvYmplY3Qgb2YgdGhlIGF0dHJpYnV0ZXMgZm9yIHRoZSBIdG1sVGFnLlxyXG5cdFx0ICovXHJcblx0XHRnZXRBdHRycyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRycyB8fCAoIHRoaXMuYXR0cnMgPSB7fSApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZXRzIHRoZSBwcm92aWRlZCBgY3NzQ2xhc3NgLCBvdmVyd3JpdGluZyBhbnkgY3VycmVudCBDU1MgY2xhc3NlcyBvbiB0aGUgSHRtbFRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGNzc0NsYXNzIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3NlcyB0byBzZXQgKG92ZXJ3cml0ZSkuXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLkh0bWxUYWd9IFRoaXMgSHRtbFRhZyBpbnN0YW5jZSwgc28gdGhhdCBtZXRob2QgY2FsbHMgbWF5IGJlIGNoYWluZWQuXHJcblx0XHQgKi9cclxuXHRcdHNldENsYXNzIDogZnVuY3Rpb24oIGNzc0NsYXNzICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRBdHRyKCAnY2xhc3MnLCBjc3NDbGFzcyApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gYWRkIG9uZSBvciBtb3JlIENTUyBjbGFzc2VzIHRvIHRoZSBIdG1sVGFnLiBXaWxsIG5vdCBhZGQgZHVwbGljYXRlIENTUyBjbGFzc2VzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gY3NzQ2xhc3MgT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHRvIGFkZC5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhpcyBIdG1sVGFnIGluc3RhbmNlLCBzbyB0aGF0IG1ldGhvZCBjYWxscyBtYXkgYmUgY2hhaW5lZC5cclxuXHRcdCAqL1xyXG5cdFx0YWRkQ2xhc3MgOiBmdW5jdGlvbiggY3NzQ2xhc3MgKSB7XHJcblx0XHRcdHZhciBjbGFzc0F0dHIgPSB0aGlzLmdldENsYXNzKCksXHJcblx0XHRcdCAgICB3aGl0ZXNwYWNlUmVnZXggPSB0aGlzLndoaXRlc3BhY2VSZWdleCxcclxuXHRcdFx0ICAgIGluZGV4T2YgPSBBdXRvbGlua2VyLlV0aWwuaW5kZXhPZiwgIC8vIHRvIHN1cHBvcnQgSUU4IGFuZCBiZWxvd1xyXG5cdFx0XHQgICAgY2xhc3NlcyA9ICggIWNsYXNzQXR0ciApID8gW10gOiBjbGFzc0F0dHIuc3BsaXQoIHdoaXRlc3BhY2VSZWdleCApLFxyXG5cdFx0XHQgICAgbmV3Q2xhc3NlcyA9IGNzc0NsYXNzLnNwbGl0KCB3aGl0ZXNwYWNlUmVnZXggKSxcclxuXHRcdFx0ICAgIG5ld0NsYXNzO1xyXG5cclxuXHRcdFx0d2hpbGUoIG5ld0NsYXNzID0gbmV3Q2xhc3Nlcy5zaGlmdCgpICkge1xyXG5cdFx0XHRcdGlmKCBpbmRleE9mKCBjbGFzc2VzLCBuZXdDbGFzcyApID09PSAtMSApIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCggbmV3Q2xhc3MgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZ2V0QXR0cnMoKVsgJ2NsYXNzJyBdID0gY2xhc3Nlcy5qb2luKCBcIiBcIiApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIHJlbW92ZSBvbmUgb3IgbW9yZSBDU1MgY2xhc3NlcyBmcm9tIHRoZSBIdG1sVGFnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gY3NzQ2xhc3MgT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHRvIHJlbW92ZS5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhpcyBIdG1sVGFnIGluc3RhbmNlLCBzbyB0aGF0IG1ldGhvZCBjYWxscyBtYXkgYmUgY2hhaW5lZC5cclxuXHRcdCAqL1xyXG5cdFx0cmVtb3ZlQ2xhc3MgOiBmdW5jdGlvbiggY3NzQ2xhc3MgKSB7XHJcblx0XHRcdHZhciBjbGFzc0F0dHIgPSB0aGlzLmdldENsYXNzKCksXHJcblx0XHRcdCAgICB3aGl0ZXNwYWNlUmVnZXggPSB0aGlzLndoaXRlc3BhY2VSZWdleCxcclxuXHRcdFx0ICAgIGluZGV4T2YgPSBBdXRvbGlua2VyLlV0aWwuaW5kZXhPZiwgIC8vIHRvIHN1cHBvcnQgSUU4IGFuZCBiZWxvd1xyXG5cdFx0XHQgICAgY2xhc3NlcyA9ICggIWNsYXNzQXR0ciApID8gW10gOiBjbGFzc0F0dHIuc3BsaXQoIHdoaXRlc3BhY2VSZWdleCApLFxyXG5cdFx0XHQgICAgcmVtb3ZlQ2xhc3NlcyA9IGNzc0NsYXNzLnNwbGl0KCB3aGl0ZXNwYWNlUmVnZXggKSxcclxuXHRcdFx0ICAgIHJlbW92ZUNsYXNzO1xyXG5cclxuXHRcdFx0d2hpbGUoIGNsYXNzZXMubGVuZ3RoICYmICggcmVtb3ZlQ2xhc3MgPSByZW1vdmVDbGFzc2VzLnNoaWZ0KCkgKSApIHtcclxuXHRcdFx0XHR2YXIgaWR4ID0gaW5kZXhPZiggY2xhc3NlcywgcmVtb3ZlQ2xhc3MgKTtcclxuXHRcdFx0XHRpZiggaWR4ICE9PSAtMSApIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMuc3BsaWNlKCBpZHgsIDEgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZ2V0QXR0cnMoKVsgJ2NsYXNzJyBdID0gY2xhc3Nlcy5qb2luKCBcIiBcIiApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIHJldHJpZXZlIHRoZSBDU1MgY2xhc3MoZXMpIGZvciB0aGUgSHRtbFRhZywgd2hpY2ggd2lsbCBlYWNoIGJlIHNlcGFyYXRlZCBieSBzcGFjZXMgd2hlblxyXG5cdFx0ICogdGhlcmUgYXJlIG11bHRpcGxlLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldENsYXNzIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldEF0dHJzKClbICdjbGFzcycgXSB8fCBcIlwiO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gY2hlY2sgaWYgdGhlIHRhZyBoYXMgYSBDU1MgY2xhc3Mgb3Igbm90LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gY3NzQ2xhc3MgVGhlIENTUyBjbGFzcyB0byBjaGVjayBmb3IuXHJcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIEh0bWxUYWcgaGFzIHRoZSBDU1MgY2xhc3MsIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdFx0ICovXHJcblx0XHRoYXNDbGFzcyA6IGZ1bmN0aW9uKCBjc3NDbGFzcyApIHtcclxuXHRcdFx0cmV0dXJuICggJyAnICsgdGhpcy5nZXRDbGFzcygpICsgJyAnICkuaW5kZXhPZiggJyAnICsgY3NzQ2xhc3MgKyAnICcgKSAhPT0gLTE7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldHMgdGhlIGlubmVyIEhUTUwgZm9yIHRoZSB0YWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBodG1sIFRoZSBpbm5lciBIVE1MIHRvIHNldC5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhpcyBIdG1sVGFnIGluc3RhbmNlLCBzbyB0aGF0IG1ldGhvZCBjYWxscyBtYXkgYmUgY2hhaW5lZC5cclxuXHRcdCAqL1xyXG5cdFx0c2V0SW5uZXJIdG1sIDogZnVuY3Rpb24oIGh0bWwgKSB7XHJcblx0XHRcdHRoaXMuaW5uZXJIdG1sID0gaHRtbDtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXRyaWV2ZXMgdGhlIGlubmVyIEhUTUwgZm9yIHRoZSB0YWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0SW5uZXJIdG1sIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmlubmVySHRtbCB8fCBcIlwiO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBPdmVycmlkZSBvZiBzdXBlcmNsYXNzIG1ldGhvZCB1c2VkIHRvIGdlbmVyYXRlIHRoZSBIVE1MIHN0cmluZyBmb3IgdGhlIHRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHR0b1N0cmluZyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGFnTmFtZSA9IHRoaXMuZ2V0VGFnTmFtZSgpLFxyXG5cdFx0XHQgICAgYXR0cnNTdHIgPSB0aGlzLmJ1aWxkQXR0cnNTdHIoKTtcclxuXHJcblx0XHRcdGF0dHJzU3RyID0gKCBhdHRyc1N0ciApID8gJyAnICsgYXR0cnNTdHIgOiAnJzsgIC8vIHByZXBlbmQgYSBzcGFjZSBpZiB0aGVyZSBhcmUgYWN0dWFsbHkgYXR0cmlidXRlc1xyXG5cclxuXHRcdFx0cmV0dXJuIFsgJzwnLCB0YWdOYW1lLCBhdHRyc1N0ciwgJz4nLCB0aGlzLmdldElubmVySHRtbCgpLCAnPC8nLCB0YWdOYW1lLCAnPicgXS5qb2luKCBcIlwiICk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN1cHBvcnQgbWV0aG9kIGZvciB7QGxpbmsgI3RvU3RyaW5nfSwgcmV0dXJucyB0aGUgc3RyaW5nIHNwYWNlLXNlcGFyYXRlZCBrZXk9XCJ2YWx1ZVwiIHBhaXJzLCB1c2VkIHRvIHBvcHVsYXRlIFxyXG5cdFx0ICogdGhlIHN0cmluZ2lmaWVkIEh0bWxUYWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gRXhhbXBsZSByZXR1cm46IGBhdHRyMT1cInZhbHVlMVwiIGF0dHIyPVwidmFsdWUyXCJgXHJcblx0XHQgKi9cclxuXHRcdGJ1aWxkQXR0cnNTdHIgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoICF0aGlzLmF0dHJzICkgcmV0dXJuIFwiXCI7ICAvLyBubyBgYXR0cnNgIE9iamVjdCAobWFwKSBoYXMgYmVlbiBzZXQsIHJldHVybiBlbXB0eSBzdHJpbmdcclxuXHJcblx0XHRcdHZhciBhdHRycyA9IHRoaXMuZ2V0QXR0cnMoKSxcclxuXHRcdFx0ICAgIGF0dHJzQXJyID0gW107XHJcblxyXG5cdFx0XHRmb3IoIHZhciBwcm9wIGluIGF0dHJzICkge1xyXG5cdFx0XHRcdGlmKCBhdHRycy5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xyXG5cdFx0XHRcdFx0YXR0cnNBcnIucHVzaCggcHJvcCArICc9XCInICsgYXR0cnNbIHByb3AgXSArICdcIicgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGF0dHJzQXJyLmpvaW4oIFwiIFwiICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHQvKmdsb2JhbCBBdXRvbGlua2VyICovXHJcblx0Lypqc2hpbnQgc2NyaXB0dXJsOnRydWUgKi9cclxuXHQvKipcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLk1hdGNoVmFsaWRhdG9yXHJcblx0ICogQGV4dGVuZHMgT2JqZWN0XHJcblx0ICogXHJcblx0ICogVXNlZCBieSBBdXRvbGlua2VyIHRvIGZpbHRlciBvdXQgZmFsc2UgcG9zaXRpdmVzIGZyb20gdGhlIHtAbGluayBBdXRvbGlua2VyI21hdGNoZXJSZWdleH0uXHJcblx0ICogXHJcblx0ICogRHVlIHRvIHRoZSBsaW1pdGF0aW9ucyBvZiByZWd1bGFyIGV4cHJlc3Npb25zIChpbmNsdWRpbmcgdGhlIG1pc3NpbmcgZmVhdHVyZSBvZiBsb29rLWJlaGluZHMgaW4gSlMgcmVndWxhciBleHByZXNzaW9ucyksXHJcblx0ICogd2UgY2Fubm90IGFsd2F5cyBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIGEgZ2l2ZW4gbWF0Y2guIFRoaXMgY2xhc3MgYXBwbGllcyBhIGJpdCBvZiBhZGRpdGlvbmFsIGxvZ2ljIHRvIGZpbHRlciBvdXQgYW55XHJcblx0ICogZmFsc2UgcG9zaXRpdmVzIHRoYXQgaGF2ZSBiZWVuIG1hdGNoZWQgYnkgdGhlIHtAbGluayBBdXRvbGlua2VyI21hdGNoZXJSZWdleH0uXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5NYXRjaFZhbGlkYXRvciA9IEF1dG9saW5rZXIuVXRpbC5leHRlbmQoIE9iamVjdCwge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBpbnZhbGlkUHJvdG9jb2xSZWxNYXRjaFJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBjaGVjayBhIHBvdGVudGlhbCBwcm90b2NvbC1yZWxhdGl2ZSBVUkwgbWF0Y2gsIGNvbWluZyBmcm9tIHRoZSBcclxuXHRcdCAqIHtAbGluayBBdXRvbGlua2VyI21hdGNoZXJSZWdleH0uIEEgcHJvdG9jb2wtcmVsYXRpdmUgVVJMIGlzLCBmb3IgZXhhbXBsZSwgXCIvL3lhaG9vLmNvbVwiXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgcmVndWxhciBleHByZXNzaW9uIGNoZWNrcyB0byBzZWUgaWYgdGhlcmUgaXMgYSB3b3JkIGNoYXJhY3RlciBiZWZvcmUgdGhlICcvLycgbWF0Y2ggaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIFxyXG5cdFx0ICogd2Ugc2hvdWxkIGFjdHVhbGx5IGF1dG9saW5rIGEgcHJvdG9jb2wtcmVsYXRpdmUgVVJMLiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZXJlIGlzIG5vIG5lZ2F0aXZlIGxvb2stYmVoaW5kIGluIFxyXG5cdFx0ICogSmF2YVNjcmlwdCByZWd1bGFyIGV4cHJlc3Npb25zLiBcclxuXHRcdCAqIFxyXG5cdFx0ICogRm9yIGluc3RhbmNlLCB3ZSB3YW50IHRvIGF1dG9saW5rIHNvbWV0aGluZyBsaWtlIFwiR28gdG86IC8vZ29vZ2xlLmNvbVwiLCBidXQgd2UgZG9uJ3Qgd2FudCB0byBhdXRvbGluayBzb21ldGhpbmcgXHJcblx0XHQgKiBsaWtlIFwiYWJjLy9nb29nbGUuY29tXCJcclxuXHRcdCAqL1xyXG5cdFx0aW52YWxpZFByb3RvY29sUmVsTWF0Y2hSZWdleCA6IC9eW1xcd11cXC9cXC8vLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVnZXggdG8gdGVzdCBmb3IgYSBmdWxsIHByb3RvY29sLCB3aXRoIHRoZSB0d28gdHJhaWxpbmcgc2xhc2hlcy4gRXg6ICdodHRwOi8vJ1xyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGhhc0Z1bGxQcm90b2NvbFJlZ2V4XHJcblx0XHQgKi9cclxuXHRcdGhhc0Z1bGxQcm90b2NvbFJlZ2V4IDogL15bQS1aYS16XVstLitBLVphLXowLTldKzpcXC9cXC8vLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVnZXggdG8gZmluZCB0aGUgVVJJIHNjaGVtZSwgc3VjaCBhcyAnbWFpbHRvOicuXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoaXMgaXMgdXNlZCB0byBmaWx0ZXIgb3V0ICdqYXZhc2NyaXB0OicgYW5kICd2YnNjcmlwdDonIHNjaGVtZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gdXJpU2NoZW1lUmVnZXhcclxuXHRcdCAqL1xyXG5cdFx0dXJpU2NoZW1lUmVnZXggOiAvXltBLVphLXpdWy0uK0EtWmEtejAtOV0rOi8sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWdleCB0byBkZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIHdvcmQgY2hhciBleGlzdHMgYWZ0ZXIgdGhlIHByb3RvY29sIChpLmUuIGFmdGVyIHRoZSAnOicpXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gaGFzV29yZENoYXJBZnRlclByb3RvY29sUmVnZXhcclxuXHRcdCAqL1xyXG5cdFx0aGFzV29yZENoYXJBZnRlclByb3RvY29sUmVnZXggOiAvOlteXFxzXSo/W0EtWmEtel0vLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERldGVybWluZXMgaWYgYSBnaXZlbiBtYXRjaCBmb3VuZCBieSB7QGxpbmsgQXV0b2xpbmtlciNwcm9jZXNzVGV4dE5vZGV9IGlzIHZhbGlkLiBXaWxsIHJldHVybiBgZmFsc2VgIGZvcjpcclxuXHRcdCAqIFxyXG5cdFx0ICogMSkgVVJMIG1hdGNoZXMgd2hpY2ggZG8gbm90IGhhdmUgYXQgbGVhc3QgaGF2ZSBvbmUgcGVyaW9kICgnLicpIGluIHRoZSBkb21haW4gbmFtZSAoZWZmZWN0aXZlbHkgc2tpcHBpbmcgb3ZlciBcclxuXHRcdCAqICAgIG1hdGNoZXMgbGlrZSBcImFiYzpkZWZcIikuIEhvd2V2ZXIsIFVSTCBtYXRjaGVzIHdpdGggYSBwcm90b2NvbCB3aWxsIGJlIGFsbG93ZWQgKGV4OiAnaHR0cDovL2xvY2FsaG9zdCcpXHJcblx0XHQgKiAyKSBVUkwgbWF0Y2hlcyB3aGljaCBkbyBub3QgaGF2ZSBhdCBsZWFzdCBvbmUgd29yZCBjaGFyYWN0ZXIgaW4gdGhlIGRvbWFpbiBuYW1lIChlZmZlY3RpdmVseSBza2lwcGluZyBvdmVyXHJcblx0XHQgKiAgICBtYXRjaGVzIGxpa2UgXCJnaXQ6MS4wXCIpLlxyXG5cdFx0ICogMykgQSBwcm90b2NvbC1yZWxhdGl2ZSB1cmwgbWF0Y2ggKGEgVVJMIGJlZ2lubmluZyB3aXRoICcvLycpIHdob3NlIHByZXZpb3VzIGNoYXJhY3RlciBpcyBhIHdvcmQgY2hhcmFjdGVyIFxyXG5cdFx0ICogICAgKGVmZmVjdGl2ZWx5IHNraXBwaW5nIG92ZXIgc3RyaW5ncyBsaWtlIFwiYWJjLy9nb29nbGUuY29tXCIpXHJcblx0XHQgKiBcclxuXHRcdCAqIE90aGVyd2lzZSwgcmV0dXJucyBgdHJ1ZWAuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxNYXRjaCBUaGUgbWF0Y2hlZCBVUkwsIGlmIHRoZXJlIHdhcyBvbmUuIFdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBtYXRjaCBpcyBub3QgYSBVUkwgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xVcmxNYXRjaCBUaGUgbWF0Y2ggVVJMIHN0cmluZyBmb3IgYSBwcm90b2NvbCBtYXRjaC4gRXg6ICdodHRwOi8veWFob28uY29tJy4gVGhpcyBpcyB1c2VkIHRvIG1hdGNoXHJcblx0XHQgKiAgIHNvbWV0aGluZyBsaWtlICdodHRwOi8vbG9jYWxob3N0Jywgd2hlcmUgd2Ugd29uJ3QgZG91YmxlIGNoZWNrIHRoYXQgdGhlIGRvbWFpbiBuYW1lIGhhcyBhdCBsZWFzdCBvbmUgJy4nIGluIGl0LlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sUmVsYXRpdmVNYXRjaCBUaGUgcHJvdG9jb2wtcmVsYXRpdmUgc3RyaW5nIGZvciBhIFVSTCBtYXRjaCAoaS5lLiAnLy8nKSwgcG9zc2libHkgd2l0aCBhIHByZWNlZGluZ1xyXG5cdFx0ICogICBjaGFyYWN0ZXIgKGV4LCBhIHNwYWNlLCBzdWNoIGFzOiAnIC8vJywgb3IgYSBsZXR0ZXIsIHN1Y2ggYXM6ICdhLy8nKS4gVGhlIG1hdGNoIGlzIGludmFsaWQgaWYgdGhlcmUgaXMgYSB3b3JkIGNoYXJhY3RlclxyXG5cdFx0ICogICBwcmVjZWRpbmcgdGhlICcvLycuXHJcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIG1hdGNoIGdpdmVuIGlzIHZhbGlkIGFuZCBzaG91bGQgYmUgcHJvY2Vzc2VkLCBvciBgZmFsc2VgIGlmIHRoZSBtYXRjaCBpcyBpbnZhbGlkIGFuZC9vciBcclxuXHRcdCAqICAgc2hvdWxkIGp1c3Qgbm90IGJlIHByb2Nlc3NlZC5cclxuXHRcdCAqL1xyXG5cdFx0aXNWYWxpZE1hdGNoIDogZnVuY3Rpb24oIHVybE1hdGNoLCBwcm90b2NvbFVybE1hdGNoLCBwcm90b2NvbFJlbGF0aXZlTWF0Y2ggKSB7XHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdCggcHJvdG9jb2xVcmxNYXRjaCAmJiAhdGhpcy5pc1ZhbGlkVXJpU2NoZW1lKCBwcm90b2NvbFVybE1hdGNoICkgKSB8fFxyXG5cdFx0XHRcdHRoaXMudXJsTWF0Y2hEb2VzTm90SGF2ZVByb3RvY29sT3JEb3QoIHVybE1hdGNoLCBwcm90b2NvbFVybE1hdGNoICkgfHwgICAgICAgLy8gQXQgbGVhc3Qgb25lIHBlcmlvZCAoJy4nKSBtdXN0IGV4aXN0IGluIHRoZSBVUkwgbWF0Y2ggZm9yIHVzIHRvIGNvbnNpZGVyIGl0IGFuIGFjdHVhbCBVUkwsICp1bmxlc3MqIGl0IHdhcyBhIGZ1bGwgcHJvdG9jb2wgbWF0Y2ggKGxpa2UgJ2h0dHA6Ly9sb2NhbGhvc3QnKVxyXG5cdFx0XHRcdHRoaXMudXJsTWF0Y2hEb2VzTm90SGF2ZUF0TGVhc3RPbmVXb3JkQ2hhciggdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2ggKSB8fCAgLy8gQXQgbGVhc3Qgb25lIGxldHRlciBjaGFyYWN0ZXIgbXVzdCBleGlzdCBpbiB0aGUgZG9tYWluIG5hbWUgYWZ0ZXIgYSBwcm90b2NvbCBtYXRjaC4gRXg6IHNraXAgb3ZlciBzb21ldGhpbmcgbGlrZSBcImdpdDoxLjBcIlxyXG5cdFx0XHRcdHRoaXMuaXNJbnZhbGlkUHJvdG9jb2xSZWxhdGl2ZU1hdGNoKCBwcm90b2NvbFJlbGF0aXZlTWF0Y2ggKSAgICAgICAgICAgICAgICAgLy8gQSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCB3aGljaCBoYXMgYSB3b3JkIGNoYXJhY3RlciBpbiBmcm9udCBvZiBpdCAoc28gd2UgY2FuIHNraXAgc29tZXRoaW5nIGxpa2UgXCJhYmMvL2dvb2dsZS5jb21cIilcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZXJtaW5lcyBpZiB0aGUgVVJJIHNjaGVtZSBpcyBhIHZhbGlkIHNjaGVtZSB0byBiZSBhdXRvbGlua2VkLiBSZXR1cm5zIGBmYWxzZWAgaWYgdGhlIHNjaGVtZSBpcyBcclxuXHRcdCAqICdqYXZhc2NyaXB0Oicgb3IgJ3Zic2NyaXB0OidcclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmlTY2hlbWVNYXRjaCBUaGUgbWF0Y2ggVVJMIHN0cmluZyBmb3IgYSBmdWxsIFVSSSBzY2hlbWUgbWF0Y2guIEV4OiAnaHR0cDovL3lhaG9vLmNvbScgXHJcblx0XHQgKiAgIG9yICdtYWlsdG86YUBhLmNvbScuXHJcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHNjaGVtZSBpcyBhIHZhbGlkIG9uZSwgYGZhbHNlYCBvdGhlcndpc2UuXHJcblx0XHQgKi9cclxuXHRcdGlzVmFsaWRVcmlTY2hlbWUgOiBmdW5jdGlvbiggdXJpU2NoZW1lTWF0Y2ggKSB7XHJcblx0XHRcdHZhciB1cmlTY2hlbWUgPSB1cmlTY2hlbWVNYXRjaC5tYXRjaCggdGhpcy51cmlTY2hlbWVSZWdleCApWyAwIF07XHJcblxyXG5cdFx0XHRyZXR1cm4gKCB1cmlTY2hlbWUgIT09ICdqYXZhc2NyaXB0OicgJiYgdXJpU2NoZW1lICE9PSAndmJzY3JpcHQ6JyApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZXRlcm1pbmVzIGlmIGEgVVJMIG1hdGNoIGRvZXMgbm90IGhhdmUgZWl0aGVyOlxyXG5cdFx0ICogXHJcblx0XHQgKiBhKSBhIGZ1bGwgcHJvdG9jb2wgKGkuZS4gJ2h0dHA6Ly8nKSwgb3JcclxuXHRcdCAqIGIpIGF0IGxlYXN0IG9uZSBkb3QgKCcuJykgaW4gdGhlIGRvbWFpbiBuYW1lIChmb3IgYSBub24tZnVsbC1wcm90b2NvbCBtYXRjaCkuXHJcblx0XHQgKiBcclxuXHRcdCAqIEVpdGhlciBzaXR1YXRpb24gaXMgY29uc2lkZXJlZCBhbiBpbnZhbGlkIFVSTCAoZXg6ICdnaXQ6ZCcgZG9lcyBub3QgaGF2ZSBlaXRoZXIgdGhlICc6Ly8nIHBhcnQsIG9yIGF0IGxlYXN0IG9uZSBkb3RcclxuXHRcdCAqIGluIHRoZSBkb21haW4gbmFtZS4gSWYgdGhlIG1hdGNoIHdhcyAnZ2l0OmFiYy5jb20nLCB3ZSB3b3VsZCBjb25zaWRlciB0aGlzIHZhbGlkLilcclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxNYXRjaCBUaGUgbWF0Y2hlZCBVUkwsIGlmIHRoZXJlIHdhcyBvbmUuIFdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBtYXRjaCBpcyBub3QgYSBVUkwgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xVcmxNYXRjaCBUaGUgbWF0Y2ggVVJMIHN0cmluZyBmb3IgYSBwcm90b2NvbCBtYXRjaC4gRXg6ICdodHRwOi8veWFob28uY29tJy4gVGhpcyBpcyB1c2VkIHRvIG1hdGNoXHJcblx0XHQgKiAgIHNvbWV0aGluZyBsaWtlICdodHRwOi8vbG9jYWxob3N0Jywgd2hlcmUgd2Ugd29uJ3QgZG91YmxlIGNoZWNrIHRoYXQgdGhlIGRvbWFpbiBuYW1lIGhhcyBhdCBsZWFzdCBvbmUgJy4nIGluIGl0LlxyXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBVUkwgbWF0Y2ggZG9lcyBub3QgaGF2ZSBhIGZ1bGwgcHJvdG9jb2wsIG9yIGF0IGxlYXN0IG9uZSBkb3QgKCcuJykgaW4gYSBub24tZnVsbC1wcm90b2NvbFxyXG5cdFx0ICogICBtYXRjaC5cclxuXHRcdCAqL1xyXG5cdFx0dXJsTWF0Y2hEb2VzTm90SGF2ZVByb3RvY29sT3JEb3QgOiBmdW5jdGlvbiggdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2ggKSB7XHJcblx0XHRcdHJldHVybiAoICEhdXJsTWF0Y2ggJiYgKCAhcHJvdG9jb2xVcmxNYXRjaCB8fCAhdGhpcy5oYXNGdWxsUHJvdG9jb2xSZWdleC50ZXN0KCBwcm90b2NvbFVybE1hdGNoICkgKSAmJiB1cmxNYXRjaC5pbmRleE9mKCAnLicgKSA9PT0gLTEgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZXJtaW5lcyBpZiBhIFVSTCBtYXRjaCBkb2VzIG5vdCBoYXZlIGF0IGxlYXN0IG9uZSB3b3JkIGNoYXJhY3RlciBhZnRlciB0aGUgcHJvdG9jb2wgKGkuZS4gaW4gdGhlIGRvbWFpbiBuYW1lKS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQXQgbGVhc3Qgb25lIGxldHRlciBjaGFyYWN0ZXIgbXVzdCBleGlzdCBpbiB0aGUgZG9tYWluIG5hbWUgYWZ0ZXIgYSBwcm90b2NvbCBtYXRjaC4gRXg6IHNraXAgb3ZlciBzb21ldGhpbmcgXHJcblx0XHQgKiBsaWtlIFwiZ2l0OjEuMFwiXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsTWF0Y2ggVGhlIG1hdGNoZWQgVVJMLCBpZiB0aGVyZSB3YXMgb25lLiBXaWxsIGJlIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgbWF0Y2ggaXMgbm90IGEgVVJMIG1hdGNoLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHByb3RvY29sVXJsTWF0Y2ggVGhlIG1hdGNoIFVSTCBzdHJpbmcgZm9yIGEgcHJvdG9jb2wgbWF0Y2guIEV4OiAnaHR0cDovL3lhaG9vLmNvbScuIFRoaXMgaXMgdXNlZCB0b1xyXG5cdFx0ICogICBrbm93IHdoZXRoZXIgb3Igbm90IHdlIGhhdmUgYSBwcm90b2NvbCBpbiB0aGUgVVJMIHN0cmluZywgaW4gb3JkZXIgdG8gY2hlY2sgZm9yIGEgd29yZCBjaGFyYWN0ZXIgYWZ0ZXIgdGhlIHByb3RvY29sXHJcblx0XHQgKiAgIHNlcGFyYXRvciAoJzonKS5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgVVJMIG1hdGNoIGRvZXMgbm90IGhhdmUgYXQgbGVhc3Qgb25lIHdvcmQgY2hhcmFjdGVyIGluIGl0IGFmdGVyIHRoZSBwcm90b2NvbCwgYGZhbHNlYFxyXG5cdFx0ICogICBvdGhlcndpc2UuXHJcblx0XHQgKi9cclxuXHRcdHVybE1hdGNoRG9lc05vdEhhdmVBdExlYXN0T25lV29yZENoYXIgOiBmdW5jdGlvbiggdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2ggKSB7XHJcblx0XHRcdGlmKCB1cmxNYXRjaCAmJiBwcm90b2NvbFVybE1hdGNoICkge1xyXG5cdFx0XHRcdHJldHVybiAhdGhpcy5oYXNXb3JkQ2hhckFmdGVyUHJvdG9jb2xSZWdleC50ZXN0KCB1cmxNYXRjaCApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZXRlcm1pbmVzIGlmIGEgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2ggaXMgYW4gaW52YWxpZCBvbmUuIFRoaXMgbWV0aG9kIHJldHVybnMgYHRydWVgIGlmIHRoZXJlIGlzIGEgYHByb3RvY29sUmVsYXRpdmVNYXRjaGAsXHJcblx0XHQgKiBhbmQgdGhhdCBtYXRjaCBjb250YWlucyBhIHdvcmQgY2hhcmFjdGVyIGJlZm9yZSB0aGUgJy8vJyAoaS5lLiBpdCBtdXN0IGNvbnRhaW4gd2hpdGVzcGFjZSBvciBub3RoaW5nIGJlZm9yZSB0aGUgJy8vJyBpblxyXG5cdFx0ICogb3JkZXIgdG8gYmUgY29uc2lkZXJlZCB2YWxpZCkuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xSZWxhdGl2ZU1hdGNoIFRoZSBwcm90b2NvbC1yZWxhdGl2ZSBzdHJpbmcgZm9yIGEgVVJMIG1hdGNoIChpLmUuICcvLycpLCBwb3NzaWJseSB3aXRoIGEgcHJlY2VkaW5nXHJcblx0XHQgKiAgIGNoYXJhY3RlciAoZXgsIGEgc3BhY2UsIHN1Y2ggYXM6ICcgLy8nLCBvciBhIGxldHRlciwgc3VjaCBhczogJ2EvLycpLiBUaGUgbWF0Y2ggaXMgaW52YWxpZCBpZiB0aGVyZSBpcyBhIHdvcmQgY2hhcmFjdGVyXHJcblx0XHQgKiAgIHByZWNlZGluZyB0aGUgJy8vJy5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBpdCBpcyBhbiBpbnZhbGlkIHByb3RvY29sLXJlbGF0aXZlIG1hdGNoLCBgZmFsc2VgIG90aGVyd2lzZS5cclxuXHRcdCAqL1xyXG5cdFx0aXNJbnZhbGlkUHJvdG9jb2xSZWxhdGl2ZU1hdGNoIDogZnVuY3Rpb24oIHByb3RvY29sUmVsYXRpdmVNYXRjaCApIHtcclxuXHRcdFx0cmV0dXJuICggISFwcm90b2NvbFJlbGF0aXZlTWF0Y2ggJiYgdGhpcy5pbnZhbGlkUHJvdG9jb2xSZWxNYXRjaFJlZ2V4LnRlc3QoIHByb3RvY29sUmVsYXRpdmVNYXRjaCApICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHQvKmdsb2JhbCBBdXRvbGlua2VyICovXHJcblx0Lypqc2hpbnQgc3ViOnRydWUgKi9cclxuXHQvKipcclxuXHQgKiBAcHJvdGVjdGVkXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIuQW5jaG9yVGFnQnVpbGRlclxyXG5cdCAqIEBleHRlbmRzIE9iamVjdFxyXG5cdCAqIFxyXG5cdCAqIEJ1aWxkcyBhbmNob3IgKCZsdDthJmd0OykgdGFncyBmb3IgdGhlIEF1dG9saW5rZXIgdXRpbGl0eSB3aGVuIGEgbWF0Y2ggaXMgZm91bmQuXHJcblx0ICogXHJcblx0ICogTm9ybWFsbHkgdGhpcyBjbGFzcyBpcyBpbnN0YW50aWF0ZWQsIGNvbmZpZ3VyZWQsIGFuZCB1c2VkIGludGVybmFsbHkgYnkgYW4ge0BsaW5rIEF1dG9saW5rZXJ9IGluc3RhbmNlLCBidXQgbWF5IFxyXG5cdCAqIGFjdHVhbGx5IGJlIHJldHJpZXZlZCBpbiBhIHtAbGluayBBdXRvbGlua2VyI3JlcGxhY2VGbiByZXBsYWNlRm59IHRvIGNyZWF0ZSB7QGxpbmsgQXV0b2xpbmtlci5IdG1sVGFnIEh0bWxUYWd9IGluc3RhbmNlc1xyXG5cdCAqIHdoaWNoIG1heSBiZSBtb2RpZmllZCBiZWZvcmUgcmV0dXJuaW5nIGZyb20gdGhlIHtAbGluayBBdXRvbGlua2VyI3JlcGxhY2VGbiByZXBsYWNlRm59LiBGb3IgZXhhbXBsZTpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGh0bWwgPSBBdXRvbGlua2VyLmxpbmsoIFwiVGVzdCBnb29nbGUuY29tXCIsIHtcclxuXHQgKiAgICAgICAgIHJlcGxhY2VGbiA6IGZ1bmN0aW9uKCBhdXRvbGlua2VyLCBtYXRjaCApIHtcclxuXHQgKiAgICAgICAgICAgICB2YXIgdGFnID0gYXV0b2xpbmtlci5nZXRUYWdCdWlsZGVyKCkuYnVpbGQoIG1hdGNoICk7ICAvLyByZXR1cm5zIGFuIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWd9IGluc3RhbmNlXHJcblx0ICogICAgICAgICAgICAgdGFnLnNldEF0dHIoICdyZWwnLCAnbm9mb2xsb3cnICk7XHJcblx0ICogICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuXHQgKiAgICAgICAgIH1cclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgLy8gZ2VuZXJhdGVkIGh0bWw6XHJcblx0ICogICAgIC8vICAgVGVzdCA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub2ZvbGxvd1wiPmdvb2dsZS5jb208L2E+XHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5BbmNob3JUYWdCdWlsZGVyID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggT2JqZWN0LCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtCb29sZWFufSBuZXdXaW5kb3dcclxuXHRcdCAqIEBpbmhlcml0ZG9jIEF1dG9saW5rZXIjbmV3V2luZG93XHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge051bWJlcn0gdHJ1bmNhdGVcclxuXHRcdCAqIEBpbmhlcml0ZG9jIEF1dG9saW5rZXIjdHJ1bmNhdGVcclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7U3RyaW5nfSBjbGFzc05hbWVcclxuXHRcdCAqIEBpbmhlcml0ZG9jIEF1dG9saW5rZXIjY2xhc3NOYW1lXHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY29uc3RydWN0b3JcclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbY2ZnXSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgQW5jaG9yVGFnQnVpbGRlciBpbnN0YW5jZSwgc3BlY2lmaWVkIGluIGFuIE9iamVjdCAobWFwKS5cclxuXHRcdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IgOiBmdW5jdGlvbiggY2ZnICkge1xyXG5cdFx0XHRBdXRvbGlua2VyLlV0aWwuYXNzaWduKCB0aGlzLCBjZmcgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogR2VuZXJhdGVzIHRoZSBhY3R1YWwgYW5jaG9yICgmbHQ7YSZndDspIHRhZyB0byB1c2UgaW4gcGxhY2Ugb2YgdGhlIG1hdGNoZWQgVVJML2VtYWlsL1R3aXR0ZXIgdGV4dCxcclxuXHRcdCAqIHZpYSBpdHMgYG1hdGNoYCBvYmplY3QuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7QXV0b2xpbmtlci5tYXRjaC5NYXRjaH0gbWF0Y2ggVGhlIE1hdGNoIGluc3RhbmNlIHRvIGdlbmVyYXRlIGFuIGFuY2hvciB0YWcgZnJvbS5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhlIEh0bWxUYWcgaW5zdGFuY2UgZm9yIHRoZSBhbmNob3IgdGFnLlxyXG5cdFx0ICovXHJcblx0XHRidWlsZCA6IGZ1bmN0aW9uKCBtYXRjaCApIHtcclxuXHRcdFx0dmFyIHRhZyA9IG5ldyBBdXRvbGlua2VyLkh0bWxUYWcoIHtcclxuXHRcdFx0XHR0YWdOYW1lICAgOiAnYScsXHJcblx0XHRcdFx0YXR0cnMgICAgIDogdGhpcy5jcmVhdGVBdHRycyggbWF0Y2guZ2V0VHlwZSgpLCBtYXRjaC5nZXRBbmNob3JIcmVmKCkgKSxcclxuXHRcdFx0XHRpbm5lckh0bWwgOiB0aGlzLnByb2Nlc3NBbmNob3JUZXh0KCBtYXRjaC5nZXRBbmNob3JUZXh0KCkgKVxyXG5cdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGFnO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIHRoZSBPYmplY3QgKG1hcCkgb2YgdGhlIEhUTUwgYXR0cmlidXRlcyBmb3IgdGhlIGFuY2hvciAoJmx0O2EmZ3Q7KSB0YWcgYmVpbmcgZ2VuZXJhdGVkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJvdGVjdGVkXHJcblx0XHQgKiBAcGFyYW0ge1widXJsXCIvXCJlbWFpbFwiL1widHdpdHRlclwifSBtYXRjaFR5cGUgVGhlIHR5cGUgb2YgbWF0Y2ggdGhhdCBhbiBhbmNob3IgdGFnIGlzIGJlaW5nIGdlbmVyYXRlZCBmb3IuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gaHJlZiBUaGUgaHJlZiBmb3IgdGhlIGFuY2hvciB0YWcuXHJcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IEEga2V5L3ZhbHVlIE9iamVjdCAobWFwKSBvZiB0aGUgYW5jaG9yIHRhZydzIGF0dHJpYnV0ZXMuIFxyXG5cdFx0ICovXHJcblx0XHRjcmVhdGVBdHRycyA6IGZ1bmN0aW9uKCBtYXRjaFR5cGUsIGFuY2hvckhyZWYgKSB7XHJcblx0XHRcdHZhciBhdHRycyA9IHtcclxuXHRcdFx0XHQnaHJlZicgOiBhbmNob3JIcmVmICAvLyB3ZSdsbCBhbHdheXMgaGF2ZSB0aGUgYGhyZWZgIGF0dHJpYnV0ZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGNzc0NsYXNzID0gdGhpcy5jcmVhdGVDc3NDbGFzcyggbWF0Y2hUeXBlICk7XHJcblx0XHRcdGlmKCBjc3NDbGFzcyApIHtcclxuXHRcdFx0XHRhdHRyc1sgJ2NsYXNzJyBdID0gY3NzQ2xhc3M7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIHRoaXMubmV3V2luZG93ICkge1xyXG5cdFx0XHRcdGF0dHJzWyAndGFyZ2V0JyBdID0gXCJfYmxhbmtcIjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGF0dHJzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIHRoZSBDU1MgY2xhc3MgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGEgZ2l2ZW4gYW5jaG9yIHRhZywgYmFzZWQgb24gdGhlIGBtYXRjaFR5cGVgIGFuZCB0aGUge0BsaW5rICNjbGFzc05hbWV9XHJcblx0XHQgKiBjb25maWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1widXJsXCIvXCJlbWFpbFwiL1widHdpdHRlclwifSBtYXRjaFR5cGUgVGhlIHR5cGUgb2YgbWF0Y2ggdGhhdCBhbiBhbmNob3IgdGFnIGlzIGJlaW5nIGdlbmVyYXRlZCBmb3IuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBDU1MgY2xhc3Mgc3RyaW5nIGZvciB0aGUgbGluay4gRXhhbXBsZSByZXR1cm46IFwibXlMaW5rIG15TGluay11cmxcIi4gSWYgbm8ge0BsaW5rICNjbGFzc05hbWV9XHJcblx0XHQgKiAgIHdhcyBjb25maWd1cmVkLCByZXR1cm5zIGFuIGVtcHR5IHN0cmluZy5cclxuXHRcdCAqL1xyXG5cdFx0Y3JlYXRlQ3NzQ2xhc3MgOiBmdW5jdGlvbiggbWF0Y2hUeXBlICkge1xyXG5cdFx0XHR2YXIgY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XHJcblxyXG5cdFx0XHRpZiggIWNsYXNzTmFtZSApIFxyXG5cdFx0XHRcdHJldHVybiBcIlwiO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGNsYXNzTmFtZSArIFwiIFwiICsgY2xhc3NOYW1lICsgXCItXCIgKyBtYXRjaFR5cGU7ICAvLyBleDogXCJteUxpbmsgbXlMaW5rLXVybFwiLCBcIm15TGluayBteUxpbmstZW1haWxcIiwgb3IgXCJteUxpbmsgbXlMaW5rLXR3aXR0ZXJcIlxyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBQcm9jZXNzZXMgdGhlIGBhbmNob3JUZXh0YCBieSB0cnVuY2F0aW5nIHRoZSB0ZXh0IGFjY29yZGluZyB0byB0aGUge0BsaW5rICN0cnVuY2F0ZX0gY29uZmlnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGFuY2hvclRleHQgVGhlIGFuY2hvciB0YWcncyB0ZXh0IChpLmUuIHdoYXQgd2lsbCBiZSBkaXNwbGF5ZWQpLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBUaGUgcHJvY2Vzc2VkIGBhbmNob3JUZXh0YC5cclxuXHRcdCAqL1xyXG5cdFx0cHJvY2Vzc0FuY2hvclRleHQgOiBmdW5jdGlvbiggYW5jaG9yVGV4dCApIHtcclxuXHRcdFx0YW5jaG9yVGV4dCA9IHRoaXMuZG9UcnVuY2F0ZSggYW5jaG9yVGV4dCApO1xyXG5cclxuXHRcdFx0cmV0dXJuIGFuY2hvclRleHQ7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFBlcmZvcm1zIHRoZSB0cnVuY2F0aW9uIG9mIHRoZSBgYW5jaG9yVGV4dGAsIGlmIHRoZSBgYW5jaG9yVGV4dGAgaXMgbG9uZ2VyIHRoYW4gdGhlIHtAbGluayAjdHJ1bmNhdGV9IG9wdGlvbi5cclxuXHRcdCAqIFRydW5jYXRlcyB0aGUgdGV4dCB0byAyIGNoYXJhY3RlcnMgZmV3ZXIgdGhhbiB0aGUge0BsaW5rICN0cnVuY2F0ZX0gb3B0aW9uLCBhbmQgYWRkcyBcIi4uXCIgdG8gdGhlIGVuZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSBhbmNob3IgdGFnJ3MgdGV4dCAoaS5lLiB3aGF0IHdpbGwgYmUgZGlzcGxheWVkKS5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHRydW5jYXRlZCBhbmNob3IgdGV4dC5cclxuXHRcdCAqL1xyXG5cdFx0ZG9UcnVuY2F0ZSA6IGZ1bmN0aW9uKCBhbmNob3JUZXh0ICkge1xyXG5cdFx0XHRyZXR1cm4gQXV0b2xpbmtlci5VdGlsLmVsbGlwc2lzKCBhbmNob3JUZXh0LCB0aGlzLnRydW5jYXRlIHx8IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSApO1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qKlxyXG5cdCAqIEBhYnN0cmFjdFxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLm1hdGNoLk1hdGNoXHJcblx0ICogXHJcblx0ICogUmVwcmVzZW50cyBhIG1hdGNoIGZvdW5kIGluIGFuIGlucHV0IHN0cmluZyB3aGljaCBzaG91bGQgYmUgQXV0b2xpbmtlZC4gQSBNYXRjaCBvYmplY3QgaXMgd2hhdCBpcyBwcm92aWRlZCBpbiBhIFxyXG5cdCAqIHtAbGluayBBdXRvbGlua2VyI3JlcGxhY2VGbiByZXBsYWNlRm59LCBhbmQgbWF5IGJlIHVzZWQgdG8gcXVlcnkgZm9yIGRldGFpbHMgYWJvdXQgdGhlIG1hdGNoLlxyXG5cdCAqIFxyXG5cdCAqIEZvciBleGFtcGxlOlxyXG5cdCAqIFxyXG5cdCAqICAgICB2YXIgaW5wdXQgPSBcIi4uLlwiOyAgLy8gc3RyaW5nIHdpdGggVVJMcywgRW1haWwgQWRkcmVzc2VzLCBhbmQgVHdpdHRlciBIYW5kbGVzXHJcblx0ICogICAgIFxyXG5cdCAqICAgICB2YXIgbGlua2VkVGV4dCA9IEF1dG9saW5rZXIubGluayggaW5wdXQsIHtcclxuXHQgKiAgICAgICAgIHJlcGxhY2VGbiA6IGZ1bmN0aW9uKCBhdXRvbGlua2VyLCBtYXRjaCApIHtcclxuXHQgKiAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJocmVmID0gXCIsIG1hdGNoLmdldEFuY2hvckhyZWYoKSApO1xyXG5cdCAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInRleHQgPSBcIiwgbWF0Y2guZ2V0QW5jaG9yVGV4dCgpICk7XHJcblx0ICogICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICBzd2l0Y2goIG1hdGNoLmdldFR5cGUoKSApIHtcclxuXHQgKiAgICAgICAgICAgICAgICAgY2FzZSAndXJsJyA6IFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwidXJsOiBcIiwgbWF0Y2guZ2V0VXJsKCkgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICdlbWFpbCcgOlxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZW1haWw6IFwiLCBtYXRjaC5nZXRFbWFpbCgpICk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgY2FzZSAndHdpdHRlcicgOlxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwidHdpdHRlcjogXCIsIG1hdGNoLmdldFR3aXR0ZXJIYW5kbGUoKSApO1xyXG5cdCAqICAgICAgICAgICAgIH1cclxuXHQgKiAgICAgICAgIH1cclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiBTZWUgdGhlIHtAbGluayBBdXRvbGlua2VyfSBjbGFzcyBmb3IgbW9yZSBkZXRhaWxzIG9uIHVzaW5nIHRoZSB7QGxpbmsgQXV0b2xpbmtlciNyZXBsYWNlRm4gcmVwbGFjZUZufS5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLm1hdGNoLk1hdGNoID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggT2JqZWN0LCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IG1hdGNoZWRUZXh0IChyZXF1aXJlZClcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIG9yaWdpbmFsIHRleHQgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjb25zdHJ1Y3RvclxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGNmZyBUaGUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGZvciB0aGUgTWF0Y2ggaW5zdGFuY2UsIHNwZWNpZmllZCBpbiBhbiBPYmplY3QgKG1hcCkuXHJcblx0XHQgKi9cclxuXHRcdGNvbnN0cnVjdG9yIDogZnVuY3Rpb24oIGNmZyApIHtcclxuXHRcdFx0QXV0b2xpbmtlci5VdGlsLmFzc2lnbiggdGhpcywgY2ZnICk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgYSBzdHJpbmcgbmFtZSBmb3IgdGhlIHR5cGUgb2YgbWF0Y2ggdGhhdCB0aGlzIGNsYXNzIHJlcHJlc2VudHMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBhYnN0cmFjdFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRUeXBlIDogQXV0b2xpbmtlci5VdGlsLmFic3RyYWN0TWV0aG9kLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHRleHQgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRNYXRjaGVkVGV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tYXRjaGVkVGV4dDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIGhyZWYgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEBhYnN0cmFjdFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRBbmNob3JIcmVmIDogQXV0b2xpbmtlci5VdGlsLmFic3RyYWN0TWV0aG9kLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciB0ZXh0IHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAYWJzdHJhY3RcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9yVGV4dCA6IEF1dG9saW5rZXIuVXRpbC5hYnN0cmFjdE1ldGhvZFxyXG5cclxuXHR9ICk7XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qKlxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLm1hdGNoLkVtYWlsXHJcblx0ICogQGV4dGVuZHMgQXV0b2xpbmtlci5tYXRjaC5NYXRjaFxyXG5cdCAqIFxyXG5cdCAqIFJlcHJlc2VudHMgYSBFbWFpbCBtYXRjaCBmb3VuZCBpbiBhbiBpbnB1dCBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIEF1dG9saW5rZWQuXHJcblx0ICogXHJcblx0ICogU2VlIHRoaXMgY2xhc3MncyBzdXBlcmNsYXNzICh7QGxpbmsgQXV0b2xpbmtlci5tYXRjaC5NYXRjaH0pIGZvciBtb3JlIGRldGFpbHMuXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5tYXRjaC5FbWFpbCA9IEF1dG9saW5rZXIuVXRpbC5leHRlbmQoIEF1dG9saW5rZXIubWF0Y2guTWF0Y2gsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gZW1haWwgKHJlcXVpcmVkKVxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgZW1haWwgYWRkcmVzcyB0aGF0IHdhcyBtYXRjaGVkLlxyXG5cdFx0ICovXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyBhIHN0cmluZyBuYW1lIGZvciB0aGUgdHlwZSBvZiBtYXRjaCB0aGF0IHRoaXMgY2xhc3MgcmVwcmVzZW50cy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRUeXBlIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAnZW1haWwnO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSBlbWFpbCBhZGRyZXNzIHRoYXQgd2FzIG1hdGNoZWQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0RW1haWwgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW1haWw7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciBocmVmIHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvckhyZWYgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICdtYWlsdG86JyArIHRoaXMuZW1haWw7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciB0ZXh0IHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvclRleHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW1haWw7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHQvKmdsb2JhbCBBdXRvbGlua2VyICovXHJcblx0LyoqXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIubWF0Y2guVHdpdHRlclxyXG5cdCAqIEBleHRlbmRzIEF1dG9saW5rZXIubWF0Y2guTWF0Y2hcclxuXHQgKiBcclxuXHQgKiBSZXByZXNlbnRzIGEgVHdpdHRlciBtYXRjaCBmb3VuZCBpbiBhbiBpbnB1dCBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIEF1dG9saW5rZWQuXHJcblx0ICogXHJcblx0ICogU2VlIHRoaXMgY2xhc3MncyBzdXBlcmNsYXNzICh7QGxpbmsgQXV0b2xpbmtlci5tYXRjaC5NYXRjaH0pIGZvciBtb3JlIGRldGFpbHMuXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5tYXRjaC5Ud2l0dGVyID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggQXV0b2xpbmtlci5tYXRjaC5NYXRjaCwge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7U3RyaW5nfSB0d2l0dGVySGFuZGxlIChyZXF1aXJlZClcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIFR3aXR0ZXIgaGFuZGxlIHRoYXQgd2FzIG1hdGNoZWQuXHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIG1hdGNoIHRoYXQgdGhpcyBjbGFzcyByZXByZXNlbnRzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFR5cGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICd0d2l0dGVyJztcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyBhIHN0cmluZyBuYW1lIGZvciB0aGUgdHlwZSBvZiBtYXRjaCB0aGF0IHRoaXMgY2xhc3MgcmVwcmVzZW50cy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRUd2l0dGVySGFuZGxlIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnR3aXR0ZXJIYW5kbGU7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciBocmVmIHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvckhyZWYgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICdodHRwczovL3R3aXR0ZXIuY29tLycgKyB0aGlzLnR3aXR0ZXJIYW5kbGU7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciB0ZXh0IHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvclRleHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICdAJyArIHRoaXMudHdpdHRlckhhbmRsZTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKipcclxuXHQgKiBAY2xhc3MgQXV0b2xpbmtlci5tYXRjaC5VcmxcclxuXHQgKiBAZXh0ZW5kcyBBdXRvbGlua2VyLm1hdGNoLk1hdGNoXHJcblx0ICogXHJcblx0ICogUmVwcmVzZW50cyBhIFVybCBtYXRjaCBmb3VuZCBpbiBhbiBpbnB1dCBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIEF1dG9saW5rZWQuXHJcblx0ICogXHJcblx0ICogU2VlIHRoaXMgY2xhc3MncyBzdXBlcmNsYXNzICh7QGxpbmsgQXV0b2xpbmtlci5tYXRjaC5NYXRjaH0pIGZvciBtb3JlIGRldGFpbHMuXHJcblx0ICovXHJcblx0QXV0b2xpbmtlci5tYXRjaC5VcmwgPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBBdXRvbGlua2VyLm1hdGNoLk1hdGNoLCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IHVybCAocmVxdWlyZWQpXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSB1cmwgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gcHJvdG9jb2xVcmxNYXRjaCAocmVxdWlyZWQpXHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiB0aGUgVVJMIGlzIGEgbWF0Y2ggd2hpY2ggYWxyZWFkeSBoYXMgYSBwcm90b2NvbCAoaS5lLiAnaHR0cDovLycpLCBgZmFsc2VgIGlmIHRoZSBtYXRjaCB3YXMgZnJvbSBhICd3d3cnIG9yXHJcblx0XHQgKiBrbm93biBUTEQgbWF0Y2guXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IHByb3RvY29sUmVsYXRpdmVNYXRjaCAocmVxdWlyZWQpXHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiB0aGUgVVJMIGlzIGEgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2guIEEgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2ggaXMgYSBVUkwgdGhhdCBzdGFydHMgd2l0aCAnLy8nLFxyXG5cdFx0ICogYW5kIHdpbGwgYmUgZWl0aGVyIGh0dHA6Ly8gb3IgaHR0cHM6Ly8gYmFzZWQgb24gdGhlIHByb3RvY29sIHRoYXQgdGhlIHNpdGUgaXMgbG9hZGVkIHVuZGVyLlxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtCb29sZWFufSBzdHJpcFByZWZpeCAocmVxdWlyZWQpXHJcblx0XHQgKiBAaW5oZXJpdGRvYyBBdXRvbGlua2VyI3N0cmlwUHJlZml4XHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtSZWdFeHB9IHVybFByZWZpeFJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIEEgcmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gcmVtb3ZlIHRoZSAnaHR0cDovLycgb3IgJ2h0dHBzOi8vJyBhbmQvb3IgdGhlICd3d3cuJyBmcm9tIFVSTHMuXHJcblx0XHQgKi9cclxuXHRcdHVybFByZWZpeFJlZ2V4OiAvXihodHRwcz86XFwvXFwvKT8od3d3XFwuKT8vaSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gcHJvdG9jb2xSZWxhdGl2ZVJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byByZW1vdmUgdGhlIHByb3RvY29sLXJlbGF0aXZlICcvLycgZnJvbSB0aGUge0BsaW5rICN1cmx9IHN0cmluZywgZm9yIHB1cnBvc2VzXHJcblx0XHQgKiBvZiB7QGxpbmsgI2dldEFuY2hvclRleHR9LiBBIHByb3RvY29sLXJlbGF0aXZlIFVSTCBpcywgZm9yIGV4YW1wbGUsIFwiLy95YWhvby5jb21cIlxyXG5cdFx0ICovXHJcblx0XHRwcm90b2NvbFJlbGF0aXZlUmVnZXggOiAvXlxcL1xcLy8sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtCb29sZWFufSBwcm90b2NvbFByZXBlbmRlZFxyXG5cdFx0ICogXHJcblx0XHQgKiBXaWxsIGJlIHNldCB0byBgdHJ1ZWAgaWYgdGhlICdodHRwOi8vJyBwcm90b2NvbCBoYXMgYmVlbiBwcmVwZW5kZWQgdG8gdGhlIHtAbGluayAjdXJsfSAoYmVjYXVzZSB0aGVcclxuXHRcdCAqIHtAbGluayAjdXJsfSBkaWQgbm90IGhhdmUgYSBwcm90b2NvbClcclxuXHRcdCAqL1xyXG5cdFx0cHJvdG9jb2xQcmVwZW5kZWQgOiBmYWxzZSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGEgc3RyaW5nIG5hbWUgZm9yIHRoZSB0eXBlIG9mIG1hdGNoIHRoYXQgdGhpcyBjbGFzcyByZXByZXNlbnRzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFR5cGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICd1cmwnO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSB1cmwgdGhhdCB3YXMgbWF0Y2hlZCwgYXNzdW1pbmcgdGhlIHByb3RvY29sIHRvIGJlICdodHRwOi8vJyBpZiB0aGUgb3JpZ2luYWxcclxuXHRcdCAqIG1hdGNoIHdhcyBtaXNzaW5nIGEgcHJvdG9jb2wuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0VXJsIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB1cmwgPSB0aGlzLnVybDtcclxuXHJcblx0XHRcdC8vIGlmIHRoZSB1cmwgc3RyaW5nIGRvZXNuJ3QgYmVnaW4gd2l0aCBhIHByb3RvY29sLCBhc3N1bWUgJ2h0dHA6Ly8nXHJcblx0XHRcdGlmKCAhdGhpcy5wcm90b2NvbFJlbGF0aXZlTWF0Y2ggJiYgIXRoaXMucHJvdG9jb2xVcmxNYXRjaCAmJiAhdGhpcy5wcm90b2NvbFByZXBlbmRlZCApIHtcclxuXHRcdFx0XHR1cmwgPSB0aGlzLnVybCA9ICdodHRwOi8vJyArIHVybDtcclxuXHJcblx0XHRcdFx0dGhpcy5wcm90b2NvbFByZXBlbmRlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGFuY2hvciBocmVmIHRoYXQgc2hvdWxkIGJlIGdlbmVyYXRlZCBmb3IgdGhlIG1hdGNoLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvckhyZWYgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHVybCA9IHRoaXMuZ2V0VXJsKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8mYW1wOy9nLCAnJicgKTsgIC8vIGFueSAmYW1wOydzIGluIHRoZSBVUkwgc2hvdWxkIGJlIGNvbnZlcnRlZCBiYWNrIHRvICcmJyBpZiB0aGV5IHdlcmUgZGlzcGxheWVkIGFzICZhbXA7IGluIHRoZSBzb3VyY2UgaHRtbCBcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIHRleHQgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9yVGV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgYW5jaG9yVGV4dCA9IHRoaXMuZ2V0VXJsKCk7XHJcblxyXG5cdFx0XHRpZiggdGhpcy5wcm90b2NvbFJlbGF0aXZlTWF0Y2ggKSB7XHJcblx0XHRcdFx0Ly8gU3RyaXAgb2ZmIGFueSBwcm90b2NvbC1yZWxhdGl2ZSAnLy8nIGZyb20gdGhlIGFuY2hvciB0ZXh0XHJcblx0XHRcdFx0YW5jaG9yVGV4dCA9IHRoaXMuc3RyaXBQcm90b2NvbFJlbGF0aXZlUHJlZml4KCBhbmNob3JUZXh0ICk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIHRoaXMuc3RyaXBQcmVmaXggKSB7XHJcblx0XHRcdFx0YW5jaG9yVGV4dCA9IHRoaXMuc3RyaXBVcmxQcmVmaXgoIGFuY2hvclRleHQgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhbmNob3JUZXh0ID0gdGhpcy5yZW1vdmVUcmFpbGluZ1NsYXNoKCBhbmNob3JUZXh0ICk7ICAvLyByZW1vdmUgdHJhaWxpbmcgc2xhc2gsIGlmIHRoZXJlIGlzIG9uZVxyXG5cclxuXHRcdFx0cmV0dXJuIGFuY2hvclRleHQ7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHQvLyBVdGlsaXR5IEZ1bmN0aW9uYWxpdHlcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN0cmlwcyB0aGUgVVJMIHByZWZpeCAoc3VjaCBhcyBcImh0dHA6Ly9cIiBvciBcImh0dHBzOi8vXCIpIGZyb20gdGhlIGdpdmVuIHRleHQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCBvZiB0aGUgYW5jaG9yIHRoYXQgaXMgYmVpbmcgZ2VuZXJhdGVkLCBmb3Igd2hpY2ggdG8gc3RyaXAgb2ZmIHRoZVxyXG5cdFx0ICogICB1cmwgcHJlZml4IChzdWNoIGFzIHN0cmlwcGluZyBvZmYgXCJodHRwOi8vXCIpXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBgYW5jaG9yVGV4dGAsIHdpdGggdGhlIHByZWZpeCBzdHJpcHBlZC5cclxuXHRcdCAqL1xyXG5cdFx0c3RyaXBVcmxQcmVmaXggOiBmdW5jdGlvbiggdGV4dCApIHtcclxuXHRcdFx0cmV0dXJuIHRleHQucmVwbGFjZSggdGhpcy51cmxQcmVmaXhSZWdleCwgJycgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3RyaXBzIGFueSBwcm90b2NvbC1yZWxhdGl2ZSAnLy8nIGZyb20gdGhlIGFuY2hvciB0ZXh0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgb2YgdGhlIGFuY2hvciB0aGF0IGlzIGJlaW5nIGdlbmVyYXRlZCwgZm9yIHdoaWNoIHRvIHN0cmlwIG9mZiB0aGVcclxuXHRcdCAqICAgcHJvdG9jb2wtcmVsYXRpdmUgcHJlZml4IChzdWNoIGFzIHN0cmlwcGluZyBvZmYgXCIvL1wiKVxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBUaGUgYGFuY2hvclRleHRgLCB3aXRoIHRoZSBwcm90b2NvbC1yZWxhdGl2ZSBwcmVmaXggc3RyaXBwZWQuXHJcblx0XHQgKi9cclxuXHRcdHN0cmlwUHJvdG9jb2xSZWxhdGl2ZVByZWZpeCA6IGZ1bmN0aW9uKCB0ZXh0ICkge1xyXG5cdFx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKCB0aGlzLnByb3RvY29sUmVsYXRpdmVSZWdleCwgJycgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmVtb3ZlcyBhbnkgdHJhaWxpbmcgc2xhc2ggZnJvbSB0aGUgZ2l2ZW4gYGFuY2hvclRleHRgLCBpbiBwcmVwYXJhdGlvbiBmb3IgdGhlIHRleHQgdG8gYmUgZGlzcGxheWVkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGFuY2hvclRleHQgVGhlIHRleHQgb2YgdGhlIGFuY2hvciB0aGF0IGlzIGJlaW5nIGdlbmVyYXRlZCwgZm9yIHdoaWNoIHRvIHJlbW92ZSBhbnkgdHJhaWxpbmdcclxuXHRcdCAqICAgc2xhc2ggKCcvJykgdGhhdCBtYXkgZXhpc3QuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBgYW5jaG9yVGV4dGAsIHdpdGggdGhlIHRyYWlsaW5nIHNsYXNoIHJlbW92ZWQuXHJcblx0XHQgKi9cclxuXHRcdHJlbW92ZVRyYWlsaW5nU2xhc2ggOiBmdW5jdGlvbiggYW5jaG9yVGV4dCApIHtcclxuXHRcdFx0aWYoIGFuY2hvclRleHQuY2hhckF0KCBhbmNob3JUZXh0Lmxlbmd0aCAtIDEgKSA9PT0gJy8nICkge1xyXG5cdFx0XHRcdGFuY2hvclRleHQgPSBhbmNob3JUZXh0LnNsaWNlKCAwLCAtMSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBhbmNob3JUZXh0O1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblxyXG5cdHJldHVybiBBdXRvbGlua2VyO1xyXG5cclxuXHJcbn0pKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB0aGUgbWFqb3JpdHkgb2YgdGhpcyBmaWxlIHdhcyB0YWtlbiBmcm9tIG1hcmtkb3duLWl0J3MgbGlua2lmeSBtZXRob2Rcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iLzkxNTkwMThlMmE0NDZmYzk3ZWIzYzZlNTA5YThjZGM0Y2MzYzM1OGEvbGliL3J1bGVzX2NvcmUvbGlua2lmeS5qc1xuXG52YXIgbGlua2lmeSA9IHJlcXVpcmUoJ2xpbmtpZnktaXQnKSgpO1xuXG5mdW5jdGlvbiBhcnJheVJlcGxhY2VBdCAoYSwgaSwgbWlkZGxlKSB7XG4gIHZhciBsZWZ0ID0gYS5zbGljZSgwLCBpKTtcbiAgdmFyIHJpZ2h0ID0gYS5zbGljZShpICsgMSk7XG4gIHJldHVybiBsZWZ0LmNvbmNhdChtaWRkbGUsIHJpZ2h0KTtcbn1cblxuZnVuY3Rpb24gaXNMaW5rT3BlbiAoc3RyKSB7XG4gIHJldHVybiAvXjxhWz5cXHNdL2kudGVzdChzdHIpO1xufVxuXG5mdW5jdGlvbiBpc0xpbmtDbG9zZSAoc3RyKSB7XG4gIHJldHVybiAvXjxcXC9hXFxzKj4vaS50ZXN0KHN0cik7XG59XG5cbmZ1bmN0aW9uIHRva2VuaXplTGlua3MgKHN0YXRlLCBjb250ZXh0KSB7XG4gIHZhciBpO1xuICB2YXIgajtcbiAgdmFyIGw7XG4gIHZhciB0b2tlbnM7XG4gIHZhciB0b2tlbjtcbiAgdmFyIG5vZGVzO1xuICB2YXIgbG47XG4gIHZhciB0ZXh0O1xuICB2YXIgcG9zO1xuICB2YXIgbGFzdFBvcztcbiAgdmFyIGxldmVsO1xuICB2YXIgbGlua3M7XG4gIHZhciBodG1sTGlua0xldmVsO1xuICB2YXIgYmxvY2tUb2tlbnMgPSBzdGF0ZS50b2tlbnM7XG4gIHZhciBodG1sO1xuXG4gIGZvciAoaiA9IDAsIGwgPSBibG9ja1Rva2Vucy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICBpZiAoYmxvY2tUb2tlbnNbal0udHlwZSAhPT0gJ2lubGluZScpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHRva2VucyA9IGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuO1xuICAgIGh0bWxMaW5rTGV2ZWwgPSAwO1xuXG4gICAgLy8gd2Ugc2NhbiBmcm9tIHRoZSBlbmQsIHRvIGtlZXAgcG9zaXRpb24gd2hlbiBuZXcgdGFncyBhZGRlZC5cbiAgICAvLyB1c2UgcmV2ZXJzZWQgbG9naWMgaW4gbGlua3Mgc3RhcnQvZW5kIG1hdGNoXG4gICAgZm9yIChpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgLy8gc2tpcCBjb250ZW50IG9mIG1hcmtkb3duIGxpbmtzXG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2xpbmtfY2xvc2UnKSB7XG4gICAgICAgIGktLTtcbiAgICAgICAgd2hpbGUgKHRva2Vuc1tpXS5sZXZlbCAhPT0gdG9rZW4ubGV2ZWwgJiYgdG9rZW5zW2ldLnR5cGUgIT09ICdsaW5rX29wZW4nKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2h0bWxfaW5saW5lJykgeyAvLyBza2lwIGNvbnRlbnQgb2YgaHRtbCB0YWcgbGlua3NcbiAgICAgICAgaWYgKGlzTGlua09wZW4odG9rZW4uY29udGVudCkgJiYgaHRtbExpbmtMZXZlbCA+IDApIHtcbiAgICAgICAgICBodG1sTGlua0xldmVsLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGlua0Nsb3NlKHRva2VuLmNvbnRlbnQpKSB7XG4gICAgICAgICAgaHRtbExpbmtMZXZlbCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaHRtbExpbmtMZXZlbCA+IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ3RleHQnIHx8ICFsaW5raWZ5LnRlc3QodG9rZW4uY29udGVudCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRleHQgPSB0b2tlbi5jb250ZW50O1xuICAgICAgbGlua3MgPSBsaW5raWZ5Lm1hdGNoKHRleHQpO1xuICAgICAgbm9kZXMgPSBbXTtcbiAgICAgIGxldmVsID0gdG9rZW4ubGV2ZWw7XG4gICAgICBsYXN0UG9zID0gMDtcblxuICAgICAgZm9yIChsbiA9IDA7IGxuIDwgbGlua3MubGVuZ3RoOyBsbisrKSB7IC8vIHNwbGl0IHN0cmluZyB0byBub2Rlc1xuICAgICAgICBpZiAoIXN0YXRlLm1kLmlubGluZS52YWxpZGF0ZUxpbmsobGlua3NbbG5dLnVybCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcyA9IGxpbmtzW2xuXS5pbmRleDtcblxuICAgICAgICBpZiAocG9zID4gbGFzdFBvcykge1xuICAgICAgICAgIGxldmVsID0gbGV2ZWw7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICBjb250ZW50OiB0ZXh0LnNsaWNlKGxhc3RQb3MsIHBvcyksXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwgPSBudWxsO1xuXG4gICAgICAgIGNvbnRleHQubGlua2lmaWVycy5zb21lKHJ1blVzZXJMaW5raWZpZXIpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdodG1sX2Jsb2NrJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGh0bWwsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgICAgICAgaHJlZjogbGlua3NbbG5dLnVybCxcbiAgICAgICAgICAgIHRhcmdldDogJycsXG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWwrK1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgY29udGVudDogbGlua3NbbG5dLnRleHQsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rX2Nsb3NlJyxcbiAgICAgICAgICAgIGxldmVsOiAtLWxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0UG9zID0gbGlua3NbbG5dLmxhc3RJbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhc3RQb3MgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgY29udGVudDogdGV4dC5zbGljZShsYXN0UG9zKSxcbiAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuID0gdG9rZW5zID0gYXJyYXlSZXBsYWNlQXQodG9rZW5zLCBpLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcnVuVXNlckxpbmtpZmllciAobGlua2lmaWVyKSB7XG4gICAgaHRtbCA9IGxpbmtpZmllcihsaW5rc1tsbl0udXJsLCBsaW5rc1tsbl0udGV4dCk7XG4gICAgcmV0dXJuIHR5cGVvZiBodG1sID09PSAnc3RyaW5nJztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRva2VuaXplTGlua3M7XG4iXX0=
