import graphql from 'graphql';
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
    // followers: {},
    // follows: {},
    // posts: {},
    // postLikes: {}
  })
})

export default UserType;