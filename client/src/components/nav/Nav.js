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
  let [searchClose, closeSearch] = useState(false)
  let [activityClose, closeActivity] = useState(false)
  let [detailsClose, closeDetails] = useState(false)
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
          <Search 
            searchClose={searchClose}
            closeSearch={closeSearch}
          />
        </div>

        <div>
          <Link 
            to='/dashboard'
            onClick={() => {
              if (document.querySelector('.searchBar')) {
                document.querySelector('.searchBar').blur()
              }

              if (document.querySelector('.activity')) {
                document.querySelector('.activity').blur()
              }

              if (document.querySelector('.userDetails')) {
                document.querySelector('.userDetails').blur()
              }
              
              setNavActive(navActive = false)
              closeSearch(searchClose = true)
              closeActivity(activityClose = true)
              closeDetails(detailsClose = true)
            }}
          >
            Home
          </Link>
          <Link
            to='/discover'
            onClick={() => {
              setNavActive(navActive = false)
              closeSearch(searchClose = true)
            }}
          >
            <img 
              src="https://img.icons8.com/material-outlined/48/000000/compass.png" 
              alt='' 
            />
          </Link>
          <Activity
            navActive={navActive}
            setNavActive={setNavActive}
            activityClose={activityClose}
            closeActivity={closeActivity}
          />
          <UserDetails
            navActive={navActive}
            setNavActive={setNavActive}
            detailsClose={detailsClose}
            closeDetails={closeDetails}
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