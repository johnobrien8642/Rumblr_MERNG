import mongoose from 'mongoose';
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
  authenticated: {
    type: Boolean,
    default: false
  },
  emailAuthToken: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  },
  lastUpdated: {
    type: Date,
    default: Date.now()
  },
  // followers: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users'
  // },
  // userFollows: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users'
  // },
  // tagFollows: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'users'
  // },
  // createdTags: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'tags'
  // }
  // posts: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'posts'
  // },
  // postLikes: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'likes'
  // }
})


const Post = mongoose.model('User', UserSchema, 'users');

export default Post;
