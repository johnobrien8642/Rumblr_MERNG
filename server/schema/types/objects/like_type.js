import graphql from 'graphql';
import mongoose from 'mongoose';
import AnyPostType from '../unions/any_post_type.js';
import UserType from '../objects/user_type.js';
const Like = mongoose.model('Like');
const { GraphQLID, GraphQLObjectType } = graphql;

const LikeType = new GraphQLObjectType({
  name: 'LikeType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Like.findById(parentValue._id)
          .populate('user')
          .then(like => like.user)
      }
    },
    post: {
      type: AnyPostType,
      resolve(parentValue) {
        return Like.findById(parentValue._id)
          .populate('post')
          .then(like => like.post)
      }
    },
  })
})

export default LikeType;
