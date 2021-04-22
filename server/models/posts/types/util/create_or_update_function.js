import mongoose from 'mongoose'
const User = mongoose.model('User')
const Post = mongoose.model('Post')
import CreateOrUpdateFunctionUtil from './create_or_update_function_util.js'
import DeleteFunctionUtil from './delete_function_util.js'
const { getTagArr, asyncTag, findOrCreateTag, 
        createImagesFromLinks, asyncImageLink,
        updateUploadDispIdx, asyncUpdateUpload,
        returnInstancesOnly, returnNewImageLinksOnly,
        allImgObjsSorted, pushDescriptionImgObjs,
        pushDescriptions, pushTags, handleStatics,
        createInstance } = CreateOrUpdateFunctionUtil;
const { cleanupImages } = DeleteFunctionUtil;

const createOrUpdatePost = ({
  statics,
  descriptions,
  descriptionImages,
  user, tags, kind,
  objsToClean,
  postId
}) => {
  var update = postId ? true : false
  
  var uploads = returnInstancesOnly(descriptionImages)
  var imageLinks = returnNewImageLinksOnly(descriptionImages)
  
  return Promise.all([
    updateUploadDispIdx(uploads, asyncUpdateUpload),
    createImagesFromLinks(imageLinks, asyncImageLink),
    getTagArr(tags, asyncTag, findOrCreateTag),
    User.findOne({ blogName: user }),
    Post.findById(postId),
    cleanupImages(objsToClean),
  ]).then(
    ([updatedUploads, linkImages, 
      tags, user, fetchedPost, 
      cleanedImages]) => {
      
      if (update) {
        var instance = fetchedPost
        instance.descriptions = []
        instance.descriptionImages = []
        instance.tags = []
      } else {
        var instance = createInstance(kind)
      }
      
      return handleStatics(statics, instance, user).then(() => {
        
        var readyDescriptionImgs = allImgObjsSorted(
          linkImages, updatedUploads
        )
    
        pushDescriptionImgObjs(readyDescriptionImgs, instance)
  
        pushDescriptions(descriptions, instance)
  
        pushTags(tags, instance)
        
        return Promise.all([instance.save()]).then(
          ([instance])=> (instance)
        )
      })

    }
  )
}

export default createOrUpdatePost;