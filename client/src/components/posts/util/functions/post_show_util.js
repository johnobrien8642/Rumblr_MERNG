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
  
  // console.log(data)

  var descriptionArr = [...data.descriptionImages]

  if (data.kind === 'TextPost') {

    data.descriptions.forEach((obj, i) => {
      descriptionArr.splice(obj.displayIdx, 0, obj)
    })

    return (
    <React.Fragment>
      <h3>{data.title}</h3>
      <p>{data.main}</p>
        <div>
          {descriptionArr.map((obj, i) => {
            switch(obj.kind) {
              case 'text':
                return <div key={i}>{obj.content}</div>
              case 'Image':
                return <img key={i} src={`${obj.url}`} alt={'usefilename'} />
              default:
                return 'no keys matched postBody TextPost'
            }
          })}
        </div>
    </React.Fragment>
    )

  } else if (data.kind === 'PhotoPost') {

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
          switch(obj.kind) {
            case 'text':
              return <div key={i}>{obj.content}</div>
            case 'Image':
              return <img key={i} src={`${obj.url}`} alt={'usefilename'} />
            default:
              return 'no keys matched postBody PhotoPost'
          }
        })}
      </div>
    </React.Fragment>
    )

  } else if (data.kind === 'QuotePost') {
    
    return (
      <React.Fragment>
        <h1>{data.quote}</h1>
        
        <p>
          <span>-</span>
          {data.source}
        </p>

          <div>
            {descriptionArr.map((obj, i) => {
              switch(obj.kind) {
                case 'text':
                  return <div key={i}>{obj.content}</div>
                case 'Image':
                  return <img key={i} src={`${obj.url}`} alt={'usefilename'} />
                default:
                  return 'no keys matched postBody PhotoPost'
              }
            })}
          </div>
      </React.Fragment>
      )
      
  }
}

const demeterPost = (post) => {
  console.log(post)
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