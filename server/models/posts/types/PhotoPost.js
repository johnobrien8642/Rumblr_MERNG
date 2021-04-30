import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const options = { discriminatorKey: 'kind' }

const PhotoPost = Post.discriminator('PhotoPost',
  new Schema({
    mainImages: {
      type: String
    }
  }), options)

export default PhotoPost;
