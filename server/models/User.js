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
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ], 
  posts:[
    {
      type: Schema.Types.ObjectId,
      ref: 'PhotoPost'
    }
  ],
  reposts:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Repost'
    }
  ],
  userFollowing: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tagFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  //// Uncomment both below for email auth
  //// Go to server/services/auth_util/register and uncomment
  // authenticated: {
  //   type: Boolean,
  //   default: false
  // },
  // emailAuthToken: {
  //   type: String
  // },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
})

const User = mongoose.model('User', UserSchema, 'users');

export default User;
