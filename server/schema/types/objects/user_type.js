import graphql from 'graphql';
import mongoose from 'mongoose';
import AnyPostType from '../unions/any_post_type.js'
import TagType from '../objects/tag_type.js'
const User = mongoose.model('User');
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
    authenticated: { type: GraphQLBoolean },
    emailAuthToken: { type: GraphQLString },
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
    userFollows: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('userFollows')
        .then(user => user.userFollows)
      },
      followers: { 
        type: GraphQLList(UserType),
        resolve(parentValue) {
          return User.findById(parentValue._id)
            .populate('followers')
            .then(user => user.followers)
        }
      },
    },
    // postLikes: {}
  })
})

export default UserType;