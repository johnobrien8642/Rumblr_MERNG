import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from '../../user_type.js';
import UserAndTagType from '../../../unions/user_and_tag_type.js';
const Follow = mongoose.model('Follow');

const { GraphQLObjectType,
        GraphQLString, GraphQLID } = graphql

const FollowType = new GraphQLObjectType({
  name: 'FollowType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Follow.findById(parentValue._id)
        .populate('user')
        .then(repost => repost.user)
      }
    },
    follows: {
      type: UserAndTagType,
      resolve(parentValue) {
        return Follow.findById(parentValue._id)
        .populate('follows')
        .then(repost => repost.follows)
      }
    },
    createdAt: { type: GraphQLString }
  })
})

export default FollowType;