import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Logout from '../auth/Logout.js'
import Queries from '../../graphql/queries';
import Cookies from 'js-cookie';
const { FETCH_USER_DETAILS_COUNTS } = Queries;

const UserDetails = ({
  active, setActive
}) => {

  let { loading, error, data } = useQuery(FETCH_USER_DETAILS_COUNTS, {
    variables: {
      query: Cookies.get('currentUser')
    },
    pollInterval: active ? 300 : 0
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`
  let { user } = data;

  if (active && user) {
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
        
          <Link 
            to='/likes'
            onClick={() => {
              setActive(active = false)
            }}
          >
            <img 
              src="https://img.icons8.com/material-rounded/24/000000/like--v1.png" 
              alt='' 
            />
            Likes
          </Link>
          <span>{user.totalLikeCount}</span>
        </li>
        <li>
          <Link 
            to='/following'
            onClick={() => {
              setActive(active = false)
            }}
          >
            <img 
              src="https://img.icons8.com/metro/26/000000/add-user-male.png"
              alt=''
            />
            Following
          </Link>
          <span>{user.userFollowCount}</span>
        </li>
        <li>
          <Link 
            to='/settings/account'
            onClick={() => {
              setActive(active = false)
            }}
          >
            <img 
              src="https://img.icons8.com/material-sharp/24/000000/settings.png"
              alt=''
            />
            Settings
          </Link>
        </li>
        <li>
          <Link 
            to={`/view/blog/${user.blogName}`} 
            onClick={() => {
              setActive(active = false)
            }}
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