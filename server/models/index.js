import User from './User.js';
import Image from './posts/util/Image.js';
import Post from './posts/types/Post.js'
import TextPost from './posts/types/TextPost.js'
import PhotoPost from './posts/types/PhotoPost.js';
import Tag from './posts/util/Tag.js';
import Like from './posts/util/Like.js';
import Repost from './posts/util/Repost.js'
import Follow from './posts/util/Follow.js'

const models = {
  User,
  Image,
  Tag,
  Like,
  Repost,
  Follow,
  Post,
  TextPost,
  PhotoPost,
}

export default models;