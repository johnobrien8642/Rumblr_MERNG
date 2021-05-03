import React from 'react';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewBodyImages, previewLink } = PostFormUtil;

const BodyImageInput = ({
  formId, body, 
  bodyImageFiles,
  setBodyImageFiles,
  render, setRender,
  errMessage, setErrMessage
}) => {

  return (
    <React.Fragment>
      <p>{errMessage}</p>
        <input
          id='bodyFileInput'
          tabIndex={-1}
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
            document.querySelector('#bodyFileInput').value = ''
          }}
        />
        <textarea
          tabIndex={-1}
          placeholder='Paste a url...'
          onChange={e => {
            var newLinkObj = previewLink(e)
            
            if (newLinkObj) {
              body.current.push(newLinkObj)
              setRender(render + 1)
              e.target.value = ''
            }
          }}
        ></textarea>
    </React.Fragment>
  )
}

export default BodyImageInput;