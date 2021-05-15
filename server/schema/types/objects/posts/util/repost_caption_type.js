import graphql from 'graphql';
const { GraphQLID, GraphQLString,
        GraphQLObjectType } = graphql;

const RepostCaptionType = new GraphQLObjectType({
  name: 'RepostCaptionType',
  fields: () => ({
    _id: { type: GraphQLID },
    caption: { type: GraphQLString },
    userId: { type: GraphQLID }
  })
})

export default RepostCaptionType;