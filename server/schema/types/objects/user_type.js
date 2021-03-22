import graphql from 'graphql';
import mongoose from 'mongoose';
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
    followers: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('followers')
          .then(user => user.followers)
      }
    },
    userFollows: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('userFollows')
          .then(user => user.userFollows)
      }
    },
    // posts: {},
    // postLikes: {}
  })
})

export default UserType;