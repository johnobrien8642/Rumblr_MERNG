import React from 'react';
import TagResult from '../../../search/resultTypes/Tag_Result';
import UserResult from '../../../search/resultTypes/User_Result';

const header = (user, tag) => {
  if (user) {
    return (
      <UserResult user={user} />
    )
  } else if (tag) {
    return (
      <TagResult tag={tag} />
    )
  }
}

const FeedUtil = { header }

export default FeedUtil;