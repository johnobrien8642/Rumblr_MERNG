import React, { useState } from 'react';
import PostUpdate from '../showOrUpdate/PostUpdate';
import PostShow from '../showOrUpdate/PostShow';

const PostUpdateOrShow = ({
  post,
  user,
  tag,
  feedType
}) => {
  let [update, setUpdate] = useState(false)

  const toggleUpdate = () => {
    if (update) {
      setUpdate(update = false)
    } else { 
      setUpdate(update = true)
    }
  }

  if (update) {
    return (
      <PostUpdate 
        post={post}
        update={update}
        setUpdate={setUpdate}
        toggleUpdate={toggleUpdate}
      />
    )
  } else {
    return (
      <PostShow
        post={post}
        tag={tag}
        user={user}
        update={update}
        setUpdate={setUpdate}
        toggleUpdate={toggleUpdate}
        feedType={feedType}
      />
    )
  }
}

export default PostUpdateOrShow;