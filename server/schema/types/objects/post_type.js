import graphql from 'graphql';
import ImageType from './image_type.js';
const { GraphQLList, GraphQLID, 
        GraphQLObjectType } = graphql;

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    _id: { type: GraphQLID },
    mainImages: { type: new GraphQLList(ImageType) },
    bodyImages: { type: new GraphQLList(ImageType) }
  })
})

export default PostType;