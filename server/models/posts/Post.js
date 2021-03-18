const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  mainImages: [
    {
      _id: Schema.Types.ObjectId,
      created: String,
      url: String,
    }
  ],
  bodyImages: [
    {
      _id: Schema.Types.ObjectId,
      created: String,
      url: String,
    }
  ],
})

module.exports = mongoose.model('Post', PostSchema, 'posts')