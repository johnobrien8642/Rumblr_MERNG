import React from 'react'
import PostFormUtil from '../../../functions/post_form_util.js'
const { removeMainObj, drag, 
        onDropMain, allowDrop } = PostFormUtil;

const MainImageDnD = ({
  i, img, main, 
  setMainImageFiles, 
  mainImageFiles
}) => {

  return (
    <div
      onDrop={e => {
          var sortedMainImageFiles = onDropMain(
            e, i, main, mainImageFiles
          )
    
          setMainImageFiles(mainImageFiles = [...sortedMainImageFiles])
        }
      }
      draggable='true'
      onDragStart={e => drag(e, i, JSON.stringify(img))}
      onDragOver={e => allowDrop(e)}
      className='draggable'
    >
      <button 
        type='button' 
        onClick={() => removeMainObj(
            img.arrPos, img.srcType, main,
            setMainImageFiles, 
            mainImageFiles
          )
        }
      >
        X
      </button>
      <img src={img.src} alt={img.alt} />
    </div>
  )
}

export default MainImageDnD;