import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  }
})

const Image = mongoose.model('Image', ImageSchema, 'images');

export default Image;