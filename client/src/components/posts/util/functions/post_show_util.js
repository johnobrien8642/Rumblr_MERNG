import React from 'react';
import { Link } from 'react-router-dom';

const postHeader = (post) => {
  if (post.kind === 'Repost') {
    return (
      <span>
        <Link to={`/view/blog/${post.user.blogName}`}>
          {post.user.blogName}
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
  if (post.kind === 'Repost') {
    return (
      <div>
        <span>
          <i className="fas fa-retweet"></i>
          <Link to={`/view/blog/${post.user.blogName}`}>
            {post.user.blogName}
          </Link>
        </span>
        <p>{post.repostCaption}</p> 
      </div>
    )
  } else {
    <div>
    </div>
  }
}

const postTags = (postData) => (
  <div>
  {postData.tags.map((tag, i) => {
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

const postBody = (postData) => {
  if (postData.kind === 'TextPost') {

    return (
    <React.Fragment>
      <h2>{postData.title}</h2>
      <p>{postData.body}</p>
        <div>
          {postData.descriptionImages.map((descripImg, i) => {
            return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
          })}
        </div>
    </React.Fragment>
    )

  } else if (postData.kind === 'PhotoPost') {

    <React.Fragment>
      <div>
        {postData.mainImages.map((mainImg, i) => {
          return <img key={i} src={`${mainImg.url}`} alt={'usefilename'} />
        })}
      </div>
      <p>{postData.description}</p>
      <div>
        {postData.descriptionImages.map((descripImg, i) => {
          return <img key={i} src={`${descripImg.url}`} alt={'usefilename'} />
        })}
      </div>
    </React.Fragment> 

  }
}

const PostShowUtil = { postHeader, postBody, repostFooter, postTags }

export default PostShowUtil;