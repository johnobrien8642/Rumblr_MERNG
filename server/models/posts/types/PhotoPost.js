import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const options = { discriminatorKey: 'kind' }

const PhotoPost = Post.discriminator('PhotoPost',
  new Schema({
    mainImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    description: {
      type: String
    },
    descriptionImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
  }), options)

export default PhotoPost;
