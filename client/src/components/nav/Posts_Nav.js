import React from 'react';
import PhotoPostForm from '../posts/types/create/PhotoPostForm'
import TextPostForm from '../posts/types/create/TextPostForm'

const PostNav = () => {

  return(
    <div>
      <TextPostForm />
      <PhotoPostForm />
    </div>
  )
}

export default PostNav;