const TypeDefs = require('./types/type_defs');
const Resolvers = require('./types/resolvers')


const { makeExecutableSchema } = require('apollo-server-express');
makeExecutableSchema({
  typeDefs: TypeDefs,
  resolvers: Resolvers
})

module.exports = makeExecutableSchema;

// const query = require('./types/root_query_type');
// const mutation = require('./types/mutations')


// module.exports = new GraphQLSchema({
//   // query,
//   // mutation
//   TypeDefs,
//   Resolvers
// });