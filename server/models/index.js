import User from './User.js';
import Image from './posts/util/Image.js';
import Tag from './posts/util/Tag.js';
import Like from './posts/util/Like.js';
import Repost from './posts/util/Repost.js';
import Follow from './posts/util/Follow.js';
import Post from './posts/types/Post.js';
import TextPost from './posts/types/TextPost.js';
import PhotoPost from './posts/types/PhotoPost.js';
import QuotePost from './posts/types/QuotePost.js';
import LinkPost from './posts/types/LinkPost.js';
import ChatPost from './posts/types/ChatPost.js'

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
  QuotePost,
  LinkPost,
  ChatPost
}

export default models;