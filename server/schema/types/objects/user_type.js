import graphql from 'graphql';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import AnyPostType from '../unions/any_post_type.js'
import TagType from '../objects/tag_type.js'
import LikeType from '../objects/like_type.js'
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const { GraphQLObjectType, GraphQLString,
        GraphQLList, GraphQLInt,
        GraphQLBoolean, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: { type: GraphQLID },
    blogName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    loggedIn: { type: GraphQLBoolean },
    ////Uncomment for email auth
    // authenticated: { type: GraphQLBoolean },
    // emailAuthToken: { type: GraphQLString },
    created: { type: GraphQLInt },
    lastUpdated: { type: GraphQLInt },
    posts: {
      type: new GraphQLList(AnyPostType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('posts')
          .then(user => user.posts)
      }
    },
    tagFollows: {
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('tagFollows')
          .then(user => user.tagFollows)
      }
    },
    userFollowing: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('userFollowing')
        .then(user => user.userFollowing)
      }
    },
    likedPosts: { 
      type: GraphQLList(AnyPostType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('likedPosts')
        .then(user => user.likedPosts)
      }
    },
    followers: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('followers')
          .then(user => user.followers)
      }
    },
    userFollowCount: {
      type: GraphQLInt,
      resolve(parentValue, args, ctx) {
        const decoded = jwt.verify(
          ctx.headers.authorization, 
          keys.secretOrKey
        )
        const { _id } = decoded;
        let idToSearch = mongoose.Types.ObjectId(_id)
        return User.aggregate([
          { $match: { _id: idToSearch } },
            { $project: {
              followerCount: {
                $size: '$userFollows'
              }
            }
          }
        ]).then(res => res[0].followerCount)
      }
    },
    postLikeCount: {
      type: GraphQLInt,
      resolve(parentValue, args, ctx) {
        const decoded = jwt.verify(
          ctx.headers.authorization, 
          keys.secretOrKey
        )
        const { _id } = decoded;
        let idToSearch = mongoose.Types.ObjectId(_id)

        return User.aggregate([
          { $match: { _id: idToSearch } },
            { $project: {
              postLikeCount: {
                $size: '$postLikes'
              }
            }
          }
        ]).then(res => res[0].postLikeCount)
      }
    },
    // postLikes: {}
  })
})

export default UserType;