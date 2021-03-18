const mongoose = require('mongoose')
const graphql = require('graphql');
const { GraphQLList, GraphQLID, GraphQLObjectType } = graphql;
const ImageType = require('./image_type');
const Post = mongoose.model('Post')

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    _id: { type: GraphQLID },
    mainImages: { type: new GraphQLList(ImageType) },
    bodyImages: { type: new GraphQLList(ImageType) }
  })
})

module.exports = PostType;