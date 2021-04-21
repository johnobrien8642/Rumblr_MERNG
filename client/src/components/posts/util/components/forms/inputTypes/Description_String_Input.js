import React, { useEffect, useRef } from 'react';
import tinymce from 'tinymce'
const DescriptionStringInput = ({
  body, description, 
  setDescription, formInputId
}) => {
  let key = useRef('')
  
  useEffect(() => {
    tinymce.init({
      selector: '.bodyTextEditor',
      plugins: 'autolink link',
      toolbar: 'bold italic underline link',
      menubar: 'insert format',
      inline: true,
    })

    var bodyEditor1 = document.querySelector('.bodyTextEditor')
    var hearKey = bodyEditor1.addEventListener('keydown', function(e) {
      key.current = e.key
    })

    const interval = setInterval(() => {
      var bodyEditor2 = document.querySelector('.bodyTextEditor')
      var innerHTML = bodyEditor2.innerHTML
      
      if (description !== innerHTML) {
        //eslint-disable-next-line
        setDescription(description = innerHTML)
      }
  }, 50)
    
    return function cleanup() {
      bodyEditor1.removeEventListener('keydown', hearKey, true)
      clearInterval(interval)
    }
  }, [formInputId])

  return (
    <React.Fragment>
      <div
        id={formInputId}
        className='bodyTextEditor'
        contentEditable={true}
        placeholder='Write a description...'
        value={description}
        onInput={e => {
          if (key.current !== 'Enter') {
            setDescription(description = e.target.innerHTML)
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && description !== '') {
            var textObj = {
              kind: 'text',
              srcType: 'text',
              content: description,
              displayIdx: body.current.length
            }
            
            body.current.push(textObj)
            // key.current = ''
            document.querySelector(`#${formInputId}`).innerHTML = ''
            setDescription(description = '')
          }
        }}
      ></div>
    </React.Fragment>
  )
}

export default DescriptionStringInput;