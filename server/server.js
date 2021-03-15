const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
// const { graphqlHTTP } = require('express-graphql');
const { ApolloServer } = require('apollo-server-express');
const models = require('./models/index');
// const schema = require('./schema/schema');
const url = 'mongodb://127.0.0.1:27017/Rumblr_MERNG';
const TypeDefs = require('./schema/types/type_defs')
const Resolvers = require('./schema/types/resolvers')

const app = express();

mongoose
  .connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.log(err))


const server = new ApolloServer({ 
  typeDefs: TypeDefs,
  resolvers: Resolvers
})
server.applyMiddleware({ app })

module.exports = app;

