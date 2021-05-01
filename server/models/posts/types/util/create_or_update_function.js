import mongoose from 'mongoose'
const User = mongoose.model('User')
const Post = mongoose.model('Post')
import CreateOrUpdateFunctionUtil from './create_or_update_function_util.js'
import DeleteFunctionUtil from './delete_function_util.js'
const { getTagArr, asyncTag, findOrCreateTag,
        handleMentions, asyncMention, findOrCreateMention,
        createImagesFromLinks, asyncImageLink,
        updateUploadDispIdx, asyncUpdateUpload,
        returnInstancesOnly, returnNewImageLinksOnly,
        returnImageInstancesOnly, returnAudioInstancesOnly,
        returnVideoInstancesOnly, returnMentionInstancesOnly,
        allImgObjsSorted, pushDescriptionImgObjs,
        pushDescriptions, pushTags, pushMentions, 
        markModified, handleStatics, createInstance } = CreateOrUpdateFunctionUtil;
const { cleanupImages, cleanupAudio, 
        cleanupVideo, cleanupMention } = DeleteFunctionUtil;

const createOrUpdatePost = ({
  statics,
  descriptions,
  descriptionImages,
  mentions,
  user, tags, kind,
  objsToClean,
  post
}) => {
  var update = post ? true : false
  
  var uploads = returnInstancesOnly(descriptionImages)
  var imageLinks = returnNewImageLinksOnly(descriptionImages)

  var imgsToClean = returnImageInstancesOnly(objsToClean)
  var audioToClean = returnAudioInstancesOnly(objsToClean)
  var videoToClean = returnVideoInstancesOnly(objsToClean)
  var mentionsToClean = returnMentionInstancesOnly(objsToClean)
  
  return Promise.all([
    updateUploadDispIdx(uploads, asyncUpdateUpload),
    createImagesFromLinks(imageLinks, asyncImageLink),
    getTagArr(tags, asyncTag, findOrCreateTag, user),
    User.findOne({ blogName: user }),
    Post.findById(post._id),
    cleanupImages(imgsToClean),
    cleanupAudio(audioToClean),
    cleanupVideo(videoToClean),
    cleanupMention(mentionsToClean)
  ]).then(
    ([updatedUploads, linkImages,
      tags, user, foundPost,
      cleanedImages, cleanedAudio,
      cleanupVideo, cleanupMention]) => {
      
      if (update) {
        var instance = foundPost
        instance.descriptions = []
        instance.descriptionImages = []
        instance.tags = []
        instance.mentions = []
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
        
        return handleMentions(
          mentions, asyncMention,
          findOrCreateMention, user,
          instance
          ).then(mentions => {
    
          pushMentions(mentions, instance)
          
          markModified(instance, update)

          return Promise.all([instance.save()]).then(
            ([instance])=> (instance)
          )
        })        
      })

    }
  )
}

export default createOrUpdatePost;