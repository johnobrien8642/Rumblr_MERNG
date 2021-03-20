import graphql from 'graphql';
const { GraphQLString, 
        GraphQLID, GraphQLInputObjectType, GraphQLInt } = graphql;

const ImageInputType = new GraphQLInputObjectType({ 
  name: 'ImageInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    created: { type: GraphQLString },
  })
})

export default ImageInputType;
