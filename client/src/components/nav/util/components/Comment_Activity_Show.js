import React from 'react';
import { Link } from 'react-router-dom';
import BylineUtil from '../byline_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import handlePostIcon from '../handle_post_icon.js';
import DOMPurify from 'dompurify';
const { handleByline } = BylineUtil;

const CommentShow = ({
  dropdown, comment, navActive, setNavActive
}) => {

  if (comment.post) {
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
          user={comment.user}
          activity={comment}
        />
        <div>
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
          <div
            className='commentContent'
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(comment.content)
            }}
          />
        </div>
        {handlePostIcon(comment)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
  
}

export default CommentShow;