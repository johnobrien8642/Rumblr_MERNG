import graphql from 'graphql';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
import PostType from '../objects/post_type.js';
import ImageType from '../objects/image_type.js';
import ImageInputType from '../inputs/image_input_type.js';
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const User = mongoose.model('User');
import AuthService from '../../../services/auth_util.js';
const { GraphQLObjectType, GraphQLID,
        GraphQLString, GraphQLList } = graphql;

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
          post.mainImages.push(img._id)
        })

        bodyImages.forEach((img, i) => {
          post.bodyImages.push(img._id)
        })

        return post.save()
      }
    },
    followUser: {
      type: UserType,
      args: { 
        userId: { type: GraphQLID },
        token: { type: GraphQLString }
      },
      resolve(parentValue, {userId, token}) {
        const decoded = jwt.verify(token, keys.secretOrKey);
        const { _id } = decoded;
        const currentUserId = _id;

        return User.find({
          _id: {
            $in: [currentUserId, userId]
          }
        }).then(users => {
          // console.log(users)
          const currentUser = currentUserId == users[0]._id ? users[0] : users[1]
          const user = userId == users[0]._id ? users[0] : users[1]
          currentUser.userFollows.push(user)
          user.followers.push(currentUser)

          return Promise.all([currentUser.save(), user.save()]).then(
            ([currentUser, user]) => (currentUser, user)
          )
        })
      }
    }
  })
})

export default mutation;