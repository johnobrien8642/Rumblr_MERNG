import React from 'react';

const TextPostInput = ({
  title, setTitle,
  main, setMain
}) => {

  return (
    <div>
      <input 
        value={title}
        placeholder='Title'
        onChange={e => setTitle(title = e.target.value)}
      />
      <div
          id='mainTextInput'
          className='textEditor'
          contentEditable={true}
          value={main}
          placeholder='Your text here...'
          onInput={e => setMain(main = e.target.innerHTML)}
      ></div>
    </div>
  )
}

export default TextPostInput;