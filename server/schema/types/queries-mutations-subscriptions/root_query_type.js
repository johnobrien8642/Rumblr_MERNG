import mongoose from 'mongoose';
import graphql from 'graphql';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
// import PhotoPostType from '../objects/photo_post_type.js';
import RepostType from '../objects/posts/util/repost_type.js';
import ImageType from '../objects/posts/util/image_type.js';
import TagType from '../objects/posts/util/tag_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import UserAndTagInputType from '../inputs/user_and_tag_input_type.js'
import AnyPostType from '../unions/any_post_type.js'
import LikeType from '../objects/posts/util/like_type.js'
import SearchUtil from '../../../services/search_util.js';
const User = mongoose.model('User');
const TextPost = mongoose.model('TextPost');
const PhotoPost = mongoose.model('PhotoPost');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');
const Like = mongoose.model('Like');
const Repost = mongoose.model('Repost');

const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLBoolean } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    usersAndTags: {
      type: new GraphQLList(UserAndTagType),
      args: { filter: { type: UserAndTagInputType } },
      async resolve(_, { filter }, ctx) {
        let query = filter ? {$or: SearchUtil.buildFilters(filter)} : '';

        if (query.$or.length === 0) {
          return []
        }
        
        const users = async (query) => {
          return await User.find(query.$or[0]).exec();
        }

        const tags = async (query) => {
          return await Tag.find(query.$or[1]).exec();
        }
        
        const decoded = jwt.verify(ctx.headers.authorization, keys.secretOrKey)
        const { _id } = decoded;

        return Promise.all([
          users(query), 
          tags(query), 
          User.findById(_id)
        ]).then(
            ([users, tags, user]) => {
              var filteredTags = tags.filter(tag => 
                !user.tagFollows.includes(tag._id)
              )
              return [...users, ...filteredTags]
            }
          )
        }
    },
    fetchMatchingTags: {
      type: new GraphQLList(TagType),
      args: { filter: { type: GraphQLString } },
      resolve(_, {filter}) {
        if (filter === '') {
          return [];
        }
        let query = {};
        query.title = new RegExp(filter);
        
        const tags = async (query) => {
          return await Tag.find(query).exec()
        }

        return Promise.all([tags(query)]).then(([tags]) => {
          return [...tags]
        })
      }
    },
    doesUserLikePost: {
      type: LikeType,
      args: {
        user: { type: GraphQLString },
        postId: { type: GraphQLID }
      },
      resolve(_, {user, postId}) {
        var recastPostId = mongoose.Types.ObjectId(postId)

        return User.aggregate([
          { $match: { blogName: user } },
          {
            $lookup: {
              from: 'likes',
              let: { userId: "$_id", postId: recastPostId },
              pipeline: [
                { $match: {
                    $expr: {
                      $and: 
                        [
                          { $eq: [ "$user", "$$userId" ] },
                          { $eq: [ "$post", "$$postId" ] }
                        ]
                    }
                  }
                },
              ],
              as: "like"
            }
          },
          { $unwind: "$like" },
          { $replaceRoot: { "newRoot": "$like" } }
        ]).then(res => res[0])
      }
    },
    doesUserFollowUser: {
      type: GraphQLBoolean,
      args: {
        currentUser: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(_, {currentUser, userId}) {
        return User
          .findOne({ blogName: currentUser })
          .populate('userFollowing')
          .then(user => {

            var found = false;
            user.userFollowing.forEach((user, i) => {
              if (user._id == userId) {
                found = true
              }
            })
            return found
          })
      }
    },
    fetchUserFeed: {
      type: new GraphQLList(AnyPostType),
      args: { query: { type: GraphQLString } },
      resolve(_, { query }) {
        return Promise.all([
          User.aggregate([
              { $match: { blogName: query } },
              { $lookup: {
                  from: 'posts',
                  localField: '_id',
                  foreignField: 'user',
                  as: 'posts'
                }
              },
              { $unwind: "$posts" },
              { $replaceRoot: { "newRoot": "$posts" } },
            ],
          ),
          User.aggregate([
              { $match: { blogName: query } },
              { $lookup: {
                  from: 'posts',
                  localField: 'userFollowing',
                  foreignField: 'user',
                  as: 'userFollowingPosts'
                }
              },
              { $unwind: "$userFollowingPosts" },
              { $replaceRoot: { "newRoot": "$userFollowingPosts" } },
            ],
          ),
        ]).then(([posts, userFollowingPosts]) => {
          var allPosts = [...posts, ...userFollowingPosts]
          return allPosts.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime()
          })
        })    
      }
    },
    fetchTagFeed: {
      type: new GraphQLList(AnyPostType),
      args: { query: { type: GraphQLString } },
      resolve(_, { query }) {
        var hashedQuery = '#' + query

        return Tag.aggregate([
          {
            $match: {
              title: hashedQuery
            }
          },
          {
            $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: 'tags',
              as: 'posts'
            }
          },
          {
            $unwind: "$posts"
          },
          {
            $replaceRoot: {
              "newRoot": "$posts"
            }
          },
          {
            $sort : { createdAt: -1 }
          }
        ]).then(res => res)
      }
    },
    user: {
      type: UserType,
      args: { blogName: { type: GraphQLString } },
      resolve(parentValue, { blogName }) {
        return User.findOne({ blogName: blogName })
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    post: {
      type: AnyPostType,
      args: { 
        postId: { type: GraphQLID },
        type: { type: GraphQLString }
      },
      resolve(parentValue, { postId, type }) {
        // console.log(postId)
        // console.log(type)
        switch(type) {
          case 'TextPostType':
            return TextPost.findById(postId)
          case 'PhotoPostType':
            return PhotoPost.findById(postId)
          default:
            return 'no types matched'
        }
      }
    },
    postById: {
      type: AnyPostType,
      args: { 
        postId: { type: GraphQLID },
      },
      resolve(parentValue, { postId, type }) {
        switch(type) {
          case 'TextPostType':
            return TextPost.findById(postId)
          case 'PhotoPostType':
            return PhotoPost.findById(postId)
          default:
            return 'no types matched'
        }
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
    },
    tags: {
      type: new GraphQLList(TagType),
      resolve() {
        return Tag.find({})
      }
    },
    tag: {
      type: TagType,
      args: { _id: { type: GraphQLID } },
      resolve(_, {_id}) {
        return Tag.findById(_id)
      }
    },
    like: {
      type: LikeType,
      args: { _id: { type: GraphQLID } },
      resolve(_, {_id}) {
        return Like.findById(_id)
      }
    },
    repost: {
      type: RepostType,
      args: { _id: { type: GraphQLID } },
      resolve(_, {_id}) {
        return Repost.findById(_id)
      }
    }
  })
})

export default RootQueryType;