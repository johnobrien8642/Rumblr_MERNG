import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RepostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'PhotoPost'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

const Repost = mongoose.model('Repost', RepostSchema, 'reposts');

export default Repost;