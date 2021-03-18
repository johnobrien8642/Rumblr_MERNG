const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  }
})

module.exports = Image = mongoose.model('Image', ImageSchema, 'images');