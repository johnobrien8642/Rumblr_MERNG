import React from 'react'
import PostFormUtil from '../../../functions/post_form_util.js'
const { removeBodyObj, drag, 
        onDropBody, allowDrop } = PostFormUtil;

const BodyTextDnD = ({
  i, text, body,
  bodyImageFiles,
  setBodyImageFiles,
  render, setRender
}) => {
  return (
    <div
      onDrop={e => {
        onDropBody(
          e, i, body,
          bodyImageFiles,
        )
        
        setRender(render += 1)
      }}
      onDragStart={e => drag(e, i, JSON.stringify(text))}
      onDragOver={e => allowDrop(e)}
      className='draggable'
      draggable='true'
    >
      <button
        type='button'
        onClick={() => {
          removeBodyObj(
            i, text.srcType, body,
            setBodyImageFiles,
            bodyImageFiles
          )
          
          setRender(render + 1)
        }
        }
      >
        X
      </button>
      <div dangerouslySetInnerHTML={{ __html: text.content }}/>
    </div>
  )
}

export default BodyTextDnD;