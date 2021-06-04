import React, { useEffect, useState } from 'react';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewMainImages, previewProfilePic, previewLink } = PostFormUtil;

const AddPhotoDivOrPhotoInput = ({
  showBtnBool,
  main,
  mainImageFiles,
  setMainImageFiles,
  render, 
  setRender,
  errMessage, 
  setErrMessage
}) => {
  let [displayBtn, setDisplayBtn] = useState(showBtnBool)

  useEffect(() => {

    setDisplayBtn(displayBtn = showBtnBool)

  }, [showBtnBool, displayBtn, setDisplayBtn])
  

  if (displayBtn) {
    return (
      <div
        className='addPhotoBtn'
        onClick={() => {
          setDisplayBtn(displayBtn = false)
        }}
      >
        <div>
          <img
            src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
            alt=''
          />
          <span>Add another</span>
        </div>
      </div>
    )
  } else {
    return (
        <div
          className='mainImageFileInputContainer'
        >

        <label
          className='mainImageFileInputCustomLabel'
        >
            <div>
              <img
                src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
                alt=''
              />
              <span>Upload a picture</span>
            </div>
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
            </label>
            <img
              className='linkIcon'
              src="https://img.icons8.com/flat-round/64/000000/link--v1.png"
              alt=''
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
        <div  className='borderMiddle'/>
        <p>{errMessage}</p>
      </div>
    )
  }
}

export default AddPhotoDivOrPhotoInput;