import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// import PostCreateUtil from './util/post_create_util.js'
// const { createPhotoPost } = PostCreateUtil;

const options = { discriminatorKey: 'kind' }

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
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


// PostSchema.statics.create = (
//   instanceData
//   ) => {
//     if (instanceData.kind === 'PhotoPost') {
//       createPhotoPost(instanceData)
//     }
//   }
  
const Post = mongoose.model('Post', PostSchema, 'posts')

export default Post;