import React from 'react';
import { useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import Queries from '../../graphql/queries';
import PhotoPostShow from '../feed/types/PhotoPostShow';
import Cookies from 'js-cookie';
const { FETCH_FEED } = Queries;

const Feed = ({ blogName }) => {
  let { loading, error, data } = useQuery(FETCH_FEED, {
    variables: {
      blogName: blogName ? blogName : Cookies.get('currentUser')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { fetchUserFeed } = data;
  
  return(
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
  )
}

export default withRouter(Feed);