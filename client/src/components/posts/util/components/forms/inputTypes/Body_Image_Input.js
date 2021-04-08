import React from 'react';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewBodyImages } = PostCreateUtil;

const BodyImageInput = ({
  body, bodyImageFiles,
  setBodyImageFiles,
  errMessage, setErrMessage
}) => {

  return (
    <React.Fragment>
      <h2>Body Images</h2>
        <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewBodyImages(
                e, body, bodyImageFiles,
                setBodyImageFiles,
                setErrMessage, errMessage,
              )
              document.getElementById('textPostForm').reset()
            }}
          />
    </React.Fragment>
  )
}

export default BodyImageInput;