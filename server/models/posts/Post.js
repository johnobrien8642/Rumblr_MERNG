import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  mainImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  bodyImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  tags:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
})

const Post = mongoose.model('Post', PostSchema, 'posts');

export default Post;
