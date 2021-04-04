import mongoose from 'mongoose';
import graphql from 'graphql';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
// import PhotoPostType from '../objects/photo_post_type.js';
import RepostType from '../objects/posts/util/repost_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
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
const Follow = mongoose.model('Follow');

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
    fetchUserLikes: {
      type: GraphQLList(LikeType),
      args: {
        user: { type: GraphQLString }
      },
      resolve(_, { user }) {
        return User
          .aggregate([
            { $match: { blogName: user } },
            {
              $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'user',
                as: 'likes'
              }
            },
            { $unwind: '$likes' },
            { $replaceRoot: { "newRoot": '$likes' } }
          ]).then(res => res)
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
      type: FollowType,
      args: {
        user: { type: GraphQLString },
        otherUser: { type: GraphQLString }
      },
      resolve(_, {user, otherUser}) {
        return Promise.all(([
          User.find({
            blogName: {
              $in: [user, otherUser]
            }
          })
        ])).then(users => {
            const foundUser = user === users[0][0].blogName ? users[0][0] : users[0][1];
            const foundOtherUser = otherUser === users[0][0].blogName ? users[0][0] : users[0][1];
          
            return Promise.all(([
              Follow
              .aggregate([
                {
                  $lookup: {
                    from: 'follows',
                    let: { user: foundUser._id, otherUser: foundOtherUser._id },
                    pipeline: [
                        { $match: {
                          $expr: {
                            $and: 
                            [
                              { $eq: [ "$user", "$$user" ] },
                              { $eq: [ "$follows", "$$otherUser" ] }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'follow'
                  }
                },
                { $unwind: "$follow" },
                { $replaceRoot: { "newRoot": "$follow" } }
              ])
            ])).then(res => res[0][0])
          })
      }
    },
    doesUserFollowTag: {
      type: FollowType,
      args: {
        user: { type: GraphQLString },
        tagId: { type: GraphQLID}
      },
      resolve(_, {user, tagId}) {
        return Promise.all(([
          User.find({ blogName: user })
        ])).then(user => {
            return Promise.all(([
              Follow
              .aggregate([
                {
                  $lookup: {
                    from: 'follows',
                    let: { user: user._id, tagId: tagId },
                    pipeline: [
                        { $match: {
                          $expr: {
                            $and: 
                            [
                              { $eq: [ "$user", "$$user" ] },
                              { $eq: [ "$follows", "$$tagId" ] }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'follow'
                  }
                },
                { $unwind: "$follow" },
                { $replaceRoot: { "newRoot": "$follow" } }
              ])
            ])).then(res => res[0][0])
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
    fetchFollowedUsers: {
      type: GraphQLList(FollowType),
      args: {
        user: { type: GraphQLString }
      },
      resolve(parentValue, { user }) {
        return User.aggregate([
          { $match: { blogName: user } },
          {
            $lookup: {
              from: 'follows',
              let: { user: '$_id', onModel: 'User' },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$user", "$$user" ] },
                        { $eq: [ "$onModel", "$$onModel" ]}
                      ]
                    }
                  }
                }
              ],
              as: 'followedUsers'
            }
          },
          { $unwind: "$followedUsers" },
          { $replaceRoot: { "newRoot": "$followedUsers" } }
        ]).then(res => res)
      }
    },
    fetchTagFeed: {
      type: new GraphQLList(AnyPostType),
      args: { query: { type: GraphQLString } },
      resolve(_, { query }) {
        var hashedQuery = '#' + query

        return Tag.aggregate([
          { $match: { title: hashedQuery } },
              { $lookup: {
                  from: 'posts',
                  localField: '_id',
                  foreignField: 'tags',
                  as: 'postsWithTag'
                }
              },
              { $unwind: "$postsWithTag" },
              { $replaceRoot: { "newRoot": "$postsWithTag" } },
              { $sort: { "createdAt": -1 } }
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
      args: { tagTitle: { type: GraphQLString } },
      resolve(_, {tagTitle}) {
        return Tag.findOne({ title: tagTitle })
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