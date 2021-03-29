import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PhotoPost'
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followerCount: {
    type: Number
  },
  heat: {
    type: Number
  }
})

const Tag = mongoose.model('Tag', TagSchema, 'tags');

export default Tag;