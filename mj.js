var Twitter = require('twit');
const fs = require('fs');
var _twitterConsumerKey = 'dvfaQ2LV9z2WOpFApmLEES57q';
var _twitterConsumerSecret = 'QZFxl5HhrjdQxOUQH6UE4tjbsrPcxDHpe0UNX9WzP1YCQrHo8R';
var T = new Twitter({
  consumer_key: _twitterConsumerKey,
  consumer_secret: _twitterConsumerSecret,
  access_token: '888704998632153088-KDc7m9Qxf09hCYM7we4WBiysXgp6Hi1',
  access_token_secret: 'JD6tiw4tepc0S91x4Gp4dowrLFYrfEs2zw4Jbx9ZpCiCl'
});

// T.get('search/tweets', { from: 'YouTube', count: 3 }, function (err, data, response) {
//   for (var i = 0; i < data.statuses.length; i++) {
//     //var tid[i] = data[i].id;
//     // console.log(tid);

//     console.log(data);
//   }
 
// })

T.get('users/lookup',{screen_name:'mjzacharias'},function(err,data,response){

  console.log(data[0].id);
  console.log("@" +data[0].screen_name);
  console.log("Name:" +data[0].name);
  console.log(data[0].profile_image_url);
  console.log(data[0].profile_background_image_url);
  console.log(data[0].description);
  
})

// T.get('statuses/user_timeline',{screen_name:'LFCIndia',count:3},function(err,data,response){
 
//     //var tid[i] = data[i].id;
//     // console.log(tid);
    
//     console.log(data[0]);
//   })


// var csr = -1;
// api_path = "http://api.twitter.com/1.1/friends/ids.json?screen_name=_tonytom";

// T.get('friends/ids', { count: 100, screen_name: "mjzacharias", cursor: csr }, function (err, data, response) {
//   for (var i = 0; i < data.ids.length; i++) {
//     console.log(data.ids[i]);
//   }
//   csr = data.next_cursor;
// });




// T.get('followers/ids', { screen_name: 'jopaul_jn' },  function (err, data, response) {
//   console.log(data);
// })
// post a tweet with media
//
// var b64content = fs.readFileSync('D:/code/twittest2/tphase1/public/images/mane.jpg', { encoding: 'base64' })

// // first we must post the media to Twitter
// T.post('media/upload', { media_data: b64content }, function (err, data, response) {
//   // now we can assign alt text to the media, for use by screen readers and
//   // other text-based presentations and interpreters
//   var mediaIdStr = data.media_id_string
//   var altText = "team Liverpool"
//   var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

//   T.post('media/metadata/create', meta_params, function (err, data, response) {
//     if (!err) {
//       // now we can reference the media and post a tweet (media will attach to the tweet)
//       var params = { status: 'Best of luck lads..#LIVHOF', media_ids: [mediaIdStr] }

//       T.post('statuses/update', params, function (err, data, response) {
//         console.log(data)
//       })
//     }
//   })
// })



 var stream = T.stream('user', { track: ['jopaul_jn']});

 stream.on('connected', function (response) {
 })
stream.on('tweet', function (tweet) {
})

stream.on('error', function (error) {
});