var request = require('request');

var RedditWrapper = function(options) {
  this.accessToken = options.accessToken;
  this.includeAuthHeader = options || true;
};

RedditWrapper.prototype._callUrl = function(options, callback) {
  var baseUrl = 'https://oauth.reddit.com';
  var targetUrl = baseUrl + options.url;
  options.url = targetUrl;
  if(this.includeAuthHeader) {
    options.headers = options.headers || {};
    options.headers["Authorization"] = 'bearer ' + this.accessToken;
  }
  request(options, callback);
};


RedditWrapper.prototype.me = function(callback) {
  this._callUrl({
    url: '/api/v1/me'
  }, callback);
};


module.exports = RedditWrapper;
