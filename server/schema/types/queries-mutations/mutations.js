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
const { deletePost, asyncDeleteAllPosts } = DeleteFunctionUtil;

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
        
        return Promise.all([
          User.findOne({ blogName: user }),
          Post.findById(postId)
        ]).then(([user, foundPost]) => {
          like.user = user._id
          like.post = postId
          like.onModel = postKind

          foundPost.notesCount = foundPost.notesCount + 1
          return Promise.all(([like.save(), foundPost.save()]))
            .then(([like, post]) => (like))
        })
      }
    },
    unlikePost: {
      type: LikeType,
      args: {
        likeId: { type: GraphQLID },
        postId: { type: GraphQLID }
      },
      resolve(_, { likeId, postId }) {
        
        return Promise.all([
          Post.findById(postId),
          Like.deleteOne({ _id: likeId })
        ]).then(([foundPost, like]) => {
          foundPost.notesCount = foundPost.notesCount - 1

          return foundPost.save().then(post => post)
        })
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
        console.log(itemKind)
        var follow = new Follow({
          onModel: itemKind
        })
        var recastItem = mongoose.Types.ObjectId(item)

        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ _id: recastItem }),
          Tag.findOne({ _id: recastItem }),
        ]).then(([user, followsUser, tag ]) => {
          follow.user = user._id
          
          if (followsUser) {
            follow.follows = followsUser._id
            followsUser.followerCount = followsUser.followerCount + 1

            return Promise.all([
              follow.save(),
              followsUser.save(),
              user.save()
            ]).then(([follow, followsUser, user]) => follow)

          } else if (tag) {
            tag.followerCount = tag.followerCount + 1
            console.log(tag._id)
            user.tagFollows.push(tag._id)
            follow.follows = tag._id

            return Promise.all([
              follow.save(),
              user.save(),
              tag.save()
            ]).then(([follow, user, tag]) => follow)
          }
        })
      }
    },
    unfollow: {
      type: FollowType,
      args: {
        user: { type: GraphQLString },
        followId: { type: GraphQLID },
        item: { type: GraphQLID }
      },
      resolve(_, { user, followId, item }) {
        var recastItem = mongoose.Types.ObjectId(item)
        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ _id: recastItem }),
          Tag.findOne({ _id: recastItem }),
        ]).then(([user, followsUser, tag]) => {

          if (followsUser) {
            followsUser.followerCount = followsUser.followerCount - 1

            return Promise.all([
              tag.save(),
              user.save(),
              followsUser.save(),
              Follow.deleteOne({ _id: followId })
            ]).then(([tag, user, followsUser, follow]) => follow)
          } else if (tag) {
            tag.followerCount = tag.followerCount - 1
            user.tagFollows = user.tagFollows.filter(id => id.toString() !== tag._id.toString())

            return Promise.all([
              tag.save(),
              user.save(),
              Follow.deleteOne({ _id: followId })
            ]).then(([tag, user, follow]) => follow)
          }
          
        })
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
          Post.findById(repostData.repostId)
        ]).then(([reposter, reposted, foundPost]) => {
        
          var repostTrailId = 
            repostData.previousReposter ? 
            repostData.previousReposter._id : 
            reposter._id

          var repostCaption = 
            repostData.repostCaption ?
            repostData.repostCaption :
            null
          
          var foundPostObj = foundPost ? foundPost.toObject() : null

          repost.postId = repostData.postId
          repost.post = repostData.postId
          repost.user = reposter._id
          repost.repostedFrom = reposted._id
          repost.onModel = repostData.postKind
          
          repost.repostTrail = foundPost ?
            [...foundPostObj.repostTrail, repostTrailId] :
            [repostTrailId]

          repost.repostCaptions = foundPost ?
            [...foundPostObj.repostCaptions, { caption: repostCaption }] :
            [{ caption: repostCaption }]


          foundPost.notesCount = foundPost.notesCount + 1

          return Promise.all(
            ([repost.save(), foundPost.save()])).then(([repost, post]) => repost)
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
        var { user, postAuthorId, postId, content, kind } = commentData;
        var comment = new Comment();

        return Promise.all([
          User.findOne({ blogName: user }),
          Post.findById(postId)
        ]).then(([user, foundPost]) => {
          comment.user = user._id
          comment.post = postId
          comment.postAuthorId = postAuthorId
          comment.content = content
          comment.onModel = kind

          foundPost.notesCount = foundPost.notesCount + 1
          return Promise.all([comment.save(), foundPost.save()])
            .then(([comment, post]) => comment)
        })
      }
    },
    deleteComment: {
      type: CommentType,
      args: {
        commentId: { type: GraphQLID },
        postId: { type: GraphQLID },
      },
      resolve(parentValue, {
        commentId, postId
      }) {
        return Promise.all([
          Comment.deleteOne({ _id: commentId }),
          Post.findById(postId)
        ]).then(([comment, foundPost]) => {
          foundPost.notesCount = foundPost.notesCount - 1

          return foundPost.save().then(post => post)
        })
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
    updateUserBlogDescription: {
      type: UserType,
      args: {
        blogDescription: { type: GraphQLString },
        password: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        blogDescription, password, user
      }) {
        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              user.blogDescription = blogDescription
              return user.save()
                .then(user => user)
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
    },
    deleteMyAccount: {
      type: UserType,
      args: {
        query: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
      },
      resolve(parentValue, { query, password, token }) {
        return User.findOne({ blogName: query })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              return User.aggregate([
                { $match: { blogName: query } },
                { $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'posts'
                  }
                },
                { $unwind: '$posts' },
                { $replaceRoot: { "newRoot": "$posts" } }
              ]).then(posts => {
                return asyncDeleteAllPosts(posts, deletePost)
                  .then(() => {
                    return User.deleteOne({ blogName: query })
                      .then(() => {
                        return AuthService.logout(token)
                      })
                  })
              })
            } else {
              throw new Error('Password is invalid')
            }
          })
      }
    }
  })
})

'password'

export default mutation;