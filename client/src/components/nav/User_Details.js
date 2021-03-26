import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Logout from '../auth/login-logout/Logout.js'
import Queries from '../../graphql/queries';
import Cookies from 'js-cookie';
const { FETCH_USER_DETAILS_COUNTS } = Queries;

const UserDetails = () => {
  let [active, setActive] = useState(false);
  let { loading, error, data } = useQuery(FETCH_USER_DETAILS_COUNTS, {
    variables: {
      token: Cookies.get('auth-token')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  let { currentUser } = data;
  
  if (active) {
    return (
    <div>
      <button
        onClick={() => setActive(active = false)}
      >
        User
      </button>
      <ul>
        <li>
          <Link to='/likes'>Likes</Link>
          <span>{currentUser.postLikeCount}</span>
        </li>
        <li>
          <Link to='/following'>Following</Link>
          <span>{currentUser.userFollowCount}</span>
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    </div>
    )
  } else {
    return (
      <div>
      <button
        onClick={() => setActive(active = true)}
      >
        User
      </button>
      </div>
    )
  }
}

export default UserDetails;