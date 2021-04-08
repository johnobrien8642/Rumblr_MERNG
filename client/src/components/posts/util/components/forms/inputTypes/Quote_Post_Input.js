import React from 'react';

const QuotePostInput = ({
  quote, setQuote,
  source, setSource
}) => {

  return (
    <div>
      <textarea
          value={quote}
          placeholder='"Quote"'
          onChange={e => setQuote(quote = e.target.value)}
      ></textarea>
      <span>&#8208;</span>
      <input 
        value={source}
        placeholder='Source'
        onChange={e => setSource(source = e.target.value)}
      />
    </div>
  )
}

export default QuotePostInput;