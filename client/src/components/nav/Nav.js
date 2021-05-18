import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import BrowserNav from './Browser_Nav';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN, 
        FETCH_ACTIVITY_COUNTS, 
        FETCH_USER_DETAILS_COUNTS } = Queries;


const Nav = () => {
  let [navActive, setNavActive] = useState(false)
  let [searchClose, closeSearch] = useState(false)
  let [activityClose, closeActivity] = useState(false)
  let [detailsClose, closeDetails] = useState(false)
  let [activityOpen, setActivityOpen] = useState(false)
  let [detailsOpen, setDetailsOpen] = useState(false)
  let totalCountRef = useRef(0);
  let cursorId = useRef(new Date().getTime())

  useEffect(() => {

    return () => {
      refetch1()
      refetch2()
    }

    //eslint-disable-next-line
  }, [navActive])

  var { loading: loading1, 
        error: error1, 
        data: data1, 
        refetch: refetch1 } = useQuery(FETCH_ACTIVITY_COUNTS, {
        variables: {
          query: Cookies.get('currentUser'),
          cursorId: cursorId.current.toString()
        },
        fetchPolicy: 'cache-and-network'
      })

  var { loading: loading2, 
        error: error2, 
        data: data2, 
        refetch: refetch2 } = useQuery(FETCH_USER_DETAILS_COUNTS, {
          variables: {
            query: Cookies.get('currentUser')
          },
          fetchPolicy: 'cache-and-network'
      }) 

  var { data: data3 } = useQuery(IS_LOGGED_IN)
  
  if (loading1 || loading2) return 'Loading...';

  if (error1) {
    return `Error: ${error1}`
  } else if (error2) {
    return `Error: ${error2}`
  }

  const accumulateCounts = (
    data1,
    totalCountRef
  ) => {
    totalCountRef.current = 
    totalCountRef.current + 
    data1.mentionsCount + 
    data1.repostsCount + 
    data1.commentsCount
  }

  const renderTotalCount = (totalCountRef) => {
    if (totalCountRef.current > 0 && totalCountRef.current <= 99) {
      return (
        <div
          className='countAlertWrapperDiv'
        >
          <div>
            <span
              className={
                totalCountRef.current < 10 ? 
                'oneThroughTen' : 
                'elevenThroughNinetyNine'
              }
            >
              {totalCountRef.current}
            </span>
          </div>
        </div>
      )
    } else if (totalCountRef.current > 99) {
      return (
        <div
          className='countAlertWrapperDiv'
        >
          <div>
            <span
              className={'greaterThanNinetyNine'}
            >
              99+
            </span>
          </div>
        </div>
      )
    }
  }
  
  if (data3.isLoggedIn) {

    accumulateCounts(data1, totalCountRef)

    return (
      <React.Fragment>
        <BrowserNav 
          data1={data1}
          data2={data2}
          totalCountRef={totalCountRef}
          renderTotalCount={renderTotalCount}
        />
      {/* <div
        className='browserNav loggedInNav'
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
              detailsOpen={detailsOpen}
              setDetailsOpen={setDetailsOpen}
              activityOpen={activityOpen}
              setActivityOpen={setActivityOpen}
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
                setActivityOpen(activityOpen = false)
                setDetailsOpen(detailsOpen = false)
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
                setActivityOpen(activityOpen = false)
                setDetailsOpen(detailsOpen = false)
              }}
            >
              <img 
                src="https://img.icons8.com/ios/40/ffffff/compass--v1.png"
                alt=''
              />
            </Link>
          </div>

        <div
          className='activityIcon'
          onClick={() => {
            totalCountRef.current = 0

            if (activityOpen) {
              setActivityOpen(activityOpen = false)
            } else {
              setActivityOpen(activityOpen = true)
            }

            if (detailsOpen) {
              setDetailsOpen(detailsOpen = false)
            }
          }}
        >
          <img 
            src="https://img.icons8.com/fluent-systems-filled/48/ffffff/lightning-bolt.png"
            alt=''
          />
          {renderTotalCount(totalCountRef)}
        </div>

          <Activity
            mentionsCount={data1.mentionsCount}
            repostsCount={data1.repostsCount}
            commentsCount={data1.commentsCount}
            navActive={navActive}
            setNavActive={setNavActive}
            activityClose={activityClose}
            closeActivity={closeActivity}
            detailsClose={detailsClose}
            closeDetails={closeDetails}
            detailsOpen={detailsOpen}
            setDetailsOpen={setDetailsOpen}
            activityOpen={activityOpen}
            setActivityOpen={setActivityOpen}
          />

        <div
          className='userIcon'
          tabIndex={0}
          onClick={() => {
            if (detailsOpen) {
              setDetailsOpen(detailsOpen = false)
            } else {
              setDetailsOpen(detailsOpen = true)
            }

            if (activityOpen) {
              setActivityOpen(activityOpen = false)
            }
          }}
        >
          <img
            src="https://img.icons8.com/material-rounded/48/ffffff/user.png"
            alt=''
          />
        </div>

          <UserDetails
            blogName={data2.user ? data2.user.blogName : null}
            blogDescription={data2.user ? data2.user.blogDescription : null}
            totalLikeCount={data2.user ? data2.user.totalLikeCount : null}
            userFollowCount={data2.user ? data2.user.userFollowCount : null}
            userPostsCount={data2.user ? data2.user.userPostsCount : null}
            followersCount={data2.user ? data2.user.followersCount : null}
            navActive={navActive}
            setNavActive={setNavActive}
            detailsClose={detailsClose}
            closeDetails={closeDetails}
            activityClose={activityClose}
            closeActivity={closeActivity}
            detailsOpen={detailsOpen}
            setDetailsOpen={setDetailsOpen}
            activityOpen={activityOpen}
            setActivityOpen={setActivityOpen}
          />
        </div>
      </div> */}
      </React.Fragment>
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
            <img
              src="https://img.icons8.com/fluent-systems-filled/48/ffffff/r.png"
              alt=''  
            />
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
            onClick={e => {
              e.stopPropagation()
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    )
  }
}

export default Nav;