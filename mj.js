var Twitter = require('twit');
const fs = require('fs');
var _twitterConsumerKey = 'pONmNNR1Lz2rkz7OqH3e9eyl0';
var _twitterConsumerSecret = 'KXcXdICh3rMrpys3KfgYUccAw8JzhXUG8ZW1wwoyFQXiCwJLwA';
var T = new Twitter({
  consumer_key: _twitterConsumerKey,
  consumer_secret: _twitterConsumerSecret,
  access_token: '888704998632153088-dDeIDvABpGNrqma93SFHlpAoo1kZpMa',
  access_token_secret: '36sFaCwAAvs6aRgeocRMhgbs4R0puyL4XWLm4TVXGmH8L'
});




 var stream = T.stream('user', { track: ['liverpool']});

 stream.on('connected', function (response) {
   console.log("A connection established!..");
 })
stream.on('tweet', function (tweet) {
  console.log(tweet.text);
})

stream.on('error', function (error) {
  console.log(error);
});