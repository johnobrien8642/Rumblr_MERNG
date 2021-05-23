import React, { useState, useRef, useEffect } from 'react';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import MobileMenuDD from './Mobile_Menu_DD';
import { Link } from 'react-router-dom';
import MobileSearchOrLogo from './Mobile_Search_Or_Logo';
import RenderSearchOrExitIcon from './Render_Search_Or_Exit_Icon';
import NavUtil from './util/nav_util.js';
import HamburgerOrExitIcon from './Hamburger_Or_Exit_Icon';
const { accumulateCounts } = NavUtil;

const MobileNav = ({
  activityCounts, 
  userDetailsCounts,
  loggedInBool,
  totalCountRef,
  cursorId
}) => {
  let [menuOpen, openMenu] = useState(false)
  let [settingsOpen, openSettings] = useState(false)
  let [searchOpen, openSearch] = useState(false)
  let scrollYRef = useRef(null)
  let scrollYRef2 = useRef(null)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.position = 'fixed'
      var el = document.querySelector('.mobileNav')
      
      if (el) {
        el.focus()
      }
    }

    var listener = window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY
    })

    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [menuOpen])

  
  if (loggedInBool.isLoggedIn) {
    
    accumulateCounts(activityCounts.fetchActivityCounts, totalCountRef)

    return (
      <div
        className='mobileNav loggedIn'
        tabIndex={-1}
        onBlur={() => {
          var body = document.body
          body.style.position = ''
          openMenu(menuOpen = false)
        }}
      >
        <div
          className='hamburgerOrExit'
        >
          <HamburgerOrExitIcon
            menuOpen={menuOpen}
            openMenu={openMenu}
            settingsOpen={settingsOpen}
            openSettings={openSettings}
            scrollYRef={scrollYRef}
            scrollYRef2={scrollYRef2}
          />
        </div>

        <MobileMenuDD
          activityCounts={activityCounts}
          userDetailsCounts={userDetailsCounts}
          loggedInBool={loggedInBool}
          menuOpen={menuOpen}
          openMenu={openMenu}
          settingsOpen={settingsOpen}
          openSettings={openSettings}
          totalCountRef={totalCountRef}
          cursorId={cursorId}
          scrollYRef={scrollYRef}
          scrollYRef2={scrollYRef2}
        />

        <MobileSearchOrLogo 
          searchOpen={searchOpen}
          openSearch={openSearch}
        />

        <div
          className='searchOrExitIcon'
        >
          <RenderSearchOrExitIcon
            searchOpen={searchOpen}
            openSearch={openSearch}
          />
        </div>
        {/* <div
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
            src="https://img.icons8.com/material-rounded/48/ffffff/user.png"
            alt=''
          />
        </div>

          <UserDetails
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
        </div> */}
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

export default MobileNav;