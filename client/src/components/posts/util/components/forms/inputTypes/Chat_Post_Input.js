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

    var regexBold = new RegExp(/^(.*?:)/, 'gm')

    if (window.getSelection) {
      var sel = window.getSelection(),
      suffixNode, bold = document.createElement('span')
      bold.setAttribute('class', 'boldText')
      var range = sel.getRangeAt(0)
      range.deleteContents()
      
      var text = range.commonAncestorContainer.textContent
      var matched = text.match(regexBold)

      if (matched) {
        bold.innerText = range.commonAncestorContainer.textContent
        range.commonAncestorContainer.textContent = '';
        range.insertNode(bold)
        range.setEndAfter(bold)
        range.collapse(false)
        range.insertNode((suffixNode = document.createTextNode(' ')))
        range.setStartAfter(suffixNode);
        sel.removeAllRanges();
        sel.addRange(range)
      }
    }
  }

  return (
    <div
      className='chatText'
      contentEditable={true}
      onInput={e => {
        var html = document.querySelector('.chatText')

        if (e.nativeEvent.data !== null) {
          regexChat()
          setChat(chat = html.innerHTML)
        } else {
          setChat(chat = html.innerHTML)
        }
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