import mongoose from 'mongoose';
import graphql, { GraphQLInputObjectType } from 'graphql';
import UserType from '../objects/user_type.js';
import PostType from '../objects/post_type.js';
import ImageType from '../objects/image_type.js';
import TagType from '../objects/tag_type.js';
import UserAndPostType from '../unions/user_and_post_type.js';
import UserAndPostInputType from '../inputs/user_and_post_input_type.js'
import SearchUtil from '../../../services/search_util.js';
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    usersAndPosts: {
      type: new GraphQLList(UserAndPostType),
      args: { filter: { type: UserAndPostInputType } },
      async resolve(_, { filter }) {
        let query = filter ? {$or: SearchUtil.buildFilters(filter)} : '';

        if (query.$or.length === 0) {
          return []
        }

        const users = async (query) => {
          return await User.find(query.$or[0]).exec();
        }
        
        return Promise.all([users(query)]).then(
          ([users]) => {
            return [...users]
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
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, args) {
        return User.findById(args._id)
      }
    },
    post: {
      type: PostType,
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