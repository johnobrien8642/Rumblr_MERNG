import React from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import PostShow from '../posts/types/show/PostShow.js'
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import FeedUtil from '../posts/util/functions/feed_util.js'
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;
const { header } = FeedUtil;

const Feed = ({ blogName, tagTitle, user }) => {
  let query;

  if (blogName) {
    query = FETCH_USER_FEED;
  } else if (tagTitle) {
    query = FETCH_TAG_FEED;
  } else {
    query = FETCH_USER_FEED;
  }
  
  let { loading, error, data } = useQuery(query, {
    variables: {
      query: blogName ? blogName : tagTitle ? tagTitle : Cookies.get('currentUser')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchTagFeed, fetchUserFeed } = data
  
  var feedVar;
  fetchTagFeed ? feedVar = fetchTagFeed : feedVar = fetchUserFeed;
  
  return(
    <div>
      {header(user, tagTitle)}
      <div>
        {feedVar.map((item, i) => {
          var post = item.__typename === 'RepostType' ? item.post : item
          return (
            <div
              className='post'
              key={i}
            >
              <PostShow post={post} idx={i} />
            </div>
          )
        })}
        </div>
    </div>
  )
}

export default withRouter(Feed);