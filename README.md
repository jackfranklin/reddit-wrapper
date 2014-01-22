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
    // body contains the raw string response
});
```

By default, the wrapper just pushes your callbacks through to the Request callback, so you don't get the body text parsed into JSON for you. However, if you'd like that behaviour, simply pass it in as an option when creating the wrapper:

```js
var wrap = new RedditWrapper({
    parseJson: true
});
```

Now the wrapper will attempt to parse every response to a JavaScript object:

```js
var wrap = new RedditWrapper({
    parseJson: true
});

// with no options, default listing is the content of Reddit's homepage
wrap.listing(function(err, resp, body) {
    // with parseJson: true, body is now the JavaScript object that was parsed from the response
});
```

## Todo
There's lots missing here. Most importantly:
- all listings just return the first set. Need to be able to page through content
