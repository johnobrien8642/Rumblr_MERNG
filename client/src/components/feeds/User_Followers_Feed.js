import React, { useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery, useApolloClient } from '@apollo/client';
import UserResult from '../search/resultTypes/User_Result';
import Queries from '../../graphql/queries.js';
import FeedUtil from '../posts/util/functions/feed_util.js';
const { FETCH_USER_FOLLOWERS } = Queries;
const { infiniteScroll, 
        updateCacheInfScrollUserFollowers, 
        handleData } = FeedUtil;

const UserFollowersFeed = () => {
  let feedArr = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFollowers');
  let gqlQuery = useRef(FETCH_USER_FOLLOWERS)
  let query = useRef(Cookies.get('currentUser'));
  let endOfPosts = useRef(false);
  const client = useApolloClient();

  useEffect(() => {
  
    var scroll = infiniteScroll(
      client, updateCacheInfScrollUserFollowers,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )

    return () => {
      document.removeEventListener('scroll', scroll)
      refetch()
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data, refetch } = useQuery(gqlQuery.current, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: null
    },
    // fetchPolicy: 'no-cache'
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)

  return(
    <div>
      <div>
        {feedArr.current.map((follower, i) => {
          return (
            <div
              key={follower.user._id}
              className='followerResult'
            >
              <UserResult
                user={follower.user}
              />
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

export default UserFollowersFeed;