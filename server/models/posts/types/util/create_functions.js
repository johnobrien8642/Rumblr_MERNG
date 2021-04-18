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
const Image = mongoose.model('Image')

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

  const createImagesFromLinks = async (imageLinks) => {
    return Promise.all(imageLinks.map(link => {
          return asyncImageLink(link)
        }
      )
    )
  }

  const asyncImageLink = async (link) => {
    var img = new Image()
    img.src = link.src
    img.displayIdx = link.displayIdx

    return img.save().then(img => {
      return img
    })
  }

  const updateUploadDispIdx = async (uploads) => {
    return Promise.all(uploads.map(upload => {
      return asyncUpdateUpload(upload)
    }))
  }

  const asyncUpdateUpload = async (upload) => {
    return Image.findById(upload._id).then(img => {
      img.displayIdx = upload.displayIdx
      return img.save().then(img => {
        return img
      })
    })
  }

  var uploads = descriptionImages.filter(obj => obj._id !== null)
  var imageLinks = descriptionImages.filter(obj => obj.srcType === 'newImgLink')
  
  return Promise.all([
    createImagesFromLinks(imageLinks),
    updateUploadDispIdx(uploads),
    getTagArr(tags, post),
    User.findOne({ blogName: user })
  ]).then(
    ([linkImages, updatedUploadImgs, tags, user]) => {
      post.title = title
      post.main = main

      var allImgObjs = [...linkImages, ...updatedUploadImgs]
      allImgObjs.sort((a, b) => a.displayIdx - b.displayIdx)

      allImgObjs.forEach(obj => {
        post.descriptionImages.push(obj._id)
      })
  
      descriptions.forEach((obj, i) => {
        post.descriptions.push(obj)
      })

      post.user = user._id

      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save()]).then(
        ([post])=> (post)
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

    const createImagesFromLinks = async (imageLinks) => {
      return Promise.all(imageLinks.map(link => {
            return asyncImageLink(link)
          }
        )
      )
    }
  
    const asyncImageLink = async (link) => {
      var img = new Image()
      img.src = link.src
      img.displayIdx = link.displayIdx
  
      return img.save().then(img => {
        return img
      })
    }
  
    const updateUploadDispIdx = async (uploads) => {
      return Promise.all(uploads.map(upload => {
        return asyncUpdateUpload(upload)
      }))
    }
  
    const asyncUpdateUpload = async (upload) => {
      return Image.findById(upload._id).then(img => {
        img.displayIdx = upload.displayIdx
        return img.save().then(img => {
          return img
        })
      })
    }

    var mainUploads = mainImages.filter(obj => obj._id !== null)
    var mainImageLinks = mainImages.filter(obj => obj.srcType === 'newImgLink')
    var bodyUploads = descriptionImages.filter(obj => obj._id !== null)
    var bodyImageLinks = descriptionImages.filter(obj => obj.srcType === 'newImgLink')
    
    return Promise.all([
      createImagesFromLinks(mainImageLinks),
      createImagesFromLinks(bodyImageLinks),
      updateUploadDispIdx(mainUploads),
      updateUploadDispIdx(bodyUploads),
      getTagArr(tags, post), 
      User.findOne({ blogName: user })
    ]).then(
      ([
        mainLinkImages,
        bodyLinkImages,
        updatedMainUploadImgs,
        updatedBodyUploadImgs,
        tags, 
        user
      ]) => {
        var allMainImgObjs = [
          ...mainLinkImages,
          ...updatedMainUploadImgs,
        ]

        var allBodyImgObjs = [
          ...bodyLinkImages,
          ...updatedBodyUploadImgs,
        ]

        allMainImgObjs.sort((a, b) => a.displayIdx - b.displayIdx)
        allBodyImgObjs.sort((a, b) => a.displayIdx - b.displayIdx)

        allMainImgObjs.forEach(obj => {
          post.mainImages.push(obj._id)
        })

        allBodyImgObjs.forEach(obj => {
          post.descriptionImages.push(obj._id)
        })

        descriptions.forEach((obj, i) => {
          post.descriptions.push(obj)
        })
        post.user = user._id
  
        tags.forEach((t, i) => {
          post.tags.push(t._id)
        })
  
        return Promise.all([post.save()]).then(
          ([post])=> (post)
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