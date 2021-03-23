import graphql, { GraphQLInt } from 'graphql';
import mongoose from 'mongoose';
import PostType from '../../types/objects/post_type.js';
import UserType from '../../types/objects/user_type.js';
const Tag = mongoose.model('Tag');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLFloat } = graphql;

const TagType = new GraphQLObjectType({
  name: 'TagType',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    posts: {
      type: GraphQLList(PostType),
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate('posts')
          .then(tag => tag.posts)
      }
    },
    followers: {
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate('followers')
          .then(tag => tag.followers)
      }
    },
    popularity: {
      type: GraphQLFloat,
      resolve(parentValue) {
        return Tag.aggregate([
          { $match: { _id: parentValue._id }},
            { $project: { 
              followers: { 
                $size: '$followers'
              }, 
              posts: { 
                $size: '$posts'
              } 
            } 
          }
        ]).then(res => {
          return (
            (res[0].followers + res[0].posts) / 2
          )
        })
      }
    },
    heat: {
      type: GraphQLInt,
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate({
            path: 'posts',
            options: {
              sort: { created: -1 }
            }
          })
          .then(tag => {
            var result = tag.posts.filter(p => p.createdAt.getTime() > (new Date().getTime() - (24*60*60*1000)))
            return result.length
          })
      }
    },
  })
})

export default TagType;