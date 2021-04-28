import React from 'react';
import { useQuery } from '@apollo/client';
import Feed from './Feed.js';
import { useParams } from 'react-router-dom';
import Queries from '../../graphql/queries';
const { FETCH_TAG } = Queries;
 
const TagFeed = () => {
  let { tagTitle } = useParams();
  var hashedTitle = "#" + tagTitle

  let { loading, error, data } = useQuery(FETCH_TAG, {
    variables: {
      query: hashedTitle
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { tag } = data;
  
  return (
    <Feed tag={tag} />
  )
}

export default TagFeed;
