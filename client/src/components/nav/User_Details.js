import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Logout from '../auth/Logout.js'
import Queries from '../../graphql/queries';
import Cookies from 'js-cookie';
const { FETCH_USER_DETAILS_COUNTS } = Queries;

const UserDetails = ({
  navActive, setNavActive
}) => {
  let [active, setActive] = useState(false)

  useEffect(() => {
    document.onload = () => {
      document.querySelector('.userDetails').focus()
    }

    return () => {
      refetch()
    }
    //eslint-disable-next-line
  }, [])

  let { loading, error, data, refetch } = useQuery(FETCH_USER_DETAILS_COUNTS, {
    variables: {
      query: Cookies.get('currentUser')
    },
    fetchPolicy: 'cache-and-network'
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`

  let { user } = data;

  if (active) {
    return (
    <div
      className='userDetails'
      tabIndex={0}
      onBlur={e => {
        if (e.relatedTarget === null) {
          setActive(active = false)
        }
      }}
    >
      <button
        onClick={() => setNavActive(navActive = false)}
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
              setNavActive(navActive = false)
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
              setNavActive(navActive = false)
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
              setNavActive(navActive = false)
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
              setNavActive(navActive = false)
            }}
          >
            <h3>{user.blogName}</h3>
          </Link>
            <p>{user.blogDescription}</p>
        </li>
        <li>
          <Link
            to={`/view/blog/${user.blogName}`}
            onClick={() => {
              setNavActive(navActive = false)
            }}
          >
            <span>Posts</span>
            <span>{user.userPostsCount}</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/blog/${user.blogName}/followers`}
            onClick={() => {
              setNavActive(navActive = false)
            }}
          >
            <span>Followers</span>
          </Link>
          <span>{user.followersCount}</span>
        </li>
      </ul>
    </div>
    )
  } else {
    return (
      <div>
      <button
        onClick={() => {
          setActive(active = true)
          setNavActive(navActive = true)
        }}
      >
        User
      </button>
      </div>
    )
  }
}

export default UserDetails;