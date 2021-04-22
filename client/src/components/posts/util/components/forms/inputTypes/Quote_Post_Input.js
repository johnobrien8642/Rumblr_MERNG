import React, { useEffect } from 'react';

const QuotePostInput = ({
  post, quote, setQuote,
  source, setSource
}) => {
  
  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setQuote(quote = post.quote)
      //eslint-disable-next-line
      setSource(source = post.source)
    }
  }, [])

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