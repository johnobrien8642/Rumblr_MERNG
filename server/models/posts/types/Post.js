import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' }

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
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