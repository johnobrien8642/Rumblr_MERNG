import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
const { FETCH_USER_FOLLOWING } = Queries;
const { UNFOLLOW_USER, FOLLOW_USER } = Mutations;

const UserFollowingFeed = () => {
  let [followed, setFollowed] = useState(true)
  let { loading, error, data, refetch } = useQuery(FETCH_USER_FOLLOWING, {
    variables: {
      blogName: Cookies.get('currentUser')
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

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

  const { user } = data;

  return(
    <div>
      {user.userFollowing.map((user, i) => {
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

export default UserFollowingFeed;