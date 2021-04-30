import graphql from 'graphql';
import mongoose from 'mongoose';
import TagType from '../util/tag_type.js';
import UserType from '../../user_type.js';
import VideoType from '../util/video_type.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const VideoPostType = new GraphQLObjectType({
  name: 'VideoPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    videoLink: {
      type: VideoType,
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('videoLink')
          .then(post => post.videoLink)
      }
    },
    audioMeta: { type: GraphQLJSONObject },
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

export default VideoPostType;