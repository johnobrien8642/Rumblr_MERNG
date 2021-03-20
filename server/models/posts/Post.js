import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  mainImages: [
    {
      _id: Schema.Types.ObjectId,
      created: String,
      url: String,
    }
  ],
  bodyImages: [
    {
      _id: Schema.Types.ObjectId,
      created: String,
      url: String,
    }
  ],
})

const Post = mongoose.model('Post', PostSchema, 'posts');

export default Post;
