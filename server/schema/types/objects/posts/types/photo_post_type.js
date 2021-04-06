import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
import UserType from '../../user_type.js';
import LikeType from '../util/like_type.js';
import RepostType from '../util/repost_type.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const PhotoPost = mongoose.model('PhotoPost');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const PhotoPostType = new GraphQLObjectType({
  name: 'PhotoPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    mainImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('mainImages')
          .then(photoPost => photoPost.mainImages)
      }
    },
    descriptions: { type: GraphQLList(GraphQLJSONObject) },
    descriptionImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('descriptionImages')
          .then(photoPost => photoPost.descriptionImages)
      }
    },
    user: {
      type: UserType,
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('user')
          .then(photoPost => photoPost.user)
      }
    },
    tags: { 
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('tags')
          .then(photoPost => photoPost.tags)
      }
    },  
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default PhotoPostType;