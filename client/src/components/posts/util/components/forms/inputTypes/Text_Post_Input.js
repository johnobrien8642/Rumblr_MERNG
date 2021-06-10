import React, { useEffect } from 'react';
import PostUpdateUtil from '../../../functions/post_update_util.js';
const { reassembleTextPostStatics } = PostUpdateUtil;

const TextPostInput = ({
  post, title, setTitle,
}) => {

  useEffect(() => {
    if (post) {
      reassembleTextPostStatics(post, title, setTitle)
    }
    //eslint-disable-next-line
  }, [])

  return (
    <div
      className='titleInputContainer'
    >
      <span
        data-placeholder='Title'
        className={title ? 'titleInput active' : 'titleInput placeholder'}
        contentEditable='true'
        onInput={e => {
          setTitle(title = e.target.textContent)
        }}
      ></span>
    </div>
    // <input
    //   className='titleInput'
    //   value={title}
    //   placeholder='Title'
    //   onChange={e => setTitle(title = e.target.value)}
    // />
  )
}

export default TextPostInput;