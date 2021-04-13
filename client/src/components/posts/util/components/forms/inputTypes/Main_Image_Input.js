import React from 'react';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewMainImages } = PostCreateUtil;

const MainImageInput = ({
  formId, main, 
  mainImageFiles,
  setMainImageFiles,
  errMessage, setErrMessage
}) => {

  return (
    <React.Fragment>
      <h2>Main Images</h2>
        <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewMainImages(
                e, main, mainImageFiles,
                setMainImageFiles,
                setErrMessage, errMessage,
              )
              document.getElementById(`${formId}`).reset()
            }}
          />
    </React.Fragment>
  )
}

export default MainImageInput;