import React from 'react';
import PhotoPostForm from '../posts/types/PhotoPost/PhotoPostForm'
import TextPostForm from '../posts/types/TextPost/TextPostForm'

const PostNav = () => {

  return(
    <div>
      <TextPostForm />
      <PhotoPostForm />
    </div>
  )
}

export default PostNav;