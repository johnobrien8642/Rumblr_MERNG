import React from 'react';
import TagResult from '../resultTypes/Tag_Result';

const FollowedTags = ({
  user,
  followedActive,
  setFollowedActive,
  discover
}) => {
  
  if (followedActive) {
    return (
      <React.Fragment>
        <div
          className='followedTagsHeader'
        >
          {discover ? 'Following': 'Tags you follow'}
        </div>

        <ul
          className='followedTags'
        >
          {user.tagFollows.slice(0, 10).map((tag, i) => {
            return (
              <li 
                key={tag._id}
              >
                <TagResult
                  currentUser={user}
                  tag={tag}
                />
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    )
  } else {
    return (
      <ul>
      </ul>
    )
  }
}

export default FollowedTags;