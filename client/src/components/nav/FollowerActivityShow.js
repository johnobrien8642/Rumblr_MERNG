import React from 'react';
import { Link } from 'react-router-dom';

const FollowerActivityShow = ({
  follow, navActive, setNavActive
}) => {

  return(
    <div
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${follow.user.blogName}`}
      >
        {follow.user.blogName} follows you
      </Link>
    </div>
  )
}

export default FollowerActivityShow;