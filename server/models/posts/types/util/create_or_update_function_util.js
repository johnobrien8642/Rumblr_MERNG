import mongoose from 'mongoose';
const TextPost = mongoose.model('TextPost')
const PhotoPost = mongoose.model('PhotoPost')
const QuotePost = mongoose.model('QuotePost')
const LinkPost = mongoose.model('LinkPost')
const ChatPost = mongoose.model('ChatPost')
const AudioPost = mongoose.model('AudioPost')
const VideoPost = mongoose.model('VideoPost')
const Tag = mongoose.model('Tag')
const Image = mongoose.model('Image')

//create instance

const createInstance = (kind) => {
  switch(kind) {
    case 'TextPost':
      return new TextPost()
    case 'PhotoPost':
      return new PhotoPost()
    case 'QuotePost':
      return new QuotePost()
    case 'LinkPost':
      return new LinkPost()
    case 'ChatPost':
      return new ChatPost()
    case 'AudioPost':
      return new AudioPost()
    case 'VideoPost':
      return new VideoPost()
    default:
      return
  }
}

//handle tags

const getTagArr = async (tags, asyncTag, findOrCreateTag) => {
  return Promise.all(tags.map((t, i) => {
        return asyncTag(t, findOrCreateTag)
      }
    )
  )
}

const asyncTag = async (t, findOrCreateTag) => {
  return findOrCreateTag(t)
}

const findOrCreateTag = async (t) => {
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

//handle image links

const createImagesFromLinks = async (imageLinks, asyncImageLink) => {
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

//handle updating uploaded image files

const updateUploadDispIdx = async (uploads, asyncUpdateUpload) => {
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

//filtering

const returnInstancesOnly = (imgArr) => {
  return imgArr.filter(obj => {
    if (
      obj.srcType !== 'text' &&
      obj.srcType !== 'oldText' &&
      obj._id !== null
    ) {
      return true
    } else {
      return false
    }
  })
}

const returnNewImageLinksOnly = (imgArr) => {
  // console.log('Return New Image Links')
  // console.log(imgArr)
  return imgArr.filter(obj => obj.srcType === 'newImgLink')
}

const returnImageInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Image')
}

const returnAudioInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Audio')
}

const returnVideoInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Video')
}

//handle instance assembly


const allImgObjsSorted = (linkImgs, updatedUploadImgs) => {
  return [...linkImgs, ...updatedUploadImgs].sort((a, b) => 
    a.displayIdx - b.displayIdx
  )
}

const pushDescriptionImgObjs = (objArr, post) => {
  objArr.forEach(obj => {
    post.descriptionImages.push(obj._id)
  })
}

const pushMainImgObjs = (objArr, post) => {
  objArr.forEach(obj => {
    post.mainImages.push(obj._id)
  })
}

const pushDescriptions = (descriptions, post) => {
  descriptions.forEach((obj, i) => {
    post.descriptions.push(obj)
  })
}

const pushTags = (tags, post) => {
  tags.forEach((t, i) => {
    post.tags.push(t._id)
  })
}

const handleStatics = async (statics, instance, user) => {

  switch(instance.kind) {
    case 'TextPost':
      var { title, main } = statics
      instance.title = title
      instance.main = main
      instance.user = user._id
      break
    case 'PhotoPost':
      var { mainImages } = statics
      instance.mainImages = [];
      instance.user = user._id;
      
      var uploads = returnInstancesOnly(mainImages)
      var imageLinks = returnNewImageLinksOnly(mainImages)

      var updatedUploadImgs = await updateUploadDispIdx(uploads, asyncUpdateUpload)
      var linkImages = await createImagesFromLinks(imageLinks, asyncImageLink)
      
      var readyMainImgs = allImgObjsSorted(
        linkImages, updatedUploadImgs
      )
    
      pushMainImgObjs(readyMainImgs, instance)
      break
    case 'QuotePost':
      var { quote, source } = statics
      instance.quote = quote
      instance.source = source
      instance.user = user._id
      break
    case 'LinkPost':
      var { linkObj } = statics;
      instance.user = user._id
      instance.linkObj = linkObj
      break
    case 'ChatPost':
      instance.chat = ''
      var { chat } = statics;
      instance.user = user._id
      instance.chat = chat
      break
    case 'AudioPost':
      var { audioFileId, audioMeta } = statics;
      instance.audioFile = audioFileId
      instance.audioMeta = audioMeta
      instance.user = user._id
      break
    case 'VideoPost':
      var { videoLink } = statics;
      instance.videoLink = videoLink
      instance.user = user._id
      break
    default:
      return
  }
}


const CreateFunctionUtil = {
  getTagArr, asyncTag,
  findOrCreateTag,
  createImagesFromLinks,
  asyncImageLink,
  updateUploadDispIdx,
  asyncUpdateUpload,
  returnInstancesOnly, 
  returnNewImageLinksOnly,
  returnAudioInstancesOnly,
  returnImageInstancesOnly,
  returnVideoInstancesOnly,
  allImgObjsSorted,
  pushDescriptionImgObjs,
  pushMainImgObjs,
  pushDescriptions, pushTags, 
  handleStatics,
  createInstance
}

export default CreateFunctionUtil;