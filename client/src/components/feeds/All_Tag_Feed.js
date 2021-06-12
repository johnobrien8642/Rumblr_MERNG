import React, { useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import PostShow from '../posts/types/showOrUpdate/PostShow';
import PostShowUtil from '../posts/util/functions/post_show_util.js';
import Queries from '../../graphql/queries.js';
const { FETCH_ALL_TAG_FEED } = Queries;
const { handlePostClassName } = PostShowUtil;

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
  if (error) return `Error: ${error.message}`;
  
  const { fetchAllTagFeed } = data;
  
  if (fetchAllTagFeed) {
    feedArr.current = fetchAllTagFeed
  }

  return(
    <div
      className='userOrTagFeed'
    >
      {feedArr.current.map((post, i) => {
        return (
          <div
            className={handlePostClassName(post)}
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
  )
}

export default AllTagFeed;