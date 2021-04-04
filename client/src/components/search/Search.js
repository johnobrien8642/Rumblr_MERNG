import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Results from './Results';
import FollowedTags from './resultTypes/Followed_Tags_Result.js';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const Search = () => {
  let [input, setInput] = useState('');
  let [active, setActive] = useState('');
  
  const onBlur = (e) => {
    if (!e.relatedTarget) {
      setActive(active = false)
    }
  }

  const clickActivate = () => {
    if (active) {
      setActive(active = false)
    } else {
      setActive(active = true)
    }
  }


  const inputActivate = () => {
    if (input) {
      setActive(active = true)
    } else {
      setActive(active = false)
    }
  }

  const { data } = useQuery(IS_LOGGED_IN);

  if (data.isLoggedIn) {
    return (
      <div
        onBlur={e => onBlur(e)}
      >
        <input 
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onChange={e => {
            setInput(input = e.target.value)
            inputActivate()
          }}
        />
        <FollowedTags active={active} activate={clickActivate} />
        <Results input={input} active={active} activate={clickActivate} />
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