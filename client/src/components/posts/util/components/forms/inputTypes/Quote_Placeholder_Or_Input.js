import React, { useState, useRef, useEffect } from 'react';

const QuotePlaceholderOrInput = ({
  quote,
  setQuote,
}) => {
  let [active, setActive] = useState(false)
  let initKeyRef = useRef('')
  
  
  useEffect(() => {
    if (!quote) {
      var el = document.querySelector('.quoteInputPlaceholder')

      if (el) {
        el.textContent = 'Quote'
      }
    } else {
      var el = document.querySelector('.quoteInput')

      if (el) {
        el.textContent = initKeyRef.current
      }
    }
  }, [quote])

  
  if (active) {
    return (
      <div
        className='quoteInput'
        contentEditable='true'
        onInput={e => {
          initKeyRef.current = e.target.textContent
        }}
      ></div>
    )
  } else {
    return (
      <span
        className='quoteInputPlaceholder'
        contentEditable='true'
        onKeyDown={e => {
          var anyNonWhitespaceChar = new RegExp(/\S/)
        
          if (anyNonWhitespaceChar.test(e.key)) {
            initKeyRef.current = e.key
            setQuote(quote = e.key)
            setActive(active = true)
          }
        }}
      ></span>
    )
  }
}

export default QuotePlaceholderOrInput;