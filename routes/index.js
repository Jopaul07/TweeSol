var express = require('express');
var router = express.Router();
var oauth = require('oauth');
var inspect = require('util-inspect');
var Client = require('node-rest-client').Client;
var multer = require('multer');
var path = require('path');
var cron = require('node-cron');
var fs = require('fs');
var csv = require('fast-csv');
var user_list = [];

var io = require('../socket').io;
var User = require('../models/user').User;
var Twitid = require('../models/user').Twitid;
var Tweet = require('../models/user').Tweet;
var History = require('../models/user').History;
// Get your credentials here: https://dev.twitter.com/apps
var _twitterConsumerKey = 'pONmNNR1Lz2rkz7OqH3e9eyl0';
var _twitterConsumerSecret = 'KXcXdICh3rMrpys3KfgYUccAw8JzhXUG8ZW1wwoyFQXiCwJLwA';

var consumer = new oauth.OAuth(
  "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
  _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://127.0.0.1:3000/sessions/callback", "HMAC-SHA1");

var Twitter = require('twit');

var twitterClient = new Twitter({
  consumer_key: _twitterConsumerKey,
  consumer_secret: _twitterConsumerSecret,
  access_token: '888704998632153088-2pJuP64k029qi4VjblP1v22uZRvT4ze',
  access_token_secret: '36sFaCwAAvs6aRgeocRMhgbs4R0puyL4XWLm4TVXGmH8L'
});

//upload code
//upload var..
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

/** testing IO 
 */
io.on('connection', function (socket) {
  socket.on('disconnect', function () {
  });
});

router.get('/upl', (req, res, next) => {
  res.render('upload');
});
router.post('/home', (req, res, next) => {
  var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname)
      if (ext !== '.csv') {
        return res.redirect('/home');
      }
      callback(null, true)
    }
  }).single('userFile');
  upload(req, res, function (err) {
    var loc = req.file.destination + "/" + req.file.filename;
    var stream = fs.createReadStream(loc);
    var i = 0;
    csv
      .fromStream(stream, { headers: true, ignoreEmpty: true })
      .on("data", data => {
        user_list.push(data);
      })
      .on("end", () => {
        var twitIDArray = [];
        for (i = 0, l = user_list.length; i < l; i++) {
          var obj = user_list[i];
          var twitid = new Twitid({
            name: obj.name,
            screen_name: obj.screen_name,
            owner: req.session.loggedInUser._id
          });
          twitIDArray.push(twitid);
        }
        Twitid.create(twitIDArray)
          .then((objects) => {
            
          })
          .catch((err) => {
            
          });
        user_list = [];
      });

    return res.redirect('/home');
  })
});
router.get('/', (req, res, next) => {
  if (req.session.loggedInUser) {
    return res.redirect('/home');
  }
  return res.render('index', { title: 'Login First!!' });
});
router.get('/sessions/connect', function (req, res) {
  consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, result) {
    if (error) {
      console.log(error);
      res.send("Error getting OAuth request token : " + inspect(error), 500);
    } else {

      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
    }
  });
});

router.get('/sessions/callback', function (req, res) {
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, result) {
    if (error) {
      res.send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(result) + "]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, result) {
        if (error) {
          return res.redirect('/sessions/connect');
        }
        var parsedData = JSON.parse(data);
        let username = parsedData.screen_name;
        let userid = parsedData.id;
        let id_str = parsedData.id_str;
        let access_token = { token: req.session.oauthAccessToken, secret: req.session.oauthAccessTokenSecret };
        User.findOne({ userid: userid })
          .then((user) => {
            if (!user) {
              return User.create(
                {
                  userid: userid,
                  username: username,
                  access_token: access_token,
                  created_at: Date()
                });
            } else {
              return user;
            }
          })
          .then((user) => {
            // set the session and redirect to dashboard
            req.session.loggedInUser = user;
            return res.redirect('/home');
          })
          .catch((err) => {
            return res.redirect('/session/connect');
          });
      });
    }
  });
});

router.get('/sessions/finish', function (req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  })

});

router.post('/twitid', (req, res, next) => {
  if (req.session.loggedInUser) {
    var twitidn = req.body.twitidn;
    Twitid
      .find({ screen_name: twitidn })
      .then((tweet) => {
        if (tweet.length === 0) {
          return Twitid.create({
            screen_name: twitidn,
            owner: req.session.loggedInUser._id
          });
        } else {
          throw Error("Duplicate entry!")
        }
      })
      .then((tweet) => {
        // set the session and redirect to dashboard
        if (tweet) {
        }
        return res.status(200).json({
          tweet: tweet
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err
        });
      });

  } else {
    return res.status(401).json({
      error: "User not logged in."
    });
  }

});

