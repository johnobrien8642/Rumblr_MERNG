import mongoose from 'mongoose';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { graphqlHTTP } from 'express-graphql';
import models from './models/index.js';
import schema from './schema/schema.js';
import posts from './routes/api/posts.js';
import mailer from './routes/api/mailer.js';
import expressWs from 'express-ws';
import cors from 'cors';
const url = 'mongodb://127.0.0.1:27017/Rumblr_MERNG';

const app = express();

mongoose
  .connect(url, { 
    useNewUrlParser: 
    true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.log(err))
  
app.use(express.json())
app.use('/api/posts', posts);
app.use('/api/mailer', mailer);
app.use('/uploads', express.static('uploads'))
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

export default app;

