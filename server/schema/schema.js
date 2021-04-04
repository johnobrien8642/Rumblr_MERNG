import graphql from 'graphql';
const { GraphQLSchema } = graphql;
import query from './types/queries-mutations-subscriptions/root_query_type.js';
import mutation from './types/queries-mutations-subscriptions/mutations.js';

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;