router.get('/live-zone', function (req, res, next) {
  if (req.session.loggedInUser) {
    let user = req.session.loggedInUser;
    res.render('pages/live-zone', { username: user.username });
  }
  else {
    res.redirect('/home');
  }

});

router.get('/home', function (req, res) {
  let user = req.session.loggedInUser;
  if (!user) {
    return res.redirect('/');
  }
  var at = user.access_token.token;
  var ats = user.access_token.secret;
  twitterClients[user._id] = new Twitter({
    consumer_key: _twitterConsumerKey,
    consumer_secret: _twitterConsumerSecret,
    access_token: at,
    access_token_secret: ats
  });
  var td = [];
  var tw = [];
  Twitid
    .find({ owner: user._id }, function (err, tids) {
      if (tids.length > 0) {
        Tweet
          .find({ owner: user._id }, function (err, tweets) {

            if (!tweets.length) {
              return res.render("home", { username: user.username, twitids: tids, tweets: [], id_str: user.userid });
            }
            return res.render("home", { username: user.username, twitids: tids, tweets: tweets, id_str: user.userid });

          })
      }

      else {
        Tweet
          .find({ owner: user._id }, function (err, tweets) {

            if (!tweets.length) {
              return res.render("home", { username: user.username, twitids: [], tweets: [], id_str: user.userid });
            }
            return res.render("home", { username: user.username, twitids: [], tweets: tweets, id_str: user.userid });

          })
      }
    });

});
var twitterClients = {};
var cronJobs = {};
let startCronJob = (ownerID) => {
  if (cronJobs[ownerID]) {
    cronJobs[ownerID].stop();
    cronJobs[ownerID].start();
  } else {
    cronJobs[ownerID] = cron.schedule('*/40 * * * * *', function () {
      Twitid.findOne({ owner: ownerID })
        .then(function (doc) {
          if (!doc) {
            let stat = "NO ids left";
            cronJobs[ownerID].stop();

          }
          // Called once for every document
          Tweet.count()
            .then((count) => {

              // Get a random entry
              var random = Math.floor(Math.random() * count)

              // Again query all users but only fetch one offset by our random #
              Tweet.findOne().skip(random)

                .then((result) => {
                  // Tada! random tweet
                  var statusk = "@" + doc.screen_name + " ";
                  var realstat = statusk + result.tweetcont;
                  twitterClients[ownerID].post('statuses/update', { status: realstat }, function (err, data, response) {
                    if (err) {
                      console.log("There was a problem tweeting the message.", err);
                    }
                    else {
                      Twitid.findByIdAndRemove({ _id: doc._id })
                        .then((docc) => {
                          
                        })
                    }
                  });
                })
            })
        });
    });
  }
}
let stopCronjob = (ownerID) => {
  if (cronJobs[ownerID]) {
    cronJobs[ownerID].stop();
    console.log("Tweeting Stopped..");
  }
}
router.get('/test', (req, res, next) => {
  return res.render('test');
})
router.get('/home/tweeting', (req, res, next) => {
  let userID = req.session.loggedInUser._id;
  let mess;
  startCronJob(userID);
  return res.json({ message: "tweeting started.." });
})
router.get('/home/tweestop', (req, res, next) => {
  let userID = req.session.loggedInUser._id;
  stopCronjob(userID);
  res.json({ message: "Tweeting stopped." });
})

router.post('/tweet', (req, res) => {
  if (req.session.loggedInUser) {
    let newTweetname = req.body.tweetname;
    let newTweetbody = req.body.tweetbody;
    Tweet
      .find({ tweetcont: newTweetbody })
      .then((tweet) => {
        if (tweet.length === 0) {
          return Tweet.create({
            tweetcont: newTweetbody,
            owner: req.session.loggedInUser._id
          });
        } else {
          throw Error("Duplicate entry!")
        }
      })
      .then((tweet) => {
        // set the session and redirect to dashboard
        return res.status(200).json({
          tweet: tweet
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err
        });
      });

  } else {
    return res.status(401).json({
      error: "User not logged in."
    });
  }
})

router.delete('/tweets', (req, res, next) => {
  if (req.session.loggedInUser) {
    let tweet = req.body.tweetcont;
    Tweet
      .findByIdAndRemove(tweet, (err, result) => {
        if (err) {
          return res.status(500).json({
            error: errr
          });

        }
        else {
          return res.json({
            status: "ads"
          })
        }// if no error, your models are removed
      });

  }
});
router.delete('/twitids', (req, res, next) => {
  if (req.session.loggedInUser) {
    let twitid = req.body.twitid;
    Twitid.findByIdAndRemove(twitid, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err
        });

      }
      else {
        return res.json({ message: 'Okay' });
      }// if no error, your models are removed
    })
  }
})

module.exports = router;