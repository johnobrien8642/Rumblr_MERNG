import mongoose from 'mongoose';
import aws from 'aws-sdk';
import keys from '../../../../config/keys.js';
const Post = mongoose.model('Post');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment')
const Image = mongoose.model('Image');
const Audio = mongoose.model('Audio');
const Video = mongoose.model('Video');
const Mention = mongoose.model('Mention');

var s3Client = new aws.S3({
  secretAccessKey: keys.secretAccessKey,
  accessKeyId: keys.accessKeyId,
  region: 'us-east-1'
})

const handlePostDelete = async (post) => {

  return Post.findById(post._id)
    .then(foundPost => {

      if (foundPost.kind === 'Repost') {
        return Post.findById(foundPost.post._id)
          .then(repostedPost => {
            repostedPost.notesCount - 1

            return Promise.all([
              repostedPost.save(),
              Post.deleteOne({ _id: post._id }),
              Like.deleteMany({ post: post._id }),
              Comment.deleteMany({ post: post._id }),
              Mention.deleteMany({ post: post._id }),
            ]).then(() => post._id)
          })
      } else {
        return Promise.all([
          Post.deleteOne({ _id: post._id }),
          Like.deleteMany({ post: post._id }),
          Comment.deleteMany({ post: post._id }),
          Mention.deleteMany({ post: post._id }),
        ]).then(() => post._id)
      }
    })
}

const handles3AndObjectCleanup = async (objsToClean, s3Client, keys) => {
  var filteredObjs = objsToClean.filter(obj => obj.key)

  var s3ObjectKeys = filteredObjs.map(obj => {
    if (obj.kind !== 'Mention') {
      return { Key: obj.key }
    }
  })

  var params = {
    Bucket: keys.bucket,
    Delete: {
      Objects: s3ObjectKeys
    }
  }

  if (s3ObjectKeys.length > 0) {
    await s3Client.deleteObjects(params, function(err, data) {
      if (err) console.log(`s3 delete err: ${err}, stack: ${err.stack}`)
    })
  }

  objsToClean.forEach(obj => {
    if (obj.kind === 'Image') {
      Promise.all([
        Image.deleteOne({ _id: obj._id })
      ])
    } else if (obj.kind === 'Audio') {
      Promise.all([
        Audio.deleteOne({ _id: obj._id })
      ])
    } else if (obj.kind === 'Video') {
      Promise.all([
        Video.deleteOne({ _id: obj._id })
      ])
    }
  })
}

const cleanupMention = async (mentionObjs) => {
  mentionObjs.forEach(obj => {
    Promise.all([
      Mention.deleteOne({ _id: obj._id })
    ])
  })
}

const asyncDeleteAllPosts = async (posts, deletePost) => {
  for (let i = 0; i < posts.length; i++) {
    await deletePost(posts[i])
  }
}

const deletePost = async (post) => {
  if 
    (
      post.kind === 'TextPost' ||
      post.kind === 'QuotePost' ||
      post.kind === 'LinkPost' ||
      post.kind === 'ChatPost'
    ) {
      return Promise.all([
        handles3AndObjectCleanup(post.descriptionImages, s3Client, keys)
      ]).then(() => {
        handlePostDelete(post)
      })
  } else if (
    post.kind === 'PhotoPost'
  ) {
    return Promise.all([
      handles3AndObjectCleanup(post.mainImages, s3Client, keys),
      handles3AndObjectCleanup(post.descriptionImages, s3Client, keys)
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'AudioPost'
  ) {
    return Promise.all([
      handles3AndObjectCleanup(post.descriptionImages, s3Client, keys),
      handles3AndObjectCleanup([post.audioFile], s3Client, keys)
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'VideoPost'
  ) {
    return Promise.all([
      handles3AndObjectCleanup(post.descriptionImages, s3Client, keys),
      handles3AndObjectCleanup([post.videoLink], s3Client, keys)
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'Repost'
  ) {
    await handlePostDelete(post)
  }
}

const DeleteFunctionUtil = {
  cleanupMention, 
  deletePost,
  asyncDeleteAllPosts,
  handles3AndObjectCleanup
}

export default DeleteFunctionUtil;