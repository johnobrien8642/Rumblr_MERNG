const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  blogName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  token: {
    type: String,
    required: false
  },
  loggedIn: {
    type: Boolean,
    required: false
  },
  // authenticated: {
  //   type: Boolean,
  //   default: false
  // },
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // followers: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users'
  // },
  // follows: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users'
  // },
  // posts: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'posts'
  // },
  // postLikes: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'likes'
  // }
})

module.exports = mongoose.model('users', UserSchema)
