import React from 'react';
import { Link } from 'react-router-dom';
import BylineUtil from './util/byline_util.js'
const { handleByline } = BylineUtil;

const RepostActivityShow = ({
  dropdown, repost, navActive, setNavActive
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
        to={`/view/blog/${repost.user.blogName}`}
      >
        <span className='boldUser'>{repost.user.blogName}</span>
      </Link>
      <span>{" "}</span>
      <Link
        to={`/blog/view/${repost.user.blogName}/${repost._id}`}
      >
        <span className='activitySlug'>reposted your post {handleByline(repost)}</span>
      </Link>
      <p>
        {repost.repostCaptions.forEach(obj => {
          if (repost.user._id === obj.userId) {
            if (obj.caption.length > 10) {
              return obj.caption.split(' ').slice(0, 10).join(' ') + '...'
            }
          }
        })}
      </p>
    </div>
  )
}

export default RepostActivityShow;