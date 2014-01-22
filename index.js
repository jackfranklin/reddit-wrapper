var request = require('request');

var RedditWrapper = function(options) {
  this.accessToken = options.accessToken;
  this.shouldParseJson = options.parseJson || false;
  this.includeAuthHeader = options || true;
};

RedditWrapper.prototype._callUrl = function(options, callback) {
  var targetUrl;
  if(options && options.oauth) {
    var baseUrl = 'https://oauth.reddit.com';
    options.url = baseUrl + options.url;
    options.headers = options.headers || {};
    options.headers["Authorization"] = 'bearer ' + this.accessToken;
  }
  if(this.shouldParseJson) {
    request(options, function(err, resp, body) {
      if(err) throw(err);
      var jsonBody = JSON.parse(body);
      callback.call(null, err, resp, jsonBody);
    });
  } else {
    request(options, callback);
  }
};


RedditWrapper.prototype.me = function(callback) {
  this._callUrl({
    url: '/api/v1/me',
    oauth: true
  }, callback);
};

RedditWrapper.prototype.listing = function(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = null;
  }
  var category = (options && options.category) || 'hot';
  if(!options || !options.subReddit) {
    this._callUrl({
      url: 'http://www.reddit.com/' + category + '.json'
    }, callback);
  } else {
    this._callUrl({
      url: 'http://www.reddit.com/r/' + options.subReddit + '/' + category + '.json'
    }, callback);
  }
};


module.exports = RedditWrapper;
