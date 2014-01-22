var mock = require('./helper.js');
var test = require('tap').test;
var RedditWrapper = require('../index.js');

var wrap = new RedditWrapper({
  parseJson: true
});

var indexHot = mock('/hot.json');

test('getting homepage hot listings', function(t) {
  wrap.listing(function(err, resp, body) {
    t.deepEqual(body, {
      data: true
    }, 'the response is as expected');
    t.end();
  });
});

test('passing a category', function(t) {
  var indexNew = mock('/new.json');
  wrap.listing({
    category: 'new'
  }, function(err, resp, body) {
    t.ok(indexNew.isDone(), 'it made the right API request');
    t.end();
  });
});

test('passing a subreddit but not category', function(t) {
  var vimHot = mock('/r/vim/hot.json');
  wrap.listing({ subReddit: 'vim' }, function(err, resp, body) {
    t.ok(vimHot.isDone(), 'it made the right API request');
    t.end();
  });
});

test('passing subreddit and category', function(t) {
  var vimNew = mock('/r/vim/new.json');
  wrap.listing({ subReddit: 'vim', category: 'new' }, function(err, resp, body) {
    t.ok(vimNew.isDone(), 'it made the right API request');
    t.end();
  });

});
