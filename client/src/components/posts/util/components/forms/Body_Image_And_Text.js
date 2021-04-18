import React from 'react';
import BodyImageDnD from './dragAndDrop/Body_Image_DnD'
import BodyTextDnD from '../forms/dragAndDrop/Body_Text_DnD'
import BodyImageInput from './inputTypes/Body_Image_Input';
import DescriptionStringInput from './inputTypes/Description_String_Input';

const BodyImageAndText = ({
  formId, formInputId, 
  body, bodyImageFiles,
  setBodyImageFiles, description,
  setDescription, render, 
  setRender, errMessage, 
  setErrMessage
}) => {
  
  return(
  <div
    className={'bodyPreview'}
  >
        {body.current.map((obj, i) => {
          if (obj.srcType === 'newImgFile' || obj.srcType === 'newImgLink') {
              return (
                <React.Fragment
                  key={i}
                >
                  <BodyImageDnD
                    i={i}
                    img={obj}
                    body={body}
                    bodyImageFiles={bodyImageFiles}
                    setBodyImageFiles={setBodyImageFiles}            
                  />
                </React.Fragment>
              )
            } else if (obj.srcType === 'text') {
              return (
                <React.Fragment
                  key={i}
                >
                  <BodyTextDnD
                    i={i}
                    text={obj}
                    body={body}
                    bodyImageFiles={bodyImageFiles}
                    setBodyImageFiles={setBodyImageFiles}
                    render={render}
                    setRender={setRender}
                  />
                </React.Fragment>
              )
          } else {
            return (
              <div></div>
            )
          }
        })}


        <div>
          <BodyImageInput
            formId={formId}
            body={body}
            bodyImageFiles={bodyImageFiles}
            setBodyImageFiles={setBodyImageFiles}
            render={render}
            setRender={setRender}
            errMessage={errMessage}
            setErrMessage={setErrMessage}
          />

          <DescriptionStringInput
            body={body}
            description={description}
            setDescription={setDescription}
            formInputId={formInputId}
          />
        </div>
      </div>
  )
}

export default BodyImageAndText;