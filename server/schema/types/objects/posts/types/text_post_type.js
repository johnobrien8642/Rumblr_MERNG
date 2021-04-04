import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
import UserType from '../../user_type.js';
const TextPost = mongoose.model('TextPost')
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const TextPostType = new GraphQLObjectType({
  name: 'TextPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    descriptionImages: {
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return TextPost.findById(parentValue._id)
          .populate('descriptionImages')
          .then(textPost => textPost.descriptionImages)
      }
    },
    user: {
      type: UserType,
      resolve(parentValue) {
        return TextPost.findById(parentValue._id)
          .populate('user')
          .then(textPost => textPost.user)
      }
    },
    tags: {
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return TextPost.findById(parentValue._id)
          .populate('tags')
          .then(textPost => textPost.tags)
      }
    },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default TextPostType;