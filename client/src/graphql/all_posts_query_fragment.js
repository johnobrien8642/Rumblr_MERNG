import PostQueryFragments from './post_query_fragments.js'
const { POST, TEXT_POST, PHOTO_POST, 
        QUOTE_POST, LINK_POST, CHAT_POST,
        AUDIO_POST, VIDEO_POST } = PostQueryFragments;

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
    ... on AudioPostType {
      ${AUDIO_POST}
      ${POST}
    }
    ... on VideoPostType {
      ${VIDEO_POST}
      ${POST}
    }
  `
}

export default AllQueryFragment;