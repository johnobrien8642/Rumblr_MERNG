import React, { useEffect } from 'react';

const ChatPostInput = ({
  chat, setChat,
  line, setLine
}) => {

  useEffect(() => {
    var firstSpace = document.createTextNode(' ')
    var chatDiv = document.querySelector('.chatText')
    chatDiv.appendChild(firstSpace)
  }, [])

  const regexChat = () => {
    var chatDiv = document.querySelector('.chatText')
  
    const bolded = chatDiv.innerText
      .replace(/^(.*?:)/gm, '<strong>$1</strong>')
      .split('\n').join('<br/>')

    chatDiv.innerHTML = bolded

    if (window.getSelection) {
      var range = document.createRange();
      range.selectNodeContents(chatDiv)
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  return (
    <div
      className='chatText'
      contentEditable={true}
      onInput={e => {
        regexChat()

        chat.current = e.target.innerHTML
      }}
      
      onKeyDown={e => {
        if (e.key === 'Enter') {
          if (window.getSelection) {
            var selection = window.getSelection(),
            range = selection.getRangeAt(0),
            br = document.createElement('br'),
            br2 = document.createElement('br'),
            suffixNode
            range.deleteContents();
            range.insertNode(br);
            range.collapse(false)
            range.insertNode(br2);
            range.setEndAfter(br2);
            range.collapse(false);
            range.insertNode((suffixNode = document.createTextNode(' ')));
            range.setStartAfter(suffixNode);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }}
    >
    </div>
  )
}

export default ChatPostInput;