import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from '../objects/user_type.js';
import PostType from '../objects/post_type.js';
import ImageType from '../objects/image_type.js';
import UserAndPostType from '../unions/user_and_post_type.js';
import SearchUtil from '../../../services/search_util.js';
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    usersAndPosts: {
      type: new GraphQLList(UserAndPostType),
      resolve(_, { filter }) {
        let query = filter ? {$or: SearchUtil.buildFilters(filter)} : {};
        const users = async (query) => {
          var result = await User.find(query)
          return result
        }
        const posts = async (query) => {
          var result = await Post.find(query)
          return result
        }

        Promise.all([users(), posts()])
      }
    },
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

export default RootQueryType;