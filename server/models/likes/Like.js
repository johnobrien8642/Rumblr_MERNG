import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'PhotoPost'
  }
})

const Like = mongoose.model('Like', LikeSchema, 'likes')

export default Like;