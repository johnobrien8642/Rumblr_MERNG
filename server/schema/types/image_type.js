const graphql = require('graphql')
const { GraphQLList, GraphQLID, 
        GraphQLObjectType, GraphQLString,
        GraphQLNonNull } = graphql;

const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    created: { type: GraphQLString }
  })
})

module.exports = ImageType;