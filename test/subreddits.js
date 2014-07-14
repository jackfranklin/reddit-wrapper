var mock = require('./helper.js');
var test = require('tap').test;
var RedditWrapper = require('../index.js');

var wrap = new RedditWrapper({
  parseJson: true
});

var expect = require('expect.js');

describe('getting subreddit listings', function() {
  it('gets subreddit listings', function(done) {
    var subredditMock = mock('/subreddits/popular.json?limit=100');
    wrap.subreddits({
      type: 'popular'
    }, function(err, resp, body) {
      expect(subredditMock.isDone()).to.eql(true);
      done();
    });
  });

});
