import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import FollowButton from '../../posts/util/Follow_Button';
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';

const { DOES_USER_FOLLOW_USER } = Queries;

const UserResult = ({ user, setActive, active }) => {
  let { loading, error, data } = useQuery(DOES_USER_FOLLOW_USER, {
    variables: {
      userId: user._id,
      currentUser: Cookies.get('currentUser')
    },
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  const { doesUserFollowUser } = data;
  
  return (
    <React.Fragment>
      <Link 
        to={`/view/blog/${user.blogName}`}
      >
        {user.blogName}
      </Link>
      <FollowButton 
        user={user} 
        followed={doesUserFollowUser} 
        setActive={setActive} 
        active={active}
      />
    </React.Fragment>
  )
}
  

export default UserResult;