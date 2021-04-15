import mongoose from 'mongoose';
import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import LikeType from '../objects/posts/util/like_type.js';
import RepostType from '../objects/posts/util/repost_type.js';
const Like = mongoose.model('Like');
const Repost = mongoose.model('Repost');

const LikeAndRepostType = new GraphQLUnionType({
  name: 'LikeAndRepostType',
  types: [ LikeType, RepostType ],
  resolveType(value) {
    if (value.kind === 'Like') {
      return LikeType
    }
    if (value.kind === 'Repost') {
      return RepostType
    }
  }
})

export default LikeAndRepostType;