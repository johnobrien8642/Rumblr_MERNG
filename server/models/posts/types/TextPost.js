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
    body: {
      type: String,
      default: ''
    },
    descriptionImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
  }), options)

export default TextPost;