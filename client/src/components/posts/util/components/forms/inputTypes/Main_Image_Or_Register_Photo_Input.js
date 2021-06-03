import React from 'react';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewMainImages, previewProfilePic, previewLink } = PostFormUtil;

const MainImageOrRegisterPhotoInput = ({
  register,
  previewProfilePicRef,
  profileImageFile,
  setProfileImageFile,
  formId,
  main,
  mainImageFiles,
  setMainImageFiles,
  render, 
  setRender,
  errMessage, 
  setErrMessage
}) => {

  if (register) {
    return (
      <React.Fragment>
          <label
            className='profilePicFileInputCustomLabel'
          >
            <div>
              <img
                src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
                alt=''
              />
              <span>Upload a profile picture</span>
            </div>
            <input
              hidden
              id='profilePicFileInput'
              type='file'
              name='image'
              accept='.png, .jpg, jpeg'
              onChange={e => {
                previewProfilePic(
                  e,
                  previewProfilePicRef,
                  profileImageFile,
                  setProfileImageFile
                  )
                  
                  document.querySelector('#profilePicFileInput').value = ''
                }}
                />
          </label>
          <p>{errMessage}</p>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <h2>Main Images</h2>
          <p>{errMessage}</p>
            <input
              id='mainFileInput'
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
                
                document.querySelector('#mainFileInput').value = ''
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
}

export default MainImageOrRegisterPhotoInput;