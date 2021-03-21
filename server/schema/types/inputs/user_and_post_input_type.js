import graphql from 'graphql';
const { GraphQLString, GraphQLList, 
        GraphQLInputObjectType } = graphql;

const UserAndPostInputType = new GraphQLInputObjectType({
  name: 'UserAndPostInputType',
  fields: () => ({
    OR: { type: GraphQLList(UserAndPostInputType)},
    blogName_contains: { type: GraphQLString },
    tags_contain: { type: GraphQLString },
  })
})

export default UserAndPostInputType;
