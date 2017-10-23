var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// let tPromise = require('bluebird');
// mongoose.Promise =tPromise;
// create a schema
var userSchema = new Schema({
    userid: { type: Number, requied: true, unique: true },
    username: { type: String, required: true, unique: true },
    access_token: { type: Schema.Types.Mixed, required: true },
    created_at: Date,
    targtids: [{ type: Schema.Types.ObjectId, ref: 'Twitid' }],
    targttweet: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }] 
});
var twitidSchema = new Schema({
    name: { type: String, required: false },
    screen_name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});
var historySchema = new Schema({
    name:{type:String,required:false},
    screen_name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }

});

var  tweetSchema = new Schema({
    tweetcont: {type:String,required:true ,unique:true},
    owner: { type:Schema.Types.ObjectId, ref: 'User' }
});
//testing..
var authorSchema = new Schema({
    name: String,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = new Schema({
    title: String,
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
var Twitid = mongoose.model('Twitid',twitidSchema);
var History = mongoose.model('History',historySchema);
var Tweet = mongoose.model('Tweet',tweetSchema);
var Story = mongoose.model('Story', storySchema);
var Author = mongoose.model('Author', authorSchema);
// make this available to our users in our Node applications
module.exports = { User,Twitid, Author, Story,Tweet,History } ;