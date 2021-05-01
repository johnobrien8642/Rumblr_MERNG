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
        returnVideoInstancesOnly,
        allImgObjsSorted, pushDescriptionImgObjs,
        pushDescriptions, pushTags, pushMentions, 
        handleStatics, createInstance } = CreateOrUpdateFunctionUtil;
const { cleanupImages, cleanupAudio, 
        cleanupVideo } = DeleteFunctionUtil;

const createOrUpdatePost = ({
  statics,
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
  // var mentionsToClean = returnMentionInstancesOnly(objsToClean)
  
  return Promise.all([
    updateUploadDispIdx(uploads, asyncUpdateUpload),
    createImagesFromLinks(imageLinks, asyncImageLink),
    getTagArr(tags, asyncTag, findOrCreateTag, user),
    // handleMentions(mentions, asyncMention, findOrCreateMention, user),
    User.findOne({ blogName: user }),
    Post.findById(postId),
    cleanupImages(imgsToClean),
    cleanupAudio(audioToClean),
    cleanupVideo(videoToClean)
  ]).then(
    ([updatedUploads, linkImages,
      tags, user, fetchedPost,
      cleanedImages, cleanedAudio,
      cleanupVideo]) => {
      
      if (update) {
        var instance = fetchedPost
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
        ).then(() => {
          return Promise.all([instance.save()]).then(
            ([instance])=> (instance)
          )
        })        
      })

    }
  )
}

export default createOrUpdatePost;