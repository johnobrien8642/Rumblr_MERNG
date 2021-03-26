import React from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import PhotoPostShow from './types/PhotoPostShow'
import Queries from '../../graphql/queries';
const { FETCH_USER_LIKED_POSTS } = Queries;

const UserPostLikes = () => {
  let { loading, error, data } = useQuery(FETCH_USER_LIKED_POSTS, {
    variables: {
      token: Cookies.get('auth-token')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  const { currentUser } = data;

  return(
    <div>
      {currentUser.likedPosts.map((post, i) => {
        switch(post.__typename) {
          case 'PhotoPostType':
            return (
              <div
                key={post._id}
                className='post'
              >
                <PhotoPostShow post={post} />
              </div>
            )
        }
      })}
    </div>
  )
}

export default UserPostLikes;