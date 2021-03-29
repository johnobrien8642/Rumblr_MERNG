import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from '../objects/user_type.js';
import AnyPostType from '../unions/any_post_type.js';
const Repost = mongoose.model('Repost');
const { GraphQLID, GraphQLString,
        GraphQLObjectType } = graphql;

const RepostType = new GraphQLObjectType({
  name: 'RepostType',
  fields: () => ({
    _id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
          .populate('user')
          .then(like => like.user)
      }
    },
    post: {
      type: AnyPostType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
          .populate('post')
          .then(repost => repost.post)
      }
    },
  })
})

export default RepostType;