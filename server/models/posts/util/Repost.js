import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RepostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  repostedFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  repostCaption: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [ 
      'TextPost', 
      'PhotoPost', 
      'QuotePost', 
      'LinkPost', 
      'ChatPost', 
      'AudioPost', 
      'VideoPost',
    ]
  },
  kind: {
    type: String,
    default: 'Repost'
  },
})

const Repost = mongoose.model('Repost', RepostSchema, 'posts');

export default Repost;
