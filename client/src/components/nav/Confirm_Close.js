import React from 'react';

const ConfirmClose = ({
  mobile,
  confirmClose,
  setConfirmClose,
  allowScroll,
  resetInputs,
  setFormActive,
  formActive,
  setPostFormModal,
  postFormModal,
  repost,
  postFormOpen,
  setPostFormOpen
}) => {
  
  if (confirmClose) {
    return (
      <React.Fragment>
        <div className='confirmCloseModal' />
        <div
          className='confirmCloseContainer'
        >
          <span 
            className='discardTitle'
          >
            Discard this post?
          </span>
          <div>
            <div
              className='cancel'
              onClick={() => {
                setConfirmClose(confirmClose = false)
              }}
            >
              <span>Nevermind</span>
            </div>
            <div
              className='discard'
              onClick={() => {
                if ((repost && mobile) || mobile) {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setConfirmClose(confirmClose = false)
                  setPostFormModal(postFormModal = false)
                  setPostFormOpen(postFormOpen = false)
                } else if (repost) {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setConfirmClose(confirmClose = false)
                } else {
                  allowScroll(document)
                  resetInputs()
                  setFormActive(formActive = false)
                  setPostFormModal(postFormModal = false)
                  setConfirmClose(confirmClose = false)
                }
              }}
            >
              <span>Discard</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default ConfirmClose;