import User from './User.js';
import Image from './images/Image.js';
import TextPost from './posts/TextPost.js'
import PhotoPost from './posts/PhotoPost.js';
import Tag from './tags/Tag.js';
import Like from './likes/Like.js';
import Repost from './reposts/Repost.js'

const models = {
  User,
  Image,
  Tag,
  Like,
  Repost,
  TextPost,
  PhotoPost,
}

export default models;