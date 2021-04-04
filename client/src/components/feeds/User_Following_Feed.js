import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import UserResult from '../search/resultTypes/User_Result'
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
const { FETCH_FOLLOWED_USERS } = Queries;

const UserFollowingFeed = () => {
  let { loading, error, data, refetch } = useQuery(FETCH_FOLLOWED_USERS, {
    variables: {
      user: Cookies.get('currentUser')
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`
  
  const { fetchFollowedUsers } = data;

  return(
    <div>
      {fetchFollowedUsers.map((follow, i) => {
        return (
          <div
            key={i}
          >
            <UserResult user={follow.follows} />
          </div>
        )
      })}
    </div>
  )
}

export default UserFollowingFeed;