import React from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import TextPostShow from '../posts/types/TextPost/TextPostShow';
import PhotoPostShow from '../posts/types/PhotoPost/PhotoPostShow';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;

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

  const header = (user) => {
    if (user) {
      return (
        <div>
          <h1>{user.blogName}</h1>
          <p>{user.blogDescription}</p>
        </div>
      )
    } else if (tagTitle) {
      return (
        <div>
          <h1>{tagTitle}</h1>
        </div>
      )
    }
  }
  
  return(
    <div>
      {header(user)}
      <div>
        {feedVar.map((item, i) => {
          // console.log(feedVar)
          var post = item.__typename === 'RepostType' ? item.post : item
          switch(post.__typename) {
            case 'TextPostType':
              return (
                <div
                  key={i}
                  className='post'
                >
                  <TextPostShow post={item} />
                </div>
              )
            case 'PhotoPostType':
              return (
                <div
                  key={i}
                  className='post'
                >
                  <PhotoPostShow post={item} />
                </div>
              )
            default:
              return (
                <div>
                </div>
              )
          }
        })}
        </div>
    </div>
  )
}

export default withRouter(Feed);