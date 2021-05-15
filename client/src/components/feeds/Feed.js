import React, { useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import FeedUtil from '../posts/util/functions/feed_util.js'
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;
const { infiniteScroll, updateCacheInfScroll, 
        handleData, setgqlQueryAndQuery } = FeedUtil;

const Feed = ({
  user, tag
}) => {
  let feedArr = useRef([])
  let fetchMoreDiv = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFeed');
  let cursorId = useRef(null);
  let query = useRef(Cookies.get('currentUser'))
  let gqlQuery = useRef(FETCH_USER_FEED)
  let endOfPosts = useRef(false)
  const client = useApolloClient();

  setgqlQueryAndQuery(
    tag, user, gqlQuery,
    query, FETCH_TAG_FEED,
    Cookies.get('currentUser')
  )
  
  useEffect(() => {
    
    
    var scroll = infiniteScroll(
      client, updateCacheInfScroll,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )
    
    return () => {
      document.removeEventListener('scroll', scroll)
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data } = useQuery(gqlQuery.current, {
    variables: {
      query: query.current,
      cursorId: null
    },
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)
  
  return(
    <div>
      <div>
        {feedArr.current.map((obj, i) => {
          return (
            <div
              className='post'
              key={obj._id}
            >
              <PostUpdateOrShow
                post={obj}
              />
            </div>
          )
        })}
        </div>
        <div
          id='fetchMoreFeed'
        >
          {endOfPosts.current ? "You're all caught up" : ""}
        </div>
    </div>
  )
}

export default Feed;