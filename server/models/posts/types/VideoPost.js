import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post');

const options = { discriminatorKey: 'kind' }

const VideoPost = Post.discriminator('VideoPost',
  new Schema({
  videoLink: {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    },
  }), options)

export default VideoPost;