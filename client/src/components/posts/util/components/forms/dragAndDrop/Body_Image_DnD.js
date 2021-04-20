import React from 'react'
import PostFormUtil from '../../../functions/post_form_util.js'
const { removeBodyObj, drag, 
        onDropBody, allowDrop } = PostFormUtil;

const BodyImageDnD = ({
  i, img, body, 
  setBodyImageFiles, 
  bodyImageFiles
}) => {

  return (
    <div
      onDrop={e => {
          var sortedBodyImageFiles = onDropBody(
            e, i, body,
            bodyImageFiles
          )
          
          setBodyImageFiles(bodyImageFiles = [...sortedBodyImageFiles])
        }
      }
      draggable='true'
      onDragStart={e => drag(e, i, JSON.stringify(img))}
      onDragOver={e => allowDrop(e)}
      className='draggable'
    >
      <button 
        type='button' 
        onClick={() => removeBodyObj(
            img.arrPos, img.srcType, body,
            setBodyImageFiles, 
            bodyImageFiles
          )
        }
      >
        X
      </button>
      <img src={img.src} alt={img.alt} />
    </div>
  )
}

export default BodyImageDnD;