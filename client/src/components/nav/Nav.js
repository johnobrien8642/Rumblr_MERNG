import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import BrowserNav from './Browser_Nav';
import MobileNav from './Mobile_Nav';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN, 
        FETCH_ACTIVITY_COUNTS, 
        FETCH_USER_DETAILS_COUNTS } = Queries;


const Nav = () => {
  let [navActive, setNavActive] = useState(false)
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
        data: activityCounts, 
        refetch: refetch1 } = useQuery(FETCH_ACTIVITY_COUNTS, {
        variables: {
          query: Cookies.get('currentUser'),
          cursorId: cursorId.current.toString()
        },
        fetchPolicy: 'cache-and-network'
      })

  var { loading: loading2, 
        error: error2, 
        data: userDetailsCounts, 
        refetch: refetch2 } = useQuery(FETCH_USER_DETAILS_COUNTS, {
          variables: {
            query: Cookies.get('currentUser')
          },
          fetchPolicy: 'cache-and-network'
      }) 

  var { data: loggedInBool } = useQuery(IS_LOGGED_IN)
  
  if (loading1 || loading2) return 'Loading...';

  if (error1) {
    return `Error: ${error1}`
  } else if (error2) {
    return `Error: ${error2}`
  }
  
  return (
    <React.Fragment>
      <BrowserNav 
        activityCounts={activityCounts}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        totalCountRef={totalCountRef}
        cursorId={cursorId}
      />
      <MobileNav
        activityCounts={activityCounts}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        totalCountRef={totalCountRef}
        cursorId={cursorId}
      />
    </React.Fragment>
  )
}

export default Nav;