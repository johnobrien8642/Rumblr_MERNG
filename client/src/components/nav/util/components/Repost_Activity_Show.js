import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import BylineUtil from '../byline_util.js'
import handlePostIcon from '../handle_post_icon.js';
const { handleByline } = BylineUtil;


const RepostActivityShow = ({
  dropdown, repost, navActive, setNavActive
}) => {

  const renderRepostCaption = (repost) => {
    var string
    repost.repostCaptions.forEach(obj => {
      if (repost._id === obj.repostId) {
        if (obj.caption.length > 15) {
          string = obj.caption.split(' ').slice(0, 8).join(' ') + '...'
        } else {
          string = obj.caption
        }
      }
    })
    return <span>{string}</span>
  }
  
  if (repost.post) {
    return(
      <div
        className='activityResult'
        onClick={() => {
          if (dropdown) {
            setNavActive(navActive = false)
          }
        }}
      >
        <ProfilePic 
          user={repost.user}
          activity={repost}
        />
        <div>
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
          <p>{renderRepostCaption(repost)}</p>
        </div>
        {handlePostIcon(repost)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default RepostActivityShow;