import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
import UserType from '../../user_type.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID,
        GraphQLString, GraphQLObjectType } = graphql;

const ChatPostType = new GraphQLObjectType({
  name: 'ChatPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    chat: { type: GraphQLString },
    body: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('user')
          .then(post => post.user)
      }
    },
    tags: { 
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('tags')
          .then(post => post.tags)
      }
    },  
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default ChatPostType;