import React from 'react';
import { Link } from 'react-router-dom';
import BylineUtil from './util/byline_util.js'
const { handleByline } = BylineUtil;

const MentionShow = ({
  dropdown, mention, navActive, setNavActive
}) => {

  return(
    <div
      className='activityResult'
      onClick={() => {
        if (dropdown) {
          setNavActive(navActive = false)
        }
      }}
    >
      <Link
        to={`/view/blog/${mention.user.blogName}`}
      >
        <span className='boldUser'>{mention.user.blogName}</span>
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${mention.post.user.blogName}/${mention.post._id}`}
      >
        <span className='activitySlug'>mentioned you {handleByline(mention.post)}</span>
      </Link>
    </div>
  )
}

export default MentionShow;