import React from 'react';
import { Link } from 'react-router-dom';
import BylineUtil from './util/byline_util.js'
const { handleByline } = BylineUtil;

const LikeActivityShow = ({
  like, navActive, setNavActive
}) => {

  return(
    <div
      className='activityResult'
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${like.user.blogName}`}
      >
        <span className='boldUser'>{like.user.blogName}</span>
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${like.user.blogName}/${like.post._id}`}
      >
        <span className='activitySlug'>liked your post {handleByline(like.post)}</span>
      </Link>
    </div>
  )
}

export default LikeActivityShow;