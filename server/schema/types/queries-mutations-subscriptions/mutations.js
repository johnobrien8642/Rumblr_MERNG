import graphql from 'graphql';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import Cookies from 'js-cookie';
import UserType from '../objects/user_type.js';
import TextPostType from '../objects/posts/text_post_type.js'
import PhotoPostType from '../objects/posts/photo_post_type.js';
import ImageType from '../objects/image_type.js';
import TagType from '../objects/tag_type.js';
import ImageInputType from '../inputs/image_input_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import AuthService from '../../../services/auth_util.js';
import RepostType from '../objects/repost_type.js';
import LikeType from '../objects/like_type.js';
import AnyPostType from '../unions/any_post_type.js'
const TextPost = mongoose.model('TextPost');
const PhotoPost = mongoose.model('PhotoPost');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const { GraphQLObjectType, GraphQLID,
        GraphQLString, GraphQLList } = graphql;

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    registerUser: {
      type: UserType,
      args: {
        blogName: { type: GraphQLString },
        blogDescription: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(_, args, ctx) {
        return AuthService.register(args, ctx).then(res => {
          ctx.headers.authorization = JSON.stringify(res.token)
          return res
        })
      }
    },
    logoutUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, { token }) {
        return AuthService.logout(token)
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
    likePost: {
      type: LikeType,
      args: {
        postId: { type: GraphQLID },
        user: { type: GraphQLString },
        postKind: { type: GraphQLString }
      },
      resolve(_, { postId, user, postKind }) {
        var like = new Like();
        
        return User.findOne({ blogName: user })        
          .then((user) => {
            like.user = user._id
            like.post = postId
            like.onModel = postKind
            return Promise.all(([like.save()]))
              .then(([like]) => (like))
          })
      }
    },
    unlikePost: {
      type: LikeType,
      args: {
        likeId: { type: GraphQLID },
      },
      resolve(_, { likeId }) {
        return Like.deleteOne({ _id: likeId })
      }
    },
    createTextPost: {
      type: TextPostType,
      args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        descriptionImages: { type: new GraphQLList(ImageInputType) },
        user: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve(_, { 
        title, body, 
        descriptionImages, 
        user, tags
      }) {
        return TextPost
          .create(
            title, body,
            descriptionImages,
            user, tags 
          )
      }
    },
    createPhotoPost: {
      type: PhotoPostType,
      args: {
        mainImages: { type: new GraphQLList(ImageInputType) },
        descriptionImages: { type: new GraphQLList(ImageInputType) },
        description: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        user: { type: GraphQLString }
      },
      resolve(_, { 
        mainImages, 
        descriptionImages, 
        description, tags,
        user
      }) {
        return PhotoPost
          .create(
            mainImages, 
            descriptionImages, 
            description, tags, 
            user
          )
      }
    },
    followUser: {
      type: UserType,
      args: { 
        currentUser: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { user, currentUser }) {
        return Promise.all([
          User.findOne({ blogName: user }), 
          User.findOne({ blogName: currentUser })
        ]).then(([user, currentUser]) => {
          currentUser.userFollowing.push(user)
          user.followers.push(currentUser)

          return Promise.all([user.save(), currentUser.save()]).then(
            ([user, currentUser]) => (user, currentUser)
          )
        })
      }
    },
    unfollowUser: {
      type: UserType,
      args: { 
        currentUser: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { currentUser, user }) {
        return User.find({
          blogName: {
            $in: [currentUser, user]
          }
        }).then(users => {
          const currentUserFound = currentUser == users[0].blogName ? users[0] : users[1]
          const userFound = user == users[0].blogName ? users[0] : users[1]
          
          var currentUserFiltered = 
            currentUserFound.userFollowing.filter(u => {
               if (u == userFound._id.toString()) {
                 return false
               } else {
                 return true
               }
            })

          var userFiltered = 
            userFound.followers.filter(u => {
              if (u == currentUserFound._id.toString()) {
                return false
              } else {
                return true
              }
            })
          
          currentUserFound.userFollowing = currentUserFiltered
          userFound.followers = userFiltered

          return Promise.all([currentUserFound.save(), userFound.save()]).then(
            ([currentUser, user]) => (currentUser, user)
          )
        })
      }
    },
    followTag: {
      type: TagType,
      args: { 
        tagId: { type: GraphQLID },
        blogName: { type: GraphQLString }
      },
      resolve(parentValue, { tagId, blogName }) {
        
        return Promise.all([
          Tag.findById(tagId), 
          User.findOne({ blogName: blogName })
        ]).then(
          ([tag, user]) => {
            if (user.tagFollows.includes(tag._id)) return;
        
            tag.followers.push(user._id)
            user.tagFollows.push(tag._id)
            
            return Promise.all([tag.save(), user.save()]).then(
              ([tag, user]) => (tag)
            )
          }
        )
      }
    },
    repost: {
      type: RepostType,
      args: { 
        postId: { type: GraphQLID },
        repostCaption: { type: GraphQLString },
        user: { type: GraphQLString },
        repostedFrom: { type: GraphQLString },
        postKind: { type: GraphQLString }
      },
      resolve(parentValue, {
        postId, repostCaption,
        user, repostedFrom,
        postKind
      }) {
        var repost = new Repost();
        
        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ blogName: repostedFrom }),
        ]).then(([reposter, reposted]) => {
          repost.post = postId
          repost.user = reposter._id
          repost.repostedFrom = reposted._id
          repost.repostCaption = repostCaption
          repost.onModel = postKind
          return Promise.all(
            ([repost.save()])).then(([repost]) => repost)
        })
      }
    }
    // unfollowTag: {
    //   type: UserAndTagType,
    //   args: { 
    //     tagId: { type: GraphQLID },
    //     token: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { tagId }, ctx) {
    //     const decoded = jwt.verify(
    //       ctx.headers.authorization, 
    //       keys.secretOrKey
    //     );
    //     const { _id } = decoded;

    //     return Promise.all([Tag.findById(tagId), User.findById(_id)]).then(
    //       ([tag, user]) => {

    //         tag.followers.push(user._id)
    //         user.tagFollows.push(tag._id)
            
    //         return Promise.all([tag.save(), user.save()]).then(
    //           ([tag, user]) => (tag, user)
    //         )
    //       }
    //     )
    //   }
    // }
  })
})

export default mutation;