import graphql from'graphql';
const { GraphQLUnionType } = graphql;
import RepostType from '../objects/posts/util/repost_type.js'
import TextPostType from '../objects/posts/types/text_post_type.js';
import PhotoPostType from '../objects/posts/types/photo_post_type.js';
import QuotePostType from '../objects/posts/types/quote_post_type.js'

const AnyPostType = new GraphQLUnionType({
  name: 'AnyPostType',
  types: () => [ 
    RepostType, TextPostType, 
    PhotoPostType, QuotePostType 
  ],
  resolveType(value) {
    if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'TextPost') {
      return TextPostType
    } else if (value.kind === 'PhotoPost') {
      return PhotoPostType
    } else if (value.kind === 'QuotePost') {
      return QuotePostType
    }
  }
})

export default AnyPostType;