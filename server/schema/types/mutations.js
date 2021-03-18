const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./user_type');
const PostType = require('./post_type');
const ImageType = require('./image_type');
const ImageInputType = require('./image_input_type');
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const AuthService = require('../../services/auth_util');
const { GraphQLObjectType, GraphQLID,
        GraphQLString, GraphQLBoolean, GraphQLList } = graphql;

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    registerUser: {
      type: UserType,
      args: {
        blogName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString },
        loggedIn: { type: GraphQLBoolean }
      },
      resolve(_, args) {
        return AuthService.register(args)
      }
    },
    logoutUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.logout(args)
      }
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args)
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verify(args)
      }
    },
    createPost: {
      type: PostType,
      args: {
        mainImages: { type: new GraphQLList(ImageInputType)},
        bodyImages: { type: new GraphQLList(ImageInputType)},
      },
      resolve(_, { mainImages, bodyImages }) {
        var post = new Post();

        mainImages.forEach((img, i) => {
          console.log(img)
          post.mainImages.push(img)
        })

        bodyImages.forEach((img, i) => {
          post.bodyImages.push(img)
        })

        return post.save()
      },

    }
  })
})

module.exports = mutation;