import mongoose from 'mongoose';
import fs from 'fs';
const Post = mongoose.model('Post');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment')
const Image = mongoose.model('Image');
const Audio = mongoose.model('Audio');
const Video = mongoose.model('Video');

const handlePostDelete = async (post) => {
  return Promise.all([
    Post.deleteOne({ _id: post._id }),
    Like.deleteMany({ post: post._id }),
    Comment.deleteMany({ post: post._id }),
    Repost.deleteOne({ _id: post._id }),
    Repost.deleteMany({ post: post._id })
  ]).then(() => post._id)
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

const deletePost = async (post) => {
  if 
    (
      post.kind === 'TextPost' ||
      post.kind === 'QuotePost' ||
      post.kind === 'LinkPost' ||
      post.kind === 'ChatPost'
    ) {
      
    handlePostDelete(post)

  } else if (
    post.kind === 'PhotoPost'
  ) {
    handlePostDelete(post)
  } else if (
    post.kind === 'AudioPost'
  ) {
    return Promise.all([
      cleanupAudio([post.audioFile])      
    ]).then(() => {
      handlePostDelete(post)
    })
  } else if (
    post.kind === 'VideoPost'
  ) {
    return Promise.all([
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
  cleanupAudio, 
  cleanupVideo, deletePost
}

export default DeleteFunctionUtil;