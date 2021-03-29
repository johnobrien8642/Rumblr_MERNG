import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Results from './Results';
import FollowedTags from './types/Followed_Tags.js';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const Search = () => {
  let [input, setInput] = useState('');
  let [active, setActive] = useState('');

  const activateFollowedTags = () => {
    active ? setActive(active = false) : setActive(active = true)
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
            activateFollowedTags()
            setInput(input = e.target.value)
          }}
          onFocus={activateFollowedTags}
          onBlur={activateFollowedTags}
        />
        <FollowedTags active={active} />
        <Results input={input} />
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