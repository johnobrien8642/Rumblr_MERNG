import graphql from 'graphql';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import Cookies from 'js-cookie';
import UserType from '../objects/user_type.js';
import TextPostType from '../objects/posts/types/text_post_type.js'
import PhotoPostType from '../objects/posts/types/photo_post_type.js';
import ImageType from '../objects/posts/util/image_type.js';
import TagType from '../objects/posts/util/tag_type.js';
import ImageInputType from '../inputs/image_input_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import AuthService from '../../../services/auth_util.js';
import RepostType from '../objects/posts/util/repost_type.js';
import LikeType from '../objects/posts/util/like_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
import AnyPostType from '../unions/any_post_type.js'
import CreateFunctions from '../../../models/posts/types/util/create_functions.js'
import CreatePostUtil from '../../../models/posts/types/util/post_create_util.js'
const TextPost = mongoose.model('TextPost');
const PhotoPost = mongoose.model('PhotoPost');
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Follow = mongoose.model('Follow');
const { GraphQLObjectType, GraphQLID,
        GraphQLString, GraphQLList } = graphql;
const { createPhotoPost, createTextPost,
        createQuotePost } = CreateFunctions;

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
    createPost: {
      type: AnyPostType,
      args: {
        instanceData: { type: GraphQLJSONObject },
      },
      resolve(_, { instanceData }) {
        switch(instanceData.kind) {
          case 'TextPost':
            return createTextPost(instanceData)
          case 'PhotoPost':
            return createPhotoPost(instanceData)
          case 'QuotePost':
            return createQuotePost(instanceData)
          default:
            console.log('no types matched in createPost')
        }
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
    follow: {
      type: FollowType,
      args: {
        user: { type: GraphQLString },
        item: { type: GraphQLString },
        itemKind: { type: GraphQLString }
      },
      resolve(_, { user, item, itemKind }) {
        var follow = new Follow({
          onModel: itemKind
        })
        
        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ blogName: item }),
          Tag.findOne({ title: item }),
        ]).then(([user, followsUser, tag ]) => {
          follow.user = user._id

          if (followsUser) {
            follow.follows = followsUser._id
          } else if (tag) {
            follow.follows = tag._id
          }
          return Promise.all(([follow.save()])).then(([follow]) => follow)
        })
      }
    },
    unfollow: {
      type: FollowType,
      args: {
        followId: { type: GraphQLID }
      },
      resolve(_, { followId }) {
        return Follow.deleteOne({ _id: followId })
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
  })
})

export default mutation;