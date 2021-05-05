import React from 'react';
import { Link } from 'react-router-dom';

const CommentShow = ({
  comment, navActive, setNavActive
}) => {

  return(
    <div
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${comment.user.blogName}`}
      >
        {comment.user.blogName}
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${comment.post.user.blogName}/${comment.post._id}`}
      >
        replied to your post
      </Link>
    </div>
  )
}

export default CommentShow;