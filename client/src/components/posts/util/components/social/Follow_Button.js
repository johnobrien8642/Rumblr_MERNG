import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../../../graphql/mutations';
const { FOLLOW, UNFOLLOW } = Mutations;

const FollowButton = ({ user, tag, follow }) => {
  
  var initial;
  var TagOrUser;
  var itemKind;
  var followId = useRef('')

  if (user) {
    if (follow) {
      initial = true
      followId.current = follow._id
    } else {
      initial = false
    }
    TagOrUser = user.blogName
    itemKind = user.kind
  } else if (tag) {
    if (follow) {
      initial = true
      followId.current = follow._id
    } else {
      initial = false
    }
    TagOrUser = tag._id
    itemKind = tag.kind
  }

  let [status, setStatus] = useState(initial)

  let [followUser] = useMutation(FOLLOW, {
    onCompleted({ follow }) {
      followId.current = follow._id
    },
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
                followId: followId.current
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