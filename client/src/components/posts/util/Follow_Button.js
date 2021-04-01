import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../graphql/mutations';
const { FOLLOW_USER, UNFOLLOW_USER } = Mutations;

const FollowButton = ({ user, tag, followed, setActive, active }) => {
  var initial;
  var input1;

  if (user) {
    initial = followed ? true : false
    input1 = user.blogName
  } else if (tag) {
    initial = followed ? true : false
    // input1 = 
  }

  let [status, setStatus] = useState(initial)

  let [followUser] = useMutation(FOLLOW_USER, {
    onError(error) {
      console.log(error.message)
    }
  });

  let [unfollowUser] = useMutation(UNFOLLOW_USER, {
    onError(error) {
      console.log(error.message)
    }
  });

  if (status) {
    return (
      <React.Fragment>
        <form
          onSubmit={e => {
            e.preventDefault();
            unfollowUser({
              variables: {
                currentUser: Cookies.get('currentUser'),
                user: input1
              }
            })
            setStatus(status = false)
          }}
        >
          <button type='submit'>Unfollow</button>
        </form>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <form
          onSubmit={e => {
            e.preventDefault();
            followUser({
              variables: {
                currentUser: Cookies.get('currentUser'),
                user: input1
              }
            })
            setStatus(status = true)
          }}
        >
          <button type='submit'>Follow</button>
        </form>
      </React.Fragment>
    )
  }
}

export default FollowButton;