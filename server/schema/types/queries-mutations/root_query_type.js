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
import SearchUtil from '../../../services/search_util.js';
const User = mongoose.model('User');
const PhotoPost = mongoose.model('PhotoPost');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

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
    currentUser: {
      type: UserType,
      args: { token: { type: GraphQLString } },
      resolve(_, args, ctx) {
        const decoded = jwt.verify(
          args.token,
          keys.secretOrKey
        )
        const { _id } = decoded;

        return User.findById(_id)
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
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    post: {
      type: AnyPostType,
      args: { _id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Post.findById(args._id)
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
    }
  })
})

export default RootQueryType;