import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import RepostType from '../objects/posts/util/repost_type.js'
import MentionType from '../objects/posts/util/mention_type.js';
import CommentType from '../objects/posts/util/comment_type.js';
import FollowType from '../objects/posts/util/follow_type.js';

const AnyActivityType = new GraphQLUnionType({
  name: 'AnyActivityType',
  types: () => [ 
    RepostType, MentionType, 
    CommentType, FollowType
  ],
  resolveType(value) {
    if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'Mention') {
      return MentionType
    } else if (value.kind === 'Comment') {
      return CommentType
    } else if (value.kind === 'Follow') {
      return FollowType
    }
  }
})

export default AnyActivityType;