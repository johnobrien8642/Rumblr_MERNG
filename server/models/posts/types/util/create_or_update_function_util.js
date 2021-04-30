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

const returnAudioInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Audio')
}

const returnVideoInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Video')
}

//handle instance assembly

const pushTags = (tags, post) => {
  tags.forEach((t, i) => {
    post.tags.push(t._id)
  })
}

const handleStatics = (statics, instance, user) => {

  switch(instance.kind) {
    case 'TextPost':
      var { title } = statics
      instance.title = title
      instance.user = user._id

      break
    case 'PhotoPost':
      var { mainImages } = statics
      instance.mainImages = mainImages;
      instance.user = user._id;
    
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
  returnInstancesOnly, 
  returnAudioInstancesOnly,
  returnVideoInstancesOnly,
  pushTags, 
  handleStatics,
  createInstance
}

export default CreateFunctionUtil;