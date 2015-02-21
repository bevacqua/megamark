'use strict';

var fs = require('fs');
var test = require('tape');
var megamark = require('..');
var stop = read('stop-breaking-the-web.md');
var stopExpected = read('stop-breaking-the-web.html');
var cross = read('cross-tab-communication.md');
var crossExpected = read('cross-tab-communication.html');
var snippets = read('code-snippets.md');
var snippetsExpected = read('code-snippets.html');

function read (name) {
  return fs.readFileSync('./test/fixtures/' + name, 'utf8');
}

test('empty doesn\'t blow up', function (t) {
  t.equal(megamark(), '');
  t.end();
});

test('code snippets work as expected', function (t) {
  t.equal(megamark(snippets), snippetsExpected);
  t.end();
});

test('parsing of ponyfoo articles works as expected', function (t) {
  t.equal(megamark(stop), stopExpected);
  t.equal(megamark(cross), crossExpected);
  t.end();
});

test('tokenizing works as expected', function (t) {
  t.equal(megamark('_@bevacqua_', { tokenizers: [{ token: /(?:^|\s)@([A-z]+)\b/, transform: transform }] }), '<p><em>BEVACQUA</em></p>\n');
  t.end();
  function transform (text, username) {
    return username.toUpperCase();
  }
});

test('tokenizer ignores encoding by default', function (t) {
  t.equal(megamark('_@bevacqua_', { tokenizers: [{ token: /(?:^|\s)@([A-z]+)\b/, transform: transform }] }), '<p><em><a href="/users/bevacqua">BEVACQUA</a></em></p>\n');
  t.end();
  function transform (text, username) {
    return '<a href="/users/' + username + '">' + username.toUpperCase() + '</a>';
  }
});

test('markdown defaults to ignoring hazardous elements, but that can be overridden', function (t) {
  t.equal(megamark('<iframe>foo</iframe>'), '');
  t.equal(megamark('<script>foo</script>'), '');
  t.equal(megamark('<style>foo</style>'), '');
  t.equal(megamark('<iframe>foo</iframe>', { sanitizer: { allowedTags: ['iframe'] } }), '<iframe>foo</iframe>');
  t.end();
  function transform (text, username) {
    return username.toUpperCase();
  }
});
