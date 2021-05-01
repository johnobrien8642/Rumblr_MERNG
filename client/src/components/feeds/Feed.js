import React, { useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow.js'
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import InfiniteScroll from './util/Infinite_Scroll.js';
import FeedUtil from '../posts/util/functions/feed_util.js'
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;
const { updateCacheInfScroll, handleData } = FeedUtil;

const Feed = ({
  user, tag
}) => {
  let feedArr = useRef([])
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let query = useRef(Cookies.get('currentUser'))
  let gqlQuery = useRef(FETCH_USER_FEED)
  let endOfPosts = useRef(false)
  const client = useApolloClient();

  useEffect(() => {
    
    var scroll = document.addEventListener('scroll', function(event) {
      fetchMoreDiv.current = document.querySelector('#fetchMore')
  
      if (fetchMoreDiv.current) {
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
      }
    })

    return () => {
      document.removeEventListener('scroll', scroll)
    }
    //eslint-disable-next-line
  }, [])

  if (tag) {
    query.current = tag.title.slice(1)
    gqlQuery.current = FETCH_TAG_FEED
  } else if (user) {
    query.current = user.blogName
  }

  
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
          {endOfPosts.current ? "You're all caught up" : ""}
        </div>
    </div>
  )
}

export default Feed;