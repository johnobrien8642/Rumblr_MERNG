import React from 'react';
import AddPhotoDivOrPhotoInput from './Add_Photo_Div_Or_Photo_Input';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewProfilePic } = PostFormUtil;

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
      <AddPhotoDivOrPhotoInput
        showBtnBool={main.current.length > 0}
        main={main}
        mainImageFiles={mainImageFiles}
        setMainImageFiles={setMainImageFiles}
        render={render}
        setRender={setRender}
        errMessage={errMessage}
        setErrMessage={setErrMessage}
      />
    )
    // return (
    //     <div
    //       className='mainImageFileInputContainer'
    //     >

    //     <label
    //       className='mainImageFileInputCustomLabel'
    //     >
    //         <div>
    //           <img
    //             src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
    //             alt=''
    //           />
    //           <span>Upload a picture</span>
    //         </div>
    //         <input
    //           id='mainFileInput'
    //           type='file'
    //           multiple
    //           name='image'
    //           accept='.png, .jpg, jpeg'
    //           onChange={e => {
    //             previewMainImages(
    //               e, main, mainImageFiles,
    //               setMainImageFiles,
    //               setErrMessage, errMessage,
    //             )
                
    //             document.querySelector('#mainFileInput').value = ''
    //           }}
    //         />
    //         </label>
    //         <img
    //           className='linkIcon'
    //           src="https://img.icons8.com/flat-round/64/000000/link--v1.png"
    //           alt=''
    //         />
    //         <textarea
    //           placeholder='Paste a url...'
    //           onChange={e => {
    //             var newLinkObj = previewLink(e)
                
    //             if (newLinkObj) {
    //               main.current.push(newLinkObj)
    //               e.target.value = ''
    //               setRender(render + 1)
    //             }
    //           }}
    //         ></textarea>
    //     <div  className='borderMiddle'/>
    //     <p>{errMessage}</p>
    //   </div>
    // )
  }
}

export default MainImageOrRegisterPhotoInput;