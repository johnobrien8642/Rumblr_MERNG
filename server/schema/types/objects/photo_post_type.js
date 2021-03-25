import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from './image_type.js';
import TagType from './tag_type.js';
import UserType from './user_type.js';
import LikeType from './like_type.js';
import RepostType from './repost_type.js';
const PhotoPost = mongoose.model('PhotoPost');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const PhotoPostType = new GraphQLObjectType({
  name: 'PhotoPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('user')
          .then(photoPost => photoPost.user)
      }
    },
    mainImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('mainImages')
          .then(photoPost => photoPost.mainImages)
      }
    },
    description: { type: GraphQLString },
    descriptionImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('descriptionImages')
          .then(photoPost => photoPost.descriptionImages)
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
    likes: {
      type: new GraphQLList(LikeType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('likes')
          .then(photoPost => photoPost.likes)
      }
    },
    reposts: {
      type: new GraphQLList(RepostType),
      resolve(parentValue) {
        return PhotoPost.findById(parentValue._id)
          .populate('reposts')
          .then(photoPost => photoPost.reposts)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  })
})

export default PhotoPostType;