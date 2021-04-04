import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: {
    type: String,
    required: true
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
    default: 'Tag',
    immutable: true
  }
})

const Tag = mongoose.model('Tag', TagSchema, 'tags');

export default Tag;