const mongoose = require('mongoose');
const graphql = require('graphql');
const UserType = require('./user_type');
const User = mongoose.model('users')
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, args) {
        return User.findById(args._id)
      }
    }
  })
})

module.exports = RootQueryType;