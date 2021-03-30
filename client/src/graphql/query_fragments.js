
const QueryFragments = {
  PHOTO_POST:`
      _id
      description
      reposter
      repostCaption
      createdAt
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
      }
      tags {
        _id
        title
      }
      likes {
        _id
      }
  `
}

export default QueryFragments;