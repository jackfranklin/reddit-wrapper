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
  if(this.cache) this.CACHE_FN = options.cacheFn;
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
  this.CACHE_FN({
    url: options.url,
    callback: callback,
    request: options
  });
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
