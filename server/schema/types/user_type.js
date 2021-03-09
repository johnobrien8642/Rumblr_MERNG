const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString,
        GraphQLList, GraphQLInt,
        GraphQLBoolean, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    loggedIn: { type: GraphQLBoolean },
    // authenticated: { type: GraphQLBoolean },
    created: { type: GraphQLInt },
    lastUpdated: { type: GraphQLInt },
    // followers: {},
    // follows: {},
    // posts: {},
    // postLikes: {}
  })
})

module.exports = UserType;