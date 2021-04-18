import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  src: {
    type: String,
    required: true
  },
  displayIdx: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Image'
  }
})

const Image = mongoose.model('Image', ImageSchema, 'images');

export default Image;