import mongoose from 'mongoose';
import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import UserType from '../objects/user_type.js';
import TagType from '../objects/tag_type.js';
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');

const UserAndTagType = new GraphQLUnionType({
  name: 'UserAndTagType',
  types: [ UserType, TagType ],
  resolveType(value) {
    if (value instanceof User) {
      return UserType
    }
    if (value instanceof Tag) {
      return TagType
    }
  }
})

export default UserAndTagType;