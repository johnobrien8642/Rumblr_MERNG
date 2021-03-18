const mongoose = require('mongoose');
const graphql = require('graphql');
const UserType = require('./user_type');
const PostType = require('./post_type');
const ImageType = require('./image_type');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, args) {
        return User.findById(args._id)
      }
    },
    post: {
      type: PostType,
      args: { _id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Post.findById(args._id)
      }
    },
    image: {
      type: ImageType,
      args: { _id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Image.findById(args._id)
      }
    },
    images: {
      type: new GraphQLList(ImageType),
      resolve() {
        return Image.find({})
      }
    }
  })
})

module.exports = RootQueryType;