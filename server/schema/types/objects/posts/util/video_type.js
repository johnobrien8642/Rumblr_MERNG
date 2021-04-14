import graphql from 'graphql';
const { GraphQLID, GraphQLObjectType, 
        GraphQLString, GraphQLFloat } = graphql;

const VideoType = new GraphQLObjectType({
  name: 'VideoType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default VideoType;