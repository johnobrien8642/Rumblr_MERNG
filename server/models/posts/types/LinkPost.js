import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const options = { discriminatorKey: 'kind' }

const LinkPost = Post.discriminator('LinkPost', 
  new Schema({
    linkObj: {
      link: String,
      siteName: String,
      imageUrl: String,
      title: String,
      linkDescription: String
    }
  }), options)

  export default LinkPost;