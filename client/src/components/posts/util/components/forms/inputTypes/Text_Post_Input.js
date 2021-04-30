import React, { useEffect } from 'react';
import TextAndImageInput from './Text_And_Image_Input'
import PostUpdateUtil from '../../../functions/post_update_util.js';
const { reassembleTextPostStatics } = PostUpdateUtil;

const TextPostInput = ({
  post, title, setTitle,
  textAndImage,
  setTextAndImage,
  update
}) => {
  
  useEffect(() => {
    if (post) {
      var button = document.querySelector('.ck-block-toolbar-button .ck-button__icon')
      button.innerHTML = ''
    }
  })

  return (
    <div>
      <input
        value={title}
        placeholder='Title'
        onChange={e => setTitle(title = e.target.value)}
      />
      <TextAndImageInput
        post={post}
        update={update}
        textAndImage={textAndImage}
        setTextAndImage={setTextAndImage}
      />
    </div>
  )
}

export default TextPostInput;