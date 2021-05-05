import React, { useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery, useApolloClient } from '@apollo/client';
import Queries from '../../graphql/queries.js';
import FeedUtil from '../posts/util/functions/feed_util.js';
import ActivityUtil from '../nav/util/activity_util.js';
const { FETCH_ALL_ACTIVITY } = Queries;
const { handleActivity } = ActivityUtil;
const { infiniteScroll, 
        updateCacheInfScrollActivity, 
        handleData } = FeedUtil;

const Content = ({
  tab, active, setActive, activityCursorId, navActive, setNavActive
}) => {
  let feedArr = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreActivity');
  let gqlQuery = useRef(FETCH_ALL_ACTIVITY)
  let query = useRef(Cookies.get('currentUser'));
  let endOfPosts = useRef(false);
  const client = useApolloClient();

  useEffect(() => {
    document.querySelector('.activity').focus()
    
    var scroll = infiniteScroll(
      client, updateCacheInfScrollActivity,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )

    return () => {
      document.removeEventListener('scroll', scroll)
      refetch()
    }
    //eslint-disable-next-line
  }, [active])
  
  let { loading, error, data, refetch } = useQuery(gqlQuery.current, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: null
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)

  return(
    <div>
      <div>
        {feedArr.current.map((activity, i) => {
          return (
            <div
              className='activity'
              key={activity._id}
              onClick={() => {
                setNavActive(navActive = false)
              }}
            >
              {handleActivity(activity, navActive, setNavActive, tab)}
            </div>
          )
        })}
        </div>
        <div
          id='fetchMoreActivity'
        >
        </div>
    </div>
  )
}

export default Content;