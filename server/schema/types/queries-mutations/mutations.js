import graphql from 'graphql';
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import UserType from '../objects/user_type.js';
import AuthService from '../../../services/auth_util.js';
import RepostType from '../objects/posts/util/repost_type.js';
import LikeType from '../objects/posts/util/like_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
import CommentType from '../objects/posts/util/comment_type.js';
import AnyPostType from '../unions/any_post_type.js';
import createOrUpdatePost from '../../../models/posts/types/util/create_or_update_function.js';
import DeleteFunctionUtil from '../../../models/posts/types/util/delete_function_util.js';
const { deletePost } = DeleteFunctionUtil;

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment')
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
    createOrUpdatePost: {
      type: AnyPostType,
      args: {
        instanceData: { type: GraphQLJSONObject },
      },
      resolve(_, { instanceData }) {
        return createOrUpdatePost(instanceData)
      }
    },
    deletePost: {
      type: GraphQLID,
      args: {
        post: { type: GraphQLJSONObject }
      },
      resolve(_, { post }) {
        return deletePost(post)
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
    },
    comment: {
      type: CommentType,
      args: {
        commentData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        commentData
      }) {
        var { user, postId, content, kind } = commentData;
        var comment = new Comment();

        return Promise.all([
          User.findOne({ blogName: user })
        ]).then(([user]) => {
          comment.user = user._id
          comment.post = postId
          comment.content = content
          comment.onModel = kind

          return Promise.all([comment.save()])
            .then(([comment]) => comment)
        })
      }
    },
    deleteComment: {
      type: CommentType,
      args: {
        commentId: { type: GraphQLID }
      },
      resolve(parentValue, {
        commentId
      }) {
        return Promise.all([
          Comment.deleteOne({ _id: commentId })
        ])
      }
    },
    updateUserEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        email, password, user
      }) {
        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              if (Validator.isURL(email)) {
                return User.findOne({ email: email })
                  .then(userExists => {
                    if (!userExists) {
                      user.email = email
                      return user.save()
                        .then(user => user)
                    } else {
                      return new Error('This email already exists')
                    }
                  })
              }
            }
          })
      }
    },
    updateUserPassword: {
      type: UserType,
      args: {
        currentPW: { type: GraphQLString },
        newPassword: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        currentPW, newPassword, user
      }) {
        if (!Validator.isLength(newPassword, { min: 7, max: 33})) {
          return new Error("Password length must be between 8 and 32 characters")
        }

        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(currentPW, user.password)) {
              var alreadyUsed = false

              user.oldPasswords.forEach(oldPw => {
                if (bcrypt.compareSync(newPassword, oldPw)) {
                  alreadyUsed = true
                }
              })

              if (!alreadyUsed) {
                return bcrypt.hash(newPassword, 10)
                  .then(newHash => {
                    user.oldPasswords.push(user.password)
                    user.password = newHash
                  })
              } else {
                throw new Error("Choose a password you haven't used before")
              }
            }
          })
      }
    },
    addFilterTag: {
      type: UserType,
      args: { 
        tag: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { tag, user }) {
        return User.findOne({ blogName: user })
          .then(user => {
      
            user.filteredTags.push(tag)
            
            var uniqArr = new Set(user.filteredTags)

            user.filteredTags = Array.from(uniqArr)

            return user.save()
              .then(user => user)
        })
      }
    },
    deleteFilterTag: {
      type: UserType,
      args: { 
        tag: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { tag, user }) {
        return User.findOne({ blogName: user })
        .then(user => {

          var filtered = user.filteredTags.filter(t => t !== tag)

          user.filteredTags = filtered

          return user.save()
            .then(user => user)
      })
      }
    },
    addFilterPostContent: {
      type: UserType,
      args: { 
        postContent: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { postContent, user }) {
        return User.findOne({ blogName: user })
          .then(user => {

            user.filteredPostContent.push(postContent)
            
            var uniqArr = new Set(user.filteredPostContent)

            user.filteredPostContent = Array.from(uniqArr)

            return user.save()
              .then(user => user)
        })
      }
    },
    deleteFilterPostContent: {
      type: UserType,
      args: { 
        postContent: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { postContent, user }) {
        return User.findOne({ blogName: user })
        .then(user => {

          var filtered = user.filteredPostContent.filter(pc => pc !== postContent)

          user.filteredPostContent = filtered

          return user.save()
            .then(user => user)
      })
      }
    }
  })
})

'password'

export default mutation;