import React, { useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import PostShow from '../posts/types/showOrUpdate/PostShow';
import Queries from '../../graphql/queries.js';
const { FETCH_ALL_TAG_FEED } = Queries;

const AllTagFeed = () => {
  let feedArr = useRef([]);

  useEffect(() => {
    
    return () => {
      refetch()
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data, refetch } = useQuery(FETCH_ALL_TAG_FEED, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  const { fetchAllTagFeed } = data;
  
  if (fetchAllTagFeed) {
    feedArr.current = fetchAllTagFeed
  }

  return(
    <div>
      <div>
        {feedArr.current.map((post, i) => {
          return (
            <div
              key={post._id}
            >
              <PostShow
                post={post}
                discover={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllTagFeed;