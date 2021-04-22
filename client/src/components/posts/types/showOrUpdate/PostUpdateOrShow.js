import React from 'react';
import PostUpdate from '../showOrUpdate/PostUpdate';
import PostShow from '../showOrUpdate/PostShow';

const PostUpdateOrShow = ({
  post,
  update,
  setUpdate,
  toggleUpdate
}) => {

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
        update={update}
        setUpdate={setUpdate}
        toggleUpdate={toggleUpdate}
      />
    )
  }
}

export default PostUpdateOrShow;