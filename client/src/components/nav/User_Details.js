import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../auth/Logout.js';

const UserDetails = ({
  navActive, 
  setNavActive, 
  detailsClose,
  blogName,
  blogDescription,
  totalLikeCount,
  userFollowCount,
  userPostsCount,
  followersCount,
  detailsOpen,
  setDetailsOpen
}) => {
  let [active, setActive] = useState(false)
  let listenerRef = useRef(null)

  useEffect(() => {
    var el = document.querySelector('.userDetails')

    if (el) {
      el.focus()
    }
    
    //eslint-disable-next-line
  }, [detailsClose, detailsOpen, active])

  if (detailsOpen) {
    return (
      <div
        className='userDetails'
        tabIndex={0}
        onBlur={e => {
          if (!e.relatedTarget) {
            setDetailsOpen(detailsOpen = false)
          }
        }}
      >
        <div
          className='userHeader'
        >
          <span>Account</span>

          <Logout
            listener={listenerRef.current}
            active={active}
            setActive={setActive}
          />
        </div>
      
        <ul>
          <li>
            <Link 
              to='/likes'
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <img
                className='detailIcon'
                src="https://img.icons8.com/material-rounded/24/000000/like--v1.png" 
                alt='' 
              />
              Likes
            </Link>
            <span>{totalLikeCount}</span>
          </li>
          <li>
            <Link 
              to='/following'
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <img 
                className='detailIcon'
                src="https://img.icons8.com/metro/26/000000/add-user-male.png"
                alt=''
              />
              Following
            </Link>
            <span>{userFollowCount}</span>
          </li>
          <li>
            <Link 
              to='/settings/account'
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <img
                className='detailIcon'
                src="https://img.icons8.com/material-sharp/24/000000/settings.png"
                alt=''
              />
              Settings
            </Link>
          </li>
            <li
              className='separator'
            >
            </li>
          <li
            className='blogDescription'
          >
            <Link 
              to={`/view/blog/${blogName}`} 
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <h3>{blogName}</h3>
              <p>{blogDescription}</p>
            </Link>
          </li>
          <li>
            <Link
              className='blogDetailData'
              to={`/view/blog/${blogName}`}
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <p>Posts</p>
            </Link>
              <span>{userPostsCount}</span>
          </li>
          <li>
            <Link
              className='blogDetailData'
              to={`/blog/${blogName}/followers`}
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              <p>Followers</p>
            </Link>
              <span>{followersCount}</span>
          </li>
        </ul>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default UserDetails;