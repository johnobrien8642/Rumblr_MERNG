import React, { useEffect, useState } from 'react';
import tinymce from 'tinymce';
import PostFormUtil from '../../../functions/post_form_util.js';
const { removeBodyObj, drag, 
        onDropBody, allowDrop } = PostFormUtil;

const BodyTextDnD = ({
  bodyIdx, formInputId, 
  text, body,
  bodyImageFiles,
  setBodyImageFiles,
  objsToClean,
  render, setRender,
}) => {
  let [html, setHTML] = useState(text.content)


  useEffect(() => {
    tinymce.init({
      selector: `#${text.uniqId}`,
      plugins: 'autolink link',
      toolbar: 'bold italic underline link',
      menubar: 'insert format',
      inline: true,
    })

    const interval = setInterval(() => {
      var bodyEditor2 = document.querySelector(`#${text.uniqId}`)
      var innerHTML = bodyEditor2.innerHTML
      if (html !== innerHTML) {
        //eslint-disable-next-line
        setHTML(html = innerHTML)

        body.current[bodyIdx].content = innerHTML

        if (window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(bodyEditor2)
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }, 100)
    
    return function cleanup() {
      clearInterval(interval)
    }

  }, [formInputId])

  
  const toggleEdit = () => {
    var editable = document
      .querySelector(`#${text.uniqId}`)
      .getAttribute('contentEditable')

    if (editable === true) {
      document
        .querySelector(`#${text.uniqId}`)
        .setAttribute('contentEditable', 'false')
    } else {
      document
        .querySelector(`#${text.uniqId}`)
        .setAttribute('contentEditable', 'true')
    }
  }

  return (
    <div
      className='draggable'
      onDrop={e => {
        onDropBody(
          e, bodyIdx, body,
          bodyImageFiles,
        )
        
        setRender(render + 1)
      }}
      onDragStart={e => drag(e, bodyIdx, JSON.stringify(text))}
      onDragOver={e => allowDrop(e)}
      draggable='true'
    >
      <div
        className='textDnDContent'
        contentEditable={false}
        id={`${text.uniqId}`}
        onClick={() => {
          toggleEdit()
        }}
        onInput={e => {
          setHTML(html = e.currentTarget.outerHTML)
        }}
        dangerouslySetInnerHTML={{ __html: text.content }}
      />
      <button
        type='button'
        onClick={() => {
          removeBodyObj(
            text.srcType, body,
            setBodyImageFiles,
            bodyImageFiles,
            objsToClean, bodyIdx
          )
          
          setRender(render + 1)
        }}
      >
        X
      </button>
    </div>
  )
}

export default BodyTextDnD;