import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import FollowButton from '../../posts/util/components/social/Follow_Button';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';

const { DOES_USER_FOLLOW_USER } = Queries;

const UserResult = ({ user, activate }) => {
  let { loading, error, data, refetch } = useQuery(DOES_USER_FOLLOW_USER, {
    variables: {
      user: Cookies.get('currentUser'),
      otherUser: user.blogName
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch])
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  const { doesUserFollowUser } = data;

  return (
    <React.Fragment>
      <Link 
        to={`/view/blog/${user.blogName}`}
        onClick={activate}
      >
        {user.blogName}
      </Link>
      <FollowButton 
        user={user} 
        follow={doesUserFollowUser}
      />
    </React.Fragment>
  )
}
  

export default UserResult;