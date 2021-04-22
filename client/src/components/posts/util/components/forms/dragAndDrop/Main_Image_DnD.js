import React from 'react'
import PostFormUtil from '../../../functions/post_form_util.js'
const { removeMainObj, drag, 
        onDropMain, allowDrop } = PostFormUtil;

const MainImageDnD = ({
  mainIdx, img, main, 
  setMainImageFiles, 
  mainImageFiles,
  objsToClean,
  render, setRender
}) => {

  return (
    <div
      onDrop={e => {
          var sortedMainImageFiles = onDropMain(
            e, mainIdx, main, mainImageFiles
          )
    
          setMainImageFiles(mainImageFiles = [...sortedMainImageFiles])
        }
      }
      draggable='true'
      onDragStart={e => drag(e, mainIdx, JSON.stringify(img))}
      onDragOver={e => allowDrop(e)}
      className='draggable'
    >
      <button 
        type='button' 
        onClick={() => {
          removeMainObj(
            img.srcType, main,
            setMainImageFiles,
            mainImageFiles,
            objsToClean,
            mainIdx, img.arrPos
          )

          setRender(render + 1)
        }}
      >
        X
      </button>
      <img src={img.src} alt={img.alt} />
    </div>
  )
}

export default MainImageDnD;