import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import Cookies from 'js-cookie';
import PhotoPostShow from '../feed/types/PhotoPostShow'
const { FETCH_USER_BLOG } = Queries;

const UserBlog = () => {
  let { loading, error, data } = useQuery(FETCH_USER_BLOG, {
    variables: {
      token: Cookies.get('auth-token')
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  const { currentUser } = data;

  return (
    <div>
      {currentUser.posts.map((p, i) => {
          switch(p.__typename) {
            case 'PhotoPostType':
              return (
                <div
                  key={p._id}
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

export default UserBlog;