import mongoose from 'mongoose';
const User = mongoose.model('User')
const Post = mongoose.model('Post')
import CreateOrUpdateFunctionUtil from './create_or_update_function_util.js'
import DeleteFunctionUtil from './delete_function_util.js'
const { getTagArr, asyncTag, findOrCreateTag,
        returnAudioInstancesOnly,
        returnVideoInstancesOnly,
        pushTags, handleStatics,
        createInstance } = CreateOrUpdateFunctionUtil;
const { cleanupAudio, cleanupVideo } = DeleteFunctionUtil;

const createOrUpdatePost = ({
  statics,
  body,
  user, tags, kind,
  objsToClean,
  postId
}) => {
  var update = postId ? true : false

  var audioToClean = returnAudioInstancesOnly(objsToClean)
  var videoToClean = returnVideoInstancesOnly(objsToClean)
  
  return Promise.all([
    getTagArr(tags, asyncTag, findOrCreateTag),
    User.findOne({ blogName: user }),
    Post.findById(postId),
    cleanupAudio(audioToClean),
    cleanupVideo(videoToClean)
  ]).then(
    ([tags, user, fetchedPost, 
      cleanedAudio,
      cleanupVideo]) => {
      
      if (update) {
        var instance = fetchedPost
        instance.body = ''
        instance.tags = []
      } else {
        var instance = createInstance(kind)
      }
      
      handleStatics(statics, instance, user)
      
      instance.body = body
      
      pushTags(tags, instance)

      return Promise.all([instance.save()]).then(
        ([instance])=> (instance)
      )
    }
  )
}

export default createOrUpdatePost;