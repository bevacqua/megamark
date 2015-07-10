(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.megamark = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


module.exports = require('./lib/');

},{"./lib/":11}],2:[function(require,module,exports){
// HTML5 entities map: { name -> utf16string }
//
'use strict';

/*eslint quotes:0*/
module.exports = require('entities/maps/entities.json');

},{"entities/maps/entities.json":52}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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


var UNESCAPE_MD_RE  = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
var ENTITY_RE       = /&([a-z#][a-z0-9]{1,31});/gi;
var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

var entities = require('./entities');

function replaceEntityPattern(match, name) {
  var code = 0;

  if (has(entities, name)) {
    return entities[name];
  }

  if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
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

/*function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(ENTITY_RE, replaceEntityPattern);
}*/

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}

function unescapeAll(str) {
  if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) { return str; }

  return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
    if (escaped) { return escaped; }
    return replaceEntityPattern(match, entity);
  });
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

// Re-export libraries commonly used in both markdown-it and its plugins,
// so plugins won't have to depend on them explicitly, which reduces their
// bundled size (e.g. a browser build).
//
exports.lib                 = {};
exports.lib.mdurl           = require('mdurl');
exports.lib.ucmicro         = require('uc.micro');

exports.assign              = assign;
exports.isString            = isString;
exports.has                 = has;
exports.unescapeMd          = unescapeMd;
exports.unescapeAll         = unescapeAll;
exports.isValidEntityCode   = isValidEntityCode;
exports.fromCodePoint       = fromCodePoint;
// exports.replaceEntities     = replaceEntities;
exports.escapeHtml          = escapeHtml;
exports.arrayReplaceAt      = arrayReplaceAt;
exports.isWhiteSpace        = isWhiteSpace;
exports.isMdAsciiPunct      = isMdAsciiPunct;
exports.isPunctChar         = isPunctChar;
exports.escapeRE            = escapeRE;
exports.normalizeReference  = normalizeReference;

},{"./entities":2,"mdurl":58,"uc.micro":64,"uc.micro/categories/P/regex":62}],7:[function(require,module,exports){
// Just a shortcut for bulk export
'use strict';


exports.parseLinkLabel       = require('./parse_link_label');
exports.parseLinkDestination = require('./parse_link_destination');
exports.parseLinkTitle       = require('./parse_link_title');

},{"./parse_link_destination":8,"./parse_link_label":9,"./parse_link_title":10}],8:[function(require,module,exports){
// Parse link destination
//
'use strict';


var unescapeAll   = require('../common/utils').unescapeAll;


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
        result.str = unescapeAll(str.slice(start + 1, pos));
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

  result.str = unescapeAll(str.slice(start, pos));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};

},{"../common/utils":6}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
// Parse link title
//
'use strict';


var unescapeAll = require('../common/utils').unescapeAll;


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
      result.str = unescapeAll(str.slice(start + 1, pos));
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

},{"../common/utils":6}],11:[function(require,module,exports){
// Main perser class

'use strict';


var utils        = require('./common/utils');
var helpers      = require('./helpers');
var Renderer     = require('./renderer');
var ParserCore   = require('./parser_core');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var LinkifyIt    = require('linkify-it');
var mdurl        = require('mdurl');
var punycode     = require('punycode');


var config = {
  'default': require('./presets/default'),
  zero: require('./presets/zero'),
  commonmark: require('./presets/commonmark')
};


var BAD_PROTOCOLS    = [ 'vbscript', 'javascript', 'file' ];

function validateLink(url) {
  // url should be normalized at this point, and existing entities are decoded
  //
  var str = url.trim().toLowerCase();

  if (str.indexOf(':') >= 0 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) >= 0) {
    return false;
  }
  return true;
}

var RECODE_HOSTNAME_FOR = [ 'http:', 'https:', 'mailto:' ];

function normalizeLink(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch(er) {}
    }
  }

  return mdurl.encode(mdurl.format(parsed));
}

function normalizeLinkText(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname);
      } catch(er) {}
    }
  }

  return mdurl.decode(mdurl.format(parsed));
}


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

  /**
   * MarkdownIt#linkify -> LinkifyIt
   *
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
   * rule.
   **/
  this.linkify = new LinkifyIt();

  /**
   * MarkdownIt#validateLink(url) -> Boolean
   *
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:` and `vbscript:` schemas. You can change this
   * behaviour.
   *
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.validateLink = function () { return true; }
   * ```
   **/
  this.validateLink = validateLink;

  /**
   * MarkdownIt#normalizeLink(url) -> String
   *
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   **/
  this.normalizeLink = normalizeLink;

  /**
   * MarkdownIt#normalizeLinkText(url) -> String
   *
   * Function used to decode link url to a human-readable format`
   **/
  this.normalizeLinkText = normalizeLinkText;


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
 * `env` is used to pass data between "distributed" rules and return additional
 * metadata like reference info, needed for for renderer. It also can be used to
 * inject data in specific cases. Usually, you will be ok to pass `{}`,
 * and then pass updated object to renderer.
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
 * block tokens list with the single `inline` element, containing parsed inline
 * tokens in `children` property. Also updates `env` object.
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

},{"./common/utils":6,"./helpers":7,"./parser_block":12,"./parser_core":13,"./parser_inline":14,"./presets/commonmark":15,"./presets/default":16,"./presets/zero":17,"./renderer":18,"linkify-it":53,"mdurl":58,"punycode":69}],12:[function(require,module,exports){
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

},{"./ruler":19,"./rules_block/blockquote":20,"./rules_block/code":21,"./rules_block/fence":22,"./rules_block/heading":23,"./rules_block/hr":24,"./rules_block/html_block":25,"./rules_block/lheading":26,"./rules_block/list":27,"./rules_block/paragraph":28,"./rules_block/reference":29,"./rules_block/state_block":30,"./rules_block/table":31}],13:[function(require,module,exports){
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
  [ 'linkify',        require('./rules_core/linkify')        ],
  [ 'replacements',   require('./rules_core/replacements')   ],
  [ 'smartquotes',    require('./rules_core/smartquotes')    ]
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

},{"./ruler":19,"./rules_core/block":32,"./rules_core/inline":33,"./rules_core/linkify":34,"./rules_core/normalize":35,"./rules_core/replacements":36,"./rules_core/smartquotes":37,"./rules_core/state_core":38}],14:[function(require,module,exports){
/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/
'use strict';


var Ruler           = require('./ruler');


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


/**
 * new ParserInline()
 **/
function ParserInline() {
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
  var i, pos = state.pos,
      rules = this.ruler.getRules(''),
      len = rules.length,
      maxNesting = state.md.options.maxNesting,
      cache = state.cache;


  if (typeof cache[pos] !== 'undefined') {
    state.pos = cache[pos];
    return;
  }

  /*istanbul ignore else*/
  if (state.level < maxNesting) {
    for (i = 0; i < len; i++) {
      if (rules[i](state, true)) {
        cache[pos] = state.pos;
        return;
      }
    }
  }

  state.pos++;
  cache[pos] = state.pos;
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

},{"./ruler":19,"./rules_inline/autolink":39,"./rules_inline/backticks":40,"./rules_inline/emphasis":41,"./rules_inline/entity":42,"./rules_inline/escape":43,"./rules_inline/html_inline":44,"./rules_inline/image":45,"./rules_inline/link":46,"./rules_inline/newline":47,"./rules_inline/state_inline":48,"./rules_inline/strikethrough":49,"./rules_inline/text":50}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
/**
 * class Renderer
 *
 * Generates HTML from parsed token stream. Each instance has independent
 * copy of rules. Those can be rewritten with ease. Also, you can add new
 * rules if you create plugin and adds new token types.
 **/
'use strict';


var assign          = require('./common/utils').assign;
var unescapeAll     = require('./common/utils').unescapeAll;
var escapeHtml      = require('./common/utils').escapeHtml;


////////////////////////////////////////////////////////////////////////////////

var default_rules = {};


default_rules.code_inline = function (tokens, idx /*, options, env */) {
  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};


default_rules.code_block = function (tokens, idx /*, options, env */) {
  return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
};


default_rules.fence = function (tokens, idx, options, env, self) {
  var token = tokens[idx],
      langName = '',
      highlighted;

  if (token.info) {
    langName = unescapeAll(token.info.trim().split(/\s+/g)[0]);
    token.attrPush([ 'class', options.langPrefix + langName ]);
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  return  '<pre><code' + self.renderAttrs(token) + '>'
        + highlighted
        + '</code></pre>\n';
};


default_rules.image = function (tokens, idx, options, env, self) {
  var token = tokens[idx];

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    self.renderInlineAsText(token.children, options, env);

  return self.renderToken(tokens, idx, options, env, self);
};


default_rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
default_rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


default_rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};


default_rules.html_block = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
default_rules.html_inline = function (tokens, idx /*, options, env */) {
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
  this.rules = assign({}, default_rules);
}


/**
 * Renderer.renderAttrs(token) -> String
 *
 * Render token attributes to string.
 **/
Renderer.prototype.renderAttrs = function renderAttrs(token) {
  var i, l, result;

  if (!token.attrs) { return ''; }

  result = '';

  for (i = 0, l = token.attrs.length; i < l; i++) {
    result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
  }

  return result;
};


/**
 * Renderer.renderToken(tokens, idx, options) -> String
 * - tokens (Array): list of tokens
 * - idx (Numbed): token index to render
 * - options (Object): params of parser instance
 *
 * Default token renderer. Can be overriden by custom function
 * in [[Renderer#rules]].
 **/
Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
  var nextToken,
      result = '',
      needLf = false,
      token = tokens[idx];

  // Tight list paragraphs
  if (token.hidden) {
    return '';
  }

  // Insert a newline between hidden paragraph and subsequent opening
  // block-level tag.
  //
  // For example, here we should insert a newline before blockquote:
  //  - a
  //    >
  //
  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
    result += '\n';
  }

  // Add token name, e.g. `<img`
  result += (token.nesting === -1 ? '</' : '<') + token.tag;

  // Encode attributes, e.g. `<img src="foo"`
  result += this.renderAttrs(token);

  // Add a slash for self-closing tags, e.g. `<img src="foo" /`
  if (token.nesting === 0 && options.xhtmlOut) {
    result += ' /';
  }

  // Check if we need to add a newline after this tag
  if (token.block) {
    needLf = true;

    if (token.nesting === 1) {
      if (idx + 1 < tokens.length) {
        nextToken = tokens[idx + 1];

        if (nextToken.type === 'inline' || nextToken.hidden) {
          // Block-level tag containing an inline tag.
          //
          needLf = false;

        } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
          // Opening tag + closing tag of the same type. E.g. `<li></li>`.
          //
          needLf = false;
        }
      }
    }
  }

  result += needLf ? '>\n' : '>';

  return result;
};


/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/
Renderer.prototype.renderInline = function (tokens, options, env) {
  var type,
      result = '',
      rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (typeof rules[type] !== 'undefined') {
      result += rules[type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options, env);
    }
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
      rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'text') {
      result += rules.text(tokens, i, options, env, this);
    } else if (tokens[i].type === 'image') {
      result += this.renderInlineAsText(tokens[i].children, options, env);
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
  var i, len, type,
      result = '',
      rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else if (typeof rules[type] !== 'undefined') {
      result += rules[tokens[i].type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options, env);
    }
  }

  return result;
};

module.exports = Renderer;

},{"./common/utils":6}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
// Block quotes

'use strict';


module.exports = function blockquote(state, startLine, endLine, silent) {
  var nextLine, lastLineEmpty, oldTShift, oldBMarks, oldIndent, oldParentType, lines,
      terminatorRules, token,
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

  token        = state.push('blockquote_open', 'blockquote', 1);
  token.markup = '>';
  token.map    = lines = [ startLine, 0 ];

  state.md.block.tokenize(state, startLine, nextLine);

  token        = state.push('blockquote_close', 'blockquote', -1);
  token.markup = '>';

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

},{}],21:[function(require,module,exports){
// Code block (4 spaces padded)

'use strict';


module.exports = function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last, token;

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

  token         = state.push('code_block', 'code', 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
  token.map     = [ startLine, state.line ];

  return true;
};

},{}],22:[function(require,module,exports){
// fences (``` lang, ~~~ lang)

'use strict';


module.exports = function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem, token, markup,
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

  markup = state.src.slice(mem, pos);
  params = state.src.slice(pos, max);

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

  token         = state.push('fence', 'code', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};

},{}],23:[function(require,module,exports){
// heading (#, ##, ...)

'use strict';


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level, tmp, token,
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

  token        = state.push('heading_open', 'h' + String(level), 1);
  token.markup = '########'.slice(0, level);
  token.map    = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = state.src.slice(pos, max).trim();
  token.map      = [ startLine, state.line ];
  token.children = [];

  token        = state.push('heading_close', 'h' + String(level), -1);
  token.markup = '########'.slice(0, level);

  return true;
};

},{}],24:[function(require,module,exports){
// Horizontal rule

'use strict';


module.exports = function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch, token,
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

  token        = state.push('hr', 'hr', 0);
  token.map    = [ startLine, state.line ];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

  return true;
};

},{}],25:[function(require,module,exports){
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
  var ch, match, nextLine, token,
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

  token         = state.push('html_block', '', 0);
  token.map     = [ startLine, state.line ];
  token.content = state.getLines(startLine, nextLine, 0, true);

  return true;
};

},{"../common/html_blocks":3}],26:[function(require,module,exports){
// lheading (---, ===)

'use strict';


module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var marker, pos, max, token, level,
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
  level = (marker === 0x3D/* = */ ? 1 : 2);

  token          = state.push('heading_open', 'h' + String(level), 1);
  token.markup   = String.fromCharCode(marker);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = state.src.slice(pos, state.eMarks[startLine]).trim();
  token.map      = [ startLine, state.line - 1 ];
  token.children = [];

  token          = state.push('heading_close', 'h' + String(level), -1);
  token.markup   = String.fromCharCode(marker);

  return true;
};

},{}],27:[function(require,module,exports){
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
      state.tokens[i + 2].hidden = true;
      state.tokens[i].hidden = true;
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
      token,
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

    token       = state.push('ordered_list_open', 'ol', 1);
    if (markerValue > 1) {
      token.attrs = [ [ 'start', markerValue ] ];
    }

  } else {
    token       = state.push('bullet_list_open', 'ul', 1);
  }

  token.map    = listLines = [ startLine, 0 ];
  token.markup = String.fromCharCode(markerCharCode);

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
    token        = state.push('list_item_open', 'li', 1);
    token.markup = String.fromCharCode(markerCharCode);
    token.map    = itemLines = [ startLine, 0 ];

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

    token        = state.push('list_item_close', 'li', -1);
    token.markup = String.fromCharCode(markerCharCode);

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
  if (isOrdered) {
    token = state.push('ordered_list_close', 'ol', -1);
  } else {
    token = state.push('bullet_list_close', 'ul', -1);
  }
  token.markup = String.fromCharCode(markerCharCode);

  listLines[1] = nextLine;
  state.line = nextLine;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};

},{}],28:[function(require,module,exports){
// Paragraph

'use strict';


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var content, terminate, i, l, token,
      nextLine = startLine + 1,
      terminatorRules = state.md.block.ruler.getRules('paragraph'),
      endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
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

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;

  token          = state.push('paragraph_open', 'p', 1);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line ];
  token.children = [];

  token          = state.push('paragraph_close', 'p', -1);

  return true;
};

},{}],29:[function(require,module,exports){
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

  href = state.md.normalizeLink(res.str);
  if (!state.md.validateLink(href)) { return false; }

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

  // Reference can not terminate anything. This check is for safety only.
  /*istanbul ignore if*/
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

},{"../common/utils":6,"../helpers/parse_link_destination":8,"../helpers/parse_link_title":10}],30:[function(require,module,exports){
// Parser state class

'use strict';

var Token = require('../token');


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

// Push new token to "stream".
//
StateBlock.prototype.push = function (type, tag, nesting) {
  var token = new Token(type, tag, nesting);
  token.block = true;

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.tokens.push(token);
  return token;
};

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

// re-export Token class to use in block rules
StateBlock.prototype.Token = Token;


module.exports = StateBlock;

},{"../token":51}],31:[function(require,module,exports){
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
  var ch, lineText, pos, i, nextLine, rows, token,
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

  token     = state.push('table_open', 'table', 1);
  token.map = tableLines = [ startLine, 0 ];

  token     = state.push('thead_open', 'thead', 1);
  token.map = [ startLine, startLine + 1 ];

  token     = state.push('tr_open', 'tr', 1);
  token.map = [ startLine, startLine + 1 ];

  for (i = 0; i < rows.length; i++) {
    token          = state.push('th_open', 'th', 1);
    token.map      = [ startLine, startLine + 1 ];
    if (aligns[i]) {
      token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
    }

    token          = state.push('inline', '', 0);
    token.content  = rows[i].trim();
    token.map      = [ startLine, startLine + 1 ];
    token.children = [];

    token          = state.push('th_close', 'th', -1);
  }

  token     = state.push('tr_close', 'tr', -1);
  token     = state.push('thead_close', 'thead', -1);

  token     = state.push('tbody_open', 'tbody', 1);
  token.map = tbodyLines = [ startLine + 2, 0 ];

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    rows = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    // set number of columns to number of columns in header row
    rows.length = aligns.length;

    token = state.push('tr_open', 'tr', 1);
    for (i = 0; i < rows.length; i++) {
      token          = state.push('td_open', 'td', 1);
      if (aligns[i]) {
        token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
      }

      token          = state.push('inline', '', 0);
      token.content  = rows[i] ? rows[i].trim() : '';
      token.children = [];

      token          = state.push('td_close', 'td', -1);
    }
    token = state.push('tr_close', 'tr', -1);
  }
  token = state.push('tbody_close', 'tbody', -1);
  token = state.push('table_close', 'table', -1);

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};

},{}],32:[function(require,module,exports){
'use strict';


module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    token          = new state.Token('inline', '', 0);
    token.content  = state.src;
    token.map      = [ 0, 1 ];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//
'use strict';


var arrayReplaceAt = require('../common/utils').arrayReplaceAt;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
      level, htmlLinkLevel, url, fullUrl, urlText,
      blockTokens = state.tokens,
      links;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline' ||
        !state.md.linkify.pretest(blockTokens[j].content)) {
      continue;
    }

    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      currentToken = tokens[i];

      // Skip content of markdown links
      if (currentToken.type === 'link_close') {
        i--;
        while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (currentToken.type === 'html_inline') {
        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

        text = currentToken.content;
        links = state.md.linkify.match(text);

        // Now split string to nodes
        nodes = [];
        level = currentToken.level;
        lastPos = 0;

        for (ln = 0; ln < links.length; ln++) {

          url = links[ln].url;
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) { continue; }

          urlText = links[ln].text;

          // Linkifier might send raw hostnames like "example.com", where url
          // starts with domain name. So we prepend http:// in those cases,
          // and remove it afterwards.
          //
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
          } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }

          pos = links[ln].index;

          if (pos > lastPos) {
            token         = new state.Token('text', '', 0);
            token.content = text.slice(lastPos, pos);
            token.level   = level;
            nodes.push(token);
          }

          token         = new state.Token('link_open', 'a', 1);
          token.attrs   = [ [ 'href', fullUrl ] ];
          token.level   = level++;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          token         = new state.Token('text', '', 0);
          token.content = urlText;
          token.level   = level;
          nodes.push(token);

          token         = new state.Token('link_close', 'a', -1);
          token.level   = --level;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text.length) {
          token         = new state.Token('text', '', 0);
          token.content = text.slice(lastPos);
          token.level   = level;
          nodes.push(token);
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};

},{"../common/utils":6}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

function replaceFn(match, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}

function replace_scoped(inlineTokens) {
  var i, token;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];
    if (token.type === 'text') {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }
  }
}

function replace_rare(inlineTokens) {
  var i, token;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];
    if (token.type === 'text') {
      if (RARE_RE.test(token.content)) {
        token.content = token.content
                    .replace(/\+-/g, '±')
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
    }
  }
}


module.exports = function replace(state) {
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    if (SCOPED_ABBR_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }

    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }

  }
};

},{}],37:[function(require,module,exports){
// Convert straight quotation marks to typographic ones
//
'use strict';


var isWhiteSpace   = require('../common/utils').isWhiteSpace;
var isPunctChar    = require('../common/utils').isPunctChar;
var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;

var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var APOSTROPHE = '\u2019'; /* ’ */


function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}

function process_inlines(tokens, state) {
  var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
      isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
      canOpen, canClose, j, isSingle, stack;

  stack = [];

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

      canOpen = canClose = true;
      pos = t.index + 1;
      isSingle = (t[0] === "'");

      // treat begin/end of the line as a whitespace
      lastChar = t.index - 1 >= 0 ? text.charCodeAt(t.index - 1) : 0x20;
      nextChar = pos < max ? text.charCodeAt(pos) : 0x20;

      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

      isLastWhiteSpace = isWhiteSpace(lastChar);
      isNextWhiteSpace = isWhiteSpace(nextChar);

      if (isNextWhiteSpace) {
        canOpen = false;
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          canOpen = false;
        }
      }

      if (isLastWhiteSpace) {
        canClose = false;
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          canClose = false;
        }
      }

      if (nextChar === 0x22 /* " */ && t[0] === '"') {
        if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
          // special case: 1"" - count first quote as an inch
          canClose = canOpen = false;
        }
      }

      if (canOpen && canClose) {
        // treat this as the middle of the word
        canOpen = false;
        canClose = isNextPunctChar;
      }

      if (!canOpen && !canClose) {
        // middle of word
        if (isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
        continue;
      }

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


module.exports = function smartquotes(state) {
  /*eslint max-depth:0*/
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline' ||
        !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }

    process_inlines(state.tokens[blkIdx].children, state);
  }
};

},{"../common/utils":6}],38:[function(require,module,exports){
// Core state object
//
'use strict';

var Token = require('../token');


function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md; // link to parser instance
}

// re-export Token class to use in core rules
StateCore.prototype.Token = Token;


module.exports = StateCore;

},{"../token":51}],39:[function(require,module,exports){
// Process autolinks '<protocol:...>'

'use strict';

var url_schemas = require('../common/url_schemas');


/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, token,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  if (AUTOLINK_RE.test(tail)) {
    linkMatch = tail.match(AUTOLINK_RE);

    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) { return false; }

    url = linkMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  if (EMAIL_RE.test(tail)) {
    emailMatch = tail.match(EMAIL_RE);

    url = emailMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink('mailto:' + url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];
      token.markup  = 'autolink';
      token.info    = 'auto';

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
      token.markup  = 'autolink';
      token.info    = 'auto';
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};

},{"../common/url_schemas":5}],40:[function(require,module,exports){
// Parse backticks

'use strict';

module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
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
        token         = state.push('code_inline', 'code', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
                                 .replace(/[ \n]+/g, ' ')
                                 .trim();
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};

},{}],41:[function(require,module,exports){
// Process *this* and _that_
//
'use strict';


var isWhiteSpace   = require('../common/utils').isWhiteSpace;
var isPunctChar    = require('../common/utils').isPunctChar;
var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;


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

  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

  if (pos >= max) {
    can_open = false;
  }

  count = pos - start;

  // treat end of the line as a whitespace
  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      can_open = false;
    }
  }

  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      can_close = false;
    }
  }

  if (marker === 0x5F /* _ */) {
    if (can_open && can_close) {
      // "_" inside a word can neither open nor close an emphasis
      can_open = false;
      can_close = isNextPunctChar;
    }
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
      token,
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
    token        = state.push('strong_open', 'strong', 1);
    token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);
  }
  if (count % 2) {
    token        = state.push('em_open', 'em', 1);
    token.markup = String.fromCharCode(marker);
  }

  state.md.inline.tokenize(state);

  if (count % 2) {
    token        = state.push('em_close', 'em', -1);
    token.markup = String.fromCharCode(marker);
  }
  for (count = startCount; count > 1; count -= 2) {
    token        = state.push('strong_close', 'strong', -1);
    token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);
  }

  state.pos = state.posMax + startCount;
  state.posMax = max;
  return true;
};

},{"../common/utils":6}],42:[function(require,module,exports){
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

},{"../common/entities":2,"../common/utils":6}],43:[function(require,module,exports){
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
        state.push('hardbreak', 'br', 0);
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

},{}],44:[function(require,module,exports){
// Process html tags

'use strict';


var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function html_inline(state, silent) {
  var ch, match, max, token,
      pos = state.pos;

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
    token         = state.push('html_inline', '', 0);
    token.content = state.src.slice(pos, pos + match[0].length);
  }
  state.pos += match[0].length;
  return true;
};

},{"../common/html_re":4}],45:[function(require,module,exports){
// Process ![image](<src> "title")

'use strict';

var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../common/utils').normalizeReference;


module.exports = function image(state, silent) {
  var attrs,
      code,
      label,
      labelEnd,
      labelStart,
      pos,
      ref,
      res,
      title,
      token,
      tokens,
      start,
      href = '',
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
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
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

    token          = state.push('image', 'img', 0);
    token.attrs    = attrs = [ [ 'src', href ], [ 'alt', '' ] ];
    token.children = tokens;
    if (title) {
      attrs.push([ 'title', title ]);
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{"../common/utils":6,"../helpers/parse_link_destination":8,"../helpers/parse_link_label":9,"../helpers/parse_link_title":10}],46:[function(require,module,exports){
// Process [link](<to> "stuff")

'use strict';

var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../common/utils').normalizeReference;


module.exports = function link(state, silent) {
  var attrs,
      code,
      label,
      labelEnd,
      labelStart,
      pos,
      res,
      ref,
      title,
      token,
      href = '',
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
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
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

    token        = state.push('link_open', 'a', 1);
    token.attrs  = attrs = [ [ 'href', href ] ];
    if (title) {
      attrs.push([ 'title', title ]);
    }

    state.md.inline.tokenize(state);

    token        = state.push('link_close', 'a', -1);
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{"../common/utils":6,"../helpers/parse_link_destination":8,"../helpers/parse_link_label":9,"../helpers/parse_link_title":10}],47:[function(require,module,exports){
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
        state.push('hardbreak', 'br', 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push('softbreak', 'br', 0);
      }

    } else {
      state.push('softbreak', 'br', 0);
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

  state.pos = pos;
  return true;
};

},{}],48:[function(require,module,exports){
// Inline parser state

'use strict';


var Token = require('../token');

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

  this.cache = {};        // Stores { start: end } pairs. Useful for backtrack
                          // optimization of pairs parse (emphasis, strikes).
}


// Flush pending text
//
StateInline.prototype.pushPending = function () {
  var token = new Token('text', '', 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = '';
  return token;
};


// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }

  var token = new Token(type, tag, nesting);

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.pendingLevel = this.level;
  this.tokens.push(token);
  return token;
};

// re-export Token class to use in block rules
StateInline.prototype.Token = Token;


module.exports = StateInline;

},{"../token":51}],49:[function(require,module,exports){
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

  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

  if (pos >= max) {
    can_open = false;
  }

  count = pos - start;

  // treat end of the line as a whitespace
  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      can_open = false;
    }
  }

  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
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
      token,
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
  token        = state.push('s_open', 's', 1);
  token.markup = '~~';

  state.md.inline.tokenize(state);

  token        = state.push('s_close', 's', -1);
  token.markup = '~~';

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};

},{"../common/utils":6}],50:[function(require,module,exports){
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

// Alternative implementation, for memory.
//
// It costs 10% of performance, but allows extend terminators list, if place it
// to `ParcerInline` property. Probably, will switch to it sometime, such
// flexibility required.

/*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/

},{}],51:[function(require,module,exports){
// Token class

'use strict';


/**
 * class Token
 **/

/**
 * new Token(type, tag, nesting)
 *
 * Create new token and fill passed properties.
 **/
function Token(type, tag, nesting) {
  /**
   * Token#type -> String
   *
   * Type of the token (string, e.g. "paragraph_open")
   **/
  this.type     = type;

  /**
   * Token#tag -> String
   *
   * html tag name, e.g. "p"
   **/
  this.tag      = tag;

  /**
   * Token#attrs -> Array
   *
   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   **/
  this.attrs    = null;

  /**
   * Token#map -> Array
   *
   * Source map info. Format: `[ line_begin, line_end ]`
   **/
  this.map      = null;

  /**
   * Token#nesting -> Number
   *
   * Level change (number in {-1, 0, 1} set), where:
   *
   * -  `1` means the tag is opening
   * -  `0` means the tag is self-closing
   * - `-1` means the tag is closing
   **/
  this.nesting  = nesting;

  /**
   * Token#level -> Number
   *
   * nesting level, the same as `state.level`
   **/
  this.level    = 0;

  /**
   * Token#children -> Array
   *
   * An array of child nodes (inline and img tokens)
   **/
  this.children = null;

  /**
   * Token#content -> String
   *
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   **/
  this.content  = '';

  /**
   * Token#markup -> String
   *
   * '*' or '_' for emphasis, fence string for fence, etc.
   **/
  this.markup   = '';

  /**
   * Token#info -> String
   *
   * fence infostring
   **/
  this.info     = '';

  /**
   * Token#meta -> Object
   *
   * A place for plugins to store an arbitrary data
   **/
  this.meta     = null;

  /**
   * Token#block -> Boolean
   *
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   **/
  this.block    = false;

  /**
   * Token#hidden -> Boolean
   *
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   **/
  this.hidden   = false;
}


/**
 * Token.attrIndex(name) -> Number
 *
 * Search attribute index by name.
 **/
Token.prototype.attrIndex = function attrIndex(name) {
  var attrs, i, len;

  if (!this.attrs) { return -1; }

  attrs = this.attrs;

  for (i = 0, len = attrs.length; i < len; i++) {
    if (attrs[i][0] === name) { return i; }
  }
  return -1;
};


/**
 * Token.attrPush(attrData)
 *
 * Add `[ name, value ]` attribute to list. Init attrs if necessary
 **/
Token.prototype.attrPush = function attrPush(attrData) {
  if (this.attrs) {
    this.attrs.push(attrData);
  } else {
    this.attrs = [ attrData ];
  }
};


module.exports = Token;

},{}],52:[function(require,module,exports){
module.exports={"Aacute":"\u00C1","aacute":"\u00E1","Abreve":"\u0102","abreve":"\u0103","ac":"\u223E","acd":"\u223F","acE":"\u223E\u0333","Acirc":"\u00C2","acirc":"\u00E2","acute":"\u00B4","Acy":"\u0410","acy":"\u0430","AElig":"\u00C6","aelig":"\u00E6","af":"\u2061","Afr":"\uD835\uDD04","afr":"\uD835\uDD1E","Agrave":"\u00C0","agrave":"\u00E0","alefsym":"\u2135","aleph":"\u2135","Alpha":"\u0391","alpha":"\u03B1","Amacr":"\u0100","amacr":"\u0101","amalg":"\u2A3F","amp":"&","AMP":"&","andand":"\u2A55","And":"\u2A53","and":"\u2227","andd":"\u2A5C","andslope":"\u2A58","andv":"\u2A5A","ang":"\u2220","ange":"\u29A4","angle":"\u2220","angmsdaa":"\u29A8","angmsdab":"\u29A9","angmsdac":"\u29AA","angmsdad":"\u29AB","angmsdae":"\u29AC","angmsdaf":"\u29AD","angmsdag":"\u29AE","angmsdah":"\u29AF","angmsd":"\u2221","angrt":"\u221F","angrtvb":"\u22BE","angrtvbd":"\u299D","angsph":"\u2222","angst":"\u00C5","angzarr":"\u237C","Aogon":"\u0104","aogon":"\u0105","Aopf":"\uD835\uDD38","aopf":"\uD835\uDD52","apacir":"\u2A6F","ap":"\u2248","apE":"\u2A70","ape":"\u224A","apid":"\u224B","apos":"'","ApplyFunction":"\u2061","approx":"\u2248","approxeq":"\u224A","Aring":"\u00C5","aring":"\u00E5","Ascr":"\uD835\uDC9C","ascr":"\uD835\uDCB6","Assign":"\u2254","ast":"*","asymp":"\u2248","asympeq":"\u224D","Atilde":"\u00C3","atilde":"\u00E3","Auml":"\u00C4","auml":"\u00E4","awconint":"\u2233","awint":"\u2A11","backcong":"\u224C","backepsilon":"\u03F6","backprime":"\u2035","backsim":"\u223D","backsimeq":"\u22CD","Backslash":"\u2216","Barv":"\u2AE7","barvee":"\u22BD","barwed":"\u2305","Barwed":"\u2306","barwedge":"\u2305","bbrk":"\u23B5","bbrktbrk":"\u23B6","bcong":"\u224C","Bcy":"\u0411","bcy":"\u0431","bdquo":"\u201E","becaus":"\u2235","because":"\u2235","Because":"\u2235","bemptyv":"\u29B0","bepsi":"\u03F6","bernou":"\u212C","Bernoullis":"\u212C","Beta":"\u0392","beta":"\u03B2","beth":"\u2136","between":"\u226C","Bfr":"\uD835\uDD05","bfr":"\uD835\uDD1F","bigcap":"\u22C2","bigcirc":"\u25EF","bigcup":"\u22C3","bigodot":"\u2A00","bigoplus":"\u2A01","bigotimes":"\u2A02","bigsqcup":"\u2A06","bigstar":"\u2605","bigtriangledown":"\u25BD","bigtriangleup":"\u25B3","biguplus":"\u2A04","bigvee":"\u22C1","bigwedge":"\u22C0","bkarow":"\u290D","blacklozenge":"\u29EB","blacksquare":"\u25AA","blacktriangle":"\u25B4","blacktriangledown":"\u25BE","blacktriangleleft":"\u25C2","blacktriangleright":"\u25B8","blank":"\u2423","blk12":"\u2592","blk14":"\u2591","blk34":"\u2593","block":"\u2588","bne":"=\u20E5","bnequiv":"\u2261\u20E5","bNot":"\u2AED","bnot":"\u2310","Bopf":"\uD835\uDD39","bopf":"\uD835\uDD53","bot":"\u22A5","bottom":"\u22A5","bowtie":"\u22C8","boxbox":"\u29C9","boxdl":"\u2510","boxdL":"\u2555","boxDl":"\u2556","boxDL":"\u2557","boxdr":"\u250C","boxdR":"\u2552","boxDr":"\u2553","boxDR":"\u2554","boxh":"\u2500","boxH":"\u2550","boxhd":"\u252C","boxHd":"\u2564","boxhD":"\u2565","boxHD":"\u2566","boxhu":"\u2534","boxHu":"\u2567","boxhU":"\u2568","boxHU":"\u2569","boxminus":"\u229F","boxplus":"\u229E","boxtimes":"\u22A0","boxul":"\u2518","boxuL":"\u255B","boxUl":"\u255C","boxUL":"\u255D","boxur":"\u2514","boxuR":"\u2558","boxUr":"\u2559","boxUR":"\u255A","boxv":"\u2502","boxV":"\u2551","boxvh":"\u253C","boxvH":"\u256A","boxVh":"\u256B","boxVH":"\u256C","boxvl":"\u2524","boxvL":"\u2561","boxVl":"\u2562","boxVL":"\u2563","boxvr":"\u251C","boxvR":"\u255E","boxVr":"\u255F","boxVR":"\u2560","bprime":"\u2035","breve":"\u02D8","Breve":"\u02D8","brvbar":"\u00A6","bscr":"\uD835\uDCB7","Bscr":"\u212C","bsemi":"\u204F","bsim":"\u223D","bsime":"\u22CD","bsolb":"\u29C5","bsol":"\\","bsolhsub":"\u27C8","bull":"\u2022","bullet":"\u2022","bump":"\u224E","bumpE":"\u2AAE","bumpe":"\u224F","Bumpeq":"\u224E","bumpeq":"\u224F","Cacute":"\u0106","cacute":"\u0107","capand":"\u2A44","capbrcup":"\u2A49","capcap":"\u2A4B","cap":"\u2229","Cap":"\u22D2","capcup":"\u2A47","capdot":"\u2A40","CapitalDifferentialD":"\u2145","caps":"\u2229\uFE00","caret":"\u2041","caron":"\u02C7","Cayleys":"\u212D","ccaps":"\u2A4D","Ccaron":"\u010C","ccaron":"\u010D","Ccedil":"\u00C7","ccedil":"\u00E7","Ccirc":"\u0108","ccirc":"\u0109","Cconint":"\u2230","ccups":"\u2A4C","ccupssm":"\u2A50","Cdot":"\u010A","cdot":"\u010B","cedil":"\u00B8","Cedilla":"\u00B8","cemptyv":"\u29B2","cent":"\u00A2","centerdot":"\u00B7","CenterDot":"\u00B7","cfr":"\uD835\uDD20","Cfr":"\u212D","CHcy":"\u0427","chcy":"\u0447","check":"\u2713","checkmark":"\u2713","Chi":"\u03A7","chi":"\u03C7","circ":"\u02C6","circeq":"\u2257","circlearrowleft":"\u21BA","circlearrowright":"\u21BB","circledast":"\u229B","circledcirc":"\u229A","circleddash":"\u229D","CircleDot":"\u2299","circledR":"\u00AE","circledS":"\u24C8","CircleMinus":"\u2296","CirclePlus":"\u2295","CircleTimes":"\u2297","cir":"\u25CB","cirE":"\u29C3","cire":"\u2257","cirfnint":"\u2A10","cirmid":"\u2AEF","cirscir":"\u29C2","ClockwiseContourIntegral":"\u2232","CloseCurlyDoubleQuote":"\u201D","CloseCurlyQuote":"\u2019","clubs":"\u2663","clubsuit":"\u2663","colon":":","Colon":"\u2237","Colone":"\u2A74","colone":"\u2254","coloneq":"\u2254","comma":",","commat":"@","comp":"\u2201","compfn":"\u2218","complement":"\u2201","complexes":"\u2102","cong":"\u2245","congdot":"\u2A6D","Congruent":"\u2261","conint":"\u222E","Conint":"\u222F","ContourIntegral":"\u222E","copf":"\uD835\uDD54","Copf":"\u2102","coprod":"\u2210","Coproduct":"\u2210","copy":"\u00A9","COPY":"\u00A9","copysr":"\u2117","CounterClockwiseContourIntegral":"\u2233","crarr":"\u21B5","cross":"\u2717","Cross":"\u2A2F","Cscr":"\uD835\uDC9E","cscr":"\uD835\uDCB8","csub":"\u2ACF","csube":"\u2AD1","csup":"\u2AD0","csupe":"\u2AD2","ctdot":"\u22EF","cudarrl":"\u2938","cudarrr":"\u2935","cuepr":"\u22DE","cuesc":"\u22DF","cularr":"\u21B6","cularrp":"\u293D","cupbrcap":"\u2A48","cupcap":"\u2A46","CupCap":"\u224D","cup":"\u222A","Cup":"\u22D3","cupcup":"\u2A4A","cupdot":"\u228D","cupor":"\u2A45","cups":"\u222A\uFE00","curarr":"\u21B7","curarrm":"\u293C","curlyeqprec":"\u22DE","curlyeqsucc":"\u22DF","curlyvee":"\u22CE","curlywedge":"\u22CF","curren":"\u00A4","curvearrowleft":"\u21B6","curvearrowright":"\u21B7","cuvee":"\u22CE","cuwed":"\u22CF","cwconint":"\u2232","cwint":"\u2231","cylcty":"\u232D","dagger":"\u2020","Dagger":"\u2021","daleth":"\u2138","darr":"\u2193","Darr":"\u21A1","dArr":"\u21D3","dash":"\u2010","Dashv":"\u2AE4","dashv":"\u22A3","dbkarow":"\u290F","dblac":"\u02DD","Dcaron":"\u010E","dcaron":"\u010F","Dcy":"\u0414","dcy":"\u0434","ddagger":"\u2021","ddarr":"\u21CA","DD":"\u2145","dd":"\u2146","DDotrahd":"\u2911","ddotseq":"\u2A77","deg":"\u00B0","Del":"\u2207","Delta":"\u0394","delta":"\u03B4","demptyv":"\u29B1","dfisht":"\u297F","Dfr":"\uD835\uDD07","dfr":"\uD835\uDD21","dHar":"\u2965","dharl":"\u21C3","dharr":"\u21C2","DiacriticalAcute":"\u00B4","DiacriticalDot":"\u02D9","DiacriticalDoubleAcute":"\u02DD","DiacriticalGrave":"`","DiacriticalTilde":"\u02DC","diam":"\u22C4","diamond":"\u22C4","Diamond":"\u22C4","diamondsuit":"\u2666","diams":"\u2666","die":"\u00A8","DifferentialD":"\u2146","digamma":"\u03DD","disin":"\u22F2","div":"\u00F7","divide":"\u00F7","divideontimes":"\u22C7","divonx":"\u22C7","DJcy":"\u0402","djcy":"\u0452","dlcorn":"\u231E","dlcrop":"\u230D","dollar":"$","Dopf":"\uD835\uDD3B","dopf":"\uD835\uDD55","Dot":"\u00A8","dot":"\u02D9","DotDot":"\u20DC","doteq":"\u2250","doteqdot":"\u2251","DotEqual":"\u2250","dotminus":"\u2238","dotplus":"\u2214","dotsquare":"\u22A1","doublebarwedge":"\u2306","DoubleContourIntegral":"\u222F","DoubleDot":"\u00A8","DoubleDownArrow":"\u21D3","DoubleLeftArrow":"\u21D0","DoubleLeftRightArrow":"\u21D4","DoubleLeftTee":"\u2AE4","DoubleLongLeftArrow":"\u27F8","DoubleLongLeftRightArrow":"\u27FA","DoubleLongRightArrow":"\u27F9","DoubleRightArrow":"\u21D2","DoubleRightTee":"\u22A8","DoubleUpArrow":"\u21D1","DoubleUpDownArrow":"\u21D5","DoubleVerticalBar":"\u2225","DownArrowBar":"\u2913","downarrow":"\u2193","DownArrow":"\u2193","Downarrow":"\u21D3","DownArrowUpArrow":"\u21F5","DownBreve":"\u0311","downdownarrows":"\u21CA","downharpoonleft":"\u21C3","downharpoonright":"\u21C2","DownLeftRightVector":"\u2950","DownLeftTeeVector":"\u295E","DownLeftVectorBar":"\u2956","DownLeftVector":"\u21BD","DownRightTeeVector":"\u295F","DownRightVectorBar":"\u2957","DownRightVector":"\u21C1","DownTeeArrow":"\u21A7","DownTee":"\u22A4","drbkarow":"\u2910","drcorn":"\u231F","drcrop":"\u230C","Dscr":"\uD835\uDC9F","dscr":"\uD835\uDCB9","DScy":"\u0405","dscy":"\u0455","dsol":"\u29F6","Dstrok":"\u0110","dstrok":"\u0111","dtdot":"\u22F1","dtri":"\u25BF","dtrif":"\u25BE","duarr":"\u21F5","duhar":"\u296F","dwangle":"\u29A6","DZcy":"\u040F","dzcy":"\u045F","dzigrarr":"\u27FF","Eacute":"\u00C9","eacute":"\u00E9","easter":"\u2A6E","Ecaron":"\u011A","ecaron":"\u011B","Ecirc":"\u00CA","ecirc":"\u00EA","ecir":"\u2256","ecolon":"\u2255","Ecy":"\u042D","ecy":"\u044D","eDDot":"\u2A77","Edot":"\u0116","edot":"\u0117","eDot":"\u2251","ee":"\u2147","efDot":"\u2252","Efr":"\uD835\uDD08","efr":"\uD835\uDD22","eg":"\u2A9A","Egrave":"\u00C8","egrave":"\u00E8","egs":"\u2A96","egsdot":"\u2A98","el":"\u2A99","Element":"\u2208","elinters":"\u23E7","ell":"\u2113","els":"\u2A95","elsdot":"\u2A97","Emacr":"\u0112","emacr":"\u0113","empty":"\u2205","emptyset":"\u2205","EmptySmallSquare":"\u25FB","emptyv":"\u2205","EmptyVerySmallSquare":"\u25AB","emsp13":"\u2004","emsp14":"\u2005","emsp":"\u2003","ENG":"\u014A","eng":"\u014B","ensp":"\u2002","Eogon":"\u0118","eogon":"\u0119","Eopf":"\uD835\uDD3C","eopf":"\uD835\uDD56","epar":"\u22D5","eparsl":"\u29E3","eplus":"\u2A71","epsi":"\u03B5","Epsilon":"\u0395","epsilon":"\u03B5","epsiv":"\u03F5","eqcirc":"\u2256","eqcolon":"\u2255","eqsim":"\u2242","eqslantgtr":"\u2A96","eqslantless":"\u2A95","Equal":"\u2A75","equals":"=","EqualTilde":"\u2242","equest":"\u225F","Equilibrium":"\u21CC","equiv":"\u2261","equivDD":"\u2A78","eqvparsl":"\u29E5","erarr":"\u2971","erDot":"\u2253","escr":"\u212F","Escr":"\u2130","esdot":"\u2250","Esim":"\u2A73","esim":"\u2242","Eta":"\u0397","eta":"\u03B7","ETH":"\u00D0","eth":"\u00F0","Euml":"\u00CB","euml":"\u00EB","euro":"\u20AC","excl":"!","exist":"\u2203","Exists":"\u2203","expectation":"\u2130","exponentiale":"\u2147","ExponentialE":"\u2147","fallingdotseq":"\u2252","Fcy":"\u0424","fcy":"\u0444","female":"\u2640","ffilig":"\uFB03","fflig":"\uFB00","ffllig":"\uFB04","Ffr":"\uD835\uDD09","ffr":"\uD835\uDD23","filig":"\uFB01","FilledSmallSquare":"\u25FC","FilledVerySmallSquare":"\u25AA","fjlig":"fj","flat":"\u266D","fllig":"\uFB02","fltns":"\u25B1","fnof":"\u0192","Fopf":"\uD835\uDD3D","fopf":"\uD835\uDD57","forall":"\u2200","ForAll":"\u2200","fork":"\u22D4","forkv":"\u2AD9","Fouriertrf":"\u2131","fpartint":"\u2A0D","frac12":"\u00BD","frac13":"\u2153","frac14":"\u00BC","frac15":"\u2155","frac16":"\u2159","frac18":"\u215B","frac23":"\u2154","frac25":"\u2156","frac34":"\u00BE","frac35":"\u2157","frac38":"\u215C","frac45":"\u2158","frac56":"\u215A","frac58":"\u215D","frac78":"\u215E","frasl":"\u2044","frown":"\u2322","fscr":"\uD835\uDCBB","Fscr":"\u2131","gacute":"\u01F5","Gamma":"\u0393","gamma":"\u03B3","Gammad":"\u03DC","gammad":"\u03DD","gap":"\u2A86","Gbreve":"\u011E","gbreve":"\u011F","Gcedil":"\u0122","Gcirc":"\u011C","gcirc":"\u011D","Gcy":"\u0413","gcy":"\u0433","Gdot":"\u0120","gdot":"\u0121","ge":"\u2265","gE":"\u2267","gEl":"\u2A8C","gel":"\u22DB","geq":"\u2265","geqq":"\u2267","geqslant":"\u2A7E","gescc":"\u2AA9","ges":"\u2A7E","gesdot":"\u2A80","gesdoto":"\u2A82","gesdotol":"\u2A84","gesl":"\u22DB\uFE00","gesles":"\u2A94","Gfr":"\uD835\uDD0A","gfr":"\uD835\uDD24","gg":"\u226B","Gg":"\u22D9","ggg":"\u22D9","gimel":"\u2137","GJcy":"\u0403","gjcy":"\u0453","gla":"\u2AA5","gl":"\u2277","glE":"\u2A92","glj":"\u2AA4","gnap":"\u2A8A","gnapprox":"\u2A8A","gne":"\u2A88","gnE":"\u2269","gneq":"\u2A88","gneqq":"\u2269","gnsim":"\u22E7","Gopf":"\uD835\uDD3E","gopf":"\uD835\uDD58","grave":"`","GreaterEqual":"\u2265","GreaterEqualLess":"\u22DB","GreaterFullEqual":"\u2267","GreaterGreater":"\u2AA2","GreaterLess":"\u2277","GreaterSlantEqual":"\u2A7E","GreaterTilde":"\u2273","Gscr":"\uD835\uDCA2","gscr":"\u210A","gsim":"\u2273","gsime":"\u2A8E","gsiml":"\u2A90","gtcc":"\u2AA7","gtcir":"\u2A7A","gt":">","GT":">","Gt":"\u226B","gtdot":"\u22D7","gtlPar":"\u2995","gtquest":"\u2A7C","gtrapprox":"\u2A86","gtrarr":"\u2978","gtrdot":"\u22D7","gtreqless":"\u22DB","gtreqqless":"\u2A8C","gtrless":"\u2277","gtrsim":"\u2273","gvertneqq":"\u2269\uFE00","gvnE":"\u2269\uFE00","Hacek":"\u02C7","hairsp":"\u200A","half":"\u00BD","hamilt":"\u210B","HARDcy":"\u042A","hardcy":"\u044A","harrcir":"\u2948","harr":"\u2194","hArr":"\u21D4","harrw":"\u21AD","Hat":"^","hbar":"\u210F","Hcirc":"\u0124","hcirc":"\u0125","hearts":"\u2665","heartsuit":"\u2665","hellip":"\u2026","hercon":"\u22B9","hfr":"\uD835\uDD25","Hfr":"\u210C","HilbertSpace":"\u210B","hksearow":"\u2925","hkswarow":"\u2926","hoarr":"\u21FF","homtht":"\u223B","hookleftarrow":"\u21A9","hookrightarrow":"\u21AA","hopf":"\uD835\uDD59","Hopf":"\u210D","horbar":"\u2015","HorizontalLine":"\u2500","hscr":"\uD835\uDCBD","Hscr":"\u210B","hslash":"\u210F","Hstrok":"\u0126","hstrok":"\u0127","HumpDownHump":"\u224E","HumpEqual":"\u224F","hybull":"\u2043","hyphen":"\u2010","Iacute":"\u00CD","iacute":"\u00ED","ic":"\u2063","Icirc":"\u00CE","icirc":"\u00EE","Icy":"\u0418","icy":"\u0438","Idot":"\u0130","IEcy":"\u0415","iecy":"\u0435","iexcl":"\u00A1","iff":"\u21D4","ifr":"\uD835\uDD26","Ifr":"\u2111","Igrave":"\u00CC","igrave":"\u00EC","ii":"\u2148","iiiint":"\u2A0C","iiint":"\u222D","iinfin":"\u29DC","iiota":"\u2129","IJlig":"\u0132","ijlig":"\u0133","Imacr":"\u012A","imacr":"\u012B","image":"\u2111","ImaginaryI":"\u2148","imagline":"\u2110","imagpart":"\u2111","imath":"\u0131","Im":"\u2111","imof":"\u22B7","imped":"\u01B5","Implies":"\u21D2","incare":"\u2105","in":"\u2208","infin":"\u221E","infintie":"\u29DD","inodot":"\u0131","intcal":"\u22BA","int":"\u222B","Int":"\u222C","integers":"\u2124","Integral":"\u222B","intercal":"\u22BA","Intersection":"\u22C2","intlarhk":"\u2A17","intprod":"\u2A3C","InvisibleComma":"\u2063","InvisibleTimes":"\u2062","IOcy":"\u0401","iocy":"\u0451","Iogon":"\u012E","iogon":"\u012F","Iopf":"\uD835\uDD40","iopf":"\uD835\uDD5A","Iota":"\u0399","iota":"\u03B9","iprod":"\u2A3C","iquest":"\u00BF","iscr":"\uD835\uDCBE","Iscr":"\u2110","isin":"\u2208","isindot":"\u22F5","isinE":"\u22F9","isins":"\u22F4","isinsv":"\u22F3","isinv":"\u2208","it":"\u2062","Itilde":"\u0128","itilde":"\u0129","Iukcy":"\u0406","iukcy":"\u0456","Iuml":"\u00CF","iuml":"\u00EF","Jcirc":"\u0134","jcirc":"\u0135","Jcy":"\u0419","jcy":"\u0439","Jfr":"\uD835\uDD0D","jfr":"\uD835\uDD27","jmath":"\u0237","Jopf":"\uD835\uDD41","jopf":"\uD835\uDD5B","Jscr":"\uD835\uDCA5","jscr":"\uD835\uDCBF","Jsercy":"\u0408","jsercy":"\u0458","Jukcy":"\u0404","jukcy":"\u0454","Kappa":"\u039A","kappa":"\u03BA","kappav":"\u03F0","Kcedil":"\u0136","kcedil":"\u0137","Kcy":"\u041A","kcy":"\u043A","Kfr":"\uD835\uDD0E","kfr":"\uD835\uDD28","kgreen":"\u0138","KHcy":"\u0425","khcy":"\u0445","KJcy":"\u040C","kjcy":"\u045C","Kopf":"\uD835\uDD42","kopf":"\uD835\uDD5C","Kscr":"\uD835\uDCA6","kscr":"\uD835\uDCC0","lAarr":"\u21DA","Lacute":"\u0139","lacute":"\u013A","laemptyv":"\u29B4","lagran":"\u2112","Lambda":"\u039B","lambda":"\u03BB","lang":"\u27E8","Lang":"\u27EA","langd":"\u2991","langle":"\u27E8","lap":"\u2A85","Laplacetrf":"\u2112","laquo":"\u00AB","larrb":"\u21E4","larrbfs":"\u291F","larr":"\u2190","Larr":"\u219E","lArr":"\u21D0","larrfs":"\u291D","larrhk":"\u21A9","larrlp":"\u21AB","larrpl":"\u2939","larrsim":"\u2973","larrtl":"\u21A2","latail":"\u2919","lAtail":"\u291B","lat":"\u2AAB","late":"\u2AAD","lates":"\u2AAD\uFE00","lbarr":"\u290C","lBarr":"\u290E","lbbrk":"\u2772","lbrace":"{","lbrack":"[","lbrke":"\u298B","lbrksld":"\u298F","lbrkslu":"\u298D","Lcaron":"\u013D","lcaron":"\u013E","Lcedil":"\u013B","lcedil":"\u013C","lceil":"\u2308","lcub":"{","Lcy":"\u041B","lcy":"\u043B","ldca":"\u2936","ldquo":"\u201C","ldquor":"\u201E","ldrdhar":"\u2967","ldrushar":"\u294B","ldsh":"\u21B2","le":"\u2264","lE":"\u2266","LeftAngleBracket":"\u27E8","LeftArrowBar":"\u21E4","leftarrow":"\u2190","LeftArrow":"\u2190","Leftarrow":"\u21D0","LeftArrowRightArrow":"\u21C6","leftarrowtail":"\u21A2","LeftCeiling":"\u2308","LeftDoubleBracket":"\u27E6","LeftDownTeeVector":"\u2961","LeftDownVectorBar":"\u2959","LeftDownVector":"\u21C3","LeftFloor":"\u230A","leftharpoondown":"\u21BD","leftharpoonup":"\u21BC","leftleftarrows":"\u21C7","leftrightarrow":"\u2194","LeftRightArrow":"\u2194","Leftrightarrow":"\u21D4","leftrightarrows":"\u21C6","leftrightharpoons":"\u21CB","leftrightsquigarrow":"\u21AD","LeftRightVector":"\u294E","LeftTeeArrow":"\u21A4","LeftTee":"\u22A3","LeftTeeVector":"\u295A","leftthreetimes":"\u22CB","LeftTriangleBar":"\u29CF","LeftTriangle":"\u22B2","LeftTriangleEqual":"\u22B4","LeftUpDownVector":"\u2951","LeftUpTeeVector":"\u2960","LeftUpVectorBar":"\u2958","LeftUpVector":"\u21BF","LeftVectorBar":"\u2952","LeftVector":"\u21BC","lEg":"\u2A8B","leg":"\u22DA","leq":"\u2264","leqq":"\u2266","leqslant":"\u2A7D","lescc":"\u2AA8","les":"\u2A7D","lesdot":"\u2A7F","lesdoto":"\u2A81","lesdotor":"\u2A83","lesg":"\u22DA\uFE00","lesges":"\u2A93","lessapprox":"\u2A85","lessdot":"\u22D6","lesseqgtr":"\u22DA","lesseqqgtr":"\u2A8B","LessEqualGreater":"\u22DA","LessFullEqual":"\u2266","LessGreater":"\u2276","lessgtr":"\u2276","LessLess":"\u2AA1","lesssim":"\u2272","LessSlantEqual":"\u2A7D","LessTilde":"\u2272","lfisht":"\u297C","lfloor":"\u230A","Lfr":"\uD835\uDD0F","lfr":"\uD835\uDD29","lg":"\u2276","lgE":"\u2A91","lHar":"\u2962","lhard":"\u21BD","lharu":"\u21BC","lharul":"\u296A","lhblk":"\u2584","LJcy":"\u0409","ljcy":"\u0459","llarr":"\u21C7","ll":"\u226A","Ll":"\u22D8","llcorner":"\u231E","Lleftarrow":"\u21DA","llhard":"\u296B","lltri":"\u25FA","Lmidot":"\u013F","lmidot":"\u0140","lmoustache":"\u23B0","lmoust":"\u23B0","lnap":"\u2A89","lnapprox":"\u2A89","lne":"\u2A87","lnE":"\u2268","lneq":"\u2A87","lneqq":"\u2268","lnsim":"\u22E6","loang":"\u27EC","loarr":"\u21FD","lobrk":"\u27E6","longleftarrow":"\u27F5","LongLeftArrow":"\u27F5","Longleftarrow":"\u27F8","longleftrightarrow":"\u27F7","LongLeftRightArrow":"\u27F7","Longleftrightarrow":"\u27FA","longmapsto":"\u27FC","longrightarrow":"\u27F6","LongRightArrow":"\u27F6","Longrightarrow":"\u27F9","looparrowleft":"\u21AB","looparrowright":"\u21AC","lopar":"\u2985","Lopf":"\uD835\uDD43","lopf":"\uD835\uDD5D","loplus":"\u2A2D","lotimes":"\u2A34","lowast":"\u2217","lowbar":"_","LowerLeftArrow":"\u2199","LowerRightArrow":"\u2198","loz":"\u25CA","lozenge":"\u25CA","lozf":"\u29EB","lpar":"(","lparlt":"\u2993","lrarr":"\u21C6","lrcorner":"\u231F","lrhar":"\u21CB","lrhard":"\u296D","lrm":"\u200E","lrtri":"\u22BF","lsaquo":"\u2039","lscr":"\uD835\uDCC1","Lscr":"\u2112","lsh":"\u21B0","Lsh":"\u21B0","lsim":"\u2272","lsime":"\u2A8D","lsimg":"\u2A8F","lsqb":"[","lsquo":"\u2018","lsquor":"\u201A","Lstrok":"\u0141","lstrok":"\u0142","ltcc":"\u2AA6","ltcir":"\u2A79","lt":"<","LT":"<","Lt":"\u226A","ltdot":"\u22D6","lthree":"\u22CB","ltimes":"\u22C9","ltlarr":"\u2976","ltquest":"\u2A7B","ltri":"\u25C3","ltrie":"\u22B4","ltrif":"\u25C2","ltrPar":"\u2996","lurdshar":"\u294A","luruhar":"\u2966","lvertneqq":"\u2268\uFE00","lvnE":"\u2268\uFE00","macr":"\u00AF","male":"\u2642","malt":"\u2720","maltese":"\u2720","Map":"\u2905","map":"\u21A6","mapsto":"\u21A6","mapstodown":"\u21A7","mapstoleft":"\u21A4","mapstoup":"\u21A5","marker":"\u25AE","mcomma":"\u2A29","Mcy":"\u041C","mcy":"\u043C","mdash":"\u2014","mDDot":"\u223A","measuredangle":"\u2221","MediumSpace":"\u205F","Mellintrf":"\u2133","Mfr":"\uD835\uDD10","mfr":"\uD835\uDD2A","mho":"\u2127","micro":"\u00B5","midast":"*","midcir":"\u2AF0","mid":"\u2223","middot":"\u00B7","minusb":"\u229F","minus":"\u2212","minusd":"\u2238","minusdu":"\u2A2A","MinusPlus":"\u2213","mlcp":"\u2ADB","mldr":"\u2026","mnplus":"\u2213","models":"\u22A7","Mopf":"\uD835\uDD44","mopf":"\uD835\uDD5E","mp":"\u2213","mscr":"\uD835\uDCC2","Mscr":"\u2133","mstpos":"\u223E","Mu":"\u039C","mu":"\u03BC","multimap":"\u22B8","mumap":"\u22B8","nabla":"\u2207","Nacute":"\u0143","nacute":"\u0144","nang":"\u2220\u20D2","nap":"\u2249","napE":"\u2A70\u0338","napid":"\u224B\u0338","napos":"\u0149","napprox":"\u2249","natural":"\u266E","naturals":"\u2115","natur":"\u266E","nbsp":"\u00A0","nbump":"\u224E\u0338","nbumpe":"\u224F\u0338","ncap":"\u2A43","Ncaron":"\u0147","ncaron":"\u0148","Ncedil":"\u0145","ncedil":"\u0146","ncong":"\u2247","ncongdot":"\u2A6D\u0338","ncup":"\u2A42","Ncy":"\u041D","ncy":"\u043D","ndash":"\u2013","nearhk":"\u2924","nearr":"\u2197","neArr":"\u21D7","nearrow":"\u2197","ne":"\u2260","nedot":"\u2250\u0338","NegativeMediumSpace":"\u200B","NegativeThickSpace":"\u200B","NegativeThinSpace":"\u200B","NegativeVeryThinSpace":"\u200B","nequiv":"\u2262","nesear":"\u2928","nesim":"\u2242\u0338","NestedGreaterGreater":"\u226B","NestedLessLess":"\u226A","NewLine":"\n","nexist":"\u2204","nexists":"\u2204","Nfr":"\uD835\uDD11","nfr":"\uD835\uDD2B","ngE":"\u2267\u0338","nge":"\u2271","ngeq":"\u2271","ngeqq":"\u2267\u0338","ngeqslant":"\u2A7E\u0338","nges":"\u2A7E\u0338","nGg":"\u22D9\u0338","ngsim":"\u2275","nGt":"\u226B\u20D2","ngt":"\u226F","ngtr":"\u226F","nGtv":"\u226B\u0338","nharr":"\u21AE","nhArr":"\u21CE","nhpar":"\u2AF2","ni":"\u220B","nis":"\u22FC","nisd":"\u22FA","niv":"\u220B","NJcy":"\u040A","njcy":"\u045A","nlarr":"\u219A","nlArr":"\u21CD","nldr":"\u2025","nlE":"\u2266\u0338","nle":"\u2270","nleftarrow":"\u219A","nLeftarrow":"\u21CD","nleftrightarrow":"\u21AE","nLeftrightarrow":"\u21CE","nleq":"\u2270","nleqq":"\u2266\u0338","nleqslant":"\u2A7D\u0338","nles":"\u2A7D\u0338","nless":"\u226E","nLl":"\u22D8\u0338","nlsim":"\u2274","nLt":"\u226A\u20D2","nlt":"\u226E","nltri":"\u22EA","nltrie":"\u22EC","nLtv":"\u226A\u0338","nmid":"\u2224","NoBreak":"\u2060","NonBreakingSpace":"\u00A0","nopf":"\uD835\uDD5F","Nopf":"\u2115","Not":"\u2AEC","not":"\u00AC","NotCongruent":"\u2262","NotCupCap":"\u226D","NotDoubleVerticalBar":"\u2226","NotElement":"\u2209","NotEqual":"\u2260","NotEqualTilde":"\u2242\u0338","NotExists":"\u2204","NotGreater":"\u226F","NotGreaterEqual":"\u2271","NotGreaterFullEqual":"\u2267\u0338","NotGreaterGreater":"\u226B\u0338","NotGreaterLess":"\u2279","NotGreaterSlantEqual":"\u2A7E\u0338","NotGreaterTilde":"\u2275","NotHumpDownHump":"\u224E\u0338","NotHumpEqual":"\u224F\u0338","notin":"\u2209","notindot":"\u22F5\u0338","notinE":"\u22F9\u0338","notinva":"\u2209","notinvb":"\u22F7","notinvc":"\u22F6","NotLeftTriangleBar":"\u29CF\u0338","NotLeftTriangle":"\u22EA","NotLeftTriangleEqual":"\u22EC","NotLess":"\u226E","NotLessEqual":"\u2270","NotLessGreater":"\u2278","NotLessLess":"\u226A\u0338","NotLessSlantEqual":"\u2A7D\u0338","NotLessTilde":"\u2274","NotNestedGreaterGreater":"\u2AA2\u0338","NotNestedLessLess":"\u2AA1\u0338","notni":"\u220C","notniva":"\u220C","notnivb":"\u22FE","notnivc":"\u22FD","NotPrecedes":"\u2280","NotPrecedesEqual":"\u2AAF\u0338","NotPrecedesSlantEqual":"\u22E0","NotReverseElement":"\u220C","NotRightTriangleBar":"\u29D0\u0338","NotRightTriangle":"\u22EB","NotRightTriangleEqual":"\u22ED","NotSquareSubset":"\u228F\u0338","NotSquareSubsetEqual":"\u22E2","NotSquareSuperset":"\u2290\u0338","NotSquareSupersetEqual":"\u22E3","NotSubset":"\u2282\u20D2","NotSubsetEqual":"\u2288","NotSucceeds":"\u2281","NotSucceedsEqual":"\u2AB0\u0338","NotSucceedsSlantEqual":"\u22E1","NotSucceedsTilde":"\u227F\u0338","NotSuperset":"\u2283\u20D2","NotSupersetEqual":"\u2289","NotTilde":"\u2241","NotTildeEqual":"\u2244","NotTildeFullEqual":"\u2247","NotTildeTilde":"\u2249","NotVerticalBar":"\u2224","nparallel":"\u2226","npar":"\u2226","nparsl":"\u2AFD\u20E5","npart":"\u2202\u0338","npolint":"\u2A14","npr":"\u2280","nprcue":"\u22E0","nprec":"\u2280","npreceq":"\u2AAF\u0338","npre":"\u2AAF\u0338","nrarrc":"\u2933\u0338","nrarr":"\u219B","nrArr":"\u21CF","nrarrw":"\u219D\u0338","nrightarrow":"\u219B","nRightarrow":"\u21CF","nrtri":"\u22EB","nrtrie":"\u22ED","nsc":"\u2281","nsccue":"\u22E1","nsce":"\u2AB0\u0338","Nscr":"\uD835\uDCA9","nscr":"\uD835\uDCC3","nshortmid":"\u2224","nshortparallel":"\u2226","nsim":"\u2241","nsime":"\u2244","nsimeq":"\u2244","nsmid":"\u2224","nspar":"\u2226","nsqsube":"\u22E2","nsqsupe":"\u22E3","nsub":"\u2284","nsubE":"\u2AC5\u0338","nsube":"\u2288","nsubset":"\u2282\u20D2","nsubseteq":"\u2288","nsubseteqq":"\u2AC5\u0338","nsucc":"\u2281","nsucceq":"\u2AB0\u0338","nsup":"\u2285","nsupE":"\u2AC6\u0338","nsupe":"\u2289","nsupset":"\u2283\u20D2","nsupseteq":"\u2289","nsupseteqq":"\u2AC6\u0338","ntgl":"\u2279","Ntilde":"\u00D1","ntilde":"\u00F1","ntlg":"\u2278","ntriangleleft":"\u22EA","ntrianglelefteq":"\u22EC","ntriangleright":"\u22EB","ntrianglerighteq":"\u22ED","Nu":"\u039D","nu":"\u03BD","num":"#","numero":"\u2116","numsp":"\u2007","nvap":"\u224D\u20D2","nvdash":"\u22AC","nvDash":"\u22AD","nVdash":"\u22AE","nVDash":"\u22AF","nvge":"\u2265\u20D2","nvgt":">\u20D2","nvHarr":"\u2904","nvinfin":"\u29DE","nvlArr":"\u2902","nvle":"\u2264\u20D2","nvlt":"<\u20D2","nvltrie":"\u22B4\u20D2","nvrArr":"\u2903","nvrtrie":"\u22B5\u20D2","nvsim":"\u223C\u20D2","nwarhk":"\u2923","nwarr":"\u2196","nwArr":"\u21D6","nwarrow":"\u2196","nwnear":"\u2927","Oacute":"\u00D3","oacute":"\u00F3","oast":"\u229B","Ocirc":"\u00D4","ocirc":"\u00F4","ocir":"\u229A","Ocy":"\u041E","ocy":"\u043E","odash":"\u229D","Odblac":"\u0150","odblac":"\u0151","odiv":"\u2A38","odot":"\u2299","odsold":"\u29BC","OElig":"\u0152","oelig":"\u0153","ofcir":"\u29BF","Ofr":"\uD835\uDD12","ofr":"\uD835\uDD2C","ogon":"\u02DB","Ograve":"\u00D2","ograve":"\u00F2","ogt":"\u29C1","ohbar":"\u29B5","ohm":"\u03A9","oint":"\u222E","olarr":"\u21BA","olcir":"\u29BE","olcross":"\u29BB","oline":"\u203E","olt":"\u29C0","Omacr":"\u014C","omacr":"\u014D","Omega":"\u03A9","omega":"\u03C9","Omicron":"\u039F","omicron":"\u03BF","omid":"\u29B6","ominus":"\u2296","Oopf":"\uD835\uDD46","oopf":"\uD835\uDD60","opar":"\u29B7","OpenCurlyDoubleQuote":"\u201C","OpenCurlyQuote":"\u2018","operp":"\u29B9","oplus":"\u2295","orarr":"\u21BB","Or":"\u2A54","or":"\u2228","ord":"\u2A5D","order":"\u2134","orderof":"\u2134","ordf":"\u00AA","ordm":"\u00BA","origof":"\u22B6","oror":"\u2A56","orslope":"\u2A57","orv":"\u2A5B","oS":"\u24C8","Oscr":"\uD835\uDCAA","oscr":"\u2134","Oslash":"\u00D8","oslash":"\u00F8","osol":"\u2298","Otilde":"\u00D5","otilde":"\u00F5","otimesas":"\u2A36","Otimes":"\u2A37","otimes":"\u2297","Ouml":"\u00D6","ouml":"\u00F6","ovbar":"\u233D","OverBar":"\u203E","OverBrace":"\u23DE","OverBracket":"\u23B4","OverParenthesis":"\u23DC","para":"\u00B6","parallel":"\u2225","par":"\u2225","parsim":"\u2AF3","parsl":"\u2AFD","part":"\u2202","PartialD":"\u2202","Pcy":"\u041F","pcy":"\u043F","percnt":"%","period":".","permil":"\u2030","perp":"\u22A5","pertenk":"\u2031","Pfr":"\uD835\uDD13","pfr":"\uD835\uDD2D","Phi":"\u03A6","phi":"\u03C6","phiv":"\u03D5","phmmat":"\u2133","phone":"\u260E","Pi":"\u03A0","pi":"\u03C0","pitchfork":"\u22D4","piv":"\u03D6","planck":"\u210F","planckh":"\u210E","plankv":"\u210F","plusacir":"\u2A23","plusb":"\u229E","pluscir":"\u2A22","plus":"+","plusdo":"\u2214","plusdu":"\u2A25","pluse":"\u2A72","PlusMinus":"\u00B1","plusmn":"\u00B1","plussim":"\u2A26","plustwo":"\u2A27","pm":"\u00B1","Poincareplane":"\u210C","pointint":"\u2A15","popf":"\uD835\uDD61","Popf":"\u2119","pound":"\u00A3","prap":"\u2AB7","Pr":"\u2ABB","pr":"\u227A","prcue":"\u227C","precapprox":"\u2AB7","prec":"\u227A","preccurlyeq":"\u227C","Precedes":"\u227A","PrecedesEqual":"\u2AAF","PrecedesSlantEqual":"\u227C","PrecedesTilde":"\u227E","preceq":"\u2AAF","precnapprox":"\u2AB9","precneqq":"\u2AB5","precnsim":"\u22E8","pre":"\u2AAF","prE":"\u2AB3","precsim":"\u227E","prime":"\u2032","Prime":"\u2033","primes":"\u2119","prnap":"\u2AB9","prnE":"\u2AB5","prnsim":"\u22E8","prod":"\u220F","Product":"\u220F","profalar":"\u232E","profline":"\u2312","profsurf":"\u2313","prop":"\u221D","Proportional":"\u221D","Proportion":"\u2237","propto":"\u221D","prsim":"\u227E","prurel":"\u22B0","Pscr":"\uD835\uDCAB","pscr":"\uD835\uDCC5","Psi":"\u03A8","psi":"\u03C8","puncsp":"\u2008","Qfr":"\uD835\uDD14","qfr":"\uD835\uDD2E","qint":"\u2A0C","qopf":"\uD835\uDD62","Qopf":"\u211A","qprime":"\u2057","Qscr":"\uD835\uDCAC","qscr":"\uD835\uDCC6","quaternions":"\u210D","quatint":"\u2A16","quest":"?","questeq":"\u225F","quot":"\"","QUOT":"\"","rAarr":"\u21DB","race":"\u223D\u0331","Racute":"\u0154","racute":"\u0155","radic":"\u221A","raemptyv":"\u29B3","rang":"\u27E9","Rang":"\u27EB","rangd":"\u2992","range":"\u29A5","rangle":"\u27E9","raquo":"\u00BB","rarrap":"\u2975","rarrb":"\u21E5","rarrbfs":"\u2920","rarrc":"\u2933","rarr":"\u2192","Rarr":"\u21A0","rArr":"\u21D2","rarrfs":"\u291E","rarrhk":"\u21AA","rarrlp":"\u21AC","rarrpl":"\u2945","rarrsim":"\u2974","Rarrtl":"\u2916","rarrtl":"\u21A3","rarrw":"\u219D","ratail":"\u291A","rAtail":"\u291C","ratio":"\u2236","rationals":"\u211A","rbarr":"\u290D","rBarr":"\u290F","RBarr":"\u2910","rbbrk":"\u2773","rbrace":"}","rbrack":"]","rbrke":"\u298C","rbrksld":"\u298E","rbrkslu":"\u2990","Rcaron":"\u0158","rcaron":"\u0159","Rcedil":"\u0156","rcedil":"\u0157","rceil":"\u2309","rcub":"}","Rcy":"\u0420","rcy":"\u0440","rdca":"\u2937","rdldhar":"\u2969","rdquo":"\u201D","rdquor":"\u201D","rdsh":"\u21B3","real":"\u211C","realine":"\u211B","realpart":"\u211C","reals":"\u211D","Re":"\u211C","rect":"\u25AD","reg":"\u00AE","REG":"\u00AE","ReverseElement":"\u220B","ReverseEquilibrium":"\u21CB","ReverseUpEquilibrium":"\u296F","rfisht":"\u297D","rfloor":"\u230B","rfr":"\uD835\uDD2F","Rfr":"\u211C","rHar":"\u2964","rhard":"\u21C1","rharu":"\u21C0","rharul":"\u296C","Rho":"\u03A1","rho":"\u03C1","rhov":"\u03F1","RightAngleBracket":"\u27E9","RightArrowBar":"\u21E5","rightarrow":"\u2192","RightArrow":"\u2192","Rightarrow":"\u21D2","RightArrowLeftArrow":"\u21C4","rightarrowtail":"\u21A3","RightCeiling":"\u2309","RightDoubleBracket":"\u27E7","RightDownTeeVector":"\u295D","RightDownVectorBar":"\u2955","RightDownVector":"\u21C2","RightFloor":"\u230B","rightharpoondown":"\u21C1","rightharpoonup":"\u21C0","rightleftarrows":"\u21C4","rightleftharpoons":"\u21CC","rightrightarrows":"\u21C9","rightsquigarrow":"\u219D","RightTeeArrow":"\u21A6","RightTee":"\u22A2","RightTeeVector":"\u295B","rightthreetimes":"\u22CC","RightTriangleBar":"\u29D0","RightTriangle":"\u22B3","RightTriangleEqual":"\u22B5","RightUpDownVector":"\u294F","RightUpTeeVector":"\u295C","RightUpVectorBar":"\u2954","RightUpVector":"\u21BE","RightVectorBar":"\u2953","RightVector":"\u21C0","ring":"\u02DA","risingdotseq":"\u2253","rlarr":"\u21C4","rlhar":"\u21CC","rlm":"\u200F","rmoustache":"\u23B1","rmoust":"\u23B1","rnmid":"\u2AEE","roang":"\u27ED","roarr":"\u21FE","robrk":"\u27E7","ropar":"\u2986","ropf":"\uD835\uDD63","Ropf":"\u211D","roplus":"\u2A2E","rotimes":"\u2A35","RoundImplies":"\u2970","rpar":")","rpargt":"\u2994","rppolint":"\u2A12","rrarr":"\u21C9","Rrightarrow":"\u21DB","rsaquo":"\u203A","rscr":"\uD835\uDCC7","Rscr":"\u211B","rsh":"\u21B1","Rsh":"\u21B1","rsqb":"]","rsquo":"\u2019","rsquor":"\u2019","rthree":"\u22CC","rtimes":"\u22CA","rtri":"\u25B9","rtrie":"\u22B5","rtrif":"\u25B8","rtriltri":"\u29CE","RuleDelayed":"\u29F4","ruluhar":"\u2968","rx":"\u211E","Sacute":"\u015A","sacute":"\u015B","sbquo":"\u201A","scap":"\u2AB8","Scaron":"\u0160","scaron":"\u0161","Sc":"\u2ABC","sc":"\u227B","sccue":"\u227D","sce":"\u2AB0","scE":"\u2AB4","Scedil":"\u015E","scedil":"\u015F","Scirc":"\u015C","scirc":"\u015D","scnap":"\u2ABA","scnE":"\u2AB6","scnsim":"\u22E9","scpolint":"\u2A13","scsim":"\u227F","Scy":"\u0421","scy":"\u0441","sdotb":"\u22A1","sdot":"\u22C5","sdote":"\u2A66","searhk":"\u2925","searr":"\u2198","seArr":"\u21D8","searrow":"\u2198","sect":"\u00A7","semi":";","seswar":"\u2929","setminus":"\u2216","setmn":"\u2216","sext":"\u2736","Sfr":"\uD835\uDD16","sfr":"\uD835\uDD30","sfrown":"\u2322","sharp":"\u266F","SHCHcy":"\u0429","shchcy":"\u0449","SHcy":"\u0428","shcy":"\u0448","ShortDownArrow":"\u2193","ShortLeftArrow":"\u2190","shortmid":"\u2223","shortparallel":"\u2225","ShortRightArrow":"\u2192","ShortUpArrow":"\u2191","shy":"\u00AD","Sigma":"\u03A3","sigma":"\u03C3","sigmaf":"\u03C2","sigmav":"\u03C2","sim":"\u223C","simdot":"\u2A6A","sime":"\u2243","simeq":"\u2243","simg":"\u2A9E","simgE":"\u2AA0","siml":"\u2A9D","simlE":"\u2A9F","simne":"\u2246","simplus":"\u2A24","simrarr":"\u2972","slarr":"\u2190","SmallCircle":"\u2218","smallsetminus":"\u2216","smashp":"\u2A33","smeparsl":"\u29E4","smid":"\u2223","smile":"\u2323","smt":"\u2AAA","smte":"\u2AAC","smtes":"\u2AAC\uFE00","SOFTcy":"\u042C","softcy":"\u044C","solbar":"\u233F","solb":"\u29C4","sol":"/","Sopf":"\uD835\uDD4A","sopf":"\uD835\uDD64","spades":"\u2660","spadesuit":"\u2660","spar":"\u2225","sqcap":"\u2293","sqcaps":"\u2293\uFE00","sqcup":"\u2294","sqcups":"\u2294\uFE00","Sqrt":"\u221A","sqsub":"\u228F","sqsube":"\u2291","sqsubset":"\u228F","sqsubseteq":"\u2291","sqsup":"\u2290","sqsupe":"\u2292","sqsupset":"\u2290","sqsupseteq":"\u2292","square":"\u25A1","Square":"\u25A1","SquareIntersection":"\u2293","SquareSubset":"\u228F","SquareSubsetEqual":"\u2291","SquareSuperset":"\u2290","SquareSupersetEqual":"\u2292","SquareUnion":"\u2294","squarf":"\u25AA","squ":"\u25A1","squf":"\u25AA","srarr":"\u2192","Sscr":"\uD835\uDCAE","sscr":"\uD835\uDCC8","ssetmn":"\u2216","ssmile":"\u2323","sstarf":"\u22C6","Star":"\u22C6","star":"\u2606","starf":"\u2605","straightepsilon":"\u03F5","straightphi":"\u03D5","strns":"\u00AF","sub":"\u2282","Sub":"\u22D0","subdot":"\u2ABD","subE":"\u2AC5","sube":"\u2286","subedot":"\u2AC3","submult":"\u2AC1","subnE":"\u2ACB","subne":"\u228A","subplus":"\u2ABF","subrarr":"\u2979","subset":"\u2282","Subset":"\u22D0","subseteq":"\u2286","subseteqq":"\u2AC5","SubsetEqual":"\u2286","subsetneq":"\u228A","subsetneqq":"\u2ACB","subsim":"\u2AC7","subsub":"\u2AD5","subsup":"\u2AD3","succapprox":"\u2AB8","succ":"\u227B","succcurlyeq":"\u227D","Succeeds":"\u227B","SucceedsEqual":"\u2AB0","SucceedsSlantEqual":"\u227D","SucceedsTilde":"\u227F","succeq":"\u2AB0","succnapprox":"\u2ABA","succneqq":"\u2AB6","succnsim":"\u22E9","succsim":"\u227F","SuchThat":"\u220B","sum":"\u2211","Sum":"\u2211","sung":"\u266A","sup1":"\u00B9","sup2":"\u00B2","sup3":"\u00B3","sup":"\u2283","Sup":"\u22D1","supdot":"\u2ABE","supdsub":"\u2AD8","supE":"\u2AC6","supe":"\u2287","supedot":"\u2AC4","Superset":"\u2283","SupersetEqual":"\u2287","suphsol":"\u27C9","suphsub":"\u2AD7","suplarr":"\u297B","supmult":"\u2AC2","supnE":"\u2ACC","supne":"\u228B","supplus":"\u2AC0","supset":"\u2283","Supset":"\u22D1","supseteq":"\u2287","supseteqq":"\u2AC6","supsetneq":"\u228B","supsetneqq":"\u2ACC","supsim":"\u2AC8","supsub":"\u2AD4","supsup":"\u2AD6","swarhk":"\u2926","swarr":"\u2199","swArr":"\u21D9","swarrow":"\u2199","swnwar":"\u292A","szlig":"\u00DF","Tab":"\t","target":"\u2316","Tau":"\u03A4","tau":"\u03C4","tbrk":"\u23B4","Tcaron":"\u0164","tcaron":"\u0165","Tcedil":"\u0162","tcedil":"\u0163","Tcy":"\u0422","tcy":"\u0442","tdot":"\u20DB","telrec":"\u2315","Tfr":"\uD835\uDD17","tfr":"\uD835\uDD31","there4":"\u2234","therefore":"\u2234","Therefore":"\u2234","Theta":"\u0398","theta":"\u03B8","thetasym":"\u03D1","thetav":"\u03D1","thickapprox":"\u2248","thicksim":"\u223C","ThickSpace":"\u205F\u200A","ThinSpace":"\u2009","thinsp":"\u2009","thkap":"\u2248","thksim":"\u223C","THORN":"\u00DE","thorn":"\u00FE","tilde":"\u02DC","Tilde":"\u223C","TildeEqual":"\u2243","TildeFullEqual":"\u2245","TildeTilde":"\u2248","timesbar":"\u2A31","timesb":"\u22A0","times":"\u00D7","timesd":"\u2A30","tint":"\u222D","toea":"\u2928","topbot":"\u2336","topcir":"\u2AF1","top":"\u22A4","Topf":"\uD835\uDD4B","topf":"\uD835\uDD65","topfork":"\u2ADA","tosa":"\u2929","tprime":"\u2034","trade":"\u2122","TRADE":"\u2122","triangle":"\u25B5","triangledown":"\u25BF","triangleleft":"\u25C3","trianglelefteq":"\u22B4","triangleq":"\u225C","triangleright":"\u25B9","trianglerighteq":"\u22B5","tridot":"\u25EC","trie":"\u225C","triminus":"\u2A3A","TripleDot":"\u20DB","triplus":"\u2A39","trisb":"\u29CD","tritime":"\u2A3B","trpezium":"\u23E2","Tscr":"\uD835\uDCAF","tscr":"\uD835\uDCC9","TScy":"\u0426","tscy":"\u0446","TSHcy":"\u040B","tshcy":"\u045B","Tstrok":"\u0166","tstrok":"\u0167","twixt":"\u226C","twoheadleftarrow":"\u219E","twoheadrightarrow":"\u21A0","Uacute":"\u00DA","uacute":"\u00FA","uarr":"\u2191","Uarr":"\u219F","uArr":"\u21D1","Uarrocir":"\u2949","Ubrcy":"\u040E","ubrcy":"\u045E","Ubreve":"\u016C","ubreve":"\u016D","Ucirc":"\u00DB","ucirc":"\u00FB","Ucy":"\u0423","ucy":"\u0443","udarr":"\u21C5","Udblac":"\u0170","udblac":"\u0171","udhar":"\u296E","ufisht":"\u297E","Ufr":"\uD835\uDD18","ufr":"\uD835\uDD32","Ugrave":"\u00D9","ugrave":"\u00F9","uHar":"\u2963","uharl":"\u21BF","uharr":"\u21BE","uhblk":"\u2580","ulcorn":"\u231C","ulcorner":"\u231C","ulcrop":"\u230F","ultri":"\u25F8","Umacr":"\u016A","umacr":"\u016B","uml":"\u00A8","UnderBar":"_","UnderBrace":"\u23DF","UnderBracket":"\u23B5","UnderParenthesis":"\u23DD","Union":"\u22C3","UnionPlus":"\u228E","Uogon":"\u0172","uogon":"\u0173","Uopf":"\uD835\uDD4C","uopf":"\uD835\uDD66","UpArrowBar":"\u2912","uparrow":"\u2191","UpArrow":"\u2191","Uparrow":"\u21D1","UpArrowDownArrow":"\u21C5","updownarrow":"\u2195","UpDownArrow":"\u2195","Updownarrow":"\u21D5","UpEquilibrium":"\u296E","upharpoonleft":"\u21BF","upharpoonright":"\u21BE","uplus":"\u228E","UpperLeftArrow":"\u2196","UpperRightArrow":"\u2197","upsi":"\u03C5","Upsi":"\u03D2","upsih":"\u03D2","Upsilon":"\u03A5","upsilon":"\u03C5","UpTeeArrow":"\u21A5","UpTee":"\u22A5","upuparrows":"\u21C8","urcorn":"\u231D","urcorner":"\u231D","urcrop":"\u230E","Uring":"\u016E","uring":"\u016F","urtri":"\u25F9","Uscr":"\uD835\uDCB0","uscr":"\uD835\uDCCA","utdot":"\u22F0","Utilde":"\u0168","utilde":"\u0169","utri":"\u25B5","utrif":"\u25B4","uuarr":"\u21C8","Uuml":"\u00DC","uuml":"\u00FC","uwangle":"\u29A7","vangrt":"\u299C","varepsilon":"\u03F5","varkappa":"\u03F0","varnothing":"\u2205","varphi":"\u03D5","varpi":"\u03D6","varpropto":"\u221D","varr":"\u2195","vArr":"\u21D5","varrho":"\u03F1","varsigma":"\u03C2","varsubsetneq":"\u228A\uFE00","varsubsetneqq":"\u2ACB\uFE00","varsupsetneq":"\u228B\uFE00","varsupsetneqq":"\u2ACC\uFE00","vartheta":"\u03D1","vartriangleleft":"\u22B2","vartriangleright":"\u22B3","vBar":"\u2AE8","Vbar":"\u2AEB","vBarv":"\u2AE9","Vcy":"\u0412","vcy":"\u0432","vdash":"\u22A2","vDash":"\u22A8","Vdash":"\u22A9","VDash":"\u22AB","Vdashl":"\u2AE6","veebar":"\u22BB","vee":"\u2228","Vee":"\u22C1","veeeq":"\u225A","vellip":"\u22EE","verbar":"|","Verbar":"\u2016","vert":"|","Vert":"\u2016","VerticalBar":"\u2223","VerticalLine":"|","VerticalSeparator":"\u2758","VerticalTilde":"\u2240","VeryThinSpace":"\u200A","Vfr":"\uD835\uDD19","vfr":"\uD835\uDD33","vltri":"\u22B2","vnsub":"\u2282\u20D2","vnsup":"\u2283\u20D2","Vopf":"\uD835\uDD4D","vopf":"\uD835\uDD67","vprop":"\u221D","vrtri":"\u22B3","Vscr":"\uD835\uDCB1","vscr":"\uD835\uDCCB","vsubnE":"\u2ACB\uFE00","vsubne":"\u228A\uFE00","vsupnE":"\u2ACC\uFE00","vsupne":"\u228B\uFE00","Vvdash":"\u22AA","vzigzag":"\u299A","Wcirc":"\u0174","wcirc":"\u0175","wedbar":"\u2A5F","wedge":"\u2227","Wedge":"\u22C0","wedgeq":"\u2259","weierp":"\u2118","Wfr":"\uD835\uDD1A","wfr":"\uD835\uDD34","Wopf":"\uD835\uDD4E","wopf":"\uD835\uDD68","wp":"\u2118","wr":"\u2240","wreath":"\u2240","Wscr":"\uD835\uDCB2","wscr":"\uD835\uDCCC","xcap":"\u22C2","xcirc":"\u25EF","xcup":"\u22C3","xdtri":"\u25BD","Xfr":"\uD835\uDD1B","xfr":"\uD835\uDD35","xharr":"\u27F7","xhArr":"\u27FA","Xi":"\u039E","xi":"\u03BE","xlarr":"\u27F5","xlArr":"\u27F8","xmap":"\u27FC","xnis":"\u22FB","xodot":"\u2A00","Xopf":"\uD835\uDD4F","xopf":"\uD835\uDD69","xoplus":"\u2A01","xotime":"\u2A02","xrarr":"\u27F6","xrArr":"\u27F9","Xscr":"\uD835\uDCB3","xscr":"\uD835\uDCCD","xsqcup":"\u2A06","xuplus":"\u2A04","xutri":"\u25B3","xvee":"\u22C1","xwedge":"\u22C0","Yacute":"\u00DD","yacute":"\u00FD","YAcy":"\u042F","yacy":"\u044F","Ycirc":"\u0176","ycirc":"\u0177","Ycy":"\u042B","ycy":"\u044B","yen":"\u00A5","Yfr":"\uD835\uDD1C","yfr":"\uD835\uDD36","YIcy":"\u0407","yicy":"\u0457","Yopf":"\uD835\uDD50","yopf":"\uD835\uDD6A","Yscr":"\uD835\uDCB4","yscr":"\uD835\uDCCE","YUcy":"\u042E","yucy":"\u044E","yuml":"\u00FF","Yuml":"\u0178","Zacute":"\u0179","zacute":"\u017A","Zcaron":"\u017D","zcaron":"\u017E","Zcy":"\u0417","zcy":"\u0437","Zdot":"\u017B","zdot":"\u017C","zeetrf":"\u2128","ZeroWidthSpace":"\u200B","Zeta":"\u0396","zeta":"\u03B6","zfr":"\uD835\uDD37","Zfr":"\u2128","ZHcy":"\u0416","zhcy":"\u0436","zigrarr":"\u21DD","zopf":"\uD835\uDD6B","Zopf":"\u2124","Zscr":"\uD835\uDCB5","zscr":"\uD835\uDCCF","zwj":"\u200D","zwnj":"\u200C"}
},{}],53:[function(require,module,exports){
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

  self.re.pretest       = RegExp(
                            '(' + self.re.schema_test.source + ')|' +
                            '(' + self.re.host_fuzzy_test.source + ')|' +
                            '@',
                            'i');

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
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/
LinkifyIt.prototype.pretest = function pretest(text) {
  return this.re.pretest.test(text);
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

},{"./lib/re":54}],54:[function(require,module,exports){
'use strict';

// Use direct extract instead of `regenerate` to reduse browserified size
var src_Any = exports.src_Any = require('uc.micro/properties/Any/regex').source;
var src_Cc  = exports.src_Cc = require('uc.micro/categories/Cc/regex').source;
var src_Cf  = exports.src_Cf = require('uc.micro/categories/Cf/regex').source;
var src_Z   = exports.src_Z  = require('uc.micro/categories/Z/regex').source;
var src_P   = exports.src_P  = require('uc.micro/categories/P/regex').source;

// \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
var src_ZPCcCf = exports.src_ZPCcCf = [ src_Z, src_P, src_Cc, src_Cf ].join('|');

// \p{\Z\Cc\CF} (white spaces + control + format)
var src_ZCcCf = exports.src_ZCcCf = [ src_Z, src_Cc, src_Cf ].join('|');

// All possible word characters (everything without punctuation, spaces & controls)
// Defined via punctuation & spaces to save space
// Should be something like \p{\L\N\S\M} (\w but without `_`)
var src_pseudo_letter       = '(?:(?!' + src_ZPCcCf + ')' + src_Any + ')';
// The same as abothe but without [0-9]
var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCcCf + ')' + src_Any + ')';

////////////////////////////////////////////////////////////////////////////////

var src_ip4 = exports.src_ip4 =

  '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

exports.src_auth    = '(?:(?:(?!' + src_ZCcCf + ').)+@)?';

var src_port = exports.src_port =

  '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

var src_host_terminator = exports.src_host_terminator =

  '(?=$|' + src_ZPCcCf + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + src_ZPCcCf + '))';

var src_path = exports.src_path =

  '(?:' +
    '[/?#]' +
      '(?:' +
        '(?!' + src_ZCcCf + '|[()[\\]{}.,"\'?!\\-]).|' +
        '\\[(?:(?!' + src_ZCcCf + '|\\]).)*\\]|' +
        '\\((?:(?!' + src_ZCcCf + '|[)]).)*\\)|' +
        '\\{(?:(?!' + src_ZCcCf + '|[}]).)*\\}|' +
        '\\"(?:(?!' + src_ZCcCf + '|["]).)+\\"|' +
        "\\'(?:(?!" + src_ZCcCf + "|[']).)+\\'|" +
        "\\'(?=" + src_pseudo_letter + ').|' +  // allow `I'm_king` if no pair found
        '\\.{2,3}[a-zA-Z0-9%]|' + // github has ... in commit range links. Restrict to
                                  // english & percent-encoded only, until more examples found.
        '\\.(?!' + src_ZCcCf + '|[.]).|' +
        '\\-(?!' + src_ZCcCf + '|--(?:[^-]|$))(?:[-]+|.)|' +  // `---` => long dash, terminate
        '\\,(?!' + src_ZCcCf + ').|' +      // allow `,,,` in paths
        '\\!(?!' + src_ZCcCf + '|[!]).|' +
        '\\?(?!' + src_ZCcCf + '|[?]).' +
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

    '(^|>|' + src_ZCcCf + ')(' + src_email_name + '@' + tpl_host_fuzzy_strict + ')';

exports.tpl_link_fuzzy =
    // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCcCf + '))' +
    '((?![$+<=>^`|])' + tpl_host_port_fuzzy_strict + src_path + ')';

},{"uc.micro/categories/Cc/regex":60,"uc.micro/categories/Cf/regex":61,"uc.micro/categories/P/regex":62,"uc.micro/categories/Z/regex":63,"uc.micro/properties/Any/regex":65}],55:[function(require,module,exports){

'use strict';


/* eslint-disable no-bitwise */

var decodeCache = {};

function getDecodeCache(exclude) {
  var i, ch, cache = decodeCache[exclude];
  if (cache) { return cache; }

  cache = decodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);
    cache.push(ch);
  }

  for (i = 0; i < exclude.length; i++) {
    ch = exclude.charCodeAt(i);
    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
  }

  return cache;
}


// Decode percent-encoded string.
//
function decode(string, exclude) {
  var cache;

  if (typeof exclude !== 'string') {
    exclude = decode.defaultChars;
  }

  cache = getDecodeCache(exclude);

  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    var i, l, b1, b2, b3, b4, char,
        result = '';

    for (i = 0, l = seq.length; i < l; i += 3) {
      b1 = parseInt(seq.slice(i + 1, i + 3), 16);

      if (b1 < 0x80) {
        result += cache[b1];
        continue;
      }

      if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
        // 110xxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);

        if ((b2 & 0xC0) === 0x80) {
          char = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

          if (char < 0x80) {
            result += '\ufffd\ufffd';
          } else {
            result += String.fromCharCode(char);
          }

          i += 3;
          continue;
        }
      }

      if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
        // 1110xxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
          char = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

          if (char < 0x800 || (char >= 0xD800 && char <= 0xDFFF)) {
            result += '\ufffd\ufffd\ufffd';
          } else {
            result += String.fromCharCode(char);
          }

          i += 6;
          continue;
        }
      }

      if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        b4 = parseInt(seq.slice(i + 10, i + 12), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
          char = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

          if (char < 0x10000 || char > 0x10FFFF) {
            result += '\ufffd\ufffd\ufffd\ufffd';
          } else {
            char -= 0x10000;
            result += String.fromCharCode(0xD800 + (char >> 10), 0xDC00 + (char & 0x3FF));
          }

          i += 9;
          continue;
        }
      }

      result += '\ufffd';
    }

    return result;
  });
}


decode.defaultChars   = ';/?:@&=+$,#';
decode.componentChars = '';


module.exports = decode;

},{}],56:[function(require,module,exports){

'use strict';


var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


module.exports = encode;

},{}],57:[function(require,module,exports){

'use strict';


module.exports = function format(url) {
  var result = '';

  result += url.protocol || '';
  result += url.slashes ? '//' : '';
  result += url.auth ? url.auth + '@' : '';

  if (url.hostname && url.hostname.indexOf(':') !== -1) {
    // ipv6 address
    result += '[' + url.hostname + ']';
  } else {
    result += url.hostname || '';
  }

  result += url.port ? ':' + url.port : '';
  result += url.pathname || '';
  result += url.search || '';
  result += url.hash || '';

  return result;
};

},{}],58:[function(require,module,exports){
'use strict';


module.exports.encode = require('./encode');
module.exports.decode = require('./decode');
module.exports.format = require('./format');
module.exports.parse  = require('./parse');

},{"./decode":55,"./encode":56,"./format":57,"./parse":59}],59:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

//
// Changes from joyent/node:
//
// 1. No leading slash in paths,
//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
//
// 2. Backslashes are not replaced with slashes,
//    so `http:\\example.org\` is treated like a relative path
//
// 3. Trailing colon is treated like a part of the path,
//    i.e. in `http://example.org:foo` pathname is `:foo`
//
// 4. Nothing is URL-encoded in the resulting object,
//    (in joyent/node some chars in auth and paths are encoded)
//
// 5. `url.parse()` does not have `parseQueryString` argument
//
// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
//    which can be constructed using other parts of the url.
//


function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = [ '<', '>', '"', '`', ' ', '\r', '\n', '\t' ],

    // RFC 2396: characters not allowed for various reasons.
    unwise = [ '{', '}', '|', '\\', '^', '`' ].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = [ '\'' ].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = [ '%', '/', '?', ';', '#' ].concat(autoEscape),
    hostEndingChars = [ '/', '?', '#' ],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    /* eslint-disable no-script-url */
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    };
    /* eslint-enable no-script-url */

function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) { return url; }

  var u = new Url();
  u.parse(url, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, slashesDenoteHost) {
  var i, l, lowerProto, hec, slashes,
      rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }

    if (rest[hostEnd - 1] === ':') { hostEnd--; }
    var host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost(host);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) { continue; }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    }

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) { this.pathname = rest; }
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '';
  }

  return this;
};

Url.prototype.parseHost = function(host) {
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) { this.hostname = host; }
};

module.exports = urlParse;

},{}],60:[function(require,module,exports){
module.exports=/[\0-\x1F\x7F-\x9F]/
},{}],61:[function(require,module,exports){
module.exports=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/
},{}],62:[function(require,module,exports){
module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDE38-\uDE3D]|\uD805[\uDCC6\uDDC1-\uDDC9\uDE41-\uDE43]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F/
},{}],63:[function(require,module,exports){
module.exports=/[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/
},{}],64:[function(require,module,exports){

module.exports.Any = require('./properties/Any/regex');
module.exports.Cc  = require('./categories/Cc/regex');
module.exports.Cf  = require('./categories/Cf/regex');
module.exports.P   = require('./categories/P/regex');
module.exports.Z   = require('./categories/Z/regex');

},{"./categories/Cc/regex":60,"./categories/Cf/regex":61,"./categories/P/regex":62,"./categories/Z/regex":63,"./properties/Any/regex":65}],65:[function(require,module,exports){
module.exports=/[\0-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF]/
},{}],66:[function(require,module,exports){
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

},{"./tokenizeLinks":97,"highlight.js":71,"markdown-it":1}],67:[function(require,module,exports){
'use strict';

var insane = require('insane');
var assign = require('assignment');
var markdown = require('./markdown');
var hightokens = require('highlight.js-tokens').map(codeclass);

function codeclass (token) {
  return 'md-code-' + token;
}

function sanitize (html, o) {
  var options = assign({ allowedClasses: {} }, o);
  var ac = options.allowedClasses;

  add('pre', ['md-code-block']);
  add('code', markdown.languages);
  add('span', hightokens);

  return insane(html, options);

  function add (type, more) {
    ac[type] = (ac[type] || []).concat(more);
  }
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

},{"./markdown":66,"assignment":68,"highlight.js-tokens":80,"insane":84}],68:[function(require,module,exports){
'use strict';

function assignment (result) {
  var stack = Array.prototype.slice.call(arguments, 1);
  var item;
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (typeof result[key] === 'object' && result[key] && Object.prototype.toString.call(result[key]) !== '[object Array]') {
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

},{}],69:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.3.2 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.3.2',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(require,module,exports){
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
},{}],71:[function(require,module,exports){
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
},{"./highlight":70,"./languages/bash.js":72,"./languages/css.js":73,"./languages/http.js":74,"./languages/ini.js":75,"./languages/javascript.js":76,"./languages/json.js":77,"./languages/markdown.js":78,"./languages/xml.js":79}],72:[function(require,module,exports){
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
},{}],73:[function(require,module,exports){
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
},{}],74:[function(require,module,exports){
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
},{}],75:[function(require,module,exports){
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
},{}],76:[function(require,module,exports){
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
},{}],77:[function(require,module,exports){
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
},{}],78:[function(require,module,exports){
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
},{}],79:[function(require,module,exports){
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
},{}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
'use strict';

var toMap = require('./toMap');
var uris = ['background', 'base', 'cite', 'href', 'longdesc', 'src', 'usemap'];

module.exports = {
  uris: toMap(uris) // attributes that have an href and hence need to be sanitized
};

},{"./toMap":89}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
'use strict';

var toMap = require('./toMap');
var voids = ['area', 'br', 'col', 'hr', 'img', 'wbr', 'input', 'base', 'basefont', 'link', 'meta'];

module.exports = {
  voids: toMap(voids)
};

},{"./toMap":89}],84:[function(require,module,exports){
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

},{"./defaults":82,"./parser":86,"./sanitizer":87,"assignment":68,"he":88}],85:[function(require,module,exports){
'use strict';

module.exports = function lowercase (string) {
  return typeof string === 'string' ? string.toLowerCase() : string;
};

},{}],86:[function(require,module,exports){
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

    var same = html === last;
    last = html;

    if (same) { // discard, because it's invalid
      html = '';
    }
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
      if (doubleQuotedValue === void 0 && singleQuotedValue === void 0 && unquotedValue === void 0) {
        attrs[name] = void 0; // attribute is like <button disabled></button>
      } else {
        attrs[name] = he.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || '');
      }
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

},{"./attributes":81,"./elements":83,"./lowercase":85,"he":88}],87:[function(require,module,exports){
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
        if (typeof value === 'string') {
          out('="');
          out(he.encode(value));
          out('"');
        }
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

},{"./attributes":81,"./lowercase":85,"he":88}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
'use strict';

function toMap (list) {
  return list.reduce(asKey, {});
}

function asKey (accumulator, item) {
  accumulator[item] = true;
  return accumulator;
}

module.exports = toMap;

},{}],90:[function(require,module,exports){
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

},{"./lib/re":91}],91:[function(require,module,exports){
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

},{"uc.micro/categories/Cc/regex":92,"uc.micro/categories/Cf/regex":93,"uc.micro/categories/P/regex":94,"uc.micro/categories/Z/regex":95,"uc.micro/properties/Any/regex":96}],92:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],93:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],94:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"dup":62}],95:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63}],96:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],97:[function(require,module,exports){
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

},{"linkify-it":90}]},{},[67])(67)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9tYXJrZG93bi1pdC9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9jb21tb24vZW50aXRpZXMuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvY29tbW9uL2h0bWxfYmxvY2tzLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL2NvbW1vbi9odG1sX3JlLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL2NvbW1vbi91cmxfc2NoZW1hcy5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9jb21tb24vdXRpbHMuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvaGVscGVycy9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9oZWxwZXJzL3BhcnNlX2xpbmtfZGVzdGluYXRpb24uanMiLCIuLi9tYXJrZG93bi1pdC9saWIvaGVscGVycy9wYXJzZV9saW5rX2xhYmVsLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL2hlbHBlcnMvcGFyc2VfbGlua190aXRsZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9wYXJzZXJfYmxvY2suanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcGFyc2VyX2NvcmUuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcGFyc2VyX2lubGluZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9wcmVzZXRzL2NvbW1vbm1hcmsuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcHJlc2V0cy9kZWZhdWx0LmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3ByZXNldHMvemVyby5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9yZW5kZXJlci5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlci5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9ibG9ja3F1b3RlLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL2NvZGUuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svZmVuY2UuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svaGVhZGluZy5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9oci5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9odG1sX2Jsb2NrLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL2xoZWFkaW5nLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL2xpc3QuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfYmxvY2svcGFyYWdyYXBoLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2Jsb2NrL3JlZmVyZW5jZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay9zdGF0ZV9ibG9jay5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19ibG9jay90YWJsZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL2Jsb2NrLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2NvcmUvaW5saW5lLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2NvcmUvbGlua2lmeS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL25vcm1hbGl6ZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL3JlcGxhY2VtZW50cy5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19jb3JlL3NtYXJ0cXVvdGVzLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2NvcmUvc3RhdGVfY29yZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvYXV0b2xpbmsuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2JhY2t0aWNrcy5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvZW1waGFzaXMuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2VudGl0eS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvZXNjYXBlLmpzIiwiLi4vbWFya2Rvd24taXQvbGliL3J1bGVzX2lubGluZS9odG1sX2lubGluZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvaW1hZ2UuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL2xpbmsuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL25ld2xpbmUuanMiLCIuLi9tYXJrZG93bi1pdC9saWIvcnVsZXNfaW5saW5lL3N0YXRlX2lubGluZS5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvc3RyaWtldGhyb3VnaC5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi9ydWxlc19pbmxpbmUvdGV4dC5qcyIsIi4uL21hcmtkb3duLWl0L2xpYi90b2tlbi5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy9lbnRpdGllcy9tYXBzL2VudGl0aWVzLmpzb24iLCIuLi9tYXJrZG93bi1pdC9ub2RlX21vZHVsZXMvbGlua2lmeS1pdC9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy9saW5raWZ5LWl0L2xpYi9yZS5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy9tZHVybC9kZWNvZGUuanMiLCIuLi9tYXJrZG93bi1pdC9ub2RlX21vZHVsZXMvbWR1cmwvZW5jb2RlLmpzIiwiLi4vbWFya2Rvd24taXQvbm9kZV9tb2R1bGVzL21kdXJsL2Zvcm1hdC5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy9tZHVybC9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy9tZHVybC9wYXJzZS5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy91Yy5taWNyby9jYXRlZ29yaWVzL0NjL3JlZ2V4LmpzIiwiLi4vbWFya2Rvd24taXQvbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2YvcmVnZXguanMiLCIuLi9tYXJrZG93bi1pdC9ub2RlX21vZHVsZXMvdWMubWljcm8vY2F0ZWdvcmllcy9QL3JlZ2V4LmpzIiwiLi4vbWFya2Rvd24taXQvbm9kZV9tb2R1bGVzL3VjLm1pY3JvL2NhdGVnb3JpZXMvWi9yZWdleC5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy91Yy5taWNyby9pbmRleC5qcyIsIi4uL21hcmtkb3duLWl0L25vZGVfbW9kdWxlcy91Yy5taWNyby9wcm9wZXJ0aWVzL0FueS9yZWdleC5qcyIsIm1hcmtkb3duLmpzIiwibWVnYW1hcmsuanMiLCJub2RlX21vZHVsZXMvYXNzaWdubWVudC9hc3NpZ25tZW50LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3B1bnljb2RlL3B1bnljb2RlLmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvaGlnaGxpZ2h0LmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvYmFzaC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2xhbmd1YWdlcy9jc3MuanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvaHR0cC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2xhbmd1YWdlcy9pbmkuanMiLCJub2RlX21vZHVsZXMvaGlnaGxpZ2h0LXJlZHV4L2xpYi9sYW5ndWFnZXMvamF2YXNjcmlwdC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQtcmVkdXgvbGliL2xhbmd1YWdlcy9qc29uLmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvbGFuZ3VhZ2VzL21hcmtkb3duLmpzIiwibm9kZV9tb2R1bGVzL2hpZ2hsaWdodC1yZWR1eC9saWIvbGFuZ3VhZ2VzL3htbC5qcyIsIm5vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMtdG9rZW5zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS9hdHRyaWJ1dGVzLmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS9kZWZhdWx0cy5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvZWxlbWVudHMuanMiLCJub2RlX21vZHVsZXMvaW5zYW5lL2luc2FuZS5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvbG93ZXJjYXNlLmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS9wYXJzZXIuanMiLCJub2RlX21vZHVsZXMvaW5zYW5lL3Nhbml0aXplci5qcyIsIm5vZGVfbW9kdWxlcy9pbnNhbmUvc2hlLmpzIiwibm9kZV9tb2R1bGVzL2luc2FuZS90b01hcC5qcyIsIm5vZGVfbW9kdWxlcy9saW5raWZ5LWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtpZnktaXQvbGliL3JlLmpzIiwidG9rZW5pemVMaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hUQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliLycpO1xuIiwiLy8gSFRNTDUgZW50aXRpZXMgbWFwOiB7IG5hbWUgLT4gdXRmMTZzdHJpbmcgfVxuLy9cbid1c2Ugc3RyaWN0JztcblxuLyplc2xpbnQgcXVvdGVzOjAqL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdlbnRpdGllcy9tYXBzL2VudGl0aWVzLmpzb24nKTtcbiIsIi8vIExpc3Qgb2YgdmFsaWQgaHRtbCBibG9ja3MgbmFtZXMsIGFjY29ydGluZyB0byBjb21tb25tYXJrIHNwZWNcbi8vIGh0dHA6Ly9qZ20uZ2l0aHViLmlvL0NvbW1vbk1hcmsvc3BlYy5odG1sI2h0bWwtYmxvY2tzXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGh0bWxfYmxvY2tzID0ge307XG5cbltcbiAgJ2FydGljbGUnLFxuICAnYXNpZGUnLFxuICAnYnV0dG9uJyxcbiAgJ2Jsb2NrcXVvdGUnLFxuICAnYm9keScsXG4gICdjYW52YXMnLFxuICAnY2FwdGlvbicsXG4gICdjb2wnLFxuICAnY29sZ3JvdXAnLFxuICAnZGQnLFxuICAnZGl2JyxcbiAgJ2RsJyxcbiAgJ2R0JyxcbiAgJ2VtYmVkJyxcbiAgJ2ZpZWxkc2V0JyxcbiAgJ2ZpZ2NhcHRpb24nLFxuICAnZmlndXJlJyxcbiAgJ2Zvb3RlcicsXG4gICdmb3JtJyxcbiAgJ2gxJyxcbiAgJ2gyJyxcbiAgJ2gzJyxcbiAgJ2g0JyxcbiAgJ2g1JyxcbiAgJ2g2JyxcbiAgJ2hlYWRlcicsXG4gICdoZ3JvdXAnLFxuICAnaHInLFxuICAnaWZyYW1lJyxcbiAgJ2xpJyxcbiAgJ21hcCcsXG4gICdvYmplY3QnLFxuICAnb2wnLFxuICAnb3V0cHV0JyxcbiAgJ3AnLFxuICAncHJlJyxcbiAgJ3Byb2dyZXNzJyxcbiAgJ3NjcmlwdCcsXG4gICdzZWN0aW9uJyxcbiAgJ3N0eWxlJyxcbiAgJ3RhYmxlJyxcbiAgJ3Rib2R5JyxcbiAgJ3RkJyxcbiAgJ3RleHRhcmVhJyxcbiAgJ3Rmb290JyxcbiAgJ3RoJyxcbiAgJ3RyJyxcbiAgJ3RoZWFkJyxcbiAgJ3VsJyxcbiAgJ3ZpZGVvJ1xuXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7IGh0bWxfYmxvY2tzW25hbWVdID0gdHJ1ZTsgfSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBodG1sX2Jsb2NrcztcbiIsIi8vIFJlZ2V4cHMgdG8gbWF0Y2ggaHRtbCBlbGVtZW50c1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhdHRyX25hbWUgICAgID0gJ1thLXpBLVpfOl1bYS16QS1aMC05Oi5fLV0qJztcblxudmFyIHVucXVvdGVkICAgICAgPSAnW15cIlxcJz08PmBcXFxceDAwLVxcXFx4MjBdKyc7XG52YXIgc2luZ2xlX3F1b3RlZCA9IFwiJ1teJ10qJ1wiO1xudmFyIGRvdWJsZV9xdW90ZWQgPSAnXCJbXlwiXSpcIic7XG5cbnZhciBhdHRyX3ZhbHVlICA9ICcoPzonICsgdW5xdW90ZWQgKyAnfCcgKyBzaW5nbGVfcXVvdGVkICsgJ3wnICsgZG91YmxlX3F1b3RlZCArICcpJztcblxudmFyIGF0dHJpYnV0ZSAgID0gJyg/OlxcXFxzKycgKyBhdHRyX25hbWUgKyAnKD86XFxcXHMqPVxcXFxzKicgKyBhdHRyX3ZhbHVlICsgJyk/KSc7XG5cbnZhciBvcGVuX3RhZyAgICA9ICc8W0EtWmEtel1bQS1aYS16MC05XFxcXC1dKicgKyBhdHRyaWJ1dGUgKyAnKlxcXFxzKlxcXFwvPz4nO1xuXG52YXIgY2xvc2VfdGFnICAgPSAnPFxcXFwvW0EtWmEtel1bQS1aYS16MC05XFxcXC1dKlxcXFxzKj4nO1xudmFyIGNvbW1lbnQgICAgID0gJzwhLS0tLT58PCEtLSg/Oi0/W14+LV0pKD86LT9bXi1dKSotLT4nO1xudmFyIHByb2Nlc3NpbmcgID0gJzxbP10uKj9bP10+JztcbnZhciBkZWNsYXJhdGlvbiA9ICc8IVtBLVpdK1xcXFxzK1tePl0qPic7XG52YXIgY2RhdGEgICAgICAgPSAnPCFcXFxcW0NEQVRBXFxcXFtbXFxcXHNcXFxcU10qP1xcXFxdXFxcXF0+JztcblxudmFyIEhUTUxfVEFHX1JFID0gbmV3IFJlZ0V4cCgnXig/OicgKyBvcGVuX3RhZyArICd8JyArIGNsb3NlX3RhZyArICd8JyArIGNvbW1lbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3wnICsgcHJvY2Vzc2luZyArICd8JyArIGRlY2xhcmF0aW9uICsgJ3wnICsgY2RhdGEgKyAnKScpO1xuXG5tb2R1bGUuZXhwb3J0cy5IVE1MX1RBR19SRSA9IEhUTUxfVEFHX1JFO1xuIiwiLy8gTGlzdCBvZiB2YWxpZCB1cmwgc2NoZW1hcywgYWNjb3J0aW5nIHRvIGNvbW1vbm1hcmsgc3BlY1xuLy8gaHR0cDovL2pnbS5naXRodWIuaW8vQ29tbW9uTWFyay9zcGVjLmh0bWwjYXV0b2xpbmtzXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvYXAnLFxuICAnZG9pJyxcbiAgJ2phdmFzY3JpcHQnLFxuICAnYWFhJyxcbiAgJ2FhYXMnLFxuICAnYWJvdXQnLFxuICAnYWNhcCcsXG4gICdjYXAnLFxuICAnY2lkJyxcbiAgJ2NyaWQnLFxuICAnZGF0YScsXG4gICdkYXYnLFxuICAnZGljdCcsXG4gICdkbnMnLFxuICAnZmlsZScsXG4gICdmdHAnLFxuICAnZ2VvJyxcbiAgJ2dvJyxcbiAgJ2dvcGhlcicsXG4gICdoMzIzJyxcbiAgJ2h0dHAnLFxuICAnaHR0cHMnLFxuICAnaWF4JyxcbiAgJ2ljYXAnLFxuICAnaW0nLFxuICAnaW1hcCcsXG4gICdpbmZvJyxcbiAgJ2lwcCcsXG4gICdpcmlzJyxcbiAgJ2lyaXMuYmVlcCcsXG4gICdpcmlzLnhwYycsXG4gICdpcmlzLnhwY3MnLFxuICAnaXJpcy5sd3onLFxuICAnbGRhcCcsXG4gICdtYWlsdG8nLFxuICAnbWlkJyxcbiAgJ21zcnAnLFxuICAnbXNycHMnLFxuICAnbXRxcCcsXG4gICdtdXBkYXRlJyxcbiAgJ25ld3MnLFxuICAnbmZzJyxcbiAgJ25pJyxcbiAgJ25paCcsXG4gICdubnRwJyxcbiAgJ29wYXF1ZWxvY2t0b2tlbicsXG4gICdwb3AnLFxuICAncHJlcycsXG4gICdydHNwJyxcbiAgJ3NlcnZpY2UnLFxuICAnc2Vzc2lvbicsXG4gICdzaHR0cCcsXG4gICdzaWV2ZScsXG4gICdzaXAnLFxuICAnc2lwcycsXG4gICdzbXMnLFxuICAnc25tcCcsXG4gICdzb2FwLmJlZXAnLFxuICAnc29hcC5iZWVwcycsXG4gICd0YWcnLFxuICAndGVsJyxcbiAgJ3RlbG5ldCcsXG4gICd0ZnRwJyxcbiAgJ3RoaXNtZXNzYWdlJyxcbiAgJ3RuMzI3MCcsXG4gICd0aXAnLFxuICAndHYnLFxuICAndXJuJyxcbiAgJ3ZlbW1pJyxcbiAgJ3dzJyxcbiAgJ3dzcycsXG4gICd4Y29uJyxcbiAgJ3hjb24tdXNlcmlkJyxcbiAgJ3htbHJwYy5iZWVwJyxcbiAgJ3htbHJwYy5iZWVwcycsXG4gICd4bXBwJyxcbiAgJ3ozOS41MHInLFxuICAnejM5LjUwcycsXG4gICdhZGl1bXh0cmEnLFxuICAnYWZwJyxcbiAgJ2FmcycsXG4gICdhaW0nLFxuICAnYXB0JyxcbiAgJ2F0dGFjaG1lbnQnLFxuICAnYXcnLFxuICAnYmVzaGFyZScsXG4gICdiaXRjb2luJyxcbiAgJ2JvbG8nLFxuICAnY2FsbHRvJyxcbiAgJ2Nocm9tZScsXG4gICdjaHJvbWUtZXh0ZW5zaW9uJyxcbiAgJ2NvbS1ldmVudGJyaXRlLWF0dGVuZGVlJyxcbiAgJ2NvbnRlbnQnLFxuICAnY3ZzJyxcbiAgJ2RsbmEtcGxheXNpbmdsZScsXG4gICdkbG5hLXBsYXljb250YWluZXInLFxuICAnZHRuJyxcbiAgJ2R2YicsXG4gICdlZDJrJyxcbiAgJ2ZhY2V0aW1lJyxcbiAgJ2ZlZWQnLFxuICAnZmluZ2VyJyxcbiAgJ2Zpc2gnLFxuICAnZ2cnLFxuICAnZ2l0JyxcbiAgJ2dpem1vcHJvamVjdCcsXG4gICdndGFsaycsXG4gICdoY3AnLFxuICAnaWNvbicsXG4gICdpcG4nLFxuICAnaXJjJyxcbiAgJ2lyYzYnLFxuICAnaXJjcycsXG4gICdpdG1zJyxcbiAgJ2phcicsXG4gICdqbXMnLFxuICAna2V5cGFyYycsXG4gICdsYXN0Zm0nLFxuICAnbGRhcHMnLFxuICAnbWFnbmV0JyxcbiAgJ21hcHMnLFxuICAnbWFya2V0JyxcbiAgJ21lc3NhZ2UnLFxuICAnbW1zJyxcbiAgJ21zLWhlbHAnLFxuICAnbXNuaW0nLFxuICAnbXVtYmxlJyxcbiAgJ212bicsXG4gICdub3RlcycsXG4gICdvaWQnLFxuICAncGFsbScsXG4gICdwYXBhcmF6emknLFxuICAncGxhdGZvcm0nLFxuICAncHJveHknLFxuICAncHN5YycsXG4gICdxdWVyeScsXG4gICdyZXMnLFxuICAncmVzb3VyY2UnLFxuICAncm1pJyxcbiAgJ3JzeW5jJyxcbiAgJ3J0bXAnLFxuICAnc2Vjb25kbGlmZScsXG4gICdzZnRwJyxcbiAgJ3NnbicsXG4gICdza3lwZScsXG4gICdzbWInLFxuICAnc29sZGF0JyxcbiAgJ3Nwb3RpZnknLFxuICAnc3NoJyxcbiAgJ3N0ZWFtJyxcbiAgJ3N2bicsXG4gICd0ZWFtc3BlYWsnLFxuICAndGhpbmdzJyxcbiAgJ3VkcCcsXG4gICd1bnJlYWwnLFxuICAndXQyMDA0JyxcbiAgJ3ZlbnRyaWxvJyxcbiAgJ3ZpZXctc291cmNlJyxcbiAgJ3dlYmNhbCcsXG4gICd3dGFpJyxcbiAgJ3d5Y2l3eWcnLFxuICAneGZpcmUnLFxuICAneHJpJyxcbiAgJ3ltc2dyJ1xuXTtcbiIsIi8vIFV0aWxpdGllc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG5mdW5jdGlvbiBfY2xhc3Mob2JqKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTsgfVxuXG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBTdHJpbmddJzsgfVxuXG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbi8vIE1lcmdlIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc291cmNlICsgJ211c3QgYmUgb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIG9ialtrZXldID0gc291cmNlW2tleV07XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbi8vIFJlbW92ZSBlbGVtZW50IGZyb20gYXJyYXkgYW5kIHB1dCBhbm90aGVyIGFycmF5IGF0IHRob3NlIHBvc2l0aW9uLlxuLy8gVXNlZnVsIGZvciBzb21lIG9wZXJhdGlvbnMgd2l0aCB0b2tlbnNcbmZ1bmN0aW9uIGFycmF5UmVwbGFjZUF0KHNyYywgcG9zLCBuZXdFbGVtZW50cykge1xuICByZXR1cm4gW10uY29uY2F0KHNyYy5zbGljZSgwLCBwb3MpLCBuZXdFbGVtZW50cywgc3JjLnNsaWNlKHBvcyArIDEpKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gaXNWYWxpZEVudGl0eUNvZGUoYykge1xuICAvKmVzbGludCBuby1iaXR3aXNlOjAqL1xuICAvLyBicm9rZW4gc2VxdWVuY2VcbiAgaWYgKGMgPj0gMHhEODAwICYmIGMgPD0gMHhERkZGKSB7IHJldHVybiBmYWxzZTsgfVxuICAvLyBuZXZlciB1c2VkXG4gIGlmIChjID49IDB4RkREMCAmJiBjIDw9IDB4RkRFRikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKChjICYgMHhGRkZGKSA9PT0gMHhGRkZGIHx8IChjICYgMHhGRkZGKSA9PT0gMHhGRkZFKSB7IHJldHVybiBmYWxzZTsgfVxuICAvLyBjb250cm9sIGNvZGVzXG4gIGlmIChjID49IDB4MDAgJiYgYyA8PSAweDA4KSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoYyA9PT0gMHgwQikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGMgPj0gMHgwRSAmJiBjIDw9IDB4MUYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChjID49IDB4N0YgJiYgYyA8PSAweDlGKSB7IHJldHVybiBmYWxzZTsgfVxuICAvLyBvdXQgb2YgcmFuZ2VcbiAgaWYgKGMgPiAweDEwRkZGRikgeyByZXR1cm4gZmFsc2U7IH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoYykge1xuICAvKmVzbGludCBuby1iaXR3aXNlOjAqL1xuICBpZiAoYyA+IDB4ZmZmZikge1xuICAgIGMgLT0gMHgxMDAwMDtcbiAgICB2YXIgc3Vycm9nYXRlMSA9IDB4ZDgwMCArIChjID4+IDEwKSxcbiAgICAgICAgc3Vycm9nYXRlMiA9IDB4ZGMwMCArIChjICYgMHgzZmYpO1xuXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3Vycm9nYXRlMSwgc3Vycm9nYXRlMik7XG4gIH1cbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5cblxudmFyIFVORVNDQVBFX01EX1JFICA9IC9cXFxcKFshXCIjJCUmJygpKissXFwtLlxcLzo7PD0+P0BbXFxcXFxcXV5fYHt8fX5dKS9nO1xudmFyIEVOVElUWV9SRSAgICAgICA9IC8mKFthLXojXVthLXowLTldezEsMzF9KTsvZ2k7XG52YXIgVU5FU0NBUEVfQUxMX1JFID0gbmV3IFJlZ0V4cChVTkVTQ0FQRV9NRF9SRS5zb3VyY2UgKyAnfCcgKyBFTlRJVFlfUkUuc291cmNlLCAnZ2knKTtcblxudmFyIERJR0lUQUxfRU5USVRZX1RFU1RfUkUgPSAvXiMoKD86eFthLWYwLTldezEsOH18WzAtOV17MSw4fSkpL2k7XG5cbnZhciBlbnRpdGllcyA9IHJlcXVpcmUoJy4vZW50aXRpZXMnKTtcblxuZnVuY3Rpb24gcmVwbGFjZUVudGl0eVBhdHRlcm4obWF0Y2gsIG5hbWUpIHtcbiAgdmFyIGNvZGUgPSAwO1xuXG4gIGlmIChoYXMoZW50aXRpZXMsIG5hbWUpKSB7XG4gICAgcmV0dXJuIGVudGl0aWVzW25hbWVdO1xuICB9XG5cbiAgaWYgKG5hbWUuY2hhckNvZGVBdCgwKSA9PT0gMHgyMy8qICMgKi8gJiYgRElHSVRBTF9FTlRJVFlfVEVTVF9SRS50ZXN0KG5hbWUpKSB7XG4gICAgY29kZSA9IG5hbWVbMV0udG9Mb3dlckNhc2UoKSA9PT0gJ3gnID9cbiAgICAgIHBhcnNlSW50KG5hbWUuc2xpY2UoMiksIDE2KVxuICAgIDpcbiAgICAgIHBhcnNlSW50KG5hbWUuc2xpY2UoMSksIDEwKTtcbiAgICBpZiAoaXNWYWxpZEVudGl0eUNvZGUoY29kZSkpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50KGNvZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaDtcbn1cblxuLypmdW5jdGlvbiByZXBsYWNlRW50aXRpZXMoc3RyKSB7XG4gIGlmIChzdHIuaW5kZXhPZignJicpIDwgMCkgeyByZXR1cm4gc3RyOyB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKEVOVElUWV9SRSwgcmVwbGFjZUVudGl0eVBhdHRlcm4pO1xufSovXG5cbmZ1bmN0aW9uIHVuZXNjYXBlTWQoc3RyKSB7XG4gIGlmIChzdHIuaW5kZXhPZignXFxcXCcpIDwgMCkgeyByZXR1cm4gc3RyOyB9XG4gIHJldHVybiBzdHIucmVwbGFjZShVTkVTQ0FQRV9NRF9SRSwgJyQxJyk7XG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlQWxsKHN0cikge1xuICBpZiAoc3RyLmluZGV4T2YoJ1xcXFwnKSA8IDAgJiYgc3RyLmluZGV4T2YoJyYnKSA8IDApIHsgcmV0dXJuIHN0cjsgfVxuXG4gIHJldHVybiBzdHIucmVwbGFjZShVTkVTQ0FQRV9BTExfUkUsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGVkLCBlbnRpdHkpIHtcbiAgICBpZiAoZXNjYXBlZCkgeyByZXR1cm4gZXNjYXBlZDsgfVxuICAgIHJldHVybiByZXBsYWNlRW50aXR5UGF0dGVybihtYXRjaCwgZW50aXR5KTtcbiAgfSk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBIVE1MX0VTQ0FQRV9URVNUX1JFID0gL1smPD5cIl0vO1xudmFyIEhUTUxfRVNDQVBFX1JFUExBQ0VfUkUgPSAvWyY8PlwiXS9nO1xudmFyIEhUTUxfUkVQTEFDRU1FTlRTID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG5cbmZ1bmN0aW9uIHJlcGxhY2VVbnNhZmVDaGFyKGNoKSB7XG4gIHJldHVybiBIVE1MX1JFUExBQ0VNRU5UU1tjaF07XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gIGlmIChIVE1MX0VTQ0FQRV9URVNUX1JFLnRlc3Qoc3RyKSkge1xuICAgIHJldHVybiBzdHIucmVwbGFjZShIVE1MX0VTQ0FQRV9SRVBMQUNFX1JFLCByZXBsYWNlVW5zYWZlQ2hhcik7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIFJFR0VYUF9FU0NBUEVfUkUgPSAvWy4/KiteJFtcXF1cXFxcKCl7fXwtXS9nO1xuXG5mdW5jdGlvbiBlc2NhcGVSRSAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShSRUdFWFBfRVNDQVBFX1JFLCAnXFxcXCQmJyk7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIFpzICh1bmljb2RlIGNsYXNzKSB8fCBbXFx0XFxmXFx2XFxyXFxuXVxuZnVuY3Rpb24gaXNXaGl0ZVNwYWNlKGNvZGUpIHtcbiAgaWYgKGNvZGUgPj0gMHgyMDAwICYmIGNvZGUgPD0gMHgyMDBBKSB7IHJldHVybiB0cnVlOyB9XG4gIHN3aXRjaCAoY29kZSkge1xuICAgIGNhc2UgMHgwOTogLy8gXFx0XG4gICAgY2FzZSAweDBBOiAvLyBcXG5cbiAgICBjYXNlIDB4MEI6IC8vIFxcdlxuICAgIGNhc2UgMHgwQzogLy8gXFxmXG4gICAgY2FzZSAweDBEOiAvLyBcXHJcbiAgICBjYXNlIDB4MjA6XG4gICAgY2FzZSAweEEwOlxuICAgIGNhc2UgMHgxNjgwOlxuICAgIGNhc2UgMHgyMDJGOlxuICAgIGNhc2UgMHgyMDVGOlxuICAgIGNhc2UgMHgzMDAwOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKmVzbGludC1kaXNhYmxlIG1heC1sZW4qL1xudmFyIFVOSUNPREVfUFVOQ1RfUkUgPSByZXF1aXJlKCd1Yy5taWNyby9jYXRlZ29yaWVzL1AvcmVnZXgnKTtcblxuLy8gQ3VycmVudGx5IHdpdGhvdXQgYXN0cmFsIGNoYXJhY3RlcnMgc3VwcG9ydC5cbmZ1bmN0aW9uIGlzUHVuY3RDaGFyKGNoYXIpIHtcbiAgcmV0dXJuIFVOSUNPREVfUFVOQ1RfUkUudGVzdChjaGFyKTtcbn1cblxuXG4vLyBNYXJrZG93biBBU0NJSSBwdW5jdHVhdGlvbiBjaGFyYWN0ZXJzLlxuLy9cbi8vICEsIFwiLCAjLCAkLCAlLCAmLCAnLCAoLCApLCAqLCArLCAsLCAtLCAuLCAvLCA6LCA7LCA8LCA9LCA+LCA/LCBALCBbLCBcXCwgXSwgXiwgXywgYCwgeywgfCwgfSwgb3IgflxuLy8gaHR0cDovL3NwZWMuY29tbW9ubWFyay5vcmcvMC4xNS8jYXNjaWktcHVuY3R1YXRpb24tY2hhcmFjdGVyXG4vL1xuLy8gRG9uJ3QgY29uZnVzZSB3aXRoIHVuaWNvZGUgcHVuY3R1YXRpb24gISEhIEl0IGxhY2tzIHNvbWUgY2hhcnMgaW4gYXNjaWkgcmFuZ2UuXG4vL1xuZnVuY3Rpb24gaXNNZEFzY2lpUHVuY3QoY2gpIHtcbiAgc3dpdGNoIChjaCkge1xuICAgIGNhc2UgMHgyMS8qICEgKi86XG4gICAgY2FzZSAweDIyLyogXCIgKi86XG4gICAgY2FzZSAweDIzLyogIyAqLzpcbiAgICBjYXNlIDB4MjQvKiAkICovOlxuICAgIGNhc2UgMHgyNS8qICUgKi86XG4gICAgY2FzZSAweDI2LyogJiAqLzpcbiAgICBjYXNlIDB4MjcvKiAnICovOlxuICAgIGNhc2UgMHgyOC8qICggKi86XG4gICAgY2FzZSAweDI5LyogKSAqLzpcbiAgICBjYXNlIDB4MkEvKiAqICovOlxuICAgIGNhc2UgMHgyQi8qICsgKi86XG4gICAgY2FzZSAweDJDLyogLCAqLzpcbiAgICBjYXNlIDB4MkQvKiAtICovOlxuICAgIGNhc2UgMHgyRS8qIC4gKi86XG4gICAgY2FzZSAweDJGLyogLyAqLzpcbiAgICBjYXNlIDB4M0EvKiA6ICovOlxuICAgIGNhc2UgMHgzQi8qIDsgKi86XG4gICAgY2FzZSAweDNDLyogPCAqLzpcbiAgICBjYXNlIDB4M0QvKiA9ICovOlxuICAgIGNhc2UgMHgzRS8qID4gKi86XG4gICAgY2FzZSAweDNGLyogPyAqLzpcbiAgICBjYXNlIDB4NDAvKiBAICovOlxuICAgIGNhc2UgMHg1Qi8qIFsgKi86XG4gICAgY2FzZSAweDVDLyogXFwgKi86XG4gICAgY2FzZSAweDVELyogXSAqLzpcbiAgICBjYXNlIDB4NUUvKiBeICovOlxuICAgIGNhc2UgMHg1Ri8qIF8gKi86XG4gICAgY2FzZSAweDYwLyogYCAqLzpcbiAgICBjYXNlIDB4N0IvKiB7ICovOlxuICAgIGNhc2UgMHg3Qy8qIHwgKi86XG4gICAgY2FzZSAweDdELyogfSAqLzpcbiAgICBjYXNlIDB4N0UvKiB+ICovOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBIZXBsZXIgdG8gdW5pZnkgW3JlZmVyZW5jZSBsYWJlbHNdLlxuLy9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlZmVyZW5jZShzdHIpIHtcbiAgLy8gdXNlIC50b1VwcGVyQ2FzZSgpIGluc3RlYWQgb2YgLnRvTG93ZXJDYXNlKClcbiAgLy8gaGVyZSB0byBhdm9pZCBhIGNvbmZsaWN0IHdpdGggT2JqZWN0LnByb3RvdHlwZVxuICAvLyBtZW1iZXJzIChtb3N0IG5vdGFibHksIGBfX3Byb3RvX19gKVxuICByZXR1cm4gc3RyLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykudG9VcHBlckNhc2UoKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8gUmUtZXhwb3J0IGxpYnJhcmllcyBjb21tb25seSB1c2VkIGluIGJvdGggbWFya2Rvd24taXQgYW5kIGl0cyBwbHVnaW5zLFxuLy8gc28gcGx1Z2lucyB3b24ndCBoYXZlIHRvIGRlcGVuZCBvbiB0aGVtIGV4cGxpY2l0bHksIHdoaWNoIHJlZHVjZXMgdGhlaXJcbi8vIGJ1bmRsZWQgc2l6ZSAoZS5nLiBhIGJyb3dzZXIgYnVpbGQpLlxuLy9cbmV4cG9ydHMubGliICAgICAgICAgICAgICAgICA9IHt9O1xuZXhwb3J0cy5saWIubWR1cmwgICAgICAgICAgID0gcmVxdWlyZSgnbWR1cmwnKTtcbmV4cG9ydHMubGliLnVjbWljcm8gICAgICAgICA9IHJlcXVpcmUoJ3VjLm1pY3JvJyk7XG5cbmV4cG9ydHMuYXNzaWduICAgICAgICAgICAgICA9IGFzc2lnbjtcbmV4cG9ydHMuaXNTdHJpbmcgICAgICAgICAgICA9IGlzU3RyaW5nO1xuZXhwb3J0cy5oYXMgICAgICAgICAgICAgICAgID0gaGFzO1xuZXhwb3J0cy51bmVzY2FwZU1kICAgICAgICAgID0gdW5lc2NhcGVNZDtcbmV4cG9ydHMudW5lc2NhcGVBbGwgICAgICAgICA9IHVuZXNjYXBlQWxsO1xuZXhwb3J0cy5pc1ZhbGlkRW50aXR5Q29kZSAgID0gaXNWYWxpZEVudGl0eUNvZGU7XG5leHBvcnRzLmZyb21Db2RlUG9pbnQgICAgICAgPSBmcm9tQ29kZVBvaW50O1xuLy8gZXhwb3J0cy5yZXBsYWNlRW50aXRpZXMgICAgID0gcmVwbGFjZUVudGl0aWVzO1xuZXhwb3J0cy5lc2NhcGVIdG1sICAgICAgICAgID0gZXNjYXBlSHRtbDtcbmV4cG9ydHMuYXJyYXlSZXBsYWNlQXQgICAgICA9IGFycmF5UmVwbGFjZUF0O1xuZXhwb3J0cy5pc1doaXRlU3BhY2UgICAgICAgID0gaXNXaGl0ZVNwYWNlO1xuZXhwb3J0cy5pc01kQXNjaWlQdW5jdCAgICAgID0gaXNNZEFzY2lpUHVuY3Q7XG5leHBvcnRzLmlzUHVuY3RDaGFyICAgICAgICAgPSBpc1B1bmN0Q2hhcjtcbmV4cG9ydHMuZXNjYXBlUkUgICAgICAgICAgICA9IGVzY2FwZVJFO1xuZXhwb3J0cy5ub3JtYWxpemVSZWZlcmVuY2UgID0gbm9ybWFsaXplUmVmZXJlbmNlO1xuIiwiLy8gSnVzdCBhIHNob3J0Y3V0IGZvciBidWxrIGV4cG9ydFxuJ3VzZSBzdHJpY3QnO1xuXG5cbmV4cG9ydHMucGFyc2VMaW5rTGFiZWwgICAgICAgPSByZXF1aXJlKCcuL3BhcnNlX2xpbmtfbGFiZWwnKTtcbmV4cG9ydHMucGFyc2VMaW5rRGVzdGluYXRpb24gPSByZXF1aXJlKCcuL3BhcnNlX2xpbmtfZGVzdGluYXRpb24nKTtcbmV4cG9ydHMucGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuL3BhcnNlX2xpbmtfdGl0bGUnKTtcbiIsIi8vIFBhcnNlIGxpbmsgZGVzdGluYXRpb25cbi8vXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIHVuZXNjYXBlQWxsICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS51bmVzY2FwZUFsbDtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua0Rlc3RpbmF0aW9uKHN0ciwgcG9zLCBtYXgpIHtcbiAgdmFyIGNvZGUsIGxldmVsLFxuICAgICAgbGluZXMgPSAwLFxuICAgICAgc3RhcnQgPSBwb3MsXG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgcG9zOiAwLFxuICAgICAgICBsaW5lczogMCxcbiAgICAgICAgc3RyOiAnJ1xuICAgICAgfTtcblxuICBpZiAoc3RyLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgzQyAvKiA8ICovKSB7XG4gICAgcG9zKys7XG4gICAgd2hpbGUgKHBvcyA8IG1heCkge1xuICAgICAgY29kZSA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoY29kZSA9PT0gMHgwQSAvKiBcXG4gKi8pIHsgcmV0dXJuIHJlc3VsdDsgfVxuICAgICAgaWYgKGNvZGUgPT09IDB4M0UgLyogPiAqLykge1xuICAgICAgICByZXN1bHQucG9zID0gcG9zICsgMTtcbiAgICAgICAgcmVzdWx0LnN0ciA9IHVuZXNjYXBlQWxsKHN0ci5zbGljZShzdGFydCArIDEsIHBvcykpO1xuICAgICAgICByZXN1bHQub2sgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDB4NUMgLyogXFwgKi8gJiYgcG9zICsgMSA8IG1heCkge1xuICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHBvcysrO1xuICAgIH1cblxuICAgIC8vIG5vIGNsb3NpbmcgJz4nXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIHRoaXMgc2hvdWxkIGJlIC4uLiB9IGVsc2UgeyAuLi4gYnJhbmNoXG5cbiAgbGV2ZWwgPSAwO1xuICB3aGlsZSAocG9zIDwgbWF4KSB7XG4gICAgY29kZSA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoY29kZSA9PT0gMHgyMCkgeyBicmVhazsgfVxuXG4gICAgLy8gYXNjaWkgY29udHJvbCBjaGFyYWN0ZXJzXG4gICAgaWYgKGNvZGUgPCAweDIwIHx8IGNvZGUgPT09IDB4N0YpIHsgYnJlYWs7IH1cblxuICAgIGlmIChjb2RlID09PSAweDVDIC8qIFxcICovICYmIHBvcyArIDEgPCBtYXgpIHtcbiAgICAgIHBvcyArPSAyO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IDB4MjggLyogKCAqLykge1xuICAgICAgbGV2ZWwrKztcbiAgICAgIGlmIChsZXZlbCA+IDEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gMHgyOSAvKiApICovKSB7XG4gICAgICBsZXZlbC0tO1xuICAgICAgaWYgKGxldmVsIDwgMCkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIHBvcysrO1xuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSBwb3MpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gIHJlc3VsdC5zdHIgPSB1bmVzY2FwZUFsbChzdHIuc2xpY2Uoc3RhcnQsIHBvcykpO1xuICByZXN1bHQubGluZXMgPSBsaW5lcztcbiAgcmVzdWx0LnBvcyA9IHBvcztcbiAgcmVzdWx0Lm9rID0gdHJ1ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBQYXJzZSBsaW5rIGxhYmVsXG4vL1xuLy8gdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgZmlyc3QgY2hhcmFjdGVyIChcIltcIikgYWxyZWFkeSBtYXRjaGVzO1xuLy8gcmV0dXJucyB0aGUgZW5kIG9mIHRoZSBsYWJlbFxuLy9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgc3RhcnQsIGRpc2FibGVOZXN0ZWQpIHtcbiAgdmFyIGxldmVsLCBmb3VuZCwgbWFya2VyLCBwcmV2UG9zLFxuICAgICAgbGFiZWxFbmQgPSAtMSxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIG9sZFBvcyA9IHN0YXRlLnBvcztcblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIDE7XG4gIGxldmVsID0gMTtcblxuICB3aGlsZSAoc3RhdGUucG9zIDwgbWF4KSB7XG4gICAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKTtcbiAgICBpZiAobWFya2VyID09PSAweDVEIC8qIF0gKi8pIHtcbiAgICAgIGxldmVsLS07XG4gICAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcmV2UG9zID0gc3RhdGUucG9zO1xuICAgIHN0YXRlLm1kLmlubGluZS5za2lwVG9rZW4oc3RhdGUpO1xuICAgIGlmIChtYXJrZXIgPT09IDB4NUIgLyogWyAqLykge1xuICAgICAgaWYgKHByZXZQb3MgPT09IHN0YXRlLnBvcyAtIDEpIHtcbiAgICAgICAgLy8gaW5jcmVhc2UgbGV2ZWwgaWYgd2UgZmluZCB0ZXh0IGBbYCwgd2hpY2ggaXMgbm90IGEgcGFydCBvZiBhbnkgdG9rZW5cbiAgICAgICAgbGV2ZWwrKztcbiAgICAgIH0gZWxzZSBpZiAoZGlzYWJsZU5lc3RlZCkge1xuICAgICAgICBzdGF0ZS5wb3MgPSBvbGRQb3M7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZm91bmQpIHtcbiAgICBsYWJlbEVuZCA9IHN0YXRlLnBvcztcbiAgfVxuXG4gIC8vIHJlc3RvcmUgb2xkIHN0YXRlXG4gIHN0YXRlLnBvcyA9IG9sZFBvcztcblxuICByZXR1cm4gbGFiZWxFbmQ7XG59O1xuIiwiLy8gUGFyc2UgbGluayB0aXRsZVxuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgdW5lc2NhcGVBbGwgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS51bmVzY2FwZUFsbDtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua1RpdGxlKHN0ciwgcG9zLCBtYXgpIHtcbiAgdmFyIGNvZGUsXG4gICAgICBtYXJrZXIsXG4gICAgICBsaW5lcyA9IDAsXG4gICAgICBzdGFydCA9IHBvcyxcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBwb3M6IDAsXG4gICAgICAgIGxpbmVzOiAwLFxuICAgICAgICBzdHI6ICcnXG4gICAgICB9O1xuXG4gIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiByZXN1bHQ7IH1cblxuICBtYXJrZXIgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuXG4gIGlmIChtYXJrZXIgIT09IDB4MjIgLyogXCIgKi8gJiYgbWFya2VyICE9PSAweDI3IC8qICcgKi8gJiYgbWFya2VyICE9PSAweDI4IC8qICggKi8pIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gIHBvcysrO1xuXG4gIC8vIGlmIG9wZW5pbmcgbWFya2VyIGlzIFwiKFwiLCBzd2l0Y2ggaXQgdG8gY2xvc2luZyBtYXJrZXIgXCIpXCJcbiAgaWYgKG1hcmtlciA9PT0gMHgyOCkgeyBtYXJrZXIgPSAweDI5OyB9XG5cbiAgd2hpbGUgKHBvcyA8IG1heCkge1xuICAgIGNvZGUgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuICAgIGlmIChjb2RlID09PSBtYXJrZXIpIHtcbiAgICAgIHJlc3VsdC5wb3MgPSBwb3MgKyAxO1xuICAgICAgcmVzdWx0LmxpbmVzID0gbGluZXM7XG4gICAgICByZXN1bHQuc3RyID0gdW5lc2NhcGVBbGwoc3RyLnNsaWNlKHN0YXJ0ICsgMSwgcG9zKSk7XG4gICAgICByZXN1bHQub2sgPSB0cnVlO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDB4MEEpIHtcbiAgICAgIGxpbmVzKys7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSAweDVDIC8qIFxcICovICYmIHBvcyArIDEgPCBtYXgpIHtcbiAgICAgIHBvcysrO1xuICAgICAgaWYgKHN0ci5jaGFyQ29kZUF0KHBvcykgPT09IDB4MEEpIHtcbiAgICAgICAgbGluZXMrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwb3MrKztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gTWFpbiBwZXJzZXIgY2xhc3NcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciB1dGlscyAgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpO1xudmFyIGhlbHBlcnMgICAgICA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xudmFyIFJlbmRlcmVyICAgICA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcbnZhciBQYXJzZXJDb3JlICAgPSByZXF1aXJlKCcuL3BhcnNlcl9jb3JlJyk7XG52YXIgUGFyc2VyQmxvY2sgID0gcmVxdWlyZSgnLi9wYXJzZXJfYmxvY2snKTtcbnZhciBQYXJzZXJJbmxpbmUgPSByZXF1aXJlKCcuL3BhcnNlcl9pbmxpbmUnKTtcbnZhciBMaW5raWZ5SXQgICAgPSByZXF1aXJlKCdsaW5raWZ5LWl0Jyk7XG52YXIgbWR1cmwgICAgICAgID0gcmVxdWlyZSgnbWR1cmwnKTtcbnZhciBwdW55Y29kZSAgICAgPSByZXF1aXJlKCdwdW55Y29kZScpO1xuXG5cbnZhciBjb25maWcgPSB7XG4gICdkZWZhdWx0JzogcmVxdWlyZSgnLi9wcmVzZXRzL2RlZmF1bHQnKSxcbiAgemVybzogcmVxdWlyZSgnLi9wcmVzZXRzL3plcm8nKSxcbiAgY29tbW9ubWFyazogcmVxdWlyZSgnLi9wcmVzZXRzL2NvbW1vbm1hcmsnKVxufTtcblxuXG52YXIgQkFEX1BST1RPQ09MUyAgICA9IFsgJ3Zic2NyaXB0JywgJ2phdmFzY3JpcHQnLCAnZmlsZScgXTtcblxuZnVuY3Rpb24gdmFsaWRhdGVMaW5rKHVybCkge1xuICAvLyB1cmwgc2hvdWxkIGJlIG5vcm1hbGl6ZWQgYXQgdGhpcyBwb2ludCwgYW5kIGV4aXN0aW5nIGVudGl0aWVzIGFyZSBkZWNvZGVkXG4gIC8vXG4gIHZhciBzdHIgPSB1cmwudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKHN0ci5pbmRleE9mKCc6JykgPj0gMCAmJiBCQURfUFJPVE9DT0xTLmluZGV4T2Yoc3RyLnNwbGl0KCc6JylbMF0pID49IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBSRUNPREVfSE9TVE5BTUVfRk9SID0gWyAnaHR0cDonLCAnaHR0cHM6JywgJ21haWx0bzonIF07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxpbmsodXJsKSB7XG4gIHZhciBwYXJzZWQgPSBtZHVybC5wYXJzZSh1cmwsIHRydWUpO1xuXG4gIGlmIChwYXJzZWQuaG9zdG5hbWUpIHtcbiAgICAvLyBFbmNvZGUgaG9zdG5hbWVzIGluIHVybHMgbGlrZTpcbiAgICAvLyBgaHR0cDovL2hvc3QvYCwgYGh0dHBzOi8vaG9zdC9gLCBgbWFpbHRvOnVzZXJAaG9zdGAsIGAvL2hvc3QvYFxuICAgIC8vXG4gICAgLy8gV2UgZG9uJ3QgZW5jb2RlIHVua25vd24gc2NoZW1hcywgYmVjYXVzZSBpdCdzIGxpa2VseSB0aGF0IHdlIGVuY29kZVxuICAgIC8vIHNvbWV0aGluZyB3ZSBzaG91bGRuJ3QgKGUuZy4gYHNreXBlOm5hbWVgIHRyZWF0ZWQgYXMgYHNreXBlOmhvc3RgKVxuICAgIC8vXG4gICAgaWYgKCFwYXJzZWQucHJvdG9jb2wgfHwgUkVDT0RFX0hPU1ROQU1FX0ZPUi5pbmRleE9mKHBhcnNlZC5wcm90b2NvbCkgPj0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGFyc2VkLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSShwYXJzZWQuaG9zdG5hbWUpO1xuICAgICAgfSBjYXRjaChlcikge31cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWR1cmwuZW5jb2RlKG1kdXJsLmZvcm1hdChwYXJzZWQpKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTGlua1RleHQodXJsKSB7XG4gIHZhciBwYXJzZWQgPSBtZHVybC5wYXJzZSh1cmwsIHRydWUpO1xuXG4gIGlmIChwYXJzZWQuaG9zdG5hbWUpIHtcbiAgICAvLyBFbmNvZGUgaG9zdG5hbWVzIGluIHVybHMgbGlrZTpcbiAgICAvLyBgaHR0cDovL2hvc3QvYCwgYGh0dHBzOi8vaG9zdC9gLCBgbWFpbHRvOnVzZXJAaG9zdGAsIGAvL2hvc3QvYFxuICAgIC8vXG4gICAgLy8gV2UgZG9uJ3QgZW5jb2RlIHVua25vd24gc2NoZW1hcywgYmVjYXVzZSBpdCdzIGxpa2VseSB0aGF0IHdlIGVuY29kZVxuICAgIC8vIHNvbWV0aGluZyB3ZSBzaG91bGRuJ3QgKGUuZy4gYHNreXBlOm5hbWVgIHRyZWF0ZWQgYXMgYHNreXBlOmhvc3RgKVxuICAgIC8vXG4gICAgaWYgKCFwYXJzZWQucHJvdG9jb2wgfHwgUkVDT0RFX0hPU1ROQU1FX0ZPUi5pbmRleE9mKHBhcnNlZC5wcm90b2NvbCkgPj0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcGFyc2VkLmhvc3RuYW1lID0gcHVueWNvZGUudG9Vbmljb2RlKHBhcnNlZC5ob3N0bmFtZSk7XG4gICAgICB9IGNhdGNoKGVyKSB7fVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZHVybC5kZWNvZGUobWR1cmwuZm9ybWF0KHBhcnNlZCkpO1xufVxuXG5cbi8qKlxuICogY2xhc3MgTWFya2Rvd25JdFxuICpcbiAqIE1haW4gcGFyc2VyL3JlbmRlcmVyIGNsYXNzLlxuICpcbiAqICMjIyMjIFVzYWdlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogLy8gbm9kZS5qcywgXCJjbGFzc2ljXCIgd2F5OlxuICogdmFyIE1hcmtkb3duSXQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpLFxuICogICAgIG1kID0gbmV3IE1hcmtkb3duSXQoKTtcbiAqIHZhciByZXN1bHQgPSBtZC5yZW5kZXIoJyMgbWFya2Rvd24taXQgcnVsZXp6IScpO1xuICpcbiAqIC8vIG5vZGUuanMsIHRoZSBzYW1lLCBidXQgd2l0aCBzdWdhcjpcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAqIHZhciByZXN1bHQgPSBtZC5yZW5kZXIoJyMgbWFya2Rvd24taXQgcnVsZXp6IScpO1xuICpcbiAqIC8vIGJyb3dzZXIgd2l0aG91dCBBTUQsIGFkZGVkIHRvIFwid2luZG93XCIgb24gc2NyaXB0IGxvYWRcbiAqIC8vIE5vdGUsIHRoZXJlIGFyZSBubyBkYXNoLlxuICogdmFyIG1kID0gd2luZG93Lm1hcmtkb3duaXQoKTtcbiAqIHZhciByZXN1bHQgPSBtZC5yZW5kZXIoJyMgbWFya2Rvd24taXQgcnVsZXp6IScpO1xuICogYGBgXG4gKlxuICogU2luZ2xlIGxpbmUgcmVuZGVyaW5nLCB3aXRob3V0IHBhcmFncmFwaCB3cmFwOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKTtcbiAqIHZhciByZXN1bHQgPSBtZC5yZW5kZXJJbmxpbmUoJ19fbWFya2Rvd24taXRfXyBydWxlenohJyk7XG4gKiBgYGBcbiAqKi9cblxuLyoqXG4gKiBuZXcgTWFya2Rvd25JdChbcHJlc2V0TmFtZSwgb3B0aW9uc10pXG4gKiAtIHByZXNldE5hbWUgKFN0cmluZyk6IG9wdGlvbmFsLCBgY29tbW9ubWFya2AgLyBgemVyb2BcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KVxuICpcbiAqIENyZWF0ZXMgcGFyc2VyIGluc3RhbnNlIHdpdGggZ2l2ZW4gY29uZmlnLiBDYW4gYmUgY2FsbGVkIHdpdGhvdXQgYG5ld2AuXG4gKlxuICogIyMjIyMgcHJlc2V0TmFtZVxuICpcbiAqIE1hcmtkb3duSXQgcHJvdmlkZXMgbmFtZWQgcHJlc2V0cyBhcyBhIGNvbnZlbmllbmNlIHRvIHF1aWNrbHlcbiAqIGVuYWJsZS9kaXNhYmxlIGFjdGl2ZSBzeW50YXggcnVsZXMgYW5kIG9wdGlvbnMgZm9yIGNvbW1vbiB1c2UgY2FzZXMuXG4gKlxuICogLSBbXCJjb21tb25tYXJrXCJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcHJlc2V0cy9jb21tb25tYXJrLmpzKSAtXG4gKiAgIGNvbmZpZ3VyZXMgcGFyc2VyIHRvIHN0cmljdCBbQ29tbW9uTWFya10oaHR0cDovL2NvbW1vbm1hcmsub3JnLykgbW9kZS5cbiAqIC0gW2RlZmF1bHRdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcHJlc2V0cy9kZWZhdWx0LmpzKSAtXG4gKiAgIHNpbWlsYXIgdG8gR0ZNLCB1c2VkIHdoZW4gbm8gcHJlc2V0IG5hbWUgZ2l2ZW4uIEVuYWJsZXMgYWxsIGF2YWlsYWJsZSBydWxlcyxcbiAqICAgYnV0IHN0aWxsIHdpdGhvdXQgaHRtbCwgdHlwb2dyYXBoZXIgJiBhdXRvbGlua2VyLlxuICogLSBbXCJ6ZXJvXCJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcHJlc2V0cy96ZXJvLmpzKSAtXG4gKiAgIGFsbCBydWxlcyBkaXNhYmxlZC4gVXNlZnVsIHRvIHF1aWNrbHkgc2V0dXAgeW91ciBjb25maWcgdmlhIGAuZW5hYmxlKClgLlxuICogICBGb3IgZXhhbXBsZSwgd2hlbiB5b3UgbmVlZCBvbmx5IGBib2xkYCBhbmQgYGl0YWxpY2AgbWFya3VwIGFuZCBub3RoaW5nIGVsc2UuXG4gKlxuICogIyMjIyMgb3B0aW9uczpcbiAqXG4gKiAtIF9faHRtbF9fIC0gYGZhbHNlYC4gU2V0IGB0cnVlYCB0byBlbmFibGUgSFRNTCB0YWdzIGluIHNvdXJjZS4gQmUgY2FyZWZ1bCFcbiAqICAgVGhhdCdzIG5vdCBzYWZlISBZb3UgbWF5IG5lZWQgZXh0ZXJuYWwgc2FuaXRpemVyIHRvIHByb3RlY3Qgb3V0cHV0IGZyb20gWFNTLlxuICogICBJdCdzIGJldHRlciB0byBleHRlbmQgZmVhdHVyZXMgdmlhIHBsdWdpbnMsIGluc3RlYWQgb2YgZW5hYmxpbmcgSFRNTC5cbiAqIC0gX194aHRtbE91dF9fIC0gYGZhbHNlYC4gU2V0IGB0cnVlYCB0byBhZGQgJy8nIHdoZW4gY2xvc2luZyBzaW5nbGUgdGFnc1xuICogICAoYDxiciAvPmApLiBUaGlzIGlzIG5lZWRlZCBvbmx5IGZvciBmdWxsIENvbW1vbk1hcmsgY29tcGF0aWJpbGl0eS4gSW4gcmVhbFxuICogICB3b3JsZCB5b3Ugd2lsbCBuZWVkIEhUTUwgb3V0cHV0LlxuICogLSBfX2JyZWFrc19fIC0gYGZhbHNlYC4gU2V0IGB0cnVlYCB0byBjb252ZXJ0IGBcXG5gIGluIHBhcmFncmFwaHMgaW50byBgPGJyPmAuXG4gKiAtIF9fbGFuZ1ByZWZpeF9fIC0gYGxhbmd1YWdlLWAuIENTUyBsYW5ndWFnZSBjbGFzcyBwcmVmaXggZm9yIGZlbmNlZCBibG9ja3MuXG4gKiAgIENhbiBiZSB1c2VmdWwgZm9yIGV4dGVybmFsIGhpZ2hsaWdodGVycy5cbiAqIC0gX19saW5raWZ5X18gLSBgZmFsc2VgLiBTZXQgYHRydWVgIHRvIGF1dG9jb252ZXJ0IFVSTC1saWtlIHRleHQgdG8gbGlua3MuXG4gKiAtIF9fdHlwb2dyYXBoZXJfXyAgLSBgZmFsc2VgLiBTZXQgYHRydWVgIHRvIGVuYWJsZSBbc29tZSBsYW5ndWFnZS1uZXV0cmFsXG4gKiAgIHJlcGxhY2VtZW50XShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQvYmxvYi9tYXN0ZXIvbGliL3J1bGVzX2NvcmUvcmVwbGFjZW1lbnRzLmpzKSArXG4gKiAgIHF1b3RlcyBiZWF1dGlmaWNhdGlvbiAoc21hcnRxdW90ZXMpLlxuICogLSBfX3F1b3Rlc19fIC0gYOKAnOKAneKAmOKAmWAsIHN0cmluZy4gRG91YmxlICsgc2luZ2xlIHF1b3RlcyByZXBsYWNlbWVudCBwYWlycywgd2hlblxuICogICB0eXBvZ3JhcGhlciBlbmFibGVkIGFuZCBzbWFydHF1b3RlcyBvbi4gU2V0IGRvdWJsZXMgdG8gJ8KrwrsnIGZvciBSdXNzaWFuLFxuICogICAn4oCe4oCcJyBmb3IgR2VybWFuLlxuICogLSBfX2hpZ2hsaWdodF9fIC0gYG51bGxgLiBIaWdobGlnaHRlciBmdW5jdGlvbiBmb3IgZmVuY2VkIGNvZGUgYmxvY2tzLlxuICogICBIaWdobGlnaHRlciBgZnVuY3Rpb24gKHN0ciwgbGFuZylgIHNob3VsZCByZXR1cm4gZXNjYXBlZCBIVE1MLiBJdCBjYW4gYWxzb1xuICogICByZXR1cm4gZW1wdHkgc3RyaW5nIGlmIHRoZSBzb3VyY2Ugd2FzIG5vdCBjaGFuZ2VkIGFuZCBzaG91bGQgYmUgZXNjYXBlZCBleHRlcm5hbHkuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIGNvbW1vbm1hcmsgbW9kZVxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgnY29tbW9ubWFyaycpO1xuICpcbiAqIC8vIGRlZmF1bHQgbW9kZVxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICpcbiAqIC8vIGVuYWJsZSBldmVyeXRoaW5nXG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKHtcbiAqICAgaHRtbDogdHJ1ZSxcbiAqICAgbGlua2lmeTogdHJ1ZSxcbiAqICAgdHlwb2dyYXBoZXI6IHRydWVcbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIyMgU3ludGF4IGhpZ2hsaWdodGluZ1xuICpcbiAqIGBgYGpzXG4gKiB2YXIgaGxqcyA9IHJlcXVpcmUoJ2hpZ2hsaWdodC5qcycpIC8vIGh0dHBzOi8vaGlnaGxpZ2h0anMub3JnL1xuICpcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0Jykoe1xuICogICBoaWdobGlnaHQ6IGZ1bmN0aW9uIChzdHIsIGxhbmcpIHtcbiAqICAgICBpZiAobGFuZyAmJiBobGpzLmdldExhbmd1YWdlKGxhbmcpKSB7XG4gKiAgICAgICB0cnkge1xuICogICAgICAgICByZXR1cm4gaGxqcy5oaWdobGlnaHQobGFuZywgc3RyKS52YWx1ZTtcbiAqICAgICAgIH0gY2F0Y2ggKF9fKSB7fVxuICogICAgIH1cbiAqXG4gKiAgICAgdHJ5IHtcbiAqICAgICAgIHJldHVybiBobGpzLmhpZ2hsaWdodEF1dG8oc3RyKS52YWx1ZTtcbiAqICAgICB9IGNhdGNoIChfXykge31cbiAqXG4gKiAgICAgcmV0dXJuICcnOyAvLyB1c2UgZXh0ZXJuYWwgZGVmYXVsdCBlc2NhcGluZ1xuICogICB9XG4gKiB9KTtcbiAqIGBgYFxuICoqL1xuZnVuY3Rpb24gTWFya2Rvd25JdChwcmVzZXROYW1lLCBvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNYXJrZG93bkl0KSkge1xuICAgIHJldHVybiBuZXcgTWFya2Rvd25JdChwcmVzZXROYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucykge1xuICAgIGlmICghdXRpbHMuaXNTdHJpbmcocHJlc2V0TmFtZSkpIHtcbiAgICAgIG9wdGlvbnMgPSBwcmVzZXROYW1lIHx8IHt9O1xuICAgICAgcHJlc2V0TmFtZSA9ICdkZWZhdWx0JztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya2Rvd25JdCNpbmxpbmUgLT4gUGFyc2VySW5saW5lXG4gICAqXG4gICAqIEluc3RhbmNlIG9mIFtbUGFyc2VySW5saW5lXV0uIFlvdSBtYXkgbmVlZCBpdCB0byBhZGQgbmV3IHJ1bGVzIHdoZW5cbiAgICogd3JpdGluZyBwbHVnaW5zLiBGb3Igc2ltcGxlIHJ1bGVzIGNvbnRyb2wgdXNlIFtbTWFya2Rvd25JdC5kaXNhYmxlXV0gYW5kXG4gICAqIFtbTWFya2Rvd25JdC5lbmFibGVdXS5cbiAgICoqL1xuICB0aGlzLmlubGluZSA9IG5ldyBQYXJzZXJJbmxpbmUoKTtcblxuICAvKipcbiAgICogTWFya2Rvd25JdCNibG9jayAtPiBQYXJzZXJCbG9ja1xuICAgKlxuICAgKiBJbnN0YW5jZSBvZiBbW1BhcnNlckJsb2NrXV0uIFlvdSBtYXkgbmVlZCBpdCB0byBhZGQgbmV3IHJ1bGVzIHdoZW5cbiAgICogd3JpdGluZyBwbHVnaW5zLiBGb3Igc2ltcGxlIHJ1bGVzIGNvbnRyb2wgdXNlIFtbTWFya2Rvd25JdC5kaXNhYmxlXV0gYW5kXG4gICAqIFtbTWFya2Rvd25JdC5lbmFibGVdXS5cbiAgICoqL1xuICB0aGlzLmJsb2NrID0gbmV3IFBhcnNlckJsb2NrKCk7XG5cbiAgLyoqXG4gICAqIE1hcmtkb3duSXQjY29yZSAtPiBDb3JlXG4gICAqXG4gICAqIEluc3RhbmNlIG9mIFtbQ29yZV1dIGNoYWluIGV4ZWN1dG9yLiBZb3UgbWF5IG5lZWQgaXQgdG8gYWRkIG5ldyBydWxlcyB3aGVuXG4gICAqIHdyaXRpbmcgcGx1Z2lucy4gRm9yIHNpbXBsZSBydWxlcyBjb250cm9sIHVzZSBbW01hcmtkb3duSXQuZGlzYWJsZV1dIGFuZFxuICAgKiBbW01hcmtkb3duSXQuZW5hYmxlXV0uXG4gICAqKi9cbiAgdGhpcy5jb3JlID0gbmV3IFBhcnNlckNvcmUoKTtcblxuICAvKipcbiAgICogTWFya2Rvd25JdCNyZW5kZXJlciAtPiBSZW5kZXJlclxuICAgKlxuICAgKiBJbnN0YW5jZSBvZiBbW1JlbmRlcmVyXV0uIFVzZSBpdCB0byBtb2RpZnkgb3V0cHV0IGxvb2suIE9yIHRvIGFkZCByZW5kZXJpbmdcbiAgICogcnVsZXMgZm9yIG5ldyB0b2tlbiB0eXBlcywgZ2VuZXJhdGVkIGJ5IHBsdWdpbnMuXG4gICAqXG4gICAqICMjIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gICAqXG4gICAqIGZ1bmN0aW9uIG15VG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZikge1xuICAgKiAgIC8vLi4uXG4gICAqICAgcmV0dXJuIHJlc3VsdDtcbiAgICogfTtcbiAgICpcbiAgICogbWQucmVuZGVyZXIucnVsZXNbJ215X3Rva2VuJ10gPSBteVRva2VuXG4gICAqIGBgYFxuICAgKlxuICAgKiBTZWUgW1tSZW5kZXJlcl1dIGRvY3MgYW5kIFtzb3VyY2UgY29kZV0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2Jsb2IvbWFzdGVyL2xpYi9yZW5kZXJlci5qcykuXG4gICAqKi9cbiAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcigpO1xuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I2xpbmtpZnkgLT4gTGlua2lmeUl0XG4gICAqXG4gICAqIFtsaW5raWZ5LWl0XShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbGlua2lmeS1pdCkgaW5zdGFuY2UuXG4gICAqIFVzZWQgYnkgW2xpbmtpZnldKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvcnVsZXNfY29yZS9saW5raWZ5LmpzKVxuICAgKiBydWxlLlxuICAgKiovXG4gIHRoaXMubGlua2lmeSA9IG5ldyBMaW5raWZ5SXQoKTtcblxuICAvKipcbiAgICogTWFya2Rvd25JdCN2YWxpZGF0ZUxpbmsodXJsKSAtPiBCb29sZWFuXG4gICAqXG4gICAqIExpbmsgdmFsaWRhdGlvbiBmdW5jdGlvbi4gQ29tbW9uTWFyayBhbGxvd3MgdG9vIG11Y2ggaW4gbGlua3MuIEJ5IGRlZmF1bHRcbiAgICogd2UgZGlzYWJsZSBgamF2YXNjcmlwdDpgIGFuZCBgdmJzY3JpcHQ6YCBzY2hlbWFzLiBZb3UgY2FuIGNoYW5nZSB0aGlzXG4gICAqIGJlaGF2aW91ci5cbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gICAqIC8vIGVuYWJsZSBldmVyeXRoaW5nXG4gICAqIG1kLnZhbGlkYXRlTGluayA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH1cbiAgICogYGBgXG4gICAqKi9cbiAgdGhpcy52YWxpZGF0ZUxpbmsgPSB2YWxpZGF0ZUxpbms7XG5cbiAgLyoqXG4gICAqIE1hcmtkb3duSXQjbm9ybWFsaXplTGluayh1cmwpIC0+IFN0cmluZ1xuICAgKlxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIGVuY29kZSBsaW5rIHVybCB0byBhIG1hY2hpbmUtcmVhZGFibGUgZm9ybWF0LFxuICAgKiB3aGljaCBpbmNsdWRlcyB1cmwtZW5jb2RpbmcsIHB1bnljb2RlLCBldGMuXG4gICAqKi9cbiAgdGhpcy5ub3JtYWxpemVMaW5rID0gbm9ybWFsaXplTGluaztcblxuICAvKipcbiAgICogTWFya2Rvd25JdCNub3JtYWxpemVMaW5rVGV4dCh1cmwpIC0+IFN0cmluZ1xuICAgKlxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIGRlY29kZSBsaW5rIHVybCB0byBhIGh1bWFuLXJlYWRhYmxlIGZvcm1hdGBcbiAgICoqL1xuICB0aGlzLm5vcm1hbGl6ZUxpbmtUZXh0ID0gbm9ybWFsaXplTGlua1RleHQ7XG5cblxuICAvLyBFeHBvc2UgdXRpbHMgJiBoZWxwZXJzIGZvciBlYXN5IGFjY2VzIGZyb20gcGx1Z2luc1xuXG4gIC8qKlxuICAgKiBNYXJrZG93bkl0I3V0aWxzIC0+IHV0aWxzXG4gICAqXG4gICAqIEFzc29ydGVkIHV0aWxpdHkgZnVuY3Rpb25zLCB1c2VmdWwgdG8gd3JpdGUgcGx1Z2lucy4gU2VlIGRldGFpbHNcbiAgICogW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvY29tbW9uL3V0aWxzLmpzKS5cbiAgICoqL1xuICB0aGlzLnV0aWxzID0gdXRpbHM7XG5cbiAgLyoqXG4gICAqIE1hcmtkb3duSXQjaGVscGVycyAtPiBoZWxwZXJzXG4gICAqXG4gICAqIExpbmsgY29tcG9uZW50cyBwYXJzZXIgZnVuY3Rpb25zLCB1c2VmdWwgdG8gd3JpdGUgcGx1Z2lucy4gU2VlIGRldGFpbHNcbiAgICogW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC9ibG9iL21hc3Rlci9saWIvaGVscGVycykuXG4gICAqKi9cbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycztcblxuXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLmNvbmZpZ3VyZShwcmVzZXROYW1lKTtcblxuICBpZiAob3B0aW9ucykgeyB0aGlzLnNldChvcHRpb25zKTsgfVxufVxuXG5cbi8qKiBjaGFpbmFibGVcbiAqIE1hcmtkb3duSXQuc2V0KG9wdGlvbnMpXG4gKlxuICogU2V0IHBhcnNlciBvcHRpb25zIChpbiB0aGUgc2FtZSBmb3JtYXQgYXMgaW4gY29uc3RydWN0b3IpLiBQcm9iYWJseSwgeW91XG4gKiB3aWxsIG5ldmVyIG5lZWQgaXQsIGJ1dCB5b3UgY2FuIGNoYW5nZSBvcHRpb25zIGFmdGVyIGNvbnN0cnVjdG9yIGNhbGwuXG4gKlxuICogIyMjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBtZCA9IHJlcXVpcmUoJ21hcmtkb3duLWl0JykoKVxuICogICAgICAgICAgICAgLnNldCh7IGh0bWw6IHRydWUsIGJyZWFrczogdHJ1ZSB9KVxuICogICAgICAgICAgICAgLnNldCh7IHR5cG9ncmFwaGVyLCB0cnVlIH0pO1xuICogYGBgXG4gKlxuICogX19Ob3RlOl9fIFRvIGFjaGlldmUgdGhlIGJlc3QgcG9zc2libGUgcGVyZm9ybWFuY2UsIGRvbid0IG1vZGlmeSBhXG4gKiBgbWFya2Rvd24taXRgIGluc3RhbmNlIG9wdGlvbnMgb24gdGhlIGZseS4gSWYgeW91IG5lZWQgbXVsdGlwbGUgY29uZmlndXJhdGlvbnNcbiAqIGl0J3MgYmVzdCB0byBjcmVhdGUgbXVsdGlwbGUgaW5zdGFuY2VzIGFuZCBpbml0aWFsaXplIGVhY2ggd2l0aCBzZXBhcmF0ZVxuICogY29uZmlnLlxuICoqL1xuTWFya2Rvd25JdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdXRpbHMuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKiogY2hhaW5hYmxlLCBpbnRlcm5hbFxuICogTWFya2Rvd25JdC5jb25maWd1cmUocHJlc2V0cylcbiAqXG4gKiBCYXRjaCBsb2FkIG9mIGFsbCBvcHRpb25zIGFuZCBjb21wZW5lbnQgc2V0dGluZ3MuIFRoaXMgaXMgaW50ZXJuYWwgbWV0aG9kLFxuICogYW5kIHlvdSBwcm9iYWJseSB3aWxsIG5vdCBuZWVkIGl0LiBCdXQgaWYgeW91IHdpdGggLSBzZWUgYXZhaWxhYmxlIHByZXNldHNcbiAqIGFuZCBkYXRhIHN0cnVjdHVyZSBbaGVyZV0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L3RyZWUvbWFzdGVyL2xpYi9wcmVzZXRzKVxuICpcbiAqIFdlIHN0cm9uZ2x5IHJlY29tbWVuZCB0byB1c2UgcHJlc2V0cyBpbnN0ZWFkIG9mIGRpcmVjdCBjb25maWcgbG9hZHMuIFRoYXRcbiAqIHdpbGwgZ2l2ZSBiZXR0ZXIgY29tcGF0aWJpbGl0eSB3aXRoIG5leHQgdmVyc2lvbnMuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAocHJlc2V0cykge1xuICB2YXIgc2VsZiA9IHRoaXMsIHByZXNldE5hbWU7XG5cbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHByZXNldHMpKSB7XG4gICAgcHJlc2V0TmFtZSA9IHByZXNldHM7XG4gICAgcHJlc2V0cyA9IGNvbmZpZ1twcmVzZXROYW1lXTtcbiAgICBpZiAoIXByZXNldHMpIHsgdGhyb3cgbmV3IEVycm9yKCdXcm9uZyBgbWFya2Rvd24taXRgIHByZXNldCBcIicgKyBwcmVzZXROYW1lICsgJ1wiLCBjaGVjayBuYW1lJyk7IH1cbiAgfVxuXG4gIGlmICghcHJlc2V0cykgeyB0aHJvdyBuZXcgRXJyb3IoJ1dyb25nIGBtYXJrZG93bi1pdGAgcHJlc2V0LCBjYW5cXCd0IGJlIGVtcHR5Jyk7IH1cblxuICBpZiAocHJlc2V0cy5vcHRpb25zKSB7IHNlbGYuc2V0KHByZXNldHMub3B0aW9ucyk7IH1cblxuICBpZiAocHJlc2V0cy5jb21wb25lbnRzKSB7XG4gICAgT2JqZWN0LmtleXMocHJlc2V0cy5jb21wb25lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAocHJlc2V0cy5jb21wb25lbnRzW25hbWVdLnJ1bGVzKSB7XG4gICAgICAgIHNlbGZbbmFtZV0ucnVsZXIuZW5hYmxlT25seShwcmVzZXRzLmNvbXBvbmVudHNbbmFtZV0ucnVsZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKiogY2hhaW5hYmxlXG4gKiBNYXJrZG93bkl0LmVuYWJsZShsaXN0LCBpZ25vcmVJbnZhbGlkKVxuICogLSBsaXN0IChTdHJpbmd8QXJyYXkpOiBydWxlIG5hbWUgb3IgbGlzdCBvZiBydWxlIG5hbWVzIHRvIGVuYWJsZVxuICogLSBpZ25vcmVJbnZhbGlkIChCb29sZWFuKTogc2V0IGB0cnVlYCB0byBpZ25vcmUgZXJyb3JzIHdoZW4gcnVsZSBub3QgZm91bmQuXG4gKlxuICogRW5hYmxlIGxpc3Qgb3IgcnVsZXMuIEl0IHdpbGwgYXV0b21hdGljYWxseSBmaW5kIGFwcHJvcHJpYXRlIGNvbXBvbmVudHMsXG4gKiBjb250YWluaW5nIHJ1bGVzIHdpdGggZ2l2ZW4gbmFtZXMuIElmIHJ1bGUgbm90IGZvdW5kLCBhbmQgYGlnbm9yZUludmFsaWRgXG4gKiBub3Qgc2V0IC0gdGhyb3dzIGV4Y2VwdGlvbi5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpXG4gKiAgICAgICAgICAgICAuZW5hYmxlKFsnc3ViJywgJ3N1cCddKVxuICogICAgICAgICAgICAgLmRpc2FibGUoJ3NtYXJ0cXVvdGVzJyk7XG4gKiBgYGBcbiAqKi9cbk1hcmtkb3duSXQucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uIChsaXN0LCBpZ25vcmVJbnZhbGlkKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHsgbGlzdCA9IFsgbGlzdCBdOyB9XG5cbiAgWyAnY29yZScsICdibG9jaycsICdpbmxpbmUnIF0uZm9yRWFjaChmdW5jdGlvbiAoY2hhaW4pIHtcbiAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHRoaXNbY2hhaW5dLnJ1bGVyLmVuYWJsZShsaXN0LCB0cnVlKSk7XG4gIH0sIHRoaXMpO1xuXG4gIHZhciBtaXNzZWQgPSBsaXN0LmZpbHRlcihmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gcmVzdWx0LmluZGV4T2YobmFtZSkgPCAwOyB9KTtcblxuICBpZiAobWlzc2VkLmxlbmd0aCAmJiAhaWdub3JlSW52YWxpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWFya2Rvd25JdC4gRmFpbGVkIHRvIGVuYWJsZSB1bmtub3duIHJ1bGUocyk6ICcgKyBtaXNzZWQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKiBjaGFpbmFibGVcbiAqIE1hcmtkb3duSXQuZGlzYWJsZShsaXN0LCBpZ25vcmVJbnZhbGlkKVxuICogLSBsaXN0IChTdHJpbmd8QXJyYXkpOiBydWxlIG5hbWUgb3IgbGlzdCBvZiBydWxlIG5hbWVzIHRvIGRpc2FibGUuXG4gKiAtIGlnbm9yZUludmFsaWQgKEJvb2xlYW4pOiBzZXQgYHRydWVgIHRvIGlnbm9yZSBlcnJvcnMgd2hlbiBydWxlIG5vdCBmb3VuZC5cbiAqXG4gKiBUaGUgc2FtZSBhcyBbW01hcmtkb3duSXQuZW5hYmxlXV0sIGJ1dCB0dXJuIHNwZWNpZmllZCBydWxlcyBvZmYuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKGxpc3QsIGlnbm9yZUludmFsaWQpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkgeyBsaXN0ID0gWyBsaXN0IF07IH1cblxuICBbICdjb3JlJywgJ2Jsb2NrJywgJ2lubGluZScgXS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFpbikge1xuICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQodGhpc1tjaGFpbl0ucnVsZXIuZGlzYWJsZShsaXN0LCB0cnVlKSk7XG4gIH0sIHRoaXMpO1xuXG4gIHZhciBtaXNzZWQgPSBsaXN0LmZpbHRlcihmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gcmVzdWx0LmluZGV4T2YobmFtZSkgPCAwOyB9KTtcblxuICBpZiAobWlzc2VkLmxlbmd0aCAmJiAhaWdub3JlSW52YWxpZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTWFya2Rvd25JdC4gRmFpbGVkIHRvIGRpc2FibGUgdW5rbm93biBydWxlKHMpOiAnICsgbWlzc2VkKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqIGNoYWluYWJsZVxuICogTWFya2Rvd25JdC51c2UocGx1Z2luLCBwYXJhbXMpXG4gKlxuICogTG9hZCBzcGVjaWZpZWQgcGx1Z2luIHdpdGggZ2l2ZW4gcGFyYW1zIGludG8gY3VycmVudCBwYXJzZXIgaW5zdGFuY2UuXG4gKiBJdCdzIGp1c3QgYSBzdWdhciB0byBjYWxsIGBwbHVnaW4obWQsIHBhcmFtcylgIHdpdGggY3VycmluZy5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIGl0ZXJhdG9yID0gcmVxdWlyZSgnbWFya2Rvd24taXQtZm9yLWlubGluZScpO1xuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpXG4gKiAgICAgICAgICAgICAudXNlKGl0ZXJhdG9yLCAnZm9vX3JlcGxhY2UnLCAndGV4dCcsIGZ1bmN0aW9uICh0b2tlbnMsIGlkeCkge1xuICogICAgICAgICAgICAgICB0b2tlbnNbaWR4XS5jb250ZW50ID0gdG9rZW5zW2lkeF0uY29udGVudC5yZXBsYWNlKC9mb28vZywgJ2JhcicpO1xuICogICAgICAgICAgICAgfSk7XG4gKiBgYGBcbiAqKi9cbk1hcmtkb3duSXQucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4gLyosIHBhcmFtcywgLi4uICovKSB7XG4gIHZhciBhcmdzID0gWyB0aGlzIF0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICBwbHVnaW4uYXBwbHkocGx1Z2luLCBhcmdzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKiBpbnRlcm5hbFxuICogTWFya2Rvd25JdC5wYXJzZShzcmMsIGVudikgLT4gQXJyYXlcbiAqIC0gc3JjIChTdHJpbmcpOiBzb3VyY2Ugc3RyaW5nXG4gKiAtIGVudiAoT2JqZWN0KTogZW52aXJvbm1lbnQgc2FuZGJveFxuICpcbiAqIFBhcnNlIGlucHV0IHN0cmluZyBhbmQgcmV0dXJucyBsaXN0IG9mIGJsb2NrIHRva2VucyAoc3BlY2lhbCB0b2tlbiB0eXBlXG4gKiBcImlubGluZVwiIHdpbGwgY29udGFpbiBsaXN0IG9mIGlubGluZSB0b2tlbnMpLiBZb3Ugc2hvdWxkIG5vdCBjYWxsIHRoaXNcbiAqIG1ldGhvZCBkaXJlY3RseSwgdW50aWwgeW91IHdyaXRlIGN1c3RvbSByZW5kZXJlciAoZm9yIGV4YW1wbGUsIHRvIHByb2R1Y2VcbiAqIEFTVCkuXG4gKlxuICogYGVudmAgaXMgdXNlZCB0byBwYXNzIGRhdGEgYmV0d2VlbiBcImRpc3RyaWJ1dGVkXCIgcnVsZXMgYW5kIHJldHVybiBhZGRpdGlvbmFsXG4gKiBtZXRhZGF0YSBsaWtlIHJlZmVyZW5jZSBpbmZvLCBuZWVkZWQgZm9yIGZvciByZW5kZXJlci4gSXQgYWxzbyBjYW4gYmUgdXNlZCB0b1xuICogaW5qZWN0IGRhdGEgaW4gc3BlY2lmaWMgY2FzZXMuIFVzdWFsbHksIHlvdSB3aWxsIGJlIG9rIHRvIHBhc3MgYHt9YCxcbiAqIGFuZCB0aGVuIHBhc3MgdXBkYXRlZCBvYmplY3QgdG8gcmVuZGVyZXIuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChzcmMsIGVudikge1xuICB2YXIgc3RhdGUgPSBuZXcgdGhpcy5jb3JlLlN0YXRlKHNyYywgdGhpcywgZW52KTtcblxuICB0aGlzLmNvcmUucHJvY2VzcyhzdGF0ZSk7XG5cbiAgcmV0dXJuIHN0YXRlLnRva2Vucztcbn07XG5cblxuLyoqXG4gKiBNYXJrZG93bkl0LnJlbmRlcihzcmMgWywgZW52XSkgLT4gU3RyaW5nXG4gKiAtIHNyYyAoU3RyaW5nKTogc291cmNlIHN0cmluZ1xuICogLSBlbnYgKE9iamVjdCk6IGVudmlyb25tZW50IHNhbmRib3hcbiAqXG4gKiBSZW5kZXIgbWFya2Rvd24gc3RyaW5nIGludG8gaHRtbC4gSXQgZG9lcyBhbGwgbWFnaWMgZm9yIHlvdSA6KS5cbiAqXG4gKiBgZW52YCBjYW4gYmUgdXNlZCB0byBpbmplY3QgYWRkaXRpb25hbCBtZXRhZGF0YSAoYHt9YCBieSBkZWZhdWx0KS5cbiAqIEJ1dCB5b3Ugd2lsbCBub3QgbmVlZCBpdCB3aXRoIGhpZ2ggcHJvYmFiaWxpdHkuIFNlZSBhbHNvIGNvbW1lbnRcbiAqIGluIFtbTWFya2Rvd25JdC5wYXJzZV1dLlxuICoqL1xuTWFya2Rvd25JdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHNyYywgZW52KSB7XG4gIGVudiA9IGVudiB8fCB7fTtcblxuICByZXR1cm4gdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5wYXJzZShzcmMsIGVudiksIHRoaXMub3B0aW9ucywgZW52KTtcbn07XG5cblxuLyoqIGludGVybmFsXG4gKiBNYXJrZG93bkl0LnBhcnNlSW5saW5lKHNyYywgZW52KSAtPiBBcnJheVxuICogLSBzcmMgKFN0cmluZyk6IHNvdXJjZSBzdHJpbmdcbiAqIC0gZW52IChPYmplY3QpOiBlbnZpcm9ubWVudCBzYW5kYm94XG4gKlxuICogVGhlIHNhbWUgYXMgW1tNYXJrZG93bkl0LnBhcnNlXV0gYnV0IHNraXAgYWxsIGJsb2NrIHJ1bGVzLiBJdCByZXR1cm5zIHRoZVxuICogYmxvY2sgdG9rZW5zIGxpc3Qgd2l0aCB0aGUgc2luZ2xlIGBpbmxpbmVgIGVsZW1lbnQsIGNvbnRhaW5pbmcgcGFyc2VkIGlubGluZVxuICogdG9rZW5zIGluIGBjaGlsZHJlbmAgcHJvcGVydHkuIEFsc28gdXBkYXRlcyBgZW52YCBvYmplY3QuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5wYXJzZUlubGluZSA9IGZ1bmN0aW9uIChzcmMsIGVudikge1xuICB2YXIgc3RhdGUgPSBuZXcgdGhpcy5jb3JlLlN0YXRlKHNyYywgdGhpcywgZW52KTtcblxuICBzdGF0ZS5pbmxpbmVNb2RlID0gdHJ1ZTtcbiAgdGhpcy5jb3JlLnByb2Nlc3Moc3RhdGUpO1xuXG4gIHJldHVybiBzdGF0ZS50b2tlbnM7XG59O1xuXG5cbi8qKlxuICogTWFya2Rvd25JdC5yZW5kZXJJbmxpbmUoc3JjIFssIGVudl0pIC0+IFN0cmluZ1xuICogLSBzcmMgKFN0cmluZyk6IHNvdXJjZSBzdHJpbmdcbiAqIC0gZW52IChPYmplY3QpOiBlbnZpcm9ubWVudCBzYW5kYm94XG4gKlxuICogU2ltaWxhciB0byBbW01hcmtkb3duSXQucmVuZGVyXV0gYnV0IGZvciBzaW5nbGUgcGFyYWdyYXBoIGNvbnRlbnQuIFJlc3VsdFxuICogd2lsbCBOT1QgYmUgd3JhcHBlZCBpbnRvIGA8cD5gIHRhZ3MuXG4gKiovXG5NYXJrZG93bkl0LnByb3RvdHlwZS5yZW5kZXJJbmxpbmUgPSBmdW5jdGlvbiAoc3JjLCBlbnYpIHtcbiAgZW52ID0gZW52IHx8IHt9O1xuXG4gIHJldHVybiB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnBhcnNlSW5saW5lKHNyYywgZW52KSwgdGhpcy5vcHRpb25zLCBlbnYpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmtkb3duSXQ7XG4iLCIvKiogaW50ZXJuYWxcbiAqIGNsYXNzIFBhcnNlckJsb2NrXG4gKlxuICogQmxvY2stbGV2ZWwgdG9rZW5pemVyLlxuICoqL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBSdWxlciAgICAgICAgICAgPSByZXF1aXJlKCcuL3J1bGVyJyk7XG5cblxudmFyIF9ydWxlcyA9IFtcbiAgLy8gRmlyc3QgMiBwYXJhbXMgLSBydWxlIG5hbWUgJiBzb3VyY2UuIFNlY29uZGFyeSBhcnJheSAtIGxpc3Qgb2YgcnVsZXMsXG4gIC8vIHdoaWNoIGNhbiBiZSB0ZXJtaW5hdGVkIGJ5IHRoaXMgb25lLlxuICBbICdjb2RlJywgICAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9jb2RlJykgXSxcbiAgWyAnZmVuY2UnLCAgICAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svZmVuY2UnKSwgICAgICBbICdwYXJhZ3JhcGgnLCAncmVmZXJlbmNlJywgJ2Jsb2NrcXVvdGUnLCAnbGlzdCcgXSBdLFxuICBbICdibG9ja3F1b3RlJywgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9ibG9ja3F1b3RlJyksIFsgJ3BhcmFncmFwaCcsICdyZWZlcmVuY2UnLCAnbGlzdCcgXSBdLFxuICBbICdocicsICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9ocicpLCAgICAgICAgIFsgJ3BhcmFncmFwaCcsICdyZWZlcmVuY2UnLCAnYmxvY2txdW90ZScsICdsaXN0JyBdIF0sXG4gIFsgJ2xpc3QnLCAgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2xpc3QnKSwgICAgICAgWyAncGFyYWdyYXBoJywgJ3JlZmVyZW5jZScsICdibG9ja3F1b3RlJyBdIF0sXG4gIFsgJ3JlZmVyZW5jZScsICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL3JlZmVyZW5jZScpIF0sXG4gIFsgJ2hlYWRpbmcnLCAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2hlYWRpbmcnKSwgICAgWyAncGFyYWdyYXBoJywgJ3JlZmVyZW5jZScsICdibG9ja3F1b3RlJyBdIF0sXG4gIFsgJ2xoZWFkaW5nJywgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2xoZWFkaW5nJykgXSxcbiAgWyAnaHRtbF9ibG9jaycsIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svaHRtbF9ibG9jaycpLCBbICdwYXJhZ3JhcGgnLCAncmVmZXJlbmNlJywgJ2Jsb2NrcXVvdGUnIF0gXSxcbiAgWyAndGFibGUnLCAgICAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svdGFibGUnKSwgICAgICBbICdwYXJhZ3JhcGgnLCAncmVmZXJlbmNlJyBdIF0sXG4gIFsgJ3BhcmFncmFwaCcsICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL3BhcmFncmFwaCcpIF1cbl07XG5cblxuLyoqXG4gKiBuZXcgUGFyc2VyQmxvY2soKVxuICoqL1xuZnVuY3Rpb24gUGFyc2VyQmxvY2soKSB7XG4gIC8qKlxuICAgKiBQYXJzZXJCbG9jayNydWxlciAtPiBSdWxlclxuICAgKlxuICAgKiBbW1J1bGVyXV0gaW5zdGFuY2UuIEtlZXAgY29uZmlndXJhdGlvbiBvZiBibG9jayBydWxlcy5cbiAgICoqL1xuICB0aGlzLnJ1bGVyID0gbmV3IFJ1bGVyKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBfcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLnJ1bGVyLnB1c2goX3J1bGVzW2ldWzBdLCBfcnVsZXNbaV1bMV0sIHsgYWx0OiAoX3J1bGVzW2ldWzJdIHx8IFtdKS5zbGljZSgpIH0pO1xuICB9XG59XG5cblxuLy8gR2VuZXJhdGUgdG9rZW5zIGZvciBpbnB1dCByYW5nZVxuLy9cblBhcnNlckJsb2NrLnByb3RvdHlwZS50b2tlbml6ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lKSB7XG4gIHZhciBvaywgaSxcbiAgICAgIHJ1bGVzID0gdGhpcy5ydWxlci5nZXRSdWxlcygnJyksXG4gICAgICBsZW4gPSBydWxlcy5sZW5ndGgsXG4gICAgICBsaW5lID0gc3RhcnRMaW5lLFxuICAgICAgaGFzRW1wdHlMaW5lcyA9IGZhbHNlLFxuICAgICAgbWF4TmVzdGluZyA9IHN0YXRlLm1kLm9wdGlvbnMubWF4TmVzdGluZztcblxuICB3aGlsZSAobGluZSA8IGVuZExpbmUpIHtcbiAgICBzdGF0ZS5saW5lID0gbGluZSA9IHN0YXRlLnNraXBFbXB0eUxpbmVzKGxpbmUpO1xuICAgIGlmIChsaW5lID49IGVuZExpbmUpIHsgYnJlYWs7IH1cblxuICAgIC8vIFRlcm1pbmF0aW9uIGNvbmRpdGlvbiBmb3IgbmVzdGVkIGNhbGxzLlxuICAgIC8vIE5lc3RlZCBjYWxscyBjdXJyZW50bHkgdXNlZCBmb3IgYmxvY2txdW90ZXMgJiBsaXN0c1xuICAgIGlmIChzdGF0ZS50U2hpZnRbbGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgYnJlYWs7IH1cblxuICAgIC8vIElmIG5lc3RpbmcgbGV2ZWwgZXhjZWVkZWQgLSBza2lwIHRhaWwgdG8gdGhlIGVuZC4gVGhhdCdzIG5vdCBvcmRpbmFyeVxuICAgIC8vIHNpdHVhdGlvbiBhbmQgd2Ugc2hvdWxkIG5vdCBjYXJlIGFib3V0IGNvbnRlbnQuXG4gICAgaWYgKHN0YXRlLmxldmVsID49IG1heE5lc3RpbmcpIHtcbiAgICAgIHN0YXRlLmxpbmUgPSBlbmRMaW5lO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gVHJ5IGFsbCBwb3NzaWJsZSBydWxlcy5cbiAgICAvLyBPbiBzdWNjZXNzLCBydWxlIHNob3VsZDpcbiAgICAvL1xuICAgIC8vIC0gdXBkYXRlIGBzdGF0ZS5saW5lYFxuICAgIC8vIC0gdXBkYXRlIGBzdGF0ZS50b2tlbnNgXG4gICAgLy8gLSByZXR1cm4gdHJ1ZVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBvayA9IHJ1bGVzW2ldKHN0YXRlLCBsaW5lLCBlbmRMaW5lLCBmYWxzZSk7XG4gICAgICBpZiAob2spIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICAvLyBzZXQgc3RhdGUudGlnaHQgaWZmIHdlIGhhZCBhbiBlbXB0eSBsaW5lIGJlZm9yZSBjdXJyZW50IHRhZ1xuICAgIC8vIGkuZS4gbGF0ZXN0IGVtcHR5IGxpbmUgc2hvdWxkIG5vdCBjb3VudFxuICAgIHN0YXRlLnRpZ2h0ID0gIWhhc0VtcHR5TGluZXM7XG5cbiAgICAvLyBwYXJhZ3JhcGggbWlnaHQgXCJlYXRcIiBvbmUgbmV3bGluZSBhZnRlciBpdCBpbiBuZXN0ZWQgbGlzdHNcbiAgICBpZiAoc3RhdGUuaXNFbXB0eShzdGF0ZS5saW5lIC0gMSkpIHtcbiAgICAgIGhhc0VtcHR5TGluZXMgPSB0cnVlO1xuICAgIH1cblxuICAgIGxpbmUgPSBzdGF0ZS5saW5lO1xuXG4gICAgaWYgKGxpbmUgPCBlbmRMaW5lICYmIHN0YXRlLmlzRW1wdHkobGluZSkpIHtcbiAgICAgIGhhc0VtcHR5TGluZXMgPSB0cnVlO1xuICAgICAgbGluZSsrO1xuXG4gICAgICAvLyB0d28gZW1wdHkgbGluZXMgc2hvdWxkIHN0b3AgdGhlIHBhcnNlciBpbiBsaXN0IG1vZGVcbiAgICAgIGlmIChsaW5lIDwgZW5kTGluZSAmJiBzdGF0ZS5wYXJlbnRUeXBlID09PSAnbGlzdCcgJiYgc3RhdGUuaXNFbXB0eShsaW5lKSkgeyBicmVhazsgfVxuICAgICAgc3RhdGUubGluZSA9IGxpbmU7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogUGFyc2VyQmxvY2sucGFyc2Uoc3RyLCBtZCwgZW52LCBvdXRUb2tlbnMpXG4gKlxuICogUHJvY2VzcyBpbnB1dCBzdHJpbmcgYW5kIHB1c2ggYmxvY2sgdG9rZW5zIGludG8gYG91dFRva2Vuc2BcbiAqKi9cblBhcnNlckJsb2NrLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChzcmMsIG1kLCBlbnYsIG91dFRva2Vucykge1xuICB2YXIgc3RhdGU7XG5cbiAgaWYgKCFzcmMpIHsgcmV0dXJuIFtdOyB9XG5cbiAgc3RhdGUgPSBuZXcgdGhpcy5TdGF0ZShzcmMsIG1kLCBlbnYsIG91dFRva2Vucyk7XG5cbiAgdGhpcy50b2tlbml6ZShzdGF0ZSwgc3RhdGUubGluZSwgc3RhdGUubGluZU1heCk7XG59O1xuXG5cblBhcnNlckJsb2NrLnByb3RvdHlwZS5TdGF0ZSA9IHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svc3RhdGVfYmxvY2snKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlckJsb2NrO1xuIiwiLyoqIGludGVybmFsXG4gKiBjbGFzcyBDb3JlXG4gKlxuICogVG9wLWxldmVsIHJ1bGVzIGV4ZWN1dG9yLiBHbHVlcyBibG9jay9pbmxpbmUgcGFyc2VycyBhbmQgZG9lcyBpbnRlcm1lZGlhdGVcbiAqIHRyYW5zZm9ybWF0aW9ucy5cbiAqKi9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgUnVsZXIgID0gcmVxdWlyZSgnLi9ydWxlcicpO1xuXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ25vcm1hbGl6ZScsICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL25vcm1hbGl6ZScpICAgICAgXSxcbiAgWyAnYmxvY2snLCAgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvYmxvY2snKSAgICAgICAgICBdLFxuICBbICdpbmxpbmUnLCAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9pbmxpbmUnKSAgICAgICAgIF0sXG4gIFsgJ2xpbmtpZnknLCAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL2xpbmtpZnknKSAgICAgICAgXSxcbiAgWyAncmVwbGFjZW1lbnRzJywgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvcmVwbGFjZW1lbnRzJykgICBdLFxuICBbICdzbWFydHF1b3RlcycsICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9zbWFydHF1b3RlcycpICAgIF1cbl07XG5cblxuLyoqXG4gKiBuZXcgQ29yZSgpXG4gKiovXG5mdW5jdGlvbiBDb3JlKCkge1xuICAvKipcbiAgICogQ29yZSNydWxlciAtPiBSdWxlclxuICAgKlxuICAgKiBbW1J1bGVyXV0gaW5zdGFuY2UuIEtlZXAgY29uZmlndXJhdGlvbiBvZiBjb3JlIHJ1bGVzLlxuICAgKiovXG4gIHRoaXMucnVsZXIgPSBuZXcgUnVsZXIoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IF9ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMucnVsZXIucHVzaChfcnVsZXNbaV1bMF0sIF9ydWxlc1tpXVsxXSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIENvcmUucHJvY2VzcyhzdGF0ZSlcbiAqXG4gKiBFeGVjdXRlcyBjb3JlIGNoYWluIHJ1bGVzLlxuICoqL1xuQ29yZS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICB2YXIgaSwgbCwgcnVsZXM7XG5cbiAgcnVsZXMgPSB0aGlzLnJ1bGVyLmdldFJ1bGVzKCcnKTtcblxuICBmb3IgKGkgPSAwLCBsID0gcnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcnVsZXNbaV0oc3RhdGUpO1xuICB9XG59O1xuXG5Db3JlLnByb3RvdHlwZS5TdGF0ZSA9IHJlcXVpcmUoJy4vcnVsZXNfY29yZS9zdGF0ZV9jb3JlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb3JlO1xuIiwiLyoqIGludGVybmFsXG4gKiBjbGFzcyBQYXJzZXJJbmxpbmVcbiAqXG4gKiBUb2tlbml6ZXMgcGFyYWdyYXBoIGNvbnRlbnQuXG4gKiovXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFJ1bGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vcnVsZXInKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gUGFyc2VyIHJ1bGVzXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ3RleHQnLCAgICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL3RleHQnKSBdLFxuICBbICduZXdsaW5lJywgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9uZXdsaW5lJykgXSxcbiAgWyAnZXNjYXBlJywgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvZXNjYXBlJykgXSxcbiAgWyAnYmFja3RpY2tzJywgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvYmFja3RpY2tzJykgXSxcbiAgWyAnc3RyaWtldGhyb3VnaCcsICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3RyaWtldGhyb3VnaCcpIF0sXG4gIFsgJ2VtcGhhc2lzJywgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2VtcGhhc2lzJykgXSxcbiAgWyAnbGluaycsICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvbGluaycpIF0sXG4gIFsgJ2ltYWdlJywgICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2ltYWdlJykgXSxcbiAgWyAnYXV0b2xpbmsnLCAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvYXV0b2xpbmsnKSBdLFxuICBbICdodG1sX2lubGluZScsICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9odG1sX2lubGluZScpIF0sXG4gIFsgJ2VudGl0eScsICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2VudGl0eScpIF1cbl07XG5cblxuLyoqXG4gKiBuZXcgUGFyc2VySW5saW5lKClcbiAqKi9cbmZ1bmN0aW9uIFBhcnNlcklubGluZSgpIHtcbiAgLyoqXG4gICAqIFBhcnNlcklubGluZSNydWxlciAtPiBSdWxlclxuICAgKlxuICAgKiBbW1J1bGVyXV0gaW5zdGFuY2UuIEtlZXAgY29uZmlndXJhdGlvbiBvZiBpbmxpbmUgcnVsZXMuXG4gICAqKi9cbiAgdGhpcy5ydWxlciA9IG5ldyBSdWxlcigpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgX3J1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5ydWxlci5wdXNoKF9ydWxlc1tpXVswXSwgX3J1bGVzW2ldWzFdKTtcbiAgfVxufVxuXG5cbi8vIFNraXAgc2luZ2xlIHRva2VuIGJ5IHJ1bm5pbmcgYWxsIHJ1bGVzIGluIHZhbGlkYXRpb24gbW9kZTtcbi8vIHJldHVybnMgYHRydWVgIGlmIGFueSBydWxlIHJlcG9ydGVkIHN1Y2Nlc3Ncbi8vXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLnNraXBUb2tlbiA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICB2YXIgaSwgcG9zID0gc3RhdGUucG9zLFxuICAgICAgcnVsZXMgPSB0aGlzLnJ1bGVyLmdldFJ1bGVzKCcnKSxcbiAgICAgIGxlbiA9IHJ1bGVzLmxlbmd0aCxcbiAgICAgIG1heE5lc3RpbmcgPSBzdGF0ZS5tZC5vcHRpb25zLm1heE5lc3RpbmcsXG4gICAgICBjYWNoZSA9IHN0YXRlLmNhY2hlO1xuXG5cbiAgaWYgKHR5cGVvZiBjYWNoZVtwb3NdICE9PSAndW5kZWZpbmVkJykge1xuICAgIHN0YXRlLnBvcyA9IGNhY2hlW3Bvc107XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgZWxzZSovXG4gIGlmIChzdGF0ZS5sZXZlbCA8IG1heE5lc3RpbmcpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmIChydWxlc1tpXShzdGF0ZSwgdHJ1ZSkpIHtcbiAgICAgICAgY2FjaGVbcG9zXSA9IHN0YXRlLnBvcztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnBvcysrO1xuICBjYWNoZVtwb3NdID0gc3RhdGUucG9zO1xufTtcblxuXG4vLyBHZW5lcmF0ZSB0b2tlbnMgZm9yIGlucHV0IHJhbmdlXG4vL1xuUGFyc2VySW5saW5lLnByb3RvdHlwZS50b2tlbml6ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICB2YXIgb2ssIGksXG4gICAgICBydWxlcyA9IHRoaXMucnVsZXIuZ2V0UnVsZXMoJycpLFxuICAgICAgbGVuID0gcnVsZXMubGVuZ3RoLFxuICAgICAgZW5kID0gc3RhdGUucG9zTWF4LFxuICAgICAgbWF4TmVzdGluZyA9IHN0YXRlLm1kLm9wdGlvbnMubWF4TmVzdGluZztcblxuICB3aGlsZSAoc3RhdGUucG9zIDwgZW5kKSB7XG4gICAgLy8gVHJ5IGFsbCBwb3NzaWJsZSBydWxlcy5cbiAgICAvLyBPbiBzdWNjZXNzLCBydWxlIHNob3VsZDpcbiAgICAvL1xuICAgIC8vIC0gdXBkYXRlIGBzdGF0ZS5wb3NgXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLnRva2Vuc2BcbiAgICAvLyAtIHJldHVybiB0cnVlXG5cbiAgICBpZiAoc3RhdGUubGV2ZWwgPCBtYXhOZXN0aW5nKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgb2sgPSBydWxlc1tpXShzdGF0ZSwgZmFsc2UpO1xuICAgICAgICBpZiAob2spIHsgYnJlYWs7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2spIHtcbiAgICAgIGlmIChzdGF0ZS5wb3MgPj0gZW5kKSB7IGJyZWFrOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5wZW5kaW5nICs9IHN0YXRlLnNyY1tzdGF0ZS5wb3MrK107XG4gIH1cblxuICBpZiAoc3RhdGUucGVuZGluZykge1xuICAgIHN0YXRlLnB1c2hQZW5kaW5nKCk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBQYXJzZXJJbmxpbmUucGFyc2Uoc3RyLCBtZCwgZW52LCBvdXRUb2tlbnMpXG4gKlxuICogUHJvY2VzcyBpbnB1dCBzdHJpbmcgYW5kIHB1c2ggaW5saW5lIHRva2VucyBpbnRvIGBvdXRUb2tlbnNgXG4gKiovXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHN0ciwgbWQsIGVudiwgb3V0VG9rZW5zKSB7XG4gIHZhciBzdGF0ZSA9IG5ldyB0aGlzLlN0YXRlKHN0ciwgbWQsIGVudiwgb3V0VG9rZW5zKTtcblxuICB0aGlzLnRva2VuaXplKHN0YXRlKTtcbn07XG5cblxuUGFyc2VySW5saW5lLnByb3RvdHlwZS5TdGF0ZSA9IHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL3N0YXRlX2lubGluZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VySW5saW5lO1xuIiwiLy8gQ29tbW9ubWFyayBkZWZhdWx0IG9wdGlvbnNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvcHRpb25zOiB7XG4gICAgaHRtbDogICAgICAgICB0cnVlLCAgICAgICAgIC8vIEVuYWJsZSBIVE1MIHRhZ3MgaW4gc291cmNlXG4gICAgeGh0bWxPdXQ6ICAgICB0cnVlLCAgICAgICAgIC8vIFVzZSAnLycgdG8gY2xvc2Ugc2luZ2xlIHRhZ3MgKDxiciAvPilcbiAgICBicmVha3M6ICAgICAgIGZhbHNlLCAgICAgICAgLy8gQ29udmVydCAnXFxuJyBpbiBwYXJhZ3JhcGhzIGludG8gPGJyPlxuICAgIGxhbmdQcmVmaXg6ICAgJ2xhbmd1YWdlLScsICAvLyBDU1MgbGFuZ3VhZ2UgcHJlZml4IGZvciBmZW5jZWQgYmxvY2tzXG4gICAgbGlua2lmeTogICAgICBmYWxzZSwgICAgICAgIC8vIGF1dG9jb252ZXJ0IFVSTC1saWtlIHRleHRzIHRvIGxpbmtzXG5cbiAgICAvLyBFbmFibGUgc29tZSBsYW5ndWFnZS1uZXV0cmFsIHJlcGxhY2VtZW50cyArIHF1b3RlcyBiZWF1dGlmaWNhdGlvblxuICAgIHR5cG9ncmFwaGVyOiAgZmFsc2UsXG5cbiAgICAvLyBEb3VibGUgKyBzaW5nbGUgcXVvdGVzIHJlcGxhY2VtZW50IHBhaXJzLCB3aGVuIHR5cG9ncmFwaGVyIGVuYWJsZWQsXG4gICAgLy8gYW5kIHNtYXJ0cXVvdGVzIG9uLiBTZXQgZG91YmxlcyB0byAnwqvCuycgZm9yIFJ1c3NpYW4sICfigJ7igJwnIGZvciBHZXJtYW4uXG4gICAgcXVvdGVzOiAnXFx1MjAxY1xcdTIwMWRcXHUyMDE4XFx1MjAxOScgLyog4oCc4oCd4oCY4oCZICovLFxuXG4gICAgLy8gSGlnaGxpZ2h0ZXIgZnVuY3Rpb24uIFNob3VsZCByZXR1cm4gZXNjYXBlZCBIVE1MLFxuICAgIC8vIG9yICcnIGlmIGlucHV0IG5vdCBjaGFuZ2VkXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiAoLypzdHIsIGxhbmcqLykgeyByZXR1cm4gJyc7IH1cbiAgICAvL1xuICAgIGhpZ2hsaWdodDogbnVsbCxcblxuICAgIG1heE5lc3Rpbmc6ICAgMjAgICAgICAgICAgICAvLyBJbnRlcm5hbCBwcm90ZWN0aW9uLCByZWN1cnNpb24gbGltaXRcbiAgfSxcblxuICBjb21wb25lbnRzOiB7XG5cbiAgICBjb3JlOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAnbm9ybWFsaXplJyxcbiAgICAgICAgJ2Jsb2NrJyxcbiAgICAgICAgJ2lubGluZSdcbiAgICAgIF1cbiAgICB9LFxuXG4gICAgYmxvY2s6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdibG9ja3F1b3RlJyxcbiAgICAgICAgJ2NvZGUnLFxuICAgICAgICAnZmVuY2UnLFxuICAgICAgICAnaGVhZGluZycsXG4gICAgICAgICdocicsXG4gICAgICAgICdodG1sX2Jsb2NrJyxcbiAgICAgICAgJ2xoZWFkaW5nJyxcbiAgICAgICAgJ2xpc3QnLFxuICAgICAgICAncmVmZXJlbmNlJyxcbiAgICAgICAgJ3BhcmFncmFwaCdcbiAgICAgIF1cbiAgICB9LFxuXG4gICAgaW5saW5lOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAnYXV0b2xpbmsnLFxuICAgICAgICAnYmFja3RpY2tzJyxcbiAgICAgICAgJ2VtcGhhc2lzJyxcbiAgICAgICAgJ2VudGl0eScsXG4gICAgICAgICdlc2NhcGUnLFxuICAgICAgICAnaHRtbF9pbmxpbmUnLFxuICAgICAgICAnaW1hZ2UnLFxuICAgICAgICAnbGluaycsXG4gICAgICAgICduZXdsaW5lJyxcbiAgICAgICAgJ3RleHQnXG4gICAgICBdXG4gICAgfVxuICB9XG59O1xuIiwiLy8gbWFya2Rvd24taXQgZGVmYXVsdCBvcHRpb25zXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3B0aW9uczoge1xuICAgIGh0bWw6ICAgICAgICAgZmFsc2UsICAgICAgICAvLyBFbmFibGUgSFRNTCB0YWdzIGluIHNvdXJjZVxuICAgIHhodG1sT3V0OiAgICAgZmFsc2UsICAgICAgICAvLyBVc2UgJy8nIHRvIGNsb3NlIHNpbmdsZSB0YWdzICg8YnIgLz4pXG4gICAgYnJlYWtzOiAgICAgICBmYWxzZSwgICAgICAgIC8vIENvbnZlcnQgJ1xcbicgaW4gcGFyYWdyYXBocyBpbnRvIDxicj5cbiAgICBsYW5nUHJlZml4OiAgICdsYW5ndWFnZS0nLCAgLy8gQ1NTIGxhbmd1YWdlIHByZWZpeCBmb3IgZmVuY2VkIGJsb2Nrc1xuICAgIGxpbmtpZnk6ICAgICAgZmFsc2UsICAgICAgICAvLyBhdXRvY29udmVydCBVUkwtbGlrZSB0ZXh0cyB0byBsaW5rc1xuXG4gICAgLy8gRW5hYmxlIHNvbWUgbGFuZ3VhZ2UtbmV1dHJhbCByZXBsYWNlbWVudHMgKyBxdW90ZXMgYmVhdXRpZmljYXRpb25cbiAgICB0eXBvZ3JhcGhlcjogIGZhbHNlLFxuXG4gICAgLy8gRG91YmxlICsgc2luZ2xlIHF1b3RlcyByZXBsYWNlbWVudCBwYWlycywgd2hlbiB0eXBvZ3JhcGhlciBlbmFibGVkLFxuICAgIC8vIGFuZCBzbWFydHF1b3RlcyBvbi4gU2V0IGRvdWJsZXMgdG8gJ8KrwrsnIGZvciBSdXNzaWFuLCAn4oCe4oCcJyBmb3IgR2VybWFuLlxuICAgIHF1b3RlczogJ1xcdTIwMWNcXHUyMDFkXFx1MjAxOFxcdTIwMTknIC8qIOKAnOKAneKAmOKAmSAqLyxcblxuICAgIC8vIEhpZ2hsaWdodGVyIGZ1bmN0aW9uLiBTaG91bGQgcmV0dXJuIGVzY2FwZWQgSFRNTCxcbiAgICAvLyBvciAnJyBpZiBpbnB1dCBub3QgY2hhbmdlZFxuICAgIC8vXG4gICAgLy8gZnVuY3Rpb24gKC8qc3RyLCBsYW5nKi8pIHsgcmV0dXJuICcnOyB9XG4gICAgLy9cbiAgICBoaWdobGlnaHQ6IG51bGwsXG5cbiAgICBtYXhOZXN0aW5nOiAgIDIwICAgICAgICAgICAgLy8gSW50ZXJuYWwgcHJvdGVjdGlvbiwgcmVjdXJzaW9uIGxpbWl0XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuXG4gICAgY29yZToge30sXG4gICAgYmxvY2s6IHt9LFxuICAgIGlubGluZToge31cbiAgfVxufTtcbiIsIi8vIFwiWmVyb1wiIHByZXNldCwgd2l0aCBub3RoaW5nIGVuYWJsZWQuIFVzZWZ1bCBmb3IgbWFudWFsIGNvbmZpZ3VyaW5nIG9mIHNpbXBsZVxuLy8gbW9kZXMuIEZvciBleGFtcGxlLCB0byBwYXJzZSBib2xkL2l0YWxpYyBvbmx5LlxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG9wdGlvbnM6IHtcbiAgICBodG1sOiAgICAgICAgIGZhbHNlLCAgICAgICAgLy8gRW5hYmxlIEhUTUwgdGFncyBpbiBzb3VyY2VcbiAgICB4aHRtbE91dDogICAgIGZhbHNlLCAgICAgICAgLy8gVXNlICcvJyB0byBjbG9zZSBzaW5nbGUgdGFncyAoPGJyIC8+KVxuICAgIGJyZWFrczogICAgICAgZmFsc2UsICAgICAgICAvLyBDb252ZXJ0ICdcXG4nIGluIHBhcmFncmFwaHMgaW50byA8YnI+XG4gICAgbGFuZ1ByZWZpeDogICAnbGFuZ3VhZ2UtJywgIC8vIENTUyBsYW5ndWFnZSBwcmVmaXggZm9yIGZlbmNlZCBibG9ja3NcbiAgICBsaW5raWZ5OiAgICAgIGZhbHNlLCAgICAgICAgLy8gYXV0b2NvbnZlcnQgVVJMLWxpa2UgdGV4dHMgdG8gbGlua3NcblxuICAgIC8vIEVuYWJsZSBzb21lIGxhbmd1YWdlLW5ldXRyYWwgcmVwbGFjZW1lbnRzICsgcXVvdGVzIGJlYXV0aWZpY2F0aW9uXG4gICAgdHlwb2dyYXBoZXI6ICBmYWxzZSxcblxuICAgIC8vIERvdWJsZSArIHNpbmdsZSBxdW90ZXMgcmVwbGFjZW1lbnQgcGFpcnMsIHdoZW4gdHlwb2dyYXBoZXIgZW5hYmxlZCxcbiAgICAvLyBhbmQgc21hcnRxdW90ZXMgb24uIFNldCBkb3VibGVzIHRvICfCq8K7JyBmb3IgUnVzc2lhbiwgJ+KAnuKAnCcgZm9yIEdlcm1hbi5cbiAgICBxdW90ZXM6ICdcXHUyMDFjXFx1MjAxZFxcdTIwMThcXHUyMDE5JyAvKiDigJzigJ3igJjigJkgKi8sXG5cbiAgICAvLyBIaWdobGlnaHRlciBmdW5jdGlvbi4gU2hvdWxkIHJldHVybiBlc2NhcGVkIEhUTUwsXG4gICAgLy8gb3IgJycgaWYgaW5wdXQgbm90IGNoYW5nZWRcbiAgICAvL1xuICAgIC8vIGZ1bmN0aW9uICgvKnN0ciwgbGFuZyovKSB7IHJldHVybiAnJzsgfVxuICAgIC8vXG4gICAgaGlnaGxpZ2h0OiBudWxsLFxuXG4gICAgbWF4TmVzdGluZzogICAyMCAgICAgICAgICAgIC8vIEludGVybmFsIHByb3RlY3Rpb24sIHJlY3Vyc2lvbiBsaW1pdFxuICB9LFxuXG4gIGNvbXBvbmVudHM6IHtcblxuICAgIGNvcmU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdub3JtYWxpemUnLFxuICAgICAgICAnYmxvY2snLFxuICAgICAgICAnaW5saW5lJ1xuICAgICAgXVxuICAgIH0sXG5cbiAgICBibG9jazoge1xuICAgICAgcnVsZXM6IFtcbiAgICAgICAgJ3BhcmFncmFwaCdcbiAgICAgIF1cbiAgICB9LFxuXG4gICAgaW5saW5lOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAndGV4dCdcbiAgICAgIF1cbiAgICB9XG4gIH1cbn07XG4iLCIvKipcbiAqIGNsYXNzIFJlbmRlcmVyXG4gKlxuICogR2VuZXJhdGVzIEhUTUwgZnJvbSBwYXJzZWQgdG9rZW4gc3RyZWFtLiBFYWNoIGluc3RhbmNlIGhhcyBpbmRlcGVuZGVudFxuICogY29weSBvZiBydWxlcy4gVGhvc2UgY2FuIGJlIHJld3JpdHRlbiB3aXRoIGVhc2UuIEFsc28sIHlvdSBjYW4gYWRkIG5ld1xuICogcnVsZXMgaWYgeW91IGNyZWF0ZSBwbHVnaW4gYW5kIGFkZHMgbmV3IHRva2VuIHR5cGVzLlxuICoqL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBhc3NpZ24gICAgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLmFzc2lnbjtcbnZhciB1bmVzY2FwZUFsbCAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLnVuZXNjYXBlQWxsO1xudmFyIGVzY2FwZUh0bWwgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykuZXNjYXBlSHRtbDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgZGVmYXVsdF9ydWxlcyA9IHt9O1xuXG5cbmRlZmF1bHRfcnVsZXMuY29kZV9pbmxpbmUgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxjb2RlPicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpICsgJzwvY29kZT4nO1xufTtcblxuXG5kZWZhdWx0X3J1bGVzLmNvZGVfYmxvY2sgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxwcmU+PGNvZGU+JyArIGVzY2FwZUh0bWwodG9rZW5zW2lkeF0uY29udGVudCkgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG59O1xuXG5cbmRlZmF1bHRfcnVsZXMuZmVuY2UgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZikge1xuICB2YXIgdG9rZW4gPSB0b2tlbnNbaWR4XSxcbiAgICAgIGxhbmdOYW1lID0gJycsXG4gICAgICBoaWdobGlnaHRlZDtcblxuICBpZiAodG9rZW4uaW5mbykge1xuICAgIGxhbmdOYW1lID0gdW5lc2NhcGVBbGwodG9rZW4uaW5mby50cmltKCkuc3BsaXQoL1xccysvZylbMF0pO1xuICAgIHRva2VuLmF0dHJQdXNoKFsgJ2NsYXNzJywgb3B0aW9ucy5sYW5nUHJlZml4ICsgbGFuZ05hbWUgXSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICBoaWdobGlnaHRlZCA9IG9wdGlvbnMuaGlnaGxpZ2h0KHRva2VuLmNvbnRlbnQsIGxhbmdOYW1lKSB8fCBlc2NhcGVIdG1sKHRva2VuLmNvbnRlbnQpO1xuICB9IGVsc2Uge1xuICAgIGhpZ2hsaWdodGVkID0gZXNjYXBlSHRtbCh0b2tlbi5jb250ZW50KTtcbiAgfVxuXG4gIHJldHVybiAgJzxwcmU+PGNvZGUnICsgc2VsZi5yZW5kZXJBdHRycyh0b2tlbikgKyAnPidcbiAgICAgICAgKyBoaWdobGlnaHRlZFxuICAgICAgICArICc8L2NvZGU+PC9wcmU+XFxuJztcbn07XG5cblxuZGVmYXVsdF9ydWxlcy5pbWFnZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCBzZWxmKSB7XG4gIHZhciB0b2tlbiA9IHRva2Vuc1tpZHhdO1xuXG4gIC8vIFwiYWx0XCIgYXR0ciBNVVNUIGJlIHNldCwgZXZlbiBpZiBlbXB0eS4gQmVjYXVzZSBpdCdzIG1hbmRhdG9yeSBhbmRcbiAgLy8gc2hvdWxkIGJlIHBsYWNlZCBvbiBwcm9wZXIgcG9zaXRpb24gZm9yIHRlc3RzLlxuICAvL1xuICAvLyBSZXBsYWNlIGNvbnRlbnQgd2l0aCBhY3R1YWwgdmFsdWVcblxuICB0b2tlbi5hdHRyc1t0b2tlbi5hdHRySW5kZXgoJ2FsdCcpXVsxXSA9XG4gICAgc2VsZi5yZW5kZXJJbmxpbmVBc1RleHQodG9rZW4uY2hpbGRyZW4sIG9wdGlvbnMsIGVudik7XG5cbiAgcmV0dXJuIHNlbGYucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2VsZik7XG59O1xuXG5cbmRlZmF1bHRfcnVsZXMuaGFyZGJyZWFrID0gZnVuY3Rpb24gKHRva2VucywgaWR4LCBvcHRpb25zIC8qLCBlbnYgKi8pIHtcbiAgcmV0dXJuIG9wdGlvbnMueGh0bWxPdXQgPyAnPGJyIC8+XFxuJyA6ICc8YnI+XFxuJztcbn07XG5kZWZhdWx0X3J1bGVzLnNvZnRicmVhayA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucyAvKiwgZW52ICovKSB7XG4gIHJldHVybiBvcHRpb25zLmJyZWFrcyA/IChvcHRpb25zLnhodG1sT3V0ID8gJzxiciAvPlxcbicgOiAnPGJyPlxcbicpIDogJ1xcbic7XG59O1xuXG5cbmRlZmF1bHRfcnVsZXMudGV4dCA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpO1xufTtcblxuXG5kZWZhdWx0X3J1bGVzLmh0bWxfYmxvY2sgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gdG9rZW5zW2lkeF0uY29udGVudDtcbn07XG5kZWZhdWx0X3J1bGVzLmh0bWxfaW5saW5lID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuIHRva2Vuc1tpZHhdLmNvbnRlbnQ7XG59O1xuXG5cbi8qKlxuICogbmV3IFJlbmRlcmVyKClcbiAqXG4gKiBDcmVhdGVzIG5ldyBbW1JlbmRlcmVyXV0gaW5zdGFuY2UgYW5kIGZpbGwgW1tSZW5kZXJlciNydWxlc11dIHdpdGggZGVmYXVsdHMuXG4gKiovXG5mdW5jdGlvbiBSZW5kZXJlcigpIHtcblxuICAvKipcbiAgICogUmVuZGVyZXIjcnVsZXMgLT4gT2JqZWN0XG4gICAqXG4gICAqIENvbnRhaW5zIHJlbmRlciBydWxlcyBmb3IgdG9rZW5zLiBDYW4gYmUgdXBkYXRlZCBhbmQgZXh0ZW5kZWQuXG4gICAqXG4gICAqICMjIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gICAqXG4gICAqIG1kLnJlbmRlcmVyLnJ1bGVzLnN0cm9uZ19vcGVuICA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICc8Yj4nOyB9O1xuICAgKiBtZC5yZW5kZXJlci5ydWxlcy5zdHJvbmdfY2xvc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnPC9iPic7IH07XG4gICAqXG4gICAqIHZhciByZXN1bHQgPSBtZC5yZW5kZXJJbmxpbmUoLi4uKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEVhY2ggcnVsZSBpcyBjYWxsZWQgYXMgaW5kZXBlbmRlZCBzdGF0aWMgZnVuY3Rpb24gd2l0aCBmaXhlZCBzaWduYXR1cmU6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogZnVuY3Rpb24gbXlfdG9rZW5fcmVuZGVyKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHJlbmRlcmVyKSB7XG4gICAqICAgLy8gLi4uXG4gICAqICAgcmV0dXJuIHJlbmRlcmVkSFRNTDtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogU2VlIFtzb3VyY2UgY29kZV0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2Jsb2IvbWFzdGVyL2xpYi9yZW5kZXJlci5qcylcbiAgICogZm9yIG1vcmUgZGV0YWlscyBhbmQgZXhhbXBsZXMuXG4gICAqKi9cbiAgdGhpcy5ydWxlcyA9IGFzc2lnbih7fSwgZGVmYXVsdF9ydWxlcyk7XG59XG5cblxuLyoqXG4gKiBSZW5kZXJlci5yZW5kZXJBdHRycyh0b2tlbikgLT4gU3RyaW5nXG4gKlxuICogUmVuZGVyIHRva2VuIGF0dHJpYnV0ZXMgdG8gc3RyaW5nLlxuICoqL1xuUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlckF0dHJzID0gZnVuY3Rpb24gcmVuZGVyQXR0cnModG9rZW4pIHtcbiAgdmFyIGksIGwsIHJlc3VsdDtcblxuICBpZiAoIXRva2VuLmF0dHJzKSB7IHJldHVybiAnJzsgfVxuXG4gIHJlc3VsdCA9ICcnO1xuXG4gIGZvciAoaSA9IDAsIGwgPSB0b2tlbi5hdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICByZXN1bHQgKz0gJyAnICsgZXNjYXBlSHRtbCh0b2tlbi5hdHRyc1tpXVswXSkgKyAnPVwiJyArIGVzY2FwZUh0bWwodG9rZW4uYXR0cnNbaV1bMV0pICsgJ1wiJztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKlxuICogUmVuZGVyZXIucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMpIC0+IFN0cmluZ1xuICogLSB0b2tlbnMgKEFycmF5KTogbGlzdCBvZiB0b2tlbnNcbiAqIC0gaWR4IChOdW1iZWQpOiB0b2tlbiBpbmRleCB0byByZW5kZXJcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcGFyYW1zIG9mIHBhcnNlciBpbnN0YW5jZVxuICpcbiAqIERlZmF1bHQgdG9rZW4gcmVuZGVyZXIuIENhbiBiZSBvdmVycmlkZW4gYnkgY3VzdG9tIGZ1bmN0aW9uXG4gKiBpbiBbW1JlbmRlcmVyI3J1bGVzXV0uXG4gKiovXG5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyVG9rZW4gPSBmdW5jdGlvbiByZW5kZXJUb2tlbih0b2tlbnMsIGlkeCwgb3B0aW9ucykge1xuICB2YXIgbmV4dFRva2VuLFxuICAgICAgcmVzdWx0ID0gJycsXG4gICAgICBuZWVkTGYgPSBmYWxzZSxcbiAgICAgIHRva2VuID0gdG9rZW5zW2lkeF07XG5cbiAgLy8gVGlnaHQgbGlzdCBwYXJhZ3JhcGhzXG4gIGlmICh0b2tlbi5oaWRkZW4pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvLyBJbnNlcnQgYSBuZXdsaW5lIGJldHdlZW4gaGlkZGVuIHBhcmFncmFwaCBhbmQgc3Vic2VxdWVudCBvcGVuaW5nXG4gIC8vIGJsb2NrLWxldmVsIHRhZy5cbiAgLy9cbiAgLy8gRm9yIGV4YW1wbGUsIGhlcmUgd2Ugc2hvdWxkIGluc2VydCBhIG5ld2xpbmUgYmVmb3JlIGJsb2NrcXVvdGU6XG4gIC8vICAtIGFcbiAgLy8gICAgPlxuICAvL1xuICBpZiAodG9rZW4uYmxvY2sgJiYgdG9rZW4ubmVzdGluZyAhPT0gLTEgJiYgaWR4ICYmIHRva2Vuc1tpZHggLSAxXS5oaWRkZW4pIHtcbiAgICByZXN1bHQgKz0gJ1xcbic7XG4gIH1cblxuICAvLyBBZGQgdG9rZW4gbmFtZSwgZS5nLiBgPGltZ2BcbiAgcmVzdWx0ICs9ICh0b2tlbi5uZXN0aW5nID09PSAtMSA/ICc8LycgOiAnPCcpICsgdG9rZW4udGFnO1xuXG4gIC8vIEVuY29kZSBhdHRyaWJ1dGVzLCBlLmcuIGA8aW1nIHNyYz1cImZvb1wiYFxuICByZXN1bHQgKz0gdGhpcy5yZW5kZXJBdHRycyh0b2tlbik7XG5cbiAgLy8gQWRkIGEgc2xhc2ggZm9yIHNlbGYtY2xvc2luZyB0YWdzLCBlLmcuIGA8aW1nIHNyYz1cImZvb1wiIC9gXG4gIGlmICh0b2tlbi5uZXN0aW5nID09PSAwICYmIG9wdGlvbnMueGh0bWxPdXQpIHtcbiAgICByZXN1bHQgKz0gJyAvJztcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gYWRkIGEgbmV3bGluZSBhZnRlciB0aGlzIHRhZ1xuICBpZiAodG9rZW4uYmxvY2spIHtcbiAgICBuZWVkTGYgPSB0cnVlO1xuXG4gICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpIHtcbiAgICAgIGlmIChpZHggKyAxIDwgdG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBuZXh0VG9rZW4gPSB0b2tlbnNbaWR4ICsgMV07XG5cbiAgICAgICAgaWYgKG5leHRUb2tlbi50eXBlID09PSAnaW5saW5lJyB8fCBuZXh0VG9rZW4uaGlkZGVuKSB7XG4gICAgICAgICAgLy8gQmxvY2stbGV2ZWwgdGFnIGNvbnRhaW5pbmcgYW4gaW5saW5lIHRhZy5cbiAgICAgICAgICAvL1xuICAgICAgICAgIG5lZWRMZiA9IGZhbHNlO1xuXG4gICAgICAgIH0gZWxzZSBpZiAobmV4dFRva2VuLm5lc3RpbmcgPT09IC0xICYmIG5leHRUb2tlbi50YWcgPT09IHRva2VuLnRhZykge1xuICAgICAgICAgIC8vIE9wZW5pbmcgdGFnICsgY2xvc2luZyB0YWcgb2YgdGhlIHNhbWUgdHlwZS4gRS5nLiBgPGxpPjwvbGk+YC5cbiAgICAgICAgICAvL1xuICAgICAgICAgIG5lZWRMZiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzdWx0ICs9IG5lZWRMZiA/ICc+XFxuJyA6ICc+JztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKipcbiAqIFJlbmRlcmVyLnJlbmRlcklubGluZSh0b2tlbnMsIG9wdGlvbnMsIGVudikgLT4gU3RyaW5nXG4gKiAtIHRva2VucyAoQXJyYXkpOiBsaXN0IG9uIGJsb2NrIHRva2VucyB0byByZW50ZXJcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcGFyYW1zIG9mIHBhcnNlciBpbnN0YW5jZVxuICogLSBlbnYgKE9iamVjdCk6IGFkZGl0aW9uYWwgZGF0YSBmcm9tIHBhcnNlZCBpbnB1dCAocmVmZXJlbmNlcywgZm9yIGV4YW1wbGUpXG4gKlxuICogVGhlIHNhbWUgYXMgW1tSZW5kZXJlci5yZW5kZXJdXSwgYnV0IGZvciBzaW5nbGUgdG9rZW4gb2YgYGlubGluZWAgdHlwZS5cbiAqKi9cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJJbmxpbmUgPSBmdW5jdGlvbiAodG9rZW5zLCBvcHRpb25zLCBlbnYpIHtcbiAgdmFyIHR5cGUsXG4gICAgICByZXN1bHQgPSAnJyxcbiAgICAgIHJ1bGVzID0gdGhpcy5ydWxlcztcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG9rZW5zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdHlwZSA9IHRva2Vuc1tpXS50eXBlO1xuXG4gICAgaWYgKHR5cGVvZiBydWxlc1t0eXBlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdCArPSBydWxlc1t0eXBlXSh0b2tlbnMsIGksIG9wdGlvbnMsIGVudiwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLnJlbmRlclRva2VuKHRva2VucywgaSwgb3B0aW9ucywgZW52KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKiogaW50ZXJuYWxcbiAqIFJlbmRlcmVyLnJlbmRlcklubGluZUFzVGV4dCh0b2tlbnMsIG9wdGlvbnMsIGVudikgLT4gU3RyaW5nXG4gKiAtIHRva2VucyAoQXJyYXkpOiBsaXN0IG9uIGJsb2NrIHRva2VucyB0byByZW50ZXJcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcGFyYW1zIG9mIHBhcnNlciBpbnN0YW5jZVxuICogLSBlbnYgKE9iamVjdCk6IGFkZGl0aW9uYWwgZGF0YSBmcm9tIHBhcnNlZCBpbnB1dCAocmVmZXJlbmNlcywgZm9yIGV4YW1wbGUpXG4gKlxuICogU3BlY2lhbCBrbHVkZ2UgZm9yIGltYWdlIGBhbHRgIGF0dHJpYnV0ZXMgdG8gY29uZm9ybSBDb21tb25NYXJrIHNwZWMuXG4gKiBEb24ndCB0cnkgdG8gdXNlIGl0ISBTcGVjIHJlcXVpcmVzIHRvIHNob3cgYGFsdGAgY29udGVudCB3aXRoIHN0cmlwcGVkIG1hcmt1cCxcbiAqIGluc3RlYWQgb2Ygc2ltcGxlIGVzY2FwaW5nLlxuICoqL1xuUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlcklubGluZUFzVGV4dCA9IGZ1bmN0aW9uICh0b2tlbnMsIG9wdGlvbnMsIGVudikge1xuICB2YXIgcmVzdWx0ID0gJycsXG4gICAgICBydWxlcyA9IHRoaXMucnVsZXM7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRva2Vucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICByZXN1bHQgKz0gcnVsZXMudGV4dCh0b2tlbnMsIGksIG9wdGlvbnMsIGVudiwgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVySW5saW5lQXNUZXh0KHRva2Vuc1tpXS5jaGlsZHJlbiwgb3B0aW9ucywgZW52KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKipcbiAqIFJlbmRlcmVyLnJlbmRlcih0b2tlbnMsIG9wdGlvbnMsIGVudikgLT4gU3RyaW5nXG4gKiAtIHRva2VucyAoQXJyYXkpOiBsaXN0IG9uIGJsb2NrIHRva2VucyB0byByZW50ZXJcbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcGFyYW1zIG9mIHBhcnNlciBpbnN0YW5jZVxuICogLSBlbnYgKE9iamVjdCk6IGFkZGl0aW9uYWwgZGF0YSBmcm9tIHBhcnNlZCBpbnB1dCAocmVmZXJlbmNlcywgZm9yIGV4YW1wbGUpXG4gKlxuICogVGFrZXMgdG9rZW4gc3RyZWFtIGFuZCBnZW5lcmF0ZXMgSFRNTC4gUHJvYmFibHksIHlvdSB3aWxsIG5ldmVyIG5lZWQgdG8gY2FsbFxuICogdGhpcyBtZXRob2QgZGlyZWN0bHkuXG4gKiovXG5SZW5kZXJlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHRva2Vucywgb3B0aW9ucywgZW52KSB7XG4gIHZhciBpLCBsZW4sIHR5cGUsXG4gICAgICByZXN1bHQgPSAnJyxcbiAgICAgIHJ1bGVzID0gdGhpcy5ydWxlcztcblxuICBmb3IgKGkgPSAwLCBsZW4gPSB0b2tlbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB0eXBlID0gdG9rZW5zW2ldLnR5cGU7XG5cbiAgICBpZiAodHlwZSA9PT0gJ2lubGluZScpIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLnJlbmRlcklubGluZSh0b2tlbnNbaV0uY2hpbGRyZW4sIG9wdGlvbnMsIGVudik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcnVsZXNbdHlwZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXN1bHQgKz0gcnVsZXNbdG9rZW5zW2ldLnR5cGVdKHRva2VucywgaSwgb3B0aW9ucywgZW52LCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVyVG9rZW4odG9rZW5zLCBpLCBvcHRpb25zLCBlbnYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmVyO1xuIiwiLyoqXG4gKiBjbGFzcyBSdWxlclxuICpcbiAqIEhlbHBlciBjbGFzcywgdXNlZCBieSBbW01hcmtkb3duSXQjY29yZV1dLCBbW01hcmtkb3duSXQjYmxvY2tdXSBhbmRcbiAqIFtbTWFya2Rvd25JdCNpbmxpbmVdXSB0byBtYW5hZ2Ugc2VxdWVuY2VzIG9mIGZ1bmN0aW9ucyAocnVsZXMpOlxuICpcbiAqIC0ga2VlcCBydWxlcyBpbiBkZWZpbmVkIG9yZGVyXG4gKiAtIGFzc2lnbiB0aGUgbmFtZSB0byBlYWNoIHJ1bGVcbiAqIC0gZW5hYmxlL2Rpc2FibGUgcnVsZXNcbiAqIC0gYWRkL3JlcGxhY2UgcnVsZXNcbiAqIC0gYWxsb3cgYXNzaWduIHJ1bGVzIHRvIGFkZGl0aW9uYWwgbmFtZWQgY2hhaW5zIChpbiB0aGUgc2FtZSlcbiAqIC0gY2FjaGVpbmcgbGlzdHMgb2YgYWN0aXZlIHJ1bGVzXG4gKlxuICogWW91IHdpbGwgbm90IG5lZWQgdXNlIHRoaXMgY2xhc3MgZGlyZWN0bHkgdW50aWwgd3JpdGUgcGx1Z2lucy4gRm9yIHNpbXBsZVxuICogcnVsZXMgY29udHJvbCB1c2UgW1tNYXJrZG93bkl0LmRpc2FibGVdXSwgW1tNYXJrZG93bkl0LmVuYWJsZV1dIGFuZFxuICogW1tNYXJrZG93bkl0LnVzZV1dLlxuICoqL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuICogbmV3IFJ1bGVyKClcbiAqKi9cbmZ1bmN0aW9uIFJ1bGVyKCkge1xuICAvLyBMaXN0IG9mIGFkZGVkIHJ1bGVzLiBFYWNoIGVsZW1lbnQgaXM6XG4gIC8vXG4gIC8vIHtcbiAgLy8gICBuYW1lOiBYWFgsXG4gIC8vICAgZW5hYmxlZDogQm9vbGVhbixcbiAgLy8gICBmbjogRnVuY3Rpb24oKSxcbiAgLy8gICBhbHQ6IFsgbmFtZTIsIG5hbWUzIF1cbiAgLy8gfVxuICAvL1xuICB0aGlzLl9fcnVsZXNfXyA9IFtdO1xuXG4gIC8vIENhY2hlZCBydWxlIGNoYWlucy5cbiAgLy9cbiAgLy8gRmlyc3QgbGV2ZWwgLSBjaGFpbiBuYW1lLCAnJyBmb3IgZGVmYXVsdC5cbiAgLy8gU2Vjb25kIGxldmVsIC0gZGlnaW5hbCBhbmNob3IgZm9yIGZhc3QgZmlsdGVyaW5nIGJ5IGNoYXJjb2Rlcy5cbiAgLy9cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gSGVscGVyIG1ldGhvZHMsIHNob3VsZCBub3QgYmUgdXNlZCBkaXJlY3RseVxuXG5cbi8vIEZpbmQgcnVsZSBpbmRleCBieSBuYW1lXG4vL1xuUnVsZXIucHJvdG90eXBlLl9fZmluZF9fID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9fcnVsZXNfXy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aGlzLl9fcnVsZXNfX1tpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufTtcblxuXG4vLyBCdWlsZCBydWxlcyBsb29rdXAgY2FjaGVcbi8vXG5SdWxlci5wcm90b3R5cGUuX19jb21waWxlX18gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGNoYWlucyA9IFsgJycgXTtcblxuICAvLyBjb2xsZWN0IHVuaXF1ZSBuYW1lc1xuICBzZWxmLl9fcnVsZXNfXy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgaWYgKCFydWxlLmVuYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICBydWxlLmFsdC5mb3JFYWNoKGZ1bmN0aW9uIChhbHROYW1lKSB7XG4gICAgICBpZiAoY2hhaW5zLmluZGV4T2YoYWx0TmFtZSkgPCAwKSB7XG4gICAgICAgIGNoYWlucy5wdXNoKGFsdE5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBzZWxmLl9fY2FjaGVfXyA9IHt9O1xuXG4gIGNoYWlucy5mb3JFYWNoKGZ1bmN0aW9uIChjaGFpbikge1xuICAgIHNlbGYuX19jYWNoZV9fW2NoYWluXSA9IFtdO1xuICAgIHNlbGYuX19ydWxlc19fLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIGlmICghcnVsZS5lbmFibGVkKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoY2hhaW4gJiYgcnVsZS5hbHQuaW5kZXhPZihjaGFpbikgPCAwKSB7IHJldHVybjsgfVxuXG4gICAgICBzZWxmLl9fY2FjaGVfX1tjaGFpbl0ucHVzaChydWxlLmZuKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuYXQobmFtZSwgZm4gWywgb3B0aW9uc10pXG4gKiAtIG5hbWUgKFN0cmluZyk6IHJ1bGUgbmFtZSB0byByZXBsYWNlLlxuICogLSBmbiAoRnVuY3Rpb24pOiBuZXcgcnVsZSBmdW5jdGlvbi5cbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogbmV3IHJ1bGUgb3B0aW9ucyAobm90IG1hbmRhdG9yeSkuXG4gKlxuICogUmVwbGFjZSBydWxlIGJ5IG5hbWUgd2l0aCBuZXcgZnVuY3Rpb24gJiBvcHRpb25zLiBUaHJvd3MgZXJyb3IgaWYgbmFtZSBub3RcbiAqIGZvdW5kLlxuICpcbiAqICMjIyMjIE9wdGlvbnM6XG4gKlxuICogLSBfX2FsdF9fIC0gYXJyYXkgd2l0aCBuYW1lcyBvZiBcImFsdGVybmF0ZVwiIGNoYWlucy5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogUmVwbGFjZSBleGlzdGluZyB0eXBvcmdhcGhlciByZXBsYWNlbWVudCBydWxlIHdpdGggbmV3IG9uZTpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gKlxuICogbWQuY29yZS5ydWxlci5hdCgncmVwbGFjZW1lbnRzJywgZnVuY3Rpb24gcmVwbGFjZShzdGF0ZSkge1xuICogICAvLy4uLlxuICogfSk7XG4gKiBgYGBcbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIChuYW1lLCBmbiwgb3B0aW9ucykge1xuICB2YXIgaW5kZXggPSB0aGlzLl9fZmluZF9fKG5hbWUpO1xuICB2YXIgb3B0ID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoaW5kZXggPT09IC0xKSB7IHRocm93IG5ldyBFcnJvcignUGFyc2VyIHJ1bGUgbm90IGZvdW5kOiAnICsgbmFtZSk7IH1cblxuICB0aGlzLl9fcnVsZXNfX1tpbmRleF0uZm4gPSBmbjtcbiAgdGhpcy5fX3J1bGVzX19baW5kZXhdLmFsdCA9IG9wdC5hbHQgfHwgW107XG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBSdWxlci5iZWZvcmUoYmVmb3JlTmFtZSwgcnVsZU5hbWUsIGZuIFssIG9wdGlvbnNdKVxuICogLSBiZWZvcmVOYW1lIChTdHJpbmcpOiBuZXcgcnVsZSB3aWxsIGJlIGFkZGVkIGJlZm9yZSB0aGlzIG9uZS5cbiAqIC0gcnVsZU5hbWUgKFN0cmluZyk6IG5hbWUgb2YgYWRkZWQgcnVsZS5cbiAqIC0gZm4gKEZ1bmN0aW9uKTogcnVsZSBmdW5jdGlvbi5cbiAqIC0gb3B0aW9ucyAoT2JqZWN0KTogcnVsZSBvcHRpb25zIChub3QgbWFuZGF0b3J5KS5cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgdG8gY2hhaW4gYmVmb3JlIG9uZSB3aXRoIGdpdmVuIG5hbWUuIFNlZSBhbHNvXG4gKiBbW1J1bGVyLmFmdGVyXV0sIFtbUnVsZXIucHVzaF1dLlxuICpcbiAqICMjIyMjIE9wdGlvbnM6XG4gKlxuICogLSBfX2FsdF9fIC0gYXJyYXkgd2l0aCBuYW1lcyBvZiBcImFsdGVybmF0ZVwiIGNoYWlucy5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICpcbiAqIG1kLmJsb2NrLnJ1bGVyLmJlZm9yZSgncGFyYWdyYXBoJywgJ215X3J1bGUnLCBmdW5jdGlvbiByZXBsYWNlKHN0YXRlKSB7XG4gKiAgIC8vLi4uXG4gKiB9KTtcbiAqIGBgYFxuICoqL1xuUnVsZXIucHJvdG90eXBlLmJlZm9yZSA9IGZ1bmN0aW9uIChiZWZvcmVOYW1lLCBydWxlTmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5fX2ZpbmRfXyhiZWZvcmVOYW1lKTtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKGluZGV4ID09PSAtMSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlciBydWxlIG5vdCBmb3VuZDogJyArIGJlZm9yZU5hbWUpOyB9XG5cbiAgdGhpcy5fX3J1bGVzX18uc3BsaWNlKGluZGV4LCAwLCB7XG4gICAgbmFtZTogcnVsZU5hbWUsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBmbjogZm4sXG4gICAgYWx0OiBvcHQuYWx0IHx8IFtdXG4gIH0pO1xuXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBSdWxlci5hZnRlcihhZnRlck5hbWUsIHJ1bGVOYW1lLCBmbiBbLCBvcHRpb25zXSlcbiAqIC0gYWZ0ZXJOYW1lIChTdHJpbmcpOiBuZXcgcnVsZSB3aWxsIGJlIGFkZGVkIGFmdGVyIHRoaXMgb25lLlxuICogLSBydWxlTmFtZSAoU3RyaW5nKTogbmFtZSBvZiBhZGRlZCBydWxlLlxuICogLSBmbiAoRnVuY3Rpb24pOiBydWxlIGZ1bmN0aW9uLlxuICogLSBvcHRpb25zIChPYmplY3QpOiBydWxlIG9wdGlvbnMgKG5vdCBtYW5kYXRvcnkpLlxuICpcbiAqIEFkZCBuZXcgcnVsZSB0byBjaGFpbiBhZnRlciBvbmUgd2l0aCBnaXZlbiBuYW1lLiBTZWUgYWxzb1xuICogW1tSdWxlci5iZWZvcmVdXSwgW1tSdWxlci5wdXNoXV0uXG4gKlxuICogIyMjIyMgT3B0aW9uczpcbiAqXG4gKiAtIF9fYWx0X18gLSBhcnJheSB3aXRoIG5hbWVzIG9mIFwiYWx0ZXJuYXRlXCIgY2hhaW5zLlxuICpcbiAqICMjIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiB2YXIgbWQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpKCk7XG4gKlxuICogbWQuaW5saW5lLnJ1bGVyLmFmdGVyKCd0ZXh0JywgJ215X3J1bGUnLCBmdW5jdGlvbiByZXBsYWNlKHN0YXRlKSB7XG4gKiAgIC8vLi4uXG4gKiB9KTtcbiAqIGBgYFxuICoqL1xuUnVsZXIucHJvdG90eXBlLmFmdGVyID0gZnVuY3Rpb24gKGFmdGVyTmFtZSwgcnVsZU5hbWUsIGZuLCBvcHRpb25zKSB7XG4gIHZhciBpbmRleCA9IHRoaXMuX19maW5kX18oYWZ0ZXJOYW1lKTtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKGluZGV4ID09PSAtMSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlciBydWxlIG5vdCBmb3VuZDogJyArIGFmdGVyTmFtZSk7IH1cblxuICB0aGlzLl9fcnVsZXNfXy5zcGxpY2UoaW5kZXggKyAxLCAwLCB7XG4gICAgbmFtZTogcnVsZU5hbWUsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBmbjogZm4sXG4gICAgYWx0OiBvcHQuYWx0IHx8IFtdXG4gIH0pO1xuXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cbi8qKlxuICogUnVsZXIucHVzaChydWxlTmFtZSwgZm4gWywgb3B0aW9uc10pXG4gKiAtIHJ1bGVOYW1lIChTdHJpbmcpOiBuYW1lIG9mIGFkZGVkIHJ1bGUuXG4gKiAtIGZuIChGdW5jdGlvbik6IHJ1bGUgZnVuY3Rpb24uXG4gKiAtIG9wdGlvbnMgKE9iamVjdCk6IHJ1bGUgb3B0aW9ucyAobm90IG1hbmRhdG9yeSkuXG4gKlxuICogUHVzaCBuZXcgcnVsZSB0byB0aGUgZW5kIG9mIGNoYWluLiBTZWUgYWxzb1xuICogW1tSdWxlci5iZWZvcmVdXSwgW1tSdWxlci5hZnRlcl1dLlxuICpcbiAqICMjIyMjIE9wdGlvbnM6XG4gKlxuICogLSBfX2FsdF9fIC0gYXJyYXkgd2l0aCBuYW1lcyBvZiBcImFsdGVybmF0ZVwiIGNoYWlucy5cbiAqXG4gKiAjIyMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG1kID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKSgpO1xuICpcbiAqIG1kLmNvcmUucnVsZXIucHVzaCgnZW1waGFzaXMnLCAnbXlfcnVsZScsIGZ1bmN0aW9uIHJlcGxhY2Uoc3RhdGUpIHtcbiAqICAgLy8uLi5cbiAqIH0pO1xuICogYGBgXG4gKiovXG5SdWxlci5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG5cbiAgdGhpcy5fX3J1bGVzX18ucHVzaCh7XG4gICAgbmFtZTogcnVsZU5hbWUsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBmbjogZm4sXG4gICAgYWx0OiBvcHQuYWx0IHx8IFtdXG4gIH0pO1xuXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBSdWxlci5lbmFibGUobGlzdCBbLCBpZ25vcmVJbnZhbGlkXSkgLT4gQXJyYXlcbiAqIC0gbGlzdCAoU3RyaW5nfEFycmF5KTogbGlzdCBvZiBydWxlIG5hbWVzIHRvIGVuYWJsZS5cbiAqIC0gaWdub3JlSW52YWxpZCAoQm9vbGVhbik6IHNldCBgdHJ1ZWAgdG8gaWdub3JlIGVycm9ycyB3aGVuIHJ1bGUgbm90IGZvdW5kLlxuICpcbiAqIEVuYWJsZSBydWxlcyB3aXRoIGdpdmVuIG5hbWVzLiBJZiBhbnkgcnVsZSBuYW1lIG5vdCBmb3VuZCAtIHRocm93IEVycm9yLlxuICogRXJyb3JzIGNhbiBiZSBkaXNhYmxlZCBieSBzZWNvbmQgcGFyYW0uXG4gKlxuICogUmV0dXJucyBsaXN0IG9mIGZvdW5kIHJ1bGUgbmFtZXMgKGlmIG5vIGV4Y2VwdGlvbiBoYXBwZW5lZCkuXG4gKlxuICogU2VlIGFsc28gW1tSdWxlci5kaXNhYmxlXV0sIFtbUnVsZXIuZW5hYmxlT25seV1dLlxuICoqL1xuUnVsZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uIChsaXN0LCBpZ25vcmVJbnZhbGlkKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkgeyBsaXN0ID0gWyBsaXN0IF07IH1cblxuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgLy8gU2VhcmNoIGJ5IG5hbWUgYW5kIGVuYWJsZVxuICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgaWR4ID0gdGhpcy5fX2ZpbmRfXyhuYW1lKTtcblxuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICBpZiAoaWdub3JlSW52YWxpZCkgeyByZXR1cm47IH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignUnVsZXMgbWFuYWdlcjogaW52YWxpZCBydWxlIG5hbWUgJyArIG5hbWUpO1xuICAgIH1cbiAgICB0aGlzLl9fcnVsZXNfX1tpZHhdLmVuYWJsZWQgPSB0cnVlO1xuICAgIHJlc3VsdC5wdXNoKG5hbWUpO1xuICB9LCB0aGlzKTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuZW5hYmxlT25seShsaXN0IFssIGlnbm9yZUludmFsaWRdKVxuICogLSBsaXN0IChTdHJpbmd8QXJyYXkpOiBsaXN0IG9mIHJ1bGUgbmFtZXMgdG8gZW5hYmxlICh3aGl0ZWxpc3QpLlxuICogLSBpZ25vcmVJbnZhbGlkIChCb29sZWFuKTogc2V0IGB0cnVlYCB0byBpZ25vcmUgZXJyb3JzIHdoZW4gcnVsZSBub3QgZm91bmQuXG4gKlxuICogRW5hYmxlIHJ1bGVzIHdpdGggZ2l2ZW4gbmFtZXMsIGFuZCBkaXNhYmxlIGV2ZXJ5dGhpbmcgZWxzZS4gSWYgYW55IHJ1bGUgbmFtZVxuICogbm90IGZvdW5kIC0gdGhyb3cgRXJyb3IuIEVycm9ycyBjYW4gYmUgZGlzYWJsZWQgYnkgc2Vjb25kIHBhcmFtLlxuICpcbiAqIFNlZSBhbHNvIFtbUnVsZXIuZGlzYWJsZV1dLCBbW1J1bGVyLmVuYWJsZV1dLlxuICoqL1xuUnVsZXIucHJvdG90eXBlLmVuYWJsZU9ubHkgPSBmdW5jdGlvbiAobGlzdCwgaWdub3JlSW52YWxpZCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHsgbGlzdCA9IFsgbGlzdCBdOyB9XG5cbiAgdGhpcy5fX3J1bGVzX18uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkgeyBydWxlLmVuYWJsZWQgPSBmYWxzZTsgfSk7XG5cbiAgdGhpcy5lbmFibGUobGlzdCwgaWdub3JlSW52YWxpZCk7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuZGlzYWJsZShsaXN0IFssIGlnbm9yZUludmFsaWRdKSAtPiBBcnJheVxuICogLSBsaXN0IChTdHJpbmd8QXJyYXkpOiBsaXN0IG9mIHJ1bGUgbmFtZXMgdG8gZGlzYWJsZS5cbiAqIC0gaWdub3JlSW52YWxpZCAoQm9vbGVhbik6IHNldCBgdHJ1ZWAgdG8gaWdub3JlIGVycm9ycyB3aGVuIHJ1bGUgbm90IGZvdW5kLlxuICpcbiAqIERpc2FibGUgcnVsZXMgd2l0aCBnaXZlbiBuYW1lcy4gSWYgYW55IHJ1bGUgbmFtZSBub3QgZm91bmQgLSB0aHJvdyBFcnJvci5cbiAqIEVycm9ycyBjYW4gYmUgZGlzYWJsZWQgYnkgc2Vjb25kIHBhcmFtLlxuICpcbiAqIFJldHVybnMgbGlzdCBvZiBmb3VuZCBydWxlIG5hbWVzIChpZiBubyBleGNlcHRpb24gaGFwcGVuZWQpLlxuICpcbiAqIFNlZSBhbHNvIFtbUnVsZXIuZW5hYmxlXV0sIFtbUnVsZXIuZW5hYmxlT25seV1dLlxuICoqL1xuUnVsZXIucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAobGlzdCwgaWdub3JlSW52YWxpZCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHsgbGlzdCA9IFsgbGlzdCBdOyB9XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIC8vIFNlYXJjaCBieSBuYW1lIGFuZCBkaXNhYmxlXG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBpZHggPSB0aGlzLl9fZmluZF9fKG5hbWUpO1xuXG4gICAgaWYgKGlkeCA8IDApIHtcbiAgICAgIGlmIChpZ25vcmVJbnZhbGlkKSB7IHJldHVybjsgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSdWxlcyBtYW5hZ2VyOiBpbnZhbGlkIHJ1bGUgbmFtZSAnICsgbmFtZSk7XG4gICAgfVxuICAgIHRoaXMuX19ydWxlc19fW2lkeF0uZW5hYmxlZCA9IGZhbHNlO1xuICAgIHJlc3VsdC5wdXNoKG5hbWUpO1xuICB9LCB0aGlzKTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbi8qKlxuICogUnVsZXIuZ2V0UnVsZXMoY2hhaW5OYW1lKSAtPiBBcnJheVxuICpcbiAqIFJldHVybiBhcnJheSBvZiBhY3RpdmUgZnVuY3Rpb25zIChydWxlcykgZm9yIGdpdmVuIGNoYWluIG5hbWUuIEl0IGFuYWx5emVzXG4gKiBydWxlcyBjb25maWd1cmF0aW9uLCBjb21waWxlcyBjYWNoZXMgaWYgbm90IGV4aXN0cyBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogRGVmYXVsdCBjaGFpbiBuYW1lIGlzIGAnJ2AgKGVtcHR5IHN0cmluZykuIEl0IGNhbid0IGJlIHNraXBwZWQuIFRoYXQnc1xuICogZG9uZSBpbnRlbnRpb25hbGx5LCB0byBrZWVwIHNpZ25hdHVyZSBtb25vbW9ycGhpYyBmb3IgaGlnaCBzcGVlZC5cbiAqKi9cblJ1bGVyLnByb3RvdHlwZS5nZXRSdWxlcyA9IGZ1bmN0aW9uIChjaGFpbk5hbWUpIHtcbiAgaWYgKHRoaXMuX19jYWNoZV9fID09PSBudWxsKSB7XG4gICAgdGhpcy5fX2NvbXBpbGVfXygpO1xuICB9XG5cbiAgLy8gQ2hhaW4gY2FuIGJlIGVtcHR5LCBpZiBydWxlcyBkaXNhYmxlZC4gQnV0IHdlIHN0aWxsIGhhdmUgdG8gcmV0dXJuIEFycmF5LlxuICByZXR1cm4gdGhpcy5fX2NhY2hlX19bY2hhaW5OYW1lXSB8fCBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZXI7XG4iLCIvLyBCbG9jayBxdW90ZXNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxvY2txdW90ZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIG5leHRMaW5lLCBsYXN0TGluZUVtcHR5LCBvbGRUU2hpZnQsIG9sZEJNYXJrcywgb2xkSW5kZW50LCBvbGRQYXJlbnRUeXBlLCBsaW5lcyxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcywgdG9rZW4sXG4gICAgICBpLCBsLCB0ZXJtaW5hdGUsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgLy8gY2hlY2sgdGhlIGJsb2NrIHF1b3RlIG1hcmtlclxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKyspICE9PSAweDNFLyogPiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyB3ZSBrbm93IHRoYXQgaXQncyBnb2luZyB0byBiZSBhIHZhbGlkIGJsb2NrcXVvdGUsXG4gIC8vIHNvIG5vIHBvaW50IHRyeWluZyB0byBmaW5kIHRoZSBlbmQgb2YgaXQgaW4gc2lsZW50IG1vZGVcbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIHNraXAgb25lIG9wdGlvbmFsIHNwYWNlIGFmdGVyICc+J1xuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgc3RhdGUuYmxrSW5kZW50ID0gMDtcblxuICBvbGRCTWFya3MgPSBbIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdIF07XG4gIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdID0gcG9zO1xuXG4gIC8vIGNoZWNrIGlmIHdlIGhhdmUgYW4gZW1wdHkgYmxvY2txdW90ZVxuICBwb3MgPSBwb3MgPCBtYXggPyBzdGF0ZS5za2lwU3BhY2VzKHBvcykgOiBwb3M7XG4gIGxhc3RMaW5lRW1wdHkgPSBwb3MgPj0gbWF4O1xuXG4gIG9sZFRTaGlmdCA9IFsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gXTtcbiAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBwb3MgLSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcblxuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5tZC5ibG9jay5ydWxlci5nZXRSdWxlcygnYmxvY2txdW90ZScpO1xuXG4gIC8vIFNlYXJjaCB0aGUgZW5kIG9mIHRoZSBibG9ja1xuICAvL1xuICAvLyBCbG9jayBlbmRzIHdpdGggZWl0aGVyOlxuICAvLyAgMS4gYW4gZW1wdHkgbGluZSBvdXRzaWRlOlxuICAvLyAgICAgYGBgXG4gIC8vICAgICA+IHRlc3RcbiAgLy9cbiAgLy8gICAgIGBgYFxuICAvLyAgMi4gYW4gZW1wdHkgbGluZSBpbnNpZGU6XG4gIC8vICAgICBgYGBcbiAgLy8gICAgID5cbiAgLy8gICAgIHRlc3RcbiAgLy8gICAgIGBgYFxuICAvLyAgMy4gYW5vdGhlciB0YWdcbiAgLy8gICAgIGBgYFxuICAvLyAgICAgPiB0ZXN0XG4gIC8vICAgICAgLSAtIC1cbiAgLy8gICAgIGBgYFxuICBmb3IgKG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTsgbmV4dExpbmUgPCBlbmRMaW5lOyBuZXh0TGluZSsrKSB7XG4gICAgcG9zID0gc3RhdGUuYk1hcmtzW25leHRMaW5lXSArIHN0YXRlLnRTaGlmdFtuZXh0TGluZV07XG4gICAgbWF4ID0gc3RhdGUuZU1hcmtzW25leHRMaW5lXTtcblxuICAgIGlmIChwb3MgPj0gbWF4KSB7XG4gICAgICAvLyBDYXNlIDE6IGxpbmUgaXMgbm90IGluc2lkZSB0aGUgYmxvY2txdW90ZSwgYW5kIHRoaXMgbGluZSBpcyBlbXB0eS5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKykgPT09IDB4M0UvKiA+ICovKSB7XG4gICAgICAvLyBUaGlzIGxpbmUgaXMgaW5zaWRlIHRoZSBibG9ja3F1b3RlLlxuXG4gICAgICAvLyBza2lwIG9uZSBvcHRpb25hbCBzcGFjZSBhZnRlciAnPidcbiAgICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDIwKSB7IHBvcysrOyB9XG5cbiAgICAgIG9sZEJNYXJrcy5wdXNoKHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pO1xuICAgICAgc3RhdGUuYk1hcmtzW25leHRMaW5lXSA9IHBvcztcblxuICAgICAgcG9zID0gcG9zIDwgbWF4ID8gc3RhdGUuc2tpcFNwYWNlcyhwb3MpIDogcG9zO1xuICAgICAgbGFzdExpbmVFbXB0eSA9IHBvcyA+PSBtYXg7XG5cbiAgICAgIG9sZFRTaGlmdC5wdXNoKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0pO1xuICAgICAgc3RhdGUudFNoaWZ0W25leHRMaW5lXSA9IHBvcyAtIHN0YXRlLmJNYXJrc1tuZXh0TGluZV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBDYXNlIDI6IGxpbmUgaXMgbm90IGluc2lkZSB0aGUgYmxvY2txdW90ZSwgYW5kIHRoZSBsYXN0IGxpbmUgd2FzIGVtcHR5LlxuICAgIGlmIChsYXN0TGluZUVtcHR5KSB7IGJyZWFrOyB9XG5cbiAgICAvLyBDYXNlIDM6IGFub3RoZXIgdGFnIGZvdW5kLlxuICAgIHRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0ZXJtaW5hdG9yUnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgdGVybWluYXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXJtaW5hdGUpIHsgYnJlYWs7IH1cblxuICAgIG9sZEJNYXJrcy5wdXNoKHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pO1xuICAgIG9sZFRTaGlmdC5wdXNoKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0pO1xuXG4gICAgLy8gQSBuZWdhdGl2ZSBudW1iZXIgbWVhbnMgdGhhdCB0aGlzIGlzIGEgcGFyYWdyYXBoIGNvbnRpbnVhdGlvbjtcbiAgICAvL1xuICAgIC8vIEFueSBuZWdhdGl2ZSBudW1iZXIgd2lsbCBkbyB0aGUgam9iIGhlcmUsIGJ1dCBpdCdzIGJldHRlciBmb3IgaXRcbiAgICAvLyB0byBiZSBsYXJnZSBlbm91Z2ggdG8gbWFrZSBhbnkgYnVncyBvYnZpb3VzLlxuICAgIHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPSAtMTMzNztcbiAgfVxuXG4gIG9sZFBhcmVudFR5cGUgPSBzdGF0ZS5wYXJlbnRUeXBlO1xuICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2Jsb2NrcXVvdGUnO1xuXG4gIHRva2VuICAgICAgICA9IHN0YXRlLnB1c2goJ2Jsb2NrcXVvdGVfb3BlbicsICdibG9ja3F1b3RlJywgMSk7XG4gIHRva2VuLm1hcmt1cCA9ICc+JztcbiAgdG9rZW4ubWFwICAgID0gbGluZXMgPSBbIHN0YXJ0TGluZSwgMCBdO1xuXG4gIHN0YXRlLm1kLmJsb2NrLnRva2VuaXplKHN0YXRlLCBzdGFydExpbmUsIG5leHRMaW5lKTtcblxuICB0b2tlbiAgICAgICAgPSBzdGF0ZS5wdXNoKCdibG9ja3F1b3RlX2Nsb3NlJywgJ2Jsb2NrcXVvdGUnLCAtMSk7XG4gIHRva2VuLm1hcmt1cCA9ICc+JztcblxuICBzdGF0ZS5wYXJlbnRUeXBlID0gb2xkUGFyZW50VHlwZTtcbiAgbGluZXNbMV0gPSBzdGF0ZS5saW5lO1xuXG4gIC8vIFJlc3RvcmUgb3JpZ2luYWwgdFNoaWZ0OyB0aGlzIG1pZ2h0IG5vdCBiZSBuZWNlc3Nhcnkgc2luY2UgdGhlIHBhcnNlclxuICAvLyBoYXMgYWxyZWFkeSBiZWVuIGhlcmUsIGJ1dCBqdXN0IHRvIG1ha2Ugc3VyZSB3ZSBjYW4gZG8gdGhhdC5cbiAgZm9yIChpID0gMDsgaSA8IG9sZFRTaGlmdC5sZW5ndGg7IGkrKykge1xuICAgIHN0YXRlLmJNYXJrc1tpICsgc3RhcnRMaW5lXSA9IG9sZEJNYXJrc1tpXTtcbiAgICBzdGF0ZS50U2hpZnRbaSArIHN0YXJ0TGluZV0gPSBvbGRUU2hpZnRbaV07XG4gIH1cbiAgc3RhdGUuYmxrSW5kZW50ID0gb2xkSW5kZW50O1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIENvZGUgYmxvY2sgKDQgc3BhY2VzIHBhZGRlZClcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29kZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLyosIHNpbGVudCovKSB7XG4gIHZhciBuZXh0TGluZSwgbGFzdCwgdG9rZW47XG5cbiAgaWYgKHN0YXRlLnRTaGlmdFtzdGFydExpbmVdIC0gc3RhdGUuYmxrSW5kZW50IDwgNCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsYXN0ID0gbmV4dExpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIHdoaWxlIChuZXh0TGluZSA8IGVuZExpbmUpIHtcbiAgICBpZiAoc3RhdGUuaXNFbXB0eShuZXh0TGluZSkpIHtcbiAgICAgIG5leHRMaW5lKys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gLSBzdGF0ZS5ibGtJbmRlbnQgPj0gNCkge1xuICAgICAgbmV4dExpbmUrKztcbiAgICAgIGxhc3QgPSBuZXh0TGluZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuXG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcblxuICB0b2tlbiAgICAgICAgID0gc3RhdGUucHVzaCgnY29kZV9ibG9jaycsICdjb2RlJywgMCk7XG4gIHRva2VuLmNvbnRlbnQgPSBzdGF0ZS5nZXRMaW5lcyhzdGFydExpbmUsIGxhc3QsIDQgKyBzdGF0ZS5ibGtJbmRlbnQsIHRydWUpO1xuICB0b2tlbi5tYXAgICAgID0gWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBmZW5jZXMgKGBgYCBsYW5nLCB+fn4gbGFuZylcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmVuY2Uoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBtYXJrZXIsIGxlbiwgcGFyYW1zLCBuZXh0TGluZSwgbWVtLCB0b2tlbiwgbWFya3VwLFxuICAgICAgaGF2ZUVuZE1hcmtlciA9IGZhbHNlLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIGlmIChwb3MgKyAzID4gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHg3RS8qIH4gKi8gJiYgbWFya2VyICE9PSAweDYwIC8qIGAgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBzY2FuIG1hcmtlciBsZW5ndGhcbiAgbWVtID0gcG9zO1xuICBwb3MgPSBzdGF0ZS5za2lwQ2hhcnMocG9zLCBtYXJrZXIpO1xuXG4gIGxlbiA9IHBvcyAtIG1lbTtcblxuICBpZiAobGVuIDwgMykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBtYXJrdXAgPSBzdGF0ZS5zcmMuc2xpY2UobWVtLCBwb3MpO1xuICBwYXJhbXMgPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXgpO1xuXG4gIGlmIChwYXJhbXMuaW5kZXhPZignYCcpID49IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gU2luY2Ugc3RhcnQgaXMgZm91bmQsIHdlIGNhbiByZXBvcnQgc3VjY2VzcyBoZXJlIGluIHZhbGlkYXRpb24gbW9kZVxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gc2VhcmNoIGVuZCBvZiBibG9ja1xuICBuZXh0TGluZSA9IHN0YXJ0TGluZTtcblxuICBmb3IgKDs7KSB7XG4gICAgbmV4dExpbmUrKztcbiAgICBpZiAobmV4dExpbmUgPj0gZW5kTGluZSkge1xuICAgICAgLy8gdW5jbG9zZWQgYmxvY2sgc2hvdWxkIGJlIGF1dG9jbG9zZWQgYnkgZW5kIG9mIGRvY3VtZW50LlxuICAgICAgLy8gYWxzbyBibG9jayBzZWVtcyB0byBiZSBhdXRvY2xvc2VkIGJ5IGVuZCBvZiBwYXJlbnRcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHBvcyA9IG1lbSA9IHN0YXRlLmJNYXJrc1tuZXh0TGluZV0gKyBzdGF0ZS50U2hpZnRbbmV4dExpbmVdO1xuICAgIG1heCA9IHN0YXRlLmVNYXJrc1tuZXh0TGluZV07XG5cbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHtcbiAgICAgIC8vIG5vbi1lbXB0eSBsaW5lIHdpdGggbmVnYXRpdmUgaW5kZW50IHNob3VsZCBzdG9wIHRoZSBsaXN0OlxuICAgICAgLy8gLSBgYGBcbiAgICAgIC8vICB0ZXN0XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gbWFya2VyKSB7IGNvbnRpbnVlOyB9XG5cbiAgICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSAtIHN0YXRlLmJsa0luZGVudCA+PSA0KSB7XG4gICAgICAvLyBjbG9zaW5nIGZlbmNlIHNob3VsZCBiZSBpbmRlbnRlZCBsZXNzIHRoYW4gNCBzcGFjZXNcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHBvcyA9IHN0YXRlLnNraXBDaGFycyhwb3MsIG1hcmtlcik7XG5cbiAgICAvLyBjbG9zaW5nIGNvZGUgZmVuY2UgbXVzdCBiZSBhdCBsZWFzdCBhcyBsb25nIGFzIHRoZSBvcGVuaW5nIG9uZVxuICAgIGlmIChwb3MgLSBtZW0gPCBsZW4pIHsgY29udGludWU7IH1cblxuICAgIC8vIG1ha2Ugc3VyZSB0YWlsIGhhcyBzcGFjZXMgb25seVxuICAgIHBvcyA9IHN0YXRlLnNraXBTcGFjZXMocG9zKTtcblxuICAgIGlmIChwb3MgPCBtYXgpIHsgY29udGludWU7IH1cblxuICAgIGhhdmVFbmRNYXJrZXIgPSB0cnVlO1xuICAgIC8vIGZvdW5kIVxuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gSWYgYSBmZW5jZSBoYXMgaGVhZGluZyBzcGFjZXMsIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSBpdHMgaW5uZXIgYmxvY2tcbiAgbGVuID0gc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG5cbiAgc3RhdGUubGluZSA9IG5leHRMaW5lICsgKGhhdmVFbmRNYXJrZXIgPyAxIDogMCk7XG5cbiAgdG9rZW4gICAgICAgICA9IHN0YXRlLnB1c2goJ2ZlbmNlJywgJ2NvZGUnLCAwKTtcbiAgdG9rZW4uaW5mbyAgICA9IHBhcmFtcztcbiAgdG9rZW4uY29udGVudCA9IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSArIDEsIG5leHRMaW5lLCBsZW4sIHRydWUpO1xuICB0b2tlbi5tYXJrdXAgID0gbWFya3VwO1xuICB0b2tlbi5tYXAgICAgID0gWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBoZWFkaW5nICgjLCAjIywgLi4uKVxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoZWFkaW5nKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgY2gsIGxldmVsLCB0bXAsIHRva2VuLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIGNoICA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKGNoICE9PSAweDIzLyogIyAqLyB8fCBwb3MgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGNvdW50IGhlYWRpbmcgbGV2ZWxcbiAgbGV2ZWwgPSAxO1xuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KCsrcG9zKTtcbiAgd2hpbGUgKGNoID09PSAweDIzLyogIyAqLyAmJiBwb3MgPCBtYXggJiYgbGV2ZWwgPD0gNikge1xuICAgIGxldmVsKys7XG4gICAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdCgrK3Bvcyk7XG4gIH1cblxuICBpZiAobGV2ZWwgPiA2IHx8IChwb3MgPCBtYXggJiYgY2ggIT09IDB4MjAvKiBzcGFjZSAqLykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIExldCdzIGN1dCB0YWlscyBsaWtlICcgICAgIyMjICAnIGZyb20gdGhlIGVuZCBvZiBzdHJpbmdcblxuICBtYXggPSBzdGF0ZS5za2lwQ2hhcnNCYWNrKG1heCwgMHgyMCwgcG9zKTsgLy8gc3BhY2VcbiAgdG1wID0gc3RhdGUuc2tpcENoYXJzQmFjayhtYXgsIDB4MjMsIHBvcyk7IC8vICNcbiAgaWYgKHRtcCA+IHBvcyAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdCh0bXAgLSAxKSA9PT0gMHgyMC8qIHNwYWNlICovKSB7XG4gICAgbWF4ID0gdG1wO1xuICB9XG5cbiAgc3RhdGUubGluZSA9IHN0YXJ0TGluZSArIDE7XG5cbiAgdG9rZW4gICAgICAgID0gc3RhdGUucHVzaCgnaGVhZGluZ19vcGVuJywgJ2gnICsgU3RyaW5nKGxldmVsKSwgMSk7XG4gIHRva2VuLm1hcmt1cCA9ICcjIyMjIyMjIycuc2xpY2UoMCwgbGV2ZWwpO1xuICB0b2tlbi5tYXAgICAgPSBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdO1xuXG4gIHRva2VuICAgICAgICAgID0gc3RhdGUucHVzaCgnaW5saW5lJywgJycsIDApO1xuICB0b2tlbi5jb250ZW50ICA9IHN0YXRlLnNyYy5zbGljZShwb3MsIG1heCkudHJpbSgpO1xuICB0b2tlbi5tYXAgICAgICA9IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF07XG4gIHRva2VuLmNoaWxkcmVuID0gW107XG5cbiAgdG9rZW4gICAgICAgID0gc3RhdGUucHVzaCgnaGVhZGluZ19jbG9zZScsICdoJyArIFN0cmluZyhsZXZlbCksIC0xKTtcbiAgdG9rZW4ubWFya3VwID0gJyMjIyMjIyMjJy5zbGljZSgwLCBsZXZlbCk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gSG9yaXpvbnRhbCBydWxlXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhyKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgbWFya2VyLCBjbnQsIGNoLCB0b2tlbixcbiAgICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKyk7XG5cbiAgLy8gQ2hlY2sgaHIgbWFya2VyXG4gIGlmIChtYXJrZXIgIT09IDB4MkEvKiAqICovICYmXG4gICAgICBtYXJrZXIgIT09IDB4MkQvKiAtICovICYmXG4gICAgICBtYXJrZXIgIT09IDB4NUYvKiBfICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gbWFya2VycyBjYW4gYmUgbWl4ZWQgd2l0aCBzcGFjZXMsIGJ1dCB0aGVyZSBzaG91bGQgYmUgYXQgbGVhc3QgMyBvbmVcblxuICBjbnQgPSAxO1xuICB3aGlsZSAocG9zIDwgbWF4KSB7XG4gICAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKyk7XG4gICAgaWYgKGNoICE9PSBtYXJrZXIgJiYgY2ggIT09IDB4MjAvKiBzcGFjZSAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBpZiAoY2ggPT09IG1hcmtlcikgeyBjbnQrKzsgfVxuICB9XG5cbiAgaWYgKGNudCA8IDMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIHN0YXRlLmxpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIHRva2VuICAgICAgICA9IHN0YXRlLnB1c2goJ2hyJywgJ2hyJywgMCk7XG4gIHRva2VuLm1hcCAgICA9IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF07XG4gIHRva2VuLm1hcmt1cCA9IEFycmF5KGNudCArIDEpLmpvaW4oU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpKTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBIVE1MIGJsb2NrXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgYmxvY2tfbmFtZXMgPSByZXF1aXJlKCcuLi9jb21tb24vaHRtbF9ibG9ja3MnKTtcblxuXG52YXIgSFRNTF9UQUdfT1BFTl9SRSA9IC9ePChbYS16QS1aXXsxLDE1fSlbXFxzXFwvPl0vO1xudmFyIEhUTUxfVEFHX0NMT1NFX1JFID0gL148XFwvKFthLXpBLVpdezEsMTV9KVtcXHM+XS87XG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGNoKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIHZhciBsYyA9IGNoIHwgMHgyMDsgLy8gdG8gbG93ZXIgY2FzZVxuICByZXR1cm4gKGxjID49IDB4NjEvKiBhICovKSAmJiAobGMgPD0gMHg3YS8qIHogKi8pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh0bWxfYmxvY2soc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbWF0Y2gsIG5leHRMaW5lLCB0b2tlbixcbiAgICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdLFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV0sXG4gICAgICBzaGlmdCA9IHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuXG4gIHBvcyArPSBzaGlmdDtcblxuICBpZiAoIXN0YXRlLm1kLm9wdGlvbnMuaHRtbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoc2hpZnQgPiAzIHx8IHBvcyArIDIgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDNDLyogPCAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyArIDEpO1xuXG4gIGlmIChjaCA9PT0gMHgyMS8qICEgKi8gfHwgY2ggPT09IDB4M0YvKiA/ICovKSB7XG4gICAgLy8gRGlyZWN0aXZlIHN0YXJ0IC8gY29tbWVudCBzdGFydCAvIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24gc3RhcnRcbiAgICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgfSBlbHNlIGlmIChjaCA9PT0gMHgyRi8qIC8gKi8gfHwgaXNMZXR0ZXIoY2gpKSB7XG5cbiAgICAvLyBQcm9iYWJseSBzdGFydCBvciBlbmQgb2YgdGFnXG4gICAgaWYgKGNoID09PSAweDJGLyogXFwgKi8pIHtcbiAgICAgIC8vIGNsb3NpbmcgdGFnXG4gICAgICBtYXRjaCA9IHN0YXRlLnNyYy5zbGljZShwb3MsIG1heCkubWF0Y2goSFRNTF9UQUdfQ0xPU0VfUkUpO1xuICAgICAgaWYgKCFtYXRjaCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gb3BlbmluZyB0YWdcbiAgICAgIG1hdGNoID0gc3RhdGUuc3JjLnNsaWNlKHBvcywgbWF4KS5tYXRjaChIVE1MX1RBR19PUEVOX1JFKTtcbiAgICAgIGlmICghbWF0Y2gpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0YWcgbmFtZSBpcyB2YWxpZFxuICAgIGlmIChibG9ja19uYW1lc1ttYXRjaFsxXS50b0xvd2VyQ2FzZSgpXSAhPT0gdHJ1ZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBJZiB3ZSBhcmUgaGVyZSAtIHdlIGRldGVjdGVkIEhUTUwgYmxvY2suXG4gIC8vIExldCdzIHJvbGwgZG93biB0aWxsIGVtcHR5IGxpbmUgKGJsb2NrIGVuZCkuXG4gIG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTtcbiAgd2hpbGUgKG5leHRMaW5lIDwgc3RhdGUubGluZU1heCAmJiAhc3RhdGUuaXNFbXB0eShuZXh0TGluZSkpIHtcbiAgICBuZXh0TGluZSsrO1xuICB9XG5cbiAgc3RhdGUubGluZSA9IG5leHRMaW5lO1xuXG4gIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCdodG1sX2Jsb2NrJywgJycsIDApO1xuICB0b2tlbi5tYXAgICAgID0gWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXTtcbiAgdG9rZW4uY29udGVudCA9IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbmV4dExpbmUsIDAsIHRydWUpO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGxoZWFkaW5nICgtLS0sID09PSlcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGhlYWRpbmcoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZS8qLCBzaWxlbnQqLykge1xuICB2YXIgbWFya2VyLCBwb3MsIG1heCwgdG9rZW4sIGxldmVsLFxuICAgICAgbmV4dCA9IHN0YXJ0TGluZSArIDE7XG5cbiAgaWYgKG5leHQgPj0gZW5kTGluZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0XSA8IHN0YXRlLmJsa0luZGVudCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBTY2FuIG5leHQgbGluZVxuXG4gIGlmIChzdGF0ZS50U2hpZnRbbmV4dF0gLSBzdGF0ZS5ibGtJbmRlbnQgPiAzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IHN0YXRlLmJNYXJrc1tuZXh0XSArIHN0YXRlLnRTaGlmdFtuZXh0XTtcbiAgbWF4ID0gc3RhdGUuZU1hcmtzW25leHRdO1xuXG4gIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHgyRC8qIC0gKi8gJiYgbWFya2VyICE9PSAweDNELyogPSAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBzdGF0ZS5za2lwQ2hhcnMocG9zLCBtYXJrZXIpO1xuXG4gIHBvcyA9IHN0YXRlLnNraXBTcGFjZXMocG9zKTtcblxuICBpZiAocG9zIDwgbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG5cbiAgc3RhdGUubGluZSA9IG5leHQgKyAxO1xuICBsZXZlbCA9IChtYXJrZXIgPT09IDB4M0QvKiA9ICovID8gMSA6IDIpO1xuXG4gIHRva2VuICAgICAgICAgID0gc3RhdGUucHVzaCgnaGVhZGluZ19vcGVuJywgJ2gnICsgU3RyaW5nKGxldmVsKSwgMSk7XG4gIHRva2VuLm1hcmt1cCAgID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpO1xuICB0b2tlbi5tYXAgICAgICA9IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF07XG5cbiAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCdpbmxpbmUnLCAnJywgMCk7XG4gIHRva2VuLmNvbnRlbnQgID0gc3RhdGUuc3JjLnNsaWNlKHBvcywgc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV0pLnRyaW0oKTtcbiAgdG9rZW4ubWFwICAgICAgPSBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSAtIDEgXTtcbiAgdG9rZW4uY2hpbGRyZW4gPSBbXTtcblxuICB0b2tlbiAgICAgICAgICA9IHN0YXRlLnB1c2goJ2hlYWRpbmdfY2xvc2UnLCAnaCcgKyBTdHJpbmcobGV2ZWwpLCAtMSk7XG4gIHRva2VuLm1hcmt1cCAgID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIExpc3RzXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vLyBTZWFyY2ggYFstKypdW1xcbiBdYCwgcmV0dXJucyBuZXh0IHBvcyBhcnRlciBtYXJrZXIgb24gc3VjY2Vzc1xuLy8gb3IgLTEgb24gZmFpbC5cbmZ1bmN0aW9uIHNraXBCdWxsZXRMaXN0TWFya2VyKHN0YXRlLCBzdGFydExpbmUpIHtcbiAgdmFyIG1hcmtlciwgcG9zLCBtYXg7XG5cbiAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXTtcbiAgbWF4ID0gc3RhdGUuZU1hcmtzW3N0YXJ0TGluZV07XG5cbiAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKyspO1xuICAvLyBDaGVjayBidWxsZXRcbiAgaWYgKG1hcmtlciAhPT0gMHgyQS8qICogKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHgyRC8qIC0gKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHgyQi8qICsgKi8pIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MjApIHtcbiAgICAvLyBcIiAxLnRlc3QgXCIgLSBpcyBub3QgYSBsaXN0IGl0ZW1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICByZXR1cm4gcG9zO1xufVxuXG4vLyBTZWFyY2ggYFxcZCtbLildW1xcbiBdYCwgcmV0dXJucyBuZXh0IHBvcyBhcnRlciBtYXJrZXIgb24gc3VjY2Vzc1xuLy8gb3IgLTEgb24gZmFpbC5cbmZ1bmN0aW9uIHNraXBPcmRlcmVkTGlzdE1hcmtlcihzdGF0ZSwgc3RhcnRMaW5lKSB7XG4gIHZhciBjaCxcbiAgICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICAvLyBMaXN0IG1hcmtlciBzaG91bGQgaGF2ZSBhdCBsZWFzdCAyIGNoYXJzIChkaWdpdCArIGRvdClcbiAgaWYgKHBvcyArIDEgPj0gbWF4KSB7IHJldHVybiAtMTsgfVxuXG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKyspO1xuXG4gIGlmIChjaCA8IDB4MzAvKiAwICovIHx8IGNoID4gMHgzOS8qIDkgKi8pIHsgcmV0dXJuIC0xOyB9XG5cbiAgZm9yICg7Oykge1xuICAgIC8vIEVPTCAtPiBmYWlsXG4gICAgaWYgKHBvcyA+PSBtYXgpIHsgcmV0dXJuIC0xOyB9XG5cbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcblxuICAgIGlmIChjaCA+PSAweDMwLyogMCAqLyAmJiBjaCA8PSAweDM5LyogOSAqLykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZm91bmQgdmFsaWQgbWFya2VyXG4gICAgaWYgKGNoID09PSAweDI5LyogKSAqLyB8fCBjaCA9PT0gMHgyZS8qIC4gKi8pIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG5cbiAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDIwLyogc3BhY2UgKi8pIHtcbiAgICAvLyBcIiAxLnRlc3QgXCIgLSBpcyBub3QgYSBsaXN0IGl0ZW1cbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcmV0dXJuIHBvcztcbn1cblxuZnVuY3Rpb24gbWFya1RpZ2h0UGFyYWdyYXBocyhzdGF0ZSwgaWR4KSB7XG4gIHZhciBpLCBsLFxuICAgICAgbGV2ZWwgPSBzdGF0ZS5sZXZlbCArIDI7XG5cbiAgZm9yIChpID0gaWR4ICsgMiwgbCA9IHN0YXRlLnRva2Vucy5sZW5ndGggLSAyOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKHN0YXRlLnRva2Vuc1tpXS5sZXZlbCA9PT0gbGV2ZWwgJiYgc3RhdGUudG9rZW5zW2ldLnR5cGUgPT09ICdwYXJhZ3JhcGhfb3BlbicpIHtcbiAgICAgIHN0YXRlLnRva2Vuc1tpICsgMl0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgIHN0YXRlLnRva2Vuc1tpXS5oaWRkZW4gPSB0cnVlO1xuICAgICAgaSArPSAyO1xuICAgIH1cbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGlzdChzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIG5leHRMaW5lLFxuICAgICAgaW5kZW50LFxuICAgICAgb2xkVFNoaWZ0LFxuICAgICAgb2xkSW5kZW50LFxuICAgICAgb2xkVGlnaHQsXG4gICAgICBvbGRQYXJlbnRUeXBlLFxuICAgICAgc3RhcnQsXG4gICAgICBwb3NBZnRlck1hcmtlcixcbiAgICAgIG1heCxcbiAgICAgIGluZGVudEFmdGVyTWFya2VyLFxuICAgICAgbWFya2VyVmFsdWUsXG4gICAgICBtYXJrZXJDaGFyQ29kZSxcbiAgICAgIGlzT3JkZXJlZCxcbiAgICAgIGNvbnRlbnRTdGFydCxcbiAgICAgIGxpc3RUb2tJZHgsXG4gICAgICBwcmV2RW1wdHlFbmQsXG4gICAgICBsaXN0TGluZXMsXG4gICAgICBpdGVtTGluZXMsXG4gICAgICB0aWdodCA9IHRydWUsXG4gICAgICB0ZXJtaW5hdG9yUnVsZXMsXG4gICAgICB0b2tlbixcbiAgICAgIGksIGwsIHRlcm1pbmF0ZTtcblxuICAvLyBEZXRlY3QgbGlzdCB0eXBlIGFuZCBwb3NpdGlvbiBhZnRlciBtYXJrZXJcbiAgaWYgKChwb3NBZnRlck1hcmtlciA9IHNraXBPcmRlcmVkTGlzdE1hcmtlcihzdGF0ZSwgc3RhcnRMaW5lKSkgPj0gMCkge1xuICAgIGlzT3JkZXJlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoKHBvc0FmdGVyTWFya2VyID0gc2tpcEJ1bGxldExpc3RNYXJrZXIoc3RhdGUsIHN0YXJ0TGluZSkpID49IDApIHtcbiAgICBpc09yZGVyZWQgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBXZSBzaG91bGQgdGVybWluYXRlIGxpc3Qgb24gc3R5bGUgY2hhbmdlLiBSZW1lbWJlciBmaXJzdCBvbmUgdG8gY29tcGFyZS5cbiAgbWFya2VyQ2hhckNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3NBZnRlck1hcmtlciAtIDEpO1xuXG4gIC8vIEZvciB2YWxpZGF0aW9uIG1vZGUgd2UgY2FuIHRlcm1pbmF0ZSBpbW1lZGlhdGVseVxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gU3RhcnQgbGlzdFxuICBsaXN0VG9rSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aDtcblxuICBpZiAoaXNPcmRlcmVkKSB7XG4gICAgc3RhcnQgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICAgIG1hcmtlclZhbHVlID0gTnVtYmVyKHN0YXRlLnNyYy5zdWJzdHIoc3RhcnQsIHBvc0FmdGVyTWFya2VyIC0gc3RhcnQgLSAxKSk7XG5cbiAgICB0b2tlbiAgICAgICA9IHN0YXRlLnB1c2goJ29yZGVyZWRfbGlzdF9vcGVuJywgJ29sJywgMSk7XG4gICAgaWYgKG1hcmtlclZhbHVlID4gMSkge1xuICAgICAgdG9rZW4uYXR0cnMgPSBbIFsgJ3N0YXJ0JywgbWFya2VyVmFsdWUgXSBdO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHRva2VuICAgICAgID0gc3RhdGUucHVzaCgnYnVsbGV0X2xpc3Rfb3BlbicsICd1bCcsIDEpO1xuICB9XG5cbiAgdG9rZW4ubWFwICAgID0gbGlzdExpbmVzID0gWyBzdGFydExpbmUsIDAgXTtcbiAgdG9rZW4ubWFya3VwID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXJDaGFyQ29kZSk7XG5cbiAgLy9cbiAgLy8gSXRlcmF0ZSBsaXN0IGl0ZW1zXG4gIC8vXG5cbiAgbmV4dExpbmUgPSBzdGFydExpbmU7XG4gIHByZXZFbXB0eUVuZCA9IGZhbHNlO1xuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5tZC5ibG9jay5ydWxlci5nZXRSdWxlcygnbGlzdCcpO1xuXG4gIHdoaWxlIChuZXh0TGluZSA8IGVuZExpbmUpIHtcbiAgICBjb250ZW50U3RhcnQgPSBzdGF0ZS5za2lwU3BhY2VzKHBvc0FmdGVyTWFya2VyKTtcbiAgICBtYXggPSBzdGF0ZS5lTWFya3NbbmV4dExpbmVdO1xuXG4gICAgaWYgKGNvbnRlbnRTdGFydCA+PSBtYXgpIHtcbiAgICAgIC8vIHRyaW1taW5nIHNwYWNlIGluIFwiLSAgICBcXG4gIDNcIiBjYXNlLCBpbmRlbnQgaXMgMSBoZXJlXG4gICAgICBpbmRlbnRBZnRlck1hcmtlciA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGVudEFmdGVyTWFya2VyID0gY29udGVudFN0YXJ0IC0gcG9zQWZ0ZXJNYXJrZXI7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBtb3JlIHRoYW4gNCBzcGFjZXMsIHRoZSBpbmRlbnQgaXMgMVxuICAgIC8vICh0aGUgcmVzdCBpcyBqdXN0IGluZGVudGVkIGNvZGUgYmxvY2spXG4gICAgaWYgKGluZGVudEFmdGVyTWFya2VyID4gNCkgeyBpbmRlbnRBZnRlck1hcmtlciA9IDE7IH1cblxuICAgIC8vIFwiICAtICB0ZXN0XCJcbiAgICAvLyAgXl5eXl4gLSBjYWxjdWxhdGluZyB0b3RhbCBsZW5ndGggb2YgdGhpcyB0aGluZ1xuICAgIGluZGVudCA9IChwb3NBZnRlck1hcmtlciAtIHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pICsgaW5kZW50QWZ0ZXJNYXJrZXI7XG5cbiAgICAvLyBSdW4gc3VicGFyc2VyICYgd3JpdGUgdG9rZW5zXG4gICAgdG9rZW4gICAgICAgID0gc3RhdGUucHVzaCgnbGlzdF9pdGVtX29wZW4nLCAnbGknLCAxKTtcbiAgICB0b2tlbi5tYXJrdXAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG1hcmtlckNoYXJDb2RlKTtcbiAgICB0b2tlbi5tYXAgICAgPSBpdGVtTGluZXMgPSBbIHN0YXJ0TGluZSwgMCBdO1xuXG4gICAgb2xkSW5kZW50ID0gc3RhdGUuYmxrSW5kZW50O1xuICAgIG9sZFRpZ2h0ID0gc3RhdGUudGlnaHQ7XG4gICAgb2xkVFNoaWZ0ID0gc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG4gICAgb2xkUGFyZW50VHlwZSA9IHN0YXRlLnBhcmVudFR5cGU7XG4gICAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBjb250ZW50U3RhcnQgLSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcbiAgICBzdGF0ZS5ibGtJbmRlbnQgPSBpbmRlbnQ7XG4gICAgc3RhdGUudGlnaHQgPSB0cnVlO1xuICAgIHN0YXRlLnBhcmVudFR5cGUgPSAnbGlzdCc7XG5cbiAgICBzdGF0ZS5tZC5ibG9jay50b2tlbml6ZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCB0cnVlKTtcblxuICAgIC8vIElmIGFueSBvZiBsaXN0IGl0ZW0gaXMgdGlnaHQsIG1hcmsgbGlzdCBhcyB0aWdodFxuICAgIGlmICghc3RhdGUudGlnaHQgfHwgcHJldkVtcHR5RW5kKSB7XG4gICAgICB0aWdodCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBJdGVtIGJlY29tZSBsb29zZSBpZiBmaW5pc2ggd2l0aCBlbXB0eSBsaW5lLFxuICAgIC8vIGJ1dCB3ZSBzaG91bGQgZmlsdGVyIGxhc3QgZWxlbWVudCwgYmVjYXVzZSBpdCBtZWFucyBsaXN0IGZpbmlzaFxuICAgIHByZXZFbXB0eUVuZCA9IChzdGF0ZS5saW5lIC0gc3RhcnRMaW5lKSA+IDEgJiYgc3RhdGUuaXNFbXB0eShzdGF0ZS5saW5lIC0gMSk7XG5cbiAgICBzdGF0ZS5ibGtJbmRlbnQgPSBvbGRJbmRlbnQ7XG4gICAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBvbGRUU2hpZnQ7XG4gICAgc3RhdGUudGlnaHQgPSBvbGRUaWdodDtcbiAgICBzdGF0ZS5wYXJlbnRUeXBlID0gb2xkUGFyZW50VHlwZTtcblxuICAgIHRva2VuICAgICAgICA9IHN0YXRlLnB1c2goJ2xpc3RfaXRlbV9jbG9zZScsICdsaScsIC0xKTtcbiAgICB0b2tlbi5tYXJrdXAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG1hcmtlckNoYXJDb2RlKTtcblxuICAgIG5leHRMaW5lID0gc3RhcnRMaW5lID0gc3RhdGUubGluZTtcbiAgICBpdGVtTGluZXNbMV0gPSBuZXh0TGluZTtcbiAgICBjb250ZW50U3RhcnQgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcblxuICAgIGlmIChuZXh0TGluZSA+PSBlbmRMaW5lKSB7IGJyZWFrOyB9XG5cbiAgICBpZiAoc3RhdGUuaXNFbXB0eShuZXh0TGluZSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gVHJ5IHRvIGNoZWNrIGlmIGxpc3QgaXMgdGVybWluYXRlZCBvciBjb250aW51ZWQuXG4gICAgLy9cbiAgICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSA8IHN0YXRlLmJsa0luZGVudCkgeyBicmVhazsgfVxuXG4gICAgLy8gZmFpbCBpZiB0ZXJtaW5hdGluZyBibG9jayBmb3VuZFxuICAgIHRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0ZXJtaW5hdG9yUnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgdGVybWluYXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXJtaW5hdGUpIHsgYnJlYWs7IH1cblxuICAgIC8vIGZhaWwgaWYgbGlzdCBoYXMgYW5vdGhlciB0eXBlXG4gICAgaWYgKGlzT3JkZXJlZCkge1xuICAgICAgcG9zQWZ0ZXJNYXJrZXIgPSBza2lwT3JkZXJlZExpc3RNYXJrZXIoc3RhdGUsIG5leHRMaW5lKTtcbiAgICAgIGlmIChwb3NBZnRlck1hcmtlciA8IDApIHsgYnJlYWs7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcG9zQWZ0ZXJNYXJrZXIgPSBza2lwQnVsbGV0TGlzdE1hcmtlcihzdGF0ZSwgbmV4dExpbmUpO1xuICAgICAgaWYgKHBvc0FmdGVyTWFya2VyIDwgMCkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIGlmIChtYXJrZXJDaGFyQ29kZSAhPT0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zQWZ0ZXJNYXJrZXIgLSAxKSkgeyBicmVhazsgfVxuICB9XG5cbiAgLy8gRmluaWxpemUgbGlzdFxuICBpZiAoaXNPcmRlcmVkKSB7XG4gICAgdG9rZW4gPSBzdGF0ZS5wdXNoKCdvcmRlcmVkX2xpc3RfY2xvc2UnLCAnb2wnLCAtMSk7XG4gIH0gZWxzZSB7XG4gICAgdG9rZW4gPSBzdGF0ZS5wdXNoKCdidWxsZXRfbGlzdF9jbG9zZScsICd1bCcsIC0xKTtcbiAgfVxuICB0b2tlbi5tYXJrdXAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG1hcmtlckNoYXJDb2RlKTtcblxuICBsaXN0TGluZXNbMV0gPSBuZXh0TGluZTtcbiAgc3RhdGUubGluZSA9IG5leHRMaW5lO1xuXG4gIC8vIG1hcmsgcGFyYWdyYXBocyB0aWdodCBpZiBuZWVkZWRcbiAgaWYgKHRpZ2h0KSB7XG4gICAgbWFya1RpZ2h0UGFyYWdyYXBocyhzdGF0ZSwgbGlzdFRva0lkeCk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQYXJhZ3JhcGhcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyYWdyYXBoKHN0YXRlLCBzdGFydExpbmUvKiwgZW5kTGluZSovKSB7XG4gIHZhciBjb250ZW50LCB0ZXJtaW5hdGUsIGksIGwsIHRva2VuLFxuICAgICAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxLFxuICAgICAgdGVybWluYXRvclJ1bGVzID0gc3RhdGUubWQuYmxvY2sucnVsZXIuZ2V0UnVsZXMoJ3BhcmFncmFwaCcpLFxuICAgICAgZW5kTGluZSA9IHN0YXRlLmxpbmVNYXg7XG5cbiAgLy8ganVtcCBsaW5lLWJ5LWxpbmUgdW50aWwgZW1wdHkgb25lIG9yIEVPRlxuICBmb3IgKDsgbmV4dExpbmUgPCBlbmRMaW5lICYmICFzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKTsgbmV4dExpbmUrKykge1xuICAgIC8vIHRoaXMgd291bGQgYmUgYSBjb2RlIGJsb2NrIG5vcm1hbGx5LCBidXQgYWZ0ZXIgcGFyYWdyYXBoXG4gICAgLy8gaXQncyBjb25zaWRlcmVkIGEgbGF6eSBjb250aW51YXRpb24gcmVnYXJkbGVzcyBvZiB3aGF0J3MgdGhlcmVcbiAgICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSAtIHN0YXRlLmJsa0luZGVudCA+IDMpIHsgY29udGludWU7IH1cblxuICAgIC8vIFNvbWUgdGFncyBjYW4gdGVybWluYXRlIHBhcmFncmFwaCB3aXRob3V0IGVtcHR5IGxpbmUuXG4gICAgdGVybWluYXRlID0gZmFsc2U7XG4gICAgZm9yIChpID0gMCwgbCA9IHRlcm1pbmF0b3JSdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0ZXJtaW5hdG9yUnVsZXNbaV0oc3RhdGUsIG5leHRMaW5lLCBlbmRMaW5lLCB0cnVlKSkge1xuICAgICAgICB0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRlcm1pbmF0ZSkgeyBicmVhazsgfVxuICB9XG5cbiAgY29udGVudCA9IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbmV4dExpbmUsIHN0YXRlLmJsa0luZGVudCwgZmFsc2UpLnRyaW0oKTtcblxuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG5cbiAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCdwYXJhZ3JhcGhfb3BlbicsICdwJywgMSk7XG4gIHRva2VuLm1hcCAgICAgID0gWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXTtcblxuICB0b2tlbiAgICAgICAgICA9IHN0YXRlLnB1c2goJ2lubGluZScsICcnLCAwKTtcbiAgdG9rZW4uY29udGVudCAgPSBjb250ZW50O1xuICB0b2tlbi5tYXAgICAgICA9IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIF07XG4gIHRva2VuLmNoaWxkcmVuID0gW107XG5cbiAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCdwYXJhZ3JhcGhfY2xvc2UnLCAncCcsIC0xKTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIHBhcnNlTGlua0Rlc3RpbmF0aW9uID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uJyk7XG52YXIgcGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfdGl0bGUnKTtcbnZhciBub3JtYWxpemVSZWZlcmVuY2UgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLm5vcm1hbGl6ZVJlZmVyZW5jZTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlZmVyZW5jZShzdGF0ZSwgc3RhcnRMaW5lLCBfZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCxcbiAgICAgIGRlc3RFbmRQb3MsXG4gICAgICBkZXN0RW5kTGluZU5vLFxuICAgICAgZW5kTGluZSxcbiAgICAgIGhyZWYsXG4gICAgICBpLFxuICAgICAgbCxcbiAgICAgIGxhYmVsLFxuICAgICAgbGFiZWxFbmQsXG4gICAgICByZXMsXG4gICAgICBzdGFydCxcbiAgICAgIHN0cixcbiAgICAgIHRlcm1pbmF0ZSxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcyxcbiAgICAgIHRpdGxlLFxuICAgICAgbGluZXMgPSAwLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdLFxuICAgICAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDVCLyogWyAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBTaW1wbGUgY2hlY2sgdG8gcXVpY2tseSBpbnRlcnJ1cHQgc2NhbiBvbiBbbGlua10odXJsKSBhdCB0aGUgc3RhcnQgb2YgbGluZS5cbiAgLy8gQ2FuIGJlIHVzZWZ1bCBvbiBwcmFjdGljZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0L2lzc3Vlcy81NFxuICB3aGlsZSAoKytwb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHg1RCAvKiBdICovICYmXG4gICAgICAgIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyAtIDEpICE9PSAweDVDLyogXFwgKi8pIHtcbiAgICAgIGlmIChwb3MgKyAxID09PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSkgIT09IDB4M0EvKiA6ICovKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZW5kTGluZSA9IHN0YXRlLmxpbmVNYXg7XG5cbiAgLy8ganVtcCBsaW5lLWJ5LWxpbmUgdW50aWwgZW1wdHkgb25lIG9yIEVPRlxuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5tZC5ibG9jay5ydWxlci5nZXRSdWxlcygncmVmZXJlbmNlJyk7XG5cbiAgZm9yICg7IG5leHRMaW5lIDwgZW5kTGluZSAmJiAhc3RhdGUuaXNFbXB0eShuZXh0TGluZSk7IG5leHRMaW5lKyspIHtcbiAgICAvLyB0aGlzIHdvdWxkIGJlIGEgY29kZSBibG9jayBub3JtYWxseSwgYnV0IGFmdGVyIHBhcmFncmFwaFxuICAgIC8vIGl0J3MgY29uc2lkZXJlZCBhIGxhenkgY29udGludWF0aW9uIHJlZ2FyZGxlc3Mgb2Ygd2hhdCdzIHRoZXJlXG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gLSBzdGF0ZS5ibGtJbmRlbnQgPiAzKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAvLyBTb21lIHRhZ3MgY2FuIHRlcm1pbmF0ZSBwYXJhZ3JhcGggd2l0aG91dCBlbXB0eSBsaW5lLlxuICAgIHRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0ZXJtaW5hdG9yUnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGVybWluYXRvclJ1bGVzW2ldKHN0YXRlLCBuZXh0TGluZSwgZW5kTGluZSwgdHJ1ZSkpIHtcbiAgICAgICAgdGVybWluYXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXJtaW5hdGUpIHsgYnJlYWs7IH1cbiAgfVxuXG4gIHN0ciA9IHN0YXRlLmdldExpbmVzKHN0YXJ0TGluZSwgbmV4dExpbmUsIHN0YXRlLmJsa0luZGVudCwgZmFsc2UpLnRyaW0oKTtcbiAgbWF4ID0gc3RyLmxlbmd0aDtcblxuICBmb3IgKHBvcyA9IDE7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBjaCA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG4gICAgaWYgKGNoID09PSAweDVCIC8qIFsgKi8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDVEIC8qIF0gKi8pIHtcbiAgICAgIGxhYmVsRW5kID0gcG9zO1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChjaCA9PT0gMHgwQSAvKiBcXG4gKi8pIHtcbiAgICAgIGxpbmVzKys7XG4gICAgfSBlbHNlIGlmIChjaCA9PT0gMHg1QyAvKiBcXCAqLykge1xuICAgICAgcG9zKys7XG4gICAgICBpZiAocG9zIDwgbWF4ICYmIHN0ci5jaGFyQ29kZUF0KHBvcykgPT09IDB4MEEpIHtcbiAgICAgICAgbGluZXMrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobGFiZWxFbmQgPCAwIHx8IHN0ci5jaGFyQ29kZUF0KGxhYmVsRW5kICsgMSkgIT09IDB4M0EvKiA6ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIFtsYWJlbF06ICAgZGVzdGluYXRpb24gICAndGl0bGUnXG4gIC8vICAgICAgICAgXl5eIHNraXAgb3B0aW9uYWwgd2hpdGVzcGFjZSBoZXJlXG4gIGZvciAocG9zID0gbGFiZWxFbmQgKyAyOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgY2ggPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuICAgIGlmIChjaCA9PT0gMHgwQSkge1xuICAgICAgbGluZXMrKztcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDIwKSB7XG4gICAgICAvKmVzbGludCBuby1lbXB0eTowKi9cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gW2xhYmVsXTogICBkZXN0aW5hdGlvbiAgICd0aXRsZSdcbiAgLy8gICAgICAgICAgICBeXl5eXl5eXl5eXiBwYXJzZSB0aGlzXG4gIHJlcyA9IHBhcnNlTGlua0Rlc3RpbmF0aW9uKHN0ciwgcG9zLCBtYXgpO1xuICBpZiAoIXJlcy5vaykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBocmVmID0gc3RhdGUubWQubm9ybWFsaXplTGluayhyZXMuc3RyKTtcbiAgaWYgKCFzdGF0ZS5tZC52YWxpZGF0ZUxpbmsoaHJlZikpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gcmVzLnBvcztcbiAgbGluZXMgKz0gcmVzLmxpbmVzO1xuXG4gIC8vIHNhdmUgY3Vyc29yIHN0YXRlLCB3ZSBjb3VsZCByZXF1aXJlIHRvIHJvbGxiYWNrIGxhdGVyXG4gIGRlc3RFbmRQb3MgPSBwb3M7XG4gIGRlc3RFbmRMaW5lTm8gPSBsaW5lcztcblxuICAvLyBbbGFiZWxdOiAgIGRlc3RpbmF0aW9uICAgJ3RpdGxlJ1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgXl5eIHNraXBwaW5nIHRob3NlIHNwYWNlc1xuICBzdGFydCA9IHBvcztcbiAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBjaCA9IHN0ci5jaGFyQ29kZUF0KHBvcyk7XG4gICAgaWYgKGNoID09PSAweDBBKSB7XG4gICAgICBsaW5lcysrO1xuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4MjApIHtcbiAgICAgIC8qZXNsaW50IG5vLWVtcHR5OjAqL1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBbbGFiZWxdOiAgIGRlc3RpbmF0aW9uICAgJ3RpdGxlJ1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgXl5eXl5eXiBwYXJzZSB0aGlzXG4gIHJlcyA9IHBhcnNlTGlua1RpdGxlKHN0ciwgcG9zLCBtYXgpO1xuICBpZiAocG9zIDwgbWF4ICYmIHN0YXJ0ICE9PSBwb3MgJiYgcmVzLm9rKSB7XG4gICAgdGl0bGUgPSByZXMuc3RyO1xuICAgIHBvcyA9IHJlcy5wb3M7XG4gICAgbGluZXMgKz0gcmVzLmxpbmVzO1xuICB9IGVsc2Uge1xuICAgIHRpdGxlID0gJyc7XG4gICAgcG9zID0gZGVzdEVuZFBvcztcbiAgICBsaW5lcyA9IGRlc3RFbmRMaW5lTm87XG4gIH1cblxuICAvLyBza2lwIHRyYWlsaW5nIHNwYWNlcyB1bnRpbCB0aGUgcmVzdCBvZiB0aGUgbGluZVxuICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0ci5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjAvKiBzcGFjZSAqLykgeyBwb3MrKzsgfVxuXG4gIGlmIChwb3MgPCBtYXggJiYgc3RyLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgwQSkge1xuICAgIC8vIGdhcmJhZ2UgYXQgdGhlIGVuZCBvZiB0aGUgbGluZVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFJlZmVyZW5jZSBjYW4gbm90IHRlcm1pbmF0ZSBhbnl0aGluZy4gVGhpcyBjaGVjayBpcyBmb3Igc2FmZXR5IG9ubHkuXG4gIC8qaXN0YW5idWwgaWdub3JlIGlmKi9cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIGxhYmVsID0gbm9ybWFsaXplUmVmZXJlbmNlKHN0ci5zbGljZSgxLCBsYWJlbEVuZCkpO1xuICBpZiAodHlwZW9mIHN0YXRlLmVudi5yZWZlcmVuY2VzID09PSAndW5kZWZpbmVkJykge1xuICAgIHN0YXRlLmVudi5yZWZlcmVuY2VzID0ge307XG4gIH1cbiAgaWYgKHR5cGVvZiBzdGF0ZS5lbnYucmVmZXJlbmNlc1tsYWJlbF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3RhdGUuZW52LnJlZmVyZW5jZXNbbGFiZWxdID0geyB0aXRsZTogdGl0bGUsIGhyZWY6IGhyZWYgfTtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgPSBzdGFydExpbmUgKyBsaW5lcyArIDE7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFBhcnNlciBzdGF0ZSBjbGFzc1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBUb2tlbiA9IHJlcXVpcmUoJy4uL3Rva2VuJyk7XG5cblxuZnVuY3Rpb24gU3RhdGVCbG9jayhzcmMsIG1kLCBlbnYsIHRva2Vucykge1xuICB2YXIgY2gsIHMsIHN0YXJ0LCBwb3MsIGxlbiwgaW5kZW50LCBpbmRlbnRfZm91bmQ7XG5cbiAgdGhpcy5zcmMgPSBzcmM7XG5cbiAgLy8gbGluayB0byBwYXJzZXIgaW5zdGFuY2VcbiAgdGhpcy5tZCAgICAgPSBtZDtcblxuICB0aGlzLmVudiA9IGVudjtcblxuICAvL1xuICAvLyBJbnRlcm5hbCBzdGF0ZSB2YXJ0aWFibGVzXG4gIC8vXG5cbiAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgdGhpcy5iTWFya3MgPSBbXTsgIC8vIGxpbmUgYmVnaW4gb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLmVNYXJrcyA9IFtdOyAgLy8gbGluZSBlbmQgb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLnRTaGlmdCA9IFtdOyAgLy8gaW5kZW50IGZvciBlYWNoIGxpbmVcblxuICAvLyBibG9jayBwYXJzZXIgdmFyaWFibGVzXG4gIHRoaXMuYmxrSW5kZW50ICA9IDA7IC8vIHJlcXVpcmVkIGJsb2NrIGNvbnRlbnQgaW5kZW50XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIChmb3IgZXhhbXBsZSwgaWYgd2UgYXJlIGluIGxpc3QpXG4gIHRoaXMubGluZSAgICAgICA9IDA7IC8vIGxpbmUgaW5kZXggaW4gc3JjXG4gIHRoaXMubGluZU1heCAgICA9IDA7IC8vIGxpbmVzIGNvdW50XG4gIHRoaXMudGlnaHQgICAgICA9IGZhbHNlOyAgLy8gbG9vc2UvdGlnaHQgbW9kZSBmb3IgbGlzdHNcbiAgdGhpcy5wYXJlbnRUeXBlID0gJ3Jvb3QnOyAvLyBpZiBgbGlzdGAsIGJsb2NrIHBhcnNlciBzdG9wcyBvbiB0d28gbmV3bGluZXNcbiAgdGhpcy5kZEluZGVudCAgID0gLTE7IC8vIGluZGVudCBvZiB0aGUgY3VycmVudCBkZCBibG9jayAoLTEgaWYgdGhlcmUgaXNuJ3QgYW55KVxuXG4gIHRoaXMubGV2ZWwgPSAwO1xuXG4gIC8vIHJlbmRlcmVyXG4gIHRoaXMucmVzdWx0ID0gJyc7XG5cbiAgLy8gQ3JlYXRlIGNhY2hlc1xuICAvLyBHZW5lcmF0ZSBtYXJrZXJzLlxuICBzID0gdGhpcy5zcmM7XG4gIGluZGVudCA9IDA7XG4gIGluZGVudF9mb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoc3RhcnQgPSBwb3MgPSBpbmRlbnQgPSAwLCBsZW4gPSBzLmxlbmd0aDsgcG9zIDwgbGVuOyBwb3MrKykge1xuICAgIGNoID0gcy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoIWluZGVudF9mb3VuZCkge1xuICAgICAgaWYgKGNoID09PSAweDIwLyogc3BhY2UgKi8pIHtcbiAgICAgICAgaW5kZW50Kys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZW50X2ZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2ggPT09IDB4MEEgfHwgcG9zID09PSBsZW4gLSAxKSB7XG4gICAgICBpZiAoY2ggIT09IDB4MEEpIHsgcG9zKys7IH1cbiAgICAgIHRoaXMuYk1hcmtzLnB1c2goc3RhcnQpO1xuICAgICAgdGhpcy5lTWFya3MucHVzaChwb3MpO1xuICAgICAgdGhpcy50U2hpZnQucHVzaChpbmRlbnQpO1xuXG4gICAgICBpbmRlbnRfZm91bmQgPSBmYWxzZTtcbiAgICAgIGluZGVudCA9IDA7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgLy8gUHVzaCBmYWtlIGVudHJ5IHRvIHNpbXBsaWZ5IGNhY2hlIGJvdW5kcyBjaGVja3NcbiAgdGhpcy5iTWFya3MucHVzaChzLmxlbmd0aCk7XG4gIHRoaXMuZU1hcmtzLnB1c2gocy5sZW5ndGgpO1xuICB0aGlzLnRTaGlmdC5wdXNoKDApO1xuXG4gIHRoaXMubGluZU1heCA9IHRoaXMuYk1hcmtzLmxlbmd0aCAtIDE7IC8vIGRvbid0IGNvdW50IGxhc3QgZmFrZSBsaW5lXG59XG5cbi8vIFB1c2ggbmV3IHRva2VuIHRvIFwic3RyZWFtXCIuXG4vL1xuU3RhdGVCbG9jay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh0eXBlLCB0YWcsIG5lc3RpbmcpIHtcbiAgdmFyIHRva2VuID0gbmV3IFRva2VuKHR5cGUsIHRhZywgbmVzdGluZyk7XG4gIHRva2VuLmJsb2NrID0gdHJ1ZTtcblxuICBpZiAobmVzdGluZyA8IDApIHsgdGhpcy5sZXZlbC0tOyB9XG4gIHRva2VuLmxldmVsID0gdGhpcy5sZXZlbDtcbiAgaWYgKG5lc3RpbmcgPiAwKSB7IHRoaXMubGV2ZWwrKzsgfVxuXG4gIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICByZXR1cm4gdG9rZW47XG59O1xuXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eShsaW5lKSB7XG4gIHJldHVybiB0aGlzLmJNYXJrc1tsaW5lXSArIHRoaXMudFNoaWZ0W2xpbmVdID49IHRoaXMuZU1hcmtzW2xpbmVdO1xufTtcblxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcEVtcHR5TGluZXMgPSBmdW5jdGlvbiBza2lwRW1wdHlMaW5lcyhmcm9tKSB7XG4gIGZvciAodmFyIG1heCA9IHRoaXMubGluZU1heDsgZnJvbSA8IG1heDsgZnJvbSsrKSB7XG4gICAgaWYgKHRoaXMuYk1hcmtzW2Zyb21dICsgdGhpcy50U2hpZnRbZnJvbV0gPCB0aGlzLmVNYXJrc1tmcm9tXSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmcm9tO1xufTtcblxuLy8gU2tpcCBzcGFjZXMgZnJvbSBnaXZlbiBwb3NpdGlvbi5cblN0YXRlQmxvY2sucHJvdG90eXBlLnNraXBTcGFjZXMgPSBmdW5jdGlvbiBza2lwU3BhY2VzKHBvcykge1xuICBmb3IgKHZhciBtYXggPSB0aGlzLnNyYy5sZW5ndGg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBpZiAodGhpcy5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDIwLyogc3BhY2UgKi8pIHsgYnJlYWs7IH1cbiAgfVxuICByZXR1cm4gcG9zO1xufTtcblxuLy8gU2tpcCBjaGFyIGNvZGVzIGZyb20gZ2l2ZW4gcG9zaXRpb25cblN0YXRlQmxvY2sucHJvdG90eXBlLnNraXBDaGFycyA9IGZ1bmN0aW9uIHNraXBDaGFycyhwb3MsIGNvZGUpIHtcbiAgZm9yICh2YXIgbWF4ID0gdGhpcy5zcmMubGVuZ3RoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgaWYgKHRoaXMuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gY29kZSkgeyBicmVhazsgfVxuICB9XG4gIHJldHVybiBwb3M7XG59O1xuXG4vLyBTa2lwIGNoYXIgY29kZXMgcmV2ZXJzZSBmcm9tIGdpdmVuIHBvc2l0aW9uIC0gMVxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcENoYXJzQmFjayA9IGZ1bmN0aW9uIHNraXBDaGFyc0JhY2socG9zLCBjb2RlLCBtaW4pIHtcbiAgaWYgKHBvcyA8PSBtaW4pIHsgcmV0dXJuIHBvczsgfVxuXG4gIHdoaWxlIChwb3MgPiBtaW4pIHtcbiAgICBpZiAoY29kZSAhPT0gdGhpcy5zcmMuY2hhckNvZGVBdCgtLXBvcykpIHsgcmV0dXJuIHBvcyArIDE7IH1cbiAgfVxuICByZXR1cm4gcG9zO1xufTtcblxuLy8gY3V0IGxpbmVzIHJhbmdlIGZyb20gc291cmNlLlxuU3RhdGVCbG9jay5wcm90b3R5cGUuZ2V0TGluZXMgPSBmdW5jdGlvbiBnZXRMaW5lcyhiZWdpbiwgZW5kLCBpbmRlbnQsIGtlZXBMYXN0TEYpIHtcbiAgdmFyIGksIGZpcnN0LCBsYXN0LCBxdWV1ZSwgc2hpZnQsXG4gICAgICBsaW5lID0gYmVnaW47XG5cbiAgaWYgKGJlZ2luID49IGVuZCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8vIE9wdDogZG9uJ3QgdXNlIHB1c2ggcXVldWUgZm9yIHNpbmdsZSBsaW5lO1xuICBpZiAobGluZSArIDEgPT09IGVuZCkge1xuICAgIGZpcnN0ID0gdGhpcy5iTWFya3NbbGluZV0gKyBNYXRoLm1pbih0aGlzLnRTaGlmdFtsaW5lXSwgaW5kZW50KTtcbiAgICBsYXN0ID0ga2VlcExhc3RMRiA/IHRoaXMuYk1hcmtzW2VuZF0gOiB0aGlzLmVNYXJrc1tlbmQgLSAxXTtcbiAgICByZXR1cm4gdGhpcy5zcmMuc2xpY2UoZmlyc3QsIGxhc3QpO1xuICB9XG5cbiAgcXVldWUgPSBuZXcgQXJyYXkoZW5kIC0gYmVnaW4pO1xuXG4gIGZvciAoaSA9IDA7IGxpbmUgPCBlbmQ7IGxpbmUrKywgaSsrKSB7XG4gICAgc2hpZnQgPSB0aGlzLnRTaGlmdFtsaW5lXTtcbiAgICBpZiAoc2hpZnQgPiBpbmRlbnQpIHsgc2hpZnQgPSBpbmRlbnQ7IH1cbiAgICBpZiAoc2hpZnQgPCAwKSB7IHNoaWZ0ID0gMDsgfVxuXG4gICAgZmlyc3QgPSB0aGlzLmJNYXJrc1tsaW5lXSArIHNoaWZ0O1xuXG4gICAgaWYgKGxpbmUgKyAxIDwgZW5kIHx8IGtlZXBMYXN0TEYpIHtcbiAgICAgIC8vIE5vIG5lZWQgZm9yIGJvdW5kcyBjaGVjayBiZWNhdXNlIHdlIGhhdmUgZmFrZSBlbnRyeSBvbiB0YWlsLlxuICAgICAgbGFzdCA9IHRoaXMuZU1hcmtzW2xpbmVdICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdCA9IHRoaXMuZU1hcmtzW2xpbmVdO1xuICAgIH1cblxuICAgIHF1ZXVlW2ldID0gdGhpcy5zcmMuc2xpY2UoZmlyc3QsIGxhc3QpO1xuICB9XG5cbiAgcmV0dXJuIHF1ZXVlLmpvaW4oJycpO1xufTtcblxuLy8gcmUtZXhwb3J0IFRva2VuIGNsYXNzIHRvIHVzZSBpbiBibG9jayBydWxlc1xuU3RhdGVCbG9jay5wcm90b3R5cGUuVG9rZW4gPSBUb2tlbjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXRlQmxvY2s7XG4iLCIvLyBHRk0gdGFibGUsIG5vbi1zdGFuZGFyZFxuXG4ndXNlIHN0cmljdCc7XG5cblxuZnVuY3Rpb24gZ2V0TGluZShzdGF0ZSwgbGluZSkge1xuICB2YXIgcG9zID0gc3RhdGUuYk1hcmtzW2xpbmVdICsgc3RhdGUuYmxrSW5kZW50LFxuICAgICAgbWF4ID0gc3RhdGUuZU1hcmtzW2xpbmVdO1xuXG4gIHJldHVybiBzdGF0ZS5zcmMuc3Vic3RyKHBvcywgbWF4IC0gcG9zKTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlZFNwbGl0KHN0cikge1xuICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICBwb3MgPSAwLFxuICAgICAgbWF4ID0gc3RyLmxlbmd0aCxcbiAgICAgIGNoLFxuICAgICAgZXNjYXBlcyA9IDAsXG4gICAgICBsYXN0UG9zID0gMDtcblxuICBjaCAgPSBzdHIuY2hhckNvZGVBdChwb3MpO1xuXG4gIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICBpZiAoY2ggPT09IDB4N2MvKiB8ICovICYmIChlc2NhcGVzICUgMiA9PT0gMCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHN0ci5zdWJzdHJpbmcobGFzdFBvcywgcG9zKSk7XG4gICAgICBsYXN0UG9zID0gcG9zICsgMTtcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDVjLyogXFwgKi8pIHtcbiAgICAgIGVzY2FwZXMrKztcbiAgICB9IGVsc2Uge1xuICAgICAgZXNjYXBlcyA9IDA7XG4gICAgfVxuXG4gICAgY2ggID0gc3RyLmNoYXJDb2RlQXQoKytwb3MpO1xuICB9XG5cbiAgcmVzdWx0LnB1c2goc3RyLnN1YnN0cmluZyhsYXN0UG9zKSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRhYmxlKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgY2gsIGxpbmVUZXh0LCBwb3MsIGksIG5leHRMaW5lLCByb3dzLCB0b2tlbixcbiAgICAgIGFsaWducywgdCwgdGFibGVMaW5lcywgdGJvZHlMaW5lcztcblxuICAvLyBzaG91bGQgaGF2ZSBhdCBsZWFzdCB0aHJlZSBsaW5lc1xuICBpZiAoc3RhcnRMaW5lICsgMiA+IGVuZExpbmUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgc2Vjb25kIGxpbmUgc2hvdWxkIGJlICd8JyBvciAnLSdcblxuICBwb3MgPSBzdGF0ZS5iTWFya3NbbmV4dExpbmVdICsgc3RhdGUudFNoaWZ0W25leHRMaW5lXTtcbiAgaWYgKHBvcyA+PSBzdGF0ZS5lTWFya3NbbmV4dExpbmVdKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgaWYgKGNoICE9PSAweDdDLyogfCAqLyAmJiBjaCAhPT0gMHgyRC8qIC0gKi8gJiYgY2ggIT09IDB4M0EvKiA6ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxpbmVUZXh0ID0gZ2V0TGluZShzdGF0ZSwgc3RhcnRMaW5lICsgMSk7XG4gIGlmICghL15bLTp8IF0rJC8udGVzdChsaW5lVGV4dCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcm93cyA9IGxpbmVUZXh0LnNwbGl0KCd8Jyk7XG4gIGlmIChyb3dzLmxlbmd0aCA8IDIpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGFsaWducyA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIHQgPSByb3dzW2ldLnRyaW0oKTtcbiAgICBpZiAoIXQpIHtcbiAgICAgIC8vIGFsbG93IGVtcHR5IGNvbHVtbnMgYmVmb3JlIGFuZCBhZnRlciB0YWJsZSwgYnV0IG5vdCBpbiBiZXR3ZWVuIGNvbHVtbnM7XG4gICAgICAvLyBlLmcuIGFsbG93IGAgfC0tLXwgYCwgZGlzYWxsb3cgYCAtLS18fC0tLSBgXG4gICAgICBpZiAoaSA9PT0gMCB8fCBpID09PSByb3dzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCEvXjo/LSs6PyQvLnRlc3QodCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHQuY2hhckNvZGVBdCh0Lmxlbmd0aCAtIDEpID09PSAweDNBLyogOiAqLykge1xuICAgICAgYWxpZ25zLnB1c2godC5jaGFyQ29kZUF0KDApID09PSAweDNBLyogOiAqLyA/ICdjZW50ZXInIDogJ3JpZ2h0Jyk7XG4gICAgfSBlbHNlIGlmICh0LmNoYXJDb2RlQXQoMCkgPT09IDB4M0EvKiA6ICovKSB7XG4gICAgICBhbGlnbnMucHVzaCgnbGVmdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGlnbnMucHVzaCgnJyk7XG4gICAgfVxuICB9XG5cbiAgbGluZVRleHQgPSBnZXRMaW5lKHN0YXRlLCBzdGFydExpbmUpLnRyaW0oKTtcbiAgaWYgKGxpbmVUZXh0LmluZGV4T2YoJ3wnKSA9PT0gLTEpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHJvd3MgPSBlc2NhcGVkU3BsaXQobGluZVRleHQucmVwbGFjZSgvXlxcfHxcXHwkL2csICcnKSk7XG4gIGlmIChhbGlnbnMubGVuZ3RoICE9PSByb3dzLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIHRva2VuICAgICA9IHN0YXRlLnB1c2goJ3RhYmxlX29wZW4nLCAndGFibGUnLCAxKTtcbiAgdG9rZW4ubWFwID0gdGFibGVMaW5lcyA9IFsgc3RhcnRMaW5lLCAwIF07XG5cbiAgdG9rZW4gICAgID0gc3RhdGUucHVzaCgndGhlYWRfb3BlbicsICd0aGVhZCcsIDEpO1xuICB0b2tlbi5tYXAgPSBbIHN0YXJ0TGluZSwgc3RhcnRMaW5lICsgMSBdO1xuXG4gIHRva2VuICAgICA9IHN0YXRlLnB1c2goJ3RyX29wZW4nLCAndHInLCAxKTtcbiAgdG9rZW4ubWFwID0gWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIHRva2VuICAgICAgICAgID0gc3RhdGUucHVzaCgndGhfb3BlbicsICd0aCcsIDEpO1xuICAgIHRva2VuLm1hcCAgICAgID0gWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXTtcbiAgICBpZiAoYWxpZ25zW2ldKSB7XG4gICAgICB0b2tlbi5hdHRycyAgPSBbIFsgJ3N0eWxlJywgJ3RleHQtYWxpZ246JyArIGFsaWduc1tpXSBdIF07XG4gICAgfVxuXG4gICAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCdpbmxpbmUnLCAnJywgMCk7XG4gICAgdG9rZW4uY29udGVudCAgPSByb3dzW2ldLnRyaW0oKTtcbiAgICB0b2tlbi5tYXAgICAgICA9IFsgc3RhcnRMaW5lLCBzdGFydExpbmUgKyAxIF07XG4gICAgdG9rZW4uY2hpbGRyZW4gPSBbXTtcblxuICAgIHRva2VuICAgICAgICAgID0gc3RhdGUucHVzaCgndGhfY2xvc2UnLCAndGgnLCAtMSk7XG4gIH1cblxuICB0b2tlbiAgICAgPSBzdGF0ZS5wdXNoKCd0cl9jbG9zZScsICd0cicsIC0xKTtcbiAgdG9rZW4gICAgID0gc3RhdGUucHVzaCgndGhlYWRfY2xvc2UnLCAndGhlYWQnLCAtMSk7XG5cbiAgdG9rZW4gICAgID0gc3RhdGUucHVzaCgndGJvZHlfb3BlbicsICd0Ym9keScsIDEpO1xuICB0b2tlbi5tYXAgPSB0Ym9keUxpbmVzID0gWyBzdGFydExpbmUgKyAyLCAwIF07XG5cbiAgZm9yIChuZXh0TGluZSA9IHN0YXJ0TGluZSArIDI7IG5leHRMaW5lIDwgZW5kTGluZTsgbmV4dExpbmUrKykge1xuICAgIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7IGJyZWFrOyB9XG5cbiAgICBsaW5lVGV4dCA9IGdldExpbmUoc3RhdGUsIG5leHRMaW5lKS50cmltKCk7XG4gICAgaWYgKGxpbmVUZXh0LmluZGV4T2YoJ3wnKSA9PT0gLTEpIHsgYnJlYWs7IH1cbiAgICByb3dzID0gZXNjYXBlZFNwbGl0KGxpbmVUZXh0LnJlcGxhY2UoL15cXHx8XFx8JC9nLCAnJykpO1xuXG4gICAgLy8gc2V0IG51bWJlciBvZiBjb2x1bW5zIHRvIG51bWJlciBvZiBjb2x1bW5zIGluIGhlYWRlciByb3dcbiAgICByb3dzLmxlbmd0aCA9IGFsaWducy5sZW5ndGg7XG5cbiAgICB0b2tlbiA9IHN0YXRlLnB1c2goJ3RyX29wZW4nLCAndHInLCAxKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCd0ZF9vcGVuJywgJ3RkJywgMSk7XG4gICAgICBpZiAoYWxpZ25zW2ldKSB7XG4gICAgICAgIHRva2VuLmF0dHJzICA9IFsgWyAnc3R5bGUnLCAndGV4dC1hbGlnbjonICsgYWxpZ25zW2ldIF0gXTtcbiAgICAgIH1cblxuICAgICAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCdpbmxpbmUnLCAnJywgMCk7XG4gICAgICB0b2tlbi5jb250ZW50ICA9IHJvd3NbaV0gPyByb3dzW2ldLnRyaW0oKSA6ICcnO1xuICAgICAgdG9rZW4uY2hpbGRyZW4gPSBbXTtcblxuICAgICAgdG9rZW4gICAgICAgICAgPSBzdGF0ZS5wdXNoKCd0ZF9jbG9zZScsICd0ZCcsIC0xKTtcbiAgICB9XG4gICAgdG9rZW4gPSBzdGF0ZS5wdXNoKCd0cl9jbG9zZScsICd0cicsIC0xKTtcbiAgfVxuICB0b2tlbiA9IHN0YXRlLnB1c2goJ3Rib2R5X2Nsb3NlJywgJ3Rib2R5JywgLTEpO1xuICB0b2tlbiA9IHN0YXRlLnB1c2goJ3RhYmxlX2Nsb3NlJywgJ3RhYmxlJywgLTEpO1xuXG4gIHRhYmxlTGluZXNbMV0gPSB0Ym9keUxpbmVzWzFdID0gbmV4dExpbmU7XG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxvY2soc3RhdGUpIHtcbiAgdmFyIHRva2VuO1xuXG4gIGlmIChzdGF0ZS5pbmxpbmVNb2RlKSB7XG4gICAgdG9rZW4gICAgICAgICAgPSBuZXcgc3RhdGUuVG9rZW4oJ2lubGluZScsICcnLCAwKTtcbiAgICB0b2tlbi5jb250ZW50ICA9IHN0YXRlLnNyYztcbiAgICB0b2tlbi5tYXAgICAgICA9IFsgMCwgMSBdO1xuICAgIHRva2VuLmNoaWxkcmVuID0gW107XG4gICAgc3RhdGUudG9rZW5zLnB1c2godG9rZW4pO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLm1kLmJsb2NrLnBhcnNlKHN0YXRlLnNyYywgc3RhdGUubWQsIHN0YXRlLmVudiwgc3RhdGUudG9rZW5zKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmxpbmUoc3RhdGUpIHtcbiAgdmFyIHRva2VucyA9IHN0YXRlLnRva2VucywgdG9rLCBpLCBsO1xuXG4gIC8vIFBhcnNlIGlubGluZXNcbiAgZm9yIChpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB0b2sgPSB0b2tlbnNbaV07XG4gICAgaWYgKHRvay50eXBlID09PSAnaW5saW5lJykge1xuICAgICAgc3RhdGUubWQuaW5saW5lLnBhcnNlKHRvay5jb250ZW50LCBzdGF0ZS5tZCwgc3RhdGUuZW52LCB0b2suY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxufTtcbiIsIi8vIFJlcGxhY2UgbGluay1saWtlIHRleHRzIHdpdGggbGluayBub2Rlcy5cbi8vXG4vLyBDdXJyZW50bHkgcmVzdHJpY3RlZCBieSBgbWQudmFsaWRhdGVMaW5rKClgIHRvIGh0dHAvaHR0cHMvZnRwXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBhcnJheVJlcGxhY2VBdCA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmFycmF5UmVwbGFjZUF0O1xuXG5cbmZ1bmN0aW9uIGlzTGlua09wZW4oc3RyKSB7XG4gIHJldHVybiAvXjxhWz5cXHNdL2kudGVzdChzdHIpO1xufVxuZnVuY3Rpb24gaXNMaW5rQ2xvc2Uoc3RyKSB7XG4gIHJldHVybiAvXjxcXC9hXFxzKj4vaS50ZXN0KHN0cik7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsaW5raWZ5KHN0YXRlKSB7XG4gIHZhciBpLCBqLCBsLCB0b2tlbnMsIHRva2VuLCBjdXJyZW50VG9rZW4sIG5vZGVzLCBsbiwgdGV4dCwgcG9zLCBsYXN0UG9zLFxuICAgICAgbGV2ZWwsIGh0bWxMaW5rTGV2ZWwsIHVybCwgZnVsbFVybCwgdXJsVGV4dCxcbiAgICAgIGJsb2NrVG9rZW5zID0gc3RhdGUudG9rZW5zLFxuICAgICAgbGlua3M7XG5cbiAgaWYgKCFzdGF0ZS5tZC5vcHRpb25zLmxpbmtpZnkpIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChqID0gMCwgbCA9IGJsb2NrVG9rZW5zLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgIGlmIChibG9ja1Rva2Vuc1tqXS50eXBlICE9PSAnaW5saW5lJyB8fFxuICAgICAgICAhc3RhdGUubWQubGlua2lmeS5wcmV0ZXN0KGJsb2NrVG9rZW5zW2pdLmNvbnRlbnQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB0b2tlbnMgPSBibG9ja1Rva2Vuc1tqXS5jaGlsZHJlbjtcblxuICAgIGh0bWxMaW5rTGV2ZWwgPSAwO1xuXG4gICAgLy8gV2Ugc2NhbiBmcm9tIHRoZSBlbmQsIHRvIGtlZXAgcG9zaXRpb24gd2hlbiBuZXcgdGFncyBhZGRlZC5cbiAgICAvLyBVc2UgcmV2ZXJzZWQgbG9naWMgaW4gbGlua3Mgc3RhcnQvZW5kIG1hdGNoXG4gICAgZm9yIChpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjdXJyZW50VG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIC8vIFNraXAgY29udGVudCBvZiBtYXJrZG93biBsaW5rc1xuICAgICAgaWYgKGN1cnJlbnRUb2tlbi50eXBlID09PSAnbGlua19jbG9zZScpIHtcbiAgICAgICAgaS0tO1xuICAgICAgICB3aGlsZSAodG9rZW5zW2ldLmxldmVsICE9PSBjdXJyZW50VG9rZW4ubGV2ZWwgJiYgdG9rZW5zW2ldLnR5cGUgIT09ICdsaW5rX29wZW4nKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIGNvbnRlbnQgb2YgaHRtbCB0YWcgbGlua3NcbiAgICAgIGlmIChjdXJyZW50VG9rZW4udHlwZSA9PT0gJ2h0bWxfaW5saW5lJykge1xuICAgICAgICBpZiAoaXNMaW5rT3BlbihjdXJyZW50VG9rZW4uY29udGVudCkgJiYgaHRtbExpbmtMZXZlbCA+IDApIHtcbiAgICAgICAgICBodG1sTGlua0xldmVsLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGlua0Nsb3NlKGN1cnJlbnRUb2tlbi5jb250ZW50KSkge1xuICAgICAgICAgIGh0bWxMaW5rTGV2ZWwrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGh0bWxMaW5rTGV2ZWwgPiAwKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGlmIChjdXJyZW50VG9rZW4udHlwZSA9PT0gJ3RleHQnICYmIHN0YXRlLm1kLmxpbmtpZnkudGVzdChjdXJyZW50VG9rZW4uY29udGVudCkpIHtcblxuICAgICAgICB0ZXh0ID0gY3VycmVudFRva2VuLmNvbnRlbnQ7XG4gICAgICAgIGxpbmtzID0gc3RhdGUubWQubGlua2lmeS5tYXRjaCh0ZXh0KTtcblxuICAgICAgICAvLyBOb3cgc3BsaXQgc3RyaW5nIHRvIG5vZGVzXG4gICAgICAgIG5vZGVzID0gW107XG4gICAgICAgIGxldmVsID0gY3VycmVudFRva2VuLmxldmVsO1xuICAgICAgICBsYXN0UG9zID0gMDtcblxuICAgICAgICBmb3IgKGxuID0gMDsgbG4gPCBsaW5rcy5sZW5ndGg7IGxuKyspIHtcblxuICAgICAgICAgIHVybCA9IGxpbmtzW2xuXS51cmw7XG4gICAgICAgICAgZnVsbFVybCA9IHN0YXRlLm1kLm5vcm1hbGl6ZUxpbmsodXJsKTtcbiAgICAgICAgICBpZiAoIXN0YXRlLm1kLnZhbGlkYXRlTGluayhmdWxsVXJsKSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgICAgdXJsVGV4dCA9IGxpbmtzW2xuXS50ZXh0O1xuXG4gICAgICAgICAgLy8gTGlua2lmaWVyIG1pZ2h0IHNlbmQgcmF3IGhvc3RuYW1lcyBsaWtlIFwiZXhhbXBsZS5jb21cIiwgd2hlcmUgdXJsXG4gICAgICAgICAgLy8gc3RhcnRzIHdpdGggZG9tYWluIG5hbWUuIFNvIHdlIHByZXBlbmQgaHR0cDovLyBpbiB0aG9zZSBjYXNlcyxcbiAgICAgICAgICAvLyBhbmQgcmVtb3ZlIGl0IGFmdGVyd2FyZHMuXG4gICAgICAgICAgLy9cbiAgICAgICAgICBpZiAoIWxpbmtzW2xuXS5zY2hlbWEpIHtcbiAgICAgICAgICAgIHVybFRleHQgPSBzdGF0ZS5tZC5ub3JtYWxpemVMaW5rVGV4dCgnaHR0cDovLycgKyB1cmxUZXh0KS5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vLCAnJyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaW5rc1tsbl0uc2NoZW1hID09PSAnbWFpbHRvOicgJiYgIS9ebWFpbHRvOi9pLnRlc3QodXJsVGV4dCkpIHtcbiAgICAgICAgICAgIHVybFRleHQgPSBzdGF0ZS5tZC5ub3JtYWxpemVMaW5rVGV4dCgnbWFpbHRvOicgKyB1cmxUZXh0KS5yZXBsYWNlKC9ebWFpbHRvOi8sICcnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsVGV4dCA9IHN0YXRlLm1kLm5vcm1hbGl6ZUxpbmtUZXh0KHVybFRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBvcyA9IGxpbmtzW2xuXS5pbmRleDtcblxuICAgICAgICAgIGlmIChwb3MgPiBsYXN0UG9zKSB7XG4gICAgICAgICAgICB0b2tlbiAgICAgICAgID0gbmV3IHN0YXRlLlRva2VuKCd0ZXh0JywgJycsIDApO1xuICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHRleHQuc2xpY2UobGFzdFBvcywgcG9zKTtcbiAgICAgICAgICAgIHRva2VuLmxldmVsICAgPSBsZXZlbDtcbiAgICAgICAgICAgIG5vZGVzLnB1c2godG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRva2VuICAgICAgICAgPSBuZXcgc3RhdGUuVG9rZW4oJ2xpbmtfb3BlbicsICdhJywgMSk7XG4gICAgICAgICAgdG9rZW4uYXR0cnMgICA9IFsgWyAnaHJlZicsIGZ1bGxVcmwgXSBdO1xuICAgICAgICAgIHRva2VuLmxldmVsICAgPSBsZXZlbCsrO1xuICAgICAgICAgIHRva2VuLm1hcmt1cCAgPSAnbGlua2lmeSc7XG4gICAgICAgICAgdG9rZW4uaW5mbyAgICA9ICdhdXRvJztcbiAgICAgICAgICBub2Rlcy5wdXNoKHRva2VuKTtcblxuICAgICAgICAgIHRva2VuICAgICAgICAgPSBuZXcgc3RhdGUuVG9rZW4oJ3RleHQnLCAnJywgMCk7XG4gICAgICAgICAgdG9rZW4uY29udGVudCA9IHVybFRleHQ7XG4gICAgICAgICAgdG9rZW4ubGV2ZWwgICA9IGxldmVsO1xuICAgICAgICAgIG5vZGVzLnB1c2godG9rZW4pO1xuXG4gICAgICAgICAgdG9rZW4gICAgICAgICA9IG5ldyBzdGF0ZS5Ub2tlbignbGlua19jbG9zZScsICdhJywgLTEpO1xuICAgICAgICAgIHRva2VuLmxldmVsICAgPSAtLWxldmVsO1xuICAgICAgICAgIHRva2VuLm1hcmt1cCAgPSAnbGlua2lmeSc7XG4gICAgICAgICAgdG9rZW4uaW5mbyAgICA9ICdhdXRvJztcbiAgICAgICAgICBub2Rlcy5wdXNoKHRva2VuKTtcblxuICAgICAgICAgIGxhc3RQb3MgPSBsaW5rc1tsbl0ubGFzdEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0UG9zIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2tlbiAgICAgICAgID0gbmV3IHN0YXRlLlRva2VuKCd0ZXh0JywgJycsIDApO1xuICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSB0ZXh0LnNsaWNlKGxhc3RQb3MpO1xuICAgICAgICAgIHRva2VuLmxldmVsICAgPSBsZXZlbDtcbiAgICAgICAgICBub2Rlcy5wdXNoKHRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlcGxhY2UgY3VycmVudCBub2RlXG4gICAgICAgIGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuID0gdG9rZW5zID0gYXJyYXlSZXBsYWNlQXQodG9rZW5zLCBpLCBub2Rlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLy8gTm9ybWFsaXplIGlucHV0IHN0cmluZ1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFRBQlNfU0NBTl9SRSA9IC9bXFxuXFx0XS9nO1xudmFyIE5FV0xJTkVTX1JFICA9IC9cXHJbXFxuXFx1MDA4NV18W1xcdTI0MjRcXHUyMDI4XFx1MDA4NV0vZztcbnZhciBOVUxMX1JFICAgICAgPSAvXFx1MDAwMC9nO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5saW5lKHN0YXRlKSB7XG4gIHZhciBzdHIsIGxpbmVTdGFydCwgbGFzdFRhYlBvcztcblxuICAvLyBOb3JtYWxpemUgbmV3bGluZXNcbiAgc3RyID0gc3RhdGUuc3JjLnJlcGxhY2UoTkVXTElORVNfUkUsICdcXG4nKTtcblxuICAvLyBSZXBsYWNlIE5VTEwgY2hhcmFjdGVyc1xuICBzdHIgPSBzdHIucmVwbGFjZShOVUxMX1JFLCAnXFx1RkZGRCcpO1xuXG4gIC8vIFJlcGxhY2UgdGFicyB3aXRoIHByb3BlciBudW1iZXIgb2Ygc3BhY2VzICgxLi40KVxuICBpZiAoc3RyLmluZGV4T2YoJ1xcdCcpID49IDApIHtcbiAgICBsaW5lU3RhcnQgPSAwO1xuICAgIGxhc3RUYWJQb3MgPSAwO1xuXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoVEFCU19TQ0FOX1JFLCBmdW5jdGlvbiAobWF0Y2gsIG9mZnNldCkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChzdHIuY2hhckNvZGVBdChvZmZzZXQpID09PSAweDBBKSB7XG4gICAgICAgIGxpbmVTdGFydCA9IG9mZnNldCArIDE7XG4gICAgICAgIGxhc3RUYWJQb3MgPSAwO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSAnICAgICcuc2xpY2UoKG9mZnNldCAtIGxpbmVTdGFydCAtIGxhc3RUYWJQb3MpICUgNCk7XG4gICAgICBsYXN0VGFiUG9zID0gb2Zmc2V0IC0gbGluZVN0YXJ0ICsgMTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0ZS5zcmMgPSBzdHI7XG59O1xuIiwiLy8gU2ltcGxlIHR5cG9ncmFwaHljIHJlcGxhY2VtZW50c1xuLy9cbi8vICcnIOKGkiDigJjigJlcbi8vIFwiXCIg4oaSIOKAnOKAnS4gU2V0ICfCq8K7JyBmb3IgUnVzc2lhbiwgJ+KAnuKAnCcgZm9yIEdlcm1hbiwgZW1wdHkgdG8gZGlzYWJsZVxuLy8gKGMpIChDKSDihpIgwqlcbi8vICh0bSkgKFRNKSDihpIg4oSiXG4vLyAocikgKFIpIOKGkiDCrlxuLy8gKy0g4oaSIMKxXG4vLyAocCkgKFApIC0+IMKnXG4vLyAuLi4g4oaSIOKApiAoYWxzbyA/Li4uLiDihpIgPy4uLCAhLi4uLiDihpIgIS4uKVxuLy8gPz8/Pz8/Pz8g4oaSID8/PywgISEhISEg4oaSICEhISwgYCwsYCDihpIgYCxgXG4vLyAtLSDihpIgJm5kYXNoOywgLS0tIOKGkiAmbWRhc2g7XG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBUT0RPOlxuLy8gLSBmcmFjdGlvbmFscyAxLzIsIDEvNCwgMy80IC0+IMK9LCDCvCwgwr5cbi8vIC0gbWlsdGlwbGljYXRpb24gMiB4IDQgLT4gMiDDlyA0XG5cbnZhciBSQVJFX1JFID0gL1xcKy18XFwuXFwufFxcP1xcP1xcP1xcP3whISEhfCwsfC0tLztcblxudmFyIFNDT1BFRF9BQkJSX1JFID0gL1xcKChjfHRtfHJ8cClcXCkvaWc7XG52YXIgU0NPUEVEX0FCQlIgPSB7XG4gICdjJzogJ8KpJyxcbiAgJ3InOiAnwq4nLFxuICAncCc6ICfCpycsXG4gICd0bSc6ICfihKInXG59O1xuXG5mdW5jdGlvbiByZXBsYWNlRm4obWF0Y2gsIG5hbWUpIHtcbiAgcmV0dXJuIFNDT1BFRF9BQkJSW25hbWUudG9Mb3dlckNhc2UoKV07XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2Vfc2NvcGVkKGlubGluZVRva2Vucykge1xuICB2YXIgaSwgdG9rZW47XG5cbiAgZm9yIChpID0gaW5saW5lVG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdG9rZW4gPSBpbmxpbmVUb2tlbnNbaV07XG4gICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgdG9rZW4uY29udGVudCA9IHRva2VuLmNvbnRlbnQucmVwbGFjZShTQ09QRURfQUJCUl9SRSwgcmVwbGFjZUZuKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVwbGFjZV9yYXJlKGlubGluZVRva2Vucykge1xuICB2YXIgaSwgdG9rZW47XG5cbiAgZm9yIChpID0gaW5saW5lVG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdG9rZW4gPSBpbmxpbmVUb2tlbnNbaV07XG4gICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgaWYgKFJBUkVfUkUudGVzdCh0b2tlbi5jb250ZW50KSkge1xuICAgICAgICB0b2tlbi5jb250ZW50ID0gdG9rZW4uY29udGVudFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwrLS9nLCAnwrEnKVxuICAgICAgICAgICAgICAgICAgICAvLyAuLiwgLi4uLCAuLi4uLi4uIC0+IOKAplxuICAgICAgICAgICAgICAgICAgICAvLyBidXQgPy4uLi4uICYgIS4uLi4uIC0+ID8uLiAmICEuLlxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwuezIsfS9nLCAn4oCmJykucmVwbGFjZSgvKFs/IV0p4oCmL2csICckMS4uJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhbPyFdKXs0LH0vZywgJyQxJDEkMScpLnJlcGxhY2UoLyx7Mix9L2csICcsJylcbiAgICAgICAgICAgICAgICAgICAgLy8gZW0tZGFzaFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF58W14tXSktLS0oW14tXXwkKS9tZywgJyQxXFx1MjAxNCQyJylcbiAgICAgICAgICAgICAgICAgICAgLy8gZW4tZGFzaFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF58XFxzKS0tKFxcc3wkKS9tZywgJyQxXFx1MjAxMyQyJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhefFteLVxcc10pLS0oW14tXFxzXXwkKS9tZywgJyQxXFx1MjAxMyQyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBsYWNlKHN0YXRlKSB7XG4gIHZhciBibGtJZHg7XG5cbiAgaWYgKCFzdGF0ZS5tZC5vcHRpb25zLnR5cG9ncmFwaGVyKSB7IHJldHVybjsgfVxuXG4gIGZvciAoYmxrSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aCAtIDE7IGJsa0lkeCA+PSAwOyBibGtJZHgtLSkge1xuXG4gICAgaWYgKHN0YXRlLnRva2Vuc1tibGtJZHhdLnR5cGUgIT09ICdpbmxpbmUnKSB7IGNvbnRpbnVlOyB9XG5cbiAgICBpZiAoU0NPUEVEX0FCQlJfUkUudGVzdChzdGF0ZS50b2tlbnNbYmxrSWR4XS5jb250ZW50KSkge1xuICAgICAgcmVwbGFjZV9zY29wZWQoc3RhdGUudG9rZW5zW2Jsa0lkeF0uY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIGlmIChSQVJFX1JFLnRlc3Qoc3RhdGUudG9rZW5zW2Jsa0lkeF0uY29udGVudCkpIHtcbiAgICAgIHJlcGxhY2VfcmFyZShzdGF0ZS50b2tlbnNbYmxrSWR4XS5jaGlsZHJlbik7XG4gICAgfVxuXG4gIH1cbn07XG4iLCIvLyBDb252ZXJ0IHN0cmFpZ2h0IHF1b3RhdGlvbiBtYXJrcyB0byB0eXBvZ3JhcGhpYyBvbmVzXG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBpc1doaXRlU3BhY2UgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmlzV2hpdGVTcGFjZTtcbnZhciBpc1B1bmN0Q2hhciAgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmlzUHVuY3RDaGFyO1xudmFyIGlzTWRBc2NpaVB1bmN0ID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNNZEFzY2lpUHVuY3Q7XG5cbnZhciBRVU9URV9URVNUX1JFID0gL1snXCJdLztcbnZhciBRVU9URV9SRSA9IC9bJ1wiXS9nO1xudmFyIEFQT1NUUk9QSEUgPSAnXFx1MjAxOSc7IC8qIOKAmSAqL1xuXG5cbmZ1bmN0aW9uIHJlcGxhY2VBdChzdHIsIGluZGV4LCBjaCkge1xuICByZXR1cm4gc3RyLnN1YnN0cigwLCBpbmRleCkgKyBjaCArIHN0ci5zdWJzdHIoaW5kZXggKyAxKTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc19pbmxpbmVzKHRva2Vucywgc3RhdGUpIHtcbiAgdmFyIGksIHRva2VuLCB0ZXh0LCB0LCBwb3MsIG1heCwgdGhpc0xldmVsLCBpdGVtLCBsYXN0Q2hhciwgbmV4dENoYXIsXG4gICAgICBpc0xhc3RQdW5jdENoYXIsIGlzTmV4dFB1bmN0Q2hhciwgaXNMYXN0V2hpdGVTcGFjZSwgaXNOZXh0V2hpdGVTcGFjZSxcbiAgICAgIGNhbk9wZW4sIGNhbkNsb3NlLCBqLCBpc1NpbmdsZSwgc3RhY2s7XG5cbiAgc3RhY2sgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICBpZiAodG9rZW4udHlwZSAhPT0gJ3RleHQnIHx8IFFVT1RFX1RFU1RfUkUudGVzdCh0b2tlbi50ZXh0KSkgeyBjb250aW51ZTsgfVxuXG4gICAgdGhpc0xldmVsID0gdG9rZW5zW2ldLmxldmVsO1xuXG4gICAgZm9yIChqID0gc3RhY2subGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgIGlmIChzdGFja1tqXS5sZXZlbCA8PSB0aGlzTGV2ZWwpIHsgYnJlYWs7IH1cbiAgICB9XG4gICAgc3RhY2subGVuZ3RoID0gaiArIDE7XG5cbiAgICB0ZXh0ID0gdG9rZW4uY29udGVudDtcbiAgICBwb3MgPSAwO1xuICAgIG1heCA9IHRleHQubGVuZ3RoO1xuXG4gICAgLyplc2xpbnQgbm8tbGFiZWxzOjAsYmxvY2stc2NvcGVkLXZhcjowKi9cbiAgICBPVVRFUjpcbiAgICB3aGlsZSAocG9zIDwgbWF4KSB7XG4gICAgICBRVU9URV9SRS5sYXN0SW5kZXggPSBwb3M7XG4gICAgICB0ID0gUVVPVEVfUkUuZXhlYyh0ZXh0KTtcbiAgICAgIGlmICghdCkgeyBicmVhazsgfVxuXG4gICAgICBjYW5PcGVuID0gY2FuQ2xvc2UgPSB0cnVlO1xuICAgICAgcG9zID0gdC5pbmRleCArIDE7XG4gICAgICBpc1NpbmdsZSA9ICh0WzBdID09PSBcIidcIik7XG5cbiAgICAgIC8vIHRyZWF0IGJlZ2luL2VuZCBvZiB0aGUgbGluZSBhcyBhIHdoaXRlc3BhY2VcbiAgICAgIGxhc3RDaGFyID0gdC5pbmRleCAtIDEgPj0gMCA/IHRleHQuY2hhckNvZGVBdCh0LmluZGV4IC0gMSkgOiAweDIwO1xuICAgICAgbmV4dENoYXIgPSBwb3MgPCBtYXggPyB0ZXh0LmNoYXJDb2RlQXQocG9zKSA6IDB4MjA7XG5cbiAgICAgIGlzTGFzdFB1bmN0Q2hhciA9IGlzTWRBc2NpaVB1bmN0KGxhc3RDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGxhc3RDaGFyKSk7XG4gICAgICBpc05leHRQdW5jdENoYXIgPSBpc01kQXNjaWlQdW5jdChuZXh0Q2hhcikgfHwgaXNQdW5jdENoYXIoU3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Q2hhcikpO1xuXG4gICAgICBpc0xhc3RXaGl0ZVNwYWNlID0gaXNXaGl0ZVNwYWNlKGxhc3RDaGFyKTtcbiAgICAgIGlzTmV4dFdoaXRlU3BhY2UgPSBpc1doaXRlU3BhY2UobmV4dENoYXIpO1xuXG4gICAgICBpZiAoaXNOZXh0V2hpdGVTcGFjZSkge1xuICAgICAgICBjYW5PcGVuID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzTmV4dFB1bmN0Q2hhcikge1xuICAgICAgICBpZiAoIShpc0xhc3RXaGl0ZVNwYWNlIHx8IGlzTGFzdFB1bmN0Q2hhcikpIHtcbiAgICAgICAgICBjYW5PcGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzTGFzdFdoaXRlU3BhY2UpIHtcbiAgICAgICAgY2FuQ2xvc2UgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNMYXN0UHVuY3RDaGFyKSB7XG4gICAgICAgIGlmICghKGlzTmV4dFdoaXRlU3BhY2UgfHwgaXNOZXh0UHVuY3RDaGFyKSkge1xuICAgICAgICAgIGNhbkNsb3NlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRDaGFyID09PSAweDIyIC8qIFwiICovICYmIHRbMF0gPT09ICdcIicpIHtcbiAgICAgICAgaWYgKGxhc3RDaGFyID49IDB4MzAgLyogMCAqLyAmJiBsYXN0Q2hhciA8PSAweDM5IC8qIDkgKi8pIHtcbiAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IDFcIlwiIC0gY291bnQgZmlyc3QgcXVvdGUgYXMgYW4gaW5jaFxuICAgICAgICAgIGNhbkNsb3NlID0gY2FuT3BlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjYW5PcGVuICYmIGNhbkNsb3NlKSB7XG4gICAgICAgIC8vIHRyZWF0IHRoaXMgYXMgdGhlIG1pZGRsZSBvZiB0aGUgd29yZFxuICAgICAgICBjYW5PcGVuID0gZmFsc2U7XG4gICAgICAgIGNhbkNsb3NlID0gaXNOZXh0UHVuY3RDaGFyO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWNhbk9wZW4gJiYgIWNhbkNsb3NlKSB7XG4gICAgICAgIC8vIG1pZGRsZSBvZiB3b3JkXG4gICAgICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSByZXBsYWNlQXQodG9rZW4uY29udGVudCwgdC5pbmRleCwgQVBPU1RST1BIRSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYW5DbG9zZSkge1xuICAgICAgICAvLyB0aGlzIGNvdWxkIGJlIGEgY2xvc2luZyBxdW90ZSwgcmV3aW5kIHRoZSBzdGFjayB0byBnZXQgYSBtYXRjaFxuICAgICAgICBmb3IgKGogPSBzdGFjay5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgIGl0ZW0gPSBzdGFja1tqXTtcbiAgICAgICAgICBpZiAoc3RhY2tbal0ubGV2ZWwgPCB0aGlzTGV2ZWwpIHsgYnJlYWs7IH1cbiAgICAgICAgICBpZiAoaXRlbS5zaW5nbGUgPT09IGlzU2luZ2xlICYmIHN0YWNrW2pdLmxldmVsID09PSB0aGlzTGV2ZWwpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBzdGFja1tqXTtcbiAgICAgICAgICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCA9IHJlcGxhY2VBdChcbiAgICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCwgaXRlbS5wb3MsIHN0YXRlLm1kLm9wdGlvbnMucXVvdGVzWzJdKTtcbiAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdChcbiAgICAgICAgICAgICAgICB0b2tlbi5jb250ZW50LCB0LmluZGV4LCBzdGF0ZS5tZC5vcHRpb25zLnF1b3Rlc1szXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCA9IHJlcGxhY2VBdChcbiAgICAgICAgICAgICAgICB0b2tlbnNbaXRlbS50b2tlbl0uY29udGVudCwgaXRlbS5wb3MsIHN0YXRlLm1kLm9wdGlvbnMucXVvdGVzWzBdKTtcbiAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdCh0b2tlbi5jb250ZW50LCB0LmluZGV4LCBzdGF0ZS5tZC5vcHRpb25zLnF1b3Rlc1sxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFjay5sZW5ndGggPSBqO1xuICAgICAgICAgICAgY29udGludWUgT1VURVI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjYW5PcGVuKSB7XG4gICAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICAgIHRva2VuOiBpLFxuICAgICAgICAgIHBvczogdC5pbmRleCxcbiAgICAgICAgICBzaW5nbGU6IGlzU2luZ2xlLFxuICAgICAgICAgIGxldmVsOiB0aGlzTGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGNhbkNsb3NlICYmIGlzU2luZ2xlKSB7XG4gICAgICAgIHRva2VuLmNvbnRlbnQgPSByZXBsYWNlQXQodG9rZW4uY29udGVudCwgdC5pbmRleCwgQVBPU1RST1BIRSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzbWFydHF1b3RlcyhzdGF0ZSkge1xuICAvKmVzbGludCBtYXgtZGVwdGg6MCovXG4gIHZhciBibGtJZHg7XG5cbiAgaWYgKCFzdGF0ZS5tZC5vcHRpb25zLnR5cG9ncmFwaGVyKSB7IHJldHVybjsgfVxuXG4gIGZvciAoYmxrSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aCAtIDE7IGJsa0lkeCA+PSAwOyBibGtJZHgtLSkge1xuXG4gICAgaWYgKHN0YXRlLnRva2Vuc1tibGtJZHhdLnR5cGUgIT09ICdpbmxpbmUnIHx8XG4gICAgICAgICFRVU9URV9URVNUX1JFLnRlc3Qoc3RhdGUudG9rZW5zW2Jsa0lkeF0uY29udGVudCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHByb2Nlc3NfaW5saW5lcyhzdGF0ZS50b2tlbnNbYmxrSWR4XS5jaGlsZHJlbiwgc3RhdGUpO1xuICB9XG59O1xuIiwiLy8gQ29yZSBzdGF0ZSBvYmplY3Rcbi8vXG4ndXNlIHN0cmljdCc7XG5cbnZhciBUb2tlbiA9IHJlcXVpcmUoJy4uL3Rva2VuJyk7XG5cblxuZnVuY3Rpb24gU3RhdGVDb3JlKHNyYywgbWQsIGVudikge1xuICB0aGlzLnNyYyA9IHNyYztcbiAgdGhpcy5lbnYgPSBlbnY7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMuaW5saW5lTW9kZSA9IGZhbHNlO1xuICB0aGlzLm1kID0gbWQ7IC8vIGxpbmsgdG8gcGFyc2VyIGluc3RhbmNlXG59XG5cbi8vIHJlLWV4cG9ydCBUb2tlbiBjbGFzcyB0byB1c2UgaW4gY29yZSBydWxlc1xuU3RhdGVDb3JlLnByb3RvdHlwZS5Ub2tlbiA9IFRva2VuO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVDb3JlO1xuIiwiLy8gUHJvY2VzcyBhdXRvbGlua3MgJzxwcm90b2NvbDouLi4+J1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1cmxfc2NoZW1hcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi91cmxfc2NoZW1hcycpO1xuXG5cbi8qZXNsaW50IG1heC1sZW46MCovXG52YXIgRU1BSUxfUkUgICAgPSAvXjwoW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKik+LztcbnZhciBBVVRPTElOS19SRSA9IC9ePChbYS16QS1aLlxcLV17MSwyNX0pOihbXjw+XFx4MDAtXFx4MjBdKik+LztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF1dG9saW5rKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIHRhaWwsIGxpbmtNYXRjaCwgZW1haWxNYXRjaCwgdXJsLCBmdWxsVXJsLCB0b2tlbixcbiAgICAgIHBvcyA9IHN0YXRlLnBvcztcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgzQy8qIDwgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgdGFpbCA9IHN0YXRlLnNyYy5zbGljZShwb3MpO1xuXG4gIGlmICh0YWlsLmluZGV4T2YoJz4nKSA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKEFVVE9MSU5LX1JFLnRlc3QodGFpbCkpIHtcbiAgICBsaW5rTWF0Y2ggPSB0YWlsLm1hdGNoKEFVVE9MSU5LX1JFKTtcblxuICAgIGlmICh1cmxfc2NoZW1hcy5pbmRleE9mKGxpbmtNYXRjaFsxXS50b0xvd2VyQ2FzZSgpKSA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICB1cmwgPSBsaW5rTWF0Y2hbMF0uc2xpY2UoMSwgLTEpO1xuICAgIGZ1bGxVcmwgPSBzdGF0ZS5tZC5ub3JtYWxpemVMaW5rKHVybCk7XG4gICAgaWYgKCFzdGF0ZS5tZC52YWxpZGF0ZUxpbmsoZnVsbFVybCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgdG9rZW4gICAgICAgICA9IHN0YXRlLnB1c2goJ2xpbmtfb3BlbicsICdhJywgMSk7XG4gICAgICB0b2tlbi5hdHRycyAgID0gWyBbICdocmVmJywgZnVsbFVybCBdIF07XG5cbiAgICAgIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCd0ZXh0JywgJycsIDApO1xuICAgICAgdG9rZW4uY29udGVudCA9IHN0YXRlLm1kLm5vcm1hbGl6ZUxpbmtUZXh0KHVybCk7XG5cbiAgICAgIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCdsaW5rX2Nsb3NlJywgJ2EnLCAtMSk7XG4gICAgfVxuXG4gICAgc3RhdGUucG9zICs9IGxpbmtNYXRjaFswXS5sZW5ndGg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoRU1BSUxfUkUudGVzdCh0YWlsKSkge1xuICAgIGVtYWlsTWF0Y2ggPSB0YWlsLm1hdGNoKEVNQUlMX1JFKTtcblxuICAgIHVybCA9IGVtYWlsTWF0Y2hbMF0uc2xpY2UoMSwgLTEpO1xuICAgIGZ1bGxVcmwgPSBzdGF0ZS5tZC5ub3JtYWxpemVMaW5rKCdtYWlsdG86JyArIHVybCk7XG4gICAgaWYgKCFzdGF0ZS5tZC52YWxpZGF0ZUxpbmsoZnVsbFVybCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgdG9rZW4gICAgICAgICA9IHN0YXRlLnB1c2goJ2xpbmtfb3BlbicsICdhJywgMSk7XG4gICAgICB0b2tlbi5hdHRycyAgID0gWyBbICdocmVmJywgZnVsbFVybCBdIF07XG4gICAgICB0b2tlbi5tYXJrdXAgID0gJ2F1dG9saW5rJztcbiAgICAgIHRva2VuLmluZm8gICAgPSAnYXV0byc7XG5cbiAgICAgIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCd0ZXh0JywgJycsIDApO1xuICAgICAgdG9rZW4uY29udGVudCA9IHN0YXRlLm1kLm5vcm1hbGl6ZUxpbmtUZXh0KHVybCk7XG5cbiAgICAgIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCdsaW5rX2Nsb3NlJywgJ2EnLCAtMSk7XG4gICAgICB0b2tlbi5tYXJrdXAgID0gJ2F1dG9saW5rJztcbiAgICAgIHRva2VuLmluZm8gICAgPSAnYXV0byc7XG4gICAgfVxuXG4gICAgc3RhdGUucG9zICs9IGVtYWlsTWF0Y2hbMF0ubGVuZ3RoO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8vIFBhcnNlIGJhY2t0aWNrc1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFja3RpY2soc3RhdGUsIHNpbGVudCkge1xuICB2YXIgc3RhcnQsIG1heCwgbWFya2VyLCBtYXRjaFN0YXJ0LCBtYXRjaEVuZCwgdG9rZW4sXG4gICAgICBwb3MgPSBzdGF0ZS5wb3MsXG4gICAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKGNoICE9PSAweDYwLyogYCAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdGFydCA9IHBvcztcbiAgcG9zKys7XG4gIG1heCA9IHN0YXRlLnBvc01heDtcblxuICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4NjAvKiBgICovKSB7IHBvcysrOyB9XG5cbiAgbWFya2VyID0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0LCBwb3MpO1xuXG4gIG1hdGNoU3RhcnQgPSBtYXRjaEVuZCA9IHBvcztcblxuICB3aGlsZSAoKG1hdGNoU3RhcnQgPSBzdGF0ZS5zcmMuaW5kZXhPZignYCcsIG1hdGNoRW5kKSkgIT09IC0xKSB7XG4gICAgbWF0Y2hFbmQgPSBtYXRjaFN0YXJ0ICsgMTtcblxuICAgIHdoaWxlIChtYXRjaEVuZCA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChtYXRjaEVuZCkgPT09IDB4NjAvKiBgICovKSB7IG1hdGNoRW5kKys7IH1cblxuICAgIGlmIChtYXRjaEVuZCAtIG1hdGNoU3RhcnQgPT09IG1hcmtlci5sZW5ndGgpIHtcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRva2VuICAgICAgICAgPSBzdGF0ZS5wdXNoKCdjb2RlX2lubGluZScsICdjb2RlJywgMCk7XG4gICAgICAgIHRva2VuLm1hcmt1cCAgPSBtYXJrZXI7XG4gICAgICAgIHRva2VuLmNvbnRlbnQgPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXRjaFN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1sgXFxuXSsvZywgJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgIH1cbiAgICAgIHN0YXRlLnBvcyA9IG1hdGNoRW5kO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBtYXJrZXI7IH1cbiAgc3RhdGUucG9zICs9IG1hcmtlci5sZW5ndGg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgKnRoaXMqIGFuZCBfdGhhdF9cbi8vXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIGlzV2hpdGVTcGFjZSAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNXaGl0ZVNwYWNlO1xudmFyIGlzUHVuY3RDaGFyICAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNQdW5jdENoYXI7XG52YXIgaXNNZEFzY2lpUHVuY3QgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc01kQXNjaWlQdW5jdDtcblxuXG4vLyBwYXJzZSBzZXF1ZW5jZSBvZiBlbXBoYXNpcyBtYXJrZXJzLFxuLy8gXCJzdGFydFwiIHNob3VsZCBwb2ludCBhdCBhIHZhbGlkIG1hcmtlclxuZnVuY3Rpb24gc2NhbkRlbGltcyhzdGF0ZSwgc3RhcnQpIHtcbiAgdmFyIHBvcyA9IHN0YXJ0LCBsYXN0Q2hhciwgbmV4dENoYXIsIGNvdW50LFxuICAgICAgaXNMYXN0V2hpdGVTcGFjZSwgaXNMYXN0UHVuY3RDaGFyLFxuICAgICAgaXNOZXh0V2hpdGVTcGFjZSwgaXNOZXh0UHVuY3RDaGFyLFxuICAgICAgY2FuX29wZW4gPSB0cnVlLFxuICAgICAgY2FuX2Nsb3NlID0gdHJ1ZSxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0KTtcblxuICAvLyB0cmVhdCBiZWdpbm5pbmcgb2YgdGhlIGxpbmUgYXMgYSB3aGl0ZXNwYWNlXG4gIGxhc3RDaGFyID0gc3RhcnQgPiAwID8gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQgLSAxKSA6IDB4MjA7XG5cbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSBtYXJrZXIpIHsgcG9zKys7IH1cblxuICBpZiAocG9zID49IG1heCkge1xuICAgIGNhbl9vcGVuID0gZmFsc2U7XG4gIH1cblxuICBjb3VudCA9IHBvcyAtIHN0YXJ0O1xuXG4gIC8vIHRyZWF0IGVuZCBvZiB0aGUgbGluZSBhcyBhIHdoaXRlc3BhY2VcbiAgbmV4dENoYXIgPSBwb3MgPCBtYXggPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpIDogMHgyMDtcblxuICBpc0xhc3RQdW5jdENoYXIgPSBpc01kQXNjaWlQdW5jdChsYXN0Q2hhcikgfHwgaXNQdW5jdENoYXIoU3RyaW5nLmZyb21DaGFyQ29kZShsYXN0Q2hhcikpO1xuICBpc05leHRQdW5jdENoYXIgPSBpc01kQXNjaWlQdW5jdChuZXh0Q2hhcikgfHwgaXNQdW5jdENoYXIoU3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Q2hhcikpO1xuXG4gIGlzTGFzdFdoaXRlU3BhY2UgPSBpc1doaXRlU3BhY2UobGFzdENoYXIpO1xuICBpc05leHRXaGl0ZVNwYWNlID0gaXNXaGl0ZVNwYWNlKG5leHRDaGFyKTtcblxuICBpZiAoaXNOZXh0V2hpdGVTcGFjZSkge1xuICAgIGNhbl9vcGVuID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNOZXh0UHVuY3RDaGFyKSB7XG4gICAgaWYgKCEoaXNMYXN0V2hpdGVTcGFjZSB8fCBpc0xhc3RQdW5jdENoYXIpKSB7XG4gICAgICBjYW5fb3BlbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc0xhc3RXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX2Nsb3NlID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNMYXN0UHVuY3RDaGFyKSB7XG4gICAgaWYgKCEoaXNOZXh0V2hpdGVTcGFjZSB8fCBpc05leHRQdW5jdENoYXIpKSB7XG4gICAgICBjYW5fY2xvc2UgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAobWFya2VyID09PSAweDVGIC8qIF8gKi8pIHtcbiAgICBpZiAoY2FuX29wZW4gJiYgY2FuX2Nsb3NlKSB7XG4gICAgICAvLyBcIl9cIiBpbnNpZGUgYSB3b3JkIGNhbiBuZWl0aGVyIG9wZW4gbm9yIGNsb3NlIGFuIGVtcGhhc2lzXG4gICAgICBjYW5fb3BlbiA9IGZhbHNlO1xuICAgICAgY2FuX2Nsb3NlID0gaXNOZXh0UHVuY3RDaGFyO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2FuX29wZW46IGNhbl9vcGVuLFxuICAgIGNhbl9jbG9zZTogY2FuX2Nsb3NlLFxuICAgIGRlbGltczogY291bnRcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbXBoYXNpcyhzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBzdGFydENvdW50LFxuICAgICAgY291bnQsXG4gICAgICBmb3VuZCxcbiAgICAgIG9sZENvdW50LFxuICAgICAgbmV3Q291bnQsXG4gICAgICBzdGFjayxcbiAgICAgIHJlcyxcbiAgICAgIHRva2VuLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3MsXG4gICAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHg1Ri8qIF8gKi8gJiYgbWFya2VyICE9PSAweDJBIC8qICogKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIGRvbid0IHJ1biBhbnkgcGFpcnMgaW4gdmFsaWRhdGlvbiBtb2RlXG5cbiAgcmVzID0gc2NhbkRlbGltcyhzdGF0ZSwgc3RhcnQpO1xuICBzdGFydENvdW50ID0gcmVzLmRlbGltcztcbiAgaWYgKCFyZXMuY2FuX29wZW4pIHtcbiAgICBzdGF0ZS5wb3MgKz0gc3RhcnRDb3VudDtcbiAgICAvLyBFYXJsaWVyIHdlIGNoZWNrZWQgIXNpbGVudCwgYnV0IHRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgbmVlZCBpdFxuICAgIHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0LCBzdGF0ZS5wb3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGUucG9zID0gc3RhcnQgKyBzdGFydENvdW50O1xuICBzdGFjayA9IFsgc3RhcnRDb3VudCBdO1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKSA9PT0gbWFya2VyKSB7XG4gICAgICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGF0ZS5wb3MpO1xuICAgICAgY291bnQgPSByZXMuZGVsaW1zO1xuICAgICAgaWYgKHJlcy5jYW5fY2xvc2UpIHtcbiAgICAgICAgb2xkQ291bnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgbmV3Q291bnQgPSBjb3VudDtcblxuICAgICAgICB3aGlsZSAob2xkQ291bnQgIT09IG5ld0NvdW50KSB7XG4gICAgICAgICAgaWYgKG5ld0NvdW50IDwgb2xkQ291bnQpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2gob2xkQ291bnQgLSBuZXdDb3VudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBhc3NlcnQobmV3Q291bnQgPiBvbGRDb3VudClcbiAgICAgICAgICBuZXdDb3VudCAtPSBvbGRDb3VudDtcblxuICAgICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDApIHsgYnJlYWs7IH1cbiAgICAgICAgICBzdGF0ZS5wb3MgKz0gb2xkQ291bnQ7XG4gICAgICAgICAgb2xkQ291bnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBzdGFydENvdW50ID0gb2xkQ291bnQ7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLnBvcyArPSBjb3VudDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXMuY2FuX29wZW4pIHsgc3RhY2sucHVzaChjb3VudCk7IH1cbiAgICAgIHN0YXRlLnBvcyArPSBjb3VudDtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHN0YXRlLm1kLmlubGluZS5za2lwVG9rZW4oc3RhdGUpO1xuICB9XG5cbiAgaWYgKCFmb3VuZCkge1xuICAgIC8vIHBhcnNlciBmYWlsZWQgdG8gZmluZCBlbmRpbmcgdGFnLCBzbyBpdCdzIG5vdCB2YWxpZCBlbXBoYXNpc1xuICAgIHN0YXRlLnBvcyA9IHN0YXJ0O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGZvdW5kIVxuICBzdGF0ZS5wb3NNYXggPSBzdGF0ZS5wb3M7XG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgc3RhcnRDb3VudDtcblxuICAvLyBFYXJsaWVyIHdlIGNoZWNrZWQgIXNpbGVudCwgYnV0IHRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgbmVlZCBpdFxuXG4gIC8vIHdlIGhhdmUgYHN0YXJ0Q291bnRgIHN0YXJ0aW5nIGFuZCBlbmRpbmcgbWFya2VycyxcbiAgLy8gbm93IHRyeWluZyB0byBzZXJpYWxpemUgdGhlbSBpbnRvIHRva2Vuc1xuICBmb3IgKGNvdW50ID0gc3RhcnRDb3VudDsgY291bnQgPiAxOyBjb3VudCAtPSAyKSB7XG4gICAgdG9rZW4gICAgICAgID0gc3RhdGUucHVzaCgnc3Ryb25nX29wZW4nLCAnc3Ryb25nJywgMSk7XG4gICAgdG9rZW4ubWFya3VwID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpICsgU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpO1xuICB9XG4gIGlmIChjb3VudCAlIDIpIHtcbiAgICB0b2tlbiAgICAgICAgPSBzdGF0ZS5wdXNoKCdlbV9vcGVuJywgJ2VtJywgMSk7XG4gICAgdG9rZW4ubWFya3VwID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpO1xuICB9XG5cbiAgc3RhdGUubWQuaW5saW5lLnRva2VuaXplKHN0YXRlKTtcblxuICBpZiAoY291bnQgJSAyKSB7XG4gICAgdG9rZW4gICAgICAgID0gc3RhdGUucHVzaCgnZW1fY2xvc2UnLCAnZW0nLCAtMSk7XG4gICAgdG9rZW4ubWFya3VwID0gU3RyaW5nLmZyb21DaGFyQ29kZShtYXJrZXIpO1xuICB9XG4gIGZvciAoY291bnQgPSBzdGFydENvdW50OyBjb3VudCA+IDE7IGNvdW50IC09IDIpIHtcbiAgICB0b2tlbiAgICAgICAgPSBzdGF0ZS5wdXNoKCdzdHJvbmdfY2xvc2UnLCAnc3Ryb25nJywgLTEpO1xuICAgIHRva2VuLm1hcmt1cCA9IFN0cmluZy5mcm9tQ2hhckNvZGUobWFya2VyKSArIFN0cmluZy5mcm9tQ2hhckNvZGUobWFya2VyKTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHN0YXRlLnBvc01heCArIHN0YXJ0Q291bnQ7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBodG1sIGVudGl0eSAtICYjMTIzOywgJiN4QUY7LCAmcXVvdDssIC4uLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbnRpdGllcyAgICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi9lbnRpdGllcycpO1xudmFyIGhhcyAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaGFzO1xudmFyIGlzVmFsaWRFbnRpdHlDb2RlID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNWYWxpZEVudGl0eUNvZGU7XG52YXIgZnJvbUNvZGVQb2ludCAgICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5mcm9tQ29kZVBvaW50O1xuXG5cbnZhciBESUdJVEFMX1JFID0gL14mIygoPzp4W2EtZjAtOV17MSw4fXxbMC05XXsxLDh9KSk7L2k7XG52YXIgTkFNRURfUkUgICA9IC9eJihbYS16XVthLXowLTldezEsMzF9KTsvaTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVudGl0eShzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgY29kZSwgbWF0Y2gsIHBvcyA9IHN0YXRlLnBvcywgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDI2LyogJiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAocG9zICsgMSA8IG1heCkge1xuICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSk7XG5cbiAgICBpZiAoY2ggPT09IDB4MjMgLyogIyAqLykge1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChESUdJVEFMX1JFKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgIGNvZGUgPSBtYXRjaFsxXVswXS50b0xvd2VyQ2FzZSgpID09PSAneCcgPyBwYXJzZUludChtYXRjaFsxXS5zbGljZSgxKSwgMTYpIDogcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICBzdGF0ZS5wZW5kaW5nICs9IGlzVmFsaWRFbnRpdHlDb2RlKGNvZGUpID8gZnJvbUNvZGVQb2ludChjb2RlKSA6IGZyb21Db2RlUG9pbnQoMHhGRkZEKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5wb3MgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChOQU1FRF9SRSk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgaWYgKGhhcyhlbnRpdGllcywgbWF0Y2hbMV0pKSB7XG4gICAgICAgICAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBlbnRpdGllc1ttYXRjaFsxXV07IH1cbiAgICAgICAgICBzdGF0ZS5wb3MgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSAnJic7IH1cbiAgc3RhdGUucG9zKys7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2NlZXNzIGVzY2FwZWQgY2hhcnMgYW5kIGhhcmRicmVha3NcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVNDQVBFRCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7IEVTQ0FQRUQucHVzaCgwKTsgfVxuXG4nXFxcXCFcIiMkJSZcXCcoKSorLC4vOjs8PT4/QFtdXl9ge3x9fi0nXG4gIC5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihjaCkgeyBFU0NBUEVEW2NoLmNoYXJDb2RlQXQoMCldID0gMTsgfSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlc2NhcGUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgY2gsIHBvcyA9IHN0YXRlLnBvcywgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDVDLyogXFwgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zKys7XG5cbiAgaWYgKHBvcyA8IG1heCkge1xuICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICAgIGlmIChjaCA8IDI1NiAmJiBFU0NBUEVEW2NoXSAhPT0gMCkge1xuICAgICAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmNbcG9zXTsgfVxuICAgICAgc3RhdGUucG9zICs9IDI7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2ggPT09IDB4MEEpIHtcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHN0YXRlLnB1c2goJ2hhcmRicmVhaycsICdicicsIDApO1xuICAgICAgfVxuXG4gICAgICBwb3MrKztcbiAgICAgIC8vIHNraXAgbGVhZGluZyB3aGl0ZXNwYWNlcyBmcm9tIG5leHQgbGluZVxuICAgICAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDIwKSB7IHBvcysrOyB9XG5cbiAgICAgIHN0YXRlLnBvcyA9IHBvcztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gJ1xcXFwnOyB9XG4gIHN0YXRlLnBvcysrO1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZXNzIGh0bWwgdGFnc1xuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIEhUTUxfVEFHX1JFID0gcmVxdWlyZSgnLi4vY29tbW9uL2h0bWxfcmUnKS5IVE1MX1RBR19SRTtcblxuXG5mdW5jdGlvbiBpc0xldHRlcihjaCkge1xuICAvKmVzbGludCBuby1iaXR3aXNlOjAqL1xuICB2YXIgbGMgPSBjaCB8IDB4MjA7IC8vIHRvIGxvd2VyIGNhc2VcbiAgcmV0dXJuIChsYyA+PSAweDYxLyogYSAqLykgJiYgKGxjIDw9IDB4N2EvKiB6ICovKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh0bWxfaW5saW5lKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIGNoLCBtYXRjaCwgbWF4LCB0b2tlbixcbiAgICAgIHBvcyA9IHN0YXRlLnBvcztcblxuICBpZiAoIXN0YXRlLm1kLm9wdGlvbnMuaHRtbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBDaGVjayBzdGFydFxuICBtYXggPSBzdGF0ZS5wb3NNYXg7XG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDNDLyogPCAqLyB8fFxuICAgICAgcG9zICsgMiA+PSBtYXgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBRdWljayBmYWlsIG9uIHNlY29uZCBjaGFyXG4gIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSk7XG4gIGlmIChjaCAhPT0gMHgyMS8qICEgKi8gJiZcbiAgICAgIGNoICE9PSAweDNGLyogPyAqLyAmJlxuICAgICAgY2ggIT09IDB4MkYvKiAvICovICYmXG4gICAgICAhaXNMZXR0ZXIoY2gpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChIVE1MX1RBR19SRSk7XG4gIGlmICghbWF0Y2gpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICB0b2tlbiAgICAgICAgID0gc3RhdGUucHVzaCgnaHRtbF9pbmxpbmUnLCAnJywgMCk7XG4gICAgdG9rZW4uY29udGVudCA9IHN0YXRlLnNyYy5zbGljZShwb3MsIHBvcyArIG1hdGNoWzBdLmxlbmd0aCk7XG4gIH1cbiAgc3RhdGUucG9zICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyAhW2ltYWdlXSg8c3JjPiBcInRpdGxlXCIpXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlTGlua0xhYmVsICAgICAgID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2xhYmVsJyk7XG52YXIgcGFyc2VMaW5rRGVzdGluYXRpb24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfZGVzdGluYXRpb24nKTtcbnZhciBwYXJzZUxpbmtUaXRsZSAgICAgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua190aXRsZScpO1xudmFyIG5vcm1hbGl6ZVJlZmVyZW5jZSAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykubm9ybWFsaXplUmVmZXJlbmNlO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW1hZ2Uoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgYXR0cnMsXG4gICAgICBjb2RlLFxuICAgICAgbGFiZWwsXG4gICAgICBsYWJlbEVuZCxcbiAgICAgIGxhYmVsU3RhcnQsXG4gICAgICBwb3MsXG4gICAgICByZWYsXG4gICAgICByZXMsXG4gICAgICB0aXRsZSxcbiAgICAgIHRva2VuLFxuICAgICAgdG9rZW5zLFxuICAgICAgc3RhcnQsXG4gICAgICBocmVmID0gJycsXG4gICAgICBvbGRQb3MgPSBzdGF0ZS5wb3MsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcykgIT09IDB4MjEvKiAhICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zICsgMSkgIT09IDB4NUIvKiBbICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhYmVsU3RhcnQgPSBzdGF0ZS5wb3MgKyAyO1xuICBsYWJlbEVuZCA9IHBhcnNlTGlua0xhYmVsKHN0YXRlLCBzdGF0ZS5wb3MgKyAxLCBmYWxzZSk7XG5cbiAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kICddJywgc28gaXQncyBub3QgYSB2YWxpZCBsaW5rXG4gIGlmIChsYWJlbEVuZCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gbGFiZWxFbmQgKyAxO1xuICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjgvKiAoICovKSB7XG4gICAgLy9cbiAgICAvLyBJbmxpbmUgbGlua1xuICAgIC8vXG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICBeXiBza2lwcGluZyB0aGVzZSBzcGFjZXNcbiAgICBwb3MrKztcbiAgICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgfVxuICAgIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAvLyAgICAgICAgICBeXl5eXl4gcGFyc2luZyBsaW5rIGRlc3RpbmF0aW9uXG4gICAgc3RhcnQgPSBwb3M7XG4gICAgcmVzID0gcGFyc2VMaW5rRGVzdGluYXRpb24oc3RhdGUuc3JjLCBwb3MsIHN0YXRlLnBvc01heCk7XG4gICAgaWYgKHJlcy5vaykge1xuICAgICAgaHJlZiA9IHN0YXRlLm1kLm5vcm1hbGl6ZUxpbmsocmVzLnN0cik7XG4gICAgICBpZiAoc3RhdGUubWQudmFsaWRhdGVMaW5rKGhyZWYpKSB7XG4gICAgICAgIHBvcyA9IHJlcy5wb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBocmVmID0gJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAvLyAgICAgICAgICAgICAgICBeXiBza2lwcGluZyB0aGVzZSBzcGFjZXNcbiAgICBzdGFydCA9IHBvcztcbiAgICBmb3IgKDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgfVxuXG4gICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAvLyAgICAgICAgICAgICAgICAgIF5eXl5eXl4gcGFyc2luZyBsaW5rIHRpdGxlXG4gICAgcmVzID0gcGFyc2VMaW5rVGl0bGUoc3RhdGUuc3JjLCBwb3MsIHN0YXRlLnBvc01heCk7XG4gICAgaWYgKHBvcyA8IG1heCAmJiBzdGFydCAhPT0gcG9zICYmIHJlcy5vaykge1xuICAgICAgdGl0bGUgPSByZXMuc3RyO1xuICAgICAgcG9zID0gcmVzLnBvcztcblxuICAgICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIF5eIHNraXBwaW5nIHRoZXNlIHNwYWNlc1xuICAgICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGUgPSAnJztcbiAgICB9XG5cbiAgICBpZiAocG9zID49IG1heCB8fCBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDI5LyogKSAqLykge1xuICAgICAgc3RhdGUucG9zID0gb2xkUG9zO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwb3MrKztcbiAgfSBlbHNlIHtcbiAgICAvL1xuICAgIC8vIExpbmsgcmVmZXJlbmNlXG4gICAgLy9cbiAgICBpZiAodHlwZW9mIHN0YXRlLmVudi5yZWZlcmVuY2VzID09PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIC8vIFtmb29dICBbYmFyXVxuICAgIC8vICAgICAgXl4gb3B0aW9uYWwgd2hpdGVzcGFjZSAoY2FuIGluY2x1ZGUgbmV3bGluZXMpXG4gICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHg1Qi8qIFsgKi8pIHtcbiAgICAgIHN0YXJ0ID0gcG9zICsgMTtcbiAgICAgIHBvcyA9IHBhcnNlTGlua0xhYmVsKHN0YXRlLCBwb3MpO1xuICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgIGxhYmVsID0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0LCBwb3MrKyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3MgPSBsYWJlbEVuZCArIDE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcyA9IGxhYmVsRW5kICsgMTtcbiAgICB9XG5cbiAgICAvLyBjb3ZlcnMgbGFiZWwgPT09ICcnIGFuZCBsYWJlbCA9PT0gdW5kZWZpbmVkXG4gICAgLy8gKGNvbGxhcHNlZCByZWZlcmVuY2UgbGluayBhbmQgc2hvcnRjdXQgcmVmZXJlbmNlIGxpbmsgcmVzcGVjdGl2ZWx5KVxuICAgIGlmICghbGFiZWwpIHsgbGFiZWwgPSBzdGF0ZS5zcmMuc2xpY2UobGFiZWxTdGFydCwgbGFiZWxFbmQpOyB9XG5cbiAgICByZWYgPSBzdGF0ZS5lbnYucmVmZXJlbmNlc1tub3JtYWxpemVSZWZlcmVuY2UobGFiZWwpXTtcbiAgICBpZiAoIXJlZikge1xuICAgICAgc3RhdGUucG9zID0gb2xkUG9zO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBocmVmID0gcmVmLmhyZWY7XG4gICAgdGl0bGUgPSByZWYudGl0bGU7XG4gIH1cblxuICAvL1xuICAvLyBXZSBmb3VuZCB0aGUgZW5kIG9mIHRoZSBsaW5rLCBhbmQga25vdyBmb3IgYSBmYWN0IGl0J3MgYSB2YWxpZCBsaW5rO1xuICAvLyBzbyBhbGwgdGhhdCdzIGxlZnQgdG8gZG8gaXMgdG8gY2FsbCB0b2tlbml6ZXIuXG4gIC8vXG4gIGlmICghc2lsZW50KSB7XG4gICAgc3RhdGUucG9zID0gbGFiZWxTdGFydDtcbiAgICBzdGF0ZS5wb3NNYXggPSBsYWJlbEVuZDtcblxuICAgIHZhciBuZXdTdGF0ZSA9IG5ldyBzdGF0ZS5tZC5pbmxpbmUuU3RhdGUoXG4gICAgICBzdGF0ZS5zcmMuc2xpY2UobGFiZWxTdGFydCwgbGFiZWxFbmQpLFxuICAgICAgc3RhdGUubWQsXG4gICAgICBzdGF0ZS5lbnYsXG4gICAgICB0b2tlbnMgPSBbXVxuICAgICk7XG4gICAgbmV3U3RhdGUubWQuaW5saW5lLnRva2VuaXplKG5ld1N0YXRlKTtcblxuICAgIHRva2VuICAgICAgICAgID0gc3RhdGUucHVzaCgnaW1hZ2UnLCAnaW1nJywgMCk7XG4gICAgdG9rZW4uYXR0cnMgICAgPSBhdHRycyA9IFsgWyAnc3JjJywgaHJlZiBdLCBbICdhbHQnLCAnJyBdIF07XG4gICAgdG9rZW4uY2hpbGRyZW4gPSB0b2tlbnM7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBhdHRycy5wdXNoKFsgJ3RpdGxlJywgdGl0bGUgXSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUucG9zID0gcG9zO1xuICBzdGF0ZS5wb3NNYXggPSBtYXg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgW2xpbmtdKDx0bz4gXCJzdHVmZlwiKVxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwYXJzZUxpbmtMYWJlbCAgICAgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua19sYWJlbCcpO1xudmFyIHBhcnNlTGlua0Rlc3RpbmF0aW9uID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uJyk7XG52YXIgcGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfdGl0bGUnKTtcbnZhciBub3JtYWxpemVSZWZlcmVuY2UgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLm5vcm1hbGl6ZVJlZmVyZW5jZTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxpbmsoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgYXR0cnMsXG4gICAgICBjb2RlLFxuICAgICAgbGFiZWwsXG4gICAgICBsYWJlbEVuZCxcbiAgICAgIGxhYmVsU3RhcnQsXG4gICAgICBwb3MsXG4gICAgICByZXMsXG4gICAgICByZWYsXG4gICAgICB0aXRsZSxcbiAgICAgIHRva2VuLFxuICAgICAgaHJlZiA9ICcnLFxuICAgICAgb2xkUG9zID0gc3RhdGUucG9zLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3M7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcykgIT09IDB4NUIvKiBbICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhYmVsU3RhcnQgPSBzdGF0ZS5wb3MgKyAxO1xuICBsYWJlbEVuZCA9IHBhcnNlTGlua0xhYmVsKHN0YXRlLCBzdGF0ZS5wb3MsIHRydWUpO1xuXG4gIC8vIHBhcnNlciBmYWlsZWQgdG8gZmluZCAnXScsIHNvIGl0J3Mgbm90IGEgdmFsaWQgbGlua1xuICBpZiAobGFiZWxFbmQgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IGxhYmVsRW5kICsgMTtcbiAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDI4LyogKCAqLykge1xuICAgIC8vXG4gICAgLy8gSW5saW5lIGxpbmtcbiAgICAvL1xuXG4gICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAvLyAgICAgICAgXl4gc2tpcHBpbmcgdGhlc2Ugc3BhY2VzXG4gICAgcG9zKys7XG4gICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgIH1cbiAgICBpZiAocG9zID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgXl5eXl5eIHBhcnNpbmcgbGluayBkZXN0aW5hdGlvblxuICAgIHN0YXJ0ID0gcG9zO1xuICAgIHJlcyA9IHBhcnNlTGlua0Rlc3RpbmF0aW9uKHN0YXRlLnNyYywgcG9zLCBzdGF0ZS5wb3NNYXgpO1xuICAgIGlmIChyZXMub2spIHtcbiAgICAgIGhyZWYgPSBzdGF0ZS5tZC5ub3JtYWxpemVMaW5rKHJlcy5zdHIpO1xuICAgICAgaWYgKHN0YXRlLm1kLnZhbGlkYXRlTGluayhocmVmKSkge1xuICAgICAgICBwb3MgPSByZXMucG9zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaHJlZiA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgXl4gc2tpcHBpbmcgdGhlc2Ugc3BhY2VzXG4gICAgc3RhcnQgPSBwb3M7XG4gICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgICBeXl5eXl5eIHBhcnNpbmcgbGluayB0aXRsZVxuICAgIHJlcyA9IHBhcnNlTGlua1RpdGxlKHN0YXRlLnNyYywgcG9zLCBzdGF0ZS5wb3NNYXgpO1xuICAgIGlmIChwb3MgPCBtYXggJiYgc3RhcnQgIT09IHBvcyAmJiByZXMub2spIHtcbiAgICAgIHRpdGxlID0gcmVzLnN0cjtcbiAgICAgIHBvcyA9IHJlcy5wb3M7XG5cbiAgICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBeXiBza2lwcGluZyB0aGVzZSBzcGFjZXNcbiAgICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpdGxlID0gJyc7XG4gICAgfVxuXG4gICAgaWYgKHBvcyA+PSBtYXggfHwgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyOS8qICkgKi8pIHtcbiAgICAgIHN0YXRlLnBvcyA9IG9sZFBvcztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcG9zKys7XG4gIH0gZWxzZSB7XG4gICAgLy9cbiAgICAvLyBMaW5rIHJlZmVyZW5jZVxuICAgIC8vXG4gICAgaWYgKHR5cGVvZiBzdGF0ZS5lbnYucmVmZXJlbmNlcyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBbZm9vXSAgW2Jhcl1cbiAgICAvLyAgICAgIF5eIG9wdGlvbmFsIHdoaXRlc3BhY2UgKGNhbiBpbmNsdWRlIG5ld2xpbmVzKVxuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4NUIvKiBbICovKSB7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgICBwb3MgPSBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgcG9zKTtcbiAgICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgICBsYWJlbCA9IHN0YXRlLnNyYy5zbGljZShzdGFydCwgcG9zKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zID0gbGFiZWxFbmQgKyAxO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3MgPSBsYWJlbEVuZCArIDE7XG4gICAgfVxuXG4gICAgLy8gY292ZXJzIGxhYmVsID09PSAnJyBhbmQgbGFiZWwgPT09IHVuZGVmaW5lZFxuICAgIC8vIChjb2xsYXBzZWQgcmVmZXJlbmNlIGxpbmsgYW5kIHNob3J0Y3V0IHJlZmVyZW5jZSBsaW5rIHJlc3BlY3RpdmVseSlcbiAgICBpZiAoIWxhYmVsKSB7IGxhYmVsID0gc3RhdGUuc3JjLnNsaWNlKGxhYmVsU3RhcnQsIGxhYmVsRW5kKTsgfVxuXG4gICAgcmVmID0gc3RhdGUuZW52LnJlZmVyZW5jZXNbbm9ybWFsaXplUmVmZXJlbmNlKGxhYmVsKV07XG4gICAgaWYgKCFyZWYpIHtcbiAgICAgIHN0YXRlLnBvcyA9IG9sZFBvcztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaHJlZiA9IHJlZi5ocmVmO1xuICAgIHRpdGxlID0gcmVmLnRpdGxlO1xuICB9XG5cbiAgLy9cbiAgLy8gV2UgZm91bmQgdGhlIGVuZCBvZiB0aGUgbGluaywgYW5kIGtub3cgZm9yIGEgZmFjdCBpdCdzIGEgdmFsaWQgbGluaztcbiAgLy8gc28gYWxsIHRoYXQncyBsZWZ0IHRvIGRvIGlzIHRvIGNhbGwgdG9rZW5pemVyLlxuICAvL1xuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnBvcyA9IGxhYmVsU3RhcnQ7XG4gICAgc3RhdGUucG9zTWF4ID0gbGFiZWxFbmQ7XG5cbiAgICB0b2tlbiAgICAgICAgPSBzdGF0ZS5wdXNoKCdsaW5rX29wZW4nLCAnYScsIDEpO1xuICAgIHRva2VuLmF0dHJzICA9IGF0dHJzID0gWyBbICdocmVmJywgaHJlZiBdIF07XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBhdHRycy5wdXNoKFsgJ3RpdGxlJywgdGl0bGUgXSk7XG4gICAgfVxuXG4gICAgc3RhdGUubWQuaW5saW5lLnRva2VuaXplKHN0YXRlKTtcblxuICAgIHRva2VuICAgICAgICA9IHN0YXRlLnB1c2goJ2xpbmtfY2xvc2UnLCAnYScsIC0xKTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHBvcztcbiAgc3RhdGUucG9zTWF4ID0gbWF4O1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZWVzcyAnXFxuJ1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbmV3bGluZShzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBwbWF4LCBtYXgsIHBvcyA9IHN0YXRlLnBvcztcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgwQS8qIFxcbiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwbWF4ID0gc3RhdGUucGVuZGluZy5sZW5ndGggLSAxO1xuICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgLy8gJyAgXFxuJyAtPiBoYXJkYnJlYWtcbiAgLy8gTG9va3VwIGluIHBlbmRpbmcgY2hhcnMgaXMgYmFkIHByYWN0aWNlISBEb24ndCBjb3B5IHRvIG90aGVyIHJ1bGVzIVxuICAvLyBQZW5kaW5nIHN0cmluZyBpcyBzdG9yZWQgaW4gY29uY2F0IG1vZGUsIGluZGV4ZWQgbG9va3VwcyB3aWxsIGNhdXNlXG4gIC8vIGNvbnZlcnRpb24gdG8gZmxhdCBtb2RlLlxuICBpZiAoIXNpbGVudCkge1xuICAgIGlmIChwbWF4ID49IDAgJiYgc3RhdGUucGVuZGluZy5jaGFyQ29kZUF0KHBtYXgpID09PSAweDIwKSB7XG4gICAgICBpZiAocG1heCA+PSAxICYmIHN0YXRlLnBlbmRpbmcuY2hhckNvZGVBdChwbWF4IC0gMSkgPT09IDB4MjApIHtcbiAgICAgICAgc3RhdGUucGVuZGluZyA9IHN0YXRlLnBlbmRpbmcucmVwbGFjZSgvICskLywgJycpO1xuICAgICAgICBzdGF0ZS5wdXNoKCdoYXJkYnJlYWsnLCAnYnInLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnBlbmRpbmcgPSBzdGF0ZS5wZW5kaW5nLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgc3RhdGUucHVzaCgnc29mdGJyZWFrJywgJ2JyJywgMCk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucHVzaCgnc29mdGJyZWFrJywgJ2JyJywgMCk7XG4gICAgfVxuICB9XG5cbiAgcG9zKys7XG5cbiAgLy8gc2tpcCBoZWFkaW5nIHNwYWNlcyBmb3IgbmV4dCBsaW5lXG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gIHN0YXRlLnBvcyA9IHBvcztcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gSW5saW5lIHBhcnNlciBzdGF0ZVxuXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIFRva2VuID0gcmVxdWlyZSgnLi4vdG9rZW4nKTtcblxuZnVuY3Rpb24gU3RhdGVJbmxpbmUoc3JjLCBtZCwgZW52LCBvdXRUb2tlbnMpIHtcbiAgdGhpcy5zcmMgPSBzcmM7XG4gIHRoaXMuZW52ID0gZW52O1xuICB0aGlzLm1kID0gbWQ7XG4gIHRoaXMudG9rZW5zID0gb3V0VG9rZW5zO1xuXG4gIHRoaXMucG9zID0gMDtcbiAgdGhpcy5wb3NNYXggPSB0aGlzLnNyYy5sZW5ndGg7XG4gIHRoaXMubGV2ZWwgPSAwO1xuICB0aGlzLnBlbmRpbmcgPSAnJztcbiAgdGhpcy5wZW5kaW5nTGV2ZWwgPSAwO1xuXG4gIHRoaXMuY2FjaGUgPSB7fTsgICAgICAgIC8vIFN0b3JlcyB7IHN0YXJ0OiBlbmQgfSBwYWlycy4gVXNlZnVsIGZvciBiYWNrdHJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW1pemF0aW9uIG9mIHBhaXJzIHBhcnNlIChlbXBoYXNpcywgc3RyaWtlcykuXG59XG5cblxuLy8gRmx1c2ggcGVuZGluZyB0ZXh0XG4vL1xuU3RhdGVJbmxpbmUucHJvdG90eXBlLnB1c2hQZW5kaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdG9rZW4gPSBuZXcgVG9rZW4oJ3RleHQnLCAnJywgMCk7XG4gIHRva2VuLmNvbnRlbnQgPSB0aGlzLnBlbmRpbmc7XG4gIHRva2VuLmxldmVsID0gdGhpcy5wZW5kaW5nTGV2ZWw7XG4gIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICB0aGlzLnBlbmRpbmcgPSAnJztcbiAgcmV0dXJuIHRva2VuO1xufTtcblxuXG4vLyBQdXNoIG5ldyB0b2tlbiB0byBcInN0cmVhbVwiLlxuLy8gSWYgcGVuZGluZyB0ZXh0IGV4aXN0cyAtIGZsdXNoIGl0IGFzIHRleHQgdG9rZW5cbi8vXG5TdGF0ZUlubGluZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh0eXBlLCB0YWcsIG5lc3RpbmcpIHtcbiAgaWYgKHRoaXMucGVuZGluZykge1xuICAgIHRoaXMucHVzaFBlbmRpbmcoKTtcbiAgfVxuXG4gIHZhciB0b2tlbiA9IG5ldyBUb2tlbih0eXBlLCB0YWcsIG5lc3RpbmcpO1xuXG4gIGlmIChuZXN0aW5nIDwgMCkgeyB0aGlzLmxldmVsLS07IH1cbiAgdG9rZW4ubGV2ZWwgPSB0aGlzLmxldmVsO1xuICBpZiAobmVzdGluZyA+IDApIHsgdGhpcy5sZXZlbCsrOyB9XG5cbiAgdGhpcy5wZW5kaW5nTGV2ZWwgPSB0aGlzLmxldmVsO1xuICB0aGlzLnRva2Vucy5wdXNoKHRva2VuKTtcbiAgcmV0dXJuIHRva2VuO1xufTtcblxuLy8gcmUtZXhwb3J0IFRva2VuIGNsYXNzIHRvIHVzZSBpbiBibG9jayBydWxlc1xuU3RhdGVJbmxpbmUucHJvdG90eXBlLlRva2VuID0gVG9rZW47XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZUlubGluZTtcbiIsIi8vIH5+c3RyaWtlIHRocm91Z2h+flxuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgaXNXaGl0ZVNwYWNlICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc1doaXRlU3BhY2U7XG52YXIgaXNQdW5jdENoYXIgICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5pc1B1bmN0Q2hhcjtcbnZhciBpc01kQXNjaWlQdW5jdCA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLmlzTWRBc2NpaVB1bmN0O1xuXG5cbi8vIHBhcnNlIHNlcXVlbmNlIG9mIG1hcmtlcnMsXG4vLyBcInN0YXJ0XCIgc2hvdWxkIHBvaW50IGF0IGEgdmFsaWQgbWFya2VyXG5mdW5jdGlvbiBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCkge1xuICB2YXIgcG9zID0gc3RhcnQsIGxhc3RDaGFyLCBuZXh0Q2hhciwgY291bnQsXG4gICAgICBpc0xhc3RXaGl0ZVNwYWNlLCBpc0xhc3RQdW5jdENoYXIsXG4gICAgICBpc05leHRXaGl0ZVNwYWNlLCBpc05leHRQdW5jdENoYXIsXG4gICAgICBjYW5fb3BlbiA9IHRydWUsXG4gICAgICBjYW5fY2xvc2UgPSB0cnVlLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpO1xuXG4gIC8vIHRyZWF0IGJlZ2lubmluZyBvZiB0aGUgbGluZSBhcyBhIHdoaXRlc3BhY2VcbiAgbGFzdENoYXIgPSBzdGFydCA+IDAgPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCAtIDEpIDogMHgyMDtcblxuICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IG1hcmtlcikgeyBwb3MrKzsgfVxuXG4gIGlmIChwb3MgPj0gbWF4KSB7XG4gICAgY2FuX29wZW4gPSBmYWxzZTtcbiAgfVxuXG4gIGNvdW50ID0gcG9zIC0gc3RhcnQ7XG5cbiAgLy8gdHJlYXQgZW5kIG9mIHRoZSBsaW5lIGFzIGEgd2hpdGVzcGFjZVxuICBuZXh0Q2hhciA9IHBvcyA8IG1heCA/IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgOiAweDIwO1xuXG4gIGlzTGFzdFB1bmN0Q2hhciA9IGlzTWRBc2NpaVB1bmN0KGxhc3RDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGxhc3RDaGFyKSk7XG4gIGlzTmV4dFB1bmN0Q2hhciA9IGlzTWRBc2NpaVB1bmN0KG5leHRDaGFyKSB8fCBpc1B1bmN0Q2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKG5leHRDaGFyKSk7XG5cbiAgaXNMYXN0V2hpdGVTcGFjZSA9IGlzV2hpdGVTcGFjZShsYXN0Q2hhcik7XG4gIGlzTmV4dFdoaXRlU3BhY2UgPSBpc1doaXRlU3BhY2UobmV4dENoYXIpO1xuXG4gIGlmIChpc05leHRXaGl0ZVNwYWNlKSB7XG4gICAgY2FuX29wZW4gPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc05leHRQdW5jdENoYXIpIHtcbiAgICBpZiAoIShpc0xhc3RXaGl0ZVNwYWNlIHx8IGlzTGFzdFB1bmN0Q2hhcikpIHtcbiAgICAgIGNhbl9vcGVuID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzTGFzdFdoaXRlU3BhY2UpIHtcbiAgICBjYW5fY2xvc2UgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc0xhc3RQdW5jdENoYXIpIHtcbiAgICBpZiAoIShpc05leHRXaGl0ZVNwYWNlIHx8IGlzTmV4dFB1bmN0Q2hhcikpIHtcbiAgICAgIGNhbl9jbG9zZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2FuX29wZW46IGNhbl9vcGVuLFxuICAgIGNhbl9jbG9zZTogY2FuX2Nsb3NlLFxuICAgIGRlbGltczogY291bnRcbiAgfTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmlrZXRocm91Z2goc3RhdGUsIHNpbGVudCkge1xuICB2YXIgc3RhcnRDb3VudCxcbiAgICAgIGNvdW50LFxuICAgICAgdGFnQ291bnQsXG4gICAgICBmb3VuZCxcbiAgICAgIHN0YWNrLFxuICAgICAgcmVzLFxuICAgICAgdG9rZW4sXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBzdGFydCA9IHN0YXRlLnBvcyxcbiAgICAgIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0KTtcblxuICBpZiAobWFya2VyICE9PSAweDdFLyogfiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gZG9uJ3QgcnVuIGFueSBwYWlycyBpbiB2YWxpZGF0aW9uIG1vZGVcblxuICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGFydCk7XG4gIHN0YXJ0Q291bnQgPSByZXMuZGVsaW1zO1xuICBpZiAoIXJlcy5jYW5fb3Blbikge1xuICAgIHN0YXRlLnBvcyArPSBzdGFydENvdW50O1xuICAgIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG4gICAgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHN0YXRlLnBvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGFjayA9IE1hdGguZmxvb3Ioc3RhcnRDb3VudCAvIDIpO1xuICBpZiAoc3RhY2sgPD0gMCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgc3RhdGUucG9zID0gc3RhcnQgKyBzdGFydENvdW50O1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKSA9PT0gbWFya2VyKSB7XG4gICAgICByZXMgPSBzY2FuRGVsaW1zKHN0YXRlLCBzdGF0ZS5wb3MpO1xuICAgICAgY291bnQgPSByZXMuZGVsaW1zO1xuICAgICAgdGFnQ291bnQgPSBNYXRoLmZsb29yKGNvdW50IC8gMik7XG4gICAgICBpZiAocmVzLmNhbl9jbG9zZSkge1xuICAgICAgICBpZiAodGFnQ291bnQgPj0gc3RhY2spIHtcbiAgICAgICAgICBzdGF0ZS5wb3MgKz0gY291bnQgLSAyO1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdGFjayAtPSB0YWdDb3VudDtcbiAgICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcy5jYW5fb3BlbikgeyBzdGFjayArPSB0YWdDb3VudDsgfVxuICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc3RhdGUubWQuaW5saW5lLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kKSB7XG4gICAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kIGVuZGluZyB0YWcsIHNvIGl0J3Mgbm90IHZhbGlkIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZm91bmQhXG4gIHN0YXRlLnBvc01heCA9IHN0YXRlLnBvcztcbiAgc3RhdGUucG9zID0gc3RhcnQgKyAyO1xuXG4gIC8vIEVhcmxpZXIgd2UgY2hlY2tlZCAhc2lsZW50LCBidXQgdGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBuZWVkIGl0XG4gIHRva2VuICAgICAgICA9IHN0YXRlLnB1c2goJ3Nfb3BlbicsICdzJywgMSk7XG4gIHRva2VuLm1hcmt1cCA9ICd+fic7XG5cbiAgc3RhdGUubWQuaW5saW5lLnRva2VuaXplKHN0YXRlKTtcblxuICB0b2tlbiAgICAgICAgPSBzdGF0ZS5wdXNoKCdzX2Nsb3NlJywgJ3MnLCAtMSk7XG4gIHRva2VuLm1hcmt1cCA9ICd+fic7XG5cbiAgc3RhdGUucG9zID0gc3RhdGUucG9zTWF4ICsgMjtcbiAgc3RhdGUucG9zTWF4ID0gbWF4O1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBTa2lwIHRleHQgY2hhcmFjdGVycyBmb3IgdGV4dCB0b2tlbiwgcGxhY2UgdGhvc2UgdG8gcGVuZGluZyBidWZmZXJcbi8vIGFuZCBpbmNyZW1lbnQgY3VycmVudCBwb3NcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8vIFJ1bGUgdG8gc2tpcCBwdXJlIHRleHRcbi8vICd7fSQlQH4rPTonIHJlc2VydmVkIGZvciBleHRlbnRpb25zXG5cbi8vICEsIFwiLCAjLCAkLCAlLCAmLCAnLCAoLCApLCAqLCArLCAsLCAtLCAuLCAvLCA6LCA7LCA8LCA9LCA+LCA/LCBALCBbLCBcXCwgXSwgXiwgXywgYCwgeywgfCwgfSwgb3IgflxuXG4vLyAhISEhIERvbid0IGNvbmZ1c2Ugd2l0aCBcIk1hcmtkb3duIEFTQ0lJIFB1bmN0dWF0aW9uXCIgY2hhcnNcbi8vIGh0dHA6Ly9zcGVjLmNvbW1vbm1hcmsub3JnLzAuMTUvI2FzY2lpLXB1bmN0dWF0aW9uLWNoYXJhY3RlclxuZnVuY3Rpb24gaXNUZXJtaW5hdG9yQ2hhcihjaCkge1xuICBzd2l0Y2ggKGNoKSB7XG4gICAgY2FzZSAweDBBLyogXFxuICovOlxuICAgIGNhc2UgMHgyMS8qICEgKi86XG4gICAgY2FzZSAweDIzLyogIyAqLzpcbiAgICBjYXNlIDB4MjQvKiAkICovOlxuICAgIGNhc2UgMHgyNS8qICUgKi86XG4gICAgY2FzZSAweDI2LyogJiAqLzpcbiAgICBjYXNlIDB4MkEvKiAqICovOlxuICAgIGNhc2UgMHgyQi8qICsgKi86XG4gICAgY2FzZSAweDJELyogLSAqLzpcbiAgICBjYXNlIDB4M0EvKiA6ICovOlxuICAgIGNhc2UgMHgzQy8qIDwgKi86XG4gICAgY2FzZSAweDNELyogPSAqLzpcbiAgICBjYXNlIDB4M0UvKiA+ICovOlxuICAgIGNhc2UgMHg0MC8qIEAgKi86XG4gICAgY2FzZSAweDVCLyogWyAqLzpcbiAgICBjYXNlIDB4NUMvKiBcXCAqLzpcbiAgICBjYXNlIDB4NUQvKiBdICovOlxuICAgIGNhc2UgMHg1RS8qIF4gKi86XG4gICAgY2FzZSAweDVGLyogXyAqLzpcbiAgICBjYXNlIDB4NjAvKiBgICovOlxuICAgIGNhc2UgMHg3Qi8qIHsgKi86XG4gICAgY2FzZSAweDdELyogfSAqLzpcbiAgICBjYXNlIDB4N0UvKiB+ICovOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRleHQoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgcG9zID0gc3RhdGUucG9zO1xuXG4gIHdoaWxlIChwb3MgPCBzdGF0ZS5wb3NNYXggJiYgIWlzVGVybWluYXRvckNoYXIoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSkpIHtcbiAgICBwb3MrKztcbiAgfVxuXG4gIGlmIChwb3MgPT09IHN0YXRlLnBvcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoIXNpbGVudCkgeyBzdGF0ZS5wZW5kaW5nICs9IHN0YXRlLnNyYy5zbGljZShzdGF0ZS5wb3MsIHBvcyk7IH1cblxuICBzdGF0ZS5wb3MgPSBwb3M7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBBbHRlcm5hdGl2ZSBpbXBsZW1lbnRhdGlvbiwgZm9yIG1lbW9yeS5cbi8vXG4vLyBJdCBjb3N0cyAxMCUgb2YgcGVyZm9ybWFuY2UsIGJ1dCBhbGxvd3MgZXh0ZW5kIHRlcm1pbmF0b3JzIGxpc3QsIGlmIHBsYWNlIGl0XG4vLyB0byBgUGFyY2VySW5saW5lYCBwcm9wZXJ0eS4gUHJvYmFibHksIHdpbGwgc3dpdGNoIHRvIGl0IHNvbWV0aW1lLCBzdWNoXG4vLyBmbGV4aWJpbGl0eSByZXF1aXJlZC5cblxuLypcbnZhciBURVJNSU5BVE9SX1JFID0gL1tcXG4hIyQlJiorXFwtOjw9PkBbXFxcXFxcXV5fYHt9fl0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRleHQoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgcG9zID0gc3RhdGUucG9zLFxuICAgICAgaWR4ID0gc3RhdGUuc3JjLnNsaWNlKHBvcykuc2VhcmNoKFRFUk1JTkFUT1JfUkUpO1xuXG4gIC8vIGZpcnN0IGNoYXIgaXMgdGVybWluYXRvciAtPiBlbXB0eSB0ZXh0XG4gIGlmIChpZHggPT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gbm8gdGVybWluYXRvciAtPiB0ZXh0IHRpbGwgZW5kIG9mIHN0cmluZ1xuICBpZiAoaWR4IDwgMCkge1xuICAgIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjLnNsaWNlKHBvcyk7IH1cbiAgICBzdGF0ZS5wb3MgPSBzdGF0ZS5zcmMubGVuZ3RoO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBwb3MgKyBpZHgpOyB9XG5cbiAgc3RhdGUucG9zICs9IGlkeDtcblxuICByZXR1cm4gdHJ1ZTtcbn07Ki9cbiIsIi8vIFRva2VuIGNsYXNzXG5cbid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIGNsYXNzIFRva2VuXG4gKiovXG5cbi8qKlxuICogbmV3IFRva2VuKHR5cGUsIHRhZywgbmVzdGluZylcbiAqXG4gKiBDcmVhdGUgbmV3IHRva2VuIGFuZCBmaWxsIHBhc3NlZCBwcm9wZXJ0aWVzLlxuICoqL1xuZnVuY3Rpb24gVG9rZW4odHlwZSwgdGFnLCBuZXN0aW5nKSB7XG4gIC8qKlxuICAgKiBUb2tlbiN0eXBlIC0+IFN0cmluZ1xuICAgKlxuICAgKiBUeXBlIG9mIHRoZSB0b2tlbiAoc3RyaW5nLCBlLmcuIFwicGFyYWdyYXBoX29wZW5cIilcbiAgICoqL1xuICB0aGlzLnR5cGUgICAgID0gdHlwZTtcblxuICAvKipcbiAgICogVG9rZW4jdGFnIC0+IFN0cmluZ1xuICAgKlxuICAgKiBodG1sIHRhZyBuYW1lLCBlLmcuIFwicFwiXG4gICAqKi9cbiAgdGhpcy50YWcgICAgICA9IHRhZztcblxuICAvKipcbiAgICogVG9rZW4jYXR0cnMgLT4gQXJyYXlcbiAgICpcbiAgICogSHRtbCBhdHRyaWJ1dGVzLiBGb3JtYXQ6IGBbIFsgbmFtZTEsIHZhbHVlMSBdLCBbIG5hbWUyLCB2YWx1ZTIgXSBdYFxuICAgKiovXG4gIHRoaXMuYXR0cnMgICAgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUb2tlbiNtYXAgLT4gQXJyYXlcbiAgICpcbiAgICogU291cmNlIG1hcCBpbmZvLiBGb3JtYXQ6IGBbIGxpbmVfYmVnaW4sIGxpbmVfZW5kIF1gXG4gICAqKi9cbiAgdGhpcy5tYXAgICAgICA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRva2VuI25lc3RpbmcgLT4gTnVtYmVyXG4gICAqXG4gICAqIExldmVsIGNoYW5nZSAobnVtYmVyIGluIHstMSwgMCwgMX0gc2V0KSwgd2hlcmU6XG4gICAqXG4gICAqIC0gIGAxYCBtZWFucyB0aGUgdGFnIGlzIG9wZW5pbmdcbiAgICogLSAgYDBgIG1lYW5zIHRoZSB0YWcgaXMgc2VsZi1jbG9zaW5nXG4gICAqIC0gYC0xYCBtZWFucyB0aGUgdGFnIGlzIGNsb3NpbmdcbiAgICoqL1xuICB0aGlzLm5lc3RpbmcgID0gbmVzdGluZztcblxuICAvKipcbiAgICogVG9rZW4jbGV2ZWwgLT4gTnVtYmVyXG4gICAqXG4gICAqIG5lc3RpbmcgbGV2ZWwsIHRoZSBzYW1lIGFzIGBzdGF0ZS5sZXZlbGBcbiAgICoqL1xuICB0aGlzLmxldmVsICAgID0gMDtcblxuICAvKipcbiAgICogVG9rZW4jY2hpbGRyZW4gLT4gQXJyYXlcbiAgICpcbiAgICogQW4gYXJyYXkgb2YgY2hpbGQgbm9kZXMgKGlubGluZSBhbmQgaW1nIHRva2VucylcbiAgICoqL1xuICB0aGlzLmNoaWxkcmVuID0gbnVsbDtcblxuICAvKipcbiAgICogVG9rZW4jY29udGVudCAtPiBTdHJpbmdcbiAgICpcbiAgICogSW4gYSBjYXNlIG9mIHNlbGYtY2xvc2luZyB0YWcgKGNvZGUsIGh0bWwsIGZlbmNlLCBldGMuKSxcbiAgICogaXQgaGFzIGNvbnRlbnRzIG9mIHRoaXMgdGFnLlxuICAgKiovXG4gIHRoaXMuY29udGVudCAgPSAnJztcblxuICAvKipcbiAgICogVG9rZW4jbWFya3VwIC0+IFN0cmluZ1xuICAgKlxuICAgKiAnKicgb3IgJ18nIGZvciBlbXBoYXNpcywgZmVuY2Ugc3RyaW5nIGZvciBmZW5jZSwgZXRjLlxuICAgKiovXG4gIHRoaXMubWFya3VwICAgPSAnJztcblxuICAvKipcbiAgICogVG9rZW4jaW5mbyAtPiBTdHJpbmdcbiAgICpcbiAgICogZmVuY2UgaW5mb3N0cmluZ1xuICAgKiovXG4gIHRoaXMuaW5mbyAgICAgPSAnJztcblxuICAvKipcbiAgICogVG9rZW4jbWV0YSAtPiBPYmplY3RcbiAgICpcbiAgICogQSBwbGFjZSBmb3IgcGx1Z2lucyB0byBzdG9yZSBhbiBhcmJpdHJhcnkgZGF0YVxuICAgKiovXG4gIHRoaXMubWV0YSAgICAgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUb2tlbiNibG9jayAtPiBCb29sZWFuXG4gICAqXG4gICAqIFRydWUgZm9yIGJsb2NrLWxldmVsIHRva2VucywgZmFsc2UgZm9yIGlubGluZSB0b2tlbnMuXG4gICAqIFVzZWQgaW4gcmVuZGVyZXIgdG8gY2FsY3VsYXRlIGxpbmUgYnJlYWtzXG4gICAqKi9cbiAgdGhpcy5ibG9jayAgICA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUb2tlbiNoaWRkZW4gLT4gQm9vbGVhblxuICAgKlxuICAgKiBJZiBpdCdzIHRydWUsIGlnbm9yZSB0aGlzIGVsZW1lbnQgd2hlbiByZW5kZXJpbmcuIFVzZWQgZm9yIHRpZ2h0IGxpc3RzXG4gICAqIHRvIGhpZGUgcGFyYWdyYXBocy5cbiAgICoqL1xuICB0aGlzLmhpZGRlbiAgID0gZmFsc2U7XG59XG5cblxuLyoqXG4gKiBUb2tlbi5hdHRySW5kZXgobmFtZSkgLT4gTnVtYmVyXG4gKlxuICogU2VhcmNoIGF0dHJpYnV0ZSBpbmRleCBieSBuYW1lLlxuICoqL1xuVG9rZW4ucHJvdG90eXBlLmF0dHJJbmRleCA9IGZ1bmN0aW9uIGF0dHJJbmRleChuYW1lKSB7XG4gIHZhciBhdHRycywgaSwgbGVuO1xuXG4gIGlmICghdGhpcy5hdHRycykgeyByZXR1cm4gLTE7IH1cblxuICBhdHRycyA9IHRoaXMuYXR0cnM7XG5cbiAgZm9yIChpID0gMCwgbGVuID0gYXR0cnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoYXR0cnNbaV1bMF0gPT09IG5hbWUpIHsgcmV0dXJuIGk7IH1cbiAgfVxuICByZXR1cm4gLTE7XG59O1xuXG5cbi8qKlxuICogVG9rZW4uYXR0clB1c2goYXR0ckRhdGEpXG4gKlxuICogQWRkIGBbIG5hbWUsIHZhbHVlIF1gIGF0dHJpYnV0ZSB0byBsaXN0LiBJbml0IGF0dHJzIGlmIG5lY2Vzc2FyeVxuICoqL1xuVG9rZW4ucHJvdG90eXBlLmF0dHJQdXNoID0gZnVuY3Rpb24gYXR0clB1c2goYXR0ckRhdGEpIHtcbiAgaWYgKHRoaXMuYXR0cnMpIHtcbiAgICB0aGlzLmF0dHJzLnB1c2goYXR0ckRhdGEpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYXR0cnMgPSBbIGF0dHJEYXRhIF07XG4gIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUb2tlbjtcbiIsIm1vZHVsZS5leHBvcnRzPXtcIkFhY3V0ZVwiOlwiXFx1MDBDMVwiLFwiYWFjdXRlXCI6XCJcXHUwMEUxXCIsXCJBYnJldmVcIjpcIlxcdTAxMDJcIixcImFicmV2ZVwiOlwiXFx1MDEwM1wiLFwiYWNcIjpcIlxcdTIyM0VcIixcImFjZFwiOlwiXFx1MjIzRlwiLFwiYWNFXCI6XCJcXHUyMjNFXFx1MDMzM1wiLFwiQWNpcmNcIjpcIlxcdTAwQzJcIixcImFjaXJjXCI6XCJcXHUwMEUyXCIsXCJhY3V0ZVwiOlwiXFx1MDBCNFwiLFwiQWN5XCI6XCJcXHUwNDEwXCIsXCJhY3lcIjpcIlxcdTA0MzBcIixcIkFFbGlnXCI6XCJcXHUwMEM2XCIsXCJhZWxpZ1wiOlwiXFx1MDBFNlwiLFwiYWZcIjpcIlxcdTIwNjFcIixcIkFmclwiOlwiXFx1RDgzNVxcdUREMDRcIixcImFmclwiOlwiXFx1RDgzNVxcdUREMUVcIixcIkFncmF2ZVwiOlwiXFx1MDBDMFwiLFwiYWdyYXZlXCI6XCJcXHUwMEUwXCIsXCJhbGVmc3ltXCI6XCJcXHUyMTM1XCIsXCJhbGVwaFwiOlwiXFx1MjEzNVwiLFwiQWxwaGFcIjpcIlxcdTAzOTFcIixcImFscGhhXCI6XCJcXHUwM0IxXCIsXCJBbWFjclwiOlwiXFx1MDEwMFwiLFwiYW1hY3JcIjpcIlxcdTAxMDFcIixcImFtYWxnXCI6XCJcXHUyQTNGXCIsXCJhbXBcIjpcIiZcIixcIkFNUFwiOlwiJlwiLFwiYW5kYW5kXCI6XCJcXHUyQTU1XCIsXCJBbmRcIjpcIlxcdTJBNTNcIixcImFuZFwiOlwiXFx1MjIyN1wiLFwiYW5kZFwiOlwiXFx1MkE1Q1wiLFwiYW5kc2xvcGVcIjpcIlxcdTJBNThcIixcImFuZHZcIjpcIlxcdTJBNUFcIixcImFuZ1wiOlwiXFx1MjIyMFwiLFwiYW5nZVwiOlwiXFx1MjlBNFwiLFwiYW5nbGVcIjpcIlxcdTIyMjBcIixcImFuZ21zZGFhXCI6XCJcXHUyOUE4XCIsXCJhbmdtc2RhYlwiOlwiXFx1MjlBOVwiLFwiYW5nbXNkYWNcIjpcIlxcdTI5QUFcIixcImFuZ21zZGFkXCI6XCJcXHUyOUFCXCIsXCJhbmdtc2RhZVwiOlwiXFx1MjlBQ1wiLFwiYW5nbXNkYWZcIjpcIlxcdTI5QURcIixcImFuZ21zZGFnXCI6XCJcXHUyOUFFXCIsXCJhbmdtc2RhaFwiOlwiXFx1MjlBRlwiLFwiYW5nbXNkXCI6XCJcXHUyMjIxXCIsXCJhbmdydFwiOlwiXFx1MjIxRlwiLFwiYW5ncnR2YlwiOlwiXFx1MjJCRVwiLFwiYW5ncnR2YmRcIjpcIlxcdTI5OURcIixcImFuZ3NwaFwiOlwiXFx1MjIyMlwiLFwiYW5nc3RcIjpcIlxcdTAwQzVcIixcImFuZ3phcnJcIjpcIlxcdTIzN0NcIixcIkFvZ29uXCI6XCJcXHUwMTA0XCIsXCJhb2dvblwiOlwiXFx1MDEwNVwiLFwiQW9wZlwiOlwiXFx1RDgzNVxcdUREMzhcIixcImFvcGZcIjpcIlxcdUQ4MzVcXHVERDUyXCIsXCJhcGFjaXJcIjpcIlxcdTJBNkZcIixcImFwXCI6XCJcXHUyMjQ4XCIsXCJhcEVcIjpcIlxcdTJBNzBcIixcImFwZVwiOlwiXFx1MjI0QVwiLFwiYXBpZFwiOlwiXFx1MjI0QlwiLFwiYXBvc1wiOlwiJ1wiLFwiQXBwbHlGdW5jdGlvblwiOlwiXFx1MjA2MVwiLFwiYXBwcm94XCI6XCJcXHUyMjQ4XCIsXCJhcHByb3hlcVwiOlwiXFx1MjI0QVwiLFwiQXJpbmdcIjpcIlxcdTAwQzVcIixcImFyaW5nXCI6XCJcXHUwMEU1XCIsXCJBc2NyXCI6XCJcXHVEODM1XFx1REM5Q1wiLFwiYXNjclwiOlwiXFx1RDgzNVxcdURDQjZcIixcIkFzc2lnblwiOlwiXFx1MjI1NFwiLFwiYXN0XCI6XCIqXCIsXCJhc3ltcFwiOlwiXFx1MjI0OFwiLFwiYXN5bXBlcVwiOlwiXFx1MjI0RFwiLFwiQXRpbGRlXCI6XCJcXHUwMEMzXCIsXCJhdGlsZGVcIjpcIlxcdTAwRTNcIixcIkF1bWxcIjpcIlxcdTAwQzRcIixcImF1bWxcIjpcIlxcdTAwRTRcIixcImF3Y29uaW50XCI6XCJcXHUyMjMzXCIsXCJhd2ludFwiOlwiXFx1MkExMVwiLFwiYmFja2NvbmdcIjpcIlxcdTIyNENcIixcImJhY2tlcHNpbG9uXCI6XCJcXHUwM0Y2XCIsXCJiYWNrcHJpbWVcIjpcIlxcdTIwMzVcIixcImJhY2tzaW1cIjpcIlxcdTIyM0RcIixcImJhY2tzaW1lcVwiOlwiXFx1MjJDRFwiLFwiQmFja3NsYXNoXCI6XCJcXHUyMjE2XCIsXCJCYXJ2XCI6XCJcXHUyQUU3XCIsXCJiYXJ2ZWVcIjpcIlxcdTIyQkRcIixcImJhcndlZFwiOlwiXFx1MjMwNVwiLFwiQmFyd2VkXCI6XCJcXHUyMzA2XCIsXCJiYXJ3ZWRnZVwiOlwiXFx1MjMwNVwiLFwiYmJya1wiOlwiXFx1MjNCNVwiLFwiYmJya3RicmtcIjpcIlxcdTIzQjZcIixcImJjb25nXCI6XCJcXHUyMjRDXCIsXCJCY3lcIjpcIlxcdTA0MTFcIixcImJjeVwiOlwiXFx1MDQzMVwiLFwiYmRxdW9cIjpcIlxcdTIwMUVcIixcImJlY2F1c1wiOlwiXFx1MjIzNVwiLFwiYmVjYXVzZVwiOlwiXFx1MjIzNVwiLFwiQmVjYXVzZVwiOlwiXFx1MjIzNVwiLFwiYmVtcHR5dlwiOlwiXFx1MjlCMFwiLFwiYmVwc2lcIjpcIlxcdTAzRjZcIixcImJlcm5vdVwiOlwiXFx1MjEyQ1wiLFwiQmVybm91bGxpc1wiOlwiXFx1MjEyQ1wiLFwiQmV0YVwiOlwiXFx1MDM5MlwiLFwiYmV0YVwiOlwiXFx1MDNCMlwiLFwiYmV0aFwiOlwiXFx1MjEzNlwiLFwiYmV0d2VlblwiOlwiXFx1MjI2Q1wiLFwiQmZyXCI6XCJcXHVEODM1XFx1REQwNVwiLFwiYmZyXCI6XCJcXHVEODM1XFx1REQxRlwiLFwiYmlnY2FwXCI6XCJcXHUyMkMyXCIsXCJiaWdjaXJjXCI6XCJcXHUyNUVGXCIsXCJiaWdjdXBcIjpcIlxcdTIyQzNcIixcImJpZ29kb3RcIjpcIlxcdTJBMDBcIixcImJpZ29wbHVzXCI6XCJcXHUyQTAxXCIsXCJiaWdvdGltZXNcIjpcIlxcdTJBMDJcIixcImJpZ3NxY3VwXCI6XCJcXHUyQTA2XCIsXCJiaWdzdGFyXCI6XCJcXHUyNjA1XCIsXCJiaWd0cmlhbmdsZWRvd25cIjpcIlxcdTI1QkRcIixcImJpZ3RyaWFuZ2xldXBcIjpcIlxcdTI1QjNcIixcImJpZ3VwbHVzXCI6XCJcXHUyQTA0XCIsXCJiaWd2ZWVcIjpcIlxcdTIyQzFcIixcImJpZ3dlZGdlXCI6XCJcXHUyMkMwXCIsXCJia2Fyb3dcIjpcIlxcdTI5MERcIixcImJsYWNrbG96ZW5nZVwiOlwiXFx1MjlFQlwiLFwiYmxhY2tzcXVhcmVcIjpcIlxcdTI1QUFcIixcImJsYWNrdHJpYW5nbGVcIjpcIlxcdTI1QjRcIixcImJsYWNrdHJpYW5nbGVkb3duXCI6XCJcXHUyNUJFXCIsXCJibGFja3RyaWFuZ2xlbGVmdFwiOlwiXFx1MjVDMlwiLFwiYmxhY2t0cmlhbmdsZXJpZ2h0XCI6XCJcXHUyNUI4XCIsXCJibGFua1wiOlwiXFx1MjQyM1wiLFwiYmxrMTJcIjpcIlxcdTI1OTJcIixcImJsazE0XCI6XCJcXHUyNTkxXCIsXCJibGszNFwiOlwiXFx1MjU5M1wiLFwiYmxvY2tcIjpcIlxcdTI1ODhcIixcImJuZVwiOlwiPVxcdTIwRTVcIixcImJuZXF1aXZcIjpcIlxcdTIyNjFcXHUyMEU1XCIsXCJiTm90XCI6XCJcXHUyQUVEXCIsXCJibm90XCI6XCJcXHUyMzEwXCIsXCJCb3BmXCI6XCJcXHVEODM1XFx1REQzOVwiLFwiYm9wZlwiOlwiXFx1RDgzNVxcdURENTNcIixcImJvdFwiOlwiXFx1MjJBNVwiLFwiYm90dG9tXCI6XCJcXHUyMkE1XCIsXCJib3d0aWVcIjpcIlxcdTIyQzhcIixcImJveGJveFwiOlwiXFx1MjlDOVwiLFwiYm94ZGxcIjpcIlxcdTI1MTBcIixcImJveGRMXCI6XCJcXHUyNTU1XCIsXCJib3hEbFwiOlwiXFx1MjU1NlwiLFwiYm94RExcIjpcIlxcdTI1NTdcIixcImJveGRyXCI6XCJcXHUyNTBDXCIsXCJib3hkUlwiOlwiXFx1MjU1MlwiLFwiYm94RHJcIjpcIlxcdTI1NTNcIixcImJveERSXCI6XCJcXHUyNTU0XCIsXCJib3hoXCI6XCJcXHUyNTAwXCIsXCJib3hIXCI6XCJcXHUyNTUwXCIsXCJib3hoZFwiOlwiXFx1MjUyQ1wiLFwiYm94SGRcIjpcIlxcdTI1NjRcIixcImJveGhEXCI6XCJcXHUyNTY1XCIsXCJib3hIRFwiOlwiXFx1MjU2NlwiLFwiYm94aHVcIjpcIlxcdTI1MzRcIixcImJveEh1XCI6XCJcXHUyNTY3XCIsXCJib3hoVVwiOlwiXFx1MjU2OFwiLFwiYm94SFVcIjpcIlxcdTI1NjlcIixcImJveG1pbnVzXCI6XCJcXHUyMjlGXCIsXCJib3hwbHVzXCI6XCJcXHUyMjlFXCIsXCJib3h0aW1lc1wiOlwiXFx1MjJBMFwiLFwiYm94dWxcIjpcIlxcdTI1MThcIixcImJveHVMXCI6XCJcXHUyNTVCXCIsXCJib3hVbFwiOlwiXFx1MjU1Q1wiLFwiYm94VUxcIjpcIlxcdTI1NURcIixcImJveHVyXCI6XCJcXHUyNTE0XCIsXCJib3h1UlwiOlwiXFx1MjU1OFwiLFwiYm94VXJcIjpcIlxcdTI1NTlcIixcImJveFVSXCI6XCJcXHUyNTVBXCIsXCJib3h2XCI6XCJcXHUyNTAyXCIsXCJib3hWXCI6XCJcXHUyNTUxXCIsXCJib3h2aFwiOlwiXFx1MjUzQ1wiLFwiYm94dkhcIjpcIlxcdTI1NkFcIixcImJveFZoXCI6XCJcXHUyNTZCXCIsXCJib3hWSFwiOlwiXFx1MjU2Q1wiLFwiYm94dmxcIjpcIlxcdTI1MjRcIixcImJveHZMXCI6XCJcXHUyNTYxXCIsXCJib3hWbFwiOlwiXFx1MjU2MlwiLFwiYm94VkxcIjpcIlxcdTI1NjNcIixcImJveHZyXCI6XCJcXHUyNTFDXCIsXCJib3h2UlwiOlwiXFx1MjU1RVwiLFwiYm94VnJcIjpcIlxcdTI1NUZcIixcImJveFZSXCI6XCJcXHUyNTYwXCIsXCJicHJpbWVcIjpcIlxcdTIwMzVcIixcImJyZXZlXCI6XCJcXHUwMkQ4XCIsXCJCcmV2ZVwiOlwiXFx1MDJEOFwiLFwiYnJ2YmFyXCI6XCJcXHUwMEE2XCIsXCJic2NyXCI6XCJcXHVEODM1XFx1RENCN1wiLFwiQnNjclwiOlwiXFx1MjEyQ1wiLFwiYnNlbWlcIjpcIlxcdTIwNEZcIixcImJzaW1cIjpcIlxcdTIyM0RcIixcImJzaW1lXCI6XCJcXHUyMkNEXCIsXCJic29sYlwiOlwiXFx1MjlDNVwiLFwiYnNvbFwiOlwiXFxcXFwiLFwiYnNvbGhzdWJcIjpcIlxcdTI3QzhcIixcImJ1bGxcIjpcIlxcdTIwMjJcIixcImJ1bGxldFwiOlwiXFx1MjAyMlwiLFwiYnVtcFwiOlwiXFx1MjI0RVwiLFwiYnVtcEVcIjpcIlxcdTJBQUVcIixcImJ1bXBlXCI6XCJcXHUyMjRGXCIsXCJCdW1wZXFcIjpcIlxcdTIyNEVcIixcImJ1bXBlcVwiOlwiXFx1MjI0RlwiLFwiQ2FjdXRlXCI6XCJcXHUwMTA2XCIsXCJjYWN1dGVcIjpcIlxcdTAxMDdcIixcImNhcGFuZFwiOlwiXFx1MkE0NFwiLFwiY2FwYnJjdXBcIjpcIlxcdTJBNDlcIixcImNhcGNhcFwiOlwiXFx1MkE0QlwiLFwiY2FwXCI6XCJcXHUyMjI5XCIsXCJDYXBcIjpcIlxcdTIyRDJcIixcImNhcGN1cFwiOlwiXFx1MkE0N1wiLFwiY2FwZG90XCI6XCJcXHUyQTQwXCIsXCJDYXBpdGFsRGlmZmVyZW50aWFsRFwiOlwiXFx1MjE0NVwiLFwiY2Fwc1wiOlwiXFx1MjIyOVxcdUZFMDBcIixcImNhcmV0XCI6XCJcXHUyMDQxXCIsXCJjYXJvblwiOlwiXFx1MDJDN1wiLFwiQ2F5bGV5c1wiOlwiXFx1MjEyRFwiLFwiY2NhcHNcIjpcIlxcdTJBNERcIixcIkNjYXJvblwiOlwiXFx1MDEwQ1wiLFwiY2Nhcm9uXCI6XCJcXHUwMTBEXCIsXCJDY2VkaWxcIjpcIlxcdTAwQzdcIixcImNjZWRpbFwiOlwiXFx1MDBFN1wiLFwiQ2NpcmNcIjpcIlxcdTAxMDhcIixcImNjaXJjXCI6XCJcXHUwMTA5XCIsXCJDY29uaW50XCI6XCJcXHUyMjMwXCIsXCJjY3Vwc1wiOlwiXFx1MkE0Q1wiLFwiY2N1cHNzbVwiOlwiXFx1MkE1MFwiLFwiQ2RvdFwiOlwiXFx1MDEwQVwiLFwiY2RvdFwiOlwiXFx1MDEwQlwiLFwiY2VkaWxcIjpcIlxcdTAwQjhcIixcIkNlZGlsbGFcIjpcIlxcdTAwQjhcIixcImNlbXB0eXZcIjpcIlxcdTI5QjJcIixcImNlbnRcIjpcIlxcdTAwQTJcIixcImNlbnRlcmRvdFwiOlwiXFx1MDBCN1wiLFwiQ2VudGVyRG90XCI6XCJcXHUwMEI3XCIsXCJjZnJcIjpcIlxcdUQ4MzVcXHVERDIwXCIsXCJDZnJcIjpcIlxcdTIxMkRcIixcIkNIY3lcIjpcIlxcdTA0MjdcIixcImNoY3lcIjpcIlxcdTA0NDdcIixcImNoZWNrXCI6XCJcXHUyNzEzXCIsXCJjaGVja21hcmtcIjpcIlxcdTI3MTNcIixcIkNoaVwiOlwiXFx1MDNBN1wiLFwiY2hpXCI6XCJcXHUwM0M3XCIsXCJjaXJjXCI6XCJcXHUwMkM2XCIsXCJjaXJjZXFcIjpcIlxcdTIyNTdcIixcImNpcmNsZWFycm93bGVmdFwiOlwiXFx1MjFCQVwiLFwiY2lyY2xlYXJyb3dyaWdodFwiOlwiXFx1MjFCQlwiLFwiY2lyY2xlZGFzdFwiOlwiXFx1MjI5QlwiLFwiY2lyY2xlZGNpcmNcIjpcIlxcdTIyOUFcIixcImNpcmNsZWRkYXNoXCI6XCJcXHUyMjlEXCIsXCJDaXJjbGVEb3RcIjpcIlxcdTIyOTlcIixcImNpcmNsZWRSXCI6XCJcXHUwMEFFXCIsXCJjaXJjbGVkU1wiOlwiXFx1MjRDOFwiLFwiQ2lyY2xlTWludXNcIjpcIlxcdTIyOTZcIixcIkNpcmNsZVBsdXNcIjpcIlxcdTIyOTVcIixcIkNpcmNsZVRpbWVzXCI6XCJcXHUyMjk3XCIsXCJjaXJcIjpcIlxcdTI1Q0JcIixcImNpckVcIjpcIlxcdTI5QzNcIixcImNpcmVcIjpcIlxcdTIyNTdcIixcImNpcmZuaW50XCI6XCJcXHUyQTEwXCIsXCJjaXJtaWRcIjpcIlxcdTJBRUZcIixcImNpcnNjaXJcIjpcIlxcdTI5QzJcIixcIkNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbFwiOlwiXFx1MjIzMlwiLFwiQ2xvc2VDdXJseURvdWJsZVF1b3RlXCI6XCJcXHUyMDFEXCIsXCJDbG9zZUN1cmx5UXVvdGVcIjpcIlxcdTIwMTlcIixcImNsdWJzXCI6XCJcXHUyNjYzXCIsXCJjbHVic3VpdFwiOlwiXFx1MjY2M1wiLFwiY29sb25cIjpcIjpcIixcIkNvbG9uXCI6XCJcXHUyMjM3XCIsXCJDb2xvbmVcIjpcIlxcdTJBNzRcIixcImNvbG9uZVwiOlwiXFx1MjI1NFwiLFwiY29sb25lcVwiOlwiXFx1MjI1NFwiLFwiY29tbWFcIjpcIixcIixcImNvbW1hdFwiOlwiQFwiLFwiY29tcFwiOlwiXFx1MjIwMVwiLFwiY29tcGZuXCI6XCJcXHUyMjE4XCIsXCJjb21wbGVtZW50XCI6XCJcXHUyMjAxXCIsXCJjb21wbGV4ZXNcIjpcIlxcdTIxMDJcIixcImNvbmdcIjpcIlxcdTIyNDVcIixcImNvbmdkb3RcIjpcIlxcdTJBNkRcIixcIkNvbmdydWVudFwiOlwiXFx1MjI2MVwiLFwiY29uaW50XCI6XCJcXHUyMjJFXCIsXCJDb25pbnRcIjpcIlxcdTIyMkZcIixcIkNvbnRvdXJJbnRlZ3JhbFwiOlwiXFx1MjIyRVwiLFwiY29wZlwiOlwiXFx1RDgzNVxcdURENTRcIixcIkNvcGZcIjpcIlxcdTIxMDJcIixcImNvcHJvZFwiOlwiXFx1MjIxMFwiLFwiQ29wcm9kdWN0XCI6XCJcXHUyMjEwXCIsXCJjb3B5XCI6XCJcXHUwMEE5XCIsXCJDT1BZXCI6XCJcXHUwMEE5XCIsXCJjb3B5c3JcIjpcIlxcdTIxMTdcIixcIkNvdW50ZXJDbG9ja3dpc2VDb250b3VySW50ZWdyYWxcIjpcIlxcdTIyMzNcIixcImNyYXJyXCI6XCJcXHUyMUI1XCIsXCJjcm9zc1wiOlwiXFx1MjcxN1wiLFwiQ3Jvc3NcIjpcIlxcdTJBMkZcIixcIkNzY3JcIjpcIlxcdUQ4MzVcXHVEQzlFXCIsXCJjc2NyXCI6XCJcXHVEODM1XFx1RENCOFwiLFwiY3N1YlwiOlwiXFx1MkFDRlwiLFwiY3N1YmVcIjpcIlxcdTJBRDFcIixcImNzdXBcIjpcIlxcdTJBRDBcIixcImNzdXBlXCI6XCJcXHUyQUQyXCIsXCJjdGRvdFwiOlwiXFx1MjJFRlwiLFwiY3VkYXJybFwiOlwiXFx1MjkzOFwiLFwiY3VkYXJyclwiOlwiXFx1MjkzNVwiLFwiY3VlcHJcIjpcIlxcdTIyREVcIixcImN1ZXNjXCI6XCJcXHUyMkRGXCIsXCJjdWxhcnJcIjpcIlxcdTIxQjZcIixcImN1bGFycnBcIjpcIlxcdTI5M0RcIixcImN1cGJyY2FwXCI6XCJcXHUyQTQ4XCIsXCJjdXBjYXBcIjpcIlxcdTJBNDZcIixcIkN1cENhcFwiOlwiXFx1MjI0RFwiLFwiY3VwXCI6XCJcXHUyMjJBXCIsXCJDdXBcIjpcIlxcdTIyRDNcIixcImN1cGN1cFwiOlwiXFx1MkE0QVwiLFwiY3VwZG90XCI6XCJcXHUyMjhEXCIsXCJjdXBvclwiOlwiXFx1MkE0NVwiLFwiY3Vwc1wiOlwiXFx1MjIyQVxcdUZFMDBcIixcImN1cmFyclwiOlwiXFx1MjFCN1wiLFwiY3VyYXJybVwiOlwiXFx1MjkzQ1wiLFwiY3VybHllcXByZWNcIjpcIlxcdTIyREVcIixcImN1cmx5ZXFzdWNjXCI6XCJcXHUyMkRGXCIsXCJjdXJseXZlZVwiOlwiXFx1MjJDRVwiLFwiY3VybHl3ZWRnZVwiOlwiXFx1MjJDRlwiLFwiY3VycmVuXCI6XCJcXHUwMEE0XCIsXCJjdXJ2ZWFycm93bGVmdFwiOlwiXFx1MjFCNlwiLFwiY3VydmVhcnJvd3JpZ2h0XCI6XCJcXHUyMUI3XCIsXCJjdXZlZVwiOlwiXFx1MjJDRVwiLFwiY3V3ZWRcIjpcIlxcdTIyQ0ZcIixcImN3Y29uaW50XCI6XCJcXHUyMjMyXCIsXCJjd2ludFwiOlwiXFx1MjIzMVwiLFwiY3lsY3R5XCI6XCJcXHUyMzJEXCIsXCJkYWdnZXJcIjpcIlxcdTIwMjBcIixcIkRhZ2dlclwiOlwiXFx1MjAyMVwiLFwiZGFsZXRoXCI6XCJcXHUyMTM4XCIsXCJkYXJyXCI6XCJcXHUyMTkzXCIsXCJEYXJyXCI6XCJcXHUyMUExXCIsXCJkQXJyXCI6XCJcXHUyMUQzXCIsXCJkYXNoXCI6XCJcXHUyMDEwXCIsXCJEYXNodlwiOlwiXFx1MkFFNFwiLFwiZGFzaHZcIjpcIlxcdTIyQTNcIixcImRia2Fyb3dcIjpcIlxcdTI5MEZcIixcImRibGFjXCI6XCJcXHUwMkREXCIsXCJEY2Fyb25cIjpcIlxcdTAxMEVcIixcImRjYXJvblwiOlwiXFx1MDEwRlwiLFwiRGN5XCI6XCJcXHUwNDE0XCIsXCJkY3lcIjpcIlxcdTA0MzRcIixcImRkYWdnZXJcIjpcIlxcdTIwMjFcIixcImRkYXJyXCI6XCJcXHUyMUNBXCIsXCJERFwiOlwiXFx1MjE0NVwiLFwiZGRcIjpcIlxcdTIxNDZcIixcIkREb3RyYWhkXCI6XCJcXHUyOTExXCIsXCJkZG90c2VxXCI6XCJcXHUyQTc3XCIsXCJkZWdcIjpcIlxcdTAwQjBcIixcIkRlbFwiOlwiXFx1MjIwN1wiLFwiRGVsdGFcIjpcIlxcdTAzOTRcIixcImRlbHRhXCI6XCJcXHUwM0I0XCIsXCJkZW1wdHl2XCI6XCJcXHUyOUIxXCIsXCJkZmlzaHRcIjpcIlxcdTI5N0ZcIixcIkRmclwiOlwiXFx1RDgzNVxcdUREMDdcIixcImRmclwiOlwiXFx1RDgzNVxcdUREMjFcIixcImRIYXJcIjpcIlxcdTI5NjVcIixcImRoYXJsXCI6XCJcXHUyMUMzXCIsXCJkaGFyclwiOlwiXFx1MjFDMlwiLFwiRGlhY3JpdGljYWxBY3V0ZVwiOlwiXFx1MDBCNFwiLFwiRGlhY3JpdGljYWxEb3RcIjpcIlxcdTAyRDlcIixcIkRpYWNyaXRpY2FsRG91YmxlQWN1dGVcIjpcIlxcdTAyRERcIixcIkRpYWNyaXRpY2FsR3JhdmVcIjpcImBcIixcIkRpYWNyaXRpY2FsVGlsZGVcIjpcIlxcdTAyRENcIixcImRpYW1cIjpcIlxcdTIyQzRcIixcImRpYW1vbmRcIjpcIlxcdTIyQzRcIixcIkRpYW1vbmRcIjpcIlxcdTIyQzRcIixcImRpYW1vbmRzdWl0XCI6XCJcXHUyNjY2XCIsXCJkaWFtc1wiOlwiXFx1MjY2NlwiLFwiZGllXCI6XCJcXHUwMEE4XCIsXCJEaWZmZXJlbnRpYWxEXCI6XCJcXHUyMTQ2XCIsXCJkaWdhbW1hXCI6XCJcXHUwM0REXCIsXCJkaXNpblwiOlwiXFx1MjJGMlwiLFwiZGl2XCI6XCJcXHUwMEY3XCIsXCJkaXZpZGVcIjpcIlxcdTAwRjdcIixcImRpdmlkZW9udGltZXNcIjpcIlxcdTIyQzdcIixcImRpdm9ueFwiOlwiXFx1MjJDN1wiLFwiREpjeVwiOlwiXFx1MDQwMlwiLFwiZGpjeVwiOlwiXFx1MDQ1MlwiLFwiZGxjb3JuXCI6XCJcXHUyMzFFXCIsXCJkbGNyb3BcIjpcIlxcdTIzMERcIixcImRvbGxhclwiOlwiJFwiLFwiRG9wZlwiOlwiXFx1RDgzNVxcdUREM0JcIixcImRvcGZcIjpcIlxcdUQ4MzVcXHVERDU1XCIsXCJEb3RcIjpcIlxcdTAwQThcIixcImRvdFwiOlwiXFx1MDJEOVwiLFwiRG90RG90XCI6XCJcXHUyMERDXCIsXCJkb3RlcVwiOlwiXFx1MjI1MFwiLFwiZG90ZXFkb3RcIjpcIlxcdTIyNTFcIixcIkRvdEVxdWFsXCI6XCJcXHUyMjUwXCIsXCJkb3RtaW51c1wiOlwiXFx1MjIzOFwiLFwiZG90cGx1c1wiOlwiXFx1MjIxNFwiLFwiZG90c3F1YXJlXCI6XCJcXHUyMkExXCIsXCJkb3VibGViYXJ3ZWRnZVwiOlwiXFx1MjMwNlwiLFwiRG91YmxlQ29udG91ckludGVncmFsXCI6XCJcXHUyMjJGXCIsXCJEb3VibGVEb3RcIjpcIlxcdTAwQThcIixcIkRvdWJsZURvd25BcnJvd1wiOlwiXFx1MjFEM1wiLFwiRG91YmxlTGVmdEFycm93XCI6XCJcXHUyMUQwXCIsXCJEb3VibGVMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjFENFwiLFwiRG91YmxlTGVmdFRlZVwiOlwiXFx1MkFFNFwiLFwiRG91YmxlTG9uZ0xlZnRBcnJvd1wiOlwiXFx1MjdGOFwiLFwiRG91YmxlTG9uZ0xlZnRSaWdodEFycm93XCI6XCJcXHUyN0ZBXCIsXCJEb3VibGVMb25nUmlnaHRBcnJvd1wiOlwiXFx1MjdGOVwiLFwiRG91YmxlUmlnaHRBcnJvd1wiOlwiXFx1MjFEMlwiLFwiRG91YmxlUmlnaHRUZWVcIjpcIlxcdTIyQThcIixcIkRvdWJsZVVwQXJyb3dcIjpcIlxcdTIxRDFcIixcIkRvdWJsZVVwRG93bkFycm93XCI6XCJcXHUyMUQ1XCIsXCJEb3VibGVWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNVwiLFwiRG93bkFycm93QmFyXCI6XCJcXHUyOTEzXCIsXCJkb3duYXJyb3dcIjpcIlxcdTIxOTNcIixcIkRvd25BcnJvd1wiOlwiXFx1MjE5M1wiLFwiRG93bmFycm93XCI6XCJcXHUyMUQzXCIsXCJEb3duQXJyb3dVcEFycm93XCI6XCJcXHUyMUY1XCIsXCJEb3duQnJldmVcIjpcIlxcdTAzMTFcIixcImRvd25kb3duYXJyb3dzXCI6XCJcXHUyMUNBXCIsXCJkb3duaGFycG9vbmxlZnRcIjpcIlxcdTIxQzNcIixcImRvd25oYXJwb29ucmlnaHRcIjpcIlxcdTIxQzJcIixcIkRvd25MZWZ0UmlnaHRWZWN0b3JcIjpcIlxcdTI5NTBcIixcIkRvd25MZWZ0VGVlVmVjdG9yXCI6XCJcXHUyOTVFXCIsXCJEb3duTGVmdFZlY3RvckJhclwiOlwiXFx1Mjk1NlwiLFwiRG93bkxlZnRWZWN0b3JcIjpcIlxcdTIxQkRcIixcIkRvd25SaWdodFRlZVZlY3RvclwiOlwiXFx1Mjk1RlwiLFwiRG93blJpZ2h0VmVjdG9yQmFyXCI6XCJcXHUyOTU3XCIsXCJEb3duUmlnaHRWZWN0b3JcIjpcIlxcdTIxQzFcIixcIkRvd25UZWVBcnJvd1wiOlwiXFx1MjFBN1wiLFwiRG93blRlZVwiOlwiXFx1MjJBNFwiLFwiZHJia2Fyb3dcIjpcIlxcdTI5MTBcIixcImRyY29yblwiOlwiXFx1MjMxRlwiLFwiZHJjcm9wXCI6XCJcXHUyMzBDXCIsXCJEc2NyXCI6XCJcXHVEODM1XFx1REM5RlwiLFwiZHNjclwiOlwiXFx1RDgzNVxcdURDQjlcIixcIkRTY3lcIjpcIlxcdTA0MDVcIixcImRzY3lcIjpcIlxcdTA0NTVcIixcImRzb2xcIjpcIlxcdTI5RjZcIixcIkRzdHJva1wiOlwiXFx1MDExMFwiLFwiZHN0cm9rXCI6XCJcXHUwMTExXCIsXCJkdGRvdFwiOlwiXFx1MjJGMVwiLFwiZHRyaVwiOlwiXFx1MjVCRlwiLFwiZHRyaWZcIjpcIlxcdTI1QkVcIixcImR1YXJyXCI6XCJcXHUyMUY1XCIsXCJkdWhhclwiOlwiXFx1Mjk2RlwiLFwiZHdhbmdsZVwiOlwiXFx1MjlBNlwiLFwiRFpjeVwiOlwiXFx1MDQwRlwiLFwiZHpjeVwiOlwiXFx1MDQ1RlwiLFwiZHppZ3JhcnJcIjpcIlxcdTI3RkZcIixcIkVhY3V0ZVwiOlwiXFx1MDBDOVwiLFwiZWFjdXRlXCI6XCJcXHUwMEU5XCIsXCJlYXN0ZXJcIjpcIlxcdTJBNkVcIixcIkVjYXJvblwiOlwiXFx1MDExQVwiLFwiZWNhcm9uXCI6XCJcXHUwMTFCXCIsXCJFY2lyY1wiOlwiXFx1MDBDQVwiLFwiZWNpcmNcIjpcIlxcdTAwRUFcIixcImVjaXJcIjpcIlxcdTIyNTZcIixcImVjb2xvblwiOlwiXFx1MjI1NVwiLFwiRWN5XCI6XCJcXHUwNDJEXCIsXCJlY3lcIjpcIlxcdTA0NERcIixcImVERG90XCI6XCJcXHUyQTc3XCIsXCJFZG90XCI6XCJcXHUwMTE2XCIsXCJlZG90XCI6XCJcXHUwMTE3XCIsXCJlRG90XCI6XCJcXHUyMjUxXCIsXCJlZVwiOlwiXFx1MjE0N1wiLFwiZWZEb3RcIjpcIlxcdTIyNTJcIixcIkVmclwiOlwiXFx1RDgzNVxcdUREMDhcIixcImVmclwiOlwiXFx1RDgzNVxcdUREMjJcIixcImVnXCI6XCJcXHUyQTlBXCIsXCJFZ3JhdmVcIjpcIlxcdTAwQzhcIixcImVncmF2ZVwiOlwiXFx1MDBFOFwiLFwiZWdzXCI6XCJcXHUyQTk2XCIsXCJlZ3Nkb3RcIjpcIlxcdTJBOThcIixcImVsXCI6XCJcXHUyQTk5XCIsXCJFbGVtZW50XCI6XCJcXHUyMjA4XCIsXCJlbGludGVyc1wiOlwiXFx1MjNFN1wiLFwiZWxsXCI6XCJcXHUyMTEzXCIsXCJlbHNcIjpcIlxcdTJBOTVcIixcImVsc2RvdFwiOlwiXFx1MkE5N1wiLFwiRW1hY3JcIjpcIlxcdTAxMTJcIixcImVtYWNyXCI6XCJcXHUwMTEzXCIsXCJlbXB0eVwiOlwiXFx1MjIwNVwiLFwiZW1wdHlzZXRcIjpcIlxcdTIyMDVcIixcIkVtcHR5U21hbGxTcXVhcmVcIjpcIlxcdTI1RkJcIixcImVtcHR5dlwiOlwiXFx1MjIwNVwiLFwiRW1wdHlWZXJ5U21hbGxTcXVhcmVcIjpcIlxcdTI1QUJcIixcImVtc3AxM1wiOlwiXFx1MjAwNFwiLFwiZW1zcDE0XCI6XCJcXHUyMDA1XCIsXCJlbXNwXCI6XCJcXHUyMDAzXCIsXCJFTkdcIjpcIlxcdTAxNEFcIixcImVuZ1wiOlwiXFx1MDE0QlwiLFwiZW5zcFwiOlwiXFx1MjAwMlwiLFwiRW9nb25cIjpcIlxcdTAxMThcIixcImVvZ29uXCI6XCJcXHUwMTE5XCIsXCJFb3BmXCI6XCJcXHVEODM1XFx1REQzQ1wiLFwiZW9wZlwiOlwiXFx1RDgzNVxcdURENTZcIixcImVwYXJcIjpcIlxcdTIyRDVcIixcImVwYXJzbFwiOlwiXFx1MjlFM1wiLFwiZXBsdXNcIjpcIlxcdTJBNzFcIixcImVwc2lcIjpcIlxcdTAzQjVcIixcIkVwc2lsb25cIjpcIlxcdTAzOTVcIixcImVwc2lsb25cIjpcIlxcdTAzQjVcIixcImVwc2l2XCI6XCJcXHUwM0Y1XCIsXCJlcWNpcmNcIjpcIlxcdTIyNTZcIixcImVxY29sb25cIjpcIlxcdTIyNTVcIixcImVxc2ltXCI6XCJcXHUyMjQyXCIsXCJlcXNsYW50Z3RyXCI6XCJcXHUyQTk2XCIsXCJlcXNsYW50bGVzc1wiOlwiXFx1MkE5NVwiLFwiRXF1YWxcIjpcIlxcdTJBNzVcIixcImVxdWFsc1wiOlwiPVwiLFwiRXF1YWxUaWxkZVwiOlwiXFx1MjI0MlwiLFwiZXF1ZXN0XCI6XCJcXHUyMjVGXCIsXCJFcXVpbGlicml1bVwiOlwiXFx1MjFDQ1wiLFwiZXF1aXZcIjpcIlxcdTIyNjFcIixcImVxdWl2RERcIjpcIlxcdTJBNzhcIixcImVxdnBhcnNsXCI6XCJcXHUyOUU1XCIsXCJlcmFyclwiOlwiXFx1Mjk3MVwiLFwiZXJEb3RcIjpcIlxcdTIyNTNcIixcImVzY3JcIjpcIlxcdTIxMkZcIixcIkVzY3JcIjpcIlxcdTIxMzBcIixcImVzZG90XCI6XCJcXHUyMjUwXCIsXCJFc2ltXCI6XCJcXHUyQTczXCIsXCJlc2ltXCI6XCJcXHUyMjQyXCIsXCJFdGFcIjpcIlxcdTAzOTdcIixcImV0YVwiOlwiXFx1MDNCN1wiLFwiRVRIXCI6XCJcXHUwMEQwXCIsXCJldGhcIjpcIlxcdTAwRjBcIixcIkV1bWxcIjpcIlxcdTAwQ0JcIixcImV1bWxcIjpcIlxcdTAwRUJcIixcImV1cm9cIjpcIlxcdTIwQUNcIixcImV4Y2xcIjpcIiFcIixcImV4aXN0XCI6XCJcXHUyMjAzXCIsXCJFeGlzdHNcIjpcIlxcdTIyMDNcIixcImV4cGVjdGF0aW9uXCI6XCJcXHUyMTMwXCIsXCJleHBvbmVudGlhbGVcIjpcIlxcdTIxNDdcIixcIkV4cG9uZW50aWFsRVwiOlwiXFx1MjE0N1wiLFwiZmFsbGluZ2RvdHNlcVwiOlwiXFx1MjI1MlwiLFwiRmN5XCI6XCJcXHUwNDI0XCIsXCJmY3lcIjpcIlxcdTA0NDRcIixcImZlbWFsZVwiOlwiXFx1MjY0MFwiLFwiZmZpbGlnXCI6XCJcXHVGQjAzXCIsXCJmZmxpZ1wiOlwiXFx1RkIwMFwiLFwiZmZsbGlnXCI6XCJcXHVGQjA0XCIsXCJGZnJcIjpcIlxcdUQ4MzVcXHVERDA5XCIsXCJmZnJcIjpcIlxcdUQ4MzVcXHVERDIzXCIsXCJmaWxpZ1wiOlwiXFx1RkIwMVwiLFwiRmlsbGVkU21hbGxTcXVhcmVcIjpcIlxcdTI1RkNcIixcIkZpbGxlZFZlcnlTbWFsbFNxdWFyZVwiOlwiXFx1MjVBQVwiLFwiZmpsaWdcIjpcImZqXCIsXCJmbGF0XCI6XCJcXHUyNjZEXCIsXCJmbGxpZ1wiOlwiXFx1RkIwMlwiLFwiZmx0bnNcIjpcIlxcdTI1QjFcIixcImZub2ZcIjpcIlxcdTAxOTJcIixcIkZvcGZcIjpcIlxcdUQ4MzVcXHVERDNEXCIsXCJmb3BmXCI6XCJcXHVEODM1XFx1REQ1N1wiLFwiZm9yYWxsXCI6XCJcXHUyMjAwXCIsXCJGb3JBbGxcIjpcIlxcdTIyMDBcIixcImZvcmtcIjpcIlxcdTIyRDRcIixcImZvcmt2XCI6XCJcXHUyQUQ5XCIsXCJGb3VyaWVydHJmXCI6XCJcXHUyMTMxXCIsXCJmcGFydGludFwiOlwiXFx1MkEwRFwiLFwiZnJhYzEyXCI6XCJcXHUwMEJEXCIsXCJmcmFjMTNcIjpcIlxcdTIxNTNcIixcImZyYWMxNFwiOlwiXFx1MDBCQ1wiLFwiZnJhYzE1XCI6XCJcXHUyMTU1XCIsXCJmcmFjMTZcIjpcIlxcdTIxNTlcIixcImZyYWMxOFwiOlwiXFx1MjE1QlwiLFwiZnJhYzIzXCI6XCJcXHUyMTU0XCIsXCJmcmFjMjVcIjpcIlxcdTIxNTZcIixcImZyYWMzNFwiOlwiXFx1MDBCRVwiLFwiZnJhYzM1XCI6XCJcXHUyMTU3XCIsXCJmcmFjMzhcIjpcIlxcdTIxNUNcIixcImZyYWM0NVwiOlwiXFx1MjE1OFwiLFwiZnJhYzU2XCI6XCJcXHUyMTVBXCIsXCJmcmFjNThcIjpcIlxcdTIxNURcIixcImZyYWM3OFwiOlwiXFx1MjE1RVwiLFwiZnJhc2xcIjpcIlxcdTIwNDRcIixcImZyb3duXCI6XCJcXHUyMzIyXCIsXCJmc2NyXCI6XCJcXHVEODM1XFx1RENCQlwiLFwiRnNjclwiOlwiXFx1MjEzMVwiLFwiZ2FjdXRlXCI6XCJcXHUwMUY1XCIsXCJHYW1tYVwiOlwiXFx1MDM5M1wiLFwiZ2FtbWFcIjpcIlxcdTAzQjNcIixcIkdhbW1hZFwiOlwiXFx1MDNEQ1wiLFwiZ2FtbWFkXCI6XCJcXHUwM0REXCIsXCJnYXBcIjpcIlxcdTJBODZcIixcIkdicmV2ZVwiOlwiXFx1MDExRVwiLFwiZ2JyZXZlXCI6XCJcXHUwMTFGXCIsXCJHY2VkaWxcIjpcIlxcdTAxMjJcIixcIkdjaXJjXCI6XCJcXHUwMTFDXCIsXCJnY2lyY1wiOlwiXFx1MDExRFwiLFwiR2N5XCI6XCJcXHUwNDEzXCIsXCJnY3lcIjpcIlxcdTA0MzNcIixcIkdkb3RcIjpcIlxcdTAxMjBcIixcImdkb3RcIjpcIlxcdTAxMjFcIixcImdlXCI6XCJcXHUyMjY1XCIsXCJnRVwiOlwiXFx1MjI2N1wiLFwiZ0VsXCI6XCJcXHUyQThDXCIsXCJnZWxcIjpcIlxcdTIyREJcIixcImdlcVwiOlwiXFx1MjI2NVwiLFwiZ2VxcVwiOlwiXFx1MjI2N1wiLFwiZ2Vxc2xhbnRcIjpcIlxcdTJBN0VcIixcImdlc2NjXCI6XCJcXHUyQUE5XCIsXCJnZXNcIjpcIlxcdTJBN0VcIixcImdlc2RvdFwiOlwiXFx1MkE4MFwiLFwiZ2VzZG90b1wiOlwiXFx1MkE4MlwiLFwiZ2VzZG90b2xcIjpcIlxcdTJBODRcIixcImdlc2xcIjpcIlxcdTIyREJcXHVGRTAwXCIsXCJnZXNsZXNcIjpcIlxcdTJBOTRcIixcIkdmclwiOlwiXFx1RDgzNVxcdUREMEFcIixcImdmclwiOlwiXFx1RDgzNVxcdUREMjRcIixcImdnXCI6XCJcXHUyMjZCXCIsXCJHZ1wiOlwiXFx1MjJEOVwiLFwiZ2dnXCI6XCJcXHUyMkQ5XCIsXCJnaW1lbFwiOlwiXFx1MjEzN1wiLFwiR0pjeVwiOlwiXFx1MDQwM1wiLFwiZ2pjeVwiOlwiXFx1MDQ1M1wiLFwiZ2xhXCI6XCJcXHUyQUE1XCIsXCJnbFwiOlwiXFx1MjI3N1wiLFwiZ2xFXCI6XCJcXHUyQTkyXCIsXCJnbGpcIjpcIlxcdTJBQTRcIixcImduYXBcIjpcIlxcdTJBOEFcIixcImduYXBwcm94XCI6XCJcXHUyQThBXCIsXCJnbmVcIjpcIlxcdTJBODhcIixcImduRVwiOlwiXFx1MjI2OVwiLFwiZ25lcVwiOlwiXFx1MkE4OFwiLFwiZ25lcXFcIjpcIlxcdTIyNjlcIixcImduc2ltXCI6XCJcXHUyMkU3XCIsXCJHb3BmXCI6XCJcXHVEODM1XFx1REQzRVwiLFwiZ29wZlwiOlwiXFx1RDgzNVxcdURENThcIixcImdyYXZlXCI6XCJgXCIsXCJHcmVhdGVyRXF1YWxcIjpcIlxcdTIyNjVcIixcIkdyZWF0ZXJFcXVhbExlc3NcIjpcIlxcdTIyREJcIixcIkdyZWF0ZXJGdWxsRXF1YWxcIjpcIlxcdTIyNjdcIixcIkdyZWF0ZXJHcmVhdGVyXCI6XCJcXHUyQUEyXCIsXCJHcmVhdGVyTGVzc1wiOlwiXFx1MjI3N1wiLFwiR3JlYXRlclNsYW50RXF1YWxcIjpcIlxcdTJBN0VcIixcIkdyZWF0ZXJUaWxkZVwiOlwiXFx1MjI3M1wiLFwiR3NjclwiOlwiXFx1RDgzNVxcdURDQTJcIixcImdzY3JcIjpcIlxcdTIxMEFcIixcImdzaW1cIjpcIlxcdTIyNzNcIixcImdzaW1lXCI6XCJcXHUyQThFXCIsXCJnc2ltbFwiOlwiXFx1MkE5MFwiLFwiZ3RjY1wiOlwiXFx1MkFBN1wiLFwiZ3RjaXJcIjpcIlxcdTJBN0FcIixcImd0XCI6XCI+XCIsXCJHVFwiOlwiPlwiLFwiR3RcIjpcIlxcdTIyNkJcIixcImd0ZG90XCI6XCJcXHUyMkQ3XCIsXCJndGxQYXJcIjpcIlxcdTI5OTVcIixcImd0cXVlc3RcIjpcIlxcdTJBN0NcIixcImd0cmFwcHJveFwiOlwiXFx1MkE4NlwiLFwiZ3RyYXJyXCI6XCJcXHUyOTc4XCIsXCJndHJkb3RcIjpcIlxcdTIyRDdcIixcImd0cmVxbGVzc1wiOlwiXFx1MjJEQlwiLFwiZ3RyZXFxbGVzc1wiOlwiXFx1MkE4Q1wiLFwiZ3RybGVzc1wiOlwiXFx1MjI3N1wiLFwiZ3Ryc2ltXCI6XCJcXHUyMjczXCIsXCJndmVydG5lcXFcIjpcIlxcdTIyNjlcXHVGRTAwXCIsXCJndm5FXCI6XCJcXHUyMjY5XFx1RkUwMFwiLFwiSGFjZWtcIjpcIlxcdTAyQzdcIixcImhhaXJzcFwiOlwiXFx1MjAwQVwiLFwiaGFsZlwiOlwiXFx1MDBCRFwiLFwiaGFtaWx0XCI6XCJcXHUyMTBCXCIsXCJIQVJEY3lcIjpcIlxcdTA0MkFcIixcImhhcmRjeVwiOlwiXFx1MDQ0QVwiLFwiaGFycmNpclwiOlwiXFx1Mjk0OFwiLFwiaGFyclwiOlwiXFx1MjE5NFwiLFwiaEFyclwiOlwiXFx1MjFENFwiLFwiaGFycndcIjpcIlxcdTIxQURcIixcIkhhdFwiOlwiXlwiLFwiaGJhclwiOlwiXFx1MjEwRlwiLFwiSGNpcmNcIjpcIlxcdTAxMjRcIixcImhjaXJjXCI6XCJcXHUwMTI1XCIsXCJoZWFydHNcIjpcIlxcdTI2NjVcIixcImhlYXJ0c3VpdFwiOlwiXFx1MjY2NVwiLFwiaGVsbGlwXCI6XCJcXHUyMDI2XCIsXCJoZXJjb25cIjpcIlxcdTIyQjlcIixcImhmclwiOlwiXFx1RDgzNVxcdUREMjVcIixcIkhmclwiOlwiXFx1MjEwQ1wiLFwiSGlsYmVydFNwYWNlXCI6XCJcXHUyMTBCXCIsXCJoa3NlYXJvd1wiOlwiXFx1MjkyNVwiLFwiaGtzd2Fyb3dcIjpcIlxcdTI5MjZcIixcImhvYXJyXCI6XCJcXHUyMUZGXCIsXCJob210aHRcIjpcIlxcdTIyM0JcIixcImhvb2tsZWZ0YXJyb3dcIjpcIlxcdTIxQTlcIixcImhvb2tyaWdodGFycm93XCI6XCJcXHUyMUFBXCIsXCJob3BmXCI6XCJcXHVEODM1XFx1REQ1OVwiLFwiSG9wZlwiOlwiXFx1MjEwRFwiLFwiaG9yYmFyXCI6XCJcXHUyMDE1XCIsXCJIb3Jpem9udGFsTGluZVwiOlwiXFx1MjUwMFwiLFwiaHNjclwiOlwiXFx1RDgzNVxcdURDQkRcIixcIkhzY3JcIjpcIlxcdTIxMEJcIixcImhzbGFzaFwiOlwiXFx1MjEwRlwiLFwiSHN0cm9rXCI6XCJcXHUwMTI2XCIsXCJoc3Ryb2tcIjpcIlxcdTAxMjdcIixcIkh1bXBEb3duSHVtcFwiOlwiXFx1MjI0RVwiLFwiSHVtcEVxdWFsXCI6XCJcXHUyMjRGXCIsXCJoeWJ1bGxcIjpcIlxcdTIwNDNcIixcImh5cGhlblwiOlwiXFx1MjAxMFwiLFwiSWFjdXRlXCI6XCJcXHUwMENEXCIsXCJpYWN1dGVcIjpcIlxcdTAwRURcIixcImljXCI6XCJcXHUyMDYzXCIsXCJJY2lyY1wiOlwiXFx1MDBDRVwiLFwiaWNpcmNcIjpcIlxcdTAwRUVcIixcIkljeVwiOlwiXFx1MDQxOFwiLFwiaWN5XCI6XCJcXHUwNDM4XCIsXCJJZG90XCI6XCJcXHUwMTMwXCIsXCJJRWN5XCI6XCJcXHUwNDE1XCIsXCJpZWN5XCI6XCJcXHUwNDM1XCIsXCJpZXhjbFwiOlwiXFx1MDBBMVwiLFwiaWZmXCI6XCJcXHUyMUQ0XCIsXCJpZnJcIjpcIlxcdUQ4MzVcXHVERDI2XCIsXCJJZnJcIjpcIlxcdTIxMTFcIixcIklncmF2ZVwiOlwiXFx1MDBDQ1wiLFwiaWdyYXZlXCI6XCJcXHUwMEVDXCIsXCJpaVwiOlwiXFx1MjE0OFwiLFwiaWlpaW50XCI6XCJcXHUyQTBDXCIsXCJpaWludFwiOlwiXFx1MjIyRFwiLFwiaWluZmluXCI6XCJcXHUyOURDXCIsXCJpaW90YVwiOlwiXFx1MjEyOVwiLFwiSUpsaWdcIjpcIlxcdTAxMzJcIixcImlqbGlnXCI6XCJcXHUwMTMzXCIsXCJJbWFjclwiOlwiXFx1MDEyQVwiLFwiaW1hY3JcIjpcIlxcdTAxMkJcIixcImltYWdlXCI6XCJcXHUyMTExXCIsXCJJbWFnaW5hcnlJXCI6XCJcXHUyMTQ4XCIsXCJpbWFnbGluZVwiOlwiXFx1MjExMFwiLFwiaW1hZ3BhcnRcIjpcIlxcdTIxMTFcIixcImltYXRoXCI6XCJcXHUwMTMxXCIsXCJJbVwiOlwiXFx1MjExMVwiLFwiaW1vZlwiOlwiXFx1MjJCN1wiLFwiaW1wZWRcIjpcIlxcdTAxQjVcIixcIkltcGxpZXNcIjpcIlxcdTIxRDJcIixcImluY2FyZVwiOlwiXFx1MjEwNVwiLFwiaW5cIjpcIlxcdTIyMDhcIixcImluZmluXCI6XCJcXHUyMjFFXCIsXCJpbmZpbnRpZVwiOlwiXFx1MjlERFwiLFwiaW5vZG90XCI6XCJcXHUwMTMxXCIsXCJpbnRjYWxcIjpcIlxcdTIyQkFcIixcImludFwiOlwiXFx1MjIyQlwiLFwiSW50XCI6XCJcXHUyMjJDXCIsXCJpbnRlZ2Vyc1wiOlwiXFx1MjEyNFwiLFwiSW50ZWdyYWxcIjpcIlxcdTIyMkJcIixcImludGVyY2FsXCI6XCJcXHUyMkJBXCIsXCJJbnRlcnNlY3Rpb25cIjpcIlxcdTIyQzJcIixcImludGxhcmhrXCI6XCJcXHUyQTE3XCIsXCJpbnRwcm9kXCI6XCJcXHUyQTNDXCIsXCJJbnZpc2libGVDb21tYVwiOlwiXFx1MjA2M1wiLFwiSW52aXNpYmxlVGltZXNcIjpcIlxcdTIwNjJcIixcIklPY3lcIjpcIlxcdTA0MDFcIixcImlvY3lcIjpcIlxcdTA0NTFcIixcIklvZ29uXCI6XCJcXHUwMTJFXCIsXCJpb2dvblwiOlwiXFx1MDEyRlwiLFwiSW9wZlwiOlwiXFx1RDgzNVxcdURENDBcIixcImlvcGZcIjpcIlxcdUQ4MzVcXHVERDVBXCIsXCJJb3RhXCI6XCJcXHUwMzk5XCIsXCJpb3RhXCI6XCJcXHUwM0I5XCIsXCJpcHJvZFwiOlwiXFx1MkEzQ1wiLFwiaXF1ZXN0XCI6XCJcXHUwMEJGXCIsXCJpc2NyXCI6XCJcXHVEODM1XFx1RENCRVwiLFwiSXNjclwiOlwiXFx1MjExMFwiLFwiaXNpblwiOlwiXFx1MjIwOFwiLFwiaXNpbmRvdFwiOlwiXFx1MjJGNVwiLFwiaXNpbkVcIjpcIlxcdTIyRjlcIixcImlzaW5zXCI6XCJcXHUyMkY0XCIsXCJpc2luc3ZcIjpcIlxcdTIyRjNcIixcImlzaW52XCI6XCJcXHUyMjA4XCIsXCJpdFwiOlwiXFx1MjA2MlwiLFwiSXRpbGRlXCI6XCJcXHUwMTI4XCIsXCJpdGlsZGVcIjpcIlxcdTAxMjlcIixcIkl1a2N5XCI6XCJcXHUwNDA2XCIsXCJpdWtjeVwiOlwiXFx1MDQ1NlwiLFwiSXVtbFwiOlwiXFx1MDBDRlwiLFwiaXVtbFwiOlwiXFx1MDBFRlwiLFwiSmNpcmNcIjpcIlxcdTAxMzRcIixcImpjaXJjXCI6XCJcXHUwMTM1XCIsXCJKY3lcIjpcIlxcdTA0MTlcIixcImpjeVwiOlwiXFx1MDQzOVwiLFwiSmZyXCI6XCJcXHVEODM1XFx1REQwRFwiLFwiamZyXCI6XCJcXHVEODM1XFx1REQyN1wiLFwiam1hdGhcIjpcIlxcdTAyMzdcIixcIkpvcGZcIjpcIlxcdUQ4MzVcXHVERDQxXCIsXCJqb3BmXCI6XCJcXHVEODM1XFx1REQ1QlwiLFwiSnNjclwiOlwiXFx1RDgzNVxcdURDQTVcIixcImpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0JGXCIsXCJKc2VyY3lcIjpcIlxcdTA0MDhcIixcImpzZXJjeVwiOlwiXFx1MDQ1OFwiLFwiSnVrY3lcIjpcIlxcdTA0MDRcIixcImp1a2N5XCI6XCJcXHUwNDU0XCIsXCJLYXBwYVwiOlwiXFx1MDM5QVwiLFwia2FwcGFcIjpcIlxcdTAzQkFcIixcImthcHBhdlwiOlwiXFx1MDNGMFwiLFwiS2NlZGlsXCI6XCJcXHUwMTM2XCIsXCJrY2VkaWxcIjpcIlxcdTAxMzdcIixcIktjeVwiOlwiXFx1MDQxQVwiLFwia2N5XCI6XCJcXHUwNDNBXCIsXCJLZnJcIjpcIlxcdUQ4MzVcXHVERDBFXCIsXCJrZnJcIjpcIlxcdUQ4MzVcXHVERDI4XCIsXCJrZ3JlZW5cIjpcIlxcdTAxMzhcIixcIktIY3lcIjpcIlxcdTA0MjVcIixcImtoY3lcIjpcIlxcdTA0NDVcIixcIktKY3lcIjpcIlxcdTA0MENcIixcImtqY3lcIjpcIlxcdTA0NUNcIixcIktvcGZcIjpcIlxcdUQ4MzVcXHVERDQyXCIsXCJrb3BmXCI6XCJcXHVEODM1XFx1REQ1Q1wiLFwiS3NjclwiOlwiXFx1RDgzNVxcdURDQTZcIixcImtzY3JcIjpcIlxcdUQ4MzVcXHVEQ0MwXCIsXCJsQWFyclwiOlwiXFx1MjFEQVwiLFwiTGFjdXRlXCI6XCJcXHUwMTM5XCIsXCJsYWN1dGVcIjpcIlxcdTAxM0FcIixcImxhZW1wdHl2XCI6XCJcXHUyOUI0XCIsXCJsYWdyYW5cIjpcIlxcdTIxMTJcIixcIkxhbWJkYVwiOlwiXFx1MDM5QlwiLFwibGFtYmRhXCI6XCJcXHUwM0JCXCIsXCJsYW5nXCI6XCJcXHUyN0U4XCIsXCJMYW5nXCI6XCJcXHUyN0VBXCIsXCJsYW5nZFwiOlwiXFx1Mjk5MVwiLFwibGFuZ2xlXCI6XCJcXHUyN0U4XCIsXCJsYXBcIjpcIlxcdTJBODVcIixcIkxhcGxhY2V0cmZcIjpcIlxcdTIxMTJcIixcImxhcXVvXCI6XCJcXHUwMEFCXCIsXCJsYXJyYlwiOlwiXFx1MjFFNFwiLFwibGFycmJmc1wiOlwiXFx1MjkxRlwiLFwibGFyclwiOlwiXFx1MjE5MFwiLFwiTGFyclwiOlwiXFx1MjE5RVwiLFwibEFyclwiOlwiXFx1MjFEMFwiLFwibGFycmZzXCI6XCJcXHUyOTFEXCIsXCJsYXJyaGtcIjpcIlxcdTIxQTlcIixcImxhcnJscFwiOlwiXFx1MjFBQlwiLFwibGFycnBsXCI6XCJcXHUyOTM5XCIsXCJsYXJyc2ltXCI6XCJcXHUyOTczXCIsXCJsYXJydGxcIjpcIlxcdTIxQTJcIixcImxhdGFpbFwiOlwiXFx1MjkxOVwiLFwibEF0YWlsXCI6XCJcXHUyOTFCXCIsXCJsYXRcIjpcIlxcdTJBQUJcIixcImxhdGVcIjpcIlxcdTJBQURcIixcImxhdGVzXCI6XCJcXHUyQUFEXFx1RkUwMFwiLFwibGJhcnJcIjpcIlxcdTI5MENcIixcImxCYXJyXCI6XCJcXHUyOTBFXCIsXCJsYmJya1wiOlwiXFx1Mjc3MlwiLFwibGJyYWNlXCI6XCJ7XCIsXCJsYnJhY2tcIjpcIltcIixcImxicmtlXCI6XCJcXHUyOThCXCIsXCJsYnJrc2xkXCI6XCJcXHUyOThGXCIsXCJsYnJrc2x1XCI6XCJcXHUyOThEXCIsXCJMY2Fyb25cIjpcIlxcdTAxM0RcIixcImxjYXJvblwiOlwiXFx1MDEzRVwiLFwiTGNlZGlsXCI6XCJcXHUwMTNCXCIsXCJsY2VkaWxcIjpcIlxcdTAxM0NcIixcImxjZWlsXCI6XCJcXHUyMzA4XCIsXCJsY3ViXCI6XCJ7XCIsXCJMY3lcIjpcIlxcdTA0MUJcIixcImxjeVwiOlwiXFx1MDQzQlwiLFwibGRjYVwiOlwiXFx1MjkzNlwiLFwibGRxdW9cIjpcIlxcdTIwMUNcIixcImxkcXVvclwiOlwiXFx1MjAxRVwiLFwibGRyZGhhclwiOlwiXFx1Mjk2N1wiLFwibGRydXNoYXJcIjpcIlxcdTI5NEJcIixcImxkc2hcIjpcIlxcdTIxQjJcIixcImxlXCI6XCJcXHUyMjY0XCIsXCJsRVwiOlwiXFx1MjI2NlwiLFwiTGVmdEFuZ2xlQnJhY2tldFwiOlwiXFx1MjdFOFwiLFwiTGVmdEFycm93QmFyXCI6XCJcXHUyMUU0XCIsXCJsZWZ0YXJyb3dcIjpcIlxcdTIxOTBcIixcIkxlZnRBcnJvd1wiOlwiXFx1MjE5MFwiLFwiTGVmdGFycm93XCI6XCJcXHUyMUQwXCIsXCJMZWZ0QXJyb3dSaWdodEFycm93XCI6XCJcXHUyMUM2XCIsXCJsZWZ0YXJyb3d0YWlsXCI6XCJcXHUyMUEyXCIsXCJMZWZ0Q2VpbGluZ1wiOlwiXFx1MjMwOFwiLFwiTGVmdERvdWJsZUJyYWNrZXRcIjpcIlxcdTI3RTZcIixcIkxlZnREb3duVGVlVmVjdG9yXCI6XCJcXHUyOTYxXCIsXCJMZWZ0RG93blZlY3RvckJhclwiOlwiXFx1Mjk1OVwiLFwiTGVmdERvd25WZWN0b3JcIjpcIlxcdTIxQzNcIixcIkxlZnRGbG9vclwiOlwiXFx1MjMwQVwiLFwibGVmdGhhcnBvb25kb3duXCI6XCJcXHUyMUJEXCIsXCJsZWZ0aGFycG9vbnVwXCI6XCJcXHUyMUJDXCIsXCJsZWZ0bGVmdGFycm93c1wiOlwiXFx1MjFDN1wiLFwibGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTIxOTRcIixcIkxlZnRSaWdodEFycm93XCI6XCJcXHUyMTk0XCIsXCJMZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjFENFwiLFwibGVmdHJpZ2h0YXJyb3dzXCI6XCJcXHUyMUM2XCIsXCJsZWZ0cmlnaHRoYXJwb29uc1wiOlwiXFx1MjFDQlwiLFwibGVmdHJpZ2h0c3F1aWdhcnJvd1wiOlwiXFx1MjFBRFwiLFwiTGVmdFJpZ2h0VmVjdG9yXCI6XCJcXHUyOTRFXCIsXCJMZWZ0VGVlQXJyb3dcIjpcIlxcdTIxQTRcIixcIkxlZnRUZWVcIjpcIlxcdTIyQTNcIixcIkxlZnRUZWVWZWN0b3JcIjpcIlxcdTI5NUFcIixcImxlZnR0aHJlZXRpbWVzXCI6XCJcXHUyMkNCXCIsXCJMZWZ0VHJpYW5nbGVCYXJcIjpcIlxcdTI5Q0ZcIixcIkxlZnRUcmlhbmdsZVwiOlwiXFx1MjJCMlwiLFwiTGVmdFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyQjRcIixcIkxlZnRVcERvd25WZWN0b3JcIjpcIlxcdTI5NTFcIixcIkxlZnRVcFRlZVZlY3RvclwiOlwiXFx1Mjk2MFwiLFwiTGVmdFVwVmVjdG9yQmFyXCI6XCJcXHUyOTU4XCIsXCJMZWZ0VXBWZWN0b3JcIjpcIlxcdTIxQkZcIixcIkxlZnRWZWN0b3JCYXJcIjpcIlxcdTI5NTJcIixcIkxlZnRWZWN0b3JcIjpcIlxcdTIxQkNcIixcImxFZ1wiOlwiXFx1MkE4QlwiLFwibGVnXCI6XCJcXHUyMkRBXCIsXCJsZXFcIjpcIlxcdTIyNjRcIixcImxlcXFcIjpcIlxcdTIyNjZcIixcImxlcXNsYW50XCI6XCJcXHUyQTdEXCIsXCJsZXNjY1wiOlwiXFx1MkFBOFwiLFwibGVzXCI6XCJcXHUyQTdEXCIsXCJsZXNkb3RcIjpcIlxcdTJBN0ZcIixcImxlc2RvdG9cIjpcIlxcdTJBODFcIixcImxlc2RvdG9yXCI6XCJcXHUyQTgzXCIsXCJsZXNnXCI6XCJcXHUyMkRBXFx1RkUwMFwiLFwibGVzZ2VzXCI6XCJcXHUyQTkzXCIsXCJsZXNzYXBwcm94XCI6XCJcXHUyQTg1XCIsXCJsZXNzZG90XCI6XCJcXHUyMkQ2XCIsXCJsZXNzZXFndHJcIjpcIlxcdTIyREFcIixcImxlc3NlcXFndHJcIjpcIlxcdTJBOEJcIixcIkxlc3NFcXVhbEdyZWF0ZXJcIjpcIlxcdTIyREFcIixcIkxlc3NGdWxsRXF1YWxcIjpcIlxcdTIyNjZcIixcIkxlc3NHcmVhdGVyXCI6XCJcXHUyMjc2XCIsXCJsZXNzZ3RyXCI6XCJcXHUyMjc2XCIsXCJMZXNzTGVzc1wiOlwiXFx1MkFBMVwiLFwibGVzc3NpbVwiOlwiXFx1MjI3MlwiLFwiTGVzc1NsYW50RXF1YWxcIjpcIlxcdTJBN0RcIixcIkxlc3NUaWxkZVwiOlwiXFx1MjI3MlwiLFwibGZpc2h0XCI6XCJcXHUyOTdDXCIsXCJsZmxvb3JcIjpcIlxcdTIzMEFcIixcIkxmclwiOlwiXFx1RDgzNVxcdUREMEZcIixcImxmclwiOlwiXFx1RDgzNVxcdUREMjlcIixcImxnXCI6XCJcXHUyMjc2XCIsXCJsZ0VcIjpcIlxcdTJBOTFcIixcImxIYXJcIjpcIlxcdTI5NjJcIixcImxoYXJkXCI6XCJcXHUyMUJEXCIsXCJsaGFydVwiOlwiXFx1MjFCQ1wiLFwibGhhcnVsXCI6XCJcXHUyOTZBXCIsXCJsaGJsa1wiOlwiXFx1MjU4NFwiLFwiTEpjeVwiOlwiXFx1MDQwOVwiLFwibGpjeVwiOlwiXFx1MDQ1OVwiLFwibGxhcnJcIjpcIlxcdTIxQzdcIixcImxsXCI6XCJcXHUyMjZBXCIsXCJMbFwiOlwiXFx1MjJEOFwiLFwibGxjb3JuZXJcIjpcIlxcdTIzMUVcIixcIkxsZWZ0YXJyb3dcIjpcIlxcdTIxREFcIixcImxsaGFyZFwiOlwiXFx1Mjk2QlwiLFwibGx0cmlcIjpcIlxcdTI1RkFcIixcIkxtaWRvdFwiOlwiXFx1MDEzRlwiLFwibG1pZG90XCI6XCJcXHUwMTQwXCIsXCJsbW91c3RhY2hlXCI6XCJcXHUyM0IwXCIsXCJsbW91c3RcIjpcIlxcdTIzQjBcIixcImxuYXBcIjpcIlxcdTJBODlcIixcImxuYXBwcm94XCI6XCJcXHUyQTg5XCIsXCJsbmVcIjpcIlxcdTJBODdcIixcImxuRVwiOlwiXFx1MjI2OFwiLFwibG5lcVwiOlwiXFx1MkE4N1wiLFwibG5lcXFcIjpcIlxcdTIyNjhcIixcImxuc2ltXCI6XCJcXHUyMkU2XCIsXCJsb2FuZ1wiOlwiXFx1MjdFQ1wiLFwibG9hcnJcIjpcIlxcdTIxRkRcIixcImxvYnJrXCI6XCJcXHUyN0U2XCIsXCJsb25nbGVmdGFycm93XCI6XCJcXHUyN0Y1XCIsXCJMb25nTGVmdEFycm93XCI6XCJcXHUyN0Y1XCIsXCJMb25nbGVmdGFycm93XCI6XCJcXHUyN0Y4XCIsXCJsb25nbGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTI3RjdcIixcIkxvbmdMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjdGN1wiLFwiTG9uZ2xlZnRyaWdodGFycm93XCI6XCJcXHUyN0ZBXCIsXCJsb25nbWFwc3RvXCI6XCJcXHUyN0ZDXCIsXCJsb25ncmlnaHRhcnJvd1wiOlwiXFx1MjdGNlwiLFwiTG9uZ1JpZ2h0QXJyb3dcIjpcIlxcdTI3RjZcIixcIkxvbmdyaWdodGFycm93XCI6XCJcXHUyN0Y5XCIsXCJsb29wYXJyb3dsZWZ0XCI6XCJcXHUyMUFCXCIsXCJsb29wYXJyb3dyaWdodFwiOlwiXFx1MjFBQ1wiLFwibG9wYXJcIjpcIlxcdTI5ODVcIixcIkxvcGZcIjpcIlxcdUQ4MzVcXHVERDQzXCIsXCJsb3BmXCI6XCJcXHVEODM1XFx1REQ1RFwiLFwibG9wbHVzXCI6XCJcXHUyQTJEXCIsXCJsb3RpbWVzXCI6XCJcXHUyQTM0XCIsXCJsb3dhc3RcIjpcIlxcdTIyMTdcIixcImxvd2JhclwiOlwiX1wiLFwiTG93ZXJMZWZ0QXJyb3dcIjpcIlxcdTIxOTlcIixcIkxvd2VyUmlnaHRBcnJvd1wiOlwiXFx1MjE5OFwiLFwibG96XCI6XCJcXHUyNUNBXCIsXCJsb3plbmdlXCI6XCJcXHUyNUNBXCIsXCJsb3pmXCI6XCJcXHUyOUVCXCIsXCJscGFyXCI6XCIoXCIsXCJscGFybHRcIjpcIlxcdTI5OTNcIixcImxyYXJyXCI6XCJcXHUyMUM2XCIsXCJscmNvcm5lclwiOlwiXFx1MjMxRlwiLFwibHJoYXJcIjpcIlxcdTIxQ0JcIixcImxyaGFyZFwiOlwiXFx1Mjk2RFwiLFwibHJtXCI6XCJcXHUyMDBFXCIsXCJscnRyaVwiOlwiXFx1MjJCRlwiLFwibHNhcXVvXCI6XCJcXHUyMDM5XCIsXCJsc2NyXCI6XCJcXHVEODM1XFx1RENDMVwiLFwiTHNjclwiOlwiXFx1MjExMlwiLFwibHNoXCI6XCJcXHUyMUIwXCIsXCJMc2hcIjpcIlxcdTIxQjBcIixcImxzaW1cIjpcIlxcdTIyNzJcIixcImxzaW1lXCI6XCJcXHUyQThEXCIsXCJsc2ltZ1wiOlwiXFx1MkE4RlwiLFwibHNxYlwiOlwiW1wiLFwibHNxdW9cIjpcIlxcdTIwMThcIixcImxzcXVvclwiOlwiXFx1MjAxQVwiLFwiTHN0cm9rXCI6XCJcXHUwMTQxXCIsXCJsc3Ryb2tcIjpcIlxcdTAxNDJcIixcImx0Y2NcIjpcIlxcdTJBQTZcIixcImx0Y2lyXCI6XCJcXHUyQTc5XCIsXCJsdFwiOlwiPFwiLFwiTFRcIjpcIjxcIixcIkx0XCI6XCJcXHUyMjZBXCIsXCJsdGRvdFwiOlwiXFx1MjJENlwiLFwibHRocmVlXCI6XCJcXHUyMkNCXCIsXCJsdGltZXNcIjpcIlxcdTIyQzlcIixcImx0bGFyclwiOlwiXFx1Mjk3NlwiLFwibHRxdWVzdFwiOlwiXFx1MkE3QlwiLFwibHRyaVwiOlwiXFx1MjVDM1wiLFwibHRyaWVcIjpcIlxcdTIyQjRcIixcImx0cmlmXCI6XCJcXHUyNUMyXCIsXCJsdHJQYXJcIjpcIlxcdTI5OTZcIixcImx1cmRzaGFyXCI6XCJcXHUyOTRBXCIsXCJsdXJ1aGFyXCI6XCJcXHUyOTY2XCIsXCJsdmVydG5lcXFcIjpcIlxcdTIyNjhcXHVGRTAwXCIsXCJsdm5FXCI6XCJcXHUyMjY4XFx1RkUwMFwiLFwibWFjclwiOlwiXFx1MDBBRlwiLFwibWFsZVwiOlwiXFx1MjY0MlwiLFwibWFsdFwiOlwiXFx1MjcyMFwiLFwibWFsdGVzZVwiOlwiXFx1MjcyMFwiLFwiTWFwXCI6XCJcXHUyOTA1XCIsXCJtYXBcIjpcIlxcdTIxQTZcIixcIm1hcHN0b1wiOlwiXFx1MjFBNlwiLFwibWFwc3RvZG93blwiOlwiXFx1MjFBN1wiLFwibWFwc3RvbGVmdFwiOlwiXFx1MjFBNFwiLFwibWFwc3RvdXBcIjpcIlxcdTIxQTVcIixcIm1hcmtlclwiOlwiXFx1MjVBRVwiLFwibWNvbW1hXCI6XCJcXHUyQTI5XCIsXCJNY3lcIjpcIlxcdTA0MUNcIixcIm1jeVwiOlwiXFx1MDQzQ1wiLFwibWRhc2hcIjpcIlxcdTIwMTRcIixcIm1ERG90XCI6XCJcXHUyMjNBXCIsXCJtZWFzdXJlZGFuZ2xlXCI6XCJcXHUyMjIxXCIsXCJNZWRpdW1TcGFjZVwiOlwiXFx1MjA1RlwiLFwiTWVsbGludHJmXCI6XCJcXHUyMTMzXCIsXCJNZnJcIjpcIlxcdUQ4MzVcXHVERDEwXCIsXCJtZnJcIjpcIlxcdUQ4MzVcXHVERDJBXCIsXCJtaG9cIjpcIlxcdTIxMjdcIixcIm1pY3JvXCI6XCJcXHUwMEI1XCIsXCJtaWRhc3RcIjpcIipcIixcIm1pZGNpclwiOlwiXFx1MkFGMFwiLFwibWlkXCI6XCJcXHUyMjIzXCIsXCJtaWRkb3RcIjpcIlxcdTAwQjdcIixcIm1pbnVzYlwiOlwiXFx1MjI5RlwiLFwibWludXNcIjpcIlxcdTIyMTJcIixcIm1pbnVzZFwiOlwiXFx1MjIzOFwiLFwibWludXNkdVwiOlwiXFx1MkEyQVwiLFwiTWludXNQbHVzXCI6XCJcXHUyMjEzXCIsXCJtbGNwXCI6XCJcXHUyQURCXCIsXCJtbGRyXCI6XCJcXHUyMDI2XCIsXCJtbnBsdXNcIjpcIlxcdTIyMTNcIixcIm1vZGVsc1wiOlwiXFx1MjJBN1wiLFwiTW9wZlwiOlwiXFx1RDgzNVxcdURENDRcIixcIm1vcGZcIjpcIlxcdUQ4MzVcXHVERDVFXCIsXCJtcFwiOlwiXFx1MjIxM1wiLFwibXNjclwiOlwiXFx1RDgzNVxcdURDQzJcIixcIk1zY3JcIjpcIlxcdTIxMzNcIixcIm1zdHBvc1wiOlwiXFx1MjIzRVwiLFwiTXVcIjpcIlxcdTAzOUNcIixcIm11XCI6XCJcXHUwM0JDXCIsXCJtdWx0aW1hcFwiOlwiXFx1MjJCOFwiLFwibXVtYXBcIjpcIlxcdTIyQjhcIixcIm5hYmxhXCI6XCJcXHUyMjA3XCIsXCJOYWN1dGVcIjpcIlxcdTAxNDNcIixcIm5hY3V0ZVwiOlwiXFx1MDE0NFwiLFwibmFuZ1wiOlwiXFx1MjIyMFxcdTIwRDJcIixcIm5hcFwiOlwiXFx1MjI0OVwiLFwibmFwRVwiOlwiXFx1MkE3MFxcdTAzMzhcIixcIm5hcGlkXCI6XCJcXHUyMjRCXFx1MDMzOFwiLFwibmFwb3NcIjpcIlxcdTAxNDlcIixcIm5hcHByb3hcIjpcIlxcdTIyNDlcIixcIm5hdHVyYWxcIjpcIlxcdTI2NkVcIixcIm5hdHVyYWxzXCI6XCJcXHUyMTE1XCIsXCJuYXR1clwiOlwiXFx1MjY2RVwiLFwibmJzcFwiOlwiXFx1MDBBMFwiLFwibmJ1bXBcIjpcIlxcdTIyNEVcXHUwMzM4XCIsXCJuYnVtcGVcIjpcIlxcdTIyNEZcXHUwMzM4XCIsXCJuY2FwXCI6XCJcXHUyQTQzXCIsXCJOY2Fyb25cIjpcIlxcdTAxNDdcIixcIm5jYXJvblwiOlwiXFx1MDE0OFwiLFwiTmNlZGlsXCI6XCJcXHUwMTQ1XCIsXCJuY2VkaWxcIjpcIlxcdTAxNDZcIixcIm5jb25nXCI6XCJcXHUyMjQ3XCIsXCJuY29uZ2RvdFwiOlwiXFx1MkE2RFxcdTAzMzhcIixcIm5jdXBcIjpcIlxcdTJBNDJcIixcIk5jeVwiOlwiXFx1MDQxRFwiLFwibmN5XCI6XCJcXHUwNDNEXCIsXCJuZGFzaFwiOlwiXFx1MjAxM1wiLFwibmVhcmhrXCI6XCJcXHUyOTI0XCIsXCJuZWFyclwiOlwiXFx1MjE5N1wiLFwibmVBcnJcIjpcIlxcdTIxRDdcIixcIm5lYXJyb3dcIjpcIlxcdTIxOTdcIixcIm5lXCI6XCJcXHUyMjYwXCIsXCJuZWRvdFwiOlwiXFx1MjI1MFxcdTAzMzhcIixcIk5lZ2F0aXZlTWVkaXVtU3BhY2VcIjpcIlxcdTIwMEJcIixcIk5lZ2F0aXZlVGhpY2tTcGFjZVwiOlwiXFx1MjAwQlwiLFwiTmVnYXRpdmVUaGluU3BhY2VcIjpcIlxcdTIwMEJcIixcIk5lZ2F0aXZlVmVyeVRoaW5TcGFjZVwiOlwiXFx1MjAwQlwiLFwibmVxdWl2XCI6XCJcXHUyMjYyXCIsXCJuZXNlYXJcIjpcIlxcdTI5MjhcIixcIm5lc2ltXCI6XCJcXHUyMjQyXFx1MDMzOFwiLFwiTmVzdGVkR3JlYXRlckdyZWF0ZXJcIjpcIlxcdTIyNkJcIixcIk5lc3RlZExlc3NMZXNzXCI6XCJcXHUyMjZBXCIsXCJOZXdMaW5lXCI6XCJcXG5cIixcIm5leGlzdFwiOlwiXFx1MjIwNFwiLFwibmV4aXN0c1wiOlwiXFx1MjIwNFwiLFwiTmZyXCI6XCJcXHVEODM1XFx1REQxMVwiLFwibmZyXCI6XCJcXHVEODM1XFx1REQyQlwiLFwibmdFXCI6XCJcXHUyMjY3XFx1MDMzOFwiLFwibmdlXCI6XCJcXHUyMjcxXCIsXCJuZ2VxXCI6XCJcXHUyMjcxXCIsXCJuZ2VxcVwiOlwiXFx1MjI2N1xcdTAzMzhcIixcIm5nZXFzbGFudFwiOlwiXFx1MkE3RVxcdTAzMzhcIixcIm5nZXNcIjpcIlxcdTJBN0VcXHUwMzM4XCIsXCJuR2dcIjpcIlxcdTIyRDlcXHUwMzM4XCIsXCJuZ3NpbVwiOlwiXFx1MjI3NVwiLFwibkd0XCI6XCJcXHUyMjZCXFx1MjBEMlwiLFwibmd0XCI6XCJcXHUyMjZGXCIsXCJuZ3RyXCI6XCJcXHUyMjZGXCIsXCJuR3R2XCI6XCJcXHUyMjZCXFx1MDMzOFwiLFwibmhhcnJcIjpcIlxcdTIxQUVcIixcIm5oQXJyXCI6XCJcXHUyMUNFXCIsXCJuaHBhclwiOlwiXFx1MkFGMlwiLFwibmlcIjpcIlxcdTIyMEJcIixcIm5pc1wiOlwiXFx1MjJGQ1wiLFwibmlzZFwiOlwiXFx1MjJGQVwiLFwibml2XCI6XCJcXHUyMjBCXCIsXCJOSmN5XCI6XCJcXHUwNDBBXCIsXCJuamN5XCI6XCJcXHUwNDVBXCIsXCJubGFyclwiOlwiXFx1MjE5QVwiLFwibmxBcnJcIjpcIlxcdTIxQ0RcIixcIm5sZHJcIjpcIlxcdTIwMjVcIixcIm5sRVwiOlwiXFx1MjI2NlxcdTAzMzhcIixcIm5sZVwiOlwiXFx1MjI3MFwiLFwibmxlZnRhcnJvd1wiOlwiXFx1MjE5QVwiLFwibkxlZnRhcnJvd1wiOlwiXFx1MjFDRFwiLFwibmxlZnRyaWdodGFycm93XCI6XCJcXHUyMUFFXCIsXCJuTGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTIxQ0VcIixcIm5sZXFcIjpcIlxcdTIyNzBcIixcIm5sZXFxXCI6XCJcXHUyMjY2XFx1MDMzOFwiLFwibmxlcXNsYW50XCI6XCJcXHUyQTdEXFx1MDMzOFwiLFwibmxlc1wiOlwiXFx1MkE3RFxcdTAzMzhcIixcIm5sZXNzXCI6XCJcXHUyMjZFXCIsXCJuTGxcIjpcIlxcdTIyRDhcXHUwMzM4XCIsXCJubHNpbVwiOlwiXFx1MjI3NFwiLFwibkx0XCI6XCJcXHUyMjZBXFx1MjBEMlwiLFwibmx0XCI6XCJcXHUyMjZFXCIsXCJubHRyaVwiOlwiXFx1MjJFQVwiLFwibmx0cmllXCI6XCJcXHUyMkVDXCIsXCJuTHR2XCI6XCJcXHUyMjZBXFx1MDMzOFwiLFwibm1pZFwiOlwiXFx1MjIyNFwiLFwiTm9CcmVha1wiOlwiXFx1MjA2MFwiLFwiTm9uQnJlYWtpbmdTcGFjZVwiOlwiXFx1MDBBMFwiLFwibm9wZlwiOlwiXFx1RDgzNVxcdURENUZcIixcIk5vcGZcIjpcIlxcdTIxMTVcIixcIk5vdFwiOlwiXFx1MkFFQ1wiLFwibm90XCI6XCJcXHUwMEFDXCIsXCJOb3RDb25ncnVlbnRcIjpcIlxcdTIyNjJcIixcIk5vdEN1cENhcFwiOlwiXFx1MjI2RFwiLFwiTm90RG91YmxlVmVydGljYWxCYXJcIjpcIlxcdTIyMjZcIixcIk5vdEVsZW1lbnRcIjpcIlxcdTIyMDlcIixcIk5vdEVxdWFsXCI6XCJcXHUyMjYwXCIsXCJOb3RFcXVhbFRpbGRlXCI6XCJcXHUyMjQyXFx1MDMzOFwiLFwiTm90RXhpc3RzXCI6XCJcXHUyMjA0XCIsXCJOb3RHcmVhdGVyXCI6XCJcXHUyMjZGXCIsXCJOb3RHcmVhdGVyRXF1YWxcIjpcIlxcdTIyNzFcIixcIk5vdEdyZWF0ZXJGdWxsRXF1YWxcIjpcIlxcdTIyNjdcXHUwMzM4XCIsXCJOb3RHcmVhdGVyR3JlYXRlclwiOlwiXFx1MjI2QlxcdTAzMzhcIixcIk5vdEdyZWF0ZXJMZXNzXCI6XCJcXHUyMjc5XCIsXCJOb3RHcmVhdGVyU2xhbnRFcXVhbFwiOlwiXFx1MkE3RVxcdTAzMzhcIixcIk5vdEdyZWF0ZXJUaWxkZVwiOlwiXFx1MjI3NVwiLFwiTm90SHVtcERvd25IdW1wXCI6XCJcXHUyMjRFXFx1MDMzOFwiLFwiTm90SHVtcEVxdWFsXCI6XCJcXHUyMjRGXFx1MDMzOFwiLFwibm90aW5cIjpcIlxcdTIyMDlcIixcIm5vdGluZG90XCI6XCJcXHUyMkY1XFx1MDMzOFwiLFwibm90aW5FXCI6XCJcXHUyMkY5XFx1MDMzOFwiLFwibm90aW52YVwiOlwiXFx1MjIwOVwiLFwibm90aW52YlwiOlwiXFx1MjJGN1wiLFwibm90aW52Y1wiOlwiXFx1MjJGNlwiLFwiTm90TGVmdFRyaWFuZ2xlQmFyXCI6XCJcXHUyOUNGXFx1MDMzOFwiLFwiTm90TGVmdFRyaWFuZ2xlXCI6XCJcXHUyMkVBXCIsXCJOb3RMZWZ0VHJpYW5nbGVFcXVhbFwiOlwiXFx1MjJFQ1wiLFwiTm90TGVzc1wiOlwiXFx1MjI2RVwiLFwiTm90TGVzc0VxdWFsXCI6XCJcXHUyMjcwXCIsXCJOb3RMZXNzR3JlYXRlclwiOlwiXFx1MjI3OFwiLFwiTm90TGVzc0xlc3NcIjpcIlxcdTIyNkFcXHUwMzM4XCIsXCJOb3RMZXNzU2xhbnRFcXVhbFwiOlwiXFx1MkE3RFxcdTAzMzhcIixcIk5vdExlc3NUaWxkZVwiOlwiXFx1MjI3NFwiLFwiTm90TmVzdGVkR3JlYXRlckdyZWF0ZXJcIjpcIlxcdTJBQTJcXHUwMzM4XCIsXCJOb3ROZXN0ZWRMZXNzTGVzc1wiOlwiXFx1MkFBMVxcdTAzMzhcIixcIm5vdG5pXCI6XCJcXHUyMjBDXCIsXCJub3RuaXZhXCI6XCJcXHUyMjBDXCIsXCJub3RuaXZiXCI6XCJcXHUyMkZFXCIsXCJub3RuaXZjXCI6XCJcXHUyMkZEXCIsXCJOb3RQcmVjZWRlc1wiOlwiXFx1MjI4MFwiLFwiTm90UHJlY2VkZXNFcXVhbFwiOlwiXFx1MkFBRlxcdTAzMzhcIixcIk5vdFByZWNlZGVzU2xhbnRFcXVhbFwiOlwiXFx1MjJFMFwiLFwiTm90UmV2ZXJzZUVsZW1lbnRcIjpcIlxcdTIyMENcIixcIk5vdFJpZ2h0VHJpYW5nbGVCYXJcIjpcIlxcdTI5RDBcXHUwMzM4XCIsXCJOb3RSaWdodFRyaWFuZ2xlXCI6XCJcXHUyMkVCXCIsXCJOb3RSaWdodFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyRURcIixcIk5vdFNxdWFyZVN1YnNldFwiOlwiXFx1MjI4RlxcdTAzMzhcIixcIk5vdFNxdWFyZVN1YnNldEVxdWFsXCI6XCJcXHUyMkUyXCIsXCJOb3RTcXVhcmVTdXBlcnNldFwiOlwiXFx1MjI5MFxcdTAzMzhcIixcIk5vdFNxdWFyZVN1cGVyc2V0RXF1YWxcIjpcIlxcdTIyRTNcIixcIk5vdFN1YnNldFwiOlwiXFx1MjI4MlxcdTIwRDJcIixcIk5vdFN1YnNldEVxdWFsXCI6XCJcXHUyMjg4XCIsXCJOb3RTdWNjZWVkc1wiOlwiXFx1MjI4MVwiLFwiTm90U3VjY2VlZHNFcXVhbFwiOlwiXFx1MkFCMFxcdTAzMzhcIixcIk5vdFN1Y2NlZWRzU2xhbnRFcXVhbFwiOlwiXFx1MjJFMVwiLFwiTm90U3VjY2VlZHNUaWxkZVwiOlwiXFx1MjI3RlxcdTAzMzhcIixcIk5vdFN1cGVyc2V0XCI6XCJcXHUyMjgzXFx1MjBEMlwiLFwiTm90U3VwZXJzZXRFcXVhbFwiOlwiXFx1MjI4OVwiLFwiTm90VGlsZGVcIjpcIlxcdTIyNDFcIixcIk5vdFRpbGRlRXF1YWxcIjpcIlxcdTIyNDRcIixcIk5vdFRpbGRlRnVsbEVxdWFsXCI6XCJcXHUyMjQ3XCIsXCJOb3RUaWxkZVRpbGRlXCI6XCJcXHUyMjQ5XCIsXCJOb3RWZXJ0aWNhbEJhclwiOlwiXFx1MjIyNFwiLFwibnBhcmFsbGVsXCI6XCJcXHUyMjI2XCIsXCJucGFyXCI6XCJcXHUyMjI2XCIsXCJucGFyc2xcIjpcIlxcdTJBRkRcXHUyMEU1XCIsXCJucGFydFwiOlwiXFx1MjIwMlxcdTAzMzhcIixcIm5wb2xpbnRcIjpcIlxcdTJBMTRcIixcIm5wclwiOlwiXFx1MjI4MFwiLFwibnByY3VlXCI6XCJcXHUyMkUwXCIsXCJucHJlY1wiOlwiXFx1MjI4MFwiLFwibnByZWNlcVwiOlwiXFx1MkFBRlxcdTAzMzhcIixcIm5wcmVcIjpcIlxcdTJBQUZcXHUwMzM4XCIsXCJucmFycmNcIjpcIlxcdTI5MzNcXHUwMzM4XCIsXCJucmFyclwiOlwiXFx1MjE5QlwiLFwibnJBcnJcIjpcIlxcdTIxQ0ZcIixcIm5yYXJyd1wiOlwiXFx1MjE5RFxcdTAzMzhcIixcIm5yaWdodGFycm93XCI6XCJcXHUyMTlCXCIsXCJuUmlnaHRhcnJvd1wiOlwiXFx1MjFDRlwiLFwibnJ0cmlcIjpcIlxcdTIyRUJcIixcIm5ydHJpZVwiOlwiXFx1MjJFRFwiLFwibnNjXCI6XCJcXHUyMjgxXCIsXCJuc2NjdWVcIjpcIlxcdTIyRTFcIixcIm5zY2VcIjpcIlxcdTJBQjBcXHUwMzM4XCIsXCJOc2NyXCI6XCJcXHVEODM1XFx1RENBOVwiLFwibnNjclwiOlwiXFx1RDgzNVxcdURDQzNcIixcIm5zaG9ydG1pZFwiOlwiXFx1MjIyNFwiLFwibnNob3J0cGFyYWxsZWxcIjpcIlxcdTIyMjZcIixcIm5zaW1cIjpcIlxcdTIyNDFcIixcIm5zaW1lXCI6XCJcXHUyMjQ0XCIsXCJuc2ltZXFcIjpcIlxcdTIyNDRcIixcIm5zbWlkXCI6XCJcXHUyMjI0XCIsXCJuc3BhclwiOlwiXFx1MjIyNlwiLFwibnNxc3ViZVwiOlwiXFx1MjJFMlwiLFwibnNxc3VwZVwiOlwiXFx1MjJFM1wiLFwibnN1YlwiOlwiXFx1MjI4NFwiLFwibnN1YkVcIjpcIlxcdTJBQzVcXHUwMzM4XCIsXCJuc3ViZVwiOlwiXFx1MjI4OFwiLFwibnN1YnNldFwiOlwiXFx1MjI4MlxcdTIwRDJcIixcIm5zdWJzZXRlcVwiOlwiXFx1MjI4OFwiLFwibnN1YnNldGVxcVwiOlwiXFx1MkFDNVxcdTAzMzhcIixcIm5zdWNjXCI6XCJcXHUyMjgxXCIsXCJuc3VjY2VxXCI6XCJcXHUyQUIwXFx1MDMzOFwiLFwibnN1cFwiOlwiXFx1MjI4NVwiLFwibnN1cEVcIjpcIlxcdTJBQzZcXHUwMzM4XCIsXCJuc3VwZVwiOlwiXFx1MjI4OVwiLFwibnN1cHNldFwiOlwiXFx1MjI4M1xcdTIwRDJcIixcIm5zdXBzZXRlcVwiOlwiXFx1MjI4OVwiLFwibnN1cHNldGVxcVwiOlwiXFx1MkFDNlxcdTAzMzhcIixcIm50Z2xcIjpcIlxcdTIyNzlcIixcIk50aWxkZVwiOlwiXFx1MDBEMVwiLFwibnRpbGRlXCI6XCJcXHUwMEYxXCIsXCJudGxnXCI6XCJcXHUyMjc4XCIsXCJudHJpYW5nbGVsZWZ0XCI6XCJcXHUyMkVBXCIsXCJudHJpYW5nbGVsZWZ0ZXFcIjpcIlxcdTIyRUNcIixcIm50cmlhbmdsZXJpZ2h0XCI6XCJcXHUyMkVCXCIsXCJudHJpYW5nbGVyaWdodGVxXCI6XCJcXHUyMkVEXCIsXCJOdVwiOlwiXFx1MDM5RFwiLFwibnVcIjpcIlxcdTAzQkRcIixcIm51bVwiOlwiI1wiLFwibnVtZXJvXCI6XCJcXHUyMTE2XCIsXCJudW1zcFwiOlwiXFx1MjAwN1wiLFwibnZhcFwiOlwiXFx1MjI0RFxcdTIwRDJcIixcIm52ZGFzaFwiOlwiXFx1MjJBQ1wiLFwibnZEYXNoXCI6XCJcXHUyMkFEXCIsXCJuVmRhc2hcIjpcIlxcdTIyQUVcIixcIm5WRGFzaFwiOlwiXFx1MjJBRlwiLFwibnZnZVwiOlwiXFx1MjI2NVxcdTIwRDJcIixcIm52Z3RcIjpcIj5cXHUyMEQyXCIsXCJudkhhcnJcIjpcIlxcdTI5MDRcIixcIm52aW5maW5cIjpcIlxcdTI5REVcIixcIm52bEFyclwiOlwiXFx1MjkwMlwiLFwibnZsZVwiOlwiXFx1MjI2NFxcdTIwRDJcIixcIm52bHRcIjpcIjxcXHUyMEQyXCIsXCJudmx0cmllXCI6XCJcXHUyMkI0XFx1MjBEMlwiLFwibnZyQXJyXCI6XCJcXHUyOTAzXCIsXCJudnJ0cmllXCI6XCJcXHUyMkI1XFx1MjBEMlwiLFwibnZzaW1cIjpcIlxcdTIyM0NcXHUyMEQyXCIsXCJud2FyaGtcIjpcIlxcdTI5MjNcIixcIm53YXJyXCI6XCJcXHUyMTk2XCIsXCJud0FyclwiOlwiXFx1MjFENlwiLFwibndhcnJvd1wiOlwiXFx1MjE5NlwiLFwibnduZWFyXCI6XCJcXHUyOTI3XCIsXCJPYWN1dGVcIjpcIlxcdTAwRDNcIixcIm9hY3V0ZVwiOlwiXFx1MDBGM1wiLFwib2FzdFwiOlwiXFx1MjI5QlwiLFwiT2NpcmNcIjpcIlxcdTAwRDRcIixcIm9jaXJjXCI6XCJcXHUwMEY0XCIsXCJvY2lyXCI6XCJcXHUyMjlBXCIsXCJPY3lcIjpcIlxcdTA0MUVcIixcIm9jeVwiOlwiXFx1MDQzRVwiLFwib2Rhc2hcIjpcIlxcdTIyOURcIixcIk9kYmxhY1wiOlwiXFx1MDE1MFwiLFwib2RibGFjXCI6XCJcXHUwMTUxXCIsXCJvZGl2XCI6XCJcXHUyQTM4XCIsXCJvZG90XCI6XCJcXHUyMjk5XCIsXCJvZHNvbGRcIjpcIlxcdTI5QkNcIixcIk9FbGlnXCI6XCJcXHUwMTUyXCIsXCJvZWxpZ1wiOlwiXFx1MDE1M1wiLFwib2ZjaXJcIjpcIlxcdTI5QkZcIixcIk9mclwiOlwiXFx1RDgzNVxcdUREMTJcIixcIm9mclwiOlwiXFx1RDgzNVxcdUREMkNcIixcIm9nb25cIjpcIlxcdTAyREJcIixcIk9ncmF2ZVwiOlwiXFx1MDBEMlwiLFwib2dyYXZlXCI6XCJcXHUwMEYyXCIsXCJvZ3RcIjpcIlxcdTI5QzFcIixcIm9oYmFyXCI6XCJcXHUyOUI1XCIsXCJvaG1cIjpcIlxcdTAzQTlcIixcIm9pbnRcIjpcIlxcdTIyMkVcIixcIm9sYXJyXCI6XCJcXHUyMUJBXCIsXCJvbGNpclwiOlwiXFx1MjlCRVwiLFwib2xjcm9zc1wiOlwiXFx1MjlCQlwiLFwib2xpbmVcIjpcIlxcdTIwM0VcIixcIm9sdFwiOlwiXFx1MjlDMFwiLFwiT21hY3JcIjpcIlxcdTAxNENcIixcIm9tYWNyXCI6XCJcXHUwMTREXCIsXCJPbWVnYVwiOlwiXFx1MDNBOVwiLFwib21lZ2FcIjpcIlxcdTAzQzlcIixcIk9taWNyb25cIjpcIlxcdTAzOUZcIixcIm9taWNyb25cIjpcIlxcdTAzQkZcIixcIm9taWRcIjpcIlxcdTI5QjZcIixcIm9taW51c1wiOlwiXFx1MjI5NlwiLFwiT29wZlwiOlwiXFx1RDgzNVxcdURENDZcIixcIm9vcGZcIjpcIlxcdUQ4MzVcXHVERDYwXCIsXCJvcGFyXCI6XCJcXHUyOUI3XCIsXCJPcGVuQ3VybHlEb3VibGVRdW90ZVwiOlwiXFx1MjAxQ1wiLFwiT3BlbkN1cmx5UXVvdGVcIjpcIlxcdTIwMThcIixcIm9wZXJwXCI6XCJcXHUyOUI5XCIsXCJvcGx1c1wiOlwiXFx1MjI5NVwiLFwib3JhcnJcIjpcIlxcdTIxQkJcIixcIk9yXCI6XCJcXHUyQTU0XCIsXCJvclwiOlwiXFx1MjIyOFwiLFwib3JkXCI6XCJcXHUyQTVEXCIsXCJvcmRlclwiOlwiXFx1MjEzNFwiLFwib3JkZXJvZlwiOlwiXFx1MjEzNFwiLFwib3JkZlwiOlwiXFx1MDBBQVwiLFwib3JkbVwiOlwiXFx1MDBCQVwiLFwib3JpZ29mXCI6XCJcXHUyMkI2XCIsXCJvcm9yXCI6XCJcXHUyQTU2XCIsXCJvcnNsb3BlXCI6XCJcXHUyQTU3XCIsXCJvcnZcIjpcIlxcdTJBNUJcIixcIm9TXCI6XCJcXHUyNEM4XCIsXCJPc2NyXCI6XCJcXHVEODM1XFx1RENBQVwiLFwib3NjclwiOlwiXFx1MjEzNFwiLFwiT3NsYXNoXCI6XCJcXHUwMEQ4XCIsXCJvc2xhc2hcIjpcIlxcdTAwRjhcIixcIm9zb2xcIjpcIlxcdTIyOThcIixcIk90aWxkZVwiOlwiXFx1MDBENVwiLFwib3RpbGRlXCI6XCJcXHUwMEY1XCIsXCJvdGltZXNhc1wiOlwiXFx1MkEzNlwiLFwiT3RpbWVzXCI6XCJcXHUyQTM3XCIsXCJvdGltZXNcIjpcIlxcdTIyOTdcIixcIk91bWxcIjpcIlxcdTAwRDZcIixcIm91bWxcIjpcIlxcdTAwRjZcIixcIm92YmFyXCI6XCJcXHUyMzNEXCIsXCJPdmVyQmFyXCI6XCJcXHUyMDNFXCIsXCJPdmVyQnJhY2VcIjpcIlxcdTIzREVcIixcIk92ZXJCcmFja2V0XCI6XCJcXHUyM0I0XCIsXCJPdmVyUGFyZW50aGVzaXNcIjpcIlxcdTIzRENcIixcInBhcmFcIjpcIlxcdTAwQjZcIixcInBhcmFsbGVsXCI6XCJcXHUyMjI1XCIsXCJwYXJcIjpcIlxcdTIyMjVcIixcInBhcnNpbVwiOlwiXFx1MkFGM1wiLFwicGFyc2xcIjpcIlxcdTJBRkRcIixcInBhcnRcIjpcIlxcdTIyMDJcIixcIlBhcnRpYWxEXCI6XCJcXHUyMjAyXCIsXCJQY3lcIjpcIlxcdTA0MUZcIixcInBjeVwiOlwiXFx1MDQzRlwiLFwicGVyY250XCI6XCIlXCIsXCJwZXJpb2RcIjpcIi5cIixcInBlcm1pbFwiOlwiXFx1MjAzMFwiLFwicGVycFwiOlwiXFx1MjJBNVwiLFwicGVydGVua1wiOlwiXFx1MjAzMVwiLFwiUGZyXCI6XCJcXHVEODM1XFx1REQxM1wiLFwicGZyXCI6XCJcXHVEODM1XFx1REQyRFwiLFwiUGhpXCI6XCJcXHUwM0E2XCIsXCJwaGlcIjpcIlxcdTAzQzZcIixcInBoaXZcIjpcIlxcdTAzRDVcIixcInBobW1hdFwiOlwiXFx1MjEzM1wiLFwicGhvbmVcIjpcIlxcdTI2MEVcIixcIlBpXCI6XCJcXHUwM0EwXCIsXCJwaVwiOlwiXFx1MDNDMFwiLFwicGl0Y2hmb3JrXCI6XCJcXHUyMkQ0XCIsXCJwaXZcIjpcIlxcdTAzRDZcIixcInBsYW5ja1wiOlwiXFx1MjEwRlwiLFwicGxhbmNraFwiOlwiXFx1MjEwRVwiLFwicGxhbmt2XCI6XCJcXHUyMTBGXCIsXCJwbHVzYWNpclwiOlwiXFx1MkEyM1wiLFwicGx1c2JcIjpcIlxcdTIyOUVcIixcInBsdXNjaXJcIjpcIlxcdTJBMjJcIixcInBsdXNcIjpcIitcIixcInBsdXNkb1wiOlwiXFx1MjIxNFwiLFwicGx1c2R1XCI6XCJcXHUyQTI1XCIsXCJwbHVzZVwiOlwiXFx1MkE3MlwiLFwiUGx1c01pbnVzXCI6XCJcXHUwMEIxXCIsXCJwbHVzbW5cIjpcIlxcdTAwQjFcIixcInBsdXNzaW1cIjpcIlxcdTJBMjZcIixcInBsdXN0d29cIjpcIlxcdTJBMjdcIixcInBtXCI6XCJcXHUwMEIxXCIsXCJQb2luY2FyZXBsYW5lXCI6XCJcXHUyMTBDXCIsXCJwb2ludGludFwiOlwiXFx1MkExNVwiLFwicG9wZlwiOlwiXFx1RDgzNVxcdURENjFcIixcIlBvcGZcIjpcIlxcdTIxMTlcIixcInBvdW5kXCI6XCJcXHUwMEEzXCIsXCJwcmFwXCI6XCJcXHUyQUI3XCIsXCJQclwiOlwiXFx1MkFCQlwiLFwicHJcIjpcIlxcdTIyN0FcIixcInByY3VlXCI6XCJcXHUyMjdDXCIsXCJwcmVjYXBwcm94XCI6XCJcXHUyQUI3XCIsXCJwcmVjXCI6XCJcXHUyMjdBXCIsXCJwcmVjY3VybHllcVwiOlwiXFx1MjI3Q1wiLFwiUHJlY2VkZXNcIjpcIlxcdTIyN0FcIixcIlByZWNlZGVzRXF1YWxcIjpcIlxcdTJBQUZcIixcIlByZWNlZGVzU2xhbnRFcXVhbFwiOlwiXFx1MjI3Q1wiLFwiUHJlY2VkZXNUaWxkZVwiOlwiXFx1MjI3RVwiLFwicHJlY2VxXCI6XCJcXHUyQUFGXCIsXCJwcmVjbmFwcHJveFwiOlwiXFx1MkFCOVwiLFwicHJlY25lcXFcIjpcIlxcdTJBQjVcIixcInByZWNuc2ltXCI6XCJcXHUyMkU4XCIsXCJwcmVcIjpcIlxcdTJBQUZcIixcInByRVwiOlwiXFx1MkFCM1wiLFwicHJlY3NpbVwiOlwiXFx1MjI3RVwiLFwicHJpbWVcIjpcIlxcdTIwMzJcIixcIlByaW1lXCI6XCJcXHUyMDMzXCIsXCJwcmltZXNcIjpcIlxcdTIxMTlcIixcInBybmFwXCI6XCJcXHUyQUI5XCIsXCJwcm5FXCI6XCJcXHUyQUI1XCIsXCJwcm5zaW1cIjpcIlxcdTIyRThcIixcInByb2RcIjpcIlxcdTIyMEZcIixcIlByb2R1Y3RcIjpcIlxcdTIyMEZcIixcInByb2ZhbGFyXCI6XCJcXHUyMzJFXCIsXCJwcm9mbGluZVwiOlwiXFx1MjMxMlwiLFwicHJvZnN1cmZcIjpcIlxcdTIzMTNcIixcInByb3BcIjpcIlxcdTIyMURcIixcIlByb3BvcnRpb25hbFwiOlwiXFx1MjIxRFwiLFwiUHJvcG9ydGlvblwiOlwiXFx1MjIzN1wiLFwicHJvcHRvXCI6XCJcXHUyMjFEXCIsXCJwcnNpbVwiOlwiXFx1MjI3RVwiLFwicHJ1cmVsXCI6XCJcXHUyMkIwXCIsXCJQc2NyXCI6XCJcXHVEODM1XFx1RENBQlwiLFwicHNjclwiOlwiXFx1RDgzNVxcdURDQzVcIixcIlBzaVwiOlwiXFx1MDNBOFwiLFwicHNpXCI6XCJcXHUwM0M4XCIsXCJwdW5jc3BcIjpcIlxcdTIwMDhcIixcIlFmclwiOlwiXFx1RDgzNVxcdUREMTRcIixcInFmclwiOlwiXFx1RDgzNVxcdUREMkVcIixcInFpbnRcIjpcIlxcdTJBMENcIixcInFvcGZcIjpcIlxcdUQ4MzVcXHVERDYyXCIsXCJRb3BmXCI6XCJcXHUyMTFBXCIsXCJxcHJpbWVcIjpcIlxcdTIwNTdcIixcIlFzY3JcIjpcIlxcdUQ4MzVcXHVEQ0FDXCIsXCJxc2NyXCI6XCJcXHVEODM1XFx1RENDNlwiLFwicXVhdGVybmlvbnNcIjpcIlxcdTIxMERcIixcInF1YXRpbnRcIjpcIlxcdTJBMTZcIixcInF1ZXN0XCI6XCI/XCIsXCJxdWVzdGVxXCI6XCJcXHUyMjVGXCIsXCJxdW90XCI6XCJcXFwiXCIsXCJRVU9UXCI6XCJcXFwiXCIsXCJyQWFyclwiOlwiXFx1MjFEQlwiLFwicmFjZVwiOlwiXFx1MjIzRFxcdTAzMzFcIixcIlJhY3V0ZVwiOlwiXFx1MDE1NFwiLFwicmFjdXRlXCI6XCJcXHUwMTU1XCIsXCJyYWRpY1wiOlwiXFx1MjIxQVwiLFwicmFlbXB0eXZcIjpcIlxcdTI5QjNcIixcInJhbmdcIjpcIlxcdTI3RTlcIixcIlJhbmdcIjpcIlxcdTI3RUJcIixcInJhbmdkXCI6XCJcXHUyOTkyXCIsXCJyYW5nZVwiOlwiXFx1MjlBNVwiLFwicmFuZ2xlXCI6XCJcXHUyN0U5XCIsXCJyYXF1b1wiOlwiXFx1MDBCQlwiLFwicmFycmFwXCI6XCJcXHUyOTc1XCIsXCJyYXJyYlwiOlwiXFx1MjFFNVwiLFwicmFycmJmc1wiOlwiXFx1MjkyMFwiLFwicmFycmNcIjpcIlxcdTI5MzNcIixcInJhcnJcIjpcIlxcdTIxOTJcIixcIlJhcnJcIjpcIlxcdTIxQTBcIixcInJBcnJcIjpcIlxcdTIxRDJcIixcInJhcnJmc1wiOlwiXFx1MjkxRVwiLFwicmFycmhrXCI6XCJcXHUyMUFBXCIsXCJyYXJybHBcIjpcIlxcdTIxQUNcIixcInJhcnJwbFwiOlwiXFx1Mjk0NVwiLFwicmFycnNpbVwiOlwiXFx1Mjk3NFwiLFwiUmFycnRsXCI6XCJcXHUyOTE2XCIsXCJyYXJydGxcIjpcIlxcdTIxQTNcIixcInJhcnJ3XCI6XCJcXHUyMTlEXCIsXCJyYXRhaWxcIjpcIlxcdTI5MUFcIixcInJBdGFpbFwiOlwiXFx1MjkxQ1wiLFwicmF0aW9cIjpcIlxcdTIyMzZcIixcInJhdGlvbmFsc1wiOlwiXFx1MjExQVwiLFwicmJhcnJcIjpcIlxcdTI5MERcIixcInJCYXJyXCI6XCJcXHUyOTBGXCIsXCJSQmFyclwiOlwiXFx1MjkxMFwiLFwicmJicmtcIjpcIlxcdTI3NzNcIixcInJicmFjZVwiOlwifVwiLFwicmJyYWNrXCI6XCJdXCIsXCJyYnJrZVwiOlwiXFx1Mjk4Q1wiLFwicmJya3NsZFwiOlwiXFx1Mjk4RVwiLFwicmJya3NsdVwiOlwiXFx1Mjk5MFwiLFwiUmNhcm9uXCI6XCJcXHUwMTU4XCIsXCJyY2Fyb25cIjpcIlxcdTAxNTlcIixcIlJjZWRpbFwiOlwiXFx1MDE1NlwiLFwicmNlZGlsXCI6XCJcXHUwMTU3XCIsXCJyY2VpbFwiOlwiXFx1MjMwOVwiLFwicmN1YlwiOlwifVwiLFwiUmN5XCI6XCJcXHUwNDIwXCIsXCJyY3lcIjpcIlxcdTA0NDBcIixcInJkY2FcIjpcIlxcdTI5MzdcIixcInJkbGRoYXJcIjpcIlxcdTI5NjlcIixcInJkcXVvXCI6XCJcXHUyMDFEXCIsXCJyZHF1b3JcIjpcIlxcdTIwMURcIixcInJkc2hcIjpcIlxcdTIxQjNcIixcInJlYWxcIjpcIlxcdTIxMUNcIixcInJlYWxpbmVcIjpcIlxcdTIxMUJcIixcInJlYWxwYXJ0XCI6XCJcXHUyMTFDXCIsXCJyZWFsc1wiOlwiXFx1MjExRFwiLFwiUmVcIjpcIlxcdTIxMUNcIixcInJlY3RcIjpcIlxcdTI1QURcIixcInJlZ1wiOlwiXFx1MDBBRVwiLFwiUkVHXCI6XCJcXHUwMEFFXCIsXCJSZXZlcnNlRWxlbWVudFwiOlwiXFx1MjIwQlwiLFwiUmV2ZXJzZUVxdWlsaWJyaXVtXCI6XCJcXHUyMUNCXCIsXCJSZXZlcnNlVXBFcXVpbGlicml1bVwiOlwiXFx1Mjk2RlwiLFwicmZpc2h0XCI6XCJcXHUyOTdEXCIsXCJyZmxvb3JcIjpcIlxcdTIzMEJcIixcInJmclwiOlwiXFx1RDgzNVxcdUREMkZcIixcIlJmclwiOlwiXFx1MjExQ1wiLFwickhhclwiOlwiXFx1Mjk2NFwiLFwicmhhcmRcIjpcIlxcdTIxQzFcIixcInJoYXJ1XCI6XCJcXHUyMUMwXCIsXCJyaGFydWxcIjpcIlxcdTI5NkNcIixcIlJob1wiOlwiXFx1MDNBMVwiLFwicmhvXCI6XCJcXHUwM0MxXCIsXCJyaG92XCI6XCJcXHUwM0YxXCIsXCJSaWdodEFuZ2xlQnJhY2tldFwiOlwiXFx1MjdFOVwiLFwiUmlnaHRBcnJvd0JhclwiOlwiXFx1MjFFNVwiLFwicmlnaHRhcnJvd1wiOlwiXFx1MjE5MlwiLFwiUmlnaHRBcnJvd1wiOlwiXFx1MjE5MlwiLFwiUmlnaHRhcnJvd1wiOlwiXFx1MjFEMlwiLFwiUmlnaHRBcnJvd0xlZnRBcnJvd1wiOlwiXFx1MjFDNFwiLFwicmlnaHRhcnJvd3RhaWxcIjpcIlxcdTIxQTNcIixcIlJpZ2h0Q2VpbGluZ1wiOlwiXFx1MjMwOVwiLFwiUmlnaHREb3VibGVCcmFja2V0XCI6XCJcXHUyN0U3XCIsXCJSaWdodERvd25UZWVWZWN0b3JcIjpcIlxcdTI5NURcIixcIlJpZ2h0RG93blZlY3RvckJhclwiOlwiXFx1Mjk1NVwiLFwiUmlnaHREb3duVmVjdG9yXCI6XCJcXHUyMUMyXCIsXCJSaWdodEZsb29yXCI6XCJcXHUyMzBCXCIsXCJyaWdodGhhcnBvb25kb3duXCI6XCJcXHUyMUMxXCIsXCJyaWdodGhhcnBvb251cFwiOlwiXFx1MjFDMFwiLFwicmlnaHRsZWZ0YXJyb3dzXCI6XCJcXHUyMUM0XCIsXCJyaWdodGxlZnRoYXJwb29uc1wiOlwiXFx1MjFDQ1wiLFwicmlnaHRyaWdodGFycm93c1wiOlwiXFx1MjFDOVwiLFwicmlnaHRzcXVpZ2Fycm93XCI6XCJcXHUyMTlEXCIsXCJSaWdodFRlZUFycm93XCI6XCJcXHUyMUE2XCIsXCJSaWdodFRlZVwiOlwiXFx1MjJBMlwiLFwiUmlnaHRUZWVWZWN0b3JcIjpcIlxcdTI5NUJcIixcInJpZ2h0dGhyZWV0aW1lc1wiOlwiXFx1MjJDQ1wiLFwiUmlnaHRUcmlhbmdsZUJhclwiOlwiXFx1MjlEMFwiLFwiUmlnaHRUcmlhbmdsZVwiOlwiXFx1MjJCM1wiLFwiUmlnaHRUcmlhbmdsZUVxdWFsXCI6XCJcXHUyMkI1XCIsXCJSaWdodFVwRG93blZlY3RvclwiOlwiXFx1Mjk0RlwiLFwiUmlnaHRVcFRlZVZlY3RvclwiOlwiXFx1Mjk1Q1wiLFwiUmlnaHRVcFZlY3RvckJhclwiOlwiXFx1Mjk1NFwiLFwiUmlnaHRVcFZlY3RvclwiOlwiXFx1MjFCRVwiLFwiUmlnaHRWZWN0b3JCYXJcIjpcIlxcdTI5NTNcIixcIlJpZ2h0VmVjdG9yXCI6XCJcXHUyMUMwXCIsXCJyaW5nXCI6XCJcXHUwMkRBXCIsXCJyaXNpbmdkb3RzZXFcIjpcIlxcdTIyNTNcIixcInJsYXJyXCI6XCJcXHUyMUM0XCIsXCJybGhhclwiOlwiXFx1MjFDQ1wiLFwicmxtXCI6XCJcXHUyMDBGXCIsXCJybW91c3RhY2hlXCI6XCJcXHUyM0IxXCIsXCJybW91c3RcIjpcIlxcdTIzQjFcIixcInJubWlkXCI6XCJcXHUyQUVFXCIsXCJyb2FuZ1wiOlwiXFx1MjdFRFwiLFwicm9hcnJcIjpcIlxcdTIxRkVcIixcInJvYnJrXCI6XCJcXHUyN0U3XCIsXCJyb3BhclwiOlwiXFx1Mjk4NlwiLFwicm9wZlwiOlwiXFx1RDgzNVxcdURENjNcIixcIlJvcGZcIjpcIlxcdTIxMURcIixcInJvcGx1c1wiOlwiXFx1MkEyRVwiLFwicm90aW1lc1wiOlwiXFx1MkEzNVwiLFwiUm91bmRJbXBsaWVzXCI6XCJcXHUyOTcwXCIsXCJycGFyXCI6XCIpXCIsXCJycGFyZ3RcIjpcIlxcdTI5OTRcIixcInJwcG9saW50XCI6XCJcXHUyQTEyXCIsXCJycmFyclwiOlwiXFx1MjFDOVwiLFwiUnJpZ2h0YXJyb3dcIjpcIlxcdTIxREJcIixcInJzYXF1b1wiOlwiXFx1MjAzQVwiLFwicnNjclwiOlwiXFx1RDgzNVxcdURDQzdcIixcIlJzY3JcIjpcIlxcdTIxMUJcIixcInJzaFwiOlwiXFx1MjFCMVwiLFwiUnNoXCI6XCJcXHUyMUIxXCIsXCJyc3FiXCI6XCJdXCIsXCJyc3F1b1wiOlwiXFx1MjAxOVwiLFwicnNxdW9yXCI6XCJcXHUyMDE5XCIsXCJydGhyZWVcIjpcIlxcdTIyQ0NcIixcInJ0aW1lc1wiOlwiXFx1MjJDQVwiLFwicnRyaVwiOlwiXFx1MjVCOVwiLFwicnRyaWVcIjpcIlxcdTIyQjVcIixcInJ0cmlmXCI6XCJcXHUyNUI4XCIsXCJydHJpbHRyaVwiOlwiXFx1MjlDRVwiLFwiUnVsZURlbGF5ZWRcIjpcIlxcdTI5RjRcIixcInJ1bHVoYXJcIjpcIlxcdTI5NjhcIixcInJ4XCI6XCJcXHUyMTFFXCIsXCJTYWN1dGVcIjpcIlxcdTAxNUFcIixcInNhY3V0ZVwiOlwiXFx1MDE1QlwiLFwic2JxdW9cIjpcIlxcdTIwMUFcIixcInNjYXBcIjpcIlxcdTJBQjhcIixcIlNjYXJvblwiOlwiXFx1MDE2MFwiLFwic2Nhcm9uXCI6XCJcXHUwMTYxXCIsXCJTY1wiOlwiXFx1MkFCQ1wiLFwic2NcIjpcIlxcdTIyN0JcIixcInNjY3VlXCI6XCJcXHUyMjdEXCIsXCJzY2VcIjpcIlxcdTJBQjBcIixcInNjRVwiOlwiXFx1MkFCNFwiLFwiU2NlZGlsXCI6XCJcXHUwMTVFXCIsXCJzY2VkaWxcIjpcIlxcdTAxNUZcIixcIlNjaXJjXCI6XCJcXHUwMTVDXCIsXCJzY2lyY1wiOlwiXFx1MDE1RFwiLFwic2NuYXBcIjpcIlxcdTJBQkFcIixcInNjbkVcIjpcIlxcdTJBQjZcIixcInNjbnNpbVwiOlwiXFx1MjJFOVwiLFwic2Nwb2xpbnRcIjpcIlxcdTJBMTNcIixcInNjc2ltXCI6XCJcXHUyMjdGXCIsXCJTY3lcIjpcIlxcdTA0MjFcIixcInNjeVwiOlwiXFx1MDQ0MVwiLFwic2RvdGJcIjpcIlxcdTIyQTFcIixcInNkb3RcIjpcIlxcdTIyQzVcIixcInNkb3RlXCI6XCJcXHUyQTY2XCIsXCJzZWFyaGtcIjpcIlxcdTI5MjVcIixcInNlYXJyXCI6XCJcXHUyMTk4XCIsXCJzZUFyclwiOlwiXFx1MjFEOFwiLFwic2VhcnJvd1wiOlwiXFx1MjE5OFwiLFwic2VjdFwiOlwiXFx1MDBBN1wiLFwic2VtaVwiOlwiO1wiLFwic2Vzd2FyXCI6XCJcXHUyOTI5XCIsXCJzZXRtaW51c1wiOlwiXFx1MjIxNlwiLFwic2V0bW5cIjpcIlxcdTIyMTZcIixcInNleHRcIjpcIlxcdTI3MzZcIixcIlNmclwiOlwiXFx1RDgzNVxcdUREMTZcIixcInNmclwiOlwiXFx1RDgzNVxcdUREMzBcIixcInNmcm93blwiOlwiXFx1MjMyMlwiLFwic2hhcnBcIjpcIlxcdTI2NkZcIixcIlNIQ0hjeVwiOlwiXFx1MDQyOVwiLFwic2hjaGN5XCI6XCJcXHUwNDQ5XCIsXCJTSGN5XCI6XCJcXHUwNDI4XCIsXCJzaGN5XCI6XCJcXHUwNDQ4XCIsXCJTaG9ydERvd25BcnJvd1wiOlwiXFx1MjE5M1wiLFwiU2hvcnRMZWZ0QXJyb3dcIjpcIlxcdTIxOTBcIixcInNob3J0bWlkXCI6XCJcXHUyMjIzXCIsXCJzaG9ydHBhcmFsbGVsXCI6XCJcXHUyMjI1XCIsXCJTaG9ydFJpZ2h0QXJyb3dcIjpcIlxcdTIxOTJcIixcIlNob3J0VXBBcnJvd1wiOlwiXFx1MjE5MVwiLFwic2h5XCI6XCJcXHUwMEFEXCIsXCJTaWdtYVwiOlwiXFx1MDNBM1wiLFwic2lnbWFcIjpcIlxcdTAzQzNcIixcInNpZ21hZlwiOlwiXFx1MDNDMlwiLFwic2lnbWF2XCI6XCJcXHUwM0MyXCIsXCJzaW1cIjpcIlxcdTIyM0NcIixcInNpbWRvdFwiOlwiXFx1MkE2QVwiLFwic2ltZVwiOlwiXFx1MjI0M1wiLFwic2ltZXFcIjpcIlxcdTIyNDNcIixcInNpbWdcIjpcIlxcdTJBOUVcIixcInNpbWdFXCI6XCJcXHUyQUEwXCIsXCJzaW1sXCI6XCJcXHUyQTlEXCIsXCJzaW1sRVwiOlwiXFx1MkE5RlwiLFwic2ltbmVcIjpcIlxcdTIyNDZcIixcInNpbXBsdXNcIjpcIlxcdTJBMjRcIixcInNpbXJhcnJcIjpcIlxcdTI5NzJcIixcInNsYXJyXCI6XCJcXHUyMTkwXCIsXCJTbWFsbENpcmNsZVwiOlwiXFx1MjIxOFwiLFwic21hbGxzZXRtaW51c1wiOlwiXFx1MjIxNlwiLFwic21hc2hwXCI6XCJcXHUyQTMzXCIsXCJzbWVwYXJzbFwiOlwiXFx1MjlFNFwiLFwic21pZFwiOlwiXFx1MjIyM1wiLFwic21pbGVcIjpcIlxcdTIzMjNcIixcInNtdFwiOlwiXFx1MkFBQVwiLFwic210ZVwiOlwiXFx1MkFBQ1wiLFwic210ZXNcIjpcIlxcdTJBQUNcXHVGRTAwXCIsXCJTT0ZUY3lcIjpcIlxcdTA0MkNcIixcInNvZnRjeVwiOlwiXFx1MDQ0Q1wiLFwic29sYmFyXCI6XCJcXHUyMzNGXCIsXCJzb2xiXCI6XCJcXHUyOUM0XCIsXCJzb2xcIjpcIi9cIixcIlNvcGZcIjpcIlxcdUQ4MzVcXHVERDRBXCIsXCJzb3BmXCI6XCJcXHVEODM1XFx1REQ2NFwiLFwic3BhZGVzXCI6XCJcXHUyNjYwXCIsXCJzcGFkZXN1aXRcIjpcIlxcdTI2NjBcIixcInNwYXJcIjpcIlxcdTIyMjVcIixcInNxY2FwXCI6XCJcXHUyMjkzXCIsXCJzcWNhcHNcIjpcIlxcdTIyOTNcXHVGRTAwXCIsXCJzcWN1cFwiOlwiXFx1MjI5NFwiLFwic3FjdXBzXCI6XCJcXHUyMjk0XFx1RkUwMFwiLFwiU3FydFwiOlwiXFx1MjIxQVwiLFwic3FzdWJcIjpcIlxcdTIyOEZcIixcInNxc3ViZVwiOlwiXFx1MjI5MVwiLFwic3FzdWJzZXRcIjpcIlxcdTIyOEZcIixcInNxc3Vic2V0ZXFcIjpcIlxcdTIyOTFcIixcInNxc3VwXCI6XCJcXHUyMjkwXCIsXCJzcXN1cGVcIjpcIlxcdTIyOTJcIixcInNxc3Vwc2V0XCI6XCJcXHUyMjkwXCIsXCJzcXN1cHNldGVxXCI6XCJcXHUyMjkyXCIsXCJzcXVhcmVcIjpcIlxcdTI1QTFcIixcIlNxdWFyZVwiOlwiXFx1MjVBMVwiLFwiU3F1YXJlSW50ZXJzZWN0aW9uXCI6XCJcXHUyMjkzXCIsXCJTcXVhcmVTdWJzZXRcIjpcIlxcdTIyOEZcIixcIlNxdWFyZVN1YnNldEVxdWFsXCI6XCJcXHUyMjkxXCIsXCJTcXVhcmVTdXBlcnNldFwiOlwiXFx1MjI5MFwiLFwiU3F1YXJlU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjI5MlwiLFwiU3F1YXJlVW5pb25cIjpcIlxcdTIyOTRcIixcInNxdWFyZlwiOlwiXFx1MjVBQVwiLFwic3F1XCI6XCJcXHUyNUExXCIsXCJzcXVmXCI6XCJcXHUyNUFBXCIsXCJzcmFyclwiOlwiXFx1MjE5MlwiLFwiU3NjclwiOlwiXFx1RDgzNVxcdURDQUVcIixcInNzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M4XCIsXCJzc2V0bW5cIjpcIlxcdTIyMTZcIixcInNzbWlsZVwiOlwiXFx1MjMyM1wiLFwic3N0YXJmXCI6XCJcXHUyMkM2XCIsXCJTdGFyXCI6XCJcXHUyMkM2XCIsXCJzdGFyXCI6XCJcXHUyNjA2XCIsXCJzdGFyZlwiOlwiXFx1MjYwNVwiLFwic3RyYWlnaHRlcHNpbG9uXCI6XCJcXHUwM0Y1XCIsXCJzdHJhaWdodHBoaVwiOlwiXFx1MDNENVwiLFwic3RybnNcIjpcIlxcdTAwQUZcIixcInN1YlwiOlwiXFx1MjI4MlwiLFwiU3ViXCI6XCJcXHUyMkQwXCIsXCJzdWJkb3RcIjpcIlxcdTJBQkRcIixcInN1YkVcIjpcIlxcdTJBQzVcIixcInN1YmVcIjpcIlxcdTIyODZcIixcInN1YmVkb3RcIjpcIlxcdTJBQzNcIixcInN1Ym11bHRcIjpcIlxcdTJBQzFcIixcInN1Ym5FXCI6XCJcXHUyQUNCXCIsXCJzdWJuZVwiOlwiXFx1MjI4QVwiLFwic3VicGx1c1wiOlwiXFx1MkFCRlwiLFwic3VicmFyclwiOlwiXFx1Mjk3OVwiLFwic3Vic2V0XCI6XCJcXHUyMjgyXCIsXCJTdWJzZXRcIjpcIlxcdTIyRDBcIixcInN1YnNldGVxXCI6XCJcXHUyMjg2XCIsXCJzdWJzZXRlcXFcIjpcIlxcdTJBQzVcIixcIlN1YnNldEVxdWFsXCI6XCJcXHUyMjg2XCIsXCJzdWJzZXRuZXFcIjpcIlxcdTIyOEFcIixcInN1YnNldG5lcXFcIjpcIlxcdTJBQ0JcIixcInN1YnNpbVwiOlwiXFx1MkFDN1wiLFwic3Vic3ViXCI6XCJcXHUyQUQ1XCIsXCJzdWJzdXBcIjpcIlxcdTJBRDNcIixcInN1Y2NhcHByb3hcIjpcIlxcdTJBQjhcIixcInN1Y2NcIjpcIlxcdTIyN0JcIixcInN1Y2NjdXJseWVxXCI6XCJcXHUyMjdEXCIsXCJTdWNjZWVkc1wiOlwiXFx1MjI3QlwiLFwiU3VjY2VlZHNFcXVhbFwiOlwiXFx1MkFCMFwiLFwiU3VjY2VlZHNTbGFudEVxdWFsXCI6XCJcXHUyMjdEXCIsXCJTdWNjZWVkc1RpbGRlXCI6XCJcXHUyMjdGXCIsXCJzdWNjZXFcIjpcIlxcdTJBQjBcIixcInN1Y2NuYXBwcm94XCI6XCJcXHUyQUJBXCIsXCJzdWNjbmVxcVwiOlwiXFx1MkFCNlwiLFwic3VjY25zaW1cIjpcIlxcdTIyRTlcIixcInN1Y2NzaW1cIjpcIlxcdTIyN0ZcIixcIlN1Y2hUaGF0XCI6XCJcXHUyMjBCXCIsXCJzdW1cIjpcIlxcdTIyMTFcIixcIlN1bVwiOlwiXFx1MjIxMVwiLFwic3VuZ1wiOlwiXFx1MjY2QVwiLFwic3VwMVwiOlwiXFx1MDBCOVwiLFwic3VwMlwiOlwiXFx1MDBCMlwiLFwic3VwM1wiOlwiXFx1MDBCM1wiLFwic3VwXCI6XCJcXHUyMjgzXCIsXCJTdXBcIjpcIlxcdTIyRDFcIixcInN1cGRvdFwiOlwiXFx1MkFCRVwiLFwic3VwZHN1YlwiOlwiXFx1MkFEOFwiLFwic3VwRVwiOlwiXFx1MkFDNlwiLFwic3VwZVwiOlwiXFx1MjI4N1wiLFwic3VwZWRvdFwiOlwiXFx1MkFDNFwiLFwiU3VwZXJzZXRcIjpcIlxcdTIyODNcIixcIlN1cGVyc2V0RXF1YWxcIjpcIlxcdTIyODdcIixcInN1cGhzb2xcIjpcIlxcdTI3QzlcIixcInN1cGhzdWJcIjpcIlxcdTJBRDdcIixcInN1cGxhcnJcIjpcIlxcdTI5N0JcIixcInN1cG11bHRcIjpcIlxcdTJBQzJcIixcInN1cG5FXCI6XCJcXHUyQUNDXCIsXCJzdXBuZVwiOlwiXFx1MjI4QlwiLFwic3VwcGx1c1wiOlwiXFx1MkFDMFwiLFwic3Vwc2V0XCI6XCJcXHUyMjgzXCIsXCJTdXBzZXRcIjpcIlxcdTIyRDFcIixcInN1cHNldGVxXCI6XCJcXHUyMjg3XCIsXCJzdXBzZXRlcXFcIjpcIlxcdTJBQzZcIixcInN1cHNldG5lcVwiOlwiXFx1MjI4QlwiLFwic3Vwc2V0bmVxcVwiOlwiXFx1MkFDQ1wiLFwic3Vwc2ltXCI6XCJcXHUyQUM4XCIsXCJzdXBzdWJcIjpcIlxcdTJBRDRcIixcInN1cHN1cFwiOlwiXFx1MkFENlwiLFwic3dhcmhrXCI6XCJcXHUyOTI2XCIsXCJzd2FyclwiOlwiXFx1MjE5OVwiLFwic3dBcnJcIjpcIlxcdTIxRDlcIixcInN3YXJyb3dcIjpcIlxcdTIxOTlcIixcInN3bndhclwiOlwiXFx1MjkyQVwiLFwic3psaWdcIjpcIlxcdTAwREZcIixcIlRhYlwiOlwiXFx0XCIsXCJ0YXJnZXRcIjpcIlxcdTIzMTZcIixcIlRhdVwiOlwiXFx1MDNBNFwiLFwidGF1XCI6XCJcXHUwM0M0XCIsXCJ0YnJrXCI6XCJcXHUyM0I0XCIsXCJUY2Fyb25cIjpcIlxcdTAxNjRcIixcInRjYXJvblwiOlwiXFx1MDE2NVwiLFwiVGNlZGlsXCI6XCJcXHUwMTYyXCIsXCJ0Y2VkaWxcIjpcIlxcdTAxNjNcIixcIlRjeVwiOlwiXFx1MDQyMlwiLFwidGN5XCI6XCJcXHUwNDQyXCIsXCJ0ZG90XCI6XCJcXHUyMERCXCIsXCJ0ZWxyZWNcIjpcIlxcdTIzMTVcIixcIlRmclwiOlwiXFx1RDgzNVxcdUREMTdcIixcInRmclwiOlwiXFx1RDgzNVxcdUREMzFcIixcInRoZXJlNFwiOlwiXFx1MjIzNFwiLFwidGhlcmVmb3JlXCI6XCJcXHUyMjM0XCIsXCJUaGVyZWZvcmVcIjpcIlxcdTIyMzRcIixcIlRoZXRhXCI6XCJcXHUwMzk4XCIsXCJ0aGV0YVwiOlwiXFx1MDNCOFwiLFwidGhldGFzeW1cIjpcIlxcdTAzRDFcIixcInRoZXRhdlwiOlwiXFx1MDNEMVwiLFwidGhpY2thcHByb3hcIjpcIlxcdTIyNDhcIixcInRoaWNrc2ltXCI6XCJcXHUyMjNDXCIsXCJUaGlja1NwYWNlXCI6XCJcXHUyMDVGXFx1MjAwQVwiLFwiVGhpblNwYWNlXCI6XCJcXHUyMDA5XCIsXCJ0aGluc3BcIjpcIlxcdTIwMDlcIixcInRoa2FwXCI6XCJcXHUyMjQ4XCIsXCJ0aGtzaW1cIjpcIlxcdTIyM0NcIixcIlRIT1JOXCI6XCJcXHUwMERFXCIsXCJ0aG9yblwiOlwiXFx1MDBGRVwiLFwidGlsZGVcIjpcIlxcdTAyRENcIixcIlRpbGRlXCI6XCJcXHUyMjNDXCIsXCJUaWxkZUVxdWFsXCI6XCJcXHUyMjQzXCIsXCJUaWxkZUZ1bGxFcXVhbFwiOlwiXFx1MjI0NVwiLFwiVGlsZGVUaWxkZVwiOlwiXFx1MjI0OFwiLFwidGltZXNiYXJcIjpcIlxcdTJBMzFcIixcInRpbWVzYlwiOlwiXFx1MjJBMFwiLFwidGltZXNcIjpcIlxcdTAwRDdcIixcInRpbWVzZFwiOlwiXFx1MkEzMFwiLFwidGludFwiOlwiXFx1MjIyRFwiLFwidG9lYVwiOlwiXFx1MjkyOFwiLFwidG9wYm90XCI6XCJcXHUyMzM2XCIsXCJ0b3BjaXJcIjpcIlxcdTJBRjFcIixcInRvcFwiOlwiXFx1MjJBNFwiLFwiVG9wZlwiOlwiXFx1RDgzNVxcdURENEJcIixcInRvcGZcIjpcIlxcdUQ4MzVcXHVERDY1XCIsXCJ0b3Bmb3JrXCI6XCJcXHUyQURBXCIsXCJ0b3NhXCI6XCJcXHUyOTI5XCIsXCJ0cHJpbWVcIjpcIlxcdTIwMzRcIixcInRyYWRlXCI6XCJcXHUyMTIyXCIsXCJUUkFERVwiOlwiXFx1MjEyMlwiLFwidHJpYW5nbGVcIjpcIlxcdTI1QjVcIixcInRyaWFuZ2xlZG93blwiOlwiXFx1MjVCRlwiLFwidHJpYW5nbGVsZWZ0XCI6XCJcXHUyNUMzXCIsXCJ0cmlhbmdsZWxlZnRlcVwiOlwiXFx1MjJCNFwiLFwidHJpYW5nbGVxXCI6XCJcXHUyMjVDXCIsXCJ0cmlhbmdsZXJpZ2h0XCI6XCJcXHUyNUI5XCIsXCJ0cmlhbmdsZXJpZ2h0ZXFcIjpcIlxcdTIyQjVcIixcInRyaWRvdFwiOlwiXFx1MjVFQ1wiLFwidHJpZVwiOlwiXFx1MjI1Q1wiLFwidHJpbWludXNcIjpcIlxcdTJBM0FcIixcIlRyaXBsZURvdFwiOlwiXFx1MjBEQlwiLFwidHJpcGx1c1wiOlwiXFx1MkEzOVwiLFwidHJpc2JcIjpcIlxcdTI5Q0RcIixcInRyaXRpbWVcIjpcIlxcdTJBM0JcIixcInRycGV6aXVtXCI6XCJcXHUyM0UyXCIsXCJUc2NyXCI6XCJcXHVEODM1XFx1RENBRlwiLFwidHNjclwiOlwiXFx1RDgzNVxcdURDQzlcIixcIlRTY3lcIjpcIlxcdTA0MjZcIixcInRzY3lcIjpcIlxcdTA0NDZcIixcIlRTSGN5XCI6XCJcXHUwNDBCXCIsXCJ0c2hjeVwiOlwiXFx1MDQ1QlwiLFwiVHN0cm9rXCI6XCJcXHUwMTY2XCIsXCJ0c3Ryb2tcIjpcIlxcdTAxNjdcIixcInR3aXh0XCI6XCJcXHUyMjZDXCIsXCJ0d29oZWFkbGVmdGFycm93XCI6XCJcXHUyMTlFXCIsXCJ0d29oZWFkcmlnaHRhcnJvd1wiOlwiXFx1MjFBMFwiLFwiVWFjdXRlXCI6XCJcXHUwMERBXCIsXCJ1YWN1dGVcIjpcIlxcdTAwRkFcIixcInVhcnJcIjpcIlxcdTIxOTFcIixcIlVhcnJcIjpcIlxcdTIxOUZcIixcInVBcnJcIjpcIlxcdTIxRDFcIixcIlVhcnJvY2lyXCI6XCJcXHUyOTQ5XCIsXCJVYnJjeVwiOlwiXFx1MDQwRVwiLFwidWJyY3lcIjpcIlxcdTA0NUVcIixcIlVicmV2ZVwiOlwiXFx1MDE2Q1wiLFwidWJyZXZlXCI6XCJcXHUwMTZEXCIsXCJVY2lyY1wiOlwiXFx1MDBEQlwiLFwidWNpcmNcIjpcIlxcdTAwRkJcIixcIlVjeVwiOlwiXFx1MDQyM1wiLFwidWN5XCI6XCJcXHUwNDQzXCIsXCJ1ZGFyclwiOlwiXFx1MjFDNVwiLFwiVWRibGFjXCI6XCJcXHUwMTcwXCIsXCJ1ZGJsYWNcIjpcIlxcdTAxNzFcIixcInVkaGFyXCI6XCJcXHUyOTZFXCIsXCJ1ZmlzaHRcIjpcIlxcdTI5N0VcIixcIlVmclwiOlwiXFx1RDgzNVxcdUREMThcIixcInVmclwiOlwiXFx1RDgzNVxcdUREMzJcIixcIlVncmF2ZVwiOlwiXFx1MDBEOVwiLFwidWdyYXZlXCI6XCJcXHUwMEY5XCIsXCJ1SGFyXCI6XCJcXHUyOTYzXCIsXCJ1aGFybFwiOlwiXFx1MjFCRlwiLFwidWhhcnJcIjpcIlxcdTIxQkVcIixcInVoYmxrXCI6XCJcXHUyNTgwXCIsXCJ1bGNvcm5cIjpcIlxcdTIzMUNcIixcInVsY29ybmVyXCI6XCJcXHUyMzFDXCIsXCJ1bGNyb3BcIjpcIlxcdTIzMEZcIixcInVsdHJpXCI6XCJcXHUyNUY4XCIsXCJVbWFjclwiOlwiXFx1MDE2QVwiLFwidW1hY3JcIjpcIlxcdTAxNkJcIixcInVtbFwiOlwiXFx1MDBBOFwiLFwiVW5kZXJCYXJcIjpcIl9cIixcIlVuZGVyQnJhY2VcIjpcIlxcdTIzREZcIixcIlVuZGVyQnJhY2tldFwiOlwiXFx1MjNCNVwiLFwiVW5kZXJQYXJlbnRoZXNpc1wiOlwiXFx1MjNERFwiLFwiVW5pb25cIjpcIlxcdTIyQzNcIixcIlVuaW9uUGx1c1wiOlwiXFx1MjI4RVwiLFwiVW9nb25cIjpcIlxcdTAxNzJcIixcInVvZ29uXCI6XCJcXHUwMTczXCIsXCJVb3BmXCI6XCJcXHVEODM1XFx1REQ0Q1wiLFwidW9wZlwiOlwiXFx1RDgzNVxcdURENjZcIixcIlVwQXJyb3dCYXJcIjpcIlxcdTI5MTJcIixcInVwYXJyb3dcIjpcIlxcdTIxOTFcIixcIlVwQXJyb3dcIjpcIlxcdTIxOTFcIixcIlVwYXJyb3dcIjpcIlxcdTIxRDFcIixcIlVwQXJyb3dEb3duQXJyb3dcIjpcIlxcdTIxQzVcIixcInVwZG93bmFycm93XCI6XCJcXHUyMTk1XCIsXCJVcERvd25BcnJvd1wiOlwiXFx1MjE5NVwiLFwiVXBkb3duYXJyb3dcIjpcIlxcdTIxRDVcIixcIlVwRXF1aWxpYnJpdW1cIjpcIlxcdTI5NkVcIixcInVwaGFycG9vbmxlZnRcIjpcIlxcdTIxQkZcIixcInVwaGFycG9vbnJpZ2h0XCI6XCJcXHUyMUJFXCIsXCJ1cGx1c1wiOlwiXFx1MjI4RVwiLFwiVXBwZXJMZWZ0QXJyb3dcIjpcIlxcdTIxOTZcIixcIlVwcGVyUmlnaHRBcnJvd1wiOlwiXFx1MjE5N1wiLFwidXBzaVwiOlwiXFx1MDNDNVwiLFwiVXBzaVwiOlwiXFx1MDNEMlwiLFwidXBzaWhcIjpcIlxcdTAzRDJcIixcIlVwc2lsb25cIjpcIlxcdTAzQTVcIixcInVwc2lsb25cIjpcIlxcdTAzQzVcIixcIlVwVGVlQXJyb3dcIjpcIlxcdTIxQTVcIixcIlVwVGVlXCI6XCJcXHUyMkE1XCIsXCJ1cHVwYXJyb3dzXCI6XCJcXHUyMUM4XCIsXCJ1cmNvcm5cIjpcIlxcdTIzMURcIixcInVyY29ybmVyXCI6XCJcXHUyMzFEXCIsXCJ1cmNyb3BcIjpcIlxcdTIzMEVcIixcIlVyaW5nXCI6XCJcXHUwMTZFXCIsXCJ1cmluZ1wiOlwiXFx1MDE2RlwiLFwidXJ0cmlcIjpcIlxcdTI1RjlcIixcIlVzY3JcIjpcIlxcdUQ4MzVcXHVEQ0IwXCIsXCJ1c2NyXCI6XCJcXHVEODM1XFx1RENDQVwiLFwidXRkb3RcIjpcIlxcdTIyRjBcIixcIlV0aWxkZVwiOlwiXFx1MDE2OFwiLFwidXRpbGRlXCI6XCJcXHUwMTY5XCIsXCJ1dHJpXCI6XCJcXHUyNUI1XCIsXCJ1dHJpZlwiOlwiXFx1MjVCNFwiLFwidXVhcnJcIjpcIlxcdTIxQzhcIixcIlV1bWxcIjpcIlxcdTAwRENcIixcInV1bWxcIjpcIlxcdTAwRkNcIixcInV3YW5nbGVcIjpcIlxcdTI5QTdcIixcInZhbmdydFwiOlwiXFx1Mjk5Q1wiLFwidmFyZXBzaWxvblwiOlwiXFx1MDNGNVwiLFwidmFya2FwcGFcIjpcIlxcdTAzRjBcIixcInZhcm5vdGhpbmdcIjpcIlxcdTIyMDVcIixcInZhcnBoaVwiOlwiXFx1MDNENVwiLFwidmFycGlcIjpcIlxcdTAzRDZcIixcInZhcnByb3B0b1wiOlwiXFx1MjIxRFwiLFwidmFyclwiOlwiXFx1MjE5NVwiLFwidkFyclwiOlwiXFx1MjFENVwiLFwidmFycmhvXCI6XCJcXHUwM0YxXCIsXCJ2YXJzaWdtYVwiOlwiXFx1MDNDMlwiLFwidmFyc3Vic2V0bmVxXCI6XCJcXHUyMjhBXFx1RkUwMFwiLFwidmFyc3Vic2V0bmVxcVwiOlwiXFx1MkFDQlxcdUZFMDBcIixcInZhcnN1cHNldG5lcVwiOlwiXFx1MjI4QlxcdUZFMDBcIixcInZhcnN1cHNldG5lcXFcIjpcIlxcdTJBQ0NcXHVGRTAwXCIsXCJ2YXJ0aGV0YVwiOlwiXFx1MDNEMVwiLFwidmFydHJpYW5nbGVsZWZ0XCI6XCJcXHUyMkIyXCIsXCJ2YXJ0cmlhbmdsZXJpZ2h0XCI6XCJcXHUyMkIzXCIsXCJ2QmFyXCI6XCJcXHUyQUU4XCIsXCJWYmFyXCI6XCJcXHUyQUVCXCIsXCJ2QmFydlwiOlwiXFx1MkFFOVwiLFwiVmN5XCI6XCJcXHUwNDEyXCIsXCJ2Y3lcIjpcIlxcdTA0MzJcIixcInZkYXNoXCI6XCJcXHUyMkEyXCIsXCJ2RGFzaFwiOlwiXFx1MjJBOFwiLFwiVmRhc2hcIjpcIlxcdTIyQTlcIixcIlZEYXNoXCI6XCJcXHUyMkFCXCIsXCJWZGFzaGxcIjpcIlxcdTJBRTZcIixcInZlZWJhclwiOlwiXFx1MjJCQlwiLFwidmVlXCI6XCJcXHUyMjI4XCIsXCJWZWVcIjpcIlxcdTIyQzFcIixcInZlZWVxXCI6XCJcXHUyMjVBXCIsXCJ2ZWxsaXBcIjpcIlxcdTIyRUVcIixcInZlcmJhclwiOlwifFwiLFwiVmVyYmFyXCI6XCJcXHUyMDE2XCIsXCJ2ZXJ0XCI6XCJ8XCIsXCJWZXJ0XCI6XCJcXHUyMDE2XCIsXCJWZXJ0aWNhbEJhclwiOlwiXFx1MjIyM1wiLFwiVmVydGljYWxMaW5lXCI6XCJ8XCIsXCJWZXJ0aWNhbFNlcGFyYXRvclwiOlwiXFx1Mjc1OFwiLFwiVmVydGljYWxUaWxkZVwiOlwiXFx1MjI0MFwiLFwiVmVyeVRoaW5TcGFjZVwiOlwiXFx1MjAwQVwiLFwiVmZyXCI6XCJcXHVEODM1XFx1REQxOVwiLFwidmZyXCI6XCJcXHVEODM1XFx1REQzM1wiLFwidmx0cmlcIjpcIlxcdTIyQjJcIixcInZuc3ViXCI6XCJcXHUyMjgyXFx1MjBEMlwiLFwidm5zdXBcIjpcIlxcdTIyODNcXHUyMEQyXCIsXCJWb3BmXCI6XCJcXHVEODM1XFx1REQ0RFwiLFwidm9wZlwiOlwiXFx1RDgzNVxcdURENjdcIixcInZwcm9wXCI6XCJcXHUyMjFEXCIsXCJ2cnRyaVwiOlwiXFx1MjJCM1wiLFwiVnNjclwiOlwiXFx1RDgzNVxcdURDQjFcIixcInZzY3JcIjpcIlxcdUQ4MzVcXHVEQ0NCXCIsXCJ2c3VibkVcIjpcIlxcdTJBQ0JcXHVGRTAwXCIsXCJ2c3VibmVcIjpcIlxcdTIyOEFcXHVGRTAwXCIsXCJ2c3VwbkVcIjpcIlxcdTJBQ0NcXHVGRTAwXCIsXCJ2c3VwbmVcIjpcIlxcdTIyOEJcXHVGRTAwXCIsXCJWdmRhc2hcIjpcIlxcdTIyQUFcIixcInZ6aWd6YWdcIjpcIlxcdTI5OUFcIixcIldjaXJjXCI6XCJcXHUwMTc0XCIsXCJ3Y2lyY1wiOlwiXFx1MDE3NVwiLFwid2VkYmFyXCI6XCJcXHUyQTVGXCIsXCJ3ZWRnZVwiOlwiXFx1MjIyN1wiLFwiV2VkZ2VcIjpcIlxcdTIyQzBcIixcIndlZGdlcVwiOlwiXFx1MjI1OVwiLFwid2VpZXJwXCI6XCJcXHUyMTE4XCIsXCJXZnJcIjpcIlxcdUQ4MzVcXHVERDFBXCIsXCJ3ZnJcIjpcIlxcdUQ4MzVcXHVERDM0XCIsXCJXb3BmXCI6XCJcXHVEODM1XFx1REQ0RVwiLFwid29wZlwiOlwiXFx1RDgzNVxcdURENjhcIixcIndwXCI6XCJcXHUyMTE4XCIsXCJ3clwiOlwiXFx1MjI0MFwiLFwid3JlYXRoXCI6XCJcXHUyMjQwXCIsXCJXc2NyXCI6XCJcXHVEODM1XFx1RENCMlwiLFwid3NjclwiOlwiXFx1RDgzNVxcdURDQ0NcIixcInhjYXBcIjpcIlxcdTIyQzJcIixcInhjaXJjXCI6XCJcXHUyNUVGXCIsXCJ4Y3VwXCI6XCJcXHUyMkMzXCIsXCJ4ZHRyaVwiOlwiXFx1MjVCRFwiLFwiWGZyXCI6XCJcXHVEODM1XFx1REQxQlwiLFwieGZyXCI6XCJcXHVEODM1XFx1REQzNVwiLFwieGhhcnJcIjpcIlxcdTI3RjdcIixcInhoQXJyXCI6XCJcXHUyN0ZBXCIsXCJYaVwiOlwiXFx1MDM5RVwiLFwieGlcIjpcIlxcdTAzQkVcIixcInhsYXJyXCI6XCJcXHUyN0Y1XCIsXCJ4bEFyclwiOlwiXFx1MjdGOFwiLFwieG1hcFwiOlwiXFx1MjdGQ1wiLFwieG5pc1wiOlwiXFx1MjJGQlwiLFwieG9kb3RcIjpcIlxcdTJBMDBcIixcIlhvcGZcIjpcIlxcdUQ4MzVcXHVERDRGXCIsXCJ4b3BmXCI6XCJcXHVEODM1XFx1REQ2OVwiLFwieG9wbHVzXCI6XCJcXHUyQTAxXCIsXCJ4b3RpbWVcIjpcIlxcdTJBMDJcIixcInhyYXJyXCI6XCJcXHUyN0Y2XCIsXCJ4ckFyclwiOlwiXFx1MjdGOVwiLFwiWHNjclwiOlwiXFx1RDgzNVxcdURDQjNcIixcInhzY3JcIjpcIlxcdUQ4MzVcXHVEQ0NEXCIsXCJ4c3FjdXBcIjpcIlxcdTJBMDZcIixcInh1cGx1c1wiOlwiXFx1MkEwNFwiLFwieHV0cmlcIjpcIlxcdTI1QjNcIixcInh2ZWVcIjpcIlxcdTIyQzFcIixcInh3ZWRnZVwiOlwiXFx1MjJDMFwiLFwiWWFjdXRlXCI6XCJcXHUwMEREXCIsXCJ5YWN1dGVcIjpcIlxcdTAwRkRcIixcIllBY3lcIjpcIlxcdTA0MkZcIixcInlhY3lcIjpcIlxcdTA0NEZcIixcIlljaXJjXCI6XCJcXHUwMTc2XCIsXCJ5Y2lyY1wiOlwiXFx1MDE3N1wiLFwiWWN5XCI6XCJcXHUwNDJCXCIsXCJ5Y3lcIjpcIlxcdTA0NEJcIixcInllblwiOlwiXFx1MDBBNVwiLFwiWWZyXCI6XCJcXHVEODM1XFx1REQxQ1wiLFwieWZyXCI6XCJcXHVEODM1XFx1REQzNlwiLFwiWUljeVwiOlwiXFx1MDQwN1wiLFwieWljeVwiOlwiXFx1MDQ1N1wiLFwiWW9wZlwiOlwiXFx1RDgzNVxcdURENTBcIixcInlvcGZcIjpcIlxcdUQ4MzVcXHVERDZBXCIsXCJZc2NyXCI6XCJcXHVEODM1XFx1RENCNFwiLFwieXNjclwiOlwiXFx1RDgzNVxcdURDQ0VcIixcIllVY3lcIjpcIlxcdTA0MkVcIixcInl1Y3lcIjpcIlxcdTA0NEVcIixcInl1bWxcIjpcIlxcdTAwRkZcIixcIll1bWxcIjpcIlxcdTAxNzhcIixcIlphY3V0ZVwiOlwiXFx1MDE3OVwiLFwiemFjdXRlXCI6XCJcXHUwMTdBXCIsXCJaY2Fyb25cIjpcIlxcdTAxN0RcIixcInpjYXJvblwiOlwiXFx1MDE3RVwiLFwiWmN5XCI6XCJcXHUwNDE3XCIsXCJ6Y3lcIjpcIlxcdTA0MzdcIixcIlpkb3RcIjpcIlxcdTAxN0JcIixcInpkb3RcIjpcIlxcdTAxN0NcIixcInplZXRyZlwiOlwiXFx1MjEyOFwiLFwiWmVyb1dpZHRoU3BhY2VcIjpcIlxcdTIwMEJcIixcIlpldGFcIjpcIlxcdTAzOTZcIixcInpldGFcIjpcIlxcdTAzQjZcIixcInpmclwiOlwiXFx1RDgzNVxcdUREMzdcIixcIlpmclwiOlwiXFx1MjEyOFwiLFwiWkhjeVwiOlwiXFx1MDQxNlwiLFwiemhjeVwiOlwiXFx1MDQzNlwiLFwiemlncmFyclwiOlwiXFx1MjFERFwiLFwiem9wZlwiOlwiXFx1RDgzNVxcdURENkJcIixcIlpvcGZcIjpcIlxcdTIxMjRcIixcIlpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I1XCIsXCJ6c2NyXCI6XCJcXHVEODM1XFx1RENDRlwiLFwiendqXCI6XCJcXHUyMDBEXCIsXCJ6d25qXCI6XCJcXHUyMDBDXCJ9IiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBIZWxwZXJzXG5cbi8vIE1lcmdlIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2NsYXNzKG9iaikgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7IH1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikgeyByZXR1cm4gX2NsYXNzKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nOyB9XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBPYmplY3RdJzsgfVxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7IH1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJzsgfVxuXG5cbmZ1bmN0aW9uIGVzY2FwZVJFIChzdHIpIHsgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csICdcXFxcJCYnKTsgfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbnZhciBkZWZhdWx0U2NoZW1hcyA9IHtcbiAgJ2h0dHA6Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLmh0dHApIHtcbiAgICAgICAgLy8gY29tcGlsZSBsYXppbHksIGJlY2F1c2UgXCJob3N0XCItY29udGFpbmluZyB2YXJpYWJsZXMgY2FuIGNoYW5nZSBvbiB0bGRzIHVwZGF0ZS5cbiAgICAgICAgc2VsZi5yZS5odHRwID0gIG5ldyBSZWdFeHAoXG4gICAgICAgICAgJ15cXFxcL1xcXFwvJyArIHNlbGYucmUuc3JjX2F1dGggKyBzZWxmLnJlLnNyY19ob3N0X3BvcnRfc3RyaWN0ICsgc2VsZi5yZS5zcmNfcGF0aCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdodHRwczonOiAgJ2h0dHA6JyxcbiAgJ2Z0cDonOiAgICAnaHR0cDonLFxuICAnLy8nOiAgICAgIHtcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKHRleHQsIHBvcywgc2VsZikge1xuICAgICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICAgIGlmICghc2VsZi5yZS5ub19odHRwKSB7XG4gICAgICAvLyBjb21waWxlIGxhemlseSwgYmVjYXlzZSBcImhvc3RcIi1jb250YWluaW5nIHZhcmlhYmxlcyBjYW4gY2hhbmdlIG9uIHRsZHMgdXBkYXRlLlxuICAgICAgICBzZWxmLnJlLm5vX2h0dHAgPSAgbmV3IFJlZ0V4cChcbiAgICAgICAgICAnXicgKyBzZWxmLnJlLnNyY19hdXRoICsgc2VsZi5yZS5zcmNfaG9zdF9wb3J0X3N0cmljdCArIHNlbGYucmUuc3JjX3BhdGgsICdpJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5yZS5ub19odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSBgOi8vYCwgdGhhdCBwcm90ZWN0cyBmcm9tIGVycm9ycyBpbiBwcm90b2NvbCBuYW1lXG4gICAgICAgIGlmIChwb3MgPj0gMyAmJiB0ZXh0W3BvcyAtIDNdID09PSAnOicpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5ub19odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdtYWlsdG86Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLm1haWx0bykge1xuICAgICAgICBzZWxmLnJlLm1haWx0byA9ICBuZXcgUmVnRXhwKFxuICAgICAgICAgICdeJyArIHNlbGYucmUuc3JjX2VtYWlsX25hbWUgKyAnQCcgKyBzZWxmLnJlLnNyY19ob3N0X3N0cmljdCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5tYWlsdG8udGVzdCh0YWlsKSkge1xuICAgICAgICByZXR1cm4gdGFpbC5tYXRjaChzZWxmLnJlLm1haWx0bylbMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59O1xuXG4vLyBET04nVCB0cnkgdG8gbWFrZSBQUnMgd2l0aCBjaGFuZ2VzLiBFeHRlbmQgVExEcyB3aXRoIExpbmtpZnlJdC50bGRzKCkgaW5zdGVhZFxudmFyIHRsZHNfZGVmYXVsdCA9ICdiaXp8Y29tfGVkdXxnb3Z8bmV0fG9yZ3xwcm98d2VifHh4eHxhZXJvfGFzaWF8Y29vcHxpbmZvfG11c2V1bXxuYW1lfHNob3B80YDRhCcuc3BsaXQoJ3wnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gcmVzZXRTY2FuQ2FjaGUoc2VsZikge1xuICBzZWxmLl9faW5kZXhfXyA9IC0xO1xuICBzZWxmLl9fdGV4dF9jYWNoZV9fICAgPSAnJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFsaWRhdG9yKHJlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGV4dCwgcG9zKSB7XG4gICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICBpZiAocmUudGVzdCh0YWlsKSkge1xuICAgICAgcmV0dXJuIHRhaWwubWF0Y2gocmUpWzBdLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vcm1hbGl6ZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobWF0Y2gsIHNlbGYpIHtcbiAgICBzZWxmLm5vcm1hbGl6ZShtYXRjaCk7XG4gIH07XG59XG5cbi8vIFNjaGVtYXMgY29tcGlsZXIuIEJ1aWxkIHJlZ2V4cHMuXG4vL1xuZnVuY3Rpb24gY29tcGlsZShzZWxmKSB7XG5cbiAgLy8gTG9hZCAmIGNsb25lIFJFIHBhdHRlcm5zLlxuICB2YXIgcmUgPSBzZWxmLnJlID0gYXNzaWduKHt9LCByZXF1aXJlKCcuL2xpYi9yZScpKTtcblxuICAvLyBEZWZpbmUgZHluYW1pYyBwYXR0ZXJuc1xuICB2YXIgdGxkcyA9IHNlbGYuX190bGRzX18uc2xpY2UoKTtcblxuICBpZiAoIXNlbGYuX190bGRzX3JlcGxhY2VkX18pIHtcbiAgICB0bGRzLnB1c2goJ1thLXpdezJ9Jyk7XG4gIH1cbiAgdGxkcy5wdXNoKHJlLnNyY194bik7XG5cbiAgcmUuc3JjX3RsZHMgPSB0bGRzLmpvaW4oJ3wnKTtcblxuICBmdW5jdGlvbiB1bnRwbCh0cGwpIHsgcmV0dXJuIHRwbC5yZXBsYWNlKCclVExEUyUnLCByZS5zcmNfdGxkcyk7IH1cblxuICByZS5lbWFpbF9mdXp6eSAgICAgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9lbWFpbF9mdXp6eSksICdpJyk7XG4gIHJlLmxpbmtfZnV6enkgICAgICAgPSBSZWdFeHAodW50cGwocmUudHBsX2xpbmtfZnV6enkpLCAnaScpO1xuICByZS5ob3N0X2Z1enp5X3Rlc3QgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9ob3N0X2Z1enp5X3Rlc3QpLCAnaScpO1xuXG4gIC8vXG4gIC8vIENvbXBpbGUgZWFjaCBzY2hlbWFcbiAgLy9cblxuICB2YXIgYWxpYXNlcyA9IFtdO1xuXG4gIHNlbGYuX19jb21waWxlZF9fID0ge307IC8vIFJlc2V0IGNvbXBpbGVkIGRhdGFcblxuICBmdW5jdGlvbiBzY2hlbWFFcnJvcihuYW1lLCB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJyhMaW5raWZ5SXQpIEludmFsaWQgc2NoZW1hIFwiJyArIG5hbWUgKyAnXCI6ICcgKyB2YWwpO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoc2VsZi5fX3NjaGVtYXNfXykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB2YWwgPSBzZWxmLl9fc2NoZW1hc19fW25hbWVdO1xuXG4gICAgLy8gc2tpcCBkaXNhYmxlZCBtZXRob2RzXG4gICAgaWYgKHZhbCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjb21waWxlZCA9IHsgdmFsaWRhdGU6IG51bGwsIGxpbms6IG51bGwgfTtcblxuICAgIHNlbGYuX19jb21waWxlZF9fW25hbWVdID0gY29tcGlsZWQ7XG5cbiAgICBpZiAoaXNPYmplY3QodmFsKSkge1xuICAgICAgaWYgKGlzUmVnRXhwKHZhbC52YWxpZGF0ZSkpIHtcbiAgICAgICAgY29tcGlsZWQudmFsaWRhdGUgPSBjcmVhdGVWYWxpZGF0b3IodmFsLnZhbGlkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih2YWwudmFsaWRhdGUpKSB7XG4gICAgICAgIGNvbXBpbGVkLnZhbGlkYXRlID0gdmFsLnZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRnVuY3Rpb24odmFsLm5vcm1hbGl6ZSkpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gdmFsLm5vcm1hbGl6ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXZhbC5ub3JtYWxpemUpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gY3JlYXRlTm9ybWFsaXplcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICBhbGlhc2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgfSk7XG5cbiAgLy9cbiAgLy8gQ29tcGlsZSBwb3N0cG9uZWQgYWxpYXNlc1xuICAvL1xuXG4gIGFsaWFzZXMuZm9yRWFjaChmdW5jdGlvbiAoYWxpYXMpIHtcbiAgICBpZiAoIXNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXSkge1xuICAgICAgLy8gU2lsZW50bHkgZmFpbCBvbiBtaXNzZWQgc2NoZW1hcyB0byBhdm9pZCBlcnJvbnMgb24gZGlzYWJsZS5cbiAgICAgIC8vIHNjaGVtYUVycm9yKGFsaWFzLCBzZWxmLl9fc2NoZW1hc19fW2FsaWFzXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5fX2NvbXBpbGVkX19bYWxpYXNdLnZhbGlkYXRlID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS52YWxpZGF0ZTtcbiAgICBzZWxmLl9fY29tcGlsZWRfX1thbGlhc10ubm9ybWFsaXplID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS5ub3JtYWxpemU7XG4gIH0pO1xuXG4gIC8vXG4gIC8vIEZha2UgcmVjb3JkIGZvciBndWVzc2VkIGxpbmtzXG4gIC8vXG4gIHNlbGYuX19jb21waWxlZF9fWycnXSA9IHsgdmFsaWRhdGU6IG51bGwsIG5vcm1hbGl6ZTogY3JlYXRlTm9ybWFsaXplcigpIH07XG5cbiAgLy9cbiAgLy8gQnVpbGQgc2NoZW1hIGNvbmRpdGlvblxuICAvL1xuICB2YXIgc2xpc3QgPSBPYmplY3Qua2V5cyhzZWxmLl9fY29tcGlsZWRfXylcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBkaXNhYmxlZCAmIGZha2Ugc2NoZW1hc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiBzZWxmLl9fY29tcGlsZWRfX1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZXNjYXBlUkUpXG4gICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJ3wnKTtcbiAgLy8gKD8hXykgY2F1c2UgMS41eCBzbG93ZG93blxuICBzZWxmLnJlLnNjaGVtYV90ZXN0ICAgPSBSZWdFeHAoJyhefCg/IV8pKD86PnwnICsgcmUuc3JjX1pQQ2NDZiArICcpKSgnICsgc2xpc3QgKyAnKScsICdpJyk7XG4gIHNlbGYucmUuc2NoZW1hX3NlYXJjaCA9IFJlZ0V4cCgnKF58KD8hXykoPzo+fCcgKyByZS5zcmNfWlBDY0NmICsgJykpKCcgKyBzbGlzdCArICcpJywgJ2lnJyk7XG5cbiAgc2VsZi5yZS5wcmV0ZXN0ICAgICAgID0gUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcoJyArIHNlbGYucmUuc2NoZW1hX3Rlc3Quc291cmNlICsgJyl8JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgc2VsZi5yZS5ob3N0X2Z1enp5X3Rlc3Quc291cmNlICsgJyl8JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpJyk7XG5cbiAgLy9cbiAgLy8gQ2xlYW51cFxuICAvL1xuXG4gIHJlc2V0U2NhbkNhY2hlKHNlbGYpO1xufVxuXG4vKipcbiAqIGNsYXNzIE1hdGNoXG4gKlxuICogTWF0Y2ggcmVzdWx0LiBTaW5nbGUgZWxlbWVudCBvZiBhcnJheSwgcmV0dXJuZWQgYnkgW1tMaW5raWZ5SXQjbWF0Y2hdXVxuICoqL1xuZnVuY3Rpb24gTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIHN0YXJ0ID0gc2VsZi5fX2luZGV4X18sXG4gICAgICBlbmQgICA9IHNlbGYuX19sYXN0X2luZGV4X18sXG4gICAgICB0ZXh0ICA9IHNlbGYuX190ZXh0X2NhY2hlX18uc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgLyoqXG4gICAqIE1hdGNoI3NjaGVtYSAtPiBTdHJpbmdcbiAgICpcbiAgICogUHJlZml4IChwcm90b2NvbCkgZm9yIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMuc2NoZW1hICAgID0gc2VsZi5fX3NjaGVtYV9fLnRvTG93ZXJDYXNlKCk7XG4gIC8qKlxuICAgKiBNYXRjaCNpbmRleCAtPiBOdW1iZXJcbiAgICpcbiAgICogRmlyc3QgcG9zaXRpb24gb2YgbWF0Y2hlZCBzdHJpbmcuXG4gICAqKi9cbiAgdGhpcy5pbmRleCAgICAgPSBzdGFydCArIHNoaWZ0O1xuICAvKipcbiAgICogTWF0Y2gjbGFzdEluZGV4IC0+IE51bWJlclxuICAgKlxuICAgKiBOZXh0IHBvc2l0aW9uIGFmdGVyIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMubGFzdEluZGV4ID0gZW5kICsgc2hpZnQ7XG4gIC8qKlxuICAgKiBNYXRjaCNyYXcgLT4gU3RyaW5nXG4gICAqXG4gICAqIE1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMucmF3ICAgICAgID0gdGV4dDtcbiAgLyoqXG4gICAqIE1hdGNoI3RleHQgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vdG1hbGl6ZWQgdGV4dCBvZiBtYXRjaGVkIHN0cmluZy5cbiAgICoqL1xuICB0aGlzLnRleHQgICAgICA9IHRleHQ7XG4gIC8qKlxuICAgKiBNYXRjaCN1cmwgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vcm1hbGl6ZWQgdXJsIG9mIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMudXJsICAgICAgID0gdGV4dDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIG1hdGNoID0gbmV3IE1hdGNoKHNlbGYsIHNoaWZ0KTtcblxuICBzZWxmLl9fY29tcGlsZWRfX1ttYXRjaC5zY2hlbWFdLm5vcm1hbGl6ZShtYXRjaCwgc2VsZik7XG5cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5cbi8qKlxuICogY2xhc3MgTGlua2lmeUl0XG4gKiovXG5cbi8qKlxuICogbmV3IExpbmtpZnlJdChzY2hlbWFzKVxuICogLSBzY2hlbWFzIChPYmplY3QpOiBPcHRpb25hbC4gQWRkaXRpb25hbCBzY2hlbWFzIHRvIHZhbGlkYXRlIChwcmVmaXgvdmFsaWRhdG9yKVxuICpcbiAqIENyZWF0ZXMgbmV3IGxpbmtpZmllciBpbnN0YW5jZSB3aXRoIG9wdGlvbmFsIGFkZGl0aW9uYWwgc2NoZW1hcy5cbiAqIENhbiBiZSBjYWxsZWQgd2l0aG91dCBgbmV3YCBrZXl3b3JkIGZvciBjb252ZW5pZW5jZS5cbiAqXG4gKiBCeSBkZWZhdWx0IHVuZGVyc3RhbmRzOlxuICpcbiAqIC0gYGh0dHAocyk6Ly8uLi5gICwgYGZ0cDovLy4uLmAsIGBtYWlsdG86Li4uYCAmIGAvLy4uLmAgbGlua3NcbiAqIC0gXCJmdXp6eVwiIGxpbmtzIGFuZCBlbWFpbHMgKGV4YW1wbGUuY29tLCBmb29AYmFyLmNvbSkuXG4gKlxuICogYHNjaGVtYXNgIGlzIGFuIG9iamVjdCwgd2hlcmUgZWFjaCBrZXkvdmFsdWUgZGVzY3JpYmVzIHByb3RvY29sL3J1bGU6XG4gKlxuICogLSBfX2tleV9fIC0gbGluayBwcmVmaXggKHVzdWFsbHksIHByb3RvY29sIG5hbWUgd2l0aCBgOmAgYXQgdGhlIGVuZCwgYHNreXBlOmBcbiAqICAgZm9yIGV4YW1wbGUpLiBgbGlua2lmeS1pdGAgbWFrZXMgc2h1cmUgdGhhdCBwcmVmaXggaXMgbm90IHByZWNlZWRlZCB3aXRoXG4gKiAgIGFscGhhbnVtZXJpYyBjaGFyIGFuZCBzeW1ib2xzLiBPbmx5IHdoaXRlc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiBhbGxvd2VkLlxuICogLSBfX3ZhbHVlX18gLSBydWxlIHRvIGNoZWNrIHRhaWwgYWZ0ZXIgbGluayBwcmVmaXhcbiAqICAgLSBfU3RyaW5nXyAtIGp1c3QgYWxpYXMgdG8gZXhpc3RpbmcgcnVsZVxuICogICAtIF9PYmplY3RfXG4gKiAgICAgLSBfdmFsaWRhdGVfIC0gdmFsaWRhdG9yIGZ1bmN0aW9uIChzaG91bGQgcmV0dXJuIG1hdGNoZWQgbGVuZ3RoIG9uIHN1Y2Nlc3MpLFxuICogICAgICAgb3IgYFJlZ0V4cGAuXG4gKiAgICAgLSBfbm9ybWFsaXplXyAtIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0ZXh0ICYgdXJsIG9mIG1hdGNoZWQgcmVzdWx0XG4gKiAgICAgICAoZm9yIGV4YW1wbGUsIGZvciBAdHdpdHRlciBtZW50aW9ucykuXG4gKiovXG5mdW5jdGlvbiBMaW5raWZ5SXQoc2NoZW1hcykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGlua2lmeUl0KSkge1xuICAgIHJldHVybiBuZXcgTGlua2lmeUl0KHNjaGVtYXMpO1xuICB9XG5cbiAgLy8gQ2FjaGUgbGFzdCB0ZXN0ZWQgcmVzdWx0LiBVc2VkIHRvIHNraXAgcmVwZWF0aW5nIHN0ZXBzIG9uIG5leHQgYG1hdGNoYCBjYWxsLlxuICB0aGlzLl9faW5kZXhfXyAgICAgICAgICA9IC0xO1xuICB0aGlzLl9fbGFzdF9pbmRleF9fICAgICA9IC0xOyAvLyBOZXh0IHNjYW4gcG9zaXRpb25cbiAgdGhpcy5fX3NjaGVtYV9fICAgICAgICAgPSAnJztcbiAgdGhpcy5fX3RleHRfY2FjaGVfXyAgICAgPSAnJztcblxuICB0aGlzLl9fc2NoZW1hc19fICAgICAgICA9IGFzc2lnbih7fSwgZGVmYXVsdFNjaGVtYXMsIHNjaGVtYXMpO1xuICB0aGlzLl9fY29tcGlsZWRfXyAgICAgICA9IHt9O1xuXG4gIHRoaXMuX190bGRzX18gICAgICAgICAgID0gdGxkc19kZWZhdWx0O1xuICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fICA9IGZhbHNlO1xuXG4gIHRoaXMucmUgPSB7fTtcblxuICBjb21waWxlKHRoaXMpO1xufVxuXG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCNhZGQoc2NoZW1hLCBkZWZpbml0aW9uKVxuICogLSBzY2hlbWEgKFN0cmluZyk6IHJ1bGUgbmFtZSAoZml4ZWQgcGF0dGVybiBwcmVmaXgpXG4gKiAtIGRlZmluaXRpb24gKFN0cmluZ3xSZWdFeHB8T2JqZWN0KTogc2NoZW1hIGRlZmluaXRpb25cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgZGVmaW5pdGlvbi4gU2VlIGNvbnN0cnVjdG9yIGRlc2NyaXB0aW9uIGZvciBkZXRhaWxzLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoc2NoZW1hLCBkZWZpbml0aW9uKSB7XG4gIHRoaXMuX19zY2hlbWFzX19bc2NoZW1hXSA9IGRlZmluaXRpb247XG4gIGNvbXBpbGUodGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCN0ZXN0KHRleHQpIC0+IEJvb2xlYW5cbiAqXG4gKiBTZWFyY2hlcyBsaW5raWZpYWJsZSBwYXR0ZXJuIGFuZCByZXR1cm5zIGB0cnVlYCBvbiBzdWNjZXNzIG9yIGBmYWxzZWAgb24gZmFpbC5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGVzdCA9IGZ1bmN0aW9uIHRlc3QodGV4dCkge1xuICAvLyBSZXNldCBzY2FuIGNhY2hlXG4gIHRoaXMuX190ZXh0X2NhY2hlX18gPSB0ZXh0O1xuICB0aGlzLl9faW5kZXhfXyAgICAgID0gLTE7XG5cbiAgaWYgKCF0ZXh0Lmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB2YXIgbSwgbWwsIG1lLCBsZW4sIHNoaWZ0LCBuZXh0LCByZSwgdGxkX3BvcywgYXRfcG9zO1xuXG4gIC8vIHRyeSB0byBzY2FuIGZvciBsaW5rIHdpdGggc2NoZW1hIC0gdGhhdCdzIHRoZSBtb3N0IHNpbXBsZSBydWxlXG4gIGlmICh0aGlzLnJlLnNjaGVtYV90ZXN0LnRlc3QodGV4dCkpIHtcbiAgICByZSA9IHRoaXMucmUuc2NoZW1hX3NlYXJjaDtcbiAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IHJlLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBsZW4gPSB0aGlzLnRlc3RTY2hlbWFBdCh0ZXh0LCBtWzJdLCByZS5sYXN0SW5kZXgpO1xuICAgICAgaWYgKGxlbikge1xuICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gbVsyXTtcbiAgICAgICAgdGhpcy5fX2luZGV4X18gICAgICA9IG0uaW5kZXggKyBtWzFdLmxlbmd0aDtcbiAgICAgICAgdGhpcy5fX2xhc3RfaW5kZXhfXyA9IG0uaW5kZXggKyBtWzBdLmxlbmd0aCArIGxlbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX19jb21waWxlZF9fWydodHRwOiddKSB7XG4gICAgLy8gZ3Vlc3Mgc2NoZW1hbGVzcyBsaW5rc1xuICAgIHRsZF9wb3MgPSB0ZXh0LnNlYXJjaCh0aGlzLnJlLmhvc3RfZnV6enlfdGVzdCk7XG4gICAgaWYgKHRsZF9wb3MgPj0gMCkge1xuICAgICAgLy8gaWYgdGxkIGlzIGxvY2F0ZWQgYWZ0ZXIgZm91bmQgbGluayAtIG5vIG5lZWQgdG8gY2hlY2sgZnV6enkgcGF0dGVyblxuICAgICAgaWYgKHRoaXMuX19pbmRleF9fIDwgMCB8fCB0bGRfcG9zIDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgaWYgKChtbCA9IHRleHQubWF0Y2godGhpcy5yZS5saW5rX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIHNoaWZ0ID0gbWwuaW5kZXggKyBtbFsxXS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX2luZGV4X18gPCAwIHx8IHNoaWZ0IDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlbWFfXyAgICAgPSAnJztcbiAgICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICAgIHRoaXMuX19sYXN0X2luZGV4X18gPSBtbC5pbmRleCArIG1sWzBdLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fX2NvbXBpbGVkX19bJ21haWx0bzonXSkge1xuICAgIC8vIGd1ZXNzIHNjaGVtYWxlc3MgZW1haWxzXG4gICAgYXRfcG9zID0gdGV4dC5pbmRleE9mKCdAJyk7XG4gICAgaWYgKGF0X3BvcyA+PSAwKSB7XG4gICAgICAvLyBXZSBjYW4ndCBza2lwIHRoaXMgY2hlY2ssIGJlY2F1c2UgdGhpcyBjYXNlcyBhcmUgcG9zc2libGU6XG4gICAgICAvLyAxOTIuMTY4LjEuMUBnbWFpbC5jb20sIG15LmluQGV4YW1wbGUuY29tXG4gICAgICBpZiAoKG1lID0gdGV4dC5tYXRjaCh0aGlzLnJlLmVtYWlsX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICBzaGlmdCA9IG1lLmluZGV4ICsgbWVbMV0ubGVuZ3RoO1xuICAgICAgICBuZXh0ICA9IG1lLmluZGV4ICsgbWVbMF0ubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0aGlzLl9faW5kZXhfXyA8IDAgfHwgc2hpZnQgPCB0aGlzLl9faW5kZXhfXyB8fFxuICAgICAgICAgICAgKHNoaWZ0ID09PSB0aGlzLl9faW5kZXhfXyAmJiBuZXh0ID4gdGhpcy5fX2xhc3RfaW5kZXhfXykpIHtcbiAgICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gJ21haWx0bzonO1xuICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICB0aGlzLl9fbGFzdF9pbmRleF9fID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLl9faW5kZXhfXyA+PSAwO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCNwcmV0ZXN0KHRleHQpIC0+IEJvb2xlYW5cbiAqXG4gKiBWZXJ5IHF1aWNrIGNoZWNrLCB0aGF0IGNhbiBnaXZlIGZhbHNlIHBvc2l0aXZlcy4gUmV0dXJucyB0cnVlIGlmIGxpbmsgTUFZIEJFXG4gKiBjYW4gZXhpc3RzLiBDYW4gYmUgdXNlZCBmb3Igc3BlZWQgb3B0aW1pemF0aW9uLCB3aGVuIHlvdSBuZWVkIHRvIGNoZWNrIHRoYXRcbiAqIGxpbmsgTk9UIGV4aXN0cy5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUucHJldGVzdCA9IGZ1bmN0aW9uIHByZXRlc3QodGV4dCkge1xuICByZXR1cm4gdGhpcy5yZS5wcmV0ZXN0LnRlc3QodGV4dCk7XG59O1xuXG5cbi8qKlxuICogTGlua2lmeUl0I3Rlc3RTY2hlbWFBdCh0ZXh0LCBuYW1lLCBwb3NpdGlvbikgLT4gTnVtYmVyXG4gKiAtIHRleHQgKFN0cmluZyk6IHRleHQgdG8gc2NhblxuICogLSBuYW1lIChTdHJpbmcpOiBydWxlIChzY2hlbWEpIG5hbWVcbiAqIC0gcG9zaXRpb24gKE51bWJlcik6IHRleHQgb2Zmc2V0IHRvIGNoZWNrIGZyb21cbiAqXG4gKiBTaW1pbGFyIHRvIFtbTGlua2lmeUl0I3Rlc3RdXSBidXQgY2hlY2tzIG9ubHkgc3BlY2lmaWMgcHJvdG9jb2wgdGFpbCBleGFjdGx5XG4gKiBhdCBnaXZlbiBwb3NpdGlvbi4gUmV0dXJucyBsZW5ndGggb2YgZm91bmQgcGF0dGVybiAoMCBvbiBmYWlsKS5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGVzdFNjaGVtYUF0ID0gZnVuY3Rpb24gdGVzdFNjaGVtYUF0KHRleHQsIHNjaGVtYSwgcG9zKSB7XG4gIC8vIElmIG5vdCBzdXBwb3J0ZWQgc2NoZW1hIGNoZWNrIHJlcXVlc3RlZCAtIHRlcm1pbmF0ZVxuICBpZiAoIXRoaXMuX19jb21waWxlZF9fW3NjaGVtYS50b0xvd2VyQ2FzZSgpXSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiB0aGlzLl9fY29tcGlsZWRfX1tzY2hlbWEudG9Mb3dlckNhc2UoKV0udmFsaWRhdGUodGV4dCwgcG9zLCB0aGlzKTtcbn07XG5cblxuLyoqXG4gKiBMaW5raWZ5SXQjbWF0Y2godGV4dCkgLT4gQXJyYXl8bnVsbFxuICpcbiAqIFJldHVybnMgYXJyYXkgb2YgZm91bmQgbGluayBkZXNjcmlwdGlvbnMgb3IgYG51bGxgIG9uIGZhaWwuIFdlIHN0cm9uZ2x5XG4gKiB0byB1c2UgW1tMaW5raWZ5SXQjdGVzdF1dIGZpcnN0LCBmb3IgYmVzdCBzcGVlZC5cbiAqXG4gKiAjIyMjIyBSZXN1bHQgbWF0Y2ggZGVzY3JpcHRpb25cbiAqXG4gKiAtIF9fc2NoZW1hX18gLSBsaW5rIHNjaGVtYSwgY2FuIGJlIGVtcHR5IGZvciBmdXp6eSBsaW5rcywgb3IgYC8vYCBmb3JcbiAqICAgcHJvdG9jb2wtbmV1dHJhbCAgbGlua3MuXG4gKiAtIF9faW5kZXhfXyAtIG9mZnNldCBvZiBtYXRjaGVkIHRleHRcbiAqIC0gX19sYXN0SW5kZXhfXyAtIGluZGV4IG9mIG5leHQgY2hhciBhZnRlciBtYXRoY2ggZW5kXG4gKiAtIF9fcmF3X18gLSBtYXRjaGVkIHRleHRcbiAqIC0gX190ZXh0X18gLSBub3JtYWxpemVkIHRleHRcbiAqIC0gX191cmxfXyAtIGxpbmssIGdlbmVyYXRlZCBmcm9tIG1hdGNoZWQgdGV4dFxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIG1hdGNoKHRleHQpIHtcbiAgdmFyIHNoaWZ0ID0gMCwgcmVzdWx0ID0gW107XG5cbiAgLy8gVHJ5IHRvIHRha2UgcHJldmlvdXMgZWxlbWVudCBmcm9tIGNhY2hlLCBpZiAudGVzdCgpIGNhbGxlZCBiZWZvcmVcbiAgaWYgKHRoaXMuX19pbmRleF9fID49IDAgJiYgdGhpcy5fX3RleHRfY2FjaGVfXyA9PT0gdGV4dCkge1xuICAgIHJlc3VsdC5wdXNoKGNyZWF0ZU1hdGNoKHRoaXMsIHNoaWZ0KSk7XG4gICAgc2hpZnQgPSB0aGlzLl9fbGFzdF9pbmRleF9fO1xuICB9XG5cbiAgLy8gQ3V0IGhlYWQgaWYgY2FjaGUgd2FzIHVzZWRcbiAgdmFyIHRhaWwgPSBzaGlmdCA/IHRleHQuc2xpY2Uoc2hpZnQpIDogdGV4dDtcblxuICAvLyBTY2FuIHN0cmluZyB1bnRpbCBlbmQgcmVhY2hlZFxuICB3aGlsZSAodGhpcy50ZXN0KHRhaWwpKSB7XG4gICAgcmVzdWx0LnB1c2goY3JlYXRlTWF0Y2godGhpcywgc2hpZnQpKTtcblxuICAgIHRhaWwgPSB0YWlsLnNsaWNlKHRoaXMuX19sYXN0X2luZGV4X18pO1xuICAgIHNoaWZ0ICs9IHRoaXMuX19sYXN0X2luZGV4X187XG4gIH1cblxuICBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqIGNoYWluYWJsZVxuICogTGlua2lmeUl0I3RsZHMobGlzdCBbLCBrZWVwT2xkXSkgLT4gdGhpc1xuICogLSBsaXN0IChBcnJheSk6IGxpc3Qgb2YgdGxkc1xuICogLSBrZWVwT2xkIChCb29sZWFuKTogbWVyZ2Ugd2l0aCBjdXJyZW50IGxpc3QgaWYgYHRydWVgIChgZmFsc2VgIGJ5IGRlZmF1bHQpXG4gKlxuICogTG9hZCAob3IgbWVyZ2UpIG5ldyB0bGRzIGxpc3QuIFRob3NlIGFyZSB1c2VyIGZvciBmdXp6eSBsaW5rcyAod2l0aG91dCBwcmVmaXgpXG4gKiB0byBhdm9pZCBmYWxzZSBwb3NpdGl2ZXMuIEJ5IGRlZmF1bHQgdGhpcyBhbGdvcnl0aG0gdXNlZDpcbiAqXG4gKiAtIGhvc3RuYW1lIHdpdGggYW55IDItbGV0dGVyIHJvb3Qgem9uZXMgYXJlIG9rLlxuICogLSBiaXp8Y29tfGVkdXxnb3Z8bmV0fG9yZ3xwcm98d2VifHh4eHxhZXJvfGFzaWF8Y29vcHxpbmZvfG11c2V1bXxuYW1lfHNob3B80YDRhFxuICogICBhcmUgb2suXG4gKiAtIGVuY29kZWQgKGB4bi0tLi4uYCkgcm9vdCB6b25lcyBhcmUgb2suXG4gKlxuICogSWYgbGlzdCBpcyByZXBsYWNlZCwgdGhlbiBleGFjdCBtYXRjaCBmb3IgMi1jaGFycyByb290IHpvbmVzIHdpbGwgYmUgY2hlY2tlZC5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGxkcyA9IGZ1bmN0aW9uIHRsZHMobGlzdCwga2VlcE9sZCkge1xuICBsaXN0ID0gQXJyYXkuaXNBcnJheShsaXN0KSA/IGxpc3QgOiBbIGxpc3QgXTtcblxuICBpZiAoIWtlZXBPbGQpIHtcbiAgICB0aGlzLl9fdGxkc19fID0gbGlzdC5zbGljZSgpO1xuICAgIHRoaXMuX190bGRzX3JlcGxhY2VkX18gPSB0cnVlO1xuICAgIGNvbXBpbGUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0aGlzLl9fdGxkc19fID0gdGhpcy5fX3RsZHNfXy5jb25jYXQobGlzdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlbCwgaWR4LCBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbCAhPT0gYXJyW2lkeCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJldmVyc2UoKTtcblxuICBjb21waWxlKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTGlua2lmeUl0I25vcm1hbGl6ZShtYXRjaClcbiAqXG4gKiBEZWZhdWx0IG5vcm1hbGl6ZXIgKGlmIHNjaGVtYSBkb2VzIG5vdCBkZWZpbmUgaXQncyBvd24pLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUobWF0Y2gpIHtcblxuICAvLyBEbyBtaW5pbWFsIHBvc3NpYmxlIGNoYW5nZXMgYnkgZGVmYXVsdC4gTmVlZCB0byBjb2xsZWN0IGZlZWRiYWNrIHByaW9yXG4gIC8vIHRvIG1vdmUgZm9yd2FyZCBodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbGlua2lmeS1pdC9pc3N1ZXMvMVxuXG4gIGlmICghbWF0Y2guc2NoZW1hKSB7IG1hdGNoLnVybCA9ICdodHRwOi8vJyArIG1hdGNoLnVybDsgfVxuXG4gIGlmIChtYXRjaC5zY2hlbWEgPT09ICdtYWlsdG86JyAmJiAhL15tYWlsdG86L2kudGVzdChtYXRjaC51cmwpKSB7XG4gICAgbWF0Y2gudXJsID0gJ21haWx0bzonICsgbWF0Y2gudXJsO1xuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTGlua2lmeUl0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBVc2UgZGlyZWN0IGV4dHJhY3QgaW5zdGVhZCBvZiBgcmVnZW5lcmF0ZWAgdG8gcmVkdXNlIGJyb3dzZXJpZmllZCBzaXplXG52YXIgc3JjX0FueSA9IGV4cG9ydHMuc3JjX0FueSA9IHJlcXVpcmUoJ3VjLm1pY3JvL3Byb3BlcnRpZXMvQW55L3JlZ2V4Jykuc291cmNlO1xudmFyIHNyY19DYyAgPSBleHBvcnRzLnNyY19DYyA9IHJlcXVpcmUoJ3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2MvcmVnZXgnKS5zb3VyY2U7XG52YXIgc3JjX0NmICA9IGV4cG9ydHMuc3JjX0NmID0gcmVxdWlyZSgndWMubWljcm8vY2F0ZWdvcmllcy9DZi9yZWdleCcpLnNvdXJjZTtcbnZhciBzcmNfWiAgID0gZXhwb3J0cy5zcmNfWiAgPSByZXF1aXJlKCd1Yy5taWNyby9jYXRlZ29yaWVzL1ovcmVnZXgnKS5zb3VyY2U7XG52YXIgc3JjX1AgICA9IGV4cG9ydHMuc3JjX1AgID0gcmVxdWlyZSgndWMubWljcm8vY2F0ZWdvcmllcy9QL3JlZ2V4Jykuc291cmNlO1xuXG4vLyBcXHB7XFxaXFxQXFxDY1xcQ0Z9ICh3aGl0ZSBzcGFjZXMgKyBjb250cm9sICsgZm9ybWF0ICsgcHVuY3R1YXRpb24pXG52YXIgc3JjX1pQQ2NDZiA9IGV4cG9ydHMuc3JjX1pQQ2NDZiA9IFsgc3JjX1osIHNyY19QLCBzcmNfQ2MsIHNyY19DZiBdLmpvaW4oJ3wnKTtcblxuLy8gXFxwe1xcWlxcQ2NcXENGfSAod2hpdGUgc3BhY2VzICsgY29udHJvbCArIGZvcm1hdClcbnZhciBzcmNfWkNjQ2YgPSBleHBvcnRzLnNyY19aQ2NDZiA9IFsgc3JjX1osIHNyY19DYywgc3JjX0NmIF0uam9pbignfCcpO1xuXG4vLyBBbGwgcG9zc2libGUgd29yZCBjaGFyYWN0ZXJzIChldmVyeXRoaW5nIHdpdGhvdXQgcHVuY3R1YXRpb24sIHNwYWNlcyAmIGNvbnRyb2xzKVxuLy8gRGVmaW5lZCB2aWEgcHVuY3R1YXRpb24gJiBzcGFjZXMgdG8gc2F2ZSBzcGFjZVxuLy8gU2hvdWxkIGJlIHNvbWV0aGluZyBsaWtlIFxccHtcXExcXE5cXFNcXE19IChcXHcgYnV0IHdpdGhvdXQgYF9gKVxudmFyIHNyY19wc2V1ZG9fbGV0dGVyICAgICAgID0gJyg/Oig/IScgKyBzcmNfWlBDY0NmICsgJyknICsgc3JjX0FueSArICcpJztcbi8vIFRoZSBzYW1lIGFzIGFib3RoZSBidXQgd2l0aG91dCBbMC05XVxudmFyIHNyY19wc2V1ZG9fbGV0dGVyX25vbl9kID0gJyg/Oig/IVswLTldfCcgKyBzcmNfWlBDY0NmICsgJyknICsgc3JjX0FueSArICcpJztcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIHNyY19pcDQgPSBleHBvcnRzLnNyY19pcDQgPVxuXG4gICcoPzooMjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KVxcXFwuKXszfSgyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pJztcblxuZXhwb3J0cy5zcmNfYXV0aCAgICA9ICcoPzooPzooPyEnICsgc3JjX1pDY0NmICsgJykuKStAKT8nO1xuXG52YXIgc3JjX3BvcnQgPSBleHBvcnRzLnNyY19wb3J0ID1cblxuICAnKD86Oig/OjYoPzpbMC00XVxcXFxkezN9fDUoPzpbMC00XVxcXFxkezJ9fDUoPzpbMC0yXVxcXFxkfDNbMC01XSkpKXxbMS01XT9cXFxcZHsxLDR9KSk/JztcblxudmFyIHNyY19ob3N0X3Rlcm1pbmF0b3IgPSBleHBvcnRzLnNyY19ob3N0X3Rlcm1pbmF0b3IgPVxuXG4gICcoPz0kfCcgKyBzcmNfWlBDY0NmICsgJykoPyEtfF98OlxcXFxkfFxcXFwuLXxcXFxcLig/ISR8JyArIHNyY19aUENjQ2YgKyAnKSknO1xuXG52YXIgc3JjX3BhdGggPSBleHBvcnRzLnNyY19wYXRoID1cblxuICAnKD86JyArXG4gICAgJ1svPyNdJyArXG4gICAgICAnKD86JyArXG4gICAgICAgICcoPyEnICsgc3JjX1pDY0NmICsgJ3xbKClbXFxcXF17fS4sXCJcXCc/IVxcXFwtXSkufCcgK1xuICAgICAgICAnXFxcXFsoPzooPyEnICsgc3JjX1pDY0NmICsgJ3xcXFxcXSkuKSpcXFxcXXwnICtcbiAgICAgICAgJ1xcXFwoKD86KD8hJyArIHNyY19aQ2NDZiArICd8WyldKS4pKlxcXFwpfCcgK1xuICAgICAgICAnXFxcXHsoPzooPyEnICsgc3JjX1pDY0NmICsgJ3xbfV0pLikqXFxcXH18JyArXG4gICAgICAgICdcXFxcXCIoPzooPyEnICsgc3JjX1pDY0NmICsgJ3xbXCJdKS4pK1xcXFxcInwnICtcbiAgICAgICAgXCJcXFxcJyg/Oig/IVwiICsgc3JjX1pDY0NmICsgXCJ8WyddKS4pK1xcXFwnfFwiICtcbiAgICAgICAgXCJcXFxcJyg/PVwiICsgc3JjX3BzZXVkb19sZXR0ZXIgKyAnKS58JyArICAvLyBhbGxvdyBgSSdtX2tpbmdgIGlmIG5vIHBhaXIgZm91bmRcbiAgICAgICAgJ1xcXFwuezIsM31bYS16QS1aMC05JV18JyArIC8vIGdpdGh1YiBoYXMgLi4uIGluIGNvbW1pdCByYW5nZSBsaW5rcy4gUmVzdHJpY3QgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbmdsaXNoICYgcGVyY2VudC1lbmNvZGVkIG9ubHksIHVudGlsIG1vcmUgZXhhbXBsZXMgZm91bmQuXG4gICAgICAgICdcXFxcLig/IScgKyBzcmNfWkNjQ2YgKyAnfFsuXSkufCcgK1xuICAgICAgICAnXFxcXC0oPyEnICsgc3JjX1pDY0NmICsgJ3wtLSg/OlteLV18JCkpKD86Wy1dK3wuKXwnICsgIC8vIGAtLS1gID0+IGxvbmcgZGFzaCwgdGVybWluYXRlXG4gICAgICAgICdcXFxcLCg/IScgKyBzcmNfWkNjQ2YgKyAnKS58JyArICAgICAgLy8gYWxsb3cgYCwsLGAgaW4gcGF0aHNcbiAgICAgICAgJ1xcXFwhKD8hJyArIHNyY19aQ2NDZiArICd8WyFdKS58JyArXG4gICAgICAgICdcXFxcPyg/IScgKyBzcmNfWkNjQ2YgKyAnfFs/XSkuJyArXG4gICAgICAnKSsnICtcbiAgICAnfFxcXFwvJyArXG4gICcpPyc7XG5cbnZhciBzcmNfZW1haWxfbmFtZSA9IGV4cG9ydHMuc3JjX2VtYWlsX25hbWUgPVxuXG4gICdbXFxcXC07OiY9XFxcXCtcXFxcJCxcXFxcXCJcXFxcLmEtekEtWjAtOV9dKyc7XG5cbnZhciBzcmNfeG4gPSBleHBvcnRzLnNyY194biA9XG5cbiAgJ3huLS1bYS16MC05XFxcXC1dezEsNTl9JztcblxuLy8gTW9yZSB0byByZWFkIGFib3V0IGRvbWFpbiBuYW1lc1xuLy8gaHR0cDovL3NlcnZlcmZhdWx0LmNvbS9xdWVzdGlvbnMvNjM4MjYwL1xuXG52YXIgc3JjX2RvbWFpbl9yb290ID0gZXhwb3J0cy5zcmNfZG9tYWluX3Jvb3QgPVxuXG4gIC8vIENhbid0IGhhdmUgZGlnaXRzIGFuZCBkYXNoZXNcbiAgJyg/OicgK1xuICAgIHNyY194biArXG4gICAgJ3wnICtcbiAgICBzcmNfcHNldWRvX2xldHRlcl9ub25fZCArICd7MSw2M30nICtcbiAgJyknO1xuXG52YXIgc3JjX2RvbWFpbiA9IGV4cG9ydHMuc3JjX2RvbWFpbiA9XG5cbiAgJyg/OicgK1xuICAgIHNyY194biArXG4gICAgJ3wnICtcbiAgICAnKD86JyArIHNyY19wc2V1ZG9fbGV0dGVyICsgJyknICtcbiAgICAnfCcgK1xuICAgIC8vIGRvbid0IGFsbG93IGAtLWAgaW4gZG9tYWluIG5hbWVzLCBiZWNhdXNlOlxuICAgIC8vIC0gdGhhdCBjYW4gY29uZmxpY3Qgd2l0aCBtYXJrZG93biAmbWRhc2g7IC8gJm5kYXNoO1xuICAgIC8vIC0gbm9ib2R5IHVzZSB0aG9zZSBhbnl3YXlcbiAgICAnKD86JyArIHNyY19wc2V1ZG9fbGV0dGVyICsgJyg/Oi0oPyEtKXwnICsgc3JjX3BzZXVkb19sZXR0ZXIgKyAnKXswLDYxfScgKyBzcmNfcHNldWRvX2xldHRlciArICcpJyArXG4gICcpJztcblxudmFyIHNyY19ob3N0ID0gZXhwb3J0cy5zcmNfaG9zdCA9XG5cbiAgJyg/OicgK1xuICAgIHNyY19pcDQgK1xuICAnfCcgK1xuICAgICcoPzooPzooPzonICsgc3JjX2RvbWFpbiArICcpXFxcXC4pKicgKyBzcmNfZG9tYWluX3Jvb3QgKyAnKScgK1xuICAnKSc7XG5cbnZhciB0cGxfaG9zdF9mdXp6eSA9IGV4cG9ydHMudHBsX2hvc3RfZnV6enkgPVxuXG4gICcoPzonICtcbiAgICBzcmNfaXA0ICtcbiAgJ3wnICtcbiAgICAnKD86KD86KD86JyArIHNyY19kb21haW4gKyAnKVxcXFwuKSsoPzolVExEUyUpKScgK1xuICAnKSc7XG5cbmV4cG9ydHMuc3JjX2hvc3Rfc3RyaWN0ID1cblxuICBzcmNfaG9zdCArIHNyY19ob3N0X3Rlcm1pbmF0b3I7XG5cbnZhciB0cGxfaG9zdF9mdXp6eV9zdHJpY3QgPSBleHBvcnRzLnRwbF9ob3N0X2Z1enp5X3N0cmljdCA9XG5cbiAgdHBsX2hvc3RfZnV6enkgKyBzcmNfaG9zdF90ZXJtaW5hdG9yO1xuXG5leHBvcnRzLnNyY19ob3N0X3BvcnRfc3RyaWN0ID1cblxuICBzcmNfaG9zdCArIHNyY19wb3J0ICsgc3JjX2hvc3RfdGVybWluYXRvcjtcblxudmFyIHRwbF9ob3N0X3BvcnRfZnV6enlfc3RyaWN0ID0gZXhwb3J0cy50cGxfaG9zdF9wb3J0X2Z1enp5X3N0cmljdCA9XG5cbiAgdHBsX2hvc3RfZnV6enkgKyBzcmNfcG9ydCArIHNyY19ob3N0X3Rlcm1pbmF0b3I7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNYWluIHJ1bGVzXG5cbi8vIFJ1ZGUgdGVzdCBmdXp6eSBsaW5rcyBieSBob3N0LCBmb3IgcXVpY2sgZGVueVxuZXhwb3J0cy50cGxfaG9zdF9mdXp6eV90ZXN0ID1cblxuICAnbG9jYWxob3N0fFxcXFwuXFxcXGR7MSwzfVxcXFwufCg/OlxcXFwuKD86JVRMRFMlKSg/OicgKyBzcmNfWlBDY0NmICsgJ3wkKSknO1xuXG5leHBvcnRzLnRwbF9lbWFpbF9mdXp6eSA9XG5cbiAgICAnKF58PnwnICsgc3JjX1pDY0NmICsgJykoJyArIHNyY19lbWFpbF9uYW1lICsgJ0AnICsgdHBsX2hvc3RfZnV6enlfc3RyaWN0ICsgJyknO1xuXG5leHBvcnRzLnRwbF9saW5rX2Z1enp5ID1cbiAgICAvLyBGdXp6eSBsaW5rIGNhbid0IGJlIHByZXBlbmRlZCB3aXRoIC46L1xcLSBhbmQgbm9uIHB1bmN0dWF0aW9uLlxuICAgIC8vIGJ1dCBjYW4gc3RhcnQgd2l0aCA+IChtYXJrZG93biBibG9ja3F1b3RlKVxuICAgICcoXnwoPyFbLjovXFxcXC1fQF0pKD86WyQrPD0+XmB8XXwnICsgc3JjX1pQQ2NDZiArICcpKScgK1xuICAgICcoKD8hWyQrPD0+XmB8XSknICsgdHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgKyBzcmNfcGF0aCArICcpJztcbiIsIlxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cblxudmFyIGRlY29kZUNhY2hlID0ge307XG5cbmZ1bmN0aW9uIGdldERlY29kZUNhY2hlKGV4Y2x1ZGUpIHtcbiAgdmFyIGksIGNoLCBjYWNoZSA9IGRlY29kZUNhY2hlW2V4Y2x1ZGVdO1xuICBpZiAoY2FjaGUpIHsgcmV0dXJuIGNhY2hlOyB9XG5cbiAgY2FjaGUgPSBkZWNvZGVDYWNoZVtleGNsdWRlXSA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCAxMjg7IGkrKykge1xuICAgIGNoID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBjYWNoZS5wdXNoKGNoKTtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBleGNsdWRlLmxlbmd0aDsgaSsrKSB7XG4gICAgY2ggPSBleGNsdWRlLmNoYXJDb2RlQXQoaSk7XG4gICAgY2FjaGVbY2hdID0gJyUnICsgKCcwJyArIGNoLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpKS5zbGljZSgtMik7XG4gIH1cblxuICByZXR1cm4gY2FjaGU7XG59XG5cblxuLy8gRGVjb2RlIHBlcmNlbnQtZW5jb2RlZCBzdHJpbmcuXG4vL1xuZnVuY3Rpb24gZGVjb2RlKHN0cmluZywgZXhjbHVkZSkge1xuICB2YXIgY2FjaGU7XG5cbiAgaWYgKHR5cGVvZiBleGNsdWRlICE9PSAnc3RyaW5nJykge1xuICAgIGV4Y2x1ZGUgPSBkZWNvZGUuZGVmYXVsdENoYXJzO1xuICB9XG5cbiAgY2FjaGUgPSBnZXREZWNvZGVDYWNoZShleGNsdWRlKTtcblxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyglW2EtZjAtOV17Mn0pKy9naSwgZnVuY3Rpb24oc2VxKSB7XG4gICAgdmFyIGksIGwsIGIxLCBiMiwgYjMsIGI0LCBjaGFyLFxuICAgICAgICByZXN1bHQgPSAnJztcblxuICAgIGZvciAoaSA9IDAsIGwgPSBzZXEubGVuZ3RoOyBpIDwgbDsgaSArPSAzKSB7XG4gICAgICBiMSA9IHBhcnNlSW50KHNlcS5zbGljZShpICsgMSwgaSArIDMpLCAxNik7XG5cbiAgICAgIGlmIChiMSA8IDB4ODApIHtcbiAgICAgICAgcmVzdWx0ICs9IGNhY2hlW2IxXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICgoYjEgJiAweEUwKSA9PT0gMHhDMCAmJiAoaSArIDMgPCBsKSkge1xuICAgICAgICAvLyAxMTB4eHh4eCAxMHh4eHh4eFxuICAgICAgICBiMiA9IHBhcnNlSW50KHNlcS5zbGljZShpICsgNCwgaSArIDYpLCAxNik7XG5cbiAgICAgICAgaWYgKChiMiAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgY2hhciA9ICgoYjEgPDwgNikgJiAweDdDMCkgfCAoYjIgJiAweDNGKTtcblxuICAgICAgICAgIGlmIChjaGFyIDwgMHg4MCkge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICdcXHVmZmZkXFx1ZmZmZCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoKGIxICYgMHhGMCkgPT09IDB4RTAgJiYgKGkgKyA2IDwgbCkpIHtcbiAgICAgICAgLy8gMTExMHh4eHggMTB4eHh4eHggMTB4eHh4eHhcbiAgICAgICAgYjIgPSBwYXJzZUludChzZXEuc2xpY2UoaSArIDQsIGkgKyA2KSwgMTYpO1xuICAgICAgICBiMyA9IHBhcnNlSW50KHNlcS5zbGljZShpICsgNywgaSArIDkpLCAxNik7XG5cbiAgICAgICAgaWYgKChiMiAmIDB4QzApID09PSAweDgwICYmIChiMyAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgY2hhciA9ICgoYjEgPDwgMTIpICYgMHhGMDAwKSB8ICgoYjIgPDwgNikgJiAweEZDMCkgfCAoYjMgJiAweDNGKTtcblxuICAgICAgICAgIGlmIChjaGFyIDwgMHg4MDAgfHwgKGNoYXIgPj0gMHhEODAwICYmIGNoYXIgPD0gMHhERkZGKSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICdcXHVmZmZkXFx1ZmZmZFxcdWZmZmQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpICs9IDY7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKChiMSAmIDB4RjgpID09PSAweEYwICYmIChpICsgOSA8IGwpKSB7XG4gICAgICAgIC8vIDExMTExMHh4IDEweHh4eHh4IDEweHh4eHh4IDEweHh4eHh4XG4gICAgICAgIGIyID0gcGFyc2VJbnQoc2VxLnNsaWNlKGkgKyA0LCBpICsgNiksIDE2KTtcbiAgICAgICAgYjMgPSBwYXJzZUludChzZXEuc2xpY2UoaSArIDcsIGkgKyA5KSwgMTYpO1xuICAgICAgICBiNCA9IHBhcnNlSW50KHNlcS5zbGljZShpICsgMTAsIGkgKyAxMiksIDE2KTtcblxuICAgICAgICBpZiAoKGIyICYgMHhDMCkgPT09IDB4ODAgJiYgKGIzICYgMHhDMCkgPT09IDB4ODAgJiYgKGI0ICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICBjaGFyID0gKChiMSA8PCAxOCkgJiAweDFDMDAwMCkgfCAoKGIyIDw8IDEyKSAmIDB4M0YwMDApIHwgKChiMyA8PCA2KSAmIDB4RkMwKSB8IChiNCAmIDB4M0YpO1xuXG4gICAgICAgICAgaWYgKGNoYXIgPCAweDEwMDAwIHx8IGNoYXIgPiAweDEwRkZGRikge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICdcXHVmZmZkXFx1ZmZmZFxcdWZmZmRcXHVmZmZkJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hhciAtPSAweDEwMDAwO1xuICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhEODAwICsgKGNoYXIgPj4gMTApLCAweERDMDAgKyAoY2hhciAmIDB4M0ZGKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaSArPSA5O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCArPSAnXFx1ZmZmZCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSk7XG59XG5cblxuZGVjb2RlLmRlZmF1bHRDaGFycyAgID0gJzsvPzpAJj0rJCwjJztcbmRlY29kZS5jb21wb25lbnRDaGFycyA9ICcnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlO1xuIiwiXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIGVuY29kZUNhY2hlID0ge307XG5cblxuLy8gQ3JlYXRlIGEgbG9va3VwIGFycmF5IHdoZXJlIGFueXRoaW5nIGJ1dCBjaGFyYWN0ZXJzIGluIGBjaGFyc2Agc3RyaW5nXG4vLyBhbmQgYWxwaGFudW1lcmljIGNoYXJzIGlzIHBlcmNlbnQtZW5jb2RlZC5cbi8vXG5mdW5jdGlvbiBnZXRFbmNvZGVDYWNoZShleGNsdWRlKSB7XG4gIHZhciBpLCBjaCwgY2FjaGUgPSBlbmNvZGVDYWNoZVtleGNsdWRlXTtcbiAgaWYgKGNhY2hlKSB7IHJldHVybiBjYWNoZTsgfVxuXG4gIGNhY2hlID0gZW5jb2RlQ2FjaGVbZXhjbHVkZV0gPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgMTI4OyBpKyspIHtcbiAgICBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG5cbiAgICBpZiAoL15bMC05YS16XSQvaS50ZXN0KGNoKSkge1xuICAgICAgLy8gYWx3YXlzIGFsbG93IHVuZW5jb2RlZCBhbHBoYW51bWVyaWMgY2hhcmFjdGVyc1xuICAgICAgY2FjaGUucHVzaChjaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhY2hlLnB1c2goJyUnICsgKCcwJyArIGkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpLnNsaWNlKC0yKSk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGV4Y2x1ZGUubGVuZ3RoOyBpKyspIHtcbiAgICBjYWNoZVtleGNsdWRlLmNoYXJDb2RlQXQoaSldID0gZXhjbHVkZVtpXTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZTtcbn1cblxuXG4vLyBFbmNvZGUgdW5zYWZlIGNoYXJhY3RlcnMgd2l0aCBwZXJjZW50LWVuY29kaW5nLCBza2lwcGluZyBhbHJlYWR5XG4vLyBlbmNvZGVkIHNlcXVlbmNlcy5cbi8vXG4vLyAgLSBzdHJpbmcgICAgICAgLSBzdHJpbmcgdG8gZW5jb2RlXG4vLyAgLSBleGNsdWRlICAgICAgLSBsaXN0IG9mIGNoYXJhY3RlcnMgdG8gaWdub3JlIChpbiBhZGRpdGlvbiB0byBhLXpBLVowLTkpXG4vLyAgLSBrZWVwRXNjYXBlZCAgLSBkb24ndCBlbmNvZGUgJyUnIGluIGEgY29ycmVjdCBlc2NhcGUgc2VxdWVuY2UgKGRlZmF1bHQ6IHRydWUpXG4vL1xuZnVuY3Rpb24gZW5jb2RlKHN0cmluZywgZXhjbHVkZSwga2VlcEVzY2FwZWQpIHtcbiAgdmFyIGksIGwsIGNvZGUsIG5leHRDb2RlLCBjYWNoZSxcbiAgICAgIHJlc3VsdCA9ICcnO1xuXG4gIGlmICh0eXBlb2YgZXhjbHVkZSAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBlbmNvZGUoc3RyaW5nLCBrZWVwRXNjYXBlZClcbiAgICBrZWVwRXNjYXBlZCAgPSBleGNsdWRlO1xuICAgIGV4Y2x1ZGUgPSBlbmNvZGUuZGVmYXVsdENoYXJzO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBrZWVwRXNjYXBlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBrZWVwRXNjYXBlZCA9IHRydWU7XG4gIH1cblxuICBjYWNoZSA9IGdldEVuY29kZUNhY2hlKGV4Y2x1ZGUpO1xuXG4gIGZvciAoaSA9IDAsIGwgPSBzdHJpbmcubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuXG4gICAgaWYgKGtlZXBFc2NhcGVkICYmIGNvZGUgPT09IDB4MjUgLyogJSAqLyAmJiBpICsgMiA8IGwpIHtcbiAgICAgIGlmICgvXlswLTlhLWZdezJ9JC9pLnRlc3Qoc3RyaW5nLnNsaWNlKGkgKyAxLCBpICsgMykpKSB7XG4gICAgICAgIHJlc3VsdCArPSBzdHJpbmcuc2xpY2UoaSwgaSArIDMpO1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICByZXN1bHQgKz0gY2FjaGVbY29kZV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY29kZSA+PSAweEQ4MDAgJiYgY29kZSA8PSAweERGRkYpIHtcbiAgICAgIGlmIChjb2RlID49IDB4RDgwMCAmJiBjb2RlIDw9IDB4REJGRiAmJiBpICsgMSA8IGwpIHtcbiAgICAgICAgbmV4dENvZGUgPSBzdHJpbmcuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgIGlmIChuZXh0Q29kZSA+PSAweERDMDAgJiYgbmV4dENvZGUgPD0gMHhERkZGKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdbaV0gKyBzdHJpbmdbaSArIDFdKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdCArPSAnJUVGJUJGJUJEJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc3VsdCArPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nW2ldKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmVuY29kZS5kZWZhdWx0Q2hhcnMgICA9IFwiOy8/OkAmPSskLC1fLiF+KicoKSNcIjtcbmVuY29kZS5jb21wb25lbnRDaGFycyA9IFwiLV8uIX4qJygpXCI7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBlbmNvZGU7XG4iLCJcbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvcm1hdCh1cmwpIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gIHJlc3VsdCArPSB1cmwucHJvdG9jb2wgfHwgJyc7XG4gIHJlc3VsdCArPSB1cmwuc2xhc2hlcyA/ICcvLycgOiAnJztcbiAgcmVzdWx0ICs9IHVybC5hdXRoID8gdXJsLmF1dGggKyAnQCcgOiAnJztcblxuICBpZiAodXJsLmhvc3RuYW1lICYmIHVybC5ob3N0bmFtZS5pbmRleE9mKCc6JykgIT09IC0xKSB7XG4gICAgLy8gaXB2NiBhZGRyZXNzXG4gICAgcmVzdWx0ICs9ICdbJyArIHVybC5ob3N0bmFtZSArICddJztcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gdXJsLmhvc3RuYW1lIHx8ICcnO1xuICB9XG5cbiAgcmVzdWx0ICs9IHVybC5wb3J0ID8gJzonICsgdXJsLnBvcnQgOiAnJztcbiAgcmVzdWx0ICs9IHVybC5wYXRobmFtZSB8fCAnJztcbiAgcmVzdWx0ICs9IHVybC5zZWFyY2ggfHwgJyc7XG4gIHJlc3VsdCArPSB1cmwuaGFzaCB8fCAnJztcblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cy5lbmNvZGUgPSByZXF1aXJlKCcuL2VuY29kZScpO1xubW9kdWxlLmV4cG9ydHMuZGVjb2RlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbm1vZHVsZS5leHBvcnRzLmZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5tb2R1bGUuZXhwb3J0cy5wYXJzZSAgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vL1xuLy8gQ2hhbmdlcyBmcm9tIGpveWVudC9ub2RlOlxuLy9cbi8vIDEuIE5vIGxlYWRpbmcgc2xhc2ggaW4gcGF0aHMsXG4vLyAgICBlLmcuIGluIGB1cmwucGFyc2UoJ2h0dHA6Ly9mb28/YmFyJylgIHBhdGhuYW1lIGlzIGBgLCBub3QgYC9gXG4vL1xuLy8gMi4gQmFja3NsYXNoZXMgYXJlIG5vdCByZXBsYWNlZCB3aXRoIHNsYXNoZXMsXG4vLyAgICBzbyBgaHR0cDpcXFxcZXhhbXBsZS5vcmdcXGAgaXMgdHJlYXRlZCBsaWtlIGEgcmVsYXRpdmUgcGF0aFxuLy9cbi8vIDMuIFRyYWlsaW5nIGNvbG9uIGlzIHRyZWF0ZWQgbGlrZSBhIHBhcnQgb2YgdGhlIHBhdGgsXG4vLyAgICBpLmUuIGluIGBodHRwOi8vZXhhbXBsZS5vcmc6Zm9vYCBwYXRobmFtZSBpcyBgOmZvb2Bcbi8vXG4vLyA0LiBOb3RoaW5nIGlzIFVSTC1lbmNvZGVkIGluIHRoZSByZXN1bHRpbmcgb2JqZWN0LFxuLy8gICAgKGluIGpveWVudC9ub2RlIHNvbWUgY2hhcnMgaW4gYXV0aCBhbmQgcGF0aHMgYXJlIGVuY29kZWQpXG4vL1xuLy8gNS4gYHVybC5wYXJzZSgpYCBkb2VzIG5vdCBoYXZlIGBwYXJzZVF1ZXJ5U3RyaW5nYCBhcmd1bWVudFxuLy9cbi8vIDYuIFJlbW92ZWQgZXh0cmFuZW91cyByZXN1bHQgcHJvcGVydGllczogYGhvc3RgLCBgcGF0aGAsIGBxdWVyeWAsIGV0Yy4sXG4vLyAgICB3aGljaCBjYW4gYmUgY29uc3RydWN0ZWQgdXNpbmcgb3RoZXIgcGFydHMgb2YgdGhlIHVybC5cbi8vXG5cblxuZnVuY3Rpb24gVXJsKCkge1xuICB0aGlzLnByb3RvY29sID0gbnVsbDtcbiAgdGhpcy5zbGFzaGVzID0gbnVsbDtcbiAgdGhpcy5hdXRoID0gbnVsbDtcbiAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgdGhpcy5ob3N0bmFtZSA9IG51bGw7XG4gIHRoaXMuaGFzaCA9IG51bGw7XG4gIHRoaXMuc2VhcmNoID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGEgc2ltcGxlIHBhdGggVVJMXG4gICAgc2ltcGxlUGF0aFBhdHRlcm4gPSAvXihcXC9cXC8/KD8hXFwvKVteXFw/XFxzXSopKFxcP1teXFxzXSopPyQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsgJzwnLCAnPicsICdcIicsICdgJywgJyAnLCAnXFxyJywgJ1xcbicsICdcXHQnIF0sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsgJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJyBdLmNvbmNhdChkZWxpbXMpLFxuXG4gICAgLy8gQWxsb3dlZCBieSBSRkNzLCBidXQgY2F1c2Ugb2YgWFNTIGF0dGFja3MuICBBbHdheXMgZXNjYXBlIHRoZXNlLlxuICAgIGF1dG9Fc2NhcGUgPSBbICdcXCcnIF0uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbICclJywgJy8nLCAnPycsICc7JywgJyMnIF0uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsgJy8nLCAnPycsICcjJyBdLFxuICAgIGhvc3RuYW1lTWF4TGVuID0gMjU1LFxuICAgIGhvc3RuYW1lUGFydFBhdHRlcm4gPSAvXlsrYS16MC05QS1aXy1dezAsNjN9JC8sXG4gICAgaG9zdG5hbWVQYXJ0U3RhcnQgPSAvXihbK2EtejAtOUEtWl8tXXswLDYzfSkoLiopJC8sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgY2FuIGFsbG93IFwidW5zYWZlXCIgYW5kIFwidW53aXNlXCIgY2hhcnMuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tc2NyaXB0LXVybCAqL1xuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNjcmlwdC11cmwgKi9cblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHVybCBpbnN0YW5jZW9mIFVybCkgeyByZXR1cm4gdXJsOyB9XG5cbiAgdmFyIHUgPSBuZXcgVXJsKCk7XG4gIHUucGFyc2UodXJsLCBzbGFzaGVzRGVub3RlSG9zdCk7XG4gIHJldHVybiB1O1xufVxuXG5VcmwucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odXJsLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICB2YXIgaSwgbCwgbG93ZXJQcm90bywgaGVjLCBzbGFzaGVzLFxuICAgICAgcmVzdCA9IHVybDtcblxuICAvLyB0cmltIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAvLyBUaGlzIGlzIHRvIHN1cHBvcnQgcGFyc2Ugc3R1ZmYgbGlrZSBcIiAgaHR0cDovL2Zvby5jb20gIFxcblwiXG4gIHJlc3QgPSByZXN0LnRyaW0oKTtcblxuICBpZiAoIXNsYXNoZXNEZW5vdGVIb3N0ICYmIHVybC5zcGxpdCgnIycpLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRyeSBmYXN0IHBhdGggcmVnZXhwXG4gICAgdmFyIHNpbXBsZVBhdGggPSBzaW1wbGVQYXRoUGF0dGVybi5leGVjKHJlc3QpO1xuICAgIGlmIChzaW1wbGVQYXRoKSB7XG4gICAgICB0aGlzLnBhdGhuYW1lID0gc2ltcGxlUGF0aFsxXTtcbiAgICAgIGlmIChzaW1wbGVQYXRoWzJdKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gc2ltcGxlUGF0aFsyXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIGxvd2VyUHJvdG8gPSBwcm90by50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgc2xhc2hlcyA9IHJlc3Quc3Vic3RyKDAsIDIpID09PSAnLy8nO1xuICAgIGlmIChzbGFzaGVzICYmICEocHJvdG8gJiYgaG9zdGxlc3NQcm90b2NvbFtwcm90b10pKSB7XG4gICAgICByZXN0ID0gcmVzdC5zdWJzdHIoMik7XG4gICAgICB0aGlzLnNsYXNoZXMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9zdGxlc3NQcm90b2NvbFtwcm90b10gJiZcbiAgICAgIChzbGFzaGVzIHx8IChwcm90byAmJiAhc2xhc2hlZFByb3RvY29sW3Byb3RvXSkpKSB7XG5cbiAgICAvLyB0aGVyZSdzIGEgaG9zdG5hbWUuXG4gICAgLy8gdGhlIGZpcnN0IGluc3RhbmNlIG9mIC8sID8sIDssIG9yICMgZW5kcyB0aGUgaG9zdC5cbiAgICAvL1xuICAgIC8vIElmIHRoZXJlIGlzIGFuIEAgaW4gdGhlIGhvc3RuYW1lLCB0aGVuIG5vbi1ob3N0IGNoYXJzICphcmUqIGFsbG93ZWRcbiAgICAvLyB0byB0aGUgbGVmdCBvZiB0aGUgbGFzdCBAIHNpZ24sIHVubGVzcyBzb21lIGhvc3QtZW5kaW5nIGNoYXJhY3RlclxuICAgIC8vIGNvbWVzICpiZWZvcmUqIHRoZSBALXNpZ24uXG4gICAgLy8gVVJMcyBhcmUgb2Jub3hpb3VzLlxuICAgIC8vXG4gICAgLy8gZXg6XG4gICAgLy8gaHR0cDovL2FAYkBjLyA9PiB1c2VyOmFAYiBob3N0OmNcbiAgICAvLyBodHRwOi8vYUBiP0BjID0+IHVzZXI6YSBob3N0OmMgcGF0aDovP0BjXG5cbiAgICAvLyB2MC4xMiBUT0RPKGlzYWFjcyk6IFRoaXMgaXMgbm90IHF1aXRlIGhvdyBDaHJvbWUgZG9lcyB0aGluZ3MuXG4gICAgLy8gUmV2aWV3IG91ciB0ZXN0IGNhc2UgYWdhaW5zdCBicm93c2VycyBtb3JlIGNvbXByZWhlbnNpdmVseS5cblxuICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGFueSBob3N0RW5kaW5nQ2hhcnNcbiAgICB2YXIgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAoaSA9IDA7IGkgPCBob3N0RW5kaW5nQ2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKSB7XG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgZWl0aGVyIHdlIGhhdmUgYW4gZXhwbGljaXQgcG9pbnQgd2hlcmUgdGhlXG4gICAgLy8gYXV0aCBwb3J0aW9uIGNhbm5vdCBnbyBwYXN0LCBvciB0aGUgbGFzdCBAIGNoYXIgaXMgdGhlIGRlY2lkZXIuXG4gICAgdmFyIGF1dGgsIGF0U2lnbjtcbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIGF0U2lnbiBjYW4gYmUgYW55d2hlcmUuXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGF0U2lnbiBtdXN0IGJlIGluIGF1dGggcG9ydGlvbi5cbiAgICAgIC8vIGh0dHA6Ly9hQGIvY0BkID0+IGhvc3Q6YiBhdXRoOmEgcGF0aDovY0BkXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJywgaG9zdEVuZCk7XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGhhdmUgYSBwb3J0aW9uIHdoaWNoIGlzIGRlZmluaXRlbHkgdGhlIGF1dGguXG4gICAgLy8gUHVsbCB0aGF0IG9mZi5cbiAgICBpZiAoYXRTaWduICE9PSAtMSkge1xuICAgICAgYXV0aCA9IHJlc3Quc2xpY2UoMCwgYXRTaWduKTtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKGF0U2lnbiArIDEpO1xuICAgICAgdGhpcy5hdXRoID0gYXV0aDtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAoaSA9IDA7IGkgPCBub25Ib3N0Q2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhlYyA9IHJlc3QuaW5kZXhPZihub25Ib3N0Q2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKSB7XG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpIHtcbiAgICAgIGhvc3RFbmQgPSByZXN0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAocmVzdFtob3N0RW5kIC0gMV0gPT09ICc6JykgeyBob3N0RW5kLS07IH1cbiAgICB2YXIgaG9zdCA9IHJlc3Quc2xpY2UoMCwgaG9zdEVuZCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoaG9zdEVuZCk7XG5cbiAgICAvLyBwdWxsIG91dCBwb3J0LlxuICAgIHRoaXMucGFyc2VIb3N0KGhvc3QpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBob3N0cGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gaG9zdHBhcnRzW2ldO1xuICAgICAgICBpZiAoIXBhcnQpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9IG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfVxuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgfVxuICB9XG5cbiAgLy8gY2hvcCBvZmYgZnJvbSB0aGUgdGFpbCBmaXJzdC5cbiAgdmFyIGhhc2ggPSByZXN0LmluZGV4T2YoJyMnKTtcbiAgaWYgKGhhc2ggIT09IC0xKSB7XG4gICAgLy8gZ290IGEgZnJhZ21lbnQgc3RyaW5nLlxuICAgIHRoaXMuaGFzaCA9IHJlc3Quc3Vic3RyKGhhc2gpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIGhhc2gpO1xuICB9XG4gIHZhciBxbSA9IHJlc3QuaW5kZXhPZignPycpO1xuICBpZiAocW0gIT09IC0xKSB7XG4gICAgdGhpcy5zZWFyY2ggPSByZXN0LnN1YnN0cihxbSk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgcW0pO1xuICB9XG4gIGlmIChyZXN0KSB7IHRoaXMucGF0aG5hbWUgPSByZXN0OyB9XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJyc7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cblVybC5wcm90b3R5cGUucGFyc2VIb3N0ID0gZnVuY3Rpb24oaG9zdCkge1xuICB2YXIgcG9ydCA9IHBvcnRQYXR0ZXJuLmV4ZWMoaG9zdCk7XG4gIGlmIChwb3J0KSB7XG4gICAgcG9ydCA9IHBvcnRbMF07XG4gICAgaWYgKHBvcnQgIT09ICc6Jykge1xuICAgICAgdGhpcy5wb3J0ID0gcG9ydC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIGhvc3QgPSBob3N0LnN1YnN0cigwLCBob3N0Lmxlbmd0aCAtIHBvcnQubGVuZ3RoKTtcbiAgfVxuICBpZiAoaG9zdCkgeyB0aGlzLmhvc3RuYW1lID0gaG9zdDsgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1cmxQYXJzZTtcbiIsIm1vZHVsZS5leHBvcnRzPS9bXFwwLVxceDFGXFx4N0YtXFx4OUZdLyIsIm1vZHVsZS5leHBvcnRzPS9bXFx4QURcXHUwNjAwLVxcdTA2MDVcXHUwNjFDXFx1MDZERFxcdTA3MEZcXHUxODBFXFx1MjAwQi1cXHUyMDBGXFx1MjAyQS1cXHUyMDJFXFx1MjA2MC1cXHUyMDY0XFx1MjA2Ni1cXHUyMDZGXFx1RkVGRlxcdUZGRjktXFx1RkZGQl18XFx1RDgwNFxcdURDQkR8XFx1RDgyRltcXHVEQ0EwLVxcdURDQTNdfFxcdUQ4MzRbXFx1REQ3My1cXHVERDdBXXxcXHVEQjQwW1xcdURDMDFcXHVEQzIwLVxcdURDN0ZdLyIsIm1vZHVsZS5leHBvcnRzPS9bIS0jJS1cXCosLS86O1xcP0BcXFstXFxdX1xce1xcfVxceEExXFx4QTdcXHhBQlxceEI2XFx4QjdcXHhCQlxceEJGXFx1MDM3RVxcdTAzODdcXHUwNTVBLVxcdTA1NUZcXHUwNTg5XFx1MDU4QVxcdTA1QkVcXHUwNUMwXFx1MDVDM1xcdTA1QzZcXHUwNUYzXFx1MDVGNFxcdTA2MDlcXHUwNjBBXFx1MDYwQ1xcdTA2MERcXHUwNjFCXFx1MDYxRVxcdTA2MUZcXHUwNjZBLVxcdTA2NkRcXHUwNkQ0XFx1MDcwMC1cXHUwNzBEXFx1MDdGNy1cXHUwN0Y5XFx1MDgzMC1cXHUwODNFXFx1MDg1RVxcdTA5NjRcXHUwOTY1XFx1MDk3MFxcdTBBRjBcXHUwREY0XFx1MEU0RlxcdTBFNUFcXHUwRTVCXFx1MEYwNC1cXHUwRjEyXFx1MEYxNFxcdTBGM0EtXFx1MEYzRFxcdTBGODVcXHUwRkQwLVxcdTBGRDRcXHUwRkQ5XFx1MEZEQVxcdTEwNEEtXFx1MTA0RlxcdTEwRkJcXHUxMzYwLVxcdTEzNjhcXHUxNDAwXFx1MTY2RFxcdTE2NkVcXHUxNjlCXFx1MTY5Q1xcdTE2RUItXFx1MTZFRFxcdTE3MzVcXHUxNzM2XFx1MTdENC1cXHUxN0Q2XFx1MTdEOC1cXHUxN0RBXFx1MTgwMC1cXHUxODBBXFx1MTk0NFxcdTE5NDVcXHUxQTFFXFx1MUExRlxcdTFBQTAtXFx1MUFBNlxcdTFBQTgtXFx1MUFBRFxcdTFCNUEtXFx1MUI2MFxcdTFCRkMtXFx1MUJGRlxcdTFDM0ItXFx1MUMzRlxcdTFDN0VcXHUxQzdGXFx1MUNDMC1cXHUxQ0M3XFx1MUNEM1xcdTIwMTAtXFx1MjAyN1xcdTIwMzAtXFx1MjA0M1xcdTIwNDUtXFx1MjA1MVxcdTIwNTMtXFx1MjA1RVxcdTIwN0RcXHUyMDdFXFx1MjA4RFxcdTIwOEVcXHUyMzA4LVxcdTIzMEJcXHUyMzI5XFx1MjMyQVxcdTI3NjgtXFx1Mjc3NVxcdTI3QzVcXHUyN0M2XFx1MjdFNi1cXHUyN0VGXFx1Mjk4My1cXHUyOTk4XFx1MjlEOC1cXHUyOURCXFx1MjlGQ1xcdTI5RkRcXHUyQ0Y5LVxcdTJDRkNcXHUyQ0ZFXFx1MkNGRlxcdTJENzBcXHUyRTAwLVxcdTJFMkVcXHUyRTMwLVxcdTJFNDJcXHUzMDAxLVxcdTMwMDNcXHUzMDA4LVxcdTMwMTFcXHUzMDE0LVxcdTMwMUZcXHUzMDMwXFx1MzAzRFxcdTMwQTBcXHUzMEZCXFx1QTRGRVxcdUE0RkZcXHVBNjBELVxcdUE2MEZcXHVBNjczXFx1QTY3RVxcdUE2RjItXFx1QTZGN1xcdUE4NzQtXFx1QTg3N1xcdUE4Q0VcXHVBOENGXFx1QThGOC1cXHVBOEZBXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM4XFx1RERDRFxcdURFMzgtXFx1REUzRF18XFx1RDgwNVtcXHVEQ0M2XFx1RERDMS1cXHVEREM5XFx1REU0MS1cXHVERTQzXXxcXHVEODA5W1xcdURDNzAtXFx1REM3NF18XFx1RDgxQVtcXHVERTZFXFx1REU2RlxcdURFRjVcXHVERjM3LVxcdURGM0JcXHVERjQ0XXxcXHVEODJGXFx1REM5Ri8iLCJtb2R1bGUuZXhwb3J0cz0vWyBcXHhBMFxcdTE2ODBcXHUyMDAwLVxcdTIwMEFcXHUyMDI4XFx1MjAyOVxcdTIwMkZcXHUyMDVGXFx1MzAwMF0vIiwiXG5tb2R1bGUuZXhwb3J0cy5BbnkgPSByZXF1aXJlKCcuL3Byb3BlcnRpZXMvQW55L3JlZ2V4Jyk7XG5tb2R1bGUuZXhwb3J0cy5DYyAgPSByZXF1aXJlKCcuL2NhdGVnb3JpZXMvQ2MvcmVnZXgnKTtcbm1vZHVsZS5leHBvcnRzLkNmICA9IHJlcXVpcmUoJy4vY2F0ZWdvcmllcy9DZi9yZWdleCcpO1xubW9kdWxlLmV4cG9ydHMuUCAgID0gcmVxdWlyZSgnLi9jYXRlZ29yaWVzL1AvcmVnZXgnKTtcbm1vZHVsZS5leHBvcnRzLlogICA9IHJlcXVpcmUoJy4vY2F0ZWdvcmllcy9aL3JlZ2V4Jyk7XG4iLCJtb2R1bGUuZXhwb3J0cz0vW1xcMC1cXHVEN0ZGXFx1REMwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdfFtcXHVEODAwLVxcdURCRkZdLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1hcmtkb3duSXQgPSByZXF1aXJlKCdtYXJrZG93bi1pdCcpO1xudmFyIGhsanMgPSByZXF1aXJlKCdoaWdobGlnaHQuanMnKTtcbnZhciB0b2tlbml6ZUxpbmtzID0gcmVxdWlyZSgnLi90b2tlbml6ZUxpbmtzJyk7XG52YXIgbWQgPSBuZXcgTWFya2Rvd25JdCh7XG4gIGh0bWw6IHRydWUsXG4gIHhodG1sT3V0OiB0cnVlLFxuICBsaW5raWZ5OiB0cnVlLFxuICB0eXBvZ3JhcGhlcjogdHJ1ZSxcbiAgbGFuZ1ByZWZpeDogJ21kLWxhbmctYWxpYXMtJyxcbiAgaGlnaGxpZ2h0OiBoaWdobGlnaHRcbn0pO1xudmFyIHJhbGlhcyA9IC8gY2xhc3M9XCJtZC1sYW5nLWFsaWFzLShbXlwiXSspXCIvO1xudmFyIGFsaWFzZXMgPSB7XG4gIGpzOiAnamF2YXNjcmlwdCcsXG4gIG1kOiAnbWFya2Rvd24nLFxuICBodG1sOiAneG1sJywgLy8gbmV4dCBiZXN0IHRoaW5nXG4gIGphZGU6ICdjc3MnIC8vIG5leHQgYmVzdCB0aGluZ1xufTtcbnZhciBiYXNlYmxvY2sgPSBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrO1xudmFyIGJhc2VpbmxpbmUgPSBtZC5yZW5kZXJlci5ydWxlcy5jb2RlX2lubGluZTtcbnZhciBiYXNlZmVuY2UgPSBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZTtcbnZhciBiYXNldGV4dCA9IG1kLnJlbmRlcmVyLnJ1bGVzLnRleHQ7XG52YXIgdGV4dGNhY2hlZCA9IHRleHRwYXJzZXIoW10pO1xudmFyIGxhbmd1YWdlcyA9IFtdO1xudmFyIGNvbnRleHQgPSB7fTtcblxubWQuY29yZS5ydWxlci5iZWZvcmUoJ2xpbmtpZnknLCAnbGlua2lmeS10b2tlbml6ZXInLCBsaW5raWZ5VG9rZW5pemVyLCB7fSk7XG5tZC5yZW5kZXJlci5ydWxlcy5jb2RlX2Jsb2NrID0gYmxvY2s7XG5tZC5yZW5kZXJlci5ydWxlcy5jb2RlX2lubGluZSA9IGlubGluZTtcbm1kLnJlbmRlcmVyLnJ1bGVzLmZlbmNlID0gZmVuY2U7XG5cbmhsanMuY29uZmlndXJlKHsgdGFiUmVwbGFjZTogMiwgY2xhc3NQcmVmaXg6ICdtZC1jb2RlLScgfSk7XG5cbmZ1bmN0aW9uIGhpZ2hsaWdodCAoY29kZSwgbGFuZykge1xuICB2YXIgbG93ZXIgPSBTdHJpbmcobGFuZykudG9Mb3dlckNhc2UoKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaGxqcy5oaWdobGlnaHQoYWxpYXNlc1tsb3dlcl0gfHwgbG93ZXIsIGNvZGUpLnZhbHVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJsb2NrICgpIHtcbiAgdmFyIGJhc2UgPSBiYXNlYmxvY2suYXBwbHkodGhpcywgYXJndW1lbnRzKS5zdWJzdHIoMTEpOyAvLyBzdGFydHMgd2l0aCAnPHByZT48Y29kZT4nXG4gIHZhciBjbGFzc2VkID0gJzxwcmUgY2xhc3M9XCJtZC1jb2RlLWJsb2NrXCI+PGNvZGUgY2xhc3M9XCJtZC1jb2RlXCI+JyArIGJhc2U7XG4gIHJldHVybiBjbGFzc2VkO1xufVxuXG5mdW5jdGlvbiBpbmxpbmUgKCkge1xuICB2YXIgYmFzZSA9IGJhc2VpbmxpbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKS5zdWJzdHIoNik7IC8vIHN0YXJ0cyB3aXRoICc8Y29kZT4nXG4gIHZhciBjbGFzc2VkID0gJzxjb2RlIGNsYXNzPVwibWQtY29kZSBtZC1jb2RlLWlubGluZVwiPicgKyBiYXNlO1xuICByZXR1cm4gY2xhc3NlZDtcbn1cblxuZnVuY3Rpb24gZmVuY2UgKCkge1xuICB2YXIgYmFzZSA9IGJhc2VmZW5jZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLnN1YnN0cig1KTsgLy8gc3RhcnRzIHdpdGggJzxwcmU+J1xuICB2YXIgbGFuZyA9IGJhc2Uuc3Vic3RyKDAsIDYpICE9PSAnPGNvZGU+JzsgLy8gd2hlbiB0aGUgZmVuY2UgaGFzIGEgbGFuZ3VhZ2UgY2xhc3NcbiAgdmFyIHJlc3QgPSBsYW5nID8gYmFzZSA6ICc8Y29kZSBjbGFzcz1cIm1kLWNvZGVcIj4nICsgYmFzZS5zdWJzdHIoNik7XG4gIHZhciBjbGFzc2VkID0gJzxwcmUgY2xhc3M9XCJtZC1jb2RlLWJsb2NrXCI+JyArIHJlc3Q7XG4gIHZhciBhbGlhc2VkID0gY2xhc3NlZC5yZXBsYWNlKHJhbGlhcywgYWxpYXNpbmcpO1xuICByZXR1cm4gYWxpYXNlZDtcbn1cblxuZnVuY3Rpb24gYWxpYXNpbmcgKGFsbCwgbGFuZ3VhZ2UpIHtcbiAgdmFyIG5hbWUgPSBhbGlhc2VzW2xhbmd1YWdlXSB8fCBsYW5ndWFnZSB8fCAndW5rbm93bic7XG4gIHZhciBsYW5nID0gJ21kLWxhbmctJyArIG5hbWU7XG4gIGlmIChsYW5ndWFnZXMuaW5kZXhPZihsYW5nKSA9PT0gLTEpIHtcbiAgICBsYW5ndWFnZXMucHVzaChsYW5nKTtcbiAgfVxuICByZXR1cm4gJyBjbGFzcz1cIm1kLWNvZGUgJyArIGxhbmcgKyAnXCInO1xufVxuXG5mdW5jdGlvbiB0ZXh0cGFyc2VyICh0b2tlbml6ZXJzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwYXJzZVRleHQgKCkge1xuICAgIHZhciBiYXNlID0gYmFzZXRleHQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgZmFuY3kgPSBmYW5jaWZ1bChiYXNlKTtcbiAgICB2YXIgdG9rZW5pemVkID0gdG9rZW5pemUoZmFuY3ksIHRva2VuaXplcnMpO1xuICAgIHJldHVybiB0b2tlbml6ZWQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGZhbmNpZnVsICh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoLy0tL2csICdcXHUyMDE0JykgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW0tZGFzaGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1wiXFxzXSknL2csICckMVxcdTIwMTgnKSAgICAgIC8vIG9wZW5pbmcgc2luZ2xlc1xuICAgIC5yZXBsYWNlKC8nL2csICdcXHUyMDE5JykgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1xcdTIwMThcXHNdKVwiL2csICckMVxcdTIwMWMnKSAvLyBvcGVuaW5nIGRvdWJsZXNcbiAgICAucmVwbGFjZSgvXCIvZywgJ1xcdTIwMWQnKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2luZyBkb3VibGVzXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsbGlwc2VzXG59XG5cbmZ1bmN0aW9uIGxpbmtpZnlUb2tlbml6ZXIgKHN0YXRlKSB7XG4gIHRva2VuaXplTGlua3Moc3RhdGUsIGNvbnRleHQpO1xufVxuXG5mdW5jdGlvbiB0b2tlbml6ZSAodGV4dCwgdG9rZW5pemVycykge1xuICByZXR1cm4gdG9rZW5pemVycy5yZWR1Y2UodXNlLCB0ZXh0KTtcbiAgZnVuY3Rpb24gdXNlIChyZXN1bHQsIHRvaykge1xuICAgIHJldHVybiByZXN1bHQucmVwbGFjZSh0b2sudG9rZW4sIHRvay50cmFuc2Zvcm0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcmtkb3duIChpbnB1dCwgb3B0aW9ucykge1xuICB2YXIgdG9rID0gb3B0aW9ucy50b2tlbml6ZXJzIHx8IFtdO1xuICB2YXIgbGluID0gb3B0aW9ucy5saW5raWZpZXJzIHx8IFtdO1xuICB2YXIgdmFsaWQgPSBpbnB1dCA9PT0gbnVsbCB8fCBpbnB1dCA9PT0gdm9pZCAwID8gJycgOiBTdHJpbmcoaW5wdXQpO1xuICBjb250ZXh0LnRva2VuaXplcnMgPSB0b2s7XG4gIGNvbnRleHQubGlua2lmaWVycyA9IGxpbjtcbiAgbWQucmVuZGVyZXIucnVsZXMudGV4dCA9IHRvay5sZW5ndGggPyB0ZXh0cGFyc2VyKHRvaykgOiB0ZXh0Y2FjaGVkO1xuICB2YXIgaHRtbCA9IG1kLnJlbmRlcih2YWxpZCk7XG4gIHJldHVybiBodG1sO1xufVxuXG5tYXJrZG93bi5wYXJzZXIgPSBtZDtcbm1hcmtkb3duLmxhbmd1YWdlcyA9IGxhbmd1YWdlcztcbm1vZHVsZS5leHBvcnRzID0gbWFya2Rvd247XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbnNhbmUgPSByZXF1aXJlKCdpbnNhbmUnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdhc3NpZ25tZW50Jyk7XG52YXIgbWFya2Rvd24gPSByZXF1aXJlKCcuL21hcmtkb3duJyk7XG52YXIgaGlnaHRva2VucyA9IHJlcXVpcmUoJ2hpZ2hsaWdodC5qcy10b2tlbnMnKS5tYXAoY29kZWNsYXNzKTtcblxuZnVuY3Rpb24gY29kZWNsYXNzICh0b2tlbikge1xuICByZXR1cm4gJ21kLWNvZGUtJyArIHRva2VuO1xufVxuXG5mdW5jdGlvbiBzYW5pdGl6ZSAoaHRtbCwgbykge1xuICB2YXIgb3B0aW9ucyA9IGFzc2lnbih7IGFsbG93ZWRDbGFzc2VzOiB7fSB9LCBvKTtcbiAgdmFyIGFjID0gb3B0aW9ucy5hbGxvd2VkQ2xhc3NlcztcblxuICBhZGQoJ3ByZScsIFsnbWQtY29kZS1ibG9jayddKTtcbiAgYWRkKCdjb2RlJywgbWFya2Rvd24ubGFuZ3VhZ2VzKTtcbiAgYWRkKCdzcGFuJywgaGlnaHRva2Vucyk7XG5cbiAgcmV0dXJuIGluc2FuZShodG1sLCBvcHRpb25zKTtcblxuICBmdW5jdGlvbiBhZGQgKHR5cGUsIG1vcmUpIHtcbiAgICBhY1t0eXBlXSA9IChhY1t0eXBlXSB8fCBbXSkuY29uY2F0KG1vcmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lZ2FtYXJrIChtZCwgb3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBodG1sID0gbWFya2Rvd24obWQsIG8pO1xuICB2YXIgc2FuZSA9IHNhbml0aXplKGh0bWwsIG8uc2FuaXRpemVyKTtcbiAgcmV0dXJuIHNhbmU7XG59XG5cbm1hcmtkb3duLmxhbmd1YWdlcy5wdXNoKCdtZC1jb2RlJywgJ21kLWNvZGUtaW5saW5lJyk7IC8vIG9ubHkgc2FuaXRpemluZyBwdXJwb3Nlc1xubWVnYW1hcmsucGFyc2VyID0gbWFya2Rvd24ucGFyc2VyO1xubW9kdWxlLmV4cG9ydHMgPSBtZWdhbWFyaztcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzaWdubWVudCAocmVzdWx0KSB7XG4gIHZhciBzdGFjayA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBpdGVtO1xuICB2YXIga2V5O1xuICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgaXRlbSA9IHN0YWNrLnNoaWZ0KCk7XG4gICAgZm9yIChrZXkgaW4gaXRlbSkge1xuICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdFtrZXldID09PSAnb2JqZWN0JyAmJiByZXN1bHRba2V5XSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmVzdWx0W2tleV0pICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBhc3NpZ25tZW50KHJlc3VsdFtrZXldLCBpdGVtW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWdubWVudDtcbiIsIi8qISBodHRwczovL210aHMuYmUvcHVueWNvZGUgdjEuMy4yIGJ5IEBtYXRoaWFzICovXG47KGZ1bmN0aW9uKHJvb3QpIHtcblxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGVzICovXG5cdHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiZcblx0XHQhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXHR2YXIgZnJlZU1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmXG5cdFx0IW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG5cdGlmIChcblx0XHRmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsXG5cdCkge1xuXHRcdHJvb3QgPSBmcmVlR2xvYmFsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcHVueWNvZGVgIG9iamVjdC5cblx0ICogQG5hbWUgcHVueWNvZGVcblx0ICogQHR5cGUgT2JqZWN0XG5cdCAqL1xuXHR2YXIgcHVueWNvZGUsXG5cblx0LyoqIEhpZ2hlc3QgcG9zaXRpdmUgc2lnbmVkIDMyLWJpdCBmbG9hdCB2YWx1ZSAqL1xuXHRtYXhJbnQgPSAyMTQ3NDgzNjQ3LCAvLyBha2EuIDB4N0ZGRkZGRkYgb3IgMl4zMS0xXG5cblx0LyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuXHRiYXNlID0gMzYsXG5cdHRNaW4gPSAxLFxuXHR0TWF4ID0gMjYsXG5cdHNrZXcgPSAzOCxcblx0ZGFtcCA9IDcwMCxcblx0aW5pdGlhbEJpYXMgPSA3Mixcblx0aW5pdGlhbE4gPSAxMjgsIC8vIDB4ODBcblx0ZGVsaW1pdGVyID0gJy0nLCAvLyAnXFx4MkQnXG5cblx0LyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cblx0cmVnZXhQdW55Y29kZSA9IC9eeG4tLS8sXG5cdHJlZ2V4Tm9uQVNDSUkgPSAvW15cXHgyMC1cXHg3RV0vLCAvLyB1bnByaW50YWJsZSBBU0NJSSBjaGFycyArIG5vbi1BU0NJSSBjaGFyc1xuXHRyZWdleFNlcGFyYXRvcnMgPSAvW1xceDJFXFx1MzAwMlxcdUZGMEVcXHVGRjYxXS9nLCAvLyBSRkMgMzQ5MCBzZXBhcmF0b3JzXG5cblx0LyoqIEVycm9yIG1lc3NhZ2VzICovXG5cdGVycm9ycyA9IHtcblx0XHQnb3ZlcmZsb3cnOiAnT3ZlcmZsb3c6IGlucHV0IG5lZWRzIHdpZGVyIGludGVnZXJzIHRvIHByb2Nlc3MnLFxuXHRcdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdFx0J2ludmFsaWQtaW5wdXQnOiAnSW52YWxpZCBpbnB1dCdcblx0fSxcblxuXHQvKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5cdGJhc2VNaW51c1RNaW4gPSBiYXNlIC0gdE1pbixcblx0Zmxvb3IgPSBNYXRoLmZsb29yLFxuXHRzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLFxuXG5cdC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgKi9cblx0a2V5O1xuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGVycm9yIHR5cGUuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIGVycm9yKHR5cGUpIHtcblx0XHR0aHJvdyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRyZXN1bHRbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncyBvciBlbWFpbFxuXHQgKiBhZGRyZXNzZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHR2YXIgcGFydHMgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIEluIGVtYWlsIGFkZHJlc3Nlcywgb25seSB0aGUgZG9tYWluIG5hbWUgc2hvdWxkIGJlIHB1bnljb2RlZC4gTGVhdmVcblx0XHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0XHRyZXN1bHQgPSBwYXJ0c1swXSArICdAJztcblx0XHRcdHN0cmluZyA9IHBhcnRzWzFdO1xuXHRcdH1cblx0XHQvLyBBdm9pZCBgc3BsaXQocmVnZXgpYCBmb3IgSUU4IGNvbXBhdGliaWxpdHkuIFNlZSAjMTcuXG5cdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhTZXBhcmF0b3JzLCAnXFx4MkUnKTtcblx0XHR2YXIgbGFiZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGVuY29kZWQgPSBtYXAobGFiZWxzLCBmbikuam9pbignLicpO1xuXHRcdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG5cdCAqIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG5cdCAqIHRvIFVuaWNvZGUuIE9ubHkgdGhlIFB1bnljb2RlZCBwYXJ0cyBvZiB0aGUgaW5wdXQgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS5cblx0ICogaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgb24gYSBzdHJpbmcgdGhhdCBoYXMgYWxyZWFkeSBiZWVuXG5cdCAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZWQgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleFB1bnljb2RlLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIFB1bnljb2RlLiBPbmx5IHRoZSBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLFxuXHQgKiBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW5cblx0ICogQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG8gY29udmVydCwgYXMgYVxuXHQgKiBVbmljb2RlIHN0cmluZy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFB1bnljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBkb21haW4gbmFtZSBvclxuXHQgKiBlbWFpbCBhZGRyZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4Tm9uQVNDSUkudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5cdHB1bnljb2RlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBTdHJpbmdcblx0XHQgKi9cblx0XHQndmVyc2lvbic6ICcxLjMuMicsXG5cdFx0LyoqXG5cdFx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0XHQgKiByZXByZXNlbnRhdGlvbiAoVUNTLTIpIHRvIFVuaWNvZGUgY29kZSBwb2ludHMsIGFuZCBiYWNrLlxuXHRcdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcblx0XHRpZiAobW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMpIHsgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7IC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG5cdFx0XHRmb3IgKGtleSBpbiBwdW55Y29kZSkge1xuXHRcdFx0XHRwdW55Y29kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChmcmVlRXhwb3J0c1trZXldID0gcHVueWNvZGVba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgeyAvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwidmFyIEhpZ2hsaWdodCA9IGZ1bmN0aW9uKCkge1xuXG4gIC8qIFV0aWxpdHkgZnVuY3Rpb25zICovXG5cbiAgZnVuY3Rpb24gZXNjYXBlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyYvZ20sICcmYW1wOycpLnJlcGxhY2UoLzwvZ20sICcmbHQ7JykucmVwbGFjZSgvPi9nbSwgJyZndDsnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRhZyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRlc3RSZShyZSwgbGV4ZW1lKSB7XG4gICAgdmFyIG1hdGNoID0gcmUgJiYgcmUuZXhlYyhsZXhlbWUpO1xuICAgIHJldHVybiBtYXRjaCAmJiBtYXRjaC5pbmRleCA9PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tUZXh0KGJsb2NrKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChibG9jay5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLnVzZUJSID8gbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxuL2csICcnKSA6IG5vZGUubm9kZVZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKHRhZyhub2RlKSA9PSAnYnInKSB7XG4gICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBibG9ja1RleHQobm9kZSk7XG4gICAgfSkuam9pbignJyk7XG4gIH1cblxuICBmdW5jdGlvbiBibG9ja0xhbmd1YWdlKGJsb2NrKSB7XG4gICAgdmFyIGNsYXNzZXMgPSAoYmxvY2suY2xhc3NOYW1lICsgJyAnICsgKGJsb2NrLnBhcmVudE5vZGUgPyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSA6ICcnKSkuc3BsaXQoL1xccysvKTtcbiAgICBjbGFzc2VzID0gY2xhc3Nlcy5tYXAoZnVuY3Rpb24oYykge3JldHVybiBjLnJlcGxhY2UoL15sYW5ndWFnZS0vLCAnJyk7fSk7XG4gICAgcmV0dXJuIGNsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uKGMpIHtyZXR1cm4gZ2V0TGFuZ3VhZ2UoYykgfHwgYyA9PSAnbm8taGlnaGxpZ2h0Jzt9KVswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaGVyaXQocGFyZW50LCBvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHBhcmVudClcbiAgICAgIHJlc3VsdFtrZXldID0gcGFyZW50W2tleV07XG4gICAgaWYgKG9iailcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKiBTdHJlYW0gbWVyZ2luZyAqL1xuXG4gIGZ1bmN0aW9uIG5vZGVTdHJlYW0obm9kZSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAoZnVuY3Rpb24gX25vZGVTdHJlYW0obm9kZSwgb2Zmc2V0KSB7XG4gICAgICBmb3IgKHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDsgY2hpbGQ7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09IDMpXG4gICAgICAgICAgb2Zmc2V0ICs9IGNoaWxkLm5vZGVWYWx1ZS5sZW5ndGg7XG4gICAgICAgIGVsc2UgaWYgKHRhZyhjaGlsZCkgPT0gJ2JyJylcbiAgICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RhcnQnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9mZnNldCA9IF9ub2RlU3RyZWFtKGNoaWxkLCBvZmZzZXQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RvcCcsXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgIG5vZGU6IGNoaWxkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSkobm9kZSwgMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlU3RyZWFtcyhvcmlnaW5hbCwgaGlnaGxpZ2h0ZWQsIHZhbHVlKSB7XG4gICAgdmFyIHByb2Nlc3NlZCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBub2RlU3RhY2sgPSBbXTtcblxuICAgIGZ1bmN0aW9uIHNlbGVjdFN0cmVhbSgpIHtcbiAgICAgIGlmICghb3JpZ2luYWwubGVuZ3RoIHx8ICFoaWdobGlnaHRlZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmxlbmd0aCA/IG9yaWdpbmFsIDogaGlnaGxpZ2h0ZWQ7XG4gICAgICB9XG4gICAgICBpZiAob3JpZ2luYWxbMF0ub2Zmc2V0ICE9IGhpZ2hsaWdodGVkWzBdLm9mZnNldCkge1xuICAgICAgICByZXR1cm4gKG9yaWdpbmFsWzBdLm9mZnNldCA8IGhpZ2hsaWdodGVkWzBdLm9mZnNldCkgPyBvcmlnaW5hbCA6IGhpZ2hsaWdodGVkO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgVG8gYXZvaWQgc3RhcnRpbmcgdGhlIHN0cmVhbSBqdXN0IGJlZm9yZSBpdCBzaG91bGQgc3RvcCB0aGUgb3JkZXIgaXNcbiAgICAgIGVuc3VyZWQgdGhhdCBvcmlnaW5hbCBhbHdheXMgc3RhcnRzIGZpcnN0IGFuZCBjbG9zZXMgbGFzdDpcblxuICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWw7XG4gICAgICBpZiAoZXZlbnQxID09ICdzdGFydCcgJiYgZXZlbnQyID09ICdzdG9wJylcbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodGVkO1xuICAgICAgaWYgKGV2ZW50MSA9PSAnc3RvcCcgJiYgZXZlbnQyID09ICdzdGFydCcpXG4gICAgICAgIHJldHVybiBvcmlnaW5hbDtcbiAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgIHJldHVybiBoaWdobGlnaHRlZDtcblxuICAgICAgLi4uIHdoaWNoIGlzIGNvbGxhcHNlZCB0bzpcbiAgICAgICovXG4gICAgICByZXR1cm4gaGlnaGxpZ2h0ZWRbMF0uZXZlbnQgPT0gJ3N0YXJ0JyA/IG9yaWdpbmFsIDogaGlnaGxpZ2h0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3Blbihub2RlKSB7XG4gICAgICBmdW5jdGlvbiBhdHRyX3N0cihhKSB7cmV0dXJuICcgJyArIGEubm9kZU5hbWUgKyAnPVwiJyArIGVzY2FwZShhLnZhbHVlKSArICdcIic7fVxuICAgICAgcmVzdWx0ICs9ICc8JyArIHRhZyhub2RlKSArIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChub2RlLmF0dHJpYnV0ZXMsIGF0dHJfc3RyKS5qb2luKCcnKSArICc+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZShub2RlKSB7XG4gICAgICByZXN1bHQgKz0gJzwvJyArIHRhZyhub2RlKSArICc+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoZXZlbnQpIHtcbiAgICAgIChldmVudC5ldmVudCA9PSAnc3RhcnQnID8gb3BlbiA6IGNsb3NlKShldmVudC5ub2RlKTtcbiAgICB9XG5cbiAgICB3aGlsZSAob3JpZ2luYWwubGVuZ3RoIHx8IGhpZ2hsaWdodGVkLmxlbmd0aCkge1xuICAgICAgdmFyIHN0cmVhbSA9IHNlbGVjdFN0cmVhbSgpO1xuICAgICAgcmVzdWx0ICs9IGVzY2FwZSh2YWx1ZS5zdWJzdHIocHJvY2Vzc2VkLCBzdHJlYW1bMF0ub2Zmc2V0IC0gcHJvY2Vzc2VkKSk7XG4gICAgICBwcm9jZXNzZWQgPSBzdHJlYW1bMF0ub2Zmc2V0O1xuICAgICAgaWYgKHN0cmVhbSA9PSBvcmlnaW5hbCkge1xuICAgICAgICAvKlxuICAgICAgICBPbiBhbnkgb3BlbmluZyBvciBjbG9zaW5nIHRhZyBvZiB0aGUgb3JpZ2luYWwgbWFya3VwIHdlIGZpcnN0IGNsb3NlXG4gICAgICAgIHRoZSBlbnRpcmUgaGlnaGxpZ2h0ZWQgbm9kZSBzdGFjaywgdGhlbiByZW5kZXIgdGhlIG9yaWdpbmFsIHRhZyBhbG9uZ1xuICAgICAgICB3aXRoIGFsbCB0aGUgZm9sbG93aW5nIG9yaWdpbmFsIHRhZ3MgYXQgdGhlIHNhbWUgb2Zmc2V0IGFuZCB0aGVuXG4gICAgICAgIHJlb3BlbiBhbGwgdGhlIHRhZ3Mgb24gdGhlIGhpZ2hsaWdodGVkIHN0YWNrLlxuICAgICAgICAqL1xuICAgICAgICBub2RlU3RhY2sucmV2ZXJzZSgpLmZvckVhY2goY2xvc2UpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgcmVuZGVyKHN0cmVhbS5zcGxpY2UoMCwgMSlbMF0pO1xuICAgICAgICAgIHN0cmVhbSA9IHNlbGVjdFN0cmVhbSgpO1xuICAgICAgICB9IHdoaWxlIChzdHJlYW0gPT0gb3JpZ2luYWwgJiYgc3RyZWFtLmxlbmd0aCAmJiBzdHJlYW1bMF0ub2Zmc2V0ID09IHByb2Nlc3NlZCk7XG4gICAgICAgIG5vZGVTdGFjay5yZXZlcnNlKCkuZm9yRWFjaChvcGVuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdHJlYW1bMF0uZXZlbnQgPT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIG5vZGVTdGFjay5wdXNoKHN0cmVhbVswXS5ub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlU3RhY2sucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKHN0cmVhbS5zcGxpY2UoMCwgMSlbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0ICsgZXNjYXBlKHZhbHVlLnN1YnN0cihwcm9jZXNzZWQpKTtcbiAgfVxuXG4gIC8qIEluaXRpYWxpemF0aW9uICovXG5cbiAgZnVuY3Rpb24gY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKSB7XG5cbiAgICBmdW5jdGlvbiByZVN0cihyZSkge1xuICAgICAgICByZXR1cm4gKHJlICYmIHJlLnNvdXJjZSkgfHwgcmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICAgIHJldHVybiBSZWdFeHAoXG4gICAgICAgIHJlU3RyKHZhbHVlKSxcbiAgICAgICAgJ20nICsgKGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyAnaScgOiAnJykgKyAoZ2xvYmFsID8gJ2cnIDogJycpXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBpbGVNb2RlKG1vZGUsIHBhcmVudCkge1xuICAgICAgaWYgKG1vZGUuY29tcGlsZWQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG1vZGUuY29tcGlsZWQgPSB0cnVlO1xuXG4gICAgICBtb2RlLmtleXdvcmRzID0gbW9kZS5rZXl3b3JkcyB8fCBtb2RlLmJlZ2luS2V5d29yZHM7XG4gICAgICBpZiAobW9kZS5rZXl3b3Jkcykge1xuICAgICAgICB2YXIgY29tcGlsZWRfa2V5d29yZHMgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBmbGF0dGVuKGNsYXNzTmFtZSwgc3RyKSB7XG4gICAgICAgICAgaWYgKGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHIuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGt3KSB7XG4gICAgICAgICAgICB2YXIgcGFpciA9IGt3LnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICBjb21waWxlZF9rZXl3b3Jkc1twYWlyWzBdXSA9IFtjbGFzc05hbWUsIHBhaXJbMV0gPyBOdW1iZXIocGFpclsxXSkgOiAxXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgbW9kZS5rZXl3b3JkcyA9PSAnc3RyaW5nJykgeyAvLyBzdHJpbmdcbiAgICAgICAgICBmbGF0dGVuKCdrZXl3b3JkJywgbW9kZS5rZXl3b3Jkcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMobW9kZS5rZXl3b3JkcykuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBmbGF0dGVuKGNsYXNzTmFtZSwgbW9kZS5rZXl3b3Jkc1tjbGFzc05hbWVdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBtb2RlLmtleXdvcmRzID0gY29tcGlsZWRfa2V5d29yZHM7XG4gICAgICB9XG4gICAgICBtb2RlLmxleGVtZXNSZSA9IGxhbmdSZShtb2RlLmxleGVtZXMgfHwgL1xcYltBLVphLXowLTlfXStcXGIvLCB0cnVlKTtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBpZiAobW9kZS5iZWdpbktleXdvcmRzKSB7XG4gICAgICAgICAgbW9kZS5iZWdpbiA9IG1vZGUuYmVnaW5LZXl3b3Jkcy5zcGxpdCgnICcpLmpvaW4oJ3wnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vZGUuYmVnaW4pXG4gICAgICAgICAgbW9kZS5iZWdpbiA9IC9cXEJ8XFxiLztcbiAgICAgICAgbW9kZS5iZWdpblJlID0gbGFuZ1JlKG1vZGUuYmVnaW4pO1xuICAgICAgICBpZiAoIW1vZGUuZW5kICYmICFtb2RlLmVuZHNXaXRoUGFyZW50KVxuICAgICAgICAgIG1vZGUuZW5kID0gL1xcQnxcXGIvO1xuICAgICAgICBpZiAobW9kZS5lbmQpXG4gICAgICAgICAgbW9kZS5lbmRSZSA9IGxhbmdSZShtb2RlLmVuZCk7XG4gICAgICAgIG1vZGUudGVybWluYXRvcl9lbmQgPSByZVN0cihtb2RlLmVuZCkgfHwgJyc7XG4gICAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50ICYmIHBhcmVudC50ZXJtaW5hdG9yX2VuZClcbiAgICAgICAgICBtb2RlLnRlcm1pbmF0b3JfZW5kICs9IChtb2RlLmVuZCA/ICd8JyA6ICcnKSArIHBhcmVudC50ZXJtaW5hdG9yX2VuZDtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmlsbGVnYWwpXG4gICAgICAgIG1vZGUuaWxsZWdhbFJlID0gbGFuZ1JlKG1vZGUuaWxsZWdhbCk7XG4gICAgICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgbW9kZS5yZWxldmFuY2UgPSAxO1xuICAgICAgaWYgKCFtb2RlLmNvbnRhaW5zKSB7XG4gICAgICAgIG1vZGUuY29udGFpbnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHZhciBleHBhbmRlZF9jb250YWlucyA9IFtdO1xuICAgICAgbW9kZS5jb250YWlucy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgaWYgKGMudmFyaWFudHMpIHtcbiAgICAgICAgICBjLnZhcmlhbnRzLmZvckVhY2goZnVuY3Rpb24odikge2V4cGFuZGVkX2NvbnRhaW5zLnB1c2goaW5oZXJpdChjLCB2KSk7fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwYW5kZWRfY29udGFpbnMucHVzaChjID09ICdzZWxmJyA/IG1vZGUgOiBjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlLmNvbnRhaW5zID0gZXhwYW5kZWRfY29udGFpbnM7XG4gICAgICBtb2RlLmNvbnRhaW5zLmZvckVhY2goZnVuY3Rpb24oYykge2NvbXBpbGVNb2RlKGMsIG1vZGUpO30pO1xuXG4gICAgICBpZiAobW9kZS5zdGFydHMpIHtcbiAgICAgICAgY29tcGlsZU1vZGUobW9kZS5zdGFydHMsIHBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXJtaW5hdG9ycyA9XG4gICAgICAgIG1vZGUuY29udGFpbnMubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICByZXR1cm4gYy5iZWdpbktleXdvcmRzID8gJ1xcXFwuP1xcXFxiKCcgKyBjLmJlZ2luICsgJylcXFxcYlxcXFwuPycgOiBjLmJlZ2luO1xuICAgICAgICB9KVxuICAgICAgICAuY29uY2F0KFttb2RlLnRlcm1pbmF0b3JfZW5kXSlcbiAgICAgICAgLmNvbmNhdChbbW9kZS5pbGxlZ2FsXSlcbiAgICAgICAgLm1hcChyZVN0cilcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIG1vZGUudGVybWluYXRvcnMgPSB0ZXJtaW5hdG9ycy5sZW5ndGggPyBsYW5nUmUodGVybWluYXRvcnMuam9pbignfCcpLCB0cnVlKSA6IHtleGVjOiBmdW5jdGlvbihzKSB7cmV0dXJuIG51bGw7fX07XG5cbiAgICAgIG1vZGUuY29udGludWF0aW9uID0ge307XG4gICAgfVxuXG4gICAgY29tcGlsZU1vZGUobGFuZ3VhZ2UpO1xuICB9XG5cbiAgLypcbiAgQ29yZSBoaWdobGlnaHRpbmcgZnVuY3Rpb24uIEFjY2VwdHMgYSBsYW5ndWFnZSBuYW1lLCBvciBhbiBhbGlhcywgYW5kIGFcbiAgc3RyaW5nIHdpdGggdGhlIGNvZGUgdG8gaGlnaGxpZ2h0LiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAgcHJvcGVydGllczpcblxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0KG5hbWUsIHZhbHVlLCBpZ25vcmVfaWxsZWdhbHMsIGNvbnRpbnVhdGlvbikge1xuXG4gICAgZnVuY3Rpb24gc3ViTW9kZShsZXhlbWUsIG1vZGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZS5jb250YWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGVzdFJlKG1vZGUuY29udGFpbnNbaV0uYmVnaW5SZSwgbGV4ZW1lKSkge1xuICAgICAgICAgIHJldHVybiBtb2RlLmNvbnRhaW5zW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2ZNb2RlKG1vZGUsIGxleGVtZSkge1xuICAgICAgaWYgKHRlc3RSZShtb2RlLmVuZFJlLCBsZXhlbWUpKSB7XG4gICAgICAgIHJldHVybiBtb2RlO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVuZE9mTW9kZShtb2RlLnBhcmVudCwgbGV4ZW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0lsbGVnYWwobGV4ZW1lLCBtb2RlKSB7XG4gICAgICByZXR1cm4gIWlnbm9yZV9pbGxlZ2FscyAmJiB0ZXN0UmUobW9kZS5pbGxlZ2FsUmUsIGxleGVtZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5d29yZE1hdGNoKG1vZGUsIG1hdGNoKSB7XG4gICAgICB2YXIgbWF0Y2hfc3RyID0gbGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCkgOiBtYXRjaFswXTtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzLmhhc093blByb3BlcnR5KG1hdGNoX3N0cikgJiYgbW9kZS5rZXl3b3Jkc1ttYXRjaF9zdHJdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1aWxkU3BhbihjbGFzc25hbWUsIGluc2lkZVNwYW4sIGxlYXZlT3Blbiwgbm9QcmVmaXgpIHtcbiAgICAgIHZhciBjbGFzc1ByZWZpeCA9IG5vUHJlZml4ID8gJycgOiBvcHRpb25zLmNsYXNzUHJlZml4LFxuICAgICAgICAgIG9wZW5TcGFuICAgID0gJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzUHJlZml4LFxuICAgICAgICAgIGNsb3NlU3BhbiAgID0gbGVhdmVPcGVuID8gJycgOiAnPC9zcGFuPic7XG5cbiAgICAgIG9wZW5TcGFuICs9IGNsYXNzbmFtZSArICdcIj4nO1xuXG4gICAgICByZXR1cm4gb3BlblNwYW4gKyBpbnNpZGVTcGFuICsgY2xvc2VTcGFuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NLZXl3b3JkcygpIHtcbiAgICAgIHZhciBidWZmZXIgPSBlc2NhcGUobW9kZV9idWZmZXIpO1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICB2YXIgbGFzdF9pbmRleCA9IDA7XG4gICAgICB0b3AubGV4ZW1lc1JlLmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgbWF0Y2ggPSB0b3AubGV4ZW1lc1JlLmV4ZWMoYnVmZmVyKTtcbiAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICByZXN1bHQgKz0gYnVmZmVyLnN1YnN0cihsYXN0X2luZGV4LCBtYXRjaC5pbmRleCAtIGxhc3RfaW5kZXgpO1xuICAgICAgICB2YXIga2V5d29yZF9tYXRjaCA9IGtleXdvcmRNYXRjaCh0b3AsIG1hdGNoKTtcbiAgICAgICAgaWYgKGtleXdvcmRfbWF0Y2gpIHtcbiAgICAgICAgICByZWxldmFuY2UgKz0ga2V5d29yZF9tYXRjaFsxXTtcbiAgICAgICAgICByZXN1bHQgKz0gYnVpbGRTcGFuKGtleXdvcmRfbWF0Y2hbMF0sIG1hdGNoWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgKz0gbWF0Y2hbMF07XG4gICAgICAgIH1cbiAgICAgICAgbGFzdF9pbmRleCA9IHRvcC5sZXhlbWVzUmUubGFzdEluZGV4O1xuICAgICAgICBtYXRjaCA9IHRvcC5sZXhlbWVzUmUuZXhlYyhidWZmZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCArIGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkge1xuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZSAmJiAhbGFuZ3VhZ2VzW3RvcC5zdWJMYW5ndWFnZV0pIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZShtb2RlX2J1ZmZlcik7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gdG9wLnN1Ykxhbmd1YWdlID8gaGlnaGxpZ2h0KHRvcC5zdWJMYW5ndWFnZSwgbW9kZV9idWZmZXIsIHRydWUsIHRvcC5jb250aW51YXRpb24udG9wKSA6IGhpZ2hsaWdodEF1dG8obW9kZV9idWZmZXIpO1xuICAgICAgLy8gQ291bnRpbmcgZW1iZWRkZWQgbGFuZ3VhZ2Ugc2NvcmUgdG93YXJkcyB0aGUgaG9zdCBsYW5ndWFnZSBtYXkgYmUgZGlzYWJsZWRcbiAgICAgIC8vIHdpdGggemVyb2luZyB0aGUgY29udGFpbmluZyBtb2RlIHJlbGV2YW5jZS4gVXNlY2FzZSBpbiBwb2ludCBpcyBNYXJrZG93biB0aGF0XG4gICAgICAvLyBhbGxvd3MgWE1MIGV2ZXJ5d2hlcmUgYW5kIG1ha2VzIGV2ZXJ5IFhNTCBzbmlwcGV0IHRvIGhhdmUgYSBtdWNoIGxhcmdlciBNYXJrZG93blxuICAgICAgLy8gc2NvcmUuXG4gICAgICBpZiAodG9wLnJlbGV2YW5jZSA+IDApIHtcbiAgICAgICAgcmVsZXZhbmNlICs9IHJlc3VsdC5yZWxldmFuY2U7XG4gICAgICB9XG4gICAgICBpZiAodG9wLnN1Ykxhbmd1YWdlTW9kZSA9PSAnY29udGludW91cycpIHtcbiAgICAgICAgdG9wLmNvbnRpbnVhdGlvbi50b3AgPSByZXN1bHQudG9wO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ1aWxkU3BhbihyZXN1bHQubGFuZ3VhZ2UsIHJlc3VsdC52YWx1ZSwgZmFsc2UsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NCdWZmZXIoKSB7XG4gICAgICByZXR1cm4gdG9wLnN1Ykxhbmd1YWdlICE9PSB1bmRlZmluZWQgPyBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSA6IHByb2Nlc3NLZXl3b3JkcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0TmV3TW9kZShtb2RlLCBsZXhlbWUpIHtcbiAgICAgIHZhciBtYXJrdXAgPSBtb2RlLmNsYXNzTmFtZT8gYnVpbGRTcGFuKG1vZGUuY2xhc3NOYW1lLCAnJywgdHJ1ZSk6ICcnO1xuICAgICAgaWYgKG1vZGUucmV0dXJuQmVnaW4pIHtcbiAgICAgICAgcmVzdWx0ICs9IG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSBpZiAobW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgcmVzdWx0ICs9IGVzY2FwZShsZXhlbWUpICsgbWFya3VwO1xuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9IG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSBsZXhlbWU7XG4gICAgICB9XG4gICAgICB0b3AgPSBPYmplY3QuY3JlYXRlKG1vZGUsIHtwYXJlbnQ6IHt2YWx1ZTogdG9wfX0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NMZXhlbWUoYnVmZmVyLCBsZXhlbWUpIHtcblxuICAgICAgbW9kZV9idWZmZXIgKz0gYnVmZmVyO1xuICAgICAgaWYgKGxleGVtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3X21vZGUgPSBzdWJNb2RlKGxleGVtZSwgdG9wKTtcbiAgICAgIGlmIChuZXdfbW9kZSkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBzdGFydE5ld01vZGUobmV3X21vZGUsIGxleGVtZSk7XG4gICAgICAgIHJldHVybiBuZXdfbW9kZS5yZXR1cm5CZWdpbiA/IDAgOiBsZXhlbWUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5kX21vZGUgPSBlbmRPZk1vZGUodG9wLCBsZXhlbWUpO1xuICAgICAgaWYgKGVuZF9tb2RlKSB7XG4gICAgICAgIHZhciBvcmlnaW4gPSB0b3A7XG4gICAgICAgIGlmICghKG9yaWdpbi5yZXR1cm5FbmQgfHwgb3JpZ2luLmV4Y2x1ZGVFbmQpKSB7XG4gICAgICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodG9wLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICc8L3NwYW4+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVsZXZhbmNlICs9IHRvcC5yZWxldmFuY2U7XG4gICAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgICAgfSB3aGlsZSAodG9wICE9IGVuZF9tb2RlLnBhcmVudCk7XG4gICAgICAgIGlmIChvcmlnaW4uZXhjbHVkZUVuZCkge1xuICAgICAgICAgIHJlc3VsdCArPSBlc2NhcGUobGV4ZW1lKTtcbiAgICAgICAgfVxuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgICBpZiAoZW5kX21vZGUuc3RhcnRzKSB7XG4gICAgICAgICAgc3RhcnROZXdNb2RlKGVuZF9tb2RlLnN0YXJ0cywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW4ucmV0dXJuRW5kID8gMCA6IGxleGVtZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0lsbGVnYWwobGV4ZW1lLCB0b3ApKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgbGV4ZW1lIFwiJyArIGxleGVtZSArICdcIiBmb3IgbW9kZSBcIicgKyAodG9wLmNsYXNzTmFtZSB8fCAnPHVubmFtZWQ+JykgKyAnXCInKTtcblxuICAgICAgLypcbiAgICAgIFBhcnNlciBzaG91bGQgbm90IHJlYWNoIHRoaXMgcG9pbnQgYXMgYWxsIHR5cGVzIG9mIGxleGVtZXMgc2hvdWxkIGJlIGNhdWdodFxuICAgICAgZWFybGllciwgYnV0IGlmIGl0IGRvZXMgZHVlIHRvIHNvbWUgYnVnIG1ha2Ugc3VyZSBpdCBhZHZhbmNlcyBhdCBsZWFzdCBvbmVcbiAgICAgIGNoYXJhY3RlciBmb3J3YXJkIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcGluZy5cbiAgICAgICovXG4gICAgICBtb2RlX2J1ZmZlciArPSBsZXhlbWU7XG4gICAgICByZXR1cm4gbGV4ZW1lLmxlbmd0aCB8fCAxO1xuICAgIH1cblxuICAgIHZhciBsYW5ndWFnZSA9IGdldExhbmd1YWdlKG5hbWUpO1xuICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZTogXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cblxuICAgIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgdmFyIHRvcCA9IGNvbnRpbnVhdGlvbiB8fCBsYW5ndWFnZTtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgZm9yKHZhciBjdXJyZW50ID0gdG9wOyBjdXJyZW50ICE9IGxhbmd1YWdlOyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHtcbiAgICAgIGlmIChjdXJyZW50LmNsYXNzTmFtZSkge1xuICAgICAgICByZXN1bHQgPSBidWlsZFNwYW4oY3VycmVudC5jbGFzc05hbWUsIHJlc3VsdCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBtb2RlX2J1ZmZlciA9ICcnO1xuICAgIHZhciByZWxldmFuY2UgPSAwO1xuICAgIHRyeSB7XG4gICAgICB2YXIgbWF0Y2gsIGNvdW50LCBpbmRleCA9IDA7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0b3AudGVybWluYXRvcnMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgIG1hdGNoID0gdG9wLnRlcm1pbmF0b3JzLmV4ZWModmFsdWUpO1xuICAgICAgICBpZiAoIW1hdGNoKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjb3VudCA9IHByb2Nlc3NMZXhlbWUodmFsdWUuc3Vic3RyKGluZGV4LCBtYXRjaC5pbmRleCAtIGluZGV4KSwgbWF0Y2hbMF0pO1xuICAgICAgICBpbmRleCA9IG1hdGNoLmluZGV4ICsgY291bnQ7XG4gICAgICB9XG4gICAgICBwcm9jZXNzTGV4ZW1lKHZhbHVlLnN1YnN0cihpbmRleCkpO1xuICAgICAgZm9yKHZhciBjdXJyZW50ID0gdG9wOyBjdXJyZW50LnBhcmVudDsgY3VycmVudCA9IGN1cnJlbnQucGFyZW50KSB7IC8vIGNsb3NlIGRhbmdsaW5nIG1vZGVzXG4gICAgICAgIGlmIChjdXJyZW50LmNsYXNzTmFtZSkge1xuICAgICAgICAgIHJlc3VsdCArPSAnPC9zcGFuPic7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWxldmFuY2U6IHJlbGV2YW5jZSxcbiAgICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgICAgbGFuZ3VhZ2U6IG5hbWUsXG4gICAgICAgIHRvcDogdG9wXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm1lc3NhZ2UuaW5kZXhPZignSWxsZWdhbCcpICE9IC0xKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIHZhbHVlOiBlc2NhcGUodmFsdWUpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIEhpZ2hsaWdodGluZyB3aXRoIGxhbmd1YWdlIGRldGVjdGlvbi4gQWNjZXB0cyBhIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvXG4gIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cbiAgLSBsYW5ndWFnZSAoZGV0ZWN0ZWQgbGFuZ3VhZ2UpXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcbiAgLSBzZWNvbmRfYmVzdCAob2JqZWN0IHdpdGggdGhlIHNhbWUgc3RydWN0dXJlIGZvciBzZWNvbmQtYmVzdCBoZXVyaXN0aWNhbGx5XG4gICAgZGV0ZWN0ZWQgbGFuZ3VhZ2UsIG1heSBiZSBhYnNlbnQpXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QXV0byh0ZXh0LCBsYW5ndWFnZVN1YnNldCkge1xuICAgIGxhbmd1YWdlU3Vic2V0ID0gbGFuZ3VhZ2VTdWJzZXQgfHwgb3B0aW9ucy5sYW5ndWFnZXMgfHwgT2JqZWN0LmtleXMobGFuZ3VhZ2VzKTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgdmFsdWU6IGVzY2FwZSh0ZXh0KVxuICAgIH07XG4gICAgdmFyIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgIGxhbmd1YWdlU3Vic2V0LmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgaWYgKCFnZXRMYW5ndWFnZShuYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudCA9IGhpZ2hsaWdodChuYW1lLCB0ZXh0LCBmYWxzZSk7XG4gICAgICBjdXJyZW50Lmxhbmd1YWdlID0gbmFtZTtcbiAgICAgIGlmIChjdXJyZW50LnJlbGV2YW5jZSA+IHNlY29uZF9iZXN0LnJlbGV2YW5jZSkge1xuICAgICAgICBzZWNvbmRfYmVzdCA9IGN1cnJlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudC5yZWxldmFuY2UgPiByZXN1bHQucmVsZXZhbmNlKSB7XG4gICAgICAgIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgICAgICByZXN1bHQgPSBjdXJyZW50O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzZWNvbmRfYmVzdC5sYW5ndWFnZSkge1xuICAgICAgcmVzdWx0LnNlY29uZF9iZXN0ID0gc2Vjb25kX2Jlc3Q7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKlxuICBQb3N0LXByb2Nlc3Npbmcgb2YgdGhlIGhpZ2hsaWdodGVkIG1hcmt1cDpcblxuICAtIHJlcGxhY2UgVEFCcyB3aXRoIHNvbWV0aGluZyBtb3JlIHVzZWZ1bFxuICAtIHJlcGxhY2UgcmVhbCBsaW5lLWJyZWFrcyB3aXRoICc8YnI+JyBmb3Igbm9uLXByZSBjb250YWluZXJzXG5cbiAgKi9cbiAgZnVuY3Rpb24gZml4TWFya3VwKHZhbHVlKSB7XG4gICAgaWYgKG9wdGlvbnMudGFiUmVwbGFjZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKCg8W14+XSs+fFxcdCkrKS9nbSwgZnVuY3Rpb24obWF0Y2gsIHAxLCBvZmZzZXQsIHMpIHtcbiAgICAgICAgcmV0dXJuIHAxLnJlcGxhY2UoL1xcdC9nLCBvcHRpb25zLnRhYlJlcGxhY2UpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnVzZUJSKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKlxuICBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhIERPTSBub2RlIGNvbnRhaW5pbmcgY29kZS4gQWNjZXB0cyBhIERPTSBub2RlIGFuZFxuICB0d28gb3B0aW9uYWwgcGFyYW1ldGVycyBmb3IgZml4TWFya3VwLlxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRCbG9jayhibG9jaykge1xuICAgIHZhciB0ZXh0ID0gYmxvY2tUZXh0KGJsb2NrKTtcbiAgICB2YXIgbGFuZ3VhZ2UgPSBibG9ja0xhbmd1YWdlKGJsb2NrKTtcbiAgICBpZiAobGFuZ3VhZ2UgPT0gJ25vLWhpZ2hsaWdodCcpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgcmVzdWx0ID0gbGFuZ3VhZ2UgPyBoaWdobGlnaHQobGFuZ3VhZ2UsIHRleHQsIHRydWUpIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcbiAgICB2YXIgb3JpZ2luYWwgPSBub2RlU3RyZWFtKGJsb2NrKTtcbiAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICB2YXIgcHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ3ByZScpO1xuICAgICAgcHJlLmlubmVySFRNTCA9IHJlc3VsdC52YWx1ZTtcbiAgICAgIHJlc3VsdC52YWx1ZSA9IG1lcmdlU3RyZWFtcyhvcmlnaW5hbCwgbm9kZVN0cmVhbShwcmUpLCB0ZXh0KTtcbiAgICB9XG4gICAgcmVzdWx0LnZhbHVlID0gZml4TWFya3VwKHJlc3VsdC52YWx1ZSk7XG5cbiAgICBibG9jay5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgYmxvY2suY2xhc3NOYW1lICs9ICcgaGxqcyAnICsgKCFsYW5ndWFnZSAmJiByZXN1bHQubGFuZ3VhZ2UgfHwgJycpO1xuICAgIGJsb2NrLnJlc3VsdCA9IHtcbiAgICAgIGxhbmd1YWdlOiByZXN1bHQubGFuZ3VhZ2UsXG4gICAgICByZTogcmVzdWx0LnJlbGV2YW5jZVxuICAgIH07XG4gICAgaWYgKHJlc3VsdC5zZWNvbmRfYmVzdCkge1xuICAgICAgYmxvY2suc2Vjb25kX2Jlc3QgPSB7XG4gICAgICAgIGxhbmd1YWdlOiByZXN1bHQuc2Vjb25kX2Jlc3QubGFuZ3VhZ2UsXG4gICAgICAgIHJlOiByZXN1bHQuc2Vjb25kX2Jlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBvcHRpb25zID0ge1xuICAgIGNsYXNzUHJlZml4OiAnaGxqcy0nLFxuICAgIHRhYlJlcGxhY2U6IG51bGwsXG4gICAgdXNlQlI6IGZhbHNlLFxuICAgIGxhbmd1YWdlczogdW5kZWZpbmVkXG4gIH07XG5cbiAgLypcbiAgVXBkYXRlcyBoaWdobGlnaHQuanMgZ2xvYmFsIG9wdGlvbnMgd2l0aCB2YWx1ZXMgcGFzc2VkIGluIHRoZSBmb3JtIG9mIGFuIG9iamVjdFxuICAqL1xuICBmdW5jdGlvbiBjb25maWd1cmUodXNlcl9vcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGluaGVyaXQob3B0aW9ucywgdXNlcl9vcHRpb25zKTtcbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGFsbCA8cHJlPjxjb2RlPi4uPC9jb2RlPjwvcHJlPiBibG9ja3Mgb24gYSBwYWdlLlxuICAqL1xuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nKCkge1xuICAgIGlmIChpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZClcbiAgICAgIHJldHVybjtcbiAgICBpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZCA9IHRydWU7XG5cbiAgICB2YXIgYmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUnKTtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGJsb2NrcywgaGlnaGxpZ2h0QmxvY2spO1xuICB9XG5cbiAgLypcbiAgQXR0YWNoZXMgaGlnaGxpZ2h0aW5nIHRvIHRoZSBwYWdlIGxvYWQgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmdPbkxvYWQoKSB7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgICBhZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdEhpZ2hsaWdodGluZywgZmFsc2UpO1xuICB9XG5cbiAgdmFyIGxhbmd1YWdlcyA9IHt9O1xuICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTGFuZ3VhZ2UobmFtZSwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgbGFuZyA9IGxhbmd1YWdlc1tuYW1lXSA9IGxhbmd1YWdlKHRoaXMpO1xuICAgIGlmIChsYW5nLmFsaWFzZXMpIHtcbiAgICAgIGxhbmcuYWxpYXNlcy5mb3JFYWNoKGZ1bmN0aW9uKGFsaWFzKSB7YWxpYXNlc1thbGlhc10gPSBuYW1lO30pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExhbmd1YWdlKG5hbWUpIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2VzW25hbWVdIHx8IGxhbmd1YWdlc1thbGlhc2VzW25hbWVdXTtcbiAgfVxuXG4gIC8qIEludGVyZmFjZSBkZWZpbml0aW9uICovXG5cbiAgdGhpcy5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gIHRoaXMuaGlnaGxpZ2h0QXV0byA9IGhpZ2hsaWdodEF1dG87XG4gIHRoaXMuZml4TWFya3VwID0gZml4TWFya3VwO1xuICB0aGlzLmhpZ2hsaWdodEJsb2NrID0gaGlnaGxpZ2h0QmxvY2s7XG4gIHRoaXMuY29uZmlndXJlID0gY29uZmlndXJlO1xuICB0aGlzLmluaXRIaWdobGlnaHRpbmcgPSBpbml0SGlnaGxpZ2h0aW5nO1xuICB0aGlzLmluaXRIaWdobGlnaHRpbmdPbkxvYWQgPSBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkO1xuICB0aGlzLnJlZ2lzdGVyTGFuZ3VhZ2UgPSByZWdpc3Rlckxhbmd1YWdlO1xuICB0aGlzLmdldExhbmd1YWdlID0gZ2V0TGFuZ3VhZ2U7XG4gIHRoaXMuaW5oZXJpdCA9IGluaGVyaXQ7XG5cbiAgLy8gQ29tbW9uIHJlZ2V4cHNcbiAgdGhpcy5JREVOVF9SRSA9ICdbYS16QS1aXVthLXpBLVowLTlfXSonO1xuICB0aGlzLlVOREVSU0NPUkVfSURFTlRfUkUgPSAnW2EtekEtWl9dW2EtekEtWjAtOV9dKic7XG4gIHRoaXMuTlVNQkVSX1JFID0gJ1xcXFxiXFxcXGQrKFxcXFwuXFxcXGQrKT8nO1xuICB0aGlzLkNfTlVNQkVSX1JFID0gJyhcXFxcYjBbeFhdW2EtZkEtRjAtOV0rfChcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKik/fFxcXFwuXFxcXGQrKShbZUVdWy0rXT9cXFxcZCspPyknOyAvLyAweC4uLiwgMC4uLiwgZGVjaW1hbCwgZmxvYXRcbiAgdGhpcy5CSU5BUllfTlVNQkVSX1JFID0gJ1xcXFxiKDBiWzAxXSspJzsgLy8gMGIuLi5cbiAgdGhpcy5SRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfC18LT18Lz18L3w6fDt8PDx8PDw9fDw9fDx8PT09fD09fD18Pj4+PXw+Pj18Pj18Pj4+fD4+fD58XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4gIC8vIENvbW1vbiBtb2Rlc1xuICB0aGlzLkJBQ0tTTEFTSF9FU0NBUEUgPSB7XG4gICAgYmVnaW46ICdcXFxcXFxcXFtcXFxcc1xcXFxTXScsIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkFQT1NfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgfTtcbiAgdGhpcy5RVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgfTtcbiAgdGhpcy5DX0xJTkVfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnLy8nLCBlbmQ6ICckJ1xuICB9O1xuICB0aGlzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnL1xcXFwqJywgZW5kOiAnXFxcXCovJ1xuICB9O1xuICB0aGlzLkhBU0hfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gIH07XG4gIHRoaXMuTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQ19OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLkNfTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkJJTkFSWV9OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLkJJTkFSWV9OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuUkVHRVhQX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICBiZWdpbjogL1xcLy8sIGVuZDogL1xcL1tnaW1dKi8sXG4gICAgaWxsZWdhbDogL1xcbi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHRoaXMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXFsvLCBlbmQ6IC9cXF0vLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbdGhpcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgdGhpcy5USVRMRV9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICBiZWdpbjogdGhpcy5JREVOVF9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5VTkRFUlNDT1JFX1RJVExFX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIGJlZ2luOiB0aGlzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG59O1xubW9kdWxlLmV4cG9ydHMgPSBIaWdobGlnaHQ7IiwidmFyIEhpZ2hsaWdodCA9IHJlcXVpcmUoJy4vaGlnaGxpZ2h0Jyk7XG52YXIgaGxqcyA9IG5ldyBIaWdobGlnaHQoKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnYmFzaCcsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL2Jhc2guanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2phdmFzY3JpcHQnLCByZXF1aXJlKCcuL2xhbmd1YWdlcy9qYXZhc2NyaXB0LmpzJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCd4bWwnLCByZXF1aXJlKCcuL2xhbmd1YWdlcy94bWwuanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ21hcmtkb3duJywgcmVxdWlyZSgnLi9sYW5ndWFnZXMvbWFya2Rvd24uanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2NzcycsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL2Nzcy5qcycpKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnaHR0cCcsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL2h0dHAuanMnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2luaScsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL2luaS5qcycpKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnanNvbicsIHJlcXVpcmUoJy4vbGFuZ3VhZ2VzL2pzb24uanMnKSk7XG5tb2R1bGUuZXhwb3J0cyA9IGhsanM7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBWQVIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIHZhcmlhbnRzOiBbXG4gICAgICB7YmVnaW46IC9cXCRbXFx3XFxkI0BdW1xcd1xcZF9dKi99LFxuICAgICAge2JlZ2luOiAvXFwkXFx7KC4qPylcXH0vfVxuICAgIF1cbiAgfTtcbiAgdmFyIFFVT1RFX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAvXCIvLCBlbmQ6IC9cIi8sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIFZBUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogL1xcJFxcKC8sIGVuZDogL1xcKS8sXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgdmFyIEFQT1NfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46IC8nLywgZW5kOiAvJy9cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGxleGVtZXM6IC8tP1thLXpcXC5dKy8sXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdpZiB0aGVuIGVsc2UgZWxpZiBmaSBmb3IgYnJlYWsgY29udGludWUgd2hpbGUgaW4gZG8gZG9uZSBleGl0IHJldHVybiBzZXQgJytcbiAgICAgICAgJ2RlY2xhcmUgY2FzZSBlc2FjIGV4cG9ydCBleGVjJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAncHJpbnRmIGVjaG8gcmVhZCBjZCBwd2QgcHVzaGQgcG9wZCBkaXJzIGxldCBldmFsIHVuc2V0IHR5cGVzZXQgcmVhZG9ubHkgJytcbiAgICAgICAgJ2dldG9wdHMgc291cmNlIHNob3B0IGNhbGxlciB0eXBlIGhhc2ggYmluZCBoZWxwIHN1ZG8nLFxuICAgICAgb3BlcmF0b3I6XG4gICAgICAgICctbmUgLWVxIC1sdCAtZ3QgLWYgLWQgLWUgLXMgLWwgLWEnIC8vIHJlbGV2YW5jZSBib29zdGVyXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGViYW5nJyxcbiAgICAgICAgYmVnaW46IC9eIyFbXlxcbl0rc2hcXHMqJC8sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46IC9cXHdbXFx3XFxkX10qXFxzKlxcKFxccypcXClcXHMqXFx7LyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwge2JlZ2luOiAvXFx3W1xcd1xcZF9dKi99KV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgUVVPVEVfU1RSSU5HLFxuICAgICAgQVBPU19TVFJJTkcsXG4gICAgICBWQVJcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgSURFTlRfUkUgPSAnW2EtekEtWi1dW2EtekEtWjAtOV8tXSonO1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luOiBJREVOVF9SRSArICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogWydzZWxmJywgaGxqcy5OVU1CRVJfTU9ERSwgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgaWxsZWdhbDogJ1s9L3xcXCddJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaWQnLCBiZWdpbjogJ1xcXFwjW0EtWmEtejAtOV8tXSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsIGJlZ2luOiAnXFxcXC5bQS1aYS16MC05Xy1dKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cl9zZWxlY3RvcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICAgIGlsbGVnYWw6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHNldWRvJyxcbiAgICAgICAgYmVnaW46ICc6KDopP1thLXpBLVowLTlcXFxcX1xcXFwtXFxcXCtcXFxcKFxcXFwpXFxcXFwiXFxcXFxcJ10rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXRfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnQChmb250LWZhY2V8cGFnZSknLFxuICAgICAgICBsZXhlbWVzOiAnW2Etei1dKycsXG4gICAgICAgIGtleXdvcmRzOiAnZm9udC1mYWNlIHBhZ2UnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdAJywgZW5kOiAnW3s7XScsIC8vIGF0X3J1bGUgZWF0aW5nIGZpcnN0IFwie1wiIGlzIGEgZ29vZCB0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBpdCBkb2VzbuKAmXQgbGV0IGl0IHRvIGJlIHBhcnNlZCBhc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBydWxlIHNldCBidXQgaW5zdGVhZCBkcm9wcyBwYXJzZXIgaW50b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgbW9kZSB3aGljaCBpcyBob3cgaXQgc2hvdWxkIGJlLlxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICAgICAgYmVnaW46IC9cXFMrL1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46IC9cXHMvLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIEZVTkNUSU9OLFxuICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsIGJlZ2luOiBJREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdydWxlcycsXG4gICAgICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdydWxlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnW15cXFxcc10nLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnOycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgICAgICAgICAgYmVnaW46ICdbQS1aXFxcXF9cXFxcLlxcXFwtXSsnLCBlbmQ6ICc6JyxcbiAgICAgICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgICAgICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIEZVTkNUSU9OLFxuICAgICAgICAgICAgICAgICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdoZXhjb2xvcicsIGJlZ2luOiAnI1swLTlBLUZhLWZdKydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ltcG9ydGFudCcsIGJlZ2luOiAnIWltcG9ydGFudCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgaWxsZWdhbDogJ1xcXFxTJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdGF0dXMnLFxuICAgICAgICBiZWdpbjogJ15IVFRQL1swLTlcXFxcLl0rJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbe2NsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnXFxcXGJcXFxcZHszfVxcXFxiJ31dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZXF1ZXN0JyxcbiAgICAgICAgYmVnaW46ICdeW0EtWl0rICguKj8pIEhUVFAvWzAtOVxcXFwuXSskJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJyAnLCBlbmQ6ICcgJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXHcnLCBlbmQ6ICc6ICcsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbnxcXFxcc3w9JyxcbiAgICAgICAgc3RhcnRzOiB7Y2xhc3NOYW1lOiAnc3RyaW5nJywgZW5kOiAnJCd9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxuXFxcXG4nLFxuICAgICAgICBzdGFydHM6IHtzdWJMYW5ndWFnZTogJycsIGVuZHNXaXRoUGFyZW50OiB0cnVlfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAvXFxTLyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc7JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NldHRpbmcnLFxuICAgICAgICBiZWdpbjogJ15bYS16MC05XFxcXFtcXFxcXV8tXStbIFxcXFx0XSo9WyBcXFxcdF0qJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ29uIG9mZiB0cnVlIGZhbHNlIHllcyBubycsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuUVVPVEVfU1RSSU5HX01PREUsIGhsanMuTlVNQkVSX01PREVdLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBhbGlhc2VzOiBbJ2pzJ10sXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdpbiBpZiBmb3Igd2hpbGUgZmluYWxseSB2YXIgbmV3IGZ1bmN0aW9uIGRvIHJldHVybiB2b2lkIGVsc2UgYnJlYWsgY2F0Y2ggJyArXG4gICAgICAgICdpbnN0YW5jZW9mIHdpdGggdGhyb3cgY2FzZSBkZWZhdWx0IHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB0eXBlb2YgZGVsZXRlICcgK1xuICAgICAgICAnbGV0IHlpZWxkIGNvbnN0IGNsYXNzJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlIG51bGwgdW5kZWZpbmVkIE5hTiBJbmZpbml0eScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ2V2YWwgaXNGaW5pdGUgaXNOYU4gcGFyc2VGbG9hdCBwYXJzZUludCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50ICcgK1xuICAgICAgICAnZW5jb2RlVVJJIGVuY29kZVVSSUNvbXBvbmVudCBlc2NhcGUgdW5lc2NhcGUgT2JqZWN0IEZ1bmN0aW9uIEJvb2xlYW4gRXJyb3IgJyArXG4gICAgICAgICdFdmFsRXJyb3IgSW50ZXJuYWxFcnJvciBSYW5nZUVycm9yIFJlZmVyZW5jZUVycm9yIFN0b3BJdGVyYXRpb24gU3ludGF4RXJyb3IgJyArXG4gICAgICAgICdUeXBlRXJyb3IgVVJJRXJyb3IgTnVtYmVyIE1hdGggRGF0ZSBTdHJpbmcgUmVnRXhwIEFycmF5IEZsb2F0MzJBcnJheSAnICtcbiAgICAgICAgJ0Zsb2F0NjRBcnJheSBJbnQxNkFycmF5IEludDMyQXJyYXkgSW50OEFycmF5IFVpbnQxNkFycmF5IFVpbnQzMkFycmF5ICcgK1xuICAgICAgICAnVWludDhBcnJheSBVaW50OENsYW1wZWRBcnJheSBBcnJheUJ1ZmZlciBEYXRhVmlldyBKU09OIEludGwgYXJndW1lbnRzIHJlcXVpcmUnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwaScsXG4gICAgICAgIGJlZ2luOiAvXlxccyooJ3xcIil1c2Ugc3RyaWN0KCd8XCIpLyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgeyAvLyBcInZhbHVlXCIgY29udGFpbmVyXG4gICAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihjYXNlfHJldHVybnx0aHJvdylcXFxcYilcXFxccyonLFxuICAgICAgICBrZXl3b3JkczogJ3JldHVybiB0aHJvdyBjYXNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLlJFR0VYUF9NT0RFLFxuICAgICAgICAgIHsgLy8gRTRYXG4gICAgICAgICAgICBiZWdpbjogLzwvLCBlbmQ6IC8+Oy8sXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBzdWJMYW5ndWFnZTogJ3htbCdcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLCBlbmQ6IC9cXHsvLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHtiZWdpbjogL1tBLVphLXokX11bMC05QS1aYS16JF9dKi99KSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46IC9cXCgvLCBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaWxsZWdhbDogL1tcIidcXChdL1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogL1xcW3wlL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCRbKC5dLyAvLyByZWxldmFuY2UgYm9vc3RlciBmb3IgYSBwYXR0ZXJuIGNvbW1vbiB0byBKUyBsaWJzOiBgJChzb21ldGhpbmcpYCBhbmQgYCQuc29tZXRoaW5nYFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcLicgKyBobGpzLklERU5UX1JFLCByZWxldmFuY2U6IDAgLy8gaGFjazogcHJldmVudHMgZGV0ZWN0aW9uIG9mIGtleXdvcmRzIGFmdGVyIGRvdHNcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgTElURVJBTFMgPSB7bGl0ZXJhbDogJ3RydWUgZmFsc2UgbnVsbCd9O1xuICB2YXIgVFlQRVMgPSBbXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgXTtcbiAgdmFyIFZBTFVFX0NPTlRBSU5FUiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgZW5kOiAnLCcsIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBUWVBFUyxcbiAgICBrZXl3b3JkczogTElURVJBTFNcbiAgfTtcbiAgdmFyIE9CSkVDVCA9IHtcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxzKlwiJywgZW5kOiAnXCJcXFxccyo6XFxcXHMqJywgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgIHN0YXJ0czogVkFMVUVfQ09OVEFJTkVSXG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIHZhciBBUlJBWSA9IHtcbiAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5pbmhlcml0KFZBTFVFX0NPTlRBSU5FUiwge2NsYXNzTmFtZTogbnVsbH0pXSwgLy8gaW5oZXJpdCBpcyBhbHNvIGEgd29ya2Fyb3VuZCBmb3IgYSBidWcgdGhhdCBtYWtlcyBzaGFyZWQgbW9kZXMgd2l0aCBlbmRzV2l0aFBhcmVudCBjb21waWxlIG9ubHkgdGhlIGVuZGluZyBvZiBvbmUgb2YgdGhlIHBhcmVudHNcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIFRZUEVTLnNwbGljZShUWVBFUy5sZW5ndGgsIDAsIE9CSkVDVCwgQVJSQVkpO1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBUWVBFUyxcbiAgICBrZXl3b3JkczogTElURVJBTFMsXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgLy8gaGlnaGxpZ2h0IGhlYWRlcnNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnXiN7MSw2fScsIGVuZDogJyQnIH0sXG4gICAgICAgICAgeyBiZWdpbjogJ14uKz9cXFxcbls9LV17Mix9JCcgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8gaW5saW5lIGh0bWxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc8JywgZW5kOiAnPicsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gbGlzdHMgKGluZGljYXRvcnMgb25seSlcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVsbGV0JyxcbiAgICAgICAgYmVnaW46ICdeKFsqKy1dfChcXFxcZCtcXFxcLikpXFxcXHMrJ1xuICAgICAgfSxcbiAgICAgIC8vIHN0cm9uZyBzZWdtZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJvbmcnLFxuICAgICAgICBiZWdpbjogJ1sqX117Mn0uKz9bKl9dezJ9J1xuICAgICAgfSxcbiAgICAgIC8vIGVtcGhhc2lzIHNlZ21lbnRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VtcGhhc2lzJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnXFxcXCouKz9cXFxcKicgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXy4rP18nXG4gICAgICAgICAgLCByZWxldmFuY2U6IDBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyBibG9ja3F1b3Rlc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdibG9ja3F1b3RlJyxcbiAgICAgICAgYmVnaW46ICdePlxcXFxzKycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgLy8gY29kZSBzbmlwcGV0c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICB7IGJlZ2luOiAnYC4rP2AnIH0sXG4gICAgICAgICAgeyBiZWdpbjogJ14oIHs0fXxcXHQpJywgZW5kOiAnJCdcbiAgICAgICAgICAsIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIGhvcml6b250YWwgcnVsZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdeWy1cXFxcKl17Myx9JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICAvLyB1c2luZyBsaW5rcyAtIHRpdGxlIGFuZCBsaW5rXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXFsuKz9cXFxcXVtcXFxcKFxcXFxbXS4rP1tcXFxcKVxcXFxdXScsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfbGFiZWwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua191cmwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcXVxcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5rX3JlZmVyZW5jZScsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxdXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ15cXFxcW1xcLitcXFxcXTonLCBlbmQ6ICckJyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua19yZWZlcmVuY2UnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua191cmwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxccycsIGVuZDogJyQnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFhNTF9JREVOVF9SRSA9ICdbQS1aYS16MC05XFxcXC5fOi1dKyc7XG4gIHZhciBQSFAgPSB7XG4gICAgYmVnaW46IC88XFw/KHBocCk/KD8hXFx3KS8sIGVuZDogL1xcPz4vLFxuICAgIHN1Ykxhbmd1YWdlOiAncGhwJywgc3ViTGFuZ3VhZ2VNb2RlOiAnY29udGludW91cydcbiAgfTtcbiAgdmFyIFRBR19JTlRFUk5BTFMgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgaWxsZWdhbDogLzwvLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAgUEhQLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogWE1MX0lERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPScsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgICAgICB7YmVnaW46IC9cIi8sIGVuZDogL1wiL30sXG4gICAgICAgICAgICAgIHtiZWdpbjogLycvLCBlbmQ6IC8nL30sXG4gICAgICAgICAgICAgIHtiZWdpbjogL1teXFxzXFwvPl0rL31cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHJldHVybiB7XG4gICAgYWxpYXNlczogWydodG1sJ10sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdkb2N0eXBlJyxcbiAgICAgICAgYmVnaW46ICc8IURPQ1RZUEUnLCBlbmQ6ICc+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFt7YmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJ31dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc8IS0tJywgZW5kOiAnLS0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2RhdGEnLFxuICAgICAgICBiZWdpbjogJzxcXFxcIVxcXFxbQ0RBVEFcXFxcWycsIGVuZDogJ1xcXFxdXFxcXF0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgLypcbiAgICAgICAgVGhlIGxvb2thaGVhZCBwYXR0ZXJuICg/PS4uLikgZW5zdXJlcyB0aGF0ICdiZWdpbicgb25seSBtYXRjaGVzXG4gICAgICAgICc8c3R5bGUnIGFzIGEgc2luZ2xlIHdvcmQsIGZvbGxvd2VkIGJ5IGEgd2hpdGVzcGFjZSBvciBhblxuICAgICAgICBlbmRpbmcgYnJha2V0LiBUaGUgJyQnIGlzIG5lZWRlZCBmb3IgdGhlIGxleGVtZSB0byBiZSByZWNvZ25pemVkXG4gICAgICAgIGJ5IGhsanMuc3ViTW9kZSgpIHRoYXQgdGVzdHMgbGV4ZW1lcyBvdXRzaWRlIHRoZSBzdHJlYW0uXG4gICAgICAgICovXG4gICAgICAgIGJlZ2luOiAnPHN0eWxlKD89XFxcXHN8PnwkKScsIGVuZDogJz4nLFxuICAgICAgICBrZXl3b3Jkczoge3RpdGxlOiAnc3R5bGUnfSxcbiAgICAgICAgY29udGFpbnM6IFtUQUdfSU5URVJOQUxTXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnPC9zdHlsZT4nLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdjc3MnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8vIFNlZSB0aGUgY29tbWVudCBpbiB0aGUgPHN0eWxlIHRhZyBhYm91dCB0aGUgbG9va2FoZWFkIHBhdHRlcm5cbiAgICAgICAgYmVnaW46ICc8c2NyaXB0KD89XFxcXHN8PnwkKScsIGVuZDogJz4nLFxuICAgICAgICBrZXl3b3Jkczoge3RpdGxlOiAnc2NyaXB0J30sXG4gICAgICAgIGNvbnRhaW5zOiBbVEFHX0lOVEVSTkFMU10sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzwvc2NyaXB0PicsIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2phdmFzY3JpcHQnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPCUnLCBlbmQ6ICclPicsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAndmJzY3JpcHQnXG4gICAgICB9LFxuICAgICAgUEhQLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwaScsXG4gICAgICAgIGJlZ2luOiAvPFxcP1xcdysvLCBlbmQ6IC9cXD8+LyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgYmVnaW46ICc8Lz8nLCBlbmQ6ICcvPz4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdbXiAvPjxdKycsIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVEFHX0lOVEVSTkFMU1xuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCIvLyBodHRwOi8vaGlnaGxpZ2h0anMucmVhZHRoZWRvY3Mub3JnL2VuL2xhdGVzdC9jc3MtY2xhc3Nlcy1yZWZlcmVuY2UuaHRtbFxuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2FkZGl0aW9uJyxcbiAgJ2Fubm90YWlvbicsXG4gICdhbm5vdGF0aW9uJyxcbiAgJ2FyZ3VtZW50JyxcbiAgJ2FycmF5JyxcbiAgJ2F0X3J1bGUnLFxuICAnYXR0cl9zZWxlY3RvcicsXG4gICdhdHRyaWJ1dGUnLFxuICAnYmVnaW4tYmxvY2snLFxuICAnYmxvY2txdW90ZScsXG4gICdib2R5JyxcbiAgJ2J1aWx0X2luJyxcbiAgJ2J1bGxldCcsXG4gICdjYnJhY2tldCcsXG4gICdjZGF0YScsXG4gICdjZWxsJyxcbiAgJ2NoYW5nZScsXG4gICdjaGFyJyxcbiAgJ2NodW5rJyxcbiAgJ2NsYXNzJyxcbiAgJ2NvZGUnLFxuICAnY29sbGVjdGlvbicsXG4gICdjb21tYW5kJyxcbiAgJ2NvbW1hbmRzJyxcbiAgJ2NvbW1lbicsXG4gICdjb21tZW50JyxcbiAgJ2NvbnN0YW50JyxcbiAgJ2NvbnRhaW5lcicsXG4gICdkYXJ0ZG9jJyxcbiAgJ2RhdGUnLFxuICAnZGVjb3JhdG9yJyxcbiAgJ2RlZmF1bHQnLFxuICAnZGVsZXRpb24nLFxuICAnZG9jdHlwZScsXG4gICdlbXBoYXNpcycsXG4gICdlbmQtYmxvY2snLFxuICAnZW52dmFyJyxcbiAgJ2V4cHJlc3Npb24nLFxuICAnZmlsZW5hbWUnLFxuICAnZmlsdGVyJyxcbiAgJ2Zsb3cnLFxuICAnZm9yZWlnbicsXG4gICdmb3JtdWxhJyxcbiAgJ2Z1bmMnLFxuICAnZnVuY3Rpb24nLFxuICAnZnVuY3Rpb25fbmFtZScsXG4gICdnZW5lcmljcycsXG4gICdoZWFkZXInLFxuICAnaGV4Y29sb3InLFxuICAnaG9yaXpvbnRhbF9ydWxlJyxcbiAgJ2lkJyxcbiAgJ2ltcG9ydCcsXG4gICdpbXBvcnRhbnQnLFxuICAnaW5maXgnLFxuICAnaW5oZXJpdGFuY2UnLFxuICAnaW5wdXQnLFxuICAnamF2YWRvYycsXG4gICdqYXZhZG9jdGFnJyxcbiAgJ2tleXdvcmQnLFxuICAna2V5d29yZHMnLFxuICAnbGFiZWwnLFxuICAnbGlua19sYWJlbCcsXG4gICdsaW5rX3JlZmVyZW5jZScsXG4gICdsaW5rX3VybCcsXG4gICdsaXN0JyxcbiAgJ2xpdGVyYWwnLFxuICAnbG9jYWx2YXJzJyxcbiAgJ2xvbmdfYnJhY2tldHMnLFxuICAnbWF0cml4JyxcbiAgJ21vZHVsZScsXG4gICdudW1iZXInLFxuICAnb3BlcmF0b3InLFxuICAnb3V0cHV0JyxcbiAgJ3BhY2thZ2UnLFxuICAncGFyYW0nLFxuICAncGFyYW1ldGVyJyxcbiAgJ3BhcmFtcycsXG4gICdwYXJlbnQnLFxuICAncGhwZG9jJyxcbiAgJ3BpJyxcbiAgJ3BvZCcsXG4gICdwcCcsXG4gICdwcmFnbWEnLFxuICAncHJlcHJvY2Vzc29yJyxcbiAgJ3Byb21wdCcsXG4gICdwcm9wZXJ0eScsXG4gICdwc2V1ZG8nLFxuICAncXVvdGVkJyxcbiAgJ3JlY29yZF9uYW1lJyxcbiAgJ3JlZ2V4JyxcbiAgJ3JlZ2V4cCcsXG4gICdyZXF1ZXN0JyxcbiAgJ3Jlc2VydmVkJyxcbiAgJ3Jlc3RfYXJnJyxcbiAgJ3J1bGVzJyxcbiAgJ3NoYWRlcicsXG4gICdzaGFkaW5nJyxcbiAgJ3NoZWJhbmcnLFxuICAnc3BlY2lhbCcsXG4gICdzcWJyYWNrZXQnLFxuICAnc3RhdHVzJyxcbiAgJ3N0bF9jb250YWluZXInLFxuICAnc3RyZWFtJyxcbiAgJ3N0cmluZycsXG4gICdzdHJvbmcnLFxuICAnc3ViJyxcbiAgJ3N1YnN0JyxcbiAgJ3N1bW1hcnknLFxuICAnc3ltYm9sJyxcbiAgJ3RhZycsXG4gICd0ZW1wbGF0ZV9jb21tZW50JyxcbiAgJ3RlbXBsYXRlX3RhZycsXG4gICd0aXRsZScsXG4gICd0eXBlJyxcbiAgJ3R5cGVkZWYnLFxuICAndHlwZW5hbWUnLFxuICAndmFsdWUnLFxuICAndmFyX2V4cGFuZCcsXG4gICd2YXJpYWJsZScsXG4gICd3aW51dGlscycsXG4gICd4bWxEb2NUYWcnLFxuICAneWFyZG9jdGFnJ1xuXVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9NYXAgPSByZXF1aXJlKCcuL3RvTWFwJyk7XG52YXIgdXJpcyA9IFsnYmFja2dyb3VuZCcsICdiYXNlJywgJ2NpdGUnLCAnaHJlZicsICdsb25nZGVzYycsICdzcmMnLCAndXNlbWFwJ107XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1cmlzOiB0b01hcCh1cmlzKSAvLyBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBhbiBocmVmIGFuZCBoZW5jZSBuZWVkIHRvIGJlIHNhbml0aXplZFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRlZmF1bHRzID0ge1xuICBhbGxvd2VkQXR0cmlidXRlczoge1xuICAgIGE6IFsnaHJlZicsICduYW1lJywgJ3RhcmdldCcsICd0aXRsZScsICdhcmlhLWxhYmVsJ10sXG4gICAgaWZyYW1lOiBbJ2FsbG93ZnVsbHNjcmVlbicsICdmcmFtZWJvcmRlcicsICdzcmMnXSxcbiAgICBpbWc6IFsnc3JjJywgJ2FsdCcsICd0aXRsZScsICdhcmlhLWxhYmVsJ11cbiAgfSxcbiAgYWxsb3dlZENsYXNzZXM6IHt9LFxuICBhbGxvd2VkU2NoZW1lczogWydodHRwJywgJ2h0dHBzJywgJ21haWx0byddLFxuICBhbGxvd2VkVGFnczogW1xuICAgICdhJywgJ2FydGljbGUnLCAnYicsICdibG9ja3F1b3RlJywgJ2JyJywgJ2NhcHRpb24nLCAnY29kZScsICdkZWwnLCAnZGV0YWlscycsICdkaXYnLCAnZW0nLFxuICAgICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdocicsICdpJywgJ2ltZycsICdpbnMnLCAna2JkJywgJ2xpJywgJ21haW4nLFxuICAgICdvbCcsICdwJywgJ3ByZScsICdzZWN0aW9uJywgJ3NwYW4nLCAnc3RyaWtlJywgJ3N0cm9uZycsICdzdWInLCAnc3VtbWFyeScsICdzdXAnLCAndGFibGUnLFxuICAgICd0Ym9keScsICd0ZCcsICd0aCcsICd0aGVhZCcsICd0cicsICd1bCdcbiAgXSxcbiAgZmlsdGVyOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9NYXAgPSByZXF1aXJlKCcuL3RvTWFwJyk7XG52YXIgdm9pZHMgPSBbJ2FyZWEnLCAnYnInLCAnY29sJywgJ2hyJywgJ2ltZycsICd3YnInLCAnaW5wdXQnLCAnYmFzZScsICdiYXNlZm9udCcsICdsaW5rJywgJ21ldGEnXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZvaWRzOiB0b01hcCh2b2lkcylcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoZSA9IHJlcXVpcmUoJ2hlJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnYXNzaWdubWVudCcpO1xudmFyIHBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2VyJyk7XG52YXIgc2FuaXRpemVyID0gcmVxdWlyZSgnLi9zYW5pdGl6ZXInKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuZnVuY3Rpb24gaW5zYW5lIChodG1sLCBvcHRpb25zLCBzdHJpY3QpIHtcbiAgdmFyIGJ1ZmZlciA9IFtdO1xuICB2YXIgY29uZmlndXJhdGlvbiA9IHN0cmljdCA9PT0gdHJ1ZSA/IG9wdGlvbnMgOiBhc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgdmFyIGhhbmRsZXIgPSBzYW5pdGl6ZXIoYnVmZmVyLCBjb25maWd1cmF0aW9uKTtcblxuICBwYXJzZXIoaHRtbCwgaGFuZGxlcik7XG5cbiAgcmV0dXJuIGJ1ZmZlci5qb2luKCcnKTtcbn1cblxuaW5zYW5lLmRlZmF1bHRzID0gZGVmYXVsdHM7XG5tb2R1bGUuZXhwb3J0cyA9IGluc2FuZTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsb3dlcmNhc2UgKHN0cmluZykge1xuICByZXR1cm4gdHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycgPyBzdHJpbmcudG9Mb3dlckNhc2UoKSA6IHN0cmluZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoZSA9IHJlcXVpcmUoJ2hlJyk7XG52YXIgbG93ZXJjYXNlID0gcmVxdWlyZSgnLi9sb3dlcmNhc2UnKTtcbnZhciBhdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGVzJyk7XG52YXIgZWxlbWVudHMgPSByZXF1aXJlKCcuL2VsZW1lbnRzJyk7XG52YXIgcnN0YXJ0ID0gL148XFxzKihbXFx3Oi1dKykoKD86XFxzK1tcXHc6LV0rKD86XFxzKj1cXHMqKD86KD86XCJbXlwiXSpcIil8KD86J1teJ10qJyl8W14+XFxzXSspKT8pKilcXHMqKFxcLz8pXFxzKj4vO1xudmFyIHJlbmQgPSAvXjxcXHMqXFwvXFxzKihbXFx3Oi1dKylbXj5dKj4vO1xudmFyIHJhdHRycyA9IC8oW1xcdzotXSspKD86XFxzKj1cXHMqKD86KD86XCIoKD86W15cIl0pKilcIil8KD86JygoPzpbXiddKSopJyl8KFtePlxcc10rKSkpPy9nO1xudmFyIHJ0YWcgPSAvXjwvO1xudmFyIHJ0YWdlbmQgPSAvXjxcXHMqXFwvLztcblxuZnVuY3Rpb24gY3JlYXRlU3RhY2sgKCkge1xuICB2YXIgc3RhY2sgPSBbXTtcbiAgc3RhY2subGFzdEl0ZW0gPSBmdW5jdGlvbiBsYXN0SXRlbSAoKSB7XG4gICAgcmV0dXJuIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICB9O1xuICByZXR1cm4gc3RhY2s7XG59XG5cbmZ1bmN0aW9uIHBhcnNlciAoaHRtbCwgaGFuZGxlcikge1xuICB2YXIgc3RhY2sgPSBjcmVhdGVTdGFjaygpO1xuICB2YXIgbGFzdCA9IGh0bWw7XG4gIHZhciBjaGFycztcblxuICB3aGlsZSAoaHRtbCkge1xuICAgIHBhcnNlUGFydCgpO1xuICB9XG4gIHBhcnNlRW5kVGFnKCk7IC8vIGNsZWFuIHVwIGFueSByZW1haW5pbmcgdGFnc1xuXG4gIGZ1bmN0aW9uIHBhcnNlUGFydCAoKSB7XG4gICAgY2hhcnMgPSB0cnVlO1xuICAgIHBhcnNlVGFnKCk7XG5cbiAgICB2YXIgc2FtZSA9IGh0bWwgPT09IGxhc3Q7XG4gICAgbGFzdCA9IGh0bWw7XG5cbiAgICBpZiAoc2FtZSkgeyAvLyBkaXNjYXJkLCBiZWNhdXNlIGl0J3MgaW52YWxpZFxuICAgICAgaHRtbCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlVGFnICgpIHtcbiAgICBpZiAoaHRtbC5zdWJzdHIoMCwgNCkgPT09ICc8IS0tJykgeyAvLyBjb21tZW50c1xuICAgICAgcGFyc2VDb21tZW50KCk7XG4gICAgfSBlbHNlIGlmIChydGFnZW5kLnRlc3QoaHRtbCkpIHtcbiAgICAgIHBhcnNlRWRnZShyZW5kLCBwYXJzZUVuZFRhZyk7XG4gICAgfSBlbHNlIGlmIChydGFnLnRlc3QoaHRtbCkpIHtcbiAgICAgIHBhcnNlRWRnZShyc3RhcnQsIHBhcnNlU3RhcnRUYWcpO1xuICAgIH1cbiAgICBwYXJzZVRhZ0RlY29kZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VFZGdlIChyZWdleCwgcGFyc2VyKSB7XG4gICAgdmFyIG1hdGNoID0gaHRtbC5tYXRjaChyZWdleCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIG1hdGNoWzBdLnJlcGxhY2UocmVnZXgsIHBhcnNlcik7XG4gICAgICBjaGFycyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlQ29tbWVudCAoKSB7XG4gICAgdmFyIGluZGV4ID0gaHRtbC5pbmRleE9mKCctLT4nKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgaWYgKGhhbmRsZXIuY29tbWVudCkge1xuICAgICAgICBoYW5kbGVyLmNvbW1lbnQoaHRtbC5zdWJzdHJpbmcoNCwgaW5kZXgpKTtcbiAgICAgIH1cbiAgICAgIGh0bWwgPSBodG1sLnN1YnN0cmluZyhpbmRleCArIDMpO1xuICAgICAgY2hhcnMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVRhZ0RlY29kZSAoKSB7XG4gICAgaWYgKCFjaGFycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGV4dDtcbiAgICB2YXIgaW5kZXggPSBodG1sLmluZGV4T2YoJzwnKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGV4dCA9IGh0bWwuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgIGh0bWwgPSBodG1sLnN1YnN0cmluZyhpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSBodG1sO1xuICAgICAgaHRtbCA9ICcnO1xuICAgIH1cbiAgICBpZiAoaGFuZGxlci5jaGFycykge1xuICAgICAgaGFuZGxlci5jaGFycyhoZS5kZWNvZGUodGV4dCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU3RhcnRUYWcgKHRhZywgdGFnTmFtZSwgcmVzdCwgdW5hcnkpIHtcbiAgICB2YXIgYXR0cnMgPSB7fTtcbiAgICB2YXIgbG93ID0gbG93ZXJjYXNlKHRhZ05hbWUpO1xuICAgIHZhciB1ID0gZWxlbWVudHMudm9pZHNbbG93XSB8fCAhIXVuYXJ5O1xuXG4gICAgcmVzdC5yZXBsYWNlKHJhdHRycywgYXR0clJlcGxhY2VyKTtcblxuICAgIGlmICghdSkge1xuICAgICAgc3RhY2sucHVzaChsb3cpO1xuICAgIH1cbiAgICBpZiAoaGFuZGxlci5zdGFydCkge1xuICAgICAgaGFuZGxlci5zdGFydChsb3csIGF0dHJzLCB1KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdHRyUmVwbGFjZXIgKG1hdGNoLCBuYW1lLCBkb3VibGVRdW90ZWRWYWx1ZSwgc2luZ2xlUXVvdGVkVmFsdWUsIHVucXVvdGVkVmFsdWUpIHtcbiAgICAgIGlmIChkb3VibGVRdW90ZWRWYWx1ZSA9PT0gdm9pZCAwICYmIHNpbmdsZVF1b3RlZFZhbHVlID09PSB2b2lkIDAgJiYgdW5xdW90ZWRWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGF0dHJzW25hbWVdID0gdm9pZCAwOyAvLyBhdHRyaWJ1dGUgaXMgbGlrZSA8YnV0dG9uIGRpc2FibGVkPjwvYnV0dG9uPlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXR0cnNbbmFtZV0gPSBoZS5kZWNvZGUoZG91YmxlUXVvdGVkVmFsdWUgfHwgc2luZ2xlUXVvdGVkVmFsdWUgfHwgdW5xdW90ZWRWYWx1ZSB8fCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VFbmRUYWcgKHRhZywgdGFnTmFtZSkge1xuICAgIHZhciBpO1xuICAgIHZhciBwb3MgPSAwO1xuICAgIHZhciBsb3cgPSBsb3dlcmNhc2UodGFnTmFtZSk7XG4gICAgaWYgKGxvdykge1xuICAgICAgZm9yIChwb3MgPSBzdGFjay5sZW5ndGggLSAxOyBwb3MgPj0gMDsgcG9zLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrW3Bvc10gPT09IGxvdykge1xuICAgICAgICAgIGJyZWFrOyAvLyBmaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgZm9yIChpID0gc3RhY2subGVuZ3RoIC0gMTsgaSA+PSBwb3M7IGktLSkge1xuICAgICAgICBpZiAoaGFuZGxlci5lbmQpIHsgLy8gY2xvc2UgYWxsIHRoZSBvcGVuIGVsZW1lbnRzLCB1cCB0aGUgc3RhY2tcbiAgICAgICAgICBoYW5kbGVyLmVuZChzdGFja1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN0YWNrLmxlbmd0aCA9IHBvcztcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoZSA9IHJlcXVpcmUoJ2hlJyk7XG52YXIgbG93ZXJjYXNlID0gcmVxdWlyZSgnLi9sb3dlcmNhc2UnKTtcbnZhciBhdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGVzJyk7XG5cbmZ1bmN0aW9uIHNhbml0aXplciAoYnVmZmVyLCBvcHRpb25zKSB7XG4gIHZhciBsYXN0O1xuICB2YXIgY29udGV4dDtcbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuXG4gIHJlc2V0KCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBlbmQsXG4gICAgY2hhcnM6IGNoYXJzXG4gIH07XG5cbiAgZnVuY3Rpb24gb3V0ICh2YWx1ZSkge1xuICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0ICh0YWcsIGF0dHJzLCB1bmFyeSkge1xuICAgIHZhciBsb3cgPSBsb3dlcmNhc2UodGFnKTtcblxuICAgIGlmIChjb250ZXh0Lmlnbm9yaW5nKSB7XG4gICAgICBpZ25vcmUobG93KTsgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKG8uYWxsb3dlZFRhZ3MgfHwgW10pLmluZGV4T2YobG93KSA9PT0gLTEpIHtcbiAgICAgIGlnbm9yZShsb3cpOyByZXR1cm47XG4gICAgfVxuICAgIGlmIChvLmZpbHRlciAmJiAhby5maWx0ZXIoeyB0YWc6IGxvdywgYXR0cnM6IGF0dHJzIH0pKSB7XG4gICAgICBpZ25vcmUobG93KTsgcmV0dXJuO1xuICAgIH1cblxuICAgIG91dCgnPCcpO1xuICAgIG91dChsb3cpO1xuICAgIE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKHBhcnNlKTtcbiAgICBvdXQodW5hcnkgPyAnLz4nIDogJz4nKTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGF0dHJzW2tleV07XG4gICAgICB2YXIgY2xhc3Nlc09rID0gKG8uYWxsb3dlZENsYXNzZXMgfHwge30pW2xvd10gfHwgW107XG4gICAgICB2YXIgYXR0cnNPayA9IChvLmFsbG93ZWRBdHRyaWJ1dGVzIHx8IHt9KVtsb3ddIHx8IFtdO1xuICAgICAgdmFyIHZhbGlkO1xuICAgICAgdmFyIGxrZXkgPSBsb3dlcmNhc2Uoa2V5KTtcbiAgICAgIGlmIChsa2V5ID09PSAnY2xhc3MnICYmIGF0dHJzT2suaW5kZXhPZihsa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnICcpLmZpbHRlcihpc1ZhbGlkQ2xhc3MpLmpvaW4oJyAnKS50cmltKCk7XG4gICAgICAgIHZhbGlkID0gdmFsdWUubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsaWQgPSBhdHRyc09rLmluZGV4T2YobGtleSkgIT09IC0xICYmIChhdHRyaWJ1dGVzLnVyaXNbbGtleV0gIT09IHRydWUgfHwgdGVzdFVybCh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIG91dCgnICcpO1xuICAgICAgICBvdXQoa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBvdXQoJz1cIicpO1xuICAgICAgICAgIG91dChoZS5lbmNvZGUodmFsdWUpKTtcbiAgICAgICAgICBvdXQoJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGlzVmFsaWRDbGFzcyAoY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzT2sgJiYgY2xhc3Nlc09rLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW5kICh0YWcpIHtcbiAgICB2YXIgbG93ID0gbG93ZXJjYXNlKHRhZyk7XG4gICAgdmFyIGFsbG93ZWQgPSAoby5hbGxvd2VkVGFncyB8fCBbXSkuaW5kZXhPZihsb3cpICE9PSAtMTtcbiAgICBpZiAoYWxsb3dlZCkge1xuICAgICAgaWYgKGNvbnRleHQuaWdub3JpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgIG91dCgnPC8nKTtcbiAgICAgICAgb3V0KGxvdyk7XG4gICAgICAgIG91dCgnPicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5pZ25vcmUobG93KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdW5pZ25vcmUobG93KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0ZXN0VXJsICh0ZXh0KSB7XG4gICAgdmFyIHN0YXJ0ID0gdGV4dFswXTtcbiAgICBpZiAoc3RhcnQgPT09ICcjJyB8fCBzdGFydCA9PT0gJy8nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGNvbG9uID0gdGV4dC5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKGNvbG9uID09PSAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBxdWVzdGlvbm1hcmsgPSB0ZXh0LmluZGV4T2YoJz8nKTtcbiAgICBpZiAocXVlc3Rpb25tYXJrICE9PSAtMSAmJiBjb2xvbiA+IHF1ZXN0aW9ubWFyaykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBoYXNoID0gdGV4dC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2ggIT09IC0xICYmIGNvbG9uID4gaGFzaCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBvLmFsbG93ZWRTY2hlbWVzLnNvbWUobWF0Y2hlcyk7XG5cbiAgICBmdW5jdGlvbiBtYXRjaGVzIChzY2hlbWUpIHtcbiAgICAgIHJldHVybiB0ZXh0LmluZGV4T2Yoc2NoZW1lICsgJzonKSA9PT0gMDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGFycyAodGV4dCkge1xuICAgIGlmIChjb250ZXh0Lmlnbm9yaW5nID09PSBmYWxzZSkge1xuICAgICAgb3V0KGhlLmVuY29kZSh0ZXh0KSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaWdub3JlICh0YWcpIHtcbiAgICBpZiAoY29udGV4dC5pZ25vcmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnRleHQgPSB7IGlnbm9yaW5nOiB0YWcsIGRlcHRoOiAxIH07XG4gICAgfSBlbHNlIGlmIChjb250ZXh0Lmlnbm9yaW5nID09PSB0YWcpIHtcbiAgICAgIGNvbnRleHQuZGVwdGgrKztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1bmlnbm9yZSAodGFnKSB7XG4gICAgaWYgKGNvbnRleHQuaWdub3JpbmcgPT09IHRhZykge1xuICAgICAgaWYgKC0tY29udGV4dC5kZXB0aCA8PSAwKSB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQgKCkge1xuICAgIGNvbnRleHQgPSB7IGlnbm9yaW5nOiBmYWxzZSwgZGVwdGg6IDAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNhbml0aXplcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVzY2FwZXMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmIzM5Oydcbn07XG52YXIgdW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiXG59O1xudmFyIHJlc2NhcGVkID0gLygmYW1wO3wmbHQ7fCZndDt8JnF1b3Q7fCYjMzk7KS9nO1xudmFyIHJ1bmVzY2FwZWQgPSAvWyY8PlwiJ10vZztcblxuZnVuY3Rpb24gZXNjYXBlSHRtbENoYXIgKG1hdGNoKSB7XG4gIHJldHVybiBlc2NhcGVzW21hdGNoXTtcbn1cbmZ1bmN0aW9uIHVuZXNjYXBlSHRtbENoYXIgKG1hdGNoKSB7XG4gIHJldHVybiB1bmVzY2FwZXNbbWF0Y2hdO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVIdG1sICh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0ID09IG51bGwgPyAnJyA6IFN0cmluZyh0ZXh0KS5yZXBsYWNlKHJ1bmVzY2FwZWQsIGVzY2FwZUh0bWxDaGFyKTtcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGVIdG1sIChodG1sKSB7XG4gIHJldHVybiBodG1sID09IG51bGwgPyAnJyA6IFN0cmluZyhodG1sKS5yZXBsYWNlKHJlc2NhcGVkLCB1bmVzY2FwZUh0bWxDaGFyKTtcbn1cblxuZXNjYXBlSHRtbC5vcHRpb25zID0gdW5lc2NhcGVIdG1sLm9wdGlvbnMgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVuY29kZTogZXNjYXBlSHRtbCxcbiAgZXNjYXBlOiBlc2NhcGVIdG1sLFxuICBkZWNvZGU6IHVuZXNjYXBlSHRtbCxcbiAgdW5lc2NhcGU6IHVuZXNjYXBlSHRtbCxcbiAgdmVyc2lvbjogJzEuMC4wLWJyb3dzZXInXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiB0b01hcCAobGlzdCkge1xuICByZXR1cm4gbGlzdC5yZWR1Y2UoYXNLZXksIHt9KTtcbn1cblxuZnVuY3Rpb24gYXNLZXkgKGFjY3VtdWxhdG9yLCBpdGVtKSB7XG4gIGFjY3VtdWxhdG9yW2l0ZW1dID0gdHJ1ZTtcbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTWFwO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBIZWxwZXJzXG5cbi8vIE1lcmdlIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2NsYXNzKG9iaikgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7IH1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikgeyByZXR1cm4gX2NsYXNzKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nOyB9XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHsgcmV0dXJuIF9jbGFzcyhvYmopID09PSAnW29iamVjdCBPYmplY3RdJzsgfVxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7IH1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7IHJldHVybiBfY2xhc3Mob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJzsgfVxuXG5cbmZ1bmN0aW9uIGVzY2FwZVJFIChzdHIpIHsgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLj8qK14kW1xcXVxcXFwoKXt9fC1dL2csICdcXFxcJCYnKTsgfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbnZhciBkZWZhdWx0U2NoZW1hcyA9IHtcbiAgJ2h0dHA6Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLmh0dHApIHtcbiAgICAgICAgLy8gY29tcGlsZSBsYXppbHksIGJlY2F1c2UgXCJob3N0XCItY29udGFpbmluZyB2YXJpYWJsZXMgY2FuIGNoYW5nZSBvbiB0bGRzIHVwZGF0ZS5cbiAgICAgICAgc2VsZi5yZS5odHRwID0gIG5ldyBSZWdFeHAoXG4gICAgICAgICAgJ15cXFxcL1xcXFwvJyArIHNlbGYucmUuc3JjX2F1dGggKyBzZWxmLnJlLnNyY19ob3N0X3BvcnRfc3RyaWN0ICsgc2VsZi5yZS5zcmNfcGF0aCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdodHRwczonOiAgJ2h0dHA6JyxcbiAgJ2Z0cDonOiAgICAnaHR0cDonLFxuICAnLy8nOiAgICAgIHtcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKHRleHQsIHBvcywgc2VsZikge1xuICAgICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICAgIGlmICghc2VsZi5yZS5ub19odHRwKSB7XG4gICAgICAvLyBjb21waWxlIGxhemlseSwgYmVjYXlzZSBcImhvc3RcIi1jb250YWluaW5nIHZhcmlhYmxlcyBjYW4gY2hhbmdlIG9uIHRsZHMgdXBkYXRlLlxuICAgICAgICBzZWxmLnJlLm5vX2h0dHAgPSAgbmV3IFJlZ0V4cChcbiAgICAgICAgICAnXicgKyBzZWxmLnJlLnNyY19hdXRoICsgc2VsZi5yZS5zcmNfaG9zdF9wb3J0X3N0cmljdCArIHNlbGYucmUuc3JjX3BhdGgsICdpJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5yZS5ub19odHRwLnRlc3QodGFpbCkpIHtcbiAgICAgICAgLy8gc2hvdWxkIG5vdCBiZSBgOi8vYCwgdGhhdCBwcm90ZWN0cyBmcm9tIGVycm9ycyBpbiBwcm90b2NvbCBuYW1lXG4gICAgICAgIGlmIChwb3MgPj0gMyAmJiB0ZXh0W3BvcyAtIDNdID09PSAnOicpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHRhaWwubWF0Y2goc2VsZi5yZS5ub19odHRwKVswXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH0sXG4gICdtYWlsdG86Jzoge1xuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAodGV4dCwgcG9zLCBzZWxmKSB7XG4gICAgICB2YXIgdGFpbCA9IHRleHQuc2xpY2UocG9zKTtcblxuICAgICAgaWYgKCFzZWxmLnJlLm1haWx0bykge1xuICAgICAgICBzZWxmLnJlLm1haWx0byA9ICBuZXcgUmVnRXhwKFxuICAgICAgICAgICdeJyArIHNlbGYucmUuc3JjX2VtYWlsX25hbWUgKyAnQCcgKyBzZWxmLnJlLnNyY19ob3N0X3N0cmljdCwgJ2knXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5yZS5tYWlsdG8udGVzdCh0YWlsKSkge1xuICAgICAgICByZXR1cm4gdGFpbC5tYXRjaChzZWxmLnJlLm1haWx0bylbMF0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59O1xuXG4vLyBET04nVCB0cnkgdG8gbWFrZSBQUnMgd2l0aCBjaGFuZ2VzLiBFeHRlbmQgVExEcyB3aXRoIExpbmtpZnlJdC50bGRzKCkgaW5zdGVhZFxudmFyIHRsZHNfZGVmYXVsdCA9ICdiaXp8Y29tfGVkdXxnb3Z8bmV0fG9yZ3xwcm98d2VifHh4eHxhZXJvfGFzaWF8Y29vcHxpbmZvfG11c2V1bXxuYW1lfHNob3B80YDRhCcuc3BsaXQoJ3wnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gcmVzZXRTY2FuQ2FjaGUoc2VsZikge1xuICBzZWxmLl9faW5kZXhfXyA9IC0xO1xuICBzZWxmLl9fdGV4dF9jYWNoZV9fICAgPSAnJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmFsaWRhdG9yKHJlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGV4dCwgcG9zKSB7XG4gICAgdmFyIHRhaWwgPSB0ZXh0LnNsaWNlKHBvcyk7XG5cbiAgICBpZiAocmUudGVzdCh0YWlsKSkge1xuICAgICAgcmV0dXJuIHRhaWwubWF0Y2gocmUpWzBdLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vcm1hbGl6ZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobWF0Y2gsIHNlbGYpIHtcbiAgICBzZWxmLm5vcm1hbGl6ZShtYXRjaCk7XG4gIH07XG59XG5cbi8vIFNjaGVtYXMgY29tcGlsZXIuIEJ1aWxkIHJlZ2V4cHMuXG4vL1xuZnVuY3Rpb24gY29tcGlsZShzZWxmKSB7XG5cbiAgLy8gTG9hZCAmIGNsb25lIFJFIHBhdHRlcm5zLlxuICB2YXIgcmUgPSBzZWxmLnJlID0gYXNzaWduKHt9LCByZXF1aXJlKCcuL2xpYi9yZScpKTtcblxuICAvLyBEZWZpbmUgZHluYW1pYyBwYXR0ZXJuc1xuICB2YXIgdGxkcyA9IHNlbGYuX190bGRzX18uc2xpY2UoKTtcblxuICBpZiAoIXNlbGYuX190bGRzX3JlcGxhY2VkX18pIHtcbiAgICB0bGRzLnB1c2goJ1thLXpdezJ9Jyk7XG4gIH1cbiAgdGxkcy5wdXNoKHJlLnNyY194bik7XG5cbiAgcmUuc3JjX3RsZHMgPSB0bGRzLmpvaW4oJ3wnKTtcblxuICBmdW5jdGlvbiB1bnRwbCh0cGwpIHsgcmV0dXJuIHRwbC5yZXBsYWNlKCclVExEUyUnLCByZS5zcmNfdGxkcyk7IH1cblxuICByZS5lbWFpbF9mdXp6eSAgICAgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9lbWFpbF9mdXp6eSksICdpJyk7XG4gIHJlLmxpbmtfZnV6enkgICAgICAgPSBSZWdFeHAodW50cGwocmUudHBsX2xpbmtfZnV6enkpLCAnaScpO1xuICByZS5ob3N0X2Z1enp5X3Rlc3QgID0gUmVnRXhwKHVudHBsKHJlLnRwbF9ob3N0X2Z1enp5X3Rlc3QpLCAnaScpO1xuXG4gIC8vXG4gIC8vIENvbXBpbGUgZWFjaCBzY2hlbWFcbiAgLy9cblxuICB2YXIgYWxpYXNlcyA9IFtdO1xuXG4gIHNlbGYuX19jb21waWxlZF9fID0ge307IC8vIFJlc2V0IGNvbXBpbGVkIGRhdGFcblxuICBmdW5jdGlvbiBzY2hlbWFFcnJvcihuYW1lLCB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJyhMaW5raWZ5SXQpIEludmFsaWQgc2NoZW1hIFwiJyArIG5hbWUgKyAnXCI6ICcgKyB2YWwpO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoc2VsZi5fX3NjaGVtYXNfXykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB2YWwgPSBzZWxmLl9fc2NoZW1hc19fW25hbWVdO1xuXG4gICAgLy8gc2tpcCBkaXNhYmxlZCBtZXRob2RzXG4gICAgaWYgKHZhbCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHZhciBjb21waWxlZCA9IHsgdmFsaWRhdGU6IG51bGwsIGxpbms6IG51bGwgfTtcblxuICAgIHNlbGYuX19jb21waWxlZF9fW25hbWVdID0gY29tcGlsZWQ7XG5cbiAgICBpZiAoaXNPYmplY3QodmFsKSkge1xuICAgICAgaWYgKGlzUmVnRXhwKHZhbC52YWxpZGF0ZSkpIHtcbiAgICAgICAgY29tcGlsZWQudmFsaWRhdGUgPSBjcmVhdGVWYWxpZGF0b3IodmFsLnZhbGlkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih2YWwudmFsaWRhdGUpKSB7XG4gICAgICAgIGNvbXBpbGVkLnZhbGlkYXRlID0gdmFsLnZhbGlkYXRlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRnVuY3Rpb24odmFsLm5vcm1hbGl6ZSkpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gdmFsLm5vcm1hbGl6ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXZhbC5ub3JtYWxpemUpIHtcbiAgICAgICAgY29tcGlsZWQubm9ybWFsaXplID0gY3JlYXRlTm9ybWFsaXplcigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICBhbGlhc2VzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2NoZW1hRXJyb3IobmFtZSwgdmFsKTtcbiAgfSk7XG5cbiAgLy9cbiAgLy8gQ29tcGlsZSBwb3N0cG9uZWQgYWxpYXNlc1xuICAvL1xuXG4gIGFsaWFzZXMuZm9yRWFjaChmdW5jdGlvbiAoYWxpYXMpIHtcbiAgICBpZiAoIXNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXSkge1xuICAgICAgLy8gU2lsZW50bHkgZmFpbCBvbiBtaXNzZWQgc2NoZW1hcyB0byBhdm9pZCBlcnJvbnMgb24gZGlzYWJsZS5cbiAgICAgIC8vIHNjaGVtYUVycm9yKGFsaWFzLCBzZWxmLl9fc2NoZW1hc19fW2FsaWFzXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5fX2NvbXBpbGVkX19bYWxpYXNdLnZhbGlkYXRlID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS52YWxpZGF0ZTtcbiAgICBzZWxmLl9fY29tcGlsZWRfX1thbGlhc10ubm9ybWFsaXplID1cbiAgICAgIHNlbGYuX19jb21waWxlZF9fW3NlbGYuX19zY2hlbWFzX19bYWxpYXNdXS5ub3JtYWxpemU7XG4gIH0pO1xuXG4gIC8vXG4gIC8vIEZha2UgcmVjb3JkIGZvciBndWVzc2VkIGxpbmtzXG4gIC8vXG4gIHNlbGYuX19jb21waWxlZF9fWycnXSA9IHsgdmFsaWRhdGU6IG51bGwsIG5vcm1hbGl6ZTogY3JlYXRlTm9ybWFsaXplcigpIH07XG5cbiAgLy9cbiAgLy8gQnVpbGQgc2NoZW1hIGNvbmRpdGlvblxuICAvL1xuICB2YXIgc2xpc3QgPSBPYmplY3Qua2V5cyhzZWxmLl9fY29tcGlsZWRfXylcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBkaXNhYmxlZCAmIGZha2Ugc2NoZW1hc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiBzZWxmLl9fY29tcGlsZWRfX1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZXNjYXBlUkUpXG4gICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJ3wnKTtcbiAgLy8gKD8hXykgY2F1c2UgMS41eCBzbG93ZG93blxuICBzZWxmLnJlLnNjaGVtYV90ZXN0ICAgPSBSZWdFeHAoJyhefCg/IV8pKD86PnwnICsgcmUuc3JjX1pQQ2NDZiArICcpKSgnICsgc2xpc3QgKyAnKScsICdpJyk7XG4gIHNlbGYucmUuc2NoZW1hX3NlYXJjaCA9IFJlZ0V4cCgnKF58KD8hXykoPzo+fCcgKyByZS5zcmNfWlBDY0NmICsgJykpKCcgKyBzbGlzdCArICcpJywgJ2lnJyk7XG5cbiAgLy9cbiAgLy8gQ2xlYW51cFxuICAvL1xuXG4gIHJlc2V0U2NhbkNhY2hlKHNlbGYpO1xufVxuXG4vKipcbiAqIGNsYXNzIE1hdGNoXG4gKlxuICogTWF0Y2ggcmVzdWx0LiBTaW5nbGUgZWxlbWVudCBvZiBhcnJheSwgcmV0dXJuZWQgYnkgW1tMaW5raWZ5SXQjbWF0Y2hdXVxuICoqL1xuZnVuY3Rpb24gTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIHN0YXJ0ID0gc2VsZi5fX2luZGV4X18sXG4gICAgICBlbmQgICA9IHNlbGYuX19sYXN0X2luZGV4X18sXG4gICAgICB0ZXh0ICA9IHNlbGYuX190ZXh0X2NhY2hlX18uc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgLyoqXG4gICAqIE1hdGNoI3NjaGVtYSAtPiBTdHJpbmdcbiAgICpcbiAgICogUHJlZml4IChwcm90b2NvbCkgZm9yIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMuc2NoZW1hICAgID0gc2VsZi5fX3NjaGVtYV9fLnRvTG93ZXJDYXNlKCk7XG4gIC8qKlxuICAgKiBNYXRjaCNpbmRleCAtPiBOdW1iZXJcbiAgICpcbiAgICogRmlyc3QgcG9zaXRpb24gb2YgbWF0Y2hlZCBzdHJpbmcuXG4gICAqKi9cbiAgdGhpcy5pbmRleCAgICAgPSBzdGFydCArIHNoaWZ0O1xuICAvKipcbiAgICogTWF0Y2gjbGFzdEluZGV4IC0+IE51bWJlclxuICAgKlxuICAgKiBOZXh0IHBvc2l0aW9uIGFmdGVyIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMubGFzdEluZGV4ID0gZW5kICsgc2hpZnQ7XG4gIC8qKlxuICAgKiBNYXRjaCNyYXcgLT4gU3RyaW5nXG4gICAqXG4gICAqIE1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMucmF3ICAgICAgID0gdGV4dDtcbiAgLyoqXG4gICAqIE1hdGNoI3RleHQgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vdG1hbGl6ZWQgdGV4dCBvZiBtYXRjaGVkIHN0cmluZy5cbiAgICoqL1xuICB0aGlzLnRleHQgICAgICA9IHRleHQ7XG4gIC8qKlxuICAgKiBNYXRjaCN1cmwgLT4gU3RyaW5nXG4gICAqXG4gICAqIE5vcm1hbGl6ZWQgdXJsIG9mIG1hdGNoZWQgc3RyaW5nLlxuICAgKiovXG4gIHRoaXMudXJsICAgICAgID0gdGV4dDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWF0Y2goc2VsZiwgc2hpZnQpIHtcbiAgdmFyIG1hdGNoID0gbmV3IE1hdGNoKHNlbGYsIHNoaWZ0KTtcblxuICBzZWxmLl9fY29tcGlsZWRfX1ttYXRjaC5zY2hlbWFdLm5vcm1hbGl6ZShtYXRjaCwgc2VsZik7XG5cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5cbi8qKlxuICogY2xhc3MgTGlua2lmeUl0XG4gKiovXG5cbi8qKlxuICogbmV3IExpbmtpZnlJdChzY2hlbWFzKVxuICogLSBzY2hlbWFzIChPYmplY3QpOiBPcHRpb25hbC4gQWRkaXRpb25hbCBzY2hlbWFzIHRvIHZhbGlkYXRlIChwcmVmaXgvdmFsaWRhdG9yKVxuICpcbiAqIENyZWF0ZXMgbmV3IGxpbmtpZmllciBpbnN0YW5jZSB3aXRoIG9wdGlvbmFsIGFkZGl0aW9uYWwgc2NoZW1hcy5cbiAqIENhbiBiZSBjYWxsZWQgd2l0aG91dCBgbmV3YCBrZXl3b3JkIGZvciBjb252ZW5pZW5jZS5cbiAqXG4gKiBCeSBkZWZhdWx0IHVuZGVyc3RhbmRzOlxuICpcbiAqIC0gYGh0dHAocyk6Ly8uLi5gICwgYGZ0cDovLy4uLmAsIGBtYWlsdG86Li4uYCAmIGAvLy4uLmAgbGlua3NcbiAqIC0gXCJmdXp6eVwiIGxpbmtzIGFuZCBlbWFpbHMgKGV4YW1wbGUuY29tLCBmb29AYmFyLmNvbSkuXG4gKlxuICogYHNjaGVtYXNgIGlzIGFuIG9iamVjdCwgd2hlcmUgZWFjaCBrZXkvdmFsdWUgZGVzY3JpYmVzIHByb3RvY29sL3J1bGU6XG4gKlxuICogLSBfX2tleV9fIC0gbGluayBwcmVmaXggKHVzdWFsbHksIHByb3RvY29sIG5hbWUgd2l0aCBgOmAgYXQgdGhlIGVuZCwgYHNreXBlOmBcbiAqICAgZm9yIGV4YW1wbGUpLiBgbGlua2lmeS1pdGAgbWFrZXMgc2h1cmUgdGhhdCBwcmVmaXggaXMgbm90IHByZWNlZWRlZCB3aXRoXG4gKiAgIGFscGhhbnVtZXJpYyBjaGFyIGFuZCBzeW1ib2xzLiBPbmx5IHdoaXRlc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiBhbGxvd2VkLlxuICogLSBfX3ZhbHVlX18gLSBydWxlIHRvIGNoZWNrIHRhaWwgYWZ0ZXIgbGluayBwcmVmaXhcbiAqICAgLSBfU3RyaW5nXyAtIGp1c3QgYWxpYXMgdG8gZXhpc3RpbmcgcnVsZVxuICogICAtIF9PYmplY3RfXG4gKiAgICAgLSBfdmFsaWRhdGVfIC0gdmFsaWRhdG9yIGZ1bmN0aW9uIChzaG91bGQgcmV0dXJuIG1hdGNoZWQgbGVuZ3RoIG9uIHN1Y2Nlc3MpLFxuICogICAgICAgb3IgYFJlZ0V4cGAuXG4gKiAgICAgLSBfbm9ybWFsaXplXyAtIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0ZXh0ICYgdXJsIG9mIG1hdGNoZWQgcmVzdWx0XG4gKiAgICAgICAoZm9yIGV4YW1wbGUsIGZvciBAdHdpdHRlciBtZW50aW9ucykuXG4gKiovXG5mdW5jdGlvbiBMaW5raWZ5SXQoc2NoZW1hcykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGlua2lmeUl0KSkge1xuICAgIHJldHVybiBuZXcgTGlua2lmeUl0KHNjaGVtYXMpO1xuICB9XG5cbiAgLy8gQ2FjaGUgbGFzdCB0ZXN0ZWQgcmVzdWx0LiBVc2VkIHRvIHNraXAgcmVwZWF0aW5nIHN0ZXBzIG9uIG5leHQgYG1hdGNoYCBjYWxsLlxuICB0aGlzLl9faW5kZXhfXyAgICAgICAgICA9IC0xO1xuICB0aGlzLl9fbGFzdF9pbmRleF9fICAgICA9IC0xOyAvLyBOZXh0IHNjYW4gcG9zaXRpb25cbiAgdGhpcy5fX3NjaGVtYV9fICAgICAgICAgPSAnJztcbiAgdGhpcy5fX3RleHRfY2FjaGVfXyAgICAgPSAnJztcblxuICB0aGlzLl9fc2NoZW1hc19fICAgICAgICA9IGFzc2lnbih7fSwgZGVmYXVsdFNjaGVtYXMsIHNjaGVtYXMpO1xuICB0aGlzLl9fY29tcGlsZWRfXyAgICAgICA9IHt9O1xuXG4gIHRoaXMuX190bGRzX18gICAgICAgICAgID0gdGxkc19kZWZhdWx0O1xuICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fICA9IGZhbHNlO1xuXG4gIHRoaXMucmUgPSB7fTtcblxuICBjb21waWxlKHRoaXMpO1xufVxuXG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCNhZGQoc2NoZW1hLCBkZWZpbml0aW9uKVxuICogLSBzY2hlbWEgKFN0cmluZyk6IHJ1bGUgbmFtZSAoZml4ZWQgcGF0dGVybiBwcmVmaXgpXG4gKiAtIGRlZmluaXRpb24gKFN0cmluZ3xSZWdFeHB8T2JqZWN0KTogc2NoZW1hIGRlZmluaXRpb25cbiAqXG4gKiBBZGQgbmV3IHJ1bGUgZGVmaW5pdGlvbi4gU2VlIGNvbnN0cnVjdG9yIGRlc2NyaXB0aW9uIGZvciBkZXRhaWxzLlxuICoqL1xuTGlua2lmeUl0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoc2NoZW1hLCBkZWZpbml0aW9uKSB7XG4gIHRoaXMuX19zY2hlbWFzX19bc2NoZW1hXSA9IGRlZmluaXRpb247XG4gIGNvbXBpbGUodGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCN0ZXN0KHRleHQpIC0+IEJvb2xlYW5cbiAqXG4gKiBTZWFyY2hlcyBsaW5raWZpYWJsZSBwYXR0ZXJuIGFuZCByZXR1cm5zIGB0cnVlYCBvbiBzdWNjZXNzIG9yIGBmYWxzZWAgb24gZmFpbC5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUudGVzdCA9IGZ1bmN0aW9uIHRlc3QodGV4dCkge1xuICAvLyBSZXNldCBzY2FuIGNhY2hlXG4gIHRoaXMuX190ZXh0X2NhY2hlX18gPSB0ZXh0O1xuICB0aGlzLl9faW5kZXhfXyAgICAgID0gLTE7XG5cbiAgaWYgKCF0ZXh0Lmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICB2YXIgbSwgbWwsIG1lLCBsZW4sIHNoaWZ0LCBuZXh0LCByZSwgdGxkX3BvcywgYXRfcG9zO1xuXG4gIC8vIHRyeSB0byBzY2FuIGZvciBsaW5rIHdpdGggc2NoZW1hIC0gdGhhdCdzIHRoZSBtb3N0IHNpbXBsZSBydWxlXG4gIGlmICh0aGlzLnJlLnNjaGVtYV90ZXN0LnRlc3QodGV4dCkpIHtcbiAgICByZSA9IHRoaXMucmUuc2NoZW1hX3NlYXJjaDtcbiAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IHJlLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgICBsZW4gPSB0aGlzLnRlc3RTY2hlbWFBdCh0ZXh0LCBtWzJdLCByZS5sYXN0SW5kZXgpO1xuICAgICAgaWYgKGxlbikge1xuICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gbVsyXTtcbiAgICAgICAgdGhpcy5fX2luZGV4X18gICAgICA9IG0uaW5kZXggKyBtWzFdLmxlbmd0aDtcbiAgICAgICAgdGhpcy5fX2xhc3RfaW5kZXhfXyA9IG0uaW5kZXggKyBtWzBdLmxlbmd0aCArIGxlbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX19jb21waWxlZF9fWydodHRwOiddKSB7XG4gICAgLy8gZ3Vlc3Mgc2NoZW1hbGVzcyBsaW5rc1xuICAgIHRsZF9wb3MgPSB0ZXh0LnNlYXJjaCh0aGlzLnJlLmhvc3RfZnV6enlfdGVzdCk7XG4gICAgaWYgKHRsZF9wb3MgPj0gMCkge1xuICAgICAgLy8gaWYgdGxkIGlzIGxvY2F0ZWQgYWZ0ZXIgZm91bmQgbGluayAtIG5vIG5lZWQgdG8gY2hlY2sgZnV6enkgcGF0dGVyblxuICAgICAgaWYgKHRoaXMuX19pbmRleF9fIDwgMCB8fCB0bGRfcG9zIDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgaWYgKChtbCA9IHRleHQubWF0Y2godGhpcy5yZS5saW5rX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICAgIHNoaWZ0ID0gbWwuaW5kZXggKyBtbFsxXS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAodGhpcy5fX2luZGV4X18gPCAwIHx8IHNoaWZ0IDwgdGhpcy5fX2luZGV4X18pIHtcbiAgICAgICAgICAgIHRoaXMuX19zY2hlbWFfXyAgICAgPSAnJztcbiAgICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICAgIHRoaXMuX19sYXN0X2luZGV4X18gPSBtbC5pbmRleCArIG1sWzBdLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fX2NvbXBpbGVkX19bJ21haWx0bzonXSkge1xuICAgIC8vIGd1ZXNzIHNjaGVtYWxlc3MgZW1haWxzXG4gICAgYXRfcG9zID0gdGV4dC5pbmRleE9mKCdAJyk7XG4gICAgaWYgKGF0X3BvcyA+PSAwKSB7XG4gICAgICAvLyBXZSBjYW4ndCBza2lwIHRoaXMgY2hlY2ssIGJlY2F1c2UgdGhpcyBjYXNlcyBhcmUgcG9zc2libGU6XG4gICAgICAvLyAxOTIuMTY4LjEuMUBnbWFpbC5jb20sIG15LmluQGV4YW1wbGUuY29tXG4gICAgICBpZiAoKG1lID0gdGV4dC5tYXRjaCh0aGlzLnJlLmVtYWlsX2Z1enp5KSkgIT09IG51bGwpIHtcblxuICAgICAgICBzaGlmdCA9IG1lLmluZGV4ICsgbWVbMV0ubGVuZ3RoO1xuICAgICAgICBuZXh0ICA9IG1lLmluZGV4ICsgbWVbMF0ubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0aGlzLl9faW5kZXhfXyA8IDAgfHwgc2hpZnQgPCB0aGlzLl9faW5kZXhfXyB8fFxuICAgICAgICAgICAgKHNoaWZ0ID09PSB0aGlzLl9faW5kZXhfXyAmJiBuZXh0ID4gdGhpcy5fX2xhc3RfaW5kZXhfXykpIHtcbiAgICAgICAgICB0aGlzLl9fc2NoZW1hX18gICAgID0gJ21haWx0bzonO1xuICAgICAgICAgIHRoaXMuX19pbmRleF9fICAgICAgPSBzaGlmdDtcbiAgICAgICAgICB0aGlzLl9fbGFzdF9pbmRleF9fID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLl9faW5kZXhfXyA+PSAwO1xufTtcblxuXG4vKipcbiAqIExpbmtpZnlJdCN0ZXN0U2NoZW1hQXQodGV4dCwgbmFtZSwgcG9zaXRpb24pIC0+IE51bWJlclxuICogLSB0ZXh0IChTdHJpbmcpOiB0ZXh0IHRvIHNjYW5cbiAqIC0gbmFtZSAoU3RyaW5nKTogcnVsZSAoc2NoZW1hKSBuYW1lXG4gKiAtIHBvc2l0aW9uIChOdW1iZXIpOiB0ZXh0IG9mZnNldCB0byBjaGVjayBmcm9tXG4gKlxuICogU2ltaWxhciB0byBbW0xpbmtpZnlJdCN0ZXN0XV0gYnV0IGNoZWNrcyBvbmx5IHNwZWNpZmljIHByb3RvY29sIHRhaWwgZXhhY3RseVxuICogYXQgZ2l2ZW4gcG9zaXRpb24uIFJldHVybnMgbGVuZ3RoIG9mIGZvdW5kIHBhdHRlcm4gKDAgb24gZmFpbCkuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRlc3RTY2hlbWFBdCA9IGZ1bmN0aW9uIHRlc3RTY2hlbWFBdCh0ZXh0LCBzY2hlbWEsIHBvcykge1xuICAvLyBJZiBub3Qgc3VwcG9ydGVkIHNjaGVtYSBjaGVjayByZXF1ZXN0ZWQgLSB0ZXJtaW5hdGVcbiAgaWYgKCF0aGlzLl9fY29tcGlsZWRfX1tzY2hlbWEudG9Mb3dlckNhc2UoKV0pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gdGhpcy5fX2NvbXBpbGVkX19bc2NoZW1hLnRvTG93ZXJDYXNlKCldLnZhbGlkYXRlKHRleHQsIHBvcywgdGhpcyk7XG59O1xuXG5cbi8qKlxuICogTGlua2lmeUl0I21hdGNoKHRleHQpIC0+IEFycmF5fG51bGxcbiAqXG4gKiBSZXR1cm5zIGFycmF5IG9mIGZvdW5kIGxpbmsgZGVzY3JpcHRpb25zIG9yIGBudWxsYCBvbiBmYWlsLiBXZSBzdHJvbmdseVxuICogdG8gdXNlIFtbTGlua2lmeUl0I3Rlc3RdXSBmaXJzdCwgZm9yIGJlc3Qgc3BlZWQuXG4gKlxuICogIyMjIyMgUmVzdWx0IG1hdGNoIGRlc2NyaXB0aW9uXG4gKlxuICogLSBfX3NjaGVtYV9fIC0gbGluayBzY2hlbWEsIGNhbiBiZSBlbXB0eSBmb3IgZnV6enkgbGlua3MsIG9yIGAvL2AgZm9yXG4gKiAgIHByb3RvY29sLW5ldXRyYWwgIGxpbmtzLlxuICogLSBfX2luZGV4X18gLSBvZmZzZXQgb2YgbWF0Y2hlZCB0ZXh0XG4gKiAtIF9fbGFzdEluZGV4X18gLSBpbmRleCBvZiBuZXh0IGNoYXIgYWZ0ZXIgbWF0aGNoIGVuZFxuICogLSBfX3Jhd19fIC0gbWF0Y2hlZCB0ZXh0XG4gKiAtIF9fdGV4dF9fIC0gbm9ybWFsaXplZCB0ZXh0XG4gKiAtIF9fdXJsX18gLSBsaW5rLCBnZW5lcmF0ZWQgZnJvbSBtYXRjaGVkIHRleHRcbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiBtYXRjaCh0ZXh0KSB7XG4gIHZhciBzaGlmdCA9IDAsIHJlc3VsdCA9IFtdO1xuXG4gIC8vIFRyeSB0byB0YWtlIHByZXZpb3VzIGVsZW1lbnQgZnJvbSBjYWNoZSwgaWYgLnRlc3QoKSBjYWxsZWQgYmVmb3JlXG4gIGlmICh0aGlzLl9faW5kZXhfXyA+PSAwICYmIHRoaXMuX190ZXh0X2NhY2hlX18gPT09IHRleHQpIHtcbiAgICByZXN1bHQucHVzaChjcmVhdGVNYXRjaCh0aGlzLCBzaGlmdCkpO1xuICAgIHNoaWZ0ID0gdGhpcy5fX2xhc3RfaW5kZXhfXztcbiAgfVxuXG4gIC8vIEN1dCBoZWFkIGlmIGNhY2hlIHdhcyB1c2VkXG4gIHZhciB0YWlsID0gc2hpZnQgPyB0ZXh0LnNsaWNlKHNoaWZ0KSA6IHRleHQ7XG5cbiAgLy8gU2NhbiBzdHJpbmcgdW50aWwgZW5kIHJlYWNoZWRcbiAgd2hpbGUgKHRoaXMudGVzdCh0YWlsKSkge1xuICAgIHJlc3VsdC5wdXNoKGNyZWF0ZU1hdGNoKHRoaXMsIHNoaWZ0KSk7XG5cbiAgICB0YWlsID0gdGFpbC5zbGljZSh0aGlzLl9fbGFzdF9pbmRleF9fKTtcbiAgICBzaGlmdCArPSB0aGlzLl9fbGFzdF9pbmRleF9fO1xuICB9XG5cbiAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKiBjaGFpbmFibGVcbiAqIExpbmtpZnlJdCN0bGRzKGxpc3QgWywga2VlcE9sZF0pIC0+IHRoaXNcbiAqIC0gbGlzdCAoQXJyYXkpOiBsaXN0IG9mIHRsZHNcbiAqIC0ga2VlcE9sZCAoQm9vbGVhbik6IG1lcmdlIHdpdGggY3VycmVudCBsaXN0IGlmIGB0cnVlYCAoYGZhbHNlYCBieSBkZWZhdWx0KVxuICpcbiAqIExvYWQgKG9yIG1lcmdlKSBuZXcgdGxkcyBsaXN0LiBUaG9zZSBhcmUgdXNlciBmb3IgZnV6enkgbGlua3MgKHdpdGhvdXQgcHJlZml4KVxuICogdG8gYXZvaWQgZmFsc2UgcG9zaXRpdmVzLiBCeSBkZWZhdWx0IHRoaXMgYWxnb3J5dGhtIHVzZWQ6XG4gKlxuICogLSBob3N0bmFtZSB3aXRoIGFueSAyLWxldHRlciByb290IHpvbmVzIGFyZSBvay5cbiAqIC0gYml6fGNvbXxlZHV8Z292fG5ldHxvcmd8cHJvfHdlYnx4eHh8YWVyb3xhc2lhfGNvb3B8aW5mb3xtdXNldW18bmFtZXxzaG9wfNGA0YRcbiAqICAgYXJlIG9rLlxuICogLSBlbmNvZGVkIChgeG4tLS4uLmApIHJvb3Qgem9uZXMgYXJlIG9rLlxuICpcbiAqIElmIGxpc3QgaXMgcmVwbGFjZWQsIHRoZW4gZXhhY3QgbWF0Y2ggZm9yIDItY2hhcnMgcm9vdCB6b25lcyB3aWxsIGJlIGNoZWNrZWQuXG4gKiovXG5MaW5raWZ5SXQucHJvdG90eXBlLnRsZHMgPSBmdW5jdGlvbiB0bGRzKGxpc3QsIGtlZXBPbGQpIHtcbiAgbGlzdCA9IEFycmF5LmlzQXJyYXkobGlzdCkgPyBsaXN0IDogWyBsaXN0IF07XG5cbiAgaWYgKCFrZWVwT2xkKSB7XG4gICAgdGhpcy5fX3RsZHNfXyA9IGxpc3Quc2xpY2UoKTtcbiAgICB0aGlzLl9fdGxkc19yZXBsYWNlZF9fID0gdHJ1ZTtcbiAgICBjb21waWxlKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhpcy5fX3RsZHNfXyA9IHRoaXMuX190bGRzX18uY29uY2F0KGxpc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZWwsIGlkeCwgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwgIT09IGFycltpZHggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XG5cbiAgY29tcGlsZSh0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIExpbmtpZnlJdCNub3JtYWxpemUobWF0Y2gpXG4gKlxuICogRGVmYXVsdCBub3JtYWxpemVyIChpZiBzY2hlbWEgZG9lcyBub3QgZGVmaW5lIGl0J3Mgb3duKS5cbiAqKi9cbkxpbmtpZnlJdC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKG1hdGNoKSB7XG5cbiAgLy8gRG8gbWluaW1hbCBwb3NzaWJsZSBjaGFuZ2VzIGJ5IGRlZmF1bHQuIE5lZWQgdG8gY29sbGVjdCBmZWVkYmFjayBwcmlvclxuICAvLyB0byBtb3ZlIGZvcndhcmQgaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L2xpbmtpZnktaXQvaXNzdWVzLzFcblxuICBpZiAoIW1hdGNoLnNjaGVtYSkgeyBtYXRjaC51cmwgPSAnaHR0cDovLycgKyBtYXRjaC51cmw7IH1cblxuICBpZiAobWF0Y2guc2NoZW1hID09PSAnbWFpbHRvOicgJiYgIS9ebWFpbHRvOi9pLnRlc3QobWF0Y2gudXJsKSkge1xuICAgIG1hdGNoLnVybCA9ICdtYWlsdG86JyArIG1hdGNoLnVybDtcbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtpZnlJdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gVXNlIGRpcmVjdCBleHRyYWN0IGluc3RlYWQgb2YgYHJlZ2VuZXJhdGVgIHRvIHJlZHVzZSBicm93c2VyaWZpZWQgc2l6ZVxudmFyIHNyY19BbnkgPSBleHBvcnRzLnNyY19BbnkgPSByZXF1aXJlKCd1Yy5taWNyby9wcm9wZXJ0aWVzL0FueS9yZWdleCcpLnNvdXJjZTtcbnZhciBzcmNfQ2MgID0gZXhwb3J0cy5zcmNfQ2MgPSByZXF1aXJlKCd1Yy5taWNyby9jYXRlZ29yaWVzL0NjL3JlZ2V4Jykuc291cmNlO1xudmFyIHNyY19DZiAgPSBleHBvcnRzLnNyY19DZiA9IHJlcXVpcmUoJ3VjLm1pY3JvL2NhdGVnb3JpZXMvQ2YvcmVnZXgnKS5zb3VyY2U7XG52YXIgc3JjX1ogICA9IGV4cG9ydHMuc3JjX1ogID0gcmVxdWlyZSgndWMubWljcm8vY2F0ZWdvcmllcy9aL3JlZ2V4Jykuc291cmNlO1xudmFyIHNyY19QICAgPSBleHBvcnRzLnNyY19QICA9IHJlcXVpcmUoJ3VjLm1pY3JvL2NhdGVnb3JpZXMvUC9yZWdleCcpLnNvdXJjZTtcblxuLy8gXFxwe1xcWlxcUFxcQ2NcXENGfSAod2hpdGUgc3BhY2VzICsgY29udHJvbCArIGZvcm1hdCArIHB1bmN0dWF0aW9uKVxudmFyIHNyY19aUENjQ2YgPSBleHBvcnRzLnNyY19aUENjQ2YgPSBbIHNyY19aLCBzcmNfUCwgc3JjX0NjLCBzcmNfQ2YgXS5qb2luKCd8Jyk7XG5cbi8vIEFsbCBwb3NzaWJsZSB3b3JkIGNoYXJhY3RlcnMgKGV2ZXJ5dGhpbmcgd2l0aG91dCBwdW5jdHVhdGlvbiwgc3BhY2VzICYgY29udHJvbHMpXG4vLyBEZWZpbmVkIHZpYSBwdW5jdHVhdGlvbiAmIHNwYWNlcyB0byBzYXZlIHNwYWNlXG4vLyBTaG91bGQgYmUgc29tZXRoaW5nIGxpa2UgXFxwe1xcTFxcTlxcU1xcTX0gKFxcdyBidXQgd2l0aG91dCBgX2ApXG52YXIgc3JjX3BzZXVkb19sZXR0ZXIgICAgICAgPSAnKD86KD8hJyArIHNyY19aUENjQ2YgKyAnKScgKyBzcmNfQW55ICsgJyknO1xuLy8gVGhlIHNhbWUgYXMgYWJvdGhlIGJ1dCB3aXRob3V0IFswLTldXG52YXIgc3JjX3BzZXVkb19sZXR0ZXJfbm9uX2QgPSAnKD86KD8hWzAtOV18JyArIHNyY19aUENjQ2YgKyAnKScgKyBzcmNfQW55ICsgJyknO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgc3JjX2lwNCA9IGV4cG9ydHMuc3JjX2lwNCA9XG5cbiAgJyg/OigyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFxcXC4pezN9KDI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPyknO1xuXG5leHBvcnRzLnNyY19hdXRoICAgID0gJyg/Oig/Oig/IScgKyBzcmNfWiArICcpLikrQCk/JztcblxudmFyIHNyY19wb3J0ID0gZXhwb3J0cy5zcmNfcG9ydCA9XG5cbiAgJyg/OjooPzo2KD86WzAtNF1cXFxcZHszfXw1KD86WzAtNF1cXFxcZHsyfXw1KD86WzAtMl1cXFxcZHwzWzAtNV0pKSl8WzEtNV0/XFxcXGR7MSw0fSkpPyc7XG5cbnZhciBzcmNfaG9zdF90ZXJtaW5hdG9yID0gZXhwb3J0cy5zcmNfaG9zdF90ZXJtaW5hdG9yID1cblxuICAnKD89JHwnICsgc3JjX1pQQ2NDZiArICcpKD8hLXxffDpcXFxcZHxcXFxcLi18XFxcXC4oPyEkfCcgKyBzcmNfWlBDY0NmICsgJykpJztcblxudmFyIHNyY19wYXRoID0gZXhwb3J0cy5zcmNfcGF0aCA9XG5cbiAgJyg/OicgK1xuICAgICdbLz8jXScgK1xuICAgICAgJyg/OicgK1xuICAgICAgICAnKD8hJyArIHNyY19aICsgJ3xbKClbXFxcXF17fS4sXCJcXCc/IVxcXFwtXSkufCcgK1xuICAgICAgICAnXFxcXFsoPzooPyEnICsgc3JjX1ogKyAnfFxcXFxdKS4pKlxcXFxdfCcgK1xuICAgICAgICAnXFxcXCgoPzooPyEnICsgc3JjX1ogKyAnfFspXSkuKSpcXFxcKXwnICtcbiAgICAgICAgJ1xcXFx7KD86KD8hJyArIHNyY19aICsgJ3xbfV0pLikqXFxcXH18JyArXG4gICAgICAgICdcXFxcXCIoPzooPyEnICsgc3JjX1ogKyAnfFtcIl0pLikrXFxcXFwifCcgK1xuICAgICAgICBcIlxcXFwnKD86KD8hXCIgKyBzcmNfWiArIFwifFsnXSkuKStcXFxcJ3xcIiArXG4gICAgICAgIFwiXFxcXCcoPz1cIiArIHNyY19wc2V1ZG9fbGV0dGVyICsgJykufCcgKyAgLy8gYWxsb3cgYEknbV9raW5nYCBpZiBubyBwYWlyIGZvdW5kXG4gICAgICAgICdcXFxcLig/IScgKyBzcmNfWiArICd8Wy5dKS58JyArXG4gICAgICAgICdcXFxcLSg/IScgKyBzcmNfWiArICd8LS0oPzpbXi1dfCQpKSg/OlstXSt8Lil8JyArICAvLyBgLS0tYCA9PiBsb25nIGRhc2gsIHRlcm1pbmF0ZVxuICAgICAgICAnXFxcXCwoPyEnICsgc3JjX1ogKyAnKS58JyArICAgICAgLy8gYWxsb3cgYCwsLGAgaW4gcGF0aHNcbiAgICAgICAgJ1xcXFwhKD8hJyArIHNyY19aICsgJ3xbIV0pLnwnICtcbiAgICAgICAgJ1xcXFw/KD8hJyArIHNyY19aICsgJ3xbP10pLicgK1xuICAgICAgJykrJyArXG4gICAgJ3xcXFxcLycgK1xuICAnKT8nO1xuXG52YXIgc3JjX2VtYWlsX25hbWUgPSBleHBvcnRzLnNyY19lbWFpbF9uYW1lID1cblxuICAnW1xcXFwtOzomPVxcXFwrXFxcXCQsXFxcXFwiXFxcXC5hLXpBLVowLTlfXSsnO1xuXG52YXIgc3JjX3huID0gZXhwb3J0cy5zcmNfeG4gPVxuXG4gICd4bi0tW2EtejAtOVxcXFwtXXsxLDU5fSc7XG5cbi8vIE1vcmUgdG8gcmVhZCBhYm91dCBkb21haW4gbmFtZXNcbi8vIGh0dHA6Ly9zZXJ2ZXJmYXVsdC5jb20vcXVlc3Rpb25zLzYzODI2MC9cblxudmFyIHNyY19kb21haW5fcm9vdCA9IGV4cG9ydHMuc3JjX2RvbWFpbl9yb290ID1cblxuICAvLyBDYW4ndCBoYXZlIGRpZ2l0cyBhbmQgZGFzaGVzXG4gICcoPzonICtcbiAgICBzcmNfeG4gK1xuICAgICd8JyArXG4gICAgc3JjX3BzZXVkb19sZXR0ZXJfbm9uX2QgKyAnezEsNjN9JyArXG4gICcpJztcblxudmFyIHNyY19kb21haW4gPSBleHBvcnRzLnNyY19kb21haW4gPVxuXG4gICcoPzonICtcbiAgICBzcmNfeG4gK1xuICAgICd8JyArXG4gICAgJyg/OicgKyBzcmNfcHNldWRvX2xldHRlciArICcpJyArXG4gICAgJ3wnICtcbiAgICAvLyBkb24ndCBhbGxvdyBgLS1gIGluIGRvbWFpbiBuYW1lcywgYmVjYXVzZTpcbiAgICAvLyAtIHRoYXQgY2FuIGNvbmZsaWN0IHdpdGggbWFya2Rvd24gJm1kYXNoOyAvICZuZGFzaDtcbiAgICAvLyAtIG5vYm9keSB1c2UgdGhvc2UgYW55d2F5XG4gICAgJyg/OicgKyBzcmNfcHNldWRvX2xldHRlciArICcoPzotKD8hLSl8JyArIHNyY19wc2V1ZG9fbGV0dGVyICsgJyl7MCw2MX0nICsgc3JjX3BzZXVkb19sZXR0ZXIgKyAnKScgK1xuICAnKSc7XG5cbnZhciBzcmNfaG9zdCA9IGV4cG9ydHMuc3JjX2hvc3QgPVxuXG4gICcoPzonICtcbiAgICBzcmNfaXA0ICtcbiAgJ3wnICtcbiAgICAnKD86KD86KD86JyArIHNyY19kb21haW4gKyAnKVxcXFwuKSonICsgc3JjX2RvbWFpbl9yb290ICsgJyknICtcbiAgJyknO1xuXG52YXIgdHBsX2hvc3RfZnV6enkgPSBleHBvcnRzLnRwbF9ob3N0X2Z1enp5ID1cblxuICAnKD86JyArXG4gICAgc3JjX2lwNCArXG4gICd8JyArXG4gICAgJyg/Oig/Oig/OicgKyBzcmNfZG9tYWluICsgJylcXFxcLikrKD86JVRMRFMlKSknICtcbiAgJyknO1xuXG5leHBvcnRzLnNyY19ob3N0X3N0cmljdCA9XG5cbiAgc3JjX2hvc3QgKyBzcmNfaG9zdF90ZXJtaW5hdG9yO1xuXG52YXIgdHBsX2hvc3RfZnV6enlfc3RyaWN0ID0gZXhwb3J0cy50cGxfaG9zdF9mdXp6eV9zdHJpY3QgPVxuXG4gIHRwbF9ob3N0X2Z1enp5ICsgc3JjX2hvc3RfdGVybWluYXRvcjtcblxuZXhwb3J0cy5zcmNfaG9zdF9wb3J0X3N0cmljdCA9XG5cbiAgc3JjX2hvc3QgKyBzcmNfcG9ydCArIHNyY19ob3N0X3Rlcm1pbmF0b3I7XG5cbnZhciB0cGxfaG9zdF9wb3J0X2Z1enp5X3N0cmljdCA9IGV4cG9ydHMudHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgPVxuXG4gIHRwbF9ob3N0X2Z1enp5ICsgc3JjX3BvcnQgKyBzcmNfaG9zdF90ZXJtaW5hdG9yO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gTWFpbiBydWxlc1xuXG4vLyBSdWRlIHRlc3QgZnV6enkgbGlua3MgYnkgaG9zdCwgZm9yIHF1aWNrIGRlbnlcbmV4cG9ydHMudHBsX2hvc3RfZnV6enlfdGVzdCA9XG5cbiAgJ2xvY2FsaG9zdHxcXFxcLlxcXFxkezEsM31cXFxcLnwoPzpcXFxcLig/OiVUTERTJSkoPzonICsgc3JjX1pQQ2NDZiArICd8JCkpJztcblxuZXhwb3J0cy50cGxfZW1haWxfZnV6enkgPVxuXG4gICAgJyhefD58JyArIHNyY19aICsgJykoJyArIHNyY19lbWFpbF9uYW1lICsgJ0AnICsgdHBsX2hvc3RfZnV6enlfc3RyaWN0ICsgJyknO1xuXG5leHBvcnRzLnRwbF9saW5rX2Z1enp5ID1cbiAgICAvLyBGdXp6eSBsaW5rIGNhbid0IGJlIHByZXBlbmRlZCB3aXRoIC46L1xcLSBhbmQgbm9uIHB1bmN0dWF0aW9uLlxuICAgIC8vIGJ1dCBjYW4gc3RhcnQgd2l0aCA+IChtYXJrZG93biBibG9ja3F1b3RlKVxuICAgICcoXnwoPyFbLjovXFxcXC1fQF0pKD86WyQrPD0+XmB8XXwnICsgc3JjX1pQQ2NDZiArICcpKScgK1xuICAgICcoKD8hWyQrPD0+XmB8XSknICsgdHBsX2hvc3RfcG9ydF9mdXp6eV9zdHJpY3QgKyBzcmNfcGF0aCArICcpJztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gdGhlIG1ham9yaXR5IG9mIHRoaXMgZmlsZSB3YXMgdGFrZW4gZnJvbSBtYXJrZG93bi1pdCdzIGxpbmtpZnkgbWV0aG9kXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQvYmxvYi85MTU5MDE4ZTJhNDQ2ZmM5N2ViM2M2ZTUwOWE4Y2RjNGNjM2MzNThhL2xpYi9ydWxlc19jb3JlL2xpbmtpZnkuanNcblxudmFyIGxpbmtpZnkgPSByZXF1aXJlKCdsaW5raWZ5LWl0JykoKTtcblxuZnVuY3Rpb24gYXJyYXlSZXBsYWNlQXQgKGEsIGksIG1pZGRsZSkge1xuICB2YXIgbGVmdCA9IGEuc2xpY2UoMCwgaSk7XG4gIHZhciByaWdodCA9IGEuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbGVmdC5jb25jYXQobWlkZGxlLCByaWdodCk7XG59XG5cbmZ1bmN0aW9uIGlzTGlua09wZW4gKHN0cikge1xuICByZXR1cm4gL148YVs+XFxzXS9pLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gaXNMaW5rQ2xvc2UgKHN0cikge1xuICByZXR1cm4gL148XFwvYVxccyo+L2kudGVzdChzdHIpO1xufVxuXG5mdW5jdGlvbiB0b2tlbml6ZUxpbmtzIChzdGF0ZSwgY29udGV4dCkge1xuICB2YXIgaTtcbiAgdmFyIGo7XG4gIHZhciBsO1xuICB2YXIgdG9rZW5zO1xuICB2YXIgdG9rZW47XG4gIHZhciBub2RlcztcbiAgdmFyIGxuO1xuICB2YXIgdGV4dDtcbiAgdmFyIHBvcztcbiAgdmFyIGxhc3RQb3M7XG4gIHZhciBsZXZlbDtcbiAgdmFyIGxpbmtzO1xuICB2YXIgaHRtbExpbmtMZXZlbDtcbiAgdmFyIGJsb2NrVG9rZW5zID0gc3RhdGUudG9rZW5zO1xuICB2YXIgaHRtbDtcblxuICBmb3IgKGogPSAwLCBsID0gYmxvY2tUb2tlbnMubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgaWYgKGJsb2NrVG9rZW5zW2pdLnR5cGUgIT09ICdpbmxpbmUnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB0b2tlbnMgPSBibG9ja1Rva2Vuc1tqXS5jaGlsZHJlbjtcbiAgICBodG1sTGlua0xldmVsID0gMDtcblxuICAgIC8vIHdlIHNjYW4gZnJvbSB0aGUgZW5kLCB0byBrZWVwIHBvc2l0aW9uIHdoZW4gbmV3IHRhZ3MgYWRkZWQuXG4gICAgLy8gdXNlIHJldmVyc2VkIGxvZ2ljIGluIGxpbmtzIHN0YXJ0L2VuZCBtYXRjaFxuICAgIGZvciAoaSA9IHRva2Vucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIC8vIHNraXAgY29udGVudCBvZiBtYXJrZG93biBsaW5rc1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdsaW5rX2Nsb3NlJykge1xuICAgICAgICBpLS07XG4gICAgICAgIHdoaWxlICh0b2tlbnNbaV0ubGV2ZWwgIT09IHRva2VuLmxldmVsICYmIHRva2Vuc1tpXS50eXBlICE9PSAnbGlua19vcGVuJykge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdodG1sX2lubGluZScpIHsgLy8gc2tpcCBjb250ZW50IG9mIGh0bWwgdGFnIGxpbmtzXG4gICAgICAgIGlmIChpc0xpbmtPcGVuKHRva2VuLmNvbnRlbnQpICYmIGh0bWxMaW5rTGV2ZWwgPiAwKSB7XG4gICAgICAgICAgaHRtbExpbmtMZXZlbC0tO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0xpbmtDbG9zZSh0b2tlbi5jb250ZW50KSkge1xuICAgICAgICAgIGh0bWxMaW5rTGV2ZWwrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGh0bWxMaW5rTGV2ZWwgPiAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICd0ZXh0JyB8fCAhbGlua2lmeS50ZXN0KHRva2VuLmNvbnRlbnQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0ZXh0ID0gdG9rZW4uY29udGVudDtcbiAgICAgIGxpbmtzID0gbGlua2lmeS5tYXRjaCh0ZXh0KTtcbiAgICAgIG5vZGVzID0gW107XG4gICAgICBsZXZlbCA9IHRva2VuLmxldmVsO1xuICAgICAgbGFzdFBvcyA9IDA7XG5cbiAgICAgIGZvciAobG4gPSAwOyBsbiA8IGxpbmtzLmxlbmd0aDsgbG4rKykgeyAvLyBzcGxpdCBzdHJpbmcgdG8gbm9kZXNcbiAgICAgICAgaWYgKCFzdGF0ZS5tZC5pbmxpbmUudmFsaWRhdGVMaW5rKGxpbmtzW2xuXS51cmwpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MgPSBsaW5rc1tsbl0uaW5kZXg7XG5cbiAgICAgICAgaWYgKHBvcyA+IGxhc3RQb3MpIHtcbiAgICAgICAgICBsZXZlbCA9IGxldmVsO1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgY29udGVudDogdGV4dC5zbGljZShsYXN0UG9zLCBwb3MpLFxuICAgICAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBodG1sID0gbnVsbDtcblxuICAgICAgICBjb250ZXh0LmxpbmtpZmllcnMuc29tZShydW5Vc2VyTGlua2lmaWVyKTtcblxuICAgICAgICBpZiAodHlwZW9mIGh0bWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnaHRtbF9ibG9jaycsXG4gICAgICAgICAgICBjb250ZW50OiBodG1sLFxuICAgICAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnbGlua19vcGVuJyxcbiAgICAgICAgICAgIGhyZWY6IGxpbmtzW2xuXS51cmwsXG4gICAgICAgICAgICB0YXJnZXQ6ICcnLFxuICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgbGV2ZWw6IGxldmVsKytcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGxpbmtzW2xuXS50ZXh0LFxuICAgICAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnbGlua19jbG9zZScsXG4gICAgICAgICAgICBsZXZlbDogLS1sZXZlbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFBvcyA9IGxpbmtzW2xuXS5sYXN0SW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXN0UG9zIDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIGNvbnRlbnQ6IHRleHQuc2xpY2UobGFzdFBvcyksXG4gICAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBibG9ja1Rva2Vuc1tqXS5jaGlsZHJlbiA9IHRva2VucyA9IGFycmF5UmVwbGFjZUF0KHRva2VucywgaSwgbm9kZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1blVzZXJMaW5raWZpZXIgKGxpbmtpZmllcikge1xuICAgIGh0bWwgPSBsaW5raWZpZXIobGlua3NbbG5dLnVybCwgbGlua3NbbG5dLnRleHQpO1xuICAgIHJldHVybiB0eXBlb2YgaHRtbCA9PT0gJ3N0cmluZyc7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b2tlbml6ZUxpbmtzO1xuIl19
