import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post');

const options = { discriminatorKey: 'kind' }

const AudioPost = Post.discriminator('AudioPost',
  new Schema({
    audioFile: {
      type: Schema.Types.ObjectId,
      ref: 'Audio'
    },
    audioMeta: {
      title: String,
      artist: String,
      album: String,
      kind: String
    },
  }), options)

export default AudioPost;