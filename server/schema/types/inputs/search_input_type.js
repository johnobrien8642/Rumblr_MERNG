const graphql = require('graphql');
const { GraphQLString, 
        GraphQLID, GraphQLInputObjectType, GraphQLInt } = graphql;

const SearchInputType = new GraphQLInputObjectType({
  name: 'SearchInputType',
  fields: () => ({
    // _id: { type: GraphQLID },
    // url: { type: GraphQLString },
    // created: { type: GraphQLString },
  })
})

module.exports = SearchInputType;
