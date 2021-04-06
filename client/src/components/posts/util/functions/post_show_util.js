import React from 'react';
import { Link } from 'react-router-dom';

const postHeader = (post) => {
  var data = demeterPost(post)

  if (post.kind === 'Repost') {
    return (
      <span>
        <Link to={`/view/blog/${data.user.blogName}`}>
          {data.user.blogName}
        </Link>
        <i className="fas fa-retweet"></i>
        <Link to={`/view/blog/${post.repostedFrom.blogName}`}>
          {post.repostedFrom.blogName}
        </Link>
      </span>
    )
  } else {
    return (
      <span>
        <Link 
          to={`/view/blog/${post.user.blogName}`}
        >
          {post.user.blogName}
        </Link>
      </span>
    )
  }
}

const repostFooter = (post) => {
  var data = demeterPost(post)

  if (post.kind === 'Repost') {
    return (
      <div>
        <span>
          <i className="fas fa-retweet"></i>
          <Link to={`/view/blog/${data.user.blogName}`}>
            {data.user.blogName}
          </Link>
        </span>
        <p>{data.repostCaption}</p> 
      </div>
    )
  } else {
    <div>
    </div>
  }
}

const postTags = (post) => {
  var data = demeterPost(post)

  return (
  <div>
    {data.tags.map((tag, i) => {
      var cleanedTitle = tag.title.slice(1)
      return (
        <div 
         key={i}
        >
          <Link 
            to={`/view/tag/${cleanedTitle}`}
          >
            {tag.title}
          </Link>
        </div>
      )
    })}
    </div>
  )
  }

const postBody = (post) => {
  var data = demeterPost(post)

  if (data.kind === 'TextPost') {

    return (
    <React.Fragment>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
        <div>
          {data.descriptionImages.map((descripImg, i) => {
            return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
          })}
        </div>
    </React.Fragment>
    )

  } else if (data.kind === 'PhotoPost') {

    var descriptionArr = [...data.descriptionImages]

    data.descriptions.forEach((obj, i) => {
      descriptionArr.splice(obj.displayIdx, 0, obj)
    })
  
    return (
    <React.Fragment>
      <div>
        {data.mainImages.map((mainImg, i) => {
          return <img key={i} src={`${mainImg.url}`} alt={'usefilename'} />
        })}
      </div>
      <p>{data.description}</p>
      <div>
        {descriptionArr.map((obj, i) => {
          if (obj.kind === 'text') {
            return <div key={i}>{obj.content}</div>
          } else if (obj.kind === 'Image') {
            return <img key={i} src={`${obj.url}`} alt={'usefilename'} />
          }
        })}
      </div>
    </React.Fragment>
    )

  } else if (data.kind === 'QuotePost') {

    return (
      <React.Fragment>
        <h1>{data.title}</h1>
        <p>{data.body}</p>
          <div>
            {data.descriptionImages.map((descripImg, i) => {
              return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
            })}
          </div>
      </React.Fragment>
      )
      
  }
}

const demeterPost = (post) => {
  if (post.kind === 'Like' && post.post.kind === 'Repost') {
    return post.post.post
  } else if (post.kind === 'Like' || post.kind === 'Repost') {
    return post.post
  } else {
    return post
  }
}

const PostShowUtil = { postHeader, postBody, repostFooter, postTags }

export default PostShowUtil;