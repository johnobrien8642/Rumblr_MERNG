import mongoose from 'mongoose';
import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import UserType from '../objects/user_type.js';
import PostType from '../objects/post_type.js';
const User = mongoose.model('User');
const Post = mongoose.model('Post');

const UserAndPostType = new GraphQLUnionType({
  name: 'Search',
  types: [ UserType, PostType ],
  resolve(value) {
    if (value instanceof User) {
      return UserType
    }
    if (value instanceof Post) {
      return PostType
    }
  }
})

export default UserAndPostType;