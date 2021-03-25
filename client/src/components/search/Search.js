import React, { useState } from 'react';
import Results from './Results'

const Search = () => {
  let [input, setInput] = useState('');

  return (
    <div>
      <input 
        type='text'
        value={input}
        placeholder={'Search Rumblr'}
        onChange={e => setInput(input = e.target.value)}
      />
      <Results input={input}/>
    </div>
  )
}

export default Search;