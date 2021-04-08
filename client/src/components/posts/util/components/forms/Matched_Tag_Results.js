import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../../../../graphql/queries.js';
const { FETCH_MATCHING_TAGS } = Queries;

const MatchedTagResults = ({
    query, handleClickTagInput,
    setTags, tags,
    setTag, tag
  }) => {
    let { loading, error, data } = useQuery(FETCH_MATCHING_TAGS, {
      variables: {
        filter: query
      }
    })

    if (loading) return 'Loading...';
    if (error) return `Error: ${error}`;

    return (
      <ul>
        {data.fetchMatchingTags.map((tag, i) => {
          return (
            <li 
              key={i}
              onClick={e => handleClickTagInput(
                  e, tag.title, 
                  setTags, tags, 
                  setTag, tag
                )
              }
            >
              {tag.title}
            </li>
          )
        })}
      </ul>
    )
}

export default MatchedTagResults;