import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [ 'TextPost', 'PhotoPost', 'Repost' ]
  },
  kind: {
    type: String,
    default: 'Like'
  },
})

const Like = mongoose.model('Like', LikeSchema, 'likes')

export default Like;