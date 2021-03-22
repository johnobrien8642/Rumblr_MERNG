import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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
})

const Post = mongoose.model('Post', PostSchema, 'posts');

export default Post;
