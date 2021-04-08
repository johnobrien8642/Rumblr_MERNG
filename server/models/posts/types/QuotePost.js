import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const options = { discriminatorKey: 'kind' }

const QuotePost = Post.discriminator('QuotePost',
  new Schema({
    quote: {
      type: String
    },
    source: {
      type: String
    }
  }), options)

export default QuotePost;