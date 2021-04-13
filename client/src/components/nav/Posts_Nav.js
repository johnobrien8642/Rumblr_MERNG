import React from 'react';
import PhotoPostForm from '../posts/types/create/PhotoPostForm'
import TextPostForm from '../posts/types/create/TextPostForm'
import QuotePostForm from '../posts/types/create/QuotePostForm'
import LinkPostForm from '../posts/types/create/LinkPostForm'
import ChatPostForm from '../posts/types/create/ChatPostForm'
import AudioPostForm from '../posts/types/create/AudioPostForm'


const PostNav = () => {

  return(
    <div>
      <TextPostForm />
      <PhotoPostForm />
      <QuotePostForm />
      <LinkPostForm />
      <ChatPostForm />
      <AudioPostForm />
    </div>
  )
}

export default PostNav;