import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // followerCount: {
  //   type: Number
  // },
  // heat: {
  //   type: Number
  // },
  kind: {
    type: String,
    default: 'Tag'
  }
})

const Tag = mongoose.model('Tag', TagSchema, 'tags');

export default Tag;