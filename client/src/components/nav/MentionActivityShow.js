import React from 'react';
import { Link } from 'react-router-dom';

const MentionShow = ({
  mention, navActive, setNavActive
}) => {

  return(
    <div
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${mention.user.blogName}`}
      >
        {mention.user.blogName}
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${mention.post.user.blogName}/${mention.post._id}`}
      >
        mentioned you
      </Link>
    </div>
  )
}

export default MentionShow;