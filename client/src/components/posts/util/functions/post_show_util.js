import React from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import ReactPlayer from 'react-player';

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
  var repost = post

  if (post.kind === 'Repost') {
    return (
      <div>
        <span>
          <i className="fas fa-retweet"></i>
          <Link to={`/view/blog/${data.user.blogName}`}>
            {data.user.blogName}
          </Link>
        </span>
        <p>{repost.repostCaption}</p> 
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
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
      </React.Fragment>
    )

  } else if (data.kind === 'PhotoPost') {

    return (
      <React.Fragment>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.main) }} />
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
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

        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
      </React.Fragment>
    )

  } else if (data.kind === 'LinkPost') {

    return (
      <React.Fragment>
      <a href={data.linkObj.link}>
        <span>{data.linkObj.siteName}</span>
        <img src={data.linkObj.imageUrl}  alt={'link page img'}/>
        <h2>{data.linkObj.title}</h2>
        <p>{data.linkObj.linkDescription}</p>
      </a>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
      </React.Fragment>
    )

  } else if (data.kind === 'ChatPost') {

    return (
      <React.Fragment>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.chat) }} />
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
      </React.Fragment>
    )

  } else if (data.kind === 'AudioPost') {

    return (
      <React.Fragment>
        <p>Title: {data.audioMeta.title}</p>
        <p>Artist: {data.audioMeta.artist}</p>
        <p>Album: {data.audioMeta.album}</p>
        <AudioPlayer
          src={data.audioFile.url}
        />
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
      </React.Fragment>
    )

  } else if (data.kind === 'VideoPost') {

    return (
      <React.Fragment>
        <ReactPlayer 
          url={data.videoLink.url}
          controls
        />
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
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