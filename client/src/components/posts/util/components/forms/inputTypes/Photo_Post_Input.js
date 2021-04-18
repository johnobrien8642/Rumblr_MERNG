import React from 'react';
import MainImageDnD from '../../forms/dragAndDrop/Main_Image_DnD'
import MainImageInput from '../../forms/inputTypes/Main_Image_Input'

const PhotoPostInput = ({
  formId, main, 
  mainImageFiles,
  setMainImageFiles,
  render, setRender,
  errMessage,
  setErrMessage
}) => {

  return (
    <div
      className={'mainPreview'}
    >
      {main.current.map((obj, i) => {
      return (
        <React.Fragment
          key={i}
        >
          <MainImageDnD 
            i={i}
            img={obj}
            main={main}
            mainImageFiles={mainImageFiles}
            setMainImageFiles={setMainImageFiles}
          />
        </React.Fragment>
        )
      })}

      <MainImageInput
        formId={formId}
        main={main}
        mainImageFiles={mainImageFiles}
        setMainImageFiles={setMainImageFiles}
        render={render}
        setRender={setRender}
        errMessage={errMessage}
        setErrMessage={setErrMessage}
      />
    </div>
  )
}

export default PhotoPostInput;