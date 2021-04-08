import React from 'react';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewMainImages, removeMainObj, 
        onDropMain, drag, allowDrop  } = PostCreateUtil;

const PhotoPostInput = ({
  main, mainImageFiles,
  setMainImageFiles,
  errMessage,
  setErrMessage
}) => {

  return (
    <div
      className={'mainPreview'}
    >
      {main.current.map((obj, i) => {
      return (
          <div
            key={i}
            onDrop={e => {
              var sortedMainImageFiles = onDropMain(
                e, i, main,
                mainImageFiles,
              )
              
                setMainImageFiles(mainImageFiles = [...sortedMainImageFiles])
              }
            }
          >
          <div
            draggable='true'
            onDragStart={e => drag(e, i, JSON.stringify(obj))}
            onDragOver={e => allowDrop(e)}
            className='draggable'
          >
            <button 
              type='button' 
              onClick={() => removeMainObj(
                  i, obj.kind, main, 
                  setMainImageFiles, 
                  mainImageFiles
                )
              }
            >
              X
            </button>
            <img src={obj.src} alt={obj.alt} /> 
          </div>
        </div>
        )
      })}

      <h2>Main Images</h2>
      <p>{errMessage}</p>
        <input
          type='file'
          multiple
          name='image'
          accept='.png, .jpg, jpeg'
          onChange={e => {
            previewMainImages(
              e, setMainImageFiles,
              mainImageFiles, 
              setErrMessage,
              errMessage,
              main
            )
            document.getElementById('photoPostForm').reset()
          }}
        />
    </div>
  )
}

export default PhotoPostInput;