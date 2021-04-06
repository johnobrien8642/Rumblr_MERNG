import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  displayIdx: {
    type: Number
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