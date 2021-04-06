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
  }), options)

export default PhotoPost;
