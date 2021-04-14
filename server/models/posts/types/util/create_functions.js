import mongoose from 'mongoose'
const TextPost = mongoose.model('TextPost')
const PhotoPost = mongoose.model('PhotoPost')
const QuotePost = mongoose.model('QuotePost')
const LinkPost = mongoose.model('LinkPost')
const ChatPost = mongoose.model('ChatPost')
const AudioPost = mongoose.model('AudioPost')
const VideoPost = mongoose.model('VideoPost')
const User = mongoose.model('User')
const Tag = mongoose.model('Tag')

const createTextPost = ({
  title, main,
  descriptions,
  descriptionImages, 
  user, tags
}) => {
  var post = new TextPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      post.title = title
      post.main = main
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })
      post.user = user._id

      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const createPhotoPost = ({
    mainImages, 
    descriptionImages, 
    descriptions,
    tags, user
  }) => {
    var post = new PhotoPost();
    
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
  
    mainImages.forEach((img, i) => {
      post.mainImages.push(img._id)
    })
  
    descriptionImages.forEach((img, i) => {
      post.descriptionImages.push(img._id)
    })
    
    return Promise.all([
      getTagArr(tags, post), 
      User.findOne({ blogName: user })
    ]).then(
      ([tags, user]) => {
        descriptions.forEach((obj, i) => {
          post.descriptions.push(obj)
        })
        post.user = user._id
  
        tags.forEach((t, i) => {
          post.tags.push(t._id)
        })
  
        return Promise.all([post.save(), user.save()]).then(
          ([post, user])=> (post)
        )
      }
    )
}

const createQuotePost = ({
  quote, source, descriptions, 
  descriptionImages, 
  tags, user, 
}) => {
  var post = new QuotePost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.quote = quote
      post.source = source
      post.user = user._id

      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const createLinkPost = ({
  linkObj, descriptions,
  descriptionImages,
  tags, user,
}) => {
  var post = new LinkPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.linkObj = linkObj
      post.user = user._id
      console.log(post)
      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const createChatPost = ({
  chat, descriptions,
  descriptionImages,
  tags, user,
}) => {
  var post = new ChatPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.chat = chat
      post.user = user._id
      
      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const createAudioPost = ({
  audioFile, audioMeta, 
  descriptions,
  descriptionImages,
  tags, user,
}) => {
  var post = new AudioPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.audioMeta = audioMeta
      post.audioFile = audioFile
      post.user = user._id
      
      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const createVideoPost = ({
  videoLink,
  descriptions,
  descriptionImages,
  tags, user,
}) => {
  var post = new VideoPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.videoLink = videoLink
      post.user = user._id
      
      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const CreateFunctions = {
  createPhotoPost, createTextPost,
  createQuotePost, createLinkPost,
  createChatPost, createAudioPost,
  createVideoPost
}

export default CreateFunctions;