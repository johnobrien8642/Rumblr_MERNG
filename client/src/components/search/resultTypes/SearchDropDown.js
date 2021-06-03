import React from 'react';
import FollowedTags from './Followed_Tags_Result';
import Results from '../Results';

const SearchDropDown = ({
  user,
  followedActive,
  input,
  active,
  setActive
}) => {

  if (active || followedActive) {
    return (
      <div
        className='searchDropDown'
      >
        <FollowedTags
          user={user}
          followedActive={followedActive}
        />
        <Results
          user={user}
          input={input} 
          active={active}
          setActive={setActive}
        />
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
};

export default SearchDropDown;