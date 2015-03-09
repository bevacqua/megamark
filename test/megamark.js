'use strict';

var fs = require('fs');
var test = require('tape');
var megamark = require('..');

function read (name) {
  return fs.readFileSync('./test/fixtures/' + name, 'utf8');
}

test('empty doesn\'t blow up', function (t) {
  t.equal(megamark(), '');
  t.end();
});

test('code snippets work as expected', function (t) {
  t.equal(megamark(read('code-snippets.md')), read('code-snippets.html'));
  t.end();
});

test('emphasis works as expected', function (t) {
  t.equal(megamark(read('barkup.md')), read('barkup.html'));
  t.end();
});

test('parsing of ponyfoo articles works as expected', function (t) {
  t.equal(megamark(read('stop-breaking-the-web.md')), read('stop-breaking-the-web.html'));
  t.equal(megamark(read('cross-tab-communication.md')), read('cross-tab-communication.html'));
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

test('tokenizing links allows me to return no content', function (t) {
  t.equal(megamark('ponyfoo.com', { linkifiers: [linkify] }), '<p></p>\n');
  t.end();
  function linkify (href, text) {
    return '';
  }
});

test('tokenizing links allows me to return plain text content', function (t) {
  t.equal(megamark('ponyfoo.com', { linkifiers: [linkify] }), '<p>@ponyfoo</p>\n');
  t.end();
  function linkify (href, text) {
    return '@' + text.split('.').shift();
  }
});

test('tokenizing links allows me to return any tags I want', function (t) {
  t.equal(megamark('ponyfoo.com', { linkifiers: [linkify] }), '<p><em>http://ponyfoo.com</em></p>\n');
  t.end();
  function linkify (href, text) {
    return '<em>' + href + '</em>';
  }
});

test('tokenizing links allows me to ignore _some_ things', function (t) {
  t.equal(megamark('ponyfoo.com google.com', { linkifiers: [linkify] }), '<p><em>http://ponyfoo.com</em> </p>\n');
  t.end();
  function linkify (href, text) {
    if (/\/\/google\.com/.test(href)) {
      return '';
    }
    return '<em>' + href + '</em>';
  }
});

test('tokenizing links allows me to return any tags I want', function (t) {
  t.equal(megamark('http://localhost:9000/bevacqua/stompflow/issues/28', { linkifiers: [linkify] }), '<p><a href="http://localhost:9000/bevacqua/stompflow/issues/28">#28</a></p>\n');
  t.end();
  function linkify (href, text) {
    return '<a href=' + href + '>#' + href.split('/').pop() + '</a>';
  }
});

test('tokenizing links doesn\'t break protocol', function (t) {
  t.equal(megamark('//localhost:9000/bevacqua/stompflow/issues/28', { linkifiers: [linkify] }), '<p><a href="//localhost:9000/bevacqua/stompflow/issues/28">#28</a></p>\n');
  t.end();
  function linkify (href, text) {
    return '<a href=' + href + '>#' + href.split('/').pop() + '</a>';
  }
});

test('tokenizing links doesn\'t break protocol', function (t) {
  t.equal(megamark('www.stompflow.com/bevacqua/stompflow/issues/28', { linkifiers: [linkify] }), '<p><a href="http://www.stompflow.com/bevacqua/stompflow/issues/28">#28</a></p>\n');
  t.end();
  function linkify (href, text) {
    return '<a href=' + href + '>#' + href.split('/').pop() + '</a>';
  }
});

test('tokenizing links doesn\'t break protocol', function (t) {
  t.equal(megamark('https://localhost:9000/bevacqua/stompflow/issues/28', { linkifiers: [linkify] }), '<p><a href="https://localhost:9000/bevacqua/stompflow/issues/28">#28</a></p>\n');
  t.end();
  function linkify (href, text) {
    return '<a href=' + href + '>#' + href.split('/').pop() + '</a>';
  }
});

test('italics work as expected', function (t) {
  t.equal(megamark('_some_'), '<p><em>some</em></p>\n');
  t.equal(megamark('_(some)_'), '<p><em>(some)</em></p>\n');
  t.equal(megamark('_(#)_'), '<p><em>(#)</em></p>\n');
  t.equal(megamark('_(#)_.'), '<p><em>(#)</em>.</p>\n');
  t.equal(megamark('_(#)_.', {}), '<p><em>(#)</em>.</p>\n');
  t.end();
});
