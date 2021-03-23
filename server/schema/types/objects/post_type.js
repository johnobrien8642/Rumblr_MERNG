import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from './image_type.js';
import TagType from './tag_type.js';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    _id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    mainImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('mainImages')
          .then(post => post.mainImages)
      }
    },
    bodyImages: { 
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('bodyImages')
          .then(post => post.bodyImages)
      }
    },
    tags: { 
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('tags')
          .then(post => post.tags)
      }
    }
  })
})

export default PostType;