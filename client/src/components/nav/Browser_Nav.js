import React, { useState } from 'react';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import { Link } from 'react-router-dom';
import NavUtil from './util/nav_util.js';
const { accumulateCounts, renderTotalCount } = NavUtil;

const BrowserNav = ({
  user,
  activityCounts,
  userDetailsCounts,
  loggedInBool,
  totalCountRef,
  cursorId
  // renderTotalCount,
  // accumulateCounts
}) => {
  let [navActive, setNavActive] = useState(false)
  let [searchClose, closeSearch] = useState(false)
  let [activityClose, closeActivity] = useState(false)
  let [detailsClose, closeDetails] = useState(false)
  let [activityOpen, setActivityOpen] = useState(false)
  let [detailsOpen, setDetailsOpen] = useState(false)
  
  if (loggedInBool.isLoggedIn) {
    
    accumulateCounts(activityCounts.fetchActivityCounts, totalCountRef)

    return (
      <div
        className='browserNav loggedIn'
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
                src="https://img.icons8.com/fluent-systems-filled/38/ffffff/r.png"
                alt=''  
              />
            </Link>
          </div>
            <Search
              user={user}
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
                src="https://img.icons8.com/ios-glyphs/38/ffffff/home-page.png"
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
                src="https://img.icons8.com/ios/34/ffffff/compass--v1.png"
                alt=''
              />
            </Link>
          </div>

          <div
            className='activityIcon'
            tabIndex={0}
            onClick={() => {
              totalCountRef.current = 0

              if (activityOpen) {
                cursorId.current = new Date().getTime()
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
              src="https://img.icons8.com/fluent-systems-filled/38/ffffff/lightning-bolt.png"
              alt=''
            />
            {renderTotalCount(totalCountRef)}
          </div>
          
          <Activity
            mentionsCount={activityCounts.mentionsCount}
            repostsCount={activityCounts.repostsCount}
            commentsCount={activityCounts.commentsCount}
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
              src="https://img.icons8.com/material-rounded/38/ffffff/user.png"
              alt=''
            />
          </div>

          <UserDetails
            user={userDetailsCounts.user ? userDetailsCounts.user : null}
            profilePic={userDetailsCounts.user ? userDetailsCounts.user.profilePic : null}
            blogName={userDetailsCounts.user ? userDetailsCounts.user.blogName : null}
            blogDescription={userDetailsCounts.user ? userDetailsCounts.user.blogDescription : null}
            totalLikeCount={userDetailsCounts.user ? userDetailsCounts.user.totalLikeCount : null}
            userFollowCount={userDetailsCounts.user ? userDetailsCounts.user.userFollowCount : null}
            userPostsCount={userDetailsCounts.user ? userDetailsCounts.user.userPostsCount : null}
            followersCount={userDetailsCounts.user ? userDetailsCounts.user.followersCount : null}
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
      </div>
    )
  } else {
    return (
      <div
        className='browserNav loggedOut'
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

export default BrowserNav;