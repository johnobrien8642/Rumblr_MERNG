import React, { useState } from 'react';
import PostUpdate from '../showOrUpdate/PostUpdate';
import PostShow from '../showOrUpdate/PostShow';

const PostUpdateOrShow = ({
  post,
  currentUser
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
        currentUser={currentUser}
        post={post}
        update={update}
        setUpdate={setUpdate}
        toggleUpdate={toggleUpdate}
      />
    )
  }
}

export default PostUpdateOrShow;