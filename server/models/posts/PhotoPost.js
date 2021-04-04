import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from '../User.js'
import Tag from '../tags/Tag.js'
import Like from '../likes/Like.js'
import Repost from '../reposts/Repost.js'

const PhotoPostSchema = new Schema({
  mainImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  description: {
    type: String
  },
  descriptionImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'PhotoPost'
  }
})

PhotoPostSchema.statics.like = (
  postId,
  user
) => {
  var like = new Like();
  
  return Promise.all([
    User.findOne({ blogName: user }), 
    PhotoPost.findById(postId)
  ])
  .then(([user, photoPost]) => {
    
    user.likes.push(like._id)
    photoPost.likes.push(like._id)
    like.post = photoPost._id
    
    return Promise.all(([
      user.save(), 
      photoPost.save(), 
      like.save()
    ])).then(([user, photoPost, like]) => {
      return like
    })
  })
}

PhotoPostSchema.statics.unlike = (
  postId,
  likeId,
  user
) => {
  return Promise.all([
    User.findOne({ blogName: user}), 
    PhotoPost.findById(postId)
    ])
    .then(([user, photoPost]) => {
      var userLikeFiltered = user.likes.filter(like => {
      return like._id == likeId.toString() ? false : true
    })
    var photoPostFiltered = photoPost.likes.filter(like => {
      return like._id == likeId.toString() ? false : true
    })

  

    user.likes = userLikeFiltered
    photoPost.likes = photoPostFiltered

      
    return Promise.all(([
      user.save(), 
      photoPost.save(),
      Like.deleteOne({ _id: likeId })
    ])).then(([user, photoPost, like]) => (photoPost))
  })
}

PhotoPostSchema.statics.create = (
  mainImages, 
  descriptionImages, 
  description, 
  tags, user
) => {
  var post = new PhotoPost();
  
  const getTagArr = async (tags, post) => {
    return Promise.all(tags.map((t, i) => {
          return asyncTag(t, post)
        }
      )
    )
  }

  const asyncTag = async (t, post) => {
    return findOrCreateTag(t, post)
  }

  const findOrCreateTag = async (t, post) => {
    return Tag.findOne({ title: t }).then(tagFound => {
      if (tagFound) {
        return tagFound
      } else {
        var newTag = new Tag({ title: t })
        return newTag.save().then(tag => {
          return tag
        })
      }
    })
  }

  mainImages.forEach((img, i) => {
    post.mainImages.push(img._id)
  })

  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post), 
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      post.description = description
      post.user = user._id

      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

const PhotoPost = mongoose.model('PhotoPost', PhotoPostSchema, 'posts')

export default PhotoPost;