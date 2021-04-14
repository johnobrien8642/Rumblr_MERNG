import React from 'react';

const DescriptionStringInput = ({
  body, description, setDescription, formInputId
}) => {
  return (
    <React.Fragment>
      <div
        id={formInputId}
        className='textEditor'
        contentEditable={true}
        value={description}
        placeholder='Write a description...'
        onInput={e => setDescription(description = e.target.innerHTML)}
        onKeyDown={e => {
          if (e.key === 'Enter' && description !== '') {
            var textObj = {
              kind: 'text',
              content: description,
              displayIdx: body.current.length
            }

            document.querySelector(`#${formInputId}`).innerHTML = ''
            body.current.push(textObj)
            setDescription(description = '')
          }
        }}
      ></div>
    </React.Fragment>
  )
}

export default DescriptionStringInput;