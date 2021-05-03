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
        markModified, handleVariants, createInstance, 
        resetFoundPost, handleAllText } = CreateOrUpdateFunctionUtil;
const { cleanupImages, cleanupAudio, 
        cleanupVideo, cleanupMention } = DeleteFunctionUtil;

const createOrUpdatePost = ({
  variants,
  allText,
  descriptions,
  descriptionImages,
  mentions,
  user, tags, kind,
  objsToClean,
  postId
}) => {
  var update = postId ? true : false
  
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
    Post.findById(postId),
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
        resetFoundPost(instance)
      } else {
        var instance = createInstance(kind)
      }
      
      return handleVariants(variants, instance, user).then(() => {

        handleAllText(allText, instance)
        
        pushDescriptions(descriptions, instance)

        var readyDescriptionImgs = allImgObjsSorted(
          linkImages, updatedUploads
        )
    
        pushDescriptionImgObjs(readyDescriptionImgs, instance)
  
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