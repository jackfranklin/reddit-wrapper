var request = require('request');

var RedditWrapper = function(options) {
  this.accessToken = options.accessToken;
  this.includeAuthHeader = options || true;
};

RedditWrapper.prototype._callUrl = function(options, callback) {
  var baseUrl = 'https://oauth.reddit.com';
  var targetUrl = options.fullUrl || (baseUrl + options.url);
  console.log(targetUrl);
  options.url = targetUrl;
  if(options.authHeader) {
    options.headers = options.headers || {};
    options.headers["Authorization"] = 'bearer ' + this.accessToken;
  }
  delete options.authHeader;
  request(options, callback);
};


RedditWrapper.prototype.me = function(callback) {
  this._callUrl({
    url: '/api/v1/me',
    authHeader: true
  }, callback);
};

RedditWrapper.prototype.listing = function(options, callback) {
  if(typeof options == 'function') {
    callback = options;
    options = null;
  }
  if(!options || !options.subReddit) {
    this._callUrl({
      fullUrl: 'http://www.reddit.com/hot.json'
    }, callback);
  } else {
    this._callUrl({
      fullUrl: 'http://www.reddit.com/r/' + options.subReddit + '/' + options.category + '.json'
    }, callback);
  }
};


module.exports = RedditWrapper;
