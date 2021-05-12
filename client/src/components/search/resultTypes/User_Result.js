import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import FollowButton from '../../posts/util/components/social/Follow_Button';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';

const { DOES_USER_FOLLOW_USER } = Queries;

const UserResult = ({ user, active, setActive }) => {

  useEffect(() => {
    return () => {
      refetch()
    }
  })

  let { loading, error, data, refetch } = useQuery(DOES_USER_FOLLOW_USER, {
    variables: {
      user: Cookies.get('currentUser'),
      otherUser: user.blogName
    },
    fetchPolicy: 'no-cache'
  })

  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  const { doesUserFollowUser } = data;

  return (
    <React.Fragment>
      <Link 
        to={`/view/blog/${user.blogName}`}
        onClick={() => {
          if (active) {
            setActive(active = false)
          }
        }}
      >
        <h3>{user.blogName}</h3>
        <p>{user.blogDescription}</p>
      </Link>
      <FollowButton 
        user={user} 
        follow={doesUserFollowUser}
      />
    </React.Fragment>
  )
}
  

export default UserResult;