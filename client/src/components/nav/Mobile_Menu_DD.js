import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import Logout from '../auth/Logout';
import Queries from '../../graphql/queries.js';
const { FETCH_ACTIVITY_COUNTS } = Queries;

const MobileMenuDD = ({
  menuOpen,
  openMenu,
  settingsOpen,
  openSettings,
  activityCounts,
  userDetailsCounts,
  loggedInBool,
  totalCount,
  // cursorId,
  scrollYRef2
}) => {
  let cursorId = useRef(new Date().getTime())

  useEffect(() => {
    if (!menuOpen || menuOpen) {
      window.scrollTo(0, scrollYRef2.current)
    }

    return () => {
      refetch()
    }
  }, [menuOpen, settingsOpen, scrollYRef2])

  let { data, refetch } = useQuery(FETCH_ACTIVITY_COUNTS, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: cursorId.current.toString()
    },
    pollInterval: 10000
  })

  const { user } = userDetailsCounts;

  const renderActivityCount = () => {
    if (data) {
      if (data.fetchActivityCount) {
        return <span className='count'>{data.fetchActivityCount}</span>
      } else {
        return <span className='count'></span>
      }
    }
  }

  if (user) {
    return (
      <React.Fragment> 
        <div
          className={menuOpen && !settingsOpen ? 'mobileMenuDD open' : 'mobileMenuDD'}
        >
          <Link
            to='/dashboard/create'
            className='mobileMenuItem createAPost'
            onClick={() => {
              openMenu(menuOpen = false)
            }}
          >
            <div>
            <img
              src="https://img.icons8.com/metro/26/ffffff/edit.png"
              alt=''
              />
            <span>Create a post</span>
            </div>
          </Link>
    
  
          <div
            className='mobileMenuItem'
          >
            <Link
              className='dashboard'
              to='/dashboard'
                onClick={() => {      
                  openMenu(menuOpen = false)
                }}
            >
              <img
                src="https://img.icons8.com/ios-glyphs/38/ffffff/home-page.png"
                alt=''
              />
              <span>Dashboard</span>
            </Link>
          </div>
  
          <div
            className='mobileMenuItem'
          >
            <Link
              className='discover'
              to='/discover'
              onClick={() => {
                openMenu(menuOpen = false)
              }}
            >
              <img
                src="https://img.icons8.com/ios/34/ffffff/compass--v1.png"
                alt=''
              />
              <span>Discover</span>
            </Link>
          </div>
  
          <div
            className='mobileMenuItem'
            onClick={() => {
              // totalCountRef.current = 0
              cursorId.current = new Date().getTime()
            }}
          >
            <Link
              className='activity'
              to={`/activity`}
            >
              <img
                src="https://img.icons8.com/fluent-systems-filled/38/ffffff/lightning-bolt.png"
                alt=''
              />
              <span>Activity</span>
            </Link>
  
            {/* <span className='count'>{data ? data.fetchActivityCount : 0}</span> */}
            {renderActivityCount()}
          </div>
  
          <div
            className='mobileMenuItem'
          >
            <Link
              className='likes'
              to='/likes'
              onClick={() => {
                // setNavActive(navActive = false)
              }}
            >
              <img 
                src="https://img.icons8.com/material-sharp/24/ffffff/like--v1.png"
                alt=''
              />
                <span>Likes</span>
            </Link>
            <span className='count'>{user.totalLikeCount}</span>
          </div>
  
          <div
            className='mobileMenuItem'
          >
            <Link 
              className='following'
              to='/following'
              onClick={() => {
                // setNavActive(navActive = false)
              }}
            >
              <img
                src="https://img.icons8.com/metro/26/ffffff/gender-neutral-user.png"
                alt=''
              />
                <span>Following</span>
            </Link>
            <span className='count'>{user.userFollowCount}</span>
          </div>
  
          <div
            className='mobileMenuItem'
            onClick={() => {
              openSettings(settingsOpen = true)
            }}
          >
            <Link
              className='settings'
              to='/settings/account'
            >
              <img
                src="https://img.icons8.com/material-sharp/24/ffffff/settings.png"
                alt=''
              />
              <span>Settings</span>
            </Link>
          </div>
  
          <div
            className='mobileMenuItem blogDetailHeader'
          >
            <Link
              to={`/view/blog/${user.blogName}`} 
              onClick={() => {
                // setNavActive(navActive = false)
              }}
            >
              <h3>{user.blogName}</h3>
              <p>{user.blogDescription}</p>
            </Link>
          </div>
  
          <div
            className='mobileMenuItem blogDetailData'
          >
            <Link
              to={`/view/blog/${user.blogName}`}
              onClick={() => {
                // setNavActive(navActive = false)
              }}
            >
              <p>Posts</p>
            </Link>
            <span className='count'>{user.userPostsCount}</span>
          </div>
  
          <div
            className='mobileMenuItem blogDetailData'
          >
            <Link
              to={`/followers`}
              onClick={() => {
                // setNavActive(navActive = false)
              }}
            >
              <p>Followers</p>
            </Link>
            <span className='followerCount'>{user.followersCount}</span>
          </div>
          <Logout />
        </div>
        <div
          className={menuOpen ? 'mobileMenuDDModal open' : 'mobileMenuDDModal'}
          onClick={() => {
            var body = document.body
            body.style.position = ''
            openMenu(menuOpen = false)
          }}
        />
      </React.Fragment>
    )
  } else {
    return (
      <div>
      </div>
    )

  }
}

export default MobileMenuDD;