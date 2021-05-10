import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../../../graphql/mutations';
const { FOLLOW, UNFOLLOW } = Mutations;

const FollowButton = ({ user, tag, followed }) => {
  
  var initial;
  var tagOrUser;
  var itemKind;
  var followId = useRef('')
  
  if (user) {
    if (followed) {
      initial = true
      followId.current = followed._id
    } else {
      initial = false
    }
    tagOrUser = user._id
    itemKind = user.kind
  } else if (tag) {
    if (followed) {
      initial = true
      followId.current = followed._id
    } else {
      initial = false
    }
    tagOrUser = tag._id
    itemKind = tag.kind
  }

  let [status, setStatus] = useState(initial)

  let [follow] = useMutation(FOLLOW, {
    onCompleted({ follow }) {
      followId.current = follow._id
    },
    onError(error) {
      console.log(error.message)
    }
  });

  let [unfollow] = useMutation(UNFOLLOW, {
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
            unfollow({
              variables: {
                user: Cookies.get('currentUser'),
                followId: followId.current,
                item: tagOrUser
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
            follow({
              variables: {
                user: Cookies.get('currentUser'),
                item: tagOrUser,
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