import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RepostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: Schema.Types.ObjectId
  },
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  postAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  repostedFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  repostTrail: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
  repostCaptions: [
    {
      caption: String,
      userId: Schema.Types.ObjectId,
      repostId: Schema.Types.ObjectId
    }
  ],
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
