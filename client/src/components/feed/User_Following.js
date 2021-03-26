import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import PhotoPostShow from './types/PhotoPostShow'
import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
const { FETCH_USER_FOLLOWING } = Queries;
const { UNFOLLOW_USER, FOLLOW_USER } = Mutations;

const UserFollowing = () => {
  let [followed, setFollowed] = useState(true)
  let { loading, error, data } = useQuery(FETCH_USER_FOLLOWING, {
    variables: {
      token: Cookies.get('auth-token')
    }
  })

  let [unfollowUser] = useMutation(UNFOLLOW_USER, {
    onCompleted() {
      setFollowed(followed = false)
    }
  })

  let [followUser] = useMutation(FOLLOW_USER, {
    onCompleted() {
      setFollowed(followed = true)
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  const { currentUser } = data;

  return(
    <div>
      {currentUser.userFollowing.map((user, i) => {
        return (
          <div
            key={user._id}
          >
            <p>{user.blogName}</p>
            <form
              onSubmit={e => {
                e.preventDefault();

                if (followed) {
                  unfollowUser({
                    variables: {
                      userId: user._id,
                      token: Cookies.get('auth-token')
                    }
                  })
                } else {
                  followUser({
                    variables: {
                      userId: user._id,
                      token: Cookies.get('auth-token')
                    }
                  })
                }
              }}
            >
              <button type='submit'>{followed ? 'Unfollow' : 'Follow'}</button>
            </form>
          </div>
        )
      })}
    </div>
  )
}

export default UserFollowing;