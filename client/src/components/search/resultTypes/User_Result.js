import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../../posts/util/components/social/Follow_Button';
import ProfilePic from '../../user/util/components/Profile_Pic';
import FeedUtil from '../../posts/util/functions/feed_util.js';
// const { doesUserFollowUser } = FeedUtil;

const UserResult = ({ 
  currentUser,
  user, 
  active,
  setActive,
  checkOutTheseBlogs
}) => {
  // let doesUserFollowUserRef = useRef(false)

  // doesUserFollowUser(doesUserFollowUserRef, currentUser, user)

  // if (currentUser) {
  //   doesUserFollowUserRef.current =
  //   currentUser.userFollows.some(obj => obj._id === user._id)
  // }

  const handleDescription = () => {
    if (user.blogDescription) {
      return <p>{user.blogDescription}</p>
    } else {
      return <br/>
    }
  }
  
  return (
    <React.Fragment>
      <div
        className='userResult'
      >
        <ProfilePic user={user} standaloneLink={true} />
        <Link
          to={`/view/blog/${user.blogName}`}
          onClick={() => {
            if (active) {
              setActive(active = false)
            }
          }}
        >
          <h3>{user.blogName}</h3>
          {handleDescription()}
        </Link>
      </div>
      <FollowButton 
        user={user}
        // followed={doesUserFollowUserRef.current}
      />
    </React.Fragment>
  )
}
  

export default UserResult;