import mongoose from 'mongoose';
import fs from 'fs';
const Post = mongoose.model('Post');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment')
const Image = mongoose.model('Image');
const Audio = mongoose.model('Audio');
const Video = mongoose.model('Video');
const Mention = mongoose.model('Mention');


const handlePostDelete = async (post) => {
  return Promise.all([
    Post.deleteOne({ _id: post._id }),
    Like.deleteMany({ post: post._id }),
    Comment.deleteMany({ post: post._id }),
    Mention.deleteMany({ post: post._id }),
    Repost.deleteOne({ _id: post._id }),
    Repost.deleteMany({ post: post._id })
  ]).then(() => post._id)
}


const cleanupImages = async (imageArr) => {
  return imageArr.forEach(img => {
    if (img.path) {
      Promise.all([
        fs.unlink(img.path, () => {}),
        Image.deleteOne({ _id: img._id })
      ])
    } else {
      Promise.all([
        Image.deleteOne({ _id: img._id })
      ])
    }
  })
}

const cleanupAudio = async (audioObjs) => {
  audioObjs.forEach(obj => {
    Promise.all([
      fs.unlink(obj.path, () => {}),
      Audio.deleteOne({ _id: obj._id })
    ])
  })
}

const cleanupVideo = async (videoObjs) => {
  videoObjs.forEach(obj => {
    if (obj.path) {
      Promise.all([
        fs.unlink(obj.path, () => {}),
        Video.deleteOne({ _id: obj._id })
      ])
    } else {
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

const deletePost = async (post) => {
  if 
    (
      post.kind === 'TextPost' ||
      post.kind === 'QuotePost' ||
      post.kind === 'LinkPost' ||
      post.kind === 'ChatPost'
    ) {
      return Promise.all([
        cleanupImages(post.descriptionImages)
      ]).then(() => {
        handlePostDelete(post)
      })
  } else if (
    post.kind === 'PhotoPost'
  ) {
    return Promise.all([
      cleanupImages(post.mainImages),
      cleanupImages(post.descriptionImages)
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'AudioPost'
  ) {
    return Promise.all([
      cleanupImages(post.descriptionImages),
      cleanupAudio([post.audioFile])      
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'VideoPost'
  ) {
    return Promise.all([
      cleanupImages(post.descriptionImages),
      cleanupVideo([post.videoLink])      
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
  cleanupImages, cleanupAudio, 
  cleanupVideo, cleanupMention, 
  deletePost
}

export default DeleteFunctionUtil;