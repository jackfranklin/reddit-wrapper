var mock = require('./helper.js');
var RedditWrapper = require('../index.js');

var Cache = require('../cache.js');
var expect = require('expect.js');
var nock = require('nock');
var timekeeper = require('timekeeper');


var wrap = new RedditWrapper({
  cache: true,
  cacheConnection: 'mongodb://localhost/redditwrappertest',
  parseJson: true
});

beforeEach(function(done) {
  Cache.remove({}, done);
});

describe('caching', function() {
  it('makes a cache object on first request', function(done) {
    var indexHot = mock('/hot.json');
    wrap.listing(function(err, resp, body) {
      Cache.findOne({ url: 'http://www.reddit.com/hot.json' }, function(e, cache) {
        expect(cache).to.be.ok();
        expect(cache.data).to.eql({ data: true });
        expect(indexHot.isDone()).to.be(true);
        done();
      });
    });
  });

  it('uses the cache if it has not expired', function(done) {
    var indexHot = mock('/hot.json');
    new Cache({ url: 'http://www.reddit.com/hot.json', data: { foo: 2 } }).save(function(e, cache) {
      wrap.listing(function(err, resp, body) {
        expect(indexHot.isDone()).to.be(false);
        done();
      });
    });
    nock.cleanAll();
  });

  it('does not use the cache if it is expired', function(done) {
    var indexHot = mock('/hot.json');
    new Cache({ url: 'http://www.reddit.com/hot.json', data: { foo: 2 } }).save(function(e, cache) {
      var now = new Date(Date.now());
      var twoHoursLater = now.setHours(now.getHours() + 2);
      timekeeper.freeze(twoHoursLater); // Travel to that date.

      wrap.listing(function(err, resp, body) {
        expect(cache.hasExpired()).to.eql(true);
        expect(indexHot.isDone()).to.be(true);
        timekeeper.reset();
        done();
      });
    });
  });
});
