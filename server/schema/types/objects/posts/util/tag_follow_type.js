import graphql from 'graphql';
import mongoose from 'mongoose';
import AnyPostType from '../unions/any_post_type.js'
import TagType from '../objects/posts/util/tag_type.js'
import LikeType from '../objects/posts/util/like_type.js'
import RepostType from '../objects/posts/util/repost_type.js'
import FollowType from '../objects/posts/util/follow_type.js'
const User = mongoose.model('User');
const Follow = mongoose.model('Follow');
const Mention = mongoose.model('Mention');
const { GraphQLObjectType, GraphQLString,
        GraphQLList, GraphQLInt,
        GraphQLBoolean, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
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
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default UserType;