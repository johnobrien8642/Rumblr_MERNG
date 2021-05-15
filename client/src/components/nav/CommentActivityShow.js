import React from 'react';
import { Link } from 'react-router-dom';
import BylineUtil from './util/byline_util.js'
const { handleByline } = BylineUtil;

const CommentShow = ({
  comment, navActive, setNavActive
}) => {

  return(
    <div
      className='activityResult'
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${comment.user.blogName}`}
      >
        <span className='boldUser'>{comment.user.blogName}</span>
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${comment.post.user.blogName}/${comment.post._id}`}
      >
        <span className='activitySlug'>replied to your post {handleByline(comment.post)}</span>
      </Link>
    </div>
  )
}

export default CommentShow;