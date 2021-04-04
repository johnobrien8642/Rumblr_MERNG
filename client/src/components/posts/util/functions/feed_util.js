import React from 'react';

const header = (user, tagTitle) => {
  if (user) {
    return (
      <div>
        <h1>{user.blogName}</h1>
        <p>{user.blogDescription}</p>
      </div>
    )
  } else if (tagTitle) {
    return (
      <div>
        <h1>{tagTitle}</h1>
      </div>
    )
  }
}

const FeedUtil = { header }

export default FeedUtil;