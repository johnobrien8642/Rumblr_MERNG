import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Results from './Results';
import FollowedTags from './resultTypes/Followed_Tags_Result.js';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const Search = ({
  searchClose,
  closeSearch
}) => {
  let [input, setInput] = useState('');
  let [followedActive, setFollowedActive] = useState(false)
  let [active, setActive] = useState('');
  
  useEffect(() => {
    if (searchClose) {
      //eslint-disable-next-line
      setFollowedActive(active = false)
      //eslint-disable-next-line
      closeSearch(searchClose = false)
    }
  }, [searchClose])

  const onBlur = (e) => {
    if (!e.relatedTarget) {
      setActive(active = false)
      setFollowedActive(followedActive = false)
    }
  }

  const { data } = useQuery(IS_LOGGED_IN);

  if (data.isLoggedIn) {
    return (
      <div
        className='searchBar'
        onBlur={e => onBlur(e)}
        onFocus={e => {
            if (
              !e.relatedTarget || 
              e.relatedTarget.localName === 'a'
            ) {
              setFollowedActive(followedActive = true)
            }
        }}
      >
        <input
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onChange={e => {
            setInput(input = e.target.value)
            setFollowedActive(followedActive = false)
            setActive(active = true)
          }}
        />
        <FollowedTags
          followedActive={followedActive}
        />
        <Results 
          input={input} 
          active={active}
          setActive={setActive}s
        />
      </div>
    )
  } else {
    return (
      <div
        className='searchBar'
      >
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