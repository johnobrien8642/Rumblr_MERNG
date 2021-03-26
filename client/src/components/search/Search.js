import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Results from './Results';
import FollowedTags from './types/Followed_Tags.js';
import Queries from '../../graphql/queries';

const Search = () => {
  let [input, setInput] = useState('');
  let [active, setActive] = useState('');
  const { IS_LOGGED_IN } = Queries;

  const activateFollowedTags = () => {
    active ? setActive(active = false) : setActive(active = true)
  }
  const { data } = useQuery(IS_LOGGED_IN);
  if (data.IS_LOGGED_IN) {
    return (
      <div>
        <input 
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onChange={e => setInput(input = e.target.value)}
          onClick={activateFollowedTags}
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