import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' }

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  allText: {
    type: String
  },
  descriptions: [ 
    {
      kind: String,
      content: String,
      displayIdx: Number
    }
  ],
  descriptionImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  tagIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  tagTitles: {
    type: String
  },
  mentions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Mention'
    }
  ],
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
    default: 'Post'
  }
}, options)
  
const Post = mongoose.model('Post', PostSchema, 'posts')

export default Post;