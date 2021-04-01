import graphql from 'graphql';
import mongoose from 'mongoose';
import UserType from '../objects/user_type.js';
import { PubSub } from 'graphql-subscriptions';
const User = mongoose.model('User');

const { GraphQLObjectType, GraphQLString } = graphql;
const pubsub = new PubSub();

const subscription = new GraphQLObjectType({
  name: 'Subscriptions',
  fields: () => ({
    subscribeUserDetailsCounts: {
      type: UserType,
      args: { blogName: { type: GraphQLString } },
      subscribe: (_, { blogName }) => {
        return pubsub.asyncIterator([User.findOne({ blogName: blogName })])
      }
    }
  })
})

export default subscription;