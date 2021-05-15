import React from 'react';
import FollowedTags from './Followed_Tags_Result';
import Results from '../Results';

const SearchDropDown = ({
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
          followedActive={followedActive}
        />
        <Results
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