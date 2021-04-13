import PostQueryFragments from './post_query_fragments.js'
const { POST, TEXT_POST, PHOTO_POST, 
        QUOTE_POST, LINK_POST, CHAT_POST } = PostQueryFragments;

const AllQueryFragment = {
  ALL_POSTS:`
    ... on TextPostType {
      ${TEXT_POST}
      ${POST}
    }
    ... on PhotoPostType {
      ${PHOTO_POST}
      ${POST}
    }
    ... on QuotePostType {
      ${QUOTE_POST}
      ${POST}
    }
    ... on LinkPostType {
      ${LINK_POST}
      ${POST}
    }
    ... on ChatPostType {
      ${CHAT_POST}
      ${POST}
    }
  `
}

export default AllQueryFragment;