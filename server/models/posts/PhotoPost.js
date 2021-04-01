import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from '../User.js'
import Tag from '../tags/Tag.js'
import Like from '../likes/Like.js'
import Repost from '../reposts/Repost.js'

const PhotoPostSchema = new Schema({
  description: {
    type: String
  },
  mainImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
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
  likes: [
    {
    type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  reposter: {
    type: String
  },
  repostCaption: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
})

PhotoPostSchema.statics.like = (
  postId,
  user
) => {
  var like = new Like();
  
  return Promise.all([
    User.findOne({ blogName: user}), 
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
        tagFound.posts.push(post._id)
        return tagFound.save().then(tag => {
          return tag;
        })
      } else {
        var newTag = new Tag({ title: t })
        newTag.posts.push(post._id)
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
      post.user = user._id
      post.description = description
      user.posts.push(post._id)

      tags.forEach((t, i) => {
        post.tags.push(t._id)
      })

      return Promise.all([post.save(), user.save()]).then(
        ([post, user])=> (post)
      )
    }
  )
}

PhotoPostSchema.statics.repost = (
  mainImages, 
  descriptionImages, 
  description, tags, 
  reposter, repostCaption, 
  user
) => {
  var post = new PhotoPost({
    description: description,
    tags: tags,
    reposter: reposter,
    repostCaption: repostCaption
  });

  mainImages.forEach((img, i) => {
    post.mainImages.push(img._id)
  })

  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })

  var repost = new Repost({
    post: post._id
  });

  return Promise.all([
    User.findOne({ blogName: reposter }),
    User.findOne({ blogName: user })
  ]).then(([reposter, user]) => {
    repost.user = reposter._id
    post.user = user._id
    reposter.posts.push(post._id)
    reposter.reposts.push(repost._id)
    user.reposts.push(repost._id)
    return Promise.all(
      ([reposter.save(),
        user.save(),
        post.save(),
        repost.save()  
      ])).then(([reposter, user, post, repost]) => (post))
  })
}

const PhotoPost = mongoose.model('PhotoPost', PhotoPostSchema, 'photoPosts')

export default PhotoPost;