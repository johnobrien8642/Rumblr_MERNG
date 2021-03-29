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
      blogName: Cookies.get('currentUser')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  let { user } = data;
  
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
          <Logout />
        </li>
        <li>
          <Link to='/likes'>Likes</Link>
          <span>{user.postLikeCount}</span>
        </li>
        <li>
          <Link to='/following'>Following</Link>
          <span>{user.userFollowCount}</span>
        </li>
        <li>
          <Link 
            to={`/view/blog/${user.blogName}`} 
          >
            {user.blogName}
          </Link>
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