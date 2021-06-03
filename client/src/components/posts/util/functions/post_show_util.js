import React from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import ReactPlayer from 'react-player';
import UserResult from '../../../search/resultTypes/User_Result';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import FollowButton from '../../../posts/util/components/social/Follow_Button';

const postHeader = (
  post, 
  discover, 
  radar,
  doesUserFollowUserRef
) => {

  if (post.kind === 'Repost') {
    return (
      <div>
        <ProfilePic user={post.user} />
        <span>
          <Link to={`/view/blog/${post.user.blogName}`}>
            {post.user.blogName}
          </Link> 
          <img 
            src="https://img.icons8.com/material-two-tone/24/ffffff/retweet.png"
            alt=''
          />
          <Link to={`/view/blog/${post.repostedFrom.blogName}`}>
            {post.repostedFrom.blogName}
          </Link>
          <FollowButton
            feed={true}
            user={post.repostedFrom}
            followed={doesUserFollowUserRef.current}
          />
        </span>
      </div>
    )
  } else if (discover || radar) {
    return (
      <div
        className='postRadarPostHeader'
      >
        <UserResult user={post.user} />
      </div>
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
  // var data = demeterPost(post)
  var repost = post
  
  if (post.kind === 'Repost') {
    return (
      <ul>
        {repost.repostTrail.map((u, i) => {
          return (
            <li
              key={i}
            >
              <span>
                <i className="fas fa-retweet"></i>
                <Link to={`/view/blog/${u.blogName}`}>
                  {u.blogName}
                </Link>
              </span>
              <p>
                {
                  repost.repostCaptions && repost.repostCaptions[i].caption !== null ?
                  repost.repostCaptions[i].caption : ''
                }
              </p>
            </li>
          )
        })}
      </ul>
    )
  }
}

const postTags = (post) => {
  var data = demeterPost(post)
  
  return (
  <div>
    {data.tagIds.map((tag, i) => {
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
  var descriptionArr = [...data.descriptionImages]
  
  data.descriptions.forEach((obj, i) => {
    descriptionArr.splice(obj.displayIdx, 0, obj)
  })
  
  if (data.kind === 'TextPost') {
    return (
      <React.Fragment>
        <h3
          className='textPostTitle'
        >
          {data.title}
        </h3>
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )

  } else if (data.kind === 'PhotoPost') {
    return (
      <React.Fragment>
        <div>
          {data.mainImages.map((mainImg, i) => {
            return <img key={i} src={`${mainImg.src}`} alt={'usefilename'} />
          })}
        </div>
        <p>{data.description}</p>
        {displayDescription(descriptionArr)}
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
          {displayDescription(descriptionArr)}
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
      {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'ChatPost') {
    return (
      <React.Fragment>
        <div 
          dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.chat)}}
        />
        {displayDescription(descriptionArr)}
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
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'VideoPost') {
    return (
      <React.Fragment>
        <ReactPlayer 
          url={data.videoLink.url}
          controls
        />
        {displayDescription(descriptionArr)}
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

const displayDescription = (descriptionArr) => {
  return (
    <div>
      {descriptionArr.map((obj, i) => {
        switch(obj.kind) {
          case 'text':
            return (
              <div
                className='descriptionText'
                key={i}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj.content) }}
              />
            )
          case 'Image':
            return <img className='descriptionImg' key={i} src={`${obj.src}`} alt={'usefilename'} />
          default:
            return 'no keys matched postBody PhotoPost'
        }
      })}
    </div>
  )
}

const handlePostClassName = (post) => {
  var { kind } = post;

  if (kind === 'TextPost') {
    return 'post textPost'
  } else if (kind === 'PhotoPost') {
    return 'post photoPost'
  } else if (kind === 'QuotePost') {
    return 'post quotePost'
  } else if (kind === 'LinkPost') {
    return 'post linkPost'
  } else if (kind === 'ChatPost') {
    return 'post chatPost'
  } else if (kind === 'AudioPost') {
    return 'post audioPost'
  } else if (kind === 'VideoPost') {
    return 'post videoPost'
  }
}


const PostShowUtil = { 
  postHeader, 
  postBody, 
  repostFooter, 
  postTags,
  handlePostClassName
}

export default PostShowUtil;