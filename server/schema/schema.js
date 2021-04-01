import graphql from 'graphql';
const { GraphQLSchema } = graphql;
import query from './types/queries-mutations-subscriptions/root_query_type.js';
import mutation from './types/queries-mutations-subscriptions/mutations.js';
import subscription from './types/queries-mutations-subscriptions/subscriptions.js';

const schema = new GraphQLSchema({
  query,
  mutation,
  subscription
});

export default schema;