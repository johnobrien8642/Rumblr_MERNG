import React from 'react';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewMainImages, previewLink } = PostCreateUtil;

const MainImageInput = ({
  formId, main, 
  mainImageFiles,
  setMainImageFiles,
  render, setRender,
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
          <textarea
            placeholder='Paste a url...'
            onChange={e => {
              var newLinkObj = previewLink(e)

              if (newLinkObj) {
                main.current.push(newLinkObj)
                e.target.value = ''
                setRender(render + 1)
              }
            }}
          ></textarea>
    </React.Fragment>
  )
}

export default MainImageInput;