import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Results from './Results';
import FollowedTags from './resultTypes/Followed_Tags_Result.js';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const Search = () => {
  let [input, setInput] = useState('');
  let [active, setActive] = useState('');

  const activate = () => {
    if (active) {
      setActive(active = false)
      setInput(input = '')
    } else {
      setActive(active = true)
    }
  }

  const { data } = useQuery(IS_LOGGED_IN);

  if (data.isLoggedIn) {
    return (
      <div>
        <input 
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onChange={e => {
            setInput(input = e.target.value)
          }}
          onClick={activate}
        />
        <FollowedTags active={active} activate={activate} />
        <Results input={input} active={active} activate={activate} />
      </div>
    )
  } else {
    return (
      <div>
        <input 
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onChange={e => setInput(input = e.target.value)}
        />
      </div>
    )
  }

}

export default Search;