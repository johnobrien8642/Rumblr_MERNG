import graphql, { GraphQLInt } from 'graphql';
import mongoose from 'mongoose';
import PhotoPostType from '../types/photo_post_type.js';
import AnyPostType from '../../../unions/any_post_type.js'
import UserType from '../../user_type.js';
const Mention = mongoose.model('Mention');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLFloat } = graphql;

const MentionType = new GraphQLObjectType({
  name: 'MentionType',
  fields: () => ({
    _id: { type: GraphQLID },
    mention: {
      type: UserType,
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('mention')
        .then(tag => tag.mention)
      }
    },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('user')
        .then(tag => tag.user)
      }
    },
    post: {
      type: new GraphQLList(AnyPostType),
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('post')
        .then(tag => tag.post)
      }
    },
    kind: { type: GraphQLString },
  })
})

export default MentionType;