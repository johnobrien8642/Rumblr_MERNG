import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const options = { discriminatorKey: 'kind' }

const ChatPost = Post.discriminator('ChatPost', 
  new Schema({
    chat: {
      type: String
    }
  }), options)

  export default ChatPost;