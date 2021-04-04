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
    user: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
        .populate('user')
        .then(repost => repost.user)
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
    repostedFrom: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
          .populate('repostedFrom')
          .then(repost => repost.repostedFrom)
      }
    },
    repostCaption: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    onModel: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default RepostType;