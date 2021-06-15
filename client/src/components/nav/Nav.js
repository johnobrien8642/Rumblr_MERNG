import React, { useRef, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import BrowserNav from './Browser_Nav';
import MobileNav from './Mobile_Nav';
import Queries from '../../graphql/queries';
import NavUtil from '../nav/util/nav_util.js';
const { IS_LOGGED_IN, 
        FETCH_ACTIVITY_COUNTS, 
        FETCH_USER_DETAILS_COUNTS,
        FETCH_USER } = Queries;
const { accumulateCounts } = NavUtil;


const Nav = () => {
  let cursorId = useRef(new Date().getTime())
  let totalCountRef = useRef(0)
  
  useEffect(() => {

    return () => {
      refetch1()
      refetch2()
    }
    //eslint-disable-next-line
  }, [])
  
  var { loading: loading1, 
        error: error1, 
        data: activityCounts, 
        refetch: refetch1 } = useQuery(FETCH_ACTIVITY_COUNTS, {
        variables: {
          query: Cookies.get('currentUser'),
          cursorId: cursorId.current.toString()
        },
        // pollInterval: 500,
        fetchPolicy: 'network-only',
      })

  var { loading: loading2, 
        error: error2, 
        data: userDetailsCounts, 
        refetch: refetch2 } = useQuery(FETCH_USER_DETAILS_COUNTS, {
          variables: {
            query: Cookies.get('currentUser')
          },
          fetchPolicy: 'network-only'
      })

  var { loading: loading3, 
        error: error3, 
        data: fetchedUser } = useQuery(FETCH_USER, {
          variables: {
            query: Cookies.get('currentUser')
          },
      })
      
      var { data: loggedInBool } = useQuery(IS_LOGGED_IN)

      if (loading1 || loading2 || loading3) return 'Loading...';
      
      if (error1) {
        return `Error: ${error1}`
      } else if (error2) {
        return `Error: ${error2}`
      } else if (error3) {
        return `Error ${error3}`
      }
  
  // const { commentsCount,
  //         likesCount,
  //         mentionsCount,
  //         repostsCount } = activityCounts.fetchActivityCounts

  return (
    <React.Fragment>
      <BrowserNav
        user={fetchedUser.user}
        // activityCounts={activityCounts}
        // commentsCount={commentsCount}
        // likesCount={likesCount}
        // mentionsCount={mentionsCount}
        // repostsCount={repostsCount}
        // totalCountRefNum={totalCountRef.current}
        // totalCountRef={totalCountRef}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
      <MobileNav
        user={fetchedUser.user}
        activityCounts={activityCounts}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
    </React.Fragment>
  )
}

export default Nav;