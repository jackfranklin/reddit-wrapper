var request = require('request');
var _ = require('underscore');
var mongoose = require('mongoose');


var RedditWrapper = function(options) {
  this.accessToken = options.accessToken;
  this.includeAuthHeader = options || true;
  if(options.cache != undefined) {
    this.cache = options.cache;
  } else {
    this.cache = false;
  }
  if(this.cache) this.initCache(options.cacheConnection);
};

RedditWrapper.prototype.initCache = function(conn) {
  mongoose.connect(conn);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  this.Cache = require('./cache.js');
};

var makeRequest = function(options, cb) {
  request(options, function(err, resp, body) {
    if(err) throw(err);
    var jsonBody = JSON.parse(body);
    cb.call(null, err, resp, jsonBody);
  }.bind(this));
};

RedditWrapper.prototype._callUrl = function(options, callback) {
  var targetUrl;
  if(options && options.oauth) {
    var baseUrl = 'https://oauth.reddit.com';
    options.url = baseUrl + options.url;
    options.headers = options.headers || {};
    options.headers["Authorization"] = 'bearer ' + this.accessToken;
  }
  if(!this.cache) return makeRequest(options, callback);
  this.Cache.findOne({ url: options.url }, function(e, cache) {
    if(cache && cache.notExpired()) return callback(null, null, cache.data);

    request(options, function(err, resp, body) {
      if(err) throw(err);
      var jsonBody = JSON.parse(body);

      if(cache) {
        this.Cache.update({ url: options.url }, { date: Date.now(), data: jsonBody }, function() {
          callback.call(null, err, resp, jsonBody);
        });
      } else {
        new this.Cache({ url: options.url, data: jsonBody }).save(function(e, cache) {
          callback.call(null, err, resp, jsonBody);
        });
      }
    }.bind(this));
  }.bind(this));
};


RedditWrapper.prototype.me = function(callback) {
  this._callUrl({
    url: '/api/v1/me',
    oauth: true
  }, callback);
};

RedditWrapper.prototype.subreddits = function(options, callback) {
  var limit = options.limit || 100;
  var type = options.category || 'popular';
  this._callUrl({
    url: 'http://www.reddit.com/subreddits/' + type + '.json?limit=' + limit
  }, callback);
}
RedditWrapper.prototype.listing = function(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = null;
  }
  var category = (options && options.category) || 'hot';
  if(options && options.category) delete options.category;
  if(!options || !options.subReddit) {
    this._callUrl({
      url: 'http://www.reddit.com/' + category + '.json'
    }, callback);
  } else {
    var newOptions = {
      url: 'http://www.reddit.com/r/' + options.subReddit + '/' + category + '.json'
    };
    delete options.subReddit;
    this._callUrl({
      url: newOptions.url,
      qs: options
    }, callback);
  }
};


module.exports = RedditWrapper;
