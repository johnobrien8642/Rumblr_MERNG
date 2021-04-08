import React from 'react'
import PostCreateUtil from '../../../functions/post_create_util.js'
const { removeBodyObj, drag, 
        onDropBody, allowDrop } = PostCreateUtil;

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
            i, img.kind, body,
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