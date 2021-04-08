
const handleTags = (tags, post, Tag) => {
  const getTagArr = async (tags, post) => {
    return Promise.all(tags.map((t, i) => {
          return asyncTag(t, post)
        }
      )
    )
  }

  const asyncTag = async (t, post) => {
    return findOrCreateTag(t, post)
  }

  const findOrCreateTag = async (t, post) => {
    return Tag.findOne({ title: t }).then(tagFound => {
      if (tagFound) {
        return tagFound
      } else {
        var newTag = new Tag({ title: t })
        return newTag.save().then(tag => {
          return tag
        })
      }
    })
  }
}


const PostCreateUtil = { handleTags };

export default PostCreateUtil;