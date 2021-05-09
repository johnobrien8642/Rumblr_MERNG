import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';
import TagResult from '../resultTypes/Tag_Result';
const { FETCH_USER_FOLLOWED_TAGS } = Queries;

const FollowedTags = ({
  followedActive,
  setFollowedActive
}) => {

  let { loading, error, data } = useQuery(FETCH_USER_FOLLOWED_TAGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  let { user } = data;
  
  if (followedActive) {
    return (
      <ul
        className='followedTags'
      >
        <li>Tags you follow</li>
        {user.tagFollows.map((tag, i) => {
          return (
            <li 
              key={tag._id}
            >
              <TagResult 
                tag={tag}
              />
            </li>
          )
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