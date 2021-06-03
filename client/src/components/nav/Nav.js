import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import BrowserNav from './Browser_Nav';
import MobileNav from './Mobile_Nav';
import Queries from '../../graphql/queries';
const { IS_LOGGED_IN, 
        FETCH_ACTIVITY_COUNTS, 
        FETCH_USER_DETAILS_COUNTS,
        FETCH_USER } = Queries;


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
        fetchPolicy: 'network-only'
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
          }
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
  
  return (
    <React.Fragment>
      <BrowserNav
        user={fetchedUser.user}
        activityCounts={activityCounts}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        totalCountRef={totalCountRef}
        cursorId={cursorId}
      />
      <MobileNav
        user={fetchedUser.user}
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