import mongoose from 'mongoose';
import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import PhotoPostType from '../objects/photo_post_type.js';
const PhotoPost = mongoose.model('PhotoPost')

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