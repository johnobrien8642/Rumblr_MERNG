import graphql from 'graphql';
import mongoose from 'mongoose';
import UserType from '../objects/user_type.js';
import PostType from '../objects/post_type.js';
import ImageType from '../objects/image_type.js';
import ImageInputType from '../inputs/image_input_type.js';
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
import AuthService from '../../../services/auth_util.js';
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

export default mutation;