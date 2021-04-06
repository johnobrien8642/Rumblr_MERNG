
const QueryFragments = {
  PHOTO_POST:`
    _id
    descriptions
    user {
      _id
      blogName
    }
    mainImages {
      _id
      url
    }
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
  TEXT_POST:`
    _id
    descriptionImages {
      _id
      url
    }
    user {
      _id
      blogName
    }
    tags {
      _id
      title
    }
    title
    body
    createdAt
    kind
  `,
}

export default QueryFragments;