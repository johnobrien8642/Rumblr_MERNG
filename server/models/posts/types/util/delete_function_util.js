import mongoose from 'mongoose';
import fs from 'fs';
const Post = mongoose.model('Post');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Image = mongoose.model('Image');
const Audio = mongoose.model('Audio');
const Video = mongoose.model('Video');

const handlePostDelete = async (post) => {
  return Promise.all([
    Post.deleteOne({ _id: post._id }),
    Like.deleteMany({ post: post._id }),
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

const cleanupAudio = async (audioObj) => {
  Promise.all([
    fs.unlink(audioObj.path, () => {}),
    Audio.deleteOne({ _id: audioObj._id })
  ])
}

const cleanupVideo = async (videoObj) => {
  if (videoObj.path) {
    Promise.all([
      fs.unlink(videoObj.path, () => {}),
      Video.deleteOne({ _id: videoObj._id })
    ])
  } else {
    Promise.all([
      Video.deleteOne({ _id: videoObj._id })
    ])
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
      cleanupAudio(post.audioFile)      
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'VideoPost'
  ) {
    return Promise.all([
      cleanupImages(post.descriptionImages),
      cleanupVideo(post.videoLink)      
    ]).then(() => {
      handlePostDelete(post)
    })
  }
}

const DeleteFunctionUtil = {
  cleanupImages, deletePost
}

export default DeleteFunctionUtil;