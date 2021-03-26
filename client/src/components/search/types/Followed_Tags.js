import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../../graphql/queries';
const { FETCH_USER_FOLLOWED_TAGS } = Queries;

const FollowedTags = ({active}) => {
  let { loading, error, data } = useQuery(FETCH_USER_FOLLOWED_TAGS)

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  let { currentUser } = data;
  console.log(currentUser)
  if (active) {
    return (
      <ul>
        {currentUser.tagFollows.map((tag, i) => {
          return <li key={tag._id}>{tag.title}</li>
        })}
      </ul>
    )
  } else {
    return (
      <ul>
      </ul>
    )
  }
}

export default FollowedTags;