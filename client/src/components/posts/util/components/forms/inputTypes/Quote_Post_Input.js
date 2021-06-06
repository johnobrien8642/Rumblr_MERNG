import React, { useEffect } from 'react';
import QuotePlaceholderOrInput from './Quote_Placeholder_Or_Input';

const QuotePostInput = ({
  post, 
  quote, 
  setQuote,
  source, 
  setSource,
  placeholder,
  setPlaceholder
}) => {
  
  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setQuote(quote = post.quote)
      //eslint-disable-next-line
      setSource(source = post.source)
    }

  }, [quote])

  return (
    <div
      className='quoteAndSourceInputContainer'
    >
      <div
        className='quoteInputContainer'
      >
        <span
          data-placeholder='"Quote"'
          data-quote={'"'}
          className={quote ? 'quoteInput active' : 'quoteInput placeholder'}
          contentEditable='true'
          onInput={e => {
            setQuote(quote = e.target.textContent)
          }}
        ></span>
      </div>

      <div
        className='dashAndSource'
      >
        <span
          className='dash'
        >
          <span>-</span>
        </span>

        {/* <input
          className='source'
          value={source}
          placeholder='Source'
          onChange={e => setSource(source = e.target.value)}
        /> */}
        <span
          data-placeholder='Source'
          className={quote ? 'sourceInput' : 'sourceInput placeholder'}
          contentEditable='true'
          onInput={e => {
            setSource(source = e.target.textContent)
          }}
        ></span>
      </div>
    </div>
  )
}

export default QuotePostInput;