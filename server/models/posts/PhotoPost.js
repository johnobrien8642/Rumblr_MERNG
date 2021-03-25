import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PhotoPostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  reposts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Repost'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
})

const PhotoPost = mongoose.model('PhotoPost', PhotoPostSchema, 'photoPosts');

export default PhotoPost;
