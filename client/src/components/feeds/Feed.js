import React, { useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow.js'
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import InfiniteScroll from './util/Infinite_Scroll.js';
import FeedUtil from '../posts/util/functions/feed_util.js'
const { FETCH_USER_FEED, FETCH_TAG_FEED, FETCH_USER_BLOG } = Queries;
const { updateCacheInfScroll, handleData, setQuery } = FeedUtil;

const Feed = ({
  user, tag, currentUser
}) => {
  const history = useHistory();
  let feedArr = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let query = useRef(user ? user.blogName : tag ? tag.title.slice(1) : Cookies.get('currentUser'));
  let gqlQuery = useRef(user ? FETCH_USER_BLOG : tag ? FETCH_TAG_FEED : FETCH_USER_FEED);
  let endOfPosts = useRef(false);
  const client = useApolloClient();

  useEffect(() => {
    setQuery(
      currentUser, user, tag, 
      query, gqlQuery, Queries
    )
    return () => {
      document.removeEventListener('scroll', scroll)
    }
  })
  
  let { loading, error, data } = useQuery(gqlQuery.current, {
    variables: {
      query: query.current,
      cursorId: null
    },
  })
  
  var scroll = document.addEventListener('scroll', function(event) {
    fetchMoreDiv.current = document.querySelector('#fetchMore')
    var el = fetchMoreDiv.current.getBoundingClientRect()
    var elTop = el.top
    var elBottom = el.bottom
    var innerHeight = window.innerHeight
    
    if (elTop >= 0 && elBottom <= innerHeight) {
      client.query({
        query: gqlQuery.current,
        variables: {
          query: query.current,
          cursorId: cursorId.current
        },
        fetchPolicy: 'no-cache'
      }).then(res => {
        if (res.loading) return 'Loading...';
        
        updateCacheInfScroll(
          res, client, query.current,
          gqlQuery.current, cursorId
        )

      })
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  handleData(data, feedArr, cursorId, endOfPosts)

  return(
    <div>
      <div>
        {feedArr.current.map((post, i) => {
          return (
            <div
              className='post'
              key={post._id}
            >
              <PostUpdateOrShow
                post={post}
              />
            </div>
          )
        })}
        </div>
        <InfiniteScroll 
          fetchMoreDiv={fetchMoreDiv}
        />
        <div
          id='fetchMore'
        >
        </div>
    </div>
  )
}

export default Feed;