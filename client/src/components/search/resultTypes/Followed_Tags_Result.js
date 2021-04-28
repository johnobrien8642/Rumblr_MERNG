import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';
const { FETCH_USER_FOLLOWED_TAGS } = Queries;

const FollowedTags = ({active}) => {

  let { loading, error, data } = useQuery(FETCH_USER_FOLLOWED_TAGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  let { user } = data;
  
  if (active) {
    return (
      <ul>
        {user.tagFollows.map((tag, i) => {
          return (
            <li 
              key={tag._id}
            >
              <Link 
                to={`/view/tag/${tag.title}`}
              >
                {tag.title}
              </Link>
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