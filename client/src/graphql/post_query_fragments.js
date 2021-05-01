
const QueryFragments = {
  POST:`
    user {
      _id
      blogName
    }
    descriptions
    descriptionImages {
      _id
      src
      path
      kind
      displayIdx
    }
    tags {
      _id
      title
    }
    mentions {
      _id
      user {
        _id
        blogName
      }
      mention {
        _id
        blogName
      }
    }
    createdAt
    kind
  `,
  PHOTO_POST:`
    _id
    mainImages {
      _id
      src
      kind
      path
    }
  `,
  TEXT_POST:`
    _id
    title
    main
  `,
  QUOTE_POST:`
    _id
    quote
    source
  `,
  LINK_POST:`
    _id
    linkObj
  `,
  CHAT_POST:`
    _id
    chat
  `,
  AUDIO_POST:`
    _id
    audioFile {
      _id
      url
      path
      kind
    }
    audioMeta
  `,
  VIDEO_POST:`
    _id
    videoLink {
      _id
      url
      path
      kind
    }
  `,
}

export default QueryFragments;