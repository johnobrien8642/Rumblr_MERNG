import graphql from 'graphql';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import Cookies from 'js-cookie';
import UserType from '../objects/user_type.js';
import PhotoPostType from '../objects/photo_post_type.js';
import ImageType from '../objects/image_type.js';
import TagType from '../objects/tag_type.js';
import ImageInputType from '../inputs/image_input_type.js';
import AuthService from '../../../services/auth_util.js';
const PhotoPost = mongoose.model('PhotoPost');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
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
    createPhotoPost: {
      type: PhotoPostType,
      args: {
        mainImages: { type: new GraphQLList(ImageInputType) },
        descriptionImages: { type: new GraphQLList(ImageInputType) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve(_, { mainImages, descriptionImages, tags }, ctx) {
        var post = new PhotoPost();
        
        const getTagArr = async (tags, post) => {
          return Promise.all(tags.map((t, i) => {
                return asyncTag(t, post)
              }
            )
          )
        }

        const asyncTag = async (t, post) => {
          return findOrCreateTag(t, post)
        }

        const findOrCreateTag = async (t, post) => {
          return Tag.findOne({ title: t }).then(tagFound => {
            if (tagFound) {
              tagFound.posts.push(post._id)
              return tagFound.save().then(tag => {
                return tag;
              })
            } else {
              var newTag = new Tag({ title: t })
              newTag.posts.push(post._id)
              return newTag.save().then(tag => {
                return tag
              })
            }
          })
        }

        mainImages.forEach((img, i) => {
          post.mainImages.push(img._id)
        })

        descriptionImages.forEach((img, i) => {
          post.descriptionImages.push(img._id)
        })

        const decoded = jwt.verify(ctx.headers.authorization, keys.secretOrKey)
        const { _id } = decoded;

        console.log(_id)

        return Promise.all([getTagArr(tags, post), User.findById(_id)]).then(
          ([tags, user]) => {
            post.user = user._id
            user.posts.push(post._id)

            tags.forEach((t, i) => {
              post.tags.push(t._id)
            })

            return Promise.all([post.save(), user.save()]).then(
              ([post, user])=> {
                return post
              }
            )
          }
        )
      }
    },
    followUser: {
      type: UserType,
      args: { 
        userId: { type: GraphQLID }
      },
      resolve(parentValue, { userId }, ctx) {
        const decoded = jwt.verify(
          ctx.headers.authorization, 
          keys.secretOrKey
        );
        const { _id } = decoded;
        const currentUserId = _id;

        return User.find({
          _id: {
            $in: [currentUserId, userId]
          }
        }).then(users => {
          const currentUser = currentUserId == users[0]._id ? users[0] : users[1]
          const user = userId == users[0]._id ? users[0] : users[1]
          currentUser.userFollows.push(user)
          user.followers.push(currentUser)

          return Promise.all([currentUser.save(), user.save()]).then(
            ([currentUser, user]) => (currentUser, user)
          )
        })
      }
    },
    followTag: {
      type: TagType,
      args: { 
        tagId: { type: GraphQLID }
      },
      resolve(parentValue, { tagId }, ctx) {
        const decoded = jwt.verify(
          ctx.headers.authorization, 
          keys.secretOrKey
        );
        const { _id } = decoded;
        const currentUserId = _id;

        return Promise.all([Tag.findById(tagId), User.findById(_id)]).then(
          ([tag, user]) => {
            tag.followers.push(user._id)
            user.tagFollows.push(tag._id)
            
            return Promise.all([tag.save(), user.save()]).then(
              ([tag, user]) => (tag, user)
            )
          }
        )
      }
    }
  })
})

export default mutation;