import React from 'react';
import BodyImageDnD from './dragAndDrop/Body_Image_DnD'
import BodyTextDnD from '../forms/dragAndDrop/Body_Text_DnD'
import BodyImageInput from './inputTypes/Body_Image_Input';
import DescriptionStringInput from './inputTypes/Description_String_Input';

const BodyImageAndText = ({
  formId, body, bodyImageFiles,
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
          switch(obj.kind) {
            case 'img':
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
            case 'text':
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
              default:
                return 'no types matched draggable body'  
          }
        })}


        <div>
          <BodyImageInput
            formId={formId}
            body={body}
            bodyImageFiles={bodyImageFiles}
            setBodyImageFiles={setBodyImageFiles}
            errMessage={errMessage}
            setErrMessage={setErrMessage}
          />

          <DescriptionStringInput
            body={body}
            description={description}
            setDescription={setDescription}
          />
        </div>
      </div>
  )
}

export default BodyImageAndText;