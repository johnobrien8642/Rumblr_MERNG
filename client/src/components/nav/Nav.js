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
      <div
        className='nav loggedOutNav'
      >
        <div
          className='searchAndLogo'
        >
          <div
            className='logo'
          >
            <Link
              to='/dashboard'
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <img
                className='filledR' 
                src="https://img.icons8.com/ios-filled/50/000000/r.png"
              />
              <svg
                className='whiteRLinesSVG'
                xmlns="http://www.w3.org/2000/svg" version="1.1"
              >
                <line
                  stroke='white'
                  stroke-width='7'
                  x1='10'
                  x2='10'
                  y1='4'
                  y2='46'
                />
                <line
                  stroke='white'
                  stroke-width='7'
                  x1='25'
                  x2='35.5'
                  y1='25'
                  y2='44'
                />
                <circle
                  fill='white'
                  cx='36'
                  cy='43'
                  r='3'
                />
                <path
                  stroke='white'
                  strokeWidth='5.5'
                  fill='transparent'
                  d='M 10 7 C 15 7 39 2 36 20 C 32 29 15 29 10 25'
                />
              </svg>
              <img
                className='emptyR'
                src="https://img.icons8.com/ios/50/000000/r.png"
              />
            </Link>
          </div>
          <Search />
        </div>

        <div
          className='auth'
        >
          <Link
            className='login'
            to='/login'
          >
            Login
          </Link>
          <Link
            className='register'
            to='/register'
          >
            Register
          </Link>
        </div>
      </div>
    )
  }
}

export default Nav;