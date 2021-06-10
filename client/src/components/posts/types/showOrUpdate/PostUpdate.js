import React from 'react';
import TextPostForm from '../create/TextPostForm'
import PhotoPostForm from '../create/PhotoPostForm'
import QuotePostForm from '../create/QuotePostForm'
import LinkPostForm from '../create/LinkPostForm'
import ChatPostForm from '../create/ChatPostForm'
import AudioPostForm from '../create/AudioPostForm'
import VideoPostForm from '../create/VideoPostForm'

const PostUpdate = ({ 
  post, update,
  setUpdate, toggleUpdate
}) => {
  
  const renderForm = (post) => {
    if (post.kind === 'TextPost') {
      return (
        <TextPostForm
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )

    } else if (post.kind === 'PhotoPost') {
      return (
        <PhotoPostForm 
          post={post} 
          update={update}
          setUpdate={setUpdate}
        />
      )
    } else if (post.kind === 'QuotePost') {
      return (
        <QuotePostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )
    } else if (post.kind === 'LinkPost') {
      return (
        <LinkPostForm
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )
    } else if (post.kind === 'ChatPost') {
      return (
        <ChatPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )
    } else if (post.kind === 'AudioPost') {
      return (
        <AudioPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )
    } else if (post.kind === 'VideoPost') {
      return (
        <VideoPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
        />
      )
    }
  }

  return (
    <React.Fragment>
      
      {renderForm(post)}

      <img
        className='backBtn'
        src="https://img.icons8.com/windows/32/000000/long-arrow-left.png"
        alt=''
        onClick={() => {
          toggleUpdate(update, setUpdate)
        }}
      />
    </React.Fragment>
  )
}

export default PostUpdate;