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

              document.getElementById(`${formId}`).reset()
            }}
          />
          <textarea
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