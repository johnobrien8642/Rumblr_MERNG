const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
  mainImages: [ 
    {
      data: Schema.Types.Mixed,
      contentType: String,
      link: Boolean,
      default: false
    }
  ],
  bodyImages: [
    {
      data: Schema.Types.Mixed,
      contentType: String,
      link: Boolean,
      default: false
    }
  ]
})

module.exports = mongoose.model('posts', PostSchema)