import graphql from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import UserType from '../objects/user_type.js';
import AuthService from '../../../services/auth_util.js';
import RepostType from '../objects/posts/util/repost_type.js';
import LikeType from '../objects/posts/util/like_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
import AnyPostType from '../unions/any_post_type.js'
import createPost from '../../../models/posts/types/util/create_function.js'
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Follow = mongoose.model('Follow');
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
    createPost: {
      type: AnyPostType,
      args: {
        instanceData: { type: GraphQLJSONObject },
      },
      resolve(_, { instanceData }) {
        return createPost(instanceData)
      }
    },
    deletePost: {
      type: GraphQLID,
      args: {
        postId: { type: GraphQLID }
      },
      resolve(_, { postId }) {
        var recastPostId = mongoose.Types.ObjectId(postId)
        return Promise.all([
          Post.deleteOne({ _id: recastPostId }),
          Like.deleteMany({ post: recastPostId }),
          Repost.deleteOne({ _id: recastPostId }),
          Repost.deleteMany({ post: recastPostId })
        ]).then(([ogPost, like, repost, reposts]) => (postId))}
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
        repostData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        repostData
      }) {
        var repost = new Repost();
        
        return Promise.all([
          User.findOne({ blogName: repostData.user }),
          User.findOne({ blogName: repostData.repostedFrom }),
        ]).then(([reposter, reposted]) => {
          repost.post = repostData.postId
          repost.user = reposter._id
          repost.repostedFrom = reposted._id
          repost.repostCaption = repostData.repostCaption
          repost.onModel = repostData.postKind
          return Promise.all(
            ([repost.save()])).then(([repost]) => repost)
        })
      }
    }
  })
})

export default mutation;