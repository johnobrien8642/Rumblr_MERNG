import React, { useEffect } from 'react';
import PostUpdateUtil from '../../../functions/post_update_util.js';
const { reassembleTextPostStatics } = PostUpdateUtil;

const TextPostInput = ({
  title, setTitle,
}) => {

  return (
    <div>
      <input
        value={title}
        placeholder='Title'
        onChange={e => setTitle(title = e.target.value)}
      />
    </div>
  )
}

export default TextPostInput;