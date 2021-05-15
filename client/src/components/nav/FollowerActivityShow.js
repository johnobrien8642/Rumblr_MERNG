import React from 'react';
import { Link } from 'react-router-dom';

const FollowerActivityShow = ({
  follow, navActive, setNavActive
}) => {

  return(
    <div
      className='activityResult'
      onClick={() => {
        setNavActive(navActive = false)
      }}
    >
      <Link
        to={`/view/blog/${follow.user.blogName}`}
      >
        <span className='activitySlug'><span className='boldUser'>{follow.user.blogName}</span> follows you</span>
      </Link>
    </div>
  )
}

export default FollowerActivityShow;