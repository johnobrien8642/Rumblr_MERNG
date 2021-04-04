import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = mongoose.model('User');
import Tag from '../tags/Tag.js'

const TextPostSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
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
  likes: [
    {
    type: Schema.Types.ObjectId,
      ref: 'Like'
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
    default: "TextPost"
  }
})

TextPostSchema.statics.create = (
  title, body,
  descriptionImages, user, 
  tags
) => {
  var post = new TextPost();
  
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
  
  descriptionImages.forEach((img, i) => {
    post.descriptionImages.push(img._id)
  })
  
  return Promise.all([
    getTagArr(tags, post), 
    User.findOne({ blogName: user })
  ]).then(
    ([tags, user]) => {
      post.title = title
      post.body = body
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

const TextPost = mongoose.model('TextPost', TextPostSchema, 'posts')

export default TextPost;