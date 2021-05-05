import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;


const Nav = () => {
  let [navActive, setNavActive] = useState(false)
  const { data } = useQuery(IS_LOGGED_IN)
  
  if (data.isLoggedIn) {
    return (
      <div>
        <div>
          <Link 
            to='/dashboard'
            onClick={() => {
              setNavActive(navActive = false)
            }}
          >
            <span>R</span>
          </Link>
          <Search />
        </div>

        <div>
          <Link 
            to='/dashboard'
            onClick={() => {
              setNavActive(navActive = false)
            }}
          >
            Home
          </Link>
          <Activity
            navActive={navActive}
            setNavActive={setNavActive}
          />
          <UserDetails
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <Link 
          to='/dashboard'
          onClick={() => {
            setNavActive(navActive = false)
          }}
        >
          <span>R</span>
        </Link>
        <Search />
        <Link to='/login'><button>Login</button></Link>
        <Link to='/register'><button>Register</button></Link>
      </div>
    )
  }
}

export default Nav;