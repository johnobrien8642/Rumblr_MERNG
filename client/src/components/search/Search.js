import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Queries from '../../graphql/queries';

const { SEARCH_USER_AND_POSTS } = Queries;

const Search = () => {
  let [input, setInput] = useState('');
  let [query, setQuery] = useState('');
  const ref = useRef('');
  
  if (ref.current !== input) {
    ref.current = input
    setTimeout(() => {
      setQuery(query = input)
    }, 300)
  }

  let { loading, error, data } = useQuery(SEARCH_USER_AND_POSTS,
        { variables: {
          filter: { OR: [
            {blogName_contains: query},
            {tags_contain: query }]
          }
        }
      }
    );
    console.log(data)
    const handleSubmit = e => {
      e.preventDefault();
    }
    
    if (loading) return 'Loading...';
    if (error) return `Error: ${error.message}`;
  
  return (
    <div>
      <input 
        type='text'
        value={input}
        placeholder='Search Rumblr'
        onChange={e => setInput(input = e.target.value)}
      />
      <ul>
        {data.usersAndPosts.map((res, i) => {
          return (
          <li 
            key={i}
          >
            {res.blogName}
            <form
              onSubmit={e => handleSubmit(e)}
            >
              <input type='hidden' value={res._id} />
              <button type='submit'>Follow</button>
            </form>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Search;