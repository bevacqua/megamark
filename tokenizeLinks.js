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
