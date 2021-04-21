import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AudioSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Audio'
  }
})

const Audio = mongoose.model('Audio', AudioSchema, 'audio');

export default Audio;