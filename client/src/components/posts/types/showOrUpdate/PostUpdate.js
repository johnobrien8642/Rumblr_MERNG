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
    switch(post.kind) {
      case 'TextPost':
        return (
          <TextPostForm
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        )
      case 'PhotoPost':
        return (
          <PhotoPostForm 
            post={post} 
            update={update}
            setUpdate={setUpdate}
          />
        )
      case 'QuotePost':
        return (
          <QuotePostForm 
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        )
      case 'LinkPost':
        return (
          <LinkPostForm
            post={post}
            update={update}
            setUpdate={setUpdate}
          />

        )
      case 'ChatPost':
        return (
          <ChatPostForm 
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        )
      case 'AudioPost':
        return (
          <AudioPostForm 
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        )
      case 'VideoPost':
        return (
          <VideoPostForm 
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        )
      default:
        return
    }
  }

  return (
    <div>
      
      {renderForm(post)}

      <img
        className='backBtn'
        src="https://img.icons8.com/windows/32/000000/long-arrow-left.png"
        alt=''
        onClick={() => {
          toggleUpdate(update, setUpdate)
        }}
      />
    </div>
  )
}

export default PostUpdate;