import React from 'react';
import PhotoPostForm from '../posts/types/create/PhotoPostForm'
import TextPostForm from '../posts/types/create/TextPostForm'
import QuotePostForm from '../posts/types/create/QuotePostForm'


const PostNav = () => {

  return(
    <div>
      <TextPostForm />
      <PhotoPostForm />
      <QuotePostForm />
    </div>
  )
}

export default PostNav;