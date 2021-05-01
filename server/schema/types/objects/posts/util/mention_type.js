import graphql, { GraphQLInt } from 'graphql';
import mongoose from 'mongoose';
import PhotoPostType from '../types/photo_post_type.js';
import AnyPostType from '../../../unions/any_post_type.js'
import UserType from '../../user_type.js';
const Tag = mongoose.model('Tag');
const PhotoPost = mongoose.model('PhotoPost');
const User = mongoose.model('User');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLFloat } = graphql;

const TagType = new GraphQLObjectType({
  name: 'TagType',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    kind: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate('user')
          .then(tag => tag.user)
      }
    },
    posts: {
      type: new GraphQLList(AnyPostType),
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate('posts')
          .then(tag => tag.posts)
      }
    },
  })
})

export default TagType;