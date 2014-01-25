var mock = require('./helper.js');
var test = require('tap').test;
var RedditWrapper = require('../index.js');

var wrap = new RedditWrapper({
  parseJson: true
});

test('getting subreddit listings', function(t) {
  var subredditMock = mock('/subreddits/popular.json?limit=100');
  wrap.subreddits({
    type: 'popular'
  }, function(err, resp, body) {
    t.ok(subredditMock.isDone());
    t.end();
  });
});

