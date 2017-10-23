var express = require('express');
var router = express.Router();

var User = require('../models/user').User;

var Author = require('../models/user').Author;
var Story = require('../models/user').Story;
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.loggedInUser) {

  }  //Bob now exists, so lets create a story
});



// Bob now has his story



module.exports = router;
