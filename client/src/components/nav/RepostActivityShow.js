import React from 'react';
import { Link } from 'react-router-dom';

const RepostShow = ({
  repost, navActive, setNavActive
}) => {

  return(
    <div
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${repost.user.blogName}`}
      >
        {repost.user.blogName}
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${repost.user.blogName}/${repost._id}`}
      >
        reposted you
      </Link>
    </div>
  )
}

export default RepostShow;