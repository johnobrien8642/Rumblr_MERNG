import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from './image_type.js';
const Post = mongoose.model('Post')
const { GraphQLList, GraphQLID, 
        GraphQLObjectType } = graphql;

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    _id: { type: GraphQLID },
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
    }
  })
})

export default PostType;