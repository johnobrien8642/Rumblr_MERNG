import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RepostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
})

const Repost = mongoose.model('Repost', RepostSchema, 'reposts');

export default Repost;