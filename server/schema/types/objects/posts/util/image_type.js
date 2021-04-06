import graphql from 'graphql';
const { GraphQLID, GraphQLObjectType, 
        GraphQLString, GraphQLFloat } = graphql;

const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    displayIdx: { type: GraphQLFloat },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default ImageType;