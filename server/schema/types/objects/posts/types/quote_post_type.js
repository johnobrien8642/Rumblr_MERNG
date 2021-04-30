import graphql from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import UserType from '../../user_type.js';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const QuotePostType = new GraphQLObjectType({
  name: 'QuotePostType',
  fields: () => ({
    _id: { type: GraphQLID },
    quote: { type: GraphQLString },
    source: { type: GraphQLString },
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
    kind: { type: GraphQLString },
  })
})

export default QuotePostType;