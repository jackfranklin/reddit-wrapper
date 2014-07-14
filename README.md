# Reddit-Wrapper

A very simple wrapper around Reddit's API, built for an on going side project. Currently has a very, very slim API, but as I need it more I'll develop out the API.

## Usage

Primary use at the moment is to get listings:

```js
var wrap = new RedditWrapper();
wrap.listing({
    subReddit: 'vim', // leave out to get posts from home page
    category: 'new' // leave out to get 'hot' posts (usually what you want)
}, function(err, resp, body) {
    // body is the JSON response, parsed into a json object
});
```

It also does caching, although that's only supported through MongoDB right now.

## Todo
There's lots missing here. Most importantly:
- all listings just return the first set. Need to be able to page through content
- make the methods return promises, as an alternative to callbacks.
