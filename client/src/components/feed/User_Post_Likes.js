import React, { useEffect } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import PhotoPostShow from './types/PhotoPostShow'
import Queries from '../../graphql/queries';
const { FETCH_USER_LIKED_POSTS } = Queries;

const UserPostLikes = () => {
  let { loading, error, data, refetch, networkStatus } = useQuery(FETCH_USER_LIKED_POSTS, {
    variables: {
      blogName: Cookies.get('currentUser')
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data;
  
  var allPosts = [];
  user.likes.forEach((like, i) => {
    allPosts = [...allPosts, like.post]
  })

  return(
    <div>
      {allPosts.map((post, i) => {
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

export default UserPostLikes;