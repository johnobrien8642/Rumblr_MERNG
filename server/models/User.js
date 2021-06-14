import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  profilePic: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  blogName: {
    type: String, 
    required: true
  },
  blogDescription: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  oldPasswords: [
    {
      type: String
    }
  ],
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
  tagFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      index: true
    }
  ],
  userFollows: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    }
  ],
  filteredTags: [
    {
      type: String
    }
  ],
  filteredPostContent: [
    {
      type: String
    }
  ],
  followerCount: {
    type: Number,
    default: 0
  },
  postingHeatLastMonth: {
    type: Number,
    default: 0
  },
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
  kind: {
    type: String,
    default: 'User'
  }
})

const User = mongoose.model('User', UserSchema, 'users');

export default User;
