import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../../graphql/mutations';
const { FOLLOW, UNFOLLOW } = Mutations;

const FollowButton = ({ user, tag, followed }) => {
  var initial;
  var TagOrUser;
  var itemKind;

  if (user) {
    initial = followed ? true : false
    TagOrUser = user.blogName
    itemKind = user.kind
  } else if (tag) {
    initial = followed ? true : false
    TagOrUser = tag._id
    itemKind = tag.kind
  }

  let [status, setStatus] = useState(initial)

  let [followUser] = useMutation(FOLLOW, {
    onError(error) {
      console.log(error.message)
    }
  });

  let [unfollowUser] = useMutation(UNFOLLOW, {
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
                // user: input1
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
                user: Cookies.get('currentUser'),
                item: TagOrUser,
                itemKind: itemKind
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