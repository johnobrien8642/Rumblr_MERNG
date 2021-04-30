import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post');

const options = { discriminatorKey: 'kind' }

const TextPost = Post.discriminator('TextPost',
  new Schema({
    title: {
      type: String,
      default: ''
    },
  }), options)

export default TextPost;