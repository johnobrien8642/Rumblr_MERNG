import React from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import PhotoPostShow from '../posts/types/PhotoPost/PhotoPostShow';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
const { FETCH_USER_FEED } = Queries;

const Feed = ({ blogName, user }) => {
  let { loading, error, data } = useQuery(FETCH_USER_FEED, {
    variables: {
      blogName: blogName ? blogName : Cookies.get('currentUser')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { fetchUserFeed } = data;

  const header = (user) => {
    if (user) {
      return (
        <div>
          <h1>{user.blogName}</h1>
          <p>{user.blogDescription}</p>
        </div>
      )
    }
  }
  
  return(
    <div>
      {header(user)}
      <div>
        {fetchUserFeed.map((p, i) => {
          switch(p.__typename) {
            case 'PhotoPostType':
              return (
                <div
                  key={i}
                  className='post'
                >
                  <PhotoPostShow post={p} />
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