import mongoose from 'mongoose';
import graphql from 'graphql';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
// import PhotoPostType from '../objects/photo_post_type.js';
import ImageType from '../objects/image_type.js';
import TagType from '../objects/tag_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import UserAndTagInputType from '../inputs/user_and_tag_input_type.js'
import AnyPostType from '../unions/any_post_type.js'
import LikeType from '../objects/like_type.js'
import SearchUtil from '../../../services/search_util.js';
const User = mongoose.model('User');
const PhotoPost = mongoose.model('PhotoPost');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');
const Like = mongoose.model('Like')
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, 
        GraphQLNonNull, GraphQLBoolean } = graphql;

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
        return User
          .findOne({ blogName: user })
          .populate('likes')
          .then(user => {
            var found = {};
            user.likes.forEach((like, i) => {
              if (like.post._id == postId) {
                found = like
              }
            })
            return found
          })
      }
    },
    fetchUserFeed: {
      type: new GraphQLList(AnyPostType),
      args: { blogName: { type: GraphQLString } },
      resolve(_, { blogName }) {
        return User
          .findOne({ blogName: blogName})
          .populate('posts')
          .populate({ 
            path: 'reposts',
            populate: { path: 'post' }
          })
          .populate({ 
            path: 'userFollowing',
            populate: { path: 'posts' }
          })
          .populate({ 
            path: 'tagFollows',
            populate: { path: 'posts' }
          })
          .then(user => {
            var allPosts = [...user.posts];

            user.reposts.forEach((repost, i) => {
              // console.log(repost.post)
              allPosts = [...allPosts, repost.post]
            })
            
            user.userFollowing.forEach((user, i) => {
              allPosts = [...allPosts, ...user.posts]
            })
          
            user.tagFollows.forEach((tag, i) => {
              allPosts = [...allPosts, ...tag.posts]
            })

            allPosts.sort((a, b) => {
              return (b.createdAt.getTime() - a.createdAt.getTime())
            })
            return allPosts
          })
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
        typename: { type: GraphQLString }
      },
      resolve(parentValue, { postId, typename }) {
        switch(typename) {
          case 'PhotoPostType':
            return PhotoPost.findById(postId)
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
    }
  })
})

export default RootQueryType;