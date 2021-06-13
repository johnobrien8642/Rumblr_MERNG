import React, { useEffect } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import PostShow from '../posts/types/showOrUpdate/PostShow'
import Feed from '../feeds/Feed';
import Queries from '../../graphql/queries';
const { FETCH_USER_LIKES } = Queries;

const UserPostLikesFeed = () => {
  let { loading, error, 
        data, refetch, 
        networkStatus } = useQuery(FETCH_USER_LIKES, {
          variables: {
            user: Cookies.get('currentUser')
          }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  const { fetchUserLikes } = data;
  
  return(
    <div
      className='userPostLikesContainer'
    >
      <Feed userLikes={true} />
    </div>
  )
}

export default UserPostLikesFeed;