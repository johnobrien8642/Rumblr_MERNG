import mongoose from 'mongoose';
import graphql from'graphql';
const { GraphQLUnionType } = graphql;
const PhotoPost = mongoose.model('PhotoPost');
import PhotoPostType from '../objects/photo_post_type.js';

const AnyPostType = new GraphQLUnionType({
  name: 'AnyPostType',
  types: [ PhotoPostType ],
  resolveType(value) {
    if (value instanceof PhotoPost) {
      return PhotoPostType
    }
  }
})

export default AnyPostType;