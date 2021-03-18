const mongoose = require('mongoose');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const models = require('./models/index');
const schema = require('./schema/schema');
const url = 'mongodb://127.0.0.1:27017/Rumblr_MERNG';
const posts = require('./routes/api/posts')
const cors = require('cors');

const app = express();

mongoose
  .connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.log(err))

app.use('/api/posts', posts);
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

module.exports = app;

