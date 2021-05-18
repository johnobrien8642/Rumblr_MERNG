import React, { useState } from 'react';
import Search from '../search/Search';
import UserDetails from './User_Details';
import Activity from './Activity';
import { Link } from 'react-router-dom';

const BrowserNav = ({
  data1, 
  data2,
  totalCountRef,
  renderTotalCount
}) => {
  let [navActive, setNavActive] = useState(false)
  let [searchClose, closeSearch] = useState(false)
  let [activityClose, closeActivity] = useState(false)
  let [detailsClose, closeDetails] = useState(false)
  let [activityOpen, setActivityOpen] = useState(false)
  let [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div
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
      </div>
  )
}

export default BrowserNav;