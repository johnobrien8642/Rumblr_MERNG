import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN, FETCH_ACTIVITY_COUNTS } = Queries;


const Nav = () => {
  let [navActive, setNavActive] = useState(false)
  let [searchClose, closeSearch] = useState(false)
  let [activityClose, closeActivity] = useState(false)
  let [detailsClose, closeDetails] = useState(false)
  let cursorId = useRef(new Date().getTime())

  useEffect(() => {

    return () => {
      refetch()
    }
  })

  var { loading, error, data: data1, refetch } = useQuery(FETCH_ACTIVITY_COUNTS, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: cursorId.current.toString()
    }
  })

  var { data: data2 } = useQuery(IS_LOGGED_IN)

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  if (data2.isLoggedIn) {
    return (
      <div
        className='nav loggedInNav'
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
                src="https://img.icons8.com/fluent-systems-filled/48/ffffff/r.png"
                alt=''  
              />
            </Link>
          </div>
            <Search 
              searchClose={searchClose}
              closeSearch={closeSearch}
            />
        </div>

        <div
          className='navTools'
        >
          <div
            className='homeIcon'
          >
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
              <img
                src="https://img.icons8.com/ios-glyphs/48/ffffff/home-page.png"
                alt=''
              />
            </Link>
          </div>

          <div
            className='discoverIcon'
          >
            <Link
              to='/discover'
              onClick={() => {
                setNavActive(navActive = false)
                closeSearch(searchClose = true)
              }}
            >
              <img 
                src="https://img.icons8.com/ios/40/ffffff/compass--v1.png"
                alt=''
              />
            </Link>
          </div>

          <Activity
            // user={data.user}
            mentionsCount={data1.mentionsCount}
            repostsCount={data1.repostsCount}
            commentsCount={data1.commentsCount}
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
                alt=''
              />
              <svg
                className='whiteRLinesSVG'
                xmlns="http://www.w3.org/2000/svg" version="1.1"
              >
                <line
                  stroke='white'
                  strokeWidth='7'
                  x1='10'
                  x2='10'
                  y1='4'
                  y2='46'
                />
                <line
                  stroke='white'
                  strokeWidth='7'
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
                alt=''
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
            Log in
          </Link>
              
          <Link
            className='register'
            to='/register'
          >
            Sign up
          </Link>
        </div>
      </div>
    )
  }
}

export default Nav;