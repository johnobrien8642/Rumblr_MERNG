import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow.js'
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import FeedUtil from '../posts/util/functions/feed_util.js'
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;
const { header } = FeedUtil;

const Feed = ({ 
  tag, user 
}) => {
  let [update, setUpdate] = useState(false)

  const toggleUpdate = () => {
    if (update) {
      setUpdate(update = false)
    } else { 
      setUpdate(update = true)
    }
  }

  let query;
  if (user) {
    query = FETCH_USER_FEED;
  } else if (tag) {
    query = FETCH_TAG_FEED;
  } else {
    query = FETCH_USER_FEED;
  }

  let { loading, error, data } = useQuery(query, {
    variables: {
      query: user ? user.blogName : tag ? tag.title.slice(1) : Cookies.get('currentUser')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchTagFeed, fetchUserFeed } = data
  
  var feedVar;
  fetchTagFeed ? feedVar = fetchTagFeed : feedVar = fetchUserFeed;
  
  return(
    <div>
      {header(user, tag)}
      <div>
        {feedVar.map((post, i) => {
          return (
            <div
              className='post'
              key={post._id}
            >
              <PostUpdateOrShow
                post={post}
                update={update}
                setUpdate={setUpdate}
                toggleUpdate={toggleUpdate}
              />
            </div>
          )
        })}
        </div>
    </div>
  )
}

export default Feed;