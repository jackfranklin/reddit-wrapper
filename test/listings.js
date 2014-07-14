var mock = require('./helper.js');
var test = require('tap').test;
var RedditWrapper = require('../index.js');
var expect = require('expect.js');

var wrap = new RedditWrapper({
  parseJson: true
});


describe('listings', function() {
  it('returns the right thing', function(done) {
    var indexHot = mock('/hot.json');
    wrap.listing(function(err, resp, body) {
      expect(body).to.eql({ data: true });
      done();
    });
  });

  it('can deal with categories', function(done) {
    var indexNew = mock('/new.json');
    wrap.listing({
      category: 'new'
    }, function(err, resp, body) {
      expect(indexNew.isDone()).to.eql(true);
      done();
    });
  });

  it('can be passed a subreddit but not category', function(done) {
    var vimHot = mock('/r/vim/hot.json');
    wrap.listing({ subReddit: 'vim' }, function(err, resp, body) {
      expect(vimHot.isDone()).to.eql(true);
      done();
    });
  });

  it('can be passed subreddit and category', function(done) {
    var vimNew = mock('/r/vim/new.json');
    wrap.listing({ subReddit: 'vim', category: 'new' }, function(err, resp, body) {
      expect(vimNew.isDone()).to.eql(true);
      done();
    });
  });

  it('can be passed an after parameter', function(done) {
    var vimNew = mock('/r/vim/hot.json?after=foo');
    wrap.listing({
      subReddit: 'vim',
      after: 'foo'
    }, function(err, resp, body) {
      expect(vimNew.isDone()).to.eql(true);
      done();
    });
  });
});

