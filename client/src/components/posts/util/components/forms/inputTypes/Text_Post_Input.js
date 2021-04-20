import React, { useEffect, useRef } from 'react';
import tinymce from 'tinymce';

const TextPostInput = ({
  formInputId, title, 
  setTitle,
  main, setMain
}) => {
  let key = useRef('');

  useEffect(() => {
    tinymce.init({
      selector: '.mainTextEditor',
      plugins: 'autolink link',
      toolbar: 'bold italic underline link',
      menubar: 'insert format',
      default_link_target: '_blank',
      inline: true
    })

    var bodyEditor1 = document.querySelector('.bodyTextEditor')
    var hearKey = bodyEditor1.addEventListener('keydown', function(e) {
      key.current = e.key
    })

    const interval = setInterval(() => {
      var bodyEditor2 = document.querySelector('.bodyTextEditor')
      var innerHTML = bodyEditor2.innerHTML
      
      if (main !== innerHTML) {
        //eslint-disable-next-line
        setMain(main = innerHTML)
      }
    }, 100)

    return function cleanup() {
      bodyEditor1.removeEventListener('keydown', hearKey, true)
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <input
        value={title}
        placeholder='Title'
        onChange={e => setTitle(title = e.target.value)}
      />
      <div
          id='mainTextInput'
          className='mainTextEditor'
          contentEditable={true}
          value={main}
          placeholder='Your text here...'
          onInput={e => setMain(main = e.target.innerHTML)}
      ></div>
    </div>
  )
}

export default TextPostInput;