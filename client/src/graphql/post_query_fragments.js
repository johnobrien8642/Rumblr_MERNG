
const QueryFragments = {
  POST:`
    user {
      _id
      blogName
    }
    descriptions
    descriptionImages {
      _id
      url
      kind
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
    mainImages {
      _id
      url
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
    }
    audioMeta
  `,
  VIDEO_POST:`
    _id
    videoLink {
      _id
      url
    }
  `,
}

export default QueryFragments;