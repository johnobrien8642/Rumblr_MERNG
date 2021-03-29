const QueryFragments = {
  PHOTO_POST:`
      _id
      description
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
  `
}

export default QueryFragments;