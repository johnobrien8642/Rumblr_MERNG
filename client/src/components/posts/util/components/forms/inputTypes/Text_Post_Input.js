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
      <textarea
          value={main}
          placeholder='Your text here...'
          onChange={e => setMain(main = e.target.value)}
      ></textarea>
    </div>
  )
}

export default TextPostInput;