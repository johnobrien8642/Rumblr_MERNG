import React from 'react';

const DescriptionStringInput = ({
  body, description, setDescription,
}) => {

  return (
    <textarea
      value={description}
      placeholder='Write a description...'
      onChange={e => setDescription(description = e.target.value)}
      onKeyPress={e => {
        if (e.key === 'Enter' && description !== '') {
          var textObj = {
            kind: 'text',
            content: description, 
            displayIdx: body.current.length
          }
          body.current.push(textObj)
          setDescription(description = '')
        }
      }}
    ></textarea>
  )
}

export default DescriptionStringInput;