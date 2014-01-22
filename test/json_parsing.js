require('./helper.js');
var test = require('tap').test;
var RedditWrapper = require('../index.js');

var wrap = new RedditWrapper({});
test('getting homepage hot listings', function(t) {
  t.test('it should return raw string by default', function(t) {
    wrap.listing(function(err, resp, body) {
      t.equal(typeof body, 'string', 'data should not be json parsed');
      t.end();
    });
  });

  t.test('it should parse JSON if flag set', function(t) {
    wrap.shouldParseJson = true;
    wrap.listing(function(err, resp, body) {
      t.equal(typeof body, 'object', 'data has been json parsed');
      t.end();
    });
  });
  t.end();
});

