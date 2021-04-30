
const QueryFragments = {
  POST:`
    body
    user {
      _id
      blogName
    }
    tags {
      _id
      title
    }
    createdAt
    kind
  `,
  PHOTO_POST:`
    _id
    mainImages
  `,
  TEXT_POST:`
    _id
    title
    body
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