import mongoose from 'mongoose'
const User = mongoose.model('User')
import CreateFunctionUtil from './create_function_util.js'
const { getTagArr, asyncTag, findOrCreateTag, 
        createImagesFromLinks, asyncImageLink,
        updateUploadDispIdx, asyncUpdateUpload,
        returnUploadsOnly, returnNewImageLinksOnly,
        allImgObjsSorted, pushDescriptionImgObjs,
        pushDescriptions, pushTags, handleStatics,
        createInstance } = CreateFunctionUtil;

const createPost = ({
  statics,
  descriptions,
  descriptionImages,
  user, tags, kind
}) => {
  var post = createInstance(kind);

  var uploads = returnUploadsOnly(descriptionImages)
  var imageLinks = returnNewImageLinksOnly(descriptionImages)
  
  return Promise.all([
    updateUploadDispIdx(uploads, asyncUpdateUpload),
    createImagesFromLinks(imageLinks, asyncImageLink),
    getTagArr(tags, asyncTag, findOrCreateTag),
    User.findOne({ blogName: user })
  ]).then(
    ([mainUploads, linkImages, tags, user]) => {
      return handleStatics(statics, post, user).then(() => {
        
        var readyDescriptionImgs = allImgObjsSorted(linkImages, mainUploads)
        
        pushDescriptionImgObjs(readyDescriptionImgs, post)
  
        pushDescriptions(descriptions, post)
  
        pushTags(tags, post)
        
        return Promise.all([post.save()]).then(
          ([post])=> (post)
        )
      })

    }
  )
}

export default createPost;