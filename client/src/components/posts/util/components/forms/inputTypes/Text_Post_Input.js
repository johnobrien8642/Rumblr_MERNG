import React, { useEffect } from 'react';
import tinymce from 'tinymce';
import PostUpdateUtil from '../../../functions/post_update_util.js';
const { reassembleTextPostStatics } = PostUpdateUtil;

const TextPostInput = ({
  post, formInputId, 
  title, setTitle,
  main, setMain,
  mainRef,
  render, setRender
}) => {
  
  useEffect(() => {
    if (post) {
      reassembleTextPostStatics(
        post, title, setTitle, 
        main, setMain
      )

      setRender(render + 1)
    }
    
    tinymce.init({
      selector: '.mainTextEditor',
      plugins: 'autolink link',
      toolbar: 'bold italic underline link',
      menubar: 'insert format',
      default_link_target: '_blank',
      inline: true
    })

    // var bodyEditor1 = document.querySelector('.mainTextEditor')
    // var hearKey = bodyEditor1.addEventListener('keydown', function(e) {
    //   key.current = e.key
    // })

    const interval = setInterval(() => {
      var bodyEditor2 = document.querySelector('.mainTextEditor')
      var innerHTML = bodyEditor2.innerHTML
      
      if (mainRef.current !== innerHTML) {
        //eslint-disable-next-line
        setMain(main = innerHTML)
      }
    }, 50)

    return function cleanup() {
      // bodyEditor1.removeEventListener('keydown', hearKey, true)
      clearInterval(interval)
      // tinymce.remove()
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
          onInput={e => {
            // mainRef.current = e.target.innerHTML
            console.log(e.target.innerHTML)
            setMain(main = e.target.innerHTML)
          }}
      ></div>
    </div>
  )
}

export default TextPostInput;