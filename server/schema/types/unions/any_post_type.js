import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import TextPostType from '../objects/posts/types/text_post_type.js';
import PhotoPostType from '../objects/posts/types/photo_post_type.js';
import RepostType from '../objects/posts/util/repost_type.js'

const AnyPostType = new GraphQLUnionType({
  name: 'AnyPostType',
  types: () => [ RepostType, TextPostType, PhotoPostType ],
  resolveType(value) {
    // console.log(value)
    if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'TextPost') {
      return TextPostType
    } else if (value.kind === 'PhotoPost') {
      return PhotoPostType
    } 
  }
})

export default AnyPostType;