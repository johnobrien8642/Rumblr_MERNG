import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Search from '../search/Search';
import UserDetails from './User_Details'
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;


const Nav = () => {
  let [active, setActive] = useState(false)
  const { data } = useQuery(IS_LOGGED_IN)
  
  if (data.isLoggedIn) {
    return (
      <div>
        <Link 
          to='/dashboard'
          onClick={() => {
            setActive(active = false)
          }}
        >
          <span>R</span>
        </Link>
        <Search />
        <Link 
          to='/dashboard'
          onClick={() => {
            setActive(active = false)
          }}
        >
          Home
        </Link>
        <UserDetails
          active={active}
          setActive={setActive}
        />
      </div>
    )
  } else {
    return (
      <div>
        <Link 
          to='/dashboard'
          onClick={() => {
            setActive(active = false)
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